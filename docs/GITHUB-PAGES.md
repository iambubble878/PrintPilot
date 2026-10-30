# Bestehende Webseite in das vorhandene GitHub-Repository übernehmen

Stand 30.10.2026: Die Webseite liegt bereits auf `main`. Die ältere KI-Simulator-Fassung wird als gesonderter Änderungsvorschlag geprüft. Die folgenden Upload-Schritte sind für spätere lokale Änderungen gedacht; vorhandene Dateien und Historie nicht erneut durch eine ZIP ersetzen. Nach Änderungen unter `app/` zuerst `npm run build`, dann `npm test` ausführen und die erzeugte `index.html` mit committen.

## ZIP entpacken

Den unveränderten Ordner `PrintPilot-GitHub` zuerst als ZIP sichern. Das vorhandene private Repository ist `iambubble878/PrintPilot`. Es enthält bereits Dokumentation, aber bislang keine Webseite. Deshalb die Repository-Dateien zuerst herunterladen und die **Inhalte** des Webseitenordners in diese Kopie übernehmen. Eine ZIP-Datei im Repository würde die Webseite nicht ausführen.

## Upload mit GitHub Desktop

1. In GitHub Desktop mit dem vorhandenen GitHub-Konto anmelden. Das Repository `iambubble878/PrintPilot` über **File → Clone repository** klonen.
2. Im Datei-Explorer **Repository → Show in Explorer** öffnen. Die gesicherten Inhalte aus `PrintPilot-GitHub` in den Stamm der geklonten Kopie legen, also `index.html`, `historical-prognosen.js`, `prognosen.json`, `printpilot_prognose.json` sowie `data/` und die ergänzenden `docs/`-Dateien. Gleichnamige Dokumentationsdateien wie `README.md`, `.gitignore` und `CHANGELOG.md` zusammenführen, nicht blind ersetzen. Den Ordner `.git` unberührt lassen.
3. In GitHub Desktop einen Branch für die Übernahme anlegen. Unter **Changes** die Dateiliste prüfen: keine `.venv`, Modelldateien, Zugangsdaten oder ungeprüften Rohdaten. Die Änderungen mit einer verständlichen Zusammenfassung committen.
4. **Publish branch** oder **Push origin** wählen und einen Pull Request zum Branch `main` öffnen. Nach Prüfung und Zusammenführung enthält das bestehende Repository die Webseite.

## Upload mit VS Code

1. In VS Code **Repository klonen** wählen und `https://github.com/iambubble878/PrintPilot.git` einfügen. Die Anmeldung erfolgt über den normalen GitHub-Dialog; ein Zugangstoken gehört nicht in Dateien oder Befehle.
2. Den geklonten Ordner öffnen, die Webseiten-Dateien wie oben beschrieben ergänzen und gleichnamige Dokumentation zusammenführen.
3. In **Quellcodeverwaltung** einen Branch anlegen, Änderungen prüfen, committen und **Branch veröffentlichen** wählen. Danach den Pull Request öffnen.

## Lokal prüfen

Im Webseitenordner `python -m http.server 8765 --bind 127.0.0.1` ausführen und `http://localhost:8765` öffnen. Auf diesem Windows-PC ist Port 8000 reserviert. Unter **Bedarfsprognose** prüfen, ob der Rücktest 01.01.–31.03.2026 geladen wird, zwölf Produkte auswählbar sind, der Gesamt-MAE 5,83 Stück beträgt und Monats- sowie Tageswerte angezeigt werden. Außerdem die bestehende 4-Wochen-Prognose, Einkaufsplanung und Navigation prüfen. Bei direktem Öffnen von `index.html` die Datei `prognosen.json` im Rückblick auswählen.

## GitHub Pages (optional)

Das Repository ist privat. Eine Veröffentlichung ist eine eigene Entscheidung. Nach Prüfung der Demo-Daten und der Sichtbarkeit kann in den Repository-Einstellungen **Pages → Deploy from a branch → main → / (root)** gewählt werden. Danach die angezeigte URL öffnen und dieselben Funktionen erneut testen.

## Vor einer öffentlichen Veröffentlichung

- Prüfen, ob die Zahlen in `index.html` zur öffentlichen Weitergabe freigegeben sind.
- Falls erforderlich, echte Lieferanten-, Bestands- oder Preisangaben durch Pseudo-Daten ersetzen.
- Eine passende Lizenz wählen und eine `LICENSE`-Datei ergänzen. Dieses Paket legt keine Lizenz fest.
- Nach jeder Änderung die Webapp lokal öffnen und den GitHub-Pages-Link prüfen.
