import { Prisma } from "@prisma/client";
import { prisma } from "./db";
import type { TagesmutterDto } from "@/app/api/tagesmutters/route";

// Lädt eine aktive Tagesmutter als fertiges DTO (inkl. freier Plätze),
// passend zur Form, die SteckbriefInhalt erwartet. Für die Banner-Seiten.
export async function getTagesmutterDtoBySlug(
  slug: string,
): Promise<TagesmutterDto | null> {
  const tm = await prisma.tagesmutter.findUnique({
    where: { slug },
    include: { freiePlaetze: true },
  });
  return tmZuDto(tm);
}

// Wie oben, aber per Profil-ID – für die Bannerseite (verknüpfte Buchung).
export async function getTagesmutterDtoById(
  id: string,
): Promise<TagesmutterDto | null> {
  const tm = await prisma.tagesmutter.findUnique({
    where: { id },
    include: { freiePlaetze: true },
  });
  return tmZuDto(tm);
}

type TmMitPlaetze = Prisma.TagesmutterGetPayload<{
  include: { freiePlaetze: true };
}>;

function tmZuDto(tm: TmMitPlaetze | null): TagesmutterDto | null {
  if (!tm || !tm.istAktiv) return null;
  const fp = tm.freiePlaetze
    ? {
        platz1Ab: tm.freiePlaetze.platz1Ab?.toISOString() ?? null,
        platz2Ab: tm.freiePlaetze.platz2Ab?.toISOString() ?? null,
        platz3Ab: tm.freiePlaetze.platz3Ab?.toISOString() ?? null,
        platz4Ab: tm.freiePlaetze.platz4Ab?.toISOString() ?? null,
        platz5Ab: tm.freiePlaetze.platz5Ab?.toISOString() ?? null,
      }
    : null;

  const hatFreienPlatz =
    fp !== null &&
    [fp.platz1Ab, fp.platz2Ab, fp.platz3Ab, fp.platz4Ab, fp.platz5Ab].some(
      (x) => x !== null,
    );

  return {
    id: tm.id,
    slug: tm.slug,
    vorname: tm.vorname,
    nachname: tm.nachname,
    einrichtungsname: tm.einrichtungsname,
    fotoUrl: tm.fotoUrl,
    einrichtungsfotoUrls: tm.einrichtungsfotoUrls,
    strasse: tm.strasse,
    plz: tm.plz,
    stadtteil: tm.stadtteil,
    latitude: tm.latitude,
    longitude: tm.longitude,
    telefon: tm.telefon,
    email: tm.email,
    websiteUrl: tm.websiteUrl,
    anmeldungUrl: tm.anmeldungUrl,
    oeffnungszeiten: tm.oeffnungszeiten,
    ersatzbetreuung: tm.ersatzbetreuung,
    verpflegung: tm.verpflegung,
    verpflegungHinweis: tm.verpflegungHinweis,
    beratungsgebiet: tm.beratungsgebiet,
    schmetterling: tm.schmetterling,
    schmetterlingPartner: tm.schmetterlingPartner,
    freiePlaetze: fp,
    hatFreienPlatz,
  };
}

export async function getAlleTagesmuetter() {
  return prisma.tagesmutter.findMany({
    where: { istAktiv: true },
    orderBy: [{ reihenfolge: "asc" }, { nachname: "asc" }],
  });
}

export async function getTagesmutterBySlug(slug: string) {
  return prisma.tagesmutter.findUnique({ where: { slug } });
}

// Für die Admin-Mitgliederverwaltung: ALLE Datensätze (aktiv und inaktiv),
// sortiert wie auf der öffentlichen Karte.
export async function getAlleTagesmuetterAdmin() {
  return prisma.tagesmutter.findMany({
    orderBy: [{ reihenfolge: "asc" }, { nachname: "asc" }],
  });
}

// Einzelner Datensatz per ID – für die Bearbeiten-Maske.
export async function getTagesmutterById(id: string) {
  return prisma.tagesmutter.findUnique({ where: { id } });
}
