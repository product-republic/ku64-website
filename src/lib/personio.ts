/**
 * Offene Stellen aus Personio.
 *
 * ── Warum aus dem Feed und nicht als eingebettetes Fenster ────────────────
 *
 * Personio bietet ein fertiges Widget an. Es bringt fremdes JavaScript,
 * fremde Schriften und eine fremde Gestaltung mit – und es ist ein
 * Drittanbieter, für den es dann wieder eine Einwilligung bräuchte. Der
 * XML-Feed liefert dieselben Daten ohne all das: Wir holen ihn auf dem
 * Server, stellen ihn in unserer eigenen Gestaltung dar, und im Browser der
 * Besucherin wird keine einzige Verbindung zu Personio aufgebaut.
 *
 * Erst wer sich bewirbt, geht zu Personio – über einen sichtbaren Verweis,
 * genau wie bei Doctolib.
 *
 * ── Warum zur Laufzeit und nicht beim Bauen ───────────────────────────────
 *
 * Eine Stellenanzeige, die es nicht mehr gibt, ist schlimmer als keine: Wer
 * sich auf eine besetzte Stelle bewirbt, bekommt eine Absage für etwas, das
 * gar nicht mehr offen war. Die Seite wird deshalb bei jedem Aufruf frisch
 * gerendert, mit einem kurzen Zwischenspeicher, damit nicht jeder Aufruf
 * einen Abruf auslöst.
 *
 * ── Wenn Personio nicht antwortet ─────────────────────────────────────────
 *
 * Dann steht keine erfundene Liste da, sondern der Hinweis, dass die
 * Übersicht gerade nicht erreichbar ist, samt Verweis auf das Stellenportal
 * und die Möglichkeit, sich initiativ zu bewerben. Ein Ausfall bei Personio
 * darf keine Bewerbung verhindern.
 */

/** Zugangsdaten braucht es nicht – der Feed ist öffentlich. */
const FEED = 'https://ku64.jobs.personio.de/xml';

/** Ein Stellenangebot bei Personio. */
export interface Stelle {
  id: string;
  titel: string;
  /** Slug des Standorts, an dem die Stelle sitzt – oder null, wenn unklar. */
  standort: string | null;
  /** Wie Personio den Standort nennt. Steht daneben, wenn die Zuordnung fehlt. */
  standortName: string;
  abteilung: string;
  /** „Vollzeit", „Teilzeit", „Voll-/ Teilzeit" – wie in Personio gepflegt. */
  umfang: string;
  /** Erster Absatz der Beschreibung, für die Kachel. */
  anriss: string;
  /** Adresse der Stellenanzeige bei Personio. */
  adresse: string;
}

/**
 * Personios Standortnamen auf unsere Slugs.
 *
 * Bewusst als Tabelle und nicht als Rateregel: Wenn in Personio ein neuer
 * Standort angelegt wird, soll die Stelle sichtbar bleiben und der fehlende
 * Eintrag auffallen – nicht stillschweigend beim falschen Standort landen.
 */
const STANDORTE_VON_PERSONIO: Record<string, string> = {
  'KU64 Kurfürstendamm': 'berlin-charlottenburg',
  'KU64 Berlin-Mitte': 'berlinmitte',
  'KU64 Berlin Mitte': 'berlinmitte',
  'KU64 Potsdam (Palais Ritz)': 'potsdam',
  'KU64 Potsdam': 'potsdam',
  'KU64 Wilmersdorf': 'wilmersdorf',
  'KU64 Die KiezPraxis': 'wilmersdorf',
};

/**
 * Ein Feld aus einem XML-Abschnitt lesen.
 *
 * Bewusst mit regulären Ausdrücken statt mit einem XML-Paket: Der Feed hat
 * eine flache, feste Struktur, und eine Abhängigkeit mehr im Server für
 * sieben Felder wäre unverhältnismäßig. CDATA wird dabei mit abgeräumt.
 */
function feld(abschnitt: string, name: string): string {
  const treffer = new RegExp(`<${name}>([\\s\\S]*?)</${name}>`).exec(abschnitt);
  if (!treffer) return '';
  return treffer[1]
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;/g, '–')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Kurzer Zwischenspeicher, damit nicht jeder Seitenaufruf Personio abruft. */
let speicher: { zeit: number; stellen: Stelle[] } | null = null;
const HALTBAR_MS = 5 * 60 * 1000;

export async function offeneStellen(): Promise<Stelle[] | null> {
  if (speicher && Date.now() - speicher.zeit < HALTBAR_MS) return speicher.stellen;

  let text: string;
  try {
    const antwort = await fetch(FEED, {
      headers: { 'user-agent': 'ku64.de (Stellenübersicht)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!antwort.ok) return speicher?.stellen ?? null;
    text = await antwort.text();
  } catch {
    /* Zeitüberschreitung oder Netzfehler. Lieber der alte Stand als gar
       keiner – und wenn es keinen alten gibt, ein ehrliches „nicht
       erreichbar" statt einer leeren Liste, die aussieht wie „keine
       Stellen frei". */
    return speicher?.stellen ?? null;
  }

  const stellen: Stelle[] = [];
  for (const stueck of text.split('<position>').slice(1)) {
    const standortName = feld(stueck, 'office');
    const beschreibung = feld(stueck, 'jobDescriptions');
    const id = feld(stueck, 'id');
    if (!id) continue;

    stellen.push({
      id,
      /* Der erste `<name>` gehört zur Stelle; die weiteren sind Überschriften
         innerhalb der Beschreibung. */
      titel: feld(stueck, 'name'),
      standort: STANDORTE_VON_PERSONIO[standortName] ?? null,
      standortName,
      abteilung: feld(stueck, 'department'),
      umfang: feld(stueck, 'recruitingCategory') || feld(stueck, 'schedule'),
      anriss: beschreibung.slice(0, 180).trim() + (beschreibung.length > 180 ? ' …' : ''),
      adresse: `https://ku64.jobs.personio.de/job/${id}?display=de`,
    });
  }

  speicher = { zeit: Date.now(), stellen };
  return stellen;
}

/** Stellen eines Standorts – für die Standortseiten. */
export function stellenAn(stellen: Stelle[], standortSlug: string): Stelle[] {
  return stellen.filter((s) => s.standort === standortSlug);
}
