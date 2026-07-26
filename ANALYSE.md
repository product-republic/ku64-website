# ku64.de – Analyse und Konzept des Neubaus

Stand: 26. Juli 2026

---

## 0. Zur Belastbarkeit dieser Analyse — bitte zuerst lesen

**ku64.de war aus dieser Arbeitsumgebung nicht abrufbar.** Jeder Zugriff – über den
Egress-Proxy der Session wie über den serverseitigen Abruf – endete mit `403 Forbidden`,
und zwar auf allen Pfaden, auch auf `/robots.txt` und `/sitemap.xml`. Ursache ist
entweder die Egress-Policy dieser Umgebung oder ein Bot-Schutz vor ku64.de.

Das hat eine konkrete Konsequenz, die ich nicht kaschieren möchte:

| Analysierbar | Nicht analysierbar |
|---|---|
| URL-Struktur, soweit indexiert | Ladezeiten, Core Web Vitals, Lighthouse-Werte |
| Title-Tags und Snippets aus dem Index | Bildgrößen, Render-Blocking, JavaScript-Ballast |
| Strukturelle Probleme der Informationsarchitektur | Defekte Links und Weiterleitungsketten |
| Erkennbare Inkonsistenzen zwischen Standorten | Verwaiste Seiten ohne interne Verlinkung |
| Was Suchmaschinen und KI-Suchen tatsächlich sehen | Duplicate Content im Detail, Canonical-Fehler |

Die Befunde in Abschnitt 1 sind **belegte Beobachtungen aus dem Suchindex**. Abschnitt 2
enthält die **Prüfliste, die nachzuholen ist**, sobald die Domain erreichbar ist. Ich habe
darauf verzichtet, die Lücke mit plausibel klingenden Vermutungen zu füllen — eine
erfundene Performance-Zahl wäre schlimmer als eine offene Stelle.

**Was Sie tun müssen, damit ich das nachholen kann:** ku64.de (plus `www.ku64.de`) in den
Environment-Einstellungen dieser Session für ausgehende Verbindungen freigeben. Danach
liefere ich die vollständige technische Analyse aller rund 360 Seiten nach.

---

## 1. Belegte Befunde

### 1.1 Der strukturelle Kernfehler: Leistungen ohne Ort

Das ist der Befund, der alles andere überlagert — und genau der, den Sie beschrieben
haben.

Die indexierten URLs zeigen zwei getrennte Welten:

```
/potsdam/                          ← Standorte existieren
/berlin-charlottenburg/
/wilmersdorf/

/leistungen/                       ← Leistungen existieren
/leistungen/kinderzahnarzt/           …aber ohne jeden Ortsbezug
/leistungen/prophylaxe-4-0/
/zahnbeschwerden/kreidezaehne/
```

**Es gibt keine Schnittmenge.** Keine indexierte URL der Form
`/potsdam/leistungen/<behandlung>/`.

Die Folgen im Alltag:

1. **Der Standortkontext geht beim ersten Klick verloren.** Wer über `/potsdam/` einsteigt
   und auf eine Behandlung klickt, landet auf einer ortlosen Seite. Genau das
   "unwillkürliche Wechseln", das Sie beschrieben haben — es ist kein Bedienfehler,
   sondern die zwangsläufige Folge der Struktur.

2. **Ortlose Seiten können lokal nicht ranken.** Eine Seite ohne Adresse, ohne
   Telefonnummer und ohne Öffnungszeiten hat bei "Zahnarzt Potsdam Implantat" strukturell
   keine Chance gegen eine Praxisseite, die diese Signale trägt. Jeder Standort außer dem
   Kurfürstendamm konkurriert derzeit faktisch nicht.

3. **KI-Suchen antworten falsch.** Ein Sprachmodell, das `/leistungen/kinderzahnarzt/`
   liest, findet dort keine Information darüber, an welchen Standorten
   Kinderzahnheilkunde angeboten wird. Auf die Frage "Gibt es bei KU64 in Potsdam einen
   Kinderzahnarzt?" muss es raten. Das ist heute der häufigere Erstkontakt als die klassische
   Suche.

4. **Vier Standorte kannibalisieren eine Seite.** Statt vier lokal starker Auftritte gibt
   es einen generischen — und drei Standorte, die davon fast nichts abbekommen.

### 1.2 Inkonsistente Standort-Slugs

Aus dem Index:

```
/berlin-charlottenburg/     ← mit Bindestrich, mit Stadtpräfix
/berlinmitte/kontakt/       ← ohne Bindestrich, mit Stadtpräfix
/wilmersdorf/               ← ohne Stadtpräfix
/potsdam/                   ← ohne Stadtpräfix
```

