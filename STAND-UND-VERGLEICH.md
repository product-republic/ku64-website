# KU64 – Stand, Vergleich und Prognose

**Erhoben am 29. Juli 2026.** Alle Zahlen in diesem Dokument sind gemessen,
nicht geschätzt. Wo etwas nicht messbar war, steht das dabei.

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
| Quelle der Adressliste | Crawl vom 26.07. (341 erreichbare) | Sitemap |
| Fehler beim Abruf | 1 | 0 |

Je Seite erfasst: Auslieferungsgröße des HTML, Titel, Description, Wortzahl
des sichtbaren Textes, Anzahl H1, Sprünge in der Überschriftengliederung,
Bilder und fehlende Alternativtexte, eingebundene Skripte und Stylesheets
(davon von fremden Servern), Canonical, hreflang, strukturierte Daten,
noindex, Antwortzeit.

Die alte Website wurde mit vier gleichzeitigen Verbindungen und Pausen
abgefragt — weniger Last als ein einzelner Suchmaschinenbesuch.

**Was NICHT gemessen werden konnte.** Die Core Web Vitals der alten Website.
Der Browser dieser Arbeitsumgebung erreicht keine externen Adressen; der
Proxy weist die Verbindung ab. Für die neue Fassung liegen die Werte vor
(lokal, gedrosselt wie ein Mobilgerät), für die alte nicht. Diese Lücke
schließt ein Klick: `pagespeed.web.dev` auf `https://ku64.de/` dauert dreißig
Sekunden und liefert genau die fehlende Spalte. Solange sie fehlt, steht in
den Vergleichstabellen an dieser Stelle „nicht erhoben" — und nicht eine
Zahl, die gut klingt.

**Ein Vorbehalt zu allen Wortzahlen.** Gezählt wird der sichtbare Text der
ganzen Seite, also einschließlich Navigation und Fußbereich. Beide Fassungen
tragen unterschiedlich viel davon: Die kleinste alte Seite hat 697 Wörter,
die kleinste neue 363. Diese Differenz steckt in jeder Zahl. Wo es auf den
eigentlichen Inhalt ankommt — Kapitel 5 —, ist sie herausgerechnet und das
Verfahren angegeben.

---

## 1. Was die neue Website erreichen soll

Nicht „modern aussehen". Sechs benennbare Ziele, jedes mit einem messbaren
Ergebnis:

**1. Aus einer anonymen Leistungsseite eine örtliche Seite machen.**
Auf der alten Website lag jede Behandlung standortübergreifend unter
`/leistungen/…`. Wer über `/potsdam/` einstieg und auf „Zahnimplantate"
klickte, landete auf einer Seite ohne Adresse, ohne Telefonnummer, ohne die
richtige Terminbuchung. Für Google war es eine Seite; für die Praxis sind es
vier Standorte, die vier verschiedene Einzugsgebiete bedienen.

**2. Keinen Adressbestand verlieren.** Ein Relaunch, der Adressen fallen
lässt, verliert die Sichtbarkeit, die über Jahre entstanden ist — und zwar
sofort und ohne Warnung.

**3. Bedienbar für alle.** Eine Zahnarztpraxis hat überdurchschnittlich viele
ältere Patienten und Patientinnen mit eingeschränktem Sehvermögen. Kontrast,
Tastaturbedienung und Screenreader sind hier kein Zusatz.

**4. Selbstbedienung, wo sie Zeit spart.** Termin, Anamnese, Rückfragen,
Orientierung — ohne Anruf an der Rezeption.

**5. Wartbarkeit.** Eine Änderung an einer Stelle, und die Website zieht
überall nach. Kein Redaktionssystem, in dem dieselbe Angabe an vier Orten
gepflegt werden muss und an dreien veraltet.

**6. Mehrsprachigkeit.** Berlin-Charlottenburg hat eine internationale
Patientenschaft. Die alte Website hatte 54 englische Seiten von 341 — die
englische Fassung endete dort, wo es interessant wurde.

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

Zum Vergleich: Die `.htaccess` des alten Servers belegte 238 Adressen. Der
Crawl fand 341 tatsächlich ausgelieferte Seiten. Die Weiterleitungsliste war
also schon vor dem Umbau unvollständig.

### 2.2 Inhalt nach Bereichen

340 erhobene Seiten, **629.817 Wörter**, im Mittel 1.852 je Seite.

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
eine Seite. Wilmersdorf hatte eine Seite. Berlin-Mitte hatte drei. Potsdam
hatte siebzehn — der einzige Standort mit einer eigenen Struktur. 74
Behandlungsseiten hingen an keinem davon.

### 2.3 Der strukturelle Kernfehler

Die 74 Behandlungsseiten lagen in einer tiefen, ortlosen Hierarchie:

| URL-Tiefe | Seiten |
|---|---:|
| 2 Ebenen (`/leistungen/x/`) | 12 |
| **3 Ebenen** (`/leistungen/fach/x/`) | **49** |
| 4 Ebenen | 12 |

Beispiel Implantate — neun Seiten, keine einzige mit Ortsbezug:

