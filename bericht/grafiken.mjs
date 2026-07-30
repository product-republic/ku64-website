/**
 * Grafiken für den Bericht – reines Inline-SVG als Zeichenkette.
 *
 * ── Warum selbst gezeichnet ─────────────────────────────────────────────
 *
 * Der Bericht ist eine einzelne Datei, die verschickt und ausgedruckt wird.
 * Ein Diagrammpaket bräuchte JavaScript zur Laufzeit; im PDF liefe es nie,
 * und in der Artifact-Ansicht blockiert die CSP fremde Hosts. Was hier
 * herauskommt, steht im Quelltext der Seite und ist damit überall dasselbe:
 * im Browser, im Ausdruck, im PDF, im weitergeleiteten Anhang.
 *
 * Alle Funktionen sind rein: gleiche Eingabe, gleiche Zeichenkette. Kein
 * Zähler, kein Zufall, keine Uhrzeit – auch die IDs für die Barrierefreiheit
 * werden aus dem Inhalt gerechnet (siehe `kuerzel`), damit zwei Läufe
 * dieselbe Datei ergeben und `git diff` etwas aussagt.
 *
 * ── Farben ──────────────────────────────────────────────────────────────
 *
 * Ausschließlich über die CSS-Variablen, die die Seite schon setzt:
 * --tinte, --tinte-weich, --tinte-leise, --linie, --flaeche, --akzent,
 * --gelb, --gut, --schlecht, --offen. Kein fester Hex-Wert. Sonst stünde
 * eine Grafik im dunklen Modus schwarz auf schwarz – und es merkt niemand,
 * weil der dunkle Modus über die Systemeinstellung kommt und die meisten
 * ihn nicht haben.
 *
 * `farbe()` lässt nur diese zehn Namen durch. Wer versehentlich `#b71e3f`
 * übergibt, bekommt --tinte-leise und keinen Hex-Wert im Ergebnis. Die
 * Regel ist damit nicht Vorsatz, sondern Mechanik – und `grafiken-pruefen`
 * sucht zusätzlich nach Hex-Werten im Ergebnis.
 *
 * Wichtig: Die Farbe steht in `style="fill:var(--gut)"`, nicht in
 * `fill="var(--gut)"`. SVG-Präsentationsattribute sind keine
 * CSS-Deklarationen; `var()` wird darin nicht ersetzt und der Balken bleibt
 * schwarz. Das kostet einmal Schreibarbeit und danach nie wieder einen
 * Fehler.
 *
 * Gelb trägt auch hier keine Fläche, sondern markiert – dieselbe Regel wie
 * auf der Website (siehe `tokens.css`). Keine Standardfarbe ist --gelb.
 *
 * ── Warum die Zahlen als Text im SVG stehen – und zusätzlich in <desc> ───
 *
 * Eine Grafik, deren Aussage nur in der Balkenlänge steckt, ist für einen
 * Screenreader leer. Also stehen alle Zahlen als `<text>` im SVG: sichtbar,
 * skalierbar, kopierbar, und beim Vergrößern liest sie auch, wer den Balken
 * nicht mehr abschätzen kann.
 *
 * Das allein genügt aber NICHT. Ein Element mit `role="img"` ist für die
 * Vorlesehilfe ein Blatt – der Text darin wird nicht vorgelesen. Deshalb
 * trägt jedes SVG zusätzlich ein `<desc>`, in dem dieselben Zahlen als Satz
 * stehen. Beides ist nötig, keines ersetzt das andere:
 *
 *   <title>  worum es geht        (Kurzname, immer)
 *   <desc>   alle Zahlen als Satz (für die Vorlesehilfe)
 *   <text>   die Zahlen im Bild   (für Auge, Zoom und Ausdruck)
 *
 * ── Warum eine Obergrenze für die Breite ────────────────────────────────
 *
 * `viewBox` + `width="100%"` skaliert alles – auch die Schrift. Bei einer
 * Bezugsbreite von 400 Einheiten stünde dieselbe 13er-Beschriftung auf dem
 * Telefon (313 px in einer Karte) bei 10 px und in der breiten Spalte
 * (880 px) bei 29 px. Das eine ist klein, das andere schreit.
 *
 * Deshalb: Bezugsbreite knapp über der Telefonbreite und eine Obergrenze in
 * rem (`max-width`). Damit läuft der Maßstab nur zwischen etwa 0,78 und
 * 1,20 – dieselbe Schrift steht zwischen 10 und 19 px, auf 390 px wie auf
 * 1280 px. Eine Obergrenze ist kein fester Pixelrahmen: Schmaler geht
 * immer, die Grafik läuft nie über, und ohne die Grenze wäre „skaliert mit"
 * ein anderes Wort für „auf dem Telefon unlesbar".
 *
 * Daraus folgt die Untergrenze LESBAR für jeden Schriftgrad: 12,8
 * Einheiten, weil 0,78 × 12,8 gerade 10 px ergibt. Passt ein Text nicht,
 * wird er umbrochen und notfalls getrennt – aber nicht kleiner gesetzt.
 *
 * ── Warum ein eigenes Zeilenmodell ──────────────────────────────────────
 *
 * SVG bricht Text nicht um und kennt keine Zeilenhöhe. Und `getBBox` eines
 * `<text>` ist nicht der Tintenkasten, sondern der Kegel: 0,98 em über und
 * 0,26 em unter der Grundlinie (die Metrik von Inter). Wer nur bis zur
 * Oberkante der Ziffern rechnet, schneidet die Grafik oben an – ein SVG
 * beschneidet, was über die viewBox ragt. OBEN und UNTEN stehen deshalb
 * überall in der Höhenrechnung.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   import { paarBalken, ringReihe } from './grafiken.mjs';
 *   const svg = paarBalken({ … });   // Zeichenkette, direkt in die Seite
 *
 * Beispiele stehen über jeder Funktion. Nachgemessen im Browser mit:
 *
 *   node bericht/grafiken-pruefen.mjs
 */

/* ── Maße ─────────────────────────────────────────────────────────────────
 *
 * Alles in Einheiten der viewBox.
 */

/** Bezugsbreite: knapp über der Inhaltsbreite eines 390-px-Telefons. */
const BEZUG = 400;

/** Obergrenze der gezeichneten Breite. 30rem ≈ 480 px → Maßstab ≤ 1,2. */
const GRENZE = '30rem';

/** Kleinster Schriftgrad: 0,78 × 12,8 ≈ 10 px. Darunter wird nichts gesetzt. */
const LESBAR = 12.8;

/* Kegel der Schrift, in em: Inter hat 0,969 Aufstrich und 0,241 Abstrich.
   Aufgerundet, damit die Rechnung nie knapp danebenliegt. */
const OBEN = 0.98;
const UNTEN = 0.26;

