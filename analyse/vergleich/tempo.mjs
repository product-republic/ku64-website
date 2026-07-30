/**
 * Ladeverhalten beider Fassungen im echten Browser, unter denselben
 * Bedingungen.
 *
 * Gemessen wird, was ein Mensch merkt und was Google als Rankingfaktor
 * verwendet (Core Web Vitals):
 *
 *   LCP  Largest Contentful Paint – wann das größte Element steht
 *   CLS  Cumulative Layout Shift – wie stark der Inhalt beim Laden springt
 *   Übertragene Bytes und Anzahl der Anfragen
 *   Wie viel davon von fremden Servern kommt
 *
 * Beide Fassungen werden mit gedrosselter Verbindung geladen (4× langsamere
 * CPU, mobiles Netz), weil der Unterschied auf einem schnellen Rechner im
 * Büro nicht sichtbar wird – und die Praxis ihre Besucher überwiegend auf
 * dem Telefon hat.
 *
 * Aufruf:  node analyse/vergleich/tempo.mjs [basis-neu]
 */

import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const NEU = process.argv[2] || 'http://127.0.0.1:4343';

/*
 * `NUR_NEU=1` misst nur die neue Fassung.
 *
 * Wofür: Die alte Fassung liegt auf ku64.de, und wer ohne Zugang nach außen
 * messen will, wartet sonst fünfmal auf einen Verbindungsabbruch. Der
 * Schalter stand hier und wurde nirgends gelesen – gemessen wurde also immer
 * beides, egal was gesetzt war.
 */
const NUR_NEU = process.env.NUR_NEU === '1';

/* Vergleichbare Seiten, nicht beliebige: dieselbe Aufgabe in beiden
   Fassungen. Die neue Adresse ist jeweils das Weiterleitungsziel der alten. */
const PAARE = [
  ['Startseite', 'https://ku64.de/', '/'],
  ['Standort Potsdam', 'https://ku64.de/potsdam/', '/potsdam/'],
  ['Eine Behandlung', 'https://ku64.de/leistungen/zahnimplantate/', '/berlin-charlottenburg/leistungen/zahnimplantate/'],
  ['Team', 'https://ku64.de/team/', '/ueber-uns/team/'],
  ['Blogübersicht', 'https://ku64.de/blog/', '/blog/'],
];

/* Läuft die Erhebung hinter einem Proxy, muss der Browser ihn kennen –
   sonst bricht jede Verbindung nach außen ab, und die Messung liefert für
   beide Seiten „–". */
const PROXY = process.env.HTTPS_PROXY || process.env.https_proxy;

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PFAD || '/opt/pw-browsers/chromium',
  args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
  ...(PROXY ? { proxy: { server: PROXY } } : {}),
});

async function messen(adresse) {
  const kontext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    ignoreHTTPSErrors: false,
    userAgent:
      'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150 Mobile Safari/537.36',
  });
  const seite = await kontext.newPage();

  /* Drosselung wie ein durchschnittliches Mobilnetz. */
  const cdp = await kontext.newCDPSession(seite);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  let bytes = 0;
  let anfragen = 0;
  let fremdBytes = 0;
  let fremdAnfragen = 0;
  const host = new URL(adresse).host;

  seite.on('response', async (r) => {
    anfragen++;
    const laenge = Number(r.headers()['content-length'] || 0);
    bytes += laenge;
    if (new URL(r.url()).host !== host) {
      fremdAnfragen++;
      fremdBytes += laenge;
    }
  });

  /*
   * LCP und Layoutsprünge müssen VOR dem Laden beobachtet werden.
   *
   * `performance.getEntriesByType('largest-contentful-paint')` nach dem Laden
   * abzufragen ergibt eine leere Liste – diese Einträge werden nicht in der
   * Zeitleiste aufbewahrt. Ein erster Anlauf dieser Messung lieferte deshalb
   * für beide Fassungen „–", und ein Vergleich ohne Zahlen ist keiner.
   */
  await seite.addInitScript(() => {
    window.__lcp = 0;
    window.__cls = 0;
    new PerformanceObserver((liste) => {
      for (const e of liste.getEntries()) window.__lcp = e.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((liste) => {
      for (const e of liste.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type: 'layout-shift', buffered: true });
  });

  const beginn = Date.now();
  let status = 0;
  try {
    const antwort = await seite.goto(adresse, { waitUntil: 'load', timeout: 60000 });
    status = antwort?.status() ?? 0;
  } catch (e) {
    await kontext.close();
    return { fehler: String(e.message).slice(0, 80) };
  }

  /* Kurz warten, damit später nachgeladene Bilder und Skripte mitzählen –
     sonst misst man die halbe Seite. */
  await seite.waitForTimeout(3500);

  const werte = await seite.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null;

    return {
      lcp: window.__lcp || null,
      fcp,
      ttfb: nav ? Math.round(nav.responseStart) : null,
      cls: Math.round((window.__cls || 0) * 1000) / 1000,
      domFertig: nav ? nav.domContentLoadedEventEnd : null,
      geladen: nav ? nav.loadEventEnd : null,
      knoten: document.querySelectorAll('*').length,
      uebertragen: performance
        .getEntriesByType('resource')
        .reduce((s, r) => s + (r.transferSize || 0), 0),
    };
  });

  await kontext.close();

  return {
    status,
    gesamtMs: Date.now() - beginn,
    ...werte,
    anfragen,
    fremdAnfragen,
    kopfBytes: bytes,
    fremdBytes,
  };
}

const ergebnisse = [];

for (const [name, alt, neuPfad] of PAARE) {
  process.stdout.write(`${name} … `);
  const a = NUR_NEU ? null : await messen(alt);
  const n = await messen(NEU + neuPfad);
  ergebnisse.push({ name, alt: a, neu: n });
  const z = (w) => (w?.lcp ? `${Math.round(w.lcp)} ms` : '–');
  console.log(`alt ${z(a)}  →  neu ${z(n)}`);
}

await browser.close();

await writeFile(
  path.join(import.meta.dirname, 'tempo.json'),
  JSON.stringify({ erhobenAm: new Date().toISOString(), ergebnisse }, null, 1),
);

console.log('\n→ analyse/vergleich/tempo.json');
