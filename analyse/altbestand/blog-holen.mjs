#!/usr/bin/env node
/**
 * Holt den Blog der alten Website – Artikel, Bilder, Datum, Standortbezug.
 *
 * ── Warum vollständig und nicht in Auswahl ─────────────────────────────────
 *
 * Der Blog ist der einzige Bereich, für den es im Neubau bislang keine
 * Entsprechung gab: 56 Adressen liefen bewusst ins Leere, weil eine
 * Weiterleitung auf eine unpassende Seite schlechter gewesen wäre als eine
 * ehrliche Fehlerseite. Mit den Artikeln selbst erübrigt sich die Frage –
 * jede dieser Adressen bekommt wieder eine Seite mit ihrem Inhalt.
 *
 * ── Standortbezug, automatisch ────────────────────────────────────────────
 *
 * Die alte Website kennt keine Standortzuordnung für Artikel. Sie steckt
 * aber im Text: Ein Beitrag über die Eröffnung in Wilmersdorf nennt
 * Wilmersdorf, einer über das Meisterlabor den Kurfürstendamm. `standorte()`
 * liest diese Nennungen aus – Adresse, Bezirksname, Hausname, Personen des
 * Standorts.
 *
 * Bewusst vorsichtig: Nur wer im Titel oder mehrfach im Text vorkommt, gilt
 * als Bezug. Sonst wäre jeder Artikel, der einmal die Praxisadresse in der
 * Fußzeile erwähnt, plötzlich ein Kurfürstendamm-Artikel – und die
 * Zuordnung wertlos.
 *
 * ── Aufruf ────────────────────────────────────────────────────────────────
 *
 *   node blog-holen.mjs [--nur 3]
 *
 * Schreibt `src/data/blog.json` und lädt die Beitragsbilder nach
 * `public/blog/`.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const HIER = import.meta.dirname;
const WURZEL = path.resolve(HIER, '../..');
const BILDER_ZIEL = path.join(WURZEL, 'public/blog');
const PARALLEL = 4;

const nurIndex = process.argv.indexOf('--nur');
const NUR = nurIndex >= 0 ? Number(process.argv[nurIndex + 1]) : Infinity;

/**
 * Wonach ein Standortbezug erkannt wird.
 *
 * Die Begriffe sind absichtlich eindeutig: „Berlin“ steht in jedem zweiten
 * Artikel und sagt nichts über den Standort, „Hausvogteiplatz“ dagegen
 * schon.
 */
const STANDORT_MARKER = {
  'berlin-charlottenburg': ['kurfürstendamm', 'kudamm', "ku'damm", 'charlottenburg'],
  berlinmitte: ['hausvogteiplatz', 'berlin-mitte', 'berlin mitte'],
  potsdam: ['potsdam', 'palais ritz'],
  wilmersdorf: ['wilmersdorf', 'kiezpraxis', 'kiez-praxis', 'gasteiner'],
};

function entschaerfen(roh) {
  return roh
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|h[1-6])>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, z) => String.fromCodePoint(Number(z)))
    .replace(/&#x([0-9a-f]+);/gi, (_, z) => String.fromCodePoint(parseInt(z, 16)))
    .replace(/&shy;/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

async function abrufen(url, versuche = 3) {
  for (let i = 0; i < versuche; i++) {
    try {
      const a = await fetch(url, {
        headers: { 'user-agent': 'KU64-Relaunch/1.0 (Blogübernahme, eigene Website)' },
        signal: AbortSignal.timeout(60_000),
      });
      if (a.ok) return a;
      if (a.status === 404) return null;
    } catch {
      /* nächster Versuch */
    }
    await new Promise((r) => setTimeout(r, 1000 * 2 ** i));
  }
  return null;
}

/** Standortbezüge eines Artikels – siehe Kopfkommentar. */
function standorte(titel, text) {
  const t = titel.toLowerCase();
  const k = text.toLowerCase();
  const gefunden = [];
  for (const [slug, marker] of Object.entries(STANDORT_MARKER)) {
    const imTitel = marker.some((m) => t.includes(m));
    const treffer = marker.reduce(
      (n, m) => n + (k.split(m).length - 1),
      0,
    );
    if (imTitel || treffer >= 2) gefunden.push(slug);
  }
  return gefunden;
}

/**
 * Der Artikelkörper.
 *
 * Übernommen werden Überschriften, Absätze und Listen in ihrer Reihenfolge –
 * mehr braucht ein Fachbeitrag nicht, und alles Weitere (Elementor-Kästen,
 * Teilen-Leisten, verwandte Beiträge) gehört nicht zum Text.
 */
function koerper(html) {
  const von = html.indexOf('<main');
  const bis = html.indexOf('</main');
  const bereich = von >= 0 && bis > von ? html.slice(von, bis) : html;

  const bloecke = [];
  const muster = /<(h2|h3|p|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = muster.exec(bereich))) {
    const art = m[1].toLowerCase();
    if (art === 'ul' || art === 'ol') {
      const punkte = [...m[2].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
        .map((x) => entschaerfen(x[1]))
        .filter((x) => x.length > 1);
      /* Navigationslisten haben viele sehr kurze Einträge und keine Sätze. */
      const istText = punkte.length > 0 && punkte.some((p) => p.length > 25);
      if (istText) bloecke.push({ art: 'liste', punkte });
      continue;
    }
    const text = entschaerfen(m[2]);
    if (!text || text.length < 3) continue;
    if (/^(zum profil|mehr erfahren|weiterlesen|teilen|jetzt termin)/i.test(text)) continue;
    /* Das Datum steht auf der alten Seite als erster Absatz im Text. Wir
       führen es als eigenes Feld – zweimal dasselbe wäre Redaktionsmüll. */
    if (/^datum:\s*\d{1,2}\.\d{1,2}\.\d{2,4}$/i.test(text)) continue;
    /* Das eingebaute Inhaltsverzeichnis: eine Zeile aus lauter kurzen
       Sprungmarken, durch senkrechte Striche getrennt. Auf der neuen Seite
       übernimmt das die Gliederung selbst. */
    if ((text.match(/\|/g)?.length ?? 0) >= 3 && text.length < 400) continue;
    bloecke.push({ art, text });
  }
  return bloecke;
}

/* ── Beiträge einsammeln ──────────────────────────────────────────────────*/

const sitemap = await abrufen('https://ku64.de/post-sitemap.xml');
const xml = await sitemap.text();
const adressen = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1])
  .filter((u) => /\/blog\/./.test(u))
  .slice(0, NUR);

