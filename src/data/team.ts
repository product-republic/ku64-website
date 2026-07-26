/**
 * Team je Standort.
 *
 * ⚠️ BEWUSST LEER. Namen, Qualifikationen und Fotos von Behandelnden sind
 * Tatsachenbehauptungen über reale Personen – erfundene Einträge wären hier
 * nicht nur wertlos, sondern schädlich. ku64.de war in dieser Session nicht
 * abrufbar (siehe ANALYSE.md), deshalb liegen keine gesicherten Daten vor.
 *
 * Sobald die Angaben vorliegen, hier eintragen – die Teamseiten rendern sie
 * dann automatisch, inklusive Schema.org-Auszeichnung als `Physician`.
 * Erforderlich je Person: Name, Funktion, Standorte, optional Schwerpunkte,
 * Sprachen und Foto.
 *
 * Rechtlicher Hinweis für die Befüllung: Fotos und Namen brauchen die
 * Einwilligung der abgebildeten Personen (Art. 6 Abs. 1 lit. a DSGVO,
 * § 22 KunstUrhG). Titel wie „Spezialist für …“ sind nur zulässig, wenn die
 * zugrunde liegende Qualifikation tatsächlich vorliegt und benannt werden darf.
 */

export interface TeamMitglied {
  slug: string;
  name: string;
  /** z. B. "Zahnärztin", "Fachzahnarzt für Oralchirurgie", "Prophylaxeassistentin" */
  funktion: string;
  /** Standort-Slugs, an denen die Person behandelt. */
  standorte: string[];
  /** Leistungs-Slugs als Schwerpunkte – erzeugt automatisch Querverlinkung. */
  schwerpunkte?: string[];
  sprachen?: string[];
  /** Pfad zum Foto unter /public, z. B. "/team/vorname-nachname.jpg" */
  foto?: string;
  vorstellung?: string;
}

export const TEAM: TeamMitglied[] = [];

export function teamFuerStandort(standortSlug: string): TeamMitglied[] {
  return TEAM.filter((m) => m.standorte.includes(standortSlug));
}
