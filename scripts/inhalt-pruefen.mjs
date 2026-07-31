/**
 * Ist noch so viel Text da wie auf der alten Website?
 *
 * ── Warum es diese Prüfung gibt ─────────────────────────────────────────
 *
 * Der Textbestand der Behandlungsseiten war einmal von 117.595 auf 18.444
 * Wörter gefallen – 84 Prozent weg. Nicht durch einen Fehler, sondern durch
 * eine Reihe einzeln vernünftiger Entscheidungen: neu schreiben statt
 * übernehmen, zusammenfassen statt aufteilen, kürzen statt ausufern. Keine
 * dieser Entscheidungen sah wie ein Verlust aus. Zusammen waren sie einer.
 *
 * Genau deshalb kann kein Kommentar und keine Absprache das verhindern. Es
 * braucht eine Zahl, die widerspricht.
 *
 * Diese Prüfung hält den Bestand gegen den gemessenen Altbestand. Fällt er
 * darunter, bricht der Bau ab – und zwar mit der alten Zahl daneben, damit
 * sichtbar ist, worum es geht.
 *
 * ── Die drei Fragen ─────────────────────────────────────────────────────
 *
 * 1. IST DIE QUELLE DA? `src/inhalte/langtexte.json` ist erzeugt und liegt
 *    im Repository. Wer sie löscht oder ein leeres Gerüst einträgt, nimmt
 *    114.894 Wörter aus der Website, ohne dass eine einzige Datei kaputt
 *    aussieht: Jede Seite baut weiter, sie ist nur kürzer.
 *
 * 2. STEHT DER TEXT AUCH IN DEN SEITEN? Eine gefüllte JSON-Datei nützt
 *    nichts, wenn niemand sie einbindet. Gemessen wird deshalb am Ergebnis:
 *    im `<main>` der gebauten Seiten.
 *
 * 3. HAT JEDES UNTERTHEMA SEINE BEHANDLUNG? Ein Unterthema, dessen
 *    Behandlung aus dem Katalog genommen wurde, erzeugt keine Seite mehr –
 *    sein Text ist dann still verschwunden. Die Weiterleitung zeigt weiter
 *    dorthin und läuft ins Leere.
 *
 * ── Warum die Untergrenze nicht knapp gesetzt ist ───────────────────────
 *
 * Die Grenze liegt beim gemessenen Altbestand, nicht bei „ungefähr so viel".
 * Der Anspruch ist, in jedem Punkt besser zu sein als vorher; eine Grenze
 * darunter würde das Gegenteil festschreiben.
 *
 * Nach oben gibt es keine Grenze. Mehr Text ist kein Fehler.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   npm run build && npm run inhalt:pruefen
 */

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const WURZEL = path.resolve(import.meta.dirname, '..');
const DIST = path.join(WURZEL, 'dist', 'client');

/*
 * Der Altbestand, gemessen am 30. Juli 2026 mit
 * `analyse/altbestand/texte-holen.mjs` – Hauptinhalt aus <main id="content">,
 * ohne Vorlagenblöcke.
 *
 * Diese Zahlen sind fest eingetragen und nicht zur Laufzeit geholt. Eine
 * Prüfung, die ihren Maßstab jedes Mal von ku64.de lädt, wäre wertlos, sobald
 * die alte Website abgeschaltet wird – und sie soll abgeschaltet werden.
 */
const ALT = {
  behandlungen: { seiten: 74, woerter: 117595 },
};

/*
 * Der wiederhergestellte Über-uns-Bestand, gemessen am bereinigten Korpus.
 *
 * Zehn Seiten mit zusammen 9.083 Wörtern eigenem Inhalt – die Galerie zählt
 * nicht mit, ihr Inhalt sind die Bilder. Der erste Neubau hatte davon null:
 * Neun Adressen leiteten auf `/ueber-uns/` weiter, und dort standen 862
 * neu geschriebene Wörter.
 *
 * Warum das eine eigene Prüfung braucht und nicht in der Behandlungssumme
 * mitläuft: Die Behandlungssumme kann steigen, während die zehn Belegseiten
 * verschwinden. Genau so ist es beim ersten Mal passiert – niemand hat es
 * gemerkt, weil die Gesamtzahl gut aussah.
 */
