// Cron: am 11. des Monats um 08:00 – Aufräumen.
//
// 1. Bei Tagesmüttern, die diesen Monat NICHT bestätigt haben:
//    alle Platz-Datumsfelder auf null setzen (Profil bleibt bestehen).
// 2. Admin-Zusammenfassung an ADMIN_EMAIL versenden.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildAdminSummaryEmail, sendeMail } from "@/lib/email";

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
  const authError = pruefeCronAuth(request);
  if (authError) return authError;

  const heute = new Date();
  const grenze = monatsAnfang(heute);

  const alle = await prisma.tagesmutter.findMany({
    where: { istAktiv: true },
    include: { freiePlaetze: true },
  });

  let bestaetigt = 0;
  let aktualisiert = 0;
  let nichtGeantwortet = 0;

  for (const tm of alle) {
    const hatBestaetigt = tm.lastConfirmed && tm.lastConfirmed >= grenze;
    if (!hatBestaetigt) {
      // Plätze leeren (Profil bleibt)
      if (tm.freiePlaetze) {
        await prisma.freiePlaetze.update({
          where: { tagesmutterId: tm.id },
          data: {
            platz1Ab: null,
            platz2Ab: null,
            platz3Ab: null,
            platz4Ab: null,
            platz5Ab: null,
          },
        });
      }
      nichtGeantwortet++;
      continue;
    }

    // Heuristik „bestätigt" vs. „aktualisiert":
    // Wenn `aktualisiertAm` der FreiePlaetze >= lastConfirmed (innerhalb 1 Minute),
    // gehen wir davon aus, dass die Plätze gleichzeitig mit der Bestätigung
    // geändert wurden → "aktualisiert", sonst nur "bestätigt".
    const fpStand = tm.freiePlaetze?.aktualisiertAm ?? null;
    if (fpStand && fpStand >= grenze && fpStand.getTime() >= tm.lastConfirmed!.getTime() - 60_000) {
      aktualisiert++;
    } else {
      bestaetigt++;
    }
  }

  // Admin-Mail
  const adminEmail = process.env.ADMIN_EMAIL;
  let adminMailVersandt = false;
  if (adminEmail) {
    try {
      const mail = buildAdminSummaryEmail({
        heute,
        bestaetigt,
        aktualisiert,
        nichtGeantwortet,
      });
      await sendeMail({ an: adminEmail, ...mail });
      adminMailVersandt = true;
    } catch (err) {
      console.error("Admin-Zusammenfassung fehlgeschlagen:", err);
    }
  } else {
    console.warn("ADMIN_EMAIL nicht gesetzt – keine Zusammenfassung versandt.");
  }

  return NextResponse.json({
    ok: true,
    typ: "cleanup",
    bestaetigt,
    aktualisiert,
    nichtGeantwortet,
    adminMailVersandt,
  });
}
