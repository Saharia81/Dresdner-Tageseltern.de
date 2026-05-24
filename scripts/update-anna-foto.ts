import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const dbPath = url.startsWith("file:") ? url.slice("file:".length) : url;
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.tagesmutter.update({
    where: { slug: "beispiel-tagesmutter" },
    data: { fotoUrl: "/images/hero/hero-tagesmutter.png" },
  });
  console.log("Profilbild gesetzt ✓");
}

main().catch(console.error).finally(() => prisma.$disconnect());
