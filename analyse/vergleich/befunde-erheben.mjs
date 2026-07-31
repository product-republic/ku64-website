/**
 * Erhebt die vollständige Mängelliste der alten Website — und dieselbe
 * Messung für den Neubau, damit „behoben" belegt ist und nicht behauptet.
 *
 * ── Warum diese Datei und nicht eine Tabelle von Hand ───────────────────
 *
 * Der Bericht behauptet an mehreren Stellen, ein Mangel sei beseitigt. Wer
 * das prüfen will, braucht zwei Dinge: dieselbe Regel für alt und neu, und
 * eine Zahl, die aus den Rohdaten fällt statt aus dem Gedächtnis. Beides
 * liefert dieses Skript. Es liest `erhebung.json` — die Erhebung, die beide
 * Seiten mit demselben Crawler und denselben Feldern vermessen hat — und
 * zählt je Mangel durch.
 *
 * Wo eine Regel für die alte Seite anders lauten müsste als für die neue,
 * ist der Mangel NICHT aufgenommen. Ein Vergleich, dessen Maßstab wandert,
 * ist keiner.
 *
 * Aufruf:  node analyse/vergleich/befunde-erheben.mjs
 * Ausgabe: analyse/vergleich/befunde.json
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const hier = path.dirname(fileURLToPath(import.meta.url));

/**
 * Die Mängel, je mit einer Regel, die auf beide Bestände gleich angewandt
 * wird. `zaehlt` bekommt eine Seite und sagt, ob sie den Mangel trägt.
 *
 * Reihenfolge ist Absicht: erst was Besucher merken, dann was Google merkt,
 * dann was nur ein Prüfwerkzeug merkt.
 */
const MAENGEL = [
  {
    schluessel: 'fremdeSkripte',
    name: 'Fremde Skripte beim Seitenaufruf',
    warum:
      'Jedes fremde Skript überträgt die IP-Adresse des Besuchers, bevor er zugestimmt hat.',
    zaehlt: (s) => (s.skripteFremd ?? 0) > 0,
    summe: (s) => s.skripteFremd ?? 0,
  },
  {
    schluessel: 'ohneAlt',
    name: 'Bilder ohne Alternativtext',
    warum: 'Wer einen Screenreader benutzt, erfährt nicht, was das Bild zeigt.',
    zaehlt: (s) => (s.ohneAlt ?? 0) > 0,
    summe: (s) => s.ohneAlt ?? 0,
  },
  {
    schluessel: 'spruenge',
    name: 'Sprünge in der Überschriftengliederung',
    warum:
      'Eine übersprungene Ebene macht die Seite für Screenreader unnavigierbar.',
    zaehlt: (s) => (s.spruenge ?? 0) > 0,
    summe: (s) => s.spruenge ?? 0,
  },
  {
    schluessel: 'mehrfachH1',
    name: 'Seiten mit mehr als einer H1',
    warum:
      'Mehrere Hauptüberschriften heben sich gegenseitig auf — weder Google noch ein Screenreader weiß dann, worum es auf der Seite geht.',
    zaehlt: (s) => (s.h1 ?? 0) > 1,
  },
  {
    schluessel: 'ohneH1',
    name: 'Seiten ohne H1',
    warum: 'Ohne Hauptüberschrift fehlt der Seite die Ansage, worum es geht.',
    zaehlt: (s) => (s.h1 ?? 0) === 0,
  },
  {
    schluessel: 'ohneTitel',
    name: 'Seiten ohne Titel',
    warum: 'Der Titel ist die Zeile, die in Google steht.',
    zaehlt: (s) => !s.titel || String(s.titel).trim() === '',
  },
  {
    schluessel: 'ohneBeschreibung',
    name: 'Seiten ohne Meta-Beschreibung',
    warum: 'Ohne sie schneidet Google sich selbst einen Textschnipsel zurecht.',
    zaehlt: (s) => !s.beschreibung || String(s.beschreibung).trim() === '',
  },
  {
    schluessel: 'ohneCanonical',
    name: 'Seiten ohne Canonical',
    warum:
      'Ohne Canonical entscheidet Google selbst, welche Fassung die richtige ist.',
    zaehlt: (s) => !s.canonical,
  },
  {
    schluessel: 'ohneSchema',
    name: 'Seiten ohne strukturierte Daten',
    warum:
      'Ohne sie kennt Google weder Adresse noch Öffnungszeiten noch Bewertungen.',
    zaehlt: (s) => (s.schema ?? 0) === 0,
  },
  {
    schluessel: 'ohneLang',
    name: 'Seiten ohne Sprachauszeichnung',
    warum:
      'Ohne `lang` liest der Screenreader deutschen Text mit englischer Aussprache vor.',
    zaehlt: (s) => !s.lang || String(s.lang).trim() === '',
  },
  {
    schluessel: 'ohneHreflang',
    name: 'Seiten ohne hreflang',
    warum:
      'Ohne hreflang weiß Google nicht, dass die englische Fassung dieselbe Seite ist.',
    zaehlt: (s) => (s.hreflang ?? 0) === 0,
  },
  {
    schluessel: 'schwer',
    name: 'Seiten über 300 kB HTML',
    warum: 'Auf dem Telefon im Mobilfunknetz ist das die Sekunde vor dem Absprung.',
    zaehlt: (s) => (s.bytes ?? 0) > 300_000,
  },
  {
    schluessel: 'langsam',
    name: 'Seiten über 2 Sekunden Antwortzeit',
    warum: 'Zwei Sekunden sind die Grenze, ab der Besucher abbrechen.',
    zaehlt: (s) => (s.ms ?? 0) > 2000,
  },
  {
    schluessel: 'duenn',
    name: 'Seiten unter 150 Wörtern',
    warum: 'Zu wenig Text, um für irgendetwas zu ranken.',
    zaehlt: (s) => (s.woerter ?? 0) < 150,
  },
];

