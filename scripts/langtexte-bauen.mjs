/**
 * Die Originaltexte den neuen Seiten zuordnen.
 *
 * ── Was hier entschieden wird ───────────────────────────────────────────
 *
 * Der Neubau hat 36 Behandlungsseiten, die alte Website hatte 74. Die
 * Weiterleitungstabelle sagt für jede alte Adresse, wohin sie heute führt –
 * damit steht die Zuordnung schon fest und muss nicht geraten werden.
 *
 * Daraus ergeben sich drei Fälle, und sie werden verschieden behandelt:
 *
 *   HAUPTSEITE   Die alte Seite ist die Hauptseite ihrer Behandlung. Ihr
 *                Text wird der Langtext dieser Behandlung.
 *
 *   UNTERTHEMA   Die alte Seite lag TIEFER und behandelte eine eigene
 *                Frage: „Zahnimplantat Kosten", „Zahnimplantat
 *                Haltbarkeit", „Implantate und Rauchen". Sie bekommt ihre
 *                eigene Seite zurück.
 *
 *                Das ist die wichtigste Entscheidung in diesem Skript. Der
 *                Text als weiterer Abschnitt der Hauptseite wäre einfacher
 *                – und würde den Fehler wiederholen, um den es geht: Wer
 *                „was kostet ein zahnimplantat" sucht, soll eine Seite
 *                finden, die genau das beantwortet, und nicht einen Absatz
 *                auf Position 60 einer langen Seite. Vier der fünf alten
 *                Implantatseiten waren solche Fragen.
 *
 *   EIGENE SEITE Die alte Seite wurde auf die Übersicht oder einen Anker
 *                darin zusammengefaltet – 18 Themen, 34.811 Wörter. Sie
 *                bekommt eine eigene Behandlungsseite.
 *
 * ── Warum JSON und nicht TypeScript ─────────────────────────────────────
 *
 * Der Langtext ist erzeugt, nicht handgeschrieben. In `leistungen.ts` steht
 * das, was ein Mensch gepflegt hat – Preise, Verfügbarkeit, FAQ. Beides in
 * einer Datei würde bei jedem Lauf dieses Skripts die Handarbeit
 * überschreiben. Deshalb liegt der Langtext daneben und wird über den Slug
 * zusammengeführt.
 *
 * ── Was NICHT passiert ──────────────────────────────────────────────────
 *
 * Nichts wird umformuliert, gekürzt oder „verbessert". Das ist der Text der
 * Praxis, fachlich verantwortet von Zahnärztinnen und Zahnärzten. Ihn
 * umzuschreiben wäre genau der Übergriff, der beim ersten Mal zu 89 Prozent
 * Verlust geführt hat. Übernommen wird wortgleich; verändert wurden nur
 * Versalien in den Überschriften (siehe texte-bereinigen.mjs).
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   node scripts/langtexte-bauen.mjs
 *   node scripts/langtexte-bauen.mjs --bericht   (nur zeigen, nichts schreiben)
 *
 * Ergebnis: src/inhalte/langtexte.json
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const WURZEL = path.resolve(import.meta.dirname, '..');
const NUR_BERICHT = process.argv.includes('--bericht');

const texte = JSON.parse(
  await readFile(path.join(WURZEL, 'analyse', 'altbestand', 'texte.json'), 'utf8'),
);

/* ── Weiterleitungen lesen ───────────────────────────────────────────── */

/* Aus der TypeScript-Datei statt über einen Import: Dieses Skript läuft mit
   nacktem node, und ein `--experimental-strip-types` für eine Tabelle aus
   Zeichenketten wäre Aufwand ohne Gewinn. Die Form ist stabil, weil
   `urls-abgleichen.mjs` sie ohnehin prüft. */
const wlQuelle = await readFile(path.join(WURZEL, 'src', 'data', 'weiterleitungen.ts'), 'utf8');
const ZIEL_VON = new Map(
  [...wlQuelle.matchAll(/\{\s*von:\s*'([^']+)',\s*nach:\s*'([^']+)'/g)].map((m) => [m[1], m[2]]),
);

/* ── Alte Leistungsseiten einordnen ──────────────────────────────────── */

const alt = texte.eintraege
  .filter((e) => e.status === 200 && e.pfad.startsWith('/leistungen/') && e.bloecke.length > 0)
  .sort((a, z) => a.pfad.localeCompare(z.pfad));

/** Wie viele Ebenen tief liegt der Pfad? `/leistungen/a/b/` → 3 */
const tiefe = (p) => p.split('/').filter(Boolean).length;

/** Letztes Pfadstück – der Slug, den die Seite selbst getragen hat. */
const eigenSlug = (p) => p.split('/').filter(Boolean).pop();

/* Die Slugs, die es im Neubau wirklich als Behandlung gibt.
   Nur aus dem LEISTUNGEN-Abschnitt: KATEGORIEN stehen darüber und haben
   dieselbe Einrückung. Ein erster Entwurf las beide und meldete daraufhin
   „vorsorge, aesthetik, zahnersatz … ohne alten Langtext" – zehn
   Kategorien, die nie einen Text hatten und auch keinen brauchen. */
const leistungenQuelle = await readFile(path.join(WURZEL, 'src', 'data', 'leistungen.ts'), 'utf8');
const NEUE_SLUGS = new Set(
  [
    ...leistungenQuelle
      .slice(leistungenQuelle.indexOf('export const LEISTUNGEN'))
      .matchAll(/^\s{4}slug: '([^']+)'/gm),
  ].map((m) => m[1]),
);

const faelle = [];

