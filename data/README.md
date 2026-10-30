# Daten im Projekt

Die vorberechneten Tageswerte des aktiven KI-Simulators liegen als bearbeitbare Quelle in `../app/forecast-data.json` und sind in `../index.html` eingebettet. `../printpilot_prognose.json` enthält den zugrunde liegenden separaten Prognoseexport für Oktober 2026 bis Januar 2027. Der historische Random-Forest-Rücktest liegt als `../prognosen.json` vor und wird nur für die Rückblicksansicht geladen. Beide Zeiträume und Modelle werden nicht vermischt.

Die Kennzahlen wurden aus den bereitgestellten CSV-Dateien aufbereitet. Um den Umfang des GitHub-Pakets klein zu halten und Rohdateien nicht ungeprüft weiterzugeben, enthält dieser Ordner keine Original-CSV-Dateien. Der Abgleich, die verwendeten Einheiten und die Abgrenzung zwischen CSV- und Pseudo-Daten sind in [../docs/DATENMODELL-UND-AUDIT.md](../docs/DATENMODELL-UND-AUDIT.md) dokumentiert.

Für den historischen Rücktest werden Datumsbereich, Anzahl, eindeutige Produkt-Tage und Stückwerte beim Laden geprüft. Der aktive Simulator verwendet eine gesondert dokumentierte Produkt-Material-Zuordnung und Gramm je Stück aus dem älteren Projekt-ZIP. Diese Zuordnung ist für den Pseudodaten-Demonstrator bestimmt und muss vor echten Bestellentscheidungen fachlich bestätigt werden.