/** Zeilenabstand als Vielfaches des Grades. */
const DURCHSCHUSS = 1.3;

const GRAD = {
  titel: 16,
  zeile: 13.5,
  wert: 13.5,
  serie: 13,
  legende: 13,
  ringzahl: 25,
  ringlabel: 13,
  fussnote: 13,
  kennzahl: 32,
};

const BALKEN = 10; // Dicke eines Balkens
const PAAR = 5; // Luft zwischen alt und neu
const RADIUS = 3; // gerundetes Balkenende, eckig an der Grundlinie
const STUMMEL = 4; // sichtbarer Rest bei 0
/* Mindestlänge für einen Wert über 0 – deutlich länger als STUMMEL, sonst
   sehen „15 von 660" und „0 von 660" gleich aus. */
const MINDEST_BALKEN = 8;
const SERIE_SPALTE = 32; // „alt" / „neu" links vor den Balken

/* ── Farben ───────────────────────────────────────────────────────────── */

/** Die Farben, die die Seite setzt. Was nicht hier steht, gibt es nicht. */
const TOKEN = new Set([
  'tinte',
  'tinte-weich',
  'tinte-leise',
  'linie',
  'flaeche',
  'akzent',
  'gelb',
  'gut',
  'schlecht',
  'offen',
]);

/**
 * Farbname → `var(--name)`. Nimmt `gut`, `--gut` und `var(--gut)` an.
 *
 * Alles andere – insbesondere ein Hex-Wert – fällt auf `ersatz` zurück.
 * Lieber eine graue Fläche als eine Grafik, die im dunklen Modus
 * verschwindet.
 */
function farbe(name, ersatz = 'tinte-leise') {
  const roh = String(name ?? '')
    .trim()
    .replace(/^var\(\s*/, '')
    .replace(/\s*\)$/, '')
    .replace(/^--/, '');
  return `var(--${TOKEN.has(roh) ? roh : ersatz})`;
}

/* ── Text und Zahlen ─────────────────────────────────────────────────── */

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const DE0 = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });
const DE1 = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/**
 * Zahl in deutscher Schreibweise. Zwischen Zahl und Einheit steht ein
 * schmales geschütztes Leerzeichen (U+202F) – damit „45 kB" zusammenbleibt
 * und nicht verklebt.
 *
 * Echtes Minus (U+2212), nicht der Bindestrich: In tabellarischer Breite
 * steht es auf Ziffernhöhe, der Bindestrich hängt tief.
 */
function zahl(v, einheit = '') {
  if (typeof v === 'string') return v;
  /* Keine Zahl ist keine Null. „NaN" in einer Grafik ist ein Programmfehler,
     der wie ein Messwert aussieht; der Gedankenstrich sagt, was zutrifft:
     hier steht nichts Erhobenes. */
  if (!Number.isFinite(v)) return '–';
  const roh = Number.isInteger(v) ? DE0.format(v) : DE1.format(v);
  const text = roh.replace('-', '−');
  return einheit ? `${text}\u202f${einheit}` : text;
}

/*
 * Textbreite abschätzen.
 *
 * Es gibt im Node-Prozess keine Schriftmetrik, und die Zahlen müssen
 * trotzdem in die viewBox passen – ein SVG-Wurzelelement beschneidet, was
 * überhängt (`overflow: hidden` in jedem Browser-Stylesheet). Also
 * geschätzt, absichtlich großzügig (Zuschlag 8 %): Wer zu breit schätzt,
 * bekommt eine zusätzliche Zeile oder einen kürzeren Balken. Wer zu schmal
 * schätzt, bekommt abgeschnittene Zahlen.
 *
 * Die Ausreißer stehen einzeln in BREIT – vor allem `m` und `w`. Ohne die
 * beiden war „Anfragen an fremde Server" um 1,4 % zu schmal gerechnet, und
 * genau das hat die Prüfung gemeldet.
 */
const BREIT = { m: 0.87, w: 0.73, M: 0.88, W: 0.9, '%': 0.9, '—': 1, '−': 0.6 };
function breite(text, grad, fett = false) {
  let em = 0;
  for (const z of String(text)) {
    if (BREIT[z] !== undefined) em += BREIT[z];
    else if (z >= '0' && z <= '9') em += 0.58; // tabular-nums: alle gleich breit
    else if (' \u202f\u2009\u00a0'.includes(z)) em += 0.27;
    else if ('.,:;\'’!|'.includes(z)) em += 0.29;
    else if ('ilItfjr()[]/\\-–'.includes(z)) em += 0.36;
    else if (z !== z.toLowerCase()) em += 0.7; // Großbuchstabe
    else em += 0.55;
  }
  return em * grad * (fett ? 1.045 : 1) * 1.08;
}

/**
 * Ein zu langes Wort trennen. Gesucht wird die Trennstelle möglichst nah an
 * der Mitte – „Barriere-freiheit" liest sich, „Barrierefre-iheit" nicht.
 *
 * Das ist keine Silbentrennung; es ist die Notlösung für den Fall, dass ein
 * einzelnes Wort breiter ist als sein Platz. Die Alternative wäre, kleiner
 * zu setzen (unlesbar) oder abzuschneiden (falsch).
 */
function trennen(wort, platz, grad) {
  const mitte = Math.round(wort.length / 2);
  const stellen = [];
  for (let d = 0; d < wort.length; d++) {
    if (mitte - d >= 3) stellen.push(mitte - d);
    if (d > 0 && mitte + d <= wort.length - 3) stellen.push(mitte + d);
  }
  for (const i of stellen) {
    const a = `${wort.slice(0, i)}-`;
    const b = wort.slice(i);
    if (breite(a, grad) <= platz && breite(b, grad) <= platz) return [a, b];
  }
  return null;
}

/**
 * Umbruch an Wortgrenzen. Ein `\n` im Text bricht ausdrücklich um – so kann
 * der Aufrufer die Trennstelle selbst bestimmen. Passt ein einzelnes Wort
 * nicht, wird es getrennt.
 */
function umbrechen(text, platz, grad, maxZeilen = 2) {
  const absaetze = String(text).split('\n');
  const zeilen = [];

  for (const absatz of absaetze) {
    for (const wort of absatz.split(/\s+/).filter(Boolean)) {
      const letzte = zeilen[zeilen.length - 1];
      if (letzte !== undefined && breite(`${letzte} ${wort}`, grad) <= platz) {
        zeilen[zeilen.length - 1] = `${letzte} ${wort}`;
        continue;
      }
      if (breite(wort, grad) <= platz) {
        zeilen.push(wort);
        continue;
      }
      const geteilt = trennen(wort, platz, grad);
      if (geteilt) zeilen.push(...geteilt);
      else zeilen.push(wort); // nichts passt – lieber überstehen als abschneiden
    }
  }

  if (zeilen.length === 0) return [''];
  if (zeilen.length <= maxZeilen) return zeilen;
  /* Mehr Zeilen als erlaubt: der Rest kommt in die letzte. Sie wird dann
     überstehen, und die Prüfung meldet es – besser als stilles Abschneiden. */
  return [...zeilen.slice(0, maxZeilen - 1), zeilen.slice(maxZeilen - 1).join(' ')];
}

