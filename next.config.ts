import type { NextConfig } from "next";

const STECKBRIEF_BILDER = "public/images/tagesmuetter/**/*";

const nextConfig: NextConfig = {
  // Geräte im lokalen Netzwerk dürfen im Dev-Modus zugreifen (Handy, Tablet, …)
  allowedDevOrigins: ["192.168.76.60"],
  images: {
    // Erlaubte Qualitätsstufen: 75 = Standard, 85 = schärfere Fotos
    qualities: [75, 85, 90],
  },
  // Die Steckbrief-Bilder werden zur Laufzeit per fs aus dem Ordner gelesen
  // (lib/tagesmutter-bilder.ts). Da der Pfad dynamisch ist, erkennt das
  // automatische File-Tracing diese Dateien nicht – sie müssen für die
  // betroffenen Server-Funktionen explizit ins Deployment-Bundle aufgenommen
  // werden (sonst fehlen sie auf Vercel).
  // Nur die Routen, die lib/steckbriefe.ts oder lib/tagesmutter-bilder.ts
  // nutzen, bekommen die Bilder. Mit "/*" landeten sie in jeder Funktion,
  // und die Funktionen wurden größer als Vercels Limit von 250 MB.
  outputFileTracingIncludes: {
    "/api/tagesmutters": [STECKBRIEF_BILDER],
    "/api/steckbriefe": [STECKBRIEF_BILDER],
    "/api/admin/steckbriefe": [STECKBRIEF_BILDER],
    "/admin/steckbriefe": [STECKBRIEF_BILDER],
    "/admin/steckbriefe/*": [STECKBRIEF_BILDER],
    "/banner1": [STECKBRIEF_BILDER],
    "/banner2": [STECKBRIEF_BILDER],
    "/banner3": [STECKBRIEF_BILDER],
    "/banner4": [STECKBRIEF_BILDER],
  },
};

export default nextConfig;
