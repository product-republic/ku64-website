/**
 * Sprachwächter. Beantwortet genau eine Frage: Gibt es einen Inhalt, den es
 * auf Deutsch gibt und in einer anderen Sprache nicht?
 *
 * Geprüft wird auf drei Ebenen, weil eine allein nicht reicht:
 *
 *   1. Katalog gegen Quelle – fehlende und veraltete Schlüssel. Das ist die
 *      genaue Prüfung: Sie kennt jeden einzelnen Text.
 *   2. Verwaiste Schlüssel – Übersetzungen zu deutschen Texten, die es nicht
 *      mehr gibt. Sie schaden nicht, blähen aber die Kataloge auf und lassen
 *      die Abdeckung besser aussehen, als sie ist.
 *   3. Restdeutsch im gebauten HTML – der Rückfallschutz. Falls ein Text am
 *      Katalog vorbei direkt in eine Seitendatei geschrieben wurde, findet
 *      ihn Ebene 1 nicht, weil sie ihn gar nicht kennt. Ebene 3 sieht ihn
 *      trotzdem, weil er im englischen HTML steht.
 *
 * Für freigegebene Sprachen ist jeder Fund ein Fehler und der Build bricht ab.
 * Für Sprachen im Aufbau ist er eine Rückstandsliste.
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const { quelltexte } = await import(pathToFileURL(path.join(WURZEL, 'src/i18n/quelle.ts')).href);
const { fingerabdruck } = await import(pathToFileURL(path.join(WURZEL, 'src/i18n/felder.ts')).href);
const { SPRACHEN, QUELLSPRACHE } = await import(
  pathToFileURL(path.join(WURZEL, 'src/i18n/sprachen.ts')).href
);

const nurBericht = process.argv.includes('--bericht');

const quelle = quelltexte();
const quellHashes = new Map(
  Object.entries(quelle).map(([schluessel, text]) => [schluessel, fingerabdruck(text)]),
);

console.log(`[sprachen] Quellfassung ${QUELLSPRACHE}: ${quellHashes.size} Textbausteine`);

let fehler = 0;
const zusammenfassung = [];

for (const sprache of SPRACHEN) {
  if (sprache.code === QUELLSPRACHE) continue;

  const katalogPfad = path.join(WURZEL, 'src/inhalte', `${sprache.code}.json`);
  const katalog = JSON.parse(await readFile(katalogPfad, 'utf8'));
  const eintraege = katalog.eintraege ?? {};

  const fehlend = [];
  const veraltet = [];
  for (const [schluessel, hash] of quellHashes) {
    const eintrag = eintraege[schluessel];
    if (!eintrag) fehlend.push(schluessel);
    else if (eintrag.quelle !== hash) veraltet.push(schluessel);
  }
  const verwaist = Object.keys(eintraege).filter((k) => !quellHashes.has(k));

  const uebersetzt = quellHashes.size - fehlend.length - veraltet.length;
  const quote = ((uebersetzt / quellHashes.size) * 100).toFixed(1);

  zusammenfassung.push({
    sprache: sprache.code,
    freigegeben: sprache.freigegeben,
    quote,
    fehlend: fehlend.length,
    veraltet: veraltet.length,
    verwaist: verwaist.length,
  });

  const streng = sprache.freigegeben && !nurBericht;
  const marke = streng ? 'FEHLER' : 'offen';

  console.log(
    `\n[sprachen] ${sprache.code} (${sprache.eigenname})` +
      `${sprache.freigegeben ? '' : ' – noch nicht freigegeben'}\n` +
      `  übersetzt: ${uebersetzt}/${quellHashes.size} (${quote} %)`,
  );

  if (fehlend.length) {
    console.log(`  ${marke}: ${fehlend.length} Schlüssel ohne Übersetzung`);
    for (const k of fehlend.slice(0, 12)) console.log(`    · ${k}`);
    if (fehlend.length > 12) console.log(`    … und ${fehlend.length - 12} weitere`);
  }
  if (veraltet.length) {
    console.log(`  ${marke}: ${veraltet.length} Übersetzungen veraltet (Deutsch wurde geändert)`);
    for (const k of veraltet.slice(0, 12)) console.log(`    · ${k}`);
    if (veraltet.length > 12) console.log(`    … und ${veraltet.length - 12} weitere`);
  }
  if (verwaist.length) {
    console.log(`  Hinweis: ${verwaist.length} verwaiste Einträge ohne deutsches Original`);
    console.log('           (mit "npm run sprachen:sync -- --aufraeumen" entfernen)');
  }

  if (streng && (fehlend.length || veraltet.length)) fehler++;

  // ── Ebene 3: Restdeutsch im gebauten HTML ────────────────────────────
  const distSprache = path.join(WURZEL, 'dist/client', sprache.praefix);
  if (existsSync(distSprache)) {
    const treffer = await restdeutschSuchen(distSprache);
    if (treffer.length) {
      console.log(`  ${marke}: Restdeutsch in ${treffer.length} gebauten Seiten`);
      for (const t of treffer.slice(0, 8)) {
        console.log(`    · ${t.datei} (${t.punkte} deutsche Marker: ${t.beispiele.join(', ')})`);
      }
      if (treffer.length > 8) console.log(`    … und ${treffer.length - 8} weitere`);
      if (streng) fehler++;
    } else {
      console.log('  Restdeutsch im HTML: keins gefunden');
    }
  }
}

console.log('\n[sprachen] Übersicht');
for (const z of zusammenfassung) {
  console.log(
    `  ${z.sprache}  ${String(z.quote).padStart(5)} %  ` +
      `fehlend ${String(z.fehlend).padStart(4)}  veraltet ${String(z.veraltet).padStart(3)}  ` +
      `${z.freigegeben ? 'freigegeben' : 'im Aufbau'}`,
  );
}

if (fehler > 0) {
  console.error(
    `\n[sprachen] ABBRUCH: ${fehler} freigegebene Sprachfassung(en) sind unvollständig.\n` +
      '           Eine veröffentlichte Sprache darf nirgends ins Deutsche zurückfallen.\n' +
      '           Abhilfe: npm run sprachen:sync',
  );
  process.exit(1);
}

console.log('\n[sprachen] In Ordnung.');

// ────────────────────────────────────────────────────────────────────────

/**
 * Wörter, die praktisch nur im Deutschen vorkommen. Bewusst keine, die auch
 * englisch oder französisch sind ("die", "man", "war", "so", "in", "ist"
 * scheiden deshalb aus). Ein einzelner Treffer ist noch kein Befund – ein
 * Eigenname darf deutsch bleiben. Erst mehrere Marker auf einer Seite deuten
 * auf einen ganzen Satz hin, der nicht übersetzt wurde.
 */
