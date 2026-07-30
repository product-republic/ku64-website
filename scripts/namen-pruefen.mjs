/**
 * Hat jedes Bedienelement einen Namen – auch dann, wenn CSS seinen Text
 * entfernt?
 *
 * ── Warum es diese Prüfung zusätzlich zu `barrierefrei:pruefen` gibt ────
 *
 * `barrierefrei-pruefen.mjs` liest gebautes HTML. Dort steht der Name des
 * Berater-Knopfes ordentlich in einem `<span>`, der Knopf gilt als benannt,
 * und die Prüfung läuft grün durch.
 *
 * Im Browser sah es anders aus. Bis 32 rem Breite entfernte
 *
 *     @media (max-width: 32rem) { .ruf-text { display: none } }
 *
 * genau diesen Text – und mit ihm den einzigen Namen des Knopfes. Ein
 * Screenreader las auf jedem Telefon nur „Schaltfläche". Gefunden hat es
 * Lighthouse, in allen fünf mobilen Läufen; am Schreibtisch war die Seite
 * fehlerfrei. Das ist die Sorte Fehler, die eine statische Prüfung nicht
 * finden KANN: Sie steht nicht im HTML, sondern im Zusammenspiel von HTML,
 * CSS und Fensterbreite.
 *
 * Verstoß gegen WCAG 4.1.2 (Name, Rolle, Wert), Konformitätsstufe A – die
 * niedrigste Stufe, die es gibt.
 *
 * ── Was hier geprüft wird ───────────────────────────────────────────────
 *
 * Jeder Knopf, jeder Verweis und jedes Formularfeld auf mehreren Seiten und
 * in mehreren Breiten, und zwar mit dem Namen, den der Browser tatsächlich
 * berechnet: `aria-label`, `aria-labelledby`, `title`, `alt` eines Bildes
 * darin – oder sichtbarer Text, der NICHT durch `display: none`,
 * `visibility: hidden` oder eine leere Größe verschwunden ist.
 *
 * Der Unterschied zu `.nur-screenreader` ist der Kern der Sache: Text, der
 * per `clip-path`/1-Pixel-Trick versteckt ist, bleibt für Screenreader da
 * und zählt. Text, den `display: none` entfernt, ist für alle weg.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   npm run build && npm start &
 *   npm run namen:pruefen
 */

import { chromium } from 'playwright';

const BASIS = process.env.KLICKPFAD_BASIS || 'http://127.0.0.1:4331';

const SEITEN = [
  ['/', 'Start'],
  ['/berlin-charlottenburg/', 'Standort'],
  ['/berlin-charlottenburg/team/', 'Team'],
  ['/berlin-charlottenburg/leistungen/bleaching/', 'Behandlung'],
  ['/blog/', 'Blogübersicht'],
  ['/suche/', 'Suche'],
  ['/beratung/', 'Beratung'],
  ['/kontakt/', 'Kontakt'],
];

/*
 * Die Breiten sind nicht beliebig: 360 und 390 liegen unter der 32-rem-Grenze
 * (512 px), an der der Berater-Knopf seinen Text verlor, 520 knapp darüber,
 * 1280 ist der Schreibtisch. Eine Prüfung, die nur 390 und 1280 misst, würde
 * einen Fehler an der Grenze selbst nicht sehen.
 */
const BREITEN = [360, 390, 520, 1280];

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PFAD || '/opt/pw-browsers/chromium',
  args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});

