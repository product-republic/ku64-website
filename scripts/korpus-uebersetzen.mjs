/**
 * Den wiederhergestellten Originaltext nach Englisch und Französisch
 * übersetzen – ein Thema je Auftrag.
 *
 * ── Warum dieses Skript getrennt von `sprachen-sync.mjs` steht ──────────
 *
 * `sprachen-sync.mjs` übersetzt den KATALOG: 7.633 kurze Textbausteine,
 * jeder für sich, jeder mit Fingerabdruck. Das Verfahren ist richtig für
 * Schaltflächen, Überschriften und FAQ-Antworten.
 *
 * Der Korpus ist etwas anderes. Er besteht aus 60 Themen zu je 100 bis 2.700
 * Wörtern, und seine Struktur trägt Bedeutung: Abschnitte, Blöcke, Listen.
 * Zerlegte man ihn in Bausteine, übersetzte man 4.000 Absätze ohne
 * Zusammenhang – und die Fachbegriffe liefen innerhalb desselben Textes
 * auseinander, weil kein Auftrag den anderen kennt.
 *
 * Deshalb: EIN Thema, EIN Auftrag, EINE Antwort. Das Modell sieht den ganzen
 * Text und hält die Begriffe durch.
 *
 * ── Warum die Struktur unangetastet bleiben MUSS ────────────────────────
 *
 * `korpus-einspielen.mjs` lehnt jede Übersetzung ab, deren Struktur vom
 * Original abweicht – gleiche Zahl Abschnitte, gleiche Zahl Blöcke, gleiche
 * `art` je Block, gleiche `stufe`. Das ist kein Formalismus: Fehlt ein
 * Abschnitt, baut die Seite weiter und ist nur kürzer. Genau dieser stille
 * Verlust ist der Fehler, gegen den das halbe Projekt gebaut ist.
 *
 * Das Modell bekommt die Struktur deshalb als Gerüst vorgegeben und füllt
 * nur die Texte. Was trotzdem abweicht, fällt beim Einspielen durch und wird
 * namentlich gemeldet.
 *
 * ── Warum je Thema eine Datei ───────────────────────────────────────────
 *
 * Damit ein misslungener Auftrag nicht den ganzen Lauf kostet. Vorhandene
 * Dateien werden übersprungen – der Lauf ist beliebig oft wiederholbar und
 * arbeitet sich weiter vor. Bei 60 Themen × 2 Sprachen ist das der
 * Unterschied zwischen „noch einmal von vorn" und „die fehlenden vier".
 *
 * ── Was NICHT übersetzt wird ────────────────────────────────────────────
 *
 * Eigennamen (KU64, GRAFT, Invisalign, CEREC, Palais Ritz), Anschriften,
 * Rufnummern und die Namen der Fachgesellschaften. Sie stehen im Auftrag
 * ausdrücklich als unveränderlich.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   ANTHROPIC_API_KEY=… node scripts/korpus-uebersetzen.mjs [ziel]
 *   node scripts/korpus-uebersetzen.mjs --trocken     (zeigt nur den Umfang)
 *   node scripts/korpus-uebersetzen.mjs --probe       (zeigt einen Auftrag)
 *   … --sprache=en        nur eine Sprache
 *   … --hoechstens=4      höchstens vier neue Übersetzungen in diesem Lauf
 *
 * `--hoechstens` zählt ABRUFE, nicht Themen: Es ist die Größe, die Geld
 * kostet. Gedacht für den ersten Lauf – vier Abrufe beweisen, dass der
 * Schlüssel da ist und die Form stimmt, und kosten dabei fast nichts.
 *
 * Ergebnis: <ziel>/arbeit.json, <ziel>/en/<i>.json, <ziel>/fr/<i>.json
 * Danach:   node scripts/korpus-einspielen.mjs <ziel>
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import Anthropic from '@anthropic-ai/sdk';

const WURZEL = path.resolve(import.meta.dirname, '..');
const TROCKEN = process.argv.includes('--trocken');
const PROBE = process.argv.includes('--probe');
const schalter = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=')[1] || '';
const NUR_SPRACHE = schalter('sprache');
const HOECHSTENS = Number(schalter('hoechstens')) || Infinity;
/* `slice(2)`, nicht ein Filter über alle Argumente: argv[0] ist der Pfad zur
   Node-Binärdatei und argv[1] der zum Skript. Sie über ihren Inhalt
   auszuschließen ginge so lange gut, bis das Projekt in einem Verzeichnis
   liegt, in dessen Pfad „node" vorkommt. */
