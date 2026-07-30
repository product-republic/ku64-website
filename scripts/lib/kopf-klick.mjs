/**
 * Ein Bedienelement im klebenden Kopf anklicken – ohne dass die Seite springt.
 *
 * ── Der Fallstrick ──────────────────────────────────────────────────────
 *
 * `locator.click()` von Playwright rollt das Ziel vor dem Klick ins Bild
 * (`DOM.scrollIntoViewIfNeeded`). Bei `position: sticky` ist das fatal: Der
 * Kopf klebt zwar oben am Fenster, seine LAYOUTposition steht aber am Anfang
 * des Dokuments. Das Hineinrollen scrollt die Seite deshalb auf null – und
 * genau dort ist der Kopf nicht mehr angedockt, die kompakten Bedienelemente
 * sind wieder eingeklappt, und der Klick läuft in einen Timeout.
 *
 * Gemessen, nicht vermutet: scrollY 600 → 165 → 0, jeweils direkt nach einem
 * `click()`. Zwei Prüfungen haben daraufhin Fehler gemeldet, die es nicht
 * gab: „Standortwähler öffnet nicht (gescrollt)" im Durchgang und ein
 * Klick-Timeout in `kopf-pruefen`. Beide beschrieben das Werkzeug, nicht die
 * Website.
 *
 * ── Was hier stattdessen passiert ───────────────────────────────────────
 *
 * Zwei Schritte, die zusammen mehr prüfen als ein `click()`:
 *
 *   1. TREFFERPROBE. `elementFromPoint` in der Mitte des Elements. Liegt
 *      dort etwas anderes, ist das Element verdeckt – dieselbe Frage, die
 *      Playwright bei „receives pointer events" stellt, nur ohne Rollen.
 *   2. ECHTES KLICKEREIGNIS über `HTMLElement.click()`. Es steigt auf, löst
 *      die Standardhandlung eines `<summary>` aus und wird von allen
 *      Zuhörern am `document` gesehen. Was es NICHT auslöst, sind
 *      Zeigerereignisse – die prüft Schritt 1.
 */

/**
 * @param {import('playwright').Page} seite
 * @param {string} auswahl CSS-Auswahl des Bedienelements
 * @returns {Promise<{ok: boolean, grund?: string}>}
 */
export async function kopfKlick(seite, auswahl) {
  return seite.evaluate((a) => {
    const el = document.querySelector(a);
    if (!el) return { ok: false, grund: 'nicht im Baum' };

    const k = el.getBoundingClientRect();
    if (k.width < 1 || k.height < 1) return { ok: false, grund: 'ohne Fläche' };

    const s = getComputedStyle(el);
    if (s.visibility === 'hidden' || s.display === 'none' || parseFloat(s.opacity) < 0.05) {
      return { ok: false, grund: 'unsichtbar' };
    }

    const treffer = document.elementFromPoint(
      Math.round(k.left + k.width / 2),
      Math.round(k.top + k.height / 2),
    );
    if (!treffer || !(el.contains(treffer) || treffer.contains(el))) {
      /*
       * Der Name allein reicht nicht.
       *
       * Ein erster Lauf meldete sechsmal „verdeckt von a." – ein `<a>` ohne
       * Klasse, und damit war nicht herauszufinden, welches. Zum Suchen
       * braucht es den Ausschnitt und den Weg nach oben, nicht das Etikett.
       */
      let wer = 'nichts';
      if (treffer) {
        const weg = [];
        for (let p = treffer; p && weg.length < 4; p = p.parentElement) {
          weg.push(
            p.tagName.toLowerCase() +
              (typeof p.className === 'string' && p.className
                ? '.' + p.className.split(' ')[0]
                : ''),
          );
        }
        wer = `${weg.join(' in ')} („${(treffer.textContent || '').trim().slice(0, 24)}")`;
      }
      return { ok: false, grund: `verdeckt von ${wer}` };
    }

    el.click();
    return { ok: true };
  }, auswahl);
}

/**
 * Warten, bis ein Element seinen Platz gefunden hat.
 *
 * ── Warum nicht einfach länger warten ───────────────────────────────────
 *
 * Weil eine feste Zahl entweder zu kurz ist oder zu lang, und man erst
 * hinterher weiß, welches von beidem. `durchgang.mjs` wartete 400 ms nach
 * dem Scrollen – rechnerisch genug für 240 ms Übergang, in der Praxis nicht:
 * Bei vierzig Seitenaufrufen hintereinander verschiebt sich der Beginn des
 * Übergangs, und in fünf von zwanzig Fällen lag die Messung noch mitten
 * darin.
 *
 * Was dann gemeldet wurde, klang wie ein echter Fehler: „Standortwähler
 * nicht anklickbar – verdeckt von der Sprachwahl". Und es stimmte sogar für
 * den gemessenen Augenblick: Der kompakte Wähler war noch auf `max-width: 0`
 * zusammengeschoben, sein Symbol ragte darüber hinaus, und die Sprachwahl
 * daneben lag darüber. Nur war das ein Zustand von 200 Millisekunden Dauer
 * und keiner, in dem jemand klickt.
 *
 * Gewartet wird deshalb auf das, worauf es ankommt: zwei aufeinanderfolgende
 * Messungen mit demselben Kasten.
 */
export async function warteAufAngedockt(seite, soll = true) {
  /*
   * Zuerst der Zustand, dann die Ruhe.
   *
   * `warteAufRuhe` allein reicht nicht: Direkt nach dem Scrollen hat der
   * IntersectionObserver noch nicht ausgelöst, der Kasten steht also
   * unverändert da – und zwei gleiche Bilder heißen dann nicht „fertig",
   * sondern „noch nicht losgelaufen". Genau so hat die Prüfung achtmal
   * gemeldet, der eingeklappte Wähler nehme weiter den Fokus: Sie maß in
   * dem Moment, bevor sich überhaupt etwas bewegte.
   */
  await seite.waitForFunction(
    (s) => document.querySelector('.kopf')?.classList.contains('ist-angedockt') === s,
    soll,
    { timeout: 4000 },
  );
}

export async function warteAufRuhe(seite, auswahl, grenze = 2000) {
  return seite.evaluate(
    ([a, max]) =>
      new Promise((fertig) => {
        const beginn = performance.now();
        let vorher = null;
        const schauen = () => {
          const el = document.querySelector(a);
          const k = el ? el.getBoundingClientRect() : null;
          const jetzt = k ? `${Math.round(k.left)}/${Math.round(k.width)}/${Math.round(k.top)}` : '-';
          if (jetzt !== '-' && jetzt === vorher) return fertig(true);
          if (performance.now() - beginn > max) return fertig(false);
          vorher = jetzt;
          requestAnimationFrame(schauen);
        };
        requestAnimationFrame(schauen);
      }),
    [auswahl, grenze],
  );
}

/**
 * Rollen ohne weiche Bewegung.
 *
 * `scroll-behavior: smooth` steht global im Projekt und ist dort richtig.
 * Eine Prüfung, die 400 ms nach `scrollTo(0, 600)` misst, liest damit 556 –
 * und misst einen Zwischenstand.
 */
export async function scrollen(seite, y) {
  await seite.evaluate((ziel) => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, ziel);
  }, y);
}
