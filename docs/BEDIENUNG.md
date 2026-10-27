# Bedienungsanleitung

## Start

1. `index.html` im Browser öffnen oder im Repository-Ordner einen lokalen Server starten: `python -m http.server 8000`.
2. Bei lokalem Server `http://localhost:8000` öffnen.
3. Links den gewünschten Bereich auswählen. Auf kleinen Bildschirmen öffnet die Menütaste die Navigation.

## Lagerbestand

Die Lagerübersicht trennt Materialtyp und Farbe. Bestand im Zentrallager, Material an Druckern und offene Bestellungen werden als getrennte Mengen angezeigt. Eine Materialzeile lässt sich öffnen, um Verbrauchs- und Bestellhistorie einzusehen.

## Einkaufsplanung

Die Vorschläge verbinden den Materialbedarf mit Bestand, Druckerplätzen und offenen Bestellungen. Eine eigene Menge kann eingetragen werden; die Abweichung zum Vorschlag wird daneben berechnet. **Prüfen** schaltet den Prüfstatus um. Die Einkaufsliste kann als CSV exportiert werden. Die App löst keine Bestellung aus.

## Bestellungen und Wareneingang

Die Bestellung öffnen und das geplante Lieferdatum ansehen. Nach dem tatsächlichen Eingang ein Eingangsdatum eintragen. Die Änderung wird lokal im Browser gespeichert; die App kann die Menge dem Lagerbestand zurechnen, wenn sie beim nächsten Öffnen den Eingang verarbeitet.

## Kundenaufträge und Status-Empfehlung

1. **Kundenaufträge** in der Navigation öffnen.
2. Je Auftrag die KI-Status-Empfehlung und den Erklärungstext lesen. Die Begründung zeigt verfügbaren Bestand, offenen Zugang und prognostizierten Vier-Wochen-Bedarf.
3. **Empfehlung übernehmen** anklicken, wenn der Vorschlag passt. Damit wird das Statusfeld geändert; die App bestellt nichts automatisch.
4. Den Status jederzeit über das Auswahlfeld ändern. Für eigene Formulierungen **Eigener Status …** auswählen und den Text eingeben.
5. Statusänderungen bleiben in diesem Browser gespeichert.

Die Empfehlung bewertet die Materialseite. Sie weiß nicht, ob die Fertigung begonnen hat oder abgeschlossen ist. Bitte reale Abläufe weiterhin manuell prüfen.

## Bedarfsprognose

Die Prognose gilt für die kommenden vier Wochen. Eine Prognosezeile kann geöffnet werden, um die Modell-Erklärung anzusehen. Prognostizierte Filamentmengen werden in kg angezeigt. Eine Übernahme in die Einkaufsplanung ist ein Vorschlag und keine ausgelöste Bestellung.

## Lokale Speicherung

Einkaufswerte, Prüfstatus, Eingangsdatumsangaben und Kundenauftragsstatus werden lokal im jeweiligen Browser abgelegt. Sie erscheinen nicht automatisch auf einem anderen Gerät. Browserdaten können durch das Löschen des Website-Speichers entfernt werden.
