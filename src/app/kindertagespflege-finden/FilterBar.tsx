"use client";

import type { Beratungsgebiet } from "@/types";

export type FilterState = {
  beratungsgebiet: "ALLE" | Beratungsgebiet;
  adresseQuery: string;
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

export function FilterBar({ value, onChange }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Karte 1 – Umkreissuche */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-text-soft/10">
        <h3 className="text-base font-bold mb-3">In meiner Nähe</h3>
        <label className="block mb-3">
          <span className="block text-sm text-text-soft mb-1">
            Adresse oder PLZ
          </span>
          <input
            type="text"
            placeholder="z.B. Alaunstraße 36 oder 01099"
            value={value.adresseQuery}
            onChange={(e) =>
              onChange({ ...value, adresseQuery: e.target.value })
            }
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
        <label className="block mb-3">
          <span className="block text-sm text-text-soft mb-1">Ab</span>
          <input
            type="date"
            value={value.abDatum}
            onChange={(e) => onChange({ ...value, abDatum: e.target.value })}
            className="w-full rounded-xl border border-text-soft/20 px-4 py-2.5 bg-white text-base focus:outline-none focus:border-korallenrot"
          />
        </label>
        <label className="block">
          <span className="block text-sm text-text-soft mb-1">
            Bis <span className="text-text-soft/70">(optional)</span>
          </span>
          <input
            type="date"
            value={value.bisDatum}
            min={value.abDatum || undefined}
            onChange={(e) => onChange({ ...value, bisDatum: e.target.value })}
            className="w-full rounded-xl border border-text-soft/20 px-4 py-2.5 bg-white text-base focus:outline-none focus:border-korallenrot"
          />
        </label>
      </div>

      {/* Karte 3 – Nur freie Plätze */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-text-soft/10">
        <h3 className="text-base font-bold mb-3">Freie Plätze</h3>
        <label className="inline-flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={value.nurFreiePlaetze}
            onChange={(e) =>
              onChange({ ...value, nurFreiePlaetze: e.target.checked })
            }
            className="h-5 w-5 rounded border-text-soft/30 text-korallenrot focus:ring-korallenrot"
          />
          <span>Nur mit freien Plätzen anzeigen</span>
        </label>
      </div>
    </div>
  );
}
