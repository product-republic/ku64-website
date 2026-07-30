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
  /**
   * Wie viele Tage die Woche dieser Standort geöffnet ist – als Angabe, nicht
   * als Rechnung.
   *
   * Das war vorher eine Formel, und zwar zwei verschiedene: Die Notfallseite
   * zählte „fest ODER nach Vereinbarung“, Startseite und llms.txt nur „fest“.
   * Für Potsdam stand deshalb an einer Stelle „7 Tage/Woche geöffnet“ und an
   * der anderen „5“ – auf derselben Website, im selben Build, und über die
   * strukturierten Daten auch bei Google.
   *
   * Eine Formel kann den Fall aber gar nicht lösen, weil er keine
   * Rechenfrage ist: Potsdam behandelt Sa und So nach Vereinbarung und zählt
   * sie mit, die KiezPraxis behandelt samstags nach Vereinbarung und zählt
   * ihn bewusst NICHT mit – dort sind es fünf Tage, und der Samstag wird
   * gesondert genannt. Beides ist richtig, weil es zwei verschiedene
   * Aussagen der Praxis sind.
   *
   * Deshalb steht die Zahl hier, einmal, und alle Seiten lesen sie. Der
   * Datenwächter prüft nur noch, dass sie zwischen den fest geöffneten und
   * allen behandelten Tagen liegt – das fängt Tippfehler, ohne die
   * redaktionelle Entscheidung zu überschreiben.
   */
  oeffnungsangabe: { tage: number; zusatz?: string };
  /**
   * Portrait dieses Hauses – der Text, der es von den anderen unterscheidet.
   *
   * ── Warum es das gibt ───────────────────────────────────────────────────
   *
   * Die Standortseiten waren untereinander zu über 40 Prozent textgleich, bei
   * rund 200 Wörtern Umfang. Der Grund war nicht die Formulierung, sondern das
   * Fehlen von Inhalt: Auf keiner Seite stand etwas, das nur für diesen Ort
   * gilt. Adresse, Öffnungszeiten und Telefonnummer allein reichen nicht, um
   * vier Häuser zu unterscheiden – sie sind zu kurz.
   *
   * ── Was hier stehen darf ────────────────────────────────────────────────
   *
   * Nur Nachprüfbares. Jeder Satz stützt sich auf eine dieser Quellen:
   *
   *   · die Daten dieser Datei (Adresse, Zeiten, Anfahrt, Eröffnung)
   *   · die Verfügbarkeitsmatrix in leistungen.ts (was es hier gibt, was nicht)
   *   · team.ts (wie viele Menschen hier arbeiten)
   *   · Geografie, die jeder auf einer Karte nachsehen kann
   *
   * Ausdrücklich NICHT: Zahl der Behandlungszimmer, Ausstattung, Wartezeiten,
   * Beschreibungen der Innenräume. Das weiß nur die Praxis, und Erfundenes auf
   * einer Arztseite ist schlimmer als eine kurze Seite.
   *
   * Wo eine Zahl steht, die sich ändern kann, steht sie als Platzhalter im
   * Text und wird beim Ausspielen ersetzt – sonst altert der Absatz still.
   */
  portrait: { titel: string; text: string }[];
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
    oeffnungsangabe: { tage: 7 },
    portrait: [
      {
        titel: 'Warum die Praxis so groß ist',
        text: 'Der Kurfürstendamm ist das Haus, aus dem die anderen drei hervorgegangen sind. Seit {jahr} liegt die Praxis an der Ecke zur Leibnizstraße, wenige Schritte vom Adenauerplatz – eine Lage, die weniger mit Prestige zu tun hat als mit Erreichbarkeit: Der Kurfürstendamm ist eine der wenigen Berliner Achsen, an der Bus, U-Bahn und Auto gleichermaßen ankommen. Aus dieser Erreichbarkeit folgt der Zuschnitt. Ein Haus, in dem alle {anzahl} Leistungen unter einem Dach liegen, funktioniert nur, wenn Menschen aus dem ganzen Stadtgebiet es ohne Umsteigen erreichen.',
      },
      {
        titel: 'Alles an einem Ort – und was das praktisch heißt',
        text: 'Dies ist der einzige KU64-Standort, an dem es keine Lücke im Angebot gibt: Alle {anzahl} Leistungen aus {bereiche} Fachbereichen werden hier erbracht. Für Patientinnen und Patienten heißt das vor allem eines: Wenn während einer Behandlung ein anderes Fachgebiet gebraucht wird – die Wurzelbehandlung wird zur Chirurgie, die Krone braucht Kieferorthopädie davor –, findet der nächste Schritt im selben Haus statt, oft am selben Tag. Wo dieses Fachgebiet erst gesucht werden muss, vergehen Wochen. Dazu kommt das zahntechnische Meisterlabor im Haus: Kronen, Brücken und Schienen entstehen hier, nicht in einem auswärtigen Labor.',
      },
      {
        titel: 'Zwei Kalender, ein Grund',
        text: 'Am Kurfürstendamm gibt es als einzigem Standort zwei getrennte Terminkalender – einen für Zahnmedizin, einen für Kieferorthopädie. Das ist keine Verwaltungsvorliebe: Eine kieferorthopädische Kontrolle dauert zehn Minuten, eine chirurgische Sitzung anderthalb Stunden. In einem gemeinsamen Kalender verdrängen die langen Termine die kurzen, und wer nur die Spange nachziehen lassen will, wartet drei Wochen. Wählen Sie den Kalender, der zu Ihrem Anliegen passt – bei Unsicherheit hilft ein Anruf.',
      },
      {
        titel: 'Sieben Tage, auch sonntags',
        text: 'Dieser Standort behandelt an sieben Tagen zu festen Zeiten, samstags von 9 bis 19 und sonntags von 10 bis 18 Uhr – ohne Voranmeldungspflicht am Wochenende, anders als in Potsdam und in der KiezPraxis. Für Berufstätige ist das der eigentliche Grund, hierher zu kommen: Ein Termin am Sonntagvormittag kostet keinen Urlaubstag. Für Schmerzfälle ist es der zweite: An sieben Tagen ist jemand da, der einschätzen kann, ob es bis Montag Zeit hat.',
      },
    ],
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
    oeffnungsangabe: { tage: 7, zusatz: 'Sa + So nach Vereinbarung' },
    portrait: [
      {
        titel: 'Zahnmedizin im Palais Ritz',
        text: 'Die Potsdamer Praxis liegt seit {jahr} in der Berliner Straße 139, im denkmalgeschützten Palais Ritz in der Berliner Vorstadt – zwischen Glienicker Brücke und Innenstadt, wenige Minuten vom Neuen Garten. Ein denkmalgeschütztes Haus setzt einer Zahnarztpraxis Grenzen: Wände lassen sich nicht beliebig versetzen, Leitungen nicht beliebig führen. Was hier entstanden ist, musste sich in eine vorhandene Struktur fügen statt umgekehrt.',
      },
      {
        titel: 'Was hier möglich ist',
        text: '{anzahl} der {gesamt} KU64-Leistungen werden in Potsdam erbracht, darunter die vollständige Implantologie mit eigener Oralchirurgie und 3D-Röntgen. Drei Leistungen bleiben dem Kurfürstendamm vorbehalten: feste Zähne an einem Tag, die feste Zahnspange und die Behandlung in Vollnarkose. Das sagen wir hier, damit niemand für einen dieser drei Fälle nach Potsdam fährt und dann weitergeschickt wird. Die Wege zwischen den Häusern sind eingespielt – wer hier anfängt und für einen Schritt nach Berlin muss, wird nicht neu untersucht.',
      },
      {
        titel: 'Wer hier behandelt',
        text: 'In Potsdam arbeiten {behandelnde} Menschen, davon {zahnaerzte} zahnärztlich. Die medizinische Leitung liegt bei Nils Radsack, Zahnarzt für Zahnästhetik und Endodontologie. Ein Team dieser Größe hat einen Vorteil, den ein großes Haus nicht bieten kann: Sie treffen bei jedem Termin auf dieselben Gesichter, und Ihre Vorgeschichte muss nicht bei jedem Besuch neu erzählt werden.',
      },
      {
        titel: 'Wochenende nach Vereinbarung – was das bedeutet',
        text: 'Montag bis Freitag ist von 8 bis 20 Uhr geöffnet. Samstag und Sonntag behandeln wir ebenfalls, aber nur mit Termin. Der Unterschied ist wichtig genug, um ihn auszusprechen: „Geschlossen" wäre falsch – es gibt Wochenendtermine, und viele bekommen sie. „Geöffnet" wäre es aber auch, denn wer ohne Anmeldung samstags vor der Tür steht, steht vor einer verschlossenen. Ein Anruf unter der Woche klärt es.',
      },
    ],
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
    oeffnungsangabe: { tage: 7 },
    portrait: [
      {
        titel: 'Am Hausvogteiplatz',
        text: 'Die Praxis in Mitte liegt seit {jahr} am Hausvogteiplatz 14, zwischen Gendarmenmarkt und Spittelmarkt. Der U-Bahnhof Hausvogteiplatz liegt direkt vor der Tür – das ist unter den vier Standorten die kürzeste Anreise, die es gibt, und der Grund, warum diese Praxis anders getaktet ist als die anderen: Wer in der Mittagspause kommt, rechnet mit Minuten, nicht mit Fußwegen.',
      },
      {
        titel: 'Ein bewusst kleineres Angebot',
        text: 'Am Hausvogteiplatz werden {anzahl} der {gesamt} KU64-Leistungen erbracht, mit Schwerpunkt auf ästhetischer Zahnmedizin, Prophylaxe und Zahnerhalt. {fehlend} Leistungen gibt es hier nicht – darunter Zahnimplantate, Knochenaufbau und die Kieferorthopädie. Das ist eine Entscheidung, keine Lücke: Implantologie und Chirurgie brauchen Geräte und ein Team, das täglich damit arbeitet. Beides in einem Boutique-Haus vorzuhalten, hieße, es selten zu benutzen. Wer eines dieser Themen hat, ist am Kurfürstendamm besser aufgehoben – und wird von hier gezielt dorthin begleitet, nicht weggeschickt.',
      },
      {
        titel: 'Wer hier behandelt',
        text: 'Am Hausvogteiplatz arbeiten {behandelnde} Menschen, davon {zahnaerzte} zahnärztlich. Bei dieser Größe behandelt Sie in der Regel dieselbe Person, die Sie beim ersten Termin gesehen hat.',
      },
      {
        titel: 'Sieben Tage, mit einer Einschränkung',
        text: 'Auch hier wird an sieben Tagen behandelt, samstags von 9 bis 19 und sonntags von 10 bis 18 Uhr. Eine Anmerkung gehört dazu, und sie steht auch auf der Kontaktseite: Die Sprechzeiten am Hausvogteiplatz können im Einzelfall von denen der Hauptpraxis abweichen. Wenn Sie weit anreisen, lassen Sie sich den Termin vorher bestätigen.',
      },
    ],
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
    oeffnungsangabe: { tage: 5, zusatz: 'Sa nach Vereinbarung' },
    portrait: [
      {
        titel: 'Die KiezPraxis',
        text: 'Die jüngste der vier Praxen hat im Januar 2026 in der Gasteiner Straße 9 eröffnet, im Wilmersdorfer Kiez zwischen Blissestraße und Fehrbelliner Platz. Sie heißt KiezPraxis, weil sie eine ist: kein Haus, in das man aus der ganzen Stadt fährt, sondern eines, zu dem man zu Fuß geht. Vom U-Bahnhof Blissestraße sind es vier Minuten.',
      },
      {
        titel: 'Klein, mit dem Kurfürstendamm im Rücken',
        text: 'Hier werden {anzahl} der {gesamt} KU64-Leistungen erbracht – Vorsorge, Prophylaxe, Zahnerhalt, Kinderzahnheilkunde und die häufigsten Formen von Zahnersatz. {fehlend} Leistungen gibt es nicht vor Ort, darunter Implantologie, Kieferorthopädie und das digitale Smile Design. Die KiezPraxis ist eine Tochterpraxis des Kurfürstendamms und arbeitet nach denselben Standards; was hier nicht möglich ist, wird dort gemacht, mit denselben Unterlagen und ohne neue Erstuntersuchung.',
      },
      {
        titel: 'Zwei kurze Tage in der Woche',
        text: 'Montag, Mittwoch und Freitag ist von 8 bis 20 Uhr geöffnet, Dienstag und Donnerstag nur bis 14 Uhr. Diese beiden kurzen Tage sind fest so gelegt – an ihnen gibt es keinen Abendtermin, dafür an den drei langen. Samstags behandeln wir nach Vereinbarung. Gezählt wird die KiezPraxis deshalb als Fünf-Tage-Praxis, obwohl der Samstag dazukommt: Wer sich auf eine Sechs-Tage-Angabe verlässt und ohne Termin kommt, steht vor der Tür.',
      },
      {
        titel: 'Zum Zugang, offen gesagt',
        text: 'Die KiezPraxis ist als einziger der vier Standorte nicht durchgehend barrierefrei zugänglich. Wir schreiben das hin, statt es zu verschweigen: Melden Sie sich bitte vorher, wenn Sie einen barrierefreien Zugang brauchen. Dann finden wir eine Lösung oder vereinbaren den Termin am Kurfürstendamm, der vollständig barrierefrei ist. Was wir nicht tun, ist Sie herkommen zu lassen und es vor Ort herausfinden zu lassen.',
      },
    ],
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

