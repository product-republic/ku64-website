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
  'geruest.rechtliches': 'Rechtliches',
  'geruest.aktuell': 'aktuell',

  // ── Navigation ──────────────────────────────────────────────────────
  'nav.behandlungen': 'Leistungen',
  'nav.praxis': 'Praxis',
  'nav.team': 'Team',
  'nav.anfahrt': 'Anfahrt',
  'nav.kontakt': 'Kontakt',
  'nav.standorte': 'Standorte',
  'nav.standortWaehlen': 'Bitte wählen Sie Ihren Standort für passende Angaben.',
  'nav.andererStandort': 'Anderer Standort',
  'nav.standortWaehlenKurz': 'Standort wählen',
  'nav.ueberKu64': 'Über KU64',
  'nav.zurStartseiteOrt': 'KU64 {ort}, zur Startseite',
  'nav.zurStartseite': 'KU64, zur Startseite',
  'nav.sieSehen': 'Sie sehen',
  /* ── Leistungsseiten ────────────────────────────────────────────────
   *
   * Standen bis eben fest in den Vorlagen. Der Katalog meldete deshalb 99,9
   * Prozent Übersetzung, und auf der englischen Seite stand trotzdem „Wo
   * möchten Sie teeth whitening lassen?" – ein Satz, der nie ein Baustein
   * war. Der Sprachwächter konnte ihn nicht vermissen.
   */
  'leistung.oder': 'oder',
  'leistung.dauer': 'Dauer',
  'leistung.kosten': 'Kosten',
  'leistung.verfuegbarAn': 'Verfügbar an',
  'leistung.vonStandorten': '{wo} von {gesamt} Standorten',
  'leistung.woLassen': 'Wo möchten Sie {name} lassen?',
  'leistung.standortWaehlen':
    'Wählen Sie Ihren Standort – dort finden Sie Sprechzeiten, Telefonnummer und die Terminbuchung für genau diese Leistung.',
  'leistung.hierAnsehen': '{name} hier ansehen',
  'leistung.nichtAngebotenAn': 'Nicht angeboten an:',
  'leistung.nichtAngebotenHinweis':
    'Wir sagen das offen, damit Sie nicht vergeblich dort anrufen.',
  'leistung.kasse': 'Krankenkasse',
  'leistung.ablauf': 'So läuft es ab',
  'leistung.synonyme': 'Auch bekannt als',
  'leistung.haeufigeFragen': '{name}: häufige Fragen',
  'leistung.ausfuehrlich': '{name} ausführlich',
  'leistung.imEinzelnen': '{name} im Einzelnen',
  'leistung.zurueckZur': 'Zurück zu {name}',
  'leistung.teilVon': 'Dieser Text gehört zu {name}.',
  'leistung.woErhaeltlich': 'Wo Sie {name} bekommen',
  'leistung.passtDazu': 'Passt dazu',
  'leistung.ansprechperson': 'Ihre Ansprechperson',
  'leistung.ansprechpersonen': 'Ihre Ansprechpersonen',
  'leistung.beschwerdenHierher': 'Beschwerden, die hierher führen',
  'leistung.terminFuer': 'Termin für {name}',
  'leistung.onlineBuchen': 'Online buchen',
  'leistung.ergaenzend': 'Ergänzend – an anderen Standorten',
  'leistung.inOrt': 'in {ort}',
  'leistung.termin': 'Termin',
  'leistung.anAnderenStandorten': '{name} an anderen KU64-Standorten',
  'leistung.sieSehenAngaben':
    'Sie sehen gerade die Angaben für KU64 {ort}. Diese Leistung bieten wir auch hier an – falls Ihnen ein anderer Standort besser passt:',
  'leistung.beraterHinweisVor': 'Fragen vorab? Unser',
  'leistung.beraterHinweisLink': 'digitaler Berater',
  'leistung.beraterHinweisNach': 'antwortet rund um die Uhr – auch zu {name}.',
  'leistung.ergaenzendText':
    'Diese Leistungen hängen mit {name} zusammen, werden bei KU64 {ort} aber nicht angeboten. Wir sagen Ihnen offen, wo Sie sie bekommen.',

  /* ── Brotkrumen ───────────────────────────────────────────────────────
   *
   * Sie stehen auf jeder einzelnen Seite und waren auf jeder deutsch.
   */
  'krume.start': 'Start',
  'krume.leistungen': 'Leistungen',
  'krume.beschwerden': 'Beschwerden',
  'krume.team': 'Team',
  'blog.aufDieserSeite': 'Auf dieser Seite',
  'blog.weiterlesen': 'Weiterlesen',
  'orte.seitentitel': 'Unsere Standorte',
  'orte.beschreibung':
    'KU64 an {anzahl} Standorten in Berlin und Potsdam. Mit Vergleich, welche Leistung an welchem Standort angeboten wird.',
  'orte.behandlungen': 'Leistungen',
  'orte.nichtVerfuegbar': 'nicht verfügbar',
  'krume.blog': 'Blog',
  'fuss.behandlungsbereiche': 'Leistungsbereiche',
  'fuss.haeufigGesucht': 'Häufig gesucht',
  'fuss.unsereStandorte': 'Unsere Standorte',
  'fuss.aktuellGewaehlt': '(aktuell gewählt)',
  'fuss.impressum': 'Impressum',
  'fuss.datenschutz': 'Datenschutz',
  'fuss.kiTransparenz': 'KI-Transparenz',
  'fuss.barrierefreiheit': 'Barrierefreiheit',
  'fuss.cookieEinstellungen': 'Cookie-Einstellungen',
  'fuss.oeffnungszeitenVon': 'Sprechzeiten KU64 {name}',
  'praxis.behandlungen': 'Leistungen',
  'praxis.behandelnde': 'Behandelnde',
  'praxis.ausFachbereichen': 'aus {anzahl} Fachbereichen',
  'karte.dauer': 'Dauer',
  'karte.kosten': 'Kosten',
  'start.seitentitel': 'Zahnarzt in Berlin und Potsdam',
  'anamnesez.beschreibung':
    'Den Anamnesebogen vorab digital ausfüllen – an allen KU64-Standorten in Berlin und Potsdam.',
  'anamnesez.woTermin': 'Wo haben Sie Ihren Termin?',
  'notfallz.seitentitel': 'Zahnärztlicher Notfall',
  'suchez.beschreibung':
    'Leistungen, Beschwerden, Standorte und Menschen bei KU64 finden – mit den Wörtern, die Sie verwenden.',
  'kontaktz.beschreibung':
    'So erreichen Sie KU64 – alle Standorte in Berlin und Potsdam mit Telefonnummern, Adressen und Sprechzeiten.',
  'blogz.nachStandort': 'Beiträge nach Standort',
  'beschwerde.herkunft':
    'Dieser Text stammt aus dem Bestand der Praxis und ersetzt keine Untersuchung: Was Ihre Beschwerden verursacht, lässt sich erst am Behandlungsstuhl feststellen.',
  'laecheln.beschreibung':
    'Laden Sie ein Foto hoch und sehen Sie eine unverbindliche Visualisierung Ihres Lächelns. Ihr Bild wird nicht gespeichert.',
  'laecheln.fotoWaehlen': 'Foto auswählen oder hierher ziehen',
  'laecheln.adressePlatzhalter': 'ihre@adresse.de',
  'laecheln.vergleich': 'Vergleich zwischen Ausgangsfoto und Visualisierung',
  'standortwahl.bitteWaehlen': 'Bitte wählen Sie Ihren Standort',
  'beratungz.beschreibung':
    'Sprechen oder schreiben Sie mit unserem digitalen Berater – rund um die Uhr, zu Leistungen, Kosten und Abläufen bei KU64.',
  'ki.beschreibung':
    'Welche KI-Systeme auf dieser Website arbeiten, wofür, mit welchen Daten – und wie Sie stattdessen einen Menschen erreichen.',
  'notfallz.beschreibungLang':
    'Akute Zahnschmerzen, Schwellung oder ein ausgeschlagener Zahn? Hier finden Sie sofort die richtige Nummer und die wichtigsten Sofortmaßnahmen.',
  'krume.kontakt': 'Kontakt',
  'krume.notfall': 'Notfall',
  'krume.ueberKu64': 'Über KU64',
  'krume.cookieEinstellungen': 'Cookie-Einstellungen',
  'krume.laechelnVorschau': 'Lächeln-Vorschau',
  'krume.digitaleAnamnese': 'Digitale Anamnese',
  'krume.diePraxis': 'Die Praxis',
  'krume.anfahrt': 'Anfahrt',
  'krume.weitere': 'Weitere',
  /* Titel und Kurztexte der Einträge im Suchindex. Die Suchbegriffe selbst
     (das starke Feld) bleiben deutsch: Sie sind von Hand gepflegt und
     müssten je Sprache neu gedacht werden, nicht übersetzt. */
  'suchindex.notfall': 'Zahnärztlicher Notfall',
  'suchindex.notfallKurz': 'Was jetzt zu tun ist – und wen Sie sofort erreichen.',
  'suchindex.termine': 'Termin buchen',
  'suchindex.termineKurz': 'Online einen Termin vereinbaren.',
  'suchindex.standorte': 'Unsere Standorte',
  'suchindex.standorteKurz': 'Vier Praxen in Berlin und Potsdam.',
  'suchindex.kontakt': 'Kontakt',
  'suchindex.kontaktKurz': 'Telefon, E-Mail und Formular.',
  'suchindex.anamnese': 'Anamnesebogen',
  'suchindex.anamneseKurz': 'Vor dem ersten Termin ausfüllen – spart Zeit in der Praxis.',
  'suchindex.beratung': 'Digitale Beratung',
  'suchindex.beratungKurz': 'Sprechen oder schreiben Sie mit unserem digitalen Berater.',
  'suchindex.karriere': 'Karriere bei KU64',
  'suchindex.karriereKurz': 'Offene Stellen und Ausbildung.',
  'suchindex.laecheln': 'Lächeln-Vorschau',
  'suchindex.laechelnKurz': 'Aus Ihrem Foto eine unverbindliche Illustration.',
  'suchindex.ueberUns': 'Über KU64',
  'suchindex.ueberUnsKurz': 'Die Praxis, die Architektur, die Geschichte.',
  'suchindex.kiTransparenz': 'KI-Transparenz',
  'suchindex.kiTransparenzKurz': 'Welche KI-Systeme hier arbeiten, wofür und mit welchen Daten.',
  'suchindex.datenschutz': 'Datenschutz',
  'suchindex.datenschutzKurz': 'Wie wir mit Ihren Daten umgehen.',
  'suchindex.impressum': 'Impressum',
  'suchindex.impressumKurz': 'Anbieterkennzeichnung.',
  'suchindex.barrierefreiheit': 'Barrierefreiheit',
  'suchindex.barrierefreiheitKurz': 'Erklärung zur Barrierefreiheit dieser Website.',
  'krume.suche': 'Suche',
  'krume.datenschutz': 'Datenschutz',
  'krume.impressum': 'Impressum',
  'krume.barrierefreiheit': 'Barrierefreiheit',
  'krume.kiTransparenz': 'KI-Transparenz',
  'krume.karriere': 'Karriere',
  'krume.standorte': 'Standorte',
  'krume.digitaleBeratung': 'Digitale Beratung',

  /* ── Fußzeile und Berater ─────────────────────────────────────────────
   *
   * Beide stehen auf JEDER Seite. Sie waren damit der Posten mit der
   * größten Reichweite unter den fest verdrahteten Texten.
   */
  'fuss.service': 'Service',
  'fuss.oeffnungszeiten': 'Öffnungszeiten',
  'fuss.digitaleAnamnese': 'Digitale Anamnese',
  'fuss.laechelnVorschau': 'Lächeln-Vorschau',
  'fuss.beschwerdenAZ': 'Zahnbeschwerden A–Z',
  'fuss.notfall': 'Zahnärztlicher Notfall',
  'fuss.karriere': 'Karriere',

  'berater.oeffnen': 'Fragen? Berater öffnen',
  'berater.wieDasFunktioniert': 'Wie das funktioniert',
  'berater.ihreFrage': 'Ihre Frage',
  'berater.eingabeHinweis': 'Ihre Frage eingeben…',
  'berater.standortWaehlen': 'Bitte Standort wählen',
  'berater.schliessen': 'Berater schließen',
  'berater.frageSenden': 'Frage senden',
  /* Diese vier tragen einen Telefonverweis mitten im Satz. Der Verweis kommt
     als {telefon} herein; die Auszeichnung baut die Vorlage, nicht der
     Katalog. Getrennt zu übersetzen wäre nicht möglich – im Englischen steht
     die Nummer an anderer Stelle. */
  'berater.menschUnter': 'Einen Menschen erreichen Sie unter {telefon}.',
  'berater.begruessungOrt':
    'Guten Tag! Ich beantworte Ihre Fragen zu Leistungen, Kosten und Abläufen bei KU64 {ort}. Was möchten Sie wissen?',
  'berater.begruessung':
    'Guten Tag! Ich beantworte Ihre Fragen zu Leistungen, Kosten und Abläufen bei KU64. Was möchten Sie wissen?',
  'berater.keineDiagnosenOrt':
    'Ich stelle keine Diagnosen und brauche keine persönlichen Daten von Ihnen. Bei starken Schmerzen rufen Sie uns bitte direkt an unter {telefon}.',
  'berater.keineDiagnosen':
    'Ich stelle keine Diagnosen und brauche keine persönlichen Daten von Ihnen. Bei starken Schmerzen rufen Sie uns bitte direkt an.',

  /* ── Notfallseite ─────────────────────────────────────────────────── */
  'notfall.112Anrufen': '112 anrufen',
  'notfall.aRztlicherBereitschaftsdienstBundesweit': '. Ärztlicher Bereitschaftsdienst bundesweit:',
  'notfall.anrufenUndSituationSchildern': 'Anrufen und Situation schildern',
  'notfall.atemnotSchluckbeschwerdenOderStarke': 'Atemnot, Schluckbeschwerden oder starke Schwellung am Hals?',
  'notfall.aufDerAnderenSeite': 'Auf der anderen Seite kauen',
  'notfall.ausgeschlagenerZahn': 'Ausgeschlagener Zahn',
  'notfall.ausserhalbUnsererSprechzeiten': 'Außerhalb unserer Sprechzeiten:',
  'notfall.beiAtemOderSchluckproblemen': 'Bei Atem- oder Schluckproblemen: 112',
  'notfall.beiFieberOderRascher': 'Bei Fieber oder rascher Zunahme sofort anrufen',
  'notfall.beiSchmerzAufKa': 'Bei Schmerz auf Kälte: Nerv ist beteiligt, zügig kommen',
  'notfall.bereichGutSauberHalten': 'Bereich gut sauber halten',
  'notfall.blutungNachEinemEingriff': 'Blutung nach einem Eingriff',
  'notfall.bruchstuCkAufbewahrenFeucht': 'Bruchstück aufbewahren, feucht halten',
  'notfall.dasIstEinMedizinischer': 'Das ist ein medizinischer Notfall. Wählen Sie sofort den Rettungsdienst – warten Sie nicht auf einen Zahnarzttermin.',
  'notfall.dieseHinweiseErsetzenKeine': 'Diese Hinweise ersetzen keine Untersuchung. Sie sollen die Zeit bis zum Termin überbrücken – nicht ihn ersetzen.',
  'notfall.haUfigeFragenIm': 'Häufige Fragen im Notfall',
  'notfall.hoRtEsNicht': 'Hört es nicht auf: anrufen',
  'notfall.immerAbklaRenLassen': 'Immer abklären lassen, auch ohne starke Schmerzen',
  'notfall.inZahnrettungsboxSonstKalte': 'In Zahnrettungsbox, sonst kalte H-Milch, notfalls Speichel',
  'notfall.innerhalbDerErstenStunde': 'Innerhalb der ersten Stunde zu uns kommen',
  'notfall.keineWaRmeKein': 'Keine Wärme, kein Alkohol',
  'notfall.kopfHochKoRperliche': 'Kopf hoch, körperliche Anstrengung vermeiden',
  'notfall.kopfHochlagernAuchBeim': 'Kopf hochlagern, auch beim Schlafen',
  'notfall.kroneOderFuLlung': 'Krone oder Füllung verloren',
  'notfall.kuHlenNichtWa': 'Kühlen, nicht wärmen',
  'notfall.nichtSaUbernNicht': 'Nicht säubern, nicht abschrubben, nicht in Wasser legen',
  'notfall.nichtSpuLenNicht': 'Nicht spülen, nicht ausspucken, nicht nachschauen',
  'notfall.rufenSieUnsAn': 'Rufen Sie uns an – wir halten Termine frei',
  'notfall.sauberesTuchOderMulltupfer': 'Sauberes Tuch oder Mulltupfer fest aufbeißen, 20 Minuten',
  'notfall.scharfeKanteMitWachs': 'Scharfe Kante mit Wachs oder Kaugummi abdecken',
  'notfall.schmerzmittelNachPackungsbeilageNie': 'Schmerzmittel nach Packungsbeilage, nie auf das Zahnfleisch legen',
  'notfall.schwellungImGesicht': 'Schwellung im Gesicht',
  'notfall.sofortmassnahmen': 'Sofortmaßnahmen',
  'notfall.starkeSchmerzen': 'Starke Schmerzen',
  'notfall.teilAufbewahrenUndMitbringen': 'Teil aufbewahren und mitbringen',
  'notfall.vonAussenKuHlen': 'Von außen kühlen, mit Tuch dazwischen, in Intervallen',
  'notfall.zahnAbgebrochen': 'Zahn abgebrochen',
  'notfall.zahnNurAnDer': 'Zahn nur an der Krone anfassen, nie an der Wurzel',
  'notfall.zahnaRztlicherNotdienstBerlin': 'zahnärztlicher Notdienst Berlin unter',
  'notfall.zahnaRztlicherNotfall': 'Zahnärztlicher Notfall',
  'notfall.zeitnahTerminVereinbarenMeist': 'Zeitnah Termin vereinbaren – meist kein Notfall',

  /* ── Weitere Seiten ───────────────────────────────────────────────── */
  'beratung.allgemeinNochUnentschieden': 'Allgemein / noch unentschieden',
  'beratung.beiStarkenSchmerzenSchwellung': 'Bei starken Schmerzen, Schwellung im Gesicht oder Fieber: bitte direkt anrufen. Bei Atem- oder Schluckbeschwerden den Rettungsdienst unter 112.',
  'beratung.bereitKlickenSieUm': 'Bereit. Klicken Sie, um das Gespräch zu starten.',
  'beratung.chatOeffnen': 'Chat öffnen',
  'beratung.derChatUntenRechts': 'Der Chat unten rechts beantwortet dieselben Fragen – in Textform, ohne Mikrofon.',
  'beratung.fragenZuEinerBehandlung': 'Fragen zu einer Leistung, zu Kosten oder zum Ablauf? Stellen Sie sie laut – der Berater antwortet in natürlicher Sprache und kennt das Angebot jedes Standorts.',
  'beratung.fragenZurDigitalenBeratung': 'Fragen zur digitalen Beratung',
  'beratung.gespraechStarten': 'Gespräch starten',
  'beratung.ihrBrowserFragtDanach': 'Ihr Browser fragt danach nach der Erlaubnis für das Mikrofon. Ohne Ihre Zustimmung passiert nichts.',
  'beratung.keineDiagnoseUndKeine': 'Keine Diagnose und keine Beurteilung von Beschwerden',
  'beratung.keineTerminbuchungUndKeine': 'Keine Terminbuchung und keine Aufnahme persönlicher Daten',
  'beratung.keineZusagenZuBehandlungsergebnissen': 'Keine Zusagen zu Behandlungsergebnissen',
  'beratung.lieberMitEinemMenschen': 'Lieber mit einem Menschen?',
  'beratung.lieberSchreiben': 'Lieber schreiben?',
  'beratung.rundUmDieUhr': 'Rund um die Uhr',
  'beratung.selbstverstaendlichRufenSieDen': 'Selbstverständlich. Rufen Sie den Standort an, der Ihnen am nächsten liegt:',
  'beratung.sprechenSieMitUnserem': 'Sprechen Sie mit unserem digitalen Berater',
  'beratung.wasDerBeraterNicht': 'Was der Berater nicht tut',
  'beratung.welchesSystemHierArbeitet': 'Welches System hier arbeitet',
  'beratung.zuWelchemStandortHaben': 'Zu welchem Standort haben Sie Fragen?',
  'karriere.seitentitel': 'Karriere bei KU64',
  'karriere.beschreibung':
    'Offene Stellen und Initiativbewerbung bei KU64 in Berlin und Potsdam.',
  'karriere.portalHinweis':
    'Sie erreichen alle Ausschreibungen direkt im {portal} – oder Sie schreiben uns einfach, welcher Bereich und welcher Standort Sie interessieren.',
  'karriere.stellenportal': 'Stellenportal',
  'karriere.eineStelle': 'Eine offene Stelle',
  'karriere.mehrereStellen': '{anzahl} offene Stellen',
  'karriere.arbeitenBeiKu64': 'Arbeiten bei KU64',
  'karriere.bewerbungSenden': 'Bewerbung senden',
  'karriere.dieAusschreibungenLiegenBei': 'Die Ausschreibungen liegen bei Personio. Erst wenn Sie eine davon öffnen, verlassen Sie diese Website – auf dieser Seite wird keine Verbindung dorthin aufgebaut.',
  'karriere.dieStellenuebersichtIstGerade': 'Die Stellenübersicht ist gerade nicht erreichbar.',
  'karriere.initiativBewerben': 'Initiativ bewerben',
  'karriere.ueberInitiativbewerbungenFreuenWir': 'Über Initiativbewerbungen freuen wir uns trotzdem – gute Leute stellen wir auch außerhalb einer Ausschreibung ein.',
  'karriere.zurAusschreibung': 'Zur Ausschreibung',
  'karriere.zurzeitIstKeineStelle': 'Zurzeit ist keine Stelle ausgeschrieben.',
  'kitrans.beidesBeantwortetEinMensch': '. Beides beantwortet ein Mensch.',
  'kitrans.dasIstKeineAusweichloesung': 'Das ist keine Ausweichlösung, sondern der normale Weg. Rufen Sie den Standort an, der Ihnen am nächsten liegt:',
  'kitrans.dieseAngabenSetzenArtikel': 'Diese Angaben setzen Artikel 50 der Verordnung (EU) 2024/1689 über künstliche Intelligenz um. Der Artikel verlangt dreierlei: Wer mit einem KI-System interagiert, muss das spätestens bei der ersten Interaktion erfahren. Erzeugte Inhalte müssen maschinenlesbar als solche gekennzeichnet sein. Und veränderte Bilder von Menschen müssen auch sichtbar gekennzeichnet sein.',
  'kitrans.dreiSystemeUndWir': 'Drei Systeme, und wir sagen bei jedem, was es tut, wer es betreibt und was mit Ihren Eingaben geschieht. Sie müssen keines davon benutzen: Alles, was sie beantworten, beantwortet Ihnen auch jemand am Telefon.',
  'kitrans.erBleibtDamitAuch': '. Er bleibt damit auch dann erhalten, wenn das Bild diese Website verlässt – per E-Mail, weitergeleitet, gespeichert.',
  'kitrans.fuerDieLaechelnVorschau': 'Für die Lächeln-Vorschau heißt das konkret: Der Hinweis steht in einem Streifen am Bild und zusätzlich in der Bilddatei selbst, als IPTC-Angabe',
  'kitrans.oderSchriftlichUeberDas': 'Oder schriftlich über das',
  'kitrans.rechtlicherRahmen': 'Rechtlicher Rahmen',
  'kitrans.wasNichtPassiert': 'Was nicht passiert',
  'kitrans.wasUebertragenWird': 'Was übertragen wird',
  'kitrans.welcheDiensteBeimAufruf': '. Welche Dienste beim Aufruf geladen werden, in den',
  'kitrans.wennSieMitEinem': 'Wenn Sie mit einem Menschen sprechen möchten',
  'kitrans.wieIhreDatenVerarbeitet': 'Wie Ihre Daten verarbeitet werden, steht in der',
  'kitrans.woAufDieserWebsite': 'Wo auf dieser Website KI arbeitet',
  'kitrans.woSieIhmBegegnen': 'Wo Sie ihm begegnen',
  'laecheln.anderesFotoProbieren': 'Anderes Foto probieren',
  'laecheln.beratungsterminVereinbaren': 'Beratungstermin vereinbaren',
  'laecheln.dasIstKeinBehandlungsergebnis': 'Das ist kein Behandlungsergebnis.',
  'laecheln.deutlichLaechelnSodassDie': 'Deutlich lächeln, sodass die oberen Zähne sichtbar sind',
  'laecheln.dieBerechnungDauertEtwa': 'Die Berechnung dauert etwa 15 bis 40 Sekunden.',
  'laecheln.dieDarstellungIstEine': 'Die Darstellung ist eine Illustration und keine Zusage. Ob und wie sich etwas Ähnliches umsetzen lässt, kann nur eine persönliche Untersuchung zeigen. Ihre Zahnsubstanz, Ihr Zahnfleisch und Ihre Kieferverhältnisse entscheiden darüber – nicht ein Bild.',
  'laecheln.dieVerbindlichePlanungMit': 'Die verbindliche Planung mit Vorschau im eigenen Mund.',
  'laecheln.digitalesSmileDesign': 'Digitales Smile Design',
  'laecheln.einVeraendertesLaechelnEntsteht': 'Ein verändertes Lächeln entsteht je nach Ausgangslage über verschiedene Wege. Diese Leistungen kommen dafür am häufigsten infrage:',
  'laecheln.fotoAuswaehlen': 'Foto auswählen',
  'laecheln.fotoHierherZiehen': 'Foto hierher ziehen',
  'laecheln.fotoWirdAnalysiert': 'Foto wird analysiert…',
  'laecheln.fragenZurLaechelnVorschau': 'Fragen zur Lächeln-Vorschau',
  'laecheln.frontalInDieKamera': 'Frontal in die Kamera, Kopf gerade',
  'laecheln.gleichmaessigesLichtKeinHartes': 'Gleichmäßiges Licht, kein hartes Gegenlicht',
  'laecheln.ichBinVolljaehrigUnd': 'Ich bin volljährig und das Foto zeigt mich selbst. Ich lade keine Fotos anderer Personen hoch.',
  'laecheln.ichWilligeAusdruecklichEin': 'Ich willige ausdrücklich ein, dass mein Foto zur Erstellung einer unverbindlichen Lächeln-Vorschau verarbeitet wird. Mir ist bewusst, dass es sich dabei um ein biometrisches Datum handelt. Ich kann diese Einwilligung jederzeit widerrufen. Details in der',
  'laecheln.ihrFoto': 'Ihr Foto',
  'laecheln.ihrWunschstandort': 'Ihr Wunschstandort',
  'laecheln.ihreVorschauErscheintHier': 'Ihre Vorschau erscheint hier.',
  'laecheln.jpegPngOderWebp': 'JPEG, PNG oder WebP · maximal 8 MB',
  'laecheln.keineFilterKeineBeauty': 'Keine Filter, keine Beauty-Modi der Kamera-App',
  'laecheln.keramikschalenFuerFormUnd': 'Keramikschalen für Form und Farbe der Frontzähne.',
  'laecheln.ladenSieEinPortraetfoto': 'Laden Sie ein Porträtfoto hoch. Wir analysieren Zahnform, Farbe und Lachlinie im Verhältnis zu Ihrem Gesicht und zeigen Ihnen eine Visualisierung – im Browser und auf Wunsch per E-Mail.',
  'laecheln.mehrereNuancenHellerOhne': 'Mehrere Nuancen heller, ohne den Schmelz anzugreifen.',
  'laecheln.nichtsVorDemMund': 'Nichts vor dem Mund – keine Hand, keine Maske',
  'laecheln.nochNichtEntschieden': 'Noch nicht entschieden',
  'laecheln.oderKlickenZumAuswaehlen': 'oder klicken zum Auswählen',
  'laecheln.sehenSieIhrLaecheln': 'Sehen Sie Ihr Lächeln, bevor Sie sich entscheiden',
  'laecheln.unsichtbareSchienen': 'Unsichtbare Schienen',
  'laecheln.unverbindlicheIllustrationKeinBehandlungsergebnis': 'Unverbindliche Illustration, kein Behandlungsergebnis und keine medizinische Beratung.',
  'laecheln.unverbindlicheVisualisierung': 'Unverbindliche Visualisierung',
  'laecheln.vorschauErstellen': 'Vorschau erstellen',
  'laecheln.wasDanachMoeglichIst': 'Was danach möglich ist',
  'laecheln.wasMachtEinGutes': 'Was macht ein gutes Foto aus?',
  'laecheln.wohinDuerfenWirDas': 'Wohin dürfen wir das Ergebnis senden?',
  'laecheln.zahnstellungKorrigierenOhneFeste': 'Zahnstellung korrigieren, ohne feste Spange.',
  'suche.alleBehandlungenNachBereich': 'Alle Leistungen nach Bereich',
  'suche.aufEineFrageIst': 'Auf eine Frage ist eine Liste die falsche Antwort. Unser digitaler Berater beantwortet sie Ihnen – und wenn Sie lieber mit einem Menschen sprechen, steht die Nummer Ihres Standorts oben.',
  'suche.behandlungenBeschwerdenStandorteUnd': 'Leistungen, Beschwerden, Standorte und Menschen. Sie können den Fachbegriff eingeben – müssen aber nicht.',
  'suche.dasKlingtNachEiner': 'Das klingt nach einer Frage.',
  'suche.frageAnDenBerater': 'Frage an den Berater',
  'suche.lochImZahn': 'loch im zahn',
  'suche.suchenSieNachEinem': 'Suchen Sie nach einem Symptom statt nach einer Leistung?',
  'suche.zahnspangePotsdam': 'zahnspange potsdam',
  'suche.zuDenBeschwerden': 'Zu den Beschwerden',
  'suche.zumAusprobieren': 'Zum Ausprobieren:',
  'ueber.anVierStandorten': 'an vier Standorten',
  'ueber.angstErnstNehmen': 'Angst ernst nehmen',
  'ueber.ehrlichStattWerbend': 'Ehrlich statt werbend',
  'ueber.imTeam': 'Im Team',
  'ueber.inBerlinUndPotsdam': 'in Berlin und Potsdam',
  'ueber.mitProphylaxeAssistenzEmpfang': 'mit Prophylaxe, Assistenz, Empfang und Verwaltung',
  'ueber.sehrVieleMenschenSchieben': 'Sehr viele Menschen schieben den Zahnarztbesuch auf. Bei uns ist der erste Termin ein Gespräch, keine Behandlung. Sie bestimmen das Tempo, und ein vereinbartes Handzeichen unterbricht jederzeit.',
  'ueber.spezialisierungUnterEinemDach': 'Spezialisierung unter einem Dach',
  'ueber.ueberKu64': 'Über KU64',
  'ueber.unsereStandorte': 'Unsere Standorte',
  'ueber.vonProphylaxeUeberKieferorthopaedie': 'Von Prophylaxe über Kieferorthopädie bis zur Oralchirurgie – für die meisten Leistungen müssen Sie die Praxis nicht wechseln. Was ein Standort nicht abdeckt, übernimmt ein anderer.',
  'ueber.wirSagenOffenWas': 'Wir sagen offen, was eine Leistung kostet, was die Kasse übernimmt und was nicht – und auch, wenn eine Leistung an einem Standort gar nicht angeboten wird. Lieber ein Satz zu viel als ein vergeblicher Anruf.',
  'ueber.wofuerWirStehen': 'Wofür wir stehen',
  'ueber.zahnaerztinnenUndZahnaerzte': 'Zahnärztinnen und Zahnärzte',

  /* ── Standortseiten ───────────────────────────────────────────────── */
  'anamnese.absendenFertig': 'Absenden – fertig',
  'anamnese.allergienGegenBetaeubungsmittelOder': 'Allergien gegen Betäubungsmittel oder Antibiotika',
  'anamnese.anAllenKu64Standorten': 'An allen KU64-Standorten',
  'anamnese.anamneseVorabAusfuellen': 'Anamnese vorab ausfüllen',
  'anamnese.anamnesebogenOeffnen': 'Anamnesebogen öffnen',
  'anamnese.angabenMachen': 'Angaben machen',
  'anamnese.bisphosphonateOderOsteoporoseTherapie': 'Bisphosphonate oder Osteoporose-Therapie',
  'anamnese.bitteUnbedingtAngeben': 'Bitte unbedingt angeben',
  'anamnese.blutverduennendeMedikamente': 'Blutverdünnende Medikamente',
  'anamnese.dasSolltenSieBereithalten': 'Das sollten Sie bereithalten',
  'anamnese.diesePunkteAendernKonkret': 'Diese Punkte ändern konkret, wie wir behandeln dürfen – bitte auch dann nennen, wenn sie Ihnen nebensächlich erscheinen:',
  'anamnese.formularOeffnen': 'Formular öffnen',
  'anamnese.fragenZurDigitalenAnamnese': 'Fragen zur digitalen Anamnese',
  'anamnese.herzklappenersatzOderHerzerkrankungen': 'Herzklappenersatz oder Herzerkrankungen',
  'anamnese.ihreAngabenGehenVerschluesselt': 'Ihre Angaben gehen verschlüsselt in unser Praxissystem. Beim Termin ist alles schon da.',
  'anamnese.marcumarOderAntikoagulanzienAusweis': 'Marcumar- oder Antikoagulanzien-Ausweis',
  'anamnese.medikamentenplanFallsVorhanden': 'Medikamentenplan, falls vorhanden',
  'anamnese.mitDemOeffnenWechseln': 'Mit dem Öffnen wechseln Sie zu Nelly Solutions, unserem Dienstleister für digitale Patientenformulare. Dort gelten deren Datenschutzhinweise ergänzend zu',
  'anamnese.nochNichtFreigeschaltet': 'Noch nicht freigeschaltet.',
  'anamnese.oeffnetInNeuemTab': '(öffnet in neuem Tab bei Nelly Solutions)',
  'anamnese.schwangerschaftOderStillzeit': 'Schwangerschaft oder Stillzeit',
  'anamnese.sieBrauchenWederKonto': 'Sie brauchen weder Konto noch App – ein Link genügt.',
  'anamnese.vorbefundeOderRoentgenbilderAnderer': 'Vorbefunde oder Röntgenbilder anderer Praxen',
  'anamnese.vorerkrankungenMedikamenteAllergienHalten': 'Vorerkrankungen, Medikamente, Allergien. Halten Sie Ihren Medikamentenplan bereit, falls Sie regelmäßig etwas einnehmen.',
  'anfahrt.mitDemAuto': 'Mit dem Auto',
  'anfahrt.mitOeffentlichenVerkehrsmitteln': 'Mit öffentlichen Verkehrsmitteln',
  'anfahrt.routePlanen': 'Route planen',
  'kontakt.anfahrtAnsehen': 'Anfahrt ansehen',
  'kontakt.beiAkutenBeschwerden': 'Bei akuten Beschwerden',
  'kontakt.chatOeffnen': 'Chat öffnen',
  'kontakt.derSchnellsteWegBesonders': 'Der schnellste Weg – besonders bei Schmerzen oder wenn es dringend ist.',
  'kontakt.fragenVorab': 'Fragen vorab',
  'kontakt.freieTermineSehenUnd': 'Freie Termine sehen und direkt buchen, rund um die Uhr.',
  'kontakt.fuerAllesWasNicht': 'Für alles, was nicht eilt. Bitte schicken Sie uns keine Gesundheitsdaten per unverschlüsselter E-Mail.',
  'kontakt.onlineBuchen': 'Online buchen',
  'kontakt.rufenSieBitteAn': 'rufen Sie bitte an, statt zu schreiben. Bei Atem- oder Schluckbeschwerden, starker Schwellung oder hohem Fieber wählen Sie den Rettungsdienst unter 112. Mehr dazu unter',
  'kontakt.unserDigitalerBeraterBeantwortet': 'Unser digitaler Berater beantwortet Fragen zu Leistungen, Kosten und Abläufen – per Text oder Sprache.',
  'kontakt.waehlenSieDenWeg': 'Wählen Sie den Weg, der Ihnen am angenehmsten ist. Alle führen zum selben Team.',
  'kontakt.zurTerminbuchung': 'Zur Terminbuchung',
  'ort.anfahrtParken': 'Anfahrt & Parken',
  'ort.detaillierteAnfahrt': 'Detaillierte Anfahrt',
  'ort.mitDemAuto': 'Mit dem Auto',
  'ort.nichtAnDiesemStandort': 'Nicht an diesem Standort',
  'ort.oeffentlicheVerkehrsmittel': 'Öffentliche Verkehrsmittel',
  'ort.terminBuchen': 'Termin buchen',
  'ort.wasDiesenStandortAusmacht': 'Was diesen Standort ausmacht',
  'praxis.dieRaeume': 'Die Räume',
  'praxis.wasDiesenStandortAusmacht': 'Was diesen Standort ausmacht',
  'termine.akuteSchmerzen': 'Akute Schmerzen?',
  'termine.anDiesemStandortGibt': 'An diesem Standort gibt es getrennte Kalender. Bitte wählen Sie den passenden Bereich – so landen Sie direkt bei den richtigen Behandelnden.',
  'termine.bitteRufenSieAn': 'Bitte rufen Sie an, statt online zu buchen. Wir halten Termine für Akutfälle frei und schätzen am Telefon ein, wie dringend es ist.',
  'termine.denAnamnesebogenFuellenSie': 'Den Anamnesebogen füllen Sie bequem von zu Hause aus – an allen KU64-Standorten. Das spart Zeit im Wartezimmer und Sie können in Ruhe nachschauen, welche Medikamente Sie nehmen.',
  'termine.doctolibIstEinEigenstaendiger': 'Doctolib ist ein eigenständiger Dienst. Erst wenn Sie dort ankommen, werden Ihre IP-Adresse übertragen und Cookies gesetzt – auf dieser Seite passiert das nicht. Mehr dazu in unserer',
  'termine.fragenZurTerminbuchung': 'Fragen zur Terminbuchung',
  'termine.lieberOhneOnlinePortal': 'Lieber ohne Online-Portal?',
  'termine.oeffnetDenKalenderBei': 'Öffnet den Kalender bei Doctolib in einem neuen Tab',
  'termine.onlineBuchen': 'Online buchen',
  'termine.schildernSieKurzIhr': 'Schildern Sie kurz Ihr Anliegen – wir melden uns zurück, in der Regel am selben oder nächsten Werktag.',
  'termine.vorDemTerminAnamnese': 'Vor dem Termin: Anamnese digital ausfüllen',
  'termine.wannSieUnsErreichen': 'Wann Sie uns erreichen',
  'termine.wasTunImNotfall': 'Was tun im Notfall',
  'termine.zurDigitalenAnamnese': 'Zur digitalen Anamnese',

  /* ── Übersichten, Team, Blog, Beschwerden ────────────────────────── */
  'anamnesez.digitaleAnamnese': 'Digitale Anamnese',
  'anamnesez.fuenfMinutenZuHause': 'Fünf Minuten zu Hause statt Klemmbrett im Wartezimmer – an allen unseren Standorten.',
  'beschw.dannLesenSieHier': 'Dann lesen Sie hier nicht weiter. Wir halten an jedem Standort Zeiten für Schmerzpatientinnen und -patienten frei.',
  'beschw.dieseTexteStammenAus': 'Diese Texte stammen aus dem Bestand der Praxis. Sie ersetzen keine Untersuchung: Was Ihre Beschwerden verursacht, lässt sich erst am Behandlungsstuhl feststellen.',
  'beschw.kannAkutSein': 'Kann akut sein',
  'beschw.starkeSchmerzenOderEine': 'Starke Schmerzen oder eine Verletzung?',
  'beschw.wasHabenSie': 'Was haben Sie?',
  'blogliste.beitragLesen': 'Beitrag lesen →',
  'blogliste.nachStandort': 'Nach Standort:',
  'blogliste.neuesterBeitrag': 'Neuester Beitrag',
  'blogliste.zahnmedizinischerBlog': 'Zahnmedizinischer Blog',
  'kontaktz.akuteBeschwerden': 'Akute Beschwerden?',
  'kontaktz.bitteRufenSieAn': 'Bitte rufen Sie an, statt zu schreiben. Bei Atem- oder Schluckbeschwerden wählen Sie 112. Mehr unter',
  'kontaktz.jederStandortHatEigene': 'Jeder Standort hat eigene Sprechzeiten und eine eigene Nummer. Wählen Sie den, der Ihnen am nächsten liegt.',
  'kontaktz.terminBuchen': 'Termin buchen',
  'leistuebersicht.alleBehandlungen': 'Alle Leistungen',
  'leistuebersicht.behandlungSuchen': 'Leistung suchen',
  'leistuebersicht.zuIhrerSucheHaben': 'Zu Ihrer Suche haben wir nichts gefunden. Fragen Sie gern unseren digitalen Berater.',
  'leistuebersicht.platzhalter': 'Beschwerde oder Leistung – z. B. Loch im Zahn, Bleaching',
  'leistuebersicht.platzhalterOrt':
    'Beschwerde oder Leistung – z. B. Loch im Zahn, Bleaching, Angst',
  'leistuebersicht.zuFachbereich': 'Zu einem Fachbereich springen',
  'leistuebersicht.vorspann':
    '{anzahl} Leistungen in {bereiche} Fachbereichen. Zu jeder sehen Sie, an welchen unserer {standorte} Standorte sie angeboten wird.',
  'leistuebersicht.nichtsGefundenHier':
    'Zu Ihrer Suche haben wir hier nichts gefunden. Fragen Sie gern unseren digitalen Berater oder rufen Sie uns an – wir sagen Ihnen, ob wir Ihnen weiterhelfen können.',
  'leistuebersicht.anAnderenStandorten': 'An anderen KU64-Standorten',
  'leistuebersicht.mehrZu': 'Mehr zu {name} – ausführlich',
  'anfahrt.karteMitRoute': 'Karte mit Routenplanung',
  'anfahrt.karteFuss':
    'Der Weg steht darüber auch in Worten – die Karte ist ein Angebot, keine Voraussetzung.',
  'ort.rundgang': '360°-Rundgang durch die Praxis',
  'smile.augenbraue': 'Kostenlos und unverbindlich',
  'smile.titel': 'Sehen Sie Ihr neues Lächeln, bevor Sie sich entscheiden',
  'smile.vorspann':
    'Laden Sie ein Foto hoch und probieren Sie aus, wie Ihre Zähne nach einer Behandlung aussehen könnten. Das Ergebnis besprechen Sie danach mit uns in {ort} – oder Sie behalten es für sich.',
  'smile.schritt1': 'Ein Foto von vorn, bei Tageslicht, mit sichtbaren Zähnen.',
  'smile.schritt2': 'Sie wählen, was verändert werden soll – Farbe, Form, Stellung.',
  'smile.schritt3': 'Sie bekommen die Vorschau per E-Mail und können sie mitbringen.',
  'smile.knopf': 'Foto hochladen und Lächeln probetragen',
  'smile.hinweis':
    'Die Vorschau wird von einer KI erzeugt und ist keine Behandlungsplanung und kein Heilversprechen. Ihr Foto wird nur für die Vorschau verarbeitet und nicht zum Training verwendet.',
  'ort.rundgangFuss':
    'Sie bewegen sich frei durch die Räume. Geladen wird der Rundgang erst, wenn Sie ihn starten.',
  'leistuebersicht.anderswoText':
    'Diese Leistungen gibt es in {ort} nicht. Damit Sie nicht vergeblich suchen, führen wir Sie direkt zum richtigen Standort.',
  'standorte.behandlung': 'Leistung',
  'start.digitaleAnamnese': 'Digitale Anamnese',
  'start.digitalerBerater': 'Digitaler Berater',
  'start.ku64DieZahnspezialisten': 'KU64 · Die Zahnspezialisten',
  'terminez.beschreibung':
    'Online-Termin bei KU64 – wählen Sie Ihren Standort in Berlin oder Potsdam.',
  'terminez.anWelchemStandort': 'An welchem Standort möchten Sie einen Termin?',
  'krume.termine': 'Termine',
  'terminez.terminBuchen': 'Termin buchen',

  'beschwseite.aufDieserSeite': 'Auf dieser Seite',
  'beschwseite.wasBeiEinemZahnnotfall': 'Was bei einem Zahnnotfall zu tun ist →',
  'beschwseite.wasDagegenHilft': 'Was dagegen hilft',
  'beschwseite.wirHaltenAnJedem': 'Wir halten an jedem Standort Zeiten für Schmerzpatientinnen und -patienten frei.',
  'blogseite.aufDieserSeite': 'Auf dieser Seite',
  'blogseite.fragenZuDiesemThema': 'Fragen zu diesem Thema beantworten wir am besten persönlich.',
  'blogseite.termin': 'Termin',
  'blogseite.terminBuchen': 'Termin buchen',
  'ortblog.alleBeitraegeAnsehen': 'Alle Beiträge ansehen',
  'person.terminIn': 'Termin in {ort}',
  'person.behandeltAuchAn': '{name} behandelt auch an',
  'person.medizinischeLeitung': 'Medizinische Leitung',
  'teamliste.dasTeamIn': 'Das Team in {ort}',
  'teamliste.zusammensetzung':
    '{zahnaerzte} Zahnärztinnen und Zahnärzte und insgesamt {gesamt} Menschen bei KU64 {name}.',
  'teamliste.dasTeamBei': 'Das Team bei KU64 {name}.',
  'teamliste.filtern': 'Team filtern',
  'teamliste.bereich': 'Bereich',
  'teamliste.behandlungsart': 'Leistungsart',
  'teamliste.niemand': 'Mit dieser Auswahl steht niemand in {ort}.',
  'teamliste.spricht': 'Spricht {sprachen}',
  'teamliste.inArbeit':
    'Die Vorstellung unseres Teams in {ort} bereiten wir gerade auf – mit Fotos und Schwerpunkten der einzelnen Behandelnden.',
  'teamliste.behandelnZahl': 'Bei KU64 {name} behandeln {anzahl} Zahnärztinnen und Zahnärzte.',
  'teamliste.behandelnTeam': 'Bei KU64 {name} behandelt Sie ein festes, eingespieltes Team.',
  'teamliste.rufenSieAn':
    'Wenn Sie zu einer bestimmten Person oder einem Fachgebiet Fragen haben, rufen Sie uns gern an – wir sagen Ihnen genau, wer für Ihr Anliegen zuständig ist.',
  'teamliste.alle': 'Alle',
  'teamliste.auswahlAufheben': 'Auswahl aufheben',
  'teamliste.behandlungenAnsehen': 'Leistungen ansehen',
  'teamliste.profilAnsehen': 'Profil ansehen',

  /* ── Rechtstexte ──────────────────────────────────────────────────────
   *
   * Sie werden übersetzt wie alles andere – aber mit einer Vorrangklausel
   * darüber. Eine Datenschutzerklärung ist keine Beschreibung, sondern eine
   * Erklärung mit Rechtsfolgen; zwei Sprachfassungen können auseinander
   * laufen, sobald eine geändert wird. Der Hinweis sagt, welche gilt.
   */
  'recht.vorrangTitel': 'Rechtsverbindlich ist die deutsche Fassung',
  'recht.vorrangText':
    'Diese Übersetzung dient der Verständlichkeit. Bei Abweichungen zwischen den Sprachfassungen gilt der deutsche Text.',

  'bf.alleFunktionenSindMit': 'Alle Funktionen sind mit der Tastatur bedienbar, mit sichtbarem Fokusrahmen',
  'bf.alternativtexteFuerBildmaterialWerden': 'Alternativtexte für Bildmaterial werden ergänzt, sobald die Bilder vorliegen',
  'bf.aufklappbareInhalteFunktionierenAuch': 'Aufklappbare Inhalte funktionieren auch ohne JavaScript',
  'bf.barriereMelden': 'Barriere melden',
  'bf.bedienelementeSindMindestens44': 'Bedienelemente sind mindestens 44 × 44 Pixel groß',
  'bf.bewegteEffekteWerdenBei': 'Bewegte Effekte werden bei aktivierter Systemeinstellung „Bewegung reduzieren“ abgeschaltet',
  'bf.bitteSagenSieUns': 'Bitte sagen Sie uns Bescheid – das hilft uns mehr als jede Selbsteinschätzung. Beschreiben Sie kurz, welche Seite und welches Hilfsmittel betroffen sind. Wir melden uns zurück und beheben, was sich beheben lässt.',
  'bf.dieTerminbuchungVonDoctolib': 'Die Terminbuchung von Doctolib ist ein Fremdsystem, dessen Zugänglichkeit wir nicht steuern',
  'bf.dieseWebsiteSollFuer': 'Diese Website soll für alle nutzbar sein – auch mit Screenreader, nur mit der Tastatur, bei eingeschränktem Sehvermögen oder wenn Bewegung auf dem Bildschirm Beschwerden auslöst. Hier steht ehrlich, was umgesetzt ist und was noch nicht.',
  'bf.einDunklesFarbschemaWird': 'Ein dunkles Farbschema wird automatisch übernommen, wenn Ihr System es vorgibt',
  'bf.einSprunglinkFuehrtDirekt': 'Ein Sprunglink führt direkt zum Inhalt, ohne die Navigation durchlaufen zu müssen',
  'bf.leichteSpracheUndGebaerdensprachvideos': 'Leichte Sprache und Gebärdensprachvideos sind noch nicht verfügbar',
  'bf.schriftgroessenSkalierenMitIhren': 'Schriftgrößen skalieren mit Ihren Browsereinstellungen, Text bleibt bis 200 % lesbar',
  'bf.beschreibung':
    'Wie zugänglich diese Website und unsere Praxen sind – und was noch offen ist.',
  'bf.screenreaderTest':
    'Ein vollständiger Test mit Screenreadern (NVDA, VoiceOver) steht noch aus',
  'bf.etwasGefunden': 'Etwas gefunden, das nicht funktioniert?',
  'bf.statusmeldungenWerdenScreenreadernAngekuendigt': 'Statusmeldungen werden Screenreadern angekündigt',
  'bf.wasNochOffenIst': 'Was noch offen ist',
  'bf.wasUmgesetztIst': 'Was umgesetzt ist',
  'bf.zugaenglichkeitUnsererPraxen': 'Zugänglichkeit unserer Praxen',
  /* ── Auswahldialog, Langtext, Sperrhinweis ───────────────────────────
   *
   * Diese Texte standen als deutsche Zeichenketten in Einwilligung.astro,
   * Langtext.astro und Drittinhalt.astro – und damit auf 1.004 englischen und
   * französischen Seiten auf Deutsch. Bei einem Einwilligungsdialog ist das
   * nicht nur unschön: Eine Zustimmung zu einem Text, den man nicht lesen
   * kann, ist nach Artikel 4 Nr. 11 DSGVO keine informierte Einwilligung.
   */
  'ew.titel': 'Was darf geladen werden?',
  'ew.vorspann':
    'Diese Website funktioniert ohne alles, was hier steht. Für einzelne Funktionen werden aber Daten an andere Unternehmen übertragen – Sie entscheiden, für welche. Ihre Entscheidung gilt sechs Monate und lässt sich jederzeit unter {verweis} ändern.',
  'ew.hinweisPraxis': 'Hinweis der Praxis:',
  'ew.avOffen':
    'Für {dienste} liegt der Auftragsverarbeitungsvertrag noch nicht bestätigt vor. Solange das so ist, werden diese Dienste auch bei Zustimmung nicht geladen.',
  'ew.nurNotwendig': 'Nur das Notwendige',
  'ew.auswahlSpeichern': 'Auswahl speichern',
  'ew.allesErlauben': 'Alles erlauben',
  'ew.fuss': 'Was genau übertragen wird, steht im {verzeichnis} und in der {datenschutz}.',
  'ew.verzeichnis': 'Verzeichnis der Dienste',
  'ew.cookieEinstellungen': 'Cookie-Einstellungen',
  /* Der Aufklapper am Band: Wer nicht pauschal entscheiden will, wählt hier
     einzeln. Er steht bewusst als dritte, leisere Möglichkeit neben zwei
     gleich lauten – Ablehnen und Zustimmen müssen gleich schnell gehen. */
  'ew.selbstWaehlen': 'Einzeln auswählen',
  'ew.zurueck': 'Weniger anzeigen',
  'langtext.aufDieserSeite': 'Auf dieser Seite',
  'langtext.herkunft':
    'Übernommen von {adresse} – {woerter} Wörter, wortgleich. Fachliche Freigabe durch die Praxis steht aus.',
  'dritt.wirdGeladen':
    'Wird erst auf Ihren Klick geladen. Dabei werden {daten} an {anbieter} übertragen.',
  'dritt.laden': '{titel} laden',
  'dritt.ladenName':
    '{titel} laden – dabei werden Daten an {anbieter} übertragen',
  'dritt.wasUebertragen': 'Was dabei übertragen wird',
  'dritt.nochNichtFrei':
    'Noch nicht freigegeben: Für {dienst} liegt der Auftragsverarbeitungsvertrag mit {anbieter} nicht bestätigt vor. Bis dahin wird dieser Inhalt auch auf Klick nicht geladen.',
  'ck.seitentitel': 'Cookie-Einstellungen',
  'ck.beschreibung':
    'Beim Seitenaufruf wird nichts an Dritte übertragen. Welche Dienste es gibt, was sie übertragen, und wie Sie Ihre Auswahl jederzeit ändern.',
  'ck.einleitung':
    '<strong>Beim Aufruf einer Seite wird nichts an Dritte übertragen.</strong> Keine Schriften von fremden Servern, kein Zählpixel, kein Skript, das ungefragt lädt. Erst wenn Sie zustimmen, kommt etwas hinzu – und Sie entscheiden für jede Gruppe einzeln. Ablehnen geht genauso schnell wie Annehmen.',
  'ck.zweiAngaben':
    'Zwei Angaben liegen im lokalen Speicher Ihres Browsers, unabhängig von jeder Zustimmung. Sie erreichen unseren Server nie:',
  'ck.drittanbieterText':
    'Erst wenn Sie es auslösen oder ihm zustimmen: beim Starten des 360°-Rundgangs, beim Laden der Karte mit Routenplanung, bei der Suche, beim Chat oder bei der Lächeln-Vorschau – und bei der Besuchsstatistik, wenn Sie sie erlauben. Was dabei genau übertragen wird, steht unten bei jedem Dienst einzeln und in der {verweis}.',
  'ck.datenschutzerklaerung': 'Datenschutzerklärung',
  'ck.loeschen': 'Löschen',
  'ck.einKlickGenuegtDanach': 'Ein Klick genügt – danach ist der lokale Speicher dieser Website leer.',
  'ck.gespeicherteAngabenLoeschen': 'Gespeicherte Angaben löschen',
  'ck.ihrZuletztGewaehlterStandort': '– Ihr zuletzt gewählter Standort, damit wir Ihnen beim nächsten Besuch die passenden Angaben anbieten können. Es findet keine automatische Weiterleitung statt.',
  'ck.nurVorhandenWennSie': '– nur vorhanden, wenn Sie einen eingebetteten Dienst geladen und angekreuzt haben, dass wir uns Ihre Entscheidung merken sollen. Solange Sie das nicht tun, wird nichts gespeichert.',
  'ck.wannDochDrittanbieterIns': 'Wann doch Drittanbieter ins Spiel kommen',
  'ck.wasTatsaechlichGespeichertWird': 'Was tatsächlich gespeichert wird',
  /* ── Rechtstexte ──────────────────────────────────────────────────────
   *
   * Diese Werte enthalten Auszeichnung – <strong> für den fetten Einstieg
   * eines Absatzes, <code> für die Stellen, die die Praxis noch befüllen
   * muss. Das ist Absicht und die Ausnahme von der Regel, dass Texte keine
   * Auszeichnung tragen.
   *
   * Der Grund steht in Regel 1 oben: ganze Sätze, keine Bruchstücke. Ein
   * Satz, in dem ein Wort fett steht, war vorher in drei Schlüssel zerlegt –
   * Anfang, fettes Wort, Rest. Übersetzen ließ sich das nur, indem man rät,
   * wie die drei Stücke im Englischen wieder zusammenpassen. Sie passen
   * nicht: Im Englischen steht das Wort an anderer Stelle im Satz.
   *
   * Ausgegeben wird das mit `set:html`. Die Auszeichnung stammt aus dieser
   * Datei und aus dem Übersetzungskatalog – beides eigener Inhalt, keine
   * Eingabe von außen.
   */
  'imp.seitentitel': 'Impressum',
  'imp.beschreibung': 'Anbieterkennzeichnung und berufsrechtliche Angaben.',
  'imp.entwurf':
    '<strong>Entwurfsfassung.</strong> Ein Impressum besteht aus Tatsachenangaben über die Praxis. Die mit <code>[…]</code> markierten Felder sind vor Veröffentlichung von der Praxis zu befüllen.',
  'imp.anschrift':
    '<code>[Vollständiger Name der Praxis / Gesellschaft]</code><br /><code>[Rechtsform]</code><br /><code>[Straße, Hausnummer]</code><br /><code>[PLZ, Ort]</code>',
  'imp.kontakt': 'Telefon: <code>[Nummer]</code><br />E-Mail: <code>[Adresse]</code>',
  'imp.vertretung': 'Vertretungsberechtigte',
  'imp.vertretungAngabe': '<code>[Namen der Geschäftsführung / Partner]</code>',
  'imp.register': 'Registereintrag',
  'imp.registerAngabe':
    'Registergericht: <code>[…]</code><br />Registernummer: <code>[…]</code>',
  'imp.ustId': 'Umsatzsteuer-Identifikationsnummer',
  'imp.ustIdAngabe': '<code>[USt-IdNr. nach § 27a UStG, falls vorhanden]</code>',
  'imp.berufsAngaben':
    'Berufsbezeichnung: <code>[z. B. Zahnarzt / Zahnärztin]</code>, verliehen in <code>[Land]</code><br />Zuständige Kammer: <code>[Zahnärztekammer, Anschrift, Website]</code><br />Zuständige Kassenzahnärztliche Vereinigung: <code>[…]</code><br />Aufsichtsbehörde: <code>[…]</code>',
  'imp.berufsRegeln':
    'Es gelten folgende berufsrechtliche Regelungen: Zahnheilkundegesetz (ZHG), Berufsordnung der zuständigen Zahnärztekammer, Gebührenordnung für Zahnärzte (GOZ), Heilberufsgesetz des Landes. Einsehbar unter <code>[Fundstelle]</code>.',
  'imp.haftpflicht': 'Berufshaftpflichtversicherung',
  'imp.haftpflichtAngabe':
    '<code>[Name und Anschrift des Versicherers]</code><br />Räumlicher Geltungsbereich: <code>[…]</code>',
  'imp.verantwortlichAngabe': '<code>[Name, Anschrift]</code>',
  'imp.streitbeilegung': 'Streitbeilegung',
  'imp.streitbeilegungText':
    'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit. Wir sind <code>[nicht]</code> bereit und <code>[nicht]</code> verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
  'imp.schlichtungsstelle':
    'Für Streitigkeiten aus einem Behandlungsverhältnis steht die Schlichtungsstelle der zuständigen Zahnärztekammer zur Verfügung: <code>[Anschrift]</code>.',
  'imp.bildnachweise': 'Bildnachweise',
  'imp.bildnachweiseAngabe': '<code>[Urheber und Lizenzen der verwendeten Bilder]</code>',
  'ds.seitentitel': 'Datenschutzerklärung',
  'ds.beschreibung': 'Wie diese Website mit Ihren Daten umgeht – konkret und nachvollziehbar.',
  'ds.entwurf':
    '<strong>Entwurfsfassung.</strong> Der technische Teil beschreibt exakt das Verhalten dieser Website. Vor Veröffentlichung muss die Erklärung um die Angaben der Praxis ergänzt und anwaltlich geprüft werden. Die mit <code>[…]</code> markierten Stellen sind noch zu befüllen.',
  'ds.verantwortlicherAngaben':
    '<code>[Vollständiger Name der Praxis / des Trägers, Anschrift, Telefon, E-Mail, gesetzliche Vertretung]</code>',
  'ds.datenschutzbeauftragter':
    'Datenschutzbeauftragte oder Datenschutzbeauftragter: <code>[Name, Kontakt]</code>',
  'ds.serverdaten':
    'Beim Aufruf einer Seite überträgt Ihr Browser technisch notwendige Daten an unseren Server: IP-Adresse, Zeitpunkt, aufgerufene Adresse, Browsertyp und Betriebssystem. Diese Daten sind für die Auslieferung der Seite erforderlich. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Speicherdauer der Serverprotokolle: <code>[Anzahl Tage]</code>.',
  'ds.keineAnalyse':
    '<strong>Nichts läuft ungefragt.</strong> Beim Aufruf einer Seite wird kein Analyse-Werkzeug geladen und kein Zählpixel eingebunden. Eine Besuchsstatistik führen wir nur, wenn Sie ausdrücklich zustimmen – welche Daten dabei an wen gehen, steht unten im Verzeichnis der Dienste. Werbe-Cookies setzt diese Website nicht, auch nicht mit Zustimmung.',
  'ds.schriften':
    '<strong>Schriften werden selbst ausgeliefert.</strong> Es findet kein Aufruf an Google Fonts oder ein anderes Schriften-Netzwerk statt. Ihre IP-Adresse wird dafür nicht an Dritte übermittelt.',
  'ds.lokalEinleitung':
    'Wir speichern in Ihrem Browser (localStorage) zwei Angaben, die unseren Server nie erreichen:',
  'ds.lokalStandort':
    '<strong>Ihren zuletzt gewählten Standort</strong>, damit wir Ihnen beim nächsten Besuch die passenden Angaben anbieten können. Es findet keine automatische Weiterleitung statt.',
  'ds.lokalTermin':
    '<strong>Ihre Entscheidung zur Terminbuchung</strong>, falls Sie angekreuzt haben, dass wir uns diese merken sollen.',
  'ds.4Doctolib': '4. Online-Terminbuchung (Doctolib)',
  'ds.doctolibEins':
    'Die Terminbuchung läuft über Doctolib. Der Kalender ist auf dieser Website <strong>nicht eingebettet</strong>: Sie werden über einen Verweis dorthin geleitet und erkennen am Wechsel der Adresse, dass Sie sich ab dann auf doctolib.de befinden. Solange Sie auf unserer Seite bleiben, findet keinerlei Verbindung zu Doctolib statt – auch kein Vorabladen im Hintergrund.',
  'ds.doctolibZwei':
    'Erst auf der Seite von Doctolib werden Ihre IP-Adresse und Browserdaten dort verarbeitet und Cookies gesetzt. Verantwortlich dafür ist Doctolib; es gilt die Datenschutzerklärung von Doctolib. Weil wir nichts einbetten, ist auf unserer Seite dafür keine Einwilligung nach § 25 Abs. 1 TDDDG erforderlich. Auftragsverarbeitungsvertrag für die Terminverwaltung: <code>[Status ergänzen]</code>.',
  'ds.5Anamnese': '5. Digitale Anamnese (Nelly Solutions)',
  'ds.anamneseEins':
    'Der Anamnesebogen wird von Nelly Solutions bereitgestellt. Diese Website leitet Sie lediglich dorthin weiter und verarbeitet selbst <strong>keine Gesundheitsdaten</strong>. Ihre Angaben fließen direkt vom Formular in unser Praxisverwaltungssystem.',
  'ds.anamneseZwei':
    'Rechtsgrundlage für die Verarbeitung Ihrer Gesundheitsdaten ist Art. 9 Abs. 2 lit. h DSGVO in Verbindung mit § 630f BGB (Dokumentationspflicht). Aufbewahrungsdauer der Patientenakte: <code>[in der Regel 10 Jahre – bitte bestätigen]</code>. Auftragsverarbeitungsvertrag mit Nelly Solutions: <code>[Status ergänzen]</code>.',
  'ds.6Berater': '6. Digitaler Berater (Text und Sprache)',
  'ds.beraterText':
    '<strong>Textchat.</strong> Ihre Frage wird an unseren Server und von dort an Anthropic übermittelt, um die Antwort zu erzeugen. Der Gesprächsverlauf existiert ausschließlich in Ihrem Browserfenster und geht beim Schließen verloren. Wir speichern weder Fragen noch Antworten und legen keine Gesprächsprotokolle an. Zur Missbrauchsabwehr zählen wir kurzzeitig Anfragen je IP-Adresse im Arbeitsspeicher.',
  'ds.beraterSprache':
    '<strong>Sprachberater.</strong> Der Sprachdialog läuft über ElevenLabs. Das Mikrofon wird erst nach Ihrer ausdrücklichen Freigabe aktiviert. Ihre Stimme wird zur Erzeugung der Antwort verarbeitet; eine dauerhafte Aufzeichnung durch uns findet nicht statt.',
  'ds.beraterHinweis':
    'Der Berater ist angewiesen, keine Gesundheitsdaten abzufragen und keine Diagnosen zu stellen. Bitte teilen Sie ihm dennoch keine sensiblen Angaben mit – für alles Medizinische ist der persönliche Termin der richtige Ort. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Auftragsverarbeitungsverträge: <code>[Status ergänzen]</code>.',
  'ds.7Laecheln': '7. Lächeln-Vorschau (Foto-Upload)',
  'ds.laechelnEins':
    'Ein Gesichtsfoto ist ein <strong>biometrisches Datum</strong> und damit eine besondere Kategorie personenbezogener Daten nach Art. 9 DSGVO. Wir verarbeiten es ausschließlich auf Grundlage Ihrer ausdrücklichen, vorher erteilten Einwilligung (Art. 9 Abs. 2 lit. a DSGVO).',
  'ds.laechelnAblauf': 'So läuft die Verarbeitung konkret ab:',
  'ds.laechelnSpeicher':
    'Ihr Foto wird an unseren Server übertragen und dort ausschließlich im Arbeitsspeicher gehalten. Es wird <strong>nicht auf einen Datenträger geschrieben</strong> und in keine Datenbank aufgenommen.',
  'ds.laechelnGoogle': 'Zur Analyse und Bilderzeugung wird es an Google (Gemini) übermittelt.',
  'ds.laechelnSchluss':
    'Die erzeugte Darstellung ist eine unverbindliche Illustration und kein Behandlungsergebnis. Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen; da nichts gespeichert wird, gibt es danach nichts zu löschen. Auftragsverarbeitungsvertrag mit Google: <code>[Status ergänzen]</code>.',
  'ds.kontaktText':
    'Wenn Sie uns anrufen oder schreiben, verarbeiten wir Ihre Angaben zur Bearbeitung Ihres Anliegens (Art. 6 Abs. 1 lit. b und f DSGVO). Bitte senden Sie uns keine Gesundheitsdaten per unverschlüsselter E-Mail – dieser Weg ist technisch nicht vertraulich.',
  'ds.rechteText':
    'Sie haben das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21 DSGVO). Erteilte Einwilligungen können Sie jederzeit mit Wirkung für die Zukunft widerrufen.',
  'ds.beschwerdeText':
    'Sie können sich außerdem bei einer Aufsichtsbehörde beschweren – zuständig ist die Behörde an Ihrem Wohnsitz oder am Sitz der Praxis: <code>[zuständige Aufsichtsbehörde eintragen]</code>.',
  'ds.aenderungenText':
    'Wir passen diese Erklärung an, wenn sich die Website oder die Rechtslage ändert. Stand: <code>[Datum bei Veröffentlichung eintragen]</code>.',
  'ds.10Aenderungen': '10. Änderungen',
  'ds.1Verantwortlicher': '1. Verantwortlicher',
  'ds.2WasBeimAufruf': '2. Was beim Aufruf dieser Website passiert',
  'ds.3LokaleSpeicherungIm': '3. Lokale Speicherung im Browser',
  'ds.8Kontaktaufnahme': '8. Kontaktaufnahme',
  'ds.9IhreRechte': '9. Ihre Rechte',
  'ds.beidesKoennenSieJederzeit': 'Beides können Sie jederzeit über die Einstellungen Ihres Browsers löschen. Es handelt sich um keine personenbezogenen Daten im engeren Sinne und um keine Nutzerprofile.',
  'ds.dasErgebnisWirdIhnen': 'Das Ergebnis wird Ihnen angezeigt und an die von Ihnen angegebene Adresse gesendet. Die Adresse wird für diesen einen Versand verwendet und danach nicht gespeichert.',
  'ds.nachAbschlussDerAnfrage': 'Nach Abschluss der Anfrage sind Foto und Ergebnis auf unserem Server nicht mehr vorhanden.',
  'imp.angabenNach5Ddg': 'Angaben nach § 5 DDG',
  'imp.berufsrechtlicheAngaben': 'Berufsrechtliche Angaben',
  'imp.verantwortlichFuerDenInhalt': 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV',

  'nav.terminBuchen': 'Termin buchen',
  'nav.suchen': 'Suchen',

  // ── Sprache ─────────────────────────────────────────────────────────
  'sprache.waehlen': 'Sprache wählen',
  'sprache.hinweisTitel': 'Wir haben auf {sprache} umgestellt',
  'sprache.hinweisText':
    'Ihr Browser ist auf {sprache} eingestellt, deshalb sehen Sie diese Seite auf {sprache}.',
  'sprache.zurueckAllgemein': 'Zurück zur vorherigen Sprachfassung',
  'sprache.zurueckZu': 'Weiter auf {sprache}',
  'sprache.hinweisSchliessen': 'Hinweis schließen',
  'sprache.unvollstaendig':
    'Diese Sprachfassung wird gerade aufgebaut. Einzelne Abschnitte erscheinen noch auf Deutsch.',

  // ── Allgemein ───────────────────────────────────────────────────────

  // ── Startseite ──────────────────────────────────────────────────────
  'start.ueberschrift': 'Wo dürfen wir Sie behandeln?',
  'start.vorspann':
    '{anzahl} Standorte in Berlin und Potsdam. Wählen Sie Ihren – danach sehen Sie ausschließlich Leistungen, Sprechzeiten und Kontaktdaten dieses Standorts. Kein Wechsel ohne Ihr Zutun.',
  'start.zuletztWaren': 'Zuletzt waren Sie bei {standort}.',
  'start.zuletztZurueck': 'Dorthin zurück',
  'start.warumTitel': 'Warum diese Website nach Standort aufgebaut ist',
  'start.warumEins':
    'Eine Zahnarztpraxis mit mehreren Häusern hat ein Problem, das Patientinnen und Patienten oft erst spät bemerkt: Nicht jede Leistung wird überall angeboten. Wer nach „Implantat Potsdam“ sucht und auf einer allgemeinen Leistungsseite landet, liest im Zweifel über eine Praxis, die 30 Kilometer entfernt liegt.',
  'start.warumZwei':
    'Deshalb gehört bei uns jede Leistungsseite zu genau einem Standort – mit dessen Adresse, Telefonnummer, Sprechzeiten und Terminbuchung. Gibt es eine Behandlung an Ihrem Standort nicht, sagen wir das offen und verlinken gezielt dorthin, wo Sie sie bekommen. {anzahl} Leistungen, jeweils dort beschrieben, wo sie stattfinden.',
  'start.digitalTitel': 'Digital, bevor Sie ankommen',
  'start.laechelnText':
    'Foto hochladen und sehen, wie Ihr Lächeln nach einer ästhetischen Behandlung aussehen könnte. Ihr Bild wird dabei nicht gespeichert.',
  'start.laechelnKnopf': 'Ausprobieren',
  'start.anamneseText':
    'Den Anamnesebogen bequem von zu Hause ausfüllen – an jedem Standort. Kein Klemmbrett im Wartezimmer.',
  'start.anamneseKnopf': 'Bogen öffnen',
  'start.beraterText':
    'Fragen zu einer Leistung, zu Kosten oder zum Ablauf? Schreiben oder sprechen Sie mit unserem Assistenten – rund um die Uhr.',
  'start.beraterKnopf': 'Gespräch starten',

  // ── Standortkarte ───────────────────────────────────────────────────
  'karte.behandlungen': 'Leistungen',
  'karte.geoeffnet': 'Geöffnet',
  'karte.telefon': 'Telefon',
  'karte.tageWoche': '{anzahl} Tage/Woche',
  'karte.standortAnsehen': 'Standort ansehen',

  // ── Fehlerseite ─────────────────────────────────────────────────────
  'fehler.titel': 'Diese Seite gibt es nicht',
  'fehler.text':
    'Vielleicht wurde sie beim Umbau der Website umbenannt. Suchen Sie hier direkt nach Ihrer Leistung – oder gehen Sie zu Ihrem Standort.',
  'fehler.suchen': 'Leistung suchen',
  'fehler.seitentitel': 'Seite nicht gefunden',
  'fehler.beschreibung':
    'Diese Seite gibt es nicht mehr. Hier finden Sie, wonach Sie gesucht haben.',
  'fehler.platzhalter': 'z. B. Implantat, Bleaching, Zahnschmerzen',
  'fehler.oderStandort': 'Oder direkt zu Ihrem Standort',
  'fehler.nichtsDabei': 'Nichts dabei?',
  'fehler.alleBehandlungen': 'Alle Leistungen',
  'fehler.alleStandorte': 'Alle Standorte',
  'fehler.notfall': 'Notfall',
  'fehler.beraterFragen': 'Berater fragen',
  /* Die folgenden vier stehen im Skript der Fehlerseite: Welche Behandlung an
     welchem Standort fehlt, weiß erst der Browser – die Seite ist statisch und
     kennt die aufgerufene Adresse zur Buildzeit nicht. */
  'fehler.gibtEsNichtIn': '{name} gibt es in {ort} nicht',
  'fehler.stattdessenDort':
    'Diese Leistung bieten wir an diesem Standort nicht an. Sie bekommen sie bei {wo} – dort finden Sie Sprechzeiten, Telefonnummer und die Terminbuchung.',
  'fehler.nirgends':
    'Diese Leistung bieten wir derzeit an keinem Standort an. Rufen Sie uns gern an – wir sagen Ihnen, wer Ihnen weiterhelfen kann.',
  'fehler.beiStandort': '{name} bei KU64 {ort}',
  'fehler.alleBehandlungenIn': 'Alle Leistungen in {ort}',
  'fehler.und': 'und',

  // ── Bausteine ───────────────────────────────────────────────────────
  'nav.waehlerHinweis':
    'Beim Wechsel zeigen wir Ihnen die Angaben des gewählten Standorts. Nicht jede Leistung wird an jedem Standort angeboten.',
  'fuss.ohneStandort':
    'Zahnmedizin an vier Standorten in Berlin und Potsdam. Bitte wählen Sie Ihren Standort – Sprechzeiten und Leistungsangebot unterscheiden sich.',
  'termin.terminBei': 'Termin bei KU64 {name}',
  'termin.anlassBei': '{anlass} bei KU64 {name}',
  'termin.barrierefreierZugang': 'barrierefreier Zugang',
  'termin.onlineWaehlen': 'Online-Termin wählen',
  'termin.vorspann':
    'Buchen Sie online in unter einer Minute – oder rufen Sie uns an. Wir melden uns auch gerne bei Ihnen zurück.',
  'standortwahl.hinweis':
    'Sprechzeiten, Telefonnummern und das Leistungsangebot unterscheiden sich je Standort – deshalb fragen wir lieber, statt zu raten.',

  // ── Standortseiten ──────────────────────────────────────────────────
  'standort.ihrZahnarztIn': 'Ihr Zahnarzt in {ort}',
  'standort.behandlungenAnsehen': '{anzahl} Leistungen ansehen',
  'standort.alleBehandlungenAnsehen': 'Alle {anzahl} Leistungen ansehen',
  'standort.fachbereicheUnterEinemDach':
    '{anzahl} Fachbereiche unter einem Dach – Sie müssen für die meisten Leistungen nicht die Praxis wechseln.',
  'standort.behandlungenBeiKu64': 'Leistungen bei KU64 {name}',
  'standort.leistungenVorspann':
    '{anzahl} Leistungen in {bereiche} Fachbereichen – alle hier in {ort} verfügbar. Zu jeder Leistung finden Sie Dauer, Kostenrahmen und was die Krankenkasse übernimmt.',
  'standort.terminBeiKu64': 'Termin bei KU64 {name}',
  'standort.termineVorspann':
    '{adresse}. Buchen Sie online oder rufen Sie uns an – beides führt zum selben Terminkalender.',
  'standort.anamneseVorspann':
    'Fünf Minuten zu Hause statt Klemmbrett im Wartezimmer. Ihre Angaben landen verschlüsselt direkt bei den Behandelnden von KU64 {name} – Sie starten beim Termin sofort.',
  'standort.anamneseInArbeit':
    'Die digitale Anamnese für KU64 {name} wird gerade eingerichtet. Bis dahin füllen Sie den Bogen wie gewohnt vor Ort aus – oder Sie rufen an, dann schicken wir ihn Ihnen vorab zu.',
  'standort.blogAusOrt': 'Blog aus {ort}',
  'praxis.anzahlBehandlungen': '{anzahl} Leistungen',
  'standort.blogAnzahl': '{anzahl} {wort} mit Bezug zu KU64 {name}.',
  'standort.blogBeitrag': 'Beitrag',
  'standort.blogBeitraege': 'Beiträge',
  'standort.blogLeer': 'Zu KU64 {name} gibt es bisher keinen eigenen Beitrag.',
  'person.zurueckZumTeam': 'Zurück zum Team in {ort}',
  'karte.nichtImAngebot': 'An diesem Standort nicht im Angebot – wir behandeln das bei {wo}.',
  'orte.anzahlStandorte': '{anzahl} Standorte in Berlin und Potsdam',
  'ueber.seit':
    'Seit {jahr} am Kurfürstendamm, heute an {anzahl} Standorten in Berlin und Potsdam. Was gleich geblieben ist: der Anspruch, dass ein Zahnarztbesuch niemand Angst machen muss.',
  'ueber.seitGruendung': 'seit der Gründung {jahr}',
  'ueber.jahre': 'Jahre',
  'ueber.standorte': 'Standorte',
  'karriere.vorspann':
    '{anzahl} Standorte, alle Fachbereiche unter einem Dach und ein eigenes Meisterlabor – für Zahnmedizin, Prophylaxe, Assistenz und Verwaltung.',
  'blogz.vorspann':
    '{anzahl} Beiträge zu Leistungen, Vorsorge und dem, was bei uns passiert – von {von} bis {bis}.',
  'blogz.beschreibung':
    '{anzahl} Beiträge zu Leistungen, Vorsorge und dem Alltag bei KU64 – von {von} bis {bis}.',
  'notfallz.brandenburg': ', Brandenburg unter ',
  'beschwerde.uebersichtVorspann':
    'Für den Weg andersherum: nicht von der Leistung zur Beschwerde, sondern von dem, was Sie merken, zu dem, was hilft. {anzahl} Beschwerden, jeweils mit den Leistungen, die dafür in Frage kommen.',
  'berater.grenzen':
    'Keine medizinische Beratung, keine verbindlichen Preise, keine Terminbuchung. Kein Gesprächsinhalt wird dauerhaft gespeichert. {verweis}',
  'berater.datenschutz': 'Datenschutz',
  'standort.adresse': 'Adresse',
  'standort.telefon': 'Telefon',
  'standort.geoeffnet': 'Geöffnet',
  'standort.siebenTage': 'Sieben Tage die Woche',
  'standort.xTageWoche': '{anzahl} Tage die Woche',
  'standort.behandelnde': 'Behandelnde',
  'standort.zahnaerzteAnzahl': '{anzahl} Zahnärztinnen und Zahnärzte',
  'standort.behandlungenIn': 'Leistungen in {ort}',
  'standort.angebotHier':
    'Alles, was wir an diesem Standort anbieten – {anzahl} Leistungen in {bereiche} Fachbereichen. Leistungen, die es hier nicht gibt, weisen wir offen aus und verlinken zum passenden Standort.',
  'standort.nichtHierText':
    'Diese Leistungen bieten wir in {ort} nicht an. Damit Sie nicht vergeblich anrufen, sehen Sie hier direkt, an welchem KU64-Standort Sie sie bekommen.',
  'standort.barrierefreiheit': 'Barrierefreiheit:',
  'standort.barrierefreiJa': 'Die Praxis ist barrierefrei zugänglich.',
  'standort.sprechzeiten': 'Sprechzeiten',
  'standort.oeffnungszeitenVon': 'Öffnungszeiten von KU64 {name}',
  'standort.zahnaerzteLabel': 'Zahnärztinnen und Zahnärzte',
  'standort.tageWoche': 'Tage in der Woche',
  'standort.galerieHinweis':
    'Aufnahmen aus dieser Praxis – in der Reihenfolge, in der Sie sie beim Besuch sehen.',
  'standort.soFindenSieUns': 'So finden Sie uns',
  'standort.aufKarteAnsehen': 'Auf der Karte ansehen',
  'standort.kartenHinweis':
    'Die Kartendienste sind externe Anbieter. Wir betten sie nicht direkt ein, damit beim bloßen Lesen dieser Seite keine Daten an Dritte fließen.',

  // ── Standortübersicht ───────────────────────────────────────────────
  'standorte.vorspann':
    'Jeder Standort hat einen eigenen Charakter und ein eigenes Leistungsangebot. Wählen Sie Ihren – danach zeigen wir Ihnen ausschließlich, was dort möglich ist.',
  'standorte.matrixTitel': 'Welche Leistung gibt es wo?',
  'standorte.matrixVorspann':
    'Nicht jede Leistung wird an jedem Standort angeboten. Diese Übersicht zeigt Ihnen vor dem Anruf, wohin Sie müssen.',
  'standorte.matrixBeschriftung': 'Verfügbarkeit der Leistungen je KU64-Standort',

  // ── Kontakt ─────────────────────────────────────────────────────────

  /* ── Häufige Fragen ───────────────────────────────────────────────────
   *
   * Sie standen als Datenfeld im Vorspann von zehn Seiten:
   * `const faq = [{ frage: '…', antwort: '…' }]`. Das war die letzte Lücke
   * derselben Art wie bei den Leistungsseiten und den Beschwerdeseiten – nur
   * an der unangenehmsten Stelle: Diese Sätze erscheinen nicht bloß sichtbar
   * auf der Seite, sie wandern über `schemaFaq()` zusätzlich als FAQPage in
   * das JSON-LD. Unübersetzt hieß das: Auf /en/ stand deutscher Text, und
   * Google bekam ihn als strukturierte Daten der englischen Seite gemeldet.
   *
   * Der Sprachwächter konnte davon nichts sehen. Er vergleicht den Katalog
   * mit der Quellfassung und liest die Auszeichnung – den Vorspann einer
   * Astro-Datei las er nicht. Seit `scripts/deutsch-finden.mjs` das tut,
   * fällt ein neuer Satz an dieser Stelle sofort auf.
   *
   * Zahlen, Namen und Adressen kommen als Platzhalter herein, nicht als
   * zusammengeklebte Satzteile. Beim Zusammenkleben wäre der Schaden hier
   * doppelt: einmal im Text, den man liest, und einmal in den
   * strukturierten Daten, die man nicht sieht.
   */

  /** Listentrenner. Einzelnes Wort, weil eine Aufzählung kein Satz ist –
      dieselbe Ausnahme wie bei `leistung.oder`. */
  'liste.und': 'und',

  'faq.titel': 'Häufige Fragen',
  'faq.haeufigGefragt': 'Häufig gefragt',

  // ── Startseite ──────────────────────────────────────────────────────
  'faq.start.wieVieleStandorte.frage': 'Wie viele KU64-Standorte gibt es?',
  'faq.start.wieVieleStandorte.antwort':
    'KU64 ist an {anzahl} Standorten vertreten: {standorte}. Das Leistungsangebot unterscheidet sich je Standort.',
  'faq.start.alleLeistungen.frage': 'Bietet jeder Standort alle Leistungen an?',
  'faq.start.alleLeistungen.antwort':
    'Nein. Die Hauptpraxis am Kurfürstendamm bietet das breiteste Spektrum inklusive Vollnarkose, Kieferorthopädie und All-on-4. Potsdam deckt das volle Standardspektrum inklusive Implantologie und Oralchirurgie ab. Auf jeder Standortseite sehen Sie ausschließlich das, was dort tatsächlich angeboten wird – und wohin Sie für alles Übrige gehen.',
  'faq.start.terminBuchen.frage': 'Wie buche ich einen Termin?',
  'faq.start.terminBuchen.antwort':
    'Online über die Terminseite Ihres Standorts oder telefonisch. Für den ersten Besuch füllen Sie den Anamnesebogen vorab digital aus – das spart Zeit vor Ort und Sie müssen im Wartezimmer nichts auf Papier ausfüllen.',
  'faq.start.akuteSchmerzen.frage': 'Was mache ich bei akuten Zahnschmerzen?',
  'faq.start.akuteSchmerzen.antwort':
    'Rufen Sie den Standort an, der Ihnen am nächsten liegt. Mehrere unserer Standorte haben sieben Tage die Woche geöffnet, auch am Wochenende. Bei starken Schmerzen sagen Sie das direkt am Telefon – wir halten Termine für Akutfälle frei.',

  // ── Digitale Beratung ───────────────────────────────────────────────
  'faq.beratung.mensch.frage': 'Spreche ich mit einem Menschen?',
  'faq.beratung.mensch.antwort':
    'Nein. Sie sprechen mit einem KI-System, und die Stimme ist synthetisch erzeugt. Einen Menschen erreichen Sie unter der Telefonnummer Ihres Standorts.',
  'faq.beratung.aufzeichnung.frage': 'Wird das Gespräch aufgezeichnet?',
  'faq.beratung.aufzeichnung.antwort':
    'Für die Dauer des Gesprächs wird Ihre Stimme verarbeitet, um die Antwort zu erzeugen. Eine dauerhafte Aufzeichnung findet nicht statt, und wir ordnen das Gespräch keiner Person zu. Sie können jederzeit auflegen.',
  'faq.beratung.ersetztPraxis.frage': 'Ersetzt das eine Beratung in der Praxis?',
  'faq.beratung.ersetztPraxis.antwort':
    'Nein. Der Sprachberater erklärt Leistungen, Abläufe und Kostenrahmen. Er stellt keine Diagnose und beurteilt keine Beschwerden. Alles, was Ihren konkreten Fall betrifft, gehört in eine persönliche Untersuchung.',
  'faq.beratung.lieberSchreiben.frage': 'Was, wenn ich lieber schreibe?',
  'faq.beratung.lieberSchreiben.antwort':
    'Dann nutzen Sie den Chat unten rechts – inhaltlich beantwortet er dieselben Fragen. Manche Menschen tippen lieber, andere sprechen lieber; beides ist gleichwertig.',
  'faq.beratung.terminBuchen.frage': 'Kann ich darüber einen Termin buchen?',
  'faq.beratung.terminBuchen.antwort':
    'Nein, der Berater nimmt keine Termine entgegen und erfasst keine persönlichen Daten. Er verweist Sie auf die Terminseite Ihres Standorts oder auf unsere Telefonnummer.',

  // ── Notfall ─────────────────────────────────────────────────────────
  'faq.notfall.echterNotfall.frage': 'Wann ist ein Zahnproblem ein echter Notfall?',
  'faq.notfall.echterNotfall.antwort':
    'Bei starken, nicht beherrschbaren Schmerzen, bei einer Schwellung im Gesicht oder am Hals, bei Fieber zusammen mit Zahnschmerzen, bei einer Blutung, die nicht aufhört, und bei einem ausgeschlagenen oder abgebrochenen Zahn nach einem Unfall. Bei Atem- oder Schluckbeschwerden zählt jede Minute – dann sofort 112.',
  'faq.notfall.ausgeschlagenerZahn.frage': 'Was mache ich mit einem ausgeschlagenen Zahn?',
  'faq.notfall.ausgeschlagenerZahn.antwort':
    'Den Zahn nur an der Krone anfassen, nie an der Wurzel, und nicht säubern oder abschrubben. Sofort in eine Zahnrettungsbox legen; wenn keine da ist, in kalte H-Milch, notfalls in Speichel. Nicht in Wasser. Dann so schnell wie möglich zu uns – am besten innerhalb der ersten Stunde. Bei Kindern gilt das auch für Milchzähne: Nehmen Sie den Zahn mit, wir entscheiden dann.',
  'faq.notfall.fuellungVerloren.frage':
    'Eine Füllung oder Krone ist herausgefallen – ist das dringend?',
  'faq.notfall.fuellungVerloren.antwort':
    'Meist nicht akut gefährlich, aber es sollte zeitnah versorgt werden, damit der Zahn nicht bricht oder Karies entsteht. Bewahren Sie die Krone auf und bringen Sie sie mit – oft lässt sie sich wieder einsetzen. Kauen Sie in der Zwischenzeit auf der anderen Seite.',
  'faq.notfall.schmerzenBisTermin.frage': 'Was hilft bis zum Termin gegen die Schmerzen?',
  'faq.notfall.schmerzenBisTermin.antwort':
    'Kühlen Sie von außen mit einem Tuch dazwischen, nicht direkt auf der Haut, und in Intervallen. Halten Sie den Kopf hoch, auch beim Schlafen. Rezeptfreie Schmerzmittel wie Ibuprofen können helfen – bitte nur nach Packungsbeilage und nicht, wenn Sie sie nicht vertragen. Legen Sie niemals eine Tablette direkt auf das Zahnfleisch, das verätzt die Schleimhaut. Keine Wärme, kein Alkohol.',
  'faq.notfall.nachtsUndFeiertags.frage': 'Wer hilft nachts und an Feiertagen?',
  'faq.notfall.nachtsUndFeiertags.antwort':
    'Mehrere unserer Standorte haben sieben Tage die Woche geöffnet, auch am Wochenende. Außerhalb unserer Sprechzeiten hilft der zahnärztliche Notdienst der Kassenzahnärztlichen Vereinigung weiter – die Nummern stehen unten.',

  // ── Terminseite (allgemein) ─────────────────────────────────────────
  'faq.termine.buchen.frage': 'Wie buche ich einen Termin bei KU64?',
  'faq.termine.buchen.antwort':
    'Online über den Terminkalender Ihres Standorts oder telefonisch. Beides führt zum selben Kalender – es gibt keine getrennten Kontingente. Für die Online-Buchung brauchen Sie nur wenige Angaben; den Anamnesebogen füllen Sie danach digital aus.',
  'faq.termine.absagen.frage': 'Kann ich einen Termin wieder absagen oder verschieben?',
  'faq.termine.absagen.antwort':
    'Ja. Bitte sagen Sie spätestens 24 Stunden vorher ab – telefonisch oder über den Link in Ihrer Bestätigungsmail. So kann jemand anderes den Termin bekommen, und das ist bei einer ausgebuchten Praxis der eigentliche Grund für die Frist.',
  'faq.termine.mitbringen.frage': 'Was muss ich zum ersten Termin mitbringen?',
  'faq.termine.mitbringen.antwort':
    'Ihre Versichertenkarte, gegebenenfalls Bonusheft und Allergiepass sowie eine Liste Ihrer Medikamente. Wichtig sind vor allem Blutverdünner, Bisphosphonate, ein Herzklappenersatz, Diabetes, eine Schwangerschaft und Allergien gegen Betäubungsmittel – diese Angaben ändern die Behandlung.',
  'faq.termine.starkeSchmerzen.frage': 'Was mache ich bei starken Schmerzen?',
  'faq.termine.starkeSchmerzen.antwort':
    'Rufen Sie den Standort an, statt online zu buchen. Wir halten an jedem Standort Zeiten für Schmerzpatientinnen und -patienten frei und können am Telefon einschätzen, wie dringend es ist. Außerhalb der Sprechzeiten hilft die Notfallseite weiter.',
  'faq.termine.doctolib.frage': 'Warum werde ich zu Doctolib weitergeleitet?',
  'faq.termine.doctolib.antwort':
    'Der Kalender liegt bei Doctolib, einem eigenständigen Dienst. Wir betten ihn bewusst nicht in diese Seite ein – so werden beim bloßen Lesen keine Daten an Dritte übertragen. Erst wenn Sie den Kalender öffnen, werden Ihre IP-Adresse übermittelt und Cookies gesetzt.',
  'faq.termine.ohnePortal.frage': 'Kann ich auch ohne Online-Portal einen Termin bekommen?',
  'faq.termine.ohnePortal.antwort':
    'Ja, jederzeit telefonisch oder per E-Mail. Die Online-Buchung ist ein Angebot, keine Voraussetzung – die Nummer Ihres Standorts steht auf dessen Terminseite.',

  // ── Lächeln-Vorschau ────────────────────────────────────────────────
  'faq.laecheln.fotoGespeichert.frage': 'Wird mein Foto gespeichert?',
  'faq.laecheln.fotoGespeichert.antwort':
    'Nein. Ihr Foto wird ausschließlich für die Dauer der Berechnung im Arbeitsspeicher verarbeitet und danach verworfen. Es wird nicht auf einer Festplatte abgelegt, nicht in eine Datenbank geschrieben und nicht für das Training von KI-Modellen verwendet. Auch Ihre E-Mail-Adresse nutzen wir nur für diesen einen Versand.',
  'faq.laecheln.versprechen.frage': 'Ist das Ergebnis ein Behandlungsversprechen?',
  'faq.laecheln.versprechen.antwort':
    'Nein, ausdrücklich nicht. Die Vorschau ist eine unverbindliche Illustration, wie ein Lächeln aussehen könnte. Was in Ihrem Fall tatsächlich möglich ist, hängt von Zahnstellung, Zahnsubstanz, Zahnfleisch und Kieferverhältnissen ab – das lässt sich nur bei einer persönlichen Untersuchung beurteilen.',
  'faq.laecheln.welchesFoto.frage': 'Was für ein Foto brauche ich?',
  'faq.laecheln.welchesFoto.antwort':
    'Ein frontales Porträt bei gutem, gleichmäßigem Licht, auf dem Sie lächeln und die oberen Zähne sichtbar sind. Kein starkes Gegenlicht, keine Schönheitsfilter und möglichst ohne Maske oder Hand vor dem Mund.',
  'faq.laecheln.werSiehtEs.frage': 'Wer sieht mein Foto?',
  'faq.laecheln.werSiehtEs.antwort':
    'Für die Berechnung wird das Bild an unseren KI-Dienstleister übermittelt und dort verarbeitet. Niemand aus unserem Team sieht Ihr Foto, es sei denn, Sie zeigen es uns selbst beim Termin. Details stehen in unserer Datenschutzerklärung.',
  'faq.laecheln.fuerKind.frage': 'Kann ich das für mein Kind machen?',
  'faq.laecheln.fuerKind.antwort':
    'Nein. Die Vorschau ist ausschließlich für volljährige Personen und nur für ein Foto von Ihnen selbst gedacht. Bitte laden Sie keine Fotos anderer Personen hoch.',

  // ── Digitale Anamnese (Standortseite) ───────────────────────────────
  'faq.anamnese.wasIstDas.frage': 'Was ist ein Anamnesebogen und warum brauchen Sie den?',
  'faq.anamnese.wasIstDas.antwort':
    'Der Anamnesebogen erfasst Ihre Vorerkrankungen, Medikamente, Allergien und Unverträglichkeiten. Das ist keine Formalität: Blutverdünner, Bisphosphonate, Herzerkrankungen oder eine Schwangerschaft ändern konkret, wie und womit wir behandeln dürfen. Ohne diese Angaben können wir bestimmte Eingriffe nicht sicher durchführen.',
  'faq.anamnese.dauer.frage': 'Wie lange dauert das Ausfüllen?',
  'faq.anamnese.dauer.antwort':
    'Etwa fünf bis zehn Minuten. Sie können zwischendurch pausieren und in Ruhe auf Ihrem Medikamentenplan nachsehen – das ist zu Hause deutlich einfacher als auf einem Klemmbrett im Wartezimmer.',
  'faq.anamnese.datensicherheit.frage': 'Sind meine Gesundheitsdaten dabei sicher?',
  'faq.anamnese.datensicherheit.antwort':
    'Die Anamnese läuft über Nelly Solutions, einen auf Zahnarztpraxen spezialisierten Anbieter mit Serverstandort in der EU. Die Daten fließen verschlüsselt direkt in unser Praxisverwaltungssystem. Diese Website selbst speichert keine Gesundheitsdaten – sie leitet Sie nur zum Formular weiter.',
  'faq.anamnese.mussDigital.frage': 'Muss ich das digital machen?',
  'faq.anamnese.mussDigital.antwort':
    'Nein. Wenn Sie lieber auf Papier ausfüllen, sagen Sie das einfach beim Termin – wir haben die Bögen selbstverständlich weiterhin vor Ort. Digital ist ein Angebot, keine Bedingung.',
  'faq.anamnese.erneut.frage': 'Ich war schon einmal da – muss ich das erneut ausfüllen?',
  'faq.anamnese.erneut.antwort':
    'Bei Wiedervorstellung fragen wir in längeren Abständen nach Änderungen. Wenn sich bei Ihnen etwas geändert hat – neue Medikamente, eine neue Diagnose, eine Schwangerschaft –, sagen Sie uns das bitte in jedem Fall, auch zwischen den Terminen.',

  /* ── Standortstartseite ────────────────────────────────────────────────
   *
   * Hier tragen fast alle Sätze einen Platzhalter: Standortname, Ort,
   * Adresse, Anzahl. Genau deshalb waren sie mit einer Vorlagenzeichenkette
   * gebaut – und genau deshalb standen sie auf /en/ deutsch da.
   */
  'faq.ort.titel': 'Fragen zu KU64 {name}',
  'faq.ort.oepnv.frage': 'Wie erreiche ich KU64 {name} mit öffentlichen Verkehrsmitteln?',
  'faq.ort.oepnv.antwort': '{oepnv}. Die Praxis liegt in der {strasse}, {plz} {ort}.',
  'faq.ort.parken.frage': 'Kann ich bei KU64 {name} parken?',
  'faq.ort.barrierefrei.frage': 'Ist die Praxis in {ort} barrierefrei?',
  'faq.ort.barrierefrei.antwortJa':
    'Ja, KU64 {name} ist barrierefrei zugänglich. Melden Sie sich gern vorab, wenn Sie besondere Unterstützung benötigen – dann bereiten wir alles vor.',
  'faq.ort.barrierefrei.antwortRuecksprache':
    'Bitte sprechen Sie uns vorab an, wir finden gemeinsam eine Lösung.',
  'faq.ort.leistungen.frage': 'Welche Leistungen bietet KU64 {name} an?',
  'faq.ort.leistungen.antwort':
    'An diesem Standort behandeln wir {anzahl} Leistungen aus {bereiche} Fachbereichen, darunter {beispiele}. Nicht jede Leistung wird an jedem KU64-Standort angeboten – auf dieser Seite sehen Sie ausschließlich das Angebot in {ort}.',
  'faq.ort.neuePatienten.frage': 'Nehmen Sie neue Patientinnen und Patienten auf?',
  'faq.ort.neuePatienten.antwort':
    'Ja. Sie können online einen Termin buchen oder uns anrufen. Für den ersten Termin füllen Sie den Anamnesebogen bequem vorab digital aus – das spart Zeit im Wartezimmer.',

  // ── Terminseite eines Standorts ─────────────────────────────────────
  'faq.ortTermine.zweiKalender.frage': 'Warum gibt es bei KU64 {name} zwei Terminkalender?',
  'faq.ortTermine.zweiKalender.antwort':
    'Zahnmedizin und Kieferorthopädie werden hier von getrennten Teams behandelt und haben deshalb je einen eigenen Kalender: {kalender}. Wählen Sie den Kalender, der zu Ihrem Anliegen passt – bei Unsicherheit rufen Sie an, wir ordnen es zu.',
  'faq.ortTermine.bisWann.frage': 'Bis wann kann ich in {ort} einen Termin bekommen?',
  'faq.ortTermine.bisWann.antwort':
    '{zeiten}. Die kürzeren Tage sind fest so gelegt – ein Abendtermin ist an ihnen nicht möglich, dafür an den übrigen.',
  'faq.ortTermine.bisWannTag': '{tag} bis {bis} Uhr',
  'faq.ortTermine.wochenende.frage':
    'Kann ich bei KU64 {name} am Wochenende einen Termin bekommen?',
  'faq.ortTermine.wochenende.antwort':
    '{tage} behandeln wir nach Vereinbarung. Das heißt: nicht ohne Termin, aber sehr wohl möglich – rufen Sie unter {telefon} an, dann klären wir es.',
  'faq.ortTermine.anfahrt.frage': 'Wie komme ich zu KU64 {name}?',
  'faq.ortTermine.anfahrt.antwort':
    '{oepnv}. {parken} Die Adresse lautet {strasse}, {plz} {ort}.',
  /* ── Vorschlagsfragen des Beraters ────────────────────────────────────
   *
   * Sie standen als `standardVorschlaege` im Vorspann von Berater.astro –
   * dem Baustein, der auf JEDER Seite steht. Damit waren sie der Posten mit
   * der größten Reichweite unter den fest verdrahteten Fragen: vier deutsche
   * Sätze auf über tausend gebauten Seiten, in jeder Sprache.
   *
   * Zwei Fassungen, weil die Auswahl davon abhängt, ob die Seite zu einem
   * Standort gehört. Mit Standort kann die erste Frage konkret werden, ohne
   * Standort muss sie zuerst zur Wahl führen.
   */
  'berater.vorschlagLeistungenOrt': 'Welche Leistungen gibt es bei KU64 {name}?',
  'berater.vorschlagZahnreinigung': 'Was kostet eine professionelle Zahnreinigung?',
  'berater.vorschlagAngst': 'Ich habe Angst vor dem Zahnarzt – wie läuft der erste Termin?',
  'berater.vorschlagAnfahrt': 'Wie komme ich zu Ihnen und kann ich parken?',
  'berater.vorschlagWelcherStandort': 'Welcher Standort passt zu mir?',
  'berater.vorschlagImplantate': 'An welchen Standorten gibt es Implantate?',
  /* Beschriftungen der Angabenliste auf /ki-transparenz/. Sie standen als
     nackte <dt>-Texte in der Vorlage; einzelne Substantive fallen dem
     Deutschfinder nicht auf, auf der englischen Seite aber sofort. */
  'kitrans.marke': 'Transparenz',
  'kitrans.anbieter': 'Anbieter',
  'kitrans.modell': 'Modell',
  'kitrans.grenzen': 'Grenzen',
  'kitrans.kontaktformular': 'Kontaktformular',
  'kitrans.datenschutzerklaerung': 'Datenschutzerklärung',
  /* ── Beschwerdeübersicht: die Gruppenüberschriften ─────────────────────
   *
   * Acht Überschriften, die als `frage` in einem Datenfeld im Vorspann von
   * zahnbeschwerden/index.astro standen – gefunden von der neuen
   * Vorspannsuche in scripts/deutsch-finden.mjs, gleich beim ersten Lauf.
   *
   * Sie sind absichtlich in der Sprache formuliert, in der jemand seine
   * Beschwerde beschreibt, und nicht in der Fachsprache: „Es tut weh" statt
   * „Schmerzsymptomatik". Genau das muss beim Übersetzen erhalten bleiben.
   */
  'beschw.gruppeSchmerzen': 'Es tut weh',
  'beschw.gruppeZahnfleisch': 'Etwas stimmt mit dem Zahnfleisch nicht',
  'beschw.gruppeZahnsubstanz': 'Am Zahn selbst',
  'beschw.gruppeAussehen': 'Die Zähne gefallen mir nicht',
  'beschw.gruppeMund': 'Im Mund',
  'beschw.gruppeKinder': 'Bei Kindern, mit Spange',
  'beschw.gruppeVorbeugen': 'Damit es gar nicht erst so weit kommt',
  'beschw.gruppeSonstiges': 'Sonstiges',
} as const;

export type TextSchluessel = keyof typeof TEXTE;