const MARKER = [
  'und',
  'oder',
  'nicht',
  'auch',
  'wird',
  'werden',
  'wir',
  'Ihre',
  'Ihnen',
  'für',
  'über',
  'können',
  'müssen',
  'sind',
  'haben',
  'Zähne',
  'Zahnarzt',
  'Behandlung',
  'Öffnungszeiten',
  'Termin',
];
const SCHWELLE = 4;

async function restdeutschSuchen(verzeichnis) {
  const { readdir } = await import('node:fs/promises');
  const treffer = [];

  async function durchlaufen(ordner) {
    for (const eintrag of await readdir(ordner, { withFileTypes: true })) {
      const voll = path.join(ordner, eintrag.name);
      if (eintrag.isDirectory()) await durchlaufen(voll);
      else if (eintrag.name.endsWith('.html')) await pruefen(voll);
    }
  }

  async function pruefen(datei) {
    const html = await readFile(datei, 'utf8');
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ');

    const gefunden = [];
    let punkte = 0;
    for (const wort of MARKER) {
      const anzahl = (text.match(new RegExp(`(^|[\\s.,;:!?»«"'()])${wort}([\\s.,;:!?»«"'()]|$)`, 'g')) ?? [])
        .length;
      if (anzahl > 0) {
        punkte += anzahl;
        gefunden.push(wort);
      }
    }
    if (punkte >= SCHWELLE) {
      treffer.push({
        datei: path.relative(path.join(WURZEL, 'dist/client'), datei),
        punkte,
        beispiele: gefunden.slice(0, 4),
      });
    }
  }

  await durchlaufen(verzeichnis);
  return treffer;
}
