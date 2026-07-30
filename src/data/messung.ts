/**
 * Die Messkennungen – abgelesen aus der laufenden Website.
 *
 * ── Warum das hier stehen darf ──────────────────────────────────────────
 *
 * Eine GA4-Messkennung ist kein Geheimnis. Sie steht im Quelltext jeder Seite,
 * die Analytics einbindet, und ist damit für jeden lesbar, der „Quelltext
 * anzeigen" drückt. Wer sie kennt, kann Ereignisse in die Auswertung
 * schreiben – aber keine Daten lesen. Ein Zugriff auf die Auswertung selbst
 * hängt am Google-Konto.
 *
 * Deshalb im Quelltext und nicht in einer Umgebungsvariablen: Eine Kennung,
 * die für jeden sichtbar ist, in einer Variablen zu verstecken, sieht nach
 * Sicherheit aus, ohne welche zu sein – und niemand weiß mehr, welche Kennung
 * eigentlich gemeint ist. Was in eine Umgebungsvariable gehört, sind die
 * Schlüssel in `.env`: die für Gemini, Anthropic und ElevenLabs.
 *
 * ── Woher die Werte stammen ─────────────────────────────────────────────
 *
 * Aus dem Quelltext von ku64.de, am 30. Juli 2026 abgelesen:
 *
 *   G-6RDWJ4SBHT     Google Analytics 4      wird übernommen
 *   GTM-TL2T6K8      Google Tag Manager      wird NICHT übernommen
 *   25985109         HubSpot-Portal          wird NICHT übernommen
 *
 * Dieselbe Messkennung weiterzuverwenden ist die richtige Entscheidung: Ein
 * neues Datenkonto hieße, die Zeitreihe zu zerschneiden. Genau die will man
 * beim Relaunch aber sehen – ob die Zahlen nach der Umstellung steigen oder
 * fallen, lässt sich nur im selben Konto beantworten.
 *
 * Warum der Tag Manager nicht mitkommt, steht in `dienste.ts` beim Eintrag
 * `google-tag-manager`. Kurz: Er kann jederzeit weitere Skripte nachladen,
 * und damit wäre jede Aussage dieser Website über Drittanbieter hinfällig.
 *
 * ── Umstellung im Analytics-Konto ───────────────────────────────────────
 *
 * Zwei Dinge muss die Praxis dort tun, und beide kann Technik nicht:
 *
 *   1. Einen Auftragsverarbeitungsvertrag mit Google schließen, falls nicht
 *      vorhanden. Ohne ihn ist die Verarbeitung rechtswidrig, auch mit
 *      Einwilligung. `avVertrag: false` in `dienste.ts` steht deshalb so
 *      lange, bis das bestätigt ist – und `/cookies/` weist darauf hin.
 *
 *   2. Eine Anmerkung zum Umstellungstag setzen. Ohne sie sucht in einem
 *      halben Jahr jemand die Ursache eines Sprungs in den Zahlen.
 */

/** Google Analytics 4. Leer lassen schaltet die Messung ab. */
export const MESSKENNUNG = 'G-6RDWJ4SBHT';

/**
 * Adressen, die nicht gemessen werden.
 *
 * Die Vorschau und der eigene Rechner. Ohne diese Regel mischen sich die
 * Klicks der Agentur und jeder Testlauf in die Zahlen der Praxis – und der
 * erste Bericht nach dem Livegang ist unbrauchbar.
 *
 * Dieselbe Liste steuert im Server die `noindex`-Sperre. Sie steht hier
 * trotzdem eigenständig, weil beides verschiedene Fragen sind: Eine
 * Vorschau, die versehentlich indexiert wird, ist ein SEO-Problem; eine, die
 * mitgemessen wird, verfälscht Daten. Wer eines abschaltet, soll nicht
 * ungewollt das andere mit abschalten.
 */
export const NICHT_MESSEN = ['localhost', '127.0.0.1', '.up.railway.app'];

/** Läuft diese Seite auf einem Host, der gemessen werden soll? */
export function messenErlaubt(host: string): boolean {
  const h = host.toLowerCase().split(':')[0];
  return !NICHT_MESSEN.some((m) => (m.startsWith('.') ? h.endsWith(m) : h === m));
}
