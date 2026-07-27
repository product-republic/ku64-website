/**
 * Hält die Sprachfassungen automatisch am deutschen Original.
 *
 * Ablauf: deutsche Quelltexte einsammeln, mit jedem Katalog vergleichen, und
 * ausschließlich das übersetzen, was fehlt oder dessen deutsches Original sich
 * geändert hat. Das Ergebnis landet als JSON im Repository – nicht im Build.
 *
 * Warum ins Repository und nicht zur Buildzeit: Eine Übersetzung, die bei
 * jedem Deployment neu entsteht, ist bei jedem Deployment anders. Für eine
 * Zahnarztpraxis ist das inakzeptabel – Aussagen zu Kosten, Kassenleistung und
 * Behandlungsdauer müssen gegengelesen werden können und dürfen sich nicht
 * unbemerkt verändern. Übersetzt wird deshalb einmal, das Ergebnis wird
 * eingecheckt, und der Build liest nur noch.
 *
 * Aufrufe:
 *   npm run sprachen:sync                 – alles Fehlende und Veraltete
 *   npm run sprachen:sync -- --sprache=fr – nur eine Sprache
 *   npm run sprachen:sync -- --trocken    – nur zeigen, was zu tun wäre
 *   npm run sprachen:sync -- --aufraeumen – verwaiste Einträge entfernen
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const { quelltexte, kontextFuer, UNVERAENDERT } = await import(
  pathToFileURL(path.join(WURZEL, 'src/i18n/quelle.ts')).href
);
const { fingerabdruck } = await import(pathToFileURL(path.join(WURZEL, 'src/i18n/felder.ts')).href);
const { SPRACHEN, QUELLSPRACHE } = await import(
  pathToFileURL(path.join(WURZEL, 'src/i18n/sprachen.ts')).href
);

const args = process.argv.slice(2);
const trocken = args.includes('--trocken');
const aufraeumen = args.includes('--aufraeumen');
const nurSprache = args.find((a) => a.startsWith('--sprache='))?.split('=')[1];

const MODELL = process.env.UEBERSETZUNG_MODELL || 'claude-sonnet-5';

/*
 * Gebündelt wird nach Zeichen, nicht nach Anzahl.
 *
 * Zwanzig Oberflächentexte sind zusammen dreihundert Zeichen; zwanzig
 * Absätze einer Beschwerdeseite sind zwanzigtausend. Bei fester Stückzahl
 * läuft das zweite Bündel in die Ausgabegrenze, die Antwort bricht mitten
 * im JSON ab, und der ganze Lauf endet mit „Antwort war kein gültiges
 * JSON" – nach einer halben Stunde und mit dem Rest unübersetzt.
 *
 * 12.000 Zeichen deutscher Text ergeben grob 4000 Token Eingabe und selten
 * mehr als 6000 Token Ausgabe. Bei 16.000 erlaubten passt das mit Abstand.
 */
const BUENDEL_ZEICHEN = 12000;
/** Auch kurze Texte werden nicht beliebig viele auf einmal – die Antwort soll überschaubar bleiben. */
const BUENDEL_MAX = 25;

/** Teilt die offenen Schlüssel in Bündel, die zusammen unter der Grenze bleiben. */
function buendeln(schluessel, laenge) {
  const buendel = [];
  let aktuell = [];
  let zeichen = 0;

  for (const k of schluessel) {
    const l = laenge(k);
    /* Ein einzelner Text über der Grenze bekommt sein eigenes Bündel – ihn
       zu teilen wäre falsch, er gehört als Ganzes übersetzt. */
    if (aktuell.length > 0 && (zeichen + l > BUENDEL_ZEICHEN || aktuell.length >= BUENDEL_MAX)) {
      buendel.push(aktuell);
      aktuell = [];
      zeichen = 0;
    }
    aktuell.push(k);
    zeichen += l;
  }
  if (aktuell.length) buendel.push(aktuell);
  return buendel;
}

const quelle = quelltexte();
const schluessel = Object.keys(quelle);
console.log(`[sync] deutsche Quellfassung: ${schluessel.length} Textbausteine`);

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

