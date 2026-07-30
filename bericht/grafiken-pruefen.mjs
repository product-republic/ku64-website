/**
 * Selbstprüfung der Berichtsgrafiken.
 *
 * ── Warum es das gibt ───────────────────────────────────────────────────
 *
 * `bericht/grafiken.mjs` rechnet Textbreiten, ohne eine Schrift zu kennen
 * (im Node-Prozess gibt es keine Schriftmetrik). Alles, was daraus folgt –
 * passt die Zahl an das Balkenende, passt „Barrierefreiheit" unter den
 * Ring, bleibt die Grafik in ihrer viewBox – ist eine Schätzung, bis ein
 * Browser sie nachgemessen hat. Ein SVG-Wurzelelement schneidet ab, was
 * überhängt; eine um zwei Einheiten zu breite Zahl heißt „45 k" statt
 * „45 kB", und im PDF fällt das keinem mehr auf.
 *
 * Geprüft wird deshalb da, wo die Grafiken landen: im Browser, in beiden
 * Farbmodi, auf 390 px und auf 1280 px, mit derselben Schrift und denselben
 * Farbwerten wie der Bericht.
 *
 * ── Was geprüft wird ────────────────────────────────────────────────────
 *
 *  1. Bauart (ohne Browser): role="img", nicht leerer <title>, viewBox,
 *     width="100%" – und kein fester Farbwert. Ein Hex-Wert im SVG wäre im
 *     dunklen Modus unsichtbar, und genau das fällt niemandem auf, der ihn
 *     nicht hat.
 *  2. Kein seitlicher Überlauf bei 390 px – weder das Dokument noch eine
 *     einzelne Grafik über ihre Spalte hinaus.
 *  3. Kein Text ragt aus seiner viewBox. Gemessen mit `getBBox`, also am
 *     wirklich gesetzten Kasten, nicht an der Schätzung.
 *  4. Schriftgrößen in einem lesbaren Band (10 bis 42 px) – auf dem Telefon
 *     wie auf dem Schirm. Das ist die Probe auf die Obergrenze der Breite;
 *     ohne sie skaliert die Schrift mit und ist unten zu klein oder oben zu
 *     groß.
 *  5. Kontrast jeder Schrift gegen ihren wirklichen Untergrund, hell und
 *     dunkel, nach WCAG 1.4.3 (4,5:1, ab 24 px bzw. 18,66 px fett 3:1) –
 *     dieselbe Rechnung wie in `scripts/kontrast-pruefen.mjs`. Zusätzlich
 *     3:1 für die Balkenflächen selbst (WCAG 1.4.11).
 *  6. Ziffern in tabellarischer Breite – sonst stehen die Zahlen zweier
 *     Balken nicht untereinander und lassen sich nicht vergleichen.
 *
 * Gemessen wird auf zwei Untergründen: --grund (die Seite) und --flaeche
 * (eine Karte). Beides kommt im Bericht vor, und ein Kontrast, der auf dem
 * einen stimmt, kann auf dem anderen fehlen.
 *
 * ── Womit gerechnet wird ────────────────────────────────────────────────
 *
 * Mit echten Zahlen aus `analyse/vergleich/erhebung.json` und
 * `analyse/vergleich/lighthouse.json`. Erfundene Werte prüfen die
 * Darstellung erfundener Werte – die Größenordnungen dieses Berichts (224 kB
 * gegen 45 kB, 660 gegen 0, 170.785 gegen 20.650 Wörter) sind gerade das,
 * woran eine Grafik scheitert.
 *
 * Ein Abschnitt fällt aus der Reihe: die Prüffälle für die Ringschwellen.
 * Die neue Website hat keine Lighthouse-Kategorie unter 50, also gibt es zu
 * --schlecht keinen echten Wert. Damit die Schwelle trotzdem gezeichnet und
 * geprüft ist, stehen dort erfundene Punkte – und in der Probe-HTML steht
 * dabei, dass sie erfunden sind.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   node bericht/grafiken-pruefen.mjs
 *
 * Ergebnis: bericht/grafiken-probe.html (auch zum Ansehen gedacht) und ein
 * Rückgabewert ungleich 0, wenn etwas nicht stimmt.
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

import {
  paarBalken,
  bereichsBalken,
  punkteRing,
  ringReihe,
  stapelBalken,
  kennzahl,
  kennzahlReihe,
  grafikStil,
} from './grafiken.mjs';

const WURZEL = path.resolve(import.meta.dirname, '..');
const lese = async (p) => JSON.parse(await readFile(path.join(WURZEL, p), 'utf8'));

/* ── Zahlen aus der Erhebung ─────────────────────────────────────────── */

