/**
 * Welche Standortfassung einer Leistung für sich allein steht.
 *
 * ── Das Problem, das diese Datei löst ──────────────────────────────────────
 *
 * Jede Leistung hat eine ausführliche Seite unter `/leistungen/<slug>/` und
 * zusätzlich je Standort eine Fassung unter `/<ort>/leistungen/<slug>/`.
 * Gemessen über alle 362 Seiten lagen die Standortfassungen derselben Leistung
 * untereinander bei 30 bis 77,8 Prozent Textgleichheit, bei im Mittel nur 248
 * Wörtern. Der Grund ist einfach: Es stand überall derselbe Fachtext, getauscht
 * waren Adresse und Telefonnummer.
 *
 * Jede dieser Seiten verwies per Canonical auf sich selbst. Damit meldete die
 * Website Google vier Originale derselben Aussage. Google wählt in so einem
 * Fall selbst eines aus – und zwar nicht unbedingt das, das man ranken lassen
 * möchte. Die übrigen fallen weg, samt der internen Verlinkung, die auf sie
 * zeigt.
 *
 * ── Die Regel ─────────────────────────────────────────────────────────────
 *
 * Eine Standortfassung steht nur dann für sich, wenn sie mindestens 350 Wörter
 * enthält, die auf keiner anderen Seite dieser Website vorkommen. Umformulierter
 * Fachtext zählt nicht – gemeint ist Substanz, die nur an diesem Ort gilt:
 *
 *   1. Wer das hier macht: zwei bis drei namentliche Behandelnde mit Link auf
 *      ihr Profil und je einem Satz zu ihrem Schwerpunkt bei genau dieser
 *      Leistung.
 *   2. Womit: die Geräte und Verfahren, die an diesem Standort dafür da sind.
 *      Wo das DVT steht, ob das Meisterlabor im Haus ist, welches System
 *      benutzt wird.
 *   3. Wie es hier abläuft: Zahl der Sitzungen, Dauer je Termin, übliche
 *      Wartezeit auf einen Ersttermin an diesem Standort.
 *   4. Anfahrt, soweit sie für diese Leistung zählt: Begleitperson und Rückweg
 *      nach einer Narkose, Parkmöglichkeit vor einem chirurgischen Eingriff,
 *      Termine in der Mittagspause bei der Prophylaxe.
 *   5. Zwei bis drei Fragen im FAQ, die es nur an diesem Standort gibt.
 *
 * Wer eine Fassung hier einträgt, ohne dass diese fünf Punkte belegt sind,
 * stellt den alten Zustand wieder her – nur unsichtbar.
 *
 * ── Was passiert, solange ein Eintrag fehlt ───────────────────────────────
 *
 * Die Seite bleibt vollständig erreichbar, verlinkt und im Menü. Sie verweist
 * lediglich per Canonical auf `/leistungen/<slug>/` und steht nicht in der
 * Sitemap. Für Besucher ändert sich nichts, für Suchmaschinen wird aus vier
 * Halben ein Ganzes.
 *
 * Kein zusätzliches `noindex`: Beides zusammen ist ein Widerspruch, dem Google
 * nicht verlässlich folgt.
 */

import { TEAM } from './team';
import { profilEigenstaendig } from './profiltiefe';

/** Schlüssel: `<standort-slug>/<leistung-slug>`. */
export type Standortfassung = `${string}/${string}`;

/**
 * Standortfassungen mit eigener Substanz.
 *
 * Noch leer – Stand 28.07.2026 erfüllt keine der 112 Fassungen die Regel oben.
 * Das ist kein Versäumnis der Technik, sondern eine offene Redaktionsaufgabe:
 * Die fünf Punkte lassen sich nicht erfinden, sie müssen aus der Praxis kommen.
 *
 * Realistische Reihenfolge, wenn sie gefüllt wird: zuerst Kurfürstendamm, weil
 * dort alle Fachbereiche, das Meisterlabor und die meisten Behandelnden sitzen;
 * dann Potsdam. Berlin-Mitte und Wilmersdorf zuletzt – für Wilmersdorf ist
 * derzeit nicht einmal ein Team hinterlegt.
 */
