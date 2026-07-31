#!/usr/bin/env node
/**
 * Passt der Einwilligungsplatzhalter in seinen eigenen Kasten?
 *
 * ── Warum es diesen Wächter gibt ────────────────────────────────────────
 *
 * An einem einzigen Tag ist dieselbe Sache dreimal per Bildschirmfoto
 * gemeldet worden – jedes Mal als „das Video ist kaputt", „die Karte lädt
 * nicht", „da ist nur ein schwarzer Kasten". Kaputt war nie der Fremdinhalt.
 * Kaputt war unser eigener Platzhalter: Sein Inhalt passte nicht in die
 * Fläche, die für ihn vorgesehen war, und was nicht hineinpasste, hat
 * `overflow: hidden` weggeschnitten. Übrig blieb dunkler Grund.
 *
 * Die drei Fassungen desselben Fehlers, alle nachgemessen und alle in
 * `Drittinhalt.astro` als Kommentar festgehalten:
 *
 *   1. Die Frage lag `position: absolute` in einer Fläche mit festem
 *      `aspect-ratio`. Absolut liegende Kinder tragen nichts zur Höhe bei.
 *      Bei 362 px Breite sind 16:9 genau 204 px – darin sollten Titel,
 *      Erklärsatz, eine Schaltfläche mit dem vollen Videotitel und die
 *      Zeile zum Verzeichnis stehen. Die Schaltfläche lief links und
 *      rechts aus dem Kasten, vom Titel blieb die untere Hälfte.
 *   2. Die Rasterspalte stand auf `auto` und übernahm damit die
 *      max-content-Breite von `.dritt-text` (558 px) in einem 356 px
 *      breiten Kasten.
 *   3. Der `iframe` entsteht erst im Browser und kann Astros Bereichs-
 *      merkmal nie tragen. Die Regeln für ihn liefen deshalb ins Leere: Er
 *      fiel auf die Browservorgabe 304×154 px zurück, öffnete mangels
 *      `grid-area` eine zweite Rasterzeile, der Kasten wuchs von 225 auf
 *      375,2 px – und 66 % davon waren leerer dunkler Grund.
 *
 * Zweimal wurde die Einzelstelle repariert, nicht die Fehlerklasse. Das ist
 * der eigentliche Anlass: Der Fehler ist nicht ein Tippfehler an einer
 * Stelle, sondern eine Eigenschaft dieser Bauart. Ein Kasten, dessen Höhe
 * aus einem Seitenverhältnis kommt, und ein Inhalt, dessen Länge aus der
 * Redaktion kommt (der Videotitel steht auf der Schaltfläche!) und aus der
 * Übersetzung (französische Beschriftungen sind länger) – die beiden Zahlen
 * treffen sich nirgends, außer auf dem Bildschirm.
 *
 * Und niemand sieht es: Auf dem Schreibtisch ist der Kasten 700 px breit
 * und alles passt. Der Fehler existiert nur unterhalb von etwa 420 px.
 *
 * ── Was gemessen wird ───────────────────────────────────────────────────
 *
 * Im Browser, an der gebauten Seite, bei 320, 360, 402 und 1280 px:
 *
 *   1. VOR der Zustimmung – ragt irgendein Kind der Frage über die Fläche
 *      hinaus? Gemessen wird jedes Kind einzeln gegen die vier Kanten von
 *      `.dritt-flaeche`, dazu der verdeckte Überstand der Fläche selbst
 *      (`scrollHeight − clientHeight`). Genau diese Zahl war bei Fassung 1
 *      dreistellig.
 *   2. Die Zustimmen-Schaltfläche: vollständig im Kasten, nicht verdeckt
 *      (nachgesehen mit `elementFromPoint` an drei Punkten) und mindestens
 *      44 px hoch – WCAG 2.5.5. Ein Knopf, den man nicht trifft, ist so
 *      gut wie keiner.
 *   3. Der Titel: vollständig im Kasten und in seinem eigenen Rahmen nicht
 *      abgeschnitten. Er ist das Einzige, was vor der Zustimmung sagt, was
 *      dort liegt.
 *   4. NACH dem Klick auf Zustimmen – ist die Frage wirklich verschwunden,
 *      steht ein `iframe` an ihrer Stelle, und füllt der den Kasten? Und
 *      wächst der Kasten dabei nicht (die Frage fällt weg, er kann nur
 *      kleiner werden – wird er größer, hat der Rahmen eine zweite
 *      Rasterzeile geöffnet: Fassung 3).
 *
 * ── Was ausdrücklich KEIN Fehler ist ────────────────────────────────────
 *
 * Ob der Fremdinhalt lädt. Auf einem Bauläufer ist YouTube nicht erreichbar,
 * und das soll diesen Wächter nicht rot färben – er würde sonst abgeschaltet
 * und wäre damit wertlos. Geprüft wird deshalb ausschließlich, was uns
 * gehört: die Maße UNSERES Kastens und die Maße des `iframe`-Elements. Ein
 * `iframe`, der 100 % × 100 % misst und nichts anzeigt, ist hier grün –
 * dann liegt es am Netz, nicht am Bauteil. Deshalb wird nach dem Klick auch
 * nicht auf Netzruhe gewartet, sondern auf eine feste Zeitspanne.
 *
 * ── Welche Seiten ───────────────────────────────────────────────────────
 *
 * Nicht alle mit einer Einbettung – das sind 63 von 1.555 gebauten Seiten,
 * und sie sagen zu 90 % dasselbe. Gesucht wird im Bauergebnis nach jedem
 * `data-dienst`, und je Dienst und Sprache wird EINE Seite geprüft: die mit
 * dem LÄNGSTEN Titel. Das ist keine Willkür, sondern der Kern der Sache –
 * der Titel steht auf der Schaltfläche und ist die Größe, die den Kasten
 * sprengt. Wer den schlimmsten Fall prüft, prüft alle.
 *
 * Die Liste steht deshalb nirgends in dieser Datei. Kommt ein vierter Dienst
 * dazu, wird er ohne Zutun mitgeprüft; verschwindet einer, verschwindet er
 * auch hier. Zwei gepflegte Listen laufen auseinander, eine abgeleitete
 * nicht.
 *
 * ── Warum er NICHT in der Baukette hängt ────────────────────────────────
 *
 * Aus demselben Grund wie `layout:pruefen`, `kopf:pruefen`, `abschnitt:pruefen`
 * und `klickpfad`: Er braucht einen laufenden Server und Chromium. `npm run
 * build` baut erst das, was er prüfen soll – in der Kette gäbe es zum
 * Zeitpunkt seines Laufs noch keinen Server, gegen den er messen könnte.
 * Er steht deshalb wie die anderen Browser-Wächter als eigener Aufruf da,
 * und `.github/workflows/waechter.yml` nennt ihn in der Liste dessen, was
 * dort ausdrücklich nicht läuft.
 *
 * Das ist NICHT die Bemerkung „er ist gerade rot, deshalb bleibt er draußen".
 * Er ist grün, und zwar auf allen neun geprüften Seiten in allen vier
 * Breiten – nachgemessen. Wer ihn eines Tages in die Kette hängen will,
 * braucht zuerst einen Schritt, der den Server startet; die Wächterei ist
 * dann keine Frage mehr des guten Willens.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   npm run build:schnell
 *   OEFFENTLICHE_HOSTS=127.0.0.1 npm start &
 *   npm run einbettung:pruefen
 *
 * Endet mit Rückgabewert 1, sobald etwas gefunden wurde – mit den gemessenen
 * Zahlen, damit man weiß, wie weit es daneben liegt und nicht nur, DASS.
 *
 * ── Gegenprobe ──────────────────────────────────────────────────────────
 *
 * Ein Wächter, der nie angeschlagen hat, ist eine Vermutung. Dieser hier hat
 * dreimal angeschlagen, jedes Mal an einem absichtlich eingebauten Fehler,
 * der danach wieder zurückgebaut wurde:
 *
 *   1. `.dritt-flaeche { height: 120px }` – 414 Befunde. Der Kasten schnitt
 *      241 px seines eigenen Inhalts ab, die Schaltfläche stand 81 px
 *      darunter und war an 3 von 3 Messpunkten von `figcaption.dritt-fuss`
 *      verdeckt.
 *   2. `:global` an der Rahmenregel entfernt, also genau Fassung 3 von oben –
 *      113 Befunde, darunter „iframe 304×154 px in einem Kasten von
 *      230×508 px" und „der Kasten ist von 361,3 auf 508 px gewachsen".
 *      Das sind die Zahlen aus dem Kommentar in `Drittinhalt.astro`.
 *   3. Die Schaltfläche auf 18,8 px Höhe geschrumpft – 48 Befunde, und zwar
 *      NUR die zur Trefferfläche. Ein Wächter muss auch schweigen können.
 */

