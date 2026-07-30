/**
 * Druckt „Stand, Vergleich und Prognose" über Chromium nach PDF.
 *
 * Aufruf:  node bericht/vergleich-pdf.mjs
 *          (setzt bericht/stand-und-vergleich.html voraus – erzeugt sie bei
 *           Bedarf selbst über bericht/vergleich-bauen.mjs)
 *
 * ── Warum der Browser und nicht eine PDF-Bibliothek ─────────────────────
 *
 * Dieselbe Überlegung wie bei bericht/pdf-erzeugen.mjs für den
 * Befundbericht: Die Gestaltung liegt als HTML vor, samt eingebetteter
 * Schrift. Ein Nachbau würde Typografie und Tabellensatz nur annähern.
 * Eigene Datei, weil dieser Bericht andere Ränder, eine andere Fußzeile und
 * ein Inhaltsverzeichnis hat, das auf Papier nicht mitgedruckt werden darf –
 * der Befundbericht bleibt davon unberührt.
 *
 * ── Die beiden Einstellungen, die nicht optional sind ───────────────────
 *
 *   emulateMedia({ colorScheme: 'light' })  – die Seite hat eine dunkle
 *     Fassung (prefers-color-scheme). Ohne die Erzwingung entscheidet die
 *     Systemeinstellung des Rechners, auf dem gedruckt wird, und das PDF
 *     kommt schwarz aus dem Drucker.
 *   printBackground: true                   – ohne das fehlen die weißen
 *     Tabellenflächen, die Rahmen und der gelbe Kapitelstrich.
 *
 * ── Was hier geprüft wird, statt es zu hoffen ──────────────────────────
 *
 * Ein PDF sieht auch dann fertig aus, wenn die Schrift fehlt, das
 * Inhaltsverzeichnis doppelt steht oder rechts eine Tabellenspalte
 * abgeschnitten ist. Deshalb prüft dieses Skript nach dem Druck am
 * erzeugten PDF selbst nach und bricht ab, wenn etwas nicht stimmt:
 * Seitenzahl, Link-Annotationen, Satzbreite der Tabellen, ausgeblendete
 * Schiene.
 */

import { chromium } from 'playwright';
import path from 'node:path';
import { readFile, stat, access } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { inflateSync } from 'node:zlib';

const HIER = import.meta.dirname;
const WURZEL = path.resolve(HIER, '..');
const quelle = path.join(HIER, 'stand-und-vergleich.html');
const ziel = path.join(HIER, 'KU64-Stand-und-Vergleich.pdf');
const TITEL = 'KU64 – Stand, Vergleich und Prognose';

/* ── Papier ───────────────────────────────────────────────────────────────
 *
 * A4. Die Ränder sind nicht frei gewählt: 15 mm links und rechts lassen
 * 180 mm Satzspiegel, das sind 680 px, und keine der Tabellen braucht mehr
 * (die breiteste kommt auf 638 px). Unten 18 mm, weil dort die Fußzeile
 * steht. Ob die Rechnung stimmt, wird unten nachgemessen, nicht geglaubt.
 */
const PAPIER = {
  format: 'A4',
  margin: { top: '16mm', right: '15mm', bottom: '18mm', left: '15mm' },
};
const SATZBREITE_PX = 680; // 210 mm − 2 × 15 mm, bei 96 dpi

// Das Erhebungsdatum für die Fußzeile aus der Quelle ziehen, damit es nicht
// zweimal gepflegt werden muss. Der Punkt im Datum gehört zur Ordnungszahl –
// deshalb wird das Datum als Ganzes gelesen, nicht „bis zum ersten Punkt".
const erhoben = /Erhoben am (\d{1,2}\.\s*\S+\s*\d{4})/.exec(
  await readFile(path.join(WURZEL, 'STAND-UND-VERGLEICH.md'), 'utf8').catch(() => ''),
)?.[1];

/* ── Quelle ──────────────────────────────────────────────────────────── */

