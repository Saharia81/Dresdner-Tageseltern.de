"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { TagesmutterDto } from "@/app/api/tagesmutters/route";
import { BERATUNGSGEBIET_LABEL, VERPFLEGUNG_LABEL } from "@/types";

type Props = {
  tagesmutter: TagesmutterDto | null;
  onClose: () => void;
};

const DATUM_FORMAT = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const ANMELDUNG_FALLBACK_URL = "https://kita-anmeldung.dresden.de/";

function formatDatum(iso: string | null): string | null {
  if (!iso) return null;
  return DATUM_FORMAT.format(new Date(iso));
}

export function ProfilePanel({ tagesmutter, onClose }: Props) {
  // ESC schließt das Panel
  useEffect(() => {
    if (!tagesmutter) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [tagesmutter, onClose]);

  if (!tagesmutter) return null;

  const fp = tagesmutter.freiePlaetze;
  const plaetze: { nr: number; datum: string }[] = [];
  if (fp) {
    for (const [i, iso] of [
      fp.platz1Ab,
      fp.platz2Ab,
      fp.platz3Ab,
      fp.platz4Ab,
      fp.platz5Ab,
    ].entries()) {
      const d = formatDatum(iso);
      if (d) plaetze.push({ nr: i + 1, datum: d });
    }
  }

  const telefonClean = tagesmutter.telefon.replace(/\s+/g, "");
  const galerie = tagesmutter.einrichtungsfotoUrls.filter(Boolean);

  return (
    <>
      <div
        className="fixed inset-0 z-[1000] bg-black/30 md:bg-black/10"
        onClick={onClose}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Steckbrief ${tagesmutter.vorname} ${tagesmutter.nachname}`}
        className="fixed inset-0 md:inset-y-0 md:right-0 md:left-auto md:w-[480px] z-[1001] bg-white shadow-2xl overflow-y-auto"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-creme px-4 py-3 flex items-center justify-between border-b border-text-soft/10">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 -ml-3 hover:bg-white/60 transition-colors font-semibold text-sm"
          >
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
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Zurück
          </button>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-korallenrot"
            aria-hidden
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10z" />
            </svg>
          </div>
        </div>

        <div className="px-4 pt-8 pb-8 space-y-6">
          {/* 1 — Kopfbereich: Foto links, Name+Einrichtung rechts, dann Freie-Plätze-Karte */}
          <section className="flex flex-col gap-8 py-2">
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-full bg-text-soft/10 ring-4 ring-creme shadow-sm">
                <Image
                  src={tagesmutter.fotoUrl}
                  alt={`${tagesmutter.vorname} ${tagesmutter.nachname}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-2xl font-extrabold leading-tight">
                  {tagesmutter.vorname} {tagesmutter.nachname}
                </h2>
                {tagesmutter.einrichtungsname && (
                  <p className="text-text-soft mt-0.5">
                    {tagesmutter.einrichtungsname}
                  </p>
                )}
                {tagesmutter.schmetterling && (
                  <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-korallenrot">
                    <span aria-hidden>🦋</span>
                    Schmetterling-Tagespflege
                  </p>
                )}
              </div>
            </div>

            <FreiePlaetzeKarte plaetze={plaetze} />
          </section>

          {/* 2 — Galerie (Carousel mit quadratischen Bildern) */}
          {galerie.length > 0 && (
            <section>
              <h3 className="text-lg font-extrabold mb-3">
                Einblicke in meine Räume
              </h3>
              <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 scroll-pl-4 pb-2 scroll-smooth">
                {galerie.map((url, i) => (
                  <div
                    key={url + i}
                    className="relative shrink-0 w-40 h-40 rounded-2xl overflow-hidden bg-text-soft/10 snap-start shadow-sm"
                  >
                    <Image
                      src={url}
                      alt=""
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 3 — Info-Bereich */}
          <section>
            <h3 className="text-lg font-extrabold mb-3">
              Alle wichtigen Infos
            </h3>
            <div className="grid gap-3 grid-cols-2">
              <InfoKarte titel="Adresse" icon={<PinIcon src="/images/steckbrief/pin-adresse.png" />}>
                <p>{tagesmutter.strasse}</p>
                <p>
                  {tagesmutter.plz} · {tagesmutter.stadtteil}
                </p>
              </InfoKarte>
              <InfoKarte titel="Öffnungszeiten" icon={<PinIcon src="/images/steckbrief/pin-oeffnungszeiten.png" />}>
                <p className="whitespace-pre-line">
                  {tagesmutter.oeffnungszeiten}
                </p>
              </InfoKarte>
              <InfoKarte titel="Verpflegung" icon={<PinIcon src="/images/steckbrief/pin-verpflegung.png" />}>
                <p>{VERPFLEGUNG_LABEL[tagesmutter.verpflegung]}</p>
              </InfoKarte>
              <InfoKarte titel="Ersatzbetreuung" icon={<PinIcon src="/images/steckbrief/pin-ersatzbetreuung.png" />}>
                <p>{tagesmutter.ersatzbetreuung}</p>
              </InfoKarte>
              <LinkKarte
                href={
                  tagesmutter.websiteUrl ??
                  tagesmutter.anmeldungUrl ??
                  ANMELDUNG_FALLBACK_URL
                }
                titel={tagesmutter.websiteUrl ? "Zur Website" : "Anmeldung"}
                icon={<PinIcon src="/images/steckbrief/pin-anmeldung-website.png" />}
              />
              <InfoKarte titel="Beratungsstelle" icon={<PinIcon src="/images/steckbrief/pin-beratungsstelle.png" />}>
                <p>{BERATUNGSGEBIET_LABEL[tagesmutter.beratungsgebiet]}</p>
              </InfoKarte>
            </div>
          </section>

          {/* 4 — Kontakt */}
          <section className="rounded-3xl bg-white border border-text-soft/10 p-5 shadow-sm">
            <h3 className="text-lg font-extrabold mb-1.5">Kontakt</h3>
            <p className="text-sm text-text-soft mb-4">
              Ich freue mich darauf, Sie und Ihr Kind kennenzulernen!
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href={`tel:${telefonClean}`}
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-korallenrot text-white px-5 py-3 text-base font-bold hover:bg-korallenrot-dunkel transition-colors shadow-sm"
              >
                <IconTelefon />
                Anrufen
              </a>
              <a
                href={`mailto:${tagesmutter.email}`}
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-sonnengelb text-text px-5 py-3 text-base font-bold hover:bg-sonnengelb-hell transition-colors shadow-sm"
              >
                <IconMail />
                E-Mail schreiben
              </a>
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Bausteine                                                           */
/* ------------------------------------------------------------------ */

function RundButton({
  href,
  label,
  icon,
  external,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex flex-col items-center gap-1.5 group"
    >
      <span className="w-12 h-12 rounded-full bg-korallenrot text-white flex items-center justify-center shadow-sm group-hover:bg-korallenrot-dunkel group-active:scale-95 transition-all">
        {icon}
      </span>
      <span className="text-xs font-semibold">{label}</span>
    </a>
  );
}

function FreiePlaetzeKarte({
  plaetze,
}: {
  plaetze: { nr: number; datum: string }[];
}) {
  return (
    <div className="rounded-2xl bg-[#fdf7e3] border border-sonnengelb/40 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-korallenrot" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10z" />
          </svg>
        </span>
        <h3 className="font-extrabold text-base">Freie Plätze ab:</h3>
      </div>
      {plaetze.length === 0 ? (
        <p className="text-text-soft">
          Aktuell sind keine freien Plätze eingetragen.
        </p>
      ) : (
        <ul className="space-y-1">
          {plaetze.map((p) => (
            <li key={p.nr} className="flex items-center gap-2 font-semibold">
              <span
                className="inline-block w-2 h-2 rounded-full bg-green-500 shrink-0"
                aria-hidden
              />
              {p.datum}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function InfoKarte({
  titel,
  icon,
  children,
}: {
  titel: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-[#fdf7e3] p-4 shadow-sm border border-sonnengelb/40 flex flex-col gap-1.5">
      {icon}
      <h4 className="font-bold text-sm">{titel}</h4>
      <div className="text-xs text-text-soft leading-relaxed">{children}</div>
    </div>
  );
}

function LinkKarte({
  href,
  titel,
  icon,
}: {
  href: string;
  titel: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-2xl bg-[#fdf7e3] p-4 shadow-sm border border-sonnengelb/40 hover:shadow-md hover:border-korallenrot/30 transition-all flex flex-col gap-1.5"
    >
      <div className="flex items-center justify-between">
        {icon}
        <span className="text-text-soft group-hover:text-korallenrot group-hover:translate-x-1 transition-all">
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
      <h4 className="font-bold text-sm">{titel}</h4>
      <p className="text-xs text-text-soft truncate">
        {href.replace(/^https?:\/\//, "")}
      </p>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

const STROKE_PROPS = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function PinIcon({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      width={48}
      height={48}
      className="h-12 w-12 object-contain"
    />
  );
}

function IconTelefon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...STROKE_PROPS}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...STROKE_PROPS}>
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  );
}