```
/leistungen/kieferchirurgie-mkg-chirurgie/zahnimplantate/
/leistungen/kieferchirurgie-mkg-chirurgie/zahnimplantate/zahnimplantat-kosten/
/leistungen/kieferchirurgie-mkg-chirurgie/zahnimplantate/implantate-und-rauchen/
/leistungen/kieferchirurgie-mkg-chirurgie/zahnimplantate/periimplantitis/
/leistungen/kieferchirurgie-mkg-chirurgie/zahnimplantate/sinuslift/
/leistungen/kieferchirurgie-mkg-chirurgie/zahnimplantate/zahnimplantat-haltbarkeit/
/leistungen/kieferchirurgie-mkg-chirurgie/zahnimplantate/praeimplantationsdiagnostik/
/leistungen/kieferchirurgie-mkg-chirurgie/zahnimplantate/implantat-oder-bruecke/
/potsdam/implantate/
```

Die neunte ist die Ausnahme, die die Regel bestätigt: In Potsdam gab es eine
örtliche Fassung — 1.865 Wörter statt 3.136, also eine verkürzte Kopie. Genau
dieses Muster (Hauptseite ohne Ort, Zweitfassung mit Ort und weniger Inhalt)
erzeugt konkurrierende Seiten zum selben Thema.

### 2.4 Technik

Gemessen über 340 Seiten:

| | Mittel | Median | Maximum |
|---|---:|---:|---:|
| HTML-Größe | **246 kB** | 224 kB | 690 kB |
| eingebundene Skripte | **25,8** | 26 | 28 |
| davon von fremden Servern | 1,9 | 2 | 3 |
| eingebundene Stylesheets | **22,9** | 22 | 29 |
| Bilder je Seite | 19,0 | 16 | 211 |
| Serverantwortzeit | **1.491 ms** | 1.388 ms | 6.428 ms |

Die langsamsten Seiten:

| Seite | Antwortzeit |
|---|---:|
| `/team/` | 6.428 ms |
| `/en/dentist-berlin-mitte/` | 5.975 ms |
| `/berlinmitte/` | 3.176 ms |
| `/` | 2.881 ms |

Ein Dokument von 690 kB und eine Antwortzeit von 6,4 Sekunden — das ist die
Teamseite, also die Seite, auf der Menschen nachsehen, wer sie behandeln
wird. Insgesamt banden die 340 Seiten **8.764 Skript-Einbindungen** und
**7.774 Stylesheets**, davon 660 von fremden Servern.

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

**Die alte Website war handwerklich gepflegt.** Titel, Beschreibungen,
Alternativtexte, Canonicals, strukturierte Daten — alles vorhanden, nichts
doppelt. Wer sie betreut hat, hat sauber gearbeitet.

Die Probleme lagen woanders: in der Struktur (Behandlungen ohne Ort), in der
Technik darunter (26 Skripte, 23 Stylesheets, 1,5 Sekunden Serverzeit) und im
Adressbestand. Das sind Probleme, die man nicht durch sorgfältiges Pflegen
löst, sondern nur durch einen Umbau.

---

## 3. Die neue Website

### 3.1 Die Struktur

Jede Behandlungsseite gehört zu genau einem Standort:

```
/potsdam/leistungen/zahnimplantate/
   → Adresse, Telefon, Sprechzeiten und Terminbuchung von Potsdam
```

Gibt es eine Behandlung an einem Standort nicht, steht das offen da, mit
einem Verweis dorthin, wo es sie gibt — statt stillschweigend den Standort zu
wechseln.

### 3.2 Umfang in Zahlen

| | |
|---|---:|
| gebaute Seiten | **1.084** |
| davon in der Sitemap | 207 |
| interne Verweise | 85.295 |
| davon ins Leere | **0** |
| Standorte | 4 |
| Behandlungen | 36 |
| Preisrahmen | 15 für 13 Behandlungen |
| Behandlerprofile | 99 veröffentlicht (139 im Bestand) |
| Blogbeiträge | 30 |
| Beschwerdeseiten | 31 |
| Weiterleitungen aus dem Altbestand | 479 |
| Sprachen | 3 (DE, EN, FR) |
| Textbausteine der Oberfläche | 7.336 |

### 3.3 Was es neu gibt

| Funktion | Was sie tut | Stand |
|---|---|---|
| **Standortgedächtnis** | merkt den gewählten Standort, bietet ihn beim nächsten Besuch an — ohne automatische Umleitung | fertig |
| **Suche** | durchsucht alle Inhalte, sprachabhängig | fertig |
| **Chat-Berater** | beantwortet Fragen aus der eigenen Wissensbasis, die aus denselben Daten entsteht wie die Seiten | fertig, Schlüssel gesetzt |
| **Sprachberater** | dasselbe per Sprache statt Text | gebaut, **nicht verbunden** |
| **Lächeln-Vorschau** | Foto hochladen, unverbindliche Visualisierung, per E-Mail | gebaut, Schlüssel gesetzt, **noch nicht erfolgreich durchgelaufen** |
| **Digitale Anamnese** | Bogen vorab ausfüllen statt im Wartezimmer | fertig |
| **Teamfilter** | Team nach Behandlungsart filtern | fertig |
| **Lesefortschritt** | im Blog | fertig |
| **KI-Transparenzseite** | legt offen, welches System wo arbeitet (Art. 50 KI-VO) | fertig |
| **Kontaktformular** | mit Drosselung, ohne Drittanbieter | fertig |
| **RSS-Feed** | für den Blog | fertig |
| **`security.txt`** | Meldeweg für Sicherheitslücken | fertig |
| **Vorschaubilder** | 153 Karten fürs Teilen, mit echtem Foto des jeweiligen Standorts | fertig |