const UEBER_UNS_RESTAURIERT = 9083;
const UEBER_UNS_MINDESTENS = Math.floor(UEBER_UNS_RESTAURIERT * 0.95);

/** Wie viel Text mindestens in den kanonischen Behandlungsseiten stehen muss. */
const UNTERGRENZE = ALT.behandlungen.woerter;

/*
 * Was aus dem Altbestand wiederhergestellt wurde – gemessen, nicht gerundet.
 *
 * Diese Zahl ist NICHT mit der oben zu vergleichen, und der erste Entwurf hat
 * genau das getan: Er hielt die 114.894 Wörter der Quelldatei gegen die
 * 117.595 der alten Website und brach ab, obwohl die gebauten Seiten bei
 * 129.172 lagen.
 *
 * Der Denkfehler: `langtexte.json` enthält nur den ÜBERNOMMENEN Text. Was auf
 * einer Behandlungsseite zusätzlich steht – Teaser, Ablauf, Kosten,
 * Kassenangabe, häufige Fragen – ist im Neubau geschrieben und steht in
 * `leistungen.ts`. Die Quelldatei mit dem Gesamtbestand zu vergleichen heißt,
 * einen Teil gegen ein Ganzes zu halten.
 *
 * Also zwei verschiedene Prüfungen: Die Quelle wird gegen sich selbst geprüft
 * (ist noch da, was wiederhergestellt wurde), das Ergebnis gegen den
 * Altbestand.
 */
const RESTAURIERT = 114894;

/* Fünf Prozent Luft, damit eine bessere Zuordnung nicht als Verlust gilt:
   Wenn ein Vorlagenrest erkannt und entfernt wird, sinkt die Zahl – und das
   ist eine Verbesserung. Ein echter Verlust ist um Größenordnungen größer. */
const QUELLE_MINDESTENS = Math.floor(RESTAURIERT * 0.95);

const fehler = [];
const melden = (satz) => fehler.push(satz);

/* ── 1. Die Quelle ───────────────────────────────────────────────────── */

const QUELLE = path.join(WURZEL, 'src', 'inhalte', 'langtexte.json');

if (!existsSync(QUELLE)) {
  console.error(
    '[inhalt] ABBRUCH: src/inhalte/langtexte.json fehlt.\n' +
      '         Darin stehen 114.894 Wörter wiederhergestellter Originaltext.\n' +
      '         Neu erzeugen mit: node scripts/langtexte-bauen.mjs',
  );
  process.exit(1);
}

const lang = JSON.parse(await readFile(QUELLE, 'utf8'));

const summe = (o) => Object.values(o ?? {}).reduce((s, x) => s + (x.woerter ?? 0), 0);
const bestand = {
  hauptseiten: summe(lang.leistungen),
  unterthemen: summe(lang.unterthemen),
  kategorien: summe(lang.kategorien),
  neu: summe(lang.neu),
};
const quelleGesamt = Object.values(bestand).reduce((a, b) => a + b, 0);

/* Die Über-uns-Themen zählen NICHT in `quelleGesamt`: Diese Zahl wird unten
   gegen den Altbestand der BEHANDLUNGSseiten gehalten, und Auszeichnungen
   sind keine Behandlung. Zusammengezählt sähe der Bestand größer aus, als
   er an der Stelle ist, um die es geht. */
const themenBestand = summe(lang.themen);

if (quelleGesamt < QUELLE_MINDESTENS) {
  melden(
    `In langtexte.json stehen nur ${quelleGesamt.toLocaleString('de-DE')} Wörter. ` +
      `Wiederhergestellt waren ${RESTAURIERT.toLocaleString('de-DE')} – es fehlen ` +
      `${(RESTAURIERT - quelleGesamt).toLocaleString('de-DE')}. Neu erzeugen mit ` +
      `node scripts/langtexte-bauen.mjs, und wenn die Zahl danach noch fehlt, ist ` +
      `analyse/altbestand/texte.json unvollständig.`,
  );
}

