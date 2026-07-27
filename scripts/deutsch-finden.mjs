#!/usr/bin/env node
/**
 * Findet deutsche Zeichenketten, die fest in den Vorlagen stehen.
 *
 * ── Warum das nötig ist ────────────────────────────────────────────────
 *
 * Der Sprachwächter prüft den Katalog: Ist zu jedem deutschen Baustein eine
 * englische und französische Fassung da? Er kann nicht prüfen, was gar nicht
 * erst im Katalog steht. Genau das war die Lücke: Der Katalog meldete 99,9
 * Prozent, und auf der englischen Seite stand „Wo möchten Sie teeth
 * whitening lassen?“ – weil dieser Satz nie ein Baustein war, sondern
 * direkt in der Vorlage.
 *
 * ── Wie erkannt wird ───────────────────────────────────────────────────
 *
 * An Wörtern, die es im Englischen und Französischen nicht gibt. Nicht an
 * Umlauten: „Zähne“ hat einen, „Termin buchen“ nicht. Und nicht an
 * Großschreibung: Die gilt im Englischen für Überschriften genauso.
 *
 * Falsche Treffer sind hier billig – man sieht sie in einer Sekunde. Ein
 * übersehener Satz dagegen steht auf der Website.
 *
 * ── Aufruf ─────────────────────────────────────────────────────────────
 *
 *   node scripts/deutsch-finden.mjs [--kurz]
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const WURZEL = path.resolve(import.meta.dirname, '..');
const KURZ = process.argv.includes('--kurz');

/**
 * Wörter, die eine Zeichenkette als Deutsch ausweisen.
 *
 * Funktionswörter, nicht Fachbegriffe: „Zahnimplantat“ heißt auf Englisch
 * fast genauso, „möchten“ nicht.
 */
const DEUTSCH =
  /\b(der|die|das|den|dem|des|ein|eine|einen|einem|eines|und|oder|nicht|auch|noch|schon|sehr|mehr|wenn|weil|dass|aber|sondern|bei|für|mit|von|zum|zur|nach|über|unter|durch|ohne|gegen|ihre|ihren|ihrem|Ihre|Ihren|Ihrem|Ihnen|sich|wir|uns|unser|unsere|ist|sind|war|wird|werden|haben|hat|können|möchten|müssen|soll|sollen|dürfen|lassen|finden|sehen|gibt|steht|kommt|Termin|Standort|Standorten|Behandlung|Behandlungen|Zähne|Zahn|Praxis|Sprechzeiten|Öffnungszeiten|Kosten|Dauer|Verfügbar|Weiterlesen|Zurück|Mehr|Alle|Fragen|Antwort|Seite|Seiten)\b/;

