// Gibt einen gültigen emailToken einer aktiven Tagesmutter aus (für lokale Tests).
import "dotenv/config";
import { prisma } from "../src/lib/db";

async function main() {
  const tm = await prisma.tagesmutter.findFirst({
    where: { istAktiv: true },
    include: { freiePlaetze: true },
    orderBy: { reihenfolge: "asc" },
  });
  if (!tm) {
    console.log("Keine aktive Tagesmutter gefunden.");
    return;
  }
  console.log(`Name:  ${tm.vorname} ${tm.nachname}`);
  console.log(`Token: ${tm.emailToken}`);
  console.log(`Edit:  http://localhost:3000/plaetze-bestaetigen?token=${tm.emailToken}&action=edit`);
}

main().finally(() => prisma.$disconnect());
