import React, { useState, useMemo, useEffect } from "react";
import {
  Dimensions,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  BackHandler,
} from "react-native";
import { Text } from "../components/Text";
import LottieView from "lottie-react-native";
import Svg, { Path } from "react-native-svg";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { Image } from "expo-image";
import { useGameStore, isDailyChallengeCompleted } from "../store/useGameStore";
import { StreakFlame } from "../components/StreakFlame";
import { CARD_SHADOW } from "../components/dashboard/StatsCards";
import { useTranslation } from "../i18n";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const H_PAD = 20;

// ─── Design tokens ────────────────────────────────────────────────────────────

const T = {
  ink: "#0F0E13",
  inkMuted: "#6B6A73",
  inkSubtle: "#A8A7B2",
  surface: "#FFFFFF",
  surfaceElevated: "#F8F7FC",
  border: "#EDEDF2",
  accent: "#1D1A27",
  accentFg: "#FFFFFF",
} as const;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ─── StatCard ──────────────────────────────────────────────────────────────────

function StatCard({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: T.surface,
        borderRadius: 15,
        borderWidth: 0.7,
        borderColor: T.border,
        padding: 12,
        // shadowColor: "#000",
        // shadowOpacity: 0.03,
        // shadowRadius: 6,
        // shadowOffset: { width: 0, height: 2 },
        // elevation: 1,
      }}
    >
      {children}
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────

interface AwardsScreenProps {
  onBack: () => void;
}

