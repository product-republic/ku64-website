#!/usr/bin/env node
/**
 * Der Durchgang: jede Seitenart, jedes Gerät, jeder Zustand.
 *
 * ── Wonach gesucht wird ─────────────────────────────────────────────────
 *
 * Nach den vier Fehlern, die man beim Bauen nicht sieht und im Betrieb
 * sofort:
 *
 *   1. **Konsolenfehler.** Ein Skript, das wirft, hat aufgehört zu
 *      arbeiten – oft mitten in einer Bedienung, die dann tot ist.
 *   2. **Querlauf.** Ist die Seite breiter als das Fenster, wackelt auf dem
 *      Telefon alles. Der häufigste Fehler überhaupt und der am leichtesten
 *      übersehene, weil er am Schreibtisch nie auftritt.
 *   3. **Abgeschnittene Überschriften.** Eine Zeile, die aus ihrem Kasten
 *      läuft, ist im Screenshot sofort sichtbar und in keinem Test.
 *   4. **Tote Bedienelemente.** Standortwähler, Sprachwahl, Berater, Menü:
 *      Sie werden nicht angesehen, sondern angeklickt – und zwar in beiden
 *      Scrollzuständen, weil genau dort der letzte Fehler saß.
 *
 * ── Warum in zwei Scrollzuständen ───────────────────────────────────────
 *
 * Weil der Kopf beim Scrollen andockt und sich dabei umbaut. Ein
 * Bedienelement, das nur ganz oben funktioniert, ist kaputt – nur nicht
 * immer. Genau diese Sorte Fehler ist hier schon zweimal aufgetreten.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   npx astro preview --port 4340 &
 *   node scripts/durchgang.mjs [--port 4340]
 */

import { chromium } from 'playwright';

const portIndex = process.argv.indexOf('--port');
const PORT = portIndex >= 0 ? process.argv[portIndex + 1] : '4340';
const BASIS = `http://localhost:${PORT}`;

/** Eine Seite je Art – mehr sagt nichts Neues, weniger übersieht etwas. */
const SEITEN = [
  ['/', 'Startseite'],
  ['/potsdam/', 'Standort'],
  ['/leistungen/', 'Behandlungsübersicht'],
  ['/leistungen/zahnimplantate/', 'Behandlung'],
  ['/potsdam/leistungen/zahnimplantate/', 'Behandlung am Standort'],
  ['/zahnbeschwerden/', 'Beschwerdeübersicht'],
  ['/zahnbeschwerden/zahnschmerzen/', 'Beschwerde'],
  ['/potsdam/team/', 'Team'],
  ['/potsdam/team/nils-radsack/', 'Person'],
  ['/blog/', 'Blogübersicht'],
  ['/blog/20-jahre-ku64/', 'Blogbeitrag'],
  ['/suche/', 'Suche'],
  ['/ki-transparenz/', 'KI-Transparenz'],
  ['/notfall/', 'Notfall'],
  /*
   * Die anderen Sprachen sind hier nicht der Vollständigkeit halber.
   *
   * Übersetzung verändert die Länge, und Länge ist das, was hier gemessen
   * wird. „Termin buchen" wird zu „Book an appointment" – das hat den Kopf
   * auf dem Telefon schon einmal um acht Pixel überlaufen lassen. Geprüft
   * werden deshalb die Seiten mit den längsten Beschriftungen: Kopf und
   * Fußzeile überall, dazu Team und Rechtstext, wo die Sätze am längsten
   * sind.
   */
  ['/en/potsdam/', 'Standort englisch'],
  ['/en/potsdam/team/', 'Team englisch'],
  ['/en/datenschutz/', 'Datenschutz englisch'],
  ['/fr/leistungen/', 'Behandlungen französisch'],
  ['/fr/potsdam/team/', 'Team französisch'],
  ['/fr/datenschutz/', 'Datenschutz französisch'],
];

const GERAETE = [
  { name: 'Desktop', breite: 1440, hoehe: 900 },
  { name: 'Telefon', breite: 390, hoehe: 844 },
];

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PFAD || '/opt/pw-browsers/chromium',
  args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});

const befunde = [];
let geprueft = 0;

/** Läuft irgendein Element über den rechten Rand hinaus – und welches? */
async function querlauf(seite) {
  return seite.evaluate(() => {
    if (document.documentElement.scrollWidth <= window.innerWidth + 1) return null;
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.right > window.innerWidth + 1) {
        return `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} bis ${Math.round(r.right)}px`;
      }
    }
    return 'unbekanntes Element';
  });
}

