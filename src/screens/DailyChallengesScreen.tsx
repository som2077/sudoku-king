import React, { useState, useMemo, useRef } from "react";
import { Text } from "../components/Text";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  PanResponder,
  Animated,
} from "react-native";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
  Lock,
  Crown,
} from "lucide-react-native";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useGameStore,
  getDailyDifficulty,
  isDailyChallengeCompleted,
  getDailyChallengeItem,
} from "../store/useGameStore";
import { useTranslation } from "../i18n";
import { Svg, Circle } from "react-native-svg";

function DayProgressRing({
  size = 32,
  progress = 0,
  color = "#3B82F6",
  trackColor = "#E5E7EB",
  fillColor = "transparent",
}: {
  size?: number;
  progress?: number;
  color?: string;
  trackColor?: string;
  fillColor?: string;
}) {
  const strokeWidth = 2.8;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const strokeDashoffset = circumference * (1 - clampedProgress);

  return (
    <View
      style={{
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width={size} height={size}>
        {/* Background track circle */}
        {trackColor !== "transparent" && (
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
        )}

        {/* Solid fill for selected circle */}
        {fillColor !== "transparent" && (
          <Circle cx={center} cy={center} r={size / 2} fill={fillColor} />
        )}

        {/* Progress Arc */}
        {clampedProgress > 0 && (
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            fill="transparent"
            transform={`rotate(-90 ${center} ${center})`}
          />
        )}
      </Svg>
    </View>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DAYS_LABEL = ["M", "T", "W", "T", "F", "S", "S"];

const DIFFICULTY_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; givens: number }
> = {
  Easy: { label: "Easy", color: "#16A34A", bg: "#DCFCE7", givens: 41 },
  Medium: { label: "Medium", color: "#D97706", bg: "#FEF3C7", givens: 34 },
  Hard: { label: "Hard", color: "#EA580C", bg: "#FFEDD5", givens: 29 },
  Expert: { label: "Expert", color: "#7C3AED", bg: "#F3E8FF", givens: 25 },
  Master: { label: "Master", color: "#2563EB", bg: "#DBEAFE", givens: 23 },
  Extreme: { label: "Extreme", color: "#DC2626", bg: "#FEE2E2", givens: 21 },
  Fast: { label: "Fast", color: "#4B5563", bg: "#F3F4F6", givens: 45 },
};

function formatDuration(sec?: number) {
  if (!sec || sec <= 0) return "00:00";
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// Build calendar grid for a specific month (Mon-first)
function buildCalendarGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (firstDay + 6) % 7; // Convert Sun-first to Mon-first

  const grid: (number | null)[][] = [];
  let day = 1;

  for (let row = 0; row < 6; row++) {
    const week: (number | null)[] = [];
    for (let col = 0; col < 7; col++) {
      const cellIndex = row * 7 + col;
      if (cellIndex < offset || day > daysInMonth) {
        week.push(null);
      } else {
        week.push(day++);
      }
    }
    grid.push(week);
    if (day > daysInMonth) break;
  }
  return grid;
}

export function DailyChallengesScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const {
    startDailyChallenge,
    dailyChallengesProgress,
    currentDailyChallenge,
    streak = 0,
    settings,
  } = useGameStore();
  const language = settings?.language || "en";

  const now = new Date();
  const todayDate = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const [visibleMonthIdx, setVisibleMonthIdx] = useState(currentMonth);

  // Default selection per month
  const [selectedDates, setSelectedDates] = useState<Record<number, number>>({
    [currentMonth]: todayDate,
  });

  const selectedDate =
    selectedDates[visibleMonthIdx] ||
    (visibleMonthIdx === currentMonth ? todayDate : 1);

  const mStr = String(visibleMonthIdx + 1).padStart(2, "0");
  const dStr = String(selectedDate).padStart(2, "0");
  const selectedDateStr = `${currentYear}-${mStr}-${dStr}`;

  const selectedDifficulty = getDailyDifficulty(selectedDateStr);
  const diffMeta =
    DIFFICULTY_CONFIG[selectedDifficulty] || DIFFICULTY_CONFIG.Medium;

  const isTodaySelected =
    visibleMonthIdx === currentMonth && selectedDate === todayDate;
  const isFutureSelected =
    visibleMonthIdx > currentMonth ||
    (visibleMonthIdx === currentMonth && selectedDate > todayDate);
  const isSelectedCompleted = isDailyChallengeCompleted(
    dailyChallengesProgress,
    selectedDateStr,
  );
  const selectedProgressItem = getDailyChallengeItem(
    dailyChallengesProgress,
    selectedDateStr,
  );

  const handlePlay = () => {
    if (isFutureSelected) return;
    startDailyChallenge(selectedDateStr);
  };

  const translateX = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const isAnimating = useRef(false);

  const animateMonthChange = (direction: 1 | -1) => {
    if (isAnimating.current) return;
    const targetIdx = visibleMonthIdx + direction;
    if (targetIdx < 0 || targetIdx > 11) return;

    isAnimating.current = true;
    const exitOffset =
      direction === 1 ? -SCREEN_WIDTH * 0.45 : SCREEN_WIDTH * 0.45;
    const enterOffset =
      direction === 1 ? SCREEN_WIDTH * 0.45 : -SCREEN_WIDTH * 0.45;

    Animated.parallel([
      Animated.timing(translateX, {
        toValue: exitOffset,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.3,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisibleMonthIdx(targetIdx);
      translateX.setValue(enterOffset);
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        isAnimating.current = false;
      });
    });
  };

  const changeMonth = (direction: 1 | -1) => {
    animateMonthChange(direction);
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return (
            Math.abs(gestureState.dx) > 15 &&
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.5
          );
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx > 45) {
            // Swipe Right -> Previous Month
            animateMonthChange(-1);
          } else if (gestureState.dx < -45) {
            // Swipe Left -> Next Month
            animateMonthChange(1);
          }
        },
      }),
    [visibleMonthIdx],
  );

  const grid = useMemo(
    () => buildCalendarGrid(currentYear, visibleMonthIdx),
    [currentYear, visibleMonthIdx],
  );
  const dateObj = new Date(currentYear, visibleMonthIdx, 1);
  const monthName = dateObj.toLocaleDateString(language, { month: "long" });
  const totalDays = new Date(currentYear, visibleMonthIdx + 1, 0).getDate();

  // Completed count in this month
  let completedCount = 0;
  for (let d = 1; d <= totalDays; d++) {
    const ds = `${currentYear}-${String(visibleMonthIdx + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    if (isDailyChallengeCompleted(dailyChallengesProgress, ds)) {
      completedCount++;
    }
  }

  // Monthly Trophy Milestones: 10=Bronze, 20=Silver, totalDays=Gold
  const isGold = completedCount >= totalDays;
  const isSilver = !isGold && completedCount >= 20;
  const isBronze = !isGold && !isSilver && completedCount >= 10;

  const trophyTitle = isGold
    ? "Royal Gold Cup 🏆"
    : isSilver
      ? "Silver Cup 🥈"
      : isBronze
        ? "Bronze Cup 🥉"
        : `${monthName} Cup`;

  const trophySubtitle = isGold
    ? "All 30 Challenges Solved!"
    : isSilver
      ? `${totalDays - completedCount} more for Royal Gold 🏆`
      : isBronze
        ? `${20 - completedCount} more for Silver Cup 🥈`
        : `${10 - completedCount} more to unlock Bronze Cup 🥉`;

  // Milestone Progress percentage
  const progressPercent = Math.min(
    100,
    Math.round((completedCount / totalDays) * 100),
  );

  // Formatted date string for selected card
  const selectedDayObj = new Date(currentYear, visibleMonthIdx, selectedDate);
  const selectedDayName = selectedDayObj.toLocaleDateString(language, {
    weekday: "long",
  });
  const selectedMonthShort = selectedDayObj.toLocaleDateString(language, {
    month: "short",
  });

  const bannerBg = isGold ? "#B45309" : isSilver ? "#334155" : "#1E3A8A";

  return (
    <View style={{ flex: 1, backgroundColor: bannerBg }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: "#FFFFFF" }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. Hero Banner ── */}
        <LinearGradient
          colors={
            isGold
              ? ["#B45309", "#D97706", "#F59E0B"]
              : isSilver
                ? ["#334155", "#475569", "#64748B"]
                : ["#1E3A8A", "#2563EB", "#3B82F6"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBanner}
          {...panResponder.panHandlers}
        >
          {/* Header Row: Title */}
          <View style={[styles.heroHeader, { paddingTop: insets.top + 8 }]}>
            <Text style={styles.heroTitle}>{t("daily.title")}</Text>
          </View>

          {/* Month Navigation & Trophy Visual */}
          <View style={styles.heroContentRow}>
            <TouchableOpacity
              onPress={() => changeMonth(-1)}
              disabled={visibleMonthIdx === 0}
              style={[
                styles.navArrow,
                visibleMonthIdx === 0 && { opacity: 0.3 },
              ]}
              activeOpacity={0.7}
            >
              <ChevronLeft color="#FFFFFF" size={28} />
            </TouchableOpacity>

            {/* Dynamic Trophy Presentation with Swipe Animation */}
            <Animated.View
              style={[
                styles.trophyContainer,
                {
                  transform: [{ translateX }],
                  opacity: opacityAnim,
                },
              ]}
            >
              <View style={styles.trophyAnimWrapper}>
                <View
                  style={[
                    // styles.trophyGlow,
                    isGold && { backgroundColor: "rgba(253, 230, 138, 0.35)" },
                    isSilver && { backgroundColor: "rgba(226, 232, 240, 0.3)" },
                    isBronze && { backgroundColor: "rgba(245, 158, 11, 0.25)" },
                  ]}
                />
                <LottieView
                  source={require("../../assets/badge/Trophy.json")}
                  autoPlay={true}
                  loop={false}
                  style={styles.trophyLottie}
                />
              </View>
              <Text style={styles.trophyTitleText}>{trophyTitle}</Text>
              <Text style={styles.trophySubtitleText}>{trophySubtitle}</Text>
            </Animated.View>

            <TouchableOpacity
              onPress={() => changeMonth(1)}
              disabled={visibleMonthIdx === 11}
              style={[
                styles.navArrow,
                visibleMonthIdx === 11 && { opacity: 0.3 },
              ]}
              activeOpacity={0.7}
            >
              <ChevronRight color="#FFFFFF" size={28} />
            </TouchableOpacity>
          </View>

          {/* Milestone Progress Bar */}
          <View style={styles.milestoneSection}>
            <View style={styles.milestoneLabels}>
              <Text style={styles.milestoneProgressLabel}>
                {completedCount} / {totalDays} Solved
              </Text>
              <View style={styles.milestoneBadgesRow}>
                <Text
                  style={[
                    styles.badgeTag,
                    completedCount >= 10 && styles.badgeTagActive,
                  ]}
                >
                  🥉 10
                </Text>
                <Text
                  style={[
                    styles.badgeTag,
                    completedCount >= 20 && styles.badgeTagActive,
                  ]}
                >
                  🥈 20
                </Text>
                <Text
                  style={[
                    styles.badgeTag,
                    completedCount >= totalDays && styles.badgeTagActive,
                  ]}
                >
                  🏆 {totalDays}
                </Text>
              </View>
            </View>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progressPercent}%` },
                ]}
              />
            </View>
          </View>
        </LinearGradient>

        {/* ── 2. Calendar Card ── */}
        <View style={styles.calendarCard}>
          {/* Month Title & Solved Counter */}
          <View style={styles.monthHeaderRow}>
            <Text style={styles.monthNameText}>
              {monthName} {currentYear}
            </Text>
            <View style={styles.completedCountBadge}>
              <Crown size={15} color="#D97706" fill="#F59E0B" />
              <Text style={styles.completedCountText}>
                {completedCount}/{totalDays}
              </Text>
            </View>
          </View>

          {/* Days Label Header (M, T, W, T, F, S, S) */}
          <View style={styles.dayLabelsRow}>
            {DAYS_LABEL.map((d, i) => (
              <Text key={i} style={styles.dayLabel}>
                {d}
              </Text>
            ))}
          </View>

          {/* Calendar Grid Rows */}
          <View style={{ gap: 6 }}>
            {grid.map((week, ri) => (
              <View key={ri} style={styles.weekRow}>
                {week.map((day, ci) => {
                  if (!day) return <View key={ci} style={styles.emptyCell} />;

                  const isToday =
                    visibleMonthIdx === currentMonth && day === todayDate;
                  const isFuture =
                    visibleMonthIdx > currentMonth ||
                    (visibleMonthIdx === currentMonth && day > todayDate);

                  const curMStr = String(visibleMonthIdx + 1).padStart(2, "0");
                  const curDStr = String(day).padStart(2, "0");
                  const curDateStr = `${currentYear}-${curMStr}-${curDStr}`;

                  const isCompleted = isDailyChallengeCompleted(
                    dailyChallengesProgress,
                    curDateStr,
                  );

                  const progressItem = dailyChallengesProgress[
                    curDateStr
                  ] as any;
                  const isInProgress =
                    !isCompleted &&
                    !isFuture &&
                    (progressItem?.savedState ||
                      currentDailyChallenge === curDateStr);

                  const isSelected = day === selectedDate;

                  return (
                    <TouchableOpacity
                      key={ci}
                      onPress={() => {
                        if (!isFuture) {
                          setSelectedDates((prev) => ({
                            ...prev,
                            [visibleMonthIdx]: day,
                          }));
                        }
                      }}
                      activeOpacity={isFuture ? 1 : 0.7}
                      style={[
                        styles.dayCell,
                        isToday && !isSelected && styles.dayCellToday,
                      ]}
                    >
                      {/* Selected State: Solid circle matching screenshot item 12 */}
                      {isSelected ? (
                        <DayProgressRing
                          size={32}
                          progress={isCompleted ? 1 : isInProgress ? 0.4 : 0}
                          color={isCompleted ? "#10B981" : "#60A5FA"}
                          trackColor="transparent"
                          fillColor="#2563EB"
                        />
                      ) : (
                        <>
                          {/* In-Progress: Light track with Blue half-arc */}
                          {isInProgress && (
                            <DayProgressRing
                              size={32}
                              progress={0.4}
                              color="#3B82F6"
                              trackColor="#E5E7EB"
                            />
                          )}

                          {/* Completed: Full Green ring */}
                          {isCompleted && (
                            <DayProgressRing
                              size={32}
                              progress={1}
                              color="#10B981"
                              trackColor="#E5E7EB"
                            />
                          )}
                        </>
                      )}

                      {/* Content */}
                      {isFuture ? (
                        <View style={styles.futureWrapper}>
                          <Text style={styles.dayTextFuture}>{day}</Text>
                          <Lock size={10} color="#D1D5DB" />
                        </View>
                      ) : (
                        <Text
                          style={[
                            styles.dayText,
                            isToday && !isSelected && styles.dayTextToday,
                            isSelected && styles.dayTextSelected,
                            isCompleted && !isSelected && { color: "#10B981" },
                          ]}
                        >
                          {day}
                        </Text>
                      )}

                      {/* Today dot indicator */}
                      {isToday && !isSelected && !isCompleted && (
                        <View style={styles.todayDot} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          {/* ── 3. Selected Challenge Details Card ── */}
          <View style={styles.detailsCard}>
            <View style={styles.detailsHeaderRow}>
              <View>
                <Text style={styles.detailsDateTitle}>
                  {selectedDayName}, {selectedMonthShort} {selectedDate}
                </Text>
                <View style={styles.detailsMetaRow}>
                  <View
                    style={[styles.diffBadge, { backgroundColor: diffMeta.bg }]}
                  >
                    <View
                      style={[
                        styles.diffIndicatorDot,
                        { backgroundColor: diffMeta.color },
                      ]}
                    />
                    <Text
                      style={[styles.diffBadgeText, { color: diffMeta.color }]}
                    >
                      {t(`diff.${selectedDifficulty.toLowerCase()}` as any) ||
                        selectedDifficulty}
                    </Text>
                  </View>
                  <Text style={styles.cluesText}>
                    ~{diffMeta.givens} Givens
                  </Text>
                  {isTodaySelected && (
                    <View style={styles.todayPill}>
                      <Text style={styles.todayPillText}>TODAY</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Status Information */}
            <View style={styles.statusRow}>
              {isSelectedCompleted ? (
                <View style={styles.statusCompletedBox}>
                  <Text style={styles.statusCompletedText}>
                    👑 {t("daily.completed")} ·{" "}
                    {formatDuration(selectedProgressItem?.timeSec)}
                    {selectedProgressItem?.mistakes !== undefined
                      ? ` · ${selectedProgressItem.mistakes} mistakes`
                      : ""}
                  </Text>
                </View>
              ) : isFutureSelected ? (
                <Text style={styles.statusFutureText}>
                  🔒 Challenge unlocks on this day at midnight.
                </Text>
              ) : isTodaySelected ? (
                <Text style={styles.statusActiveText}>
                  🔥 Solve today's puzzle to maintain your active streak!
                </Text>
              ) : (
                <Text style={styles.statusMissedText}>
                  ⏰ Missed puzzle · Play to earn your crown & monthly cup!
                </Text>
              )}
            </View>
          </View>

          {/* ── 4. Action Button ── */}
          <TouchableOpacity
            onPress={handlePlay}
            disabled={isFutureSelected}
            style={[
              styles.playBtn,
              isFutureSelected && styles.playBtnDisabled,
              isSelectedCompleted && styles.playBtnCompleted,
            ]}
            activeOpacity={0.85}
          >
            {isFutureSelected ? (
              <View style={styles.btnContentRow}>
                <Lock size={18} color="#9CA3AF" />
                <Text style={styles.playBtnTextDisabled}>Locked</Text>
              </View>
            ) : isSelectedCompleted ? (
              <View style={styles.btnContentRow}>
                <RotateCcw size={18} color="#FFFFFF" />
                <Text style={styles.playBtnText}>
                  {t("daily.completed")} (
                  {formatDuration(selectedProgressItem?.timeSec)})
                </Text>
              </View>
            ) : isTodaySelected ? (
              <View style={styles.btnContentRow}>
                <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={styles.playBtnText}>{t("daily.play")}</Text>
              </View>
            ) : (
              <View style={styles.btnContentRow}>
                <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={styles.playBtnText}>{t("daily.play")}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heroBanner: {
    paddingBottom: 10,
    paddingHorizontal: 15,
    overflow: "hidden",
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  heroContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 30,
  },
  navArrow: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 999,
  },
  trophyContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  trophyAnimWrapper: {
    width: 94,
    height: 94,
    alignItems: "center",
    justifyContent: "center",
  },
  // trophyGlow: {
  //   position: "absolute",
  //   width: 94,
  //   height: 94,
  //   borderRadius: 999,
  //   backgroundColor: "rgba(255, 255, 255, 0.12)",
  // },
  trophyLottie: {
    width: 230,
    height: 230,
  },
  trophyTitleText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "800",
    marginTop: 20,
    letterSpacing: 0.2,
  },
  trophySubtitleText: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginTop: -2,
  },
  milestoneSection: {
    marginTop: 8,
    backgroundColor: "rgba(0, 0, 0, 0.12)",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 17,
  },
  milestoneLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    // paddingHorizontal: 4,
  },
  milestoneProgressLabel: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  milestoneBadgesRow: {
    flexDirection: "row",
    gap: 8,
  },
  badgeTag: {
    color: "rgba(255, 255, 255, 0.65)",
    fontSize: 11,
    fontWeight: "700",
  },
  badgeTagActive: {
    color: "#FEF08A",
    fontWeight: "800",
  },
  progressBarTrack: {
    height: 7,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FEF08A",
    borderRadius: 999,
  },
  calendarCard: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  monthHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  monthNameText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1C1F2E",
  },
  completedCountBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  completedCountText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#92400E",
  },
  dayLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  dayLabel: {
    width: (SCREEN_WIDTH - 32) / 7,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
    color: "#9CA3AF",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  emptyCell: {
    width: (SCREEN_WIDTH - 32) / 7,
    height: 38,
  },
  dayCell: {
    width: (SCREEN_WIDTH - 32) / 7,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCellToday: {
    // No rectangular outline - clean circle only
  },
  dayCellSelected: {
    // No rectangular outline - clean circle only
  },
  dayText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1F2E",
  },
  dayTextToday: {
    color: "#2563EB",
    fontWeight: "800",
  },
  dayTextSelected: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  dayTextFuture: {
    fontSize: 12,
    fontWeight: "500",
    color: "#D1D5DB",
  },
  futureWrapper: {
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  },
  todayDot: {
    position: "absolute",
    bottom: 3,
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: "#2563EB",
  },
  detailsCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 10,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  detailsHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  detailsDateTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1C1F2E",
    marginBottom: 4,
  },
  detailsMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  diffBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
  },
  diffIndicatorDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
  },
  diffBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  cluesText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  todayPill: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  todayPillText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
  statusRow: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  statusCompletedBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusCompletedText: {
    color: "#D97706",
    fontWeight: "700",
    fontSize: 12,
  },
  statusActiveText: {
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 12,
  },
  statusMissedText: {
    color: "#475569",
    fontWeight: "500",
    fontSize: 12,
  },
  statusFutureText: {
    color: "#94A3B8",
    fontWeight: "500",
    fontSize: 12,
  },
  playBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  playBtnCompleted: {
    backgroundColor: "#0F172A",
    shadowColor: "#0F172A",
  },
  playBtnDisabled: {
    backgroundColor: "#F1F5F9",
    shadowOpacity: 0,
    elevation: 0,
  },
  btnContentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  playBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  playBtnTextDisabled: {
    color: "#9CA3AF",
    fontSize: 16,
    fontWeight: "700",
  },
});
