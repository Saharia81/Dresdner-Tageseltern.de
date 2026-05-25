import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Geräte im lokalen Netzwerk dürfen im Dev-Modus zugreifen (Handy, Tablet, …)
  allowedDevOrigins: ["192.168.76.60"],
  images: {
    // Erlaubte Qualitätsstufen: 75 = Standard, 85 = schärfere Fotos
    qualities: [75, 85],
  },
};

export default nextConfig;
