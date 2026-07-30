/**
 * Kontrast einer fertig gerenderten Seite messen – im Browser ausgeführt.
 *
 * ── Warum das ein eigenes Modul ist ─────────────────────────────────────
 *
 * Diese Funktion steckte in `scripts/kontrast-pruefen.mjs` und wurde dort für
 * die Website gebraucht. Der Bericht (`bericht/bericht-pruefen.mjs`) braucht
 * genau dieselbe Messung für eine andere Seite.
 *
 * Kopieren wäre die schlechtere Wahl, und zwar nicht wegen der Zeilenzahl:
 * In den Kommentaren hier stehen fünf Fehler, die diese Prüfung schon einmal
 * gemacht hat – oklab als rgb gelesen, `body::before` als deckende Fläche,
 * `auto` als Null, Deckkraft am Vorfahren, Messung mitten in einer
 * Animation. Eine Kopie hätte diese Kommentare zweimal und würde beim
 * nächsten Fund nur an einer Stelle korrigiert.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   import { kontrastMessen } from './lib/kontrast-messen.mjs';
 *   const { befunde, uebersprungen } = await seite.evaluate(kontrastMessen);
 *
 * Playwright überträgt die Funktion als Quelltext. Sie darf deshalb nichts
 * aus dem Modulumfeld schließen – alles, was sie braucht, steht in ihr.
 *
 * ── Was sie zurückgibt ──────────────────────────────────────────────────
 *
 *   befunde         je Bauart einmal: { kennung, text, wert, noetig }
 *   uebersprungen   Anzahl Texte über Bild/Video, die niemand berechnen kann
 *
 * Die Schwellen sind die der WCAG 1.4.3: 4,5:1 für Text, 3:1 für großen
 * Text (ab 24 px, oder ab 18,66 px wenn fett).
 *
 * Zwei Klassen der Website sind hier bewusst genannt und im Bericht einfach
 * nicht vorhanden – das ist in Ordnung, nicht zu bereinigen: `.auf-medium`
 * (Text über Foto/Video, den ein Mensch beurteilt) und `.nur-screenreader`
 * (Text ohne Fläche).
 */

export const kontrastMessen = () => {
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
