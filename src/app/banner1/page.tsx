import { BannerSeite, bannerMetadata } from "@/app/_banner/BannerSeite";

// Dynamisch: der angezeigte Steckbrief hängt von der aktuellen Buchung
// und vom heutigen Datum ab.
export const dynamic = "force-dynamic";

export const generateMetadata = () => bannerMetadata("1");

export default function Banner1Page() {
  return <BannerSeite nr="1" />;
}