for (const e of alt) {
  const ziel = ZIEL_VON.get(e.pfad) ?? null;

  /* Die Übersicht selbst ist keine Behandlung. */
  if (e.pfad === '/leistungen/') {
    faelle.push({ art: 'UEBERSICHT', alt: e.pfad, slug: null, eintrag: e });
    continue;
  }

  /*
   * Keine Weiterleitung heißt nicht „gefaltet", sondern kann heißen: Die
   * Adresse ist unverändert, also braucht sie keine.
   *
   * Genau das war ein Fehler des ersten Entwurfs: `/leistungen/prophylaxe-4-0/`
   * und `/leistungen/kinderzahnarzt/` heißen im Neubau genauso, stehen
   * deshalb in keiner Weiterleitungstabelle – und landeten als „neue Seite"
   * neben der Behandlung, die es schon gibt. Zwei Seiten, ein Thema.
   */
  if (!ziel && tiefe(e.pfad) === 2 && NEUE_SLUGS.has(eigenSlug(e.pfad))) {
    faelle.push({ art: 'HAUPTSEITE', alt: e.pfad, slug: eigenSlug(e.pfad), eintrag: e });
    continue;
  }

  /*
   * Dasselbe eine Ebene tiefer: `/leistungen/<behandlung>/<unterthema>/` ohne
   * Weiterleitung, weil die Adresse unverändert gilt.
   *
   * Fünf Unterthemen sind genau so durchgefallen, nachdem
   * `weiterleitungen-nachziehen.mjs` ihre Einträge entfernt hatte – zu Recht
   * entfernt, denn eine Weiterleitung auf sich selbst wäre eine Schleife. Nur
   * hieß das für diesen Generator „kein Ziel", also „zusammengefaltet", und er
   * legte sie als neue Seiten neben die Behandlung, zu der sie gehören.
   *
   * Zwei Regeln, die einander widersprachen. Der Fehler lag in der Annahme,
   * eine fehlende Weiterleitung bedeute Verlust. Sie kann auch bedeuten: nichts
   * zu tun.
   */
  if (!ziel && tiefe(e.pfad) === 3) {
    const teile = e.pfad.split('/').filter(Boolean);
    if (NEUE_SLUGS.has(teile[1])) {
      faelle.push({
        art: 'UNTERTHEMA',
        alt: e.pfad,
        leistung: teile[1],
        slug: teile[2],
        eintrag: e,
      });
      continue;
    }
  }

  /* Kein Ziel oder Ziel ist die Übersicht bzw. ein Anker darin:
     zusammengefaltet – bekommt eine eigene Seite. */
  if (!ziel || ziel === '/leistungen/' || ziel.startsWith('/leistungen/#')) {
    faelle.push({
      art: 'EIGENE',
      alt: e.pfad,
      slug: eigenSlug(e.pfad),
      anker: ziel && ziel.includes('#') ? ziel.split('#')[1] : null,
      eintrag: e,
    });
    continue;
  }

  const zielTeile = ziel.split('/').filter(Boolean);
  const zielSlug = eigenSlug(ziel);

  /*
   * Zeigt die Weiterleitung schon auf eine Unterseite, dann steht die
   * Zuordnung dort – und muss nicht neu abgeleitet werden.
   *
   * Das ist die Lehre aus einem Lauf, der sich selbst zerlegt hat:
   * `weiterleitungen-nachziehen.mjs` biegt die Ziele auf die
   * wiederhergestellten Seiten um, also von `/leistungen/zahnimplantate/` auf
   * `/leistungen/zahnimplantate/zahnimplantat-kosten/`. Beim nächsten Lauf war
   * `eigenSlug(ziel)` dann „zahnimplantat-kosten", und weil der eigene Slug
   * derselbe ist, wurde die Regel unten zu HAUPTSEITE – aus 37 Hauptseiten und
   * 31 Unterthemen wurden 60 und 3.
   *
   * Ein Skript, das beim zweiten Lauf etwas anderes ergibt als beim ersten,
   * ist keine Zuordnung, sondern ein Zufall. Deshalb wird der Fall
   * `/leistungen/<behandlung>/<unterthema>/` zuerst geprüft: Er sagt
   * ausdrücklich, was gemeint ist, und sagt es bei jedem Lauf gleich.
   */
  if (zielTeile.length === 3 && zielTeile[0] === 'leistungen') {
    faelle.push({
      art: 'UNTERTHEMA',
      alt: e.pfad,
      leistung: zielTeile[1],
      slug: zielTeile[2],
      eintrag: e,
    });
    continue;
  }

  /* Tiefer als drei Ebenen UND der eigene Slug ist nicht der Zielslug:
     eigene Frage, eigene Seite. */
  if (tiefe(e.pfad) > 3 && eigenSlug(e.pfad) !== zielSlug) {
    faelle.push({
      art: 'UNTERTHEMA',
      alt: e.pfad,
      leistung: zielSlug,
      slug: eigenSlug(e.pfad),
      eintrag: e,
    });
    continue;
  }

  faelle.push({ art: 'HAUPTSEITE', alt: e.pfad, slug: zielSlug, eintrag: e });
}

/*
 * Unterthemen, die in Wahrheit die Hauptseite sind.
 *
 * Die Tiefenregel oben ordnet nach der Adresse, und in fünf Fällen liegt die
 * Adresse anders als der Inhalt: Die alte Website führte „Inlays" als
 * Unterseite von „Zahnersatz", im Neubau heißt die Behandlung selbst
 * „inlays-onlays". Der Text ist also nicht das Unterthema, sondern der
 * Hauptext – und die Behandlungsseite stünde ohne ihn mit 195 eigenen
 * Wörtern da, während 3.387 Wörter eine Ebene tiefer liegen.
 *
 * Ausdrücklich als Tabelle und nicht über Slug-Ähnlichkeit: „kronen" und
 * „keramik-kronen" ähneln sich, „periimplantitis" und
 * „implantat-prophylaxe" nicht – obwohl beides dieselbe Beziehung wäre,
 * wenn man sie über Zeichenketten rät. Und die Gegenprobe ist genauso
 * wichtig: Periimplantitis ist eine eigene Erkrankung mit eigener
 * Suchnachfrage und BLEIBT eine eigene Seite. Dasselbe gilt für die
 * Präimplantationsdiagnostik.
 *
 * Wer hier einen Eintrag hinzufügt, nimmt der Unterseite ihre eigene
 * Adresse. Das ist nur richtig, wenn beide dasselbe Thema behandeln.
 */
const IST_HAUPTSEITE = new Map([
  ['inlays-onlays/inlays', 'Dieselbe Behandlung, im Neubau nur anders benannt.'],
  ['keramik-kronen/kronen', 'Dieselbe Behandlung, im Neubau mit dem Material im Namen.'],
  ['teilprothese/zahnprothese', 'Dieselbe Behandlung; „Zahnprothese" ist das Wort der Patientin.'],
]);

