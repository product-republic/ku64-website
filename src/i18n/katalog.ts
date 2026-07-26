/**
 * Der Übersetzungskatalog und der Zugriff darauf.
 *
 * Deutsch ist Quellsprache und steht in den Datendateien. Jede andere Sprache
 * liegt als Katalog in src/inhalte/<code>.json – ein Eintrag je Schlüssel, mit
 * dem Fingerabdruck des deutschen Textes, aus dem er entstanden ist.
 *
 * Dieser Fingerabdruck ist der eigentliche Trick. Ohne ihn wäre eine
 * Übersetzung, deren deutsches Original später geändert wurde, nicht von einer
 * aktuellen zu unterscheiden – die englische Seite zeigte weiter den alten
 * Preis, während die deutsche längst den neuen nennt. Mit ihm gilt eine
 * Übersetzung als veraltet, sobald sich am Deutschen ein Zeichen ändert, und
 * der Wächter meldet sie zur Nachübersetzung.
 */

import enKatalog from '../inhalte/en.json';
import frKatalog from '../inhalte/fr.json';
import {
  QUELLSPRACHE,
  sprachdefinition,
  type Sprache,
} from './sprachen';
import {
  anwenden,
  fingerabdruck,
  SPEC_KATEGORIE,
  SPEC_LEISTUNG,
  SPEC_STANDORT,
} from './felder';
import { TEXTE, type TextSchluessel } from './texte';
import type { Leistung, Kategorie } from '../data/leistungen';
import type { Standort } from '../data/standorte';

export interface Katalogeintrag {
  text: string;
  /** Fingerabdruck des deutschen Ausgangstextes zum Zeitpunkt der Übersetzung. */
  quelle: string;
}

export interface Katalog {
  sprache: string;
  eintraege: Record<string, Katalogeintrag>;
}

const KATALOGE: Partial<Record<Sprache, Katalog>> = {
  en: enKatalog as Katalog,
  fr: frKatalog as Katalog,
};

/** Lücken, die beim Rendern aufgefallen sind – für die Ausgabe am Buildende. */
const luecken = new Map<string, Set<string>>();

export function gemeldeteLuecken(): Record<string, string[]> {
  return Object.fromEntries([...luecken].map(([k, v]) => [k, [...v].sort()]));
}

/**
 * Nachschlagefunktion für eine Sprache.
 *
 * Ist die Sprache freigegeben, ist eine Lücke ein Buildfehler: Eine
 * veröffentlichte Sprachfassung darf nirgends stillschweigend ins Deutsche
 * zurückfallen. Ist sie noch nicht freigegeben, wird die Lücke gesammelt und
 * der deutsche Text durchgereicht, damit sich die Übersetzung im fertigen
 * Layout gegenlesen lässt.
 */
export function nachschlagen(sprache: Sprache) {
  const streng = sprachdefinition(sprache).freigegeben;

  return function hole(schluessel: string, deutsch: string): string {
    if (sprache === QUELLSPRACHE) return deutsch;

    const eintrag = KATALOGE[sprache]?.eintraege?.[schluessel];
    if (eintrag) {
      if (eintrag.quelle === fingerabdruck(deutsch)) return eintrag.text;
      if (streng) {
        throw new Error(
          `[i18n] Übersetzung veraltet: "${schluessel}" (${sprache}). ` +
            'Der deutsche Text wurde nach der Übersetzung geändert. ' +
            'Bitte "npm run sprachen:sync" ausführen.',
        );
      }
      merken(sprache, `${schluessel} (veraltet)`);
      return deutsch;
    }

    if (streng) {
      throw new Error(
        `[i18n] Übersetzung fehlt: "${schluessel}" (${sprache}). ` +
          'Bitte "npm run sprachen:sync" ausführen.',
      );
    }
    merken(sprache, schluessel);
    return deutsch;
  };
}

function merken(sprache: Sprache, schluessel: string) {
  if (!luecken.has(sprache)) luecken.set(sprache, new Set());
  luecken.get(sprache)!.add(schluessel);
}

// ─────────────────────── Oberflächentexte ───────────────────────

/**
 * Übersetzer für die Oberflächentexte.
 *
 * Platzhalter werden als `{name}` geschrieben und beim Aufruf ersetzt. Das ist
 * dem Zusammenkleben von Satzteilen vorzuziehen: "3 Standorte in Berlin" lässt
 * sich in andere Sprachen nur dann sauber übertragen, wenn der ganze Satz
 * übersetzt wird und nicht seine Bruchstücke.
 */
export function texte(sprache: Sprache) {
  const hole = nachschlagen(sprache);

  return function t(schluessel: TextSchluessel, werte?: Record<string, string | number>): string {
    const deutsch = TEXTE[schluessel];
    let text = hole(`ui.${schluessel}`, deutsch);
    if (werte) {
      for (const [name, wert] of Object.entries(werte)) {
        text = text.replaceAll(`{${name}}`, String(wert));
      }
    }
    return text;
  };
}

// ─────────────────────── Inhalte in einer Sprache ───────────────────────

const zwischenspeicher = new Map<string, unknown>();

function gepuffert<T>(schluessel: string, bauen: () => T): T {
  if (!zwischenspeicher.has(schluessel)) zwischenspeicher.set(schluessel, bauen());
  return zwischenspeicher.get(schluessel) as T;
}

export function leistungIn(l: Leistung, sprache: Sprache): Leistung {
  if (sprache === QUELLSPRACHE) return l;
  return gepuffert(`l:${sprache}:${l.slug}`, () =>
    anwenden(l, SPEC_LEISTUNG, `leistung.${l.slug}`, nachschlagen(sprache)),
  );
}

export function leistungenIn(liste: Leistung[], sprache: Sprache): Leistung[] {
  return sprache === QUELLSPRACHE ? liste : liste.map((l) => leistungIn(l, sprache));
}

export function kategorieIn(k: Kategorie, sprache: Sprache): Kategorie {
  if (sprache === QUELLSPRACHE) return k;
  return gepuffert(`k:${sprache}:${k.slug}`, () =>
    anwenden(k, SPEC_KATEGORIE, `kategorie.${k.slug}`, nachschlagen(sprache)),
  );
}

export function standortIn(s: Standort, sprache: Sprache): Standort {
  if (sprache === QUELLSPRACHE) return s;
  return gepuffert(`s:${sprache}:${s.slug}`, () =>
    anwenden(s, SPEC_STANDORT, `standort.${s.slug}`, nachschlagen(sprache)),
  );
}

export function standorteIn(liste: Standort[], sprache: Sprache): Standort[] {
  return sprache === QUELLSPRACHE ? liste : liste.map((s) => standortIn(s, sprache));
}
