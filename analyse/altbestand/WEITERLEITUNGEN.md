# Auswertung der Weiterleitungen aus der alten .htaccess

Aktive 301-Weiterleitungen: **168**
Auskommentiert (wirkungslos): **3**

## 1. Weiterleitungsketten

Jeder zusätzliche Sprung kostet Ladezeit und verwässert das Linksignal.
Google folgt Ketten nur begrenzt weit.

- **4 Sprünge:** `/dros-schiene`
  → `/leistungen/kieferorthopaedie/dros-schiene`
  → `/potsdam/kieferorthopadie/dros-schiene`
  → `/potsdam/kieferorthopadie/cmd`
  → `/potsdam`
- **2 Sprünge:** `/sulmaz-mohammad`
  → `/team/zahnaerzte/sulmaz-mohammad`
  → `/team/zahnaerzte`
- **2 Sprünge:** `/das-sind-wir`
  → `/ueber-uns/location/das-sind-wir`
  → `/ueber-uns/location/best-practice`
- **2 Sprünge:** `/schmerzfreie-zahnbehandlung-mit-dem-laser`
  → `/laserbehandlung`
  → `/leistungen/ganzheitliche-zahnmedizin/laserbehandlung`
- **2 Sprünge:** `/dr-anne-moser-2`
  → `/potsdam/team/dr-anne-moser`
  → `/potsdam/team`
- **2 Sprünge:** `/potsdam/schonende-zahnbehandlung-mit-laser-ihr-laser-zahnarzt-ku64-potsdam`
  → `/potsdam/laserbehandlung-potsdam`
  → `/potsdam/zahnbehandlung-laser`
- **2 Sprünge:** `/verwaltung-2`
  → `/team/verwaltung-2`
  → `/team/verwaltung`
- **2 Sprünge:** `/marcellina-dallashaj`
  → `/team/prophylaxe/marcellina-dallashaj`
  → `/team/prophylaxe`
- **2 Sprünge:** `/fachbeitraege/zahnheilkunde`
  → `/fachbeitraege`
  → `/blog`
- **2 Sprünge:** `/fachbeitraege/kieferorthopaedie`
  → `/fachbeitraege`
  → `/blog`
- **2 Sprünge:** `/fachbeitraege/all`
  → `/fachbeitraege`
  → `/blog`
- **2 Sprünge:** `/fachbeitraege/wissenswert`
  → `/fachbeitraege`
  → `/blog`
- **2 Sprünge:** `/fachbeitraege/aligner`
  → `/fachbeitraege`
  → `/blog`
- **2 Sprünge:** `/team/zahnaerzte/dr-birte-habedank`
  → `/potsdam/team/dr-birte-habedank`
  → `/potsdam/team`
- **2 Sprünge:** `/dr-jana-westerhorstmann`
  → `/berlinmitte/dr-jana-westerhorstmann`
  → `/berlinmitte/dr-jana-huesch`
- **2 Sprünge:** `/julia-ressler`
  → `/berlinmitte/julia-ressler`
  → `/berlinmitte`
- **2 Sprünge:** `/team/verwaltung/tanya-moir-douglas`
  → `/team/verwaltung/tanya-douglas-moir`
  → `/team/verwaltung`
- **2 Sprünge:** `/elena-hude`
  → `/team/zahnaerzte/elena-hude`
  → `/team/zahnaerzte`

## 2. Schleifen

Keine gefunden.

## 3. Ziele, die ins Leere laufen

- `/leistungen/beauty-cosmetics/hautarzt` → `/leistugen/beauty-cosmetics`

## 4. Auskommentierte Regeln

Diese Adressen wurden früher weitergeleitet, laufen jetzt aber ins Nichts,
sofern die Zielseite nicht existiert:

- `/potsdam/team/wiebke-lange` (sollte auf `/potsdam/team`)
- `/team/verwaltung/manuel-schuler` (sollte auf `/berlinmitte/manuel-schuler`)
- `/potsdam/kieferorthopadie` (sollte auf `/potsdam`)

## 5. Tatsächliche URL-Bereiche der alten Website

| Bereich | Nennungen |
|---|---|
| `/team/` | 64 |
| `/blog/` | 48 |
| `/potsdam/` | 36 |
| `/leistungen/` | 14 |
| `/berlinmitte/` | 11 |
| `/ueber-uns/` | 7 |
| `/fachbeitraege/` | 7 |
| `/telefon-service/` | 4 |
| `/zahnbeschwerden/` | 3 |
| `/teams/` | 2 |
| `/laserbehandlung/` | 2 |
| `/leistugen/` | 2 |
| `/human-resources/` | 2 |
| `/blog-potsdam/` | 2 |
| `/jiotis-hondralis/` | 1 |
| `/lulu-buerger/` | 1 |
| `/sulmaz-mohammad/` | 1 |
| `/jannik-scheurenbrand/` | 1 |
| `/anamnese-2/` | 1 |
| `/nils-radsack/` | 1 |
| `/kreidezahne-sanft-behandeln-kinderzahnarzt-ku64-berlin/` | 1 |
| `/das-sind-wir/` | 1 |
| `/team-2/` | 1 |
| `/schmerzfreie-zahnbehandlung-mit-dem-laser/` | 1 |
| `/zahnaerzte/` | 1 |
| `/dr-anne-moser-2/` | 1 |
| `/prophylaxe/` | 1 |
| `/verwaltung-2/` | 1 |
| `/marcellina-dallashaj/` | 1 |
| `/infusionstherapie-reviv/` | 1 |
| `/dros-schiene/` | 1 |
| `/potsdam-neu/` | 1 |
| `/prophylaxis-4-0/` | 1 |
| `/anka-ulrich/` | 1 |
| `/ina-lehmann/` | 1 |
| `/celina-leppin/` | 1 |
| `/berlinmitte-2/` | 1 |
| `/rezeption-und-service/` | 1 |
| `/berlinmitte-2-2/` | 1 |
| `/contact/` | 1 |
| `/caecilia-mickel/` | 1 |
| `/zahn-abgebrochen/` | 1 |
| `/gerade-zaehne/` | 1 |
| `/zahnwurzelentzuendung/` | 1 |
| `/kommunikation-human-resources__trashed/` | 1 |
| `/jana-jain/` | 1 |
| `/eva-maria-stauffenberg/` | 1 |
| `/team-za-berlin/` | 1 |
| `/ahmet-turan/` | 1 |
| `/jobs-karriere/` | 1 |
| `/dr-jana-westerhorstmann/` | 1 |
| `/alexandra-sophia-fischer/` | 1 |
| `/julia-ressler/` | 1 |
| `/auszubildende/` | 1 |
| `/communication-and-human-recources/` | 1 |
| `/carola-wantke/` | 1 |
| `/elena-hude/` | 1 |
| `/hazem-genidy/` | 1 |
| `/clara-marlene-schulz/` | 1 |
| `/doreen-ziliox/` | 1 |
| `/angie-skall/` | 1 |
| `/jutta-pueschel/` | 1 |
| `/medienecho/` | 1 |
| `/en/` | 1 |
| `/bleaching-kosmetik-shop/` | 1 |
| `/kontakt/` | 1 |
| `/unkategorisiert/` | 1 |
