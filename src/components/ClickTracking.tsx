"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Globaler Klick-Listener: erfasst Klicks auf alle tel:- und mailto:-Links
 * (Footer, Kontaktseiten, Steckbriefe) sowie auf die PDF-Downloads unter
 * /downloads/ als GA4-Events – ohne dass jeder Link einzeln angefasst werden
 * muss. Steckbrief-Links liefern über das Attribut data-tm-name zusätzlich den
 * Namen der kontaktierten Tagesmutter.
 */
export function ClickTracking() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const link = target?.closest("a");
      const href = link?.getAttribute("href");
      if (!href) return;

      const tagesmutter = link?.getAttribute("data-tm-name") ?? undefined;
      const page_path = window.location.pathname;

      if (href.startsWith("tel:")) {
        trackEvent("contact_phone_click", { page_path, tagesmutter });
      } else if (href.startsWith("mailto:")) {
        trackEvent("contact_email_click", { page_path, tagesmutter });
      } else if (href.startsWith("/downloads/")) {
        trackEvent("download_click", {
          page_path,
          datei: href.slice("/downloads/".length),
        });
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
