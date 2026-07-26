/**
 * robots.txt.
 *
 * Bewusst offen für KI-Crawler: Wenn Patientinnen und Patienten ihre Fragen
 * zunehmend in KI-Suchen stellen, ist ein Ausschluss dieser Bots
 * gleichbedeutend mit Unsichtbarkeit. Ausgeschlossen werden nur interne
 * Endpunkte, die für niemanden nützlich sind.
 */

import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const basis = (site ?? new URL('https://ku64.de')).origin;

  const text = `# KU64 – Die Zahnspezialisten

User-agent: *
Allow: /
Disallow: /api/

# Alte Parameter-URLs des Vorgängersystems nicht mehr indexieren –
# die Inhalte liegen jetzt unter sprechenden Adressen.
Disallow: /*?id=
Disallow: /*?tx_
Disallow: /*&cHash=

# KI-Crawler sind ausdrücklich willkommen.
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${basis}/sitemap-index.xml

# Kompakte Fassung für Sprachmodelle:
# ${basis}/llms.txt
# ${basis}/llms-full.txt
`;

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
