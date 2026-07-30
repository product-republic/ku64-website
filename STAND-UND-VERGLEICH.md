# KU64 – Stand, Vergleich und Prognose

**Erhoben am 29. und 30. Juli 2026.** Jede Zahl in diesem Dokument ist
gemessen und mit dem Skript benannt, das sie erzeugt. Wo etwas nicht messbar
war oder aus fremder Quelle stammt, steht es dabei.

---

## Für wen welches Kapitel

Niemand muss alles lesen.

| | Kapitel | Warum |
|---|---|---|
| **Praxisinhaber** | Urteil, 1, 5, 6, 7, 11, 12 | Was ist gut, was nicht, was kostet es, was wird von der Praxis gebraucht |
| **Marketing / Kaufmännische Leitung** | Urteil, 4, 5, 6, 8, 10, 11 | Vergleich, Risiken, Messbarkeit, Prognose, Kosten |
| **Agentur / Technik** | alles, besonders 0, 2, 3, 4, 13 | Methodik, Messwerte, Prüfkette, Rohdaten |

---

## Das Urteil in fünf Sätzen

**Technisch ist der Neubau der alten Website in jeder messbaren Hinsicht
überlegen** — ein Fünftel des Gewichts, kein Drittanbieter beim Seitenaufruf,
keine tote Adresse aus dem Altbestand, Barrierefreiheit auf 100.

**Der Textverlust ist behoben, und zwar messbar:** Die Behandlungsseiten hatten
89 Prozent ihres Umfangs verloren. Der Originaltext ist von ku64.de geholt und
wieder eingebaut — **129.172 statt 18.444 Wörter, also 109,8 Prozent des
Altbestands.** Zu Zahnimplantaten stehen 3.156 Wörter auf der Hauptseite statt
722, dazu vier eigene Seiten für Kosten, Haltbarkeit, Rauchen und die Frage
Implantat oder Brücke.

**Das Kernversprechen des Umbaus ist gebaut, aber noch nicht wirksam:** 116
örtliche Behandlungsseiten existieren, und **keine einzige** ist zur
Indexierung angemeldet — für Google gibt es weiterhin genau eine Seite je
Behandlung. Der Grund ist derselbe: Es gibt noch keine örtlichen Inhalte.

**Zwei Livegang-Sperren sind noch offen.** Bei den Rechtstexten sind es
inzwischen sechs Felder statt fünfunddreißig: Name, Anschrift, Vertretung,
Kammer, Aufsichtsbehörde, Schlichtungsstelle, Datenschutzbeauftragter und
alles Übrige sind aus dem heutigen Impressum übernommen und tragen jeweils
ihre Herkunft. Was noch fehlt — Rechtsform, Registereintrag,
Umsatzsteuer-Identnummer und die Berufshaftpflicht — **steht auch auf der
heutigen Seite nicht**; der Neubau erbt hier keine Lücke, er macht eine
sichtbar. Dazu die Preisangaben, die aus Fotos einer gedruckten Auswertung
abgetippt und nicht gegengeprüft sind.

**Der Hebel liegt nicht in der Technik.** Er liegt in vierundzwanzig Fotos,
einer fachlichen Freigabe, einer Stunde Personendurchsicht und zwei Formularen
mit Pflichtangaben. Dazu die Übersetzung des wiederhergestellten Textes —
114.894 Wörter je Sprache, der einzige Punkt, an dem die neue Website in
Englisch und Französisch noch nicht besser ist als die alte.

---

## Kurzfassung

**Was gebaut wurde.** Ein vollständiger Neubau mit anderer Grundordnung: Jede
Behandlung gehört zu einem Standort statt zu keinem. 1.083 Seiten, drei
Sprachen, kein Cookie, kein Einwilligungsbanner, fünfzehn automatische
Prüfungen — neun beim Bauen, sechs gegen die laufende Seite.

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

**Was messbar besser ist.**

```grafik
{
  "art": "paarBalken",
  "titel": "Technik je Seite, alt gegen neu",
  "besserIst": "klein",
  "hinweis": "Alt: 340 Seiten der laufenden Website. Neu: 210 Seiten der Sitemap. Die Mischung ist nicht dieselbe – siehe Kapitel 0.",
  "zeilen": [
    { "label": "HTML (Median)", "alt": 224, "neu": 45, "einheit": "kB" },
    { "label": "Skripte", "alt": 25.8, "neu": 5.2 },
    { "label": "Stylesheets", "alt": 22.9, "neu": 1.2 },
    { "label": "Ebenensprünge (Summe)", "alt": 15, "neu": 0 }
  ]
}
```

