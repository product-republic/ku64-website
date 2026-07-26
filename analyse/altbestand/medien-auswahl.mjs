#!/usr/bin/env node
/**
 * Übernimmt die ausgewählten Motive aus `roh/` in die neue Website.
 *
 * ── Warum eine Auswahl und nicht der ganze Bestand ─────────────────────────
 *
 * `medien-holen.mjs` hat 354 Originale geladen. Davon gehören die wenigsten
 * auf die neue Website: Der Altbestand enthält Blogbebilderung, Social-Media-
 * Restposten, Auszeichnungslogos und Motive, deren Seiten es künftig nicht
 * mehr gibt. Was hier steht, ist die begründete Auswahl – jede Zeile mit dem
 * Ort, an dem das Bild eingesetzt wird.
 *
 * Die Liste ist bewusst kurz. Ein Bild kommt dazu, wenn es eine Frage
 * beantwortet, die Text nicht beantwortet: „Wie sieht es da aus?“, „Wer
 * behandelt mich?“, „Finde ich den Eingang?“
 *
 * ── Was mit den Dateien passiert ───────────────────────────────────────────
 *
 * BILDER werden auf ein vernünftiges Webmaß gerechnet. Die Originale sind bis
 * zu 4 MB groß; auf einer Seite, die vier davon zeigt, ist das die Ladezeit.
 * Querformate landen bei höchstens 1800 px Breite, Porträts bei 900 px im
 * Quadrat – mehr zeigt kein Browser auf keinem Gerät dieser Seite an.
 *
 * VIDEOS werden neu kodiert. Die Rohfassungen aus Potsdam (14,9 MB) und Mitte
 * (12,7 MB) sind für ein Kopfvideo zu schwer – `src/data/medien.ts` begründet
 * das ausführlich. Zielgröße ist die Größenordnung der bereits komprimierten
 * Kudamm-Fassung. Die Tonspur fällt ersatzlos weg: Das Kopfvideo läuft stumm,
 * eine Tonspur wäre reines Übergewicht.
 *
 * PORTRÄTS kommen aus `team-bestand.json`, also aus der Teamübersicht der
 * laufenden Website – dort steht zu jedem Bild auch, wer darauf zu sehen ist.
 *
 * ── Aufruf ─────────────────────────────────────────────────────────────────
 *
 *   node medien-auswahl.mjs
 *
 * Ist ein Zielbild schon da und neuer als die Quelle, bleibt es unangetastet.
 */

import { execFile } from 'node:child_process';
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import sharp from 'sharp';

const ausfuehren = promisify(execFile);

const HIER = import.meta.dirname;
const WURZEL = path.resolve(HIER, '../..');
const ROH = path.join(HIER, 'roh');
const MEDIEN = path.join(WURZEL, 'public/medien');
const PORTRAETS = path.join(WURZEL, 'public/team');

/** Höchstmaße. Darüber hinaus sieht niemand einen Unterschied. */
const BREITE_QUER = 1800;
const KANTE_PORTRAET = 900;

/**
 * Die Auswahl.
 *
 * `von` ist der Dateiname in `roh/`, `nach` der Name unter `public/medien/`.
 * Die neuen Namen sind sprechend und nach Standort sortiert – im Altbestand
 * hieß dieselbe Sache mal `rezeption`, mal `empfang`, mal `-1440`.
 */
