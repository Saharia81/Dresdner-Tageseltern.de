"use client";

import Image from "next/image";
import type { TagesmutterDto } from "@/app/api/tagesmutters/route";

type Props = {
  tagesmutter: TagesmutterDto;
  x: number; // Pixel relativ zum Karten-Container
  y: number;
  onClick: () => void;
};

function hatFreiePlaetze(tm: TagesmutterDto): boolean {
  return tm.hatFreienPlatz;
}

export function PreviewCard({ tagesmutter, x, y, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute z-[500] -translate-x-1/2 -translate-y-full mt-[-12px] cursor-pointer text-left"
      style={{ left: x, top: y }}
      aria-label={`${tagesmutter.vorname} ${tagesmutter.nachname} – Profil öffnen`}
    >
      <div className="rounded-2xl bg-white shadow-xl border border-text-soft/15 p-3 w-[260px] flex items-start gap-3 transition-transform hover:-translate-y-0.5">
        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-text-soft/15 shrink-0">
          <Image
            src={tagesmutter.fotoUrl}
            alt=""
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-tight truncate">
            {tagesmutter.vorname} {tagesmutter.nachname}
          </p>
          <p className="text-sm text-text-soft truncate">
            {tagesmutter.einrichtungsname}
          </p>
          <p className="text-xs text-text-soft mt-1 line-clamp-2">
            {tagesmutter.oeffnungszeiten}
          </p>
          {hatFreiePlaetze(tagesmutter) && (
            <div className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-green-700">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
              Freie Plätze
            </div>
          )}
        </div>
      </div>
      {/* kleines Dreieck nach unten */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-white rotate-45 border-r border-b border-text-soft/15" />
    </button>
  );
}
