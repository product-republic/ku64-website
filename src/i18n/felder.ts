/**
 * Welche Felder übersetzt werden – und der Mechanismus, der sie einsammelt
 * und wieder einsetzt.
 *
 * Der Punkt an dieser Datei ist, dass Einsammeln und Einsetzen aus DERSELBEN
 * Beschreibung arbeiten. Gäbe es zwei Listen – eine fürs Extrahieren, eine
 * fürs Rendern –, würden sie irgendwann auseinanderlaufen: Ein neues Feld
 * käme in die eine Liste und nicht in die andere, und die englische Seite
 * zeigte an genau dieser Stelle klaglos Deutsch. Genau das soll technisch
 * unmöglich sein.
 *
 * Nicht übersetzt werden bewusst: Slugs (sie sind URL und Fremdschlüssel),
 * Eigennamen (Kurfürstendamm, Palais Ritz, Potsdam), Zahlen, Telefonnummern,
 * Adressen und Doctolib-Kennungen.
 */

/** Beschreibung der übersetzbaren Struktur eines Objekts. */
export interface Feldspec {
  /** Felder, die genau einen Text enthalten. */
  texte?: string[];
  /** Felder, die eine Liste von Texten enthalten. */
  listen?: string[];
  /** Felder mit einer Liste gleichförmiger Objekte. */
  objektlisten?: Record<string, string[]>;
  /** Verschachtelte Objekte mit eigener Beschreibung. */
  objekte?: Record<string, Feldspec>;
}

export const SPEC_LEISTUNG: Feldspec = {
  texte: ['name', 'kurz', 'teaser', 'patientenfrage', 'dauer', 'kosten', 'kasse'],
  listen: ['synonyme'],
  objektlisten: {
    ablauf: ['titel', 'text', 'dauer'],
    faq: ['frage', 'antwort'],
  },
};

export const SPEC_KATEGORIE: Feldspec = {
  texte: ['name', 'beschreibung'],
};

export const SPEC_STANDORT: Feldspec = {
  // `name` bleibt außen vor: "Kurfürstendamm", "Potsdam", "Wilmersdorf" und
  // "Berlin-Mitte" sind Ortsbezeichnungen, keine Beschreibungen.
  texte: ['nameLang', 'claim', 'zeitenHinweis'],
  listen: ['besonderheiten'],
  objektlisten: {
    doctolib: ['label'],
  },
  objekte: {
    anfahrt: {
      texte: ['parken', 'barrierefreiHinweis'],
      listen: ['oepnv'],
    },
  },
};

type Beliebig = Record<string, unknown>;

/**
 * Alle übersetzbaren Texte eines Objekts einsammeln, als flache Schlüsselkarte.
 *
 * Leere und fehlende Felder werden übersprungen – ein optionales Feld, das
 * es auf Deutsch nicht gibt, braucht auch keine Übersetzung.
 */
export function sammeln(objekt: unknown, spec: Feldspec, praefix: string): Record<string, string> {
  const o = objekt as Beliebig;
  const aus: Record<string, string> = {};
  if (!o) return aus;

  for (const feld of spec.texte ?? []) {
    const wert = o[feld];
    if (typeof wert === 'string' && wert.trim() !== '') aus[`${praefix}.${feld}`] = wert;
  }

  for (const feld of spec.listen ?? []) {
    const wert = o[feld];
    if (Array.isArray(wert)) {
      wert.forEach((eintrag, i) => {
        if (typeof eintrag === 'string' && eintrag.trim() !== '') {
          aus[`${praefix}.${feld}.${i}`] = eintrag;
        }
      });
    }
  }

  for (const [feld, unterfelder] of Object.entries(spec.objektlisten ?? {})) {
    const wert = o[feld];
    if (Array.isArray(wert)) {
      wert.forEach((eintrag, i) => {
        for (const uf of unterfelder) {
          const text = (eintrag as Beliebig)?.[uf];
          if (typeof text === 'string' && text.trim() !== '') {
            aus[`${praefix}.${feld}.${i}.${uf}`] = text;
          }
        }
      });
    }
  }

  for (const [feld, unterspec] of Object.entries(spec.objekte ?? {})) {
    Object.assign(aus, sammeln(o[feld], unterspec, `${praefix}.${feld}`));
  }

  return aus;
}

/**
 * Dieselbe Struktur, aber mit übersetzten Texten. Gibt eine Kopie zurück; das
 * Originalobjekt aus den Datendateien bleibt unangetastet, damit ein Aufruf
 * in einer Sprache keine andere beeinflusst.
 */
export function anwenden<T>(
  objekt: T,
  spec: Feldspec,
  praefix: string,
  hole: (schluessel: string, deutsch: string) => string,
): T {
  const o = objekt as unknown as Beliebig;
  if (!o) return objekt;
  const kopie: Beliebig = { ...o };

  for (const feld of spec.texte ?? []) {
    const wert = o[feld];
    if (typeof wert === 'string' && wert.trim() !== '') {
      kopie[feld] = hole(`${praefix}.${feld}`, wert);
    }
  }

  for (const feld of spec.listen ?? []) {
    const wert = o[feld];
    if (Array.isArray(wert)) {
      kopie[feld] = wert.map((eintrag, i) =>
        typeof eintrag === 'string' && eintrag.trim() !== ''
          ? hole(`${praefix}.${feld}.${i}`, eintrag)
          : eintrag,
      );
    }
  }

  for (const [feld, unterfelder] of Object.entries(spec.objektlisten ?? {})) {
    const wert = o[feld];
    if (Array.isArray(wert)) {
      kopie[feld] = wert.map((eintrag, i) => {
        const neu: Beliebig = { ...(eintrag as Beliebig) };
        for (const uf of unterfelder) {
          const text = neu[uf];
          if (typeof text === 'string' && text.trim() !== '') {
            neu[uf] = hole(`${praefix}.${feld}.${i}.${uf}`, text);
          }
        }
        return neu;
      });
    }
  }

  for (const [feld, unterspec] of Object.entries(spec.objekte ?? {})) {
    kopie[feld] = anwenden(o[feld], unterspec, `${praefix}.${feld}`, hole);
  }

  return kopie as unknown as T;
}

/**
 * Kurzer, stabiler Fingerabdruck eines Textes (FNV-1a, 32 Bit).
 *
 * Bewusst nicht `node:crypto`: Diese Funktion läuft im Build, in den
 * Prüfskripten und potenziell im Browser. Kryptografische Stärke ist hier
 * nicht gefragt – der Hash beantwortet nur die Frage "hat sich der deutsche
 * Ausgangstext seit der Übersetzung geändert?".
 */
export function fingerabdruck(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}
