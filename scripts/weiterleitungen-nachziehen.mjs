/**
 * Weiterleitungen auf die wiederhergestellten Seiten umbiegen.
 *
 * ── Das Problem ─────────────────────────────────────────────────────────
 *
 * Als die Unterthemen zusammengefaltet waren, zeigte
 *
 *     /leistungen/…/zahnimplantate/zahnimplantat-kosten/
 *
 * auf `/leistungen/zahnimplantate/`. Das war richtig: Die Kostenseite gab es
 * nicht mehr, also führte die alte Adresse auf das Nächstliegende.
 *
 * Jetzt gibt es sie wieder – und die Weiterleitung zeigt weiter auf die
 * Hauptseite. Das ist nicht bloß unschön, es ist der Unterschied zwischen
 * „gefunden" und „nicht gefunden": Google folgt der Weiterleitung, landet auf
 * der Übersicht, und die Kostenseite bleibt für die alte Adresse unerreichbar.
 * Wer aus einem alten Suchergebnis oder einem Link von außen kommt, liest
 * nicht, was er angeklickt hat.
 *
 * ── Warum maschinell ────────────────────────────────────────────────────
 *
 * Jeder wiederhergestellte Langtext trägt in `herkunft` die alte Adresse, aus
 * der er stammt. Damit ist die Zuordnung nicht zu raten, sondern abzulesen –
 * 38 Einträge von Hand nachzuziehen wäre 38 Gelegenheiten für einen Tippfehler
 * in einer Datei, die `urls-abgleichen.mjs` anschließend prüft.
 *
 * ── Was das Skript NICHT tut ────────────────────────────────────────────
 *
 * Es fügt keine Weiterleitung hinzu und löscht keine Adresse. Es ändert nur
 * das Ziel bereits vorhandener Einträge – und dort, wo die alte Adresse
 * inzwischen selbst wieder eine echte Seite ist, entfernt es den Eintrag,
 * weil eine Weiterleitung auf sich selbst eine Schleife wäre.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   node scripts/weiterleitungen-nachziehen.mjs           (zeigt nur)
 *   node scripts/weiterleitungen-nachziehen.mjs --schreiben
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const WURZEL = path.resolve(import.meta.dirname, '..');
const SCHREIBEN = process.argv.includes('--schreiben');
const DATEI = path.join(WURZEL, 'src', 'data', 'weiterleitungen.ts');

const lang = JSON.parse(await readFile(path.join(WURZEL, 'src', 'inhalte', 'langtexte.json'), 'utf8'));

/* ── Alte Adresse → neues Ziel ───────────────────────────────────────── */

const ZIEL = new Map();

/* Hauptseiten: die Behandlung selbst. */
for (const [slug, t] of Object.entries(lang.leistungen)) {
  if (t.herkunft) ZIEL.set(t.herkunft, `/leistungen/${slug}/`);
}

/* Unterthemen: die zurückgekehrte Unterseite. */
for (const u of Object.values(lang.unterthemen)) {
  if (u.herkunft) ZIEL.set(u.herkunft, `/leistungen/${u.leistung}/${u.slug}/`);
}

/* Kategorietexte: die Übersicht mit dem Anker der Kategorie. Der Text steht
   dort jetzt wirklich – vorher war der Anker eine Sprungmarke ins Leere. */
for (const [kategorie, t] of Object.entries(lang.kategorien ?? {})) {
  if (t.herkunft) ZIEL.set(t.herkunft, `/leistungen/#${kategorie}`);
}

/* ── Datei umschreiben ───────────────────────────────────────────────── */

let quelle = await readFile(DATEI, 'utf8');

const geaendert = [];
const entfernt = [];

/*
 * Zeilenweise, mit einem Muster auf die ganze Zeile.
 *
 * Ein Parser für TypeScript wäre hier falsch am Platz: Die Tabelle ist eine
 * Zeile je Eintrag, und genau diese Form prüft `urls-abgleichen.mjs`
 * ohnehin. Wer die Form ändert, bekommt dort einen Fehler – nicht hier ein
 * stilles Übersehen.
 */
const zeilen = quelle.split('\n').map((zeile) => {
  const m = /^(\s*\{\s*von:\s*')([^']+)(',\s*nach:\s*')([^']+)('.*)$/.exec(zeile);
  if (!m) return zeile;

  const [, vor, von, mitte, nach, rest] = m;
  const neuesZiel = ZIEL.get(von);
  if (!neuesZiel || neuesZiel === nach) return zeile;

  /* Die alte Adresse ist selbst wieder eine Seite: Eintrag muss weg, sonst
     leitet die Seite auf sich selbst weiter. */
  if (neuesZiel === von) {
    entfernt.push(von);
    return null;
  }

  geaendert.push({ von, alt: nach, neu: neuesZiel });
  return `${vor}${von}${mitte}${neuesZiel}${rest}`;
});

const neu = zeilen.filter((z) => z !== null).join('\n');

/* ── Bericht ─────────────────────────────────────────────────────────── */

console.log(`[weiterleitungen] ${ZIEL.size} wiederhergestellte Seiten kennen ihre alte Adresse`);
console.log(`[weiterleitungen] ${geaendert.length} Ziel(e) umgebogen, ${entfernt.length} Eintrag/Einträge entfernt\n`);

for (const g of geaendert.slice(0, 40)) {
  console.log(`  ${g.von}\n      ${g.alt}  →  ${g.neu}`);
}
if (geaendert.length > 40) console.log(`  … und ${geaendert.length - 40} weitere`);

for (const e of entfernt) {
  console.log(`  ENTFERNT (ist wieder eine echte Seite): ${e}`);
}

/* Alte Adressen, für die es einen Langtext gibt, die aber in keiner
   Weiterleitung stehen. Kein Fehler – die Adresse ist dann unverändert –,
   aber sichtbar gehört es. */
const inTabelle = new Set(
  [...quelle.matchAll(/\{\s*von:\s*'([^']+)'/g)].map((m) => m[1]),
);
const ohne = [...ZIEL.keys()].filter((v) => !inTabelle.has(v));
if (ohne.length) {
  console.log(`\n[weiterleitungen] ${ohne.length} alte Adresse(n) ohne Eintrag – Adresse unverändert:`);
  for (const o of ohne.slice(0, 10)) console.log(`  ${o}`);
}

if (!SCHREIBEN) {
  console.log('\n[weiterleitungen] Nichts geschrieben. Mit --schreiben übernehmen.');
  process.exit(0);
}

await writeFile(DATEI, neu);
console.log(`\n[weiterleitungen] → ${path.relative(WURZEL, DATEI)}`);
console.log('[weiterleitungen] Bitte anschließend `npm run build` – urls-abgleichen prüft die Tabelle.');
