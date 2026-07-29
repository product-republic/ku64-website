/**
 * Auslieferung: Sicherheitsköpfe, Caching und Brotli.
 *
 * ── Warum es diese Datei gibt ─────────────────────────────────────────────
 *
 * Der Node-Adapter im Standalone-Betrieb bringt einen eigenen Server mit. Der
 * ist funktionsfähig, setzt aber keinen einzigen Sicherheitskopf und liefert
 * jede Datei mit `cache-control: public, max-age=0` aus – auch die unter
 * `/_astro/`, deren Dateinamen einen Inhalts-Hash tragen und die sich damit
 * per Definition nie ändern. Die 48 KB große Schriftdatei wurde bei jeder
 * Navigation neu bestätigt.
 *
 * Gemessen vor diesem Umbau: null von sechs Sicherheitsköpfen, kein Brotli
 * (eine Anfrage mit `Accept-Encoding: br` bekam 42,6 KB unkomprimiert statt
 * 11,3 KB), und kein einziges Asset mit langer Haltbarkeit.
 *
 * Deshalb läuft der Adapter jetzt im Middleware-Betrieb, und die Auslieferung
 * steht hier – an einer Stelle, lesbar, mit Begründung je Kopf.
 *
 * ── Was hier NICHT passiert ──────────────────────────────────────────────
 *
 * Kein Logging von Adressen oder IP-Adressen. Die Website kommt ohne
 * Drittanbieter und ohne Cookies aus; ein Server, der still mitschreibt,
 * würde dieses Versprechen von hinten aufheben.
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync, readFileSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliCompressSync, constants as zlibConst } from 'node:zlib';
import { handler as astro } from '../dist/server/entry.mjs';

const WURZEL = fileURLToPath(new URL('../dist/client/', import.meta.url));
const PORT = Number(process.env.PORT ?? 4321);
const HOST = process.env.HOST ?? '0.0.0.0';

const TYPEN = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
};

/** Was sich komprimieren lohnt. Bilder und Videos sind bereits komprimiert. */
const KOMPRIMIERBAR = new Set([
  'text/html; charset=utf-8',
  'text/javascript; charset=utf-8',
  'text/css; charset=utf-8',
  'application/json; charset=utf-8',
  'application/manifest+json; charset=utf-8',
  'application/xml; charset=utf-8',
  'text/plain; charset=utf-8',
  'image/svg+xml',
]);

/**
 * Sicherheitsköpfe.
 *
 * `Content-Security-Policy` erlaubt `'unsafe-inline'` für Skripte, und das ist
 * eine bewusste Einschränkung: Astro erzeugt zwei Inline-Skripte (den
 * Wiederanlauf nach einem Seitenwechsel und die Standortleiste). Ohne Hashes
 * oder Nonce würde die Seite mit einer strengeren Regel schlicht nicht mehr
 * funktionieren. Was die Regel trotzdem leistet: Skripte von fremden Adressen
 * sind ausgeschlossen, und das ist der übliche Weg, auf dem fremder Code auf
 * eine Seite kommt.
 *
 * `connect-src` nennt ElevenLabs, weil der Sprachberater dorthin eine
 * WebSocket-Verbindung aufbaut, und jsDelivr, weil dessen SDK sein
 * Audio-Worklet von dort nachlädt. Beides geschieht ausschließlich, nachdem
 * jemand den Berater gestartet und das Mikrofon freigegeben hat – nie beim
 * bloßen Lesen einer Seite.
 *
 * `microphone=(self)` in der Permissions-Policy aus demselben Grund: Ohne die
 * Angabe verweigert der Browser den Zugriff, und der Sprachberater ließe sich
 * gar nicht erst einschalten.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "media-src 'self' blob:",
  "connect-src 'self' https://api.elevenlabs.io wss://api.elevenlabs.io https://cdn.jsdelivr.net",
  "worker-src 'self' blob:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

/*
 * ── Was indexiert werden darf, und was nicht ─────────────────────────────
 *
 * Diese Anwendung läuft derzeit unter einer Railway-Adresse, während die
 * alte Website weiter unter ku64.de steht. Ohne Vorkehrung ist die Vorschau
 * für Suchmaschinen eine ganz normale Website – geprüft und bestätigt:
 * `robots.txt` erlaubte alles, es gab keinen `X-Robots-Tag`, und das
 * Canonical zeigte auf die Railway-Adresse selbst.
 *
 * Das ist kein theoretisches Risiko. Wird die Vorschau indexiert, steht der
 * vollständige Inhalt der Praxis ein zweites Mal im Netz, unter einer
 * fremden Domain, in direkter Konkurrenz zum Original – und wenn die neue
 * Seite später auf ku64.de umzieht, konkurriert sie mit ihrer eigenen
 * Vorschau um dieselben Suchbegriffe.
 *
 * Die Regel steht deshalb am Server, nicht in einer Seite: Sie greift für
 * HTML, für die Sitemap, für Vorschaubilder, für alles.
 *
 * Entscheidend ist der Host, nicht ein Schalter: Was unter ku64.de
 * ausgeliefert wird, ist die Website. Alles andere ist eine Vorschau. Damit
 * schaltet sich die Sperre beim Umzug von selbst ab, und niemand muss daran
 * denken – die häufigste Ursache dafür, dass ein `noindex` nach dem
 * Livegang stehen bleibt und eine Website monatelang unsichtbar macht.
 */
