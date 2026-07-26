/**
 * Zugriff auf Standorte und Leistungen in der Sprache der aktuellen Seite.
 *
 * Seiten und Bausteine holen ihre Inhalte über `inhalte(Astro)` statt direkt
 * aus den Datendateien. Der Unterschied ist klein zu schreiben und groß in der
 * Wirkung: Wer direkt importiert, bekommt immer Deutsch – und zwar
 * stillschweigend, ohne Fehlermeldung, auf einer Seite unter /en/.
 *
 * `getStaticPaths` bleibt bewusst bei den rohen Daten. Dort werden nur Slugs
 * gebraucht, und die sind in jeder Sprache dieselben; außerdem läuft die
 * Funktion, bevor es eine Seite mit einer Sprache gibt.
 */

import {
  KATEGORIEN,
  LEISTUNGEN,
  getKategorie,
  getLeistung,
  kategorienMitLeistungen,
  leistungenFuerStandort,
  leistungenNichtAmStandort,
  verwandteLeistungen,
  type Kategorie,
  type Leistung,
} from '../data/leistungen';
import { STANDORTE, getStandort, type Standort } from '../data/standorte';
import { kategorieIn, leistungIn, leistungenIn, standortIn, standorteIn } from './katalog';
import { spracheAusParameter, type Sprache } from './sprachen';

export interface Inhalte {
  sprache: Sprache;
  standorte: Standort[];
  leistungen: Leistung[];
  kategorien: Kategorie[];
  standort(slug: string): Standort | undefined;
  leistung(slug: string): Leistung | undefined;
  kategorie(slug: string): Kategorie | undefined;
  leistungenHier(standortSlug: string): Leistung[];
  leistungenAnderswo(standortSlug: string): Leistung[];
  verwandte(leistung: Leistung, standortSlug: string): Leistung[];
  gruppen(standortSlug: string): { kategorie: Kategorie; leistungen: Leistung[] }[];
}

/** Nur das Nötige aus dem Astro-Objekt – so ist die Funktion auch testbar. */
interface MitParametern {
  params: Record<string, string | undefined>;
}

export function inhalte(astro: MitParametern): Inhalte {
  const sprache = spracheAusParameter(astro.params.sprache);

  return {
    sprache,
    get standorte() {
      return standorteIn(STANDORTE, sprache);
    },
    get leistungen() {
      return leistungenIn(LEISTUNGEN, sprache);
    },
    get kategorien() {
      return KATEGORIEN.map((k) => kategorieIn(k, sprache));
    },
    standort: (slug) => {
      const s = getStandort(slug);
      return s ? standortIn(s, sprache) : undefined;
    },
    leistung: (slug) => {
      const l = getLeistung(slug);
      return l ? leistungIn(l, sprache) : undefined;
    },
    kategorie: (slug) => {
      const k = getKategorie(slug);
      return k ? kategorieIn(k, sprache) : undefined;
    },
    leistungenHier: (standortSlug) => leistungenIn(leistungenFuerStandort(standortSlug), sprache),
    leistungenAnderswo: (standortSlug) =>
      leistungenIn(leistungenNichtAmStandort(standortSlug), sprache),
    verwandte: (leistung, standortSlug) =>
      leistungenIn(verwandteLeistungen(leistung, standortSlug), sprache),
    gruppen: (standortSlug) =>
      kategorienMitLeistungen(standortSlug).map((g) => ({
        kategorie: kategorieIn(g.kategorie, sprache),
        leistungen: leistungenIn(g.leistungen, sprache),
      })),
  };
}
