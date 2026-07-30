/**
 * Google Lighthouse über die neue Website – gemessen, nicht geschätzt.
 *
 * ── Warum es das gibt ───────────────────────────────────────────────────
 *
 * Über die Website standen bisher Zahlen im Bericht, die aus eigenen
 * Messungen kamen (`analyse/vergleich/tempo.mjs`: LCP und CLS im echten
 * Browser). Das ist richtig gerechnet, aber es ist nicht das, worüber
 * geredet wird. Geredet wird über Lighthouse-Punkte – die vier Ringe, die
 * jeder kennt, die in Chrome eingebaut sind und die jede Agentur
 * nachprüfen kann. Wer eine Zahl behauptet, muss sie reproduzierbar
 * machen; deshalb ein Skript und keine Bildschirmfotos.
 *
 * Gemessen wird gegen den eigenen Server (`server/index.mjs`), nicht gegen
 * den Astro-Entwicklungsserver. Nur der Server liefert aus, was später
 * live geht: Kompression, Cache-Köpfe, CSP, Weiterleitungen. Der
 * Entwicklungsserver liefert davon nichts und ergibt deshalb Punkte, die
 * niemandem gehören.
 *
 * ── WICHTIG: warum OEFFENTLICHE_HOSTS gesetzt sein muss ─────────────────
 *
 * Das ist keine Schönfärberei, sondern die Bedingung dafür, dass überhaupt
 * das Richtige gemessen wird. Der Zusammenhang:
 *
 * `server/index.mjs` setzt auf jeder Adresse, die nicht ku64.de ist, den
 * Kopf `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet` und liefert
 * eine eigene `robots.txt` mit `Disallow: /`. Das ist die Vorschau-Sperre:
 * Solange die neue Website unter einer Railway-Adresse steht, während die
 * alte unter ku64.de läuft, darf die Vorschau nicht in den Index – sonst
 * steht der Inhalt der Praxis zweimal im Netz und konkurriert mit sich
 * selbst. Die Sperre hängt am Host, nicht an einem Schalter, damit sie
 * beim Umzug von selbst abfällt (siehe Kopfkommentar dort).
 *
 * Für Lighthouse ist genau diese Sperre ein Fehler: „Page is blocked from
 * indexing". Ein Lauf gegen 127.0.0.1 ohne Vorkehrung ergibt deshalb
 * SEO 69 statt 100 – gemessen wird dann die Vorschau-Sperre, nicht die
 * Website. Mit
 *
 *   OEFFENTLICHE_HOSTS=127.0.0.1
 *
 * gilt 127.0.0.1 dem Server als öffentlicher Host; er verhält sich exakt
 * so, wie er sich unter ku64.de verhalten wird. Es wird nichts abgeschaltet
 * und nichts überschrieben: dieselbe Codezeile, anderer Host. Wer die
 * Variable wegläßt, mißt einen Zustand, den es live nicht gibt – in der
 * einen wie in der anderen Richtung.
 *
 * Zur Sicherheit prüft dieses Skript vor dem ersten Lauf, ob der Kopf
 * wirklich weg ist, und bricht sonst ab. Eine 69 soll niemandem als
 * Website-Fehler untergeschoben werden, und eine 100 soll niemand für
 * gerechnet halten müssen.
 *
 * ── Was gemessen wird ───────────────────────────────────────────────────
 *
 * Fünf Seiten, je einmal mobil und einmal am Schreibtisch. Mobil ist die
 * strengere und die wichtigere Messung: Lighthouse drosselt dort CPU und
 * Netz, und die Praxis hat ihre Besucher überwiegend auf dem Telefon.
 *
 * Die Seiten sind nach Bauart ausgewählt, nicht nach Beliebtheit – jede
 * steht für eine Vorlage, die es hundertfach gibt. Mehr Seiten derselben
 * Bauart sagen nichts Neues.
 *
 * Festgehalten werden die vier Kategorien, die vier Kennzahlen, die Google
 * als Rankingfaktor verwendet oder in den Punkten gewichtet (LCP, CLS,
 * TBT, Speed Index), und die zehn größten Verbesserungsmöglichkeiten mit
 * Einsparpotenzial. Dazu je Lauf der Endzustands-Screenshot, den
 * Lighthouse ohnehin aufnimmt – damit später niemand raten muß, ob die
 * Seite beim Messen überhaupt richtig geladen war.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   npm run build
 *   OEFFENTLICHE_HOSTS=127.0.0.1 HOST=127.0.0.1 PORT=4400 node ./server/index.mjs &
 *   node scripts/lighthouse-lauf.mjs [basis]
 *
 * Standard-Basis ist http://127.0.0.1:4400.
 */

