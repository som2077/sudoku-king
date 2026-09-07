import mobileAds, {
  TestIds,
  RewardedAd,
  RewardedAdEventType,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { getBannerAdUnitId, getRewardedAdUnitId, getInterstitialAdUnitId } from '../utils/secrets';

// Initialize Mobile Ads SDK
mobileAds().initialize().then(() => {
  console.log('🔥 [AdMob] Initialized successfully');
});

// Ad Unit IDs (Use official Google TestIds in DEV, production IDs in release)
export const BANNER_AD_UNIT_ID = __DEV__ ? TestIds.BANNER : getBannerAdUnitId();
export const REWARDED_AD_UNIT_ID = __DEV__ ? TestIds.REWARDED : getRewardedAdUnitId();
export const INTERSTITIAL_AD_UNIT_ID = __DEV__ ? TestIds.INTERSTITIAL : getInterstitialAdUnitId();

// Frequency Capping: Minimum 3 minutes (180,000 ms) between Interstitials
const INTERSTITIAL_COOLDOWN_MS = 180_000;
let lastInterstitialShownAt = 0;

// ─── Rewarded Ad Controller ───────────────────────────────────────────────────

let rewardedAd: RewardedAd | null = null;
let isRewardedLoaded = false;
let currentRewardCallback: (() => void) | null = null;
let currentErrorCallback: (() => void) | null = null;

const MAX_AD_RETRIES = 3;
let rewardedRetryCount = 0;
let rewardedRetryTimeout: ReturnType<typeof setTimeout> | null = null;

let interstitialRetryCount = 0;
let interstitialRetryTimeout: ReturnType<typeof setTimeout> | null = null;

function setupRewardedAd() {
  if (rewardedAd) return;

  rewardedAd = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID, {
    requestNonPersonalizedAdsOnly: true,
  });

  rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
    isRewardedLoaded = true;
    rewardedRetryCount = 0;
    console.log('🔥 [AdMob Rewarded] Loaded and ready');
  });

  rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
    console.log('🎉 [AdMob Rewarded] Reward earned:', reward);
    if (currentRewardCallback) {
      currentRewardCallback();
      currentRewardCallback = null;
    }
  });

  rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
    console.log('ℹ️ [AdMob Rewarded] Closed');
    isRewardedLoaded = false;
    currentRewardCallback = null;
    currentErrorCallback = null;
    // Preload next ad
    rewardedAd?.load();
  });

  rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
    console.log('⚠️ [AdMob Rewarded Error]:', error);
    isRewardedLoaded = false;
    if (currentErrorCallback) {
      currentErrorCallback();
      currentErrorCallback = null;
    }
    currentRewardCallback = null;
    // Retry loading with backoff up to MAX_AD_RETRIES
    if (rewardedRetryCount < MAX_AD_RETRIES) {
      rewardedRetryCount++;
      const delay = Math.min(10000 * Math.pow(2, rewardedRetryCount - 1), 60000);
      if (rewardedRetryTimeout) clearTimeout(rewardedRetryTimeout);
      rewardedRetryTimeout = setTimeout(() => rewardedAd?.load(), delay);
    }
  });

  rewardedAd.load();
}

export function showRewardedAd(
  onEarned: () => void,
  onError?: (msg: string) => void,
  isPremium?: boolean,
) {
  if (isPremium) {
    onEarned();
    return;
  }

  if (!rewardedAd) {
    setupRewardedAd();
  }

  if (isRewardedLoaded && rewardedAd) {
    currentRewardCallback = onEarned;
    currentErrorCallback = () => onError?.('Failed to display the rewarded ad.');
    rewardedAd.show().catch((err) => {
      console.log('⚠️ [AdMob Rewarded Show Error]:', err);
      currentRewardCallback = null;
      currentErrorCallback = null;
      onError?.('Ad display error. Please try again.');
      rewardedAd?.load();
    });
  } else {
    // If not loaded yet, reset retry count and attempt load
    rewardedRetryCount = 0;
    rewardedAd?.load();
    onError?.('Ad not ready yet. Please wait a moment and try again.');
  }
}

// ─── Interstitial Ad Controller ───────────────────────────────────────────────

let interstitialAd: InterstitialAd | null = null;
let isInterstitialLoaded = false;
let currentInterstitialClosedCallback: (() => void) | null = null;

function setupInterstitialAd() {
  if (interstitialAd) return;

  interstitialAd = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
    requestNonPersonalizedAdsOnly: true,
  });

  interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
    isInterstitialLoaded = true;
    interstitialRetryCount = 0;
    console.log('🔥 [AdMob Interstitial] Loaded and ready');
  });

  interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
    console.log('ℹ️ [AdMob Interstitial] Closed');
    isInterstitialLoaded = false;
    lastInterstitialShownAt = Date.now();
    if (currentInterstitialClosedCallback) {
      currentInterstitialClosedCallback();
      currentInterstitialClosedCallback = null;
    }
    // Preload next
    interstitialAd?.load();
  });

  interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
    console.log('⚠️ [AdMob Interstitial Error]:', error);
    isInterstitialLoaded = false;
    if (currentInterstitialClosedCallback) {
      currentInterstitialClosedCallback();
      currentInterstitialClosedCallback = null;
    }
    // Retry loading with backoff up to MAX_AD_RETRIES
    if (interstitialRetryCount < MAX_AD_RETRIES) {
      interstitialRetryCount++;
      const delay = Math.min(10000 * Math.pow(2, interstitialRetryCount - 1), 60000);
      if (interstitialRetryTimeout) clearTimeout(interstitialRetryTimeout);
      interstitialRetryTimeout = setTimeout(() => interstitialAd?.load(), delay);
    }
  });

  interstitialAd.load();
}

export function showInterstitialAd(
  onClosed?: () => void,
  isPremium?: boolean,
) {
  if (isPremium) {
    onClosed?.();
    return;
  }

  if (!interstitialAd) {
    setupInterstitialAd();
  }

  const now = Date.now();
  const timeSinceLast = now - lastInterstitialShownAt;

  // Check frequency capping cooldown
  if (timeSinceLast < INTERSTITIAL_COOLDOWN_MS) {
    console.log(`⏱️ [AdMob Interstitial] Frequency capped (${Math.round((INTERSTITIAL_COOLDOWN_MS - timeSinceLast) / 1000)}s remaining)`);
    onClosed?.();
    return;
  }

  if (isInterstitialLoaded && interstitialAd) {
    currentInterstitialClosedCallback = onClosed || null;
    interstitialAd.show().catch((err) => {
      console.log('⚠️ [AdMob Interstitial Show Error]:', err);
      currentInterstitialClosedCallback = null;
      onClosed?.();
      interstitialAd?.load();
    });
  } else {
    // If not loaded, don't block user
    onClosed?.();
    interstitialRetryCount = 0;
    interstitialAd?.load();
  }
}

// Initial setup on module load
setupRewardedAd();
setupInterstitialAd();
