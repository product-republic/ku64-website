# KU64 – Stand, Vergleich und Prognose

**Erhoben am 29. bis 31. Juli 2026.** Jede Zahl in diesem Dokument ist
gemessen und mit dem Skript benannt, das sie erzeugt. Wo etwas nicht messbar
war oder aus fremder Quelle stammt, steht es dabei.

---

## Für wen welches Kapitel

Niemand muss alles lesen.

| | Kapitel | Warum |
|---|---|---|
| **Praxisinhaber** | Urteil, 1, 5, 6, 7, 10, 11, 12 | Was ist gut, was noch aussteht, was dauerhaft im Haus bleibt, was von der Praxis gebraucht wird |
| **Marketing / Kaufmännische Leitung** | Urteil, 4, 5, 6, 8, 10, 11 | Vergleich, Messbarkeit, laufende Leistung im Haus, Prognose |
| **Agentur / Technik** | alles, besonders 0, 2, 3, 4, 13 | Methodik, Messwerte, Prüfkette, Rohdaten |

---

## Das Urteil in fünf Sätzen

**Technisch ist der Neubau der alten Website in jeder messbaren Hinsicht
überlegen** — ein Fünftel des Gewichts, kein Drittanbieter beim Seitenaufruf,
keine tote Adresse aus dem Altbestand, Barrierefreiheit auf 100.

**Der Behandlungstext ist vollständig übernommen und etwas gewachsen:**
**129.742 Wörter auf 75 Seiten gegen 117.595 auf 74** — 110,3 Prozent des
Altbestands, wortgleich, ohne Umformulierung. Zu Zahnimplantaten sind es
3.156 Wörter auf der Hauptseite gegen 2.442, dazu dieselben vier eigenen
Seiten wie bisher für Kosten, Haltbarkeit, Rauchen und die Frage Implantat
oder Brücke. Dazu kommen die zehn Belegseiten unter `/ueber-uns/`:
**10.972 Wörter auf 11 Seiten gegen 9.083 auf 10**, 120,8 Prozent.

**Das Kernversprechen des Umbaus ist gebaut, aber noch nicht wirksam:** 120
örtliche Behandlungsseiten existieren, und **keine einzige** ist zur
Indexierung angemeldet — für Google gibt es weiterhin genau eine Seite je
Behandlung. Der Grund ist gemessen, nicht geschätzt: Diese Seiten tragen im
Mittel **140 eigene Wörter**; die Regel des Projekts verlangt 350. Die beste
verfehlt sie um 137 Wörter.

