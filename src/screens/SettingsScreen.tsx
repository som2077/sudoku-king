import React, { useState, useMemo } from "react";
import { Text } from "../components/Text";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Linking,
  StyleSheet,
  Pressable,
  Switch,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  X,
  Crown,
  Mail,
  ExternalLink,
  ChevronRight,
  Search,
  Check,
} from "lucide-react-native";
import {
  FilledBell,
  FilledGraduationCap,
  FilledBookOpen,
  FilledMail,
  FilledFileText,
  FilledShield,
  FilledGlobe,
} from "../components/ui/FilledIcons";
import { useGameStore } from "../store/useGameStore";
import { useTranslation, LanguageMeta } from "../i18n";
import { haptics } from "../utils/haptics";
import { localNotificationScheduler } from "../services/localNotificationScheduler";
import { AppGradientBackground } from "../components/AppGradientBackground";
import { AppBottomSheet } from "../components/ui/AppBottomSheet";
import { APP_LINKS } from "../constants/links";

interface SettingsScreenProps {
  onOpenPaywall?: () => void;
  onRestorePurchases?: () => void;
  onOpenAwards?: () => void;
}

type ModalType = "how_to_play" | "rules" | "help" | "terms" | "privacy" | null;

export function SettingsScreen({
  onOpenPaywall,
}: SettingsScreenProps) {
  const insets = useSafeAreaInsets();
  const isPremium = useGameStore((state) => state.isPremium);
  const notificationsEnabled = useGameStore(
    (state) => state.settings?.notificationsEnabled ?? true
  );
  const updateSetting = useGameStore((state) => state.updateSetting);
  const { t, language, supportedLanguages } = useTranslation();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [languageSheetVisible, setLanguageSheetVisible] = useState(false);
  const [languageSearch, setLanguageSearch] = useState("");

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
        l.code.toLowerCase().includes(q)
    );
  }, [languageSearch, supportedLanguages]);

  const handleSelectLanguage = (code: string) => {
    haptics.selection();
    updateSetting("language", code);
    setLanguageSheetVisible(false);
    setLanguageSearch("");
  };

  const handleToggleNotifications = async (val: boolean) => {
    updateSetting("notificationsEnabled", val);
    try {
      if (val) {
        await localNotificationScheduler.scheduleDailyNotifications(true);
      } else {
        await localNotificationScheduler.cancelAllDailyNotifications();
      }
    } catch (err) {
      console.warn("⚠️ [Settings] Error toggling notification schedule:", err);
    }
  };

  const handleSupportEmail = async () => {
    try {
      const email = APP_LINKS.SUPPORT_EMAIL;
      const supported = await Linking.canOpenURL(email);
      if (supported) {
        await Linking.openURL(email);
      }
    } catch (err) {
      console.warn("⚠️ [Settings] Failed to open email client:", err);
    }
  };

  const handleOpenRules = async () => {
    try {
      const url = APP_LINKS.RULES_URL;
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(APP_LINKS.REFERENCE_RULES_URL);
      }
    } catch (err) {
      console.warn("⚠️ [Settings] Failed to open rules URL:", err);
      await Linking.openURL(APP_LINKS.REFERENCE_RULES_URL).catch(() => {});
    }
  };

  const handleOpenTerms = async () => {
    try {
      const url = APP_LINKS.TERMS_URL;
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        setActiveModal("terms");
      }
    } catch (err) {
      console.warn("⚠️ [Settings] Failed to open terms URL:", err);
      setActiveModal("terms");
    }
  };

  const handleOpenPrivacy = async () => {
    try {
      const url = APP_LINKS.PRIVACY_URL;
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        setActiveModal("privacy");
      }
    } catch (err) {
      console.warn("⚠️ [Settings] Failed to open privacy URL:", err);
      setActiveModal("privacy");
    }
  };

  return (
    <AppGradientBackground>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* ── Screen Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t("settings.title", "Settings")}</Text>
        </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. VIP Banner (Advanced Analysis / Upgrade Now) ── */}
        <TouchableOpacity
          style={styles.bannerWrapper}
          activeOpacity={0.9}
          onPress={onOpenPaywall}
          accessibilityRole="button"
          accessibilityLabel="Sudoku King VIP Upgrade"
        >
          <LinearGradient
            colors={["#1E1E24", "#26262E", "#16161B"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bannerGradient}
          >
            {/* Subtle background glow circle */}
            <View style={styles.bannerGlowCircle} />

            <View style={styles.bannerInner}>
              <View style={styles.bannerTitleRow}>
                {isPremium && <Crown size={20} color="#F59E0B" style={{ marginRight: 6 }} />}
                <Text style={styles.bannerTitle}>
                  {isPremium ? "Sudoku King VIP" : "Sudoku King VIP"}
                </Text>
              </View>

              <Text style={styles.bannerSubtitle}>
                {isPremium
                  ? "Ad-free experience & unlimited hints active."
                  : "Unlock unlimited hints and remove all ads."}
              </Text>

              <View style={styles.bannerBtn}>
                <Text style={styles.bannerBtnText}>
                  {isPremium ? "VIP Active 👑" : "Upgrade Now"}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* ── 2. Preferences Section (Notification Switch) ── */}
        <Text style={styles.sectionHeader}>
          {t("settings.preferences", "Preferences")}
        </Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <FilledBell size={20} color="#111827" />
              <Text style={styles.rowLabel}>
                {t("settings.notifications", "Notification")}
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: "#E2E8F0", true: "#18181B" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E2E8F0"
              accessibilityRole="switch"
              accessibilityLabel="Toggle notifications"
            />
          </View>

          <View style={styles.rowDivider} />

          {/* Language Selection */}
          <TouchableOpacity
            style={styles.row}
            onPress={() => setLanguageSheetVisible(true)}
            activeOpacity={0.65}
            accessibilityRole="button"
            accessibilityLabel={t("settings.language", "Language")}
          >
            <View style={styles.rowLeft}>
              <FilledGlobe size={20} color="#111827" />
              <Text style={styles.rowLabel}>
                {t("settings.language", "Language")}
              </Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.langValueText}>
                {currentLangMeta.flag} {currentLangMeta.nativeName}
              </Text>
              <ChevronRight size={18} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* ── 3. Guides & Rules Section ── */}
        <Text style={styles.sectionHeader}>
          {t("settings.rulesAndGuides", "Guides & Rules")}
        </Text>
        <View style={styles.card}>
          {/* How to Play */}
          <TouchableOpacity
            style={styles.row}
            onPress={() => setActiveModal("how_to_play")}
            activeOpacity={0.65}
            accessibilityRole="button"
            accessibilityLabel={t("settings.howToPlay", "How to Play")}
          >
            <View style={styles.rowLeft}>
              <FilledGraduationCap size={20} color="#111827" />
              <Text style={styles.rowLabel}>
                {t("settings.howToPlay", "How to Play")}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          {/* Rules */}
          <TouchableOpacity
            style={styles.row}
            onPress={handleOpenRules}
            activeOpacity={0.65}
            accessibilityRole="button"
            accessibilityLabel={t("settings.sudokuRules", "Rules")}
          >
            <View style={styles.rowLeft}>
              <FilledBookOpen size={20} color="#111827" />
              <Text style={styles.rowLabel}>
                {t("settings.sudokuRules", "Rules")}
              </Text>
            </View>
            <ExternalLink size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* ── 4. Support & Legal Section ── */}
        <Text style={styles.sectionHeader}>
          {t("settings.aboutAndLegal", "Support & Legal")}
        </Text>
        <View style={styles.card}>
          {/* Help */}
          <TouchableOpacity
            style={styles.row}
            onPress={() => setActiveModal("help")}
            activeOpacity={0.65}
            accessibilityRole="button"
            accessibilityLabel={t("settings.feedbackSupport", "Support & Help")}
          >
            <View style={styles.rowLeft}>
              <FilledMail size={20} color="#111827" />
              <Text style={styles.rowLabel}>
                {t("settings.feedbackSupport", "Support & Help")}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          {/* Terms of Services */}
          <TouchableOpacity
            style={styles.row}
            onPress={handleOpenTerms}
            activeOpacity={0.65}
            accessibilityRole="button"
            accessibilityLabel={t("settings.terms", "Terms and Conditions")}
          >
            <View style={styles.rowLeft}>
              <FilledFileText size={20} color="#111827" />
              <Text style={styles.rowLabel}>
                {t("settings.terms", "Terms and Conditions")}
              </Text>
            </View>
            <ExternalLink size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          {/* Privacy Policy */}
          <TouchableOpacity
            style={styles.row}
            onPress={handleOpenPrivacy}
            activeOpacity={0.65}
            accessibilityRole="button"
            accessibilityLabel={t("settings.privacy", "Privacy Policy")}
          >
            <View style={styles.rowLeft}>
              <FilledShield size={20} color="#111827" />
              <Text style={styles.rowLabel}>
                {t("settings.privacy", "Privacy Policy")}
              </Text>
            </View>
            <ExternalLink size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* ── 5. App Version & Info Card ── */}
        <TouchableOpacity
          style={styles.versionCard}
          activeOpacity={0.85}
          onPress={() => Linking.openURL(APP_LINKS.WEBSITE_HOME).catch(() => {})}
          accessibilityRole="button"
          accessibilityLabel="Sudoku King Version Information"
        >
          {/* Mini Sudoku Grid App Icon */}
          <View style={styles.versionIconContainer}>
            {/* Row 1: 1, 2, 3 */}
            <View style={styles.miniGridRow}>
              <View style={styles.miniGridCell}>
                <Text style={styles.miniGridNumDark}>1</Text>
              </View>
              <View style={styles.miniGridVLine} />
              <View style={styles.miniGridCell}>
                <Text style={styles.miniGridNumBlue}>2</Text>
              </View>
              <View style={styles.miniGridVLine} />
              <View style={styles.miniGridCell}>
                <Text style={styles.miniGridNumDark}>3</Text>
              </View>
            </View>

            <View style={styles.miniGridHLine} />

            {/* Row 2: 6, empty, 4 */}
            <View style={styles.miniGridRow}>
              <View style={styles.miniGridCell}>
                <Text style={styles.miniGridNumBlue}>6</Text>
              </View>
              <View style={styles.miniGridVLine} />
              <View style={styles.miniGridCell} />
              <View style={styles.miniGridVLine} />
              <View style={styles.miniGridCell}>
                <Text style={styles.miniGridNumDark}>4</Text>
              </View>
            </View>

            <View style={styles.miniGridHLine} />

            {/* Row 3: 7, 8, 9 */}
            <View style={styles.miniGridRow}>
              <View style={styles.miniGridCell}>
                <Text style={styles.miniGridNumBlue}>7</Text>
              </View>
              <View style={styles.miniGridVLine} />
              <View style={styles.miniGridCell}>
                <Text style={styles.miniGridNumDark}>8</Text>
              </View>
              <View style={styles.miniGridVLine} />
              <View style={styles.miniGridCell}>
                <Text style={styles.miniGridNumBlue}>9</Text>
              </View>
            </View>
          </View>

          {/* Details Column */}
          <View style={styles.versionInfoCol}>
            <Text style={styles.versionAppTitle}>Sudoku King - Puzzle Game</Text>
            <Text style={styles.versionNumberText}>Version 1.0.0</Text>
            <Text style={styles.versionCopyrightText}>© 2026 Sudoku King Ltd.</Text>
            <Text style={styles.versionCopyrightText}>All rights reserved.</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* Info & Content Bottom Sheet                                              */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      <AppBottomSheet
        visible={activeModal !== null}
        onClose={() => setActiveModal(null)}
        maxHeight="88%"
        sheetStyle={{ paddingHorizontal: 0 }}
      >
        {/* Modal Header */}
        <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>
                {activeModal === "how_to_play" && t("settings.howToPlay", "How to Play")}
                {activeModal === "rules" && t("settings.sudokuRules", "Sudoku Rules")}
                {activeModal === "help" && t("settings.feedbackSupport", "Help & Support")}
                {activeModal === "terms" && t("settings.terms", "Terms and Conditions")}
                {activeModal === "privacy" && t("settings.privacy", "Privacy Policy")}
              </Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setActiveModal(null)}
                activeOpacity={0.7}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <ScrollView
              style={styles.modalBody}
              contentContainerStyle={{ paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}
            >
              {/* How to Play Content */}
              {activeModal === "how_to_play" && (
                <View style={styles.stepContainer}>
                  <View style={styles.stepCard}>
                    <View style={styles.stepBadge}>
                      <Text style={styles.stepBadgeText}>1</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.stepTitle}>Grid Structure</Text>
                      <Text style={styles.stepDesc}>
                        Sudoku is played on a 9x9 grid divided into 9 smaller 3x3 boxes.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.stepCard}>
                    <View style={styles.stepBadge}>
                      <Text style={styles.stepBadgeText}>2</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.stepTitle}>Use Numbers 1 to 9</Text>
                      <Text style={styles.stepDesc}>
                        Every row, column, and 3x3 box must contain each digit from 1 to 9 exactly once.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.stepCard}>
                    <View style={styles.stepBadge}>
                      <Text style={styles.stepBadgeText}>3</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.stepTitle}>No Duplicates</Text>
                      <Text style={styles.stepDesc}>
                        No number can be repeated in any single row, column, or 3x3 block.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.stepCard}>
                    <View style={styles.stepBadge}>
                      <Text style={styles.stepBadgeText}>4</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.stepTitle}>Use Pencil Notes</Text>
                      <Text style={styles.stepDesc}>
                        Tap the Notes button to jot down potential candidates in empty cells.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.stepCard}>
                    <View style={styles.stepBadge}>
                      <Text style={styles.stepBadgeText}>5</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.stepTitle}>Logical Elimination</Text>
                      <Text style={styles.stepDesc}>
                        Use pure deduction. Never guess — every valid puzzle has a unique solution.
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Rules Content */}
              {activeModal === "rules" && (
                <View style={styles.rulesContainer}>
                  <View style={styles.ruleCard}>
                    <Text style={styles.ruleCardTitle}>Row Constraint</Text>
                    <Text style={styles.ruleCardDesc}>
                      Each of the 9 horizontal rows must contain all numbers from 1 to 9 without repetition.
                    </Text>
                  </View>

                  <View style={styles.ruleCard}>
                    <Text style={styles.ruleCardTitle}>Column Constraint</Text>
                    <Text style={styles.ruleCardDesc}>
                      Each of the 9 vertical columns must contain all numbers from 1 to 9 without repetition.
                    </Text>
                  </View>

                  <View style={styles.ruleCard}>
                    <Text style={styles.ruleCardTitle}>3x3 Box Constraint</Text>
                    <Text style={styles.ruleCardDesc}>
                      Each of the nine 3x3 non-overlapping subgrids must contain numbers 1 through 9.
                    </Text>
                  </View>

                  <View style={styles.ruleCard}>
                    <Text style={styles.ruleCardTitle}>Mistakes Limit</Text>
                    <Text style={styles.ruleCardDesc}>
                      Placing an incorrect digit counts as a mistake. Reaching 3 mistakes resets your current puzzle.
                    </Text>
                  </View>
                </View>
              )}

              {/* Help Content */}
              {activeModal === "help" && (
                <View>
                  <View style={styles.helpHeroCard}>
                    <Mail size={32} color="#166534" />
                    <Text style={styles.helpHeroTitle}>Need Support?</Text>
                    <Text style={styles.helpHeroDesc}>
                      Have questions, feedback, or encountered a bug? Our team is always here to assist you.
                    </Text>
                    <TouchableOpacity
                      style={styles.helpEmailBtn}
                      onPress={handleSupportEmail}
                      activeOpacity={0.8}
                    >
                      <Mail size={16} color="#FFFFFF" />
                      <Text style={styles.helpEmailBtnText}>Contact Support Email</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.rulesContainer}>
                    <View style={styles.ruleCard}>
                      <Text style={styles.ruleCardTitle}>How do Hints work?</Text>
                      <Text style={styles.ruleCardDesc}>
                        Hints reveal the correct number for the selected cell. VIP subscribers receive unlimited hints.
                      </Text>
                    </View>

                    <View style={styles.ruleCard}>
                      <Text style={styles.ruleCardTitle}>Can I play offline?</Text>
                      <Text style={styles.ruleCardDesc}>
                        Yes! All classic puzzles and daily challenges can be played without an active internet connection.
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Terms of Services Content */}
              {activeModal === "terms" && (
                <View style={styles.legalContainer}>
                  <Text style={styles.legalHeading}>1. Acceptance of Terms</Text>
                  <Text style={styles.legalText}>
                    By downloading or using Sudoku King, you agree to be bound by these Terms of Service. If you do not agree, please do not use the application.
                  </Text>

                  <Text style={styles.legalHeading}>2. License & Fair Use</Text>
                  <Text style={styles.legalText}>
                    Sudoku King grants you a personal, non-transferable, non-exclusive license to play the game for personal entertainment purposes.
                  </Text>

                  <Text style={styles.legalHeading}>3. In-App Purchases & VIP Subscription</Text>
                  <Text style={styles.legalText}>
                    Subscriptions and in-app purchases are billed through Google Play / Apple App Store according to store policies. Subscriptions automatically renew unless cancelled at least 24 hours prior to the billing period end.
                  </Text>

                  <Text style={styles.legalHeading}>4. Changes to Terms</Text>
                  <Text style={styles.legalText}>
                    We reserve the right to modify these terms at any time. Continued use of the app signifies acceptance of updated terms.
                  </Text>
                </View>
              )}

              {/* Privacy Policy Content */}
              {activeModal === "privacy" && (
                <View style={styles.legalContainer}>
                  <Text style={styles.legalHeading}>1. Information Collection</Text>
                  <Text style={styles.legalText}>
                    Sudoku King does not collect personal identification data such as names or phone numbers. Anonymous gameplay statistics and crash diagnostics are stored securely via Firebase Crashlytics to improve app stability.
                  </Text>

                  <Text style={styles.legalHeading}>2. Advertising & Analytics</Text>
                  <Text style={styles.legalText}>
                    Non-VIP players may see ads served via Google AdMob, which may use anonymized device identifiers in accordance with Google Play policies.
                  </Text>

                  <Text style={styles.legalHeading}>3. Data Storage</Text>
                  <Text style={styles.legalText}>
                    Game progress, streak counters, and puzzle records are stored locally on your device using high-speed MMKV secure storage.
                  </Text>

                  <Text style={styles.legalHeading}>4. Contact Us</Text>
                  <Text style={styles.legalText}>
                    If you have privacy questions or requests, please reach out to us at privacy@sudokuking.app.
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* Done Button */}
            <TouchableOpacity
              style={styles.modalDoneBtn}
              onPress={() => setActiveModal(null)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalDoneBtnText}>Done</Text>
            </TouchableOpacity>
          </AppBottomSheet>

          {/* ── Language Bottom Sheet ── */}
          <AppBottomSheet
            visible={languageSheetVisible}
            onClose={() => {
              setLanguageSheetVisible(false);
              setLanguageSearch("");
            }}
            maxHeight="75%"
            sheetStyle={{ paddingHorizontal: 20 }}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>
                {t("settings.language", "Language")}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setLanguageSheetVisible(false);
                  setLanguageSearch("");
                }}
                style={styles.modalCloseBtn}
                accessibilityRole="button"
                accessibilityLabel="Close language selector"
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

            {/* Language Options List */}
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
        </View>
    </AppGradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.6,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
  },

  /* ── 1. VIP Banner ── */
  bannerWrapper: {
    borderRadius: 22,
    overflow: "hidden",
    marginTop: 4,
    marginBottom: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  bannerGradient: {
    paddingVertical: 22,
    paddingHorizontal: 20,
    position: "relative",
    overflow: "hidden",
  },
  bannerGlowCircle: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  bannerInner: {
    alignItems: "center",
  },
  bannerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.82)",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  bannerBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 32,
    alignSelf: "center",
    marginTop: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  bannerBtnText: {
    color: "#18181B",
    fontSize: 14,
    fontWeight: "700",
  },

  /* ── Section Header ── */
  sectionHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 4,
  },

  /* ── Cards & Rows ── */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EEF0F3",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 54,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#F3F4F6",
    marginLeft: 50,
  },

  /* ── Version Info Card ── */
  versionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EEF0F3",
    padding: 16,
    marginTop: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
    gap: 14,
  },
  versionIconContainer: {
    width: 54,
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    justifyContent: "space-evenly",
    padding: 2,
  },
  miniGridRow: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  miniGridCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  miniGridVLine: {
    width: 1,
    height: "100%",
    backgroundColor: "#E5E7EB",
  },
  miniGridHLine: {
    height: 1,
    width: "100%",
    backgroundColor: "#E5E7EB",
  },
  miniGridNumDark: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },
  miniGridNumBlue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
  },
  versionInfoCol: {
    flex: 1,
    justifyContent: "center",
  },
  versionAppTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  versionNumberText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 3,
  },
  versionCopyrightText: {
    fontSize: 11,
    fontWeight: "400",
    color: "#9CA3AF",
    lineHeight: 15,
  },

  /* ── Modals ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    flex: 1,
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E2E8F0",
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  modalDoneBtn: {
    backgroundColor: "#18181B",
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  modalDoneBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  stepContainer: {
    gap: 12,
  },
  stepCard: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 12,
    alignItems: "flex-start",
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#18181B",
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },
  rulesContainer: {
    gap: 12,
  },
  ruleCard: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
  },
  ruleCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  ruleCardDesc: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },
  helpHeroCard: {
    backgroundColor: "#F0FDF4",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCFCE7",
    alignItems: "center",
    marginBottom: 14,
  },
  helpHeroTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#166534",
    marginTop: 8,
    marginBottom: 4,
  },
  helpHeroDesc: {
    fontSize: 13,
    color: "#15803D",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 14,
  },
  helpEmailBtn: {
    backgroundColor: "#22C55E",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  helpEmailBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  legalContainer: {
    gap: 10,
  },
  legalHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 6,
  },
  legalText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  langValueText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
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
