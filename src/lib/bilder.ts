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
  /**
   * Pfad unter /public **ohne Endung**, z. B. "/praxis/potsdam-empfang".
   *
   * Ohne Endung, weil jedes Bild in drei Formaten und zwei Breiten vorliegt
   * und der Browser wählt. Die Endung anzugeben hieße, die Wahl hier zu
   * treffen – und zwar für alle gleich, also für die meisten falsch.
   * `scripts/praxisbilder-aufbereiten.mjs` erzeugt die Fassungen.
   */
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
 * ── Woher die vier Standortaufnahmen kommen ────────────────────────────────
 *
 * Aus dem öffentlichen Bestand von ku64.de, erhoben durch
 * `analyse/altbestand/crawl.mjs`, geholt durch
 * `analyse/altbestand/medien-holen.mjs`, aufbereitet durch
 * `scripts/praxisbilder-aufbereiten.mjs`. Der Feldname `quelle` nennt die
 * Ursprungsdatei, damit die Herkunft nachvollziehbar bleibt.
 *
 * ── Warum diese vier und nicht die schöneren ───────────────────────────────
 *
 * Die bekannteste Aufnahme des Kurfürstendamms – der gelbe Empfangstresen –
 * zeigt zwei Mitarbeiterinnen erkennbar. Ob dafür eine Einwilligung vorliegt,
 * weiß hier niemand, und ohne Einwilligung ist ein Personenfoto keine Frage
 * des Geschmacks, sondern des Rechts. Genommen ist deshalb der Flur mit der
 * Grünwand: dieselbe Architektur, dieselbe Praxis, keine Person darauf.
 *
 * Dasselbe Kriterium für die anderen drei. Sobald für Aufnahmen mit Menschen
 * eine Einwilligung vorliegt, sind sie die besseren Bilder – bis dahin nicht.
 *
 * ── Was noch fehlt ─────────────────────────────────────────────────────────
 *
 * Behandlungszimmer, Kinderbereich, Meisterlabor und Teamfotos. Der Bestand
 * hat sie (siehe `medien-live.json`), aber sie brauchen je Bild eine
 * Zuordnung und bei Personen eine Einwilligung. BILDER.md führt die Liste.
 */
export const BILDER: Record<string, Bildnachweis> = {
  'standort-berlin-charlottenburg': {
    pfad: '/praxis/berlin-charlottenburg-flur',
    alt: 'Flur der Praxis am Kurfürstendamm: eine geschwungene gelbe Decke, dahinter eine raumhohe Wand aus lebenden Pflanzen, rechts ein verglastes Behandlungszimmer.',
    herkunft: 'praxis',
    bezug:
      'Die Architektur von GRAFT ist das Erkennungsmerkmal dieses Standorts. Wer die Praxis betritt, steht in genau diesem Flur.',
    urheber: 'KU64 – Die Zahnspezialisten (Aufnahme aus dem Bestand von ku64.de)',
    breite: 1600,
    hoehe: 1135,
  },
  'standort-berlinmitte': {
    pfad: '/praxis/berlinmitte-empfang',
    alt: 'Empfangsbereich am Hausvogteiplatz: ein Tresen aus hellem Naturstein, dahinter eine offene Treppe vor dunkler Holzlamellenwand, davor Sessel auf runden Teppichen und eine bodentiefe Fensterfront zur Straße.',
    herkunft: 'praxis',
    bezug:
      'Der Empfang ist der erste Raum, den jemand mit einem Termin in Berlin-Mitte sieht. Die alte Website zeigte hier den Kurfürstendamm.',
    urheber: 'KU64 – Die Zahnspezialisten (Aufnahme aus dem Bestand von ku64.de)',
    breite: 1440,
    hoehe: 1295,
  },
  'standort-potsdam': {
    pfad: '/praxis/potsdam-empfang',
    alt: 'Wartebereich im Palais Ritz in Potsdam: Sessel um einen niedrigen Tisch auf rotem Teppich, daneben ein Kamin unter einem geschwungenen Holzbogen, im Hintergrund hohe Sprossenfenster.',
    herkunft: 'praxis',
    bezug:
      'Der Wartebereich im Palais Ritz sieht anders aus als jede Berliner Praxis – genau deshalb gehört er auf die Potsdamer Seite und nirgendwo sonst.',
    urheber: 'KU64 – Die Zahnspezialisten (Aufnahme aus dem Bestand von ku64.de)',
    breite: 1440,
    hoehe: 960,
  },
  'standort-wilmersdorf': {
    pfad: '/praxis/wilmersdorf-haus',
    alt: 'Außenansicht des Eckhauses in der Gasteiner Straße in Berlin-Wilmersdorf: ein heller Altbau mit zwei Türmchen und Stuckfassade, davor herbstliche Straßenbäume.',
    herkunft: 'praxis',
    bezug:
      'Für die KiezPraxis gibt es noch kein Kopfvideo und keine Innenaufnahme. Das Haus zu zeigen ist ehrlicher als ein fremder Innenraum – und hilft beim Wiederfinden.',
    urheber: 'KU64 – Die Zahnspezialisten (Aufnahme aus dem Bestand von ku64.de)',
    breite: 1206,
    hoehe: 1159,
  },
};

/**
 * Das Bild eines Standorts, oder keines.
 *
 * Die Trennung von Schlüssel und Standort-Slug ist Absicht: Ein Standort ohne
 * Aufnahme bekommt keinen Platzhalter, sondern keine Abbildung.
 */
export function standortBild(slug: string): Bildnachweis | undefined {
  return getBild(`standort-${slug}`);
}

export function getBild(schluessel: string): Bildnachweis | undefined {
  const b = BILDER[schluessel];
  if (!b) return undefined;
  return nachweisGueltig(b).ok ? b : undefined;
}
