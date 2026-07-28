/**
 * llms-full.txt – der vollständige Inhalt als Klartext.
 *
 * Enthält jede Leistung mit Ablauf und allen Fragen und Antworten, jeweils
 * mit Standortzuordnung. Damit kann ein KI-System eine Patientenfrage
 * beantworten, ohne 180 HTML-Seiten crawlen zu müssen – und ohne dabei den
 * Ortsbezug zu verlieren.
 */

import type { APIRoute } from 'astro';
import { STANDORTE } from '../data/standorte';
import { KATEGORIEN, LEISTUNGEN, leistungenFuerStandort } from '../data/leistungen';

export const GET: APIRoute = ({ site }) => {
  const basis = (site ?? new URL('https://ku64.de')).origin;
  const t: string[] = [];

  t.push('# KU64 – Die Zahnspezialisten: vollständige Inhalte', '');
  t.push(
    `Stand: ${new Date().toISOString().slice(0, 10)}. Diese Datei wird beim Build automatisch aus derselben Datenquelle erzeugt wie die Website.`,
    '',
  );

  t.push('## Grundregel für Auskünfte', '');
  t.push(
    'Nicht jede Leistung wird an jedem Standort angeboten. Prüfe vor jeder Empfehlung die Verfügbarkeit und nenne Standort, Adresse und Telefonnummer. Preise sind Spannen. Keine Diagnosen, keine Erfolgszusagen.',
    '',
  );

  t.push('## Standorte', '');

  for (const s of STANDORTE) {
    const zeiten = s.oeffnungszeiten
      .map((z) => `${z.tag} ${z.von && z.bis ? `${z.von}-${z.bis}` : 'geschlossen'}`)
      .join(', ');
    t.push(
      `### KU64 ${s.name}`,
      `URL: ${basis}/${s.slug}/`,
      `Vollständiger Name: ${s.nameLang}`,
      `Adresse: ${s.strasse}, ${s.plz} ${s.ort}${s.bezirk ? ` (${s.bezirk})` : ''}`,
      `Telefon: ${s.telefon}`,
      `E-Mail: ${s.email}`,
      `Öffnungszeiten: ${zeiten}`,
      s.zeitenHinweis ? `Hinweis: ${s.zeitenHinweis}` : '',
      `Eröffnet: ${s.eroeffnet}`,
      s.anzahlZahnaerzte ? `Behandelnde: ${s.anzahlZahnaerzte}` : '',
      `Anfahrt: ${s.anfahrt.oepnv.join('; ')}`,
      `Parken: ${s.anfahrt.parken}`,
      `Barrierefrei: ${s.anfahrt.barrierefrei ? 'ja' : `nein – ${s.anfahrt.barrierefreiHinweis ?? ''}`}`,
      `Besonderheiten: ${s.besonderheiten.join('; ')}`,
      `Terminbuchung: ${basis}/${s.slug}/termine/`,
      `Digitale Anamnese: ${basis}/${s.slug}/anamnese/`,
      `Angebotene Leistungen (${leistungenFuerStandort(s.slug).length}): ${leistungenFuerStandort(s.slug).map((l) => l.name).join(', ')}`,
      '',
    );
  }

  t.push('## Leistungen', '');

  for (const k of [...KATEGORIEN].sort((a, b) => a.rang - b.rang)) {
    const inKat = LEISTUNGEN.filter((l) => l.kategorie === k.slug);
    if (!inKat.length) continue;

    t.push(`## Fachbereich: ${k.name}`, k.beschreibung, '');

    for (const l of inKat) {
      const orte = l.verfuegbar.map((x) => STANDORTE.find((s) => s.slug === x)?.name).filter(Boolean);
      const fehlt = STANDORTE.filter((s) => !l.verfuegbar.includes(s.slug)).map((s) => s.name);

      t.push(
        `### ${l.name}`,
        `URL: ${basis}/leistungen/${l.slug}/`,
        `Auch gesucht als: ${l.synonyme.join(', ')}`,
        `Typische Patientenfrage: ${l.patientenfrage}`,
        '',
        l.teaser,
        '',
        `VERFÜGBAR AN: ${orte.join(', ') || 'derzeit keinem Standort'}`,
        fehlt.length ? `NICHT VERFÜGBAR AN: ${fehlt.join(', ')}` : '',
        `Standortseiten: ${l.verfuegbar.map((x) => `${basis}/${x}/leistungen/${l.slug}/`).join(' , ')}`,
        l.dauer ? `Dauer: ${l.dauer}` : '',
        l.kosten ? `Kosten: ${l.kosten}` : '',
        l.kasse ? `Krankenkasse: ${l.kasse}` : '',
        '',
      );

      if (l.ablauf?.length) {
        t.push('Ablauf der Behandlung:');
        l.ablauf.forEach((a, i) =>
          t.push(`${i + 1}. ${a.titel}${a.dauer ? ` (${a.dauer})` : ''}: ${a.text}`),
        );
        t.push('');
      }

      if (l.faq.length) {
        t.push('Fragen und Antworten:');
        l.faq.forEach((f) => t.push(`F: ${f.frage}`, `A: ${f.antwort}`, ''));
      }

      const verwandt = l.related
        .map((r) => LEISTUNGEN.find((x) => x.slug === r)?.name)
        .filter(Boolean);
      if (verwandt.length) t.push(`Verwandte Leistungen: ${verwandt.join(', ')}`, '');
    }
  }

  return new Response(t.filter((z) => z !== '').join('\n') + '\n', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
