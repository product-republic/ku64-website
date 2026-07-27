#!/usr/bin/env node
/**
 * Trägt Übersetzungen der Oberflächentexte in die Kataloge ein.
 *
 * ── Wozu, wenn es `sprachen:sync` gibt ──────────────────────────────────
 *
 * `sprachen:sync` lässt ein Modell übersetzen und braucht dafür einen
 * API-Schlüssel. Das ist richtig für die 736 Inhaltsschlüssel – Texte zu
 * Behandlungen, FAQ, Preise –, die niemand von Hand nachzieht.
 *
 * Die Oberflächentexte sind ein anderer Fall. Es sind wenige, sie ändern sich
 * selten, und ihre Übersetzung ist eine Entscheidung: „Termin buchen" wird zu
 * „Book an appointment" und nicht zu „Book a date". Wer sie von Hand schreibt,
 * braucht trotzdem den Fingerabdruck des deutschen Ausgangstextes – und den
 * von Hand einzutragen ist die zuverlässigste Art, ihn falsch einzutragen.
 *
 * Dieses Skript nimmt die Übersetzungen entgegen und rechnet den
 * Fingerabdruck selbst aus, direkt aus `TEXTE`. Damit kann ein Eintrag nicht
 * versehentlich als aktuell gelten, während sein deutsches Original schon
 * weitergezogen ist.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   node --experimental-strip-types scripts/ui-texte-eintragen.mjs <datei.json>
 *
 * Die Datei enthält:
 *   { "start.ueberschrift": { "en": "…", "fr": "…" }, … }
 *
 * Vorhandene Einträge werden überschrieben, alles Übrige bleibt unberührt.
 * Ein Schlüssel, den es in `TEXTE` nicht gibt, ist ein Fehler und kein
 * stiller Zusatzeintrag – sonst sammeln sich Übersetzungen zu Texten an, die
 * es nicht mehr gibt.
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { TEXTE } = await import(pathToFileURL(path.join(WURZEL, 'src/i18n/texte.ts')).href);
const { fingerabdruck } = await import(pathToFileURL(path.join(WURZEL, 'src/i18n/felder.ts')).href);

const quelle = process.argv[2];
if (!quelle) {
  console.error('Aufruf: node scripts/ui-texte-eintragen.mjs <datei.json>');
  process.exit(1);
}

const tabelle = JSON.parse(await readFile(quelle, 'utf8'));

const unbekannt = Object.keys(tabelle).filter((k) => !(k in TEXTE));
if (unbekannt.length) {
  console.error('[ui] Diese Schlüssel gibt es in TEXTE nicht:');
  for (const k of unbekannt) console.error(`  · ${k}`);
  process.exit(1);
}

const sprachen = ['en', 'fr'];
const bericht = {};

for (const sprache of sprachen) {
  const datei = path.join(WURZEL, 'src/inhalte', `${sprache}.json`);
  const katalog = JSON.parse(await readFile(datei, 'utf8'));
  katalog.eintraege ??= {};

  let neu = 0;
  let aktualisiert = 0;

  for (const [schluessel, fassungen] of Object.entries(tabelle)) {
    const text = fassungen[sprache];
    if (!text) continue;
    const ziel = `ui.${schluessel}`;
    if (katalog.eintraege[ziel]) aktualisiert++;
    else neu++;
    katalog.eintraege[ziel] = { text, quelle: fingerabdruck(TEXTE[schluessel]) };
  }

  /* Sortiert schreiben: Ein Katalog, dessen Reihenfolge von der Reihenfolge
     der Eintragung abhängt, erzeugt bei jeder Änderung einen unlesbaren
     Unterschied im Versionsverlauf. */
  const sortiert = Object.fromEntries(
    Object.entries(katalog.eintraege).sort(([a], [b]) => a.localeCompare(b)),
  );

  await writeFile(datei, JSON.stringify({ ...katalog, eintraege: sortiert }, null, 2) + '\n');
  bericht[sprache] = { neu, aktualisiert, gesamt: Object.keys(sortiert).length };
}

console.log('[ui] Eingetragen');
for (const [sprache, z] of Object.entries(bericht)) {
  console.log(`  ${sprache}: ${z.neu} neu, ${z.aktualisiert} aktualisiert – ${z.gesamt} Einträge insgesamt`);
}
