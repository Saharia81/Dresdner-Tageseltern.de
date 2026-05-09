# Funktionen – Neue Website Dresdner Tages Eltern e.V.

---

## 1. Steckbrief-System

### Datenfelder pro Tagesmutter
| Feld | Pflicht | Hinweis |
|---|---|---|
| Foto der Tagesmutter | ✅ | Rundes Format wie im Beispiel |
| Fotos der Einrichtung/Konzeption | ✅ | Variable Anzahl |
| Name der Einrichtung | ❌ | Optional – nicht alle haben einen |
| Name der Tagesmutter | ✅ | |
| Adresse | ✅ | Wird auch für Karten-Pin verwendet |
| Telefonnummer | ✅ | |
| E-Mail | ✅ | |
| Öffnungszeiten | ✅ | |
| Ersatzbetreuungsmodell | ✅ | z.B. „Basis ETP" |
| Verpflegung | ✅ | z.B. „Ich koche selbst" |
| Website-Link | ❌ | Falls keine eigene Website → Link zum Elternportal der Stadt Dresden |
| Beratungsgebiet | ✅ | Malvina / Outdoor / Kinderland → bestimmt Pin-Farbe auf Karte |
| Koordinaten (lat/lng) | ✅ | Für Karten-Pin, manuell eingetragen |

### Verwaltung
- Steckbriefe werden **ausschließlich vom Admin gepflegt** – kein Mitglieder-Login
- Einheitliches Design für alle Steckbriefe
- Neue Mitglieder werden manuell in die Datenbank eingetragen (Admin + Kollegin)

---

## 2. Karte

- Alle Tagesmütter werden als **farbige Pins** auf einer Karte angezeigt
- **3 Farben** je nach Beratungsgebiet:
  - 🔵 Malvina
  - 🟠 Outdoor  
  - 🔴 Kinderland
- **3 zusätzliche feste Pins** für die Beratungsstellen selbst
- Klick auf Pin → öffnet Steckbrief der jeweiligen Tagesmutter
- Pin-Farbe wird beim Einpflegen des Mitglieds in der Datenbank hinterlegt

---

## 3. Banner-System

### Ablauf

```
1. Tagesmutter öffnet Buchungskalender auf der Website
2. Sie sieht welche der 4 Banner wann frei sind
3. Sie wählt Zeitraum und Banner → sendet Buchungsanfrage
4. Admin erhält automatische Benachrichtigung
5. Admin bestätigt: welches Mitglied + welcher Banner
6. System aktiviert automatisch den Steckbrief der Tagesmutter
   auf der QR-Code-Seite des jeweiligen Banners
7. Am Ende des Buchungszeitraums → Steckbrief automatisch deaktiviert
```

### QR-Code Seite (pro Banner)
Jeder der 4 Banner hat eine eigene URL. Der Inhalt dieser Seite wechselt automatisch je nach aktueller Buchung und enthält:
- Steckbrief der aktuell buchenden Tagesmutter
- Hinweis auf andere Tagesmütter im Verein
- Link zur Steckbrief-Übersicht und Karte auf der Hauptwebsite

### Buchungskalender
- Übersicht aller 4 Banner
- Gebuchte Zeiträume sind sichtbar
- Freie Zeiträume können direkt gebucht werden
- Warteliste: nicht nötig – Tagesmutter wählt freien Zeitraum selbst

### Admin-Funktionen
- Benachrichtigung bei neuer Buchungsanfrage (E-Mail)
- Bestätigung per Klick: Mitglied auswählen → System läuft automatisch
- Übersicht aller aktiven und kommenden Buchungen

---

## 4. Neuigkeiten / Blog

- Einfacher Blog-Bereich im Mitgliederbereich
- Nur vom Admin pflegbar
- Beiträge zu: neuen Flyern, Aktionen, Vereinsterminen, Neuigkeiten
- Kein Kommentarbereich nötig

---

## 5. Aktionswoche

- Eigene Unterseite unter „Für Eltern"
- Jährlich im Mai aktuell gehalten
- Vorstellung der aktuellen Aktionen
- Optionaler Rückblick auf vergangene Jahre
- Vom Admin gepflegt

---

## 6. Downloads (Mitglied werden)

- Vereinssatzung (PDF)
- Beitragsordnung (PDF)
- Mitgliedsantrag (PDF zum Ausdrucken)

---

## 7. Kontakt & Social Media

- E-Mail-Adresse sichtbar auf der Website (kein Kontaktformular)
- Link zu Instagram auf jeder Seite (Footer + ggf. Header)
- Kein Newsletter, kein Chat, keine weiteren Kanäle

---

## 8. Technische Anforderungen

| Anforderung | Details |
|---|---|
| **Mobile first** | Eltern suchen primär über Smartphone |
| **Datenschutz** | Alle Fotos KI-generiert – keine echten Kindergesichter |
| **DSGVO** | Datenschutzerklärung + Impressum Pflicht |
| **SEO** | Begriffe wie „Kitaplatz Dresden", „Kinderbetreuung 0-3 Dresden" |
| **Analytics** | Datenschutzkonforme Lösung empfohlen (z.B. Matomo) |
| **Datenbank** | Zentrale Datenbank für alle Mitgliederdaten (ersetzt bisherige JSON-Datei) |

---

## Phasen-Zuordnung

| Funktion | Phase |
|---|---|
| Steckbrief-Übersicht + Karte | Phase 1 |
| Neuigkeiten / Blog | Phase 1 |
| Aktionswoche | Phase 1 |
| Downloads | Phase 1 |
| Über uns / Vorstand | Phase 1 |
| Banner-Buchungssystem (automatisiert) | Phase 2 |
| Freie Plätze anzeigen & filtern | Phase 3 |

---

*Erstellt: Mai 2026 | Status: In Abstimmung*
