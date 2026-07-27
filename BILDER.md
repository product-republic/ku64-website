# Bildregel

**Es soll kein Stock-Foto mehr zu sehen sein.** Selbst erzeugte Bilder sind
willkommen, wenn sie einen direkten Bezug haben – sonst lieber gar kein Bild.

Diese Regel steht nicht nur hier, sondern ist an drei Stellen im Projekt
durchgesetzt.

---

## 1. Aktueller Stand

**Die Website enthält null Stock-Fotos – und seit dem 26. Juli echte Fotografie.**

Der frühere Zustand („überhaupt keine Fotografie“) hatte einen Grund, der weggefallen
ist: ku64.de war nicht abrufbar. Jetzt ist es das, und der eigene Bestand der Praxis
liegt vor.

| Element | Anzahl | Herkunft |
|---|---:|---|
| Praxisaufnahmen | 14 | eigene Aufnahmen der Praxis, aus ku64.de übernommen |
| Kopfvideos je Standort | 3 | dieselbe Quelle, neu komprimiert |
| Porträts des Teams | 100 | Teamübersicht des Kunden |
| Vorschaubilder für Social Media | 150 | selbst erzeugt, rein typografisch |
| Piktogramme, Pfeile, Haken | – | Inline-SVG, selbst gezeichnet |
| Foto in der Lächeln-Vorschau | – | **Foto der Person selbst**, auf Einwilligung |

Die Übernahme ist nachvollziehbar und wiederholbar:

```bash
node analyse/altbestand/medien-holen.mjs --laden   # Bestand erfassen und laden
node analyse/altbestand/team-holen.mjs             # Teamübersicht auswerten
node analyse/altbestand/medien-auswahl.mjs         # Auswahl übernehmen und rechnen
```

**Drei Dateien wurden dabei aussortiert, obwohl ihr Name das Gegenteil sagt:** Zwei
hießen `dentallabor…` und zeigten ein Stock-Motiv (ein Tablet mit dem Porträt einer
lächelnden Frau), eine hieß `…palais-ritz` und war der Bildschirmabzug eines
Zeitungsartikels. Der Dateiname ist kein Nachweis. Jedes Bild wurde angesehen.

---

## 2. Die drei zulässigen Fälle

### `praxis` — echte Aufnahme
Eine reale Aufnahme aus einer KU64-Praxis, vom echten Team oder aus einer echten
Behandlungssituation. Braucht Urheber und, sobald Menschen erkennbar sind, deren
Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 22 KunstUrhG).

### `generiert` — selbst erzeugt mit direktem Bezug
Zulässig für **Schematisches und Typografisches**: Ablaufdiagramme,
Vorschaubilder mit echten Daten, abstrakte Muster.

### Kein Bild — der Normalfall
Wenn weder 1 noch 2 zutrifft. Eine gute Textseite ohne Bild schlägt eine mit
beliebigem Füllmaterial.

---

## 3. Was ausdrücklich nicht geht

**Ein generiertes Bild darf keinen real existierenden Ort und keinen real
existierenden Menschen darstellen.**

Das ist die wichtigste Grenze, und sie ist strenger als „kein Stock“. Ein
KI-erzeugtes Bild „Empfangsbereich KU64 Potsdam“ wäre **schlimmer** als ein
Stock-Foto: Das Stock-Foto behauptet nicht, diese Praxis zu sein — das
generierte schon. Wer danach in die echte Praxis kommt, findet einen anderen
Raum vor. Dasselbe gilt für Teamfotos: Ein erfundenes Gesicht mit einem echten
Namen darunter ist eine Falschangabe über eine reale Person.

Für **Praxisräume und Team gibt es deshalb genau einen zulässigen Weg: echte
Aufnahmen.**

Ebenfalls unzulässig: erzeugte Vorher-Nachher-Darstellungen als Werbemotiv
(§ 11 HWG). Die Lächeln-Vorschau ist davon nicht berührt — dort entsteht das
Bild aus dem eigenen Foto der Person, auf ihre ausdrückliche Einwilligung, und
ist als unverbindliche Illustration gekennzeichnet.

---

## 4. Wie die Regel durchgesetzt wird

**Im Typsystem** (`src/lib/bilder.ts`): Es gibt keine Herkunft „Stock“. Jedes
Bild muss `alt`, `bezug`, `herkunft` und `urheber` angeben.

