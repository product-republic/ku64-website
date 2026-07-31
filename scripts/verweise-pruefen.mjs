/**
 * Prüft jeden internen Verweis der gebauten Website gegen das Bauergebnis.
 *
 * ── Was das von den anderen Prüfungen unterscheidet ─────────────────────
 *
 * `urls:abgleichen` fragt: Kommt jemand, der eine alte Adresse von ku64.de
 * kennt, noch an? Das ist die Frage nach dem Bestand.
 *
 * Diese hier fragt etwas anderes: Führt jeder Verweis, den die neue Website
 * selbst schreibt, auch irgendwohin? Das ist die Frage nach der Website
 * selbst – und sie wird von keiner anderen Prüfung gestellt. Ein Tippfehler
 * in einem `href` fällt weder dem Bauvorgang auf (Astro prüft
 * Zeichenketten nicht) noch dem Sprachwächter noch dem Durchgang, der nur
 * sechzehn Seiten aufruft.
 *
 * ── Wie geprüft wird ────────────────────────────────────────────────────
 *
 * Gegen `dist/client`, also gegen das, was der Server ausliefert. Ein Pfad
 * gilt als erreichbar, wenn es dazu eine Datei gibt – `/potsdam/` also
 * `dist/client/potsdam/index.html`. Weiterleitungsseiten zählen mit: Sie
 * sind gebaute Dateien und liefern beim Aufruf eine Seite.
 *
 * Nicht geprüft werden Adressen nach außen, `mailto:`, `tel:` und Anker.
 *
 * ── Und die Ziele im Textkorpus ─────────────────────────────────────────
 *
 * Seit die Strichpunkte auf `/ueber-uns/` wieder verlinkt sind, steht ein
 * Teil der Ziele nicht in einer Seite, sondern in `langtexte.json`. Die oben
 * beschriebene Prüfung findet sie zwar im fertigen HTML – aber nur, solange
 * der Block auch gesetzt wird. Fällt er aus einem anderen Grund weg, wäre
 * das Ziel unbemerkt tot.
 *
 * Deshalb ein zweiter Durchgang direkt über den Korpus. Er prüft dreierlei:
 * dass der Zielpfad gebaut wurde, dass ein etwaiger Anker auf der Zielseite
 * wirklich existiert, und dass der Linktext noch wörtlich im Blocktext
 * steht – findet der Baustein ihn nicht, verschwindet der Link stumm.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   npm run build && npm run verweise:pruefen
 */

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const WURZEL = path.resolve(import.meta.dirname, '..');
const DIST = path.join(WURZEL, 'dist', 'client');

if (!existsSync(DIST)) {
  console.error('[verweise] dist/client fehlt – bitte zuerst bauen.');
  process.exit(1);
}

/** Alle gebauten HTML-Dateien. */
async function seiten(ordner, treffer = []) {
  for (const eintrag of await readdir(ordner, { withFileTypes: true })) {
    const voll = path.join(ordner, eintrag.name);
    if (eintrag.isDirectory()) await seiten(voll, treffer);
    else if (eintrag.name.endsWith('.html')) treffer.push(voll);
  }
  return treffer;
}

const dateien = await seiten(DIST);

/**
 * Ein Pfad ist erreichbar, wenn es die Datei gibt.
 *
 * `/potsdam/` → `potsdam/index.html`, `/robots.txt` → `robots.txt`. Der
 * Abfrageteil und der Anker gehören nicht zum Dateinamen.
 */
