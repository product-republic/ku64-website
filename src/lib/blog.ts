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

/**
 * Lesedauer in Minuten.
 *
 * 200 Wörter je Minute – der übliche Wert für deutschen Fließtext, eher
 * vorsichtig gewählt. Die Zahl hat keinen Wert an sich; sie beantwortet die
 * Frage „fange ich das jetzt an oder später?“, und die will niemand mit
 * einer Nachkommastelle beantwortet bekommen. Deshalb aufgerundet und
 * mindestens eine Minute.
 */
export function lesedauer(b: Beitrag): number {
  const woerter = b.bloecke
    .map((x) => x.text ?? (x.punkte ?? []).join(' '))
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(woerter / 200));
}

/**
 * Gliederung aus den Überschriften des Beitrags.
 *
 * Nur h2 – eine Gliederung, die jede Zwischenüberschrift aufführt, ist
 * keine mehr. Beiträge mit weniger als drei Überschriften bekommen keine:
 * Bei zwei Sprungmarken ist Scrollen schneller als Zielen.
 */
/**
 * Die Sprungmarken eines Beitrags – je Überschrift genau eine, und keine
 * zweimal.
 *
 * Zwei Überschriften mit demselben Wortlaut ergeben denselben Anker. Das
 * kommt im übernommenen Bestand vor: „KU64 im Aeroflot Boardmagazine" steht
 * in einem Beitrag zweimal, einmal als Abschnitt und einmal als Unterpunkt.
 * Das Ergebnis war ein doppeltes `id` – und ein Sprungziel, das immer beim
 * ersten landet, auch wenn die Gliederung auf den zweiten zeigt.
 *
 * Deshalb wird hier durchgezählt: Der zweite bekommt eine `-2`. Die Zählung
 * muss an EINER Stelle passieren, sonst rechnen Gliederung und Überschrift
 * verschieden – genau dafür gibt es diese Funktion, und beide benutzen sie.
 */
export function ankerJeUeberschrift(b: Beitrag): Map<number, string> {
  const vergeben = new Map<string, number>();
  const karte = new Map<number, string>();

  b.bloecke.forEach((block, i) => {
    if (block.art !== 'h2' || !block.text) return;
    const basis = anker(block.text);
    const wievielt = (vergeben.get(basis) ?? 0) + 1;
    vergeben.set(basis, wievielt);
    karte.set(i, wievielt === 1 ? basis : `${basis}-${wievielt}`);
  });

  return karte;
}

export function gliederung(b: Beitrag): { titel: string; anker: string }[] {
  const marken = ankerJeUeberschrift(b);
  if (marken.size < 3) return [];
  return [...marken].map(([i, marke]) => ({ titel: b.bloecke[i].text!, anker: marke }));
}

/** Sprungmarke aus einer Überschrift – Umlaute ausgeschrieben. */
export function anker(titel: string): string {
  return titel
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
