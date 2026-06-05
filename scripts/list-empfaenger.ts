// Listet alle aktiven Tagesmütter, die die Mail bekämen (Kontrolle vor Versand).
import "dotenv/config";
import { prisma } from "../src/lib/db";

async function main() {
  const liste = await prisma.tagesmutter.findMany({
    where: { istAktiv: true },
    orderBy: { reihenfolge: "asc" },
    select: {
      vorname: true,
      nachname: true,
      email: true,
      mitgliedsnummer: true,
      stadtteil: true,
    },
  });

  console.log(`Empfänger gesamt: ${liste.length}\n`);
  liste.forEach((t, i) => {
    const nr = String(i + 1).padStart(2, " ");
    const name = `${t.vorname} ${t.nachname}`.padEnd(26, " ");
    console.log(`${nr}. ${name} ${t.email}`);
  });

  // Auffälligkeiten
  const ohneAt = liste.filter((t) => !t.email.includes("@"));
  const doppelte = liste
    .map((t) => t.email.toLowerCase())
    .filter((e, i, a) => a.indexOf(e) !== i);
  if (ohneAt.length) {
    console.log(`\n⚠️  Ungültige Adressen (kein @): ${ohneAt.length}`);
    ohneAt.forEach((t) => console.log(`   - ${t.vorname} ${t.nachname}: "${t.email}"`));
  }
  if (doppelte.length) {
    console.log(`\n⚠️  Doppelte Adressen: ${[...new Set(doppelte)].join(", ")}`);
  }
  if (!ohneAt.length && !doppelte.length) {
    console.log(`\n✅ Alle Adressen enthalten @, keine Dubletten.`);
  }
}

main().finally(() => prisma.$disconnect());
