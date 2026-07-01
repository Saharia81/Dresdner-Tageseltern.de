// Täglicher Dispatcher – EIN Cron-Job statt mehrerer (passt in Vercel Hobby,
// das nur 2 Cron-Jobs erlaubt). Läuft jeden Tag um 08:00 UTC und ruft je nach
// Datum die passende Routine auf. Die eigentliche Logik (inkl. Auth und der
// Roll-out-Ausnahmen) liegt unverändert in den jeweiligen Routen.

import { NextResponse } from "next/server";
import { GET as monthlyGet } from "../monthly-emails/route";
import { GET as reminderGet } from "../reminder-emails/route";
import { GET as cleanupGet } from "../cleanup/route";
import { GET as bannerRemindersGet } from "../banner-reminders/route";
import { schliesseMailVerbindung } from "@/lib/email";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const heute = new Date();
  const tag = heute.getUTCDate();
  const monat = heute.getUTCMonth() + 1; // 1–12

  // Banner-Erinnerungen laufen JEDEN Tag (datumsabhängig je Buchung).
  const bannerRes = await bannerRemindersGet(request);
  const banner = await bannerRes.json().catch(() => null);

  // Datumsabhängige Monats-Routinen
  let monatsRoutine: unknown = null;
  if (tag === 1) {
    monatsRoutine = await (await monthlyGet(request)).json().catch(() => null);
  } else if (tag === 6) {
    monatsRoutine = await (await reminderGet(request)).json().catch(() => null);
  } else if (tag === 11) {
    monatsRoutine = await (await cleanupGet(request)).json().catch(() => null);
  } else if (monat === 6 && tag === 12) {
    // Einmalige Roll-out-Erinnerung am 12.6.2026
    monatsRoutine = await (await reminderGet(request)).json().catch(() => null);
  }

  // Gepoolte SMTP-Verbindung schließen, egal welche Routine gelaufen ist.
  schliesseMailVerbindung();

  return NextResponse.json({ ok: true, banner, monatsRoutine });
}
