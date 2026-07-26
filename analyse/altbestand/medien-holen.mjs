#!/usr/bin/env node
/**
 * Holt einzelne Motive aus dem Medienbestand von ku64.de – in der besten
 * verfügbaren Fassung.
 *
 * ── Warum nicht alles ───────────────────────────────────────────────────
 *
 * Der Crawl findet gut 2000 Bilddateien. Das sind keine 2000 Motive: Zu jedem
 * hochgeladenen Bild legt WordPress Ableitungen in mehreren Größen und
 * Formaten an – rund 570 eigenständige Motive bleiben übrig, und davon
 * gehören die wenigsten auf die neue Website. Ein Verzeichnis unbesehen zu
 * übernehmen schleppt neunmal Ballast mit und beantwortet trotzdem nicht die
 * einzige Frage, die zählt: Welches Motiv gehört wohin?
 *
 * Deshalb nimmt dieses Skript Motivnamen entgegen und holt genau die. Wer ein
 * Bild einbaut, hat es vorher angesehen und weiß, was darauf ist – erst dann
 * kann er den Alternativtext schreiben, den `src/lib/bilder.ts` verlangt.
 *
 * ── Welche Fassung ──────────────────────────────────────────────────────
 *
 * Die größte. WordPress hängt die Maße an den Dateinamen (`-1024x683`); ohne
 * Zusatz ist es das Original. Die neue Website rechnet ihre Größen selbst und
 * braucht die verlustärmste Vorlage.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   node analyse/altbestand/medien-holen.mjs <ziel-ordner> <motiv> [<motiv> …]
 *
 * Motiv ist der Dateiname ohne Größenzusatz und ohne Endung, so wie ihn
 * `medien-live.json` führt. Braucht einen vorangegangenen Crawl.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const HIER = import.meta.dirname;
const [ziel, ...motive] = process.argv.slice(2);

if (!ziel || !motive.length) {
  console.error('Aufruf: node medien-holen.mjs <ziel-ordner> <motiv> [<motiv> …]');
  process.exit(1);
}

const listeDatei = path.join(HIER, 'medien-live.json');
if (!existsSync(listeDatei)) {
  console.error('[medien] medien-live.json fehlt – erst "node analyse/altbestand/crawl.mjs".');
  process.exit(1);
}

const liste = JSON.parse(await readFile(listeDatei, 'utf8'));

/** Führt eine WordPress-Ableitung auf ihr Original zurück. */
function stamm(datei) {
  return datei
    .replace(/\.(jpe?g|png|webp|avif|gif)$/i, '')
    .replace(/-\d{2,4}x\d{2,4}$/, '')
    .replace(/-scaled$/, '')
    .replace(/-rotated$/, '')
    .toLowerCase();
}

/* Alle Fassungen je Motiv sammeln. */
const nachMotiv = new Map();
for (const { url } of liste.dateien) {
  if (!url.includes('/wp-content/uploads/')) continue;
  const s = stamm(url.split('/').pop());
  if (!nachMotiv.has(s)) nachMotiv.set(s, []);
  nachMotiv.get(s).push(url);
}

await mkdir(ziel, { recursive: true });

for (const motiv of motive) {
  const fassungen = nachMotiv.get(motiv.toLowerCase());
  if (!fassungen) {
    console.error(`[medien] unbekannt: ${motiv}`);
    process.exitCode = 1;
    continue;
  }

  /* Die größte Fassung gewinnt. Ohne Maße im Namen ist es das Original und
     damit die größte – deshalb bekommt es den Vorrang vor jeder bezifferten. */
  const bewerten = (url) => {
    const treffer = url.match(/-(\d{2,4})x(\d{2,4})\.[a-z]+$/i);
    return treffer ? Number(treffer[1]) * Number(treffer[2]) : Number.MAX_SAFE_INTEGER;
  };
  const beste = fassungen.sort((a, b) => bewerten(b) - bewerten(a))[0];

  const antwort = await fetch(beste, {
    headers: { 'user-agent': 'ku64-relaunch-medienuebernahme/1.0' },
  });
  if (!antwort.ok) {
    console.error(`[medien] ${antwort.status} bei ${beste}`);
    process.exitCode = 1;
    continue;
  }
  const daten = Buffer.from(await antwort.arrayBuffer());
  const endung = path.extname(new URL(beste).pathname);
  const dateiname = `${motiv.toLowerCase()}${endung}`;
  await writeFile(path.join(ziel, dateiname), daten);
  console.log(
    `[medien] ${dateiname}  ${(daten.length / 1024).toFixed(0)} kB  aus ${fassungen.length} Fassungen`,
  );
}
