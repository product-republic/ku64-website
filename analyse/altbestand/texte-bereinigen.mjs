/**
 * Die geholten Texte von Vorlagenresten befreien – ohne erneuten Abruf.
 *
 * ── Warum ein zweiter Schritt und nicht im Holer ─────────────────────────
 *
 * `texte-holen.mjs` fragt die laufende Website der Praxis 340-mal ab. Jede
 * Verbesserung der Bereinigung dort hieße: noch einmal 340 Abrufe, um an
 * einer Regel zu feilen. Die Rohdaten liegen vor, also wird auf ihnen
 * gearbeitet. Der Holer bleibt unverändert, dieses Skript ist beliebig oft
 * wiederholbar, und der fremde Server wird kein zweites Mal belastet.
 *
 * ── Was entfernt wird und warum genau das ───────────────────────────────
 *
 * Die Häufigkeitsregel im Holer (ab der Hälfte aller Seiten) hat NICHTS
 * gefunden, und das war kein Fehler, sondern eine zu hohe Schwelle: Die
 * Standortblöcke stehen auf 94 von 340 Seiten, also auf 28 Prozent.
 *
 * Die Schwelle einfach auf 20 Prozent zu senken wäre falsch. Dann fielen
 * auch „Das Wichtigste auf einen Blick" (27 Seiten) und
 * „Inhaltsverzeichnis" (24 Seiten) heraus – das sind echte Überschriften
 * der Seiten, keine Vorlage. Häufigkeit allein unterscheidet Vorlage nicht
 * von wiederkehrender Struktur.
 *
 * Deshalb benannte Regeln, jede mit ihrem Grund:
 *
 *   1. Einbettungs-Platzhalter. „Sie sehen gerade einen Platzhalterinhalt
 *      von YouTube…" ist der Text des Cookie-Hinweises der alten Website,
 *      nicht ihr Inhalt. 35 Vorkommen, deutsch und englisch.
 *
 *   2. Standort- und Telefonblöcke. Anschrift und Rufnummer der fünf
 *      Standorte stehen im Fuß innerhalb von `main`. Im Neubau stehen sie
 *      in `standorte.ts` und werden dort gesetzt – als Text übernommen
 *      wären es fünf Adressen zweimal auf jeder Seite.
 *
 *   3. Reine Verweistexte auf den Shop und die Terminbuchung.
 *
 *   4. Klammerzeilen. „[ Die künstlichen Zahnwurzeln… ]" ist eine
 *      Bildunterschrift ohne Bild – im Rohtext eine Zeile in eckigen
 *      Klammern.
 *
 * ── Versalien ───────────────────────────────────────────────────────────
 *
 * Der Holer hat 4.668 von 4.697 Überschriften in normale Schreibung
 * gebracht. Die 29, die übrig sind, hat seine Regel verfehlt, weil sie
 * gemischt geschrieben sind: „ZahnImplantate Berlin – NEUE WURZELN FÜR
 * KRAFTVOLLE ZÄHNE". Der Anteil an Großbuchstaben liegt dort unter 90
 * Prozent, obwohl der halbe Satz schreit.
 *
 * Hier wird deshalb je WORT entschieden statt je Überschrift: Ein Wort aus
 * mindestens vier Großbuchstaben, das keine bekannte Abkürzung ist, wird
 * klein geschrieben – der erste Buchstabe bleibt groß, weil im Deutschen
 * jedes Substantiv groß ist und ein falsches Kleinwort sichtbar bleibt,
 * während eine falsche Großschreibung wie Absicht aussieht.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   node analyse/altbestand/texte-bereinigen.mjs
 *
 * Ergebnis: analyse/altbestand/texte.json
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const WURZEL = path.resolve(import.meta.dirname, '..', '..');
const QUELLE = path.join(WURZEL, 'analyse', 'altbestand', 'texte-roh.json');
const ZIEL = path.join(WURZEL, 'analyse', 'altbestand', 'texte.json');

const roh = JSON.parse(await readFile(QUELLE, 'utf8'));

/* ── 1. Regeln, was kein Inhalt ist ──────────────────────────────────── */

