HINTER DEM HORIZONT – Cross Hall V6.1: Möbel/Texturen repariert

GEFUNDENE URSACHE
Dein hochgeladenes Repository enthielt die GLB-Modelle und alle Cross-Hall-Texturen ausschließlich im Hauptverzeichnis.
Die Spielskripte suchten sie jedoch unter assets/crosshall/models/ und assets/crosshall/.
Die Dateien wurden deshalb beim Start nicht gefunden.

ÄNDERUNGEN
1. Die 4 originalen GLB-Modelle zusätzlich in assets/crosshall/models/ kopiert.
2. Die 12 Cross-Hall-Texturen zusätzlich in assets/crosshall/ kopiert.
3. Beide Ladeprogramme verwenden nun den richtigen Unterordner und alternativ das Hauptverzeichnis.
4. Der Versionsparameter der beiden JavaScript-Module wurde geändert, damit der Browser keine alte Datei aus dem Cache verwendet.
5. Bei fehlenden GLB-Modellen zeigt das Spiel eine sichtbare Fehlermeldung statt Möbel schweigend auszulassen.
6. Burg, Spielfigur, Steuerung und alle anderen bestehenden Originaldateien bleiben unverändert.

EINBAU
A) Bevorzugt: komplette ZIP im TEST-Branch mit vollständigen Unterordnern als Repository-Inhalt hochladen (nicht die ZIP selbst als Spiel-Datei).
B) Minimaler Fix: index.html, cross-hall-v6.js und cross-hall-furniture-v6.js ersetzen; dabei können die vorhandenen GLB und JPG/PNG im Hauptordner bleiben.
WICHTIG: Die Unterordner assets/crosshall/ und assets/crosshall/models/ dürfen beim Entpacken nicht verloren gehen, wenn du die Komplettvariante verwendest.
Teste im Browser die Adresse https://heimhafen.github.io/hinter-dem-horizont/#cross-hall
Anschließend Safari einmal neu laden. Auf GitHub Pages muss der Testbranch gegebenenfalls separat veröffentlicht werden; nur das Erstellen eines Branches veröffentlicht ihn nicht.

PRÜFUNG
- In der ursprünglichen ZIP fehlten die verschachtelten Asset-Pfade tatsächlich.
- V6.1 deckt beide Verzeichnisformen ab.
- Alle GLB-Dateien lassen sich strukturell als 3D-Szenen öffnen.
- Live-Safari/WebGL-Darstellung auf iPhone kann hier nicht bestätigt werden.

QUALITÄT
Diese Reparatur stellt die vorhandenen GLB-Modelle und Materialdateien zur Verfügung; sie macht die bisher eher stilisierten Möbel NICHT automatisch fotorealistisch. Dafür wären weitergehende Modellierung, bessere PBR-Texturen, Szene/Licht und überprüfte historische Referenzen erforderlich. Erst nach Sichtbarkeitstest wird an nur EINEM Möbel weitergearbeitet.

COMMIT-ZUSAMMENFASSUNG
Cross Hall V6.1 – GLB-Möbel und Texturen repariert, doppelter Asset-Pfad abgesichert

WORKING COPY REMOTE-REFERENZ
refs/heads/test/cross-hall-v61-asset-fix

Force Push: Aus. Source-Branch unverändert.
