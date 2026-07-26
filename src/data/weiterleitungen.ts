/**
 * Wohin die Adressen des Altbestands führen.
 *
 * ── Warum das eine Datendatei ist und keine Serverkonfiguration ──────────
 *
 * Eine Weiterleitung ist eine inhaltliche Entscheidung: Welche Seite meint
 * jemand, der diese alte Adresse anklickt? Diese Entscheidung gehört zu den
 * Inhalten und nicht in eine Datei, die beim nächsten Umzug des Servers
 * verlorengeht. `astro.config.mjs` liest sie hier aus, `npm run
 * urls:abgleichen` prüft dagegen. Eine Quelle, zwei Verwendungen.
 *
 * ── Was hier NICHT steht ────────────────────────────────────────────────
 *
 * Die Zuordnung Behandlung → alte Adressen steht in `leistungen.ts` am Feld
 * `alteAdressen`, die Zuordnung Person → alte Adressen in `team.ts`. Beide
 * werden hier eingelesen und ausgerechnet. Wer eine Behandlung umbenennt,
 * ändert ihre alten Adressen an derselben Stelle mit; eine zentrale Liste
 * würde dabei still veralten.
 *
 * ── Die Rangfolge der Ziele ─────────────────────────────────────────────
 *
 * 1. Dieselbe Adresse. Kostet nichts und verliert nichts – deshalb steht in
 *    diesen Tabellen nichts, was es unter seiner alten Adresse schon gibt.
 * 2. Die inhaltlich gleiche Seite. `/leistungen/zahnaesthetik/veneers/` →
 *    `/leistungen/veneers/`.
 * 3. Die Übersicht, auf der die Seite stünde. Ein Sprungziel wie
 *    `/leistungen/#kieferorthopaedie` bringt jemanden immerhin an die Stelle,
 *    an der die Kategorie steht.
 * 4. Die Startseite. Sie kommt in dieser Datei nicht vor. Wer aus der Suche
 *    nach „Zahnfleischbluten" auf einer Startseite landet, geht zurück.
 *
 * ── Warum 308 und nicht 301 ─────────────────────────────────────────────
 *
 * Der Node-Adapter beantwortet konfigurierte Weiterleitungen mit 308
 * (Permanent Redirect), unabhängig davon, was hier steht. 308 und 301 sind
 * für Suchmaschinen gleichwertig – beide sagen „dauerhaft umgezogen" und
 * übertragen die Platzierung. Der Unterschied betrifft nur, ob ein POST beim
 * Folgen zu einem GET werden darf, und das spielt für Verkehr aus der Suche
 * keine Rolle.
 */

import { LEISTUNGEN } from './leistungen.ts';
import { TEAM } from './team.ts';
import { STANDORT_SLUGS } from './standorte.ts';

/**
 * Standortkürzel, die schon der Altbestand als Adresspräfix führte.
 *
 * Der alte Standortpfad war flach: `/potsdam/parodontitisbehandlung/` statt
 * `/potsdam/leistungen/parodontitis-behandlung/`. Das Präfix ist trotzdem
 * dasselbe, und daran erkennt die Auflösung, dass die Person eine bestimmte
 * Praxis meinte und nicht die Behandlung im Allgemeinen.
 */
const ALTE_STANDORTPRAEFIXE = ['potsdam', 'berlinmitte', 'berlin-charlottenburg', 'wilmersdorf'];

/** Sprachpräfixe, die im Altbestand vorkamen. */
const SPRACHPRAEFIXE = ['en', 'fr'];

function ohneSchraegstrich(pfad: string): string {
  return pfad.endsWith('/') && pfad.length > 1 ? pfad.slice(0, -1) : pfad;
}

/**
 * Zerlegt eine alte Adresse in Sprache, Standort und Rest.
 *
 * `/en/services/veneers/` → { sprache: 'en', standort: null }
 * `/potsdam/bleaching/`   → { sprache: '',   standort: 'potsdam' }
 */
function zerlegen(pfad: string): { sprache: string; standort: string | null } {
  const teile = pfad.split('/').filter(Boolean);
  let sprache = '';
  if (teile.length && SPRACHPRAEFIXE.includes(teile[0]!)) sprache = teile.shift()!;
  const standort = teile.length && ALTE_STANDORTPRAEFIXE.includes(teile[0]!) ? teile[0]! : null;
  return { sprache, standort };
}

// ── 1. Behandlungen ───────────────────────────────────────────────────

