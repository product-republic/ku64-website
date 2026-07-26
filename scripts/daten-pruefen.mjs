/**
 * Prüft die Querverweise zwischen den Datendateien.
 *
 * Anlass war ein selbstgemachter Fehler: In preise.ts standen sechs Verweise
 * auf Behandlungen, die es unter diesem Namen nie gab – `zahnkrone` statt
 * `keramik-kronen`, `inlay` statt `inlays-onlays`. Getippt statt nachgesehen.
 *
 * Das Tückische daran ist nicht der Fehler, sondern seine Stille: TypeScript
 * sieht bei `leistung: string` nur eine Zeichenkette, und die ist gültig.
 * Auffallen würde es erst auf der fertigen Seite – als Preisangabe, die
 * einfach fehlt, ohne dass irgendwo etwas rot wird. Bei einer Zahnarztpraxis
 * ist eine stumm fehlende Preisangabe schlechter als eine falsche: Die
 * falsche korrigiert jemand.
 *
 * Geprüft wird deshalb jeder Verweis von einer Datei in eine andere.
 */

import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const laden = (rel) => import(pathToFileURL(path.join(WURZEL, rel)).href);

const { LEISTUNGEN, KATEGORIEN } = await laden('src/data/leistungen.ts');
const { STANDORTE } = await laden('src/data/standorte.ts');
const { PREISRAHMEN, PROPHYLAXE } = await laden('src/data/preise.ts');
const team = await laden('src/data/team.ts');

const leistungSlugs = new Set(LEISTUNGEN.map((l) => l.slug));
const kategorieSlugs = new Set(KATEGORIEN.map((k) => k.slug));
const standortSlugs = new Set(STANDORTE.map((s) => s.slug));

const fehler = [];
const melden = (wo, was) => fehler.push(`${wo}: ${was}`);

for (const l of LEISTUNGEN) {
  if (!kategorieSlugs.has(l.kategorie)) {
    melden(`leistungen.ts → ${l.slug}`, `unbekannte Kategorie "${l.kategorie}"`);
  }
  for (const s of l.verfuegbar) {
    if (!standortSlugs.has(s)) melden(`leistungen.ts → ${l.slug}`, `unbekannter Standort "${s}"`);
  }
  for (const r of l.related ?? []) {
    if (!leistungSlugs.has(r)) melden(`leistungen.ts → ${l.slug}`, `verwandte Leistung "${r}" fehlt`);
  }
  if (l.verfuegbar.length === 0) {
    melden(`leistungen.ts → ${l.slug}`, 'an keinem Standort verfügbar – die Seite entstünde nirgends');
  }
}

for (const p of [...PREISRAHMEN, PROPHYLAXE]) {
  if (!leistungSlugs.has(p.leistung)) {
    melden(`preise.ts → "${p.name}"`, `verweist auf Behandlung "${p.leistung}", die es nicht gibt`);
  }
  const hatSpanne = p.terzile || p.einzelspanne || p.spanne;
  if (!hatSpanne) melden(`preise.ts → "${p.name}"`, 'weder Terzile noch Einzelspanne');
}

for (const { slug, standort } of team.ungueltigeStandorte()) {
  melden(`team.ts → ${slug}`, `unbekannter Standort "${standort}"`);
}
const doppelteSlugs = team.TEAM.map((m) => m.slug).filter((s, i, a) => a.indexOf(s) !== i);
for (const s of new Set(doppelteSlugs)) melden('team.ts', `Slug "${s}" kommt mehrfach vor`);
for (const m of team.TEAM) {
  if (m.standorte.length === 0) melden(`team.ts → ${m.slug}`, 'keinem Standort zugeordnet');
  for (const sp of m.schwerpunkte ?? []) {
    if (!leistungSlugs.has(sp)) melden(`team.ts → ${m.slug}`, `Schwerpunkt "${sp}" ist keine Behandlung`);
  }
}

/* Umgekehrt: Behandlungen, deren Kostenangabe im Fließtext steht, obwohl es
   inzwischen einen belastbaren Preisrahmen gäbe. Kein Fehler, aber ein
   Hinweis – zwei Quellen für dieselbe Zahl laufen irgendwann auseinander. */
const mitRahmen = new Set(PREISRAHMEN.map((p) => p.leistung));
const doppelt = LEISTUNGEN.filter((l) => l.kosten && mitRahmen.has(l.slug)).map((l) => l.slug);

console.log(
  `[daten] ${LEISTUNGEN.length} Behandlungen, ${STANDORTE.length} Standorte, ` +
    `${PREISRAHMEN.length} Preisrahmen für ${mitRahmen.size} Behandlungen`,
);
console.log(
  `[daten] Team: ${team.TEAM.length} Einträge, davon ${team.veroeffentlichbar().length} bestätigt ` +
    `und veröffentlicht – ${team.offeneNamen()} warten auf Bestätigung`,
);
for (const s of STANDORTE) {
  const gesamt = team.TEAM.filter((m) => m.standorte.includes(s.slug)).length;
  console.log(`         ${s.name.padEnd(18)} ${String(gesamt).padStart(3)} erfasst, ${String(team.anzahlAn(s.slug)).padStart(3)} veröffentlicht`);
}

if (doppelt.length) {
  console.log(
    `[daten] Hinweis: ${doppelt.length} Behandlungen führen Kosten im Text UND einen Preisrahmen:`,
  );
  for (const s of doppelt) console.log(`  · ${s}`);
  console.log('        Vor dem Live-Gang auf eine Quelle festlegen.');
}

if (fehler.length) {
  console.error(`\n[daten] ABBRUCH: ${fehler.length} ungültige Verweise`);
  for (const f of fehler) console.error(`  · ${f}`);
  process.exit(1);
}

console.log('[daten] Alle Querverweise gültig.');
