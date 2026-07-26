# Was offen ist

Stand 26. Juli 2026. Diese Datei ist die Übergabe zwischen Sitzungen – sie
gehört ins Repository und nicht in einen Prompt, weil ein Prompt verloren
geht und das Repository bleibt.

Die Begründungen zu allen Entscheidungen stehen als Kommentare in den
jeweiligen Dateien. Wer wissen will, warum etwas so ist, findet es dort und
nicht hier.

---

## Zuerst: den Zustand abfragen, nicht raten

Vier Prüfungen sagen in unter einer Minute, wo das Projekt steht:

```bash
npm run daten:pruefen       # Querverweise, Team, fehlende Medien
npm run urls:abgleichen     # tote Adressen des Altbestands (braucht dist/)
npm run sprachen:pruefen    # Übersetzungsrückstand
npm run oberflaeche:pruefen # Ein- und Ausblendzustände (braucht laufenden Server)
```

Alle vier laufen im Build mit oder brechen ihn ab. Sie sind so gebaut, dass
sie beziffern statt behaupten.

---

## Offene Punkte, nach Dringlichkeit

### 1. KI-Verordnung, Frist 2. August 2026

Artikel 50 der Verordnung (EU) 2024/1689 wird an diesem Tag anwendbar. Drei
Systeme auf dieser Website sind betroffen.

**Fertig:** Bildkennzeichnung der Lächeln-Vorschau, sichtbar und
maschinenlesbar (`src/lib/ki-kennzeichnung.ts`). Der IPTC-Wert
`trainedAlgorithmicMedia` steht in der Datei, ein Streifen mit Hinweis unter
dem Bild. Eine Prüfung verhindert, dass ein unmarkiertes Bild ausgeliefert
wird, falls im Container die Schrift fehlt.

**Offen:**
- Offenlegung im Chat **vor der ersten Interaktion**. Die Begrüßung sagt
  derzeit nicht, dass man mit einer Maschine schreibt; der Hinweis steht nur
  klein unter dem Eingabefeld. Artikel 50 Absatz 1 verlangt „klar und
  unterscheidbar, spätestens bei der ersten Interaktion".
- Dasselbe für den Sprachberater, dort zusätzlich als synthetische Stimme.
- Eine Transparenzseite `/ki-transparenz/`: welche Systeme, wofür, welcher
  Anbieter, welche Daten, wie man einen Menschen erreicht.
- Im Dockerfile fehlt in der Laufzeitstufe `fontconfig` und die Inter-Schrift.
  Ohne sie rendert der Hinweisstreifen leer – die Prüfung fängt es ab, aber
  dann kommt gar kein Bild.

**Vorbehalt:** Die Anwendbarkeit einzelner Teile war 2025/26 Gegenstand eines
Digital-Omnibus-Verfahrens. Umgesetzt ist auf den Stand 2. August 2026; die
endgültige Rechtslage gehört von einer Anwältin bestätigt.

### 2. Tote Adressen – 216 von 238

`npm run urls:abgleichen` bricht ab, solange eine Adresse ins Leere läuft.
Vier strukturelle Abweichungen, nachzulesen in `ANALYSE.md` Abschnitt 1c:

| Alt | Neu | Betroffen |
|---|---|---|
| `/potsdam/parodontitisbehandlung/` | `/potsdam/leistungen/parodontitis-behandlung/` | 20 |
| `/leistungen/kieferorthopaedie/incognito/` | `/leistungen/aligner/` | 11 |
| `/team/<gruppe>/<person>/` | gibt es nicht | 59 |
| `/blog/<beitrag>/` | gibt es nicht | 48 |

Der alte Standortpfad war **flach**, und die alten Slugs weichen ab. Eine
Regel löst das nicht auf – es braucht je Behandlung eine gepflegte Zuordnung
(Feld `alteAdressen`, wie es `team.ts` schon führt).

**Die 238 sind nur, was aus der alten `.htaccess` belegbar ist.** Der wahre
Bestand ist größer. Vollständig wird er durch einen Crawl von ku64.de oder
einen Export aus der Google Search Console.

### 3. Medien – nichts übernommen

`public/` enthält keine einzige echte Aufnahme. Was fehlt und woher es kommt,
sagt `npm run daten:pruefen`.

Die Kopfvideos sind namentlich bekannt und in `src/data/medien.ts`
zugeordnet. **Befund:** Es gibt eigene Aufnahmen für Potsdam und
Berlin-Mitte – die alte Website spielte trotzdem überall den Kurfürstendamm
aus. Wilmersdorf hat keine und bekommt deshalb keine.

Für die Bilder: `analyse/altbestand/medien-nutzung.mjs` läuft lokal über das
Server-Backup, führt die WordPress-Ableitungen auf ihre Originale zurück
(zehn Dateien je Motiv) und ermittelt, welche überhaupt verwendet werden.

