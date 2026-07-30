/**
 * Leistungskatalog – einzige Quelle für alle Leistungsseiten.
 *
 * Jede Leistung × jeder Standort, an dem sie angeboten wird, ergibt eine eigene
 * URL: /<standort>/leistungen/<leistung>/. Ist eine Leistung an einem Standort
 * nicht verfügbar, wird sie dort NICHT als Seite erzeugt – stattdessen verweist
 * die Standort-Übersicht auf den nächstgelegenen Standort, der sie anbietet.
 *
 * ACHTUNG – fachliche Freigabe steht AUS: Die Texte dieser Datei sind NEU
 * GESCHRIEBEN und bewusst patientenverständlich gehalten. Vor Veröffentlichung
 * müssen sie zahnärztlich geprüft und gegen das Heilmittelwerbegesetz (HWG)
 * abgeglichen werden. Insbesondere Aussagen zu Erfolgsaussichten, Haltbarkeit
 * und Preisen.
 *
 * Das betrifft NICHT die übernommenen Inhalte: Die Beschwerdeseiten
 * (`beschwerden.ts`), die Blogbeiträge, die Personenprofile und die
 * Dentosophie-Seite standen bereits auf ku64.de veröffentlicht und sind damit
 * freigegeben. Einzelne Einträge dieser Datei, die aus dem Altbestand
 * stammen, sind an Ort und Stelle als solche vermerkt.
 *
 * Der Unterschied entscheidet über den Aufwand: 36 neu geschriebene
 * Behandlungstexte zu prüfen ist eine Sitzung, alles zu prüfen wären Wochen.
 *
 * ACHTUNG – Verfügbarkeit: Die Zuordnung `verfuegbar` ist eine begründete
 * Annahme auf Basis der öffentlich auffindbaren Angaben. Falsche Angaben führen
 * Patientinnen und Patienten an den falschen Standort. Vor Live-Gang je Standort
 * bestätigen lassen. Siehe ANALYSE.md, Abschnitt "Offene Datenpunkte".
 */

// Endung bewusst mitgeschrieben: Das Skript scripts/og-bilder.mjs lädt diese
// Datei direkt mit Node (ohne Vite), und Node löst erweiterungslose relative
// Importe in ESM nicht auf.
import { STANDORT_SLUGS } from './standorte.ts';

export interface Kategorie {
  slug: string;
  name: string;
  beschreibung: string;
  /** Reihenfolge in Navigation und Übersichten. */
  rang: number;
}

export interface FaqEintrag {
  frage: string;
  antwort: string;
}

export interface AblaufSchritt {
  titel: string;
  text: string;
  dauer?: string;
}

export interface Leistung {
  slug: string;
  name: string;
  kategorie: string;
  /** Eine Zeile für Karten und Listen. */
  kurz: string;
  /** Zwei bis drei Sätze für Teaser und Meta-Description-Basis. */
  teaser: string;
  /** Begriffe, die Patientinnen und Patienten tatsächlich verwenden.
   *  Dient interner Suche, Chatbot-Abgleich und Longtail-SEO. */
  synonyme: string[];
  /** Die Frage, die jemand wirklich eintippt – wird als H2 und in llms.txt genutzt. */
  patientenfrage: string;
  dauer?: string;
  /** Preisrahmen. Bewusst als Spanne mit Kontext, nie als Festpreis. */
  kosten?: string;
  /** Trägt die gesetzliche Kasse etwas bei? Häufigste Patientenfrage überhaupt. */
  kasse?: string;
  verfuegbar: string[];
  /**
   * Wer diese Behandlung durchführt – Slugs aus `team.ts`.
   *
   * Nur setzen, wo es wirklich an bestimmten Personen hängt. Eine
   * professionelle Zahnreinigung macht das Prophylaxeteam, und die
   * namentliche Aufzählung wäre eine Liste, die bei jeder Einstellung
   * veraltet. Dentosophie dagegen machen zwei Menschen, und wer danach
   * sucht, sucht sie.
   */
  behandler?: string[];
  related: string[];
  ablauf?: AblaufSchritt[];
  faq: FaqEintrag[];
}

export const KATEGORIEN: Kategorie[] = [
  {
    slug: 'vorsorge',
    name: 'Vorsorge & Prophylaxe',
    beschreibung:
      'Alles, was dafür sorgt, dass größere Behandlungen gar nicht erst nötig werden – von der professionellen Zahnreinigung bis zur Früherkennung.',
    rang: 1,
  },
  {
    slug: 'aesthetik',
    name: 'Ästhetische Zahnmedizin',
    beschreibung:
      'Behandlungen, bei denen es um das Aussehen Ihrer Zähne geht: Farbe, Form, Stellung und das Zusammenspiel mit Ihrem Gesicht.',
    rang: 2,
  },
  {
    slug: 'zahnersatz',
    name: 'Zahnersatz',
    beschreibung:
      'Wenn Zahnsubstanz fehlt: Füllungen, Inlays, Kronen, Brücken und Prothesen – gefertigt im eigenen Meisterlabor.',
    rang: 3,
  },
  {
    slug: 'implantologie',
    name: 'Implantologie',
    beschreibung:
      'Künstliche Zahnwurzeln als festes Fundament für einzelne Zähne, Brücken oder einen kompletten Kiefer.',
    rang: 4,
  },
  {
    slug: 'zahnerhalt',
    name: 'Zahnerhalt',
    beschreibung:
      'Den eigenen Zahn retten, statt ihn zu ersetzen – Wurzelkanalbehandlung, Parodontitistherapie und schonende Füllungen.',
    rang: 5,
  },
  {
    slug: 'kieferorthopaedie',
    name: 'Kieferorthopädie',
    beschreibung:
      'Zahnfehlstellungen korrigieren – mit fast unsichtbaren Schienen oder klassischen Spangen, für Kinder und Erwachsene.',
    rang: 6,
  },
  {
    slug: 'chirurgie',
    name: 'Oralchirurgie',
    beschreibung:
      'Operative Eingriffe im Mund: Weisheitszähne, Zahnentfernungen, Knochenaufbau – mit Erfahrung und schonender Technik.',
    rang: 7,
  },
  {
    slug: 'kinder',
    name: 'Kinderzahnheilkunde',
    beschreibung:
      'Zahnmedizin, die Kindern keine Angst macht – von der ersten Kontrolle bis zur Behandlung von Kreidezähnen.',
    rang: 8,
  },
  {
    slug: 'funktion',
    name: 'Funktion & Schmerz',
    beschreibung:
      'Wenn Kiefer, Muskeln und Zähne nicht zusammenspielen: Knirschen, CMD, Kiefergelenkschmerzen und Verspannungen.',
    rang: 9,
  },
  {
    slug: 'angst',
    name: 'Angstfreie Behandlung',
    beschreibung:
      'Für alle, die den Zahnarztbesuch aufschieben: Behandlung in Sedierung, unter Lachgas oder in Vollnarkose.',
    rang: 10,
  },
  {
    /*
     * Gesichtsästhetik – bewusst NICHT unter „Ästhetische Zahnmedizin".
     *
     * Veneers und Bleaching arbeiten am Zahn, Botulinumtoxin und Hyaluron am
     * Gesicht. Das sind zwei Disziplinen mit zwei Ausbildungen, und sie
     * unterliegen verschiedenem Recht: § 11 HWG setzt der Werbung für
     * Faltenbehandlungen engere Grenzen als für zahnmedizinische Leistungen.
     *
     * In einer gemeinsamen Kategorie wäre dieser Unterschied unsichtbar –
     * und die Praxis müsste bei jeder Textänderung selbst daran denken,
     * welche Regel gilt. Getrennt ist es an der Struktur ablesbar.
     */
    slug: 'aesthetik-medizin',
    name: 'Ästhetische Medizin',
    beschreibung:
      'Behandlungen im Gesicht statt am Zahn: Mimikfalten glätten und Volumen zurückgeben – ärztlich durchgeführt, ohne Operation.',
    rang: 11,
  }
];

const ALLE = STANDORT_SLUGS;
const OHNE_KIEZ = ALLE.filter((s) => s !== 'wilmersdorf');
const NUR_KUDAMM = ['berlin-charlottenburg'];
const KUDAMM_POTSDAM = ['berlin-charlottenburg', 'potsdam'];

