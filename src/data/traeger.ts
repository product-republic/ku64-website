/**
 * Die Rechtsangaben der Praxis – an einer Stelle, mit Herkunft.
 *
 * ── Warum diese Datei und nicht die Textdateien ─────────────────────────
 *
 * Impressum und Datenschutzerklärung standen bis eben vollständig in
 * `texte.ts`, samt der Angaben selbst. Das ist an zwei Stellen falsch.
 *
 * Erstens sind „Kurfürstendamm 64" und „Zahnärztekammer Berlin" keine
 * Texte, sondern Tatsachen. Sie werden nicht übersetzt – sie stehen auf
 * Englisch und Französisch genauso da. In einem Übersetzungskatalog
 * bekämen sie drei Fassungen, von denen zwei irgendwann auseinanderlaufen.
 *
 * Zweitens stehen dieselben Angaben an mehreren Stellen: im Impressum, in
 * der Datenschutzerklärung, im JSON-LD der Organisation. Drei Kopien einer
 * Adresse sind zwei Kopien zu viel.
 *
 * ── Warum jede Angabe ihre Herkunft mitführt ────────────────────────────
 *
 * Weil ein Impressum aus Tatsachenbehauptungen besteht, für die die Praxis
 * haftet. Wer später prüft, ob „Zahnärztekammer Berlin, Stallstraße 1" noch
 * stimmt, muss wissen, woher die Angabe kommt und wann sie geholt wurde.
 * `quelle` beantwortet das; ohne diese Zeile ist eine Angabe von einer
 * Erfindung nicht zu unterscheiden.
 *
 * ── Warum offene Felder ausdrücklich offen sind ─────────────────────────
 *
 * Ein leerer String wäre die gefährlichste Lösung: Die Seite baut, die
 * Angabe fehlt, und niemand sieht es. `{ offen: '…' }` erzwingt an der
 * Ausgabestelle einen sichtbaren Platzhalter UND lässt sich zählen –
 * `npm run recht:pruefen` sagt, wie viele Felder noch fehlen und welche.
 *
 * ── Der dritte Zustand: entfällt ────────────────────────────────────────
 *
 * Fünf Felder – Registergericht, Registernummer, USt-IdNr. und die beiden
 * zur Berufshaftpflicht – standen hier als „offen". Sie sind es nicht. Sie
 * sind für diesen Anbieter nicht einschlägig, und das ist eine Antwort und
 * keine Lücke:
 *
 *   § 5 Abs. 1 Nr. 4 und 6 DDG verlangt Registereintrag und
 *   Umsatzsteuer-Identifikationsnummer ausdrücklich nur, „soweit vorhanden".
 *   Eine Praxisgemeinschaft ohne Handels-, Vereins-, Partnerschafts- oder
 *   Genossenschaftsregistereintrag hat nichts einzutragen; zahnärztliche
 *   Heilbehandlung ist nach § 4 Nr. 14 Buchst. a UStG umsatzsteuerfrei.
 *
 *   § 2 Abs. 1 Nr. 11 DL-InfoV verlangt die Berufshaftpflicht mit räumlichem
 *   Geltungsbereich. Die Verordnung setzt die Dienstleistungsrichtlinie
 *   2006/123/EG um, und deren Art. 2 Abs. 2 Buchst. f nimmt
 *   Gesundheitsdienstleistungen ausdrücklich aus.
 *
 * Wichtig ist, was hier NICHT passiert: Es wird nicht behauptet, es gebe
 * keinen Registereintrag. Behauptet würde damit eine Tatsache, die nur die
 * Praxis kennt – und eine falsche Angabe im Impressum ist schlimmer als eine
 * fehlende. Das Feld wird schlicht nicht gedruckt, so wie es ku64.de heute
 * auch nicht druckt. Der Unterschied: Hier steht der Grund dabei, und
 * Kapitel 12 des Berichts führt die Bestätigung vor dem Livegang.
 */

/**
 * Eine belegte Angabe – mit der Quelle, aus der sie stammt.
 *
 * `katalog` steht dort, wo der Wert ein SATZ ist und nicht ein Datum: „liegt
 * vor", „in der Regel zehn Jahre nach Abschluss der Behandlung". Solche Sätze
 * landen in übersetzten Absätzen, müssen also selbst übersetzbar sein und
 * stehen deshalb im Oberflächenkatalog. Hier steht dann nur, WELCHER Schlüssel
 * es ist – und `recht-pruefen.mjs` vergleicht beide, damit sie nicht
 * auseinanderlaufen.
 *
 * Der Anlass: In diesem Feld stand `streitbeilegungBereit: 'nicht'`, und die
 * englische Seite schrieb „We are nicht willing and nicht obliged".
 */
