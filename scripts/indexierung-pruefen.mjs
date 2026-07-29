/**
 * Darf indexiert werden, was indexiert werden soll – und nur das?
 *
 * ── Die zwei Fehler, die diese Prüfung verhindert ───────────────────────
 *
 * 1. Die Vorschau wird indexiert. Dann steht der vollständige Inhalt der
 *    Praxis ein zweites Mal im Netz, unter einer fremden Domain, in
 *    Konkurrenz zum Original – und die neue Seite konkurriert nach dem
 *    Umzug mit ihrer eigenen Vorschau.
 *
 * 2. Die Sperre bleibt nach dem Umzug stehen. Das ist der häufigere und
 *    teurere Fehler: Eine Website, die nach dem Livegang ein vergessenes
 *    `noindex` trägt, verschwindet innerhalb weniger Wochen vollständig aus
 *    der Suche, und niemand merkt es, weil die Seite ja funktioniert.
 *
 * Deshalb prüft dieses Skript BEIDE Richtungen. Eine Prüfung, die nur
 * bestätigt, dass gesperrt ist, würde Fehler 2 nicht sehen – und Fehler 2
 * ist der, der Geld kostet.
 *
 * Unterschieden wird am Host: Was unter ku64.de ausgeliefert wird, ist die
 * Website; alles andere ist Vorschau. Beide Fälle lassen sich gegen
 * denselben laufenden Server prüfen, indem der Host-Kopf gesetzt wird – so
 * wie es der Reverse Proxy im Betrieb auch tut.
 *
 * Aufruf:  npm start & npm run indexierung:pruefen
 */

const BASIS = process.env.KLICKPFAD_BASIS || 'http://127.0.0.1:4331';

const befunde = [];
let geprueft = 0;

async function hole(pfad, host) {
  const res = await fetch(BASIS + pfad, {
    headers: host ? { Host: host, 'X-Forwarded-Host': host } : {},
    redirect: 'manual',
  });
  return { kopf: res.headers.get('x-robots-tag') ?? '', text: await res.text() };
}

function pruefe(name, bedingung, hinweis) {
  geprueft++;
  if (bedingung) {
    console.log(`  ok      ${name}`);
  } else {
    console.log(`  BEFUND  ${name} – ${hinweis}`);
    befunde.push(name);
  }
}

/* ── Vorschau: muss gesperrt sein ─────────────────────────────────────── */

console.log('\n[index] Auf einer Vorschau-Adresse');

const vStart = await hole('/', 'vorschau.example.app');
pruefe(
  'Startseite trägt noindex',
  /noindex/i.test(vStart.kopf),
  `X-Robots-Tag war "${vStart.kopf || '(keiner)'}"`,
);
pruefe(
  'und nofollow, damit den Verweisen niemand folgt',
  /nofollow/i.test(vStart.kopf),
  `X-Robots-Tag war "${vStart.kopf || '(keiner)'}"`,
);

const vRobots = await hole('/robots.txt', 'vorschau.example.app');
pruefe(
  'robots.txt sperrt alles',
  /^\s*Disallow:\s*\/\s*$/m.test(vRobots.text) && !/Allow:\s*\//.test(vRobots.text),
  'robots.txt erlaubt weiterhin den Abruf',
);

const vSitemap = await hole('/sitemap-0.xml', 'vorschau.example.app');
pruefe(
  'auch die Sitemap trägt noindex',
  /noindex/i.test(vSitemap.kopf),
  `X-Robots-Tag war "${vSitemap.kopf || '(keiner)'}"`,
);

/* ── Die echte Domain: darf NICHT gesperrt sein ───────────────────────── */

console.log('\n[index] Unter ku64.de – hier darf nichts gesperrt sein');

const eStart = await hole('/', 'ku64.de');
pruefe(
  'Startseite ohne noindex',
  !/noindex/i.test(eStart.kopf),
  `X-Robots-Tag war "${eStart.kopf}" – so verschwindet die Seite aus der Suche`,
);

const eRobots = await hole('/robots.txt', 'ku64.de');
pruefe(
  'robots.txt gibt die Seite frei',
  /Allow:\s*\//.test(eRobots.text),
  'die Vorschau-Sperre greift auch unter der echten Domain',
);

const eWww = await hole('/', 'www.ku64.de');
pruefe(
  'auch mit www davor',
  !/noindex/i.test(eWww.kopf),
  `X-Robots-Tag war "${eWww.kopf}"`,
);

console.log(`\n[index] ${geprueft} Prüfungen, ${befunde.length} Befunde`);

if (befunde.length) {
  console.error(
    '\n[index] ABBRUCH: Entweder ist die Vorschau offen – dann entstehen\n' +
      '        doppelte Inhalte unter fremder Domain –, oder die echte Domain\n' +
      '        ist gesperrt, und die Website verschwindet aus der Suche.\n' +
      '        Die Regel steht in server/index.mjs (OEFFENTLICHE_HOSTS).',
  );
  process.exit(1);
}

console.log('[index] Vorschau gesperrt, echte Domain frei. In Ordnung.');
