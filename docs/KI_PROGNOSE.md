# KI-Prognose und interaktive Vorführung

Stand: 27.10.2026. Einstieg: `index.html` im Projektordner per Doppelklick öffnen. Es ist keine Installation und kein Internet nötig. Die vollständige HTML-Datei enthält Daten, Gestaltung und JavaScript. Auf der Übersicht „KI-Szenario starten“ oder links „Bedarfsprognose“ wählen.

## Vorführablauf

1. Basisplanung zeigen: genau vier Wochen vom 22.10. bis 18.11.2026, 14.775 nachgefragte Stück, 1.114,6 kg Bedarf einschließlich 5 % Materialaufschlag. Die Reserve beträgt 3 kg je Material. Der zusätzliche Versorgungsvorschlag beträgt 425 kg; acht Materialien haben im Verlauf eine Fehlmenge. Die frühere 30-Tage-Ansicht bleibt über die Zeitraum-Auswahl erreichbar.
2. „Nachfrage +50 %“ wählen: Die auf Artikel und Tag gerundete Nachfrage steigt für vier Wochen auf 22.241 Stück und 1.677,9 kg; der Zusatzvorschlag steigt auf 959 kg. Das sind Szenario-Annahmen und keine gelernten Werbeeffekte.
3. „Lieferung +14 Tage“ und „Bestand nur 25 %“ vergleichen. Die Basislinie bleibt als Vergleich erhalten.
4. 60 oder 90 Tage und ein einzelnes Material wählen. Alternativ einen Materialnamen in der Tabelle anklicken, etwa PLA Rot. Das Diagramm zeigt dann diese Variante statt einer Summe über unterschiedliche Materialien.
5. Regler kombinieren. Filamentaufschlag und Reserve verändern die Materialplanung; sie verändern nicht die gespeicherte KI-Prognose.
6. Ein Szenario zur Prüfung vormerken. Bei jeder Änderung wird dieser Vermerk zurückgesetzt. „Einkaufsliste als CSV“ exportiert die gewählten Annahmen, Mengen und Termine. Es wird keine Bestellung angelegt.
7. Artikelaufschlüsselung und Modellerklärung öffnen. „Zurücksetzen“ stellt alle Basiswerte einschließlich Horizont und Materialfilter wieder her.

## Verwendete Quellen und Abgleich

- `PrintPilot-GitHub/index.html`: Ausgangsoberfläche mit Übersicht, Materialbestand, Einkaufsplanung, Bestellungen, Kundenaufträgen und Flotte. Die bisherige monatliche Regression und ihre Prognosetabellen wurden durch den neuen Simulator ersetzt. Ein fehlendes Skript-Ende im übernommenen Kundenstatus-Code wurde repariert. Die extern nachgeladenen Schriftarten wurden entfernt.
- `printpilot_prognose.json` aus dem Prognosepaket beziehungsweise dem GitHub-Anhang: unverändert übernommener Inhalt innerhalb von `app/forecast-data.json`. Die beiden gelieferten JSON-Inhalte wurden auf Gleichheit geprüft. 1.080 Tageswerte = 90 Tage × zwölf Artikel. Die 30/60/90-Tage-Summen werden automatisiert mit den gelieferten Summen je Artikel abgeglichen.
- `Verkaeufe.csv`: fünfjährige Nachfragehistorie, 22.10.2021–21.10.2026, 1.826 Tage. Ziel des mitgelieferten Trainingsskripts ist `nachfrage_sim_stueck`, also Verkäufe plus nicht bediente Nachfrage. Die komplette Verkaufshistorie ist für die statische Vorführung nicht nötig und wurde nicht zusätzlich kopiert.
- `Produkte.csv` und `Materialien.csv`: Artikel-Material-Zuordnung, Produktgewicht und Standardlieferzeit. Die Stückgewichte liegen zwischen 20 und 170 g. Es wird nicht der frühere statistische kg-Faktor aus verkauften Stücken übernommen.
- `Lager.csv`: letzter vollständiger Stand vom 21.10.2026, zusammen 1.059,375 kg einschließlich der dokumentierten Druckerbestände.
- `Einkauf.csv`: 19 offene Bestellungen, zusammen 514 kg. Davon sind zum festen Simulationsstart bereits 225 kg überfällig. Für diese Bestellungen wird kein neuer Liefertermin erfunden; sie werden im Szenario nicht als sicherer Zugang gerechnet. Die übrigen 289 kg werden nach geplantem Datum plus Szenarioverzug angesetzt, soweit sie im Horizont liegen.
- `PrintPilot_Datenbasis.xlsx`: Tabellen und erste Datensätze der fünf Arbeitsblätter gelesen und mit der Oberfläche eingeordnet. Sie enthält eine frühere vierwöchige Regressionsplanung und Kundendemodaten; die Spalte „Reserviert_kg“ entspricht in Beispielen Mengen der Druckerbestände. Ohne fachliche Klärung wird sie deshalb nicht zusätzlich von den kanonischen CSV-Beständen abgezogen. Diese Arbeitsmappe liefert keine zusätzlichen Trainingsbeobachtungen.
- `PrintPilot_Pseudodaten_5_Jahre.xlsx`: Struktur und erste Datensätze aller elf Arbeitsblätter gelesen. Verkäufe und Lager sind dort monatlich aggregiert; für die tägliche Bestandsplanung werden die mitgelieferten CSVs verwendet. Beide Arbeitsmappen bleiben unverändert.

