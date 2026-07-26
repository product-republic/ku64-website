/**
 * Einzige Quelle für Standortdaten.
 *
 * ACHTUNG – Datenherkunft: Telefonnummern, Öffnungszeiten und Gründungsdaten
 * stammen aus öffentlichen Verzeichnissen (Doctolib, Gelbe Seiten, Presseportal),
 * weil ku64.de für diese Session nicht abrufbar war. Vor dem Live-Gang müssen
 * alle mit `zuPruefen: true` markierten Standorte gegen die Praxisdaten
 * abgeglichen werden. Siehe ANALYSE.md, Abschnitt "Offene Datenpunkte".
 */

export type Wochentag = 'Mo' | 'Di' | 'Mi' | 'Do' | 'Fr' | 'Sa' | 'So';

export interface Oeffnungszeit {
  tag: Wochentag;
  von: string | null;
  bis: string | null;
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
  anzahlZahnaerzte: number | null;
  /** Was diesen Standort besonders macht – wird auf der Standortseite ausgespielt. */
  besonderheiten: string[];
  anfahrt: {
    oepnv: string[];
    parken: string;
    barrierefrei: boolean;
    barrierefreiHinweis?: string;
  };
  /** Doctolib-Praxis-Slugs. Ein Standort kann mehrere Einträge haben (z. B. KFO separat). */
  doctolib: { label: string; slug: string }[];
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

const ZEITEN_LANG: Oeffnungszeit[] = [
  { tag: 'Mo', von: '08:00', bis: '20:00' },
  { tag: 'Di', von: '08:00', bis: '20:00' },
  { tag: 'Mi', von: '08:00', bis: '20:00' },
  { tag: 'Do', von: '08:00', bis: '20:00' },
  { tag: 'Fr', von: '08:00', bis: '20:00' },
  { tag: 'Sa', von: '09:00', bis: '19:00' },
  { tag: 'So', von: '10:00', bis: '18:00' },
];

export const STANDORTE: Standort[] = [
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
    anzahlZahnaerzte: 21,
    besonderheiten: [
      'Größte Zahnarztpraxis Deutschlands mit allen Fachbereichen an einem Ort',
      'Eigenes zahntechnisches Meisterlabor im Haus',
      'Sieben Tage die Woche geöffnet – auch sonntags',
      'Eigene Kieferorthopädie mit separater Terminvergabe',
      'Behandlung von Angstpatientinnen und -patienten inklusive Sedierung',
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
      { label: 'Zahnmedizin', slug: 'ku64-berlin' },
      { label: 'Kieferorthopädie', slug: 'ku64-kieferorthopaedie' },
    ],
    akzent: '#FFCC00',
    zuPruefen: true,
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
    anzahlZahnaerzte: 5,
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
    doctolib: [{ label: 'Zahnmedizin', slug: 'ku64-berlin-hausvogteiplatz' }],
    akzent: '#FFCC00',
    zuPruefen: true,
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
    telefon: '030 86 47 320',
    telefonRaw: '+4930864732 0',
    email: 'kiezpraxis@ku64.de',
    geo: { lat: 52.4863, lng: 13.3232 },
    oeffnungszeiten: [
      { tag: 'Mo', von: '08:00', bis: '19:00' },
      { tag: 'Di', von: '08:00', bis: '19:00' },
      { tag: 'Mi', von: '08:00', bis: '19:00' },
      { tag: 'Do', von: '08:00', bis: '19:00' },
      { tag: 'Fr', von: '08:00', bis: '16:00' },
      { tag: 'Sa', von: null, bis: null },
      { tag: 'So', von: null, bis: null },
    ],
    zeitenHinweis:
      'Öffnungszeiten der KiezPraxis sind noch nicht final bestätigt – bitte vor Veröffentlichung prüfen.',
    eroeffnet: '2026-01-05',
    anzahlZahnaerzte: null,
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
    doctolib: [{ label: 'Zahnmedizin', slug: 'ku64-berlin-gasteiner-strasse-9-die-kiezpraxis' }],
    akzent: '#FFCC00',
    zuPruefen: true,
  },
  {
    slug: 'potsdam',
    name: 'Potsdam',
    nameLang: 'KU64 Potsdam – Zahnarzt im Palais Ritz',
    claim:
      'Zahnmedizin im denkmalgeschützten Palais Ritz: das volle Spektrum, sieben Tage die Woche, direkt an der Berliner Straße.',
    strasse: 'Berliner Straße 139',
    plz: '14467',
    ort: 'Potsdam',
    bezirk: 'Berliner Vorstadt',
    ortsname: 'Potsdam',
    telefon: '0331 98 22 22 80',
    telefonRaw: '+493319822 2280',
    email: 'potsdam@ku64.de',
    geo: { lat: 52.3944, lng: 13.0817 },
    oeffnungszeiten: ZEITEN_LANG,
    eroeffnet: '2019',
    anzahlZahnaerzte: 12,
    besonderheiten: [
      'Praxis im denkmalgeschützten Palais Ritz – historische Hülle, moderne Zahnmedizin',
      'Sieben Tage die Woche geöffnet, auch am Wochenende',
      'Vollständiges Behandlungsspektrum von Prophylaxe bis Implantologie',
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
    doctolib: [{ label: 'Zahnmedizin', slug: 'ku64-die-zahnspezialisten' }],
    akzent: '#FFCC00',
    zuPruefen: true,
  },
];

export const STANDORT_SLUGS = STANDORTE.map((s) => s.slug);

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
export function istGeoeffnet(s: Standort, jetzt: Date): boolean {
  const tage: Wochentag[] = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const heute = s.oeffnungszeiten.find((z) => z.tag === tage[jetzt.getDay()]);
  if (!heute?.von || !heute.bis) return false;
  const minuten = jetzt.getHours() * 60 + jetzt.getMinutes();
  const [vh, vm] = heute.von.split(':').map(Number);
  const [bh, bm] = heute.bis.split(':').map(Number);
  return minuten >= vh * 60 + vm && minuten < bh * 60 + bm;
}
