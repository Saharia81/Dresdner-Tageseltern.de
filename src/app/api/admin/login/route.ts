// Login / Logout für den Admin-Bereich.
//   POST   /api/admin/login   { passwort }  → setzt Session-Cookie
//   DELETE /api/admin/login                 → löscht das Cookie (Logout)
//
// Es gibt mehrere Zugänge mit je eigenem Passwort (siehe src/lib/adminAuth.ts).

import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  benutzerFuerPasswort,
  schutzAktiv,
} from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültiger Body" }, { status: 400 });
  }

  const passwort = (body as { passwort?: unknown })?.passwort;
  if (typeof passwort !== "string") {
    return NextResponse.json({ error: "Passwort fehlt" }, { status: 400 });
  }

  if (!schutzAktiv()) {
    return NextResponse.json(
      { error: "Admin-Passwort ist nicht konfiguriert (ADMIN_PASSWORT)." },
      { status: 500 },
    );
  }

  const benutzer = benutzerFuerPasswort(passwort);
  if (!benutzer) {
    return NextResponse.json({ error: "Falsches Passwort." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, name: benutzer.name });
  res.cookies.set(ADMIN_COOKIE, benutzer.cookieWert, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 Tage
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
