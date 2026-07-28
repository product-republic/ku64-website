/**
 * RSS-Feed des Blogs.
 *
 * Die alte Website hatte unter /feed/ einen Feed; die neue hatte trotz
 * dreißig Beiträgen keinen. Wer ihn abonniert hatte, bekam nach dem Relaunch
 * nichts mehr – ohne Fehlermeldung, einfach Stille.
 *
 * /feed/ leitet inzwischen auf den Blog. Der eigentliche Feed steht hier.
 */
import type { APIRoute } from 'astro';
import BEITRAEGE from '../data/blog.json';

const BASIS = process.env.PUBLIC_SITE_URL || 'https://ku64.de';

/* Fünf Zeichen, die in XML nicht roh stehen dürfen. Ohne das Entschärfen
   zerlegt ein einziges Kaufmanns-Und im Titel den ganzen Feed. */
function xml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = () => {
  const beitraege = [...BEITRAEGE].sort(
    (a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime(),
  );

  const eintraege = beitraege
    .map((b) => {
      const adresse = `${BASIS}/blog/${b.slug}/`;
      return `    <item>
      <title>${xml(b.titel)}</title>
      <link>${adresse}</link>
      <guid isPermaLink="true">${adresse}</guid>
      <pubDate>${new Date(b.datum).toUTCString()}</pubDate>
      <description>${xml(b.anriss ?? '')}</description>
    </item>`;
    })
    .join('\n');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>KU64 – Die Zahnspezialisten</title>
    <link>${BASIS}/blog/</link>
    <description>Beiträge zu Leistungen, Vorsorge und dem Alltag bei KU64 in Berlin und Potsdam.</description>
    <language>de-DE</language>
    <atom:link href="${BASIS}/rss.xml" rel="self" type="application/rss+xml" />
${eintraege}
  </channel>
</rss>
`;

  return new Response(feed, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
