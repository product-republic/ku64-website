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
import type { Sprache } from '../i18n/sprachen';

/*
 * Die Sprachfassungen des Korpus.
 *
 * Der deutsche Text ist die Quelle und liegt in `langtexte.json`. Die
 * Übersetzungen liegen daneben, mit denselben Schlüsseln – nicht als
 * Sprachebene INNERHALB der Datei.
 *
 * Der Grund ist die Größe: Der Korpus sind 114.894 Wörter je Sprache. In
 * einer Datei wären das 3,5 Megabyte, die jede Seite beim Bauen einliest,
 * auch die deutschen. Getrennt lädt Astro nur, was gebraucht wird.
 *
 * Der zweite Grund ist die Arbeitsteilung: Wer die deutsche Fassung
 * korrigiert, soll die Übersetzungen nicht anfassen müssen – und `git diff`
 * soll zeigen, welche Sprache sich geändert hat.
 *
 * Fehlt eine Fassung, gilt Deutsch. Das ist eine bewusste Entscheidung und
 * keine Nachlässigkeit: Ein leerer Abschnitt wäre schlechter als ein
 * deutscher, den man wenigstens durch einen Übersetzer schicken kann. Damit
 * die Seite darüber nicht schwindelt, trägt der Block in diesem Fall
 * `lang="de"` – siehe `Langtext.astro`.
 */
import * as en from '../inhalte/langtexte-en.json';
import * as fr from '../inhalte/langtexte-fr.json';

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

/**
 * Ein Thema unter `/ueber-uns/`.
 *
 * Eigener Bereich und kein `neu`: Die zusammengefalteten Behandlungsthemen
 * sind Behandlungen und liegen unter `/leistungen/`. Diese hier sind die zehn
 * Belegseiten der Praxis – Auszeichnungen, Presse, Mitgliedschaften,
 * Kooperationen, Engagement, Architektur. Sie in denselben Topf zu werfen
 * hätte geheißen, dass eine Zählung „Themen" beides meint und keine Aussage
 * mehr trifft.
 */
export interface UeberThema extends Langtext {
  slug: string;
}

type Bestandsdatei = {
  leistungen?: Record<string, Langtext>;
  unterthemen?: Record<string, Unterthema>;
  kategorien?: Record<string, Langtext>;
  neu?: Record<string, NeuesThema>;
  themen?: Record<string, UeberThema>;
};

const DEUTSCH = daten as unknown as Bestandsdatei;

/*
 * Die Übersetzungen als Nachschlagewerk, nach Bereich und Schlüssel.
 *
 * `import * as` liefert bei JSON ein Modulobjekt mit `default`; welche Form
 * es hat, hängt an der Bündelung. Deshalb hier einmal auflösen und danach
 * überall dieselbe Struktur.
 */
const auspacken = (m: unknown): Bestandsdatei => {
  const o = m as { default?: Bestandsdatei } & Bestandsdatei;
  return o.default ?? o;
};

const FASSUNGEN: Record<string, Bestandsdatei> = {
  de: DEUTSCH,
  en: auspacken(en),
  fr: auspacken(fr),
};

const LEISTUNGEN = DEUTSCH.leistungen ?? {};
const UNTERTHEMEN = DEUTSCH.unterthemen ?? {};
const NEUE = DEUTSCH.neu ?? {};
const KATEGORIEN = DEUTSCH.kategorien ?? {};
const THEMEN = DEUTSCH.themen ?? {};

/**
 * Ein Eintrag in der gewünschten Sprache – oder auf Deutsch.
 *
 * Zusammengesetzt und nicht ersetzt: `herkunft` und `woerter` beziehen sich
 * auf den deutschen Ursprung und bleiben die des Originals. Eine Übersetzung
 * hat keine eigene Herkunft; sie hat dieselbe.
 */
function inSprache<T extends Langtext>(
  bereich: keyof Bestandsdatei,
  schluessel: string,
  deutsch: T | undefined,
  sprache: Sprache,
): (T & { uebersetzt: boolean }) | undefined {
  if (!deutsch) return undefined;
  if (sprache === 'de') return { ...deutsch, uebersetzt: true };

  const fassung = FASSUNGEN[sprache]?.[bereich] as Record<string, Langtext> | undefined;
  const u = fassung?.[schluessel];

  /*
   * Eine Übersetzung gilt nur, wenn sie strukturell zum Original passt.
   *
   * Fehlt ein Abschnitt, ist ein Stück Text weg – und zwar unsichtbar, weil
   * die Seite trotzdem baut. Bei einer Abweichung wird deshalb die deutsche
   * Fassung gesetzt und `uebersetzt: false` gemeldet; `Langtext.astro`
   * schreibt dann `lang="de"` an den Block, und `inhalt-pruefen.mjs` sieht
   * die Lücke.
   */
  if (!u || u.abschnitte?.length !== deutsch.abschnitte.length) {
    return { ...deutsch, uebersetzt: false };
  }
  const gleich = deutsch.abschnitte.every(
    (a, i) => u.abschnitte[i]?.bloecke?.length === a.bloecke.length,
  );
  if (!gleich) return { ...deutsch, uebersetzt: false };

  return {
    ...deutsch,
    titel: u.titel ?? deutsch.titel,
    abschnitte: u.abschnitte,
    uebersetzt: true,
  };
}

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
export function langtext(leistungSlug: string, sprache: Sprache = 'de'): Langtext | undefined {
  const l = LEISTUNGEN[leistungSlug];
  if (!brauchbar(l)) return undefined;
  return inSprache('leistungen', leistungSlug, l, sprache);
}

