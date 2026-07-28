/**
 * Einzige Quelle für Standortdaten.
 *
 * ── Herkunft: jetzt ku64.de selbst ──────────────────────────────────────
 *
 * Ursprünglich stammten Telefonnummern und Öffnungszeiten aus öffentlichen
 * Verzeichnissen (Doctolib, Gelbe Seiten, Presseportal), weil ku64.de nicht
 * abrufbar war. Inzwischen ist es das, und alle vier Standorte sind gegen
 * die dortigen Angaben abgeglichen – gegen die sichtbaren Zeiten und gegen
 * die strukturierten Daten im Seitenkopf.
 *
 * Dabei kamen drei Fehler heraus, und zwar keine kleinen:
 *
 *   1. Die KiezPraxis in Wilmersdorf hatte die Nummer des Kurfürstendamms.
 *      Sie hat eine eigene: 030 439742530, dazu eine eigene Adresse
 *      kiezpraxis@ku64.de.
 *   2. Ihre Öffnungszeiten waren frei erfunden (Mo–Do 8–19, Fr 8–16).
 *      Tatsächlich: Mo, Mi, Fr 8–20, Di und Do 8–14, Samstag nach
 *      Vereinbarung.
 *   3. Potsdam versprach feste Wochenendzeiten (Sa 9–19, So 10–18). Dort
 *      gilt am Wochenende „nach Vereinbarung". Wer sich darauf verlassen
 *      hätte, wäre vor einer verschlossenen Tür gestanden – mit Schmerzen,
 *      an einem Sonntag.
 *
 * Kurfürstendamm und Berlin-Mitte stimmten.
 *
 * ── Was weiterhin zu bestätigen ist ─────────────────────────────────────
 *
 * Die Gründungsdaten. Sie stehen in keiner strukturierten Quelle und
 * stammen aus Presseberichten. Sie erscheinen nur auf „Über KU64" und
 * richten niemanden falsch – deshalb kein `zuPruefen` mehr, sondern dieser
 * Absatz.
 */

export type Wochentag = 'Mo' | 'Di' | 'Mi' | 'Do' | 'Fr' | 'Sa' | 'So';

export interface Oeffnungszeit {
  tag: Wochentag;
  von: string | null;
  bis: string | null;
  /**
   * „Nach Vereinbarung“ – geöffnet, aber nicht ohne Termin.
   *
   * Ein dritter Zustand neben „von–bis“ und „geschlossen“, und er ist
   * notwendig: Potsdam und die KiezPraxis behandeln am Wochenende
   * beziehungsweise am Samstag, aber nur mit Voranmeldung. Als feste Zeit
   * dargestellt wäre das ein Versprechen, das die Praxis nicht gibt; als
   * „geschlossen“ eine Auskunft, die Menschen abhält, die einen Termin
   * bekommen hätten.
   */
  nachVereinbarung?: boolean;
}

