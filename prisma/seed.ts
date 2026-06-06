// Beispiel-Daten zum Entwickeln. Mit `npx prisma db seed` ausführen.
import "dotenv/config";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Liest "so hängt der Banner"-Beispielfotos aus public/images/banner.
// Dateien einfach als banner{nr}-beispiel1.jpg, banner{nr}-beispiel2.jpg …
// ablegen; sie werden automatisch erkannt (sortiert).
function beispielFotos(nummer: number): string[] {
  const dir = join(process.cwd(), "public", "images", "banner");
  let dateien: string[] = [];
  try {
    dateien = readdirSync(dir);
  } catch {
    return [];
  }
  return dateien
    .filter((f) => new RegExp(`^banner${nummer}-beispiel.*\\.(jpe?g|png|webp)$`, "i").test(f))
    .sort()
    .map((f) => `/images/banner/${f}`);
}

async function main() {
  await prisma.tagesmutter.upsert({
    where: { slug: "beispiel-tagesmutter" },
    update: {
      einrichtungsfotoUrls: [
        "/images/allgemein/basteln.png",
        "/images/allgemein/eingewoehnung-v2.png",
        "/images/allgemein/feste-bezugsperson-v2.png",
        "/images/allgemein/ruhige-atmosphaere.png",
      ],
    },
    create: {
      slug: "beispiel-tagesmutter",
      vorname: "Anna",
      nachname: "Beispiel",
      einrichtungsname: "Sonnenkinder",
      fotoUrl: "/images/steckbriefe/placeholder.svg",
      einrichtungsfotoUrls: [],
      strasse: "Musterstraße 1",
      plz: "01069",
      stadtteil: "Südvorstadt",
      telefon: "0351 1234567",
      email: "info@beispiel.de",
      oeffnungszeiten: "Mo–Fr 7:30–16:00",
      ersatzbetreuung: "Basis ETP",
      verpflegung: "SELBST_GEKOCHT",
      websiteUrl: null,
      beratungsgebiet: "MALWINA",
      latitude: 51.0504,
      longitude: 13.7373,
    },
  });

  // ----------------------------------------------------------------
  // Banner (Phase 2 – Buchungssystem). Fotos liegen unter
  // public/images/banner/. Größe/Beschreibung kann später angepasst werden.
  // ----------------------------------------------------------------
  const banner = [
    {
      nummer: 1,
      bezeichnung: "Banner 1",
      fotoUrl: "/images/banner/banner1.png",
      fotoBreite: 3802,
      fotoHoehe: 1912,
      groesse: "1,0 × 0,5 m",
      beschreibung:
        "Großes Banner für Zaun oder Hauswand – gut sichtbar von der Straße.",
    },
    {
      nummer: 2,
      bezeichnung: "Banner 2",
      fotoUrl: "/images/banner/banner2.png",
      fotoBreite: 7559,
      fotoHoehe: 1890,
      groesse: "2,0 × 0,5 m",
      beschreibung:
        "Großes Banner für Zaun oder Hauswand – gut sichtbar von der Straße.",
    },
    {
      nummer: 3,
      bezeichnung: "Banner 3",
      fotoUrl: "/images/banner/banner3.jpg",
      fotoBreite: 1080,
      fotoHoehe: 536,
      groesse: "1,0 × 0,5 m",
      beschreibung: "Mittleres Banner – ideal für schmalere Zäune.",
    },
    {
      nummer: 4,
      bezeichnung: "Banner 4",
      fotoUrl: "/images/banner/banner4.png",
      fotoBreite: 7559,
      fotoHoehe: 1890,
      groesse: "2,0 × 0,5 m",
      beschreibung: "Mittleres Banner – ideal für schmalere Zäune.",
    },
  ];

  for (const b of banner) {
    const fotos = beispielFotos(b.nummer);
    await prisma.banner.upsert({
      where: { nummer: b.nummer },
      update: {
        bezeichnung: b.bezeichnung,
        fotoUrl: b.fotoUrl,
        fotoBreite: b.fotoBreite,
        fotoHoehe: b.fotoHoehe,
        beispielFotos: fotos,
        groesse: b.groesse,
        beschreibung: b.beschreibung,
        reihenfolge: b.nummer,
      },
      create: {
        nummer: b.nummer,
        bezeichnung: b.bezeichnung,
        fotoUrl: b.fotoUrl,
        fotoBreite: b.fotoBreite,
        fotoHoehe: b.fotoHoehe,
        beispielFotos: fotos,
        groesse: b.groesse,
        beschreibung: b.beschreibung,
        reihenfolge: b.nummer,
      },
    });
  }

  console.log("Seed abgeschlossen.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
