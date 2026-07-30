/**
 * Die Originaltexte von ku64.de holen – vollständig, mit Struktur.
 *
 * ── Warum es dieses Skript gibt ─────────────────────────────────────────
 *
 * `crawl.mjs` hat erhoben, WELCHE Seiten es gibt: Pfad, Status, Titel,
 * noindex. Den Inhalt hat es nicht mitgenommen. `erheben.mjs` hat Wörter
 * GEZÄHLT, aber nicht behalten. Damit stand die Zahl fest – 170.785 Wörter
 * auf den Behandlungsseiten – und der Text selbst lag nirgends.
 *
 * Genau der ist aber die Substanz, um die es geht. Dieses Skript holt ihn.
 *
 * ── Was gespeichert wird ────────────────────────────────────────────────
 *
 * Je Seite eine Folge von Blöcken in Dokumentreihenfolge:
 *
 *   { art: 'h2' | 'h3' | 'h4' | 'p' | 'li' | 'zeile', text: '…' }
 *
 * Keine HTML-Fetzen, keine Klassen, keine Verschachtelung. Der Grund ist
 * die Zielform: Der Inhalt wird in TypeScript-Daten überführt und dort von
 * Astro-Bausteinen gesetzt. Wer HTML aus einer fremden Website in seine
 * eigene Seite durchreicht, übernimmt deren Auszeichnung, deren Klassen und
 * im schlechtesten Fall deren Skripte – und hat eine Sicherheitslücke, wo
 * er einen Text wollte.
 *
 * Listenpunkte bleiben als `li` erkennbar, weil eine Aufzählung, die zu
 * Absätzen zerfällt, ihre Aussage verliert.
 *
 * ── Was NICHT mitgenommen wird ──────────────────────────────────────────
 *
 * Alles außerhalb von `<main id="content">`: Kopf, Menü, Fußzeile,
 * Cookie-Hinweis. Und innerhalb davon `script`, `style`, `noscript`, `form`,
 * `nav`, `svg`, `iframe` samt Inhalt.
 *
 * Zusätzlich fliegen Blöcke heraus, die auf JEDER Seite gleich sind. Die
 * alte Website trägt in `main` einen Terminblock, einen Standortkasten und
 * einen Newsletter-Aufruf – zusammen rund 300 Wörter, auf 341 Seiten. Wer
 * die mitnimmt, „stellt Inhalt wieder her", der in Wahrheit die Vorlage
 * ist, und bläst jede Seite um denselben Text auf. Erkannt werden sie nicht
 * über eine Liste, sondern über die Häufigkeit: Ein Textblock, der auf mehr
 * als der Hälfte aller Seiten wortgleich steht, ist Vorlage.
 *
 * ── Rücksicht auf den fremden Server ────────────────────────────────────
 *
 * Das ist die laufende Website der Praxis. Sechs Abrufe gleichzeitig, eine
 * kurze Pause zwischen den Wellen, ein sprechender User-Agent. Bei 429 oder
 * 5xx wird mit wachsendem Abstand erneut versucht, dreimal.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   node analyse/altbestand/texte-holen.mjs
 *   node analyse/altbestand/texte-holen.mjs --nur /leistungen/
 *
 * Ergebnis: analyse/altbestand/texte-roh.json
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const WURZEL = path.resolve(import.meta.dirname, '..', '..');
const BASIS = 'https://ku64.de';
const ZIEL = path.join(WURZEL, 'analyse', 'altbestand', 'texte-roh.json');

const GLEICHZEITIG = 6;
const PAUSE_MS = 250;
const VERSUCHE = 3;

const nurArg = process.argv.indexOf('--nur');
const NUR = nurArg > -1 ? process.argv[nurArg + 1] : null;

/* ── Welche Seiten ───────────────────────────────────────────────────── */

const crawl = JSON.parse(
  await readFile(path.join(WURZEL, 'analyse', 'altbestand', 'crawl-roh.json'), 'utf8'),
);

let pfade = crawl.seiten.filter((s) => s.status === 200).map((s) => s.pfad);
if (NUR) pfade = pfade.filter((p) => p.startsWith(NUR));

console.log(`[texte] ${pfade.length} Seiten abzurufen${NUR ? ` (nur ${NUR})` : ''}`);

/* ── Holen ───────────────────────────────────────────────────────────── */

const warte = (ms) => new Promise((f) => setTimeout(f, ms));

async function holen(pfad) {
  for (let versuch = 1; versuch <= VERSUCHE; versuch++) {
    try {
      const antwort = await fetch(BASIS + pfad, {
        headers: {
          /* Sprechend, nicht getarnt: Wer im Log der Praxis nachsieht, soll
             erkennen können, wer das war und warum. */
          'user-agent': 'KU64-Relaunch/1.0 (Inhaltsübernahme für den Neubau derselben Website)',
          accept: 'text/html',
        },
        signal: AbortSignal.timeout(45_000),
      });

      if (antwort.status === 429 || antwort.status >= 500) {
        throw new Error(`HTTP ${antwort.status}`);
      }
      if (!antwort.ok) return { pfad, status: antwort.status, bloecke: [] };

      return { pfad, status: antwort.status, html: await antwort.text() };
    } catch (fehler) {
      if (versuch === VERSUCHE) return { pfad, status: 0, fehler: String(fehler.message ?? fehler), bloecke: [] };
      await warte(1000 * 2 ** versuch);
    }
  }
}

