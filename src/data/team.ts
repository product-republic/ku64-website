/**
 * Team je Standort.
 *
 * ── Woher diese Daten stammen ───────────────────────────────────────────
 *
 * Aus den Weiterleitungsregeln der alten .htaccess. Jede Person hatte auf
 * ku64.de eine eigene Seite, und die Adressen dieser Seiten stehen dort –
 * mit Gruppe (/team/zahnaerzte/…) und teils mit Standort (/potsdam/team/…).
 * Das ist keine Erfindung, sondern Rekonstruktion aus Belegen des Kunden.
 *
 * ── Was daran unsicher ist, und warum das hier steht ────────────────────
 *
 * Adressen tragen keine Umlaute. "bruening" wird zu Brüning, "koenig" zu
 * König, "schuetz" zu Schütz – diese Rückübersetzung ist eindeutig. Nicht
 * eindeutig sind Zeichen, die eine URL gar nicht kennt: Aus "cigdem-korur"
 * lässt sich nicht ablesen, ob die Person Çiğdem Korur heißt.
 *
 * Deshalb trägt jeder Eintrag `bestaetigt`. Solange der auf `false` steht,
 * erscheint die Person NICHT auf der Website. Ein falsch geschriebener Name
 * ist bei einer Kollegin keine Kleinigkeit, sondern respektlos – und bei
 * einer Zahnärztin zusätzlich ein Problem, weil Patientinnen nach ihr suchen.
 *
 * ── Was noch fehlt ──────────────────────────────────────────────────────
 *
 * Funktionsbezeichnungen, Schwerpunkte, Sprachen und Fotos. Die stehen in der
 * WordPress-Datenbank, nicht in den Adressen.
 *
 * Rechtlicher Hinweis: Fotos und Namen brauchen die Einwilligung der
 * abgebildeten Personen (Art. 6 Abs. 1 lit. a DSGVO, § 22 KunstUrhG). Titel
 * wie "Spezialist für …" sind nur zulässig, wenn die Qualifikation vorliegt
 * und so benannt werden darf.
 */

import { STANDORT_SLUGS } from './standorte.ts';

export type Teamgruppe =
  | 'zahnaerzte'
  | 'dentalhygiene'
  | 'prophylaxe'
  | 'assistenz'
  | 'empfang'
  | 'verwaltung'
  | 'ausbildung';

export const GRUPPENNAMEN: Record<Teamgruppe, string> = {
  zahnaerzte: 'Zahnärztinnen und Zahnärzte',
  dentalhygiene: 'Dentalhygiene',
  prophylaxe: 'Prophylaxe',
  assistenz: 'Assistenz',
  empfang: 'Empfang und Service',
  verwaltung: 'Verwaltung',
  ausbildung: 'Auszubildende',
};

export interface TeamMitglied {
  /** Bewusst identisch mit dem Altbestand, damit die Personenseite ihre Adresse behält. */
  slug: string;
  name: string;
  /**
   * Von der Praxis bestätigt – und zwar zweierlei: dass die Schreibweise
   * stimmt UND dass die Person noch da ist.
   *
   * Der zweite Teil kam durch einen konkreten Fall dazu: Jana Jain stand in
   * dieser Liste, weil ihre Personenseite im Altbestand noch verlinkt war –
   * sie arbeitet aber nicht mehr bei KU64. Eine aus alten Adressen
   * rekonstruierte Belegschaft ist immer ein Stand von gestern. Ohne diese
   * Sperre stünden ehemalige Kolleginnen auf der neuen Website.
   */
  bestaetigt: boolean;
  gruppe: Teamgruppe;
  /** Standorte, an denen die Person arbeitet. */
  standorte: string[];
  /** z. B. "Zahnärztin", "Fachzahnarzt für Oralchirurgie". Aus der Datenbank nachzutragen. */
  funktion?: string;
  /** Leistungs-Slugs als Schwerpunkte – erzeugt automatisch Querverlinkung. */
  schwerpunkte?: string[];
  sprachen?: string[];
  /** Schlüssel in BILDER (src/lib/bilder.ts), sobald ein Foto mit Einwilligung vorliegt. */
  foto?: string;
  vorstellung?: string;
  /** Frühere Adressen dieser Person, die weiterhin ankommen müssen. */
  alteAdressen?: string[];
}