Vier Standorte, drei verschiedene Namensmuster. Das ist für sich genommen kein
Ranking-Killer, aber es zeigt, dass die Standorte nacheinander drangeklebt statt
gemeinsam geplant wurden — und es macht jede Automatisierung (Sitemaps, interne
Verlinkung, Analytics-Auswertung nach Standort) unnötig fehleranfällig.

### 1.3 Veraltete Angaben im Seitentitel

Der Title von `/standorte/` lautet im Index:

> **"KU64 Standorte – Zahnmedizin an drei besonderen Orten"**

Es sind **vier** Standorte. Die KiezPraxis in Wilmersdorf wurde laut Presseportal am
5. Januar 2026 eröffnet — die Standortübersicht kennt sie im Titel nicht.

Das ist der sichtbarste von vermutlich mehreren Fällen: Ein neuer Standort wurde angelegt,
aber die übergreifenden Seiten wurden nicht nachgezogen. Für Patientinnen und Patienten
ist das irritierend; für die Suchmaschine ist es ein Signal mangelnder Pflege.

### 1.4 Zwei Alt-URL-Systeme sind noch indexiert

```
https://ku64.de/ku64/willkommen-bei-ku64.html    ← altes Dateisystem-Schema
https://ku64.de/?id=215                          ← TYPO3-Parameter-URL
```

Beide liefern offenbar noch Inhalte aus und sind indexiert. Damit existiert dieselbe Seite
unter mehreren Adressen — klassischer Duplicate Content, der Linkkraft aufteilt statt
bündelt. `?id=215` deutet zusätzlich darauf hin, dass die Parameter-Variante nicht
konsequent per Canonical oder Weiterleitung neutralisiert wurde.

### 1.5 Indexierung über HTTP statt HTTPS

Das Suchergebnis für die Leistungsübersicht lautet:

```
http://ku64.de/leistungen/     ← nicht https
```

Entweder ist die HTTPS-Weiterleitung nicht lückenlos, oder der Index ist veraltet und
wird nicht aufgefrischt. Beides gehört überprüft.

### 1.6 Widersprüchliche Zahlen zum Behandlungsteam

Öffentlich auffindbar sind für den Kurfürstendamm **21** und **30** Zahnärztinnen und
Zahnärzte — je nach Quelle. Mindestens eine der Zahlen auf der Website ist damit veraltet.
Solche Zahlen sind Vertrauensanker; wenn sie sich widersprechen, schadet das mehr, als sie
nutzen.

### 1.7 Getrennte Doctolib-Einträge ohne erkennbare Führung

Für den Kurfürstendamm existieren mindestens zwei Doctolib-Praxen:

- `ku64-berlin` (Zahnmedizin)
- `ku64-kieferorthopaedie` (Kieferorthopädie)

Wer den falschen Kalender öffnet, findet keinen passenden Termin und bucht im
schlechtesten Fall bei der falschen Fachrichtung. Die Website muss hier führen, nicht die
Wahl dem Zufall überlassen.

---

---

## 1b. Befunde aus der Server-`.htaccess` (26.07., aus dem Backup)

Aus dem Server-Backup lag die `.htaccess` der Live-Website vor: 21,8 KB, davon
der größte Teil Yoast-Weiterleitungen. Damit sind die folgenden Punkte **keine
Vermutungen mehr, sondern belegt**. Auswertung:
[`analyse/altbestand/WEITERLEITUNGEN.md`](analyse/altbestand/WEITERLEITUNGEN.md)

### 1b.1 Die HTTP→HTTPS-Weiterleitung ist wirkungslos

Ganz oben im Weiterleitungsblock steht:

```apache
# redirect http to https
RewriteCond %{HTTPS} !=on
Redirect 301 (.*) https://%{HTTP_HOST}%{REQUEST_URI}
```

Diese drei Zeilen können nicht funktionieren, aus drei unabhängigen Gründen:

1. `RewriteCond` gehört zu mod_rewrite und wirkt ausschließlich auf eine
   nachfolgende `RewriteRule`. Auf ein `Redirect` (mod_alias) hat sie keinerlei
   Einfluss – die Bedingung läuft hier ins Leere.
2. `Redirect` erwartet als erstes Argument einen Pfad, der mit `/` beginnt,
   keinen regulären Ausdruck. `(.*)` wird als wörtlicher Pfad behandelt und
   trifft damit auf keine echte Anfrage zu. Für Muster wäre `RedirectMatch`
   nötig.
3. `%{HTTP_HOST}` und `%{REQUEST_URI}` sind mod_rewrite-Variablen. mod_alias
   ersetzt sie nicht, sondern würde sie wörtlich ausgeben.

