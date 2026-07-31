/**
 * Die Themen unter `/ueber-uns/` – welche es gibt, woher ihr Text stammt.
 *
 * ── Warum diese Datei entstanden ist ────────────────────────────────────
 *
 * Die alte Website hatte unter `/ueber-uns/` zehn Seiten mit zusammen 16.176
 * Wörtern. Der erste Neubau hatte dort eine Seite mit 862. Neun Adressen
 * führten per Weiterleitung auf diese eine Seite – technisch sauber, inhaltlich
 * ein Totalverlust: Auszeichnungen, Mitgliedschaften, Kooperationspartner und
 * Presseberichte sind genau die Belege, auf die Google bei medizinischen
 * Themen abstellt (E-E-A-T), und für Patientinnen der Unterschied zwischen
 * behaupteter und belegter Kompetenz.
 *
 * Diese Datei stellt sie wieder her – unter denselben Adressen wie vorher.
 * Das ist der Punkt: Wo die alte Adresse zurückkehrt, braucht es keine
 * Weiterleitung mehr, und jeder Link von außen, jedes Lesezeichen und jedes
 * alte Suchergebnis führt wieder dorthin, wo es hinführen sollte.
 *
 * ── Was hier steht und was nicht ────────────────────────────────────────
 *
 * Hier steht nur, WELCHE Themen es gibt und WOHER ihr Text kommt. Der Text
 * selbst steht nicht hier: Er ist der Originaltext der Praxis, kommt aus
 * `analyse/altbestand/texte.json` und wird von `scripts/langtexte-bauen.mjs`
 * nach `src/inhalte/langtexte.json` gestellt – wortgleich, mit einer
 * dokumentierten Ausnahme je Korrektur (siehe `KORREKTUREN` dort).
 *
 * Titel und Anreißer stehen im Oberflächenkatalog (`src/i18n/texte.ts`) unter
 * `thema.<slug>.*`. Nicht hier, weil sie übersetzt werden müssen und der
 * Sprachwächter nur findet, was im Katalog steht.
 *
 * ── Warum `aufUebersicht` ───────────────────────────────────────────────
 *
 * Ein Eintrag ist kein Thema mit eigener Seite, sondern der Text der
 * Übersichtsseite selbst: die 2.211 Wörter, die auf `/ueber-uns/` standen und
 * beim ersten Neubau verschwanden. Er bekommt keine eigene Adresse – er IST
 * die Adresse. Ohne dieses Feld hätte es eine Seite `/ueber-uns/ueber-uns/`
 * gegeben, und das wäre albern.
 */

/** Gruppen, in denen die Themen auf `/ueber-uns/` erscheinen. */
export type Themengruppe = 'haus' | 'belege' | 'engagement' | 'praxis';

export interface Thema {
  /** Adresse: `/ueber-uns/<slug>/`. Wo möglich der alte Slug – siehe oben. */
  slug: string;
  /** Die Adresse auf ku64.de, aus der der Text stammt. Beleg, nicht Deko. */
  quelle: string;
  /** `true` = der Text steht auf `/ueber-uns/` selbst, ohne eigene Adresse. */
  aufUebersicht?: boolean;
  gruppe: Themengruppe;
  /**
   * Bilder aus `src/lib/bilder.ts`, nach Standort gruppiert.
   *
   * Nur bei der Galerie gefüllt. Ihr alter Inhalt WAREN die Bilder – sechs
   * Bildunterschriften ohne Fließtext. Der Text allein wäre eine Seite mit
   * sechs Sätzen; die Bilder allein sind die Seite, die es war.
   *
   * Nach Standort gruppiert und nicht als eine Reihe, weil die alte Galerie
   * genau das nicht tat: Sie mischte Ku'damm, Berlin-Mitte und die
   * Kinderabteilung, und wer wissen wollte, wie es an SEINEM Standort
   * aussieht, musste raten. Vier Praxen sehen verschieden aus – das ist der
   * Punkt der Architektur und gehört sichtbar gemacht.
   */
  bilder?: { standort: string; schluessel: string[] }[];
  /**
   * Kein Langtext aus dem Altbestand – der Inhalt entsteht auf der Seite.
   *
   * Nur bei der Galerie. Ihre sechs alten „Absätze" sind Bildunterschriften
   * zu Bildern, die im Neubau ihren Alternativtext und ihre Einordnung im
   * Bildverzeichnis tragen. Sie zusätzlich als Fließtext zu setzen hieße,
   * jede Bildunterschrift zweimal zu schreiben – einmal davon in der
   * fehlerhaften Fassung der alten Seite („Vertikaler grüne Pflanzenwand").
   */
  ohneLangtext?: boolean;
  /**
   * Standort, an dem das Thema hängt – nur wo es wirklich einen gibt.
   *
   * Der Ultraschallreiniger ist in Potsdam erhältlich und stand deshalb unter
   * `/potsdam/ultraschall-reiniger/`. Die Seite zieht damit um; die alte
   * Adresse leitet weiter. Der Hinweis „erhältlich in Potsdam" bleibt und
   * verlinkt dorthin – sonst wäre der Umzug ein Informationsverlust.
   */
  standort?: string;
}