const OEFFENTLICHE_HOSTS = new Set(
  (process.env.OEFFENTLICHE_HOSTS ?? 'ku64.de,www.ku64.de')
    .split(',')
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean),
);

function istVorschau(anfrage) {
  const roh = anfrage.headers['x-forwarded-host'] ?? anfrage.headers.host ?? '';
  const host = String(roh)
    .split(',')[0]
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, '');
  return !OEFFENTLICHE_HOSTS.has(host);
}

function koepfe(antwort, vorschau) {
  if (vorschau) {
    /* `noindex` allein genügt nicht: `nofollow` hält Suchmaschinen davon ab,
       den 85.000 internen Verweisen zu folgen und so doch einen Bestand
       aufzubauen; `noarchive` verhindert eine zwischengespeicherte Fassung,
       die auch nach dem Abschalten noch abrufbar wäre. */
    antwort.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  }
  antwort.setHeader('Content-Security-Policy', CSP);
  /* Zwei Jahre, Unterdomains eingeschlossen. Erst setzen, wenn die Domain
     dauerhaft auf HTTPS läuft – das tut sie. */
  antwort.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');
  /* Verhindert, dass der Browser einen Dateityp errät. Eine als Text
     ausgelieferte Datei wird dann nicht doch als Skript ausgeführt. */
  antwort.setHeader('X-Content-Type-Options', 'nosniff');
  /* Beim Sprung nach außen – etwa zu Doctolib – nur die Herkunft übertragen,
     nicht die vollständige Adresse. Welche Beschwerdeseite jemand vorher
     gelesen hat, geht Dritte nichts an. */
  antwort.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  antwort.setHeader('X-Frame-Options', 'SAMEORIGIN');
  antwort.setHeader(
    'Permissions-Policy',
    'camera=(), geolocation=(), payment=(), usb=(), microphone=(self)',
  );
}

/* Dateien mit Inhalts-Hash im Namen ändern sich nie – ändert sich der Inhalt,
   ändert sich der Name. Ein Jahr und `immutable` heißt: kein Rückfragen. */
const UNVERAENDERLICH = /^\/(_astro|og)\//;

function haltbarkeit(pfad, typ) {
  if (UNVERAENDERLICH.test(pfad)) return 'public, max-age=31536000, immutable';
  if (typ && typ.startsWith('image/')) return 'public, max-age=2592000';
  if (typ === 'font/woff2') return 'public, max-age=31536000, immutable';
  if (typ === 'video/mp4') return 'public, max-age=2592000';
  /* HTML nie lange festhalten: Öffnungszeiten, Team und Preise ändern sich,
     und ein Browser, der eine Woche alte Seite zeigt, erzählt Falsches.
     `must-revalidate` mit ETag kostet eine schnelle Rückfrage, keinen
     vollständigen Abruf. */
  return 'public, max-age=0, must-revalidate';
}

/* Brotli-Ergebnisse merken. Der Bestand ist statisch und klein genug, dass
   das Zwischenlager nicht wächst; komprimiert wird jede Datei einmal. */
const brotliCache = new Map();

function brotli(inhalt) {
  return brotliCompressSync(inhalt, {
    params: {
      [zlibConst.BROTLI_PARAM_QUALITY]: 5,
      [zlibConst.BROTLI_PARAM_SIZE_HINT]: inhalt.length,
    },
  });
}

function aufloesen(pfad) {
  /* `normalize` fängt `../` ab – ohne das ließe sich mit `/../../etc/passwd`
     aus dem Ausgabeverzeichnis herausklettern. */
  const sicher = normalize(decodeURIComponent(pfad)).replace(/^(\.\.[/\\])+/, '');
  const datei = join(WURZEL, sicher);
  if (!datei.startsWith(WURZEL)) return null;
  if (existsSync(datei) && statSync(datei).isFile()) return datei;
  const alsIndex = join(datei, 'index.html');
  if (existsSync(alsIndex)) return alsIndex;
  return null;
}

/*
 * Weiterleitungen für Adressen mit Dateiendung.
 *
 * Astros Router arbeitet mit Routen, nicht mit Dateinamen – `/sitemap.xml`
 * lässt sich dort nicht als Weiterleitung eintragen, weil die Adresse wie
 * eine Datei aussieht und nie eine Route wird. Die Eintragung in
 * weiterleitungen.ts blieb deshalb wirkungslos, und die Adresse antwortete
 * mit 404.
 *
 * Sie ist aber die, die Suchmaschinen und Werkzeuge blind ausprobieren.
 * Deshalb hier, wo der Dateiname noch ein Dateiname ist.
 */