if (!client && !trocken) {
  console.error(
    '[sync] ANTHROPIC_API_KEY ist nicht gesetzt.\n' +
      '       Ohne Schlüssel kann nur "--trocken" laufen (zeigt den Rückstand).',
  );
  process.exit(1);
}

for (const sprache of SPRACHEN) {
  if (sprache.code === QUELLSPRACHE) continue;
  if (nurSprache && sprache.code !== nurSprache) continue;

  const pfad = path.join(WURZEL, 'src/inhalte', `${sprache.code}.json`);
  const katalog = JSON.parse(await readFile(pfad, 'utf8'));
  katalog.eintraege ??= {};

  const offen = schluessel.filter((k) => {
    const e = katalog.eintraege[k];
    return !e || e.quelle !== fingerabdruck(quelle[k]);
  });

  const verwaist = Object.keys(katalog.eintraege).filter((k) => !(k in quelle));

  console.log(
    `\n[sync] ${sprache.code} (${sprache.eigenname}): ` +
      `${offen.length} offen, ${verwaist.length} verwaist`,
  );

  if (aufraeumen && verwaist.length) {
    for (const k of verwaist) delete katalog.eintraege[k];
    /* Sofort schreiben und nicht erst nach der Übersetzung: Aufräumen
       braucht keinen Schlüssel, und mit `--trocken` käme es sonst nie auf
       die Platte – die Einträge blieben stehen und die Abdeckung sähe
       besser aus, als sie ist. */
    await katalogSchreiben(pfad, katalog);
    console.log(`[sync] ${verwaist.length} verwaiste Einträge entfernt`);
  }

  if (trocken) {
    for (const k of offen.slice(0, 20)) console.log(`  · ${k}`);
    if (offen.length > 20) console.log(`  … und ${offen.length - 20} weitere`);
    continue;
  }

  const buendel = buendeln(offen, (k) => quelle[k].length);
  const gesamtZeichen = offen.reduce((n, k) => n + quelle[k].length, 0);
  console.log(
    `[sync] ${sprache.code}: ${buendel.length} Bündel, ` +
      `${Math.round(gesamtZeichen / 1000)} Tausend Zeichen`,
  );

  let fertig = 0;
  let uebersprungen = 0;

  for (const [nr, teil] of buendel.entries()) {
    let ergebnis;
    try {
      ergebnis = await uebersetzen(teil, sprache);
    } catch (fehler) {
      /*
       * Ein Bündel, das scheitert, darf nicht den ganzen Lauf mitnehmen.
       *
       * Beim nächsten Aufruf steht es wieder in der Liste der offenen
       * Schlüssel – der Fingerabdruck sorgt dafür. Gemeldet wird es
       * trotzdem, damit niemand ein stilles Loch für Vollständigkeit hält.
       */
      console.error(`[sync] Bündel ${nr + 1} übersprungen: ${fehler.message.split('\n')[0]}`);
      uebersprungen += teil.length;
      continue;
    }

    for (const [k, text] of Object.entries(ergebnis)) {
      katalog.eintraege[k] = { text, quelle: fingerabdruck(quelle[k]) };
    }

    // Nach jedem Bündel schreiben: Bricht der Lauf ab, ist die Arbeit bis
    // hierhin gesichert und der nächste Aufruf setzt genau dort fort.
    await katalogSchreiben(pfad, katalog);
    fertig += teil.length;
    console.log(`[sync] ${sprache.code}: ${fertig}/${offen.length} übersetzt`);
  }

  if (uebersprungen > 0) {
    console.error(
      `[sync] ${sprache.code}: ${uebersprungen} Texte blieben offen. ` +
        'Erneut aufrufen – der Lauf setzt genau dort fort.',
    );
  }

  if (offen.length === 0 && !aufraeumen) console.log('[sync] nichts zu tun');
}

console.log('\n[sync] fertig. Bitte die Änderungen in src/inhalte/ gegenlesen und einchecken.');

// ────────────────────────────────────────────────────────────────────────

async function katalogSchreiben(pfad, katalog) {
  // Sortiert schreiben, damit der Diff beim nächsten Lauf lesbar bleibt.
  const sortiert = Object.fromEntries(
    Object.entries(katalog.eintraege).sort(([a], [b]) => a.localeCompare(b)),
  );
  await writeFile(pfad, `${JSON.stringify({ ...katalog, eintraege: sortiert }, null, 2)}\n`);
}

