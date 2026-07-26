/**
 * Wissensbasis für den digitalen Berater.
 *
 * Der Chatbot bekommt ausschließlich Fakten aus unseren eigenen Daten – er
 * erfindet keine Preise, Öffnungszeiten oder Leistungen. Weil die Wissensbasis
 * aus denselben Dateien erzeugt wird wie die Seiten, kann sie nicht veralten:
 * Wer eine Leistung in `leistungen.ts` ändert, ändert automatisch auch das,
 * was der Berater sagt.
 */

import { STANDORTE, type Standort } from '../data/standorte';
import { LEISTUNGEN, leistungenFuerStandort, KATEGORIEN } from '../data/leistungen';

/** Kompakte Faktenbasis zu einem Standort – das, was der Berater wissen muss. */
export function standortWissen(s: Standort): string {
  const leistungen = leistungenFuerStandort(s.slug);
  const zeiten = s.oeffnungszeiten
    .map((z) => `${z.tag}: ${z.von && z.bis ? `${z.von}–${z.bis}` : 'geschlossen'}`)
    .join(', ');

  return [
    `## KU64 ${s.name} (${s.nameLang})`,
    `Adresse: ${s.strasse}, ${s.plz} ${s.ort}`,
    `Telefon: ${s.telefon}`,
    `E-Mail: ${s.email}`,
    `Öffnungszeiten: ${zeiten}`,
    s.zeitenHinweis ? `Hinweis zu den Zeiten: ${s.zeitenHinweis}` : '',
    `Anfahrt ÖPNV: ${s.anfahrt.oepnv.join('; ')}`,
    `Parken: ${s.anfahrt.parken}`,
    `Barrierefrei: ${s.anfahrt.barrierefrei ? 'ja' : `nein. ${s.anfahrt.barrierefreiHinweis ?? ''}`}`,
    `Besonderheiten: ${s.besonderheiten.join('; ')}`,
    `Seite: /${s.slug}/`,
    `Terminbuchung: /${s.slug}/termine/`,
    '',
    `### An diesem Standort verfügbare Behandlungen (${leistungen.length})`,
    ...leistungen.map(
      (l) =>
        `- ${l.name} (/${s.slug}/leistungen/${l.slug}/): ${l.kurz} Dauer: ${l.dauer ?? 'k. A.'}. Kosten: ${l.kosten ?? 'k. A.'}. Kasse: ${l.kasse ?? 'k. A.'}`,
    ),
  ]
    .filter(Boolean)
    .join('\n');
}

/** Welche Leistungen es hier NICHT gibt – und wo stattdessen. */
export function nichtVerfuegbarWissen(s: Standort): string {
  const fehlend = LEISTUNGEN.filter((l) => !l.verfuegbar.includes(s.slug));
  if (fehlend.length === 0) return '';

  return [
    `### NICHT an diesem Standort verfügbar – bitte gezielt weiterverweisen`,
    ...fehlend.map((l) => {
      const wo = l.verfuegbar
        .map((slug) => STANDORTE.find((x) => x.slug === slug))
        .filter(Boolean)
        .map((x) => `KU64 ${x!.name} (/${x!.slug}/leistungen/${l.slug}/)`)
        .join(' oder ');
      return `- ${l.name}: hier nicht im Angebot. Verfügbar bei ${wo || 'derzeit keinem Standort'}.`;
    }),
  ].join('\n');
}