const KUDAMM = 'berlin-charlottenburg';

/**
 * Die Belegschaft, wie sie sich aus den Adressen des Altbestands ergibt.
 *
 * Standortzuordnung: Acht Personen lagen unter /potsdam/team/ und sind damit
 * belegt. Alle übrigen lagen unter /team/… – das war auf der alten Website
 * die Hauptpraxis am Kurfürstendamm. Diese Zuordnung ist plausibel, aber
 * nicht belegt; sie gehört je Person bestätigt. Deshalb steht sie hier
 * ausgeschrieben und nicht als stille Annahme im Code.
 */
export const TEAM: TeamMitglied[] = [
  // ── Zahnärztinnen und Zahnärzte · Kurfürstendamm ────────────────────
  { slug: 'dr-dr-thorsten-wegner', name: 'Dr. Dr. Thorsten Wegner', bestaetigt: false, gruppe: 'zahnaerzte', standorte: [KUDAMM] },
  { slug: 'dr-maike-bauer', name: 'Dr. Maike Bauer', bestaetigt: false, gruppe: 'zahnaerzte', standorte: [KUDAMM], alteAdressen: ['/team/zahnaerzte/maike-bauer/'] },
  { slug: 'dr-rahima-arsalan', name: 'Dr. Rahima Arsalan', bestaetigt: false, gruppe: 'zahnaerzte', standorte: [KUDAMM] },
  { slug: 'dr-birte-habedank', name: 'Dr. Birte Habedank', bestaetigt: false, gruppe: 'zahnaerzte', standorte: [KUDAMM, 'potsdam'] },
  { slug: 'dr-jana-westerhorstmann', name: 'Dr. Jana Westerhorstmann', bestaetigt: false, gruppe: 'zahnaerzte', standorte: [KUDAMM], alteAdressen: ['/dr-jana-westerhorstmann/'] },
  { slug: 'jiotis-hondralis', name: 'Jiotis Hondralis', bestaetigt: false, gruppe: 'zahnaerzte', standorte: [KUDAMM], alteAdressen: ['/jiotis-hondralis/'] },
  { slug: 'ahmet-turan', name: 'Ahmet Turan', bestaetigt: false, gruppe: 'zahnaerzte', standorte: [KUDAMM], alteAdressen: ['/ahmet-turan/'] },
  { slug: 'alexandra-sophia-fischer', name: 'Alexandra Sophia Fischer', bestaetigt: false, gruppe: 'zahnaerzte', standorte: [KUDAMM], alteAdressen: ['/alexandra-sophia-fischer/'] },
  { slug: 'diana-wald', name: 'Diana Wald', bestaetigt: false, gruppe: 'zahnaerzte', standorte: [KUDAMM] },
  { slug: 'elena-hude', name: 'Elena Hude', bestaetigt: false, gruppe: 'zahnaerzte', standorte: [KUDAMM], alteAdressen: ['/elena-hude/'] },
  { slug: 'feras-younes', name: 'Feras Younes', bestaetigt: false, gruppe: 'zahnaerzte', standorte: [KUDAMM] },
  { slug: 'ferry-dickmann', name: 'Ferry Dickmann', bestaetigt: false, gruppe: 'zahnaerzte', standorte: [KUDAMM] },
  { slug: 'frederike-bruening', name: 'Frederike Brüning', bestaetigt: false, gruppe: 'zahnaerzte', standorte: [KUDAMM], alteAdressen: ['/team/zahnaerzte/frederike-bruning/'] },
  { slug: 'freya-voge', name: 'Freya Voge', bestaetigt: false, gruppe: 'zahnaerzte', standorte: [KUDAMM] },
  { slug: 'mohamed-abudrya', name: 'Mohamed Abudrya', bestaetigt: false, gruppe: 'zahnaerzte', standorte: [KUDAMM], alteAdressen: ['/team/zahnaerzte/mohamed-budrya/'] },
  { slug: 'sulmaz-mohammad', name: 'Sulmaz Mohammad', bestaetigt: false, gruppe: 'zahnaerzte', standorte: [KUDAMM], alteAdressen: ['/sulmaz-mohammad/'] },
  { slug: 'tommy-bettac', name: 'Tommy Bettac', bestaetigt: false, gruppe: 'zahnaerzte', standorte: [KUDAMM] },
  { slug: 'ute-katja-koenig', name: 'Ute-Katja König', bestaetigt: false, gruppe: 'zahnaerzte', standorte: [KUDAMM] },
  { slug: 'christian-morar', name: 'Christian Morar', bestaetigt: false, gruppe: 'zahnaerzte', standorte: [KUDAMM], alteAdressen: ['/team-2/zahnaerzte/christian-morar/'] },
  { slug: 'samaneh-salehipour', name: 'Samaneh Salehipour', bestaetigt: false, gruppe: 'zahnaerzte', standorte: [KUDAMM], alteAdressen: ['/team/bleaching-kosmetik-shop/samaneh-salehipour/'] },
  { slug: 'cigdem-korur', name: 'Cigdem Korur', bestaetigt: false, gruppe: 'zahnaerzte', standorte: [KUDAMM], alteAdressen: ['/teams/cigdem-korur/', '/teams/cigmen-korur/'] },

  // ── Potsdam ─────────────────────────────────────────────────────────
  { slug: 'dr-anne-moser', name: 'Dr. Anne Moser', bestaetigt: false, gruppe: 'zahnaerzte', standorte: ['potsdam'], alteAdressen: ['/dr-anne-moser-2/'] },
  { slug: 'nils-radsack', name: 'Nils Radsack', bestaetigt: false, gruppe: 'zahnaerzte', standorte: ['potsdam'], alteAdressen: ['/nils-radsack/'] },
  { slug: 'susan-knickenberg', name: 'Susan Knickenberg', bestaetigt: false, gruppe: 'zahnaerzte', standorte: ['potsdam'] },
  { slug: 'jenny-friedla', name: 'Jenny Friedla', bestaetigt: false, gruppe: 'dentalhygiene', standorte: ['potsdam'], alteAdressen: ['/team/dentalhygieniker/jenny-friedla/'] },
  { slug: 'sarah-sander', name: 'Sarah Sander', bestaetigt: false, gruppe: 'prophylaxe', standorte: ['potsdam'] },
  { slug: 'celina-leppin', name: 'Celina Leppin', bestaetigt: false, gruppe: 'prophylaxe', standorte: ['potsdam'], alteAdressen: ['/celina-leppin/'] },
  { slug: 'clara-marlene-schulz', name: 'Clara Marlene Schulz', bestaetigt: false, gruppe: 'assistenz', standorte: ['potsdam'], alteAdressen: ['/clara-marlene-schulz/'] },

  // ── Berlin-Mitte ────────────────────────────────────────────────────
  { slug: 'jennifer-roedel', name: 'Jennifer Rödel', bestaetigt: false, gruppe: 'empfang', standorte: ['berlinmitte'], alteAdressen: ['/rezeption-und-service/jennifer-roedel/', '/berlinmitte/jennifer-roedel/'] },

  // ── Dentalhygiene ───────────────────────────────────────────────────
  { slug: 'edin-plavsic', name: 'Edin Plavsic', bestaetigt: false, gruppe: 'dentalhygiene', standorte: [KUDAMM], alteAdressen: ['/team/prophylaxe/edin-plavsic/'] },
  { slug: 'peggy-bofinger-hofmann', name: 'Peggy Bofinger-Hofmann', bestaetigt: false, gruppe: 'dentalhygiene', standorte: [KUDAMM] },

  // ── Prophylaxe ──────────────────────────────────────────────────────
  { slug: 'anna-zafarian', name: 'Anna Zafarian', bestaetigt: false, gruppe: 'prophylaxe', standorte: [KUDAMM] },
  { slug: 'jannik-scheurenbrand', name: 'Jannik Scheurenbrand', bestaetigt: false, gruppe: 'prophylaxe', standorte: [KUDAMM], alteAdressen: ['/jannik-scheurenbrand/'] },
  { slug: 'maja-asoska', name: 'Maja Asoska', bestaetigt: false, gruppe: 'prophylaxe', standorte: [KUDAMM] },
  { slug: 'marcellina-dallashaj', name: 'Marcellina Dallashaj', bestaetigt: false, gruppe: 'prophylaxe', standorte: [KUDAMM], alteAdressen: ['/marcellina-dallashaj/'] },
  { slug: 'melissa-albalizade', name: 'Melissa Albalizade', bestaetigt: false, gruppe: 'prophylaxe', standorte: [KUDAMM] },
  { slug: 'nicole-dickhoff-kranz', name: 'Nicole Dickhoff-Kranz', bestaetigt: false, gruppe: 'prophylaxe', standorte: [KUDAMM], alteAdressen: ['/team/prophylaxe/nicole-dickhoff-franz/'] },

  // ── Assistenz und Ausbildung ────────────────────────────────────────
  { slug: 'angie-skall', name: 'Angie Skall', bestaetigt: false, gruppe: 'assistenz', standorte: [KUDAMM], alteAdressen: ['/angie-skall/', '/team/assistenzen/angie-skall/'] },
  { slug: 'diana-flint', name: 'Diana Flint', bestaetigt: false, gruppe: 'assistenz', standorte: [KUDAMM] },
  { slug: 'dominik-demski', name: 'Dominik Demski', bestaetigt: false, gruppe: 'assistenz', standorte: [KUDAMM] },
  { slug: 'lulu-buerger', name: 'Lulu Bürger', bestaetigt: false, gruppe: 'assistenz', standorte: [KUDAMM], alteAdressen: ['/lulu-buerger/'] },
  { slug: 'eugenia-nicoleta-dutu', name: 'Eugenia Nicoleta Dutu', bestaetigt: false, gruppe: 'ausbildung', standorte: [KUDAMM], alteAdressen: ['/auszubildende/eugenia-nicoleta-dutu/'] },

  // ── Verwaltung und Empfang ──────────────────────────────────────────
  { slug: 'anka-ulrich', name: 'Anka Ulrich', bestaetigt: false, gruppe: 'verwaltung', standorte: [KUDAMM], alteAdressen: ['/anka-ulrich/'] },
  { slug: 'diane-dobrin', name: 'Diane Dobrin', bestaetigt: false, gruppe: 'verwaltung', standorte: [KUDAMM] },
  { slug: 'ina-lehmann', name: 'Ina Lehmann', bestaetigt: false, gruppe: 'verwaltung', standorte: [KUDAMM], alteAdressen: ['/ina-lehmann/'] },
  { slug: 'jasmin-piontek', name: 'Jasmin Piontek', bestaetigt: false, gruppe: 'verwaltung', standorte: [KUDAMM] },
  { slug: 'jocelyn-ballard', name: 'Jocelyn Ballard', bestaetigt: false, gruppe: 'verwaltung', standorte: [KUDAMM] },
  { slug: 'susan-feldmann', name: 'Susan Feldmann', bestaetigt: false, gruppe: 'verwaltung', standorte: [KUDAMM], alteAdressen: ['/human-resources/susan-feldmann/'] },
  { slug: 'christian-schuetz', name: 'Christian Schütz', bestaetigt: false, gruppe: 'verwaltung', standorte: [KUDAMM], alteAdressen: ['/team/kommunikation-human-resources/christian-schuetz/'] },
  { slug: 'carola-wantke', name: 'Carola Wantke', bestaetigt: false, gruppe: 'verwaltung', standorte: [KUDAMM], alteAdressen: ['/carola-wantke/'] },
  { slug: 'julia-ressler', name: 'Julia Ressler', bestaetigt: false, gruppe: 'verwaltung', standorte: [KUDAMM], alteAdressen: ['/julia-ressler/'] },
  { slug: 'eva-maria-stauffenberg', name: 'Eva-Maria Stauffenberg', bestaetigt: false, gruppe: 'verwaltung', standorte: [KUDAMM], alteAdressen: ['/eva-maria-stauffenberg/'] },
  { slug: 'jutta-pueschel', name: 'Jutta Püschel', bestaetigt: false, gruppe: 'verwaltung', standorte: [KUDAMM], alteAdressen: ['/jutta-pueschel/'] },
  { slug: 'hazem-genidy', name: 'Hazem Genidy', bestaetigt: false, gruppe: 'verwaltung', standorte: [KUDAMM], alteAdressen: ['/hazem-genidy/'] },
  { slug: 'doreen-ziliox', name: 'Doreen Ziliox', bestaetigt: false, gruppe: 'empfang', standorte: [KUDAMM], alteAdressen: ['/doreen-ziliox/', '/telefon-service/doreen-ziliox/'] },
  { slug: 'caecilia-mickel', name: 'Cäcilia Mickel', bestaetigt: false, gruppe: 'empfang', standorte: [KUDAMM], alteAdressen: ['/caecilia-mickel/'] },
];

