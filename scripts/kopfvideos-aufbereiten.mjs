#!/usr/bin/env node
/**
 * Bereitet die Kopfvideos für die Auslieferung auf und erzeugt ihre
 * Standbilder.
 *
 * Läuft NICHT im Build. Die aufbereiteten Dateien liegen im Repository; dieses
 * Skript dokumentiert und wiederholt, wie sie entstanden sind. Es braucht
 * `ffmpeg`, das auf einem Entwicklungsrechner vorhanden ist und im
 * Auslieferungscontainer nichts zu suchen hat.
 *
 * ── Warum die Rohdateien nicht so bleiben können ─────────────────────────
 *
 * Die Aufnahmen von ku64.de kommen mit 3,6 bis 3,9 Mbit/s und einer
 * Tonspur. Beides ist für ein Kopfvideo falsch:
 *
 * Die Tonspur wird nie abgespielt – das Element ist `muted`, weil ein Video,
 * das von selbst zu sprechen anfängt, jede Seite unbenutzbar macht. Sie
 * herunterzuladen kostet trotzdem Bandbreite. Sie fliegt raus.
 *
 * Die Bitrate ist die eines Films, den jemand ansieht. Dieses Video schmückt
 * einen Kopfbereich; es läuft stumm, in Schleife, oft halb von Schrift
 * verdeckt und auf Mobilgeräten in Briefmarkengröße. Die bereits komprimierte
 * Kurfürstendamm-Fassung zeigt, was reicht: 1,28 Mbit/s. Auf einer üblichen
 * Mobilverbindung ist das der Unterschied zwischen zwei und acht Sekunden.
 *
 * Deshalb zwei Wege, je nach Ausgangslage:
 *   – Liegt die Bitrate schon unter der Schwelle, wird nur umgepackt
 *     (Tonspur weg, Kopfdaten nach vorn). Kein zweiter Verlust.
 *   – Liegt sie darüber, wird neu kodiert. Der Qualitätsverlust ist geringer
 *     als der Schaden durch die Ladezeit.
 *
 * ── faststart ───────────────────────────────────────────────────────────
 *
 * MP4 legt sein Inhaltsverzeichnis standardmäßig ans Dateiende. Ein Browser
 * kann dann erst abspielen, wenn alles da ist. `+faststart` schiebt es nach
 * vorn – das Video startet nach den ersten Kilobyte.
 *
 * ── Das Standbild ───────────────────────────────────────────────────────
 *
 * `preload="none"` heißt: Ohne Standbild ist der Kopfbereich leer, bis jemand
 * scrollt – und auf langsamen Verbindungen dauerhaft. Das Standbild ist
 * deshalb kein Beiwerk, sondern der Normalzustand der Seite.
 *
 * Genommen wird nicht einfach das erste Bild. Aufnahmen beginnen fast immer
 * mit einer Aufblende, und ein schwarzes Standbild ist so gut wie keines.
 * Geprüft werden mehrere Zeitpunkte; genommen wird der erste, der hell genug
 * ist und genug Zeichnung hat.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   node scripts/kopfvideos-aufbereiten.mjs
 */

import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { rename, stat, unlink } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const lauf = promisify(execFile);
const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OEFFENTLICH = path.join(WURZEL, 'public');

/**
 * Ab hier wird neu kodiert. 1,6 Mbit/s liegt bewusst etwas über der
 * Kurfürstendamm-Fassung: Eine Datei, die schon knapp darunter liegt, gewinnt
 * durch eine zweite Kodierung nichts und verliert Qualität.
 */
const SCHWELLE_BITRATE = 1_600_000;

/** Zielqualität beim Neukodieren. 26 ist für stumme Hintergrundbewegung reichlich. */
const CRF = 26;

/** Zeitpunkte in Sekunden, an denen ein Standbild versucht wird. */
const KANDIDATEN = [1.5, 3, 5, 8, 12];

async function ffprobe(datei, eintraege) {
  const { stdout } = await lauf('ffprobe', [
    '-v', 'error',
    '-show_entries', eintraege,
    '-of', 'default=noprint_wrappers=1:nokey=1',
    datei,
  ]);
  return stdout.trim().split('\n');
}

/**
 * Mittlere Helligkeit und Standardabweichung eines Einzelbilds. Die
 * Abweichung ist das eigentliche Kriterium: Ein gleichmäßig graues Bild ist
 * genauso wertlos wie ein schwarzes, hat aber eine passable Helligkeit.
 */
async function bildwerte(video, sekunde) {
  const { stderr } = await lauf('ffmpeg', [
    '-v', 'info',
    '-ss', String(sekunde),
    '-i', video,
    '-frames:v', '1',
    '-vf', 'signalstats,metadata=print',
    '-f', 'null', '-',
  ]);
  const mittel = Number(stderr.match(/lavfi\.signalstats\.YAVG=([\d.]+)/)?.[1] ?? 0);
  const streuung = Number(stderr.match(/lavfi\.signalstats\.YDIF=([\d.]+)/)?.[1] ?? 0);
  const spanne =
    Number(stderr.match(/lavfi\.signalstats\.YHIGH=([\d.]+)/)?.[1] ?? 0) -
    Number(stderr.match(/lavfi\.signalstats\.YLOW=([\d.]+)/)?.[1] ?? 0);
  return { mittel, streuung, spanne };
}