/**
 * Aus `leistungen.ts`: jede alte Adresse auf ihre Behandlung.
 *
 * Trug die alte Adresse ein Standortpräfix und bietet der Standort die
 * Behandlung heute an, führt die Weiterleitung auf die Standortfassung –
 * sonst auf die allgemeine. Wer in Potsdam nach Parodontitis gesucht hat,
 * soll in Potsdam landen und nicht am Kurfürstendamm.
 */
function ausBehandlungen(): Record<string, string> {
  const karte: Record<string, string> = {};
  for (const leistung of LEISTUNGEN) {
    for (const alt of leistung.alteAdressen ?? []) {
      const { sprache, standort } = zerlegen(alt);
      const praefix = sprache ? `/${sprache}` : '';
      const amStandort = standort && leistung.verfuegbar.includes(standort);
      karte[ohneSchraegstrich(alt)] = amStandort
        ? `${praefix}/${standort}/leistungen/${leistung.slug}/`
        : `${praefix}/leistungen/${leistung.slug}/`;
    }
  }
  return karte;
}

// ── 2. Personen ───────────────────────────────────────────────────────

/**
 * Aus `team.ts`: jede alte Personenseite auf die Teamseite ihres Standorts.
 *
 * Personenseiten gibt es auf der neuen Website noch nicht – solange niemand
 * bestätigt hat, dass die Person da ist und wie sie heißt, wäre eine eigene
 * Seite eine Behauptung. Die Teamseite des richtigen Standorts ist das
 * nächstliegende Ziel: dieselbe Praxis, dieselbe Absicht.
 */
function ausTeam(): Record<string, string> {
  const karte: Record<string, string> = {};
  for (const person of TEAM) {
    const standort = person.standorte.find((s) => STANDORT_SLUGS.includes(s)) ?? 'berlin-charlottenburg';
    for (const alt of person.alteAdressen ?? []) {
      karte[ohneSchraegstrich(alt)] = `/${standort}/team/`;
    }
  }
  return karte;
}

// ── 3. Alles Übrige ───────────────────────────────────────────────────

const KUDAMM_TEAM = '/berlin-charlottenburg/team/';

/**
 * Seiten, die keine Behandlung und keine Person sind.
 *
 * Sortiert nach Bereich, nicht alphabetisch – wer eine Zeile ändert, will die
 * Nachbarzeilen sehen.
 */
