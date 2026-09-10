import React, { useState, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  ScrollView,
  Linking,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Text } from "../components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";

import {
  Globe,
  Check,
  X,
  Search,
  ExternalLink,
  RotateCcw,
} from "lucide-react-native";
import { useTranslation, LanguageMeta } from "../i18n";
import { useGameStore } from "../store/useGameStore";
import { haptics } from "../utils/haptics";
import { APP_LINKS } from "../constants/links";
import { AppBottomSheet } from "../components/ui/AppBottomSheet";
import { AppGradientBackground } from "../components/AppGradientBackground";
import { purchaseService } from "../services/purchaseService";

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onQuickPlay?: () => void;
  onRestorePurchases?: () => Promise<{
    success: boolean;
    restored: boolean;
    error?: string;
  } | void> | void;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function WelcomeScreen({
  onGetStarted,
  onRestorePurchases,
}: WelcomeScreenProps) {
  const { t, language, supportedLanguages } = useTranslation();
  const updateSetting = useGameStore((s) => s.updateSetting);
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [languageSearch, setLanguageSearch] = useState("");
  const [legalModal, setLegalModal] = useState<"terms" | "privacy" | null>(
    null,
  );
  const [restoring, setRestoring] = useState(false);

  // ── Sizing ──
  const imageSectionH = height * 0.54;

  // ── Handlers ──
  const handleRestorePurchases = async () => {
    if (restoring) return;
    setRestoring(true);
    haptics.impactLight();
    try {
      let restored = false;
      if (onRestorePurchases) {
        const res = await onRestorePurchases();
        restored =
          res && typeof res === "object" && "restored" in res
            ? Boolean(res.restored)
            : useGameStore.getState().isPremium;
      } else {
        const res = await purchaseService.restorePurchases();
        restored = Boolean(res?.restored);
      }
      if (restored || useGameStore.getState().isPremium) {
        haptics.success();
        Alert.alert(
          "👑 Purchases Restored!",
          "Welcome back! Your VIP access has been successfully restored.",
          [
            {
              text: "Continue to Game",
              onPress: () => {
                haptics.impactMedium();
                onGetStarted();
              },
            },
          ],
        );
      } else {
        Alert.alert(
          "No Active VIP Found",
          "No prior purchases found for this account.",
          [{ text: "OK" }],
        );
      }
    } catch (err: any) {
      Alert.alert(
        "Restore Failed",
        err?.message || "Please check your connection and try again.",
      );
    } finally {
      setRestoring(false);
    }
  };

  const currentLangMeta = useMemo(
    () =>
      supportedLanguages.find((l) => l.code === language) ||
      supportedLanguages[0],
    [language, supportedLanguages],
  );

  const filteredLanguages = useMemo(() => {
    const q = languageSearch.trim().toLowerCase();
    if (!q) return supportedLanguages;
    return supportedLanguages.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.region.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q),
    );
  }, [languageSearch, supportedLanguages]);

  const handleSelectLanguage = (code: string) => {
    haptics.selection();
    updateSetting("language", code);
    setLanguageModalVisible(false);
    setLanguageSearch("");
  };

  return (
    <View style={styles.root}>
      <AppGradientBackground>
        {/* ════════════════════════════════════════════════
          SCROLLING IMAGE GRID — full bleed, above status bar
          ════════════════════════════════════════════════ */}
        <View
          style={[styles.imageSection, { height: imageSectionH + insets.top }]}
        >
          <View style={styles.heroArtWrap}>
            <Image
              source={require("../../assets/Group 24.png")}
              // assets/Group 24.png
              style={{
                width: "120%",
                height: "140%",
                alignSelf: "center",
                justifyContent: "center",
                // maxWidth: 540,
                // maxHeight: 760,
                marginTop: 390,
                marginLeft: 100,
                marginBottom: 0,
              }}
              contentFit="contain"
            />
          </View>

          <TouchableOpacity
            onPress={() => setLanguageModalVisible(true)}
            style={[styles.langPill, { top: insets.top + 12 }]}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={t("settings.language", "Choose Language")}
          >
            {/* <Globe size={15} color="#E5E7EB" /> */}
            <Text style={styles.langPillFlag}>{currentLangMeta.flag}</Text>
            <Text style={styles.langPillText}>
              {currentLangMeta.nativeName}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleRestorePurchases}
            disabled={restoring}
            style={[
              styles.restoreButton,
              styles.restorePill,
              { top: insets.top + 12 },
            ]}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={t(
              "welcome.restorePurchase",
              "Restore Purchases",
            )}
          >
            {restoring ? (
              <ActivityIndicator size="small" color="#E5E7EB" />
            ) : (
              <RotateCcw size={14} color="#E5E7EB" />
            )}
            <Text style={styles.restorePillText}>
              {restoring
                ? t("welcome.restoring", "Restoring...")
                : t("welcome.restorePurchase", "Restore")}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.bottomSection,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
          <Text style={styles.headline}>
            {t("welcome.title", "Play Classic Sudoku,\nSharpen Your Mind")}
          </Text>
          <Text style={styles.subheadline}>
            {t(
              "welcome.subtitle",
              "10,000+ hand-crafted logic puzzles to train focus, memory & daily cognitive fitness.",
            )}
          </Text>
          <TouchableOpacity
            onPress={() => {
              haptics.impactMedium();
              onGetStarted();
            }}
            style={styles.ctaButton}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <Text style={styles.ctaText}>
              {t("welcome.getStarted", "Get Started")}
            </Text>
          </TouchableOpacity>
          <Text style={styles.legalNotice}>
            By get started, you check our{" "}
            <Text
              style={styles.legalLink}
              onPress={() => setLegalModal("terms")}
            >
              Terms of Service
            </Text>{" "}
            and acknowledge our{" "}
            <Text
              style={styles.legalLink}
              onPress={() => setLegalModal("privacy")}
            >
              Privacy Policy
            </Text>
            .
          </Text>
        </View>

        {/* ── Language Switcher Bottom Sheet ── */}
        <AppBottomSheet
          visible={languageModalVisible}
          onClose={() => setLanguageModalVisible(false)}
          maxHeight="82%"
          sheetStyle={{ paddingHorizontal: 20 }}
        >
          <View style={styles.modalHeader}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Globe size={20} color="#2563EB" />
              <Text style={styles.modalHeaderTitle}>
                {t("settings.language", "Choose Language")}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setLanguageModalVisible(false)}
              style={styles.modalCloseBtn}
            >
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <View style={styles.searchBar}>
            <Search size={18} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder={t("settings.searchLanguage", "Search language...")}
              placeholderTextColor="#9CA3AF"
              value={languageSearch}
              onChangeText={setLanguageSearch}
              autoCorrect={false}
            />
            {languageSearch.length > 0 && (
              <TouchableOpacity onPress={() => setLanguageSearch("")}>
                <X size={16} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
          <ScrollView
            style={{ maxHeight: 380 }}
            showsVerticalScrollIndicator={false}
          >
            {filteredLanguages.map((l: LanguageMeta) => {
              const isSelected = l.code === language;
              return (
                <TouchableOpacity
                  key={l.code}
                  onPress={() => handleSelectLanguage(l.code)}
                  style={[
                    styles.langOptionRow,
                    isSelected && styles.langOptionRowSelected,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={styles.langOptionFlag}>{l.flag}</Text>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text
                      style={[
                        styles.langOptionNative,
                        isSelected && styles.langOptionTextSelected,
                      ]}
                    >
                      {l.nativeName}
                    </Text>
                    <Text style={styles.langOptionSub}>
                      {l.name} • {l.region}
                    </Text>
                  </View>
                  {isSelected && (
                    <Check size={20} color="#2563EB" strokeWidth={2.5} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </AppBottomSheet>

        {/* ── Legal Policy Bottom Sheet ── */}
        <AppBottomSheet
          visible={legalModal !== null}
          onClose={() => setLegalModal(null)}
          maxHeight="75%"
          sheetStyle={{ paddingHorizontal: 20 }}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderTitle}>
              {legalModal === "terms" ? "Terms of Service" : "Privacy Policy"}
            </Text>
            <TouchableOpacity
              onPress={() => setLegalModal(null)}
              style={styles.modalCloseBtn}
            >
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={{ maxHeight: 360 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={{ fontSize: 13, color: "#4B5563", lineHeight: 20 }}>
              {legalModal === "terms"
                ? "Welcome to Sudoku King. By using our app, you agree to play fairly and enjoy brain-training puzzles. All puzzles, challenges, and graphics are protected intellectual property. Our app works 100% offline and stores your game progress locally on your device."
                : "Sudoku King respects your personal privacy. We do not sell your personal data. We use local device storage (MMKV) to save your solved puzzles, streaks, and settings."}
            </Text>
            <TouchableOpacity
              style={styles.openBrowserBtn}
              onPress={() => {
                const url =
                  legalModal === "terms"
                    ? APP_LINKS.TERMS_URL
                    : APP_LINKS.PRIVACY_URL;
                Linking.openURL(url).catch(() => {});
              }}
              activeOpacity={0.8}
            >
              <ExternalLink size={14} color="#1D4ED8" />
              <Text style={styles.openBrowserBtnText}>
                {legalModal === "terms"
                  ? "Read Full Terms on Website"
                  : "Read Full Privacy Policy on Website"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </AppBottomSheet>
      </AppGradientBackground>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  bannerGradient: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  // Image grid
  imageSection: {
    position: "relative",
    top: 0,
    left: 0,
    right: 0,
    overflow: "visible",
  },
  heroArtWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  heroArt: {
    width: 0,
    height: 0,
  },

  // Blur layers

  imageFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 10,
  },

  // Floating pills
  restoreButton: {},
  restorePill: {
    position: "absolute",
    right: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#111118",
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  restorePillText: { fontSize: 11, fontWeight: "700", color: "#E5E7EB" },

  langPill: {
    position: "absolute",
    left: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#111118",
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  langPillFlag: { fontSize: 13 },
  langPillText: { fontSize: 11, fontWeight: "700", color: "#E5E7EB" },

  // Bottom section
  bottomSection: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 22,
    // paddingTop:0,
    marginTop: 160,
  },
  headline: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    lineHeight: 35,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subheadline: {
    fontSize: 13,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 19,
    paddingHorizontal: 10,
    marginBottom: 16,
  },

  // CTA
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A0A0F",
    borderRadius: 40,
    paddingVertical: 17,
    width: "100%",
    marginBottom: 14,
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    flex: 1,
    textAlign: "center",
  },
  ctaArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 14,
  },

  // Legal
  legalNotice: {
    fontSize: 11.4,
    color: "#4B5563",
    paddingHorizontal: 7,
    textAlign: "center",
    lineHeight: 16,
    marginBottom: 4,
  },
  legalLink: {
    color: "#000000",
    textDecorationLine: "underline",
    fontWeight: "600",
  },

  // Modals
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginLeft: 8,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "BricolageGrotesque_400Regular",
    color: "#111827",
    marginLeft: 8,
    padding: 0,
  },
  langOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 4,
  },
  langOptionRowSelected: { backgroundColor: "#EFF6FF" },
  langOptionFlag: { fontSize: 22 },
  langOptionNative: { fontSize: 15, fontWeight: "700", color: "#1F2937" },
  langOptionTextSelected: { color: "#2563EB" },
  langOptionSub: { fontSize: 12, color: "#6B7280", marginTop: 1 },
  openBrowserBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  openBrowserBtnText: { fontSize: 13, fontWeight: "600", color: "#1D4ED8" },
});
