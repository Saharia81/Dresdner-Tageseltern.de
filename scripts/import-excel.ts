// Import-Skript: liest mitglieder.xlsx und legt Tagesmütter in der DB an.
//
// Ausführung:  npm run import:excel
// oder:        npx tsx scripts/import-excel.ts
//
// Erwartete Spalten in der Excel-Datei (erste Zeile = Überschriften):
//   Vorname, Nachname, Einrichtungsname, Straße, PLZ, Stadtteil,
//   Telefon, E-Mail, Website, Öffnungszeiten, Verpflegung,
//   Ersatzbetreuung, Beratungsstelle, Schmetterling, Schmetterling-Partnername,
//   Mitgliedsnummer, Mitglied seit
//
// Werte:
//   Verpflegung:      "Ich koche selbst" | "Catering"
//   Beratungsstelle:  "Malwina" | "Outlaw" | "Kinderland"
//   Schmetterling:    "ja" | "nein"
//
// Duplikate (gleiche E-Mail) werden übersprungen.
// Nach dem Import werden Latitude/Longitude via OpenStreetMap-Nominatim
// für alle Tagesmütter ohne Koordinaten ergänzt (max. 1 Request/Sekunde
// gemäß Nominatim-Nutzungsbedingungen).

import "dotenv/config";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as XLSX from "xlsx";
import { PrismaClient, Prisma } from "@prisma/client";

const EXCEL_PFAD = resolve(process.cwd(), "mitglieder.xlsx");
const PLATZHALTER_FOTO = "/images/steckbriefe/placeholder.svg";
const NOMINATIM_USER_AGENT =
  "DresdnerTageselternImport/1.0 (info@dresdner-tageseltern.de)";

const prisma = new PrismaClient();

// ----------------------------------------------------------------
// Helfer
// ----------------------------------------------------------------

function str(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function strOrNull(value: unknown): string | null {
  const s = str(value);
  return s.length === 0 ? null : s;
}

function slugify(...teile: string[]): string {
  return teile
    .join("-")
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseSchmetterling(value: unknown): boolean {
  const s = str(value).toLowerCase();
  return s === "ja" || s === "yes" || s === "true" || s === "1";
}

function parseVerpflegung(value: unknown): "SELBST_GEKOCHT" | "CATERING" {
  const s = str(value).toLowerCase();
  if (s.includes("cater")) return "CATERING";
  return "SELBST_GEKOCHT"; // Fallback: "Ich koche selbst"
}

function parseBeratungsstelle(
  value: unknown,
): "MALWINA" | "OUTLAW" | "KINDERLAND" {
  const s = str(value).toLowerCase();
  if (s.includes("malwina") || s.includes("malvina")) return "MALWINA";
  if (s.includes("outlaw") || s.includes("outdoor")) return "OUTLAW";
  if (s.includes("kinderland")) return "KINDERLAND";
  throw new Error(`Unbekannte Beratungsstelle: "${value}"`);
}

function parseDatum(value: unknown): Date | null {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date) return value;
  if (typeof value === "number") {
    // Excel-Seriennummer → Date (gilt für cellDates:false-Fall)
    const epoch = Date.UTC(1899, 11, 30);
    return new Date(epoch + value * 86_400_000);
  }
  const s = str(value);
  // Versuch: TT.MM.JJJJ
  const de = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(s);
  if (de) {
    const [, tag, monat, jahr] = de;
    return new Date(Number(jahr), Number(monat) - 1, Number(tag));
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function pflicht(value: string, feld: string, zeile: number): string {
  if (value.length === 0) {
    throw new Error(`Zeile ${zeile}: Pflichtfeld "${feld}" ist leer.`);
  }
  return value;
}

// ----------------------------------------------------------------
// Geocoding via Nominatim (OpenStreetMap)
// ----------------------------------------------------------------

async function geocode(
  strasse: string,
  plz: string,
  stadt: string = "Dresden",
): Promise<{ latitude: number; longitude: number } | null> {
  const params = new URLSearchParams({
    street: strasse,
    postalcode: plz,
    city: stadt,
    country: "Germany",
    format: "json",
    limit: "1",
  });
  const url = `https://nominatim.openstreetmap.org/search?${params}`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": NOMINATIM_USER_AGENT },
    });
    if (!res.ok) {
      console.warn(
        `  ⚠ Geocoding-Fehler (HTTP ${res.status}) für ${strasse}, ${plz}`,
      );
      return null;
    }
    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (data.length === 0) {
      console.warn(`  ⚠ Keine Koordinaten gefunden für ${strasse}, ${plz}`);
      return null;
    }
    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };
  } catch (err) {
    console.warn(`  ⚠ Geocoding fehlgeschlagen für ${strasse}, ${plz}:`, err);
    return null;
  }
}

const wartezeit = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ----------------------------------------------------------------
// Hauptlauf
// ----------------------------------------------------------------

type Zeile = Record<string, unknown>;

