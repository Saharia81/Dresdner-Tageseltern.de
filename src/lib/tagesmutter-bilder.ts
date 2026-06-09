// Ermittelt Profilbild und Galerie einer Tagesmutter aus der Ordnerstruktur,
// statt die Pfade in der DB zu speichern. Der Ordner ist die einzige Quelle:
//
//   public/images/tagesmuetter/<nr>/
//     profilbild.<ext>        ← rundes Hauptfoto (sonst Platzhalter)
//     galerie/1.<ext>, 2.<ext> … ← fortlaufend nummerierte Galeriebilder
//
// <nr> = Mitgliedsnummer + 1000 (siehe ordnerNummer()).
//
// Server-only: liest das Dateisystem, darf nie in Client-Bundles landen.
import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { ordnerNummer } from "./tagesmutter-helpers";

export const PLATZHALTER = "/images/steckbriefe/placeholder.svg";

const BASIS = path.join(process.cwd(), "public", "images", "tagesmuetter");
const URL_BASIS = "/images/tagesmuetter";
const BILD_ENDUNG = /\.(jpe?g|png|avif|webp)$/i;

export type Bilder = { fotoUrl: string; galerie: string[] };

// In Produktion cachen: Bilder ändern sich nur beim Deploy (Neustart leert den
// Cache). In der Entwicklung nicht cachen, damit neu eingelegte Bilder sofort
// erscheinen.
const cache = new Map<number, Bilder>();
const CACHE_AKTIV = process.env.NODE_ENV === "production";

// Sortiert "1.jpg", "2.png", … "10.jpg" numerisch nach führender Zahl.
function nachZahl(a: string, b: string): number {
  const za = parseInt(a, 10);
  const zb = parseInt(b, 10);
  if (Number.isNaN(za) || Number.isNaN(zb)) return a.localeCompare(b);
  return za - zb;
}

async function leseOrdner(nr: number): Promise<Bilder> {
  const ordner = path.join(BASIS, String(nr));

  // Profilbild: erste Datei profilbild.<ext> im Ordner.
  let fotoUrl = PLATZHALTER;
  try {
    const dateien = await fs.readdir(ordner);
    const profil = dateien.find((d) => /^profilbild\.(jpe?g|png|avif|webp)$/i.test(d));
    if (profil) fotoUrl = `${URL_BASIS}/${nr}/${profil}`;
  } catch {
    // Ordner fehlt → Platzhalter, keine Galerie.
    return { fotoUrl, galerie: [] };
  }

  // Galerie: alle Bilddateien aus dem Unterordner galerie/, numerisch sortiert.
  let galerie: string[] = [];
  try {
    const dateien = await fs.readdir(path.join(ordner, "galerie"));
    galerie = dateien
      .filter((d) => BILD_ENDUNG.test(d))
      .sort(nachZahl)
      .map((d) => `${URL_BASIS}/${nr}/galerie/${d}`);
  } catch {
    // Kein galerie/-Ordner → leere Galerie.
  }

  return { fotoUrl, galerie };
}

export async function bilderFuer(mitgliedsnummer: string | null): Promise<Bilder> {
  const nr = ordnerNummer(mitgliedsnummer);
  if (nr === null) return { fotoUrl: PLATZHALTER, galerie: [] };

  if (CACHE_AKTIV) {
    const treffer = cache.get(nr);
    if (treffer) return treffer;
  }

  const bilder = await leseOrdner(nr);
  if (CACHE_AKTIV) cache.set(nr, bilder);
  return bilder;
}