async function uebersetzen(keys, sprache) {
  const posten = keys.map((k) => ({
    schluessel: k,
    deutsch: quelle[k],
    kontext: kontextFuer(k),
  }));

  const antwort = await client.messages.create({
    model: MODELL,
    max_tokens: 16000,
    system: [
      {
        type: 'text',
        text: systemPrompt(sprache),
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content:
          'Übersetze die folgenden Einträge. Antworte ausschließlich mit einem ' +
          'JSON-Objekt, das jeden "schluessel" auf die Übersetzung abbildet – ' +
          'ohne Rahmentext, ohne Code-Zaun.\n\n' +
          JSON.stringify(posten, null, 2),
      },
    ],
  });

  const roh = antwort.content
    .filter((t) => t.type === 'text')
    .map((t) => t.text)
    .join('')
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```$/, '');

  let ergebnis;
  try {
    ergebnis = JSON.parse(roh);
  } catch {
    throw new Error(`[sync] Antwort war kein gültiges JSON:\n${roh.slice(0, 400)}`);
  }

  // Nur zurückgeben, was auch angefragt war – kein erfundener Schlüssel.
  return Object.fromEntries(keys.filter((k) => typeof ergebnis[k] === 'string').map((k) => [k, ergebnis[k]]));
}

function systemPrompt(sprache) {
  return `Du übersetzt die Website einer Zahnarztpraxis in Berlin und Potsdam aus dem Deutschen ins ${sprache.eigenname} (${sprache.bcp47}).

# Ansprache
Patientinnen und Patienten, keine Fachleute. Ruhig, klar, kurze Sätze, kein Werbeton. Die deutsche Fassung siezt; übertrage die entsprechende höfliche Form der Zielsprache (im Französischen "vous").

# Regeln
- Übersetze sinngemäß, nicht Wort für Wort. Die Übersetzung muss klingen, als wäre sie in der Zielsprache geschrieben worden.
- Zahnmedizinische Fachbegriffe: den in der Zielsprache üblichen Begriff verwenden, den Laien kennen – nicht den lateinischen, wenn es einen geläufigen gibt.
- Zahlen, Preise, Zeitangaben und Maßeinheiten unverändert übernehmen. Beträge bleiben in Euro.
- Aussagen zu Kosten, Haltbarkeit und Erfolg weder abschwächen noch verstärken. Was der deutsche Text offenlässt, bleibt offen. Erfinde nichts hinzu.
- Angaben zur deutschen gesetzlichen Krankenversicherung bleiben Angaben über das deutsche System. Ersetze sie nicht durch das Gesundheitssystem eines Landes der Zielsprache.
- Diese Namen bleiben unverändert: ${UNVERAENDERT.join(', ')}. Ebenso Straßennamen, Haltestellen, Stadtteile und Gebäudenamen.
- Platzhalter in geschweiften Klammern wie {anzahl} oder {sprache} exakt so stehen lassen.
- Manche Texte enthalten Auszeichnung: <strong>…</strong>, <code>…</code>, <br />. Die Tags bleiben unverändert stehen, an derselben Stelle im Satz, mit denselben Namen. Übersetzt wird nur der Text zwischen ihnen. Ein fehlendes oder umbenanntes Tag macht die Seite kaputt.
- In eckigen Klammern innerhalb von <code> stehen Angaben, die die Praxis noch einträgt – etwa <code>[Anzahl Tage]</code>. Übersetze den Text darin mit, aber lass die eckigen Klammern stehen: Sie sind das Zeichen dafür, dass hier noch etwas fehlt.
- Länge halten. Oberflächentexte (Schlüssel beginnt mit "ui.") dürfen die deutsche Länge um höchstens ein Viertel überschreiten, sonst bricht das Layout.
- Keine Anführungszeichen um die Übersetzung, keine Erklärungen, keine Alternativen.

# Ausgabe
Ein einziges JSON-Objekt: Schlüssel wie angefragt, Wert die Übersetzung als String.`;
}
