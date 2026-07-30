/**
 * Steht jeder fremde Host im Verzeichnis – und lädt keiner zu früh?
 *
 * ── Warum es diese Prüfung gibt ─────────────────────────────────────────
 *
 * `src/data/dienste.ts` ist das Verzeichnis, und `Drittinhalt.astro` bricht
 * beim Bauen ab, wenn ein Dienst darin fehlt. Das schützt den Weg über diesen
 * Baustein. Es schützt nicht davor, dass jemand in sechs Monaten ein
 * `<script src="https://irgendwo/analytics.js">` direkt in eine Seite
 * schreibt – oder ein `<img src>` auf einen fremden Server, was für die
 * Datenübertragung dasselbe bedeutet.
 *
 * Diese Prüfung liest deshalb das Ergebnis, nicht die Absicht: Sie sucht im
 * gebauten HTML jede Adresse, die auf einen fremden Host zeigt, und verlangt
 * einen Verzeichniseintrag für jeden, der lädt oder zum Laden vorgemerkt ist.
 * Für einen blossen Verweis nicht – Begründung unten bei `brauchtEintrag`.
 *
 * ── Zwei verschiedene Fragen ────────────────────────────────────────────
 *
 * 1. STEHT ER IM VERZEICHNIS? Ein fremder Host ohne Eintrag fehlt in der
 *    Datenschutzerklärung und im Auswahldialog. Das ist der Abbruchgrund.
 *
 * 2. LÄDT ER VON SELBST? Ein Verweis (`<a href>`) auf Doctolib überträgt
 *    nichts, solange niemand klickt – der ist immer in Ordnung. Ein
 *    `<script src>`, `<img src>`, `<link href>` oder `<iframe src>` lädt beim
 *    Seitenaufruf, ohne dass jemand zugestimmt hat. Das ist der zweite
 *    Abbruchgrund, und er ist der wichtigere: Er ist der Unterschied
 *    zwischen „wir fragen" und „wir fragen, nachdem es passiert ist".
 *
 * Deshalb werden `<a href>` und `<form action>` ausgenommen und alles
 * andere geprüft.
 *
 * ── Und die Gegenprobe ──────────────────────────────────────────────────
 *
 * Ein `<iframe>` mit gesetzter `src` darf im HTML überhaupt nicht vorkommen,
 * auch nicht mit `hidden` oder `loading="lazy"`. Beides verhindert das Laden
 * nicht zuverlässig – `hidden` gar nicht, `lazy` nur, solange es außerhalb
 * des Sichtfelds liegt. `Drittinhalt.astro` erzeugt den Rahmen deshalb erst
 * im Moment der Freigabe; wenn hier einer auftaucht, ist diese Regel
 * gebrochen.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   npm run build && npm run dienste:pruefen
 */

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const WURZEL = path.resolve(import.meta.dirname, '..');
const DIST = path.join(WURZEL, 'dist', 'client');

if (!existsSync(DIST)) {
  console.error('[dienste] dist/client fehlt – bitte zuerst bauen.');
  process.exit(1);
}

const { DIENSTE } = await import(pathToFileURL(path.join(WURZEL, 'src/data/dienste.ts')).href);

/**
 * Host → Dienst.
 *
 * Die Hosts stehen nicht als Feld im Verzeichnis, sondern werden hier
 * zugeordnet. Das ist Absicht: Ein Feld `hosts` im Verzeichnis würde
 * versprechen, vollständig zu sein, und wäre es beim ersten Anbieter nicht
 * mehr, der einen zweiten Auslieferungshost benutzt. Diese Tabelle darf
 * unvollständig sein – dann meldet die Prüfung einen unbekannten Host, und
 * das ist genau das gewünschte Verhalten.
 */