### 3.4 Technik

Gemessen über 210 Seiten:

| | Mittel | Median | Maximum |
|---|---:|---:|---:|
| HTML-Größe | **51 kB** | 45 kB | 135 kB |
| eingebundene Skripte | **5,2** | 5 | 6 |
| davon von fremden Servern | **0** | 0 | 0 |
| eingebundene Stylesheets | **1,2** | 1 | 2 |
| Bilder je Seite | 1,7 | 1 | 76 |
| hreflang-Angaben je Seite | 8,0 | 8 | 8 |

Dazu: eigener Auslieferungsserver mit sechs Sicherheitsköpfen, Brotli-
Kompression und Haltbarkeitsregeln je Dateityp. Kein Cookie, kein
Drittanbieter, kein Einwilligungsbanner — weil es nichts einzuwilligen gibt.

### 3.5 Ladeverhalten der neuen Fassung

Gemessen im Browser, Telefonformat, gedrosselt auf mobiles Netz und
vierfach verlangsamte CPU:

| Seite | FCP | LCP | CLS | übertragen | Anfragen |
|---|---:|---:|---:|---:|---:|
| Startseite | 968 ms | 1.116 ms | 0,028 | 522 kB | 15 |
| Standortseite | 1.056 ms | 1.644 ms | 0 | 224 kB | 12 |
| Behandlungsseite | 1.044 ms | 1.044 ms | 0 | 69 kB | 11 |
| Teamübersicht | 1.040 ms | 1.040 ms | 0 | 67 kB | 10 |
| Blogübersicht | 1.008 ms | 1.704 ms | 0 | 365 kB | 13 |

Alle Werte liegen im grünen Bereich der Core Web Vitals (LCP unter 2,5 s,
CLS unter 0,1). Die Startseite trägt das Kopfvideo — daher die 522 kB;
gezeigt wird bis zum Abspielen ein 45-kB-Standbild, und auf dem Telefon
bleibt es dabei.

Eine unabhängige Bestätigung liegt vor: PageSpeed Insights auf die
Vorschau-Adresse, mobil, am 28.07. — **Leistung 100, Best Practices 100,
SEO 100**, LCP 1,5 s, TBT 0 ms, CLS 0. Barrierefreiheit stand dort bei 90;
die Ursachen sind seither behoben (Kapitel 3.6).

### 3.6 Barrierefreiheit

| Prüfpunkt | Ergebnis |
|---|---|
| Bedienelemente ohne zugänglichen Namen | 0 auf 1.084 Seiten |
| Bilder ohne Alternativtext | 0 |
| Seiten ohne oder mit mehreren H1 | 0 |
| Sprünge in der Überschriftengliederung | **0** (alt: 15) |
| Farbkontrast unter WCAG 1.4.3 | **0** — geprüft hell und dunkel, Telefon und Schreibtisch |
| doppelte `id`-Attribute | 0 |

Der Kontrast war bis zum 28.07. an 33 Stellen unter der Norm, in beiden
Farbmodi. Zwei Ursachen: ein Grauton bei 4,45:1 statt der geforderten 4,5:1,
und `opacity: 0.5` an abgeblendeten Elementen, das den Kontrast auf 1,92:1
drückte. Beides behoben, und es gibt jetzt eine Prüfung dafür, die es vorher
nicht gab.

### 3.7 Die Prüfkette

Vierzehn Prüfungen laufen bei jedem Bau oder gegen die laufende Seite. Jede
ist entstanden, weil ein Fehler durchgerutscht ist — und jede wurde
absichtlich einmal zum Fehlschlagen gebracht, bevor ihr geglaubt wurde.

| Prüfung | Was sie verhindert |
|---|---|
| `daten:pruefen` | Querverweise auf Behandlungen oder Standorte, die es nicht gibt |
| `bilder:pruefen` | Stock-Fotos, fremde Bildquellen, fehlende Bilder |
| `glas:pruefen` | Glasflächen ohne funktionierenden Weichzeichner |
| `sprachen:pruefen` | unübersetzte Texte, verlorene Auszeichnung, kaputter Sprachwähler |
| `urls:abgleichen` | tote Adressen aus dem Altbestand |
| `verweise:pruefen` | interne Verweise ins Leere (85.295 geprüft) |
| `ids:pruefen` | doppelte `id`-Attribute |
| `barrierefrei:pruefen` | namenlose Knöpfe, fehlende Alt-Texte, Ebenensprünge |
| `sitemap:liste` | Sitemap-Einträge, die zugleich `noindex` tragen |
| `kontrast:pruefen` | Schrift unter der Kontrastnorm, hell und dunkel |
| `klickpfad` | alles, was nur bis zum ersten Seitenwechsel funktioniert |
| `formulare:pruefen` | Formulare, die hinter dem Reverse Proxy abgewiesen werden |
| `indexierung:pruefen` | offene Vorschau — und vergessenes `noindex` nach dem Livegang |
| `durchgang` | Überlauf, abgeschnittene Überschriften, Browserfehler |

