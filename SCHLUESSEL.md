# Schlüssel eintragen – Schritt für Schritt

Vier Zugangsschlüssel, zwei Orte. **Einer ist erledigt** (Anthropic, in
Railway und GitHub). Es fehlen noch drei, alle in Railway.

Welcher Schlüssel wohin gehört, entscheidet nicht der Dienst, sondern der
Zeitpunkt: Was beim **Bauen** gebraucht wird, gehört nach GitHub; was beim
**Aufruf einer Seite** gebraucht wird, nach Railway.

> **Nicht in den Chat schreiben.** Ein Schlüssel, der dort steht, steht im
> Sitzungsprotokoll. Ich brauche ihn nicht zu sehen – ich sehe am Ergebnis,
> ob er angekommen ist.

---

## Was noch fehlt

| Schlüssel | Wofür | Was ohne ihn passiert |
|---|---|---|
| `GEMINI_API_KEY` | Lächeln-Vorschau | Das Hochladen eines Fotos führt zu einer Fehlermeldung. |
| `ELEVENLABS_API_KEY` | Sprachberater | „Der Sprachberater ist in dieser Testumgebung noch nicht verbunden." |
| `ELEVENLABS_AGENT_ID` | Sprachberater | dito – beide werden zusammen gebraucht |

Alle drei Felder sind in Railway **bereits angelegt und leer**. Es ist nur
der Wert einzutragen.

---

## 1. Google-Schlüssel holen (für die Lächeln-Vorschau)

1. **https://aistudio.google.com/apikey** öffnen, mit einem Google-Konto
   anmelden.
2. **„Create API key"** klicken.
3. Ein Projekt wählen oder ein neues anlegen lassen – beides geht.
4. Der Schlüssel erscheint einmal. **Jetzt kopieren**, er beginnt mit
   `AIza…`.

Die Lächeln-Vorschau erzeugt aus dem Foto der Person eine Ansicht mit
helleren Zähnen. Das kostet je Bild wenige Cent.

---

## 2. ElevenLabs-Schlüssel und Agent-ID holen (für den Sprachberater)

Hier sind es **zwei Werte aus zwei verschiedenen Ecken** – das ist die
Stelle, an der man erfahrungsgemäß hängen bleibt.

**Der Schlüssel:**

1. **https://elevenlabs.io/app/settings/api-keys** öffnen.
2. **„Create API Key"**, einen Namen vergeben (etwa „KU64 Website").
3. Kopieren. Er beginnt mit `sk_…`.

**Die Agent-ID:**

1. **https://elevenlabs.io/app/conversational-ai** öffnen.
2. Gibt es dort noch keinen Agenten: **„Create an AI agent"**, Sprache
   Deutsch, Stimme aussuchen.
3. Den Agenten anklicken. Die ID steht oben unter dem Namen und lässt sich
   mit einem Klick kopieren – eine lange Zeichenkette ohne Präfix.

Die Stimme spricht mit Patientinnen und Patienten. Wer sie aussucht, trifft
eine Entscheidung über den Ton der Praxis – das ist keine technische Frage,
und deshalb sucht sie besser jemand aus dem Haus aus als ich.

---

## 3. Alle drei in Railway eintragen

1. **https://railway.app** öffnen, Projekt **`ku64-website`**.
2. Den Dienst **`web`** anklicken.
3. Reiter **`Variables`**.
4. Dort stehen die drei Namen bereits, mit leerem Wert. Auf den Wert
   klicken, einfügen, **Enter**.
5. Railway fragt am oberen Rand nach: **„Deploy"** bestätigen.

Nach ein bis zwei Minuten läuft die neue Fassung.

---

## Prüfen, ob es angekommen ist

Ohne Schlüssel bricht nichts – die Website läuft vollständig, nur die
betroffene Funktion antwortet mit ihrem Ersatztext. Das ist Absicht: Eine
Praxis-Website darf nicht ausfallen, weil ein Kontingent aufgebraucht ist.

| Funktion | Prüfung |
|---|---|
| Chat | unten rechts öffnen, eine Frage stellen – **läuft bereits** |
| Sprachberater | `/beratung/` → „Gespräch starten" |
| Lächeln-Vorschau | `/laecheln-vorschau/` → ein Foto hochladen |

Sag mir Bescheid, wenn die Werte drin sind – ich prüfe alle drei gegen die
laufende Adresse und melde, was ich sehe.

---

## Was bereits eingetragen ist

| Ort | Schlüssel | Wofür |
|---|---|---|
| Railway → `web` → Variables | `ANTHROPIC_API_KEY` | Digitaler Berater (Chat) |
| GitHub → Secrets → Actions | `ANTHROPIC_API_KEY` | Ablauf „Übersetzungen nachziehen" |

**Ja, derselbe Schlüssel zweimal.** Railway und GitHub sind getrennte
Systeme; keines liest die Variablen des anderen. Zwei getrennte Schlüssel
wären etwas besser, weil sich dann einer austauschen lässt, ohne den
anderen anzufassen – nötig ist es nicht.

---

## Eine Einstellung fehlt noch (kein Schlüssel)

**GitHub → Settings → Actions → General → Workflow permissions →
„Allow GitHub Actions to create and approve pull requests"**

Der Übersetzungsablauf funktioniert auch ohne. Er kann dann nur keinen Pull
Request anlegen, sondern legt die Übersetzung auf einem Zweig ab, den ich
von Hand hole. Mit dem Häkchen kommt sie als Vorschlag zum Gegenlesen.

---

## Wo Schlüssel NICHT hingehören

**Nicht in die Umgebungsvariablen der Claude-Code-Umgebung.** Unter dem
Feld steht Anthropics eigener Hinweis: „Diese sind für alle sichtbar, die
diese Umgebung verwenden – füge keine Geheimnisse oder Anmeldedaten hinzu."

**Nicht ins Repository.** Auch nicht in einer `.env`-Datei „nur zum
Testen". Was einmal in der Historie steht, steht dort dauerhaft, und ein
öffentliches Repository wird von Scannern abgesucht.

**Nicht in den Chat.** Er landet im Sitzungsprotokoll.

---

## Was das kostet

Der Chat und der Sprachberater rechnen je Gespräch ab, die Lächeln-Vorschau
je Bild. Die Übersetzung ist einmalig teuer und danach fast umsonst: Sie
übersetzt nur, was fehlt oder dessen deutsches Original sich geändert hat.
Der erste vollständige Lauf ist durch – 490 englische und 601 französische
Bausteine. Danach sind es je Änderung eine Handvoll.

Der Chat hat eine Ratenbegrenzung von 30 Anfragen je zehn Minuten und
Adresse – nicht gegen Kosten, sondern gegen Missbrauch der Testumgebung.
