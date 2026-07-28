/**
 * Chat-Endpunkt für den digitalen Berater.
 *
 * Läuft serverseitig, damit der API-Key niemals im Browser landet. Antwortet
 * als Server-Sent-Events-Stream, damit die Antwort Wort für Wort erscheint
 * statt nach mehreren Sekunden am Stück.
 *
 * Ohne ANTHROPIC_API_KEY schaltet der Endpunkt in einen Demo-Modus: Er
 * antwortet dann aus der Wissensbasis heraus mit einem festen Hinweis, statt
 * einen Fehler zu werfen. So ist die Testumgebung auch ohne Key vorführbar.
 */

import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { systemPrompt } from '../../lib/wissen';
import { STANDORT_SLUGS } from '../../data/standorte';

export const prerender = false;

const MODELL = process.env.CHAT_MODELL || 'claude-sonnet-5';
const MAX_NACHRICHTEN = 20;
const MAX_ZEICHEN = 2000;

interface Nachricht {
  role: 'user' | 'assistant';
  content: string;
}

/** Sehr einfache Ratenbegrenzung pro IP – hält Missbrauch der Testumgebung klein. */
const zaehler = new Map<string, { anzahl: number; fenster: number }>();
const LIMIT = 30;
const FENSTER_MS = 10 * 60 * 1000;

function limitUeberschritten(ip: string): boolean {
  const jetzt = Date.now();
  const eintrag = zaehler.get(ip);

  if (!eintrag || jetzt - eintrag.fenster > FENSTER_MS) {
    zaehler.set(ip, { anzahl: 1, fenster: jetzt });
    return false;
  }

  eintrag.anzahl += 1;
  return eintrag.anzahl > LIMIT;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let daten: { nachrichten?: Nachricht[]; standort?: string | null };

  try {
    daten = await request.json();
  } catch {
    return fehler('Anfrage konnte nicht gelesen werden.', 400);
  }

  const nachrichten = Array.isArray(daten.nachrichten) ? daten.nachrichten : [];
  const standort =
    daten.standort && STANDORT_SLUGS.includes(daten.standort) ? daten.standort : null;

  if (nachrichten.length === 0) {
    return fehler('Keine Nachricht übermittelt.', 400);
  }

  if (limitUeberschritten(clientAddress || 'unbekannt')) {
    return fehler(
      'Sie haben in kurzer Zeit sehr viele Fragen gestellt. Bitte versuchen Sie es in einigen Minuten erneut – oder rufen Sie uns direkt an.',
      429,
    );
  }

  /* Verlauf begrenzen und säubern: Nur die letzten Nachrichten, jede gekürzt.
     Das begrenzt Kosten und verhindert, dass jemand über einen sehr langen
     Verlauf den Systemprompt aushebelt. */
  const bereinigt: Nachricht[] = nachrichten
    .slice(-MAX_NACHRICHTEN)
    .filter((n) => n && (n.role === 'user' || n.role === 'assistant') && typeof n.content === 'string')
    .map((n) => ({ role: n.role, content: n.content.slice(0, MAX_ZEICHEN) }))
    .filter((n) => n.content.trim().length > 0);

  if (bereinigt.length === 0 || bereinigt[bereinigt.length - 1].role !== 'user') {
    return fehler('Ungültiger Gesprächsverlauf.', 400);
  }

  const schluessel = process.env.ANTHROPIC_API_KEY;

  if (!schluessel) {
    return demoAntwort(standort);
  }

  const anthropic = new Anthropic({ apiKey: schluessel });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const senden = (typ: string, wert: unknown) =>
        controller.enqueue(encoder.encode(`event: ${typ}\ndata: ${JSON.stringify(wert)}\n\n`));

      try {
        const antwort = anthropic.messages.stream({
          model: MODELL,
          max_tokens: 1024,
          system: [
            {
              type: 'text',
              text: systemPrompt(standort),
              // Der Systemprompt ist groß und bei jeder Anfrage identisch –
              // Caching senkt Kosten und Latenz deutlich.
              cache_control: { type: 'ephemeral' },
            },
          ],
          messages: bereinigt,
        });

        for await (const teil of antwort) {
          if (teil.type === 'content_block_delta' && teil.delta.type === 'text_delta') {
            senden('text', teil.delta.text);
          }
        }

        senden('ende', {});
      } catch (e) {
        console.error('[chat] Fehler bei der Modellanfrage:', e);
        senden(
          'fehler',
          'Der Berater ist gerade nicht erreichbar. Bitte rufen Sie uns an – wir helfen Ihnen sofort weiter.',
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
};

function fehler(nachricht: string, status: number) {
  return new Response(JSON.stringify({ fehler: nachricht }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

/** Demo-Modus ohne API-Key – damit die Testumgebung trotzdem etwas zeigt. */
function demoAntwort(standort: string | null) {
  const text = standort
    ? `Der digitale Berater läuft in dieser Testumgebung noch ohne KI-Schlüssel. Sobald ANTHROPIC_API_KEY gesetzt ist, beantworte ich hier jede Frage zu Leistungen, Kosten und Abläufen bei KU64 ${standort} – auf Basis der echten Praxisdaten. Bis dahin: Alle Leistungen dieses Standorts finden Sie unter /${standort}/leistungen/.`
    : 'Der digitale Berater läuft in dieser Testumgebung noch ohne KI-Schlüssel. Bitte wählen Sie zunächst Ihren Standort – dann kann ich Ihnen zu Leistungen, Kosten und Terminen genau dort weiterhelfen.';

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Wortweise senden, damit der Demo-Modus sich wie der echte anfühlt.
      const worte = text.split(' ');
      let i = 0;
      const tick = setInterval(() => {
        if (i >= worte.length) {
          controller.enqueue(encoder.encode(`event: ende\ndata: {}\n\n`));
          controller.close();
          clearInterval(tick);
          return;
        }
        const stueck = (i === 0 ? '' : ' ') + worte[i++];
        controller.enqueue(encoder.encode(`event: text\ndata: ${JSON.stringify(stueck)}\n\n`));
      }, 28);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Berater-Modus': 'demo',
    },
  });
}
