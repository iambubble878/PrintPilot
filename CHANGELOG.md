# Änderungsprotokoll

Jede Änderung erhält einen datierten Eintrag. Neue Einträge stehen oben. Zusammengehörige Dateien dürfen in einem Eintrag zusammengefasst werden, müssen darin aber vollständig genannt sein. Git-Commits halten die genaue Änderungshistorie fest.

## 2026-10-30 – Aktive Vier-Wochen-Prognose mit Random Forest neu trainiert

- `model/prognose.py`: Gradient-Boosting-Training durch `RandomForestRegressor` mit festgelegten Parametern ersetzt; 28 Tage als eigenen Prüf- und Summenhorizont ergänzt; Version und SHA-256 der fiktiven Verkaufs-CSV dokumentiert.
- `printpilot_prognose.json`, `app/forecast-data.json`: 90 Tage × zwölf Artikel aus dem neu trainierten Random Forest übernommen; Produkt-, Material-, Bestands- und Bestellangaben bleiben aus dem bisherigen fiktiven Stichtag.
- `app/forecast-panel.html`, `app/forecast-ui.js`, `index.html`: aktive Vorführprognose und eigenständigen historischen Random-Forest-Rückblick klar benannt; Qualitätswerte folgen nun dem ausgewählten Horizont; Einzeldatei neu gebaut.
- `test/forecast.test.js`: Modelltyp, 28/30/60/90-Tage-Summen und Kennzeichnung in der gebauten Seite geprüft.
- `README.md`, `docs/ANWENDUNG.md`, `docs/KI_PROGNOSE.md`, `docs/PROJEKTGRUNDLAGE.md`, `STATUS.md`, `TODO.md`, `MEMORY.md`, `CHANGELOG.md`: Datenherkunft, Modelltrennung, neue Vorführzahlen, Testwerte und Grenzen aktualisiert.
- Grund: Der Nutzer möchte die Vier-Wochen-Vorführung tatsächlich mit Random Forest statt mit Gradient Boosting zeigen.
- Prüfung: fünfjährige CSV mit 1.826 Tagen und zwölf Artikeln validiert; zeitlich getrennte Validierung und unabhängigen Test gerechnet (28-Tage-WAPE 19,97 %, Wochenvergleich 22,83 %); `npm run build`, `npm test` (16/16 bestanden) und Summenabgleich der 1.080 Prognosezeilen. Visuelle Prüfung der Online-Seite steht noch aus.

## 2026-10-30 – Online-Version als Schnellstart

- `README.md`, `docs/ANWENDUNG.md`, `docs/GITHUB-PAGES.md`: die vom Nutzer gemeldete GitHub-Pages-Adresse als Einstieg dokumentiert und localhost-Anleitungen aus der Nutzung entfernt; veraltete Hinweise zur Erstübernahme des Repositorys ersetzt.
- `historical-prognosen.js`, `index.html`: Fehlermeldung beim Laden von `prognosen.json` auf die Online-Nutzung angepasst; `index.html` aus der Quelle neu gebaut.
- `STATUS.md`, `TODO.md`, `MEMORY.md`, `CHANGELOG.md`: Veröffentlichung und noch offene Sichtprüfung festgehalten.
- Grund: Die Webseite ist laut Nutzer online erreichbar und soll ohne lokalen Server verwendet werden.
- Prüfung: Dokumentation und Quelltext auf aktive localhost-Hinweise durchsucht; `npm run build` und `npm test` ausgeführt. Der öffentliche Seitenaufruf konnte mit dem verfügbaren Web-Abrufwerkzeug nicht bestätigt werden.

## 2026-10-30 – Vier Wochen als fiktive Standardvorführung

- `app/forecast-model.js`: 28 Tage als Standard und zulässigen Horizont ergänzt; 30/60/90 Tage bleiben verfügbar.
- `app/forecast-panel.html`, `app/forecast-ui.js`: „4 Wochen (28 Tage)“ als Standard-Auswahl und den fiktiven Datenstand sichtbar gemacht; Kundenaufträge verwenden weiter ausdrücklich die feste 30-Tage-KI-Basis.
- `index.html`: mit `npm run build` aus den aktualisierten Quellen neu erzeugt.
- `test/forecast.test.js`: exakten 28-Tage-Zeitraum und die Summen aus den Tageswerten geprüft; bestehende 30-Tage-Rechnung separat abgesichert.
- `README.md`, `docs/ANWENDUNG.md`, `docs/GITHUB-PAGES.md`, `docs/KI_PROGNOSE.md`, `STATUS.md`, `TODO.md`, `MEMORY.md`, `CHANGELOG.md`: Vorführzeitraum, Datenstand, Trennung der Kundenaufträge und tatsächlichen GitHub-Stand erläutert.
- Grund: Das fiktive Unternehmen möchte bei der Vorführung die Prognose für genau die folgenden vier Wochen zeigen, ohne die festen Daten als tagesaktuell auszugeben.
- Prüfung: `npm run build` und `npm test` (16 von 16 bestanden); Standardzeitraum 22.10.–18.11.2026 mit 14.775 Stück, 1.114,6 kg Filamentbedarf und 425 kg Zusatzvorschlag unabhängig aus dem Modell berechnet. Browser-Sichtprüfung bleibt offen.

