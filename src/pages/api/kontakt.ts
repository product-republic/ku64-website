/**
 * Nachricht über das Kontaktformular.
 *
 * ── Warum es das braucht ─────────────────────────────────────────────────
 *
 * Es gab kein Formular. Zwei Seiten versprachen trotzdem eines: Die
 * Barrierefreiheitserklärung nennt es als Weg, eine Barriere zu melden, und
 * die KI-Transparenzseite als schriftliche Alternative zum Berater. Beide
 * verwiesen auf /kontakt/, wo nur Adressen standen. Wer eine Barriere melden
 * wollte, weil er das Telefon nicht benutzen kann, fand dort genau den Weg
 * nicht, der ihm zusteht.
 *
 * ── Was hier NICHT passiert ─────────────────────────────────────────────
 *
 * Keine Gesundheitsdaten. Das Formular fragt Name, Adresse und Anliegen –
 * mehr nicht, und der Hinweistext sagt ausdrücklich, dass Befunde und
 * Beschwerden ans Telefon gehören. Eine unverschlüsselte E-Mail ist kein Ort
 * für Artikel-9-Daten, und ein Formular, das danach fragt, lädt dazu ein.
 *
 * Keine Speicherung. Die Nachricht geht als E-Mail an den gewählten Standort
 * und liegt danach dort, wo Praxispost ohnehin liegt. Der Server behält
 * nichts.
 */
import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { STANDORTE, getStandort } from '../../data/standorte';
import { drosseln, zuVieleAnfragen } from '../../lib/drosselung';
import { kartePruefen, karteEinloesen, KARTE_FEHLT_TEXT } from '../../lib/eintrittskarte';

export const prerender = false;

