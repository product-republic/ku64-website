#!/usr/bin/env node
/**
 * Bereitet die Praxisaufnahmen für die Auslieferung auf.
 *
 * Läuft NICHT im Build – die fertigen Dateien liegen im Repository. Dieses
 * Skript dokumentiert und wiederholt, wie sie entstanden sind.
 *
 * ── Warum drei Formate ──────────────────────────────────────────────────
 *
 * AVIF ist bei gleicher Qualität etwa halb so groß wie JPEG, WebP liegt
 * dazwischen, JPEG versteht jeder Browser. Der `<picture>`-Baustein lässt den
 * Browser wählen; wer AVIF kann, lädt die Hälfte.
 *
 * Das ist kein Selbstzweck: Diese Aufnahmen sind großformatig und stehen weit
 * oben auf der Seite. Ein Empfangsbereich in voller Breite ist auf einer
 * Mobilverbindung der Unterschied zwischen einer Seite, die steht, und einer,
 * die noch lädt.
 *
 * ── Warum 1600 Pixel ────────────────────────────────────────────────────
 *
 * Breiter wird das Bild im Layout nicht dargestellt. Ein 4000 Pixel breites
 * Original auszuliefern heißt, dass das Gerät es herunterrechnet, nachdem es
 * die vollen Daten geladen hat – die Arbeit fällt an, der Nutzen nicht.
 *
 * Zusätzlich eine 800er Fassung für schmale Bildschirme. Mehr Stufen bringen
 * bei einem einzelnen Bild je Seite nichts.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   node scripts/praxisbilder-aufbereiten.mjs <quellordner>
 *
 * Erwartet dort die mit `analyse/altbestand/medien-holen.mjs` geholten
 * Originale und schreibt nach `public/praxis/`.
 */

import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ZIEL = path.join(WURZEL, 'public', 'praxis');

const quelle = process.argv[2];
if (!quelle) {
  console.error('Aufruf: node scripts/praxisbilder-aufbereiten.mjs <quellordner>');
  process.exit(1);
}

/**
 * Quelle → Zielname. Der Zielname sagt, welcher Standort zu sehen ist; der
 * Quellname bleibt in `src/lib/bilder.ts` als Herkunftsnachweis stehen.
 */
const ZUORDNUNG = {
  'flurbereich-ku64-gruene-landschaft-charlottenburg-berlin': 'berlin-charlottenburg-flur',
  'ku64-berlin-mitte-rezeption-1440': 'berlinmitte-empfang',
  'ku64-potsdam-rezeption-1440': 'potsdam-empfang',
  'ku64-die-kiezpraxis-zahnarzt-wilmersdorf-aussenansicht': 'wilmersdorf-haus',
};

const BREITEN = [1600, 800];

await mkdir(ZIEL, { recursive: true });

const dateien = await readdir(quelle);
const bericht = [];

for (const [stamm, name] of Object.entries(ZUORDNUNG)) {
  const datei = dateien.find((d) => path.parse(d).name === stamm);
  if (!datei) {
    console.error(`[praxisbilder] fehlt im Quellordner: ${stamm}`);
    process.exitCode = 1;
    continue;
  }
  const voll = path.join(quelle, datei);
  const roh = sharp(voll);
  const { width, height } = await roh.metadata();
  const vorher = (await stat(voll)).size;

  const groessen = [];
  for (const breite of BREITEN) {
    /* Nicht hochrechnen: Ein Original mit 1200 Pixeln wird durch Skalierung
       auf 1600 nicht schärfer, nur größer. */
    const b = Math.min(breite, width);
    const basis = sharp(voll).resize({ width: b, withoutEnlargement: true });
    const stammName = breite === BREITEN[0] ? name : `${name}-${b}`;

    await basis.clone().avif({ quality: 55 }).toFile(path.join(ZIEL, `${stammName}.avif`));
    await basis.clone().webp({ quality: 76 }).toFile(path.join(ZIEL, `${stammName}.webp`));
    await basis
      .clone()
      .jpeg({ quality: 78, mozjpeg: true, progressive: true })
      .toFile(path.join(ZIEL, `${stammName}.jpg`));

    const bytes = await Promise.all(
      ['avif', 'webp', 'jpg'].map(async (e) => (await stat(path.join(ZIEL, `${stammName}.${e}`))).size),
    );
    groessen.push({ breite: b, avif: bytes[0], webp: bytes[1], jpg: bytes[2] });
  }

  const hoeheBei1600 = Math.round((Math.min(BREITEN[0], width) / width) * height);
  bericht.push({ name, quelle: datei, vorher, breite: Math.min(BREITEN[0], width), hoehe: hoeheBei1600, groessen });
}

const kb = (n) => `${Math.round(n / 1024)} kB`;

console.log('\n[praxisbilder] Ergebnis');
for (const b of bericht) {
  console.log(`  ${b.name}  ${b.breite}×${b.hoehe}  Original ${kb(b.vorher)}`);
  for (const g of b.groessen) {
    console.log(`      ${String(g.breite).padStart(4)} px   avif ${kb(g.avif).padStart(7)}   webp ${kb(g.webp).padStart(7)}   jpg ${kb(g.jpg).padStart(7)}`);
  }
  console.log(`      Maße für src/lib/bilder.ts: breite: ${b.breite}, hoehe: ${b.hoehe}`);
}
