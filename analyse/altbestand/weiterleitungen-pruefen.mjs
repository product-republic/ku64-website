/**
 * Wertet die Yoast-Weiterleitungen aus der alten .htaccess aus.
 *
 * Sucht nach dem, was beim Umzug wirklich weh tut:
 *   1. Ketten – eine Weiterleitung zeigt auf eine Adresse, die selbst wieder
 *      weiterleitet. Jeder Sprung kostet Ladezeit, und Google folgt nicht
 *      beliebig weit.
 *   2. Schleifen – zwei Regeln zeigen aufeinander. Endlos.
 *   3. Ziele mit Tippfehlern, die ins Leere laufen.
 *   4. Die tatsächliche URL-Struktur der alten Website, abgeleitet aus
 *      Quellen und Zielen.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const HIER = import.meta.dirname;
const text = Buffer.from(readFileSync(path.join(HIER, 'htaccess.b64'), 'utf8').trim(), 'base64')
  .toString('utf8');

writeFileSync(path.join(HIER, 'htaccess.txt'), text);

// ── Regeln einlesen ───────────────────────────────────────────────────────

const aktiv = [];
const deaktiviert = [];

for (const zeile of text.split('\n')) {
  const t = zeile.trim();
  const treffer = t.match(/^(#?)\s*Redirect\s+301\s+"([^"]+)"\s+"([^"]+)"/);
  if (!treffer) continue;
  const [, kommentar, von, nach] = treffer;
  (kommentar ? deaktiviert : aktiv).push({ von, nach });
}

const karte = new Map(aktiv.map((r) => [r.von, r.nach]));

// ── 1 + 2: Ketten und Schleifen ───────────────────────────────────────────

const ketten = [];
const schleifen = [];

for (const { von } of aktiv) {
  const pfad = [von];
  let aktuell = von;

  for (let i = 0; i < 12; i++) {
    const naechst = karte.get(aktuell);
    if (!naechst) break;
    if (pfad.includes(naechst)) {
      schleifen.push([...pfad, naechst]);
      break;
    }
    pfad.push(naechst);
    aktuell = naechst;
  }

  if (pfad.length > 2) ketten.push(pfad);
}

// Nur die längste Kette je Startpunkt behalten, die Teilketten sind redundant.
const echteKetten = ketten
  .filter((k) => !ketten.some((a) => a.length > k.length && a.join('>').endsWith(k.join('>'))))
  .sort((a, b) => b.length - a.length);

// ── 3: verdächtige Ziele ──────────────────────────────────────────────────

const alleZiele = new Set(aktiv.map((r) => r.nach));
const alleQuellen = new Set(aktiv.map((r) => r.von));

const verdaechtig = aktiv.filter(({ nach }) => {
  // Tippfehler-Erkennung: Ziel weicht nur minimal von einem verbreiteten
  // Präfix ab, das sonst überall korrekt geschrieben ist.
  if (/^\/leistugen/.test(nach)) return true;
  // Ziel enthält eine Domain im Pfad – fast immer ein Fehler.
  if (/ku64\.de/.test(nach)) return true;
  return false;
});

// ── 4: URL-Struktur ableiten ──────────────────────────────────────────────

const bereiche = new Map();
for (const p of [...alleQuellen, ...alleZiele]) {
  const erster = p.split('/').filter(Boolean)[0];
  if (!erster) continue;
  bereiche.set(erster, (bereiche.get(erster) ?? 0) + 1);
}

// ── Ausgabe ───────────────────────────────────────────────────────────────

const zeilen = [];
const z = (s = '') => zeilen.push(s);

z('# Auswertung der Weiterleitungen aus der alten .htaccess');
z();
z(`Aktive 301-Weiterleitungen: **${aktiv.length}**`);
z(`Auskommentiert (wirkungslos): **${deaktiviert.length}**`);
z();

z('## 1. Weiterleitungsketten');
z();
z('Jeder zusätzliche Sprung kostet Ladezeit und verwässert das Linksignal.');
z('Google folgt Ketten nur begrenzt weit.');
z();
if (echteKetten.length === 0) z('Keine gefunden.');
for (const k of echteKetten) {
  z(`- **${k.length - 1} Sprünge:** \`${k.join('\`\n  → \`')}\``);
}
z();

z('## 2. Schleifen');
z();
if (schleifen.length === 0) {
  z('Keine gefunden.');
} else {
  for (const s of schleifen) z(`- \`${s.join('` → `')}\``);
}
z();

z('## 3. Ziele, die ins Leere laufen');
z();
if (verdaechtig.length === 0) {
  z('Keine gefunden.');
} else {
  for (const v of verdaechtig) z(`- \`${v.von}\` → \`${v.nach}\``);
}
z();

z('## 4. Auskommentierte Regeln');
z();
z('Diese Adressen wurden früher weitergeleitet, laufen jetzt aber ins Nichts,');
z('sofern die Zielseite nicht existiert:');
z();
for (const d of deaktiviert) z(`- \`${d.von}\` (sollte auf \`${d.nach}\`)`);
z();

z('## 5. Tatsächliche URL-Bereiche der alten Website');
z();
z('| Bereich | Nennungen |');
z('|---|---|');
for (const [b, n] of [...bereiche.entries()].sort((a, b) => b[1] - a[1])) {
  z(`| \`/${b}/\` | ${n} |`);
}

writeFileSync(path.join(HIER, 'WEITERLEITUNGEN.md'), zeilen.join('\n') + '\n');

// Maschinenlesbar für den späteren Umzug.
writeFileSync(
  path.join(HIER, 'weiterleitungen.json'),
  JSON.stringify({ aktiv, deaktiviert, ketten: echteKetten, schleifen }, null, 2),
);

console.log(`Aktive Weiterleitungen: ${aktiv.length}`);
console.log(`Auskommentiert:         ${deaktiviert.length}`);
console.log(`Ketten:                 ${echteKetten.length}`);
console.log(`Schleifen:              ${schleifen.length}`);
console.log(`Fehlerhafte Ziele:      ${verdaechtig.length}`);
console.log(`URL-Bereiche:           ${bereiche.size}`);
