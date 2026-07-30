/**
 * Der Kopf im gescrollten Zustand: Ist etwas verschwunden, das man braucht?
 *
 * ── Warum es diese Prüfung gibt ─────────────────────────────────────────
 *
 * Zweimal ist derselbe Umbau schon schiefgegangen, und beide Male stand der
 * Grund hinterher als Kommentar in `Navigation.astro`:
 *
 *   1. Die Standortleiste klappte beim Scrollen zusammen. Der Standortwähler
 *      war danach unerreichbar – die eingeklappte Leiste trug
 *      `pointer-events: none`, und wer den Standort wechseln wollte, klickte
 *      ins Nichts.
 *   2. Also klappte nur noch die Adresse ein. Erreichbar, aber der Kopf blieb
 *      zweizeilig.
 *
 * Jetzt klappt die Leiste wieder ganz ein – und Standortwähler und
 * Sprachwahl stehen dafür oben. Das ist genau die Bauart, die beim ersten
 * Mal kaputt war. Der Unterschied ist nicht die Absicht, sondern dass es
 * diese Prüfung gibt.
 *
 * ── Was gemessen wird ───────────────────────────────────────────────────
 *
 * Im Browser, an der gebauten Seite, oben und gescrollt, in drei Breiten:
 *
 *   1. OBEN: die Leiste steht, die kompakten Bedienelemente nehmen keinen
 *      Platz und sind nicht fokussierbar.
 *   2. GESCROLLT: die Leiste ist auf null, der Wähler oben ist sichtbar,
 *      groß genug zum Treffen (24 px, WCAG 2.5.8) und lässt sich öffnen.
 *   3. GEÖFFNET: die Liste ist wirklich zu sehen – nicht geklippt, nicht
 *      hinter der Leiste. Ein `<details>`, das aufklappt und nichts zeigt,
 *      ist von einem kaputten Knopf nicht zu unterscheiden.
 *   4. Der Standort ist in JEDEM Zustand irgendwo lesbar – in der Leiste,
 *      unter der Wortmarke oder am Wähler oben.
 *   5. Kein seitlicher Überlauf, in keinem der beiden Zustände.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   OEFFENTLICHE_HOSTS=127.0.0.1 npm start &
 *   npm run kopf:pruefen
 */

import { chromium } from 'playwright';
import { kopfKlick, scrollen, warteAufRuhe, warteAufAngedockt } from './lib/kopf-klick.mjs';

const BASIS = process.env.BASIS ?? `http://127.0.0.1:${process.env.PORT ?? 4321}`;

/* Mit Standort und ohne – ohne Standort heißt der Wähler „Standort wählen"
   und es gibt keinen Ortsnamen unter der Marke. */
const SEITEN = [
  ['/berlin-charlottenburg/leistungen/', 'Standortseite', 'Kurfürstendamm'],
  ['/leistungen/', 'ohne Standort', null],
  ['/en/berlin-charlottenburg/team/', 'Standortseite (EN)', 'Kurfürstendamm'],
];

const BREITEN = [
  ['Telefon', 390, 844],
  ['Tablet', 780, 900],
  ['Schreibtisch', 1280, 900],
];

