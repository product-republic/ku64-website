#!/usr/bin/env node
/**
 * Schreibt SITEMAP.md – die Seitenübersicht zum Weitergeben.
 *
 * ── Warum zusätzlich zur XML-Sitemap ───────────────────────────────────
 *
 * Die XML-Sitemap ist für Suchmaschinen. Sie ist eine einzige Zeile mit 362
 * Adressen, und kein Mensch liest sie. Wer aber wissen will, was auf dieser
 * Website steht – die Praxis, die Agentur, jemand im Abnahmetermin –,
 * braucht eine Gliederung: nach Standort, nach Bereich, mit Anzahl.
 *
 * ── Warum aus dem Bauergebnis und nicht aus den Daten ──────────────────
 *
 * Weil nur das Bauergebnis die Wahrheit ist. Aus den Daten ließe sich
 * ableiten, welche Seiten entstehen SOLLTEN; gebaut wird, was tatsächlich
 * entsteht. Zwischen beidem lag auf diesem Projekt schon mehr als einmal
 * ein Unterschied – eine Weiterleitung, die eine echte Seite verdeckte,
 * eine Route, die mit einer anderen kollidierte.
 *
 * Gelesen wird deshalb `dist/client/sitemap-0.xml`: dieselbe Datei, die
 * Google bekommt.
 *
 * ── Aufruf ─────────────────────────────────────────────────────────────
 *
 *   npm run build && npm run sitemap:liste
 */

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { STANDORTE } from '../src/data/standorte.ts';

const WURZEL = path.resolve(import.meta.dirname, '..');
const XML = path.join(WURZEL, 'dist', 'client', 'sitemap-0.xml');

if (!existsSync(XML)) {
  console.error('[sitemap] dist/client/sitemap-0.xml fehlt – bitte zuerst bauen.');
  process.exit(1);
}

