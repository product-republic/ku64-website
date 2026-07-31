/**
 * Die übersetzten Korpusdateien zu je einer Sprachfassung zusammenführen.
 *
 * ── Warum das Einspielen ein eigener Schritt ist ────────────────────────
 *
 * Der Übersetzungslauf schreibt eine Datei je Thema und Sprache – 146 Dateien
 * für 73 Themen. Das ist die richtige Form für die Arbeit: Ein Thema, ein
 * Auftrag, ein Ergebnis, und wenn eines misslingt, muss nicht alles wiederholt
 * werden.
 *
 * Es ist die falsche Form für den Bau. Astro soll zwei Dateien einlesen, nicht
 * 146 – und `git diff` soll zeigen, was sich an einer Sprache geändert hat,
 * nicht in welcher von 146 Dateien.
 *
 * ── Was hier NICHT durchgelassen wird ───────────────────────────────────
 *
 * Eine Übersetzung, die strukturell vom Original abweicht. Das ist der
 * gefährliche Fehler: Fehlt ein Abschnitt, baut die Seite weiter und ist nur
 * kürzer – genau der Verlust, gegen den `inhalt-pruefen.mjs` gebaut wurde,
 * nur eine Sprache weiter.
 *
 * Geprüft wird deshalb dreifach:
 *
 *   1. Gleiche Anzahl Abschnitte wie im Deutschen.
 *   2. Je Abschnitt gleiche Anzahl Blöcke.
 *   3. Je Block dieselbe `art` – ein `li`, das zu `p` wird, zerstört eine
 *      Aufzählung, und das sieht man in der Wortzahl nicht.
 *
 * Was durchfällt, wird NICHT eingespielt und namentlich gemeldet. Auf der
 * Website steht dann weiter der deutsche Text, ausgezeichnet mit `lang="de"` –
 * sichtbar unfertig statt unsichtbar beschädigt.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   node scripts/korpus-einspielen.mjs <verzeichnis>
 *
 * Erwartet darin `en/<index>.json` und `fr/<index>.json` sowie die
 * `arbeit.json`, die den Index auf Bereich und Schlüssel abbildet.
 */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const WURZEL = path.resolve(import.meta.dirname, '..');
const VERZEICHNIS = process.argv[2];

if (!VERZEICHNIS || !existsSync(VERZEICHNIS)) {
  console.error('[korpus] Bitte das Verzeichnis mit den Übersetzungen angeben.');
  console.error('         node scripts/korpus-einspielen.mjs <verzeichnis>');
  process.exit(1);
}

const arbeit = JSON.parse(await readFile(path.join(VERZEICHNIS, 'arbeit.json'), 'utf8'));
const deutsch = JSON.parse(
  await readFile(path.join(WURZEL, 'src', 'inhalte', 'langtexte.json'), 'utf8'),
);

const woerter = (ab) =>
  ab.reduce(
    (s, a) =>
      s +
      (a.ueberschrift ? a.ueberschrift.split(/\s+/).length : 0) +
      a.bloecke.reduce((t, b) => t + b.text.split(/\s+/).filter(Boolean).length, 0),
    0,
  );

/**
 * Passt die Übersetzung strukturell zum Original?
 *
 * Gibt eine Liste von Gründen zurück – leer heißt: passt. Alle Gründe werden
 * gesammelt, nicht nur der erste: Wer eine Datei nachbessert, will wissen, was
 * insgesamt daran fehlt.
 */
function abweichungen(de, u) {
  const gruende = [];
  if (!u.abschnitte || !Array.isArray(u.abschnitte)) return ['kein Abschnitts-Array'];
  if (u.abschnitte.length !== de.abschnitte.length) {
    gruende.push(`${u.abschnitte.length} Abschnitte statt ${de.abschnitte.length}`);
  }
  const n = Math.min(u.abschnitte.length, de.abschnitte.length);
  for (let i = 0; i < n; i++) {
    const a = de.abschnitte[i];
    const b = u.abschnitte[i];
    if (!b?.bloecke) {
      gruende.push(`Abschnitt ${i}: keine Blöcke`);
      continue;
    }
    if (b.bloecke.length !== a.bloecke.length) {
      gruende.push(`Abschnitt ${i}: ${b.bloecke.length} Blöcke statt ${a.bloecke.length}`);
      continue;
    }
    for (let k = 0; k < a.bloecke.length; k++) {
      if (b.bloecke[k].art !== a.bloecke[k].art) {
        gruende.push(`Abschnitt ${i}, Block ${k}: art "${b.bloecke[k].art}" statt "${a.bloecke[k].art}"`);
      }
      if (!String(b.bloecke[k].text ?? '').trim()) {
        gruende.push(`Abschnitt ${i}, Block ${k}: leerer Text`);
      }
    }
    /* Die Stufe darf nicht wandern – sonst verschiebt sich die Gliederung. */
    if ((b.stufe ?? null) !== (a.stufe ?? null)) {
      gruende.push(`Abschnitt ${i}: Stufe "${b.stufe}" statt "${a.stufe}"`);
    }
  }
  return gruende;
}

