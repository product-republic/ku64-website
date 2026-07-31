/**
 * Sprachwächter. Beantwortet genau eine Frage: Gibt es einen Inhalt, den es
 * auf Deutsch gibt und in einer anderen Sprache nicht?
 *
 * Geprüft wird auf vier Ebenen, weil eine allein nicht reicht:
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
 *   4. Der Weg zwischen den Sprachen. Die ersten drei Ebenen prüfen, ob eine
 *      Sprache vollständig ist – keine prüft, ob man sie erreicht.
 *   5. Auszeichnung und Platzhalter. Ein paar Texte tragen <strong>, <code>
 *      oder {platzhalter} mitten im Satz. Geht eines davon beim Übersetzen
 *      verloren, ist der Satz sprachlich einwandfrei und die Seite kaputt.
 *
 * Für freigegebene Sprachen ist jeder Fund der Ebenen 1–3 ein Fehler und der
 * Build bricht ab. Für Sprachen im Aufbau ist er eine Rückstandsliste.
 * Ebene 4 ist immer streng: Sie hängt nicht daran, wie weit eine Übersetzung
 * ist, sondern nur daran, ob die Links stimmen.
 *
 * ── Warum es Ebene 4 gibt ───────────────────────────────────────────────
 *
 * Weil sie einmal gefehlt hat. Die Middleware hält interne Links in der
 * Sprache der Seite und hatte dabei auch den Sprachwähler erwischt: Auf
 * `/en/…` zeigten alle drei Knöpfe auf `/en/…`. Deutsch war die einzige
 * Sprache, aus der man herauskam – von überall sonst führte kein Weg zurück.
 *
 * Kein Prüfschritt sah das. Ebene 1 war zufrieden (die Schlüssel waren da),
 * der Linkprüfer war zufrieden (die Ziele existierten), und die Seite
 * lieferte 200. Der Fehler steckte nicht in einem Wert, sondern in einer
 * Beziehung: Der Knopf mit der Aufschrift „Deutsch" führte nicht nach
 * Deutsch. Genau das prüft Ebene 4 – gegen die Aufschrift, nicht gegen eine
 * Erwartungsliste.
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const { quelltexte } = await import(pathToFileURL(path.join(WURZEL, 'src/i18n/quelle.ts')).href);
const { fingerabdruck } = await import(pathToFileURL(path.join(WURZEL, 'src/i18n/felder.ts')).href);
const { SPRACHEN, QUELLSPRACHE, spracheAusPfad } = await import(
  pathToFileURL(path.join(WURZEL, 'src/i18n/sprachen.ts')).href
);

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

const WORTMARKEN = [
  '>Mo<', '>Di<', '>Mi<', '>Do<', '>Fr<', '>Sa<', '>So<',
  '>geschlossen<', '>nach Vereinbarung<', 'Tage/Woche',
];

const nurBericht = process.argv.includes('--bericht');

const quelle = quelltexte();
const quellHashes = new Map(
  Object.entries(quelle).map(([schluessel, text]) => [schluessel, fingerabdruck(text)]),
);

console.log(`[sprachen] Quellfassung ${QUELLSPRACHE}: ${quellHashes.size} Textbausteine`);

let fehler = 0;
let wegFehler = 0;
let bausteinFehler = 0;
const kataloge = {};
const zusammenfassung = [];

for (const sprache of SPRACHEN) {
  if (sprache.code === QUELLSPRACHE) continue;

  const katalogPfad = path.join(WURZEL, 'src/inhalte', `${sprache.code}.json`);
  const katalog = JSON.parse(await readFile(katalogPfad, 'utf8'));
  const eintraege = katalog.eintraege ?? {};
  /* Für Ebene 5 aufheben – zweimal dieselbe Datei zu lesen wäre unnötig. */
  kataloge[sprache.code] = katalog;

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

    /* ── Ebene 3b: deutsche Wortmarken, die kein Marker fängt ──────────── */
    const marken = await deutscheWortmarkenSuchen(distSprache);
    if (marken.length) {
      const summe = marken.reduce((n, m) => n + m.seiten, 0);
      console.log(`  ${marke}: ${marken.length} deutsche Wortmarke(n) in ${summe} Seitentreffern`);
      for (const m of marken) console.log(`    · „${m.text}" auf ${m.seiten} Seiten`);
      fehler++;
    } else {
      console.log('  Deutsche Wortmarken (Wochentage, Zeitangaben): keine');
    }
  }
}

