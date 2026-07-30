/**
 * Suche über die gesamte Website.
 *
 * ── Warum eine eigene und keine fertige ─────────────────────────────────
 *
 * Eine Suchmaschine einzubinden hieße: ein zweites Datenmodell, ein zweiter
 * Ort, an dem etwas veralten kann, und ein Dienst mehr, an den bei jedem
 * Tastendruck Daten von Patientinnen und Patienten fließen. Der Bestand hier
 * ist klein und vollständig bekannt – 35 Leistungen, 4 Standorte, ein gutes
 * Dutzend weitere Seiten. Dafür ist ein eigener Index kleiner als die
 * Anbindung eines fremden.
 *
 * Er wird beim Bauen aus denselben Dateien erzeugt wie die Seiten. Eine
 * Leistung, die es nicht mehr gibt, verschwindet damit aus der Suche, ohne
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
 *   `synonyme`      führt je Leistung die Wörter, die Patientinnen und
 *                   Patienten tatsächlich verwenden – „PZR", „Hollywood
 *                   Smile", „Zähne bleichen".
 *   `patientenfrage` ist die Frage, die jemand wirklich eintippt.
 *   `FUEHRT_ZU`     ordnet jeder der dreißig Beschwerdeseiten die Behandlungen
 *                   zu, die in Frage kommen – von Hand gepflegt in
 *                   `data/beschwerden.ts`.
 *
 * Die dritte Quelle ist der eigentliche Gewinn: Sie ist nicht für die Suche
 * angelegt worden, sie fällt aus der Arbeit an den Beschwerdeseiten ab. Wer
 * dort eine Zuordnung einträgt, verbessert damit die Suche mit.
 *
 * ── Standort ────────────────────────────────────────────────────────────
 *
 * Steht ein Standort fest, führt jeder Treffer dorthin. Bietet der Standort
 * die Leistung nicht an, sagt der Treffer das – und nennt den Standort, der
 * sie anbietet. Das ist dieselbe Regel wie überall auf dieser Website: lieber
 * ein ehrliches „hier nicht, aber dort" als ein Link, hinter dem nichts ist.
 */

import { LEISTUNGEN, KATEGORIEN, BESCHWERDEN_GEPLANT } from '../data/leistungen';
import { STANDORTE } from '../data/standorte';
import { BESCHWERDEN, FUEHRT_ZU } from '../data/beschwerden.ts';
import { BEITRAEGE } from './blog.ts';
import { veroeffentlichbar } from '../data/team.ts';
import profile from '../data/profile.json';
import { type Indexeintrag, type Trefferart, type Treffer } from './suche-kern.ts';
import {
  beitraegeIn,
  beschwerdenIn,
  kategorieIn,
  leistungenIn,
  personIn,
  standorteIn,
  texte,
} from '../i18n/katalog.ts';
import { QUELLSPRACHE, type Sprache } from '../i18n/sprachen.ts';
import { type TextSchluessel } from '../i18n/texte.ts';

export * from './suche-kern.ts';

// ── Index bauen ───────────────────────────────────────────────────────

/**
 * Statische Seiten, die keine Leistung und kein Standort sind.
 *
 * Von Hand, weil es wenige sind und weil jede einen anderen Grund hat,
 * gefunden zu werden. „Notfall" muss unter „schmerzen" und „zahn
 * rausgefallen" kommen, „Karriere" unter „job" und „ausbildung" – das steht
 * in keiner Seitenüberschrift.
 */
/*
 * Titel und Kurztext stehen als Katalogschlüssel, nicht als Text.
 *
 * Die Suchbegriffe im starken Feld bleiben deutsch. Das ist keine Nachlässigkeit,
 * sondern die Grenze zwischen Übersetzen und Neudenken: „zahn rausgefallen" ist
 * kein Satz, den man überträgt, sondern eine Liste dessen, was Menschen
 * tatsächlich eintippen. Für Englisch und Französisch gehört diese Liste neu
 * erhoben – bis dahin finden die Seiten dort über ihren übersetzten Titel.
 */
type Seiteneintrag = Omit<Indexeintrag, 'art' | 'schwach' | 'titel' | 'kurz'> & {
  titelSchluessel: TextSchluessel;
  kurzSchluessel: TextSchluessel;
};

