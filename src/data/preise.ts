/**
 * Preisrahmen – die Zahlen, die auf der Website stehen dürfen.
 *
 * HERKUNFT: Interne Auswertung "Der Heil- und Kostenplan als System",
 * KU64 / Riverlabs, Berlin, 20. Juli 2026, Datenstand 16.07.2026. Grundlage
 * sind 238.443 Heil- und Kostenpläne und 13,8 Millionen Leistungszeilen aus
 * dem Z1-Testsystem, pseudonymisiert und ohne Patientendaten.
 *
 * ACHTUNG – Übertragung: Die Werte sind aus Fotos der gedruckten Auswertung
 * übernommen. Vor Veröffentlichung müssen sie gegen die Originaldatei
 * abgeglichen werden. Bei Preisen einer Zahnarztpraxis ist ein Zahlendreher
 * kein Schönheitsfehler, sondern eine falsche Auskunft.
 *
 * ── Warum diese Zahlen anders sind als übliche "ab"-Preise ──────────────
 *
 * Sie sind keine Wunschzettel. In die Auswertung gehen ausschließlich Pläne
 * mit dem Status "angenommen/durchgeführt" ein – also das, wofür Menschen
 * sich tatsächlich entschieden haben, nicht das, was einmal vorgeschlagen
 * wurde.
 *
 * Und sie sind kein einzelner Wert, sondern drei. Die Auswertung teilt die
 * realen Pläne in Drittel (Terzile): Ein Drittel liegt im unteren Bereich,
 * eines in der Mitte, eines darüber. Gerundet auf 50 €, unten bei p10 und
 * oben bei p95 gekappt, damit weder ein Ausreißer nach unten Hoffnung macht
 * noch einer nach oben abschreckt.
 *
 * ── Die drei Befunde, die diese Seite prägen ────────────────────────────
 *
 * 1. Die Plan-Ranges halten der Datenprüfung stand. Innerhalb eines Plans
 *    fehlt nichts.
 * 2. Die BEHANDLUNGSSTRECKE ist das fehlende Bild. Im Halbjahresfenster
 *    kommen je nach Leistung 30 bis 190 % durch Folgepläne und planfreie
 *    Privatleistungen dazu. Wer nur den Plan nennt, nennt nicht die Kosten –
 *    deshalb steht die Strecke hier als eigene Angabe.
 * 3. Prophylaxe ist der größte blinde Fleck. Die professionelle Zahnreinigung
 *    taucht in bis zu 83 % aller Behandlungsstrecken auf, stand aber bisher
 *    nirgends auf der Preisseite. Sie gehört als sichtbarer Baustein dazu.
 *
 * ── Regel für Änderungen ────────────────────────────────────────────────
 *
 * Preisanstiege werden übernommen, sobald die Auswertung sie zeigt.
 * Preisrückgänge erst, wenn sie die Statusreife überlebt haben: Junge Pläne
 * sind systematisch unfertig – von den Plänen der letzten 30 Tage hatten erst
 * 417 von 2.031 den Status "angenommen". Ein früh gemeldeter Rückgang wäre
 * meist keiner, und eine Zahl zweimal zu ändern verunsichert mehr, als sie
 * nützt.
 */

export type Reifegrad =
  /** Aus der Auswertung übernommen und veröffentlichungsfähig. */
  | 'uebernommen'
  /** Rückgang gemessen, aber noch nicht statusreif – alter Wert bleibt stehen. */
  | 'zurueckgestellt'
  /** Zu kleine Fallzahl für eine belastbare Spanne. */
  | 'zu-duenn';

export interface Spanne {
  von: number;
  /** Fehlt bei offenen Spannen ("ab 5.300 €"). */
  bis?: number;
}

export interface Preisrahmen {
  /** Verweist auf den Slug in leistungen.ts, wo eine Entsprechung existiert. */
  leistung: string;
  /** Bezeichnung wie in der Auswertung. */
  name: string;
  /**
   * Die drei Preisdrittel. Ein Wert allein wäre eine Behauptung; drei zeigen,
   * dass der Aufwand von Fall zu Fall verschieden ist – und wie sehr.
   */
  terzile?: [Spanne, Spanne, Spanne];
  /** Für Leistungen, die sich nicht in Drittel teilen lassen. */
  einzelspanne?: Spanne;
  /** Kurzer Zusatz, z. B. "je Implantat" oder "meist 130–180 €". */
  hinweis?: string;
  /**
   * Was im Halbjahr nach dem Plan typischerweise noch dazukommt, in Prozent
   * des Planbetrags. Das ist die Zahl, die sonst niemand nennt.
   */
  streckeAufschlagProzent?: number;
  reife: Reifegrad;
}

/**
 * Professionelle Zahnreinigung – bewusst an erster Stelle und nicht in der
 * Liste versteckt. Sie ist in bis zu 83 % aller Behandlungsstrecken
 * enthalten und damit die wahrscheinlichste Position überhaupt.
 */
export const PROPHYLAXE = {
  leistung: 'professionelle-zahnreinigung',
  name: 'Professionelle Zahnreinigung',
  spanne: { von: 137, bis: 208 } as Spanne,
  anteilStrecken: 83,
  hinweis:
    'Kommt in den meisten Behandlungen dazu, unabhängig davon, worum es sonst geht.',
};

