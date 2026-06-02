// Testskript: legt 2 Tagesmütter mit gleicher Adresse an, um den Stack-Pin zu testen.
// Ausführung:  npx tsx scripts/add-stack-test.ts
// Entfernen:   npx tsx scripts/add-stack-test.ts --delete

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TESTDATEN = [
  {
    slug: "stack-test-a",
    vorname: "Anna",
    nachname: "Stackmann",
    einrichtungsname: "Kita Testhaus A",
    email: "stack-test-a@example.test",
  },
  {
    slug: "stack-test-b",
    vorname: "Berta",
    nachname: "Stackmann",
    einrichtungsname: "Kita Testhaus B",
    email: "stack-test-b@example.test",
  },
];

// Gleiche Adresse für beide
const STRASSE = "Eibenstocker Straße 85";
const PLZ = "01277";
const STADTTEIL = "Striesen";

async function geocode(strasse: string, plz: string) {
  const params = new URLSearchParams({
    street: strasse,
    postalcode: plz,
    city: "Dresden",
    country: "Germany",
    format: "json",
    limit: "1",
  });
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    { headers: { "User-Agent": "DresdnerTageselternImport/1.0 (info@dresdner-tageseltern.de)" } },
  );
  const data = (await res.json()) as Array<{ lat: string; lon: string }>;
  if (data.length === 0) return null;
  return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
}

async function main() {
  const loeschen = process.argv.includes("--delete");

  if (loeschen) {
    for (const t of TESTDATEN) {
      await prisma.tagesmutter.deleteMany({ where: { email: t.email } });
      console.log(`🗑  ${t.vorname} ${t.nachname} gelöscht.`);
    }
    return;
  }

  const coords = await geocode(STRASSE, PLZ);
  if (!coords) console.warn("  ⚠ Keine Koordinaten gefunden – lege ohne an.");

  for (const t of TESTDATEN) {
    const vorhanden = await prisma.tagesmutter.findUnique({ where: { email: t.email } });
    if (vorhanden) {
      console.log(`⏭  ${t.vorname} ${t.nachname} existiert bereits.`);
      continue;
    }

    await prisma.tagesmutter.create({
      data: {
        slug: t.slug,
        vorname: t.vorname,
        nachname: t.nachname,
        einrichtungsname: t.einrichtungsname,
        fotoUrl: "/images/steckbriefe/placeholder.svg",
        einrichtungsfotoUrls: [],
        strasse: STRASSE,
        plz: PLZ,
        stadtteil: STADTTEIL,
        latitude: coords?.latitude ?? null,
        longitude: coords?.longitude ?? null,
        telefon: "0351 1234567",
        email: t.email,
        websiteUrl: null,
        oeffnungszeiten: "Mo–Fr 7:30–16:00 Uhr",
        ersatzbetreuung: "Schmetterlingsmodell mit Partnerin",
        verpflegung: "SELBST_GEKOCHT",
        beratungsgebiet: "KINDERLAND",
        schmetterling: false,
        schmetterlingPartner: null,
        mitgliedsnummer: null,
        mitgliedSeit: null,
      },
    });

    console.log(`✅ ${t.vorname} ${t.nachname} angelegt${coords ? ` (${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)})` : " (ohne Koordinaten)"}.`);
  }
}

main()
  .catch((err) => { console.error(err); process.exit(1); })
  .finally(() => prisma.$disconnect());
