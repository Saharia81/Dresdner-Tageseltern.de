// Import-Skript: liest mitglieder.xlsx (Mitgliederverwaltungs-Liste) und legt
// die Tagesmütter-Steckbriefe in der Datenbank an / aktualisiert sie.
//
// Ausführung:  npm run import:excel
// oder:        npx tsx scripts/import-excel.ts
//
// Die Excel hat feste Spaltenpositionen (Mitgliederverwaltung). Gelesen wird
// per Spaltenindex, nicht per Überschrift – Überschriften enthalten Doppel-
// punkte/Umbrüche und sind unzuverlässig.
//
// Spalten (0-basiert):
//   0  Mitglied (01,02,…)        1  Stadtgebiet        2  Vorname   3 Nachname
//   4  Anschrift                 5  PLZ                6  Ort        7 Telefon
//   8  E-Mail                    9  Beitrittsdatum     10 Austrittsdatum
//   13 Mitgliedschaft            18 Einrichtungsname   19 Website
//   20 Öffnungszeiten            21 Verpflegung        22 Ersatzbetreuung
//   23 Beratungsstelle           24 Schmetterling      25 Schmetterling-Partner
//   26 Latitude                  27 Longitude          28 Onlineanmeldung
//   29 Ersatztagespflegeperson
//
// Regeln (siehe auch Vereinsabsprachen):
//   - Mitgliedsnummer "01" → 1001, "02" → 1002 … (Zahlanteil + 1000).
//     Dient zugleich als Name des Bilder-Ordners public/images/tagesmuetter/<n>.
//   - PLZ wird auf 5 Stellen mit führender Null aufgefüllt (1277 → 01277).
//   - istAktiv = false (nicht auf der Karte), wenn EINES zutrifft:
//       * Austrittsdatum gesetzt
//       * Ersatztagespflegeperson == "ja" (selbst Ersatzperson)
//       * Mitgliedschaft == "Einfach"
//       * Steckbrief unvollständig (Öffnungszeiten oder Beratungsstelle fehlen)
//   - Einrichtungsname & Ersatzbetreuung sind optional.
//   - Verpflegung: "ich koche selbst/selber" → SELBST_GEKOCHT, "Catering" →
//     CATERING. Sonderfälle (z. B. Nr. 05 "Mittagessen aus der Pflegeresidenz")
//     siehe SONDERFALL_VERPFLEGUNG.
//   - Foto: public/images/tagesmuetter/<n>/profilbild.(jpg|jpeg|png); sonst
//     Platzhalter. Galerie: galerie/1.*, 2.* … in numerischer Reihenfolge.
//   - Geocoding via Nominatim für aktive Tagesmütter ohne Koordinaten
//     (max. 1 Request/Sekunde gemäß Nutzungsbedingungen).

import "dotenv/config";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve, join, parse as parsePath } from "node:path";
import * as XLSX from "xlsx";
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const EXCEL_PFAD = resolve(process.cwd(), "mitglieder.xlsx");
const BILDER_BASIS = resolve(process.cwd(), "public", "images", "tagesmuetter");
const PLATZHALTER_FOTO = "/images/steckbriefe/placeholder.svg";
const NOMINATIM_USER_AGENT =
  "DresdnerTageselternImport/1.0 (info@dresdner-tageseltern.de)";

// Beratungsstelle, die ausgetragen/inaktiv angelegte Datensätze als Pflicht-
// Enum brauchen (wird nie angezeigt, da istAktiv=false).
const DEFAULT_GEBIET: "MALWINA" | "OUTLAW" | "KINDERLAND" = "MALWINA";

// Verpflegungs-Sonderfälle, die nicht in die zwei Standard-Kategorien passen.
// Schlüssel = Ordner-/Mitgliedsnummer (1000 + Mitglied). Wert: Enum für den
// Filter + exakter Anzeigetext.
const SONDERFALL_VERPFLEGUNG: Record<
  number,
  { enum: "SELBST_GEKOCHT" | "CATERING"; text: string }
> = {
  1005: { enum: "CATERING", text: "Mittagessen aus der Pflegeresidenz" },
};

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Spaltenindizes
const C = {
  mitglied: 0,
  stadtgebiet: 1,
  vorname: 2,
  nachname: 3,
  anschrift: 4,
  plz: 5,
  ort: 6,
  telefon: 7,
  email: 8,
  beitritt: 9,
  austritt: 10,
  mitgliedschaft: 13,
  einrichtung: 18,
  website: 19,
  oeffnungszeiten: 20,
  verpflegung: 21,
  ersatzbetreuung: 22,
  beratung: 23,
  schmetterling: 24,
  schmetterlingPartner: 25,
  latitude: 26,
  longitude: 27,
  onlineanmeldung: 28,
  ersatzperson: 29,
} as const;

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

