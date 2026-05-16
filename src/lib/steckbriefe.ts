import { prisma } from "./db";

export async function getAlleTagesmuetter() {
  return prisma.tagesmutter.findMany({
    where: { istAktiv: true },
    orderBy: [{ reihenfolge: "asc" }, { nachname: "asc" }],
  });
}

export async function getTagesmutterBySlug(slug: string) {
  return prisma.tagesmutter.findUnique({ where: { slug } });
}
