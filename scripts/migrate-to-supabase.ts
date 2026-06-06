// Einmalskript: Überträgt alle Daten aus der lokalen SQLite-DB nach Supabase.
//
// Vorbereitung:
//   1. DATABASE_URL in .env auf Supabase DIRECT_URL setzen
//   2. SOURCE_DB auf den Pfad zur SQLite-Datei setzen (Standard: ./prisma/dev.db)
//
// Ausführung: npx tsx scripts/migrate-to-supabase.ts

import "dotenv/config";
import Database from "better-sqlite3";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { resolve } from "node:path";

const SOURCE_PATH = process.env.SOURCE_DB ?? resolve(process.cwd(), "prisma/dev.db");
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const pg = new PrismaClient({ adapter });
const sqlite = new Database(SOURCE_PATH, { readonly: true });

function rows<T>(sql: string): T[] {
  return sqlite.prepare(sql).all() as T[];
}

async function main() {
  console.log(`Lese SQLite von: ${SOURCE_PATH}`);

  // 1. BlogPost
  const blogPosts = rows<{
    id: string; slug: string; titel: string; kurztext: string;
    inhaltMd: string; titelbildUrl: string | null; veroeffentlichtAm: string;
    istEntwurf: number; aktualisiertAm: string;
  }>("SELECT * FROM BlogPost");

  for (const p of blogPosts) {
    await pg.blogPost.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        slug: p.slug,
        titel: p.titel,
        kurztext: p.kurztext,
        inhaltMd: p.inhaltMd,
        titelbildUrl: p.titelbildUrl,
        veroeffentlichtAm: new Date(p.veroeffentlichtAm),
        istEntwurf: Boolean(p.istEntwurf),
        aktualisiertAm: new Date(p.aktualisiertAm),
      },
    });
  }
  console.log(`✅ BlogPost: ${blogPosts.length}`);

  // 2. Banner – historische Migration. Das alte SQLite-Banner kannte die
  // Felder nummer/fotoUrl/groesse/beschreibung noch nicht; sie werden hier mit
  // Platzhaltern gefüllt (die Tabelle war zum Migrationszeitpunkt leer).
  const banner = rows<{
    id: string;
    bezeichnung: string;
    notizen: string | null;
    nummer?: number | null;
  }>("SELECT * FROM Banner");
  let bannerNr = 0;
  for (const b of banner) {
    bannerNr += 1;
    await pg.banner.upsert({
      where: { id: b.id },
      update: {},
      create: {
        id: b.id,
        nummer: b.nummer ?? bannerNr,
        bezeichnung: b.bezeichnung,
        fotoUrl: `/images/banner/banner${b.nummer ?? bannerNr}.jpg`,
        groesse: "",
        beschreibung: "",
        notizen: b.notizen,
      },
    });
  }
  console.log(`✅ Banner: ${banner.length}`);

  // 3. Tagesmutter
  const tagesmutters = rows<{
    id: string; slug: string; vorname: string; nachname: string;
    einrichtungsname: string; fotoUrl: string; einrichtungsfotoUrls: string;
    strasse: string; plz: string; stadtteil: string;
    latitude: number | null; longitude: number | null;
    telefon: string; email: string; websiteUrl: string | null; anmeldungUrl: string | null;
    oeffnungszeiten: string; ersatzbetreuung: string;
    verpflegung: "SELBST_GEKOCHT" | "CATERING";
    beratungsgebiet: "MALWINA" | "OUTLAW" | "KINDERLAND";
    schmetterling: number; schmetterlingPartner: string | null;
    mitgliedsnummer: string | null; mitgliedSeit: string | null;
    emailToken: string; lastConfirmed: string | null;
    istAktiv: number; reihenfolge: number;
    erstelltAm: string; aktualisiertAm: string;
  }>("SELECT * FROM Tagesmutter");

  for (const t of tagesmutters) {
    let fotos: string[] = [];
    try { fotos = JSON.parse(t.einrichtungsfotoUrls) ?? []; } catch { /* leer lassen */ }

    await pg.tagesmutter.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        slug: t.slug,
        vorname: t.vorname,
        nachname: t.nachname,
        einrichtungsname: t.einrichtungsname,
        fotoUrl: t.fotoUrl,
        einrichtungsfotoUrls: fotos,
        strasse: t.strasse,
        plz: t.plz,
        stadtteil: t.stadtteil,
        latitude: t.latitude,
        longitude: t.longitude,
        telefon: t.telefon,
        email: t.email,
        websiteUrl: t.websiteUrl,
        anmeldungUrl: t.anmeldungUrl,
        oeffnungszeiten: t.oeffnungszeiten,
        ersatzbetreuung: t.ersatzbetreuung,
        verpflegung: t.verpflegung,
        beratungsgebiet: t.beratungsgebiet,
        schmetterling: Boolean(t.schmetterling),
        schmetterlingPartner: t.schmetterlingPartner,
        mitgliedsnummer: t.mitgliedsnummer,
        mitgliedSeit: t.mitgliedSeit ? new Date(t.mitgliedSeit) : null,
        emailToken: t.emailToken,
        lastConfirmed: t.lastConfirmed ? new Date(t.lastConfirmed) : null,
        istAktiv: Boolean(t.istAktiv),
        reihenfolge: t.reihenfolge,
        erstelltAm: new Date(t.erstelltAm),
        aktualisiertAm: new Date(t.aktualisiertAm),
      },
    });
  }
  console.log(`✅ Tagesmutter: ${tagesmutters.length}`);

  // 4. FreiePlaetze
  const plaetze = rows<{
    id: string; tagesmutterId: string;
    platz1Ab: string | null; platz2Ab: string | null; platz3Ab: string | null;
    platz4Ab: string | null; platz5Ab: string | null; aktualisiertAm: string;
  }>("SELECT * FROM FreiePlaetze");

  for (const p of plaetze) {
    await pg.freiePlaetze.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        tagesmutterId: p.tagesmutterId,
        platz1Ab: p.platz1Ab ? new Date(p.platz1Ab) : null,
        platz2Ab: p.platz2Ab ? new Date(p.platz2Ab) : null,
        platz3Ab: p.platz3Ab ? new Date(p.platz3Ab) : null,
        platz4Ab: p.platz4Ab ? new Date(p.platz4Ab) : null,
        platz5Ab: p.platz5Ab ? new Date(p.platz5Ab) : null,
        aktualisiertAm: new Date(p.aktualisiertAm),
      },
    });
  }
  console.log(`✅ FreiePlaetze: ${plaetze.length}`);

  // 5. Buchung
  const buchungen = rows<{
    id: string; bannerId: string; tagesmutterId: string;
    status: "ANFRAGE" | "BESTAETIGT" | "ABGELEHNT" | "ABGELAUFEN";
    zeitraumStart: string; zeitraumEnde: string; notizenAdmin: string | null;
    erstelltAm: string; aktualisiertAm: string;
  }>("SELECT * FROM Buchung");

  for (const b of buchungen) {
    await pg.buchung.upsert({
      where: { id: b.id },
      update: {},
      create: {
        id: b.id,
        bannerId: b.bannerId,
        tagesmutterId: b.tagesmutterId,
        kontaktName: "",
        kontaktEmail: "",
        grundstueckBestaetigt: false,
        status: b.status,
        zeitraumStart: new Date(b.zeitraumStart),
        zeitraumEnde: new Date(b.zeitraumEnde),
        notizenAdmin: b.notizenAdmin,
        erstelltAm: new Date(b.erstelltAm),
        aktualisiertAm: new Date(b.aktualisiertAm),
      },
    });
  }
  console.log(`✅ Buchung: ${buchungen.length}`);

  console.log("\n🎉 Migration abgeschlossen.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { sqlite.close(); await pg.$disconnect(); });
