#!/usr/bin/env node
/**
 * Erfasst den vollständigen Adressbestand von ku64.de – die einzige Quelle,
 * die den wahren Umfang kennt.
 *
 * ── Warum ein Crawl und nicht die .htaccess ─────────────────────────────
 *
 * Die alte `.htaccess` belegt 238 Adressen. Das ist alles, was jemand
 * irgendwann einmal weitergeleitet hat – nicht alles, was es gibt. Eine Seite,
 * die seit zehn Jahren unverändert unter derselben Adresse steht, taucht dort
 * gar nicht auf. Genau diese Seiten sind aber die, die Google kennt und deren
 * Verlust am teuersten wäre.
 *
 * Der Crawl beantwortet die Frage direkt: Welche Adressen liefert ku64.de
 * heute aus?
 *
 * ── Wie er vorgeht ──────────────────────────────────────────────────────
 *
 * Zwei Quellen, weil keine für sich vollständig ist:
 *
 *   1. Die Yoast-Sitemaps (`/sitemap_index.xml`). Sie enthalten, was das CMS
 *      für indexierbar hält – zuverlässig, aber ohne alles, was auf noindex
 *      steht oder nur verlinkt ist.
 *   2. Ein Linkcrawl ab der Startseite. Er findet, was verlinkt ist, auch wenn
 *      es die Sitemap auslässt.
 *
 * Erfasst wird je Adresse der Status, die Weiterleitungskette und – für den
 * Medienschritt – jede referenzierte Bild- und Videodatei.
 *
 * ── Rücksicht ───────────────────────────────────────────────────────────
 *
 * Sechs gleichzeitige Anfragen, GET nur für HTML. Das ist weniger Last als
 * ein einzelner Suchmaschinen-Durchlauf. Wer höher dreht, riskiert, dass
 * Cloudflare den Crawl für einen Angriff hält und die Praxis-Website dabei
 * langsam wird.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   node analyse/altbestand/crawl.mjs [--max 5000]
 *
 * Schreibt neben dem Skript:
 *   urls-crawl.txt        alle erreichbaren Adressen, eine je Zeile
 *                         (wird von `npm run urls:abgleichen` eingelesen)
 *   crawl-bericht.md      zum Lesen
 *   crawl-roh.json        alles, für Auswertungen
 *   medien-live.json      referenzierte Medien mit Fundstelle
 */

import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const HIER = import.meta.dirname;
const HOST = 'ku64.de';
const BASIS = `https://${HOST}`;
const GLEICHZEITIG = 6;

const maxArg = process.argv.indexOf('--max');
const MAX = maxArg > -1 ? Number(process.argv[maxArg + 1]) : 5000;

/** Endungen, die keine Seite sind. */
const DATEI = /\.(jpe?g|png|webp|avif|gif|svg|ico|mp4|webm|mov|m4v|pdf|zip|css|js|json|xml|txt|woff2?|ttf|eot|mp3|wav)$/i;
const MEDIUM = /\.(jpe?g|png|webp|avif|gif|mp4|webm|mov|m4v|pdf)$/i;

/**
 * Pfade, die zur Technik gehören und nicht zum Inhalt. `/wp-json/` und
 * `/feed/` liefern zwar 200, sind aber keine Seiten, die jemand aus der Suche
 * ansteuert – sie aufzunehmen würde den Bestand aufblähen, ohne ihn zu
 * verbessern.
 */
const UNINTERESSANT = [
  /^\/wp-admin/,
  /^\/wp-json/,
  /^\/wp-content/,
  /^\/wp-includes/,
  /^\/wp-login/,
  /\/feed\/?$/,
  /^\/comments\//,
  /^\/author\//,
  /\/embed\/?$/,
  /^\/\?/,
];