/** Was nie Anzeigetext ist. */
const KEIN_TEXT = [
  /^[\s\d.,:;!?()[\]{}<>/\\|@#$%^&*+=~`'"-]*$/,
  /^(https?:|mailto:|tel:|#|\/|\.\/|\.\.\/)/,
  /^[a-z0-9-]+$/,
  /^var\(|^calc\(|^rgb|^clamp\(/,
  /*
   * Auszeichnung ist kein Text.
   *
   * Die Suche nach Zeichenketten in Ausdrücken greift auch über Tag-Grenzen
   * hinweg: In `class:list={['knopf', 'gross', …]}` steht zwischen dem
   * zweiten und dem dritten Anführungszeichen der ganze Rest der Zeile,
   * Auszeichnung inklusive. So entstanden vierzig Meldungen, hinter denen
   * kein einziger deutscher Satz stand – und eine Liste, die zu neunzig
   * Prozent aus Fehlalarm besteht, liest irgendwann niemand mehr.
   *
   * Echter Anzeigetext enthält keine spitzen Klammern, keine geschweiften
   * und kein Gleichheitszeichen zwischen Wörtern.
   */
  /[<>]|=["'{]|\{[a-z]/i,
  /*
   * Und kein Code.
   *
   * Die Suche nach Textknoten mit Ausdruck darin ersetzt `{…}` durch ein
   * Zeichen – aus einem Ausdruck, der über mehrere Zeilen geht, bleibt
   * dabei manchmal ein Rest stehen, der wie Text aussieht. Ein Aufruf, ein
   * Pfeil oder ein Fragezeichen-Doppelpunkt-Paar ist keiner.
   */
  /[A-Za-z_$]\(|=>|\?\?|\.length\b/,
];

async function dateien(ordner, treffer = []) {
  for (const eintrag of await readdir(ordner, { withFileTypes: true })) {
    const p = path.join(ordner, eintrag.name);
    if (eintrag.isDirectory()) {
      if (['node_modules', 'dist', '.git', '.astro'].includes(eintrag.name)) continue;
      await dateien(p, treffer);
    } else if (eintrag.name.endsWith('.astro')) {
      treffer.push(p);
    }
  }
  return treffer;
}

/**
 * Der Auszeichnungsteil einer Astro-Datei.
 *
 * Alles vor dem zweiten `---` ist Vorspann (TypeScript), alles in `<style>`
 * ist CSS, alles in `<script>` ist Client-Code. Kommentare zählen nicht:
 * Sie sind auf Deutsch, und das ist Absicht.
 */
function auszeichnung(quelle) {
  let s = quelle;
  const ende = s.indexOf('---', 3);
  const vorspann = s.startsWith('---') && ende > 0 ? s.slice(0, ende + 3) : '';
  if (vorspann) s = s.slice(vorspann.length);
  s = s.replace(/<style[\s\S]*?<\/style>/g, '');
  s = s.replace(/<script[\s\S]*?<\/script>/g, '');
  s = s.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  s = s.replace(/\/\*[\s\S]*?\*\//g, '');
  return s;
}

const befunde = [];

for (const datei of await dateien(path.join(WURZEL, 'src'))) {
  const quelle = await readFile(datei, 'utf8');
  const markup = auszeichnung(quelle);
  const kurz = path.relative(WURZEL, datei);

  /* Freistehender Text zwischen Tags, dazu Attribute, die Anzeigetext
     tragen: alt, title, aria-label, placeholder. */
  const kandidaten = [];
  for (const m of markup.matchAll(/>([^<>{}]{4,})</g)) kandidaten.push(m[1]);

  /*
   * Textknoten MIT Ausdruck darin.
   *
   * Das war der zweite blinde Fleck: `<h1>Ihr Zahnarzt in {ort}</h1>` ist
   * ein deutscher Satz, aber die Suche oben schließt geschweifte Klammern
   * aus – sie sah ihn nie. Auf der englischen Standortseite stand deshalb
   * „Ihr Zahnarzt in Potsdam" über einem sonst vollständig übersetzten
   * Kopfbereich, und der Finder meldete null.
   *
   * Deshalb hier noch einmal, mit den Ausdrücken durch ein Zeichen ersetzt:
   * Was übrig bleibt, ist der deutsche Text drumherum.
   */
  const ohneAusdruecke = markup.replace(/\{[^{}]*\}/g, '\u0001');
  for (const m of ohneAusdruecke.matchAll(/>([^<>]{4,})</g)) {
    kandidaten.push(m[1].replaceAll('\u0001', ' '));
  }
  for (const m of markup.matchAll(
    /(?:alt|title|aria-label|placeholder|description|titel|anlass)=["']([^"']{4,})["']/g,
  )) {
    kandidaten.push(m[1]);
  }
  /* Zeichenketten in Ausdrücken: {bedingung ? 'Text' : 'Anderer Text'} */
  for (const m of markup.matchAll(/'([^'\\]{6,}?)'/g)) kandidaten.push(m[1]);
  for (const m of markup.matchAll(/`([^`$\\]{6,}?)`/g)) kandidaten.push(m[1]);

  for (const roh of kandidaten) {
    const text = roh.replace(/\s+/g, ' ').trim();
    if (text.length < 4) continue;
    if (KEIN_TEXT.some((r) => r.test(text))) continue;
    if (!DEUTSCH.test(text)) continue;
    befunde.push({ datei: kurz, text });
  }
}

/* Doppelte zusammenfassen – derselbe Satz in drei Vorlagen ist ein Posten. */
const nachText = new Map();
for (const b of befunde) {
  if (!nachText.has(b.text)) nachText.set(b.text, new Set());
  nachText.get(b.text).add(b.datei);
}

const sortiert = [...nachText.entries()].sort((a, b) => b[1].size - a[1].size);

console.log(`[deutsch] ${sortiert.length} verschiedene deutsche Zeichenketten in Vorlagen\n`);

const nachDatei = new Map();
for (const [text, dateienSet] of sortiert) {
  for (const d of dateienSet) {
    if (!nachDatei.has(d)) nachDatei.set(d, []);
    nachDatei.get(d).push(text);
  }
}

for (const [datei, texte] of [...nachDatei.entries()].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`${datei}  (${texte.length})`);
  if (!KURZ) for (const t of texte.slice(0, 40)) console.log(`    ${t.slice(0, 100)}`);
  console.log('');
}
