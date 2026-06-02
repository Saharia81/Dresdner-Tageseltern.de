// Beispiel-Daten zum Entwickeln. Mit `npx prisma db seed` ausführen.
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.tagesmutter.upsert({
    where: { slug: "beispiel-tagesmutter" },
    update: {
      einrichtungsfotoUrls: [
        "/images/allgemein/basteln.png",
        "/images/allgemein/eingewoehnung-v2.png",
        "/images/allgemein/feste-bezugsperson-v2.png",
        "/images/allgemein/ruhige-atmosphaere.png",
      ],
    },
    create: {
      slug: "beispiel-tagesmutter",
      vorname: "Anna",
      nachname: "Beispiel",
      einrichtungsname: "Sonnenkinder",
      fotoUrl: "/images/steckbriefe/placeholder.svg",
      einrichtungsfotoUrls: [],
      strasse: "Musterstraße 1",
      plz: "01069",
      stadtteil: "Südvorstadt",
      telefon: "0351 1234567",
      email: "info@beispiel.de",
      oeffnungszeiten: "Mo–Fr 7:30–16:00",
      ersatzbetreuung: "Basis ETP",
      verpflegung: "SELBST_GEKOCHT",
      websiteUrl: null,
      beratungsgebiet: "MALWINA",
      latitude: 51.0504,
      longitude: 13.7373,
    },
  });

  console.log("Seed abgeschlossen.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