import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const WURZEL = path.resolve(import.meta.dirname, '..');
const BASIS = (process.argv[2] || 'http://127.0.0.1:4400').replace(/\/$/, '');
const ZIEL = path.join(WURZEL, 'analyse', 'vergleich', 'lighthouse.json');
const SCHIRM = path.join(WURZEL, 'analyse', 'vergleich', 'schirm');

/* Chromium liegt im Bild an fester Stelle; Lighthouse findet ihn nur über
   CHROME_PATH. Ohne das sucht es einen installierten Chrome und bricht ab. */
const CHROME = process.env.CHROME_PATH || '/opt/pw-browsers/chromium';

/*
 * `--no-sandbox`, weil im Container root läuft und Chromium sonst nicht
 * startet. `--enable-unsafe-swiftshader`, weil es keine Grafikkarte gibt:
 * ohne das bleibt die Startseite beim Video und beim WebGL-Verlauf hängen,
 * und der LCP mißt eine Seite, die nie fertig wird.
 */
const CHROME_FLAGS = '--headless=new --no-sandbox --enable-unsafe-swiftshader';

/* Der eigene Lighthouse aus node_modules, nicht `npx`. `npx` würde bei
   fehlendem Paket still eine andere Fassung aus dem Netz holen – dann
   stehen in der JSON Punkte einer Fassung, die niemand kennt. */
const LIGHTHOUSE = path.join(WURZEL, 'node_modules', 'lighthouse', 'cli', 'index.js');

/**
 * Fünf Bauarten.
 *
 * `name` ist auch der Dateiname des Screenshots, deshalb klein und ohne
 * Umlaute – nicht aus Bequemlichkeit, sondern weil Dateinamen mit Umlaut
 * je nach Betriebssystem anders normalisiert werden und der Verweis aus
 * dem Bericht dann ins Leere zeigt.
 *
 * Das Team steht unter `/berlin-charlottenburg/team/`, nicht unter
 * `/ueber-uns/team/`. Letzteres ist eine 404 – es gibt kein Team ohne
 * Standort, weil jede Person einem Standort zugeordnet ist. `/team/`
 * leitet mit 301 auf Charlottenburg um; gemessen wird das Ziel, denn eine
 * Weiterleitung kostet nur Zeit und sagt nichts über die Seite.
 */
const SEITEN = [
  ['/', 'startseite'],
  ['/potsdam/', 'potsdam'],
  ['/berlin-charlottenburg/leistungen/zahnimplantate/', 'zahnimplantate'],
  ['/berlin-charlottenburg/team/', 'team'],
  ['/blog/', 'blog'],
];

/* Mobil ist die Standardeinstellung von Lighthouse (gedrosselt), Desktop
   braucht das Preset. Beide, weil sich die Seiten unterscheiden: der
   Berater trägt am Telefon keinen Text, der Fuß ist einspaltig, und die
   Bilder kommen in anderen Größen. */
const GERAETE = [
  ['mobil', []],
  ['schreibtisch', ['--preset=desktop']],
];

const KATEGORIEN = [
  ['leistung', 'performance'],
  ['barrierefreiheit', 'accessibility'],
  ['bestPractices', 'best-practices'],
  ['seo', 'seo'],
];

const METRIKEN = [
  ['lcp', 'largest-contentful-paint'],
  ['cls', 'cumulative-layout-shift'],
  ['tbt', 'total-blocking-time'],
  ['speedIndex', 'speed-index'],
  ['fcp', 'first-contentful-paint'],
];