Die 38 ergänzten Materialvarianten und 300 zusätzlichen Druckerplätze der gelieferten Oberfläche sind nicht Teil des KI-Simulators. Die übrigen Seiten behalten ihre vorhandene, getrennte Bestands- und Einkaufslogik. Kundenempfehlungen beziehen sich auf die feste 30-Tage-KI-Basis und folgen nicht den Szenarioreglern. Der Simulator speichert seine Annahmen nicht dauerhaft.

## Modell und Qualität

Das mitgelieferte Python-Skript liegt unverändert unter `model/prognose.py`, seine Paketliste unter `model/requirements.txt`. Es trainiert einen `HistGradientBoostingRegressor` mit Poisson-Ziel, 120 Iterationen und Nachfrageverzögerungen von 1/7/14/28 Tagen, gleitenden Mittelwerten sowie Kalender- und Artikelmerkmalen. Der Browser benötigt Python nicht und führt kein Training aus.

Die exportierten Kennzahlen stammen aus dem mitgelieferten Modelllauf und wurden für diese Integration nicht durch erneutes Training reproduziert. Validierung: 25.04.–23.07.2026; unabhängiger Test: 24.07.–21.10.2026. Die Prognose wird jeweils rekursiv ohne spätere Ist-Werte erzeugt.

| Unabhängiger Test | Modell-WAPE | Wochen-Baseline-WAPE |
| --- | --- | --- |
| 30 Tage | 19,94 % | 22,81 % |
| 60 Tage | 21,03 % | 23,69 % |
| 90 Tage | 21,81 % | 26,37 % |

Der relative Vorteil im 90-Tage-Test beträgt rund 17,3 %. Der im Konzept vorgeschlagene Höchstfehler von 20 % wird mit 21,81 % überschritten. Ein bestandener PoC oder reale Modellgüte wird daher nicht behauptet. WAPE ist keine Trefferwahrscheinlichkeit. Es handelt sich um synthetische Daten und einen eingefrorenen Vorführstand. Der Browser zeigt keine aktuelle Vorhersage ab dem heutigen Datum an.

## Rechenregeln und Annahmen

Annahme für den Pitch: Alle dokumentierten Lager- und Druckerbestände sind verfügbar. Verbindliche Reservierungen, Produktionskapazität und Auftragsüberschneidungen sind nicht modelliert. Der Materialaufschlag ist ein Zuschlag auf das Produktgewicht, kein Bruttoausschuss-Divisor.

Pro Artikel und Tag: `Szenario_Stück = rund(KI_Stück × Nachfragefaktor)`. Danach `kg = Stück × Produktgewicht_g × (1 + Aufschlag/100) / 1000`. Alle Summen gehen aus diesen gerundeten Tageswerten hervor; deshalb kann eine +50-%-Einstellung geringfügig von 1,5 × der aggregierten Basismenge abweichen.

