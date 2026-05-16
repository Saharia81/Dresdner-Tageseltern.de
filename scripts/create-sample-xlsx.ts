// Erstellt eine Beispiel-mitglieder.xlsx mit fiktiven Tagesmüttern an
// echten Dresdner Adressen, damit das Geocoding (Nominatim) Treffer findet.
//
// Ausführung:  npx tsx scripts/create-sample-xlsx.ts

import { resolve } from "node:path";
import * as XLSX from "xlsx";

type Zeile = {
  Vorname: string;
  Nachname: string;
  Einrichtungsname: string;
  "Straße": string;
  PLZ: string;
  Stadtteil: string;
  Telefon: string;
  "E-Mail": string;
  Website: string;
  "Öffnungszeiten": string;
  Verpflegung: "Ich koche selbst" | "Catering";
  Ersatzbetreuung: string;
  Beratungsstelle: "Malwina" | "Outlaw" | "Kinderland";
  Schmetterling: "ja" | "nein";
  "Schmetterling-Partnername": string;
  Mitgliedsnummer: string;
  "Mitglied seit": string;
};

const zeilen: Zeile[] = [
  {
    Vorname: "Anna",
    Nachname: "Schmidt",
    Einrichtungsname: "Bei Anna in der Neustadt",
    "Straße": "Alaunstraße 36",
    PLZ: "01099",
    Stadtteil: "Äußere Neustadt",
    Telefon: "0351 1234567",
    "E-Mail": "anna.schmidt@example.test",
    Website: "https://anna-tagespflege.example.test",
    "Öffnungszeiten": "Mo–Fr 7:30–16:30 Uhr",
    Verpflegung: "Ich koche selbst",
    Ersatzbetreuung: "Vertretung durch Kollegin Maria Krause",
    Beratungsstelle: "Malwina",
    Schmetterling: "ja",
    "Schmetterling-Partnername": "Maria Krause",
    Mitgliedsnummer: "M-001",
    "Mitglied seit": "01.03.2018",
  },
  {
    Vorname: "Birgit",
    Nachname: "Müller",
    Einrichtungsname: "Spatzennest",
    "Straße": "Bischofsweg 12",
    PLZ: "01099",
    Stadtteil: "Äußere Neustadt",
    Telefon: "0351 2345678",
    "E-Mail": "birgit.mueller@example.test",
    Website: "",
    "Öffnungszeiten": "Mo–Fr 7:00–17:00 Uhr",
    Verpflegung: "Catering",
    Ersatzbetreuung: "Krankheitsvertretung über den Verein organisiert",
    Beratungsstelle: "Outlaw",
    Schmetterling: "nein",
    "Schmetterling-Partnername": "",
    Mitgliedsnummer: "M-002",
    "Mitglied seit": "15.09.2020",
  },
  {
    Vorname: "Carolin",
    Nachname: "Becker",
    Einrichtungsname: "Kleine Entdecker",
    "Straße": "Kesselsdorfer Straße 50",
    PLZ: "01159",
    Stadtteil: "Löbtau",
    Telefon: "0351 3456789",
    "E-Mail": "carolin.becker@example.test",
    Website: "https://kleine-entdecker.example.test",
    "Öffnungszeiten": "Mo–Do 8:00–16:00 Uhr, Fr 8:00–14:00 Uhr",
    Verpflegung: "Ich koche selbst",
    Ersatzbetreuung: "Vertretung durch Großeltern, mit Kindern bekannt",
    Beratungsstelle: "Kinderland",
    Schmetterling: "ja",
    "Schmetterling-Partnername": "Daniela Walter",
    Mitgliedsnummer: "M-003",
    "Mitglied seit": "01.01.2019",
  },
  {
    Vorname: "Daniela",
    Nachname: "Walter",
    Einrichtungsname: "Sonnenkäfer",
    "Straße": "Kesselsdorfer Straße 53",
    PLZ: "01159",
    Stadtteil: "Löbtau",
    Telefon: "0351 4567890",
    "E-Mail": "daniela.walter@example.test",
    Website: "",
    "Öffnungszeiten": "Mo–Fr 7:30–16:00 Uhr",
    Verpflegung: "Ich koche selbst",
    Ersatzbetreuung: "Schmetterling-Partnerschaft mit Carolin Becker",
    Beratungsstelle: "Kinderland",
    Schmetterling: "ja",
    "Schmetterling-Partnername": "Carolin Becker",
    Mitgliedsnummer: "M-004",
    "Mitglied seit": "01.06.2019",
  },
  {
    Vorname: "Elke",
    Nachname: "Hoffmann",
    Einrichtungsname: "Bei Elke in Striesen",
    "Straße": "Schandauer Straße 64",
    PLZ: "01277",
    Stadtteil: "Striesen",
    Telefon: "0351 5678901",
    "E-Mail": "elke.hoffmann@example.test",
    Website: "https://bei-elke.example.test",
    "Öffnungszeiten": "Mo–Fr 7:00–16:30 Uhr",
    Verpflegung: "Ich koche selbst",
    Ersatzbetreuung: "Vertretung durch erfahrene Tagesmutter aus Nachbarschaft",
    Beratungsstelle: "Malwina",
    Schmetterling: "nein",
    "Schmetterling-Partnername": "",
    Mitgliedsnummer: "M-005",
    "Mitglied seit": "01.04.2021",
  },
  {
    Vorname: "Friederike",
    Nachname: "Lange",
    Einrichtungsname: "Bärchengruppe",
    "Straße": "Königsbrücker Straße 96",
    PLZ: "01099",
    Stadtteil: "Äußere Neustadt",
    Telefon: "0351 6789012",
    "E-Mail": "friederike.lange@example.test",
    Website: "",
    "Öffnungszeiten": "Mo–Fr 8:00–17:00 Uhr",
    Verpflegung: "Catering",
    Ersatzbetreuung: "Über Beratungsstelle organisiert",
    Beratungsstelle: "Outlaw",
    Schmetterling: "nein",
    "Schmetterling-Partnername": "",
    Mitgliedsnummer: "M-006",
    "Mitglied seit": "01.10.2022",
  },
];

const ausgabe = resolve(process.cwd(), "mitglieder.xlsx");

const sheet = XLSX.utils.json_to_sheet(zeilen);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, sheet, "Mitglieder");
XLSX.writeFile(workbook, ausgabe);

console.log(`✅ Beispiel-Datei erstellt: ${ausgabe}`);
console.log(`   ${zeilen.length} Tagesmütter`);
console.log(`\nNächster Schritt: npm run import:excel`);