function erreichbar(pfad) {
  const nur = pfad.split(/[?#]/)[0];
  const roh = nur.replace(/^\//, '');
  if (roh === '') return existsSync(path.join(DIST, 'index.html'));
  const alsDatei = path.join(DIST, roh);
  if (existsSync(alsDatei)) return true;
  return existsSync(path.join(DIST, roh.replace(/\/$/, ''), 'index.html'));
}

const VERWEIS = /<(?:a|area)\b(?:"[^"]*"|'[^']*'|[^>"'])*>/gi;
const AUSSEN = /^(https?:|mailto:|tel:|javascript:|data:|#)/i;

const kaputt = new Map();
let geprueft = 0;

for (const datei of dateien) {
  const html = await readFile(datei, 'utf8');
  const seite = '/' + path.relative(DIST, datei).replace(/index\.html$/, '').replace(/\\/g, '/');

  for (const [tag] of html.matchAll(VERWEIS)) {
    const ziel = tag.match(/\bhref="([^"]*)"/)?.[1];
    if (!ziel || AUSSEN.test(ziel)) continue;
    if (!ziel.startsWith('/')) continue; // relative Pfade gibt es hier nicht
    geprueft++;
    if (erreichbar(ziel)) continue;

    const schluessel = ziel.split(/[?#]/)[0];
    if (!kaputt.has(schluessel)) kaputt.set(schluessel, new Set());
    kaputt.get(schluessel).add(seite);
  }
}

console.log(`[verweise] ${geprueft} interne Verweise auf ${dateien.length} Seiten geprüft`);

/* ── Zweiter Durchgang: die Ziele im Textkorpus ──────────────────────── */

/**
 * Steht diese Kennung auf der Seite, auf die der Pfad zeigt?
 *
 * Nur die `id`-Attribute – ein `name` ist seit HTML5 kein Sprungziel mehr.
 * Findet sich die Datei nicht, meldet das die Pfadprüfung; hier gilt sie
 * dann als „Anker nicht belegt", damit nicht zwei Meldungen dasselbe sagen.
 */
async function ankerVorhanden(pfad, anker) {
  const roh = pfad.replace(/^\//, '').replace(/\/$/, '');
  const datei = roh === '' ? path.join(DIST, 'index.html') : path.join(DIST, roh, 'index.html');
  if (!existsSync(datei)) return false;
  const html = await readFile(datei, 'utf8');
  return new RegExp(`\\bid="${anker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`).test(html);
}

const korpusFehler = [];
let korpusZiele = 0;

for (const name of ['langtexte.json', 'langtexte-en.json', 'langtexte-fr.json']) {
  const datei = path.join(WURZEL, 'src', 'inhalte', name);
  if (!existsSync(datei)) continue;
  const korpus = JSON.parse(await readFile(datei, 'utf8'));

  for (const [bereich, eintraege] of Object.entries(korpus)) {
    if (!eintraege || typeof eintraege !== 'object' || Array.isArray(eintraege)) continue;
    for (const [schluessel, eintrag] of Object.entries(eintraege)) {
      for (const abschnitt of eintrag?.abschnitte ?? []) {
        for (const block of abschnitt.bloecke ?? []) {
          for (const v of block.verweise ?? []) {
            korpusZiele++;
            const wo = `${name} → ${bereich}/${schluessel}`;

            /* Der Linktext muss wörtlich im Block stehen. Tut er das nicht,
               setzt `Langtext.astro` den Punkt ohne Link – kein toter Verweis,
               aber ein verlorener, und der fällt sonst niemandem auf. */
            if (!block.text.includes(v.text)) {
              korpusFehler.push(`${wo}: Linktext „${v.text}" steht nicht im Block`);
            }

            const [nurPfad, anker] = v.ziel.split('#');
            if (!erreichbar(nurPfad)) {
              korpusFehler.push(`${wo}: ${v.ziel} – diese Seite gibt es nicht`);
              continue;
            }
            if (anker && !(await ankerVorhanden(nurPfad, anker))) {
              korpusFehler.push(`${wo}: ${v.ziel} – die Seite gibt es, den Anker nicht`);
            }
          }
        }
      }
    }
  }
}

console.log(`[verweise] ${korpusZiele} Ziel(e) im Textkorpus geprüft`);

if (korpusFehler.length) {
  console.error(`\n[verweise] ${korpusFehler.length} Ziel(e) im Korpus stimmen nicht:`);
  for (const f of korpusFehler) console.error(`    ${f}`);
  console.error(
    '\n[verweise] ABBRUCH: Die Ziele stehen von Hand in scripts/langtexte-bauen.mjs.\n' +
      '           Wird ein Slug umbenannt, zeigt der Strichpunkt still ins Leere.',
  );
  process.exit(1);
}

if (kaputt.size === 0) {
  console.log('[verweise] Jeder führt irgendwohin. In Ordnung.');
  process.exit(0);
}

/* Nach Häufigkeit: Ein Verweis, der auf vierhundert Seiten steht, ist ein
   Fehler in einem Baustein und nicht vierhundert Fehler. */
const sortiert = [...kaputt.entries()].sort((a, b) => b[1].size - a[1].size);

console.error(`\n[verweise] ${kaputt.size} Ziel(e) gibt es nicht:`);
for (const [ziel, quellen] of sortiert.slice(0, 20)) {
  const beispiel = [...quellen][0];
  console.error(
    `    ${ziel}  – verlinkt von ${quellen.size} Seite(n), z. B. ${beispiel}`,
  );
}
if (sortiert.length > 20) console.error(`    … und ${sortiert.length - 20} weitere`);

console.error(
  '\n[verweise] ABBRUCH: Ein Verweis ins Leere ist auf einer Praxisseite nicht\n' +
    '           nur unschön – wer ihn anklickt, sucht gerade etwas.',
);
process.exit(1);
