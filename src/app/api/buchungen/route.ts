// API für das Banner-Buchungssystem (Phase 2).
//
//  GET  /api/buchungen?bannerId=...   → belegte Zeiträume (für den Kalender)
//  POST /api/buchungen                → neue Buchung anlegen
//
// Ablauf POST:
//   • Validierung (Pflichtfelder, Grundstück-Häkchen, Datumslogik)
//   • Überlappungsprüfung gegen bestehende Buchungen
//   • Anzeige-Typ INDIVIDUELL → immer Status ANFRAGE (Inhalt geht erst nach
//     Admin-Freigabe live), Hinweis-Mail an den Verein
//   • sonst (STECKBRIEF): E-Mail zu aktivem Profil passend → Status BESTAETIGT,
//     Bestätigungsmail; ohne Treffer → Status ANFRAGE, Hinweis-Mail an den Verein

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  findeAktiveTagesmutterByEmail,
  pruefeUeberlappung,
  gebuchteZeitraeume,
  tagesBeginn,
  tagISO,
} from "@/lib/buchungen";
import {
  sendeMail,
  buildBuchungBestaetigungEmail,
  buildAdminBuchungsanfrageEmail,
} from "@/lib/email";

export const dynamic = "force-dynamic";

// ----------------------------------------------------------------
// Einfaches In-Memory-Rate-Limit (Muster aus /api/plaetze).
// ----------------------------------------------------------------
const RATE_LIMIT = 20;
const RATE_FENSTER_MS = 60_000;
const zugriffe = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const jetzt = Date.now();
  const liste = (zugriffe.get(ip) ?? []).filter(
    (t) => jetzt - t < RATE_FENSTER_MS,
  );
  liste.push(jetzt);
  zugriffe.set(ip, liste);
  return liste.length > RATE_LIMIT;
}

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0].trim() : "unbekannt";
}

function parseTag(value: unknown): Date | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return tagesBeginn(d);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ----------------------------------------------------------------
// GET – belegte Zeiträume eines Banners
// ----------------------------------------------------------------
export async function GET(request: Request) {
  if (rateLimited(clientIp(request))) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte kurz warten." },
      { status: 429 },
    );
  }

  const { searchParams } = new URL(request.url);
  const bannerId = searchParams.get("bannerId");
  if (!bannerId) {
    return NextResponse.json({ error: "bannerId fehlt" }, { status: 400 });
  }

  const zeitraeume = await gebuchteZeitraeume(bannerId);
  return NextResponse.json({
    zeitraeume: zeitraeume.map((z) => ({
      start: tagISO(z.zeitraumStart),
      ende: tagISO(z.zeitraumEnde),
    })),
  });
}

// ----------------------------------------------------------------
// POST – neue Buchung
// ----------------------------------------------------------------
export async function POST(request: Request) {
  if (rateLimited(clientIp(request))) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte kurz warten." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültiger Body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Ungültiger Body" }, { status: 400 });
  }

  const {
    bannerId,
    name,
    email,
    start,
    ende,
    grundstueckBestaetigt,
    anzeigeTyp: anzeigeTypRoh,
    wunsch: wunschRoh,
  } = body as Record<string, unknown>;

  // Anzeige-Typ: STECKBRIEF (Standard) oder INDIVIDUELL (freier Inhalt).
  const anzeigeTyp = anzeigeTypRoh === "INDIVIDUELL" ? "INDIVIDUELL" : "STECKBRIEF";
  const wunsch =
    typeof wunschRoh === "string" && wunschRoh.trim()
      ? wunschRoh.trim().slice(0, 1000)
      : null;

  // Validierung
  if (typeof bannerId !== "string" || !bannerId) {
    return NextResponse.json({ error: "Banner fehlt" }, { status: 400 });
  }
  if (typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json(
      { error: "Bitte gib deinen Namen an." },
      { status: 400 },
    );
  }
  if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    return NextResponse.json(
      { error: "Bitte gib eine gültige E-Mail-Adresse an." },
      { status: 400 },
    );
  }
  if (grundstueckBestaetigt !== true) {
    return NextResponse.json(
      {
        error:
          "Bitte bestätige, dass du das Aufhängen mit dem Grundstückseigentümer abgesprochen hast.",
      },
      { status: 400 },
    );
  }

  const startTag = parseTag(start);
  const endeTag = parseTag(ende);
  if (!startTag || !endeTag) {
    return NextResponse.json(
      { error: "Bitte wähle einen gültigen Zeitraum." },
      { status: 400 },
    );
  }
  if (endeTag < startTag) {
    return NextResponse.json(
      { error: "Das Enddatum muss nach dem Startdatum liegen." },
      { status: 400 },
    );
  }
  if (startTag < tagesBeginn(new Date())) {
    return NextResponse.json(
      { error: "Der Startzeitpunkt darf nicht in der Vergangenheit liegen." },
      { status: 400 },
    );
  }

  const banner = await prisma.banner.findUnique({ where: { id: bannerId } });
  if (!banner || !banner.istAktiv) {
    return NextResponse.json(
      { error: "Banner nicht gefunden." },
      { status: 404 },
    );
  }

  if (await pruefeUeberlappung(bannerId, startTag, endeTag)) {
    return NextResponse.json(
      {
        error:
          "Dieser Zeitraum ist für den Banner bereits belegt. Bitte wähle andere Daten.",
      },
      { status: 409 },
    );
  }

  // Profil-Zuordnung über die E-Mail. Bei individuellem Inhalt zeigen wir den
  // Steckbrief NICHT automatisch und bestätigen nicht automatisch – der Admin
  // pflegt den Inhalt und gibt frei.
  const tagesmutter =
    anzeigeTyp === "STECKBRIEF"
      ? await findeAktiveTagesmutterByEmail(email)
      : null;
  const status = tagesmutter ? "BESTAETIGT" : "ANFRAGE";

  const buchung = await prisma.buchung.create({
    data: {
      bannerId,
      tagesmutterId: tagesmutter?.id ?? null,
      kontaktName: name.trim(),
      kontaktEmail: email.trim(),
      grundstueckBestaetigt: true,
      anzeigeTyp,
      wunsch,
      status,
      zeitraumStart: startTag,
      zeitraumEnde: endeTag,
    },
  });

  // Mails (Fehler dürfen die Buchung nicht scheitern lassen)
  try {
    if (tagesmutter) {
      const mail = buildBuchungBestaetigungEmail({
        name: buchung.kontaktName,
        bannerBezeichnung: banner.bezeichnung,
        start: startTag,
        ende: endeTag,
        token: buchung.token,
      });
      await sendeMail({ an: buchung.kontaktEmail, ...mail });
    } else {
      const mail = buildAdminBuchungsanfrageEmail({
        kontaktName: buchung.kontaktName,
        kontaktEmail: buchung.kontaktEmail,
        bannerBezeichnung: banner.bezeichnung,
        start: startTag,
        ende: endeTag,
        anzeigeTyp,
        wunsch,
      });
      await sendeMail({
        an: process.env.ADMIN_EMAIL ?? "info@dresdner-tageseltern.de",
        ...mail,
      });
    }
  } catch (err) {
    console.error("Buchungs-Mail fehlgeschlagen:", err);
  }

  return NextResponse.json({ ok: true, status, anzeigeTyp });
}