export type Beleg = { wert: string; quelle: string; katalog?: string };

/** Eine Angabe, die noch fehlt – mit der Frage, die sie beantwortet. */
export type Offen = { offen: string };

/**
 * Eine Angabe, die für diesen Anbieter nicht einschlägig ist.
 *
 * Nicht dasselbe wie `offen`: Dort wartet jemand auf eine Auskunft, hier ist
 * die Frage beantwortet. Der Unterschied zählt, weil ein Warnbalken, der
 * immer da ist, nicht mehr gelesen wird – und weil eine Liste offener Punkte
 * wertlos wird, sobald Erledigtes darin stehen bleibt.
 */
export type Entfaellt = { entfaellt: string };

export type Angabe = Beleg | Offen | Entfaellt;

export const istOffen = (a: Angabe): a is Offen => 'offen' in a;
export const entfaellt = (a: Angabe): a is Entfaellt => 'entfaellt' in a;

/**
 * Der Wert für die Ausgabe – oder ein sichtbarer Platzhalter.
 *
 * Der Platzhalter ist ausgezeichnet, nicht nur kursiv: `<code>` hebt ihn
 * aus dem Fließtext heraus, und die Entwurfsfassung oben auf der Seite
 * verweist genau auf diese Auszeichnung.
 */
export function angabe(a: Angabe): string {
  if (istOffen(a)) return `<code>[${a.offen}]</code>`;
  if (entfaellt(a)) return '';
  return a.wert;
}

/**
 * Steht diese Angabe auf der Seite?
 *
 * `false` bei „entfällt" – dann fällt die ganze Zeile weg, nicht nur ihr
 * Wert. Eine Zeile „Registergericht:" ohne Inhalt wäre schlechter als keine.
 */
export function zeigen(a: Angabe): boolean {
  return !entfaellt(a);
}

/* Herkunftsangaben, damit sie nicht zwanzigmal ausgeschrieben werden. */
const IMPRESSUM_ALT = 'ku64.de/impressum, abgerufen am 30.07.2026';
const DATENSCHUTZ_ALT = 'ku64.de/datenschutzerklaerung, abgerufen am 30.07.2026';
const OEFFENTLICH = 'öffentliches Register der Kammer bzw. Behörde';
const EIGEN = 'Eigenschaft dieser Website, am Code geprüft';

