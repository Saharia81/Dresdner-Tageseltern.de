// Cron: am 1. des Monats um 08:00 – Aufforderung an alle aktiven Tagesmütter,
// ihre freien Plätze zu bestätigen.
//
// Sicherheit: Vercel-Cron-Jobs senden den Header `Authorization: Bearer <CRON_SECRET>`.
// Wir lassen Aufrufe ohne korrektes Secret nicht durch.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildMonthlyEmail, sendeMail } from "@/lib/email";

export const dynamic = "force-dynamic";
// Genug Zeit für den sequentiellen Versand an alle Tagesmütter (ca. 50 Mails).
export const maxDuration = 60;

// Kurze Pause, um das Sendelimit des Mailservers (All-Inkl) zu schonen.
function warte(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pruefeCronAuth(request: Request): NextResponse | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) return null; // ohne Secret keine Prüfung (z.B. lokal)
  const header = request.headers.get("authorization");
  if (header !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }
  return null;
}

export async function GET(request: Request) {
  const fehler = pruefeCronAuth(request);
  if (fehler) return fehler;

  const heute = new Date();

  const tagesmuetter = await prisma.tagesmutter.findMany({
    where: { istAktiv: true },
    include: { freiePlaetze: true },
  });

  let versandt = 0;
  let fehlgeschlagen = 0;
  const fehlerListe: string[] = [];

  for (const tm of tagesmuetter) {
    try {
      const fp = tm.freiePlaetze;
      const plaetze = [
        { nr: 1, ab: fp?.platz1Ab ?? null },
        { nr: 2, ab: fp?.platz2Ab ?? null },
        { nr: 3, ab: fp?.platz3Ab ?? null },
        { nr: 4, ab: fp?.platz4Ab ?? null },
        { nr: 5, ab: fp?.platz5Ab ?? null },
      ];

      const mail = buildMonthlyEmail({
        vorname: tm.vorname,
        emailToken: tm.emailToken,
        plaetze,
        heute,
      });
      await sendeMail({ an: tm.email, ...mail });
      versandt++;
      await warte(400); // ~0,4 Sek. zwischen den Mails
    } catch (err) {
      fehlgeschlagen++;
      const msg = err instanceof Error ? err.message : String(err);
      fehlerListe.push(`${tm.email}: ${msg}`);
      console.error(`Mail an ${tm.email} fehlgeschlagen:`, err);
    }
  }

  return NextResponse.json({
    ok: true,
    typ: "monthly",
    versandt,
    fehlgeschlagen,
    fehler: fehlerListe,
  });
}
