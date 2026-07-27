#!/usr/bin/env node
/**
 * Holt die Beschwerdeseiten der alten Website.
 *
 * ── Warum ausgerechnet diese Seiten ────────────────────────────────────────
 *
 * Weil Menschen ihr Symptom eintippen, nicht den Fachbegriff. Niemand sucht
 * nach „Parodontitistherapie“, bevor er weiß, dass er sie braucht – gesucht
 * wird „Zahnfleisch blutet“. Der Weg dorthin führt über diese 30 Seiten, und
 * jede von ihnen ist bei Google zu einer Frage aufgestellt, die tausendfach
 * gestellt wird.
 *
 * Bisher leiteten diese Adressen auf die jeweils passende Behandlung weiter.
 * Das rettet den Verweis, nicht den Text: Wer „Mundgeruch – was tun?“ sucht
 * und auf einer Seite über professionelle Zahnreinigung landet, hat seine
 * Frage nicht beantwortet bekommen. Google merkt das schneller als wir.
 *
 * ── Was übernommen wird ────────────────────────────────────────────────────
 *
 * Der fachliche Teil: Überschriften, Absätze, Aufzählungen in ihrer
 * Reihenfolge, dazu die häufigen Fragen. Nicht übernommen wird alles, was auf
 * jeder dieser Seiten gleich steht – die drei Standortkästen, Anfahrt,
 * Öffnungszeiten, Social Media. Das hat die neue Website an anderer Stelle
 * und besser, und dreißigmal dieselbe Adresse macht keine Seite stärker.
 *
 * ── Die häufigen Fragen kommen aus den Daten, nicht aus dem Text ───────────
 *
 * Die alte Website legt sie zusätzlich als FAQPage-Auszeichnung ab. Das ist
 * die verlässlichere Quelle: Im sichtbaren Text stecken sie in einem
 * Aufklapp-Element, dessen Aufbau sich von Seite zu Seite unterscheidet – in
 * der Auszeichnung stehen sie als Frage und Antwort nebeneinander.
 *
 * ── Aufruf ─────────────────────────────────────────────────────────────────
 *
 *   node beschwerden-holen.mjs [--aus <verzeichnis>]
 *
 * Schreibt `src/data/beschwerden.json`.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const HIER = import.meta.dirname;
const WURZEL = path.resolve(HIER, '../..');
const PARALLEL = 4;

const ausIndex = process.argv.indexOf('--aus');
const AUS = ausIndex >= 0 ? path.resolve(process.argv[ausIndex + 1]) : null;

/**
 * Überschriften, ab denen der eigene Inhalt zu Ende ist.
 *
 * Nicht „diese Überschrift überspringen“, sondern „ab hier ist Schluss“: Der
 * Praxisteil steht auf allen Seiten am Ende, und was danach kommt, gehört
 * dazu. Ein einzelnes Überspringen ließe die Absätze der Standortkästen
 * stehen und nur ihre Überschriften verschwinden.
 */
const AB_HIER_FUSSZEILE =
  /^(unsere zahnarztpraxis|ku64 (berlin|potsdam)|anfahrt|anreise|kontakt aufnehmen|nehmen sie kontakt|wir sind für sie da|noch fragen|öffnungszeiten|folgen sie uns|bleiben sie up|bleibe up|schon gelesen|jobs|newsletter|standorte|termin)/i;

/**
 * Überschriften, die im Fluss stehen bleiben, aber nichts eigenes sagen.
 *
 * Das Inhaltsverzeichnis baut die neue Seite aus ihren eigenen Überschriften;
 * die Fragenliste kommt aus der Auszeichnung und würde sonst doppelt
 * erscheinen.
 */
const UEBERSPRINGEN = /^(inhaltsverzeichnis|faqs?\b|häufig gestellte fragen)/i;

