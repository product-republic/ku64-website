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
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

const ergebnis = { vorhanden: [], weitergeleitet: [], tot: [] };

for (const [pfad, herkunft] of bestand) {
  if (vorhanden.has(pfad)) {
    ergebnis.vorhanden.push(pfad);
    continue;
  }
  const ziel = weiterleitungsziele.get(pfad);
  if (ziel && vorhanden.has(ziel)) {
    ergebnis.weitergeleitet.push({ pfad, ziel });
    continue;
  }
  ergebnis.tot.push({ pfad, herkunft });
}

const gesamt = bestand.size;
const anteil = (n) => `${((n / gesamt) * 100).toFixed(1)} %`;

console.log(`
[urls] Ergebnis
  vorhanden unter derselben Adresse : ${String(ergebnis.vorhanden.length).padStart(4)}  ${anteil(ergebnis.vorhanden.length)}
  über eine Weiterleitung erreichbar: ${String(ergebnis.weitergeleitet.length).padStart(4)}  ${anteil(ergebnis.weitergeleitet.length)}
  TOT                               : ${String(ergebnis.tot.length).padStart(4)}  ${anteil(ergebnis.tot.length)}`);

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