const MESSEN = (zustand) => {
  /* Die Hilfsfunktion steht IN der übertragenen Funktion, nicht daneben:
     Playwright überträgt Quelltext, kein Modulumfeld. Derselbe Fehler hat
     abschnitt-pruefen.mjs und kontrast-messen.mjs schon getroffen. */
  const sichtbar = (el) => {
    if (!el) return false;
    const s = getComputedStyle(el);
    const k = el.getBoundingClientRect();
    return (
      s.display !== 'none' &&
      s.visibility !== 'hidden' &&
      parseFloat(s.opacity) > 0.05 &&
      k.width > 1 &&
      k.height > 1
    );
  };

  const kopf = document.querySelector('.kopf');
  /*
   * Gemessen wird der äußere Kasten, nicht der innere.
   *
   * Der innere behält seine Polsterung – 17 px, gemessen –, wird aber vom
   * äußeren geklippt. Auf dem Schirm ist die Leiste weg; die 17 px sind
   * eine Eigenschaft des Kastenmodells, keine sichtbare Höhe. Der erste
   * Lauf dieser Prüfung hat genau das als Fehler gemeldet und wäre damit
   * eine Prüfung gewesen, die etwas anderes misst als das, was sie behauptet.
   *
   * Die Frage lautet: Wird der Kopf kürzer? Und die beantwortet der Kasten,
   * der die Höhe an den Kopf weitergibt.
   */
  const leiste = document.querySelector('.standortleiste');
  const wahlOben = document.querySelector('.ort-kompakt');
  const spracheOben = document.querySelector('.kopf-sprache');
  const spracheUnten = document.querySelector('.standortleiste-inner .sprachwahl');
  const ortUnterMarke = document.querySelector('.logo-ort');
  const wahlUnten = document.querySelector('.waehler');

  const kastenVon = (el) => {
    if (!el) return null;
    const k = el.getBoundingClientRect();
    return { w: Math.round(k.width), h: Math.round(k.height), oben: Math.round(k.top) };
  };

  /* Der Ortsname – egal wo er gerade steht. Sichtbar zählt, nicht vorhanden. */
  const ortSichtbarIn = [
    sichtbar(document.querySelector('.wo-bin-ich')) ? 'Leiste' : null,
    sichtbar(ortUnterMarke) ? 'unter der Marke' : null,
    sichtbar(wahlOben) ? 'am Wähler oben' : null,
  ].filter(Boolean);

  return {
    zustand,
    angedockt: kopf?.classList.contains('ist-angedockt') ?? false,
    leiste: { sichtbar: sichtbar(leiste), ...kastenVon(leiste) },
    wahlOben: { sichtbar: sichtbar(wahlOben), ...kastenVon(wahlOben?.querySelector('summary')) },
    spracheOben: { sichtbar: sichtbar(spracheOben), ...kastenVon(spracheOben) },
    spracheUnten: { sichtbar: sichtbar(spracheUnten) },
    wahlUnten: { sichtbar: sichtbar(wahlUnten) },
    ortSichtbarIn,
    /* Fokussierbar heißt: Man landet beim Tabben darin. Ein unsichtbares
       Bedienelement, das den Fokus nimmt, führt ins Leere. */
    fokussierbarOben: wahlOben
      ? !wahlOben.closest('[hidden]') && getComputedStyle(wahlOben).visibility !== 'hidden'
      : false,
    fokussierbarUnten: wahlUnten
      ? !wahlUnten.closest('[hidden]') && getComputedStyle(wahlUnten).visibility !== 'hidden'
      : false,
    ueberlauf: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
  };
};

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PFAD || '/opt/pw-browsers/chromium',
  args: ['--enable-unsafe-swiftshader'],
});

const befunde = [];
const melde = (wo, was) => befunde.push(`${wo}: ${was}`);
let aufrufe = 0;

