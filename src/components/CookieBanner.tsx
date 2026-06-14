"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CONSENT_KEY, updateConsent } from "@/lib/analytics";

/**
 * Einwilligungs-Banner für das Google-Tracking (Consent Mode v2).
 * Erscheint nur, solange noch keine Entscheidung getroffen wurde.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored !== "granted" && stored !== "denied") setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function decide(value: "granted" | "denied") {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* localStorage nicht verfügbar – Banner trotzdem schließen */
    }
    updateConsent(value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-Einwilligung"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-text/10 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
    >
      <div className="mx-auto max-w-6xl px-4 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-text-soft max-w-2xl">
          Wir verwenden Cookies, um die Nutzung unserer Website mit Google
          Analytics und Google Ads zu messen und unser Angebot zu verbessern.
          Das ist freiwillig – du kannst ablehnen. Mehr dazu in unserer{" "}
          <Link href="/datenschutz" className="underline hover:text-korallenrot">
            Datenschutzerklärung
          </Link>
          .
        </p>
        <div className="flex flex-shrink-0 flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => decide("denied")}
            className="inline-flex items-center justify-center rounded-full border border-text/10 bg-white px-6 py-3 font-semibold text-text transition-colors hover:border-text/30"
          >
            Ablehnen
          </button>
          <button
            type="button"
            onClick={() => decide("granted")}
            className="inline-flex items-center justify-center rounded-full bg-korallenrot px-6 py-3 font-semibold text-white transition-colors hover:bg-korallenrot-dunkel"
          >
            Akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
