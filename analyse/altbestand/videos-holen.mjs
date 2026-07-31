/**
 * Welche YouTube-Videos die alte Website eingebettet hat – und wo.
 *
 * ── Warum das nachgeholt werden musste ──────────────────────────────────
 *
 * `texte-holen.mjs` speichert Text, keine Auszeichnung. Auf 89 Seiten stand
 * dort deshalb nur der Cookie-Hinweis „Sie sehen gerade einen
 * Platzhalterinhalt von YouTube" – die Videokennung selbst steckte im
 * `<iframe>` und ist beim Abbau der Tags verlorengegangen.
 *
 * Für den Neubau ist das der Unterschied zwischen „wir bauen YouTube ein"
 * und „wir bauen diese vierzehn Videos ein". Ohne die Kennungen wäre der
 * Dienst eine leere Hülle im Verzeichnis.
 *
 * ── Was das Skript tut ──────────────────────────────────────────────────
 *
 * Es holt genau die Seiten, auf denen der Platzhalter stand, und liest aus
 * dem Quelltext:
 *
 *   · die Videokennung aus `youtube.com/embed/…`, `youtu.be/…` oder `?v=…`
 *   · den Titel des `<iframe>`, wenn einer da ist – das ist der Titel, den
 *     die Praxis vergeben hat, und der beste Beleg dafür, worum es geht
 *   · die Überschrift davor, damit die Zuordnung nachvollziehbar bleibt
 *
 * ── Und dann doch einmal bei YouTube ────────────────────────────────────
 *
 * Die Einbettungen tragen keinen Titel: Auf ku64.de steckt das `<iframe>` in
 * einem Cookie-Wrapper, und der ausgelieferte Quelltext hat nur die Kennung.
 * Ein Video ohne Titel ist im Neubau aber nicht einbaubar – die Schaltfläche,
 * die es freigibt, muss sagen, was sie freigibt, sonst klickt niemand
 * informiert.
 *
 * Deshalb ein Aufruf je Kennung an die oEmbed-Schnittstelle. Das ist ein
 * Werkzeug der Bestandsaufnahme und läuft NICHT auf der fertigen Seite; dort
 * wird zu Google erst eine Verbindung aufgebaut, wenn jemand auf Abspielen
 * klickt.
 *
 * Der Nebeneffekt ist der eigentliche Fund: Die Antwort sagt auch, ob es das
 * Video überhaupt noch gibt. 404 heißt gelöscht, 403 heißt Einbetten
 * gesperrt – und beides steht heute als leerer Kasten auf ku64.de.
 *
 * ── Was es weiterhin nicht tut ──────────────────────────────────────────
 *
 * Keine Vorschaubilder von ytimg.com laden. Die kommen aus dem eigenen
 * Bestand, sonst holt die fertige Seite ein Bild von Google, bevor jemand
 * zugestimmt hat.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   NODE_USE_ENV_PROXY=1 node analyse/altbestand/videos-holen.mjs
 *
 * Ergebnis: analyse/altbestand/videos.json
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const WURZEL = path.resolve(import.meta.dirname, '..', '..');
const QUELLE = path.join(WURZEL, 'analyse', 'altbestand', 'texte-roh.json');
const ZIEL = path.join(WURZEL, 'analyse', 'altbestand', 'videos.json');

const roh = JSON.parse(await readFile(QUELLE, 'utf8'));

/* Die Seiten, auf denen der YouTube-Platzhalter stand. Nur diese – 89 statt
   341 Abrufe, und der fremde Server wird nicht ohne Grund belastet. */
const seiten = [
  ...new Set(
    roh.eintraege
      .filter((e) => e.bloecke.some((b) => /YouTube/i.test(b.text)))
      .map((e) => e.pfad),
  ),
].sort();

const KENNUNG = /(?:youtube(?:-nocookie)?\.com\/embed\/|youtu\.be\/|[?&]v=)([A-Za-z0-9_-]{11})/g;

const gefunden = new Map();
let abgerufen = 0;
let fehler = 0;

