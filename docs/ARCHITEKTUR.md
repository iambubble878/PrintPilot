# Technische Architektur

## Laufzeit

PrintPilot verwendet weiter die bestehende `index.html` mit eingebettetem HTML, CSS, JavaScript und Demo-Daten. Der historische Rücktest nutzt zusätzlich `historical-prognosen.js` und `prognosen.json`. Es wird kein Framework, Paketmanager, Build-Schritt oder Server-Backend benötigt. Für das automatische Laden der JSON-Datei ist ein statischer HTTP-Server nötig; beim direkten Öffnen der HTML-Datei kann sie über die Dateiauswahl geladen werden.

## Komponenten

- **Navigation und Seiten:** Umschalten der Bereiche erfolgt clientseitig.
- **Diagramme:** SVG wird direkt im Browser erzeugt; es gibt keine Chart-Bibliothek.
- **Material-, Drucker- und Kundenauftragslisten:** Tabellen und Kacheln werden aus eingebetteten Datensätzen aufgebaut. Die Kundenauftragsansicht enthält fünf anonymisierte Beispieldatensätze. Statusvorschläge werden aus Bestand, offenen Bestellungen und der 4-Wochen-Prognose je Material berechnet; Übernahme bleibt eine manuelle Aktion.
- **Historienfenster:** Material-ID verbindet Lagerbestand mit Monatsverbrauch und Einkaufsereignissen.
- **Einkaufsplanung:** Bedarf, realer Bestand und offene Bestellungen werden je Material zusammengeführt; die Vorschlagsmenge wird auf volle 1-kg-Spulen gerundet.
- **Export:** CSV-Dateien werden im Browser erzeugt und über einen Download-Link ausgegeben.
- **Historischer KI-Rücktest:** Die separat geladene JSON-Datei liefert Vorhersage und nachträglichen Ist-Wert je Produkt und Tag. Die Anzeige aggregiert beide Reihen nach Monat und Produkt, berechnet den mittleren absoluten Fehler und hält diese Daten von der aktuellen Einkaufsplanung getrennt.

## Browser-Speicher

Die eigenen Einkaufswerte und Prüfzustände werden lokal abgelegt unter den Schlüsseln:

- `printpilot-own-order-kg`
- `printpilot-order-reviewed`
- `printpilot-customer-order-statuses` (Statuswerte der Kundenaufträge)

Die Daten verlassen den Browser nicht über die Webapp. Der Export ist eine vom Benutzer ausgelöste Datei.

## Externe Abhängigkeiten

Die Oberfläche lädt DM Sans und Manrope über Google Fonts. Bei fehlender Internetverbindung verwendet der Browser eine verfügbare Ersatzschrift. Daten und Kernfunktionen haben keine Laufzeitabhängigkeit von einem externen Dienst.

## Veröffentlichung

Da das Projekt statisch ist, kann GitHub Pages direkt `index.html` aus dem Repository-Stamm ausliefern. Eine eigene Build-Pipeline ist nicht erforderlich. Hinweise dazu stehen in [GITHUB-PAGES.md](GITHUB-PAGES.md).