| | vorher | nachher |
|---|---:|---:|
| Tote Adressen aus dem Altbestand | 467 von 552 wären es geworden | **0** |
| HTML je Seite (Median) | 224 kB | **45 kB** |
| Skripte je Seite | 25,8 | **5,2** |
| Fremde Skripte, Summe über alle Seiten | 660 | **0** |
| Sprünge in der Überschriftengliederung | 15 | **0** |
| Englische Seiten | 54 | **361** |
| Lighthouse Barrierefreiheit, mobil | nicht erhoben | **100** |
| Text auf Behandlungsseiten | 117.595 Wörter | **129.172** |
| Eigene Seiten je Behandlungsfrage | 74 | **75** |
| Oberfläche auf Englisch und Französisch | 96,7 % | **100,0 %** |
| Fremde Verbindungen beim Seitenaufruf | 660 | **0** |
| Automatische Prüfungen im Bau | 0 | **11** |

**Was schlechter war und jetzt behoben ist.** Die Behandlungstexte waren auf
18.444 Wörter geschrumpft. Zu Implantaten hatte die alte Website fünf Seiten
mit zusammen 10.952 Wörtern — Kosten, Haltbarkeit, Rauchen, Implantat oder
Brücke —, also genau die Fragen, mit denen Menschen mit Behandlungsabsicht
suchen. Die neue hatte eine mit 722.

Der Originaltext liegt jetzt wieder vor: 340 Seiten von ku64.de geholt,
Vorlagenreste entfernt, über die Weiterleitungstabelle zugeordnet und
wortgleich eingebaut. **Kapitel 5 rechnet es vor.**

```grafik
{
  "art": "paarBalken",
  "titel": "Behandlungsseiten: Text im Hauptbereich",
  "besserIst": "gross",
  "hinweis": "Kanonische Fassung, nur <main>, ohne Vorlagenblöcke – dieselbe Zählweise für beide. Alt: 74 Seiten, neu: 75.",
  "zeilen": [
    { "label": "Wörter gesamt", "alt": 117595, "neu": 129172 },
    { "label": "Zahnimplantate, alle Seiten", "alt": 7400, "neu": 8398 }
  ]
}
```

**Was noch nicht wirkt.** 116 örtliche Behandlungsseiten sind gebaut, 0 sind
indexierbar. **Kapitel 6.**

**Was inhaltlich veraltet ist.** In sechs Blogbeiträgen werden mindestens
zehn Personen namentlich als Teil der Praxis vorgestellt, die dort nicht mehr
arbeiten — im Präsens, darunter ein ausführliches Fachzitat. **Kapitel 7.**

**Was jetzt gebraucht wird.**

| Von wem | Was | Aufwand | Wirkung |
|---|---|---|---|
| Praxis | sechs Rechtsangaben nachreichen (Rechtsform, Register, USt-IdNr., Haftpflicht) | 30 Min. | **Livegang-Sperre** |
| Praxis | Preisangaben gegen die Originalauswertung prüfen | 2 Std. | **Livegang-Sperre** |
| Praxis | fachliche Freigabe der 36 Behandlungstexte | 1 Tag | Voraussetzung für alles Weitere |
| Technik | 114.894 Wörter nach EN und FR übersetzen | läuft | letzter Punkt ohne Vorsprung |
| Praxis | 24 Fotos | – | Standorte zeigen Videostandbilder |
| Praxis | Personennennungen durchsehen | 1,5 Std. | betrifft auch die heutige Website |
| Praxis | Belegseiten wiederherstellen | 1 Tag | Vertrauenssignale |
| Betrieb | eine GitHub-Berechtigung, zwei Schlüssel | 15 Min. | Übersetzungslauf, Sprachberater |

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
- **Neu** sind die 210 Seiten der Sitemap. Darin ist **keine** englische oder
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
3. **Kosten in Kapitel 10** sind Treiber und Größenordnungen, keine
   Abrechnung. Die tatsächlichen Beträge kennt nur, wer die Verträge hat.

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
die englische Fassung endete dort, wo es interessant wurde. *Neu: 361, aber
bei 97,9 Prozent und nicht freigegeben.*

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

### 2.3 Der strukturelle Kernfehler

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

### 2.6 Was fehlt — nachgemessen am 30.07.2026

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
| gebaute Seiten | **1.083** | `npm run build` |
| davon zur Indexierung angemeldet | **207** | `sitemap-0.xml` |
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

