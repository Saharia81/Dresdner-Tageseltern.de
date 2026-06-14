import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@/components/Analytics";
import { CookieBanner } from "@/components/CookieBanner";
import { ClickTracking } from "@/components/ClickTracking";
import { analyticsEnabled } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Dresdner Tages Eltern e.V. – Kindertagespflege in Dresden",
  description:
    "Der Verein Dresdner Tages Eltern e.V. bringt Eltern und Tagesmütter in Dresden zusammen. Erfahre mehr über Kindertagespflege, finde freie Plätze und werde Mitglied.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Analytics />
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        {analyticsEnabled && (
          <>
            <ClickTracking />
            <CookieBanner />
          </>
        )}
      </body>
    </html>
  );
}
