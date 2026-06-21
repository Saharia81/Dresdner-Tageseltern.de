"use client";

// Aufklappbare Karten für die Ersatztagespflegepersonen.
// Geschlossen: Profilbild, Name, Stadtteil, freier Kooperationsplatz.
// Aufgeklappt: Foto-Galerie, Infos (Adresse/Modell), optional Karte bei
// Stützpunkten, Telefon- und E-Mail-Kontakt – angelehnt an die Steckbriefe.

import Image from "next/image";
import { useState } from "react";
import { FotoKarussel } from "@/components/ui/FotoKarussel";

export type Ersatzperson = {
  name: string;
  stadtteil: string;
  freierPlatz: boolean;
  modelle?: ("Basis-ETP" | "Stützpunkt")[];
  text?: string;
  /* Mitgliedsnummer: Fotos werden dann automatisch aus
     public/images/tagesmuetter/<nr>/ erkannt (wie bei den Steckbriefen). */
  mitgliedsnummer?: string;
  foto?: string;
  galerie?: string[];
  strasse?: string;
  plz?: string;
  telefon?: string;
  email?: string;
  /* Für die Karte bei Stützpunkten (optional) */
  latitude?: number;
  longitude?: number;
};

export function ErsatzListe({ personen }: { personen: Ersatzperson[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-start">
      {personen.map((person, i) => (
        <ErsatzKarte key={i} person={person} />
      ))}
    </div>
  );
}

function ErsatzKarte({ person }: { person: Ersatzperson }) {
  const [offen, setOffen] = useState(false);
  const istStuetzpunkt = person.modelle?.includes("Stützpunkt") ?? false;
  const hatKarte =
    istStuetzpunkt &&
    typeof person.latitude === "number" &&
    typeof person.longitude === "number";

  return (
    <div className="rounded-3xl bg-white border border-text-soft/10 shadow-sm overflow-hidden">
      {/* Kopf – immer sichtbar, klickbar */}
      <button
        type="button"
        onClick={() => setOffen((v) => !v)}
        aria-expanded={offen}
        className="flex w-full items-center gap-4 p-4 sm:p-5 text-left hover:bg-creme/50 transition-colors"
      >
        <Avatar foto={person.foto} name={person.name} />

        <div className="min-w-0 flex-1">
          <p className="font-extrabold text-lg leading-tight truncate">
            {person.name}
          </p>
          <p className="text-sm text-text-soft flex items-center gap-1.5 mt-0.5">
            <PinIcon />
            <span className="truncate">{person.stadtteil}</span>
          </p>
          <div className="mt-2">
            <PlatzBadge frei={person.freierPlatz} />
          </div>
        </div>

        <span
          className="shrink-0 text-text-soft transition-transform duration-200"
          style={{ transform: offen ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {/* Aufgeklappter Inhalt */}
      {offen && (
        <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-text-soft/10 flex flex-col gap-6">
          {person.text && (
            <p className="text-text-soft text-sm leading-relaxed pt-4">
              {person.text}
            </p>
          )}

          {person.galerie && person.galerie.length > 0 && (
            <FotoKarussel fotos={person.galerie.filter(Boolean)} />
          )}

          {/* Infos */}
          <div className="grid gap-3 grid-cols-2">
            {(person.strasse || person.plz) && (
              <InfoKarte titel="Adresse">
                {person.strasse && <p>{person.strasse}</p>}
                <p>
                  {[person.plz, person.stadtteil].filter(Boolean).join(" · ")}
                </p>
              </InfoKarte>
            )}
            {person.modelle && person.modelle.length > 0 && (
              <InfoKarte titel="Vertretungsmodell">
                <p>{person.modelle.join(", ")}</p>
              </InfoKarte>
            )}
          </div>

          {/* Karte bei Stützpunkten */}
          {hatKarte && (
            <Stuetzpunktkarte
              lat={person.latitude!}
              lng={person.longitude!}
              name={person.name}
            />
          )}

          {/* Kontakt */}
          {(person.telefon || person.email) && (
            <div className="rounded-3xl bg-white border border-text-soft/10 p-5 shadow-sm">
              <h3 className="text-lg font-extrabold mb-4">Kontakt</h3>
              <div className="flex flex-col gap-2.5">
                {person.telefon && (
                  <a
                    href={`tel:${person.telefon.replace(/\s+/g, "")}`}
                    className="inline-flex items-center justify-center gap-2.5 rounded-full bg-korallenrot text-white px-5 py-3 text-base font-bold hover:bg-korallenrot-dunkel transition-colors shadow-sm"
                  >
                    <IconTelefon />
                    Anrufen
                  </a>
                )}
                {person.email && (
                  <a
                    href={`mailto:${person.email}`}
                    className="inline-flex items-center justify-center gap-2.5 rounded-full bg-sonnengelb text-text px-5 py-3 text-base font-bold hover:bg-sonnengelb-hell transition-colors shadow-sm"
                  >
                    <IconMail />
                    E-Mail schreiben
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bausteine                                                           */
/* ------------------------------------------------------------------ */

function PlatzBadge({ frei }: { frei: boolean }) {
  if (frei) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 text-green-700 px-3 py-1 text-xs font-semibold border border-green-200">
        <span className="inline-block w-2 h-2 rounded-full bg-green-500" aria-hidden />
        Freier Kooperationsplatz
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-text-soft/10 text-text-soft px-3 py-1 text-xs font-semibold">
      <span className="inline-block w-2 h-2 rounded-full bg-text-soft/40" aria-hidden />
      Zurzeit kein freier Platz
    </span>
  );
}

function Avatar({ foto, name }: { foto?: string; name: string }) {
  if (foto) {
    return (
      <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-full bg-text-soft/10 ring-4 ring-creme shadow-sm">
        <Image src={foto} alt={name} fill sizes="64px" className="object-cover" />
      </div>
    );
  }

  const initialen = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="w-16 h-16 shrink-0 rounded-full bg-korallenrot/15 text-korallenrot flex items-center justify-center font-extrabold text-lg ring-4 ring-creme">
      {initialen}
    </div>
  );
}

function InfoKarte({
  titel,
  children,
}: {
  titel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-[#fdf7e3] p-4 shadow-sm border border-sonnengelb/40 flex flex-col gap-1.5">
      <h4 className="font-bold text-sm">{titel}</h4>
      <div className="text-xs text-text-soft leading-relaxed">{children}</div>
    </div>
  );
}

function Stuetzpunktkarte({
  lat,
  lng,
  name,
}: {
  lat: number;
  lng: number;
  name: string;
}) {
  const d = 0.004; // kleiner Ausschnitt um den Punkt
  const bbox = `${lng - d}%2C${lat - d}%2C${lng + d}%2C${lat + d}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-text-soft/10 shadow-sm">
      <iframe
        title={`Standort Stützpunkt ${name}`}
        src={src}
        className="w-full h-56"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
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

function PinIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0 text-korallenrot"
    >
      <path
        d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
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