| Funktion | Was sie tut | Stand |
|---|---|---|
| **Standortgedächtnis** | merkt den gewählten Standort, bietet ihn beim nächsten Besuch an — ohne automatische Umleitung | fertig |
| **Suche** | durchsucht alle Inhalte, sprachabhängig | fertig |
| **Chat-Berater** | beantwortet Fragen aus der eigenen Wissensbasis | fertig |
| **Sprachberater** | dasselbe per Sprache | gebaut, **nicht verbunden** |
| **Lächeln-Vorschau** | Foto hochladen, unverbindliche Visualisierung | gebaut, **nie erfolgreich durchgelaufen** |
| **Digitale Anamnese** | Bogen vorab ausfüllen | fertig |
| **Teamfilter** | Team nach Behandlungsart filtern | fertig |
| **Lesefortschritt** | im Blog | fertig |
| **KI-Transparenzseite** | legt offen, welches System wo arbeitet (Art. 50 KI-VO) | fertig |
| **Kontaktformular** | mit Drosselung, ohne Drittanbieter | fertig |
| **RSS-Feed**, **`security.txt`** | | fertig |
| **Vorschaubilder** | 153 Karten fürs Teilen, mit echtem Foto des Standorts | fertig |

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

Der Weg dorthin ist Teil des Befunds: Am 28.07. standen 33 Stellen unter der
Kontrastnorm. Am 30.07. fand Lighthouse **zwei weitere Fehler, die keine der
bestehenden Prüfungen sehen konnte** — beide sind behoben, und beide haben
eine neue Prüfung nach sich gezogen. Kapitel 4.5.

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
| erreichbare Seiten | 341 | 1.083 |
| **zur Indexierung angemeldet** | **341** ¹ | **207** |

¹ Für die alte Website ist der Sitemap-Umfang nicht belegt; der Crawl fand
341 erreichbare Seiten ohne `noindex`. „Kein noindex" ist nicht dasselbe wie
„in der Sitemap angemeldet" — die Zahl ist eine Obergrenze, keine Messung.

**Die neue Website baut dreimal so viele Seiten und meldet weniger als ein
Drittel an.** Das ist zum Teil Absicht und zum Teil ein offener Punkt:

| Warum ausgeschlossen | Seiten | Absicht oder Rückstand |
|---|---:|---|
| Sprachfassungen EN/FR, nicht gegengelesen | 722 | Rückstand |
| örtliche Behandlungsfassungen ohne eigenen Inhalt | 116 | **Rückstand — Kapitel 6** |
| Behandlerprofile ohne eigene Substanz | 26 | Absicht |
| Entwürfe (Impressum, Datenschutz) | 2 | 24 von 30 Angaben belegt; die sechs offenen fehlen auch heute |
| Teamübersicht ohne Team (Wilmersdorf) | 1 | Datenlücke |

Ein Praxisinhaber, der später in der Search Console 207 statt 341 Seiten
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

### 4.5 Was die Messung an echten Fehlern gefunden hat

Diese vier Punkte waren am 29.07. noch in der Website. Alle sind behoben und
nachgemessen; jeder hat eine neue Prüfung nach sich gezogen, weil keine
bestehende ihn sehen konnte.

| Fehler | Wirkung | Warum keine Prüfung ihn fand |
|---|---|---|
| **Das Kopfvideo hat nie gespielt** | Startseite und drei Standortseiten zeigten ein Standbild statt des Rundgangs | Das Skript war gültiges JavaScript, das nichts tat — keine Fehlermeldung. Und weil das Standbild absichtlich ein Bild *aus* dem Video ist, sah ein stehendes Video wie ein laufendes aus. |
| **Berater-Knopf ohne Namen am Telefon** | WCAG 4.1.2 Stufe A, auf **jeder** Seite bis 512 px Breite | `barrierefrei:pruefen` liest HTML; dort steht der Name. Dass CSS ihn bei schmaler Breite entfernt, ist im HTML nicht sichtbar. |
| **Layoutsprung auf der Teamseite** | CLS 0,371 (Grenze 0,1), Leistungsnote 80 | Keine Prüfung messte Layoutsprünge. |
| **Kontrast 3,5:1 in den Filterknöpfen** | sechs Stellen, mobil und Desktop | `kontrast:pruefen` besuchte die Teamseite nicht — die einzige Seite mit Filterknöpfen. |

```grafik
{
  "art": "paarBalken",
  "titel": "Teamseite mobil, vor und nach der Korrektur",
  "besserIst": "gross",
  "hinweis": "Lighthouse 13.4.1, mobil, gedrosselt. CLS umgekehrt aufgetragen: 0,371 vorher, 0 nachher.",
  "zeilen": [
    { "label": "Leistung", "alt": 80, "neu": 100 },
    { "label": "Barrierefreiheit", "alt": 91, "neu": 100 }
  ]
}
```

