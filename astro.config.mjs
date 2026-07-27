// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import { SPRACHEN, QUELLSPRACHE } from './src/i18n/sprachen.ts';
import { alsAstroRedirects } from './src/data/weiterleitungen.ts';

const SITE = process.env.PUBLIC_SITE_URL || 'https://ku64.de';

/* Sitemap-Sprachen aus dem Register ableiten, damit eine neue Sprache nicht an
   zwei Stellen eingetragen werden muss. Noch nicht freigegebene Sprachen
   bleiben draußen: Ihre Seiten tragen `noindex`, und eine Sitemap, die
   noindex-Seiten meldet, ist ein Widerspruch, den die Search Console
   ausdrücklich anmerkt. */
const FREIGEGEBEN = SPRACHEN.filter((s) => s.freigegeben);
const IM_AUFBAU = SPRACHEN.filter((s) => !s.freigegeben && s.praefix !== '');

export default defineConfig({
  site: SITE,
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  trailingSlash: 'always',
  /*
   * Weiterleitungen des Altbestands.
   *
   * Die Liste steht als Daten in `src/data/weiterleitungen.ts`, damit sie
   * gegengelesen und zusätzlich in einen Reverse Proxy übernommen werden
   * kann – dort wäre es ein echter 301, hier bei statischer Ausgabe eine
   * kleine Seite mit `meta refresh` und Canonical.
   *
   * Ohne sie liefen 90,8 Prozent aller Adressen ins Leere, die Google von
   * der alten Website kennt. Das ist der teuerste einzelne Fehler, den ein
   * Relaunch machen kann, und der am leichtesten vermeidbare.
   */
  /*
   * `OHNE_WEITERLEITUNGEN=1` baut ohne sie.
   *
   * Das ist kein Schalter für den Betrieb, sondern für die Planung: Eine
   * Weiterleitung hat in Astro Vorrang vor einer echten Seite mit derselben
   * Adresse. Solange eine veraltete Regel auf `/leistungen/` zeigt, wird die
   * Leistungsübersicht gar nicht erst gebaut – und das Planungsskript, das
   * gegen das Bauergebnis prüft, hält sie dann für nicht vorhanden und
   * schreibt die Regel wieder. Ein Kreis, der sich selbst bestätigt.
   *
   * Deshalb: einmal ohne Weiterleitungen bauen, planen, normal bauen.
   * `npm run weiterleitungen:planen` macht genau das.
   */
  redirects: process.env.OHNE_WEITERLEITUNGEN ? {} : alsAstroRedirects(),
  build: {
    inlineStylesheets: 'auto',
    format: 'directory',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    sitemap({
      changefreq: 'weekly',
      lastmod: new Date(),
      // Alte Parameter-URLs, interne Routen und Sprachen im Aufbau gehören
      // nicht in die Sitemap.
      filter: (page) =>
        !page.includes('/api/') &&
        !page.includes('?') &&
        !IM_AUFBAU.some((s) => new URL(page).pathname.startsWith(`/${s.praefix}/`)),
      i18n: {
        defaultLocale: QUELLSPRACHE,
        locales: Object.fromEntries(FREIGEGEBEN.map((s) => [s.praefix || s.code, s.bcp47])),
      },
    }),
  ],
  image: {
    // Bilder werden zur Buildzeit in AVIF/WebP konvertiert.
    responsiveStyles: true,
    layout: 'constrained',
  },
  vite: {
    build: {
      /*
       * KEIN LightningCSS.
       *
       * Es war hier eingestellt und hat die Website einen sichtbaren Fehler
       * gekostet: Ohne Angabe von Ziel-Browsern nimmt es sehr alte an und
       * ersetzt moderne Eigenschaften durch ihre `-webkit-`-Fassung. So kam
       * `backdrop-filter` im gebauten CSS nur noch präfixiert an – und das
       * ist in aktuellen Browsern kein Alias mehr, sondern eine unbekannte
       * Eigenschaft, die verworfen wird.
       *
       * Gemessen: elf von vierzehn Glasflächen hatten dadurch keinen
       * Weichzeichner. Durchscheinend, aber gestochen scharf – also kein
       * Glas, sondern Folie. Der Kopf über einem Foto sah aus wie ein
       * weißer Kasten mit einem scharfen Bild dahinter.
       *
       * Ziel-Browser ließen sich angeben, aber das ist eine zweite Stelle,
       * an der etwas veralten kann. esbuild minimiert ohne umzuschreiben und
       * ist bei diesem Stylesheet nur wenige Kilobyte schlechter. Das ist
       * der bessere Tausch.
       */
      cssMinify: true,
    },
  },
});
