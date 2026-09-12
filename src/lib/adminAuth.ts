// Leichtgewichtiger Passwortschutz für den Admin-Bereich.
// Kein NextAuth: Jede Person hat ihr eigenes Passwort, das Session-Cookie
// trägt den SHA-256-Hash dieses Passworts (kein Klartext).
//
// Die Zugänge kommen aus Umgebungsvariablen:
//   ADMIN_PASSWORT            Hauptzugang, Anzeigename über ADMIN_NAME
//   ADMIN_PASSWORT_<VORNAME>  weiterer Zugang, Anzeigename aus dem
//                             Variablennamen (ADMIN_PASSWORT_ANDREA -> Andrea)
//
// Eine weitere Kollegin braucht also nur eine neue Variable, keinen Code.
// Alle Zugänge haben dieselben Rechte; einzelne lassen sich abschalten,
// indem man ihre Variable löscht.

import { createHash } from "node:crypto";

export const ADMIN_COOKIE = "admin_session";

const PRAEFIX = "ADMIN_PASSWORT_";

export type AdminBenutzer = {
  /** Anzeigename im Admin-Header */
  name: string;
  /** SHA-256-Hash des Passworts = Wert des Session-Cookies */
  cookieWert: string;
};

export function hashPasswort(passwort: string): string {
  return createHash("sha256").update(passwort, "utf8").digest("hex");
}

// "ANDREA" -> "Andrea", "ANNA_MARIA" -> "Anna Maria"
function anzeigeName(schluessel: string): string {
  return schluessel
    .split("_")
    .filter(Boolean)
    .map((teil) => teil.charAt(0) + teil.slice(1).toLowerCase())
    .join(" ");
}

/** Alle konfigurierten Zugänge. Leer = Schutz deaktiviert (nur Dev). */
export function adminBenutzer(): AdminBenutzer[] {
  const liste: AdminBenutzer[] = [];

  const haupt = process.env.ADMIN_PASSWORT;
  if (haupt) {
    liste.push({
      name: process.env.ADMIN_NAME || "Admin",
      cookieWert: hashPasswort(haupt),
    });
  }

  for (const [schluessel, wert] of Object.entries(process.env)) {
    if (!schluessel.startsWith(PRAEFIX) || !wert) continue;
    liste.push({
      name: anzeigeName(schluessel.slice(PRAEFIX.length)),
      cookieWert: hashPasswort(wert),
    });
  }

  return liste;
}

/** Ist überhaupt ein Passwort gesetzt? Wenn nicht, ist /admin offen (Dev). */
export function schutzAktiv(): boolean {
  return adminBenutzer().length > 0;
}

/** Passt das eingegebene Passwort zu einem Zugang? */
export function benutzerFuerPasswort(passwort: string): AdminBenutzer | null {
  const hash = hashPasswort(passwort);
  return adminBenutzer().find((b) => b.cookieWert === hash) ?? null;
}

/** Wer steckt hinter diesem Session-Cookie? */
export function benutzerFuerCookie(
  cookieWert: string | undefined,
): AdminBenutzer | null {
  if (!cookieWert) return null;
  return adminBenutzer().find((b) => b.cookieWert === cookieWert) ?? null;
}

export function istAngemeldet(cookieWert: string | undefined): boolean {
  if (!schutzAktiv()) return true; // kein Passwort gesetzt -> offen (Dev)
  return benutzerFuerCookie(cookieWert) !== null;
}
