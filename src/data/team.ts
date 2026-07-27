/**
 * Team je Standort.
 *
 * ── Woher diese Daten stammen ───────────────────────────────────────────
 *
 * Aus zwei Quellen, die sich gegenseitig ergänzen und die
 * `analyse/altbestand/team-zusammenfuehren.mjs` zusammengeführt hat:
 *
 * 1. Der Teamübersicht der laufenden Website (ku64.de/team/). Sie liefert die
 *    Schreibweise, wie die Praxis sie selbst führt – „Zeynep Çınar“, nicht
 *    „cigdem-korur“ –, dazu Funktion, Standort und Porträt. Das ist keine
 *    Rekonstruktion, sondern die Veröffentlichung des Kunden selbst.
 *
 * 2. Den Weiterleitungsregeln der alten .htaccess. Sie kennen die früheren
 *    Adressen der Personenseiten. Die müssen weiter ankommen, auch wenn die
 *    Person die Praxis verlassen hat: Suchtreffer und Lesezeichen bleiben
 *    Jahre bestehen.
 *
 * ── Warum `bestaetigt` geblieben ist ────────────────────────────────────
 *
 * Vierzig Einträge aus der Rekonstruktion stehen heute nicht mehr auf der
 * Teamseite des Kunden. Die wahrscheinlichste Erklärung ist die einfachste:
 * Diese Kolleginnen und Kollegen arbeiten dort nicht mehr. Sie stehen
 * weiterhin in dieser Datei, aber mit `bestaetigt: false` – dadurch
 * erscheinen sie nirgends auf der Website, ihre alten Adressen lassen sich
 * aber weiter umleiten.
 *
 * Der umgekehrte Fall wäre der schlimmere: Wer nicht mehr da ist, aber im
 * Team steht, wird von Patientinnen angefragt.
 *
 * ── Was weiterhin fehlt ─────────────────────────────────────────────────
 *
 * Sprachen und Schwerpunkte als verlinkbare Leistungs-Slugs; die
 * Funktionsbezeichnungen sind übernommen, wie sie dort stehen. Zu Wilmersdorf
 * gibt es überhaupt keine Teamangaben – die KiezPraxis hat auf der alten
 * Teamseite keinen eigenen Abschnitt.
 *
 * Rechtlicher Hinweis: Fotos und Namen brauchen die Einwilligung der
 * abgebildeten Personen (Art. 6 Abs. 1 lit. a DSGVO, § 22 KunstUrhG). Sie
 * liegt für die Veröffentlichung auf der Praxis-Website vor – dieselbe
 * Veröffentlichung, die hier fortgeführt wird. Titel wie „Spezialistin für …“
 * sind übernommen wie vom Kunden geführt; ob die Qualifikation so benannt
 * werden darf, entscheidet die Praxis, nicht diese Datei.
 */

import { STANDORT_SLUGS } from './standorte.ts';

export type Teamgruppe =
  | 'zahnaerzte'
  | 'dentalhygiene'
  | 'prophylaxe'
  | 'assistenz'
  | 'empfang'
  | 'beratung'
  | 'verwaltung'
  | 'ausbildung';

export const GRUPPENNAMEN: Record<Teamgruppe, string> = {
  zahnaerzte: 'Zahnärztinnen und Zahnärzte',
  dentalhygiene: 'Dentalhygiene',
  prophylaxe: 'Prophylaxe',
  assistenz: 'Assistenz',
  empfang: 'Empfang und Service',
  /* Eigene Gruppe, weil die Tätigkeit weder Behandlung noch Verwaltung ist:
     Beratung zu Zahnästhetik und Koordination der digitalen Planung. */
  beratung: 'Beratung und Koordination',
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
  /** z. B. 'Zahnärztin', 'Fachzahnarzt für Oralchirurgie'. Aus der Datenbank nachzutragen. */
  funktion?: string;
  /**
   * Steht innerhalb der eigenen Gruppe an erster Stelle.
   *
   * Für die medizinische Leitung eines Standorts. Nicht als Rangordnung
   * gedacht, sondern als Orientierung: Wer an einem Standort etwas klären
   * will, sucht zuerst die Person, die dort verantwortlich ist.
   */
  leitung?: boolean;
  /** Leistungs-Slugs als Schwerpunkte – erzeugt automatisch Querverlinkung. */
  schwerpunkte?: string[];
  sprachen?: string[];
  /**
   * Liegt ein Porträt unter `public/team/<slug>.jpg`?
   *
   * Nur ein Schalter, kein Pfad: Der Eintrag im Bildverzeichnis entsteht in
   * `src/lib/bilder.ts` aus genau diesen Daten. Ein Pfad an dieser Stelle
   * wäre eine zweite Wahrheit, die irgendwann von der ersten abweicht.
   */
  portraet?: boolean;
  vorstellung?: string;
  /** Frühere Adressen dieser Person, die weiterhin ankommen müssen. */
  alteAdressen?: string[];
}

/**
 * Die Belegschaft.
 *
 * Sortiert nach Standort und innerhalb dessen nach Gruppe – dieselbe
 * Reihenfolge, in der die Teamseite sie ausgibt. Erzeugt von
 * `analyse/altbestand/team-zusammenfuehren.mjs`; Änderungen von Hand sind
 * ausdrücklich erlaubt, das Skript liest den Stand jedes Mal neu ein.
 *
 * Standortzuordnung: aus den Abschnitten der Teamübersicht des Kunden. Wer
 * dort in zwei Abschnitten steht, arbeitet an zwei Standorten – bei den
 * Gründern und den Oralchirurgen ist das so.
 */
