/**
 * Eintrittskarte für die Endpunkte, die eine E-Mail auslösen.
 *
 * ── Warum ─────────────────────────────────────────────────────────────────
 *
 * Vor den Postfächern der Praxis standen drei Schranken, und alle drei sind
 * gut – aber keine verlangt, dass überhaupt jemand die Seite geöffnet hat:
 *
 *   Astro prüft `Origin`.  Das schützt gegen fremde Websites, nicht gegen
 *                          Skripte: Ein Browser darf den Kopf nicht fälschen,
 *                          `curl -H "Origin: …"` schon. Nachgestellt, nicht
 *                          vermutet – so ist diese Datei entstanden.
 *   Honigtopf.             Fängt, wer Formulare stumpf ausfüllt. Wer das Feld
 *                          kennt, lässt es leer.
 *   Drosselung.            Begrenzt die Menge je Adresse, verhindert aber
 *                          nicht, dass fünf Mails ankommen, und nicht, dass
 *                          jemand mit vielen Adressen kommt.
 *
 * Was fehlte, ist die einfachste Frage von allen: Warst du vorher hier?
 *
 * ── Wie ───────────────────────────────────────────────────────────────────
 *
 * Der Server stellt eine Karte aus, das Formular schickt sie beim Absenden
 * zurück. Die Karte ist signiert, gilt nur einmal, hat ein Mindestalter und
 * ein Höchstalter.
 *
 * Das Mindestalter ist der eigentliche Filter. Ein Mensch braucht zum Lesen,
 * Tippen und Anhaken Sekunden; ein Skript, das Karte holt und sofort absendet,
 * braucht Millisekunden. Wer die drei Sekunden abwartet, hat pro Nachricht
 * eine Wartezeit – und genau das macht Massenversand unattraktiv.
 *
 * ── Was das NICHT ist ─────────────────────────────────────────────────────
 *
 * Kein Nachweis, dass ein Mensch am Gerät sitzt. Wer es darauf anlegt, holt
 * eine Karte, wartet, sendet. Das ist der ehrliche Stand: Die Karte macht
 * automatisierten Versand teuer und zweistufig, sie macht ihn nicht unmöglich.
 * Ein echter Menschentest hieße CAPTCHA, hieße Drittanbieter, hieße IP-Adresse
 * an Google oder Cloudflare – vor der Einwilligung, weil eine Prüfung nach der
 * Einwilligung nichts mehr nützt. Das widerspricht allem, was auf dieser
 * Website sonst gilt (siehe `dienste.ts`), und wäre der einzige Dienst, der
 * ungefragt lädt.
 *
 * ── Was NICHT gespeichert wird ────────────────────────────────────────────
 *
 * Keine IP, keine Kennung, kein Cookie. Im Speicher steht nur, welche
 * Zufallswerte schon eingelöst wurden – Zahlen ohne Bezug zu einer Person.
 */
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

/* Wechselt bei jedem Start – wie der Streuwert der Drosselung. Ein Neustart
   entwertet ausgestellte Karten; das passiert beim Deploy, nicht unter Last,
   und der Besucher bekommt dann eine neue Karte statt einer Fehlermeldung
   (siehe `karteFehlt` unten: Das Formular holt sie bei Bedarf nach). */
const GEHEIMNIS = randomBytes(32);

/** Schneller als ein Mensch tippen kann. Darunter war es kein Mensch. */
const MINDESTALTER_MS = 3_000;

/** Danach ist die Karte alt. Wer ein Formular länger offen hat, holt eine neue. */
const HOECHSTALTER_MS = 2 * 60 * 60 * 1000;

/* Eingelöste Karten. Ohne diese Menge ließe sich eine gültige Karte beliebig
   oft einreichen – signiert ist sie ja. */
const eingeloest = new Map<string, number>();
let letztesAufraeumen = 0;

function aufraeumen(jetzt: number): void {
  if (jetzt - letztesAufraeumen < 5 * 60 * 1000) return;
  for (const [z, t] of eingeloest) {
    if (jetzt - t > HOECHSTALTER_MS) eingeloest.delete(z);
  }
  letztesAufraeumen = jetzt;
}

