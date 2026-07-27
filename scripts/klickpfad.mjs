/**
 * Klickpfad – prüft, ob die Seite nach dem zweiten Klick noch funktioniert.
 *
 * ── Warum es dieses Skript gibt ─────────────────────────────────────────
 *
 * Die Website wechselt Seiten im Browser: Statt neu zu laden, holt sie die
 * neue Seite und tauscht den Körper aus. Das macht den Wechsel weich – und
 * es macht eine ganze Fehlerklasse möglich, die kein anderer Prüfschritt
 * sieht.
 *
 * Ein Modul wird pro Adresse genau einmal ausgewertet. Wer beim Start einen
 * Zuhörer an einen Knopf hängt, hängt ihn an das Exemplar, das gerade in der
 * Seite steht. Nach dem ersten Wechsel ist das ein anderes Element, und der
 * Knopf tut nichts mehr. Das gebaute HTML ist dabei fehlerfrei, alle
 * Adressen antworten mit 200, in der Konsole steht nichts.
 *
 * Gemeldet wurde es von der Praxis in einem Satz: „funktioniert ein Mal,
 * danach hängt es sich auf." Betroffen waren das mobile Menü, der Berater,
 * die Suche, der Teamfilter, das wandernde Feld im Menü – alles, was man
 * anklickt.
 *
 * ── Was hier geprüft wird ───────────────────────────────────────────────
 *
 * Nicht, ob etwas beim ersten Laden geht. Das ging immer. Geprüft wird der
 * zweite und dritte Klick: Jede Prüfung läuft NACH mindestens einem
 * Seitenwechsel, und die wichtigsten laufen zusätzlich, nachdem man eine
 * Seite verlassen hat und zurückgekommen ist – der Fall, in dem selbst ein
 * beim Wechsel erstmals geladenes Modul nicht mehr anläuft.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   npm run build && npm start &
 *   npm run klickpfad
 *
 * Andere Adresse: KLICKPFAD_BASIS=http://… npm run klickpfad
 */

import { chromium } from 'playwright';

const BASIS = process.env.KLICKPFAD_BASIS || 'http://127.0.0.1:4331';

const befunde = [];
let geprueft = 0;

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PFAD || '/opt/pw-browsers/chromium',
  args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});

/**
 * Eine Prüfung. `fn` gibt true zurück, wenn alles stimmt – oder eine
 * Zeichenkette, die den Befund beschreibt.
 */
async function pruefe(name, fn) {
  geprueft++;
  let ergebnis;
  try {
    ergebnis = await fn();
  } catch (e) {
    ergebnis = e.message.split('\n')[0];
  }
  if (ergebnis === true) {
    console.log(`  ok      ${name}`);
  } else {
    console.log(`  BEFUND  ${name}${typeof ergebnis === 'string' ? ` – ${ergebnis}` : ''}`);
    befunde.push(name);
  }
}

/**
 * Weiterklicken wie eine Besucherin – über einen echten Link, damit der
 * Seitenwechsel im Browser stattfindet und nicht als Neuladen.
 *
 * Ein `page.goto` würde hier nichts prüfen: Es lädt das Dokument neu, und
 * dann laufen auch alle Module wieder. Genau das ist der Unterschied
 * zwischen dem Fall, der immer ging, und dem, der kaputt war.
 */
async function weiter(seite, pfad) {
  await seite.evaluate((p) => {
    const a = document.createElement('a');
    a.href = p;
    a.textContent = 'weiter';
    a.style.position = 'fixed';
    a.style.inset = '0 auto auto 0';
    a.dataset.klickpfad = '';
    document.body.append(a);
    a.click();
    a.remove();
  }, pfad);
  await seite.waitForTimeout(1100);
  return new URL(seite.url()).pathname;
}

// ── Der breite Durchgang ────────────────────────────────────────────────

const seite = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const seitenfehler = [];
seite.on('pageerror', (e) => seitenfehler.push(e.message.split('\n')[0]));