try {
  await access(quelle);
} catch {
  console.log('[pdf] stand-und-vergleich.html fehlt – wird gebaut.');
  await promisify(execFile)(process.execPath, [path.join(HIER, 'vergleich-bauen.mjs')], { cwd: WURZEL });
}

/* ── Drucken ─────────────────────────────────────────────────────────── */

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PFAD || '/opt/pw-browsers/chromium',
});

// Das Fenster auf die Satzbreite des Papiers stellen. Für den Druck selbst
// ist das gleichgültig – Chromium setzt für page.pdf() neu um –, aber alle
// Messungen unten laufen dann im Layout, das auch das PDF bekommt.
const seite = await browser.newPage({ viewport: { width: SATZBREITE_PX, height: 1000 } });
await seite.goto(`file://${quelle}`, { waitUntil: 'networkidle' });
await seite.emulateMedia({ media: 'print', colorScheme: 'light' });

// Sonst druckt Chromium stillschweigend die Ersatzschrift.
await seite.evaluate(() => document.fonts.ready);
if (!(await seite.evaluate(() => document.fonts.check('700 1rem "Inter Bericht"')))) {
  throw new Error('Die eingebettete Schrift greift nicht – Druck abgebrochen.');
}

/*
 * Adressen im Text anklickbar machen.
 *
 * Der Bericht entsteht aus Markdown ohne Verweissyntax; absolute Adressen
 * stehen darin als Text in Auszeichnungsschrift. Auf dem Schirm ist das
 * hinnehmbar, im PDF nicht: Eine Adresse, die man nicht anklicken kann,
 * muss abgetippt werden. Die Umwandlung greift nur bei vollständigen
 * http(s)-Adressen und nur außerhalb von Codeblöcken, ändert den sichtbaren
 * Text nicht und läuft im Speicher – die HTML-Datei bleibt, wie sie ist.
 */
const verlinkt = await seite.evaluate(() => {
  let n = 0;
  for (const code of document.querySelectorAll('main code')) {
    if (code.closest('pre') || code.querySelector('a')) continue;
    const adresse = code.textContent.trim();
    if (!/^https?:\/\/\S+$/.test(adresse)) continue;
    const a = document.createElement('a');
    a.href = adresse;
    a.textContent = code.textContent;
    code.replaceChildren(a);
    n++;
  }
  return n;
});

/*
 * Kopfzeile bleibt leer, die Fußzeile trägt Titel und Seitenzahl. Chromium
 * rendert diese Vorlagen in einem eigenen Dokument ohne die Stile der
 * Seite – Schrift und Farbe müssen also hier stehen. 7,5 pt, damit die
 * Fußzeile in die 18 mm passt, ohne den Satz zu berühren.
 */
const fusszeile = `
  <div style="width:100%;padding:0 15mm;font-family:sans-serif;font-size:7.5pt;
              color:#6f6f67;display:flex;justify-content:space-between;">
    <span>${TITEL}${erhoben ? ` · ${erhoben}` : ''}</span>
    <span>Seite <span class="pageNumber"></span> von <span class="totalPages"></span></span>
  </div>`;

await seite.pdf({
  path: ziel,
  ...PAPIER,
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: '<span></span>',
  footerTemplate: fusszeile,
  // Die Schiene ist im Druck ausgeblendet, damit das Inhaltsverzeichnis
  // nicht zweimal im Dokument steht. Als Ersatz für die verlorene
  // Sprungnavigation bekommt das PDF Lesezeichen aus den Überschriften.
  outline: true,
  tagged: true,
});

/* ── Nachmessen im Layout, das gedruckt wurde ────────────────────────── */

