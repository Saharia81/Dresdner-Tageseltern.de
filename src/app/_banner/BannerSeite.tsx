// Gemeinsame Darstellung einer Banner-Landingpage (/banner1, /banner2, …).
//
// Zeigt den Steckbrief der aktuell ausleihenden Tagesmutter plus einen Link
// auf die Übersicht aller Tageseltern. Ist dem Banner gerade niemand
// zugeordnet, erscheint stattdessen eine neutrale Begrüßung mit demselben Link.

import Link from "next/link";
import type { Metadata } from "next";
import { SteckbriefInhalt } from "@/app/kindertagespflege-finden/SteckbriefInhalt";
import {
  getTagesmutterDtoBySlug,
  getTagesmutterDtoById,
} from "@/lib/steckbriefe";
import { getBannerSlug, type BannerNummer } from "@/lib/banner";
import { aktuelleBuchung } from "@/lib/buchungen";

// Steckbrief, der aktuell auf einem Banner gezeigt werden soll:
// 1. laufende, bestätigte DB-Buchung (mit zugeordnetem Profil)
// 2. sonst die feste Zuordnung aus banner.ts (Übergangslösung)
async function aktuellerSteckbrief(nr: BannerNummer) {
  const buchung = await aktuelleBuchung(Number(nr));
  if (buchung?.tagesmutterId) {
    const tm = await getTagesmutterDtoById(buchung.tagesmutterId);
    if (tm) return tm;
  }
  const slug = getBannerSlug(nr);
  return slug ? getTagesmutterDtoBySlug(slug) : null;
}

export async function bannerMetadata(nr: BannerNummer): Promise<Metadata> {
  const tm = await aktuellerSteckbrief(nr);
  if (tm) {
    return {
      title: `${tm.vorname} ${tm.nachname} – Kindertagespflege in Dresden`,
      description: `Steckbrief von ${tm.vorname} ${tm.nachname}${tm.einrichtungsname ? ` (${tm.einrichtungsname})` : ""} – Kindertagespflege beim Dresdner Tages Eltern e.V.`,
    };
  }
  return {
    title: "Kindertagespflege in Dresden – Dresdner Tages Eltern e.V.",
    description:
      "Finde liebevolle Kindertagespflege in Dresden – Tagesmütter und Tagesväter in deiner Nähe.",
  };
}

function FinderCta() {
  return (
    <Link
      href="/kindertagespflege-finden"
      className="inline-flex items-center justify-center gap-2.5 rounded-full bg-korallenrot text-white px-6 py-3.5 text-base font-bold hover:bg-korallenrot-dunkel transition-colors shadow-sm"
    >
      Alle Tageseltern finden
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M5 12h14" />
        <path d="M12 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

export async function BannerSeite({ nr }: { nr: BannerNummer }) {
  const tagesmutter = await aktuellerSteckbrief(nr);

  // Fallback: Banner aktuell niemandem zugeordnet (oder Profil inaktiv).
  if (!tagesmutter) {
    return (
      <main className="bg-creme min-h-[60vh]">
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
            Liebevolle Kindertagespflege in Dresden
          </h1>
          <p className="text-lg text-text-soft mb-8 leading-relaxed">
            Entdecke Tagesmütter und Tagesväter in deiner Nähe und finde die
            Betreuung, die zu deinem Kind und eurer Familie passt.
          </p>
          <FinderCta />
        </div>
      </main>
    );
  }

  return (
    <main className="bg-creme">
      <div className="mx-auto max-w-xl px-4 py-10 md:py-14">
        <SteckbriefInhalt tagesmutter={tagesmutter} />

        <div className="mt-10 rounded-3xl bg-white border border-text-soft/10 p-6 text-center shadow-sm">
          <h2 className="text-lg font-extrabold mb-1.5">
            Noch auf der Suche?
          </h2>
          <p className="text-sm text-text-soft mb-5">
            Entdecke alle Tageseltern beim Dresdner Tages Eltern e.V. auf der
            Karte.
          </p>
          <FinderCta />
        </div>
      </div>
    </main>
  );
}