import { chromium } from 'playwright';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { nurNotwendiges } from './lib/einwilligung-abwaehlen.mjs';

const WURZEL = path.resolve(import.meta.dirname, '..');
const DIST = path.join(WURZEL, 'dist', 'client');
const BASIS = process.env.BASIS ?? `http://127.0.0.1:${process.env.PORT ?? 4321}`;

/*
 * Die vier Breiten.
 *
 * 320 ist die schmalste Breite, die noch vorkommt (iPhone SE der ersten
 * Reihe, und jedes Telefon im geteilten Bild). 360 ist das Android-
 * Mittelfeld, 402 das aktuelle iPhone. 1280 ist der Gegenbeweis: Dort war
 * nie etwas zu sehen – wenn der Wächter dort ebenfalls anschlägt, ist der
 * Fehler kein Platzproblem, sondern ein Baufehler.
 */
const BREITEN = [
  ['320 px', 320, 720],
  ['360 px', 360, 800],
  ['402 px', 402, 874],
  ['1280 px', 1280, 900],
];

/** Subpixel. Ein halbes Pixel Überstand ist eine Rundung, kein Befund. */
const TOLERANZ = 1;

/** WCAG 2.5.5 „Target Size": 44 × 44 CSS-Pixel. */
const MINDESTHOEHE = 44;

