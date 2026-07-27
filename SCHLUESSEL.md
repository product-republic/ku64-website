# Schlüssel und wo sie hingehören

Vier Zugangsschlüssel, zwei Orte. Welcher wohin gehört, entscheidet **nicht
der Dienst, sondern der Zeitpunkt**: Was beim Bauen gebraucht wird, gehört
nach GitHub; was beim Aufruf einer Seite gebraucht wird, nach Railway.

Alle Felder sind angelegt und leer. Es ist nur noch der Wert einzutragen.

---

## Railway — was zur Laufzeit gebraucht wird

Railway-Projekt `ku64-website`, Dienst **web** → Reiter **Variables**.

| Variable | Wofür | Ohne sie |
|---|---|---|
| `ANTHROPIC_API_KEY` | Digitaler Berater (Chat) | Der Chat öffnet, antwortet aber mit einem festen Hinweis statt mit einer Auskunft. Kein Fehler, aber auch keine Funktion. |
| `GEMINI_API_KEY` | Lächeln-Vorschau | Das Hochladen führt zu einer Fehlermeldung. |
| `ELEVENLABS_API_KEY` | Sprachberater | „Der Sprachberater ist in dieser Testumgebung noch nicht verbunden." |
| `ELEVENLABS_AGENT_ID` | Sprachberater | dito – beide werden zusammen gebraucht |

**Schlüssel holen:**
- Anthropic: `console.anthropic.com/settings/keys` — getrennt vom Max-Abo, braucht Guthaben
- Google: `aistudio.google.com/apikey`
- ElevenLabs: `elevenlabs.io/app/settings/api-keys`, die Agent-ID im jeweiligen Agenten

Nach dem Eintragen baut Railway neu. Das dauert ein bis zwei Minuten.

---

## GitHub — was beim Bauen gebraucht wird

`Settings` → `Secrets and variables` → `Actions` → `Secrets` →
`New repository secret`.

| Secret | Wofür |
|---|---|
| `ANTHROPIC_API_KEY` | Der Ablauf „Übersetzungen nachziehen" |

**Ja, derselbe Schlüssel zweimal.** Railway und GitHub sind getrennte Systeme;
keines liest die Variablen des anderen. Man kann denselben Wert eintragen oder
zwei getrennte Schlüssel anlegen – zwei getrennte sind besser, weil sich dann
einer austauschen lässt, ohne den anderen anzufassen.

---

## Wo Schlüssel NICHT hingehören

**Nicht in die Umgebungsvariablen der Claude-Code-Umgebung.** Unter dem Feld
steht Anthropics eigener Hinweis: „Diese sind für alle sichtbar, die diese
Umgebung verwenden – füge keine Geheimnisse oder Anmeldedaten hinzu."

**Nicht ins Repository.** Auch nicht in einer `.env`-Datei „nur zum Testen".
Was einmal in der Historie steht, steht dort dauerhaft, und ein öffentliches
Repository wird von Scannern abgesucht.

**Nicht in den Chat.** Er landet im Sitzungsprotokoll.

---

## Prüfen, ob es angekommen ist

Ohne Schlüssel bricht nichts – die Website läuft vollständig, nur die vier
digitalen Funktionen antworten mit ihrem Ersatztext. Das ist Absicht: Eine
Praxis-Website darf nicht ausfallen, weil ein Kontingent aufgebraucht ist.

Nach dem Eintragen:

| Funktion | Prüfung |
|---|---|
| Chat | unten rechts öffnen, eine Frage stellen – es muss eine echte Antwort kommen |
| Sprachberater | `/beratung/` → „Gespräch starten" |
| Lächeln-Vorschau | `/laecheln-vorschau/` → ein Foto hochladen |
| Übersetzung | GitHub → Actions → „Übersetzungen nachziehen" → Run workflow |

---

## Was das kostet

Der Chat und der Sprachberater rechnen je Gespräch ab, die Lächeln-Vorschau je
Bild. Die Übersetzung ist einmalig teuer und danach fast umsonst: Sie
übersetzt nur, was fehlt oder dessen deutsches Original sich geändert hat.

Der erste vollständige Lauf umfasst 490 englische und 601 französische
Bausteine. Danach sind es je Änderung eine Handvoll.

Der Chat hat eine Ratenbegrenzung von 30 Anfragen je zehn Minuten und
Adresse – nicht gegen Kosten, sondern gegen Missbrauch der Testumgebung.
