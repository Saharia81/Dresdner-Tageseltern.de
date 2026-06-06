import { prisma } from "@/lib/db";
import { AdminBuchungenListe, type BuchungZeile } from "./AdminBuchungenListe";
import { AdminBuchungAnlegen } from "./AdminBuchungAnlegen";

export const dynamic = "force-dynamic";

export default async function AdminBuchungenPage() {
  const [buchungen, banner, tagesmuetter] = await Promise.all([
    prisma.buchung.findMany({
      include: { banner: true, tagesmutter: { select: { slug: true } } },
      orderBy: [{ status: "asc" }, { zeitraumStart: "asc" }],
    }),
    prisma.banner.findMany({
      where: { istAktiv: true },
      orderBy: [{ reihenfolge: "asc" }, { nummer: "asc" }],
      select: { id: true, bezeichnung: true },
    }),
    prisma.tagesmutter.findMany({
      where: { istAktiv: true },
      orderBy: [{ nachname: "asc" }, { vorname: "asc" }],
      select: { id: true, vorname: true, nachname: true, einrichtungsname: true },
    }),
  ]);

  const profile = tagesmuetter.map((t) => ({
    id: t.id,
    label: `${t.vorname} ${t.nachname}${t.einrichtungsname ? ` – ${t.einrichtungsname}` : ""}`,
  }));

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
      <AdminBuchungAnlegen banner={banner} profile={profile} />
      <AdminBuchungenListe zeilen={zeilen} />
    </main>
  );
}
