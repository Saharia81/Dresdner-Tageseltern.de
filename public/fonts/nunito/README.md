# Nunito-Schriftdateien

Diese Dateien werden noch benötigt (DSGVO-konform lokal, **nicht** über Google Fonts CDN):

- `Nunito-Regular.woff2` (400)
- `Nunito-SemiBold.woff2` (600)
- `Nunito-Bold.woff2` (700)
- `Nunito-ExtraBold.woff2` (800)

## So beschaffst du sie

1. Gehe zu https://fonts.google.com/specimen/Nunito
2. Klick auf "Get font" → "Download all"
3. Aus dem ZIP die `static/`-Dateien `.ttf` nehmen oder besser direkt **woff2 konvertieren** (z.B. via https://transfonter.org/ – nur Latin Subset auswählen, das spart KB).
4. Die vier `.woff2`-Dateien in genau diesem Ordner ablegen, mit den oben genannten Dateinamen.

Solange die Dateien fehlen, fällt der Browser auf System-Sans-Serif zurück (Layout funktioniert trotzdem, sieht nur weniger warm aus).
