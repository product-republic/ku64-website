/**
 * Die Videos der Praxis – welche es gibt und wo sie stehen.
 *
 * ── Warum sie zurückkommen ──────────────────────────────────────────────
 *
 * Die alte Website bettete auf 89 Seiten YouTube ein. Im Neubau war davon
 * nichts übrig: `dienste.ts` führte YouTube als `verworfen` mit der
 * Begründung, die Videos lägen auf dem eigenen Server. Das stimmt für die
 * drei Kopfvideos der Standorte – und für die fünfzehn Filme des
 * KU64-Kanals stimmt es nicht. Sie sind zwischen zwei und zehn Minuten lang,
 * liegen nicht im Bestand und würden als Selbsthosting jede Seite
 * ausbremsen.
 *
 * ── Woher die Liste kommt ───────────────────────────────────────────────
 *
 * `analyse/altbestand/videos-holen.mjs` hat die 89 Seiten geholt und die
 * Kennungen aus den Einbettungen gelesen; die Titel kommen aus der
 * oEmbed-Schnittstelle. Ergebnis: 19 Kennungen, davon
 *
 *   15  abspielbar, alle vom Kanal „KU64 Zahnarzt" bzw. „Big Smile e.V."
 *    3  nicht abspielbar – zwei mit HTTP 403 (Einbetten gesperrt), eines
 *       mit HTTP 404 (gelöscht). Sie stehen heute als leerer Kasten auf
 *       ku64.de, unter anderem auf der Startseite.
 *    1  „Video Placeholder" – ein Rest des Seitenbaukastens Elementor
 *
 * Aufgenommen sind nur die fünfzehn. Ein Video, das nicht abspielt, ist im
 * Neubau kein Video, sondern eine Fläche mit einer Schaltfläche, die nichts
 * tut.
 *
 * ── Warum die Zuordnung teils eine andere ist ───────────────────────────
 *
 * Übernommen ist, wo die Praxis ein Video hingestellt hat. Zwei Ausnahmen
 * stehen unten bei den Einträgen: Das Porträt von Dr. Ziegler und der Film
 * über den Umbau standen auf Seiten, die es so nicht mehr gibt.
 *
 * ── Was NICHT hier steht ────────────────────────────────────────────────
 *
 * Die Kopfvideos der Standorte. Die liegen als MP4 im eigenen Bestand und
 * spielen ohne Einwilligung – siehe `medien.ts`. Sie sind kein Drittinhalt
 * und haben in dieser Datei nichts verloren.
 */

export interface Video {
  /** Kennung bei YouTube. Elf Zeichen, aus der alten Einbettung gelesen. */
  id: string;
  /**
   * Der Titel, den die Praxis vergeben hat – wortgleich aus oEmbed.
   *
   * Er steht auf der Schaltfläche, die das Video freigibt. Ein Knopf, der
   * nur „Video laden" heißt, sagt nicht, was geladen wird.
   */
  titel: string;
  /** Behandlungen, auf deren Seite es steht. Slugs aus `leistungen.ts`. */
  leistungen?: string[];
  /** Themen unter `/ueber-uns/`. Slugs aus `themen.ts`. */
  themen?: string[];
  /** Standorte, auf deren Seite es steht. */
  standorte?: string[];
  /** Steht auf der Startseite. */
  start?: boolean;
  /** Woher die Zuordnung kommt, wenn sie nicht die der alten Seite ist. */
  abweichung?: string;
}