const SEITEN: Seiteneintrag[] = [
  {
    id: 'notfall',
    titelSchluessel: 'suchindex.notfall',
    kurzSchluessel: 'suchindex.notfallKurz',
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
    titelSchluessel: 'suchindex.termine',
    kurzSchluessel: 'suchindex.termineKurz',
    pfad: '/termine/',
    stark: ['termin', 'termin buchen', 'terminvereinbarung', 'buchen', 'anmelden', 'doctolib', 'online termin'],
    rang: 1,
  },
  {
    id: 'standorte',
    titelSchluessel: 'suchindex.standorte',
    kurzSchluessel: 'suchindex.standorteKurz',
    pfad: '/standorte/',
    stark: ['standorte', 'praxen', 'filialen', 'adressen', 'wo', 'welche praxis'],
    rang: 2,
  },
  {
    id: 'kontakt',
    titelSchluessel: 'suchindex.kontakt',
    kurzSchluessel: 'suchindex.kontaktKurz',
    pfad: '/kontakt/',
    stark: ['kontakt', 'telefon', 'telefonnummer', 'anrufen', 'email', 'e mail', 'erreichen', 'nummer'],
    rang: 3,
  },
  {
    id: 'anamnese',
    titelSchluessel: 'suchindex.anamnese',
    kurzSchluessel: 'suchindex.anamneseKurz',
    pfad: '/anamnese/',
    stark: ['anamnese', 'anamnesebogen', 'formular', 'bogen', 'fragebogen', 'erstbesuch', 'vor dem termin'],
    rang: 4,
  },
  {
    id: 'beratung',
    titelSchluessel: 'suchindex.beratung',
    kurzSchluessel: 'suchindex.beratungKurz',
    pfad: '/beratung/',
    stark: ['beratung', 'berater', 'chat', 'sprechen', 'fragen stellen', 'ki', 'assistent'],
    rang: 5,
  },
  {
    id: 'karriere',
    titelSchluessel: 'suchindex.karriere',
    kurzSchluessel: 'suchindex.karriereKurz',
    pfad: '/karriere/',
    stark: [
      'karriere', 'job', 'jobs', 'stelle', 'stellenangebot', 'bewerbung', 'bewerben',
      'ausbildung', 'azubi', 'zfa', 'arbeiten bei', 'mitarbeiter gesucht',
    ],
    rang: 6,
  },
  {
    id: 'laecheln-vorschau',
    titelSchluessel: 'suchindex.laecheln',
    kurzSchluessel: 'suchindex.laechelnKurz',
    pfad: '/laecheln-vorschau/',
    stark: ['lacheln vorschau', 'vorher nachher', 'simulation', 'wie sehe ich aus', 'foto', 'vorschau'],
    rang: 7,
  },
  {
    id: 'ueber-uns',
    titelSchluessel: 'suchindex.ueberUns',
    kurzSchluessel: 'suchindex.ueberUnsKurz',
    pfad: '/ueber-uns/',
    stark: ['uber uns', 'praxis', 'geschichte', 'architektur', 'graft', 'auszeichnungen', 'wer sind'],
    rang: 8,
  },
  {
    id: 'ki-transparenz',
    titelSchluessel: 'suchindex.kiTransparenz',
    kurzSchluessel: 'suchindex.kiTransparenzKurz',
    pfad: '/ki-transparenz/',
    stark: ['ki', 'kunstliche intelligenz', 'transparenz', 'ki transparenz', 'chatbot', 'datenverarbeitung ki'],
    rang: 9,
  },
  {
    id: 'datenschutz',
    titelSchluessel: 'suchindex.datenschutz',
    kurzSchluessel: 'suchindex.datenschutzKurz',
    pfad: '/datenschutz/',
    stark: ['datenschutz', 'dsgvo', 'daten', 'privatsphare'],
    rang: 10,
  },
  {
    id: 'impressum',
    titelSchluessel: 'suchindex.impressum',
    kurzSchluessel: 'suchindex.impressumKurz',
    pfad: '/impressum/',
    stark: ['impressum', 'anbieter', 'rechtliches'],
    rang: 11,
  },
  {
    id: 'barrierefreiheit',
    titelSchluessel: 'suchindex.barrierefreiheit',
    kurzSchluessel: 'suchindex.barrierefreiheitKurz',
    pfad: '/barrierefreiheit/',
    stark: ['barrierefreiheit', 'barrierefrei', 'zuganglichkeit', 'rollstuhl', 'aufzug'],
    rang: 12,
  },
];