/** Wie weit `iframe` und Kasten auseinanderliegen dürfen. */
const RAHMEN_TOLERANZ = 2;

/* ── Die Seiten aus dem Bauergebnis holen ─────────────────────────────── */

if (!existsSync(DIST)) {
  console.error('[einbettung] dist/client fehlt – bitte zuerst bauen.');
  process.exit(1);
}

/** Alle gebauten HTML-Dateien, rekursiv. */
function htmlDateien(verzeichnis) {
  const raus = [];
  for (const eintrag of readdirSync(verzeichnis, { withFileTypes: true })) {
    const voll = path.join(verzeichnis, eintrag.name);
    if (eintrag.isDirectory()) raus.push(...htmlDateien(voll));
    else if (eintrag.name.endsWith('.html')) raus.push(voll);
  }
  return raus;
}

/** `dist/client/en/potsdam/index.html` → `/en/potsdam/` */
function pfadVon(datei) {
  const rel = path.relative(DIST, datei).replace(/\\/g, '/');
  return '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '/');
}

/** `/en/potsdam/` → `en`; deutsch hat kein Präfix und heißt hier `de`. */
function spracheVon(pfad) {
  const erstes = pfad.split('/')[1] ?? '';
  return /^(en|fr)$/.test(erstes) ? erstes : 'de';
}

