# KU64 – Website

Neubau der Website von KU64 – Die Zahnspezialisten mit **standortscharfer
Informationsarchitektur**. Die vollständige Analyse des Altbestands und die
Begründung der Struktur stehen in [ANALYSE.md](./ANALYSE.md).

## Das Kernproblem, das dieser Umbau löst

Auf der alten Website lagen Behandlungen standortübergreifend unter
`/leistungen/…`. Wer über `/potsdam/` einstieg und auf eine Behandlung klickte,
las danach eine Seite ohne jeden Ortsbezug — ohne Adresse, ohne Telefonnummer,
ohne die richtige Terminbuchung.

Hier gehört **jede Behandlungsseite zu genau einem Standort**:

```
/potsdam/leistungen/zahnimplantate/     ← Adresse, Telefon, Sprechzeiten, Termine von Potsdam
```

Gibt es eine Behandlung an einem Standort nicht, wird das offen ausgewiesen und
gezielt dorthin verlinkt, wo es sie gibt — statt stillschweigend den Standort zu
wechseln.

## Entwicklung

```bash
npm install
npm run dev        # http://localhost:4321
npm run build
npm start          # gebaute Fassung lokal starten
```

## Wo was liegt

| Datei | Zweck |
|---|---|
| `src/data/standorte.ts` | Alle Standortdaten — einzige Quelle |
| `src/data/leistungen.ts` | Leistungskatalog inkl. **Verfügbarkeit je Standort** |
| `src/data/team.ts` | Team — bewusst leer, siehe Kommentar in der Datei |
| `src/lib/seo.ts` | Titel, Descriptions, Canonicals, JSON-LD |
| `src/lib/wissen.ts` | Wissensbasis des Chatbots, aus denselben Daten erzeugt |
| `src/pages/api/` | Chat, Lächeln-Vorschau, Sprach-Token |
| `src/i18n/sprachen.ts` | Sprachregister — einzige Quelle, welche Sprachen es gibt |
| `src/i18n/texte.ts` | Oberflächentexte auf Deutsch (Quellfassung) |
| `src/inhalte/<code>.json` | Übersetzungskataloge, eingecheckt und gegenlesbar |
| `src/middleware.ts` | Biegt interne Links auf die Sprache der Seite um |

**Eine Leistung an einem Standort ergänzen oder entfernen:** Feld `verfuegbar` in
`src/data/leistungen.ts` ändern. Seiten, interne Verlinkung, Vergleichstabelle,
Sitemap, `llms.txt` und die Chatbot-Antworten ziehen automatisch nach.

## Gestaltung

Die Entwürfe zeigen durchgehend dasselbe: helle, gläserne Flächen, große Radien, und als
Hauptschaltfläche eine **fast schwarze Pille** – keine gelbe Fläche. Danach ist die
Oberfläche gebaut.

| Regel | Wo sie steht |
|---|---|
| Gelb trägt keine Schaltfläche, keine Karte, kein Band | `--knopf-flaeche` in `src/styles/tokens.css` |
| Hauptschaltfläche dunkel, auf Bild und Video hell (`.knopf-hell`) | `src/styles/global.css` |
| Wo Schrift auf Glas liegt, gilt Lesbarkeit vor Durchsicht (`.glas-lesbar`) | `--glas-text-*` in `tokens.css` |
| Schrift auf Bild oder Video liegt auf einem Schleier (`.auf-medium`) | `--schleier-auf-medium` |
| Fokusring dunkel mit heller Aura – nicht gelb (1,5:1 wäre zu schwach) | `:focus-visible` |
| Wortmarke: „KU“ und „64“ in Hausrot, Zusatz schwarz; auf dunklem Grund „KU“ weiß | `src/components/Logo.astro` |

Gelb ist damit nicht verschwunden, sondern hat seinen Platz gewechselt: Es liegt im
Lichtschein hinter dem Glas – und in den Praxisaufnahmen selbst, denn der Kurfürstendamm
ist innen gelb.

**Zwei Prüfungen dafür, weil man beides im Quelltext nicht sieht:**