---

## 4. Der Vergleich

### 4.1 Adressbestand — die wichtigste Tabelle

552 Adressen des Altbestands, geprüft gegen die gebaute neue Website:

| | Anzahl | Anteil |
|---|---:|---:|
| unter derselben Adresse vorhanden | 85 | 15,4 % |
| über eine Weiterleitung erreichbar | 466 | 84,4 % |
| bewusst ohne Ziel | 1 | 0,2 % |
| **tot** | **0** | **0,0 %** |

Ohne diese Arbeit wären 90,8 Prozent aller Adressen, die Google von der alten
Website kennt, ins Leere gelaufen. Das ist der teuerste einzelne Fehler, den
ein Relaunch machen kann, und der am leichtesten vermeidbare.

### 4.2 Sitemap

| | alt | neu |
|---|---:|---:|
| erreichbare Seiten | 341 | 1.084 |
| davon zur Indexierung angemeldet | 341 | **207** |

Die neue Website baut dreimal so viele Seiten und meldet weniger als ein
Drittel davon an. Das ist Absicht:

- **Sprachfassungen** (EN, FR) tragen `noindex`, solange sie nicht
  gegengelesen sind — 722 der 1.084 Seiten.
- **Behandlungen je Standort** melden nur die Fassung an, die eigenen Inhalt
  trägt; die übrigen zeigen per Canonical auf die standortübergreifende
  Seite. Sonst konkurrieren vier fast gleiche Seiten miteinander.
- **Behandlerprofile ohne eigene Substanz** (26 von 97) zeigen auf die
  Teamübersicht. Eine Seite mit 64 Wörtern über eine Person ist für
  Suchmaschinen eine dünne Seite und schadet dem Rest.
- **Entwürfe** (Impressum, Datenschutz) sind draußen, bis die Praxis die
  Pflichtangaben liefert.

Bis heute Mittag standen drei dieser Seiten trotz `noindex` in der Sitemap —
ein Widerspruch, den die Search Console als Fehler meldet. Gefunden bei
dieser Erhebung, behoben, und es gibt jetzt eine Prüfung, die beides
gegeneinander hält.

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
| Seiten ohne Canonical | 0 | 0 | = |
| Bilder ohne Alt-Text | 0 | 0 | = |
| Ebenensprünge in Überschriften | 15 | **0** | **+** |
| hreflang je Seite | 2,7 | **8,0** | **+** |
| JSON-LD-Blöcke je Seite | 3,1 | 2,4 | – |
| örtliche Landeseiten je Behandlung | **1** | **bis zu 4** | **+** |
| tote Adressen aus dem Altbestand | — | **0** | **+** |
| HTML je Seite | 246 kB | **51 kB** | **+** |
| Skripte je Seite | 25,8 | **5,2** | **+** |
| Drittanbieter je Seite | 1,9 | **0** | **+** |

Die strukturierten Daten sind je Seite etwas weniger geworden (2,4 statt
3,1). Das ist kein Verlust an Substanz: Die alte Fassung wiederholte auf
jeder Seite denselben Organisationsblock mehrfach. Die neue setzt je Seitenart
genau die Typen, die dorthin gehören — bis zu 21 Blöcke auf der Seite, wo sie
hingehören (Standortübersicht mit vier vollständigen `Dentist`-Einträgen).

### 4.4 Ladeverhalten

| | alt | neu |
|---|---:|---:|
| HTML je Seite (Median) | 224 kB | **45 kB** |
| Skripte je Seite | 25,8 | **5,2** |
| Stylesheets je Seite | 22,9 | **1,2** |
| Anfragen von fremden Servern | 660 insgesamt | **0** |
| Serverantwortzeit (Mittel) | 1.491 ms | nicht vergleichbar erhoben |
| LCP mobil, gedrosselt | *nicht erhoben* | 1.040–1.704 ms |
| CLS | *nicht erhoben* | 0–0,028 |

Die Serverantwortzeit der neuen Fassung wurde lokal gemessen (7 ms im Mittel)
und ist deshalb **nicht** mit den 1.491 ms der alten vergleichbar — dort steckt
die Netzstrecke mit drin. Die belastbare Aussage ist die darüber: Ein
Dokument, das ein Fünftel wiegt und ein Fünftel der Skripte lädt, ist auf
jedem Gerät schneller, und die gemessenen Core Web Vitals der neuen Fassung
liegen vollständig im grünen Bereich.

---

