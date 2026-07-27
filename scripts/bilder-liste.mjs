#!/usr/bin/env node
/**
 * Schreibt BILDER-BEDARF.md – die Liste zum Weitergeben.
 *
 * ── Warum erzeugt und nicht geschrieben ────────────────────────────────
 *
 * Weil eine von Hand gepflegte Bedarfsliste in dem Moment veraltet, in dem
 * ein Foto ankommt – und niemand merkt es. Diese hier liest zwei Quellen:
 * `src/data/bildbedarf.ts` (was gebraucht wird) und `src/lib/bilder.ts` (was
 * da ist). Was in beiden steht, ist erledigt und verschwindet aus der Liste.
 *
 * Wer ein Foto einbaut, muss also nichts abhaken. Das Abhaken ist der
 * Einbau.
 *
 * ── Aufruf ─────────────────────────────────────────────────────────────
 *
 *   npm run bilder:liste
 */

import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { BILDBEDARF } from '../src/data/bildbedarf.ts';
import { BILDER } from '../src/lib/bilder.ts';

const WURZEL = path.resolve(import.meta.dirname, '..');

const vorhanden = new Set(Object.keys(BILDER));
const offen = BILDBEDARF.filter((b) => !vorhanden.has(b.schluessel));
const erledigt = BILDBEDARF.filter((b) => vorhanden.has(b.schluessel));

const RANG = { hoch: 0, mittel: 1, niedrig: 2 };
offen.sort((a, b) => RANG[a.dringlich] - RANG[b.dringlich]);

const FORMATE = {
  quer: 'Querformat (etwa 16:10)',
  hoch: 'Hochformat (etwa 3:4)',
  quadrat: 'Quadratisch',
};

function tabelle(liste) {
  const zeilen = [
    '| Nr. | Dateiname | Was zu sehen sein soll | Wo es erscheint | Format |',
    '|---:|---|---|---|---|',
  ];
  liste.forEach((b, i) => {
    let motiv = b.hinweis ? `${b.motiv}<br>**Hinweis:** ${b.hinweis}` : b.motiv;
    /* Vorläufig belegte Stellen bleiben in der Liste – sonst verschwindet
       die Anforderung still und „vorläufig" wird endgültig. */
    if (b.vorlaeufig) {
      motiv += `<br>_Vorläufig steht dort \`${b.vorlaeufig}\` – ein echtes, aber anderes Motiv._`;
    }
    zeilen.push(
      `| ${i + 1} | \`${b.schluessel}.jpg\` | ${motiv} | ${b.wo} | ${FORMATE[b.format]} |`,
    );
  });
  return zeilen.join('\n');
}

const nachDringlichkeit = {
  hoch: offen.filter((b) => b.dringlich === 'hoch'),
  mittel: offen.filter((b) => b.dringlich === 'mittel'),
  niedrig: offen.filter((b) => b.dringlich === 'niedrig'),
};

const text = `# Welche Fotos noch fehlen

> **Diese Datei wird erzeugt.** Nicht von Hand ändern – die Quelle ist
> \`src/data/bildbedarf.ts\`. Neu schreiben mit \`npm run bilder:liste\`.

## Die eine Regel

**Echte Aufnahmen aus den eigenen Praxen. Keine Stock-Fotos, auch nicht als
Übergang.** Ein Stock-Foto einer fremden Praxis auf der Seite einer echten
ist eine Aussage über die echte, und zwar keine gute. Solange ein Foto
fehlt, steht auf der Website ein sichtbarer Platzhalter mit der
Bildbeschreibung darin – das ist der ehrlichere Zustand.

## So kommen die Bilder ins Projekt

1. Ins Google Drive laden, **unter dem Dateinamen aus der Tabelle**.
2. Bescheid geben – der Einbau erzeugt daraus automatisch die Fassungen für
   AVIF, WebP und JPEG in zwei Breiten.
3. Der Platzhalter verschwindet, das Foto erscheint, und diese Liste wird um
   eine Zeile kürzer.

Was zu jedem Bild gebraucht wird: **wer es aufgenommen hat** (für den
Bildnachweis) und, wenn Menschen erkennbar sind, **deren Einwilligung**.
Ohne beides wird es nicht eingebaut – das ist im Bildwächter durchgesetzt
und keine Formsache.

---

## Zuerst: ${nachDringlichkeit.hoch.length} Aufnahmen

Diese hängen an vielen Seiten oder an Seiten, auf denen viel entschieden
wird.

${tabelle(nachDringlichkeit.hoch)}

---

## Danach: ${nachDringlichkeit.mittel.length} Aufnahmen

${tabelle(nachDringlichkeit.mittel)}

---

## Wenn es sich ergibt: ${nachDringlichkeit.niedrig.length} Aufnahmen

${tabelle(nachDringlichkeit.niedrig)}

---

## Was schon da ist

${erledigt.length} von ${BILDBEDARF.length} angemeldeten Motiven liegen vor.
Dazu kommen ${
  Object.keys(BILDER).length - erledigt.length
} weitere Aufnahmen, die bereits im Bildverzeichnis stehen – darunter alle
Porträts des Teams und die Räume am Kurfürstendamm.

${
  erledigt.length
    ? erledigt.map((b) => `- \`${b.schluessel}\` – ${b.motiv}`).join('\n')
    : '_Noch keines._'
}

---

## Aufnahmehinweise, die für alle gelten

**Menschen im Bild sind besser als leere Räume** – aber nur mit
Einwilligung. Wo sie nicht vorliegt, lieber der Raum ohne Personen als ein
gestelltes Bild mit Statisten.

**Keine Nahaufnahmen im Mund.** Wer auf einer Zahnarztseite liest, ist oft
angespannt; ein Befundfoto verstärkt das. Gezeigt wird die Situation, nicht
der Zahn.

**Querformat, mindestens 2400 Pixel breit.** Beschnitten wird beim Einbau,
vergrößert werden kann nichts.

**Hochkant nur bei Porträts.** Alle anderen Stellen der Website sind quer
angelegt, und ein hochkantiges Foto in einer queren Fläche verliert oben und
unten das Wesentliche.
`;

await writeFile(path.join(WURZEL, 'BILDER-BEDARF.md'), text);

console.log(
  `[bilder-liste] ${offen.length} offen (${nachDringlichkeit.hoch.length} dringend), ` +
    `${erledigt.length} von ${BILDBEDARF.length} vorhanden`,
);
console.log('[bilder-liste] → BILDER-BEDARF.md');
