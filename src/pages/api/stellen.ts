/**
 * Aktuelle Stellen als JSON.
 *
 * ── Warum es diesen Weg zusätzlich gibt ────────────────────────────────────
 *
 * Die Karriereseite wird beim Bauen erzeugt und enthält den Stand des
 * letzten Deployments – gut für Suchmaschinen und für alle, die kein
 * JavaScript ausführen. Zwischen zwei Deployments kann sich die Liste aber
 * ändern, und eine Anzeige für eine besetzte Stelle kostet jemanden eine
 * Bewerbung.
 *
 * Deshalb fragt die Seite nach dem Laden hier nach und tauscht die Liste
 * aus, wenn sie sich geändert hat. Wer kein JavaScript hat, sieht den Stand
 * des Deployments – nicht ideal, aber vollständig brauchbar, und der Verweis
 * auf das Stellenportal steht ohnehin daneben.
 *
 * Der Umweg über den eigenen Server statt eines direkten Abrufs bei Personio
 * hat zwei Gründe: Der Feed erlaubt keine Abrufe aus fremden Browsern
 * (CORS), und ohne den Umweg baute jeder Seitenaufruf eine Verbindung zu
 * einem Drittanbieter auf – genau das, was diese Website vermeidet.
 */
import type { APIRoute } from 'astro';
import { offeneStellen } from '../../lib/personio';

export const prerender = false;

export const GET: APIRoute = async () => {
  const stellen = await offeneStellen();

  if (stellen === null) {
    /* 503 statt einer leeren Liste: „gerade nicht erreichbar" ist etwas
       anderes als „keine offenen Stellen", und die Seite soll den
       Unterschied sehen können. */
    return new Response(JSON.stringify({ fehler: 'Personio nicht erreichbar' }), {
      status: 503,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }

  return new Response(JSON.stringify({ stellen }), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      /* Fünf Minuten, dieselbe Spanne wie der Zwischenspeicher im Server. */
      'cache-control': 'public, max-age=300',
    },
  });
};
