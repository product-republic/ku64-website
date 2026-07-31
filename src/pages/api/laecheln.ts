/**
 * Lächeln-Vorschau: Foto hochladen, Analyse, Bildgenerierung, Versand per E-Mail.
 *
 * DATENSCHUTZ – die Regeln, nach denen dieser Endpunkt gebaut ist:
 *
 * 1. Ein Gesichtsfoto ist ein biometrisches Datum und fällt unter Art. 9 DSGVO.
 *    Verarbeitung erfolgt ausschließlich auf Grundlage einer ausdrücklichen,
 *    vorher erteilten Einwilligung (Art. 9 Abs. 2 lit. a).
 * 2. Es wird NICHTS auf die Festplatte geschrieben. Foto und Ergebnis liegen
 *    nur im Arbeitsspeicher dieser einen Anfrage und werden danach verworfen.
 * 3. Es wird keine Datenbank geschrieben, kein Log mit Bildinhalt, keine
 *    E-Mail-Adresse gespeichert – die Adresse dient nur dem einmaligen Versand.
 * 4. Die Vorschau ist ausdrücklich KEIN Behandlungsergebnis. Nach § 11 HWG
 *    darf mit Vorher-Nachher-Darstellungen nicht für Leistungen geworben
 *    werden; die Ausgabe wird deshalb als unverbindliche Illustration
 *    gekennzeichnet und enthält keine Heilversprechen.
 * 5. Fotos von Minderjährigen sind ausgeschlossen (Bestätigung im Formular).
 *
 * ⚠️ Vor Live-Gang zu klären: Auftragsverarbeitungsvertrag mit Google für die
 * Bildverarbeitung, Eintrag im Verarbeitungsverzeichnis, Ergänzung der
 * Datenschutzerklärung. Siehe ANALYSE.md, Abschnitt "Rechtliche Freigaben".
 */

import type { APIRoute } from 'astro';
import { GoogleGenAI } from '@google/genai';
import nodemailer from 'nodemailer';
import { kartePruefen, karteEinloesen, KARTE_FEHLT_TEXT } from '../../lib/eintrittskarte';

export const prerender = false;

/*
 * Modellnamen als Liste, nicht als einzelner Wert.
 *
 * ── Warum ───────────────────────────────────────────────────────────────
 *
 * Hier stand `gemini-3-flash` als fester Name. Den gibt es unter diesem
 * Namen nicht, und die Antwort darauf ist ein 404 – für die Person vor dem
 * Bildschirm: „Bei der Verarbeitung ist ein Fehler aufgetreten." Eine
 * Zeichenkette legt eine ganze Funktion still, und man sieht es erst, wenn
 * jemand sie benutzt.
 *
 * Modellnamen bei Google veralten planmäßig: Vorschaumodelle tragen
 * `-preview` im Namen und verlieren es beim Wechsel in den Regelbetrieb,
 * alte Fassungen werden abgeschaltet. Ein einzelner fester Name ist deshalb
 * eine Zeitbombe mit einem Ablaufdatum, das niemand kennt.
 *
 * Der Reihe nach probiert: Ein Name, den es nicht gibt, ergibt 404 – das
 * ist eindeutig von einem echten Fehler zu unterscheiden, und dann kommt
 * der nächste dran. Der erste, der antwortet, wird gemerkt.
 *
 * Vorn steht jeweils der Wert aus der Umgebung, falls einer gesetzt ist.
 * Damit lässt sich ein neues Modell einschalten, ohne neu zu bauen.
 */
const BILD_MODELLE = [
  process.env.NANO_BANANA_MODELL,
  'gemini-3-pro-image-preview',
  'gemini-2.5-flash-image',
  'gemini-2.0-flash-preview-image-generation',
].filter((m): m is string => Boolean(m));

const ANALYSE_MODELLE = [
  process.env.GEMINI_ANALYSE_MODELL,
  'gemini-3-flash-preview',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
].filter((m): m is string => Boolean(m));

/** Einmal gefunden, bleibt gefunden – sonst kostet jede Anfrage neue 404er. */
const gemerkt = new Map<string, string>();

function istNichtGefunden(e: unknown): boolean {
  const text = e instanceof Error ? e.message : String(e);
  return /\b404\b|NOT_FOUND|is not found for API version/i.test(text);
}

