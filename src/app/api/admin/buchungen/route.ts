// Admin-Aktionen für Banner-Buchungen (Freigabe / Ablehnung).
// Geschützt über die Passwort-Middleware (siehe src/middleware.ts).
//
//  POST /api/admin/buchungen
//    { id, aktion: "bestaetigen" | "ablehnen" | "loeschen", tagesmutterSlug?: string }
//    { id, aktion: "inhalt-speichern", inhalt: { titel, text, bildUrl, linkUrl, linkText } }
//      → speichert den individuellen Banner-Inhalt und setzt anzeigeTyp INDIVIDUELL

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

  const { id, aktion, tagesmutterSlug, inhalt } = (body ?? {}) as Record<
    string,
    unknown
  >;
  if (
    typeof id !== "string" ||
    (aktion !== "bestaetigen" &&
      aktion !== "ablehnen" &&
      aktion !== "loeschen" &&
      aktion !== "inhalt-speichern")
  ) {
    return NextResponse.json({ error: "Ungültige Aktion" }, { status: 400 });
  }

  const buchung = await prisma.buchung.findUnique({
    where: { id },
    include: { banner: true },
  });
  if (!buchung) {
    return NextResponse.json({ error: "Buchung nicht gefunden" }, { status: 404 });
  }

  // Individuellen Banner-Inhalt speichern (setzt Anzeige-Typ auf INDIVIDUELL).
  if (aktion === "inhalt-speichern") {
    const i = (inhalt ?? {}) as Record<string, unknown>;
    const str = (v: unknown, max: number): string | null => {
      if (typeof v !== "string" || !v.trim()) return null;
      return v.trim().slice(0, max);
    };
    const titel = str(i.titel, 200);
    if (!titel) {
      return NextResponse.json(
        { error: "Bitte einen Titel für den individuellen Inhalt angeben." },
        { status: 400 },
      );
    }
    await prisma.buchung.update({
      where: { id },
      data: {
        anzeigeTyp: "INDIVIDUELL",
        tagesmutterId: null,
        inhaltTitel: titel,
        inhaltText: str(i.text, 4000),
        inhaltBildUrl: str(i.bildUrl, 500),
        inhaltLinkUrl: str(i.linkUrl, 500),
        inhaltLinkText: str(i.linkText, 100),
      },
    });
    return NextResponse.json({ ok: true, status: buchung.status });
  }

  if (aktion === "loeschen") {
    await prisma.buchung.delete({ where: { id } });
    return NextResponse.json({ ok: true, status: "GELOESCHT" });
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
