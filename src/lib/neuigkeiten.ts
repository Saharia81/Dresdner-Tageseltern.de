import { prisma } from "./db";

export async function getVeroeffentlichteBeitraege() {
  return prisma.blogPost.findMany({
    where: { istEntwurf: false },
    orderBy: { veroeffentlichtAm: "desc" },
  });
}

export async function getBeitragBySlug(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug } });
}
