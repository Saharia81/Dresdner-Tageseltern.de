// Beispiel-Daten zum Entwickeln. Mit `npx prisma db seed` ausführen.
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const dbPath = url.startsWith("file:") ? url.slice("file:".length) : url;
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.tagesmutter.upsert({
    where: { slug: "beispiel-tagesmutter" },
    update: {},
    create: {
      slug: "beispiel-tagesmutter",
      vorname: "Anna",
      nachname: "Beispiel",
      einrichtungsname: "Sonnenkinder",
      fotoUrl: "/images/steckbriefe/placeholder.svg",
      einrichtungsfotoUrls: JSON.stringify([]),
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
