# Änderungsprotokoll

Jede Änderung erhält einen datierten Eintrag. Neue Einträge stehen oben. Zusammengehörige Dateien dürfen in einem Eintrag zusammengefasst werden, müssen darin aber vollständig genannt sein. Git-Commits halten die genaue Änderungshistorie fest.

## 2026-10-27 – Webapp dokumentiert und in GitHub aufgenommen

- Dateien: index.html, README.md, STATUS.md, TODO.md, MEMORY.md, docs/PROJEKTGRUNDLAGE.md sowie docs/WEBAPP.md, docs/BEDIENUNG.md, docs/ARCHITEKTUR.md und docs/DATENMODELL.md.
- Grund: Der bestehende Repository-Stand beschrieb noch den Projektstart, obwohl inzwischen ein Webapp-Prototyp mit Prognose und Kundenauftragsansicht vorliegt.
- Inhalt: Funktionsübersicht, Anleitung, Datenmodell, lokale Speicherung, Prognose und Grenzen der Status-Empfehlung dokumentiert. Kundenbeispiele sind anonymisiert; Status-Empfehlungen bleiben manuell.
- Prüfung: Vorhandene AGENTS.md-, README-, STATUS-, TODO- und MEMORY-Regeln gelesen; Repository-Inhalt und vorhandenen Prototyp abgeglichen; Dokumentationspfade auf die in diesem Commit angelegten Dateien abgestimmt.
- Einschränkung: Keine Anwendungstests ausgeführt. Die Daten- und KI-Anbindungen sind nicht produktiv.

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

Frühere Git-Historie aus dem ZIP und PDF-Inhalte konnten nicht übernommen werden. Die lokale Git-Verknüpfung scheiterte an einem Schreibzugriffsfehler im geschützten .git-Ordner trotz zusätzlich erteilter Berechtigung; lokale Dateien sind noch nicht als synchronisierte Git-Kopie nutzbar.
