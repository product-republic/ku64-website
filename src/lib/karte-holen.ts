/**
 * Holt eine Eintrittskarte und legt sie ins Formular.
 *
 * Wird beim Seitenaufbau aufgerufen, nicht beim Absenden. Das ist Absicht: Die
 * Karte muss mindestens drei Sekunden alt sein (siehe
 * `src/lib/eintrittskarte.ts`). Wer sie erst beim Klick auf „Senden" holt,
 * baut sich diese Wartezeit selbst ein und lässt den Besucher dafür warten.
 * Beim Seitenaufbau geholt, ist sie längst reif, wenn ein Mensch mit dem
 * Tippen fertig ist.
 */
export async function karteHolen(formular: HTMLFormElement): Promise<void> {
  const feld = formular.querySelector<HTMLInputElement>('input[name="karte"]');
  if (!feld) return;
  try {
    const antwort = await fetch('/api/eintrittskarte/', {
      headers: { accept: 'application/json' },
    });
    if (!antwort.ok) return;
    const daten = await antwort.json();
    if (typeof daten.karte === 'string') feld.value = daten.karte;
  } catch {
    /* Netz weg, Endpunkt weg, was auch immer: Hier passiert nichts. Das Feld
       bleibt leer, der Server lehnt ab und sagt dem Besucher, dass er die
       Seite neu laden soll. Eine Fehlermeldung an dieser Stelle wäre eine
       zweite Meldung für denselben Vorgang. */
  }
}
