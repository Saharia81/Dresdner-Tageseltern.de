// Admin-Aktionen für Banner-Buchungen (Freigabe / Ablehnung).
// Geschützt über die Passwort-Middleware (siehe src/middleware.ts).
//
//  POST /api/admin/buchungen
//    { id, aktion: "bestaetigen" | "ablehnen", tagesmutterSlug?: string }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { pruefeUeberlappung } from "@/lib/buchungen";
import { sendeMail, buildBuchungBestaetigungEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültiger Body" }, { status: 400 });
  }

  const { id, aktion, tagesmutterSlug } = (body ?? {}) as Record<string, unknown>;
  if (typeof id !== "string" || (aktion !== "bestaetigen" && aktion !== "ablehnen")) {
    return NextResponse.json({ error: "Ungültige Aktion" }, { status: 400 });
  }

  const buchung = await prisma.buchung.findUnique({
    where: { id },
    include: { banner: true },
  });
  if (!buchung) {
    return NextResponse.json({ error: "Buchung nicht gefunden" }, { status: 404 });
  }

  if (aktion === "ablehnen") {
    await prisma.buchung.update({
      where: { id },
      data: { status: "ABGELEHNT" },
    });
    return NextResponse.json({ ok: true, status: "ABGELEHNT" });
  }

  // bestaetigen: optional Profil zuordnen, Überlappung erneut prüfen
  let tagesmutterId = buchung.tagesmutterId;
  if (typeof tagesmutterSlug === "string" && tagesmutterSlug.trim()) {
    const tm = await prisma.tagesmutter.findUnique({
      where: { slug: tagesmutterSlug.trim() },
    });
    if (!tm) {
      return NextResponse.json(
        { error: "Profil (Slug) nicht gefunden" },
        { status: 404 },
      );
    }
    tagesmutterId = tm.id;
  }

  if (
    await pruefeUeberlappung(
      buchung.bannerId,
      buchung.zeitraumStart,
      buchung.zeitraumEnde,
      buchung.id,
    )
  ) {
    return NextResponse.json(
      { error: "Zeitraum überschneidet sich mit einer anderen Buchung." },
      { status: 409 },
    );
  }

  await prisma.buchung.update({
    where: { id },
    data: { status: "BESTAETIGT", tagesmutterId },
  });

  try {
    const mail = buildBuchungBestaetigungEmail({
      name: buchung.kontaktName,
      bannerBezeichnung: buchung.banner.bezeichnung,
      start: buchung.zeitraumStart,
      ende: buchung.zeitraumEnde,
      token: buchung.token,
    });
    await sendeMail({ an: buchung.kontaktEmail, ...mail });
  } catch (err) {
    console.error("Bestätigungsmail (Admin) fehlgeschlagen:", err);
  }

  return NextResponse.json({ ok: true, status: "BESTAETIGT" });
}