/* ── SVG-Bausteine ───────────────────────────────────────────────────── */

/** Koordinaten kurz halten – zwei Nachkommastellen genügen. */
const n = (v) => String(Math.round(v * 100) / 100);

/**
 * Balken mit gerundetem Ende und eckiger Grundlinie – waagerecht, wächst
 * nach rechts. Kürzer als die Rundung: eckiger Stummel, sonst wäre die
 * Rundung breiter als der Wert.
 */
function balkenPfad(x, y, b, h, r = RADIUS) {
  const rr = Math.min(r, h / 2);
  if (b <= rr * 1.4) return `M${n(x)} ${n(y)}h${n(b)}v${n(h)}h${n(-b)}z`;
  return (
    `M${n(x)} ${n(y)}h${n(b - rr)}a${n(rr)} ${n(rr)} 0 0 1 ${n(rr)} ${n(rr)}` +
    `v${n(h - 2 * rr)}a${n(rr)} ${n(rr)} 0 0 1 ${n(-rr)} ${n(rr)}h${n(-(b - rr))}z`
  );
}

/**
 * Rechteck mit wählbarer Rundung links und rechts, in absoluten
 * Koordinaten – damit sich beim Lesen nachrechnen lässt, wo die Ecken sitzen.
 */
function eckigerPfad(x, y, b, h, rl, rr) {
  const l = Math.max(0, Math.min(rl, h / 2, b / 2));
  const r = Math.max(0, Math.min(rr, h / 2, b / 2));
  if (l < 0.2 && r < 0.2) return `M${n(x)} ${n(y)}h${n(b)}v${n(h)}h${n(-b)}z`;

  const rechts = x + b;
  const unten = y + h;
  const bogen = (rad, zx, zy) => `A${n(rad)} ${n(rad)} 0 0 1 ${n(zx)} ${n(zy)}`;

  return (
    `M${n(x + l)} ${n(y)}L${n(rechts - r)} ${n(y)}` +
    (r > 0 ? bogen(r, rechts, y + r) : '') +
    `L${n(rechts)} ${n(unten - r)}` +
    (r > 0 ? bogen(r, rechts - r, unten) : '') +
    `L${n(x + l)} ${n(unten)}` +
    (l > 0 ? bogen(l, x, unten - l) : '') +
    `L${n(x)} ${n(y + l)}` +
    (l > 0 ? bogen(l, x + l, y) : '') +
    'z'
  );
}

/**
 * Ein `<text>` auf einer Grundlinie.
 *
 * Bewusst kein `dominant-baseline`: Das rechnet jeder Renderer etwas
 * anders, und dieselbe Grafik soll im PDF stehen wie im Browser. Wer mittig
 * auf einem Balken sitzen will, rechnet die Grundlinie selbst – siehe
 * `mittigAuf`.
 */
function txt(x, grundlinie, text, { grad = GRAD.zeile, gewicht = 400, ton = 'tinte', anker = 'start' } = {}) {
  const a = anker === 'start' ? '' : ` text-anchor="${anker}"`;
  return (
    `<text x="${n(x)}" y="${n(grundlinie)}"${a} style="font-size:${n(grad)}px;font-weight:${gewicht};` +
    `fill:${farbe(ton, 'tinte')}">${esc(text)}</text>`
  );
}

/** Grundlinie für Text, der optisch in der Mitte eines Balkens sitzt. */
const mittigAuf = (y, hoehe, grad) => y + hoehe / 2 + grad * 0.35;

/**
 * Ein umbrochener Textblock. Gibt das Markup und die verbrauchte Höhe
 * zurück – gerechnet mit dem Kegel der Schrift (OBEN/UNTEN), nicht mit der
 * Ziffernhöhe.
 */
function textBlock({
  x,
  y,
  text,
  platz,
  grad = GRAD.zeile,
  gewicht = 400,
  ton = 'tinte',
  anker = 'start',
  maxZeilen = 1,
  min = LESBAR,
}) {
  const zeilen = umbrechen(text, platz, grad, maxZeilen);
  /* Erst umbrechen, dann – wenn es sein muss – bis LESBAR verkleinern.
     Nie darunter: unlesbar ist keine Lösung für „passt nicht". */
  let g = grad;
  while (g > min && zeilen.some((z) => breite(z, g, gewicht >= 650) > platz)) g -= 0.25;

  const teile = zeilen.map((z, i) =>
    txt(x, y + OBEN * g + i * g * DURCHSCHUSS, z, { grad: g, gewicht, ton, anker }),
  );
  return {
    inhalt: teile.join(''),
    hoehe: (zeilen.length - 1) * g * DURCHSCHUSS + (OBEN + UNTEN) * g,
    grad: g,
    zeilen: zeilen.length,
  };
}

/**
 * ID aus dem Inhalt (FNV-1a). Deterministisch – zwei Läufe ergeben dieselbe
 * Datei –, und verschiedene Grafiken bekommen verschiedene IDs, ohne dass
 * die Funktionen einen Zähler und damit ein Gedächtnis bräuchten.
 *
 * Zwei inhaltlich identische Grafiken auf einer Seite teilen ihre ID. Das
 * ist hier harmlos: Sie tragen denselben Titel und dieselbe Beschreibung.
 */
function kuerzel(stoff) {
  let h = 0x811c9dc5;
  const s = String(stoff);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `g${(h >>> 0).toString(36)}`;
}

/**
 * Die Hülle: role="img", Titel, Beschreibung, viewBox, Breite 100 % mit
 * Obergrenze.
 *
 * `print-color-adjust: exact` steht hier, weil Browser im Ausdruck sonst
 * Flächen aufhellen – dann ist der grüne Balken hellgrau und die Aussage
 * der Grafik weg.
 */
function huelle({ hoehe, titel, desc, inhalt, breite: maxBreite = GRENZE, bezug = BEZUG, schluessel }) {
  const id = kuerzel(schluessel ?? `${titel}|${desc}|${inhalt}`);
  const beschreibung = desc ? `<desc id="${id}-b">${esc(desc)}</desc>` : '';
  const verweisDesc = desc ? ` aria-describedby="${id}-b"` : '';
  return (
    `<svg class="grafik" role="img" viewBox="0 0 ${n(bezug)} ${n(hoehe)}" width="100%"` +
    ` aria-labelledby="${id}-t"${verweisDesc}` +
    ` style="display:block;width:100%;max-width:${maxBreite};height:auto;` +
    `font-variant-numeric:tabular-nums;print-color-adjust:exact;-webkit-print-color-adjust:exact">` +
    `<title id="${id}-t">${esc(titel)}</title>${beschreibung}${inhalt}</svg>`
  );
}

