// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import { SPRACHEN, QUELLSPRACHE } from './src/i18n/sprachen.ts';
import { alsAstroRedirects } from './src/data/weiterleitungen.ts';
import { ausSitemapAusschliessen } from './src/data/standortfassungen.ts';

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
  /*
   * Hinter welchen Adressen diese Anwendung erreichbar ist.
   *
   * ── Warum das nicht optional ist ────────────────────────────────────────
   *
   * Astro prüft bei jedem POST mit Formulardaten, ob der `Origin`-Kopf zur
   * eigenen Adresse passt – ein Schutz gegen Cross-Site Request Forgery, und
   * ein richtiger. Verglichen wird der Kopf mit `Astro.url`.
   *
   * `Astro.url` baut der Node-Adapter aus dem, was am Socket ankommt. Auf
   * Railway steht davor ein Reverse Proxy: Der Browser spricht per HTTPS mit
   * dem Proxy, der Proxy per HTTP mit uns, und die echte Adresse steht in
   * `X-Forwarded-Host` und `X-Forwarded-Proto`. Diesen Köpfen glaubt Astro
   * aus gutem Grund nicht von allein – wer sie fälschen kann, könnte sonst
   * `Astro.url` beliebig setzen (Host Header Injection).
   *
   * Ohne diese Liste ignoriert Astro sie also und setzt `Astro.url` auf
   * `http://localhost:4321`. Der Browser schickt `https://…railway.app`.
   * Beides passt nicht zusammen, und jeder Formularversand der eigenen Seite
   * endet mit 403 – gemessen an der Lächeln-Vorschau, die deshalb „Failed to
   * fetch" zeigte.
   *
   * Hier stehen deshalb die Adressen, unter denen die Anwendung wirklich
   * läuft, und nur die. `{}` (alles erlauben) wäre die Abkürzung und würde
   * genau den Schutz aufheben, um den es geht.
   *
   * localhost und 127.0.0.1 stehen mit dabei, weil Klickpfad und Durchgang
   * gegen den gebauten Server auf dem eigenen Rechner laufen. Ohne sie
   * scheitern dieselben Formulare dort – und zwar erst in der Prüfung, nicht
   * schon beim Bauen.
   */
  security: {
    allowedDomains: [
      { hostname: 'ku64.de', protocol: 'https' },
      { hostname: '**.ku64.de', protocol: 'https' },
      { hostname: '**.up.railway.app', protocol: 'https' },
      { hostname: 'localhost' },
      { hostname: '127.0.0.1' },
    ],
  },
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
        !IM_AUFBAU.some((s) => new URL(page).pathname.startsWith(`/${s.praefix}/`)) &&
        /* Seiten, die per Canonical auf eine andere zeigen oder `noindex`
           tragen, gehören nicht in die Sitemap. Eine Sitemap sagt „das hier
           ist das Original“ – beides zusammen ist ein Widerspruch, den die
           Search Console als Fehler meldet. Welche das sind und warum, steht
           in src/data/standortfassungen.ts. */
        !ausSitemapAusschliessen(new URL(page).pathname),
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