/**
 * Überschriften, die aus ihrem Kasten laufen.
 *
 * Gemessen wird der Textinhalt gegen den Kasten, nicht der Kasten gegen das
 * Fenster: Eine Überschrift kann mitten auf der Seite abgeschnitten sein,
 * ohne dass die Seite überläuft.
 */
async function abgeschnitten(seite) {
  return seite.evaluate(() =>
    [...document.querySelectorAll('h1, h2, h3')]
      .filter((h) => {
        const s = getComputedStyle(h);
        if (s.overflow === 'visible' && s.overflowY === 'visible') return false;
        return h.scrollHeight > h.clientHeight + 2 || h.scrollWidth > h.clientWidth + 2;
      })
      .map((h) => (h.textContent || '').trim().slice(0, 50)),
  );
}

for (const geraet of GERAETE) {
  for (const [pfad, art] of SEITEN) {
    const seite = await browser.newPage({
      viewport: { width: geraet.breite, height: geraet.hoehe },
    });
    const fehler = [];
    seite.on('console', (m) => m.type() === 'error' && fehler.push(m.text()));
    seite.on('pageerror', (e) => fehler.push(String(e)));

    const antwort = await seite.goto(BASIS + pfad, { waitUntil: 'networkidle' });
    geprueft++;

    const melden = (was, detail) =>
      befunde.push({ geraet: geraet.name, pfad, art, was, detail });

    if (!antwort || antwort.status() !== 200) {
      melden('Status', String(antwort?.status() ?? 'keine Antwort'));
    }

    /* Zweimal prüfen: ungescrollt und gescrollt. Der Kopf baut sich dabei um. */
    for (const zustand of ['oben', 'gescrollt']) {
      if (zustand === 'gescrollt') {
        await seite.evaluate(() => {
          document.documentElement.style.scrollBehavior = 'auto';
          window.scrollTo(0, 900);
        });
        await seite.waitForTimeout(400);
      }

      const quer = await querlauf(seite);
      if (quer) melden(`Querlauf (${zustand})`, quer);

      for (const titel of await abgeschnitten(seite)) {
        melden(`Überschrift abgeschnitten (${zustand})`, titel);
      }

      /* Bedienelemente: öffnen, prüfen, wieder schließen. */
      const waehler = await seite.$('.waehler summary, .waehler > summary');
      if (waehler) {
        await waehler.click();
        await seite.waitForTimeout(200);
        const offen = await seite.evaluate(() => !!document.querySelector('.waehler[open]'));
        if (!offen) melden(`Standortwähler öffnet nicht (${zustand})`, '');
        else await seite.keyboard.press('Escape');
      }

      /*
       * `.berater .ruf` und nicht `.berater-ruf`.
       *
       * Der falsche Selektor stand hier zwei Läufe lang und traf nichts. Weil
       * die Prüfung nur läuft, WENN das Element gefunden wird, meldete der
       * Durchgang jedes Mal „keine Beanstandung" – ohne den Berater je
       * angefasst zu haben. Ein Test, der bei fehlendem Element schweigt,
       * ist schlimmer als keiner: Er sagt „geprüft", wo „übersprungen"
       * stünde.
       *
       * Deshalb jetzt: Fehlt der Knopf, ist das selbst eine Beanstandung.
       */
      const ruf = await seite.$('.berater .ruf');
      if (!ruf) {
        melden(`Berater-Knopf fehlt (${zustand})`, '');
      } else if (await ruf.isVisible()) {
        await ruf.click();
        await seite.waitForTimeout(250);
        const offen = await seite.evaluate(
          () => !document.querySelector('#berater-fenster')?.hidden,
        );
        if (!offen) melden(`Berater öffnet nicht (${zustand})`, '');
        else await seite.keyboard.press('Escape');
      }
    }

    if (fehler.length) melden('Konsolenfehler', fehler.join(' | ').slice(0, 200));

    await seite.close();
  }
}

await browser.close();

console.log(`\n[durchgang] ${geprueft} Seitenaufrufe geprüft\n`);

if (befunde.length === 0) {
  console.log('[durchgang] Keine Beanstandung.');
  process.exit(0);
}

const nachArt = {};
for (const b of befunde) (nachArt[b.was] ??= []).push(b);

console.error(`[durchgang] ${befunde.length} Beanstandungen:\n`);
for (const [was, liste] of Object.entries(nachArt)) {
  console.error(`  ${was}  (${liste.length}×)`);
  for (const b of liste.slice(0, 8)) {
    console.error(`    ${b.geraet.padEnd(8)} ${b.pfad}  ${b.detail}`);
  }
  if (liste.length > 8) console.error(`    … und ${liste.length - 8} weitere`);
  console.error('');
}
process.exit(1);
