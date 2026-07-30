/**
 * Lädt ein Drittanbieter wirklich erst auf Klick – und dann wirklich?
 *
 * ── Warum es diese Prüfung braucht ──────────────────────────────────────
 *
 * `dienste-pruefen.mjs` liest das gebaute HTML und stellt fest, dass dort kein
 * `<iframe src>` steht. Das ist die halbe Antwort. Die andere Hälfte ist eine
 * Frage, die man am HTML nicht sehen kann:
 *
 *   Passiert nach dem Klick auch etwas?
 *
 * Eine Sperre, die nichts durchlässt, besteht jede statische Prüfung mit
 * Bestnote. Genau diesen Zustand hatte die Website einen halben Tag lang:
 * `avVertrag: false` bei allen vier aktiven Diensten, 21 Einbettungen, null
 * Ladeknöpfe. Rundgang und Karte waren gebaut und nicht in Betrieb – und keine
 * Prüfung hat es gemerkt, weil alle nur nach dem Zuviel gesucht haben, nie
 * nach dem Zuwenig.
 *
 * ── Was gemessen wird ───────────────────────────────────────────────────
 *
 * In einem echten Browser, mit mitgeschriebenen Netzanfragen:
 *
 *   VOR dem Klick    keine Anfrage an einen fremden Host, kein `iframe`,
 *                    aber ein Ladeknopf – sonst gibt es nichts zu klicken
 *   NACH dem Klick   genau ein `iframe` mit der erwarteten Adresse, der
 *                    Knopf verschwunden, die Entscheidung gemerkt
 *
 * Fremde Hosts werden abgefangen und mit 204 beantwortet: Der Container kommt
 * nicht ins Netz, und geprüft wird, DASS angefragt wird, nicht was zurückkommt.
 *
 * ── Der Auswahldialog steht davor, und das ist Absicht ──────────────────
 *
 * Er liegt modal über der Seite; ohne Entscheidung kommt kein Klick am
 * Ladeknopf an. Die Prüfung lehnt deshalb erst ab und lädt dann den Rundgang –
 * genau der Weg eines Menschen, der die Statistik nicht will, den Rundgang
 * aber schon. Dass das geht, ist selbst eine Zusage: Ablehnen darf keine
 * Funktion kosten.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   OEFFENTLICHE_HOSTS=127.0.0.1 npm start &
 *   npm run freigabe:pruefen
 */

import { chromium } from 'playwright';

/* Derselbe Port, auf dem `npm start` hört – siehe server/index.mjs. Mit
   BASIS zu überschreiben, wenn der Server woanders läuft. */
const BASIS = process.env.BASIS ?? `http://127.0.0.1:${process.env.PORT ?? 4321}`;

/* Je Fall: wo er steht und welcher Host nach der Freigabe erwartet wird. */
const FAELLE = [
  { name: 'Rundgang', pfad: '/potsdam/', host: 'my.matterport.com' },
  { name: 'Karte', pfad: '/potsdam/anfahrt/', host: 'www.google.com' },
  { name: 'Rundgang Kurfürstendamm', pfad: '/berlin-charlottenburg/', host: 'my.matterport.com' },
];

const eigen = (h) => /^(127\.0\.0\.1|localhost)$/.test(h);

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PFAD || '/opt/pw-browsers/chromium',
  args: ['--enable-unsafe-swiftshader'],
});

const fehler = [];
const melden = (fall, satz) => fehler.push(`${fall.name} (${fall.pfad}): ${satz}`);

/*
 * ── Das Band verdeckt die Seite nicht ─────────────────────────────────
 *
 * Die Einwilligung stand als Modal über der Seite. Am Schreibtisch ging
 * das; auf dem Telefon sah man als Erstes eine Frage über eine Website,
 * von der man noch nichts gesehen hatte – ein Foto vom Gerät hat es
 * gezeigt, keine Prüfung.
 *
 * Gemessen wird deshalb, was der Mensch sieht: Wie viel vom Bildschirm
 * bleibt für die Seite? Und liegt das Band auf dem Berater-Knopf, dem
 * einzigen anderen Bedienelement da unten?
 *
 * Die Grenze von 35 Prozent ist keine Norm, sondern eine Entscheidung:
 * Darüber ist es kein Band mehr, sondern ein Vorhang. Wer sie ändert,
 * ändert sie hier – und merkt dabei, dass er sie ändert.
 */
