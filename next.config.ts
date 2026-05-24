import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Geräte im lokalen Netzwerk dürfen im Dev-Modus zugreifen (Handy, Tablet, …)
  allowedDevOrigins: ["192.168.76.60"],
};

export default nextConfig;