const SEITEN: Record<string, string> = {
  // ── Allgemeine Seiten, die nur den Namen gewechselt haben ──────────
  '/contact': '/kontakt/',
  '/datenschutzerklaerung': '/datenschutz/',
  '/online-termine': '/termine/',
  /* Die alte Downloadseite trug die Anamnesebögen. Genau die füllt man auf
     der neuen Website direkt aus, statt sie herunterzuladen. */
  '/downloads': '/anamnese/',
  '/anamnese-2': '/potsdam/anamnese/',
  '/link-tree': '/',
  '/medienecho': '/ueber-uns/',
  '/das-sind-wir': '/ueber-uns/',
  '/unkategorisiert/ku64-kooperationen': '/ueber-uns/',
  '/kontakt/anfahrt': '/standorte/',

  // ── Notfall ────────────────────────────────────────────────────────
  /* Ein abgebrochener Zahn ist keine Behandlungsfrage, sondern eine
     Zeitfrage. Diese Adressen gehören auf die Notfallseite und nicht auf
     eine Leistungsbeschreibung. */
  '/zahnunfall': '/notfall/',
  '/zahn-abgebrochen': '/notfall/',
  '/zahnbeschwerden/zahn-abgebrochen': '/notfall/',
  '/zahnbeschwerden/zahnschmerzen': '/notfall/',
  '/zahnbeschwerden/druckschmerz': '/notfall/',
  '/zahnbeschwerden': '/leistungen/',

  // ── Kategorien des Altbestands ─────────────────────────────────────
  /* Die alte Website hatte Kategorieseiten je Fachgebiet, die neue hat eine
     Übersicht mit Sprungzielen. Das Sprungziel bringt jemanden an dieselbe
     Stelle – nicht dasselbe wie eine eigene Seite, aber näher als die
     Übersicht von oben. Eigene Kategorieseiten wären der bessere Zustand;
     sie stehen in OFFEN.md. */
  '/leistungen/kieferorthopaedie': '/leistungen/#kieferorthopaedie',
  '/leistungen/kieferchirurgie-mkg-chirurgie': '/leistungen/#chirurgie',
  '/leistungen/kieferchirurgie-mkg-chirurgie/kieferchirurgische-kombinationstherapie':
    '/leistungen/#chirurgie',
  '/leistungen/zahnaesthetik': '/leistungen/#aesthetik',
  '/leistungen/zahnaesthetik/zahnersatz': '/leistungen/#zahnersatz',
  '/leistungen/zahnaesthetik/zahnsanierung': '/leistungen/#zahnersatz',
  '/leistungen/ganzheitliche-zahnmedizin': '/leistungen/',

  // ── Angebote, die es auf der neuen Website nicht gibt ──────────────
  /* Ästhetische Medizin (Falten, Hyaluron), Laser, Longevity, Dentosophie
     und der Kosmetikbereich stehen im neuen Katalog nicht. Sie auf eine
     ähnlich klingende Behandlung zu leiten wäre eine falsche Zusage –
     deshalb die Übersicht. Ob die Angebote weiterhin bestehen, ist eine
     Frage an die Praxis und in OFFEN.md vermerkt. */
  '/leistungen/aesthetische-medizin': '/leistungen/',
  '/leistungen/aesthetische-medizin/faltenbehandlung-in-berlin': '/leistungen/',
  '/leistungen/aesthetische-medizin/hyaluron-lippen': '/leistungen/',
  '/leistungen/aesthetische-medizin/zornesfalte-entfernen': '/leistungen/',
  '/leistungen/ganzheitliche-zahnmedizin/dentosophie': '/leistungen/',
  '/leistungen/ganzheitliche-zahnmedizin/longevity': '/leistungen/',
  '/leistungen/ganzheitliche-zahnmedizin/laserbehandlung': '/leistungen/',
  '/laserbehandlung': '/leistungen/',
  '/schmerzfreie-zahnbehandlung-mit-dem-laser': '/leistungen/',
  '/infusionstherapie-reviv': '/leistungen/',
  '/leistungen/beauty-cosmetics': '/leistungen/',
  '/leistungen/beauty-cosmetics/hautarzt': '/leistungen/',
  '/leistungen/beauty-cosmetics/ku64-cosmetics': '/leistungen/',
  '/leistungen/beauty-cosmetics/hautarzt__trashed/hauttumorchirurgie': '/leistungen/',
  '/leistungen/beauty-cosmetics/hautarzt__trashed/hyperhidrose': '/leistungen/',
  '/leistungen/cosmetics': '/leistungen/',
  '/leistungen/beauty-cosmetics/matrixtherapie': '/leistungen/',
  /* Tippfehler im Altbestand: „leistugen". Er stand jahrelang in der
     .htaccess und ist damit eine Adresse wie jede andere. */
  '/leistugen/beauty-cosmetics': '/leistungen/',
  '/leistugen/beauty-cosmetics/hauttumorchirurgie': '/leistungen/',

  // ── Potsdam ────────────────────────────────────────────────────────
  '/potsdam-neu': '/potsdam/',
  '/potsdam/link-tree': '/potsdam/',
  '/potsdam/www.ku64.de': '/potsdam/',
  '/potsdam/kontakt-potsdam': '/potsdam/kontakt/',
  '/potsdam/jobs-und-karriere': '/karriere/',
  '/potsdam/jobs-und-karriere-potsdam': '/karriere/',
  '/potsdam/zahnaesthetik': '/potsdam/leistungen/',
  '/potsdam/zahnasthetik': '/potsdam/leistungen/',
  '/potsdam/zahnersatz': '/potsdam/leistungen/',
  '/potsdam/laserbehandlung-potsdam': '/potsdam/leistungen/',
  '/potsdam/zahnbehandlung-laser': '/potsdam/leistungen/',
  '/potsdam/schonende-zahnbehandlung-mit-laser-ihr-laser-zahnarzt-ku64-potsdam':
    '/potsdam/leistungen/',
  '/potsdam/ultraschall-reiniger': '/ueber-uns/',

  // ── Berlin-Mitte ───────────────────────────────────────────────────
  '/berlinmitte-2': '/berlinmitte/',
  '/berlinmitte-2-2/link-tree': '/berlinmitte/',
  '/berlinmitte/link-tree': '/berlinmitte/',

  // ── Team: Gruppenseiten und Sammeladressen ─────────────────────────
  /* Die alte Website führte ein Team über alle Standorte hinweg, gegliedert
     nach Gruppen. Die neue führt es je Standort. Ohne belegte Zuordnung
     zeigt die Gruppenseite auf den Kurfürstendamm – dort lagen im
     Altbestand alle Gruppen, die kein eigenes Standortpräfix trugen. */
  '/team': KUDAMM_TEAM,
  '/team-2': KUDAMM_TEAM,
  '/team-za-berlin': KUDAMM_TEAM,
  '/zahnaerzte': KUDAMM_TEAM,
  '/prophylaxe': KUDAMM_TEAM,
  '/verwaltung-2': KUDAMM_TEAM,
  '/telefon-service': KUDAMM_TEAM,
  '/rezeption-und-service': KUDAMM_TEAM,
  '/auszubildende': KUDAMM_TEAM,
  '/teams': KUDAMM_TEAM,
  '/bleaching-and-cosmetics': KUDAMM_TEAM,
  /* Jana Jain steht bewusst nicht in team.ts – sie arbeitet nicht mehr bei
     KU64, und ihre Seite ist auf ku64.de bereits eine Fehlerseite. Die
     Adresse kennt Google trotzdem. */
  '/jana-jain': KUDAMM_TEAM,
  '/kommunikation-human-resources__trashed/susan-feldmann': KUDAMM_TEAM,

  // ── Personal und Bewerbung ─────────────────────────────────────────
  '/human-resources': '/karriere/',
  '/communication-and-human-recources': '/karriere/',
  '/jobs-karriere': '/karriere/',

  // ── Blog: Beiträge mit fachlichem Inhalt ───────────────────────────
  /* Den Blog gibt es auf der neuen Website noch nicht. Wo ein Beitrag ein
     erkennbares Thema hat, führt er dorthin – der Rest steht weiter unten
     als Muster. Sobald der Blog steht, verschwinden diese Zeilen zugunsten
     der Beiträge selbst. */
  '/blog': '/ueber-uns/',
  '/fachbeitraege': '/ueber-uns/',
  '/blog/mundpilz-hausmittel': '/leistungen/zahnvorsorge/',
  '/blog/zahnprothese-reinigen': '/leistungen/teilprothese/',
  '/blog/zahnseide-vorher-oder-nachher': '/leistungen/professionelle-zahnreinigung/',
  '/blog/weisse-weihnachten-weisse-zaehne-exklusiv-bei-den-zahnspezialisten-von-ku64':
    '/leistungen/zahnaufhellung/',
  '/blog/white-smile-das-perfekte-hochzeitslaecheln-zu-ihrem-schoensten-tag':
    '/leistungen/zahnaufhellung/',
  '/blog/ultraschallreiniger-potsdam-strahlender-zahnersatz': '/potsdam/',
  '/blog/interview-dentosophie-clara-constanze-meinberg': KUDAMM_TEAM,

  // ── Blog: Stellenanzeigen ──────────────────────────────────────────
  '/blog/ku64-sucht-mitarbeiter': '/karriere/',
  '/blog/ku64-sucht-neues-kompetentes-personal': '/karriere/',
  '/blog/ku64-sucht-endodontiespezialisten-zur-teamverstaerkung': '/karriere/',
  '/blog/ku64-mitarbeiter-und-mitarbeitersuche': '/karriere/',
  '/blog/zfa-m-w-gesucht': '/karriere/',
  '/blog/weihnachtswichtel-gesucht': '/karriere/',
  '/blog/weihnachtswichtel-gesucht-2': '/karriere/',
  '/blog/unterstuetzt-den-boys-day': '/karriere/',
  '/blog/boys-day-in-der-zahnarztpraxis-ku64-3': '/karriere/',
  '/blog/neue-kollegin-bei-ku64-herzlich-willkommen-anika-pia-sievers-dentalberatung': KUDAMM_TEAM,
  '/blog/neue-zahnaerztin-bei-ku64-mit-spezialisierung-in-zahnaesthetik-und-endodontie-dr-sandra-viktorov':
    KUDAMM_TEAM,

  // ── Englisch ───────────────────────────────────────────────────────
  /* Die englische Fassung des Altbestands hatte eigene, englische Slugs.
     Die neue Website übersetzt die Texte, nicht die Adressen – Deutsch ist
     Quellsprache, und `/en/leistungen/veneers/` bleibt unter demselben
     Slug wie die deutsche Fassung. Das ist eine Entscheidung, keine
     Nachlässigkeit: zwei Adressbestände je Sprache zu pflegen ist die
     häufigste Quelle für tote Adressen bei mehrsprachigen Websites. */
  '/en/about-us': '/en/ueber-uns/',
  '/en/charlottenburg-berlin': '/en/berlin-charlottenburg/',
  '/en/contact': '/en/kontakt/',
  '/en/dental-problems': '/en/leistungen/',
  '/en/dentist-berlin-mitte': '/en/berlinmitte/',
  '/en/imprint': '/en/impressum/',
  '/en/jobs-career': '/en/karriere/',
  '/en/privacy-policy': '/en/datenschutz/',
  '/en/services': '/en/leistungen/',
  '/en/services/aesthetic-dentistry-dental-aesthetics': '/en/leistungen/#aesthetik',
  '/en/services/aesthetic-dentistry-dental-aesthetics/dentures': '/en/leistungen/#zahnersatz',
  '/en/services/aesthetic-dentistry-dental-aesthetics/dental-remediation':
    '/en/leistungen/#zahnersatz',
  '/en/services/oral-surgery-mkg-surgery': '/en/leistungen/#chirurgie',
  '/en/services/oral-surgery-mkg-surgery/maxillofacial-combination-therapy':
    '/en/leistungen/#chirurgie',
  '/en/services/orthodontics': '/en/leistungen/#kieferorthopaedie',
  '/en/services/holistic-dentistry': '/en/leistungen/',
  '/en/services/holistic-dentistry/laser-treatment': '/en/leistungen/',
  '/en/services/medicine-aesthetic': '/en/leistungen/',
  '/en/services/medicine-aesthetic/hyaluronic-acid-fillers-berlin-ku64': '/en/leistungen/',
  '/en/services/medicine-aesthetic/wrinkle-treatment-in-berlin': '/en/leistungen/',
  '/en/services/medicine-aesthetic/wrinkles-forehead': '/en/leistungen/',
};