export interface Standort {
  /** URL-Slug. Bewusst identisch mit dem Altbestand, damit keine Redirects nötig sind. */
  slug: string;
  /** Kurzname für Navigation und Standortwechsler. */
  name: string;
  /** Vollständiger Name für Titel und Schema.org. */
  nameLang: string;
  /** Ein Satz, der diesen Standort von den anderen unterscheidet. */
  claim: string;
  strasse: string;
  plz: string;
  ort: string;
  bezirk: string | null;
  /**
   * Ortsangabe, wie sie in Überschriften und Titeln erscheint.
   *
   * Bewusst ein eigenes Feld statt `Ort + Bindestrich + Bezirk`: Diese Regel
   * ergibt in Berlin "Berlin-Charlottenburg", in Potsdam aber
   * "Potsdam-Berliner Vorstadt" – schlechtes Deutsch, und danach sucht
   * niemand. Wie ein Ort benannt wird, ist eine redaktionelle Entscheidung,
   * keine String-Verkettung.
   */
  ortsname: string;
  telefon: string;
  telefonRaw: string;
  email: string;
  geo: { lat: number; lng: number };
  oeffnungszeiten: Oeffnungszeit[];
  /** Frei formulierter Hinweis, falls die Zeiten Ausnahmen haben. */
  zeitenHinweis?: string;
  eroeffnet: string;
  /**
   * ENTFÄLLT – die Zahl wird gerechnet, nicht gepflegt.
   *
   * Hier stand einmal `anzahlZahnaerzte: 21`. Solche Zahlen altern lautlos:
   * Jemand kommt dazu, und die 21 bleibt auf der Standortseite, in der
   * Meta-Description, im Vorschaubild und in der Chatbot-Auskunft stehen.
   * Die Zahl kommt jetzt aus team.ts – siehe anzahlBehandelnde().
   */
  /** Was diesen Standort besonders macht – wird auf der Standortseite ausgespielt. */
  besonderheiten: string[];
  anfahrt: {
    oepnv: string[];
    parken: string;
    barrierefrei: boolean;
    barrierefreiHinweis?: string;
  };
  /**
   * Doctolib-Kalender. Ein Standort kann mehrere haben (z. B. KFO separat).
   *
   * `stadt` gehört zwingend dazu: Die Adresse lautet
   * `doctolib.de/zahnarztpraxis/<stadt>/<slug>`. Ohne die Stadt antwortet
   * Doctolib mit einer Weiterleitung oder gar nicht – das war der Grund,
   * warum die Terminbuchung ins Leere lief.
   */
  doctolib: { label: string; slug: string; stadt: string }[];
  /**
   * Farbakzent des Standorts.
   *
   * Steht bei allen Standorten auf der Hausfarbe. Eine eigene Farbe je
   * Standort war eine gestalterische Idee und ein Markenfehler: KU64 ist eine
   * Marke mit vier Adressen, keine vier Marken. Wer in Potsdam Goldbraun und
   * am Kurfürstendamm Orange sieht, hält es für zwei Praxen.
   *
   * Das Feld bleibt bestehen, weil die Orientierung ein echtes Bedürfnis ist –
   * sie wird jetzt aber über den Standortnamen in der Leiste gelöst, nicht
   * über die Farbe.
   */
  akzent: string;
  zuPruefen: boolean;
}

/** Kurfürstendamm und Berlin-Mitte: auch am Wochenende zu festen Zeiten. */
const ZEITEN_LANG: Oeffnungszeit[] = [
  { tag: 'Mo', von: '08:00', bis: '20:00' },
  { tag: 'Di', von: '08:00', bis: '20:00' },
  { tag: 'Mi', von: '08:00', bis: '20:00' },
  { tag: 'Do', von: '08:00', bis: '20:00' },
  { tag: 'Fr', von: '08:00', bis: '20:00' },
  { tag: 'Sa', von: '09:00', bis: '19:00' },
  { tag: 'So', von: '10:00', bis: '18:00' },
];

/**
 * Potsdam: unter der Woche wie die anderen, am Wochenende nach Vereinbarung.
 *
 * Bis eben stand hier ZEITEN_LANG, und die Seite versprach damit feste
 * Wochenendzeiten. Auf ku64.de/potsdam/ steht wörtlich „Samstag: nach
 * Vereinbarung / Sonntag: nach Vereinbarung“. Der Unterschied ist keine
 * Feinheit: Wer sich auf 10 Uhr am Sonntag verlassen hätte, wäre mit
 * Schmerzen vor einer verschlossenen Tür gestanden.
 */
const ZEITEN_POTSDAM: Oeffnungszeit[] = [
  { tag: 'Mo', von: '08:00', bis: '20:00' },
  { tag: 'Di', von: '08:00', bis: '20:00' },
  { tag: 'Mi', von: '08:00', bis: '20:00' },
  { tag: 'Do', von: '08:00', bis: '20:00' },
  { tag: 'Fr', von: '08:00', bis: '20:00' },
  { tag: 'Sa', von: null, bis: null, nachVereinbarung: true },
  { tag: 'So', von: null, bis: null, nachVereinbarung: true },
];