Je Material: Startbestand ist `(Lager + Drucker) × Bestandsfaktor`. Geplante Zugänge werden am Tag des Eingangs vor dem Tagesverbrauch gerechnet. Die Überfälligkeit wird am festen Simulationsstart beurteilt und durch einen Verzug-Regler nicht nachträglich aufgehoben. Negative Tagessalden sind kumulierter ungedeckter Bedarf, keine physisch negativen Lagermengen.

Zusatzmenge: `aufrunden(max(0, Reserve − tiefster Tagesendsaldo))` in ganzen 1-kg-Spulen. Es zählt die größte Lücke im Verlauf, nicht allein die Endmenge. Der Vorschlag setzt rechtzeitigen Eingang voraus und wird nicht bereits als fiktiver Zugang in die Grafik addiert. „Bestellen bis“ ist der erste Reservebruch minus Standardlieferzeit minus Szenarioverzug. Liegt dieser Termin vor dem Simulationsstart, fordert die Anzeige Expresslieferung oder Umplanung zur Prüfung an.

Die Gesamtgrafik summiert verschiedene Materialien nur zur Übersicht. Fehlmengen, Reserven und Bestellmengen werden je Material berechnet; überschüssiges TPU gleicht fehlendes rotes PLA nicht aus. Kein statistisches Unsicherheitsintervall wird erfunden.

## Quellenaufbau und Aktualisierung

- `app/presentation-base.html`: übernommene und gezielt angepasste Ausgangsoberfläche.
- `app/forecast-data.json`: kanonische Prognose, zwölf Artikel, zwölf Materialbestände, offene Bestellungen.
- `app/forecast-model.js`: reine Szenario- und Bestandsrechnung.
- `app/forecast-panel.html`, `app/forecast-ui.js`, `app/forecast.css`: Oberfläche.
- `tools/build-presentation.mjs`: bettet diese Quellen vollständig in die `index.html` im Projektordner ein. Aufruf: `npm run build`.
- `tools/prepare_forecast.py`: einmaliger Import beziehungsweise erneuter Import aus denselben Quellformaten mit den Argumenten `--csv-dir`, `--forecast` und `--html`. Die Originaldateien werden nicht verändert.
- `model/prognose.py`: erneutes Training aus vollständigen täglichen Nachfrage-CSV-Daten. Nach einem neuen Lauf sind auch neue Bestände und Bestelltermine auf denselben Stichtag abzugleichen und neu zu importieren.

`npm start` dient die neue Einzeldatei unter `/` aus; die ursprüngliche kleine Demo bleibt unter `/app/index.html`. Projektunterlagen und Trainingsskripte werden nicht vom lokalen Server ausgeliefert. Keine Bibliothek wurde installiert; keine Online-Veröffentlichung, Bestellung, Commit oder Push wurde ausgeführt.

## Ergänzung vom 30.10.2026

Diese Fassung wurde als Änderungsvorschlag für das bestehende GitHub-Dashboard mit dem historischen Rückblick aus `prognosen.json` zusammengeführt. Die KI-Simulation verwendet weiterhin die vorberechneten Gradient-Boosting-Werte ab 22.10.2026. Der Rückblick Januar–März 2026 stammt aus einem getrennten Random-Forest-Modell und beeinflusst weder die Simulation noch Kundenaufträge. `npm start` liefert nun auch `prognosen.json` aus; `npm run build` bettet das Rückblickskript in `index.html` ein. Die oben dokumentierten damaligen Aussagen über fehlenden Commit oder Push beziehen sich auf den Stand vom 27.10.2026.

Die zusammengeführte Fassung liegt inzwischen auf `main`. Für die Vorführung ist jetzt **4 Wochen (28 Tage)** als Standard gewählt. Sie beginnt ausdrücklich am fiktiven Simulationsstart 22.10.2026 nach dem Datenstand 21.10.2026. Das ist keine rollierende Prognose ab dem heutigen Kalendertag. Die Kundenaufträge nutzen weiterhin die unveränderte 30-Tage-KI-Basis. Die 28-Tage-Summen werden aus den ersten 28 vorberechneten Tageswerten gebildet; die vorhandenen 30/60/90-Tage-Summen bleiben als Kontrollwerte erhalten.