/**
 * Tage, an denen ein Termin möglich ist – die EINE Zählung für die ganze Seite.
 *
 * ── Warum das eine eigene Funktion ist ────────────────────────────────────
 *
 * Es gab zwei Zählungen, und sie widersprachen sich öffentlich. Die
 * Notfallseite rechnete „fest ODER nach Vereinbarung“, Startseite und
 * llms.txt nur „fest“. Für Potsdam stand deshalb an einer Stelle „7
 * Tage/Woche geöffnet“ und an der anderen „5“ – auf derselben Website, im
 * selben Build, und über die strukturierten Daten auch bei Google.
 *
 * Die Zählung ist jetzt: ein Tag zählt, wenn an ihm behandelt wird. Ob mit
 * festen Zeiten oder nach Vereinbarung, ist eine Frage der Zusatzangabe,
 * nicht des Zählens – wer sonntags einen Termin bekommt, für den ist
 * sonntags offen.
 *
 * ── Warum die Zahl allein nicht reicht ────────────────────────────────────
 *
 * „7 Tage/Woche geöffnet“ ohne Zusatz wäre für Potsdam ein Versprechen, das
 * die Praxis nicht gibt: Wer samstags mit Schmerzen und ohne Termin
 * hinfährt, steht vor einer verschlossenen Tür. Deshalb gibt
 * `oeffnungstageText()` die Einschränkung immer mit aus, wo es eine gibt.
 * Die Zahl allein ist nirgends zu verwenden.
 */
