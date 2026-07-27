#!/usr/bin/env node
/**
 * Holt die Personenprofile von der alten Website.
 *
 * ── Was dort steht und hier fehlte ─────────────────────────────────────────
 *
 * Jede Person hat auf ku64.de eine eigene Seite mit Schwerpunkten, dem
 * beruflichen Werdegang, Mitgliedschaften und teils Publikationen. Das ist
 * genau das, wonach jemand sucht, der wissen will, wem er den Mund öffnet –
 * und es ist nirgends sonst zu bekommen: In den Weiterleitungsregeln stand
 * nur, dass es diese Seiten gab, nicht, was auf ihnen steht.
 *
 * ── Wie die Seiten aufgebaut sind ──────────────────────────────────────────
 *
 * Elementor, also verschachtelte `div`-Ebenen ohne semantische Struktur. Was
 * sich verlässlich greifen lässt, sind die Überschriften: Alles zwischen
 * einer `h2` und der nächsten gehört zu ihr. Am Seitenende folgen
 * Fußzeilenblöcke, die auf jeder Seite gleich sind – Öffnungszeiten, Jobs,
 * Blog. Die stehen in `NICHT_UEBERNEHMEN` und fallen weg.
 *
 * ── Zwei Sorten Seite, und die zweite fiel durch ───────────────────────────
 *
 * Die Praxis pflegt diese Seiten in zwei Fassungen. Die eine ist gegliedert:
 * „Schwerpunkte“, „Beruflicher Werdegang“, „Mitgliedschaften“ – Überschrift,
 * Inhalt, nächste Überschrift. Die andere ist ein Brief: eine Anrede, ein
 * paar Absätze in der Ich-Form, eine Grußformel. Keine einzige Überschrift.
 *
 * Weil hier zuerst nur nach Überschriften gesucht wurde, kamen 55 von 100
 * Personen durch und 45 galten als „ohne Inhalt“. Sie hatten Inhalt – er war
 * nur nicht überschrieben. Nachgemessen: 43 dieser Seiten tragen einen
 * Vorstellungstext, 51 haben beides, 5 nur Abschnitte. Alle 99 erreichbaren
 * Seiten haben etwas zu sagen; eine (Liana Noack) ist auf ku64.de selbst
 * inzwischen 404.
 *
 * Der Brief wird als `vorstellung` geführt, nicht als Abschnitt mit
 * erfundener Überschrift. „Über mich“ über einen Text, der mit „Liebe
 * Patientinnen, liebe Patienten“ beginnt, wäre eine Überschrift, die die
 * Person nicht geschrieben hat.
 *
 * ── Was aus dem Brief herausfällt ──────────────────────────────────────────
 *
 * Telefonnummern und ku64.de-Adressen. Nicht aus Prinzip, sondern weil sie
 * veralten: Die Durchwahl gehört zum Standort, und den kennt die neue Seite
 * besser als der Text. Ebenso die Grußformel samt Namenszug – der Name steht
 * in der Überschrift und unter dem Porträt, ein drittes Mal ist keine
 * Höflichkeit mehr, sondern Doppelung.
 *
 * ── Örtlich zwischenspeichern ──────────────────────────────────────────────
 *
 * `--aus <verzeichnis>` liest die Seiten aus einem Ordner statt aus dem Netz.
 * Das ist kein Komfort, sondern Voraussetzung fürs Entwickeln: Am Zerlegen
 * hundertfach verschachtelter Elementor-Seiten wird man zwanzigmal
 * nachbessern, und zwanzigmal hundert Abrufe gegen eine fremde Website sind
 * unhöflich.
 *
 * ── Warum das Ergebnis eingecheckt wird ────────────────────────────────────
 *
 * Weil es Redaktionsinhalt ist, kein Rohmaterial. Die neue Website soll
 * diese Texte tragen, auch wenn ku64.de morgen abgeschaltet wird. Die
 * Herkunft steht in jedem Eintrag – wer einen Text ändert, sieht, woher er
 * kam.
 *
 * ── Aufruf ─────────────────────────────────────────────────────────────────
 *
 *   node profile-holen.mjs [--nur 3]
 *
 * Schreibt `src/data/profile.json`.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const HIER = import.meta.dirname;
const WURZEL = path.resolve(HIER, '../..');
const PARALLEL = 5;

/** Nur so viele Personen laden – zum Ausprobieren. */
const nurIndex = process.argv.indexOf('--nur');
const NUR = nurIndex >= 0 ? Number(process.argv[nurIndex + 1]) : Infinity;