const WEG = [
  [
    'Einbettungs-Platzhalter',
    /^(Sie sehen gerade einen Platzhalterinhalt|You are currently viewing a placeholder|Um auf den eigentlichen Inhalt zuzugreifen|To access the actual content)/i,
  ],
  [
    'Standortblock',
    /^(KU64 (Potsdam|Berlin-Mitte|Berlin-ku|Wilmersdorf|Berlin Charlottenburg)|Kurfürstendamm 64 |Berliner Str\. 139|Hausvogteiplatz 14|Gasteiner Str)/i,
  ],
  ['Reine Telefonzeile', /^0\d[\d\s/-]{6,}$/],
  ['Shop- und Terminverweis', /^(Prophylaxe-Shop|Online-Termin|Termin vereinbaren|Jetzt Termin|Zum Shop)$/i],
  ['Klammerzeile ohne Bild', /^\[.*\]$/],
  /* „Schon gelesen?" ist die Überschrift über einer Liste verwandter
     Beiträge. Die Liste selbst entsteht im Neubau aus `related` – der
     alte Text daneben wäre eine zweite, veraltete Liste. */
  ['Verwandte-Beiträge-Kasten', /^(Schon gelesen\?|Ähnliche Beiträge|Das könnte Sie auch interessieren)$/i],
];

/* ── 2. Versalien je Wort ────────────────────────────────────────────── */

const ABKUERZUNGEN = new Set([
  'KU64', 'MKG', 'CMD', 'PZR', 'DVT', 'GKV', 'PKV', 'BFS', 'HWG', 'DGI',
  'DGÄZ', 'DGZMK', 'CAD', 'CAM', 'LED', 'PRF', 'PRGF', 'ICP', 'FAQ', 'FAQS',
  'AGB', 'DSGVO', 'GOZ', 'BEMA', 'KFO', 'CEREC', 'ZOOM', 'ICON', 'MIH',
  'GDPR', 'DGET', 'DGZH', 'BWB', 'HONC', 'ISO', 'GZFA', 'ANUG', 'GRAFT', 'BAMS',
]);

/**
 * Steht ein Block fast ganz in Versalien?
 *
 * Gebraucht, weil nicht nur Überschriften geschrien haben. Auf
 * `/ueber-uns/kooperationspartner/` steht der erste Absatz komplett in
 * Großbuchstaben – „ZUR PHILOSOPHIE VON KU64 GEHÖRT ES, ZAHNÄRZTLICHE
 * SPEZIALISTEN UNTER EINEM DACH ZU VEREINEN…". Achtzehn solche Absätze gibt
 * es im Altbestand.
 *
 * Die Schwelle liegt bei 80 Prozent der Buchstaben und mindestens zwanzig
 * Buchstaben. Ein normaler Absatz kommt dort nie hin: Selbst ein Satz voller
 * Eigennamen und Abkürzungen bleibt weit darunter. Ein einzelnes Wort in
 * Versalien wird nicht angefasst – das ist Betonung, kein Fehler.
 */
function schreit(text) {
  const buchstaben = text.replace(/[^A-Za-zÄÖÜäöüß]/g, '');
  if (buchstaben.length < 20) return false;
  const gross = (text.match(/[A-ZÄÖÜ]/g) ?? []).length;
  return gross / buchstaben.length > 0.8;
}

function wortWeise(text) {
  return text
    .split(/(\s+|–|—|\/)/)
    .map((teil) => {
      if (/^(\s+|–|—|\/)$/.test(teil)) return teil;
      const kern = teil.replace(/[^A-Za-zÄÖÜäöüß0-9]/g, '');
      if (kern.length < 4) return teil;
      if (ABKUERZUNGEN.has(kern.toUpperCase())) return teil;
      /* Nur eingreifen, wenn das Wort KEINEN Kleinbuchstaben hat. */
      if (/[a-zäöüß]/.test(kern)) return teil;
      if (!/[A-ZÄÖÜ]{4,}/.test(kern)) return teil;
      /* Erster Buchstabe groß, Rest klein – siehe Kopfkommentar. */
      return teil.replace(/[A-ZÄÖÜ][A-ZÄÖÜ]+/g, (w) => w.charAt(0) + w.slice(1).toLowerCase());
    })
    .join('');
}

/* ── 2b. Leerzeichen, die aus dem Abbau der Auszeichnung stammen ─────── */