const FIGUR = /<figure class="dritt"[^>]*?data-dienst="([^"]+)"[^>]*?data-titel="([^"]*)"/g;

/** Aus `&amp;` wieder `&` machen – nur für die Längenmessung nötig. */
const entwirren = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

/** Schlüssel `dienst·sprache` → beste Seite (längster Titel). */
const auswahl = new Map();
let seitenMitEinbettung = 0;
let einbettungenGesamt = 0;

for (const datei of htmlDateien(DIST)) {
  const inhalt = readFileSync(datei, 'utf8');
  if (!inhalt.includes('class="dritt"')) continue;
  seitenMitEinbettung++;

  const pfad = pfadVon(datei);
  const sprache = spracheVon(pfad);

  for (const treffer of inhalt.matchAll(FIGUR)) {
    einbettungenGesamt++;
    const dienst = treffer[1];
    const laenge = entwirren(treffer[2]).length;
    const schluessel = `${dienst}·${sprache}`;
    const bisher = auswahl.get(schluessel);
    /* Längster Titel gewinnt; bei Gleichstand der kürzere Pfad, damit die
       Auswahl zwischen zwei Läufen dieselbe bleibt. */
    if (
      !bisher ||
      laenge > bisher.laenge ||
      (laenge === bisher.laenge && pfad.length < bisher.pfad.length)
    ) {
      auswahl.set(schluessel, { dienst, sprache, pfad, laenge });
    }
  }
}

const SEITEN = [...auswahl.values()].sort(
  (a, b) => a.dienst.localeCompare(b.dienst) || a.sprache.localeCompare(b.sprache),
);

if (!SEITEN.length) {
  console.error(
    '[einbettung] Keine einzige Einbettung im Bauergebnis gefunden.\n' +
      '             Entweder ist `dist/client` veraltet, oder `Drittinhalt.astro`\n' +
      '             schreibt kein `class="dritt"` mehr – dann prüft dieser Wächter\n' +
      '             seit diesem Umbau nichts und muss nachgezogen werden.',
  );
  process.exit(1);
}

console.log(
  `[einbettung] ${einbettungenGesamt} Einbettungen auf ${seitenMitEinbettung} Seiten – ` +
    `geprüft werden ${SEITEN.length} davon (je Dienst und Sprache die mit dem längsten Titel):`,
);
for (const s of SEITEN) {
  console.log(`             ${s.dienst.padEnd(13)} ${s.sprache}  ${s.pfad}  (Titel ${s.laenge} Zeichen)`);
}

/* ── Die Messung im Browser ───────────────────────────────────────────── */

/*
 * Die Hilfsfunktionen stehen IN der übertragenen Funktion, nicht daneben.
 * Playwright überträgt Quelltext, kein Modulumfeld – derselbe Fehler hat
 * `abschnitt-pruefen.mjs` und `kontrast-messen.mjs` schon getroffen.
 */
const MESSEN = (nummer) => {
  const rund = (n) => Math.round(n * 10) / 10;

  const figur = document.querySelectorAll('.dritt')[nummer];
  if (!figur) return null;

  const flaeche = figur.querySelector('.dritt-flaeche');
  if (!flaeche) return { fehlt: 'flaeche' };
  const f = flaeche.getBoundingClientRect();

  const frage = figur.querySelector('[data-rolle="frage"]');
  const titel = figur.querySelector('.dritt-titel');
  const knopf = figur.querySelector('[data-rolle="freigeben"]');
  const rahmen = flaeche.querySelector('iframe.dritt-rahmen');

  /** Wie weit ragt `el` über die vier Kanten der Fläche hinaus? Positiv = raus. */
  const ueberstand = (el) => {
    const r = el.getBoundingClientRect();
    return {
      links: rund(f.left - r.left),
      rechts: rund(r.right - f.right),
      oben: rund(f.top - r.top),
      unten: rund(r.bottom - f.bottom),
      breite: rund(r.width),
      hoehe: rund(r.height),
    };
  };

  /** Name eines Elements für die Meldung – ohne Astros Bereichsmerkmal. */
  const name = (el) => {
    if (!el) return '(nichts)';
    const klassen =
      typeof el.className === 'string' && el.className.trim()
        ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
        : '';
    return el.tagName.toLowerCase() + klassen;
  };

  /**
   * Liegt an dieser Stelle wirklich `el` obenauf? `elementFromPoint` liefert
   * bei einem `iframe` das Element selbst und steigt nicht in fremden
   * Inhalt hinein – genau das wird hier gebraucht.
   */
  const obenauf = (el, x, y) => {
    if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) {
      return { ok: false, wer: '(außerhalb des Fensters)' };
    }
    const ziel = document.elementFromPoint(Math.round(x), Math.round(y));
    return { ok: Boolean(ziel) && (ziel === el || el.contains(ziel)), wer: name(ziel) };
  };

  /* Drei Punkte auf der Mittellinie – die Ecken bleiben außen vor, dort
     liegen abgerundete Kanten und der schwebende Berater. */
  const dreiPunkte = (el) => {
    const r = el.getBoundingClientRect();
    const y = r.top + r.height / 2;
    return [0.25, 0.5, 0.75].map((anteil) => obenauf(el, r.left + r.width * anteil, y));
  };

  return {
    dienst: figur.dataset.dienst,
    titelText: figur.dataset.titel || '',
    flaeche: {
      breite: rund(f.width),
      hoehe: rund(f.height),
      /* Der verdeckte Überstand: Was hier steht, ist weggeschnitten und
         war der Kern von Fassung 1. */
      verdecktHoch: flaeche.scrollHeight - flaeche.clientHeight,
      verdecktBreit: flaeche.scrollWidth - flaeche.clientWidth,
    },
    frageDa: Boolean(frage),
    /* Jedes Kind der Frage einzeln – „irgendwo läuft etwas raus" hilft
       niemandem, „die Schaltfläche 31 px nach rechts" schon. */
    kinder: frage
      ? [...frage.children].map((k) => ({
          name: name(k),
          text: (k.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 46),
          ...ueberstand(k),
        }))
      : [],
    frage: frage ? ueberstand(frage) : null,
    titel: titel
      ? {
          text: (titel.textContent || '').trim(),
          ...ueberstand(titel),
          /* Im eigenen Rahmen abgeschnitten – unabhängig vom Kasten. */
          verdeckt: titel.scrollHeight - titel.clientHeight,
          punkte: dreiPunkte(titel),
        }
      : null,
    knopf: knopf
      ? {
          text: (knopf.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 46),
          ...ueberstand(knopf),
          punkte: dreiPunkte(knopf),
        }
      : null,
    /* Ohne AV-Vertrag gibt es bewusst keine Schaltfläche – dann ist ihr
       Fehlen kein Befund, sondern der Zustand. */
    gesperrt: Boolean(frage) && !knopf,
    rahmen: rahmen
      ? {
          ...ueberstand(rahmen),
          punkte: dreiPunkte(rahmen),
        }
      : null,
    vorschauDa: Boolean(figur.querySelector('.dritt-vorschau')),
  };
};

/* ── Der Lauf ─────────────────────────────────────────────────────────── */

const befunde = [];
const melde = (wo, text) => befunde.push({ wo, text });

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PFAD || '/opt/pw-browsers/chromium',
  args: ['--enable-unsafe-swiftshader'],
});