await seite.goto(`${BASIS}/potsdam/`, { waitUntil: 'networkidle' });

console.log('\n[klickpfad] Nach dem ersten Seitenwechsel');
await weiter(seite, '/potsdam/team/');

await pruefe('Berater öffnet', async () => {
  await seite.locator('.berater .ruf').click();
  await seite.waitForTimeout(300);
  return (await seite.locator('.berater .fenster').isVisible()) || 'Fenster bleibt zu';
});

await pruefe('Teamfilter reagiert', async () => {
  const chip = seite.locator('.filter .chips[data-feld="bereich"] .chip').nth(1);
  if (!(await chip.count())) return 'kein Filter auf der Seite';
  await chip.click();
  await seite.waitForTimeout(300);
  return (await chip.getAttribute('aria-pressed')) === 'true' || 'Chip bleibt ungedrückt';
});

await pruefe('wanderndes Feld im Menü folgt dem Zeiger', async () => {
  const link = seite.locator('.haupt-link').nth(1);
  await link.hover();
  await seite.waitForTimeout(400);
  return (
    (await seite.locator('.haupt-laeufer').evaluate((e) => e.hasAttribute('data-sichtbar'))) ||
    'Feld bleibt unsichtbar'
  );
});

console.log('\n[klickpfad] Nach dem Verlassen und Zurückkommen');
await weiter(seite, '/potsdam/leistungen/');
await weiter(seite, '/potsdam/team/');

await pruefe('Teamfilter reagiert auch beim zweiten Besuch', async () => {
  const chip = seite.locator('.filter .chips[data-feld="bereich"] .chip').nth(1);
  if (!(await chip.count())) return 'kein Filter auf der Seite';
  await chip.click();
  await seite.waitForTimeout(300);
  return (await chip.getAttribute('aria-pressed')) === 'true' || 'Chip bleibt ungedrückt';
});

await pruefe('Berater öffnet auch beim zweiten Besuch', async () => {
  await seite.locator('.berater .ruf').click();
  await seite.waitForTimeout(300);
  return (await seite.locator('.berater .fenster').isVisible()) || 'Fenster bleibt zu';
});

await pruefe('gemerkter Standort folgt dem Wechsel', async () => {
  await weiter(seite, '/berlinmitte/');
  const gemerkt = await seite.evaluate(() => localStorage.getItem('ku64:standort'));
  return gemerkt === 'berlinmitte' || `gemerkt ist "${gemerkt}"`;
});

console.log('\n[klickpfad] Suche');
await weiter(seite, '/suche/');
await pruefe('Suchfeld liefert Treffer', async () => {
  const feld = seite.locator('#suchfeld');
  if (!(await feld.count())) return 'kein Suchfeld';
  await feld.fill('Implantat');
  await seite.waitForTimeout(1200);
  const treffer = await seite.locator('#liste li').count();
  return treffer > 0 || 'keine Treffer';
});

await pruefe('Suche auf Englisch liefert englische Treffer', async () => {
  await weiter(seite, '/en/suche/');
  const feld = seite.locator('#suchfeld');
  if (!(await feld.count())) return 'kein Suchfeld';
  await feld.fill('cleaning');
  await seite.waitForTimeout(1400);
  const titel = await seite.locator('#liste .tr-titel').first().textContent();
  if (!titel) return 'keine Treffer';
  /*
   * Geprüft wird gegen deutsche Umlaute und typische Endungen, nicht gegen
   * eine Wortliste: Die Titel ändern sich, die Sprache nicht. Vorher stand
   * hier „Professionelle Zahnreinigung" – die Seite darunter war übersetzt,
   * der Treffer, der zu ihr führte, nicht.
   */
  return /[äöüß]|ungen?\b|Zahn/i.test(titel) ? `deutscher Titel: ${titel}` : true;
});

