// API: Liste aller aktiven Tagesmütter (für Karte/Filter auf /kindertagespflege-finden).
//
// Query-Parameter (alle optional):
//   ?beratungsgebiet=MALWINA|OUTLAW|KINDERLAND
//   ?ab_datum=YYYY-MM-DD           → nur Tagesmütter mit freiem Platz ab diesem Datum
//   ?bis_datum=YYYY-MM-DD          → optional, zusammen mit ab_datum: Plätze im Zeitraum
//   ?nur_freie_plaetze=true        → nur Tagesmütter mit mindestens einem freien Platz
//
// Hinweise:
//   - Inaktive Tagesmütter (istAktiv=false) werden niemals zurückgegeben.
//   - E-Mail-Adressen werden ausgeliefert, weil das Frontend einen mailto-Link
//     bauen muss. Sie werden auf der Seite NICHT als sichtbarer Text gerendert.

import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export type FreiePlaetzeDto = {
  platz1Ab: string | null;
  platz2Ab: string | null;
  platz3Ab: string | null;
  platz4Ab: string | null;
  platz5Ab: string | null;
};

export type TagesmutterDto = {
  id: string;
  slug: string;
  vorname: string;
  nachname: string;
  einrichtungsname: string;
  fotoUrl: string;
  einrichtungsfotoUrls: string[];
  strasse: string;
  plz: string;
  stadtteil: string;
  latitude: number | null;
  longitude: number | null;
  telefon: string;
  email: string;
  websiteUrl: string | null;
  anmeldungUrl: string | null;
  oeffnungszeiten: string;
  ersatzbetreuung: string;
  verpflegung: "SELBST_GEKOCHT" | "CATERING";
  beratungsgebiet: "MALWINA" | "OUTLAW" | "KINDERLAND";
  schmetterling: boolean;
  schmetterlingPartner: string | null;
  freiePlaetze: FreiePlaetzeDto | null;
  hatFreienPlatz: boolean;
};

function parseDatum(value: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function hatFreienPlatzInZeitraum(
  fp: FreiePlaetzeDto | null,
  von: Date | null,
  bis: Date | null,
): boolean {
  if (!fp) return false;
  const daten = [fp.platz1Ab, fp.platz2Ab, fp.platz3Ab, fp.platz4Ab, fp.platz5Ab]
    .filter((x): x is string => x !== null)
    .map((x) => new Date(x));
  if (daten.length === 0) return false;
  if (!von && !bis) return true;
  return daten.some(
    (d) => (!von || d >= von) && (!bis || d <= bis),
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const beratungsgebiet = searchParams.get("beratungsgebiet");
  const abDatum = parseDatum(searchParams.get("ab_datum"));
  const bisDatum = parseDatum(searchParams.get("bis_datum"));
  const nurFreiePlaetze = searchParams.get("nur_freie_plaetze") === "true";

  const where: Prisma.TagesmutterWhereInput = { istAktiv: true };
  if (
    beratungsgebiet === "MALWINA" ||
    beratungsgebiet === "OUTLAW" ||
    beratungsgebiet === "KINDERLAND"
  ) {
    where.beratungsgebiet = beratungsgebiet;
  }

  const tagesmuetter = await prisma.tagesmutter.findMany({
    where,
    include: { freiePlaetze: true },
    orderBy: [{ reihenfolge: "asc" }, { nachname: "asc" }],
  });

  const fensterVon = abDatum;
  const fensterBis = bisDatum;

  const dtos: TagesmutterDto[] = tagesmuetter.map((tm) => {
    const fp: FreiePlaetzeDto | null = tm.freiePlaetze
      ? {
          platz1Ab: tm.freiePlaetze.platz1Ab?.toISOString() ?? null,
          platz2Ab: tm.freiePlaetze.platz2Ab?.toISOString() ?? null,
          platz3Ab: tm.freiePlaetze.platz3Ab?.toISOString() ?? null,
          platz4Ab: tm.freiePlaetze.platz4Ab?.toISOString() ?? null,
          platz5Ab: tm.freiePlaetze.platz5Ab?.toISOString() ?? null,
        }
      : null;

    const hatFreienPlatz = hatFreienPlatzInZeitraum(fp, fensterVon, fensterBis);

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
      beratungsgebiet: tm.beratungsgebiet,
      schmetterling: tm.schmetterling,
      schmetterlingPartner: tm.schmetterlingPartner,
      freiePlaetze: fp,
      hatFreienPlatz,
    };
  });

  const gefiltert =
    nurFreiePlaetze || abDatum || bisDatum
      ? dtos.filter((d) => d.hatFreienPlatz)
      : dtos;

  return NextResponse.json(gefiltert);
}
