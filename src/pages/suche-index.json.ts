/**
 * Der Suchindex als Datei.
 *
 * ── Warum als Datei und nicht als Dienst ────────────────────────────────
 *
 * Weil er sich zwischen zwei Bauvorgängen nicht ändert. Ein Endpunkt, der
 * bei jeder Eingabe angefragt wird, kostet je Tastendruck eine Anfrage über
 * das Netz – und liefert dabei immer dieselbe Antwort. Die Datei wird
 * einmal geladen, liegt danach im Zwischenspeicher des Browsers, und die
 * Suche antwortet ohne Netz.
 *
 * Nebenwirkung, die keine ist: Wer offline weitersurft, kann weitersuchen.
 *
 * ── Was drinsteht und was nicht ─────────────────────────────────────────
 *
 * Nur, was zum Finden und Anzeigen gebraucht wird. Keine Fließtexte, keine
 * Fragenlisten, keine Preise – die stehen auf den Seiten, zu denen die
 * Treffer führen. Gemessen bleibt die Datei damit im niedrigen
 * zweistelligen Kilobyte-Bereich, komprimiert deutlich darunter.
 *
 * Die Standortnamen kommen mit, damit der Browser „gibt es nur in Potsdam"
 * schreiben kann, ohne dafür den Standortdatensatz zu laden.
 */
import type { APIRoute } from 'astro';
import { indexBauen, zerlegen } from '../lib/suche.ts';
import { STANDORTE } from '../data/standorte.ts';

export const prerender = true;

/**
 * Das schwache Feld auf seine Wörter eindampfen.
 *
 * Es enthält ganze Sätze: Teaser, Anrisse, Patientenfragen. Für die Anzeige
 * werden die nie gebraucht – nur das starke Feld liefert das „gefunden über
 * …“. Fürs Finden zählen ohnehin nur die Wörter, denn der Bewerter zerlegt
 * jeden Ausdruck sowieso in seine Bestandteile.
 *
 * Also: einmal zerlegen, doppelte weg, als eine Zeichenkette speichern. Die
 * Trefferqualität bleibt gleich, weil dieselben Wörter dieselben Punkte
 * geben – gemessen 114 auf 47 Kilobyte, und das bei einer Datei, die beim
 * ersten Tastendruck geladen wird.
 */
function verdichten(felder: string[]): string[] {
  const woerter = new Set<string>();
  for (const feld of felder) for (const w of zerlegen(feld)) woerter.add(w);
  return woerter.size ? [[...woerter].join(' ')] : [];
}

export const GET: APIRoute = () => {
  const daten = {
    eintraege: indexBauen().map((e) => ({
      ...e,
      /* Auch das starke Feld kennt Doppelte – „Veneers“ steht im Namen und
         noch einmal in den Synonymen. */
      stark: [...new Set(e.stark.filter(Boolean))],
      schwach: verdichten(e.schwach),
    })),
    standorte: STANDORTE.map((s) => ({ slug: s.slug, name: s.name })),
  };

  return new Response(JSON.stringify(daten), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      /* Ein Jahr, weil der Dateiname gleich bleibt und der Inhalt sich mit
         jedem Deployment ändert – deshalb `must-revalidate` statt
         `immutable`: Der Browser darf ihn behalten, muss aber nachfragen. */
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  });
};
