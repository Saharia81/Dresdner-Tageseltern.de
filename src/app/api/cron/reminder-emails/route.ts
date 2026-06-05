// Cron: am 6. des Monats um 08:00 – Erinnerung an alle Tagesmütter,
// deren `lastConfirmed` nicht im aktuellen Monat liegt.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildReminderEmail, sendeMail } from "@/lib/email";

export const dynamic = "force-dynamic";

function pruefeCronAuth(request: Request): NextResponse | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) return null;
  const header = request.headers.get("authorization");
  if (header !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }
  return null;
}

function monatsAnfang(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

export async function GET(request: Request) {
  const fehler = pruefeCronAuth(request);
  if (fehler) return fehler;

  const heute = new Date();
  const grenze = monatsAnfang(heute);

  // Alle, die diesen Monat noch nicht bestätigt haben
  const empfaenger = await prisma.tagesmutter.findMany({
    where: {
      istAktiv: true,
      OR: [{ lastConfirmed: null }, { lastConfirmed: { lt: grenze } }],
    },
    include: { freiePlaetze: true },
  });

  let versandt = 0;
  let fehlgeschlagen = 0;
  const fehlerListe: string[] = [];

  for (const tm of empfaenger) {
    try {
      const fp = tm.freiePlaetze;
      const plaetze = [
        { nr: 1, ab: fp?.platz1Ab ?? null },
        { nr: 2, ab: fp?.platz2Ab ?? null },
        { nr: 3, ab: fp?.platz3Ab ?? null },
        { nr: 4, ab: fp?.platz4Ab ?? null },
        { nr: 5, ab: fp?.platz5Ab ?? null },
      ];

      const mail = buildReminderEmail({
        vorname: tm.vorname,
        emailToken: tm.emailToken,
        plaetze,
        heute,
      });
      await sendeMail({ an: tm.email, ...mail });
      versandt++;
    } catch (err) {
      fehlgeschlagen++;
      const msg = err instanceof Error ? err.message : String(err);
      fehlerListe.push(`${tm.email}: ${msg}`);
      console.error(`Erinnerung an ${tm.email} fehlgeschlagen:`, err);
    }
  }

  return NextResponse.json({
    ok: true,
    typ: "reminder",
    versandt,
    fehlgeschlagen,
    fehler: fehlerListe,
  });
}
