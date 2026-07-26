#!/usr/bin/env node
/**
 * Findet heraus, welche Bilder und Videos der alten Website tatsächlich
 * benutzt werden – und welche nur Ballast sind.
 *
 * ── Warum dieses Skript und nicht einfach alles übernehmen ──────────────
 *
 * Eine Stichprobe aus dem Backup (uploads/2026/07/) zeigt die Struktur:
 * 20 Dateien, aber nur 2 Motive. WordPress legt zu jedem hochgeladenen Bild
 * automatisch Ableitungen an – hier zwei Formate (Original und WebP) in je
 * fünf Größen. Zehn Dateien je Motiv.
 *
 * Wer so ein Verzeichnis unbesehen übernimmt, schleppt neunmal Ballast mit
 * und weiß am Ende trotzdem nicht, welches Motiv wo hingehört. Die neue
 * Website erzeugt ihre Größen selbst; gebraucht wird ausschließlich das
 * Original in bestmöglicher Qualität – und auch das nur, wenn es irgendwo
 * verwendet wird.
 *
 * ── Wie "benutzt" hier ermittelt wird ───────────────────────────────────
 *
 * Ein Motiv gilt als benutzt, wenn sein Dateiname irgendwo im Bestand
 * vorkommt: in einer Seite, in einer Elementor-Definition, in einer
 * CSS-Datei, in einem Theme oder im Datenbankabzug. Das ist bewusst großzügig
 * – lieber ein Bild zu viel behalten als eines zu wenig.
 *
 * Gesucht wird nach dem STAMM des Dateinamens, nicht nach der konkreten
 * Größe. Denn im Markup steht mal die 300er, mal die 1024er Fassung, und
 * gemeint ist immer dasselbe Motiv.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   node medien-nutzung.mjs /pfad/zum/backup
 *
 * Erzeugt neben dem Skript:
 *   medien-bericht.md     zum Lesen
 *   medien-benutzt.txt    Liste der zu übernehmenden Originale
 *   medien-kopieren.sh    fertiges Kopierskript in die neue Struktur
 */

import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BACKUP = process.argv[2];
if (!BACKUP) {
  console.error('Aufruf: node medien-nutzung.mjs /pfad/zum/backup');
  process.exit(1);
}

const HIER = import.meta.dirname;

/** Endungen, die als Medium gelten. */
const MEDIEN = /\.(jpe?g|png|webp|avif|gif|svg|mp4|webm|mov|m4v|pdf)$/i;

/** Dateien, die auf ein Medium verweisen können. */
const TEXTE = /\.(php|css|js|html?|json|xml|txt|sql|po|mo|csv)$/i;

/**
 * WordPress hängt die Maße an: name-1024x683.jpg. Das abzuschneiden führt
 * alle Ableitungen auf ihr Original zurück.
 *
 * Ebenfalls entfernt: die Zählsuffixe -1, -2, die WordPress bei
 * Namenskollisionen vergibt, und die Skalierungsmarke -scaled.
 */
function stamm(datei) {
  return datei
    .replace(MEDIEN, '')
    .replace(/-\d{2,4}x\d{2,4}$/, '')
    .replace(/-scaled$/, '')
    .replace(/-rotated$/, '')
    .toLowerCase();
}

/** Ordner, die kein Bildmaterial der Redaktion enthalten. */
const UNINTERESSANT = new Set([
  'node_modules',
  'cache',
  'wp-rocket',
  'litespeed',
  'et-cache',
  'borlabs-cookie',
  'mainwp',
  'wp-file-manager-pro',
  'backup',
  'upgrade',
  'upgrade-temp-backup',
  'wpml',
]);

console.log(`[medien] Durchsuche ${BACKUP} …`);

const medien = [];
const textdateien = [];