const MESSEN = () => {
  /** Ist das Element für eine Vorlesehilfe überhaupt vorhanden? */
  function sichtbarFuerHilfe(el) {
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const s = getComputedStyle(n);
      if (s.display === 'none' || s.visibility === 'hidden' || s.visibility === 'collapse') {
        return false;
      }
      if (n.hasAttribute('aria-hidden') && n.getAttribute('aria-hidden') !== 'false') return false;
      if (n.hasAttribute('hidden')) return false;
    }
    return true;
  }

  /**
   * Sichtbarer Text, der auch für Screenreader zählt.
   *
   * `display: none` und `visibility: hidden` nehmen den Text allen. Der
   * 1-Pixel-Trick (`clip-path: inset(50%)`, Größe 1×1, `overflow: hidden`)
   * nimmt ihn nur den Augen – er zählt weiter. Genau diese Unterscheidung
   * ist der Grund für diese Prüfung.
   */
  function textFuerHilfe(el) {
    let text = '';
    for (const n of el.childNodes) {
      if (n.nodeType === 3) {
        text += n.textContent;
      } else if (n.nodeType === 1) {
        if (n.tagName.toLowerCase() === 'svg') continue;
        if (!sichtbarFuerHilfe(n)) continue;
        text += textFuerHilfe(n);
      }
    }
    return text.replace(/\s+/g, ' ').trim();
  }

  function name(el) {
    const label = el.getAttribute('aria-label');
    if (label && label.trim() && label.trim() !== 'undefined') return label.trim();

    const von = el.getAttribute('aria-labelledby');
    if (von) {
      const teile = von
        .split(/\s+/)
        .map((id) => document.getElementById(id))
        .filter(Boolean)
        .map((n) => textFuerHilfe(n))
        .filter(Boolean);
      if (teile.length) return teile.join(' ');
    }

    const titel = el.getAttribute('title');
    if (titel && titel.trim()) return titel.trim();

    const eigener = textFuerHilfe(el);
    if (eigener) return eigener;

    /* Ein Bild mit Alternativtext im Inneren benennt das Element ebenfalls. */
    for (const bild of el.querySelectorAll('img[alt]')) {
      if (bild.getAttribute('alt').trim() && sichtbarFuerHilfe(bild)) {
        return bild.getAttribute('alt').trim();
      }
    }

    /* Bei Formularfeldern zählt das zugehörige <label>. */
    if (el.labels && el.labels.length) {
      const l = [...el.labels].map((x) => textFuerHilfe(x)).filter(Boolean);
      if (l.length) return l.join(' ');
    }

    return '';
  }

  const befunde = [];
  const gesehen = new Set();

  const auswahl = 'button, a[href], input:not([type=hidden]), select, textarea, [role=button]';
  for (const el of document.querySelectorAll(auswahl)) {
    if (!sichtbarFuerHilfe(el)) continue;
    const kasten = el.getBoundingClientRect();
    if (kasten.width === 0 && kasten.height === 0) continue;

    if (name(el)) continue;

    const kennung =
      el.tagName.toLowerCase() +
      (el.className && typeof el.className === 'string' && el.className.trim()
        ? '.' + el.className.trim().split(/\s+/)[0]
        : '') +
      (el.id ? `#${el.id}` : '');
    if (gesehen.has(kennung)) continue;
    gesehen.add(kennung);

    befunde.push({
      kennung,
      html: el.outerHTML.replace(/\s+/g, ' ').slice(0, 120),
    });
  }
  return befunde;
};

const alle = new Map();
let geprueft = 0;

for (const breite of BREITEN) {
  for (const [pfad, art] of SEITEN) {
    const seite = await browser.newPage({ viewport: { width: breite, height: 900 } });
    await seite.goto(BASIS + pfad, { waitUntil: 'networkidle' });
    geprueft++;
    for (const b of await seite.evaluate(MESSEN)) {
      const schluessel = `${breite} ${b.kennung}`;
      if (!alle.has(schluessel)) alle.set(schluessel, { ...b, breite, art });
    }
    await seite.close();
  }
}

await browser.close();

console.log(`\n[namen] ${geprueft} Seitenaufrufe geprüft (${BREITEN.join(', ')} px)`);

if (alle.size === 0) {
  console.log('[namen] Jedes Bedienelement hat in jeder Breite einen Namen.');
  process.exit(0);
}

console.error(`\n[namen] ${alle.size} Bedienelement(e) ohne Namen:`);
for (const b of [...alle.values()].sort((a, z) => a.breite - z.breite)) {
  console.error(`\n    ${b.breite} px, ${b.art}:  ${b.kennung}`);
  console.error(`      ${b.html}`);
}

console.error(
  '\n[namen] ABBRUCH: Ein Bedienelement ohne Namen heißt für eine Vorlesehilfe\n' +
    '        nur „Schaltfläche" oder „Link" (WCAG 4.1.2, Stufe A). Häufigste\n' +
    '        Ursache: `display: none` auf dem Text in einer Media Query. Wer\n' +
    '        Text nur optisch verstecken will, nimmt `.nur-screenreader` –\n' +
    '        das lässt ihn für Vorlesehilfen stehen.',
);
process.exit(1);
