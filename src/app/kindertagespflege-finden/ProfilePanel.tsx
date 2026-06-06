"use client";

import { useEffect } from "react";
import type { TagesmutterDto } from "@/app/api/tagesmutters/route";
import { SteckbriefInhalt } from "./SteckbriefInhalt";

type Props = {
  tagesmutter: TagesmutterDto | null;
  onClose: () => void;
};

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

        <div className="px-4 pt-8 pb-8">
          <SteckbriefInhalt tagesmutter={tagesmutter} />
        </div>
      </aside>
    </>
  );
}
