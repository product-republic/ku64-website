/**
 * Drosselung für die Endpunkte.
 *
 * ── Warum ─────────────────────────────────────────────────────────────────
 *
 * `/api/chat/` war ohne Authentifizierung und ohne Begrenzung offen. Jede
 * Anfrage kostet Tokens bei einem Sprachmodell – wer das Skript für eine
 * Schleife hält, erzeugt eine Rechnung, und niemand merkt es, bis sie kommt.
 * Drei Anfragen in Folge ergaben im Test drei Antworten mit Status 200.
 *
 * ── Wie ───────────────────────────────────────────────────────────────────
 *
 * Gleitendes Fenster im Arbeitsspeicher. Kein Redis, keine Datenbank: Die
 * Anwendung läuft als eine Instanz, und ein Zähler, der bei einem Neustart
 * vergisst, ist hier kein Problem – ein Neustart passiert bei einem Deploy,
 * nicht unter Last.
 *
 * ── Was NICHT gespeichert wird ────────────────────────────────────────────
 *
 * Nicht die IP-Adresse. Gespeichert wird ein gekürzter Hash aus IP und einem
 * beim Start erzeugten Zufallswert. Damit lässt sich zählen, aber nicht
 * zurückrechnen, und nach einem Neustart passt kein alter Hash mehr zu einer
 * Person. Eine Website ohne Cookies und ohne Drittanbieter soll auch im
 * Serverspeicher niemanden identifizierbar führen.
 */
import { createHash, randomBytes } from 'node:crypto';

/* Wechselt bei jedem Start. Ohne ihn wäre der Hash über die Zeit stabil und
   damit ein Wiedererkennungsmerkmal. */
const STREUWERT = randomBytes(16).toString('hex');

interface Fenster {
  zeitpunkte: number[];
}

const speicher = new Map<string, Fenster>();

/* Damit der Speicher nicht wächst, wenn jemand einmal vorbeikommt und nie
   wieder: Alles, was älter ist als das längste Fenster, fliegt raus. */
const AUFRAEUMEN_ALLE_MS = 5 * 60 * 1000;
let letztesAufraeumen = 0;

function kennung(anfrage: Request): string {
  /* Hinter dem Reverse Proxy steht die echte Adresse in X-Forwarded-For. Der
     erste Eintrag ist der Client; alles danach sind Zwischenstationen. */
  const weiter = anfrage.headers.get('x-forwarded-for');
  const roh = (weiter?.split(',')[0] ?? anfrage.headers.get('x-real-ip') ?? 'unbekannt').trim();
  return createHash('sha256').update(STREUWERT + roh).digest('hex').slice(0, 16);
}

export interface Drosselwerte {
  /** Wie viele Anfragen im Fenster erlaubt sind. */
  anzahl: number;
  /** Länge des Fensters in Sekunden. */
  fensterSekunden: number;
}

export interface Drosselergebnis {
  erlaubt: boolean;
  /** Sekunden bis zum nächsten freien Versuch – für `Retry-After`. */
  wartenSekunden: number;
  verbleibend: number;
}

export function drosseln(
  anfrage: Request,
  bereich: string,
  { anzahl, fensterSekunden }: Drosselwerte,
): Drosselergebnis {
  const jetzt = Date.now();
  const fensterMs = fensterSekunden * 1000;

  if (jetzt - letztesAufraeumen > AUFRAEUMEN_ALLE_MS) {
    for (const [k, f] of speicher) {
      if (f.zeitpunkte.every((t) => jetzt - t > fensterMs)) speicher.delete(k);
    }
    letztesAufraeumen = jetzt;
  }

  const schluessel = `${bereich}:${kennung(anfrage)}`;
  const fenster = speicher.get(schluessel) ?? { zeitpunkte: [] };
  fenster.zeitpunkte = fenster.zeitpunkte.filter((t) => jetzt - t < fensterMs);

  if (fenster.zeitpunkte.length >= anzahl) {
    speicher.set(schluessel, fenster);
    const aeltester = fenster.zeitpunkte[0];
    return {
      erlaubt: false,
      wartenSekunden: Math.max(1, Math.ceil((fensterMs - (jetzt - aeltester)) / 1000)),
      verbleibend: 0,
    };
  }

  fenster.zeitpunkte.push(jetzt);
  speicher.set(schluessel, fenster);
  return { erlaubt: true, wartenSekunden: 0, verbleibend: anzahl - fenster.zeitpunkte.length };
}

/**
 * Fertige Antwort für den Fall, dass gedrosselt wird.
 *
 * Der Text ist bewusst kein technischer Fehler: Wer zu schnell tippt, hat
 * nichts falsch gemacht und soll wissen, dass das Telefon jederzeit geht.
 */
export function zuVieleAnfragen(ergebnis: Drosselergebnis): Response {
  return new Response(
    JSON.stringify({
      fehler:
        'Gerade kommen sehr viele Anfragen an. Bitte versuchen Sie es in einem Moment noch einmal – oder rufen Sie uns an, das geht immer.',
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Retry-After': String(ergebnis.wartenSekunden),
      },
    },
  );
}
