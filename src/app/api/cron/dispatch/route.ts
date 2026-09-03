// Täglicher Dispatcher – EIN Cron-Job statt mehrerer (passt in Vercel Hobby,
// das nur 2 Cron-Jobs erlaubt). Läuft jeden Tag um 08:00 UTC und ruft je nach
// Datum die passende Routine auf. Die eigentliche Logik (inkl. Auth und der
// Roll-out-Ausnahmen) liegt unverändert in den jeweiligen Routen.

import { NextResponse } from "next/server";
import { GET as monthlyGet } from "../monthly-emails/route";
import { GET as reminderGet } from "../reminder-emails/route";
import { GET as cleanupGet } from "../cleanup/route";
import { GET as bannerRemindersGet } from "../banner-reminders/route";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Einmalige Verschiebung September 2026.
//
// Am 1.9. fiel die Abfrage-Mail aus: Der Deploy vom 26.8. brachte Code mit,
// der die Spalten ersatzmodell/ersatzFreierPlatz abfragt, die zugehörige
// Migration war in der Produktions-DB aber nie angewendet. Jede Tagesmutter-
// Abfrage lief damit auf einen Fehler, der Versand brach ab.
//
// Der komplette Zyklus rückt deshalb einmalig um drei Tage nach hinten. Das
// ist kein kosmetisches Detail: buildMonthlyEmail nennt in der Mail die
// Fristen als Versandtag + 5 und + 10 Tage. Nur bei dieser Verschiebung
// stimmen die zugesagten Termine mit den Cron-Läufen überein, sonst würde
// der Cleanup drei Tage vor dem angekündigten Datum löschen.
//
// Ab Oktober 2026 gilt wieder der normale Rhythmus 1./6./11.
const SEPTEMBER_VERSCHOBEN: Record<string, "monthly" | "reminder" | "cleanup"> = {
  "2026-09-04": "monthly",
  "2026-09-09": "reminder",
  "2026-09-14": "cleanup",
};

// Die reguläre Erinnerung am 6.9. und der reguläre Cleanup am 11.9. entfallen,
// sie sind durch die Termine oben ersetzt.
const SEPTEMBER_ENTFAELLT = ["2026-09-06", "2026-09-11"];

export async function GET(request: Request) {
  const heute = new Date();
  const tag = heute.getUTCDate();
  const monat = heute.getUTCMonth() + 1; // 1–12
  const heuteIso = heute.toISOString().slice(0, 10);

  // Banner-Erinnerungen laufen JEDEN Tag (datumsabhängig je Buchung).
  const bannerRes = await bannerRemindersGet(request);
  const banner = await bannerRes.json().catch(() => null);

  // Datumsabhängige Monats-Routinen
  let monatsRoutine: unknown = null;
  const verschoben = SEPTEMBER_VERSCHOBEN[heuteIso];
  if (verschoben) {
    const routine =
      verschoben === "monthly"
        ? monthlyGet
        : verschoben === "reminder"
          ? reminderGet
          : cleanupGet;
    monatsRoutine = await (await routine(request)).json().catch(() => null);
  } else if (SEPTEMBER_ENTFAELLT.includes(heuteIso)) {
    monatsRoutine = {
      ok: true,
      uebersprungen: true,
      grund: `Einmalig entfallen, September 2026 um drei Tage verschoben (${heuteIso})`,
    };
  } else if (tag === 1) {
    monatsRoutine = await (await monthlyGet(request)).json().catch(() => null);
  } else if (tag === 6) {
    monatsRoutine = await (await reminderGet(request)).json().catch(() => null);
  } else if (tag === 11) {
    monatsRoutine = await (await cleanupGet(request)).json().catch(() => null);
  } else if (monat === 6 && tag === 12) {
    // Einmalige Roll-out-Erinnerung am 12.6.2026
    monatsRoutine = await (await reminderGet(request)).json().catch(() => null);
  }

  return NextResponse.json({ ok: true, banner, monatsRoutine });
}