/* ── 1. Paarvergleich ─────────────────────────────────────────────────── */

/**
 * Zwei Balken je Zeile, alt über neu, Zahl am Balkenende.
 *
 * Aufbau einer Zeile:
 *
 *   HTML je Seite (Median)
 *   alt  ███████████████████████  219 kB
 *   neu  ████▌                     44 kB
 *
 * Die Zeilenbeschriftung steht ÜBER dem Paar, nicht daneben: Auf 400
 * Einheiten Bezugsbreite bliebe für eine Beschriftungsspalte, zwei Balken
 * und zwei Zahlen nichts übrig, was noch als Balken zu erkennen wäre.
 * Links vor den Balken stehen nur „alt" und „neu" – damit die Zuordnung
 * nicht an der Farbe hängt und die Grafik ohne Legendenkasten auskommt.
 *
 * `besserIst: 'klein' | 'gross'` entscheidet je Zeile, welcher Balken
 * --gut bekommt; der andere --tinte-leise. Die Farbe folgt dem besseren
 * WERT, nicht der neuen Website: Wo die alte Fassung besser war, ist der
 * alte Balken grün. Das ist der Sinn der Angabe. Bei Gleichstand ist keiner
 * grün.
 *
 * Maßstab: gemeinsam über alle Zeilen, solange alle dieselbe Einheit haben –
 * nur dann sind die Balken untereinander vergleichbar. Sobald eine Zeile
 * eine eigene Einheit trägt (kB gegen Anzahl), wird je Zeile normiert, weil
 * ein gemeinsamer Maßstab über verschiedene Einheiten nichts bedeutet. Mit
 * `achse: 'gemeinsam' | 'zeile'` zu erzwingen.
 *
 * Größenordnungen: 219 gegen 44 ist unkritisch. Wo ein Wert gegen den
 * größten verschwindet, bekommt er mindestens 6 Einheiten; die 0 bekommt
 * einen Stummel von 4 Einheiten in ihrer Farbe – sonst stünde in der Zeile
 * „660 gegen nichts", und nichts liest sich wie „nicht erhoben". Die
 * Wahrheit steht in der Zahl daneben; `hinweis` sagt, dass Kleinstwerte
 * gezeigt und nicht gemessen sind.
 *
 * Beispiel:
 *
 *   paarBalken({
 *     titel: 'Ladeverhalten je Seite',
 *     besserIst: 'klein',
 *     hinweis: 'Maßstab je Zeile, weil die Einheiten verschieden sind.',
 *     zeilen: [
 *       { label: 'HTML je Seite (Median)', alt: 219, neu: 44, einheit: 'kB' },
 *       { label: 'Anfragen an fremde Server', alt: 660, neu: 0 },
 *     ],
 *   });
 */
export function paarBalken({
  titel = '',
  einheit = '',
  zeilen = [],
  besserIst = 'klein',
  achse,
  hinweis,
} = {}) {
  const reihen = zeilen.map((z) => ({
    label: String(z.label ?? ''),
    alt: Number(z.alt) || 0,
    neu: Number(z.neu) || 0,
    einheit: z.einheit ?? einheit,
  }));
  if (reihen.length === 0) return '';

  const einheiten = new Set(reihen.map((r) => r.einheit));
  const gemeinsam = achse === 'gemeinsam' || (achse !== 'zeile' && einheiten.size === 1);

  return balkenBlock({
    titel,
    reihen,
    gemeinsam,
    hinweis,
    faerbung: (r) => {
      if (r.alt === r.neu) return ['tinte-leise', 'tinte-leise'];
      const altBesser = besserIst === 'gross' ? r.alt > r.neu : r.alt < r.neu;
      return altBesser ? ['gut', 'tinte-leise'] : ['tinte-leise', 'gut'];
    },
    desc:
      `Vergleich alt gegen neu, ${besserIst === 'gross' ? 'größer' : 'kleiner'} ist besser. ` +
      reihen
        .map((r) => `${r.label}: alt ${zahl(r.alt, r.einheit)}, neu ${zahl(r.neu, r.einheit)}`)
        .join('. ') +
      '. Grün markiert den besseren Wert.',
  });
}

/* ── 4. Bereiche mit sehr unterschiedlichen Größen ────────────────────── */

/**
 * Wortvergleich je Bereich – dieselbe Bauart wie `paarBalken`, aber ohne
 * Urteil und mit der relativen Veränderung rechts über dem Paar.
 *
 * ── Logarithmische Achse: nein. Begründung ──────────────────────────────
 *
 * Die Zahlen liegen zwischen 1.850 und 170.785 Wörtern, Faktor 92. Auf
 * einer linearen Achse ist der kleinste Bereich ein Strich. Das spricht auf
 * den ersten Blick für eine logarithmische Achse. Sie ist hier trotzdem
 * falsch:
 *
 * 1. Ein Balken wird als Länge gelesen, und Länge heißt Menge.
 *    Logarithmisch ist die Länge nicht mehr proportional zum Wert: 170.785
 *    wäre knapp doppelt so lang wie 1.850, obwohl es 92-mal so viel ist.
 *    Das ist keine andere Darstellung derselben Wahrheit, das ist eine
 *    andere Aussage.
 * 2. Der Befund dieses Kapitels IST das Missverhältnis. Eine Achse, die
 *    Größenordnungen zusammenstaucht, macht genau den Befund unsichtbar,
 *    um dessentwillen die Grafik da ist: Aus −88 % würde ein kaum
 *    sichtbarer Unterschied. Das wäre eine Beschönigung, und zwar zugunsten
 *    dessen, der den Bericht schreibt. Genau dieser Verdacht darf hier
 *    nicht entstehen.
 * 3. log(0) ist nicht definiert, und 0 kommt in diesen Daten vor (Bereiche
 *    ohne eigenen Pfad in der neuen Fassung). Eine Achse, die einen echten
 *    Wert nicht darstellen kann, ist die falsche Achse.
 *
 * Stattdessen, und ohne die Längen zu verbiegen:
 *   – lineare Achse, absteigend sortiert;
 *   – jeder Wert über 0 bekommt mindestens 6 Einheiten, die 0 einen
 *     Stummel, damit auch kleine Bereiche sichtbar bleiben;
 *   – jede Zahl steht als Text am Balken – wer den Balken nicht abschätzen
 *     kann, liest sie ab;
 *   – rechts die relative Veränderung („−88 %"). Sie ist maßstabsfrei und
 *     leistet genau das, wofür man sonst zur Log-Achse greift: das
 *     Verhältnis ablesbar machen. Nur eben als Zahl und nicht als verbogene
 *     Länge.
 *
 * Farben: --tinte-leise für alt, --akzent für neu. Bewusst NICHT --gut und
 * --schlecht: Weniger Wörter sind nicht per se schlechter (die alte Fassung
 * trug Vorlagen-Ballast) und nicht per se besser. Wo kein Urteil belegt
 * ist, trägt die Grafik keins.
 *
 * Beispiel:
 *
 *   bereichsBalken({
 *     titel: 'Wörter je Bereich, alt gegen neu',
 *     zeilen: [
 *       { label: '/leistungen/',     alt: 170785, neu: 20650 },
 *       { label: '/zahnbeschwerden/', alt: 102543, neu: 88827 },
 *       { label: '/ueber-uns/',      alt:  16176, neu: 0 },
 *     ],
 *   });
 */
