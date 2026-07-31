/**
 * Register der Dienste, die Daten an Dritte geben – die einzige Quelle.
 *
 * ── Warum es das gibt ────────────────────────────────────────────────────
 *
 * Bis hierhin war die Website einwilligungsfrei, und das war kein Zufall,
 * sondern eine Bauentscheidung: Doctolib ist ein sichtbarer Verweis statt
 * eines eingebetteten Fensters, Personio wird auf dem Server abgeholt, es gab
 * keine Statistik. Beim Seitenaufruf entstand keine einzige Verbindung nach
 * außen.
 *
 * Das ändert sich: Google Analytics soll kommen, Doctolib eingebettet werden,
 * Personio als Fenster, und die Claude-Dienste laufen schon. Ab dem ersten
 * dieser Dienste braucht es eine Einwilligung – § 25 TDDDG für den Zugriff auf
 * Endgeräte, Artikel 6 DSGVO für die Verarbeitung.
 *
 * Die Erfahrung mit solchen Schichten ist immer dieselbe: Der Banner wird
 * gebaut, und ein halbes Jahr später bindet jemand ein Skript ein, ohne ihn zu
 * fragen. Deshalb ist hier nicht der Banner die Hauptsache, sondern das
 * Register – und `src/lib/einwilligung.ts` lädt NICHTS, was nicht hier steht.
 * Ein Dienst ohne Eintrag hat keinen Weg in die Seite.
 *
 * ── Aufbau ──────────────────────────────────────────────────────────────
 *
 * Jeder Dienst nennt Zweck, Anbieter, Empfängerland, Rechtsgrundlage,
 * Speicherdauer und die Namen dessen, was er auf dem Gerät ablegt. Das sind
 * genau die Angaben, die Artikel 13 DSGVO verlangt – und genau die, die in
 * einer Datenschutzerklärung fehlen, wenn sie jemand von Hand schreibt.
 * `/cookies/` und `/datenschutz/` erzeugen ihre Tabellen daraus.
 *
 * ── Die Kategorien ──────────────────────────────────────────────────────
 *
 * Vier, nicht mehr. „Funktional", „Komfort", „Personalisierung" und
 * „Marketing" nebeneinander sind vier Wörter für dieselbe Frage und führen
 * dazu, dass niemand mehr weiß, was er zustimmt.
 *
 *   notwendig     Ohne das funktioniert die Seite nicht. Keine Einwilligung
 *                 nötig, aber die Angabe gehört trotzdem hierher.
 *   funktion      Ein Dienst, den die Besucherin selbst auslöst: Termin
 *                 buchen, Chat öffnen, Bewerbung ansehen.
 *   statistik     Messung des Verhaltens.
 *   ki            Dienste, die eine Eingabe an ein Sprachmodell geben.
 *                 Eigene Kategorie, weil hier ein Text die Praxis verlässt –
 *                 das ist etwas anderes als ein Seitenaufruf.
 *
 * ── Ein Vorbehalt, der nicht wegprogrammiert werden kann ────────────────
 *
 * Google Analytics und Google Maps setzen Daten in die USA, Matterport und
 * Anthropic ebenso. Dafür braucht es den EU-US Data Privacy Framework und
 * einen Auftragsverarbeitungsvertrag – beides Sache der Praxis, nicht der
 * Technik.
 *
 * `avVertrag` hält diesen Stand fest, und das Feld hat Zähne: Steht es auf
 * `false`, lädt `Drittinhalt.astro` den Dienst nicht, auch nicht auf Klick und
 * auch nicht bei Zustimmung. Eine Einwilligung ersetzt keinen Vertrag.
 *
 * Für die vier aktiven Dienste hat die Praxis die Verträge am 30. Juli 2026
 * bestätigt. Was die Technik weiterhin nicht kann: prüfen, ob das stimmt. Wer
 * das Feld ohne Vertrag auf `true` setzt, umgeht keine Sperre, sondern trägt
 * eine Falschangabe in ein Verzeichnis, das in der Datenschutzerklärung
 * abgedruckt wird.
 */

export type Kategorie = 'notwendig' | 'funktion' | 'statistik' | 'ki';

