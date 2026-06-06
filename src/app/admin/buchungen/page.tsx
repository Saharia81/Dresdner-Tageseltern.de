import { prisma } from "@/lib/db";
import { tagISO } from "@/lib/buchungen";
import {
  AdminBuchungenListe,
  type BuchungZeile,
  type BannerGruppe,
} from "./AdminBuchungenListe";
import { AdminBuchungAnlegen } from "./AdminBuchungAnlegen";

export const dynamic = "force-dynamic";

export default async function AdminBuchungenPage() {
  const [buchungen, banner, tagesmuetter] = await Promise.all([
    prisma.buchung.findMany({
      include: { banner: true, tagesmutter: { select: { slug: true } } },
      orderBy: [{ zeitraumStart: "asc" }],
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

  const zeilen: BuchungZeile[] = buchungen.map((b) => ({
    id: b.id,
    bannerId: b.bannerId,
    banner: b.banner.bezeichnung,
    name: b.kontaktName,
    email: b.kontaktEmail,
    start: tagISO(b.zeitraumStart),
    ende: tagISO(b.zeitraumEnde),
    status: b.status,
    profilSlug: b.tagesmutter?.slug ?? null,
    anzeigeTyp: b.anzeigeTyp,
    wunsch: b.wunsch,
    inhaltTitel: b.inhaltTitel,
    inhaltText: b.inhaltText,
    inhaltBildUrl: b.inhaltBildUrl,
    inhaltLinkUrl: b.inhaltLinkUrl,
    inhaltLinkText: b.inhaltLinkText,
  }));

  // Erledigt = abgelehnt/abgelaufen oder Zeitraum bereits vorbei.
  const heute = tagISO(new Date());
  const istErledigt = (z: BuchungZeile) =>
    z.status === "ABGELEHNT" || z.status === "ABGELAUFEN" || z.ende < heute;

  // Pro Banner gruppieren: aktiv/kommend nach Datum aufsteigend, erledigt
  // nach Datum absteigend (neuestes zuerst).
  const gruppen: BannerGruppe[] = banner.map((b) => {
    const eigene = zeilen.filter((z) => z.bannerId === b.id);
    return {
      bannerId: b.id,
      bannerName: b.bezeichnung,
      aktiv: eigene
        .filter((z) => !istErledigt(z))
        .sort((a, c) => a.start.localeCompare(c.start)),
      erledigt: eigene
        .filter(istErledigt)
        .sort((a, c) => c.start.localeCompare(a.start)),
    };
  });

  const offeneAnfragen = zeilen.filter((z) => z.status === "ANFRAGE").length;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Banner-Buchungen</h1>
      <AdminBuchungAnlegen banner={banner} profile={profile} />
      <AdminBuchungenListe gruppen={gruppen} offeneAnfragen={offeneAnfragen} />
    </main>
  );
}