Neu entstanden sind dabei drei Prüfungen: `skripte:pruefen` (findet
Skript-Code, der als Zeichenkette im HTML landet und nichts tut),
`namen:pruefen` (misst zugängliche Namen im Browser in vier Breiten) und die
erweiterte Seitenliste der Kontrastprüfung. Alle drei wurden gegen den
fehlerhaften Stand laufen gelassen, bevor ihnen geglaubt wurde.

---

## 5. Der Textbestand — behoben, mit Wächter

### 5.0 Behoben — und wie

Dieses Kapitel hieß in der ersten Fassung „das größte inhaltliche Risiko" und
rechnete einen Verlust von 89 Prozent vor. Der Verlust ist behoben. Was hier
steht, ist die Rechnung dazu und der Weg, auf dem es passiert ist.

| Behandlungsbereich, kanonische Fassung | Seiten | Wörter |
|---|---:|---:|
| ku64.de (alt), Hauptinhalt ohne Vorlagenblöcke | 74 | 117.595 |
| Neubau, erste Fassung | 33 | 18.444 |
| **Neubau, heute** | **75** | **129.172** |
| **Verhältnis zum Altbestand** | **101 %** | **109,8 %** |

**Warum die alte Zahl 170.785 hieß und jetzt 117.595.** Die erste Messung
zählte alles, was auf einer alten Seite stand — Menü, Fußzeile, die Adressen
aller fünf Standorte, den Newsletter-Aufruf. Das sind rund 53.000 Wörter
Vorlage, verteilt über 74 Seiten. Für einen Vergleich ist das unbrauchbar: Die
neue Website hat dieselben Elemente, nur an anderer Stelle. Gemessen wird
deshalb der Hauptinhalt, auf beiden Seiten mit derselben Regel. Die
unangenehme Zahl wird dadurch kleiner, das Ergebnis ehrlicher.

**Wie der Text zurückkam.** Er lag nirgends: Der Crawl hatte erhoben, welche
Seiten es gibt, die Erhebung hatte Wörter gezählt, aber keiner hatte den Text
behalten. Also von ku64.de geholt — 340 Seiten, 368.838 Wörter.

| Schritt | Was er tut |
|---|---|
| `analyse/altbestand/texte-holen.mjs` | holt den Hauptinhalt, sechs Abrufe gleichzeitig, sprechender User-Agent |
| `analyse/altbestand/texte-bereinigen.mjs` | nimmt Vorlagenreste heraus: 577 Standortblöcke, 55 YouTube-Platzhalter, 64 Klammerzeilen |
| `scripts/langtexte-bauen.mjs` | ordnet zu — aus der Weiterleitungstabelle, nicht geraten |

Nichts wurde umformuliert, gekürzt oder verbessert. Das ist der Text der
Praxis, fachlich verantwortet; ihn zu überarbeiten wäre genau der Übergriff,
der beim ersten Mal zum Verlust geführt hat. Geändert wurden ausschließlich
Überschriften, die in Versalien geschrieben waren — „ZAHNIMPLANTAT-KOSTEN"
liest sich im Neubau als Schreifehler.

**Die wichtigste Entscheidung dabei: 31 Unterthemen bekommen ihre eigene
Adresse zurück.** Der Text als weiterer Abschnitt der Hauptseite wäre
einfacher gewesen — und hätte den Fehler wiederholt. Wer „was kostet ein
zahnimplantat" sucht, soll eine Seite finden, die genau das beantwortet, und
nicht Absatz 60 einer langen Seite.

```grafik
{
  "art": "paarBalken",
  "titel": "Zahnimplantate – Wörter je Seite",
  "besserIst": "gross",
  "hinweis": "Alt: fünf Seiten auf ku64.de. Neu: eine Hauptseite und vier Unterthemen, jedes mit eigener Adresse.",
  "zeilen": [
    { "label": "Hauptseite", "alt": 2442, "neu": 3156 },
    { "label": "Kosten", "alt": 1820, "neu": 1893 },
    { "label": "Rauchen", "alt": 2031, "neu": 2211 },
    { "label": "Haltbarkeit", "alt": 497, "neu": 558 },
    { "label": "Implantat oder Brücke", "alt": 547, "neu": 607 }
  ]
}
```

Die neuen Zahlen liegen leicht über den alten, weil zu jedem Unterthema im
Neubau noch der Weg zum Standort und zu den Geschwisterthemen hinzukommt. Auf
der alten Website war die Verbindung nur eine Ebene tief und hatte keinen
Rückweg.