/**
 * Die Unterthemen einer Behandlung, absteigend nach Umfang.
 *
 * Absteigend, weil die Reihenfolge im Neubau eine Aussage trifft: Oben steht,
 * was am ausführlichsten behandelt ist. Die alphabetische Reihenfolge wäre
 * eine Aussage über das Alphabet.
 */
export function unterthemen(leistungSlug: string, sprache: Sprache = 'de'): Unterthema[] {
  return Object.values(UNTERTHEMEN)
    .filter((u) => u.leistung === leistungSlug && brauchbar(u))
    .sort((a, z) => z.woerter - a.woerter)
    .map((u) => inSprache('unterthemen', `${u.leistung}/${u.slug}`, u, sprache)!)
    .filter(Boolean);
}

/** Ein einzelnes Unterthema. */
export function unterthema(
  leistungSlug: string,
  slug: string,
  sprache: Sprache = 'de',
): Unterthema | undefined {
  const k = `${leistungSlug}/${slug}`;
  const u = UNTERTHEMEN[k];
  if (!brauchbar(u)) return undefined;
  return inSprache('unterthemen', k, u, sprache);
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
export function kategorietext(kategorieSlug: string, sprache: Sprache = 'de'): Langtext | undefined {
  const k = KATEGORIEN[kategorieSlug];
  if (!brauchbar(k)) return undefined;
  return inSprache('kategorien', kategorieSlug, k, sprache);
}

/** Alle Kategorien mit Übersichtstext – für Prüfung und Bericht. */
export function kategorietexte(): { kategorie: string; text: Langtext }[] {
  return Object.entries(KATEGORIEN)
    .filter(([, t]) => brauchbar(t))
    .map(([kategorie, text]) => ({ kategorie, text }));
}

/**
 * Der Text einer Über-uns-Seite – oder `undefined`.
 *
 * `undefined` ist ein gültiger Fall: Die Galerie hat keinen Langtext, ihr
 * Inhalt sind die Bilder. Siehe `ohneLangtext` in `src/data/themen.ts`.
 */
export function ueberThema(slug: string, sprache: Sprache = 'de'): UeberThema | undefined {
  const t = THEMEN[slug];
  if (!brauchbar(t)) return undefined;
  return inSprache('themen', slug, t, sprache);
}

/** Alle Über-uns-Themen mit Text – für Prüfung und Bericht. */
export function ueberThemen(): UeberThema[] {
  return Object.values(THEMEN).filter(brauchbar);
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
  themen: number;
  gesamt: number;
} {
  const summe = (xs: Langtext[]) => xs.reduce((s, x) => s + x.woerter, 0);
  const h = summe(Object.values(LEISTUNGEN).filter(brauchbar));
  const u = summe(Object.values(UNTERTHEMEN).filter(brauchbar));
  const k = summe(Object.values(KATEGORIEN).filter(brauchbar));
  const n = summe(Object.values(NEUE).filter(brauchbar));
  const t = summe(Object.values(THEMEN).filter(brauchbar));
  return { hauptseiten: h, unterthemen: u, kategorien: k, neu: n, themen: t, gesamt: h + u + k + n + t };
}

/**
 * Eine kurze Zusammenfassung für Teaser und Meta-Description.
 *
 * Der erste Absatz des ersten Abschnitts, auf Satzgrenze gekürzt. Kein
 * erfundener Teaser: Was in der Beschreibung steht, steht auch auf der Seite.
 */
/**
 * Wie viel des Korpus in einer Sprache vorliegt – für `inhalt-pruefen.mjs`
 * und den Bericht. Eine Zahl, die man nachrechnen kann.
 */
export function abdeckung(sprache: Sprache): { themen: number; uebersetzt: number; woerter: number; woerterUebersetzt: number } {
  const bereiche: [keyof Bestandsdatei, Record<string, Langtext>][] = [
    ['leistungen', LEISTUNGEN],
    ['unterthemen', UNTERTHEMEN as Record<string, Langtext>],
    ['kategorien', KATEGORIEN],
    ['neu', NEUE as Record<string, Langtext>],
    ['themen', THEMEN as Record<string, Langtext>],
  ];
  let themen = 0;
  let uebersetzt = 0;
  let woerter = 0;
  let woerterUebersetzt = 0;
  for (const [bereich, karte] of bereiche) {
    for (const [schluessel, l] of Object.entries(karte)) {
      if (!brauchbar(l)) continue;
      themen++;
      woerter += l.woerter;
      const x = inSprache(bereich, schluessel, l, sprache);
      if (x?.uebersetzt) {
        uebersetzt++;
        woerterUebersetzt += l.woerter;
      }
    }
  }
  return { themen, uebersetzt, woerter, woerterUebersetzt };
}

export function anriss(l: Langtext, zeichen = 155): string {
  const ersterAbsatz = l.abschnitte.flatMap((a) => a.bloecke).find((b) => b.art === 'p');
  if (!ersterAbsatz) return '';
  const text = ersterAbsatz.text.trim();
  if (text.length <= zeichen) return text;
  const gekuerzt = text.slice(0, zeichen);
  const punkt = Math.max(gekuerzt.lastIndexOf('. '), gekuerzt.lastIndexOf('! '));
  return punkt > 60 ? gekuerzt.slice(0, punkt + 1) : `${gekuerzt.replace(/\s+\S*$/, '')} …`;
}
