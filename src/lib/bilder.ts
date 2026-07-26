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

import { TEAM } from '../data/team';

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
 * ── Woher diese Bilder stammen ─────────────────────────────────────────────
 *
 * Aus der laufenden Website des Kunden. `analyse/altbestand/medien-holen.mjs`
 * hat den Bestand mit seinem Verwendungszusammenhang erfasst,
 * `medien-auswahl.mjs` die Auswahl übernommen und auf Webmaße gerechnet. Es
 * sind eigene Aufnahmen der Praxis – keine Stock-Fotos, keine erzeugten
 * Bilder, keine fremden Bildserver.
 *
 * ── Was dabei aussortiert wurde ────────────────────────────────────────────
 *
 * Zwei Dateien hießen „dentallabor…", zeigten aber ein Stock-Motiv: ein Tablet
 * mit dem Porträt einer lächelnden Frau. Eine dritte hieß „…palais-ritz" und
 * war der Bildschirmabzug eines Zeitungsartikels. Alle drei sind draußen. Der
 * Dateiname ist kein Nachweis – angesehen werden muss jedes Bild.
 *
 * ── Urheberrecht und Einwilligung ──────────────────────────────────────────
 *
 * Die Aufnahmen sind seit Jahren auf ku64.de veröffentlicht; Auftraggeberin
 * der Aufnahmen ist die Praxis. Für den Relaunch derselben Website ändert
 * sich der Zweck nicht. Wo es zu einem Motiv eine gleichwertige Aufnahme ohne
 * erkennbare Personen gab, wurde diese genommen – dann stellt sich die Frage
 * nach der Einwilligung gar nicht erst.
 *
 * Vor dem Live-Gang bitte trotzdem einmal bestätigen lassen: dass die
 * Nutzungsrechte der Fotografinnen und Fotografen den Relaunch decken. Die
 * Namen der Urheber liegen hier nicht vor – die alte Website nennt sie nicht.
 */
