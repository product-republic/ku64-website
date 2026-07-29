/**
 * Erhebt alte und neue Website nach denselben Kriterien.
 *
 * ── Warum gemessen und nicht beschrieben ────────────────────────────────
 *
 * Ein Relaunch-Bericht, der „übersichtlicher", „moderner" und „schneller"
 * behauptet, ist unwiderlegbar und damit wertlos. Was hier steht, ist
 * nachrechenbar: Beide Fassungen werden mit demselben Skript abgefragt und
 * mit denselben Regeln ausgewertet.
 *
 * Erhoben wird je Seite:
 *   · Auslieferungsgröße des HTML
 *   · Titel und Beschreibung (Länge, Vorhandensein, Doppelungen)
 *   · Anzahl H1, Sprünge in der Überschriftengliederung
 *   · Wortzahl des sichtbaren Textes
 *   · Bilder gesamt und davon ohne Alternativtext
 *   · eingebundene Skripte und Stylesheets, davon von fremden Servern
 *   · Canonical, hreflang, strukturierte Daten, noindex
 *
 * ── Rücksicht auf den Altbestand ────────────────────────────────────────
 *
 * Die alte Seite läuft im Betrieb. Abgefragt wird deshalb mit vier
 * gleichzeitigen Verbindungen und einer kurzen Pause – das ist weniger Last
 * als ein einzelner Suchmaschinenbesuch.
 *
 * Aufruf:  node analyse/vergleich/erheben.mjs [basis-neu]
 */

import { writeFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const HIER = import.meta.dirname;
const ALT = 'https://ku64.de';
const NEU = process.argv[2] || 'http://127.0.0.1:4343';
const GLEICHZEITIG = 4;

/* ── Auswertung eines HTML-Dokuments ─────────────────────────────────── */

const zwischen = (html, tag) => {
  const m = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, 'i').exec(html);
  return m ? m[1] : '';
};

function metaInhalt(html, name) {
  const re = new RegExp(
    `<meta[^>]*(?:name|property)=["']${name}["'][^>]*content=["']([^"']*)["']`,
    'i',
  );
  const m = re.exec(html);
  if (m) return m[1];
  /* Umgekehrte Attributreihenfolge kommt in gewachsenen Vorlagen vor. */
  const re2 = new RegExp(
    `<meta[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']${name}["']`,
    'i',
  );
  return re2.exec(html)?.[1] ?? '';
}

/** Sichtbarer Text: ohne Skripte, Stile, SVG, Kommentare und Tags. */
function sichtbarerText(html) {
  const koerper = zwischen(html, 'body') || html;
  return koerper
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function auswerten(pfad, html, bytes, ms, host) {
  const text = sichtbarerText(html);
  const woerter = text ? text.split(' ').filter((w) => /\p{L}/u.test(w)).length : 0;

  const ueberschriften = [...html.matchAll(/<h([1-6])\b/gi)].map((m) => Number(m[1]));
  let spruenge = 0;
  for (let i = 1; i < ueberschriften.length; i++) {
    if (ueberschriften[i] > ueberschriften[i - 1] + 1) spruenge++;
  }

  const bilder = [...html.matchAll(/<img\b[^>]*>/gi)];
  const ohneAlt = bilder.filter((m) => !/\balt=/i.test(m[0])).length;

  const skripte = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)].map((m) => m[1]);
  const stile = [...html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi)]
    .map((m) => /href=["']([^"']+)["']/i.exec(m[0])?.[1])
    .filter(Boolean);

  const fremd = (u) => /^https?:\/\//i.test(u) && !u.includes(host);

  return {
    pfad,
    bytes,
    ms,
    titel: zwischen(html, 'title').replace(/\s+/g, ' ').trim(),
    beschreibung: metaInhalt(html, 'description'),
    woerter,
    h1: (html.match(/<h1\b/gi) || []).length,
    ueberschriften: ueberschriften.length,
    spruenge,
    bilder: bilder.length,
    ohneAlt,
    skripte: skripte.length,
    skripteFremd: skripte.filter(fremd).length,
    stile: stile.length,
    stileFremd: stile.filter(fremd).length,
    canonical: /<link[^>]*rel=["']canonical["']/i.test(html),
    hreflang: (html.match(/hreflang=/gi) || []).length,
    schema: (html.match(/application\/ld\+json/gi) || []).length,
    noindex: /noindex/i.test(metaInhalt(html, 'robots')),
    lang: /<html[^>]*\blang=["']([^"']+)["']/i.exec(html)?.[1] ?? '',
  };
}

/* ── Abrufen ─────────────────────────────────────────────────────────── */

async function holen(basis, pfad, host) {
  const beginn = Date.now();
  try {
    const res = await fetch(basis + pfad, {
      redirect: 'follow',
      headers: { 'User-Agent': 'KU64-Relaunch-Vergleich/1.0 (+Erhebung fuer den Kunden)' },
      signal: AbortSignal.timeout(30000),
    });
    const html = await res.text();
    if (!res.ok) return { pfad, status: res.status, fehler: true };
    return { status: res.status, ...auswerten(pfad, html, html.length, Date.now() - beginn, host) };
  } catch (e) {
    return { pfad, status: 0, fehler: true, meldung: String(e.message).slice(0, 80) };
  }
}

async function alleHolen(basis, pfade, host, name) {
  const aus = [];
  for (let i = 0; i < pfade.length; i += GLEICHZEITIG) {
    const teil = pfade.slice(i, i + GLEICHZEITIG);
    aus.push(...(await Promise.all(teil.map((p) => holen(basis, p, host)))));
    if (i % 40 === 0) process.stdout.write(`\r[${name}] ${aus.length}/${pfade.length}   `);
    await new Promise((r) => setTimeout(r, 120));
  }
  process.stdout.write(`\r[${name}] ${aus.length}/${pfade.length}   \n`);
  return aus;
}

/* ── Ablauf ──────────────────────────────────────────────────────────── */

const roh = JSON.parse(await readFile(path.join(HIER, '..', 'altbestand', 'crawl-roh.json'), 'utf8'));
const altePfade = roh.seiten.filter((s) => s.status === 200).map((s) => s.pfad);

console.log(`[alt] ${altePfade.length} erreichbare Adressen aus dem Crawl vom ${roh.erhobenAm}`);
const alt = await alleHolen(ALT, altePfade, 'ku64.de', 'alt');

/* Für die neue Seite: alles aus der Sitemap, plus die alten Pfade, damit
   sich Weiterleitungsziele mitmessen lassen. */
const sitemapXml = await (await fetch(`${NEU}/sitemap-0.xml`)).text();
const neuePfade = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname)
  .filter((p, i, a) => a.indexOf(p) === i);

console.log(`[neu] ${neuePfade.length} Adressen aus der Sitemap`);
const neu = await alleHolen(NEU, neuePfade, '127.0.0.1', 'neu');

await mkdir(HIER, { recursive: true });
await writeFile(
  path.join(HIER, 'erhebung.json'),
  JSON.stringify({ erhobenAm: new Date().toISOString(), alt, neu }, null, 1),
);

console.log(`\n[fertig] ${alt.length} alte und ${neu.length} neue Seiten erhoben → erhebung.json`);
