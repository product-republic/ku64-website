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
import { KI_SYSTEME, WEG_ZUM_MENSCHEN } from '../data/ki-systeme.ts';
import {
  sammeln,
  SPEC_BESCHWERDE,
  SPEC_BEITRAG,
  SPEC_KATEGORIE,
  SPEC_KISYSTEM,
  SPEC_LEISTUNG,
  SPEC_PERSON,
  SPEC_STANDORT,
} from './felder.ts';
import { TEXTE } from './texte.ts';
import profile from '../data/profile.json' with { type: 'json' };
import beitraege from '../data/blog.json' with { type: 'json' };
import beschwerden from '../data/beschwerden.json' with { type: 'json' };

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

  /*
   * Die KI-Systeme. Ihre Sätze stehen auf /ki-transparenz/, im Chatfenster
   * und über dem Sprachberater – bis eben nur auf Deutsch, weil sie in einer
   * Datendatei standen, die hier nicht gelesen wurde.
   */
  for (const s of KI_SYSTEME) {
    Object.assign(aus, sammeln(s, SPEC_KISYSTEM, `kisystem.${s.slug}`));
  }
  /* Der Weg zum Menschen steht neben jeder Offenlegung und ist deshalb eine
     eigene Konstante, kein Feld eines Systems. */
  aus['kisystem.wegZumMenschen'] = WEG_ZUM_MENSCHEN;

  /*
   * Und die langen Inhalte: Behandlerprofile, Blogbeiträge,
   * Beschwerdeseiten.
   *
   * Sie standen bis eben nicht hier – und weil der Wächter nur zählt, was
   * hier steht, meldete er 100 Prozent, während die englische
   * Beschwerdeseite dreitausend Wörter Deutsch zeigte. Das ist derselbe
   * blinde Fleck wie bei den Oberflächentexten, nur eine Ebene größer:
   * 6062 Texte, gut eine Million Zeichen.
   */
  for (const [slug, person] of Object.entries(profile)) {
    Object.assign(aus, sammeln(person, SPEC_PERSON, `person.${slug}`));
  }
  for (const b of beitraege) {
    Object.assign(aus, sammeln(b, SPEC_BEITRAG, `beitrag.${b.slug}`));
  }
  for (const b of beschwerden) {
    Object.assign(aus, sammeln(b, SPEC_BESCHWERDE, `beschwerde.${b.slug}`));
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
  if (schluessel.startsWith('person.')) {
    const feld = schluessel.split('.').slice(2).join('.');
    if (feld.startsWith('abschnitte') && feld.includes('zeilen'))
      return 'Zeile aus dem Werdegang einer zahnärztlichen Fachkraft: Zeitraum, Tätigkeit, Ort. Jahreszahlen und Eigennamen von Praxen, Universitäten und Städten bleiben unverändert.';
    if (feld.startsWith('abschnitte'))
      return 'Überschrift über dem Werdegang oder den Schwerpunkten einer Person, z. B. "Werdegang von …". Der Name darin bleibt unverändert.';
    if (feld.startsWith('vorstellung'))
      return 'Absatz, in dem sich eine Zahnärztin oder ein Zahnarzt den Patientinnen und Patienten selbst vorstellt. Erste Person, persönlicher Ton – der bleibt erhalten.';
    return 'Funktionsbezeichnung in einer Zahnarztpraxis, z. B. "Fachzahnärztin für Kieferorthopädie". Deutsche Fachzahnarzt-Titel haben in anderen Ländern nicht immer eine Entsprechung – dann die gebräuchliche Umschreibung wählen, nicht erfinden.';
  }
  if (schluessel.startsWith('beitrag.')) {
    return 'Abschnitt aus einem Beitrag im Blog einer Zahnarztpraxis. Ton wie im Deutschen: informativ, ohne Werbesprache. Namen von Personen, Praxen und Veranstaltungen bleiben unverändert.';
  }
  if (schluessel.startsWith('beschwerde.')) {
    const feld = schluessel.split('.').slice(2).join('.');
    if (feld === 'beschreibung')
      return 'Kurzbeschreibung einer Seite für Suchmaschinen. Höchstens 160 Zeichen, sonst wird sie abgeschnitten. Enthaltene Telefonnummern und Symbole bleiben unverändert.';
    if (feld.startsWith('faq')) return 'Frage oder Antwort zu einer Zahnbeschwerde.';
    return 'Abschnitt einer Seite über eine Zahnbeschwerde – was sie verursacht, was man tun kann, wann man zum Zahnarzt sollte. Der Text stammt aus dem Bestand der Praxis und ist fachlich freigegeben: sinngemäß übersetzen, aber keine Aussage abschwächen, verstärken oder hinzufügen.';
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
  if (schluessel.startsWith('kisystem.')) {
    const feld = schluessel.split('.').slice(2).join('.');
    if (feld === 'offenlegung')
      return 'Pflichthinweis nach Artikel 50 der EU-KI-Verordnung: Die Person muss erfahren, dass sie mit einer Maschine spricht. Wörtlich und unbeschönigt übersetzen – „digitaler Assistent" oder „smart helper" wäre keine Offenlegung mehr. Keine Abschwächung, keine Höflichkeitsfloskel davor.';
    if (feld === 'anbieter' || feld === 'modell')
      return 'Anbieter oder Modellbezeichnung eines KI-Systems. Firmen-, Produkt- und Modellnamen bleiben unverändert; nur die Angaben darum herum werden übersetzt.';
    if (feld === 'grenzen' || feld === 'nichtDaten')
      return 'Was ein KI-System ausdrücklich nicht tut oder nicht verarbeitet. Rechtlich relevante Zusage – keine Aussage weglassen, keine hinzufügen, nichts abschwächen.';
    return 'Angabe zu einem KI-System auf der Website einer Zahnarztpraxis: was es tut, wo man ihm begegnet, welche Daten fließen.';
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