const HOST_ZU_DIENST = new Map([
  ['www.googletagmanager.com', 'google-analytics'],
  ['www.google-analytics.com', 'google-analytics'],
  ['region1.google-analytics.com', 'google-analytics'],
  ['www.google.com', 'google-maps'],
  ['maps.google.com', 'google-maps'],
  ['maps.googleapis.com', 'google-maps'],
  ['my.matterport.com', 'matterport'],
  ['static.matterport.com', 'matterport'],
  ['www.doctolib.de', 'doctolib'],
  ['ku64.jobs.personio.de', 'personio'],
  ['api.elevenlabs.io', 'elevenlabs'],
  ['api.anthropic.com', 'claude'],
]);

/** Eigene Hosts – die sind kein Drittanbieter. */
const EIGEN = [
  /^ku64\.de$/,
  /^www\.ku64\.de$/,
  /\.up\.railway\.app$/,
  /^localhost$/,
  /^127\.0\.0\.1$/,
];

/*
 * Adressen, die keine Verbindung aufbauen.
 *
 * `schema.org` steht in strukturierten Daten als Bezeichner, nicht als
 * Ladeadresse – niemand ruft sie ab. `w3.org` steht in SVG-Namensräumen.
 * Beides gehört nicht in ein Dienstverzeichnis, weil dort nichts passiert.
 */
const KEIN_ABRUF = [/^schema\.org$/, /^www\.w3\.org$/, /^creativecommons\.org$/];

const istEigen = (h) => EIGEN.some((m) => m.test(h));
const keinAbruf = (h) => KEIN_ABRUF.some((m) => m.test(h));

async function seiten(ordner, treffer = []) {
  for (const eintrag of await readdir(ordner, { withFileTypes: true })) {
    const voll = path.join(ordner, eintrag.name);
    if (eintrag.isDirectory()) await seiten(voll, treffer);
    else if (eintrag.name.endsWith('.html')) treffer.push(voll);
  }
  return treffer;
}

const dateien = await seiten(DIST);

/* Attribute, die beim Seitenaufruf laden. `a href` und `form action` fehlen
   hier bewusst – siehe Kopfkommentar. */
const LADEND = /(?:\bsrc|\bsrcset|\bposter|\bdata-adresse)\s*=\s*["']([^"']+)["']/gi;
const LINK_HREF = /<link\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi;
const A_HREF = /<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi;

const ladend = new Map(); // host → { seiten:Set, beispiel }
const verwiesen = new Map(); // Verweise UND vorgemerkte Adressen
const nurVorgemerkt = new Set(); // Hosts aus data-adresse – warten auf Freigabe
const iframes = [];

function merken(karte, host, seite, adresse) {
  if (!karte.has(host)) karte.set(host, { seiten: new Set(), beispiel: adresse });
  karte.get(host).seiten.add(seite);
}

