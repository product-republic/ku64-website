#!/usr/bin/env node
/**
 * Schlägt für jede Adresse des Altbestands ein Ziel auf der neuen Website vor.
 *
 * ── Warum das gebraucht wird ────────────────────────────────────────────────
 *
 * `urls-abgleichen.mjs` misst den Schaden: 216 von 238 bekannten Adressen
 * laufen ins Leere, 90,8 Prozent. Jede davon ist eine Fehlerseite für jemanden,
 * der aus der Suche kommt, und eine verlorene Platzierung. Messen allein
 * behebt das nicht.
 *
 * Dieses Skript erzeugt den Vorschlag, `src/data/weiterleitungen.ts` hält das
 * Ergebnis. Eingecheckt, damit jede Regel gegengelesen werden kann – eine
 * falsche Weiterleitung ist schlimmer als keine: Wer eine Behandlung sucht und
 * auf der Startseite landet, sucht nicht weiter, sondern geht.
 *
 * ── Die Regeln, in dieser Reihenfolge ───────────────────────────────────────
 *
 * 1. HAND     Von Hand gesetzt, wo die Automatik nicht hinkommt.
 * 2. PERSON   Adresse einer Personenseite → Teamseite ihres Standorts. Die
 *             Zuordnung kommt aus `alteAdressen` in team.ts, ist also belegt.
 * 3. LEISTUNG Der Pfad enthält den Slug oder ein Synonym einer Behandlung →
 *             diese Behandlung, am Standort des Pfades, sonst standortfrei.
 * 4. GRUPPE   Sammelseiten wie /team/prophylaxe/ → Teamseite des Standorts.
 * 5. ORT      Alles übrige unterhalb eines Standorts → Startseite dieses
 *             Standorts. Grob, aber am Ort richtig.
 * 6. OFFEN    Kein Ziel. Wird gemeldet, nicht geraten.
 *
 * Zu 6: Der Altbestand hat 48 Blog- und 7 Fachbeitrags-Adressen. Für die gibt
 * es auf der neuen Website keine Entsprechung, weil es die Inhalte nicht gibt.
 * Sie alle auf die Startseite zu leiten wäre die bequeme Lösung und die
 * falsche: Google bewertet massenhafte Weiterleitungen auf eine unpassende
 * Seite als „soft 404“ – dieselbe Wirkung wie ein Fehler, nur ohne die
 * Ehrlichkeit. Diese Adressen bleiben deshalb offen und stehen im Bericht.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────────
 *
 *   node --experimental-strip-types analyse/altbestand/weiterleitungen-planen.mjs
 *
 * Schreibt `src/data/weiterleitungen.ts` und einen Bericht auf die Konsole.
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { LEISTUNGEN, KATEGORIEN } from '../../src/data/leistungen.ts';
import { STANDORTE } from '../../src/data/standorte.ts';
import { TEAM } from '../../src/data/team.ts';

const HIER = import.meta.dirname;
const WURZEL = path.resolve(HIER, '../..');

/* ── Bestand einsammeln ──────────────────────────────────────────────────── */

const wl = JSON.parse(await readFile(path.join(HIER, 'weiterleitungen.json'), 'utf8'));

