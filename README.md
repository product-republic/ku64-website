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

**Eine Leistung an einem Standort ergänzen oder entfernen:** Feld `verfuegbar` in
`src/data/leistungen.ts` ändern. Seiten, interne Verlinkung, Vergleichstabelle,
Sitemap, `llms.txt` und die Chatbot-Antworten ziehen automatisch nach.

## Konfiguration

Alle Schlüssel sind optional. Fehlt einer, läuft die betroffene Funktion in einem
klar gekennzeichneten Demo-Modus statt einen Fehler zu werfen. Siehe
[.env.example](./.env.example).

`PUBLIC_SITE_URL` muss bereits zur **Buildzeit** gesetzt sein — sie geht in
Canonicals, Sitemap und `llms.txt` ein.

## Deployment

Railway baut aus dem `Dockerfile`. Konfiguration in `railway.json`.
