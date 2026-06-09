# Bilder der Tagesmütter

Pro Mitglied gibt es einen Ordner, benannt nach der **Mitgliedsnummer + 1000**:

- Mitglied `01` → Ordner `1001`
- Mitglied `02` → Ordner `1002`
- usw.

## Aufbau eines Ordners

```
1001/
  profilbild.jpg      ← rundes Hauptfoto für den Steckbrief
  galerie/
    1.jpg             ← Galeriebilder, fortlaufend nummeriert
    2.jpg
    3.jpg
```

## Hinweise

- Das Profilbild **muss** `profilbild.jpg` heißen (auch `.jpeg`/`.png`/`.webp`/`.avif` werden erkannt).
- Galeriebilder fortlaufend `1`, `2`, `3` … benennen.
- Fehlt `profilbild.jpg`, zeigt der Steckbrief automatisch den Platzhalter.
- Die Bilder werden **automatisch** aus diesem Ordner erkannt – es müssen keine
  Pfade mehr im Admin-Bereich eingetragen werden. Einlegen (bzw. committen)
  genügt. Die Zuordnung erfolgt über die Mitgliedsnummer (`<nr>` = Nummer + 1000),
  siehe `src/lib/tagesmutter-bilder.ts`.
