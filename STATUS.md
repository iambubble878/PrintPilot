# Projektstatus

Stand: 2026-10-30

| Bereich | Stand |
| --- | --- |
| Phase | KI-Simulator mit fiktiver Vier-Wochen-Vorführung und historischem Rücktest |
| GitHub | Privates Repository iambubble878/PrintPilot angelegt |
| Dokumentation | Grundstruktur vorhanden |
| Anwendung | GitHub-`main` enthält den KI-Simulator aus dem älteren Projekt-ZIP und den getrennten historischen Rückblick. Vier Wochen (28 Tage) sind als Vorführhorizont vorbereitet. |
| Anforderungen | Team und qualitative Ziele bestätigt; Funktionen und messbare Kriterien offen |
| Technologie / Architektur | HTML/CSS/JavaScript ohne Backend; vorberechnete Gradient-Boosting-Tageswerte für Simulation und getrennte historische Random-Forest-Rückblicksdaten |
| Tests | 16 lokale Node-Tests bestanden; Build, Inline-Syntax und lokaler HTTP-Abruf geprüft; visuelle Browserprüfung noch offen |
| Veröffentlichung | Keine Anwendung veröffentlicht |

## Nächster Schritt

Vier-Wochen-Vorführung im Browser prüfen: Kundenaufträge, 28-/30-/60-/90-Tage-Simulation, historischer Rückblick und übrige Seiten. Falls die Vorführung einen anderen fiktiven Stichtag zeigen soll, müssen Nachfrage-, Bestands- und Bestelldaten gemeinsam auf diesen Stichtag fortgeschrieben und die Prognose neu erzeugt werden. Für reale Beschaffungsentscheidungen müssten Produkt-Material-Zuordnung, Gramm pro Stück, Datenqualität und Aktualität fachlich bestätigt werden. Bestellentscheidungen bleiben beim Einkauf.

## Einschränkungen

Das nun bereitgestellte `PrintPilot Projekt.zip` konnte lokal gelesen werden; seine `.git`-Daten, temporären Dateien und erzeugten Dokumente werden nicht in den Änderungsvorschlag übernommen. Die früher verlinkte PDF konnte über den Page-Dateileser nicht gelesen werden. Die Prognosedaten sind synthetisch und auf den festen Stand 21.10.2026 bezogen.

## Lokale Git-Verknüpfung

Die ältere lokale Git-Kopie konnte damals nicht synchronisiert werden. Die Übernahme dieser Webseite erfolgt über einen neuen Änderungsvorschlag auf Basis der vorhandenen GitHub-Historie; `main` bleibt bis zur Prüfung unverändert.
