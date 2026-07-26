# Was offen ist

Stand 26. Juli 2026, abends. Diese Datei ist die Übergabe zwischen Sitzungen –
sie gehört ins Repository und nicht in einen Prompt, weil ein Prompt verloren
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

## Was seit der letzten Übergabe erledigt ist

**ku64.de ist erreichbar.** Damit sind drei Punkte weg, die vorher nur als
Vermutung dastanden.

* **Adressbestand: 0 tote Adressen** statt 216. Der Crawl hat den wahren
  Bestand erst auf 552 gehoben – jetzt kommen alle 546 relevanten an.
  Nachzulesen in `ANALYSE.md` Abschnitt 1c.
* **Kopfvideos übernommen.** Alle drei liegen unter `public/medien/`, ohne
  Tonspur und auf 16,8 MB statt 31,7 MB gebracht. Mit Standbild.
* **Erste echte Fotografie.** Je Standort eine Aufnahme auf `/<standort>/praxis/`.

Die Werkzeuge dafür stehen im Repository und sind wiederholbar:
`analyse/altbestand/crawl.mjs`, `analyse/altbestand/medien-holen.mjs`,
`scripts/kopfvideos-aufbereiten.mjs`, `scripts/praxisbilder-aufbereiten.mjs`.

---

## Offene Punkte, nach Dringlichkeit

### 1. KI-Verordnung, Frist 2. August 2026 — sieben Tage

Artikel 50 der Verordnung (EU) 2024/1689 wird an diesem Tag anwendbar. Drei
Systeme auf dieser Website sind betroffen. **Das ist der dringendste Punkt der
Liste.**

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

### 2. Team – 56 erfasst, 0 veröffentlicht, aber die Belege liegen jetzt vor

Der Crawl hat 102 lebende Teamseiten auf ku64.de gefunden, jede mit dem Namen
im Seitentitel. Das beantwortet beide Fragen, an denen es hing:

**Schreibweise.** Nicht mehr aus Adressen rückgerechnet, sondern von der
eigenen Seite der Praxis gelesen: Zeynep Çınar, Jessica Oberländer, Sabine
Kühnau-Falkenau, Aisegkioul Netzipoglou-Housein. Aus `cigdem-korur` ließ sich
das nie erschließen.

**Zugehörigkeit.** Wer heute eine lebende Seite hat, arbeitet dort. Die
Gegenprobe stimmt: `/team/verwaltung/jana-jain/` ist auf ku64.de eine
Fehlerseite – dieselbe Person, die als Warnfall in `team.ts` steht.

**Zu tun:** `team.ts` aus `analyse/altbestand/crawl-roh.json` neu aufbauen –
Name und Gruppe aus den Seitentiteln, `bestaetigt` bleibt trotzdem `false`,
bis die Praxis bestätigt. Danach fehlen weiterhin Funktionsbezeichnungen,
Schwerpunkte, Sprachen und Fotos; die stehen in der WordPress-Datenbank oder
auf den Personenseiten selbst, die der Crawl bisher nur als Titel ausliest.

Sobald Personen bestätigt sind, gehören ihre alten Adressen von einer
Weiterleitung auf eine echte Personenseite umgestellt – am besten unter
derselben Adresse. 145 Teamadressen zeigen derzeit auf die Teamübersicht des
Kurfürstendamms.

Alle Zahlen über das Team werden gerechnet, nicht gepflegt – wer jemanden
einträgt, ändert sie überall zugleich.

### 3. Seiten, die es im Altbestand gab und hier noch nicht

Der Crawl hat diese Lücken erst beziffert. Alle sind derzeit weitergeleitet;
eine Weiterleitung ist der zweitbeste Fall.

- **31 Beschwerdeseiten** unter `/zahnbeschwerden/` – von „Zahnfleischbluten"
  über „Zahn locker" bis „Mundtrockenheit". Diese Seiten gab es also längst,
  und sie sind das Wertvollste, was fehlt: Menschen suchen ihr Symptom, nicht
  den Fachbegriff. `BESCHWERDEN_GEPLANT` in `leistungen.ts` führt bisher fünf.
- **Kategorieseiten** je Fachgebiet. Alt: `/leistungen/kieferorthopaedie/`.
  Neu: ein Sprungziel auf der Übersicht. Der Slug stimmt bereits überein –
  eine eigene Seite würde die alte Adresse unverändert bedienen.
- **Blog** mit Lesefortschritt. 74 alte Adressen zeigen dorthin, davon vier mit
  fachlichem Inhalt und neun Stellenanzeigen; der Rest ist Praxisgeschichte.
- **Personenseiten**, siehe Punkt 2.
- **Preisseite.** Die Daten liegen vollständig in `src/data/preise.ts`, aus
  der internen Auswertung vom 20.07.2026. Drei Preisdrittel je Behandlung,
  die Behandlungsstrecke als eigene Angabe, Prophylaxe an erster Stelle.
  **Wichtig:** Die Werte sind ein Brutto-Kostenproxy, nicht der Eigenanteil
  nach Kassenerstattung. Ohne diesen Hinweis auf der Seite liest ihn jede
  gesetzlich Versicherte falsch.