const { KOPFVIDEOS } = await import('../src/data/medien.ts');

const berichte = [];

for (const video of KOPFVIDEOS) {
  const datei = path.join(OEFFENTLICH, video.datei.replace(/^\//, ''));
  const poster = path.join(OEFFENTLICH, video.poster.replace(/^\//, ''));

  if (!existsSync(datei)) {
    console.error(`[kopfvideo] fehlt: ${video.datei} – erst aus dem Bestand holen.`);
    process.exitCode = 1;
    continue;
  }

  const vorher = (await stat(datei)).size;
  const [bitrate] = (await ffprobe(datei, 'format=bit_rate')).map(Number);
  const hatTon = (await ffprobe(datei, 'stream=codec_type')).includes('audio');

  const neukodieren = bitrate > SCHWELLE_BITRATE;
  const zwischendatei = `${datei}.neu.mp4`;

  if (neukodieren) {
    console.log(
      `[kopfvideo] ${path.basename(datei)}: ${(bitrate / 1e6).toFixed(2)} Mbit/s – wird neu kodiert`,
    );
    await lauf('ffmpeg', [
      '-y', '-v', 'error',
      '-i', datei,
      '-an',
      '-c:v', 'libx264',
      '-crf', String(CRF),
      '-preset', 'slow',
      /* Profil und Pixelformat festnageln: Ohne das kodiert x264 unter
         Umständen in 4:2:0-Varianten, die Safari auf älteren Geräten nicht
         abspielt – und dann bleibt dort das Standbild stehen. */
      '-profile:v', 'high',
      '-pix_fmt', 'yuv420p',
      /* Zwei Sekunden zwischen Schlüsselbildern. Die Schleife springt damit
         sauber zurück, ohne dass die Datei nennenswert wächst. */
      '-g', '60',
      '-movflags', '+faststart',
      zwischendatei,
    ]);
  } else if (hatTon) {
    console.log(`[kopfvideo] ${path.basename(datei)}: bereits sparsam – nur umpacken`);
    await lauf('ffmpeg', [
      '-y', '-v', 'error',
      '-i', datei,
      '-an',
      '-c:v', 'copy',
      '-movflags', '+faststart',
      zwischendatei,
    ]);
  }

  if (existsSync(zwischendatei)) {
    await unlink(datei);
    await rename(zwischendatei, datei);
  }

  const nachher = (await stat(datei)).size;

  // ── Standbild ───────────────────────────────────────────────────────
  let gewaehlt = null;
  for (const s of KANDIDATEN) {
    const w = await bildwerte(datei, s);
    /* Helligkeit über 40 schließt die Aufblende aus, Spanne über 60 den
       gleichmäßigen Weißabgleich am Anfang mancher Aufnahmen. */
    if (w.mittel > 40 && w.spanne > 60) {
      gewaehlt = { sekunde: s, ...w };
      break;
    }
  }
  if (!gewaehlt) {
    gewaehlt = { sekunde: KANDIDATEN.at(-1), ...(await bildwerte(datei, KANDIDATEN.at(-1))) };
    console.warn(
      `[kopfvideo] ${path.basename(datei)}: kein klar brauchbares Standbild gefunden – ` +
        `nehme Sekunde ${gewaehlt.sekunde}. Bitte ansehen.`,
    );
  }

  await lauf('ffmpeg', [
    '-y', '-v', 'error',
    '-ss', String(gewaehlt.sekunde),
    '-i', datei,
    '-frames:v', '1',
    /* Das Standbild trägt den Kopf, solange kein Video läuft. Es darf deshalb
       nicht schlechter aussehen als das Video – aber auch nicht schwerer
       wiegen als nötig: 1280 Pixel breit, Qualitätsstufe 4 von 31. */
    '-vf', 'scale=1280:-2',
    '-q:v', '4',
    poster,
  ]);

  const posterGroesse = (await stat(poster)).size;

  berichte.push({
    datei: video.datei,
    vorher,
    nachher,
    neukodiert: neukodieren,
    posterSekunde: gewaehlt.sekunde,
    posterGroesse,
  });
}

const mb = (n) => (n / 1024 / 1024).toFixed(1);
const kb = (n) => Math.round(n / 1024);

console.log('\n[kopfvideo] Ergebnis');
let summeVor = 0;
let summeNach = 0;
for (const b of berichte) {
  summeVor += b.vorher;
  summeNach += b.nachher;
  console.log(
    `  ${b.datei.padEnd(40)} ${mb(b.vorher).padStart(5)} MB → ${mb(b.nachher).padStart(5)} MB` +
      `   Standbild bei ${String(b.posterSekunde).padStart(4)} s, ${kb(b.posterGroesse)} kB`,
  );
}
console.log(`  ${''.padEnd(40)} ${mb(summeVor).padStart(5)} MB → ${mb(summeNach).padStart(5)} MB gesamt`);
console.log(
  '\n[kopfvideo] Die Angabe "megabyte" in src/data/medien.ts auf die neuen Werte setzen:\n' +
    berichte.map((b) => `  ${b.datei}: ${(b.nachher / 1024 / 1024).toFixed(1)}`).join('\n'),
);
