/**
 * Zugriff auf die wiederhergestellten Originaltexte.
 *
 * ── Woher sie kommen ────────────────────────────────────────────────────
 *
 * `src/inhalte/langtexte.json` ist erzeugt: `analyse/altbestand/texte-holen.mjs`
 * holt den Text von ku64.de, `texte-bereinigen.mjs` nimmt Vorlagenreste
 * heraus, `scripts/langtexte-bauen.mjs` ordnet ihn den neuen Seiten zu.
 *
 * ── Warum eine eigene Schicht davor ─────────────────────────────────────
 *
 * Die JSON-Datei ist Maschinenwerk und kann sich ändern, sobald jemand die
 * Zuordnung verbessert. Seiten sollen davon nichts merken. Sie fragen hier
 * „gibt es einen Langtext zu diesem Slug" und bekommen eine geprüfte Form
 * oder `undefined` – nie eine halb gefüllte Struktur.
 *
 * ── Warum der Text nicht als HTML durchgereicht wird ────────────────────
 *
 * Er kommt von einer fremden WordPress-Installation. Wer deren Auszeichnung
 * übernimmt, übernimmt deren Klassen, deren Verschachtelung und im
 * schlechtesten Fall deren Skripte. Gespeichert sind deshalb nur Art und
 * Text je Block; die Auszeichnung entsteht neu in `Langtext.astro`.
 *
 * Das hat einen zweiten Nutzen: Ein Absatz ist hier wirklich ein Absatz und
 * kann gezählt, geprüft und übersetzt werden.
 */

import daten from '../inhalte/langtexte.json';

export type BlockArt = 'p' | 'li' | 'zeile';

export interface Block {
  art: BlockArt;
  text: string;
}

export interface Abschnitt {
  /** `null` beim Einleitungsabschnitt vor der ersten Zwischenzeile. */
  ueberschrift: string | null;
  /** Welche Ebene die Überschrift auf der alten Seite hatte. */
  stufe: 'h2' | 'h3' | 'h4' | null;
  bloecke: Block[];
}

export interface Langtext {
  /** Die Überschrift der alten Seite – als Beleg, nicht zur Anzeige. */
  titel: string | null;
  /** Die Adresse, von der der Text stammt. Steht als Quellenangabe dabei. */
  herkunft: string;
  woerter: number;
  abschnitte: Abschnitt[];
}

export interface Unterthema extends Langtext {
  /** Slug der Behandlung, zu der es gehört. */
  leistung: string;
  slug: string;
}

export interface NeuesThema extends Langtext {
  slug: string;
  /** War vorher ein Anker auf der Übersicht – oder null. */
  ankerVorher: string | null;
}

const LEISTUNGEN = daten.leistungen as unknown as Record<string, Langtext>;
const UNTERTHEMEN = daten.unterthemen as unknown as Record<string, Unterthema>;
const NEUE = daten.neu as unknown as Record<string, NeuesThema>;
const KATEGORIEN = (daten as { kategorien?: Record<string, Langtext> }).kategorien ?? {};

/**
 * Ein Langtext ist nur brauchbar, wenn er wirklich Text enthält.
 *
 * Ein Eintrag mit null Abschnitten wäre eine Überschrift „Ausführlich" über
 * einer leeren Fläche – schlechter als kein Langtext, weil die Seite dann
 * kaputt aussieht statt kurz.
 */
function brauchbar(l: Langtext | undefined): l is Langtext {
  return Boolean(l && l.abschnitte.length > 0 && l.abschnitte.some((a) => a.bloecke.length > 0));
}

/** Der Langtext einer Behandlung – oder `undefined`. */
export function langtext(leistungSlug: string): Langtext | undefined {
  const l = LEISTUNGEN[leistungSlug];
  return brauchbar(l) ? l : undefined;
}

/**
 * Die Unterthemen einer Behandlung, absteigend nach Umfang.
 *
 * Absteigend, weil die Reihenfolge im Neubau eine Aussage trifft: Oben steht,
 * was am ausführlichsten behandelt ist. Die alphabetische Reihenfolge wäre
 * eine Aussage über das Alphabet.
 */
