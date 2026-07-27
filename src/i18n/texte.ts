/**
 * Oberflächentexte – die deutsche Quellfassung.
 *
 * Alles, was nicht aus den Inhaltsdaten kommt, steht hier: Navigation,
 * Fußzeile, Schaltflächen, Hinweise, Fehlermeldungen. Die Übersetzungen
 * liegen in src/inhalte/<sprache>.json unter dem Präfix `ui.`.
 *
 * Zwei Regeln für neue Einträge:
 *
 * 1. Ganze Sätze, keine Bruchstücke. `{anzahl} Standorte in Berlin und
 *    Potsdam` lässt sich übersetzen; `Standorte` + `in` + Ort nicht – im
 *    Französischen steht das Zahlwort anders, im Englischen der Ort.
 * 2. Der Schlüssel beschreibt den Ort, nicht den Text. Wird der Text später
 *    umformuliert, bleibt der Schlüssel gültig und der Fingerabdruck sorgt
 *    dafür, dass die Übersetzung als veraltet gemeldet wird.
 */

export const TEXTE = {
  // ── Gerüst ──────────────────────────────────────────────────────────
  'geruest.zumInhalt': 'Zum Inhalt springen',
  'geruest.hauptnavigation': 'Hauptnavigation',
  'geruest.menueOeffnen': 'Menü öffnen',
  'geruest.menueSchliessen': 'Menü schließen',
  'geruest.mobileNavigation': 'Mobile Navigation',
  'geruest.sieSindHier': 'Sie befinden sich hier',
  'geruest.startseite': 'Startseite',
  'geruest.rechtliches': 'Rechtliches',
  'geruest.aktuell': 'aktuell',

  // ── Navigation ──────────────────────────────────────────────────────
  'nav.behandlungen': 'Behandlungen',
  'nav.praxis': 'Praxis',
  'nav.team': 'Team',
  'nav.anfahrt': 'Anfahrt',
  'nav.kontakt': 'Kontakt',
  'nav.termine': 'Termine',
  'nav.standorte': 'Standorte',
  'nav.standortWaehlen': 'Bitte wählen Sie Ihren Standort für passende Angaben.',
  'nav.standortWechseln': 'Standort wechseln',
  'nav.andererStandort': 'Anderer Standort',
  'nav.standortWaehlenKurz': 'Standort wählen',
  'nav.ueberKu64': 'Über KU64',
  'nav.terminBuchen': 'Termin buchen',

  // ── Fußzeile ────────────────────────────────────────────────────────
  'fuss.unsereStandorte': 'Unsere Standorte',
  'fuss.behandlungsbereiche': 'Behandlungsbereiche',
  'fuss.haeufigGesucht': 'Häufig gesucht',
  'fuss.service': 'Service',
  'fuss.oeffnungszeiten': 'Öffnungszeiten',
  'fuss.aktuellGewaehlt': '(aktuell gewählt)',
  'fuss.impressum': 'Impressum',
  'fuss.datenschutz': 'Datenschutz',
  'fuss.barrierefreiheit': 'Barrierefreiheit',
  'fuss.cookieEinstellungen': 'Cookie-Einstellungen',
  'fuss.karriere': 'Karriere',
  'fuss.notfall': 'Zahnärztlicher Notfall',
  'fuss.anamnese': 'Digitale Anamnese',
  'fuss.laechelnVorschau': 'Lächeln-Vorschau',

  // ── Standorte und Zeiten ────────────────────────────────────────────
  'standort.geoeffnet': 'Jetzt geöffnet',
  'standort.geschlossen': 'Gerade geschlossen',
  'standort.geschlossenAmTag': 'geschlossen',
  'standort.barrierefrei': 'barrierefreier Zugang',
  'standort.zuletztGewaehlt': 'zuletzt gewählt',
  'standort.anrufen': 'Anrufen',
  'standort.route': 'Route planen',

  // ── Behandlungen ────────────────────────────────────────────────────
  'leistung.dauer': 'Dauer',
  'leistung.kosten': 'Kosten',
  'leistung.kasse': 'Krankenkasse',
  'leistung.ablauf': 'So läuft die Behandlung ab',
  'leistung.faq': 'Häufige Fragen',
  'leistung.andereBezeichnungen': 'Auch bekannt als',
  'leistung.verwandt': 'Das könnte ebenfalls passen',
  'leistung.hierNichtVerfuegbar':
    'Diese Behandlung bieten wir an diesem Standort nicht an. Sie finden sie hier:',
  'leistung.mehrErfahren': 'Mehr erfahren',

  // ── Sprache ─────────────────────────────────────────────────────────
  'sprache.waehlen': 'Sprache wählen',
  'sprache.aktuell': 'Aktuelle Sprache: {sprache}',
  'sprache.hinweisTitel': 'Wir haben auf {sprache} umgestellt',
  'sprache.hinweisText':
    'Ihr Browser ist auf {sprache} eingestellt, deshalb sehen Sie diese Seite auf {sprache}.',
  'sprache.zurueckZu': 'Weiter auf {sprache}',
  'sprache.hinweisSchliessen': 'Hinweis schließen',
  'sprache.unvollstaendig':
    'Diese Sprachfassung wird gerade aufgebaut. Einzelne Abschnitte erscheinen noch auf Deutsch.',

  // ── Allgemein ───────────────────────────────────────────────────────
  'allgemein.mehr': 'Mehr',
  'allgemein.schliessen': 'Schließen',
  'allgemein.zurueck': 'Zurück',
  'allgemein.absenden': 'Absenden',
  'allgemein.pflichtfeld': 'Pflichtfeld',
  'allgemein.fehler': 'Da ist etwas schiefgegangen. Bitte versuchen Sie es noch einmal.',

  // ── Startseite ──────────────────────────────────────────────────────
  'start.ueberschrift': 'Wo dürfen wir Sie behandeln?',
  'start.vorspann':
    '{anzahl} Standorte in Berlin und Potsdam. Wählen Sie Ihren – danach sehen Sie ausschließlich Behandlungen, Sprechzeiten und Kontaktdaten dieses Standorts. Kein Wechsel ohne Ihr Zutun.',
  'start.zuletztWaren': 'Zuletzt waren Sie bei {standort}.',
  'start.zuletztZurueck': 'Dorthin zurück',
  'start.warumTitel': 'Warum diese Website nach Standort aufgebaut ist',
  'start.warumEins':
    'Eine Zahnarztpraxis mit mehreren Häusern hat ein Problem, das Patientinnen und Patienten oft erst spät bemerkt: Nicht jede Behandlung wird überall angeboten. Wer nach „Implantat Potsdam“ sucht und auf einer allgemeinen Leistungsseite landet, liest im Zweifel über eine Praxis, die 30 Kilometer entfernt liegt.',
  'start.warumZwei':
    'Deshalb gehört bei uns jede Behandlungsseite zu genau einem Standort – mit dessen Adresse, Telefonnummer, Sprechzeiten und Terminbuchung. Gibt es eine Behandlung an Ihrem Standort nicht, sagen wir das offen und verlinken gezielt dorthin, wo Sie sie bekommen. {anzahl} Behandlungen, jeweils dort beschrieben, wo sie stattfinden.',
  'start.digitalTitel': 'Digital, bevor Sie ankommen',
  'start.laechelnText':
    'Foto hochladen und sehen, wie Ihr Lächeln nach einer ästhetischen Behandlung aussehen könnte. Ihr Bild wird dabei nicht gespeichert.',
  'start.laechelnKnopf': 'Ausprobieren',
  'start.anamneseText':
    'Den Anamnesebogen bequem von zu Hause ausfüllen – an jedem Standort. Kein Klemmbrett im Wartezimmer.',
  'start.anamneseKnopf': 'Bogen öffnen',
  'start.beraterText':
    'Fragen zu Behandlung, Kosten oder Ablauf? Schreiben oder sprechen Sie mit unserem Assistenten – rund um die Uhr.',
  'start.beraterKnopf': 'Gespräch starten',

  // ── Standortkarte ───────────────────────────────────────────────────
  'karte.behandlungen': 'Behandlungen',
  'karte.geoeffnet': 'Geöffnet',
  'karte.telefon': 'Telefon',
  'karte.tageWoche': '{anzahl} Tage/Woche',
  'karte.standortAnsehen': 'Standort ansehen',

  // ── Fehlerseite ─────────────────────────────────────────────────────
  'fehler.titel': 'Diese Seite gibt es nicht',
  'fehler.text':
    'Vielleicht wurde sie beim Umbau der Website umbenannt. Suchen Sie hier direkt nach Ihrer Behandlung – oder gehen Sie zu Ihrem Standort.',
  'fehler.suchen': 'Behandlung suchen',

  // ── Bausteine ───────────────────────────────────────────────────────
  'nav.waehlerHinweis':
    'Beim Wechsel zeigen wir Ihnen die Angaben des gewählten Standorts. Nicht jede Behandlung wird an jedem Standort angeboten.',
  'fuss.ohneStandort':
    'Zahnmedizin an vier Standorten in Berlin und Potsdam. Bitte wählen Sie Ihren Standort – Sprechzeiten und Behandlungsangebot unterscheiden sich.',
  'termin.vorspann':
    'Buchen Sie online in unter einer Minute – oder rufen Sie uns an. Wir melden uns auch gerne bei Ihnen zurück.',
  'standortwahl.hinweis':
    'Sprechzeiten, Telefonnummern und das Behandlungsangebot unterscheiden sich je Standort – deshalb fragen wir lieber, statt zu raten.',
} as const;

export type TextSchluessel = keyof typeof TEXTE;
