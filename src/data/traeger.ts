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
 * ── Was noch offen ist, fehlt heute schon ──────────────────────────────
 *
 * Die sechs verbliebenen Felder – Rechtsform, Registergericht,
 * Registernummer, USt-IdNr. und die beiden zur Berufshaftpflicht – stehen
 * NICHT auf ku64.de. Nicht unvollständig, sondern gar nicht: Das heutige
 * Impressum nennt weder einen Registereintrag noch eine Versicherung.
 *
 * Das ist der Grund, warum sie hier nicht einfach übernommen werden
 * konnten – und zugleich ein Befund über den Bestand. § 5 DDG verlangt
 * Register und Umsatzsteuer-Identnummer, soweit vorhanden; § 2 DL-InfoV
 * verlangt bei Dienstleistungen die Berufshaftpflicht mit räumlichem
 * Geltungsbereich. „Soweit vorhanden" heißt: Wenn es sie gibt, müssen sie
 * dastehen; wenn nicht, ist die richtige Antwort ein ausdrückliches
 * „besteht nicht" und kein Weglassen.
 *
 * Der Neubau ist damit an dieser Stelle nicht schlechter als der Bestand,
 * sondern ehrlicher: Was fehlt, steht sichtbar als Platzhalter da und wird
 * bei jedem Bau gezählt, statt lautlos zu fehlen. Aufgenommen als offener
 * Punkt in OFFEN.md.
 */

/** Eine belegte Angabe – mit der Quelle, aus der sie stammt. */
export type Beleg = { wert: string; quelle: string };

/** Eine Angabe, die noch fehlt – mit der Frage, die sie beantwortet. */
export type Offen = { offen: string };

export type Angabe = Beleg | Offen;

export const istOffen = (a: Angabe): a is Offen => 'offen' in a;

/**
 * Der Wert für die Ausgabe – oder ein sichtbarer Platzhalter.
 *
 * Der Platzhalter ist ausgezeichnet, nicht nur kursiv: `<code>` hebt ihn
 * aus dem Fließtext heraus, und die Entwurfsfassung oben auf der Seite
 * verweist genau auf diese Auszeichnung.
 */
export function angabe(a: Angabe): string {
  return istOffen(a) ? `<code>[${a.offen}]</code>` : a.wert;
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
   * Die alte Seite sagt „ist ein MVZ", nennt aber keine Rechtsform der
   * Gesellschaft. Beides ist nicht dasselbe: Ein MVZ ist eine
   * Versorgungsform, keine Rechtsform. „& Partner" im Namen legt eine
   * Partnerschaftsgesellschaft nahe – legen ist nicht wissen.
   */
  rechtsform: { offen: 'Rechtsform der Gesellschaft, z. B. PartG mbB oder GmbH' },

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

  registergericht: { offen: 'Registergericht' },
  registernummer: { offen: 'Registernummer' },

  /*
   * Zahnärztliche Heilbehandlung ist nach § 4 Nr. 14 UStG steuerfrei –
   * viele Praxen haben deshalb gar keine Umsatzsteuer-Identnummer.
   * „Haben wir nicht" ist eine gültige Antwort und muss trotzdem von der
   * Praxis kommen, nicht von mir.
   */
  ustId: { offen: 'USt-IdNr. nach § 27a UStG – oder Bestätigung, dass keine besteht' },

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

  versicherer: { offen: 'Name und Anschrift der Berufshaftpflichtversicherung' },
  versicherungGeltungsbereich: { offen: 'räumlicher Geltungsbereich der Versicherung' },

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
  streitbeilegungBereit: { wert: 'nicht', quelle: IMPRESSUM_ALT },

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
  },

  /*
   * Zehn Jahre stehen in § 630f Abs. 3 BGB und in der Berufsordnung. Die
   * Frist ist damit belegt – nicht belegt ist, ob die Praxis für einzelne
   * Unterlagen längere Fristen führt, etwa bei Röntgenaufnahmen.
   */
  aufbewahrungPatientenakte: {
    wert: 'in der Regel zehn Jahre nach Abschluss der Behandlung (§ 630f Abs. 3 BGB)',
    quelle: 'Gesetzestext',
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
  avDoctolib: { wert: 'liegt vor', quelle: 'Auskunft der Praxis, 30.07.2026' },
  avNelly: { wert: 'liegt vor', quelle: 'Auskunft der Praxis, 30.07.2026' },

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
    .map(([feld, a]) => ({ feld, frage: (a as Offen).offen }));
}
