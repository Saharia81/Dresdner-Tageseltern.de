// Einmalskript: Setzt für Romy Weber einige Test-Bilder als Galerie.
// Ausführung: npx tsx scripts/set-romy-galerie.ts

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FOTOS = [
  "/images/kindertagespflege/gemeinsam-essen.png",
  "/images/kindertagespflege/naturentdecken1.png",
  "/images/kindertagespflege/lesen.png",
  "/images/kindertagespflege/schlafen.png",
];

async function main() {
  const result = await prisma.tagesmutter.updateMany({
    where: { email: "romy.weber@example.test" },
    data: { einrichtungsfotoUrls: FOTOS },
  });
  console.log(`✅ ${result.count} Datensatz aktualisiert (${FOTOS.length} Fotos).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
