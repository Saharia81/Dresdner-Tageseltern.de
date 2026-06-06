// ============================================================
// Phase 2 – Banner-Buchungssystem: zentrale Datenbank-Helfer
// ============================================================

import { prisma } from "./db";

// Status, die einen Zeitraum tatsächlich "belegen". Anfragen (ANFRAGE) blocken
// noch nicht endgültig, gelten aber als vorgemerkt; abgelehnte/abgelaufene
// Buchungen blockieren nicht mehr.
export const BELEGENDE_STATUS = ["ANFRAGE", "BESTAETIGT"] as const;

// Tagesbeginn (lokale Zeit) – Buchungen sind tagesgenau.
export function tagesBeginn(d: Date): Date {
  const n = new Date(d);
  n.setHours(0, 0, 0, 0);
  return n;
}

export function plusTage(d: Date, tage: number): Date {
  const n = new Date(d);
  n.setDate(n.getDate() + tage);
  return n;
}

// Kalendertag als "YYYY-MM-DD". Buchungstage werden als LOKALE Mitternacht
// gespeichert (siehe tagesBeginn), daher muss hier lokal formatiert werden.
// NICHT toISOString() verwenden – das rechnet nach UTC um und verschiebt in
// Zeitzonen mit positivem Offset (z. B. Sommerzeit) den Tag um einen Tag.
export function tagISO(d: Date): string {
  const jahr = d.getFullYear();
  const monat = String(d.getMonth() + 1).padStart(2, "0");
  const tag = String(d.getDate()).padStart(2, "0");
  return `${jahr}-${monat}-${tag}`;
}

// Findet ein aktives Tagesmutter-Profil zu einer E-Mail (case-insensitive).
export async function findeAktiveTagesmutterByEmail(email: string) {
  const sauber = email.trim();
  if (!sauber) return null;
  const tm = await prisma.tagesmutter.findFirst({
    where: { email: { equals: sauber, mode: "insensitive" }, istAktiv: true },
  });
  return tm;
}

// Prüft, ob sich [start, ende] mit einer belegenden Buchung des Banners
// überschneidet. Zeiträume sind inklusiv; Überlappung, wenn start <= e.ende
// und ende >= e.start.
export async function pruefeUeberlappung(
  bannerId: string,
  start: Date,
  ende: Date,
  exclBuchungId?: string,
): Promise<boolean> {
  const konflikt = await prisma.buchung.findFirst({
    where: {
      bannerId,
      status: { in: [...BELEGENDE_STATUS] },
      zeitraumStart: { lte: ende },
      zeitraumEnde: { gte: start },
      ...(exclBuchungId ? { id: { not: exclBuchungId } } : {}),
    },
  });
  return konflikt !== null;
}

// Liefert alle belegten Zeiträume eines Banners (für die Kalenderanzeige).
export async function gebuchteZeitraeume(bannerId: string) {
  const buchungen = await prisma.buchung.findMany({
    where: { bannerId, status: { in: [...BELEGENDE_STATUS] } },
    select: { zeitraumStart: true, zeitraumEnde: true, status: true },
    orderBy: { zeitraumStart: "asc" },
  });
  return buchungen;
}

// Aktuell laufende, bestätigte Buchung eines Banners (per Banner-Nummer).
export async function aktuelleBuchung(bannerNummer: number, am: Date = new Date()) {
  const tag = tagesBeginn(am);
  return prisma.buchung.findFirst({
    where: {
      banner: { nummer: bannerNummer },
      status: "BESTAETIGT",
      zeitraumStart: { lte: tag },
      zeitraumEnde: { gte: tag },
    },
    include: { banner: true },
    orderBy: { zeitraumStart: "desc" },
  });
}

// Nächste bestätigte Buchung nach einem Datum (Nachfolgerin, für die 3-Tage-Mail).
export async function naechsteBuchung(bannerId: string, nachDatum: Date) {
  return prisma.buchung.findFirst({
    where: {
      bannerId,
      status: "BESTAETIGT",
      zeitraumStart: { gt: nachDatum },
    },
    orderBy: { zeitraumStart: "asc" },
  });
}
