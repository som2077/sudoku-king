import type { ComponentType } from "react";

type BottomBannerAdProps = {
  isPremium: boolean;
  bannerLoaded: boolean;
  setBannerLoaded: (loaded: boolean) => void;
};

declare const BottomBannerAd: ComponentType<BottomBannerAdProps>;
export default BottomBannerAd;
