/**
 * Erzeugt die Vorschaubilder für Social Media und Messenger (OpenGraph).
 *
 * Warum selbst erzeugt statt Stock: Diese Bilder zeigen ausschließlich echte
 * Daten der jeweiligen Seite – Standortname, Adresse, Behandlung, Telefonnummer.
 * Sie sind rein typografisch. Es wird keine Fotografie erfunden, keine Praxis
 * nachgestellt und kein Mensch abgebildet, den es nicht gibt.
 *
 * Läuft VOR dem Astro-Build, damit die Dateien unter public/og/ liegen und
 * regulär mit ausgeliefert werden.
 *
 * Schriften: Die Markenschriften liegen als woff2 vor, librsvg kann die nicht
 * lesen. Sie werden deshalb hier nach OTF entpackt und für fontconfig
 * bereitgestellt. Am Ende prüft das Skript, dass tatsächlich Text im Bild
 * gelandet ist – ohne diese Prüfung würde ein fehlendes Schriftpaket lautlos
 * leere Kacheln erzeugen.
 */

import { mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { homedir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { decompress } from 'wawoff2';

const execFileP = promisify(execFile);

const WURZEL = path.resolve(import.meta.dirname, '..');
const ZIEL = path.join(WURZEL, 'public', 'og');
const BREITE = 1200;
const HOEHE = 630;

// ─────────────────────────── Schriften bereitstellen ───────────────────────────

async function schriftenVorbereiten() {
  const schriftOrdner = path.join(homedir(), '.fonts');
  await mkdir(schriftOrdner, { recursive: true });

  const paare = [
    ['@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2', 'ku64-fraunces.otf'],
    ['@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', 'ku64-inter.otf'],
  ];

  for (const [quelle, ziel] of paare) {
    const q = path.join(WURZEL, 'node_modules', quelle);
    if (!existsSync(q)) throw new Error(`Schriftdatei fehlt: ${q}`);
    await writeFile(path.join(schriftOrdner, ziel), await decompress(await readFile(q)));
  }

  try {
    await execFileP('fc-cache', ['-f']);
  } catch {
    // fc-cache fehlt in manchen Images. Der Rendertest unten deckt auf,
    // ob die Schriften trotzdem gefunden werden.
  }
}

// ─────────────────────────── Bild bauen ───────────────────────────

/** XML-Escaping – Behandlungsnamen enthalten & und Anführungszeichen. */
const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Bricht Text auf mehrere Zeilen um. Grobe Schätzung über die Zeichenbreite –
 * genau genug, weil die Schriftgröße unten an die Länge angepasst wird.
 */
function umbrechen(text, maxZeichen, maxZeilen = 3) {
  const worte = String(text).split(' ');
  const zeilen = [];
  let aktuell = '';

  for (const wort of worte) {
    const versuch = aktuell ? `${aktuell} ${wort}` : wort;
    if (versuch.length > maxZeichen && aktuell) {
      zeilen.push(aktuell);
      aktuell = wort;
      if (zeilen.length === maxZeilen) break;
    } else {
      aktuell = versuch;
    }
  }
  if (aktuell && zeilen.length < maxZeilen) zeilen.push(aktuell);
  return zeilen;
}

function svgBauen({ titel, unterzeile, fusszeile, akzent }) {
  const maxZeichen = titel.length > 40 ? 26 : 20;
  const zeilen = umbrechen(titel, maxZeichen, 3);
  const groesse = zeilen.length >= 3 ? 62 : zeilen.length === 2 ? 74 : 86;
  const startY = 300 - ((zeilen.length - 1) * groesse * 1.12) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${BREITE}" height="${HOEHE}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1b1512"/>
      <stop offset="100%" stop-color="#0d0a08"/>
    </linearGradient>
  </defs>

  <rect width="${BREITE}" height="${HOEHE}" fill="url(#g)"/>

  <!-- Akzentbalken des Standorts -->
  <rect x="0" y="0" width="${BREITE}" height="10" fill="${akzent}"/>

  <!-- Zurückhaltendes geometrisches Motiv statt eines Fotos -->
  <circle cx="1060" cy="512" r="230" fill="none" stroke="${akzent}" stroke-width="1.5" opacity="0.22"/>
  <circle cx="1060" cy="512" r="150" fill="none" stroke="${akzent}" stroke-width="1.5" opacity="0.14"/>

  <text x="80" y="118" font-family="Fraunces" font-size="40" fill="${akzent}" letter-spacing="-1">KU64</text>
  <text x="196" y="118" font-family="Inter" font-size="17" fill="#8f857d" letter-spacing="3">DIE ZAHNSPEZIALISTEN</text>

  ${zeilen
    .map(
      (z, i) =>
        `<text x="80" y="${startY + i * groesse * 1.12}" font-family="Fraunces" font-size="${groesse}" fill="#f5f1ed" letter-spacing="-2">${esc(z)}</text>`,
    )
    .join('\n  ')}

  ${
    unterzeile
      ? `<text x="80" y="${startY + zeilen.length * groesse * 1.12 + 34}" font-family="Inter" font-size="30" fill="#c4bab2">${esc(unterzeile)}</text>`
      : ''
  }

  <rect x="80" y="536" width="52" height="3" fill="${akzent}"/>
  ${fusszeile ? `<text x="80" y="580" font-family="Inter" font-size="23" fill="#8f857d">${esc(fusszeile)}</text>` : ''}
</svg>`;
}

async function bildSchreiben(datei, daten) {
  const puffer = await sharp(Buffer.from(svgBauen(daten)))
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();

  await writeFile(path.join(ZIEL, datei), puffer);
  return puffer;
}

// ─────────────────────────── Ablauf ───────────────────────────

async function main() {
  await schriftenVorbereiten();
  await rm(ZIEL, { recursive: true, force: true });
  await mkdir(ZIEL, { recursive: true });

  // Datenquellen sind dieselben Dateien, aus denen die Seiten entstehen.
  const { STANDORTE } = await import('../src/data/standorte.ts');
  const { LEISTUNGEN } = await import('../src/data/leistungen.ts');

  let anzahl = 0;
  let pruefPuffer = null;

  // Standardbild für alle Seiten ohne eigenes Motiv
  pruefPuffer = await bildSchreiben('ku64-standard.png', {
    titel: 'Zahnmedizin in Berlin und Potsdam',
    unterzeile: `${STANDORTE.length} Standorte · ${LEISTUNGEN.length} Behandlungen`,
    fusszeile: 'ku64.de',
    akzent: '#e8532e',
  });
  anzahl++;

  for (const s of STANDORTE) {
    await bildSchreiben(`standort-${s.slug}.png`, {
      titel: `Ihr Zahnarzt in ${s.bezirk ? `${s.ort}-${s.bezirk}` : s.ort}`,
      unterzeile: `KU64 ${s.name}`,
      fusszeile: `${s.strasse}, ${s.plz} ${s.ort} · ${s.telefon}`,
      akzent: s.akzent,
    });
    anzahl++;

    // Ein Bild je Behandlung an diesem Standort – der Ortsbezug ist genau
    // das, was beim Teilen sichtbar werden soll.
    for (const l of LEISTUNGEN) {
      if (!l.verfuegbar.includes(s.slug)) continue;
      await bildSchreiben(`${s.slug}--${l.slug}.png`, {
        titel: l.name,
        unterzeile: `bei KU64 ${s.name}`,
        fusszeile: `${s.strasse}, ${s.plz} ${s.ort} · ${s.telefon}`,
        akzent: s.akzent,
      });
      anzahl++;
    }
  }

  // Standortübergreifende Leistungsseiten
  for (const l of LEISTUNGEN) {
    const orte = l.verfuegbar
      .map((slug) => STANDORTE.find((s) => s.slug === slug)?.name)
      .filter(Boolean);
    await bildSchreiben(`leistung-${l.slug}.png`, {
      titel: l.name,
      unterzeile: 'KU64 – Die Zahnspezialisten',
      fusszeile: orte.length ? `Verfügbar an: ${orte.join(', ')}` : 'Bitte sprechen Sie uns an',
      akzent: '#e8532e',
    });
    anzahl++;
  }

  // Prüfung: Ist überhaupt Text im Bild gelandet? Ohne Schriften wäre die
  // Kachel einfarbig und der Fehler würde erst beim Teilen auffallen.
  const werte = await sharp(pruefPuffer).stats();
  const varianz = werte.channels.reduce((summe, k) => summe + k.stdev, 0);

  if (varianz < 20) {
    throw new Error(
      `OG-Bilder sind praktisch leer (Varianz ${varianz.toFixed(1)}). ` +
        'Vermutlich fehlen fontconfig oder die Schriftdateien im Build-Image.',
    );
  }

  console.log(`[og] ${anzahl} Vorschaubilder erzeugt (Prüfvarianz ${varianz.toFixed(1)})`);
}

main().catch((e) => {
  console.error('[og] Fehlgeschlagen:', e.message);
  process.exit(1);
});
