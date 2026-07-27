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
  redirects: alsAstroRedirects(),
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
      cssMinify: 'lightningcss',
    },
  },
});
