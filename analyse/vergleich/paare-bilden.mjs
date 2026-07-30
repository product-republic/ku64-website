/**
 * Bildet Seitenpaare: Welche alte Adresse führt auf welche neue Seite, und
 * was hat sich dabei am Inhalt geändert?
 *
 * ── Warum das genauer ist als „74 Seiten wurden 37" ─────────────────────
 *
 * Die Zahl 74 → 37 sagt, dass es weniger Seiten gibt. Sie sagt nicht, was mit
 * den Themen passiert ist – und das ist die Frage, die zählt. Drei Fälle sind
 * zu unterscheiden, und sie haben völlig verschiedene Folgen:
 *
 *   1. Eine alte Seite → eine neue Seite. Das Thema besteht weiter, der Text
 *      ist kürzer oder länger. Vergleichbar, unspektakulär.
 *
 *   2. Mehrere alte Seiten → eine neue Seite. Das Thema besteht weiter, aber
 *      seine Unterthemen nicht mehr. „Zahnimplantat Kosten", „Implantate und
 *      Rauchen" und „Haltbarkeit" hatten je eine Adresse und je eigene
 *      Suchanfragen; jetzt sind sie zusammengefaltet. Genau hier verliert
 *      eine Website Sichtbarkeit, ohne dass eine Adresse tot ist.
 *
 *   3. Alte Seite → Sammelseite. Das Thema hat überhaupt keine eigene Seite
 *      mehr. Die Weiterleitung ist technisch in Ordnung und der Inhalt ist
 *      weg.
 *
 * Der erste Fall ist Routine, der zweite ist das Risiko, der dritte ist eine
 * Entscheidung, die jemand getroffen haben muss – und die die Praxis kennen
 * sollte.
 *
 * ── Grundlage ───────────────────────────────────────────────────────────
 *
 * `erhebung.json` (Wortzahlen beider Fassungen, je Adresse gemessen) und
 * `src/data/weiterleitungen.ts` (welche alte Adresse wohin zeigt).
 *
 * Aufruf:  node analyse/vergleich/paare-bilden.mjs
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const HIER = import.meta.dirname;
const WURZEL = path.resolve(HIER, '..', '..');

const erhebung = JSON.parse(await readFile(path.join(HIER, 'erhebung.json'), 'utf8'));
const alt = new Map(erhebung.alt.filter((x) => !x.fehler).map((x) => [x.pfad, x]));
const neu = new Map(erhebung.neu.filter((x) => !x.fehler).map((x) => [x.pfad, x]));

/* Weiterleitungen aus den Daten lesen, nicht aus der gebauten Fassung: Dort
   stehen sie als Astro-Routen und wären mühsamer zu erkennen als hier. */