const layout = await seite.evaluate(() => {
  const schiene = document.querySelector('.rail');
  const satz = document.querySelector('main').clientWidth;
  const tabellen = [...document.querySelectorAll('.tabelle')];
  return {
    schieneDisplay: getComputedStyle(schiene).display,
    schieneKaesten: schiene.getClientRects().length,
    satz,
    tabellen: tabellen.length,
    zuBreit: tabellen
      .map((d) => Math.round(d.querySelector('table').scrollWidth))
      .filter((b) => b > satz + 1).length,
    breiteste: Math.max(...tabellen.map((d) => Math.round(d.querySelector('table').scrollWidth))),
    // Verweise, die im Druck tatsächlich einen Kasten aufspannen – nur die
    // können im PDF als Annotation landen.
    verweiseGedruckt: [...document.querySelectorAll('a[href]')].filter((a) => a.getClientRects().length)
      .length,
    verweiseSchiene: document.querySelectorAll('.rail a[href]').length,
  };
});

await browser.close();

if (layout.schieneDisplay !== 'none' || layout.schieneKaesten !== 0) {
  throw new Error(
    `@media print { .rail { display: none } } greift nicht (display: ${layout.schieneDisplay}) – ` +
      'das Inhaltsverzeichnis stünde zweimal im PDF.',
  );
}
if (layout.zuBreit > 0) {
  throw new Error(
    `${layout.zuBreit} Tabelle(n) breiter als der Satzspiegel (${layout.breiteste} > ${layout.satz} px) – ` +
      'sie würden rechts angeschnitten. Ränder verkleinern oder Spalten kürzen.',
  );
}

/* ── Nachmessen im PDF selbst ────────────────────────────────────────────
 *
 * Kein pdfinfo/pdftotext im Bild, also von Hand: Chromium schreibt die
 * Objektwörterbücher unkomprimiert, Seitenbaum und Annotationen stehen im
 * Rohtext. Die Inhaltsströme sind Flate-gepackt und werden für die Suche
 * zusätzlich entpackt.
 */