function entschaerfen(roh) {
  return roh
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|h[1-6])>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, z) => String.fromCodePoint(Number(z)))
    .replace(/&#x([0-9a-f]+);/gi, (_, z) => String.fromCodePoint(parseInt(z, 16)))
    .replace(/&shy;/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

async function abrufen(slug, url, versuche = 3) {
  if (AUS) {
    const datei = path.join(AUS, `${slug}.html`);
    return existsSync(datei) ? readFile(datei, 'utf8') : null;
  }
  for (let i = 0; i < versuche; i++) {
    try {
      const a = await fetch(url, {
        headers: { 'user-agent': 'KU64-Relaunch/1.0 (Inhaltsübernahme, eigene Website)' },
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

/**
 * Die häufigen Fragen aus der FAQPage-Auszeichnung.
 *
 * Die Seiten führen mehrere `ld+json`-Blöcke, von denen nicht jeder gültiges
 * JSON ist – ein kaputter darf die übrigen nicht mitreißen, deshalb wird
 * jeder für sich versucht.
 */
function haeufigeFragen(html) {
  const fragen = [];
  for (const block of html.matchAll(
    /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    let daten;
    try {
      daten = JSON.parse(block[1]);
    } catch {
      continue;
    }
    const flach = [];
    const sammeln = (x) => {
      if (Array.isArray(x)) x.forEach(sammeln);
      else if (x && typeof x === 'object') {
        flach.push(x);
        if (x['@graph']) sammeln(x['@graph']);
      }
    };
    sammeln(daten);

    for (const x of flach) {
      if (x['@type'] !== 'FAQPage') continue;
      for (const e of x.mainEntity ?? []) {
        const frage = entschaerfen(String(e.name ?? ''));
        const antwort = entschaerfen(String(e.acceptedAnswer?.text ?? ''));
        if (frage && antwort) fragen.push({ frage, antwort });
      }
    }
  }
  return fragen;
}

/**
 * Der fachliche Teil: Überschriften mit ihrem Inhalt, in Reihenfolge.
 *
 * Alles vor der ersten Überschrift ist der Einstieg – auf diesen Seiten
 * verlässlich ein oder zwei Absätze, die die Beschwerde einordnen.
 */
function zerlegen(ganzeSeite) {
  const von = ganzeSeite.indexOf('<main');
  const bis = ganzeSeite.indexOf('</main');
  const html = von >= 0 && bis > von ? ganzeSeite.slice(von, bis) : ganzeSeite;

  const ueberschriften = [...html.matchAll(/<(h2|h3)[^>]*>([\s\S]*?)<\/\1>/gi)].filter((m) =>
    entschaerfen(m[2]),
  );

  /** Absätze und Listen eines Bereichs, in ihrer Reihenfolge. */
  const bloecke = (roh) => {
    const raus = [];
    for (const m of roh.matchAll(/<(p|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
      const art = m[1].toLowerCase();
      if (art === 'p') {
        const text = entschaerfen(m[2]);
        if (text.length < 15) continue;
        /* Das eingebaute Inhaltsverzeichnis: eine Zeile aus Sprungmarken. */
        if ((text.match(/\|/g)?.length ?? 0) >= 3) continue;
        raus.push({ art: 'absatz', text });
      } else {
        const punkte = [...m[2].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
          .map((x) => entschaerfen(x[1]))
          .filter((x) => x.length > 2);
        /* Navigationslisten haben viele sehr kurze Einträge und keine Sätze. */
        if (punkte.length && punkte.some((p) => p.length > 25)) {
          raus.push({ art: 'liste', punkte });
        }
      }
    }
    return raus;
  };

  const einstieg = bloecke(
    html.slice(0, ueberschriften.length ? ueberschriften[0].index : html.length),
  );

  const abschnitte = [];
  for (let i = 0; i < ueberschriften.length; i++) {
    const titel = entschaerfen(ueberschriften[i][2]);
    if (AB_HIER_FUSSZEILE.test(titel)) break;
    if (UEBERSPRINGEN.test(titel)) continue;

    const anfang = ueberschriften[i].index + ueberschriften[i][0].length;
    const ende = i + 1 < ueberschriften.length ? ueberschriften[i + 1].index : html.length;
    const inhalt = bloecke(html.slice(anfang, ende));
    if (!inhalt.length) continue;

    abschnitte.push({ ebene: ueberschriften[i][1].toLowerCase(), titel, bloecke: inhalt });
  }

  return { einstieg, abschnitte };
}

/* ── Seiten einsammeln ────────────────────────────────────────────────────*/

const adressen = (await readFile(path.join(HIER, 'urls-crawl.txt'), 'utf8'))
  .split('\n')
  .map((z) => z.trim())
  .filter((z) => /^\/zahnbeschwerden\/./.test(z));

console.log(`[beschwerden] ${adressen.length} Seiten ${AUS ? `aus ${AUS}` : 'abrufen'} …`);

const seiten = [];
const ohneInhalt = [];
let naechster = 0;

await Promise.all(
  Array.from({ length: PARALLEL }, async () => {
    while (naechster < adressen.length) {
      const pfad = adressen[naechster++];
      const slug = pfad.replace(/\/$/, '').split('/').pop();
      const html = await abrufen(slug, `https://ku64.de${pfad}`);
      if (!html) {
        ohneInhalt.push(slug);
        continue;
      }

      const titel = entschaerfen(
        /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html)?.[1] ?? slug.replace(/-/g, ' '),
      );
      const beschreibung = entschaerfen(
        /<meta[^>]+name="description"[^>]+content="([^"]*)"/i.exec(html)?.[1] ?? '',
      );

      const { einstieg, abschnitte } = zerlegen(html);
      const faq = haeufigeFragen(html);

      const menge =
        einstieg.length + abschnitte.reduce((n, a) => n + a.bloecke.length, 0) + faq.length;
      if (menge < 3) {
        ohneInhalt.push(slug);
        continue;
      }

      seiten.push({ slug, titel, beschreibung, einstieg, abschnitte, faq, quelle: `https://ku64.de${pfad}` });
    }
  }),
);

seiten.sort((a, b) => a.slug.localeCompare(b.slug));

await writeFile(
  path.join(WURZEL, 'src/data/beschwerden.json'),
  JSON.stringify(seiten, null, 2) + '\n',
);

const woerter = seiten.map((s) =>
  [
    ...s.einstieg,
    ...s.abschnitte.flatMap((a) => a.bloecke),
  ]
    .map((b) => b.text ?? (b.punkte ?? []).join(' '))
    .join(' ')
    .split(/\s+/).length,
);

console.log(
  `[beschwerden] ${seiten.length} Seiten übernommen, ` +
    `${seiten.filter((s) => s.faq.length).length} mit Fragenliste`,
);
console.log(
  `[beschwerden] Umfang: ${Math.min(...woerter)}–${Math.max(...woerter)} Wörter, ` +
    `im Mittel ${Math.round(woerter.reduce((a, b) => a + b, 0) / woerter.length)}`,
);
if (ohneInhalt.length) console.log(`[beschwerden] Ohne Inhalt: ${ohneInhalt.join(', ')}`);
console.log('\n[beschwerden] → src/data/beschwerden.json');