const quelle = await readFile(path.join(WURZEL, 'src', 'data', 'weiterleitungen.ts'), 'utf8');
const weiter = new Map();
for (const m of quelle.matchAll(/\{\s*von:\s*'([^']+)',\s*nach:\s*'([^']+)'/g)) {
  weiter.set(m[1], m[2]);
}

/** Seiten, die kein Thema tragen, sondern auf Themen verweisen. */
const SAMMELSEITEN = new Set([
  '/',
  '/leistungen/',
  '/standorte/',
  '/blog/',
  '/kontakt/',
  '/ueber-uns/',
  '/ueber-uns/team/',
  '/zahnbeschwerden/',
]);

const ziel = (pfad) => weiter.get(pfad) ?? (neu.has(pfad) ? pfad : null);

/* ── Alle Paare ──────────────────────────────────────────────────────── */

const paare = [];
for (const [pfad, a] of alt) {
  const z = ziel(pfad);
  paare.push({
    alt: pfad,
    neu: z,
    art: z === null ? 'ohne-ziel' : SAMMELSEITEN.has(z) ? 'sammelseite' : 'eigene-seite',
    woerterAlt: a.woerter,
    woerterNeu: z && neu.has(z) ? neu.get(z).woerter : null,
    bytesAlt: a.bytes,
    bytesNeu: z && neu.has(z) ? neu.get(z).bytes : null,
  });
}

/* ── Zusammengefaltete Themen ────────────────────────────────────────── */

const jeZiel = new Map();
for (const p of paare) {
  if (!p.neu || p.art !== 'eigene-seite') continue;
  if (!jeZiel.has(p.neu)) jeZiel.set(p.neu, []);
  jeZiel.get(p.neu).push(p);
}

/**
 * Zu welchem Bereich gehört ein Pfad?
 *
 * Das ist nicht Kosmetik. Ein erster Anlauf hatte alle zusammengefalteten
 * Seiten in eine Liste geworfen – und obenauf stand
 * `/berlin-charlottenburg/team/`, weil dort 25 dünne Behandlerprofile
 * zusammengeführt wurden. Das ist eine bewusste Entscheidung mit eigener
 * Begründung (siehe src/data/profiltiefe.ts) und hat mit dem Textverlust bei
 * den Behandlungen nichts zu tun. Zusammen in einer Grafik ergeben beide
 * Befunde eine Aussage, die keiner von ihnen trägt.
 */
function bereichVon(pfad) {
  if (pfad.startsWith('/leistungen/')) return 'leistungen';
  if (pfad.startsWith('/zahnbeschwerden/')) return 'zahnbeschwerden';
  if (pfad.startsWith('/blog/')) return 'blog';
  if (/^\/([a-z-]+\/)?team\//.test(pfad)) return 'team';
  if (/^\/(potsdam|berlinmitte|wilmersdorf|berlin-charlottenburg)\//.test(pfad)) return 'standorte';
  return 'sonstige';
}

const gefaltet = [...jeZiel.entries()]
  .filter(([, liste]) => liste.length > 1)
  .map(([z, liste]) => ({
    neu: z,
    bereich: bereichVon(liste[0].alt),
    woerterNeu: neu.get(z)?.woerter ?? null,
    /* `null` heißt: Die neue Seite steht nicht in der Sitemap und wurde
       deshalb nicht erhoben – nicht, dass sie leer wäre. */
    erhoben: neu.has(z),
    anzahlAlt: liste.length,
    woerterAlt: liste.reduce((s, p) => s + p.woerterAlt, 0),
    quellen: liste
      .sort((a, b) => b.woerterAlt - a.woerterAlt)
      .map((p) => ({ pfad: p.alt, woerter: p.woerterAlt })),
  }))
  .sort((a, b) => b.woerterAlt - a.woerterAlt);

/* ── Themen ohne eigene Seite ────────────────────────────────────────── */

const verloren = paare
  .filter((p) => p.art === 'sammelseite' && p.alt !== p.neu)
  .sort((a, b) => b.woerterAlt - a.woerterAlt);

/* ── Bereichsweise Bilanz ────────────────────────────────────────────── */

function bilanz(prefix) {
  const teil = paare.filter((p) => p.alt.startsWith(prefix));
  const mitZiel = teil.filter((p) => p.woerterNeu !== null);
  return {
    seitenAlt: teil.length,
    seitenNeuGetroffen: new Set(mitZiel.map((p) => p.neu)).size,
    woerterAlt: teil.reduce((s, p) => s + p.woerterAlt, 0),
    woerterNeu: [...new Set(mitZiel.map((p) => p.neu))].reduce(
      (s, z) => s + (neu.get(z)?.woerter ?? 0),
      0,
    ),
  };
}

const ergebnis = {
  erhobenAm: erhebung.erhobenAm,
  paare,
  gefaltet,
  verloren,
  bereiche: {
    leistungen: bilanz('/leistungen/'),
    zahnbeschwerden: bilanz('/zahnbeschwerden/'),
    blog: bilanz('/blog/'),
    team: bilanz('/team/'),
  },
};

await writeFile(path.join(HIER, 'paare.json'), JSON.stringify(ergebnis, null, 1));

console.log(`[paare] ${paare.length} Paare`);
console.log(
  `[paare] ${paare.filter((p) => p.art === 'eigene-seite').length} auf eine eigene Seite, ` +
    `${verloren.length} auf eine Sammelseite, ` +
    `${paare.filter((p) => p.art === 'ohne-ziel').length} ohne Ziel`,
);
const jeBereich = {};
for (const g of gefaltet) jeBereich[g.bereich] = (jeBereich[g.bereich] ?? 0) + 1;
console.log(
  `[paare] ${gefaltet.length} neue Seiten ersetzen jeweils mehrere alte ` +
    `(${Object.entries(jeBereich)
      .map(([b, n]) => `${b}: ${n}`)
      .join(', ')})`,
);
console.log(
  `[paare] Behandlungen: ${ergebnis.bereiche.leistungen.woerterAlt.toLocaleString('de-DE')} → ` +
    `${ergebnis.bereiche.leistungen.woerterNeu.toLocaleString('de-DE')} Wörter`,
);
console.log(
  `[paare] Beschwerden:  ${ergebnis.bereiche.zahnbeschwerden.woerterAlt.toLocaleString('de-DE')} → ` +
    `${ergebnis.bereiche.zahnbeschwerden.woerterNeu.toLocaleString('de-DE')} Wörter`,
);
console.log('[paare] → analyse/vergleich/paare.json');
