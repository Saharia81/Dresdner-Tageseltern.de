// Prisma-Client als Singleton, damit im Dev-Mode (HMR) nicht
// bei jedem Reload eine neue DB-Verbindung entsteht.
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL ist nicht gesetzt – siehe .env.example");
  }
  // url-Format: "file:./prisma/dev.db" → für better-sqlite3 brauchen wir den reinen Pfad.
  const dbPath = url.startsWith("file:") ? url.slice("file:".length) : url;
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
