"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { TagesmutterDto } from "@/app/api/tagesmutters/route";
import { BERATUNGSGEBIET_LABEL, VERPFLEGUNG_LABEL } from "@/types";

type Props = {
  tagesmutter: TagesmutterDto | null;
  onClose: () => void;
};

const ANMELDUNG_FALLBACK_URL = "https://kita-anmeldung.dresden.de/";

function formatDatum(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  const monat = String(d.getMonth() + 1).padStart(2, "0");
  return `${monat}/${d.getFullYear()}`;
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
        className="fixed top-16 inset-x-0 bottom-0 z-[1000] bg-black/30 md:bg-black/10"
        onClick={onClose}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Steckbrief ${tagesmutter.vorname} ${tagesmutter.nachname}`}
        className="fixed top-16 right-0 bottom-0 left-0 md:left-auto md:w-[480px] z-[1001] bg-white shadow-2xl overflow-y-auto"
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
                <p className="text-text-soft mt-0.5">
                  {tagesmutter.einrichtungsname || "Kindertagespflegeperson"}
                </p>
              </div>
            </div>

            <FreiePlaetzeKarte plaetze={plaetze} />
            {galerie.length > 0 && <FotoKarussel fotos={galerie} />}
          </section>

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
                <p>
                  {tagesmutter.verpflegungHinweis ??
                    VERPFLEGUNG_LABEL[tagesmutter.verpflegung]}
                </p>
              </InfoKarte>
              <InfoKarte titel="Ersatzbetreuung" icon={<PinIcon src="/images/steckbrief/pin-ersatzbetreuung.png" />} infoHref="/fuer-eltern/eingewoehnung-und-ersatzbetreuung#ersatzbetreuung">
                <p>{tagesmutter.ersatzbetreuung.replace(/Schmetterling-Partnerschaft/gi, "Schmetterlingsmodell")}</p>
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
              Ich freue mich darauf, euch und euer Kind kennenzulernen!
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

function FotoKarussel({ fotos }: { fotos: string[] }) {
  const N = fotos.length;

  // Dreifache Liste → nahtloser Endlos-Slide, 1 Bild pro Schritt, immer 3 sichtbar.
  // Track-Breite = T/3 × Containerbreite → jedes Bild belegt genau 1/3 des Containers.
  // translateX-Formel: -(aktiv × 100 / T) % des Tracks  (identisch zum 1-Bild-Modus).
  const klone = [...fotos, ...fotos, ...fotos];
  const T = klone.length; // = 3 × N

  const [aktiv, setAktiv] = useState(N); // Start: erstes Bild im mittleren Drittel
  const [mitAnimation, setMitAnimation] = useState(true);

  // Auto-Advance alle 3 s (nur wenn mehr Bilder als sichtbar)
  useEffect(() => {
    if (N <= 3) return;
    const id = setInterval(() => {
      setMitAnimation(true);
      setAktiv((a) => a + 1);
    }, 3000);
    return () => clearInterval(id);
  }, [N]);

  const navigate = (delta: number) => {
    setMitAnimation(true);
    setAktiv((a) => a + delta);
  };

  // Wischen auf Mobilgeräten
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) return; // zu kurz → kein Wisch
    navigate(dx < 0 ? 1 : -1);
  };

  // Nach Transition: unsichtbar zurück ins mittlere Drittel springen
  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName !== "transform") return;
    if (aktiv >= 2 * N) {
      setMitAnimation(false);
      setAktiv(aktiv - N);
    } else if (aktiv < N) {
      setMitAnimation(false);
      setAktiv(aktiv + N);
    }
  };

  const translatePct = (aktiv * 100) / T;

  // 3 oder weniger Bilder: alle nebeneinander, kein Scrollen/Wischen/Pfeile
  if (N <= 3) {
    return (
      <div className="grid grid-cols-3 gap-1">
        {fotos.map((url, i) => (
          <div
            key={i}
            className="relative aspect-square bg-text-soft/10 overflow-hidden rounded-xl"
          >
            <Image
              src={url}
              alt=""
              fill
              sizes="150px"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className="overflow-hidden rounded-2xl touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`flex${mitAnimation ? " transition-transform duration-500 ease-in-out" : ""}`}
          style={{
            width: `${(T / 3) * 100}%`,
            transform: `translateX(-${translatePct}%)`,
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {klone.map((url, i) => (
            <div key={i} className="px-0.5" style={{ width: `${100 / T}%` }}>
              <div className="relative aspect-square bg-text-soft/10 overflow-hidden rounded-xl">
                <Image
                  src={url}
                  alt=""
                  fill
                  sizes="150px"
                  className="object-cover"
                  priority={i === N}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigations-Pfeile */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md hidden sm:flex items-center justify-center hover:bg-white transition-colors"
        aria-label="Vorheriges Bild"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => navigate(1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md hidden sm:flex items-center justify-center hover:bg-white transition-colors"
        aria-label="Nächstes Bild"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
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
          Zukünftig werden hier freie Plätze angezeigt.
        </p>
      ) : (
        <ul className="grid grid-cols-3 gap-2">
          {plaetze.map((p) => (
            <li key={p.nr} className="flex items-center gap-1.5 font-semibold text-sm bg-white rounded-full px-3 py-1 border border-sonnengelb/60">
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
  infoHref,
  children,
}: {
  titel: string;
  icon: React.ReactNode;
  infoHref?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-[#fdf7e3] p-4 shadow-sm border border-sonnengelb/40 flex flex-col gap-1.5">
      {icon}
      <h4 className="font-bold text-sm flex items-center gap-1.5">
        {titel}
        {infoHref && (
          <a
            href={infoHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Mehr über ${titel} erfahren`}
            className="inline-flex text-text-soft/60 hover:text-korallenrot transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
              <path d="M12 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="7.5" r="1.1" fill="currentColor" />
            </svg>
          </a>
        )}
      </h4>
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
