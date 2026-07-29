/**
 * Setzt STAND-UND-VERGLEICH.md als eigenständige HTML-Seite zum Weitergeben.
 *
 * ── Warum eine eigene Seite und nicht die Markdown-Datei ────────────────
 *
 * Das Dokument geht an drei Leserkreise: Praxisinhaber, kaufmännische
 * Leitung und Agentur. Zwei davon lesen keine Markdown-Dateien. Es braucht
 * eine Adresse, die man schickt, und eine Seite, die auf dem Telefon
 * genauso liest wie auf dem Schirm.
 *
 * ── Gestaltung ─────────────────────────────────────────────────────────
 *
 * Die Farben sind die der Praxis, aus `src/styles/tokens.css` übernommen –
 * einschließlich der beiden Korrekturen, die der Kontrastprüfung zu
 * verdanken sind (`--tinte-leise` auf 5,06:1 statt 4,45:1). Ein Bericht über
 * die Website sollte nicht in fremden Farben erscheinen.
 *
 * Eine Schriftfamilie für alles, wie auf der Website selbst. Die Hierarchie
 * trägt über Gewicht, Größe und Laufweite. Zahlen stehen mit
 * `tabular-nums`, weil dieses Dokument fast nur aus Tabellen besteht und
 * Ziffern, die nicht untereinander stehen, sich nicht vergleichen lassen.
 *
 * Gelb trägt auch hier keine Fläche, sondern markiert – dieselbe Regel wie
 * auf der Website (siehe `tokens.css`).
 *
 * Die Schrift wird als data-URI eingebettet: Die Artifact-CSP blockiert
 * fremde Hosts, ein verlinkter Webfont fiele still auf eine Systemschrift
 * zurück.
 *
 * Aufruf:  node bericht/vergleich-bauen.mjs
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const WURZEL = path.resolve(import.meta.dirname, '..');

const schrift = `data:font/woff2;base64,${(
  await readFile(
    path.join(WURZEL, 'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'),
  )
).toString('base64')}`;

/* ── Markdown → HTML ─────────────────────────────────────────────────── */

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Auszeichnung innerhalb einer Zeile. Reihenfolge zählt: Code zuerst. */
function inline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*]+)\*/g, '$1<em>$2</em>');
}

/**
 * Eine Tabellenzelle, die nur aus einer Zahl besteht, wird rechtsbündig –
 * sonst stehen „0" und „170.785" linksbündig nebeneinander und lassen sich
 * nicht vergleichen.
 */
const istZahl = (z) => /^\*{0,2}[−–-]?[\d.,]+\s*(%|kB|ms|s)?\*{0,2}$/.test(z.trim());

function tabelle(zeilen) {
  const zellen = (z) =>
    z
      .trim()
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((c) => c.trim());

  const kopf = zellen(zeilen[0]);
  const koerper = zeilen.slice(2).map(zellen);

  const rechts = kopf.map((_, i) =>
    koerper.length > 0 && koerper.every((r) => !r[i] || istZahl(r[i])),
  );

  const th = kopf
    .map((c, i) => `<th${rechts[i] ? ' class="zahl"' : ''}>${inline(c)}</th>`)
    .join('');
  const tr = koerper
    .map(
      (r) =>
        '<tr>' +
        r.map((c, i) => `<td${rechts[i] ? ' class="zahl"' : ''}>${inline(c)}</td>`).join('') +
        '</tr>',
    )
    .join('\n');

  return `<div class="tabelle"><table><thead><tr>${th}</tr></thead><tbody>\n${tr}\n</tbody></table></div>`;
}