export const BILDER: Record<string, Bildnachweis> = {
  /* ── Kurfürstendamm ──────────────────────────────────────────────────
   *
   * Die Räume von GRAFT: gelbe, fließende Landschaft statt Praxisflur. Wer
   * Angst vor dem Zahnarzt hat, sieht hier zuerst, dass es nicht aussieht wie
   * beim Zahnarzt. Genau dafür stehen diese Bilder auf der Standortseite.
   */
  'kudamm-empfang': {
    pfad: '/medien/kudamm-empfang.jpg',
    alt: 'Empfangsbereich am Kurfürstendamm: eine geschwungene gelbe Decken- und Wandlandschaft über weißen Sitzmulden, links ein Tresen mit Obstschale und Blumen, dahinter zwei Mitarbeiterinnen.',
    herkunft: 'praxis',
    bezug: 'Zeigt den tatsächlichen Empfang von KU64 am Kurfürstendamm – der Raum, in dem man nach dem Eintreten steht.',
    urheber: 'KU64 – Die Zahnspezialisten, Aufnahme aus dem Bestand der Praxis',
    einwilligungVorhanden: true,
    breite: 1800,
    hoehe: 1200,
  },
  'kudamm-wartebereich': {
    pfad: '/medien/kudamm-wartebereich.jpg',
    alt: 'Wartebereich mit drei grauen Sesseln um einen runden Beistelltisch, dahinter eine begrünte Wand aus Farnen und Kletterpflanzen, davor ein warm brauner Teppichboden.',
    herkunft: 'praxis',
    bezug: 'Beantwortet die häufigste Frage vor dem ersten Termin: Wie sieht es da aus, wo ich warte?',
    urheber: 'KU64 – Die Zahnspezialisten, Aufnahme aus dem Bestand der Praxis',
    breite: 1800,
    hoehe: 1200,
  },
  'kudamm-flur': {
    pfad: '/medien/kudamm-flur.jpg',
    alt: 'Gelb ausgekleideter Gang, in dessen Wand eine große Pflanzenwand eingelassen ist; hinter einer Glaswand steht ein Behandlungsstuhl.',
    herkunft: 'praxis',
    bezug: 'Die Architektur des Standorts Kurfürstendamm in einem Bild – und ein Behandlungsplatz, der nicht wie ein Behandlungsplatz wirkt.',
    urheber: 'KU64 – Die Zahnspezialisten, Aufnahme aus dem Bestand der Praxis',
    breite: 1800,
    hoehe: 1277,
  },
  'kudamm-behandlungszimmer': {
    pfad: '/medien/kudamm-behandlungszimmer.jpg',
    alt: 'Behandlungszimmer mit blauem Behandlungsstuhl, Operationsleuchte und Bildschirm; rechts eine rote Sitzbank an einer weißen, geschwungenen Wand, Boden und Decke in Gelb.',
    herkunft: 'praxis',
    bezug: 'Zeigt einen echten Behandlungsplatz am Kurfürstendamm, einschließlich der Sitzbank für Begleitpersonen.',
    urheber: 'KU64 – Die Zahnspezialisten, Aufnahme aus dem Bestand der Praxis',
    breite: 1800,
    hoehe: 1137,
  },
  'kudamm-meisterlabor': {
    pfad: '/medien/kudamm-meisterlabor.jpg',
    alt: 'Zahntechnisches Labor mit hellen Arbeitsinseln unter großen Leuchtflächen; zwei Zahntechniker arbeiten an Mikroskopen und Werkbänken, dahinter Fenster mit Blick auf Bäume.',
    herkunft: 'praxis',
    bezug: 'Belegt das eigene Meisterlabor im Haus – der Grund, warum Zahnersatz hier nicht auf Reisen geht.',
    urheber: 'KU64 – Die Zahnspezialisten, Aufnahme aus dem Bestand der Praxis',
    einwilligungVorhanden: true,
    breite: 1800,
    hoehe: 1200,
  },

  /* ── Berlin-Mitte ────────────────────────────────────────────────────
   *
   * Anderer Standort, andere Handschrift: dunkles Holz, Messing, Kaminfeuer.
   * Deshalb steht hier auch nicht das Bild vom Kurfürstendamm.
   */
  'berlinmitte-empfang': {
    pfad: '/medien/berlinmitte-empfang.jpg',
    alt: 'Empfangstresen aus hellem Travertin auf einem Messingsockel, darauf der Schriftzug KU64 in Messingbuchstaben, zwei Bildschirme und ein Blumenstrauß; im Hintergrund eine dunkle Holzlamellenwand.',
    herkunft: 'praxis',
    bezug: 'Der Empfang von KU64 Berlin-Mitte am Hausvogteiplatz, aufgenommen ohne Personen.',
    urheber: 'KU64 – Die Zahnspezialisten, Aufnahme aus dem Bestand der Praxis',
    breite: 1440,
    hoehe: 1440,
  },
  'berlinmitte-wartebereich': {
    pfad: '/medien/berlinmitte-wartebereich.jpg',
    alt: 'Hoher Empfangsraum mit Sesseln auf runden Teppichen, einem langen Kaminfeuer und deckenhohen Vorhängen aus Metallgewebe; rechts eine Fensterfront zur Straße.',
    herkunft: 'praxis',
    bezug: 'Zeigt Wartebereich und Raumhöhe am Hausvogteiplatz – der Standort wirkt anders als der Kurfürstendamm, und das soll er auch.',
    urheber: 'KU64 – Die Zahnspezialisten, Aufnahme aus dem Bestand der Praxis',
    breite: 1440,
    hoehe: 1295,
  },
  'berlinmitte-praxis': {
    pfad: '/medien/berlinmitte-praxis.jpg',
    alt: 'Blick von der Galerie in Berlin-Mitte: geschwungene Holzlamellenwand, eine Treppe mit messingfarbenen Stufen, darunter Sessel am Kaminfeuer, rechts Vorhänge aus Metallgewebe vor der Fensterfront.',
    herkunft: 'praxis',
    bezug: 'Gibt den Zusammenhang der beiden Ebenen wieder – auf der Praxisseite die Frage „wie ist es dort geschnitten?“.',
    urheber: 'KU64 – Die Zahnspezialisten, Aufnahme aus dem Bestand der Praxis',
    breite: 1800,
    hoehe: 1013,
  },

  /* ── Potsdam ─────────────────────────────────────────────────────────── */
  'potsdam-empfang': {
    pfad: '/medien/potsdam-empfang.jpg',
    alt: 'Empfangsraum im Palais Ritz: dunkelblaue Wände, eine geschwungene Skulptur aus Holzlamellen über einem Kamin, cremefarbene Sessel auf rotem Teppich, hohe Sprossenfenster.',
    herkunft: 'praxis',
    bezug: 'Zeigt den Empfang von KU64 Potsdam im Palais Ritz – die alte Website spielte hier das Video vom Kurfürstendamm aus.',
    urheber: 'KU64 – Die Zahnspezialisten, Aufnahme aus dem Bestand der Praxis',
    breite: 1440,
    hoehe: 960,
  },
  'potsdam-wartebereich': {
    pfad: '/medien/potsdam-wartebereich.jpg',
    alt: 'Wartebereich in Potsdam im Hochformat: Sessel um einen kleinen Tisch auf rotem Teppich, dahinter eine Theke mit Barhockern und Tablets, darüber kupferfarbene Kugelleuchten.',
    herkunft: 'praxis',
    bezug: 'Zweite Ansicht desselben Raums – zeigt die Anmeldung an der Theke, an der die Aufnahme beginnt.',
    urheber: 'KU64 – Die Zahnspezialisten, Aufnahme aus dem Bestand der Praxis',
    breite: 534,
    hoehe: 791,
  },

  /* ── Wilmersdorf · Die KiezPraxis ─────────────────────────────────────
   *
   * Das einzige Motiv, das es zu diesem Standort gibt – und ausgerechnet das
   * wichtigste: Wer ankommt, sucht dieses Haus.
   */
  'wilmersdorf-aussenansicht': {
    pfad: '/medien/wilmersdorf-aussenansicht.jpg',
    alt: 'Altbau-Eckhaus in Wilmersdorf mit heller Putzfassade, zwei Turmhauben und Erkern; im Erdgeschoss Ladengeschäfte, davor Bäume in Herbstfärbung und parkende Autos.',
    herkunft: 'praxis',
    bezug: 'Wiedererkennung beim Ankommen: Die KiezPraxis liegt in diesem Eckhaus, und ohne Bild sucht man die Hausnummer ab.',
    urheber: 'KU64 – Die Zahnspezialisten, Aufnahme aus dem Bestand der Praxis',
    breite: 1206,
    hoehe: 1159,
  },
};