console.log('\n[klickpfad] Lesefortschritt im Blog');
await weiter(seite, '/blog/');
/* Nicht der erstbeste Blog-Link: Die Übersicht verweist auch auf sich selbst
   und auf ihre Filter. Gesucht ist ein Beitrag, also ein Pfad UNTER /blog/. */
const ersterBeitrag = await seite
  .locator('main a[href^="/blog/"]:not([href="/blog/"])')
  .first()
  .getAttribute('href');
if (ersterBeitrag) await weiter(seite, ersterBeitrag);
else befunde.push('kein Blogbeitrag verlinkt');

await pruefe('Lesefortschritt bewegt sich', async () => {
  if (!(await seite.locator('.lesefortschritt').count())) return 'keine Leiste';
  await seite.mouse.wheel(0, 2000);
  await seite.waitForTimeout(500);
  const anteil = await seite
    .locator('.lesefortschritt')
    .evaluate((e) => e.style.getPropertyValue('--anteil'));
  return Number(anteil) > 0 || `Anteil steht bei "${anteil}"`;
});

console.log('\n[klickpfad] Sprachwechsel');
await pruefe('Sprachwähler führt in alle drei Sprachen und zurück', async () => {
  const folge = [
    ['en', '/en/'],
    ['fr', '/fr/'],
    ['de', '/'],
  ];
  await weiter(seite, '/');
  for (const [code, erwartet] of folge) {
    await seite.locator(`.standortleiste-inner .sprachwahl a[data-sprache="${code}"]`).click();
    await seite.waitForTimeout(1000);
    const jetzt = new URL(seite.url()).pathname;
    if (jetzt !== erwartet) return `${code.toUpperCase()} führt nach ${jetzt}, nicht ${erwartet}`;
  }
  return true;
});

await seite.close();

// ── Der schmale Durchgang ───────────────────────────────────────────────

console.log('\n[klickpfad] Auf dem Telefon (390 px)');
const mobil = await browser.newPage({ viewport: { width: 390, height: 800 } });
mobil.on('pageerror', (e) => seitenfehler.push(e.message.split('\n')[0]));

await mobil.goto(`${BASIS}/potsdam/`, { waitUntil: 'networkidle' });
await weiter(mobil, '/potsdam/leistungen/');

await pruefe('mobiles Menü öffnet nach einem Seitenwechsel', async () => {
  await mobil.locator('.menue-knopf').click();
  await mobil.waitForTimeout(300);
  return (
    (await mobil.locator('#mobilmenue').evaluate((e) => !e.hidden)) || 'Menü bleibt verborgen'
  );
});

await pruefe('mobiler Sprachwähler wechselt die Sprache', async () => {
  const link = mobil.locator('.mobil-sprache .sprachwahl a[data-sprache="en"]');
  if (!(await link.count())) return 'kein Sprachwähler im Menü';
  await link.click();
  await mobil.waitForTimeout(1000);
  return (
    new URL(mobil.url()).pathname === '/en/potsdam/leistungen/' ||
    `gelandet auf ${new URL(mobil.url()).pathname}`
  );
});

await mobil.close();
await browser.close();

// ── Ergebnis ────────────────────────────────────────────────────────────

if (seitenfehler.length) {
  console.log(`\n[klickpfad] ${seitenfehler.length} Fehler aus dem Browser:`);
  for (const f of [...new Set(seitenfehler)].slice(0, 8)) console.log(`    · ${f}`);
  befunde.push('Fehler im Browser');
}

console.log(`\n[klickpfad] ${geprueft} Prüfungen, ${befunde.length} Befunde`);

if (befunde.length) {
  console.error(
    '\n[klickpfad] ABBRUCH: Etwas funktioniert nur bis zum ersten Seitenwechsel.\n' +
      '            Verdächtig ist ein Skript, das Elemente aus der Seite greift,\n' +
      '            ohne durch beimSeitenaufbau() zu laufen – siehe\n' +
      '            src/lib/seitenaufbau.ts.',
  );
  process.exit(1);
}

console.log('[klickpfad] In Ordnung.');
