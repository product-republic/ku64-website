/**
 * Überschriftenebenen für übernommene Texte geradeziehen.
 *
 * ── Das Problem ─────────────────────────────────────────────────────────
 *
 * Blogbeiträge und Beschwerdeseiten stammen aus dem Bestand der Praxis. Ihre
 * Überschriften tragen die Ebenen, die dort im Redaktionssystem standen –
 * und manche Beiträge beginnen mit einer H3, weil sie im alten Layout unter
 * etwas anderem hingen, das es hier nicht mehr gibt.
 *
 * Auf der neuen Seite steht darüber die H1 des Beitrags. Von H1 direkt auf
 * H3 lässt eine Ebene aus. Wer sich mit einem Screenreader über die
 * Überschriftenliste durch eine Seite bewegt – eine der häufigsten
 * Navigationsarten überhaupt –, sieht dort eine Lücke und muss raten, ob
 * etwas fehlt.
 *
 * ── Warum nicht in den Daten korrigieren ────────────────────────────────
 *
 * Weil die Daten die Vorlage abbilden und nicht deren Darstellung. Dieselbe
 * Überschrift kann in einem anderen Zusammenhang wieder richtig sein. Die
 * Ebene ist eine Eigenschaft der Seite, auf der der Text steht, nicht des
 * Textes.
 *
 * ── Was die Funktion tut ────────────────────────────────────────────────
 *
 * Sie hält die Verschachtelung ein und schließt nur die Lücken: Eine Ebene
 * tiefer bleibt eine Ebene tiefer, eine Ebene höher bleibt eine Ebene höher
 * – aber gesprungen wird nie um mehr als eine Stufe, und flacher als H2 wird
 * es nicht, weil die H1 der Seite gehört.
 *
 *     H3 H3 H4 H3   →   H2 H2 H3 H2
 *     H2 H4 H4 H3   →   H2 H3 H3 H2
 */

/**
 * @param stufen Die Ebenen in der Reihenfolge, in der sie im Text stehen –
 *   2 für H2, 3 für H3 und so weiter.
 * @returns Dieselbe Anzahl Ebenen, ohne Sprünge, beginnend bei 2.
 */
export function ebenenGeradeziehen(stufen: number[]): number[] {
  const aus: number[] = [];
  let vorherEin = 0;
  let vorherAus = 1; // die H1 der Seite

  for (const ein of stufen) {
    let stufe: number;
    if (vorherEin === 0 || ein > vorherEin) stufe = vorherAus + 1;
    else if (ein === vorherEin) stufe = vorherAus;
    else stufe = vorherAus - (vorherEin - ein);

    stufe = Math.min(6, Math.max(2, stufe));
    aus.push(stufe);
    vorherEin = ein;
    vorherAus = stufe;
  }

  return aus;
}

/** `h2` → 2. Alles, was keine Überschrift ist, ergibt 0. */
export function alsStufe(art: string): number {
  const m = /^h([1-6])$/i.exec(art);
  return m ? Number(m[1]) : 0;
}