/**
 * Ganze Familien, ausgeschrieben.
 *
 * Astro erlaubt in einer Weiterleitung kein Muster mit festem Ziel – ein
 * `[person]` in der Quelle müsste im Ziel wieder vorkommen. Das ist keine
 * Schikane, sondern verhindert, dass eine Regel unbemerkt Adressen einfängt,
 * die niemand geprüft hat.
 *
 * Also stehen sie hier einzeln. Jede Zeile ist eine Adresse, die es auf
 * ku64.de wirklich gibt – erhoben durch `analyse/altbestand/crawl.mjs`, nicht
 * geraten. Wächst der Altbestand, wächst diese Liste; verschwindet eine
 * Adresse, bleibt sie trotzdem stehen, denn Google vergisst langsam.
 */

/**
 * Personenseiten des Altbestands.
 *
 * Die alte Website hatte für jede Person eine eigene Seite, die neue hat sie
 * noch nicht: Solange niemand bestätigt hat, dass die Person da ist und wie
 * sie geschrieben wird, wäre eine Personenseite eine Behauptung. Ziel ist
 * deshalb die Teamseite des Standorts – dieselbe Praxis, dieselbe Absicht,
 * nur eine Ebene gröber.
 *
 * Wer im Altbestand kein Standortpräfix trug, arbeitete am Kurfürstendamm;
 * das war dort die Hauptpraxis und der Vorgabewert.
 *
 * Sobald es Personenseiten gibt, verschwinden diese Zeilen zugunsten der
 * Seiten selbst – unter denselben Adressen wäre am besten.
 */
