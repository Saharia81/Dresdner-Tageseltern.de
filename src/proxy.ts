// Passwortschutz für den Admin-Bereich (Next nennt "Middleware" jetzt "Proxy").
// Schützt /admin und /api/admin – ausgenommen Login-Seite und Login-Route.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, istAngemeldet } from "@/lib/adminAuth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login-Seite und Login/Logout-Route immer durchlassen
  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  if (istAngemeldet(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.next();
  }

  // API → 401, Seiten → zur Login-Seite
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("weiter", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