function umwandeln(md) {
  const zeilen = md.split('\n');
  const aus = [];
  const gliederung = [];
  let i = 0;

  const absatz = [];
  const absatzSchliessen = () => {
    if (absatz.length) {
      aus.push(`<p>${inline(absatz.join(' '))}</p>`);
      absatz.length = 0;
    }
  };

  while (i < zeilen.length) {
    const z = zeilen[i];

    if (z.startsWith('```')) {
      absatzSchliessen();
      const block = [];
      i++;
      while (i < zeilen.length && !zeilen[i].startsWith('```')) block.push(zeilen[i++]);
      i++;
      aus.push(`<pre><code>${esc(block.join('\n'))}</code></pre>`);
      continue;
    }

    if (/^\|/.test(z)) {
      absatzSchliessen();
      const block = [];
      while (i < zeilen.length && /^\|/.test(zeilen[i])) block.push(zeilen[i++]);
      aus.push(tabelle(block));
      continue;
    }

    if (/^(\s*)([-*]|\d+\.)\s+/.test(z)) {
      absatzSchliessen();
      const geordnet = /^\s*\d+\./.test(z);
      const punkte = [];
      while (i < zeilen.length && (/^(\s*)([-*]|\d+\.)\s+/.test(zeilen[i]) || /^\s{2,}\S/.test(zeilen[i]))) {
        if (/^(\s*)([-*]|\d+\.)\s+/.test(zeilen[i])) {
          punkte.push(zeilen[i].replace(/^(\s*)([-*]|\d+\.)\s+/, ''));
        } else {
          punkte[punkte.length - 1] += ' ' + zeilen[i].trim();
        }
        i++;
      }
      const tag = geordnet ? 'ol' : 'ul';
      aus.push(`<${tag}>${punkte.map((p) => `<li>${inline(p)}</li>`).join('')}</${tag}>`);
      continue;
    }

    const ueber = /^(#{1,3})\s+(.*)$/.exec(z);
    if (ueber) {
      absatzSchliessen();
      const stufe = ueber[1].length;
      const text = ueber[2];
      const id = text
        .toLowerCase()
        .replace(/[^\wäöüß\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      if (stufe === 2) gliederung.push({ id, text });
      aus.push(`<h${stufe} id="${id}">${inline(text)}</h${stufe}>`);
      i++;
      continue;
    }

    if (/^---\s*$/.test(z)) {
      absatzSchliessen();
      aus.push('<hr />');
      i++;
      continue;
    }

    if (/^\*.*\*$/.test(z.trim()) && z.trim().length > 40) {
      absatzSchliessen();
      aus.push(`<p class="nachsatz">${inline(z.trim().replace(/^\*|\*$/g, ''))}</p>`);
      i++;
      continue;
    }

    if (z.trim() === '') {
      absatzSchliessen();
      i++;
      continue;
    }

    absatz.push(z.trim());
    i++;
  }
  absatzSchliessen();

  return { html: aus.join('\n'), gliederung };
}

/* ── Seite bauen ─────────────────────────────────────────────────────── */

const md = await readFile(path.join(WURZEL, 'STAND-UND-VERGLEICH.md'), 'utf8');
const { html, gliederung } = umwandeln(md);

const rail = gliederung
  .map((g) => `<li><a href="#${g.id}">${esc(g.text)}</a></li>`)
  .join('\n');

const seite = `<title>KU64 – Stand, Vergleich und Prognose</title>
<style>
  @font-face {
    font-family: 'Inter Bericht';
    src: url('${schrift}') format('woff2-variations');
    font-weight: 100 900;
    font-display: block;
  }

  /*
   * Die Farben der Praxis, aus src/styles/tokens.css. Der leise Ton steht
   * auf dem korrigierten Wert – 5,06:1 statt 4,45:1.
   */
  :root {
    --grund: #fbfaf7;
    --flaeche: #ffffff;
    --tinte: #1d1d1b;
    --tinte-weich: #4a4a46;
    --tinte-leise: #6f6f67;
    --linie: #e6e4de;
    --akzent: #b71e3f;
    --gelb: #ffcc00;
    --gut: #1f7a52;
    --schlecht: #b71e3f;
    --offen: #9a6b12;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --grund: #141412;
      --flaeche: #1b1b18;
      --tinte: #f2f1ee;
      --tinte-weich: #c0bfb8;
      --tinte-leise: #9b9a91;
      --linie: #2b2b28;
      --akzent: #e0788f;
      --gut: #3fa87a;
      --schlecht: #e0788f;
      --offen: #d3a441;
    }
  }

  :root[data-theme='dark'] {
    --grund: #141412;
    --flaeche: #1b1b18;
    --tinte: #f2f1ee;
    --tinte-weich: #c0bfb8;
    --tinte-leise: #9b9a91;
    --linie: #2b2b28;
    --akzent: #e0788f;
    --gut: #3fa87a;
    --schlecht: #e0788f;
    --offen: #d3a441;
  }

  :root[data-theme='light'] {
    --grund: #fbfaf7;
    --flaeche: #ffffff;
    --tinte: #1d1d1b;
    --tinte-weich: #4a4a46;
    --tinte-leise: #6f6f67;
    --linie: #e6e4de;
    --akzent: #b71e3f;
    --gut: #1f7a52;
    --schlecht: #b71e3f;
    --offen: #9a6b12;
  }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    background: var(--grund);
    color: var(--tinte);
    font-family: 'Inter Bericht', system-ui, sans-serif;
    font-size: 17px;
    line-height: 1.65;
    font-variant-numeric: tabular-nums;
    -webkit-font-smoothing: antialiased;
  }

  .seite {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
    max-width: 1180px;
    margin-inline: auto;
    padding: 0 1.25rem 6rem;
  }

  @media (min-width: 62rem) {
    .seite {
      grid-template-columns: 15rem minmax(0, 1fr);
      gap: 3.5rem;
      padding-inline: 2rem;
    }
  }

  /* ── Inhaltsverzeichnis ──────────────────────────────────────────── */

  .rail { display: none; }

  @media (min-width: 62rem) {
    .rail {
      display: block;
      position: sticky;
      top: 0;
      align-self: start;
      max-height: 100vh;
      overflow-y: auto;
      padding-block: 3.5rem 2rem;
    }
    .rail p {
      margin: 0 0 0.9rem;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--tinte-leise);
    }
    .rail ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.4rem; }
    .rail a {
      display: block;
      font-size: 0.83rem;
      line-height: 1.35;
      color: var(--tinte-weich);
      text-decoration: none;
      padding: 0.2rem 0 0.2rem 0.7rem;
      border-left: 2px solid var(--linie);
    }
    .rail a:hover { color: var(--tinte); border-left-color: var(--gelb); }
  }

  /* ── Fließtext ───────────────────────────────────────────────────── */

  main { padding-block: 3rem; min-width: 0; }

  h1 {
    font-size: clamp(2rem, 5vw, 3.1rem);
    line-height: 1.05;
    letter-spacing: -0.03em;
    font-weight: 800;
    margin: 0 0 1.5rem;
    text-wrap: balance;
  }

  h2 {
    font-size: clamp(1.4rem, 2.6vw, 1.9rem);
    line-height: 1.15;
    letter-spacing: -0.02em;
    font-weight: 750;
    margin: 4rem 0 1rem;
    padding-top: 1.6rem;
    border-top: 1px solid var(--linie);
    text-wrap: balance;
  }

  /* Der gelbe Strich markiert den Kapitelanfang – er trägt keine Fläche,
     dieselbe Regel wie auf der Website. */
  h2::before {
    content: '';
    display: block;
    width: 34px;
    height: 3px;
    background: var(--gelb);
    margin-bottom: 1.1rem;
  }

  h3 {
    font-size: 1.08rem;
    font-weight: 700;
    letter-spacing: -0.005em;
    margin: 2.4rem 0 0.7rem;
  }

  p { margin: 0 0 1.05rem; max-width: 68ch; }
  strong { font-weight: 680; }

  ul, ol { max-width: 68ch; margin: 0 0 1.2rem; padding-left: 1.3rem; }
  li { margin-bottom: 0.45rem; }
  li::marker { color: var(--tinte-leise); }

  a { color: var(--akzent); text-underline-offset: 2px; }

  code {
    font-family: ui-monospace, 'SF Mono', Menlo, monospace;
    font-size: 0.86em;
    background: color-mix(in oklab, var(--tinte) 7%, transparent);
    padding: 0.1em 0.35em;
    border-radius: 4px;
  }

  pre {
    background: var(--flaeche);
    border: 1px solid var(--linie);
    border-radius: 10px;
    padding: 1rem 1.1rem;
    overflow-x: auto;
    font-size: 0.82rem;
    line-height: 1.55;
  }
  pre code { background: none; padding: 0; font-size: inherit; }

  hr { border: 0; height: 0; margin: 2.5rem 0; }

  .nachsatz {
    color: var(--tinte-leise);
    font-size: 0.9rem;
    border-top: 1px solid var(--linie);
    padding-top: 1.2rem;
    margin-top: 3rem;
  }

  /* ── Tabellen ────────────────────────────────────────────────────── */

  .tabelle {
    overflow-x: auto;
    margin: 0 0 1.6rem;
    border: 1px solid var(--linie);
    border-radius: 10px;
    background: var(--flaeche);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;
  }

  th, td {
    text-align: left;
    padding: 0.6rem 0.9rem;
    border-bottom: 1px solid var(--linie);
    vertical-align: top;
  }

  th {
    font-weight: 700;
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--tinte-leise);
    white-space: nowrap;
  }

  td.zahl, th.zahl { text-align: right; white-space: nowrap; }
  tbody tr:last-child td { border-bottom: 0; }
  tbody tr:hover { background: color-mix(in oklab, var(--tinte) 3%, transparent); }

  :focus-visible {
    outline: 2px solid var(--tinte);
    outline-offset: 3px;
    border-radius: 3px;
  }

  @media print {
    .rail { display: none; }
    body { font-size: 10.5pt; }
    h2 { break-after: avoid; }
    .tabelle { break-inside: avoid; }
  }
</style>

<div class="seite">
  <nav class="rail" aria-label="Inhalt">
    <p>Inhalt</p>
    <ul>
${rail}
    </ul>
  </nav>
  <main>
${html}
  </main>
</div>
`;

const ziel = path.join(import.meta.dirname, 'stand-und-vergleich.html');
await writeFile(ziel, seite);
console.log(`[bericht] ${gliederung.length} Kapitel gesetzt → ${path.relative(WURZEL, ziel)}`);
