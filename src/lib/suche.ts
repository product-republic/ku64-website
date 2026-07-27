/**
 * Suche über die gesamte Website.
 *
 * ── Warum eine eigene und keine fertige ─────────────────────────────────
 *
 * Eine Suchmaschine einzubinden hieße: ein zweites Datenmodell, ein zweiter
 * Ort, an dem etwas veralten kann, und ein Dienst mehr, an den bei jedem
 * Tastendruck Daten von Patientinnen und Patienten fließen. Der Bestand hier
 * ist klein und vollständig bekannt – 35 Behandlungen, 4 Standorte, ein gutes
 * Dutzend weitere Seiten. Dafür ist ein eigener Index kleiner als die
 * Anbindung eines fremden.
 *
 * Er wird beim Bauen aus denselben Dateien erzeugt wie die Seiten. Eine
 * Behandlung, die es nicht mehr gibt, verschwindet damit aus der Suche, ohne
 * dass jemand daran denken muss.
 *
 * ── Was diese Suche kann, was eine Volltextsuche nicht kann ─────────────
 *
 * Menschen suchen ihr Problem, nicht unseren Fachbegriff. Wer „loch im zahn"
 * eingibt, meint eine Kariesbehandlung; wer „pzr" schreibt, die professionelle
 * Zahnreinigung; wer „zahnfleischbluten" tippt, sucht Parodontologie. Eine
 * Volltextsuche über die Seitentexte findet davon einen Teil zufällig.
 *
 * Diese hier weiß es, weil die Daten es wissen:
 *
 *   `synonyme`      führt je Behandlung die Wörter, die Patientinnen und
 *                   Patienten tatsächlich verwenden – „PZR", „Hollywood
 *                   Smile", „Zähne bleichen".
 *   `patientenfrage` ist die Frage, die jemand wirklich eintippt.
 *   `alteAdressen`  enthält unter `/zahnbeschwerden/…` genau die Beschwerden,
 *                   nach denen auf der alten Website gesucht wurde – und die
 *                   Zuordnung zur Behandlung ist dort schon gepflegt.
 *
 * Die dritte Quelle ist der eigentliche Gewinn: Sie ist nicht für die Suche
 * angelegt worden, sie fällt aus der Weiterleitungsarbeit ab. Wer eine alte
 * Beschwerdeadresse einträgt, verbessert damit die Suche mit.
 *
 * ── Standort ────────────────────────────────────────────────────────────
 *
 * Steht ein Standort fest, führt jeder Treffer dorthin. Bietet der Standort
 * die Behandlung nicht an, sagt der Treffer das – und nennt den Standort, der
 * sie anbietet. Das ist dieselbe Regel wie überall auf dieser Website: lieber
 * ein ehrliches „hier nicht, aber dort" als ein Link, hinter dem nichts ist.
 */

import { LEISTUNGEN, KATEGORIEN, BESCHWERDEN_GEPLANT } from '../data/leistungen';
import { STANDORTE } from '../data/standorte';

export type Trefferart = 'leistung' | 'standort' | 'seite';

export interface Indexeintrag {
  art: Trefferart;
  /** Slug der Behandlung bzw. des Standorts; bei Seiten der Pfad. */
  id: string;
  titel: string;
  /** Eine Zeile zur Einordnung im Ergebnis. */
  kurz: string;
  /** Pfad ohne Standort- und Sprachpräfix. */
  pfad: string;
  /** Wörter mit hohem Gewicht: Name, Synonyme, Beschwerden. */
  stark: string[];
  /** Wörter mit niedrigem Gewicht: Kurztext, Teaser, Frage. */
  schwach: string[];
  /** Nur bei Behandlungen: an welchen Standorten es sie gibt. */
  verfuegbar?: string[];
  /** Sortierhilfe bei Gleichstand – kleiner ist wichtiger. */
  rang: number;
}

// ── Normalisieren ─────────────────────────────────────────────────────

