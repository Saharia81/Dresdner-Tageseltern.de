// Einmalskript: Setzt für Romy Weber ein Test-Profilbild.
// Ausführung: npx tsx scripts/set-romy-foto.ts

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
