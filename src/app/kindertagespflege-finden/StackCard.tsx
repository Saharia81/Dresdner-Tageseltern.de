"use client";

import Image from "next/image";
import type { TagesmutterDto } from "@/app/api/tagesmutters/route";

type Props = {
  gruppe: TagesmutterDto[];
  x: number; // Pixel relativ zum Karten-Container
  y: number;
  onSelect: (tm: TagesmutterDto) => void;
  nachUnten?: boolean; // true = Karte unterhalb des Pins (kein Platz oben)
};

export function StackCard({ gruppe, x, y, onSelect, nachUnten = false }: Props) {
  return (
    <div
      className={`absolute z-[1000] -translate-x-1/2 pointer-events-auto ${
        nachUnten ? "mt-[12px]" : "-translate-y-full mt-[-12px]"
      }`}
      style={{ left: x, top: y }}
    >
      <div className="rounded-2xl bg-white shadow-xl border border-text-soft/15 p-2 w-[280px]">
        <p className="text-xs font-bold text-text-soft px-2 pt-1 pb-2">
          {gruppe.length} Tageseltern an dieser Adresse
        </p>
        {gruppe.map((tm) => (
          <button
            key={tm.id}
            type="button"
            onClick={() => onSelect(tm)}
            className="flex w-full items-center gap-3 rounded-xl border border-[#e8dfc8] bg-[#fdf7e3] p-2 my-1 text-left cursor-pointer transition-colors hover:bg-white hover:border-[#f8796c]"
            aria-label={`${tm.vorname} ${tm.nachname} – Profil öffnen`}
          >
            <div className="relative w-11 h-11 rounded-full overflow-hidden bg-text-soft/15 shrink-0">
              <Image
                src={tm.fotoUrl}
                alt=""
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm leading-tight truncate">
                {tm.vorname} {tm.nachname}
              </p>
              <p className="text-xs text-text-soft truncate">
                {tm.einrichtungsname}
              </p>
              <p className="text-[11px] text-text-soft truncate">
                {tm.oeffnungszeiten}
              </p>
              {tm.hatFreienPlatz && (
                <span className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-semibold text-green-700">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
                  Freie Plätze
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
      {/* kleines Dreieck: zeigt zum Pin */}
      {nachUnten ? (
        <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 bg-white rotate-45 border-l border-t border-text-soft/15" />
      ) : (
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-white rotate-45 border-r border-b border-text-soft/15" />
      )}
    </div>
  );
}