const BILDER = [
  // ── Kurfürstendamm ──────────────────────────────────────────────────
  { von: 'empfangsbereich-ku64-berlin-kudamm-zahnarztpraxis.jpg', nach: 'kudamm-empfang.jpg' },
  /* Nicht `ku64-wartebereich-kamin-lounge.jpg`: dasselbe Motiv liegt dort nur
     in 400 px, hier in 1920 px. Im Altbestand steht die kleine Fassung an
     mehr Stellen als die große – die Zahl der Fundstellen sagt nichts über
     die Qualität der Datei. */
  { von: 'wartebereich-ku64-kudamm-berlin-parodontologie.jpg', nach: 'kudamm-wartebereich.jpg' },
  { von: 'flurbereich-ku64-gruene-landschaft-charlottenburg-berlin.jpg', nach: 'kudamm-flur.jpg' },
  { von: 'kieferorthopaedie-behandlungszimmer-kudamm.jpg', nach: 'kudamm-behandlungszimmer.jpg' },
  { von: 'dentallabor-im-haus-ku64-berlin-charlottenburg.jpg', nach: 'kudamm-meisterlabor.jpg' },

  // ── Berlin-Mitte ────────────────────────────────────────────────────
  // Genommen wird die Aufnahme ohne Menschen: Dasselbe Motiv liegt auch mit
  // einer Mitarbeiterin am Tresen vor. Wo es eine gleichwertige Aufnahme ohne
  // erkennbare Personen gibt, ist sie die richtige – sie braucht keine
  // Einwilligung, die beim Relaunch niemand mehr einholen muss.
  { von: 'ku64-rezeption-berlin-mitte-design.jpg', nach: 'berlinmitte-empfang.jpg' },
  { von: 'ku64-berlin-mitte-rezeption-1440.jpg', nach: 'berlinmitte-wartebereich.jpg' },
  {
    von: 'ku64-die-zahnspezialisten-hausvogteiplatz-14-berlin-mitte.jpg',
    nach: 'berlinmitte-praxis.jpg',
  },

  // ── Potsdam ─────────────────────────────────────────────────────────
  { von: 'ku64-potsdam-rezeption-1440.jpg', nach: 'potsdam-empfang.jpg' },
  { von: '200806-ku64-potsdam-26-p-1.jpg', nach: 'potsdam-wartebereich.jpg' },
  /*
   * NICHT übernommen, obwohl der Dateiname es nahelegt:
   *
   *   dentallabor-potsdam-ku64-zahnarzt.jpg
   *   dentallabor-praxislabor-ku64-berliner-str-139.jpg
   *      Beides zeigt kein Labor, sondern ein Stock-Motiv – ein Tablet mit
   *      dem Porträt einer lächelnden Frau. Der Dateiname behauptet einen
   *      Raum, den das Bild nicht zeigt. Genau davor warnt BILDER.md.
   *
   *   ku64-zahnarzt-potsdam-palais-ritz.jpg
   *      Ist der Bildschirmabzug eines Zeitungsartikels samt Schlagzeile.
   *      Fremdes Werk, und als Außenansicht ohnehin unbrauchbar.
   *
   * Eine Außenansicht von Potsdam fehlt damit weiterhin – siehe BILDER.md.
   */

  // ── Wilmersdorf · Die KiezPraxis ────────────────────────────────────
  // Der einzige Fund zu diesem Standort – und ausgerechnet die Außenansicht,
  // also genau das, was beim Ankommen zählt.
  {
    von: 'ku64-die-kiezpraxis-zahnarzt-wilmersdorf-aussenansicht.jpg',
    nach: 'wilmersdorf-aussenansicht.jpg',
  },

  // ── Standbilder der Kopfvideos ──────────────────────────────────────
  // Ohne Standbild bleibt der Kopfbereich leer, bis das Video läuft – auf
  // langsamen Verbindungen dauerhaft.
  { von: 'ku64-zahnarzt-kudamm-video.jpg', nach: 'kopf-berlin-charlottenburg.jpg' },
  { von: 'ku64-zahnarzt-mitte-video.jpg', nach: 'kopf-berlinmitte.jpg' },
  { von: 'ku64-zahnarzt-potsdam-video.jpg', nach: 'kopf-potsdam.jpg' },
];

/**
 * Kopfvideos. `qualitaet` ist der CRF-Wert von x264: kleiner heißt besser und
 * schwerer. 30 trifft bei 720p-Innenaufnahmen die Stelle, an der die Datei
 * klein wird, ohne dass die Wände fleckig werden.
 */
