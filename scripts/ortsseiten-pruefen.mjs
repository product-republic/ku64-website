#!/usr/bin/env node
/**
 * Misst, wie viel eigenen Text eine Standortfassung wirklich hat.
 *
 * ── Warum es diese Prüfung gibt ─────────────────────────────────────────
 *
 * In `src/data/standortfassungen.ts` steht eine Regel: Eine Standortfassung
 * steht nur dann für sich – Canonical auf sich selbst, Eintrag in der Sitemap
 * –, wenn sie mindestens 350 Wörter enthält, die auf keiner anderen Seite
 * dieser Website vorkommen. Danach folgen fünf Punkte, was das inhaltlich
 * heißt: Behandelnde, Geräte, Ablauf, Anfahrt, örtliche Fragen.
 *
 * Diese Regel war bis heute eine Selbstverpflichtung. Wer einen Eintrag in
 * `EIGENSTAENDIGE_FASSUNGEN` setzt, behauptet damit, die 350 Wörter seien da –
 * und niemand hat nachgesehen. Genau so ist der Zustand entstanden, den das
 * ganze Kapitel beschreibt: 112 Seiten mit 248 Wörtern im Mittel, von denen
 * jede sich für ein Original hielt.
 *
 * Eine Regel, die nur im Kommentar steht, ist eine Absichtserklärung. Ab hier
 * ist sie eine Bedingung.
 *
 * ── Wie gemessen wird ───────────────────────────────────────────────────
 *
 * Am gebauten HTML, nicht an den Daten – nur das Bauergebnis ist die Wahrheit.
 *
 * Der Text jeder deutschen Seite wird in Sätze zerlegt. Ein Satz gilt als
 * eigen, wenn er auf genau EINER Seite dieser Website vorkommt. Die Wörter
 * dieser Sätze sind die „eigenen Wörter" der Seite.
 *
 * Satzweise und nicht wortweise, weil die Frage nicht ist, ob ein Wort
 * anderswo auch fällt – „Zahnimplantat" steht überall –, sondern ob die
 * AUSSAGE anderswo auch steht. Und ein Satz ist die kleinste Einheit, die
 * eine Aussage trägt.
 *
 * Kurze Sätze unter fünf Wörtern zählen nicht mit: „Termin buchen", „Mehr
 * erfahren", eine Anschrift. Sie sind Oberfläche und keine Substanz, und sie
 * wären der einfachste Weg, die Zahl zu schönen.
 *
 * ── Was die Prüfung NICHT kann ──────────────────────────────────────────
 *
 * Sie prüft die Menge, nicht die fünf Punkte. Ein Absatz aus 350 umformulierten
 * Wörtern besteht sie. Das ist keine Lücke, sondern eine Grenze: Ob ein Text
 * sagt, wo das DVT steht, kann nur ein Mensch beurteilen. Die Prüfung fängt
 * den Fall ab, den eine Maschine sicher erkennt – dass gar nichts da ist.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   npm run build && npm run ortsseiten:pruefen
 */

import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { STANDORTE } from '../src/data/standorte.ts';

const WURZEL = path.resolve(import.meta.dirname, '..');
const DIST = path.join(WURZEL, 'dist', 'client');

/** So viele eigene Wörter verlangt die Regel in standortfassungen.ts. */
const SCHWELLE = 350;

/** Kürzer als das ist kein Satz, sondern eine Schaltfläche. */
const SATZ_MINDESTENS = 5;

if (!existsSync(DIST)) {
  console.error('[orte] dist/client fehlt – bitte zuerst bauen.');
  process.exit(1);
}

/**
 * `EIGENSTAENDIGE_FASSUNGEN` aus der Quelldatei lesen – gelesen, nicht
 * importiert.
 *
 * `standortfassungen.ts` importiert `team.ts` und `profiltiefe.ts`, und zwar
 * ohne Dateiendung, wie es in Astro üblich ist. Node löst das beim direkten
 * Ausführen nicht auf. Die Alternative wäre, die Liste hier zu wiederholen –
 * und zwei Listen laufen auseinander, das ist auf diesem Projekt schon
 * mehrfach passiert.
 *
 * Damit die Regex nicht still ins Leere greift: Wird der Block nicht
 * gefunden, bricht der Lauf ab. Eine Prüfung, die eine leere Menge prüft,
 * besteht immer – und das wäre der schlechteste aller Zustände.
 */