let aufrufe = 0;
let kaesten = 0;

for (const seiteninfo of SEITEN) {
  for (const [breitenname, breite, hoehe] of BREITEN) {
    const wo = `${seiteninfo.dienst} · ${seiteninfo.pfad} · ${breitenname}`;

    /* Eine neue Seite ist ein neuer Kontext und damit ein leerer
       `localStorage`. Das ist hier keine Sauberkeit um ihrer selbst willen:
       Der Klick auf „Zustimmen" merkt die Kategorie, und beim nächsten
       Aufruf stünde der Kasten sonst schon geladen da – den Zustand VOR
       der Zustimmung gäbe es dann nie wieder zu sehen. */
    const seite = await browser.newPage({
      viewport: { width: breite, height: hoehe },
      locale: 'de-DE',
      reducedMotion: 'reduce',
    });

    let antwort;
    try {
      antwort = await seite.goto(BASIS + seiteninfo.pfad, {
        waitUntil: 'networkidle',
        timeout: 20000,
      });
    } catch (fehler) {
      melde(wo, `Seite nicht erreichbar: ${String(fehler).split('\n')[0]}`);
      await seite.close();
      continue;
    }
    aufrufe++;

    if (!antwort?.ok()) {
      melde(wo, `HTTP ${antwort?.status()} statt 200`);
      await seite.close();
      continue;
    }

    /* Erst den Auswahldialog beantworten – ein Modal fängt jeden Klick ab.
       „Nur das Notwendige" ist dabei der richtige Zustand: Die Kategorie
       `funktion` bleibt unerteilt, die Frage bleibt stehen. */
    const dialog = await nurNotwendiges(seite);
    if (dialog === 'bleibt-offen') {
      melde(wo, 'der Einwilligungsdialog ließ sich nicht schließen – gemessen wäre er, nicht die Seite');
      await seite.close();
      continue;
    }

    await seite.evaluate(() => document.fonts.ready);
    await seite.waitForTimeout(150);

    const anzahl = await seite.evaluate(() => document.querySelectorAll('.dritt').length);
    if (anzahl === 0) {
      melde(
        wo,
        'im Bauergebnis steht hier eine Einbettung, im Browser keine – ' +
          'entweder ist der Server auf einem älteren Stand als dist/client',
      );
      await seite.close();
      continue;
    }

    /* ── 1. bis 3.: der Zustand VOR der Zustimmung ────────────────────── */

    const vorher = [];

    for (let i = 0; i < anzahl; i++) {
      await seite.evaluate((n) => {
        document.querySelectorAll('.dritt')[n]?.scrollIntoView({ block: 'center' });
      }, i);
      await seite.waitForTimeout(120);

      const m = await seite.evaluate(MESSEN, i);
      vorher.push(m);
      if (!m || m.fehlt) {
        melde(wo, `Kasten ${i + 1}: keine .dritt-flaeche im Baum`);
        continue;
      }
      kaesten++;

      const wer = `${m.dienst} (Kasten ${i + 1}, ${m.flaeche.breite}×${m.flaeche.hoehe} px)`;

      if (!m.frageDa) {
        melde(
          wo,
          `${wer}: die Frage steht ohne Zustimmung nicht da. Entweder wurde ` +
            'vorab geladen – dann geht Fremdinhalt ohne Einwilligung raus – oder ' +
            'der Platzhalter fehlt ganz.',
        );
        continue;
      }

      /* 1a. Der verdeckte Überstand des Kastens selbst. */
      if (m.flaeche.verdecktHoch > TOLERANZ) {
        melde(
          wo,
          `${wer}: der Kasten schneidet ${m.flaeche.verdecktHoch} px seines eigenen Inhalts ` +
            `unten ab (Inhalt ${m.flaeche.hoehe + m.flaeche.verdecktHoch} px in ${m.flaeche.hoehe} px Kasten).`,
        );
      }
      if (m.flaeche.verdecktBreit > TOLERANZ) {
        melde(
          wo,
          `${wer}: der Kasten schneidet ${m.flaeche.verdecktBreit} px seines eigenen Inhalts ` +
            'seitlich ab.',
        );
      }

      /* 1b. Jedes Kind der Frage gegen die vier Kanten. */
      for (const k of m.kinder) {
        const raus = [
          k.links > TOLERANZ ? `${k.links} px nach links` : null,
          k.rechts > TOLERANZ ? `${k.rechts} px nach rechts` : null,
          k.oben > TOLERANZ ? `${k.oben} px nach oben` : null,
          k.unten > TOLERANZ ? `${k.unten} px nach unten` : null,
        ].filter(Boolean);
        if (raus.length) {
          melde(
            wo,
            `${wer}: ${k.name} („${k.text}", ${k.breite}×${k.hoehe} px) ragt ` +
              `${raus.join(' und ')} über die Fläche hinaus.`,
          );
        }
      }

      /* 2. Die Zustimmen-Schaltfläche. */
      if (m.gesperrt) {
        /* Kein AV-Vertrag: Das ist ein gewollter Zustand, kein Befund. Der
           Kasten wird trotzdem auf Überlauf geprüft – nur eben ohne Klick. */
      } else if (!m.knopf) {
        melde(wo, `${wer}: keine Zustimmen-Schaltfläche im Platzhalter.`);
      } else {
        const k = m.knopf;
        if (k.hoehe < MINDESTHOEHE) {
          melde(
            wo,
            `${wer}: die Zustimmen-Schaltfläche ist ${k.hoehe} px hoch, ` +
              `gefordert sind ${MINDESTHOEHE} px (WCAG 2.5.5) – fehlen ${Math.round((MINDESTHOEHE - k.hoehe) * 10) / 10} px.`,
          );
        }
        const knopfRaus = [
          k.links > TOLERANZ ? `${k.links} px links` : null,
          k.rechts > TOLERANZ ? `${k.rechts} px rechts` : null,
          k.oben > TOLERANZ ? `${k.oben} px oben` : null,
          k.unten > TOLERANZ ? `${k.unten} px unten` : null,
        ].filter(Boolean);
        if (knopfRaus.length) {
          melde(
            wo,
            `${wer}: die Zustimmen-Schaltfläche („${k.text}", ${k.breite}×${k.hoehe} px) ` +
              `steht ${knopfRaus.join(', ')} über den Kasten hinaus und ist dort abgeschnitten.`,
          );
        }
        const verdeckt = k.punkte.filter((p) => !p.ok);
        if (verdeckt.length) {
          melde(
            wo,
            `${wer}: die Zustimmen-Schaltfläche ist an ${verdeckt.length} von 3 Messpunkten ` +
              `nicht anklickbar – dort liegt ${verdeckt.map((p) => p.wer).join(', ')} darüber.`,
          );
        }
      }

      /* 3. Der Titel. */
      if (!m.titel) {
        melde(wo, `${wer}: kein Titel im Platzhalter – dann sagt nichts, was dort liegt.`);
      } else {
        const t = m.titel;
        if (!t.text) {
          melde(wo, `${wer}: der Titel ist leer.`);
        }
        const titelRaus = [
          t.links > TOLERANZ ? `${t.links} px links` : null,
          t.rechts > TOLERANZ ? `${t.rechts} px rechts` : null,
          t.oben > TOLERANZ ? `${t.oben} px oben` : null,
          t.unten > TOLERANZ ? `${t.unten} px unten` : null,
        ].filter(Boolean);
        if (titelRaus.length) {
          melde(
            wo,
            `${wer}: der Titel („${t.text.slice(0, 46)}") steht ${titelRaus.join(', ')} ` +
              'über den Kasten hinaus und ist dort abgeschnitten.',
          );
        }
        if (t.verdeckt > TOLERANZ) {
          melde(
            wo,
            `${wer}: vom Titel („${t.text.slice(0, 46)}") sind ${t.verdeckt} px abgeschnitten ` +
              `– er braucht ${t.hoehe + t.verdeckt} px und hat ${t.hoehe} px.`,
          );
        }
        const titelWeg = t.punkte.filter((p) => !p.ok);
        if (titelWeg.length) {
          melde(
            wo,
            `${wer}: der Titel ist an ${titelWeg.length} von 3 Messpunkten nicht zu sehen – ` +
              `dort liegt ${titelWeg.map((p) => p.wer).join(', ')} darüber.`,
          );
        }
      }
    }

    /* ── 4. Der Zustand NACH der Zustimmung ───────────────────────────── */

    const klickbar = vorher.some((m) => m && !m.fehlt && m.frageDa && !m.gesperrt);
    if (!klickbar) {
      await seite.close();
      continue;
    }

    let geklickt = true;
    for (let i = 0; i < anzahl; i++) {
      const m = vorher[i];
      if (!m || m.fehlt || !m.frageDa || m.gesperrt) continue;
      const knopf = seite.locator('.dritt').nth(i).locator('[data-rolle="freigeben"]');
      /* Der Knopf einer Einbettung derselben Kategorie ist womöglich schon
         weg, weil der erste Klick alle Kästen nachgezogen hat – das ist
         gewollt und kein Fehler. */
      if ((await knopf.count()) === 0) continue;
      try {
        await knopf.click({ timeout: 4000 });
      } catch (fehler) {
        melde(
          wo,
          `${m.dienst} (Kasten ${i + 1}): die Zustimmen-Schaltfläche ließ sich nicht ` +
            `anklicken – ${String(fehler).split('\n')[0]}`,
        );
        geklickt = false;
      }
    }

    if (!geklickt) {
      await seite.close();
      continue;
    }

    /*
     * Feste Wartezeit statt Netzruhe – und das ist der Kern der Sache:
     * Ab hier läuft eine Anfrage an YouTube, Google oder Matterport. Ob die
     * ankommt, ist nicht unsere Frage; auf einem Bauläufer kommt sie meist
     * nicht an. Auf `networkidle` zu warten hieße, den Wächter vom Netz des
     * Läufers abhängig zu machen.
     */
    await seite.waitForTimeout(600);

    for (let i = 0; i < anzahl; i++) {
      const v = vorher[i];
      if (!v || v.fehlt || !v.frageDa || v.gesperrt) continue;

      await seite.evaluate((n) => {
        document.querySelectorAll('.dritt')[n]?.scrollIntoView({ block: 'center' });
      }, i);
      await seite.waitForTimeout(120);

      const n = await seite.evaluate(MESSEN, i);
      if (!n || n.fehlt) {
        melde(wo, `${v.dienst} (Kasten ${i + 1}): nach der Zustimmung keine .dritt-flaeche mehr.`);
        continue;
      }

      const wer = `${n.dienst} (Kasten ${i + 1}, nach Zustimmung)`;

      if (n.frageDa) {
        melde(wo, `${wer}: die Frage steht nach dem Klick immer noch da.`);
        continue;
      }

      if (!n.rahmen) {
        melde(
          wo,
          `${wer}: kein iframe im Kasten – die Frage ist weg, an ihrer Stelle stehen ` +
            `${n.flaeche.breite}×${n.flaeche.hoehe} px leere Fläche. Genau so sieht ein ` +
            '„kaputtes Video" aus.',
        );
        continue;
      }

      const r = n.rahmen;
      const abBreite = Math.round((r.breite - n.flaeche.breite) * 10) / 10;
      const abHoehe = Math.round((r.hoehe - n.flaeche.hoehe) * 10) / 10;

      if (Math.abs(abBreite) > RAHMEN_TOLERANZ || Math.abs(abHoehe) > RAHMEN_TOLERANZ) {
        /* Beide Richtungen kommen vor und bedeuten Verschiedenes: zu klein
           heißt leerer dunkler Grund ringsum (so sah Fassung 3 aus), zu groß
           heißt, der Rahmen sprengt den Kasten und überdeckt, was darunter
           steht. Eine Meldung, die nur „es fehlen −232 px" sagt, hilft bei
           keinem von beiden. */
        const wieWeit = [
          Math.abs(abBreite) > RAHMEN_TOLERANZ
            ? `${Math.abs(abBreite)} px zu ${abBreite < 0 ? 'schmal' : 'breit'}`
            : null,
          Math.abs(abHoehe) > RAHMEN_TOLERANZ
            ? `${Math.abs(abHoehe)} px zu ${abHoehe < 0 ? 'niedrig' : 'hoch'}`
            : null,
        ].filter(Boolean);
        const anteil = Math.round(
          ((r.breite * r.hoehe) / (n.flaeche.breite * n.flaeche.hoehe)) * 100,
        );
        const folge =
          anteil < 100
            ? `Er füllt ${anteil} % des Kastens – der Rest ist leerer dunkler Grund.`
            : `Er belegt ${anteil} % des Kastens und deckt zu, was daneben steht.`;
        melde(
          wo,
          `${wer}: der iframe misst ${r.breite}×${r.hoehe} px in einem Kasten von ` +
            `${n.flaeche.breite}×${n.flaeche.hoehe} px – ${wieWeit.join(' und ')}. ${folge}`,
        );
      }

      /* Der Kasten kann nach der Zustimmung nur SCHRUMPFEN: Die Frage fällt
         weg, übrig bleibt das Seitenverhältnis. Wächst er, hat der Rahmen
         eine zweite Rasterzeile geöffnet – Fassung 3 des Fehlers. */
      const gewachsen = Math.round((n.flaeche.hoehe - v.flaeche.hoehe) * 10) / 10;
      if (gewachsen > RAHMEN_TOLERANZ) {
        melde(
          wo,
          `${wer}: der Kasten ist durch das Einsetzen des iframe von ` +
            `${v.flaeche.hoehe} px auf ${n.flaeche.hoehe} px gewachsen (+${gewachsen} px). ` +
            'Er kann nur kleiner werden – der Rahmen sitzt also nicht in derselben ' +
            'Rasterzelle wie die Frage.',
        );
      }

      const rahmenRaus = [
        r.links > TOLERANZ ? `${r.links} px links` : null,
        r.rechts > TOLERANZ ? `${r.rechts} px rechts` : null,
        r.oben > TOLERANZ ? `${r.oben} px oben` : null,
        r.unten > TOLERANZ ? `${r.unten} px unten` : null,
      ].filter(Boolean);
      if (rahmenRaus.length) {
        melde(wo, `${wer}: der iframe steht ${rahmenRaus.join(', ')} über den Kasten hinaus.`);
      }

      const verdeckt = r.punkte.filter((p) => !p.ok);
      if (verdeckt.length) {
        melde(
          wo,
          `${wer}: der iframe ist an ${verdeckt.length} von 3 Messpunkten verdeckt – ` +
            `dort liegt ${verdeckt.map((p) => p.wer).join(', ')} darüber.`,
        );
      }
    }

    await seite.close();
  }
}

