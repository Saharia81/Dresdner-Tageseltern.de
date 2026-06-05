// Einmalskript: setzt die Pin-Koordinaten von Vicki Müller manuell.
// Grund: korrekte Anschrift, aber Nebenhaus ohne eigene Hausnummer.
// Ausführung:  npx tsx scripts/fix-vicki-mueller-coords.ts

import "dotenv/config";
import { prisma } from "../src/lib/db";

const LATITUDE = 51.053766;
const LONGITUDE = 13.798394;

async function main() {
  const tm = await prisma.tagesmutter.findFirst({
    where: { vorname: "Vicki", nachname: "Müller" },
  });

  if (!tm) {
    console.error("❌ Vicki Müller nicht gefunden.");
    process.exit(1);
  }

  await prisma.tagesmutter.update({
    where: { id: tm.id },
    data: { latitude: LATITUDE, longitude: LONGITUDE },
  });

  console.log(
    `✅ Koordinaten von Vicki Müller gesetzt (${LATITUDE}, ${LONGITUDE}).`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