export interface Ablage {
  /** Name des Cookies bzw. Schlüssels. */
  name: string;
  /** cookie | localStorage | sessionStorage */
  art: 'cookie' | 'localStorage' | 'sessionStorage';
  /** Was drinsteht – in einem Satz, ohne Fachwort. */
  inhalt: string;
  /** Wie lange. „Sitzung" ist ein zulässiger Wert. */
  dauer: string;
}

export interface Dienst {
  slug: string;
  name: string;
  kategorie: Kategorie;
  /**
   * `aktiv`      eingebaut und in Betrieb
   * `geplant`    beschlossen, noch nicht eingebaut – steht schon im
   *              Verzeichnis, damit die Erklärung nicht hinterherläuft
   * `verworfen`  bewusst nicht eingebaut; bleibt als Begründung stehen
   */
  stand: 'aktiv' | 'geplant' | 'verworfen';
  /** Was er für die Besucherin tut. Nicht was er für uns tut. */
  zweck: string;
  anbieter: string;
  /** Sitz des Anbieters bzw. wo die Daten landen. */
  land: string;
  /** Artikel 6 DSGVO, im Klartext. */
  rechtsgrundlage: string;
  /** Was übertragen wird. */
  daten: string[];
  ablagen: Ablage[];
  /** Auftragsverarbeitungsvertrag geschlossen? */
  avVertrag: boolean;
  /** Datenschutzhinweise des Anbieters. */
  hinweise: string;
  /**
   * Warum dieser Dienst und nicht der datensparsamere Weg. Steht im
   * Verzeichnis mit – wer eine Einwilligung erbittet, soll sagen, wofür.
   */
  begruendung: string;
}

export const KATEGORIE_NAMEN: Record<Kategorie, { name: string; erklaerung: string }> = {
  notwendig: {
    name: 'Notwendig',
    erklaerung:
      'Ohne diese Angaben funktioniert die Website nicht. Sie werden nicht ausgewertet und ' +
      'nicht weitergegeben. Eine Einwilligung ist dafür nicht erforderlich.',
  },
  funktion: {
    name: 'Von Ihnen ausgelöst',
    erklaerung:
      'Dienste, die erst starten, wenn Sie etwas anklicken – einen Termin buchen, den Chat ' +
      'öffnen, Stellenangebote ansehen. Ohne Ihre Zustimmung wird nichts davon geladen.',
  },
  statistik: {
    name: 'Statistik',
    erklaerung:
      'Messung, welche Seiten wie oft aufgerufen werden. Hilft der Praxis, die Website zu ' +
      'verbessern. Für Sie hat es keinen Nutzen – deshalb steht es hier getrennt.',
  },
  ki: {
    name: 'KI-Dienste',
    erklaerung:
      'Hier verlässt ein Text, den Sie eingeben, die Praxis und geht an ein Sprachmodell. ' +
      'Das ist etwas anderes als ein Seitenaufruf, deshalb eine eigene Kategorie.',
  },
};