/** Adresse auf eine vergleichbare Form bringen. */
function normieren(roh, basis = BASIS) {
  let u;
  try {
    u = new URL(roh, basis);
  } catch {
    return null;
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
  if (u.hostname.replace(/^www\./, '') !== HOST) return null;
  u.hash = '';
  /* Abfrageparameter verwerfen: Auf einer WordPress-Seite erzeugen sie
     dieselbe Seite unter beliebig vielen Adressen. Ausnahme wäre eine echte
     Filterseite – die gibt es hier nicht. */
  u.search = '';
  let p = u.pathname;
  if (!DATEI.test(p) && !p.endsWith('/')) p += '/';
  return `https://${HOST}${p}`;
}

function pfadVon(url) {
  return url.replace(/^https:\/\/[^/]+/, '');
}

function uninteressant(url) {
  const p = pfadVon(url);
  return UNINTERESSANT.some((r) => r.test(p));
}

// ── Sitemaps ──────────────────────────────────────────────────────────

async function holen(url, methode = 'GET') {
  const antwort = await fetch(url, {
    method: methode,
    redirect: 'manual',
    headers: {
      'user-agent': 'ku64-relaunch-bestandsaufnahme/1.0 (+Migration ku64.de)',
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });
  return antwort;
}

async function sitemapLesen(url, gesehen = new Set()) {
  if (gesehen.has(url)) return [];
  gesehen.add(url);
  let text;
  try {
    const a = await fetch(url, { headers: { 'user-agent': 'ku64-relaunch-bestandsaufnahme/1.0' } });
    if (!a.ok) return [];
    text = await a.text();
  } catch {
    return [];
  }
  const locs = [...text.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1]);
  /* Ein Sitemap-Index verweist auf weitere Sitemaps. Erkennbar am Wurzel-
     element, nicht an der Endung – beide heißen .xml. */
  if (/<sitemapindex/i.test(text)) {
    const alles = [];
    for (const l of locs) alles.push(...(await sitemapLesen(l, gesehen)));
    return alles;
  }
  return locs;
}

console.log('[crawl] Sitemaps lesen …');
const ausSitemap = new Set();
for (const roh of await sitemapLesen(`${BASIS}/sitemap_index.xml`)) {
  const n = normieren(roh);
  if (n && !uninteressant(n)) ausSitemap.add(n);
}
console.log(`[crawl] ${ausSitemap.size} Adressen aus den Sitemaps`);

// ── Warteschlange ─────────────────────────────────────────────────────

/** url -> { status, ziel, titel, canonical, von } */
const ergebnis = new Map();
const medien = new Map(); // medien-url -> Set der Fundstellen
const warteschlange = [];
const eingeplant = new Set();

function einplanen(url, von) {
  if (!url || eingeplant.has(url) || uninteressant(url)) return;
  eingeplant.add(url);
  warteschlange.push({ url, von });
}

einplanen(`${BASIS}/`, 'Start');
for (const u of ausSitemap) einplanen(u, 'Sitemap');

/* Was aus der alten .htaccess belegt ist, gehört mit in den Crawl: Diese
   Adressen kennt Google sicher, und der Crawl sagt, ob sie heute noch
   irgendwo ankommen. */
try {
  const wl = JSON.parse(await (await import('node:fs/promises')).readFile(path.join(HIER, 'weiterleitungen.json'), 'utf8'));
  for (const r of wl.aktiv ?? []) {
    einplanen(normieren(r.von), 'htaccess');
    einplanen(normieren(r.nach), 'htaccess');
  }
} catch {
  /* Ohne die Datei crawlt es trotzdem, nur mit weniger Startpunkten. */
}

// ── Auslesen ──────────────────────────────────────────────────────────

/**
 * Medien aus dem Markup ziehen. `srcset` enthält mehrere Größen desselben
 * Motivs; alle werden aufgenommen und erst später auf den Stamm
 * zurückgeführt – hier zu filtern hieße raten, welche Größe das Original ist.
 */
function medienSammeln(html, seite) {
  const treffer = new Set();
  for (const m of html.matchAll(/(?:src|href|content|data-src|data-bg)\s*=\s*["']([^"']+)["']/gi)) {
    if (MEDIUM.test(m[1])) treffer.add(m[1]);
  }
  for (const m of html.matchAll(/srcset\s*=\s*["']([^"']+)["']/gi)) {
    for (const teil of m[1].split(',')) {
      const u = teil.trim().split(/\s+/)[0];
      if (u && MEDIUM.test(u)) treffer.add(u);
    }
  }
  /* Hintergrundbilder aus Elementor stehen im Inline-CSS. */
  for (const m of html.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
    if (MEDIUM.test(m[1])) treffer.add(m[1]);
  }
  for (const roh of treffer) {
    let voll;
    try {
      voll = new URL(roh, seite).href;
    } catch {
      continue;
    }
    if (!voll.includes(HOST)) continue;
    if (!medien.has(voll)) medien.set(voll, new Set());
    medien.get(voll).add(pfadVon(seite));
  }
}

function linksSammeln(html, seite) {
  const gefunden = new Set();
  for (const m of html.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi)) {
    const n = normieren(m[1], seite);
    if (n && !DATEI.test(n)) gefunden.add(n);
  }
  return gefunden;
}