export const VIDEOS: Video[] = [
  /* ── Behandlungen ─────────────────────────────────────────────────── */
  {
    id: 'Wq8qHQFIzHc',
    titel: 'Fester Zahnersatz auf Implantaten – von den KU64-Profis',
    leistungen: ['zahnimplantate', 'all-on-4'],
  },
  {
    id: '4uQ4-PxGy00',
    titel: 'Invisalign – die (fast) unsichtbare Zahnspange: wie sie funktioniert und was sie bringt',
    leistungen: ['aligner'],
  },
  {
    id: '434t6vWU7xY',
    titel: 'Bleaching bei KU64 – professionelle Zahnaufhellung',
    leistungen: ['zahnaufhellung'],
  },
  {
    id: '2Nj4RhEWaBo',
    titel: 'Die KU64-Wurzelkanalbehandlung ist einfühlsam und zertifiziert',
    leistungen: ['wurzelkanalbehandlung'],
  },
  {
    id: 'H5rZlJahXlI',
    titel:
      'Warum ist die KU64-Prophylaxe so gut? Normale Zahnreinigung im Vergleich mit AirFlow (GBT by EMS)',
    leistungen: ['prophylaxe-4-0', 'professionelle-zahnreinigung'],
  },
  {
    id: '13d84kubM2g',
    titel: 'Angstfrei beim Zahnarzt – ein Film aus der Praxis am Kurfürstendamm',
    leistungen: ['zahnarztangst'],
  },

  /* ── Das Haus ─────────────────────────────────────────────────────── */
  {
    id: 'uF_XiHk2qXo',
    titel: 'Zahnarzt Dr. Stephan Ziegler im Videoporträt',
    themen: ['uebersicht'],
  },
  {
    id: 'eN3NMkTVjPs',
    titel:
      'KU64-Inhaber Dr. Stephan Ziegler erklärt, was Berlins größte Zahnarztpraxis einzigartig macht',
    start: true,
  },
  {
    id: 'AzLK39ecthQ',
    titel: 'KU64 – Berlins bekannteste und außergewöhnlichste Zahnarztpraxis',
    themen: ['location'],
    abweichung:
      'Stand auf /blog/social-media-2024/, einer Sammelseite für Beiträge aus den sozialen ' +
      'Netzen. Der Film zeigt die Räume und gehört damit zur Architektur.',
  },
  {
    id: 'PSF1lx3Jcos',
    titel: 'KU64 Opening: Deutschlands größte Zahnarztpraxis jetzt noch moderner',
    leistungen: ['kinderzahnarzt'],
    themen: ['location'],
    abweichung:
      'Stand nur auf /leistungen/kinderzahnarzt/. Es geht um den Umbau des ganzen Hauses – ' +
      'deshalb zusätzlich bei der Architektur. Auf der Kinderseite bleibt es, weil die ' +
      'Kinderabteilung darin vorkommt.',
  },

  /* ── Standorte ────────────────────────────────────────────────────── */
  {
    id: '9nQD9nEWyRw',
    titel: 'KU64 – Potsdams neue und innovative Zahnarztpraxis in der Berliner Straße 139',
    standorte: ['potsdam'],
  },

  /* ── Engagement ───────────────────────────────────────────────────── */
  {
    id: 'muaxpuOsZHU',
    titel:
      'Ehrenamtliches Projekt von KU64 in Paternoster, Südafrika – in Kooperation mit Big Smile e. V.',
    themen: ['hilfsprojekt-suedafrika', 'soziales-engagement'],
  },
  {
    id: 'LCAqQ5QSlIA',
    titel: 'KU64 behandelte im Januar 2017 zum siebten Mal südafrikanische Schulkinder in Paternoster',
    themen: ['hilfsprojekt-suedafrika'],
  },
  {
    id: 'OZIRhNtACsk',
    titel: 'Flohmarkt zugunsten von Südafrika in der Zahnarztpraxis KU64',
    themen: ['soziales-engagement'],
    abweichung:
      'Stand auf /ueber-uns/hilfsprojekt-suedafrika/. Ein Flohmarkt in Berlin ist eine ' +
      'Aktion des sozialen Engagements und nicht Teil der Behandlungsreise.',
  },
  {
    id: 'CbANJM0jCUk',
    titel: 'Big Smile e. V. und Axel Schulz in Afrika (2024)',
    themen: ['hilfsprojekt-suedafrika'],
    abweichung:
      'Stand auf /blog/social-media-2024/. Der Film gehört zum Hilfsprojekt; der Kanal ist ' +
      'der von Big Smile e. V. und nicht der von KU64.',
  },
];

/** Die Videos zu einer Behandlung. */
export function videosZuLeistung(slug: string): Video[] {
  return VIDEOS.filter((v) => v.leistungen?.includes(slug));
}

/** Die Videos zu einem Über-uns-Thema. */
export function videosZuThema(slug: string): Video[] {
  return VIDEOS.filter((v) => v.themen?.includes(slug));
}

/** Die Videos zu einem Standort. */
export function videosZuStandort(slug: string): Video[] {
  return VIDEOS.filter((v) => v.standorte?.includes(slug));
}

/** Die Videos der Startseite. */
export function videosStart(): Video[] {
  return VIDEOS.filter((v) => v.start);
}

/**
 * Die Adresse zum Einbetten – ohne Cookie, ohne verwandte Videos.
 *
 * `youtube-nocookie.com` setzt beim reinen Abspielen keine Werbekennung.
 * Das ersetzt die Einwilligung nicht – es gibt weiterhin eine Verbindung zu
 * Google, IP-Adresse eingeschlossen –, aber es ist die sparsamere von zwei
 * Möglichkeiten, und die zu nehmen kostet nichts.
 *
 * `rel=0` hält die Vorschläge am Ende innerhalb desselben Kanals. Ohne den
 * Parameter zeigt YouTube fremde Videos in der Praxis-Seite an, und dafür
 * hat niemand zugestimmt.
 */
export function einbettung(v: Video): string {
  return `https://www.youtube-nocookie.com/embed/${v.id}?rel=0&modestbranding=1`;
}
