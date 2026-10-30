# PrintPilot – Filamentplanung

PrintPilot ist ein statischer Webapp-Prototyp für die Materialplanung einer 3D-Druck-Firma. Die Anwendung verbindet Verbrauch, Lagerbestand, offene Bestellungen und Material in der Druckerflotte zu einer gemeinsamen Planungsübersicht.

Das Projekt ist ein Kursprojekt von Carolin, Meik, Tamas und Lilia. Bestellungen werden weiterhin vom Einkauf entschieden. Der Quellcode gehört zum bestehenden privaten Repository [iambubble878/PrintPilot](https://github.com/iambubble878/PrintPilot). Projektstand und offene Aufgaben stehen in [STATUS.md](STATUS.md) und [TODO.md](TODO.md); Entscheidungen und Änderungen in [MEMORY.md](MEMORY.md) und [CHANGELOG.md](CHANGELOG.md).

> **Status:** Demonstrator mit Pseudodaten, ohne Echtzeitverbindung oder automatische Bestellung. Die aktive Bedarfsprognose nutzt vorberechnete Tageswerte eines trainierten Gradient-Boosting-Modells für 22.10.2026–19.01.2027. Die Vorführung startet mit genau vier Wochen ab dem fiktiven Datenstand 21.10.2026; 30, 60 und 90 Tage bleiben wählbar. Ein getrennter historischer Random-Forest-Rücktest für Januar bis März 2026 zeigt Prognose und Ist-Werte. Das Python-Modell wird nicht im Browser trainiert.

## Schnellstart

Es ist keine Installation und kein Build erforderlich. `index.html` kann direkt im aktuellen Browser geöffnet werden.

Für einen lokalen Webserver:

```bash
python -m http.server 8765 --bind 127.0.0.1
```

Danach im Browser `http://localhost:8765` öffnen. Auf diesem Windows-PC ist Port 8000 reserviert; falls 8765 später belegt ist, kann ein anderer freier Port verwendet werden.

Für die automatische Anzeige des historischen KI-Rücktests ist der lokale Webserver nötig, weil Browser beim direkten Öffnen einer HTML-Datei den Zugriff auf `prognosen.json` häufig sperren. Alternativ kann die Datei in der Bedarfsprognose über „JSON-Datei auswählen“ geladen werden.

Für Änderungen an den Simulator-Quelldateien erzeugt `npm run build` die `index.html` erneut. `npm test` prüft die Modell- und Planungsrechnung. Für das bloße Öffnen der Seite sind beide Befehle nicht nötig.

## Funktionen

- **Übersicht:** Verbrauch, Bestand, offene Bestellungen, Druckerstatus und Projektziele mit Zielwerten, Fristen relativ zum Projektstart und Messstatus; mangels Ist-Daten wird kein Fortschritt erfunden.
- **Aktive Bedarfsprognose:** vorberechnete KI-Tageswerte für zwölf Artikel; Standardhorizont vier Wochen (28 Tage), alternativ 30/60/90 Tage. Nachfrage, Bestand, Lieferverzug, Materialaufschlag und Sicherheitsbestand lassen sich als Szenario ändern. Produktgewichte und Materialzuordnung ergeben Stück- und Filamentbedarf. Details und Grenzen stehen in [docs/KI_PROGNOSE.md](docs/KI_PROGNOSE.md).
- **Historischer KI-Rücktest:** `prognosen.json` enthält 1.080 Tageswerte für zwölf Produkt-IDs vom 01.01. bis 31.03.2026. Die bestehende Prognoseansicht zeigt Prognose und tatsächliche Stückzahl getrennt nach Produkt, Monat und Tag. Der Rücktest wurde mit Daten bis 31.12.2025 trainiert; die Ist-Werte von 2026 dienen nur der nachträglichen Prüfung. Diese historische Datei steuert keine aktuellen Bestellvorschläge.
- **Lagerbestand:** Bestand nach Material-ID und Farbe, einschließlich Lager, Druckerpositionen, offenen Bestellungen und Datenherkunft.
- **Bestellungen:** Offene Bestellungen öffnen, geplante Liefertermine einsehen und tatsächliche Eingänge erfassen.
- **Kundenaufträge:** fünf anonymisierte Beispieldatensätze. Die Status-Empfehlung erklärt Bestand, offene Bestellungen und die feste 30-Tage-KI-Basisprognose. Sie folgt nicht den Szenario-Reglern; die Statusänderung bleibt manuell.
- **Monatsdiagramm:** zeigt monatlichen Filamentverbrauch und bestellte Menge in Gramm; Bestellung und Wareneingang werden getrennt behandelt.
- **Materialhistorie:** Auswahl eines Materials öffnet Verbrauchs- und Einkaufshistorie für das ausgewählte und das vorherige Jahr.
- **Einkaufsplanung:** elf Material-Farb-Kombinationen mit der kürzesten Reichweite. Der Vorschlag berücksichtigt Lieferzeit, 5 % Ausschuss, 3 kg Sicherheitsbestand, Lager, Druckerplätze und offene Bestellungen.
- **Eigene Bestellmenge:** Menge neben dem Vorschlag in ganzen Kilogramm ändern; die Abweichung wird als eigene Menge minus Vorschlag angezeigt.
- **Prüfstatus:** „Prüfen“ schaltet auf „Geprüft“ und zurück. Wird die Menge geändert, springt der Status wieder auf „Prüfen“.
- **Export:** Einkaufsliste mit Vorschlag, eigener Menge, Abweichung und Prüfstatus als CSV herunterladen.
- **Druckerflotte:** 100 Drucker mit vier Materialplätzen je Drucker.

Weitere Hinweise zur Bedienung stehen in [docs/ANWENDUNG.md](docs/ANWENDUNG.md).

## Projektstruktur

```text
PrintPilot/
├── index.html                     # vollständige, eigenständig ausführbare Webapp
├── historical-prognosen.js        # Quellskript für den historischen KI-Rücktest
├── prognosen.json                 # historischer Rücktest Januar–März 2026
├── printpilot_prognose.json       # separater Prognoseexport Oktober 2026–Januar 2027
├── app/                           # Simulator-Quellen und zweite kleine Demo
├── model/                         # Trainingsskript, keine trainierte Modelldatei
├── tools/                         # Import und Build der Einzeldatei
├── test/                          # lokale Modell- und Seitenprüfungen
├── package.json                   # Build- und Testbefehle ohne externe Pakete
├── server.mjs                     # optionaler lokaler Node-Server
├── README.md                      # Projektübersicht und Schnellstart
├── CHANGELOG.md                   # dokumentierte Änderungen
├── .gitignore                     # typische lokale Dateien ausschließen
├── data/
│   └── README.md                  # Hinweise zum eingebetteten Datensatz
└── docs/
    ├── ANWENDUNG.md               # Bedienungsanleitung
    ├── ARCHITEKTUR.md             # technischer Aufbau
    ├── DATENMODELL-UND-AUDIT.md   # Datengrundlage und Zahlenabgleich
    ├── GITHUB-PAGES.md            # Veröffentlichung über GitHub Pages
    └── KI_PROGNOSE.md             # Modell, Daten und Simulationsregeln
```

## Datengrundlage in Kürze

Der ausgewertete CSV-Zeitraum reicht vom 22.10.2021 bis 21.10.2026. Anfangs- und Endmonat sind teilweise erfasst. Die Originaldaten enthalten zwölf Material-Farb-Kombinationen und 100 Drucker mit je einer dokumentierten Materialposition. Für die gewünschte Anzeige mit vier Positionen pro Drucker ergänzt die Webapp drei Pseudo-Positionen je Maschine.

Der Abgleich der Originaldaten ist für den Gesamtzeitraum rechnerisch geschlossen:

```text
1.955.927 g Anfangsbestand
+ 53.922.000 g Wareneingang
- 54.818.552 g Verbrauch
= 1.059.375 g Endbestand
```

Die 19 offenen Bestellungen mit insgesamt 514 kg sind noch nicht als Wareneingang verbucht. Die 38 zusätzlichen Materialvarianten und 300 zusätzlichen Druckerplätze sind Pseudo-Daten und werden in den Bestellvorschlägen nicht als reale Bestände berücksichtigt. Details und Abgrenzungen stehen in [docs/DATENMODELL-UND-AUDIT.md](docs/DATENMODELL-UND-AUDIT.md).

## GitHub verwenden

Das bestehende private Repository `iambubble878/PrintPilot` enthält die Webseite, den KI-Simulator und den getrennten historischen Rückblick. Eine Anleitung für GitHub Desktop und VS Code steht in [docs/GITHUB-PAGES.md](docs/GITHUB-PAGES.md).

## Grenzen und Lizenz

Die Anwendung läuft ausschließlich im Browser. Einkaufsangaben und Prüfstatus werden nur lokal im jeweiligen Browser gespeichert. Es gibt kein Backend, keine Anmeldung und keine Verbindung zu ERP-, Shop- oder Lieferantensystemen. Die Zielwerte von 40.000 € Ausgangsbestand und ca. 15 Stillstandstagen pro Jahr sind Projektannahmen, keine gemessenen Ausgangswerte.

Für dieses Paket wurde keine Open-Source-Lizenz festgelegt. Vor einer öffentlichen Weiterverwendung sollte eine passende Lizenz gewählt und geprüft werden, ob alle enthaltenen Zahlen und Inhalte veröffentlicht werden dürfen.