export const STANDORTE: Standort[] = [
  /*
   * Die Reihenfolge dieser Liste ist die Reihenfolge überall: auf der
   * Startseite, in der Fußzeile, im Standortwähler, in der Sitemap.
   *
   * Sie folgt nicht der Geografie und nicht dem Alphabet, sondern der
   * Bedeutung für die Praxis: Der Kurfürstendamm ist die Hauptpraxis,
   * Potsdam die zweite vollwertige Adresse, Berlin-Mitte die Boutique-Praxis,
   * die KiezPraxis in Wilmersdorf die jüngste und kleinste.
   *
   * Wer hier umsortiert, sortiert die gesamte Website um – das ist Absicht.
   * Vier Standorte an sechs Stellen einzeln zu sortieren wäre die
   * zuverlässigste Art, dass sie irgendwann verschieden sortiert sind.
   */
  {
    slug: 'berlin-charlottenburg',
    name: 'Kurfürstendamm',
    nameLang: 'KU64 Berlin Charlottenburg – Kurfürstendamm',
    claim:
      'Die Hauptpraxis: alle zahnmedizinischen Spezialisierungen unter einem Dach, sieben Tage die Woche.',
    strasse: 'Kurfürstendamm 64',
    plz: '10707',
    ort: 'Berlin',
    bezirk: 'Charlottenburg-Wilmersdorf',
    ortsname: 'Berlin-Charlottenburg',
    telefon: '030 86 47 320',
    telefonRaw: '+493086473 20',
    email: 'info@ku64.de',
    geo: { lat: 52.4979, lng: 13.3157 },
    oeffnungszeiten: ZEITEN_LANG,
    eroeffnet: '2005-07',
    besonderheiten: [
      'Größte Zahnarztpraxis Deutschlands mit allen Fachbereichen an einem Ort',
      'Eigenes zahntechnisches Meisterlabor im Haus',
      'Sieben Tage die Woche geöffnet – auch sonntags',
      'Eigene Kieferorthopädie mit separater Terminvergabe',
      'Leistung von Angstpatientinnen und -patienten inklusive Sedierung',
    ],
    anfahrt: {
      oepnv: [
        'U-Bahn U1 Uhlandstraße (3 Gehminuten)',
        'U-Bahn U3/U9 Spichernstraße (8 Gehminuten)',
        'Bus M19, M29, X10 Kurfürstendamm/Adenauerplatz',
      ],
      parken: 'Parkhaus Ku’damm-Karree und Parkplätze am Adenauerplatz in unmittelbarer Nähe.',
      barrierefrei: true,
    },
    doctolib: [
      { label: 'Zahnmedizin', slug: 'ku64-berlin', stadt: 'berlin' },
      { label: 'Kieferorthopädie', slug: 'ku64-kieferorthopaedie', stadt: 'berlin' },
    ],
    akzent: '#FFCC00',
    zuPruefen: false,
  },
  {
    slug: 'potsdam',
    name: 'Potsdam',
    nameLang: 'KU64 Potsdam – Zahnarzt im Palais Ritz',
    claim:
      'Zahnmedizin im denkmalgeschützten Palais Ritz: das volle Spektrum, direkt an der Berliner Straße.',
    strasse: 'Berliner Straße 139',
    plz: '14467',
    ort: 'Potsdam',
    bezirk: 'Berliner Vorstadt',
    ortsname: 'Potsdam',
    telefon: '0331 98 22 22 80',
    telefonRaw: '+493319822 2280',
    email: 'potsdam@ku64.de',
    geo: { lat: 52.3944, lng: 13.0817 },
    oeffnungszeiten: ZEITEN_POTSDAM,
    eroeffnet: '2019',
    besonderheiten: [
      'Praxis im denkmalgeschützten Palais Ritz – historische Hülle, moderne Zahnmedizin',
      'Montag bis Freitag von 8 bis 20 Uhr, am Wochenende nach Vereinbarung',
      'Vollständiges Leistungsspektrum von Prophylaxe bis Implantologie',
      'Eigene Oralchirurgie für Weisheitszähne und operative Eingriffe',
      'Digitale Anamnese vorab von zu Hause – ohne Papier im Wartezimmer',
    ],
    anfahrt: {
      oepnv: [
        'Tram 93, 99 Berliner Straße/Große Weinmeisterstraße (2 Gehminuten)',
        'Bus 693 Schloss Cecilienhof',
        'S-Bahn S7 Potsdam Griebnitzsee (mit Bus 10 Minuten)',
      ],
      parken: 'Eigene Parkplätze am Haus sowie Parkmöglichkeiten in der Berliner Straße.',
      barrierefrei: true,
    },
    doctolib: [{ label: 'Zahnmedizin', slug: 'ku64-die-zahnspezialisten', stadt: 'potsdam' }],
    akzent: '#FFCC00',
    zuPruefen: false,
  },
  {
    slug: 'berlinmitte',
    name: 'Berlin-Mitte',
    nameLang: 'KU64 Berlin-Mitte – Hausvogteiplatz',
    claim:
      'Boutique-Praxis am Hausvogteiplatz: Ästhetik, Prophylaxe und Implantologie in ruhigem Ambiente.',
    strasse: 'Hausvogteiplatz 14',
    plz: '10117',
    ort: 'Berlin',
    bezirk: 'Mitte',
    ortsname: 'Berlin-Mitte',
    telefon: '030 50 93 04 280',
    telefonRaw: '+4930509304280',
    email: 'berlinmitte@ku64.de',
    geo: { lat: 52.5136, lng: 13.3949 },
    oeffnungszeiten: ZEITEN_LANG,
    zeitenHinweis:
      'Die Sprechzeiten am Hausvogteiplatz können von der Hauptpraxis abweichen – bitte vor dem Besuch bestätigen lassen.',
    eroeffnet: '2023-01',
    besonderheiten: [
      'Boutique-Atmosphäre mit dem Charakter eines Design-Hotels',
      'Schwerpunkt auf ästhetischer Zahnmedizin und Bleaching',
      'Zentrale Lage zwischen Gendarmenmarkt und Spittelmarkt',
      'Kurze Wege für Berufstätige – Termine bis in den Abend',
    ],
    anfahrt: {
      oepnv: [
        'U-Bahn U2 Hausvogteiplatz (direkt vor der Tür)',
        'U-Bahn U2/U6 Stadtmitte (5 Gehminuten)',
        'Bus 265 Hausvogteiplatz',
      ],
      parken: 'Öffentliche Tiefgaragen am Gendarmenmarkt und in der Mohrenstraße.',
      barrierefrei: true,
    },
    doctolib: [{ label: 'Zahnmedizin', slug: 'ku64-berlin-hausvogteiplatz', stadt: 'berlin' }],
    akzent: '#FFCC00',
    zuPruefen: false,
  },
  {
    slug: 'wilmersdorf',
    name: 'Wilmersdorf',
    nameLang: 'KU64 – DIE KIEZPRAXIS in Berlin-Wilmersdorf',
    claim:
      'Klein, familiär, im Kiez verwurzelt: persönliche Zahnmedizin mit der Technik der Hauptpraxis im Rücken.',
    strasse: 'Gasteiner Straße 9',
    plz: '10717',
    ort: 'Berlin',
    bezirk: 'Wilmersdorf',
    ortsname: 'Berlin-Wilmersdorf',
    /* Eigene Durchwahl, nicht die des Kurfürstendamms – siehe Kopfkommentar. */
    telefon: '030 43 97 42 530',
    telefonRaw: '+493043974253 0',
    email: 'kiezpraxis@ku64.de',
    geo: { lat: 52.4863, lng: 13.3232 },
    oeffnungszeiten: [
      /* Mo, Mi, Fr lang – Di und Do nur bis 14 Uhr. Die KiezPraxis ist die
         kleinste der vier und hat deshalb als einzige unterschiedliche Tage. */
      { tag: 'Mo', von: '08:00', bis: '20:00' },
      { tag: 'Di', von: '08:00', bis: '14:00' },
      { tag: 'Mi', von: '08:00', bis: '20:00' },
      { tag: 'Do', von: '08:00', bis: '14:00' },
      { tag: 'Fr', von: '08:00', bis: '20:00' },
      { tag: 'Sa', von: null, bis: null, nachVereinbarung: true },
      { tag: 'So', von: null, bis: null },
    ],
    zeitenHinweis:
      'Öffnungszeiten der KiezPraxis sind noch nicht final bestätigt – bitte vor Veröffentlichung prüfen.',
    eroeffnet: '2026-01-05',
    besonderheiten: [
      'Nachbarschaftspraxis mit persönlicher Betreuung und festen Ansprechpartnern',
      'Tochterpraxis der KU64 am Kurfürstendamm – gleiche Qualitätsstandards',
      'Kurze Wartezeiten und ruhige Behandlungsatmosphäre',
      'Rückgriff auf alle Spezialisten der Hauptpraxis bei komplexen Fällen',
    ],
    anfahrt: {
      oepnv: [
        'U-Bahn U7 Blissestraße (4 Gehminuten)',
        'U-Bahn U3/U7 Fehrbelliner Platz (7 Gehminuten)',
        'Bus 101, 104 Blissestraße',
      ],
      parken: 'Anwohnerparken in der Gasteiner Straße, Parkhaus am Fehrbelliner Platz.',
      barrierefrei: false,
      barrierefreiHinweis:
        'Bitte melden Sie sich vorab, wenn Sie einen barrierefreien Zugang benötigen – wir finden gemeinsam eine Lösung oder vermitteln an den Kurfürstendamm.',
    },
    doctolib: [{ label: 'Zahnmedizin', slug: 'ku64-berlin-gasteiner-strasse-9-die-kiezpraxis', stadt: 'berlin' }],
    akzent: '#FFCC00',
    zuPruefen: false,
  },
];

