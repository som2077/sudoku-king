export const BANNER_AD_UNIT_ID = "";

export function showRewardedAd(
  _onEarned: () => void,
  onError?: (message: string) => void,
  _isPremium?: boolean,
) {
  onError?.("Rewarded ads are unavailable on web.");
}

export function showInterstitialAd(onClosed?: () => void, _isPremium?: boolean) {
  onClosed?.();
}