export const THEMEN: Thema[] = [
  /*
   * Der Text der Übersichtsseite. Steht zuerst, weil er auf `/ueber-uns/`
   * über allem anderen steht.
   */
  { slug: 'uebersicht', quelle: '/ueber-uns/', aufUebersicht: true, gruppe: 'haus' },

  /* ── Das Haus ───────────────────────────────────────────────────────
   *
   * „Zahnarzt on the beach" ist die Geschichte, nach der der Auftraggeber
   * ausdrücklich gefragt hat: die Architekten GRAFT, das Design Hotel Q!,
   * die Vision von Dr. Ziegler, „Environmental Healing", Architektur als
   * Teil der Behandlung. Sie stand auf `/ueber-uns/location/` und war die
   * einzige Stelle, an der sie vollständig stand.
   */
  { slug: 'location', quelle: '/ueber-uns/location/', gruppe: 'haus' },
  { slug: 'best-practice', quelle: '/ueber-uns/best-practice/', gruppe: 'haus' },
  {
    slug: 'galerie',
    quelle: '/ueber-uns/galerie/',
    gruppe: 'haus',
    ohneLangtext: true,
    bilder: [
      {
        standort: 'berlin-charlottenburg',
        schluessel: [
          'kudamm-flur',
          'kudamm-empfang',
          'kudamm-wartebereich',
          'kudamm-behandlungszimmer',
          'kudamm-meisterlabor',
        ],
      },
      {
        standort: 'berlinmitte',
        schluessel: ['berlinmitte-empfang', 'berlinmitte-wartebereich', 'berlinmitte-praxis'],
      },
      { standort: 'potsdam', schluessel: ['potsdam-empfang', 'potsdam-wartebereich'] },
      { standort: 'wilmersdorf', schluessel: ['wilmersdorf-aussenansicht'] },
    ],
  },

  /* ── Belege ─────────────────────────────────────────────────────────
   *
   * Die vier Seiten, deren Verlust am teuersten war. Sie belegen, was die
   * übrigen Seiten behaupten.
   */
  { slug: 'auszeichnungen', quelle: '/ueber-uns/auszeichnungen/', gruppe: 'belege' },
  { slug: 'presseinfo', quelle: '/ueber-uns/presseinfo/', gruppe: 'belege' },
  { slug: 'mitgliedschaften', quelle: '/ueber-uns/mitgliedschaften/', gruppe: 'belege' },
  { slug: 'kooperationspartner', quelle: '/ueber-uns/kooperationspartner/', gruppe: 'belege' },

  /* ── Engagement ─────────────────────────────────────────────────────── */
  {
    slug: 'hilfsprojekt-suedafrika',
    quelle: '/ueber-uns/hilfsprojekt-suedafrika/',
    gruppe: 'engagement',
  },
  { slug: 'soziales-engagement', quelle: '/ueber-uns/soziales-engagement/', gruppe: 'engagement' },

  /* ── Aus der Praxis ─────────────────────────────────────────────────── */
  {
    slug: 'ultraschallreiniger',
    quelle: '/potsdam/ultraschall-reiniger/',
    gruppe: 'praxis',
    standort: 'potsdam',
  },
];

/** Die Themen mit eigener Adresse – für `getStaticPaths` und die Sitemap. */
export const THEMEN_MIT_SEITE = THEMEN.filter((t) => !t.aufUebersicht);

/** Der Eintrag, dessen Text auf `/ueber-uns/` selbst steht. */
export const THEMA_UEBERSICHT = THEMEN.find((t) => t.aufUebersicht);

export function getThema(slug: string): Thema | undefined {
  return THEMEN.find((t) => t.slug === slug);
}

/**
 * Reihenfolge der Gruppen auf der Übersicht.
 *
 * Nicht alphabetisch: Zuerst das Haus – das ist die Frage, mit der jemand
 * auf „Über uns" klickt. Dann die Belege, dann das Engagement, zuletzt das
 * Einzelthema aus der Praxis.
 */
export const GRUPPENFOLGE: Themengruppe[] = ['haus', 'belege', 'engagement', 'praxis'];
