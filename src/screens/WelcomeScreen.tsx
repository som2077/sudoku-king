import React, { useState, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import { Text } from "../components/Text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  Crown,
  Sparkles,
  ArrowRight,
  Globe,
  Check,
  X,
  Search,
  Scan,
} from "lucide-react-native";
import { useTranslation, SUPPORTED_LANGUAGES, LanguageMeta } from "../i18n";
import { useGameStore } from "../store/useGameStore";

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onQuickPlay?: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const { t, language, supportedLanguages } = useTranslation();
  const updateSetting = useGameStore((s) => s.updateSetting);
  const { height: SCREEN_HEIGHT } = useWindowDimensions();

  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [languageSearch, setLanguageSearch] = useState("");
  const [legalModal, setLegalModal] = useState<"terms" | "privacy" | null>(
    null,
  );

  const currentLangMeta = useMemo(() => {
    return (
      supportedLanguages.find((l) => l.code === language) ||
      supportedLanguages[0]
    );
  }, [language, supportedLanguages]);

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
    updateSetting("language", code);
    setLanguageModalVisible(false);
    setLanguageSearch("");
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#DDDCEA", "#FFFFFF99"]}
        locations={[0, 0.2]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* ── Top Bar: Logo & Language Selector ── */}
      <View style={styles.topBar}>
        <Image
          source={require("../../assets/sudukoLogo.svg")}
          style={{ width: 140, height: 40 }}
          contentFit="contain"
        />

        <TouchableOpacity
          onPress={() => setLanguageModalVisible(true)}
          style={styles.langPickerButton}
          activeOpacity={0.7}
        >
          <Globe size={15} color="#4B5563" />
          <Text style={styles.langPickerFlag}>{currentLangMeta.flag}</Text>
          <Text style={styles.langPickerText}>
            {currentLangMeta.nativeName}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Main Content Area ── */}
      <View style={styles.centerContainer}>
        {/* Mock Device Frame Visual (Inspiration 1 Style) */}
        <View style={[styles.deviceFrame, { maxHeight: SCREEN_HEIGHT * 0.42 }]}>
          <LinearGradient
            colors={["#1E293B", "#0F172A"]}
            style={styles.mockScreenBackground}
          >
            {/* Top Mock Header */}
            <View style={styles.mockHeader}>
              <View style={styles.mockCircleButton}>
                <Crown size={16} color="#F59E0B" />
              </View>
              <Image
                source={require("../../assets/sudukoLogo.svg")}
                style={styles.mockLogo}
                contentFit="contain"
              />
              <View style={{ width: 28 }} />
            </View>

            {/* Mock Sudoku Grid Visual */}
            <View style={styles.gridPreviewCard}>
              <View style={styles.gridRow}>
                <View style={[styles.gridCell, styles.cellFilled]}>
                  <Text style={styles.cellTextFilled}>5</Text>
                </View>
                <View style={styles.gridCell}>
                  <Text style={styles.cellText}>3</Text>
                </View>
                <View style={[styles.gridCell, styles.cellEmpty]} />
                <View style={styles.gridCell}>
                  <Text style={styles.cellText}>7</Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.gridCell}>
                  <Text style={styles.cellText}>6</Text>
                </View>
                <View style={[styles.gridCell, styles.cellHighlight]}>
                  <Text style={styles.cellTextHighlight}>9</Text>
                </View>
                <View style={styles.gridCell}>
                  <Text style={styles.cellText}>1</Text>
                </View>
                <View style={[styles.gridCell, styles.cellEmpty]} />
              </View>
              <View style={styles.gridRow}>
                <View style={[styles.gridCell, styles.cellEmpty]} />
                <View style={styles.gridCell}>
                  <Text style={styles.cellText}>8</Text>
                </View>
                <View style={[styles.gridCell, styles.cellFilled]}>
                  <Text style={styles.cellTextFilled}>4</Text>
                </View>
                <View style={styles.gridCell}>
                  <Text style={styles.cellText}>2</Text>
                </View>
              </View>
            </View>

            {/* Scanning / Logic Frame Corner Accents */}
            <View style={[styles.cornerBracket, styles.cornerTopLeft]} />
            <View style={[styles.cornerBracket, styles.cornerTopRight]} />
            <View style={[styles.cornerBracket, styles.cornerBottomLeft]} />
            <View style={[styles.cornerBracket, styles.cornerBottomRight]} />
          </LinearGradient>

          {/* Soft Bottom Fade Overlay */}
          <LinearGradient
            colors={["transparent", "rgba(255,255,255,0.7)", "#FFFFFF"]}
            style={styles.fadeOverlay}
          />
        </View>

        {/* ── Punchy Headline & Subheading ── */}
        <Text style={styles.headline}>
          {t("welcome.title", "Play Classic Sudoku,\nSharpen Your Mind")}
        </Text>
        <Text style={styles.subheadline}>
          {t(
            "welcome.subtitle",
            "10,000+ hand-crafted logic puzzles to train focus, memory & daily cognitive fitness.",
          )}
        </Text>
      </View>

      {/* ── Bottom Action CTAs (Inspiration 1 Style) ── */}
      <View style={styles.bottomSection}>
        {/* Get Started (Primary High-Contrast Pill) */}
        <TouchableOpacity
          onPress={onGetStarted}
          style={styles.darkPrimaryButton}
          activeOpacity={0.8}
        >
          <Text style={styles.darkPrimaryButtonText}>
            {t("welcome.getStarted", "Get Started (Personalize)")}
          </Text>
          <ArrowRight size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
        </TouchableOpacity>

        {/* Terms & Privacy Notice */}
        <Text style={styles.legalNotice}>
          By continuing, you accept our{" "}
          <Text style={styles.legalLink} onPress={() => setLegalModal("terms")}>
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

      {/* ── Language Switcher Modal ── */}
      <Modal
        visible={languageModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setLanguageModalVisible(false)}
          />
          <View style={styles.modalCard}>
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

            {/* Search Input */}
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

            {/* Language List */}
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
          </View>
        </View>
      </Modal>

      {/* ── Legal Policy Modal ── */}
      <Modal
        visible={legalModal !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLegalModal(null)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setLegalModal(null)}
          />
          <View style={styles.modalCard}>
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
                  : "Sudoku King respects your personal privacy. We do not sell your personal data. We use local device storage (MMKV) to save your solved puzzles, streaks, and settings. Standard crash analytics and non-personalized advertising services adhere to Google Play policies."}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
      </SafeAreaView>
    </View>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Stylesheet (Clean Modern Aesthetic Inspired by Screenshot 1)
