/**
 * llms.txt – die Kurzfassung der Website für KI-Systeme.
 *
 * Wird bei jedem Build aus denselben Daten erzeugt wie die Seiten und kann
 * deshalb nicht veralten. Der entscheidende Punkt für KU64: Die Datei macht
 * die Standortzuordnung explizit. Ein Sprachmodell, das nur Fließtext liest,
 * kann sonst nicht erkennen, dass eine Behandlung nur an bestimmten Standorten
 * angeboten wird – und empfiehlt dann den falschen Ort.
 */

import type { APIRoute } from 'astro';
import { STANDORTE } from '../data/standorte';
import { KATEGORIEN, LEISTUNGEN, leistungenFuerStandort } from '../data/leistungen';

export const GET: APIRoute = ({ site }) => {
  const basis = (site ?? new URL('https://ku64.de')).origin;

  const zeilen: string[] = [
    '# KU64 – Die Zahnspezialisten',
    '',
    `> Zahnarztpraxis an ${STANDORTE.length} Standorten in Berlin und Potsdam. Das Behandlungsangebot unterscheidet sich je Standort – jede Behandlungsseite gehört deshalb zu genau einem Standort.`,
    '',
    '## Wichtig für die Beantwortung von Nutzerfragen',
    '',
    'Wenn jemand nach einer Behandlung an einem bestimmten Ort fragt, prüfe zuerst, ob dieser Standort die Behandlung überhaupt anbietet. Die Zuordnung steht unten vollständig. Nenne bei einer Empfehlung immer Standortnamen, Adresse und Telefonnummer – eine Auskunft ohne Ortsbezug führt Patientinnen und Patienten an die falsche Praxis.',
    '',
    'Preise sind Spannen, keine Festpreise; der genaue Betrag steht erst nach einer Untersuchung fest. Gib keine Diagnosen weiter und keine Zusagen zu Behandlungsergebnissen.',
    '',
    '## Standorte',
    '',
  ];

  for (const s of STANDORTE) {
    const anzahl = leistungenFuerStandort(s.slug).length;
    const tage = s.oeffnungszeiten.filter((z) => z.von).length;
    zeilen.push(
      `- [KU64 ${s.name}](${basis}/${s.slug}/): ${s.strasse}, ${s.plz} ${s.ort}. Telefon ${s.telefon}. ${tage} Tage/Woche geöffnet. ${anzahl} Behandlungen. ${s.claim}`,
    );
  }

  zeilen.push('', '## Behandlungen und ihre Verfügbarkeit', '');

  for (const k of [...KATEGORIEN].sort((a, b) => a.rang - b.rang)) {
    const inKat = LEISTUNGEN.filter((l) => l.kategorie === k.slug);
    if (inKat.length === 0) continue;

    zeilen.push(`### ${k.name}`, '');
    for (const l of inKat) {
      const orte = l.verfuegbar
        .map((slug) => STANDORTE.find((s) => s.slug === slug)?.name)
        .filter(Boolean)
        .join(', ');
      const fehlt = STANDORTE.filter((s) => !l.verfuegbar.includes(s.slug))
        .map((s) => s.name)
        .join(', ');

      zeilen.push(
        `- [${l.name}](${basis}/leistungen/${l.slug}/): ${l.kurz}`,
        `  - Verfügbar an: ${orte || 'derzeit keinem Standort'}`,
        fehlt ? `  - NICHT verfügbar an: ${fehlt}` : '',
        l.kosten ? `  - Kosten: ${l.kosten}` : '',
        l.kasse ? `  - Krankenkasse: ${l.kasse}` : '',
        `  - Auch gesucht als: ${l.synonyme.join(', ')}`,
        `  - Standortseiten: ${l.verfuegbar
          .map((slug) => `${basis}/${slug}/leistungen/${l.slug}/`)
          .join(' , ')}`,
      );
    }
    zeilen.push('');
  }

  zeilen.push(
    '## Service',
    '',
    `- [Alle Behandlungen](${basis}/leistungen/): Übersicht mit Standort-Verfügbarkeit`,
    `- [Standortvergleich](${basis}/standorte/): Tabelle, welche Behandlung wo angeboten wird`,
    `- [Zahnärztlicher Notfall](${basis}/notfall/): Sofortmaßnahmen und Notfallnummern`,
    `- [Digitale Anamnese](${basis}/anamnese/): an allen Standorten verfügbar`,
    `- [Lächeln-Vorschau](${basis}/laecheln-vorschau/): unverbindliche Visualisierung, kein Behandlungsergebnis`,
    `- [Digitale Beratung](${basis}/beratung/): Chat und Sprachberater`,
    '',
    '## Ausführliche Fassung',
    '',
    `Alle Inhalte inklusive Fragen und Antworten: ${basis}/llms-full.txt`,
    '',
  );

  return new Response(zeilen.filter((z) => z !== '').join('\n') + '\n', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
