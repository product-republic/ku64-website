/**
 * Wird irgendwo Text abgeschnitten – oder klebt er am nächsten Kasten?
 *
 * ── Der Fehler, den es diese Prüfung gibt ───────────────────────────────
 *
 * Auf der Startseite stand „Digital, bevor Sie ankommen", und die Unterlänge
 * des „g" war angeschnitten. Die Ursache war eine Zahl: `--zeile-eng: 1.05`.
 * Inter hat 0,97 em über und 0,24 em unter der Grundlinie, zusammen 1,21 – bei
 * einer Zeilenhöhe von 1,05 ist die Zeilenbox kleiner als die Schrift, und was
 * darüber hinausragt, überdeckt der nächste Kasten.
 *
 * Das ist der unangenehmste Layoutfehler, den es gibt: Er sieht auf den
 * meisten Seiten in Ordnung aus, weil dort zufällig kein „g", „y" oder „ß" am
 * Zeilenende steht. Er ist keine Ausnahme, sondern eine Eigenschaft – und
 * niemand fällt darüber, bis eine Überschrift geändert wird.
 *
 * ── Was gemessen wird ───────────────────────────────────────────────────
 *
 * Im Browser, an der gebauten Seite, in vier Ansichten:
 *
 *   1. ZEILENHÖHE GEGEN SCHRIFTKEGEL. Für jede Überschrift und jeden
 *      Fließtext: Ist `line-height` kleiner als der Kegel der Schrift, ragt
 *      die Unterlänge aus ihrer Box. Gemessen wird nicht geschätzt – die
 *      tatsächliche Höhe eines „g" gegen die Zeilenbox.
 *
 *   2. ABSTAND ZUM NÄCHSTEN KASTEN. Eine Überschrift, deren Unterkante
 *      weniger als 4 px über dem folgenden Block liegt, klebt – auch wenn
 *      nichts abgeschnitten ist. Das war der zweite Teil derselben Meldung.
 *
 *   3. ECHTER ÜBERLAUF. Ein Element, dessen Inhalt höher ist als sein Kasten,
 *      bei `overflow: hidden` – dann fehlt Text, ohne dass ein Zeichen davon
 *      zu sehen wäre.
 *
 * ── Warum vier Ansichten ────────────────────────────────────────────────
 *
 * Eine Überschrift, die auf 1280 px in eine Zeile passt, bricht auf 390 px in
 * drei – und erst die dritte hat das „g" am Ende. Geprüft wird deshalb schmal
 * und breit, und in beiden Farbmodi, weil der dunkle Modus andere
 * Schriftstärken bekommt.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   OEFFENTLICHE_HOSTS=127.0.0.1 npm start &
 *   npm run abschnitt:pruefen
 */

import { chromium } from 'playwright';

const BASIS = process.env.BASIS ?? `http://127.0.0.1:${process.env.PORT ?? 4321}`;

const SEITEN = [
  ['/', 'Start'],
  ['/standorte/', 'Standortübersicht'],
  ['/berlin-charlottenburg/', 'Standort'],
  ['/berlin-charlottenburg/leistungen/', 'Behandlungsübersicht'],
  ['/leistungen/zahnimplantate/', 'Behandlung mit Langtext'],
  ['/leistungen/zahnimplantate/zahnimplantat-kosten/', 'Unterthema'],
  ['/berlin-charlottenburg/team/', 'Team'],
  ['/blog/', 'Blog'],
  ['/en/', 'Start (EN)'],
  ['/fr/leistungen/', 'Behandlungen (FR)'],
];

const ANSICHTEN = [
  ['Telefon/hell', 390, 844, 'light'],
  ['Telefon/dunkel', 390, 844, 'dark'],
  ['Schreibtisch/hell', 1280, 900, 'light'],
  ['Schreibtisch/dunkel', 1280, 900, 'dark'],
];