const ZIEL = process.argv.slice(2).find((a) => !a.startsWith('-')) ?? path.join(WURZEL, '.uebersetzung');

const SPRACHEN = {
  en: {
    name: 'britisches Englisch',
    hinweis:
      'Use British spelling (colour, centre, realise). Write for patients, not for dentists: ' +
      'keep the register plain and warm, exactly as the German does.',
  },
  fr: {
    name: 'Französisch',
    hinweis:
      'Vouvoiement. Typographie française : espace insécable avant : ; ! ? et guillemets « ». ' +
      'Registre destiné aux patients, pas aux confrères.',
  },
};

if (NUR_SPRACHE && !SPRACHEN[NUR_SPRACHE]) {
  console.error(`[korpus] ABBRUCH: "${NUR_SPRACHE}" ist keine Zielsprache. Möglich: ${Object.keys(SPRACHEN).join(', ')}`);
  process.exit(1);
}

/* Diese Bereiche des Korpus werden übersetzt. `themen` ist seit dem
   31.07.2026 dabei – die zehn Belegseiten unter /ueber-uns/. */
const BEREICHE = ['leistungen', 'unterthemen', 'kategorien', 'neu', 'themen'];

const deutsch = JSON.parse(
  await readFile(path.join(WURZEL, 'src', 'inhalte', 'langtexte.json'), 'utf8'),
);

/* ── Arbeitsliste aufstellen ─────────────────────────────────────────── */

const arbeit = [];
for (const bereich of BEREICHE) {
  for (const [schluessel, eintrag] of Object.entries(deutsch[bereich] ?? {})) {
    if (!eintrag?.abschnitte?.length) continue;
    arbeit.push({ bereich, schluessel, woerter: eintrag.woerter ?? 0 });
  }
}
arbeit.sort((a, z) => z.woerter - a.woerter);

const gesamt = arbeit.reduce((s, a) => s + a.woerter, 0);
console.log(
  `[korpus] ${arbeit.length} Themen, ${gesamt.toLocaleString('de-DE')} Wörter je Sprache – ` +
    `${(gesamt * 2).toLocaleString('de-DE')} insgesamt`,
);

if (TROCKEN) {
  for (const a of arbeit.slice(0, 12)) {
    console.log(`           ${String(a.woerter).padStart(5)} W  ${a.bereich}/${a.schluessel}`);
  }
  if (arbeit.length > 12) console.log(`           … und ${arbeit.length - 12} weitere`);
  console.log('\n[korpus] --trocken: nichts geschrieben, nichts abgerufen.');
  process.exit(0);
}

/*
 * ── `--probe`: den Auftrag ansehen, bevor er Geld kostet ────────────────
 *
 * Der erste Lauf hat vier Themen übersetzt und alle vier verloren, weil im
 * Auftrag „SCHLÜSSEL (unverändert zurückgeben): undefined" stand. Das Modell
 * hat zurückgegeben, was dastand. Nichts daran war ein Fehler im
 * herkömmlichen Sinn: kein Absturz, keine Ausnahme, vier vollständige
 * Übersetzungen – nur unbrauchbar.
 *
 * Der Auftrag ist die eine Stelle dieses Skripts, die niemand sieht. Deshalb
 * zwei Dinge, beide ohne einen einzigen Abruf:
 *
 *   1. ALLE Aufträge werden auf das Wort „undefined" geprüft. Jede
 *      Zeichenkette, die aus einem fehlenden Feld entsteht, endet so.
 *   2. Einer wird vollständig ausgegeben – zum Lesen.
 *
 * Punkt 1 läuft im Arbeitsablauf vor dem Übersetzen. Ein Auftrag mit einer
 * Lücke kostet damit nichts mehr.
 */