async function importiereExcel(): Promise<void> {
  if (!existsSync(EXCEL_PFAD)) {
    console.error(`❌ Excel-Datei nicht gefunden: ${EXCEL_PFAD}`);
    console.error(
      `   Bitte mitglieder.xlsx im Projekt-Stammverzeichnis ablegen.`,
    );
    process.exit(1);
  }

  console.log(`📂 Lese ${EXCEL_PFAD}\n`);
  const buffer = readFileSync(EXCEL_PFAD);
  const workbook = XLSX.read(buffer, { cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const zeilen = XLSX.utils.sheet_to_json<Zeile>(sheet, { defval: "" });

  console.log(`📋 ${zeilen.length} Zeilen gefunden.\n`);

  let neu = 0;
  let uebersprungen = 0;
  const slugZaehler = new Map<string, number>();

  for (let i = 0; i < zeilen.length; i++) {
    const z = zeilen[i];
    const zeilenNr = i + 2; // +1 für Header, +1 für 1-basiert

    try {
      const email = pflicht(str(z["E-Mail"]), "E-Mail", zeilenNr);

      // Duplikat-Check
      const vorhanden = await prisma.tagesmutter.findUnique({
        where: { email },
      });
      if (vorhanden) {
        console.log(`⏭  Zeile ${zeilenNr}: ${email} existiert bereits.`);
        uebersprungen++;
        continue;
      }

      const vorname = pflicht(str(z["Vorname"]), "Vorname", zeilenNr);
      const nachname = pflicht(str(z["Nachname"]), "Nachname", zeilenNr);

      // Eindeutigen Slug erzeugen (bei Namensgleichheit -2, -3, ...)
      let slug = slugify(vorname, nachname);
      const n = (slugZaehler.get(slug) ?? 0) + 1;
      slugZaehler.set(slug, n);
      if (n > 1) slug = `${slug}-${n}`;
      // Auch DB-Kollisionen abfangen (z.B. wenn zweimal importiert wird)
      while (await prisma.tagesmutter.findUnique({ where: { slug } })) {
        slug = `${slug}-x`;
      }

      const daten: Prisma.TagesmutterCreateInput = {
        slug,
        vorname,
        nachname,
        einrichtungsname: pflicht(
          str(z["Einrichtungsname"]),
          "Einrichtungsname",
          zeilenNr,
        ),
        fotoUrl: PLATZHALTER_FOTO,
        einrichtungsfotoUrls: [],
        strasse: pflicht(str(z["Straße"]), "Straße", zeilenNr),
        plz: pflicht(str(z["PLZ"]), "PLZ", zeilenNr),
        stadtteil: pflicht(str(z["Stadtteil"]), "Stadtteil", zeilenNr),
        telefon: pflicht(str(z["Telefon"]), "Telefon", zeilenNr),
        email,
        websiteUrl: strOrNull(z["Website"]),
        oeffnungszeiten: pflicht(
          str(z["Öffnungszeiten"]),
          "Öffnungszeiten",
          zeilenNr,
        ),
        ersatzbetreuung: pflicht(
          str(z["Ersatzbetreuung"]),
          "Ersatzbetreuung",
          zeilenNr,
        ),
        verpflegung: parseVerpflegung(z["Verpflegung"]),
        beratungsgebiet: parseBeratungsstelle(z["Beratungsstelle"]),
        schmetterling: parseSchmetterling(z["Schmetterling"]),
        schmetterlingPartner: strOrNull(z["Schmetterling-Partnername"]),
        mitgliedsnummer: strOrNull(z["Mitgliedsnummer"]),
        mitgliedSeit: parseDatum(z["Mitglied seit"]),
      };

      await prisma.tagesmutter.create({ data: daten });
      console.log(`✅ Zeile ${zeilenNr}: ${vorname} ${nachname} angelegt.`);
      neu++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`❌ Zeile ${zeilenNr}: ${msg}`);
    }
  }

  console.log(`\n📊 Import: ${neu} neu, ${uebersprungen} übersprungen.\n`);

  // ------------------------------------------------------------
  // Geocoding für alle ohne Koordinaten
  // ------------------------------------------------------------

  const ohneKoordinaten = await prisma.tagesmutter.findMany({
    where: { latitude: null },
    select: {
      id: true,
      strasse: true,
      plz: true,
      stadtteil: true,
      vorname: true,
      nachname: true,
    },
  });

  if (ohneKoordinaten.length === 0) {
    console.log("📍 Alle Tagesmütter haben bereits Koordinaten.");
  } else {
    console.log(`📍 Geocoding für ${ohneKoordinaten.length} Adressen...\n`);

    for (const tm of ohneKoordinaten) {
      const ergebnis = await geocode(tm.strasse, tm.plz);
      if (ergebnis) {
        await prisma.tagesmutter.update({
          where: { id: tm.id },
          data: {
            latitude: ergebnis.latitude,
            longitude: ergebnis.longitude,
          },
        });
        console.log(
          `  ✅ ${tm.vorname} ${tm.nachname}: ${ergebnis.latitude.toFixed(5)}, ${ergebnis.longitude.toFixed(5)}`,
        );
      }
      // Nominatim-Nutzungsbedingungen: max. 1 Request/Sekunde
      await wartezeit(1100);
    }
  }

  console.log("\n✨ Fertig.");
}

importiereExcel()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