/* Ein leerer Behälter ist kein Behälter. Vier Bereiche gehören besetzt; fehlt
   einer ganz, ist die Zuordnung kaputt und nicht nur dünn. */
for (const [name, wert] of [
  ['leistungen', bestand.hauptseiten],
  ['unterthemen', bestand.unterthemen],
  ['kategorien', bestand.kategorien],
]) {
  if (wert === 0) melden(`In langtexte.json ist der Bereich „${name}" leer.`);
}

/* ── 1b. Die zehn Belegseiten unter /ueber-uns/ ───────────────────────── */

if (themenBestand < UEBER_UNS_MINDESTENS) {
  melden(
    `Die Über-uns-Themen tragen nur ${themenBestand.toLocaleString('de-DE')} Wörter. ` +
      `Wiederhergestellt waren ${UEBER_UNS_RESTAURIERT.toLocaleString('de-DE')} auf zehn ` +
      `Seiten – Architektur, Auszeichnungen, Presse, Mitgliedschaften, Kooperationen, ` +
      `Engagement. Neu erzeugen mit node scripts/langtexte-bauen.mjs.`,
  );
}

/*
 * Jedes Thema aus `themen.ts` braucht auch eine Seite.
 *
 * Der Text kann vollständig in `langtexte.json` stehen und trotzdem
 * unerreichbar sein: Steht in `weiterleitungen.ts` noch ein Eintrag für
 * `/ueber-uns/auszeichnungen/`, hat die Weiterleitung in Astro Vorrang und
 * die Seite wird gar nicht erst gebaut. Genau das war beim ersten Bau so,
 * und die Datei war dabei die ganze Zeit korrekt.
 */
const { THEMEN, THEMEN_MIT_SEITE } = await import(
  pathToFileURL(path.join(WURZEL, 'src/data/themen.ts')).href
);

for (const th of THEMEN) {
  if (th.ohneLangtext) continue;
  const eintrag = lang.themen?.[th.slug];
  if (!eintrag || !eintrag.woerter) {
    melden(`Thema „${th.slug}" hat keinen Text in langtexte.json – Quelle war ${th.quelle}.`);
  }
}

const { LEISTUNGEN } = await import(pathToFileURL(path.join(WURZEL, 'src/data/leistungen.ts')).href);
const bekannt = new Set(LEISTUNGEN.map((l) => l.slug));

const waisen = Object.values(lang.unterthemen ?? {}).filter((u) => !bekannt.has(u.leistung));
for (const u of waisen) {
  melden(
    `Unterthema „${u.slug}" gehört zu „${u.leistung}" – diese Behandlung steht nicht in ` +
      `leistungen.ts. ${u.woerter} Wörter erzeugen keine Seite, und die Weiterleitung von ` +
      `${u.herkunft} läuft ins Leere.`,
  );
}

/* ── 3. Am Ergebnis messen ───────────────────────────────────────────── */

if (!existsSync(DIST)) {
  console.error('[inhalt] dist/client fehlt – bitte zuerst bauen.');
  process.exit(1);
}

async function seiten(ordner, treffer = []) {
  for (const eintrag of await readdir(ordner, { withFileTypes: true })) {
    const voll = path.join(ordner, eintrag.name);
    if (eintrag.isDirectory()) await seiten(voll, treffer);
    else if (eintrag.name.endsWith('.html')) treffer.push(voll);
  }
  return treffer;
}

/**
 * Wörter im Hauptbereich einer gebauten Seite.
 *
 * Nur `<main>`, ohne Skripte, Stile und SVG – dieselbe Regel, mit der der
 * Altbestand gemessen wurde. Zwei verschiedene Zählweisen zu vergleichen
 * ergibt eine Zahl, die nichts bedeutet.
 */