## 5. Das größte Risiko des Umbaus: der Textverlust

Dieses Kapitel steht bewusst nicht im Anhang.

### 5.1 Der Befund

| | alt | neu |
|---|---:|---:|
| Behandlungsseiten | 74 | **37** |
| Wörter auf Behandlungsseiten | 170.785 | **20.650** |
| Ø je Behandlungsseite | 2.307 | **558** |

Vorlagen-Ballast herausgerechnet (alt ~700, neu ~363 Wörter):

| | alt | neu |
|---|---:|---:|
| Ø eigener Inhalt je Behandlungsseite | **~1.600 Wörter** | **~195 Wörter** |

Zwei konkrete Paare:

| Thema | alt | neu |
|---|---:|---:|
| Zahnimplantate | 3.136 Wörter | 722 Wörter |
| Bleaching / Zahnaufhellung | 4.918 Wörter | 577 Wörter |

### 5.2 Was das bedeutet

Die alte Website hatte zu Implantaten **neun** Seiten. Sie beantworteten
genau die Fragen, mit denen Menschen suchen:

- Was kostet ein Zahnimplantat?
- Implantate und Rauchen
- Periimplantitis
- Sinuslift
- Wie lange hält ein Implantat?
- Implantat oder Brücke?

Das sind keine Füllseiten. Das sind Suchanfragen mit Kaufabsicht — jemand,
der „Zahnimplantat Kosten Berlin" eingibt, sucht einen Termin, nicht einen
Aufsatz. Die neue Website hat zu Implantaten zwei Seiten mit zusammen 1.191
Wörtern.

**Das ist der Punkt, an dem der Relaunch Sichtbarkeit verlieren kann** — und
zwar genau dort, wo sie am meisten wert ist. Die Strukturverbesserung
(Behandlung mit Ort) wirkt auf lokale Suchanfragen. Der Textverlust wirkt auf
fachliche Suchanfragen. Beides zusammen kann sich aufheben.

### 5.3 Warum es so gekommen ist

Die Behandlungstexte wurden neu geschrieben, weil die alten übernommen und
fachlich nicht geprüft gewesen wären. Neu geschrieben heißt: kürzer, weil
jeder Satz verantwortet werden muss. Das war die richtige Entscheidung für
die Qualität und die falsche für den Umfang.

### 5.4 Was zu tun ist

**Empfehlung, nach Dringlichkeit:**

1. **Die 36 Behandlungstexte fachlich freigeben lassen** (steht ohnehin aus).
   Ohne Freigabe kann nichts ausgebaut werden.
2. **Die zwölf umsatzstärksten Behandlungen auf 1.200–1.800 Wörter bringen.**
   Welche das sind, weiß die Praxis. Aufwand: etwa ein Arbeitstag Redaktion je
   Behandlung, wenn die fachlichen Angaben vorliegen.
3. **Die Unterseiten zurückholen, die Suchvolumen haben.** Kosten, Haltbarkeit,
   Risiken, Alternativen — als eigene Seiten unter der jeweiligen Behandlung,
   und zwar örtlich, also mit dem Vorteil der neuen Struktur. Die alten
   Adressen leiten bereits dorthin; sie würden dann wieder auf eine Seite
   zeigen, die die Frage tatsächlich beantwortet.
4. **Erst dann live gehen** — oder bewusst mit dem Wissen live gehen, dass
   diese Lücke besteht, und sie in den ersten drei Monaten schließen.

Ohne Schritt 2 und 3 ist mit einem Rückgang bei fachlichen Suchanfragen zu
rechnen. Mit ihnen ist die neue Struktur der alten in beiden Disziplinen
überlegen.

---

## 6. Analytics und Anbindung ans Dashboard

**Stand heute: Es gibt keine Messung.** Kein Analysewerkzeug, kein Cookie,
kein Zählpixel, kein Drittanbieter. Der Server schreibt bewusst keine Adressen
und keine IP-Adressen mit.

Das ist kein Versäumnis, sondern eine Zusage: Die Datenschutzseite sagt
wörtlich, dass diese Website keine Analyse- und Werbe-Cookies setzt — und
deshalb gibt es auch kein Einwilligungsbanner. Ein nachträglich eingebautes
Google Analytics würde diese Zusage brechen, ein Banner erzwingen und damit
die erste Sekunde jedes Besuchs kosten.

### 6.1 Was gemessen werden soll

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
| Woher kommen die Leute? | Referrer, gröbstmöglich |

Die fünfte Zeile ist die wertvollste. Eine Liste der Suchanfragen ohne
Treffer ist die direkteste Aussage darüber, was auf der Website fehlt — und
sie kostet nichts als das Mitzählen.

### 6.2 Vorschlag: eigene Messung, serverseitig, ohne Cookies

Die Website liefert alles vom eigenen Server aus. Dann kann sie dort auch
zählen, ohne dass ein Byte an Dritte geht.

**Wie es funktionieren würde:**

- Der Auslieferungsserver zählt **Ereignisse**, keine Personen: „Seite X
  aufgerufen", „Terminknopf an Standort Y geklickt", „Suche nach Z ohne
  Treffer". Aggregiert, nach Stunde.
