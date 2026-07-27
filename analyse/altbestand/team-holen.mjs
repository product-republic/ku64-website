#!/usr/bin/env node
/**
 * Liest die Belegschaft von der alten Website – Namen, Funktionen, Standorte,
 * Porträts.
 *
 * ── Warum das die bessere Quelle ist als die bisherige ──────────────────────
 *
 * `src/data/team.ts` wurde aus den Weiterleitungsregeln der alten .htaccess
 * rekonstruiert: aus Adressen wie `/team/zahnaerzte/frederike-bruning/`. Das
 * war der einzige Beleg, der vorlag, und die Datei sagt selbst, was daran
 * unsicher ist – Umlaute, Sonderzeichen, und vor allem: ob die Person
 * überhaupt noch da ist. Adressen sind ein Stand von gestern.
 *
 * Die Teamübersicht der laufenden Website ist der Stand von heute, vom Kunden
 * selbst gepflegt. Sie liefert je Person die Schreibweise so, wie sie sie
 * selbst führt (`Zeynep Çınar`, nicht `zeynep-cinar`), die Funktion, die
 * Zuordnung zum Standort über die Abschnitte der Seite – und das Porträt.
 *
 * Damit wird aus `bestaetigt: false` eine belegbare Angabe. Nicht durch
 * Zuruf, sondern durch die Veröffentlichung des Kunden selbst.
 *
 * ── Wie die Seite aufgebaut ist ────────────────────────────────────────────
 *
 * Elementor-Schleife: Je Person eine Kachel `team-loop-element-container` mit
 * Porträt, Überschrift (Name), Auszug (Funktion) und Verweis auf die
 * Personenseite. Die Kategorie steckt in einer CSS-Klasse des umgebenden
 * Elements (`category-zahnaerzte`), der Standort ergibt sich aus dem
 * Abschnitt, in dem die Kachel steht.
 *
 * Diese Struktur ist zerbrechlich – ein Umbau der alten Seite macht sie
 * ungültig. Das ist hinnehmbar: Das Skript läuft einmal zur Übernahme, sein
 * Ergebnis wird eingecheckt und ist danach unabhängig von der Quelle.
 *
 * ── Aufruf ─────────────────────────────────────────────────────────────────
 *
 *   node team-holen.mjs
 *
 * Schreibt `team-bestand.json`.
 */

import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const HIER = import.meta.dirname;
const UEBERSICHT = 'https://ku64.de/team/';

/**
 * Die Abschnitte der Seite, in der Reihenfolge, in der sie dort stehen.
 * Die Zuordnung auf die Slugs der neuen Website steht hier und nicht im
 * Kopf des Lesenden.
 */
const ABSCHNITTE = [
  { ueberschrift: "KU64 Ku'damm", standort: 'berlin-charlottenburg' },
  { ueberschrift: 'KU64 Berlin-Mitte', standort: 'berlinmitte' },
  { ueberschrift: 'KU64 Potsdam', standort: 'potsdam' },
];

/** Kategorien der alten Website auf die Gruppen der neuen. */
const GRUPPEN = {
  zahnaerzte: 'zahnaerzte',
  dentalhygieniker: 'dentalhygiene',
  dentalhygiene: 'dentalhygiene',
  prophylaxe: 'prophylaxe',
  assistenz: 'assistenz',
  assistenzen: 'assistenz',
  'rezeption-service': 'empfang',
  'telefon-service': 'empfang',
  verwaltung: 'verwaltung',
  azubis: 'ausbildung',
  auszubildende: 'ausbildung',
  labor: 'labor',
};

function entschaerfen(text) {
  return text
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, '’')
    .replace(/&#038;|&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const antwort = await fetch(UEBERSICHT, {
  headers: { 'user-agent': 'KU64-Relaunch/1.0 (Teamübernahme, eigene Website)' },
  signal: AbortSignal.timeout(120_000),
});
const html = await antwort.text();
console.log(`[team] Übersicht geladen (${(html.length / 1024).toFixed(0)} kB)`);

