/**
 * Die 360°-Rundgänge – ein Matterport-Modell je Standort.
 *
 * ── Woher die Kennungen stammen ─────────────────────────────────────────
 *
 * Aus dem Quelltext der laufenden Website, am 30. Juli 2026 abgelesen. Drei
 * Standorte haben einen Rundgang, zwei nicht:
 *
 *   Kurfürstendamm      QG8oNc6LV4Q   (stand auf der Startseite)
 *   Hausvogteiplatz     3X2reKbdU3c   (stand auf /berlinmitte/)
 *   Potsdam             xrDfLvjX84w   (stand auf /potsdam/)
 *
 * Wilmersdorf und Charlottenburg haben keinen. Das ist hier als Lücke
 * sichtbar und nicht als Notlösung gefüllt: Ein Rundgang durch eine andere
 * Praxis unter der Überschrift „Unsere Räume" wäre eine Falschangabe.
 *
 * ── Warum nichts von selbst lädt ────────────────────────────────────────
 *
 * Ein Matterport-Modell ist die teuerste Einbettung, die es auf dieser
 * Website gibt: ein eigener WebGL-Betrachter, Texturen im Megabytebereich,
 * dazu Cookies von my.matterport.com. Auf der alten Website stand es als
 * `<iframe>` mitten in der Seite – geladen bei jedem Aufruf, auch von den
 * neun Zehnteln der Besucherinnen, die es nie anfassen.
 *
 * Hier steht zuerst ein Standbild mit einer Schaltfläche. Erst der Klick
 * lädt – und zwar nur, wenn die Einwilligung für Drittanbieter vorliegt.
 * Damit gilt für den Rundgang dasselbe wie für Doctolib: Er entsteht durch
 * eine Handlung, nicht durch einen Seitenaufruf.
 *
 * Das ist zugleich die Antwort auf die Lighthouse-Beanstandung
 * „Reduce unused JavaScript": Ungenutztes JavaScript wird hier nicht
 * verkleinert, sondern gar nicht geladen.
 */

export interface Rundgang {
  /** Slug des Standorts aus `standorte.ts`. */
  standort: string;
  /** Die Modellkennung bei Matterport – der `m`-Parameter. */
  modell: string;
  /**
   * Was man sieht. Steht als Alternativtext am Standbild und als
   * zugänglicher Name an der Schaltfläche – „Rundgang starten" allein sagt
   * einer Vorlesehilfe nicht, durch welche Praxis.
   */
  beschreibung: string;
  /**
   * Standbild aus `bilder.ts`. Ohne Bild steht eine Fläche in Markenfarbe
   * mit dem Namen des Standorts – nie ein grauer Kasten.
   */
  standbild?: string;
}

export const RUNDGAENGE: Rundgang[] = [
  {
    standort: 'berlin-charlottenburg',
    modell: 'QG8oNc6LV4Q',
    beschreibung:
      '360°-Rundgang durch die Praxis am Kurfürstendamm 64: Empfang, die gelbe ' +
      'Landschaft des Wartebereichs, Behandlungszimmer und das eigene Meisterlabor.',
    standbild: 'kudamm-empfang',
  },
  {
    standort: 'berlinmitte',
    modell: '3X2reKbdU3c',
    beschreibung:
      '360°-Rundgang durch die Praxis am Hausvogteiplatz 14: Empfang, Wartebereich ' +
      'und Behandlungszimmer.',
    standbild: 'berlinmitte-empfang',
  },
  {
    standort: 'potsdam',
    modell: 'xrDfLvjX84w',
    beschreibung:
      '360°-Rundgang durch die Praxis in der Berliner Straße 139 in Potsdam: ' +
      'Empfang, Wartebereich und Behandlungszimmer.',
    standbild: 'potsdam-empfang',
  },
];

/**
 * Die Adresse des Betrachters.
 *
 * `play=1` startet die Bewegung, sobald geladen ist – wer geklickt hat, will
 * den Rundgang und nicht noch eine Schaltfläche. `title=0&brand=0` nimmt die
 * Matterport-Werbeleiste heraus; gezeigt werden soll die Praxis.
 *
 * `help=0` schaltet den Hilfe-Überlagerer ab, der sonst über dem ersten Bild
 * liegt und auf dem Telefon die halbe Fläche einnimmt.
 */
export function rundgangAdresse(modell: string): string {
  return `https://my.matterport.com/show/?m=${encodeURIComponent(modell)}&play=1&title=0&brand=0&help=0`;
}

export function rundgangFuer(standortSlug: string): Rundgang | undefined {
  return RUNDGAENGE.find((r) => r.standort === standortSlug);
}