export const LEISTUNGEN: Leistung[] = [
  // ─────────────────────────── Vorsorge & Prophylaxe ───────────────────────────
  {
    slug: 'professionelle-zahnreinigung',
    name: 'Professionelle Zahnreinigung',
    kategorie: 'vorsorge',
    kurz: 'Gründliche Reinigung dort, wo Zahnbürste und Zahnseide nicht hinkommen.',
    teaser:
      'Bei der professionellen Zahnreinigung entfernen wir Beläge und Verfärbungen an Stellen, die Sie zu Hause nicht erreichen. Das beugt Karies und Zahnfleischentzündungen vor und lässt Ihre Zähne spürbar glatter und heller wirken.',
    synonyme: ['PZR', 'Zahnreinigung', 'Zähne reinigen lassen', 'Zahnsteinentfernung', 'Politur'],
    patientenfrage: 'Wie oft sollte ich eine professionelle Zahnreinigung machen lassen?',
    dauer: '45 bis 60 Minuten',
    kosten: '150 bis 250 € pro Behandlungsstunde, abhängig vom Aufwand',
    kasse:
      'Die gesetzliche Krankenkasse zahlt die PZR in der Regel nicht. Viele Kassen erstatten aber einen Zuschuss über Bonusprogramme – fragen Sie vorab bei Ihrer Kasse nach.',
    verfuegbar: ALLE,
    related: ['prophylaxe-4-0', 'parodontitis-behandlung', 'zahnaufhellung', 'kinderprophylaxe'],
    ablauf: [
      {
        titel: 'Befund und Anfärben',
        text: 'Wir schauen uns Zähne und Zahnfleisch an und färben Beläge sichtbar ein – so sehen Sie selbst, wo es hakt.',
        dauer: '5 Min.',
      },
      {
        titel: 'Beläge entfernen',
        text: 'Weiche und harte Beläge werden mit Pulverstrahl und Ultraschall gelöst – ohne Kratzen mit scharfen Instrumenten.',
        dauer: '25 Min.',
      },
      {
        titel: 'Politur und Fluoridierung',
        text: 'Die Zahnoberflächen werden geglättet und mit Fluorid geschützt. Glatte Flächen laden Bakterien weniger zum Anhaften ein.',
        dauer: '10 Min.',
      },
      {
        titel: 'Beratung für zu Hause',
        text: 'Sie bekommen konkrete Tipps zu Bürste, Technik und Hilfsmitteln – abgestimmt auf das, was wir gefunden haben.',
        dauer: '10 Min.',
      },
    ],
    faq: [
      {
        frage: 'Tut die professionelle Zahnreinigung weh?',
        antwort:
          'In den allermeisten Fällen nicht. Wir arbeiten mit einem Pulverstrahlverfahren statt mit scharfen Handinstrumenten. Wenn Ihr Zahnfleisch entzündet oder Ihre Zahnhälse empfindlich sind, sagen Sie uns Bescheid – dann betäuben wir die Stellen örtlich.',
      },
      {
        frage: 'Wie oft ist eine PZR sinnvoll?',
        antwort:
          'Für die meisten Erwachsenen zweimal im Jahr. Wer zu Zahnfleischentzündungen neigt, raucht, eine Zahnspange trägt oder Implantate hat, profitiert von drei bis vier Terminen pro Jahr. Wir legen den Rhythmus gemeinsam anhand Ihres Befunds fest.',
      },
      {
        frage: 'Werden meine Zähne dadurch weißer?',
        antwort:
          'Ihre Zähne bekommen ihre natürliche Farbe zurück, weil äußere Verfärbungen durch Kaffee, Tee oder Rotwein verschwinden. Heller als Ihre natürliche Zahnfarbe wird es dadurch nicht – dafür ist eine Zahnaufhellung nötig.',
      },
      {
        frage: 'Darf ich danach sofort essen und trinken?',
        antwort:
          'Warten Sie nach der Fluoridierung etwa eine Stunde. Danach empfehlen wir für rund 24 Stunden, stark färbende Lebensmittel wie Rotwein, Kaffee oder Curry zu meiden – die frisch polierten Oberflächen nehmen Farbe zunächst leichter an.',
      },
    ],
  },
  {
    slug: 'prophylaxe-4-0',
    name: 'Prophylaxe 4.0',
    kategorie: 'vorsorge',
    kurz: 'Zahnreinigung nach dem GBT-Protokoll – ohne Kratzen, mit warmem Pulverstrahl.',
    teaser:
      'Prophylaxe 4.0 ist unser Reinigungskonzept nach dem GBT-Protokoll. Statt mit scharfen Handinstrumenten zu schaben, lösen wir Beläge mit einem warmen, feinen Pulverstrahl. Das ist gründlicher, schonender für Zahnschmelz und Zahnfleisch – und für die meisten Menschen deutlich angenehmer.',
    synonyme: ['GBT', 'Guided Biofilm Therapy', 'Airflow', 'EMS', 'sanfte Zahnreinigung'],
    patientenfrage: 'Was ist der Unterschied zwischen Prophylaxe 4.0 und einer normalen Zahnreinigung?',
    dauer: '50 bis 70 Minuten',
    kosten: '170 bis 260 € pro Behandlungsstunde',
    kasse:
      'Als Privatleistung nicht im Katalog der gesetzlichen Kassen enthalten. Private Versicherungen erstatten die Behandlung meist vollständig.',
    verfuegbar: ALLE,
    related: [
      'professionelle-zahnreinigung',
      'parodontitis-behandlung',
      'implantat-prophylaxe',
      ],
    faq: [
      {
        frage: 'Warum ist der Pulverstrahl besser als das klassische Schaben?',
        antwort:
          'Der Pulverstrahl erreicht auch Zahnzwischenräume und Zahnfleischtaschen, in die Handinstrumente schlecht hineinkommen. Gleichzeitig trägt er weniger Zahnhartsubstanz ab. Für Sie fühlt es sich an wie ein warmer Wasserstrahl statt wie Kratzen.',
      },
      {
        frage: 'Ist das auch bei empfindlichen Zähnen geeignet?',
        antwort:
          'Gerade dann. Das verwendete Erythritol-Pulver ist sehr fein und wird mit körperwarmem Wasser aufgetragen. Viele Menschen mit empfindlichen Zahnhälsen empfinden dieses Verfahren als deutlich angenehmer als die klassische Reinigung.',
      },
      {
        frage: 'Funktioniert das auch mit Implantaten, Kronen und Veneers?',
        antwort:
          'Ja. Das Verfahren wurde ausdrücklich auch für Implantatoberflächen und Restaurationen entwickelt und greift Keramik oder Titan nicht an. Sagen Sie uns trotzdem, welche Arbeiten Sie im Mund haben – wir stellen Pulver und Druck entsprechend ein.',
      },
    ],
  },
  {
    slug: 'zahnvorsorge',
    name: 'Vorsorgeuntersuchung',
    kategorie: 'vorsorge',
    kurz: 'Der halbjährliche Kontrolltermin – kurz, schmerzfrei und der beste Schutz vor teuren Behandlungen.',
    teaser:
      'Bei der Vorsorgeuntersuchung prüfen wir Zähne, Zahnfleisch und Schleimhäute systematisch durch. Beginnende Karies und Zahnfleischentzündungen lassen sich so behandeln, solange der Aufwand klein ist – und der Eintrag ins Bonusheft sichert Ihnen höhere Kassenzuschüsse beim Zahnersatz.',
    synonyme: ['Kontrolle', 'Check-up', 'Bonusheft', 'Untersuchung', 'Zahnarzttermin Kontrolle'],
    patientenfrage: 'Was passiert bei der zahnärztlichen Vorsorgeuntersuchung?',
    dauer: '20 bis 30 Minuten',
    kosten: 'Für gesetzlich Versicherte ohne Zuzahlung',
    kasse:
      'Die gesetzliche Krankenkasse übernimmt zwei Vorsorgeuntersuchungen pro Jahr vollständig. Beide Termine gehören ins Bonusheft.',
    verfuegbar: ALLE,
    related: ['professionelle-zahnreinigung', 'karies-behandlung', 'parodontitis-behandlung', 'dvt-3d-roentgen'],
    faq: [
      {
        frage: 'Reicht einmal im Jahr?',
        antwort:
          'Für das Bonusheft genügt bei Erwachsenen ein Termin pro Kalenderjahr. Medizinisch empfehlen wir zwei Termine – Karies und Zahnfleischentzündungen entwickeln sich oft innerhalb weniger Monate und tun lange nicht weh.',
      },
      {
        frage: 'Wird dabei geröntgt?',
        antwort:
          'Nicht routinemäßig. Wir röntgen nur, wenn ein konkreter Verdacht besteht oder die letzte Aufnahme lange zurückliegt – typischerweise alle zwei Jahre. Jede Aufnahme wird Ihnen vorher erklärt und begründet.',
      },
      {
        frage: 'Ich war jahrelang nicht beim Zahnarzt. Bekomme ich Ärger?',
        antwort:
          'Nein. Wir bewerten nicht, wir befunden. Sehr viele Menschen kommen nach langer Pause zu uns, und wir gehen mit Ihnen in Ruhe durch, was jetzt sinnvoll ist – in einer Reihenfolge, die für Sie machbar ist.',
      },
    ],
  },
  {
    slug: 'implantat-prophylaxe',
    name: 'Implantatprophylaxe',
    kategorie: 'vorsorge',
    kurz: 'Spezielle Nachsorge für Implantate – damit sie ein Leben lang halten.',
    teaser:
      'Implantate bekommen keine Karies, können aber ihr Knochenfundament verlieren, wenn sich das Gewebe entzündet. Die Implantatprophylaxe kontrolliert genau das und reinigt die Implantatoberflächen mit dafür geeigneten Instrumenten.',
    synonyme: ['Periimplantitis Vorsorge', 'Implantat Nachsorge', 'Implantatreinigung'],
    patientenfrage: 'Wie pflege ich meine Zahnimplantate richtig?',
    dauer: '45 bis 60 Minuten',
    kosten: '160 bis 260 € je Sitzung',
    kasse: 'Privatleistung. Bei bestehendem Implantat oft von Zusatzversicherungen bezuschusst.',
    verfuegbar: ALLE,
    related: ['zahnimplantate', 'prophylaxe-4-0', 'parodontitis-behandlung'],
    faq: [
      {
        frage: 'Wie oft sollte ein Implantat kontrolliert werden?',
        antwort:
          'Wir empfehlen zwei bis vier Termine pro Jahr, abhängig davon, wie gut die Mundhygiene zu Hause gelingt und ob Sie in der Vergangenheit eine Parodontitis hatten.',
      },
      {
        frage: 'Was ist Periimplantitis?',
        antwort:
          'Eine Entzündung des Gewebes rund um das Implantat, die unbehandelt Knochen abbaut und im schlimmsten Fall zum Verlust des Implantats führt. Sie tut anfangs nicht weh – deshalb ist die regelmäßige Kontrolle so wichtig.',
      },
    ],
  },

  // ─────────────────────────── Ästhetische Zahnmedizin ───────────────────────────
  {
    slug: 'veneers',
    name: 'Veneers',
    kategorie: 'aesthetik',
    kurz: 'Hauchdünne Keramikschalen, die Form und Farbe der sichtbaren Zähne verändern.',
    teaser:
      'Veneers sind dünne Verblendschalen aus Keramik, die auf die Vorderseite der Frontzähne geklebt werden. Sie korrigieren Verfärbungen, kleine Lücken, abgeplatzte Kanten und leichte Fehlstellungen – in der Regel innerhalb von zwei bis drei Terminen.',
    synonyme: ['Verblendschalen', 'Keramikschalen', 'Zahnverblendung', 'Hollywood Smile', 'Non-Prep Veneers'],
    patientenfrage: 'Was kosten Veneers und wie lange halten sie?',
    dauer: '2 bis 3 Termine über etwa 3 Wochen',
    kosten: '900 bis 1.800 € pro Zahn, abhängig von Material und Aufwand',
    kasse:
      'Rein ästhetische Veneers sind eine Privatleistung und werden von der gesetzlichen Kasse nicht bezuschusst. Bei nachweisbarer medizinischer Indikation – etwa nach einem Unfall – kann ein Teil erstattet werden.',
    verfuegbar: ALLE,
    related: ['smile-design', 'zahnaufhellung', 'keramik-kronen', 'aligner'],
    ablauf: [
      {
        titel: 'Analyse und Planung',
        text: 'Wir fotografieren und scannen Ihre Zähne und besprechen, was Sie stört. Am Bildschirm sehen Sie eine Vorschau des möglichen Ergebnisses.',
        dauer: '60 Min.',
      },
      {
        titel: 'Vorbereitung der Zähne',
        text: 'Je nach Ausgangslage wird sehr wenig oder gar kein Zahnschmelz abgetragen. Sie bekommen provisorische Schalen, mit denen Sie Form und Länge im Alltag testen.',
        dauer: '90 Min.',
      },
      {
        titel: 'Einsetzen',
        text: 'Die fertigen Veneers werden anprobiert, in Farbe und Sitz kontrolliert und dann dauerhaft aufgeklebt.',
        dauer: '90 Min.',
      },
    ],
    faq: [
      {
        frage: 'Muss dafür viel gesunder Zahn abgeschliffen werden?',
        antwort:
          'Deutlich weniger als früher. Bei klassischen Veneers wird etwa ein halber Millimeter Schmelz abgetragen. In geeigneten Fällen arbeiten wir mit Non-Prep-Veneers ganz ohne Beschleifen. Was bei Ihnen möglich ist, hängt von Zahnstellung und Ausgangsform ab – das klären wir vor dem ersten Schliff.',
      },
      {
        frage: 'Wie lange halten Veneers?',
        antwort:
          'Bei guter Pflege und regelmäßiger Kontrolle halten Keramikveneers in der Regel zehn bis fünfzehn Jahre, oft länger. Was sie am ehesten gefährdet, ist nächtliches Zähneknirschen – deshalb prüfen wir das vorher und versorgen Sie gegebenenfalls mit einer Schiene.',
      },
      {
        frage: 'Sieht man, dass es Veneers sind?',
        antwort:
          'Bei sorgfältiger Planung nicht. Keramik hat eine ähnliche Lichtdurchlässigkeit wie natürlicher Zahnschmelz. Entscheidend ist, dass Form, Länge und Farbe zu Ihrem Gesicht passen – deshalb arbeiten wir mit Vorschau und Provisorium, bevor irgendetwas endgültig wird.',
      },
      {
        frage: 'Kann ich Veneers wieder entfernen lassen?',
        antwort:
          'Wenn Zahnschmelz abgetragen wurde, ist die Versorgung dauerhaft – der Zahn braucht dann immer eine Verblendung. Non-Prep-Veneers lassen sich dagegen grundsätzlich wieder ablösen. Wir sagen Ihnen vorher klar, welcher Weg bei Ihnen infrage kommt.',
      },
    ],
  },
  {
    slug: 'zahnaufhellung',
    name: 'Zahnaufhellung (Bleaching)',
    kategorie: 'aesthetik',
    kurz: 'Zähne mehrere Nuancen heller – kontrolliert und ohne den Schmelz anzugreifen.',
    teaser:
      'Beim Bleaching hellen wir die Zähne mit einem Wirkstoffgel auf, das Farbpigmente im Zahn aufspaltet. Je nach Ausgangsfarbe sind mehrere Nuancen möglich. In der Praxis geht das in einer Sitzung, mit Schienen für zu Hause etwas langsamer und sanfter.',
    synonyme: ['Bleaching', 'Zähne bleichen', 'weiße Zähne', 'Home Bleaching', 'In-Office Bleaching'],
    patientenfrage: 'Schadet Bleaching meinen Zähnen?',
    dauer: 'In der Praxis 60 bis 90 Minuten, zu Hause 10 bis 14 Tage',
    kosten: '350 bis 650 € für beide Kiefer',
    kasse: 'Privatleistung ohne Kassenbeteiligung.',
    verfuegbar: ALLE,
    related: ['professionelle-zahnreinigung', 'veneers', 'smile-design', 'kunststofffuellungen'],
    faq: [
      {
        frage: 'Greift Bleaching den Zahnschmelz an?',
        antwort:
          'Bei fachgerechter Anwendung nicht. Der Wirkstoff dringt in den Zahn ein und spaltet dort Farbmoleküle, ohne Substanz abzutragen. Wichtig ist, dass Zähne und Zahnfleisch vorher gesund sind – deshalb untersuchen wir immer erst und reinigen professionell, bevor wir aufhellen.',
      },
      {
        frage: 'Warum werden meine Kronen und Füllungen nicht heller?',
        antwort:
          'Keramik und Kunststoff reagieren nicht auf das Bleichmittel. Wenn Sie sichtbare Kronen oder Füllungen haben, planen wir das mit ein: Erst wird aufgehellt, dann werden die Restaurationen an die neue Farbe angepasst.',
      },
      {
        frage: 'Wie lange hält das Ergebnis?',
        antwort:
          'Meist ein bis drei Jahre. Kaffee, Tee, Rotwein und Rauchen verkürzen die Zeit deutlich. Mit einer Auffrischung über Ihre individuelle Schiene halten Sie das Ergebnis günstig stabil.',
      },
      {
        frage: 'Werden meine Zähne danach empfindlich?',
        antwort:
          'Vorübergehend kann es zu Empfindlichkeit auf Kälte kommen, die meist innerhalb von ein bis zwei Tagen abklingt. Wir verwenden Gele mit Kaliumnitrat und Fluorid, die das deutlich abmildern.',
      },
    ],
  },
  {
    slug: 'smile-design',
    name: 'Digitales Smile Design',
    kategorie: 'aesthetik',
    kurz: 'Ihr neues Lächeln am Bildschirm sehen, bevor der erste Zahn behandelt wird.',
    teaser:
      'Beim digitalen Smile Design planen wir Ihr Lächeln anhand von Fotos, Videos und einem 3D-Scan – im Verhältnis zu Gesichtsform, Lippenlinie und Ausdruck. Sie sehen das Ergebnis vorab am Bildschirm und können es sogar als Provisorium im Mund testen, bevor Sie sich entscheiden.',
    synonyme: ['DSD', 'Smile Makeover', 'Lächeln planen', 'Zahnästhetik Planung', 'Mock-up'],
    patientenfrage: 'Kann ich vorher sehen, wie meine Zähne danach aussehen?',
    dauer: '2 Termine à 60 bis 90 Minuten',
    kosten: '250 bis 600 € für die Planung, wird bei Umsetzung meist angerechnet',
    kasse: 'Privatleistung.',
    verfuegbar: OHNE_KIEZ,
    related: ['veneers', 'zahnaufhellung', 'keramik-kronen', 'aligner'],
    faq: [
      {
        frage: 'Wie realistisch ist die Vorschau?',
        antwort:
          'Die digitale Vorschau zeigt Form, Länge und Proportionen sehr genau. Noch verbindlicher wird es mit dem Mock-up: Dabei legen wir die geplante Form als dünne Kunststoffschicht direkt auf Ihre Zähne, ohne zu schleifen. Sie sehen und fühlen das Ergebnis dann im eigenen Gesicht.',
      },
      {
        frage: 'Was, wenn mir das Ergebnis nicht gefällt?',
        antwort:
          'Genau dafür gibt es diesen Schritt. Solange nichts beschliffen ist, lässt sich jede Änderung ohne Verlust umsetzen. Wir ändern die Planung so lange, bis Sie zufrieden sind – erst dann beginnt die eigentliche Behandlung.',
      },
    ],
  },
  {
    slug: 'zahnschmuck',
    name: 'Zahnschmuck',
    kategorie: 'aesthetik',
    kurz: 'Kleiner Kristall oder Goldornament, aufgeklebt ohne Bohren.',
    teaser:
      'Zahnschmuck wird mit demselben Verfahren aufgeklebt wie eine Zahnspange – ohne Bohren und ohne Substanzverlust. Er lässt sich jederzeit rückstandsfrei wieder entfernen.',
    synonyme: ['Dental Jewelry', 'Zahnkristall', 'Skyce', 'Twinkles'],
    patientenfrage: 'Wird für Zahnschmuck in den Zahn gebohrt?',
    dauer: '20 Minuten',
    kosten: '60 bis 150 € je nach Schmuckstück',
    kasse: 'Privatleistung.',
    verfuegbar: OHNE_KIEZ,
    related: ['zahnaufhellung', 'professionelle-zahnreinigung'],
    faq: [
      {
        frage: 'Schadet Zahnschmuck dem Zahn?',
        antwort:
          'Nein, wenn er fachgerecht gesetzt und gepflegt wird. Der Zahn wird nicht verletzt. Wichtig ist gründliches Putzen rund um das Schmuckstück, damit sich dort keine Beläge sammeln.',
      },
    ],
  },

  // ─────────────────────────── Zahnersatz ───────────────────────────
  {
    slug: 'keramik-kronen',
    name: 'Kronen aus Vollkeramik',
    kategorie: 'zahnersatz',
    kurz: 'Wenn vom Zahn zu wenig übrig ist – eine Krone, die aussieht wie ein Zahn.',
    teaser:
      'Eine Krone umfasst den beschädigten Zahn vollständig und gibt ihm Form und Belastbarkeit zurück. Vollkeramik kommt der Lichtdurchlässigkeit natürlicher Zähne sehr nahe und braucht keinen Metallkern, der später als dunkler Rand durchscheint.',
    synonyme: ['Zahnkrone', 'Vollkeramikkrone', 'Zirkonkrone', 'Überkronung', 'Zahn überkronen'],
    patientenfrage: 'Wann braucht ein Zahn eine Krone statt einer Füllung?',
    dauer: '2 Termine über etwa 2 Wochen',
    kosten: '700 bis 1.400 € pro Krone',
    kasse:
      'Die gesetzliche Kasse zahlt einen Festzuschuss für die Regelversorgung. Bei Vollkeramik im Seitenzahnbereich tragen Sie die Differenz selbst. Ein vollständig geführtes Bonusheft erhöht den Zuschuss um bis zu 30 Prozent.',
    verfuegbar: ALLE,
    related: ['inlays-onlays', 'zahnbruecken', 'wurzelkanalbehandlung', 'zahnimplantate'],
    faq: [
      {
        frage: 'Wie lange hält eine Keramikkrone?',
        antwort:
          'Studien und Erfahrungswerte liegen bei fünfzehn bis zwanzig Jahren, häufig auch länger. Entscheidend sind die Pflege des Kronenrands und ob Sie nachts knirschen.',
      },
      {
        frage: 'Muss der Zahn dafür einen Wurzelkanal bekommen?',
        antwort:
          'Nicht zwingend. Solange der Nerv gesund ist, bleibt er drin. Eine Wurzelkanalbehandlung wird nur nötig, wenn der Nerv bereits entzündet oder abgestorben ist.',
      },
      {
        frage: 'Wie lange muss ich mit einem Provisorium leben?',
        antwort:
          'In der Regel ein bis zwei Wochen. Weil wir in unserem eigenen Meisterlabor fertigen, sind kürzere Wege möglich als bei externen Laboren.',
      },
    ],
  },
  {
    slug: 'zahnbruecken',
    name: 'Zahnbrücken',
    kategorie: 'zahnersatz',
    kurz: 'Eine Lücke schließen, indem die Nachbarzähne den Ersatz mittragen.',
    teaser:
      'Eine Brücke ersetzt einen oder mehrere fehlende Zähne und stützt sich dabei auf die Nachbarzähne. Sie sitzt fest, ist sofort belastbar und braucht keinen chirurgischen Eingriff – anders als ein Implantat müssen dafür aber die Nachbarzähne beschliffen werden.',
    synonyme: ['Brücke', 'Zahnlücke schließen', 'festsitzender Zahnersatz', 'Klebebrücke'],
    patientenfrage: 'Brücke oder Implantat – was ist besser für eine Zahnlücke?',
    dauer: '2 bis 3 Termine über etwa 3 Wochen',
    kosten: '1.200 bis 2.800 € je nach Spannweite und Material',
    kasse: 'Festzuschuss der gesetzlichen Kasse für die Regelversorgung, erhöht durch Bonusheft.',
    verfuegbar: ALLE,
    related: ['zahnimplantate', 'keramik-kronen', 'teilprothese', 'knochenaufbau'],
    faq: [
      {
        frage: 'Brücke oder Implantat?',
        antwort:
          'Sind die Nachbarzähne gesund und unversehrt, spricht viel für ein Implantat – dann bleibt gesunde Zahnsubstanz erhalten. Sind die Nachbarzähne ohnehin überkronungsbedürftig, ist die Brücke oft die sinnvollere und günstigere Lösung. Wir zeigen Ihnen beide Wege mit Kosten und Konsequenzen auf, bevor Sie entscheiden.',
      },
      {
        frage: 'Kann man eine Brücke ohne Beschleifen machen?',
        antwort:
          'In ausgewählten Fällen im Frontzahnbereich ja – mit einer Klebebrücke, die nur mit einem Flügel an der Rückseite eines Nachbarzahns befestigt wird. Das ist besonders bei jungen Menschen mit nicht angelegten Zähnen eine gute Zwischenlösung.',
      },
    ],
  },
  {
    slug: 'inlays-onlays',
    name: 'Inlays & Onlays',
    kategorie: 'zahnersatz',
    kurz: 'Passgenaue Keramikeinlagen für größere Defekte im Seitenzahn.',
    teaser:
      'Wenn ein Loch zu groß für eine Füllung, der Zahn aber zu gut für eine Krone ist, ist ein Inlay die richtige Wahl. Es wird im Labor passgenau aus Keramik gefertigt und eingeklebt – stabiler und langlebiger als eine Kunststofffüllung.',
    synonyme: ['Keramikinlay', 'Einlagefüllung', 'Teilkrone', 'Onlay'],
    patientenfrage: 'Wann lohnt sich ein Inlay statt einer Kunststofffüllung?',
    dauer: '2 Termine',
    kosten: '450 bis 900 € pro Zahn',
    kasse: 'Festzuschuss auf Niveau der Amalgam- bzw. Kunststofffüllung, Differenz als Eigenanteil.',
    verfuegbar: ALLE,
    related: ['keramik-kronen', 'kunststofffuellungen', 'karies-behandlung'],
    faq: [
      {
        frage: 'Wie lange hält ein Keramikinlay?',
        antwort:
          'Deutlich länger als eine Kunststofffüllung – üblich sind zehn bis fünfzehn Jahre und mehr. Keramik schrumpft beim Aushärten nicht, dadurch bleibt der Randschluss über die Jahre dichter.',
      },
    ],
  },
  {
    slug: 'teilprothese',
    name: 'Prothesen & Teilprothesen',
    kategorie: 'zahnersatz',
    kurz: 'Herausnehmbarer Ersatz, wenn mehrere oder alle Zähne fehlen.',
    teaser:
      'Wenn größere Lücken nicht mehr durch Brücken versorgt werden können, bringt herausnehmbarer Zahnersatz Kaufunktion und Aussehen zurück. Moderne Teleskop- und Geschiebeprothesen kommen dabei ohne sichtbare Metallklammern aus.',
    synonyme: ['Prothese', 'Dritte Zähne', 'Teleskopprothese', 'Vollprothese', 'Gebiss'],
    patientenfrage: 'Was kostet eine Zahnprothese und hält sie beim Essen?',
    dauer: '4 bis 6 Termine über etwa 6 Wochen',
    kosten: '900 bis 4.500 € je nach Bauart',
    kasse:
      'Die gesetzliche Kasse leistet einen Festzuschuss. Bei geringem Einkommen ist eine Härtefallregelung mit vollständiger Übernahme der Regelversorgung möglich.',
    verfuegbar: OHNE_KIEZ,
    related: ['zahnimplantate', 'all-on-4', 'zahnbruecken'],
    faq: [
      {
        frage: 'Rutscht die Prothese beim Sprechen und Essen?',
        antwort:
          'Eine gut sitzende Prothese hält im Oberkiefer durch Unterdruck sehr zuverlässig. Im Unterkiefer ist der Halt naturgemäß schwieriger – dort bringen schon zwei Implantate als Druckknopfanker enorme Sicherheit.',
      },
      {
        frage: 'Wie lange dauert die Eingewöhnung?',
        antwort:
          'Meist zwei bis vier Wochen. Anfangs verändern sich Aussprache und Geschmackswahrnehmung. Wir planen Nachkontrollen fest ein, um Druckstellen früh zu korrigieren.',
      },
    ],
  },

  // ─────────────────────────── Implantologie ───────────────────────────
  {
    slug: 'zahnimplantate',
    name: 'Zahnimplantate',
    kategorie: 'implantologie',
    kurz: 'Eine künstliche Zahnwurzel aus Titan – fest verankert, ohne Nachbarzähne zu beschleifen.',
    teaser:
      'Ein Implantat ersetzt die Zahnwurzel und trägt darauf eine Krone, Brücke oder Prothese. Es überträgt Kaukräfte in den Kieferknochen und hält ihn dadurch aktiv – ein Vorteil, den kein anderer Zahnersatz bietet. Die Nachbarzähne bleiben unberührt.',
    synonyme: ['Implantat', 'künstliche Zahnwurzel', 'Zahnimplantat Kosten', 'Titanimplantat', 'Keramikimplantat'],
    patientenfrage: 'Wie läuft eine Implantation ab und tut sie weh?',
    dauer: 'Eingriff 30 bis 90 Minuten, Gesamtbehandlung 3 bis 6 Monate',
    kosten: '1.800 bis 3.500 € pro Implantat inklusive Krone',
    kasse:
      'Die gesetzliche Kasse zahlt einen Festzuschuss für den Zahnersatz auf dem Implantat, nicht aber für das Implantat selbst. Der Zuschuss entspricht dem der vergleichbaren Regelversorgung.',
    verfuegbar: KUDAMM_POTSDAM,
    related: ['knochenaufbau', 'all-on-4', 'sofortimplantate', 'implantat-prophylaxe', 'dvt-3d-roentgen'],
    ablauf: [
      {
        titel: 'Planung mit 3D-Aufnahme',
        text: 'Eine DVT-Aufnahme zeigt Knochenangebot und Nervenverläufe millimetergenau. Daraus planen wir Position und Länge des Implantats am Rechner.',
        dauer: '45 Min.',
      },
      {
        titel: 'Einsetzen des Implantats',
        text: 'Unter örtlicher Betäubung – auf Wunsch im Dämmerschlaf – wird das Implantat in den Kieferknochen eingebracht. Die meisten Menschen empfinden das als weniger belastend als eine Zahnentfernung.',
        dauer: '30 – 90 Min.',
      },
      {
        titel: 'Einheilzeit',
        text: 'Der Knochen verbindet sich fest mit der Implantatoberfläche. In dieser Zeit tragen Sie ein Provisorium, mit dem Sie normal essen und lachen können.',
        dauer: '3 – 6 Monate',
      },
      {
        titel: 'Krone aufsetzen',
        text: 'Nach der Einheilung wird der Zahnersatz aufgesetzt – im eigenen Meisterlabor auf Ihre Zahnfarbe abgestimmt.',
        dauer: '2 Termine',
      },
    ],
    faq: [
      {
        frage: 'Tut das Einsetzen weh?',
        antwort:
          'Während des Eingriffs spüren Sie durch die örtliche Betäubung nichts. Danach kann es ein bis drei Tage leicht schmerzen und schwellen – vergleichbar mit einer Zahnentfernung und gut mit üblichen Schmerzmitteln zu beherrschen. Wer sehr angespannt ist, kann den Eingriff im Dämmerschlaf durchführen lassen.',
      },
      {
        frage: 'Wie lange hält ein Implantat?',
        antwort:
          'Nach zehn Jahren sind über neunzig Prozent der Implantate noch in Funktion. Entscheidend sind konsequente Nachsorge, gesundes Zahnfleisch und Nichtrauchen. Rauchen erhöht das Risiko eines Implantatverlusts deutlich.',
      },
      {
        frage: 'Bin ich zu alt für ein Implantat?',
        antwort:
          'Ein Höchstalter gibt es nicht. Entscheidend sind Allgemeingesundheit und Knochenqualität, nicht das Geburtsjahr. Nach unten gibt es eine Grenze: Bei Jugendlichen wird gewartet, bis das Kieferwachstum abgeschlossen ist.',
      },
      {
        frage: 'Was, wenn zu wenig Knochen da ist?',
        antwort:
          'Dann lässt sich Knochen aufbauen – je nach Ausmaß gleichzeitig mit der Implantation oder in einem vorgeschalteten Eingriff. Wie viel bei Ihnen nötig ist, zeigt die 3D-Aufnahme.',
      },
      {
        frage: 'Gibt es Implantate ohne Metall?',
        antwort:
          'Ja, aus Zirkonoxid-Keramik. Sie sind weiß, gewebefreundlich und eine Option für Menschen mit Titanunverträglichkeit oder dünnem Zahnfleisch im sichtbaren Bereich. Nicht jede Situation ist dafür geeignet – das klären wir in der Planung.',
      },
    ],
  },
  {
    slug: 'sofortimplantate',
    name: 'Sofortimplantate',
    kategorie: 'implantologie',
    kurz: 'Zahn ziehen und Implantat setzen in einer Sitzung.',
    teaser:
      'Unter bestimmten Voraussetzungen lässt sich das Implantat direkt nach dem Entfernen des Zahns in dasselbe Zahnfach setzen. Das spart einen Eingriff, verkürzt die Gesamtbehandlung und schont Knochen und Zahnfleischverlauf.',
    synonyme: ['Sofortimplantation', 'Implantat sofort', 'Zahn ziehen und Implantat'],
    patientenfrage: 'Kann ich sofort nach dem Zahnziehen ein Implantat bekommen?',
    dauer: 'Ein Eingriff von 60 bis 120 Minuten',
    kosten: '2.000 bis 3.800 € inklusive Versorgung',
    kasse: 'Wie beim regulären Implantat: Festzuschuss nur für den Zahnersatz.',
    verfuegbar: KUDAMM_POTSDAM,
    related: ['zahnimplantate', 'knochenaufbau', 'zahnentfernung', 'all-on-4'],
    faq: [
      {
        frage: 'Für wen kommt ein Sofortimplantat infrage?',
        antwort:
          'Voraussetzung ist, dass das Zahnfach nicht entzündet ist und genügend stabiler Knochen vorhanden ist, damit das Implantat sicher hält. Bei einer akuten Entzündung heilt zuerst das Gewebe aus. Die 3D-Aufnahme zeigt vorab, was möglich ist.',
      },
      {
        frage: 'Habe ich sofort einen sichtbaren Zahn?',
        antwort:
          'Im Frontzahnbereich versorgen wir meist sofort mit einem Provisorium, das nicht voll belastet wird. Sie verlassen die Praxis also nicht mit einer sichtbaren Lücke.',
      },
    ],
  },
  {
    slug: 'all-on-4',
    name: 'Feste Zähne an einem Tag (All-on-4)',
    kategorie: 'implantologie',
    kurz: 'Ein kompletter Kiefer auf vier Implantaten – mit festem Provisorium noch am selben Tag.',
    teaser:
      'Bei stark zerstörtem oder zahnlosem Kiefer trägt eine Brücke auf vier bis sechs geschickt positionierten Implantaten den gesamten Kiefer. Häufig ist bereits am Tag des Eingriffs ein festsitzendes Provisorium möglich – Sie gehen also nicht ohne Zähne nach Hause.',
    synonyme: ['All on 4', 'feste Zähne an einem Tag', 'Sofortversorgung zahnloser Kiefer', 'All-on-6'],
    patientenfrage: 'Bekomme ich wirklich an einem Tag feste Zähne?',
    dauer: 'Eingriff 2 bis 4 Stunden, endgültige Versorgung nach 3 bis 6 Monaten',
    kosten: '9.000 bis 18.000 € pro Kiefer',
    kasse: 'Festzuschuss für die vergleichbare Regelversorgung. Ratenzahlung ist möglich.',
    verfuegbar: NUR_KUDAMM,
    related: ['zahnimplantate', 'knochenaufbau', 'teilprothese', 'behandlung-in-narkose'],
    faq: [
      {
        frage: 'Reichen vier Implantate wirklich für einen ganzen Kiefer?',
        antwort:
          'Ja, wenn sie richtig positioniert sind. Die hinteren beiden Implantate werden schräg gesetzt, um vorhandenen Knochen optimal auszunutzen. Das Verfahren ist seit über zwanzig Jahren dokumentiert. Bei ungünstigen Knochenverhältnissen verwenden wir sechs Implantate.',
      },
      {
        frage: 'Was esse ich in den ersten Wochen?',
        antwort:
          'Das Provisorium ist fest, aber noch nicht voll belastbar. Für etwa drei Monate empfehlen wir weiche Kost und Verzicht auf sehr harte Speisen. Danach ist die endgültige Brücke uneingeschränkt belastbar.',
      },
    ],
  },
  {
    slug: 'knochenaufbau',
    name: 'Knochenaufbau',
    kategorie: 'implantologie',
    kurz: 'Fundament schaffen, wo der Kieferknochen für ein Implantat nicht mehr reicht.',
    teaser:
      'Wenn ein Zahn lange fehlt, baut sich der Kieferknochen an dieser Stelle ab. Mit körpereigenem Knochen oder biologischem Ersatzmaterial lässt sich das Volumen wieder aufbauen, sodass ein Implantat sicheren Halt findet.',
    synonyme: ['Augmentation', 'Sinuslift', 'Knochenaufbau Kiefer', 'Knochenersatzmaterial'],
    patientenfrage: 'Was passiert bei einem Knochenaufbau und wie lange dauert die Heilung?',
    dauer: 'Eingriff 45 bis 120 Minuten, Heilung 4 bis 9 Monate',
    kosten: '400 bis 2.500 € je nach Umfang',
    kasse: 'In der Regel Privatleistung im Rahmen der implantologischen Versorgung.',
    verfuegbar: KUDAMM_POTSDAM,
    related: ['zahnimplantate', 'sofortimplantate', 'dvt-3d-roentgen', 'weisheitszaehne'],
    faq: [
      {
        frage: 'Woher kommt der Knochen?',
        antwort:
          'Bei kleineren Defekten verwenden wir meist zertifiziertes Ersatzmaterial, das der Körper nach und nach durch eigenen Knochen ersetzt. Bei größeren Aufbauten kann körpereigener Knochen sinnvoll sein, den wir aus dem Kieferbereich gewinnen.',
      },
      {
        frage: 'Ist ein Sinuslift gefährlich?',
        antwort:
          'Es ist ein Routineeingriff mit sehr guter Studienlage. Die Kieferhöhlenschleimhaut wird dabei angehoben, nicht durchtrennt. Durch die vorherige 3D-Planung kennen wir die anatomischen Verhältnisse vor dem Eingriff genau.',
      },
    ],
  },

  // ─────────────────────────── Zahnerhalt ───────────────────────────
  {
    slug: 'wurzelkanalbehandlung',
    name: 'Wurzelkanalbehandlung',
    kategorie: 'zahnerhalt',
    kurz: 'Den eigenen Zahn retten, wenn der Nerv entzündet ist.',
    teaser:
      'Bei einer Wurzelkanalbehandlung wird entzündetes Gewebe aus dem Inneren des Zahns entfernt, das Kanalsystem gereinigt und dicht verschlossen. Mit Mikroskop und maschineller Aufbereitung lassen sich heute auch schwierige, gekrümmte Kanäle zuverlässig erreichen.',
    synonyme: ['Wurzelbehandlung', 'Endodontie', 'Wurzelkanal', 'Zahnnerv entzündet', 'Wurzelspitzenresektion'],
    patientenfrage: 'Ist eine Wurzelbehandlung schmerzhaft und rettet sie den Zahn wirklich?',
    dauer: '1 bis 2 Termine à 60 bis 120 Minuten',
    kosten: '300 bis 1.200 € bei erweiterten Verfahren',
    kasse:
      'Die gesetzliche Kasse übernimmt die Behandlung an Frontzähnen und – unter bestimmten Voraussetzungen – an Backenzähnen. Zusatzleistungen wie Mikroskop und maschinelle Aufbereitung sind privat zu tragen.',
    verfuegbar: ALLE,
    related: ['karies-behandlung', 'keramik-kronen', 'zahnentfernung'],
    faq: [
      {
        frage: 'Tut eine Wurzelbehandlung weh?',
        antwort:
          'Der Ruf stammt aus einer Zeit ohne moderne Betäubungsmittel. Heute ist der Zahn während der Behandlung zuverlässig betäubt. Was wehtut, ist meist die Entzündung davor – die Behandlung beendet diesen Schmerz.',
      },
      {
        frage: 'Wie hoch ist die Erfolgsaussicht?',
        antwort:
          'Bei erstmaliger Behandlung unter dem Mikroskop liegen die Erfolgsquoten in Studien bei etwa 85 bis 95 Prozent. Bei einer Wiederholungsbehandlung sind sie niedriger. Eine Garantie kann Ihnen niemand seriös geben – wir sagen Ihnen vorab ehrlich, wie die Aussichten in Ihrem Fall stehen.',
      },
      {
        frage: 'Braucht der Zahn danach eine Krone?',
        antwort:
          'Bei Backenzähnen fast immer. Ein wurzelbehandelter Zahn wird spröder und bricht ohne Überkronung leicht. Bei Frontzähnen mit wenig Substanzverlust reicht oft eine Füllung.',
      },
      {
        frage: 'Wäre ein Implantat nicht sinnvoller?',
        antwort:
          'Der eigene Zahn hat einen Halteapparat, den kein Implantat nachbildet – deshalb versuchen wir zuerst, ihn zu erhalten. Ist der Zahn allerdings stark zerstört oder mehrfach erfolglos behandelt, kann ein Implantat die stabilere Lösung sein. Wir legen Ihnen beide Wege mit Kosten und Prognose nebeneinander.',
      },
    ],
  },
  {
    slug: 'parodontitis-behandlung',
    name: 'Parodontitis-Behandlung',
    kategorie: 'zahnerhalt',
    kurz: 'Zahnfleischentzündung stoppen, bevor sie Knochen und Zähne kostet.',
    teaser:
      'Parodontitis ist die häufigste Ursache für Zahnverlust bei Erwachsenen – und sie tut lange nicht weh. Wir reinigen die Zahnfleischtaschen gründlich, entfernen Bakterien und begleiten Sie danach engmaschig, damit die Entzündung nicht zurückkommt.',
    synonyme: ['Parodontose', 'Zahnfleischentzündung', 'Zahnfleischbluten', 'PA-Behandlung', 'Zahnfleischrückgang'],
    patientenfrage: 'Mein Zahnfleisch blutet – ist das schon Parodontitis?',
    dauer: '2 bis 4 Termine plus Nachsorge',
    kosten: 'Kassenleistung bei Indikation, ergänzende Maßnahmen 200 bis 800 €',
    kasse:
      'Seit 2021 gibt es eine strukturierte Parodontitis-Behandlungsstrecke, die die gesetzliche Kasse inklusive der Nachsorge über zwei Jahre übernimmt. Voraussetzung ist ein dokumentierter Befund.',
    verfuegbar: ALLE,
    related: ['professionelle-zahnreinigung', 'prophylaxe-4-0', 'implantat-prophylaxe'],
    faq: [
      {
        frage: 'Ist Zahnfleischbluten normal?',
        antwort:
          'Nein. Gesundes Zahnfleisch blutet nicht, auch nicht beim Putzen oder bei Zahnseide. Blutung ist ein Entzündungszeichen und der früheste Warnhinweis, den Sie selbst erkennen können. Bitte nicht wegputzen wollen, sondern abklären lassen.',
      },
      {
        frage: 'Wächst zurückgegangenes Zahnfleisch wieder nach?',
        antwort:
          'Verloren gegangener Knochen und zurückgegangenes Zahnfleisch wachsen nicht von selbst nach. Was wir erreichen können: die Entzündung stoppen und den Zustand stabil halten. In ausgewählten Fällen sind regenerative oder plastisch-chirurgische Eingriffe möglich.',
      },
      {
        frage: 'Hat Parodontitis mit meiner Allgemeingesundheit zu tun?',
        antwort:
          'Ja. Es gibt gut belegte Zusammenhänge mit Diabetes, Herz-Kreislauf-Erkrankungen und Komplikationen in der Schwangerschaft. Umgekehrt erschwert schlecht eingestellter Diabetes die Behandlung. Deshalb fragen wir nach Ihren Vorerkrankungen.',
      },
    ],
  },
  {
    slug: 'karies-behandlung',
    name: 'Kariesbehandlung',
    kategorie: 'zahnerhalt',
    kurz: 'Karies entfernen und den Zahn dicht verschließen – so substanzschonend wie möglich.',
    teaser:
      'Karies wird umso aufwendiger, je länger sie unbemerkt bleibt. Früh erkannt genügt oft eine kleine Füllung. Wir arbeiten mit Vergrößerung und – wo sinnvoll – mit besonders schonenden Verfahren, um so viel gesunden Zahn wie möglich zu erhalten.',
    synonyme: ['Loch im Zahn', 'Karies', 'Füllung', 'Zahn bohren', 'Karies ohne Bohren'],
    patientenfrage: 'Kann Karies auch ohne Bohren behandelt werden?',
    dauer: '30 bis 60 Minuten',
    kosten: 'Kassenleistung, hochwertige Füllungen 80 bis 250 € Eigenanteil',
    kasse:
      'Die gesetzliche Kasse übernimmt Füllungen im gesamten Gebiss in zahnfarbenem Material. Für aufwendigere Schichttechniken fällt ein Eigenanteil an.',
    verfuegbar: ALLE,
    related: ['kunststofffuellungen', 'inlays-onlays', 'wurzelkanalbehandlung', 'zahnvorsorge'],
    faq: [
      {
        frage: 'Geht Karies auch ohne Bohren weg?',
        antwort:
          'In sehr frühen Stadien ja. Beginnende Karies im Zahnschmelz lässt sich mit Fluoridierung stoppen oder mit einem Kunststoff-Infiltrationsverfahren behandeln, ohne zu bohren. Sobald die Karies das Dentin erreicht hat, muss sie mechanisch entfernt werden.',
      },
      {
        frage: 'Warum tut mein Zahn nicht weh, obwohl Karies da ist?',
        antwort:
          'Schmerz entsteht erst, wenn die Karies dem Nerv nahekommt. Bis dahin kann sie über Monate unbemerkt wachsen. Genau deshalb sind Kontrolltermine so wertvoll – sie finden, was Sie selbst nicht spüren.',
      },
    ],
  },
  {
    slug: 'kunststofffuellungen',
    name: 'Zahnfarbene Füllungen',
    kategorie: 'zahnerhalt',
    kurz: 'Composite-Füllungen, die farblich nicht vom Zahn zu unterscheiden sind.',
    teaser:
      'Moderne Composite-Füllungen werden in Schichten aufgebaut und mit Licht ausgehärtet. Sie haften direkt am Zahn, brauchen also weniger Substanzabtrag als früher – und sie sind farblich exakt anpassbar.',
    synonyme: ['Composite', 'weiße Füllung', 'Kunststofffüllung', 'Amalgam Alternative', 'Zahnfüllung'],
    patientenfrage: 'Was kostet eine zahnfarbene Füllung und wie lange hält sie?',
    dauer: '30 bis 60 Minuten',
    kosten: 'Kassenleistung, Schichttechnik 80 bis 200 € Eigenanteil',
    kasse: 'Zahnfarbene Füllungen sind seit dem Amalgam-Aus Kassenleistung im gesamten Gebiss.',
    verfuegbar: ALLE,
    related: ['karies-behandlung', 'inlays-onlays', 'zahnaufhellung'],
    faq: [
      {
        frage: 'Wie lange hält eine Composite-Füllung?',
        antwort:
          'Je nach Größe und Lage etwa fünf bis zehn Jahre. Kleine Füllungen halten länger als große. Ist ein sehr großer Teil des Zahns betroffen, ist ein Inlay oder eine Teilkrone die haltbarere Lösung.',
      },
      {
        frage: 'Soll ich meine alten Amalgamfüllungen austauschen lassen?',
        antwort:
          'Intakte Amalgamfüllungen müssen nicht vorsorglich entfernt werden – jeder Austausch kostet gesunde Zahnsubstanz. Sinnvoll ist der Wechsel, wenn die Füllung undicht ist, Karies darunter entsteht oder Sie es aus persönlichen Gründen wünschen. Dann arbeiten wir mit Schutzmaßnahmen gegen Quecksilberdämpfe.',
      },
    ],
  },

  // ─────────────────────────── Kieferorthopädie ───────────────────────────
  {
    slug: 'aligner',
    name: 'Unsichtbare Zahnschienen (Aligner)',
    kategorie: 'kieferorthopaedie',
    kurz: 'Zähne begradigen mit durchsichtigen Schienen statt fester Spange.',
    teaser:
      'Aligner sind herausnehmbare, transparente Schienen, die die Zähne in kleinen Schritten bewegen. Im Alltag fallen sie kaum auf, und zum Essen und Zähneputzen nehmen Sie sie einfach heraus. Für leichte bis mittlere Fehlstellungen sind sie eine sehr gute Alternative zur festen Spange.',
    synonyme: ['Invisalign', 'Clear Aligner', 'unsichtbare Zahnspange', 'Zahnschiene', 'Zähne gerade'],
    patientenfrage: 'Wie lange dauert eine Alignerbehandlung bei Erwachsenen?',
    dauer: '6 bis 18 Monate, je nach Ausgangslage',
    kosten: '3.500 bis 7.000 € für beide Kiefer',
    kasse:
      'Bei Erwachsenen in der Regel Privatleistung. Bei Kindern und Jugendlichen zahlt die Kasse ab Fehlstellungsgrad KIG 3 – dann allerdings meist eine feste Spange.',
    verfuegbar: KUDAMM_POTSDAM,
    related: ['feste-zahnspange', 'retainer', 'veneers', 'smile-design'],
    faq: [
      {
        frage: 'Wie viele Stunden am Tag muss ich die Schiene tragen?',
        antwort:
          'Mindestens 20 bis 22 Stunden – also außer beim Essen und Zähneputzen durchgehend. Das ist der Punkt, an dem Behandlungen scheitern oder gelingen. Wer die Trageszeit nicht einhält, verlängert die Behandlung erheblich.',
      },
      {
        frage: 'Sieht man die Schienen beim Sprechen?',
        antwort:
          'Aus normalem Gesprächsabstand praktisch nicht. Falls sogenannte Attachments – kleine zahnfarbene Halterungen – nötig sind, können diese aus der Nähe erkennbar sein.',
      },
      {
        frage: 'Bleiben die Zähne danach gerade?',
        antwort:
          'Nur mit Retainer. Zähne haben die natürliche Tendenz, in ihre alte Position zurückzuwandern. Nach jeder kieferorthopädischen Behandlung ist deshalb eine dauerhafte Stabilisierung nötig – meist ein dünner Draht hinter den Frontzähnen.',
      },
    ],
  },
  {
    slug: 'feste-zahnspange',
    name: 'Feste Zahnspange',
    kategorie: 'kieferorthopaedie',
    kurz: 'Die zuverlässigste Methode bei ausgeprägten Fehlstellungen – auch als unsichtbare Variante.',
    teaser:
      'Die feste Spange kann Zahnbewegungen ausführen, die mit Schienen nicht möglich sind. Neben klassischen Brackets gibt es zahnfarbene Keramikbrackets und linguale Systeme, die auf der Zahninnenseite sitzen und von außen unsichtbar sind.',
    synonyme: ['Brackets', 'Zahnspange', 'Klammer', 'Lingualtechnik', 'Keramikbrackets'],
    patientenfrage: 'Feste Spange oder Aligner – was passt zu meiner Fehlstellung?',
    dauer: '12 bis 30 Monate',
    kosten: '2.500 bis 8.000 € je nach System',
    kasse:
      'Bei Kindern und Jugendlichen ab KIG-Stufe 3 übernimmt die Kasse die Regelversorgung. Der Eigenanteil von 20 Prozent wird nach erfolgreichem Abschluss zurückerstattet.',
    verfuegbar: NUR_KUDAMM,
    related: ['aligner', 'retainer', 'kinderzahnarzt'],
    faq: [
      {
        frage: 'Tut eine feste Spange weh?',
        antwort:
          'Nach dem Einsetzen und nach jeder Nachstellung sind die Zähne für zwei bis drei Tage druckempfindlich. Das ist unangenehm, aber gut auszuhalten – weiche Kost hilft in dieser Zeit.',
      },
      {
        frage: 'Bin ich mit 40 zu alt für eine Zahnspange?',
        antwort:
          'Nein. Zähne lassen sich in jedem Alter bewegen, solange das Zahnfleisch gesund ist. Bei Erwachsenen dauert es tendenziell etwas länger, und eine bestehende Parodontitis muss vorher behandelt sein.',
      },
    ],
  },
  {
    slug: 'retainer',
    name: 'Retainer',
    kategorie: 'kieferorthopaedie',
    kurz: 'Die Stabilisierung nach der Zahnkorrektur – ohne sie wandern die Zähne zurück.',
    teaser:
      'Ein Retainer hält das Behandlungsergebnis dauerhaft fest. Meist ist es ein dünner Draht, der von innen an die Frontzähne geklebt wird und von außen unsichtbar bleibt. Alternativ gibt es herausnehmbare Schienen für die Nacht.',
    synonyme: ['Retainer Draht', 'Stabilisierung nach Zahnspange', 'Zähne wandern zurück'],
    patientenfrage: 'Wie lange muss ich einen Retainer tragen?',
    dauer: '1 Termin, dann regelmäßige Kontrolle',
    kosten: '250 bis 600 € pro Kiefer',
    kasse: 'In der Regel Privatleistung.',
    verfuegbar: KUDAMM_POTSDAM,
    related: ['aligner', 'feste-zahnspange', 'knirscherschiene'],
    faq: [
      {
        frage: 'Muss ich den Retainer wirklich für immer behalten?',
        antwort:
          'Ja, wenn das Ergebnis dauerhaft stabil bleiben soll. Die Rückstellkräfte lassen mit den Jahren nach, verschwinden aber nie ganz. Ein geklebter Retainer stört im Alltag nicht und braucht nur regelmäßige Kontrolle.',
      },
    ],
  },

  // ─────────────────────────── Oralchirurgie ───────────────────────────
  {
    slug: 'weisheitszaehne',
    name: 'Weisheitszähne entfernen',
    kategorie: 'chirurgie',
    kurz: 'Routineeingriff mit guter Planung – auf Wunsch auch im Dämmerschlaf.',
    teaser:
      'Weisheitszähne müssen nicht grundsätzlich raus. Wenn sie aber schief liegen, entzündet sind oder die Nachbarzähne gefährden, ist die Entfernung sinnvoll. Mit einer 3D-Aufnahme kennen wir die Lage zum Nerv vorher genau.',
    synonyme: ['Weisheitszahn OP', 'Achter ziehen', 'Weisheitszahn Entzündung', 'Weisheitszahn raus'],
    patientenfrage: 'Müssen Weisheitszähne immer raus und wie lange fällt man danach aus?',
    dauer: '30 bis 90 Minuten für alle vier',
    kosten: 'Kassenleistung bei Indikation, Sedierung 250 bis 600 € zusätzlich',
    kasse:
      'Die Entfernung ist bei medizinischer Indikation Kassenleistung. Eine rein vorsorgliche Entfernung ohne Befund sowie Sedierung sind privat zu tragen.',
    verfuegbar: KUDAMM_POTSDAM,
    related: ['zahnentfernung', 'behandlung-in-narkose', 'dvt-3d-roentgen', 'knochenaufbau'],
    faq: [
      {
        frage: 'Wie lange bin ich danach krankgeschrieben?',
        antwort:
          'Meist zwei bis drei Tage. Schwellung und Spannungsgefühl sind am zweiten Tag am stärksten und klingen dann ab. Planen Sie den Eingriff nach Möglichkeit vor ein freies Wochenende.',
      },
      {
        frage: 'Alle vier auf einmal oder einzeln?',
        antwort:
          'Beides ist möglich. Alle vier in einer Sitzung bedeutet nur eine Ausfallzeit – das wählen die meisten, oft in Sedierung. Einzeln ist schonender, wenn Sie beruflich nicht länger ausfallen können oder Vorerkrankungen bestehen.',
      },
      {
        frage: 'Kann dabei ein Nerv verletzt werden?',
        antwort:
          'Im Unterkiefer verläuft ein Nerv nahe an den Wurzeln. Genau deshalb fertigen wir bei kritischer Lage vorher eine 3D-Aufnahme an, die den Abstand millimetergenau zeigt. Vorübergehende Taubheitsgefühle sind selten, dauerhafte sehr selten – wir besprechen Ihr individuelles Risiko vor dem Eingriff.',
      },
    ],
  },
  {
    slug: 'zahnentfernung',
    name: 'Zahnentfernung',
    kategorie: 'chirurgie',
    kurz: 'Wenn ein Zahn nicht zu retten ist – schonend und mit Blick auf das, was danach kommt.',
    teaser:
      'Manchmal ist ein Zahn so zerstört, dass ein Erhalt nicht mehr sinnvoll ist. Wir entfernen ihn so schonend wie möglich und erhalten dabei das Knochenfach – das erleichtert eine spätere Versorgung mit einem Implantat erheblich.',
    synonyme: ['Zahn ziehen', 'Extraktion', 'Zahn raus', 'Zahnverlust'],
    patientenfrage: 'Was muss ich nach dem Zähneziehen beachten?',
    dauer: '20 bis 60 Minuten',
    kosten: 'Kassenleistung, Zusatzmaßnahmen nach Aufwand',
    kasse: 'Die Entfernung ist Kassenleistung. Knochenerhaltende Maßnahmen sind privat.',
    verfuegbar: ALLE,
    related: ['sofortimplantate', 'zahnimplantate', 'weisheitszaehne', 'wurzelkanalbehandlung'],
    faq: [
      {
        frage: 'Was darf ich danach nicht tun?',
        antwort:
          'Für 24 Stunden: nicht rauchen, keinen Alkohol, keinen Kaffee, keine Milchprodukte, nicht spülen und keinen Sport. Wärme und körperliche Anstrengung fördern Nachblutungen. Kühlen Sie von außen in Intervallen.',
      },
      {
        frage: 'Sollte die Lücke sofort versorgt werden?',
        antwort:
          'Im sichtbaren Bereich meist ja, mit einem Provisorium. Im Seitenzahnbereich hängt es davon ab, ob der Gegenzahn sonst herauswandert. Wir planen die endgültige Versorgung idealerweise schon vor der Entfernung mit Ihnen durch.',
      },
    ],
  },

  // ─────────────────────────── Kinderzahnheilkunde ───────────────────────────
  {
    slug: 'kinderzahnarzt',
    name: 'Kinderzahnheilkunde',
    kategorie: 'kinder',
    kurz: 'Zahnmedizin, bei der Kinder gern wiederkommen.',
    teaser:
      'Bei Kindern zählt vor allem eines: Der erste Eindruck darf keine Angst machen. Wir nehmen uns Zeit zum Kennenlernen, erklären jedes Instrument kindgerecht und behandeln erst, wenn Vertrauen da ist. Das prägt die Einstellung zum Zahnarzt fürs ganze Leben.',
    synonyme: ['Kinderzahnarzt', 'Zahnarzt für Kinder', 'Milchzähne', 'erste Zahnarztbesuch Kind'],
    patientenfrage: 'Ab wann sollte mein Kind zum ersten Mal zum Zahnarzt?',
    dauer: '20 bis 45 Minuten',
    kosten: 'Für Kinder in der Regel ohne Zuzahlung',
    kasse:
      'Zahnärztliche Früherkennung ab dem 6. Lebensmonat sowie halbjährliche Kontrollen sind vollständig Kassenleistung. Auch Fissurenversiegelung der bleibenden Backenzähne wird übernommen.',
    verfuegbar: ALLE,
    related: ['kreidezaehne', 'kinderprophylaxe', 'fissurenversiegelung', 'zahnarztangst'],
    faq: [
      {
        frage: 'Ab welchem Alter sollten wir kommen?',
        antwort:
          'Sobald der erste Zahn da ist, spätestens zum ersten Geburtstag. Die ersten Termine dienen dem Kennenlernen und der Beratung – Ihr Kind soll die Praxis als harmlosen Ort erleben, bevor jemals etwas behandelt werden muss.',
      },
      {
        frage: 'Muss ein Loch im Milchzahn wirklich behandelt werden?',
        antwort:
          'Ja. Milchzähne halten den Platz für die bleibenden Zähne frei, und eine Entzündung kann den darunterliegenden bleibenden Zahn schädigen. Außerdem tut Karies auch Kindern weh.',
      },
      {
        frage: 'Wie bereite ich mein Kind auf den Termin vor?',
        antwort:
          'Am besten neutral und ohne Versprechen wie „das tut gar nicht weh“ – solche Sätze machen erst auf die Möglichkeit von Schmerz aufmerksam. Erzählen Sie einfach, dass jemand die Zähne anschauen und zählen möchte. Den Rest übernehmen wir.',
      },
    ],
  },
  {
    slug: 'kreidezaehne',
    name: 'Kreidezähne (MIH)',
    kategorie: 'kinder',
    kurz: 'Gelblich-bröckelige Zähne bei Kindern – erkennen, schützen, schmerzfrei behandeln.',
    teaser:
      'Bei Kreidezähnen ist der Zahnschmelz von Geburt an mineralarm gebildet. Die Zähne sind sehr empfindlich, brechen leichter und reagieren schlecht auf Betäubung. Mit früher Erkennung und intensiver Schutzbehandlung lässt sich viel erhalten.',
    synonyme: ['MIH', 'Molaren-Inzisiven-Hypomineralisation', 'weiße Flecken Zähne Kind', 'bröckelnde Zähne'],
    patientenfrage: 'Was sind Kreidezähne und was kann man dagegen tun?',
    dauer: 'Je nach Stadium 30 bis 60 Minuten',
    kosten: 'Grundbehandlung Kassenleistung, Intensivprophylaxe privat',
    kasse: 'Die Behandlung ist Kassenleistung. Zusätzliche Schutzmaßnahmen sind teils privat.',
    verfuegbar: ALLE,
    related: ['kinderzahnarzt', 'fissurenversiegelung', 'kinderprophylaxe', 'karies-behandlung'],
    faq: [
      {
        frage: 'Woher kommen Kreidezähne?',
        antwort:
          'Die Ursache ist nicht abschließend geklärt. Diskutiert werden Einflüsse in der Schwangerschaft und den ersten Lebensjahren. Sicher ist: Es liegt nicht an mangelnder Zahnpflege – das ist für viele Eltern eine wichtige Entlastung.',
      },
      {
        frage: 'Warum wirkt die Betäubung bei Kreidezähnen schlechter?',
        antwort:
          'Der chronisch gereizte Zahnnerv reagiert verändert. Wir kalkulieren das ein, arbeiten mit angepassten Techniken und behandeln bei starker Ausprägung auf Wunsch unter Sedierung.',
      },
      {
        frage: 'Bleiben die Zähne für immer so?',
        antwort:
          'Der Schmelz bildet sich nicht neu. Mit intensiver Fluoridierung, Versiegelung und – wo nötig – Überkronung lassen sich die Zähne aber gut schützen und erhalten, bis später eine dauerhafte Versorgung möglich ist.',
      },
    ],
  },
  {
    slug: 'kinderprophylaxe',
    name: 'Kinderprophylaxe',
    kategorie: 'kinder',
    kurz: 'Putztraining, Fluoridierung und Kontrolle – spielerisch statt belehrend.',
    teaser:
      'In der Kinderprophylaxe üben wir mit Ihrem Kind das Zähneputzen an den Stellen, die es selbst noch nicht erreicht, färben Beläge sichtbar ein und schützen die Zähne mit Fluoridlack.',
    synonyme: ['Individualprophylaxe', 'Putztraining Kind', 'Fluoridierung Kind', 'IP-Leistungen'],
    patientenfrage: 'Was passiert bei der Prophylaxe für Kinder?',
    dauer: '30 Minuten',
    kosten: 'Für Kinder von 6 bis 17 Jahren Kassenleistung',
    kasse:
      'Individualprophylaxe ist von 6 bis 17 Jahren zweimal jährlich Kassenleistung. Für Kinder unter 6 gibt es eigene Früherkennungsleistungen.',
    verfuegbar: ALLE,
    related: ['kinderzahnarzt', 'fissurenversiegelung', 'kreidezaehne'],
    faq: [
      {
        frage: 'Ab wann sollte mein Kind allein putzen?',
        antwort:
          'Nachputzen durch Erwachsene bleibt nötig, bis das Kind flüssig schreiben kann – meist bis etwa acht Jahre. Vorher fehlt die Feinmotorik für die Innenflächen und die hinteren Backenzähne.',
      },
    ],
  },
  {
    slug: 'fissurenversiegelung',
    name: 'Fissurenversiegelung',
    kategorie: 'kinder',
    kurz: 'Die tiefen Rillen der Backenzähne versiegeln, bevor Karies entsteht.',
    teaser:
      'Die Kauflächen der bleibenden Backenzähne haben tiefe Rillen, in die keine Zahnbürste hineinkommt. Ein dünner Kunststofflack verschließt sie – schmerzfrei, ohne Bohren und in wenigen Minuten.',
    synonyme: ['Versiegelung', 'Kariesschutz Backenzähne', 'Zähne versiegeln Kind'],
    patientenfrage: 'Ist eine Fissurenversiegelung sinnvoll?',
    dauer: '15 bis 30 Minuten',
    kosten: 'Kassenleistung für die bleibenden Backenzähne',
    kasse:
      'Die Versiegelung der bleibenden großen Backenzähne ist bei Kindern und Jugendlichen Kassenleistung. Weitere Zähne sind privat.',
    verfuegbar: ALLE,
    related: ['kinderprophylaxe', 'kreidezaehne', 'karies-behandlung'],
    faq: [
      {
        frage: 'Hält die Versiegelung dauerhaft?',
        antwort:
          'Sie nutzt sich mit den Jahren ab und wird bei den Kontrollterminen überprüft. Bei Bedarf wird sie ergänzt – das ist schnell und schmerzfrei.',
      },
    ],
  },

  // ─────────────────────────── Funktion & Schmerz ───────────────────────────
  {
    slug: 'cmd-behandlung',
    name: 'CMD & Kiefergelenkbeschwerden',
    kategorie: 'funktion',
    kurz: 'Wenn Kiefer, Nacken oder Ohren schmerzen und niemand die Ursache findet.',
    teaser:
      'Eine craniomandibuläre Dysfunktion entsteht, wenn Zähne, Kiefergelenke und Kaumuskulatur nicht zusammenpassen. Die Beschwerden zeigen sich oft weit weg vom Kiefer – als Kopfschmerz, Ohrgeräusch oder Nackenverspannung. Wir vermessen die Funktion systematisch und behandeln die Ursache.',
    synonyme: ['CMD', 'Kiefergelenkschmerzen', 'Kiefer knackt', 'Kieferverspannung', 'Tinnitus Kiefer'],
    patientenfrage: 'Können meine Kopfschmerzen vom Kiefer kommen?',
    dauer: 'Diagnostik 60 bis 90 Minuten, Therapie über mehrere Monate',
    kosten: 'Funktionsanalyse 200 bis 600 €, Schiene 350 bis 900 €',
    kasse:
      'Die gesetzliche Kasse übernimmt bei entsprechendem Befund die Schiene. Die instrumentelle Funktionsanalyse ist Privatleistung.',
    verfuegbar: KUDAMM_POTSDAM,
    related: ['knirscherschiene'],
    faq: [
      {
        frage: 'Woran erkenne ich, dass es CMD sein könnte?',
        antwort:
          'Typisch sind Knacken oder Reiben im Kiefergelenk, eingeschränkte Mundöffnung, morgendliche Verspannung der Wangenmuskulatur, wiederkehrender Kopfschmerz im Schläfenbereich und Ohrgeräusche ohne HNO-Befund. Häufig treten mehrere dieser Zeichen zusammen auf.',
      },
      {
        frage: 'Wie lange dauert die Behandlung?',
        antwort:
          'Erste Besserung berichten viele nach wenigen Wochen mit Schiene. Bis zur Stabilisierung vergehen meist drei bis sechs Monate. Bei ausgeprägten Fällen arbeiten wir mit Physiotherapie zusammen.',
      },
    ],
  },
  {
    /*
     * Übernommen von /leistungen/ganzheitliche-zahnmedizin/dentosophie/.
     *
     * Der Text stand dort veröffentlicht und ist damit fachlich freigegeben –
     * anders als die neu geschriebenen Behandlungstexte dieser Datei. Gekürzt
     * wurde er trotzdem: Auf der alten Seite standen zwischen den fachlichen
     * Abschnitten Praxiswerbung („7 Tage die Woche geöffnet",
     * „Prophylaxe-Shop"), die auf einer Leistungsseite nichts zu suchen hat.
     *
     * Die Adresse ist neu (/leistungen/dentosophie/ statt unter
     * „ganzheitliche-zahnmedizin"), die alte leitet hierher weiter.
     */
    slug: 'dentosophie',
    name: 'Dentosophie',
    kategorie: 'funktion',
    kurz: 'Atmung, Zungenlage und Biss ins Gleichgewicht bringen – ohne Zahnspange.',
    teaser:
      'Dentosophie setzt dort an, wo viele Beschwerden entstehen: bei Atmung, Zungenlage, Mundschluss, Kauen und Schlucken. Mit einem weichen Trainingsgerät und begleitenden Übungen verändern sich unbewusste Muster Schritt für Schritt – bei Kindern wie bei Erwachsenen.',
    synonyme: [
      'Dentosophie',
      'Balancer',
      'Aktivator',
      'myofunktionelle Therapie',
      'Mundatmung',
      'Zungenlage',
      'Schluckmuster',
      'ganzheitliche Kieferorthopädie',
      'Zahnspange ohne Draht',
    ],
    patientenfrage: 'Kann man Zahnfehlstellungen auch ohne feste Zahnspange behandeln?',
    dauer: 'Etwa sechs bis zwölf Monate, mit regelmäßigen Kontrollterminen',
    kasse:
      'Die gesetzliche Krankenkasse übernimmt die Dentosophie in der Regel nicht. Bei privater Versicherung und Zahnzusatzversicherungen hängt es vom Tarif ab – wir besprechen Ablauf und Kosten vor Beginn.',
    verfuegbar: KUDAMM_POTSDAM,
    /* Zwei Menschen, eine je Standort – siehe Feldkommentar oben. */
    behandler: ['clara-constanze-meinberg', 'dr-elisabeth-futterlieb'],
    related: ['cmd-behandlung', 'knirscherschiene', 'aligner'],
    ablauf: [
      {
        titel: 'Befund und Gespräch',
        text: 'Wir sehen uns an, wie Atmung, Zungenlage, Mundschluss, Kauen und Schlucken zusammenspielen – und was davon aus dem Takt geraten ist.',
        dauer: '60 Minuten',
      },
      {
        titel: 'Der Balancer',
        text: 'Ein weiches Trainingsgerät in Gebissform. Es unterstützt die richtige Zungenlage, fördert das physiologische Schlucken und begünstigt die Nasenatmung.',
      },
      {
        titel: 'Übungen für zu Hause',
        text: 'Myofunktionelle Übungen gegen das Muskelungleichgewicht. Die aktive Mitarbeit ist Teil des Konzepts – neue Bewegungsmuster übt man ein, sie stellen sich nicht ein.',
      },
      {
        titel: 'Regelmäßige Kontrolle',
        text: 'Über sechs bis zwölf Monate begleiten wir die Veränderung und passen Gerät und Übungen an.',
      },
    ],
    faq: [
      {
        frage: 'Für wen ist Dentosophie geeignet?',
        antwort:
          'Für Kinder und Jugendliche in der Entwicklung ebenso wie für Erwachsene. Sie ist ein sanfter Ansatz überall dort, wo funktionelle Auffälligkeiten eine Rolle spielen: Mundatmung, falsche Zungenlage, auffälliges Schlucken, Knirschen, Pressen oder Kieferfehlstellungen. Oft wird sie begleitend zu anderen zahnärztlichen Maßnahmen eingesetzt.',
      },
      {
        frage: 'Was ist der Balancer?',
        antwort:
          'Ein elastisches Trainingsgerät in Gebissform aus Kunststoff. Er unterstützt Zungenfunktion, Lippenschluss, Schlucken und Nasenatmung. Getragen wird er in der Therapiephase regelmäßig, zusammen mit den begleitenden Übungen.',
      },
      {
        frage: 'Wie lange dauert eine Dentosophie-Behandlung?',
        antwort:
          'Das hängt von Befund, Alter und Therapieziel ab. In der Regel umfasst sie einen Zeitraum von etwa sechs bis zwölf Monaten. Im Einzelfall kann eine längere Begleitung sinnvoll sein.',
      },
      {
        frage: 'Übernimmt die Krankenkasse die Kosten?',
        antwort:
          'Gesetzliche Krankenkassen übernehmen die Dentosophie in der Regel nicht. Bei privat Versicherten und privaten Zahnzusatzversicherungen hängt die Kostenübernahme vom jeweiligen Tarif ab. Wir beraten Sie vor Beginn der Behandlung ausführlich zu Ablauf und Kosten.',
      },
      {
        frage: 'Wann ist Dentosophie sinnvoll, wann eine Zahnspange?',
        antwort:
          'Dentosophie arbeitet an der Funktion, eine Zahnspange an der Stellung. Wo eine Fehlstellung durch ein ungünstiges Muster entstanden ist – Mundatmung, falsches Schlucken –, setzt die Dentosophie an der Ursache an. Wo die Stellung selbst das Problem ist, führt kein Weg an einer kieferorthopädischen Behandlung vorbei. Was in Ihrem Fall zutrifft, klärt der Befund.',
      },
    ],
  },
  {
    slug: 'knirscherschiene',
    name: 'Knirscherschiene',
    kategorie: 'funktion',
    kurz: 'Schutz für die Zähne, wenn nachts gepresst und geknirscht wird.',
    teaser:
      'Beim nächtlichen Knirschen wirken Kräfte, die ein Vielfaches der normalen Kaubelastung erreichen. Eine individuell angefertigte Schiene verteilt diese Kräfte und schützt Zahnschmelz, Füllungen, Kronen und Kiefergelenke.',
    synonyme: ['Aufbissschiene', 'Bruxismus', 'Zähneknirschen', 'Michigan-Schiene', 'Beißschiene'],
    patientenfrage: 'Woran merke ich, dass ich nachts mit den Zähnen knirsche?',
    dauer: '2 Termine',
    kosten: '350 bis 900 €',
    kasse: 'Bei dokumentiertem Befund übernimmt die gesetzliche Kasse die Standardschiene.',
    verfuegbar: ALLE,
    related: ['cmd-behandlung', 'veneers', 'keramik-kronen'],
    faq: [
      {
        frage: 'Woran erkenne ich Knirschen, wenn ich nachts schlafe?',
        antwort:
          'An abgeflachten Zahnkanten, empfindlichen Zähnen am Morgen, verspannter Wangenmuskulatur und Abdrücken der Zähne an der Zungenkante. Oft bemerkt es zuerst die Partnerin oder der Partner am Geräusch.',
      },
      {
        frage: 'Gewöhnt man sich an die Schiene?',
        antwort:
          'Die meisten nach wenigen Nächten. Falls die Schiene stört, passen wir sie nach – eine Schiene, die in der Schublade liegt, schützt nichts.',
      },
    ],
  },

  // ─────────────────────────── Angstfreie Behandlung ───────────────────────────
  {
    slug: 'zahnarztangst',
    name: 'Behandlung bei Zahnarztangst',
    kategorie: 'angst',
    kurz: 'Für alle, die den Termin seit Jahren vor sich herschieben.',
    teaser:
      'Zahnarztangst ist keine Charakterschwäche, sondern eine sehr häufige und gut behandelbare Reaktion. Bei uns bestimmen Sie das Tempo: Der erste Termin ist ein Gespräch, ohne Behandlung. Alles Weitere passiert erst, wenn Sie einverstanden sind.',
    synonyme: ['Angst vor dem Zahnarzt', 'Dentalphobie', 'Angstpatient', 'Panik Zahnarzt'],
    patientenfrage: 'Ich habe große Angst vor dem Zahnarzt – wie läuft der erste Termin ab?',
    dauer: 'Erstgespräch 30 bis 45 Minuten ohne Behandlung',
    kosten: 'Beratung Kassenleistung, Sedierung 250 bis 600 €',
    kasse: 'Die zahnärztliche Behandlung ist Kassenleistung, Sedierung und Narkose meist privat.',
    verfuegbar: ALLE,
    related: ['behandlung-in-narkose', 'lachgas', 'kinderzahnarzt'],
    faq: [
      {
        frage: 'Muss ich mich beim ersten Termin behandeln lassen?',
        antwort:
          'Nein. Der erste Termin ist ein Gespräch – Sie sitzen dabei nicht im Behandlungsstuhl, wenn Sie das nicht möchten. Wir schauen gemeinsam, was Sie brauchen, und legen fest, wie es weitergeht. Nichts passiert ohne Ankündigung.',
      },
      {
        frage: 'Werde ich für meine langen Behandlungspausen verurteilt?',
        antwort:
          'Nein. Sehr viele unserer Patientinnen und Patienten kommen nach Jahren zurück. Wir befunden, wir bewerten nicht – und wir sagen Ihnen ehrlich und ohne Dramatisierung, was ansteht.',
      },
      {
        frage: 'Was, wenn ich mitten in der Behandlung nicht mehr kann?',
        antwort:
          'Dann hören wir auf. Wir vereinbaren vorher ein Handzeichen, bei dem sofort pausiert wird. Diese Kontrolle zurückzubekommen, ist für viele Menschen der entscheidende Unterschied.',
      },
    ],
  },
  {
    slug: 'behandlung-in-narkose',
    name: 'Behandlung in Vollnarkose',
    kategorie: 'angst',
    kurz: 'Umfangreiche Behandlungen in einer Sitzung – Sie schlafen, wir arbeiten.',
    teaser:
      'Bei ausgeprägter Angst, starkem Würgereiz oder sehr umfangreichem Behandlungsbedarf ist eine Vollnarkose eine gute Lösung. Eine Anästhesistin oder ein Anästhesist überwacht Sie durchgehend, während wir alles Notwendige in einer Sitzung erledigen.',
    synonyme: ['Vollnarkose Zahnarzt', 'Zahnbehandlung im Schlaf', 'Sanierung in Narkose', 'ITN'],
    patientenfrage: 'Ist eine Zahnbehandlung unter Vollnarkose sicher?',
    dauer: '2 bis 5 Stunden in einer Sitzung',
    kosten: 'Narkose 600 bis 1.500 € zusätzlich zur Behandlung',
    kasse:
      'Die Kasse übernimmt die Narkose nur in bestimmten Fällen, etwa bei nachgewiesener Phobie oder Behinderung. Sonst ist sie privat zu tragen.',
    /* Von der Praxis bestätigt: Die Vollnarkose gibt es auch in Potsdam. */
    verfuegbar: KUDAMM_POTSDAM,
    related: ['zahnarztangst', 'lachgas', 'weisheitszaehne', 'all-on-4'],
    faq: [
      {
        frage: 'Wie sicher ist die Narkose?',
        antwort:
          'Sie wird von einer Fachärztin oder einem Facharzt für Anästhesie durchgeführt und durchgehend überwacht. Vorher findet ein Aufklärungsgespräch mit Prüfung Ihrer Vorerkrankungen statt. Für gesunde Menschen ist das Risiko sehr gering.',
      },
      {
        frage: 'Kann ich danach allein nach Hause?',
        antwort:
          'Nein. Sie brauchen eine Begleitperson und dürfen 24 Stunden nicht selbst Auto fahren oder wichtige Entscheidungen treffen.',
      },
    ],
  },
  {
    slug: 'lachgas',
    name: 'Behandlung mit Lachgas',
    kategorie: 'angst',
    kurz: 'Entspannt und ansprechbar – die sanfte Stufe zwischen Betäubung und Narkose.',
    teaser:
      'Lachgas wird über eine kleine Nasenmaske eingeatmet und wirkt innerhalb weniger Minuten. Sie bleiben wach und ansprechbar, empfinden die Situation aber als deutlich entspannter. Die Wirkung ist nach kurzer Zeit wieder vollständig weg.',
    synonyme: ['Lachgassedierung', 'N2O', 'Sedierung Zahnarzt', 'entspannt behandeln'],
    patientenfrage: 'Wie fühlt sich eine Behandlung mit Lachgas an?',
    dauer: 'Wirkt sofort, klingt nach 10 bis 15 Minuten ab',
    kosten: '80 bis 200 € je Sitzung',
    kasse: 'Privatleistung.',
    verfuegbar: KUDAMM_POTSDAM,
    related: ['zahnarztangst', 'behandlung-in-narkose', 'kinderzahnarzt', 'weisheitszaehne'],
    faq: [
      {
        frage: 'Darf ich danach Auto fahren?',
        antwort:
          'Nach einer Nachatmungsphase von etwa 15 Minuten mit reinem Sauerstoff ist die Wirkung vollständig abgeklungen. Anders als bei Narkose oder Tabletten dürfen Sie in der Regel danach selbst fahren – wir bestätigen das individuell.',
      },
      {
        frage: 'Ist Lachgas auch für Kinder geeignet?',
        antwort:
          'Ja, es ist bei Kindern gut untersucht und wird häufig eingesetzt, wenn eine Behandlung sonst nicht gelingt. Voraussetzung ist, dass das Kind durch die Nase atmen kann.',
      },
    ],
  },

  // ─────────────────────────── Diagnostik ───────────────────────────
  {
    slug: 'dvt-3d-roentgen',
    name: '3D-Röntgen (DVT)',
    kategorie: 'vorsorge',
    kurz: 'Dreidimensionale Aufnahme für Planungen, bei denen Millimeter zählen.',
    teaser:
      'Die digitale Volumentomographie zeigt Kiefer, Zähne und Nervverläufe dreidimensional. Sie kommt zum Einsatz, wenn eine zweidimensionale Aufnahme nicht genug Sicherheit gibt – etwa vor Implantationen oder Weisheitszahn-Operationen.',
    synonyme: ['DVT', 'Volumentomographie', '3D Röntgen Zahn', 'CT Zahnarzt'],
    patientenfrage: 'Wie hoch ist die Strahlenbelastung bei einem DVT?',
    dauer: '10 bis 20 Sekunden Aufnahme',
    kosten: '150 bis 350 €',
    kasse: 'In der Regel Privatleistung, in Einzelfällen Kassenleistung.',
    verfuegbar: KUDAMM_POTSDAM,
    related: ['zahnimplantate', 'weisheitszaehne', 'knochenaufbau', 'wurzelkanalbehandlung'],
    faq: [
      {
        frage: 'Wie hoch ist die Strahlenbelastung?',
        antwort:
          'Deutlich niedriger als bei einer medizinischen Computertomographie und je nach Gerät und Feldgröße etwa im Bereich weniger Tage natürlicher Hintergrundstrahlung. Wir erstellen eine Aufnahme nur bei klarer Indikation und wählen das kleinstmögliche Bildfeld.',
      },
      {
        frage: 'Kann ich die Aufnahme mitnehmen?',
        antwort:
          'Ja. Sie erhalten die Daten auf Wunsch digital – etwa für eine Zweitmeinung oder für mitbehandelnde Fachärztinnen und Fachärzte.',
      },
    ],
  },

  /*
   * ── Sieben Behandlungen, die es schon gab ────────────────────────────
   *
   * Diese sieben hatten auf ku64.de eigene Seiten mit zusammen 16.700
   * Wörtern und waren im ersten Neubau auf die Übersicht zusammengefaltet –
   * technisch saubere Weiterleitungen, inhaltlich weg. Ihr Fachtext steht in
   * `src/inhalte/langtexte.json` und wird von `Langtext.astro` gesetzt;
   * hier stehen nur die Angaben, die eine Behandlungsseite ausmachen.
   *
   * Zwei Dinge sind bewusst zurückhaltend gesetzt:
   *
   * `verfuegbar` steht auf dem Kurfürstendamm. Die alten Seiten nannten
   * durchweg „Praxis KU64 in Berlin Charlottenburg", und die Website ist
   * genau darauf gebaut, eine Behandlung nicht an einem Ort anzukündigen, an
   * dem es sie nicht gibt. Wo die Praxis mehr Standorte bestätigt, wird die
   * Liste erweitert – zu wenig behauptet ist heilbar, zu viel nicht.
   *
   * `kosten` fehlt überall. Die Preise der ästhetischen Medizin lagen nicht
   * in der Auswertung, aus der `preise.ts` stammt. Eine erfundene Spanne
   * wäre schlimmer als keine.
   *
   * Zur ästhetischen Medizin gehört ein Hinweis, der nicht technisch ist:
   * § 11 HWG setzt der Werbung für Botulinumtoxin und Hyaluron engere
   * Grenzen als bei zahnmedizinischen Leistungen. Der Text ist wortgleich
   * der der Praxis und stand dort jahrelang öffentlich; die rechtliche
   * Prüfung gehört trotzdem in die Freigabe.
   */
  {
    slug: 'zahnsanierung',
    name: 'Zahnsanierung',
    kategorie: 'zahnersatz',
    kurz: 'Mehrere Befunde in einem geplanten Ablauf behandeln – statt Zahn für Zahn.',
    teaser:
      'Wenn an vielen Zähnen gleichzeitig etwas zu tun ist, ist die Reihenfolge entscheidend. Eine Zahnsanierung plant alle Schritte vorab: was zuerst, was zusammen in einer Sitzung, was warten kann – und was das insgesamt kostet.',
    synonyme: [
      'Zahnsanierung',
      'Gebisssanierung',
      'Komplettsanierung',
      'Zähne komplett machen lassen',
      'Vollsanierung',
      'Zahnsanierung in Narkose',
    ],
    patientenfrage: 'Können mehrere kaputte Zähne in einem Durchgang behandelt werden?',
    verfuegbar: ['berlin-charlottenburg'],
    related: ['keramik-kronen', 'zahnimplantate', 'behandlung-in-narkose'],
    faq: [
      {
        frage: 'Wie lange dauert eine Zahnsanierung?',
        antwort:
          'Das hängt vom Befund ab und wird vor dem ersten Termin geplant. Der Unterschied zur Behandlung Zahn für Zahn liegt genau darin: Sie wissen von Anfang an, wie viele Sitzungen es werden.',
      },
      {
        frage: 'Geht das auch in einer Narkose?',
        antwort:
          'Ja. Gerade bei einer umfangreichen Sanierung lässt sich vieles in einer Sitzung zusammenfassen – siehe Behandlung in Narkose.',
      },
    ],
  },
  {
    slug: 'ganzheitliche-zahnmedizin',
    name: 'Ganzheitliche Zahnmedizin',
    kategorie: 'funktion',
    kurz: 'Den Mund im Zusammenhang mit dem übrigen Körper betrachten.',
    teaser:
      'Kiefergelenk, Zähne, Muskulatur und Haltung hängen zusammen. Die ganzheitliche Zahnheilkunde sucht die Ursache nicht immer dort, wo der Schmerz sitzt – und arbeitet bei Bedarf mit Osteopathie und Physiotherapie zusammen.',
    synonyme: [
      'ganzheitliche Zahnmedizin',
      'ganzheitliche Zahnheilkunde',
      'biologische Zahnmedizin',
      'Zahnmedizin und Osteopathie',
      'Materialunverträglichkeit',
    ],
    patientenfrage: 'Können Zähne Beschwerden im ganzen Körper auslösen?',
    verfuegbar: ['berlin-charlottenburg'],
    related: ['cmd-behandlung', 'dentosophie', 'knirscherschiene'],
    faq: [
      {
        frage: 'Was ist daran anders als an einer normalen Behandlung?',
        antwort:
          'Der Blick ist weiter: Neben dem Befund am Zahn geht es um Kiefergelenk, Muskulatur, Haltung und Materialverträglichkeit. Die Behandlung selbst folgt derselben Zahnmedizin.',
      },
    ],
  },
  {
    slug: 'kieferchirurgische-kombinationstherapie',
    name: 'Kieferchirurgische Kombinationstherapie',
    kategorie: 'chirurgie',
    kurz: 'Zahnspange und Kieferoperation zusammen, wenn die Kiefer zueinander falsch stehen.',
    teaser:
      'Bei ausgewachsenen Kiefern lässt sich eine deutliche Fehlstellung nicht mehr allein mit einer Zahnspange lösen. Kieferorthopädie und Kieferchirurgie arbeiten dann in einem gemeinsamen Plan – erst die Zähne in Position, dann die Kiefer.',
    synonyme: [
      'kieferchirurgische Kombinationstherapie',
      'Dysgnathie',
      'Kieferfehlstellung Operation',
      'Umstellungsosteotomie',
      'Kieferverlagerung',
    ],
    patientenfrage: 'Was passiert, wenn Ober- und Unterkiefer nicht zueinander passen?',
    verfuegbar: ['berlin-charlottenburg'],
    related: ['feste-zahnspange', 'weisheitszaehne', 'cmd-behandlung'],
    faq: [
      {
        frage: 'Warum reicht eine Zahnspange nicht?',
        antwort:
          'Eine Zahnspange bewegt Zähne, keine Kiefer. Steht der Kiefer selbst falsch, verschiebt sie die Zähne nur innerhalb der falschen Position – die Ursache bleibt.',
      },
    ],
  },
  {
    slug: 'longevity',
    name: 'Longevity Zahnmedizin',
    kategorie: 'vorsorge',
    kurz: 'Die eigenen Zähne so lange behalten wie möglich – als Plan, nicht als Hoffnung.',
    teaser:
      'Zähne altern mit. Das Longevity-Konzept behandelt Zahngesundheit als etwas, das über Jahrzehnte geplant wird: Substanz erhalten, statt sie später zu ersetzen, und Entzündungen früh finden, weil sie nicht im Mund bleiben.',
    synonyme: [
      'Longevity',
      'Longevity Zahnmedizin',
      'Zahngesundheit im Alter',
      'Zähne lange behalten',
      'präventive Zahnmedizin',
      'Zahnmedizin und Lebenserwartung',
    ],
    patientenfrage: 'Was kann ich tun, um meine eigenen Zähne bis ins Alter zu behalten?',
    verfuegbar: ['berlin-charlottenburg'],
    related: ['prophylaxe-4-0', 'zahnvorsorge', 'parodontitis-behandlung'],
    faq: [
      {
        frage: 'Ist das eine Behandlung oder ein Konzept?',
        antwort:
          'Ein Konzept, das die einzelnen Behandlungen ordnet: Prophylaxe, Früherkennung und Zahnerhalt in einer Reihenfolge, die auf Jahrzehnte angelegt ist.',
      },
    ],
  },
  {
    slug: 'faltenbehandlung',
    name: 'Faltenbehandlung',
    kategorie: 'aesthetik-medizin',
    kurz: 'Mimikfalten glätten – ohne Operation, im ärztlichen Rahmen.',
    teaser:
      'Falten entstehen dort, wo sich das Gesicht bewegt. Eine Behandlung mit Botulinumtoxin entspannt gezielt einzelne Muskeln; das Ergebnis hält einige Monate und ist umkehrbar. Durchgeführt von Ärztinnen und Ärzten der Praxis.',
    synonyme: [
      'Faltenbehandlung',
      'Botox',
      'Botulinumtoxin',
      'Falten glätten',
      'Stirnfalten',
      'Krähenfüße',
      'Faltenbehandlung Berlin',
    ],
    patientenfrage: 'Wie lange hält eine Faltenbehandlung?',
    verfuegbar: ['berlin-charlottenburg'],
    related: ['zornesfalte', 'hyaluron-lippen', 'smile-design'],
    faq: [
      {
        frage: 'Ist das umkehrbar?',
        antwort:
          'Ja. Die Wirkung baut sich nach einigen Monaten von selbst ab. Wer nicht nachbehandeln lässt, kehrt in den Ausgangszustand zurück.',
      },
      {
        frage: 'Warum bei einer Zahnarztpraxis?',
        antwort:
          'Weil dieselben Muskeln, die Falten bilden, auch beim Kauen und Sprechen arbeiten – und weil die Ärztinnen und Ärzte hier die Gesichtsanatomie täglich vor sich haben.',
      },
    ],
  },
  {
    slug: 'zornesfalte',
    name: 'Zornesfalte behandeln',
    kategorie: 'aesthetik-medizin',
    kurz: 'Die Falte zwischen den Augenbrauen, die strenger wirkt, als man sich fühlt.',
    teaser:
      'Die Zornesfalte entsteht durch einen kleinen Muskel zwischen den Augenbrauen, der bei Konzentration mitarbeitet. Wird er gezielt entspannt, verliert der Blick den strengen Ausdruck, ohne dass die Mimik verschwindet.',
    synonyme: [
      'Zornesfalte',
      'Glabellafalte',
      'Falte zwischen den Augenbrauen',
      'Zornesfalte entfernen',
      'Stirnfalte',
    ],
    patientenfrage: 'Kann man die Falte zwischen den Augenbrauen behandeln?',
    verfuegbar: ['berlin-charlottenburg'],
    related: ['faltenbehandlung', 'hyaluron-lippen'],
    faq: [
      {
        frage: 'Sieht man danach noch, wenn ich mich freue?',
        antwort:
          'Ja. Behandelt wird ein einzelner Muskel, nicht das Gesicht. Ziel ist, den unbeabsichtigt strengen Ausdruck zu nehmen – nicht die Mimik.',
      },
    ],
  },
  {
    slug: 'hyaluron-lippen',
    name: 'Hyaluron-Behandlung',
    kategorie: 'aesthetik-medizin',
    kurz: 'Volumen mit einem Stoff, den der Körper selbst herstellt.',
    teaser:
      'Hyaluronsäure bindet Wasser und gibt Volumen zurück – an den Lippen, an den Wangen, in einzelnen Falten. Der Körper baut sie über Monate wieder ab, weshalb sich das Ergebnis in Schritten aufbauen lässt.',
    synonyme: [
      'Hyaluron',
      'Hyaluronsäure',
      'Lippen aufspritzen',
      'Lippenunterspritzung',
      'Volumenaufbau',
      'Nasolabialfalte',
    ],
    patientenfrage: 'Wie natürlich sieht eine Lippenbehandlung mit Hyaluron aus?',
    verfuegbar: ['berlin-charlottenburg'],
    related: ['faltenbehandlung', 'zornesfalte', 'smile-design'],
    faq: [
      {
        frage: 'Was passiert, wenn es mir nicht gefällt?',
        antwort:
          'Hyaluronsäure wird vom Körper abgebaut und lässt sich zusätzlich mit einem Enzym auflösen. Deshalb wird in kleinen Schritten gearbeitet.',
      },
    ],
  },
];

