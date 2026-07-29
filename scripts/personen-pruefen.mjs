/**
 * Stehen in den Texten Namen von Menschen, die nicht mehr in der Praxis sind?
 *
 * ── Warum das eine eigene Prüfung braucht ───────────────────────────────
 *
 * `src/data/team.ts` regelt sauber, wer auf der Website erscheint: 99
 * bestätigte Personen werden gezeigt, 40 nicht mehr bestätigte erscheinen
 * nirgends und behalten nur ihre Weiterleitung. Das deckt die Teamseiten ab.
 *
 * Es deckt NICHT ab, was in den Texten steht. Ein Blogbeitrag von 2019 zitiert
 * eine Zahnärztin mit Namen; eine Behandlungsseite nennt den Operateur; eine
 * Beschwerdeseite verweist auf „Ihre Ansprechpartnerin". Diese Namen stehen
 * als Fließtext in den Inhaltsdaten und wissen nichts vom Team-Register.
 *
 * Für eine Praxis ist das kein Schönheitsfehler. Wer angefragt wird und seit
 * drei Jahren woanders arbeitet, kostet die Rezeption ein Gespräch und die
 * anfragende Person eine Enttäuschung. Und wer namentlich mit einer fachlichen
 * Aussage zitiert wird, ohne noch dort zu sein, ist ein rechtlich unschöner
 * Zustand – die Aussage wirkt wie eine gegenwärtige.
 *
 * ── Was geprüft wird ────────────────────────────────────────────────────
 *
 *   1. Namen aus dem Team-Register, die als `bestaetigt: false` geführt
 *      werden, aber in einem Inhaltstext vorkommen.
 *   2. Namen, die wie Personen aussehen („Dr. Vorname Nachname"), aber in
 *      keinem Register stehen – also weder aktuell noch ehemalig bekannt.
 *
 * Der zweite Fall ist der interessantere: Er findet Menschen, die überhaupt
 * nie im Team-Register standen, weil sie schon weg waren, als es entstand.
 *
 * ── Was die Prüfung NICHT entscheiden kann ──────────────────────────────
 *
 * Ob jemand noch da ist. Das weiß nur die Praxis. Die Prüfung legt die Liste
 * vor; die Entscheidung, ob ein Zitat bleibt, gekürzt oder ersetzt wird,
 * gehört an die Rezeption und nicht in ein Skript. Sie bricht deshalb den Bau
 * NICHT ab, sondern meldet.
 *
 * Aufruf:  npm run personen:pruefen
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { TEAM } from '../src/data/team.ts';

const WURZEL = path.resolve(import.meta.dirname, '..');

/* Inhaltsquellen – alles, worin Fließtext steht, der Namen enthalten kann. */
const QUELLEN = [
  'src/data/blog.json',
  'src/data/beschwerden.json',
  'src/data/profile.json',
  'src/data/leistungen.ts',
  'src/data/standorte.ts',
  'src/data/ki-systeme.ts',
  'src/i18n/texte.ts',
];

const aktuell = TEAM.filter((p) => p.bestaetigt);
const ehemalig = TEAM.filter((p) => !p.bestaetigt);

/**
 * Nur der Kern des Namens.
 *
 * Titel weg, damit „Dr. Birte Habedank" und „Birte Habedank" derselbe Mensch
 * sind. Und alles nach einem Komma weg: „Dr. Cora Betko, M.SC." wurde sonst
 * nie gegen „Dr. Cora Betko" im Text gefunden – die Prüfung meldete eine
 * eigene Zahnärztin als unbekannte Person.
 */