let fertig = 0;

async function bearbeiten({ url, von }) {
  if (ergebnis.has(url)) return;
  let antwort;
  try {
    antwort = await holen(url);
  } catch (fehler) {
    ergebnis.set(url, { status: 0, fehler: String(fehler), von });
    return;
  }

  const eintrag = { status: antwort.status, von };

  if (antwort.status >= 300 && antwort.status < 400) {
    const ziel = normieren(antwort.headers.get('location') ?? '', url);
    eintrag.ziel = ziel ? pfadVon(ziel) : antwort.headers.get('location');
    ergebnis.set(url, eintrag);
    /* Dem Ziel folgen: Es ist eine echte Seite des Bestands. */
    if (ziel) einplanen(ziel, `Weiterleitung von ${pfadVon(url)}`);
    return;
  }

  ergebnis.set(url, eintrag);
  if (antwort.status !== 200) return;

  const typ = antwort.headers.get('content-type') ?? '';
  if (!typ.includes('html')) {
    eintrag.typ = typ;
    return;
  }

  const html = await antwort.text();
  eintrag.titel = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '')
    .replace(/\s+/g, ' ')
    .trim();
  const kanon = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1];
  if (kanon) {
    const n = normieren(kanon, url);
    if (n && n !== url) eintrag.canonical = pfadVon(n);
  }
  eintrag.noindex = /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html);

  medienSammeln(html, url);
  for (const link of linksSammeln(html, url)) einplanen(link, pfadVon(url));

  fertig++;
  if (fertig % 25 === 0) {
    process.stdout.write(
      `\r[crawl] ${ergebnis.size} geprüft, ${warteschlange.length} offen, ${medien.size} Medien`,
    );
  }
}

console.log(`[crawl] Start mit ${warteschlange.length} Adressen, ${GLEICHZEITIG} gleichzeitig`);

async function arbeiter() {
  while (warteschlange.length && ergebnis.size < MAX) {
    const naechstes = warteschlange.shift();
    if (!naechstes) return;
    await bearbeiten(naechstes);
  }
}
await Promise.all(Array.from({ length: GLEICHZEITIG }, arbeiter));
process.stdout.write('\n');

// ── Auswerten ─────────────────────────────────────────────────────────

const alle = [...ergebnis.entries()].map(([url, e]) => ({ pfad: pfadVon(url), ...e }));
const erreichbar = alle.filter((e) => e.status === 200);
const umgeleitet = alle.filter((e) => e.status >= 300 && e.status < 400);
const tot = alle.filter((e) => e.status >= 400 || e.status === 0);

alle.sort((a, b) => a.pfad.localeCompare(b.pfad));

const bereiche = new Map();
for (const e of erreichbar) {
  const erstes = `/${e.pfad.split('/').filter(Boolean)[0] ?? ''}/`;
  bereiche.set(erstes, (bereiche.get(erstes) ?? 0) + 1);
}

