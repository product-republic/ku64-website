/**
 * Prüft die Zustände der Oberfläche in einem echten Browser.
 *
 * Anlass: Das Chatfenster ließ sich nicht schließen. Ursache war, dass das
 * `hidden`-Attribut nur über das Browser-Stylesheet wirkt und von jeder
 * Autorenregel mit `display` geschlagen wird – `.fenster { display: flex }`
 * gewann gegen `[hidden]`. Solche Fehler sieht man im Code nicht, nur im
 * laufenden Browser.
 *
 * Deshalb prüft dieses Skript jedes Element, das per JavaScript ein- und
 * ausgeblendet wird, sowie zwei Zusagen, die nicht brechen dürfen:
 * kein Drittanbieter-iframe ohne Einwilligung, und der 404-Sonderfall für
 * Behandlungen, die es an einem Standort nicht gibt.
 *
 * Aufruf (Server muss laufen):
 *   node ./dist/server/entry.mjs &
 *   node scripts/oberflaeche-pruefen.mjs
 */
import { chromium } from 'playwright';

const BASIS = process.env.PRUEF_BASIS || 'http://127.0.0.1:4321';
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PFAD || '/opt/pw-browsers/chromium',
});
const seite = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const fehler = [];

const sichtbar = (sel) =>
  seite.evaluate((s) => {
    const e = document.querySelector(s);
    return e ? getComputedStyle(e).display !== 'none' : null;
  }, sel);

// ── Chatfenster ──
await seite.goto(`${BASIS}/potsdam/`, { waitUntil: 'networkidle' });
if (await sichtbar('.fenster')) fehler.push('Chatfenster ist beim Laden sichtbar');

await seite.click('.ruf');
await seite.waitForTimeout(250);
if (!(await sichtbar('.fenster'))) fehler.push('Chatfenster öffnet nicht');

await seite.click('.f-zu');
await seite.waitForTimeout(250);
if (await sichtbar('.fenster')) fehler.push('Chatfenster schließt nicht über das X');

await seite.click('.ruf');
await seite.waitForTimeout(200);
await seite.keyboard.press('Escape');
await seite.waitForTimeout(250);
if (await sichtbar('.fenster')) fehler.push('Chatfenster schließt nicht über Escape');

// ── Mobiles Menü ──
await seite.setViewportSize({ width: 480, height: 900 });
await seite.reload({ waitUntil: 'networkidle' });
if (await sichtbar('.mobilmenue')) fehler.push('Mobilmenü ist beim Laden sichtbar');

await seite.click('.menue-knopf');
await seite.waitForTimeout(250);
if (!(await sichtbar('.mobilmenue'))) fehler.push('Mobilmenü öffnet nicht');

await seite.click('.menue-knopf');
await seite.waitForTimeout(250);
if (await sichtbar('.mobilmenue')) fehler.push('Mobilmenü schließt nicht');

// ── Lächeln-Vorschau: Zustände, die anfangs verborgen sein müssen ──
await seite.setViewportSize({ width: 1280, height: 900 });
await seite.goto(`${BASIS}/laecheln-vorschau/`, { waitUntil: 'networkidle' });
for (const [sel, name] of [
  ['#laeuft', 'Ladeanzeige'],
  ['#fertig', 'Ergebnisbereich'],
  ['#fehlerbox', 'Fehlerbox'],
  ['#ablageWeg', 'Foto-entfernen-Knopf'],
  ['#vorschau', 'Fotovorschau'],
]) {
  if (await sichtbar(sel)) fehler.push(`${name} sichtbar, obwohl verborgen`);
}

// ── Startseite: Vorschlag "zuletzt gewählt" ──
//
// Zwei Fälle, und beide sind wichtig. Der Test läuft dafür in einem frischen
// Kontext, weil die vorherigen Seitenaufrufe den Standort bereits gespeichert
// haben – sonst prüft man versehentlich den falschen Zustand.
{
  const frisch = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const neu = await frisch.newPage();

  await neu.goto(`${BASIS}/`, { waitUntil: 'networkidle' });
  const beiErstbesuch = await neu.evaluate(
    () => getComputedStyle(document.querySelector('#zuletzt')).display !== 'none',
  );
  if (beiErstbesuch) {
    fehler.push('"Zuletzt gewählt" erscheint schon beim Erstbesuch');
  }

  // Standort bewusst wählen, dann zurück zur Startseite.
  await neu.goto(`${BASIS}/potsdam/`, { waitUntil: 'networkidle' });
  await neu.goto(`${BASIS}/`, { waitUntil: 'networkidle' });
  await neu.waitForTimeout(200);

  const nachBesuch = await neu.evaluate(() => {
    const box = document.querySelector('#zuletzt');
    return {
      sichtbar: getComputedStyle(box).display !== 'none',
      name: document.querySelector('#zuletzt-name')?.textContent ?? '',
      ziel: document.querySelector('#zuletzt-link')?.getAttribute('href') ?? '',
      // Es darf keine automatische Weiterleitung geben – das war der
      // Ausgangsfehler der alten Website.
      pfad: location.pathname,
    };
  });

  if (!nachBesuch.sichtbar) fehler.push('"Zuletzt gewählt" erscheint nach Standortbesuch nicht');
  if (nachBesuch.ziel !== '/potsdam/') {
    fehler.push(`"Zuletzt gewählt" verlinkt auf ${nachBesuch.ziel} statt /potsdam/`);
  }
  if (nachBesuch.pfad !== '/') {
    fehler.push(`Startseite leitet automatisch weiter nach ${nachBesuch.pfad} – darf sie nicht`);
  }

  await frisch.close();
}

// ── Termine: kein Drittanbieter ohne Einwilligung ──
await seite.goto(`${BASIS}/potsdam/termine/`, { waitUntil: 'networkidle' });
if (await sichtbar('#rahmen')) fehler.push('Doctolib-Rahmen ohne Einwilligung sichtbar');
const iframes = await seite.evaluate(() => document.querySelectorAll('iframe').length);
if (iframes > 0) fehler.push(`${iframes} iframe(s) im Dokument ohne Einwilligung`);

// ── 404: Behandlung an einem Standort, der sie nicht anbietet ──
await seite.goto(`${BASIS}/berlinmitte/leistungen/zahnimplantate/`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(300);
if (!(await sichtbar('#treffer'))) fehler.push('404 löst den Standort-Sonderfall nicht auf');
if (await sichtbar('#allgemein')) fehler.push('404 zeigt zusätzlich den allgemeinen Text');

await browser.close();

if (fehler.length) {
  console.error('\n[oberflaeche] Beanstandungen:\n');
  for (const f of fehler) console.error(`  ✗ ${f}`);
  console.error('');
  process.exit(1);
}

console.log('[oberflaeche] Alle Ein- und Ausblendzustände korrekt.');