/* Wo beginnt welcher Abschnitt? Danach wird jede Kachel nach ihrer Position
   dem letzten davor liegenden Abschnitt zugeschlagen. */
const grenzen = ABSCHNITTE.map((a) => ({
  ...a,
  ab: html.indexOf(`>${a.ueberschrift}<`),
})).filter((a) => a.ab >= 0);

if (grenzen.length !== ABSCHNITTE.length) {
  console.warn('[team] Nicht alle Standortabschnitte gefunden – Zuordnung prüfen!');
}

function standortAn(position) {
  let treffer = null;
  for (const g of grenzen) if (g.ab <= position) treffer = g.standort;
  return treffer;
}

/* Kacheln aufteilen: jede beginnt mit `loop-item`. */
const stuecke = html.split('data-elementor-type="loop-item"').slice(1);
console.log(`[team] ${stuecke.length} Kacheln`);

const personen = [];
const gesehen = new Set();
let position = html.indexOf('data-elementor-type="loop-item"');

for (const stueck of stuecke) {
  const hier = position;
  position += stueck.length;

  const url = /<a href="(https:\/\/ku64\.de\/team\/[^"]+)"/.exec(stueck)?.[1];
  if (!url) continue;

  const name = entschaerfen(/<h2[^>]*>([\s\S]*?)<\/h2>/.exec(stueck)?.[1] ?? '');
  if (!name) continue;

  const bild = /<img[^>]+src="([^"]+)"[^>]*>/.exec(stueck);
  const alt = bild ? (/alt="([^"]*)"/.exec(bild[0])?.[1] ?? '') : '';

  const funktion = entschaerfen(
    /widget_type="theme-post-excerpt\.default"[^>]*>([\s\S]*?)<\/div>/.exec(stueck)?.[1] ?? '',
  );

  /* Die Kategorie steht in den Klassen des Kachelrumpfes: `category-zahnaerzte`. */
  const kategorie = /class="[^"]*\bcategory-([a-z-]+)/.exec(stueck)?.[1] ?? null;

  /* Der Adresspfad trägt dieselbe Gruppe noch einmal – als Rückfall. */
  const ausUrl = /\/team\/([^/]+)\//.exec(url)?.[1];

  const teile = url.replace(/\/$/, '').split('/');
  const slug = teile[teile.length - 1];

  /* Dieselbe Person kann in mehreren Standortabschnitten stehen – etwa der
     Gründer, der an allen dreien auftaucht. Dann werden die Standorte
     gesammelt statt die Person zweimal aufzunehmen. */
  const standort = standortAn(hier);
  if (gesehen.has(slug)) {
    const vorhanden = personen.find((p) => p.slug === slug);
    if (standort && !vorhanden.standorte.includes(standort)) vorhanden.standorte.push(standort);
    continue;
  }
  gesehen.add(slug);

  personen.push({
    slug,
    name,
    funktion: funktion || null,
    gruppe: GRUPPEN[kategorie] ?? GRUPPEN[ausUrl] ?? null,
    kategorieAlt: kategorie ?? ausUrl ?? null,
    standorte: standort ? [standort] : [],
    url,
    foto: bild ? bild[1] : null,
    fotoAlt: entschaerfen(alt) || null,
  });
}

personen.sort((a, b) => a.name.localeCompare(b.name, 'de'));

await writeFile(path.join(HIER, 'team-bestand.json'), JSON.stringify(personen, null, 2) + '\n');

const ohneGruppe = personen.filter((p) => !p.gruppe);
const ohneFoto = personen.filter((p) => !p.foto);
const ohneStandort = personen.filter((p) => !p.standorte.length);

console.log(`[team] ${personen.length} Personen → team-bestand.json`);
console.log(`       ${personen.length - ohneFoto.length} mit Porträt`);
if (ohneGruppe.length) {
  console.log(
    `       ohne zuordenbare Gruppe: ${ohneGruppe.map((p) => `${p.name} (${p.kategorieAlt})`).join(', ')}`,
  );
}
if (ohneStandort.length) {
  console.log(`       ohne Standort: ${ohneStandort.map((p) => p.name).join(', ')}`);
}