const TEAMSEITEN_KUDAMM = [
  '/team/assistenzen',
  '/team/assistenzen/diana-flint',
  '/team/assistenzen/dominik-demski',
  '/team/assistenzen/eugenia-nicoleta-dutu',
  '/team/assistenzen/lulu-buerger',
  '/team/bleaching-and-cosmetics',
  '/team/bleaching-kosmetik-shop/joana-charlott-radsack',
  '/team/bleaching/anja-baranowsky',
  '/team/bleaching/emma-gloria-findeisen',
  '/team/bleaching/lysann-kosiol',
  '/team/bleaching/maryam-karimi',
  '/team/bleaching/melissa-albalizade',
  '/team/bleaching/ricco-molkentin',
  '/team/dentalhygieniker',
  '/team/dentalhygieniker/adina-mauder',
  '/team/dentalhygieniker/aisegkioul-netzipoglou-housein',
  '/team/dentalhygieniker/atoosa-hafezi',
  '/team/dentalhygieniker/edin-plavsic',
  '/team/dentalhygieniker/eva-caspers',
  '/team/dentalhygieniker/malou-fricke',
  '/team/dentalhygieniker/michaela-kunkel',
  '/team/dentalhygieniker/peggy-bofinger-hofmann',
  '/team/dentalhygieniker/saskia-baer',
  '/team/dsd-koordination-dentalberatung/viktoria-genkel',
  '/team/human-resources',
  '/team/human-resources/adrianna-targatz',
  '/team/human-resources/delphine-martineau-rewig',
  '/team/human-resources/karoline-hansen',
  '/team/human-resources/lulu-buerger',
  '/team/human-resources/susan-feldmann',
  '/team/it-technik/marcel-baer',
  '/team/kommunikation/petros-prontis',
  '/team/materialverwaltung/sabine-kuehnau-falkenau',
  '/team/organigramm',
  '/team/prophylaxe',
  '/team/prophylaxe/alisar-lala',
  '/team/prophylaxe/amar-alrejebi',
  '/team/prophylaxe/amy-beckmann',
  '/team/prophylaxe/anna-zafarian',
  '/team/prophylaxe/bettina-ehrhardt',
  '/team/prophylaxe/ievgeniia-nevzgoda',
  '/team/prophylaxe/jannik-scheurenbrand',
  '/team/prophylaxe/jessica-oberlaender',
  '/team/prophylaxe/karin-wagner',
  '/team/prophylaxe/kevin-cords',
  '/team/prophylaxe/kim-jasmin-yudaev',
  '/team/prophylaxe/madeleine-kettner',
  '/team/prophylaxe/maja-asoska',
  '/team/prophylaxe/marcellina-dallashaj',
  '/team/prophylaxe/melanie-ruedel',
  '/team/prophylaxe/melissa-albalizade',
  '/team/prophylaxe/nicole-dickhoff-kranz',
  '/team/prophylaxe/nicole-lindenau',
  '/team/prophylaxe/nurcan-sahin',
  '/team/prophylaxe/zeynep-cinar',
  '/team/rezeption-service/ayca-kilic',
  '/team/rezeption-service/ina-lehmann',
  '/team/rezeption-service/lisa-hauk',
  '/team/rezeption-service/sarah-henkel',
  '/team/sterilisation-qm/liana-noack',
  '/team/sterilisation-qm/monika-kuckelt',
  '/team/telefon-service',
  '/team/telefon-service/angie-skall',
  '/team/telefon-service/doreen-ziliox',
  '/team/telefon-service/magnus-salecker',
  '/team/verwaltung',
  '/team/verwaltung-2',
  '/team/verwaltung/anka-ulrich',
  '/team/verwaltung/celina-leppin',
  '/team/verwaltung/denise-matzas',
  '/team/verwaltung/diane-dobrin',
  '/team/verwaltung/ina-lehmann',
  '/team/verwaltung/jana-hoeynck',
  '/team/verwaltung/jana-jain',
  '/team/verwaltung/jasmin-piontek',
  '/team/verwaltung/jocelyn-ballard',
  '/team/verwaltung/michaela-dulz',
  '/team/verwaltung/patricia-willer',
  '/team/verwaltung/sandra-mueller',
  '/team/verwaltung/tanya-douglas-moir',
  '/team/verwaltung/tanya-moir-douglas',
  '/team/verwaltung/vivien-zacher',
  '/team/zahnaerzte',
  '/team/zahnaerzte/abby-ferguson',
  '/team/zahnaerzte/ahmet-turan',
  '/team/zahnaerzte/alexandra-fischer',
  '/team/zahnaerzte/alexandra-sophia-fischer',
  '/team/zahnaerzte/amjad-misherqi',
  '/team/zahnaerzte/clara-constanze-meinberg',
  '/team/zahnaerzte/clara-marlene-schulz',
  '/team/zahnaerzte/denise-moldenhauer',
  '/team/zahnaerzte/diana-wald',
  '/team/zahnaerzte/dr-alexandra-wolf',
  '/team/zahnaerzte/dr-andrej-knezevic',
  '/team/zahnaerzte/dr-anna-lena-zopfs',
  '/team/zahnaerzte/dr-birte-habedank',
  '/team/zahnaerzte/dr-cora-betko',
  '/team/zahnaerzte/dr-dr-thorsten-wegner',
  '/team/zahnaerzte/dr-elisabeth-futterlieb',
  '/team/zahnaerzte/dr-frank-schreiber',
  '/team/zahnaerzte/dr-heike-hoppe-zirbs',
  '/team/zahnaerzte/dr-isabella-piekos',
  '/team/zahnaerzte/dr-jana-huesch',
  '/team/zahnaerzte/dr-jonathan-botmann',
  '/team/zahnaerzte/dr-karin-loeer',
  '/team/zahnaerzte/dr-maike-bauer',
  '/team/zahnaerzte/dr-med-dent-eric-paul-oehme',
  '/team/zahnaerzte/dr-rahima-arsalan',
  '/team/zahnaerzte/dr-sabine-gousetis',
  '/team/zahnaerzte/dr-silvia-munoz',
  '/team/zahnaerzte/dr-stephan-ziegler',
  '/team/zahnaerzte/dr-surian-herrmann',
  '/team/zahnaerzte/elena-hude',
  '/team/zahnaerzte/erny-grundmann',
  '/team/zahnaerzte/feras-younes',
  '/team/zahnaerzte/ferry-dickmann',
  '/team/zahnaerzte/frederike-bruening',
  '/team/zahnaerzte/freya-voge',
  '/team/zahnaerzte/inke-supantia',
  '/team/zahnaerzte/jackeline-schaupp',
  '/team/zahnaerzte/janna-mitscherling',
  '/team/zahnaerzte/jargalmaa-kleister',
  '/team/zahnaerzte/jiotis-hondralis',
  '/team/zahnaerzte/juliane-kottenhagen',
  '/team/zahnaerzte/juliane-reichmuth',
  '/team/zahnaerzte/lais-haidari',
  '/team/zahnaerzte/malte-labonte',
  '/team/zahnaerzte/mohamed-abudrya',
  '/team/zahnaerzte/nils-radsack',
  '/team/zahnaerzte/samaneh-salehipour',
  '/team/zahnaerzte/sulmaz-mohammad',
  '/team/zahnaerzte/tim-walter',
  '/team/zahnaerzte/tommy-bettac',
  '/team/zahnaerzte/tsong-ung-an',
  '/team/zahnaerzte/ute-katja-koenig',
  '/team/zahnmedizinische-fachangestellte/cheyenne-bande',
  '/team/zahnmedizinische-fachangestellte/dominik-ruffo',
  '/team/zahnmedizinische-fachangestellte/eugenia-nicoleta-dutu',
  '/team/zahnmedizinische-fachangestellte/grit-roggelin-henning',
  '/team/zahnmedizinische-fachangestellte/huyen-nguyen-dieu',
  '/team/zahnmedizinische-fachangestellte/lisbany-martinez-cubillas',
  '/team/zahnmedizinische-fachangestellte/marlies-vlahek',
  '/team/zahnmedizinische-fachangestellte/steffi-kohl',
  '/telefon-service/angie-skall',
  '/telefon-service/jutta-pueschel',
];