**Beim Rendern** (`src/components/Bild.astro`): Fehlt der Nachweis, wird
*nichts* gerendert — kein Platzhalter, kein graues Kästchen. In der Entwicklung
erscheint ein Hinweis, in Produktion bleibt die Stelle leer.

**Beim Build** (`scripts/bilder-pruefen.mjs`): Läuft nach jedem Build gegen das
fertige HTML und **bricht ab** bei Stock-Anbietern, fremden Bildservern,
fehlenden Alternativtexten oder nicht existierenden Bilddateien.

```
[bilder] 193 Seiten geprüft – keine Stock-Fotos, keine fremden Bildquellen,
         keine fehlenden Bilder.
```

Ein Rückfall in Stock-Material ist damit ein Build-Fehler, keine
Geschmacksfrage.

---

## 5. Welche echten Aufnahmen gebraucht werden

Nach Wirkung sortiert. Alles hiervon ist **nur mit echten Fotos** zu füllen.

### Erledigt

| Wo | Was | Stand |
|---|---|---|
| Standort-Startseiten | Kopfmedium je Standort | Video für Kudamm, Mitte, Potsdam; Foto für Wilmersdorf |
| Startseite | ein Motiv je Standort | vier Karten, vier Räume |
| Praxisseiten | Bildstrecke der Räume | 5 (Kudamm), 3 (Mitte), 2 (Potsdam), 1 (Wilmersdorf) |
| Teamseiten | Porträts der Behandelnden | 100 Porträts |

### Was jetzt noch fehlt

| Wo | Was | Warum es zählt |
|---|---|---|
| Kurfürstendamm | Außenansicht mit Eingang | Der Bestand enthält keine – nur Innenaufnahmen |
| Potsdam | Außenansicht Palais Ritz | Die einzige gefundene Datei war ein Zeitungs-Screenshot, also unbrauchbar |
| Wilmersdorf | Empfang, Behandlungszimmer, Team | Von diesem Standort gibt es genau ein Bild, die Außenansicht |
| Angstfreie Behandlung | Ruheraum, Sedierungsplatz | Die Seite spricht Menschen mit Angst an und zeigt ihnen bisher nichts |
| Kinderzahnheilkunde | Kinderbereich | nur mit Einwilligung der Eltern |
| Anfahrtsseiten | Eingangssituation, Parkmöglichkeit | die letzten fünfzig Meter sind die schwierigsten |

Für Wilmersdorf ist das die auffälligste Lücke: Ein Standort mit einer einzigen
Außenansicht und ohne Teamangaben wirkt neben den anderen dreien unfertig – und er ist
der jüngste, also der, bei dem Wiedererkennung am meisten hilft.

### Kann generiert werden

| Wo | Was | Warum zulässig |
|---|---|---|
| Behandlungsseiten | schematische Ablaufdiagramme | zeigen einen Vorgang, keinen realen Ort |
| Leistungsübersichten | abstrakte Kategorie-Motive | rein grafisch, ohne Realitätsbehauptung |
| Vorschaubilder | bereits umgesetzt | zeigen echte Daten |

---

## 6. Ein Bild einbauen

1. Datei nach `public/praxis/` legen, sprechender Name.
2. Eintrag in `BILDER` in `src/lib/bilder.ts` ergänzen:

```ts
'potsdam-empfang': {
  pfad: '/praxis/potsdam-empfang.jpg',
  alt: 'Empfangstresen aus hellem Holz, dahinter zwei Mitarbeiterinnen',
  herkunft: 'praxis',
  bezug: 'Zeigt den tatsächlichen Empfang von KU64 Potsdam.',
  urheber: 'Fotograf, Aufnahme 2026',
  einwilligungVorhanden: true,
  breite: 1600,
  hoehe: 1067,
},
```

3. Im Template einsetzen:

```astro
<Bild schluessel="potsdam-empfang" erwartet="Empfang KU64 Potsdam" />
```

Fehlt ein Pflichtfeld, erscheint das Bild nicht — bewusst.

### Technische Anforderungen

- Querformat mindestens 1600 px breit, Porträts mindestens 800 × 800 px
- Als JPEG oder PNG ablegen; die Umwandlung nach AVIF/WebP macht der Build
- Keine eingebrannten Wasserzeichen, keine Logos Dritter
- Bei erkennbaren Personen: schriftliche Einwilligung, bevor die Datei ins Repo geht