**Das erklärt einen Befund aus Abschnitt 1.5:** Die Leistungsübersicht ist als
`http://ku64.de/leistungen/` indexiert. Wenn HTTPS überhaupt erzwungen wird,
dann durch die Serverkonfiguration des Hosters, nicht durch diese Datei.

> ⚠️ **Zu prüfen:** Ob HTTP-Aufrufe live tatsächlich auf HTTPS umgeleitet werden,
> lässt sich nur am laufenden Server feststellen. Der LiteSpeed-Host kann das
> unabhängig von dieser Datei erledigen. Die Direktive selbst leistet es nicht.

### 1b.2 168 aktive Weiterleitungen, davon 18 Ketten

Eine Kette bedeutet: Die Weiterleitung zeigt auf eine Adresse, die selbst
wieder weiterleitet. Jeder Sprung kostet Ladezeit und verwässert das
Linksignal.

Der schlimmste Fall braucht **vier Sprünge**:

```
/dros-schiene
  → /leistungen/kieferorthopaedie/dros-schiene
  → /potsdam/kieferorthopadie/dros-schiene
  → /potsdam/kieferorthopadie/cmd
  → /potsdam
```

Wer über die alte Adresse kommt, landet nach vier Umleitungen auf der
Potsdamer Startseite – nicht bei der gesuchten Schiene. Weitere 17 Ketten mit
zwei Sprüngen, darunter:

```
/schmerzfreie-zahnbehandlung-mit-dem-laser → /laserbehandlung
  → /leistungen/ganzheitliche-zahnmedizin/laserbehandlung

/potsdam/schonende-zahnbehandlung-mit-laser-… → /potsdam/laserbehandlung-potsdam
  → /potsdam/zahnbehandlung-laser
```

Immerhin: **keine Endlosschleifen.**

### 1b.3 Eine Weiterleitung führt garantiert ins Nichts

```apache
Redirect 301 "/leistungen/beauty-cosmetics/hautarzt" "/leistugen/beauty-cosmetics"
```

Das Ziel heißt `/leistugen/` statt `/leistungen/` – ein Tippfehler. Diese
Adresse existiert nicht. Wer den alten Link aufruft, bekommt einen 404 serviert,
und zwar seit dem Tag, an dem die Regel angelegt wurde.

### 1b.4 Drei auskommentierte Regeln

`/potsdam/team/wiebke-lange`, `/team/verwaltung/manuel-schuler` und
`/potsdam/kieferorthopadie` waren einmal weitergeleitet, sind es jetzt nicht
mehr. Ob sie ins Leere laufen, hängt davon ab, ob die Seiten noch existieren.

### 1b.5 Die echte URL-Struktur – und was sie über die Standorte verrät

Aus 168 Quell- und Zieladressen lässt sich der Aufbau rekonstruieren:

| Bereich | Nennungen | Anmerkung |
|---|---|---|
| `/team/` | 64 | Größter Bereich, tief verschachtelt nach Funktion |
| `/blog/` | 48 | Umfangreiches Archiv, stark zusammengefasst |
| `/potsdam/` | 36 | **Eigener Unterbaum mit eigenen Leistungsseiten** |
| `/leistungen/` | 14 | Der standortlose Zweig |
| `/berlinmitte/` | 11 | Eigener Unterbaum |
| `/zahnbeschwerden/` | 3 | Symptom-Einstieg |

**Das ist der wichtigste inhaltliche Fund.** Potsdam und Berlin-Mitte haben
sehr wohl eigene Unterseiten – `/potsdam/parodontitisbehandlung`,
`/potsdam/bleaching`, `/potsdam/zahnaesthetik`, `/potsdam/anaesthesie`,
`/potsdam/anamnese`, `/potsdam/zahnbehandlung-laser`. Der Kurfürstendamm hat
dagegen **keinen eigenen Präfix**: Seine Leistungen liegen unter `/leistungen/`
und belegen damit den standortlosen Hauptzweig.

Die Folge ist genau das, was Sie beschrieben haben, nur präziser als vermutet:
Es gibt nicht eine standortlose Struktur, sondern **zwei konkurrierende** – ein
gewachsener Potsdam- und Mitte-Zweig neben einem Kurfürstendamm-Zweig, der sich
als „die“ Leistungsstruktur ausgibt. Wer in Potsdam auf eine Leistung klickt,
die dort keinen eigenen Unterordner hat, landet zwangsläufig im
Kurfürstendamm-Zweig.

Der Neubau löst das, indem **alle vier** Standorte gleich behandelt werden.

### 1b.6 Technikstack der alten Website

