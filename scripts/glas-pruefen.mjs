#!/usr/bin/env node
/**
 * Prüft, ob Glas wirklich Glas ist.
 *
 * ── Warum es diese Prüfung gibt ─────────────────────────────────────────
 *
 * Glas erkennt man nicht daran, dass der Hintergrund blasser wird, sondern
 * daran, dass er verschwimmt. Eine durchscheinende Fläche ohne Weichzeichner
 * ist Folie – und sie ist schlimmer als eine deckende, weil der Text dahinter
 * gestochen scharf durch die Schrift davor läuft.
 *
 * Genau das war über Wochen der Zustand, ohne dass es jemandem im Quelltext
 * aufgefallen wäre: Dort stand überall ein `backdrop-filter`. Verlorengegangen
 * ist er erst beim Bauen.
 *
 * ── Der Fehler, den diese Prüfung fängt ─────────────────────────────────
 *
 * Im Quelltext stand die standardisierte Eigenschaft VOR ihrer
 * `-webkit-`-Fassung:
 *
 *     backdrop-filter: blur(72px);
 *     -webkit-backdrop-filter: blur(72px);
 *
 * Minifizierer fassen gleichwertige Deklarationen zusammen und behalten die
 * letzte. Übrig blieb die präfixierte – und die ist in aktuellen Browsern
 * kein Alias mehr, sondern eine unbekannte Eigenschaft, die verworfen wird.
 * Elf von vierzehn Glasflächen hatten dadurch keinen Weichzeichner.
 *
 * Die Konvention ist umgekehrt: erst die alte Schreibweise, dann die
 * gültige. Nur so überlebt die richtige das Zusammenfassen.
 *
 * ── Was geprüft wird ────────────────────────────────────────────────────
 *
 * Am GEBAUTEN CSS, nicht am Quelltext – denn der war ja in Ordnung.
 *
 *   1. Jede Regel mit `-webkit-backdrop-filter` muss auch die
 *      unpräfixierte Eigenschaft tragen.
 *   2. Jede Fläche, die eine Glasfarbe als Hintergrund nimmt, muss einen
 *      Weichzeichner haben – sonst ist sie Folie.
 *
 * Läuft nach dem Build, wie der Bildwächter.
 */

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const AUSGABE = path.resolve(import.meta.dirname, '..', 'dist', 'client', '_astro');

if (!existsSync(AUSGABE)) {
  console.error('[glas] dist/client/_astro fehlt – bitte zuerst bauen.');
  process.exit(1);
}

/**
 * Flächen, die eine Glasfarbe tragen dürfen, ohne zu verschwimmen.
 *
 * Nicht jede Fläche mit einer Glasfarbe liegt über Inhalt. Eine Karte auf
 * ruhigem Grund nimmt die Farbe auf, ohne dass es dahinter etwas
 * weichzuzeichnen gäbe – und ein Weichzeichner je Karte wäre auf einer Seite
 * mit dreißig Karten teuer erkauft.
 *
 * Ausnahmen brauchen einen Grund, deshalb steht er dabei.
 */
const OHNE_WEICHZEICHNER = [
  { muster: /\.karte/, grund: 'Karten liegen auf ruhigem Grund, nicht über Inhalt' },
  { muster: /\.knopf/, grund: 'Schaltflächen sind zu klein für einen sichtbaren Effekt' },
  { muster: /\.chip/, grund: 'wie Schaltflächen' },
  { muster: /\.marke/, grund: 'Textmarke, kein Fenster' },
  { muster: /\.hinweis/, grund: 'liegt im Textfluss' },
  { muster: /\.blase/, grund: 'Chatblase im Fenster – das Fenster verschwimmt bereits' },
  { muster: /\.faq-liste/, grund: 'liegt im Textfluss' },
  { muster: /\.suche/, grund: 'Eingabefeld im Textfluss' },
  { muster: /\.tabelle-huelle/, grund: 'liegt im Textfluss' },
  { muster: /::after|::before/, grund: 'Zierelement' },
  { muster: /:hover|:focus/, grund: 'Zustandsfarbe, kein eigenes Fenster' },
  { muster: /\.filter-knopf/, grund: 'wie Schaltflächen' },
  { muster: /\.menue-knopf/, grund: 'wie Schaltflächen' },
  { muster: /\.haupt-link/, grund: 'Zustandsfarbe' },
  { muster: /\.sprachwahl/, grund: 'Zustandsfarbe' },
  { muster: /\.glas-stark/, grund: 'Hilfsklasse, der Weichzeichner steht bei .glas' },
];

const befunde = [];
let regeln = 0;
let glasflaechen = 0;

for (const datei of await readdir(AUSGABE)) {
  if (!datei.endsWith('.css')) continue;
  const css = await readFile(path.join(AUSGABE, datei), 'utf8');

  for (const treffer of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selektor = treffer[1].trim();
    const koerper = treffer[2];
    regeln++;

    const hatWebkit = /-webkit-backdrop-filter\s*:\s*(?!none)/.test(koerper);
    const hatStandard = /(^|[^-])backdrop-filter\s*:\s*(?!none)/.test(koerper);

    // 1. Präfixiert ohne Standard – die Regel ist wirkungslos.
    if (hatWebkit && !hatStandard) {
      befunde.push({
        art: 'NUR-PRÄFIXIERT',
        datei,
        selektor,
        detail:
          'Nur -webkit-backdrop-filter im Ergebnis. Im Quelltext gehört die ' +
          'präfixierte Fassung ZUERST und die gültige danach.',
      });
    }

    // 2. Glasfarbe ohne Weichzeichner – das ist Folie.
    const hatGlasfarbe = /background[^;]*var\(--glas-[a-z-]*flaeche/.test(koerper);
    if (hatGlasfarbe) {
      glasflaechen++;
      const ausnahme = OHNE_WEICHZEICHNER.find((a) => a.muster.test(selektor));
      if (!hatStandard && !hatWebkit && !ausnahme) {
        befunde.push({
          art: 'GLAS-OHNE-UNSCHÄRFE',
          datei,
          selektor,
          detail:
            'Glasfarbe als Hintergrund, aber kein backdrop-filter. Entweder ' +
            'einen setzen oder in OHNE_WEICHZEICHNER eintragen – mit Grund.',
        });
      }
    }
  }
}

if (befunde.length === 0) {
  console.log(
    `[glas] ${regeln} Regeln geprüft, ${glasflaechen} Glasflächen – alle mit gültigem Weichzeichner.`,
  );
  process.exit(0);
}

console.error(`\n[glas] ${befunde.length} Beanstandungen:\n`);
for (const b of befunde) {
  console.error(`  ${b.art}  ${b.selektor.slice(0, 70)}`);
  console.error(`    ${b.datei}`);
  console.error(`    ${b.detail}\n`);
}
console.error(
  'Glas erkennt man daran, dass der Hintergrund verschwimmt – nicht daran,\n' +
    'dass er blasser wird. Eine durchscheinende Fläche ohne Weichzeichner ist\n' +
    'schlimmer als eine deckende: Der Text dahinter läuft scharf durch die\n' +
    'Schrift davor.\n',
);
process.exit(1);
