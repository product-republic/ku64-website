/**
 * Prüft, ob ein `id` auf einer gebauten Seite mehr als einmal vorkommt.
 *
 * ── Warum das eine eigene Prüfung wert ist ──────────────────────────────
 *
 * Ein `id` ist per Definition einmalig. Kommt er zweimal vor, wird die
 * Seite dadurch nicht ungültig im Sinne von „kaputt" – sie sieht genauso
 * aus wie vorher. Kaputt geht alles, was sich auf ihn beruft:
 *
 *   · `getElementById` liefert den ERSTEN Treffer. Welcher das ist, hängt
 *     an der Reihenfolge im Markup, nicht daran, welcher gerade sichtbar
 *     ist. Genau das war hier der Fall: Der Sprachhinweis stand zweimal in
 *     der Seite, weil der Sprachwähler zweimal eingebunden ist – einmal in
 *     der Kopfleiste, einmal im mobilen Menü. Auf dem Telefon bediente das
 *     Skript deshalb den unsichtbaren.
 *   · `aria-labelledby`, `aria-describedby` und `<label for>` zeigen
 *     ebenfalls auf den ersten. Ein Screenreader liest dann die
 *     Beschriftung eines anderen Elements vor.
 *   · Ein Sprungziel `#name` in der Adresse führt zum ersten.
 *
 * Keine dieser Folgen fällt beim Draufschauen auf. Deshalb hier eine Zahl.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   npm run build && npm run ids:pruefen
 */

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const WURZEL = path.resolve(import.meta.dirname, '..');
const DIST = path.join(WURZEL, 'dist', 'client');

if (!existsSync(DIST)) {
  console.error('[ids] dist/client fehlt – bitte zuerst bauen.');
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

const dateien = await seiten(DIST);

/*
 * Gesammelt wird je `id`, nicht je Seite.
 *
 * Ein doppelter `id` in einem Baustein, den es auf jeder Seite gibt, ist
 * ein Fehler an einer Stelle und nicht tausend Fehler. Die Liste soll die
 * Stelle nennen, nicht die Symptome zählen.
 */
const befunde = new Map();

for (const datei of dateien) {
  const html = await readFile(datei, 'utf8');
  const stand = new Map();
  for (const [, id] of html.matchAll(/\sid="([^"]+)"/g)) {
    stand.set(id, (stand.get(id) ?? 0) + 1);
  }

  for (const [id, anzahl] of stand) {
    if (anzahl < 2) continue;
    const seite = '/' + path.relative(DIST, datei).replace(/index\.html$/, '').replace(/\\/g, '/');
    if (!befunde.has(id)) befunde.set(id, { anzahl, seiten: new Set() });
    befunde.get(id).seiten.add(seite);
  }
}

console.log(`[ids] ${dateien.length} gebaute Seiten geprüft`);

if (befunde.size === 0) {
  console.log('[ids] Jeder id kommt höchstens einmal vor. In Ordnung.');
  process.exit(0);
}

console.error(`\n[ids] ${befunde.size} id(s) kommen mehrfach vor:`);
for (const [id, { anzahl, seiten: wo }] of [...befunde].sort((a, b) => b[1].seiten.size - a[1].seiten.size)) {
  console.error(`    ${id}  ${anzahl}× auf ${wo.size} Seite(n), z. B. ${[...wo][0]}`);
}

console.error(
  '\n[ids] ABBRUCH: getElementById, aria-labelledby und <label for> greifen den\n' +
    '      ersten Treffer – bei zwei gleichnamigen also womöglich den falschen.\n' +
    '      Meist steckt dahinter ein Baustein, der zweimal eingebunden ist und\n' +
    '      etwas mitbringt, das es nur einmal geben darf.',
);
process.exit(1);
