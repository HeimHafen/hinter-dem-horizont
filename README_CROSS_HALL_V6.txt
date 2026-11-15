HINTER DEM HORIZONT – CROSS HALL V6
Schwerpunkt: EIN EINZIGER AUFGABENBEREICH – Konsolentische, Vasen und Hortensien
Stand: 15.11.2026

ZIEL
Keine Kugel-/Kasten-Platzhalter für die Konsolen und Blumendekoration. Stattdessen vier
original erstellte, eigenständige, volumetrische PBR-3D-Modelle im GLB-Format:

assets/crosshall/models/console_walnut_3d.glb – Mahagoni-Konsolentisch mit geschwungenen Beinen
assets/crosshall/models/console_gold_3d.glb – vergoldete Konsole mit Marmortischplatte
assets/crosshall/models/porcelain_urn_3d.glb – hohle Porzellanvase mit modelliertem Dekor
assets/crosshall/models/hydrangea_bouquet_3d.glb – Vase mit 3D-Stielen, Blättern, Hortensienblüten

Das sind echte Geometrie-Modelle, keine bloßen flachen Fotos. Holzmuster und Marmormaserung
sind naturgemäß Texturen auf echten 3D-Flächen, wie bei realistischem 3D-Rendering üblich.

UMSETZUNG
- 5 Konsolengruppen entlang der Cross Hall, an freien Wandfeldern ausgerichtet
- alter einfacher Tisch samt alter Vase aus index.html entfernt
- ältere programmgenerierte Konsolen aus der Cross-Hall-Szene nicht mehr aufgerufen
- realistische Abmessungen: Tisch 1,46m breit, 0,54m tief, etwa 0,85m hoch
- alle Modelle stehen auf dem vorhandenen Steinboden, mit getrennten 3D-Dekorationen
- echte GLB-Materialien mit PBR-Metall, Stein, Holz und Keramik sowie Zimmerreflexionen
- Durchgänge, Teppich, Spielfigur und restliche Spielwelt unverändert
- Kollisionsrechtecke je Konsolengruppe; der zentrale Laufweg bleibt frei

UPDATE EINBAU (in bestehendes V5-Repository)
1. Backup des vollständigen bisherigen Repositorys anlegen.
2. index.html vollständig ersetzen.
3. cross-hall-v6.js und cross-hall-furniture-v6.js im Hauptverzeichnis hinzufügen.
4. Die vier GLB-Dateien in assets/crosshall/models/ hinzufügen.
5. Andere Dateien NICHT löschen. Ältere cross-hall-v5.js etc. werden von index.html nicht mehr importiert.
6. GitHub Pages zunächst über einen TESTBRANCH testen; keine ungeprüfte Änderung auf main.

HINWEISE
- Realitätsnah geformte 3D-Modelle sind KEINE nachgewiesenen 1:1-Repliken
  der realen Möbel des Weißen Hauses; dafür wären exakte Aufmaße/Fotos erforderlich.
- Noch KEINE historische Vollrekonstruktion der Cross Hall und KEINE Überarbeitung von
  Sofas, Decken, Wandgemälden, Leuchten oder Architektur in diesem Update.
- GLB-Import wurde mit unabhängiger 3D-Software validiert; Syntax- und Geometrieprüfungen
  sind durchgeführt. Ein iPhone-Safari-Livetest konnte nicht erfolgen.

TESTSCHRITTE
1. Nach GitHub-Veröffentlichung #cross-hall an die URL hängen.
2. Seitlich nach links und rechts zu den Konsolen gehen.
3. Vase/Blumen von vorn und seitlich betrachten: nicht flach.
4. Prüfen, dass keine Konsole im Sofa steht und Türen begehbar bleiben.
5. Am iPhone Bildrate und Darstellung aus mehreren Blickrichtungen prüfen.

COMMIT-ZUSAMMENFASSUNG
Cross Hall V6 – Echte GLB-Konsolentische, Porzellanvase und Hortensien

DETAILLIERTE INFORMATIONEN
Ersetzt zwei einfache Konsolen-Varianten und eine ältere Tisch-Vasen-Konstruktion
durch eigenständige detaillierte 3D-Geometrie mit PBR-Materialien. Möbel sind
verankert und kollidieren mit der Spielfigur; der Hauptrundgang bleibt erhalten.

WORKING COPY – REMOTE-REFERENZ
refs/heads/test/cross-hall-v6-real-3d

Force Push: Aus. Source-Branch: unverändert.
