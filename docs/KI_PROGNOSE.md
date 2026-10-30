# Random-Forest-Prognose und Vorführung

Stand: 30.10.2026. Die [PrintPilot-Onlineversion](https://iambubble878.github.io/PrintPilot/) zeigt zwei **getrennte** Random-Forest-Läufe:

1. **Vier-Wochen-Simulation oben:** Ein neu trainierter Random Forest nutzt die fünfjährige fiktive Nachfrage bis 21.10.2026 und prognostiziert täglich zwölf Artikel ab 22.10.2026. Die ersten 28 Tage bis 18.11.2026 sind der Standard. Diese Werte steuern den Materialbedarf und die Szenarien.
2. **Historischer Rückblick unten:** Die eigenständige Datei `prognosen.json` zeigt Random-Forest-Prognosen und spätere Ist-Werte für Januar bis März 2026. Ihr Training endete am 31.12.2025. Dieser Rückblick steuert weder die Vier-Wochen-Simulation noch die Kundenaufträge. Sein MAE von 5,83 Stück ist kein Qualitätswert des neu trainierten Modells.

Die Webseite trainiert beim Öffnen kein Modell. Die Vorhersage basiert auf einem festen fiktiven Datenstand und verschiebt sich nicht automatisch mit dem heutigen Datum.

## Daten und Training der Vier-Wochen-Simulation

Die Quelle ist `Verkaeufe.csv` aus `PrintPilot_Pseudodaten_5_Jahre` mit 1.826 vollständigen Tagen vom 22.10.2021 bis 21.10.2026 und zwölf Artikeln. Ziel ist `nachfrage_sim_stueck` = verkaufte plus nicht bediente Stücke. Das Trainingsskript `model/prognose.py` prüft fehlende, doppelte und widersprüchliche Zeilen und verwendet nur Daten vor dem jeweiligen Prognosestart. Der SHA-256-Hash der verwendeten CSV steht in `printpilot_prognose.json` unter `source.csv_sha256`.

Verwendet wird `scikit-learn RandomForestRegressor` mit 120 Bäumen, maximaler Tiefe 14, mindestens vier Beobachtungen pro Blatt, `max_features=0.7` und festem Zufallsstart 42. Merkmale sind die Nachfrage von vor 1, 7, 14 und 28 Tagen, Mittelwerte über 7 und 28 Tage, Wochentag, Monat, Jahresverlauf und Artikelkennung. Für spätere Prognosetage fließen eigene vorhergesagte Werte ein; zukünftige Ist-Werte, Preise oder Aktionen werden nicht verwendet.

Das Skript erzeugt `printpilot_prognose.json` mit 90 Tagen × zwölf Artikeln. Dieselbe Prognose ist in `app/forecast-data.json` eingebettet. Dazu kommen Artikelgewichte und Materialzuordnung aus `Produkte.csv` und `Materialien.csv`, der Bestandsstand aus `Lager.csv` und offene Eingänge aus `Einkauf.csv`. Die 38 ergänzten Materialvarianten und 300 zusätzlichen Druckerplätze der übrigen Oberfläche gehen nicht in die Simulation ein. Die vollständige Verkaufs-CSV und eine trainierte Modelldatei werden nicht im Repository veröffentlicht.

## Qualität: zeitlich getrennter Rücktest

Validierung: 25.04.–23.07.2026. Unabhängiger Test: 24.07.–21.10.2026. Für jeden Start wurde ausschließlich mit früheren Tagen trainiert und danach rekursiv vorhergesagt. WAPE ist die Summe der absoluten Stückfehler geteilt durch die tatsächliche Nachfrage. Der Vergleichswert wiederholt rekursiv den gleichen Wochentag.

| Testhorizont | Random-Forest-WAPE | Wochenvergleich-WAPE |
| --- | ---: | ---: |
| 28 Tage | 19,97 % | 22,83 % |
| 30 Tage | 20,11 % | 22,81 % |
| 60 Tage | 20,90 % | 23,69 % |
| 90 Tage | 21,92 % | 26,37 % |

Der vorgeschlagene Richtwert von 20 % wird im 28-Tage-Test knapp eingehalten, bei längeren Horizonten überschritten. Das sind Ergebnisse für synthetische Daten und keine garantierte Güte bei echten Verkäufen. Die Anzeige unter „Random Forest für die Vorführung“ folgt dem ausgewählten Zeitraum. Die Kennzahlen des Rückblicks Januar–März 2026 stammen aus einem anderen Modelllauf und sind nicht direkt vergleichbar.

## Vier-Wochen-Vorführung

Bei **Basisplanung** zeigt die Seite für 22.10.–18.11.2026 insgesamt 14.097 nachgefragte Stück, 1.078,7 kg Filamentbedarf einschließlich 5 % Materialaufschlag und 392 kg zusätzliche Versorgung zur Prüfung. Neun Materialien haben im Verlauf eine Fehlmenge. Bei **Nachfrage +50 %** sind es nach Rundung je Artikel und Tag 21.235 Stück, 1.624,9 kg Filament und 907 kg Zusatzmenge. Diese Änderung ist eine Szenario-Annahme und kein neu trainierter Werbeeffekt.

Die Regler ändern Nachfragefaktor, Startbestand, Lieferverzug, Materialaufschlag oder Sicherheitsbestand für die gezeigte Rechnung. Pro Artikel und Tag gilt `Szenario-Stück = rund(Random-Forest-Stück × Nachfragefaktor)`; der Filamentbedarf ist `Stück × Produktgewicht_g × (1 + Aufschlag/100) / 1000`. Materialmengen verschiedener Farben ersetzen einander nicht. Geplante Eingänge werden am Liefertag vor dem Verbrauch angesetzt; zum Simulationsstart überfällige Bestellungen zählen nicht als sichere Zugänge. Zusatzmenge ist die auf ganze 1-kg-Spulen aufgerundete größte Lücke zur Reserve im Zeitraum.

Die übrigen Seiten bleiben auf ihrem Ausgangsstand. **Kundenaufträge** verwenden eine feste 30-Tage-Basis derselben neu trainierten Random-Forest-Prognose; die Szenarioregler wirken dort nicht. Es werden keine Bestellungen ausgelöst. Eigene Mengen und Prüfstatus liegen nur im jeweiligen Browser.

## Aktualisierung

Für einen anderen fiktiven Stichtag müssen Nachfrage, Bestände und offene Bestellungen gemeinsam fortgeschrieben werden. Danach `model/prognose.py` mit der vollständigen täglichen `Verkaeufe.csv` neu ausführen, die Prognose in `app/forecast-data.json` übernehmen, `npm run build` und `npm test` ausführen und die resultierende `index.html` veröffentlichen. Ein bloßes Umbenennen des Datums würde keine neue Prognose erzeugen.
