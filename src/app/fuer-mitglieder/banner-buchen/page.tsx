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
      <div className="mx-auto max-w-2xl px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">
          Banner buchen
        </h1>
        <p className="text-lg text-text-soft mb-10 leading-relaxed">
          Mit unseren Werbebannern machst du auf deine Kindertagespflege
          aufmerksam. Wähle einen Banner und buche deinen Wunschzeitraum, im
          Buchungszeitraum erscheint dein Steckbrief automatisch auf der
          zugehörigen Banner-Seite.
        </p>

        {banner.length === 0 ? (
          <p className="text-text-soft">
            Aktuell stehen keine Banner zur Verfügung.
          </p>
        ) : (
          <div className="space-y-8">
            {banner.map((b) => (
              <Link
                key={b.id}
                href={`/fuer-mitglieder/banner-buchen/${b.id}`}
                className="group block rounded-3xl bg-korallenrot/25 border border-korallenrot/40 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-3 sm:p-4">
                  <Image
                    src={b.fotoUrl}
                    alt={b.bezeichnung}
                    width={b.fotoBreite ?? 1600}
                    height={b.fotoHoehe ?? 800}
                    className="w-full h-auto block rounded-xl border border-korallenrot/30"
                    sizes="(max-width: 672px) 100vw, 640px"
                  />
                </div>
                <div className="px-5 pb-5 md:px-6 md:pb-6">
                  <h2 className="text-lg font-extrabold mb-1">{b.bezeichnung}</h2>
                  <p className="text-sm font-semibold text-korallenrot mb-4">
                    Größe: {b.groesse}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-korallenrot group-hover:gap-2.5 transition-all">
                    Zeitraum wählen &amp; buchen
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
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