/**
 * Beschwerdebegriffe je Leistung.
 *
 * Wer „zahnfleischbluten" eintippt, soll neben der Beschwerdeseite auch die
 * Behandlung finden, um die es geht. Dafür bekommt jede Leistung die Begriffe
 * der Beschwerden, die zu ihr führen, ins starke Feld.
 *
 * Zwei Quellen:
 *
 * 1. `FUEHRT_ZU` in `data/beschwerden.ts` – die von Hand gepflegte Zuordnung
 *    der dreißig bestehenden Beschwerdeseiten. Sie ist die eigentliche
 *    Quelle, und sie stand hier vorher nicht.
 *
 *    Vorher wurde stattdessen `leistung.alteAdressen` gelesen – ein Feld, das
 *    es auf `Leistung` nie gab (nur auf Teammitgliedern). Der Zweig lief
 *    damit immer über eine leere Liste, ohne Fehler und ohne Wirkung: von
 *    dreißig Beschwerden trug keine einzige zur Suche bei.
 *
 * 2. `BESCHWERDEN_GEPLANT` – Beschwerden, deren Seite noch fehlt. Ihre
 *    Begriffe sollen trotzdem zur passenden Behandlung führen, denn gesucht
 *    wird schon heute nach ihnen.
 */
function beschwerdenJeLeistung(): Map<string, string[]> {
  const karte = new Map<string, string[]>();

  const dazu = (slug: string, begriff: string) => {
    const liste = karte.get(slug) ?? [];
    if (!liste.includes(begriff)) liste.push(begriff);
    karte.set(slug, liste);
  };

  for (const [beschwerde, ziele] of Object.entries(FUEHRT_ZU)) {
    for (const ziel of ziele) dazu(ziel, beschwerde.replace(/-/g, ' '));
  }

  for (const b of BESCHWERDEN_GEPLANT) {
    for (const ziel of b.fuehrtZu) dazu(ziel, b.slug.replace(/-/g, ' '));
  }

  return karte;
}

/**
 * Der Index in einer Sprache.
 *
 * Ohne den Parameter kam die englische Suche zu deutschen Titeln – die Seite
 * darunter war übersetzt, der Treffer, der zu ihr führte, nicht. Gebaut wird
 * jetzt je Sprache eine Indexdatei; siehe `[...sprache]/suche-index.json.ts`.
 */
export function indexBauen(sprache: Sprache = QUELLSPRACHE): Indexeintrag[] {
  const beschwerden = beschwerdenJeLeistung();
  const eintraege: Indexeintrag[] = [];
  const t = texte(sprache);

  const kategorien = KATEGORIEN.map((k) => kategorieIn(k, sprache));

  for (const l of leistungenIn(LEISTUNGEN, sprache)) {
    const kat = kategorien.find((k) => k.slug === l.kategorie);
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

  for (const s of standorteIn(STANDORTE, sprache)) {
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

  for (const { titelSchluessel, kurzSchluessel, ...s } of SEITEN) {
    const titel = t(titelSchluessel);
    const kurz = t(kurzSchluessel);
    /* Der übersetzte Titel gehört ins starke Feld: Er ist in der Zielsprache
       das, wonach jemand sucht – die gepflegte deutsche Begriffsliste bleibt
       daneben stehen und schadet nicht. */
    eintraege.push({ art: 'seite', titel, kurz, schwach: [kurz], ...s, stark: [...s.stark, titel] });
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
  for (const b of beschwerdenIn(BESCHWERDEN, sprache)) {
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
    /* Der Name bleibt, die Funktionsbezeichnung wird übersetzt – sie steht
       unter dem Namen im Treffer. */
    const profil = personIn(m.slug, (profile as Record<string, { funktion?: string }>)[m.slug], sprache);
    const funktion = profil?.funktion ?? m.funktion ?? '';
    eintraege.push({
      art: 'person',
      id: m.slug,
      titel: m.name,
      kurz: funktion,
      pfad: `/${wo}/team/${m.slug}/`,
      stark: [m.name],
      schwach: [funktion],
      verfuegbar: m.standorte,
      rang: 40,
    });
  }

  /*
   * Blogbeiträge – ganz hinten im Rang.
   *
   * Sie sollen gefunden werden, aber nie vor einer Leistung stehen: Wer
   * „veneers" sucht, will die Leistung, nicht einen Beitrag darüber.
   */
  for (const b of beitraegeIn(BEITRAEGE, sprache)) {
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
   * Gesetzt, wenn es die Leistung am gewählten Standort NICHT gibt. Enthält
   * den Namen des Standorts, der sie anbietet.
   */
  stattdessen?: string;
}

/**
 * Aus einem Treffer den Weg machen, den diese Person gehen soll.
 *
 * Ohne Standort führt eine Leistung auf die allgemeine Seite. Mit Standort
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
