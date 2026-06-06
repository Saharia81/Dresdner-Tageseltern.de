// Leichtgewichtiger Passwortschutz für den Admin-Bereich.
// Kein NextAuth – nur ein gemeinsames Passwort (ADMIN_PASSWORT) und ein
// Session-Cookie, das den SHA-256-Hash des Passworts trägt (kein Klartext).

import { createHash } from "node:crypto";

export const ADMIN_COOKIE = "admin_session";

export function hashPasswort(passwort: string): string {
  return createHash("sha256").update(passwort, "utf8").digest("hex");
}

// Erwarteter Cookie-Wert auf Basis des konfigurierten Passworts.
// Null, wenn kein Passwort gesetzt ist (dann ist der Schutz deaktiviert).
export function erwarteterCookieWert(): string | null {
  const pw = process.env.ADMIN_PASSWORT;
  if (!pw) return null;
  return hashPasswort(pw);
}

export function istAngemeldet(cookieWert: string | undefined): boolean {
  const erwartet = erwarteterCookieWert();
  if (!erwartet) return true; // kein Passwort gesetzt → offen (Dev)
  return cookieWert === erwartet;
}