export const DIENSTE: Dienst[] = [
  /* ── notwendig ────────────────────────────────────────────────────── */
  {
    slug: 'standortwahl',
    name: 'Zuletzt gewählter Standort',
    kategorie: 'notwendig',
    stand: 'aktiv',
    zweck:
      'Merkt sich, welchen der fünf Standorte Sie zuletzt angesehen haben, damit Sie ihn ' +
      'nicht bei jedem Besuch neu auswählen müssen.',
    anbieter: 'KU64 – die Zahnspezialisten',
    land: 'Deutschland (eigener Server)',
    rechtsgrundlage:
      'Kein personenbezogenes Datum und technisch erforderlich für die von Ihnen ' +
      'aufgerufene Funktion – § 25 Abs. 2 Nr. 2 TDDDG.',
    daten: ['der Kurzname eines Standorts, zum Beispiel „potsdam"'],
    ablagen: [
      {
        name: 'ku64:standort',
        art: 'localStorage',
        inhalt: 'Kurzname des Standorts. Keine Kennung, kein Zeitstempel.',
        dauer: 'bis Sie ihn löschen',
      },
    ],
    avVertrag: true,
    hinweise: '/datenschutz/',
    begruendung:
      'Die Alternative wäre, den Standort in die Adresse zu schreiben – dann teilt jemand ' +
      'einen Link und gibt damit seinen Standort mit weiter.',
  },
  {
    slug: 'einwilligung',
    name: 'Ihre Entscheidung zu dieser Auswahl',
    kategorie: 'notwendig',
    stand: 'aktiv',
    zweck:
      'Hält fest, welchen Kategorien Sie zugestimmt haben – sonst müssten wir bei jedem ' +
      'Seitenaufruf erneut fragen.',
    anbieter: 'KU64 – die Zahnspezialisten',
    land: 'Deutschland (eigener Server)',
    rechtsgrundlage:
      'Rechtliche Verpflichtung, die Einwilligung nachweisen zu können – Artikel 7 Abs. 1 DSGVO.',
    daten: ['die zugestimmten Kategorien', 'Datum der Entscheidung', 'Fassung dieses Verzeichnisses'],
    ablagen: [
      {
        name: 'ku64:einwilligung',
        art: 'localStorage',
        inhalt:
          'Liste der zugestimmten Kategorien, Datum und die Fassung des Verzeichnisses. ' +
          'Ändert sich das Verzeichnis, wird erneut gefragt.',
        dauer: '6 Monate, dann wird erneut gefragt',
      },
    ],
    avVertrag: true,
    hinweise: '/datenschutz/',
    begruendung:
      'Ohne diesen Eintrag stünde der Hinweis auf jeder Seite erneut – und eine ' +
      'Einwilligung, die man nicht nachweisen kann, gilt als nicht erteilt.',
  },

  /* ── von Ihnen ausgelöst ──────────────────────────────────────────── */
  {
    slug: 'doctolib',
    name: 'Doctolib Terminbuchung',
    kategorie: 'funktion',
    stand: 'geplant',
    zweck:
      'Termine direkt auf dieser Seite buchen, ohne zu Doctolib zu wechseln.',
    anbieter: 'Doctolib GmbH, Berlin',
    land: 'Deutschland; Konzernmutter in Frankreich',
    rechtsgrundlage: 'Ihre Einwilligung – Artikel 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG.',
    daten: [
      'IP-Adresse',
      'Browser und Betriebssystem',
      'die Seite, von der Sie kommen',
      'bei einer Buchung: Name, Geburtsdatum, Kontaktdaten, Behandlungsanlass',
    ],
    ablagen: [
      {
        name: 'diverse Cookies von doctolib.de',
        art: 'cookie',
        inhalt: 'Sitzungskennung und Einstellungen des Buchungsfensters.',
        dauer: 'bis 13 Monate, siehe Hinweise von Doctolib',
      },
    ],
    avVertrag: true,
    hinweise: 'https://www.doctolib.de/terms/agreement',
    begruendung:
      'Heute ist Doctolib ein sichtbarer Verweis: Wer klickt, wechselt bewusst und weiß, ' +
      'dass er die Praxisseite verlässt. Das eingebettete Fenster ist bequemer und bindet ' +
      'einen Drittanbieter in die Seite ein – eine Abwägung, die die Praxis trifft. ' +
      'Solange dieser Eintrag auf „geplant" steht, gilt weiterhin der Verweis.',
  },
  {
    slug: 'personio',
    name: 'Personio Bewerbungsportal',
    kategorie: 'funktion',
    stand: 'geplant',
    zweck: 'Stellenangebote ansehen und sich direkt auf dieser Seite bewerben.',
    anbieter: 'Personio SE & Co. KG, München',
    land: 'Deutschland',
    rechtsgrundlage: 'Ihre Einwilligung – Artikel 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG.',
    daten: ['IP-Adresse', 'Browser', 'bei einer Bewerbung: alles, was Sie ins Formular eintragen'],
    ablagen: [
      {
        name: 'diverse Cookies von personio.de',
        art: 'cookie',
        inhalt: 'Sitzungskennung des Bewerbungsfensters.',
        dauer: 'siehe Hinweise von Personio',
      },
    ],
    avVertrag: false,
    hinweise: 'https://www.personio.de/datenschutzerklaerung/',
    begruendung:
      'Die Stellenliste kommt heute aus dem öffentlichen XML-Feed und wird auf unserem ' +
      'Server geholt – im Browser entsteht keine Verbindung zu Personio. Das bleibt so; ' +
      'die Einwilligung betrifft nur das eingebettete Bewerbungsformular.',
  },

  /* ── Statistik ────────────────────────────────────────────────────── */
  {
    slug: 'google-analytics',
    name: 'Google Analytics 4',
    kategorie: 'statistik',
    stand: 'aktiv',
    zweck:
      'Zeigt der Praxis, welche Seiten gefunden und gelesen werden und wo Menschen die ' +
      'Terminbuchung abbrechen.',
    anbieter: 'Google Ireland Limited, Dublin; Google LLC, USA',
    land: 'Irland, mit Übermittlung in die USA',
    rechtsgrundlage: 'Ihre Einwilligung – Artikel 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG.',
    daten: [
      'gekürzte IP-Adresse',
      'aufgerufene Seiten und Verweildauer',
      'Gerät, Browser, Bildschirmgröße',
      'die Suchanfrage oder Seite, über die Sie gekommen sind',
      'eine Zufallskennung, die Ihre Aufrufe zu einem Besuch zusammenfasst',
    ],
    ablagen: [
      {
        name: '_ga',
        art: 'cookie',
        inhalt: 'Zufallskennung, die Ihre Aufrufe zu einem Besucher zusammenfasst.',
        dauer: '2 Jahre',
      },
      {
        name: '_ga_<Messkennung>',
        art: 'cookie',
        inhalt: 'Zustand der laufenden Sitzung.',
        dauer: '2 Jahre',
      },
    ],
    avVertrag: true,
    hinweise: 'https://policies.google.com/privacy',
    begruendung:
      'Ohne Messung lässt sich nicht sagen, ob der Umbau gewirkt hat. Analytics ist dafür ' +
      'das Werkzeug, das die Praxis und die Agentur kennen. Der Preis ist eine ' +
      'Übermittlung in die USA – wer das nicht will, hat mit einer Messung auf eigenem ' +
      'Server (Plausible, Matomo) eine Alternative, die ohne Einwilligung auskommt. ' +
      'Diese Abwägung gehört der Praxis, nicht der Technik.',
  },

  {
    slug: 'google-tag-manager',
    name: 'Google Tag Manager',
    kategorie: 'statistik',
    stand: 'verworfen',
    zweck: 'Verwaltet, welche Messskripte auf der Website geladen werden.',
    anbieter: 'Google Ireland Limited, Dublin',
    land: 'Irland, mit Übermittlung in die USA',
    rechtsgrundlage: 'entfällt – nicht eingebaut',
    daten: [],
    ablagen: [],
    avVertrag: false,
    hinweise: 'https://policies.google.com/privacy',
    begruendung:
      'Läuft auf der alten Website mit (GTM-TL2T6K8) und wird bewusst NICHT übernommen. ' +
      'Der Tag Manager ist eine Fernbedienung: Wer Zugriff hat, kann jederzeit weitere ' +
      'Skripte nachladen, ohne dass es jemand in diesem Verzeichnis sieht. Damit wäre ' +
      'jede Zusage über Drittanbieter auf dieser Website hinfällig. Analytics wird ' +
      'stattdessen direkt geladen – ein Dienst, ein Eintrag, nachprüfbar.',
  },
  {
    slug: 'hubspot',
    name: 'HubSpot',
    kategorie: 'statistik',
    stand: 'verworfen',
    zweck: 'Formulare und Besucherverfolgung für Marketingzwecke.',
    anbieter: 'HubSpot Inc., USA',
    land: 'USA',
    rechtsgrundlage: 'entfällt – nicht eingebaut',
    daten: [],
    ablagen: [],
    avVertrag: false,
    hinweise: 'https://legal.hubspot.com/privacy-policy',
    begruendung:
      'Läuft auf der alten Website (Portal 25985109, js-eu1.hs-scripts.com) und stand auf ' +
      'keiner Liste – gefunden beim Auslesen des Quelltextes am 30.07.2026. Die Praxis ' +
      'löst den Vertrag im September 2026 auf; übernommen wird nichts. Formulare laufen ' +
      'hier über den eigenen Server. Der Eintrag bleibt als Begründung stehen, damit ' +
      'HubSpot nicht eines Tages wieder auftaucht, weil niemand mehr weiß, warum es weg war.',
  },
  {
    slug: 'matterport',
    name: 'Matterport 360°-Rundgang',
    kategorie: 'funktion',
    stand: 'aktiv',
    zweck:
      'Ein Rundgang durch die Praxisräume, in dem Sie sich frei bewegen können – ' +
      'für Kurfürstendamm, Hausvogteiplatz und Potsdam.',
    anbieter: 'Matterport Inc., USA',
    land: 'USA',
    rechtsgrundlage: 'Ihre Einwilligung – Artikel 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG.',
    daten: ['IP-Adresse', 'Browser und Grafikfähigkeiten', 'welche Punkte im Rundgang Sie ansehen'],
    ablagen: [
      {
        name: 'Cookies von my.matterport.com',
        art: 'cookie',
        inhalt: 'Sitzungskennung und Einstellungen des Betrachters.',
        dauer: 'siehe Hinweise von Matterport',
      },
    ],
    avVertrag: true,
    hinweise: 'https://matterport.com/de/legal/privacy-policy',
    begruendung:
      'Auf der alten Website stand der Rundgang als eingebettetes Fenster mitten auf der ' +
      'Standortseite und lud bei jedem Aufruf – ein eigener 3D-Betrachter samt Texturen, ' +
      'auch für alle, die ihn nie anfassen. Hier steht zuerst ein Standbild mit einer ' +
      'Schaltfläche; geladen wird erst auf Klick und erst mit Ihrer Zustimmung.',
  },
  {
    slug: 'google-maps',
    name: 'Google Maps Routenplanung',
    kategorie: 'funktion',
    stand: 'aktiv',
    zweck:
      'Die Route zur Praxis planen – mit Auto, Rad, zu Fuß oder mit den öffentlichen ' +
      'Verkehrsmitteln, direkt auf der Anfahrtsseite des Standorts.',
    anbieter: 'Google Ireland Limited, Dublin',
    land: 'Irland, mit Übermittlung in die USA',
    rechtsgrundlage: 'Ihre Einwilligung – Artikel 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG.',
    daten: [
      'IP-Adresse und damit Ihr ungefährer Standort',
      'Browser und Bildschirmgröße',
      'welchen Kartenausschnitt Sie ansehen',
      'bei einer Routenabfrage: Ihr Startpunkt',
    ],
    ablagen: [
      {
        name: 'NID und weitere Cookies von google.com',
        art: 'cookie',
        inhalt: 'Einstellungen der Karte und eine Kennung des Browsers.',
        dauer: 'bis 6 Monate, siehe Hinweise von Google',
      },
    ],
    avVertrag: true,
    hinweise: 'https://policies.google.com/privacy',
    begruendung:
      'Der Weg zur Praxis steht auf jeder Anfahrtsseite in Worten, mit Haltestellen, ' +
      'Parkmöglichkeiten und Barrierefreiheit – das ist für Menschen mit Sehbehinderung ' +
      'ohnehin brauchbarer als eine Karte, und es funktioniert ohne jede Einwilligung. ' +
      'Wer darüber hinaus eine Route rechnen will, bekommt die Karte auf Klick. Vorher ' +
      'steht eine verschwommene Vorschau aus unseren eigenen Dateien – dabei wird nichts ' +
      'von Google geladen, auch kein Bild.',
  },
  {
    slug: 'youtube',
    name: 'YouTube-Videos',
    kategorie: 'funktion',
    stand: 'aktiv',
    zweck: 'Die fünfzehn Filme des KU64-Kanals abspielen – Behandlungen, Räume, Hilfsprojekt.',
    anbieter: 'Google Ireland Limited, Dublin',
    land: 'Irland, Übermittlung in die USA',
    rechtsgrundlage: 'Ihre Einwilligung – Artikel 6 Abs. 1 lit. a DSGVO.',
    daten: [
      'IP-Adresse',
      'Browser und Betriebssystem',
      'aufgerufene Adresse dieser Website',
      'Kennung des abgespielten Videos',
    ],
    ablagen: [
      {
        name: 'VISITOR_INFO1_LIVE, YSC und weitere von youtube-nocookie.com',
        art: 'cookie',
        inhalt: 'Kennung der Wiedergabesitzung und Einstellungen des Abspielers.',
        dauer: 'Sitzung bis 6 Monate, siehe Hinweise von Google',
      },
    ],
    avVertrag: true,
    hinweise: 'https://policies.google.com/privacy',
    begruendung:
      'Die alte Website bettete YouTube auf 89 Seiten ein – und zeigte dort den Satz „Sie ' +
      'sehen gerade einen Platzhalterinhalt von YouTube", also einen Hinweis anstelle des ' +
      'Films. Drei der Einbettungen sind heute leer: zwei Videos sperren das Einbetten, ' +
      'eines ist gelöscht.\n\n' +
      'Hier liegen die fünfzehn abspielbaren Filme wieder an ihren Seiten, aber erst auf ' +
      'Klick. Vorher steht eine selbst gezeichnete Vorschau – kein Vorschaubild von ' +
      'i.ytimg.com, denn auch das wäre schon ein Aufruf bei Google. Eingebettet wird über ' +
      'youtube-nocookie.com und ohne verwandte Videos fremder Kanäle.\n\n' +
      'Die Kopfvideos der Standorte liegen weiterhin auf dem eigenen Server und spielen ' +
      'ohne Einwilligung – was wir selbst ausliefern können, liefern wir selbst aus.',
  },

  /* ── KI ───────────────────────────────────────────────────────────── */
  {
    slug: 'claude',
    name: 'Claude – Suche, Chat und Lächeln-Vorschau',
    kategorie: 'ki',
    stand: 'aktiv',
    zweck:
      'Beantwortet Fragen in eigenen Worten, findet Seiten auch bei ungenauer Eingabe und ' +
      'erzeugt die Vorschau eines behandelten Lächelns.',
    anbieter: 'Anthropic PBC, San Francisco',
    land: 'USA',
    rechtsgrundlage: 'Ihre Einwilligung – Artikel 6 Abs. 1 lit. a DSGVO.',
    daten: [
      'Ihre Eingabe: Suchbegriff, Frage oder Foto',
      'die Seiteninhalte, die zur Beantwortung nötig sind',
    ],
    ablagen: [],
    avVertrag: true,
    hinweise: 'https://www.anthropic.com/legal/privacy',
    begruendung:
      'Die Anfrage geht über unseren eigenen Server – Ihr Browser baut keine Verbindung zu ' +
      'Anthropic auf, und Ihre IP-Adresse wird nicht weitergegeben. Übermittelt wird nur, ' +
      'was Sie eingeben. Nichts davon startet von selbst: Erst wenn Sie die Suche oder ' +
      'den Chat benutzen, entsteht überhaupt eine Anfrage.',
  },
  {
    slug: 'elevenlabs',
    name: 'ElevenLabs Sprachberater',
    kategorie: 'ki',
    stand: 'geplant',
    zweck: 'Gesprochene Fragen stellen und gesprochene Antworten hören.',
    anbieter: 'ElevenLabs Inc., USA',
    land: 'USA',
    rechtsgrundlage: 'Ihre Einwilligung – Artikel 6 Abs. 1 lit. a DSGVO.',
    daten: ['Ihre Stimme, solange das Gespräch läuft', 'der erkannte Text'],
    ablagen: [],
    avVertrag: false,
    hinweise: 'https://elevenlabs.io/privacy',
    begruendung:
      'Anders als beim Chat baut der Browser hier eine direkte Verbindung zu ElevenLabs ' +
      'auf – eine Stimme lässt sich nicht sinnvoll über einen Zwischenserver leiten. ' +
      'Damit geht auch Ihre IP-Adresse dorthin. Deshalb startet der Berater erst auf ' +
      'ausdrückliche Zustimmung, und zwar jedes Mal.',
  },

  /* ── verworfen ────────────────────────────────────────────────────── */
  {
    slug: 'google-fonts',
    name: 'Google Fonts',
    kategorie: 'funktion',
    stand: 'verworfen',
    zweck: 'Schriften von einem fremden Server laden.',
    anbieter: 'Google Ireland Limited',
    land: 'Irland/USA',
    rechtsgrundlage: 'entfällt – nicht eingebaut',
    daten: [],
    ablagen: [],
    avVertrag: false,
    hinweise: 'https://policies.google.com/privacy',
    begruendung:
      'Bleibt als Begründung stehen, damit es niemand aus Versehen wieder einbaut: Die ' +
      'Schriften liegen auf unserem eigenen Server. Das ist schneller und braucht keine ' +
      'Einwilligung. Das Landgericht München I hat die Einbindung 2022 als ' +
      'Persönlichkeitsrechtsverletzung gewertet (Az. 3 O 17493/20).',
  },
];

