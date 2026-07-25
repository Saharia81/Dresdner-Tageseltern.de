// Cron: am 1. des Monats um 08:00 – Aufforderung an alle aktiven Tagesmütter,
// ihre freien Plätze zu bestätigen.
//
// Sicherheit: Vercel-Cron-Jobs senden den Header `Authorization: Bearer <CRON_SECRET>`.
// Wir lassen Aufrufe ohne korrektes Secret nicht durch.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildMonthlyEmail, sendeMailsBatch } from "@/lib/email";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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

  // Alle Mails vorbauen und per Resend-Batch in einem Rutsch verschicken.
  const mails = tagesmuetter.map((tm) => {
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
    return { an: tm.email, ...mail };
  });

  // Optionale Test-Parameter (nur manuell mit CRON_SECRET nutzbar; der Cron
  // ruft ohne Parameter auf, also unverändertes Regelverhalten):
  //   ?only=<email>  → nur an diese eine Adresse senden
  //   ?dry=1         → nichts senden, nur die Empfänger auflisten
  const url = new URL(request.url);
  const only = url.searchParams.get("only");
  const dry = url.searchParams.get("dry") === "1";

  const ziel = only
    ? mails.filter((m) => m.an.toLowerCase() === only.toLowerCase())
    : mails;

  if (dry) {
    return NextResponse.json({
      ok: true,
      typ: "monthly",
      dryRun: true,
      empfaenger: ziel.length,
      adressen: ziel.map((m) => m.an),
    });
  }

  const { versandt, fehlgeschlagen, fehler: fehlerListe } =
    await sendeMailsBatch(ziel);

  if (fehlgeschlagen > 0) {
    console.error(`Monatsmail: ${fehlgeschlagen} fehlgeschlagen`, fehlerListe);
  }

  return NextResponse.json({
    ok: true,
    typ: "monthly",
    empfaenger: ziel.length,
    versandt,
    fehlgeschlagen,
    fehler: fehlerListe,
  });
}
