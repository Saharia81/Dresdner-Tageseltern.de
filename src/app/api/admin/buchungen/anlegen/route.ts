// Manuelles Eintragen einer bereits bestehenden Buchung durch den Admin.
// Legt einen belegten Zeitraum an (Status BESTAETIGT) OHNE jeglichen
// Mailversand und mit unterdrückten Erinnerungen.
// Geschützt über die Passwort-Middleware (src/proxy.ts).
//
//  POST /api/admin/buchungen/anlegen
//    { bannerId, start, ende, name?, tagesmutterId? }
//  Wird eine tagesmutterId angegeben, erscheint deren Steckbrief im
//  Mietzeitraum automatisch auf der Banner-Seite.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { pruefeUeberlappung, tagesBeginn } from "@/lib/buchungen";

export const dynamic = "force-dynamic";

function parseTag(value: unknown): Date | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return tagesBeginn(d);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültiger Body" }, { status: 400 });
  }

  const { bannerId, start, ende, name, tagesmutterId } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (typeof bannerId !== "string" || !bannerId) {
    return NextResponse.json({ error: "Banner fehlt" }, { status: 400 });
  }

  // Optionale Profil-Zuordnung
  let tmId: string | null = null;
  let tmName: string | null = null;
  let tmEmail = "";
  if (typeof tagesmutterId === "string" && tagesmutterId) {
    const tm = await prisma.tagesmutter.findUnique({
      where: { id: tagesmutterId },
    });
    if (!tm) {
      return NextResponse.json(
        { error: "Tagesmutter nicht gefunden." },
        { status: 404 },
      );
    }
    tmId = tm.id;
    tmName = `${tm.vorname} ${tm.nachname}`.trim();
    tmEmail = tm.email;
  }

  const startTag = parseTag(start);
  const endeTag = parseTag(ende);
  if (!startTag || !endeTag) {
    return NextResponse.json(
      { error: "Bitte gültigen Zeitraum angeben." },
      { status: 400 },
    );
  }
  if (endeTag < startTag) {
    return NextResponse.json(
      { error: "Das Enddatum muss nach dem Startdatum liegen." },
      { status: 400 },
    );
  }

  const banner = await prisma.banner.findUnique({ where: { id: bannerId } });
  if (!banner) {
    return NextResponse.json({ error: "Banner nicht gefunden." }, { status: 404 });
  }

  if (await pruefeUeberlappung(bannerId, startTag, endeTag)) {
    return NextResponse.json(
      { error: "Dieser Zeitraum überschneidet sich mit einer bestehenden Buchung." },
      { status: 409 },
    );
  }

  const kontaktName =
    typeof name === "string" && name.trim()
      ? name.trim()
      : tmName ?? "Manuell eingetragen";

  await prisma.buchung.create({
    data: {
      bannerId,
      tagesmutterId: tmId,
      kontaktName,
      kontaktEmail: tmEmail,
      grundstueckBestaetigt: true,
      status: "BESTAETIGT",
      zeitraumStart: startTag,
      zeitraumEnde: endeTag,
      // Keine Erinnerungsmails für manuell eingepflegte Altbuchungen.
      erinnerung5TageGesendet: true,
      info3TageGesendet: true,
    },
  });

  return NextResponse.json({ ok: true });
}