await writeFile(
  path.join(HIER, 'urls-crawl.txt'),
  '# Vollständiger Adressbestand von ku64.de, erhoben durch analyse/altbestand/crawl.mjs\n' +
    '# Jede Zeile eine Adresse, die live HTTP 200 liefert. Diese Datei wird von\n' +
    '# scripts/urls-abgleichen.mjs eingelesen.\n' +
    erreichbar
      .map((e) => e.pfad)
      .sort()
      .join('\n') +
    '\n',
);

await writeFile(
  path.join(HIER, 'crawl-roh.json'),
  JSON.stringify(
    {
      erhobenAm: new Date().toISOString().slice(0, 10),
      host: HOST,
      gesamt: alle.length,
      erreichbar: erreichbar.length,
      umgeleitet: umgeleitet.length,
      tot: tot.length,
      seiten: alle,
    },
    null,
    2,
  ) + '\n',
);

await writeFile(
  path.join(HIER, 'medien-live.json'),
  JSON.stringify(
    {
      erhobenAm: new Date().toISOString().slice(0, 10),
      anzahl: medien.size,
      dateien: [...medien.entries()]
        .map(([url, seiten]) => ({ url, seiten: [...seiten].sort() }))
        .sort((a, b) => b.seiten.length - a.seiten.length),
    },
    null,
    2,
  ) + '\n',
);

const bericht = `# Adressbestand von ku64.de

Erhoben am ${new Date().toISOString().slice(0, 10)} durch \`analyse/altbestand/crawl.mjs\`.

## Umfang

| | Anzahl |
|---|---:|
| Geprüfte Adressen | ${alle.length} |
| **Erreichbar (200)** | **${erreichbar.length}** |
| Weitergeleitet (3xx) | ${umgeleitet.length} |
| Fehler (4xx/5xx) | ${tot.length} |

Zum Vergleich: Die alte \`.htaccess\` belegte ${238} Adressen. Der Crawl findet
${erreichbar.length} tatsächlich ausgelieferte Seiten.

## Nach Bereich

| Bereich | Seiten |
|---|---:|
${[...bereiche]
  .sort((a, b) => b[1] - a[1])
  .map(([b, n]) => `| \`${b}\` | ${n} |`)
  .join('\n')}

## Seiten mit noindex

Diese Seiten stehen zwar im Bestand, sind aber vom Altbestand selbst aus dem
Index genommen. Für sie ist eine Weiterleitung ausreichend, eine eigene Seite
nicht nötig.

${
  erreichbar.filter((e) => e.noindex).length
    ? erreichbar
        .filter((e) => e.noindex)
        .map((e) => `- \`${e.pfad}\``)
        .join('\n')
    : 'Keine.'
}

## Weiterleitungen, die der Altbestand selbst schon fährt

${
  umgeleitet.length
    ? umgeleitet
        .slice(0, 60)
        .map((e) => `- \`${e.pfad}\` → \`${e.ziel}\` (${e.status})`)
        .join('\n') + (umgeleitet.length > 60 ? `\n- … und ${umgeleitet.length - 60} weitere` : '')
    : 'Keine.'
}

## Adressen, die schon heute ins Leere laufen

Diese Adressen sind aus der alten \`.htaccess\` oder aus Verlinkungen bekannt,
liefern aber bereits auf ku64.de einen Fehler. Sie müssen auf der neuen
Website nicht bedient werden – dort ist nichts zu verlieren.

${
  tot.length
    ? tot.map((e) => `- \`${e.pfad}\` (${e.status || e.fehler}, gefunden über ${e.von})`).join('\n')
    : 'Keine.'
}

## Medien

${medien.size} referenzierte Bild- und Videodateien, siehe \`medien-live.json\`.
`;

await writeFile(path.join(HIER, 'crawl-bericht.md'), bericht);

console.log(`
[crawl] Fertig.
  geprüft      ${alle.length}
  erreichbar   ${erreichbar.length}
  umgeleitet   ${umgeleitet.length}
  Fehler       ${tot.length}
  Medien       ${medien.size}
  Geschrieben: urls-crawl.txt, crawl-bericht.md, crawl-roh.json, medien-live.json`);
