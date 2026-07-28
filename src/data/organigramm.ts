/**
 * Die Struktur der Praxis – Rollen und Zuordnungen.
 *
 * ── Wozu es diese Datei gibt ──────────────────────────────────────────────
 *
 * `team.ts` weiß, WER da ist und in welchem Fachbereich an welchem Standort.
 * Das reicht für eine Übersicht, aber nicht für ein Organigramm: Es fehlt,
 * wer einen Bereich führt und wer wem zugeordnet ist.
 *
 * Zwei Zielgruppen sehen dieselbe Darstellung mit verschiedenen Augen:
 *
 *   Patientinnen und Patienten fragen „wer macht das hier, und wo?" – dafür
 *   genügen Standort, Fachbereich und Person. Diese Ebene ist vollständig
 *   und funktioniert schon heute.
 *
 *   Bewerberinnen und Bewerber fragen „wer wäre meine Leitung, wer bildet
 *   aus, wie groß ist das Team über mir?" – dafür braucht es die Linien.
 *   Genau die stehen hier.
 *
 * ── Warum `bestaetigt` ──────────────────────────────────────────────────
 *
 * Die Einträge unten sind aus den Funktionsbezeichnungen in team.ts
 * abgeleitet, nicht aus der Praxis bestätigt. „Leiter der Oralchirurgie"
 * steht wörtlich in Dr. Herrmanns Funktion – dass er deshalb die
 * Oralchirurgie am Kurfürstendamm führt, ist ein naheliegender Schluss,
 * aber eben ein Schluss.
 *
 * Ein Organigramm, das falsche Linien zieht, ist schlimmer als keins: Es
 * behauptet eine Ordnung, die es nicht gibt, und jede Person darin sieht
 * sofort, dass es nicht stimmt. Deshalb steht an jedem abgeleiteten Eintrag
 * `bestaetigt: false`, und die Darstellung zeigt unbestätigte Linien
 * zurückhaltender als bestätigte.
 *
 * Bestätigen heißt: das Flag auf `true` setzen. Nicht mehr.
 *
 * ── Was noch fehlt ──────────────────────────────────────────────────────
 *
 *   · Berlin-Mitte: keine einzige Leitungsrolle hinterlegt
 *   · Wilmersdorf: dort ist bislang überhaupt kein Team erfasst
 *   · `berichtetAn` ist nur dort gesetzt, wo es sich aus der Bezeichnung
 *     ergibt („Stellvertretende Leitung" berichtet an die Leitung)
 */

import { TEAM, veroeffentlichbar } from './team';

export type Ebene = 'geschaeftsfuehrung' | 'standortleitung' | 'bereichsleitung' | 'sonderrolle';

export interface Rolle {
  /** Slug aus team.ts. */
  person: string;
  /** Wie die Rolle im Organigramm benannt wird – kurz, nicht die volle Funktion. */
  rolle: string;
  ebene: Ebene;
  /** Standort, für den die Rolle gilt. Leer = standortübergreifend. */
  standort?: string;
  /** Fachbereich aus team.ts, falls die Rolle einen führt. */
  bereich?: string;
  /** Slug der übergeordneten Person – daraus entstehen die Linien. */
  berichtetAn?: string;
  /**
   * Von der Praxis bestätigt?
   *
   * `false` heißt: aus der Funktionsbezeichnung abgeleitet. Die Darstellung
   * zeichnet solche Linien gestrichelt und blendet sie in der
   * Patientenansicht aus.
   */
  bestaetigt: boolean;
}