/**
 * Ruft `arbeit` mit dem ersten Modell auf, das es wirklich gibt.
 *
 * Ein Fehler, der kein 404 ist – aufgebrauchtes Kontingent, gesperrter
 * Schlüssel, Netz –, wird sofort weitergereicht: Dagegen hilft kein anderes
 * Modell, und stur weiterzuprobieren würde den Fehler nur verschleiern.
 */
async function mitModell<T>(
  art: string,
  kandidaten: string[],
  arbeit: (modell: string) => Promise<T>,
): Promise<T> {
  const bekannt = gemerkt.get(art);
  if (bekannt) return arbeit(bekannt);

  let letzter: unknown;
  for (const modell of kandidaten) {
    try {
      const ergebnis = await arbeit(modell);
      gemerkt.set(art, modell);
      if (modell !== kandidaten[0]) {
        console.warn(`[laecheln] ${art}: ${kandidaten[0]} gibt es nicht, nutze ${modell}`);
      }
      return ergebnis;
    } catch (e) {
      if (!istNichtGefunden(e)) throw e;
      letzter = e;
    }
  }

  /* Alle durch. Damit die nächste Korrektur kein Raten ist, steht danach im
     Protokoll, was der Schlüssel tatsächlich anbietet. */
  await verfuegbareModelleMelden();
  throw letzter instanceof Error
    ? letzter
    : new Error(`Kein Modell für ${art} verfügbar: ${kandidaten.join(', ')}`);
}

/** Listet einmalig, was das Konto kann – nur ins Protokoll, nie an den Browser. */
let bereitsGemeldet = false;
async function verfuegbareModelleMelden(): Promise<void> {
  if (bereitsGemeldet) return;
  bereitsGemeldet = true;
  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY ?? '' },
    });
    const daten = (await res.json()) as {
      models?: { name?: string; supportedGenerationMethods?: string[] }[];
    };
    const namen = (daten.models ?? [])
      .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
      .map((m) => m.name?.replace(/^models\//, ''))
      .filter(Boolean);
    console.error(`[laecheln] Verfügbar für diesen Schlüssel: ${namen.join(', ')}`);
  } catch (e) {
    console.error('[laecheln] Modellliste nicht abrufbar:', e instanceof Error ? e.message : e);
  }
}

const MAX_BYTES = 8 * 1024 * 1024;
const ERLAUBTE_TYPEN = ['image/jpeg', 'image/png', 'image/webp'];

