// Gemeinsame Darstellung einer Banner-Landingpage (/banner1, /banner2, …).
//
// Zeigt – je nach laufender Buchung – den Steckbrief der ausleihenden
// Tagesmutter oder einen individuellen Inhalt. Ist der Banner gerade nicht
// ausgeliehen, leitet die Seite auf /kindertagespflege-finden weiter.

import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SteckbriefInhalt } from "@/app/kindertagespflege-finden/SteckbriefInhalt";
import type { TagesmutterDto } from "@/app/api/tagesmutters/route";
import { getTagesmutterDtoById } from "@/lib/steckbriefe";
import { type BannerNummer } from "@/lib/banner";
import { aktuelleBuchung } from "@/lib/buchungen";

type IndividuellerInhalt = {
  titel: string;
  text: string | null;
  bildUrl: string | null;
  linkUrl: string | null;
  linkText: string | null;
};

// Was aktuell auf einem Banner gezeigt werden soll:
//   steckbrief  – das Profil der aktuell ausleihenden Bucherin
//   individuell – ein vom Admin gepflegter freier Inhalt
//   neutral     – Banner gerade nicht ausgeliehen → Weiterleitung zum Finder
type BannerAnzeige =
  | { typ: "steckbrief"; tagesmutter: TagesmutterDto }
  | { typ: "individuell"; inhalt: IndividuellerInhalt }
  | { typ: "neutral" };

// Nur eine laufende, bestätigte Buchung bestimmt die Anzeige:
//   • INDIVIDUELL mit Titel → individueller Inhalt
//   • Profil zugeordnet → dessen Steckbrief
// Läuft KEINE Buchung (oder Inhalt noch nicht gepflegt) → neutral, d. h. die
// Banner-Seite leitet auf die Finder-Seite weiter.
async function aktuelleAnzeige(nr: BannerNummer): Promise<BannerAnzeige> {
  const buchung = await aktuelleBuchung(Number(nr));
  if (buchung) {
    if (buchung.anzeigeTyp === "INDIVIDUELL" && buchung.inhaltTitel) {
      return {
        typ: "individuell",
        inhalt: {
          titel: buchung.inhaltTitel,
          text: buchung.inhaltText,
          bildUrl: buchung.inhaltBildUrl,
          linkUrl: buchung.inhaltLinkUrl,
          linkText: buchung.inhaltLinkText,
        },
      };
    }
    if (buchung.tagesmutterId) {
      const tm = await getTagesmutterDtoById(buchung.tagesmutterId);
      if (tm) return { typ: "steckbrief", tagesmutter: tm };
    }
  }
  return { typ: "neutral" };
}

export async function bannerMetadata(nr: BannerNummer): Promise<Metadata> {
  const anzeige = await aktuelleAnzeige(nr);
  if (anzeige.typ === "steckbrief") {
    const tm = anzeige.tagesmutter;
    return {
      title: `${tm.vorname} ${tm.nachname} – Kindertagespflege in Dresden`,
      description: `Steckbrief von ${tm.vorname} ${tm.nachname}${tm.einrichtungsname ? ` (${tm.einrichtungsname})` : ""} – Kindertagespflege beim Dresdner Tages Eltern e.V.`,
    };
  }
  if (anzeige.typ === "individuell") {
    return {
      title: `${anzeige.inhalt.titel} – Dresdner Tages Eltern e.V.`,
      description: anzeige.inhalt.text ?? undefined,
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

// Individueller Banner-Inhalt (z. B. Tag der offenen Tür, Sommerfest).
function IndividuelleAnzeige({ inhalt }: { inhalt: IndividuellerInhalt }) {
  return (
    <main className="bg-creme">
      <div className="mx-auto max-w-xl px-4 py-10 md:py-14">
        <div className="rounded-3xl bg-white border border-text-soft/10 overflow-hidden shadow-sm">
          {inhalt.bildUrl && (
            <div className="relative aspect-[16/9] bg-creme">
              {/* Bild-URL wird vom Admin frei eingegeben (auch extern) –
                  daher bewusst <img> statt next/image. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={inhalt.bildUrl}
                alt={inhalt.titel}
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            </div>
          )}
          <div className="px-6 py-7 md:px-8 md:py-9">
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight mb-3">
              {inhalt.titel}
            </h1>
            {inhalt.text && (
              <div className="text-text-soft leading-relaxed whitespace-pre-line">
                {inhalt.text}
              </div>
            )}
            {inhalt.linkUrl && (
              <div className="mt-6">
                <a
                  href={inhalt.linkUrl}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-korallenrot text-white px-6 py-3.5 text-base font-bold hover:bg-korallenrot-dunkel transition-colors shadow-sm"
                >
                  {inhalt.linkText?.trim() || "Mehr erfahren"}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 rounded-3xl bg-white border border-text-soft/10 p-6 text-center shadow-sm">
          <h2 className="text-lg font-extrabold mb-1.5">
            Kindertagespflege in Dresden
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

export async function BannerSeite({ nr }: { nr: BannerNummer }) {
  const anzeige = await aktuelleAnzeige(nr);

  if (anzeige.typ === "individuell") {
    return <IndividuelleAnzeige inhalt={anzeige.inhalt} />;
  }

  // Banner aktuell nicht ausgeliehen → direkt zur Finder-Seite weiterleiten.
  if (anzeige.typ === "neutral") {
    redirect("/kindertagespflege-finden");
  }

  return (
    <main className="bg-creme">
      <div className="mx-auto max-w-xl px-4 py-10 md:py-14">
        <SteckbriefInhalt tagesmutter={anzeige.tagesmutter} />

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
