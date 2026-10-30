# Datenmodell und Zahlenabgleich

## Zeitraum und Umfang

- **CSV-Abgleich:** 22.10.2021 bis 21.10.2026; Oktober 2021 und Oktober 2026 sind Teilmonate.
- **Monatswerte:** 732 Zeilen = 61 Monate × 12 Material-IDs.
- **Originalmaterialien:** 12 Material-Farb-Kombinationen.
- **Drucker:** 100; die Quelle dokumentiert je Drucker eine Materialposition.
- **Einkauf:** 2.227 Bestellungen, davon 2.208 geliefert und 19 offen.

## Einheiten

Verbrauch und Druckermengen werden intern in Gramm geführt. In Tabellen werden Mengen meist in Kilogramm angezeigt. Einkaufsdaten enthalten Spulenmengen; die offene Menge wird für den Lagerabgleich nicht als Wareneingang gezählt. Für die Bestellplanung wird eine volle 1-kg-Spule als Rundungsschritt verwendet.

## Gesamtbilanz der Originaldaten

| Größe | Menge |
|---|---:|
| Anfangsbestand am 22.10.2021 | 1.955.927 g |
| Eingegangene Ware | 53.922.000 g |
| Verbrauch | 54.818.552 g |
| Endbestand am 21.10.2026 | 1.059.375 g |
| Offen bestellt | 514.000 g in 19 Bestellungen |

Die Bilanz stimmt exakt:

```text
Anfangsbestand + Wareneingang − Verbrauch = Endbestand
1.955.927 g + 53.922.000 g − 54.818.552 g = 1.059.375 g
```

Insgesamt wurden 54.436 kg bestellt. 53.922 kg davon sind eingegangen; die Differenz von 514 kg entspricht den 19 offenen Bestellungen. Der Verbrauch überstieg den Wareneingang um 896.552 g. Diese Menge wurde durch den Abbau des Anfangsbestands gedeckt.

## Stand am letzten Lagerdatum

| Bestand am 21.10.2026 | Menge |
|---|---:|
| Zentrallager der 12 CSV-Materialien | 1.020.000 g |
| 100 reale Druckerpositionen aus CSV | 39.375 g |
| Reeller CSV-Gesamtbestand | 1.059.375 g |
| 38 ergänzte Materialvarianten im Lager (Pseudo) | 4.776.100 g |
| 300 zusätzliche Druckerpositionen (Pseudo) | 172.400 g |
| In der erweiterten Demoanzeige insgesamt | 6.007.875 g |

Die erweiterten Summen enthalten Pseudo-Daten. Für reale Einkaufsentscheidungen dürfen sie nicht als tatsächlich vorhandener Bestand interpretiert werden. Die Einkaufsvorschläge verwenden nur die zwölf CSV-Materialien, den CSV-Lagerbestand, die 100 echten Druckerpositionen und offene Bestellungen.

## Verbrauch und Einkauf 2026

Bis zum 21.10.2026 weist der Datensatz 9.827.426 g Verbrauch und 9.823 kg bestellte Menge aus. Der Oktoberwert ist nicht vollständig. Über die fünf vollen rollierenden Jahreszeiträume steigt der Verbrauch von rund 9,157 t (2021–2022) auf rund 12,301 t (2025–2026).

## Bestellvorschlag

Die Einkaufsplanung verwendet für jede Material-ID den mittleren Monatsverbrauch Juli bis September 2026 als 30-Tage-Bedarf. Für die verfügbare Position werden Lagerbestand, reale CSV-Druckermenge und offene Bestellungen addiert. Die Reichweite wird aus verfügbarer Position und 30-Tage-Bedarf berechnet. Die Zieldeckung wird für 30 Tage plus materialabhängige Lieferzeit (10, 11 oder 16 Tage) berechnet. Der Bruttobedarf wird durch 0,95 geteilt (5 % Ausschuss), anschließend werden 3.000 g Sicherheitsbestand addiert. Von der Zieldeckung werden Lagerbestand, echte Druckerpositionen und noch offene Bestellungen abgezogen. Ein bis zum heutigen Datum eingetragener Wareneingang wird dem Lager zugerechnet und nicht zusätzlich als offen gezählt. Das Ergebnis wird auf volle 1-kg-Spulen aufgerundet. Danach zeigt die App die elf Materialvarianten mit der kürzesten Reichweite; Positionen ohne rechnerische Bestellmenge bleiben als Beobachtung sichtbar.