WP Rocket 3.23 (Caching), Imagify (WebP), Wordfence (WAF), Yoast SEO,
LiteSpeed-Server. Auffällig: `ExpiresByType text/html "access plus 1 year"` –
HTML ein Jahr lang cachen ist für eine Praxis-Website mit wechselnden
Sprechzeiten riskant. WP Rocket setzt weiter oben korrekt `0 seconds`; welche
Regel gewinnt, hängt von der Reihenfolge ab und gehört geprüft.

---

## 2. Prüfliste für den Crawl

**Teilweise abgearbeitet (26.07.2026).** `analyse/altbestand/crawl.mjs` hat
erhoben, was für den Umzug der Adressen zählt – siehe Abschnitt 1c:

* ✅ Vollständige URL-Liste gegen die XML-Sitemap
* ✅ Weiterleitungsketten (315 Stück), alle 404 und 5xx (6 Stück)
* ✅ Canonical-Angaben und `noindex` je Seite
* ✅ Verwaiste Seiten – die zentrale Frage für die Weiterleitungsplanung
* ✅ Gewicht und Format aller Bilder (2023 Dateien, rund 570 eigenständige
  Motive)

**Offen bleibt alles, was eine Messung im Browser braucht.** Der Crawl liest
HTML; Core Web Vitals, Kontraste und Tastaturbedienbarkeit lassen sich so nicht
feststellen. Diese Punkte betreffen ohnehin die alte Website, die abgelöst
wird – sie sind Vergleichswerte, keine Aufgaben.

**Performance:** Core Web Vitals (LCP, INP, CLS) je Seitentyp und getrennt nach Mobil und
Desktop · Gewicht und Format aller Bilder, ungenutzte Dimensionen · Render-blockierendes
CSS und JavaScript · Drittanbieter-Skripte und ihr Anteil an der Ladezeit · Server-Antwortzeit
· Caching-Header · Schriftenauslieferung.

**Technisches SEO:** Vollständige URL-Liste gegen die XML-Sitemap · fehlende, doppelte und
zu lange Titles und Descriptions · H1-Hierarchie je Seite · Canonical-Ketten und
-Widersprüche · Weiterleitungsketten und -schleifen · alle 404 und 5xx · `noindex` an
Stellen, die indexiert gehören · hreflang zwischen der deutschen und der englischen Fassung
· Paginierung · strukturierte Daten und deren Fehler.

**Struktur:** Interne Verlinkung und Klicktiefe je Seite · **verwaiste Seiten** — die
zentrale Frage für die Weiterleitungsplanung · thematische Dubletten · Verhältnis
Standort- zu Leistungsseiten.

**Inhalt:** Duplicate und Thin Content · Lesbarkeit und Fachsprachlichkeit · Aktualität von
Preisen, Öffnungszeiten und Teamangaben · Konsistenz zwischen den Standorten · fehlende
Alt-Texte.

**Recht und Zugänglichkeit:** Cookie-Banner und tatsächliches Ladeverhalten von
Drittanbietern · Google Fonts extern eingebunden? · eingebettete Karten ohne Einwilligung? ·
Kontrastwerte · Tastaturbedienbarkeit · Formularbeschriftungen · HWG-Konformität der
Werbeaussagen.

---

## 3. Was gebaut wurde

### 3.1 Die Struktur, die das Kernproblem löst

```
/                                       Standortwahl, keine automatische Weiterleitung
/<standort>/                            Standort-Startseite
/<standort>/leistungen/                 nur was es hier gibt, mit Sofortsuche
/<standort>/leistungen/<behandlung>/    ← die eigentliche Reparatur
/<standort>/termine/                    Doctolib, standortrichtiger Kalender
/<standort>/anamnese/                   Nelly, an allen Standorten
/<standort>/anfahrt/  /team/  /praxis/  /kontakt/

/leistungen/<behandlung>/               Wegweiser: erklärt und führt zum Standort
/standorte/                             Vergleichstabelle: was gibt es wo
```

Der entscheidende Unterschied: **`/potsdam/leistungen/zahnimplantate/` trägt die Adresse,
die Telefonnummer, die Sprechzeiten und die Terminbuchung von Potsdam.** Kein
Kontextverlust, kein stiller Wechsel.

Die alten Adressen `/leistungen/<behandlung>/` bleiben bestehen — als Wegweiser, nicht als
Sackgasse. Damit brechen weder Suchergebnisse noch bestehende Verlinkungen von außen.

### 3.2 Umgang mit nicht verfügbaren Leistungen

Sie hatten das ausdrücklich verlangt: Gibt es eine Leistung an einem Standort nicht, soll
dorthin verlinkt werden, wo es sie gibt. Umgesetzt an drei Stellen:

