import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Banner buchen – Dresdner Tages Eltern e.V.",
  description:
    "Leihe als Tagesmutter oder Tagesvater ein Werbebanner des Dresdner Tages Eltern e.V. – wähle einen Banner und buche deinen Wunschzeitraum.",
};

export const dynamic = "force-dynamic";

export default async function BannerBuchenPage() {
  const banner = await prisma.banner.findMany({
    where: { istAktiv: true },
    orderBy: [{ reihenfolge: "asc" }, { nummer: "asc" }],
  });

  return (
    <main className="bg-creme">
      {/* Hero – Bild rechts, Text links (Stil wie andere Hero-Bereiche) */}
      <section className="bg-creme">
        <div className="mx-auto max-w-6xl px-4 pb-12 md:pb-16">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-start">
            {/* Bild – oben bündig mit der Menüleiste (keine pt) */}
            <div className="md:order-2 -mx-4 md:mx-0">
              <div className="relative aspect-[15/8] md:aspect-[4/3] overflow-hidden md:rounded-b-3xl [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)] md:[mask-image:linear-gradient(to_right,transparent_0%,black_20%)] md:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_20%)]">
                <Image
                  src="/images/banner/hero.jpg"
                  alt="Werbebanner des Dresdner Tages Eltern e.V."
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
            </div>

            {/* Textspalte */}
            <div className="md:order-1 pt-6 md:pt-12">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mt-6 md:mt-10 mb-6">
                Banner buchen
              </h1>
              <p className="text-lg text-text-soft mb-6 max-w-xl leading-relaxed">
                Mit unseren Werbebannern machst du auf deine Kindertagespflege
                aufmerksam. Wähle einen Banner und buche deinen Wunschzeitraum,
                im Buchungszeitraum erscheint dein Steckbrief automatisch auf der
                zugehörigen Banner-Seite.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Banner-Auswahl */}
      <section style={{ backgroundColor: "#fdf7e3" }}>
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold">
              Unsere Banner zur Auswahl
            </h2>
            <p className="mt-2 text-text-soft">
              Alle Banner sind für Standard-Vereinsmitglieder kostenlos nutzbar,
              für eine starke und sichtbare Kindertagespflege in Dresden.
            </p>
          </div>

          {banner.length === 0 ? (
            <p className="text-center text-text-soft">
              Aktuell stehen keine Banner zur Verfügung.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {banner.map((b) => {
                return (
                  <div
                    key={b.id}
                    className="flex flex-col rounded-3xl bg-white border border-text-soft/10 overflow-hidden shadow-sm"
                  >
                    <Link
                      href={`/fuer-mitglieder/banner-buchen/${b.id}`}
                      aria-label={`${b.bezeichnung} buchen`}
                      className="relative block aspect-[16/9] bg-creme group"
                    >
                      <Image
                        src={b.kartenfotoUrl ?? b.fotoUrl}
                        alt={b.bezeichnung}
                        fill
                        className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </Link>

                    <div className="flex flex-col flex-1 p-5 md:p-6">
                      <h3 className="text-xl font-extrabold">{b.bezeichnung}</h3>
                      <p className="text-sm font-semibold text-korallenrot mb-6">
                        Größe: {b.groesse}
                      </p>

                      <Link
                        href={`/fuer-mitglieder/banner-buchen/${b.id}`}
                        className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full bg-sonnengelb text-text font-bold px-6 py-3 hover:brightness-95 transition"
                      >
                        Jetzt auswählen &amp; buchen
                        <svg
                          width="18"
                          height="18"
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
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

    </main>
  );
}
