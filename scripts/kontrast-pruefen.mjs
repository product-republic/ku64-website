/**
 * Farbkontrast von Schrift gegen ihren Untergrund.
 *
 * ── Warum es das gibt ───────────────────────────────────────────────────
 *
 * Es gab bisher keine Prüfung dafür. Aufgefallen ist es über Lighthouse:
 * Barrierefreiheit 90 statt 100, sechs Stellen im Fuß, der Satz in der
 * Standortleiste und die abgeblendeten Sprachkürzel. Alles Text, den man
 * sieht – nur eben zu blass.
 *
 * Das ist kein Schönheitsfehler. WCAG 1.4.3 verlangt 4,5:1 für normalen
 * Text und 3:1 für großen (ab 24 px, oder ab 18,66 px fett). Wer die
 * Anforderung reißt, schließt Menschen mit eingeschränktem Sehvermögen aus –
 * und bei einer Arztpraxis sind das überdurchschnittlich viele.
 *
 * ── Warum im Browser und nicht im CSS ───────────────────────────────────
 *
 * Weil die Farbe im Quelltext nicht die Farbe auf dem Schirm ist. Die
 * Flächen hier sind halbdurchsichtig (`rgb(255 255 255 / 0.5)`), also hängt
 * der tatsächliche Untergrund davon ab, was darunter liegt. Ausgerechnet
 * wird deshalb, was der Browser wirklich zeichnet: Farbe des Textes gegen
 * den zusammengerechneten Untergrund aller Vorfahren.
 *
 * Geprüft wird in beiden Breiten. Auf dem Telefon gelten teils andere
 * Regeln – der Fuß ist einspaltig, die Sprachwahl steht im Menü –, und ein
 * Kontrast, der oben stimmt, kann unten fehlen.
 *
 * ── Was bewusst NICHT geprüft wird ──────────────────────────────────────
 *
 * Text über Bildern und Videos. Dort gibt es keinen einzelnen Untergrund,
 * gegen den sich rechnen ließe; der Kopf löst das mit Schleier und
 * Weichzeichnung (siehe Kopfmedium.astro). Das beurteilt ein Mensch, kein
 * Skript – und ein Skript, das es doch versucht, meldet entweder ständig
 * Fehlalarm oder rechnet sich das Ergebnis schön.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   npm run build && npm start &
 *   npm run kontrast:pruefen
 */

import { chromium } from 'playwright';

import { kontrastMessen as MESSEN } from './lib/kontrast-messen.mjs';

const BASIS = process.env.KLICKPFAD_BASIS || 'http://127.0.0.1:4331';

/**
 * Eine Seite je Bauart – mehr sagt nichts Neues über die Bausteine.
 *
 * Die Teamseite stand hier zuerst NICHT, und das hat einen Fehler
 * durchgelassen: `.chip-zahl` in den Filterknöpfen kam über `opacity: 0.65`
 * auf 3,5:1. Gefunden hat es später Lighthouse. Die Teamseite ist die
 * einzige Seite mit Filterknöpfen – ein Baustein, den es nur dort gibt, wird
 * von einer Liste ohne diese Seite nie geprüft.
 *
 * Wer hier etwas ergänzt, ergänzt es wegen eines Bausteins, den keine der
 * anderen Seiten trägt. Umgekehrt gilt: Ein neuer Baustein braucht eine
 * Seite in dieser Liste.
 */
const SEITEN = [
  ['/', 'Start'],
  ['/berlin-charlottenburg/', 'Standort'],
  ['/berlin-charlottenburg/leistungen/bleaching/', 'Behandlung'],
  ['/berlin-charlottenburg/team/', 'Team (Filterknöpfe)'],
  ['/blog/', 'Blogübersicht'],
  ['/kontakt/', 'Kontakt'],
  ['/suche/', 'Suche'],
  ['/en/', 'Start (EN)'],
];

const BREITEN = [
  ['Telefon', 390, 844],
  ['Schreibtisch', 1440, 900],
];

/* Der dunkle Modus hat eigene Farbwerte. Er wird über die Systemeinstellung
   aktiviert, nicht über einen Schalter – also sieht ihn niemand, der ihn
   nicht ohnehin überall eingestellt hat, und genau deshalb fällt dort ein
   Fehler besonders lange nicht auf. */
const MODI = ['light', 'dark'];

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PFAD || '/opt/pw-browsers/chromium',
  args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});

