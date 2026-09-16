import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "./Text";
import { View, StyleSheet } from "react-native";
import { BANNER_AD_UNIT_ID } from "../services/adManager";

export default function BottomBannerAd({
  isPremium,
  bannerLoaded,
  setBannerLoaded,
}: {
  isPremium: boolean;
  bannerLoaded: boolean;
  setBannerLoaded: (loaded: boolean) => void;
}) {
  const insets = useSafeAreaInsets();
  if (isPremium) return null;

  return (
    <View
      style={[
        styles.slot,
        { paddingBottom: Math.max(insets.bottom, 6) },
      ]}
    >
      <BannerAd
        unitId={BANNER_AD_UNIT_ID}
        size={BannerAdSize.BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdLoaded={() => setBannerLoaded(true)}
        onAdFailedToLoad={() => setBannerLoaded(false)}
      />
      {!bannerLoaded && (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Banner Ad (320x50)</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    backgroundColor: "#F8FAFC",
  },
  placeholder: {
    width: 320,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
  },
});
