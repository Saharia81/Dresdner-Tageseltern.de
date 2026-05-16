"use client";

import Image from "next/image";
import { useState } from "react";
import { AdresseAutocomplete } from "@/components/ui/AdresseAutocomplete";
import {
  BERATUNGSGEBIET_LABEL,
  BERATUNGSSTELLE_URL,
  PIN_BERATUNGSSTELLE,
  PIN_TAGESMUTTER,
  type Beratungsgebiet,
} from "@/types";

export type FilterState = {
  beratungsgebiet: "ALLE" | Beratungsgebiet;
  adresseQuery: string;
  adresseCoords: { lat: number; lng: number } | null;
  radiusKm: number; // 0 = kein Umkreisfilter
  abDatum: string; // ISO date (YYYY-MM-DD) oder ""
  bisDatum: string; // optional, leer = offen nach oben
  nurFreiePlaetze: boolean;
};

type Props = {
  value: FilterState;
  onChange: (next: FilterState) => void;
};

const RADIUS_MAX_KM = 10;

// Tagespflege-Plätze starten immer am 1. oder 15. eines Monats. Wir bilden
// den Filter deshalb auf monatliche Fenster ab:
//   abDatum  = 1. des gewählten Monats
//   bisDatum = 15. desselben Monats ("Nein") bzw. 15. + 2 Monate später ("Ja")
const FLEX_MONATE = 2;

const MONATS_NAMEN = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

const AKTUELLES_JAHR = new Date().getFullYear();
const JAHRE = [AKTUELLES_JAHR, AKTUELLES_JAHR + 1, AKTUELLES_JAHR + 2];

function monatPlusFuenfzehnter(monat: string, offset: number): string {
  if (!monat) return "";
  const [yStr, mStr] = monat.split("-");
  const y = Number(yStr);
  const m = Number(mStr);
  if (!y || !m) return "";
  const total = y * 12 + (m - 1) + offset;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  return `${ny}-${String(nm).padStart(2, "0")}-15`;
}

