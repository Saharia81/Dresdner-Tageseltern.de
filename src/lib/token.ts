// Kryptografisch starke Zugangs-Tokens für die Plätze-Bestätigungslinks.
// 32 Zufallsbytes = 256 Bit Entropie, praktisch nicht erratbar.

import { randomBytes } from "node:crypto";

export function generateToken(): string {
  return randomBytes(32).toString("base64url");
}