/* Mehrere Hauptseiten für dieselbe Behandlung: Die mit dem meisten Text
   trägt den Langtext, die übrigen werden Unterthemen. Sonst gewinnt der
   Zufall der Sortierung, und ein 3.000-Wort-Text landet als Anhang unter
   einem 400-Wort-Text. */
const hauptNach = new Map();
for (const f of faelle.filter((x) => x.art === 'HAUPTSEITE')) {
  if (!hauptNach.has(f.slug)) hauptNach.set(f.slug, []);
  hauptNach.get(f.slug).push(f);
}
for (const [slug, liste] of hauptNach) {
  if (liste.length < 2) continue;
  liste.sort((a, z) => z.eintrag.woerter - a.eintrag.woerter);
  for (const f of liste.slice(1)) {
    f.art = 'UNTERTHEMA';
    f.leistung = slug;
    f.slug = eigenSlug(f.alt);
  }
}

/* Die Tabelle anwenden – nach der Sortierung, damit sie das letzte Wort hat. */
for (const f of faelle) {
  if (f.art !== 'UNTERTHEMA') continue;
  if (!IST_HAUPTSEITE.has(`${f.leistung}/${f.slug}`)) continue;
  /* Trägt die Behandlung schon einen Hauptext, wäre das ein Widerspruch:
     Dann sind es zwei Seiten zu einem Thema, und die Tabelle ist falsch. */
  const schon = faelle.find((x) => x.art === 'HAUPTSEITE' && x.slug === f.leistung);
  if (schon) {
    console.error(
      `[langtexte] ABBRUCH: ${f.leistung}/${f.slug} steht in IST_HAUPTSEITE, aber\n` +
        `            ${f.leistung} hat bereits einen Hauptext aus ${schon.alt}.\n` +
        `            Eines von beiden ist falsch – bitte im Skript klären.`,
    );
    process.exit(1);
  }
  f.art = 'HAUPTSEITE';
  f.slug = f.leistung;
  delete f.leistung;
}

/* ── Abschnitte bilden ───────────────────────────────────────────────── */

/**
 * Blöcke in Abschnitte schneiden – an jeder Überschrift ein neuer.
 *
 * Blöcke vor der ersten Überschrift bilden einen Abschnitt ohne
 * Überschrift; das ist die Einleitung, und die soll nicht unter einer
 * erfundenen Zwischenzeile stehen.
 */
function abschnitte(bloecke) {
  const aus = [];
  let laufend = { ueberschrift: null, stufe: null, bloecke: [] };

  for (const b of bloecke) {
    if (b.art === 'h2' || b.art === 'h3' || b.art === 'h4') {
      if (laufend.bloecke.length || laufend.ueberschrift) aus.push(laufend);
      laufend = { ueberschrift: b.text, stufe: b.art, bloecke: [] };
      continue;
    }
    laufend.bloecke.push({ art: b.art, text: b.text });
  }
  if (laufend.bloecke.length || laufend.ueberschrift) aus.push(laufend);

  /*
   * Ein Abschnitt, der nur aus einer Überschrift besteht, ist eine
   * Überschrift ohne Inhalt – im Neubau eine leere Zeile. Weg damit.
   *
   * ── Mit einer Ausnahme, und die hat 206 Überschriften gekostet ────────
   *
   * Eine Überschrift, unter der NUR tiefere Überschriften stehen, hat keine
   * eigenen Blöcke und war trotzdem nie leer: Sie ist der Titel des
   * Abschnitts, den die tieferen bilden. Auf `/ueber-uns/location/` heißt sie
   * „Ein Haus mit Geschichte – KU64 am Kurfürstendamm", darunter stehen
   * 1955, 1961, Anfang der 1990er, 2004, Sommer 2005. Ohne sie ist die
   * Zeitleiste eine Folge von Jahreszahlen ohne Anlass.
   *
   * Gemessen über den ganzen Altbestand: 568 Überschriften ohne eigene
   * Blöcke, davon 206 auf 98 Seiten mit einer tieferen Überschrift
   * unmittelbar danach. Die 206 sind Titel, die 362 sind wirklich leer.
   */
  const rang = { h2: 2, h3: 3, h4: 4 };
  return aus.filter((a, i) => {
    if (a.bloecke.length > 0) return true;
    if (!a.ueberschrift || !a.stufe) return false;
    const naechste = aus[i + 1];
    return Boolean(naechste?.stufe && rang[naechste.stufe] > rang[a.stufe]);
  });
}

const woerterVon = (ab) =>
  ab.reduce(
    (s, a) =>
      s +
      (a.ueberschrift ? a.ueberschrift.split(/\s+/).length : 0) +
      a.bloecke.reduce((t, b) => t + b.text.split(/\s+/).filter(Boolean).length, 0),
    0,
  );

/* ── Ausgabe zusammensetzen ──────────────────────────────────────────── */

/*
 * Die zusammengefalteten Themen, die jetzt Behandlungen sind.
 *
 * Sieben der zwölf sind in `leistungen.ts` als Behandlung eingetragen – teils
 * unter einem kürzeren Slug, weil „faltenbehandlung-in-berlin" eine Adresse
 * aus der Zeit ist, in der man den Ort in den Slug schrieb. Der Ort steht im
 * Neubau eine Ebene höher: /berlin-charlottenburg/leistungen/faltenbehandlung/.
 *
 * Die übrigen fünf sind keine Behandlungen, sondern Übersichten über eine
 * ganze Kategorie – „Zahnersatz", „Kieferorthopädie", „Ästhetische
 * Zahnmedizin", „Oralchirurgie", „Ästhetische Medizin". Ihr Text gehört auf
 * die Kategorieübersicht und nicht auf eine erfundene Behandlungsseite.
 */
const ALS_BEHANDLUNG = new Map([
  ['zahnsanierung', 'zahnsanierung'],
  ['longevity', 'longevity'],
  ['ganzheitliche-zahnmedizin', 'ganzheitliche-zahnmedizin'],
  ['kieferchirurgische-kombinationstherapie', 'kieferchirurgische-kombinationstherapie'],
  ['faltenbehandlung-in-berlin', 'faltenbehandlung'],
  ['zornesfalte-entfernen', 'zornesfalte'],
  ['hyaluron-lippen', 'hyaluron-lippen'],
]);

