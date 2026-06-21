// Anlegen & Bearbeiten von Tagesmütter-Steckbriefen über den Admin-Bereich.
// Die Datenbank ist die führende Datenquelle (kein Excel-Import mehr).
// Geschützt über die Passwort-Middleware (src/proxy.ts).
//
//  POST  /api/admin/steckbriefe   – neues Mitglied anlegen
//  PATCH /api/admin/steckbriefe   – bestehendes Mitglied ändern (per id)
//
// Löschen ist bewusst nicht vorgesehen: Mitglieder werden über istAktiv=false
// ausgeblendet, damit verknüpfte Buchungen erhalten bleiben.

import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { slugify, plzPad, geocode } from "@/lib/tagesmutter-helpers";

export const dynamic = "force-dynamic";

type Body = Record<string, unknown>;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function strOrNull(v: unknown): string | null {
  const s = str(v);
  return s.length === 0 ? null : s;
}

function numOrNull(v: unknown): number | null {
  const s = str(v).replace(",", ".");
  if (s.length === 0) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function datumOrNull(v: unknown): Date | null {
  const s = str(v);
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function verpflegungOf(v: unknown): "SELBST_GEKOCHT" | "CATERING" {
  return str(v) === "CATERING" ? "CATERING" : "SELBST_GEKOCHT";
}

function beratungOf(v: unknown): "MALWINA" | "OUTLAW" | "KINDERLAND" {
  const s = str(v);
  if (s === "OUTLAW" || s === "KINDERLAND") return s;
  return "MALWINA";
}

function ersatzmodellOf(v: unknown): "KEINE" | "BASIS_ETP" | "STUETZPUNKT" {
  const s = str(v);
  if (s === "BASIS_ETP" || s === "STUETZPUNKT") return s;
  return "KEINE";
}

// Eindeutigen Slug erzeugen; bei Kollision -2, -3 … anhängen.
async function eindeutigerSlug(
  basis: string,
  ausserId?: string,
): Promise<string> {
  let slug = basis || "tagesmutter";
  let n = 1;
  // Schleife, bis kein anderer Datensatz diesen Slug hat.
  for (;;) {
    const vorhanden = await prisma.tagesmutter.findUnique({ where: { slug } });
    if (!vorhanden || vorhanden.id === ausserId) return slug;
    n += 1;
    slug = `${basis}-${n}`;
  }
}

// Gemeinsame Feld-Aufbereitung für Create & Update (ohne slug/email-Logik).
function gemeinsameDaten(b: Body) {
  return {
    vorname: str(b.vorname),
    nachname: str(b.nachname),
    einrichtungsname: str(b.einrichtungsname),
    // Bildpfade werden nicht mehr gepflegt – sie ergeben sich aus dem Ordner
    // public/images/tagesmuetter/<nr>/ (siehe lib/tagesmutter-bilder.ts).
    strasse: str(b.strasse),
    plz: plzPad(b.plz),
    stadtteil: str(b.stadtteil),
    latitude: numOrNull(b.latitude),
    longitude: numOrNull(b.longitude),
    telefon: str(b.telefon),
    websiteUrl: strOrNull(b.websiteUrl),
    anmeldungUrl: strOrNull(b.anmeldungUrl),
    oeffnungszeiten: str(b.oeffnungszeiten),
    ersatzbetreuung: str(b.ersatzbetreuung),
    verpflegung: verpflegungOf(b.verpflegung),
    verpflegungHinweis: strOrNull(b.verpflegungHinweis),
    beratungsgebiet: beratungOf(b.beratungsgebiet),
    ersatzmodell: ersatzmodellOf(b.ersatzmodell),
    ersatzFreierPlatz: b.ersatzFreierPlatz === true,
    schmetterling: b.schmetterling === true,
    schmetterlingPartner: strOrNull(b.schmetterlingPartner),
    mitgliedsnummer: strOrNull(b.mitgliedsnummer),
    mitgliedSeit: datumOrNull(b.mitgliedSeit),
    istAktiv: b.istAktiv !== false,
    reihenfolge: Math.trunc(numOrNull(b.reihenfolge) ?? 0),
  };
}

function pruefePflicht(b: Body): string | null {
  if (!str(b.vorname)) return "Vorname fehlt.";
  if (!str(b.nachname)) return "Nachname fehlt.";
  if (!str(b.email)) return "E-Mail fehlt.";
  return null;
}

// Geocoding, falls aktiv, Adresse vorhanden und (noch) keine Koordinaten.
async function ergaenzeKoordinaten<
  T extends { latitude: number | null; longitude: number | null; strasse: string; plz: string; istAktiv: boolean },
>(daten: T): Promise<T> {
  if (daten.latitude !== null || !daten.istAktiv || !daten.strasse) {
    return daten;
  }
  const koord = await geocode(daten.strasse, daten.plz);
  if (koord) {
    daten.latitude = koord.latitude;
    daten.longitude = koord.longitude;
  }
  return daten;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Ungültiger Body" }, { status: 400 });
  }

  const fehler = pruefePflicht(body);
  if (fehler) return NextResponse.json({ error: fehler }, { status: 400 });

  const email = str(body.email);
  if (await prisma.tagesmutter.findUnique({ where: { email } })) {
    return NextResponse.json(
      { error: "Diese E-Mail-Adresse ist bereits vergeben." },
      { status: 409 },
    );
  }

  const daten = await ergaenzeKoordinaten(gemeinsameDaten(body));
  const slug = await eindeutigerSlug(slugify(daten.vorname, daten.nachname));

  try {
    const tm = await prisma.tagesmutter.create({
      data: {
        ...daten,
        email,
        slug,
        // DB-Spalte fotoUrl ist (noch) NOT NULL, wird aber nicht mehr genutzt –
        // das Profilbild kommt aus dem Bilder-Ordner.
        fotoUrl: "",
        freiePlaetze: { create: {} },
      },
    });
    return NextResponse.json({ ok: true, id: tm.id });
  } catch (err) {
    return NextResponse.json(
      { error: fehlerText(err) },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Ungültiger Body" }, { status: 400 });
  }

  const id = str(body.id);
  if (!id) return NextResponse.json({ error: "id fehlt." }, { status: 400 });

  const vorhanden = await prisma.tagesmutter.findUnique({ where: { id } });
  if (!vorhanden) {
    return NextResponse.json(
      { error: "Mitglied nicht gefunden." },
      { status: 404 },
    );
  }

  const fehler = pruefePflicht(body);
  if (fehler) return NextResponse.json({ error: fehler }, { status: 400 });

  const email = str(body.email);
  if (email !== vorhanden.email) {
    const kollision = await prisma.tagesmutter.findUnique({ where: { email } });
    if (kollision) {
      return NextResponse.json(
        { error: "Diese E-Mail-Adresse ist bereits vergeben." },
        { status: 409 },
      );
    }
  }

  const daten = await ergaenzeKoordinaten(gemeinsameDaten(body));

  try {
    await prisma.tagesmutter.update({
      where: { id },
      data: {
        ...daten,
        email,
        // Slug (URL) bewusst stabil halten, auch wenn sich der Name ändert.
      },
    });
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    return NextResponse.json({ error: fehlerText(err) }, { status: 500 });
  }
}

function fehlerText(err: unknown): string {
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    return "Eindeutigkeits-Konflikt (z. B. E-Mail oder Slug).";
  }
  return err instanceof Error ? err.message : "Unbekannter Fehler.";
}