/** Ratenbegrenzung: Bildgenerierung ist teuer, das darf niemand ausnutzen. */
const zaehler = new Map<string, { anzahl: number; fenster: number }>();
const LIMIT = 5;
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

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (limitUeberschritten(clientAddress || 'unbekannt')) {
    return antwort(
      { fehler: 'Sie haben die Vorschau mehrfach genutzt. Bitte versuchen Sie es später erneut.' },
      429,
    );
  }

  let formular: FormData;
  try {
    formular = await request.formData();
  } catch {
    return antwort({ fehler: 'Die Anfrage konnte nicht gelesen werden.' }, 400);
  }

  const foto = formular.get('foto');
  const email = String(formular.get('email') ?? '').trim();
  const einwilligung = formular.get('einwilligung') === 'ja';
  const volljaehrig = formular.get('volljaehrig') === 'ja';
  const standort = String(formular.get('standort') ?? '').trim() || null;

  // Honeypot: Ein für Menschen unsichtbares Feld. Ist es ausgefüllt, war es ein Bot.
  if (String(formular.get('website') ?? '') !== '') {
    return antwort({ ok: true }, 200);
  }

  /* Eintrittskarte – siehe src/lib/eintrittskarte.ts. Hier wiegt sie schwerer
     als beim Kontaktformular: Jeder Durchlauf kostet einen Bildabruf bei
     Gemini, also echtes Geld, und zwar bevor überhaupt eine Mail entsteht. */
  const karte = kartePruefen(formular.get('karte'));
  if (!karte.ok) return antwort({ fehler: KARTE_FEHLT_TEXT }, 400);

  if (!einwilligung || !volljaehrig) {
    return antwort(
      { fehler: 'Ohne Ihre ausdrückliche Einwilligung dürfen wir das Foto nicht verarbeiten.' },
      400,
    );
  }

  if (!(foto instanceof File)) {
    return antwort({ fehler: 'Bitte laden Sie ein Foto hoch.' }, 400);
  }

  if (!ERLAUBTE_TYPEN.includes(foto.type)) {
    return antwort({ fehler: 'Bitte laden Sie ein JPEG-, PNG- oder WebP-Bild hoch.' }, 400);
  }

  if (foto.size > MAX_BYTES) {
    return antwort({ fehler: 'Das Bild ist größer als 8 MB. Bitte wählen Sie ein kleineres.' }, 400);
  }

  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) {
    return antwort({ fehler: 'Bitte geben Sie eine gültige E-Mail-Adresse an.' }, 400);
  }

  /* Karte entwerten, bevor sich der Weg gabelt. Stand sie erst vor dem
     Bildabruf, ging sie ohne gesetzten GEMINI_API_KEY nie verloren, weil der
     Demo-Zweig darunter vorher zurückkehrt – dieselbe Lücke wie beim
     Kontaktformular ohne SMTP. Ab hier ist die Einreichung erledigt, in jedem
     Zweig. Die Feldprüfungen liegen davor: Ein abgelehntes Dateiformat soll
     die Karte nicht kosten. */
  karteEinloesen(formular.get('karte'));

  const schluessel = process.env.GEMINI_API_KEY;
  if (!schluessel) {
    return antwort(
      {
        demo: true,
        analyse:
          'Die Lächeln-Vorschau läuft in dieser Testumgebung noch ohne Bild-Schlüssel. Sobald GEMINI_API_KEY gesetzt ist, analysieren wir hier Ihr Foto und erzeugen eine unverbindliche Visualisierung.',
      },
      200,
    );
  }

  try {
    const bytes = Buffer.from(await foto.arrayBuffer());
    const base64 = bytes.toString('base64');
    const ai = new GoogleGenAI({ apiKey: schluessel });

    /* Schritt 1: Analyse. Bewusst beschreibend statt diagnostisch – das Modell
       soll ästhetische Merkmale benennen, keine Befunde stellen. */
    const analyseAntwort = await mitModell('Analyse', ANALYSE_MODELLE, (modell) =>
      ai.models.generateContent({
        model: modell,
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { mimeType: foto.type, data: base64 } },
              {
                text: `Du unterstützt eine Zahnarztpraxis bei einer unverbindlichen ästhetischen Vorschau.

Beschreibe anhand des Fotos in 3 bis 4 Sätzen auf Deutsch, welche Merkmale des Lächelns und der Gesichtsproportionen für eine ästhetische Zahnbehandlung relevant wären: Zahnform, Zahnfarbe im Verhältnis zum Hauttyp, Verlauf der Lachlinie, Symmetrie, Gesichtsform.

STRENGE REGELN:
- Stelle KEINE medizinische Diagnose. Keine Aussagen über Karies, Parodontitis, Kiefergelenke oder andere Erkrankungen.
- Bewerte NICHT die Person, ihr Aussehen oder ihre Attraktivität.
- Nenne KEINE konkrete Behandlungsempfehlung als Zusage, sondern höchstens, welcher Leistungsbereich üblicherweise dazu passt.
- Schreibe sachlich, freundlich und ohne Superlative.
- Wenn auf dem Bild kein Gesicht oder kein Lächeln erkennbar ist, sage das genau so und beschreibe nichts weiter.`,
              },
            ],
          },
        ],
      }),
    );

    const analyse = analyseAntwort.text?.trim() || '';

    if (/kein gesicht|kein lächeln|nicht erkennbar/i.test(analyse)) {
      return antwort(
        {
          fehler:
            'Auf dem Bild ist kein Gesicht mit sichtbarem Lächeln erkennbar. Bitte laden Sie ein frontales Foto hoch, auf dem die Zähne zu sehen sind.',
        },
        422,
      );
    }

    /* Schritt 2: Visualisierung. Der Prompt betont ausdrücklich, dass
       ausschließlich die Zähne verändert werden – Gesichtszüge, Hautbild und
       Identität bleiben unangetastet. Alles andere wäre unehrlich. */
    const bildAntwort = await mitModell('Bild', BILD_MODELLE, (modell) =>
      ai.models.generateContent({
        model: modell,
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { mimeType: foto.type, data: base64 } },
              {
                text: `Bearbeite dieses Porträt so, dass ausschließlich die Zähne natürlich verbessert wirken: gleichmäßige Zahnstellung, harmonische Zahnform und eine natürliche, zum Hautton passende Zahnfarbe.

UNBEDINGT EINHALTEN:
- Verändere NICHTS außer den Zähnen. Gesichtszüge, Hautbild, Hautton, Augen, Lippenform, Frisur, Kleidung und Hintergrund bleiben exakt wie im Original.
- Die Person muss eindeutig als dieselbe Person erkennbar bleiben.
- Das Ergebnis muss natürlich aussehen, nicht künstlich weiß und nicht überzeichnet. Leichte Unregelmäßigkeiten erhalten den realistischen Eindruck.
- Keine Schönheitsfilter, keine Verschlankung, keine Faltenglättung, keine Veränderung des Alters.
- Fotorealistische Qualität, gleiche Belichtung und Bildschärfe wie im Original.`,
              },
            ],
          },
        ],
      }),
    );

    const bildTeil = bildAntwort.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
    const ergebnisBase64 = bildTeil?.inlineData?.data;
    const ergebnisTyp = bildTeil?.inlineData?.mimeType || 'image/png';

    if (!ergebnisBase64) {
      return antwort(
        {
          fehler:
            'Die Visualisierung konnte diesmal nicht erstellt werden. Bitte versuchen Sie es mit einem anderen Foto erneut.',
        },
        502,
      );
    }

    /* Schritt 3: Versand. Schlägt der Versand fehl, ist das kein Grund, der
       Person das Ergebnis vorzuenthalten – sie sieht es ohnehin im Browser. */
    const versandOk = await perMailSenden({
      email,
      analyse,
      bildBase64: ergebnisBase64,
      bildTyp: ergebnisTyp,
      standort,
    });

    return antwort({
      ok: true,
      analyse,
      bild: `data:${ergebnisTyp};base64,${ergebnisBase64}`,
      versandOk,
      hinweis:
        'Diese Darstellung ist eine unverbindliche Illustration und kein Behandlungsergebnis. Was in Ihrem Fall möglich ist, klärt eine persönliche Untersuchung.',
    });
  } catch (e) {
    // Bewusst ohne Bildinhalt oder E-Mail-Adresse im Log.
    console.error('[laecheln] Verarbeitung fehlgeschlagen:', e instanceof Error ? e.message : e);
    return antwort(
      { fehler: 'Bei der Verarbeitung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.' },
      500,
    );
  }
  // Die Puffer werden mit dem Ende der Anfrage vom Garbage Collector
  // eingesammelt – es existiert kein Pfad, über den sie persistiert würden.
};