// ── Ebene 4: Führt der Sprachwähler aus der Sprache heraus? ─────────────

const dist = path.join(WURZEL, 'dist/client');
if (existsSync(dist)) {
  const { seiten, befunde } = await sprachwaehlerPruefen(dist);
  console.log(`\n[sprachen] Sprachwähler auf ${seiten} gebauten Seiten geprüft`);

  if (befunde.length) {
    console.log(`  FEHLER: ${befunde.length} Seite(n) mit falschen Zielen`);
    for (const b of befunde.slice(0, 10)) {
      console.log(`    · ${b.datei}`);
      for (const z of b.zeilen) console.log(`        ${z}`);
    }
    if (befunde.length > 10) console.log(`    … und ${befunde.length - 10} weitere`);
    wegFehler = befunde.length;
  } else {
    console.log('  Jede Seite führt in jede Sprache. In Ordnung.');
  }
}

// ── Ebene 5: Auszeichnung und Platzhalter unverändert? ──────────────────

const bausteinBefunde = bausteinePruefen();
if (bausteinBefunde.length) {
  console.log(`\n[sprachen] FEHLER: ${bausteinBefunde.length} Übersetzung(en) mit fehlender Auszeichnung`);
  for (const b of bausteinBefunde.slice(0, 12)) console.log(`    · ${b}`);
  if (bausteinBefunde.length > 12) {
    console.log(`    … und ${bausteinBefunde.length - 12} weitere`);
  }
  bausteinFehler = bausteinBefunde.length;
} else {
  console.log('\n[sprachen] Auszeichnung und Platzhalter: unverändert übernommen');
}

console.log('\n[sprachen] Übersicht');
for (const z of zusammenfassung) {
  console.log(
    `  ${z.sprache}  ${String(z.quote).padStart(5)} %  ` +
      `fehlend ${String(z.fehlend).padStart(4)}  veraltet ${String(z.veraltet).padStart(3)}  ` +
      `${z.freigegeben ? 'freigegeben' : 'im Aufbau'}`,
  );
}

if (bausteinFehler > 0) {
  console.error(
    `\n[sprachen] ABBRUCH: ${bausteinFehler} Übersetzung(en) haben Auszeichnung oder\n` +
      '           Platzhalter verloren. Der Satz liest sich dann richtig und die\n' +
      '           Seite zeigt trotzdem Unsinn – ein <code> weniger, und die Stelle,\n' +
      '           die die Praxis noch befüllen muss, sieht aus wie fertiger Text.\n' +
      '           Abhilfe: den Eintrag in src/inhalte/ löschen und neu übersetzen.',
  );
  process.exit(1);
}

