/**
 * Läuft jedes eingebettete Skript, oder steht dort nur eine Zeichenkette?
 *
 * ── Der Fehler, den es diese Prüfung gibt ───────────────────────────────
 *
 * In Astro heißt `is:inline`: „gib den Inhalt unverändert aus". Wer darin die
 * Astro-Schreibweise für Ausdrücke benutzt –
 *
 *     <script is:inline>
 *       {`
 *       (() => { … })();
 *       `}
 *     </script>
 *
 * – bekommt genau das ins HTML geschrieben, samt Klammern und Backticks.
 * Daraus wird gültiges JavaScript, das nichts tut: ein Block, der eine
 * Zeichenkette auswertet und verwirft. Kein Syntaxfehler, keine Meldung in
 * der Konsole, kein Hinweis im Bau. Das Skript ist einfach tot.
 *
 * Gefunden wurde es an zwei Stellen, und die erste hat wochenlang niemand
 * bemerkt:
 *
 *   Kopfmedium.astro – das Kopfvideo der Startseite ist deshalb nie
 *     gestartet. Was zu sehen war, war das Standbild. Weil das Standbild
 *     absichtlich ein Bild AUS dem Video ist, sah ein stehendes Video genau
 *     so aus wie ein laufendes, das gerade nichts bewegt.
 *
 *   team/index.astro – dieselbe Falle, gestellt beim Versuch, einen
 *     Layoutsprung zu beheben. Die Korrektur wirkte nicht, und Lighthouse
 *     meldete denselben CLS-Wert wie vorher.
 *
 * ── Was geprüft wird ────────────────────────────────────────────────────
 *
 * Jedes `<script>` ohne `src` im gebauten HTML: Beginnt sein Inhalt mit `{`
 * gefolgt von einem Backtick, ist er als Astro-Ausdruck geschrieben und
 * wurde nicht ausgewertet. Zusätzlich fällt auf, wenn ein Skriptkörper
 * ausschließlich aus einer Zeichenkette besteht.
 *
 * Das ist eine Textprüfung auf dem Bauergebnis und damit billig – sie läuft
 * über alle 1084 Seiten in Sekunden.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   npm run build && npm run skripte:pruefen
 */

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const WURZEL = path.resolve(import.meta.dirname, '..');
const DIST = path.join(WURZEL, 'dist', 'client');

if (!existsSync(DIST)) {
  console.error('[skripte] dist/client fehlt – bitte zuerst bauen.');
  process.exit(1);
}

async function seiten(ordner, treffer = []) {
  for (const eintrag of await readdir(ordner, { withFileTypes: true })) {
    const voll = path.join(ordner, eintrag.name);
    if (eintrag.isDirectory()) await seiten(voll, treffer);
    else if (eintrag.name.endsWith('.html')) treffer.push(voll);
  }
  return treffer;
}

const dateien = await seiten(DIST);

/* Je Befund gesammelt, nicht je Seite: Ein totes Skript in einem Baustein,
   den es überall gibt, ist ein Fehler an einer Stelle. */
const befunde = new Map();

function melden(art, probe, seite) {
  const schluessel = `${art} ${probe}`;
  if (!befunde.has(schluessel)) befunde.set(schluessel, { art, probe, seiten: new Set() });
  befunde.get(schluessel).seiten.add(seite);
}

let geprueft = 0;

for (const datei of dateien) {
  const html = await readFile(datei, 'utf8');
  const seite = '/' + path.relative(DIST, datei).replace(/index\.html$/, '').replace(/\\/g, '/');

  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attribute = m[1];
    if (/\bsrc=/i.test(attribute)) continue;
    /* Strukturierte Daten sind Daten, kein Programm. */
    if (/type=["'](application\/(ld\+json|json)|importmap)["']/i.test(attribute)) continue;

    const koerper = m[2].trim();
    if (!koerper) continue;
    geprueft++;

    const probe = koerper.slice(0, 60).replace(/\s+/g, ' ');

    /* Der eindeutige Fingerabdruck: geschweifte Klammer, dann Backtick. */
    if (/^\{\s*`/.test(koerper)) {
      melden('Astro-Ausdruck nicht ausgewertet', probe, seite);
      continue;
    }

    /* Ein Körper, der nur aus einer Zeichenkette besteht, tut ebenfalls
       nichts – auch ohne die Klammern davor. */
    if (/^(['"`])[\s\S]*\1;?$/.test(koerper)) {
      melden('Skriptkörper ist nur eine Zeichenkette', probe, seite);
    }
  }
}

console.log(`[skripte] ${geprueft} eingebettete Skripte auf ${dateien.length} Seiten geprüft`);

if (befunde.size === 0) {
  console.log('[skripte] Jedes eingebettete Skript ist ausführbarer Code. In Ordnung.');
  process.exit(0);
}

console.error(`\n[skripte] ${befunde.size} totes Skript / tote Skripte:`);
for (const b of [...befunde.values()].sort((a, z) => z.seiten.size - a.seiten.size)) {
  console.error(`\n    ${b.art} – auf ${b.seiten.size} Seite(n), z. B. ${[...b.seiten][0]}`);
  console.error(`      ${b.probe}…`);
}

console.error(
  '\n[skripte] ABBRUCH: Der Inhalt eines `is:inline`-Skripts wird unverändert\n' +
    '          ausgegeben. Die Astro-Schreibweise {`…`} landet damit wörtlich\n' +
    '          im HTML und ergibt gültiges JavaScript, das nichts tut – ohne\n' +
    '          Fehlermeldung. Das JavaScript gehört direkt in das Element,\n' +
    '          ohne Klammern und ohne Backticks.',
);
process.exit(1);