function signieren(nutzlast: string): string {
  return createHmac('sha256', GEHEIMNIS).update(nutzlast).digest('base64url');
}

/**
 * Stellt eine Karte aus. Der Zeitpunkt steckt in der Karte selbst – der Server
 * muss sich nichts merken, um das Alter später zu prüfen.
 */
export function karteAusstellen(): string {
  const nutzlast = `${Date.now()}.${randomBytes(12).toString('base64url')}`;
  return `${nutzlast}.${signieren(nutzlast)}`;
}

export interface Kartenpruefung {
  ok: boolean;
  /** Kurz und maschinenlesbar – landet nicht im Text für den Besucher. */
  grund?: 'fehlt' | 'form' | 'signatur' | 'zu-schnell' | 'zu-alt' | 'schon-benutzt';
}

/**
 * Prüft eine zurückgegebene Karte – ohne sie zu verbrauchen.
 *
 * Prüfen und Einlösen sind getrennt, und das ist keine Förmlichkeit. Zuerst
 * standen sie zusammen, und damit war die Karte weg, sobald der Endpunkt sie
 * angesehen hatte – auch wenn die Nachricht danach an einer Kleinigkeit
 * scheiterte, etwa einem Tippfehler in der Adresse. Wer den Fehler korrigierte
 * und sofort erneut sendete, bekam zur Antwort, sein Formular sei „zu schnell
 * abgeschickt" worden. Also: Der Endpunkt prüft früh und löst erst ein, wenn
 * feststeht, dass die Nachricht auch rausgeht.
 *
 * Die Reihenfolge innerhalb der Prüfung ist ebenfalls Absicht: erst die
 * Signatur, dann alles andere. Wer eine Karte erfindet, soll nicht aus der
 * Fehlermeldung lernen, welcher Teil ihm fehlt.
 */
export function kartePruefen(karte: unknown): Kartenpruefung {
  if (typeof karte !== 'string' || karte === '') return { ok: false, grund: 'fehlt' };

  const teile = karte.split('.');
  if (teile.length !== 3) return { ok: false, grund: 'form' };
  const [zeitText, zufall, unterschrift] = teile;

  const erwartet = signieren(`${zeitText}.${zufall}`);
  /* `timingSafeEqual` statt `===`: Ein Vergleich, der bei der ersten
     Abweichung abbricht, verrät über die Laufzeit, wie viele Zeichen stimmten. */
  const a = Buffer.from(unterschrift);
  const b = Buffer.from(erwartet);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false, grund: 'signatur' };

  const ausgestellt = Number(zeitText);
  if (!Number.isFinite(ausgestellt)) return { ok: false, grund: 'form' };

  const jetzt = Date.now();
  const alter = jetzt - ausgestellt;
  if (alter < MINDESTALTER_MS) return { ok: false, grund: 'zu-schnell' };
  if (alter > HOECHSTALTER_MS) return { ok: false, grund: 'zu-alt' };

  aufraeumen(jetzt);
  if (eingeloest.has(zufall)) return { ok: false, grund: 'schon-benutzt' };

  return { ok: true };
}

/**
 * Entwertet die Karte. Ab hier gilt sie als benutzt.
 *
 * Wird unmittelbar vor dem teuren Teil aufgerufen – vor dem Mailversand, vor
 * dem Bildabruf. Zwischen `kartePruefen` und hier darf nichts liegen, was
 * länger dauert als nötig: In dieser Lücke wäre dieselbe Karte zweimal gültig.
 */
export function karteEinloesen(karte: unknown): void {
  if (typeof karte !== 'string') return;
  const zufall = karte.split('.')[1];
  if (zufall) eingeloest.set(zufall, Date.now());
}

/**
 * Der Text, den der Besucher sieht, wenn die Karte nicht passt.
 *
 * Bewusst derselbe für jeden Grund und bewusst eine Handlungsanweisung: Wer
 * ein Formular zwei Stunden offen hatte, hat nichts falsch gemacht und soll
 * nicht lesen, dass er wie ein Bot aussah.
 */
export const KARTE_FEHLT_TEXT =
  'Das Formular war zu lange offen oder wurde zu schnell abgeschickt. ' +
  'Bitte laden Sie die Seite neu und versuchen Sie es noch einmal.';