/**
 * Die Verweisziele des deutschen Originals an die Übersetzung weitergeben.
 *
 * ── Warum die Ziele nur einmal gepflegt werden ──────────────────────────
 *
 * Welcher Strichpunkt auf `/ueber-uns/` wohin zeigt, steht von Hand in
 * `scripts/langtexte-bauen.mjs` und landet in der deutschen `langtexte.json`.
 * Ein zweiter Satz Ziele je Sprache wäre eine zweite Pflegestelle – und damit
 * die Stelle, an der eine davon veraltet, ohne dass es jemand merkt. Die
 * Übersetzung erbt sie deshalb hier, Block für Block über den Index; dass die
 * Blockfolge übereinstimmt, hat `abweichungen()` unmittelbar davor geprüft.
 *
 * Aus dem Zielpfad wird in `Langtext.astro` über `pfadInSprache` die
 * /en/- bzw. /fr/-Adresse. Eine englische Seite verlinkt also nicht die
 * deutsche.
 *
 * ── Was nicht mitkommt, und warum das gemeldet wird ─────────────────────
 *
 * Der Linktext ist ein wörtlicher Ausschnitt des deutschen Blocktextes –
 * „Wurzelkanalbehandlung (Endodontie)". In der Übersetzung steht dort etwas
 * anderes, und ein Ausschnitt, den es im Text nicht gibt, kann nicht verlinkt
 * werden. Solche Verweise fallen weg statt an geratener Stelle zu greifen;
 * gezählt werden sie trotzdem, sonst wäre die Übersetzung stiller ärmer als
 * das Original.
 */
function zieleDurchreichen(de, abschnitte, verloren) {
  return abschnitte.map((a, i) => ({
    ...a,
    bloecke: a.bloecke.map((b, k) => {
      const quelle = de.abschnitte[i]?.bloecke[k]?.verweise;
      if (!quelle?.length) return b;
      const passend = quelle.filter((v) => b.text.includes(v.text));
      for (const v of quelle) {
        if (!passend.includes(v)) verloren.push(`${v.text} → ${v.ziel}`);
      }
      return passend.length ? { ...b, verweise: passend } : b;
    }),
  }));
}

