HINTER DEM HORIZONT — CROSS HALL V4
------------------------------------
Stand: 15.11.2026 | Grundlage: letztes im Chat bereitgestelltes vollständiges
Cross-Hall-V3-Spielpaket. Live-Link https://heimhafen.github.io/hinter-dem-horizont/
ließ sich bei der Prüfung NICHT direkt abrufen. Es ist deshalb NICHT bestätigt,
dass die Onlineversion bytegleich mit V3 ist.

ZIEL
3D-Rundgang auf Grundlage der freigegebenen fotorealistischen Bildreferenz,
mit besserer räumlicher Wirkung, ruhigeren Materialien und iPhone-Bedienung.
Keine Fototapete: Der Flur bleibt ein echtes, begehbares Three.js-3D-Modell.

NEUERUNGEN V3 -> V4
• Vier zusätzliche lokale PBR-Detailmaps für polierten Marmorboden, Wandmarmor,
  Teppichfaser-Normalen und Bodenrauigkeit.
• Materialabstimmung: zurückhaltender Marmor-Glanz, realistischere Goldtöne,
  feinere Kristallreflexe und gebrochene Lichtwirkung.
• Mehrschichtige Stuckgesimse, kassettiertes Deckenraster, Pilasterkapitelle,
  zusätzliche kleine Wandleuchten und verfeinerte Möbelkanten.
• Dezent angepasste Innenraumbeleuchtung, zusätzlicher warmer Lichtakzent am
  Durchgang; die Beleuchtung der Außenwelt ist unangetastet.
• Kompaktere Bedienoberfläche auf schmalen Mobilbildschirmen; die vorhandenen
  Bewegungs- und Ansichtsbuttons bleiben erhalten.
• Beibehaltener Startlink #cross-hall mit leicht optimiertem Blickwinkel.
• V3-Dateien der übrigen Spielwelt einschließlich Burg, GLB-Modelle und
  Spielfigur bleiben unverändert.

WAS NOCH NICHT 1:1 IST
Ein einzelnes generiertes Referenzbild liefert keinen realen, maßstabsgetreuen
3D-Grundriss. Dieses Update ist ein realistischerer, begehbarer 3D-Nachbau,
aber KEINE fotorealistische Pixelidentität und KEINE historisch exakte
Rekonstruktion des Weißen Hauses. Der ältere Oval-Office-Spielraum liegt
weiter am Cross-Hall-Bereich; historisch läge hier auf der State Floor der
Blue Room. Die falsche Bezeichnung "Blue Room" wurde nicht über die
unverändert oval-office-artige Einrichtung gelegt.

EMPFOHLENE INSTALLATION
1. Den aktuellen GitHub-Stand sichern. Keine Dateien vorher löschen.
2. Einen neuen TESTBRANCH anlegen, ohne den Live-Branch zu überschreiben.
3. Wenn im Repository V3 bereits vorhanden ist, folgende SECHS Pfade aus dem
   Updatepaket kopieren bzw. ersetzen:
   index.html                                   ERSETZEN
   cross-hall-v4.js                             HINZUFÜGEN
   assets/crosshall/floor_normal_v4.jpg         HINZUFÜGEN
   assets/crosshall/floor_roughness_v4.jpg      HINZUFÜGEN
   assets/crosshall/wall_normal_v4.jpg          HINZUFÜGEN
   assets/crosshall/carpet_normal_v4.jpg        HINZUFÜGEN
4. Wenn ein älterer Spielstand live ist oder V3-Dateien fehlen, statt des
   kleinen Updates das KOMPLETTPAKET im Testbranch verwenden. Bestehende
   Dateien vorher sichern.
5. GitHub Pages auf Testbranch oder Testverzeichnis konfigurieren. Den
   neuen Stand mit .../index.html#cross-hall öffnen.
6. Auf dem iPhone Safari: Blick entlang des Teppichs, Vor-/Rückwärts,
   seitliche Türen, Westportal, Figur zeigen, Zur Burg schauen sowie
   andere Spielbereiche prüfen. Auf iPhone und Desktop testen.
7. Erst nach Sichtprüfung ggf. nach main übernehmen. Force Push: AUS.

EINTRÄGE FÜR WORKING COPY
Zusammenfassung:
Cross Hall V4 – Materialrealismus, Architekturdetails und Mobil-UI

Detaillierte Informationen:
PBR-Normal- und Rauigkeitsmaps ergänzt; Marmorboden, Teppich und Gold
abgestimmt; Wandleuchten und klassische Stuckdetails ausgebaut; mobile
Spieloberfläche gestrafft; vorhandene Begehbarkeit, Kollisionen und übrige
Spielwelt erhalten. Vor Übernahme in main iPhone-Safari prüfen.

Vorhandene oder neue Remote-Referenz:
refs/heads/test/cross-hall-v4

Source-Branch: unverändert. Force Push: AUS.

TECHNISCHE TESTS
• Syntax (Node.js): Hauptscript, Cross-Hall-V4-Modul und sonstige JS-Dateien.
• 3D-Bautest mit Three.js-kompatiblen Objekt-Mocks: 270 Raumobjekte,
  66 Instanzierungsbatches, 19 Hindernisdefinitionen, ohne Ausnahme.
• 8 Positions- und Kollisionstests für Wände, Teppichachse und Durchgang.
• DOM-/CSS-Positionen für 320×640, 390×844, 430×932 und 874×402 überprüft.
• Lokale Import-/Assetpfade und ZIP-Prüfsummen validiert.
• Burg- und Spielfigur-Dateien gegen V3 auf unveränderte Prüfsummen geprüft.

NICHT DURCHGEFÜHRT
Echter Three.js/WebGL-Live-Rendervergleich auf dem iPhone, FPS-/Hitzeprüfung,
Gegenprüfung der aktuellen GitHub-Pages-Auslieferung sowie echter GitHub-Push.
Der Teststand muss deshalb vor Veröffentlichung im Browser abgenommen werden.
