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

  const zielSlug = eigenSlug(ziel);

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

  /* Ein Abschnitt, der nur aus einer Überschrift besteht, ist eine
     Überschrift ohne Inhalt – im Neubau eine leere Zeile. Weg damit. */
  return aus.filter((a) => a.bloecke.length > 0);
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

const langtexte = { leistungen: {}, unterthemen: {}, kategorien: {}, neu: {} };

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

/* ── Bericht ─────────────────────────────────────────────────────────── */

const summe = (o) => Object.values(o).reduce((s, x) => s + x.woerter, 0);
const gesamtWoerter = summe(langtexte.leistungen) + summe(langtexte.unterthemen) + summe(langtexte.kategorien) + summe(langtexte.neu);

console.log(
  `[langtexte] ${alt.length} alte Leistungsseiten eingeordnet\n` +
    `            ${Object.keys(langtexte.leistungen).length} Hauptseiten   ${summe(langtexte.leistungen).toLocaleString('de-DE').padStart(8)} Wörter\n` +
    `            ${Object.keys(langtexte.unterthemen).length} Unterthemen   ${summe(langtexte.unterthemen).toLocaleString('de-DE').padStart(8)} Wörter\n` +
    `            ${Object.keys(langtexte.neu).length} neue Seiten   ${summe(langtexte.neu).toLocaleString('de-DE').padStart(8)} Wörter\n` +
    `            ${'—'.repeat(24)}\n` +
    `            ${(summe(langtexte.leistungen) + summe(langtexte.unterthemen) + summe(langtexte.neu)).toLocaleString('de-DE').padStart(38)} Wörter`,
);

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