if (PROBE) {
  const kaputt = [];
  for (const a of arbeit) {
    for (const sprache of Object.keys(SPRACHEN)) {
      const text = auftrag(deutsch[a.bereich][a.schluessel], a.schluessel, sprache);
      /*
       * Gesucht wird `undefined`, `NaN` und `[object Object]` – die drei
       * Formen, in denen eine Lücke in einer Zeichenkette landet.
       *
       * NICHT `null`: Das steht im Gerüst mit Absicht („ueberschrift": null
       * beim Einleitungsabschnitt) und ist gültiger Inhalt. Die erste Fassung
       * dieser Prüfung suchte auch danach und meldete 166 von 166 Aufträgen –
       * eine Prüfung, die immer anschlägt, sagt so wenig wie eine, die nie
       * anschlägt.
       */
      if (/\bundefined\b|\bNaN\b|\[object Object\]/.test(text)) {
        kaputt.push(`${sprache} ${a.bereich}/${a.schluessel}`);
      }
    }
  }

  const erste = arbeit.find((a) => a.bereich === 'themen') ?? arbeit[0];
  console.log(
    `\n[korpus] Ein vollständiger Auftrag – ${erste.bereich}/${erste.schluessel}, en:\n` +
      '─'.repeat(72),
  );
  console.log(auftrag(deutsch[erste.bereich][erste.schluessel], erste.schluessel, 'en'));
  console.log('─'.repeat(72));

  if (kaputt.length) {
    console.error(
      `\n[korpus] ABBRUCH: ${kaputt.length} Auftrag/Aufträge enthalten „undefined" oder „null"\n` +
        '         im Anweisungsteil. Das ist ein fehlendes Feld, kein Text – das\n' +
        '         Modell würde das Wort übernehmen:\n',
    );
    for (const k of kaputt.slice(0, 10)) console.error(`           ${k}`);
    if (kaputt.length > 10) console.error(`           … und ${kaputt.length - 10} weitere`);
    process.exit(1);
  }

  console.log(
    `\n[korpus] ${arbeit.length * 2} Aufträge geprüft, keiner enthält eine Lücke.\n` +
      '[korpus] --probe: nichts geschrieben, nichts abgerufen.',
  );
  process.exit(0);
}

/* ── Schlüssel ───────────────────────────────────────────────────────── */