/**
 * Fassung des Verzeichnisses.
 *
 * Bei jeder inhaltlichen Änderung hochzählen: Die gespeicherte Einwilligung
 * trägt diese Zahl, und stimmt sie nicht mehr, wird erneut gefragt. Eine
 * Einwilligung von gestern deckt keinen Dienst, den es gestern nicht gab.
 *
 * `dienste-pruefen.mjs` bricht den Bau ab, wenn ein Dienst hinzukommt oder
 * seine Kategorie wechselt, ohne dass diese Zahl steigt.
 *
 * ── Fassung 2, am 30. Juli 2026 ─────────────────────────────────────────
 *
 * Die Praxis hat die Auftragsverarbeitungsverträge für Google Analytics,
 * Google Maps, Matterport und die Claude-Dienste bestätigt. Bis dahin stand
 * `avVertrag: false`, und die Technik hat diese Dienste gesperrt – auch bei
 * Zustimmung, weil eine Einwilligung keinen Vertrag ersetzt.
 *
 * Dass die Fassung dabei steigt, ist keine Formsache. Im Dialog stand vorher
 * wörtlich, diese Dienste würden „auch bei Zustimmung nicht geladen". Wer
 * daraufhin „Alles erlauben" geklickt hat, hat es in dem Wissen getan, dass
 * nichts passiert. Genau dieses Wissen ist jetzt falsch – also wird erneut
 * gefragt. Eine Zustimmung, deren Bedeutung sich nachträglich ändert, ist
 * keine.
 *
 * ── Fassung 3, am 31. Juli 2026 ─────────────────────────────────────────
 *
 * YouTube wechselt von `verworfen` auf `aktiv`. Die Begründung „die Videos
 * liegen hier auf dem eigenen Server" stimmte für die drei Kopfvideos der
 * Standorte und für die fünfzehn Filme des KU64-Kanals nicht – die lagen
 * nirgends und fehlten deshalb auf 89 Seiten.
 *
 * Das ist eine neue Kategorie im Dialog für jeden, der vorher nur
 * „Funktion" abgelehnt hatte? Nein – YouTube liegt in derselben Kategorie
 * wie Karte und Rundgang. Aber es ist ein neuer Dienst in einer Kategorie,
 * der jemand vielleicht zugestimmt hat, ohne ihn zu kennen. Genau dafür
 * steht diese Zahl: Wer „Funktion erlauben" geklickt hat, hat das für
 * Doctolib, Karte und Rundgang getan, nicht für Google-Videoserver. Also
 * wird erneut gefragt.
 *
 * Doctolib steht dabei auf `avVertrag: true` – die Praxis hat den Vertrag
 * am 30. Juli 2026 bestätigt, und die Datenschutzerklärung schreibt es seit
 * damals. Dass hier `false` stand, war ein Widerspruch im eigenen Haus.
 */
export const VERZEICHNIS_FASSUNG = 3;

/** Alle Dienste einer Kategorie, die tatsächlich in Betrieb sind. */
export function dienste(kategorie: Kategorie): Dienst[] {
  return DIENSTE.filter((d) => d.kategorie === kategorie && d.stand === 'aktiv');
}

/** Kategorien, für die es überhaupt etwas zu entscheiden gibt. */
export function einwilligungspflichtig(): Kategorie[] {
  const gebraucht = new Set(
    DIENSTE.filter((d) => d.stand === 'aktiv' && d.kategorie !== 'notwendig').map((d) => d.kategorie),
  );
  return (['funktion', 'statistik', 'ki'] as Kategorie[]).filter((k) => gebraucht.has(k));
}

export function dienst(slug: string): Dienst | undefined {
  return DIENSTE.find((d) => d.slug === slug);
}
