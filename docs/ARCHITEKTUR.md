# Architektur der Webapp

## Laufzeit

Die Webapp besteht aus der einzelnen Datei `index.html` mit HTML, CSS, JavaScript und eingebetteten Datensätzen. Es gibt keinen Build-Schritt und kein Server-Backend. Der Browser führt Oberfläche und Berechnungen aus.

## Datenfluss

1. Eingebettete Material-, Verbrauchs-, Bestell- und Druckerdaten werden im Browser geladen.
2. Bestand und offene Bestellungen werden je Material-ID und Farbe zusammengeführt.
3. Die Bedarfsprognose berechnet Verkäufe und Filamentmengen für vier Wochen.
4. Die Einkaufsplanung stellt Bedarf, verfügbare Mengen und offene Zugänge gegenüber.
5. Die Kundenauftragsanalyse ordnet den Filamentbedarf einem Material zu und vergleicht ihn mit Lager- und Druckerbestand, offenen Bestellungen und der 4-Wochen-Prognose.
6. Nur durch Nutzeraktionen werden Status- oder Wareneingangswerte geändert.

## Prognose und Status-Empfehlung

Die Produkt- und Farbprognose nutzt eine lineare Regression mit Zeittrend und Monatsfaktoren aus den eingebetteten historischen Monatswerten. Externe Marktplatzideen sind qualitative Inspiration; sie werden nicht als interne Verkäufe behandelt.

Die Status-Empfehlung ist eine erklärbare Regelberechnung. Aktuell ausreichender Bestand führt zu **In Planung**. Ein ungedeckter Materialbedarf führt zu **Wartet auf Material**; dazu werden offene Zugänge und ihre bekannten Liefertermine angezeigt. Die Vier-Wochen-Prognose wird als zusätzlicher Hinweis auf den Restbestand einbezogen. Der Vorschlag ändert den manuellen Status erst bei Klick auf **Empfehlung übernehmen**.

## Browser-Speicher

| Schlüssel | Gespeicherte Eingabe |
| --- | --- |
| `printpilot-own-order-kg` | Eigene Einkaufsmenge je Material |
| `printpilot-order-reviewed` | Prüfstatus der Einkaufspositionen |
| `printpilot-received-dates` | manuell erfasste Eingangsdatum je Bestellung |
| `printpilot-customer-order-statuses` | manuelle Status je anonymisiertem Kundenauftrag |

Die Werte liegen im localStorage des verwendeten Browsers. Es gibt keine serverseitige Synchronisierung, Benutzerkonten oder automatische Sicherung.

## Externe Abhängigkeiten

Schriftarten können von Google Fonts geladen werden; bei Offlinebetrieb nutzt der Browser Ersatzschriften. Die Marktideen verweisen auf externe Modellplattformen. Die zentrale Anwendung und ihre Berechnungen benötigen keinen externen KI-Dienst.
