// API für die Bestätigungsseite /plaetze-bestaetigen.
//
//  GET  /api/plaetze?token=...           → aktuelle Plätze laden (für Edit-Formular)
//  POST /api/plaetze                     → Plätze speichern + lastConfirmed setzen
//
// Body POST: { token: string; plaetze: (string | null)[5] }
//   - "plaetze" ist ein 5-elementiger Array von ISO-Datumsstrings (YYYY-MM-DD)
//     oder null, in Reihenfolge Platz 1 … Platz 5.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export type PlaetzeDto = {
  vorname: string;
  nachname: string;
  einrichtungsname: string;
  plaetze: (string | null)[]; // genau 5 Einträge (ISO oder null)
};

function parseDatum(value: unknown): Date | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Token fehlt" }, { status: 400 });
  }

  const tm = await prisma.tagesmutter.findUnique({
    where: { emailToken: token },
    include: { freiePlaetze: true },
  });
  if (!tm) {
    return NextResponse.json({ error: "Ungültiger Token" }, { status: 404 });
  }

  const fp = tm.freiePlaetze;
  const dto: PlaetzeDto = {
    vorname: tm.vorname,
    nachname: tm.nachname,
    einrichtungsname: tm.einrichtungsname,
    plaetze: [
      fp?.platz1Ab?.toISOString() ?? null,
      fp?.platz2Ab?.toISOString() ?? null,
      fp?.platz3Ab?.toISOString() ?? null,
      fp?.platz4Ab?.toISOString() ?? null,
      fp?.platz5Ab?.toISOString() ?? null,
    ],
  };

  return NextResponse.json(dto);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültiger Body" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("token" in body) ||
    !("plaetze" in body)
  ) {
    return NextResponse.json(
      { error: "Token oder Plätze fehlen" },
      { status: 400 },
    );
  }

  const { token, plaetze } = body as { token: unknown; plaetze: unknown };
  if (typeof token !== "string" || !Array.isArray(plaetze) || plaetze.length !== 5) {
    return NextResponse.json(
      { error: "Token oder Plätze ungültig" },
      { status: 400 },
    );
  }

  const tm = await prisma.tagesmutter.findUnique({
    where: { emailToken: token },
  });
  if (!tm) {
    return NextResponse.json({ error: "Ungültiger Token" }, { status: 404 });
  }

  const daten = {
    platz1Ab: parseDatum(plaetze[0]),
    platz2Ab: parseDatum(plaetze[1]),
    platz3Ab: parseDatum(plaetze[2]),
    platz4Ab: parseDatum(plaetze[3]),
    platz5Ab: parseDatum(plaetze[4]),
  };

  await prisma.freiePlaetze.upsert({
    where: { tagesmutterId: tm.id },
    create: { tagesmutterId: tm.id, ...daten },
    update: daten,
  });

  await prisma.tagesmutter.update({
    where: { id: tm.id },
    data: { lastConfirmed: new Date() },
  });

  return NextResponse.json({ ok: true });
}
