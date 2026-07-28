/**
 * Icon-Set aus der echten Wort-Bild-Marke erzeugen.
 *
 * Vorher lag unter /favicon.svg ein Platzhalter: ein oranges Rechteck mit
 * einer „64" in Georgia. Beides stimmte nicht – Georgia ist nicht die
 * Hausschrift, und #e8532e ist keine Markenfarbe. Die offizielle Datei nennt
 * Gelb #FFCC00 für das KU und Hausrot #B71E3F für die 64.
 *
 * apple-touch-icon.png, favicon.ico und die PNG in 192 und 512 fehlten ganz –
 * verlinkt waren sie trotzdem, auf jeder der 362 Seiten. Jeder Aufruf ergab
 * einen 404, und ohne die beiden PNG lässt sich die Seite auf Android nicht
 * installieren.
 *
 * Das Zeichen ist die „64", nicht die vollständige Marke: Bei 16 Pixeln
 * Kantenlänge ist „KU64 Die Zahnspezialisten" ein grauer Fleck. Die 64 trägt
 * die Wiedererkennung und bleibt bis hinunter zur Registerkarte lesbar.
 */
import sharp from 'sharp';
import { writeFile, mkdir } from 'node:fs/promises';

/* Unverändert aus src/components/Logo.astro – nicht nachgezeichnet. */
const PFAD_64 =
  'M149.7,27.5c4.3-1.3,8.7-2,13.1-2s10.8,1.4,14.8,4.1c4,2.7,6,6.1,6,10.1s-1.9,7.2-5.7,9.9c-3.8,2.8-8.6,4.2-14.2,4.2s-13.2-2-18.5-5.9-8.3-8.7-9-14.3c4.7-2.7,9.2-4.8,13.5-6.1h0ZM187.9,9.9c-4.1-3.4-8.2-5.9-12.5-7.5S166.4,0,161.4,0C151.5,0,143.4,2.8,137.2,8.4c-6.2,5.6-9.3,12.8-9.3,21.7s3.4,16.1,10.1,22c6.7,5.9,15.3,8.8,25.7,8.8s15.1-2,20.2-5.9c5.1-3.9,7.7-9.1,7.7-15.4s-2.7-11.2-8.2-15.2c-5.4-4-12.4-6-20.8-6s-8.9.6-13.1,1.7c-4.2,1.1-8.6,2.8-13.2,5.2.9-5.6,3.7-10.1,8.2-13.4s10.3-4.9,17.2-4.9,7.5.7,11.2,2.1c3.7,1.4,7.3,3.4,10.6,6.1l4.4-5.3h0ZM249.5,10.6v27.6h-34.7l34.7-27.6h0ZM257.3,59.5v-14.2h9.7v-7.1h-9.7V1.3h-7.7l-46.4,36.9v7.1h46.4v14.2h7.7';

const HAUSROT = '#B71E3F';

/* Die 64 sitzt im Original bei x 127…267, y 0…59,5. Damit sie mittig in einem
   Quadrat steht, wird sie verschoben und der Rand als Luft gerechnet. */
function svg({ groesse, anteil, radius, grund }) {
  const breite = 140;
  const hoehe = 59.5;
  const skala = (anteil * groesse) / breite;
  const x = (groesse - breite * skala) / 2;
  const y = (groesse - hoehe * skala) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${groesse}" height="${groesse}" viewBox="0 0 ${groesse} ${groesse}">
  <rect width="${groesse}" height="${groesse}" rx="${radius}" fill="${grund}"/>
  <g transform="translate(${x} ${y}) scale(${skala}) translate(-127 0)">
    <path d="${PFAD_64}" fill="#fff"/>
  </g>
</svg>`;
}

/* Ein ICO ist ein Umschlag: sechs Byte Kopf, sechzehn Byte Verzeichnis, dann
   das Bild. Seit Vista darf darin ein PNG stecken – deshalb braucht es keine
   Bitmap-Umrechnung. */
function ico(png, kante) {
  const kopf = Buffer.alloc(6);
  kopf.writeUInt16LE(0, 0);
  kopf.writeUInt16LE(1, 2);
  kopf.writeUInt16LE(1, 4);
  const eintrag = Buffer.alloc(16);
  eintrag[0] = kante >= 256 ? 0 : kante;
  eintrag[1] = kante >= 256 ? 0 : kante;
  eintrag.writeUInt16LE(1, 4);
  eintrag.writeUInt16LE(32, 6);
  eintrag.writeUInt32LE(png.length, 8);
  eintrag.writeUInt32LE(22, 12);
  return Buffer.concat([kopf, eintrag, png]);
}

const png = (o) => sharp(Buffer.from(svg(o))).png({ compressionLevel: 9 }).toBuffer();

await mkdir('public', { recursive: true });

/* Das SVG-Favicon: scharf in jeder Größe, deshalb die bevorzugte Fassung. */
await writeFile(
  'public/favicon.svg',
  svg({ groesse: 64, anteil: 0.72, radius: 14, grund: HAUSROT }) + '\n',
);

await writeFile('public/favicon.ico', ico(await png({ groesse: 32, anteil: 0.78, radius: 6, grund: HAUSROT }), 32));

/* Apple schneidet die Ecken selbst zu und mag keine Transparenz – deshalb
   voller Grund und kein eigener Radius. */
await writeFile('public/apple-touch-icon.png', await png({ groesse: 180, anteil: 0.66, radius: 0, grund: HAUSROT }));

await writeFile('public/icon-192.png', await png({ groesse: 192, anteil: 0.7, radius: 42, grund: HAUSROT }));
await writeFile('public/icon-512.png', await png({ groesse: 512, anteil: 0.7, radius: 112, grund: HAUSROT }));

/* Maskierbar: Android beschneidet bis zu 20 Prozent am Rand. Das Zeichen darf
   deshalb nur den inneren Kreis füllen, sonst wird die 64 angeschnitten. */
await writeFile('public/icon-maskable-512.png', await png({ groesse: 512, anteil: 0.5, radius: 0, grund: HAUSROT }));

console.log('[icons] favicon.svg, favicon.ico, apple-touch-icon.png, icon-192, icon-512, icon-maskable-512');