/* ── Vorprüfung ──────────────────────────────────────────────────────── */

/**
 * Steht der Server, antworten alle fünf Adressen mit 200, und ist die
 * Vorschau-Sperre aus?
 *
 * Das muß vor dem ersten Lauf geklärt sein. Lighthouse mißt eine 404
 * bereitwillig und liefert dafür Punkte; eine 404 mit SEO 92 im Bericht
 * ist schlimmer als keine Zahl. Und wer die Sperre nicht bemerkt, hält
 * nachher die 69 für einen Fehler der Website.
 */
async function vorpruefen() {
  const fehler = [];

  for (const [pfad] of SEITEN) {
    let antwort;
    try {
      antwort = await fetch(BASIS + pfad, { redirect: 'manual' });
    } catch (e) {
      console.error(`\n[lighthouse] Kein Server auf ${BASIS} – ${e.message}`);
      console.error('             Bitte zuerst starten:');
      console.error(
        '             OEFFENTLICHE_HOSTS=127.0.0.1 HOST=127.0.0.1 PORT=4400 node ./server/index.mjs',
      );
      process.exit(1);
    }

    if (antwort.status !== 200) {
      fehler.push(`${pfad} antwortet ${antwort.status} statt 200`);
      continue;
    }

    const robots = antwort.headers.get('x-robots-tag');
    if (robots) {
      fehler.push(
        `${pfad} sendet „X-Robots-Tag: ${robots}" – die Vorschau-Sperre ist an, ` +
          'OEFFENTLICHE_HOSTS fehlt',
      );
    }
  }

  if (fehler.length === 0) return;

  console.error('\n[lighthouse] ABBRUCH – so gemessen wäre das Ergebnis falsch:');
  for (const f of fehler) console.error(`    ${f}`);
  console.error(
    '\n             Die Vorschau-Sperre bewertet Lighthouse als „Page is\n' +
      '             blocked from indexing" und zieht SEO auf 69. Das ist ein\n' +
      '             Zustand der Vorschau-Adresse, nicht der Website. Der\n' +
      '             Server muß deshalb so laufen:\n\n' +
      '               OEFFENTLICHE_HOSTS=127.0.0.1 HOST=127.0.0.1 PORT=4400 \\\n' +
      '                 node ./server/index.mjs\n',
  );
  process.exit(1);
}

/* ── Ein Lauf ────────────────────────────────────────────────────────── */

/** Lighthouse einmal ausführen und den Bericht als Objekt zurückgeben. */
async function lauf(adresse, zusatz) {
  /* Der Bericht geht über eine Datei, nicht über stdout: Lighthouse
     schreibt auf stdout auch Warnungen, und JSON mit einer Warnzeile davor
     ist kein JSON mehr. */
  const roh = path.join(os.tmpdir(), `lh-${process.pid}-${Date.now()}.json`);

  const argumente = [
    LIGHTHOUSE,
    adresse,
    '--quiet',
    '--output=json',
    `--output-path=${roh}`,
    `--chrome-flags=${CHROME_FLAGS}`,
    /* Nur die vier Kategorien, die im Bericht stehen. Die übrigen kosten
       Zeit und niemand liest sie. */
    '--only-categories=performance,accessibility,best-practices,seo',
    ...zusatz,
  ];

  const code = await new Promise((fertig) => {
    const kind = spawn(process.execPath, argumente, {
      cwd: WURZEL,
      env: { ...process.env, CHROME_PATH: CHROME },
      stdio: ['ignore', 'ignore', 'pipe'],
    });
    let meldung = '';
    kind.stderr.on('data', (d) => (meldung += d));
    kind.on('close', (c) => {
      if (c !== 0) console.error(meldung.trim().slice(0, 800));
      fertig(c);
    });
  });

  if (code !== 0) {
    await rm(roh, { force: true });
    throw new Error(`Lighthouse endete mit Code ${code} für ${adresse}`);
  }

  const bericht = JSON.parse(await readFile(roh, 'utf8'));
  await rm(roh, { force: true });
  return bericht;
}