for (const [breitenname, w, h] of BREITEN) {
  for (const [pfad, seitenname, ortsname] of SEITEN) {
    const wo = `${seitenname} · ${breitenname}`;
    const seite = await browser.newPage({ viewport: { width: w, height: h } });
    await seite.goto(BASIS + pfad, { waitUntil: 'networkidle' });

    /*
     * Der Auswahldialog steht davor – und er soll davor stehen.
     *
     * Der erste Lauf dieser Prüfung ist genau daran hängen geblieben: 57
     * Klickversuche auf den Standortwähler, alle abgefangen von
     * `<dialog open>`. Das ist kein Fehler der Navigation, sondern der
     * bewusste Vorrang der Einwilligung.
     *
     * Abgelehnt statt zugestimmt: Was hier gemessen wird, sind eigene
     * Bedienelemente, und die müssen ohne jede Einwilligung funktionieren.
     */
    await seite.evaluate(() => document.querySelector('[data-ew="ablehnen"]')?.click());
    await seite.evaluate(() => document.fonts.ready);
    await seite.waitForTimeout(200);

    if (await seite.evaluate(() => Boolean(document.querySelector('dialog[open]')))) {
      melde(wo, 'der Auswahldialog bleibt offen – alles Weitere misst ihn, nicht den Kopf');
      await seite.close();
      continue;
    }

    /* ── 1. Oben ────────────────────────────────────────────────────── */

    const oben = await seite.evaluate(MESSEN, 'oben');

    if (oben.angedockt) melde(wo, 'ganz oben schon angedockt – der Merker greift nicht');
    if (!oben.leiste.sichtbar) melde(wo, 'die Standortleiste fehlt schon ganz oben');
    if (oben.wahlOben.sichtbar) {
      melde(wo, `der kompakte Wähler steht schon oben (${oben.wahlOben.w} px breit)`);
    }
    if (oben.spracheOben.sichtbar) melde(wo, 'die Sprachwahl steht doppelt – oben und in der Leiste');
    if (oben.fokussierbarOben) melde(wo, 'der kompakte Wähler nimmt den Fokus, obwohl er unsichtbar ist');
    if (oben.ueberlauf > 0) melde(wo, `${oben.ueberlauf} px seitlicher Überlauf (oben)`);

    /*
     * Der Wähler in der Leiste – klappt seine Liste ins Bild?
     *
     * Sie ist bis 24 rem breit und rechtsbündig. Hing sie am Knopf statt an
     * der Pille, begann sie auf dem Telefon bei −199 px: Die Hälfte der
     * Standorte lag außerhalb des Bildschirms, zu sehen war ein
     * abgeschnittener Kasten. Aufgefallen ist das auf einem Foto vom
     * Gerät, nicht in einer Prüfung – deshalb steht es jetzt hier.
     */
    if (oben.wahlUnten.sichtbar) {
      await seite.evaluate(() => {
        const d = document.querySelector('.waehler');
        if (d) d.open = true;
      });
      await seite.waitForTimeout(250);

      const unterListe = await seite.evaluate(() => {
        const l = document.querySelector('.waehler .waehler-liste');
        if (!l) return null;
        const k = l.getBoundingClientRect();
        const mitte = document.elementFromPoint(
          Math.round(k.left + k.width / 2),
          Math.round(k.top + 20),
        );
        return {
          links: Math.round(k.left),
          rechts: Math.round(k.right),
          fenster: window.innerWidth,
          obenauf: Boolean(mitte) && l.contains(mitte),
          eintraege: l.querySelectorAll('.waehler-link').length,
        };
      });

      if (!unterListe) melde(wo, 'der Wähler in der Leiste hat keine Liste');
      else {
        if (unterListe.links < -1) {
          melde(wo, `die Liste in der Leiste beginnt bei ${unterListe.links} px – links aus dem Bild`);
        }
        if (unterListe.rechts > unterListe.fenster + 1) {
          melde(
            wo,
            `die Liste in der Leiste endet bei ${unterListe.rechts} px – rechts aus dem Bild ` +
              `(Fenster ${unterListe.fenster})`,
          );
        }
        if (!unterListe.obenauf) melde(wo, 'die Liste in der Leiste ist offen, aber verdeckt');
        if (unterListe.eintraege !== 4) {
          melde(wo, `${unterListe.eintraege} Standorte in der Leistenliste statt 4`);
        }
      }

      await seite.evaluate(() => {
        const d = document.querySelector('.waehler');
        if (d) d.open = false;
      });
      await seite.waitForTimeout(120);
    }

    /* ── 2. Gescrollt ───────────────────────────────────────────────── */

    await scrollen(seite, 600);
    /*
     * Auf Ruhe warten statt auf eine geratene Zahl – Begründung in
     * scripts/lib/kopf-klick.mjs.
     *
     * Und zwar auf BEIDE Bewegungen. Der erste Versuch wartete nur auf den
     * kompakten Wähler; der steht früher als die Leiste, und die Prüfung
     * meldete daraufhin „die Leiste klappt nicht ganz ein (4 px)" und
     * „der eingeklappte Wähler nimmt weiter den Fokus". Beides stimmte für
     * den gemessenen Augenblick und für keinen danach.
     *
     * Der Nachschlag von 120 ms gilt der Sichtbarkeit: Sie schaltet mit
     * `step-end` am Ende des Übergangs, also einen Wimpernschlag nachdem
     * der Kasten seine Endhöhe erreicht hat.
     */
    /*
     * Reihenfolge: erst der Zustand, dann die Dauer, dann die Ruhe.
     *
     * Die Klasse ist der einzige verlässliche Startschuss – vorher bewegt
     * sich nichts, und „zwei gleiche Bilder" heißt dann nicht fertig,
     * sondern noch nicht losgelaufen. Die 400 ms decken den Übergang von
     * 240 ms samt Verzögerung beim Anlauf; `warteAufRuhe` fängt danach ab,
     * was auf langsamen Läufen länger braucht.
     */
    await warteAufAngedockt(seite, true);
    await seite.waitForTimeout(400);
    await warteAufRuhe(seite, '.standortleiste');
    await warteAufRuhe(seite, '.ort-kompakt');

    const unten = await seite.evaluate(MESSEN, 'gescrollt');

    if (!unten.angedockt) {
      melde(wo, 'nach 600 px Scrollen nicht angedockt – der Rest der Prüfung misst nichts');
    }
    if (unten.leiste.h > 2) {
      melde(wo, `die Leiste klappt nicht ganz ein (${unten.leiste.h} px hoch)`);
    }
    if (unten.fokussierbarUnten) {
      melde(wo, 'der eingeklappte Wähler nimmt weiter den Fokus – Tabben führt ins Nichts');
    }
    if (!unten.wahlOben.sichtbar) {
      melde(wo, 'gescrollt gibt es keinen Standortwähler mehr – genau der Fehler von damals');
    } else if (unten.wahlOben.h < 24) {
      /* WCAG 2.5.8, Stufe AA: 24 × 24 CSS-Pixel Zielgröße. */
      melde(wo, `der Wähler oben ist nur ${unten.wahlOben.h} px hoch, nötig sind 24`);
    }
    if (unten.ortSichtbarIn.length === 0) {
      melde(wo, 'gescrollt steht nirgends mehr, in welcher Praxis man ist');
    }
    if (unten.ueberlauf > 0) melde(wo, `${unten.ueberlauf} px seitlicher Überlauf (gescrollt)`);

    /* Die Sprachwahl gehört oben hin – aber nur, wo sie hingehört: Auf
       schmalen Geräten steht sie im Mobilmenü, das ist eine bewusste
       Entscheidung und kein Verlust. */
    if (w > 832 && !unten.spracheOben.sichtbar) {
      melde(wo, 'gescrollt fehlt die Sprachwahl im Kopf');
    }

    /* ── 3. Aufklappen ──────────────────────────────────────────────── */

    if (unten.wahlOben.sichtbar) {
      const auf = await kopfKlick(seite, '.ort-kompakt > summary');
      if (!auf.ok) melde(wo, `der Wähler oben ist nicht anklickbar: ${auf.grund}`);
      await seite.waitForTimeout(250);

      const liste = await seite.evaluate(() => {
        const el = document.querySelector('.ort-kompakt .waehler-liste');
        if (!el) return { da: false };
        const k = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        /* Wirklich zu sehen: nicht nur im Baum, sondern im Sichtfeld und
           an dieser Stelle auch oben auf. `elementFromPoint` beantwortet
           genau die Frage, die ein Mensch stellt: Sehe ich das? */
        const mitte = document.elementFromPoint(
          Math.round(k.left + k.width / 2),
          Math.round(k.top + 20),
        );
        return {
          da: true,
          w: Math.round(k.width),
          h: Math.round(k.height),
          imBild: k.top >= 0 && k.bottom <= window.innerHeight + 200 && k.left >= 0,
          sichtbar: s.visibility !== 'hidden' && s.display !== 'none',
          obenauf: !!mitte && el.contains(mitte),
          eintraege: el.querySelectorAll('.waehler-link').length,
        };
      });

      if (!liste.da) melde(wo, 'der Wähler oben hat gar keine Liste');
      else {
        if (liste.h < 40 || liste.w < 40) {
          melde(wo, `die Liste klappt auf, misst aber nur ${liste.w}×${liste.h} px – geklippt`);
        }
        if (!liste.obenauf) melde(wo, 'die Liste ist offen, aber etwas liegt darüber');
        if (liste.eintraege !== 4) melde(wo, `${liste.eintraege} Standorte in der Liste statt 4`);
        if (!liste.imBild) melde(wo, 'die Liste klappt aus dem Sichtfeld heraus');
      }

      /* Und wieder zu – ein Wähler, der offen bleibt, verdeckt die Seite. */
      await kopfKlick(seite, '.ort-kompakt > summary');
      await seite.waitForTimeout(200);
      const zu = await seite.evaluate(
        () => !document.querySelector('.ort-kompakt')?.hasAttribute('open'),
      );
      if (!zu) melde(wo, 'der Wähler oben lässt sich nicht wieder schließen');

      /*
       * Klick daneben, Escape, Fokuswechsel – die drei Wege hinaus.
       *
       * Sie sind für die Leiste seit Langem gebaut, hörten aber nur auf
       * `.waehler`. Der kompakte Wähler blieb damit offen liegen, sobald
       * man woanders hinklickte. Gefunden wurde das nicht hier, sondern
       * beim Lesen – deshalb steht es jetzt in einer Prüfung.
       */
      for (const [name, raus] of [
        /*
         * `body.click()` und nicht `mouse.click(10, …)`.
         *
         * Der erste Anlauf klickte auf einen Punkt am linken Rand – und traf
         * dort einen Verweis. Die Prüfung wechselte die Seite, landete oben,
         * der Kopf war nicht mehr angedockt, und der nächste Klick lief in
         * einen Timeout. Gemessen hätte sie dann, dass ein Verweis
         * funktioniert.
         *
         * Geprüft werden soll: Ein Klick, der NICHT im Wähler liegt,
         * schließt ihn. Genau das sagt ein Klick auf `body`.
         */
        ['Klick daneben', () => seite.evaluate(() => document.body.click())],
        ['Escape', () => seite.keyboard.press('Escape')],
      ]) {
        await kopfKlick(seite, '.ort-kompakt > summary');
        await seite.waitForTimeout(150);
        await raus();
        await seite.waitForTimeout(200);
        const offenGeblieben = await seite.evaluate(() =>
          Boolean(document.querySelector('.ort-kompakt[open]')),
        );
        if (offenGeblieben) melde(wo, `der Wähler oben bleibt nach "${name}" offen`);
      }
    }

    /* ── 4. Zurück nach oben: der Weg muss in beide Richtungen gehen ── */

    await scrollen(seite, 0);
    await warteAufAngedockt(seite, false);
    await seite.waitForTimeout(400);
    await warteAufRuhe(seite, '.standortleiste');
    const zurueck = await seite.evaluate(MESSEN, 'zurück oben');
    if (zurueck.angedockt) melde(wo, 'oben angekommen und immer noch angedockt');
    if (!zurueck.leiste.sichtbar) melde(wo, 'die Leiste kommt nicht zurück');

    /* Der Ortsname darf nicht doppelt dastehen – das war der Grund, warum er
       überhaupt unter die Marke gewandert ist. */
    if (ortsname && zurueck.ortSichtbarIn.length > 1 && w > 832) {
      melde(wo, `der Ort steht doppelt: ${zurueck.ortSichtbarIn.join(' und ')}`);
    }

    aufrufe++;
    await seite.close();
  }
}