// ─────────────────────────── Hilfsfunktionen ───────────────────────────

export const LEISTUNG_SLUGS = LEISTUNGEN.map((l) => l.slug);

export function getLeistung(slug: string): Leistung | undefined {
  return LEISTUNGEN.find((l) => l.slug === slug);
}

export function getKategorie(slug: string): Kategorie | undefined {
  return KATEGORIEN.find((k) => k.slug === slug);
}

/** Alle Leistungen, die an einem bestimmten Standort angeboten werden. */
export function leistungenFuerStandort(standortSlug: string): Leistung[] {
  return LEISTUNGEN.filter((l) => l.verfuegbar.includes(standortSlug));
}

/** Alle Leistungen, die an einem Standort NICHT angeboten werden – aber woanders schon. */
export function leistungenNichtAmStandort(standortSlug: string): Leistung[] {
  return LEISTUNGEN.filter(
    (l) => !l.verfuegbar.includes(standortSlug) && l.verfuegbar.length > 0,
  );
}

/** Kategorien mit ihren am Standort verfügbaren Leistungen, sortiert. */
export function kategorienMitLeistungen(standortSlug: string) {
  return KATEGORIEN.map((k) => ({
    kategorie: k,
    leistungen: leistungenFuerStandort(standortSlug).filter((l) => l.kategorie === k.slug),
  }))
    .filter((g) => g.leistungen.length > 0)
    .sort((a, b) => a.kategorie.rang - b.kategorie.rang);
}