/* ── Auswertung ──────────────────────────────────────────────────────── */

/*
 * Nur diese Kennzahlen zählen in Millisekunden.
 *
 * Das ist kein Detail. `metricSavings` enthält auch `CLS`, und CLS ist
 * einheitenlos – 0,371 ist ein Sprungmaß, keine Zeit. Ein erster Entwurf
 * nahm einfach das Maximum über alle Einträge; danach stand der größte
 * Layoutsprung der Website mit „0,371 ms" in der Liste und rutschte damit
 * hinter jede belanglose Prüfung. Wer Einheiten mischt, sortiert falsch.
 */
const ZEITKENNZAHLEN = ['LCP', 'FCP', 'INP', 'TBT'];

/**
 * Was eine Prüfung im besten Fall einspart – nach Einheit getrennt.
 *
 * Lighthouse 13 zählt die alten „opportunities" nicht mehr einzeln, sondern
 * bündelt sie in „insights". Das Einsparpotenzial steht dort in
 * `metricSavings`, bei den älteren Prüfungen in `details.overallSavingsMs`
 * bzw. `details.overallSavingsBytes`. Beides wird gelesen, weil in einem
 * Bericht beides vorkommt.
 *
 * Bei der Zeit wird das Maximum genommen, nicht die Summe: Eine Maßnahme,
 * die dem LCP 900 ms und dem FCP 0 ms bringt, bringt 900 ms – die Kennzahlen
 * überlappen, addieren würde das Potenzial erfinden.
 */
function einsparung(pruefung) {
  const sparen = pruefung.metricSavings ?? {};
  const zeiten = ZEITKENNZAHLEN.map((k) => sparen[k]).filter((w) => typeof w === 'number');
  const ms = Math.max(pruefung.details?.overallSavingsMs ?? 0, ...zeiten, 0);

  /* Bytes stehen bei den Insights nicht oben, sondern je Zeile der Tabelle –
     `wastedBytes` pro Bild. Hier wird summiert, weil das getrennte Dateien
     sind: drei Bilder à 170 KB sind 510 KB, nicht 170. */
  const zeilen = Array.isArray(pruefung.details?.items) ? pruefung.details.items : [];
  const bytesZeilen = zeilen.reduce(
    (s, z) => s + (typeof z.wastedBytes === 'number' ? z.wastedBytes : 0),
    0,
  );
  const bytes = Math.max(pruefung.details?.overallSavingsBytes ?? 0, bytesZeilen);

  return { ms, bytes, cls: typeof sparen.CLS === 'number' ? sparen.CLS : 0 };
}

/**
 * Der Endzustands-Screenshot, den Lighthouse ohnehin aufnimmt.
 *
 * Er steht als `data:image/jpeg;base64,…` im Bericht. Ihn zu speichern
 * kostet nichts und beantwortet die Frage, die bei jeder Messung zuerst
 * kommt: Stand die Seite überhaupt, oder wurde ein halb geladener Zustand
 * bepunktet?
 */
async function schirmbildSpeichern(bericht, datei) {
  const daten = bericht.audits?.['final-screenshot']?.details?.data;
  if (!daten) return null;
  const [, base64] = daten.split(',');
  if (!base64) return null;
  await writeFile(datei, Buffer.from(base64, 'base64'));
  return path.relative(WURZEL, datei);
}

/* ── Hauptteil ───────────────────────────────────────────────────────── */

if (!existsSync(LIGHTHOUSE)) {
  console.error('[lighthouse] node_modules/lighthouse fehlt – bitte `npm install`.');
  process.exit(1);
}

await vorpruefen();
await mkdir(SCHIRM, { recursive: true });

const laeufe = [];
/* Chancen werden je Prüfung gesammelt, nicht je Lauf. Dieselbe Ursache
   dreimal untereinander („Bilder zu groß" auf drei Seiten) ist eine
   Aufgabe, nicht drei – und eine Liste, in der eine Ursache zehnmal steht,
   verdeckt die neun anderen. */
const chancen = new Map();
let lighthouseVersion = null;

