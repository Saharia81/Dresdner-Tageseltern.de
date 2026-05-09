import { prisma } from "./db";

export async function getAlleTagesmuetter() {
  return prisma.tagesmutter.findMany({
    where: { istAktiv: true },
    orderBy: [{ reihenfolge: "asc" }, { name: "asc" }],
  });
}

export async function getTagesmutterBySlug(slug: string) {
  return prisma.tagesmutter.findUnique({ where: { slug } });
}