/**
 * Verwandte Leistungen für die interne Verlinkung – aufgelöst und danach
 * gefiltert, ob sie am aktuellen Standort verfügbar sind. Verwandte Leistungen,
 * die es hier nicht gibt, werden mit dem Zielstandort zurückgegeben, damit die
 * Seite gezielt dorthin verlinken kann statt ins Leere.
 */
export interface VerwandteLeistung {
  leistung: Leistung;
  /** Gibt es die verwandte Leistung am aufgerufenen Standort? */
  amStandort: boolean;
  /** Standorte, an denen es sie gibt – für den Verweis „dort schon". */
  alternativStandorte: string[];
}

export function verwandteLeistungen(leistung: Leistung, standortSlug: string): VerwandteLeistung[] {
  return leistung.related
    .map((slug) => getLeistung(slug))
    .filter((l): l is Leistung => Boolean(l))
    .map((l) => ({
      leistung: l,
      amStandort: l.verfuegbar.includes(standortSlug),
      alternativStandorte: l.verfuegbar,
    }));
}

/** Alle gültigen Standort × Leistung-Kombinationen – Basis für getStaticPaths. */
export function alleKombinationen() {
  const paare: { standort: string; leistung: Leistung }[] = [];
  for (const l of LEISTUNGEN) {
    for (const s of l.verfuegbar) {
      paare.push({ standort: s, leistung: l });
    }
  }
  return paare;
}