export function AwardsScreen({ onBack }: AwardsScreenProps) {
  const { t } = useTranslation();
  const { streak = 0, dailyChallengesProgress, settings } = useGameStore();
  const language = settings?.language || 'en';
  const currentStreak = streak || 0;

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      onBack();
      return true;
    });
    return () => sub.remove();
  }, [onBack]);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIdx = now.getMonth();

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const longestStreak = useMemo(() => {
    let max = currentStreak;
    const completedKeys = Object.keys(dailyChallengesProgress || {})
      .filter((k) => isDailyChallengeCompleted(dailyChallengesProgress, k))
      .sort();

    if (completedKeys.length > 0) {
      let cur = 1;
      let localMax = 1;
      for (let i = 1; i < completedKeys.length; i++) {
        const prev = new Date(completedKeys[i - 1]);
        const curr = new Date(completedKeys[i]);
        const diff = Math.round(
          (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (diff === 1) {
          cur++;
          if (cur > localMax) localMax = cur;
        } else if (diff > 1) {
          cur = 1;
        }
      }
      max = Math.max(max, localMax);
    }
    return Math.max(max, currentStreak, 0);
  }, [dailyChallengesProgress, currentStreak]);

  const monthsData = useMemo(() => {
    return Array.from({ length: 12 }, (_, monthIdx) => {
      const monthDate = new Date(selectedYear, monthIdx, 1);
      const name = monthDate.toLocaleDateString(language, { month: "long" });
      const totalDays = new Date(selectedYear, monthIdx + 1, 0).getDate();
      let count = 0;
      const mStr = String(monthIdx + 1).padStart(2, "0");

      for (let d = 1; d <= totalDays; d++) {
        const dStr = String(d).padStart(2, "0");
        const dateKey = `${selectedYear}-${mStr}-${dStr}`;
        if (isDailyChallengeCompleted(dailyChallengesProgress, dateKey)) {
          count++;
        }
      }

      const isCurrentMonth =
        selectedYear === currentYear && monthIdx === currentMonthIdx;
      const isFutureMonth =
        selectedYear > currentYear ||
        (selectedYear === currentYear && monthIdx > currentMonthIdx);
      const isGold = count >= totalDays;
      const isSilver = !isGold && count >= 20;
      const isBronze = !isGold && !isSilver && count >= 10;

      return {
        name,
        monthIdx,
        totalDays,
        count,
        isCurrentMonth,
        isFutureMonth,
        isGold,
        isSilver,
        isBronze,
      };
    });
  }, [selectedYear, currentYear, currentMonthIdx, dailyChallengesProgress]);

  const earnedCount = useMemo(
    () => monthsData.filter((m) => m.isGold || m.isSilver || m.isBronze).length,
    [monthsData],
  );
  const earnedPct = earnedCount / 12;

  return (
    <View style={{ flex: 1, backgroundColor: "transparent", marginTop: 10 }}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <ChevronLeft size={22} color="#1C1F2E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('awards.title')}</Text>
        </View>

        <View style={styles.streakPill}>
          <StreakFlame size={20} />
          <Text style={styles.streakPillText}>{streak}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 1 }}
      >
        {/* ── Hero Stats ── */}
        <View
          style={{
            paddingHorizontal: H_PAD,
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          {/* Lotties row */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            {/* Fire / Longest streak */}
            <View style={{ alignItems: "center", flex: 1 }}>
              <View
                style={{
                  width: 70,
                  height: 70,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LottieView
                  source={require("../../assets/badge/Fire.json")}
                  autoPlay
                  loop
                  style={{ width: 120, height: 120 }}
                />
              </View>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "500",
                  color: T.inkMuted,
                  marginTop: 23,
                }}
              >
                Longest streak
              </Text>
            </View>

            {/* Trophy / Badges */}
            <View style={{ alignItems: "center", flex: 1 }}>
              <View
                style={{
                  width: 70,
                  height: 85,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LottieView
                  source={require("../../assets/badge/Trophy.json")}
                  autoPlay
                  loop
                  style={{ width: 180, height: 180 }}
                />
              </View>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "500",
                  color: T.inkMuted,
                  marginTop: 6,
                }}
              >
                Badges earned
              </Text>
            </View>
          </View>

          {/* Stat cards row */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            {/* Longest Streak Card */}
            <StatCard>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 4,
                  gap: 5,
                }}
              >
                <LottieView
                  source={require("../../assets/badge/Fire.json")}
                  autoPlay
                  loop
                  style={{ width: 20, height: 20 }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: T.ink,
                    letterSpacing: -0.3,
                  }}
                >
                  {longestStreak} {longestStreak === 1 ? "day" : "days"}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: T.inkSubtle,
                  textAlign: "center",
                }}
              >
                Longest streak ever
              </Text>
            </StatCard>

            {/* Badges Progress Card */}
            <StatCard>
              {/* Header row */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Svg width={16} height={16} viewBox="0 0 100 100">
                    <Path
                      d="M50 5 L95 28 L95 72 L50 95 L5 72 L5 28 Z"
                      fill="#232232"
                      stroke="#D4AF37"
                      strokeWidth={6}
                    />
                  </Svg>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      color: "#1C1F2E",
                    }}
                  >
                    Badges
                  </Text>
                </View>

                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    color: "#1C1F2E",
                  }}
                >
                  {earnedCount}/12
                </Text>
              </View>

              {/* Progress bar */}
              <View
                style={{
                  height: 7,
                  backgroundColor: "#EDEDF2",
                  borderRadius: 100,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${Math.max(earnedPct * 100, earnedPct > 0 ? 5 : 0)}%`,
                    height: "100%",
                    backgroundColor: "#232232",
                    borderRadius: 100,
                  }}
                />
              </View>
            </StatCard>
          </View>
        </View>

        {/* ── Monthly Awards Card ── */}
        <View style={{ paddingHorizontal: H_PAD }}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>Monthly Awards</Text>
                <Text style={styles.cardSubtitle}>
                  Bronze 10 · Silver 20 · Gold All
                </Text>
              </View>

              <View style={styles.yearSelectorPill}>
                <TouchableOpacity
                  onPress={() => setSelectedYear((y) => y - 1)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.yearArrow}
                  activeOpacity={0.6}
                >
                  <ChevronLeft size={16} color="#6B7280" />
                </TouchableOpacity>
                <Text style={styles.yearText}>{selectedYear}</Text>
                <TouchableOpacity
                  onPress={() => setSelectedYear((y) => y + 1)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.yearArrow}
                  activeOpacity={0.6}
                >
                  <ChevronRight size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.monthsGrid}>
              {monthsData.map((month) => {
                const {
                  name,
                  monthIdx,
                  totalDays,
                  count,
                  isCurrentMonth,
                  isFutureMonth,
                  isGold,
                  isSilver,
                  isBronze,
                } = month;

                let iconBg = "#F3F4F6";
                let statusText = `${count}/${totalDays}`;
                let statusColor = "#9CA3AF";

                if (isGold) {
                  iconBg = "#FEF3C7";
                  statusText = "Gold";
                  statusColor = "#D97706";
                } else if (isSilver) {
                  iconBg = "#F1F5F9";
                  statusText = "Silver";
                  statusColor = "#64748B";
                } else if (isBronze) {
                  iconBg = "#FFEDD5";
                  statusText = "Bronze";
                  statusColor = "#B45309";
                } else if (isCurrentMonth) {
                  iconBg = "#EFF6FF";
                  statusText = `${count}/${totalDays}`;
                  statusColor = "#3B82F6";
                } else if (isFutureMonth) {
                  iconBg = "#F9FAFB";
                  statusText = "Upcoming";
                  statusColor = "#9CA3AF";
                }

                return (
                  <View
                    key={monthIdx}
                    style={[
                      styles.monthItem,
                      isCurrentMonth && styles.monthItemCurrent,
                    ]}
                  >
                    <View
                      style={[
                        styles.monthIconBubble,
                        { backgroundColor: iconBg },
                      ]}
                    >
                      <Image
                        source={require("../../assets/sdf.svg")}
                        style={{
                          width: 40,
                          height: 40,
                          opacity: isFutureMonth ? 0.35 : 1,
                        }}
                        contentFit="contain"
                      />
                    </View>
                    <Text
                      style={[
                        styles.monthName,
                        isCurrentMonth && styles.monthNameCurrent,
                      ]}
                    >
                      {name}
                    </Text>
                    <Text style={[styles.monthStatus, { color: statusColor }]}>
                      {statusText}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 8,
    marginHorizontal: H_PAD,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.05,
    // shadowRadius: 2,
    // elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C1F2E",
  },
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  streakPillText: {
    color: "#1C1F2E",
    fontWeight: "bold",
    marginLeft: 6,
    fontSize: 15,
  },
  card: {
    ...CARD_SHADOW,
    borderRadius: 25,
    padding: 18,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1F2E",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
    fontWeight: "500",
  },
  yearSelectorPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    paddingHorizontal: 4,
    paddingVertical: 3,
    marginRight: 4,
  },
  yearArrow: {
    padding: 5,
    // marginRight: 4,
  },
  yearText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1C1F2E",
    paddingHorizontal: 6,
  },
  monthsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 5,
  },
  monthItem: {
    width: "31%",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 14,
  },
  monthItemCurrent: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  monthIconBubble: {
    width: 58,
    height: 58,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  monthName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
    // marginBottom: 2,
  },
  monthNameCurrent: {
    color: "#1C1F2E",
    fontWeight: "bold",
  },
  monthStatus: {
    fontSize: 11,
    fontWeight: "600",
  },
});

export default AwardsScreen;