```bash
npm run layout:pruefen     # seitlicher Überlauf und Text ohne Untergrund, 14 Seiten × 3 Breiten
npm run ansichten          # Bildschirmfotos zum Ansehen, nach ansichten/
```

Beide brauchen einen laufenden Server (`npm run dev`).

## Bilder und Medien

Alles Bildmaterial stammt aus dem Bestand der Praxis; die Regel dazu steht in
[BILDER.md](./BILDER.md) und wird im Build erzwungen. Die Übernahme aus der alten Website
ist wiederholbar:

```bash
node analyse/altbestand/medien-holen.mjs --laden   # Bestand erfassen, Originale laden
node analyse/altbestand/team-holen.mjs             # Teamübersicht auswerten
node analyse/altbestand/medien-auswahl.mjs         # Auswahl übernehmen, Videos komprimieren
```

Die Auswahl selbst – welches Motiv wohin gehört – steht als Liste in
`medien-auswahl.mjs`. Sie ist bewusst kurz: 14 von 536 gefundenen Motiven.

## Adressen des Altbestands

Jede Adresse, die Google von der alten Website kennt, muss ankommen. Die Regeln stehen
als Daten in `src/data/weiterleitungen.ts` und werden vom Server als 301 ausgeliefert.

```bash
npm run weiterleitungen:planen   # Vorschlag aus Altbestand + Teamdaten neu berechnen
npm run urls:abgleichen          # Ergebnis prüfen (läuft im Build mit)
```

Der Build bricht ab, sobald eine bekannte Adresse ins Leere läuft. Ausgenommen sind
Blog- und Fachbeitragsadressen: Für sie gibt es keinen Ersatzinhalt, und eine
Weiterleitung auf eine unpassende Seite wäre schlechter als eine ehrliche 404.

## Sprachen

Deutsch ist Quellsprache und liegt ohne Präfix unter der Wurzel — deshalb muss
zum Relaunch keine deutsche Adresse umgeleitet werden. Jede weitere Sprache
bekommt ein Präfix (`/en/`, `/fr/`).

```bash
npm run sprachen:pruefen              # Rückstand anzeigen (läuft im Build mit)
npm run sprachen:sync                 # Fehlendes und Veraltetes übersetzen
npm run sprachen:sync -- --trocken    # nur zeigen, was zu tun wäre
```

Jeder Katalogeintrag trägt den Fingerabdruck des deutschen Textes, aus dem er
entstand. Ändert sich das Original, gilt die Übersetzung als **veraltet** statt
stillschweigend weiterzulaufen.

Eine Sprache gilt als **freigegeben**, wenn sie vollständig übersetzt und
redaktionell geprüft ist (Feld `freigegeben` im Register). Erst dann wird sie
indexiert, in `hreflang` angeboten, in die Sitemap aufgenommen und als Ziel der
automatischen Browsererkennung verwendet. Vorher wird sie gebaut und ist über
den Sprachwähler erreichbar, trägt aber `noindex` — so lässt sich die
Übersetzung im fertigen Layout gegenlesen, ohne dass eine halbfertige Seite in
die Suchergebnisse gerät. Sobald `freigegeben: true` steht, bricht **jede**
Lücke den Build ab.

**Eine Sprache aufnehmen:** Eintrag in `src/i18n/sprachen.ts` ergänzen, leere
`src/inhalte/<code>.json` anlegen, `npm run sprachen:sync` laufen lassen. Routen,
hreflang, Sitemap und Sprachwähler ziehen automatisch nach.

## Konfiguration

Alle Schlüssel sind optional. Fehlt einer, läuft die betroffene Funktion in einem
klar gekennzeichneten Demo-Modus statt einen Fehler zu werfen. Siehe
[.env.example](./.env.example).

`PUBLIC_SITE_URL` muss bereits zur **Buildzeit** gesetzt sein — sie geht in
Canonicals, Sitemap und `llms.txt` ein.

## Deployment

Railway baut aus dem `Dockerfile`. Konfiguration in `railway.json`.
