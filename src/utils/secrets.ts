// Utility to decode obfuscated hex strings at runtime
// This prevents raw strings (like API keys) from being visible in the JS bundle.

const decodeHex = (hexString: string): string => {
  let str = '';
  for (let i = 0; i < hexString.length; i += 2) {
    str += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));
  }
  return str;
};

// Obfuscated AdMob Banner ID: ca-app-pub-6128782678213076/6903091288
const OBFUSCATED_BANNER_ID = "63612d6170702d7075622d363132383738323637383231333037362f36393033303931323838";

// Obfuscated AdMob Rewarded ID: ca-app-pub-6128782678213076/8888407590
const OBFUSCATED_REWARDED_ID = "63612d6170702d7075622d363132383738323637383231333037362f38383838343037353930";

// Obfuscated AdMob Interstitial ID: ca-app-pub-6128782678213076/1390754629
const OBFUSCATED_INTERSTITIAL_ID = "63612d6170702d7075622d363132383738323637383231333037362f31333930373534363239";

// Obfuscated RevenueCat Public Key: goog_REPLACE_WITH_REAL_API_KEY
// Note: Generate a new hex string using `node scripts/obfuscate.js "your_real_key"` when ready.
const OBFUSCATED_REVENUECAT_KEY = "676f6f675f5245504c4143455f574954485f5245414c5f4150495f4b4559";

export const getBannerAdUnitId = () => decodeHex(OBFUSCATED_BANNER_ID);
export const getRewardedAdUnitId = () => decodeHex(OBFUSCATED_REWARDED_ID);
export const getInterstitialAdUnitId = () => decodeHex(OBFUSCATED_INTERSTITIAL_ID);
export const getRevenueCatApiKey = () => decodeHex(OBFUSCATED_REVENUECAT_KEY);