- **Newsletter-Panel** mit Auswahl der Interessen (Events, Produkte,
  Neuigkeiten, Behandlungsthemen, Standort), Double-Opt-in.
- **Interne Verlinkung** durchgängig.
- **Standort-Dashboard** für Petros und die Standortleitungen: Mitarbeiter
  anlegen und löschen, Foto hochladen, SEO automatisch. Es muss nur
  `team.ts` pflegen – alles andere rechnet sich daraus.
- **Abschluss-Cleanup** ganz zum Schluss, nicht vorher.

### 4. Eine Frage an die Praxis: welche Angebote gibt es noch?

Der neue Leistungskatalog hat 35 Behandlungen. Im Altbestand stehen Angebote,
die darin fehlen – sie sind derzeit auf die Leistungsübersicht weitergeleitet,
weil eine ähnlich klingende Behandlung eine falsche Zusage wäre:

- Ästhetische Medizin (Faltenbehandlung, Hyaluron, Zornesfalte) – vier Seiten
- Laserbehandlung – drei Adressen, darunter eine eigene Potsdamer Fassung
- Longevity, Dentosophie, Infusionstherapie
- Kosmetikbereich (`beauty-cosmetics`, `ku64-cosmetics`)

**Zu klären:** Gibt es diese Angebote weiterhin? Falls ja, gehören sie in den
Katalog; falls nein, ist die Weiterleitung richtig und die Frage erledigt.

### 5. Medien – Videos und vier Fotos da, der Rest sortiert

`public/` enthält jetzt drei Kopfvideos mit Standbild und vier
Standortaufnahmen. Was fehlt und woher es kommt, sagt `npm run daten:pruefen`.

**Offen:**
- Behandlungszimmer, Kinderbereich, Meisterlabor. Der Bestand hat sie – rund
  570 eigenständige Motive, aufgelistet in `medien-live.json` nach einem
  Crawl. Sie brauchen je Bild eine Zuordnung, einen Alternativtext und bei
  Personen eine Einwilligung.
- **Teamfotos.** Für jede erkennbare Person eine Einwilligung. Ohne sie kein
  Foto – das ist keine Auslegungsfrage.
- Die bekannteste Kudamm-Aufnahme (gelber Empfangstresen) zeigt zwei
  Mitarbeiterinnen. Sobald die Einwilligung vorliegt, ist sie das bessere Bild
  als der Flur, der derzeit dort steht.
- Zwei Behandlungsvideos aus dem Backup (`BEHANDLUNGSVIDEOS` in `medien.ts`)
  sind auf ku64.de nicht öffentlich; sie kommen nur aus dem Server-Backup. Das
  Cad-Cam-Video braucht mit 29,7 MB dieselbe Aufbereitung wie die Kopfvideos.
- Wilmersdorf hat weiterhin kein Kopfvideo und keine Innenaufnahme.

### 6. Übersetzungen – 11,5 Prozent

651 von 736 Bausteinen offen, je Sprache. `npm run sprachen:sync` schließt
das in einem Lauf, braucht aber `ANTHROPIC_API_KEY`.

Dazu Restdeutsch in 192 Seiten je Sprache: Prosa, die als Template-Literal
direkt in den `.astro`-Dateien steht und deshalb am Katalog vorbeiläuft. Die
gehört nach `src/i18n/texte.ts`.

Englisch und Französisch tragen `freigegeben: false` und damit `noindex`.
Sobald das auf `true` steht, bricht jede Lücke den Build ab.

**Neu aus dem Crawl:** Der Altbestand hatte 54 englische Seiten mit eigenen
englischen Slugs. Die neue Website übersetzt Texte, nicht Adressen –
`/en/leistungen/veneers/` behält den deutschen Slug. Das ist eine Entscheidung
und keine Nachlässigkeit: zwei Adressbestände je Sprache zu pflegen ist die
häufigste Quelle für tote Adressen bei mehrsprachigen Websites. Die 54 alten
englischen Adressen sind zugeordnet.

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
- **Keine Weiterleitung auf die Startseite.** Wer aus der Suche nach einem
  Symptom auf einer Startseite landet, geht zurück.

## Wo was steht

| Datei | Inhalt |
|---|---|
| `ANALYSE.md` | Befunde zum Altbestand, Abschnitt 1c ist der URL-Befund |
| `BILDER.md` | Bildregel und aktueller Bildbestand |
| `README.md` | Aufbau, Sprachsystem, Deployment |
| `src/data/` | Standorte, Leistungen, Team, Preise, Medien, Weiterleitungen |
| `src/i18n/` | Sprachregister, Katalog, Oberflächentexte |
| `scripts/` | die Wächter und die Medienaufbereitung |
| `analyse/altbestand/` | Crawl, Auswertung der alten `.htaccess`, Medienskripte |

Testumgebung: https://web-production-4452b1.up.railway.app
Railway-Projekt `ku64-website`, Dienst `web`, Deploy aus diesem Branch.
