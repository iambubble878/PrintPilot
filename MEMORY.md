# Projektgedächtnis

Stand: 2026-10-27

## Bestätigt

- Projektname: PrintPilot.
- Kursprojekt von Carolin, Meik, Tamas und Lilia zum 3D-Druck.
- Ziel: Filamentbedarf besser planen, unnötigen Lagerbestand und Produktionsausfälle durch Materialmangel reduzieren.
- Bestellentscheidungen verbleiben beim Einkauf.
- Privates GitHub-Repository: https://github.com/iambubble878/PrintPilot.
- Die Webapp ist ein statischer HTML-Prototyp in index.html und benötigt kein Build-System.
- Die Webapp umfasst Lagerbestand je Material/Farbe, Einkaufsplanung, Bestellverfolgung, Kundenaufträge, Druckerflotte und Bedarfsprognose für vier Wochen.
- Fünf anonymisierte Beispiel-Kundenaufträge sind enthalten; Kundennamen und Kontaktdaten werden nicht verwendet.
- Status kann aus einer Liste gewählt oder frei eingetragen werden. Eine Erklärung empfiehlt einen Status anhand von Bestand, offenen Bestellungen und 4-Wochen-Prognose; der Status wird nur nach manueller Übernahme geändert.
- Eingaben werden in localStorage des jeweiligen Browsers gespeichert, nicht auf einem Server.
- Die Regressionsprognose ist statistisch und nicht selbstlernend; die App hat keine Live-Verbindung zu ERP, Kundenbestellungen oder Lieferanten.

## Entscheidungen

| Datum | Entscheidung | Begründung |
| --- | --- | --- |
| 2026-10-22 | Repository zunächst privat | Sichtbarkeit war nicht vorgegeben; Veröffentlichung bleibt eine spätere bewusste Entscheidung. |
| 2026-10-22 | Dokumentation auf Deutsch | Sprache der Projektbeauftragung. |
| 2026-10-22 | Bestellentscheidungen verbleiben beim Einkauf | Menschliche Prüfung vor Beschaffung. |
| 2026-10-27 | Webapp als statischer HTML-Prototyp dokumentiert | Schnell im Kurs nutzbar; spätere Datenbank- oder KI-Anbindung bleibt offen. |
| 2026-10-27 | Status-Empfehlungen sind erklärbar und manuell übernehmbar | Bestand, offene Bestellungen und Prognose werden gezeigt; die App entscheidet nicht automatisch. |

## Quellen und Grenzen

Die Webapp enthält eingebettete Projekt-Ausgangsdaten und ergänzte Beispieldaten. Die Kundenauftragszeilen enthalten keine Namen oder Kontaktdaten. Das Repository und die App sind nicht mit einem Produktivsystem verbunden. Eine selbstlernende Live-KI ist nicht angeschlossen.

Die beim Projektstart verlinkte PDF wurde damals über den verfügbaren Page-Dateileser nicht ausgelesen. Aussagen aus ihrem Inhalt gelten daher nicht als bestätigte Anforderungen.