function pdfLesen(roh) {
  const txt = roh.toString('latin1');

  let entpackt = '';
  const strom = /stream\r?\n/g;
  let m;
  while ((m = strom.exec(txt))) {
    const anfang = m.index + m[0].length;
    const ende = txt.indexOf('endstream', anfang);
    if (ende < 0) continue;
    try {
      entpackt += inflateSync(roh.subarray(anfang, ende)).toString('latin1');
    } catch {
      /* unkomprimiert oder anders gefiltert – für die Suche unerheblich */
    }
  }

  // Seitenzahl über den Wurzelknoten: /Root → /Pages → /Count. Nicht über
  // das erste /Count im Datenstrom – das gehört zu den Lesezeichen.
  const wurzel = /\/Type\s*\/Catalog[\s\S]{0,400}?\/Pages\s+(\d+)\s+0\s+R/.exec(txt);
  const knoten = wurzel && new RegExp(`(?:^|[^0-9])${wurzel[1]} 0 obj([\\s\\S]{0,600}?)endobj`).exec(txt);
  const ausWurzel = knoten && /\/Count\s+(\d+)/.exec(knoten[1]);

  /*
   * Sprungziele. Chromium legt für jede angesprungene Überschrift eine
   * benannte Marke ab: /name [Seite 0 R /XYZ links oben 0]. Das „oben" ist
   * die Höhe der Überschrift im Seitenkoordinatensystem, gemessen von der
   * Unterkante – damit lässt sich am fertigen PDF nachsehen, ob eine
   * Kapitelüberschrift als letzte Zeile einer Seite steht. Wäre sie das,
   * läge ihr Wert knapp über dem Fußsteg.
   */
  const dests = /\/Dests\s+(\d+)\s+0\s+R/.exec(txt);
  const destObj =
    dests && new RegExp(`(?:^|[^0-9])${dests[1]} 0 obj([\\s\\S]*?)endobj`).exec(txt);
  const marken = destObj
    ? [...destObj[1].matchAll(/\/([^\s/]+)\s+\[\s*\d+ 0 R\s*\/XYZ\s+[\d.-]+\s+([\d.-]+)/g)].map((m) => ({
        ziel: m[1],
        oben: Number(m[2]),
      }))
    : [];

  const zaehl = (s, n) => (s.match(n) || []).length;
  return {
    marken,
    seiten: ausWurzel ? Number(ausWurzel[1]) : null,
    seitenobjekte: zaehl(txt, /\/Type\s*\/Page[^s]/g),
    mediaBoxen: zaehl(txt, /\/MediaBox/g),
    linkAnnotationen: zaehl(txt, /\/Subtype\s*\/Link/g),
    uri: zaehl(txt, /\/URI/g) + zaehl(entpackt, /\/URI/g),
    lesezeichen: /\/Outlines\s+(\d+)\s+0\s+R/.test(txt) || /\/Type\s*\/Outlines/.test(txt),
    markiert: /\/Marked\s+true/.test(txt),
  };
}

const roh = await readFile(ziel);
const pdf = pdfLesen(roh);
const kb = roh.length / 1024;

if (pdf.seiten !== pdf.mediaBoxen) {
  throw new Error(`Seitenzahl unklar: /Count ${pdf.seiten}, aber ${pdf.mediaBoxen} MediaBoxen.`);
}
if (pdf.uri < 1 || pdf.linkAnnotationen < 1) {
  throw new Error(
    'Keine Link-Annotationen im PDF – die Verweise sind beim Druck verloren gegangen ' +
      `(${verlinkt} Adresse(n) verlinkt, ${layout.verweiseGedruckt} Verweis(e) im Drucklayout).`,
  );
}
if (pdf.linkAnnotationen < layout.verweiseGedruckt) {
  throw new Error(
    `${layout.verweiseGedruckt} Verweise im Drucklayout, aber nur ${pdf.linkAnnotationen} ` +
      'Annotationen im PDF – es sind Verweise verloren gegangen.',
  );
}

/*
 * Keine Kapitelüberschrift als letzte Zeile einer Seite. Der Fußsteg endet
 * bei 18 mm ≈ 51 pt; unter 110 pt bliebe unter einer Überschrift kein
 * ganzer Absatz mehr Platz. Geprüft wird an den Sprungzielen des fertigen
 * PDF, nicht an der CSS-Absicht.
 */
const FUSSSTEG_PT = 110;
const tiefe = pdf.marken.filter((m) => m.oben > 0 && m.oben < FUSSSTEG_PT);
if (tiefe.length) {
  throw new Error(
    `Überschrift(en) am Seitenfuß: ${tiefe.map((m) => `${m.ziel} (${m.oben} pt)`).join(', ')} – ` +
      'break-after: avoid greift dort nicht.',
  );
}

console.log(`[pdf] ${path.basename(ziel)} – ${pdf.seiten} Seiten, ${kb.toFixed(0)} KB`);
console.log(
  `[pdf] Satzspiegel ${layout.satz} px, breiteste von ${layout.tabellen} Tabellen ${layout.breiteste} px – nichts angeschnitten`,
);
console.log(
  `[pdf] Inhaltsverzeichnis: ${layout.verweiseSchiene} Einträge der Schiene im Druck ausgeblendet, ` +
    `Lesezeichen im PDF: ${pdf.lesezeichen ? 'ja' : 'nein'}`,
);
console.log(
  `[pdf] Verweise: ${verlinkt} Adresse(n) verlinkt, ${pdf.linkAnnotationen} Link-Annotation(en), ` +
    `${pdf.uri} × /URI, PDF getaggt: ${pdf.markiert ? 'ja' : 'nein'}`,
);
console.log(
  `[pdf] Umbruch: ${pdf.marken.length} Kapitelüberschriften geprüft, tiefste bei ` +
    `${Math.min(...pdf.marken.map((m) => m.oben)).toFixed(0)} pt über der Blattkante ` +
    `(Grenze ${FUSSSTEG_PT} pt) – keine steht als letzte Zeile`,
);