export function FilterBar({ value, onChange }: Props) {
  // „Ja, etwas später ist möglich" wird lokal gehalten, damit der User „Ja"
  // auch wählen kann, bevor ein Monat ausgewählt ist.
  const [spaeterMoeglich, setSpaeterMoeglich] = useState(
    () => value.bisDatum !== "",
  );

  // abDatum ist intern „YYYY-MM-01". Für die Dropdowns brauchen wir Monat und Jahr separat.
  const aktuellerMonat = value.abDatum ? value.abDatum.slice(0, 7) : "";
  const [jahrTeil, monatTeil] = aktuellerMonat
    ? aktuellerMonat.split("-")
    : ["", ""];

  function setzeMonatJahr(monat: string, jahr: string) {
    const vollstaendig = monat && jahr ? `${jahr}-${monat}` : "";
    const ab = vollstaendig ? `${vollstaendig}-01` : "";
    const offset = spaeterMoeglich ? FLEX_MONATE : 0;
    const bis = vollstaendig ? monatPlusFuenfzehnter(vollstaendig, offset) : "";
    onChange({ ...value, abDatum: ab, bisDatum: bis });
  }

  function setzeFlexibilitaet(neu: boolean) {
    setSpaeterMoeglich(neu);
    if (!aktuellerMonat) {
      onChange({ ...value, bisDatum: "" });
      return;
    }
    const offset = neu ? FLEX_MONATE : 0;
    onChange({
      ...value,
      bisDatum: monatPlusFuenfzehnter(aktuellerMonat, offset),
    });
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Karte 1 – Umkreissuche */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-text-soft/10">
        <h3 className="text-base font-bold mb-3">In meiner Nähe</h3>
        <label className="block mb-3">
          <span className="block text-sm text-text-soft mb-1">
            Adresse oder PLZ
          </span>
          <AdresseAutocomplete
            value={value.adresseQuery}
            initiallyValid={!!value.adresseCoords}
            onChange={(query, treffer) =>
              onChange({
                ...value,
                adresseQuery: query,
                adresseCoords: treffer
                  ? { lat: treffer.lat, lng: treffer.lng }
                  : null,
              })
            }
            placeholder="z.B. Alaunstraße 36 oder 01099"
            className="w-full rounded-xl border border-text-soft/20 px-4 py-2.5 bg-white text-base focus:outline-none focus:border-korallenrot"
          />
        </label>
        <label className="block">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-sm text-text-soft">Im Umkreis von</span>
            <span className="text-sm font-semibold">
              {value.radiusKm === 0 ? "beliebig" : `${value.radiusKm} km`}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={RADIUS_MAX_KM}
            step={1}
            value={value.radiusKm}
            onChange={(e) =>
              onChange({ ...value, radiusKm: Number(e.target.value) })
            }
            className="w-full appearance-none cursor-pointer bg-transparent
              [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-text-soft/20
              [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-text-soft/20
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-korallenrot [&::-webkit-slider-thumb]:-mt-1.5 [&::-webkit-slider-thumb]:shadow
              [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-korallenrot [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow"
          />
          <div className="flex justify-between text-xs text-text-soft mt-1">
            <span>beliebig</span>
            <span>{RADIUS_MAX_KM} km</span>
          </div>
        </label>
      </div>

      {/* Karte 2 – Betreuungsbeginn (Zeitraum) */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-text-soft/10">
        <h3 className="text-base font-bold mb-3">Betreuungsbeginn</h3>

        <div className="block mb-4">
          <span className="block text-sm text-text-soft mb-1.5">
            Wann möchtest du frühestens mit der Betreuung beginnen?
          </span>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={monatTeil}
              onChange={(e) => setzeMonatJahr(e.target.value, jahrTeil)}
              className={`w-full rounded-xl border border-text-soft/20 px-3 py-2.5 bg-white text-base focus:outline-none focus:border-korallenrot ${
                monatTeil ? "" : "text-text-soft/50"
              }`}
              aria-label="Monat"
            >
              <option value="">Monat</option>
              {MONATS_NAMEN.map((name, i) => (
                <option
                  key={name}
                  value={String(i + 1).padStart(2, "0")}
                  className="text-text"
                >
                  {name}
                </option>
              ))}
            </select>
            <select
              value={jahrTeil}
              onChange={(e) => setzeMonatJahr(monatTeil, e.target.value)}
              className={`w-full rounded-xl border border-text-soft/20 px-3 py-2.5 bg-white text-base focus:outline-none focus:border-korallenrot ${
                jahrTeil ? "" : "text-text-soft/50"
              }`}
              aria-label="Jahr"
            >
              <option value="">Jahr</option>
              {JAHRE.map((j) => (
                <option key={j} value={String(j)} className="text-text">
                  {j}
                </option>
              ))}
            </select>
          </div>
        </div>

        <fieldset>
          <legend className="block text-sm text-text-soft mb-1.5">
            Darf der Betreuungsstart auch etwas später sein?
          </legend>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="betreuungsbeginn-flexibel"
                checked={!spaeterMoeglich}
                onChange={() => setzeFlexibilitaet(false)}
                className="h-4 w-4 text-korallenrot focus:ring-korallenrot"
              />
              <span className="text-sm">Nein</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="betreuungsbeginn-flexibel"
                checked={spaeterMoeglich}
                onChange={() => setzeFlexibilitaet(true)}
                className="h-4 w-4 text-korallenrot focus:ring-korallenrot"
              />
              <span className="text-sm">
                Ja, etwas später ist möglich
              </span>
            </label>
          </div>
        </fieldset>
      </div>

      {/* Karte 3 – Pin-Legende */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-text-soft/10">
        <h3 className="text-base font-bold mb-2">Pin-Legende</h3>
        <ul className="space-y-1.5">
          <li className="flex items-center gap-3">
            <Image
              src={PIN_TAGESMUTTER}
              alt=""
              width={32}
              height={32}
              aria-hidden
              className="h-7 w-7 object-contain shrink-0"
            />
            <span className="text-sm">Tagesmütter/Tagesväter</span>
          </li>
          {(["MALWINA", "OUTLAW", "KINDERLAND"] as Beratungsgebiet[]).map(
            (b) => (
              <li key={b} className="flex items-center gap-3">
                <Image
                  src={PIN_BERATUNGSSTELLE[b]}
                  alt=""
                  width={32}
                  height={32}
                  aria-hidden
                  className="h-7 w-7 object-contain shrink-0"
                />
                <span className="text-sm">
                  <a
                    href={BERATUNGSSTELLE_URL[b]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-korallenrot transition-colors"
                  >
                    {BERATUNGSGEBIET_LABEL[b]}
                  </a>{" "}
                  <span className="text-text-soft">(Beratung/Vermittlung)</span>
                </span>
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
}