export const ROLLEN: Rolle[] = [
  /* ── Geschäftsführung ─────────────────────────────────────────────── */
  {
    person: 'dr-stephan-ziegler',
    rolle: 'Geschäftsführender Gründungspartner',
    ebene: 'geschaeftsfuehrung',
    bestaetigt: false,
  },
  { person: 'juliane-kottenhagen', rolle: 'Praxispartnerin', ebene: 'geschaeftsfuehrung', bestaetigt: false },
  { person: 'tsong-ung-an', rolle: 'Praxispartner', ebene: 'geschaeftsfuehrung', bestaetigt: false },

  /* ── Standortleitung ──────────────────────────────────────────────── */
  {
    person: 'nils-radsack',
    rolle: 'Medizinische Leitung',
    ebene: 'standortleitung',
    standort: 'potsdam',
    berichtetAn: 'dr-stephan-ziegler',
    bestaetigt: false,
  },
  {
    person: 'karoline-hansen',
    rolle: 'Praxis- und HR-Management',
    ebene: 'standortleitung',
    standort: 'potsdam',
    bestaetigt: false,
  },
  // OFFEN: Berlin-Mitte – wer leitet den Standort?
  // OFFEN: Wilmersdorf – dort ist noch kein Team erfasst.

  /* ── Bereichsleitung Kurfürstendamm ───────────────────────────────── */
  {
    person: 'dr-surian-herrmann',
    rolle: 'Leitung Oralchirurgie',
    ebene: 'bereichsleitung',
    standort: 'berlin-charlottenburg',
    bereich: 'zahnaerzte',
    berichtetAn: 'dr-stephan-ziegler',
    bestaetigt: false,
  },
  {
    person: 'lulu-buerger',
    rolle: 'Leitung ZFA & Ausbildungsbeauftragte',
    ebene: 'bereichsleitung',
    standort: 'berlin-charlottenburg',
    bereich: 'assistenz',
    bestaetigt: false,
  },
  {
    person: 'adrianna-targatz',
    rolle: 'Stellvertretende Leitung ZFA & Azubis',
    ebene: 'bereichsleitung',
    standort: 'berlin-charlottenburg',
    bereich: 'assistenz',
    berichtetAn: 'lulu-buerger',
    bestaetigt: false,
  },
  {
    person: 'ina-lehmann',
    rolle: 'Leitung Rezeption, Telefon & Patientenservice',
    ebene: 'bereichsleitung',
    standort: 'berlin-charlottenburg',
    bereich: 'verwaltung',
    berichtetAn: 'dr-stephan-ziegler',
    bestaetigt: false,
  },
  {
    person: 'sabine-kuehnau-falkenau',
    rolle: 'Leitung Materialeinkauf & -verwaltung',
    ebene: 'bereichsleitung',
    standort: 'berlin-charlottenburg',
    bereich: 'verwaltung',
    bestaetigt: false,
  },
  {
    person: 'ricco-molkentin',
    rolle: 'Leitung Prophylaxeshop & Prophylaxekoordination',
    ebene: 'bereichsleitung',
    standort: 'berlin-charlottenburg',
    bereich: 'prophylaxe',
    bestaetigt: false,
  },

  /* ── Sonderrollen ─────────────────────────────────────────────────── */
  {
    person: 'delphine-martineau-rewig',
    rolle: 'People Operations',
    ebene: 'sonderrolle',
    standort: 'berlin-charlottenburg',
    bestaetigt: false,
  },
  {
    person: 'lisbany-martinez-cubillas',
    rolle: 'OP-Management',
    ebene: 'sonderrolle',
    standort: 'berlin-charlottenburg',
    bestaetigt: false,
  },
  {
    person: 'viktoria-genkel',
    rolle: 'Koordination Digital Smile Design',
    ebene: 'sonderrolle',
    standort: 'berlin-charlottenburg',
    bestaetigt: false,
  },
  {
    person: 'malou-fricke',
    rolle: 'Präventionsmanagement',
    ebene: 'sonderrolle',
    standort: 'berlin-charlottenburg',
    bestaetigt: false,
  },
];

/** Rolle einer Person, falls sie eine hat. */
export function rolleVon(slug: string): Rolle | undefined {
  return ROLLEN.find((r) => r.person === slug);
}

/** Alle Rollen eines Standorts, Geschäftsführung eingeschlossen. */
export function rollenAn(standortSlug: string): Rolle[] {
  return ROLLEN.filter((r) => !r.standort || r.standort === standortSlug);
}

/** Wer dieser Person zugeordnet ist – für die Linien nach unten. */
export function unterstellte(slug: string): Rolle[] {
  return ROLLEN.filter((r) => r.berichtetAn === slug);
}

/**
 * Rollen, die auf Personen zeigen, die es nicht (mehr) gibt.
 *
 * Der Fall tritt ein, sobald jemand die Praxis verlässt – so wie beim
 * Floormanager, dessen Eintrag mit ihm entfiel. Bliebe die Rolle stehen,
 * zeigte das Organigramm eine Leitung, die niemand innehat. Der Datenwächter
 * meldet das beim Bau, statt es stillschweigend wegzulassen.
 */
export function verwaisteRollen(): Rolle[] {
  const vorhanden = new Set(TEAM.filter(veroeffentlichbar).map((p) => p.slug));
  return ROLLEN.filter((r) => !vorhanden.has(r.person));
}