/** Alte Seite → Kategorie-Slug in `leistungen.ts`. */
const ALS_KATEGORIE = new Map([
  ['zahnersatz', 'zahnersatz'],
  ['kieferorthopaedie', 'kieferorthopaedie'],
  ['zahnaesthetik', 'aesthetik'],
  ['kieferchirurgie-mkg-chirurgie', 'chirurgie'],
  ['aesthetische-medizin', 'aesthetik-medizin'],
]);

const langtexte = { leistungen: {}, unterthemen: {}, kategorien: {}, neu: {}, themen: {} };

for (const f of faelle) {
  if (f.art === 'UEBERSICHT') continue;
  const ab = abschnitte(f.eintrag.bloecke);
  if (ab.length === 0) continue;

  const satz = {
    titel: f.eintrag.h1 || null,
    herkunft: f.alt,
    woerter: woerterVon(ab),
    abschnitte: ab,
  };

  if (f.art === 'HAUPTSEITE') {
    langtexte.leistungen[f.slug] = satz;
  } else if (f.art === 'UNTERTHEMA') {
    langtexte.unterthemen[`${f.leistung}/${f.slug}`] = { ...satz, leistung: f.leistung, slug: f.slug };
  } else if (f.art === 'EIGENE') {
    /* Reihenfolge zählt: Erst prüfen, ob es die Seite inzwischen als
       Behandlung gibt, dann als Kategorie, dann bleibt sie unzugeordnet –
       und wird unten gemeldet, statt still zu verschwinden. */
    const alsBehandlung = ALS_BEHANDLUNG.get(f.slug);
    const alsKategorie = ALS_KATEGORIE.get(f.slug);

    if (alsBehandlung) {
      if (langtexte.leistungen[alsBehandlung]) {
        console.error(
          `[langtexte] ABBRUCH: ${f.slug} soll Langtext von „${alsBehandlung}" werden,\n` +
            '            aber die Behandlung hat schon einen. Zwei Texte, eine Seite.',
        );
        process.exit(1);
      }
      langtexte.leistungen[alsBehandlung] = satz;
    } else if (alsKategorie) {
      langtexte.kategorien[alsKategorie] = { ...satz, kategorie: alsKategorie };
    } else {
      langtexte.neu[f.slug] = { ...satz, slug: f.slug, ankerVorher: f.anker };
    }
  }
}

/* ── Über uns: die zehn Belegseiten ──────────────────────────────────── */

/*
 * Dieselbe Mechanik wie oben, andere Grundmenge – und ein Zusatz, den es
 * bei den Behandlungstexten nicht braucht: eine Korrekturtabelle.
 *
 * ── Warum Korrekturen, wo sonst nichts angefasst wird ───────────────────
 *
 * Die Regel dieses Projekts lautet: Der Text der Praxis wird wortgleich
 * übernommen. Sie hat eine Grenze, und die heißt „…".
 *
 * Auf `/ueber-uns/` von ku64.de stehen heute vier unausgefüllte Platzhalter:
 * „Auf … Quadratmetern", „Hier kümmern sich … zahnärztliche Spezialistinnen",
 * „Ein Team aus … Mitarbeitenden", „In unseren Labors arbeiten …
 * Zahntechnikermeister". Jemand hat den Text geschrieben, die Zahlen später
 * einsetzen wollen und es nicht getan. Sie stehen seitdem so im Netz.
 *
 * Wortgleich zu übernehmen hieße hier: den Fehler mitnehmen. Also wird
 * korrigiert – aber nicht still. Jede Korrektur steht unten mit Grund, jede
 * muss GENAU EINMAL zutreffen, sonst bricht der Lauf ab. Damit kann ein
 * Textstück nicht unbemerkt verschwinden, weil sich die Vorlage geändert hat.
 *
 * Zwei Arten kommen vor:
 *
 *   PLATZHALTER   Eine Zahl, die niemand hat. Der Satz wird so gekürzt, dass
 *                 er ohne sie stimmt. Erfunden wird nichts – eine geratene
 *                 Quadratmeterzahl wäre schlimmer als keine.
 *
 *   TATSACHE      Eine Angabe, die der eigenen Website widerspricht. „Im Jahr
 *                 2006" steht auf /ueber-uns/; der Blogbeitrag „20 Jahre
 *                 KU64" derselben Website nennt den 9. Juli 2005, und
 *                 /berlin-charlottenburg/ schreibt „2005 gegründet". Zwei
 *                 gegen eins, und die zwei sind datiert.
 */

/*
 * `themen.ts` wird als Text gelesen, nicht importiert – wie `leistungen.ts`
 * weiter oben und aus demselben Grund: Dieses Skript läuft mit nacktem node.
 *
 * Gelesen wird EINTRAGSWEISE (`{ … }` ohne innere Klammern), nicht mit einem
 * Muster über die ganze Datei. Der erste Entwurf tat Letzteres und ordnete
 * `ohneLangtext: true` dem falschen Thema zu – ein Muster mit `[\s\S]*?`
 * beginnt am frühestmöglichen Treffer und läuft über Eintragsgrenzen hinweg.
 */
const UEBER_UNS_QUELLE = await readFile(path.join(WURZEL, 'src', 'data', 'themen.ts'), 'utf8');
const THEMEN_BLOCK = UEBER_UNS_QUELLE.slice(
  UEBER_UNS_QUELLE.indexOf('export const THEMEN'),
  UEBER_UNS_QUELLE.indexOf('export const THEMEN_MIT_SEITE'),
);
const THEMEN = [...THEMEN_BLOCK.matchAll(/\{[^{}]*\}/g)]
  .map((m) => m[0])
  .filter((e) => /slug:\s*'/.test(e) && /quelle:\s*'/.test(e))
  .map((e) => ({
    slug: /slug:\s*'([^']+)'/.exec(e)[1],
    quelle: /quelle:\s*'([^']+)'/.exec(e)[1],
    ohneLangtext: /ohneLangtext:\s*true/.test(e),
  }));

if (THEMEN.length === 0) {
  console.error('[langtexte] ABBRUCH: keine Themen aus src/data/themen.ts gelesen.');
  process.exit(1);
}

