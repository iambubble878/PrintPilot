# Projektgrundlage

Stand: 2026-10-22

## Quellen

- Nutzerauftrag: Projekt PrintPilot starten, GitHub-Repository und Dokumentationsdateien anlegen; jede Änderung dokumentieren.
- Projekt-Page: https://chatgpt.com/space/page_6ad9f9537c28819192afcde0711d9cbd
- Dort verlinkte Unterlage: PrintPilot-KI-Prognose-fur-den-Filament-Bedarf.pdf.

## Bestätigter Umfang dieses Starts

Repository und Dokumentationsstruktur einrichten. Noch keine fachliche Implementierung beauftragt oder spezifiziert.

## Bestätigter Projektkontext

Quelle: aktueller Projektüberblick der Projekt-Page, gelesen am 2026-10-22.

- Kursprojekt zum 3D-Druck von Carolin, Meik, Tamas und Lilia.
- Bessere Planung des Filamentbedarfs.
- Weniger unnötiger Lagerbestand und weniger Produktionsausfälle durch Materialmangel.
- Der Einkauf entscheidet weiterhin über Bestellungen.
- Gemeinsame Sammlung von Aufgaben und Ergebnissen für den Überblick in der Gruppe.

## Vorläufige Einordnung

Der PDF-Titel deutet auf eine KI-Prognose für Filamentbedarf im 3D-Druck hin. Dies ist eine Ableitung aus dem Dateinamen, keine Auswertung des Inhalts.

## Noch auszuwerten

PDF-Inhalte und eventuell frühere Entscheidungen. Die PDF ist über den verfügbaren Page-Dateileser weiterhin nicht lesbar. Beim Projektstart war außerdem ein Repository-ZIP verlinkt, das nicht gelesen werden konnte; auf der aktuellen Page ist es nicht mehr verlinkt. Der damals genannte frühere Commit 0762511 ist nicht Teil der neuen Historie.

Weitere Ordner für Anwendung, Tests und Daten erst nach Festlegung der Architektur anlegen. Reale Daten und Projektunterlagen nur nach Prüfung auf Eignung und Vertraulichkeit übernehmen.


## Webapp-Prototyp dokumentiert am 2026-10-27

Seit dem Projektstart liegt ein statischer Prototyp in `index.html` vor. Die Webapp zeigt Lagerbestand, Einkaufsplanung, Bestellungen, fünf anonymisierte Kundenaufträge und eine vierwöchige Bedarfsprognose. In der Kundenauftragsansicht werden Status-Empfehlungen aus Materialbestand, offenen Bestellungen und Prognose begründet; Statusänderungen bleiben manuell.

Diese Implementierung beschreibt den aktuellen Demonstrator. Sie bestätigt keine Produktivdatenquelle, keine produktive KI-Anbindung und keine endgültigen Abnahmekriterien. Die Status-Empfehlung und Prognose verwenden eingebettete Beispieldaten beziehungsweise Projekt-Ausgangsdaten.
