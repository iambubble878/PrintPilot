# PrintPilot – Filamentplanung

PrintPilot ist ein Kursprojekt von Carolin, Meik, Tamas und Lilia. Die Webapp zeigt, wie eine bessere Filamentplanung unnötigen Lagerbestand und Produktionsausfälle durch Materialmangel verringern kann. Bestellentscheidungen bleiben beim Einkauf.

## Webapp starten

Die Webapp ist eine statische HTML-Datei im Repository: `index.html`. Sie benötigt keine Installation und kein Backend.

Im Repository-Ordner kann ein lokaler Webserver gestartet werden:

```bash
python -m http.server 8000
```

Danach im Browser `http://localhost:8000` öffnen. Die Datei lässt sich auch direkt im Browser öffnen; für lokale Speicherung ist ein Webserver zuverlässiger.

## Funktionen

- **Übersicht und Lagerbestand:** Bestand je Filamenttyp und Farbe, Material in Druckern sowie offene Bestellungen.
- **Bedarfsprognose:** vier Wochen, mit Produkt- und Farbprognosen in kg Filament, saisonalen Artikeln und externen Marktplatzideen.
- **Einkaufsplanung:** berechneter Vorschlag, eigene Bestellmenge, Abweichung und umkehrbarer Prüfstatus.
- **Bestellungen:** erwartete und tatsächliche Wareneingänge; eingetragene Eingänge können lokal den Bestand aktualisieren.
- **Kundenaufträge:** fünf anonymisierte Beispiele, frei änderbarer Status und eine erklärte Status-Empfehlung aus Bestand, offenen Bestellungen und 4-Wochen-Prognose.
- **Druckerflotte und Datensicht:** Druckerübersicht und Einordnung der eingebetteten Ausgangs- und Beispieldaten.

## Dokumentation

| Datei | Inhalt |
| --- | --- |
| [Webapp-Übersicht](docs/WEBAPP.md) | Zweck, Funktionsumfang und Grenzen |
| [Bedienungsanleitung](docs/BEDIENUNG.md) | Navigation und wichtige Abläufe |
| [Architektur](docs/ARCHITEKTUR.md) | Aufbau, Berechnung und Browser-Speicherung |
| [Datenmodell](docs/DATENMODELL.md) | Materialien, Bestellungen und Kundenaufträge |
| [Projektgrundlage](docs/PROJEKTGRUNDLAGE.md) | bestätigter Projektkontext und Annahmen |
| [Projektstatus](STATUS.md) | aktueller Stand und nächste Aufgaben |
| [Aufgaben](TODO.md) | offene Arbeiten |
| [Projektgedächtnis](MEMORY.md) | Entscheidungen und bestätigte Angaben |
| [Änderungsprotokoll](CHANGELOG.md) | dokumentierte Änderungen |

## Grenzen des Prototyps

Die App verwendet eingebettete Ausgangs- und Beispieldaten. Sie ist nicht mit einem ERP, Google Drive, Lieferanten oder einem Kundenbestellsystem verbunden. Die Prognose ist eine statistische Regression mit Zeittrend und Monatsmustern; ein selbstlernendes Live-KI-Modell ist nicht angebunden. Die Status-Empfehlung ist eine nachvollziehbare Datenanalyse und ändert den Status nur nach manueller Übernahme. Eingaben bleiben im jeweiligen Browser und werden nicht zwischen Geräten synchronisiert.

Das Repository ist privat. Eine Lizenz und eine Veröffentlichung über GitHub Pages sind noch nicht festgelegt.
