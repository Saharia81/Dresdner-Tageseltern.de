// Cron: am 6. des Monats um 08:00 – Erinnerung an alle Tagesmütter,
// deren `lastConfirmed` nicht im aktuellen Monat liegt.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildReminderEmail, sendeMailsBatch } from "@/lib/email";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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

  // Einmalige Ausnahme Roll-out Juni 2026: Die Erstmail ging am 5.6. raus,
  // daher wird die reguläre 6.6.-Erinnerung übersprungen. Stattdessen läuft
  // eine einmalige Erinnerung am 12.6. (separater Cron in vercel.json).
  // Ab Juli greift wieder der normale Rhythmus (6. des Monats).
  if (heute.toISOString().slice(0, 10) === "2026-06-06") {
    return NextResponse.json({
      ok: true,
      typ: "reminder",
      uebersprungen: true,
      grund: "Einmalig ausgesetzt (Roll-out Juni 2026)",
    });
  }

  const grenze = monatsAnfang(heute);

  // Alle, die diesen Monat noch nicht bestätigt haben
  const empfaenger = await prisma.tagesmutter.findMany({
    where: {
      istAktiv: true,
      OR: [{ lastConfirmed: null }, { lastConfirmed: { lt: grenze } }],
    },
    include: { freiePlaetze: true },
  });

  const mails = empfaenger.map((tm) => {
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
    return { an: tm.email, ...mail };
  });

  const { versandt, fehlgeschlagen, fehler: fehlerListe } =
    await sendeMailsBatch(mails);

  if (fehlgeschlagen > 0) {
    console.error(`Erinnerung: ${fehlgeschlagen} fehlgeschlagen`, fehlerListe);
  }

  return NextResponse.json({
    ok: true,
    typ: "reminder",
    empfaenger: mails.length,
    versandt,
    fehlgeschlagen,
    fehler: fehlerListe,
  });
}
