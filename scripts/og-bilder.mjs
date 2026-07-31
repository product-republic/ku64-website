/**
 * Erzeugt die Vorschaubilder für Social Media und Messenger (OpenGraph).
 *
 * Warum selbst erzeugt statt Stock: Diese Bilder zeigen ausschließlich echte
 * Daten der jeweiligen Seite – Standortname, Adresse, Behandlung,
 * Telefonnummer – auf echten Fotos der jeweiligen Praxis. Es wird keine
 * Fotografie erfunden, keine Praxis nachgestellt und kein Mensch abgebildet,
 * den es nicht gibt.
 *
 * ── Warum jetzt mit Foto ────────────────────────────────────────────────
 *
 * Vorher war die Karte rein typografisch: dunkler Verlauf, zwei Kreise als
 * Motiv. Das war sauber und sagte nichts. Ein geteilter Link ist für viele
 * der erste Kontakt mit der Praxis überhaupt – in einem Chat steht die
 * Karte größer da als jedes Suchergebnis. Der Raum, den man betritt,
 * beantwortet dort mehr als jede Zeile Text.
 *
 * Genommen wird das Foto, das zur Seite gehört: der eigene Standort für die
 * Standortseiten und die Behandlungen dort, der Kurfürstendamm für alles
 * Übrige. Kein Motiv, das es nicht gibt.
 *
 * ── Und warum die Farben jetzt stimmen ──────────────────────────────────
 *
 * Der Akzent stand auf #e8532e – ein Orange, das auf der ganzen Website
 * nirgends vorkommt. Die Wortmarke ist zweifarbig: KU in #FFCC00, die 64 in
 * Hausrot. Auf dunklem Grund nimmt sie dieselbe helle Fassung wie das Logo
 * über Bild und Video (siehe Logo.astro).
 *
 * Läuft VOR dem Astro-Build, damit die Dateien unter public/og/ liegen und
 * regulär mit ausgeliefert werden.
 *
 * Schriften: Die Markenschriften liegen als woff2 vor, librsvg kann die nicht
 * lesen. Sie werden deshalb hier nach OTF entpackt und für fontconfig
 * bereitgestellt. Am Ende prüft das Skript, dass tatsächlich Text im Bild
 * gelandet ist – ohne diese Prüfung würde ein fehlendes Schriftpaket lautlos
 * leere Kacheln erzeugen.
 */

import { mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { homedir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { decompress } from 'wawoff2';

const execFileP = promisify(execFile);

const WURZEL = path.resolve(import.meta.dirname, '..');
const ZIEL = path.join(WURZEL, 'public', 'og');
const BREITE = 1200;
const HOEHE = 630;

// ─────────────────────────── Schriften bereitstellen ───────────────────────────

async function schriftenVorbereiten() {
  const schriftOrdner = path.join(homedir(), '.fonts');
  await mkdir(schriftOrdner, { recursive: true });

  // Eine Familie, wie auf der Website. Die Vorschaubilder sind das, was in
  // sozialen Netzen und in Suchergebnissen von der Marke zu sehen ist – eine
  // Schrift, die dort nirgends sonst vorkommt, wäre ein sichtbarer Bruch.
  const paare = [
    ['@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', 'ku64-inter.otf'],
  ];

  for (const [quelle, ziel] of paare) {
    const q = path.join(WURZEL, 'node_modules', quelle);
    if (!existsSync(q)) throw new Error(`Schriftdatei fehlt: ${q}`);
    await writeFile(path.join(schriftOrdner, ziel), await decompress(await readFile(q)));
  }

  try {
    await execFileP('fc-cache', ['-f']);
  } catch {
    // fc-cache fehlt in manchen Images. Der Rendertest unten deckt auf,
    // ob die Schriften trotzdem gefunden werden.
  }
}

// ─────────────────────────── Bild bauen ───────────────────────────

/** XML-Escaping – Behandlungsnamen enthalten & und Anführungszeichen. */
const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Bricht Text auf mehrere Zeilen um. Grobe Schätzung über die Zeichenbreite –
 * genau genug, weil die Schriftgröße unten an die Länge angepasst wird.
 */
function umbrechen(text, maxZeichen, maxZeilen = 3) {
  const worte = String(text).split(' ');
  const zeilen = [];
  let aktuell = '';

  for (const wort of worte) {
    const versuch = aktuell ? `${aktuell} ${wort}` : wort;
    if (versuch.length > maxZeichen && aktuell) {
      zeilen.push(aktuell);
      aktuell = wort;
      if (zeilen.length === maxZeilen) break;
    } else {
      aktuell = versuch;
    }
  }
  if (aktuell && zeilen.length < maxZeilen) zeilen.push(aktuell);
  return zeilen;
}

/* Die Markenfarben, wie in tokens.css. Auf dunklem Grund trägt die 64 die
   hellere Fassung – genau wie das Logo über Bild und Video. */
const GELB = '#FFCC00';
const ROT_HELL = '#C2264A';

function svgBauen({ titel, unterzeile, fusszeile }) {
  const maxZeichen = titel.length > 40 ? 24 : 18;
  const zeilen = umbrechen(titel, maxZeichen, 3);
  const groesse = zeilen.length >= 3 ? 60 : zeilen.length === 2 ? 72 : 84;
  const startY = 318 - ((zeilen.length - 1) * groesse * 1.1) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${BREITE}" height="${HOEHE}">
  <defs>
    <!--
      Der Schleier ist keine Verzierung, sondern die Bedingung dafür, dass
      weiße Schrift auf einem beliebigen Foto lesbar bleibt. Links dicht,
      damit der Text trägt; rechts offen, damit der Raum sichtbar bleibt.
    -->
    <linearGradient id="schleier" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0d0a08" stop-opacity="0.94"/>
      <stop offset="52%" stop-color="#0d0a08" stop-opacity="0.78"/>
      <stop offset="100%" stop-color="#0d0a08" stop-opacity="0.30"/>
    </linearGradient>
    <linearGradient id="fuss" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0d0a08" stop-opacity="0"/>
      <stop offset="100%" stop-color="#0d0a08" stop-opacity="0.72"/>
    </linearGradient>
  </defs>

  <rect width="${BREITE}" height="${HOEHE}" fill="url(#schleier)"/>
  <rect x="0" y="${HOEHE - 190}" width="${BREITE}" height="190" fill="url(#fuss)"/>

  <!-- Markenband oben. Gelb, nicht Orange – siehe Kopfkommentar. -->
  <rect x="0" y="0" width="${BREITE}" height="10" fill="${GELB}"/>

  <text x="80" y="120" font-family="Inter" font-weight="800" font-size="42" letter-spacing="-1.8"><tspan fill="${GELB}">KU</tspan><tspan fill="${ROT_HELL}">64</tspan></text>
  <!-- 218, nicht 200: Bei 200 stieß „DIE" direkt an die 64 und die Wortmarke
       las sich als ein einziges Wort. -->
  <text x="218" y="120" font-family="Inter" font-weight="600" font-size="17" fill="#d8d2cb" letter-spacing="3.4">DIE ZAHNSPEZIALISTEN</text>

  ${zeilen
    .map(
      (z, i) =>
        `<text x="80" y="${startY + i * groesse * 1.1}" font-family="Inter" font-weight="700" font-size="${groesse}" fill="#ffffff" letter-spacing="${(groesse * -0.03).toFixed(1)}">${esc(z)}</text>`,
    )
    .join('\n  ')}

  ${
    unterzeile
      ? `<text x="80" y="${startY + zeilen.length * groesse * 1.1 + 26}" font-family="Inter" font-weight="500" font-size="30" fill="#e8e2da">${esc(unterzeile)}</text>`
      : ''
  }

  <rect x="80" y="538" width="52" height="4" fill="${GELB}"/>
  ${fusszeile ? `<text x="80" y="582" font-family="Inter" font-size="23" fill="#cdc6be">${esc(fusszeile)}</text>` : ''}
</svg>`;
}

/*
 * Jedes Foto wird EINMAL auf Kartenformat gebracht und abgedunkelt, nicht
 * einmal je Bild. Bei 153 Karten aus einer Handvoll Motiven ist das der
 * Unterschied zwischen zehn Sekunden und zwei Minuten Bauzeit.
 */
const grundlagen = new Map();

function grundlage(fotoName) {
  if (!grundlagen.has(fotoName)) {
    const quelle = path.join(WURZEL, 'public', 'medien', `${fotoName}.jpg`);
    if (!existsSync(quelle)) throw new Error(`Foto für Vorschaubild fehlt: ${quelle}`);
    grundlagen.set(
      fotoName,
      sharp(quelle)
        .resize(BREITE, HOEHE, { fit: 'cover', position: 'centre' })
        .modulate({ brightness: 0.86 })
        .toBuffer(),
    );
  }
  return grundlagen.get(fotoName);
}

async function bildSchreiben(datei, daten) {
  /*
   * JPEG statt PNG. Ein Foto als PNG wiegt gut ein halbes Megabyte; bei 153
   * Karten wären das über 70 MB im Auslieferungsordner. Bei 84 Prozent
   * Qualität sind es rund 90 kB, und ein Unterschied ist auf einer Karte,
   * die im Chat 500 Pixel breit steht, nicht zu sehen.
   */
  const puffer = await sharp(await grundlage(daten.foto))
    .composite([{ input: Buffer.from(svgBauen(daten)) }])
    .jpeg({ quality: 84, progressive: true, mozjpeg: true })
    .toBuffer();

  await writeFile(path.join(ZIEL, datei), puffer);
  return puffer;
}

// ─────────────────────────── Ablauf ───────────────────────────

async function main() {
  await schriftenVorbereiten();
  await rm(ZIEL, { recursive: true, force: true });
  await mkdir(ZIEL, { recursive: true });

  // Datenquellen sind dieselben Dateien, aus denen die Seiten entstehen.
  const { STANDORTE } = await import('../src/data/standorte.ts');
  const { LEISTUNGEN } = await import('../src/data/leistungen.ts');

  let anzahl = 0;
  let pruefPuffer = null;

  /*
   * Welches Foto zu welchem Standort gehört.
   *
   * Für drei Standorte gibt es das Kopfvideo und damit ein Standbild aus
   * den eigenen Räumen. Wilmersdorf hat bisher nur die Außenansicht – das
   * ist ehrlicher als ein fremder Innenraum, und sobald die Praxis die
   * fehlenden Fotos liefert (siehe BILDER-BEDARF.md), steht hier ein Raum.
   */
  const FOTO_JE_STANDORT = {
    'berlin-charlottenburg': 'kopf-berlin-charlottenburg',
    berlinmitte: 'kopf-berlinmitte',
    potsdam: 'kopf-potsdam',
    wilmersdorf: 'wilmersdorf-aussenansicht',
  };

  /* Die gelbe Höhle am Kurfürstendamm steht für die Marke, nicht für eine
     Adresse – dasselbe Bild wie im Kopf der Startseite. */
  const FOTO_STANDARD = 'kopf-berlin-charlottenburg';

  // Standardbild für alle Seiten ohne eigenes Motiv
  pruefPuffer = await bildSchreiben('ku64-standard.jpg', {
    titel: 'Zahnmedizin in Berlin und Potsdam',
    unterzeile: `${STANDORTE.length} Standorte · ${LEISTUNGEN.length} Behandlungen`,
    fusszeile: 'ku64.de',
    foto: FOTO_STANDARD,
  });
  anzahl++;

  /*
   * Die Karte für den Stand-und-Vergleich-Bericht.
   *
   * Der Bericht ist kein Teil der Website, bekommt aber dieselbe Karte –
   * er wird als Datei und als Link weitergereicht, und ohne Vorschaubild
   * baut die Gegenstelle sich selbst eines: meist ein dunkler Schnappschuss
   * der Seite. Für ein Dokument, das eine Erstvorstellung eröffnet, ist der
   * erste Eindruck genau dieses Bild.
   *
   * Dasselbe Motiv wie die Startseite, weil der Bericht über diese Website
   * spricht und nicht über einen einzelnen Standort.
   */
  await bildSchreiben('bericht.jpg', {
    titel: 'Stand, Vergleich und Prognose',
    unterzeile: 'Der Neubau, gemessen gegen ku64.de',
    fusszeile: 'product-republic · Juli 2026',
    foto: FOTO_STANDARD,
  });
  anzahl++;

  for (const s of STANDORTE) {
    const foto = FOTO_JE_STANDORT[s.slug] ?? FOTO_STANDARD;

    await bildSchreiben(`standort-${s.slug}.jpg`, {
      // `ortsname` statt Ort und Bezirk zusammenzusetzen: Die Regel ergibt in
      // Berlin "Berlin-Charlottenburg", in Potsdam aber
      // "Potsdam-Berliner Vorstadt". Auf den Seiten war das längst behoben,
      // hier nicht – und das Vorschaubild ist genau das, was beim Teilen und
      // in den Suchergebnissen zu sehen ist.
      titel: `Ihr Zahnarzt in ${s.ortsname}`,
      unterzeile: `KU64 ${s.name}`,
      fusszeile: `${s.strasse}, ${s.plz} ${s.ort} · ${s.telefon}`,
      foto,
    });
    anzahl++;

    // Ein Bild je Behandlung an diesem Standort – der Ortsbezug ist genau
    // das, was beim Teilen sichtbar werden soll.
    for (const l of LEISTUNGEN) {
      if (!l.verfuegbar.includes(s.slug)) continue;
      await bildSchreiben(`${s.slug}--${l.slug}.jpg`, {
        titel: l.name,
        unterzeile: `bei KU64 ${s.name}`,
        fusszeile: `${s.strasse}, ${s.plz} ${s.ort} · ${s.telefon}`,
        foto,
      });
      anzahl++;
    }
  }

  // Standortübergreifende Leistungsseiten
  for (const l of LEISTUNGEN) {
    const orte = l.verfuegbar
      .map((slug) => STANDORTE.find((s) => s.slug === slug)?.name)
      .filter(Boolean);
    await bildSchreiben(`leistung-${l.slug}.jpg`, {
      titel: l.name,
      unterzeile: 'KU64 – Die Zahnspezialisten',
      fusszeile: orte.length ? `Verfügbar an: ${orte.join(', ')}` : 'Bitte sprechen Sie uns an',
      foto: FOTO_STANDARD,
    });
    anzahl++;
  }

  /*
   * Prüfung: Ist überhaupt Text im Bild gelandet?
   *
   * Vorher wurde die Varianz der fertigen Kachel gemessen. Das ging, solange
   * der Untergrund ein glatter Verlauf war – fehlten die Schriften, war die
   * Kachel fast einfarbig und fiel auf.
   *
   * Mit einem Foto darunter ist die Varianz IMMER hoch. Dieselbe Prüfung
   * hätte ab sofort jede leere Kachel durchgewinkt und dabei weiterhin
   * „in Ordnung" gemeldet. Gemessen wird deshalb die Textebene allein, auf
   * flachem Grund: Ohne Schriften bleibt sie leer, mit Schriften nicht.
   */
  const nurText = await sharp(
    Buffer.from(
      svgBauen({
        titel: 'Zahnmedizin in Berlin und Potsdam',
        unterzeile: 'Prüfzeile',
        fusszeile: 'ku64.de',
      }),
    ),
  )
    .flatten({ background: '#0d0a08' })
    .extract({ left: 60, top: 180, width: 1080, height: 260 })
    .stats();

  const varianz = nurText.channels.reduce((summe, k) => summe + k.stdev, 0);

  if (varianz < 20) {
    throw new Error(
      `Die Textebene der OG-Bilder ist leer (Varianz ${varianz.toFixed(1)}). ` +
        'Vermutlich fehlen fontconfig oder die Schriftdateien im Build-Image.',
    );
  }

  /* Damit der Wert nicht nur dasteht: Das fertige Bild darf nicht größer
     sein als das, was Messenger und Netzwerke noch laden. */
  const kb = Math.round(pruefPuffer.length / 1024);
  if (kb > 400) throw new Error(`Vorschaubild zu schwer: ${kb} kB`);

  console.log(
    `[og] ${anzahl} Vorschaubilder erzeugt (Textvarianz ${varianz.toFixed(1)}, Standardkarte ${kb} kB)`,
  );
}

main().catch((e) => {
  console.error('[og] Fehlgeschlagen:', e.message);
  process.exit(1);
});
