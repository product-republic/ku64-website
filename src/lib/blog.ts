/**
 * Der Blog: Zugriff auf die übernommenen Beiträge.
 *
 * Die Daten liegen in `src/data/blog.json`, übernommen von
 * `analyse/altbestand/blog-holen.mjs`. Hier stehen nur die Fragen, die die
 * Seiten stellen – nach Jahr, nach Standort, nach Slug.
 *
 * ── Warum der Blog überhaupt wieder da ist ────────────────────────────────
 *
 * 56 Adressen des Altbestands liefen ins Leere, weil es die Inhalte nicht
 * mehr gab. Das war die ehrliche Zwischenlösung, nicht die richtige: Ein
 * Fachbeitrag über Kreidezähne, der seit Jahren in der Suche steht, ist
 * Substanz – man wirft ihn nicht weg, weil die Website neu gebaut wird.
 */
import beitraegeRoh from '../data/blog.json';

export interface Textblock {
  art: 'h2' | 'h3' | 'p' | 'liste';
  text?: string;
  punkte?: string[];
}

export interface Beitrag {
  slug: string;
  titel: string;
  /** ISO-Zeitstempel der Veröffentlichung, oder null. */
  datum: string | null;
  jahr: number | null;
  /** Standort-Slugs, automatisch aus dem Text erkannt. */
  standorte: string[];
  anriss: string;
  bloecke: Textblock[];
  bild: { pfad: string; breite: number; hoehe: number } | null;
  /** Adresse auf der alten Website – die Herkunft bleibt nachvollziehbar. */
  quelle: string;
}

export const BEITRAEGE = beitraegeRoh as Beitrag[];

export function beitrag(slug: string): Beitrag | undefined {
  return BEITRAEGE.find((b) => b.slug === slug);
}

/** Beiträge mit Bezug zu einem Standort. */
export function beitraegeAn(standortSlug: string): Beitrag[] {
  return BEITRAEGE.filter((b) => b.standorte.includes(standortSlug));
}

/**
 * Nach Jahren gruppiert, neuestes Jahr zuerst.
 *
 * Ein Blog ohne Jahresgliederung ist eine endlose Liste, in der ein Beitrag
 * von 2012 aussieht wie einer von gestern. Das Jahr ist bei fachlichen
 * Texten keine Nebensache: Es sagt, wie aktuell die Empfehlung ist.
 */
export function nachJahren(liste: Beitrag[] = BEITRAEGE): { jahr: number | null; beitraege: Beitrag[] }[] {
  const jahre = new Map<number | null, Beitrag[]>();
  for (const b of liste) {
    if (!jahre.has(b.jahr)) jahre.set(b.jahr, []);
    jahre.get(b.jahr)!.push(b);
  }
  return [...jahre.entries()]
    .map(([jahr, beitraege]) => ({ jahr, beitraege }))
    .sort((a, b) => (b.jahr ?? 0) - (a.jahr ?? 0));
}

/** Datum, wie es auf der Seite steht. */
export function datumLesbar(datum: string | null): string {
  if (!datum) return '';
  return new Date(datum).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}
