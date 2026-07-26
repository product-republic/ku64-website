#!/usr/bin/env node
/**
 * Prüft die gebaute Seite im echten Browser auf zwei Fehler, die man im
 * Quelltext nicht sieht.
 *
 * ── 1. Seitliches Überlaufen ────────────────────────────────────────────
 *
 * Wenn ein Element breiter ist als der Bildschirm, lässt sich die ganze
 * Seite seitlich schieben. Auf dem Handy ist das ein handfester Mangel:
 * Beim Scrollen verrutscht der Text, und am rechten Rand steht eine leere
 * Fläche. Gemeldet wird nicht nur, DASS es überläuft, sondern welches
 * Element – sonst sucht man lange.
 *
 * ── 2. Text auf zu schwachem Untergrund ─────────────────────────────────
 *
 * VORGABE: Es darf nicht passieren, dass sich Ebenen so treffen, dass Text
 * unleserlich wird. Geprüft wird deshalb jede Textstelle, die über einem
 * Bild, einem Video oder einer durchscheinenden Fläche liegt: Steht dort
 * ein Schleier oder eine ausreichende Unschärfe dazwischen?
 *
 * Das ist bewusst eine strukturelle Prüfung und keine Farbmessung: Über
 * einem laufenden Video ist jede Farbmessung nur für ein einzelnes Bild
 * gültig. Verlässlich ist die Frage, ob überhaupt etwas dazwischenliegt.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   node scripts/layout-pruefen.mjs http://localhost:4321
 *
 * Endet mit Rückgabewert 1, wenn etwas gefunden wurde – damit es sich in
 * den Build hängen lässt.
 */

import { chromium } from 'playwright';

const BASIS = process.argv[2] ?? 'http://localhost:4321';

const SEITEN = [
  '/',
  '/berlin-charlottenburg/',
  '/berlinmitte/',
  '/wilmersdorf/',
  '/potsdam/',
  '/berlin-charlottenburg/team/',
  '/berlin-charlottenburg/praxis/',
  '/berlin-charlottenburg/leistungen/',
  '/berlin-charlottenburg/leistungen/zahnimplantate/',
  '/leistungen/',
  '/termine/',
  '/kontakt/',
  '/ueber-uns/',
  '/notfall/',
];

const BREITEN = [
  { name: 'handy', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'gross', width: 1440, height: 900 },
];

/* Derselbe Weg wie in `oberflaeche-pruefen.mjs`: der fest installierte
   Browser dieser Umgebung, überschreibbar per Umgebungsvariable. */
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PFAD || '/opt/pw-browsers/chromium',
});

const funde = [];

for (const breite of BREITEN) {
  const kontext = await browser.newContext({
    viewport: { width: breite.width, height: breite.height },
    locale: 'de-DE',
    reducedMotion: 'reduce',
  });
  const seite = await kontext.newPage();

  for (const pfad of SEITEN) {
    const antwort = await seite.goto(BASIS + pfad, { waitUntil: 'networkidle' });
    if (!antwort?.ok()) {
      funde.push({ art: 'SEITE', pfad, breite: breite.name, text: `HTTP ${antwort?.status()}` });
      continue;
    }
    await seite.evaluate(() => document.fonts.ready);

    const ergebnis = await seite.evaluate((sichtbreite) => {
      const raus = [];

      /* ── Überlaufen ───────────────────────────────────────────────── */
      const ueberlauf = document.documentElement.scrollWidth - sichtbreite;
      if (ueberlauf > 1) {
        /* Die Verursacher suchen: Elemente, deren rechte Kante über den
           Bildschirm hinausragt und deren Eltern das nicht schon tun. */
        const schuldige = [];
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          if (r.right <= sichtbreite + 1 && r.left >= -1) continue;
          /* Absichtlich ausgestellte Dinge zählen nicht: geschlossene Menüs
             und Elemente, die per transform aus dem Bild geschoben sind. */
          const stil = getComputedStyle(el);
          if (stil.visibility === 'hidden' || stil.opacity === '0') continue;
          if (el.closest('[hidden]')) continue;
          schuldige.push({
            wahl: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''),
            rechts: Math.round(r.right),
            breite: Math.round(r.width),
          });
        }
        raus.push({
          art: 'UEBERLAUF',
          text: `${Math.round(ueberlauf)} px zu breit`,
          wer: schuldige.slice(0, 4),
        });
      }

      /* ── Text ohne Trennung vom Medium ────────────────────────────── */
      const textElemente = document.querySelectorAll('h1, h2, h3, p, li, dd, dt, a, span, button');
      for (const el of textElemente) {
        if (!el.textContent?.trim()) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;

        /* Liegt über einem Medium? */
        const aufMedium = el.closest('.auf-medium');
        if (!aufMedium) continue;

        /* Dann muss dazwischen ein Schleier liegen. Der steht als
           ::before auf `.auf-medium` – prüfbar über den berechneten Stil. */
        const schleier = getComputedStyle(aufMedium, '::before');
        const hatSchleier =
          schleier.backgroundImage !== 'none' || schleier.backgroundColor !== 'rgba(0, 0, 0, 0)';
        if (!hatSchleier) {
          raus.push({
            art: 'KEIN-SCHLEIER',
            text: `"${el.textContent.trim().slice(0, 40)}" liegt ohne Schleier auf einem Medium`,
          });
          break;
        }
      }

      /* ── Text auf Glas ohne Unschärfe ─────────────────────────────── */
      for (const el of document.querySelectorAll('.glas, .glas-lesbar, .karte')) {
        const text = el.textContent?.trim();
        if (!text) continue;
        const stil = getComputedStyle(el);
        const durchsichtig =
          /rgba?\([^)]*,\s*0?\.\d+\s*\)/.test(stil.backgroundColor) ||
          stil.backgroundImage.includes('gradient');
        if (!durchsichtig) continue;
        const unscharf = stil.backdropFilter !== 'none' || stil.webkitBackdropFilter !== 'none';
        /* Eine durchscheinende Fläche mit Text darauf braucht entweder
           Unschärfe oder einen ruhigen Untergrund. Ruhig heißt hier: nicht
           über einem Bild oder Video. */
        if (unscharf) continue;
        const r = el.getBoundingClientRect();
        const daruntermedium = [...document.querySelectorAll('img, video')].some((m) => {
          const mr = m.getBoundingClientRect();
          return !(mr.right < r.left || mr.left > r.right || mr.bottom < r.top || mr.top > r.bottom);
        });
        if (daruntermedium) {
          raus.push({
            art: 'GLAS-OHNE-UNSCHAERFE',
            text: `"${text.slice(0, 40)}" steht auf durchscheinender Fläche über einem Bild`,
          });
        }
      }

      return raus;
    }, breite.width);

    for (const e of ergebnis) funde.push({ ...e, pfad, breite: breite.name });
  }

  await kontext.close();
}

await browser.close();

if (!funde.length) {
  console.log(
    `[layout] ${SEITEN.length} Seiten × ${BREITEN.length} Breiten – kein Überlauf, kein Text ohne Untergrund.`,
  );
  process.exit(0);
}

console.log(`[layout] ${funde.length} Befunde:\n`);
for (const f of funde) {
  console.log(`  ${f.art.padEnd(22)} ${f.breite.padEnd(7)} ${f.pfad}`);
  console.log(`    ${f.text}`);
  for (const w of f.wer ?? []) {
    console.log(`      · ${w.wahl} (rechte Kante ${w.rechts} px, Breite ${w.breite} px)`);
  }
}
process.exit(1);
