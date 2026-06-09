import type { NextConfig } from "next";

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
  outputFileTracingIncludes: {
    "/*": ["public/images/tagesmuetter/**/*"],
  },
};

export default nextConfig;