const DATEI_WEITERLEITUNGEN = {
  '/sitemap.xml': '/sitemap-index.xml',
  '/sitemap_index.xml': '/sitemap-index.xml',
};

const server = createServer((anfrage, antwort) => {
  const vorschau = istVorschau(anfrage);
  koepfe(antwort, vorschau);

  const pfad = (anfrage.url ?? '/').split('?')[0];

  /*
   * Auf einer Vorschau-Adresse eine eigene robots.txt.
   *
   * Der Kopf `X-Robots-Tag` wirkt erst, wenn eine Seite abgerufen wurde –
   * die robots.txt verhindert den Abruf. Beides zusammen, weil beides
   * verschiedene Lücken schließt: Ein Crawler, der die robots.txt ignoriert,
   * bekommt trotzdem den Kopf; und ein Bot, der nur die robots.txt liest,
   * fängt gar nicht erst an.
   *
   * Die gebaute robots.txt bleibt unangetastet – sie ist die für ku64.de.
   */
  if (vorschau && pfad === '/robots.txt') {
    antwort.statusCode = 200;
    antwort.setHeader('Content-Type', TYPEN['.txt']);
    antwort.setHeader('Cache-Control', 'no-store');
    antwort.end(
      '# Vorschau des Neubaus – nicht die Website.\n' +
        '# Die Inhalte gehoeren zu https://ku64.de/ und stehen dort.\n\n' +
        'User-agent: *\nDisallow: /\n',
    );
    return;
  }

  /* Endpunkte und alles, was Astro zur Laufzeit beantwortet, gehen an den
     Adapter – mit den Köpfen, die oben schon gesetzt sind. */
  if (pfad.startsWith('/api/')) {
    astro(anfrage, antwort, () => {
      antwort.statusCode = 404;
      antwort.end('Not found');
    });
    return;
  }

  const ziel = DATEI_WEITERLEITUNGEN[pfad];
  if (ziel) {
    antwort.statusCode = 301;
    antwort.setHeader('Location', ziel);
    antwort.setHeader('Cache-Control', 'public, max-age=86400');
    antwort.end();
    return;
  }

  const datei = aufloesen(pfad);

  if (!datei) {
    /*
     * Keine Datei – aber noch kein Fehler.
     *
     * Die Weiterleitungen des Altbestands entstehen im Middleware-Betrieb
     * nicht als Dateien, sondern als Routen des Adapters. Wer hier sofort mit
     * 404 antwortete, würde alle 587 Adressen der alten Website ins Leere
     * laufen lassen – und zwar unbemerkt, weil die Seite selbst funktioniert.
     *
     * Deshalb zuerst der Adapter, und erst wenn auch der nichts kennt, die
     * gestaltete Fehlerseite.
     */
    astro(anfrage, antwort, () => {
      const fehlerseite = join(WURZEL, '404.html');
      antwort.statusCode = 404;
      antwort.setHeader('Content-Type', TYPEN['.html']);
      antwort.setHeader('Cache-Control', 'no-store');
      if (existsSync(fehlerseite)) createReadStream(fehlerseite).pipe(antwort);
      else antwort.end('Not found');
    });
    return;
  }

  const typ = TYPEN[extname(datei).toLowerCase()] ?? 'application/octet-stream';
  const stat = statSync(datei);
  const etag = `W/"${stat.size}-${stat.mtimeMs}"`;

  antwort.setHeader('Content-Type', typ);
  antwort.setHeader('Cache-Control', haltbarkeit(pfad, typ));
  antwort.setHeader('ETag', etag);
  antwort.setHeader('Vary', 'Accept-Encoding');

  if (anfrage.headers['if-none-match'] === etag) {
    antwort.statusCode = 304;
    antwort.end();
    return;
  }

  const akzeptiert = String(anfrage.headers['accept-encoding'] ?? '');
  if (KOMPRIMIERBAR.has(typ) && akzeptiert.includes('br')) {
    let gepackt = brotliCache.get(datei);
    if (!gepackt || gepackt.stand !== stat.mtimeMs) {
      gepackt = { stand: stat.mtimeMs, inhalt: brotli(readFileSync(datei)) };
      brotliCache.set(datei, gepackt);
    }
    antwort.setHeader('Content-Encoding', 'br');
    antwort.setHeader('Content-Length', gepackt.inhalt.length);
    antwort.end(gepackt.inhalt);
    return;
  }

  antwort.setHeader('Content-Length', stat.size);
  createReadStream(datei).pipe(antwort);
});

server.listen(PORT, HOST, () => {
  console.log(`[server] ${HOST}:${PORT} – Sicherheitsköpfe, Brotli und Haltbarkeit aktiv`);
});
