/**
 * Übersetzungen aus einer schlichten Schlüssel-Wert-Datei in den Katalog
 * übernehmen und dabei den Fingerabdruck des deutschen Originals setzen.
 *
 * Gedacht für Übersetzungen, die von Hand oder von einem Übersetzungsbüro
 * kommen. Das Büro bekommt eine flache JSON-Datei, die es ohne Kenntnis
 * unserer Datenstruktur bearbeiten kann; der Fingerabdruck entsteht hier.
 *
 * Aufruf:
 *   node --experimental-strip-types scripts/sprachen-einspielen.mjs en datei.json
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { quelltexte } = await import(pathToFileURL(path.join(WURZEL, 'src/i18n/quelle.ts')).href);
const { fingerabdruck } = await import(pathToFileURL(path.join(WURZEL, 'src/i18n/felder.ts')).href);

const [sprache, quelldatei] = process.argv.slice(2);
if (!sprache || !quelldatei) {
  console.error('Aufruf: sprachen-einspielen.mjs <sprache> <datei.json>');
  process.exit(1);
}

const deutsch = quelltexte();
const neu = JSON.parse(await readFile(quelldatei, 'utf8'));

const katalogPfad = path.join(WURZEL, 'src/inhalte', `${sprache}.json`);
const katalog = JSON.parse(await readFile(katalogPfad, 'utf8'));
katalog.eintraege ??= {};

let uebernommen = 0;
const unbekannt = [];

for (const [schluessel, text] of Object.entries(neu)) {
  if (!(schluessel in deutsch)) {
    unbekannt.push(schluessel);
    continue;
  }
  katalog.eintraege[schluessel] = { text, quelle: fingerabdruck(deutsch[schluessel]) };
  uebernommen++;
}

const sortiert = Object.fromEntries(
  Object.entries(katalog.eintraege).sort(([a], [b]) => a.localeCompare(b)),
);
await writeFile(katalogPfad, `${JSON.stringify({ ...katalog, eintraege: sortiert }, null, 2)}\n`);

console.log(`[einspielen] ${sprache}: ${uebernommen} Einträge übernommen`);
if (unbekannt.length) {
  console.log(`[einspielen] ${unbekannt.length} unbekannte Schlüssel übersprungen:`);
  for (const k of unbekannt.slice(0, 10)) console.log(`  · ${k}`);
}