function hostVon(adresse) {
  if (!/^https?:\/\//i.test(adresse)) return null;
  try {
    return new URL(adresse).hostname.toLowerCase();
  } catch {
    return null;
  }
}

for (const datei of dateien) {
  const html = await readFile(datei, 'utf8');
  const seite = '/' + path.relative(DIST, datei).replace(/index\.html$/, '').replace(/\\/g, '/');

  /*
   * Skript- und Stilkörper herausnehmen, bevor nach Attributen gesucht wird.
   *
   * Der erste Lauf meldete googletagmanager.com auf allen 1507 Seiten als
   * „lädt von selbst". Das war falsch, und der Fehler steckte hier: In
   * `Einwilligung.astro` steht die Adresse als Zeichenkette IM Skript –
   *
   *     s.src = 'https://www.googletagmanager.com/gtag/js?id=' + kennung;
   *
   * – und das Muster für `src="…"` trifft `src = '…'` in JavaScript genauso.
   * Ein Fund, der aussieht wie ein Ladevorgang, aber eine Zuweisung ist, die
   * erst nach der Zustimmung läuft.
   *
   * Das eigene `src`-Attribut eines `<script>`-Tags bleibt erhalten: entfernt
   * wird nur, was ZWISCHEN öffnendem und schließendem Tag steht.
   */
  const ohneKoerper = html.replace(
    /(<(script|style)\b[^>]*>)[\s\S]*?(<\/\2>)/gi,
    (_, auf, tag, zu) => `${auf}${zu}`,
  );

  /* Ein `iframe` mit `src` im ausgelieferten HTML ist ein Fehler, ganz
     unabhängig davon, welcher Host darin steht. */
  for (const m of ohneKoerper.matchAll(/<iframe\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi)) {
    iframes.push({ seite, adresse: m[1] });
  }

  /* `data-adresse` ist das Feld, in dem Drittinhalt.astro die noch NICHT
     geladene Adresse aufbewahrt. Sie zählt nicht als ladend – aber ihr Host
     muss im Verzeichnis stehen. Deshalb getrennt behandelt. */
  for (const m of ohneKoerper.matchAll(LADEND)) {
    const istVorgemerkt = /data-adresse/i.test(m[0]);
    for (const teil of m[1].split(',')) {
      const host = hostVon(teil.trim().split(/\s+/)[0]);
      if (!host || istEigen(host) || keinAbruf(host)) continue;
      merken(istVorgemerkt ? verwiesen : ladend, host, seite, m[1]);
      if (istVorgemerkt) nurVorgemerkt.add(host);
    }
  }

  for (const m of ohneKoerper.matchAll(LINK_HREF)) {
    /* `rel="alternate"`/`canonical` sind Angaben, keine Ladeadressen. */
    if (/rel\s*=\s*["'](?:alternate|canonical|me)["']/i.test(m[0])) continue;
    const host = hostVon(m[1]);
    if (!host || istEigen(host) || keinAbruf(host)) continue;
    merken(ladend, host, seite, m[1]);
  }

  for (const m of ohneKoerper.matchAll(A_HREF)) {
    const host = hostVon(m[1]);
    if (!host || istEigen(host) || keinAbruf(host)) continue;
    merken(verwiesen, host, seite, m[1]);
  }
}

/* ── Bewerten ────────────────────────────────────────────────────────── */

const fehler = [];

/*
 * Ein Verweis ist kein Dienst.
 *
 * Der erste Lauf verlangte auch für `www.openstreetmap.org` einen
 * Verzeichniseintrag – dort steht ein `<a href>` auf die Karte. Das ist
 * falsch gedacht: Ein Verweis überträgt nichts, solange niemand klickt, und
 * wer klickt, verlässt die Website sichtbar. Würde jeder ausgehende Verweis
 * einen Eintrag brauchen, stünde im Cookie-Verzeichnis irgendwann jede
 * Fachgesellschaft und jeder Zulieferer – und niemand fände darin mehr die
 * drei Dienste, um die es wirklich geht.
 *
 * Einen Eintrag brauchen deshalb nur Hosts, die
 *   - in einem ladenden Attribut stehen (dann ist es ohnehin ein Fehler), oder
 *   - in `data-adresse` vorgemerkt sind, also für eine Einbettung bereitstehen.
 */
const brauchtEintrag = new Set([...ladend.keys(), ...verwiesen.keys()].filter((h) => nurVorgemerkt.has(h) || ladend.has(h)));

for (const host of brauchtEintrag) {
  const slug = HOST_ZU_DIENST.get(host);
  const dienst = slug ? DIENSTE.find((d) => d.slug === slug) : undefined;

  if (!dienst) {
    const wo = ladend.get(host) ?? verwiesen.get(host);
    fehler.push({
      art: 'unbekannt',
      host,
      seiten: wo.seiten.size,
      beispiel: wo.beispiel,
    });
    continue;
  }

  if (ladend.has(host)) {
    const wo = ladend.get(host);
    fehler.push({
      art: 'laedt-von-selbst',
      host,
      dienst: dienst.name,
      kategorie: dienst.kategorie,
      seiten: wo.seiten.size,
      beispiel: wo.beispiel,
      beispielSeite: [...wo.seiten][0],
    });
  }

  if (dienst.stand === 'verworfen') {
    const wo = ladend.get(host) ?? verwiesen.get(host);
    fehler.push({
      art: 'verworfen-aber-vorhanden',
      host,
      dienst: dienst.name,
      seiten: wo.seiten.size,
      beispiel: wo.beispiel,
    });
  }
}

for (const f of iframes) {
  fehler.push({ art: 'iframe-mit-src', host: hostVon(f.adresse) ?? '(relativ)', seiten: 1, beispiel: f.adresse, beispielSeite: f.seite });
}

/* ── Ergebnis ────────────────────────────────────────────────────────── */

console.log(
  `[dienste] ${dateien.length} Seiten geprüft\n` +
    `          ${ladend.size} fremde Host(s) in ladenden Attributen\n` +
    `          ${verwiesen.size} fremde Host(s) nur als Verweis oder vorgemerkt\n` +
    `          ${DIENSTE.filter((d) => d.stand === 'aktiv').length} Dienst(e) im Verzeichnis auf „aktiv"`,
);

if (verwiesen.size) {
  console.log('\n          Verweise und vorgemerkte Adressen (laden nicht von selbst):');
  for (const [host, wo] of [...verwiesen.entries()].sort((a, z) => z[1].seiten.size - a[1].seiten.size)) {
    const slug = HOST_ZU_DIENST.get(host);
    const art = nurVorgemerkt.has(host) ? 'vorgemerkt' : 'nur Verweis';
    console.log(
      `            ${host.padEnd(30)} ${String(wo.seiten.size).padStart(5)} Seite(n)  ` +
        `${art.padEnd(12)} ${slug ?? '(kein Eintrag nötig)'}`,
    );
  }
}

if (fehler.length === 0) {
  console.log(
    '\n[dienste] In Ordnung: Jeder fremde Host steht im Verzeichnis, keiner lädt\n' +
      '          beim Seitenaufruf, und kein <iframe> trägt eine src.',
  );
  process.exit(0);
}

const TEXT = {
  unbekannt:
    'Host steht in KEINEM Eintrag von src/data/dienste.ts. Damit fehlt er in der\n' +
    '      Datenschutzerklärung, auf /cookies/ und im Auswahldialog.',
  'laedt-von-selbst':
    'Wird beim Seitenaufruf geladen, ohne Einwilligung. Das gehört durch\n' +
    '      Drittinhalt.astro oder laden() aus src/lib/einwilligung.ts.',
  'verworfen-aber-vorhanden':
    'Steht im Verzeichnis als „verworfen" – und ist trotzdem in der Seite.\n' +
    '      Entweder entfernen oder den Eintrag auf „aktiv" setzen und\n' +
    '      VERZEICHNIS_FASSUNG hochzählen.',
  'iframe-mit-src':
    'Ein <iframe> mit gesetzter src steht im ausgelieferten HTML und lädt damit.\n' +
    '      `hidden` verhindert das nicht, `loading="lazy"` nur manchmal. Der Rahmen\n' +
    '      gehört erst im Moment der Freigabe in den DOM.',
};

console.error(`\n[dienste] ${fehler.length} Befund(e):`);
for (const f of fehler) {
  console.error(`\n    ${f.host}${f.dienst ? ` (${f.dienst})` : ''} – auf ${f.seiten} Seite(n)`);
  console.error(`      ${TEXT[f.art]}`);
  console.error(`      Beispiel: ${String(f.beispiel).slice(0, 110)}`);
  if (f.beispielSeite) console.error(`      auf:      ${f.beispielSeite}`);
}

console.error(
  '\n[dienste] ABBRUCH: Diese Website sagt ihren Besucherinnen zu, beim\n' +
    '          Seitenaufruf keine Verbindung zu Dritten aufzubauen. Diese Zusage\n' +
    '          steht in der Datenschutzerklärung und im Bericht an die Praxis.\n' +
    '          Sie hält nur, solange dieser Lauf grün ist.',
);
process.exit(1);