if (!process.env.ANTHROPIC_API_KEY) {
  console.error(
    '[korpus] ABBRUCH: ANTHROPIC_API_KEY ist nicht gesetzt.\n' +
      '\n' +
      '         Der Schlüssel gehört NICHT in eine .env, nicht ins Repository und\n' +
      '         nicht in das Feld für Umgebungsvariablen der Entwicklungsumgebung –\n' +
      '         dort steht ausdrücklich, dass die Werte für alle sichtbar sind.\n' +
      '\n' +
      '         Er gehört als GitHub-Actions-Secret hinterlegt; der Lauf findet dann\n' +
      '         in .github/workflows/korpus.yml statt („Korpus übersetzen" →\n' +
      '         Run workflow).\n' +
      '\n' +
      '         Ohne Schlüssel läuft nur „--trocken" – das zeigt den Umfang.',
  );
  process.exit(1);
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODELL = process.env.KORPUS_MODELL || 'claude-sonnet-5';

await mkdir(ZIEL, { recursive: true });
await writeFile(path.join(ZIEL, 'arbeit.json'), JSON.stringify(arbeit, null, 1));
for (const s of Object.keys(SPRACHEN)) await mkdir(path.join(ZIEL, s), { recursive: true });

/* ── Der Auftrag ─────────────────────────────────────────────────────── */

/**
 * Das Gerüst, das zurückkommen muss – ohne die deutschen Texte.
 *
 * Mitgeschickt, damit das Modell die Form nicht erfinden muss: Es sieht,
 * wie viele Abschnitte und Blöcke erwartet werden und welche `art` jeder
 * Block hat. Das ist der Unterschied zwischen „bitte behalte die Struktur"
 * und einer Struktur, die schon dasteht.
 */
function geruest(eintrag) {
  return eintrag.abschnitte.map((a) => ({
    ueberschrift: a.ueberschrift === null ? null : '…',
    stufe: a.stufe,
    bloecke: a.bloecke.map((b) => ({ art: b.art, text: '…' })),
  }));
}

/**
 * Der Auftrag.
 *
 * `schluessel` steht als EIGENES Argument da und wird nicht aus `eintrag`
 * gelesen. Hier stand `eintrag.schluessel`, und `eintrag` ist der Langtext –
 * ein Objekt aus `titel`, `herkunft`, `woerter` und `abschnitte`, ohne
 * Schlüssel. Im Auftrag stand deshalb wörtlich:
 *
 *     SCHLÜSSEL (unverändert zurückgeben): undefined
 *
 * Das Modell hat getan, was dastand, und `"schluessel": "undefined"`
 * zurückgegeben. Vier vollständige, brauchbare Übersetzungen sind daran beim
 * Einspielen gescheitert – die Prüfung hat gegriffen, aber die Arbeit war
 * bezahlt. `undefined` ist in einer Zeichenkette kein Fehler, sondern ein
 * Wort; nichts an diesem Lauf hat gewarnt.
 *
 * Deshalb gibt es jetzt `--probe`: Es zeigt einen vollständigen Auftrag, ohne
 * einen einzigen Abruf. Wer einen Auftrag baut, muss ihn einmal gelesen haben.
 */
function auftrag(eintrag, schluessel, sprache) {
  const s = SPRACHEN[sprache];
  return (
    `Übersetze den folgenden Text einer Berliner Zahnarztpraxis nach ${s.name}.\n\n` +
    `${s.hinweis}\n\n` +
    'REGELN, die ohne Ausnahme gelten:\n\n' +
    '1. STRUKTUR UNVERÄNDERT. Genau so viele Abschnitte wie im Original, je Abschnitt\n' +
    '   genau so viele Blöcke, je Block dieselbe "art" und je Abschnitt dieselbe "stufe".\n' +
    '   Nichts zusammenfassen, nichts aufteilen, nichts weglassen, nichts hinzufügen.\n' +
    '   Wo "ueberschrift" null ist, bleibt sie null.\n' +
    '2. NICHTS ERKLÄREN, NICHTS KÜRZEN, NICHTS VERBESSERN. Es ist der Text der Praxis.\n' +
    '3. UNVERÄNDERT BLEIBEN: Eigennamen und Marken (KU64, GRAFT, KARHARD, Invisalign,\n' +
    '   CEREC, INVISALIGN, Palais Ritz, Kurfürstendamm, Hausvogteiplatz, Big Smile e. V.),\n' +
    '   Anschriften, Rufnummern, E-Mail-Adressen, Namen von Fachgesellschaften und\n' +
    '   Gesetzesbezeichnungen (§ 630f BGB, DSGVO/GDPR bleibt DSGVO im Zitat).\n' +
    '4. FACHBEGRIFFE innerhalb dieses Textes durchgängig gleich übersetzen.\n' +
    '5. ANTWORTE AUSSCHLIESSLICH MIT JSON in genau dieser Form, ohne Vor- und Nachwort,\n' +
    '   ohne Code-Zaun:\n\n' +
    '   { "schluessel": "…", "titel": "…" | null, "abschnitte": [ … ] }\n\n' +
    `SCHLÜSSEL (unverändert zurückgeben): ${schluessel}\n\n` +
    'DIESE FORM MUSS DIE ANTWORT HABEN (Texte durch die Übersetzung ersetzen):\n' +
    `${JSON.stringify(geruest(eintrag), null, 1)}\n\n` +
    'DAS ORIGINAL:\n' +
    `${JSON.stringify({ titel: eintrag.titel, abschnitte: eintrag.abschnitte }, null, 1)}`
  );
}

/* ── Ausführung ──────────────────────────────────────────────────────── */

/**
 * Antwort in JSON verwandeln – auch wenn ein Code-Zaun drumherum steht.
 *
 * Nicht aus Nachsicht, sondern aus Erfahrung: Ein Modell, das dreißig
 * Absätze Fachtext richtig übersetzt und dabei drei Backticks voranstellt,
 * hat die Aufgabe erfüllt. Der Zaun ist kein Grund, den Lauf zu verlieren.
 */
function alsJson(text) {
  const roh = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();
  return JSON.parse(roh);
}

const GLEICHZEITIG = Number(process.env.KORPUS_GLEICHZEITIG || 4);
const VERSUCHE = 3;

let fertig = 0;
let uebersprungen = 0;
const fehler = [];

async function einThema(i, sprache) {
  const datei = path.join(ZIEL, sprache, `${i}.json`);
  const { bereich, schluessel } = arbeit[i];
  const eintrag = deutsch[bereich][schluessel];

  for (let versuch = 1; versuch <= VERSUCHE; versuch++) {
    try {
      const antwort = await client.messages.create({
        model: MODELL,
        max_tokens: 16000,
        messages: [{ role: 'user', content: auftrag(eintrag, schluessel, sprache) }],
      });
      const text = antwort.content.map((t) => (t.type === 'text' ? t.text : '')).join('');
      const u = alsJson(text);

      /* Grobprüfung hier, feine beim Einspielen: Was schon an der Zahl der
         Abschnitte scheitert, muss nicht erst auf die Platte. */
      if (!Array.isArray(u.abschnitte) || u.abschnitte.length !== eintrag.abschnitte.length) {
        throw new Error(
          `${u.abschnitte?.length ?? 0} Abschnitte statt ${eintrag.abschnitte.length}`,
        );
      }

      /* `schluessel` steht NACH dem Spread und gewinnt damit gegen das, was
         das Modell zurückgibt. Vorher stand er davor – und wurde von der
         Antwort überschrieben. Welchen Schlüssel eine Datei trägt, ist keine
         Frage an das Modell: Wir wissen ihn. */
      await writeFile(datei, JSON.stringify({ ...u, schluessel }, null, 1));
      fertig++;
      console.log(
        `[korpus] ${sprache} ${String(fertig).padStart(3)}/${auftraege.length}  ` +
          `${bereich}/${schluessel} (${eintrag.woerter} W)`,
      );
      return;
    } catch (f) {
      if (versuch === VERSUCHE) {
        fehler.push(`${sprache} ${bereich}/${schluessel}: ${f.message}`);
        return;
      }
      /* Wachsende Pause – bei 429 oder einem Überlastungsfehler bringt ein
         sofortiger zweiter Versuch nichts. */
      await new Promise((r) => setTimeout(r, 2000 * versuch));
    }
  }
}

/*
 * Die Aufträge dieses Laufs.
 *
 * Was schon auf der Platte liegt, wird hier aussortiert und nicht erst im
 * Auftrag – sonst zählte `--hoechstens` die übersprungenen mit und ein zweiter
 * Lauf mit „höchstens vier" käme nie über die ersten vier hinaus.
 *
 * Die Reihenfolge ist Sprache für Sprache und darin absteigend nach Umfang:
 * Der längste Text ist der, an dem sich zuerst zeigt, ob das Verfahren trägt.
 */
/**
 * Ist die vorhandene Datei brauchbar – oder nur vorhanden?
 *
 * Der Unterschied hat einen ganzen Lauf gekostet. Die vier Dateien des ersten
 * Laufs waren da, vollständig und gut übersetzt, und trugen alle
 * `"schluessel": "undefined"`. Ein zweiter Lauf hätte sie übersprungen, weil
 * sie existieren; das Einspielen hätte sie wieder abgelehnt, weil sie sich
 * falsch nennen. Die Zwischenablage wäre dauerhaft vergiftet gewesen, und
 * zwar unsichtbar – „0 lagen schon vor" wäre zu „4 lagen schon vor" geworden
 * und alles hätte nach Fortschritt ausgesehen.
 *
 * Geprüft wird deshalb, was beim Einspielen zählt: der Schlüssel und die Zahl
 * der Abschnitte. Was daran scheitert, gilt als nicht vorhanden und wird neu
 * übersetzt. Ein Zwischenstand, der nicht mehr passt, soll sich selbst
 * ersetzen und nicht darauf warten, dass jemand an einen Cache-Schlüssel
 * denkt.
 */
async function brauchbarVorhanden(datei, schluessel, eintrag) {
  if (!existsSync(datei)) return false;
  try {
    const u = JSON.parse(await readFile(datei, 'utf8'));
    return u.schluessel === schluessel && u.abschnitte?.length === eintrag.abschnitte.length;
  } catch {
    return false;
  }
}

const auftraege = [];
let veraltet = 0;
for (const sprache of Object.keys(SPRACHEN)) {
  if (NUR_SPRACHE && sprache !== NUR_SPRACHE) continue;
  for (let i = 0; i < arbeit.length; i++) {
    const datei = path.join(ZIEL, sprache, `${i}.json`);
    const { bereich, schluessel } = arbeit[i];
    if (await brauchbarVorhanden(datei, schluessel, deutsch[bereich][schluessel])) {
      uebersprungen++;
      continue;
    }
    if (existsSync(datei)) veraltet++;
    auftraege.push([i, sprache]);
  }
}
if (veraltet) {
  console.log(`[korpus] ${veraltet} vorhandene Datei(en) passen nicht mehr – sie werden neu übersetzt`);
}
auftraege.length = Math.min(auftraege.length, HOECHSTENS);

console.log(
  `[korpus] ${auftraege.length} Abrufe in diesem Lauf, ${uebersprungen} lagen schon vor` +
    (NUR_SPRACHE ? ` – nur ${NUR_SPRACHE}` : '') +
    (HOECHSTENS === Infinity ? '' : ` – begrenzt auf ${HOECHSTENS}`),
);

let naechster = 0;
await Promise.all(
  Array.from({ length: GLEICHZEITIG }, async () => {
    while (naechster < auftraege.length) {
      const [i, sprache] = auftraege[naechster++];
      await einThema(i, sprache);
    }
  }),
);

/* ── Bericht ─────────────────────────────────────────────────────────── */

console.log(
  `\n[korpus] ${fertig} übersetzt, ${uebersprungen} lagen schon vor, ${fehler.length} misslungen`,
);

if (fehler.length) {
  console.log('\n[korpus] Misslungen – ein erneuter Lauf holt genau diese nach:');
  for (const f of fehler.slice(0, 20)) console.log(`           ${f}`);
  if (fehler.length > 20) console.log(`           … und ${fehler.length - 20} weitere`);
}

console.log(`\n[korpus] → ${path.relative(WURZEL, ZIEL)}`);
console.log(`[korpus] Weiter mit: node scripts/korpus-einspielen.mjs ${path.relative(WURZEL, ZIEL)}`);

/* Misslungene Aufträge sind kein Abbruch: Der Lauf ist wiederholbar, und
   was fehlt, bleibt auf der Website deutsch mit `lang="de"` – sichtbar
   unfertig statt unsichtbar beschädigt. */
process.exit(0);