async function durchlaufen(ordner) {
  let eintraege;
  try {
    eintraege = await readdir(ordner, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of eintraege) {
    const voll = path.join(ordner, e.name);
    if (e.isDirectory()) {
      if (UNINTERESSANT.has(e.name.toLowerCase())) continue;
      await durchlaufen(voll);
    } else if (MEDIEN.test(e.name)) {
      medien.push(voll);
    } else if (TEXTE.test(e.name)) {
      textdateien.push(voll);
    }
  }
}

await durchlaufen(BACKUP);

console.log(`[medien] ${medien.length} Mediendateien, ${textdateien.length} durchsuchbare Dateien`);

/* Motive bilden: alle Ableitungen unter ihrem Stamm sammeln. */
const motive = new Map();
for (const datei of medien) {
  const s = stamm(path.basename(datei));
  if (!motive.has(s)) motive.set(s, { stamm: s, dateien: [], groesstes: null, bytes: 0 });
  const m = motive.get(s);
  m.dateien.push(datei);
}

for (const m of motive.values()) {
  let max = 0;
  for (const d of m.dateien) {
    const { size } = await stat(d);
    m.bytes += size;
    /* Das größte ist in aller Regel das Original. Bei gleichem Motiv in
       mehreren Formaten gewinnt damit die verlustärmere Fassung – genau die,
       aus der sich die neuen Größen am besten rechnen lassen. */
    if (size > max) {
      max = size;
      m.groesstes = d;
    }
  }
}

console.log(`[medien] ${motive.size} Motive – im Schnitt ${(medien.length / motive.size).toFixed(1)} Dateien je Motiv`);

/* Nach Verwendung suchen. Ein Durchlauf durch alle Textdateien, dabei jeden
   vorkommenden Stamm markieren – das ist deutlich schneller, als je Motiv
   einmal alles zu durchsuchen. */
const benutzt = new Set();
let gelesen = 0;

for (const datei of textdateien) {
  let inhalt;
  try {
    inhalt = (await readFile(datei, 'utf8')).toLowerCase();
  } catch {
    continue;
  }
  gelesen++;
  for (const s of motive.keys()) {
    if (!benutzt.has(s) && s.length > 4 && inhalt.includes(s)) benutzt.add(s);
  }
  if (gelesen % 200 === 0) {
    process.stdout.write(`\r[medien] ${gelesen}/${textdateien.length} geprüft, ${benutzt.size} Motive gefunden`);
  }
}
process.stdout.write('\n');

const verwendet = [...motive.values()].filter((m) => benutzt.has(m.stamm));
const verwaist = [...motive.values()].filter((m) => !benutzt.has(m.stamm));

const summe = (liste) => liste.reduce((n, m) => n + m.bytes, 0);
const mb = (n) => (n / 1024 / 1024).toFixed(1);
const nurOriginale = verwendet.reduce(async (p, m) => (await p) + (await stat(m.groesstes)).size, Promise.resolve(0));

const bericht = `# Medienbestand der alten Website

Erzeugt von \`medien-nutzung.mjs\` über \`${BACKUP}\`.

## Was drin ist

| | Anzahl | Größe |
|---|---:|---:|
| Mediendateien insgesamt | ${medien.length} | ${mb(summe([...motive.values()]))} MB |
| Davon eigenständige Motive | ${motive.size} | |
| Dateien je Motiv im Schnitt | ${(medien.length / motive.size).toFixed(1)} | |

WordPress legt zu jedem Bild automatisch Ableitungen in mehreren Größen und
Formaten an. Die neue Website erzeugt ihre Größen selbst – gebraucht wird nur
das Original.

## Was davon benutzt wird

| | Motive | Größe der Originale |
|---|---:|---:|
| **Benutzt** | ${verwendet.length} | ${mb(await nurOriginale)} MB |
| Verwaist | ${verwaist.length} | ${mb(summe(verwaist))} MB |

Benutzt heißt: Der Dateiname kommt irgendwo im Bestand vor – in einer Seite,
einer Elementor-Definition, einer CSS-Datei oder im Datenbankabzug. Die Regel
ist bewusst großzügig; lieber ein Bild zu viel behalten als eines zu wenig.

## Was zu tun ist

\`medien-benutzt.txt\` listet die zu übernehmenden Originale.
\`medien-kopieren.sh\` kopiert sie nach \`public/medien/\`.

Danach im neuen Projekt \`src/lib/bilder.ts\` je Bild einen Eintrag anlegen:
Alt-Text, Herkunft, und bei Personen die vorliegende Einwilligung. Der
Bildwächter im Build meldet jedes Bild ohne Nachweis.

## Die zwanzig größten verwaisten Motive

Falls hier etwas Wichtiges steht, stimmt die Verwendungssuche nicht – dann
bitte melden statt löschen.

${verwaist
  .sort((a, b) => b.bytes - a.bytes)
  .slice(0, 20)
  .map((m) => `- ${m.stamm} (${mb(m.bytes)} MB in ${m.dateien.length} Dateien)`)
  .join('\n')}
`;

await writeFile(path.join(HIER, 'medien-bericht.md'), bericht);
await writeFile(
  path.join(HIER, 'medien-benutzt.txt'),
  verwendet.map((m) => m.groesstes).sort().join('\n') + '\n',
);
await writeFile(
  path.join(HIER, 'medien-kopieren.sh'),
  '#!/bin/sh\n# Übernimmt nur die benutzten Originale in die neue Struktur.\nset -e\nmkdir -p public/medien\n' +
    verwendet
      .map((m) => `cp "${m.groesstes}" "public/medien/${path.basename(m.groesstes)}"`)
      .join('\n') +
    '\n',
);

console.log(`
[medien] Fertig.
  ${medien.length} Dateien → ${motive.size} Motive → ${verwendet.length} benutzt
  Übernahme: ${mb(await nurOriginale)} MB statt ${mb(summe([...motive.values()]))} MB
  Geschrieben: medien-bericht.md, medien-benutzt.txt, medien-kopieren.sh`);