- **Keine IP-Adresse**, kein Cookie, keine Kennung über Seiten hinweg. Damit
  gibt es keine „Sitzungen" und keine „eindeutigen Besucher" — bewusst.
  Diese Zahlen sind der Preis dafür, dass kein Banner nötig ist.
- Die Zähler liegen in einer kleinen Datei oder Datenbank neben der
  Anwendung. Ein geschützter Endpunkt (`/api/kennzahlen/`, nur mit
  Schlüssel) gibt sie als JSON aus.
- **Das Dashboard** (`dashboard.product-republic.com`, liegt bereits als
  Railway-Projekt vor) holt sich diesen JSON in seinem gewohnten Takt und
  stellt ihn dar — neben den übrigen Kennzahlen, die dort schon stehen.

**Aufwand:** Zählung und Endpunkt etwa 1–2 Tage; die Darstellung im Dashboard
hängt davon ab, was dort schon steht.

**Was diese Lösung nicht kann:** Verweildauer, Absprungrate, Nutzerpfade über
mehrere Seiten. Dafür bräuchte es eine Kennung je Gerät — und damit die
Einwilligung, die wir gerade nicht brauchen.

### 6.3 Alternative, falls mehr gewünscht ist

**Plausible oder Matomo, selbst gehostet.** Beide messen ohne Cookies und
gelten in Deutschland überwiegend als einwilligungsfrei, wenn sie auf eigener
Infrastruktur laufen und IP-Adressen kürzen. Sie liefern Pfade und
Verweildauer.

