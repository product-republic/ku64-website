/**
 * Skripte, die nach jedem Seitenwechsel wieder greifen.
 *
 * ── Das Problem, für das es diese Datei gibt ────────────────────────────
 *
 * Die Website wechselt Seiten im Browser (`<ClientRouter />`): Statt das
 * Dokument neu zu laden, holt sie die neue Seite und tauscht den Körper aus.
 * Das ist der Grund, warum der Wechsel weich ist und der Kopf beim Klicken
 * nicht flackert.
 *
 * Nur laufen Skripte dabei nicht noch einmal. Ein Modul wird pro Adresse
 * genau einmal ausgewertet – danach ist es fertig, egal wie oft der Körper
 * darunter ausgetauscht wird. Wer also beim Start
 *
 *     const knopf = document.querySelector('.menue-knopf');
 *     knopf.addEventListener('click', …);
 *
 * schreibt, hängt seinen Zuhörer an ein Element, das nach dem ersten
 * Seitenwechsel nicht mehr im Dokument steht. Der Knopf, den man dann sieht,
 * ist ein anderer, und er hört auf niemanden mehr.
 *
 * Nach außen sah das genau so aus, wie es die Praxis gemeldet hat: Es
 * funktioniert einmal, danach hängt es. Kein Fehler in der Konsole, keine
 * kaputte Adresse – nur ein Knopf, der nichts tut. Betroffen war alles
 * Angeklickte: das mobile Menü, der Filter im Team, die Suche, der
 * Cookie-Dialog, der Lesefortschritt, das wandernde Feld im Menü.
 *
 * ── Die Regel ───────────────────────────────────────────────────────────
 *
 * Alles, was ein Element aus der Seite greift, läuft hier durch. Dann läuft
 * es nach jedem Aufbau erneut – beim ersten Laden genauso wie nach jedem
 * Wechsel, denn `astro:page-load` meldet beides.
 *
 * Was an `document`, `window` oder `localStorage` hängt, darf draußen
 * bleiben: Diese Objekte überleben den Austausch. Im Zweifel gehört es
 * trotzdem hier hinein – ein zweites Mal aufgebaut zu werden schadet nicht,
 * gar nicht aufgebaut zu werden schon.
 */

/**
 * @param start Wird nach jedem Seitenaufbau gerufen. Gibt sie eine Funktion
 *   zurück, läuft diese vor dem nächsten Austausch – für Beobachter und
 *   Zeitgeber, die sonst auf Elemente zeigen würden, die es nicht mehr gibt.
 */
export function beimSeitenaufbau(start: () => void | (() => void)): void {
  let aufraeumen: void | (() => void);

  document.addEventListener('astro:page-load', () => {
    aufraeumen = start();
  });

  document.addEventListener('astro:before-swap', () => {
    if (typeof aufraeumen === 'function') aufraeumen();
    aufraeumen = undefined;
  });
}