const PRAXISGESCHICHTE = [
  '/blog/20-jahre-ku64',
  '/blog/360zahn-aus-duesseldorf',
  '/blog/architektur-design',
  '/blog/box-legende-axel-schulz-sagt-karies-den-kampf-an',
  '/blog/interviews',
  '/blog/ku64-die-gruene-praxis',
  '/blog/ku64-hat-ein-herz-fuer-leidenschaftliche-radfahrer',
  '/blog/ku64-hat-gewonnen',
  '/blog/ku64-in-den-medien',
  '/blog/ku64-in-den-medien-2',
  '/blog/ku64-liebt-kunst',
  '/blog/ku64-macht-mit-bei-berlin-teilt',
  '/blog/ku64-und-lokahiloft',
  '/blog/ku64-und-physion-emotion',
  '/blog/ku64-unterstuetzt-bwb',
  '/blog/ku64-unterstuetzt-die-kunst',
  '/blog/ku64-verwendet-jetzt-ipads',
  '/blog/ku64s-engagement-fuer-kinder-jugendliche',
  '/blog/kunst-ausstellungen-bei-ku64',
  '/blog/mali-black-berlins-juengste-malerin-stellt-bei-ku64-aus',
  '/blog/malt-fuer-uns',
  '/blog/medaille-fuer-henning-bommel',
  '/blog/medizinische-kompetenz-und-sinn-fuer-schoenheit',
  '/blog/mitmachen-und-gewinnen',
  '/blog/neue-austellung-in-unseren-raeumen',
  '/blog/neue-austellung-in-unseren-raeumen-2',
  '/blog/neuigkeiten-aus-der-praxis',
  '/blog/patient-ist-bei-ku64-gast-koenig',
  '/blog/radeln-fuer-den-guten-zweck',
  '/blog/referral-growth-culture-award-2026',
  '/blog/rolf-zscharnack-stellt-bei-ku64-aus',
  '/blog/social-media-2023',
  '/blog/social-media-2024',
  '/blog/social-media-april-2025',
  '/blog/social-media-ferbruar-2025',
  '/blog/social-media-januar-2025',
  '/blog/social-media-maerz-2025',
  '/blog/social-media-mai-2025',
  '/blog/tag-des-kusses',
  '/blog/tag-des-kusses-2',
  '/blog/toooooooor-viel-glueck-dem-ssc-suedwest-1947',
  '/blog/trainingsanzuguebergabe-ku64-kick-box-jugend-team-e-v',
  '/blog/unser-partner-lokahi-loft-feiert-geburtstag',
  '/blog/unsere-kuh-64-hat-einen-namen',
  '/blog/unterstuetzt-die-jungen-rebels',
  '/blog/viel-glueck-der-f1-jugend-des-bfc-preussen',
  '/blog/west-coast-kids-2026-hilfsprojekt-suedafrika',
  '/fachbeitraege/all',
  '/fachbeitraege/kieferorthopaedie',
  '/fachbeitraege/wissenswert',
  '/fachbeitraege/zahnheilkunde',
  '/ueber-uns/auszeichnungen',
  '/ueber-uns/best-practice',
  '/ueber-uns/galerie',
  '/ueber-uns/hilfsprojekt-suedafrika',
  '/ueber-uns/kooperationspartner',
  '/ueber-uns/location',
  '/ueber-uns/location/architekten',
  '/ueber-uns/location/architekten/ku64.de',
  '/ueber-uns/location/best-practice',
  '/ueber-uns/location/das-sind-wir',
  '/ueber-uns/location/referenzen-der-graft-architekten/ku64.de',
  '/ueber-uns/mitgliedschaften',
  '/ueber-uns/presseinfo',
  '/ueber-uns/presseinfo/ku64.de/pressemitteilung',
  '/ueber-uns/soziales-engagement',
];

