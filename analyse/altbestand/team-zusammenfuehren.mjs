#!/usr/bin/env node
/**
 * Führt die rekonstruierte Belegschaft und den Stand der laufenden Website
 * zusammen und schreibt die neue Liste für `src/data/team.ts`.
 *
 * ── Zwei Quellen, zwei Wahrheiten ──────────────────────────────────────────
 *
 * ALT (`src/data/team.ts`): aus den Weiterleitungsregeln der .htaccess
 * rekonstruiert. Weiß, welche Adressen es einmal gab – und die müssen weiter
 * ankommen, sonst laufen Suchtreffer und Lesezeichen ins Leere. Weiß nicht,
 * ob die Person noch da ist.
 *
 * NEU (`team-bestand.json`): die Teamübersicht von ku64.de. Weiß, wer heute
 * da ist, wie die Person geschrieben wird, was sie tut und an welchem
 * Standort. Weiß nichts über alte Adressen.
 *
 * Zusammengeführt ergibt das eine Liste, die beides kann. Die Regel:
 *
 *   in beiden      → veröffentlichen, Angaben von der Website, alte Adressen
 *                    aus dem Altbestand mitnehmen
 *   nur Website    → veröffentlichen, neue Person ohne alte Adresse
 *   nur Altbestand → NICHT veröffentlichen, aber als Eintrag behalten:
 *                    `bestaetigt: false` und die alten Adressen bleiben
 *                    erhalten, damit die Weiterleitungen weiter greifen
 *
 * Der dritte Fall ist der wichtige. Wer nicht mehr auf der Teamseite des
 * Kunden steht, arbeitet dort mit hoher Wahrscheinlichkeit nicht mehr – wie
 * schon bei Jana Jain. Eine Website, die ehemalige Kolleginnen als Team
 * ausgibt, ist falsch; eine, die ihre alten Adressen ins Leere laufen lässt,
 * ist unhöflich. Beides lässt sich vermeiden.
 *
 * ── Zuordnung ──────────────────────────────────────────────────────────────
 *
 * Zuerst über den Slug, dann über den auf Kleinschreibung und ohne Titel
 * normalisierten Namen. „Dr. Anna-Lena Zopfs“ und „dr-anna-lena-zopfs“ sind
 * dieselbe Person; „Dr. Mohamed Abudrya M.Sc.“ und „mohamed-abudrya“ auch.
 *
 * ── Aufruf ─────────────────────────────────────────────────────────────────
 *
 *   node team-zusammenfuehren.mjs
 *
 * Schreibt `team-neu.txt` – den fertigen Inhalt des TEAM-Arrays zum
 * Übernehmen, plus einen Bericht auf der Konsole.
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { TEAM } from '../../src/data/team.ts';

const HIER = import.meta.dirname;

const live = JSON.parse(await readFile(path.join(HIER, 'team-bestand.json'), 'utf8'));

/**
 * Kategorien der alten Website auf die Gruppen der neuen Seite.
 *
 * Die alte Website mischt zwei Dinge in einer Kategorie: das Fachgebiet
 * („Endodontologie“, „Prothetik“, „Kieferorthopädie“) und die Funktion
 * („Verwaltung“, „Telefon-Service“). Für die Teamseite zählt die Funktion –
 * Fachgebiete sind Schwerpunkte einer Zahnärztin, keine eigene Berufsgruppe.
 */
const GRUPPEN = {
  zahnaerzte: 'zahnaerzte',
  'kinder-jugendzahnarzt': 'zahnaerzte',
  kieferorthopaedie: 'zahnaerzte',
  prothetik: 'zahnaerzte',
  endodontologie: 'zahnaerzte',
  chirurgie: 'zahnaerzte',
  dentalhygieniker: 'dentalhygiene',
  prophylaxe: 'prophylaxe',
  prophylaxeshop: 'prophylaxe',
  'zahnmedizinische-fachangestellte': 'assistenz',
  'sterilisation-qm': 'assistenz',
  'rezeption-service': 'empfang',
  'telefon-service': 'empfang',
  verwaltung: 'verwaltung',
  'human-resources': 'verwaltung',
  materialverwaltung: 'verwaltung',
  'it-technik-kommunikation': 'verwaltung',
  kommunikation: 'verwaltung',
  'dsd-koordination-dentalberatung': 'beratung',
  /* Reine Standortkategorien sagen nichts über die Tätigkeit. Dann
     entscheidet die Funktionsbezeichnung – siehe `ausFunktion()`. */
  charlottenburg: null,
  berlinmitte: null,
  potsdam: null,
};

/**
 * Rückfall, wenn die Kategorie nur den Standort nennt: die Funktion lesen.
 * Sie steht als Klartext daneben („Zahnärztin“, „Dentalhygienikerin“).
 */
function ausFunktion(funktion) {
  const f = (funktion ?? '').toLowerCase();
  if (/zahnärzt|zahnarzt|oralchirurg|kieferchirurg/.test(f)) return 'zahnaerzte';
  if (/dentalhygien/.test(f)) return 'dentalhygiene';
  if (/prophylaxe|zmp/.test(f)) return 'prophylaxe';
  if (/auszubildend|azubi/.test(f)) return 'ausbildung';
  if (/rezeption|empfang|telefon/.test(f)) return 'empfang';
  if (/verwaltung|management|human resources|buchhaltung|leitung/.test(f)) return 'verwaltung';
  if (/fachangestellte|assistenz|zfa|zma/.test(f)) return 'assistenz';
  return null;
}

