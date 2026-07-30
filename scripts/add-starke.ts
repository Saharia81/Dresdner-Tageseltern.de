// Einmalskript: legt Tagesmutter "Katrin Starke" (Die Elchkinder) an.
// Arbeitet identisch zum Admin-Formular: eindeutiger Slug, Geocoding aus der
// Adresse und leerer freiePlaetze-Datensatz. Idempotent – legt nichts doppelt an.
//
// Voraussetzung: DATABASE_URL muss auf die produktive Supabase-DB zeigen,
// z. B. per `vercel env pull .env.production` und dann:
//   DATABASE_URL="<supabase-url>" npx tsx scripts/add-starke.ts

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
  const email = "jkm.starke@gmx.de";

  const vorhanden = await prisma.tagesmutter.findUnique({ where: { email } });
  if (vorhanden) {
    console.log(`⏭  Katrin Starke existiert bereits (${email}).`);
    return;
  }

  const strasse = "Lindenweg 2";
  const plz = plzPad("01156");

  const coords = await geocode(strasse, plz);
  if (!coords) {
    console.warn("  ⚠ Keine Koordinaten gefunden – lege sie ohne an.");
  }

  const slug = await eindeutigerSlug(slugify("Katrin", "Starke"));

  const tm = await prisma.tagesmutter.create({
    data: {
      slug,
      vorname: "Katrin",
      nachname: "Starke",
      einrichtungsname: "Die Elchkinder",
      // DB-Spalte fotoUrl ist (noch) NOT NULL, wird aber nicht mehr genutzt –
      // das Profilbild kommt aus public/images/tagesmuetter/1062/.
      fotoUrl: "",
      einrichtungsfotoUrls: [],
      strasse,
      plz,
      stadtteil: "Altfranken",
      latitude: coords?.latitude ?? null,
      longitude: coords?.longitude ?? null,
      telefon: "0351 6501372",
      email,
      websiteUrl: "https://kindertagespflege-dresden.de",
      anmeldungUrl: null,
      oeffnungszeiten: "07:00 bis 16:00 Uhr",
      ersatzbetreuung: "Stützpunkt",
      verpflegung: "CATERING",
      verpflegungHinweis: "Catering vom Gasthof Pesterwitz",
      beratungsgebiet: "MALWINA",
      // ersatzmodell/ersatzFreierPlatz bewusst nicht gesetzt: die Felder gibt
      // es nur im dev-Schema, und Katrin Starke nutzt selbst einen Stützpunkt,
      // sie bietet keine Ersatzbetreuung für andere an. Der Standard KEINE
      // hält sie von der Ersatztagespflege-Seite fern.
      schmetterling: false,
      schmetterlingPartner: null,
      mitgliedsnummer: "1062",
      mitgliedSeit: new Date("2026-07-01"),
      istAktiv: true,
      reihenfolge: 0,
      freiePlaetze: { create: {} },
    },
  });

  console.log(
    `✅ Katrin Starke (Die Elchkinder) angelegt – /fuer-eltern/tagesmutter-finden/${slug}` +
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