function numOrNull(value: unknown): number | null {
  const s = str(value).replace(",", ".");
  if (s.length === 0) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
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

// "01" → 1001, "12" → 1012. Gibt null bei nicht-numerischem Wert.
function ordnerNummer(mitglied: unknown): number | null {
  const ziffern = str(mitglied).replace(/\D/g, "");
  if (ziffern.length === 0) return null;
  return 1000 + Number(ziffern);
}

function plzPad(value: unknown): string {
  const ziffern = str(value).replace(/\D/g, "");
  return ziffern.padStart(5, "0");
}

function parseSchmetterling(value: unknown): boolean {
  const s = str(value).toLowerCase();
  return s === "ja" || s === "yes" || s === "true" || s === "1";
}

function parseVerpflegung(value: unknown): "SELBST_GEKOCHT" | "CATERING" {
  const s = str(value).toLowerCase();
  if (s.includes("cater")) return "CATERING";
  return "SELBST_GEKOCHT"; // "ich koche selbst" / "selber" / Standardfall
}

function parseBeratungsstelle(
  value: unknown,
): "MALWINA" | "OUTLAW" | "KINDERLAND" | null {
  const s = str(value).toLowerCase();
  if (s.length === 0) return null;
  if (s.includes("malwina") || s.includes("malvina")) return "MALWINA";
  if (s.includes("outlaw")) return "OUTLAW";
  if (s.includes("kinderland")) return "KINDERLAND";
  return null;
}

function parseDatum(value: unknown): Date | null {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date) return value;
  if (typeof value === "number") {
    const epoch = Date.UTC(1899, 11, 30);
    return new Date(epoch + value * 86_400_000);
  }
  const s = str(value);
  const de = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(s);
  if (de) {
    const [, tag, monat, jahr] = de;
    return new Date(Number(jahr), Number(monat) - 1, Number(tag));
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

// ----------------------------------------------------------------
// Bilder aus dem Ordner ermitteln
// ----------------------------------------------------------------

const BILD_ENDUNGEN = [".jpg", ".jpeg", ".png", ".webp"];

function findeProfilbild(nr: number): string | null {
  const ordner = join(BILDER_BASIS, String(nr));
  if (!existsSync(ordner)) return null;
  for (const datei of readdirSync(ordner)) {
    const p = parsePath(datei);
    if (
      p.name.toLowerCase() === "profilbild" &&
      BILD_ENDUNGEN.includes(p.ext.toLowerCase())
    ) {
      return `/images/tagesmuetter/${nr}/${datei}`;
    }
  }
  return null;
}

function findeGalerie(nr: number): string[] {
  const ordner = join(BILDER_BASIS, String(nr), "galerie");
  if (!existsSync(ordner)) return [];
  return readdirSync(ordner)
    .map((datei) => ({ datei, p: parsePath(datei) }))
    .filter(({ p }) => BILD_ENDUNGEN.includes(p.ext.toLowerCase()))
    .filter(({ p }) => /^\d+$/.test(p.name))
    .sort((a, b) => Number(a.p.name) - Number(b.p.name))
    .map(({ datei }) => `/images/tagesmuetter/${nr}/galerie/${datei}`);
}

// ----------------------------------------------------------------
// Geocoding via Nominatim (OpenStreetMap)
// ----------------------------------------------------------------

async function geocode(
  strasse: string,
  plz: string,
  stadt = "Dresden",
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
      console.warn(`  ⚠ Geocoding HTTP ${res.status} für ${strasse}, ${plz}`);
      return null;
    }
    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (data.length === 0) {
      console.warn(`  ⚠ Keine Koordinaten für ${strasse}, ${plz}`);
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

async function importiereExcel(): Promise<void> {
  if (!existsSync(EXCEL_PFAD)) {
    console.error(`❌ Excel-Datei nicht gefunden: ${EXCEL_PFAD}`);
    process.exit(1);
  }

  console.log(`📂 Lese ${EXCEL_PFAD}\n`);
  const buffer = readFileSync(EXCEL_PFAD);
  const workbook = XLSX.read(buffer, { cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: null,
    blankrows: false,
  });

  // Zeile 0 = Überschriften
  const daten = rows.slice(1).filter((r) => r && str(r[C.mitglied]).length > 0);
  console.log(`📋 ${daten.length} Mitglieder-Zeilen gefunden.\n`);

  let neu = 0;
  let aktualisiert = 0;
  let aktiv = 0;
  let inaktiv = 0;
  const slugZaehler = new Map<string, number>();

  for (let i = 0; i < daten.length; i++) {
    const r = daten[i];
    const zeilenNr = i + 2;

    try {
      const vorname = str(r[C.vorname]);
      const nachname = str(r[C.nachname]);
      const email = str(r[C.email]);
      if (!vorname || !nachname || !email) {
        console.warn(`⏭  Zeile ${zeilenNr}: ohne Name/E-Mail – übersprungen.`);
        continue;
      }

      const nr = ordnerNummer(r[C.mitglied]);

      // Aktiv-Status bestimmen
      const hatAustritt = parseDatum(r[C.austritt]) !== null;
      const istErsatzperson =
        str(r[C.ersatzperson]).toLowerCase() === "ja";
      const istEinfach =
        str(r[C.mitgliedschaft]).toLowerCase() === "einfach";
      const beratung = parseBeratungsstelle(r[C.beratung]);
      const oeffnungszeiten = str(r[C.oeffnungszeiten]);
      const unvollstaendig = oeffnungszeiten.length === 0 || beratung === null;

      const istAktiv =
        !hatAustritt && !istErsatzperson && !istEinfach && !unvollstaendig;
      if (istAktiv) aktiv++;
      else inaktiv++;

      // Verpflegung (inkl. Sonderfall)
      const sonderfall = nr !== null ? SONDERFALL_VERPFLEGUNG[nr] : undefined;
      const verpflegung = sonderfall
        ? sonderfall.enum
        : parseVerpflegung(r[C.verpflegung]);
      const verpflegungHinweis = sonderfall ? sonderfall.text : null;

      // Bilder
      const fotoUrl = nr !== null ? findeProfilbild(nr) : null;
      const galerie = nr !== null ? findeGalerie(nr) : [];

      // Slug eindeutig machen
      let slug = slugify(vorname, nachname);
      const n = (slugZaehler.get(slug) ?? 0) + 1;
      slugZaehler.set(slug, n);
      if (n > 1) slug = `${slug}-${n}`;

      const gemeinsam = {
        slug,
        vorname,
        nachname,
        einrichtungsname: str(r[C.einrichtung]),
        strasse: str(r[C.anschrift]),
        plz: plzPad(r[C.plz]),
        stadtteil: str(r[C.stadtgebiet]),
        telefon: str(r[C.telefon]),
        websiteUrl: strOrNull(r[C.website]),
        anmeldungUrl: strOrNull(r[C.onlineanmeldung]),
        oeffnungszeiten,
        ersatzbetreuung: str(r[C.ersatzbetreuung]),
        verpflegung,
        verpflegungHinweis,
        beratungsgebiet: beratung ?? DEFAULT_GEBIET,
        schmetterling: parseSchmetterling(r[C.schmetterling]),
        schmetterlingPartner: strOrNull(r[C.schmetterlingPartner]),
        mitgliedsnummer: nr !== null ? String(nr) : strOrNull(r[C.mitglied]),
        mitgliedSeit: parseDatum(r[C.beitritt]),
        latitude: numOrNull(r[C.latitude]),
        longitude: numOrNull(r[C.longitude]),
        istAktiv,
      } satisfies Partial<Prisma.TagesmutterCreateInput>;

      const vorhanden = await prisma.tagesmutter.findUnique({
        where: { email },
      });

      if (vorhanden) {
        // Foto/Galerie nur überschreiben, wenn welche gefunden wurden
        await prisma.tagesmutter.update({
          where: { email },
          data: {
            ...gemeinsam,
            slug: vorhanden.slug, // bestehenden Slug/URL stabil halten
            ...(fotoUrl ? { fotoUrl } : {}),
            ...(galerie.length ? { einrichtungsfotoUrls: galerie } : {}),
          },
        });
        aktualisiert++;
        console.log(
          `🔄 ${vorname} ${nachname} (#${nr ?? "?"}) aktualisiert${istAktiv ? "" : " [inaktiv]"}.`,
        );
      } else {
        await prisma.tagesmutter.create({
          data: {
            ...gemeinsam,
            email,
            fotoUrl: fotoUrl ?? PLATZHALTER_FOTO,
            einrichtungsfotoUrls: galerie,
            freiePlaetze: { create: {} },
          },
        });
        neu++;
        console.log(
          `✅ ${vorname} ${nachname} (#${nr ?? "?"}) angelegt${istAktiv ? "" : " [inaktiv]"}.`,
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`❌ Zeile ${zeilenNr}: ${msg}`);
    }
  }

  console.log(
    `\n📊 Import: ${neu} neu, ${aktualisiert} aktualisiert | ${aktiv} aktiv, ${inaktiv} inaktiv.\n`,
  );

  // Geocoding für aktive Tagesmütter ohne Koordinaten
  const ohneKoordinaten = await prisma.tagesmutter.findMany({
    where: { latitude: null, istAktiv: true },
    select: {
      id: true,
      strasse: true,
      plz: true,
      vorname: true,
      nachname: true,
    },
  });

  if (ohneKoordinaten.length === 0) {
    console.log("📍 Alle aktiven Tagesmütter haben Koordinaten.");
  } else {
    console.log(`📍 Geocoding für ${ohneKoordinaten.length} Adressen...\n`);
    for (const tm of ohneKoordinaten) {
      const ergebnis = await geocode(tm.strasse, tm.plz);
      if (ergebnis) {
        await prisma.tagesmutter.update({
          where: { id: tm.id },
          data: ergebnis,
        });
        console.log(
          `  ✅ ${tm.vorname} ${tm.nachname}: ${ergebnis.latitude.toFixed(5)}, ${ergebnis.longitude.toFixed(5)}`,
        );
      }
      await wartezeit(1100); // Nominatim: max. 1 Request/Sekunde
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
