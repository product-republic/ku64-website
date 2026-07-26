/**
 * Druckt den Befundbericht über Chromium nach PDF.
 *
 * Bewusst der Weg über den Browser statt über eine PDF-Bibliothek: Die
 * Gestaltung liegt bereits als HTML vor, samt eingebetteter Schriften. Ein
 * Nachbau in reportlab würde Typografie und Layout nur annähern.
 *
 * Zwei Einstellungen sind nicht optional:
 *   emulateMedia({ colorScheme: 'light' })  – sonst greift auf einem dunkel
 *     eingestellten System die dunkle Fassung und der Druck wird schwarz.
 *   printBackground: true                   – sonst fehlen die farbigen
 *     Schweregrad-Kanten und die Belegblöcke.
 */
import { chromium } from 'playwright';
import path from 'node:path';
import { stat } from 'node:fs/promises';

const HIER = import.meta.dirname;
const quelle = path.join(HIER, 'befundbericht.html');
const ziel = path.join(HIER, 'KU64-Befundbericht.pdf');

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PFAD || '/opt/pw-browsers/chromium',
});
const seite = await browser.newPage();

await seite.goto(`file://${quelle}`, { waitUntil: 'networkidle' });
await seite.emulateMedia({ media: 'print', colorScheme: 'light' });

// Sicherstellen, dass die eingebetteten Schriften geladen sind – sonst
// druckt Chromium stillschweigend die Ersatzschrift.
await seite.evaluate(() => document.fonts.ready);

const schriftGreift = await seite.evaluate(() =>
  getComputedStyle(document.querySelector('h1')).fontFamily.includes('Fraunces'),
);
if (!schriftGreift) {
  throw new Error('Die eingebettete Überschriftenschrift greift nicht – Druck abgebrochen.');
}

await seite.pdf({
  path: ziel,
  format: 'A4',
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: '<span></span>',
  footerTemplate: `
    <div style="width:100%;padding:0 15mm;font-family:sans-serif;font-size:7.5pt;
                color:#7b8394;display:flex;justify-content:space-between;">
      <span>Befundbericht ku64.de · 26. Juli 2026</span>
      <span>Seite <span class="pageNumber"></span> von <span class="totalPages"></span></span>
    </div>`,
  margin: { top: '16mm', right: '15mm', bottom: '18mm', left: '15mm' },
});

await browser.close();

const { size } = await stat(ziel);
console.log(`[pdf] KU64-Befundbericht.pdf erzeugt – ${(size / 1024).toFixed(0)} KB`);
