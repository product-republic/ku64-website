/**
 * Farbkontrast von Schrift gegen ihren Untergrund.
 *
 * ── Warum es das gibt ───────────────────────────────────────────────────
 *
 * Es gab bisher keine Prüfung dafür. Aufgefallen ist es über Lighthouse:
 * Barrierefreiheit 90 statt 100, sechs Stellen im Fuß, der Satz in der
 * Standortleiste und die abgeblendeten Sprachkürzel. Alles Text, den man
 * sieht – nur eben zu blass.
 *
 * Das ist kein Schönheitsfehler. WCAG 1.4.3 verlangt 4,5:1 für normalen
 * Text und 3:1 für großen (ab 24 px, oder ab 18,66 px fett). Wer die
 * Anforderung reißt, schließt Menschen mit eingeschränktem Sehvermögen aus –
 * und bei einer Arztpraxis sind das überdurchschnittlich viele.
 *
 * ── Warum im Browser und nicht im CSS ───────────────────────────────────
 *
 * Weil die Farbe im Quelltext nicht die Farbe auf dem Schirm ist. Die
 * Flächen hier sind halbdurchsichtig (`rgb(255 255 255 / 0.5)`), also hängt
 * der tatsächliche Untergrund davon ab, was darunter liegt. Ausgerechnet
 * wird deshalb, was der Browser wirklich zeichnet: Farbe des Textes gegen
 * den zusammengerechneten Untergrund aller Vorfahren.
 *
 * Geprüft wird in beiden Breiten. Auf dem Telefon gelten teils andere
 * Regeln – der Fuß ist einspaltig, die Sprachwahl steht im Menü –, und ein
 * Kontrast, der oben stimmt, kann unten fehlen.
 *
 * ── Was bewusst NICHT geprüft wird ──────────────────────────────────────
 *
 * Text über Bildern und Videos. Dort gibt es keinen einzelnen Untergrund,
 * gegen den sich rechnen ließe; der Kopf löst das mit Schleier und
 * Weichzeichnung (siehe Kopfmedium.astro). Das beurteilt ein Mensch, kein
 * Skript – und ein Skript, das es doch versucht, meldet entweder ständig
 * Fehlalarm oder rechnet sich das Ergebnis schön.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   npm run build && npm start &
 *   npm run kontrast:pruefen
 */

import { chromium } from 'playwright';

const BASIS = process.env.KLICKPFAD_BASIS || 'http://127.0.0.1:4331';

/**
 * Eine Seite je Bauart – mehr sagt nichts Neues über die Bausteine.
 *
 * Die Teamseite stand hier zuerst NICHT, und das hat einen Fehler
 * durchgelassen: `.chip-zahl` in den Filterknöpfen kam über `opacity: 0.65`
 * auf 3,5:1. Gefunden hat es später Lighthouse. Die Teamseite ist die
 * einzige Seite mit Filterknöpfen – ein Baustein, den es nur dort gibt, wird
 * von einer Liste ohne diese Seite nie geprüft.
 *
 * Wer hier etwas ergänzt, ergänzt es wegen eines Bausteins, den keine der
 * anderen Seiten trägt. Umgekehrt gilt: Ein neuer Baustein braucht eine
 * Seite in dieser Liste.
 */
const SEITEN = [
  ['/', 'Start'],
  ['/berlin-charlottenburg/', 'Standort'],
  ['/berlin-charlottenburg/leistungen/bleaching/', 'Behandlung'],
  ['/berlin-charlottenburg/team/', 'Team (Filterknöpfe)'],
  ['/blog/', 'Blogübersicht'],
  ['/kontakt/', 'Kontakt'],
  ['/suche/', 'Suche'],
  ['/en/', 'Start (EN)'],
];

const BREITEN = [
  ['Telefon', 390, 844],
  ['Schreibtisch', 1440, 900],
];

/* Der dunkle Modus hat eigene Farbwerte. Er wird über die Systemeinstellung
   aktiviert, nicht über einen Schalter – also sieht ihn niemand, der ihn
   nicht ohnehin überall eingestellt hat, und genau deshalb fällt dort ein
   Fehler besonders lange nicht auf. */