const HOECHSTANTEIL = 0.35;

for (const [breite, hoehe, geraet] of [
  [390, 844, 'Telefon'],
  [768, 1024, 'Tablet'],
  [1280, 900, 'Schreibtisch'],
]) {
  const seite = await browser.newPage({ viewport: { width: breite, height: hoehe } });
  await seite.goto(BASIS + '/', { waitUntil: 'networkidle' });
  await seite.evaluate(() => document.fonts.ready);
  await seite.waitForTimeout(350);

  const band = await seite.evaluate(() => {
    const d = document.querySelector('dialog.einwilligung');
    if (!d) return null;
    const k = d.getBoundingClientRect();
    const ber = document.querySelector('.berater');
    const bk = ber ? ber.getBoundingClientRect() : null;
    /* Ein modaler Dialog liegt in der Top-Layer und hat einen ::backdrop –
       erkennbar daran, dass die Seite darunter keine Klicks mehr annimmt. */
    const mittePunkt = document.elementFromPoint(
      Math.round(window.innerWidth / 2),
      Math.round(window.innerHeight / 3),
    );
    return {
      offen: d.open,
      hoehe: Math.round(k.height),
      anteil: k.height / window.innerHeight,
      unten: Math.round(window.innerHeight - k.bottom),
      seiteBedienbar: Boolean(mittePunkt) && !d.contains(mittePunkt),
      beraterVerdeckt: bk ? bk.bottom > k.top + 2 : false,
      knoepfe: d.querySelectorAll('[data-ew]').length,
      ueberlauf: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
    };
  });

  const wo = { name: `Einwilligungsband · ${geraet}`, pfad: '/' };

  if (!band) melden(wo, 'es gibt gar kein Einwilligungsband');
  else {
    if (!band.offen) melden(wo, 'das Band steht beim ersten Aufruf nicht da');
    if (band.anteil > HOECHSTANTEIL) {
      melden(
        wo,
        `das Band nimmt ${Math.round(band.anteil * 100)} % der Höhe (${band.hoehe} px) – ` +
          `erlaubt sind ${Math.round(HOECHSTANTEIL * 100)} %`,
      );
    }
    if (band.unten > 24) melden(wo, `das Band schwebt ${band.unten} px über dem unteren Rand`);
    if (!band.seiteBedienbar) {
      melden(wo, 'die Seite ist hinter dem Band nicht anklickbar – es liegt als Modal davor');
    }
    if (band.beraterVerdeckt) melden(wo, 'das Band liegt auf dem Berater-Knopf');
    if (band.ueberlauf > 0) melden(wo, `${band.ueberlauf} px seitlicher Überlauf durch das Band`);
    /* Ablehnen und Zustimmen müssen beide da sein – und zwar sofort, nicht
       erst hinter einem Aufklapper. Artikel 4 Nr. 11 DSGVO. */
    if (band.knoepfe < 2) melden(wo, `nur ${band.knoepfe} Entscheidung(en) sichtbar`);

    /*
     * Auch der bestandene Fall wird gemeldet.
     *
     * Eine Prüfung, die nur bei Fehlern spricht, ist von einer Prüfung, die
     * gar nicht läuft, nicht zu unterscheiden. Genau das ist hier schon
     * passiert: Der erste Lauf dieses Abschnitts war grün, und ich konnte
     * der Ausgabe nicht ansehen, ob er überhaupt stattgefunden hat.
     */
    console.log(
      `[freigabe] Band ${geraet.padEnd(12)} ${String(band.hoehe).padStart(3)} px = ` +
        `${String(Math.round(band.anteil * 100)).padStart(2)} % der Höhe, ` +
        `Seite dahinter ${band.seiteBedienbar ? 'bedienbar' : 'GESPERRT'}, ` +
        `Berater ${band.beraterVerdeckt ? 'VERDECKT' : 'frei'}`,
    );
  }

  await seite.close();
}