// ────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
  },
  langPickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  langPickerFlag: {
    fontSize: 14,
  },
  langPickerText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },
  centerContainer: {
    alignItems: "center",
    paddingHorizontal: 24,
    flex: 1,
    justifyContent: "center",
  },
  deviceFrame: {
    width: "84%",
    aspectRatio: 0.95,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    backgroundColor: "#0F172A",
    marginBottom: 22,
  },
  mockScreenBackground: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  mockHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
  },
  mockCircleButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  mockLogo: {
    width: 100,
    height: 24,
  },
  gridPreviewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 8,
    width: 150,
    height: 120,
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  gridCell: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  cellFilled: {
    backgroundColor: "#2563EB",
  },
  cellTextFilled: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  cellHighlight: {
    backgroundColor: "#FEF08A",
  },
  cellTextHighlight: {
    color: "#854D0E",
    fontSize: 13,
    fontWeight: "800",
  },
  cellEmpty: {
    backgroundColor: "#E5E7EB",
    opacity: 0.4,
  },
  cellText: {
    color: "#1F2937",
    fontSize: 13,
    fontWeight: "700",
  },
  cornerBracket: {
    position: "absolute",
    width: 24,
    height: 24,
    borderColor: "#38BDF8",
  },
  cornerTopLeft: {
    top: 24,
    left: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 6,
  },
  cornerTopRight: {
    top: 24,
    right: 24,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 6,
  },
  cornerBottomLeft: {
    bottom: 24,
    left: 24,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 6,
  },
  cornerBottomRight: {
    bottom: 24,
    right: 24,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 6,
  },
  fadeOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
  },
  headline: {
    fontSize: 27,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    lineHeight: 34,
    marginBottom: 8,
  },
  subheadline: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 19,
    paddingHorizontal: 12,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 10,
    width: "100%",
    alignItems: "center",
  },
  darkPrimaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
    borderRadius: 18,
    paddingVertical: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 14,
  },
  darkPrimaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  legalNotice: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 16,
    paddingHorizontal: 16,
  },
  legalLink: {
    color: "#4B5563",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    flex: 1,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
  },
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
  langOptionRowSelected: {
    backgroundColor: "#EFF6FF",
  },
  langOptionFlag: {
    fontSize: 22,
  },
  langOptionNative: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },
  langOptionTextSelected: {
    color: "#2563EB",
  },
  langOptionSub: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 1,
  },
});
