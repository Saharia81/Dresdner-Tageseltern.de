// Cron: täglich – Banner-Erinnerungen.
//   • 5 Tage vor Mietbeginn: Übergabe-Infos + Kontakt der Vorgängerin
//   • 3 Tage vor Mietende:   Info, was danach passiert (Nachfolgerin / Finder)
//
// Wird vom täglichen Dispatcher (../dispatch) aufgerufen. Flags am Datensatz
// verhindern Doppelversand.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  tagesBeginn,
  plusTage,
  aktuelleBuchung,
  naechsteBuchung,
} from "@/lib/buchungen";
import {
  sendeMail,
  buildBanner5TageEmail,
  buildBanner3TageEmail,
} from "@/lib/email";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function warte(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pruefeCronAuth(request: Request): NextResponse | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) return null;
  const header = request.headers.get("authorization");
  if (header !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }
  return null;
}

// Tagesfenster [tag, tag+1) für ein DateTime-Feld.
function tagFenster(tag: Date) {
  return { gte: tag, lt: plusTage(tag, 1) };
}

export async function GET(request: Request) {
  const fehler = pruefeCronAuth(request);
  if (fehler) return fehler;

  const heute = tagesBeginn(new Date());
  const in5Tagen = plusTage(heute, 5);
  const in3Tagen = plusTage(heute, 3);

  let versandt5 = 0;
  let versandt3 = 0;
  const fehlerListe: string[] = [];

  // --- 5 Tage vor Beginn ---
  const startBald = await prisma.buchung.findMany({
    where: {
      status: "BESTAETIGT",
      erinnerung5TageGesendet: false,
      zeitraumStart: tagFenster(in5Tagen),
    },
    include: { banner: true },
  });

  for (const b of startBald) {
    try {
      // Wer hält den Banner am Tag vor der Übergabe?
      const vorgaengerBuchung = await aktuelleBuchung(
        b.banner.nummer,
        plusTage(b.zeitraumStart, -1),
      );
      // Telefonnummer der Vorgängerin (falls einem Profil zugeordnet).
      let vorgaengerTelefon: string | null = null;
      if (vorgaengerBuchung?.tagesmutterId) {
        const tm = await prisma.tagesmutter.findUnique({
          where: { id: vorgaengerBuchung.tagesmutterId },
          select: { telefon: true },
        });
        vorgaengerTelefon = tm?.telefon ?? null;
      }

      const vorgaenger =
        vorgaengerBuchung && vorgaengerBuchung.id !== b.id
          ? {
              name: vorgaengerBuchung.kontaktName,
              email: vorgaengerBuchung.kontaktEmail,
              telefon: vorgaengerTelefon,
            }
          : null;

      const mail = buildBanner5TageEmail({
        name: b.kontaktName,
        bannerBezeichnung: b.banner.bezeichnung,
        start: b.zeitraumStart,
        vorgaenger,
      });
      await sendeMail({ an: b.kontaktEmail, ...mail });
      await prisma.buchung.update({
        where: { id: b.id },
        data: { erinnerung5TageGesendet: true },
      });
      versandt5++;
      await warte(400);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      fehlerListe.push(`5T ${b.kontaktEmail}: ${msg}`);
      console.error(`5-Tage-Mail an ${b.kontaktEmail} fehlgeschlagen:`, err);
    }
  }

  // --- 3 Tage vor Ende ---
  const endeBald = await prisma.buchung.findMany({
    where: {
      status: "BESTAETIGT",
      info3TageGesendet: false,
      zeitraumEnde: tagFenster(in3Tagen),
    },
    include: { banner: true },
  });

  for (const b of endeBald) {
    try {
      const nachfolgerBuchung = await naechsteBuchung(b.bannerId, b.zeitraumEnde);
      const nachfolger = nachfolgerBuchung
        ? { name: nachfolgerBuchung.kontaktName }
        : null;

      const mail = buildBanner3TageEmail({
        name: b.kontaktName,
        bannerBezeichnung: b.banner.bezeichnung,
        ende: b.zeitraumEnde,
        nachfolger,
      });
      await sendeMail({ an: b.kontaktEmail, ...mail });
      await prisma.buchung.update({
        where: { id: b.id },
        data: { info3TageGesendet: true },
      });
      versandt3++;
      await warte(400);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      fehlerListe.push(`3T ${b.kontaktEmail}: ${msg}`);
      console.error(`3-Tage-Mail an ${b.kontaktEmail} fehlgeschlagen:`, err);
    }
  }

  return NextResponse.json({
    ok: true,
    typ: "banner-reminders",
    versandt5,
    versandt3,
    fehler: fehlerListe,
  });
}
