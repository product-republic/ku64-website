/**
 * Sprachregister – die einzige Stelle, an der steht, welche Sprachen es gibt.
 *
 * Grundregel: Deutsch ist die Quellsprache und liegt ohne Präfix unter der
 * Wurzel. Das ist keine Bequemlichkeit, sondern eine Entscheidung gegen
 * Weiterleitungen: Der Altbestand hat Deutsch unter `/` und Englisch unter
 * `/en/`. Behalten wir das bei, muss zum Relaunch keine einzige deutsche URL
 * umgeleitet werden – und die englischen bleiben ebenfalls stehen.
 *
 * Eine Sprache aufnehmen heißt: hier einen Eintrag ergänzen. Alles andere –
 * Routen, hreflang, Sitemap, Sprachwähler, Prüfskripte – liest aus diesem
 * Register. Der Übersetzungswächter meldet danach jeden Schlüssel, der in der
 * neuen Sprache fehlt, und der Build bleibt so lange rot, bis er gefüllt ist.
 */

export type Sprache = 'de' | 'en' | 'fr';

export interface Sprachdefinition {
  code: Sprache;
  /** BCP-47 für `<html lang>`, `hreflang` und die Sitemap. */
  bcp47: string;
  /** Open-Graph-Schreibweise – Unterstrich statt Bindestrich. */
  ogLocale: string;
  /** Eigenbezeichnung. Steht immer in der eigenen Sprache, nie übersetzt. */
  eigenname: string;
  /** Wie die Sprache im Sprachwähler für Menschen benannt wird. */
  aria: string;
  /**
   * URL-Präfix ohne Schrägstriche. Leer für die Quellsprache.
   * Bei den Routen wird daraus der `[...sprache]`-Parameter: leer = `undefined`.
   */
  praefix: string;
  /**
   * Freigegeben heißt: vollständig übersetzt UND redaktionell geprüft.
   *
   * Nur freigegebene Sprachen werden indexiert, in hreflang angeboten und im
   * Sprachwähler gezeigt. Nicht freigegebene Sprachen werden trotzdem gebaut –
   * sonst ließe sich die Übersetzung nie im Kontext gegenlesen –, tragen aber
   * `noindex` und einen sichtbaren Hinweis.
   *
   * Der Sprachwächter behandelt beide Fälle unterschiedlich streng:
   * bei `freigegeben: true` bricht eine Lücke den Build ab,
   * bei `false` erscheint sie als Rückstandsliste.
   */
  freigegeben: boolean;
}

export const SPRACHEN: Sprachdefinition[] = [
  {
    code: 'de',
    bcp47: 'de-DE',
    ogLocale: 'de_DE',
    eigenname: 'Deutsch',
    aria: 'Sprache wechseln – Deutsch',
    praefix: '',
    freigegeben: true,
  },
  {
    code: 'en',
    bcp47: 'en-GB',
    ogLocale: 'en_GB',
    eigenname: 'English',
    aria: 'Change language – English',
    praefix: 'en',
    freigegeben: false,
  },
  {
    code: 'fr',
    bcp47: 'fr-FR',
    ogLocale: 'fr_FR',
    eigenname: 'Français',
    aria: 'Changer de langue – Français',
    praefix: 'fr',
    freigegeben: false,
  },
];

export const QUELLSPRACHE: Sprache = 'de';

export const SPRACH_CODES: Sprache[] = SPRACHEN.map((s) => s.code);

/** Sprachen außer der Quellsprache – das sind die zu übersetzenden. */
export const ZIELSPRACHEN: Sprache[] = SPRACH_CODES.filter((c) => c !== QUELLSPRACHE);

export function sprachdefinition(code: Sprache): Sprachdefinition {
  const gefunden = SPRACHEN.find((s) => s.code === code);
  if (!gefunden) throw new Error(`Unbekannte Sprache: ${code}`);
  return gefunden;
}

export function istSprache(wert: string | undefined): wert is Sprache {
  return typeof wert === 'string' && SPRACH_CODES.includes(wert as Sprache);
}

/**
 * Ein Wert je Sprache. Der Kern der Paritätsregel: Wer diesen Typ verwendet,
 * kann keine Sprache weglassen, ohne dass `astro check` fehlschlägt. Deshalb
 * ist es bewusst `Record` und kein `Partial`.
 */
export type Mehrsprachig<T> = Record<Sprache, T>;

// ────────────────────────────── Pfade ──────────────────────────────

/**
 * Wert für den `[...sprache]`-Routenparameter.
 *
 * Astro erlaubt bei Rest-Parametern `undefined` und lässt das Segment dann
 * ganz weg – genau so entsteht `/potsdam/` neben `/en/potsdam/`, ohne dass es
 * zwei Routendateien braucht.
 */
export function sprachparameter(code: Sprache): string | undefined {
  const praefix = sprachdefinition(code).praefix;
  return praefix === '' ? undefined : praefix;
}

/** Alle Sprachen als Routenparameter – Grundlage jedes `getStaticPaths`. */
export function sprachpfade(): { sprache: string | undefined }[] {
  return SPRACH_CODES.map((code) => ({ sprache: sprachparameter(code) }));
}

/** Aus dem Routenparameter zurück auf die Sprache. Fehlt er, ist es Deutsch. */
export function spracheAusParameter(parameter: string | undefined): Sprache {
  if (!parameter) return QUELLSPRACHE;
  const treffer = SPRACHEN.find((s) => s.praefix === parameter.replace(/\//g, ''));
  if (!treffer) throw new Error(`Unbekanntes Sprachpräfix in der Route: ${parameter}`);
  return treffer.code;
}

/**
 * Einen sprachneutralen Pfad in eine Sprache übersetzen.
 *
 * Der übergebene Pfad ist immer der deutsche (also präfixlose) Pfad – so
 * bleibt in den Seiten genau ein Pfadbegriff im Umlauf und es kann nicht
 * passieren, dass ein bereits präfigierter Pfad ein zweites Präfix bekommt.
 */
export function pfadInSprache(pfad: string, code: Sprache): string {
  const roh = pfad.startsWith('/') ? pfad : `/${pfad}`;
  const ohneSprache = pfadOhneSprache(roh);
  const praefix = sprachdefinition(code).praefix;
  if (praefix === '') return ohneSprache;
  return ohneSprache === '/' ? `/${praefix}/` : `/${praefix}${ohneSprache}`;
}

/** Ein etwaiges Sprachpräfix entfernen. Idempotent. */
export function pfadOhneSprache(pfad: string): string {
  const teile = pfad.split('/').filter(Boolean);
  if (teile.length > 0) {
    const treffer = SPRACHEN.find((s) => s.praefix !== '' && s.praefix === teile[0]);
    if (treffer) teile.shift();
  }
  return teile.length === 0 ? '/' : `/${teile.join('/')}/`;
}

/**
 * Alle Sprachfassungen eines Pfades – für hreflang und den Sprachwähler.
 *
 * Nicht freigegebene Sprachen bleiben draußen. Eine halbfertige Übersetzung in
 * hreflang anzubieten wäre schlechter als sie nicht anzubieten: Google würde
 * sie ausspielen, und die Patientin landete auf einer Seite, die ihre Frage
 * nur halb beantwortet.
 */
export function sprachfassungen(pfad: string): { sprache: Sprachdefinition; pfad: string }[] {
  return SPRACHEN.filter((s) => s.freigegeben).map((sprache) => ({
    sprache,
    pfad: pfadInSprache(pfad, sprache.code),
  }));
}
