"use client";

import { useState } from "react";
import { LinkButton } from "@/components/ui/Button";

const RADIUS_MAX_KM = 10;

export function SuchForm() {
  const [adresse, setAdresse] = useState("");
  const [radiusKm, setRadiusKm] = useState(0);

  const params = new URLSearchParams();
  if (adresse.trim()) params.set("adresse", adresse.trim());
  if (radiusKm > 0) params.set("radius", String(radiusKm));
  const query = params.toString();
  const href = query
    ? `/kindertagespflege-finden?${query}`
    : "/kindertagespflege-finden";

  return (
    <form className="space-y-5">
      <div>
        <label
          htmlFor="anschrift"
          className="block text-sm text-text-soft mb-1"
        >
          Anschrift
        </label>
        <input
          id="anschrift"
          type="text"
          placeholder="z. B. Alaunstraße 36 oder 01099"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
          className="w-full rounded-xl border border-text-soft/20 px-4 py-3 text-base focus:outline-none focus:border-korallenrot"
        />

        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-sm text-text-soft">Im Umkreis von</span>
          <span className="text-sm font-semibold">
            {radiusKm === 0 ? "beliebig" : `${radiusKm} km`}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={RADIUS_MAX_KM}
          step={1}
          value={radiusKm}
          onChange={(e) => setRadiusKm(Number(e.target.value))}
          aria-label="Umkreis in Kilometern"
          className="w-full appearance-none cursor-pointer bg-transparent mt-1
            [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-text-soft/20
            [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-text-soft/20
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-korallenrot [&::-webkit-slider-thumb]:-mt-1.5 [&::-webkit-slider-thumb]:shadow
            [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-korallenrot [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow"
        />
        <div className="flex justify-between text-xs text-text-soft mt-1">
          <span>beliebig</span>
          <span>{RADIUS_MAX_KM} km</span>
        </div>
      </div>

      <LinkButton variant="primary" href={href} className="w-full">
        Jetzt finden
      </LinkButton>
    </form>
  );
}
