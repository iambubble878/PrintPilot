# Änderungsprotokoll

Jede Änderung erhält einen datierten Eintrag. Neue Einträge stehen oben. Zusammengehörige Dateien dürfen in einem Eintrag zusammengefasst werden, müssen darin aber vollständig genannt sein. Git-Commits halten die genaue Änderungshistorie fest.

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
