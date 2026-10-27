# PrintPilot-Webapp

Stand: 2026-10-27

## Zweck

Die Webapp demonstriert, wie Materialbestand, offene Bestellungen, Verbrauch und eine vierwöchige Bedarfsprognose zusammen betrachtet werden können. Sie unterstützt die Planung. Eine Bestellung wird nicht automatisch ausgelöst.

## Bereiche

- **Übersicht:** zentrale Kennzahlen, Verbrauch, Bestand, Bestellungen und Projektziele.
- **Bedarfsprognose:** vier Wochen; Produkte und Farben mit prognostizierten Filamentmengen in kg. Die Ansicht enthält außerdem saisonale Produktideen und qualitative Hinweise aus externen 3D-Modellmarktplätzen.
- **Lagerbestand:** Materialtyp und Farbe einzeln; zeigt Lagerbestand, Material an Druckern, Gesamtbestand und offene Bestellmengen.
- **Einkaufsplanung:** berechnet Vorschläge aus Verbrauch, Lagerbestand, Material an Druckern und offenen Bestellungen. Eigene Bestellmenge, Abweichung und umkehrbarer Prüfstatus sind vorhanden.
- **Bestellungen:** erwartetes Lieferdatum und Eingangsdatum. Ein erfasster Eingang kann den Bestand in der Browser-Sitzung fortschreiben.
- **Kundenaufträge:** fünf anonymisierte Beispieldatensätze ohne Namen oder Kontaktdaten; Artikel, Menge, Filamentbedarf, Wunschliefertermin und manuell änderbarer Status.
- **Druckerflotte:** Drucker- und Materialansicht mit ergänzten Beispielplätzen.
- **5-Jahres-Daten:** Datensicht und Erläuterungen zu den eingebetteten Ausgangs- und Beispieldaten.

## Status-Empfehlung

Die Kundenauftragsansicht gleicht den Filamentbedarf eines Auftrags mit verfügbarem Lager- und Druckerbestand ab. Sie berücksichtigt offene Bestellungen und die interne 4-Wochen-Prognose für denselben Materialtyp und dieselbe Farbe.

- Reicht der aktuelle Bestand für den Auftrag, lautet der Vorschlag **In Planung**. Die Begründung nennt verfügbaren Bestand und voraussichtlichen Rest.
- Reicht der Bestand noch nicht, lautet der Vorschlag **Wartet auf Material**. Die Begründung zeigt die Lücke und ob offene Bestellungen diese rechnerisch decken. Ein voraussichtlicher Liefertermin wird genannt, soweit Daten dafür vorliegen.
- Die Prognose zeigt zusätzlich, ob der Restbestand den erwarteten Bedarf der kommenden vier Wochen abdeckt.
- Mit **Empfehlung übernehmen** kann der Vorschlag ins Statusfeld übertragen werden. Statuswerte lassen sich auch unabhängig davon ändern; ein eigener Statustext ist möglich.

Die Empfehlung ist eine nachvollziehbare Berechnung aus den eingebetteten App-Daten. Es gibt kein selbstlernendes Modell, keine Live-Datenquelle und keine Prüfung, ob die Produktion tatsächlich begonnen hat.

## Beispieldaten und Datenschutz

Die fünf Kundenaufträge sind anonymisiert und enthalten keine Kundennamen oder Kontaktinformationen. Es gibt keine angebundene Kundenquelle. Die weiteren Daten enthalten teilweise Projekt-Ausgangsdaten und ergänzte Pseudowerte; sie sind keine vollständige Produktivdatenbank.

## Grenzen

Die Anwendung ist eine statische Einzeldatei. Sie hat kein Backend, keine Anmeldung und keine gemeinsame Datenbank. Gespeicherte Eingaben bleiben in dem Browser und auf dem Gerät, in dem sie vorgenommen wurden. Es gibt keine automatische Synchronisierung oder Sicherung. Die Regressionsprognose ist ein Demonstrator und keine selbstlernende Echtzeit-KI.