1. **Leistungsübersicht des Standorts** — ein eigener Abschnitt "An anderen
   KU64-Standorten" listet, was hier fehlt, samt Zielstandort.
2. **Behandlungsseite** — verwandte Behandlungen, die es hier nicht gibt, erscheinen mit
   gestricheltem Rahmen und dem klaren Hinweis, wo sie angeboten werden.
3. **Standortvergleich** — eine Tabelle über alle Behandlungen × alle Standorte, jede
   verfügbare Kombination direkt verlinkt.

Der Ton dabei ist bewusst offen statt beschönigend: *"An diesem Standort nicht im Angebot —
wir behandeln das bei KU64 Kurfürstendamm."* Das verhindert den vergeblichen Anruf.

### 3.3 Kein automatischer Standortwechsel

Es gibt **keine** Geo-Weiterleitung und **keine** automatische Umleitung auf einen
gespeicherten Standort. Der zuletzt gewählte Standort wird angeboten — sichtbar, benannt,
mit einem Klick bestätigt. Eine automatische Weiterleitung würde genau das Problem
reproduzieren, das behoben werden sollte, nur in die andere Richtung.

Eine Standortleiste unter der Navigation zeigt durchgehend: *"Sie sehen KU64 Potsdam ·
Berliner Straße 139, 14467 Potsdam."*

### 3.4 Futter für Suchmaschinen und KI

**Strukturierte Daten** je Seitentyp: `Dentist` mit Adresse, Geokoordinaten,
Öffnungszeiten und vollständiger Leistungsliste · `MedicalProcedure` **mit Ortsbezug** —
die Behandlung ist über `provider` an den konkreten Standort gebunden · `FAQPage` aus
denselben Fragen, die auf der Seite sichtbar sind · `BreadcrumbList` · `MedicalOrganization`.

**`llms.txt` und `llms-full.txt`** werden beim Build aus derselben Datenquelle erzeugt wie
die Seiten und können daher nicht veralten. Sie machen explizit, was Fließtext nicht
transportiert:

```
- Zahnimplantate: Eine künstliche Zahnwurzel aus Titan …
  - Verfügbar an: Kurfürstendamm, Potsdam
  - NICHT verfügbar an: Berlin-Mitte, Wilmersdorf
  - Kosten: 1.800 bis 3.500 € pro Implantat inklusive Krone
  - Auch gesucht als: Implantat, künstliche Zahnwurzel, Titanimplantat …
```

Zusätzlich enthalten sie eine ausdrückliche Handlungsanweisung an das lesende Modell:
Verfügbarkeit vor jeder Empfehlung prüfen, Standort und Telefonnummer immer mitnennen,
keine Diagnosen, keine Erfolgszusagen.

**`robots.txt`** öffnet gezielt für GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot,
PerplexityBot, Google-Extended und Applebot-Extended. Wer diese Bots aussperrt, ist in
KI-Suchen nicht vorhanden. Gesperrt werden nur `/api/` und die alten Parameter-URLs.

**Inhaltlich** trägt jede Behandlung die Begriffe, die Menschen tatsächlich eingeben
(`synonyme`: "Loch im Zahn" führt zur Kariesbehandlung), die Frage, die sie tatsächlich
stellen (`patientenfrage`), einen eigenen Block zur Kassenfrage — dem häufigsten
Anrufgrund — und Fragen und Antworten in zitierfähiger Form.

### 3.5 Interaktive Elemente

Sofortsuche über alle Behandlungen inklusive Synonyme, mit Umlautnormalisierung ·
Vorher-Nachher-Schieberegler bei der Lächeln-Vorschau · Ablaufdarstellung als
Schritt-für-Schritt-Zeitleiste · Chat mit Wort-für-Wort-Antwort · Sprachberater mit
Zustandsvisualisierung · Verfügbarkeitsmatrix mit direkt anklickbaren Kombinationen ·
Öffnungsstatus, der sich im Browser aktualisiert statt den Build-Zeitpunkt einzufrieren ·
404-Seite, die aus der aufgerufenen Adresse Suchtreffer ableitet, statt in einer
Sackgasse zu enden.

Einblendeffekte laufen über CSS-`animation-timeline` — deklarativ, ohne
JavaScript-Beobachter, und bei `prefers-reduced-motion` vollständig abgeschaltet.

### 3.6 Die vier digitalen Funktionen