const KORREKTUREN = [
  {
    quelle: '/ueber-uns/',
    art: 'TATSACHE',
    von: 'KU64 steht seit 2006 für exzellente Zahnmedizin',
    nach: 'KU64 steht seit 2005 für exzellente Zahnmedizin',
    grund:
      'ku64.de/blog/20-jahre-ku64/ nennt den 9. Juli 2005, ku64.de/berlin-charlottenburg/ ' +
      '„2005 gegründet". Die Jahreszahl auf /ueber-uns/ widerspricht der eigenen Seite.',
  },
  {
    quelle: '/ueber-uns/',
    art: 'TATSACHE',
    von: 'am Kurfürstendamm 64 im Jahr 2006 setzen wir Maßstäbe',
    nach: 'am Kurfürstendamm 64 im Jahr 2005 setzen wir Maßstäbe',
    grund: 'Dieselbe Jahreszahl ein zweites Mal – siehe oben.',
  },
  {
    quelle: '/ueber-uns/',
    art: 'TATSACHE',
    von: 'Drei Standorte, ein Anspruch: Exzellenz',
    nach: 'Vier Standorte, ein Anspruch: Exzellenz',
    grund:
      'Die KiezPraxis in Wilmersdorf hat im Januar 2026 eröffnet. Die Überschrift auf ' +
      'ku64.de zählt sie ein halbes Jahr später immer noch nicht mit.',
  },
  {
    quelle: '/ueber-uns/',
    art: 'PLATZHALTER',
    von: 'Auf … Quadratmetern schaffen samtgoldene Farben, edle Formen und grüne Akzente eine Boutique-Hotel-Atmosphäre',
    nach: 'Samtgoldene Farben, edle Formen und grüne Akzente schaffen eine Boutique-Hotel-Atmosphäre',
    grund:
      'Die Quadratmeterzahl von Berlin-Mitte liegt nicht vor. Geraten wäre sie eine ' +
      'Behauptung über eine Praxis, die man betreten und nachmessen kann.',
  },
  {
    quelle: '/ueber-uns/',
    art: 'PLATZHALTER',
    von: 'Hier kümmern sich … zahnärztliche Spezialistinnen und Spezialisten und mehr als … Mitarbeitende um Ihr Anliegen.',
    nach: 'Hier kümmern sich zahnärztliche Spezialistinnen und Spezialisten sowie das Praxisteam um Ihr Anliegen.',
    grund:
      'Zwei Platzhalter in einem Satz. Die Zahlen stehen im Neubau auf der Teamseite des ' +
      'Standorts und kommen dort aus `team.ts` – im Fließtext wären sie eine zweite ' +
      'Quelle, die veraltet.',
  },
  {
    quelle: '/ueber-uns/',
    art: 'PLATZHALTER',
    von: 'Ein Team aus … zahnärztlichen Spezialistinnen und Spezialisten und mehr als … Mitarbeitenden kümmert sich in Potsdam',
    nach: 'Ein Team aus zahnärztlichen Spezialistinnen und Spezialisten kümmert sich in Potsdam',
    grund: 'Zwei weitere Platzhalter, gleiche Begründung.',
  },
  {
    quelle: '/ueber-uns/',
    art: 'PLATZHALTER',
    von: 'In unseren hochmodernen Labors arbeiten … erfahrene Zahntechnikermeister und -meisterinnen',
    nach: 'In unseren hochmodernen Labors arbeiten erfahrene Zahntechnikermeister und -meisterinnen',
    grund: 'Der vierte Platzhalter. Die Zahl der Zahntechnikermeister liegt nicht vor.',
  },
  /* ── Überschriften, die in Versalien oder halb in Versalien stehen ──── */
  {
    quelle: '/ueber-uns/auszeichnungen/',
    art: 'VERSALIEN',
    von: 'KU64 – DIE Mehrfach Ausgezeichnete Zahnarztpraxis',
    nach: 'KU64 – die mehrfach ausgezeichnete Zahnarztpraxis',
    grund:
      'Stand auf ku64.de als „KU64 – DIE MEHRFACH AUSGEZEICHNETE ZAHNARZTPRAXIS". Die ' +
      'Versalienregel in texte-bereinigen.mjs greift je Wort und lässt „DIE" stehen, weil ' +
      'es kürzer als vier Buchstaben ist – der Rest ist von Hand gesetzt.',
  },
  {
    quelle: '/ueber-uns/presseinfo/',
    art: 'VERSALIEN',
    von: 'KU64 Gehört ZU Deutschlands Meistporträtierten UND Meistzitierten Zahnarztpraxen.',
    nach: 'KU64 gehört zu Deutschlands meistporträtierten und meistzitierten Zahnarztpraxen',
    grund:
      'Dieselbe Ursache. Der Punkt am Ende fällt weg – eine Überschrift ist kein Satz.',
  },
  {
    quelle: '/ueber-uns/presseinfo/',
    art: 'TATSACHE',
    von: 'KU64 Seit 2006 – UND Noch Immer Nicht VON Dieser Welt. 🚀🦷',
    nach: 'KU64 seit 2005 – und noch immer nicht von dieser Welt 🚀🦷',
    grund:
      'Versalien wie oben, und noch einmal die falsche Jahreszahl: Die nächste Überschrift ' +
      'derselben Seite lautet „21 Jahre KU64 in den Schlagzeilen". 2026 minus 21 ist 2005.',
  },
  {
    quelle: '/ueber-uns/presseinfo/',
    art: 'VERSALIEN',
    von: '21 Jahre KU64 IN DEN Schlagzeilen',
    nach: '21 Jahre KU64 in den Schlagzeilen',
    grund: 'Versalien wie oben.',
  },
  {
    quelle: '/ueber-uns/best-practice/',
    art: 'VERSALIEN',
    von: 'erfolgsrezept Alleinstellungsmerkmale',
    nach: 'Erfolgsrezept: Alleinstellungsmerkmale',
    grund:
      'Stand als „erfolgsrezept Alleinstellungsmerkmale" – kleingeschriebener Anfang, zwei ' +
      'Substantive ohne Fuge. Ein Doppelpunkt macht daraus, was gemeint war.',
  },
  {
    quelle: '/ueber-uns/best-practice/',
    art: 'VERSALIEN',
    von: 'WorkshoP- und Tour-Anfragen & -Buchung:',
    nach: 'Workshop- und Tour-Anfragen',
    grund:
      'Das große P mitten im Wort ist ein Tippfehler. Der Doppelpunkt am Ende und ' +
      '„& -Buchung" gehören zu einer Überschrift, unter der eine Kontaktzeile steht – ' +
      'gekürzt auf das, was die Überschrift sagt.',
  },
  {
    quelle: '/ueber-uns/best-practice/',
    art: 'RECHTSCHREIBUNG',
    von: 'Lassen sie sich „führen“!',
    nach: 'Lassen Sie sich „führen“!',
    grund: 'Anrede kleingeschrieben.',
  },
  {
    quelle: '/ueber-uns/location/',
    art: 'RECHTSCHREIBUNG',
    von: 'Wie Urlaub für die Sinne: ein Praxisdesign das entspannt',
    nach: 'Wie Urlaub für die Sinne: ein Praxisdesign, das entspannt',
    grund: 'Fehlendes Komma vor dem Relativsatz.',
  },
  {
    quelle: '/ueber-uns/hilfsprojekt-suedafrika/',
    art: 'RECHTSCHREIBUNG',
    von: 'Hilfsprojekt“Westcoast Kids” in Südafrika zeigt erste Erfolge',
    nach: 'Hilfsprojekt „Westcoast Kids“ in Südafrika zeigt erste Erfolge',
    grund:
      'Fehlendes Leerzeichen vor dem Anführungszeichen, dazu englische Anführungszeichen ' +
      'in einem deutschen Satz.',
  },
  {
    quelle: '/ueber-uns/hilfsprojekt-suedafrika/',
    art: 'RECHTSCHREIBUNG',
    von: 'In drei Schritten zu gesunden Zähnen: die Inhalte des Projektes“Westcoast Kids”',
    nach: 'In drei Schritten zu gesunden Zähnen: die Inhalte des Projektes „Westcoast Kids“',
    grund: 'Dieselbe Stelle ein zweites Mal.',
  },
  {
    quelle: '/potsdam/ultraschall-reiniger/',
    art: 'RECHTSCHREIBUNG',
    von: 'Unser neue Ultraschallreiniger bei KU64 in Potsdam',
    nach: 'Unser neuer Ultraschallreiniger bei KU64 in Potsdam',
    grund: 'Falsche Endung im Titel der Seite.',
  },
  {
    quelle: '/ueber-uns/',
    art: 'SCHREIBWEISE',
    von: 'entworfen von den renommierten Graft-Architekten',
    nach: 'entworfen von den renommierten GRAFT-Architekten',
    grund:
      'Das Büro schreibt sich GRAFT, und ku64.de schreibt es an fünfzehn Stellen so – nur ' +
      'auf /ueber-uns/ nicht. Ein Eigenname wird nicht auf zwei Arten geschrieben.',
  },
  {
    quelle: '/ueber-uns/kooperationspartner/',
    art: 'VERSALIEN',
    von:
      'ZUR PHILOSOPHIE VON KU64 GEHÖRT ES, ZAHNÄRZTLICHE SPEZIALISTEN UNTER EINEM DACH ZU ' +
      'VEREINEN UND SOMIT UNSEREN PATIENTEN OPTIMALE BEHANDLUNG UND WOHLFÜHLATMOSPHÄRE ZU ' +
      'BIETEN. DAMIT DAS MÖGLICH WIRD, NUTZEN WIR AUCH DIE KOMPETENZEN UNSERER ' +
      'GESCHÄFTSPARTNER UND DAMIT STARKE SYNERGIE-EFFEKTE.',
    nach:
      'Zur Philosophie von KU64 gehört es, zahnärztliche Spezialisten unter einem Dach zu ' +
      'vereinen und somit unseren Patienten optimale Behandlung und Wohlfühlatmosphäre zu ' +
      'bieten. Damit das möglich wird, nutzen wir auch die Kompetenzen unserer ' +
      'Geschäftspartner und damit starke Synergie-Effekte.',
    grund:
      'Der Absatz steht auf ku64.de vollständig in Versalien. Ein ganzer Satz in ' +
      'Großbuchstaben ist schlechter lesbar und wird von Vorlesehilfen teils buchstabiert. ' +
      'Wortgleich, nur in normaler Schreibung – die deutsche Substantivgroßschreibung ist ' +
      'von Hand gesetzt, weil keine Regel sie raten kann.',
  },
];

