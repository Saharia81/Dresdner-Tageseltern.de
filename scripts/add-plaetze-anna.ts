import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const dbPath = url.startsWith("file:") ? url.slice("file:".length) : url;
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  const anna = await prisma.tagesmutter.findFirst({
    where: { vorname: "Anna", nachname: "Beispiel" },
  });
  if (!anna) { console.error("Anna nicht gefunden!"); return; }

  await prisma.freiePlaetze.upsert({
    where: { tagesmutterId: anna.id },
    update: {
      platz1Ab: new Date("2026-07-01"),
      platz2Ab: new Date("2026-07-15"),
      platz3Ab: new Date("2026-08-01"),
      platz4Ab: new Date("2026-09-01"),
      platz5Ab: new Date("2026-10-15"),
    },
    create: {
      tagesmutterId: anna.id,
      platz1Ab: new Date("2026-07-01"),
      platz2Ab: new Date("2026-07-15"),
      platz3Ab: new Date("2026-08-01"),
      platz4Ab: new Date("2026-09-01"),
      platz5Ab: new Date("2026-10-15"),
    },
  });
  console.log("5 freie Plätze für Anna Beispiel gesetzt ✓");
}

main().catch(console.error).finally(() => prisma.$disconnect());
