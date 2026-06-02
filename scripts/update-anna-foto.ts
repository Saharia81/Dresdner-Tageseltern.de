import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.tagesmutter.update({
    where: { slug: "beispiel-tagesmutter" },
    data: { fotoUrl: "/images/hero/hero-tagesmutter.png" },
  });
  console.log("Profilbild gesetzt ✓");
}

main().catch(console.error).finally(() => prisma.$disconnect());
