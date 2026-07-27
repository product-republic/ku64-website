# Was offen ist

Stand 27. Juli 2026, abends. Diese Datei ist die Übergabe zwischen Sitzungen –
sie gehört ins Repository und nicht in einen Prompt, weil ein Prompt verloren
geht und das Repository bleibt.

Die Begründungen zu allen Entscheidungen stehen als Kommentare in den
jeweiligen Dateien. Wer wissen will, *warum* etwas so ist, findet es dort und
nicht hier.

---

## Zuerst: den Zustand abfragen, nicht raten

Sechs Prüfungen sagen in wenigen Minuten, wo das Projekt steht. Sie sind so
gebaut, dass sie beziffern statt zu behaupten – und die meisten brechen den
Build ab, wenn ihr Befund ein Fehler ist.

```bash
npm run daten:pruefen       # Querverweise, Team, Preisrahmen, fehlende Medien
npm run build               # enthält Bild-, Glas-, Sprach- und URL-Wächter
npm run urls:abgleichen     # tote Adressen des Altbestands (braucht dist/)
npm run sprachen:pruefen    # Übersetzungsrückstand, Sprachwähler, Auszeichnung
node scripts/deutsch-finden.mjs   # deutsche Sätze, die am Katalog vorbeilaufen
npm run klickpfad           # ob nach dem zweiten Klick noch etwas funktioniert
```

`klickpfad` und `durchgang` brauchen einen laufenden Server:

```bash
npm run build && PORT=4331 node ./dist/server/entry.mjs &
KLICKPFAD_BASIS=http://127.0.0.1:4331 npm run klickpfad
```

---

## Der Stand in Zahlen

