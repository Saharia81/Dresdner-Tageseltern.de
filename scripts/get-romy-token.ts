import "dotenv/config";
import { prisma } from "../src/lib/db";

prisma.tagesmutter
  .findFirst({
    where: { email: "info@romyweber.de" },
    select: { emailToken: true },
  })
  .then((t) => console.log(t?.emailToken ?? "NICHT GEFUNDEN"))
  .finally(() => prisma.$disconnect());
