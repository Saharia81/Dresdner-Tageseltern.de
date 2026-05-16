// Einmalskript: Setzt für Romy Weber ein Test-Profilbild.
// Ausführung: npx tsx scripts/set-romy-foto.ts

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const dbUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const dbPath = dbUrl.startsWith("file:") ? dbUrl.slice("file:".length) : dbUrl;
const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: dbPath }),
});

async function main() {
  const result = await prisma.tagesmutter.updateMany({
    where: { email: "romy.weber@example.test" },
    data: { fotoUrl: "/images/hero/hero-tagesmutter.png" },
  });
  console.log(`✅ ${result.count} Datensatz aktualisiert.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