const erhebung = await lese('analyse/vergleich/erhebung.json');
const lighthouse = await lese('analyse/vergleich/lighthouse.json');

const alt = erhebung.alt.filter((s) => s.status === 200);
const neu = erhebung.neu.filter((s) => s.status === 200);

const median = (werte) => {
  const s = [...werte].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const mittel = (werte) => werte.reduce((a, b) => a + b, 0) / werte.length;
const summe = (werte) => werte.reduce((a, b) => a + b, 0);
const rund1 = (v) => Math.round(v * 10) / 10;

const kennwerte = (menge) => ({
  htmlKB: Math.round(median(menge.map((s) => s.bytes)) / 1024),
  skripte: rund1(mittel(menge.map((s) => s.skripte))),
  stile: rund1(mittel(menge.map((s) => s.stile))),
  fremd: summe(menge.map((s) => s.skripteFremd + s.stileFremd)),
  spruenge: summe(menge.map((s) => s.spruenge)),
  hreflang: rund1(mittel(menge.map((s) => s.hreflang))),
  schema: rund1(mittel(menge.map((s) => s.schema))),
});

const A = kennwerte(alt);
const N = kennwerte(neu);

/*
 * Wörter je Bereich.
 *
 * Nicht nach oberstem Pfadabschnitt gruppiert, sondern nach Thema – die
 * neue Website hängt Behandlungen und Team unter die Standorte, dieselben
 * Inhalte liegen also unter anderen Pfaden. Wer stumpf den ersten Abschnitt
 * vergleicht, meldet für `/team/` einen Verlust von 100 Prozent, obwohl die
 * Profile nur umgezogen sind. Das wäre eine falsche Zahl in einer Grafik,
 * und eine falsche Zahl in einer Grafik glaubt man länger als eine falsche
 * Zahl in einer Tabelle.
 *
 * Die Sprachfassungen bleiben ganz draußen: `erheben.mjs` nimmt für die
 * neue Website die Sitemap, und EN/FR tragen `noindex`, stehen also nicht
 * darin. `/en/` hätte hier „110.947 gegen 0" ergeben – und das ist nicht
 * gemessen, sondern nicht erhoben. Zweierlei, das man nicht in einen
 * Balken legt.
 */
const BEREICHE = [
  ['Behandlungen', (p) => p.startsWith('/leistungen/'), (p) => p.includes('/leistungen/')],
  ['Zahnbeschwerden', (p) => p.startsWith('/zahnbeschwerden/'), (p) => p.includes('/zahnbeschwerden/')],
  ['Team und Profile', (p) => p.startsWith('/team/'), (p) => p.includes('/team/')],
  ['Blog', (p) => p.startsWith('/blog/'), (p) => p.includes('/blog/')],
  [
    'Standortseiten',
    (p) => /^\/(potsdam|berlinmitte|berlin-charlottenburg|wilmersdorf)\/$/.test(p),
    (p) => /^\/(potsdam|berlinmitte|berlin-charlottenburg|wilmersdorf)\/$/.test(p),
  ],
  ['Über uns', (p) => p.startsWith('/ueber-uns/'), (p) => p.startsWith('/ueber-uns/')],
];

const woerter = (menge, passt) =>
  summe(menge.filter((s) => passt(s.pfad)).map((s) => s.woerter));

const bereiche = BEREICHE.map(([label, fAlt, fNeu]) => ({
  label,
  alt: woerter(alt, fAlt),
  neu: woerter(neu, fNeu),
}));

/* Lighthouse: die Startseite mobil ist der harte Fall (gedrosseltes Netz,
   gedrosselte CPU) und der einzige, der etwas beweist. */
const lauf = (name, geraet) =>
  lighthouse.laeufe.find((l) => l.name === name && l.geraet === geraet);

const ringeAus = (l) => [
  { wert: l.kategorien.leistung, beschriftung: 'Leistung' },
  { wert: l.kategorien.barrierefreiheit, beschriftung: 'Barrierefreiheit' },
  { wert: l.kategorien.bestPractices, beschriftung: 'Best Practices' },
  { wert: l.kategorien.seo, beschriftung: 'SEO' },
];

/* Adressbestand: die vier Zahlen aus STAND-UND-VERGLEICH.md, Abschnitt 4.1.
   Sie stehen nicht in der Erhebung – die vergleicht Seiten, nicht Adressen. */
const ADRESSEN = [
  { label: 'unter derselben Adresse vorhanden', wert: 85, farbe: 'gut' },
  { label: 'über eine Weiterleitung erreichbar', wert: 466, farbe: 'tinte-weich' },
  { label: 'bewusst ohne Ziel', wert: 1, farbe: 'offen' },
  { label: 'tot', wert: 0, farbe: 'schlecht' },
];

/* ── Die Grafiken ────────────────────────────────────────────────────── */

const prozent = (a, b) => Math.round(((b - a) / a) * 100);

const grafiken = [
  [
    /* Über `kennzahlReihe` und nicht mit einem selbst geschriebenen
       `<div class="grafik-reihe">`: Genau so steht es im Bericht. Eine Probe,
       die das Umschließende anders baut als das Dokument, prüft eine
       Anordnung, die niemand ausliefert. */
    'kennzahlReihe – Kurzfassung, sechs Kacheln (bricht auf dem Telefon um)',
    kennzahlReihe({
      titel: 'Der Umbau in sechs Zahlen',
      hinweis: 'Alle Werte aus analyse/vergleich/erhebung.json, Median je Seite.',
      zahlen: [
        { wert: prozent(A.htmlKB, N.htmlKB), einheit: '%', label: 'HTML je Seite', richtung: 'runter' },
        { wert: prozent(A.skripte, N.skripte), einheit: '%', label: 'Skripte je Seite', richtung: 'runter' },
        { wert: N.fremd, label: 'Anfragen an fremde Server', richtung: 'keine', wertung: 'gut' },
        { wert: 0, label: 'tote Adressen aus dem Altbestand', richtung: 'keine', wertung: 'gut' },
        { wert: prozent(A.hreflang, N.hreflang), einheit: '%', label: 'hreflang je Seite', richtung: 'rauf' },
        { wert: prozent(A.schema, N.schema), einheit: '%', label: 'JSON-LD-Blöcke je Seite', richtung: 'runter', wertung: 'offen' },
      ],
    }),
  ],
  [
    /* Zeichenketten statt Zahlen, weil im Bericht „2,7 s" steht: `kennzahl`
       gibt eine Zeichenkette unverändert durch, formatiert also NICHT – und
       eine Prüfung, die nur Zahlen einspeist, sieht nie, ob das stimmt. */
    'kennzahlReihe – Werte als Zeichenkette, ohne Pfeil',
    kennzahlReihe({
      titel: 'Core Web Vitals, schlechtester Wert aus zehn Läufen',
      zahlen: [
        { wert: '2,7 s', label: 'LCP (größtes Element)', richtung: 'keine', wertung: 'offen' },
        { wert: '0,001', label: 'CLS (Layoutsprünge)', richtung: 'keine', wertung: 'gut' },
        { wert: '0 ms', label: 'TBT (blockierte Zeit)', richtung: 'keine', wertung: 'gut' },
      ],
    }),
  ],
  [
    'kennzahl – einzeln, ohne Reihe',
    kennzahl({ wert: 0, label: 'tote Adressen aus dem Altbestand', richtung: 'keine', wertung: 'gut' }),
  ],
  [
    'paarBalken – gemischte Einheiten, Maßstab je Zeile',
    paarBalken({
      titel: 'Ladeverhalten je Seite',
      besserIst: 'klein',
      hinweis: 'Maßstab je Zeile, weil die Einheiten verschieden sind. Kleinstwerte und 0 sind als Stummel gezeichnet – es gilt die Zahl.',
      zeilen: [
        { label: 'HTML je Seite (Median)', alt: A.htmlKB, neu: N.htmlKB, einheit: 'kB' },
        { label: 'Skripte je Seite', alt: A.skripte, neu: N.skripte },
        { label: 'Stylesheets je Seite', alt: A.stile, neu: N.stile },
        { label: 'Anfragen an fremde Server (gesamt)', alt: A.fremd, neu: N.fremd },
      ],
    }),
  ],
  [
    'paarBalken – gemeinsamer Maßstab, alt ist einmal besser',
    paarBalken({
      titel: 'Auszeichnung je Seite',
      besserIst: 'gross',
      zeilen: [
        { label: 'hreflang je Seite', alt: A.hreflang, neu: N.hreflang },
        { label: 'JSON-LD-Blöcke je Seite', alt: A.schema, neu: N.schema },
      ],
    }),
  ],
  [
    'paarBalken – Größenordnungen und die Null',
    paarBalken({
      titel: 'Was auf null gegangen ist',
      besserIst: 'klein',
      zeilen: [
        { label: 'Anfragen an fremde Server (gesamt)', alt: A.fremd, neu: N.fremd },
        { label: 'Ebenensprünge in Überschriften (gesamt)', alt: A.spruenge, neu: N.spruenge },
      ],
    }),
  ],
  [
    'ringReihe – Startseite mobil (gedrosselt)',
    ringReihe({
      titel: 'Startseite, mobil, gedrosselt',
      ringe: ringeAus(lauf('startseite', 'mobil')),
      hinweis: `Lighthouse ${lighthouse.lighthouseVersion}, gemessen gegen den eigenen Server.`,
    }),
  ],
  [
    'ringReihe – Teamseite mobil, der schwächste Lauf',
    ringReihe({ titel: 'Teamübersicht, mobil, gedrosselt', ringe: ringeAus(lauf('team', 'mobil')) }),
  ],
  [
    'punkteRing – einzeln, in einer Reihe',
    `<div class="grafik-reihe">
      ${lighthouse.laeufe
        .filter((l) => l.geraet === 'mobil')
        .map((l) => punkteRing({ wert: l.kategorien.leistung, beschriftung: `${l.name}, Leistung` }))
        .join('\n')}
    </div>`,
  ],
  [
    'punkteRing – Prüffälle für die Schwellen (erfundene Werte)',
    `<div class="grafik-reihe">
      ${[0, 3, 49, 50, 89, 90, 100]
        .map((w) => punkteRing({ wert: w, beschriftung: `Prüffall ${w}` }))
        .join('\n')}
    </div>`,
  ],
  [
    'stapelBalken – 552 Altadressen',
    stapelBalken({
      titel: '552 Adressen des Altbestands',
      teile: ADRESSEN,
      hinweis: 'Der Abschnitt „bewusst ohne Ziel" ist eine Adresse von 552 und auf Mindestbreite gezogen, damit er sichtbar bleibt. Anzahl und Anteil stehen rechts.',
    }),
  ],
  [
    'bereichsBalken – Wörter je Bereich, lineare Achse',
    bereichsBalken({
      titel: 'Wörter je Bereich, alt gegen neu',
      zeilen: bereiche,
      hinweis: 'Lineare Achse, absteigend – die Begründung steht im Kopfkommentar von grafiken.mjs. Nach Thema gruppiert, nicht nach Pfad; Sprachfassungen sind nicht erhoben und bleiben draußen.',
    }),
  ],
];

/* ── Probe-HTML ──────────────────────────────────────────────────────── */

/* Dieselbe Schrift wie im Bericht, eingebettet – mit einer anderen Schrift
   gemessen sind die Textbreiten eine andere Messung. */
const schrift = `data:font/woff2;base64,${(
  await readFile(
    path.join(WURZEL, 'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'),
  )
).toString('base64')}`;

/* Die Farbwerte des Berichts, unverändert aus bericht/vergleich-bauen.mjs.
   Eine Prüfung gegen andere Farben prüft andere Farben. */
const TOKENS = `
  :root {
    --grund: #fbfaf7; --flaeche: #ffffff;
    --tinte: #1d1d1b; --tinte-weich: #4a4a46; --tinte-leise: #6f6f67;
    --linie: #e6e4de; --akzent: #b71e3f; --gelb: #ffcc00;
    --gut: #1f7a52; --schlecht: #b71e3f; --offen: #9a6b12;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --grund: #141412; --flaeche: #1b1b18;
      --tinte: #f2f1ee; --tinte-weich: #c0bfb8; --tinte-leise: #9b9a91;
      --linie: #2b2b28; --akzent: #e0788f; --gelb: #ffcc00;
      --gut: #3fa87a; --schlecht: #e0788f; --offen: #d3a441;
    }
  }`;

const abschnitte = grafiken
  .map(
    ([name, svg]) =>
      `<section><h2>${name}</h2>${svg}</section>\n` +
      `<section class="karte"><h2>${name} – auf --flaeche</h2>${svg}</section>`,
  )
  .join('\n');

const probe = `<!doctype html>
<html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Probe: Berichtsgrafiken</title>
<style>
  @font-face {
    font-family: 'Inter Bericht';
    src: url('${schrift}') format('woff2-variations');
    font-weight: 100 900;
    font-display: block;
  }
${TOKENS}
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--grund);
    color: var(--tinte);
    font-family: 'Inter Bericht', system-ui, sans-serif;
    font-size: 17px;
    line-height: 1.65;
    font-variant-numeric: tabular-nums;
  }
  /* Dieselbe Spaltenbreite wie im Bericht: 1180 außen, 1,25rem Rand. */
  .seite { max-width: 1180px; margin-inline: auto; padding: 2rem 1.25rem 5rem; }
  h1 { font-size: 1.6rem; margin: 0 0 0.4rem; }
  h2 {
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--tinte-leise);
    margin: 2.6rem 0 0.6rem;
  }
  .karte {
    background: var(--flaeche);
    border: 1px solid var(--linie);
    border-radius: 10px;
    padding: 1rem 1.1rem 1.2rem;
    margin-top: 1rem;
  }
  .karte h2 { margin-top: 0; }
  p.hinweis { color: var(--tinte-leise); font-size: 0.9rem; max-width: 60ch; }
${grafikStil()}
</style></head>
<body><div class="seite">
<h1>Probe: Berichtsgrafiken</h1>
<p class="hinweis">Erzeugt von <code>bericht/grafiken-pruefen.mjs</code> aus
<code>analyse/vergleich/erhebung.json</code> und
<code>analyse/vergleich/lighthouse.json</code>. Jede Grafik steht zweimal: auf der
Seitenfläche und auf einer Karte. Der Abschnitt „Prüffälle" trägt erfundene
Punktwerte – die echten Läufe liegen alle über 50, und die untere Schwelle soll
trotzdem geprüft sein.</p>
${abschnitte}
</div></body></html>
`;

const probeDatei = path.join(import.meta.dirname, 'grafiken-probe.html');
await writeFile(probeDatei, probe);

/* ── 1. Bauart, ohne Browser ─────────────────────────────────────────── */

const befunde = [];
const melden = (pruefung, text) => befunde.push({ pruefung, text });

let svgZahl = 0;
for (const [name, markup] of grafiken) {
  const einzeln = markup.match(/<svg[\s\S]*?<\/svg>/g) ?? [];
  if (einzeln.length === 0) melden('bauart', `${name}: kein SVG erzeugt`);
  for (const svg of einzeln) {
    svgZahl++;
    const kopf = svg.slice(0, svg.indexOf('>') + 1);
    if (!/role="img"/.test(kopf)) melden('bauart', `${name}: role="img" fehlt`);
    if (!/viewBox="0 0 [\d.]+ [\d.]+"/.test(kopf)) melden('bauart', `${name}: viewBox fehlt`);
    if (!/width="100%"/.test(kopf)) melden('bauart', `${name}: width="100%" fehlt`);
    const titel = /<title[^>]*>([\s\S]*?)<\/title>/.exec(svg);
    if (!titel || !titel[1].trim()) melden('bauart', `${name}: <title> fehlt oder ist leer`);
    /* Ein fester Farbwert wäre im dunklen Modus unsichtbar. */
    const hex = svg.match(/#[0-9a-fA-F]{3,8}\b/g);
    if (hex) melden('farben', `${name}: fester Farbwert ${[...new Set(hex)].join(', ')}`);
    /* `fill="var(--x)"` sieht richtig aus und wird vom Browser verworfen. */
    const attribut = svg.match(/\s(?:fill|stroke)="var\(/g);
    if (attribut) melden('farben', `${name}: var() im Präsentationsattribut statt in style`);
    for (const nutzung of svg.match(/(?:fill|stroke):\s*([^;"]+)/g) ?? []) {
      const wert = nutzung.split(':')[1].trim();
      if (wert !== 'none' && !/^var\(--[a-z-]+\)$/.test(wert)) {
        melden('farben', `${name}: Farbe „${wert}" kommt nicht aus einer CSS-Variablen`);
      }
    }
  }
}

/* ── 2.–6. im Browser ────────────────────────────────────────────────── */

const MESSEN = () => {
  /* Farben über die Leinwand einlesen statt über einen eigenen Parser –
     dieselbe Begründung wie in scripts/kontrast-pruefen.mjs: Der Browser
     liefert auch oklab() und color-mix(), ein Parser veraltet. */
  const stift = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  const farbe = (s) => {
    stift.clearRect(0, 0, 1, 1);
    stift.fillStyle = '#000';
    stift.fillStyle = s;
    stift.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = stift.getImageData(0, 0, 1, 1).data;
    return { r, g, b, a: a / 255 };
  };
  const leuchtdichte = ({ r, g, b }) => {
    const k = [r, g, b].map((v) => {
      const x = v / 255;
      return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * k[0] + 0.7152 * k[1] + 0.0722 * k[2];
  };
  const verhaeltnis = (a, b) => {
    const [x, y] = [leuchtdichte(a), leuchtdichte(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  };
  /** Der Untergrund, auf dem dieses Element wirklich liegt. */
  const untergrund = (el) => {
    for (let k = el; k; k = k.parentElement) {
      const f = farbe(getComputedStyle(k).backgroundColor);
      if (f.a > 0.99) return f;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };

  const funde = [];
  const spanne = { min: Infinity, max: 0 };
  const spalte = document.querySelector('.seite').getBoundingClientRect();

  for (const svg of document.querySelectorAll('svg.grafik')) {
    const name = svg.querySelector('title')?.textContent?.slice(0, 44) ?? '(ohne Titel)';
    const kasten = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;

    /* 2. Überlauf: keine Grafik ragt über die Spalte hinaus. */
    if (kasten.right > spalte.right + 0.5 || kasten.left < spalte.left - 0.5) {
      funde.push({ pruefung: 'ueberlauf', text: `${name}: ragt aus der Spalte` });
    }
    if (kasten.width < 1) {
      funde.push({ pruefung: 'ueberlauf', text: `${name}: wird nicht gezeichnet` });
      continue;
    }

    const massstab = kasten.width / vb.width;

    for (const el of svg.querySelectorAll('text')) {
      const stil = getComputedStyle(el);
      const b = el.getBBox();

      /* 3. Nichts ragt aus der viewBox – das wäre abgeschnittene Schrift. */
      const raus = [];
      if (b.x < vb.x - 0.5) raus.push('links');
      if (b.x + b.width > vb.x + vb.width + 0.5) raus.push('rechts');
      if (b.y + b.height > vb.y + vb.height + 0.5) raus.push('unten');
      if (b.y < vb.y - 0.5) raus.push('oben');
      if (raus.length) {
        funde.push({
          pruefung: 'zuschnitt',
          text:
            `${name}: „${el.textContent.slice(0, 24)}" ragt ${raus.join(' und ')} heraus ` +
            `(${b.x.toFixed(1)}–${(b.x + b.width).toFixed(1)} in 0–${vb.width})`,
        });
      }

      /* 4. Lesbares Größenband. */
      const px = parseFloat(stil.fontSize) * massstab;
      spanne.min = Math.min(spanne.min, px);
      spanne.max = Math.max(spanne.max, px);
      if (px < 10 || px > 42) {
        funde.push({
          pruefung: 'groesse',
          text: `${name}: „${el.textContent.slice(0, 24)}" steht bei ${px.toFixed(1)} px`,
        });
      }

      /* 5. Kontrast der Schrift gegen ihren Untergrund. */
      const grund = untergrund(svg);
      const vorn = farbe(stil.fill);
      const wert = verhaeltnis(vorn, grund);
      const fett = Number(stil.fontWeight) >= 700;
      const noetig = px >= 24 || (fett && px >= 18.66) ? 3 : 4.5;
      if (wert + 0.01 < noetig) {
        funde.push({
          pruefung: 'kontrast',
          text:
            `${name}: „${el.textContent.slice(0, 24)}" ${wert.toFixed(2)}:1 ` +
            `(nötig ${noetig}:1, ${px.toFixed(1)} px, ${stil.fill})`,
        });
      }

      /* 6. Tabellarische Ziffern. */
      if (!/tabular-nums/.test(stil.fontVariantNumeric)) {
        funde.push({ pruefung: 'ziffern', text: `${name}: keine tabellarischen Ziffern` });
      }
    }

    /* 5b. Flächen, die etwas bedeuten, brauchen 3:1 (WCAG 1.4.11). Die
       Ringspur trägt data-rolle="chrome" und ist ausgenommen – sie ist der
       Rest, nicht der Wert. */
    for (const el of svg.querySelectorAll('[data-rolle="mark"]')) {
      const stil = getComputedStyle(el);
      /* Ein Ringbogen trägt seine Farbe im Strich, ein Balken in der Fläche.
         Wer nur `fill` liest, misst bei den Ringen „none" gegen den Grund
         und meldet 1,14:1 für einen Bogen, der in Wahrheit stimmt. */
      const gemalt = stil.fill && stil.fill !== 'none' ? stil.fill : stil.stroke;
      if (!gemalt || gemalt === 'none') continue;
      const wert = verhaeltnis(farbe(gemalt), untergrund(svg));
      if (wert + 0.01 < 3) {
        funde.push({
          pruefung: 'flaeche',
          text: `${name}: Fläche ${gemalt} nur ${wert.toFixed(2)}:1 (nötig 3:1)`,
        });
      }
    }
  }

  return {
    funde,
    spanne,
    svg: document.querySelectorAll('svg.grafik').length,
    dokumentBreite: document.documentElement.scrollWidth,
    fensterBreite: document.documentElement.clientWidth,
  };
};

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PFAD || '/opt/pw-browsers/chromium',
  args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});

const BREITEN = [
  ['Telefon', 390, 844],
  ['Schreibtisch', 1280, 900],
];
const MODI = [
  ['hell', 'light'],
  ['dunkel', 'dark'],
];

const spannen = [];
let geprueft = 0;

for (const [modusName, modus] of MODI) {
  for (const [breitenName, w, h] of BREITEN) {
    const seite = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: modus });
    await seite.goto(`file://${probeDatei}`, { waitUntil: 'load' });
    await seite.evaluate(() => document.fonts.ready);

    const ergebnis = await seite.evaluate(MESSEN);
    const wo = `${breitenName}/${modusName}`;
    geprueft += ergebnis.svg;
    spannen.push({ wo, ...ergebnis.spanne, svg: ergebnis.svg });

    /* 2. Seitlicher Überlauf des Dokuments – die Probe auf 390 px. */
    if (ergebnis.dokumentBreite > ergebnis.fensterBreite + 1) {
      melden(
        'ueberlauf',
        `${wo}: Dokument ist ${ergebnis.dokumentBreite} px breit bei ${ergebnis.fensterBreite} px Fenster`,
      );
    }
    for (const f of ergebnis.funde) melden(f.pruefung, `${wo} – ${f.text}`);

    await seite.close();
  }
}

await browser.close();

/* ── Bericht ─────────────────────────────────────────────────────────── */

console.log(`\n[grafiken] ${svgZahl} SVG erzeugt, ${geprueft} Vorkommen im Browser gemessen`);
console.log(`[grafiken] Probe: ${path.relative(WURZEL, probeDatei)}`);
for (const s of spannen) {
  console.log(
    `[grafiken] ${s.wo}: Schrift ${s.min === Infinity ? '–' : s.min.toFixed(1)} bis ${s.max.toFixed(1)} px`,
  );
}

if (befunde.length === 0) {
  console.log(
    '[grafiken] In Ordnung: kein Überlauf, kein Zuschnitt, jedes SVG mit Titel,\n' +
      '           Kontrast und Ziffernbreite stimmen – hell und dunkel, 390 und 1280 px.',
  );
  process.exit(0);
}

const nachGruppe = new Map();
for (const b of befunde) {
  if (!nachGruppe.has(b.pruefung)) nachGruppe.set(b.pruefung, new Set());
  nachGruppe.get(b.pruefung).add(b.text);
}

console.error(`\n[grafiken] ${befunde.length} Befund(e):`);
for (const [gruppe, texte] of nachGruppe) {
  console.error(`\n  ${gruppe} (${texte.size}):`);
  for (const t of [...texte].slice(0, 25)) console.error(`    ${t}`);
  if (texte.size > 25) console.error(`    … und ${texte.size - 25} weitere`);
}
console.error(
  '\n[grafiken] ABBRUCH: Eine Grafik, die auf dem Telefon überläuft, ihre Zahlen\n' +
    '           abschneidet oder im dunklen Modus verschwindet, ist schlimmer als\n' +
    '           keine Grafik – sie behauptet, geprüft zu sein.',
);
process.exit(1);
