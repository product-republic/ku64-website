/**
 * Register der KI-Systeme dieser Website.
 *
 * ── Warum das eine Datendatei ist ────────────────────────────────────────
 *
 * Artikel 50 der Verordnung (EU) 2024/1689 verlangt für jedes System, das mit
 * Menschen interagiert oder Inhalte erzeugt, eine Offenlegung – und zwar
 * „klar und unterscheidbar, spätestens zum Zeitpunkt der ersten Interaktion".
 *
 * Diese Offenlegung steht an mehreren Stellen: im Chatfenster, auf der
 * Beratungsseite, unter dem erzeugten Bild und auf `/ki-transparenz/`. Vier
 * Stellen mit vier Formulierungen ist die zuverlässigste Art, eines Tages
 * eine davon zu vergessen oder zu verwässern. Deshalb eine Quelle.
 *
 * Wer ein System hinzufügt, trägt es hier ein und bekommt die Transparenzseite
 * geschenkt. Wer eines vergisst, hat auf der Website kein Hinweisfeld – und
 * genau das ist der Fehler, den man sehen soll.
 *
 * ── Was Artikel 50 im Einzelnen verlangt ────────────────────────────────
 *
 * Absatz 1 – Systeme, die mit Menschen interagieren: Die Person muss
 * informiert werden, dass sie mit einer Maschine spricht, es sei denn, das ist
 * „aus Sicht einer angemessen aufmerksamen Person offensichtlich". Auf diese
 * Ausnahme sollte sich niemand verlassen: Ein Sprachberater mit natürlicher
 * Stimme ist genau der Fall, in dem es eben nicht offensichtlich ist.
 *
 * Absatz 2 – erzeugte Inhalte maschinenlesbar kennzeichnen. Für Bilder
 * erledigt das `src/lib/ki-kennzeichnung.ts`.
 *
 * Absatz 4 – Deepfakes sichtbar kennzeichnen. Ebenda.
 *
 * ── Vorbehalt ───────────────────────────────────────────────────────────
 *
 * Umgesetzt ist auf den Stand 2. August 2026. Die Anwendbarkeit einzelner
 * Teile war 2025/26 Gegenstand eines Digital-Omnibus-Verfahrens; die
 * endgültige Rechtslage gehört von einer Anwältin bestätigt.
 */

export interface KiSystem {
  slug: string;
  /** Wie das System auf der Website heißt. */
  name: string;
  /** Ein Satz: Was es tut. */
  zweck: string;
  /** Wo man ihm begegnet. */
  wo: string;
  /**
   * Der Satz, der VOR der ersten Interaktion steht. Erste Person, kurz,
   * ohne Beschönigung – „digitaler Assistent" ist keine Offenlegung, weil es
   * offenlässt, ob ein Mensch mitliest.
   */
  offenlegung: string;
  /** Anbieter des Modells und wo es läuft. */
  anbieter: string;
  /** Welches Modell – nachvollziehbar statt „modernste KI". */
  modell: string;
  /** Was an den Anbieter geht. */
  daten: string;
  /** Was NICHT passiert. Menschen fragen zuerst danach. */
  nichtDaten: string;
  /** Was das System ausdrücklich nicht kann oder darf. */
  grenzen: string;
}

/**
 * Die Formulierung, die überall gleich lautet, wo eine Maschine antwortet.
 *
 * „Automatisch" statt „digital": Digital ist auch ein Kontaktformular, das ein
 * Mensch liest. Der Punkt der Vorschrift ist, dass niemand einen Menschen
 * vermutet, wo keiner ist.
 */
export const HINWEIS_MASCHINE = 'Sie schreiben mit einem KI-System, nicht mit einem Menschen.';
export const HINWEIS_MASCHINE_STIMME = 'Sie sprechen mit einem KI-System. Die Stimme ist synthetisch.';

/** Wie man stattdessen einen Menschen erreicht. Gehört zu jeder Offenlegung. */
export const WEG_ZUM_MENSCHEN =
  'Einen Menschen erreichen Sie unter der Telefonnummer Ihres Standorts oder über das Kontaktformular.';

export const KI_SYSTEME: KiSystem[] = [
  {
    slug: 'berater',
    name: 'Digitaler Berater (Chat)',
    zweck:
      'Beantwortet Fragen zu Behandlungen, Kosten, Abläufen und Standorten in Textform.',
    wo: 'Als Schaltfläche unten rechts auf jeder Seite.',
    offenlegung: HINWEIS_MASCHINE,
    anbieter: 'Anthropic PBC, Verarbeitung in der Europäischen Union',
    modell: 'Claude Sonnet 5',
    daten:
      'Ihre Frage und der bisherige Gesprächsverlauf dieser Sitzung, dazu die Angabe, welchen Standort Sie ausgewählt haben.',
    nichtDaten:
      'Kein Name, keine E-Mail-Adresse, keine Telefonnummer. Der Verlauf wird nicht dauerhaft gespeichert und nicht einer Person zugeordnet.',
    grenzen:
      'Stellt keine Diagnose, beurteilt keine Beschwerden, nennt keine verbindlichen Preise und nimmt keine Termine entgegen.',
  },
  {
    slug: 'sprachberater',
    name: 'Sprachberater',
    zweck:
      'Beantwortet dieselben Fragen im Gespräch, mit synthetischer Stimme in natürlicher Sprache.',
    wo: 'Auf der Seite „Digitale Beratung".',
    offenlegung: HINWEIS_MASCHINE_STIMME,
    anbieter: 'ElevenLabs Inc.',
    modell: 'ElevenLabs Conversational AI',
    daten:
      'Ihre Stimme für die Dauer des Gesprächs sowie der ausgewählte Standort.',
    nichtDaten:
      'Keine dauerhafte Aufzeichnung, keine Zuordnung zu einer Person. Das Mikrofon wird erst nach Ihrem Klick angefordert und beim Auflegen wieder freigegeben.',
    grenzen:
      'Stellt keine Diagnose, nimmt keine Termine entgegen und erfasst keine persönlichen Daten.',
  },
  {
    slug: 'laecheln-vorschau',
    name: 'Lächeln-Vorschau',
    zweck:
      'Erzeugt aus Ihrem eigenen Foto eine unverbindliche Illustration, wie eine ästhetische Behandlung aussehen könnte.',
    wo: 'Auf der Seite „Lächeln-Vorschau", nur nach ausdrücklicher Einwilligung.',
    offenlegung:
      'Das erzeugte Bild ist eine KI-Illustration und kein Behandlungsergebnis. Es trägt diesen Hinweis sichtbar im Bild und maschinenlesbar in der Datei.',
    anbieter: 'Google Ireland Limited',
    modell: 'Gemini 3 (Bildanalyse und Bilderzeugung)',
    daten: 'Das Foto, das Sie selbst hochladen.',
    nichtDaten:
      'Das Foto wird nicht gespeichert und nicht zum Training verwendet. Ohne Ihre Einwilligung wird es gar nicht erst übertragen.',
    grenzen:
      'Keine Zusage über ein Ergebnis. Eine erzeugte Vorher-Nachher-Darstellung als Werbemotiv wäre nach § 11 Heilmittelwerbegesetz unzulässig – die Vorschau ist ausdrücklich als Illustration gekennzeichnet und entsteht nur auf Ihre eigene Anforderung hin.',
  },
];

export function kiSystem(slug: string): KiSystem | undefined {
  return KI_SYSTEME.find((s) => s.slug === slug);
}
