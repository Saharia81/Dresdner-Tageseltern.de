// Koordinaten zu einer Adresse ermitteln (für den Button im Admin-Formular).
// Geschützt über die Passwort-Middleware (src/proxy.ts).
//
//  POST /api/admin/steckbriefe/geocode  { strasse, plz }

import { NextResponse } from "next/server";
import { geocode, plzPad } from "@/lib/tagesmutter-helpers";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { strasse?: unknown; plz?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Ungültiger Body" }, { status: 400 });
  }

  const strasse = typeof body.strasse === "string" ? body.strasse.trim() : "";
  const plz = plzPad(body.plz);
  if (!strasse) {
    return NextResponse.json(
      { error: "Bitte zuerst eine Straße eingeben." },
      { status: 400 },
    );
  }

  const koord = await geocode(strasse, plz);
  if (!koord) {
    return NextResponse.json(
      { error: "Keine Koordinaten gefunden – bitte Adresse prüfen." },
      { status: 404 },
    );
  }
  return NextResponse.json(koord);
}