## Projektzielwerte

Die Projektunterlage nennt als angenommene Ausgangslage 40.000 € Überbestand und etwa 15 Stillstandstage pro Jahr. Daraus leiten sich Ziele von 30 % weniger Überbestand, 12.000 € freigesetztem Kapital und weniger als drei Tagen Stillstand pro Jahr ab. Die Ausgangswerte sind Annahmen, keine belegten Messreihen. Für Stillstand gibt es in den gelieferten CSV-Dateien keinen aktuellen Messwert oder Zieltermin.

Der angezeigte Lagerwert von etwa 31.382 € basiert auf den CSV-Beständen und Standardpreisen. Der Fortschritt gegenüber der angenommenen 40.000-€-Basis ist deshalb nur ein rechnerischer Orientierungswert, keine validierte Projektmessung.
## Bedarfsprognose, Saison und aktuelle Trends

Die Prognoseseite trennt verkaufte Stücke vom Filamentverbrauch in Gramm. Die frühere Kennzahl `+24 %` war ein statischer Demo-Platzhalter ohne Datenherleitung und wurde entfernt. Aus den vollständigen Monatswerten Nov 2021–Sep 2026 ergibt sich:

| Kennzahl | Datenwert | Berechnung |
|---|---:|---|
| Spitze Filamentverbrauch | August, +7,8 % | Monatsmittel in Gramm im Verhältnis zum Mittel aller vollständigen Monate |
| Spitze verkaufte Stücke | November, +14,5 % | Monatsmittel in Stück im Verhältnis zum Mittel aller vollständigen Monate |
| Weihnachtsartikelanteil im November | rund 30,7 % | Anteile der als Weihnachten markierten Artikel an den Novemberstückzahlen |

Die Spitzen unterscheiden sich, weil Stücke und Gramm verschiedene Größen sind und Produkte unterschiedliche Gewichte sowie saisonale Absatzmuster haben.

### Modell und Rücktest

Der Kursprototyp berechnet seine Beispielprognose je Material anhand der verfügbaren vollständigen Monatswerte, eines Zeittrends und saisonaler Monatsmuster. Der unvollständige Oktober 2026 und noch nicht eingetretene Monate werden ausgeschlossen. Die Ausgabe für den 27.10.–23.11.2026 enthält prognostizierte Stücke und Filamentgramm pro Material. Dazu werden fünf Oktobertage (5/31 des geschätzten Monatswerts) und 23 Novembertage (23/30 des geschätzten Monatswerts) zusammengeführt. Der Vergleich mit 2025 verwendet dieselben Monatsanteile der vollständigen Oktober- und Novemberwerte. Das ist wegen der nur monatlichen Eingabedaten eine anteilige 4-Wochen-Schätzung, keine tagesgenaue Vorhersage. Ein Rücktest hält Jul–Sep 2026 zurück und vergleicht Prognose mit Ist-Werten. WAPE ist die Summe der absoluten Fehler geteilt durch die Summe der tatsächlichen Werte.

Die aktuelle Demo ist ein Prototyp mit eingebetteten Beispieldaten und lernt nicht automatisch aus neuen Verkäufen. Das Zielbild für den späteren Echtbetrieb ist eine selbstlernende KI, die neue Verkaufs-, Verbrauchs- und Saisondaten laufend berücksichtigt und ihre Prognosen aktualisiert. Der Rücktest deckt nur drei Monate ab und ist kein Nachweis künftiger Genauigkeit.

### Farb- und Produkttrend

Die Trendansicht aggregiert verkaufte Stück nach Farbe bzw. Produkt für das letzte vollständige Quartal Jul–Sep 2026 und vergleicht mit Jul–Sep 2025. Oktober ist nicht einbezogen. Im Datensatz ist Schwarz die meistverkaufte Farbe; Transparent weist den stärksten relativen Quartalszuwachs auf. Die Top-Produkte erscheinen mit Stückzahl und Veränderung zum Vorjahresquartal. Das bezieht sich auf den Beispieldatensatz, nicht auf externen Markttrend oder Live-Verkaufsdaten.


### Externe Marktplatzsignale (qualitativ)