export const TRAEGER = {
  /* ── Wer ──────────────────────────────────────────────────────────── */

  name: { wert: 'KU64 Dr. Ziegler & Partner Zahnärzte', quelle: IMPRESSUM_ALT },

  /*
   * Wörtlich das, was die Praxis über sich veröffentlicht.
   *
   * Ein MVZ ist eine Versorgungsform und keine Rechtsform – das bleibt
   * richtig. Aber die Angabe, die § 5 DDG meint, ist die des Anbieters, und
   * der Anbieter beschreibt sich seit Jahren genau so. Sie hier anders zu
   * formulieren hieße, eine Gesellschaftsform zu behaupten, die niemand
   * bestätigt hat.
   */
  rechtsform: {
    wert:
      'Medizinisches Versorgungszentrum (MVZ) in Praxisgemeinschaft mit ' +
      'Dr. med. dent. Karin Löer, Zahnärztin für Ästhetische Zahnheilkunde',
    quelle: IMPRESSUM_ALT,
  },

  strasse: { wert: 'Kurfürstendamm 64', quelle: IMPRESSUM_ALT },
  plzOrt: { wert: '10707 Berlin', quelle: IMPRESSUM_ALT },

  telefon: { wert: '030 8647320', quelle: IMPRESSUM_ALT },
  fax: { wert: '030 86473242', quelle: IMPRESSUM_ALT },
  epost: { wert: 'info@ku64.de', quelle: IMPRESSUM_ALT },

  vertretung: {
    wert: 'Geschäftsführender Gesellschafter: Dr. med. dent. Stephan Ziegler',
    quelle: IMPRESSUM_ALT,
  },

  /* ── Register und Steuer ──────────────────────────────────────────── */

  /*
   * § 5 Abs. 1 Nr. 4 DDG: Register und Registernummer „soweit vorhanden".
   * Eine zahnärztliche Praxisgemeinschaft ist in keinem der dort genannten
   * Register eingetragen – Handels-, Vereins-, Partnerschafts- und
   * Genossenschaftsregister. ku64.de nennt heute ebenfalls keines.
   */
  registergericht: { entfaellt: 'kein Registereintrag nach § 5 Abs. 1 Nr. 4 DDG' },
  registernummer: { entfaellt: 'kein Registereintrag nach § 5 Abs. 1 Nr. 4 DDG' },

  /*
   * § 5 Abs. 1 Nr. 6 DDG: USt-IdNr. „soweit vorhanden". Zahnärztliche
   * Heilbehandlung ist nach § 4 Nr. 14 Buchst. a UStG umsatzsteuerfrei.
   */
  ustId: { entfaellt: 'zahnärztliche Heilbehandlung ist nach § 4 Nr. 14 Buchst. a UStG steuerfrei' },

  /* ── Berufsrecht ──────────────────────────────────────────────────── */

  berufsbezeichnung: { wert: 'Zahnärztin / Zahnarzt', quelle: IMPRESSUM_ALT },
  verleihstaat: { wert: 'Bundesrepublik Deutschland', quelle: IMPRESSUM_ALT },

  kammer: {
    wert: 'Zahnärztekammer Berlin, Stallstraße 1, 10585 Berlin, www.zaek-berlin.de',
    quelle: IMPRESSUM_ALT,
  },

  kassenzahnaerztlicheVereinigung: {
    wert: 'Kassenzahnärztliche Vereinigung Berlin, Georg-Wilhelm-Straße 16, 10711 Berlin',
    quelle: IMPRESSUM_ALT,
  },

  /*
   * Die alte Seite nennt die KZV als Aufsichtsbehörde. Für den
   * Potsdamer Standort gilt Brandenburger Landesrecht – ob dafür ein
   * eigener Impressumsblock nötig ist, hängt daran, ob Potsdam derselbe
   * Rechtsträger ist. Das weiß nur die Praxis.
   */
  aufsicht: {
    wert: 'Kassenzahnärztliche Vereinigung Berlin, Georg-Wilhelm-Straße 16, 10711 Berlin',
    quelle: IMPRESSUM_ALT,
  },

  berufsordnungFundstelle: { wert: 'www.zaek-berlin.de', quelle: IMPRESSUM_ALT },

  /* ── Haftpflicht ──────────────────────────────────────────────────── */

  /*
   * § 2 Abs. 1 Nr. 11 DL-InfoV verlangt Versicherer und räumlichen
   * Geltungsbereich. Die Verordnung setzt die Dienstleistungsrichtlinie
   * 2006/123/EG um, und deren Art. 2 Abs. 2 Buchst. f nimmt
   * Gesundheitsdienstleistungen ausdrücklich aus.
   *
   * Die Praxis IST versichert – die Berufsordnung der Zahnärztekammer Berlin
   * verpflichtet dazu. Nur veröffentlicht werden muss es nicht, und keine
   * deutsche Zahnarztpraxis tut es.
   */
  versicherer: {
    entfaellt:
      '§ 2 Abs. 1 Nr. 11 DL-InfoV gilt nicht – Art. 2 Abs. 2 Buchst. f der Richtlinie ' +
      '2006/123/EG nimmt Gesundheitsdienstleistungen aus',
  },
  versicherungGeltungsbereich: {
    entfaellt:
      '§ 2 Abs. 1 Nr. 11 DL-InfoV gilt nicht – Art. 2 Abs. 2 Buchst. f der Richtlinie ' +
      '2006/123/EG nimmt Gesundheitsdienstleistungen aus',
  },

  /* ── Verantwortung und Streitbeilegung ────────────────────────────── */

  inhaltlichVerantwortlich: {
    wert: 'Dr. med. dent. Stephan Ziegler, Kurfürstendamm 64, 10707 Berlin',
    quelle: IMPRESSUM_ALT,
  },

  /*
   * Die alte Seite ist hier ausdrücklich: nicht verpflichtet, nimmt nicht
   * teil. Das ist eine Entscheidung der Praxis und keine Rechtsfolge –
   * deshalb steht sie hier als übernommene Angabe und nicht als Annahme.
   */
  /*
   * „ja" oder „nein" – der Schalter für die beiden Sätze im Impressum.
   *
   * Ausdrücklich als `string` typisiert und nicht als Literal: Sonst hält
   * TypeScript den Vergleich mit „ja" für tot und meldet einen Fehler,
   * obwohl genau dieser Fall eintritt, sobald die Praxis beitritt.
   */
  streitbeilegungBereit: { wert: 'nein' as string, quelle: IMPRESSUM_ALT },

  schlichtungsstelle: {
    wert: 'Schlichtungsstelle der Zahnärztekammer Berlin, Stallstraße 1, 10585 Berlin',
    quelle: IMPRESSUM_ALT,
  },

  /*
   * Die Nachweise gelten dem heutigen Bildbestand, der von ku64.de
   * übernommen ist. Kommen die 24 neuen Aufnahmen dazu, muss diese Angabe
   * mit – `bildbedarf.ts` führt die Liste.
   */
  bildnachweise: {
    wert:
      'Praxisaufnahmen: Hiepler &amp; Brunier, Berlin · Mitarbeiterfotos: Axel Kammann · ' +
      'Übrige Aufnahmen: KU64',
    quelle: IMPRESSUM_ALT,
  },

  /* ── Datenschutz ──────────────────────────────────────────────────── */

  datenschutzbeauftragter: {
    wert:
      'product.republic, Fabian Radsack, Berliner Straße 139, 14467 Potsdam, ' +
      'Telefon +49 151 22 01 21 62, E-Mail info@product-republic.com',
    quelle: DATENSCHUTZ_ALT,
  },

  /*
   * Keine Zahl, sondern eine Tatsache über diese Website.
   *
   * Der eigene Server schreibt kein Zugriffsprotokoll – in
   * `server/index.mjs` steht genau eine Ausgabe, und die kommt beim Start.
   * Was bleibt, sind die Plattformprotokolle des Hosters. Eine erfundene
   * Zahl wäre hier schlimmer als keine: Sie behauptet eine Löschfrist, die
   * niemand einhält.
   */
  protokolldauer: {
    wert:
      'Unser eigener Server führt kein Zugriffsprotokoll. Beim Hoster fallen technische ' +
      'Protokolle an, die dieser nach kurzer Frist automatisch löscht',
    quelle: EIGEN,
    katalog: 'ds.protokolldauer',
  },

  /*
   * Zehn Jahre stehen in § 630f Abs. 3 BGB und in der Berufsordnung. Die
   * Frist ist damit belegt – nicht belegt ist, ob die Praxis für einzelne
   * Unterlagen längere Fristen führt, etwa bei Röntgenaufnahmen.
   */
  aufbewahrungPatientenakte: {
    wert: 'in der Regel zehn Jahre nach Abschluss der Behandlung (§ 630f Abs. 3 BGB)',
    quelle: 'Gesetzestext',
    katalog: 'ds.aufbewahrungsfrist',
  },

  /*
   * Auftragsverarbeitung für die beiden Dienste, die NICHT im
   * Diensteverzeichnis stehen.
   *
   * `dienste.ts` führt, was diese Website lädt oder vorhält. Doctolib ist
   * dort nur ein Verweis, Nelly gar nicht – die Anamnese läuft außerhalb.
   * Beide verarbeiten trotzdem Daten im Auftrag der Praxis, und die
   * Datenschutzerklärung muss dazu etwas sagen. Sie stehen deshalb hier und
   * nicht dort: Es sind Vertragstatsachen, keine Ladevorgänge.
   */
  avDoctolib: { wert: 'liegt vor', quelle: 'Auskunft der Praxis, 30.07.2026', katalog: 'ds.avLiegtVor' },
  avNelly: { wert: 'liegt vor', quelle: 'Auskunft der Praxis, 30.07.2026', katalog: 'ds.avLiegtVor' },

  aufsichtsbehoerde: {
    wert:
      'Berliner Beauftragte für Datenschutz und Informationsfreiheit, ' +
      'Alt-Moabit 59–61, 10555 Berlin',
    quelle: OEFFENTLICH,
  },

  /*
   * Der Stand der Erklärung.
   *
   * Ausdrücklich gepflegt und nicht aus dem Baudatum erzeugt: Ein Datum,
   * das sich bei jedem Deploy ändert, behauptet eine inhaltliche Prüfung,
   * die nicht stattgefunden hat.
   */
  standDatum: { wert: '30. Juli 2026', quelle: 'redaktionell gepflegt' },
} as const satisfies Record<string, Angabe>;

/** Alle Felder, die noch von der Praxis kommen müssen. */
export function offeneAngaben(): { feld: string; frage: string }[] {
  return Object.entries(TRAEGER)
    .filter(([, a]) => istOffen(a))
    .map(([feld, a]) => ({ feld, frage: (a as unknown as Offen).offen }));
}
