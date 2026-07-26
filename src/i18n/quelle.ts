/**
 * Die vollständige deutsche Quellfassung als flache Schlüsselkarte.
 *
 * Diese Datei ist die Referenz, gegen die alles geprüft wird: Der Wächter
 * vergleicht sie mit den Katalogen, das Sync-Skript übersetzt daraus, was
 * fehlt. Weil sie aus denselben Datendateien liest, aus denen auch die Seiten
 * gebaut werden, kann kein Text existieren, der ihr entgeht – ein neuer
 * FAQ-Eintrag in leistungen.ts taucht hier automatisch auf und fehlt damit
 * ab sofort nachweisbar auf Englisch und Französisch.
 *
 * Die Endungen in den Importen sind Absicht: Diese Datei wird auch direkt von
 * Node geladen (scripts/sprachen-*.mjs), und Node löst erweiterungslose
 * relative Importe in ESM nicht auf.
 */

import { KATEGORIEN, LEISTUNGEN } from '../data/leistungen.ts';
import { STANDORTE } from '../data/standorte.ts';
import { sammeln, SPEC_KATEGORIE, SPEC_LEISTUNG, SPEC_STANDORT } from './felder.ts';
import { TEXTE } from './texte.ts';

export function quelltexte(): Record<string, string> {
  const aus: Record<string, string> = {};

  for (const [schluessel, text] of Object.entries(TEXTE)) {
    aus[`ui.${schluessel}`] = text;
  }
  for (const k of KATEGORIEN) {
    Object.assign(aus, sammeln(k, SPEC_KATEGORIE, `kategorie.${k.slug}`));
  }
  for (const l of LEISTUNGEN) {
    Object.assign(aus, sammeln(l, SPEC_LEISTUNG, `leistung.${l.slug}`));
  }
  for (const s of STANDORTE) {
    Object.assign(aus, sammeln(s, SPEC_STANDORT, `standort.${s.slug}`));
  }

  return aus;
}

/**
 * Hinweis für die Übersetzung, abgeleitet aus dem Schlüssel.
 *
 * Ohne diesen Kontext übersetzt jedes Verfahren "Brücke" irgendwann als
 * Bauwerk und "Krone" als Kopfschmuck. Der Hinweis wandert in den Prompt des
 * Sync-Skripts und steht Menschen zur Verfügung, die von Hand nacharbeiten.
 */
export function kontextFuer(schluessel: string): string {
  if (schluessel.startsWith('ui.')) {
    return 'Oberflächentext einer Website (Schaltfläche, Navigationspunkt oder kurzer Hinweis). Muss kurz bleiben, damit das Layout nicht bricht.';
  }
  if (schluessel.startsWith('leistung.')) {
    const feld = schluessel.split('.').slice(2).join('.');
    if (feld.startsWith('faq')) return 'Frage oder Antwort aus dem FAQ zu einer Zahnbehandlung.';
    if (feld.startsWith('ablauf')) return 'Schritt im Behandlungsablauf beim Zahnarzt.';
    if (feld.startsWith('synonyme'))
      return 'Alternative Bezeichnung für eine Zahnbehandlung, wie Patientinnen und Patienten sie in eine Suchmaschine eintippen. Bitte den in der Zielsprache tatsächlich gesuchten Begriff wählen, keine wörtliche Übersetzung.';
    if (feld === 'kasse')
      return 'Hinweis zur Kostenübernahme durch die deutsche gesetzliche Krankenversicherung. Das deutsche System nicht durch ein Landessystem der Zielsprache ersetzen – es geht um deutsche Kassen.';
    return 'Beschreibung einer Zahnbehandlung für Patientinnen und Patienten.';
  }
  if (schluessel.startsWith('kategorie.')) return 'Name oder Beschreibung eines zahnmedizinischen Fachbereichs.';
  if (schluessel.startsWith('standort.')) {
    return 'Text zu einer konkreten Zahnarztpraxis in Berlin oder Potsdam. Straßennamen, Haltestellen, Stadtteile und Gebäudenamen bleiben unübersetzt.';
  }
  return 'Text einer Zahnarzt-Website.';
}

/**
 * Begriffe, die in jeder Sprache unverändert bleiben.
 *
 * Eigennamen und Produktbezeichnungen. Werden sie übersetzt, findet niemand
 * mehr die Praxis, und der Doctolib-Link zeigt ins Leere.
 */
export const UNVERAENDERT = [
  'KU64',
  'Die Zahnspezialisten',
  'DIE KIEZPRAXIS',
  'Kurfürstendamm',
  'Hausvogteiplatz',
  'Gasteiner Straße',
  'Berliner Straße',
  'Palais Ritz',
  'Doctolib',
  'Nelly',
  'Invisalign',
  'All-on-4',
  'Berlin',
  'Charlottenburg',
  'Wilmersdorf',
  'Mitte',
  'Potsdam',
];
