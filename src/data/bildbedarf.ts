/**
 * Welche Fotos die Website braucht – und was auf ihnen zu sehen sein soll.
 *
 * ── Warum das eine Datei im Projekt ist und keine Mail ──────────────────
 *
 * Weil eine Liste in einer Mail veraltet, sobald sich die Website ändert,
 * und weil niemand merkt, dass sie veraltet ist. Diese Liste steht dort, wo
 * die Bilder eingebaut werden. Aus ihr entstehen drei Dinge:
 *
 *   1. Die Platzhalter auf den Seiten – mit genau der Bildbeschreibung, die
 *      hier steht. Wer die Website ansieht, sieht damit auch die Lücke und
 *      weiß, was hineingehört.
 *   2. `BILDER-BEDARF.md`, die Liste zum Weitergeben – erzeugt von
 *      `npm run bilder:liste`, nicht von Hand geschrieben.
 *   3. Die Prüfung beim Bauen: Ein Platzhalter, der auf kein hier
 *      vermerktes Motiv zeigt, bricht den Build.
 *
 * ── Warum Platzhalter und nicht „einfach nichts“ ────────────────────────
 *
 * Bisher galt: kein Nachweis, kein Bild – die Stelle blieb leer. Das ist
 * richtig gegen Stock-Fotos und falsch gegen Vergessen. Eine leere Stelle
 * sieht aus wie eine Gestaltungsentscheidung; ein Platzhalter sieht aus wie
 * eine Lücke, und genau das ist er.
 *
 * Der Platzhalter darf dabei unter keinen Umständen wie ein Foto aussehen.
 * Er ist eine getönte Fläche mit der Bildbeschreibung darin – niemand kann
 * ihn versehentlich für das fertige Bild halten und niemand kann eine Seite
 * mit Platzhaltern versehentlich live stellen und es für fertig halten.
 *
 * ── Keine Stock-Fotos, auch nicht als Übergang ──────────────────────────
 *
 * Ausdrücklich verabredet. Ein Stock-Foto einer fremden Praxis auf der Seite
 * einer echten ist eine Aussage über die echte, und zwar keine gute.
 */

export type Dringlichkeit = 'hoch' | 'mittel' | 'niedrig';

export interface Bildbedarf {
  /** Derselbe Schlüssel, unter dem das Foto später im Bildverzeichnis steht. */
  schluessel: string;
  /** Was zu sehen sein soll – erscheint wörtlich im Platzhalter. */
  motiv: string;
  /** Wo es erscheint. Für die Liste zum Weitergeben. */
  wo: string;
  /**
   * Wie viele Seiten daran hängen. Ein Motiv, das auf 140 Seiten steht, ist
   * dringender als eines auf einer – auch wenn beide gleich schön wären.
   */
  dringlich: Dringlichkeit;
  /** Ungefähres Seitenverhältnis, damit der Zuschnitt beim Fotografieren stimmt. */
  format: 'quer' | 'hoch' | 'quadrat';
  /** Hinweise zur Aufnahme, wo sie nicht offensichtlich sind. */
  hinweis?: string;
}

/**
 * Motive je Behandlungsbereich statt je Behandlung.
 *
 * 35 Behandlungen einzeln zu bebildern hieße 35 Fototermine. Die Bereiche
 * sind zehn, und innerhalb eines Bereichs sieht die Situation im Raum
 * ohnehin gleich aus: Eine Prophylaxesitzung unterscheidet sich im Bild
 * nicht danach, ob sie „professionelle Zahnreinigung“ oder „Prophylaxe 4.0“
 * heißt.
 */