/*
 * Blöcke, deren ART falsch ist – nicht ihr Text.
 *
 * `/ueber-uns/mitgliedschaften/` besteht aus fünfzehn `h2`, von denen keine
 * einen Absatz unter sich hat: Die Namen der Fachgesellschaften WAREN die
 * Überschriften. `abschnitte()` wirft eine Überschrift ohne Inhalt weg – zu
 * Recht, denn im Neubau wäre sie eine leere Zeile. Ergebnis wären 39 von 130
 * Wörtern gewesen, und die Liste der Mitgliedschaften, also der ganze Zweck
 * der Seite, wäre verschwunden.
 *
 * Der Fehler liegt in der alten Auszeichnung: Eine Aufzählung von Namen ist
 * eine Liste, keine Gliederung. Fünfzehn `h2` hintereinander sind auch
 * barrierefrei falsch – eine Vorlesehilfe kündigt fünfzehn Abschnitte an,
 * die es nicht gibt.
 */
const ARTWECHSEL = [
  {
    quelle: '/ueber-uns/mitgliedschaften/',
    von: 'h2',
    nach: 'li',
    /* Die eine Überschrift, die wirklich eine ist: Unter ihr stehen Links. */
    ausser: ['Weitere hilfreiche und interessante Links:'],
    grund:
      'Fünfzehn Fachgesellschaften standen als h2 ohne Inhalt darunter. Als Liste sind ' +
      'sie das, was sie sind – und bleiben erhalten.',
  },
];

/*
 * Blöcke, die auf der alten Seite ein Linktext waren und ohne ihren Link
 * nichts mehr sagen.
 */
const ENTFERNEN = [
  {
    quelle: '/ueber-uns/mitgliedschaften/',
    text: 'Mehr Informationen',
    grund:
      'War die Beschriftung eines Links zur Berliner Gesellschaft für Parodontologie. ' +
      'Ohne Ziel ist es ein Absatz mit zwei Wörtern.',
  },
];

