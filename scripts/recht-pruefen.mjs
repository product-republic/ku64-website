/**
 * Impressum und Datenschutz: Was ist belegt, was fehlt noch – und wo steht
 * ein Platzhalter, den niemand zählt?
 *
 * ── Warum es diese Prüfung gibt ─────────────────────────────────────────
 *
 * Ein Impressum besteht aus Tatsachenbehauptungen, für die die Praxis
 * haftet. Eine falsche Angabe ist schlimmer als eine fehlende: Die fehlende
 * sieht man, die falsche nicht.
 *
 * Bis eben standen die Angaben mitten in `texte.ts`, zusammen mit den
 * Sätzen, in denen sie vorkommen. Zwei Folgen: Die Adresse existierte in
 * drei Sprachfassungen, von denen zwei irgendwann auseinanderlaufen – und
 * niemand konnte sagen, wie viele Felder eigentlich noch offen sind, ohne
 * die Datei zu lesen.
 *
 * ── Was gemessen wird ───────────────────────────────────────────────────
 *
 *   1. JEDE BELEGTE ANGABE HAT EINE QUELLE. Ohne sie ist eine Angabe von
 *      einer Erfindung nicht zu unterscheiden.
 *
 *   2. JEDER PLATZHALTER IN DER GEBAUTEN SEITE GEHÖRT ZU EINEM OFFENEN
 *      FELD. Das ist die eigentliche Prüfung: Ein `<code>[…]</code>`, das
 *      nicht aus `traeger.ts` stammt, ist ein vergessener Platzhalter im
 *      Fließtext – er wird von keiner Liste geführt und niemand fragt ihn
 *      je bei der Praxis ab.
 *
 *   3. DER ENTWURFSHINWEIS STEHT, SOLANGE ETWAS OFFEN IST. Und er
 *      verschwindet, sobald nichts mehr offen ist – ein Warnbalken, der
 *      immer da ist, wird nicht mehr gelesen.
 *
 * ── Warum das kein Abbruch bei offenen Feldern ist ──────────────────────
 *
 * Weil offene Felder kein Fehler sind, sondern eine Wartezeit. Sie brechen
 * den Bau nicht ab; sie werden gezählt und beim Namen genannt. Abgebrochen
 * wird, wenn etwas UNGEZÄHLT offen ist.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   npm run recht:pruefen        (hängt in der Baukette)
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { TRAEGER, istOffen, offeneAngaben } from '../src/data/traeger.ts';

const WURZEL = path.resolve(import.meta.dirname, '..');
const AUSGABE = ['dist/client', 'dist'].map((d) => path.join(WURZEL, d)).find((d) => existsSync(d));

const befunde = [];

/* ── 1. Jede belegte Angabe hat eine Quelle ───────────────────────────── */

for (const [feld, a] of Object.entries(TRAEGER)) {
  if (istOffen(a)) continue;
  if (!a.quelle || !a.quelle.trim()) {
    befunde.push(`traeger.ts: "${feld}" hat einen Wert, aber keine Quelle`);
  }
  if (!a.wert || !a.wert.trim()) {
    befunde.push(`traeger.ts: "${feld}" ist leer – dann gehört dort { offen: … } hin`);
  }
}

/* ── 2. Kein Platzhalter ohne Eintrag im Register ─────────────────────── */

const offen = offeneAngaben();
const bekannt = new Set(offen.map((o) => o.frage));

/*
 * Der Entwurfshinweis erklärt die Auszeichnung und enthält deshalb selbst
 * ein `<code>[…]</code>`. Es ist kein Platzhalter, sondern ein Beispiel.
 */
const BEISPIEL = '…';

const SEITEN = ['impressum', 'datenschutz'];
let geprueft = 0;

if (!AUSGABE) {
  console.error('[recht] Kein dist/ gefunden – bitte zuerst bauen.');
  process.exit(1);
}

for (const seite of SEITEN) {
  for (const praefix of ['', 'en/', 'fr/']) {
    const datei = path.join(AUSGABE, praefix, seite, 'index.html');
    if (!existsSync(datei)) continue;
    geprueft++;

    const html = await readFile(datei, 'utf8');
    const gefunden = [...html.matchAll(/<code>\[([^\]]*)\]<\/code>/g)].map((m) => m[1]);

    for (const p of gefunden) {
      if (p === BEISPIEL || bekannt.has(p)) continue;
      befunde.push(
        `${praefix}${seite}: Platzhalter „${p}" steht in keinem Feld von traeger.ts – ` +
          'er wird von keiner Liste geführt',
      );
    }

    /* ── 3. Der Entwurfshinweis passt zum Zustand ─────────────────────── */

    const hatHinweis = html.includes('class="hinweis hinweis-warnung entwurf"');
    if (offen.length > 0 && !hatHinweis) {
      befunde.push(
        `${praefix}${seite}: ${offen.length} Angabe(n) fehlen, aber kein Entwurfshinweis steht da`,
      );
    }
    if (offen.length === 0 && hatHinweis) {
      befunde.push(
        `${praefix}${seite}: nichts ist mehr offen, der Entwurfshinweis steht aber noch – ` +
          'ein Warnbalken, der immer da ist, wird nicht mehr gelesen',
      );
    }
  }
}

/* ── Bericht ──────────────────────────────────────────────────────────── */

const belegt = Object.values(TRAEGER).filter((a) => !istOffen(a)).length;

console.log(
  `[recht] ${belegt} Angabe(n) belegt, ${offen.length} offen – ${geprueft} gebaute Seiten geprüft`,
);

if (offen.length) {
  console.log('\n[recht] Das muss von der Praxis kommen:');
  for (const o of offen) console.log(`          ${o.feld.padEnd(28)} ${o.frage}`);
}

if (befunde.length === 0) {
  console.log(
    '\n[recht] In Ordnung: Jede belegte Angabe nennt ihre Quelle, jeder\n' +
      '        Platzhalter auf der Seite steht im Register, und der\n' +
      '        Entwurfshinweis passt zum Zustand.',
  );
  process.exit(0);
}

console.error(`\n[recht] ${befunde.length} Befund(e):`);
for (const b of befunde) console.error(`    ${b}`);
console.error(
  '\n[recht] ABBRUCH: Eine falsche Angabe im Impressum ist schlimmer als eine\n' +
    '        fehlende – die fehlende sieht man, die falsche nicht. Ein\n' +
    '        Platzhalter, den keine Liste führt, wird nie abgefragt.',
);
process.exit(1);