/** Seiten aus einem Ordner lesen statt aus dem Netz – siehe Kopfkommentar. */
const ausIndex = process.argv.indexOf('--aus');
const AUS = ausIndex >= 0 ? path.resolve(process.argv[ausIndex + 1]) : null;

/**
 * Überschriften, die auf jeder Seite stehen und nichts über die Person
 * sagen. Verglichen wird auf Kleinschreibung und Anfang, damit
 * „Öffnungszeiten - Kudamm“ und „Öffnungszeiten – Potsdam“ beide fallen.
 */
const NICHT_UEBERNEHMEN = [
  'öffnungszeiten',
  'bleibe up-to-date',
  'jobs',
  'blog',
  'newsletter',
  'kontakt',
  'termin',
  'standorte',
  'folge uns',
];

function entschaerfen(roh) {
  return roh
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|h[1-6]|div)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, z) => String.fromCodePoint(Number(z)))
    .replace(/&#x([0-9a-f]+);/gi, (_, z) => String.fromCodePoint(parseInt(z, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

/**
 * Nur der Inhaltsbereich zählt.
 *
 * Ohne diese Eingrenzung reichte der letzte Abschnitt bis zum Seitenende und
 * sammelte die Fußzeile mit ein – im Werdegang von Abby Ferguson standen
 * daraufhin die Punkte „TERMIN, TELEFON, WHATSAPP“. Das ist kein
 * Parserfehler im Detail, sondern der Normalfall bei Seiten ohne semantische
 * Struktur: Was nicht abgegrenzt wird, läuft weiter.
 */
function hauptbereich(ganzeSeite) {
  const von = ganzeSeite.indexOf('<main');
  const bis = ganzeSeite.indexOf('</main');
  return von >= 0 && bis > von ? ganzeSeite.slice(von, bis) : ganzeSeite;
}

/**
 * Vergleichsform: Groß-/Kleinschreibung, weiche Trennstriche und
 * Mehrfachleerzeichen weg.
 *
 * Das weiche Trennzeichen ist der Grund, warum es diese Funktion gibt: Die
 * Funktionsbezeichnungen der alten Website enthalten es reichlich
 * („Zahn­medizinische Fach­angestellte“), und ohne Normalisierung schlägt
 * jeder Vergleich mit derselben Zeichenkette aus dem Teambestand fehl.
 */
function vergleichbar(s) {
  return s
    .replace(/[­​]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Zeilen, die nicht in einen Vorstellungstext gehören.
 *
 * Jede mit Begründung, denn eine zu scharfe Regel schneidet echten Text weg
 * und das fällt niemandem auf – der Absatz fehlt einfach.
 */
const RAUS_AUS_VORSTELLUNG = [
  /* Durchwahlen veralten und gehören zum Standort, nicht zur Person. */
  { muster: /^[\s\p{Emoji}\p{So}]*(?:tel\.?|telefon|fon)?[\s:]*(?:\+49|0)[\d\s\-/()]{6,}$/iu },
  /* Adressen auf die alte Website – genau die soll ja abgelöst werden. */
  { muster: /(?:^|\s)(?:https?:\/\/)?(?:www\.)?ku64\.de(?:\/|\s|$)/i },
  { muster: /^[\s\p{Emoji}\p{So}]*(?:https?:\/\/|www\.)\S+$/iu },
  /* Zwischenüberschriften der Kontaktangaben, die damit gegenstandslos werden. */
  { muster: /^(infos?|termine?|kontakt)[\s&+und]*(infos?|termine?|kontakt)?\s*:?\s*$/i },
  /* Grußformel und Namenszug – der Name steht schon zweimal auf der Seite. */
  { muster: /^(herzlichst|herzliche gr[üu][ßs]e|liebe gr[üu][ßs]e|viele gr[üu][ßs]e|bis bald|eure?|ihre?)[,!.]?$/i },
  /* Schaltflächen, die beim Entschärfen zu Textzeilen wurden. */
  { muster: /^(jetzt\s+)?(termin|online.?termin|beratung|profil|mehr|weiterlesen|bewerben)\b.{0,60}(buchen|vereinbaren|anfragen|erfahren|ansehen)?\s*$/i },
  { muster: /^(zum profil|mehr erfahren|weiterlesen|jetzt bewerben)/i },
  /*
   * Bindezeilen, die erst durch das Entfernen der Kontaktangaben zu
   * Fragmenten wurden: „oder telefonisch unter“ stand über einer Nummer, die
   * nicht mehr da ist. Ein Halbsatz ohne Fortsetzung ist schlimmer als die
   * Nummer, die er ankündigte.
   */
  { muster: /^(oder|und|sowie)\b[^.!?]{0,45}$/i },
  /* Ankündigungen ohne Angekündigtes: „Übrigens:“ vor einem entfernten Link. */
  { muster: /^\S{1,20}:$/ },
  /* Reine Bild- oder Zeichenzeilen. */
  { muster: /^[\s\p{Emoji}\p{So}\p{P}]+$/u },
];

/**
 * Der Vorstellungstext: alles vor der ersten Überschrift.
 *
 * Die ersten beiden Zeilen sind auf diesen Seiten verlässlich Name und
 * Funktion – beides steht im Teambestand und auf der neuen Seite ohnehin
 * über dem Text. Sie fallen deshalb weg, aber nur, wenn sie es wirklich
 * sind: Verglichen wird gegen die bekannten Werte, nicht nach Position.
 */
function vorstellung(html, person) {
  const erste = /<h2[^>]*>/i.exec(html);
  const roh = entschaerfen(html.slice(0, erste ? erste.index : html.length));

  const name = vergleichbar(person.name);
  const funktion = person.funktion ? vergleichbar(person.funktion) : null;
  /* „Ihre Atoosa Hafezi“, „Ihr Dr. Nils Radsack“ – Grußformel mit Namenszug. */
  const namenszug = new RegExp(
    `^(?:herzlichst,?\\s*)?(?:ihre?|eure?)\\s+(?:dr\\.?\\s*|med\\.?\\s*|dent\\.?\\s*)*${person.name
      .split(/\s+/)
      .slice(-1)[0]
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*[,!.]?$`,
    'i',
  );

  const zeilen = [];
  let gesehen = 0;
  for (const roheZeile of roh.split('\n')) {
    const zeile = roheZeile.trim();
    if (zeile.length < 2) continue;
    const stelle = gesehen++;

    const v = vergleichbar(zeile);
    if (v === name) continue;
    if (funktion && v === funktion) continue;
    if (namenszug.test(zeile)) continue;
    if (RAUS_AUS_VORSTELLUNG.some((r) => r.muster.test(zeile))) continue;

    /*
     * Der Seitenkopf: Name, darunter die Funktionsbezeichnung.
     *
     * Der Vergleich mit `person.funktion` allein reicht nicht – im
     * Teambestand steht „Zahnarzt, medizinischer Leiter“, auf der
     * Personenseite „Zahnarzt für Zahnästhetik und Endodontologie,
     * medizinischer Leiter“. Dieselbe Angabe, andere Fassung.
     *
     * Erkennbar ist sie an ihrer Form: Sie steht ganz oben, ist kurz und
     * endet nicht als Satz. Beides zusammen trifft auf keinen
     * Vorstellungstext zu – der beginnt mit einer Anrede oder einem Satz,
     * und beide haben ein Satzzeichen am Ende.
     */
    if (stelle < 2 && zeile.length < 120 && !/[.!?]$/.test(zeile)) continue;

    zeilen.push(zeile);
  }

  /*
   * Eine Schwelle, damit nicht ein übriggebliebener Halbsatz als
   * Vorstellungstext durchgeht. Gemessen liegt der kürzeste echte Text bei
   * gut 200 Zeichen, der längste Rest einer gegliederten Seite bei unter 60.
   */
  return zeilen.join(' ').length >= 120 ? zeilen : [];
}

/**
 * Zerlegt eine Seite in Abschnitte: Überschrift plus alles bis zur nächsten.
 *
 * Zeilen werden einzeln zurückgegeben statt als ein Textblock. Ein
 * Werdegang ist eine Liste von Jahren, und als Liste gesetzt liest er sich
 * um Längen besser als als Absatz – das lässt sich aber nur entscheiden,
 * solange die Zeilenstruktur noch da ist.
 */
function abschnitte(html) {
  const treffer = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)];
  const raus = [];

  for (let i = 0; i < treffer.length; i++) {
    const titel = entschaerfen(treffer[i][1]);
    if (!titel || titel.startsWith('[')) continue;
    if (NICHT_UEBERNEHMEN.some((n) => titel.toLowerCase().startsWith(n))) continue;

    const von = treffer[i].index + treffer[i][0].length;
    const bis = i + 1 < treffer.length ? treffer[i + 1].index : html.length;
    const roh = html.slice(von, bis);

    /* Ist der Abschnitt eine Aufzählung, wird sie als solche übernommen. */
    const punkte = [...roh.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map((m) => entschaerfen(m[1]))
      .filter(Boolean);

    const zeilen = (punkte.length ? punkte : entschaerfen(roh).split('\n'))
      .map((z) => z.trim())
      .filter((z) => z.length > 1)
      /* Reste der Seitenmechanik, die in keinen Lebenslauf gehören. */
      .filter((z) => !/^(zum profil|mehr erfahren|jetzt|weiterlesen)/i.test(z));

    if (!zeilen.length) continue;
    raus.push({ titel, zeilen: zeilen.slice(0, 40), alsListe: punkte.length > 0 });
  }
  return raus;
}

async function abrufen(person, versuche = 3) {
  if (AUS) {
    const datei = path.join(AUS, `${person.slug}.html`);
    return existsSync(datei) ? readFile(datei, 'utf8') : null;
  }
  for (let i = 0; i < versuche; i++) {
    try {
      const a = await fetch(person.url, {
        headers: { 'user-agent': 'KU64-Relaunch/1.0 (Profilübernahme, eigene Website)' },
        signal: AbortSignal.timeout(60_000),
      });
      if (a.ok) return await a.text();
      if (a.status === 404) return null;
    } catch {
      /* nächster Versuch */
    }
    await new Promise((r) => setTimeout(r, 1000 * 2 ** i));
  }
  return null;
}

const team = JSON.parse(await readFile(path.join(HIER, 'team-bestand.json'), 'utf8'));
const liste = team.slice(0, NUR);

console.log(`[profile] ${liste.length} Personenseiten ${AUS ? `aus ${AUS}` : 'abrufen'} …`);

const profile = {};
let fertig = 0;
const ohneSeite = [];
const ohneInhalt = [];

let naechster = 0;
await Promise.all(
  Array.from({ length: PARALLEL }, async () => {
    while (naechster < liste.length) {
      const person = liste[naechster++];
      const seite = await abrufen(person);
      fertig++;
      if (fertig % 10 === 0) process.stdout.write(`\r[profile] ${fertig}/${liste.length}`);
      if (!seite) {
        ohneSeite.push(person.slug);
        continue;
      }

      const html = hauptbereich(seite);
      const teile = abschnitte(html);
      const brief = vorstellung(html, person);

      if (!teile.length && !brief.length) {
        ohneInhalt.push(person.slug);
        continue;
      }

      profile[person.slug] = {
        name: person.name,
        funktion: person.funktion,
        vorstellung: brief,
        abschnitte: teile,
        quelle: person.url,
      };
    }
  }),
);
process.stdout.write('\n');

/* Sortiert schreiben: Sonst wandert bei jedem Lauf die Reihenfolge, weil die
   Abrufe unterschiedlich schnell zurückkommen, und der Diff ist wertlos. */
const sortiert = {};
for (const slug of Object.keys(profile).sort()) sortiert[slug] = profile[slug];

await writeFile(
  path.join(WURZEL, 'src/data/profile.json'),
  JSON.stringify(sortiert, null, 2) + '\n',
);

const alle = Object.values(profile);
console.log(
  `[profile] ${alle.length} von ${liste.length} Profilen: ` +
    `${alle.filter((p) => p.vorstellung.length).length} mit Vorstellungstext, ` +
    `${alle.filter((p) => p.abschnitte.length).length} mit Abschnitten`,
);
if (ohneSeite.length) console.log(`[profile] Seite nicht erreichbar: ${ohneSeite.join(', ')}`);
if (ohneInhalt.length) console.log(`[profile] Seite ohne Inhalt: ${ohneInhalt.join(', ')}`);

const zaehlung = {};
for (const p of alle) {
  for (const a of p.abschnitte) zaehlung[a.titel] = (zaehlung[a.titel] ?? 0) + 1;
}
console.log('[profile] Häufigste Abschnitte:');
for (const [titel, n] of Object.entries(zaehlung).sort((a, b) => b[1] - a[1]).slice(0, 12)) {
  console.log(`    ${String(n).padStart(3)}  ${titel}`);
}
console.log('\n[profile] → src/data/profile.json');