async function eigenstaendigeFassungen() {
  const quelle = await readFile(path.join(WURZEL, 'src', 'data', 'standortfassungen.ts'), 'utf8');
  const block = quelle.match(/EIGENSTAENDIGE_FASSUNGEN[^=]*=\s*new Set\(\[([\s\S]*?)\]\)/);
  if (!block) {
    console.error(
      '[orte] ABBRUCH: `EIGENSTAENDIGE_FASSUNGEN … new Set([…])` steht nicht mehr\n' +
        '       so in src/data/standortfassungen.ts. Diese Prüfung liest die Liste\n' +
        '       aus dem Quelltext; findet sie sie nicht, prüft sie nichts.',
    );
    process.exit(1);
  }
  /* Auskommentierte Einträge sind keine – die Beispielzeile in der Datei ist
     eine. */
  const ohneKommentare = block[1].replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  return new Set([...ohneKommentare.matchAll(/['"`]([a-z0-9-]+\/[a-z0-9-]+)['"`]/g)].map((m) => m[1]));
}

const EIGENSTAENDIGE_FASSUNGEN = await eigenstaendigeFassungen();

/* ── Alle gebauten deutschen Seiten einsammeln ───────────────────────── */

async function seiten(verzeichnis, praefix = '') {
  const aus = [];
  for (const eintrag of await readdir(verzeichnis, { withFileTypes: true })) {
    const voll = path.join(verzeichnis, eintrag.name);
    if (eintrag.isDirectory()) {
      aus.push(...(await seiten(voll, `${praefix}/${eintrag.name}`)));
    } else if (eintrag.name === 'index.html') {
      aus.push({ pfad: `${praefix}/`, datei: voll });
    }
  }
  return aus;
}

/**
 * Der sichtbare Text einer Seite.
 *
 * Ohne Skripte, ohne Stile, ohne Kopf- und Fußbereich: Navigation und Fußzeile
 * stehen auf jeder Seite und wären auf jeder Seite „nicht eigen" – sie würden
 * die Messung nicht verfälschen, aber jede Seite gleich lang machen. Genommen
 * wird `<main>`, wenn es eines gibt.
 */
function sichtbar(html) {
  const haupt = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html;
  return haupt
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<template[\s\S]*?<\/template>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Sätze, normalisiert – Groß-/Kleinschreibung und Satzzeichen zählen nicht. */
function saetze(text) {
  return text
    .split(/(?<=[.!?:])\s+/)
    .map((s) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim())
    .filter((s) => s.split(' ').length >= SATZ_MINDESTENS);
}

const alle = (await seiten(DIST)).filter(
  (s) => !/^\/(en|fr)\//.test(s.pfad) && !/^\/(sitemap|robots)/.test(s.pfad),
);

/*
 * Wie oft kommt ein Satz auf dieser Website vor?
 *
 * Gezählt wird je SEITE und nicht je Vorkommen: Ein Satz, der auf derselben
 * Seite zweimal steht, ist immer noch nur dort zu Hause.
 */
const wieOftSeiten = new Map();
const proSeite = new Map();

for (const s of alle) {
  const menge = new Set(saetze(sichtbar(await readFile(s.datei, 'utf8'))));
  proSeite.set(s.pfad, menge);
  for (const satz of menge) wieOftSeiten.set(satz, (wieOftSeiten.get(satz) ?? 0) + 1);
}

/** Wörter in Sätzen, die es nur auf dieser einen Seite gibt. */
function eigeneWoerter(pfad) {
  let n = 0;
  for (const satz of proSeite.get(pfad) ?? []) {
    if (wieOftSeiten.get(satz) === 1) n += satz.split(' ').length;
  }
  return n;
}

/* ── Auswertung ──────────────────────────────────────────────────────── */

const messung = [];
for (const [pfad] of proSeite) {
  const treffer = pfad.match(/^\/([a-z-]+)\/leistungen\/([a-z0-9-]+)\/$/);
  if (!treffer) continue;
  if (!STANDORTE.some((s) => s.slug === treffer[1])) continue;
  messung.push({
    pfad,
    schluessel: `${treffer[1]}/${treffer[2]}`,
    eigen: eigeneWoerter(pfad),
    gesamt: [...(proSeite.get(pfad) ?? [])].reduce((n, s) => n + s.split(' ').length, 0),
  });
}
messung.sort((a, z) => z.eigen - a.eigen);

const mittel = Math.round(messung.reduce((s, m) => s + m.eigen, 0) / (messung.length || 1));

console.log(
  `[orte] ${messung.length} Standortfassungen gemessen – im Mittel ${mittel} eigene Wörter\n` +
    `       (eigen = Wörter in Sätzen, die auf keiner anderen Seite stehen; Schwelle ${SCHWELLE})`,
);

console.log('\n[orte] Die fünf mit dem meisten eigenen Text:');
for (const m of messung.slice(0, 5)) {
  console.log(`         ${String(m.eigen).padStart(4)} von ${String(m.gesamt).padStart(5)} W  ${m.pfad}`);
}

/*
 * Der eigentliche Wächter: Was sich für eigenständig erklärt, muss es sein.
 *
 * Andersherum wird NICHT geprüft – eine Fassung, die die Schwelle erreicht,
 * muss nicht eigenständig geschaltet werden. Ob 350 eigene Wörter auch die
 * fünf Punkte aus standortfassungen.ts erfüllen, entscheidet ein Mensch.
 */
const zuDuenn = [];
for (const schluessel of EIGENSTAENDIGE_FASSUNGEN) {
  const m = messung.find((x) => x.schluessel === schluessel);
  if (!m) {
    zuDuenn.push(`${schluessel}: steht in EIGENSTAENDIGE_FASSUNGEN, wurde aber nicht gebaut`);
  } else if (m.eigen < SCHWELLE) {
    zuDuenn.push(`${schluessel}: ${m.eigen} eigene Wörter, verlangt sind ${SCHWELLE}`);
  }
}

if (zuDuenn.length) {
  console.error(
    `\n[orte] ABBRUCH: ${zuDuenn.length} Fassung(en) erklären sich für eigenständig,\n` +
      '       ohne es zu sein:',
  );
  for (const z of zuDuenn) console.error(`         ${z}`);
  console.error(
    '\n       Entweder bekommt die Seite den Inhalt, den die Regel in\n' +
      '       src/data/standortfassungen.ts beschreibt – Behandelnde, Geräte,\n' +
      '       Ablauf, Anfahrt, örtliche Fragen –, oder der Eintrag kommt wieder\n' +
      '       heraus. Ein Canonical auf sich selbst ohne eigenen Inhalt ist die\n' +
      '       Behauptung, hier stünde etwas Neues.',
  );
  process.exit(1);
}

const bereit = messung.filter(
  (m) => m.eigen >= SCHWELLE && !EIGENSTAENDIGE_FASSUNGEN.has(m.schluessel),
);

if (bereit.length) {
  console.log(
    `\n[orte] ${bereit.length} Fassung(en) hätten den Umfang, stehen aber nicht in\n` +
      '       EIGENSTAENDIGE_FASSUNGEN. Das ist kein Fehler – die Menge ist nur\n' +
      '       die halbe Bedingung. Zu prüfen ist, ob der Text auch die fünf\n' +
      '       Punkte trägt:',
  );
  for (const b of bereit.slice(0, 10)) console.log(`         ${String(b.eigen).padStart(4)} W  ${b.schluessel}`);
}

if (EIGENSTAENDIGE_FASSUNGEN.size === 0) {
  console.log(
    '\n[orte] In Ordnung: Keine Fassung erklärt sich für eigenständig, und nach\n' +
      `       dieser Messung könnte es auch keine – die beste liegt bei ${messung[0]?.eigen ?? 0}\n` +
      `       eigenen Wörtern, verlangt sind ${SCHWELLE}. Alle ${messung.length} verweisen per\n` +
      '       Canonical auf die Hauptseite und stehen nicht in der Sitemap:\n' +
      '       sichtbar unfertig statt unsichtbar doppelt.\n' +
      '\n' +
      '       Was fehlt, kann nur die Praxis liefern – Geräte, Ablauf,\n' +
      '       Sitzungszahl und Wartezeit je Haus. Die fünf Punkte stehen in\n' +
      '       src/data/standortfassungen.ts.',
  );
} else {
  console.log(
    `\n[orte] In Ordnung: Alle ${EIGENSTAENDIGE_FASSUNGEN.size} eigenständigen Fassungen\n` +
      `       tragen mindestens ${SCHWELLE} eigene Wörter.`,
  );
}