### 4. Team – 56 erfasst, 0 veröffentlicht

Aus den Weiterleitungsregeln des Altbestands rekonstruiert. Jeder Eintrag
trägt `bestaetigt: false` und erscheint deshalb nicht auf der Website.

Zu bestätigen ist zweierlei: **Schreibweise** (Umlaute sind aus Adressen
rückgewinnbar, fremde Diakritika nicht – aus `cigdem-korur` folgt nicht, ob
die Person Çiğdem Korur heißt) und **Zugehörigkeit** (Jana Jain stand in der
Liste, arbeitet aber nicht mehr bei KU64).

Es fehlen Funktionsbezeichnungen, Schwerpunkte, Sprachen und Fotos. Die
stehen in der WordPress-Datenbank.

Alle Zahlen über das Team werden gerechnet, nicht gepflegt – wer jemanden
einträgt, ändert sie überall zugleich.

### 5. Übersetzungen – 11,5 Prozent

651 von 736 Bausteinen offen, je Sprache. `npm run sprachen:sync` schließt
das in einem Lauf, braucht aber `ANTHROPIC_API_KEY`.

Dazu Restdeutsch in 192 Seiten je Sprache: Prosa, die als Template-Literal
direkt in den `.astro`-Dateien steht und deshalb am Katalog vorbeiläuft. Die
gehört nach `src/i18n/texte.ts`.

Englisch und Französisch tragen `freigegeben: false` und damit `noindex`.
Sobald das auf `true` steht, bricht jede Lücke den Build ab.

### 6. Noch nicht gebaut

- **Preisseite.** Die Daten liegen vollständig in `src/data/preise.ts`, aus
  der internen Auswertung vom 20.07.2026. Drei Preisdrittel je Behandlung,
  die Behandlungsstrecke als eigene Angabe, Prophylaxe an erster Stelle.
  **Wichtig:** Die Werte sind ein Brutto-Kostenproxy, nicht der Eigenanteil
  nach Kassenerstattung. Ohne diesen Hinweis auf der Seite liest ihn jede
  gesetzlich Versicherte falsch.
- **Newsletter-Panel** mit Auswahl der Interessen (Events, Produkte,
  Neuigkeiten, Behandlungsthemen, Standort), Double-Opt-in.
- **Blog** mit Lesefortschritt. 48 alte Adressen zeigen dorthin.
- **Beschwerdeseiten.** Fünf sind in `leistungen.ts` als
  `BESCHWERDEN_GEPLANT` vermerkt. Sie sind die wertvollsten fehlenden
  Seiten: Menschen suchen ihr Symptom, nicht den Fachbegriff.
- **Interne Verlinkung** durchgängig.
- **Standort-Dashboard** für Petros und die Standortleitungen: Mitarbeiter
  anlegen und löschen, Foto hochladen, SEO automatisch. Es muss nur
  `team.ts` pflegen – alles andere rechnet sich daraus.
- **Abschluss-Cleanup** ganz zum Schluss, nicht vorher.

---

## Arbeitsvereinbarungen

- **Ansprache:** Fabian wird geduzt. Auf der Website bleibt die
  Patientenansprache beim Sie.
- **Keine Stockfotos.** Der Typ `Bildherkunft` kennt nur `praxis` und
  `generiert`; ein Wächter prüft jede gebaute Seite.
- **Keine erfundenen Tatsachen** über reale Personen, Preise oder
  Verfügbarkeiten. Im Zweifel bleibt das Feld leer und ein Wächter meldet es.
- **Hausfarben sparsam.** Gelb `#FFCC00` ist Füllfarbe und nie Schriftfarbe
  (1,5:1 auf Weiß). Rot `#9F1537` trägt Betonung. Auf einem Bildschirm ist
  genau eine Sache gelb.
- **Leistung ist Randbedingung, nicht Nachgedanke.** Animiert werden nur
  `transform` und `opacity`, Bewegung läuft über `animation-timeline` ohne
  JavaScript, der erste Abschnitt animiert nicht.
- **Deutsch ist Quellsprache** und behält seine Adressen ohne Präfix.

## Wo was steht

| Datei | Inhalt |
|---|---|
| `ANALYSE.md` | Befunde zum Altbestand, Abschnitt 1c ist der URL-Befund |
| `README.md` | Aufbau, Sprachsystem, Deployment |
| `src/data/` | Standorte, Leistungen, Team, Preise, Medien |
| `src/i18n/` | Sprachregister, Katalog, Oberflächentexte |
| `scripts/` | die Wächter |
| `analyse/altbestand/` | Auswertung der alten `.htaccess`, Medienskript |

Testumgebung: https://web-production-4452b1.up.railway.app
Railway-Projekt `ku64-website`, Dienst `web`, Deploy aus diesem Branch.