export const PREISRAHMEN: Preisrahmen[] = [
  {
    leistung: 'zahnkrone',
    name: 'Einzelkrone',
    terzile: [
      { von: 1000, bis: 1850 },
      { von: 1850, bis: 2650 },
      { von: 2700, bis: 3700 },
    ],
    reife: 'zurueckgestellt',
  },
  {
    leistung: 'zahnkrone',
    name: 'Mehrere Kronen (2 bis 4)',
    einzelspanne: { von: 750, bis: 1550 },
    hinweis: 'typisch je Krone',
    reife: 'uebernommen',
  },
  {
    leistung: 'inlay',
    name: 'Teilkrone oder Inlay',
    terzile: [
      { von: 550, bis: 1350 },
      { von: 1400, bis: 2150 },
      { von: 2200, bis: 3200 },
    ],
    reife: 'uebernommen',
  },
  {
    leistung: 'zahnbruecke',
    name: 'Brücke',
    terzile: [
      { von: 900, bis: 2700 },
      { von: 2700, bis: 5250 },
      { von: 5300 },
    ],
    reife: 'zurueckgestellt',
  },
  {
    leistung: 'zahnimplantate',
    name: 'Implantatkrone',
    terzile: [
      { von: 950, bis: 1250 },
      { von: 1250, bis: 1600 },
      { von: 1600, bis: 2300 },
    ],
    reife: 'uebernommen',
  },
  {
    leistung: 'zahnimplantate',
    name: 'Implantat-Operation',
    einzelspanne: { von: 2300, bis: 4000 },
    hinweis: 'je Implantat',
    reife: 'uebernommen',
  },
  {
    leistung: 'knochenaufbau',
    name: 'Knochenaufbau',
    einzelspanne: { von: 700, bis: 1850 },
    hinweis: 'Implantat mit Knochenaufbau: 4.100 bis 5.700 €',
    streckeAufschlagProzent: 18,
    reife: 'uebernommen',
  },
  {
    leistung: 'zahnprothese',
    name: 'Prothese oder kombinierter Zahnersatz',
    terzile: [
      { von: 900, bis: 2750 },
      { von: 2750, bis: 3000 },
      { von: 3000 },
    ],
    hinweis: 'Bewährte Ausführung ab 900 €, Extra-Klasse ab 3.000 €',
    streckeAufschlagProzent: 20,
    reife: 'uebernommen',
  },
  {
    leistung: 'wurzelkanalbehandlung',
    name: 'Wurzelbehandlung',
    terzile: [
      { von: 500, bis: 900 },
      { von: 900, bis: 1400 },
      { von: 1500, bis: 2450 },
    ],
    reife: 'uebernommen',
  },
  {
    leistung: 'parodontitis-behandlung',
    name: 'Parodontitis-Therapie',
    terzile: [
      { von: 200, bis: 450 },
      { von: 480, bis: 750 },
      { von: 760, bis: 1250 },
    ],
    /* Der größte gemessene Aufschlag im Halbjahr überhaupt: aus 453 € Plan
       werden im Mittel 1.316 € Behandlungsstrecke. */
    streckeAufschlagProzent: 190,
    reife: 'zurueckgestellt',
  },
  {
    leistung: 'zahnfuellung',
    name: 'Füllung (Mehrkosten gegenüber der Kassenleistung)',
    terzile: [
      { von: 100, bis: 200 },
      { von: 200, bis: 300 },
      { von: 300, bis: 850 },
    ],
    streckeAufschlagProzent: 25,
    reife: 'uebernommen',
  },
  {
    leistung: 'knirscherschiene',
    name: 'Schiene oder Aufbissbehelf',
    terzile: [
      { von: 250, bis: 450 },
      { von: 460, bis: 650 },
      { von: 650, bis: 1250 },
    ],
    reife: 'uebernommen',
  },
  {
    leistung: 'cmd-behandlung',
    name: 'CMD- und Funktionsdiagnostik',
    einzelspanne: { von: 250, bis: 350 },
    hinweis: 'Funktions-Check. Umfassende Diagnostik 350 bis 1.600 €',
    streckeAufschlagProzent: 32,
    reife: 'uebernommen',
  },
  {
    leistung: 'weisheitszahn-entfernung',
    name: 'Oralchirurgie',
    terzile: [
      { von: 700, bis: 1000 },
      { von: 1050, bis: 1350 },
      { von: 1380, bis: 1700 },
    ],
    reife: 'zurueckgestellt',
  },
  {
    leistung: 'veneers',
    name: 'Veneers',
    einzelspanne: { von: 350 },
    hinweis: 'je Zahn, je nach Ausführung ab 700 €',
    reife: 'zu-duenn',
  },
];

/** Alle Rahmen zu einer Behandlung – eine Behandlung kann mehrere haben. */
export function rahmenFuer(leistungSlug: string): Preisrahmen[] {
  return PREISRAHMEN.filter((p) => p.leistung === leistungSlug);
}

export function spanneAlsText(s: Spanne): string {
  const zahl = (n: number) => n.toLocaleString('de-DE');
  return s.bis ? `${zahl(s.von)}–${zahl(s.bis)} €` : `ab ${zahl(s.von)} €`;
}

/**
 * Der Stand, auf den sich alle Zahlen beziehen. Gehört sichtbar auf die
 * Seite: Eine Preisangabe ohne Datum ist eine Behauptung ohne Haltbarkeit.
 */
export const PREISSTAND = {
  datenstand: '2026-07-16',
  beschluss: '2026-07-20',
  quelle: 'Interne Auswertung der angenommenen Heil- und Kostenpläne',
  grundgesamtheit: 24674,
  zeitraum: 'seit Januar 2024',
};