| | |
|---|---|
| Seiten gebaut | 1086 (362 davon in der Sitemap – EN und FR tragen noch `noindex`) |
| Behandlungen | 36, an 4 Standorten, mit standortgenauer Verfügbarkeit |
| Beschwerdeseiten | 31 unter `/zahnbeschwerden/` |
| Team | 140 Einträge, 100 veröffentlicht (77 Ku'damm, 14 Potsdam, 10 Mitte) |
| Blog | vollständig übernommen, mit Lesefortschritt |
| Tote Adressen des Altbestands | 0 von 552 |
| Deutsche Sätze außerhalb des Katalogs | 0 (der eine Fund ist eine Baustellenmeldung, die nur im Entwicklungsmodus erscheint) |
| Übersetzbare Textbausteine | 7401 – Oberfläche, Behandlungen, Standorte, Profile, Blog, Beschwerden |
| Echte Fotos | 0 von 24 angemeldeten Motiven |

---

## Offene Punkte

### 1. Fotos – 0 von 24

`BILDER-BEDARF.md` listet jedes fehlende Motiv mit Standort, Format und
Bildbeschreibung. Solange eines fehlt, steht an seiner Stelle ein sichtbarer
Platzhalter mit der Beschreibung darin.

**Das ist Absicht.** Ein Stock-Foto einer fremden Praxis auf der Seite einer
echten ist eine Aussage über die echte, und zwar keine gute. Der Wächter
`bilder-pruefen.mjs` lässt kein Bild ohne Nachweis von Herkunft und
Alternativtext auf eine gebaute Seite.

**Nötig von der Praxis:** die Aufnahmen selbst, querformatig, mindestens 2400
Pixel breit.

### 2. Fachliche Freigabe der neu geschriebenen Behandlungstexte

36 Behandlungen, davon sind die aus dem Altbestand übernommenen bereits
freigegeben – sie standen auf ku64.de. Neu geschrieben sind die übrigen; sie
tragen in `src/data/leistungen.ts` den Vermerk, dass sie fachlich zu prüfen
sind.

Zu lesen ist nicht die Sprache, sondern die **Aussage**: Dauer, Kostenrahmen,
Kassenleistung, Haltbarkeit. Das sind die Angaben, bei denen ein Satz zu viel
heilmittelwerberechtlich heikel wird.

### 3. Verfügbarkeit je Standort bestätigen

Welche Behandlung es an welchem Standort gibt, steht in `verfuegbar` und
bestimmt, was jemand auf einer Standortseite überhaupt zu sehen bekommt. Die
Zuordnung ist aus dem Altbestand rekonstruiert. Ein Fehler darin schickt
Menschen an einen Ort, an dem es die Behandlung nicht gibt – oder verbirgt
sie an einem, an dem es sie gibt.

### 4. Preisrahmen – eine Quelle, nicht zwei

`npm run daten:pruefen` meldet 13 Behandlungen, die Kosten **sowohl im
Fließtext als auch als Preisrahmen** führen. Zwei Quellen für dieselbe Zahl
laufen irgendwann auseinander. Vor dem Live-Gang ist zu entscheiden, welche
gilt.

Die Werte in `src/data/preise.ts` stammen aus der internen Auswertung vom
20.07.2026 und sind ein **Brutto-Kostenproxy, nicht der Eigenanteil nach
Kassenerstattung**. Ohne diesen Hinweis liest ihn jede gesetzlich Versicherte
falsch. Eine eigene Preisseite ist deshalb noch nicht gebaut.

### 5. Englisch und Französisch freigeben

Der aktuelle Rückstand steht in `npm run sprachen:pruefen` – die Zahl dort
ist die einzige, der zu glauben ist. Beide Sprachen tragen bis auf Weiteres
`freigegeben: false` und damit `noindex`, und im Sprachwähler einen
abgeblendeten Knopf.

**Achtung bei der Zahl.** Sie ist an einem Abend zweimal gefallen, ohne dass
etwas kaputtging: von 100 auf 70 Prozent, als 396 fest verdrahtete Sätze in
den Katalog kamen, und von 100 auf 17, als Profile, Blog und
Beschwerdeseiten dazukamen. Beide Male hat die Zahl nicht abgenommen,
sondern angefangen, mehr zu meinen. Wer sie mit einer früheren vergleicht,
vergleicht zwei verschiedene Fragen.

Freigeben heißt: in `src/i18n/sprachen.ts` auf `true` stellen. Ab dann bricht
**jede** Lücke den Build ab, die Seiten kommen in die Sitemap und der Hinweis
„Diese Sprachfassung ist im Aufbau" verschwindet von selbst.

Davor gehört die Übersetzung gegengelesen – wieder nicht die Sprache, sondern
die Aussagen: Kosten, Kassenleistung, Behandlungsdauer, Verfügbarkeit.

### 6. Schlüssel für den Betrieb

| Schlüssel | Wo | Wofür |
|---|---|---|
| `ANTHROPIC_API_KEY` | GitHub Actions Secret **und** Railway | Übersetzungslauf, Chat-Berater |
| `GEMINI_API_KEY` | Railway | Lächeln-Vorschau |
| `ELEVENLABS_API_KEY` | Railway | Sprachberater |
| `ELEVENLABS_AGENT_ID` | Railway | Sprachberater |

**Nicht** in das Feld für Umgebungsvariablen der Entwicklungsumgebung – dort
steht ausdrücklich, dass die Werte für alle sichtbar sind, die diese Umgebung
benutzen. Nicht ins Repository, nicht in eine `.env`, nicht in den Chat.

Ebenfalls einzustellen: **Settings → Actions → General → Workflow
permissions → „Allow GitHub Actions to create and approve pull requests"**.
Ohne das schiebt der Übersetzungslauf seinen Zweig zwar, kann aber keinen
Pull Request daraus machen. Die Arbeit ist dann da und nur der Umschlag
fehlt.

### 7. Noch nicht gebaut

- **Preisseite** – siehe Punkt 4, blockiert durch die Quellenfrage.
- **Newsletter-Panel** mit Auswahl der Interessen und Double-Opt-in.
- **Standort-Dashboard** für die Standortleitungen: Mitarbeitende anlegen und
  löschen, Foto hochladen. Es muss nur `team.ts` pflegen – alles andere
  rechnet sich daraus.

---

## Was diese Sitzung gelernt hat

Drei Fehler waren vom selben Typ, und der Typ ist es wert, gemerkt zu werden:
**eine Prüfung, die grün war, weil sie nicht hinsah.**

- Der Sprachwächter meldete 99,9 Prozent, während die englische Seite zur
  Hälfte deutsch war. Er zählte den Katalog – und 396 Sätze standen nie im
  Katalog, sondern direkt in den Vorlagen. Abhilfe:
  `scripts/deutsch-finden.mjs`.
- Der Linkprüfer war zufrieden, während der Sprachwähler auf jeder
  nicht-deutschen Seite auf sich selbst zeigte. Alle Ziele existierten – nur
  führte der Knopf mit der Aufschrift „Deutsch" nicht nach Deutsch. Abhilfe:
  Ebene 4 des Sprachwächters prüft gegen die Aufschrift.
- Der Durchgang lief 32 Seiten ab und fand nichts, während das mobile Menü
  nach dem ersten Seitenwechsel tot war. Er prüfte den ersten Klick; kaputt
  war der zweite. Abhilfe: `npm run klickpfad`.

Die Regel daraus: **Eine Prüfung, die nur bestätigt, ist keine.** Jede neue
Prüfung wird einmal absichtlich zum Ausschlagen gebracht, bevor man ihr
glaubt.

---

## Arbeitsvereinbarungen

- **Ansprache:** Fabian wird geduzt. Auf der Website bleibt die
  Patientenansprache beim Sie.
- **Keine Stockfotos.** Der Typ `Bildherkunft` kennt nur `praxis` und
  `generiert`; ein Wächter prüft jede gebaute Seite.
- **Keine erfundenen Tatsachen** über reale Personen, Preise oder
  Verfügbarkeiten. Im Zweifel bleibt das Feld leer und ein Wächter meldet es.
- **Hausfarben sparsam.** Gelb `#FFCC00` ist Füllfarbe und nie Schriftfarbe
  (1,7:1 auf Weiß). Rot `#B71E3F` trägt Betonung. Auf einem Bildschirm ist
  genau eine Sache gelb.
- **Leistung ist Randbedingung, nicht Nachgedanke.** Animiert werden nur
  `transform` und `opacity`; der erste Abschnitt animiert nicht.
- **Deutsch ist Quellsprache** und behält seine Adressen ohne Präfix.
- **Alles, was ein Element aus der Seite greift, läuft durch
  `beimSeitenaufbau()`** – sonst funktioniert es genau bis zum ersten
  Seitenwechsel. Die Begründung steht in `src/lib/seitenaufbau.ts`.

## Wo was steht

| Datei | Inhalt |
|---|---|
| `SITEMAP.md` | alle 362 Seiten, nach Standort gegliedert, zum Weitergeben |
| `BILDER-BEDARF.md` | jedes fehlende Foto mit Beschreibung und Format |
| `ANALYSE.md` | Befunde zum Altbestand |
| `README.md` | Aufbau, Sprachsystem, Deployment |
| `SCHLUESSEL.md` | wohin welcher Schlüssel gehört und warum nicht woandershin |
| `src/data/` | Standorte, Leistungen, Team, Preise, Beschwerden, Medien |
| `src/i18n/` | Sprachregister, Katalog, Oberflächentexte |
| `scripts/` | die Wächter |

Testumgebung: https://web-production-4452b1.up.railway.app
Railway-Projekt `ku64-website`, Dienst `web`, Deploy aus diesem Branch.