/* Der Rechenweg steht in scripts/lib/kontrast-messen.mjs – dieselbe
   Messung braucht auch der Bericht (bericht/bericht-pruefen.mjs). Warum
   nicht kopiert: siehe Kopfkommentar dort. */

const alle = new Map();
let geprueft = 0;
let uebersprungen = 0;

for (const modus of MODI)
  for (const [breitenNameRoh, w, h] of BREITEN) {
    const breitenName = `${breitenNameRoh}/${modus === 'dark' ? 'dunkel' : 'hell'}`;
    for (const [pfad, art] of SEITEN) {
      const seite = await browser.newPage({
        viewport: { width: w, height: h },
        colorScheme: modus,
      });
      await seite.goto(BASIS + pfad, { waitUntil: 'networkidle' });

      /*
       * Bewegung anhalten und Eingeblendetes eingeblendet lassen.
       *
       * Ohne das misst man Zwischenstände: Ein Absatz, der gerade von 0 auf
       * 1 fährt, steht beim Messen vielleicht bei 0,08 – dann ist die
       * Schrift fast durchsichtig, und die Rechnung ergibt 1,47:1 für einen
       * Text, der eine Sekunde später bei 16:1 steht. Genau das hat diese
       * Prüfung zweimal gemeldet, bevor diese Zeilen hier standen.
       *
       * Gemessen wird der Zustand, den die Besucherin sieht: fertig
       * eingeblendet.
       */
      await seite.addStyleTag({
        content: `*, *::before, *::after { transition: none !important; animation: none !important; }
                  .einblenden { opacity: 1 !important; transform: none !important; }`,
      });

      geprueft++;

    /*
     * Zweimal messen: ungescrollt und durchgescrollt.
     *
     * Ungescrollt, weil der Kopf oben anders aussieht – angedockt blendet er
     * den Satz „Bitte wählen Sie Ihren Standort" aus, und was ausgeblendet
     * ist, lässt sich nicht messen. Genau diese Stelle hatte Lighthouse
     * gemeldet; ein Lauf, der nur gescrollt misst, hätte sie verloren.
     *
     * Durchgescrollt, weil sich vieles beim Erscheinen einblendet und
     * vorher auf `opacity: 0` steht. Ungescrollt allein wäre die halbe
     * Seite „unsichtbar" und damit ungeprüft.
     */
    for (const zustand of ['oben', 'gescrollt']) {
      if (zustand === 'gescrollt') {
        await seite.evaluate(async () => {
          const schritt = window.innerHeight * 0.8;
          for (let y = 0; y < document.body.scrollHeight; y += schritt) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 120));
          }
          await new Promise((r) => setTimeout(r, 300));
        });
      }

      const ergebnis = await seite.evaluate(MESSEN);
      uebersprungen += ergebnis.uebersprungen;
      for (const b of ergebnis.befunde) {
        const schluessel = `${breitenName} ${b.kennung}`;
        if (!alle.has(schluessel)) alle.set(schluessel, { ...b, breite: breitenName, art });
      }
    }

      await seite.close();
    }
  }

await browser.close();

console.log(
  `\n[kontrast] ${geprueft} Seitenaufrufe geprüft – Telefon und Schreibtisch, hell und dunkel`,
);
/* Nicht verschweigen, was nicht geprüft wurde – sonst liest sich „in
   Ordnung" wie „alles geprüft". */
console.log(`[kontrast] ${uebersprungen} Stellen über Video oder Foto übersprungen (.auf-medium)`);

if (alle.size === 0) {
  console.log('[kontrast] Jede Schrift hebt sich ausreichend von ihrem Untergrund ab.');
  process.exit(0);
}

console.error(`\n[kontrast] ${alle.size} Stelle(n) unter der Anforderung:`);
for (const b of [...alle.values()].sort((a, z) => a.wert - z.wert)) {
  console.error(
    `    ${b.wert.toFixed(2)}:1  (nötig ${b.noetig}:1)  ${b.kennung}` +
      `  – ${b.breite}, ${b.art}: „${b.text}"`,
  );
}

console.error(
  '\n[kontrast] ABBRUCH: WCAG 1.4.3 verlangt 4,5:1 für normalen Text und 3:1\n' +
    '           für großen. Wer darunter bleibt, schließt Menschen mit\n' +
    '           eingeschränktem Sehvermögen aus – bei einer Arztpraxis\n' +
    '           überdurchschnittlich viele.',
);
process.exit(1);
