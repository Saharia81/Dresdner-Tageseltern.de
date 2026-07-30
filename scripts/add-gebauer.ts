// Einmalskript: legt Tagesmutter "Nicole Gebauer" (Goldstück) an.
// Arbeitet identisch zum Admin-Formular: eindeutiger Slug, Geocoding aus der
// Adresse und leerer freiePlaetze-Datensatz. Idempotent – legt nichts doppelt an.
//
// Voraussetzung: DATABASE_URL muss auf die produktive Supabase-DB zeigen,
// z. B. per `vercel env pull .env.production` und dann:
//   DATABASE_URL="<supabase-url>" npx tsx scripts/add-gebauer.ts

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { slugify, plzPad, geocode } from "../src/lib/tagesmutter-helpers";

const prisma = new PrismaClient();

// Eindeutigen Slug erzeugen; bei Kollision -2, -3 … anhängen (wie im API-Route).
async function eindeutigerSlug(basis: string): Promise<string> {
  let slug = basis || "tagesmutter";
  let n = 1;
  for (;;) {
    const vorhanden = await prisma.tagesmutter.findUnique({ where: { slug } });
    if (!vorhanden) return slug;
    n += 1;
    slug = `${basis}-${n}`;
  }
}

async function main() {
  const email = "info-goldstueck@gmx.de";

  const vorhanden = await prisma.tagesmutter.findUnique({ where: { email } });
  if (vorhanden) {
    console.log(`⏭  Nicole Gebauer existiert bereits (${email}).`);
    return;
  }

  const strasse = "Gustav-Hartmann-Straße 1";
  const plz = plzPad("01279");

  const coords = await geocode(strasse, plz);
  if (!coords) {
    console.warn("  ⚠ Keine Koordinaten gefunden – lege sie ohne an.");
  }

  const slug = await eindeutigerSlug(slugify("Nicole", "Gebauer"));

  const tm = await prisma.tagesmutter.create({
    data: {
      slug,
      vorname: "Nicole",
      nachname: "Gebauer",
      einrichtungsname: "Goldstück",
      // DB-Spalte fotoUrl ist (noch) NOT NULL, wird aber nicht mehr genutzt –
      // das Profilbild kommt aus public/images/tagesmuetter/1063/.
      fotoUrl: "",
      einrichtungsfotoUrls: [],
      strasse,
      plz,
      stadtteil: "Laubegast",
      latitude: coords?.latitude ?? null,
      longitude: coords?.longitude ?? null,
      telefon: "0172 3739289",
      email,
      websiteUrl: "https://www.goldstueck-dresden.de",
      anmeldungUrl: null,
      oeffnungszeiten: "07:00 bis 16:00 Uhr",
      ersatzbetreuung: "",
      verpflegung: "SELBST_GEKOCHT",
      verpflegungHinweis: null,
      beratungsgebiet: "OUTLAW",
      ersatzmodell: "BASIS_ETP",
      ersatzFreierPlatz: false,
      schmetterling: false,
      schmetterlingPartner: null,
      mitgliedsnummer: "1063",
      mitgliedSeit: new Date("2025-08-01"),
      istAktiv: true,
      reihenfolge: 0,
      freiePlaetze: { create: {} },
    },
  });

  console.log(
    `✅ Nicole Gebauer (Goldstück) angelegt – /fuer-eltern/tagesmutter-finden/${slug}` +
      (coords
        ? ` (${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)})`
        : " (ohne Koordinaten)"),
  );
  console.log(`   id: ${tm.id}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