**KI-Chatbot.** Serverseitig, Streaming, Wissensbasis aus derselben Datenquelle wie die
Seiten — er kann daher keine Preise oder Leistungen erfinden, die es nicht gibt. Kennt den
Standort der aktuellen Seite. Angewiesen auf: keine Diagnose, keine Erfindungen, keine
Erfolgszusagen, keine Abfrage von Gesundheitsdaten, bei Notfallzeichen sofortiger Verweis
auf Telefon beziehungsweise 112. Verlinkt nur interne Pfade — die Ausgabe wird escapt und
nur ausgewählte Markdown-Muster werden zugelassen, damit Modellausgabe kein
Einfallstor wird.

**Lächeln-Vorschau (Nano Banana Pro).** Upload, Analyse, Bildgenerierung, Versand per
E-Mail, dazu Anzeige im Browser mit Vorher-Nachher-Regler. Der Bildprompt beschränkt die
Änderung ausdrücklich auf die Zähne — Gesichtszüge, Hautbild und Identität bleiben
unangetastet, weil alles andere unehrlich wäre.

**Doctolib.** Wird **nicht** automatisch eingebettet, sondern erst nach ausdrücklichem
Klick geladen (§ 25 TDDDG). Wer nicht zustimmt, bekommt Telefonnummer und Sprechzeiten —
keine Sackgasse. Standorte mit mehreren Kalendern (Kurfürstendamm: Zahnmedizin und
Kieferorthopädie) bieten die Wahl explizit an.

**Nelly-Anamnese.** An allen vier Standorten verlinkt, nicht nur in Potsdam. Die
Formular-URL kommt je Standort aus einer Umgebungsvariablen; fehlt sie, zeigt die Seite
eine ehrliche Zwischenlösung mit Telefonnummer statt eines toten Links.

**ElevenLabs-Sprachberater.** Über signierte URL — der API-Key bleibt auf dem Server. Das
ist der in Ihrer Anna-Dokumentation als "B2" beschriebene Weg; die dort für den Testbetrieb
genutzte Variante mit offenem Public Agent wäre für eine Praxis nicht tragbar, weil ein
öffentlicher Agent auf Praxiskosten liefe. Mikrofon erst nach ausdrücklicher Freigabe,
sauberes Auflegen beim Verlassen der Seite, damit keine Sprachminuten weiterlaufen.

### 3.7 Technische Kennzahlen

| | Wert |
|---|---|
| Statisch erzeugte Seiten | 193 |
| JavaScript auf einer Inhaltsseite | ~2,5 KB |
| Externe Anfragen beim Seitenaufruf | 0 |
| Cookies ohne Einwilligung | 0 |
| Schriften | self-hosted, kein Google-Fonts-Aufruf |
| Bilder | AVIF/WebP zur Buildzeit |
| Dark Mode, Reduced Motion, Druckansicht | umgesetzt |

Null externe Anfragen ist der Grund, warum kein Cookie-Banner nötig ist — und
gleichzeitig ein erheblicher Performance-Vorteil.

---

## 4. Offene Punkte

### 4.1 Daten, die nur die Praxis liefern kann

Diese Angaben stammen aus öffentlichen Verzeichnissen, weil ku64.de nicht erreichbar war.
**Sie müssen vor dem Live-Gang bestätigt werden** — falsche Angaben schicken Patientinnen
und Patienten an den falschen Ort oder zur falschen Zeit.

| Punkt | Status |
|---|---|
| Telefonnummern aller vier Standorte | aus Verzeichnissen, zu bestätigen |
| Öffnungszeiten, besonders Mitte und Wilmersdorf | unsicher, im Code markiert |
| **Leistungsverfügbarkeit je Standort** | **begründete Annahme, unbedingt prüfen** |
| Preisspannen und Kassenangaben | plausibel, zahnärztlich freizugeben |
| Team: Namen, Funktionen, Fotos | bewusst leer gelassen — nicht erfindbar |
| Praxisfotos | fehlen vollständig |
| Doctolib-Slugs je Standort | aus Suchergebnissen, zu bestätigen |
| Nelly-Formular-URLs | offen, als Env-Variable vorbereitet |

Die Leistungsverfügbarkeit ist der kritischste Punkt: Die gesamte Cross-Linking-Logik
hängt daran. Sie steht an einer Stelle (`src/data/leistungen.ts`, Feld `verfuegbar`) und
ist in Minuten korrigiert.

**Das Team ist absichtlich leer.** Namen und Qualifikationen realer Personen zu erfinden,
wäre nicht nur wertlos, sondern schädlich. Die Seite rendert sie automatisch, sobald sie
eingetragen sind, und ist bis dahin ehrlich statt leer wirkend.

### 4.2 Rechtliche Freigaben

- **Impressum und Datenschutz sind Entwürfe.** Der technische Teil der
  Datenschutzerklärung beschreibt exakt das tatsächliche Verhalten der Website — geprüft
  am Code, nicht aus einem Generator. Die Praxisangaben sind als `[…]` markiert.
  Anwaltliche Prüfung vor Live-Gang.
