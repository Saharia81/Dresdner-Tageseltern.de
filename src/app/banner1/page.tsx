import { BannerSeite, bannerMetadata } from "@/app/_banner/BannerSeite";

export const generateMetadata = () => bannerMetadata("1");

export default function Banner1Page() {
  return <BannerSeite nr="1" />;
}