export const BEREICHSMOTIVE: Bildbedarf[] = [
  {
    schluessel: 'bereich-vorsorge',
    motiv: 'Prophylaxesitzung: Dentalhygienikerin am Stuhl, Patient entspannt, helles Behandlungszimmer',
    wo: 'Kopf aller Vorsorge- und Prophylaxeseiten',
    dringlich: 'hoch',
    format: 'quer',
    hinweis: 'Keine Nahaufnahme im Mund – gezeigt wird die Situation, nicht der Befund.',
  },
  {
    schluessel: 'bereich-aesthetik',
    motiv: 'Farbbestimmung mit Zahnfarbschlüssel oder Blick auf ein fertiges Ergebnis im Handspiegel',
    wo: 'Kopf aller Seiten zu ästhetischer Zahnmedizin',
    dringlich: 'hoch',
    format: 'quer',
  },
  {
    schluessel: 'bereich-zahnersatz',
    motiv: 'Meisterlabor am Kurfürstendamm: Zahntechnikerin bei der Arbeit an einer Krone',
    wo: 'Kopf aller Zahnersatzseiten',
    dringlich: 'hoch',
    format: 'quer',
    hinweis: 'Das eigene Labor ist ein Alleinstellungsmerkmal – es soll erkennbar das eigene sein.',
  },
  {
    schluessel: 'bereich-implantologie',
    motiv: 'Implantatplanung am Bildschirm: DVT-Aufnahme, Behandler erklärt sie einem Patienten',
    wo: 'Kopf aller Implantatseiten',
    dringlich: 'hoch',
    format: 'quer',
    hinweis: 'Erklärsituation, kein OP-Bild. Wer über Implantate liest, ist unsicher genug.',
  },
  {
    schluessel: 'bereich-zahnerhalt',
    motiv: 'Behandler mit Lupenbrille am Mikroskop, konzentrierte Arbeitssituation',
    wo: 'Kopf aller Zahnerhalt-Seiten (Wurzelkanal, Parodontitis, Füllungen)',
    dringlich: 'hoch',
    format: 'quer',
  },
  {
    schluessel: 'bereich-kieferorthopaedie',
    motiv: 'Aligner-Schiene in der Hand oder Einsetzen einer Schiene, freundliche Situation',
    wo: 'Kopf aller kieferorthopädischen Seiten',
    dringlich: 'hoch',
    format: 'quer',
  },
  {
    schluessel: 'bereich-chirurgie',
    motiv: 'Vorbereiteter chirurgischer Arbeitsplatz oder Aufklärungsgespräch am Modell',
    wo: 'Kopf aller oralchirurgischen Seiten',
    dringlich: 'mittel',
    format: 'quer',
    hinweis: 'Nichts Blutiges, nichts Instrumentenlastiges. Angst ist hier der Normalfall.',
  },
  {
    schluessel: 'bereich-kinder',
    motiv: 'Kinderbereich: Kind auf dem Behandlungsstuhl, entspannt, mit Betreuung',
    wo: 'Kopf aller Kinderzahnheilkunde-Seiten',
    dringlich: 'hoch',
    format: 'quer',
    hinweis:
      'Einwilligung der Eltern schriftlich erforderlich. Ohne sie: Kinderbereich ohne Kinder.',
  },
  {
    schluessel: 'bereich-funktion',
    motiv: 'Funktionsanalyse: Behandler tastet die Kiefergelenke, oder Knirscherschiene in der Hand',
    wo: 'Kopf aller CMD- und Funktionsseiten',
    dringlich: 'mittel',
    format: 'quer',
  },
  {
    schluessel: 'bereich-angst',
    motiv: 'Ruhiges Vorgespräch im Sitzen, nicht am Behandlungsstuhl – Augenhöhe',
    wo: 'Kopf aller Seiten zu Angstpatienten, Narkose, Lachgas',
    dringlich: 'hoch',
    format: 'quer',
    hinweis:
      'Das wichtigste Bild der Website. Wer hier liest, entscheidet, ob er überhaupt kommt.',
  },
];

/**
 * Motive für einzelne Seiten.
 *
 * Hier gibt es keine Gruppe, zu der sie gehören – jede dieser Seiten hat
 * eine Aufgabe, die kein anderes Bild erfüllt.
 */