const MODI = ['light', 'dark'];

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PFAD || '/opt/pw-browsers/chromium',
  args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});

/* Im Browser ausgeführt: Der ganze Rechenweg muss dorthin, wo die Farben
   tatsächlich stehen. */
const MESSEN = () => {
  /*
   * Farben über die Leinwand einlesen statt über einen eigenen Parser.
   *
   * Ein erster Entwurf zog die Zahlen mit einem regulären Ausdruck heraus.
   * Das geht so lange gut, bis eine Farbe nicht `rgb()` ist: Die Kopfleiste
   * trägt `oklab(0.999994 0.0000455678 0.0000200868 / 0.16)` – fast weiß –,
   * und als rgb gelesen wurde daraus ein fast schwarzes 0,0,0. Die Prüfung
   * meldete daraufhin Kontrastfehler, wo keine waren.
   *
   * Die Leinwand kennt jede Schreibweise, die auch der Browser kennt, und
   * gibt sRGB zurück. Kein eigener Parser, der veralten kann.
   */
  const stift = document.createElement('canvas').getContext('2d', { willReadFrequently: true });

  function farbe(s) {
    stift.clearRect(0, 0, 1, 1);
    stift.fillStyle = '#000';
    stift.fillStyle = s;
    stift.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = stift.getImageData(0, 0, 1, 1).data;
    return { r, g, b, a: a / 255 };
  }

  /** Zwei Farben übereinanderlegen – „über" liegt oben. */
  function ueberlagern(unten, oben) {
    const a = oben.a + unten.a * (1 - oben.a);
    if (a === 0) return { r: 255, g: 255, b: 255, a: 0 };
    const misch = (u, o) => (o * oben.a + u * unten.a * (1 - oben.a)) / a;
    return { r: misch(unten.r, oben.r), g: misch(unten.g, oben.g), b: misch(unten.b, oben.b), a };
  }

  function leuchtdichte({ r, g, b }) {
    const k = [r, g, b].map((v) => {
      const x = v / 255;
      return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * k[0] + 0.7152 * k[1] + 0.0722 * k[2];
  }

  function verhaeltnis(a, b) {
    const [x, y] = [leuchtdichte(a), leuchtdichte(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  }

  /**
   * Deckt ein Pseudoelement den Kasten seines Elements ganz ab?
   *
   * Die aktive Menüseite trägt ihre dunkle Pille als `::after` mit
   * `position:absolute; inset:0; z-index:-1`. Im DOM steht davon nichts –
   * wer nur `backgroundColor` der Elemente addiert, sieht weiße Schrift auf
   * weißem Grund und meldet 1:1, wo in Wahrheit 15:1 stehen.
   */
  function pseudoFlaeche(n) {
    for (const wo of ['::before', '::after']) {
      const p = getComputedStyle(n, wo);
      if (!p.content || p.content === 'none') continue;
      /*
       * Nur `absolute`, nicht `fixed`.
       *
       * `fixed` bezieht sich auf das Fenster, nicht auf den Kasten des
       * Elements. `body::before` ist genau so einer: ein seitenweiter
       * Lichtverlauf mit `inset: 0`. Als deckende Fläche gezählt, galt der
       * Untergrund jedes einzelnen Textes als „Bild, nicht berechenbar" –
       * und die Prüfung meldete auf der ganzen Website nichts mehr.
       */
      if (p.position !== 'absolute') continue;
      if (Number(p.opacity) === 0) continue;
      /*
       * Nur was den ganzen Kasten abdeckt – ein Unterstrich am unteren Rand
       * ist kein Untergrund.
       *
       * `auto` zählt hier NICHT als null. Ein erster Entwurf ließ es
       * durchgehen, und weil ein `position:absolute` ohne Angaben auf allen
       * vier Seiten `auto` steht, galt danach jedes dekorative
       * Pseudoelement als deckende Fläche. Ergebnis: Die Prüfung meldete
       * plötzlich gar nichts mehr – auch die sechs Stellen nicht, die
       * Lighthouse gerade gefunden hatte.
       */
      const deckt = ['top', 'right', 'bottom', 'left'].every((seite) => p[seite] === '0px');
      if (!deckt) continue;
      if (p.backgroundImage && p.backgroundImage !== 'none') return 'bild';
      const f = farbe(p.backgroundColor);
      if (f.a > 0) return f;
    }
    return null;
  }

  /**
   * Der Untergrund, den dieses Element wirklich hat: von unten (weiß) nach
   * oben durch alle Vorfahren, halbdurchsichtige Flächen übereinandergelegt.
   *
   * Liegt unterwegs ein Bild oder Verlauf, gilt der Untergrund als nicht
   * berechenbar – dann wird nicht geraten, sondern übersprungen.
   */
  function untergrund(el) {
    const kette = [];
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) kette.push(n);
    kette.push(document.documentElement);

    let unten = { r: 255, g: 255, b: 255, a: 1 };
    for (const n of kette.reverse()) {
      const s = getComputedStyle(n);
      if (s.backgroundImage && s.backgroundImage !== 'none') return null;
      const f = farbe(s.backgroundColor);
      if (f.a > 0) unten = ueberlagern(unten, f);

      const pseudo = pseudoFlaeche(n);
      if (pseudo === 'bild') return null;
      if (pseudo) unten = ueberlagern(unten, pseudo);
    }
    return unten;
  }

  const befunde = [];
  const gesehen = new Set();
  let uebersprungen = 0;

  for (const el of document.querySelectorAll('body *')) {
    /* Text über Video oder Foto trägt `.auf-medium` und hat keinen einzelnen
       Untergrund, gegen den sich rechnen ließe. Dort arbeiten Schleier und
       Weichzeichnung – das beurteilt ein Mensch, siehe Kopfkommentar. */
    if (el.closest('.auf-medium')) {
      uebersprungen++;
      continue;
    }

    /* Nur Elemente mit eigenem Text – sonst wird jeder Container mitgezählt
       und derselbe Befund steht zwanzigmal da. */
    const eigenerText = [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join(' ')
      .trim();
    if (!eigenerText) continue;

    const s = getComputedStyle(el);
    if (s.visibility === 'hidden' || s.display === 'none' || Number(s.opacity) === 0) continue;
    const kasten = el.getBoundingClientRect();
    if (kasten.width === 0 || kasten.height === 0) continue;

    const grund = untergrund(el);
    if (!grund) continue; // über Bild oder Verlauf – siehe Kopfkommentar

    /*
     * Deckkraft an Vorfahren zählt mit.
     *
     * Die noch nicht freigegebenen Sprachen sind mit `opacity: 0.5` am
     * Verweis abgeblendet. Am Element selbst steht die volle Farbe – auf dem
     * Schirm ist sie halb so kräftig. Wer nur `color` liest, misst eine
     * Lesbarkeit, die es nicht gibt.
     */
    let deckkraft = 1;
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      deckkraft *= Number(getComputedStyle(n).opacity);
    }

    /* Gar nicht sichtbar: entweder nur für Screenreader da oder noch nicht
       eingeblendet. Beides hat keinen Kontrast, den man messen könnte. */
    if (deckkraft < 0.01) continue;
    if (el.closest('.nur-screenreader')) continue;

    const vorn = farbe(s.color);
    const sichtbar = { ...vorn, a: vorn.a * deckkraft };
    const wirklich = sichtbar.a < 1 ? ueberlagern(grund, sichtbar) : sichtbar;
    const wert = verhaeltnis(wirklich, grund);

    const px = parseFloat(s.fontSize);
    const fett = Number(s.fontWeight) >= 700;
    const gross = px >= 24 || (fett && px >= 18.66);
    const noetig = gross ? 3 : 4.5;

    if (wert + 0.01 < noetig) {
      const kennung = `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]}`;
      if (gesehen.has(kennung)) continue;
      gesehen.add(kennung);
      befunde.push({
        kennung,
        text: eigenerText.slice(0, 40),
        wert: Math.round(wert * 100) / 100,
        noetig,
      });
    }
  }
  return { befunde, uebersprungen };
};

const alle = new Map();
let geprueft = 0;
let uebersprungen = 0;

for (const modus of MODI)
  for (const [breitenNameRoh, w, h] of BREITEN) {
    const breitenName = `${breitenNameRoh}/${modus === 'dark' ? 'dunkel' : 'hell'}`;
    for (const [pfad, art] of SEITEN) {
      const seite = await browser.newPage({
        viewport: { width: w, height: h },
        colorScheme: modus,
      });
      await seite.goto(BASIS + pfad, { waitUntil: 'networkidle' });

      /*
       * Bewegung anhalten und Eingeblendetes eingeblendet lassen.
       *
       * Ohne das misst man Zwischenstände: Ein Absatz, der gerade von 0 auf
       * 1 fährt, steht beim Messen vielleicht bei 0,08 – dann ist die
       * Schrift fast durchsichtig, und die Rechnung ergibt 1,47:1 für einen
       * Text, der eine Sekunde später bei 16:1 steht. Genau das hat diese
       * Prüfung zweimal gemeldet, bevor diese Zeilen hier standen.
       *
       * Gemessen wird der Zustand, den die Besucherin sieht: fertig
       * eingeblendet.
       */
      await seite.addStyleTag({
        content: `*, *::before, *::after { transition: none !important; animation: none !important; }
                  .einblenden { opacity: 1 !important; transform: none !important; }`,
      });

      geprueft++;

    /*
     * Zweimal messen: ungescrollt und durchgescrollt.
     *
     * Ungescrollt, weil der Kopf oben anders aussieht – angedockt blendet er
     * den Satz „Bitte wählen Sie Ihren Standort" aus, und was ausgeblendet
     * ist, lässt sich nicht messen. Genau diese Stelle hatte Lighthouse
     * gemeldet; ein Lauf, der nur gescrollt misst, hätte sie verloren.
     *
     * Durchgescrollt, weil sich vieles beim Erscheinen einblendet und
     * vorher auf `opacity: 0` steht. Ungescrollt allein wäre die halbe
     * Seite „unsichtbar" und damit ungeprüft.
     */
    for (const zustand of ['oben', 'gescrollt']) {
      if (zustand === 'gescrollt') {
        await seite.evaluate(async () => {
          const schritt = window.innerHeight * 0.8;
          for (let y = 0; y < document.body.scrollHeight; y += schritt) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 120));
          }
          await new Promise((r) => setTimeout(r, 300));
        });
      }

      const ergebnis = await seite.evaluate(MESSEN);
      uebersprungen += ergebnis.uebersprungen;
      for (const b of ergebnis.befunde) {
        const schluessel = `${breitenName} ${b.kennung}`;
        if (!alle.has(schluessel)) alle.set(schluessel, { ...b, breite: breitenName, art });
      }
    }

      await seite.close();
    }
  }

