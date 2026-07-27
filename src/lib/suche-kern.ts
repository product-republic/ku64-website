/**
 * Der Kern der Suche – alles, was ohne die Praxisdaten auskommt.
 *
 * ── Warum getrennt ──────────────────────────────────────────────────────
 *
 * Weil dieser Teil im Browser läuft. `suche.ts` baut den Index und braucht
 * dafür den vollständigen Behandlungskatalog, die Standorte, die
 * Beschwerdeseiten und den Blog – zusammen weit über hundert Kilobyte, die
 * niemand herunterladen soll, um „veneers" zu tippen.
 *
 * Der Index kommt fertig als kleine JSON-Datei; hier steht nur, was man mit
 * ihm tut. Die Trennung ist keine Aufräumarbeit, sondern die Bedingung
 * dafür, dass die Suche sofort reagiert.
 */

/**
 * Was für ein Ding gefunden wurde.
 *
 * Steht im Ergebnis als Marke – „Behandlung", „Beschwerde", „Person". Ohne
 * sie sähen ein Fachbeitrag über Veneers und die Behandlungsseite dazu in
 * der Liste gleich aus, und man klickt den falschen an.
 */
export type Trefferart = 'leistung' | 'standort' | 'seite' | 'beschwerde' | 'person' | 'beitrag';

export interface Indexeintrag {
  art: Trefferart;
  /** Slug der Behandlung bzw. des Standorts; bei Seiten der Pfad. */
  id: string;
  titel: string;
  /** Eine Zeile zur Einordnung im Ergebnis. */
  kurz: string;
  /** Pfad ohne Standort- und Sprachpräfix. */
  pfad: string;
  /** Wörter mit hohem Gewicht: Name, Synonyme, Beschwerden. */
  stark: string[];
  /** Wörter mit niedrigem Gewicht: Kurztext, Teaser, Frage. */
  schwach: string[];
  /** Nur bei Behandlungen: an welchen Standorten es sie gibt. */
  verfuegbar?: string[];
  /** Sortierhilfe bei Gleichstand – kleiner ist wichtiger. */
  rang: number;
}

// ── Normalisieren ─────────────────────────────────────────────────────

/**
 * Schreibweisen einebnen, die dasselbe meinen.
 *
 * Umlaute werden auf den Grundvokal geführt, und zwar in beiden
 * Schreibweisen: „Zahnästhetik" und „zahnaesthetik" landen auf derselben Form.
 * Ohne das findet niemand etwas, der ohne Umlaute tippt – und das tun auf
 * Mobilgeräten viele.
 *
 * Dass dabei „Bär" und „Bar" zusammenfallen, ist der Preis. Bei 35
 * Behandlungen kostet er nichts.
 */
export function normieren(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä|ae/g, 'a')
    .replace(/ö|oe/g, 'o')
    .replace(/ü|ue/g, 'u')
    .replace(/ß|ss/g, 's');
}

export function zerlegen(text: string): string[] {
  return normieren(text)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1);
}

// ── Bewerten ──────────────────────────────────────────────────────────

/**
 * Abstand zweier Wörter, gedeckelt bei 2.
 *
 * Nur für Tippfehler gedacht, nicht für Wortverwandtschaft. „implantat" gegen
 * „implantant" soll treffen, „krone" gegen „krise" nicht.
 */
function abstand(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const vor = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = vor[0]!;
    vor[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const merk = vor[j]!;
      vor[j] = Math.min(
        vor[j]! + 1,
        vor[j - 1]! + 1,
        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      diagonal = merk;
    }
  }
  return vor[b.length]!;
}

interface Feldtreffer {
  punkte: number;
  /** Welcher Ausdruck getroffen hat – für die Anzeige „gefunden über …". */
  ueber?: string;
}