/**
 * Beschwerde-Seiten, die noch fehlen.
 *
 * Diese vier Verweise standen als `related` in mehreren Behandlungen und
 * zeigten ins Leere – geschrieben in der Annahme, dass es die Seiten gibt.
 * Der Datenwächter hat sie gefunden; sie sind hier festgehalten statt
 * stillschweigend gelöscht, denn sie sind aus drei Gründen die wertvollsten
 * fehlenden Seiten der ganzen Website:
 *
 * 1. Menschen suchen nach ihrem Symptom, nicht nach dem Fachbegriff. Niemand
 *    tippt "Parodontitis-Therapie" ein, bevor er weiß, dass er sie braucht –
 *    getippt wird "Zahnfleisch blutet".
 * 2. Der Altbestand hatte sie: unter /zahnbeschwerden/ und als eigene Seiten
 *    wie /zahn-abgebrochen/. Diese Adressen laufen derzeit ins Leere.
 * 3. Sie sind der natürliche Einstieg in die interne Verlinkung: von der
 *    Beschwerde zur Behandlung zum Standort, an dem es sie gibt.
 *
 * Beim Anlegen jeweils die alte Adresse als Slug übernehmen, damit die
 * Platzierung erhalten bleibt.
 */
export const BESCHWERDEN_GEPLANT = [
  { slug: 'zahnschmerzen', fuehrtZu: ['wurzelkanalbehandlung', 'karies-behandlung', 'cmd-behandlung'] },
  { slug: 'zahnfleischbluten', fuehrtZu: ['parodontitis-behandlung', 'professionelle-zahnreinigung'] },
  { slug: 'mundgeruch', fuehrtZu: ['professionelle-zahnreinigung', 'prophylaxe-4-0'] },
  { slug: 'kopfschmerzen-kiefer', fuehrtZu: ['cmd-behandlung', 'knirscherschiene'] },
  { slug: 'zahn-abgebrochen', fuehrtZu: ['karies-behandlung', 'keramik-kronen'] },
] as const;
