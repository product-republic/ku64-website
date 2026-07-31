/**
 * Stellt eine Eintrittskarte für die Formulare aus, die eine E-Mail auslösen.
 *
 * Warum das ein eigener Endpunkt ist und die Karte nicht einfach beim Bauen in
 * die Seite geschrieben wird: Die Seiten sind statisch. Eine eingebaute Karte
 * trüge den Zeitpunkt des Deploys, wäre für alle Besucher dieselbe und nach
 * dem ersten Einlösen verbraucht – die Regeln „nur einmal" und „mindestens
 * drei Sekunden alt" wären damit gleichzeitig verletzt.
 *
 * Der Endpunkt ist absichtlich anspruchslos: kein Körper, keine Angaben, keine
 * Kennung. Er verrät nichts und verlangt nichts. Gedrosselt ist er trotzdem,
 * sonst wäre er der bequemste Weg, den Speicher der eingelösten Karten
 * volllaufen zu lassen.
 */
import type { APIRoute } from 'astro';
import { karteAusstellen } from '../../lib/eintrittskarte';
import { drosseln, zuVieleAnfragen } from '../../lib/drosselung';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  /* Großzügiger als die Formulare selbst: Wer eine Seite mehrfach öffnet oder
     zwischen Kontakt und Lächeln-Vorschau wechselt, holt mehrere Karten, ohne
     etwas Verdächtiges zu tun. */
  const drossel = drosseln(request, 'eintrittskarte', { anzahl: 40, fensterSekunden: 600 });
  if (!drossel.erlaubt) return zuVieleAnfragen(drossel);

  return new Response(JSON.stringify({ karte: karteAusstellen() }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      /* Eine Karte darf nie aus einem Zwischenspeicher kommen – weder aus dem
         des Browsers noch aus dem eines Proxys. Zwei Besucher mit derselben
         Karte hieße: Der zweite kommt nicht durch, weil der erste sie
         eingelöst hat. */
      'Cache-Control': 'no-store, max-age=0',
    },
  });
};