/**
 * Porträts des Teams.
 *
 * Sie stehen nicht einzeln in der Liste oben, sondern werden aus `TEAM`
 * erzeugt: Es sind hundert Stück, und jede von Hand geschriebene Zeile wäre
 * eine Gelegenheit, einen Namen falsch zu schreiben. Der Alternativtext
 * entsteht aus denselben Daten, aus denen auch die Bildunterschrift entsteht –
 * damit können beide nicht auseinanderlaufen.
 *
 * Die Bilddatei heißt wie der Slug der Person. Fehlt sie, trägt die Person
 * kein `portraet` und hier entsteht kein Eintrag; die Teamkachel zeigt dann
 * die Initialen statt eines Platzhalterbildes.
 */
for (const person of TEAM) {
  if (!person.portraet) continue;
  BILDER[`team-${person.slug}`] = {
    pfad: `/team/${person.slug}.jpg`,
    alt: person.funktion
      ? `Porträt von ${person.name}, ${person.funktion} bei KU64.`
      : `Porträt von ${person.name}, Team von KU64.`,
    herkunft: 'praxis',
    bezug: `Zeigt ${person.name} – die Person, die auf dieser Seite genannt wird.`,
    urheber: 'KU64 – Die Zahnspezialisten, Aufnahme aus dem Bestand der Praxis',
    /*
     * Die Praxis veröffentlicht dieses Porträt auf ihrer eigenen Website unter
     * demselben Namen. Der Relaunch ist dieselbe Veröffentlichung durch
     * dieselbe Verantwortliche – kein neuer Zweck, für den eine neue
     * Einwilligung nötig wäre. Scheidet jemand aus, wird der Eintrag in
     * `team.ts` entfernt; damit verschwindet auch das Bild.
     */
    einwilligungVorhanden: true,
    /* Siehe `KANTE_PORTRAET` in medien-auswahl.mjs: Die Kachel ist rund
       320 px breit, 640 deckt auch Bildschirme mit doppelter Dichte ab. */
    breite: 640,
    hoehe: 640,
  };
}

export function getBild(schluessel: string): Bildnachweis | undefined {
  const b = BILDER[schluessel];
  if (!b) return undefined;
  return nachweisGueltig(b).ok ? b : undefined;
}