/** Ausführliches Wissen zu einzelnen Behandlungen, inklusive FAQ. */
export function leistungWissen(slugs?: string[]): string {
  const auswahl = slugs ? LEISTUNGEN.filter((l) => slugs.includes(l.slug)) : LEISTUNGEN;

  return auswahl
    .map((l) => {
      const kat = KATEGORIEN.find((k) => k.slug === l.kategorie);
      return [
        `### ${l.name} (${kat?.name ?? l.kategorie})`,
        l.teaser,
        `Andere Bezeichnungen: ${l.synonyme.join(', ')}`,
        l.dauer ? `Dauer: ${l.dauer}` : '',
        l.kosten ? `Kosten: ${l.kosten}` : '',
        l.kasse ? `Krankenkasse: ${l.kasse}` : '',
        l.ablauf?.length
          ? `Ablauf: ${l.ablauf.map((a, i) => `${i + 1}. ${a.titel} – ${a.text}`).join(' ')}`
          : '',
        l.faq.length ? `Fragen und Antworten:\n${l.faq.map((f) => `F: ${f.frage}\nA: ${f.antwort}`).join('\n')}` : '',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n\n');
}

/**
 * Systemprompt. Bewusst streng: In einer Zahnarztpraxis ist eine erfundene
 * Preisangabe oder eine als Diagnose missverstandene Aussage ein echtes
 * Problem – rechtlich wie menschlich.
 */
export function systemPrompt(standortSlug: string | null): string {
  const standort = standortSlug ? STANDORTE.find((s) => s.slug === standortSlug) : null;

  const kontext = standort
    ? [standortWissen(standort), '', nichtVerfuegbarWissen(standort)].join('\n')
    : STANDORTE.map(standortWissen).join('\n\n');

  return `Du bist der digitale Berater von KU64 – Die Zahnspezialisten. Du hilfst Menschen, die sich auf der Website über eine Zahnbehandlung informieren.

# Wer du bist
Du bist freundlich, ruhig und klar. Du sprichst Deutsch, per Sie, in kurzen Sätzen ohne Fachjargon. Wenn ein Fachbegriff unvermeidlich ist, erklärst du ihn in einem Halbsatz. Du bist nicht werblich und übertreibst nicht.

# Standortkontext
${
  standort
    ? `Die Person sieht gerade die Seite von **KU64 ${standort.name}** in ${standort.ort}. Beziehe dich auf DIESEN Standort: dessen Adresse, Telefonnummer, Öffnungszeiten und Behandlungsangebot.

WICHTIGSTE REGEL: Wenn nach einer Behandlung gefragt wird, die es an diesem Standort nicht gibt, sage das offen und nenne den Standort, an dem es sie gibt – mit Link. Tue niemals so, als sei sie hier verfügbar. Wechsle die Person aber auch nicht stillschweigend zu einem anderen Standort, sondern lass ihr die Wahl.`
    : 'Es ist noch kein Standort gewählt. Frage höflich nach dem gewünschten Standort, bevor du Angaben zu Öffnungszeiten, Telefon oder Verfügbarkeit machst – die unterscheiden sich je Standort.'
}

# Was du niemals tust
- Du stellst KEINE Diagnose und beurteilst keine Beschwerden aus der Ferne. Du kannst erklären, was eine Beschwerde bedeuten KANN, und empfiehlst dann einen Termin.
- Du erfindest KEINE Preise, Öffnungszeiten, Namen von Behandelnden oder Leistungen. Steht etwas nicht in deinem Wissen, sagst du das und verweist auf das Telefon.
- Du versprichst KEINE Behandlungsergebnisse, keine Haltbarkeit und keine Erfolgsquoten über das hinaus, was unten steht.
- Du nimmst KEINE Termine entgegen und speicherst keine persönlichen Daten. Zum Buchen verlinkst du die Terminseite.
- Du fragst NICHT nach Gesundheitsdaten, Versicherungsnummer, Geburtsdatum oder Adresse.

# Notfälle
Bei Hinweisen auf starke Schmerzen, Schwellung im Gesicht, Atem- oder Schluckbeschwerden, Fieber nach einem Eingriff oder einem Unfall mit ausgeschlagenem Zahn: Weise sofort und ohne Umschweife auf den telefonischen Kontakt hin${standort ? ` (${standort.telefon})` : ''} und bei lebensbedrohlichen Zeichen auf den Rettungsdienst 112. Halte solche Antworten kurz.

# Wie du antwortest
- Zwei bis fünf Sätze. Bei komplexen Fragen gerne eine kurze Aufzählung.
- Verlinke passende Seiten als Markdown-Link, z. B. [Zahnimplantate](/potsdam/leistungen/zahnimplantate/). Nutze ausschließlich Pfade, die unten vorkommen.
- Nenne bei Kostenfragen immer die Spanne UND den Hinweis, dass der genaue Betrag erst nach einer Untersuchung feststeht.
- Ende bei Behandlungsfragen mit einem konkreten nächsten Schritt (Termin buchen, anrufen, Seite lesen).

# Dein Wissen
${kontext}

${leistungWissen()}`;
}
