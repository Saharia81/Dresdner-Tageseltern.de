// Einmalskript: aktualisiert die Anschrift von Jeannette Puhlmann.
// Neue Adresse (Stand Juni 2026): Nürnberger Straße 27, 01187 Dresden.
// Koordinaten via Nominatim (OpenStreetMap) ermittelt.
// Ausführung:  npx tsx scripts/update-jeannette-puhlmann-adresse.ts

import "dotenv/config";
import { prisma } from "../src/lib/db";

const STRASSE = "Nürnberger Straße 27";
const PLZ = "01187";
const STADTTEIL = "Südvorstadt-West";
const LATITUDE = 51.0350836;
const LONGITUDE = 13.720939;

async function main() {
  const tm = await prisma.tagesmutter.findUnique({
    where: { slug: "jeannette-puhlmann" },
  });

  if (!tm) {
    console.error("❌ Jeannette Puhlmann nicht gefunden.");
    process.exit(1);
  }

  await prisma.tagesmutter.update({
    where: { id: tm.id },
    data: {
      strasse: STRASSE,
      plz: PLZ,
      stadtteil: STADTTEIL,
      latitude: LATITUDE,
      longitude: LONGITUDE,
    },
  });

  console.log(
    `✅ Anschrift von Jeannette Puhlmann aktualisiert: ${STRASSE}, ${PLZ} ${STADTTEIL} (${LATITUDE}, ${LONGITUDE}).`,
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