const VIDEOS = [
  {
    von: 'kudamm720p-full-compressed.mp4',
    nach: 'kopf-berlin-charlottenburg.mp4',
    /* Diese Fassung war schon komprimiert – nochmal drüber verliert nur. */
    unveraendert: true,
  },
  { von: 'potsdam-720p-full.mp4', nach: 'kopf-potsdam.mp4', qualitaet: 30 },
  { von: 'mitte-720-full.mp4', nach: 'kopf-berlinmitte.mp4', qualitaet: 30 },
];

const mb = (n) => (n / 1024 / 1024).toFixed(1);

/**
 * Muss neu gerechnet werden?
 *
 * Der Zeitstempel allein reicht nicht: Wenn in der Auswahl oben eine andere
 * Quelle eingetragen wird, ist die neue Quelldatei älter als das bereits
 * erzeugte Ziel – und nichts passiert. Genau das ist beim Wartebereich
 * passiert, wo eine 1920er Fassung eine 400er ablösen sollte. Deshalb zählt
 * zusätzlich, ob dieselbe Quelle wie beim letzten Lauf zugrunde lag.
 */
async function neuRechnen(quelle, ziel, frueher) {
  if (frueher?.quelle !== path.basename(quelle)) return true;
  try {
    const [q, z] = await Promise.all([stat(quelle), stat(ziel)]);
    return q.mtimeMs > z.mtimeMs;
  } catch {
    return true;
  }
}

/** Was der letzte Lauf erzeugt hat – Grundlage der Frage oben. */
let vorlauf = new Map();
try {
  const alt = JSON.parse(await readFile(path.join(HIER, 'medien-masse.json'), 'utf8'));
  vorlauf = new Map(alt.map((e) => [e.datei, e]));
} catch {
  /* Erster Lauf. */
}

await mkdir(MEDIEN, { recursive: true });
await mkdir(PORTRAETS, { recursive: true });

const masse = [];

/* ── Bilder ──────────────────────────────────────────────────────────────── */

for (const eintrag of BILDER) {
  const quelle = path.join(ROH, eintrag.von);
  const ziel = path.join(MEDIEN, eintrag.nach);
  try {
    await stat(quelle);
  } catch {
    console.error(`  FEHLT in roh/: ${eintrag.von}`);
    continue;
  }

  const bild = sharp(quelle);
  const { width, height } = await bild.metadata();
  const breite = Math.min(width, BREITE_QUER);

  if (await neuRechnen(quelle, ziel, vorlauf.get(`/medien/${eintrag.nach}`))) {
    await bild
      .resize({ width: breite, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true, progressive: true })
      .toFile(ziel);
  }

  const { size } = await stat(ziel);
  const neu = await sharp(ziel).metadata();
  masse.push({
    datei: `/medien/${eintrag.nach}`,
    quelle: eintrag.von,
    breite: neu.width,
    hoehe: neu.height,
    kb: Math.round(size / 1024),
  });
  console.log(`  ${eintrag.nach.padEnd(34)} ${neu.width}×${neu.height}  ${Math.round(size / 1024)} kB`);
}

/* ── Videos ──────────────────────────────────────────────────────────────── */