/**
 * Nur bestätigte Einträge gehen auf die Website.
 *
 * Diese eine Funktion ist der Unterschied zwischen "wir haben Daten" und "wir
 * veröffentlichen Daten". Solange niemand bestätigt hat, dass die Person noch
 * da ist und ihr Name so geschrieben wird, bleibt die Teamseite leer statt
 * falsch. Leer ist ein sichtbarer Mangel; falsch merkt niemand.
 */
export function veroeffentlichbar(): TeamMitglied[] {
  return TEAM.filter((m) => m.bestaetigt);
}

// ─────────────────────── Automatische Zählung ───────────────────────

/**
 * Alle Zahlen über das Team werden GERECHNET, nicht gepflegt.
 *
 * Vorher stand in standorte.ts ein Feld `anzahlZahnaerzte: 21`. Solche Zahlen
 * altern lautlos: Jemand kommt dazu, die Personenseite wird angelegt, und die
 * 21 auf der Standortseite, in der Meta-Description, im Vorschaubild und in
 * der Auskunft des Chatbots bleibt stehen. Niemand merkt es, weil niemand
 * nachzählt.
 *
 * Ab jetzt ändern sich diese Zahlen überall mit, sobald jemand eingetragen
 * oder entfernt wird – auch aus dem geplanten Standort-Dashboard heraus, das
 * dafür nichts weiter tun muss, als diese Liste zu pflegen.
 */