/**
 * Platzhalter im Portrait mit den Zahlen des Standorts füllen.
 *
 * Im Text steht `{anzahl}`, nicht die Zahl selbst. Der Grund ist derselbe wie
 * bei der Zahl der Zahnärztinnen, die früher fest in den Standortdaten stand:
 * Solche Zahlen altern lautlos. Kommt eine Leistung dazu, bleibt die alte Zahl
 * im Fließtext stehen – und niemand sucht sie dort.
 */
export function portraitFuellen(text: string, werte: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (ganz, name) =>
    name in werte ? String(werte[name]) : ganz,
  );
}

/**
 * Luftlinie zwischen zwei Standorten, in Kilometern.
 *
 * Für den Satz auf der Anfahrtsseite: „Die nächste andere KU64-Praxis ist X,
 * etwa N Kilometer entfernt." Das ist eine Angabe, die an jedem Standort eine
 * andere ist und die jemand tatsächlich braucht – etwa wenn hier eine
 * Leistung nicht angeboten wird.
 *
 * Luftlinie, nicht Fahrstrecke: Eine Fahrstrecke hinge vom Verkehrsmittel ab
 * und wäre ohne Routendienst geraten. „Etwa" steht deshalb davor.
 */
export function entfernungKm(a: Standort, b: Standort): number {
  const R = 6371;
  const bogen = (g: number) => (g * Math.PI) / 180;
  const dLat = bogen(b.geo.lat - a.geo.lat);
  const dLng = bogen(b.geo.lng - a.geo.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(bogen(a.geo.lat)) * Math.cos(bogen(b.geo.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)) * 10) / 10;
}