const TEAMSEITEN_POTSDAM = [
  '/potsdam/team/celina-leppin',
  '/potsdam/team/clara-marlene-schulz',
  '/potsdam/team/dr-anne-moser',
  '/potsdam/team/dr-birte-habedank',
  '/potsdam/team/jenny-friedla',
  '/potsdam/team/nils-radsack',
  '/potsdam/team/sarah-sander',
  '/potsdam/team/susan-knickenberg',
];

const TEAMSEITEN_BERLINMITTE = [
  '/berlinmitte/dominik-demski',
  '/berlinmitte/dr-jana-huesch',
  '/berlinmitte/dr-jana-westerhorstmann',
  '/berlinmitte/hatice-aktas',
  '/berlinmitte/julia-ressler',
  '/berlinmitte/manuel-schuler',
];

const STELLENANZEIGEN = [
  '/jobs-karriere/kinderzahnarzt-stellenangebot-job-berlin',
  '/jobs-karriere/wir-bilden-aus',
  '/jobs-karriere/zahnarzt-job-berlin',
  '/jobs-karriere/zahnmedizinischer-fachangestellter-berlin',
  '/jobs-karriere/zahnmedizinischer-prophylaxeassistent-berlin',
  '/jobs-karriere/zahnmedizinischer-prophylaxeassistent-berlin/melissa-albalizade',
];