export function bereichsBalken({ titel = '', zeilen = [], einheit = '', hinweis } = {}) {
  const reihen = zeilen
    .map((z) => ({
      label: String(z.label ?? ''),
      alt: Number(z.alt) || 0,
      neu: Number(z.neu) || 0,
      einheit: z.einheit ?? einheit,
    }))
    .sort((a, b) => Math.max(b.alt, b.neu) - Math.max(a.alt, a.neu));
  if (reihen.length === 0) return '';

  /** Relative Veränderung. Ohne Ausgangswert gibt es keinen Prozentsatz. */
  const delta = (r) => {
    if (r.alt === 0) return r.neu === 0 ? '' : 'neu';
    const p = Math.round(((r.neu - r.alt) / r.alt) * 100);
    if (p === 0) return '±0 %';
    return `${p > 0 ? '+' : '−'}${DE0.format(Math.abs(p))} %`;
  };

  return balkenBlock({
    titel,
    reihen,
    gemeinsam: new Set(reihen.map((r) => r.einheit)).size === 1,
    hinweis,
    faerbung: () => ['tinte-leise', 'akzent'],
    zusatz: delta,
    desc:
      `${reihen.length} Bereiche, alt gegen neu, absteigend nach Größe. ` +
      reihen
        .map((r) => {
          const d = delta(r);
          return (
            `${r.label}: alt ${zahl(r.alt, r.einheit)}, neu ${zahl(r.neu, r.einheit)}` +
            (d && d !== 'neu' ? ` (${d})` : '')
          );
        })
        .join('. ') +
      '. Lineare Achse; Kleinstwerte sind als Mindestbalken gezeichnet, es gilt die Zahl.',
  });
}

/**
 * Gemeinsamer Rumpf von `paarBalken` und `bereichsBalken`.
 *
 * `faerbung(reihe)` liefert [Farbe alt, Farbe neu], `zusatz(reihe)`
 * optional einen rechtsbündigen Text auf der Beschriftungszeile.
 */
function balkenBlock({ titel, reihen, gemeinsam, faerbung, desc, zusatz, hinweis }) {
  /* Platz rechts für die Zahlen: der breiteste Wert der ganzen Grafik.
     Damit passt jede Zahl an jedes Balkenende, auch das längste. */
  const werte = reihen.flatMap((r) => [zahl(r.alt, r.einheit), zahl(r.neu, r.einheit)]);
  const reserve = Math.max(...werte.map((w) => breite(w, GRAD.wert, true))) + 7;

  const x0 = SERIE_SPALTE + 2;
  const laenge = BEZUG - reserve - x0;
  const gesamtMax = Math.max(...reihen.map((r) => Math.max(r.alt, r.neu)));

  const teile = [];
  let y = 0;

  if (titel) {
    const kopf = textBlock({
      x: 0,
      y,
      text: titel,
      platz: BEZUG,
      grad: GRAD.titel,
      gewicht: 700,
      maxZeilen: 2,
    });
    teile.push(kopf.inhalt);
    y += kopf.hoehe + 8;
  }

  for (const r of reihen) {
    const bezugswert = gemeinsam ? gesamtMax : Math.max(r.alt, r.neu);

    /* Beschriftungszeile: Label links, Veränderung rechts. */
    const rechts = zusatz ? zusatz(r) : '';
    const platzRechts = rechts ? breite(rechts, GRAD.zeile, true) + 10 : 0;
    const kopf = textBlock({
      x: 0,
      y,
      text: r.label,
      platz: BEZUG - platzRechts,
      grad: GRAD.zeile,
      gewicht: 650,
      maxZeilen: 2,
    });
    teile.push(kopf.inhalt);
    if (rechts) {
      teile.push(
        txt(BEZUG, y + OBEN * GRAD.zeile, rechts, {
          grad: GRAD.zeile,
          gewicht: 650,
          ton: 'tinte-weich',
          anker: 'end',
        }),
      );
    }
    y += kopf.hoehe + 3;

    const [tonAlt, tonNeu] = faerbung(r);
    for (const [name, wert, ton] of [
      ['alt', r.alt, tonAlt],
      ['neu', r.neu, tonNeu],
    ]) {
      const b =
        bezugswert <= 0 || wert <= 0
          ? STUMMEL
          : Math.max(MINDEST_BALKEN, (wert / bezugswert) * laenge);

      teile.push(
        txt(SERIE_SPALTE, mittigAuf(y, BALKEN, GRAD.serie), name, {
          grad: GRAD.serie,
          ton: 'tinte-leise',
          anker: 'end',
        }),
      );
      teile.push(
        `<path data-rolle="mark" d="${balkenPfad(x0, y, b, BALKEN)}" style="fill:${farbe(ton)}"/>`,
      );
      teile.push(
        txt(x0 + b + 6, mittigAuf(y, BALKEN, GRAD.wert), zahl(wert, r.einheit), {
          grad: GRAD.wert,
          gewicht: 650,
          ton: 'tinte',
        }),
      );
      y += BALKEN + (name === 'alt' ? PAAR : 0);
    }
    /* Abstand zur nächsten Zeile – groß genug für den Abstrich der Zahl,
       die mittig auf dem letzten Balken sitzt. */
    y += 13;
  }

  y += fussnoteBlock(teile, hinweis, y);

  return huelle({ hoehe: y, titel, desc, inhalt: teile.join('') });
}

/**
 * Kleingedrucktes unter einer Grafik, umbrochen. Gibt die verbrauchte Höhe
 * zurück.
 *
 * Umbrochen und nicht verkleinert: Ein Hinweis von 160 Zeichen passt in
 * keine 400 Einheiten, und wer ihn kleiner setzt, bis er passt, landet bei
 * 8 px. Das war der erste Entwurf, und die Prüfung hat ihn gemeldet.
 */
function fussnoteBlock(teile, hinweis, y) {
  if (!hinweis) return 0;
  const block = textBlock({
    x: 0,
    y: y + 2,
    text: hinweis,
    platz: BEZUG,
    grad: GRAD.fussnote,
    ton: 'tinte-leise',
    maxZeilen: 4,
  });
  teile.push(block.inhalt);
  return block.hoehe + 2;
}