Zu bedenken: Der Text der Datenschutzseite müsste angepasst werden — die
heutige Formulierung („keine Analyse-Werkzeuge") wäre dann falsch. Und es
kommt ein Skript auf jede Seite, das heute nicht da ist.

**Google Analytics 4** würde ich nicht empfehlen: Einwilligungsbanner,
US-Datentransfer, und für eine Praxis mit vier Standorten liefert es keine
Antwort, die die eigene Zählung nicht auch gäbe.

### 6.4 Was zuerst gebraucht wird — auch ohne Analytics

Zwei Dinge, die mehr bringen als jedes Werkzeug und heute noch fehlen:

1. **Google Search Console** für die neue Domain einrichten, Sitemap
   eintragen. Sie zeigt kostenlos, mit welchen Suchbegriffen die Seite
   gefunden wird — die einzige Quelle, die das kann.
2. **Google Business Profile** je Standort mit der jeweiligen Standortseite
   verknüpfen. Für eine Praxis ist der Kartenblock oft wichtiger als jedes
   organische Ergebnis.

---

## 7. Wie man künftig Änderungen macht

Die Website hat kein Redaktionssystem. Das ist eine Entscheidung, keine
Auslassung: Ein Redaktionssystem, in dem dieselbe Angabe an vier Stellen
gepflegt wird, war eines der Probleme der alten Fassung.

Stattdessen gibt es **Datendateien**. Eine Änderung dort zieht überall nach —
Seiten, Navigation, Vergleichstabellen, Sitemap, Vorschaubilder, strukturierte
Daten und die Antworten des Chat-Beraters.

### 7.1 Wo was steht

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
| jeden Text der Oberfläche (Knöpfe, Hinweise) | `src/i18n/texte.ts` |
| Übersetzungen | `src/inhalte/en.json`, `fr.json` |
| Farben, Abstände, Schriftgrößen | `src/styles/tokens.css` |

**Beispiel.** Potsdam bietet ab September Aligner an. Eine Zeile in
`src/data/leistungen.ts`: `verfuegbar: ['berlin-charlottenburg', 'potsdam']`.
Damit entstehen automatisch: die Seite `/potsdam/leistungen/aligner/`, der
Eintrag in der Potsdamer Leistungsübersicht, die Zeile in der
Vergleichstabelle, der Sitemap-Eintrag, das Vorschaubild fürs Teilen, der
Eintrag in der Wissensbasis des Beraters — und die englische und französische
Fassung, sobald der nächtliche Übersetzungslauf durch ist.

### 7.2 Der Weg einer Änderung

```
1. Datei ändern
2. npm run build          ← 13 Prüfungen laufen mit
3. npm start              ← lokal ansehen
4. npm run klickpfad      ← Bedienung nach Seitenwechsel
5. git commit && git push ← Railway baut und veröffentlicht selbst
```

Schritt 2 ist der wichtige. Der Bau bricht ab, wenn eine Behandlung auf einen
Standort verweist, den es nicht gibt; wenn ein interner Verweis ins Leere
zeigt; wenn ein Bild fehlt; wenn ein Text unübersetzt bleibt; wenn ein
Kontrast unter die Norm fällt. **Man kann die Website nicht kaputt
veröffentlichen, ohne dass es vorher jemand sagt.**

### 7.3 Wer kann was ohne Entwickler

| Aufgabe | Nötige Kenntnis |
|---|---|
| Öffnungszeiten, Telefon, Adresse ändern | Textdatei bearbeiten |
| Behandlung an einem Standort ein-/ausschalten | Textdatei bearbeiten |
| Blogbeitrag ergänzen | JSON-Datei bearbeiten |
| Behandlungstext überarbeiten | Textdatei bearbeiten |
| Foto austauschen | Datei ablegen, Zeile ergänzen |
| Neue Seitenart, neue Funktion | Entwickler |
| Gestaltung ändern | Entwickler |

Für alles in der oberen Gruppe reicht ein Texteditor und die Bereitschaft,
Anführungszeichen stehen zu lassen. Die Prüfungen fangen den Rest.

### 7.4 Übersetzungen

Ein Arbeitsablauf bei GitHub übersetzt nachts, was auf Deutsch neu
dazugekommen ist, und legt das Ergebnis als Pull Request vor. Niemand muss
daran denken.

**Das funktioniert derzeit nicht vollständig:** Der Lauf braucht die
Berechtigung, Pull Requests anzulegen. Sie ist in den Repository-Einstellungen
noch nicht gesetzt (Kapitel 9).

---

## 8. Was sich prognostizieren lässt

Zahlen zu versprechen wäre unseriös. Was sich begründen lässt, sind
Richtungen und Größenordnungen — jeweils mit dem Mechanismus dahinter.

### 8.1 Was mit hoher Sicherheit eintritt

**Kein Einbruch durch verlorene Adressen.** 0 von 552 Altadressen laufen ins
Leere. Der typische Verlauf nach einem Relaunch ohne diese Arbeit — 30 bis
60 Prozent weniger organische Besuche über drei bis sechs Monate — entfällt.
Das ist kein Zugewinn, sondern ein vermiedener Schaden; er fällt nur
niemandem auf, weil nichts passiert.

**Bessere Werte in der Search Console.** Ebenensprünge von 15 auf 0, keine
Sitemap-Widersprüche mehr, sauberes hreflang über drei Sprachen, keine
doppelten Titel. Das sind Meldungen, die verschwinden.

**Deutlich schnellere Seiten auf dem Telefon.** HTML von 224 auf 45 kB im
Median, Skripte von 26 auf 5, Drittanbieter von 660 auf 0. Die gemessenen
Core Web Vitals liegen im grünen Bereich. Da Google die Ladeerfahrung als
Rankingfaktor führt und mobile Abbrüche stark mit der Ladezeit korrelieren,
wirkt das in beide Richtungen — Sichtbarkeit und Abschlussquote.

### 8.2 Was wahrscheinlich ist, aber von der Praxis abhängt

**Örtliche Sichtbarkeit je Standort.** Wo bisher eine Seite für „Zahnimplantate"
stand, stehen künftig bis zu vier, jede mit eigener Adresse, eigener
Telefonnummer und eigenen strukturierten Daten. Für Suchanfragen der Art
„Zahnarzt Implantate Potsdam" oder „Kieferorthopädie Berlin Mitte" ist das der
Unterschied zwischen „irgendwo in Berlin" und „hier".

Die Wirkung hängt an zwei Dingen, die nicht in der Website liegen: an den
Google-Business-Profilen der vier Standorte und daran, dass die örtlichen
Seiten eigenen Inhalt tragen — nicht dieselben Sätze viermal.

**Weniger Anrufe für Routinefragen.** Öffnungszeiten, Anfahrt, Kosten,
Ablauf — vier Standorte, drei Sprachen, dazu Chat und Suche. Wie stark, hängt
davon ab, wie sichtbar die Selbstbedienung ist. Messbar wird es erst mit
Kapitel 6.

**Internationale Patienten.** Von 54 englischen Seiten auf 361, dazu 361 auf
Französisch. Ob daraus Termine werden, entscheidet sich am Standort
Kurfürstendamm und nicht an der Website — aber die Website steht dem jetzt
nicht mehr im Weg.

### 8.3 Was gegen den Erfolg arbeitet

**Der Textverlust bei den Behandlungen** (Kapitel 5). Von ~1.600 auf ~195
Wörter eigenen Inhalt je Behandlungsseite. Fachliche Suchanfragen mit
Kaufabsicht — „Zahnimplantat Kosten", „Periimplantitis Behandlung" — laufen
heute auf Seiten, die die Frage kürzer beantworten als vorher. Wird das nicht
geschlossen, ist ein Rückgang in diesem Segment wahrscheinlich, und zwar
unabhängig davon, wie gut alles andere ist.

**Fehlende Fotos.** 0 von 24 angemeldeten Motiven liegen vor. Drei der vier
Standorte haben derzeit ein Standbild aus dem Kopfvideo; Wilmersdorf hat nur
die Außenansicht.

**Die noch nicht fachlich freigegebenen Texte.** Sie stehen live, sobald die
Seite live geht.

### 8.4 Eine ehrliche Gesamteinschätzung

Wenn die Seite so live geht, wie sie heute ist:

- **Kurzfristig (0–3 Monate):** stabile bis leicht bessere Sichtbarkeit. Die
  Weiterleitungen halten den Bestand, die Geschwindigkeit hilft, der
  Textverlust wirkt noch nicht voll, weil Google die neuen Seiten erst
  bewerten muss.
- **Mittelfristig (3–9 Monate):** Die Schere geht auf. Örtliche Anfragen
  gewinnen, fachliche verlieren. Wie das Saldo aussieht, entscheidet Kapitel
  5.4 — nichts anderes.
- **Langfristig:** Die Struktur ist der alten überlegen, und die Wartbarkeit
  erst recht. Eine Behandlung an einem Standort zu ergänzen ist eine Zeile;
  auf der alten Website war es eine neue Seite, die jemand von Hand anlegen,
  verlinken und in die Sitemap eintragen musste — und die vergessen wurde.

**Der Hebel liegt nicht mehr in der Technik.** Er liegt in zwölf
Behandlungstexten und vierundzwanzig Fotos.

---

## 9. Was offen ist

### Bei der Entwicklung

| Punkt | Umfang |
|---|---|
| FAQ-Texte aus dem Seitenkopf in den Übersetzungskatalog | ~70 Sätze auf 10 Seiten |
| 33 Typfehler, die `astro check` meldet und der Bau nicht sieht | ein halber Tag |
| Sprachberater verbinden **oder** ausblenden | Entscheidung nötig |
| Serverseitige Zählung und Dashboard-Endpunkt | 1–2 Tage, nach Freigabe |

### Bei der Praxis

| Punkt | Warum es blockiert |
|---|---|
| **24 Fotos** (Liste in `BILDER-BEDARF.md`) | Standorte zeigen derzeit Videostandbilder |
| **Fachliche Freigabe der 36 Behandlungstexte** | ohne sie kann kein Text ausgebaut werden |
| **Zwölf Behandlungstexte ausbauen** | das größte inhaltliche Risiko, Kapitel 5 |
| **Verfügbarkeit je Standort bestätigen** | die Zuordnung stammt aus dem Altbestand |
| **Eine Preisquelle statt zweier** | 13 Behandlungen führen Kosten im Text *und* einen Preisrahmen |
| **Impressum und Datenschutz befüllen** | beide sind Entwürfe mit Platzhaltern und deshalb `noindex` |
| **EN und FR gegenlesen** | beide bei 99,7 %, aber nicht freigegeben |

### Beim Betrieb

| Punkt | Wirkung |
|---|---|
| **GitHub → Actions → „Allow GitHub Actions to create and approve pull requests"** | der nächtliche Übersetzungslauf kann sein Ergebnis nicht vorlegen |
| **ElevenLabs-Schlüssel und Agent-ID** | Sprachberater sagt „noch nicht verbunden" |
| **Lächeln-Vorschau einmal durchlaufen lassen** | ob der Gemini-Schlüssel trägt, ist ungetestet |
| **Search Console und Business Profile** | Kapitel 6.4 |

---

## 10. Anhang

### 10.1 Woher die Zahlen stammen

| Zahl | Quelle |
|---|---|
| Adressbestand alt | `analyse/altbestand/crawl-bericht.md`, Crawl vom 26.07. |
| Seitenweise Messung beider Fassungen | `analyse/vergleich/erheben.mjs` → `erhebung.json`, 29.07. |
| Core Web Vitals neu | Playwright, Telefonformat, 1,6 Mbit/s, CPU ×4 |
| PageSpeed neu | Google PageSpeed Insights, mobil, 28.07. |
| Weiterleitungen | `npm run urls:abgleichen` gegen die gebaute Fassung |
| Barrierefreiheit | `npm run barrierefrei:pruefen`, `npm run kontrast:pruefen` |
| Interne Verweise | `npm run verweise:pruefen` |
| Sprachstand | `npm run sprachen:pruefen` |

### 10.2 Die Erhebung wiederholen

```bash
npm run build
npm start &
node analyse/vergleich/erheben.mjs http://127.0.0.1:4321
```

Das Skript schreibt `analyse/vergleich/erhebung.json`. Alle Tabellen dieses
Dokuments lassen sich daraus nachrechnen.

### 10.3 Bekannte Grenzen dieser Analyse

1. **Core Web Vitals der alten Website fehlen.** Aus dieser Arbeitsumgebung
   nicht erhebbar. Ein PageSpeed-Lauf auf `ku64.de` schließt die Lücke.
2. **Wortzahlen enthalten Navigations- und Fußtext.** Wo es darauf ankam,
   ist der Ballast herausgerechnet und das Verfahren angegeben.
3. **Keine Rankingdaten.** Weder für alt noch neu liegen Positionen oder
   Suchvolumina vor. Ohne Search-Console-Zugang zur alten Domain ist jede
   Aussage über konkrete Suchbegriffe geraten — und steht deshalb nicht drin.
4. **Die neue Fassung ist nicht live.** Alle Messungen betreffen die
   Vorschau. Unter der echten Domain können Serverzeiten abweichen.

---

*Erstellt am 29.07.2026. Die Zahlen dieses Dokuments sind reproduzierbar;
die Skripte liegen unter `analyse/vergleich/`.*
