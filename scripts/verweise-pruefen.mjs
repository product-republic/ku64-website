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
