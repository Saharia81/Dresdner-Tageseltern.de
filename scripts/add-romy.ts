// Einmalskript: legt Tagesmutter "Romy Weber" an und geocodiert die Adresse.
// Ausführung:  npx tsx scripts/add-romy.ts

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    {
      headers: {
        "User-Agent":
          "DresdnerTageselternImport/1.0 (info@dresdner-tageseltern.de)",
      },
    },
  );
  const data = (await res.json()) as Array<{ lat: string; lon: string }>;
  if (data.length === 0) return null;
  return {
    latitude: parseFloat(data[0].lat),
    longitude: parseFloat(data[0].lon),
  };
}

async function main() {
  const email = "romy.weber@example.test";

  const vorhanden = await prisma.tagesmutter.findUnique({ where: { email } });
  if (vorhanden) {
    console.log(`⏭  Romy Weber existiert bereits (${email}).`);
    return;
  }

  const coords = await geocode("Eibenstocker Straße 85", "01277");
  if (!coords) {
    console.warn("  ⚠ Keine Koordinaten gefunden – lege sie ohne an.");
  }

  await prisma.tagesmutter.create({
    data: {
      slug: "romy-weber",
      vorname: "Romy",
      nachname: "Weber",
      einrichtungsname: "Bei Romy in Striesen",
      fotoUrl: "/images/steckbriefe/placeholder.svg",
      einrichtungsfotoUrls: [],
      strasse: "Eibenstocker Straße 85",
      plz: "01277",
      stadtteil: "Striesen",
      latitude: coords?.latitude ?? null,
      longitude: coords?.longitude ?? null,
      telefon: "0351 0000000",
      email,
      websiteUrl: null,
      oeffnungszeiten: "Mo–Fr 7:30–16:30 Uhr",
      ersatzbetreuung: "Wird noch ergänzt",
      verpflegung: "SELBST_GEKOCHT",
      beratungsgebiet: "KINDERLAND",
      schmetterling: false,
      schmetterlingPartner: null,
      mitgliedsnummer: null,
      mitgliedSeit: null,
    },
  });

  console.log(
    `✅ Romy Weber angelegt${
      coords
        ? ` (${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)})`
        : " (ohne Koordinaten)"
    }.`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