export const STANDORT_SLUGS = STANDORTE.map((s) => s.slug);

/**
 * Die Adresse eines Doctolib-Kalenders.
 *
 * An einer Stelle gebaut, nicht in jeder Vorlage neu zusammengesetzt: Die
 * Terminbuchung lief monatelang ins Leere, weil an der einen Stelle, an der
 * sie gebaut wurde, die Stadt fehlte. Ein Fehler an einem Ort ist ärgerlich –
 * derselbe Fehler an fünf Orten ist eine Suchaktion.
 *
 * `utm_source` bleibt dran, damit die Praxis in Doctolib sieht, wie viele
 * Buchungen von der eigenen Website kommen.
 */
export function doctolibAdresse(eintrag: { slug: string; stadt: string }): string {
  return `https://www.doctolib.de/zahnarztpraxis/${eintrag.stadt}/${eintrag.slug}?utm_source=ku64-website`;
}

export function getStandort(slug: string): Standort | undefined {
  return STANDORTE.find((s) => s.slug === slug);
}

/** Vollständige Anschrift in einer Zeile. */
export function adresseEinzeilig(s: Standort): string {
  return `${s.strasse}, ${s.plz} ${s.ort}`;
}

/**
 * Öffnungszeiten in dem Format, das Schema.org erwartet.
 * Geschlossene Tage werden weggelassen, statt sie mit leeren Zeiten auszugeben.
 */