export const EIGENSTAENDIGE_FASSUNGEN: ReadonlySet<Standortfassung> = new Set([
  // 'berlin-charlottenburg/zahnimplantate',
]);

/** Steht diese Standortfassung für sich – oder verweist sie auf die Hauptseite? */
export function fassungIstEigenstaendig(standortSlug: string, leistungSlug: string): boolean {
  return EIGENSTAENDIGE_FASSUNGEN.has(`${standortSlug}/${leistungSlug}`);
}

/**
 * Pfade, die nicht in die Sitemap gehören.
 *
 * Eine Sitemap ist eine Empfehlungsliste: „Diese Adressen sind das Original.“
 * Eine Seite dort zu melden, die per Canonical auf eine andere zeigt oder
 * `noindex` trägt, ist ein Widerspruch – die Search Console meldet ihn als
 * Fehler, und zu Recht.
 *
 * Erfasst sind:
 *   · Standortfassungen ohne eigene Substanz (Canonical auf die Hauptseite)
 *   · die Leistungsübersicht je Standort – eine gefilterte Liste, deren vier
 *     Fassungen zu 83,8 Prozent textgleich waren
 *   · die Anamnese je Standort – vier Seiten, die zu 90,2 Prozent denselben
 *     Text trugen; der Inhalt steht jetzt auf `/anamnese/`
 *   · der Blog je Standort – dieselben Beiträge, nur gefiltert
 */
/**
 * Seiten, die selbst `noindex` tragen.
 *
 * Impressum und Datenschutzerklärung sind ENTWÜRFE mit Platzhaltern, bis die
 * Praxis die Pflichtangaben liefert – deshalb tragen sie `noindex`, und
 * deshalb dürfen sie auch nicht in der Sitemap stehen. Beides zusammen wäre
 * ein Widerspruch mit Ansage: Die Sitemap sagt „bitte aufnehmen", die Seite
 * sagt „bitte nicht".
 *
 * Sobald die Angaben vorliegen und das `noindex` in der jeweiligen Seite
 * fällt, gehört der Eintrag hier ebenfalls weg. Damit das niemand vergisst,
 * prüft `scripts/sitemap-liste.mjs` jede Sitemap-Adresse gegen das gebaute
 * HTML und bricht ab, wenn beides auseinanderläuft – in beide Richtungen.
 */
const NOINDEX_SEITEN = ['/impressum/', '/datenschutz/'];

export function ausSitemapAusschliessen(pfad: string): boolean {
  const p = pfad.replace(/^https?:\/\/[^/]+/, '');

  if (NOINDEX_SEITEN.includes(p)) return true;

  /* Teamübersicht eines Standorts ohne eigenes Team – dort steht nichts, was
     man indexieren könnte, und die Seite sagt das selbst per `noindex`. */
  const teamUebersicht = p.match(/^\/([a-z-]+)\/team\/$/);
  if (teamUebersicht && !TEAM.some((t) => t.standorte.includes(teamUebersicht[1]))) return true;

  // /<ort>/leistungen/  und  /<ort>/blog/  und  /<ort>/anamnese/
  if (/^\/[a-z-]+\/(leistungen|blog|anamnese)\/$/.test(p)) return true;

  // /<ort>/leistungen/<slug>/ – nur, wenn die Fassung nicht für sich steht
  const treffer = p.match(/^\/([a-z-]+)\/leistungen\/([a-z0-9-]+)\/$/);
  if (treffer) return !fassungIstEigenstaendig(treffer[1], treffer[2]);

  /* Behandlerprofil am Zweitstandort. Das Profil gehört zum Hauptstandort –
     dem ersten Eintrag in `standorte`. Die Person bleibt an beiden Standorten
     in der Teamübersicht sichtbar; nur die Adresse zählt einfach. */
  const profil = p.match(/^\/([a-z-]+)\/team\/([a-z0-9-]+)\/$/);
  if (profil) {
    const person = TEAM.find((t) => t.slug === profil[2]);
    if (person && person.standorte[0] !== profil[1]) return true;
    /* Profile ohne eigene Substanz zeigen auf die Teamübersicht und gehören
       damit nicht in die Sitemap – siehe src/data/profiltiefe.ts */
    if (person && !profilEigenstaendig(person.slug)) return true;
  }

  return false;
}
