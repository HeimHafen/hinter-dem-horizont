HINTER DEM HORIZONT – CROSS HALL V3 / BEGEHBARER 3D-UMBAU
Datum: 15.11.2026

WAS IST DIESE VERSION?
Eine eigenständige, begehbare 3D-Ausarbeitung der vom Nutzer freigegebenen
Cross-Hall-Bildvorlage. Die dekorative Referenz ist in echte Meshes, Texturen,
Beleuchtungsobjekte und Kollisionsbereiche übersetzt. Die Bilddatei selbst
wird NICHT als flache Fototapete angezeigt.

WAS IST NEU GEGENÜBER V2?
- Hochaufgelöster, aufwendig gemusterter Marmorboden (16:8 in V2, jetzt 32:8
  annähernd quadratische Bodenplatten) mit verfeinertem PBR-Glanz
- Separate Marmortexturen für Wände und Säulen
- Fein gezeichneter roter Brokat-Läufer mit goldenen Ornamenten
- Zusätzliche Deckenrosetten und ornamentierte Friesbänder
- Zwei kristallreiche Leuchter; 720 instanzierte Kristalle pro Kronleuchter
- Überarbeitete Säulen, Nischen, Möbel, Blumen, Durchgänge und Beleuchtung
- 8 vor dem Rendern geladene Texturen: keine vorübergehend weißen Porträts
- Kollisionslogik entlang geschlossener Wandstücke, offenen Türen und Westportal
- Referenz-Kameraposition am Ostende, erster Blick entlang der Teppichachse
- Erhalt der Spielfigur, Außenwelt und Burg; keine Änderung an deren Dateien

WICHTIG: REALISMUS & 1:1
Das freigegebene Bild ist ein einzelnes synthetisches 2D-Motiv, keine
3D-Bauzeichnung. Die Version ist ein echter dreidimensionaler, spielbarer
NACHBAU der Anmutung. Eine pixelgenaue 1:1-Entsprechung aus jeder Kamera-
position und fotografische Materialien in Echtzeit sind mit diesem Stand
nicht nachgewiesen. Die historische Realität des Weißen Hauses ist noch
nicht raumweise vermessen. Nicht als exakte Rekonstruktion bezeichnen.

UPDATE EINPFLEGEN (empfohlen zunächst im Testbranch)
1. Vorher aktuelle Repository-Version sichern.
2. Im bestehenden GitHub-Repository die folgenden elf Pfade aus dem
   UPDATE-ZIP in den gleichen relativen Ordnern speichern.
3. 'index.html' ERSETZEN; 'cross-hall-v3.js' NEU HINZUFÜGEN;
   die 8 lokalen Texturdateien nach assets/crosshall/ übernehmen.
4. GitHub Pages vollständig deployen lassen. Kein Force Push.
5. Startlink: https://DEINE_GITHUB_PAGES_ADRESSE/index.html#cross-hall
   (oder an deine bestehende index.html-URL einfach #cross-hall anhängen).
6. Auf dem iPhone Richtungspfeile nutzen; auf Computer WASD oder Pfeiltasten.
   Mit Finger auf die Szene ziehen, um sich umzusehen.
   'Figur zeigen' schaltet zur Außenkamera. 'Zur Burg schauen' bleibt bestehen.
7. Sich im Flur über die Teppichachse bewegen, seitlich abbiegen, durch
   offene Türbereiche gehen und das Westportal testen.
8. Falls Safari noch alte Daten zeigt: Neu laden und GitHub-Pages-Cache prüfen.

DIE UPDATE-DATEIEN
index.html
cross-hall-v3.js
assets/crosshall/floor_marble_v3.jpg
assets/crosshall/wall_marble_v3.jpg
assets/crosshall/column_marble_v3.jpg
assets/crosshall/carpet_brocade_v3.jpg
assets/crosshall/ceiling_rosette_v3.png
assets/crosshall/carved_frieze_v3.png
assets/crosshall/portrait_links.jpg
assets/crosshall/portrait_rechts.jpg
README_CROSS_HALL_V3.txt [Dokumentation, NICHT ins Webprojekt zwingend]

WORKING COPY / GITHUB
Zusammenfassung:
Cross Hall V3 – begehbarer fotonaher 3D-Ausbau nach freigegebener Referenz

Detaillierte Informationen:
Neue PBR-Marmor-, Teppich- und Relieftexturen; kristallreiche Leuchter;
Deckenfriese, Türen, Wandprofile, dekorative Möbel; preloadbare
Porträttexturen; Kollisionsprüfung für begehbare Korridorabschnitte;
Referenz-Kameraposition; bestehende Burg, Spielfigur und Außenwelt erhalten.

Vorhandene oder neue Remote-Referenz:
refs/heads/test/cross-hall-v3

Force Push: AUS

DURCHGEFÜHRTE TECHNISCHE PRÜFUNGEN
- Node.js: Syntaxprüfungen für 3D-Modul und Hauptscript erfolgreich.
- Dynamischer 3D-Mock-Aufbau der Szene ohne Ausnahmen; 19 Hindernisdefinitionen.
- 8 automatische Wand-/Tür-Kollisionschecks erfolgreich.
- ZIP-Einträge, lokale Import-/Texturpfade und Dateiprüfsummen geprüft.
- Existierende Modell-/Burgdateien sind bitgenau gegenüber V2 erhalten.

NICHT PRÜFBAR HIER
Echter WebGL-Bildvergleich im iPhone-Safari, FPS/Hitze und Rendering unter
realer Beleuchtung. GitHub-Repository wurde NICHT automatisch verändert.
Bei optischen Abweichungen Screenshots vom echten iPhone-Test als Maßstab
für die nächste Feinkorrektur verwenden.
