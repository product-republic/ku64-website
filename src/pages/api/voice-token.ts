/**
 * Signierte URL für den ElevenLabs-Sprachberater.
 *
 * Entspricht dem in der Anna-Dokumentation als "B2" beschriebenen Weg: Der
 * API-Key bleibt auf dem Server, das Frontend bekommt pro Gespräch eine
 * kurzlebige signierte URL. Der in der Anna-Doku beschriebene Testbetrieb mit
 * offenem Public Agent (Auth AUS) ist für eine Zahnarztpraxis nicht
 * angemessen – dort würde ein öffentlicher Agent auf Praxiskosten laufen.
 *
 * Konfiguration:
 *   ELEVENLABS_API_KEY   – Konto-Schlüssel (derselbe wie bei Anna)
 *   ELEVENLABS_AGENT_ID  – KU64-Agent, standortübergreifend
 *   ELEVENLABS_AGENT_ID_<STANDORT> – optional je Standort ein eigener Agent
 */

import type { APIRoute } from 'astro';
import { STANDORT_SLUGS } from '../../data/standorte';

export const prerender = false;

/** Ratenbegrenzung: Sprachminuten kosten Geld. */
const zaehler = new Map<string, { anzahl: number; fenster: number }>();
const LIMIT = 10;
const FENSTER_MS = 60 * 60 * 1000;

function limitUeberschritten(ip: string): boolean {
  const jetzt = Date.now();
  const e = zaehler.get(ip);
  if (!e || jetzt - e.fenster > FENSTER_MS) {
    zaehler.set(ip, { anzahl: 1, fenster: jetzt });
    return false;
  }
  e.anzahl += 1;
  return e.anzahl > LIMIT;
}

export const GET: APIRoute = async ({ url, clientAddress }) => {
  if (limitUeberschritten(clientAddress || 'unbekannt')) {
    return json({ fehler: 'Zu viele Gesprächsanfragen. Bitte später erneut versuchen.' }, 429);
  }

  const roh = url.searchParams.get('standort');
  const standort = roh && STANDORT_SLUGS.includes(roh) ? roh : null;

  const schluessel = process.env.ELEVENLABS_API_KEY;

  // Standortspezifischer Agent, sonst der allgemeine.
  const agentId =
    (standort
      ? process.env[`ELEVENLABS_AGENT_ID_${standort.toUpperCase().replace(/-/g, '_')}`]
      : null) || process.env.ELEVENLABS_AGENT_ID;

  if (!schluessel || !agentId) {
    return json(
      {
        demo: true,
        hinweis:
          'Der Sprachberater ist in dieser Testumgebung noch nicht verbunden. Sobald ELEVENLABS_API_KEY und ELEVENLABS_AGENT_ID gesetzt sind, ist das Gespräch hier direkt möglich.',
      },
      200,
    );
  }

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(agentId)}`,
      { headers: { 'xi-api-key': schluessel } },
    );

    if (!res.ok) {
      // Häufigste Ursache laut Anna-Dokumentation: aufgebrauchte Credits.
      console.error('[voice] ElevenLabs antwortete mit', res.status);
      return json(
        {
          fehler:
            'Der Sprachberater ist gerade nicht erreichbar. Nutzen Sie gern den Chat oder rufen Sie uns an.',
        },
        502,
      );
    }

    const daten = (await res.json()) as { signed_url?: string };

    if (!daten.signed_url) {
      return json({ fehler: 'Verbindung konnte nicht aufgebaut werden.' }, 502);
    }

    return json({ signedUrl: daten.signed_url, standort });
  } catch (e) {
    console.error('[voice] Fehler:', e instanceof Error ? e.message : e);
    return json({ fehler: 'Verbindung konnte nicht aufgebaut werden.' }, 500);
  }
};

function json(daten: unknown, status = 200) {
  return new Response(JSON.stringify(daten), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // Signierte URLs sind kurzlebig und personenbezogen.
      'Cache-Control': 'no-store',
    },
  });
}
