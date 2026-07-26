# Bildregel

**Es soll kein Stock-Foto mehr zu sehen sein.** Selbst erzeugte Bilder sind
willkommen, wenn sie einen direkten Bezug haben – sonst lieber gar kein Bild.

Diese Regel steht nicht nur hier, sondern ist an drei Stellen im Projekt
durchgesetzt.

---

## 1. Aktueller Stand

**Die Website enthält null Stock-Fotos und aktuell überhaupt keine Fotografie.**

Das ist kein Versehen. Es liegen keine echten Praxisaufnahmen vor, und statt die
Lücke mit Füllmaterial zu schließen, arbeitet das Layout mit Typografie,
Farbflächen und Inline-SVG. Die Seiten funktionieren so – sie wirken nicht
„unfertig ohne Bild“.

Bildhafte Elemente, die es gibt:

| Element | Herkunft | Bezug |
|---|---|---|
| Vorschaubilder für Social Media (150 Stück) | selbst erzeugt, rein typografisch | zeigen echte Standortdaten der jeweiligen Seite |
| Piktogramme, Pfeile, Haken | Inline-SVG, selbst gezeichnet | funktional |
| Standort-Akzentfarben | Design-Tokens | Unterscheidung der Standorte |
| Foto in der Lächeln-Vorschau | **Foto der Person selbst** | ihr eigenes Bild, auf Einwilligung |

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

### Hohe Priorität

| Wo | Was | Warum |
|---|---|---|
| Standort-Startseiten (4×) | Außenansicht mit erkennbarem Eingang | Wiedererkennung beim Ankommen — besonders Potsdam im Palais Ritz |
| Standort-Startseiten (4×) | Empfang / Wartebereich | Erste Frage von Angstpatienten: „Wie sieht es da aus?“ |
| Teamseiten (4×) | Porträts der Behandelnden | Ohne echte Gesichter bleibt die Seite leer — siehe `src/data/team.ts` |
| Startseite | ein Motiv je Standort für die Standortkarten | Vier Standorte visuell unterscheidbar machen |

### Mittlere Priorität

| Wo | Was |
|---|---|
| Praxisseiten | Behandlungszimmer, Prophylaxe-Bereich, Meisterlabor |
| Angstfreie Behandlung | Ruheraum, Sedierungsplatz |
| Kinderzahnheilkunde | Kinderbereich (nur mit Einwilligung der Eltern) |
| Anfahrtsseiten | Eingangssituation, Parkmöglichkeit |

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