function antwort(inhalt: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(inhalt), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

/* Genügt für die Frage „kann das überhaupt eine Adresse sein". Strenger zu
   prüfen ist zwecklos: Ob eine Adresse existiert, weiß nur der Zustellversuch,
   und gültige Adressen an einer zu strengen Regel scheitern zu lassen, ist der
   teurere Fehler. */
const ADRESSE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const POST: APIRoute = async ({ request }) => {
  const drossel = drosseln(request, 'kontakt', { anzahl: 5, fensterSekunden: 600 });
  if (!drossel.erlaubt) return zuVieleAnfragen(drossel);

  let daten: Record<string, string>;
  try {
    const form = await request.formData();
    daten = Object.fromEntries([...form.entries()].map(([k, v]) => [k, String(v)]));
  } catch {
    return antwort({ fehler: 'Die Angaben konnten nicht gelesen werden.' }, 400);
  }

  /*
   * Honigtopf: ein Feld, das für Menschen unsichtbar ist und das nur
   * ausfüllt, wer Formulare automatisch abarbeitet. Die Antwort ist bewusst
   * ein freundliches „danke" – wer merkt, dass er erkannt wurde, versucht es
   * anders.
   */
  if (daten.website) return antwort({ ok: true });

  /*
   * Eintrittskarte. Anders als der Honigtopf ist das keine Falle, sondern eine
   * Bedingung: Ohne eine Karte, die dieser Server ausgestellt hat, gibt es
   * keine E-Mail. Damit reicht ein `curl` mit passendem `Origin` nicht mehr –
   * genau so ließ sich dieser Endpunkt vorher ansprechen.
   *
   * Hier wird ehrlich abgelehnt, nicht wie beim Honigtopf freundlich getan.
   * Der Honigtopf trifft nur Bots; diese Prüfung kann auch einen Menschen
   * treffen, dessen Formular zwei Stunden offen stand – und der muss erfahren,
   * dass seine Nachricht NICHT angekommen ist.
   */
  const karte = kartePruefen(daten.karte);
  if (!karte.ok) return antwort({ fehler: KARTE_FEHLT_TEXT }, 400);

  const name = (daten.name ?? '').trim();
  const email = (daten.email ?? '').trim();
  const nachricht = (daten.nachricht ?? '').trim();
  const standort = getStandort(daten.standort ?? '') ?? STANDORTE[0];

  const fehlt: string[] = [];
  if (name.length < 2) fehlt.push('Ihr Name');
  if (!ADRESSE.test(email)) fehlt.push('eine E-Mail-Adresse, an die wir antworten können');
  if (nachricht.length < 10) fehlt.push('Ihr Anliegen');

  if (fehlt.length > 0) {
    return antwort(
      {
        fehler: `Damit wir antworten können, fehlt noch: ${fehlt.join(', ')}.`,
      },
      400,
    );
  }

  if (nachricht.length > 5000) {
    return antwort(
      {
        fehler:
          'Die Nachricht ist sehr lang. Bitte fassen Sie sich kürzer – oder rufen Sie an, das geht schneller.',
      },
      400,
    );
  }

  /*
   * Karte entwerten – hier und nicht später.
   *
   * Zuerst stand diese Zeile direkt vor `sendMail`, was richtig aussah: erst
   * einlösen, wenn die Mail wirklich rausgeht. Die Gegenprobe hat gezeigt, was
   * daran falsch war. Ohne eingerichtetes SMTP kehrt der Endpunkt weiter unten
   * zum `mailto`-Ausweichweg zurück – und zwar VOR dieser Zeile. Dieselbe
   * Karte ging damit beliebig oft durch; genau die Wiederverwendung, die sie
   * verhindern soll. Solange kein Postausgang eingerichtet ist, wäre die
   * Einmaligkeit also wirkungslos gewesen, und das ist heute der Normalfall.
   *
   * Die Stelle jetzt: nach der Feldprüfung (ein Tippfehler verbraucht die
   * Karte nicht) und vor jeder Verzweigung, die eine Antwort erzeugt – egal
   * ob per SMTP oder als fertiger `mailto:`-Link. Beides ist eine erledigte
   * Einreichung.
   */
  karteEinloesen(daten.karte);

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_VON } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    /*
     * Kein Postausgang eingerichtet – aber deshalb muss die Nachricht nicht
     * verloren gehen.
     *
     * Ein Formular, das immer scheitert, ist schlechter als keines: Wer es
     * ausfüllt, hat die Zeit investiert und steht mit einer Fehlermeldung da.
     * Stattdessen bekommt der Browser hier eine fertige `mailto:`-Adresse mit
     * Betreff und Text – ein Klick, und die Nachricht liegt im eigenen
     * E-Mail-Programm, adressiert an den richtigen Standort.
     *
     * Sobald SMTP_HOST, SMTP_USER und SMTP_PASS gesetzt sind, entfällt dieser
     * Weg von selbst.
     */
    console.warn('[kontakt] SMTP nicht eingerichtet – Ausweichweg über das E-Mail-Programm.');
    const koerper = [`Name: ${name}`, `E-Mail: ${email}`, '', nachricht].join('\n');
    return antwort({
      mailto: `mailto:${standort.email}?subject=${encodeURIComponent(
        `Anfrage über die Website – ${name}`,
      )}&body=${encodeURIComponent(koerper)}`,
      hinweis:
        'Der automatische Versand ist noch nicht eingerichtet. Ihre Nachricht ist aber fertig – ein Klick öffnet sie in Ihrem E-Mail-Programm.',
    });
  }

  try {
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT ?? 587),
      secure: Number(SMTP_PORT ?? 587) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transport.sendMail({
      from: MAIL_VON ?? SMTP_USER,
      to: standort.email,
      /* Antworten geht direkt an die Person, ohne Adresse heraussuchen. */
      replyTo: `${name} <${email}>`,
      subject: `Kontaktformular – ${name}`,
      text: [
        `Über das Kontaktformular der Website, Standort ${standort.name}.`,
        '',
        `Name:    ${name}`,
        `E-Mail:  ${email}`,
        '',
        nachricht,
      ].join('\n'),
    });
  } catch (e) {
    console.error('[kontakt] Versand fehlgeschlagen:', e);
    return antwort(
      {
        fehler: `Die Nachricht ließ sich nicht zustellen. Bitte rufen Sie uns an: ${standort.telefon}.`,
      },
      502,
    );
  }

  return antwort({
    ok: true,
    hinweis: `Ihre Nachricht ist bei KU64 ${standort.name} eingegangen. Wir melden uns – in der Regel am selben oder nächsten Werktag.`,
  });
};
