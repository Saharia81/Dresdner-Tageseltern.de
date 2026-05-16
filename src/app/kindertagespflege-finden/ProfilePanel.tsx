"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { TagesmutterDto } from "@/app/api/tagesmutters/route";
import {
  BERATUNGSGEBIET_LABEL,
  VERPFLEGUNG_LABEL,
} from "@/types";

type Props = {
  tagesmutter: TagesmutterDto | null;
  onClose: () => void;
};

const DATUM_FORMAT = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

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

  return (
    <>
      {/* Backdrop – nur Mobile sichtbar bzw. dezent auf Desktop */}
      <div
        className="fixed inset-0 z-[1000] bg-black/30 md:bg-black/10"
        onClick={onClose}
        aria-hidden
      />
      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Profil ${tagesmutter.vorname} ${tagesmutter.nachname}`}
        className="fixed inset-0 md:inset-y-0 md:right-0 md:left-auto md:w-[440px] z-[1001] bg-white shadow-2xl overflow-y-auto"
      >
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-3 border-b border-text-soft/10">
          <p className="font-semibold text-text-soft">Steckbrief</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Schließen"
            className="w-10 h-10 rounded-full hover:bg-creme flex items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-5 pb-10 space-y-6">
          {/* Foto + Name */}
          <div className="flex flex-col items-center text-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-text-soft/15 mb-4 ring-4 ring-creme">
              <Image
                src={tagesmutter.fotoUrl}
                alt={`${tagesmutter.vorname} ${tagesmutter.nachname}`}
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
            <h2 className="text-2xl font-extrabold">
              {tagesmutter.vorname} {tagesmutter.nachname}
            </h2>
            <p className="text-text-soft">{tagesmutter.einrichtungsname}</p>
            {tagesmutter.schmetterling && (
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-korallenrot">
                <span aria-hidden>🦋</span>
                Schmetterling-Tagespflege
                {tagesmutter.schmetterlingPartner
                  ? ` mit ${tagesmutter.schmetterlingPartner}`
                  : ""}
              </p>
            )}
          </div>

          {/* Adresse */}
          <Section titel="Adresse">
            <p>{tagesmutter.strasse}</p>
            <p>
              {tagesmutter.plz} Dresden &middot; {tagesmutter.stadtteil}
            </p>
          </Section>

          {/* Kontakt */}
          <Section titel="Kontakt">
            <div className="flex flex-wrap gap-2">
              <a
                href={`tel:${tagesmutter.telefon.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full bg-creme px-4 py-2 text-sm font-semibold hover:bg-sonnengelb-hell transition-colors"
              >
                <span aria-hidden>☎</span>
                {tagesmutter.telefon}
              </a>
              <a
                href={`mailto:${tagesmutter.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-creme px-4 py-2 text-sm font-semibold hover:bg-sonnengelb-hell transition-colors"
              >
                <span aria-hidden>✉</span>
                E-Mail schreiben
              </a>
              {tagesmutter.websiteUrl && (
                <a
                  href={tagesmutter.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-creme px-4 py-2 text-sm font-semibold hover:bg-sonnengelb-hell transition-colors"
                >
                  <span aria-hidden>🌐</span>
                  Website
                </a>
              )}
            </div>
          </Section>

          {/* Öffnungszeiten */}
          <Section titel="Öffnungszeiten">
            <p className="whitespace-pre-line">{tagesmutter.oeffnungszeiten}</p>
          </Section>

          {/* Verpflegung */}
          <Section titel="Verpflegung">
            <p>{VERPFLEGUNG_LABEL[tagesmutter.verpflegung]}</p>
          </Section>

          {/* Ersatzbetreuung */}
          <Section titel="Ersatzbetreuung">
            <p>{tagesmutter.ersatzbetreuung}</p>
          </Section>

          {/* Freie Plätze */}
          <Section titel="Freie Plätze">
            {plaetze.length === 0 ? (
              <p className="text-text-soft">
                Aktuell keine freien Plätze eingetragen.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {plaetze.map((p) => (
                  <li
                    key={p.nr}
                    className="inline-flex items-center gap-2 rounded-full bg-green-50 text-green-800 px-3 py-1.5 text-sm font-semibold mr-2"
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full bg-green-500"
                      aria-hidden
                    />
                    Platz {p.nr}: ab {p.datum}
                  </li>
                ))}
              </ul>
            )}
          </Section>

          {/* Beratungsstelle */}
          <Section titel="Beratungsstelle">
            <p>{BERATUNGSGEBIET_LABEL[tagesmutter.beratungsgebiet]}</p>
          </Section>
        </div>
      </aside>
    </>
  );
}

function Section({
  titel,
  children,
}: {
  titel: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-wide text-text-soft font-semibold mb-2">
        {titel}
      </h3>
      <div className="text-base">{children}</div>
    </div>
  );
}