/* ── 2. Lighthouse-Ringe ─────────────────────────────────────────────── */

/**
 * Schwellen wie PageSpeed sie zieht: ab 90 gut, ab 50 offen, darunter
 * schlecht. Dieselben Grenzen wie im Werkzeug – eigene Grenzen wären eine
 * eigene Bewertung, und der Bericht zitiert hier eine fremde Messung.
 */
function ringTon(wert) {
  if (wert >= 90) return 'gut';
  if (wert >= 50) return 'offen';
  return 'schlecht';
}

const RING_URTEIL = { gut: 'gut', offen: 'verbesserungsbedürftig', schlecht: 'schlecht' };

/**
 * Einen Ring in ein Feld zeichnen: Spur in --linie, Bogen in der Farbe der
 * Schwelle, Zahl in der Mitte, Beschriftung darunter.
 *
 * Der Bogen beginnt oben (Drehung um −90°) und läuft im Uhrzeigersinn, wie
 * bei PageSpeed. `stroke-linecap` bleibt stumpf: Runde Enden verlängern den
 * Bogen optisch um die halbe Strichbreite, und bei 3 von 100 wäre das ein
 * Drittel des gezeichneten Werts.
 */
function ringFeld({ cx, cy, r, wert, beschriftung, feldBreite }) {
  const stich = Math.max(6, r * 0.28);
  const umfang = 2 * Math.PI * r;
  const punkte = Math.max(0, Math.min(100, Number(wert) || 0));
  const ton = ringTon(punkte);

  const teile = [
    `<circle data-rolle="chrome" cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" style="fill:none;` +
      `stroke:${farbe('linie')};stroke-width:${n(stich)}"/>`,
  ];

  /* Bei 0 wird kein Bogen gezeichnet – ein Bogen der Länge 0 wäre bei
     runden Enden trotzdem ein Punkt und behauptete einen Wert. Die 0 steht
     in der Mitte, das genügt. */
  if (punkte > 0) {
    teile.push(
      `<circle data-rolle="mark" cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" ` +
        `transform="rotate(-90 ${n(cx)} ${n(cy)})" style="fill:none;stroke:${farbe(ton)};` +
        `stroke-width:${n(stich)};stroke-linecap:butt;` +
        `stroke-dasharray:${n((umfang * punkte) / 100)} ${n(umfang)}"/>`,
    );
  }

  const zahlGrad = Math.min(GRAD.ringzahl, r * 0.84);
  teile.push(
    txt(cx, cy + zahlGrad * 0.35, zahl(Math.round(punkte)), {
      grad: zahlGrad,
      gewicht: 700,
      ton: 'tinte',
      anker: 'middle',
    }),
  );

  let hoehe = cy + r + stich / 2 + 3;
  if (beschriftung) {
    const block = textBlock({
      x: cx,
      y: hoehe,
      text: beschriftung,
      platz: feldBreite - 6,
      grad: GRAD.ringlabel,
      gewicht: 500,
      ton: 'tinte-weich',
      anker: 'middle',
      maxZeilen: 2,
    });
    teile.push(block.inhalt);
    hoehe += block.hoehe;
  }

  return { inhalt: teile.join(''), hoehe };
}

/**
 * Ein einzelner Lighthouse-Ring.
 *
 * Steht bewusst schmal (Obergrenze 7,5rem): Die Ringe sollen in einer Reihe
 * nebeneinander stehen können – siehe `.grafik-reihe` in `grafikStil()` –
 * und nicht einzeln eine Spalte füllen.
 *
 * Beispiel:
 *
 *   punkteRing({ wert: 92, beschriftung: 'Leistung' });
 *   // → Bogen bei 92 %, Zahl 92 in der Mitte, Farbe --gut
 */
export function punkteRing({ wert, beschriftung = '' } = {}) {
  const punkte = Math.max(0, Math.min(100, Number(wert) || 0));
  const bezug = 104;
  const stich = Math.max(6, 30 * 0.28);
  const feld = ringFeld({
    cx: bezug / 2,
    cy: 30 + stich / 2 + 1,
    r: 30,
    wert: punkte,
    beschriftung,
    feldBreite: bezug,
  });

  const name = beschriftung ? `${beschriftung}: ` : '';
  return huelle({
    bezug,
    hoehe: feld.hoehe + 2,
    breite: '7.5rem',
    titel: `${name}${zahl(Math.round(punkte))} von 100`,
    desc:
      `${name}${zahl(Math.round(punkte))} von 100 Punkten – ${RING_URTEIL[ringTon(punkte)]} ` +
      'nach den Schwellen von Lighthouse (ab 90 gut, ab 50 verbesserungsbedürftig).',
    inhalt: feld.inhalt,
  });
}

/**
 * Die vier Lighthouse-Kategorien nebeneinander – ein SVG, damit die Ringe
 * auch auf dem Telefon in einer Reihe stehen und nicht umbrechen. Sie
 * schrumpfen gemeinsam; vier Ringe in einer Reihe sind die Aussage.
 *
 * Beispiel:
 *
 *   ringReihe({
 *     titel: 'Startseite, mobil, gedrosselt',
 *     ringe: [
 *       { wert: 92,  beschriftung: 'Leistung' },
 *       { wert: 94,  beschriftung: 'Barrierefreiheit' },
 *       { wert: 100, beschriftung: 'Best Practices' },
 *       { wert: 100, beschriftung: 'SEO' },
 *     ],
 *   });
 */
export function ringReihe({ titel = '', ringe = [], hinweis } = {}) {
  const liste = ringe.map((r) => ({
    wert: Math.max(0, Math.min(100, Number(r.wert) || 0)),
    beschriftung: String(r.beschriftung ?? ''),
  }));
  if (liste.length === 0) return '';

  const feldBreite = BEZUG / liste.length;
  /* Radius so, dass zwischen den Ringen Luft bleibt – bei fünf Feldern
     werden sie kleiner, statt sich zu berühren. */
  const r = Math.min(30, feldBreite * 0.29);
  const stich = Math.max(6, r * 0.28);

  const teile = [];
  let kopfHoehe = 0;
  if (titel) {
    const kopf = textBlock({
      x: 0,
      y: 0,
      text: titel,
      platz: BEZUG,
      grad: GRAD.titel,
      gewicht: 700,
      maxZeilen: 2,
    });
    teile.push(kopf.inhalt);
    kopfHoehe = kopf.hoehe + 8;
  }

  let unten = 0;
  for (const [i, ring] of liste.entries()) {
    const feld = ringFeld({
      cx: feldBreite * (i + 0.5),
      cy: kopfHoehe + r + stich / 2,
      r,
      wert: ring.wert,
      beschriftung: ring.beschriftung,
      feldBreite,
    });
    teile.push(feld.inhalt);
    unten = Math.max(unten, feld.hoehe);
  }

  unten += fussnoteBlock(teile, hinweis, unten);

  return huelle({
    hoehe: unten + 2,
    titel: titel || 'Lighthouse-Punkte',
    desc:
      (titel ? `${titel}. ` : '') +
      liste
        .map((l) => `${l.beschriftung} ${zahl(l.wert)} von 100 (${RING_URTEIL[ringTon(l.wert)]})`)
        .join(', ') +
      '. Schwellen nach Lighthouse: ab 90 gut, ab 50 verbesserungsbedürftig.',
    inhalt: teile.join(''),
  });
}