export function unterthemen(leistungSlug: string): Unterthema[] {
  return Object.values(UNTERTHEMEN)
    .filter((u) => u.leistung === leistungSlug && brauchbar(u))
    .sort((a, z) => z.woerter - a.woerter);
}

/** Ein einzelnes Unterthema. */
export function unterthema(leistungSlug: string, slug: string): Unterthema | undefined {
  const u = UNTERTHEMEN[`${leistungSlug}/${slug}`];
  return brauchbar(u) ? u : undefined;
}

/** Alle Unterthemen – für `getStaticPaths`. */
export function alleUnterthemen(): Unterthema[] {
  return Object.values(UNTERTHEMEN).filter(brauchbar);
}

/** Die zusammengefalteten Themen, die eine eigene Seite zurückbekommen. */
export function neueThemen(): NeuesThema[] {
  return Object.values(NEUE)
    .filter(brauchbar)
    .sort((a, z) => z.woerter - a.woerter);
}

/**
 * Der Übersichtstext einer Kategorie.
 *
 * Fünf der alten Seiten waren keine Behandlungen, sondern Übersichten über
 * eine ganze Kategorie: „Zahnersatz in Berlin", „Ihr Kieferorthopäde in
 * Berlin", „Ästhetische Zahnmedizin", „Oralchirurgie", „Ästhetische Medizin".
 * Zusammen 7.901 Wörter, im ersten Neubau auf Anker der Übersicht gefaltet.
 *
 * Sie gehören auf die Kategorieübersicht und nicht auf eine erfundene
 * Behandlungsseite – eine Seite „Zahnersatz" neben Kronen, Brücken und
 * Prothesen wäre eine sechste Behandlung, die es nicht gibt.
 */
export function kategorietext(kategorieSlug: string): Langtext | undefined {
  const k = KATEGORIEN[kategorieSlug];
  return brauchbar(k) ? k : undefined;
}

/** Alle Kategorien mit Übersichtstext – für Prüfung und Bericht. */
export function kategorietexte(): { kategorie: string; text: Langtext }[] {
  return Object.entries(KATEGORIEN)
    .filter(([, t]) => brauchbar(t))
    .map(([kategorie, text]) => ({ kategorie, text }));
}

export function neuesThema(slug: string): NeuesThema | undefined {
  const n = NEUE[slug];
  return brauchbar(n) ? n : undefined;
}

/**
 * Wie viele Wörter insgesamt wiederhergestellt sind.
 *
 * Steht im Bericht und in `inhalt-pruefen.mjs`. Eine Zahl, die man nachrechnen
 * kann, statt einer Behauptung.
 */
export function bestand(): {
  hauptseiten: number;
  unterthemen: number;
  kategorien: number;
  neu: number;
  gesamt: number;
} {
  const summe = (xs: Langtext[]) => xs.reduce((s, x) => s + x.woerter, 0);
  const h = summe(Object.values(LEISTUNGEN).filter(brauchbar));
  const u = summe(Object.values(UNTERTHEMEN).filter(brauchbar));
  const k = summe(Object.values(KATEGORIEN).filter(brauchbar));
  const n = summe(Object.values(NEUE).filter(brauchbar));
  return { hauptseiten: h, unterthemen: u, kategorien: k, neu: n, gesamt: h + u + k + n };
}

/**
 * Eine kurze Zusammenfassung für Teaser und Meta-Description.
 *
 * Der erste Absatz des ersten Abschnitts, auf Satzgrenze gekürzt. Kein
 * erfundener Teaser: Was in der Beschreibung steht, steht auch auf der Seite.
 */
export function anriss(l: Langtext, zeichen = 155): string {
  const ersterAbsatz = l.abschnitte.flatMap((a) => a.bloecke).find((b) => b.art === 'p');
  if (!ersterAbsatz) return '';
  const text = ersterAbsatz.text.trim();
  if (text.length <= zeichen) return text;
  const gekuerzt = text.slice(0, zeichen);
  const punkt = Math.max(gekuerzt.lastIndexOf('. '), gekuerzt.lastIndexOf('! '));
  return punkt > 60 ? gekuerzt.slice(0, punkt + 1) : `${gekuerzt.replace(/\s+\S*$/, '')} …`;
}