for (const [pfad, name] of SEITEN) {
  for (const [geraet, zusatz] of GERAETE) {
    process.stdout.write(`${name} / ${geraet} … `);

    /*
     * Erst einmal abrufen, dann messen.
     *
     * Der Server rendert serverseitig und legt Ergebnisse zwischen. Der
     * allererste Abruf einer Seite ist deshalb langsamer als jeder
     * folgende – gemessen wäre das ein Server, der aufwacht, und nicht
     * der, den eine Besucherin antrifft.
     */
    await fetch(BASIS + pfad).then((a) => a.arrayBuffer());

    const bericht = await lauf(BASIS + pfad, zusatz);
    lighthouseVersion ??= bericht.lighthouseVersion;

    /* Ein `runtimeError` heißt: Die Seite kam nicht zustande. Die Punkte
       darunter sind dann Zufallszahlen und dürfen nicht in die JSON. */
    if (bericht.runtimeError) {
      throw new Error(`${pfad} (${geraet}): ${bericht.runtimeError.message}`);
    }

    const kategorien = {};
    for (const [schluessel, id] of KATEGORIEN) {
      kategorien[schluessel] = Math.round((bericht.categories[id]?.score ?? 0) * 100);
    }

    const metriken = {};
    for (const [schluessel, id] of METRIKEN) {
      const a = bericht.audits[id];
      metriken[schluessel] = {
        wert: a?.numericValue ?? null,
        anzeige: a?.displayValue ?? null,
      };
    }

    const schirmbild = await schirmbildSpeichern(
      bericht,
      path.join(SCHIRM, `${name}-${geraet}.jpg`),
    );

    /* Jede nicht bestandene Prüfung mit Namen festhalten – nicht nur die
       Punktzahl. Eine 94 sagt nicht, was fehlt; „button-name" sagt es. */
    const beanstandungen = [];
    for (const [schluessel, id] of KATEGORIEN) {
      for (const verweis of bericht.categories[id].auditRefs) {
        const p = bericht.audits[verweis.id];
        if (p?.score === null || p?.score === undefined || p.score >= 1) continue;
        /* Kennzahlen selbst sind keine Beanstandung – ein LCP von 3,8 s
           steht schon in `metriken` und wäre hier nur Doppelung. */
        if (p.scoreDisplayMode === 'numeric' && METRIKEN.some(([, m]) => m === verweis.id)) continue;

        beanstandungen.push({
          pruefung: verweis.id,
          bereich: schluessel,
          titel: p.title,
          gewicht: verweis.weight ?? 0,
          betroffen: p.details?.items?.length ?? null,
          hinweis: p.displayValue || null,
        });

        if (schluessel !== 'leistung') continue;
        const spart = einsparung(p);
        const vorhanden = chancen.get(verweis.id) ?? {
          pruefung: verweis.id,
          titel: p.title,
          msMax: 0,
          bytesMax: 0,
          clsMax: 0,
          wo: [],
        };
        /* Über die Läufe hinweg das Maximum, nicht die Summe: Dieselben
           Bilder auf fünf Seiten sind einmal zu groß, nicht fünfmal. */
        vorhanden.msMax = Math.max(vorhanden.msMax, spart.ms);
        vorhanden.bytesMax = Math.max(vorhanden.bytesMax, spart.bytes);
        vorhanden.clsMax = Math.max(vorhanden.clsMax, spart.cls);
        vorhanden.wo.push(`${name}/${geraet}${p.displayValue ? ` (${p.displayValue})` : ''}`);
        chancen.set(verweis.id, vorhanden);
      }
    }

    laeufe.push({
      pfad,
      name,
      geraet,
      kategorien,
      metriken,
      schirmbild,
      beanstandungen,
    });

    console.log(
      `L ${kategorien.leistung} · B ${kategorien.barrierefreiheit} · ` +
        `P ${kategorien.bestPractices} · S ${kategorien.seo}` +
        `   (LCP ${metriken.lcp.anzeige ?? '–'}, CLS ${metriken.cls.anzeige ?? '–'})`,
    );
  }
}