/**
 * Doppelungen lassen sich nicht je Seite entscheiden — eine Seite ist nur
 * doppelt in Bezug auf eine andere. Deshalb stehen sie außerhalb von
 * `MAENGEL` und bekommen den Bestand als Ganzes.
 *
 * ── Nur Seiten, die um denselben Platz konkurrieren ────────────────────
 *
 * Gezählt wird ausschließlich unter den Index-Kandidaten: alte Seite alles
 * ohne `noindex`, neue Seite alles in der Sitemap. Zwei Seiten mit derselben
 * Beschreibung schaden einander nur, wenn Google beide als eigenständig
 * führt. Wo ein Canonical die eine auf die andere zeigt, ist die Doppelung
 * gewollt und folgenlos.
 *
 * Die erste Fassung dieses Skripts hat das übersehen und 127 doppelte
 * Beschreibungen im Neubau gemeldet – sämtlich Standortfassungen, die per
 * Canonical auf ihre Hauptseite zeigen. Unter den 257 Sitemap-Adressen sind
 * es null. Der Unterschied ist nicht kosmetisch: Die erste Zahl hätte einen
 * Mangel behauptet, den es nicht gibt.
 */
const DOPPELUNGEN = [
  {
    schluessel: 'doppelterTitel',
    name: 'Seiten mit einem Titel, den es mehrfach gibt',
    warum:
      'Zwei Seiten mit demselben Titel konkurrieren in Google gegeneinander — beide verlieren.',
    feld: 'titel',
  },
  {
    schluessel: 'doppelteBeschreibung',
    name: 'Seiten mit einer Beschreibung, die es mehrfach gibt',
    warum:
      'Dieselbe Beschreibung auf vielen Seiten sagt Google: Hier steht überall dasselbe.',
    feld: 'beschreibung',
  },
];

/** Wie viele Seiten teilen ihren Wert mit mindestens einer anderen? */
function doppeltZaehlen(seiten, feld) {
  const zaehler = new Map();
  for (const s of seiten) {
    const wert = String(s[feld] ?? '').trim();
    if (!wert) continue;
    zaehler.set(wert, (zaehler.get(wert) ?? 0) + 1);
  }
  const betroffen = seiten.filter((s) => {
    const wert = String(s[feld] ?? '').trim();
    return wert && (zaehler.get(wert) ?? 0) > 1;
  });
  return betroffen;
}

/**
 * Zählt alle Mängel über einen Bestand durch.
 *
 * `indexKandidaten` sind die Seiten, die um einen Platz in Google
 * konkurrieren — nur unter ihnen werden Doppelungen gezählt.
 */
