# Daten im Projekt

Die bisherigen Demo-Daten der Webapp sind in `index.html` eingebettet. Der historische KI-Rücktest liegt zusätzlich als `../prognosen.json` vor und wird von `../historical-prognosen.js` nur für die Rückblicksansicht geladen. `../printpilot_prognose.json` ist ein anderer Export für einen späteren Zeitraum und wird nicht mit dem Rücktest vermischt.

Die Kennzahlen wurden aus den bereitgestellten CSV-Dateien aufbereitet. Um den Umfang des GitHub-Pakets klein zu halten und Rohdateien nicht ungeprüft weiterzugeben, enthält dieser Ordner keine Original-CSV-Dateien. Der Abgleich, die verwendeten Einheiten und die Abgrenzung zwischen CSV- und Pseudo-Daten sind in [../docs/DATENMODELL-UND-AUDIT.md](../docs/DATENMODELL-UND-AUDIT.md) dokumentiert.

Für den historischen Rücktest werden Datumsbereich, Anzahl, eindeutige Produkt-Tage und Stückwerte beim Laden geprüft. Eine spätere Verbindung zu aktueller Einkaufsplanung erfordert eine verifizierte Zuordnung von Produkt-ID zu Material und Gramm je Stück.
