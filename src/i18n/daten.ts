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
  type VerwandteLeistung,
} from '../data/leistungen';
import { STANDORTE, getStandort, type Standort } from '../data/standorte';
import { BESCHWERDEN, getBeschwerde, type Beschwerde } from '../data/beschwerden';
import type { KiSystem } from '../data/ki-systeme';
import { BEITRAEGE, beitrag as beitragRoh, type Beitrag } from '../lib/blog';
import profile from '../data/profile.json';
import {
  beitraegeIn,
  beitragIn,
  beschwerdeIn,
  beschwerdenIn,
  kategorieIn,
  kiSystemIn,
  kiSystemeIn,
  leistungIn,
  leistungenIn,
  personIn,
  standortIn,
  standorteIn,
} from './katalog';
import { spracheAusParameter, type Sprache } from './sprachen';

type Profil = (typeof profile)[keyof typeof profile];

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
  /*
   * Verwandte Leistungen kommen mit ihrer Verfügbarkeit am aufgerufenen
   * Standort zurück, nicht als nackte Liste. Die Leistungsseite trennt
   * danach: „auch hier" gegen „dort schon" – ohne diese Angabe könnte sie
   * das nicht, und genau das stand hier vorher als Typ.
   */
  verwandte(leistung: Leistung, standortSlug: string): VerwandteLeistung[];
  gruppen(standortSlug: string): { kategorie: Kategorie; leistungen: Leistung[] }[];
  /* ── Die langen Inhalte ──────────────────────────────────────────────
   *
   * Auch sie gehören hierher und nicht in einen direkten Import. Wer
   * `profile.json` selbst importiert, bekommt Deutsch – auf jeder Seite,
   * in jeder Sprache, ohne Fehlermeldung. Genau das war der Zustand.
   */
  person(slug: string): Profil | undefined;
  beitraege: Beitrag[];
  beitrag(slug: string): Beitrag | undefined;
  beschwerden: Beschwerde[];
  beschwerde(slug: string): Beschwerde | undefined;
  /* ── KI-Systeme ──────────────────────────────────────────────────────
   *
   * Auch sie über `inhalte(Astro)` und nicht per direktem Import: Wer
   * `KI_SYSTEME` selbst importiert, bekommt die deutsche Offenlegung – auf
   * jeder Seite, in jeder Sprache. Genau das war der Zustand.
   */
  kiSystem(slug: string): KiSystem | undefined;
  kiSysteme: KiSystem[];
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
      verwandteLeistungen(leistung, standortSlug).map((v) => ({
        ...v,
        leistung: leistungIn(v.leistung, sprache),
      })),
    gruppen: (standortSlug) =>
      kategorienMitLeistungen(standortSlug).map((g) => ({
        kategorie: kategorieIn(g.kategorie, sprache),
        leistungen: leistungenIn(g.leistungen, sprache),
      })),
    person: (slug) => {
      const p = (profile as Record<string, Profil>)[slug];
      return p ? personIn(slug, p, sprache) : undefined;
    },
    get beitraege() {
      return beitraegeIn(BEITRAEGE, sprache);
    },
    beitrag: (slug) => {
      const b = beitragRoh(slug);
      return b ? beitragIn(b, sprache) : undefined;
    },
    get beschwerden() {
      return beschwerdenIn(BESCHWERDEN, sprache);
    },
    kiSystem: (slug) => kiSystemIn(slug, sprache),
    get kiSysteme() {
      return kiSystemeIn(sprache);
    },
    beschwerde: (slug) => {
      const b = getBeschwerde(slug);
      return b ? beschwerdeIn(b, sprache) : undefined;
    },
  };
}