await browser.close();

console.log(
  `\n[einbettung] ${aufrufe} Seitenaufrufe, ${kaesten} Kästen – ` +
    'je vor und nach der Zustimmung.',
);

if (befunde.length === 0) {
  console.log(
    '[einbettung] Kein Kind der Frage ragt aus seinem Kasten, die Zustimmen-\n' +
      '             Schaltfläche steht auf allen vier Breiten vollständig und mit\n' +
      `             mindestens ${MINDESTHOEHE} px Höhe darin, der Titel ist ganz zu lesen –\n` +
      '             und nach dem Klick füllt der iframe den Kasten, ohne ihn\n' +
      '             wachsen zu lassen.',
  );
  process.exit(0);
}

console.error(`\n[einbettung] ${befunde.length} Befund(e):\n`);
for (const b of befunde) {
  console.error(`  ${b.wo}`);
  console.error(`      ${b.text}\n`);
}
console.error(
  '[einbettung] ABBRUCH: Ein Einwilligungsplatzhalter, dessen Inhalt nicht in\n' +
    '             seinen Kasten passt, ist von einem kaputten Video nicht zu\n' +
    '             unterscheiden – er ist eine schwarze Fläche. Genau das ist an\n' +
    '             einem Tag dreimal per Bildschirmfoto gemeldet worden, und\n' +
    '             zweimal wurde nur die Einzelstelle repariert. Die Zahlen oben\n' +
    '             sagen, wie weit es daneben liegt.',
);
process.exit(1);
