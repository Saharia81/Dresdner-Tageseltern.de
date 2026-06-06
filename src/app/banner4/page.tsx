import { BannerSeite, bannerMetadata } from "@/app/_banner/BannerSeite";

export const generateMetadata = () => bannerMetadata("4");

export default function Banner4Page() {
  return <BannerSeite nr="4" />;
}
