// Rendert die drei E-Mail-Templates als HTML-Dateien zur visuellen Vorschau.
// Aufruf:  npx tsx scripts/preview-emails.ts
// Ergebnis: scripts/_preview/*.html  (im Browser öffnen)

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  buildMonthlyEmail,
  buildReminderEmail,
  buildAdminSummaryEmail,
} from "../src/lib/email";

const heute = new Date(2026, 6, 1); // 1. Juli 2026
const outDir = join(process.cwd(), "scripts", "_preview");
mkdirSync(outDir, { recursive: true });

const monthly = buildMonthlyEmail({
  vorname: "Sandy",
  emailToken: "demo-token",
  plaetze: [
    { nr: 1, ab: new Date(2026, 7, 1) },
    { nr: 2, ab: new Date(2026, 8, 15) },
    { nr: 3, ab: null },
    { nr: 4, ab: null },
    { nr: 5, ab: null },
  ],
  heute,
});

const reminder = buildReminderEmail({
  vorname: "Sandy",
  emailToken: "demo-token",
  plaetze: [
    { nr: 1, ab: new Date(2026, 7, 1) },
    { nr: 2, ab: new Date(2026, 8, 15) },
    { nr: 3, ab: null },
    { nr: 4, ab: null },
    { nr: 5, ab: null },
  ],
  heute,
});

const admin = buildAdminSummaryEmail({
  heute,
  bestaetigt: 31,
  aktualisiert: 9,
  nichtGeantwortet: 7,
});

// Für die lokale Vorschau das Logo als data-URI einbetten, damit es
// im Browser sichtbar ist (im echten Versand kommt es von APP_URL).
import { readFileSync } from "node:fs";
const logoB64 = readFileSync(
  join(process.cwd(), "public", "images", "logo-tageseltern.png"),
).toString("base64");
const logoDataUri = `data:image/png;base64,${logoB64}`;

function mitLokalemLogo(html: string): string {
  return html.replace(
    /https?:\/\/[^"]+\/images\/logo-tageseltern\.png/g,
    logoDataUri,
  );
}

for (const [name, mail] of [
  ["1-monatsaufforderung", monthly],
  ["2-erinnerung", reminder],
  ["3-admin-zusammenfassung", admin],
] as const) {
  const file = join(outDir, `${name}.html`);
  writeFileSync(file, mitLokalemLogo(mail.html), "utf8");
  console.log(`Betreff: ${mail.betreff}`);
  console.log(`  → ${file}\n`);
}