function normieren(roh) {
  let p = String(roh || '').trim();
  if (!p) return null;
  p = p.replace(/^https?:\/\/[^/]+/i, '').split(/[?#]/)[0];
  if (!p.startsWith('/')) p = `/${p}`;
  if (!p.endsWith('/')) p += '/';
  const letztes = p.split('/').filter(Boolean).pop() ?? '';
  if (letztes.includes('.')) return null;
  if (p.startsWith('/wp-') || p.startsWith('/feed')) return null;
  return p;
}

/* Quellen UND Ziele der alten Regeln: Beide kennt Google. */
const bestand = new Set();
for (const r of [...(wl.aktiv ?? []), ...(wl.deaktiviert ?? [])]) {
  for (const seite of [r.von, r.nach]) {
    const p = normieren(seite);
    if (p) bestand.add(p);
  }
}
/* Die alten Personenadressen aus den Teamdaten – dort stehen einige, die in
   der .htaccess nicht mehr auftauchen. */
for (const m of TEAM) for (const a of m.alteAdressen ?? []) {
  const p = normieren(a);
  if (p) bestand.add(p);
}

/* ── Was es auf der neuen Website gibt ───────────────────────────────────── */

const STANDORT_SLUGS = STANDORTE.map((s) => s.slug);

/** Alte Standortkennungen auf neue Slugs. Der Kudamm lag früher an der Wurzel. */
const ORTSPRAEFIXE = [
  { alt: 'potsdam', slug: 'potsdam' },
  { alt: 'berlinmitte', slug: 'berlinmitte' },
  { alt: 'berlin-mitte', slug: 'berlinmitte' },
  { alt: 'wilmersdorf', slug: 'wilmersdorf' },
  { alt: 'kiezpraxis', slug: 'wilmersdorf' },
];

function ortAus(pfad) {
  const erstes = pfad.split('/').filter(Boolean)[0] ?? '';
  const treffer = ORTSPRAEFIXE.find((o) => erstes === o.alt || erstes.startsWith(`${o.alt}-`));
  return treffer?.slug ?? null;
}

/** Suchbegriffe je Behandlung: Slug, Namensteile, Synonyme – klein und ohne Zeichen. */
function begriffe(l) {
  const roh = [l.slug, l.name, ...l.synonyme];
  return roh
    .map((b) =>
      b
        .toLowerCase()
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),
    )
    .filter((b) => b.length >= 5);
}

/**
 * Wörter, die in fast jedem Behandlungsnamen vorkommen und deshalb nichts
 * unterscheiden. Ohne diese Liste würde „behandlung“ auf jede zweite Adresse
 * passen und die erste beste Behandlung gewinnen.
 */
const NICHTSSAGEND = new Set([
  'behandlung',
  'behandlungen',
  'zahnarzt',
  'zahnaerztin',
  'zahnmedizin',
  'berlin',
  'potsdam',
  'praxis',
  'therapie',
  'moderne',
  'schonend',
  'schonende',
]);

/** Einzelne Wörter aus Namen und Synonymen – für Adressen, die nur ein Wort
 *  des Begriffs tragen: `/potsdam/parodontitis/` statt
 *  `parodontitis-behandlung`. */
function einzelwoerter(l) {
  return [...new Set(begriffe(l).flatMap((b) => b.split('-')))].filter(
    (w) => w.length >= 6 && !NICHTSSAGEND.has(w),
  );
}

const LEISTUNGSBEGRIFFE = LEISTUNGEN.map((l) => ({
  slug: l.slug,
  verfuegbar: l.verfuegbar,
  begriffe: begriffe(l),
  woerter: einzelwoerter(l),
  /* Kurzformen wie „cmd“ sind zu kurz für die Suche im ganzen Pfad – sie
     stünden sonst in jedem Wort, das die drei Buchstaben enthält. Sie zählen
     nur, wenn sie das letzte Pfadstück GENAU sind. */
  kurz: begriffe(l).concat(l.synonyme.map((x) => x.toLowerCase())).filter((b) => b.length <= 5),
}));

/** Personen: alte Adresse → Standort. */
const PERSONENADRESSEN = new Map();
for (const m of TEAM) {
  const standort = m.standorte[0] ?? 'berlin-charlottenburg';
  for (const a of m.alteAdressen ?? []) {
    const p = normieren(a);
    if (p) PERSONENADRESSEN.set(p, standort);
  }
  /* Auch die bloße Namensadresse an der Wurzel, wie sie im Altbestand
     mehrfach vorkommt: /elena-hude/ */
  PERSONENADRESSEN.set(`/${m.slug}/`, standort);
}

/** Gruppenseiten der alten Website. */
const GRUPPENSEITEN = [
  'team',
  'teams',
  'team-2',
  'zahnaerzte',
  'prophylaxe',
  'dentalhygieniker',
  'verwaltung',
  'verwaltung-2',
  'telefon-service',
  'rezeption-und-service',
  'rezeption-service',
  'human-resources',
  'assistenzen',
  'azubis',
];

/**
 * Von Hand gesetzte Ziele.
 *
 * Hier steht, was keine Regel treffen kann: Umbenennungen, zusammengelegte
 * Seiten, und die englische Kontaktadresse.
 */
const HAND = {
  '/contact/': '/kontakt/',
  /* Behandlungen, die auf der alten Website eigene Namen trugen. Die
     Zuordnung ist fachlich, nicht sprachlich – „Incognito“ ist ein
     Markenname für Lingualbrackets, also eine feste Zahnspange. */
  '/leistungen/kieferorthopaedie/incognito/': '/leistungen/feste-zahnspange/',
  '/leistungen/kieferorthopaedie/win-brackets-lingualtechnik/': '/leistungen/feste-zahnspange/',
  '/gerade-zaehne/': '/leistungen/aligner/',
  '/zahnbeschwerden/gerade-zaehne/': '/leistungen/aligner/',
  '/zahnwurzelentzuendung/': '/leistungen/wurzelkanalbehandlung/',
  '/zahnbeschwerden/zahnwurzelentzuendung/': '/leistungen/wurzelkanalbehandlung/',
  '/zahnbeschwerden/zahn-abgebrochen/': '/notfall/',
  '/leistungen/kieferorthopaedie/dros-schiene/': '/leistungen/cmd-behandlung/',
  '/dros-schiene/': '/leistungen/cmd-behandlung/',
  '/potsdam/kieferorthopadie/dros-schiene/': '/potsdam/leistungen/cmd-behandlung/',
  '/potsdam/kieferorthopadie/cmd/': '/potsdam/leistungen/cmd-behandlung/',
  /* „Anästhesie“ hieß auf der alten Website die Seite zur Behandlung im
     Schlaf. Der Tippfehler „anaesthetie“ stand dort ebenfalls. */
  /* Nicht auf `/potsdam/leistungen/behandlung-in-narkose/`: Diese Behandlung
     gibt es in Potsdam nicht, die Seite existiert dort also gar nicht. Die
     standortfreie Seite sagt, wo es sie gibt – das ist die richtige Antwort
     auf eine Adresse, deren Angebot umgezogen ist. */
  '/potsdam/anaesthesie/': '/leistungen/behandlung-in-narkose/',
  '/potsdam/anaesthetie/': '/leistungen/behandlung-in-narkose/',
  '/potsdam/zahnasthetik/': '/potsdam/leistungen/',
  '/potsdam/zahnaesthetik/': '/potsdam/leistungen/',
  '/potsdam/schonende-zahnbehandlung-mit-laser-ihr-laser-zahnarzt-ku64-potsdam/':
    '/potsdam/leistungen/parodontitis-behandlung/',
  '/potsdam/laserbehandlung-potsdam/': '/potsdam/leistungen/parodontitis-behandlung/',
  '/potsdam/zahnbehandlung-laser/': '/potsdam/leistungen/parodontitis-behandlung/',
  /* Laserbehandlung ist im neuen Katalog keine eigene Leistung, sondern ein
     Verfahren innerhalb der Parodontitis- und Zahnerhaltbehandlung. */
  '/laserbehandlung/': '/leistungen/parodontitis-behandlung/',
  '/leistungen/ganzheitliche-zahnmedizin/laserbehandlung/': '/leistungen/parodontitis-behandlung/',
  '/schmerzfreie-zahnbehandlung-mit-dem-laser/': '/leistungen/parodontitis-behandlung/',
  /* Der ganze Bereich Beauty/Cosmetics fehlt im neuen Katalog. Er gehört
     fachlich nicht zur Zahnmedizin, und ob KU64 ihn fortführt, ist eine
     Entscheidung der Praxis – bis dahin die Übersicht statt einer 404. */
  '/leistungen/beauty-cosmetics/': '/leistungen/',
  '/leistungen/cosmetics/': '/leistungen/',
  '/leistungen/beauty-cosmetics/ku64-cosmetics/': '/leistungen/',
  '/leistungen/beauty-cosmetics/matrixtherapie/': '/leistungen/',
  '/leistungen/beauty-cosmetics/hautarzt__trashed/hauttumorchirurgie/': '/leistungen/',
  '/leistungen/beauty-cosmetics/hautarzt__trashed/hyperhidrose/': '/leistungen/',
  '/leistugen/beauty-cosmetics/hauttumorchirurgie/': '/leistungen/',
  '/infusionstherapie-reviv/': '/leistungen/',
  /* Seiten über die Praxis selbst. */
  '/ueber-uns/location/architekten/': '/ueber-uns/',
  '/ueber-uns/presseinfo/ku64.de/pressemitteilung/': '/ueber-uns/',
  '/medienecho/': '/ueber-uns/',
  '/unkategorisiert/ku64-kooperationen/': '/ueber-uns/',
  '/team-za-berlin/': '/berlin-charlottenburg/team/',
  '/communication-and-human-recources/': '/berlin-charlottenburg/team/',
  '/kommunikation-human-resources__trashed/susan-feldmann/': '/berlin-charlottenburg/team/',
  '/jobs-karriere/zahnmedizinischer-prophylaxeassistent-berlin/melissa-albalizade/': '/karriere/',
  '/potsdam/jobs-und-karriere/': '/karriere/',
  '/potsdam/jobs-und-karriere-potsdam/': '/karriere/',
  '/berlinmitte/link-tree/': '/berlinmitte/kontakt/',
  '/berlinmitte-2-2/link-tree/': '/berlinmitte/kontakt/',
  /* Jana Jain arbeitet nicht mehr bei KU64 – siehe team.ts. Ihre Adresse
     führt auf die Teamseite, nicht ins Leere. */
  '/jana-jain/': '/berlin-charlottenburg/team/',
  '/das-sind-wir/': '/ueber-uns/',
  '/ueber-uns/location/das-sind-wir/': '/ueber-uns/',
  '/ueber-uns/location/best-practice/': '/ueber-uns/',
  '/anamnese-2/': '/anamnese/',
  '/prophylaxis-4-0/': '/leistungen/professionelle-zahnreinigung/',
  '/zahn-abgebrochen/': '/notfall/',
  '/zahnbeschwerden/': '/notfall/',
  '/leistugen/beauty-cosmetics/': '/leistungen/',
  '/leistungen/beauty-cosmetics/hautarzt/': '/leistungen/',
  '/potsdam-neu/': '/potsdam/',
  '/berlinmitte-2/': '/berlinmitte/',
  '/berlinmitte-2-2/': '/berlinmitte/',
  '/blog-potsdam/': null,
  '/blog/': null,
  '/fachbeitraege/': null,
};

/* ── Zuordnen ────────────────────────────────────────────────────────────── */

/*
 * Was die neue Website unter derselben Adresse anbietet, braucht keine
 * Weiterleitung – im Gegenteil: Eine Weiterleitung auf sich selbst wäre eine
 * Schleife. Der Bestand wird deshalb gegen die gebauten Seiten geprüft.
 */
const DIST = path.join(WURZEL, 'dist/client');
const vorhandeneSeiten = new Set();
if (existsSync(DIST)) {
  const durchlaufen = async (ordner, praefix = '') => {
    for (const e of await readdir(ordner, { withFileTypes: true })) {
      if (e.isDirectory()) await durchlaufen(path.join(ordner, e.name), `${praefix}/${e.name}`);
      else if (e.name === 'index.html') vorhandeneSeiten.add(`${praefix}/`);
    }
  };
  await durchlaufen(DIST);
} else {
  console.warn('[weiterleitungen] dist/client fehlt – vorhandene Seiten werden nicht erkannt.');
}

const vorschlag = [];
const offen = [];

/**
 * Sucht die Behandlung, die in einem alten Pfad steckt.
 *
 * Verglichen wird zusätzlich OHNE Bindestriche. Die alte Website schrieb
 * `parodontitisbehandlung` in einem Wort, der neue Katalog
 * `parodontitis-behandlung` – ohne diesen zweiten Vergleich landeten zwanzig
 * Potsdamer Behandlungsseiten pauschal auf der Standortstartseite, obwohl es
 * die passende Seite gibt.
 */
function leistungAus(pfad, ort) {
  const flach = pfad.toLowerCase();
  const ohneStrich = flach.replace(/-/g, '');
  /* Längste Übereinstimmung gewinnt: „zahnimplantate“ vor „implantate“, sonst
     landet die Implantatseite bei der allgemeineren Behandlung. */
  const letztes = flach.split('/').filter(Boolean).pop() ?? '';
  let beste = null;
  const merken = (l, laenge) => {
    if (!beste || laenge > beste.laenge) {
      beste = { slug: l.slug, laenge, verfuegbar: l.verfuegbar };
    }
  };

  for (const l of LEISTUNGSBEGRIFFE) {
    /* Ganze Begriffe, mit und ohne Bindestriche. */
    for (const b of l.begriffe) {
      const bOhne = b.replace(/-/g, '');
      if (flach.includes(b) || ohneStrich.includes(bOhne)) merken(l, b.length);
    }
    /* Einzelne, aussagekräftige Wörter daraus. */
    for (const w of l.woerter) {
      if (ohneStrich.includes(w)) merken(l, w.length);
    }
    /* Kurzformen nur als vollständiges letztes Pfadstück. */
    for (const k of l.kurz) {
      if (letztes === k) merken(l, k.length + 10);
    }
  }
  if (!beste) return null;
  /* Am Standort nur, wenn die Behandlung dort auch angeboten wird – sonst
     landet man auf einer Seite, die sagt „gibt es hier nicht“. Dann besser
     die standortfreie Übersicht. */
  if (ort && beste.verfuegbar.includes(ort)) return `/${ort}/leistungen/${beste.slug}/`;
  return `/leistungen/${beste.slug}/`;
}

for (const pfad of [...bestand].sort()) {
  /* Gibt es unter dieser Adresse eine Seite? Dann ist alles gut. */
  if (vorhandeneSeiten.has(pfad)) continue;

  const ort = ortAus(pfad);
  const teile = pfad.split('/').filter(Boolean);

  /* 1. Von Hand */
  if (pfad in HAND) {
    const ziel = HAND[pfad];
    if (ziel) vorschlag.push({ von: pfad, nach: ziel, regel: 'HAND' });
    else offen.push({ von: pfad, grund: 'Kein Inhalt auf der neuen Website (Blog/Fachbeiträge)' });
    continue;
  }

  /* Blog und Fachbeiträge insgesamt: kein Ziel, und das bleibt so. */
  if (teile[0] === 'blog' || teile[0] === 'fachbeitraege' || teile[0] === 'blog-potsdam') {
    offen.push({ von: pfad, grund: 'Kein Inhalt auf der neuen Website (Blog/Fachbeiträge)' });
    continue;
  }

  /*
   * 2. Alles unterhalb von /team/ – und zwar VOR der Behandlungssuche.
   *
   * Reihenfolge mit Grund: `/team/prophylaxe/maja-asoska/` enthält das Wort
   * „prophylaxe“, und die Behandlungssuche hätte daraus die Seite
   * „Prophylaxe 4.0“ gemacht. Wer aber eine Kollegin sucht, will nicht auf
   * einer Behandlungsseite landen. Der Bereich schlägt das Stichwort.
   */
  const imTeambereich =
    teile[0] === 'team' ||
    teile[0] === 'teams' ||
    teile[0] === 'team-2' ||
    teile.some((t) => GRUPPENSEITEN.includes(t)) ||
    (teile.length > 1 && teile[1] === 'team');

  const personenort = PERSONENADRESSEN.get(pfad);
  if (personenort) {
    vorschlag.push({ von: pfad, nach: `/${personenort}/team/`, regel: 'PERSON' });
    continue;
  }

  const letztes = teile[teile.length - 1] ?? '';

  /* Bekannte Seiten mit direkter Entsprechung je Standort – vor der
     Personenerkennung, sonst wird `/potsdam/kontakt-potsdam/` als Name
     gelesen. */
  const DIREKT = {
    kontakt: 'kontakt',
    'kontakt-potsdam': 'kontakt',
    'kontakt-berlinmitte': 'kontakt',
    anfahrt: 'anfahrt',
    termine: 'termine',
    anamnese: 'anamnese',
    praxis: 'praxis',
    team: 'team',
  };
  if (ort && DIREKT[letztes]) {
    vorschlag.push({ von: pfad, nach: `/${ort}/${DIREKT[letztes]}/`, regel: 'SEITE' });
    continue;
  }

  if (imTeambereich) {
    /* Eine Person darunter oder die Sammelseite selbst – beides führt auf
       die Teamseite. Genauer geht es nicht, weil es keine Personenseiten
       mehr gibt. */
    const istPerson = TEAM.some((m) => m.slug === letztes) || !GRUPPENSEITEN.includes(letztes);
    vorschlag.push({
      von: pfad,
      nach: `/${ort ?? 'berlin-charlottenburg'}/team/`,
      regel: istPerson ? 'PERSON' : 'GRUPPE',
    });
    continue;
  }

  /* 2b. Personen unterhalb eines Standorts: `/berlinmitte/dr-jana-huesch/`. */
  const istPerson =
    TEAM.some((m) => m.slug === letztes) ||
    (ort &&
      teile.length === 2 &&
      /^[a-z]+(-[a-z]+){1,3}$/.test(letztes) &&
      !['link-tree', 'jobs-und-karriere'].includes(letztes));
  if (ort && istPerson) {
    vorschlag.push({ von: pfad, nach: `/${ort}/team/`, regel: 'PERSON' });
    continue;
  }

  /* 3. Fachbereiche vor Einzelbehandlungen: `/potsdam/kieferorthopadie/` ist
     ein Bereich, keine Behandlung – die Stichwortsuche hätte darin sonst
     irgendeine einzelne Behandlung gefunden. */
  const vereinfachen = (t) => t.replace(/ae/g, 'a').replace(/oe/g, 'o').replace(/ue/g, 'u');
  const kategorie = KATEGORIEN.find((k) =>
    teile.some((t) => t === k.slug || vereinfachen(t) === vereinfachen(k.slug)),
  );

  /* Ist das letzte Pfadstück selbst der Bereichsname, dann ist es die
     Bereichsseite – und keine der Behandlungen darin. Ohne diesen Vorrang
     wurde aus `/potsdam/kieferorthopadie/` die Seite „All-on-4“, weil
     irgendein Stichwort zufällig passte. */
  if (kategorie && (letztes === kategorie.slug || vereinfachen(letztes) === vereinfachen(kategorie.slug))) {
    vorschlag.push({
      von: pfad,
      nach: ort ? `/${ort}/leistungen/` : '/leistungen/',
      regel: 'BEREICH',
    });
    continue;
  }

  /* 4. Behandlungen */
  const leistung = leistungAus(pfad, ort);
  if (leistung) {
    vorschlag.push({ von: pfad, nach: leistung, regel: 'LEISTUNG' });
    continue;
  }

  if (kategorie) {
    vorschlag.push({
      von: pfad,
      nach: ort ? `/${ort}/leistungen/` : `/leistungen/`,
      regel: 'BEREICH',
    });
    continue;
  }

  /* 5. Irgendwas unterhalb eines Standorts */
  if (ort) {
    vorschlag.push({ von: pfad, nach: `/${ort}/`, regel: 'ORT' });
    continue;
  }

  /* 6. Offen */
  offen.push({ von: pfad, grund: 'Keine Regel trifft – von Hand zuordnen' });
}

/* Selbstverweise entfernen: Was die neue Website unter derselben Adresse
   anbietet, braucht keine Weiterleitung. */
const gefiltert = vorschlag.filter((v) => v.von !== v.nach);

/*
 * Zielprüfung.
 *
 * Eine Weiterleitung auf eine Seite, die es nicht gibt, ist schlimmer als
 * keine: Sie kostet einen zusätzlichen Sprung und endet trotzdem im Fehler.
 * Besonders die von Hand gesetzten Ziele sind gefährdet – etwa, wenn eine
 * Behandlung an dem Standort gar nicht angeboten wird, auf den sie zeigen.
 */
const ungueltig = [];
if (vorhandeneSeiten.size) {
  for (const v of gefiltert) {
    const ohneAnker = v.nach.split('#')[0];
    if (!vorhandeneSeiten.has(ohneAnker)) ungueltig.push(v);
  }
}
if (ungueltig.length) {
  console.error(`\n[weiterleitungen] ${ungueltig.length} Ziele gibt es nicht:`);
  for (const v of ungueltig) console.error(`    ${v.von}  →  ${v.nach}  (${v.regel})`);
  console.error('    Bitte in HAND korrigieren. Die Datei wird trotzdem geschrieben,');
  console.error('    damit sich der Fehler ansehen lässt – aber so nicht ausliefern.\n');
}

/* ── Ausgabe ─────────────────────────────────────────────────────────────── */

const nachRegel = {};
for (const v of gefiltert) nachRegel[v.regel] = (nachRegel[v.regel] ?? 0) + 1;

const REGELTEXT = {
  HAND: 'von Hand zugeordnet',
  PERSON: 'Personenseite → Teamseite ihres Standorts',
  LEISTUNG: 'Behandlung erkannt, Standort berücksichtigt',
  BEREICH: 'Fachbereich erkannt → Übersicht mit Sprungziel',
  GRUPPE: 'Sammelseite des Teams → Teamseite',
  SEITE: 'gleichnamige Seite am Standort',
  ORT: 'unterhalb eines Standorts, kein genaueres Ziel',
};

const datei = `/**
 * Weiterleitungen des Altbestands.
 *
 * ERZEUGT von \`analyse/altbestand/weiterleitungen-planen.mjs\`, danach von
 * Hand gegenlesbar. Wer eine Zeile ändert, sollte sie in \`HAND\` im Skript
 * eintragen – sonst überschreibt der nächste Lauf die Änderung.
 *
 * ── Warum diese Datei existiert ────────────────────────────────────────────
 *
 * Die alte Website hat Adressen, die seit Jahren im Suchindex stehen und in
 * Lesezeichen liegen. Ohne Weiterleitung wird daraus eine Fehlerseite: Die
 * Person, die „Zahnimplantate Potsdam“ gesucht hat, landet im Nichts, und die
 * Platzierung, die diese Seite aufgebaut hat, ist verloren.
 *
 * ── Was NICHT weitergeleitet wird ──────────────────────────────────────────
 *
 * Blog und Fachbeiträge. Diese Inhalte gibt es auf der neuen Website nicht,
 * und eine Weiterleitung auf eine unpassende Seite ist keine Lösung, sondern
 * eine verschleierte Fehlerseite – Google nennt das „soft 404“ und behandelt
 * es genauso. Sie stehen offen in der Auswertung, damit die Entscheidung
 * darüber (Inhalte übernehmen oder aufgeben) bewusst getroffen wird.
 *
 * ── Zur Art der Weiterleitung ──────────────────────────────────────────────
 *
 * Astro erzeugt daraus bei statischer Ausgabe eine kleine HTML-Seite mit
 * \`meta refresh\` und Canonical. Das funktioniert und wird von Suchmaschinen
 * gewertet, ist aber schwächer als ein echter 301 im Server. Wenn die Seite
 * hinter einem Reverse Proxy liegt, gehören dieselben Paare dorthin – die
 * Liste ist genau dafür als Daten und nicht als Konfiguration abgelegt.
 */

export interface Weiterleitung {
  /** Adresse des Altbestands, immer mit abschließendem Schrägstrich. */
  von: string;
  /** Ziel auf der neuen Website. */
  nach: string;
  /** Nach welcher Regel das Ziel bestimmt wurde – siehe Planungsskript. */
  regel: 'HAND' | 'PERSON' | 'LEISTUNG' | 'BEREICH' | 'GRUPPE' | 'SEITE' | 'ORT';
}

export const WEITERLEITUNGEN: Weiterleitung[] = [
${gefiltert
  .map((v) => `  { von: '${v.von}', nach: '${v.nach}', regel: '${v.regel}' },`)
  .join('\n')}
];

/**
 * Adressen ohne Ziel – bewusst nicht weitergeleitet.
 *
 * Sie liefern eine 404 mit der Fehlerseite, die weiterhilft. Das ist die
 * ehrliche Antwort auf „diesen Inhalt gibt es nicht mehr“.
 */
export const OHNE_ZIEL: { von: string; grund: string }[] = [
${offen.map((o) => `  { von: '${o.von}', grund: '${o.grund}' },`).join('\n')}
];

/** Für astro.config.mjs: das Format, das Astro erwartet. */
export function alsAstroRedirects(): Record<string, string> {
  return Object.fromEntries(WEITERLEITUNGEN.map((w) => [w.von, w.nach]));
}
`;

await writeFile(path.join(WURZEL, 'src/data/weiterleitungen.ts'), datei);

console.log(`[weiterleitungen] ${bestand.size} Adressen im Altbestand`);
console.log(`[weiterleitungen] ${gefiltert.length} Weiterleitungen vorgeschlagen:`);
for (const [regel, n] of Object.entries(nachRegel).sort((a, b) => b[1] - a[1])) {
  console.log(`    ${String(n).padStart(4)}  ${regel.padEnd(9)} ${REGELTEXT[regel]}`);
}
console.log(`[weiterleitungen] ${offen.length} ohne Ziel:`);
const gruende = {};
for (const o of offen) gruende[o.grund] = (gruende[o.grund] ?? 0) + 1;
for (const [grund, n] of Object.entries(gruende)) {
  console.log(`    ${String(n).padStart(4)}  ${grund}`);
}
for (const o of offen.filter((o) => o.grund.startsWith('Keine Regel'))) {
  console.log(`          · ${o.von}`);
}
console.log('\n[weiterleitungen] → src/data/weiterleitungen.ts');