for (const pfad of seiten) {
  let html;
  try {
    const antwort = await fetch(`https://ku64.de${pfad}`, {
      headers: { 'user-agent': 'KU64-Relaunch-Analyse (Bestandsaufnahme vor Umzug)' },
    });
    if (!antwort.ok) {
      fehler++;
      continue;
    }
    html = await antwort.text();
    abgerufen++;
  } catch {
    fehler++;
    continue;
  }

  /*
   * Titel und Kennung gehören zusammen, deshalb wird je `<iframe>` gelesen
   * und nicht zweimal über die ganze Seite. Ein Muster über alles fände
   * Kennungen und Titel in verschiedener Reihenfolge und paarte sie falsch.
   */
  for (const m of html.matchAll(/<iframe\b[^>]*>/gi)) {
    const tag = m[0];
    KENNUNG.lastIndex = 0;
    const treffer = KENNUNG.exec(tag);
    if (!treffer) continue;
    const id = treffer[1];
    const titel = /title=["']([^"']+)["']/i.exec(tag)?.[1] ?? null;
    const eintrag = gefunden.get(id) ?? { id, titel, seiten: [] };
    if (!eintrag.titel && titel) eintrag.titel = titel;
    if (!eintrag.seiten.includes(pfad)) eintrag.seiten.push(pfad);
    gefunden.set(id, eintrag);
  }

  /* Manche Einbettungen stehen als `data-src` in einem Cookie-Wrapper und
     haben gar kein `<iframe>` im ausgelieferten HTML. Dafür der zweite
     Durchgang über die ganze Seite – ohne Titel, aber mit Kennung. */
  KENNUNG.lastIndex = 0;
  for (const m of html.matchAll(KENNUNG)) {
    const id = m[1];
    const eintrag = gefunden.get(id) ?? { id, titel: null, seiten: [] };
    if (!eintrag.seiten.includes(pfad)) eintrag.seiten.push(pfad);
    gefunden.set(id, eintrag);
  }
}

/* ── Titel und Verfügbarkeit je Kennung ──────────────────────────────── */

for (const v of gefunden.values()) {
  try {
    const antwort = await fetch(
      `https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${v.id}`,
    );
    if (antwort.ok) {
      const daten = await antwort.json();
      v.titel = daten.title ?? v.titel;
      v.kanal = daten.author_name ?? null;
      v.verfuegbar = true;
    } else {
      v.verfuegbar = false;
      v.status = antwort.status;
    }
  } catch (e) {
    v.verfuegbar = false;
    v.status = String(e.message);
  }
}

const liste = [...gefunden.values()].sort((a, z) => z.seiten.length - a.seiten.length);
const kaputt = liste.filter((v) => !v.verfuegbar);

await writeFile(
  ZIEL,
  JSON.stringify(
    {
      erhobenAm: new Date().toISOString().slice(0, 10),
      hinweis:
        'Erzeugt von analyse/altbestand/videos-holen.mjs. Videokennungen aus den ' +
        'Einbettungen von ku64.de – ohne Abruf bei YouTube.',
      seitenGeprueft: abgerufen,
      seitenFehler: fehler,
      videos: liste,
    },
    null,
    1,
  ),
);

console.log(`[videos] ${abgerufen} Seiten geholt, ${fehler} nicht erreichbar`);
console.log(`[videos] ${liste.length} verschiedene Videos gefunden, ${kaputt.length} davon nicht abspielbar:\n`);
for (const v of liste) {
  const marke = v.verfuegbar ? ' ' : '✗';
  console.log(
    `${marke} ${v.id}  ${String(v.seiten.length).padStart(2)} Seite(n)  ` +
      `${v.titel ?? '(ohne Titel)'}${v.verfuegbar ? '' : `  [HTTP ${v.status}]`}`,
  );
  for (const s of v.seiten.slice(0, 4)) console.log(`               ${s}`);
  if (v.seiten.length > 4) console.log(`               … und ${v.seiten.length - 4} weitere`);
}

if (kaputt.length) {
  console.log(
    `\n[videos] ${kaputt.length} Einbettung(en) auf ku64.de zeigen heute einen leeren Kasten:`,
  );
  for (const v of kaputt) {
    console.log(`           ${v.id} (HTTP ${v.status}) auf ${v.seiten.join(', ')}`);
  }
}
console.log(`\n[videos] → ${path.relative(WURZEL, ZIEL)}`);
