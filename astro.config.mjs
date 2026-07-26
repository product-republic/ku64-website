// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

const SITE = process.env.PUBLIC_SITE_URL || 'https://ku64.de';

export default defineConfig({
  site: SITE,
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  trailingSlash: 'always',
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
      // Alte Parameter-URLs und interne Routen gehören nicht in die Sitemap.
      filter: (page) => !page.includes('/api/') && !page.includes('?'),
      i18n: {
        defaultLocale: 'de',
        locales: { de: 'de-DE', en: 'en-GB' },
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