export const TEAM: TeamMitglied[] = [

  // ══ berlin-charlottenburg ═══════════════════════════════════════

  // ── zahnaerzte ──
  { slug: 'abby-ferguson', name: 'Abby Ferguson', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'Kinder- und Jugendzahnärztin', portraet: true, alteAdressen: ['/team/zahnaerzte/abby-ferguson/'] },
  { slug: 'alexandra-fischer', name: 'Alexandra Fischer', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'Zahnärztin für Zahnästhetik & Sportzahnmedizin', portraet: true, alteAdressen: ['/team/zahnaerzte/alexandra-fischer/'] },
  { slug: 'amjad-misherqi', name: 'Amjad Misherqi', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'Fachzahnarzt für Kieferorthopädie', portraet: true, alteAdressen: ['/team/zahnaerzte/amjad-misherqi/'] },
  { slug: 'clara-constanze-meinberg', name: 'Clara-Constanze Meinberg', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'Zahnärztin und Heilpraktikerin', portraet: true, alteAdressen: ['/team/zahnaerzte/clara-constanze-meinberg/'] },
  { slug: 'dr-alexandra-wolf', name: 'Dr. Alexandra Wolf', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'Kinder- und Jugendzahnärztin', portraet: true, alteAdressen: ['/team/zahnaerzte/dr-alexandra-wolf/'] },
  { slug: 'dr-andrej-knezevic', name: 'Dr. Andrej Knezevic', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'Zahnarzt für restaurative und prothetische Zahnheilkunde bei KU64 Berlin', portraet: true, alteAdressen: ['/team/zahnaerzte/dr-andrej-knezevic/'] },
  { slug: 'dr-frank-schreiber', name: 'Dr. Frank Schreiber', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'Zahnarzt für Ästhetik und Endodontologie', portraet: true, alteAdressen: ['/team/zahnaerzte/dr-frank-schreiber/'] },
  { slug: 'dr-heike-hoppe-zirbs', name: 'Dr. Heike Hoppe-Zirbs', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'Fachzahnärztin für Kieferorthopädie', portraet: true, alteAdressen: ['/team/zahnaerzte/dr-heike-hoppe-zirbs/'] },
  { slug: 'dr-isabella-piekos', name: 'Dr. Isabella Piekos', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'Fachzahnärztin für Kieferorthopädie', portraet: true, alteAdressen: ['/team/zahnaerzte/dr-isabella-piekos/'] },
  { slug: 'dr-jonathan-botmann', name: 'Dr. Jonathan Botmann', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'Zahnarzt für Allgemeine & Ästhetische Zahnmedizin, Implantologie (i.A.)', portraet: true, alteAdressen: ['/team/zahnaerzte/dr-jonathan-botmann/'] },
  { slug: 'dr-karin-loeer', name: 'Dr. Karin Löer', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'zertifizierte Zahnärztin für Zahnästhetik', portraet: true, alteAdressen: ['/team/zahnaerzte/dr-karin-loeer/'] },
  { slug: 'dr-med-dent-eric-paul-oehme', name: 'Dr. med. dent. Eric Paul Oehme M.Sc. M.Sc.', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'Zahnarzt für allgemeine Zahnmedizin & Zahnästhetik', portraet: true, alteAdressen: ['/team/zahnaerzte/dr-med-dent-eric-paul-oehme/'] },
  { slug: 'mohamed-abudrya', name: 'Dr. Mohamed Abudrya M.Sc.', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'Kinder- und Jugendzahnarzt', portraet: true, alteAdressen: ['/team/zahnaerzte/mohamed-budrya/', '/team/zahnaerzte/mohamed-abudrya/'] },
  { slug: 'dr-sabine-gousetis', name: 'Dr. Sabine Gousetis', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'Spezialistin für Endodontologie der DGET', portraet: true, alteAdressen: ['/team/zahnaerzte/dr-sabine-gousetis/'] },
  /* Nur am Kurfürstendamm. Die Teamübersicht des Kunden führte ihn auch
     unter Potsdam auf – gemeint ist die Rolle als Gründer, nicht die
     Behandlung vor Ort. Wer in Potsdam nach seiner Behandlerin sucht, soll
     die Menschen sehen, die dort behandeln. */
  { slug: 'dr-stephan-ziegler', name: 'Dr. Stephan Ziegler', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'Geschäftsführender Gründungspartner', portraet: true, alteAdressen: ['/team/zahnaerzte/dr-stephan-ziegler/'] },
  { slug: 'dr-surian-herrmann', name: 'Dr. Surian Herrmann', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'Fachzahnarzt für Oralchirurgie mit Schwerpunkt Implantologie & Leiter der Oralchirurgie', portraet: true, alteAdressen: ['/team/zahnaerzte/dr-surian-herrmann/'] },
  { slug: 'erny-grundmann', name: 'Erny Grundmann, MPH, M.Sc.', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'Kinder- und Jugendzahnärztin', portraet: true, alteAdressen: ['/team/zahnaerzte/erny-grundmann/'] },
  { slug: 'inke-supantia', name: 'Inke Supantia', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'Kinder- und Jugendzahnärztin', portraet: true, alteAdressen: ['/team/zahnaerzte/inke-supantia/'] },
  { slug: 'jackeline-schaupp', name: 'Jackeline Schaupp', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'Kinder- und Jugendzahnheilkunde', portraet: true, alteAdressen: ['/team/zahnaerzte/jackeline-schaupp/'] },
  { slug: 'jargalmaa-kleister', name: 'Jargalmaa Kleister', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'Zahnärztin mit Schwerpunkt Zahnästhetik', portraet: true, alteAdressen: ['/team/zahnaerzte/jargalmaa-kleister/'] },
  { slug: 'jiotis-hondralis', name: 'Jiotis Hondralis M.Sc.', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg', 'potsdam'], funktion: 'Zahnarzt & Fachzahnarzt für Oralchirurgie Master of Science in Oral Implantology & Periodontology', portraet: true, alteAdressen: ['/jiotis-hondralis/', '/team/zahnaerzte/jiotis-hondralis/'] },
  { slug: 'juliane-kottenhagen', name: 'Juliane Kottenhagen', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'Zahnärztin und Praxispartnerin', portraet: true, alteAdressen: ['/team/zahnaerzte/juliane-kottenhagen/'] },
  { slug: 'juliane-reichmuth', name: 'Juliane Reichmuth', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'Kinder- und Jugendzahnärztin', portraet: true, alteAdressen: ['/team/zahnaerzte/juliane-reichmuth/'] },
  { slug: 'lais-haidari', name: 'Lais Haidari', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'Zahnarzt für Ästhetik und Prothetik', portraet: true, alteAdressen: ['/team/zahnaerzte/lais-haidari/'] },
  { slug: 'samaneh-salehipour', name: 'Samaneh Salehipour', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'Zahnärztin für Zahnästhetik & Prothetik', portraet: true, alteAdressen: ['/team/bleaching-kosmetik-shop/samaneh-salehipour/', '/team/zahnaerzte/samaneh-salehipour/'] },
  { slug: 'tim-walter', name: 'Tim Walter', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'Zahnarzt für Zahnästhetik', portraet: true, alteAdressen: ['/team/zahnaerzte/tim-walter/'] },
  { slug: 'tsong-ung-an', name: 'Tsong-Ung An', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], funktion: 'Zahnarzt & Praxispartner', portraet: true, alteAdressen: ['/team/zahnaerzte/tsong-ung-an/'] },

  // ── dentalhygiene ──
  { slug: 'adina-mauder', name: 'Adina Mauder', bestaetigt: true, gruppe: 'dentalhygiene', standorte: ['berlin-charlottenburg'], funktion: 'Dentalhygienikerin und zertifizierte EMS GBT Prophyloaxe-Trainerin', portraet: true, alteAdressen: ['/team/dentalhygieniker/adina-mauder/'] },
  { slug: 'aisegkioul-netzipoglou-housein', name: 'Aisegkioul Netzipoglou-Housein', bestaetigt: true, gruppe: 'dentalhygiene', standorte: ['berlin-charlottenburg'], funktion: 'Dentalhygienikerin mit über 15 Jahren Erfahrung in München und Berlin', portraet: true, alteAdressen: ['/team/dentalhygieniker/aisegkioul-netzipoglou-housein/'] },
  { slug: 'atoosa-hafezi', name: 'Atoosa Hafezi', bestaetigt: true, gruppe: 'dentalhygiene', standorte: ['berlin-charlottenburg'], funktion: 'Dentalhygienikerin, Bachelor of Science Dentalhygiene und Präventionsmanagement, B.Sc.', portraet: true, alteAdressen: ['/team/dentalhygieniker/atoosa-hafezi/'] },
  { slug: 'edin-plavsic', name: 'Edin Plavsic', bestaetigt: true, gruppe: 'dentalhygiene', standorte: ['berlin-charlottenburg'], funktion: 'Dentalhygieniker, Bachelor of Science Dentalhygiene und Präventionsmanagement, B.Sc.', portraet: true, alteAdressen: ['/team/prophylaxe/edin-plavsic/', '/team/dentalhygieniker/edin-plavsic/'] },
  { slug: 'malou-fricke', name: 'Malou Fricke', bestaetigt: true, gruppe: 'dentalhygiene', standorte: ['berlin-charlottenburg'], funktion: 'Dentalhygienekerin & Präventionsmanagerin', portraet: true, alteAdressen: ['/team/dentalhygieniker/malou-fricke/'] },
  { slug: 'michaela-kunkel', name: 'Michaela Kunkel', bestaetigt: true, gruppe: 'dentalhygiene', standorte: ['berlin-charlottenburg'], funktion: 'Dentalhygienikerin', portraet: true, alteAdressen: ['/team/dentalhygieniker/michaela-kunkel/'] },

  // ── prophylaxe ──
  { slug: 'alisar-lala', name: 'Alisar Lala', bestaetigt: true, gruppe: 'prophylaxe', standorte: ['berlin-charlottenburg'], funktion: 'Prophylaxespezialistin für Kinder & Erwachsene', portraet: true, alteAdressen: ['/team/prophylaxe/alisar-lala/'] },
  { slug: 'amar-alrejebi', name: 'Amar Alrejebi – Zahnarzt & Zahnmedizinischer Prophylaxeassistent', bestaetigt: true, gruppe: 'prophylaxe', standorte: ['berlin-charlottenburg'], funktion: 'Zahnarzt & Parodontitis- und Prophylaxeexperte', portraet: true, alteAdressen: ['/team/prophylaxe/amar-alrejebi/'] },
  { slug: 'bettina-ehrhardt', name: 'Bettina Ehrhardt', bestaetigt: true, gruppe: 'prophylaxe', standorte: ['berlin-charlottenburg'], funktion: 'Zahnmedizinische Prophylaxeassistentin', portraet: true, alteAdressen: ['/team/prophylaxe/bettina-ehrhardt/'] },
  { slug: 'emma-gloria-findeisen', name: 'Emma-Gloria Findeisen', bestaetigt: true, gruppe: 'prophylaxe', standorte: ['berlin-charlottenburg'], funktion: 'Zahnmedizinische Prophylaxeassistentin und Bleachingspezialistin', portraet: true, alteAdressen: ['/team/bleaching/emma-gloria-findeisen/'] },
  { slug: 'ievgeniia-nevzgoda', name: 'Ievgeniia Nevzgoda', bestaetigt: true, gruppe: 'prophylaxe', standorte: ['berlin-charlottenburg'], funktion: 'Zahnärztin & Prophylaxeexpertin', portraet: true, alteAdressen: ['/team/prophylaxe/ievgeniia-nevzgoda/'] },
  { slug: 'jessica-oberlaender', name: 'Jessica Oberländer', bestaetigt: true, gruppe: 'prophylaxe', standorte: ['berlin-charlottenburg'], funktion: 'zahnmedizinische Prophylaxeassistentin', portraet: true, alteAdressen: ['/team/prophylaxe/jessica-oberlaender/'] },
  { slug: 'karin-wagner', name: 'Karin Wagner', bestaetigt: true, gruppe: 'prophylaxe', standorte: ['berlin-charlottenburg'], funktion: 'Zahnmedizinische Prophylaxeassistentin', portraet: true, alteAdressen: ['/team/prophylaxe/karin-wagner/'] },
  { slug: 'kevin-cords', name: 'Kevin Cords', bestaetigt: true, gruppe: 'prophylaxe', standorte: ['berlin-charlottenburg'], funktion: 'angehender zahnmedizinischer Prophylaxeassistent und Bleachingspezialist', portraet: true, alteAdressen: ['/team/prophylaxe/kevin-cords/'] },
  { slug: 'maryam-karimi', name: 'Maryam Karimi', bestaetigt: true, gruppe: 'prophylaxe', standorte: ['berlin-charlottenburg'], funktion: 'Zahnmedizinische Prophylaxeassistentin und Bleachingspezialistin', portraet: true, alteAdressen: ['/team/bleaching/maryam-karimi/'] },
  { slug: 'melanie-ruedel', name: 'Melanie Rüdel', bestaetigt: true, gruppe: 'prophylaxe', standorte: ['berlin-charlottenburg'], funktion: 'Zahnmedizinische Prophylaxeassistentin & Bleachingspezialistin', portraet: true, alteAdressen: ['/team/prophylaxe/melanie-ruedel/'] },
  { slug: 'melissa-albalizade', name: 'Melissa Albalizade', bestaetigt: true, gruppe: 'prophylaxe', standorte: ['berlin-charlottenburg'], funktion: 'Prophylaxeexpertin für Kids und Erwachsene & Bleachingspezialistin', portraet: true, alteAdressen: ['/team/bleaching/melissa-albalizade/'] },
  { slug: 'nicole-dickhoff-kranz', name: 'Nicole Dickhoff-Kranz', bestaetigt: true, gruppe: 'prophylaxe', standorte: ['berlin-charlottenburg'], funktion: 'Zahnmedizinische Prophylaxeassistentin', portraet: true, alteAdressen: ['/team/prophylaxe/nicole-dickhoff-franz/', '/team/prophylaxe/nicole-dickhoff-kranz/'] },
  { slug: 'nicole-lindenau', name: 'Nicole Lindenau', bestaetigt: true, gruppe: 'prophylaxe', standorte: ['berlin-charlottenburg'], funktion: 'Zahnmedizinische Prophylaxeassistentin', portraet: true, alteAdressen: ['/team/prophylaxe/nicole-lindenau/'] },
  { slug: 'ricco-molkentin', name: 'Ricco Molkentin', bestaetigt: true, gruppe: 'prophylaxe', standorte: ['berlin-charlottenburg'], funktion: 'Prophylaxeshop-Leiter & Prophylaxekoordination', portraet: true, alteAdressen: ['/team/bleaching/ricco-molkentin/'] },
  { slug: 'zeynep-cinar', name: 'Zeynep Çınar', bestaetigt: true, gruppe: 'prophylaxe', standorte: ['berlin-charlottenburg'], funktion: 'Zahnärztin · Parodontitis- & Prophylaxeexpertin', portraet: true, alteAdressen: ['/team/prophylaxe/zeynep-cinar/'] },

  // ── beratung ──
  { slug: 'viktoria-genkel', name: 'Viktoria Genkel', bestaetigt: true, gruppe: 'beratung', standorte: ['berlin-charlottenburg'], funktion: 'Dentalberaterin & Digital Smile Design Koordinatorin', portraet: true, alteAdressen: ['/team/dsd-koordination-dentalberatung/viktoria-genkel/'] },

  // ── assistenz ──
  { slug: 'adrianna-targatz', name: 'Adrianna Targatz', bestaetigt: true, gruppe: 'assistenz', standorte: ['berlin-charlottenburg'], funktion: 'Stellvertretende Leitung ZFA/Azubis & Human Resources Assistant (Recruiting)', portraet: true, alteAdressen: ['/team/human-resources/adrianna-targatz/'] },
  { slug: 'anja-baranowsky', name: 'Anja Baranowsky', bestaetigt: true, gruppe: 'assistenz', standorte: ['berlin-charlottenburg'], funktion: 'Chirurgische und Implantologische Fachassistenz & Bleachingspezialistin', portraet: true, alteAdressen: ['/team/bleaching/anja-baranowsky/'] },
  { slug: 'cheyenne-bande', name: 'Cheyenne Bande', bestaetigt: true, gruppe: 'assistenz', standorte: ['berlin-charlottenburg'], funktion: 'Zahnmedizinische Fachangestellte (ZFA)', portraet: true, alteAdressen: ['/team/zahnmedizinische-fachangestellte/cheyenne-bande/'] },
  { slug: 'dominik-ruffo', name: 'Dominik Ruffo', bestaetigt: true, gruppe: 'assistenz', standorte: ['berlin-charlottenburg'], funktion: 'Fachwirt für zahnmedizinisches Praxismanagement, Floormanager & KU64-Ausbilder', portraet: true, alteAdressen: ['/team/zahnmedizinische-fachangestellte/dominik-ruffo/'] },
  { slug: 'eugenia-nicoleta-dutu', name: 'Eugenia Nicoleta Dutu', bestaetigt: true, gruppe: 'assistenz', standorte: ['berlin-charlottenburg'], funktion: 'Zahnmedizinische Fachangestellte', portraet: true, alteAdressen: ['/auszubildende/eugenia-nicoleta-dutu/', '/team/zahnmedizinische-fachangestellte/eugenia-nicoleta-dutu/'] },
  { slug: 'kim-jasmin-yudaev', name: 'Kim Jasmin Yudaev', bestaetigt: true, gruppe: 'assistenz', standorte: ['berlin-charlottenburg'], funktion: 'Zahnmedizinische Fachangestellte & angehende Zahnmedizinische Prophylaxeassistentin', portraet: true, alteAdressen: ['/team/prophylaxe/kim-jasmin-yudaev/'] },
  { slug: 'liana-noack', name: 'Liana Noack', bestaetigt: true, gruppe: 'assistenz', standorte: ['berlin-charlottenburg'], funktion: 'Fachkraft für Medizinprodukteaufbereitung', portraet: true, alteAdressen: ['/team/sterilisation-qm/liana-noack/'] },
  { slug: 'lisbany-martinez-cubillas', name: 'Lisbany Martinez Cubillas', bestaetigt: true, gruppe: 'assistenz', standorte: ['berlin-charlottenburg'], funktion: 'OP-Manager, Zahnmedizinischer Fachangestellter & Anästhesietechnischer Assistent', portraet: true, alteAdressen: ['/team/zahnmedizinische-fachangestellte/lisbany-martinez-cubillas/'] },
  { slug: 'lulu-buerger', name: 'Lulu Bürger', bestaetigt: true, gruppe: 'assistenz', standorte: ['berlin-charlottenburg'], funktion: 'ZFA-Leitung & Ausbildungsbeauftragte, Personalmanagerin (IHK)', portraet: true, alteAdressen: ['/lulu-buerger/', '/team/human-resources/lulu-buerger/'] },
  { slug: 'lysann-kosiol', name: 'Lysann Kosiol', bestaetigt: true, gruppe: 'assistenz', standorte: ['berlin-charlottenburg'], funktion: 'Zahnmedizinische Fachangestellte, Prophylaxe- und Bleachingspezialistin', portraet: true, alteAdressen: ['/team/bleaching/lysann-kosiol/'] },
  { slug: 'marlies-vlahek', name: 'Marlies Vlahek', bestaetigt: true, gruppe: 'assistenz', standorte: ['berlin-charlottenburg'], funktion: 'Kieferorthopädische Fachangestellte (ZFA)', portraet: true, alteAdressen: ['/team/zahnmedizinische-fachangestellte/marlies-vlahek/'] },
  { slug: 'monika-kuckelt', name: 'Monika Kuckelt', bestaetigt: true, gruppe: 'assistenz', standorte: ['berlin-charlottenburg'], funktion: 'Zahnmedizinische Fachangestellte und Sterilgutbeauftragte', portraet: true, alteAdressen: ['/team/sterilisation-qm/monika-kuckelt/'] },
  { slug: 'steffi-kohl', name: 'Steffi Kohl', bestaetigt: true, gruppe: 'assistenz', standorte: ['berlin-charlottenburg'], funktion: 'Zahnmedizinische Fachangestellte (ZFA)', portraet: true, alteAdressen: ['/team/zahnmedizinische-fachangestellte/steffi-kohl/'] },

  // ── empfang ──
  { slug: 'angie-skall', name: 'Angie Skall', bestaetigt: true, gruppe: 'empfang', standorte: ['berlin-charlottenburg'], funktion: 'Zahnmedizinische Fachangestellte +Telefon & Service', portraet: true, alteAdressen: ['/angie-skall/', '/team/assistenzen/angie-skall/', '/team/telefon-service/angie-skall/'] },
  { slug: 'doreen-ziliox', name: 'Doreen Ziliox', bestaetigt: true, gruppe: 'empfang', standorte: ['berlin-charlottenburg'], funktion: 'Telefon & Patienten­service', portraet: true, alteAdressen: ['/doreen-ziliox/', '/telefon-service/doreen-ziliox/', '/team/telefon-service/doreen-ziliox/'] },
  { slug: 'magnus-salecker', name: 'Magnus Salecker', bestaetigt: true, gruppe: 'empfang', standorte: ['berlin-charlottenburg'], funktion: 'Zahnmedizinischer Fachangestellter', portraet: true, alteAdressen: ['/team/telefon-service/magnus-salecker/'] },

  // ── verwaltung ──
  { slug: 'delphine-martineau-rewig', name: 'Delphine Martineau-Rewig', bestaetigt: true, gruppe: 'verwaltung', standorte: ['berlin-charlottenburg'], funktion: 'People Operations Manager', portraet: true, alteAdressen: ['/team/human-resources/delphine-martineau-rewig/'] },
  { slug: 'denise-matzas', name: 'Denise Matzas', bestaetigt: true, gruppe: 'verwaltung', standorte: ['berlin-charlottenburg'], funktion: 'Zahnmedizinische Verwaltungsassistentin', portraet: true, alteAdressen: ['/team/verwaltung/denise-matzas/'] },
  { slug: 'ina-lehmann', name: 'Ina Lehmann', bestaetigt: true, gruppe: 'verwaltung', standorte: ['berlin-charlottenburg'], funktion: 'Assistentin der KU64-Geschäftsleitung und Leitung Rezeption, Telefon & Patientenservice', portraet: true, alteAdressen: ['/ina-lehmann/', '/team/rezeption-service/ina-lehmann/'] },
  { slug: 'joana-charlott-radsack', name: 'Joana Charlott Radsack', bestaetigt: true, gruppe: 'verwaltung', standorte: ['berlin-charlottenburg'], funktion: 'Staatlich geprüfte Kosmetikerin & Matrix Spezialistin. Leistungen: Gesichtsbehandlung, Maniküre, Pediküre und mehr', portraet: true, alteAdressen: ['/team/bleaching-kosmetik-shop/joana-charlott-radsack/'] },
  { slug: 'marcel-baer', name: 'Marcel Baer', bestaetigt: true, gruppe: 'verwaltung', standorte: ['berlin-charlottenburg'], funktion: 'IT & Technik', portraet: true, alteAdressen: ['/team/it-technik/marcel-baer/'] },
  { slug: 'michaela-dulz', name: 'Michaela Dulz', bestaetigt: true, gruppe: 'verwaltung', standorte: ['berlin-charlottenburg'], funktion: 'Kieferorthopädische Fachangestellte & KFO-Verwaltung', portraet: true, alteAdressen: ['/team/verwaltung/michaela-dulz/'] },
  { slug: 'patricia-willer', name: 'Patricia Willer', bestaetigt: true, gruppe: 'verwaltung', standorte: ['berlin-charlottenburg'], funktion: 'Zahnmedizinische Verwaltungsassistentin in der Kids-Abteilung', portraet: true, alteAdressen: ['/team/verwaltung/patricia-willer/'] },
  { slug: 'petros-prontis', name: 'Petros Prontis', bestaetigt: true, gruppe: 'verwaltung', standorte: ['berlin-charlottenburg'], funktion: 'Presse & Kommunikation, Marketing', portraet: true, alteAdressen: ['/team/kommunikation/petros-prontis/'] },
  { slug: 'sabine-kuehnau-falkenau', name: 'Sabine Kühnau-Falkenau', bestaetigt: true, gruppe: 'verwaltung', standorte: ['berlin-charlottenburg'], funktion: 'Leitung Materialeinkauf & -verwaltung', portraet: true, alteAdressen: ['/team/materialverwaltung/sabine-kuehnau-falkenau/'] },
  { slug: 'sandra-mueller', name: 'Sandra Müller', bestaetigt: true, gruppe: 'verwaltung', standorte: ['berlin-charlottenburg'], funktion: 'Zahnmedizinische Verwaltungsassistentin', portraet: true, alteAdressen: ['/team/verwaltung/sandra-mueller/'] },
  { slug: 'susan-feldmann', name: 'Susan Feldmann', bestaetigt: true, gruppe: 'verwaltung', standorte: ['berlin-charlottenburg'], funktion: 'Head of Human Resources', portraet: true, alteAdressen: ['/human-resources/susan-feldmann/', '/team/human-resources/susan-feldmann/'] },
  { slug: 'vivien-zacher', name: 'Vivien Zacher', bestaetigt: true, gruppe: 'verwaltung', standorte: ['berlin-charlottenburg'], funktion: 'Zahnmedizinische Verwaltungsassistentin & Fachwirt für zahnärztliches Praxismanagement', portraet: true, alteAdressen: ['/team/verwaltung/vivien-zacher/'] },

  // ══ berlinmitte ═════════════════════════════════════════════════

  // ── zahnaerzte ──
  { slug: 'dr-cora-betko', name: 'Dr. Cora Betko, M.SC.', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlinmitte'], funktion: 'Zahnärztin für Prothetik & Parodontologie', portraet: true, alteAdressen: ['/team/zahnaerzte/dr-cora-betko/'] },
  { slug: 'dr-jana-huesch', name: 'Dr. Jana Hüsch', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlinmitte'], funktion: 'Zahnärztin mit Schwerpunkt Endodontologie', portraet: true, alteAdressen: ['/team/zahnaerzte/dr-jana-huesch/'] },
  { slug: 'dr-maike-bauer', name: 'Dr. Maike Bauer', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlinmitte'], funktion: 'Zahnärztin für Prothetik & ästhetische Zahn­medizin', portraet: true, alteAdressen: ['/team/zahnaerzte/maike-bauer/', '/team/zahnaerzte/dr-maike-bauer/'] },
  { slug: 'dr-silvia-munoz', name: 'Dr. med. dent. Silvia Muñoz', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlinmitte'], funktion: 'Zahnärztin für Prothetik & ästhetische Zahn­medizin', portraet: true, alteAdressen: ['/team/zahnaerzte/dr-silvia-munoz/'] },
  { slug: 'malte-labonte', name: 'Malte Labonté', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['berlinmitte'], funktion: 'Zahnarzt mit Schwerpunkt Oralchirurgie & Implantologie', portraet: true, alteAdressen: ['/team/zahnaerzte/malte-labonte/'] },

  // ── dentalhygiene ──
  { slug: 'eva-caspers', name: 'Eva Caspers', bestaetigt: true, gruppe: 'dentalhygiene', standorte: ['berlinmitte'], funktion: 'Dentalhygienikerin', portraet: true, alteAdressen: ['/team/dentalhygieniker/eva-caspers/'] },

  // ── prophylaxe ──
  { slug: 'nurcan-sahin', name: 'Nurcan Sahin', bestaetigt: true, gruppe: 'prophylaxe', standorte: ['berlinmitte'], funktion: 'Prophylaxeassistentin & Bleachingspezialistin', portraet: true, alteAdressen: ['/team/prophylaxe/nurcan-sahin/'] },

  // ── empfang ──
  { slug: 'ayca-kilic', name: 'Ayca Kilic', bestaetigt: true, gruppe: 'empfang', standorte: ['berlinmitte'], funktion: 'Empfang, Telefon & Patientenbetreuung', portraet: true, alteAdressen: ['/team/rezeption-service/ayca-kilic/'] },
  { slug: 'sarah-henkel', name: 'Sarah Henkel', bestaetigt: true, gruppe: 'empfang', standorte: ['berlinmitte'], funktion: 'Rezeption & Service', portraet: true, alteAdressen: ['/team/rezeption-service/sarah-henkel/'] },

  // ── verwaltung ──
  { slug: 'lisa-hauk', name: 'Lisa Hauk', bestaetigt: true, gruppe: 'verwaltung', standorte: ['berlinmitte'], funktion: 'Empfang und Patienten­betreuung', portraet: true, alteAdressen: ['/team/rezeption-service/lisa-hauk/'] },

  // ══ potsdam ═════════════════════════════════════════════════════

  // ── zahnaerzte ──
  { slug: 'clara-marlene-schulz', name: 'Clara Marlene Schulz', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['potsdam'], funktion: 'Zahnärztin für allgemeine Zahnheilkunde & Zahnästhetik', portraet: true, alteAdressen: ['/clara-marlene-schulz/', '/team/zahnaerzte/clara-marlene-schulz/'] },
  { slug: 'denise-moldenhauer', name: 'Denise Moldenhauer', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['potsdam'], funktion: 'Zahnärztin für allgemeine Zahnheilkunde & Zahnästhetik', portraet: true, alteAdressen: ['/team/zahnaerzte/denise-moldenhauer/'] },
  { slug: 'dr-anna-lena-zopfs', name: 'Dr. Anna-Lena Zopfs', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['potsdam'], funktion: 'Kinder- und Jugendzahnärztin (aktuell in Mutterschutz)', portraet: true, alteAdressen: ['/team/zahnaerzte/dr-anna-lena-zopfs/'] },
  { slug: 'dr-elisabeth-futterlieb', name: 'Dr. Elisabeth Futterlieb', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['potsdam'], funktion: 'Zahnärztin für Zahnästhetik und Kinder- & Jugendzahnheilkunde und leidenschaftliche Künstlerin', portraet: true, alteAdressen: ['/team/zahnaerzte/dr-elisabeth-futterlieb/'] },
  { slug: 'janna-mitscherling', name: 'Janna Mitscherling-Baumgartner', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['potsdam'], funktion: 'Zahnärztin Master of Science Kieferorthopädie Tätigkeitsschwerpunkt Funktionsdiagnostik und Funktionstherapie (aktuell in Mutterschutz)', portraet: true, alteAdressen: ['/team/zahnaerzte/janna-mitscherling/'] },
  { slug: 'nils-radsack', name: 'Nils Radsack', bestaetigt: true, gruppe: 'zahnaerzte', standorte: ['potsdam'], funktion: 'Zahnarzt für Zahnästhetik und Endodontologie – medizinischer Leiter', leitung: true, portraet: true, alteAdressen: ['/nils-radsack/', '/team/zahnaerzte/nils-radsack/'] },

  // ── prophylaxe ──
  { slug: 'amy-beckmann', name: 'Amy Beckmann', bestaetigt: true, gruppe: 'prophylaxe', standorte: ['potsdam'], funktion: 'Zahnmedizinische Prophylaxeassistentin', portraet: true, alteAdressen: ['/team/prophylaxe/amy-beckmann/'] },
  { slug: 'madeleine-kettner', name: 'Madeleine Kettner', bestaetigt: true, gruppe: 'prophylaxe', standorte: ['potsdam'], funktion: 'Zahnmedizinische Prophylaxeassistentin', portraet: true, alteAdressen: ['/team/prophylaxe/madeleine-kettner/'] },
  { slug: 'saskia-baer', name: 'Saskia Baer', bestaetigt: true, gruppe: 'prophylaxe', standorte: ['potsdam'], funktion: 'Dentalhygienikerin Bachelor of Science Dentalhygiene und Präventionsmanagement, B. Sc.', portraet: true, alteAdressen: ['/team/dentalhygieniker/saskia-baer/'] },

  // ── assistenz ──
  { slug: 'grit-roggelin-henning', name: 'Grit Roggelin-Henning', bestaetigt: true, gruppe: 'assistenz', standorte: ['potsdam'], funktion: 'Zahnmedizinische Fachangestellte & Rezeptionistin', portraet: true, alteAdressen: ['/team/zahnmedizinische-fachangestellte/grit-roggelin-henning/'] },
  { slug: 'huyen-nguyen-dieu', name: 'Huyen Nguyen-Dieu', bestaetigt: true, gruppe: 'assistenz', standorte: ['potsdam'], funktion: 'Zahnmedizinische Fachangestellte & Bleachingspezialistin', portraet: true, alteAdressen: ['/team/zahnmedizinische-fachangestellte/huyen-nguyen-dieu/'] },

  // ── verwaltung ──
  { slug: 'celina-leppin', name: 'Celina Leppin', bestaetigt: true, gruppe: 'verwaltung', standorte: ['potsdam'], funktion: 'Zahnmedizinische Verwaltungsassistentin', portraet: true, alteAdressen: ['/celina-leppin/', '/team/verwaltung/celina-leppin/'] },
  { slug: 'karoline-hansen', name: 'Karoline Hansen', bestaetigt: true, gruppe: 'verwaltung', standorte: ['potsdam'], funktion: 'Zahnmedizinische Verwaltungsassistentin, Praxis- und HR Managerin KU64 Potsdam, Betriebswirtin der Zahnmedizin', portraet: true, alteAdressen: ['/team/human-resources/karoline-hansen/'] },

  // ══ Nicht mehr auf der Teamseite des Kunden ════════════════════
  { slug: 'dr-dr-thorsten-wegner', name: 'Dr. Dr. Thorsten Wegner', bestaetigt: false, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'] },
  { slug: 'dr-rahima-arsalan', name: 'Dr. Rahima Arsalan', bestaetigt: false, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'] },
  { slug: 'dr-birte-habedank', name: 'Dr. Birte Habedank', bestaetigt: false, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg', 'potsdam'] },
  { slug: 'dr-jana-westerhorstmann', name: 'Dr. Jana Westerhorstmann', bestaetigt: false, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], alteAdressen: ['/dr-jana-westerhorstmann/'] },
  { slug: 'ahmet-turan', name: 'Ahmet Turan', bestaetigt: false, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], alteAdressen: ['/ahmet-turan/'] },
  { slug: 'alexandra-sophia-fischer', name: 'Alexandra Sophia Fischer', bestaetigt: false, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], alteAdressen: ['/alexandra-sophia-fischer/'] },
  { slug: 'diana-wald', name: 'Diana Wald', bestaetigt: false, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'] },
  { slug: 'elena-hude', name: 'Elena Hude', bestaetigt: false, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], alteAdressen: ['/elena-hude/'] },
  { slug: 'feras-younes', name: 'Feras Younes', bestaetigt: false, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'] },
  { slug: 'ferry-dickmann', name: 'Ferry Dickmann', bestaetigt: false, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'] },
  { slug: 'frederike-bruening', name: 'Frederike Brüning', bestaetigt: false, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], alteAdressen: ['/team/zahnaerzte/frederike-bruning/'] },
  { slug: 'freya-voge', name: 'Freya Voge', bestaetigt: false, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'] },
  { slug: 'sulmaz-mohammad', name: 'Sulmaz Mohammad', bestaetigt: false, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], alteAdressen: ['/sulmaz-mohammad/'] },
  { slug: 'tommy-bettac', name: 'Tommy Bettac', bestaetigt: false, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'] },
  { slug: 'ute-katja-koenig', name: 'Ute-Katja König', bestaetigt: false, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'] },
  { slug: 'christian-morar', name: 'Christian Morar', bestaetigt: false, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], alteAdressen: ['/team-2/zahnaerzte/christian-morar/'] },
  { slug: 'cigdem-korur', name: 'Cigdem Korur', bestaetigt: false, gruppe: 'zahnaerzte', standorte: ['berlin-charlottenburg'], alteAdressen: ['/teams/cigdem-korur/', '/teams/cigmen-korur/'] },
  { slug: 'dr-anne-moser', name: 'Dr. Anne Moser', bestaetigt: false, gruppe: 'zahnaerzte', standorte: ['potsdam'], alteAdressen: ['/dr-anne-moser-2/'] },
  { slug: 'susan-knickenberg', name: 'Susan Knickenberg', bestaetigt: false, gruppe: 'zahnaerzte', standorte: ['potsdam'] },
  { slug: 'jenny-friedla', name: 'Jenny Friedla', bestaetigt: false, gruppe: 'dentalhygiene', standorte: ['potsdam'], alteAdressen: ['/team/dentalhygieniker/jenny-friedla/'] },
  { slug: 'sarah-sander', name: 'Sarah Sander', bestaetigt: false, gruppe: 'prophylaxe', standorte: ['potsdam'] },
  { slug: 'jennifer-roedel', name: 'Jennifer Rödel', bestaetigt: false, gruppe: 'empfang', standorte: ['berlinmitte'], alteAdressen: ['/rezeption-und-service/jennifer-roedel/', '/berlinmitte/jennifer-roedel/'] },
  { slug: 'peggy-bofinger-hofmann', name: 'Peggy Bofinger-Hofmann', bestaetigt: false, gruppe: 'dentalhygiene', standorte: ['berlin-charlottenburg'] },
  { slug: 'anna-zafarian', name: 'Anna Zafarian', bestaetigt: false, gruppe: 'prophylaxe', standorte: ['berlin-charlottenburg'] },
  { slug: 'jannik-scheurenbrand', name: 'Jannik Scheurenbrand', bestaetigt: false, gruppe: 'prophylaxe', standorte: ['berlin-charlottenburg'], alteAdressen: ['/jannik-scheurenbrand/'] },
  { slug: 'maja-asoska', name: 'Maja Asoska', bestaetigt: false, gruppe: 'prophylaxe', standorte: ['berlin-charlottenburg'] },
  { slug: 'marcellina-dallashaj', name: 'Marcellina Dallashaj', bestaetigt: false, gruppe: 'prophylaxe', standorte: ['berlin-charlottenburg'], alteAdressen: ['/marcellina-dallashaj/'] },
  { slug: 'diana-flint', name: 'Diana Flint', bestaetigt: false, gruppe: 'assistenz', standorte: ['berlin-charlottenburg'] },
  { slug: 'dominik-demski', name: 'Dominik Demski', bestaetigt: false, gruppe: 'assistenz', standorte: ['berlin-charlottenburg'] },
  { slug: 'anka-ulrich', name: 'Anka Ulrich', bestaetigt: false, gruppe: 'verwaltung', standorte: ['berlin-charlottenburg'], alteAdressen: ['/anka-ulrich/'] },
  { slug: 'diane-dobrin', name: 'Diane Dobrin', bestaetigt: false, gruppe: 'verwaltung', standorte: ['berlin-charlottenburg'] },
  { slug: 'jasmin-piontek', name: 'Jasmin Piontek', bestaetigt: false, gruppe: 'verwaltung', standorte: ['berlin-charlottenburg'] },
  { slug: 'jocelyn-ballard', name: 'Jocelyn Ballard', bestaetigt: false, gruppe: 'verwaltung', standorte: ['berlin-charlottenburg'] },
  { slug: 'christian-schuetz', name: 'Christian Schütz', bestaetigt: false, gruppe: 'verwaltung', standorte: ['berlin-charlottenburg'], alteAdressen: ['/team/kommunikation-human-resources/christian-schuetz/'] },
  { slug: 'carola-wantke', name: 'Carola Wantke', bestaetigt: false, gruppe: 'verwaltung', standorte: ['berlin-charlottenburg'], alteAdressen: ['/carola-wantke/'] },
  { slug: 'julia-ressler', name: 'Julia Ressler', bestaetigt: false, gruppe: 'verwaltung', standorte: ['berlin-charlottenburg'], alteAdressen: ['/julia-ressler/'] },
  { slug: 'eva-maria-stauffenberg', name: 'Eva-Maria Stauffenberg', bestaetigt: false, gruppe: 'verwaltung', standorte: ['berlin-charlottenburg'], alteAdressen: ['/eva-maria-stauffenberg/'] },
  { slug: 'jutta-pueschel', name: 'Jutta Püschel', bestaetigt: false, gruppe: 'verwaltung', standorte: ['berlin-charlottenburg'], alteAdressen: ['/jutta-pueschel/'] },
  { slug: 'hazem-genidy', name: 'Hazem Genidy', bestaetigt: false, gruppe: 'verwaltung', standorte: ['berlin-charlottenburg'], alteAdressen: ['/hazem-genidy/'] },
  { slug: 'caecilia-mickel', name: 'Cäcilia Mickel', bestaetigt: false, gruppe: 'empfang', standorte: ['berlin-charlottenburg'], alteAdressen: ['/caecilia-mickel/'] },
];

/**
 * Nur bestätigte Einträge gehen auf die Website.
 *
 * Diese eine Funktion ist der Unterschied zwischen 'wir haben Daten' und 'wir
 * veröffentlichen Daten'. Solange niemand bestätigt hat, dass die Person noch
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
  return veroeffentlichbar()
    .filter((m) => m.standorte.includes(standortSlug))
    /* Die Leitung des Standorts steht vorn – siehe `leitung` im Typ. */
    .sort((a, b) => Number(b.leitung ?? false) - Number(a.leitung ?? false));
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
    'beratung',
    'verwaltung',
    'ausbildung',
  ];
  const hier = teamAn(standortSlug);
  return reihenfolge
    .map((gruppe) => ({
      gruppe,
      name: GRUPPENNAMEN[gruppe],
      /* Leitung zuerst, alles Weitere in der Reihenfolge der Datei. Ein
         stabiler Sortiervergleich, damit sich sonst nichts verschiebt. */
      mitglieder: hier
        .filter((m) => m.gruppe === gruppe)
        .sort((a, b) => Number(b.leitung ?? false) - Number(a.leitung ?? false)),
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