for (const sprache of ['en', 'fr']) {
  const ordner = path.join(VERZEICHNIS, sprache);
  if (!existsSync(ordner)) {
    console.log(`[korpus] ${sprache}: kein Verzeichnis – übersprungen`);
    continue;
  }

  const dateien = (await readdir(ordner)).filter((d) => d.endsWith('.json'));

  /*
   * Die Bereiche stehen hier ausgeschrieben und nicht als `{}`-Sammelbecken.
   *
   * Der Grund ist der Fehler, der hier bis zum 31.07.2026 saß: `themen` fehlte.
   * Die zehn wiederhergestellten Belegseiten unter /ueber-uns/ hätten damit nie
   * eine Übersetzung bekommen – nicht mit einer Fehlermeldung, sondern indem
   * `fassung['themen'][…] = …` auf `undefined` zugegriffen hätte. Ein Bereich,
   * der neu dazukommt, muss hier eingetragen werden, sonst fällt er still aus.
   */
  const fassung = { leistungen: {}, unterthemen: {}, kategorien: {}, neu: {}, themen: {} };

  const abgelehnt = [];
  const verloreneVerweise = [];
  let uebernommen = 0;
  let woerterGesamt = 0;

  for (const d of dateien) {
    const i = Number(path.basename(d, '.json'));
    const eintrag = arbeit[i];
    if (!eintrag) {
      abgelehnt.push(`${d}: Index ${i} steht nicht in arbeit.json`);
      continue;
    }

    let u;
    try {
      u = JSON.parse(await readFile(path.join(ordner, d), 'utf8'));
    } catch (f) {
      abgelehnt.push(`${eintrag.schluessel}: unlesbar (${f.message})`);
      continue;
    }

    /* Ein Bereich, den `fassung` nicht kennt, wird gemeldet und nicht
       stillschweigend verworfen – sonst wäre der obige Fehler nur verschoben. */
    if (!(eintrag.bereich in fassung)) {
      abgelehnt.push(`${eintrag.schluessel}: Bereich "${eintrag.bereich}" ist hier nicht vorgesehen`);
      continue;
    }

    const de = deutsch[eintrag.bereich]?.[eintrag.schluessel];
    if (!de) {
      abgelehnt.push(`${eintrag.schluessel}: im deutschen Bestand nicht gefunden`);
      continue;
    }

    /* Der Schlüssel in der Datei muss stimmen – sonst landet ein Text unter
       einem fremden Thema, und das fällt später niemandem auf. */
    if (u.schluessel && u.schluessel !== eintrag.schluessel) {
      abgelehnt.push(`${eintrag.schluessel}: Datei nennt sich "${u.schluessel}"`);
      continue;
    }

    const gruende = abweichungen(de, u);
    if (gruende.length) {
      abgelehnt.push(`${eintrag.schluessel}: ${gruende.slice(0, 3).join('; ')}`);
      continue;
    }

    fassung[eintrag.bereich][eintrag.schluessel] = {
      titel: u.titel ?? null,
      abschnitte: zieleDurchreichen(de, u.abschnitte, verloreneVerweise),
    };
    uebernommen++;
    woerterGesamt += woerter(u.abschnitte);
  }

  const ziel = path.join(WURZEL, 'src', 'inhalte', `langtexte-${sprache}.json`);
  await writeFile(
    ziel,
    JSON.stringify(
      {
        sprache,
        erzeugtAm: new Date().toISOString(),
        hinweis:
          'Erzeugt von scripts/korpus-einspielen.mjs. Nicht von Hand bearbeiten. Ein Thema, ' +
          'dessen Struktur vom deutschen Original abweicht, wird nicht übernommen – dort steht ' +
          'auf der Website weiter Deutsch, ausgezeichnet mit lang="de".',
        /*
         * `anzahl`, nicht `themen`.
         *
         * `themen` ist seit dem 31.07.2026 ein BEREICH des Korpus. Hätte die
         * Kennzahl weiter so geheißen, stünde in der Datei erst die Zahl und
         * danach – durch `...fassung` – das Verzeichnis; `src/lib/langtexte.ts`
         * liest `themen` als Verzeichnis und hätte je nach Reihenfolge eine
         * Zahl bekommen. Kein Absturz, nur zehn Seiten ohne Übersetzung.
         */
        anzahl: uebernommen,
        woerter: woerterGesamt,
        ...fassung,
      },
      null,
      1,
    ),
  );

  console.log(
    `[korpus] ${sprache}: ${uebernommen} von ${arbeit.length} Themen, ` +
      `${woerterGesamt.toLocaleString('de-DE')} Wörter → ${path.relative(WURZEL, ziel)}`,
  );

  if (abgelehnt.length) {
    console.log(`         ${abgelehnt.length} abgelehnt:`);
    for (const a of abgelehnt.slice(0, 15)) console.log(`           ${a}`);
    if (abgelehnt.length > 15) console.log(`           … und ${abgelehnt.length - 15} weitere`);
  }

  /* Kein Abbruch – ein Punkt ohne Link ist keine kaputte Seite. Aber sichtbar,
     damit niemand annimmt, /en/ueber-uns/ verlinke wie /ueber-uns/. */
  if (verloreneVerweise.length) {
    console.log(
      `         ${verloreneVerweise.length} Verweis(e) ohne Entsprechung im übersetzten Text:`,
    );
    for (const v of verloreneVerweise.slice(0, 10)) console.log(`           ${v}`);
    if (verloreneVerweise.length > 10) {
      console.log(`           … und ${verloreneVerweise.length - 10} weitere`);
    }
  }

  /*
   * Alles abgelehnt heißt: nicht der Inhalt ist schuld, sondern das Verfahren.
   *
   * Einzelne Ablehnungen sind ein gültiger Zustand – dort bleibt Deutsch
   * stehen, mit `lang="de"`, sichtbar unfertig. Null von vier ist etwas
   * anderes: Dann stimmt eine Annahme nicht, und der Lauf soll rot sein.
   *
   * Genau dieser Fall ist am 31.07.2026 eingetreten. Vier gute Übersetzungen
   * trugen `"schluessel": "undefined"`, weil im Auftrag ein Feld fehlte, das
   * es an der Stelle nie gab. Der Lauf war grün, der Pull Request entstand,
   * und in den Sprachdateien stand null. Nur wer die Zahl gelesen hat, hätte
   * es gemerkt.
   */
  if (dateien.length > 0 && uebernommen === 0) {
    console.error(
      `\n[korpus] ABBRUCH: ${dateien.length} Datei(en) lagen vor und keine einzige\n` +
        '         wurde übernommen. Das ist kein Inhaltsproblem, sondern ein\n' +
        '         Verfahrensfehler – die Gründe stehen oben, alle mit demselben\n' +
        '         Muster.',
    );
    process.exit(1);
  }
}

console.log('\n[korpus] Bitte anschließend `npm run build` – inhalt:pruefen sieht die Abdeckung.');