const MESSEN = () => {
  /*
   * Die Konstante steht IN der Funktion, nicht daneben.
   *
   * Playwright überträgt sie als Quelltext in den Browser; alles, was sie aus
   * dem Modulumfeld schließt, ist dort nicht vorhanden. Der erste Lauf brach
   * mit „MINDESTLUFT is not defined" ab – derselbe Fehler steckt schon im
   * Kopfkommentar von scripts/lib/kontrast-messen.mjs.
   */
  const MINDESTLUFT = 4; // px, die eine Überschrift über dem nächsten Block frei hat

  const befunde = [];

  /*
   * Die tatsächliche Höhe der Schrift, nicht die geschätzte.
   *
   * `getBoundingClientRect` eines Textknotens über einen Range gibt den
   * Kasten, den die Zeichen wirklich einnehmen – inklusive Unterlänge. Die
   * Zeilenbox steht daneben in `lineHeight`. Was darüber hinausragt, wird
   * vom nächsten Element überdeckt.
   */
  function kegelUeberstand(el) {
    const s = getComputedStyle(el);
    const zeile = parseFloat(s.lineHeight);
    if (!Number.isFinite(zeile)) return 0;

    const bereich = document.createRange();
    bereich.selectNodeContents(el);
    const kaesten = [...bereich.getClientRects()];
    if (kaesten.length === 0) return 0;

    /* Die letzte Zeile ist die, unter der etwas anderes steht. */
    const letzte = kaesten[kaesten.length - 1];
    return Math.max(0, letzte.height - zeile);
  }

  const TITEL = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];

  for (const el of document.querySelectorAll('body *')) {
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden') continue;
    if (el.closest('.nur-screenreader')) continue;

    const eigenerText = [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join(' ')
      .trim();
    if (!eigenerText) continue;

    const kasten = el.getBoundingClientRect();
    if (kasten.width === 0 || kasten.height === 0) continue;

    const kennung = `${el.tagName.toLowerCase()}${el.className ? '.' + String(el.className).split(' ')[0] : ''}`;
    const probe = eigenerText.slice(0, 46);

    /* ── 1. Zeilenhöhe gegen Schriftkegel ──────────────────────────── */

    const ueber = kegelUeberstand(el);
    if (ueber > 1.5) {
      befunde.push({
        art: 'Unterlänge ragt aus der Zeile',
        kennung,
        probe,
        wert: `${ueber.toFixed(1)} px über der Zeilenbox, line-height ${s.lineHeight}`,
      });
    }

    /* ── 2. Abstand zum nächsten Kasten ────────────────────────────── */

    if (TITEL.includes(el.tagName)) {
      const naechster = el.nextElementSibling;
      if (naechster) {
        const n = naechster.getBoundingClientRect();
        const luft = n.top - kasten.bottom;
        /* Negativ heißt Überlappung, das ist immer falsch. Zwischen 0 und
           MINDESTLUFT klebt es – bei einer Überschrift mit Unterlänge ist
           das genau der Fall, den man auf dem Schirm sieht. */
        if (n.height > 0 && luft < MINDESTLUFT) {
          befunde.push({
            art: luft < 0 ? 'Überschrift überlappt den nächsten Block' : 'Überschrift klebt am nächsten Block',
            kennung,
            probe,
            wert: `${luft.toFixed(1)} px Abstand zu ${naechster.tagName.toLowerCase()}`,
          });
        }
      }
    }

    /* ── 3. Echter Überlauf bei verstecktem Überhang ───────────────── */

    if (s.overflowY === 'hidden' || s.overflow === 'hidden') {
      /*
       * Nur für Screenreader sichtbare Texte sind KEIN Abschneider.
       *
       * Das Muster ist ein 1-px-Kasten mit `clip-path` – der Inhalt ist
       * absichtlich größer als sein Rahmen, und genau das meldete der erste
       * Lauf als Fehler: `.ruf-text` mit 23 px, `.voll` mit 21 px. Beides
       * ist die Barrierefreiheitslösung, nicht ihr Gegenteil.
       *
       * Erkannt am Kasten, nicht am Klassennamen: Ein Element von höchstens
       * 1 px Höhe zeigt niemandem etwas, und ein `clip-path` schneidet
       * absichtlich.
       */
      const versteckt =
        kasten.height <= 1 ||
        kasten.width <= 1 ||
        (s.clipPath && s.clipPath !== 'none') ||
        s.position === 'absolute' && parseFloat(s.width) <= 1;

      const zuviel = el.scrollHeight - el.clientHeight;
      if (!versteckt && zuviel > 2) {
        befunde.push({
          art: 'Inhalt ist höher als sein Kasten und wird abgeschnitten',
          kennung,
          probe,
          wert: `${zuviel} px werden verdeckt`,
        });
      }
    }
  }

  /* Je Bauart einmal – dieselbe Karte auf 30 Seiten ist ein Fehler. */
  const gesehen = new Set();
  return befunde.filter((b) => {
    const k = `${b.art}|${b.kennung}`;
    if (gesehen.has(k)) return false;
    gesehen.add(k);
    return true;
  });
};

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PFAD || '/opt/pw-browsers/chromium',
  args: ['--enable-unsafe-swiftshader'],
});

const alle = new Map();
let aufrufe = 0;

for (const [ansicht, w, h, modus] of ANSICHTEN) {
  for (const [pfad, name] of SEITEN) {
    const seite = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: modus });
    await seite.goto(BASIS + pfad, { waitUntil: 'networkidle' });

    /* Schrift abwarten und Bewegung anhalten – eine Messung während einer
       Einblendung misst einen Zwischenstand. Derselbe Fehler hat schon die
       Kontrastprüfung zweimal falsch melden lassen. */
    await seite.evaluate(() => document.fonts.ready);
    await seite.addStyleTag({
      content: '*,*::before,*::after{transition:none!important;animation:none!important;opacity:1!important}',
    });
    await seite.waitForTimeout(120);

    for (const b of await seite.evaluate(MESSEN)) {
      const schluessel = `${b.art}|${b.kennung}`;
      if (!alle.has(schluessel)) alle.set(schluessel, { ...b, wo: new Set() });
      alle.get(schluessel).wo.add(`${name} · ${ansicht}`);
    }

    aufrufe++;
    await seite.close();
  }
}

await browser.close();

console.log(`[abschnitt] ${aufrufe} Seitenaufrufe – Telefon und Schreibtisch, hell und dunkel`);

if (alle.size === 0) {
  console.log(
    '[abschnitt] Keine Unterlänge ragt aus ihrer Zeile, keine Überschrift klebt\n' +
      '            am nächsten Block, nichts wird verdeckt abgeschnitten.',
  );
  process.exit(0);
}

console.error(`\n[abschnitt] ${alle.size} Befund(e):`);
for (const b of [...alle.values()].sort((a, z) => z.wo.size - a.wo.size)) {
  console.error(`\n    ${b.art}`);
  console.error(`      ${b.kennung} – ${b.wert}`);
  console.error(`      „${b.probe}…"`);
  console.error(`      auf ${b.wo.size} Ansicht(en), z. B. ${[...b.wo][0]}`);
}

console.error(
  '\n[abschnitt] ABBRUCH: Eine abgeschnittene Unterlänge sieht auf den meisten\n' +
    '            Seiten nach nichts aus, weil dort zufällig kein „g" am\n' +
    '            Zeilenende steht. Sie ist trotzdem eine Eigenschaft und keine\n' +
    '            Ausnahme – und fällt erst auf, wenn jemand eine Überschrift\n' +
    '            ändert.',
);
process.exit(1);