if (wegFehler > 0) {
  console.error(
    `\n[sprachen] ABBRUCH: Auf ${wegFehler} Seite(n) führt der Sprachwähler nicht dorthin,\n` +
      '           wo er hinzuführen behauptet. Eine Sprache, die man nicht mehr\n' +
      '           verlassen kann, ist eine Sackgasse.\n' +
      '           Verdächtig ist zuerst src/middleware.ts – dort werden interne\n' +
      '           Links in die Sprache der Seite gezogen, und der Sprachwähler ist\n' +
      '           die eine Ausnahme davon (Attribut hreflang bzw. data-sprachfest).',
  );
  process.exit(1);
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

/**
 * Ebene 3b: deutsche Wortmarken, die die Markerliste prinzipiell nicht fängt.
 *
 * ── Warum es diese zweite Suche braucht ─────────────────────────────────
 *
 * Ebene 3 sucht deutsche FUNKTIONSWÖRTER – „und", „nicht", „werden". Sie
 * findet damit ganze Sätze, die nicht übersetzt wurden, und das tut sie gut.
 *
 * Sie kann aber nichts finden, was aus einem einzelnen Wort besteht. Genau
 * das war der Fehler, der sie vier Tage lang passiert hat: In sechs
 * Öffnungszeiten-Tabellen stand `{z.tag}` roh im `<th>`, also der
 * Datenschlüssel statt einer Beschriftung. „Mo Di Mi Do Fr Sa So" auf 355
 * englischen und 355 französischen Seiten – und kein Marker traf, weil kein
 * einziges Funktionswort darin vorkommt.
 *
 * Auf Französisch war es dabei nicht bloß unübersetzt, sondern eine falsche
 * Auskunft: `Di` steht dort für *dimanche*, den Sonntag. In unserer Tabelle
 * bezeichnete es den Dienstag.
 *
 * ── Warum in spitzen Klammern gesucht wird ──────────────────────────────
 *
 * `>geschlossen<` und nicht `geschlossen`: Nur so trifft die Suche eine
 * Zelle, die genau dieses Wort enthält, und nicht das Wort mitten im Text.
 * Ohne die Klammern meldete die Suche 53 englische Seiten, auf denen in
 * Wahrheit „eingeschlossenen Leistungen" stand – ein Wächter, der
 * Fehlalarme gibt, wird abgeschaltet.
 *
 * Eine Wortmarke reicht: Anders als bei den Funktionswörtern gibt es hier
 * keinen Fall, in dem ein deutsches `<th>Di</th>` auf einer englischen Seite
 * richtig wäre.
 */

async function deutscheWortmarkenSuchen(verzeichnis) {
  const { readdir } = await import('node:fs/promises');
  const zaehler = new Map(WORTMARKEN.map((m) => [m, 0]));

  async function durchlaufen(ordner) {
    for (const eintrag of await readdir(ordner, { withFileTypes: true })) {
      const voll = path.join(ordner, eintrag.name);
      if (eintrag.isDirectory()) await durchlaufen(voll);
      else if (eintrag.name.endsWith('.html')) {
        const html = await readFile(voll, 'utf8');
        for (const m of WORTMARKEN) if (html.includes(m)) zaehler.set(m, zaehler.get(m) + 1);
      }
    }
  }

  await durchlaufen(verzeichnis);
  return [...zaehler].filter(([, n]) => n > 0).map(([text, seiten]) => ({ text, seiten }));
}

/**
 * Prüft auf jeder gebauten Seite die Ziele des Sprachwählers.
 *
 * Die Prüfung vergleicht nicht gegen eine Erwartungsliste, sondern gegen die
 * Aufschrift des Knopfes selbst: Ein Link mit `data-sprache="de"` muss auf
 * einen Pfad zeigen, den `spracheAusPfad` als Deutsch liest. Damit kann die
 * Prüfung nicht mit demselben Denkfehler danebenliegen wie die Erzeugung –
 * sie stellt nur fest, ob Beschriftung und Ziel dasselbe sagen.
 *
 * Zusätzlich müssen die Ziele voneinander verschieden sein. Drei Knöpfe, die
 * alle auf dieselbe Adresse zeigen, wären formal je „richtig", wenn diese
 * Adresse zufällig die eigene Sprache trägt – zusammen sind sie trotzdem
 * kaputt.
 */
async function sprachwaehlerPruefen(verzeichnis) {
  const { readdir } = await import('node:fs/promises');
  const befunde = [];
  let seiten = 0;

  const ANKER = /<a\b((?:"[^"]*"|'[^']*'|[^>"'])*)>/gi;

  async function durchlaufen(ordner) {
    for (const eintrag of await readdir(ordner, { withFileTypes: true })) {
      const voll = path.join(ordner, eintrag.name);
      if (eintrag.isDirectory()) await durchlaufen(voll);
      else if (eintrag.name.endsWith('.html')) await pruefen(voll);
    }
  }

  async function pruefen(datei) {
    const html = await readFile(datei, 'utf8');
    if (!html.includes('data-sprache=')) return; // Weiterleitungsseiten u. Ä.

    /* Der Wähler steht zweimal im Markup – in der Leiste und im mobilen Menü.
       Beide müssen stimmen, aber gemeldet wird jedes Ziel nur einmal. */
    const ziele = new Map();
    for (const [, attribute] of html.matchAll(ANKER)) {
      const code = attribute.match(/\bdata-sprache="([a-z]{2})"/)?.[1];
      if (!code) continue;
      const ziel = attribute.match(/\bhref="([^"]*)"/)?.[1];
      if (!ziel) continue;
      if (!ziele.has(code)) ziele.set(code, new Set());
      ziele.get(code).add(ziel);
    }
    if (ziele.size === 0) return;
    seiten++;

    const zeilen = [];

    for (const [code, menge] of ziele) {
      for (const ziel of menge) {
        const tatsaechlich = spracheAusPfad(ziel);
        if (tatsaechlich !== code) {
          zeilen.push(`Knopf "${code}" führt nach "${tatsaechlich}": ${ziel}`);
        }
      }
    }

    /* Alle Ziele über alle Sprachen zusammen – doppelte fallen so auf. */
    const alle = [...ziele.values()].flatMap((m) => [...m]);
    if (new Set(alle).size < ziele.size) {
      zeilen.push(`nur ${new Set(alle).size} verschiedene Ziele für ${ziele.size} Sprachen`);
    }

    if (zeilen.length) {
      befunde.push({ datei: path.relative(verzeichnis, datei), zeilen });
    }
  }

  await durchlaufen(verzeichnis);
  return { seiten, befunde };
}

/**
 * Vergleicht Auszeichnung und Platzhalter zwischen Quelle und Übersetzung.
 *
 * Gezählt wird, nicht verglichen: Die Reihenfolge darf sich ändern – im
 * Englischen steht der fette Einstieg manchmal woanders –, die Menge nicht.
 * Aus <strong>…</strong> darf kein <em> werden und aus zwei <code> kein
 * einziges.
 */
function bausteinePruefen() {
  const befunde = [];

  const zaehlen = (text) => {
    const stand = new Map();
    for (const [, name] of text.matchAll(/<\/?([a-z]+)[^>]*>/gi)) {
      const k = `<${name.toLowerCase()}>`;
      stand.set(k, (stand.get(k) ?? 0) + 1);
    }
    for (const [, name] of text.matchAll(/\{([a-zA-Z]+)\}/g)) {
      const k = `{${name}}`;
      stand.set(k, (stand.get(k) ?? 0) + 1);
    }
    return stand;
  };

  for (const sprache of SPRACHEN) {
    if (sprache.code === QUELLSPRACHE) continue;
    const katalog = kataloge[sprache.code];
    if (!katalog) continue;

    for (const [schluessel, deutsch] of Object.entries(quelle)) {
      const eintrag = katalog.eintraege?.[schluessel];
      if (!eintrag) continue;

      const soll = zaehlen(deutsch);
      if (soll.size === 0) continue;
      const ist = zaehlen(eintrag.text);

      for (const [baustein, anzahl] of soll) {
        const da = ist.get(baustein) ?? 0;
        if (da !== anzahl) {
          befunde.push(`${sprache.code} ${schluessel}: ${baustein} ${anzahl}× erwartet, ${da}× da`);
        }
      }
    }
  }

  return befunde;
}