/*
 * Ergänzungen: Absätze, die es auf der alten Seite nicht gab.
 *
 * Genau einer, und er ist die Folge einer Korrektur: Wer die Überschrift auf
 * „Vier Standorte" setzt und dann drei beschreibt, hat den Fehler nur
 * verschoben. Der vierte Absatz besteht ausschließlich aus Angaben, die in
 * `standorte.ts` stehen und auf `/wilmersdorf/` ohnehin veröffentlicht sind.
 */
const ERGAENZUNGEN = [
  {
    quelle: '/ueber-uns/',
    nach: 'Ein Team aus zahnärztlichen Spezialistinnen und Spezialisten kümmert sich in Potsdam',
    bloecke: [
      {
        art: 'p',
        text:
          'Seit Januar 2026 gehört die KiezPraxis in der Gasteiner Straße 9 dazu, im ' +
          'Wilmersdorfer Kiez zwischen Blissestraße und Fehrbelliner Platz. Sie ist die ' +
          'kleinste der vier Praxen und eine Tochterpraxis des Kurfürstendamms: Vorsorge, ' +
          'Prophylaxe, Zahnerhalt, Kinderzahnheilkunde und die häufigsten Formen von ' +
          'Zahnersatz gibt es vor Ort, alles Weitere am Kurfürstendamm – mit denselben ' +
          'Unterlagen und ohne neue Erstuntersuchung.',
      },
    ],
    grund:
      'Die Überschrift nennt jetzt vier Standorte; ohne diesen Absatz stünden darunter ' +
      'drei. Alle Angaben stammen aus `src/data/standorte.ts` und stehen so auf ' +
      '/wilmersdorf/.',
  },
];

const eintragVon = new Map(texte.eintraege.map((e) => [e.pfad, e]));
const korrekturTreffer = new Map(KORREKTUREN.map((k) => [k, 0]));
const ergaenzungTreffer = new Map(ERGAENZUNGEN.map((e) => [e, 0]));
const entfernTreffer = new Map(ENTFERNEN.map((e) => [e, 0]));
const artwechselTreffer = new Map(ARTWECHSEL.map((w) => [w, 0]));

for (const t of THEMEN) {
  if (t.ohneLangtext) continue;

  const eintrag = eintragVon.get(t.quelle);
  if (!eintrag || eintrag.status !== 200 || !eintrag.bloecke.length) {
    console.error(
      `[langtexte] ABBRUCH: Thema „${t.slug}" verweist auf ${t.quelle},\n` +
        '            aber dort liegt kein Text im Altbestand. Eine Themenseite ohne\n' +
        '            Inhalt wäre eine leere Seite mit Menüeintrag.',
    );
    process.exit(1);
  }

  /* Erst korrigieren, dann ergänzen, dann schneiden – in dieser Reihenfolge,
     damit eine Ergänzung an einen bereits korrigierten Satz andocken kann. */
  let bloecke = eintrag.bloecke
    .filter((b) => {
      const weg = ENTFERNEN.find((e) => e.quelle === t.quelle && e.text === b.text);
      if (!weg) return true;
      entfernTreffer.set(weg, entfernTreffer.get(weg) + 1);
      return false;
    })
    .map((b) => {
      let text = b.text;
      for (const k of KORREKTUREN) {
        if (k.quelle !== t.quelle) continue;
        if (!text.includes(k.von)) continue;
        text = text.replace(k.von, k.nach);
        korrekturTreffer.set(k, korrekturTreffer.get(k) + 1);
      }

      let art = b.art;
      for (const w of ARTWECHSEL) {
        if (w.quelle !== t.quelle || w.von !== art) continue;
        if (w.ausser?.includes(text)) continue;
        art = w.nach;
        artwechselTreffer.set(w, artwechselTreffer.get(w) + 1);
      }

      return { art, text };
    });

  const mitErgaenzung = [];
  for (const b of bloecke) {
    mitErgaenzung.push(b);
    for (const e of ERGAENZUNGEN) {
      if (e.quelle !== t.quelle) continue;
      if (!b.text.includes(e.nach)) continue;
      mitErgaenzung.push(...e.bloecke);
      ergaenzungTreffer.set(e, ergaenzungTreffer.get(e) + 1);
    }
  }
  bloecke = mitErgaenzung;

  /* Die H1 ist kein Block und läuft deshalb an der Schleife oben vorbei –
     sie braucht denselben Durchgang, sonst steht die Korrektur im Text und
     die alte Fassung in der Überschrift. */
  let titel = eintrag.h1 || null;
  if (titel) {
    for (const k of KORREKTUREN) {
      if (k.quelle !== t.quelle || !titel.includes(k.von)) continue;
      titel = titel.replace(k.von, k.nach);
      korrekturTreffer.set(k, korrekturTreffer.get(k) + 1);
    }
  }

  const ab = abschnitte(bloecke);
  if (ab.length === 0) continue;

  langtexte.themen[t.slug] = {
    titel,
    herkunft: t.quelle,
    woerter: woerterVon(ab),
    abschnitte: ab,
    slug: t.slug,
  };
}

/*
 * Jede Korrektur muss genau einmal gegriffen haben.
 *
 * Null Treffer heißt: Die Vorlage hat sich geändert, und die Korrektur läuft
 * ins Leere – der Platzhalter stünde wieder auf der Seite. Mehr als ein
 * Treffer heißt: Sie ist unspezifisch und ändert Stellen, die niemand
 * gelesen hat. Beides ist ein Abbruch, weil beides still passiert.
 */
const schiefe = [
  ...[...korrekturTreffer].filter(([, n]) => n !== 1).map(([k, n]) => [`Korrektur „${k.von.slice(0, 60)}…"`, n]),
  ...[...ergaenzungTreffer].filter(([, n]) => n !== 1).map(([e, n]) => [`Ergänzung nach „${e.nach.slice(0, 60)}…"`, n]),
  ...[...entfernTreffer].filter(([, n]) => n !== 1).map(([e, n]) => [`Entfernung von „${e.text.slice(0, 60)}"`, n]),
  /* Ein Artwechsel darf mehrfach greifen – er betrifft eine ganze Gattung.
     Null Treffer ist trotzdem ein Abbruch: Dann ist die Regel wirkungslos. */
  ...[...artwechselTreffer].filter(([, n]) => n === 0).map(([w, n]) => [`Artwechsel ${w.von}→${w.nach} auf ${w.quelle}`, n]),
];
if (schiefe.length) {
  console.error('\n[langtexte] ABBRUCH: Korrekturen, die nicht genau einmal gegriffen haben:');
  for (const [was, n] of schiefe) console.error(`    ${n}× ${was}`);
  console.error(
    '\n            0× heißt: Die Vorlage hat sich geändert, der Fehler steht wieder da.\n' +
      '            2× heißt: Die Korrektur trifft mehr als die Stelle, die gemeint war.',
  );
  process.exit(1);
}