- **HWG.** Alle Behandlungstexte brauchen zahnärztliche Freigabe. Besonders die
  Lächeln-Vorschau: § 11 HWG schränkt Vorher-Nachher-Darstellungen ein. Die Ausgabe ist
  deshalb an drei Stellen als unverbindliche Illustration gekennzeichnet — ob das
  ausreicht, muss juristisch bewertet werden.
- **Art. 9 DSGVO.** Ein Gesichtsfoto ist ein biometrisches Datum. Die Einwilligung ist
  zweistufig eingeholt, es wird nichts gespeichert. Nötig sind noch:
  Auftragsverarbeitungsvertrag mit Google, Eintrag im Verarbeitungsverzeichnis.
- **Auftragsverarbeitungsverträge** mit Anthropic, Google, ElevenLabs, Doctolib und Nelly.

### 4.3 Weiterleitungen

Sie wollten möglichst keine Weiterleitungen und keine verwaisten Seiten. Der Neubau
erhält die bekannten Muster (`/potsdam/`, `/leistungen/<x>/`) bewusst. **Die vollständige
Weiterleitungsliste kann ich erst nach dem Crawl erstellen** — dafür brauche ich die echte
URL-Liste. Bekannt ist bereits: Die Alt-URLs `/ku64/*.html` und `/?id=*` brauchen
dauerhafte Weiterleitungen auf ihre Nachfolger.

---

## 5. Vorschlag für das weitere Vorgehen

1. **ku64.de freigeben** → ich liefere die vollständige technische Analyse aller Seiten
   und die Weiterleitungsliste nach.
2. **Offene Daten bestätigen** (Abschnitt 4.1), vor allem die Leistungsverfügbarkeit je
   Standort.
3. **Potsdam inhaltlich finalisieren**, zahnärztlich freigeben, als Referenz vorführen.
4. **API-Schlüssel setzen** — Chatbot, Lächeln-Vorschau und Sprachberater sind fertig
   verdrahtet und laufen bis dahin im gekennzeichneten Demo-Modus.
5. **Auf die übrigen drei Standorte ausrollen** — die Struktur trägt sie bereits, es fehlt
   der standortspezifische Text.
6. **Rechtliche Prüfung**, dann Live-Gang mit den Weiterleitungen aus Schritt 1.

---

## Anhang: Quellen der Befunde

Die Befunde in Abschnitt 1 stammen aus dem öffentlichen Suchindex, da ein direkter Abruf
nicht möglich war:

- Standortübersicht mit dem Titel "drei besondere Orte": <https://ku64.de/standorte/>
- Indexierte Alt-URLs: <https://ku64.de/ku64/willkommen-bei-ku64.html>, `https://ku64.de/?id=215`
- Leistungsstruktur ohne Ortsbezug: <https://ku64.de/leistungen/>,
  <https://ku64.de/leistungen/kinderzahnarzt/>, <https://ku64.de/leistungen/prophylaxe-4-0/>
- Slug-Inkonsistenz: <https://ku64.de/berlin-charlottenburg/> gegenüber
  <https://ku64.de/berlinmitte/kontakt/>
- Getrennte Doctolib-Einträge: <https://www.doctolib.de/zahnarztpraxis/berlin/ku64-berlin>,
  <https://www.doctolib.de/zahnarztpraxis/berlin/ku64-kieferorthopaedie>
- Eröffnung der KiezPraxis am 5. Januar 2026: <https://www.presseportal.de/pm/181398/6204848>
- Kontaktdaten Potsdam: <https://www.doctolib.de/zahnarztpraxis/potsdam/ku64-die-zahnspezialisten>
- Kontaktdaten Berlin-Mitte: <https://www.doctolib.de/zahnarztpraxis/berlin/ku64-berlin-hausvogteiplatz>

## 1c. URL-Bestand: erledigt, und dabei größer als gedacht

**Stand 26.07.2026, nach dem Crawl:** 546 Adressen im Bestand, davon 0 tot.
20 bleiben unter derselben Adresse, 526 werden weitergeleitet. Geprüft mit
`npm run urls:abgleichen`, das im Build mitläuft.

### Der Crawl hat die Zahl erst verdoppelt

Vorher war der Bestand mit 238 Adressen bekannt – alles, was in der alten
`.htaccess` als Quelle oder Ziel steht. Davon liefen 216 ins Leere.

`analyse/altbestand/crawl.mjs` hat ku64.de vollständig erhoben: Yoast-Sitemaps
plus Linkcrawl ab der Startseite, 662 geprüfte Adressen.