function woerter(html) {
  const i = html.search(/<main\b/i);
  const j = html.search(/<\/main>/i);
  if (i < 0 || j < 0) return 0;
  return html
    .slice(i, j)
    .replace(/<(script|style|noscript|svg)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

const dateien = await seiten(DIST);

/* Die kanonische Fassung: /leistungen/… ohne Standort und ohne Sprachpräfix.
   Sie ist die Seite, die Google bewertet – die fünf Standortfassungen zeigen
   mit ihrem Canonical hierher. */
const kanonisch = dateien.filter((f) => {
  const p = '/' + path.relative(DIST, f).replace(/\\/g, '/');
  return p.startsWith('/leistungen/');
});

let gebaut = 0;
const jeSeite = [];
for (const f of kanonisch) {
  const n = woerter(await readFile(f, 'utf8'));
  gebaut += n;
  jeSeite.push({ pfad: '/' + path.relative(DIST, f).replace(/index\.html$/, '').replace(/\\/g, '/'), n });
}

if (gebaut < UNTERGRENZE) {
  melden(
    `In den gebauten Behandlungsseiten stehen ${gebaut.toLocaleString('de-DE')} Wörter. ` +
      `Die alte Website hatte ${UNTERGRENZE.toLocaleString('de-DE')} auf ${ALT.behandlungen.seiten} Seiten.`,
  );
}

/*
 * Eine Seite mit fast nichts darauf.
 *
 * Die Gesamtsumme kann stimmen, während eine einzelne Behandlungsseite leer
 * ist – dann fehlt genau die eine, nach der jemand gesucht hat. 250 Wörter
 * sind der Vorlagenanteil einer Seite ohne eigenen Inhalt; darunter steht
 * praktisch nur das Gerüst.
 */
const duenn = jeSeite.filter((s) => s.n < 250).sort((a, z) => a.n - z.n);

/* ── 3b. Stehen die Über-uns-Seiten wirklich da? ──────────────────────── */

/* Die Übersicht zählt mit: Der Text von `/ueber-uns/` selbst ist einer der
   zehn wiederhergestellten – ihn wegzulassen hieße, elf Seiten gegen zehn zu
   halten und dabei eine davon zu unterschlagen. */
let ueberUnsGebaut = woerter(await readFile(path.join(DIST, 'ueber-uns', 'index.html'), 'utf8'));
for (const th of THEMEN_MIT_SEITE) {
  const datei = path.join(DIST, 'ueber-uns', th.slug, 'index.html');
  if (!existsSync(datei)) {
    melden(
      `/ueber-uns/${th.slug}/ ist nicht gebaut worden. Häufigste Ursache: In ` +
        `weiterleitungen.ts steht noch ein Eintrag mit dieser Adresse – eine Weiterleitung ` +
        `hat in Astro Vorrang vor einer echten Seite.`,
    );
    continue;
  }
  const n = woerter(await readFile(datei, 'utf8'));
  ueberUnsGebaut += n;
  /* 100 Wörter sind der Vorlagenanteil dieser Seiten (Überschrift, Anreißer,
     Verweisliste). Darunter steht nichts Eigenes mehr. */
  if (n < 100) melden(`/ueber-uns/${th.slug}/ hat nur ${n} Wörter im Hauptbereich.`);
}

/* ── Ergebnis ────────────────────────────────────────────────────────── */

console.log(
  `[inhalt] Quelle langtexte.json\n` +
    `           ${String(Object.keys(lang.leistungen ?? {}).length).padStart(3)} Hauptseiten     ${bestand.hauptseiten.toLocaleString('de-DE').padStart(8)}\n` +
    `           ${String(Object.keys(lang.unterthemen ?? {}).length).padStart(3)} Unterthemen     ${bestand.unterthemen.toLocaleString('de-DE').padStart(8)}\n` +
    `           ${String(Object.keys(lang.kategorien ?? {}).length).padStart(3)} Kategorietexte  ${bestand.kategorien.toLocaleString('de-DE').padStart(8)}\n` +
    `           ${''.padStart(3)}                 ${'—'.repeat(8)}\n` +
    `           ${''.padStart(3)}                 ${quelleGesamt.toLocaleString('de-DE').padStart(8)} Wörter\n` +
    `           ${String(Object.keys(lang.themen ?? {}).length).padStart(3)} Über uns        ${themenBestand.toLocaleString('de-DE').padStart(8)} Wörter (getrennt gezählt)`,
);

console.log(
  `\n[inhalt] Gebaut, kanonische Fassung\n` +
    `           alt  ${String(ALT.behandlungen.seiten).padStart(4)} Seiten  ${ALT.behandlungen.woerter.toLocaleString('de-DE').padStart(9)} Wörter\n` +
    `           neu  ${String(kanonisch.length).padStart(4)} Seiten  ${gebaut.toLocaleString('de-DE').padStart(9)} Wörter` +
    `   ${((gebaut / UNTERGRENZE) * 100).toFixed(1)} %`,
);

console.log(
  `\n[inhalt] Über uns\n` +
    `           alt    10 Seiten  ${UEBER_UNS_RESTAURIERT.toLocaleString('de-DE').padStart(9)} Wörter eigener Inhalt\n` +
    `           neu  ${String(THEMEN_MIT_SEITE.length + 1).padStart(4)} Seiten  ${ueberUnsGebaut.toLocaleString('de-DE').padStart(9)} Wörter gebaut` +
    `   ${((ueberUnsGebaut / UEBER_UNS_RESTAURIERT) * 100).toFixed(1)} %`,
);

if (ueberUnsGebaut < UEBER_UNS_RESTAURIERT) {
  melden(
    `In den gebauten Über-uns-Seiten stehen ${ueberUnsGebaut.toLocaleString('de-DE')} Wörter. ` +
      `Wiederhergestellt waren ${UEBER_UNS_RESTAURIERT.toLocaleString('de-DE')}.`,
  );
}

if (duenn.length) {
  console.log(`\n[inhalt] ${duenn.length} Seite(n) mit weniger als 250 Wörtern:`);
  for (const s of duenn.slice(0, 12)) console.log(`           ${String(s.n).padStart(5)}  ${s.pfad}`);
  if (duenn.length > 12) console.log(`           … und ${duenn.length - 12} weitere`);
}

if (fehler.length === 0 && duenn.length === 0) {
  console.log(
    '\n[inhalt] In Ordnung: Der Textbestand liegt über dem der alten Website,\n' +
      '         jedes Unterthema hat seine Behandlung, keine Seite ist leer.',
  );
  process.exit(0);
}

if (fehler.length === 0) {
  /* Dünne Seiten allein brechen nicht ab: Vier Behandlungen sind im Neubau
     neu und hatten nie einen alten Text (professionelle-zahnreinigung,
     sofortimplantate, zahnentfernung, kreidezaehne). Das ist ein Zugewinn an
     Seiten, kein Verlust an Text – aber es gehört gesehen. */
  console.log(
    '\n[inhalt] In Ordnung, mit Hinweis: Der Bestand liegt über dem der alten\n' +
      '         Website. Die dünnen Seiten oben sind entweder neu im Neubau oder\n' +
      '         warten auf Text – sie sind kein Rückschritt, aber eine Aufgabe.',
  );
  process.exit(0);
}

console.error(`\n[inhalt] ${fehler.length} Befund(e):`);
for (const f of fehler) console.error(`    – ${f}`);

console.error(
  '\n[inhalt] ABBRUCH: Der Textbestand der Behandlungsseiten ist einmal von\n' +
    '         117.595 auf 18.444 Wörter gefallen, und keine einzelne Entscheidung\n' +
    '         sah dabei wie ein Verlust aus. Deshalb widerspricht hier eine Zahl\n' +
    '         und nicht ein Kommentar.',
);
process.exit(1);
