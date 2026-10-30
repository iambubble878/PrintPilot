# Projektstatus

Stand: 2026-10-30

| Bereich | Stand |
| --- | --- |
| Phase | KI-Simulator mit neu trainierter fiktiver Vier-Wochen-Prognose und getrenntem historischem Rücktest |
| GitHub | Privates Repository iambubble878/PrintPilot angelegt |
| Dokumentation | Grundstruktur vorhanden |
| Anwendung | Die Vier-Wochen-Prognose wurde mit Random Forest neu trainiert; der historische Random-Forest-Rückblick bleibt ein eigener Modelllauf. Beide sind im Dashboard getrennt gekennzeichnet. |
| Anforderungen | Team und qualitative Ziele bestätigt; Funktionen und messbare Kriterien offen |
| Technologie / Architektur | HTML/CSS/JavaScript ohne Backend; vorberechnete Random-Forest-Tageswerte für die Simulation und getrennte historische Random-Forest-Rückblicksdaten |
| Tests | 16 lokale Node-Tests bestanden; Random Forest aus fünfjährigen Pseudodaten trainiert und zeitlich getrennt rückgetestet; Build und Inline-Syntax geprüft; visuelle Browserprüfung noch offen |
| Veröffentlichung | GitHub-Pages-Adresse vom Nutzer als online gemeldet: https://iambubble878.github.io/PrintPilot/; technische Sichtprüfung der Online-Seite noch offen |

## Nächster Schritt

Online-Vier-Wochen-Vorführung im Browser prüfen: Kundenaufträge, 28-/30-/60-/90-Tage-Simulation, historischer Rückblick und übrige Seiten. Falls die Vorführung einen anderen fiktiven Stichtag zeigen soll, müssen Nachfrage-, Bestands- und Bestelldaten gemeinsam auf diesen Stichtag fortgeschrieben und die Prognose neu erzeugt werden. Für reale Beschaffungsentscheidungen müssten Produkt-Material-Zuordnung, Gramm pro Stück, Datenqualität und Aktualität fachlich bestätigt werden. Bestellentscheidungen bleiben beim Einkauf.

## Einschränkungen

Das nun bereitgestellte `PrintPilot Projekt.zip` konnte lokal gelesen werden; seine `.git`-Daten, temporären Dateien und erzeugten Dokumente werden nicht in den Änderungsvorschlag übernommen. Die früher verlinkte PDF konnte über den Page-Dateileser nicht gelesen werden. Die Prognosedaten sind synthetisch und auf den festen Stand 21.10.2026 bezogen.

## Lokale Git-Verknüpfung

Die ältere lokale Git-Kopie konnte damals nicht synchronisiert werden. Die Übernahme dieser Webseite erfolgt über einen neuen Änderungsvorschlag auf Basis der vorhandenen GitHub-Historie; `main` bleibt bis zur Prüfung unverändert.