/*
 * `texte-holen.mjs` ersetzt jedes Tag durch ein Leerzeichen:
 *
 *     roh.replace(/<[^>]+>/g, ' ')
 *
 * Das ist die richtige Entscheidung – ohne sie klebten Wörter aneinander,
 * die auf der Seite durch einen Zeilenumbruch getrennt waren („Kronen<br>
 * Brücken" → „KronenBrücken"). Sie hat aber eine Nebenwirkung, und zwar
 * eine, die 2.150-mal vorkommt: Ein Link am Satzende wird zu
 *
 *     <a>Zahnersatz</a>,   →   „Zahnersatz ,"
 *
 * Auf ku64.de steht dort korrekt „Zahnersatz,". Der Fehler ist also NICHT
 * der der Praxis, sondern unserer – und er wäre auf 202 Seiten des Neubaus
 * gelandet, in Text, den niemand mehr Wort für Wort liest, weil er ja
 * „wortgleich übernommen" ist.
 *
 * Deshalb hier und nicht im Holer: Der Holer darf nicht klüger werden, sonst
 * müssten für jede Regelverbesserung 340 Seiten neu abgerufen werden.
 *
 * ── Was bewusst NICHT angefasst wird ────────────────────────────────────
 *
 *   „50 %"   Das Leerzeichen vor dem Prozentzeichen ist im Deutschen richtig
 *            (DIN 5008). 13 Vorkommen, alle korrekt.
 *   „… "     Das Leerzeichen vor der Auslassung steht in Zitaten aus der
 *            Presse („(…)") und in vier unausgefüllten Platzhaltern auf
 *            /ueber-uns/. Die vier sind ein echter Fehler der heutigen
 *            Seite – sie werden einzeln und begründet in
 *            `scripts/langtexte-bauen.mjs` behandelt, nicht pauschal hier.
 */
const TYPOGRAFIE = [
  /*
   * Unsichtbare Zeichen zuerst – sonst steht ein Nullbreiten-Leerzeichen
   * zwischen Wort und Komma und die Regel darunter greift nicht.
   *
   * Entfernt werden U+200B/C/D und U+FEFF: Reste aus dem Redaktionssystem,
   * 79 Stück auf 48 Seiten. Der Überschrift „…in Potsdam" hängt eines an,
   * und niemand sieht es – bis es in einer Adresse oder einem Vergleich
   * landet.
   *
   * NICHT entfernt wird das weiche Trennzeichen U+00AD. Es steht in Wörtern
   * wie „Kiefer­orthopädie" und ist dort Absicht: Es sagt dem Browser, wo er
   * trennen darf. Genau daran fehlt es an anderer Stelle – siehe die
   * Silbentrennung im Mega-Menü.
   */
  ['Unsichtbares Zeichen', /[\u200B-\u200D\uFEFF]/g, ''],
  ['Leerzeichen vor Satzzeichen', /\s+([,.;:!?])/g, '$1'],
  ['Leerzeichen nach öffnender Klammer', /\(\s+/g, '('],
  ['Leerzeichen vor schließender Klammer', /\s+\)/g, ')'],
  ['Leerzeichen nach öffnendem Anführungszeichen', /„\s+/g, '„'],
  ['Leerzeichen vor schließendem Anführungszeichen', /\s+“/g, '“'],
  /* Ein öffnendes Anführungszeichen am Wortende ist ein schließendes –
     ein Tippfehler der alten Seite, zweimal: „…Ceramics„". */
  ['Anführungszeichen falsch herum', /(\S)„(\s|$)/g, '$1“$2'],
];

function typografie(text) {
  let aus = text;
  for (const [, muster, ersatz] of TYPOGRAFIE) aus = aus.replace(muster, ersatz);
  return aus;
}

/* ── 3. Lauf ─────────────────────────────────────────────────────────── */

const zaehler = new Map();
const typoZaehler = new Map();
const merken = (grund) => zaehler.set(grund, (zaehler.get(grund) ?? 0) + 1);

let entschrien = 0;
let geglaettet = 0;
const geschrien = [];

