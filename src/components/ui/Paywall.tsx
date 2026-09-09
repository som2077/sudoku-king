import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Crown,
  Check,
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  Ban,
  ArrowRight,
} from "lucide-react-native";
import { Text } from "./Text";
import { PurchasesPackage } from "react-native-purchases";
import { purchaseService } from "../../services/purchaseService";
import { useGameStore } from "../../store/useGameStore";
import { haptics } from "../../utils/haptics";
import { APP_LINKS } from "../../constants/links";

export interface PaywallProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  isLoading?: boolean;
}

export default function Paywall({
  visible,
  onClose,
  onSuccess,
}: PaywallProps) {
  const [loading, setLoading] = useState(false);
  const [lifetimePackage, setLifetimePackage] = useState<PurchasesPackage | null>(null);

  const isPremium = useGameStore((s) => s.isPremium);
  const trialEndsAt = useGameStore((s) => s.trialEndsAt);
  const hasUsedFreeTrial = useGameStore((s) => s.hasUsedFreeTrial);
  const activateThreeDayTrial = useGameStore((s) => s.activateThreeDayTrial);
  const getTrialDaysRemaining = useGameStore((s) => s.getTrialDaysRemaining);

  const isTrialActive = Boolean(trialEndsAt && trialEndsAt > Date.now());
  const daysLeft = getTrialDaysRemaining();

  useEffect(() => {
    if (visible) {
      loadOfferings();
    }
  }, [visible]);

  const loadOfferings = async () => {
    try {
      const offering = await purchaseService.fetchOfferings();
      if (offering?.availablePackages && offering.availablePackages.length > 0) {
        // Find lifetime or first available package
        const pkg =
          offering.availablePackages.find(
            (p) => p.identifier === "$rc_lifetime" || p.packageType === "LIFETIME"
          ) || offering.availablePackages[0];
        setLifetimePackage(pkg);
      }
    } catch (err) {
      console.warn("⚠️ [Paywall] Error loading packages:", err);
    }
  };

  const handleStartFreeTrial = () => {
    haptics.success();
    purchaseService.activateFreeTrial();
    Alert.alert(
      "🎉 VIP Trial Activated!",
      "You have unlocked 3 days of full Sudoku King VIP access with unlimited hints and no ads. No credit card required!",
      [
        {
          text: "Let's Play!",
          onPress: () => {
            if (onSuccess) onSuccess();
            onClose();
          },
        },
      ]
    );
  };

  const handlePurchaseLifetime = async () => {
    if (!lifetimePackage) {
      // Fallback direct VIP unlock in dev or test environment
      haptics.success();
      useGameStore.getState().setPremium(true);
      Alert.alert("👑 VIP Unlocked", "Thank you for supporting Sudoku King!");
      if (onSuccess) onSuccess();
      onClose();
      return;
    }

    setLoading(true);
    haptics.impactMedium();

    try {
      const res = await purchaseService.purchasePackage(lifetimePackage);
      if (res.success) {
        haptics.success();
        Alert.alert("👑 Welcome to VIP!", "Your purchase was successful!");
        if (onSuccess) onSuccess();
        onClose();
      } else if (!res.userCancelled) {
        Alert.alert("Notice", res.error || "Could not complete purchase. Please try again.");
      }
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Purchase failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    haptics.impactLight();
    try {
      const res = await purchaseService.restorePurchases();
      if (res.restored) {
        haptics.success();
        Alert.alert("Success", "Your VIP purchases have been successfully restored!");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        Alert.alert("Info", "No active VIP subscriptions were found for this account.");
      }
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Failed to restore purchases.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Subtle dark luxury gradient */}
        <LinearGradient
          colors={["#0F172A", "#1E293B", "#090D16"]}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
        />

        <SafeAreaView style={styles.safeArea}>
          {/* Top Header Bar with Close X */}
          <View style={styles.topBar}>
            <View style={styles.badgePill}>
              <Sparkles size={12} color="#F59E0B" />
              <Text style={styles.badgePillText}>
                {isTrialActive
                  ? `TRIAL ACTIVE • ${daysLeft} DAYS LEFT`
                  : "3-DAY FREE TRIAL • NO CARD NEEDED"}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                haptics.selection();
                onClose();
              }}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close offer"
            >
              <X size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Hero Crown & Headline */}
            <View style={styles.heroSection}>
              <View style={styles.crownContainer}>
                <LinearGradient
                  colors={["#FEF08A", "#F59E0B", "#D97706"]}
                  style={styles.crownGradient}
                >
                  <Crown size={38} color="#78350F" strokeWidth={2.2} />
                </LinearGradient>
              </View>

              <Text style={styles.heroTitle}>Sudoku King VIP</Text>
              <Text style={styles.heroSubtitle}>
                Master every puzzle without distractions. Pure brain training at its finest.
              </Text>
            </View>

            {/* Feature Perks Cards */}
            <View style={styles.perksContainer}>
              {/* Perk 1: Ad-Free */}
              <View style={styles.perkCard}>
                <View style={[styles.perkIconBg, { backgroundColor: "#FEE2E2" }]}>
                  <Ban size={20} color="#EF4444" strokeWidth={2.5} />
                </View>
                <View style={styles.perkTextCol}>
                  <Text style={styles.perkTitle}>100% Ad-Free Zen Mode</Text>
                  <Text style={styles.perkDesc}>
                    Zero banner ads, zero video interruptions during game sessions.
                  </Text>
                </View>
              </View>

              {/* Perk 2: Infinite Hints */}
              <View style={styles.perkCard}>
                <View style={[styles.perkIconBg, { backgroundColor: "#FEF3C7" }]}>
                  <Sparkles size={20} color="#D97706" strokeWidth={2.5} />
                </View>
                <View style={styles.perkTextCol}>
                  <Text style={styles.perkTitle}>Unlimited Smart Hints</Text>
                  <Text style={styles.perkDesc}>
                    Never get stuck. Step-by-step logical explanations whenever you need them.
                  </Text>
                </View>
              </View>

              {/* Perk 3: Second Chances */}
              <View style={styles.perkCard}>
                <View style={[styles.perkIconBg, { backgroundColor: "#DBEAFE" }]}>
                  <Zap size={20} color="#2563EB" strokeWidth={2.5} />
                </View>
                <View style={styles.perkTextCol}>
                  <Text style={styles.perkTitle}>Infinite Second Chances</Text>
                  <Text style={styles.perkDesc}>
                    Accidentally make 3 mistakes? Revive instantly and protect your streaks.
                  </Text>
                </View>
              </View>

              {/* Perk 4: VIP Crown */}
              <View style={styles.perkCard}>
                <View style={[styles.perkIconBg, { backgroundColor: "#F3E8FF" }]}>
                  <Crown size={20} color="#9333EA" strokeWidth={2.5} />
                </View>
                <View style={styles.perkTextCol}>
                  <Text style={styles.perkTitle}>Golden Crown Status</Text>
                  <Text style={styles.perkDesc}>
                    Exclusive VIP crown displayed across your profile, awards, and daily challenges.
                  </Text>
                </View>
              </View>
            </View>

            {/* Trial Guarantee Callout */}
            {!hasUsedFreeTrial && (
              <View style={styles.trialCallout}>
                <ShieldCheck size={20} color="#10B981" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.trialCalloutTitle}>
                    Risk-Free 3-Day Trial
                  </Text>
                  <Text style={styles.trialCalloutText}>
                    No credit card required. Instantly unlock VIP perks for 3 full days.
                  </Text>
                </View>
              </View>
            )}

            {/* ── Action Section ── */}
            <View style={styles.actionSection}>
              {/* Option A: 3-Day Free Trial (if not used yet) */}
              {!hasUsedFreeTrial && (
                <TouchableOpacity
                  style={styles.trialBtn}
                  activeOpacity={0.88}
                  onPress={handleStartFreeTrial}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={["#F59E0B", "#D97706"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.trialBtnGradient}
                  >
                    <View style={styles.trialBtnInner}>
                      <Text style={styles.trialBtnTitle}>
                        Start 3-Day Free Trial
                      </Text>
                      <Text style={styles.trialBtnSubtitle}>
                        Instant VIP access • No credit card needed
                      </Text>
                    </View>
                    <ArrowRight size={22} color="#FFFFFF" strokeWidth={2.5} />
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {/* Option B: Lifetime VIP Purchase */}
              <TouchableOpacity
                style={[
                  styles.lifetimeBtn,
                  hasUsedFreeTrial && styles.lifetimeBtnPrimary,
                ]}
                activeOpacity={0.85}
                onPress={handlePurchaseLifetime}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={hasUsedFreeTrial ? "#FFFFFF" : "#F59E0B"} />
                ) : (
                  <View style={styles.lifetimeBtnRow}>
                    <Crown size={18} color={hasUsedFreeTrial ? "#FDE047" : "#F59E0B"} />
                    <Text
                      style={[
                        styles.lifetimeBtnText,
                        hasUsedFreeTrial && styles.lifetimeBtnTextPrimary,
                      ]}
                    >
                      {hasUsedFreeTrial ? "Unlock Lifetime VIP" : "Or Buy Lifetime Access"}
                    </Text>
                    <Text
                      style={[
                        styles.lifetimePriceText,
                        hasUsedFreeTrial && styles.lifetimePriceTextPrimary,
                      ]}
                    >
                      {lifetimePackage?.product?.priceString || "$4.99"}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Dismiss / Maybe Later */}
              <TouchableOpacity
                style={styles.maybeLaterBtn}
                onPress={() => {
                  haptics.selection();
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.maybeLaterText}>Maybe Later</Text>
              </TouchableOpacity>

              {/* Bottom Links: Restore Purchases & Legal */}
              <View style={styles.footerLinks}>
                <TouchableOpacity onPress={handleRestore} disabled={loading}>
                  <Text style={styles.footerLinkText}>Restore Purchases</Text>
                </TouchableOpacity>
                <Text style={styles.footerLinkDivider}>•</Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL(APP_LINKS.TERMS_URL).catch(() => {})}
                >
                  <Text style={styles.footerLinkText}>Terms</Text>
                </TouchableOpacity>
                <Text style={styles.footerLinkDivider}>•</Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL(APP_LINKS.PRIVACY_URL).catch(() => {})}
                >
                  <Text style={styles.footerLinkText}>Privacy</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
  },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.35)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 6,
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#F59E0B",
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 30,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 22,
  },
  crownContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    overflow: "hidden",
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 14,
  },
  crownGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    marginBottom: 6,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  perksContainer: {
    gap: 10,
    marginBottom: 16,
  },
  perkCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 14,
    gap: 14,
  },
  perkIconBg: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  perkTextCol: {
    flex: 1,
  },
  perkTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  perkDesc: {
    fontSize: 12,
    color: "#94A3B8",
    lineHeight: 16,
  },
  trialCallout: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
    borderRadius: 14,
    padding: 12,
    gap: 12,
    marginBottom: 20,
  },
  trialCalloutTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#10B981",
    marginBottom: 1,
  },
  trialCalloutText: {
    fontSize: 11,
    color: "#A7F3D0",
    lineHeight: 15,
  },
  actionSection: {
    gap: 12,
    marginTop: 4,
  },
  trialBtn: {
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  trialBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  trialBtnInner: {
    flex: 1,
  },
  trialBtnTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  trialBtnSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "500",
  },
  lifetimeBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.35)",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  lifetimeBtnPrimary: {
    backgroundColor: "#F59E0B",
    borderColor: "#D97706",
  },
  lifetimeBtnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  lifetimeBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F59E0B",
    flex: 1,
    marginLeft: 8,
  },
  lifetimeBtnTextPrimary: {
    color: "#1E293B",
  },
  lifetimePriceText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  lifetimePriceTextPrimary: {
    color: "#1E293B",
  },
  maybeLaterBtn: {
    alignItems: "center",
    paddingVertical: 10,
  },
  maybeLaterText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },
  footerLinks: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  footerLinkText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  footerLinkDivider: {
    fontSize: 11,
    color: "#475569",
  },
});
