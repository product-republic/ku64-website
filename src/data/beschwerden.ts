/**
 * Beschwerdeseiten – der Weg vom Symptom zur Behandlung.
 *
 * ── Wozu sie da sind ──────────────────────────────────────────────────────
 *
 * Menschen suchen nach ihrem Symptom, nicht nach dem Fachbegriff. Niemand
 * tippt „Parodontitistherapie“ ein, bevor er weiß, dass er sie braucht –
 * getippt wird „Zahnfleisch blutet“. Diese dreißig Seiten sind der Einstieg
 * für alle, die noch nicht wissen, wonach sie eigentlich suchen.
 *
 * Sie stehen unter ihren ursprünglichen Adressen, weil genau die bei Google
 * platziert sind: `/zahnbeschwerden/zahnfleischbluten/` und keine andere.
 *
 * ── Warum sie nicht standortscharf sind ───────────────────────────────────
 *
 * Weil Zahnfleischbluten in Potsdam dasselbe ist wie am Kurfürstendamm. Was
 * sich je Standort unterscheidet, ist die BEHANDLUNG – und dorthin verweist
 * die Seite. Vier gleichlautende Fassungen derselben Erklärung wären vier
 * Seiten, die um dieselbe Suchanfrage konkurrieren; Google nennt das
 * Kannibalisierung und entscheidet sich dann für keine davon.
 *
 * ── Woher der Text kommt ──────────────────────────────────────────────────
 *
 * Von ku64.de, übernommen durch `analyse/altbestand/beschwerden-holen.mjs`.
 * Es ist der Text der Praxis, nicht ein neu geschriebener: 754 bis 3105
 * Wörter je Seite, im Mittel 1870. Fachlich geprüft wurde er dort schon
 * einmal – ihn neu zu schreiben hieße, diese Prüfung wegzuwerfen.
 *
 * ── Fachliche Freigabe: liegt vor ──────────────────────────────────────
 *
 * Diese Texte brauchen keine neue Prüfung. Sie standen jahrelang unter
 * denselben Adressen auf ku64.de veröffentlicht – die Praxis hat sie also
 * bereits freigegeben, und der Relaunch ändert daran nichts. Das gilt
 * ausdrücklich auch für die Hausmittel-Abschnitte („Nelkenöl“,
 * „Salzwasserspülung“): Sie sind übernommen, nicht hinzugefügt.
 *
 * Zu unterscheiden davon sind die NEU GESCHRIEBENEN Behandlungstexte in
 * `leistungen.ts`. Die sind für diese Website entstanden und noch von
 * niemandem gegengelesen worden. Der Unterschied ist wichtig genug, um ihn
 * an beiden Stellen zu notieren: Wer alles über einen Kamm schert, prüft
 * entweder zu viel oder zu wenig.
 */

import roh from './beschwerden.json';
import { getLeistung, type Leistung } from './leistungen.ts';

export interface Textblock {
  art: 'absatz' | 'liste';
  text?: string;
  punkte?: string[];
}

export interface Beschwerdeabschnitt {
  ebene: 'h2' | 'h3';
  titel: string;
  bloecke: Textblock[];
}

export interface Beschwerde {
  slug: string;
  titel: string;
  beschreibung: string;
  einstieg: Textblock[];
  abschnitte: Beschwerdeabschnitt[];
  faq: { frage: string; antwort: string }[];
  quelle: string;
}

export const BESCHWERDEN = roh as Beschwerde[];

/**
 * Welche Behandlung zu welcher Beschwerde führt.
 *
 * Die erste ist die naheliegende – auf sie zeigte bisher die Weiterleitung,
 * und sie steht auf der Seite als der Weg, den die Praxis empfiehlt. Die
 * weiteren sind das, was zusätzlich in Frage kommt.
 *
 * Von Hand gepflegt und nicht abgeleitet: „Zahn locker“ führt zur
 * Parodontitisbehandlung, obwohl in der Beschwerde kein Wort davon vorkommt.
 * Das weiß man oder man weiß es nicht; raten lässt es sich nicht.
 */