console.log(`[blog] ${adressen.length} Beiträge`);

await mkdir(BILDER_ZIEL, { recursive: true });

const beitraege = [];
let fertig = 0;
let naechster = 0;

await Promise.all(
  Array.from({ length: PARALLEL }, async () => {
    while (naechster < adressen.length) {
      const url = adressen[naechster++];
      const antwort = await abrufen(url);
      fertig++;
      process.stdout.write(`\r[blog] ${fertig}/${adressen.length}`);
      if (!antwort) continue;
      const html = await antwort.text();

      const slug = url.replace(/\/$/, '').split('/').pop();
      const titel = entschaerfen(
        /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html)?.[1] ??
          /<title>([^<]*)<\/title>/i.exec(html)?.[1] ??
          slug,
      ).replace(/\s*[•|]\s*KU64.*$/i, '');

      const datum =
        /"datePublished"\s*:\s*"([^"]+)"/.exec(html)?.[1] ??
        /<meta[^>]+property="article:published_time"[^>]+content="([^"]+)"/i.exec(html)?.[1] ??
        null;

      const bloecke = koerper(html);
      const text = bloecke.map((b) => b.text ?? (b.punkte ?? []).join(' ')).join(' ');
      if (text.length < 200) continue;

      /* Beitragsbild: das og:image ist auf dieser Website verlässlich das
         Motiv des Artikels – die Bilder im Text sind es nicht immer. */
      const bildUrl = /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i.exec(html)?.[1];
      let bild = null;
      if (bildUrl && !/plugins|flags/.test(bildUrl)) {
        const bildAntwort = await abrufen(bildUrl);
        if (bildAntwort) {
          const roh = Buffer.from(await bildAntwort.arrayBuffer());
          try {
            const ziel = path.join(BILDER_ZIEL, `${slug}.jpg`);
            const bearbeitet = sharp(roh).resize({ width: 1400, withoutEnlargement: true });
            const { width, height } = await bearbeitet.metadata();
            await bearbeitet.jpeg({ quality: 80, mozjpeg: true, progressive: true }).toFile(ziel);
            const masse = await sharp(ziel).metadata();
            bild = { pfad: `/blog/${slug}.jpg`, breite: masse.width, hoehe: masse.height };
          } catch {
            /* Kein brauchbares Bild – der Beitrag steht auch ohne. */
          }
        }
      }

      beitraege.push({
        slug,
        titel,
        datum,
        jahr: datum ? Number(datum.slice(0, 4)) : null,
        standorte: standorte(titel, text),
        anriss: (bloecke.find((b) => b.art === 'p')?.text ?? '').slice(0, 220),
        bloecke,
        bild,
        quelle: url,
      });
    }
  }),
);
process.stdout.write('\n');

/* Neueste zuerst; Beiträge ohne Datum ans Ende. */
beitraege.sort((a, b) => (b.datum ?? '').localeCompare(a.datum ?? ''));

await writeFile(
  path.join(WURZEL, 'src/data/blog.json'),
  JSON.stringify(beitraege, null, 2) + '\n',
);

const jahre = {};
for (const b of beitraege) jahre[b.jahr ?? 'ohne Datum'] = (jahre[b.jahr ?? 'ohne Datum'] ?? 0) + 1;
const orte = {};
for (const b of beitraege) {
  if (!b.standorte.length) orte['(kein Standortbezug)'] = (orte['(kein Standortbezug)'] ?? 0) + 1;
  for (const s of b.standorte) orte[s] = (orte[s] ?? 0) + 1;
}

console.log(`[blog] ${beitraege.length} Beiträge übernommen, ${beitraege.filter((b) => b.bild).length} mit Bild`);
console.log('[blog] Nach Jahr:', jahre);
console.log('[blog] Standortbezug:', orte);
console.log('\n[blog] → src/data/blog.json');