/**
 * Schreibweisen einebnen, die dasselbe meinen.
 *
 * Umlaute werden auf den Grundvokal geführt, und zwar in beiden
 * Schreibweisen: „Zahnästhetik" und „zahnaesthetik" landen auf derselben Form.
 * Ohne das findet niemand etwas, der ohne Umlaute tippt – und das tun auf
 * Mobilgeräten viele.
 *
 * Dass dabei „Bär" und „Bar" zusammenfallen, ist der Preis. Bei 35
 * Behandlungen kostet er nichts.
 */
export function normieren(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä|ae/g, 'a')
    .replace(/ö|oe/g, 'o')
    .replace(/ü|ue/g, 'u')
    .replace(/ß|ss/g, 's');
}

export function zerlegen(text: string): string[] {
  return normieren(text)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1);
}

/**
 * Ein Slug ist ein Suchbegriff.
 *
 * `/zahnbeschwerden/mundgeruch-was-tun/` wird zu „mundgeruch was tun" – also
 * genau zu dem, was jemand eingegeben hat, als diese Adresse entstand.
 */
function ausSlug(pfad: string): string {
  return pfad.replace(/^\/zahnbeschwerden\//, '').replace(/\/$/, '').replace(/-/g, ' ');
}

// ── Index bauen ───────────────────────────────────────────────────────

/**
 * Statische Seiten, die keine Behandlung und kein Standort sind.
 *
 * Von Hand, weil es wenige sind und weil jede einen anderen Grund hat,
 * gefunden zu werden. „Notfall" muss unter „schmerzen" und „zahn
 * rausgefallen" kommen, „Karriere" unter „job" und „ausbildung" – das steht
 * in keiner Seitenüberschrift.
 */
const SEITEN: Omit<Indexeintrag, 'art' | 'schwach'>[] = [
  {
    id: 'notfall',
    titel: 'Zahnärztlicher Notfall',
    kurz: 'Was jetzt zu tun ist – und wen Sie sofort erreichen.',
    pfad: '/notfall/',
    stark: [
      'notfall', 'notdienst', 'akut', 'sofort', 'schmerzen', 'starke zahnschmerzen',
      'zahn ausgeschlagen', 'zahn rausgefallen', 'zahn abgebrochen', 'unfall', 'schwellung',
      'blutung', 'krone abgefallen', 'fullung rausgefallen', 'wochenende', 'notaufnahme',
    ],
    rang: 0,
  },
  {
    id: 'termine',
    titel: 'Termin buchen',
    kurz: 'Online einen Termin vereinbaren.',
    pfad: '/termine/',
    stark: ['termin', 'termin buchen', 'terminvereinbarung', 'buchen', 'anmelden', 'doctolib', 'online termin'],
    rang: 1,
  },
  {
    id: 'standorte',
    titel: 'Unsere Standorte',
    kurz: 'Vier Praxen in Berlin und Potsdam.',
    pfad: '/standorte/',
    stark: ['standorte', 'praxen', 'filialen', 'adressen', 'wo', 'welche praxis'],
    rang: 2,
  },
  {
    id: 'kontakt',
    titel: 'Kontakt',
    kurz: 'Telefon, E-Mail und Formular.',
    pfad: '/kontakt/',
    stark: ['kontakt', 'telefon', 'telefonnummer', 'anrufen', 'email', 'e mail', 'erreichen', 'nummer'],
    rang: 3,
  },
  {
    id: 'anamnese',
    titel: 'Anamnesebogen',
    kurz: 'Vor dem ersten Termin ausfüllen – spart Zeit in der Praxis.',
    pfad: '/anamnese/',
    stark: ['anamnese', 'anamnesebogen', 'formular', 'bogen', 'fragebogen', 'erstbesuch', 'vor dem termin'],
    rang: 4,
  },
  {
    id: 'beratung',
    titel: 'Digitale Beratung',
    kurz: 'Sprechen oder schreiben Sie mit unserem digitalen Berater.',
    pfad: '/beratung/',
    stark: ['beratung', 'berater', 'chat', 'sprechen', 'fragen stellen', 'ki', 'assistent'],
    rang: 5,
  },
  {
    id: 'karriere',
    titel: 'Karriere bei KU64',
    kurz: 'Offene Stellen und Ausbildung.',
    pfad: '/karriere/',
    stark: [
      'karriere', 'job', 'jobs', 'stelle', 'stellenangebot', 'bewerbung', 'bewerben',
      'ausbildung', 'azubi', 'zfa', 'arbeiten bei', 'mitarbeiter gesucht',
    ],
    rang: 6,
  },
  {
    id: 'laecheln-vorschau',
    titel: 'Lächeln-Vorschau',
    kurz: 'Aus Ihrem Foto eine unverbindliche Illustration.',
    pfad: '/laecheln-vorschau/',
    stark: ['lacheln vorschau', 'vorher nachher', 'simulation', 'wie sehe ich aus', 'foto', 'vorschau'],
    rang: 7,
  },
  {
    id: 'ueber-uns',
    titel: 'Über KU64',
    kurz: 'Die Praxis, die Architektur, die Geschichte.',
    pfad: '/ueber-uns/',
    stark: ['uber uns', 'praxis', 'geschichte', 'architektur', 'graft', 'auszeichnungen', 'wer sind'],
    rang: 8,
  },
  {
    id: 'ki-transparenz',
    titel: 'KI-Transparenz',
    kurz: 'Welche KI-Systeme hier arbeiten, wofür und mit welchen Daten.',
    pfad: '/ki-transparenz/',
    stark: ['ki', 'kunstliche intelligenz', 'transparenz', 'ki transparenz', 'chatbot', 'datenverarbeitung ki'],
    rang: 9,
  },
  {
    id: 'datenschutz',
    titel: 'Datenschutz',
    kurz: 'Wie wir mit Ihren Daten umgehen.',
    pfad: '/datenschutz/',
    stark: ['datenschutz', 'dsgvo', 'daten', 'privatsphare'],
    rang: 10,
  },
  {
    id: 'impressum',
    titel: 'Impressum',
    kurz: 'Anbieterkennzeichnung.',
    pfad: '/impressum/',
    stark: ['impressum', 'anbieter', 'rechtliches'],
    rang: 11,
  },
  {
    id: 'barrierefreiheit',
    titel: 'Barrierefreiheit',
    kurz: 'Erklärung zur Barrierefreiheit dieser Website.',
    pfad: '/barrierefreiheit/',
    stark: ['barrierefreiheit', 'barrierefrei', 'zuganglichkeit', 'rollstuhl', 'aufzug'],
    rang: 12,
  },
];

/**
 * Beschwerdebegriffe je Behandlung.
 *
 * Zwei Quellen, beide schon vorhanden: `BESCHWERDEN_GEPLANT` (was als eigene
 * Seite kommen soll) und die Adressen unter `/zahnbeschwerden/` aus
 * `alteAdressen` (wonach auf der alten Website gesucht wurde).
 */
function beschwerdenJeLeistung(): Map<string, string[]> {
  const karte = new Map<string, string[]>();

  const dazu = (slug: string, begriff: string) => {
    const liste = karte.get(slug) ?? [];
    if (!liste.includes(begriff)) liste.push(begriff);
    karte.set(slug, liste);
  };

  for (const b of BESCHWERDEN_GEPLANT) {
    for (const ziel of b.fuehrtZu) dazu(ziel, b.slug.replace(/-/g, ' '));
  }

  for (const l of LEISTUNGEN) {
    for (const alt of l.alteAdressen ?? []) {
      if (alt.startsWith('/zahnbeschwerden/')) dazu(l.slug, ausSlug(alt));
    }
  }

  return karte;
}

export function indexBauen(): Indexeintrag[] {
  const beschwerden = beschwerdenJeLeistung();
  const eintraege: Indexeintrag[] = [];

  for (const l of LEISTUNGEN) {
    const kat = KATEGORIEN.find((k) => k.slug === l.kategorie);
    eintraege.push({
      art: 'leistung',
      id: l.slug,
      titel: l.name,
      kurz: l.kurz,
      pfad: `/leistungen/${l.slug}/`,
      stark: [l.name, ...l.synonyme, ...(beschwerden.get(l.slug) ?? [])],
      schwach: [l.kurz, l.teaser, l.patientenfrage, kat?.name ?? ''],
      verfuegbar: l.verfuegbar,
      rang: (kat?.rang ?? 99) * 100,
    });
  }

  for (const s of STANDORTE) {
    eintraege.push({
      art: 'standort',
      id: s.slug,
      titel: `KU64 ${s.name}`,
      kurz: `${s.strasse}, ${s.plz} ${s.ort}`,
      pfad: `/${s.slug}/`,
      stark: [s.name, s.nameLang, s.ort, s.strasse, s.plz],
      schwach: [s.claim, ...s.besonderheiten],
      rang: 20,
    });
  }

  for (const s of SEITEN) {
    eintraege.push({ art: 'seite', schwach: [s.kurz], ...s });
  }

  return eintraege;
}

// ── Bewerten ──────────────────────────────────────────────────────────

/**
 * Abstand zweier Wörter, gedeckelt bei 2.
 *
 * Nur für Tippfehler gedacht, nicht für Wortverwandtschaft. „implantat" gegen
 * „implantant" soll treffen, „krone" gegen „krise" nicht.
 */
function abstand(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const vor = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = vor[0]!;
    vor[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const merk = vor[j]!;
      vor[j] = Math.min(
        vor[j]! + 1,
        vor[j - 1]! + 1,
        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      diagonal = merk;
    }
  }
  return vor[b.length]!;
}

interface Feldtreffer {
  punkte: number;
  /** Welcher Ausdruck getroffen hat – für die Anzeige „gefunden über …". */
  ueber?: string;
}

/** Ein Suchwort gegen eine Wortgruppe. */
function feldTreffer(wort: string, ausdruecke: string[], gewicht: number): Feldtreffer {
  let beste: Feldtreffer = { punkte: 0 };

  for (const ausdruck of ausdruecke) {
    if (!ausdruck) continue;
    const teile = zerlegen(ausdruck);
    for (const teil of teile) {
      let p = 0;
      if (teil === wort) p = gewicht;
      else if (teil.startsWith(wort) && wort.length >= 3) p = gewicht * 0.7;
      /* Tippfehler erst ab fünf Zeichen: Bei kurzen Wörtern ist ein Zeichen
         Unterschied meist ein anderes Wort, kein Vertipper. */
      else if (wort.length >= 5 && teil.length >= 5 && abstand(teil, wort) === 1) p = gewicht * 0.55;

      if (p > beste.punkte) beste = { punkte: p, ueber: ausdruck };
    }
  }

  return beste;
}

export interface Treffer {
  eintrag: Indexeintrag;
  punkte: number;
  /** Der Ausdruck, über den gefunden wurde, falls es nicht der Titel war. */
  ueber?: string;
}

const GEWICHT_STARK = 10;
const GEWICHT_SCHWACH = 2.5;

/**
 * Bewertet den gesamten Index gegen eine Eingabe.
 *
 * Alle Suchwörter müssen irgendwo treffen. Ohne diese Bedingung liefert
 * „implantat potsdam" alles, was „potsdam" enthält – und der Eintrag, der
 * beides erfüllt, geht in der Menge unter.
 */
export function suchen(index: Indexeintrag[], frage: string, grenze = 8): Treffer[] {
  const woerter = zerlegen(frage);
  if (woerter.length === 0) return [];

  const ganzeFrage = normieren(frage.trim());
  const treffer: Treffer[] = [];

  for (const eintrag of index) {
    let punkte = 0;
    let ueber: string | undefined;
    let alleGetroffen = true;

    for (const wort of woerter) {
      const stark = feldTreffer(wort, eintrag.stark, GEWICHT_STARK);
      const schwach = feldTreffer(wort, eintrag.schwach, GEWICHT_SCHWACH);
      const besser = stark.punkte >= schwach.punkte ? stark : schwach;

      if (besser.punkte === 0) {
        alleGetroffen = false;
        continue;
      }
      punkte += besser.punkte;
      /* Als Fundstelle merken wir uns den stärksten Treffer, der nicht der
         Titel ist – „gefunden über: PZR" erklärt das Ergebnis, „gefunden
         über: Professionelle Zahnreinigung" erklärt nichts. */
      if (
        stark.punkte >= schwach.punkte &&
        stark.ueber &&
        normieren(stark.ueber) !== normieren(eintrag.titel) &&
        (!ueber || stark.punkte > GEWICHT_STARK * 0.7)
      ) {
        ueber = stark.ueber;
      }
    }

    if (!alleGetroffen || punkte === 0) continue;

    /* Wer den ganzen Titel oder ein ganzes Synonym eingegeben hat, meint genau
       das. Ohne diesen Aufschlag steht bei „bleaching" die Zahnaufhellung
       unter Umständen hinter einem Eintrag, der das Wort dreimal im Fließtext
       führt. */
    if (normieren(eintrag.titel) === ganzeFrage) punkte += 50;
    else if (eintrag.stark.some((a) => normieren(a) === ganzeFrage)) punkte += 35;

    /* Vollständige Eingaben belohnen: Zwei getroffene Wörter sind mehr wert
       als zweimal ein Wort. */
    if (woerter.length > 1) punkte *= 1 + 0.15 * (woerter.length - 1);

    treffer.push({ eintrag, punkte, ueber });
  }

  return treffer
    .sort((a, b) => b.punkte - a.punkte || a.eintrag.rang - b.eintrag.rang)
    .slice(0, grenze);
}

// ── Treffer in einen Weg verwandeln ───────────────────────────────────

export interface Ergebnis {
  titel: string;
  kurz: string;
  /** Wohin der Treffer führt – bereits mit Sprach- und Standortpräfix. */
  pfad: string;
  art: Trefferart;
  ueber?: string;
  /**
   * Gesetzt, wenn es die Behandlung am gewählten Standort NICHT gibt. Enthält
   * den Namen des Standorts, der sie anbietet.
   */
  stattdessen?: string;
}

/**
 * Aus einem Treffer den Weg machen, den diese Person gehen soll.
 *
 * Ohne Standort führt eine Behandlung auf die allgemeine Seite. Mit Standort
 * auf die Fassung dieses Standorts – und wenn es sie dort nicht gibt, sagt das
 * Ergebnis es, statt ins Leere zu zeigen.
 */
export function ergebnisFuer(
  treffer: Treffer,
  standortSlug: string | null,
  praefix = '',
): Ergebnis {
  const { eintrag } = treffer;
  const grund: Ergebnis = {
    titel: eintrag.titel,
    kurz: eintrag.kurz,
    art: eintrag.art,
    ueber: treffer.ueber,
    pfad: `${praefix}${eintrag.pfad}`,
  };

  if (eintrag.art !== 'leistung' || !standortSlug) return grund;

  if (eintrag.verfuegbar?.includes(standortSlug)) {
    return { ...grund, pfad: `${praefix}/${standortSlug}/leistungen/${eintrag.id}/` };
  }

  /* Nicht hier – aber irgendwo. Der erste verfügbare Standort ist zugleich
     der wichtigste: Die Reihenfolge in `verfuegbar` folgt der Größe der
     Praxis. */
  const anderer = eintrag.verfuegbar?.[0];
  const name = STANDORTE.find((s) => s.slug === anderer)?.name;

  return anderer && name
    ? { ...grund, pfad: `${praefix}/${anderer}/leistungen/${eintrag.id}/`, stattdessen: name }
    : grund;
}

/**
 * Ist das eine Frage oder ein Stichwort?
 *
 * Entscheidet, ob die KI-Antwort überhaupt angeboten wird. „veneers" braucht
 * keine, „was kostet mich eine krone wenn ich gesetzlich versichert bin"
 * schon – dafür gibt es keinen Index, sondern nur eine Antwort.
 */
export function istFrage(text: string): boolean {
  const t = text.trim();
  if (t.includes('?')) return true;
  if (zerlegen(t).length >= 4) return true;
  return /^(was|wie|wo|wann|warum|welche[rsn]?|wer|kann|darf|muss|gibt|ist|sind|hab|habe|ich)\b/i.test(t);
}
