import Script from "next/script";
import { CONSENT_KEY, GA_ID, GADS_ID } from "@/lib/analytics";

/**
 * Lädt Googles gtag.js (GA4 + optional Google Ads) mit Consent Mode v2.
 * Standard ist "denied"; erst nach Einwilligung im <CookieBanner /> werden
 * Cookies gesetzt. Eine bereits erteilte Einwilligung wird hier wiederhergestellt.
 */
export function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      {/* Muss vor gtag.js laufen: Default = denied, gespeicherte Einwilligung wiederherstellen */}
      <Script id="consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            wait_for_update: 500
          });
          try {
            if (localStorage.getItem('${CONSENT_KEY}') === 'granted') {
              gtag('consent', 'update', {
                ad_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted',
                analytics_storage: 'granted'
              });
            }
          } catch (e) {}
        `}
      </Script>

      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />

      <Script id="gtag-config" strategy="afterInteractive">
        {`
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
          ${GADS_ID ? `gtag('config', '${GADS_ID}');` : ""}
        `}
      </Script>
    </>
  );
}
