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
 * ── Woher die Dateien kommen ────────────────────────────────────────────
 *
 * Alle drei Aufnahmen liegen öffentlich auf ku64.de und sind von dort
 * übernommen. Die Standbilder bestätigen die Zuordnung ohne jeden Zweifel:
 * Kurfürstendamm zeigt die Dachterrasse mit dem KU64-Schriftzug, Potsdam das
 * Portal des Palais Ritz, Berlin-Mitte das Schild am Hausvogteiplatz. Es sind
 * drei verschiedene Häuser – die alte Website spielte für alle drei dasselbe
 * Video aus.
 *
 * `scripts/kopfvideos-aufbereiten.mjs` hat sie danach in den Zustand
 * gebracht, in dem sie hier liegen: ohne Tonspur, mit Kopfdaten vorn und auf
 * eine Bitrate gebracht, die ein Hintergrundvideo verträgt. Dort steht auch,
 * warum.
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
 *
 * Potsdam und Berlin-Mitte lagen mit 14,3 und 12,1 MB genau in diesem
 * Bereich. Beide sind neu kodiert; zusammen wiegen die drei Videos jetzt
 * 16,8 MB statt 31,7 MB. Die Tonspur ist überall entfernt – das Element ist
 * `muted`, sie wurde nie abgespielt und trotzdem geladen.
 *
 * Die Angabe `megabyte` ist der Ist-Stand der Datei unter `public/`, nicht
 * eine Absicht. Wer ein Video austauscht, korrigiert sie mit.
 */
export const KOPFVIDEOS: Kopfvideo[] = [
  {
    standort: 'berlin-charlottenburg',
    quelle: 'kudamm720p-full-compressed.mp4',
    datei: '/medien/kopf-berlin-charlottenburg.mp4',
    poster: '/medien/kopf-berlin-charlottenburg.jpg',
    megabyte: 5.3,
    beschreibung: 'Rundgang durch die Praxis am Kurfürstendamm',
  },
  {
    standort: 'potsdam',
    quelle: 'potsdam-720p-full.mp4',
    datei: '/medien/kopf-potsdam.mp4',
    poster: '/medien/kopf-potsdam.jpg',
    megabyte: 6.2,
    beschreibung: 'Rundgang durch die Praxis im Palais Ritz in Potsdam',
  },
  {
    standort: 'berlinmitte',
    quelle: 'mitte-720-full.mp4',
    datei: '/medien/kopf-berlinmitte.mp4',
    poster: '/medien/kopf-berlinmitte.jpg',
    megabyte: 5.4,
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
 * Videos, die zu einer Behandlung gehören statt zu einem Ort.
 *
 * Noch nicht eingebunden – erst mit den Seiten, auf die sie gehören. Beide
 * sind im Backup namentlich bekannt, aber auf ku64.de nicht öffentlich
 * ausgespielt; sie kommen aus dem Backup und nicht aus dem Netz. Das
 * Cad-Cam-Video braucht dieselbe Behandlung wie die Kopfvideos, 29,7 MB
 * liefert man niemandem aus.
 */
export const BEHANDLUNGSVIDEOS = [
  { quelle: 'Cad-Cam-2.mp4', megabyte: 29.7, thema: 'Fertigung im eigenen Meisterlabor' },
  { quelle: 'Zima-ultrasonic-cleaner.mp4', megabyte: 5.7, thema: 'Aufbereitung der Instrumente' },
];
