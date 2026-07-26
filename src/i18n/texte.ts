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
} as const;

export type TextSchluessel = keyof typeof TEXTE;
