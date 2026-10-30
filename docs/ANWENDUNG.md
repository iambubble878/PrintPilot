# Bedienungsanleitung

## Navigation

Die linke Navigation öffnet die Bereiche Übersicht, Bedarfsprognose, Lagerbestand, Einkaufsplanung, Bestellungen, Kundenaufträge, Druckerflotte und 5-Jahres-Daten. Auf kleinen Bildschirmen lässt sich die Navigation über die Menütaste öffnen.

## Aktive KI-Simulation

In **Bedarfsprognose** zeigt der obere Bereich standardmäßig die vier Wochen vom 22.10. bis 18.11.2026, gerechnet aus dem fiktiven Datenstand 21.10.2026. Alternativ kannst du 30, 60 oder 90 Tage und bei Bedarf ein Material wählen. Die Regler verändern nur die Szenario-Annahmen für Nachfrage, Startbestand, Lieferverzug, Materialaufschlag und Reserve. Die gespeicherten KI-Werte selbst werden dadurch nicht neu berechnet. Die Kundenaufträge verwenden weiterhin die feste 30-Tage-Basisprognose und folgen den Reglern nicht. Einzelheiten und Grenzen stehen in [KI_PROGNOSE.md](KI_PROGNOSE.md).

## Historische KI-Prognose prüfen

In **Bedarfsprognose** steht der Rückblick für Januar bis März 2026. „Alle 12 Produkte“ zeigt die gesamte Datei; die Produktauswahl zeigt die 90 Tageswerte eines Artikels. Die Karten und Tabellen unterscheiden prognostizierte und tatsächliche Stückzahlen. Die Abweichung ist Prognose minus Ist. Der mittlere absolute Fehler mittelt die absoluten Tagesfehler über die angezeigten Produkt-Tage.

Auf der [Online-Seite](https://iambubble878.github.io/PrintPilot/) lädt die Ansicht `prognosen.json` automatisch. Wenn `index.html` direkt als lokale Datei geöffnet wurde, kann die Datei über **JSON-Datei auswählen** geladen werden. Die Werte sind ein historischer Test und ändern keine aktuelle Einkaufsliste.

## Lagerbestand und Historie

Die Lagerübersicht listet Materialtyp und Farbe einzeln. Die Mengen unterscheiden Zentrallager, Material in Druckern, Gesamtbestand und offene Bestellungen. Die Suche und der Materialfilter schränken die Tabelle ein.

Auf eine Materialzeile klicken oder sie mit Enter auswählen, um die Verbrauchs- und Bestellhistorie zu öffnen. Die Historie stellt das aktuelle und das vorherige Jahr gegenüber. Pseudo-Materialien haben keine echte CSV-Historie.

## Einkaufsplanung

Die Tabelle zeigt die elf Material-Farb-Kombinationen mit der kürzesten Reichweite. Sie enthält Bestand, offene Bestellungen, 30-Tage-Bedarf, Reichweite, Vorschlag und Lieferanteninformation.

1. Der Vorschlag deckt 30 Tage plus materialabhängige Lieferzeit (10, 11 oder 16 Tage), 5 % Ausschuss und 3 kg Sicherheitsbestand ab. Lagerbestand, reale Druckerplätze und noch offene Bestellungen werden abgezogen. Die Menge wird auf 1-kg-Spulen aufgerundet.
2. Im Feld **Eigene Menge (kg)** kann die gewünschte Bestellmenge eingetragen werden.
3. **Abweichung (kg)** berechnet eigene Menge minus Vorschlag. Beispiel: Vorschlag 11 kg, eigene Menge 10 kg ergibt −1 kg.
4. **Prüfen** markiert die Position als **Geprüft**. Erneutes Klicken nimmt die Markierung zurück. Eine Mengenänderung setzt den Prüfstatus ebenfalls zurück.
5. **Einkaufsliste exportieren** lädt alle elf Positionen samt Vorschlag, eigener Menge, Abweichung und Prüfstatus als CSV herunter.

Der Prüfstatus ist eine interne Markierung in der Webapp. Er löst keine Bestellung aus.

## Speichern im Browser

Eigene Mengen und Prüfstatus werden im `localStorage` des verwendeten Browsers abgelegt. Sie werden nicht mit anderen Geräten synchronisiert. Beim Löschen der Browserdaten können sie verloren gehen. Der CSV-Export dient zum Übertragen der aktuellen Liste.

## Druckerflotte

Jeder der 100 Drucker zeigt vier Materialplätze. Der erste Platz basiert auf der bereitgestellten Druckerliste; die weiteren drei Plätze sind als Pseudo-Bestückungen ergänzt, weil die Quelle nur eine Materialposition je Drucker enthält.


## Bedarfsprognose erklären und übernehmen

Die folgenden Funktionen beschreiben die ältere 4-Wochen-Regressionsansicht. Sie ist im zusammengeführten Hauptdashboard ausgeblendet und steuert die aktive KI-Simulation nicht.

- Die Farbprognose trennt gleiche Farben nach Filamenttyp (z. B. PLA Schwarz und PETG Schwarz). Auch die Produktprognose zeigt Filamenttyp, Farbe, Stückzahl und kg Filament für die nächsten vier Wochen.
- Die Saisonübersicht enthält zehn Artikel: zwei mit interner Verkaufshistorie und berechneten Mengen sowie acht neue Ideen ohne Absatzhistorie. Für Ideen werden keine Absatz- oder kg-Werte erfunden.
- Die externen Marktplatz-Trends zeigen zehn qualitative Artikelideen samt möglichem Filamenttyp und Farbe. Sie basieren auf öffentlichen Such-/Popularitätssignalen und werden nicht als interne Verkaufsprognose gerechnet.
- Klicken Sie eine Zeile an oder fokussieren Sie sie mit der Tastatur und drücken Sie Enter/Leertaste. Der Dialog erläutert Modell, zeitlichen Trend, Monatsfaktoren, Vorjahresreferenz und Rücktest.
- „Zur Einkaufsplanung hinzufügen“ übernimmt die prognostizierte Filamentmenge auf volle 1-kg-Spulen gerundet. Ist das Material bereits in der Einkaufsplanung, wird die vorgeschlagene Menge erhöht. Fehlt es, wird die Materialzeile ergänzt.
- Das ist ein Planungsvorschlag und löst keine externe Bestellung aus.


## Kundenaufträge

Die fünf Auftragszeilen sind anonymisierte Beispieldaten; Kundennamen oder Kontaktdaten sind nicht enthalten. Der Status lässt sich je Zeile über ein Auswahlfeld ändern. Es stehen die Optionen „Neu eingegangen“, „In Planung“, „In Bearbeitung“, „Wartet auf Material“, „Versandbereit“, „Abgeschlossen“ und „Storniert“ bereit. Über „Eigener Status …“ kann ein freier Status eingetragen werden. Änderungen werden lokal im Browser gespeichert.

Die KI-Status-Empfehlung vergleicht den Materialbedarf des Auftrags mit dem verfügbaren Lager- und Druckerbestand sowie offenen Bestellungen. Zusätzlich fließt die feste 30-Tage-KI-Basisprognose für dasselbe Material und dieselbe Farbe ein. Die Begründung nennt verfügbare, offene und prognostizierte Mengen. Ein Klick auf **Empfehlung übernehmen** trägt den vorgeschlagenen Status in das manuell änderbare Statusfeld ein. Die Empfehlung prüft keine echte Produktionsaufnahme und ist kein selbstlernendes Live-Modell.
