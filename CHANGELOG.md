# Änderungsprotokoll

Jede Änderung erhält einen datierten Eintrag. Neue Einträge stehen oben. Zusammengehörige Dateien dürfen in einem Eintrag zusammengefasst werden, müssen darin aber vollständig genannt sein. Git-Commits halten die genaue Änderungshistorie fest.

## 2026-10-30 – Bestehende Webseite und historischer KI-Rücktest

- `index.html` und `historical-prognosen.js`: Rückblick in der vorhandenen Bedarfsprognose mit Produktauswahl, Monats- und Tageswerten sowie berechnetem MAE ergänzt.
- `prognosen.json`: früheren Chat-Anhang für 01.01.–31.03.2026 inhaltlich unverändert übernommen und Zeilenenden für Git vereinheitlicht; `printpilot_prognose.json` als separaten späteren Export beibehalten.
- `.gitignore`: virtuelle Python-Umgebungen, lokal trainierte Modelle und temporäre Dateien ausgeschlossen.
- `README.md`, `data/README.md`, `docs/ANWENDUNG.md`, `docs/ARCHITEKTUR.md`, `docs/GITHUB-PAGES.md`: Start, Datenabgrenzung, Bedienung und Upload in das vorhandene Repository erläutert.
- `docs/DATENMODELL-UND-AUDIT.md`: bestehende Dokumentation des lokalen Webseitenpakets übernommen.
- `STATUS.md`, `TODO.md`, `MEMORY.md`: Projektstand, offene Browserprüfung und Entscheidung zur Trennung historischer Ist-Werte ergänzt.
- `CHANGELOG.md`: frühere Einträge aus GitHub und dem lokalen Webseitenpaket zusammengeführt.
- Grund: Die lokal vorhandene PrintPilot-Webseite soll in das bestehende Repository übernommen und der historische KI-Rücktest sichtbar gemacht werden.
- Prüfung: Zehn ZIP-Dateien mit dem entpackten Webseitenordner per SHA-256 verglichen (identisch); `prognosen.json` auf 1.080 Werte, 90 Tage und zwölf Produkte geprüft; MAE aus Tageswerten neu berechnet (5,83 Stück); `node --check historical-prognosen.js` und HTTP-200-Abruf der JSON-Datei geprüft. Die visuelle Browserprüfung war wegen eines Zugriffsfehlers der Browserautomatisierung nicht möglich und bleibt offen.

## 2026-10-27 – Kundenauftragsübersicht

- Unter „Bestellungen“ einen eigenen Navigationsreiter „Kundenaufträge“ ergänzt.
- Übersicht mit fünf Beispielaufträgen, Kunde, Artikel, Filamentbedarf, Wunschtermin und Bearbeitungsstatus ergänzt.
- Beispielaufträge sind statisch und verändern keine Bestände oder Einkaufsplanung.

## 2026-10-26 – GitHub-Dokumentationspaket

- Deutsche README und Anleitungen zu Bedienung, Architektur, Daten und GitHub Pages ergänzt.
- Prüffunktion der Einkaufsplanung ist umschaltbar; Mengenänderungen setzen den Prüfstatus zurück.
- Individuelle Bestellmengen und Abweichungen sind Bestandteil des CSV-Exports.
- Einkaufsplanung nutzt CSV-Lagerbestand, 100 reale Druckerpositionen und offene Bestellungen. 300 Pseudo-Druckerpositionen werden für diese Berechnung ausgeschlossen.
- Startseite vereinfacht; Tabellen- und Projektzielhinweise kompakt dargestellt.

## 2026-10-22 – Projektkontext aktualisiert

- README.md und docs/PROJEKTGRUNDLAGE.md: Team, Kurskontext, qualitative Ziele und Bestellverantwortung aus der aktuellen Projekt-Page übernommen.
- TODO.md: Übernahme des Kontexts abgeschlossen; messbare Ziele und Einkaufsablauf als offene Aufgaben präzisiert.
- MEMORY.md: bestätigte Angaben und den historischen Bezug auf den inzwischen entfernten Repository-Abschnitt klargestellt.
- STATUS.md: Phase und Anforderungen auf den aktuellen Kenntnisstand gebracht.
- CHANGELOG.md: diese Aktualisierung dokumentiert.
- Grund: Die Projekt-Page enthält inzwischen konkrete Angaben, die in der ursprünglichen Repository-Dokumentation fehlten.
- Prüfung: Aktuelle Page und GitHub-Ausgangscommit gelesen; PDF-Zugriff erneut geprüft (Format nicht unterstützt). Relative Markdown-Verweise geprüft: keine fehlenden Ziele. Keine Anwendungstests, da kein Anwendungscode geändert wurde.
- Einschränkung: PDF-Inhalte bleiben unausgewertet; die lokale Git-Verknüpfung ist weiterhin offen.

## 2026-10-22 – Projektinitialisierung

### Hinzugefügt

- Privates GitHub-Repository iambubble878/PrintPilot mit Hauptbranch main.
- README.md: Überblick, Einstieg und Dokumentationsindex.
- TODO.md: erledigter Projektstart und offene Planungsschritte.
- MEMORY.md: bestätigte Fakten, Entscheidungen und offene Fragen.
- STATUS.md: Ausgangsstand und Einschränkungen.
- CHANGELOG.md: datiertes Änderungsprotokoll.
- AGENTS.md und CONTRIBUTING.md: verbindlicher Ablauf zur Dokumentationspflege.
- docs/PROJEKTGRUNDLAGE.md: Quellen und Abgrenzung vorläufiger Annahmen.
- .gitignore: lokale Geheimnisse, Protokolle und temporäre Dateien ausschließen.
- .gitattributes: einheitliche Textzeilenenden.
- Lokale Kopie der Projektdateien im bereitgestellten Arbeitsordner.

### Grund

Nachvollziehbare Grundlage vor Beginn der Implementierung schaffen.

### Prüfung

Geprüft: zehn Dateien im GitHub-Branch main vorhanden; acht lokale Markdown-Dateien mit null fehlenden relativen Markdown-Verweisen. Keine Anwendungstests, da noch kein Anwendungscode existiert.

### Bekannte Grenzen

Frühere Git-Historie aus dem ZIP und PDF-Inhalte konnten nicht übernommen werden. Die lokale Git-Verknüpfung scheiterte an einem Schreibzugriffsfehler im geschützten .git-Ordner trotz zusätzlich erteilter Berechtigung; lokale Dateien sind noch nicht als synchronisierte Git-Kopie nutzbar. Diese Einschränkung wurde in STATUS.md ergänzt.

## Bekannte Einschränkungen des lokalen Webseitenpakets
- Die Anwendung ist ein statischer Prototyp ohne Backend und ohne Echtzeitdaten.
- Die 38 zusätzlichen Materialvarianten und 300 zusätzlichen Druckerpositionen sind Pseudo-Daten.
- Die Regression ist eine statistische Prognose, kein externes oder selbstlernendes KI-Modell; automatische Bestellung ist nicht implementiert.
