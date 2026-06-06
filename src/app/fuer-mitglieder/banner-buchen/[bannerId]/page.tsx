import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { gebuchteZeitraeume } from "@/lib/buchungen";
import { BuchungsForm } from "./BuchungsForm";

type Params = Promise<{ bannerId: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { bannerId } = await params;
  const banner = await prisma.banner.findUnique({ where: { id: bannerId } });
  return {
    title: banner
      ? `${banner.bezeichnung} buchen – Dresdner Tages Eltern e.V.`
      : "Banner buchen – Dresdner Tages Eltern e.V.",
  };
}

export const dynamic = "force-dynamic";

export default async function BannerDetailPage({ params }: { params: Params }) {
  const { bannerId } = await params;
  const banner = await prisma.banner.findUnique({ where: { id: bannerId } });
  if (!banner || !banner.istAktiv) notFound();

  const zeitraeume = await gebuchteZeitraeume(banner.id);
  const belegt = zeitraeume.map((z) => ({
    start: z.zeitraumStart.toISOString().slice(0, 10),
    ende: z.zeitraumEnde.toISOString().slice(0, 10),
  }));

  const datumFmt = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="bg-creme">
      <div className="mx-auto max-w-2xl px-4 py-10 md:py-14">
        <Link
          href="/fuer-mitglieder/banner-buchen"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-korallenrot mb-6"
        >
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
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Alle Banner
        </Link>

        <div className="rounded-3xl bg-korallenrot/25 border border-korallenrot/40 overflow-hidden shadow-sm mb-8">
          <div className="p-3 sm:p-4">
            <Image
              src={banner.fotoUrl}
              alt={banner.bezeichnung}
              width={banner.fotoBreite ?? 1600}
              height={banner.fotoHoehe ?? 800}
              className="w-full h-auto block rounded-xl border border-korallenrot/30"
              sizes="(max-width: 672px) 100vw, 640px"
            />
          </div>
          <div className="px-6 pb-6">
            <h1 className="text-2xl font-extrabold mb-1">{banner.bezeichnung}</h1>
            <p className="text-sm font-semibold text-korallenrot">
              Größe: {banner.groesse}
            </p>
          </div>
        </div>

        {banner.beispielFotos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-extrabold mb-3">
              So sieht der Banner aufgehängt aus
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {banner.beispielFotos.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-creme border border-korallenrot/30"
                >
                  <Image
                    src={src}
                    alt={`${banner.bezeichnung} – Beispiel ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 672px) 50vw, 213px"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {belegt.length > 0 && (
          <div className="rounded-2xl bg-white border border-text-soft/10 p-5 mb-8 shadow-sm">
            <h2 className="text-sm font-extrabold mb-3">
              Bereits belegte Zeiträume
            </h2>
            <ul className="space-y-1 text-sm text-text-soft">
              {belegt.map((z, i) => (
                <li key={i}>
                  {datumFmt.format(new Date(z.start))} –{" "}
                  {datumFmt.format(new Date(z.ende))}
                </li>
              ))}
            </ul>
          </div>
        )}

        <BuchungsForm
          bannerId={banner.id}
          bannerBezeichnung={banner.bezeichnung}
          belegt={belegt}
        />
      </div>
    </main>
  );
}