/* Kein „…" darf einen Themen-Langtext verlassen. Die Prüfung nach der
   Korrektur, nicht davor – sonst prüft sie die Absicht statt das Ergebnis. */
const restplatzhalter = [];
for (const [slug, t] of Object.entries(langtexte.themen)) {
  for (const a of t.abschnitte) {
    for (const b of a.bloecke) {
      if (/\s…\s/.test(b.text)) restplatzhalter.push(`${slug}: ${b.text.slice(0, 90)}`);
    }
  }
}
if (restplatzhalter.length) {
  console.error(`\n[langtexte] ABBRUCH: ${restplatzhalter.length} unausgefüllte(r) Platzhalter:`);
  for (const r of restplatzhalter) console.error(`    ${r}`);
  process.exit(1);
}

/* ── Bericht ─────────────────────────────────────────────────────────── */

const summe = (o) => Object.values(o).reduce((s, x) => s + x.woerter, 0);

console.log(
  `[langtexte] ${alt.length} alte Leistungsseiten eingeordnet\n` +
    `            ${Object.keys(langtexte.leistungen).length} Hauptseiten   ${summe(langtexte.leistungen).toLocaleString('de-DE').padStart(8)} Wörter\n` +
    `            ${Object.keys(langtexte.unterthemen).length} Unterthemen   ${summe(langtexte.unterthemen).toLocaleString('de-DE').padStart(8)} Wörter\n` +
    `            ${Object.keys(langtexte.neu).length} neue Seiten   ${summe(langtexte.neu).toLocaleString('de-DE').padStart(8)} Wörter\n` +
    `            ${'—'.repeat(24)}\n` +
    `            ${Object.keys(langtexte.kategorien).length} Kategorietexte ${summe(langtexte.kategorien).toLocaleString('de-DE').padStart(8)} Wörter\n` +
    `            ${Object.keys(langtexte.themen).length} Über-uns-Themen ${summe(langtexte.themen).toLocaleString('de-DE').padStart(7)} Wörter\n` +
    `            ${'—'.repeat(24)}\n` +
    `            ${(
      summe(langtexte.leistungen) +
      summe(langtexte.unterthemen) +
      summe(langtexte.kategorien) +
      summe(langtexte.neu) +
      summe(langtexte.themen)
    ).toLocaleString('de-DE').padStart(38)} Wörter`,
);

console.log('\n[langtexte] Über uns – wiederhergestellte Belegseiten:');
for (const [k, v] of Object.entries(langtexte.themen).sort((a, z) => z[1].woerter - a[1].woerter)) {
  console.log(`              ${String(v.woerter).padStart(5)} W  ${k.padEnd(26)} ← ${v.herkunft}`);
}

console.log('\n[langtexte] Unterthemen, die eine eigene Seite zurückbekommen:');
for (const [k, v] of Object.entries(langtexte.unterthemen).sort((a, z) => z[1].woerter - a[1].woerter)) {
  console.log(`              ${String(v.woerter).padStart(5)} W  ${k}`);
}

console.log('\n[langtexte] Zusammengefaltete Themen, die eine eigene Seite bekommen:');
for (const [k, v] of Object.entries(langtexte.neu).sort((a, z) => z[1].woerter - a[1].woerter)) {
  console.log(`              ${String(v.woerter).padStart(5)} W  ${k}${v.ankerVorher ? `  (war Anker #${v.ankerVorher})` : ''}`);
}

/*
 * Behandlungen des Neubaus, die weder einen alten Langtext noch ein
 * Unterthema haben.
 *
 * Getrennt aufgeführt, weil beides verschiedene Dinge sind: Eine Behandlung
 * mit Unterthemen hat Substanz, nur nicht auf der Hauptseite. Eine ganz
 * ohne alten Text ist entweder neu – dann ist sie ein Zugewinn und kein
 * Mangel – oder ihr Text ist woanders gelandet, und das gehört gesehen.
 */
const mitUnterthema = new Set(Object.values(langtexte.unterthemen).map((u) => u.leistung));
const ganzOhne = [...NEUE_SLUGS].filter((s) => !langtexte.leistungen[s] && !mitUnterthema.has(s));
const nurUnterthemen = [...NEUE_SLUGS].filter((s) => !langtexte.leistungen[s] && mitUnterthema.has(s));

if (nurUnterthemen.length) {
  console.log(`\n[langtexte] ${nurUnterthemen.length} Behandlung(en) mit Substanz nur in Unterthemen:`);
  console.log(`              ${nurUnterthemen.join(', ')}`);
}
if (ganzOhne.length) {
  console.log(`\n[langtexte] ${ganzOhne.length} Behandlung(en) ohne alten Text – neu im Neubau:`);
  console.log(`              ${ganzOhne.join(', ')}`);
}

if (NUR_BERICHT) {
  console.log('\n[langtexte] --bericht: nichts geschrieben.');
  process.exit(0);
}

const ziel = path.join(WURZEL, 'src', 'inhalte', 'langtexte.json');
await writeFile(
  ziel,
  JSON.stringify(
    {
      erzeugtAm: new Date().toISOString(),
      quelle: 'analyse/altbestand/texte.json',
      hinweis:
        'Erzeugt von scripts/langtexte-bauen.mjs. Nicht von Hand bearbeiten – der nächste ' +
        'Lauf überschreibt es. Der Text ist wortgleich der von ku64.de; geändert wurden nur ' +
        'Versalien in Überschriften. Fachlich verantwortet die Praxis.',
      ...langtexte,
    },
    null,
    1,
  ),
);
console.log(`\n[langtexte] → ${path.relative(WURZEL, ziel)}`);