const ohneTitel = (n) =>
  n
    .split(',')[0]
    .replace(/\b(Dr\.|Prof\.|PD|med\.|dent\.|M\.\s?Sc\.|MSc|B\.\s?Sc\.|Dipl\.-?\w*)\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Vor- und Nachname, wie das Textmuster sie findet.
 *
 * Dreiteilige Namen („Eric Paul Oehme") und Doppelnamen („Hoppe-Zirbs",
 * „Andabili-Barthel") müssen beide Richtungen abdecken: Im Text steht mal die
 * kurze, mal die lange Form.
 */
function namensformen(voll) {
  const teile = ohneTitel(voll).split(' ').filter(Boolean);
  if (teile.length < 2) return [];
  const vorname = teile[0];
  const nachname = teile[teile.length - 1];
  const formen = new Set([
    ohneTitel(voll).toLowerCase(),
    `${vorname} ${nachname}`.toLowerCase(),
  ]);
  /* Doppelname: beide Hälften einzeln, weil Texte oft nur eine führen. */
  for (const h of nachname.split('-')) {
    if (h.length > 2) formen.add(`${vorname} ${h}`.toLowerCase());
  }
  if (teile.length > 2) formen.add(`${vorname} ${teile[1]}`.toLowerCase());
  return [...formen];
}

const texte = [];
for (const quelle of QUELLEN) {
  try {
    texte.push({ datei: quelle, inhalt: await readFile(path.join(WURZEL, quelle), 'utf8') });
  } catch {
    /* Datei gibt es nicht mehr – kein Grund abzubrechen. */
  }
}

/* ── 1. Ehemalige, die in Texten vorkommen ───────────────────────────── */

const ehemaligeTreffer = [];

for (const person of ehemalig) {
  const kern = ohneTitel(person.name);
  const nachname = kern.split(' ').slice(-1)[0];
  if (nachname.length < 4) continue; // zu kurz, zu viele Zufallstreffer

  for (const { datei, inhalt } of texte) {
    /* Der vollständige Name, nicht nur der Nachname: „Fischer" allein trifft
       zu oft etwas anderes. */
    const re = new RegExp(kern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    if (re.test(inhalt)) {
      /* Die Team-Datei selbst zählt nicht – dort MÜSSEN sie stehen. */
      if (datei.endsWith('team.ts')) continue;
      const stelle = inhalt.search(re);
      const umfeld = inhalt
        .slice(Math.max(0, stelle - 60), stelle + 120)
        .replace(/\s+/g, ' ')
        .trim();
      ehemaligeTreffer.push({ name: person.name, datei, umfeld });
    }
  }
}

/* ── 2. Namen, die in keinem Register stehen ─────────────────────────── */

const bekannt = new Set(TEAM.flatMap((p) => namensformen(p.name)));
const mitBezug = new Map();
const ohneBezug = new Map();

/* „Dr. Vorname Nachname" im Fließtext, Doppelnamen eingeschlossen.
   Bewusst nur mit Titel: Ohne ihn trifft das Muster jeden Patientennamen,
   jede Straße und jeden Ortsteil. */
const MUSTER =
  /\b(?:Dr\.\s*)+(?:med\.\s*|dent\.\s*)*([A-ZÄÖÜ][a-zäöüßñéèáàç]+)\s+([A-ZÄÖÜ][a-zäöüßñéèáàç]+(?:-[A-ZÄÖÜ][a-zäöüßñéèáàç]+)?)/g;

/*
 * Der entscheidende Unterschied: Wird die Person als jemand von KU64
 * vorgestellt, oder ist sie ein Referent, ein Doktorvater, eine fremde
 * Praxis?
 *
 * „Unser Kinderzahnarzt Dr. X" ist eine Aussage über die Praxis von heute.
 * „Fortbildung bei Dr. Y in Wien" ist eine Zeile in einem Lebenslauf und
 * völlig in Ordnung. Ohne diese Unterscheidung besteht die Liste zu drei
 * Vierteln aus Kongressrednern und ist damit unbrauchbar.
 */
const BEZUG =
  /\b(unser|unsere|unserem|unseren|Kolleg|KU64|Team|Praxis|begrüß|willkommen|Zahnärztin|Zahnarzt|Kinderzahnärzt)/i;

for (const { datei, inhalt } of texte) {
  if (datei.endsWith('team.ts')) continue;
  for (const m of inhalt.matchAll(MUSTER)) {
    const name = `${m[1]} ${m[2]}`;
    if (bekannt.has(name.toLowerCase())) continue;
    /* Auch die Kurzform prüfen: „Andabili-Barthel" gegen „Andabili". */
    const kurz = `${m[1]} ${m[2].split('-')[0]}`.toLowerCase();
    if (bekannt.has(kurz)) continue;

    /*
     * Beide Seiten ansehen, nicht nur die linke.
     *
     * „Unser Kinderzahnarzt Dr. X" hat den Bezug davor, „Dr. Y, Zahnarzt bei
     * KU64" dahinter. Ein erster Anlauf sah nur nach links und hat damit
     * ausgerechnet den Fall übersehen, mit dem die Praxis die Frage gestellt
     * hat.
     */
    const davor = inhalt.slice(Math.max(0, m.index - 90), m.index);
    const danach = inhalt.slice(m.index + m[0].length, m.index + m[0].length + 90);

    /* Fremder Zusammenhang schlägt den Bezug: Wer „in der Zahnarztpraxis
       Dr. X" gearbeitet hat, spricht über einen früheren Arbeitgeber. */
    const FREMD = /\b(in der (Zahnarzt)?[Pp]raxis|bei (Kinderzahnärztin|Zahnärztin|Zahnarzt|Dr)|Fortbildung|Vortrag|Kongress|Universität|Charité|Betreuer)\s*$/i;

    const ziel = FREMD.test(davor)
      ? ohneBezug
      : BEZUG.test(davor) || BEZUG.test(danach)
        ? mitBezug
        : ohneBezug;

    if (!ziel.has(name)) ziel.set(name, { name, dateien: new Set(), umfeld: '' });
    const e = ziel.get(name);
    e.dateien.add(datei);
    if (!e.umfeld) {
      e.umfeld = inhalt
        .slice(Math.max(0, m.index - 70), m.index + 130)
        .replace(/\s+/g, ' ')
        .trim();
    }
  }
}

/* ── Bericht ─────────────────────────────────────────────────────────── */

console.log(
  `\n[personen] Register: ${aktuell.length} aktuell, ${ehemalig.length} nicht mehr bestätigt`,
);
console.log(`[personen] ${texte.length} Inhaltsquellen durchsucht`);

if (ehemaligeTreffer.length === 0) {
  console.log('\n[personen] Kein ehemaliges Teammitglied kommt in einem Text vor.');
} else {
  console.log(`\n[personen] ${ehemaligeTreffer.length} Nennung(en) ehemaliger Teammitglieder:`);
  for (const t of ehemaligeTreffer) {
    console.log(`\n    ${t.name}  –  ${t.datei}`);
    console.log(`      …${t.umfeld}…`);
  }
}

if (mitBezug.size === 0) {
  console.log('\n[personen] Keine unbekannte Person wird als KU64-Zugehörige vorgestellt.');
} else {
  console.log(
    `\n[personen] ${mitBezug.size} Person(en) werden als zu KU64 gehörig genannt,\n` +
      '           stehen aber in keinem Register – mit hoher Wahrscheinlichkeit\n' +
      '           ehemalige Kolleginnen und Kollegen:',
  );
  for (const e of mitBezug.values()) {
    console.log(`\n    ${e.name}  –  ${[...e.dateien].join(', ')}`);
    console.log(`      …${e.umfeld}…`);
  }
}

console.log(
  `\n[personen] Daneben ${ohneBezug.size} Name(n) ohne KU64-Bezug (Referenten,` +
    ' Betreuer,\n           fremde Praxen in Lebensläufen). Die sind in Ordnung.',
);

console.log(
  '\n[personen] Diese Prüfung entscheidet nichts. Ob eine Nennung bleibt,\n' +
    '           gekürzt oder ersetzt wird, weiß nur die Praxis.\n',
);