for (const fall of FAELLE) {
  const seite = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const fremd = [];
  seite.on('request', (r) => {
    try {
      const h = new URL(r.url()).hostname;
      if (!eigen(h)) fremd.push(h);
    } catch {
      /* data: und blob: haben keinen Host – kein Drittanbieter. */
    }
  });
  await seite.route('**', (route) => {
    const h = new URL(route.request().url()).hostname;
    return eigen(h) ? route.continue() : route.fulfill({ status: 204, body: '' });
  });

  await seite.goto(BASIS + fall.pfad, { waitUntil: 'networkidle' });

  /* ── vor dem Klick ─────────────────────────────────────────────────── */

  const vorFremd = [...new Set(fremd)];
  if (vorFremd.length) melden(fall, `fremde Anfrage(n) ohne Zustimmung: ${vorFremd.join(', ')}`);

  if ((await seite.locator('iframe').count()) > 0) {
    melden(fall, 'ein <iframe> steht schon vor der Freigabe in der Seite');
  }

  const knoepfe = await seite.locator('[data-rolle="freigeben"]').count();
  if (knoepfe === 0) {
    /*
     * Der Zustand, um den es geht: Alles sauber gesperrt und nichts
     * bedienbar. Das ist kein Datenschutz, das ist eine fehlende Funktion.
     */
    melden(
      fall,
      'kein Ladeknopf – die Einbettung ist gesperrt und nicht bedienbar. ' +
        'Meist steht avVertrag in dienste.ts auf false.',
    );
    await seite.close();
    continue;
  }

  /* ── ablehnen, dann einzeln freigeben ─────────────────────────────── */

  await seite.evaluate(() => document.querySelector('[data-ew="ablehnen"]')?.click());
  await seite.waitForTimeout(250);

  if (await seite.evaluate(() => Boolean(document.querySelector('dialog[open]')))) {
    melden(fall, 'der Auswahldialog schließt beim Ablehnen nicht');
  }

  fremd.length = 0;
  await seite.locator('[data-rolle="freigeben"]').first().click();
  await seite.waitForTimeout(1500);

  /* ── nach dem Klick ───────────────────────────────────────────────── */

  const rahmen = seite.locator('iframe');
  if ((await rahmen.count()) === 0) {
    melden(fall, 'nach dem Klick entsteht kein <iframe> – die Freigabe wirkt nicht');
  } else {
    const src = (await rahmen.first().getAttribute('src')) ?? '';
    if (!src.includes(fall.host)) {
      melden(fall, `der <iframe> zeigt auf "${src.slice(0, 60)}" statt auf ${fall.host}`);
    }
  }

  if ((await seite.locator('[data-rolle="freigeben"]').count()) > 0) {
    melden(fall, 'der Ladeknopf steht nach dem Klick noch da');
  }

  const gemerkt = await seite.evaluate(() => localStorage.getItem('ku64:einwilligung'));
  if (!gemerkt) {
    melden(fall, 'die Entscheidung wurde nicht gemerkt – beim nächsten Aufruf wird erneut gefragt');
  } else {
    const e = JSON.parse(gemerkt);
    if (!e.kategorien?.includes('funktion')) {
      melden(fall, `gemerkt wurden "${e.kategorien}" – die Kategorie des Dienstes fehlt`);
    }
    /* Ablehnen und dann einzeln freigeben darf NICHT die Statistik einschalten. */
    if (e.kategorien?.includes('statistik')) {
      melden(fall, 'nach „Nur das Notwendige" ist trotzdem Statistik erlaubt');
    }
  }

  console.log(
    `[freigabe] ${fall.name.padEnd(24)} vorher: ${vorFremd.length} fremde, 0 iframes, ` +
      `${knoepfe} Knopf  →  nachher: 1 iframe auf ${fall.host}`,
  );

  await seite.close();
}

await browser.close();

if (fehler.length === 0) {
  console.log(
    '\n[freigabe] In Ordnung: Vor der Zustimmung geht keine Anfrage nach außen und\n' +
      '           steht kein Rahmen in der Seite. Nach dem Klick lädt der Dienst\n' +
      '           wirklich, und die Entscheidung wird gemerkt – ohne dass Ablehnen\n' +
      '           eine Funktion kostet.',
  );
  process.exit(0);
}

console.error(`\n[freigabe] ${fehler.length} Befund(e):`);
for (const f of fehler) console.error(`    – ${f}`);
console.error(
  '\n[freigabe] ABBRUCH: Eine Sperre, die nichts durchlässt, besteht jede\n' +
    '           statische Prüfung mit Bestnote. Genau diesen Zustand hatte diese\n' +
    '           Website schon einmal: 21 Einbettungen, null Ladeknöpfe, Rundgang\n' +
    '           und Karte gebaut und nicht in Betrieb.',
);
process.exit(1);