/** Der nächstgelegene andere Standort. */
export function naechsterStandort(s: Standort): { standort: Standort; km: number } {
  const andere = STANDORTE.filter((x) => x.slug !== s.slug)
    .map((x) => ({ standort: x, km: entfernungKm(s, x) }))
    .sort((a, b) => a.km - b.km);
  return andere[0];
}

export function oeffnungstage(s: Standort): number {
  return s.oeffnungsangabe.tage;
}

/** Die Tage, an denen nur nach Vereinbarung behandelt wird. */
export function tageNachVereinbarung(s: Standort): Wochentag[] {
  return s.oeffnungszeiten.filter((z) => !z.von && z.nachVereinbarung).map((z) => z.tag);
}

/**
 * Die Angabe, wie sie überall erscheint – Zahl plus Einschränkung.
 *
 * Kurfürstendamm und Berlin-Mitte haben auch am Wochenende feste Zeiten;
 * dort steht schlicht „7 Tage/Woche“. Potsdam behandelt Sa und So nach
 * Vereinbarung und zählt sie mit: „7 Tage/Woche · Sa + So nach Vereinbarung“.
 * Die KiezPraxis zählt ihren Samstag bewusst nicht mit: „5 Tage/Woche · Sa
 * nach Vereinbarung“.
 */
/** Nur die Einschränkung, ohne Zahl – für Stellen, die beides getrennt zeigen. */
export function oeffnungsZusatz(s: Standort): string | undefined {
  const { zusatz } = s.oeffnungsangabe;
  return zusatz ? `Tage/Woche · ${zusatz}` : `Tage/Woche`;
}

export function oeffnungstageText(s: Standort): string {
  const { tage, zusatz } = s.oeffnungsangabe;
  return zusatz ? `${tage} Tage/Woche · ${zusatz}` : `${tage} Tage/Woche`;
}
