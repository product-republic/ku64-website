/**
 * Prüft, ob die Formulare der eigenen Seite überhaupt angenommen werden.
 *
 * ── Der Fehler, den es dieses Skript gibt ───────────────────────────────
 *
 * Die Lächeln-Vorschau zeigte auf der Live-Seite „Failed to fetch". Kein
 * Skriptfehler, kein Absturz, im Protokoll nur eine Zeile:
 *
 *     POST /api/laecheln/  →  403
 *
 * Astro prüft bei jedem POST mit Formulardaten, ob der `Origin`-Kopf zur
 * eigenen Adresse passt – ein Schutz gegen Cross-Site Request Forgery.
 * Verglichen wird mit `Astro.url`, und die baut der Node-Adapter aus dem,
 * was am Socket ankommt.
 *
 * Auf Railway kommt am Socket aber der Reverse Proxy an, nicht der Browser:
 * HTTP statt HTTPS, interner Host statt öffentlicher. Die echte Adresse
 * steht in `X-Forwarded-Host` und `X-Forwarded-Proto`, und diesen Köpfen
 * glaubt Astro nur, wenn man ihm in `security.allowedDomains` sagt, welche
 * Adressen echt sind. Fehlt die Liste, ist `Astro.url` `http://localhost` –
 * und die eigene Seite gilt als fremde.
 *
 * ── Warum keine der bestehenden Prüfungen das gesehen hat ───────────────
 *
 * Weil keine je ein Formular abgeschickt hat. Der Klickpfad klickt, der
 * Durchgang misst Kästen, die Verweisprüfung folgt Links – alles GET. Und
 * lokal wäre es auch beim Abschicken nicht aufgefallen: Ohne Proxy stimmt
 * die Adresse ja. Der Fehler existiert nur hinter dem Proxy.
 *
 * Deshalb schickt dieses Skript dreimal dasselbe Formular:
 *
 *   1. direkt, wie auf dem eigenen Rechner            → muss durchgehen
 *   2. mit den Köpfen, die der Railway-Proxy setzt    → muss durchgehen
 *   3. von einer fremden Adresse                      → MUSS 403 geben
 *
 * Der dritte Fall ist der wichtigste. Ohne ihn wäre `allowedDomains: [{}]`
 * – alles erlauben – eine bestandene Prüfung, und der Schutz wäre weg,
 * ohne dass es jemand merkt.
 *
 * ── Aufruf ──────────────────────────────────────────────────────────────
 *
 *   npm run build && npm start &
 *   npm run formulare:pruefen
 */

const BASIS = process.env.KLICKPFAD_BASIS || 'http://127.0.0.1:4331';
const OEFFENTLICH = 'web-production-4452b1.up.railway.app';

const befunde = [];
let geprueft = 0;

/**
 * Ein absichtlich unvollständiges Formular: Es passt die Prüfung auf den
 * Absender, scheitert danach aber sofort an der fehlenden Einwilligung.
 *
 * Das ist Absicht. Ein vollständiges würde Google anrufen und Geld kosten,
 * und geprüft werden soll hier nur, ob die Anfrage überhaupt ankommt.
 * Unterschieden wird deshalb 403 (kam nicht an) von allem anderen.
 */
function formular() {
  const f = new FormData();
  f.append('email', 'pruefung@example.org');
  return f;
}

async function pruefe(name, koepfe, erwartet) {
  geprueft++;
  let status;
  try {
    const res = await fetch(`${BASIS}/api/laecheln/`, {
      method: 'POST',
      headers: koepfe,
      body: formular(),
    });
    status = res.status;
  } catch (e) {
    console.log(`  BEFUND  ${name} – ${e.message}`);
    befunde.push(name);
    return;
  }

  const gut = erwartet === 403 ? status === 403 : status !== 403;
  if (gut) {
    console.log(`  ok      ${name} (HTTP ${status})`);
  } else {
    console.log(
      `  BEFUND  ${name} – HTTP ${status}, erwartet ${erwartet === 403 ? '403' : 'irgendetwas außer 403'}`,
    );
    befunde.push(name);
  }
}

console.log('\n[formulare] Absenderprüfung der eigenen Formulare');

await pruefe('direkt vom eigenen Rechner', { Origin: BASIS }, 200);

await pruefe(
  'hinter dem Reverse Proxy (wie auf Railway)',
  {
    Origin: `https://${OEFFENTLICH}`,
    Host: OEFFENTLICH,
    'X-Forwarded-Host': OEFFENTLICH,
    'X-Forwarded-Proto': 'https',
  },
  200,
);

await pruefe(
  'von einer fremden Adresse – muss abgewiesen werden',
  { Origin: 'https://fremde-seite.example' },
  403,
);

console.log(`\n[formulare] ${geprueft} Prüfungen, ${befunde.length} Befunde`);

if (befunde.length) {
  console.error(
    '\n[formulare] ABBRUCH: Entweder wird ein eigenes Formular abgewiesen –\n' +
      '            dann fehlt die Adresse in `security.allowedDomains` in\n' +
      '            astro.config.mjs –, oder eine fremde Seite darf abschicken,\n' +
      '            dann ist die Liste zu weit gefasst.',
  );
  process.exit(1);
}

console.log('[formulare] In Ordnung.');
