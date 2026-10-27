# Datenmodell

Die App verarbeitet eingebettete Beispiel- und Ausgangsdaten. Die Bezeichnungen unten beschreiben die fachlichen Felder, keine produktive Datenbank.

| Entität | Wichtige Felder | Zweck |
| --- | --- | --- |
| Materialbestand | Material-ID, Typ, Farbe, Lagerbestand, Druckerbestand, offener Zugang, Lieferant | Bestand und Verfügbarkeit je Material-Farb-Kombination |
| Verbrauchshistorie | Material-ID, Jahr, Monat, Verbrauch in Gramm | Grundlage für Verbrauchs- und Bedarfsprognosen |
| Verkaufsverlauf | Material-ID, Jahr, Monat, Stückzahl und Umsatz | Historische Verkaufswerte und saisonale Muster |
| Einkaufsbestellung | Bestellnummer, Material-ID, Menge, Bestelldatum, geplantes Lieferdatum, Eingangsdatum, Status | Offene und eingegangene Materialzugänge |
| Kundenauftrag | Auftragsnummer, Auftragsdatum, Artikel, Stückzahl, Materialtyp, Farbe, Filamentbedarf in kg, Wunschlieferdatum, Status | Anonymisierte Beispielaufträge ohne Namen oder Kontaktangaben |
| Druckerplatz | Drucker-ID, Material-ID, Status, Restmenge | Material in der Druckerflotte; zusätzliche Plätze können Beispieldaten sein |
| Prognose | Material-ID, Materialtyp, Farbe, Zeitraum, prognostizierte Stück und Gramm | Interne Vier-Wochen-Prognose und Erklärung im Dialog |

## Beziehungen

- Material-ID verbindet Lagerbestand, Verbrauch, Verkäufe, Bestellungen und Prognose.
- Kundenaufträge referenzieren Materialtyp und Farbe; die Empfehlung sucht dazu die passende Material-Farb-Zeile.
- Ein offener Einkauf erhöht den erwarteten Zugang, aber nicht den bereits vorhandenen Bestand, bis ein Eingang erfasst wurde.
- Die Status-Empfehlung vergleicht verfügbaren Bestand plus offene Zugänge mit dem Kundenauftragsbedarf und ergänzt den prognostizierten Bedarf der nächsten vier Wochen.

## Beispielaufträge

| Auftragsnummer | Artikel | Material | Menge | Bedarf | Wunschtermin |
| --- | --- | --- | ---: | ---: | --- |
| KA-2026-001 | Pflanzenstecker-Set | PLA Grün | 120 Stück | 6,0 kg | 06.11.2026 |
| KA-2026-002 | Weihnachtsanhänger-Set | PLA Rot | 80 Stück | 4,8 kg | 04.11.2026 |
| KA-2026-003 | Kabelhalter | PETG Schwarz | 250 Stück | 18,8 kg | 10.11.2026 |
| KA-2026-004 | Schreibtisch-Organizer | PLA Weiß | 60 Stück | 14,4 kg | 12.11.2026 |
| KA-2026-005 | Flexi-Rentier | TPU Rot | 100 Stück | 7,0 kg | 02.11.2026 |

Alle Aufträge sind Beispieldaten. Es sind keine realen Kundennamen oder Kontaktdaten hinterlegt.
