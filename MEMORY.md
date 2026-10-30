# Projektgedächtnis

Stand: 2026-10-30

## Bestätigt

- Projektname: PrintPilot.
- Laut aktueller Projekt-Page: Kursprojekt von Carolin, Meik, Tamas und Lilia zum 3D-Druck.
- Ziele: Filamentbedarf besser planen, unnötigen Lagerbestand und Produktionsausfälle durch Materialmangel reduzieren.
- Bestellentscheidungen verbleiben beim Einkauf.
- Die Projekt-Page sammelt Aufgaben und Ergebnisse für den Gruppenüberblick.
- Der Nutzer verlangt ein Repository sowie README.md, TODO.md, MEMORY.md, STATUS.md und CHANGELOG.md.
- Jede Änderung soll dokumentiert werden.
- GitHub-Konto: iambubble878.
- Repository: https://github.com/iambubble878/PrintPilot.
- Die bestehende lokale Webseite lag als `PrintPilot-GitHub`-Ordner und gleichlautende ZIP vor; alle zehn Dateien stimmten inhaltlich überein. Das Repository enthielt zuvor nur Projektdokumentation.
- Der frühere Chat-Anhang `prognosen.json` enthält 1.080 historische Produkt-Tageswerte für Januar–März 2026. Training endete am 31.12.2025; der aus den Datensätzen neu berechnete MAE beträgt 5,83 Stück.
- In GitHub-`main` sind der behobene Skriptfehler, die KI-Simulator-Fassung aus `PrintPilot Projekt.zip` und der getrennte historische Rückblick zusammengeführt. Die Vorführung zeigt standardmäßig 28 Tage ab dem fiktiven Datenstand 21.10.2026; Kundenaufträge verwenden weiterhin die feste 30-Tage-KI-Basisprognose.

## Entscheidungen

| Datum | Entscheidung | Begründung |
| --- | --- | --- |
| 2026-10-22 | Repository zunächst privat | Sichtbarkeit war nicht vorgegeben; Veröffentlichung bleibt eine bewusste spätere Entscheidung. |
| 2026-10-22 | Dokumentation auf Deutsch | Sprache der Projektbeauftragung. |
| 2026-10-22 | Erst Planung, dann Technologiewahl | Anforderungen sind noch nicht bestätigt. |
| 2026-10-30 | Bestehenden Webapp-Prototyp übernehmen | Der Nutzer hat die lokal vorhandene Webseite für die KI-Integration benannt. |
| 2026-10-30 | Historische Prognose und Ist-Werte getrennt anzeigen | Der Rücktest für Januar–März 2026 ist keine aktuelle Bedarfsprognose. Produkt- und Materialzuordnung samt Gramm je Stück sind nicht bestätigt. |
| 2026-10-30 | Lokalen Beispielport 8765 verwenden | Windows reserviert auf diesem PC Port 8000; der lokale HTTP-Abruf der Webseite und `prognosen.json` über 8765 wurde geprüft. |
| 2026-10-30 | KI-Simulator-Fassung über Pull Request #3 übernehmen | Sie enthält vorberechnete Gradient-Boosting-Tageswerte, Produktgewichte und Materialzuordnung; die historische Random-Forest-Datei bleibt ein eigener Rücktest. |
| 2026-10-30 | Vier Wochen als Standard für die fiktive Vorführung | 28 Tageswerte ab 22.10.2026 werden aus demselben 90-Tage-Export berechnet; der Bestandsstichtag bleibt 21.10.2026. Kundenempfehlungen behalten den 30-Tage-Basiswert. |
| 2026-10-22 | CHANGELOG und Git gemeinsam pflegen | Inhaltliche Begründung und technische Historie bleiben nachvollziehbar. |

## Quellen und Grenzen

Die beim Projektstart gelesene Fassung der Projekt-Page beschrieb einen früheren lokalen Start mit Commit 0762511 und ZIP-Anhang. Im damaligen Arbeitsordner waren keine Dateien vorhanden. Das frühere ZIP konnte über den Page-Dateileser nicht gelesen werden; seine Historie wurde nicht übernommen. Dieses Repository beginnt daher mit einer neuen Historie. Die aktuelle Page enthält den Projektüberblick und den PDF-Verweis; der frühere Repository-Abschnitt ist dort nicht mehr vorhanden.

Die PDF konnte ebenfalls über diesen Leser nicht ausgelesen werden. Ihre Inhalte gelten nicht als bestätigte Anforderungen.

## Offene Fragen

Konkrete Zielgruppe, Funktionen, Datenquellen, Prognosehorizont, messbare Qualitätsmaßstäbe, Technologie, Betrieb und Lizenz sind noch zu klären.