/* ── 3. Gestapelter Balken ───────────────────────────────────────────── */

/** Ersatzfarben, wenn der Aufrufer keine nennt. Nie --gelb: kein Flächengelb. */
const STAPEL_TOENE = ['gut', 'tinte-weich', 'offen', 'schlecht', 'akzent', 'tinte-leise'];

/**
 * Ein waagerechter gestapelter Balken mit Legende.
 *
 * Die Legende trägt die Zahlen, nicht der Balken: Ein Abschnitt von 0,2 %
 * ist 0,8 Einheiten breit, da passt keine Beschriftung hinein, und
 * abgeschnittene Schrift in einem Balken ist schlimmer als keine.
 *
 * Anteile unter der Sichtbarkeitsgrenze bekommen 3 Einheiten Mindestbreite
 * (die eine Adresse ohne Ziel von 552 wäre sonst nicht da). Der Rest wird
 * anteilig gestaucht, damit die Summe stimmt. Das verzerrt genau diesen
 * einen kleinen Abschnitt – die Legende nennt Anzahl und Anteil exakt, und
 * `hinweis` sagt es.
 *
 * Ein Teil mit Wert 0 bekommt KEINEN Abschnitt, steht aber in der Legende.
 * „0 tote Adressen" ist die Aussage der Grafik; als Fläche wäre sie eine
 * Behauptung, als Zeile mit einer Null ist sie ein Befund.
 *
 * Zwischen den Abschnitten liegt eine Fuge von 2 Einheiten in der Farbe des
 * Untergrunds – keine Umrandung. Eine Linie um eine Fläche ist Tinte, die
 * keine Daten trägt.
 *
 * Beispiel:
 *
 *   stapelBalken({
 *     titel: '552 Adressen des Altbestands',
 *     teile: [
 *       { label: 'unter derselben Adresse',   wert: 85,  farbe: 'gut' },
 *       { label: 'über eine Weiterleitung',   wert: 466, farbe: 'tinte-weich' },
 *       { label: 'bewusst ohne Ziel',         wert: 1,   farbe: 'offen' },
 *       { label: 'tot',                       wert: 0,   farbe: 'schlecht' },
 *     ],
 *   });
 */
export function stapelBalken({ titel = '', teile: eingabe = [], einheit = '', hinweis } = {}) {
  const posten = eingabe.map((t, i) => ({
    label: String(t.label ?? ''),
    wert: Math.max(0, Number(t.wert) || 0),
    ton: t.farbe ? farbe(t.farbe) : farbe(STAPEL_TOENE[i % STAPEL_TOENE.length]),
  }));
  if (posten.length === 0) return '';

  const gesamt = posten.reduce((s, p) => s + p.wert, 0);
  const sichtbar = posten.filter((p) => p.wert > 0);

  const FUGE = 2;
  const MINDEST = 3;
  const HOEHE = 22;

  /*
   * Breiten verteilen: erst maßstäblich, dann Kleinstwerte auf die
   * Mindestbreite heben und die Differenz von den großen Abschnitten
   * abziehen – die verlieren dabei Bruchteile eines Prozents.
   */
  const platz = BEZUG - FUGE * Math.max(0, sichtbar.length - 1);
  let breiten = sichtbar.map((p) =>
    gesamt > 0 ? (p.wert / gesamt) * platz : platz / sichtbar.length,
  );
  const zuKlein = breiten.map((b) => b < MINDEST);
  const schuld = breiten.reduce((s, b, i) => s + (zuKlein[i] ? MINDEST - b : 0), 0);
  if (schuld > 0) {
    const grosse = breiten.reduce((s, b, i) => s + (zuKlein[i] ? 0 : b), 0);
    breiten = breiten.map((b, i) => (zuKlein[i] ? MINDEST : b - (b / grosse) * schuld));
  }

  const teile = [];
  let y = 0;

  if (titel) {
    const kopf = textBlock({
      x: 0,
      y,
      text: titel,
      platz: BEZUG,
      grad: GRAD.titel,
      gewicht: 700,
      maxZeilen: 2,
    });
    teile.push(kopf.inhalt);
    y += kopf.hoehe + 6;
  }

  let x = 0;
  for (const [i, p] of sichtbar.entries()) {
    const b = breiten[i];
    /* Nur die Außenkanten des Stapels sind gerundet – innen sitzen die
       Fugen, und ein gerundeter Innenrand liest sich als eigener Balken. */
    const d = eckigerPfad(
      x,
      y,
      b,
      HOEHE,
      i === 0 ? RADIUS : 0,
      i === sichtbar.length - 1 ? RADIUS : 0,
    );
    teile.push(`<path data-rolle="mark" d="${d}" style="fill:${p.ton}"/>`);
    x += b + FUGE;
  }
  y += HOEHE + 12;

  /* Legende: Farbfeld, Beschriftung, dann zwei rechtsbündige Zahlenspalten.
     Anzahl und Anteil stehen untereinander, sonst lassen sie sich nicht
     vergleichen – dieselbe Regel wie für die Tabellen des Berichts. */
  const anteilSpalte = BEZUG;
  const zahlSpalte = BEZUG - 58;
  for (const p of posten) {
    const anteil = gesamt > 0 ? (p.wert / gesamt) * 100 : 0;
    const anteilText = `${DE1.format(anteil)} %`;
    const wertText = zahl(p.wert, einheit);
    const platzLabel = zahlSpalte - 16 - breite(wertText, GRAD.legende, true) - 8;

    const block = textBlock({
      x: 16,
      y,
      text: p.label,
      platz: platzLabel,
      grad: GRAD.legende,
      ton: 'tinte-weich',
      maxZeilen: 2,
    });
    const erste = y + OBEN * block.grad;

    teile.push(
      `<rect data-rolle="mark" x="0" y="${n(erste - block.grad * 0.62)}" width="10" height="10"` +
        ` rx="2" style="fill:${p.ton}"/>`,
    );
    teile.push(block.inhalt);
    teile.push(
      txt(zahlSpalte, erste, wertText, {
        grad: GRAD.legende,
        gewicht: 650,
        ton: 'tinte',
        anker: 'end',
      }),
    );
    teile.push(
      txt(anteilSpalte, erste, anteilText, {
        grad: GRAD.legende,
        ton: 'tinte-leise',
        anker: 'end',
      }),
    );
    y += block.hoehe + 4;
  }

  y += fussnoteBlock(teile, hinweis, y);

  return huelle({
    hoehe: y,
    titel: titel || 'Aufteilung',
    desc:
      (titel ? `${titel}. ` : '') +
      `Summe ${zahl(gesamt, einheit)}. ` +
      posten
        .map(
          (p) =>
            `${p.label}: ${zahl(p.wert, einheit)} ` +
            `(${DE1.format(gesamt > 0 ? (p.wert / gesamt) * 100 : 0)} Prozent)`,
        )
        .join(', ') +
      '.',
    inhalt: teile.join(''),
  });
}