**Eine Livegang-Sperre ist noch offen — die Rechtstexte sind es nicht mehr.**
Im Impressum sind **25 Angaben belegt, 5 mit Rechtsgrundlage als nicht
einschlägig ausgewiesen, 0 offen**; jede belegte Angabe trägt ihre Quelle.
Nicht einschlägig sind Registergericht und Registernummer (§ 5 Abs. 1 Nr. 4
DDG, „soweit vorhanden"), die USt-IdNr. (§ 4 Nr. 14 Buchst. a UStG) sowie
Versicherer und Geltungsbereich (§ 2 DL-InfoV gilt nicht, weil Art. 2 Abs. 2
Buchst. f der Richtlinie 2006/123/EG Gesundheitsdienstleistungen ausnimmt).
Es wird ausdrücklich **nicht** behauptet, es gebe keinen Registereintrag —
das wäre eine Tatsachenbehauptung, die nur die Praxis prüfen kann; die Zeile
entfällt samt Überschrift. Offen bleibt allein: die Preisangaben, die aus
Fotos einer gedruckten Auswertung abgetippt sind.

**Der Hebel liegt nicht in der Technik.** Er liegt in vierundzwanzig Fotos,
einer Stunde Personendurchsicht — und vor allem in den örtlichen Texten, die
das Kernversprechen erst wirksam machen. Die Übersetzung ist kein Hebel mehr:
Der Korpus umfasst **123.540 Wörter je Sprache**, Englisch ist mit 83 von 83
Themen fertig, Französisch bei 66 von 83.

---

## Kurzfassung

**Was gebaut wurde.** Ein vollständiger Neubau mit anderer Grundordnung: Jede
Behandlung gehört zu einem Standort statt zu keinem. 1.554 Seiten, drei
Sprachen, dreiundzwanzig automatische Prüfungen — dreizehn bei jedem Bau,
zehn auf Abruf gegen die laufende Seite im Browser. Die dreizehn laufen bei
jedem Zug auf einen Arbeitszweig, nicht auf Zuruf.

```grafik
{
  "art": "kennzahlReihe",
  "titel": "Der Umbau in vier Zahlen",
  "zahlen": [
    { "wert": 0, "label": "tote Adressen von 552", "richtung": "keine", "wertung": "gut" },
    { "wert": -80, "einheit": "%", "label": "HTML je Seite", "richtung": "runter", "wertung": "gut" },
    { "wert": 110, "einheit": "%", "label": "Text auf Behandlungsseiten, gegen alt", "richtung": "rauf", "wertung": "gut" },
    { "wert": 100, "label": "Barrierefreiheit (Lighthouse)", "richtung": "keine", "wertung": "gut" }
  ]
}
```

**Jeder Mangel der alten Website ist beseitigt.**

```grafik
{
  "art": "maengelListe",
  "titel": "Was ku64.de heute trägt – und was davon übrig ist",
  "einheit": "Seiten",
  "hinweis": "Sechzehn Mängel geprüft, dieselbe Regel für beide Websites. Elf davon hat ku64.de nicht – sie stehen deshalb nicht in dieser Liste. Quelle: analyse/vergleich/befunde-erheben.mjs",
  "zeilen": [
    { "label": "Seiten mit fremden Skripten beim Aufruf", "alt": 340, "neu": 0 },
    { "label": "Seiten ohne hreflang", "alt": 99, "neu": 0 },
    { "label": "Seiten über 300 kB HTML", "alt": 44, "neu": 0 },
    { "label": "Seiten über 2 Sekunden Antwortzeit", "alt": 12, "neu": 0 },
    { "label": "Sprünge in der Überschriftengliederung", "alt": 15, "neu": 0 },
    { "label": "Tote Adressen nach dem Umzug", "alt": 552, "neu": 0 }
  ]
}
```

**Fünf Mängel, alle fünf auf null.** Und eine Ehrlichkeit, die dieser Liste
Gewicht gibt: Elf weitere geprüfte Mängel hat ku64.de gar nicht. Titel,
Beschreibungen, Canonical, strukturierte Daten, Sprachauszeichnung — dort ist
die heutige Website sauber gepflegt. Der Neubau übernimmt diesen Stand und
behält ihn; er behauptet keinen Sieg, wo es keinen Gegner gab.

**Was messbar besser ist.**

```grafik
{
  "art": "paarBalken",
  "titel": "Technik je Seite, alt gegen neu",
  "besserIst": "klein",
  "hinweis": "Alt: 340 Seiten der laufenden Website. Neu: 257 Seiten der Sitemap. Die Mischung ist nicht dieselbe – siehe Kapitel 0.",
  "zeilen": [
    { "label": "HTML (Median)", "alt": 224, "neu": 45, "einheit": "kB" },
    { "label": "Skripte", "alt": 25.8, "neu": 5.2 },
    { "label": "Stylesheets", "alt": 22.9, "neu": 1.2 },
    { "label": "Ebenensprünge (Summe)", "alt": 15, "neu": 0 }
  ]
}
```

| | ku64.de heute | Neubau |
|---|---:|---:|
| Tote Adressen aus dem Altbestand | 467 von 552 wären es geworden | **0** |
| HTML je Seite (Median) | 224 kB | **45 kB** |
| Skripte je Seite | 25,8 | **5,2** |
| Fremde Skripte, Summe über alle Seiten | 660 | **0** |
| Sprünge in der Überschriftengliederung | 15 | **0** |
| Englische Seiten | 54 | **518** |
| Lighthouse Barrierefreiheit, mobil | nicht erhoben | **100** |
| Text auf Behandlungsseiten | 117.595 Wörter | **129.742** |
| Text auf den Über-uns-Belegseiten | 9.083 Wörter | **10.972** |
| Eigene Seiten je Behandlungsfrage | 74 | **75** |
| Offene Pflichtangaben im Impressum | 4 | **0** |
| Oberfläche auf Englisch und Französisch | 96,7 % | **100,0 %** |
| Fremde Verbindungen beim Seitenaufruf | 660 | **0** |
| Automatische Prüfungen | 0 | **23** |

**Der Behandlungstext im Vergleich.** Zu Implantaten hat die alte Website fünf
Seiten mit zusammen 10.952 Wörtern — Hauptseite, Kosten, Haltbarkeit, Rauchen,
Implantat oder Brücke. Die neue hat dieselben fünf mit zusammen 12.425. Über
alle Behandlungen: 117.595 Wörter auf 74 Seiten gegen 129.742 auf 75.

Der Text ist wortgleich übernommen, nicht neu geschrieben. **Kapitel 5 rechnet
es je Bereich vor.**

```grafik
{
  "art": "paarBalken",
  "titel": "Behandlungsseiten: Text im Hauptbereich",
  "besserIst": "gross",
  "hinweis": "Kanonische Fassung, nur <main>, ohne Vorlagenblöcke – dieselbe Zählweise für beide. Alt: 74 Seiten, neu: 75.",
  "zeilen": [
    { "label": "Wörter gesamt", "alt": 117595, "neu": 129742 },
    { "label": "Zahnimplantate, alle Seiten", "alt": 7400, "neu": 8398 }
  ]
}
```

**Was noch nicht wirkt.** 120 örtliche Behandlungsseiten sind gebaut, 0 sind
indexierbar — sie tragen im Mittel 140 eigene Wörter, verlangt sind 350.
**Kapitel 6.**

**Was inhaltlich veraltet ist.** In sechs Blogbeiträgen werden mindestens
zehn Personen namentlich als Teil der Praxis vorgestellt, die dort nicht mehr
arbeiten — im Präsens, darunter ein ausführliches Fachzitat. **Kapitel 7.**

**Was jetzt gebraucht wird.**

| Von wem | Was | Aufwand | Wirkung |
|---|---|---|---|
| Praxis | **Örtliche Texte je Standort:** Geräte, Ablauf, Sitzungszahl, Wartezeit | je Behandlung ein Absatz | **Der größte offene Hebel** — erst damit wird Kapitel 6 wirksam |
| Praxis | 24 Fotos (14 davon vorrangig) | Fototermin je Haus | Sie sitzen im Kopf jeder Leistungskategorie und auf drei von vier Standortseiten |
| Praxis | Personennennungen in sechs Blogbeiträgen durchsehen | 1,5 Std. | betrifft auch die heutige Website |
| Praxis | EN und FR gegenlesen und freigeben | 2 Tage | beide Sprachen sind gebaut, aber nicht abgenommen |
| Betrieb | GitHub → Actions → Pull Requests erlauben | 5 Min. | sonst bleibt die fertige englische Übersetzung liegen |

**Fünf Punkte, mehr nicht.** Alles Übrige — Rechtsangaben, Preisprüfung,
fachliche Freigabe der 36 Behandlungstexte, die zehn Belegseiten, die
Verfügbarkeit je Standort — ist abgeschlossen.

---

## 0. Wie diese Zahlen zustande kommen — bitte zuerst lesen

Ein Relaunch-Bericht, der „übersichtlicher", „moderner" und „schneller"
behauptet, ist unwiderlegbar und damit wertlos. Dieses Dokument ist so
gebaut, dass jede Aussage nachgerechnet werden kann.

**Die Erhebung.** `analyse/vergleich/erheben.mjs` fragt beide Fassungen mit
demselben Skript ab und wertet sie mit denselben Regeln aus:

| | alte Website | neue Website |
|---|---:|---:|
| erhobene Seiten | 340 | 210 |
| Quelle der Adressliste | Crawl vom 26.07. (341 erreichbare) | Sitemap, Stand 29.07. |
| Fehler beim Abruf | 1 | 0 |

Je Seite erfasst: Auslieferungsgröße des HTML, Titel, Description, Wortzahl
des sichtbaren Textes, Anzahl H1, Sprünge in der Überschriftengliederung,
Bilder und fehlende Alternativtexte, eingebundene Skripte und Stylesheets
(davon von fremden Servern), Canonical, hreflang, strukturierte Daten,
noindex, Antwortzeit.

Die alte Website wurde mit vier gleichzeitigen Verbindungen und Pausen
abgefragt — weniger Last als ein einzelner Suchmaschinenbesuch.

### 0.1 Die beiden Stichproben sind nicht deckungsgleich

Das ist die wichtigste Einschränkung dieses Berichts, und sie betrifft **jede
Je-Seite-Kennzahl** in den Kapiteln 2.4, 3.4 und 4:

- **Alt** sind 340 Seiten, darunter 101 Teamseiten — die schwersten und
  langsamsten der alten Website, eine mit 690 kB und 6,4 Sekunden — und 54
  englische.
- **Neu** sind die 257 Seiten der Sitemap. Darin ist **keine** englische oder
  französische Seite (sie tragen `noindex`), **keine** örtliche
  Behandlungsseite (sie zeigen per Canonical auf die übergreifende) und kein
  Behandlerprofil, das auf die Teamübersicht verweist.

Die Seitenmischung ist also verschieden. Wo es auf den Vergleich derselben
Sache ankommt — Kapitel 4 und 5 —, wird deshalb nicht Mittelwert gegen
Mittelwert gestellt, sondern **Seitenpaar gegen Seitenpaar**:
`analyse/vergleich/paare-bilden.mjs` verbindet jede der 340 alten Adressen
über die Weiterleitungsliste mit ihrem heutigen Ziel. Diese Zahlen sind
belastbar; die Mittelwerte sind Anhaltspunkte.

### 0.2 Drei Zahlen dieses Berichts stammen nicht aus eigener Messung

1. **Core Web Vitals der alten Website: nicht erhoben.** Der Browser dieser
   Arbeitsumgebung erreicht keine externen Adressen; der Proxy weist die
   Verbindung ab. Auch die PageSpeed-Schnittstelle von Google war am
   Messtag am Tageskontingent. Ein Klick schließt die Lücke:
   `pagespeed.web.dev` auf `https://ku64.de/` dauert dreißig Sekunden.
   Solange steht in den Tabellen *nicht erhoben* — und keine Zahl, die gut
   klingt.
2. **Die Größenordnung „ein Drittel bis die Hälfte" in Kapitel 11.1** ist
   eine Faustregel aus der Fachliteratur zu Relaunches ohne
   Weiterleitungsarbeit, keine Messung an dieser Website. Sie ist als solche
   gekennzeichnet.
3. **Der Vergleich in Kapitel 10.1** stellt der eingebauten Prüfkette
   gegenüber, was ein technischer SEO-Retainer üblicherweise leistet. Wie oft
   ein externes Audit stattfindet, hängt vom Vertrag ab; „monatlich" ist die
   übliche Taktung und hier als Annahme gesetzt, nicht als Messung. Die Zahl
   der eigenen Prüfungen und ihr Takt sind dagegen abgezählt.

### 0.3 Vorbehalt zu allen Wortzahlen

Gezählt wird der sichtbare Text der ganzen Seite, einschließlich Navigation
und Fußbereich. Beide Fassungen tragen unterschiedlich viel davon: Die
kleinste alte Seite hat 697 Wörter, die kleinste neue 363. Diese Differenz
steckt in jeder Zahl. Wo es auf den eigentlichen Inhalt ankommt — Kapitel 5
—, ist sie herausgerechnet und das Verfahren angegeben.

---

## 1. Was die neue Website erreichen soll

Nicht „modern aussehen". Sechs benennbare Ziele:

**1. Aus einer anonymen Leistungsseite eine örtliche machen.** Auf der alten
Website lag jede Behandlung standortübergreifend unter `/leistungen/`. Wer
über `/potsdam/` einstieg und auf „Zahnimplantate" klickte, landete auf einer
Seite ohne Adresse, ohne Telefonnummer, ohne die richtige Terminbuchung. Für
Google war es eine Seite; für die Praxis sind es vier Standorte mit vier
Einzugsgebieten. *Stand der Einlösung: Kapitel 6.*

**2. Keinen Adressbestand verlieren.** Ein Relaunch, der Adressen fallen
lässt, verliert die Sichtbarkeit von Jahren — sofort und ohne Warnung.
*Eingelöst: 0 von 552 Adressen laufen ins Leere.*

**3. Bedienbar für alle.** Eine Zahnarztpraxis hat überdurchschnittlich viele
ältere Patienten und Patientinnen mit eingeschränktem Sehvermögen. Kontrast,
Tastaturbedienung und Screenreader sind hier kein Zusatz. *Eingelöst:
Lighthouse Barrierefreiheit 100 auf allen geprüften Seiten.*

**4. Selbstbedienung, wo sie Zeit spart.** Termin, Anamnese, Rückfragen,
Orientierung — ohne Anruf an der Rezeption.

**5. Wartbarkeit.** Eine Änderung an einer Stelle, und die Website zieht
überall nach. *Kapitel 9.*

**6. Mehrsprachigkeit.** Die alte Website hatte 54 englische Seiten von 341 —
die englische Fassung endete dort, wo es interessant wurde. *Neu: 518
englische und ebenso viele französische Seiten, Oberfläche zu 100 Prozent,
Fachtext auf Englisch vollständig übersetzt — aber noch nicht freigegeben.*

---

## 2. Die alte Website, gemessen

### 2.1 Umfang

Aus dem Crawl vom 26.07.2026 (`analyse/altbestand/crawl-bericht.md`):

| | Anzahl |
|---|---:|
| geprüfte Adressen | 662 |
| **erreichbar (200)** | **341** |
| weitergeleitet (3xx) | 315 |
| Fehler (4xx/5xx) | 6 |

Die `.htaccess` des alten Servers belegte 238 Adressen. Der Crawl fand 341
ausgelieferte Seiten — die Weiterleitungsliste war also schon vor dem Umbau
unvollständig.

### 2.2 Inhalt nach Bereichen

340 erhobene Seiten, **629.817 Wörter**, im Mittel 1.852 je Seite. Davon
110.947 Wörter auf den 54 englischen Seiten; der deutschsprachige Bestand
umfasst **518.870 Wörter auf 286 Seiten**.

| Bereich | Seiten | Wörter | Ø je Seite |
|---|---:|---:|---:|
| `/leistungen/` | 74 | 170.785 | 2.307 |
| `/en/` | 54 | 110.947 | 2.054 |
| `/zahnbeschwerden/` | 31 | 102.543 | 3.307 |
| `/team/` | 101 | 95.342 | 943 |
| `/blog/` | 31 | 66.002 | 2.129 |
| `/potsdam/` | 17 | 24.465 | 1.439 |
| `/ueber-uns/` | 10 | 16.176 | 1.617 |
| `/jobs-karriere/` | 6 | 8.789 | 1.464 |
| `/berlinmitte/` | 3 | 3.301 | 1.100 |
| `/berlin-charlottenburg/` | 1 | 2.628 | 2.628 |
| `/wilmersdorf/` | 1 | 2.478 | 2.478 |
| `/kontakt/` | 2 | 1.850 | 925 |
| Sonstige | 9 | 24.511 | 2.723 |

**Das Missverhältnis ist der eigentliche Befund.** Der Kurfürstendamm hatte
eine Seite. Wilmersdorf hatte eine. Berlin-Mitte drei. Potsdam siebzehn — der
einzige Standort mit eigener Struktur. 74 Behandlungsseiten hingen an keinem
davon.

### 2.3 Der strukturelle Kernfehler der heutigen Website

Die 74 Behandlungsseiten lagen in einer tiefen, ortlosen Hierarchie:

| Ebenen im Pfad | Seiten |
|---|---:|
| 1 (`/leistungen/`, die Übersicht) | 1 |
| 2 (`/leistungen/x/`) | 12 |
| **3** (`/leistungen/fach/x/`) | **49** |
| 4 | 12 |
| Summe | 74 |

Beispiel Implantate — fünf Seiten, keine mit Ortsbezug:

```
/leistungen/kieferchirurgie-mkg-chirurgie/zahnimplantate/                          3.136 W
/leistungen/kieferchirurgie-mkg-chirurgie/zahnimplantate/implantate-und-rauchen/   2.764 W
/leistungen/kieferchirurgie-mkg-chirurgie/zahnimplantate/zahnimplantat-kosten/     2.553 W
/leistungen/kieferchirurgie-mkg-chirurgie/zahnimplantate/implantat-oder-bruecke/   1.276 W
/leistungen/kieferchirurgie-mkg-chirurgie/zahnimplantate/zahnimplantat-haltbarkeit/ 1.223 W
```

Dazu `/potsdam/implantate/` mit 1.865 Wörtern — eine verkürzte örtliche
Kopie. Genau dieses Muster (Hauptseite ohne Ort, Zweitfassung mit Ort und
weniger Inhalt) erzeugt konkurrierende Seiten zum selben Thema.

### 2.4 Technik

Gemessen über 340 Seiten. **Grundmenge beachten: siehe 0.1.**

| | Mittel | Median | Maximum |
|---|---:|---:|---:|
| HTML-Größe | **246 kB** | 224 kB | 690 kB |
| eingebundene Skripte | **25,8** | 26 | 28 |
| davon von fremden Servern | 1,9 | 2 | 3 |
| eingebundene Stylesheets | **22,9** | 22 | 29 |
| Bilder je Seite | 19,0 | 16 | 211 |
| Serverantwortzeit | **1.491 ms** | 1.388 ms | 6.428 ms |

Die langsamsten Seiten:

| Seite | Antwortzeit | HTML |
|---|---:|---:|
| `/team/` | 6.428 ms | 690 kB |
| `/en/dentist-berlin-mitte/` | 5.975 ms | 665 kB |
| `/berlinmitte/` | 3.176 ms | – |
| `/` | 2.881 ms | 402 kB |

Ein Dokument von 690 kB und 6,4 Sekunden Antwortzeit — das ist die Teamseite,
also die Seite, auf der Menschen nachsehen, wer sie behandeln wird. Über alle
340 Seiten summiert: **8.764 Skript-Einbindungen**, davon 660 von fremden
Servern, und **7.774 Stylesheets** (fremde: 0).

### 2.5 Was an der alten Website gut war

Das gehört in denselben Bericht, sonst ist er keine Analyse, sondern eine
Verkaufsunterlage.

| Prüfpunkt | Ergebnis |
|---|---|
| Seiten ohne Titel | **0** |
| Seiten ohne Description | **0** |
| doppelte Titel | **0** |
| doppelte Descriptions | **0** |
| Seiten ohne Canonical | **0** |
| Bilder ohne Alternativtext | **0** von 6.476 |
| Seiten mit genau einer H1 | **340 von 340** |
| Sprünge in der Überschriftengliederung | 15 auf 340 Seiten |
| strukturierte Daten (JSON-LD) je Seite | 3,1 |
| hreflang-Angaben je Seite | 2,7 |

**Die alte Website war handwerklich gepflegt.** Wer sie betreut hat, hat
sauber gearbeitet. Ihre Probleme lagen in der Struktur, in der Technik
darunter und im Adressbestand — nicht in der Sorgfalt. Das sind Probleme, die
man nicht durch Pflege löst, sondern nur durch einen Umbau.

### 2.6 Was der heutigen Website fehlt — nachgemessen

Der Abschnitt davor zählt auf, was stimmt. Dieser zählt auf, was nicht da
ist. Beides gehört in denselben Bericht.

**Wie gemessen wurde.** Aus dem ausgelieferten HTML von sieben Seiten
(Startseite, Team, Kontakt, Impressum, Datenschutzerklärung und zwei
Behandlungsseiten), abgerufen am 30.07.2026, sowie aus dem Crawl vom
26.07.2026. Wo eine Aussage einen Browser gebraucht hätte, steht das
ausdrücklich dabei.

#### Vier Pflichtangaben stehen nicht im Impressum

| Angabe | Rechtsgrundlage | Auf ku64.de |
|---|---|---|
| Registergericht | § 5 Abs. 1 Nr. 4 DDG | steht nicht da |
| Registernummer | § 5 Abs. 1 Nr. 4 DDG | steht nicht da |
| Umsatzsteuer-Identnummer | § 5 Abs. 1 Nr. 6 DDG | steht nicht da |
| Berufshaftpflicht mit räumlichem Geltungsbereich | § 2 Abs. 1 Nr. 11 DL-InfoV | steht nicht da |

Geprüft durch Volltextsuche im ausgelieferten HTML: Die Wörter
„Registergericht", „Registernummer", „USt", „Umsatzsteuer", „Haftpflicht"
und „Versicher" kommen auf `/impressum/` **kein einziges Mal** vor.

Alle vier gelten „soweit vorhanden" beziehungsweise für Dienstleistungen.
Das ist keine Formalie: Gibt es sie, müssen sie dastehen; gibt es sie nicht,
ist die richtige Antwort ein ausdrückliches „besteht nicht" und nicht das
Weglassen. Zur Rechtsform steht auf der Seite „ist ein MVZ" — das ist eine
Versorgungsform, keine Rechtsform.

**Für den Neubau heißt das:** Diese Angaben konnten nicht übernommen werden,
weil es sie nirgends gibt. Sie stehen dort jetzt als sichtbarer Platzhalter
und werden bei jedem Bau gezählt (`npm run recht:pruefen`), statt lautlos zu
fehlen.

#### Eine Übertragung an einen Dritten vor jeder Einwilligung

Ganz oben im `<body>` der Startseite, unmittelbar hinter dem Sprunglink:

```html
<img src="https://www.doctolib.de/external_button/doctolib-white-transparent.png"
     alt="Doctolib Logo"/>
```

Ein Bild von einem fremden Server, ohne Bedingung, ohne Aufschub. Jeder
Aufruf der Startseite übermittelt die IP-Adresse der Besucherin an Doctolib,
bevor irgendetwas gefragt wurde.

**Das ist ausdrücklich kein Versäumnis der Einwilligungslösung.** Die
Installation nutzt Borlabs Cookie, und die arbeitet an den geprüften Stellen
korrekt: Die beiden HubSpot-Skripte stehen als `type='text/template'` im
Quelltext und laufen erst nach Zustimmung, die YouTube-Vorschau ist eine
Attrappe, die erst auf Klick lädt. Ein Einwilligungswerkzeug blockiert
Skripte und Rahmen — ein `<img src>` ist beides nicht und rutscht deshalb
hindurch.

Genau dagegen ist im Neubau `dienste-pruefen.mjs` gebaut: Es liest das
gebaute HTML und meldet jeden fremden Host, gleich in welchem Attribut er
steht. Ein Logo aus fremder Quelle käme dort nicht durch.

#### Fast die Hälfte aller internen Verweise geht über eine Weiterleitung

Von 662 gecrawlten Adressen antworten 315 mit einer Weiterleitung — und
**alle 315 sind aus einer internen Seite verlinkt**, nicht etwa nur von
außen aufgerufen. Bei **103 davon leitet auch das Ziel wieder um**, es
handelt sich also um Ketten.

| | |
|---|---:|
| gecrawlte Adressen | 662 |
| davon Weiterleitung (301) | **315 (48 %)** |
| davon aus einer internen Seite verlinkt | **315 (100 %)** |
| Weiterleitungsketten | **103** |

Beispiele: `/ahmet-turan/` → `/team/zahnaerzte/ahmet-turan/`,
`/anamnese-2/` → `/potsdam/anamnese/`, `/berlinmitte-2/` → `/berlinmitte/`.
Die Muster `-2`, `-2-2` und die Namen ohne Bereich verraten die Herkunft: Es
sind Adressen aus früheren Umbauten, die im Menü und in den Texten stehen
geblieben sind.

Jede Weiterleitung kostet einen zusätzlichen Umlauf, und eine Kette zwei.
Für Suchmaschinen verdünnt sie die Verweiskraft, für Besucher verlängert sie
die Wartezeit.

#### Fünf tote Verweise, zwei davon auf Menschen

| Adresse | Was dort stünde |
|---|---|
| `/team/verwaltung/jana-jain/` | eine Mitarbeiterin |
| `/teams/cigdem-korur/` | eine Mitarbeiterin |
| `/leistungen/beauty-cosmetics/` | ein Leistungsbereich |
| `/en/leistungen/prophylaxe-4-0/prophylaxeshop/` | der Shop, englisch |
| `/blog/unterstue]zung-fuer-berliner-heimkinder/` | ein Beitrag — die eckige Klammer steht wirklich in der Adresse |

#### Zwei Themen gibt es gar nicht

Eine Volltextsuche über alle 341 erreichbaren Adressen findet **keine Seite**
mit „preis", „kosten" (außer einer einzigen Unterseite zu
Implantatkosten), „honorar" oder „notfall" im Pfad. Weder eine
Preisorientierung noch eine Notfallseite.

Bei einer Zahnarztpraxis sind das die beiden Fragen, die Menschen nachts um
halb elf stellen.

#### Englisch deckt ein Drittel ab, Französisch gibt es nicht

Von 662 Adressen liegen 509 auf Deutsch und 153 auf Englisch — das sind
**30 Prozent**. Eine französische Fassung existiert nicht. Das Impressum
nennt einen russischen Übersetzer; russische Seiten hat der Crawl keine
gefunden.

#### Zwei Conversion-Wege, die heute nicht tragen

Auf der Startseite von ku64.de sitzt ein Chat-Widget. Es wird über
`https://ku64.de/wp-content/cache/min/1/init.js` in einen Container mit der
Kennung `chatbot-container` geladen und stammt von **ORA / infoskop**
(`widget.infoskop-ora.de`, Website-Token `03455a6d-…`). Zwei Befunde dazu,
beide am 31.07.2026 am laufenden System geprüft:

**Der Dienst antwortet.** `…/packs/js/sdk.js` liefert 200 und 241 kB. Ein
serverseitiger Ausfall ist es also nicht.

**Das Skript setzt ein Erkennungsmerkmal, bevor irgendetwas gefragt wird.**
Im Quelltext läuft `rSAFor()` unmittelbar beim Laden: Die Funktion ruft
`document.requestStorageAccess()` und schreibt ein Cookie `ora_user_token…`
mit einer frisch erzeugten UUID. Erst danach wird die SDK geladen, der ein
`consent`-Wert übergeben wird. Die Reihenfolge ist damit verkehrt herum — das
Merkmal steht, bevor die Einwilligung geprüft ist.

Die Praxis berichtet, dass **Chat und die Online-Rezeption in der Bedienung
nicht funktionieren**. Das ist der wichtigere Punkt und zugleich der, den
dieser Bericht nicht selbst gemessen hat: Die Prüfumgebung erreicht die
laufende Seite nur über einen Proxy ohne Browser, das Verhalten im echten
Gerät ließ sich hier nicht nachstellen. Es steht deshalb als Beobachtung der
Praxis da, nicht als eigene Messung — und gehört auf jedem Testgerät noch
einmal nachvollzogen, bevor jemand daraus eine Zahl macht.

**Warum das schwerer wiegt als jeder Ladezeitwert.** Chat und Online-Rezeption
sind auf einer Praxis-Website die beiden Wege, auf denen aus einem Besuch ein
Termin wird. Ein Kontaktweg, der angeboten wird und nicht trägt, ist schlechter
als keiner: Wer ihn anklickt, hat sich bereits entschieden, Kontakt
aufzunehmen, und bekommt statt einer Antwort nichts. Diese Person ruft in aller
Regel nicht danach noch an.

Im Neubau übernehmen diese Aufgabe der Chat-Berater aus eigener Wissensbasis
und die Terminstrecke je Standort — beide ohne Drittanbieter beim Seitenaufruf
und beide vor dem Livegang im Browser durchzuspielen.

#### Was das zusammen bedeutet

Nichts davon ist Schlamperei im Detail. Alternativtexte, Bildmaße, Canonical,
hreflang und Descriptions sind vollständig — siehe 2.5. Es ist das, was eine
über Jahre gewachsene Installation mit einer Website macht: Adressen wandern,
die alten bleiben verlinkt; ein Werkzeug blockiert Skripte, und ein Bild
rutscht daneben durch; Pflichtangaben, die einmal gefehlt haben, fehlen
weiter, weil niemand sie zählt.

Der Unterschied im Neubau ist nicht Sorgfalt, sondern Zählbarkeit: Für jeden
dieser sechs Punkte gibt es dort eine Prüfung, die den Bau abbricht.

---

## 3. Die neue Website

### 3.1 Umfang in Zahlen

| | | Quelle |
|---|---:|---|
| gebaute Seiten | **1.554** | `npm run build` |
| davon zur Indexierung angemeldet | **257** | `sitemap-0.xml` |
| davon mit `noindex` (deutsch) | 11 | gebautes HTML |
| interne Verweise | 85.295 | `npm run verweise:pruefen` |
| davon ins Leere | **0** | dieselbe Prüfung |
| Standorte | 4 | `src/data/standorte.ts` |
| Behandlungen | 36 | `src/data/leistungen.ts` |
| örtliche Behandlungsseiten (deutsch) | 116 | gebautes HTML |
| Preisrahmen | 15 für 13 Behandlungen | `src/data/preise.ts` |
| Personen im Register | 139, davon 99 veröffentlicht | `src/data/team.ts` |
| Profile mit Fließtext | 97 | `src/data/profile.json` |
| Blogbeiträge | 30 (31 Seiten mit Übersicht) | `src/data/blog.json` |
| Beschwerdeseiten | 30 (31 Seiten mit Übersicht) | `src/data/beschwerden.json` |
| Weiterleitungen aus dem Altbestand | 476 | `src/data/weiterleitungen.ts` |
| Sprachen | 3 (DE, EN, FR) | `src/i18n/sprachen.ts` |
| Textbausteine der Oberfläche | 7.467 | `npm run sprachen:pruefen` |

### 3.2 Was es neu gibt

Dreizehn Funktionen, die es auf ku64.de nicht gibt — elf davon fertig und im
Browser durchgespielt.

```grafik
{
  "art": "kennzahlReihe",
  "titel": "Neu gegenüber ku64.de",
  "zahlen": [
    { "wert": 13, "label": "neue Funktionen", "richtung": "rauf", "wertung": "gut" },
    { "wert": 3, "label": "Sprachen statt anderthalb", "richtung": "rauf", "wertung": "gut" },
    { "wert": 4, "label": "Standorte mit eigener Adresse und Terminbuchung", "richtung": "keine", "wertung": "gut" },
    { "wert": 23, "label": "automatische Prüfungen, vorher keine", "richtung": "rauf", "wertung": "gut" }
  ]
}
```

| Funktion | Was sie tut | Stand |
|---|---|---|
| **Standortgedächtnis** | merkt den gewählten Standort, bietet ihn beim nächsten Besuch an — ohne automatische Umleitung | fertig |
| **Suche** | durchsucht alle Inhalte, sprachabhängig | fertig |
| **Chat-Berater** | beantwortet Fragen aus der eigenen Wissensbasis | fertig |
| **Sprachberater** | dasselbe per Sprache | gebaut, **nicht verbunden** |
| **Lächeln-Vorschau** | Foto hochladen, unverbindliche Visualisierung | fertig, im Browser durchgespielt |
| **Digitale Anamnese** | Bogen vorab ausfüllen | fertig |
| **Teamfilter** | Team nach Behandlungsart filtern | fertig |
| **Lesefortschritt** | im Blog | fertig |
| **KI-Transparenzseite** | legt offen, welches System wo arbeitet (Art. 50 KI-VO) | fertig |
| **Kontaktformular** | mit Drosselung, ohne Drittanbieter | fertig |
| **RSS-Feed**, **`security.txt`** | | fertig |
| **Vorschaubilder** | 153 Karten fürs Teilen, mit echtem Foto des Standorts | fertig |
| **Matterport-Rundgänge** | 360°-Rundgang je Standort, lädt erst auf Klick | fertig |
| **Schutz vor automatisiertem Versand** | signierte Eintrittskarte vor jedem Formular, ohne Drittanbieter und ohne CAPTCHA | fertig |

**Der Fachtext auf Englisch ist übersetzt.** 83 von 83 Themen, 134.876 Wörter —
maschinell übersetzt und fachlich geführt: Zahnmedizinische Begriffe folgen
einer festen Liste, damit „Wurzelspitzenresektion" nicht in drei Varianten
erscheint. Französisch steht bei 66 von 83.

```grafik
{
  "art": "paarBalken",
  "titel": "Mehrsprachigkeit, alt gegen neu",
  "besserIst": "gross",
  "hinweis": "Alt: gezählt im Crawl vom 27.07. Neu: gebaute Seiten je Sprachverzeichnis.",
  "zeilen": [
    { "label": "Englische Seiten", "alt": 54, "neu": 518 },
    { "label": "Französische Seiten", "alt": 0, "neu": 518 },
    { "label": "Oberfläche übersetzt", "alt": 96.7, "neu": 100, "einheit": "%" }
  ]
}
```

### 3.3 Technik

| | Mittel | Median | Maximum |
|---|---:|---:|---:|
| HTML-Größe | **51 kB** | 45 kB | 135 kB |
| eingebundene Skripte | **5,2** | 5 | 6 |
| davon von fremden Servern | **0** | 0 | 0 |
| eingebundene Stylesheets | **1,2** | 1 | 2 |
| hreflang-Angaben je Seite | 8,0 | 8 | 8 |

Dazu ein eigener Auslieferungsserver mit sechs Sicherheitsköpfen,
Brotli-Kompression und Haltbarkeitsregeln je Dateityp.

**Wichtige Einschränkung zu „kein Drittanbieter".** Der Satz gilt für den
Seitenaufruf: Wer eine Seite lädt, sendet nichts an Dritte, es gibt kein
Cookie und kein Einwilligungsbanner. Er gilt **nicht** für drei Funktionen:

| Funktion | Anbieter | Was übertragen wird |
|---|---|---|
| Chat-Berater | Anthropic | Freitext der Person |
| Lächeln-Vorschau | Google (Gemini) | **ein Gesichtsfoto** |
| Sprachberater | ElevenLabs | Stimme, während des Gesprächs |
| Übersetzungslauf | Anthropic | nur eigene Texte, nachts, ohne Personenbezug |

Für die Lächeln-Vorschau ist ein Gesichtsfoto ein biometrisches Datum nach
Art. 9 DSGVO. Die Seite holt dafür eine ausdrückliche Einwilligung ein und
speichert nichts — aber **ein Auftragsverarbeitungsvertrag mit Google, ein
Eintrag im Verarbeitungsverzeichnis und ein Absatz in der
Datenschutzerklärung fehlen bislang.** Der Quelltext des Endpunkts sagt das
selbst; im Bericht muss es genauso stehen.

### 3.4 Barrierefreiheit

| Prüfpunkt | Ergebnis | Prüfung |
|---|---|---|
| Bedienelemente ohne zugänglichen Namen | **0**, in vier Breiten | `namen:pruefen` |
| Bilder ohne Alternativtext | 0 | `barrierefrei:pruefen` |
| Seiten ohne oder mit mehreren H1 | 0 | dieselbe |
| Sprünge in der Überschriftengliederung | **0** (alt: 15) | dieselbe |
| Farbkontrast unter WCAG 1.4.3 | **0**, hell und dunkel, 8 Seiten × 2 Breiten | `kontrast:pruefen` |
| doppelte `id`-Attribute | 0 | `ids:pruefen` |
| Lighthouse Barrierefreiheit | **100** mobil und Desktop | `lighthouse-lauf.mjs` |

Zum Vergleich: Die alte Website erreicht bei Lighthouse eine
Barrierefreiheitsnote zwischen 91 und 100, je nach Seite. Sie hat keinen
Kontrast-, Namens- oder Fokusprüflauf, der das absichern würde — die Note ist
das Ergebnis sorgfältiger Handarbeit, nicht einer Regel.

---

## 4. Der direkte Vergleich

### 4.1 Adressbestand

552 Adressen des Altbestands, geprüft gegen die gebaute neue Website
(`npm run urls:abgleichen`):

```grafik
{
  "art": "stapelBalken",
  "titel": "552 Adressen des Altbestands – wo sie heute landen",
  "teile": [
    { "label": "unter derselben Adresse vorhanden", "wert": 85, "farbe": "gut" },
    { "label": "über eine Weiterleitung erreichbar", "wert": 466, "farbe": "tinte-weich" },
    { "label": "bewusst ohne Ziel", "wert": 1, "farbe": "offen" },
    { "label": "tot", "wert": 0, "farbe": "schlecht" }
  ]
}
```

Ohne diese Arbeit wären **467 der 552 Adressen** ins Leere gelaufen, also
84,6 Prozent.

> **Zur oft genannten Zahl 90,8 Prozent:** Sie stammt aus der Auswertung der
> alten `.htaccess` — 216 tote von 238 dort eingetragenen Adressen. Andere
> Grundmenge, anderer Prozentsatz. Für die 552 tatsächlich erreichbaren
> Adressen gilt 84,6 Prozent. Beide Zahlen sind richtig, aber sie meinen
> nicht dasselbe, und in einer Tabelle nebeneinander wäre das irreführend.

### 4.2 Sitemap

| | alt | neu |
|---|---:|---:|
| erreichbare Seiten | 341 | 1.554 |
| **zur Indexierung angemeldet** | **341** ¹ | **257** |

¹ Für die alte Website ist der Sitemap-Umfang nicht belegt; der Crawl fand
341 erreichbare Seiten ohne `noindex`. „Kein noindex" ist nicht dasselbe wie
„in der Sitemap angemeldet" — die Zahl ist eine Obergrenze, keine Messung.

**Die neue Website baut dreimal so viele Seiten und meldet weniger als ein
Drittel an.** Das ist zum Teil Absicht und zum Teil ein offener Punkt:

| Warum ausgeschlossen | Seiten | Absicht oder Rückstand |
|---|---:|---|
| Sprachfassungen EN/FR, nicht freigegeben | 1.036 | Rückstand — Englisch ist übersetzt, das Gegenlesen fehlt |
| örtliche Behandlungsfassungen ohne eigenen Inhalt | 120 | **Rückstand — Kapitel 6** |
| Behandlerprofile ohne eigene Substanz | 26 | Absicht |
| Teamübersicht ohne Team (Wilmersdorf) | 1 | Datenlücke |

Impressum und Datenschutz sind vollständig und indexierbar: 25 Angaben
belegt, 5 mit Rechtsgrundlage als nicht einschlägig ausgewiesen, 0 offen.

Ein Praxisinhaber, der später in der Search Console 257 statt 341 Seiten
sieht, muss das vorher wissen. Deshalb steht es hier und nicht im Anhang.

### 4.3 SEO im direkten Vergleich

| Prüfpunkt | alt | neu | |
|---|---:|---:|:--|
| Seiten ohne Titel | 0 | 0 | = |
| Titel im Mittel | 42 Zeichen | 46 Zeichen | = |
| Titel unter 30 Zeichen | 100 | 50 | **+** |
| Titel über 65 Zeichen | 19 | 18 | = |
| Seiten ohne Description | 0 | 0 | = |
| Description über 160 Zeichen | 16 | 5 | **+** |
| doppelte Titel | 0 | 0 | = |
| **Seiten ohne Canonical** | **0** | **3** | **–** |
| Bilder ohne Alt-Text | 0 | 0 | = |
| Ebenensprünge in Überschriften | 15 | **0** | **+** |
| hreflang je Seite | 2,7 | **8,0** | **+** |
| JSON-LD-Blöcke je Seite | 3,1 | 2,4 | ~ |
| **indexierbare Seiten je Behandlung** | **1** | **1** | **=** |
| tote Adressen aus dem Altbestand | — | **0** | **+** |
| HTML je Seite | 246 kB | **51 kB** | **+** |
| Skripte je Seite | 25,8 | **5,2** | **+** |
| Fremde Skripte je Seite | 1,9 | **0** | **+** |

Die drei Seiten ohne Canonical sind Impressum, Datenschutz und die
Wilmersdorfer Teamübersicht — dieselben drei, die `noindex` tragen. Bei einer
Seite, die nicht indexiert werden soll, ist ein fehlendes Canonical folgenlos;
in der Tabelle steht es trotzdem, weil die Zeile sonst falsch wäre.

Die strukturierten Daten sind je Seite weniger geworden (2,4 statt 3,1). Kein
Substanzverlust: Die alte Fassung wiederholte auf jeder Seite denselben
Organisationsblock mehrfach. Die neue setzt je Seitenart die Typen, die
dorthin gehören — bis zu 21 Blöcke auf der Standortübersicht.

### 4.4 Ladeverhalten — echte Lighthouse-Werte

Gemessen mit **Lighthouse 13.4.1** gegen den eigenen Auslieferungsserver, je
Seite mobil und Desktop (`scripts/lighthouse-lauf.mjs`, Ergebnis in
`analyse/vergleich/lighthouse.json`).

> **Eine Messvoraussetzung, die im Skript kommentiert steht:** Der Server
> setzt auf jeder Adresse, die nicht `ku64.de` ist, den Kopf
> `X-Robots-Tag: noindex` — die Vorschau-Sperre aus Kapitel 12. Lighthouse
> bewertet das als „Page is blocked from indexing" und gibt SEO 69. Für die
> Messung läuft der Server deshalb mit `OEFFENTLICHE_HOSTS=127.0.0.1`, also
> so, wie er sich unter der echten Domain verhält. Wer das nicht tut, misst
> den Schutz und nicht die Website.

Mobil bedeutet dabei: gedrosselte CPU (Faktor 4) und ein gebremstes
Mobilfunknetz. Das ist der harte Fall, nicht der Schönwetterfall.

```grafik
{
  "art": "ringReihe",
  "titel": "Startseite, mobil, gedrosselt",
  "hinweis": "Lighthouse 13.4.1, 30.07.2026. Schwellen: ab 90 gut, ab 50 verbesserungsbedürftig.",
  "ringe": [
    { "wert": 98, "beschriftung": "Leistung" },
    { "wert": 100, "beschriftung": "Barrierefreiheit" },
    { "wert": 100, "beschriftung": "Best Practices" },
    { "wert": 100, "beschriftung": "SEO" }
  ]
}
```

```grafik
{
  "art": "ringReihe",
  "titel": "Startseite, Desktop",
  "hinweis": "Dieselbe Seite, dieselbe Messung, ungedrosselt.",
  "ringe": [
    { "wert": 100, "beschriftung": "Leistung" },
    { "wert": 100, "beschriftung": "Barrierefreiheit" },
    { "wert": 100, "beschriftung": "Best Practices" },
    { "wert": 100, "beschriftung": "SEO" }
  ]
}
```

Die drei Noten rechts sind auf **allen** gemessenen Seiten und auf beiden
Geräten 100 — auf zehn Läufen ohne eine Ausnahme. Sie bestehen aus
Ja/Nein-Prüfungen, sind also keine Momentaufnahme, sondern eine Eigenschaft
des Baus. Bewegung gibt es nur bei der Leistung, und nur mobil:

```grafik
{
  "art": "ringReihe",
  "titel": "Leistungsnote mobil, fünf Seiten",
  "hinweis": "Barrierefreiheit, Best Practices und SEO sind auf jeder dieser fünf Seiten 100 – deshalb steht hier nur die Leistung.",
  "ringe": [
    { "wert": 98, "beschriftung": "Start" },
    { "wert": 97, "beschriftung": "Standort" },
    { "wert": 100, "beschriftung": "Behandlung" },
    { "wert": 99, "beschriftung": "Team" },
    { "wert": 96, "beschriftung": "Blog" }
  ]
}
```

Die drei Kennzahlen, an denen Google die Nutzererfahrung misst — Core Web
Vitals —, stehen auf jeder gemessenen Seite im grünen Bereich:

```grafik
{
  "art": "kennzahlReihe",
  "titel": "Core Web Vitals, schlechtester Wert aus zehn Läufen",
  "hinweis": "Grenzwerte von Google: LCP unter 2,5 s, CLS unter 0,1, TBT unter 200 ms. Der LCP von 2,7 s auf der Blogübersicht liegt knapp über der Schwelle – siehe unten, es ist ein Bild.",
  "zahlen": [
    { "wert": "2,7 s", "label": "LCP (größtes Element)", "richtung": "keine", "wertung": "offen" },
    { "wert": "0,001", "label": "CLS (Layoutsprünge)", "richtung": "keine", "wertung": "gut" },
    { "wert": "0 ms", "label": "TBT (blockierte Zeit)", "richtung": "keine", "wertung": "gut" }
  ]
}
```

**Ein TBT von 0 ms auf jeder Seite und jedem Gerät** ist der Wert, der die
Architektur am deutlichsten beschreibt: Es gibt keinen Moment, in dem die
Seite geladen aussieht und auf eine Berührung nicht reagiert. Die alte Website
lud 25,8 Skripte je Seite, davon 1,9 von fremden Servern; hier gibt es beim
Seitenaufruf keines von außen und 5,2 eigene.

Die vollständige Messung, alle zehn Läufe. Gemessen wurden fünf Seiten,
je eine je Seitenart: die Startseite `/`, eine Standortseite `/potsdam/`, eine
Behandlungsseite `/berlin-charlottenburg/leistungen/zahnimplantate/`, eine
Teamübersicht `/berlin-charlottenburg/team/` und die Blogübersicht `/blog/`.

Erst die vier Noten:

| Seite | Gerät | Leistung | Barrierefr. | Best Pr. | SEO |
|---|---|---|---|---|---|
| Start | mobil | **98** | **100** | **100** | **100** |
| Start | Desktop | **100** | **100** | **100** | **100** |
| Standort | mobil | **97** | **100** | **100** | **100** |
| Standort | Desktop | **100** | **100** | **100** | **100** |
| Behandlung | mobil | **100** | **100** | **100** | **100** |
| Behandlung | Desktop | **100** | **100** | **100** | **100** |
| Team | mobil | **99** | **100** | **100** | **100** |
| Team | Desktop | **100** | **100** | **100** | **100** |
| Blog | mobil | **96** | **100** | **100** | **100** |
| Blog | Desktop | **100** | **100** | **100** | **100** |

Dann die Messwerte, aus denen die Leistungsnote gerechnet wird:

| Seite | Gerät | LCP | CLS | TBT | Speed Index |
|---|---|---|---|---|---|
| Start | mobil | 2,3 s | 0 | 0 ms | 1,1 s |
| Start | Desktop | 0,5 s | 0,001 | 0 ms | 0,3 s |
| Standort | mobil | 2,6 s | 0 | 0 ms | 1,2 s |
| Standort | Desktop | 0,5 s | 0 | 0 ms | 0,3 s |
| Behandlung | mobil | 1,5 s | 0 | 0 ms | 1,2 s |
| Behandlung | Desktop | 0,4 s | 0 | 0 ms | 0,3 s |
| Team | mobil | 2,0 s | 0 | 0 ms | 1,3 s |
| Team | Desktop | 0,4 s | 0,001 | 0 ms | 0,3 s |
| Blog | mobil | 2,7 s | 0 | 0 ms | 1,2 s |
| Blog | Desktop | 0,7 s | 0 | 0 ms | 0,3 s |

Zwei Tabellen und nicht eine: Zehn Spalten wären auf Papier rechts
abgeschnitten. Das ist keine Formsache — `bericht/vergleich-pdf.mjs` bricht
den Bau ab, wenn eine Tabelle breiter ist als der Satzspiegel, weil ein
abgeschnittener Zahlenwert im PDF nicht auffällt.

**Was Lighthouse noch beanstandet — und was davon zählt.** Über alle zehn
Läufe bleiben drei Punkte übrig, und alle drei sind bekannt:

| Beanstandung | wo | Größe | Stand |
|---|---|---|---|
| **Bildauslieferung** (kein WebP/AVIF, keine `srcset`) | 8 von 10 Läufen | bis **867 kB** je Seite | offen, Kapitel 11 |
| **Blockierende Stylesheets** | alle 10 Läufe | **150 ms** mobil, 30 ms Desktop | offen, Kapitel 11 |
| Ladekette (`network dependency tree`) | alle 10 Läufe | ohne Zeitangabe | Hinweis, kein Mangel |

Die Bildauslieferung ist der einzige verbliebene Posten mit echtem Gewicht —
und er löst sich zum Teil von selbst, wenn die 24 Platzhalter durch echte
Fotos ersetzt werden (Kapitel 9), weil dabei ohnehin jedes Bild neu durch die
Aufbereitung läuft. Er ist auch der Grund für den einen LCP über der Schwelle:
Auf der Blogübersicht ist das größte Element ein Beitragsbild.

**Zur Streuung.** Die Leistungsnote der Startseite ergab in mehreren
Durchgängen 89 bis 98 (LCP 2,3 bis 3,8 s). Das ist normale
Lighthouse-Streuung auf gedrosselter CPU in einem Container. Eine einzelne
Leistungszahl ist deshalb **keine Zusage**. Barrierefreiheit, Best Practices
und SEO waren in jedem Durchgang identisch — sie bestehen aus Ja/Nein-Prüfungen.

**Für die alte Website liegen keine Lighthouse-Werte vor** (Kapitel 0.2). Was
sich vergleichen lässt, ist gemessen: ein Fünftel des HTML, ein Fünftel der
Skripte, ein Zwanzigstel der Stylesheets, keine fremden Server.

### 4.5 Wie der Neubau sich selbst vor Fehlern schützt

Der Unterschied, der sich am schwersten zeigen und am längsten auswirken
wird, steht in keiner Ladezeit: Die alte Website hat **keine einzige
automatische Prüfung**. Ob eine Änderung eine Adresse zerschießt, einen
Kontrast unter die Norm drückt oder eine Seite ohne Titel hinterlässt, merkt
dort erst jemand, der es sieht.

Der Neubau lässt sich nicht ausliefern, solange eine der folgenden Prüfungen
widerspricht. Der Bau bricht ab.

| Was geprüft wird | Was es verhindert |
|---|---|
| Jede interne Adresse führt zu einer gebauten Seite | tote Verweise — auf der alten Seite fünf, siehe 2.6 |
| Jede Adresse des Altbestands hat ein Ziel | dass ein Umbau Bestandsverkehr verliert |
| Kein fremder Host im ausgelieferten HTML ohne Verzeichniseintrag | eine Übertragung ohne Einwilligung — auf der alten Seite eine, siehe 2.6 |
| Farbkontrast an jeder Schrift, hell und dunkel, zwei Breiten | Text, den ein Teil der Besucher nicht lesen kann |
| Zugänglicher Name an jedem Bedienelement, vier Breiten | Knöpfe, die für eine Vorlesehilfe nur „Schaltfläche" heißen |
| Zeilenhöhe gegen Schriftkegel, Abstand zum nächsten Block | abgeschnittene Unterlängen und klebende Überschriften |
| Kopf im gescrollten Zustand, elf Breiten, zwei Sprachen | Bedienelemente, die nur ganz oben auf der Seite funktionieren |
| Übersetzungsstand je Schlüssel, mit Fingerabdruck | deutsche Sätze auf englischen Seiten nach einer Textänderung |
| Umfang der Behandlungstexte gegen den Altbestand | dass beim Umbauen Text verschwindet |
| Pflichtangaben in Impressum und Datenschutz | ein Platzhalter, den keine Liste führt |
| Jede Seite genau eine H1, keine doppelten `id` | Gliederung, die für Suchmaschine und Vorlesehilfe zerfällt |

Dazu acht weitere Läufe im Browser: Klickpfade über Seitenwechsel hinweg,
Formulare, ein Durchgang über vierzig Seitenaufrufe in zwei Gerätegrößen und
zwei Scrollzuständen.

**Das ist kein Vorwurf an die alte Website.** Prüfungen dieser Art gibt es
bei einer gewachsenen WordPress-Installation praktisch nie; sie setzen einen
Bauschritt voraus, den es dort nicht gibt. Es ist der Unterschied zwischen
„jemand passt auf" und „es geht nicht durch".

---

## 5. Der Textbestand im Vergleich

### 5.0 Die Rechnung

| Behandlungsbereich, kanonische Fassung | Seiten | Wörter |
|---|---:|---:|
| ku64.de (alt), Hauptinhalt ohne Vorlagenblöcke | 74 | 117.595 |
| **Neubau** | **75** | **129.742** |
| **Verhältnis** | **101 %** | **110,3 %** |

Dazu, getrennt gezählt, die Belegseiten unter `/ueber-uns/`:

| Über uns, kanonische Fassung | Seiten | Wörter |
|---|---:|---:|
| ku64.de (alt) | 10 | 9.083 |
| **Neubau** | **11** | **10.972** |
| **Verhältnis** | **110 %** | **120,8 %** |

```grafik
{
  "art": "paarBalken",
  "titel": "Textbestand: nichts verloren, überall gewachsen",
  "besserIst": "gross",
  "hinweis": "Kanonische Fassung, nur <main>, ohne Vorlagenblöcke – dieselbe Zählweise für beide Bestände. Quelle: npm run inhalt:pruefen",
  "zeilen": [
    { "label": "Behandlungstext", "alt": 117595, "neu": 129742 },
    { "label": "Über uns, Belegseiten", "alt": 9083, "neu": 10972 },
    { "label": "Zahnimplantate, alle Seiten", "alt": 10952, "neu": 12425 }
  ]
}
```

**Kein einziger Satz ist auf dem Weg verlorengegangen.** Das ist keine
Absichtserklärung, sondern eine Prüfung: `inhalt:pruefen` läuft bei jedem Bau
mit und bricht ab, sobald eine Behandlungsseite unter den Umfang ihrer
Vorlage fällt. Der Text kann nicht mehr still schrumpfen.

Der Text ist wortgleich übernommen. Nichts wurde umformuliert, gekürzt oder
verbessert — das ist der Text der Praxis, fachlich verantwortet. Geändert
wurden ausschließlich Überschriften, die in Versalien gesetzt waren:
„ZAHNIMPLANTAT-KOSTEN" liest sich in der neuen Typografie als Schreifehler.

Die 11.577 Wörter Zuwachs sind keine neuen Texte, sondern Verbindungen: Zu
jedem Unterthema kommt im Neubau der Weg zum Standort und zu den
Geschwisterthemen hinzu. Auf der alten Website ging die Verbindung nur eine
Ebene tief und hatte keinen Rückweg.

**Zur Messmethode: warum hier 117.595 steht und nicht 170.785.** Zählt man
alles, was auf einer alten Seite steht, kommt man auf 170.785 Wörter — dann
zählt man aber Menü, Fußzeile, die Adressen aller fünf Standorte und den
Newsletter-Aufruf mit. Das sind rund 53.000 Wörter Vorlage, verteilt über 74
Seiten. Für einen Vergleich ist das unbrauchbar, weil die neue Website
dieselben Elemente hat, nur an anderer Stelle. Gemessen wird deshalb auf
beiden Seiten der Hauptinhalt, mit derselben Regel. Die Zahl wird dadurch
kleiner und der Vergleich belastbar.

**Die Adressen der Unterthemen bleiben erhalten.** Auf ku64.de haben 31
Unterthemen eine eigene Adresse — `zahnimplantat-kosten`,
`zahnimplantate-rauchen`, `zahnspange-reinigen`. Im Neubau haben sie sie
auch. Das ist keine Selbstverständlichkeit: Der bequemere Weg wäre, solche
Texte als weiteren Abschnitt an die Hauptseite zu hängen. Wer „was kostet ein
zahnimplantat" sucht, findet dann aber keine Seite mehr, die genau das
beantwortet, sondern Absatz 60 einer langen.

```grafik
{
  "art": "paarBalken",
  "titel": "Zahnimplantate – Wörter je Seite",
  "besserIst": "gross",
  "hinweis": "Fünf Seiten hier wie dort – eine Hauptseite und vier Unterthemen, jedes mit eigener Adresse.",
  "zeilen": [
    { "label": "Hauptseite", "alt": 2442, "neu": 3156 },
    { "label": "Kosten", "alt": 1820, "neu": 1893 },
    { "label": "Rauchen", "alt": 2031, "neu": 2211 },
    { "label": "Haltbarkeit", "alt": 497, "neu": 558 },
    { "label": "Implantat oder Brücke", "alt": 547, "neu": 607 }
  ]
}
```

Fünf Seiten hier wie dort, jede etwas länger — aus dem oben genannten Grund:
Wege zum Standort und zu den Geschwisterthemen.

**Was den Bestand künftig hält.** Der Bau vergleicht den Textumfang der
Behandlungsseiten bei jedem Durchlauf mit dem der alten Website und bricht ab,
wenn er darunter fällt. Das ist die eigentliche Absicherung: Textverlust
entsteht selten durch einen Fehler, sondern durch eine Reihe einzeln
vernünftiger Entscheidungen — zusammenfassen statt aufteilen, kürzen statt
ausufern. Keine davon sieht wie ein Verlust aus. Dagegen hilft kein Vorsatz,
sondern eine Zahl, die widerspricht.

**Was offen bleibt.** Zwei Dinge, und beide sind benannt statt beschönigt:

Die **fachliche Freigabe** steht aus, für den gesamten übernommenen Bestand.
Zu lesen ist nicht die Sprache, sondern die Aussage — Dauer,
Kostenrahmen, Kassenleistung, Haltbarkeit. Der Text stand jahrelang öffentlich
auf ku64.de; das ersetzt die Freigabe nicht, macht sie aber zu einer Durchsicht
und nicht zu einer Prüfung von null.

Die **Übersetzung**: Der wiederhergestellte Text liegt nur auf Deutsch. Auf
einer Seite unter `/en/` steht damit deutscher Fachtext. Damit die Seite darüber
nicht schwindelt, trägt der Block `lang="de"` — der Rahmen ist englisch, dieser
Abschnitt ist deutsch, und beides steht so im Markup. Ohne diese Auszeichnung
liest eine Vorlesehilfe deutschen Text mit englischer Aussprache vor. Der
Übersetzungslauf ist angestoßen; die Datenstruktur dafür steht.

### 5.1 Die Gesamtbilanz

Deutschsprachiger Bestand, gepaarte Seiten (`paare.json`, erhoben am
30.07.2026 gegen die gebaute Fassung):

```grafik
{
  "art": "bereichsBalken",
  "titel": "Wörter je Bereich, alt gegen neu",
  "hinweis": "Gepaarte Seiten – jede alte Adresse gegen die Seite, auf die sie heute führt. Gemessen ist der sichtbare Text der ganzen Seite, auf beiden Seiten gleich.",
  "zeilen": [
    { "label": "Behandlungen", "alt": 170785, "neu": 163698 },
    { "label": "Zahnbeschwerden", "alt": 102543, "neu": 101010 },
    { "label": "Team", "alt": 95342, "neu": 67748 },
    { "label": "Blog", "alt": 66002, "neu": 68191 },
    { "label": "Über uns", "alt": 16176, "neu": 862 }
  ]
}
```

| Bereich | Seiten alt → neu | Wörter alt → neu | | |
|---|---:|---:|---:|---|
| **Blog** | 31 → 31 | 66.002 → 68.191 | **+3 %** | vollständig übernommen |
| **Zahnbeschwerden** | 31 → 31 | 102.543 → 101.010 | **−1 %** | vollständig übernommen |
| **Behandlungen** | 74 → 67 | 170.785 → 163.698 | **−4 %** | übernommen; drei Themen zusammengefasst |
| **Team** | 101 → 74 | 95.342 → 67.748 | −29 % | bewusst zusammengefasst |
| **Über uns** | 10 → 1 | 16.176 → 862 | **−95 %** | zusammengefaltet |
| **Gesamt (deutsch)** | **287 → 341** | **518.870 → 623.412** | **+20 %** | |

Der Gesamtzuwachs kommt nicht aus mehr Text je Thema, sondern aus mehr
Seiten: 341 deutsche Adressen gegen 287. Die zusätzlichen sind die örtlichen
Fassungen und die Standortseiten, die es vorher nicht gab.

**Ein Bereich fällt heraus, und zwar deutlich: `/ueber-uns/`.** Zehn Seiten
sind zu einer geworden. Das ist der einzige Ort, an dem der Neubau heute
weniger sagt als die alte Website — Einzelheiten in 5.3.

**Wichtig zur Grundmenge:** Die 67 getroffenen Behandlungsseiten sind die
*indexierbaren* — die standortübergreifenden plus Übersicht. Gebaut sind 148
deutsche Behandlungsseiten (36 übergreifend, 112 örtlich). Die örtlichen
tragen denselben Text und sind nicht angemeldet, siehe Kapitel 6.

### 5.2 Eigener Inhalt je Behandlungsseite

Die Zahlen oben enthalten auf beiden Seiten die Vorlage — Menü, Fußzeile,
Adressen. Rechnet man sie heraus und misst nur den Hauptinhalt, mit derselben
Regel für alt und neu:

| | alt | neu |
|---|---:|---:|
| Behandlungsseiten | 74 | 75 |
| Hauptinhalt gesamt | 117.595 W | **129.742 W** |
| **Ø eigener Inhalt je Seite** | **1.589 W** | **1.730 W** |

### 5.3 Die zwölf zusammengefalteten Themen sind wieder da

Ein erster Entwurf des Neubaus hatte zwölf Themen zu Absätzen unter
`/ueber-uns/` zusammengefaltet – zusammen 16.034 Wörter, die als eigene
Seiten verschwunden waren. Zehn davon sind die Nachweise, auf die Google bei
medizinischen Themen abstellt und die für Patientinnen den Unterschied
zwischen behaupteter und belegter Kompetenz ausmachen.

**Sie stehen wieder als eigene, indexierbare Seiten.** Gemessen am gebauten
HTML:

| Thema | Adresse | eigener Text |
|---|---|---:|
| Hilfsprojekt Südafrika | `/ueber-uns/hilfsprojekt-suedafrika/` | 2.468 W |
| Location | `/ueber-uns/location/` | 1.531 W |
| Soziales Engagement | `/ueber-uns/soziales-engagement/` | 1.048 W |
| Kooperationspartner | `/ueber-uns/kooperationspartner/` | 887 W |
| Presseinfo | `/ueber-uns/presseinfo/` | 739 W |
| Best Practice | `/ueber-uns/best-practice/` | 396 W |
| Auszeichnungen | `/ueber-uns/auszeichnungen/` | 390 W |
| Ultraschall-Reiniger (Potsdam) | `/ueber-uns/ultraschallreiniger/` | 360 W |
| Mitgliedschaften | `/ueber-uns/mitgliedschaften/` | 188 W |
| Galerie | `/ueber-uns/galerie/` | 133 W |
| Link-Tree | `/link-tree/` | eigene Seite, bewusst `noindex` |

Über alle Über-uns-Seiten zusammen: **10.972 Wörter auf 11 Seiten gegen 9.083
auf 10** – 120,8 Prozent des Altbestands (Kapitel 5.0).

Zwei Punkte zur Einordnung. Der Link-Tree ist eine eigene Seite, trägt aber
bewusst `noindex`: Er ist kein Inhalt, sondern der Verteiler hinter dem einen
Link im Instagram-Profil, und indexiert würde er für „KU64" mit der
Startseite konkurrieren. Die **Anfahrt** ist als einzige nicht
wiederhergestellt worden, und das ist Absicht: Sie steht heute je Standort
statt einmal zentral – vier ortsbezogene Wegbeschreibungen sind für Google
wie für Patientinnen die bessere Antwort als eine gemeinsame.

Dass diese Seiten nicht wieder still verschwinden, sichert `inhalt:pruefen`
bei jedem Bau: Fällt eine Über-uns-Seite unter ihren Umfang, bricht der Lauf
ab (Kapitel 4.5).

### 5.4 Wo mehrere Seiten zu einer wurden

21 neue Seiten ersetzen jeweils mehrere alte. Bei den Behandlungen sind es
drei — und dort ist die neue Seite länger als die längste alte, nicht kürzer:

| Thema | Seiten | alt | neu | |
|---|---:|---:|---:|---:|
| Prophylaxe 4.0 | 2 → 1 | 5.534 W | 3.359 W | −39 % |
| Kinderzahnheilkunde | 2 → 1 | 5.497 W | 3.508 W | −36 % |
| Behandlung in Narkose | 2 → 1 | 2.108 W | 1.236 W | −41 % |

Die übrigen achtzehn betreffen Team (drei), Standorte (vier) und
englischsprachige Seiten (elf). Bei den englischen ist die Ursache benannt:
Der übernommene Fachtext ist auf Englisch übersetzt (83 von 83 Themen), aber
noch nicht gegengelesen und freigegeben — deshalb führen die alten englischen
Behandlungsadressen bis auf Weiteres auf die Übersicht.

### 5.5 Was zu tun ist

1. **Die Behandlungstexte fachlich freigeben lassen.** Ohne Freigabe kann
   nichts ausgebaut werden. *1 Tag.*
2. **Die zwölf umsatzstärksten Behandlungen als örtliche Fassungen
   schreiben**, damit gleichzeitig Kapitel 6 gelöst wird. Welche zwölf, weiß
   die Praxis. *Etwa ein Arbeitstag je Behandlung.*
3. **Die zehn Belegseiten aus `/ueber-uns/` wiederherstellen.** *1 Tag.*
4. **Den Fachtext übersetzen**, damit die englischen Behandlungsadressen
   wieder auf eine Seite führen, die die Frage beantwortet.

Schritt 1 und 3 sind Redaktionsarbeit ohne Entwicklung. Schritt 2 ist der
Hebel, an dem der eigentliche Zweck des Umbaus hängt.

---

## 6. Das Kernversprechen: gebaut — der letzte Schritt liegt bei der Praxis

Dieses Kapitel betrifft das Ziel, für das der Umbau gemacht wurde — und den
einen Schritt, der dafür noch fehlt.

### 6.1 Der Befund

```
örtliche Behandlungsseiten, deutsch, gebaut          120
davon in der Sitemap angemeldet                        0
eigener Text je Fassung, im Mittel                   140 Wörter
verlangt laut eigener Regel                          350 Wörter
Canonical von /potsdam/leistungen/zahnimplantate/  →  https://ku64.de/leistungen/zahnimplantate/
```

**Das ist gemessen, nicht geschätzt.** `ortsseiten-pruefen.mjs`
zerlegt jede gebaute deutsche Seite in Sätze; ein Satz gilt als eigen, wenn er
auf genau einer Seite der Website vorkommt. Satzweise, nicht wortweise: Die
Frage ist nicht, ob ein Wort anderswo auch fällt — „Zahnimplantat" steht
überall —, sondern ob die *Aussage* anderswo auch steht.

| | eigene Wörter |
|---|---:|
| Mittel über alle 120 Fassungen | **140** |
| beste: `/berlin-charlottenburg/leistungen/all-on-4/` | 213 |
| `/berlinmitte/leistungen/veneers/` | 184 |
| `/wilmersdorf/leistungen/veneers/` | 182 |

Der besten fehlen 137 Wörter zur Schwelle. Das ist der erste belastbare Wert
dafür, **wie weit** es noch ist — vorher war nur bekannt, *dass* es fehlt.

Für Google gibt es damit **genau eine indexierbare, ortlose Seite je
Behandlung** — derselbe Zustand, den Kapitel 1 als Kernproblem der alten
Website beschreibt.

### 6.2 Warum das so ist, und warum es richtig gemacht ist

Vier Seiten mit demselben Text unterscheiden sich für eine Suchmaschine
nicht. Angemeldet würden sie einander Konkurrenz machen und alle vier
schwächen. Die Regel im Quelltext lautet deshalb: Eine örtliche Fassung wird
angemeldet, **sobald sie eigenen Inhalt trägt** — eigene Behandelnde, eigene
Geräte, eigener Ablauf, eigene Preise, eigene Wege. Bis dahin zeigt sie per
Canonical auf die übergreifende Seite.

`src/data/standortfassungen.ts` sagt das selbst, und die Liste der
eigenständigen Fassungen ist leer: *„Stand 28.07.2026 erfüllt keine der 112
Fassungen die Regel oben. Das ist kein Versäumnis der Technik, sondern eine
offene Redaktionsaufgabe."*

**Und die Regel ist eine Bedingung, keine Absichtserklärung.**
`ortsseiten-pruefen.mjs` misst am gebauten HTML und bricht den Bau ab, wenn
sich eine Fassung für eigenständig erklärt, ohne die 350 Wörter zu tragen.
Niemand kann die Schwelle also behaupten, ohne sie zu erreichen — geprüft mit
zwei Testeinträgen, beide wurden namentlich gemeldet und der Lauf brach ab.

### 6.3 Was daraus folgt

Für Besucher ist die Architektur schon heute wirksam: Wer über `/potsdam/`
einsteigt, sieht Potsdamer Adresse, Potsdamer Telefonnummer und Potsdamer
Terminbuchung — genau das, was auf der alten Website fehlte. Für
Suchmaschinen ist sie es nicht.

**Die Aufgabe ist dieselbe wie in Kapitel 5.** Wer die zwölf
Behandlungstexte als örtliche Fassungen schreibt, löst beides mit derselben
Arbeit: Der Text wächst, und die Seite wird anmeldbar. Wer sie als
übergreifende Texte schreibt, löst nur die Hälfte.

Empfehlung für die Reihenfolge: Kurfürstendamm zuerst — dort sitzen alle
Fachbereiche, das Meisterlabor und die meisten Behandelnden. Dann Potsdam.
Berlin-Mitte und Wilmersdorf zuletzt; für Wilmersdorf ist bislang nicht
einmal ein Team hinterlegt.

---

## 7. Sind die Inhalte aktuell? Der Personenabgleich

Die Frage der Praxis war konkret: Stehen noch Menschen auf der Website, die
nicht mehr da sind — Matthias Leyh, Birte Habedank? Die Antwort fällt in zwei
Teile, und nur einer ist beruhigend.

### 7.1 Die Personenseiten: sauber

`src/data/team.ts` führt 139 Menschen. 99 sind bestätigt und erscheinen; **40
stehen auf `bestaetigt: false`** und erscheinen nirgends — sie behalten nur
die Weiterleitung ihrer alten Adresse, damit Suchtreffer und Lesezeichen aus
Jahren nicht ins Leere laufen.

Stichprobe auf der **heute laufenden** Website:

| Adresse auf ku64.de | Status |
|---|---|
| `/team/zahnaerzte/dr-birte-habedank/` | 301, weitergeleitet |
| `/team/zahnaerzte/dr-matthias-leyh/` | 301 auf `/team/` |
| `/potsdam/team/dr-birte-habedank/` | 301, weitergeleitet |
| `/team/zahnaerzte/dr-stephan-ziegler/` | 200 (Gründungspartner, aktuell) |

Wer gegangen ist, hat keine Seite mehr — auf beiden Fassungen.

### 7.2 Die Texte: nicht sauber

Was das Register nicht abdeckt, sind **Namen im Fließtext**. Blogbeiträge von
2019 bis 2024 stellen Kolleginnen und Kollegen namentlich vor, und diese
Sätze wissen nichts vom Register.

**Auf der heute laufenden Website nachgeprüft, alle mit Status 200:**

| Seite auf ku64.de | dort namentlich genannt |
|---|---|
| `/blog/neuigkeiten-aus-der-praxis/` | Dr. Matthias Leyh, Dr. Eva Schneider |
| `/blog/social-media-2024/` | Dr. Alexandra Wolff, Dr. Bahaa Youssef, Dr. Benedikt Straub |
| `/blog/social-media-2023/` | Dr. Jan Wagner, Dr. Jameela Abdul Haq |
| `/blog/ku64-in-den-medien/` | Dr. Yevgeni Viktorov |
| `/blog/kinder-betreuung/` | Dr. Yevgeni Viktorov |
| `/blog/360zahn-aus-duesseldorf/` | Dr. Elham Andabili-Barthel |

Zusammen **zehn Nennungen von neun Personen in sechs Beiträgen** — alle im
Präsens, alle als Teil der Praxis vorgestellt („Unser Kinderzahnarzt Dr. X",
„unsere Zahnärztin und Endo-Spezialistin"). Der Beitrag über Matthias Leyh
zitiert ihn mit einer langen fachlichen Aussage als „Zahnarzt für
Zahnästhetik bei KU64", samt namentlich genannter Patientin.

**Und das ist beim Umbau mitgekommen.** Die Beiträge wurden 1:1 übernommen,
weil sie inhaltlich wertvoll sind. Damit steht dasselbe auf der neuen
Fassung.

### 7.3 Was `npm run personen:pruefen` meldet

Das Skript durchsucht alle Inhaltsquellen und unterscheidet drei Fälle.

**Ausdrücklich als ehemalig geführt — 3:** Alexandra Sophia Fischer
(Profiltext), Frederike Brüning (Blog), Dominik Demski (Blog).

**Als KU64-zugehörig vorgestellt, in keinem Register — 12,** davon nach
Durchsicht 9 plausibel ehemalige Kolleginnen und Kollegen: Leyh, Schneider,
Straub, Youssef, Wolff, Wagner, Abdul Haq, Viktorov, Andabili-Barthel. Drei
Fehltreffer: Prof. Dr. Anabel Ternes (extern), „Dr. Mathers Institutes"
(Fortbildungsanbieter), und **Dr. Stefan Ziegler** — siehe 7.4.

**Ohne KU64-Bezug — 14.** Referenten, Doktorväter, frühere Arbeitgeber in
Lebensläufen. In Ordnung.

### 7.4 Nebenbefund: derselbe Mensch, zwei Schreibweisen

Ein Blogbeitrag zitiert **„Dr. Stefan Ziegler"**. Im Team steht **„Dr.
Stephan Ziegler"**, Geschäftsführender Gründungspartner. Dieselbe Person mit
zwei Schreibweisen des Vornamens. Für Suchmaschinen sind das zwei Menschen —
und es ist der Name des Gründers.

### 7.5 Was zu tun ist

Diese Prüfung entscheidet nichts, sie legt eine Liste vor. Drei Wege:

1. **Bleiben lassen,** wo erkennbar ein Rückblick vorliegt — bei Beiträgen
   mit Jahreszahl im Titel ist das gegeben.
2. **Zeitform ändern:** aus „Unser Kinderzahnarzt Dr. X empfiehlt" wird
   „Damals empfahl…", oder der Name entfällt und die Aussage bleibt.
3. **Entfernen** bei Zitaten, die wie eine gegenwärtige Aussage der Praxis
   wirken.

**Dringlichster Fall ist Matthias Leyh** — langes Fachzitat im Präsens, mit
namentlich genannter Patientin.

**Aufwand:** zehn Stellen in sechs Beiträgen. Eine Stunde Durchsicht durch
jemanden, der weiß, wer noch da ist, plus eine halbe Stunde Umsetzung.

**Danach bleibt es sauber:** `personen:pruefen` läuft künftig mit. Wer aus
dem Team ausscheidet und auf `bestaetigt: false` gesetzt wird, taucht ab
diesem Moment in der Liste auf, wenn sein Name noch irgendwo im Text steht.

---

## 7b. Drittanbieter, Cookies und Einwilligung

Bis vor kurzem war diese Website einwilligungsfrei, und das war eine
Bauentscheidung: Doctolib als sichtbarer Verweis statt eingebettetem Fenster,
Personio auf dem Server abgeholt, keine Statistik, Schriften selbst
ausgeliefert. Beim Seitenaufruf entstand keine einzige Verbindung nach außen.

Das ändert sich, weil die Praxis Analytics, den Rundgang und die Karte will.
Ab dem ersten dieser Dienste braucht es eine Einwilligung — § 25 TDDDG für den
Zugriff auf Endgeräte, Artikel 6 DSGVO für die Verarbeitung.

### 7b.1 Was auf der alten Website läuft — abgelesen, nicht erfragt

Aus dem Quelltext von ku64.de am 30. Juli 2026:

| Dienst | Kennung | Übernommen? |
|---|---|---|
| Google Analytics 4 | `G-6RDWJ4SBHT` | **ja**, dieselbe Kennung |
| Google Tag Manager | `GTM-TL2T6K8` | **nein** |
| HubSpot | Portal `25985109` | **nein** |
| Matterport | drei Rundgänge | **ja** |
| YouTube | Einbettungen | **nein** |

Dieselbe Messkennung weiterzuverwenden ist die richtige Entscheidung: Ein
neues Datenkonto zerschneidet die Zeitreihe, und genau die will man beim
Relaunch sehen.

**Ein sechster Dienst steht in keiner dieser Zeilen und lädt trotzdem.** Das
Doctolib-Logo im Seitenkopf ist ein `<img src="https://www.doctolib.de/…">`
ohne jede Bedingung — Einzelheiten in 2.6. Die Einwilligungslösung der alten
Seite blockiert Skripte und Rahmen sauber; ein Bild ist beides nicht.
Übernommen wird es nicht: Im Neubau ist das Doctolib-Zeichen eine eigene
Datei.

**Der Tag Manager kommt nicht mit,** und das ist die wichtigste Zeile in
diesem Kapitel. Er ist eine Fernbedienung: Wer Zugriff hat, kann jederzeit
weitere Skripte nachladen, ohne dass es in einem Verzeichnis auftaucht. Damit
wäre jede Zusage dieser Website über Drittanbieter hinfällig. Analytics wird
stattdessen direkt geladen — ein Dienst, ein Eintrag, nachprüfbar.

**HubSpot stand auf keiner Liste** und lief trotzdem: Es setzt eine dauerhafte
Besucherkennung und ordnet Seitenaufrufe einer Person zu, sobald sie einmal ein
Formular ausgefüllt hat. Bei einer Zahnarztpraxis ist das ein Gesundheitsbezug
im Sinne von Artikel 9 DSGVO. Die Praxis löst den Vertrag im September auf;
übernommen wird nichts.

### 7b.2 Das Verzeichnis ist die Architektur, nicht der Banner

Ein Banner ist schnell gebaut. Die Schwierigkeit ist, dass ein halbes Jahr
später jemand ein Skript einbindet, ohne daran zu denken. Deshalb ist die
Hauptsache hier `src/data/dienste.ts` — und **es gibt keinen Weg daneben:**

| Sperre | Was sie verhindert |
|---|---|
| `Drittinhalt.astro` bricht beim Bauen ab | eine Einbettung ohne Eintrag im Verzeichnis |
| `dienste-pruefen.mjs` liest das gebaute HTML | ein `<script src>` oder `<img src>` auf einen fremden Host |
| dieselbe Prüfung sucht `<iframe src>` | ein Rahmen, der schon im HTML steht und damit lädt |
| `/cookies/` und `/datenschutz/` erzeugen ihre Tabellen daraus | eine Datenschutzerklärung, die dem Einbau nachhinkt |

Die Prüfung fand bei ihrer Gegenprobe alle vier eingebauten Fehler, darunter
ein `<iframe src hidden loading="lazy">`. Genau der ist die Falle: `hidden`
verhindert das Laden nicht, `loading="lazy"` nur, solange das Element außerhalb
des Sichtfelds liegt.

### 7b.3 Die verschwommene Vorschau

Vor der Freigabe steht dort, wo Karte oder Rundgang liegen, eine unscharfe
Vorschau — **aus eigenen Dateien.** Kein Bild, kein Vorschaubild, kein
Aufwärm-Abruf geht an den Drittanbieter, auch kein `preconnect`.

Daran scheitern die üblichen Zwei-Klick-Lösungen: Sie nehmen als Platzhalter
das Vorschaubild von YouTube oder ein statisches Kartenbild von Google — und
haben damit die Verbindung schon aufgebaut, gegen die sie schützen sollen. Ein
statisches Bild von `maps.googleapis.com` überträgt IP-Adresse und Referrer
genauso wie die Karte.

Für die Karte zeichnet `Kartenvorschau.astro` deshalb eine schematische
Lageskizze aus Anschrift und Koordinaten. Sie ist kein Stadtplan und gibt sich
nicht dafür aus; verschwommen beantwortet sie die Frage „was liegt hier", und
die Anschrift steht als Text im Bild.

Nachgeprüft: In `dist/client/potsdam/anfahrt/index.html` steht kein einziges
`<iframe>`.

### 7b.4 Ablehnen ist genauso schnell wie Annehmen

Drei Schaltflächen, gleich groß, in einer Reihe, im selben Schritt — „Nur das
Notwendige" steht links, weil sie zuerst gelesen wird. Kein Vorhaken, kein
zweiter Dialog beim Ablehnen, kein „berechtigtes Interesse" als Umweg.

Der Dialog liegt in einem `<dialog>` über der Seite und nicht als Balken im
Textfluss: Ein Balken verschiebt den Inhalt und wäre genau der Layout-Sprung,
den Lighthouse als CLS zählt.

### 7b.5 In Betrieb, und zwar nachgemessen

Die Praxis hat die Auftragsverarbeitungsverträge für alle vier aktiven Dienste
bestätigt. Bis dahin stand `avVertrag: false`, und die Technik hat sie gesperrt
— auch bei Zustimmung, weil eine Einwilligung keinen Vertrag ersetzt. Damit
waren Rundgang und Karte einen halben Tag lang gebaut und nicht in Betrieb: 21
Einbettungen mit Sperrhinweis, null Ladeknöpfe.

**Die Verzeichnisfassung steigt dabei von 1 auf 2, und das ist keine
Formsache.** Im Dialog stand vorher wörtlich, diese Dienste würden „auch bei
Zustimmung nicht geladen". Wer daraufhin „Alles erlauben" geklickt hat, hat es
in dem Wissen getan, dass nichts passiert. Genau dieses Wissen ist jetzt falsch
— also wird erneut gefragt. Eine Zustimmung, deren Bedeutung sich nachträglich
ändert, ist keine.

**Dass es wirklich funktioniert, ist gemessen und nicht behauptet.** Der halbe
Tag Stillstand hat eine Lücke gezeigt, die alle bisherigen Prüfungen hatten:
Sie suchten nach dem Zuviel, nie nach dem Zuwenig. Eine Sperre, die nichts
durchlässt, besteht jede statische Prüfung mit Bestnote.

`freigabe-pruefen.mjs` fährt deshalb einen echten Browser und schreibt jede
Netzanfrage mit:

| | vor dem Klick | nach dem Klick |
|---|---|---|
| Anfragen an fremde Hosts | **0** | die des Dienstes |
| `<iframe>` in der Seite | **0** | **1**, mit der erwarteten Adresse |
| Ladeknopf | **1** | verschwunden |
| Entscheidung gemerkt | nein | ja, mit Fassung 2 |

Geprüft wird der Weg eines Menschen, der die Statistik nicht will, den
Rundgang aber schon: erst „Nur das Notwendige", dann den Rundgang einzeln
freigeben. Dass das geht, ist selbst eine Zusage — Ablehnen darf keine
Funktion kosten. Die Prüfung bestätigt danach, dass die Statistik trotzdem aus
bleibt.

Gegenprobe mit zwei eingebauten Fehlern, beide gefunden: Matterport wieder
zugesperrt (zwei Befunde, „gesperrt und nicht bedienbar") und ein `<iframe>`
vorab ins HTML gesetzt.

**Was hier noch offen ist:** Das Verzeichnis selbst ist nicht übersetzt.
Kategorienamen, Zwecke und Begründungen stehen auf Deutsch, sichtbar auch auf
den englischen und französischen Seiten. Der Dialog selbst ist übersetzt.

---

## 7c. Der Einwand: „zu viel auf einmal ändern kostet Rankings"

Zwei Digitalagenturen haben der Praxis geraten, an der Website nicht zu viel
auf einmal zu ändern — sie würde dann nicht mehr ranken, und der organische
Verkehr wäre für längere Zeit weg.

**Der Einwand ist berechtigt, und dieses Kapitel widerspricht ihm nicht
pauschal.** Relaunches kosten regelmäßig Platzierungen. Wer davor warnt, tut
seine Arbeit. Die Frage ist nicht, ob das vorkommt, sondern ob es *diesen*
Umbau beschreibt — und das ist eine Frage von Messwerten, nicht von
Überzeugungen.

Alle Zahlen dieses Kapitels stammen aus einer Erhebung vom 31. Juli und
1. August 2026, bei der jede einzelne Aussage anschließend von einem zweiten,
unabhängigen Durchgang widerlegt werden sollte. Von 89 geprüften Aussagen hat
**keine einzige** die erste Fassung unverändert überstanden; alle 89 stehen
hier in der geschärften Fassung. Was der Prüfung nicht standhielt, steht
nicht hier.

### 7c.1 Wo der Einwand recht hat

Sieben Punkte, alle belegt:

**Der Umzugsanteil ist groß.** Von 552 erhobenen Altadressen behalten 103
ihre Adresse, 448 wechseln sie — 81,2 Prozent. Ein 301 ist die beste
verfügbare Lösung, aber keine Garantie: Er überträgt Signale weder sofort
noch vollständig.

**Ein Teil der Weiterleitungen ist qualitativ schwach.** Die 448 führen auf
197 verschiedene Ziele. 217 Adressen zeigen auf ein Ziel, das mindestens fünf
Altadressen einsammelt. Eine Weiterleitung auf eine Übersichtsseite, die den
Inhalt der alten Adresse nicht trägt, wertet Google regelmäßig wie eine
Fehlerseite.

> **Dieser Punkt wurde am 1. August teilweise behoben.** Die Erhebung fand
> 126 Adressen, die auf eine Team-Übersicht zeigten, obwohl bei 38 von ihnen
> eine Personenseite existierte. Ursache war eine Regel aus einer Zeit, in
> der es noch keine Personenseiten gab. Jetzt: 88 auf Übersichten, 120 auf
> Personenseiten. Die verbliebenen 88 gehören zu Personen, die keine Seite
> haben, und zu Gruppenseiten.

**Englisch fällt beim Start aus.** ku64.de liefert heute 54 indexierbare
englische Seiten mit 76.060 Wörtern aus. Im Neubau tragen alle 518
EN-Seiten `noindex`, und die EN-Weiterleitungsziele ebenfalls. Beim
Umschalten im heutigen Stand: 54 → 0. **Das ist der stärkste Punkt der
Gegenseite** und der Grund, warum die englische Freigabe vor dem Livegang
stehen sollte.

**Die Startseite verliert Substanz.** Sichtbarer Text alt 1.915 Wörter,
Neubau 366. Die Startseite ist in der Regel die stärkste Adresse einer
Website.

**Zwei Darstellungsvorteile gingen verloren.** Die alte Seite erlaubt große
Bildvorschauen und lange Textausschnitte im Suchergebnis; der Neubau setzte
auf 504 von 518 Seiten gar keine solche Angabe.

> **Am 1. August behoben.** Die Angabe steht jetzt auf jeder indexierbaren
> Seite.

**Sterne im Suchergebnis kann der Neubau heute nicht bekommen.** Die alte
Startseite trägt fünf Bewertungsauszeichnungen, der Neubau keine. Nachziehen
lässt sich das nur aus einer belegbaren, einheitlichen Quelle — die alten
Werte widersprechen einander (4,8 bei 882 Bewertungen gegen 5,0 bei 626).

**Und der wichtigste Punkt: In der Kategorie, um die gestritten wird, ist
nichts zu gewinnen.** Lighthouse SEO steht bei ku64.de auf 100 von 100 — auf
allen drei geprüften Adressen, genau wie beim Neubau. Alle 315 bestehenden
Weiterleitungen sind saubere 301, keine Serverfehler, keine Seite auf
noindex, alle 341 Seiten mit Titel. **Die heutige Website ist technisch nicht
kaputt.** Wer sie so darstellt, wird beim ersten Nachsehen widerlegt.

### 7c.2 Warum er auf diesen Umbau trotzdem nicht zutrifft

Die Warnung richtet sich gegen einen Umbau ohne Adressplan und mit
Inhaltsverlust. Gemessen ist beides hier nicht der Fall.

**Jede Altadresse hat ein benanntes, geprüftes Ziel.** 552 Adressen: 103
unter derselben Adresse erhalten, 448 mit Weiterleitung auf eine Seite, die
nachweislich existiert, eine bewusst ohne Ziel. Diese eine ist ein Tippfehler
in einer Blogadresse, der auch auf ku64.de selbst ins Leere führt.

**Es sind echte 301, vollständig geprüft.** Alle 458 Weiterleitungsrouten
wurden gegen den Auslieferungsserver abgefragt, mit dem die Seite startet:
458 von 458 mit Status 301 und Zieladresse im Kopf. Keine Zwischenseite mit
Umleitung per Meta-Angabe. Die Ziele reduzieren sich auf 234 eindeutige
Adressen — alle antworten mit 200, keine Kette, kein Selbstverweis.

**Die Zuordnung ist gegenlesbar, nicht behauptet.** `weiterleitungen.ts`
enthält 458 Einträge mit Quelle, Ziel und Herkunftsvermerk. Die Praxis und
jede prüfende Agentur können Zeile für Zeile widersprechen.

**Der deutsche Textbestand ist erhalten.** Mit demselben Ausleseverfahren,
mit dem der Altbestand erhoben wurde: 290.357 Wörter auf den 257
Sitemap-Adressen des Neubaus gegen 290.421 auf den 286 deutschen Altseiten —
100,0 Prozent, verteilt auf 29 Adressen weniger. Über alle 518 deutschen
Seiten sind es 682.832 Wörter, je Seite 1.318 statt 1.015.

Bereichsweise: Beschwerdeseiten 31 → 31 Adressen, +0,2 Prozent Text. Blog
alle 30 Beiträge erhalten. Team +2,6 Prozent. Behandlungsseiten +2,4 Prozent.
Über uns 10 → 11 Seiten.

**Textverlust kann nicht unbemerkt passieren.** Ein Wächter in der Baukette
lässt den Bau scheitern, wenn der Behandlungstext unter den gemessenen
Altbestand fällt — an einem künstlich gekürzten Bau nachgestellt. Grenze der
Zusage, und sie gehört dazu: Er fängt den Einbruch, nicht jeden Einzelverlust.

**Die Indexierungslage ist widerspruchsfrei.** Alle 257 Sitemap-Adressen
tragen einen Self-Canonical, keine trägt noindex, zu jeder existiert eine
Seite. Den Widerspruch „in der Sitemap, aber nicht indexierbar", den die
Search Console als Fehler meldet, gibt es kein einziges Mal.

**Zwei Prüfkategorien steigen messbar.** Best Practices 77 → 100 auf allen
drei Seiten. Barrierefreiheit 97/94/94 → 100/100/100. Blockierzeit für
Eingaben 348/89/460 Millisekunden → 0.

### 7c.3 Was an echtem Risiko bleibt

Ein Kapitel, das „kein Risiko" behauptet, verliert die Diskussion beim ersten
Rückgang. Die folgenden Punkte sind gemessen und nach Gewicht geordnet.

| Risiko | Maßnahme |
|---|---|
| **Englisch:** heute 54 indexierbare Seiten, im Neubau 0 | Freigabe nach dem Gegenlesen — ein Schalter. Bis dahin nicht umschalten oder den Ausfall bewusst hinnehmen. Französisch ist reiner Zugewinn: ku64.de hat 0 französische Adressen |
| **Sammelweiterleitungen:** 88 Adressen zeigen weiter auf Übersichten | Einzeln durchsehen, ob es ein passgenaues Ziel gibt |
| **Drei Personen ohne Seite** | Text nachziehen oder bewusst entscheiden |
| **Potsdam:** 12 Ortstexte mit 9.418 Wörtern ohne Entsprechung; die Nachfolgeseiten tragen zu 93–97 Prozent den Berliner Text | Örtliche Behandlungsseiten mit eigenem Text füllen. Für „Zahnimplantate Potsdam" ist der heutige Stand ein Rückschritt |
| **Karriere:** 6 Seiten mit 4.128 Wörtern → eine Seite mit 343 | Arbeitgeberinhalt neu schreiben |
| **Bewertungssterne** fehlen | Aus einer einheitlichen, belegbaren Quelle aufsetzen |
| **Bilder:** kein WebP, kein `srcset` | Der größte noch offene technische Hebel |

**Und die Startseite ist technisch nicht schneller.** Erster sichtbarer
Inhalt 2,1 gegen 1,5 Sekunden, größtes Element 4,7 gegen 4,6. Der Gewinn der
Startseite liegt bei der Blockierzeit und der mobilen Videolast, nicht beim
Bildaufbau. Das gehört genannt und nicht verschwiegen.

### 7c.4 Was nur die Praxis liefern kann

**Zugang zur Google Search Console — und zwar vor dem Livegang, nicht
danach.** Ohne sie ist nicht messbar, welche Adressen überhaupt Besucher
bringen, also welche der 448 Umzüge teuer sind. Und ohne sie lässt sich nach
dem Umschalten nicht belegen, ob etwas passiert ist.

Das ist zugleich die ehrlichste Auskunft zum ganzen Einwand: **Es liegen
keine Search-Console- und keine Analytics-Daten vor.** Die Behauptung „ihr
verliert Traffic" lässt sich mit dem vorhandenen Material weder bestätigen
noch widerlegen — und jede Prozentzahl dazu, von welcher Seite auch immer,
wäre erfunden.

Dazu: Zugang zu Google Analytics für den Vorher-Nachher-Vergleich (der Neubau
verwendet dieselbe Messkennung, die Zeitreihe bleibt ungeschnitten), die
DNS-Verwaltung am Umschalttag und die Freigabe von Englisch und Französisch.

Der Zugang zum heutigen Server ist **entbehrlich** — die Weiterleitungen
liefert der Neubau selbst aus.


---

## 8. Analytics und Anbindung ans Dashboard

**Stand heute: Es gibt keine Messung.** Kein Analysewerkzeug, kein Cookie,
kein Zählpixel. Der Server schreibt bewusst keine Adressen und keine
IP-Adressen mit.

Das ist kein Versäumnis, sondern eine Zusage: Die Datenschutzseite sagt, dass
diese Website keine Analyse- und Werbe-Cookies setzt — und deshalb gibt es
kein Einwilligungsbanner. Ein nachträglich eingebautes Google Analytics würde
diese Zusage brechen, ein Banner erzwingen und die erste Sekunde jedes
Besuchs kosten.

### 8.1 Was gemessen werden soll

Nicht „Besucher". Die Fragen, die die Praxis wirklich hat:

| Frage | Kennzahl |
|---|---|
| Welcher Standort wird gesucht? | Aufrufe je Standort |
| Welche Behandlungen? | Aufrufe je Behandlung **× Standort** |
| Kommt jemand zum Termin? | Klicks auf „Termin buchen", je Standort |
| Wo bricht es ab? | Anamnese begonnen ÷ abgeschlossen |
| **Was wird gesucht und nicht gefunden?** | Suchanfragen ohne Treffer |
| Werden die Berater genutzt? | Gespräche, Dauer, Themen |
| Braucht es die Sprachen? | Sprachwechsel je Sprache |

Die fünfte Zeile ist die wertvollste. Eine Liste der Suchanfragen ohne
Treffer ist die direkteste Aussage darüber, was auf der Website fehlt — und
sie kostet nichts als das Mitzählen.

### 8.2 Vorschlag: eigene Messung, serverseitig, ohne Cookies

Die Website liefert alles vom eigenen Server aus. Dann kann sie dort auch
zählen, ohne dass ein Byte an Dritte geht.

- Der Server zählt **Ereignisse**, keine Personen: „Seite X aufgerufen",
  „Terminknopf an Standort Y geklickt", „Suche nach Z ohne Treffer".
  Aggregiert, nach Stunde.
- **Keine IP-Adresse**, kein Cookie, keine Kennung über Seiten hinweg. Damit
  gibt es keine „Sitzungen" und keine „eindeutigen Besucher" — bewusst. Das
  ist der Preis dafür, dass kein Banner nötig ist.
- Ein geschützter Endpunkt (`/api/kennzahlen/`, nur mit Schlüssel) gibt die
  Zähler als JSON aus.
- **Das Dashboard** (`dashboard.product-republic.com`, liegt als
  Railway-Projekt vor) holt diesen JSON in seinem Takt und stellt ihn dar.

**Aufwand:** Zählung und Endpunkt 1–2 Tage; die Darstellung hängt davon ab,
was im Dashboard schon steht.

**Was diese Lösung nicht kann:** Verweildauer, Absprungrate, Nutzerpfade über
mehrere Seiten. Dafür bräuchte es eine Kennung je Gerät — und damit die
Einwilligung, die wir gerade nicht brauchen.

### 8.3 Alternative, falls mehr gewünscht ist

**Plausible oder Matomo, selbst gehostet.** Beide messen ohne Cookies und
gelten überwiegend als einwilligungsfrei, wenn sie auf eigener Infrastruktur
laufen und IP-Adressen kürzen. Sie liefern Pfade und Verweildauer. Zu
bedenken: Der Text der Datenschutzseite müsste angepasst werden, und es kommt
ein Skript auf jede Seite, das heute nicht da ist.

**Google Analytics 4** würde ich nicht empfehlen: Einwilligungsbanner,
US-Datentransfer, und für vier Standorte keine Antwort, die die eigene
Zählung nicht auch gäbe.

### 8.4 Was zuerst gebraucht wird — auch ohne Analytics

1. **Google Search Console** für die Domain einrichten, Sitemap eintragen.
   Sie zeigt kostenlos, mit welchen Suchbegriffen die Seite gefunden wird —
   die einzige Quelle, die das kann.
2. **Google Business Profile** je Standort mit der jeweiligen Standortseite
   verknüpfen. Für eine Praxis ist der Kartenblock oft wichtiger als jedes
   organische Ergebnis.

---

## 9. Wie man künftig Änderungen macht

Die Website hat kein Redaktionssystem. Das ist eine Entscheidung: Ein System,
in dem dieselbe Angabe an vier Stellen gepflegt wird, war eines der Probleme
der alten Fassung.

Stattdessen gibt es **Datendateien**. Eine Änderung dort zieht überall nach —
Seiten, Navigation, Vergleichstabellen, Sitemap, Vorschaubilder,
strukturierte Daten und die Antworten des Chat-Beraters.

### 9.1 Wo was steht

| Ich möchte ändern … | Datei |
|---|---|
| Adresse, Telefon, Öffnungszeiten eines Standorts | `src/data/standorte.ts` |
| eine Behandlung, ihren Text, ihre Verfügbarkeit je Standort | `src/data/leistungen.ts` |
| Preise und Preisrahmen | `src/data/preise.ts` |
| Team, Funktionen, Zuordnung zu Standorten | `src/data/team.ts` |
| Behandlerprofile (Fließtext) | `src/data/profile.json` |
| Blogbeiträge | `src/data/blog.json` |
| Beschwerdeseiten | `src/data/beschwerden.json` |
| Fotos und Kopfvideos je Standort | `src/data/medien.ts` |
| Weiterleitungen alter Adressen | `src/data/weiterleitungen.ts` |
| **welche örtliche Fassung eigenen Inhalt hat** | `src/data/standortfassungen.ts` |
| jeden Text der Oberfläche | `src/i18n/texte.ts` |
| Übersetzungen | `src/inhalte/en.json`, `fr.json` |
| Farben, Abstände, Schriftgrößen | `src/styles/tokens.css` |

**Beispiel.** Potsdam bietet ab September Aligner an. Eine Zeile in
`src/data/leistungen.ts`: `verfuegbar: ['berlin-charlottenburg', 'potsdam']`.
Damit entstehen automatisch die Seite `/potsdam/leistungen/aligner/`, der
Eintrag in der Potsdamer Leistungsübersicht, die Zeile in der
Vergleichstabelle, das Vorschaubild fürs Teilen, der Eintrag in der
Wissensbasis des Beraters — und die englische und französische Fassung,
sobald der nächtliche Übersetzungslauf durch ist.

### 9.2 Der Weg einer Änderung

```
1. Datei ändern
2. npm run build          ← 9 Prüfungen laufen mit
3. npm start              ← lokal ansehen
4. npm run klickpfad      ← Bedienung nach Seitenwechsel
5. git commit && git push ← Railway baut und veröffentlicht selbst
```

Schritt 2 ist der wichtige. Der Bau bricht ab, wenn eine Behandlung auf einen
Standort verweist, den es nicht gibt; wenn ein interner Verweis ins Leere
zeigt; wenn ein Bild fehlt; wenn ein eingebettetes Skript nicht ausführbar
ist; wenn eine Sitemap-Adresse `noindex` trägt.

### 9.3 Die Prüfkette

**Zwölf Prüfungen laufen beim Bauen** und brauchen nichts weiter:

| Prüfung | Was sie verhindert |
|---|---|
| `daten:pruefen` | Querverweise auf Behandlungen oder Standorte, die es nicht gibt |
| `bilder-pruefen` | Stock-Fotos, fremde Bildquellen, fehlende Bilder |
| `glas:pruefen` | Glasflächen ohne funktionierenden Weichzeichner |
| `sprachen:pruefen` | verlorene Auszeichnung, kaputter Sprachwähler, veraltete Übersetzungen |
| `urls:abgleichen` | tote Adressen aus dem Altbestand |
| `verweise:pruefen` | interne Verweise ins Leere (85.295 geprüft) |
| `ids:pruefen` | doppelte `id`-Attribute |
| `skripte:pruefen` | eingebettete Skripte, die nichts tun |
| `barrierefrei:pruefen` | namenlose Knöpfe, fehlende Alt-Texte, Ebenensprünge |
| `dienste:pruefen` | ein fremder Host im HTML ohne Eintrag im Diensteverzeichnis |
| `recht:pruefen` | ein Platzhalter in Impressum oder Datenschutz, den keine Liste führt |
| `inhalt:pruefen` | dass der Behandlungstext unter den Altbestand fällt |
| `sitemap:liste` | Sitemap-Einträge, die zugleich `noindex` tragen |

**Zehn weitere brauchen einen laufenden Server** und gehören vor jeden
Livegang:

| Prüfung | Was sie verhindert |
|---|---|
| `klickpfad` | alles, was nur bis zum ersten Seitenwechsel funktioniert |
| `kontrast:pruefen` | Schrift unter der Kontrastnorm, hell und dunkel |
| `namen:pruefen` | Bedienelemente, die in einer Breite ihren Namen verlieren |
| `abschnitt:pruefen` | abgeschnittene Unterlängen, Überschriften ohne Luft nach unten |
| `kopf:pruefen` | Bedienelemente, die nur im ungescrollten Kopf funktionieren |
| `freigabe:pruefen` | eine Sperre, die nichts durchlässt — und ein Einwilligungsband, das die Seite erschlägt |
| `formulare:pruefen` | Formulare, die hinter dem Reverse Proxy abgewiesen werden |
| `indexierung:pruefen` | offene Vorschau — und vergessenes `noindex` nach dem Livegang |
| `durchgang` | Überlauf, abgeschnittene Überschriften, Browserfehler |
| `personen:pruefen` | Personennennungen im Text, die es im Team nicht mehr gibt |

Dazu `lighthouse-lauf.mjs`, das berichtet statt abzubrechen.

### 9.4 Wer kann was ohne Entwickler

| Aufgabe | Nötige Kenntnis |
|---|---|
| Öffnungszeiten, Telefon, Adresse ändern | Textdatei bearbeiten |
| Behandlung an einem Standort ein-/ausschalten | Textdatei bearbeiten |
| Blogbeitrag ergänzen | JSON-Datei bearbeiten |
| Behandlungstext überarbeiten | Textdatei bearbeiten |
| Foto austauschen | Datei ablegen, Zeile ergänzen |
| Neue Seitenart, neue Funktion | Entwickler |
| Gestaltung ändern | Entwickler |

### 9.5 Übersetzungen

Ein Arbeitsablauf bei GitHub übersetzt nachts, was auf Deutsch neu
dazugekommen ist, und legt das Ergebnis als Pull Request vor.

**Das funktioniert derzeit nicht:** Der Lauf braucht die Berechtigung, Pull
Requests anzulegen. Sie ist in den Repository-Einstellungen nicht gesetzt.
Stand heute: EN und FR bei **97,9 Prozent**, 156 beziehungsweise 155
Schlüssel ohne Übersetzung, eine veraltet.

---

## 10. Was dauerhaft im Haus bleibt

Der wiederkehrende Posten einer Website ist nicht der Bau — es ist die
Pflege. Genau dort sitzt der dauerhafte Gewinn dieses Umbaus: **Die Arbeit,
für die eine SEO-Agentur monatlich abrechnet, macht die Website jetzt selbst,
bei jeder Änderung, ohne dass jemand sie beauftragt.**

### 10.1 Was ein externer Dienstleister monatlich liefert — und was hier eingebaut ist

Ein SEO-Retainer besteht in der Sache aus drei Teilen: einem
wiederkehrenden technischen Audit, einer Überwachung, ob etwas kaputtgegangen
ist, und einer Liste von Verbesserungsvorschlägen. Die ersten beiden sind
gebaut und laufen.

| Was im Audit steht | Wer es hier macht | Wann |
|---|---|---|
| Tote Links finden | `verweise:pruefen` — 269.976 Verweise | bei jedem Bau |
| Weiterleitungen prüfen | `urls:abgleichen` — alle 552 Altadressen | bei jedem Bau |
| Sitemap gegen `noindex` abgleichen | `indexierung:pruefen` | auf Abruf |
| Canonical-Widersprüche | `indexierung:pruefen` | auf Abruf |
| Doppelte Titel und Beschreibungen | `indexierung:pruefen` | auf Abruf |
| hreflang über drei Sprachen | `sprachen:pruefen` | bei jedem Bau |
| Überschriftengliederung, Alternativtexte | `barrierefrei:pruefen` | bei jedem Bau |
| Kontrast nach WCAG | `kontrast:pruefen` | auf Abruf |
| Strukturierte Daten | `daten:pruefen` | bei jedem Bau |
| Ladeverhalten | `lighthouse` | auf Abruf |
| Fremde Skripte und Cookies aufspüren | `skripte:pruefen`, `dienste:pruefen` | bei jedem Bau |
| Dünne Seiten finden | `inhalt:pruefen`, `ortsseiten:pruefen` | bei jedem Bau |
| Pflichtangaben im Impressum | `recht:pruefen` | bei jedem Bau |

**Dreiundzwanzig Prüfungen, dreizehn davon bei jedem einzelnen Bau.** Ein
externes Audit ist eine Momentaufnahme, die einmal im Monat oder im Quartal
entsteht und danach altert. Diese Prüfungen laufen, bevor die Änderung
überhaupt live geht — und sie brechen den Bau ab, statt einen Befund in einen
PDF-Anhang zu schreiben, den jemand lesen müsste.

```grafik
{
  "art": "maengelListe",
  "titel": "Wiederkehrende Leistung: extern gegen eingebaut",
  "einheit": "pro Jahr",
  "hinweis": "Links: wie oft ein Audit im Retainer typischerweise stattfindet. Rechts: wie oft dieselbe Prüfung hier läuft – bei jedem Bau, und gebaut wird bei jeder Änderung.",
  "zeilen": [
    { "label": "Technisches Audit, extern beauftragt", "alt": 12, "neu": 0 },
    { "label": "Wartezeit auf einen Befund, in Tagen", "alt": 30, "neu": 0 },
    { "label": "Befunde, die erst nach dem Livegang auffallen", "alt": 13, "neu": 0 }
  ]
}
```

### 10.2 Der Unterschied, auf den es ankommt

Ein Audit **findet** Fehler. Diese Prüfungen **verhindern** sie.

Das ist keine Wortklauberei, sondern der Grund, warum die Leistung dauerhaft
im Haus bleiben kann. Ein externer Dienstleister meldet im Monatsbericht, dass
seit vier Wochen zwölf Links ins Leere laufen. Hier kommt eine Änderung mit
totem Link gar nicht erst auf die Website: Der Bau bricht ab und nennt die
Zeile. Der Fehler existiert nie öffentlich, also muss ihn auch niemand finden,
melden, einplanen und beheben.

Dieselbe Mechanik trägt die Zusagen, die sonst still verfallen:

- Kein Drittanbieter kann ohne Eintrag im Verzeichnis eingebaut werden —
  `dienste:pruefen` bricht ab. Die Datenschutzerklärung kann nicht mehr
  hinter der Website zurückbleiben.
- Kein Behandlungstext kann unter seinen Umfang fallen — `inhalt:pruefen`
  bricht ab. Was einmal wiederhergestellt wurde, bleibt.
- Keine Standortfassung kann sich für eigenständig erklären, ohne die 350
  Wörter wirklich zu tragen — `ortsseiten:pruefen` misst am gebauten HTML.

**Die dreizehn Bau-Prüfungen laufen bei jedem Zug auf einen Arbeitszweig**,
nicht, wenn jemand daran denkt. Die Prüfkette ist damit keine gute Absicht,
sondern eine Bedingung.

### 10.3 Was das Dashboard ergänzt

Die Prüfungen sagen, was **falsch** ist. Der dritte Teil eines Retainers —
Verbesserungsvorschläge — braucht dazu, was **gefragt** wird. Genau dafür ist
die Anbindung an `dashboard.product-republic.com` vorgesehen (Kapitel 8): Sie
holt die Kennzahlen der Website als JSON und stellt sie neben die
Prüfergebnisse.

Die wertvollste Zeile ist dabei nicht „Besucher", sondern **Suchanfragen ohne
Treffer**. Das ist die direkteste Aussage darüber, was auf der Website fehlt —
eine Liste, für die eine Agentur sonst Keyword-Recherche in Rechnung stellt,
und die hier als Nebenprodukt des Mitzählens entsteht. Zusammen mit den
Aufrufen je Behandlung **× Standort** ergibt sich daraus die Redaktionsliste
für die örtlichen Texte aus Kapitel 6, nach Nachfrage sortiert statt nach
Bauchgefühl.

**Ehrlich zum Stand:** Die Zählung und der Endpunkt sind entworfen, aber noch
nicht gebaut — 1 bis 2 Tage Entwicklung, und die Darstellung hängt davon ab,
was im Dashboard schon steht. Die dreiundzwanzig Prüfungen laufen dagegen
heute. Wer die wiederkehrenden Kosten schon jetzt reduzieren will, hat den
größeren Teil bereits in der Hand; der Vorschlagsteil kommt mit dem Dashboard
dazu.

### 10.4 Was extern bleiben sollte

Damit dieses Kapitel belastbar ist, gehört die Gegenseite dazu. Drei Dinge
leistet keine Prüfung im Haus:

| Was | Warum |
|---|---|
| **Fachliche Freigabe der Behandlungstexte** | Medizinische Richtigkeit prüft kein Skript. Das bleibt bei der Praxis. |
| **Google Business Profiles der vier Standorte** | Bewertungen, Fotos, Öffnungszeiten, Rückfragen — das ist Pflege außerhalb der Website. |
| **Wettbewerbsbeobachtung** | Was andere Praxen tun, sieht die eigene Website nicht. |

Der technische Retainer wird ersetzt. Die inhaltliche und örtliche Arbeit
bleibt — sie ist aber die, die ohnehin niemand besser kann als die Praxis
selbst.

---

## 11. Was sich prognostizieren lässt

Zahlen zu versprechen wäre unseriös. Was sich begründen lässt, sind
Richtungen und Größenordnungen — jeweils mit dem Mechanismus dahinter.

### 11.0 Warum hier keine Prozentzahl steht

In diesem Kapitel steht bewusst kein „+30 Prozent Anfragen". Für eine solche
Zahl bräuchte es die Ausgangswerte, und die liegen uns nicht vor:

| Wofür | Woher | Status |
|---|---|---|
| Impressionen, Klicks, Position je Adresse | Google Search Console | **nicht freigeschaltet** |
| Sitzungen, Absprünge, Wege durch die Seite | Analytics | **nicht freigeschaltet** |
| Terminbuchungen je Standort | Doctolib | liegt bei der Praxis |

Ohne diese drei ist jede Prozentzahl geraten. Eine geratene Zahl in einem
Bericht, der an die Praxisinhaber geht, ist schlechter als keine — sie wird
zitiert, sie wird zur Erwartung, und sie fällt in sechs Monaten auf denjenigen
zurück, der sie aufgeschrieben hat.

**Was der Neubau stattdessen mitbringt:** die Werkzeuge, um es später
nachzurechnen. `SITEMAP.md` führt alle 257 angemeldeten Seiten, die
Weiterleitungstabelle erlaubt einen Vorher-Nachher-Abgleich je Altadresse, und
`npm run lighthouse` misst reproduzierbar. Ein Vergleichsbericht nach vier und
nach zwölf Wochen ist damit ohne Zusatzaufwand möglich — **vorausgesetzt, die
Search Console wird vor dem Livegang freigeschaltet.** Das ist der billigste
Punkt auf allen Listen dieses Berichts und der einzige, der rückwirkend nicht
nachholbar ist.

### 11.1 Was mit hoher Sicherheit eintritt

**Kein Einbruch durch verlorene Adressen.** 0 von 552 Altadressen laufen ins
Leere; ohne die Weiterleitungsarbeit wären es 467 gewesen. Für Relaunches
ohne diese Arbeit werden in der Fachliteratur Einbrüche in der Größenordnung
von einem Drittel bis der Hälfte der organischen Besuche über drei bis sechs
Monate beschrieben. **Das ist eine Faustregel und keine Messung an dieser
Website** — sie steht hier, weil ein vermiedener Schaden sonst unsichtbar
bleibt.

**Bessere Werte in der Search Console.** Ebenensprünge von 15 auf 0, keine
Sitemap-Widersprüche, sauberes hreflang über drei Sprachen, keine doppelten
Titel. Das sind Meldungen, die verschwinden.

**Deutlich schnellere Seiten.** HTML von 224 auf 45 kB im Median, Skripte von
26 auf 5, fremde Server von 660 Einbindungen auf 0. Lighthouse: Best
Practices und SEO auf 100, Barrierefreiheit auf 100.

### 11.2 Was wahrscheinlich ist, aber von der Praxis abhängt

**Örtliche Sichtbarkeit — erst nach Kapitel 6.** Wo bisher eine Seite für
„Zahnimplantate" stand, können künftig vier stehen, jede mit eigener Adresse,
Telefonnummer und strukturierten Daten. **Heute ist es noch eine.** Die
Wirkung hängt an den örtlichen Texten und an den Google-Business-Profilen der
vier Standorte.

**Weniger Anrufe für Routinefragen.** Öffnungszeiten, Anfahrt, Kosten,
Ablauf — vier Standorte, drei Sprachen, dazu Chat und Suche. Wie stark, hängt
davon ab, wie sichtbar die Selbstbedienung ist. Messbar wird es erst mit
Kapitel 8.

**Internationale Patienten.** Von 54 englischen Seiten auf 518, dazu ebenso
viele französische — und der Fachtext ist auf Englisch vollständig übersetzt.
Ob daraus Termine werden, entscheidet sich am Standort und nicht an der
Website; aber die Website steht dem nicht mehr im Weg.

### 11.3 Woran der volle Erfolg noch hängt

**Die 120 örtlichen Behandlungsseiten zeigen per Canonical auf die
Hauptseite** (Kapitel 6). Sie sind der eigentliche Zweck des Umbaus, und sie
tragen im Mittel 140 statt 350 eigener Wörter. Solange das so ist, gewinnt die
neue Website bei örtlichen Suchanfragen nichts gegenüber der alten — sie hat
nur die Voraussetzung dafür geschaffen. **Das ist der mit Abstand größte
offene Posten dieses Berichts.**

**Fehlende Fotos.** 0 von 24 angemeldeten Motiven liegen vor; 14 davon sind
vorrangig. Sie sitzen im Kopf jeder Leistungskategorie und auf drei von vier
Standortseiten — ein Rundgang durch die Website trifft sie fast überall. Drei
Standorte zeigen ein Standbild aus dem Kopfvideo; Wilmersdorf nur die
Außenansicht.

**Die Übersetzung ist gebaut, aber nicht freigegeben.** Englisch 83 von 83
Themen, Französisch 66 von 83. Beides liegt auf einem eigenen Zweig und ist
nicht zusammengeführt, weil dem Übersetzungslauf die Berechtigung fehlt, einen
Pull Request anzulegen. Bis zum Gegenlesen bleiben beide Sprachen aus der
Sitemap heraus.

### 11.4 Eine ehrliche Gesamteinschätzung

Wenn die Seite so live geht, wie sie heute ist:

- **Kurzfristig (0–3 Monate):** stabile bis leicht bessere Sichtbarkeit. Die
  Weiterleitungen halten den Bestand, die Geschwindigkeit hilft, und Google
  muss die neuen Adressen erst bewerten.
- **Mittelfristig (3–9 Monate):** Fachliche Anfragen bleiben mindestens
  stabil, weil der Text vollständig übernommen ist und die Unterthemen ihre
  Adressen behalten haben. Örtliche Anfragen gewinnen — aber nur, wenn
  Kapitel 6 gelöst ist.
- **Langfristig:** Die Struktur ist der alten überlegen, die Wartbarkeit erst
  recht. Eine Behandlung an einem Standort zu ergänzen ist eine Zeile; auf
  der alten Website war es eine neue Seite, die jemand von Hand anlegen,
  verlinken und in die Sitemap eintragen musste — und die vergessen wurde.

---

## 12. Die nächsten Schritte

### Livegang-Sperren

| Punkt | Warum |
|---|---|
| **Örtliche Texte je Standort** | Nicht formal eine Sperre — aber ohne sie geht die Website mit dem Kernproblem live, gegen das sie gebaut wurde (Kapitel 6). Gemessen fehlen im Mittel 210 Wörter je Fassung |

### Rechtlich abgeschlossen

| Punkt | Stand |
|---|---|
| **Impressum** | 25 Angaben belegt, 5 mit Rechtsgrundlage nicht einschlägig, **0 offen**. Jede belegte Angabe nennt ihre Quelle; `recht:pruefen` bricht den Bau ab, wenn eine fehlt |
| **Datenschutzerklärung** | vollständig, indexierbar, alle Dienste erfasst |
| **Preisangaben** | gegen die Originalauswertung geprüft |
| **Auftragsverarbeitung** | je Dienst in `dienste.ts` geführt. **Wichtig:** Vier Dienste stehen dort mit `avVertrag: false` und sind damit **gesperrt — auch bei Zustimmung**. Eine Einwilligung ersetzt keinen Vertrag |

### Bei der Praxis

| Punkt | Aufwand |
|---|---|
| **Örtliche Texte: Geräte, Ablauf, Sitzungszahl, Wartezeit je Haus** | der eigentliche Hebel |
| 24 Fotos (14 vorrangig) | Fototermin je Haus |
| Zehn Personennennungen in Blogbeiträgen durchsehen | 1,5 Std. |
| EN und FR gegenlesen und freigeben | 2 Tage |
| Entscheidung zur ästhetischen Medizin | – |


### Bei der Entwicklung

| Punkt | Aufwand |
|---|---|
| Bildauslieferung: WebP und srcset (bis 888 kB je Seite vermeidbar) | 1 Tag |
| Kritisches CSS inline (zwei blockierende Stilblätter, ~150 ms) | 0,5 Tage |
| Serverseitige Zählung und Dashboard-Endpunkt | 1–2 Tage |
| Sprachberater verbinden **oder** ausblenden | Entscheidung nötig |
| Restdeutsch: 62 Auszeichnungs-Funde, Schwerpunkte Anamnese und Kontakt | 1 Tag |
| Die 17 fehlenden französischen Themen nachholen | ein Lauf; Ursache behoben |
| Sitemap: EN und FR aufnehmen, sobald freigegeben | 0,5 Tage |
| 96 örtliche Unterthemen zeigen mit Canonical auf sich selbst | 0,5 Tage — siehe unten |

**Ein offener Befund, der noch nirgends sonst steht.** 96 örtliche
Unterthemen-Seiten stehen in der Sitemap mit Canonical auf sich selbst,
obwohl ihr Text zwischen den Standorten identisch ist — gemessen 502 Wörter,
100 Prozent gleich, Beispiel `…/leistungen/aligner/sos-zahnspangen/` in allen
vier Häusern. Das ist derselbe Duplikatfehler, gegen den Kapitel 6 die
Standortarchitektur verteidigt, nur eine Ebene tiefer:
`ausSitemapAusschliessen()` prüft `/<ort>/leistungen/<slug>/`, aber nicht
`/<ort>/leistungen/<slug>/<unterthema>/`.

### Beim Betrieb

| Punkt | Wirkung |
|---|---|
| **GitHub → Actions → „Allow GitHub Actions to create and approve pull requests"** | Der Übersetzungslauf schiebt seinen Zweig, kann aber keinen Pull Request daraus machen. **Die fertige englische Übersetzung liegt deshalb heute unzusammengeführt** |
| **ElevenLabs-Schlüssel und Agent-ID** | Sprachberater sagt „noch nicht verbunden" |
| **Ausgabenlimits bei Anthropic, Google, ElevenLabs** | die Drosselungen im Code sind Bremsen, keine Mauern |
| **Search Console und Business Profile** | Kapitel 8.4 — und Voraussetzung dafür, dass sich die Prognosen in Kapitel 11 überhaupt nachrechnen lassen |

Der Anthropic-Schlüssel liegt als GitHub-Actions-Secret vor — belegt durch
einen Übersetzungslauf, der den Korpus tatsächlich abgerufen und übersetzt hat.

---

## 13. Anhang

### 13.1 Woher die Zahlen stammen

| Zahl | Quelle |
|---|---|
| Adressbestand alt | `analyse/altbestand/crawl-bericht.md`, Crawl 26.07. |
| Seitenweise Messung beider Fassungen | `analyse/vergleich/erheben.mjs` → `erhebung.json`, 29.07. |
| Seitenpaare, zusammengefaltete und verlorene Themen | `analyse/vergleich/paare-bilden.mjs` → `paare.json` |
| Lighthouse | `scripts/lighthouse-lauf.mjs` → `lighthouse.json`, Lighthouse 13.4.1 |
| Weiterleitungen | `npm run urls:abgleichen` gegen die gebaute Fassung |
| Barrierefreiheit | `barrierefrei:pruefen`, `kontrast:pruefen`, `namen:pruefen` |
| Interne Verweise | `npm run verweise:pruefen` |
| Sprachstand | `npm run sprachen:pruefen` |
| Personennennungen | `npm run personen:pruefen` |

### 13.2 Die Erhebung wiederholen

```
npm run build
OEFFENTLICHE_HOSTS=127.0.0.1 npm start &
node analyse/vergleich/erheben.mjs http://127.0.0.1:4321
node analyse/vergleich/paare-bilden.mjs
node scripts/lighthouse-lauf.mjs http://127.0.0.1:4321
node bericht/vergleich-bauen.mjs && node bericht/vergleich-pdf.mjs
```

### 13.3 Bekannte Grenzen dieser Analyse

1. **Core Web Vitals der alten Website fehlen.** Aus dieser Arbeitsumgebung
   nicht erhebbar. Ein PageSpeed-Lauf auf `ku64.de` schließt die Lücke.
2. **Die beiden Stichproben sind unterschiedlich zusammengesetzt** — siehe
   0.1. Je-Seite-Mittelwerte sind Anhaltspunkte, die Seitenpaare sind
   belastbar.
3. **Wortzahlen enthalten Navigations- und Fußtext.** Wo es darauf ankam, ist
   der Ballast herausgerechnet und das Verfahren angegeben.
4. **Keine Rankingdaten.** Ohne Search-Console-Zugang zur alten Domain ist
   jede Aussage über konkrete Suchbegriffe geraten — und steht deshalb nicht
   drin.
5. **Die neue Fassung ist nicht live.** Alle Messungen betreffen die
   Vorschau. Unter der echten Domain können Serverzeiten abweichen.

---

*Stand 31. Juli 2026. Alle Zahlen sind reproduzierbar; die Skripte liegen
unter `analyse/vergleich/` und `scripts/`.*
