/**
 * Schlanker Wrapper um Googles gtag.js (GA4 + Google Ads).
 * Die Tags werden in <Analytics /> geladen, die Einwilligung steuert <CookieBanner />.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
export const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID;

/** Tracking ist nur aktiv, wenn eine GA4-Mess-ID hinterlegt ist. */
export const analyticsEnabled = Boolean(GA_ID);

/** Schlüssel, unter dem die Einwilligung im localStorage gespeichert wird. */
export const CONSENT_KEY = "cookie-consent";

type ConsentValue = "granted" | "denied";

type Gtag = (...args: unknown[]) => void;

function getGtag(): Gtag | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { gtag?: Gtag }).gtag;
}

/** Feuert ein GA4-Event (no-op, wenn gtag fehlt oder keine Einwilligung vorliegt). */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  getGtag()?.("event", name, params ?? {});
}

/** Aktualisiert den Consent Mode nach Klick im Cookie-Banner. */
export function updateConsent(value: ConsentValue): void {
  getGtag()?.("consent", "update", {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });
}
