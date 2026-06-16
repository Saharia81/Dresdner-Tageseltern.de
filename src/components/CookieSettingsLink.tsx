"use client";

import { analyticsEnabled, openConsentBanner } from "@/lib/analytics";

/**
 * Footer-Link, der das Cookie-Banner erneut öffnet. Erscheint nur, wenn das
 * Tracking überhaupt aktiv ist (sonst gäbe es keine Einwilligung zu ändern).
 */
export function CookieSettingsLink() {
  if (!analyticsEnabled) return null;

  return (
    <button
      type="button"
      onClick={openConsentBanner}
      className="hover:underline text-left"
    >
      Cookie-Einstellungen
    </button>
  );
}