/* ── 5. Das große Behandlungsmenü ──────────────────────────────────────
 *
 * Es hängt an der Menüliste, die Glaspille ist aber ein anderer Kasten – und
 * zwischen beiden liegt die Standortleiste, die beim Scrollen einklappt. Der
 * Abstand steht deshalb als Zahl im Stilteil, einmal je Zustand. Zahlen im
 * Stilteil driften; diese hier nicht.
 */

const MEGA_SEITEN = [
  ['/potsdam/', 'Standort'],
  ['/en/potsdam/', 'Standort (EN)'],
  ['/fr/potsdam/', 'Standort (FR)'],
  ['/leistungen/', 'ohne Standort'],
];

for (const [pfad, name] of MEGA_SEITEN) {
  for (const breite of [1200, 1440, 1920]) {
    const wo = `Mega · ${name} · ${breite}px`;
    const seite = await browser.newPage({ viewport: { width: breite, height: 950 } });
    await seite.goto(BASIS + pfad, { waitUntil: 'networkidle' });
    await seite.evaluate(() => document.querySelector('[data-ew="ablehnen"]')?.click());
    await seite.evaluate(() => document.fonts.ready);
    await seite.waitForTimeout(200);
    aufrufe++;

    if (!(await seite.$('.mega'))) {
      melde(wo, 'kein großes Behandlungsmenü im Kopf');
      await seite.close();
      continue;
    }

    for (const zustand of ['oben', 'gescrollt']) {
      if (zustand === 'gescrollt') {
        await scrollen(seite, 900);
        await warteAufAngedockt(seite, true);
        await seite.waitForTimeout(400);
        await warteAufRuhe(seite, '.standortleiste');
      }

      const auf = await kopfKlick(seite, '.mega > summary');
      if (!auf.ok) {
        melde(wo, `das Menü lässt sich ${zustand} nicht öffnen: ${auf.grund}`);
        continue;
      }
      await seite.waitForTimeout(250);

      const m = await seite.evaluate(() => {
        const feld = document.querySelector('.mega-feld');
        const pille = document.querySelector('.kopf-glas');
        if (!feld || !pille) return null;
        const f = feld.getBoundingClientRect();
        const p = pille.getBoundingClientRect();
        const mitte = document.elementFromPoint(
          Math.round(f.left + f.width / 2),
          Math.round(f.top + 30),
        );
        return {
          offen: Boolean(document.querySelector('.mega[open]')),
          luft: Math.round(f.top - p.bottom),
          rechts: Math.round(f.right),
          fenster: window.innerWidth,
          hoehe: Math.round(f.height),
          verweise: document.querySelectorAll('.mega-block a').length,
          bereiche: document.querySelectorAll('.mega-block').length,
          alle: Boolean(document.querySelector('.mega-alle')),
          obenauf: Boolean(mitte) && feld.contains(mitte),
          ueberlauf: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
        };
      });

      if (!m) {
        melde(wo, `das Feld fehlt ${zustand} im Baum`);
        continue;
      }
      if (!m.offen) melde(wo, `das Menü klappt ${zustand} nicht auf`);

      /*
       * Das Feld setzt an der Unterkante der Pille an – nicht darin.
       *
       * Negativ heißt: Es liegt über der Standortleiste und verdeckt genau
       * die Angabe, in welcher Praxis man gerade ist. Mehr als 16 px heißt:
       * Es schwebt frei und gehört sichtbar nicht mehr zum Kopf.
       */
      if (m.luft < 0 || m.luft > 16) {
        melde(wo, `das Feld sitzt ${zustand} ${m.luft} px unter der Pille (erlaubt 0 bis 16)`);
      }
      if (m.rechts > m.fenster) {
        melde(wo, `das Feld steht ${zustand} ${m.rechts - m.fenster} px über den rechten Rand`);
      }
      if (m.ueberlauf > 0) melde(wo, `${m.ueberlauf} px seitlicher Überlauf (${zustand}, offen)`);
      if (!m.obenauf) melde(wo, `etwas liegt ${zustand} über dem geöffneten Feld`);
      if (!m.alle) melde(wo, 'der Weg auf die Übersichtsseite fehlt im Feld');
      if (m.bereiche < 8) melde(wo, `nur ${m.bereiche} Bereiche im Feld`);
      if (m.verweise < 20) melde(wo, `nur ${m.verweise} Behandlungen im Feld`);

      await kopfKlick(seite, '.mega > summary');
      await seite.waitForTimeout(150);
    }

    await seite.close();
  }
}

