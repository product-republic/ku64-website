/**
 * Baut den Befundbericht als eigenständige HTML-Datei.
 *
 * Die Schriften werden als data-URI eingebettet, weil die Artifact-CSP
 * Anfragen an fremde Hosts blockiert – ein verlinkter Webfont würde still
 * auf eine Systemschrift zurückfallen.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const WURZEL = path.resolve(import.meta.dirname, '..');

async function alsDataUri(relativerPfad) {
  const daten = await readFile(path.join(WURZEL, 'node_modules', relativerPfad));
  return `data:font/woff2;base64,${daten.toString('base64')}`;
}

const inter = await alsDataUri(
  '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
);
const fraunces = await alsDataUri(
  '@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2',
);

const vorlage = await readFile(path.join(import.meta.dirname, 'vorlage.html'), 'utf8');

const fertig = vorlage
  .replace('__SCHRIFT_INTER__', inter)
  .replace('__SCHRIFT_FRAUNCES__', fraunces);

await writeFile(path.join(import.meta.dirname, 'befundbericht.html'), fertig);

console.log(
  `[bericht] befundbericht.html erzeugt – ${(fertig.length / 1024).toFixed(0)} KB inklusive Schriften`,
);
