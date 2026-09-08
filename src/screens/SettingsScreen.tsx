import React, { useState, useMemo } from "react";
import { Text } from "../components/Text";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Vibration,
  Alert,
  Modal,
  Linking,
  StyleSheet,
  Pressable,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ChevronRight,
  HelpCircle,
  BookOpen,
  ShieldCheck,
  FileText,
  Volume2,
  Vibrate,
  Bell,
  Crown,
  RotateCcw,
  Mail,
  X,
  Globe,
  Check,
  Search,
  Sparkles,
} from "lucide-react-native";
import { useGameStore, GameSettings } from "../store/useGameStore";
import { useTranslation, SUPPORTED_LANGUAGES, LanguageMeta } from "../i18n";
import { localNotificationScheduler } from "../services/localNotificationScheduler";
import { notificationService } from "../services/notificationService";

interface SettingsScreenProps {
  onOpenPaywall?: () => void;
  onRestorePurchases?: () => void;
}

type ModalType = "how_to_play" | "rules" | "privacy" | "terms" | null;

export function SettingsScreen({ onOpenPaywall, onRestorePurchases }: SettingsScreenProps) {
  const insets = useSafeAreaInsets();
  const isPremium = useGameStore((state) => state.isPremium);
  const settings = useGameStore((state) => state.settings);
  const updateSetting = useGameStore((state) => state.updateSetting);
  const resetAllStats = useGameStore((state) => state.resetAllStats);
  const resetOnboarding = useGameStore((state) => state.resetOnboarding);
  const resetWelcome = useGameStore((state) => state.resetWelcome);

  const { t, language, supportedLanguages } = useTranslation();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [languageSearchQuery, setLanguageSearchQuery] = useState("");

  const currentLangMeta = useMemo(() => {
    return (
      supportedLanguages.find((l) => l.code === language) ||
      supportedLanguages[0]
    );
  }, [language, supportedLanguages]);

  const filteredLanguages = useMemo(() => {
    const q = languageSearchQuery.trim().toLowerCase();
    if (!q) return supportedLanguages;
    return supportedLanguages.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.region.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [languageSearchQuery, supportedLanguages]);

  const handleToggle = <K extends keyof GameSettings>(
    key: K,
    val: GameSettings[K]
  ) => {
    updateSetting(key, val);
    if (key === "vibrationEnabled" && val) {
      Vibration.vibrate(40);
    }
  };

  const handleNotificationToggle = async (val: boolean) => {
    handleToggle("notificationsEnabled", val);
    if (val) {
      const granted = await notificationService.requestUserPermission();
      if (granted) {
        await localNotificationScheduler.scheduleDailyNotifications(true);
      }
    } else {
      await localNotificationScheduler.cancelAllDailyNotifications();
    }
  };

  const handleResetStats = () => {
    Alert.alert(
      t('settings.resetConfirmTitle'),
      t('settings.resetConfirmMessage'),
      [
        { text: t('game.cancel'), style: "cancel" },
        {
          text: t('settings.resetStats'),
          style: "destructive",
          onPress: () => {
            resetAllStats();
            Alert.alert(t('settings.resetCompleteTitle'), t('settings.resetCompleteMessage'));
          },
        },
      ]
    );
  };

  const handleSupportEmail = async () => {
    const email = "mailto:support@sudokuking.app?subject=Sudoku King Feedback";
    const supported = await Linking.canOpenURL(email);
    if (supported) {
      Linking.openURL(email);
    } else {
      Alert.alert(
        t('settings.feedbackSupport'),
        "Please send your inquiries or feedback to support@sudokuking.app"
      );
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {/* ── Screen Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('settings.subtitle')}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── VIP CARD ── */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: isPremium ? "#FEF9C3" : "#1E293B",
              padding: 16,
              borderWidth: 1,
              borderColor: isPremium ? "#FDE047" : "#334155",
              marginBottom: 20,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                marginRight: 10,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: isPremium ? "#FEF08A" : "#334155",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Crown size={22} color={isPremium ? "#CA8A04" : "#FBBF24"} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: isPremium ? "#854D0E" : "#FFFFFF",
                  }}
                >
                  {isPremium ? "Sudoku King VIP" : "Sudoku King Unlimited"}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: isPremium ? "#A16207" : "#94A3B8",
                    marginTop: 2,
                  }}
                >
                  {isPremium
                    ? "Lifetime Ad-Free & Infinite Hints Active 👑"
                    : "No Ads • Unlimited Hints • Lifetime"}
                </Text>
              </View>
            </View>
            {!isPremium && (
              <TouchableOpacity
                onPress={onOpenPaywall}
                style={{
                  backgroundColor: "#FBBF24",
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 12,
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={{
                    color: "#78350F",
                    fontWeight: "bold",
                    fontSize: 13,
                  }}
                >
                  Unlock
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── SECTION: LANGUAGE ── */}
        <Text style={styles.sectionHeader}>{t('settings.language')}</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.clickableRow}
            onPress={() => setLanguageModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: "#EFF6FF" }]}>
              <Globe size={20} color="#2563EB" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>{currentLangMeta.nativeName}</Text>
              <Text style={styles.rowSubtitle}>
                {currentLangMeta.name} • {currentLangMeta.region}
              </Text>
            </View>
            <View style={styles.langRightBadge}>
              <Text style={styles.langFlagText}>{currentLangMeta.flag}</Text>
              <ChevronRight size={18} color="#D1D5DB" />
            </View>
          </TouchableOpacity>
        </View>

        {/* ── SECTION 1: PREFERENCES ── */}
        <Text style={styles.sectionHeader}>{t('settings.preferences')}</Text>
        <View style={styles.card}>
          {/* Notifications */}
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: "#EEF2FF" }]}>
              <Bell size={20} color="#4F46E5" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>{t('settings.notifications')}</Text>
              <Text style={styles.rowSubtitle}>{t('settings.notificationsDesc')}</Text>
            </View>
            <Switch
              value={settings?.notificationsEnabled ?? true}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: "#E5E7EB", true: "#A5B4FC" }}
              thumbColor={settings?.notificationsEnabled ?? true ? "#4F46E5" : "#F9FAFB"}
            />
          </View>

          <View style={styles.separator} />

          {/* Sound */}
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: "#EFF6FF" }]}>
              <Volume2 size={20} color="#2563EB" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>{t('settings.sound')}</Text>
              <Text style={styles.rowSubtitle}>{t('settings.soundDesc')}</Text>
            </View>
            <Switch
              value={settings?.soundEnabled ?? true}
              onValueChange={(val) => handleToggle("soundEnabled", val)}
              trackColor={{ false: "#E5E7EB", true: "#93C5FD" }}
              thumbColor={settings?.soundEnabled ?? true ? "#2563EB" : "#F9FAFB"}
            />
          </View>

          <View style={styles.separator} />

          {/* Vibration */}
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: "#F3E8FF" }]}>
              <Vibrate size={20} color="#7C3AED" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>{t('settings.vibration')}</Text>
              <Text style={styles.rowSubtitle}>{t('settings.vibrationDesc')}</Text>
            </View>
            <Switch
              value={settings?.vibrationEnabled ?? true}
              onValueChange={(val) => handleToggle("vibrationEnabled", val)}
              trackColor={{ false: "#E5E7EB", true: "#C4B5FD" }}
              thumbColor={settings?.vibrationEnabled ?? true ? "#7C3AED" : "#F9FAFB"}
            />
          </View>
        </View>

        {/* ── SECTION 2: GAME DATA ── */}
        <Text style={styles.sectionHeader}>{t('settings.gameData')}</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.clickableRow}
            onPress={handleResetStats}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: "#FEE2E2" }]}>
              <RotateCcw size={20} color="#DC2626" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={[styles.rowTitle, { color: "#DC2626" }]}>
                {t('settings.resetStats')}
              </Text>
              <Text style={styles.rowSubtitle}>
                {t('settings.resetStatsDesc')}
              </Text>
            </View>
            <ChevronRight size={18} color="#D1D5DB" />
          </TouchableOpacity>
        </View>

        {/* ── SECTION 3: RULES & GUIDES ── */}
        <Text style={styles.sectionHeader}>{t('settings.rulesAndGuides')}</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.clickableRow}
            onPress={() => setActiveModal("how_to_play")}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: "#EEF2FF" }]}>
              <HelpCircle size={20} color="#4F46E5" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>{t('settings.howToPlay')}</Text>
              <Text style={styles.rowSubtitle}>{t('settings.howToPlayDesc')}</Text>
            </View>
            <ChevronRight size={18} color="#D1D5DB" />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.clickableRow}
            onPress={() => setActiveModal("rules")}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: "#CCFBF1" }]}>
              <BookOpen size={20} color="#0D9488" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>{t('settings.sudokuRules')}</Text>
              <Text style={styles.rowSubtitle}>{t('settings.sudokuRulesDesc')}</Text>
            </View>
            <ChevronRight size={18} color="#D1D5DB" />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.clickableRow}
            onPress={() => {
              Alert.alert(
                t('settings.replayOnboarding', 'Replay Onboarding Guide'),
                'Would you like to view the introduction walkthrough again?',
                [
                  { text: t('game.cancel', 'Cancel'), style: 'cancel' },
                  {
                    text: 'Replay',
                    onPress: () => resetWelcome(),
                  },
                ]
              );
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: "#FEF3C7" }]}>
              <Sparkles size={20} color="#D97706" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>{t('settings.replayOnboarding', 'Replay Onboarding Guide')}</Text>
              <Text style={styles.rowSubtitle}>{t('settings.replayOnboardingDesc', 'Review intro tutorial and game features')}</Text>
            </View>
            <ChevronRight size={18} color="#D1D5DB" />
          </TouchableOpacity>
        </View>

        {/* ── SECTION 4: ABOUT & LEGAL ── */}
        <Text style={styles.sectionHeader}>{t('settings.aboutAndLegal')}</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.clickableRow}
            onPress={handleSupportEmail}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: "#EFF6FF" }]}>
              <Mail size={20} color="#2563EB" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>{t('settings.feedbackSupport')}</Text>
              <Text style={styles.rowSubtitle}>{t('settings.feedbackSupportDesc')}</Text>
            </View>
            <ChevronRight size={18} color="#D1D5DB" />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.clickableRow}
            onPress={() => setActiveModal("terms")}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: "#F3F4F6" }]}>
              <FileText size={20} color="#4B5563" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>{t('settings.terms')}</Text>
            </View>
            <ChevronRight size={18} color="#D1D5DB" />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.clickableRow}
            onPress={() => setActiveModal("privacy")}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: "#DCFCE7" }]}>
              <ShieldCheck size={20} color="#16A34A" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>{t('settings.privacy')}</Text>
            </View>
            <ChevronRight size={18} color="#D1D5DB" />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.clickableRow}
            onPress={onRestorePurchases}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: "#FEF3C7" }]}>
              <RotateCcw size={20} color="#D97706" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>Restore Purchases</Text>
              <Text style={styles.rowSubtitle}>Restore previously unlocked VIP access</Text>
            </View>
            <ChevronRight size={18} color="#D1D5DB" />
          </TouchableOpacity>
        </View>

        {/* ── App Version Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerVersion}>Sudoku King v1.0.0</Text>
          <Text style={styles.footerTagline}>Pure logic, offline ready & brain-training</Text>
        </View>
      </ScrollView>

      {/* ── Interactive Modals ── */}
      <Modal
        visible={activeModal !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setActiveModal(null)}
          />
          <View style={styles.modalCard}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>
                {activeModal === "how_to_play" && t('settings.howToPlay')}
                {activeModal === "rules" && t('settings.sudokuRules')}
                {activeModal === "privacy" && t('settings.privacy')}
                {activeModal === "terms" && t('settings.terms')}
              </Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setActiveModal(null)}
                activeOpacity={0.7}
              >
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              {activeModal === "how_to_play" && (
                <View style={styles.guideContainer}>
                  <View style={styles.guideStep}>
                    <View style={styles.stepNumPill}>
                      <Text style={styles.stepNumText}>1</Text>
                    </View>
                    <View style={styles.stepTextCol}>
                      <Text style={styles.stepTitle}>Understand the 9×9 Grid</Text>
                      <Text style={styles.stepDesc}>
                        The board consists of 81 cells divided into 9 rows, 9 columns, and 9 larger 3×3 sub-grids.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.guideStep}>
                    <View style={styles.stepNumPill}>
                      <Text style={styles.stepNumText}>2</Text>
                    </View>
                    <View style={styles.stepTextCol}>
                      <Text style={styles.stepTitle}>Fill Numbers 1 to 9</Text>
                      <Text style={styles.stepDesc}>
                        Every row, column, and 3×3 square must contain each digit from 1 to 9 once.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.guideStep}>
                    <View style={styles.stepNumPill}>
                      <Text style={styles.stepNumText}>3</Text>
                    </View>
                    <View style={styles.stepTextCol}>
                      <Text style={styles.stepTitle}>No Duplicate Digits</Text>
                      <Text style={styles.stepDesc}>
                        No number can appear more than once in the same row, column, or 3×3 box.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.guideStep}>
                    <View style={styles.stepNumPill}>
                      <Text style={styles.stepNumText}>4</Text>
                    </View>
                    <View style={styles.stepTextCol}>
                      <Text style={styles.stepTitle}>Use Notes (✏️)</Text>
                      <Text style={styles.stepDesc}>
                        Turn on pencil mode to write candidate possibilities in empty cells to systematically eliminate choices.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.guideStep}>
                    <View style={styles.stepNumPill}>
                      <Text style={styles.stepNumText}>5</Text>
                    </View>
                    <View style={styles.stepTextCol}>
                      <Text style={styles.stepTitle}>Watch Your Mistakes</Text>
                      <Text style={styles.stepDesc}>
                        Placing an incorrect digit counts as 1 mistake. Reaching 3 mistakes ends the round!
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {activeModal === "rules" && (
                <View style={styles.rulesContainer}>
                  <View style={styles.ruleCard}>
                    <Text style={styles.ruleCardTitle}>1. Row Rule</Text>
                    <Text style={styles.ruleCardDesc}>
                      Every single horizontal row must contain all numbers from 1 to 9 without omitting or repeating any digit.
                    </Text>
                  </View>

                  <View style={styles.ruleCard}>
                    <Text style={styles.ruleCardTitle}>2. Column Rule</Text>
                    <Text style={styles.ruleCardDesc}>
                      Every vertical column must contain all numbers from 1 to 9 without duplicates.
                    </Text>
                  </View>

                  <View style={styles.ruleCard}>
                    <Text style={styles.ruleCardTitle}>3. 3×3 Block Rule</Text>
                    <Text style={styles.ruleCardDesc}>
                      Every delineated 3×3 square box must contain numbers 1 to 9 with no repetitions.
                    </Text>
                  </View>

                  <View style={styles.ruleCard}>
                    <Text style={styles.ruleCardTitle}>Logical Deduction Only</Text>
                    <Text style={styles.ruleCardDesc}>
                      Every puzzle generated in Sudoku King has a guaranteed unique solution that can be solved purely through logic without guessing.
                    </Text>
                  </View>
                </View>
              )}

              {activeModal === "privacy" && (
                <View style={styles.legalContainer}>
                  <Text style={styles.legalHeading}>Privacy Commitment</Text>
                  <Text style={styles.legalText}>
                    Sudoku King values your privacy above all. Your gameplay data, puzzle progress, notes, streaks, and statistics are stored locally on your device via secure offline storage.
                  </Text>
                  <Text style={styles.legalHeading}>Data Collection</Text>
                  <Text style={styles.legalText}>
                    We do not collect personal identifying information (PII). Anonymous telemetry may be collected strictly for crash diagnostics and app stability improvements.
                  </Text>
                  <Text style={styles.legalHeading}>Third-Party Services</Text>
                  <Text style={styles.legalText}>
                    Optional ads and in-app purchases use official industry-standard SDKs (Google AdMob, RevenueCat) adhering to Google Play policies.
                  </Text>
                </View>
              )}

              {activeModal === "terms" && (
                <View style={styles.legalContainer}>
                  <Text style={styles.legalHeading}>1. Acceptance of Terms</Text>
                  <Text style={styles.legalText}>
                    By installing and playing Sudoku King, you agree to these Terms of Service.
                  </Text>
                  <Text style={styles.legalHeading}>2. Fair Use & License</Text>
                  <Text style={styles.legalText}>
                    Sudoku King is provided for personal, non-commercial entertainment and brain training. You may not reverse-engineer, redistribute, or exploit puzzle assets.
                  </Text>
                  <Text style={styles.legalHeading}>3. Subscriptions & Restores</Text>
                  <Text style={styles.legalText}>
                    Premium purchases are managed securely via your Google Play account. You may restore previous purchases at any time via Settings.
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* Modal Bottom Button */}
            <TouchableOpacity
              style={styles.modalDoneBtn}
              onPress={() => setActiveModal(null)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalDoneText}>{t('game.done')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Language Selection Modal ── */}
      <Modal
        visible={languageModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setLanguageModalVisible(false);
          setLanguageSearchQuery("");
        }}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => {
              setLanguageModalVisible(false);
              setLanguageSearchQuery("");
            }}
          />
          <View style={[styles.modalCard, styles.langModalCard]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <View style={[styles.iconBoxSmall, { backgroundColor: "#EFF6FF" }]}>
                  <Globe size={18} color="#2563EB" />
                </View>
                <Text style={styles.modalHeaderTitle}>{t('settings.language')}</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => {
                  setLanguageModalVisible(false);
                  setLanguageSearchQuery("");
                }}
                activeOpacity={0.7}
              >
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Search Input Bar */}
            <View style={styles.searchBarContainer}>
              <Search size={18} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                placeholder={t('settings.searchLanguage')}
                placeholderTextColor="#9CA3AF"
                value={languageSearchQuery}
                onChangeText={setLanguageSearchQuery}
                autoCorrect={false}
                autoCapitalize="none"
              />
              {languageSearchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setLanguageSearchQuery("")}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <X size={16} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>

            {/* Language List */}
            <ScrollView
              style={styles.langListScroll}
              contentContainerStyle={styles.langListContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {filteredLanguages.map((item) => {
                const isSelected = item.code === language;
                return (
                  <TouchableOpacity
                    key={item.code}
                    style={[
                      styles.langItem,
                      isSelected && styles.langItemSelected,
                    ]}
                    onPress={() => {
                      updateSetting("language", item.code as any);
                      if (settings?.vibrationEnabled) {
                        Vibration.vibrate(30);
                      }
                      setLanguageModalVisible(false);
                      setLanguageSearchQuery("");
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.langFlagLarge}>{item.flag}</Text>
                    <View style={styles.langItemInfo}>
                      <View style={styles.langItemTopRow}>
                        <Text
                          style={[
                            styles.langNativeText,
                            isSelected && styles.langNativeTextSelected,
                          ]}
                        >
                          {item.nativeName}
                        </Text>
                        <View
                          style={[
                            styles.tierBadge,
                            item.priority === "Tier 1"
                              ? styles.tier1Badge
                              : styles.tier2Badge,
                          ]}
                        >
                          <Text
                            style={[
                              styles.tierBadgeText,
                              item.priority === "Tier 1"
                                ? styles.tier1BadgeText
                                : styles.tier2BadgeText,
                            ]}
                          >
                            {item.priority}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.langEnglishText}>
                        {item.name} • {item.region}
                      </Text>
                    </View>

                    {isSelected ? (
                      <View style={styles.langCheckCircle}>
                        <Check size={14} color="#FFFFFF" strokeWidth={3} />
                      </View>
                    ) : (
                      <View style={styles.langRadioUnchecked} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1C1F2E",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
    fontWeight: "500",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 130,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 24,
    marginTop: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  clickableRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  rowTextCol: {
    flex: 1,
    marginRight: 12,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1F2E",
  },
  rowSubtitle: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 1.5,
    lineHeight: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginLeft: 66,
  },
  footer: {
    alignItems: "center",
    marginTop: 28,
    marginBottom: 16,
  },
  footerVersion: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9CA3AF",
  },
  footerTagline: {
    fontSize: 11,
    color: "#CBD5E1",
    marginTop: 3,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    flex: 1,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "82%",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalHeaderTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1C1F2E",
  },
  modalCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    marginTop: 14,
  },
  modalDoneBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  modalDoneText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  // Guide steps
  guideContainer: {
    gap: 16,
    paddingBottom: 8,
  },
  guideStep: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  stepNumPill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepNumText: {
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "800",
  },
  stepTextCol: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C1F2E",
  },
  stepDesc: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
    marginTop: 3,
  },

  // Rules container
  rulesContainer: {
    gap: 12,
    paddingBottom: 8,
  },
  ruleCard: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  ruleCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  ruleCardDesc: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
    lineHeight: 18,
  },

  // Legal container
  legalContainer: {
    paddingBottom: 8,
    gap: 8,
  },
  legalHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C1F2E",
    marginTop: 8,
  },
  legalText: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 19,
  },

  // Language row in main card
  langRightBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  langFlagText: {
    fontSize: 20,
  },

  // Language Modal Specific
  langModalCard: {
    maxHeight: "85%",
    paddingBottom: 20,
  },
  modalHeaderTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBoxSmall: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
    marginBottom: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1E293B",
    padding: 0,
  },
  langListScroll: {
    marginTop: 6,
  },
  langListContent: {
    paddingBottom: 24,
    gap: 6,
  },
  langItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  langItemSelected: {
    backgroundColor: "#EFF6FF",
    borderColor: "#3B82F6",
  },
  langFlagLarge: {
    fontSize: 26,
    marginRight: 12,
  },
  langItemInfo: {
    flex: 1,
  },
  langItemTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  langNativeText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  langNativeTextSelected: {
    color: "#1D4ED8",
  },
  tierBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tier1Badge: {
    backgroundColor: "#FEF3C7",
  },
  tier2Badge: {
    backgroundColor: "#F1F5F9",
  },
  tierBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  tier1BadgeText: {
    color: "#B45309",
  },
  tier2BadgeText: {
    color: "#64748B",
  },
  langEnglishText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  langCheckCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  langRadioUnchecked: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    marginLeft: 8,
  },
});