await browser.close();

console.log(
  `\n[kontrast] ${geprueft} Seitenaufrufe geprüft – Telefon und Schreibtisch, hell und dunkel`,
);
/* Nicht verschweigen, was nicht geprüft wurde – sonst liest sich „in
   Ordnung" wie „alles geprüft". */
console.log(`[kontrast] ${uebersprungen} Stellen über Video oder Foto übersprungen (.auf-medium)`);

if (alle.size === 0) {
  console.log('[kontrast] Jede Schrift hebt sich ausreichend von ihrem Untergrund ab.');
  process.exit(0);
}

console.error(`\n[kontrast] ${alle.size} Stelle(n) unter der Anforderung:`);
for (const b of [...alle.values()].sort((a, z) => a.wert - z.wert)) {
  console.error(
    `    ${b.wert.toFixed(2)}:1  (nötig ${b.noetig}:1)  ${b.kennung}` +
      `  – ${b.breite}, ${b.art}: „${b.text}"`,
  );
}

console.error(
  '\n[kontrast] ABBRUCH: WCAG 1.4.3 verlangt 4,5:1 für normalen Text und 3:1\n' +
    '           für großen. Wer darunter bleibt, schließt Menschen mit\n' +
    '           eingeschränktem Sehvermögen aus – bei einer Arztpraxis\n' +
    '           überdurchschnittlich viele.',
);
process.exit(1);