export const FUEHRT_ZU: Record<string, string[]> = {
  druckschmerz: ['wurzelkanalbehandlung', 'karies-behandlung', 'parodontitis-behandlung'],
  'ernaehrung-gesunde-zaehne': ['zahnvorsorge', 'professionelle-zahnreinigung'],
  'gelbe-zaehne': ['zahnaufhellung', 'professionelle-zahnreinigung', 'veneers'],
  'karies-symptome': ['karies-behandlung', 'kunststofffuellungen', 'zahnvorsorge'],
  kreidezaehne: ['kreidezaehne', 'kinderzahnarzt', 'fissurenversiegelung'],
  'kreuzbiss-kinder': ['kinderzahnarzt', 'feste-zahnspange', 'aligner'],
  'loch-im-zahn': ['karies-behandlung', 'kunststofffuellungen', 'inlays-onlays'],
  'mundgeruch-was-tun': ['professionelle-zahnreinigung', 'prophylaxe-4-0', 'parodontitis-behandlung'],
  'mundpilz-mundsoor': ['zahnvorsorge', 'professionelle-zahnreinigung'],
  mundschleimhautentzuendung: ['parodontitis-behandlung', 'zahnvorsorge'],
  mundtrockenheit: ['zahnvorsorge', 'professionelle-zahnreinigung'],
  'schiefe-zaehne': ['aligner', 'feste-zahnspange', 'veneers'],
  'schmerzempfindliche-zaehne': ['parodontitis-behandlung', 'kunststofffuellungen', 'professionelle-zahnreinigung'],
  'sport-mit-zahnspange': ['feste-zahnspange', 'aligner', 'retainer'],
  'vereiterter-zahn': ['wurzelkanalbehandlung', 'zahnentfernung'],
  'weisheitszahn-op': ['weisheitszaehne', 'behandlung-in-narkose', 'lachgas'],
  'zahn-locker': ['parodontitis-behandlung', 'zahnimplantate'],
  'zahnarzt-schwangerschaft': ['zahnvorsorge', 'professionelle-zahnreinigung'],
  'zahnerosion-behandeln': ['kunststofffuellungen', 'inlays-onlays', 'keramik-kronen'],
  zahnfleischbluten: ['parodontitis-behandlung', 'professionelle-zahnreinigung', 'prophylaxe-4-0'],
  zahnfleischentzuendung: ['parodontitis-behandlung', 'professionelle-zahnreinigung'],
  zahnfleischrueckgang: ['parodontitis-behandlung', 'professionelle-zahnreinigung'],
  zahnfleischtaschen: ['parodontitis-behandlung', 'prophylaxe-4-0'],
  zahngifte: ['kunststofffuellungen', 'inlays-onlays'],
  zahnschmelzdefekte: ['kreidezaehne', 'kunststofffuellungen', 'veneers'],
  zahnschmerzen: ['wurzelkanalbehandlung', 'karies-behandlung', 'cmd-behandlung'],
  'zahnstein-entfernen-behandeln': ['professionelle-zahnreinigung', 'prophylaxe-4-0'],
  zahnverfaerbung: ['zahnaufhellung', 'professionelle-zahnreinigung', 'veneers'],
  zahnwurzelentzuendung: ['wurzelkanalbehandlung', 'zahnentfernung'],
  /*
   * Der Notfall ist keine Behandlung im Katalog, sondern eine eigene Seite.
   * Wer „Zahn abgebrochen“ sucht, braucht keine Erklärung, sondern eine
   * Telefonnummer – deshalb steht auf dieser Seite die Notfallseite oben.
   */
  'zahn-abgebrochen': ['karies-behandlung', 'keramik-kronen', 'zahnentfernung'],
};

/**
 * Beschwerden, bei denen zuerst die Notfallseite kommt.
 *
 * Nicht dieselbe Frage wie „welche Behandlung passt“. Wer akute Schmerzen
 * hat, liest keine 1800 Wörter – der braucht oben auf der Seite die Nummer.
 */
export const AKUT = new Set([
  'zahnschmerzen',
  'zahn-abgebrochen',
  'druckschmerz',
  'vereiterter-zahn',
  'zahnwurzelentzuendung',
]);

export function getBeschwerde(slug: string): Beschwerde | undefined {
  return BESCHWERDEN.find((b) => b.slug === slug);
}

/** Die zugeordneten Behandlungen, aufgelöst; unbekannte Slugs fallen weg. */
export function behandlungenZu(slug: string): Leistung[] {
  return (FUEHRT_ZU[slug] ?? [])
    .map((s) => getLeistung(s))
    .filter((l): l is Leistung => Boolean(l));
}

/**
 * Beschwerden, die zu einer Behandlung führen – die Gegenrichtung.
 *
 * Damit auch die Leistungsseite auf die Beschwerden verweisen kann, über
 * die man auf sie stößt. Das ist die Verlinkung, die eine Website zusammen
 * hält: vom Symptom zur Behandlung zum Standort und zurück.
 */
export function beschwerdenZuBehandlung(leistungSlug: string): Beschwerde[] {
  return BESCHWERDEN.filter((b) => (FUEHRT_ZU[b.slug] ?? []).includes(leistungSlug));
}