/*
 * Sortiert wird nacheinander nach Zeit, Bytes und Sprungmaß – nicht nach
 * einer zusammengerechneten Punktzahl.
 *
 * Es wäre leicht, aus 900 ms, 539 KB und 0,371 CLS eine einzige Zahl zu
 * machen, und es wäre eine erfundene. Die drei Einheiten sind nicht
 * verrechenbar; eine Rangfolge mit Kettenkriterien ist ehrlicher als ein
 * Index, dessen Gewichte niemand begründen kann.
 */
const chancenListe = [...chancen.values()]
  .sort((a, z) => z.msMax - a.msMax || z.bytesMax - a.bytesMax || z.clsMax - a.clsMax)
  .slice(0, 10);

await writeFile(
  ZIEL,
  JSON.stringify(
    {
      erhobenAm: new Date().toISOString(),
      lighthouseVersion,
      basis: BASIS,
      /* Damit später nachvollziehbar bleibt, unter welcher Bedingung die
         Zahlen entstanden sind – siehe Kopfkommentar. */
      hinweis:
        'Gemessen gegen server/index.mjs mit OEFFENTLICHE_HOSTS=127.0.0.1. ' +
        'Ohne diese Variable setzt der Server die Vorschau-Sperre ' +
        '(X-Robots-Tag: noindex) und Lighthouse zieht SEO auf 69 – das wäre ' +
        'die Vorschau-Adresse, nicht die Website. Es wird nichts ' +
        'abgeschaltet: derselbe Code, anderer Host.',
      laeufe,
      chancen: chancenListe,
    },
    null,
    1,
  ),
);

console.log(`\n→ ${path.relative(WURZEL, ZIEL)}`);
console.log(`→ ${path.relative(WURZEL, SCHIRM)}/  (${laeufe.length} Schirmbilder)`);

/* ── Was nicht stimmt, laut sagen ────────────────────────────────────── */

const alleBeanstandungen = new Map();
for (const l of laeufe) {
  for (const b of l.beanstandungen) {
    const vorhanden = alleBeanstandungen.get(b.pruefung) ?? { ...b, wo: [] };
    vorhanden.wo.push(`${l.name}/${l.geraet}`);
    alleBeanstandungen.set(b.pruefung, vorhanden);
  }
}

if (alleBeanstandungen.size > 0) {
  console.log('\n[lighthouse] Beanstandungen:');
  for (const b of [...alleBeanstandungen.values()].sort((a, z) => z.gewicht - a.gewicht)) {
    console.log(
      `    [${b.bereich}] ${b.pruefung} – ${b.titel}` +
        (b.hinweis ? ` · ${b.hinweis}` : '') +
        `\n        ${b.wo.join(', ')}`,
    );
  }
}

/*
 * Barrierefreiheit und SEO müssen 100 sein.
 *
 * Nicht weil eine runde Zahl schön aussieht, sondern weil beide Kategorien
 * aus Prüfungen bestehen, die entweder erfüllt sind oder nicht – anders als
 * die Leistung, die von Netz, CPU und Tagesform abhängt. Ein fehlender
 * Knopfname ist kein Meßrauschen, und wer ihn stehen läßt, schließt
 * jemanden aus. Deshalb hier ein Abbruch und keine Fußnote.
 */
const durchgefallen = laeufe.filter(
  (l) => l.kategorien.barrierefreiheit < 100 || l.kategorien.seo < 100,
);

if (durchgefallen.length > 0) {
  console.error(`\n[lighthouse] ABBRUCH: ${durchgefallen.length} Lauf/Läufe unter 100:`);
  for (const l of durchgefallen) {
    console.error(
      `    ${l.name}/${l.geraet}: Barrierefreiheit ${l.kategorien.barrierefreiheit}, ` +
        `SEO ${l.kategorien.seo}`,
    );
  }
  console.error(
    '\n             Die Zahlen stehen trotzdem in der JSON – gemessen ist\n' +
      '             gemessen. Aber sie gehören behoben, nicht weggeschrieben.',
  );
  process.exit(1);
}

console.log('\n[lighthouse] Barrierefreiheit und SEO auf 100, alle Läufe.');