async function perMailSenden(o: {
  email: string;
  analyse: string;
  bildBase64: string;
  bildTyp: string;
  standort: string | null;
}): Promise<boolean> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_VON } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn('[laecheln] SMTP nicht konfiguriert – Ergebnis wird nur im Browser gezeigt.');
    return false;
  }

  try {
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT ?? 587),
      secure: Number(SMTP_PORT ?? 587) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const terminLink = o.standort
      ? `https://ku64.de/${o.standort}/termine/`
      : 'https://ku64.de/standorte/';

    await transport.sendMail({
      from: MAIL_VON || 'KU64 <noreply@ku64.de>',
      to: o.email,
      subject: 'Ihre Lächeln-Vorschau von KU64',
      text: `Guten Tag,

vielen Dank für Ihr Interesse an KU64.

Im Anhang finden Sie Ihre persönliche Lächeln-Vorschau.

Was uns aufgefallen ist:
${o.analyse}

Wichtig: Diese Darstellung ist eine unverbindliche Illustration und ausdrücklich kein Behandlungsergebnis. Ob und wie sich so etwas umsetzen lässt, kann nur eine persönliche Untersuchung zeigen – jedes Gebiss ist anders.

Termin vereinbaren: ${terminLink}

Zum Datenschutz: Ihr hochgeladenes Foto wurde ausschließlich zur Erstellung dieser Vorschau verarbeitet und nicht gespeichert. Auch diese E-Mail-Adresse haben wir nur für diesen einen Versand verwendet.

Herzliche Grüße
Ihr KU64-Team`,
      attachments: [
        {
          filename: 'ku64-laecheln-vorschau.png',
          content: Buffer.from(o.bildBase64, 'base64'),
          contentType: o.bildTyp,
        },
      ],
    });

    return true;
  } catch (e) {
    console.error('[laecheln] Versand fehlgeschlagen:', e instanceof Error ? e.message : e);
    return false;
  }
}

function antwort(daten: unknown, status = 200) {
  return new Response(JSON.stringify(daten), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // Ergebnisse enthalten personenbezogene Bilder – niemals zwischenspeichern.
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    },
  });
}