/** Name auf eine vergleichbare Form bringen: ohne Titel, ohne Zeichen. */
function schluessel(text) {
  return text
    .toLowerCase()
    .replace(/\b(dr|prof|med|dent|m\.?sc|mph|b\.?sc)\b\.?/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[çćč]/g, 'c')
    .replace(/[ıíì]/g, 'i')
    .replace(/[ğ]/g, 'g')
    .replace(/[^a-z]/g, '');
}

/* ── Zuordnen ────────────────────────────────────────────────────────────── */

const altNachSchluessel = new Map();
for (const m of TEAM) {
  altNachSchluessel.set(schluessel(m.slug), m);
  altNachSchluessel.set(schluessel(m.name), m);
}

const verwendet = new Set();
const neu = [];

for (const person of live) {
  const treffer =
    altNachSchluessel.get(schluessel(person.slug)) ??
    altNachSchluessel.get(schluessel(person.name));
  if (treffer) verwendet.add(treffer.slug);

  const gruppe =
    GRUPPEN[person.kategorieAlt] ?? ausFunktion(person.funktion) ?? treffer?.gruppe ?? 'assistenz';

  neu.push({
    slug: person.slug,
    name: person.name,
    bestaetigt: true,
    gruppe,
    standorte: person.standorte.length ? person.standorte : (treffer?.standorte ?? []),
    funktion: person.funktion ?? undefined,
    portraet: true,
    alteAdressen: [
      ...new Set([
        ...(treffer?.alteAdressen ?? []),
        /* Die Adresse der Personenseite auf der alten Website. Sie hat eine
           Gruppe im Pfad, die es in der neuen Struktur nicht mehr gibt. */
        new URL(person.url).pathname,
        /* Und die Adresse, unter der die Person im Altbestand geführt wurde,
           falls sie eine andere war. */
        ...(treffer && treffer.slug !== person.slug ? [`/team/${treffer.slug}/`] : []),
      ]),
    ],
  });
}

/* Wer nur im Altbestand steht: Eintrag behalten, aber nicht veröffentlichen. */
const ausgeschieden = TEAM.filter((m) => !verwendet.has(m.slug));

/* ── Ausgabe ─────────────────────────────────────────────────────────────── */

const REIHENFOLGE = ['berlin-charlottenburg', 'berlinmitte', 'potsdam', 'wilmersdorf'];
const GRUPPENFOLGE = [
  'zahnaerzte',
  'dentalhygiene',
  'prophylaxe',
  'beratung',
  'assistenz',
  'empfang',
  'verwaltung',
  'ausbildung',
];

function zeile(m) {
  const teile = [
    `slug: ${JSON.stringify(m.slug)}`,
    `name: ${JSON.stringify(m.name)}`,
    `bestaetigt: ${m.bestaetigt}`,
    `gruppe: ${JSON.stringify(m.gruppe)}`,
    `standorte: [${m.standorte.map((s) => JSON.stringify(s)).join(', ')}]`,
  ];
  if (m.funktion) teile.push(`funktion: ${JSON.stringify(m.funktion)}`);
  if (m.portraet) teile.push('portraet: true');
  if (m.alteAdressen?.length) {
    teile.push(`alteAdressen: [${m.alteAdressen.map((a) => JSON.stringify(a)).join(', ')}]`);
  }
  return `  { ${teile.join(', ')} },`;
}

let ausgabe = '';
for (const standort of REIHENFOLGE) {
  const hier = neu.filter((m) => m.standorte[0] === standort);
  if (!hier.length) continue;
  ausgabe += `\n  // ══ ${standort} ${'═'.repeat(Math.max(0, 60 - standort.length))}\n`;
  for (const gruppe of GRUPPENFOLGE) {
    const drin = hier.filter((m) => m.gruppe === gruppe);
    if (!drin.length) continue;
    ausgabe += `\n  // ── ${gruppe} ──\n`;
    ausgabe += drin.map(zeile).join('\n') + '\n';
  }
}

if (ausgeschieden.length) {
  ausgabe += `\n  // ══ Nicht mehr auf der Teamseite des Kunden ${'═'.repeat(20)}\n`;
  ausgabe += ausgeschieden.map((m) => zeile({ ...m, portraet: false })).join('\n') + '\n';
}

await writeFile(path.join(HIER, 'team-neu.txt'), ausgabe);

console.log(`[team] ${neu.length} veröffentlichbar, ${ausgeschieden.length} nicht mehr gelistet`);
console.log(`[team] davon neu hinzugekommen: ${neu.filter((m) => !m.alteAdressen.length).length}`);
for (const standort of REIHENFOLGE) {
  const n = neu.filter((m) => m.standorte.includes(standort)).length;
  console.log(`       ${standort.padEnd(24)} ${n}`);
}
console.log('\n[team] Nicht mehr gelistet:');
console.log('       ' + ausgeschieden.map((m) => m.name).join(', '));
console.log('\n[team] → team-neu.txt');