export function teamAn(standortSlug: string): TeamMitglied[] {
  return veroeffentlichbar().filter((m) => m.standorte.includes(standortSlug));
}

export function anzahlAn(standortSlug: string, gruppe?: Teamgruppe): number {
  const liste = teamAn(standortSlug);
  return gruppe ? liste.filter((m) => m.gruppe === gruppe).length : liste.length;
}

/** Behandelnde: Zahnärztinnen und Zahnärzte plus Dentalhygiene. */
export function anzahlBehandelnde(standortSlug: string): number {
  return teamAn(standortSlug).filter(
    (m) => m.gruppe === 'zahnaerzte' || m.gruppe === 'dentalhygiene',
  ).length;
}

/** Gesamtzahl über alle Standorte, ohne Doppelzählung bei Mehrfacheinsatz. */
export function anzahlGesamt(gruppe?: Teamgruppe): number {
  const liste = veroeffentlichbar();
  return gruppe ? liste.filter((m) => m.gruppe === gruppe).length : liste.length;
}

export function gruppenAn(
  standortSlug: string,
): { gruppe: Teamgruppe; name: string; mitglieder: TeamMitglied[] }[] {
  const reihenfolge: Teamgruppe[] = [
    'zahnaerzte',
    'dentalhygiene',
    'prophylaxe',
    'assistenz',
    'empfang',
    'verwaltung',
    'ausbildung',
  ];
  const hier = teamAn(standortSlug);
  return reihenfolge
    .map((gruppe) => ({
      gruppe,
      name: GRUPPENNAMEN[gruppe],
      mitglieder: hier.filter((m) => m.gruppe === gruppe),
    }))
    .filter((g) => g.mitglieder.length > 0);
}

export function getMitglied(slug: string): TeamMitglied | undefined {
  return TEAM.find((m) => m.slug === slug);
}

/** Wie viele Einträge noch auf ihre Bestätigung warten. */
export function offeneNamen(): number {
  return TEAM.filter((m) => !m.bestaetigt).length;
}

/** Für den Datenwächter: zeigen alle Standortangaben auf echte Standorte? */
export function ungueltigeStandorte(): { slug: string; standort: string }[] {
  return TEAM.flatMap((m) =>
    m.standorte
      .filter((s) => !STANDORT_SLUGS.includes(s))
      .map((standort) => ({ slug: m.slug, standort })),
  );
}
