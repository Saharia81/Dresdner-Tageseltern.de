import { BannerSeite, bannerMetadata } from "@/app/_banner/BannerSeite";

// Dynamisch: der angezeigte Steckbrief hängt von der aktuellen Buchung
// und vom heutigen Datum ab. Ist Banner 3 gerade nicht gebucht, zeigt
// BannerSeite die neutrale Finder-Landingpage.
export const dynamic = "force-dynamic";

export const generateMetadata = () => bannerMetadata("3");

export default function Banner3Page() {
  return <BannerSeite nr="3" />;
}
