# Was offen ist

Stand 1. August 2026, nachts. Diese Datei ist die Übergabe zwischen Sitzungen –
sie gehört ins Repository und nicht in einen Prompt, weil ein Prompt verloren
geht und das Repository bleibt.

**Die Zahlen hier sind nachgemessen, nicht fortgeschrieben.** Sie standen vier
Tage lang auf dem Stand vom 27. Juli, während die Website auf 1.554 Seiten
gewachsen war – 1.086 stand noch in der Tabelle. Wer eine Zahl aus dieser Datei
in einen Kundenbericht übernimmt, übernimmt sie also aus einer Quelle, die
altert. Vor dem Weitergeben gehört jede Zahl einmal neu erhoben; wie, steht
jeweils daneben.

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

| | | woher die Zahl kommt |
|---|---|---|
| Seiten gebaut | 1.554 (257 davon in der Sitemap – EN und FR tragen noch `noindex`) | `find dist/client -name index.html \| wc -l`, `sitemap-*.xml` |
| Behandlungen | 43, an 4 Standorten, mit standortgenauer Verfügbarkeit | `npm run daten:pruefen` |
| Beschwerdeseiten | 31 unter `/zahnbeschwerden/` | `npm run daten:pruefen` |
| Team | 139 Einträge, 99 veröffentlicht (76 Ku'damm, 14 Potsdam, 10 Mitte, 0 Wilmersdorf) | `npm run daten:pruefen` |
| Blog | vollständig übernommen, mit Lesefortschritt | – |
| Tote Adressen des Altbestands | 0 von 552 | `npm run urls:abgleichen` |
| Übersetzbare Textbausteine | 7.645 – Oberfläche, Behandlungen, Standorte, Profile, Blog, Beschwerden | `npm run sprachen:pruefen` |
| Katalog EN / FR | je 100,0 % – 0 fehlend, 0 veraltet | `npm run sprachen:pruefen` |
| Automatische Prüfungen | 26 – 13 in der Baukette, 13 auf Abruf | `ls scripts/*-pruefen.mjs` |
| Echte Fotos | 0 von 24 angemeldeten Motiven | `BILDER-BEDARF.md` |
| Indexierbar auf Deutsch | 504 von 519 – die 15 Ausnahmen sind gewollt | Auszählung der `noindex`-Angaben im Bau |
| Indexierbar auf EN / FR | 0 von je 518 – Sperre fällt mit der Freigabe | dieselbe Auszählung |

**Ein voller Katalog heißt nicht: fertig übersetzt.** Der Wächter meldet
zusätzlich „Restdeutsch in 518 gebauten Seiten" je Sprache. Das sind Stellen,
die gar nicht durch den Katalog laufen – siehe Punkt 10.

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

43 Behandlungen, davon sind die aus dem Altbestand übernommenen bereits
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

**Vereinbart am 1. August:** Die deutschen Texte sind zu 100 Prozent
freigegeben. Die Übersetzung folgt am Ende in einem Zug, nicht stückweise.

#### 5a. Fällt das `noindex` vor dem Livegang bei allen Seiten?

Gemessen am Bau vom 1. August, getrennt nach Sprache:

| Sprache | gebaut | davon `noindex` | indexierbar |
|---|---|---|---|
| Deutsch | 519 | 15 | **504** |
| Englisch | 518 | 518 | 0 |
| Französisch | 518 | 518 | 0 |

**Deutsch: schon jetzt ja.** Die 15 Ausnahmen sind gewollt und bleiben:

| Seite | warum gesperrt |
|---|---|
| `/404.html` | Fehlerseite |
| `/link-tree/` und die vier örtlichen | Verweisliste für Social Media, kein eigener Inhalt |
| `/<ort>/leistungen/` × 4 | örtliche Übersicht ohne eigenen Text; die Hauptübersicht trägt ihn |
| `/<ort>/blog/` × 4 | dieselbe Begründung |
| `/wilmersdorf/team/` | solange dort keine Person hinterlegt ist |

Kein Behandlungstext, kein Personenprofil, kein Blogbeitrag und keine
Standortseite steht auf `noindex`.

**EN und FR: nicht vor der Freigabe, und das ist der Sinn der Sperre.** Der
Katalog steht auf 100,0 Prozent, aber übersetzt ist damit die Oberfläche; der
Fließtext der 518 Seiten je Sprache ist noch deutsch (Punkt 10). Eine
englische Adresse mit deutschem Text im Index ist schlechter als gar keine.
Der Schalter ist `freigegeben: true` in `src/i18n/sprachen.ts` – eine Zeile,
kein Umbau.

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

### 7. Rechtsangaben – erledigt, die Begründung bleibt wichtig

**Dieser Punkt ist geschlossen.** `npm run recht:pruefen` meldet: 25 Angaben
belegt, 5 nicht einschlägig, **0 offen**, geprüft auf 6 gebauten Seiten. Er
steht hier weiter, weil die Begründung gebraucht wird, sobald jemand fragt,
warum Register und Versicherung im Impressum fehlen.

„Nicht einschlägig" heißt nicht „weggelassen", sondern steht mit Fundstelle in
`src/data/traeger.ts`:

| Feld | Warum es nicht dastehen muss |
|---|---|
| `registergericht`, `registernummer` | kein Registereintrag nach § 5 Abs. 1 Nr. 4 DDG |
| `ustId` | zahnärztliche Heilbehandlung ist nach § 4 Nr. 14 Buchst. a UStG steuerfrei |
| `versicherer`, `versicherungGeltungsbereich` | § 2 Abs. 1 Nr. 11 DL-InfoV greift nicht – Art. 2 Abs. 2 Buchst. f der Richtlinie 2006/123/EG nimmt Gesundheitsdienstleistungen aus |

Offen ist davon nur noch die **Rechtsform**, und sie ist keine Rechtsfrage,
sondern eine Auskunft: Die heutige Seite sagt „ist ein MVZ" – das ist eine
Versorgungsform, keine Rechtsform.

Was hier ursprünglich stand:

| Feld | Was gebraucht wird |
|---|---|
| `rechtsform` | Rechtsform der Gesellschaft. Die heutige Seite sagt „ist ein MVZ" – das ist eine Versorgungsform, keine Rechtsform. |
| `registergericht` | Registergericht |
| `registernummer` | Registernummer |
| `ustId` | USt-IdNr. nach § 27a UStG **oder** die Bestätigung, dass keine besteht. Zahnärztliche Heilbehandlung ist nach § 4 Nr. 14 UStG steuerfrei – „haben wir nicht" ist eine gültige Antwort. |
| `versicherer` | Berufshaftpflicht: Name und Anschrift |
| `versicherungGeltungsbereich` | räumlicher Geltungsbereich der Versicherung |

**Wichtig zur Einordnung:** Diese sechs Angaben stehen nicht auf ku64.de.
Nicht unvollständig, sondern gar nicht – das heutige Impressum nennt weder
einen Registereintrag noch eine Versicherung. Sie konnten deshalb nicht
übernommen werden, und der Neubau erbt hier keine Lücke, er macht eine
sichtbar.

§ 5 DDG verlangt Register und Umsatzsteuer-Identnummer, soweit vorhanden;
§ 2 DL-InfoV verlangt bei Dienstleistungen die Berufshaftpflicht mit
räumlichem Geltungsbereich. „Soweit vorhanden" heißt: Gibt es sie, müssen
sie dastehen. Gibt es sie nicht, ist die richtige Antwort ein ausdrückliches
„besteht nicht" – nicht das Weglassen.

Eine siebte Frage hängt daran und ist keine Angabe, sondern eine
Entscheidung: Die heutige Seite nennt für alles die Zahnärztekammer Berlin
und die KZV Berlin. Für Potsdam gilt Brandenburger Landesrecht. Ob es dafür
einen eigenen Impressumsblock braucht, hängt daran, ob Potsdam derselbe
Rechtsträger ist.

Alles Übrige ist belegt und trägt in `src/data/traeger.ts` seine Herkunft:
28 von 35 Platzhaltern kamen aus ku64.de/impressum und
/datenschutzerklaerung, dazu die Aufsichtsbehörde aus dem öffentlichen
Register, die Aufbewahrungsfrist aus § 630f Abs. 3 BGB und die
Speicherdauer der Serverprotokolle aus dem eigenen Code.

---

### 8. Noch nicht gebaut

- **Preisseite** – siehe Punkt 4, blockiert durch die Quellenfrage.
- **Newsletter-Panel** mit Auswahl der Interessen und Double-Opt-in.
- **Standort-Dashboard** für die Standortleitungen: Mitarbeitende anlegen und
  löschen, Foto hochladen. Es muss nur `team.ts` pflegen – alles andere
  rechnet sich daraus.

---

### 9. Zwei Strichpunkte auf `/ueber-uns/` ohne Ziel

Unter „Unsere Leistungen" stehen 19 Themen. 17 davon sind wieder verlinkt –
die Zuordnung steht namentlich in `scripts/langtexte-bauen.mjs` und wird von
`npm run verweise:pruefen` gegen die gebauten Seiten gehalten.

Zwei bleiben Text, und zwar absichtlich:

| Strichpunkt | Text im Altbestand |
|---|---|
| Allgemeine Zahnheilkunde | **0 Wörter eigener Text** – keine Seite auf ku64.de trägt das Thema. Der Begriff steht dort als Nebensatz auf der Startseite, in zwei Behandlerprofilen, in Stellenanzeigen und auf `/ueber-uns/` selbst. |
| Exklusiv in Berlin: Brite Veneers | **0 Wörter eigener Text** – keine Seite auf ku64.de trägt das Thema. Drei Erwähnungen als Nebensatz: auf der Startseite (Absatz zum Dentallabor), in `/blog/ku64-in-den-medien/` und auf `/ueber-uns/` selbst. |

Ein Link auf `/leistungen/` bzw. `/leistungen/veneers/` wäre möglich und
wurde bewusst nicht gesetzt: Er würde behaupten, dort stehe das Thema. Zur
Allgemeinen Zahnheilkunde steht dort eine Liste aller Behandlungen, und die
Veneers-Seite handelt von Veneers, nicht vom Markenprodukt Brite Veneers.

Zu entscheiden hat das die Praxis, und es sind zwei getrennte Fragen:

1. Soll es die Seiten geben? Dann braucht es Text von der Praxis – neu
   geschrieben, denn wiederherzustellen gibt es nichts.
2. Oder sollen die beiden Punkte auf das jeweils nächstliegende Ziel zeigen,
   obwohl es das Thema nur streift? Dann genügt ein Eintrag in der Tabelle
   `VERWEISE` in `scripts/langtexte-bauen.mjs`.

---

### 10. Restdeutsch: 518 Seiten je Sprache, die am Katalog vorbeilaufen

Der Katalog steht auf 100,0 Prozent, und trotzdem ist auf 518 englischen und
518 französischen Seiten deutscher Text zu sehen. Kein Widerspruch: Der
Katalog zählt Schlüssel, und diese Stellen haben keinen.

**Die Öffnungszeiten sind seit dem 1. August erledigt** – der größte Einzelposten
dieser Liste. 2.682 Treffer je Sprache stehen jetzt auf null, und
`sprachen:pruefen` hat dafür eine neue Ebene 3b bekommen, die deutsche
Wortmarken in Tabellenzellen sucht. Was die Marker der Ebene 3 prinzipiell
nicht finden können, findet jetzt sie. Die Tabelle unten ist der Stand
VORHER und bleibt als Beleg stehen:

| Stelle | EN-Seiten | FR-Seiten | Herkunft |
|---|---|---|---|
| Wochentagskürzel `Mo Di Mi Do Fr Sa So` | 355 | 355 | `z.tag` wird roh gerendert – ein Datenschlüssel, kein Text |
| `nach Vereinbarung` | 138 | 138 | `zeitLesbar()` in `src/data/standorte.ts` |
| `geschlossen` | 93 | 93 | `zeitLesbar()` ebenda |
| `Tage/Woche` samt Zusatz | 11 | 11 | `oeffnungstageText()`, `oeffnungsZusatz()`, `oeffnungstageTeile()` |

**Auf Französisch war das nicht nur unübersetzt, sondern falsch lesbar.** `Di`
heißt dort *dimanche*, also Sonntag. In unserer Tabelle stand es für Dienstag.
Eine französische Besucherin las die Dienstagszeile als Sonntag und wäre an
einem Tag gekommen, an dem geschlossen ist.

Was bleibt, ist Fließtext, der nie durch den Katalog lief – Aufgabe 45, die
vollständige Übersetzung. Die Zahl 518 bewegt sich dadurch nicht, weil sie an
Funktionswörtern hängt und nicht an den Zeitangaben.

Der Zusatz `Sa + So nach Vereinbarung` darf dabei **nicht** als Zeichenkette
übersetzt werden. Er gehört aus den Tagen abgeleitet, an denen
`nachVereinbarung` gilt – sonst laufen Daten und Übersetzung auseinander,
sobald sich eine Öffnungszeit ändert, und niemand merkt es.

Nachzählen lässt sich der Stand jederzeit:

```bash
cd dist/client && grep -rl "nach Vereinbarung" --include=index.html en fr | wc -l
```

### 11. Zwei Ebenen lagen über Bedienelementen — ERLEDIGT (1. August)

Beide behoben. 18 Messzellen, vorher bis 100 Prozent verdeckt, nachher 18 von
18 auf „Knopf". Der Befund bleibt hier stehen, weil die Ursache lehrreich ist:

- **Das Einwilligungsband** (`#einwilligung`) ist 210,5 px hoch bei 402 und
  360 px Breite und 264,1 px bei 320 px. Steht ein Bedienelement gerade am
  unteren Bildrand, verdeckt es das Band vollständig: Für die
  Zustimmen-Schaltfläche der Einbettungen sind das 100 Prozent auf `/`,
  `/berlin-charlottenburg/`, `/berlinmitte/` und `/leistungen/zahnarztangst/`.
  `elementFromPoint` liefert dort `DIV.ew-band` statt des Knopfes.
  Weiterscrollen behebt es – aber nur, wenn man auf die Idee kommt.
  Die Korrektur gehört in `Einwilligung.astro` bzw. `Basis.astro`: Solange
  das Band offen ist, unten Platz freihalten.
- **Die Chat-Blase** (`.berater`) misst 370 × 56 px bei 402 px Breite und
  liegt an anderen Bildlaufständen zu 61 bis 99 Prozent über derselben
  Schaltfläche. Korrektur in `Berater.astro`.

### 12. Über-uns stand auf Standortseiten in keinem Menü — ERLEDIGT (1. August)

Gemessen am gebauten Stand: Auf einer Standortseite führen die Menüpunkte nach
Leistungen, Praxis, Team, Anfahrt und Kontakt. `/ueber-uns/` ist von dort **nur
über die Fußzeile** erreichbar, `/blog/` gar nicht. In der Fußzeile stehen
5 der 10 Themen; Best Practice, Mitgliedschaften, Hilfsprojekt Südafrika,
Soziales Engagement und Ultraschallreiniger stehen in keinem Menü und in keiner
Fußzeile.

Das sind 16.176 Wörter, die eigens aus dem Altbestand zurückgeholt wurden – und
genau die Sorte Unsichtbarkeit, die dem Altbestand vorgeworfen wird.

**Behoben.** Jedes der zehn Themen steht jetzt auf 518 von 519 deutschen Seiten
(die 519. ist `404.html` und hat kein Menü). Am Schreibtisch als Aufklappfeld
neben „Leistungen", auf dem Telefon als Klappe im Menü – dort auf jedem
Seitentyp. Dazu eine Blog-Zeile; `/blog/` hatte auf 350 der 519 Seiten keinen
Verweis. Zwei Altfehler fielen dabei mit: das Mobilmenü ragte auf EN und FR
52,4 px unter die Fensterkante, und die Kopfnavigation brach dort zwischen
1.184 und 1.202 px zweizeilig um.

### 13. Wer macht was? Eine Behandlerliste von 43

**Gemessen:** Von 43 Behandlungen hat genau **eine** eine hinterlegte
Behandlerliste (Dentosophie). Von 120 örtlichen Behandlungsseiten können
deshalb **zwei** sagen, wer die Behandlung dort durchführt.

Das ist der Grund, warum Punkt 3 der Liste „Noch nicht gebaut" nicht
weiterkommt: Die örtlichen Behandlungsseiten brauchen 350 eigene Wörter, um
für sich zu stehen, und liegen bei 140. Der erste der fünf Punkte, die das
lösen würden, steht in `src/data/standortfassungen.ts` an erster Stelle –
zwei bis drei namentliche Behandelnde je Behandlung und Standort. Ohne ihn
ist die Schwelle aus Daten nicht erreichbar.

**Es wurde ausdrücklich kein Text erzeugt, der die Schwelle umgeht.** Sie
steht genau dafür da, dass keine dünnen Standortfassungen entstehen. Sie zu
umschreiben wäre der Fehler, den die Datei beschreibt – nur unsichtbar.

Die Bestellung steht als Teil E in `FREIGABEN.md`: 43 Zeilen, je Behandlung
zwei bis drei Namen aus den 99 veröffentlichten Personen. Standort und Profil
rechnet die Website selbst dazu.

### 14. Railway deployt aus einer anderen Branch

**Gefunden am 1. August, nachts.** Der Dienst `web` im Railway-Projekt
`ku64-website` hängt an der Branch `claude/ku64-website-analysis-redesign-9hwmcb`.
Gearbeitet wird auf `claude/ku64-website-analysis-redesign-qp6hz8`.

Letzter Deploy: Commit `bffd4eb`, 19:05 UTC. Alles danach ist gepusht, aber
nicht online.

Geprüft: Die Deploy-Branch ist ein **reiner Vorfahr** der Arbeitsbranch –
`git merge-base --is-ancestor` bestätigt es, und `git log deploy..arbeit`
zeigt nur Commits in eine Richtung. Ein Umstellen verliert also nichts.

Zwei Wege, beide brauchen eine Entscheidung:

1. In Railway die Quell-Branch des Dienstes umstellen. Eine Einstellung,
   jederzeit umkehrbar. Das MCP-Werkzeug `update-service` kann Quellen
   ausdrücklich nicht ändern – also von Hand in der Oberfläche.
2. Die Arbeitsbranch in die Deploy-Branch mergen.

Solange keins von beidem passiert, zeigt
https://web-production-4452b1.up.railway.app den Stand von 19:05 Uhr.

### 15. Vier SEO-Befunde aus der Durchsicht vor dem Livegang — ERLEDIGT (1. August)

Alle vier lagen in **unserer** Arbeit, nicht im Altbestand. Sie stehen hier,
weil die Ursache in jedem Fall dieselbe Form hat: eine Stelle, die einmal
richtig war und danach niemand mehr nachgelesen hat.

| Befund | vorher | jetzt | Ursache |
|---|---|---|---|
| Weiterleitungen auf Personen | 126 Altadressen auf `/team/`, 82 auf ein Profil | **88 / 120** | Die Regel in `analyse/altbestand/weiterleitungen-planen.mjs` trug den Kommentar „Genauer geht es nicht, weil es keine Personenseiten mehr gibt". Seit Aufgabe 13 gibt es sie wieder |
| `robots.txt` | 8 KI-Crawler-Gruppen ohne die Sperren der Hauptgruppe | **9 Gruppen, dieselben Sperren** | Ein Crawler wertet nur seine eigene Gruppe aus und erbt nichts von `User-agent: *`. Die Sperren stehen jetzt in einer Konstante |
| Adressen ohne Schrägstrich | `/ahmet-turan` → 404 | **301 auf die Fassung mit Schrägstrich** | `trailingSlash: 'always'` heißt: ohne Schrägstrich gibt es keine Route. Die Normalisierung sitzt jetzt in `server/index.mjs` |
| Darstellung im Suchergebnis | 504 von 518 Seiten ohne `robots`-Angabe | **504 Seiten mit `max-image-preview:large`** | Ohne die Angabe zeigt Google nur ein Vorschaubild in Briefmarkengröße – bei einer Zahnarztpraxis mit Vorher-nachher-Bildern ein spürbarer Unterschied |

Nachgemessen am Bau vom 1. August: 458 von 458 Weiterleitungen antworten mit
301 auf das erwartete Ziel, 234 von 234 Zielen antworten mit 200.

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
| `SITEMAP.md` | alle 257 Seiten der Sitemap, nach Standort gegliedert, zum Weitergeben |
| `BILDER-BEDARF.md` | jedes fehlende Foto mit Beschreibung und Format |
| `ANALYSE.md` | Befunde zum Altbestand |
| `README.md` | Aufbau, Sprachsystem, Deployment |
| `SCHLUESSEL.md` | wohin welcher Schlüssel gehört und warum nicht woandershin |
| `src/data/` | Standorte, Leistungen, Team, Preise, Beschwerden, Medien |
| `src/i18n/` | Sprachregister, Katalog, Oberflächentexte |
| `scripts/` | die Wächter |

Testumgebung: https://web-production-4452b1.up.railway.app
Railway-Projekt `ku64-website`, Dienst `web`, Deploy aus diesem Branch.
