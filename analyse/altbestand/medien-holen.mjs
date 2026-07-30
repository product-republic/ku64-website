#!/usr/bin/env node
/**
 * Holt den Medienbestand der alten Website – aus der Website selbst.
 *
 * ── Warum es dieses Skript zusätzlich zu `medien-nutzung.mjs` gibt ──────────
 *
 * `medien-nutzung.mjs` wertet ein Server-Backup aus. Das Backup lag zum
 * Zeitpunkt dieser Arbeit nicht vor, ku64.de dagegen schon. Der Weg über die
 * ausgelieferte Seite hat sogar einen Vorteil, den ein Dateibaum nicht bietet:
 * Er liefert zu jedem Bild den **Verwendungszusammenhang** mit. Ein Dateiname
 * wie `bird_behandlungsraum_gespiegelt-1.webp` sagt wenig; dass genau dieses
 * Bild auf der Seite „Praxis Kurfürstendamm“ steht und dort den Alternativtext
 * „Behandlungsraum“ trägt, sagt alles.
 *
 * Deshalb wird hier nicht heruntergeladen, was da ist, sondern was benutzt
 * wird – mit der Seite dazu, auf der es benutzt wird.
 *
 * ── WordPress-Ableitungen ──────────────────────────────────────────────────
 *
 * Jedes Bild erscheint im Markup in bis zu acht Größen (`-300x200`, `-1024x683`
 * …), teils zusätzlich als WebP. Gebraucht wird ausschließlich das Original;
 * die neue Website rechnet ihre Größen selbst. `stamm()` führt alle
 * Ableitungen auf ihr Original zurück, `original()` baut die Adresse der
 * unskalierten Fassung.
 *
 * ── Aufruf ─────────────────────────────────────────────────────────────────
 *
 *   node medien-holen.mjs            # nur erfassen
 *   node medien-holen.mjs --laden    # erfassen und Originale herunterladen
 *
 * Schreibt `medien-bestand.json` (Inventar mit Fundstellen) und lädt auf
 * Wunsch nach `analyse/altbestand/roh/`. Von dort wird ausgewählt – nicht
 * alles Erfasste gehört auf die neue Website.
 */

import { mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const HIER = import.meta.dirname;
const ROH = path.join(HIER, 'roh');
const HERKUNFT = 'https://ku64.de';
const LADEN = process.argv.includes('--laden');

/** Gleichzeitige Abrufe. Höher gedreht bremst die fremde Seite aus. */
const PARALLEL = 6;

const MEDIEN = /\.(jpe?g|png|webp|avif|gif|svg|mp4|webm|mov|m4v)(\?.*)?$/i;

/** Bildquellen, die nichts mit der Praxis zu tun haben. */
const FREMD = [
  /\/plugins\//i, // Sprachflaggen, Plugin-Beiwerk
  /\/themes\/.*\/(assets|images)\/(icons?|ui)\//i,
  /i\.ytimg\.com/i,
  /gravatar/i,
  /^data:/i,
];

function istFremd(url) {
  return FREMD.some((r) => r.test(url));
}

/**
 * Führt eine WordPress-Ableitung auf ihr Original zurück:
 * `name-1024x683.jpg` → `name`. Zusätzlich fallen die Skalierungsmarke
 * `-scaled` und die Drehmarke `-rotated` weg.
 */
function stamm(datei) {
  return datei
    .replace(/\?.*$/, '')
    .replace(MEDIEN, '')
    .replace(/-\d{2,4}x\d{2,4}$/, '')
    .replace(/-scaled$/, '')
    .replace(/-rotated$/, '')
    .toLowerCase();
}

/**
 * Breite aus einer WordPress-Adresse: `name-1024x683.jpg` → 1024. Ohne
 * Maßangabe ist es die unskalierte Fassung; die zählt als die größte.
 */
function breiteAus(url) {
  const m = /-(\d{2,4})x\d{2,4}\.\w+$/.exec(url);
  return m ? Number(m[1]) : Number.MAX_SAFE_INTEGER;
}

/** Adresse der unskalierten Fassung – Endung bleibt, Maße fallen weg. */
function original(url) {
  const ohneAbfrage = url.split('?')[0];
  const endung = path.extname(ohneAbfrage);
  const ordner = path.dirname(ohneAbfrage);
  return `${ordner}/${stamm(path.basename(ohneAbfrage))}${endung}`;
}

async function abrufen(url, versuche = 3) {
  for (let i = 0; i < versuche; i++) {
    try {
      const antwort = await fetch(url, {
        headers: { 'user-agent': 'KU64-Relaunch/1.0 (Medienübernahme, eigene Website)' },
        signal: AbortSignal.timeout(120_000),
      });
      if (antwort.ok) return antwort;
      /* 404 ist eine Antwort, keine Störung – nicht wiederholen. */
      if (antwort.status === 404) return null;
    } catch {
      /* Netzfehler – der nächste Versuch folgt nach kurzer Pause. */
    }
    await new Promise((r) => setTimeout(r, 1000 * 2 ** i));
  }
  return null;
}

/** Arbeitet eine Liste mit begrenzter Gleichzeitigkeit ab. */
async function inSchichten(liste, arbeiter) {
  const ergebnis = [];
  let naechster = 0;
  await Promise.all(
    Array.from({ length: PARALLEL }, async () => {
      while (naechster < liste.length) {
        const i = naechster++;
        ergebnis[i] = await arbeiter(liste[i], i);
      }
    }),
  );
  return ergebnis;
}

/* ── Seitenliste aus den Sitemaps ─────────────────────────────────────────── */

async function seitenliste() {
  const index = await abrufen(`${HERKUNFT}/sitemap_index.xml`);
  const indexText = await index.text();
  const karten = [...indexText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  const urls = new Set();
  for (const karte of karten) {
    const antwort = await abrufen(karte);
    if (!antwort) continue;
    const text = await antwort.text();
    for (const m of text.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const url = m[1];
      /* Übersetzungen zeigen dieselben Bilder wie die deutsche Fassung. */
      if (/\/(en|fr|ru|ar)\//.test(url)) continue;
      urls.add(url);
    }
  }
  return [...urls];
}

/* ── Medien einer Seite ───────────────────────────────────────────────────── */

/**
 * Zieht alle Bildbezüge aus einer Seite. Berücksichtigt werden `img` (samt
 * `srcset` und den Lazyload-Varianten `data-src`), `video` mit Standbild,
 * `source`, Hintergrundbilder in `style`-Attributen und das `og:image`.
 */
function medienAusHtml(html, seite) {
  const funde = [];

  const merken = (roh, zusatz) => {
    if (!roh) return;
    let url = roh.trim().replace(/&amp;/g, '&');
    if (url.startsWith('//')) url = `https:${url}`;
    if (url.startsWith('/')) url = HERKUNFT + url;
    if (!url.startsWith('http')) return;
    if (!MEDIEN.test(url)) return;
    if (istFremd(url)) return;
    funde.push({ url, seite, ...zusatz });
  };

  for (const m of html.matchAll(/<img\b([^>]*)>/gi)) {
    const attr = m[1];
    const alt = /alt="([^"]*)"/i.exec(attr)?.[1] ?? '';
    const klasse = /class="([^"]*)"/i.exec(attr)?.[1] ?? '';
    merken(/(?:^|\s)src="([^"]+)"/i.exec(attr)?.[1], { alt, klasse, art: 'bild' });
    merken(/data-src="([^"]+)"/i.exec(attr)?.[1], { alt, klasse, art: 'bild' });
    for (const eintrag of (/srcset="([^"]+)"/i.exec(attr)?.[1] ?? '').split(',')) {
      merken(eintrag.trim().split(/\s+/)[0], { alt, klasse, art: 'bild' });
    }
  }

  for (const m of html.matchAll(/<video\b([^>]*)>/gi)) {
    merken(/(?:^|\s)src="([^"]+)"/i.exec(m[1])?.[1], { art: 'video' });
    merken(/poster="([^"]+)"/i.exec(m[1])?.[1], { art: 'standbild' });
  }

  for (const m of html.matchAll(/<source\b([^>]*)>/gi)) {
    merken(/(?:^|\s)src="([^"]+)"/i.exec(m[1])?.[1], { art: 'video' });
    for (const eintrag of (/srcset="([^"]+)"/i.exec(m[1])?.[1] ?? '').split(',')) {
      merken(eintrag.trim().split(/\s+/)[0], { art: 'bild' });
    }
  }

  for (const m of html.matchAll(/url\((['"]?)(https?:\/\/[^)'"]+)\1\)/gi)) {
    merken(m[2], { art: 'hintergrund' });
  }

  merken(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i.exec(html)?.[1], {
    art: 'vorschau',
  });

  /* Die Überschrift der Seite hilft später beim Zuordnen. */
  const titel = /<title>([^<]*)<\/title>/i.exec(html)?.[1] ?? '';
  return { funde, titel: titel.replace(/\s*[|–-]\s*KU64.*$/i, '').trim() };
}

/* ── Ablauf ───────────────────────────────────────────────────────────────── */

console.log('[medien] Sitemaps lesen …');
const seiten = await seitenliste();
console.log(`[medien] ${seiten.length} deutsche Seiten`);

const motive = new Map();
let geholt = 0;

await inSchichten(seiten, async (seite) => {
  const antwort = await abrufen(seite);
  geholt++;
  if (geholt % 25 === 0) process.stdout.write(`\r[medien] ${geholt}/${seiten.length} Seiten`);
  if (!antwort) return;
  const html = await antwort.text();
  const { funde, titel } = medienAusHtml(html, seite);

  for (const fund of funde) {
    const s = stamm(path.basename(fund.url.split('?')[0]));
    if (!motive.has(s)) {
      motive.set(s, {
        stamm: s,
        original: original(fund.url),
        art: fund.art,
        alt: new Set(),
        seiten: new Map(),
        /* Die Adressen, wie sie wirklich im Markup stehen. `original()` ist
           eine begründete Vermutung – bei Bildern, die WordPress mit einem
           Zeitstempel versehen hat (`…-e1749021343194.jpeg`) oder die als
           `.jpg.webp` liegen, geht sie ins Leere. Dann wird der Reihe nach
           genommen, was nachweislich ausgeliefert wird. */
        beobachtet: new Set(),
      });
    }
    const m = motive.get(s);
    m.beobachtet.add(fund.url.split('?')[0]);
    /* Video schlägt Standbild schlägt Bild: die genaueste Art gewinnt. */
    if (fund.art === 'video') m.art = 'video';
    else if (fund.art === 'standbild' && m.art !== 'video') m.art = 'standbild';
    if (fund.alt) m.alt.add(fund.alt);
    if (!m.seiten.has(fund.seite)) m.seiten.set(fund.seite, titel);
  }
});
process.stdout.write('\n');

const bestand = [...motive.values()]
  .map((m) => ({
    stamm: m.stamm,
    art: m.art,
    original: m.original,
    /* Größte zuerst: WordPress hängt die Maße an, die längste Zahl gewinnt.
       Adressen ohne Maßangabe sind unskaliert und stehen ganz vorn. */
    beobachtet: [...m.beobachtet].sort((a, b) => breiteAus(b) - breiteAus(a)),
    alt: [...m.alt],
    /* Nur die ersten Fundstellen: Ein Logo steht auf 291 Seiten, und die
       vollständige Liste bläht die Datei auf ein halbes Megabyte auf, ohne
       mehr zu belegen als die ersten acht. Die Gesamtzahl steht daneben. */
    seiten: [...m.seiten].slice(0, 8).map(([url, titel]) => ({ url, titel })),
    anzahlSeiten: m.seiten.size,
  }))
  .sort((a, b) => b.anzahlSeiten - a.anzahlSeiten || a.stamm.localeCompare(b.stamm));

await writeFile(path.join(HIER, 'medien-bestand.json'), JSON.stringify(bestand, null, 2) + '\n');
console.log(`[medien] ${bestand.length} Motive erfasst → medien-bestand.json`);

if (!LADEN) {
  console.log('[medien] Zum Herunterladen: node medien-holen.mjs --laden');
  process.exit(0);
}

/* ── Herunterladen ────────────────────────────────────────────────────────── */

await mkdir(ROH, { recursive: true });
let neu = 0;
let uebersprungen = 0;
let fehlend = 0;

await inSchichten(bestand, async (m) => {
  const ziel = path.join(ROH, path.basename(m.original));
  try {
    await stat(ziel);
    uebersprungen++;
    return;
  } catch {
    /* noch nicht da – laden */
  }

  /*
   * Der Reihe nach, von der besten zur belegten Fassung:
   *   1. das vermutete Original ohne Maßangabe,
   *   2. dessen `-scaled`-Fassung – die liefert WordPress bei großen Bildern
   *      statt des Originals aus,
   *   3. die Adressen, die auf der Seite tatsächlich stehen, größte zuerst.
   *
   * Schritt 3 ist der wichtige: Bilder mit angehängtem Zeitstempel
   * (`…-e1749021343194.jpeg`, entsteht beim Zuschneiden im Backend) und
   * doppelte Endungen (`.jpg.webp`) gibt es nur in genau dieser Schreibweise.
   * Ohne diesen Schritt fehlte jedes dritte Porträt.
   */
  const versuche = [
    m.original,
    m.original.replace(/(\.\w+)$/, '-scaled$1'),
    ...m.beobachtet,
  ];

  let antwort = null;
  for (const adresse of versuche) {
    antwort = await abrufen(adresse);
    if (antwort) break;
  }
  if (!antwort) {
    fehlend++;
    return;
  }
  await writeFile(ziel, Buffer.from(await antwort.arrayBuffer()));
  neu++;
  if (neu % 20 === 0) process.stdout.write(`\r[medien] ${neu} geladen`);
});
process.stdout.write('\n');

console.log(`[medien] ${neu} geladen, ${uebersprungen} schon da, ${fehlend} nicht abrufbar → ${ROH}`);