/* ── 6. Der angedockte Kopf über alle Schreibtischbreiten ──────────────
 *
 * Zwei Bedienelemente sind dazugekommen, und sie brauchen Platz, den es
 * nicht überall gibt. Wo er fehlt, weichen Telefonnummer und Lupe; wo auch
 * das nicht reicht, übernimmt der Menüknopf. Beide Grenzen stehen als Zahl
 * im Stilteil – hier werden sie nachgemessen, auf Deutsch UND auf
 * Französisch, weil dort dieselben Punkte 79 px mehr brauchen.
 */

const BREITENLAUF = [390, 780, 1000, 1088, 1184, 1185, 1300, 1344, 1345, 1440, 1920];

for (const pfad of ['/potsdam/', '/fr/potsdam/']) {
  for (const breite of BREITENLAUF) {
    const wo = `Breitenlauf · ${pfad} · ${breite}px`;
    const seite = await browser.newPage({ viewport: { width: breite, height: 950 } });
    await seite.goto(BASIS + pfad, { waitUntil: 'networkidle' });
    await seite.evaluate(() => document.querySelector('[data-ew="ablehnen"]')?.click());
    await seite.waitForTimeout(150);
    await scrollen(seite, 900);
    await warteAufAngedockt(seite, true);
    await seite.waitForTimeout(400);
    aufrufe++;

    const r = await seite.evaluate(() => {
      const sicht = (auswahl) => {
        const el = document.querySelector(auswahl);
        if (!el) return false;
        const s = getComputedStyle(el);
        return s.display !== 'none' && s.visibility !== 'hidden' &&
          el.getBoundingClientRect().width > 1;
      };
      return {
        ueberlauf: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
        sprache: sicht('.kopf-sprache'),
        pin: sicht('.ort-kompakt'),
        menue: sicht('.menue-knopf'),
      };
    });

    if (r.ueberlauf > 0) melde(wo, `${r.ueberlauf} px seitlicher Überlauf im angedockten Kopf`);
    if (!r.pin) melde(wo, 'kein Standortwähler im angedockten Kopf');
    /* Die Sprachwahl darf im Menüknopf stecken – aber nicht nirgends. */
    if (!r.sprache && !r.menue) melde(wo, 'angedockt weder Sprachwahl noch Menüknopf');

    await seite.close();
  }
}

await browser.close();

console.log(`[kopf] ${aufrufe} Seitenaufrufe – oben, gescrollt, aufgeklappt und zurück`);

if (befunde.length === 0) {
  console.log(
    '[kopf] Die Leiste klappt ganz ein, Standortwähler und Sprachwahl stehen\n' +
      '       dann oben, die Liste klappt sichtbar auf, und der Ort steht in\n' +
      '       jedem Zustand genau einmal da. Das große Behandlungsmenü setzt\n' +
      '       an der Pille an und passt in jeder geprüften Breite ins Fenster –\n' +
      '       auf Deutsch wie auf Französisch.',
  );
  process.exit(0);
}

console.error(`\n[kopf] ${befunde.length} Befund(e):`);
for (const b of befunde) console.error(`    ${b}`);
console.error(
  '\n[kopf] ABBRUCH: Ein Bedienelement, das nur ganz oben auf der Seite\n' +
    '       funktioniert, ist kaputt – nur nicht immer. Genau daran ist\n' +
    '       dieser Umbau schon zweimal gescheitert.',
);
process.exit(1);