/* ── 5. Kennzahl ─────────────────────────────────────────────────────── */

/**
 * Eine große Zahl mit Pfeil, für die Kurzfassung.
 *
 * `richtung: 'runter' | 'rauf' | 'keine'` zeichnet das Dreieck und setzt
 * bei 'rauf' ein Plus vor eine positive Zahl. `wertung: 'gut' | 'schlecht'
 * | 'offen' | 'neutral'` färbt den Pfeil.
 *
 * Richtung und Wertung sind getrennt, weil aus „runter" nicht folgt, ob es
 * gut ist: HTML runter ist gut, Wörter runter ist es nicht. Wer beides in
 * einen Parameter packt, schreibt irgendwann versehentlich einen grünen
 * Pfeil unter einen Verlust.
 *
 * Die Zahl selbst bleibt in --tinte, nur der Pfeil trägt die Wertungsfarbe.
 * Farbige Schrift in großem Grad liest schlechter, und die Wertung hinge
 * dann an der Farbe allein – der Pfeil zeigt sie zusätzlich in der Form,
 * also auch für Menschen, die Rot und Grün nicht unterscheiden.
 *
 * Beispiel:
 *
 *   kennzahl({ wert: -80, einheit: '%', label: 'HTML je Seite', richtung: 'runter' });
 *   // → „−80 %" mit fallendem Dreieck in --gut
 *   kennzahl({ wert: 0, label: 'tote Adressen', richtung: 'keine', wertung: 'gut' });
 */
export function kennzahl({
  wert,
  einheit = '',
  label = '',
  richtung = 'keine',
  wertung = 'gut',
} = {}) {
  const pfeil = ['runter', 'rauf'].includes(richtung) ? richtung : 'keine';
  const ton = ['gut', 'schlecht', 'offen'].includes(wertung) ? wertung : 'tinte-weich';

  const text =
    typeof wert === 'string'
      ? wert
      : wert < 0
        ? `−${zahl(Math.abs(wert), einheit)}`
        : wert > 0 && pfeil === 'rauf'
          ? `+${zahl(wert, einheit)}`
          : zahl(wert, einheit);

  const grad = GRAD.kennzahl;
  const pfeilBreite = pfeil === 'keine' ? 0 : 13;
  const kopfBreite = pfeilBreite + breite(text, grad, true);

  /* Die Kachel ist so breit wie ihr breiterer Teil – Zahl oder
     Beschriftung. Die Beschriftung darf zweizeilig werden, damit eine
     Kachel nicht die ganze Spalte belegt. */
  const platzLabel = Math.max(kopfBreite, 150);
  const teile = [];

  const grundlinie = OBEN * grad;
  if (pfeil !== 'keine') {
    /* Dreieck als Pfad, kein Schriftzeichen: „▼" fehlt in mancher Schrift
       und wird dann als Ersatzkasten gesetzt – im PDF sieht das niemand
       mehr nach. */
    const mitte = grundlinie - grad * 0.24;
    const b = 10;
    const h = 9;
    teile.push(
      `<path data-rolle="mark" d="${
        pfeil === 'runter'
          ? `M0 ${n(mitte - h / 2)}h${b}l${n(-b / 2)} ${n(h)}z`
          : `M0 ${n(mitte + h / 2)}h${b}l${n(-b / 2)} ${n(-h)}z`
      }" style="fill:${farbe(ton)}"/>`,
    );
  }
  teile.push(txt(pfeilBreite, grundlinie, text, { grad, gewicht: 700, ton: 'tinte' }));

  let y = grundlinie + UNTEN * grad + 4;
  let labelBreite = 0;
  if (label) {
    const block = textBlock({
      x: 0,
      y,
      text: label,
      platz: platzLabel,
      grad: GRAD.legende,
      gewicht: 500,
      ton: 'tinte-weich',
      maxZeilen: 2,
    });
    teile.push(block.inhalt);
    y += block.hoehe;
    labelBreite = Math.max(
      ...umbrechen(label, platzLabel, GRAD.legende, 2).map((z) => breite(z, block.grad)),
    );
  }

  const bezug = Math.ceil(Math.max(kopfBreite, labelBreite)) + 2;
  const urteil = { gut: 'Verbesserung', schlecht: 'Verschlechterung', offen: 'offen' }[wertung];

  return huelle({
    bezug,
    hoehe: y + 1,
    /* Obergrenze am eigenen Bezug: Eine Kachel soll in einer Reihe stehen,
       nicht auf Spaltenbreite aufgeblasen werden. */
    breite: `${((bezug * 1.12) / 16).toFixed(2)}rem`,
    titel: `${text}${label ? ` ${label}` : ''}`,
    desc:
      `${label ? `${label}: ` : ''}${text}` +
      `${pfeil === 'runter' ? ', gesunken' : pfeil === 'rauf' ? ', gestiegen' : ''}` +
      `${urteil ? ` – ${urteil}` : ''}.`,
    inhalt: teile.join(''),
    schluessel: `kennzahl|${text}|${label}|${richtung}|${wertung}`,
  });
}

/* ── Beigaben für die Seite ──────────────────────────────────────────── */

/**
 * Optionales CSS für die Seite. Die Grafiken funktionieren ohne – Breite,
 * Farben und Schriftgrade stehen im SVG selbst. Hier steht nur, was von
 * außen kommen muss: Abstände, die Reihe für mehrere Kacheln, die
 * Druckregel.
 *
 * Aufruf:  <style>${grafikStil()}</style>
 */
export function grafikStil() {
  return `.grafik { margin: 1.4rem 0 1.9rem; }
.grafik-reihe {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem 2rem;
  align-items: flex-start;
  margin: 1.4rem 0 1.9rem;
}
.grafik-reihe .grafik { margin: 0; }
@media print {
  /* Eine Grafik, die über den Seitenumbruch läuft, ist zweimal halb da. */
  .grafik, .grafik-reihe { break-inside: avoid; }
}`;
}