const POTSDAM_BEITRAEGE = [
  '/blog-potsdam/aesthetische-behandlungen-dr-benedikt-straub-in-potsdam-ku64',
  '/blog-potsdam/erfahren-sie-alles-ueber-aesthetische-behandlungen-bei-dr-benedikt-straub-in-potsdam-im-ku64-eine-einzigartige-gelegenheit-fuer-ein-strahlendes-laecheln-und-jugendliches-aussehen-termin-mittwoch-1',
];

/** Jede Adresse einer Liste auf dasselbe Ziel. */
function auf(ziel: string, adressen: readonly string[]): Record<string, string> {
  return Object.fromEntries(adressen.map((a) => [a, ziel]));
}

const FAMILIEN: Record<string, string> = {
  ...auf(KUDAMM_TEAM, TEAMSEITEN_KUDAMM),
  ...auf('/potsdam/team/', TEAMSEITEN_POTSDAM),
  ...auf('/berlinmitte/team/', TEAMSEITEN_BERLINMITTE),
  ...auf('/ueber-uns/', PRAXISGESCHICHTE),
  ...auf('/karriere/', STELLENANZEIGEN),
  ...auf('/potsdam/', POTSDAM_BEITRAEGE),
};

/**
 * Alle Weiterleitungen, wie `astro.config.mjs` sie erwartet.
 *
 * Reihenfolge: erst die festen Adressen, dann die Muster. Astro selbst
 * bewertet feste Routen höher als Muster, die Reihenfolge im Objekt ist also
 * nur für Menschen da, die die Datei lesen.
 */
export const WEITERLEITUNGEN: Record<string, string> = {
  ...ausBehandlungen(),
  ...ausTeam(),
  ...SEITEN,
  ...FAMILIEN,
};

/**
 * Wohin führt diese alte Adresse – oder nirgendwohin?
 *
 * Wird von `npm run urls:abgleichen` benutzt, damit der Wächter genau das
 * prüft, was der Server später tut.
 */
export function zielFuer(pfad: string): string | null {
  return WEITERLEITUNGEN[ohneSchraegstrich(pfad)] ?? null;
}
