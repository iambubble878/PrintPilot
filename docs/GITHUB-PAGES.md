# PrintPilot auf GitHub Pages

Stand 30.10.2026: Der Nutzer hat die Online-Adresse [iambubble878.github.io/PrintPilot](https://iambubble878.github.io/PrintPilot/) als veröffentlicht gemeldet. Die Anwendung liegt weiterhin im bestehenden Repository `iambubble878/PrintPilot`. Für die Nutzung der Online-Version ist kein lokaler Server erforderlich.

## Online öffnen und prüfen

Den Link im Browser öffnen. Unter **Bedarfsprognose** sollten die fiktive Vier-Wochen-Simulation und der historische Rücktest für Januar bis März 2026 erscheinen. Beim Rücktest zwölf Produkte, Monats- und Tageswerte sowie den Gesamt-MAE von 5,83 Stück prüfen. Danach Kundenaufträge, Einkaufsplanung und Navigation durchgehen.

`prognosen.json` wird auf der veröffentlichten Seite automatisch geladen. Die Auswahl einer lokalen JSON-Datei ist nur ein Ausweichweg, wenn `index.html` direkt vom Computer geöffnet wird oder der automatische Abruf fehlschlägt.

## Spätere Änderungen veröffentlichen

1. Das vorhandene Repository mit GitHub Desktop oder VS Code klonen beziehungsweise die bestehende geklonte Kopie öffnen. Keine neue Webseite und kein neues Repository anlegen.
2. Die gewünschten Dateien bearbeiten. Nach Änderungen unter `app/` mit `npm run build` die `index.html` neu erzeugen und mit `npm test` prüfen.
3. Änderungen prüfen, committen und zu GitHub hochladen. Bei einem Team-Branch den Pull Request in `main` zusammenführen.
4. Die Online-Adresse erneut öffnen und die geänderten Bereiche prüfen. Falls die Änderung noch nicht sichtbar ist, den Veröffentlichungsstatus unter **Settings → Pages** beziehungsweise **Actions** im Repository prüfen.

## Grenzen der Online-Version

Die Webseite verwendet vorberechnete Prognosedaten aus einem fiktiven Datenstand vom 21.10.2026. GitHub Pages führt das Python-Training nicht bei einem Seitenaufruf aus. Eigene Mengen und Prüfstatus bleiben im Browser des jeweiligen Geräts gespeichert und werden nicht zwischen Geräten synchronisiert. Die veröffentlichte Webseite ist öffentlich erreichbar, auch wenn das Repository privat ist.