const roh = await readFile(XML, 'utf8');
const adressen = [...roh.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const basis = adressen[0]?.match(/^https?:\/\/[^/]+/)?.[0] ?? 'https://ku64.de';
const pfade = adressen.map((a) => a.replace(basis, '')).sort();

/*
 * Steht in der Sitemap etwas, das die Seite selbst nicht indexiert haben
 * will?
 *
 * Das ist ein Widerspruch mit Ansage: Die Sitemap sagt „bitte aufnehmen",
 * die Seite sagt „bitte nicht". Die Search Console meldet das als Fehler,
 * und sie hat recht – eine der beiden Angaben ist falsch, und welche, weiß
 * sie nicht.
 *
 * Gefunden hat es diese Prüfung bei /impressum/, /datenschutz/ und
 * /wilmersdorf/team/: alle drei tragen `noindex, follow` und standen
 * trotzdem in der Liste. Geprüft wird gegen das gebaute HTML, nicht gegen
 * eine zweite Liste im Quelltext – zwei Listen laufen auseinander.
 */
const widersprueche = [];
for (const p of pfade) {
  const datei = path.join(WURZEL, 'dist', 'client', p.replace(/^\//, ''), 'index.html');
  if (!existsSync(datei)) continue;
  const html = await readFile(datei, 'utf8');
  if (/<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) {
    widersprueche.push(p);
  }
}

if (widersprueche.length) {
  console.error(
    `\n[sitemap] ABBRUCH: ${widersprueche.length} Adresse(n) stehen in der Sitemap` +
      ' und tragen zugleich noindex:',
  );
  for (const p of widersprueche) console.error(`    ${p}`);
  console.error(
    '\n          Entweder gehört die Seite in den Index – dann muss das noindex weg –,\n' +
      '          oder sie gehört nicht in die Sitemap. Der Filter dafür steht in\n' +
      '          astro.config.mjs bei der Sitemap-Integration.',
  );
  process.exit(1);
}

/** Der letzte Abschnitt einer Adresse, lesbar gemacht. */
function beschriftung(pfad) {
  const teile = pfad.replace(/^\/|\/$/g, '').split('/');
  const letzter = teile[teile.length - 1] ?? '';
  if (!letzter) return 'Startseite';
  /* Die Standortübersicht heißt nach dem Standort, nicht nach ihrem Slug –
     „Berlin charlottenburg" liest sich wie ein Tippfehler. */
  const alsStandort = STANDORTE.find((s) => s.slug === letzter);
  if (alsStandort && teile.length === 1) return `KU64 ${alsStandort.name}`;
  return letzter
    .replace(/-/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());
}

const standortSlugs = STANDORTE.map((s) => s.slug);
const standortName = Object.fromEntries(STANDORTE.map((s) => [s.slug, s.name]));

/* Nach Standort und danach nach Bereich gruppieren – die Ordnung, in der
   jemand die Website im Kopf hat. */
const jeStandort = Object.fromEntries(standortSlugs.map((s) => [s, []]));
const uebergreifend = [];

for (const p of pfade) {
  const erster = p.replace(/^\//, '').split('/')[0];
  if (standortSlugs.includes(erster)) jeStandort[erster].push(p);
  else uebergreifend.push(p);
}

function bereich(pfad, standort) {
  const rest = standort ? pfad.replace(`/${standort}/`, '/') : pfad;
  const teile = rest.replace(/^\/|\/$/g, '').split('/');
  if (teile.length === 0 || teile[0] === '') return standort ? 'Übersicht' : 'Hauptseiten';
  const kopf = teile[0];
  const NAMEN = {
    leistungen: 'Behandlungen',
    zahnbeschwerden: 'Beschwerden',
    team: 'Team',
    blog: 'Blog',
  };
  return NAMEN[kopf] ?? (teile.length === 1 ? 'Hauptseiten' : kopf);
}

function block(liste, standort) {
  const gruppen = new Map();
  for (const p of liste) {
    const g = bereich(p, standort);
    if (!gruppen.has(g)) gruppen.set(g, []);
    gruppen.get(g).push(p);
  }
  const RANG = ['Übersicht', 'Hauptseiten', 'Behandlungen', 'Beschwerden', 'Team', 'Blog'];
  const sortiert = [...gruppen.entries()].sort(
    (a, b) => (RANG.indexOf(a[0]) + 99) % 199 - ((RANG.indexOf(b[0]) + 99) % 199),
  );

  const zeilen = [];
  for (const [name, seiten] of sortiert) {
    const wort = seiten.length === 1 ? 'Seite' : 'Seiten';
    zeilen.push(
      `<details>\n<summary><strong>${name}</strong> – ${seiten.length} ${wort}</summary>\n`,
    );
    for (const p of seiten) {
      zeilen.push(`- [${beschriftung(p)}](${basis}${p})  \`${p}\``);
    }
    zeilen.push('\n</details>\n');
  }
  return zeilen.join('\n');
}

const text = `# Alle Seiten von ku64.de

> **Diese Datei wird erzeugt.** Nicht von Hand ändern – sie entsteht aus
> \`dist/client/sitemap-0.xml\`, also aus derselben Datei, die Google
> bekommt. Neu schreiben mit \`npm run sitemap:liste\`.

**${pfade.length} Seiten**, Stand des letzten Bauvorgangs.

## Für Suchmaschinen

| Datei | Zweck |
|---|---|
| \`${basis}/sitemap-index.xml\` | **Diese Adresse in die Google Search Console eintragen.** Sie verweist auf alle weiteren. |
| \`${basis}/sitemap-0.xml\` | Die eigentliche Liste mit allen ${pfade.length} Adressen |
| \`${basis}/robots.txt\` | Verweist ebenfalls auf die Sitemap – Suchmaschinen finden sie so auch ohne Eintragung |

**Englisch und Französisch stehen absichtlich nicht drin.** Beide Fassungen
tragen noch \`noindex\`, solange sie nicht gegengelesen sind. Eine Sitemap,
die Seiten meldet, die man nicht indexiert haben will, ist ein Widerspruch –
die Search Console merkt ihn an. Sobald die Sprachen freigegeben sind,
stehen sie ohne weiteres Zutun drin.

## Nach Standort

${standortSlugs
  .map(
    (s) => `### KU64 ${standortName[s]} — ${jeStandort[s].length} Seiten

${block(jeStandort[s], s)}`,
  )
  .join('\n')}

## Standortübergreifend — ${uebergreifend.length} Seiten

${block(uebergreifend, null)}
`;

await writeFile(path.join(WURZEL, 'SITEMAP.md'), text);

console.log(`[sitemap] ${pfade.length} Seiten`);
for (const s of standortSlugs) {
  console.log(`    ${String(jeStandort[s].length).padStart(4)}  KU64 ${standortName[s]}`);
}
console.log(`    ${String(uebergreifend.length).padStart(4)}  standortübergreifend`);
console.log('\n[sitemap] → SITEMAP.md');