| | Anzahl |
|---|---:|
| Live ausgeliefert (200) | 341 |
| Weitergeleitet (3xx) | 315 |
| Schon heute Fehlerseite | 6 |

Der wahre Bestand lag damit bei 552 statt 238 – die Zahl der toten Adressen
stieg zunächst von 216 auf 517. Das war keine Verschlechterung, sondern das
Ende des Ratens.

Was der Crawl außerdem sichtbar gemacht hat und die `.htaccess` nicht wusste:

* **31 Beschwerdeseiten** unter `/zahnbeschwerden/` – von „Zahnfleischbluten"
  bis „Zahn locker". Genau die Seiten, die OFFEN.md als „die wertvollsten
  fehlenden Seiten" führt, gab es also längst. Sie sind jetzt auf die
  nächstliegende Behandlung weitergeleitet; als eigene Seiten fehlen sie
  weiterhin.
* **54 englische Seiten** mit eigenen englischen Slugs
  (`/en/services/oral-surgery-mkg-surgery/`). Die neue Website übersetzt Texte,
  nicht Adressen – eine Entscheidung, die zwei Adressbestände je Sprache
  vermeidet.
* **102 Teamseiten** live, mit den Namen in den Seitentiteln. Damit ist die
  Schreibweisenfrage aus OFFEN.md beantwortbar: Zeynep Çınar, Jessica
  Oberländer, Sabine Kühnau-Falkenau stehen so auf den eigenen Seiten der
  Praxis. Auch die Gegenprobe stimmt – `/team/verwaltung/jana-jain/` ist auf
  ku64.de heute eine Fehlerseite.
* **Sechs Adressen laufen schon auf ku64.de ins Leere.** Sie fallen aus dem
  Bestand: Ihre Platzierung ist längst weg, eine Weiterleitung bringt niemanden
  zurück.

### Woran es lag

Vier strukturelle Abweichungen, keine Einzelfälle:

| Bereich | Alt | Neu |
|---|---|---|
| Behandlungen je Standort | `/potsdam/parodontitisbehandlung/` | `/potsdam/leistungen/parodontitis-behandlung/` |
| Behandlungen allgemein | `/leistungen/kieferorthopaedie/incognito/` | `/leistungen/aligner/` |
| Team | `/team/zahnaerzte/<person>/` | existiert nicht |
| Blog & Fachbeiträge | `/blog/<beitrag>/` | existiert nicht |

Der alte Standortpfad war **flach**: In Potsdam lag die Behandlung direkt unter
`/potsdam/<behandlung>/`, ohne Zwischenstufe. Und die alten Slugs weichen ab –
`parodontitisbehandlung` gegen `parodontitis-behandlung`, `anaesthesie`,
`laserbehandlung-potsdam`. Eine Regel löst das nicht auf.

### Wie es gelöst ist

Die Zuordnung steht bei dem, was sie beschreibt:

* **152 alte Adressen** als Feld `alteAdressen` an ihrer Behandlung in
  `src/data/leistungen.ts`. Wer eine Behandlung umbenennt, sieht ihre alten
  Adressen daneben.
* **Personenseiten** an ihrer Person in `src/data/team.ts`.
* Alles Übrige in `src/data/weiterleitungen.ts`, nach Bereich sortiert.

`src/data/weiterleitungen.ts` rechnet daraus die Tabelle. Standortpräfixe
bleiben erhalten: Wer in Potsdam nach Parodontitis gesucht hat, landet in
Potsdam und nicht am Kurfürstendamm. `astro.config.mjs` liest dieselbe Datei –
eine Quelle für Server und Wächter.

Rangfolge der Ziele: dieselbe Adresse, sonst die inhaltlich gleiche Seite,
sonst die Übersicht mit Sprungziel. **Die Startseite kommt als Ziel nicht vor.**
Wer aus der Suche nach „Zahnfleischbluten" auf einer Startseite landet, geht
zurück.

Der Node-Adapter antwortet mit 308 statt 301. Beides sind dauerhafte
Weiterleitungen und für Suchmaschinen gleichwertig.

### Was der Wächter zusätzlich prüft

Zwei Fehler, die man ohne Prüfung nicht bemerkt:

* Eine Weiterleitung, deren **Ziel es nicht gibt**. Für jemanden aus der Suche
  ist das schlechter als keine Weiterleitung – erst ein zweiter Seitenaufbau,
  dann die Fehlerseite.
* Eine Weiterleitung, die eine **vorhandene Seite verdeckt**. Die Seite wird
  gebaut und niemand sieht sie je.

`npm run urls:abgleichen` bricht bei beidem ab und läuft im Build mit.