/** Ein Suchwort gegen eine Wortgruppe. */
function feldTreffer(wort: string, ausdruecke: string[], gewicht: number): Feldtreffer {
  let beste: Feldtreffer = { punkte: 0 };

  for (const ausdruck of ausdruecke) {
    if (!ausdruck) continue;
    const teile = zerlegen(ausdruck);
    for (const teil of teile) {
      let p = 0;
      if (teil === wort) p = gewicht;
      else if (teil.startsWith(wort) && wort.length >= 3) p = gewicht * 0.7;
      /* Tippfehler erst ab fünf Zeichen: Bei kurzen Wörtern ist ein Zeichen
         Unterschied meist ein anderes Wort, kein Vertipper. */
      else if (wort.length >= 5 && teil.length >= 5 && abstand(teil, wort) === 1) p = gewicht * 0.55;

      if (p > beste.punkte) beste = { punkte: p, ueber: ausdruck };
    }
  }

  return beste;
}

export interface Treffer {
  eintrag: Indexeintrag;
  punkte: number;
  /** Der Ausdruck, über den gefunden wurde, falls es nicht der Titel war. */
  ueber?: string;
}

const GEWICHT_STARK = 10;
const GEWICHT_SCHWACH = 2.5;

/**
 * Bewertet den gesamten Index gegen eine Eingabe.
 *
 * Alle Suchwörter müssen irgendwo treffen. Ohne diese Bedingung liefert
 * „implantat potsdam" alles, was „potsdam" enthält – und der Eintrag, der
 * beides erfüllt, geht in der Menge unter.
 */
export function suchen(index: Indexeintrag[], frage: string, grenze = 8): Treffer[] {
  const woerter = zerlegen(frage);
  if (woerter.length === 0) return [];

  const ganzeFrage = normieren(frage.trim());
  const treffer: Treffer[] = [];

  for (const eintrag of index) {
    let punkte = 0;
    let ueber: string | undefined;
    let alleGetroffen = true;

    for (const wort of woerter) {
      const stark = feldTreffer(wort, eintrag.stark, GEWICHT_STARK);
      const schwach = feldTreffer(wort, eintrag.schwach, GEWICHT_SCHWACH);
      const besser = stark.punkte >= schwach.punkte ? stark : schwach;

      if (besser.punkte === 0) {
        alleGetroffen = false;
        continue;
      }
      punkte += besser.punkte;
      /* Als Fundstelle merken wir uns den stärksten Treffer, der nicht der
         Titel ist – „gefunden über: PZR" erklärt das Ergebnis, „gefunden
         über: Professionelle Zahnreinigung" erklärt nichts. */
      if (
        stark.punkte >= schwach.punkte &&
        stark.ueber &&
        normieren(stark.ueber) !== normieren(eintrag.titel) &&
        (!ueber || stark.punkte > GEWICHT_STARK * 0.7)
      ) {
        ueber = stark.ueber;
      }
    }

    if (!alleGetroffen || punkte === 0) continue;

    /* Wer den ganzen Titel oder ein ganzes Synonym eingegeben hat, meint genau
       das. Ohne diesen Aufschlag steht bei „bleaching" die Zahnaufhellung
       unter Umständen hinter einem Eintrag, der das Wort dreimal im Fließtext
       führt. */
    if (normieren(eintrag.titel) === ganzeFrage) punkte += 50;
    else if (eintrag.stark.some((a) => normieren(a) === ganzeFrage)) punkte += 35;

    /* Vollständige Eingaben belohnen: Zwei getroffene Wörter sind mehr wert
       als zweimal ein Wort. */
    if (woerter.length > 1) punkte *= 1 + 0.15 * (woerter.length - 1);

    treffer.push({ eintrag, punkte, ueber });
  }

  return treffer
    .sort((a, b) => b.punkte - a.punkte || a.eintrag.rang - b.eintrag.rang)
    .slice(0, grenze);
}

/**
 * Ist das eine Frage oder ein Stichwort?
 *
 * Entscheidet, ob die KI-Antwort überhaupt angeboten wird. „veneers" braucht
 * keine, „was kostet mich eine krone wenn ich gesetzlich versichert bin"
 * schon – dafür gibt es keinen Index, sondern nur eine Antwort.
 */
export function istFrage(text: string): boolean {
  const t = text.trim();
  if (t.includes('?')) return true;
  if (zerlegen(t).length >= 4) return true;
  return /^(was|wie|wo|wann|warum|welche[rsn]?|wer|kann|darf|muss|gibt|ist|sind|hab|habe|ich)\b/i.test(t);
}
