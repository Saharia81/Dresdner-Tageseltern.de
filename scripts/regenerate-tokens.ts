// Einmalskript: ersetzt alle emailToken durch kryptografisch starke Werte.
// Gefahrlos, solange noch keine Bestätigungslinks verschickt wurden.
// Ausführung:  npx tsx scripts/regenerate-tokens.ts

import "dotenv/config";
import { prisma } from "../src/lib/db";
import { generateToken } from "../src/lib/token";

async function main() {
  const alle = await prisma.tagesmutter.findMany({ select: { id: true } });
  let count = 0;
  for (const tm of alle) {
    await prisma.tagesmutter.update({
      where: { id: tm.id },
      data: { emailToken: generateToken() },
    });
    count++;
  }
  console.log(`✅ ${count} Tokens neu erzeugt (256 Bit, base64url).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
