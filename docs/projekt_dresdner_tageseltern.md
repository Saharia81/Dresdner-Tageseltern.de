# Projekt: Neue Website – Dresdner Tages Eltern e.V.

## 1. Hintergrund & Ausgangslage

Der **Verein Dresdner Tages Eltern** vertritt Tagesmütter und Tagesväter in Dresden. Durch einen anhaltenden **Geburtenknick** kämpfen viele Mitglieder darum, ihre Betreuungsplätze zu füllen. Gleichzeitig ist die **Kindertagespflege als Betreuungsform** bei vielen Eltern kaum bekannt – sie suchen primär nach „Kitaplatz" und kennen die Alternative nicht.

**Kernproblem:** Fehlende Bekanntheit + direkte Konkurrenz zu Kitas + hoher manueller Aufwand in der Vereinsverwaltung.

---

## 2. Ziel der neuen Website

Eine moderne, emotional ansprechende Website, die:
- **Eltern** (Schwangere, Eltern mit Kindern 0–3 Jahre) über Kindertagespflege aufklärt und begeistert
- **Mitglieder & Interessierte** mit relevanten Vereinsinformationen versorgt
- Den **administrativen Aufwand** für die Vereinsleitung drastisch reduziert

---

## 3. Zielgruppe

| Gruppe | Beschreibung |
|---|---|
| **Primär** | Schwangere & Eltern mit Kindern 0–3 Jahren in Dresden |
| **Sekundär** | Tagesmütter/-väter, die Vereinsmitglied werden möchten |

**Wie Eltern uns finden:**
- Google-Suche nach „Kitaplatz Dresden" (Tagespflege ist unbekannt → SEO wichtig)
- Mundpropaganda unter Eltern
- Flyer bei Hebammen, Kinderärzten, Bürgerbüros
- Instagram

---

## 4. USPs der Kindertagespflege (Kernbotschaften)

Diese Argumente sind der emotionale Kern der Website:

1. **Kleine Gruppe** – max. 5 Kinder, 1 Betreuungsperson → kein Kind geht unter
2. **Keine Schichten** – dieselbe Bezugsperson bringt das Kind morgens an und gibt es nachmittags zurück → maximale Bindungssicherheit
3. **Ruhige Atmosphäre** – deutlich leiser als große Kita-Gruppen → ideal für Kleinstkinder
4. **Starke Ersatzbetreuung** – bei Urlaub/Krankheit übernehmen bekannte Ersatztagesmütter; Betreuung bleibt gesichert
5. **Gleiche Kosten wie die Krippe** – keine Privatleistung, kein finanzieller Mehraufwand
6. **Idealer Start ins Leben** – mit 3 Jahren gestärkt und bereit für größere Einrichtungen

> ⚠️ **Wichtig:** Viele Eltern glauben fälschlicherweise, Tagespflege sei teurer als die Krippe. Dieser Mythos muss aktiv entkräftet werden.

---

## 5. Projektphasen

### Phase 1 – Neue Website (Priorität: JETZT)
- Emotionaler Auftritt für Eltern (0–3 Jahre)
- Klare Informationsseite für (zukünftige) Mitglieder
- Modernes Design, aktueller als bisherige WordPress/Elementor-Seite
- Grundlegende Mitgliederverwaltung mit **Admin-Bestätigung neuer Mitglieder**
- Steckbrief-Datenbank für Tagesmütter/-väter (strukturiert, pflegbar)

### Phase 2 – Banner-System automatisieren (nach Phase 1)
- Automatische Aktivierung des Tagesmutter-Steckbriefs beim Ausleihen eines Banners
- Automatische Deaktivierung bei Rückgabe
- Admin bestätigt: welches Mitglied, ab wann, bis wann
- QR-Code auf Banner verweist auf aktuellen Steckbrief → kein manueller Eingriff mehr nötig

### Phase 3 – Freie Plätze (Zukunft)
- Eltern können freie Betreuungsplätze direkt auf der Website finden
- Automatisierte Pflege durch Tagesmütter selbst

---

## 6. Technisches Setup

| | Details |
|---|---|
| **Umsetzung durch** | Vereinsleitung + Sohn (Wirtschaftsinformatik) |
| **Bisherige Plattform** | WordPress + Elementor |
| **Neue Plattform** | Noch offen – selbst entwickelt oder neues CMS |
| **Datenbank** | Aktuell: manuelle JSON-Datei → soll durch echte DB ersetzt werden |
| **Karte** | Tagesmütter werden auf einer Map angezeigt (Koordinaten nötig) |
| **Instagram** | Bisher manuelle Pflege parallel zur Website → Automatisierung wünschenswert |

---

## 7. Banner-System – Detailbeschreibung

```
Ablauf:
1. Tagesmutter meldet sich auf der Website an
2. Admin bestätigt: Mitgliedschaft + Banner-Leihdauer (z.B. 01.07. – 31.08.)
3. System schaltet automatisch den Steckbrief der TM auf den QR-Code der Website
4. Am Ende der Leihdauer: Steckbrief wird automatisch deaktiviert
5. Beim nächsten Ausleiher: neuer Steckbrief wird aktiviert
```

**Steckbrief enthält (Beispiel):**
- Name, Foto
- Betreuungszeiten
- Freie Plätze (Phase 3)
- Kontaktmöglichkeit

---

## 8. Aktuelles Problem (Alte Website)

- Steckbriefe werden **manuell** in WordPress eingepflegt
- Karten-Daten werden **manuell** in eine JSON-Datei eingetragen
- Banner-Verwaltung ist **komplett manuell** (zeitkritisch!)
- Parallel dazu manuelle Pflege auf **Instagram**
- Ergebnis: **zu hoher Zeitaufwand** für die Vereinsleitung

---

## 9. Offene Fragen / Nächste Schritte

- [ ] Welche Plattform/Technologie für den Neubau? (WordPress neu, individuell, etc.)
- [ ] Gibt es bereits ein Branding (Logo, Farben, Schriften)?
- [ ] Welche Seiten/Unterseiten sind geplant? (Sitemap)
- [ ] Soll Instagram-Pflege mitautomatisiert werden?
- [ ] Wer pflegt Steckbriefe der Tagesmütter – die TM selbst oder der Admin?
- [ ] Vernetzungsmodell: Soll das auf der Website erklärt werden?

---

*Erstellt: Mai 2026 | Status: In Planung*