for (const e of roh.eintraege) {
  e.bloecke = e.bloecke.filter((b) => {
    for (const [grund, muster] of WEG) {
      if (muster.test(b.text)) {
        merken(grund);
        return false;
      }
    }
    return true;
  });

  for (const b of e.bloecke) {
    const glatt = typografie(b.text);
    if (glatt !== b.text) {
      for (const [grund, muster] of TYPOGRAFIE) {
        const treffer = b.text.match(muster);
        if (treffer) {
          typoZaehler.set(grund, (typoZaehler.get(grund) ?? 0) + treffer.length);
          geglaettet += treffer.length;
        }
      }
      b.text = glatt;
    }
    /*
     * Absätze in Versalien werden hier NICHT umgeschrieben – sie werden
     * gezählt und unten gemeldet.
     *
     * `wortWeise` arbeitet je Wort und lässt „ZUR", „UND", „ZU" stehen, weil
     * sie kürzer als vier Buchstaben sind. Aus einem geschrienen Satz würde
     * damit ein halb geschriener: „ZUR Philosophie VON KU64 Gehört ES…".
     * Ein ganzer Satz braucht deutsche Substantivgroßschreibung, und die
     * kann eine Regel nicht raten.
     *
     * Wo so ein Absatz auf einer Seite steht, die der Neubau übernimmt, wird
     * er einzeln und begründet in `scripts/langtexte-bauen.mjs` gesetzt.
     */
    if (schreit(b.text) && !b.art.startsWith('h')) geschrien.push(`${e.pfad}: ${b.text.slice(0, 70)}`);
    if (!b.art.startsWith('h')) continue;
    const neu = wortWeise(b.text);
    if (neu !== b.text) {
      b.text = neu;
      entschrien++;
    }
  }
  if (e.h1) {
    const glatt = typografie(e.h1);
    if (glatt !== e.h1) e.h1 = glatt;
    const neu = wortWeise(e.h1);
    if (neu !== e.h1) {
      e.h1 = neu;
      entschrien++;
    }
  }

  e.woerter = e.bloecke.reduce((s, b) => s + b.text.split(/\s+/).filter(Boolean).length, 0);
}

/* ── 4. Was bleibt zu prüfen ─────────────────────────────────────────── */

const alle = roh.eintraege.filter((e) => e.status === 200);

/* Blöcke, die noch auf vielen Seiten stehen – zur Sicht, nicht entfernt.
   Wer eine neue Vorlagenquelle findet, trägt sie oben als Regel ein; eine
   stillschweigende Häufigkeitsschwelle würde echte Überschriften treffen. */
const haeufig = new Map();
for (const e of alle) {
  for (const t of new Set(e.bloecke.map((b) => b.text))) haeufig.set(t, (haeufig.get(t) ?? 0) + 1);
}
const verdacht = [...haeufig.entries()]
  .filter(([t, n]) => n >= alle.length * 0.15 && t.split(/\s+/).length > 6)
  .sort((a, z) => z[1] - a[1]);

const woerterGesamt = alle.reduce((s, e) => s + e.woerter, 0);

await writeFile(
  ZIEL,
  JSON.stringify(
    {
      ...roh,
      bereinigtAm: new Date().toISOString(),
      hinweis:
        roh.hinweis +
        ' Danach bereinigt (texte-bereinigen.mjs): Einbettungs-Platzhalter, Standort- und ' +
        'Telefonblöcke, Shop- und Terminverweise, Klammerzeilen und der Kasten mit ' +
        'verwandten Beiträgen entfernt; Versalien je Wort in normale Schreibung gebracht; ' +
        'Leerzeichen geglättet, die beim Abbau der Auszeichnung vor Satzzeichen, in ' +
        'Klammern und in Anführungszeichen entstanden waren. ' +
        'Die deutsche Großschreibung der Substantive muss beim Gegenlesen nachgezogen werden.',
      woerterGesamt,
    },
    null,
    1,
  ),
);

console.log(`[bereinigen] ${alle.length} Seiten, ${woerterGesamt.toLocaleString('de-DE')} Wörter`);
console.log(`[bereinigen] ${entschrien} Überschriften aus Versalien geholt`);
console.log('[bereinigen] entfernt:');
for (const [grund, n] of [...zaehler.entries()].sort((a, z) => z[1] - a[1])) {
  console.log(`               ${String(n).padStart(5)} ${grund}`);
}

if (geschrien.length) {
  console.log(`\n[bereinigen] ${geschrien.length} Absatz/Absätze stehen ganz in Versalien – nicht angefasst:`);
  for (const g of geschrien) console.log(`               ${g}`);
}

console.log(`[bereinigen] ${geglaettet} Leerzeichen geglättet, die beim Abbau der Auszeichnung entstanden:`);
for (const [grund, n] of [...typoZaehler.entries()].sort((a, z) => z[1] - a[1])) {
  console.log(`               ${String(n).padStart(5)} ${grund}`);
}

if (verdacht.length) {
  console.log('\n[bereinigen] Noch häufig und lang – bitte ansehen, ob Vorlage:');
  for (const [t, n] of verdacht.slice(0, 8)) console.log(`               ${n}× ${t.slice(0, 90)}`);
} else {
  console.log('\n[bereinigen] Kein weiterer Vorlagenverdacht.');
}

console.log(`             → ${path.relative(WURZEL, ZIEL)}`);
