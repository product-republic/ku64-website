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
  /* ── Behandlungsseiten ────────────────────────────────────────────────
   *
   * Standen bis eben fest in den Vorlagen. Der Katalog meldete deshalb 99,9
   * Prozent Übersetzung, und auf der englischen Seite stand trotzdem „Wo
   * möchten Sie teeth whitening lassen?" – ein Satz, der nie ein Baustein
   * war. Der Sprachwächter konnte ihn nicht vermissen.
   */
  'leistung.dauer': 'Dauer',
  'leistung.kosten': 'Kosten',
  'leistung.verfuegbarAn': 'Verfügbar an',
  'leistung.vonStandorten': '{wo} von {gesamt} Standorten',
  'leistung.woLassen': 'Wo möchten Sie {name} lassen?',
  'leistung.standortWaehlen':
    'Wählen Sie Ihren Standort – dort finden Sie Sprechzeiten, Telefonnummer und die Terminbuchung für genau diese Behandlung.',
  'leistung.hierAnsehen': '{name} hier ansehen',
  'leistung.nichtAngebotenAn': 'Nicht angeboten an:',
  'leistung.nichtAngebotenHinweis':
    'Wir sagen das offen, damit Sie nicht vergeblich dort anrufen.',
  'leistung.kasse': 'Zahlt die Krankenkasse?',
  'leistung.ablauf': 'So läuft die Behandlung ab',
  'leistung.synonyme': 'Auch bekannt als',
  'leistung.haeufigeFragen': '{name}: häufige Fragen',
  'leistung.passtDazu': 'Passt dazu',
  'leistung.ansprechperson': 'Ihre Ansprechperson',
  'leistung.ansprechpersonen': 'Ihre Ansprechpersonen',
  'leistung.ansprechpersonIn': 'Ihre Ansprechperson in {ort}',
  'leistung.ansprechpersonenIn': 'Ihre Ansprechpersonen in {ort}',
  'leistung.beschwerdenHierher': 'Beschwerden, die hierher führen',
  'leistung.terminFuer': 'Termin für {name}',
  'leistung.onlineBuchen': 'Online buchen',
  'leistung.fragenVorab':
    'Fragen vorab? Unser digitaler Berater antwortet rund um die Uhr – auch zu {name}.',
  'leistung.sieSehenAngabenFuer': 'Sie sehen gerade die Angaben für',
  'leistung.auchHier':
    'Diese Behandlung bieten wir auch hier an – falls Ihnen ein anderer Standort besser passt:',
  'leistung.ergaenzend': 'Ergänzend – an anderen Standorten',
  'leistung.hierNicht':
    'Diese Behandlung wird an unserem Standort {ort} nicht angeboten. Wir sagen Ihnen offen, wo Sie sie bekommen.',
  'leistung.inOrt': 'in {ort}',
  'leistung.termin': 'Termin',
  'leistung.anAnderenStandorten': '{name} an anderen KU64-Standorten',
  'leistung.sieSehenAngaben':
    'Sie sehen gerade die Angaben für KU64 {ort}. Diese Behandlung bieten wir auch hier an – falls Ihnen ein anderer Standort besser passt:',
  'leistung.beraterHinweisVor': 'Fragen vorab? Unser',
  'leistung.beraterHinweisLink': 'digitaler Berater',
  'leistung.beraterHinweisNach': 'antwortet rund um die Uhr – auch zu {name}.',
  'leistung.ergaenzendText':
    'Diese Behandlungen hängen mit {name} zusammen, werden bei KU64 {ort} aber nicht angeboten. Wir sagen Ihnen offen, wo Sie sie bekommen.',

  /* ── Brotkrumen ───────────────────────────────────────────────────────
   *
   * Sie stehen auf jeder einzelnen Seite und waren auf jeder deutsch.
   */
  'krume.start': 'Start',
  'krume.leistungen': 'Leistungen',
  'krume.beschwerden': 'Beschwerden',
  'krume.team': 'Team',
  'krume.blog': 'Blog',
  'krume.suche': 'Suche',

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
  'beratung.fragenZuEinerBehandlung': 'Fragen zu einer Behandlung, zu Kosten oder zum Ablauf? Stellen Sie sie laut – der Berater antwortet in natürlicher Sprache und kennt das Angebot jedes Standorts.',
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
  'laecheln.einVeraendertesLaechelnEntsteht': 'Ein verändertes Lächeln entsteht je nach Ausgangslage über verschiedene Wege. Diese Behandlungen kommen dafür am häufigsten infrage:',
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
  'suche.alleBehandlungenNachBereich': 'Alle Behandlungen nach Bereich',
  'suche.aufEineFrageIst': 'Auf eine Frage ist eine Liste die falsche Antwort. Unser digitaler Berater beantwortet sie Ihnen – und wenn Sie lieber mit einem Menschen sprechen, steht die Nummer Ihres Standorts oben.',
  'suche.behandlungenBeschwerdenStandorteUnd': 'Behandlungen, Beschwerden, Standorte und Menschen. Sie können den Fachbegriff eingeben – müssen aber nicht.',
  'suche.dasKlingtNachEiner': 'Das klingt nach einer Frage.',
  'suche.frageAnDenBerater': 'Frage an den Berater',
  'suche.lochImZahn': 'loch im zahn',
  'suche.suchenSieNachEinem': 'Suchen Sie nach einem Symptom statt nach einer Behandlung?',
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
  'ueber.vonProphylaxeUeberKieferorthopaedie': 'Von Prophylaxe über Kieferorthopädie bis zur Oralchirurgie – für die meisten Behandlungen müssen Sie die Praxis nicht wechseln. Was ein Standort nicht abdeckt, übernimmt ein anderer.',
  'ueber.wirSagenOffenWas': 'Wir sagen offen, was eine Behandlung kostet, was die Kasse übernimmt und was nicht – und auch, wenn eine Behandlung an einem Standort gar nicht angeboten wird. Lieber ein Satz zu viel als ein vergeblicher Anruf.',
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
  'kontakt.unserDigitalerBeraterBeantwortet': 'Unser digitaler Berater beantwortet Fragen zu Behandlungen, Kosten und Abläufen – per Text oder Sprache.',
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
  'leistuebersicht.alleBehandlungen': 'Alle Behandlungen',
  'leistuebersicht.behandlungSuchen': 'Behandlung suchen',
  'leistuebersicht.zuIhrerSucheHaben': 'Zu Ihrer Suche haben wir nichts gefunden. Fragen Sie gern unseren digitalen Berater.',
  'standorte.behandlung': 'Behandlung',
  'start.digitaleAnamnese': 'Digitale Anamnese',
  'start.digitalerBerater': 'Digitaler Berater',
  'start.ku64DieZahnspezialisten': 'KU64 · Die Zahnspezialisten',
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
  'person.medizinischeLeitung': 'Medizinische Leitung',
  'teamliste.alle': 'Alle',
  'teamliste.auswahlAufheben': 'Auswahl aufheben',
  'teamliste.behandlungenAnsehen': 'Behandlungen ansehen',
  'teamliste.profilAnsehen': 'Profil ansehen',

  'nav.terminBuchen': 'Termin buchen',
  'nav.suchen': 'Suchen',

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

  // ── Standortseiten ──────────────────────────────────────────────────
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
    'Jeder Standort hat einen eigenen Charakter und ein eigenes Behandlungsangebot. Wählen Sie Ihren – danach zeigen wir Ihnen ausschließlich, was dort möglich ist.',
  'standorte.matrixTitel': 'Welche Behandlung gibt es wo?',
  'standorte.matrixVorspann':
    'Nicht jede Behandlung wird an jedem Standort angeboten. Diese Übersicht zeigt Ihnen vor dem Anruf, wohin Sie müssen.',
  'standorte.matrixBeschriftung': 'Verfügbarkeit der Behandlungen je KU64-Standort',

  // ── Kontakt ─────────────────────────────────────────────────────────
  'kontakt.vorspann':
    'Wählen Sie den Weg, der Ihnen am angenehmsten ist. Alle führen zum selben Team.',
  'kontakt.telefonText': 'Der schnellste Weg – besonders bei Schmerzen oder wenn es dringend ist.',
  'kontakt.termineText': 'Freie Termine sehen und direkt buchen, rund um die Uhr.',
  'kontakt.emailText':
    'Für alles, was nicht eilt. Bitte schicken Sie uns keine Gesundheitsdaten per unverschlüsselter E-Mail.',
  'kontakt.beraterText':
    'Unser digitaler Berater beantwortet Fragen zu Behandlungen, Kosten und Abläufen – per Text oder Sprache.',
} as const;

export type TextSchluessel = keyof typeof TEXTE;
