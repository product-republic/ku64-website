/**
 * robots.txt.
 *
 * Bewusst offen für KI-Crawler: Wenn Patientinnen und Patienten ihre Fragen
 * zunehmend in KI-Suchen stellen, ist ein Ausschluss dieser Bots
 * gleichbedeutend mit Unsichtbarkeit. Ausgeschlossen werden nur interne
 * Endpunkte, die für niemanden nützlich sind.
 *
 * ── Warum die Sperren in JEDER Gruppe stehen ────────────────────────────
 *
 * Weil sie vorher nur in der ersten standen, und das war ein Fehler mit
 * genau der Wirkung, die niemand wollte.
 *
 * Ein Crawler wertet nach der Spezifikation NUR die Gruppe aus, die ihn am
 * genauesten anspricht – und ausschließlich diese. Er erbt nichts aus
 * `User-agent: *`. Die acht Gruppen darunter enthielten nur `Allow: /`;
 * damit war GPTBot, ClaudeBot, PerplexityBot und den übrigen ausdrücklich
 * alles erlaubt, was allen anderen verboten ist: `/api/` und die drei
 * Parameterformen des Vorgängersystems.
 *
 * Gefunden bei der Durchsicht vor dem Livegang. Schaden ist keiner
 * entstanden – hinter den Adressen liegt nichts Interessantes –, aber die
 * Datei sagte das Gegenteil dessen, was ihr eigener Kommentar behauptete.
 *
 * Die Sperren stehen deshalb jetzt in einer Konstante und werden in jede
 * Gruppe geschrieben. Eine Liste, die an neun Stellen abgetippt wird, läuft
 * auseinander; eine, die einmal steht und neunmal eingesetzt wird, kann es
 * nicht.
 */

import type { APIRoute } from 'astro';

/**
 * Was kein Crawler holen soll – für alle Gruppen gleich.
 *
 * `/api/` sind interne Endpunkte. Die drei Parameterformen stammen aus dem
 * Vorgängersystem; dieselben Inhalte liegen längst unter sprechenden
 * Adressen, und beide Formen im Index wären eine Doppelung, die sich die
 * Website selbst macht.
 */
const SPERREN = ['/api/', '/*?id=', '/*?tx_', '/*&cHash='];

/**
 * KI-Crawler, die ausdrücklich willkommen sind.
 *
 * Sie stehen einzeln und nicht unter `*`, weil einige von ihnen sich sonst
 * vorsichtshalber zurückhalten: Für manche dieser Bots ist ein fehlender
 * eigener Eintrag ein Grund, gar nicht erst zu crawlen.
 */
const KI_CRAWLER = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
];

const gruppe = (name: string) =>
  [`User-agent: ${name}`, 'Allow: /', ...SPERREN.map((s) => `Disallow: ${s}`)].join('\n');

export const GET: APIRoute = ({ site }) => {
  const basis = (site ?? new URL('https://ku64.de')).origin;

  const text = `# KU64 – Die Zahnspezialisten
#
# Gesperrt sind interne Endpunkte und die Parameteradressen des
# Vorgängersystems. Die Sperren stehen in jeder Gruppe, weil eine Gruppe
# nichts von "User-agent: *" erbt – was hier fehlt, ist erlaubt.

${gruppe('*')}

# KI-Crawler sind ausdrücklich willkommen, mit denselben Sperren wie alle.
${KI_CRAWLER.map(gruppe).join('\n\n')}

Sitemap: ${basis}/sitemap-index.xml

# Kompakte Fassung für Sprachmodelle:
# ${basis}/llms.txt
# ${basis}/llms-full.txt
`;

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
