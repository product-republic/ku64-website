/**
 * Kennzeichnung KI-erzeugter Bilder.
 *
 * Hintergrund: Die Lächeln-Vorschau nimmt das Porträt eines echten Menschen
 * und verändert es. Damit ist das Ergebnis das, was Artikel 3 Nummer 60 der
 * KI-Verordnung (EU 2024/1689) einen "Deepfake" nennt – unabhängig davon, wie
 * wohlmeinend der Zweck ist. Artikel 50 verlangt dafür zweierlei, und beides
 * wird hier erledigt:
 *
 *   Absatz 4 – für Menschen sichtbar: Wer das Bild sieht, muss erkennen, dass
 *   es erzeugt wurde. Die Angabe muss die Darstellung begleiten, nicht
 *   irgendwo auf einer Seite stehen. Denn das Bild verlässt die Seite: Es geht
 *   per E-Mail hinaus, wird weitergeleitet, gespeichert, gezeigt. Ein Hinweis,
 *   der nur im Browser stand, ist dann längst weg.
 *
 *   Absatz 2 – maschinenlesbar: in der Datei selbst, damit Plattformen und
 *   Prüfwerkzeuge die Herkunft auch ohne den sichtbaren Streifen erkennen.
 *   Dafür gibt es einen anerkannten Standard, den IPTC-Wert
 *   "trainedAlgorithmicMedia" – kein selbst erfundenes Feld.
 *
 * Der sichtbare Hinweis steht in einem ANGESETZTEN Streifen, nicht über dem
 * Bild. Ein Kasten im Bild verdeckt einen Teil des Gesichts, und genau der
 * wäre der Teil, den jemand wegschneidet.
 *
 * Wenn die Kennzeichnung nicht gelingt, wird kein Bild ausgeliefert. Ein
 * unmarkiertes Deepfake herauszugeben wäre der schlechtere Ausgang – auch
 * dann, wenn der Fehler nur eine fehlende Schrift im Container ist.
 */

import sharp from 'sharp';

/**
 * Der von der IPTC gepflegte Wert für "vollständig durch ein trainiertes
 * Modell erzeugt oder verändert". Genau diesen Bezeichner werten Plattformen
 * aus – eine eigene Formulierung wäre wirkungslos.
 */
const IPTC_QUELLE = 'http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia';

export interface Kennzeichnungstexte {
  /** Kurz und unmissverständlich, z. B. "KI-generiertes Bild". */
  marke: string;
  /** Zusatz in einer Zeile, z. B. "Illustration, kein Behandlungsergebnis". */
  zusatz: string;
  /** Für die Bildbeschreibung in den Metadaten. */
  beschreibung: string;
}

export async function bildKennzeichnen(
  bild: Buffer,
  texte: Kennzeichnungstexte,
  erzeugtVon: string,
): Promise<Buffer> {
  const { width, height } = await sharp(bild).metadata();
  if (!width || !height) {
    throw new Error('[kennzeichnung] Bildmaße nicht lesbar – Kennzeichnung nicht möglich.');
  }

  /* Streifenhöhe an der Bildbreite ausrichten, damit der Hinweis auf einem
     kleinen wie auf einem großen Bild gleich gut lesbar ist. */
  const streifen = Math.max(48, Math.round(width * 0.075));
  const schriftMarke = Math.round(streifen * 0.34);
  const schriftZusatz = Math.round(streifen * 0.26);

  const beschriftung = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${streifen}">
       <rect width="${width}" height="${streifen}" fill="#14100e"/>
       <circle cx="${streifen * 0.42}" cy="${streifen * 0.5}" r="${streifen * 0.13}" fill="#e8532e"/>
       <text x="${streifen * 0.72}" y="${streifen * 0.44}" font-family="Inter, DejaVu Sans, sans-serif"
             font-size="${schriftMarke}" font-weight="700" fill="#ffffff"
             dominant-baseline="middle">${maskieren(texte.marke)}</text>
       <text x="${streifen * 0.72}" y="${streifen * 0.74}" font-family="Inter, DejaVu Sans, sans-serif"
             font-size="${schriftZusatz}" fill="#c4bab2"
             dominant-baseline="middle">${maskieren(texte.zusatz)}</text>
     </svg>`,
  );

  const mitStreifen = await sharp(bild)
    .extend({ bottom: streifen, background: '#14100e' })
    .composite([{ input: beschriftung, top: height, left: 0 }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  await streifenPruefen(mitStreifen, width, height, streifen);

  /* Erst jetzt die Metadaten schreiben: Ein weiterer sharp-Durchlauf würde
     sie sonst wieder verwerfen. */
  return sharp(mitStreifen)
    .withXmp(xmpPaket(texte.beschreibung, erzeugtVon))
    .withExif({
      IFD0: {
        ImageDescription: `${texte.marke} – ${texte.beschreibung}`,
        Software: erzeugtVon,
        Copyright: 'KU64 – Die Zahnspezialisten',
      },
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/**
 * Prüft, ob im Streifen tatsächlich etwas steht.
 *
 * Ohne diese Prüfung ist der häufigste Fehler unsichtbar: Fehlt im Container
 * eine Schrift, rendert librsvg den Text klaglos als nichts. Herausgehen würde
 * dann ein verändertes Porträt mit einem schwarzen Balken darunter – und
 * niemand bemerkte, dass die Kennzeichnung fehlt. Deshalb wird gemessen statt
 * vertraut: Ein Streifen mit Text streut, eine leere Fläche nicht.
 */
async function streifenPruefen(bild: Buffer, breite: number, hoehe: number, streifen: number) {
  const werte = await sharp(bild)
    .extract({ left: 0, top: hoehe, width: breite, height: streifen })
    .stats();

  const streuung = werte.channels.reduce((summe, k) => summe + k.stdev, 0);
  if (streuung < 8) {
    throw new Error(
      `[kennzeichnung] Der Hinweisstreifen ist leer (Streuung ${streuung.toFixed(1)}). ` +
        'Vermutlich fehlt im Container eine Schrift. Es wird bewusst kein ' +
        'unmarkiertes Bild ausgeliefert.',
    );
  }
}

function xmpPaket(beschreibung: string, erzeugtVon: string): string {
  return `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about=""
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:xmp="http://ns.adobe.com/xap/1.0/"
      xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/">
      <Iptc4xmpExt:DigitalSourceType>${maskieren(IPTC_QUELLE)}</Iptc4xmpExt:DigitalSourceType>
      <xmp:CreatorTool>${maskieren(erzeugtVon)}</xmp:CreatorTool>
      <dc:description>
        <rdf:Alt><rdf:li xml:lang="x-default">${maskieren(beschreibung)}</rdf:li></rdf:Alt>
      </dc:description>
      <dc:creator>
        <rdf:Seq><rdf:li>KU64 – Die Zahnspezialisten</rdf:li></rdf:Seq>
      </dc:creator>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
}

/** Text für XML sicher machen – ein Apostroph im Hinweis darf nichts zerlegen. */
function maskieren(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