export function oeffnungszeitenSchema(s: Standort) {
  const map: Record<Wochentag, string> = {
    Mo: 'Monday',
    Di: 'Tuesday',
    Mi: 'Wednesday',
    Do: 'Thursday',
    Fr: 'Friday',
    Sa: 'Saturday',
    So: 'Sunday',
  };
  return s.oeffnungszeiten
    .filter((z) => z.von && z.bis)
    .map((z) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${map[z.tag]}`,
      opens: z.von,
      closes: z.bis,
    }));
}

/** Ist der Standort zum übergebenen Zeitpunkt geöffnet? Für den "Jetzt geöffnet"-Hinweis. */
/**
 * Ist gerade offen?
 *
 * „Nach Vereinbarung“ zählt ausdrücklich NICHT als offen: Der grüne Punkt
 * neben der Telefonnummer heißt „jetzt anrufen und vorbeikommen“, und das
 * trifft dann nicht zu.
 */
export function istGeoeffnet(s: Standort, jetzt: Date): boolean {
  const tage: Wochentag[] = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const heute = s.oeffnungszeiten.find((z) => z.tag === tage[jetzt.getDay()]);
  if (!heute?.von || !heute.bis) return false;
  const minuten = jetzt.getHours() * 60 + jetzt.getMinutes();
  const [vh, vm] = heute.von.split(':').map(Number);
  const [bh, bm] = heute.bis.split(':').map(Number);
  return minuten >= vh * 60 + vm && minuten < bh * 60 + bm;
}

/**
 * Eine Zeile Öffnungszeit, wie sie dasteht.
 *
 * An einer Stelle statt an sechs. Vorher stand in jeder Vorlage
 * `z.von && z.bis ? … : 'geschlossen'` – als „nach Vereinbarung“ dazukam,
 * hätte das an sechs Stellen geändert werden müssen, und an der siebten
 * hätte es jemand vergessen.
 */
export function zeitLesbar(z: Oeffnungszeit): string {
  if (z.von && z.bis) return `${z.von} – ${z.bis}`;
  if (z.nachVereinbarung) return 'nach Vereinbarung';
  return 'geschlossen';
}

/** Tage, an denen behandelt wird – Termin nach Vereinbarung eingeschlossen. */
export function behandlungstage(s: Standort): number {
  return s.oeffnungszeiten.filter((z) => z.von || z.nachVereinbarung).length;
}
