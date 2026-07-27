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
import { BESCHWERDEN } from '../data/beschwerden.ts';
import { BEITRAEGE } from './blog.ts';
import { veroeffentlichbar } from '../data/team.ts';
import profile from '../data/profile.json';
import {
  type Indexeintrag,
  type Trefferart,
  type Treffer,
  normieren,
  zerlegen,
} from './suche-kern.ts';

export * from './suche-kern.ts';

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

  /*
   * Beschwerden.
   *
   * Der wichtigste Zugang überhaupt: Wer „zahnfleischbluten" tippt, sucht
   * nicht die Parodontitistherapie, sondern eine Erklärung – und die steht
   * genau hier. Der Titel dieser Seiten trägt oft einen redaktionellen
   * Vorspann („Ein heikles Thema: Mundgeruch – …"); gesucht wird nach dem
   * Slug, deshalb steht der mit im starken Feld.
   */
  for (const b of BESCHWERDEN) {
    eintraege.push({
      art: 'beschwerde',
      id: b.slug,
      titel: b.titel,
      kurz: b.beschreibung,
      pfad: `/zahnbeschwerden/${b.slug}/`,
      stark: [b.titel, b.slug.replace(/-/g, ' ')],
      schwach: [b.beschreibung, ...b.abschnitte.slice(0, 6).map((a) => a.titel)],
      rang: 10,
    });
  }

  /*
   * Menschen.
   *
   * Wer einen Namen eingibt, sucht diese eine Person und nichts sonst –
   * deshalb steht der Name im starken Feld und die Funktion im schwachen.
   * Nur wer ein Profil hat, kommt in den Index: Ein Treffer, der auf eine
   * Seite führt, die es nicht gibt, ist schlimmer als kein Treffer.
   */
  const mitProfil = new Set(Object.keys(profile as Record<string, unknown>));
  for (const m of veroeffentlichbar()) {
    if (!mitProfil.has(m.slug)) continue;
    const wo = m.standorte[0];
    if (!wo) continue;
    eintraege.push({
      art: 'person',
      id: m.slug,
      titel: m.name,
      kurz: m.funktion ?? '',
      pfad: `/${wo}/team/${m.slug}/`,
      stark: [m.name],
      schwach: [m.funktion ?? ''],
      verfuegbar: m.standorte,
      rang: 40,
    });
  }

  /*
   * Blogbeiträge – ganz hinten im Rang.
   *
   * Sie sollen gefunden werden, aber nie vor einer Behandlung stehen: Wer
   * „veneers" sucht, will die Behandlung, nicht einen Beitrag darüber.
   */
  for (const b of BEITRAEGE) {
    eintraege.push({
      art: 'beitrag',
      id: b.slug,
      titel: b.titel,
      kurz: b.anriss.slice(0, 120),
      pfad: `/blog/${b.slug}/`,
      stark: [b.titel],
      schwach: [b.anriss, ...b.bloecke.filter((x) => x.art === 'h2').map((x) => x.text ?? '')],
      rang: 60,
    });
  }

  return eintraege;
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
