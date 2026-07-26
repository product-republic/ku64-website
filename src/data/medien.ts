/**
 * Medienbestand: was es gibt, wo es hingehört, was noch fehlt.
 *
 * ── Der Befund, der die Standortfrage beantwortet ────────────────────────
 *
 * Die alte Website zeigte an jedem Standort das Kopfvideo vom Kurfürstendamm.
 * Die naheliegende Erklärung wäre gewesen: Es gibt kein anderes. Sie stimmt
 * nicht. Im Bestand liegen eigene Aufnahmen für Potsdam und Berlin-Mitte –
 * sie wurden nur nicht ausgespielt.
 *
 * Das ist derselbe Fehler wie beim Standortwechsel, nur in Bildform: Jemand
 * sieht Räume, die er beim Termin nicht wiederfindet. Jeder Standort bekommt
 * deshalb ab jetzt seine eigene Aufnahme oder gar keine.
 *
 * ── Was fehlt ───────────────────────────────────────────────────────────
 *
 * Wilmersdorf. Die KiezPraxis ist die jüngste Adresse; es gibt schlicht noch
 * kein Material. Dort läuft die Seite ohne Kopfvideo – das ist ehrlicher als
 * ein fremdes.
 *
 * ── Warum hier nur Namen und keine Dateien stehen ────────────────────────
 *
 * Die Dateien liegen im Server-Backup. Sie in dieses Projekt zu bringen ist
 * ein reiner Kopiervorgang, den ein Mensch mit Zugriff auf beide Seiten in
 * einer Minute erledigt. Diese Datei beschreibt, wohin – damit die Seiten
 * fertig verdrahtet sind, bevor die erste Datei da ist, und der Bildwächter
 * jede fehlende meldet statt sie stillschweigend auszulassen.
 */

export interface Kopfvideo {
  standort: string;
  /** Dateiname im Backup, damit die Zuordnung nachvollziehbar bleibt. */
  quelle: string;
  /** Zielpfad unter public/. */
  datei: string;
  /** Standbild, das vor dem Abspielen steht. Ohne das bleibt der Kopf grau. */
  poster: string;
  megabyte: number;
  /** Beschreibt, was zu sehen ist – für Menschen, die das Video nicht sehen. */
  beschreibung: string;
}

/**
 * Auswahl der Fassung: Vom Kurfürstendamm liegen vier Versionen vor, von
 * 187 MB Rohfassung bis 5,6 MB komprimiert. Genommen wird die komprimierte
 * 720p-Fassung.
 *
 * Die Rohfassung mit 187 MB gehört auf keinen Webserver: Bei einer üblichen
 * Mobilverbindung wären das mehrere Minuten Ladezeit für eine Aufnahme, die
 * im Hintergrund läuft. Selbst 17 MB sind für ein Kopfvideo zu viel – ein
 * Kopfvideo darf die Seite nicht aufhalten, es schmückt sie.
 */
export const KOPFVIDEOS: Kopfvideo[] = [
  {
    standort: 'berlin-charlottenburg',
    quelle: 'kudamm720p-full-compressed.mp4',
    datei: '/medien/kopf-berlin-charlottenburg.mp4',
    poster: '/medien/kopf-berlin-charlottenburg.jpg',
    megabyte: 5.6,
    beschreibung: 'Rundgang durch die Praxis am Kurfürstendamm',
  },
  {
    standort: 'potsdam',
    quelle: 'potsdam-720p-full.mp4',
    datei: '/medien/kopf-potsdam.mp4',
    poster: '/medien/kopf-potsdam.jpg',
    megabyte: 14.9,
    beschreibung: 'Rundgang durch die Praxis im Palais Ritz in Potsdam',
  },
  {
    standort: 'berlinmitte',
    quelle: 'mitte-720-full.mp4',
    datei: '/medien/kopf-berlinmitte.mp4',
    poster: '/medien/kopf-berlinmitte.jpg',
    megabyte: 12.7,
    beschreibung: 'Rundgang durch die Praxis am Hausvogteiplatz',
  },
  /*
   * Wilmersdorf fehlt bewusst. Kein Eintrag heißt: kein Kopfvideo. Ein
   * Platzhalter mit fremdem Material wäre schlimmer als die Lücke.
   */
];

export function kopfvideoFuer(standortSlug: string): Kopfvideo | undefined {
  return KOPFVIDEOS.find((v) => v.standort === standortSlug);
}

/**
 * Standbild für Standorte ohne eigenes Kopfvideo.
 *
 * Wilmersdorf hat kein Video – aber eine Außenansicht, und die beantwortet
 * am Kopf der Standortseite die wichtigste Frage überhaupt: Ist das das
 * Haus, vor dem ich gleich stehe? Ein Foto ist hier nicht der Notbehelf für
 * ein fehlendes Video, sondern für diesen Standort die bessere Antwort.
 *
 * Der Wert ist ein Schlüssel aus dem Bildverzeichnis, kein Pfad: Damit gilt
 * auch am Seitenkopf die Nachweispflicht aus `src/lib/bilder.ts`.
 */
export const KOPFBILDER: Record<string, string> = {
  wilmersdorf: 'wilmersdorf-aussenansicht',
};

export type Kopfmedium =
  | { art: 'video'; video: Kopfvideo }
  | { art: 'bild'; schluessel: string };

/**
 * Was am Kopf dieses Standorts steht – Video, Bild oder nichts.
 *
 * Die Seite muss das vor dem Rendern wissen: Über einem Medium steht heller
 * Text auf einem Schleier, ohne Medium dunkler Text auf heller Fläche. Das
 * ist keine Kleinigkeit, sondern der Unterschied zwischen lesbar und nicht.
 */
export function kopfmediumFuer(standortSlug: string): Kopfmedium | undefined {
  const video = kopfvideoFuer(standortSlug);
  if (video) return { art: 'video', video };
  const schluessel = KOPFBILDER[standortSlug];
  if (schluessel) return { art: 'bild', schluessel };
  return undefined;
}

/**
 * Videos, die zu einer Behandlung gehören statt zu einem Ort.
 * Noch nicht eingebunden – erst mit den Seiten, auf die sie gehören.
 */
export const BEHANDLUNGSVIDEOS = [
  { quelle: 'Cad-Cam-2.mp4', megabyte: 29.7, thema: 'Fertigung im eigenen Meisterlabor' },
  { quelle: 'Zima-ultrasonic-cleaner.mp4', megabyte: 5.7, thema: 'Aufbereitung der Instrumente' },
];

/**
 * Was aus dem Backup übernommen werden muss, als Liste zum Abarbeiten.
 *
 * Die Videos sind namentlich bekannt, die Bilder ermittelt
 * `analyse/altbestand/medien-nutzung.mjs` – es führt die
 * WordPress-Ableitungen auf ihre Originale zurück und prüft, welche davon
 * überhaupt irgendwo verwendet werden.
 */
export const UEBERNAHME_OFFEN = {
  videos: KOPFVIDEOS.map((v) => ({ von: v.quelle, nach: v.datei })),
  poster: KOPFVIDEOS.map((v) => v.poster),
  hinweis:
    'Poster aus dem jeweiligen Video greifen, erstes ruhiges Bild. Ohne Poster ' +
    'bleibt der Kopfbereich bis zum ersten Videobild leer – und auf Verbindungen, ' +
    'auf denen das Video gar nicht lädt, dauerhaft.',
};