export const SEITENMOTIVE: Bildbedarf[] = [
  {
    schluessel: 'start-kopf',
    motiv: 'Die gelbe Landschaft am Kurfürstendamm, weit, ohne Menschen im Vordergrund',
    wo: 'Startseite, oberster Bereich',
    dringlich: 'hoch',
    format: 'quer',
    hinweis: 'Liegt teils vor (Kopfvideos). Ein Standbild in hoher Auflösung fehlt.',
  },
  {
    schluessel: 'ueber-uns',
    motiv: 'Gruppenaufnahme des Teams oder die Praxisarchitektur als Ganzes',
    wo: 'Über KU64',
    dringlich: 'mittel',
    format: 'quer',
  },
  {
    schluessel: 'karriere',
    motiv: 'Kolleginnen und Kollegen im Alltag – Übergabe, Besprechung, Ausbildungssituation',
    wo: 'Karriereseite',
    dringlich: 'mittel',
    format: 'quer',
    hinweis: 'Wer sich bewirbt, sucht Kolleginnen und Kollegen, keine Räume.',
  },
  {
    schluessel: 'notfall',
    motiv: 'Empfang mit Ansprechperson, freundlich und erreichbar wirkend',
    wo: 'Notfallseite',
    dringlich: 'mittel',
    format: 'quer',
    hinweis: 'Nichts Dramatisches. Die Seite soll beruhigen, nicht die Lage bebildern.',
  },
  {
    schluessel: 'beratung',
    motiv: 'Beratungssituation am Bildschirm, Behandler und Patient gemeinsam davor',
    wo: 'Digitale Beratung',
    dringlich: 'niedrig',
    format: 'quer',
  },
  {
    schluessel: 'termine',
    motiv: 'Empfangstresen mit Terminvergabe',
    wo: 'Terminseite',
    dringlich: 'niedrig',
    format: 'quer',
  },
  {
    schluessel: 'labor',
    motiv: 'Meisterlabor: Arbeitsplatz mit Zahntechnik, Werkstücke erkennbar',
    wo: 'Über KU64, Zahnersatzseiten',
    dringlich: 'mittel',
    format: 'quer',
  },
];

/**
 * Was je Standort fehlt.
 *
 * Kurfürstendamm ist gut versorgt – fünf Aufnahmen liegen vor. Für
 * Berlin-Mitte gibt es drei, für Potsdam zwei, für die KiezPraxis in
 * Wilmersdorf eine einzige Außenansicht. Das sieht man der Website an: Die
 * Standortseiten sind unterschiedlich lebendig, und das hat nichts mit den
 * Standorten zu tun.
 */
export const STANDORTMOTIVE: Bildbedarf[] = [
  {
    schluessel: 'potsdam-behandlungszimmer',
    motiv: 'Behandlungszimmer im Palais Ritz, hell, mit Blick nach draußen',
    wo: 'Standortseite Potsdam',
    dringlich: 'hoch',
    format: 'quer',
  },
  {
    schluessel: 'potsdam-aussenansicht',
    motiv: 'Palais Ritz von außen, Berliner Straße 139',
    wo: 'Standortseite und Anfahrt Potsdam',
    dringlich: 'mittel',
    format: 'quer',
  },
  {
    schluessel: 'berlinmitte-behandlungszimmer',
    motiv: 'Behandlungszimmer am Hausvogteiplatz',
    wo: 'Standortseite Berlin-Mitte',
    dringlich: 'hoch',
    format: 'quer',
  },
  {
    schluessel: 'berlinmitte-aussenansicht',
    motiv: 'Eingang Hausvogteiplatz 14, sodass man ihn wiedererkennt',
    wo: 'Standortseite und Anfahrt Berlin-Mitte',
    dringlich: 'mittel',
    format: 'quer',
  },
  {
    schluessel: 'wilmersdorf-empfang',
    motiv: 'Empfang der KiezPraxis, Gasteiner Straße 9',
    wo: 'Standortseite Wilmersdorf',
    dringlich: 'hoch',
    format: 'quer',
  },
  {
    schluessel: 'wilmersdorf-wartebereich',
    motiv: 'Wartebereich der KiezPraxis',
    wo: 'Standortseite Wilmersdorf',
    dringlich: 'hoch',
    format: 'quer',
  },
  {
    schluessel: 'wilmersdorf-behandlungszimmer',
    motiv: 'Behandlungszimmer der KiezPraxis',
    wo: 'Standortseite Wilmersdorf',
    dringlich: 'hoch',
    format: 'quer',
  },
];

export const BILDBEDARF: Bildbedarf[] = [
  ...BEREICHSMOTIVE,
  ...SEITENMOTIVE,
  ...STANDORTMOTIVE,
];

export function bedarfFuer(schluessel: string): Bildbedarf | undefined {
  return BILDBEDARF.find((b) => b.schluessel === schluessel);
}

/**
 * Der Bereichsschlüssel zu einer Behandlungskategorie.
 *
 * Eine Funktion und keine Tabelle, damit eine neue Kategorie automatisch
 * einen Platzhalter bekommt statt still ohne Bild zu bleiben.
 */
export function bereichsbild(kategorieSlug: string): string {
  return `bereich-${kategorieSlug}`;
}