Die Prognoseansicht verlinkt auf öffentliche Trendlisten von [MakerWorld](https://makerworld.com/en/search/models?keyword=tag%3A+popular) und [Cults3D](https://cults3d.com/en/creations/trending). Der am 26.10.2026 geprüfte Snapshot enthält unter anderem Weihnachtsdekoration, Baumanhänger und Adventsartikel sowie Halloween-Motive, Flexi-/Gelenkfiguren, Fidget-Modelle, Miniaturen, Lampen und Cosplay. Die App zeigt daraus zehn qualitative saisonale Produktideen samt vorgeschlagenem Filamenttyp und Farbe.

Die zehn Marktplatzzeilen ordnen diesen Suchsignalen jeweils eine Saisonartikel-Idee sowie einen möglichen Filamenttyp und Farbton zu. Diese Zuordnungen sind Vorschläge, keine aus Marketplace-Daten ermittelten Materialbedarfe. Rankings beziehen sich auf digitale Modellpopularität bzw. Downloads, nicht auf verkaufte physische Artikel, tatsächlich gedruckte Mengen oder verwendete Filamentfarben. Es gibt keinen belastbaren SKU-Abgleich und keine gemeinsame Zeitreihe mit den PrintPilot-CSV-Daten. Deshalb verändern diese Signale die numerische Absatz- und Grammprognose nicht. Die Seiten sind dynamisch; der Snapshot ist keine automatische oder dauerhafte Live-Anbindung.


### Einheitliche Prognoseansicht

Die 4-Wochen-Prognose zeigt jede Produkt-Material-Kombination nur einmal. Farb- und Produktübersichten verwenden dasselbe Vergleichsschema: Vorjahr, Prognose und prozentuale Abweichung. Saisonkennzeichnung (z. B. Weihnachten) steht in der Produktliste; eine separate Saisontabelle wurde entfernt, damit Artikelwerte nicht doppelt erscheinen.

Die Farb- und Produktprognosetabellen enthalten jeweils sowohl Stückzahlen als auch den geschätzten Filamentverbrauch in kg für den Vorjahreszeitraum und den Prognosezeitraum. Die Abweichungen werden getrennt für Stück und kg berechnet. Die separate Gesamtbedarfs-Karte wurde entfernt, damit die Details in den einheitlichen Vergleichstabellen bleiben.


### Erklärung und Übergabe an den Einkauf

Die Vorjahresreferenz wird nicht in der Prognoseübersicht angezeigt, bleibt aber in der Detailerklärung je Produkt/Farbe verfügbar. Die Erklärung zeigt den Modellansatz, die Oktober-/Novemberanteile des 4-Wochen-Zeitraums und den letzten WAPE-Rücktest. Beim Übernehmen in die Einkaufsplanung wird der Filamentbedarf je Material auf volle 1-kg-Spulen aufgerundet. Vorhandene Vorschläge werden um diese Menge erhöht, andernfalls wird das Material in die Planung aufgenommen. Die Aktion erstellt keine externe Bestellung.


## Liefertermine und Wareneingang

Offene Bestellungen haben erwartete Liefertermine nach dem Projektstand vom 26.10.2026. Wenn für eine offene Bestellung ein tatsächliches Eingangsdatum erfasst wird, bleibt die Menge bis zu diesem Datum als offener Zugang vorgemerkt. Ab dem Datum wird sie dem Zentrallager zugerechnet und nicht mehr als offen gezählt. Die Eingänge werden in `localStorage` des aktuellen Browsers gespeichert. Wird der Browser am Eingangsdatum nicht genutzt, erfolgt die Bestandsbuchung beim nächsten Öffnen der App. Es gibt keinen Serverprozess für Hintergrundbuchungen; Daten werden nicht zwischen Browsern synchronisiert.


Die neuere Monatsgrafik zeigt den aufsummierten Verbrauch und die erfassten Bestellungen je Kalendermonat in Gramm. Ein Bestelldatum ordnet die Bestellung dem Monat zu; es wird nicht mit dem tatsächlichen Wareneingang gleichgesetzt. Oktober 2026 ist ein Teilmonat. Projektziele zeigen Fristen relativ zum Projektstart und Zielwerte, aber keine Fortschrittsbalken, solange Ist-Messwerte fehlen.
