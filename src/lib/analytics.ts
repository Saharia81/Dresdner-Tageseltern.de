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

/** Event-Name, mit dem der Footer-Link das Banner erneut öffnet. */
export const CONSENT_EVENT = "open-cookie-consent";

/**
 * Öffnet das Cookie-Banner erneut (für den „Cookie-Einstellungen"-Link im
 * Footer). So lässt sich eine erteilte Einwilligung mit einem Klick widerrufen
 * oder ändern, wie es Art. 7 Abs. 3 DSGVO verlangt.
 */
export function openConsentBanner(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }
}

type ConsentValue = "granted" | "denied";

type Gtag = (...args: unknown[]) => void;

function getGtag(): Gtag | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { gtag?: Gtag }).gtag;
}

/** Prüft, ob der Besucher der Messung zugestimmt hat. */
function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

/**
 * Feuert ein GA4-Event – aber nur mit erteilter Einwilligung. Ohne Zustimmung
 * (oder solange keine Entscheidung getroffen wurde) passiert nichts, damit kein
 * Klick an Google gemeldet wird. So hält sich der Code an die Zusage in der
 * Datenschutzerklärung (§ 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO).
 */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (!hasConsent()) return;
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
