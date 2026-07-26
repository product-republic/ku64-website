/**
 * Gleicht den URL-Bestand des Altbestands gegen die neue Website ab.
 *
 * Die Frage, die dieses Skript beantwortet, ist die einzige, die beim
 * Relaunch einer eingeführten Seite wirklich zählt: Gibt es eine Adresse, die
 * Google heute kennt und die morgen ins Leere läuft?
 *
 * Jede solche Adresse ist doppelt teuer. Die Person, die aus der Suche kommt,
 * landet auf einer Fehlerseite statt bei der Behandlung, die sie gesucht hat.
 * Und die Platzierung, die diese Seite über Jahre aufgebaut hat, ist weg –
 * eine 404 verliert sie vollständig, eine Weiterleitung immerhin nur
 * teilweise.
 *
 * Drei Ergebnisse je Adresse:
 *   VORHANDEN      Die Seite existiert unter genau derselben Adresse. Der
 *                  beste Fall, und deshalb das Ziel für so viele wie möglich.
 *   WEITERGELEITET Es gibt eine Weiterleitung auf eine passende Seite.
 *                  Vertretbar, wo es den Inhalt so nicht mehr gibt.
 *   TOT            Weder noch. Das darf nicht vorkommen.
 *
 * Bestandsquellen (beliebig kombinierbar, jede Zeile eine URL oder ein Pfad):
 *   analyse/altbestand/urls-*.txt
 * Zusätzlich werden die Ziele der alten .htaccess-Weiterleitungen
 * ausgewertet – die kennt Google sicher, denn sie stehen seit Jahren dort.
 *
 * Die Weiterleitungen kommen aus `src/data/weiterleitungen.ts` – derselben
 * Datei, aus der `astro.config.mjs` sie in den Server schreibt. Zwei Listen
 * zu führen hieße, dass der Wächter irgendwann etwas anderes prüft als der
 * Server tut, und genau das darf ein Wächter nicht.
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { zielFuer, WEITERLEITUNGEN } from '../src/data/weiterleitungen.ts';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(WURZEL, 'dist/client');
const ALTBESTAND = path.join(WURZEL, 'analyse/altbestand');

if (!existsSync(DIST)) {
  console.error('[urls] dist/client fehlt – bitte zuerst "npm run build" ausführen.');
  process.exit(1);
}

// ── Bestand einsammeln ────────────────────────────────────────────────

const bestand = new Map(); // pfad -> Herkunft

function aufnehmen(roh, herkunft) {
  let p = roh.trim();
  if (!p || p.startsWith('#')) return;
  p = p.replace(/^https?:\/\/[^/]+/i, '');
  p = p.split(/[?#]/)[0];
  if (!p.startsWith('/')) p = `/${p}`;
  if (!p.endsWith('/')) p += '/';
  // Dateien sind keine Seiten.
  const letztes = p.split('/').filter(Boolean).pop() ?? '';
  if (letztes.includes('.')) return;
  if (p.startsWith('/wp-') || p.startsWith('/feed')) return;
  if (!bestand.has(p)) bestand.set(p, herkunft);
}

const weiterleitungsziele = new Map(); // von -> nach
const wlDatei = path.join(ALTBESTAND, 'weiterleitungen.json');
if (existsSync(wlDatei)) {
  const wl = JSON.parse(await readFile(wlDatei, 'utf8'));
  for (const r of wl.aktiv ?? []) {
    // Das Ziel einer Weiterleitung ist eine echte Seite des Altbestands.
    aufnehmen(r.nach, 'Weiterleitungsziel (.htaccess)');
    // Die Quelle kennt Google ebenfalls – sie muss weiterhin ankommen.
    aufnehmen(r.von, 'Weiterleitungsquelle (.htaccess)');
    const von = normieren(r.von);
    if (von) weiterleitungsziele.set(von, normieren(r.nach));
  }
}

if (existsSync(ALTBESTAND)) {
  for (const datei of await readdir(ALTBESTAND)) {
    if (!/^urls.*\.txt$/i.test(datei)) continue;
    const inhalt = await readFile(path.join(ALTBESTAND, datei), 'utf8');
    for (const zeile of inhalt.split('\n')) aufnehmen(zeile, datei);
  }
}

/*
 * Adressen, die schon auf ku64.de eine Fehlerseite liefern, sind kein
 * Bestand. Sie stehen zwar in der alten .htaccess und sind darüber bekannt,
 * aber ihre Platzierung ist längst weg – sie auf der neuen Website zu
 * bedienen brächte niemanden zurück und würde nur die Weiterleitungstabelle
 * mit Fällen füllen, die niemand mehr aufruft.
 *
 * Das ist eine Aussage über die Wirklichkeit und keine Bequemlichkeit,
 * deshalb kommt sie aus dem Crawl und nicht aus einer Ausnahmeliste.
 */