**Was jetzt dafür sorgt, dass es nicht wieder passiert.** `inhalt-pruefen.mjs`
läuft im Bau und bricht ab, wenn der Textbestand der Behandlungsseiten unter
den der alten Website fällt. Das ist der Punkt, um den es geht: Der Verlust
entstand nicht durch einen Fehler, sondern durch eine Reihe einzeln
vernünftiger Entscheidungen — neu schreiben statt übernehmen, zusammenfassen
statt aufteilen, kürzen statt ausufern. Keine sah wie ein Verlust aus.
Zusammen waren sie einer. Dagegen hilft kein Kommentar, sondern eine Zahl, die
widerspricht.

**Was offen bleibt.** Zwei Dinge, und beide sind benannt statt beschönigt:

Die **fachliche Freigabe** steht aus, und zwar jetzt für 114.894 Wörter mehr
als vorher. Zu lesen ist nicht die Sprache, sondern die Aussage — Dauer,
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

Deutschsprachiger Bestand, gepaarte Seiten (`paare.json`):

```grafik
{
  "art": "bereichsBalken",
  "titel": "Wörter je Bereich, alt gegen neu",
  "hinweis": "Nicht logarithmisch: Der Befund IST das Missverhältnis. Eine Achse, die es einebnet, unterschlägt ihn.",
  "zeilen": [
    { "label": "Behandlungen", "alt": 170785, "neu": 18444 },
    { "label": "Zahnbeschwerden", "alt": 102543, "neu": 88827 },
    { "label": "Team", "alt": 95342, "neu": 41034 },
    { "label": "Blog", "alt": 66002, "neu": 56008 },
    { "label": "Über uns", "alt": 16176, "neu": 469 }
  ]
}
```

| Bereich | Seiten alt → neu | Wörter alt → neu | | Was passiert ist |
|---|---:|---:|---:|---|
| Zahnbeschwerden | 31 → 31 | 102.543 → 88.827 | −13 % | übernommen |
| Blog | 31 → 31 | 66.002 → 56.008 | −15 % | übernommen |
| Team | 101 → 74 | 95.342 → 41.034 | −57 % | bewusst zusammengefasst |
| **Behandlungen** | **74 → 75** | **117.595 → 129.172** | **+10 %** | **wiederhergestellt** |
| **Über uns** | **10 → 1** | **16.176 → 469** | **−97 %** | **zusammengefaltet** |
| **Gesamt (deutsch)** | **286 → 210** | **518.870 → 228.334** | **−56 %** | |

**Die Reihenfolge ist die ganze Geschichte: Übernommen bleibt erhalten. Neu
geschrieben schrumpft. Zusammengefaltet verschwindet.** Damit ist die Lücke
keine Eigenschaft der neuen Website, sondern eine offene Redaktionsaufgabe.

**Wichtig zur Grundmenge:** Die 33 neuen Behandlungsseiten sind die
*indexierbaren* — die standortübergreifenden plus Übersicht. Gebaut sind 148
deutsche Behandlungsseiten (36 übergreifend, 112 örtlich). Die örtlichen
tragen aber denselben Text und sind nicht angemeldet, siehe Kapitel 6.

### 5.2 Vorlagen-Ballast herausgerechnet

Die kleinste alte Seite hat 697 Wörter, die kleinste neue 363 — das ist der
Textanteil, den jede Seite ihrer Vorlage verdankt. Abgezogen:

| | alt | neu |
|---|---:|---:|
| Ø eigener Inhalt je Behandlungsseite | **~1.600 Wörter** | **~195 Wörter** |

### 5.3 Achtzehn Themen haben keine eigene Seite mehr

Nicht gekürzt, sondern zusammengefaltet. Die Weiterleitung ist technisch
sauber, der Inhalt ist weg. Zusammen **34.811 Wörter**.

| Thema | Umfang bisher | führt jetzt auf |
|---|---:|---|
| Faltenbehandlung | 4.341 W | `/leistungen/` |
| Longevity | 3.719 W | `/leistungen/` |
| Hyaluron / Lippen | 3.539 W | `/leistungen/` |
| Zornesfalte | 3.440 W | `/leistungen/` |
| Hilfsprojekt Südafrika | 3.000 W | `/ueber-uns/` |
| Ästhetische Medizin (Übersicht) | 2.710 W | `/leistungen/` |
| Location | 2.069 W | `/ueber-uns/` |
| Soziales Engagement | 1.608 W | `/ueber-uns/` |
| Kooperationspartner | 1.495 W | `/ueber-uns/` |
| Presseinfo | 1.325 W | `/ueber-uns/` |
| Best Practice | 1.043 W | `/ueber-uns/` |
| Auszeichnungen | 1.042 W | `/ueber-uns/` |
| Ganzheitliche Zahnmedizin | 1.028 W | `/leistungen/` |
| Anfahrt | 1.018 W | `/standorte/` |
| Ultraschall-Reiniger (Potsdam) | 1.004 W | `/ueber-uns/` |
| Mitgliedschaften | 897 W | `/ueber-uns/` |
| Galerie | 771 W | `/ueber-uns/` |
| Link-Tree | 762 W | `/` |