## 2026-10-30 – KI-Simulator-Fassung als Änderungsvorschlag zusammengeführt

- `index.html`: aus der älteren Projekt-ZIP neu gebaut; aktive 30/60/90-Tage-KI-Simulation und Kundenauftragsanalyse mit fester 30-Tage-KI-Basis, ergänzt um den getrennten historischen Januar–März-Rückblick.
- `app/presentation-base.html`, `app/forecast-data.json`, `app/forecast-model.js`, `app/forecast-ui.js`, `app/forecast-panel.html`, `app/forecast.css`: Quelloberfläche, vorberechnete Tageswerte und Simulationslogik aus der ZIP übernommen; Rückblick in Panel und Gestaltung ergänzt.
- `app/index.html`, `app/app.js`, `app/model.js`, `app/styles.css`: die in der ZIP enthaltene kleinere Demo als getrennten Bereich übernommen.
- `model/prognose.py`, `model/requirements.txt`: Trainingsskript und Paketliste aus der ZIP übernommen, keine trainierte Modelldatei.
- `tools/build-presentation.mjs`, `tools/prepare_forecast.py`: Build und Datenaufbereitung übernommen; Build bindet nun auch das historische Rückblickskript ein.
- `test/file-launch.test.js`, `test/forecast.test.js`, `test/model.test.js`, `package.json`: vorhandene Prüfungen und lokale Befehle übernommen.
- `server.mjs`: lokalen Server aus der ZIP übernommen und für `prognosen.json` ergänzt; Projektunterlagen bleiben vom Server ausgeschlossen.
- `.gitignore`: Python-Quellordner für Versionierung freigegeben; trainierte Modellartefakte, `tmp/` und `output/` bleiben ausgeschlossen.
- `README.md`, `data/README.md`, `docs/ANWENDUNG.md`, `docs/ARCHITEKTUR.md`, `docs/DATENMODELL-UND-AUDIT.md`, `docs/GITHUB-PAGES.md`, `docs/KI_PROGNOSE.md`, `docs/PROJEKTGRUNDLAGE.md`, `STATUS.md`, `TODO.md`, `MEMORY.md`, `CHANGELOG.md`: aktive und historische Modelle, Quellen, Bedienung, Grenzen, Prüfungen und offenen Review-Stand dokumentiert.
- Grund: Die bisherige GitHub-Fassung zeigte bei Kundenaufträgen wegen eines Skriptfehlers nur „Analyse läuft“ und enthielt nicht die ältere KI-Simulator-Fassung. Beide Prognosezeiträume sollen im bestehenden Dashboard eindeutig getrennt bleiben.
- Prüfung: `npm run build`, `npm test` (15 von 15 bestanden), eindeutige HTML-IDs, historisches Panel im Build, lokaler Node-Server mit HTTP 200 für `index.html` und `prognosen.json` sowie HTTP 404 für `README.md`. Eine visuelle Browserprüfung bleibt offen.

## 2026-10-30 – Kundenauftragsanalyse wieder ausführbar

- index.html: fehlendes Skript-Ende vor der Kundenauftragsanalyse ergänzt; dadurch kann die Empfehlung statt des Platzhalters „Analyse läuft“ berechnet werden.
- MEMORY.md: festgehalten, dass diese Kundenempfehlung die statistische 4-Wochen-Prognose nutzt und nicht den historischen KI-Rücktest oder die andere KI-Simulator-Fassung.
- CHANGELOG.md: diese Korrektur dokumentiert.
- Grund: Ein zusätzliches `<script>` innerhalb eines offenen Skripts verursachte einen JavaScript-Syntaxfehler.
- Prüfung: Alle Inline-Skripte der Seite mit Node.js syntaktisch geprüft. Die visuelle Browserprüfung bleibt offen.

## 2026-10-30 – Lokalen Startport korrigiert

- README.md, docs/ANWENDUNG.md und docs/GITHUB-PAGES.md: Beispielbefehl und URL von Port 8000 auf 8765 geändert und Bindung an den lokalen Rechner ergänzt.
- MEMORY.md: den auf diesem Windows-PC reservierten Port 8000 und den geprüften Ersatzport festgehalten.
- CHANGELOG.md: diese Korrektur dokumentiert.
- Grund: `python -m http.server 8000` scheiterte mit WinError 10013, weil Windows Port 8000 ausschließt.
- Prüfung: HTTP-Abruf von `index.html` und `prognosen.json` über `127.0.0.1:8765` ergab jeweils Status 200. Eine visuelle Browserprüfung wurde dabei nicht durchgeführt.

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