const schonTot = new Set();
const crawlDatei = path.join(ALTBESTAND, 'crawl-roh.json');
if (existsSync(crawlDatei)) {
  const crawl = JSON.parse(await readFile(crawlDatei, 'utf8'));
  for (const seite of crawl.seiten ?? []) {
    if (seite.status >= 400) {
      schonTot.add(seite.pfad);
      bestand.delete(seite.pfad);
    }
  }
  if (schonTot.size) {
    console.log(
      `[urls] ${schonTot.size} Adressen liefern schon auf ku64.de einen Fehler – nichts zu retten.`,
    );
  }
}

function normieren(p) {
  if (!p) return null;
  let x = p.replace(/^https?:\/\/[^/]+/i, '').split(/[?#]/)[0];
  if (!x.startsWith('/')) x = `/${x}`;
  return x.endsWith('/') ? x : `${x}/`;
}

console.log(`[urls] Bestand aus dem Altbestand: ${bestand.size} Adressen`);

// ── Neue Seiten einsammeln ────────────────────────────────────────────

const vorhanden = new Set();
async function durchlaufen(ordner, praefix = '') {
  for (const eintrag of await readdir(ordner, { withFileTypes: true })) {
    const voll = path.join(ordner, eintrag.name);
    if (eintrag.isDirectory()) {
      await durchlaufen(voll, `${praefix}/${eintrag.name}`);
    } else if (eintrag.name === 'index.html') {
      vorhanden.add(`${praefix || ''}/`.replace(/\/+/g, '/'));
    }
  }
}
await durchlaufen(DIST);
console.log(`[urls] Neue Website: ${vorhanden.size} Seiten`);

// ── Abgleich ──────────────────────────────────────────────────────────

/**
 * `blind` ist der Fall, den man ohne diese Prüfung nicht bemerkt: Es gibt
 * eine Weiterleitung, aber ihr Ziel existiert nicht. Für die Person aus der
 * Suche ist das schlimmer als gar keine Weiterleitung – sie wartet erst auf
 * einen zweiten Seitenaufbau und sieht dann die Fehlerseite.
 */
const ergebnis = { vorhanden: [], weitergeleitet: [], tot: [], blind: [] };

/** Ein Sprungziel (#kategorie) ändert nichts daran, welche Seite geladen wird. */
const ohneSprungziel = (p) => (p ? p.split('#')[0] : p);

for (const [pfad, herkunft] of bestand) {
  if (vorhanden.has(pfad)) {
    ergebnis.vorhanden.push(pfad);
    continue;
  }
  /* Zuerst die gepflegte Zuordnung – sie ist das, was der Server ausliefert. */
  const gepflegt = ohneSprungziel(zielFuer(pfad));
  if (gepflegt && vorhanden.has(gepflegt)) {
    ergebnis.weitergeleitet.push({ pfad, ziel: gepflegt });
    continue;
  }
  if (gepflegt) {
    ergebnis.blind.push({ pfad, ziel: gepflegt });
    continue;
  }
  /* Danach die alte .htaccess: Führte sie schon auf eine Seite, die es
     weiterhin gibt, ist nichts zu tun. */
  const ziel = weiterleitungsziele.get(pfad);
  if (ziel && vorhanden.has(ziel)) {
    ergebnis.weitergeleitet.push({ pfad, ziel });
    continue;
  }
  ergebnis.tot.push({ pfad, herkunft });
}

/* Eine Weiterleitung, deren Quelle es als Seite gibt, verdeckt diese Seite.
   Das ist der teuerste Fehler, den diese Tabelle machen kann: Die Seite ist
   da, wird gebaut, und niemand sieht sie je. */
const verdeckt = [];
for (const muster of Object.keys(WEITERLEITUNGEN)) {
  if (muster.includes('[')) continue;
  const pfad = muster.endsWith('/') ? muster : `${muster}/`;
  if (vorhanden.has(pfad)) verdeckt.push(pfad);
}

const gesamt = bestand.size;
const anteil = (n) => `${((n / gesamt) * 100).toFixed(1)} %`;

console.log(`
[urls] Ergebnis
  vorhanden unter derselben Adresse : ${String(ergebnis.vorhanden.length).padStart(4)}  ${anteil(ergebnis.vorhanden.length)}
  über eine Weiterleitung erreichbar: ${String(ergebnis.weitergeleitet.length).padStart(4)}  ${anteil(ergebnis.weitergeleitet.length)}
  Weiterleitung ins Leere           : ${String(ergebnis.blind.length).padStart(4)}  ${anteil(ergebnis.blind.length)}
  TOT                               : ${String(ergebnis.tot.length).padStart(4)}  ${anteil(ergebnis.tot.length)}`);

if (verdeckt.length) {
  console.error(
    `\n[urls] ABBRUCH: ${verdeckt.length} Weiterleitungen verdecken eine Seite, die es gibt:`,
  );
  for (const p of verdeckt) console.error(`       ${p}`);
  console.error(
    '       Diese Zeilen gehören aus src/data/weiterleitungen.ts entfernt –\n' +
      '       die Seite unter derselben Adresse ist immer besser als jede\n' +
      '       Weiterleitung.',
  );
  process.exit(1);
}

if (ergebnis.blind.length) {
  console.error(`\n[urls] ABBRUCH: ${ergebnis.blind.length} Weiterleitungen zeigen ins Leere:`);
  for (const { pfad, ziel } of ergebnis.blind.slice(0, 20)) {
    console.error(`       ${pfad} → ${ziel}`);
  }
  if (ergebnis.blind.length > 20) console.error(`       … und ${ergebnis.blind.length - 20} weitere`);
  console.error(
    '       Das Ziel gibt es nicht. Für jemanden aus der Suche ist das\n' +
      '       schlechter als gar keine Weiterleitung: erst ein zweiter\n' +
      '       Seitenaufbau, dann die Fehlerseite.',
  );
  process.exit(1);
}

if (ergebnis.tot.length) {
  /* Nach Bereich gruppieren: 40 einzelne Teamseiten sind ein Befund, nicht
     vierzig. Wer eine Liste mit 200 Zeilen bekommt, liest sie nicht. */
  const bereiche = new Map();
  for (const { pfad } of ergebnis.tot) {
    const erstes = `/${pfad.split('/').filter(Boolean)[0] ?? ''}/`;
    if (!bereiche.has(erstes)) bereiche.set(erstes, []);
    bereiche.get(erstes).push(pfad);
  }

  console.log('\n[urls] Tote Adressen nach Bereich:');
  for (const [bereich, liste] of [...bereiche].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${String(liste.length).padStart(4)}  ${bereich}`);
    for (const p of liste.slice(0, 3)) console.log(`        ${p}`);
    if (liste.length > 3) console.log(`        … und ${liste.length - 3} weitere`);
  }

  console.error(
    `\n[urls] ABBRUCH: ${ergebnis.tot.length} Adressen des Altbestands laufen ins Leere.\n` +
      '       Jede davon ist eine Fehlerseite für Menschen aus der Suche und eine\n' +
      '       verlorene Platzierung. Entweder die Seite unter derselben Adresse\n' +
      '       anbieten (bevorzugt) oder eine Weiterleitung auf die inhaltlich\n' +
      '       nächstliegende Seite eintragen.',
  );
  process.exit(1);
}

console.log('\n[urls] Keine tote Adresse.');