Zwei Gruppen brauchen zwei verschiedene Entscheidungen:

**Ästhetische Medizin** — vier Seiten, 14.010 Wörter. Kann Absicht sein: Für
eine Zahnarztpraxis ist Werbung für Botulinumtoxin und Hyaluron
heilmittelwerberechtlich heikel, § 11 HWG setzt engere Grenzen als bei
zahnmedizinischen Leistungen. Kann auch übersehen worden sein. **Die Praxis
muss entscheiden** — und wissen, dass es ein umsatzstarker Bereich ist.

**Belege und Auszeichnungen** — acht Seiten aus `/ueber-uns/`, 12.410 Wörter.
Hier sehe ich keinen guten Grund. Auszeichnungen, Mitgliedschaften,
Kooperationspartner und Presseberichte sind die Nachweise, auf die Google bei
medizinischen Themen abstellt, und für Patientinnen der Unterschied zwischen
behaupteter und belegter Kompetenz. Sie gehören zurück — als eigene Seiten,
nicht als Absatz.

### 5.4 Wo mehrere Seiten zu einer wurden

Siebzehn neue Behandlungsseiten ersetzen jeweils mehrere alte. Die neue Seite
ist dabei kürzer als jede einzelne alte:

| Thema | Seiten | alt | neu | |
|---|---:|---:|---:|---:|
| Kinderzahnheilkunde | 5 → 1 | 11.919 W | 557 W | −95 % |
| Zahnimplantate | 5 → 1 | 10.952 W | 722 W | −93 % |
| Parodontitis | 4 → 1 | 9.919 W | 566 W | −94 % |
| Prophylaxe | 4 → 1 | 8.383 W | 554 W | −93 % |
| Füllungen | 2 → 1 | 8.063 W | 518 W | −94 % |
| Inlays / Onlays | 2 → 1 | 7.495 W | 451 W | −94 % |
| Smile Design | 3 → 1 | 6.270 W | 519 W | −92 % |
| Wurzelkanal | 3 → 1 | 5.505 W | 578 W | −89 % |

### 5.5 Was zu tun ist

1. **Die 36 Behandlungstexte fachlich freigeben lassen.** Ohne Freigabe kann
   nichts ausgebaut werden. *1 Tag.*
2. **Die zwölf umsatzstärksten Behandlungen auf 1.200–1.800 Wörter bringen** —
   und zwar **als örtliche Fassungen**, damit gleichzeitig Kapitel 6 gelöst
   wird. Welche zwölf, weiß die Praxis. *Etwa ein Arbeitstag je Behandlung.*
3. **Die Unterthemen zurückholen, die Suchvolumen haben** — Kosten,
   Haltbarkeit, Risiken, Alternativen. Die alten Adressen leiten bereits
   dorthin; sie würden dann wieder auf eine Seite zeigen, die die Frage
   beantwortet.
4. **Die acht Belegseiten wiederherstellen.** *1 Tag.*

Ohne Schritt 2 und 3 ist mit einem Rückgang bei fachlichen Suchanfragen zu
rechnen. Mit ihnen ist die neue Struktur der alten in beiden Disziplinen
überlegen.

---

## 6. Das Kernversprechen: gebaut, aber noch nicht wirksam

Dies ist der Befund, der beim Gegenprüfen dieses Berichts aufgetaucht ist,
und er betrifft das Ziel, für das der Umbau gemacht wurde.

### 6.1 Der Befund

```
örtliche Behandlungsseiten, deutsch, gebaut          116
davon in der Sitemap angemeldet                        0
Canonical von /potsdam/leistungen/zahnimplantate/  →  https://ku64.de/leistungen/zahnimplantate/
```

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

**Neun Prüfungen laufen beim Bauen** und brauchen nichts weiter:

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
| `sitemap:liste` | Sitemap-Einträge, die zugleich `noindex` tragen |

**Sechs weitere brauchen einen laufenden Server** und gehören vor jeden
Livegang:

