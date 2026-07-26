/**
 * Hält interne Links in der Sprache, in der die Seite gerade steht.
 *
 * Warum zentral und nicht in jeder Seite: Eine Website mit rund 360 Seiten hat
 * einige tausend interne Links. Würde jeder einzelne beim Schreiben von Hand
 * mit dem Sprachpräfix versehen, bräuchte es nur einen vergessenen – und die
 * englische Besucherin landete mitten im Lesen wieder auf einer deutschen
 * Seite. Das ist derselbe Fehler, den die alte Website beim Standortwechsel
 * gemacht hat, nur mit Sprachen statt Orten.
 *
 * Hier wird er strukturell ausgeschlossen: Was auf einer englischen Seite als
 * `/potsdam/termine/` geschrieben steht, verlässt den Server als
 * `/en/potsdam/termine/`. Die Seitenvorlagen kennen weiterhin nur einen
 * einzigen, präfixlosen Pfadbegriff.
 *
 * Nicht angefasst werden:
 *   · absolute Adressen (http, mailto, tel) – die zeigen nach außen
 *   · alles unter /api/ – Endpunkte sind sprachneutral
 *   · Pfade mit Dateiendung (/favicon.svg, /og/…png) – das sind Dateien
 *   · Inhalte von <script> und <style>
 *   · hreflang- und Canonical-Angaben, die bewusst absolut ausgegeben werden
 */

import { defineMiddleware } from 'astro:middleware';
import { pfadInSprache, QUELLSPRACHE, spracheAusPfad, type Sprache } from './i18n/sprachen';

const VERWEIS = /(href|action)="(\/[^"]*)"/g;
const AUSNAHMEN = /^\/(api|_astro|og|fonts)\//;

export const onRequest = defineMiddleware(async (context, next) => {
  const antwort = await next();

  const typ = antwort.headers.get('content-type') ?? '';
  if (!typ.includes('text/html')) return antwort;

  const sprache = spracheAusPfad(context.url.pathname);
  if (sprache === QUELLSPRACHE) return antwort;

  const html = await antwort.text();
  const mitVerweisen = ausserhalbVonSkripten(html, (teil) => verweiseUmschreiben(teil, sprache));
  const fertig = strukturdatenUmschreiben(mitVerweisen, sprache, context.site?.href);

  return new Response(fertig, {
    status: antwort.status,
    statusText: antwort.statusText,
    headers: antwort.headers,
  });
});

/**
 * Auch die strukturierten Daten müssen auf die Sprachfassung zeigen.
 *
 * Sonst nennt die englische Seite als `url` und `@id` die deutsche Adresse.
 * Google folgt dieser Angabe: Es würde die englische Seite entweder gar nicht
 * oder als Dublette der deutschen führen – und in der lokalen Suche käme die
 * englische Fassung nie zum Zug.
 */
function strukturdatenUmschreiben(html: string, sprache: Sprache, site?: string): string {
  if (!site) return html;
  const wurzel = site.replace(/\/$/, '');

  return html.replace(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
    (ganz, inhalt: string) => {
      const neu = inhalt.replace(
        new RegExp(`${wurzel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(/[^"]*)`, 'g'),
        (voll: string, pfad: string) => {
          const letztes = pfad.split(/[?#]/)[0].split('/').filter(Boolean).pop() ?? '';
          if (letztes.includes('.') || AUSNAHMEN.test(pfad)) return voll;
          return `${wurzel}${pfadInSprache(pfad.replace(/#.*$/, ''), sprache)}${
            pfad.match(/#.*$/)?.[0] ?? ''
          }`;
        },
      );
      return ganz.replace(inhalt, neu);
    },
  );
}

function verweiseUmschreiben(html: string, sprache: Sprache): string {
  return html.replace(VERWEIS, (ganz, attribut: string, pfad: string) => {
    if (AUSNAHMEN.test(pfad)) return ganz;

    // Dateien erkennt man an der Endung im letzten Segment. Ein Sprachpräfix
    // davor wäre eine 404 – die Datei liegt nur einmal.
    const letztes = pfad.split(/[?#]/)[0].split('/').filter(Boolean).pop() ?? '';
    if (letztes.includes('.')) return ganz;

    return `${attribut}="${pfadInSprache(pfad, sprache)}"`;
  });
}

/**
 * Die Ersetzung auf alles außerhalb von <script> und <style> beschränken.
 *
 * In einem Skript kann `href="/…"` als Zeichenkette vorkommen, die zur
 * Laufzeit anders zusammengesetzt wird; ein Präfix an dieser Stelle wäre
 * bestenfalls doppelt. Skripte holen sich die Sprache stattdessen aus
 * `document.documentElement.dataset.sprachpraefix`.
 */
function ausserhalbVonSkripten(html: string, bearbeiten: (teil: string) => string): string {
  const bloecke = /<(script|style)\b[\s\S]*?<\/\1>/gi;
  let ergebnis = '';
  let position = 0;

  for (const treffer of html.matchAll(bloecke)) {
    ergebnis += bearbeiten(html.slice(position, treffer.index));
    ergebnis += treffer[0];
    position = treffer.index + treffer[0].length;
  }
  ergebnis += bearbeiten(html.slice(position));
  return ergebnis;
}