/* ── Auslesen ────────────────────────────────────────────────────────── */

/** HTML-Entitäten, die in diesem Bestand wirklich vorkommen. */
const ENTITAETEN = {
  nbsp: ' ',
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  shy: '',
  '#8211': '–',
  '#8212': '—',
  '#8217': '’',
  '#8216': '‘',
  '#8220': '„',
  '#8221': '"',
  '#8230': '…',
  '#160': ' ',
  '#039': "'",
  '#8203': '',
};

function entschluesseln(s) {
  return s.replace(/&(#?\w+);/g, (ganz, name) => {
    if (name in ENTITAETEN) return ENTITAETEN[name];
    /* Numerisch, aber nicht in der Liste: rechnen statt raten. */
    if (/^#\d+$/.test(name)) return String.fromCodePoint(Number(name.slice(1)));
    if (/^#x[0-9a-f]+$/i.test(name)) return String.fromCodePoint(parseInt(name.slice(2), 16));
    return ganz;
  });
}

function saeubern(roh) {
  return entschluesseln(roh.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Überschriften der alten Website stehen in Großbuchstaben – nicht per CSS,
 * sondern als Text: „ZAHNIMPLANTAT-KOSTEN: WAS KOSTET EIN ZAHNIMPLANTAT?".
 *
 * Übernommen wäre das im Neubau ein Schreifehler auf jeder Seite. Also
 * zurück in normale Schreibung, und zwar nur, wenn der Text tatsächlich
 * durchgehend groß ist – ein „MKG-Chirurgie" mitten im Satz bleibt.
 *
 * Deutsche Substantive lassen sich nicht rechnen. Deshalb wird der erste
 * Buchstabe jedes Wortes NICHT geraten: Groß bleibt nur der Satzanfang und
 * was als Abkürzung erkennbar ist. Den Rest korrigiert ein Mensch beim
 * Gegenlesen – falsche Kleinschreibung ist sichtbar, falsche
 * Großschreibung sieht nach Absicht aus.
 */
const ABKUERZUNGEN = new Set([
  'KU64', 'MKG', 'CMD', 'PZR', 'DVT', 'OP', 'ZE', 'GKV', 'PKV', 'BFS', 'HWG',
  'DGI', 'DGÄZ', 'DGZMK', 'CAD', 'CAM', 'LED', 'PRF', 'PRGF', 'ICP', 'FAQ',
  '3D', 'AGB', 'DSGVO', 'EU', 'GOZ', 'BEMA', 'KFO',
]);

function entschreien(text) {
  const buchstaben = text.replace(/[^A-Za-zÄÖÜäöüß]/g, '');
  if (buchstaben.length < 4) return text;
  /* Nur eingreifen, wenn praktisch alles groß ist. */
  const grossAnteil = (text.match(/[A-ZÄÖÜ]/g) ?? []).length / buchstaben.length;
  if (grossAnteil < 0.9) return text;

  const woerter = text.split(/(\s+)/).map((w) => {
    if (/^\s+$/.test(w)) return w;
    const kern = w.replace(/[^A-Za-zÄÖÜäöüß0-9]/g, '');
    if (ABKUERZUNGEN.has(kern.toUpperCase())) return w;
    /* Kurze reine Großbuchstabenfolgen sind eher Abkürzung als Wort. */
    if (kern.length <= 3 && /^[A-ZÄÖÜ0-9]+$/.test(kern)) return w;
    return w.charAt(0) + w.slice(1).toLowerCase();
  });

  const satz = woerter.join('');
  return satz.charAt(0).toUpperCase() + satz.slice(1);
}

function bloeckeAus(html) {
  const anfang = html.search(/<main\b/i);
  const ende = html.search(/<\/main>/i);
  if (anfang < 0 || ende < 0) return [];

  let m = html.slice(anfang, ende);

  /* Was kein Inhalt ist, samt Inhalt entfernen – vor dem Auslesen, sonst
     landet der Text eines Formulars als Absatz im Bestand. */
  m = m.replace(/<(script|style|noscript|form|nav|svg|iframe|button|select)\b[\s\S]*?<\/\1>/gi, '');

  const bloecke = [];
  for (const t of m.matchAll(/<(h1|h2|h3|h4|p|li|dt|dd|td|th)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const artRoh = t[1].toLowerCase();
    /* Verschachtelte Treffer: Ein `li` mit einem `p` darin ergibt zwei
       Blöcke mit demselben Text. Der äußere wird später über die
       Dublettenprüfung verworfen. */
    const text = saeubern(t[2]);
    if (text.length < 3) continue;

    const art = ['h1', 'h2', 'h3', 'h4'].includes(artRoh)
      ? artRoh
      : artRoh === 'li' || artRoh === 'dt' || artRoh === 'dd'
        ? 'li'
        : artRoh === 'td' || artRoh === 'th'
          ? 'zeile'
          : 'p';

    bloecke.push({ art, text: art.startsWith('h') ? entschreien(text) : text });
  }

  /* Unmittelbare Wiederholung desselben Textes: der äußere Container. */
  return bloecke.filter((b, i) => {
    for (let k = Math.max(0, i - 3); k < i; k++) {
      if (bloecke[k].text === b.text) return false;
    }
    return true;
  });
}

/* ── Lauf ────────────────────────────────────────────────────────────── */

const ergebnisse = [];
let fertig = 0;

for (let i = 0; i < pfade.length; i += GLEICHZEITIG) {
  const welle = pfade.slice(i, i + GLEICHZEITIG);
  const antworten = await Promise.all(welle.map(holen));

  for (const a of antworten) {
    const bloecke = a.html ? bloeckeAus(a.html) : [];
    const h1 = bloecke.find((b) => b.art === 'h1')?.text ?? '';
    ergebnisse.push({
      pfad: a.pfad,
      status: a.status,
      fehler: a.fehler,
      h1,
      bloecke: bloecke.filter((b) => b.art !== 'h1'),
    });
  }

  fertig += welle.length;
  if (fertig % 30 < GLEICHZEITIG) console.log(`[texte] ${fertig}/${pfade.length}`);
  await warte(PAUSE_MS);
}

/* ── Vorlagenblöcke erkennen und entfernen ───────────────────────────── */

const haeufigkeit = new Map();
for (const e of ergebnisse) {
  for (const b of new Set(e.bloecke.map((x) => x.text))) {
    haeufigkeit.set(b, (haeufigkeit.get(b) ?? 0) + 1);
  }
}

const schwelle = Math.max(3, Math.floor(ergebnisse.length * 0.5));
const vorlage = new Set([...haeufigkeit.entries()].filter(([, n]) => n >= schwelle).map(([t]) => t));

let entfernt = 0;
for (const e of ergebnisse) {
  const vorher = e.bloecke.length;
  e.bloecke = e.bloecke.filter((b) => !vorlage.has(b.text));
  entfernt += vorher - e.bloecke.length;
}

/* ── Ausgabe ─────────────────────────────────────────────────────────── */

const woerter = (bl) => bl.reduce((s, b) => s + b.text.split(/\s+/).filter(Boolean).length, 0);

for (const e of ergebnisse) e.woerter = woerter(e.bloecke);

const gut = ergebnisse.filter((e) => e.status === 200);
const kaputt = ergebnisse.filter((e) => e.status !== 200);

await writeFile(
  ZIEL,
  JSON.stringify(
    {
      erhobenAm: new Date().toISOString(),
      basis: BASIS,
      hinweis:
        'Hauptinhalt aus <main id="content">. Vorlagenblöcke (auf mindestens der Hälfte ' +
        'aller Seiten wortgleich) sind entfernt – sie sind Vorlage, nicht Inhalt. ' +
        'Überschriften wurden aus Versalien in normale Schreibung gebracht; die deutsche ' +
        'Großschreibung der Substantive muss ein Mensch nachziehen.',
      seiten: gut.length,
      woerterGesamt: gut.reduce((s, e) => s + e.woerter, 0),
      vorlagenbloecke: vorlage.size,
      eintraege: ergebnisse,
    },
    null,
    1,
  ),
);

const jeBereich = new Map();
for (const e of gut) {
  const k = e.pfad.split('/').filter(Boolean)[0] ?? '(wurzel)';
  jeBereich.set(k, (jeBereich.get(k) ?? 0) + e.woerter);
}

console.log(
  `\n[texte] ${gut.length} Seiten mit Inhalt, ${kaputt.length} ohne\n` +
    `        ${gut.reduce((s, e) => s + e.woerter, 0).toLocaleString('de-DE')} Wörter gesamt\n` +
    `        ${vorlage.size} Vorlagenblöcke erkannt, ${entfernt} Vorkommen entfernt\n` +
    `        → ${path.relative(WURZEL, ZIEL)}`,
);

console.log('\n        Wörter je Bereich:');
for (const [k, n] of [...jeBereich.entries()].sort((a, z) => z[1] - a[1])) {
  console.log(`          ${k.padEnd(22)} ${n.toLocaleString('de-DE').padStart(9)}`);
}

if (kaputt.length) {
  console.log('\n        Ohne Inhalt:');
  for (const e of kaputt.slice(0, 12)) console.log(`          ${e.status} ${e.pfad} ${e.fehler ?? ''}`);
}
