import { prisma } from "@/lib/db";
import { AdminBuchungenListe, type BuchungZeile } from "./AdminBuchungenListe";

export const dynamic = "force-dynamic";

export default async function AdminBuchungenPage() {
  const buchungen = await prisma.buchung.findMany({
    include: { banner: true, tagesmutter: { select: { slug: true } } },
    orderBy: [{ status: "asc" }, { zeitraumStart: "asc" }],
  });

  // Anfragen zuerst, dann der Rest
  const sortiert = [...buchungen].sort((a, b) => {
    const rang = (s: string) => (s === "ANFRAGE" ? 0 : 1);
    return rang(a.status) - rang(b.status);
  });

  const zeilen: BuchungZeile[] = sortiert.map((b) => ({
    id: b.id,
    banner: b.banner.bezeichnung,
    name: b.kontaktName,
    email: b.kontaktEmail,
    start: b.zeitraumStart.toISOString().slice(0, 10),
    ende: b.zeitraumEnde.toISOString().slice(0, 10),
    status: b.status,
    profilSlug: b.tagesmutter?.slug ?? null,
  }));

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Banner-Buchungen</h1>
      <AdminBuchungenListe zeilen={zeilen} />
    </main>
  );
}
