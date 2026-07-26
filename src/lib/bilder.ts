/**
 * Bildregel für die gesamte Website.
 *
 * Vorgabe: Es soll kein Stock-Foto mehr zu sehen sein. Selbst erzeugte Bilder
 * sind willkommen, wenn sie einen direkten Bezug haben – sonst lieber gar kein
 * Bild.
 *
 * Diese Regel steht deshalb nicht nur in einem Dokument, sondern im Typsystem:
 * Es gibt schlicht keine Herkunft "Stock". Wer ein Bild einbauen will, muss
 * angeben, woher es kommt und was es zeigt – sonst kompiliert es nicht.
 *
 * ── Die drei zulässigen Fälle ──────────────────────────────────────────────
 *
 * 1. `praxis` – eine echte Aufnahme aus einer KU64-Praxis, von einem echten
 *    Team oder einer echten Behandlungssituation. Braucht Urheber und, sobald
 *    Menschen erkennbar sind, deren Einwilligung.
 *
 * 2. `generiert` – selbst erzeugt, mit direktem inhaltlichem Bezug. Zulässig
 *    für Schematisches und Typografisches: Ablaufdiagramme, Vorschaubilder mit
 *    echten Standortdaten, abstrakte Muster.
 *
 * 3. Kein Bild. Der Normalfall, wenn 1 und 2 nicht zutreffen. Eine gute
 *    Textseite ohne Bild ist besser als eine mit beliebigem Füllmaterial.
 *
 * ── Was ausdrücklich NICHT geht ────────────────────────────────────────────
 *
 * Ein generiertes Bild darf **keinen real existierenden Ort und keinen real
 * existierenden Menschen darstellen**. Ein KI-erzeugtes "Empfangsbereich KU64
 * Potsdam" wäre schlimmer als ein Stock-Foto: Das Stock-Foto behauptet nicht,
 * diese Praxis zu sein – das generierte schon. Dasselbe gilt für Teamfotos.
 * Für Praxis und Team gibt es genau einen zulässigen Weg: echte Aufnahmen.
 *
 * Ebenso unzulässig sind erzeugte Vorher-Nachher-Darstellungen als
 * Werbemotiv (§ 11 HWG). Die Lächeln-Vorschau ist davon nicht berührt: Dort
 * entsteht das Bild aus dem eigenen Foto der Person, auf ihre Einwilligung
 * hin, und wird ausdrücklich als unverbindliche Illustration gekennzeichnet.
 */

export type Bildherkunft = 'praxis' | 'generiert';

export interface Bildnachweis {
  /** Pfad unter /public, z. B. "/praxis/potsdam-empfang.jpg". */
  pfad: string;
  /**
   * Alternativtext. Beschreibt, was zu sehen ist – nicht, was es bedeuten soll.
   * Pflichtangabe: Ein Bild ohne Alternativtext ist für Screenreader wertlos.
   */
  alt: string;
  herkunft: Bildherkunft;
  /**
   * Warum dieses Bild an dieser Stelle steht. Zwingt beim Einbauen zu der
   * Frage, ob es überhaupt einen Bezug gibt.
   */
  bezug: string;
  /** Bei `praxis`: wer es aufgenommen hat. Bei `generiert`: womit erzeugt. */
  urheber: string;
  /** Liegt für erkennbare Personen eine Einwilligung vor? */
  einwilligungVorhanden?: boolean;
  breite: number;
  hoehe: number;
}

/**
 * Prüft einen Bildnachweis. Fehlt etwas, wird das Bild nicht ausgeliefert –
 * lieber kein Bild als eines mit ungeklärter Herkunft.
 */
export function nachweisGueltig(b: Bildnachweis): { ok: boolean; grund?: string } {
  if (!b.pfad) return { ok: false, grund: 'Kein Pfad angegeben.' };
  if (!b.alt?.trim()) return { ok: false, grund: 'Alternativtext fehlt.' };
  if (!b.bezug?.trim()) return { ok: false, grund: 'Kein inhaltlicher Bezug begründet.' };
  if (!b.urheber?.trim()) return { ok: false, grund: 'Urheber nicht benannt.' };

  if (b.herkunft === 'praxis' && b.einwilligungVorhanden === false) {
    return { ok: false, grund: 'Einwilligung der abgebildeten Personen fehlt.' };
  }

  return { ok: true };
}

/**
 * Verzeichnis aller echten Bilder der Website.
 *
 * ⚠️ AKTUELL LEER – und das ist der korrekte Zustand, nicht eine Lücke im Bau.
 * Es liegen keine echten Praxisaufnahmen vor (ku64.de war nicht abrufbar, siehe
 * ANALYSE.md). Statt Platzhalter einzusetzen, zeigt die Website an diesen
 * Stellen kein Bild.
 *
 * Welche Aufnahmen gebraucht werden, steht in BILDER.md.
 */
export const BILDER: Record<string, Bildnachweis> = {};

export function getBild(schluessel: string): Bildnachweis | undefined {
  const b = BILDER[schluessel];
  if (!b) return undefined;
  return nachweisGueltig(b).ok ? b : undefined;
}