| Prüfung | Was sie verhindert |
|---|---|
| `klickpfad` | alles, was nur bis zum ersten Seitenwechsel funktioniert |
| `kontrast:pruefen` | Schrift unter der Kontrastnorm, hell und dunkel |
| `namen:pruefen` | Bedienelemente, die in einer Breite ihren Namen verlieren |
| `formulare:pruefen` | Formulare, die hinter dem Reverse Proxy abgewiesen werden |
| `indexierung:pruefen` | offene Vorschau — und vergessenes `noindex` nach dem Livegang |
| `durchgang` | Überlauf, abgeschnittene Überschriften, Browserfehler |

Dazu `personen:pruefen` und `lighthouse-lauf.mjs`, die berichten statt
abzubrechen.

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

## 10. Was das kostet

Keine Abrechnung — Treiber und Größenordnungen. Die Beträge kennt nur, wer
die Verträge hat.

### 10.1 Laufende Kosten

| Posten | Wovon es abhängt |
|---|---|
| **Hosting (Railway)** | ein Dienst, statische Auslieferung; die Größenordnung ist ein zweistelliger Eurobetrag im Monat |
| **Chat-Berater (Anthropic)** | je Gespräch; abhängig davon, wie viele Fragen gestellt werden |
| **Lächeln-Vorschau (Google Gemini)** | je Bild, und Bildgenerierung ist der teuerste Posten. Begrenzt auf 5 Versuche je Stunde und IP |
| **Sprachberater (ElevenLabs)** | je Sprechminute. Begrenzt auf 10 Gespräche je Stunde und IP |
| **Übersetzungslauf (Anthropic)** | nachts, nur für neu dazugekommene Texte |

Die Drosselungen sind Bremsen, keine Mauern. **Wer die Kosten deckeln will,
braucht ein Ausgabenlimit beim Anbieter** — nicht nur eine Ratenbegrenzung im
Code. Das ist ein offener Punkt.

### 10.2 Einmalige Kosten, die noch anfallen

| Posten | Aufwand |
|---|---|
| Zwölf Behandlungstexte als örtliche Fassungen | 12 Tage Redaktion |
| Acht Belegseiten wiederherstellen | 1 Tag |
| 24 Fotos | Fotograf |
| Fachliche Freigabe der Behandlungstexte | 1 Tag Praxis |
| Sechs Rechtsangaben nachreichen | 30 Min. Praxis, ggf. anwaltliche Prüfung |
| Preisangaben gegenprüfen | 2 Std. Praxis |
| Personennennungen durchsehen | 1,5 Std. |
| Serverseitige Zählung und Dashboard | 1–2 Tage Entwicklung |
| EN und FR gegenlesen | 2 × 1 Tag |
| Bildauslieferung optimieren (WebP, srcset) | 1 Tag Entwicklung |

### 10.3 Was fehlt, um einen Termin zu nennen

Ein Livegang-Datum steht in diesem Bericht bewusst nicht, weil es von zwei
Dingen abhängt, die nicht in der Entwicklung liegen: der fachlichen Freigabe
der Texte und den Pflichtangaben für Impressum und Datenschutz. Sobald für
beides ein Datum steht, ergibt sich der Rest daraus.

---

## 11. Was sich prognostizieren lässt

Zahlen zu versprechen wäre unseriös. Was sich begründen lässt, sind
Richtungen und Größenordnungen — jeweils mit dem Mechanismus dahinter.

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

**Internationale Patienten.** Von 54 englischen Seiten auf 361. Ob daraus
Termine werden, entscheidet sich am Standort und nicht an der Website — aber
die Website steht dem nicht mehr im Weg.

### 11.3 Was gegen den Erfolg arbeitet

**Der Textverlust bei den Behandlungen** (Kapitel 5). Von ~1.600 auf ~195
Wörter eigenen Inhalt je Seite. Fachliche Suchanfragen mit Kaufabsicht laufen
heute auf Seiten, die die Frage kürzer beantworten als vorher. Wird das nicht
geschlossen, ist ein Rückgang in diesem Segment wahrscheinlich — unabhängig
davon, wie gut alles andere ist.

**Die fehlenden Belegseiten** (Kapitel 5.3). Auszeichnungen, Mitgliedschaften
und Kooperationen sind bei medizinischen Themen Rankingfaktoren und
Vertrauenssignale.

**Fehlende Fotos.** 0 von 24 angemeldeten Motiven liegen vor. Drei Standorte
zeigen ein Standbild aus dem Kopfvideo; Wilmersdorf nur die Außenansicht.

**Zwei Livegang-Sperren.** Impressum und Datenschutz sind Entwürfe; die
Preisangaben sind aus Fotos einer gedruckten Auswertung abgetippt.

### 11.4 Eine ehrliche Gesamteinschätzung

Wenn die Seite so live geht, wie sie heute ist:

