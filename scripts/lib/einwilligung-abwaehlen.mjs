/**
 * Den Auswahldialog beantworten, bevor eine Prüfung anfängt zu klicken.
 *
 * ── Wofür ───────────────────────────────────────────────────────────────
 *
 * `Einwilligung.astro` öffnet beim ersten Aufruf ein `<dialog>` als Modal.
 * Ein Modal fängt jeden Klick ab, der nicht in ihm landet – und genau das
 * soll es. Für eine Prüfung, die Bedienelemente der Seite anklickt, heißt
 * das: Ohne Antwort läuft jeder Klick in einen 30-Sekunden-Timeout.
 *
 * So ist `klickpfad.mjs` rot geworden, ohne dass jemand etwas an ihm
 * geändert hätte: 10 von 12 Prüfungen, alle mit derselben Meldung
 * („locator.click: Timeout"), und der Abbruchtext behauptete, ein Skript
 * überlebe den Seitenwechsel nicht. Er misst also seit dem Einbau der
 * Einwilligung den Dialog und nicht die Seite. Eine Prüfung, die etwas
 * anderes misst als das, was sie behauptet, ist schlimmer als keine.
 *
 * ── Warum ABLEHNEN und nicht zustimmen ──────────────────────────────────
 *
 * „Nur das Notwendige" ist der strengere Zustand: Was danach noch
 * funktioniert, funktioniert für jede Besucherin. Prüfte man mit voller
 * Zustimmung, bliebe unbemerkt, dass eine eigene Funktion an einer
 * Einwilligung hängt, die sie gar nicht braucht.
 *
 * ── Warum nicht der Speicher vorbelegt wird ─────────────────────────────
 *
 * Naheliegend wäre, `localStorage` vor dem Laden zu füllen. Dafür müsste
 * das Skript die `VERZEICHNIS_FASSUNG` aus `dienste.ts` kennen – und wenn
 * die sich ändert, verwirft die Seite den Eintrag stillschweigend, der
 * Dialog steht wieder da und die Prüfung läuft wieder in Timeouts. Die
 * Zahl stünde dann an zwei Stellen, von denen nur eine gepflegt wird.
 *
 * Der Klick auf den echten Knopf hat diese Kopplung nicht: Die Seite
 * schreibt ihre eigene Fassung, und der Eintrag gilt für alle weiteren
 * Aufrufe desselben Kontexts.
 */

/**
 * Beantwortet den Dialog mit „Nur das Notwendige", falls er offen ist.
 *
 * @param {import('playwright').Page} seite
 * @returns {Promise<'beantwortet' | 'war-zu' | 'bleibt-offen'>}
 */
export async function nurNotwendiges(seite) {
  const offen = await seite.evaluate(() => Boolean(document.querySelector('dialog[open]')));
  if (!offen) return 'war-zu';

  await seite.evaluate(() => document.querySelector('[data-ew="ablehnen"]')?.click());
  await seite.waitForTimeout(200);

  const nochOffen = await seite.evaluate(() => Boolean(document.querySelector('dialog[open]')));
  return nochOffen ? 'bleibt-offen' : 'beantwortet';
}
