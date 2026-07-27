#!/usr/bin/env node
/**
 * Macht Bildschirmfotos der wichtigsten Seiten – zum Ansehen, nicht zum
 * Messen.
 *
 * ── Wozu ────────────────────────────────────────────────────────────────
 *
 * Zwei Vorgaben lassen sich im Quelltext nicht prüfen, sondern nur sehen:
 *
 *   „Die gelben Schaltflächen sind zu aufdringlich.“
 *   „Es darf keine Lesbarkeitsprobleme geben, wo sich Ebenen treffen.“
 *
 * Beides entsteht erst im Zusammenspiel von Fläche, Bild und Schrift. Ein
 * Blick auf das fertige Bild beantwortet es in einer Sekunde; jede andere
 * Prüfung ist Stellvertreterei.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   npm run vorschau        (startet den Server selbst)
 *   node scripts/ansichten.mjs http://localhost:4321
 *
 * Legt die Bilder unter `ansichten/` ab – lokal, nicht im Repo.
 */

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const BASIS = process.argv[2] ?? 'http://localhost:4321';
const ZIEL = path.resolve(import.meta.dirname, '../ansichten');

/** Was angesehen wird, und warum es auf der Liste steht. */
const SEITEN = [
  { pfad: '/', name: 'start', warum: 'Erster Eindruck, Standortwahl' },
  { pfad: '/berlin-charlottenburg/', name: 'standort-kudamm', warum: 'Kopf mit Video' },
  { pfad: '/wilmersdorf/', name: 'standort-wilmersdorf', warum: 'Kopf mit Foto statt Video' },
  { pfad: '/potsdam/', name: 'standort-potsdam', warum: 'Kopf mit Video, zweiter Standort' },
  { pfad: '/berlinmitte/', name: 'standort-mitte', warum: 'Kopf mit Video, dritter Standort' },
  { pfad: '/berlin-charlottenburg/team/', name: 'team', warum: 'Porträtraster' },
  { pfad: '/berlin-charlottenburg/praxis/', name: 'praxis', warum: 'Praxisaufnahmen' },
  { pfad: '/berlin-charlottenburg/anfahrt/', name: 'anfahrt', warum: 'Karte, Wegbeschreibung' },
  { pfad: '/berlin-charlottenburg/leistungen/zahnimplantate/', name: 'leistung', warum: 'Behandlungsseite mit Ablauf und Preis' },
  { pfad: '/leistungen/', name: 'leistungen', warum: 'Kartenraster, Standortpunkte' },
  { pfad: '/termine/', name: 'termine', warum: 'Hauptschaltflächen in Menge' },
  { pfad: '/notfall/', name: 'notfall', warum: 'Rot als Signalfarbe – der einzige Ort dafür' },
  { pfad: '/laecheln-vorschau/', name: 'laecheln', warum: 'Formular, Hochladen, Hinweise' },
  { pfad: '/beratung/', name: 'beratung', warum: 'Sprachberater, Zustandsanzeige' },
  { pfad: '/kontakt/', name: 'kontakt', warum: 'Kartenraster ohne Bild' },
  { pfad: '/ueber-uns/', name: 'ueber-uns', warum: 'Zahlen, Text ohne Bild' },
  { pfad: '/karriere/', name: 'karriere', warum: 'Kartenraster' },
  { pfad: '/gibtsnicht/', name: 'vierhundertvier', warum: 'Fehlerseite' },
];

/** Zwei Breiten: Handy und Schreibtisch. Dazwischen liegt nichts Eigenes. */
const BREITEN = [
  { name: 'handy', viewport: { width: 390, height: 844 }, scale: 2, schema: 'light' },
  { name: 'gross', viewport: { width: 1440, height: 900 }, scale: 1, schema: 'light' },
  /* Der dunkle Modus ist kein Sonderfall: Wer sein Telefon nachts benutzt,
     sieht die Seite so – und Glasflächen kippen dort am ehesten. */
  { name: 'dunkel', viewport: { width: 1440, height: 900 }, scale: 1, schema: 'dark' },
];

await mkdir(ZIEL, { recursive: true });

/* Derselbe Weg wie in den übrigen Prüfskripten. */
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PFAD || '/opt/pw-browsers/chromium',
});
let fehler = 0;

for (const breite of BREITEN) {
  const kontext = await browser.newContext({
    viewport: breite.viewport,
    deviceScaleFactor: breite.scale,
    locale: 'de-DE',
    colorScheme: breite.schema ?? 'light',
    /* Bewegung aus: Ein Bildschirmfoto von einer laufenden Animation zeigt
       einen zufälligen Zwischenstand. */
    reducedMotion: 'reduce',
  });
  const seite = await kontext.newPage();

  for (const s of SEITEN) {
    const antwort = await seite.goto(BASIS + s.pfad, { waitUntil: 'networkidle' });
    /* Die Fehlerseite MUSS 404 liefern – dort ist das der richtige Status. */
    const erwartet404 = s.name === 'vierhundertvier';
    const status = antwort?.status();
    if (erwartet404 ? status !== 404 : !antwort?.ok()) {
      console.error(`  ${s.pfad} → ${status}`);
      fehler++;
      continue;
    }
    /* Schriften abwarten: Ein Bild, das mit der Ersatzschrift entsteht,
       zeigt andere Zeilenumbrüche als die fertige Seite. */
    await seite.evaluate(() => document.fonts.ready);
    await seite.screenshot({
      path: path.join(ZIEL, `${s.name}-${breite.name}.png`),
      fullPage: false,
    });
    console.log(`  ${breite.name.padEnd(6)} ${s.pfad}`);
  }

  await kontext.close();
}

await browser.close();
console.log(fehler ? `\n${fehler} Seiten nicht erreichbar` : `\nBilder in ${ZIEL}`);
