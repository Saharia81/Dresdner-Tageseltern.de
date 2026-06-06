import { BannerSeite, bannerMetadata } from "@/app/_banner/BannerSeite";

export const generateMetadata = () => bannerMetadata("2");

export default function Banner2Page() {
  return <BannerSeite nr="2" />;
}
