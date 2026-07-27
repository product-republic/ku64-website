#!/usr/bin/env node
/**
 * Holt die Personenprofile von der alten Website.
 *
 * ── Was dort steht und hier fehlte ─────────────────────────────────────────
 *
 * Jede Person hat auf ku64.de eine eigene Seite mit Schwerpunkten, dem
 * beruflichen Werdegang, Mitgliedschaften und teils Publikationen. Das ist
 * genau das, wonach jemand sucht, der wissen will, wem er den Mund öffnet –
 * und es ist nirgends sonst zu bekommen: In den Weiterleitungsregeln stand
 * nur, dass es diese Seiten gab, nicht, was auf ihnen steht.
 *
 * ── Wie die Seiten aufgebaut sind ──────────────────────────────────────────
 *
 * Elementor, also verschachtelte `div`-Ebenen ohne semantische Struktur. Was
 * sich verlässlich greifen lässt, sind die Überschriften: Alles zwischen
 * einer `h2` und der nächsten gehört zu ihr. Am Seitenende folgen
 * Fußzeilenblöcke, die auf jeder Seite gleich sind – Öffnungszeiten, Jobs,
 * Blog. Die stehen in `NICHT_UEBERNEHMEN` und fallen weg.
 *
 * ── Warum das Ergebnis eingecheckt wird ────────────────────────────────────
 *
 * Weil es Redaktionsinhalt ist, kein Rohmaterial. Die neue Website soll
 * diese Texte tragen, auch wenn ku64.de morgen abgeschaltet wird. Die
 * Herkunft steht in jedem Eintrag – wer einen Text ändert, sieht, woher er
 * kam.
 *
 * ── Aufruf ─────────────────────────────────────────────────────────────────
 *
 *   node profile-holen.mjs [--nur 3]
 *
 * Schreibt `src/data/profile.json`.
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const HIER = import.meta.dirname;
const WURZEL = path.resolve(HIER, '../..');
const PARALLEL = 5;

/** Nur so viele Personen laden – zum Ausprobieren. */
const nurIndex = process.argv.indexOf('--nur');
const NUR = nurIndex >= 0 ? Number(process.argv[nurIndex + 1]) : Infinity;

/**
 * Überschriften, die auf jeder Seite stehen und nichts über die Person
 * sagen. Verglichen wird auf Kleinschreibung und Anfang, damit
 * „Öffnungszeiten - Kudamm“ und „Öffnungszeiten – Potsdam“ beide fallen.
 */
const NICHT_UEBERNEHMEN = [
  'öffnungszeiten',
  'bleibe up-to-date',
  'jobs',
  'blog',
  'newsletter',
  'kontakt',
  'termin',
  'standorte',
  'folge uns',
];

function entschaerfen(roh) {
  return roh
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|h[1-6]|div)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, z) => String.fromCodePoint(Number(z)))
    .replace(/&#x([0-9a-f]+);/gi, (_, z) => String.fromCodePoint(parseInt(z, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

/**
 * Zerlegt eine Seite in Abschnitte: Überschrift plus alles bis zur nächsten.
 *
 * Zeilen werden einzeln zurückgegeben statt als ein Textblock. Ein
 * Werdegang ist eine Liste von Jahren, und als Liste gesetzt liest er sich
 * um Längen besser als als Absatz – das lässt sich aber nur entscheiden,
 * solange die Zeilenstruktur noch da ist.
 */
function abschnitte(ganzeSeite) {
  /*
   * Nur der Inhaltsbereich zählt.
   *
   * Ohne diese Eingrenzung reichte der letzte Abschnitt bis zum Seitenende
   * und sammelte die Fußzeile mit ein – im Werdegang von Abby Ferguson
   * standen daraufhin die Punkte „TERMIN, TELEFON, WHATSAPP“. Das ist kein
   * Parserfehler im Detail, sondern der Normalfall bei Seiten ohne
   * semantische Struktur: Was nicht abgegrenzt wird, läuft weiter.
   */
  const von = ganzeSeite.indexOf('<main');
  const bis = ganzeSeite.indexOf('</main');
  const html = von >= 0 && bis > von ? ganzeSeite.slice(von, bis) : ganzeSeite;

  const treffer = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)];
  const raus = [];

  for (let i = 0; i < treffer.length; i++) {
    const titel = entschaerfen(treffer[i][1]);
    if (!titel || titel.startsWith('[')) continue;
    if (NICHT_UEBERNEHMEN.some((n) => titel.toLowerCase().startsWith(n))) continue;

    const von = treffer[i].index + treffer[i][0].length;
    const bis = i + 1 < treffer.length ? treffer[i + 1].index : html.length;
    const roh = html.slice(von, bis);

    /* Ist der Abschnitt eine Aufzählung, wird sie als solche übernommen. */
    const punkte = [...roh.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map((m) => entschaerfen(m[1]))
      .filter(Boolean);

    const zeilen = (punkte.length ? punkte : entschaerfen(roh).split('\n'))
      .map((z) => z.trim())
      .filter((z) => z.length > 1)
      /* Reste der Seitenmechanik, die in keinen Lebenslauf gehören. */
      .filter((z) => !/^(zum profil|mehr erfahren|jetzt|weiterlesen)/i.test(z));

    if (!zeilen.length) continue;
    raus.push({ titel, zeilen: zeilen.slice(0, 40), alsListe: punkte.length > 0 });
  }
  return raus;
}

async function abrufen(url, versuche = 3) {
  for (let i = 0; i < versuche; i++) {
    try {
      const a = await fetch(url, {
        headers: { 'user-agent': 'KU64-Relaunch/1.0 (Profilübernahme, eigene Website)' },
        signal: AbortSignal.timeout(60_000),
      });
      if (a.ok) return await a.text();
      if (a.status === 404) return null;
    } catch {
      /* nächster Versuch */
    }
    await new Promise((r) => setTimeout(r, 1000 * 2 ** i));
  }
  return null;
}

const team = JSON.parse(await readFile(path.join(HIER, 'team-bestand.json'), 'utf8'));
const liste = team.slice(0, NUR);

console.log(`[profile] ${liste.length} Personenseiten abrufen …`);

const profile = {};
let fertig = 0;
let leer = 0;

let naechster = 0;
await Promise.all(
  Array.from({ length: PARALLEL }, async () => {
    while (naechster < liste.length) {
      const person = liste[naechster++];
      const html = await abrufen(person.url);
      fertig++;
      if (fertig % 10 === 0) process.stdout.write(`\r[profile] ${fertig}/${liste.length}`);
      if (!html) continue;

      const teile = abschnitte(html);
      if (!teile.length) {
        leer++;
        continue;
      }

      profile[person.slug] = {
        name: person.name,
        funktion: person.funktion,
        abschnitte: teile,
        quelle: person.url,
      };
    }
  }),
);
process.stdout.write('\n');

await writeFile(
  path.join(WURZEL, 'src/data/profile.json'),
  JSON.stringify(profile, null, 2) + '\n',
);

const mitInhalt = Object.keys(profile).length;
console.log(`[profile] ${mitInhalt} Profile mit Inhalt, ${leer} ohne`);
const zaehlung = {};
for (const p of Object.values(profile)) {
  for (const a of p.abschnitte) zaehlung[a.titel] = (zaehlung[a.titel] ?? 0) + 1;
}
console.log('[profile] Häufigste Abschnitte:');
for (const [titel, n] of Object.entries(zaehlung).sort((a, b) => b[1] - a[1]).slice(0, 12)) {
  console.log(`    ${String(n).padStart(3)}  ${titel}`);
}
console.log('\n[profile] → src/data/profile.json');