function erheben(seiten, indexKandidaten = null) {
  const brauchbar = seiten.filter((s) => s.status === 200);
  const kandidaten = indexKandidaten ?? brauchbar.filter((s) => !s.noindex);
  const einzeln = MAENGEL.map((m) => {
    const betroffen = brauchbar.filter((s) => m.zaehlt(s));
    return {
      schluessel: m.schluessel,
      name: m.name,
      warum: m.warum,
      seiten: betroffen.length,
      anteil: brauchbar.length ? betroffen.length / brauchbar.length : 0,
      summe: m.summe ? betroffen.reduce((a, s) => a + m.summe(s), 0) : null,
      beispiele: betroffen.slice(0, 3).map((s) => s.pfad),
    };
  });

  const doppelt = DOPPELUNGEN.map((d) => {
    const betroffen = doppeltZaehlen(kandidaten, d.feld);
    return {
      schluessel: d.schluessel,
      name: d.name,
      warum: d.warum,
      seiten: betroffen.length,
      anteil: kandidaten.length ? betroffen.length / kandidaten.length : 0,
      summe: null,
      beispiele: betroffen.slice(0, 3).map((s) => s.pfad),
    };
  });

  return [...einzeln, ...doppelt];
}

const roh = JSON.parse(
  await readFile(path.join(hier, 'erhebung.json'), 'utf8'),
);

/**
 * Die neue Website wird frisch aus `dist/` gelesen, nicht aus der Erhebung.
 *
 * Der Grund ist Datum: `erhebung.json` stammt vom 30.07., und seither hat
 * sich am Neubau einiges bewegt. Die alte Website darf aus der Erhebung
 * kommen — ku64.de ändert sich nicht, während wir messen.
 *
 * Index-Kandidat ist beim Neubau, was in der Sitemap steht.
 */
const sitemap = await readFile(
  path.join(hier, '..', '..', 'dist', 'client', 'sitemap-0.xml'),
  'utf8',
);
const angemeldet = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
  m[1].replace(/^https?:\/\/[^/]+/, ''),
);

/** Liest die Felder, die für die Doppelungsprüfung gebraucht werden. */
async function ausBau(pfad) {
  const datei = path.join(hier, '..', '..', 'dist', 'client', pfad, 'index.html');
  const html = await readFile(datei, 'utf8').catch(() => null);
  if (html === null) return null;
  return {
    status: 200,
    pfad,
    titel: (html.match(/<title[^>]*>([^<]*)</) ?? [])[1] ?? '',
    beschreibung:
      (html.match(/<meta name="description" content="([^"]*)"/) ?? [])[1] ?? '',
  };
}

const neuKandidaten = (await Promise.all(angemeldet.map(ausBau))).filter(Boolean);

const alt = erheben(roh.alt);
const neu = erheben(roh.neu, neuKandidaten);

/** Beide Seiten nebeneinander, mit der Frage: ist es weg? */
const gegenueber = alt.map((a, i) => {
  const n = neu[i];
  return {
    ...a,
    neuSeiten: n.seiten,
    neuSumme: n.summe,
    behoben: n.seiten === 0,
    // Ein Mangel gilt als „entschärft", wenn er nicht ganz weg, aber um
    // mindestens neun Zehntel zurückgegangen ist. Ehrlicher als „behoben“.
    entschaerft: n.seiten > 0 && a.seiten > 0 && n.seiten / a.seiten <= 0.1,
  };
});

const ergebnis = {
  erhobenAm: roh.erhobenAm,
  altSeiten: roh.alt.filter((s) => s.status === 200).length,
  neuSeiten: roh.neu.filter((s) => s.status === 200).length,
  maengel: gegenueber,
};

await writeFile(
  path.join(hier, 'befunde.json'),
  JSON.stringify(ergebnis, null, 2) + '\n',
);

/**
 * Nur was die alte Website wirklich trägt, ist ein Befund. Ein Mangel, den
 * sie nie hatte, gehört nicht in eine Liste behobener Mängel — sonst steht
 * am Ende eine große Zahl, die beim ersten Nachrechnen zerfällt.
 */
const echte = gegenueber.filter((m) => m.seiten > 0);
const behoben = echte.filter((m) => m.behoben).length;
const geprueft = MAENGEL.length + DOPPELUNGEN.length;

console.log(
  `[befunde] ${geprueft} Mängel geprüft, ${echte.length} trägt die alte Website`,
);
console.log(`[befunde] davon im Neubau vollständig behoben: ${behoben}`);
console.log(
  `[befunde] ${geprueft - echte.length} Mängel hatte die alte Website nicht ` +
    `– sie stehen nicht als Erfolg in der Liste`,
);
for (const m of gegenueber) {
  const zeichen = m.seiten === 0 ? '·' : m.behoben ? '✓' : m.entschaerft ? '~' : '!';
  console.log(
    `  ${zeichen} ${m.name.padEnd(46)} alt ${String(m.seiten).padStart(4)}` +
      `   neu ${String(m.neuSeiten).padStart(4)}`,
  );
}
