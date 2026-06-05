// Täglicher Dispatcher – EIN Cron-Job statt mehrerer (passt in Vercel Hobby,
// das nur 2 Cron-Jobs erlaubt). Läuft jeden Tag um 08:00 UTC und ruft je nach
// Datum die passende Routine auf. Die eigentliche Logik (inkl. Auth und der
// Roll-out-Ausnahmen) liegt unverändert in den jeweiligen Routen.

import { NextResponse } from "next/server";
import { GET as monthlyGet } from "../monthly-emails/route";
import { GET as reminderGet } from "../reminder-emails/route";
import { GET as cleanupGet } from "../cleanup/route";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const heute = new Date();
  const tag = heute.getUTCDate();
  const monat = heute.getUTCMonth() + 1; // 1–12

  // Aufforderung am 1.
  if (tag === 1) return monthlyGet(request);

  // Reguläre Erinnerung am 6.
  if (tag === 6) return reminderGet(request);

  // Aufräumen am 11.
  if (tag === 11) return cleanupGet(request);

  // Einmalige Roll-out-Erinnerung am 12.6.2026
  if (monat === 6 && tag === 12) return reminderGet(request);

  return NextResponse.json({ ok: true, info: "Heute keine Aktion fällig." });
}
