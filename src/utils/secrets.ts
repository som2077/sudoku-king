// Utility to decode obfuscated hex strings at runtime
// This prevents raw strings (like API keys) from being visible in the JS bundle.

const decodeHex = (hexString: string): string => {
  let str = '';
  for (let i = 0; i < hexString.length; i += 2) {
    str += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));
  }
  return str;
};

// Obfuscated AdMob Banner ID: ca-app-pub-1281153062436075/8613664756
const OBFUSCATED_BANNER_ID = "63612d6170702d7075622d313238313135333036323433363037352f38363133363634373536";

// Obfuscated AdMob Rewarded ID: ca-app-pub-1281153062436075/8904047012
const OBFUSCATED_REWARDED_ID = "63612d6170702d7075622d313238313135333036323433363037352f38393034303437303132";

// Obfuscated RevenueCat Public Key: goog_REPLACE_WITH_REAL_API_KEY
// Note: Generate a new hex string using `node scripts/obfuscate.js "your_real_key"` when ready.
const OBFUSCATED_REVENUECAT_KEY = "676f6f675f5245504c4143455f574954485f5245414c5f4150495f4b4559";

export const getBannerAdUnitId = () => decodeHex(OBFUSCATED_BANNER_ID);
export const getRewardedAdUnitId = () => decodeHex(OBFUSCATED_REWARDED_ID);
export const getRevenueCatApiKey = () => decodeHex(OBFUSCATED_REVENUECAT_KEY);