for (const v of VIDEOS) {
  const quelle = path.join(ROH, v.von);
  const ziel = path.join(MEDIEN, v.nach);
  try {
    await stat(quelle);
  } catch {
    console.error(`  FEHLT in roh/: ${v.von}`);
    continue;
  }

  if (await neuRechnen(quelle, ziel, vorlauf.get(`/medien/${v.nach}`))) {
    if (v.unveraendert) {
      /* Auch die fertige Fassung bekommt `faststart`: ohne das liegt der
         Index am Dateiende und der Browser lädt erst alles, bevor er das
         erste Bild zeigt. */
      await ausfuehren('ffmpeg', [
        '-y', '-i', quelle,
        '-c', 'copy', '-an', '-movflags', '+faststart',
        ziel,
      ]);
    } else {
      await ausfuehren('ffmpeg', [
        '-y', '-i', quelle,
        '-vf', "scale='min(1280,iw)':-2",
        '-c:v', 'libx264', '-preset', 'slow', '-crf', String(v.qualitaet),
        '-profile:v', 'high', '-pix_fmt', 'yuv420p',
        '-an', '-movflags', '+faststart',
        ziel,
      ]);
    }
  }

  const vorher = (await stat(quelle)).size;
  const nachher = (await stat(ziel)).size;
  masse.push({ datei: `/medien/${v.nach}`, quelle: v.von, kb: Math.round(nachher / 1024) });
  console.log(`  ${v.nach.padEnd(34)} ${mb(vorher)} MB → ${mb(nachher)} MB`);
}

/* ── Porträts ────────────────────────────────────────────────────────────── */

const team = JSON.parse(await readFile(path.join(HIER, 'team-bestand.json'), 'utf8'));
let portraets = 0;
let ohneDatei = 0;

/*
 * `medien-holen.mjs` legt die Dateien unter dem kleingeschriebenen Stamm ab,
 * die Teamübersicht nennt sie in Originalschreibweise (`ZA-Andrej-…`). Ein
 * Verzeichnis über beide Schreibweisen ist verlässlicher, als die Regel ein
 * zweites Mal nachzubauen – wenn sie sich ändert, findet das hier trotzdem.
 */
const vorhanden = new Map();
for (const datei of await readdir(ROH)) {
  vorhanden.set(datei.toLowerCase(), datei);
  vorhanden.set(
    datei.toLowerCase().replace(/-\d{2,4}x\d{2,4}(?=\.)/, '').replace(/-scaled(?=\.)/, ''),
    datei,
  );
}

function findeRoh(url) {
  const name = path.basename(new URL(url).pathname).toLowerCase();
  return (
    vorhanden.get(name) ??
    vorhanden.get(name.replace(/-\d{2,4}x\d{2,4}(?=\.)/, '').replace(/-scaled(?=\.)/, '')) ??
    null
  );
}

for (const person of team) {
  if (!person.foto) continue;
  const gefunden = findeRoh(person.foto);
  const quelle = path.join(ROH, gefunden ?? path.basename(new URL(person.foto).pathname));
  const ziel = path.join(PORTRAETS, `${person.slug}.jpg`);
  try {
    await stat(quelle);
  } catch {
    ohneDatei++;
    console.error(`  Porträt fehlt in roh/: ${person.name} (${path.basename(person.foto)})`);
    continue;
  }

  if (await neuRechnen(quelle, ziel, vorlauf.get(`/team/${person.slug}.jpg`))) {
    await sharp(quelle)
      /* Quadratisch beschnitten, Ausschnitt auf die Person zentriert: Die
         Vorlagen sind schon quadratisch, aber nicht alle – und eine Kachel-
         reihe mit unterschiedlichen Formaten wirkt unaufgeräumt. */
      .resize(KANTE_PORTRAET, KANTE_PORTRAET, { fit: 'cover', position: 'attention' })
      .jpeg({ quality: 82, mozjpeg: true, progressive: true })
      .toFile(ziel);
  }
  masse.push({
    datei: `/team/${person.slug}.jpg`,
    quelle: gefunden,
    breite: KANTE_PORTRAET,
    hoehe: KANTE_PORTRAET,
    kb: Math.round((await stat(ziel)).size / 1024),
  });
  portraets++;
}

console.log(`\n  ${portraets} Porträts nach public/team/${ohneDatei ? `, ${ohneDatei} ohne Datei` : ''}`);

await writeFile(
  path.join(HIER, 'medien-masse.json'),
  JSON.stringify(masse, null, 2) + '\n',
);
console.log('  Maße für src/lib/bilder.ts → medien-masse.json');