- **Kurzfristig (0–3 Monate):** stabile bis leicht bessere Sichtbarkeit. Die
  Weiterleitungen halten den Bestand, die Geschwindigkeit hilft, der
  Textverlust wirkt noch nicht voll, weil Google die neuen Seiten erst
  bewerten muss.
- **Mittelfristig (3–9 Monate):** Die Schere geht auf. Örtliche Anfragen
  gewinnen — aber nur, wenn Kapitel 6 gelöst ist. Fachliche verlieren, wenn
  Kapitel 5 offen bleibt.
- **Langfristig:** Die Struktur ist der alten überlegen, die Wartbarkeit erst
  recht. Eine Behandlung an einem Standort zu ergänzen ist eine Zeile; auf
  der alten Website war es eine neue Seite, die jemand von Hand anlegen,
  verlinken und in die Sitemap eintragen musste — und die vergessen wurde.

---

## 12. Was offen ist

### Livegang-Sperren

| Punkt | Warum |
|---|---|
| **Impressum befüllen** | Entwurf mit Platzhaltern. `noindex` beseitigt keine Impressumspflicht (§ 5 DDG) — die Seite ist öffentlich erreichbar |
| **Datenschutzerklärung befüllen** | dasselbe für Art. 13 DSGVO; fehlt u. a. die Speicherdauer der Serverprotokolle |
| **Preisangaben gegenprüfen** | Die Werte sind aus **Fotos der gedruckten Auswertung** übernommen. Bei Preisen einer Zahnarztpraxis ist ein Zahlendreher keine Unschönheit, sondern eine falsche Auskunft |
| **AV-Vertrag mit Google** | für die Lächeln-Vorschau; sie überträgt ein Gesichtsfoto |

### Bei der Praxis

| Punkt | Aufwand |
|---|---|
| Fachliche Freigabe der 36 Behandlungstexte | 1 Tag |
| Zwölf Behandlungstexte als örtliche Fassungen | 12 Tage |
| Acht Belegseiten wiederherstellen | 1 Tag |
| Entscheidung zur ästhetischen Medizin | – |
| 24 Fotos | Fotograf |
| Zehn Personennennungen durchsehen | 1,5 Std. |
| Verfügbarkeit je Standort bestätigen | 2 Std. |
| EN und FR gegenlesen | 2 Tage |

### Bei der Entwicklung

| Punkt | Aufwand |
|---|---|
| Bildauslieferung: WebP und srcset (bis 888 kB je Seite vermeidbar) | 1 Tag |
| Kritisches CSS inline (zwei blockierende Stilblätter, ~150 ms) | 0,5 Tage |
| Serverseitige Zählung und Dashboard-Endpunkt | 1–2 Tage |
| Sprachberater verbinden **oder** ausblenden | Entscheidung nötig |
| Restdeutsch: 62 Auszeichnungs-Funde, Schwerpunkte Anamnese und Kontakt | 1 Tag |

### Beim Betrieb

| Punkt | Wirkung |
|---|---|
| **GitHub → Actions → „Allow GitHub Actions to create and approve pull requests"** | der nächtliche Übersetzungslauf kann sein Ergebnis nicht vorlegen |
| **ElevenLabs-Schlüssel und Agent-ID** | Sprachberater sagt „noch nicht verbunden" |
| **Lächeln-Vorschau einmal durchlaufen lassen** | ungetestet |
| **Ausgabenlimits bei Anthropic, Google, ElevenLabs** | die Drosselungen im Code sind Bremsen, keine Mauern |
| **Search Console und Business Profile** | Kapitel 8.4 |

### Erledigt seit der ersten Fassung dieses Berichts

| Punkt | |
|---|---|
| 39 Typfehler aus `astro check` | 0 Fehler über 142 Dateien |
| Fehlende `tsconfig.json` | angelegt; Prüfumfang 52 → 142 Dateien |
| FAQ-Texte im Seitenkopf | 131 Schlüssel in den Katalog verlegt |
| Kopfvideo startete nie | behoben, nachgemessen |
| Berater-Knopf ohne Namen am Telefon | behoben, neue Prüfung |
| Layoutsprung Teamseite (CLS 0,371) | behoben, jetzt 0 |
| Kontrast in den Filterknöpfen | behoben, Prüfliste erweitert |
| Drei Sitemap-Einträge mit `noindex` | behoben, neue Prüfung |
| Vorschau war indexierbar | gesperrt, neue Prüfung in beide Richtungen |

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

*Erstellt am 30.07.2026. Alle Zahlen sind reproduzierbar; die Skripte liegen
unter `analyse/vergleich/` und `scripts/`.*
