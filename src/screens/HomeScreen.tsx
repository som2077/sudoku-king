import React from "react";
import { Text } from "../components/Text";
import {
  View,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, Calendar, Settings, Play } from "lucide-react-native";
import { Image } from "expo-image";
import { StreakFlame } from "../components/StreakFlame";
import { useGameStore } from "../store/useGameStore";
import { useShallow } from "zustand/react/shallow";
import { WeeklyCalendarStrip } from "../components/WeeklyCalendarStrip";
import { DashboardPager } from "../components/DashboardPager";
import { AppGradientBackground } from "../components/AppGradientBackground";
import { DifficultyBottomSheet } from "../components/DifficultyBottomSheet";
import { DailyChallengesScreen } from "./DailyChallengesScreen";
import { SettingsScreen } from "./SettingsScreen";
import { AwardsScreen } from "./AwardsScreen";
import { DailyChallengePopup } from "../components/dashboard/DailyChallengePopup";

const MemoizedDailyChallengesScreen = React.memo(DailyChallengesScreen);
const MemoizedSettingsScreen = React.memo(SettingsScreen);
import { StatusBar as NativeStatusBar } from "react-native";
import { Difficulty } from "../utils/sudokuLogic";
import { useTranslation } from "../i18n";

type HomeScreenProps = {
  setScreen: (screen: "home" | "playing") => void;
  startNewGame: (difficulty: Difficulty) => void;
  history?: any[];
  isPremium?: boolean;
  setPremium?: (val: boolean) => void;
  onOpenPaywall?: () => void;
  onRestorePurchases?: () => void;
};

type Tab = "home" | "daily" | "settings";
const TABS: Tab[] = ["home", "daily", "settings"];

// ────────────────────────────────────────────────────────────────────────────
// Bottom Navigation (shared across tabs - Pill Active Style matching Reference)
// ────────────────────────────────────────────────────────────────────────────
const ACTIVE_BLUE = "#0969DA";
const INACTIVE_GRAY = "#656D76";

const BottomNav = React.memo(function BottomNav({
  activeTab,
  setActiveTab,
}: {
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
}) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const isHome = activeTab === "home";
  const isDaily = activeTab === "daily";
  const isSettings = activeTab === "settings";

  return (
    <View
      style={[
        navStyles.container,
        { paddingBottom: Math.max(insets.bottom, 10) },
      ]}
    >
      {/* 1. Home Tab */}
      <TouchableOpacity
        onPress={() => setActiveTab("home")}
        style={navStyles.tabItem}
        activeOpacity={0.7}
        delayPressIn={0}
        accessibilityRole="tab"
        accessibilityState={{ selected: isHome }}
        accessibilityLabel={t("tabs.home")}
      >
        <View style={[navStyles.pill, isHome && navStyles.pillActive]}>
          <Home
            size={21}
            color={isHome ? ACTIVE_BLUE : INACTIVE_GRAY}
            fill={isHome ? ACTIVE_BLUE : "transparent"}
            strokeWidth={isHome ? 0 : 2}
          />
        </View>
        <Text
          style={[
            navStyles.tabText,
            isHome ? navStyles.tabTextActive : navStyles.tabTextInactive,
          ]}
        >
          {t("tabs.home")}
        </Text>
      </TouchableOpacity>

      {/* 2. Daily Challenges Tab */}
      <TouchableOpacity
        onPress={() => setActiveTab("daily")}
        style={navStyles.tabItem}
        activeOpacity={0.7}
        delayPressIn={0}
        accessibilityRole="tab"
        accessibilityState={{ selected: isDaily }}
        accessibilityLabel={t("tabs.daily")}
      >
        <View style={[navStyles.pill, isDaily && navStyles.pillActive]}>
          <Calendar
            size={20}
            color={isDaily ? ACTIVE_BLUE : INACTIVE_GRAY}
            strokeWidth={isDaily ? 2.4 : 1.8}
          />
        </View>
        <Text
          style={[
            navStyles.tabText,
            isDaily ? navStyles.tabTextActive : navStyles.tabTextInactive,
          ]}
        >
          {t("tabs.daily")}
        </Text>
      </TouchableOpacity>

      {/* 3. Settings Tab */}
      <TouchableOpacity
        onPress={() => setActiveTab("settings")}
        style={navStyles.tabItem}
        activeOpacity={0.7}
        delayPressIn={0}
        accessibilityRole="tab"
        accessibilityState={{ selected: isSettings }}
        accessibilityLabel={t("tabs.settings", "Settings")}
      >
        <View style={[navStyles.pill, isSettings && navStyles.pillActive]}>
          <Settings
            size={20}
            color={isSettings ? ACTIVE_BLUE : INACTIVE_GRAY}
            strokeWidth={isSettings ? 2.4 : 1.8}
          />
        </View>
        <Text
          style={[
            navStyles.tabText,
            isSettings ? navStyles.tabTextActive : navStyles.tabTextInactive,
          ]}
        >
          {t("tabs.settings", "Settings")}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const navStyles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E1E4E8",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 8,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 2,
  },
  pill: {
    width: 62,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  pillActive: {
    backgroundColor: "#DDF4FF",
    borderRadius: 16,
    overflow: "hidden",
  },
  tabText: {
    fontSize: 11,
    marginTop: 3,
    letterSpacing: 0.1,
  },
  tabTextActive: {
    fontWeight: "700",
    color: "#1F2937",
  },
  tabTextInactive: {
    fontWeight: "500",
    color: "#656D76",
  },
});

// ────────────────────────────────────────────────────────────────────────────
// Main HomeScreen
// ────────────────────────────────────────────────────────────────────────────
export default function HomeScreen({
  setScreen,
  startNewGame,
  history,
  isPremium,
  setPremium,
  onOpenPaywall,
  onRestorePurchases,
}: HomeScreenProps) {
  const [showDifficultySheet, setShowDifficultySheet] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<Tab>("home");
  const [showAwards, setShowAwards] = React.useState(false);
  const [visitedTabs, setVisitedTabs] = React.useState<Set<Tab>>(
    () => new Set(["home"]),
  );

  const { t } = useTranslation();
  const scrollRef = React.useRef<ScrollView>(null);
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const {
    totalSolved,
    totalPlayed,
    bestTimeSec,
    todaySolved,
    streak = 0,
    timer = 0,
    difficulty = "Easy",
    board = [],
    mistakes = 0,
    isGameCompleted = false,
    dailyChallengesProgress,
  } = useGameStore(
    useShallow((s) => ({
      totalSolved: s.totalSolved,
      totalPlayed: s.totalPlayed,
      bestTimeSec: s.bestTimeSec,
      todaySolved: s.todaySolved,
      streak: s.streak,
      timer: s.timer,
      difficulty: s.difficulty,
      board: s.board,
      mistakes: s.mistakes,
      isGameCompleted: s.isGameCompleted,
      dailyChallengesProgress: s.dailyChallengesProgress,
    })),
  );

  const formatBestTime = (sec: number | null) => {
    if (!sec || sec <= 0) return "--:--";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const formatProgressTimer = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const getDifficultyTitle = (diff?: string) => {
    switch (diff) {
      case "Easy":
        return t("diff.easy");
      case "Medium":
        return t("diff.medium");
      case "Hard":
        return t("diff.hard");
      case "Expert":
        return t("diff.expert");
      case "Master":
        return t("diff.master");
      default:
        return diff || "";
    }
  };

  const isOngoingGame = board.length > 0 && !isGameCompleted && mistakes < 3;
  const continueProgressLabel = isOngoingGame
    ? `${formatProgressTimer(timer)} · ${getDifficultyTitle(difficulty)}`
    : t('home.selectDifficulty');

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  let monthlySolvedCount = 0;
  if (dailyChallengesProgress) {
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const ds = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const item = dailyChallengesProgress[ds] as any;
      if (item && (typeof item === 'boolean' ? item : item.completed)) {
        monthlySolvedCount++;
      }
    }
  }

  const SOLVED = monthlySolvedCount;
  const TOTAL_SOLVED = totalDaysInMonth;
  const WIN_RATE =
    (totalPlayed || 0) > 0
      ? Math.round(((totalSolved || 0) / totalPlayed) * 100)
      : 0;
  const BEST_TIME = formatBestTime(bestTimeSec);
  const STREAK = streak;

  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    if (activeTab === "daily") {
      NativeStatusBar.setBarStyle("light-content");
    } else {
      NativeStatusBar.setBarStyle("dark-content");
    }
  }, [activeTab]);

  const activeTabRef = React.useRef(activeTab);
  React.useLayoutEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);
  const dragStartIdx = React.useRef(TABS.indexOf(activeTab));

  const handleOpenAwards = React.useCallback(() => setShowAwards(true), []);
  const handleDifficultySelect = React.useCallback(
    (diff: Difficulty) => {
      setShowDifficultySheet(false);
      startNewGame(diff);
      setScreen("playing");
    },
    [startNewGame, setScreen],
  );

  const handleTabPress = React.useCallback(
    (tab: Tab) => {
      const index = TABS.indexOf(tab);
      dragStartIdx.current = index;
      activeTabRef.current = tab;
      setActiveTab(tab);
      setVisitedTabs((current) =>
        current.has(tab) ? current : new Set(current).add(tab),
      );
      scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: false });
    },
    [SCREEN_WIDTH],
  );

  const handleScrollBeginDrag = React.useCallback(
    (e: any) => {
      const x = e.nativeEvent.contentOffset.x;
      dragStartIdx.current = Math.max(
        0,
        Math.min(Math.round(x / SCREEN_WIDTH), TABS.length - 1),
      );
    },
    [SCREEN_WIDTH],
  );

  const handleScroll = React.useCallback(
    (e: any) => {
      const x = e.nativeEvent.contentOffset.x;
      const startIdx = dragStartIdx.current;
      const rawIdx = x / SCREEN_WIDTH;

      // Stable eager trigger based on drag gesture origin (eliminates jitter and oscillation)
      let targetIdx = startIdx;
      if (rawIdx > startIdx + 0.2) {
        targetIdx = Math.min(Math.floor(rawIdx + 0.8), TABS.length - 1);
      } else if (rawIdx < startIdx - 0.2) {
        targetIdx = Math.max(Math.ceil(rawIdx - 0.8), 0);
      } else {
        targetIdx = startIdx;
      }

      const targetTab = TABS[targetIdx];
      if (targetTab && targetTab !== activeTabRef.current) {
        activeTabRef.current = targetTab;
        setActiveTab(targetTab);
        setVisitedTabs((current) =>
          current.has(targetTab) ? current : new Set(current).add(targetTab),
        );
      }
    },
    [SCREEN_WIDTH],
  );

  const handleScrollEnd = React.useCallback(
    (e: any) => {
      const x = e.nativeEvent.contentOffset.x;
      const finalIdx = Math.max(
        0,
        Math.min(Math.round(x / SCREEN_WIDTH), TABS.length - 1),
      );
      dragStartIdx.current = finalIdx;
      const targetTab = TABS[finalIdx];
      if (targetTab && targetTab !== activeTabRef.current) {
        activeTabRef.current = targetTab;
        setActiveTab(targetTab);
        setVisitedTabs((current) =>
          current.has(targetTab) ? current : new Set(current).add(targetTab),
        );
      }
    },
    [SCREEN_WIDTH],
  );

  return (
    <AppGradientBackground>
      <View style={{ flex: 1, backgroundColor: "transparent" }}>
        {/* Swipeable Tabs Container */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScrollBeginDrag={handleScrollBeginDrag}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
          decelerationRate="fast"
          scrollEnabled={!showAwards}
          style={{ flex: 1 }}
        >
          {/* ── 1. HOME TAB ── */}
          <View
            style={{
              width: SCREEN_WIDTH,
              flex: 1,
              paddingTop: insets.top,
              justifyContent: "center",
            }}
          >
            <ScrollView
              style={{ flex: 1, paddingHorizontal: 13 }}
              showsVerticalScrollIndicator={false}
            >
                {/* ── Header ── */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 10,
                    marginBottom: 10,
                    marginHorizontal: 5,
                  }}
                >
                  <Image
                    source={require("../../assets/sudukoLogo.svg")}
                    style={{ width: 140, height: 40 }}
                    contentFit="contain"
                  />
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                      onPress={() => setShowAwards(true)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#FFFFFF",
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                        borderRadius: 999,
                        paddingHorizontal: 15,
                        paddingVertical: 5,
                        marginRight: 5,
                      }}
                    >
                      <StreakFlame size={22} />
                      <Text
                        style={{
                          color: "#374151",
                          fontWeight: "bold",
                          marginLeft: 7,
                          fontSize: 15,
                        }}
                      >
                        {streak}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* ── Dashboard: Calendar + Pager ── */}
                <View style={{ marginBottom: 7 }}>
                  {/* Calendar Strip */}
                  <WeeklyCalendarStrip />

                  {/* Stats + Chart */}
                  <DashboardPager
                    solved={SOLVED}
                    totalSolved={TOTAL_SOLVED}
                    lifetimeTotalSolved={totalSolved || 0}
                    winRate={WIN_RATE}
                    bestTime={BEST_TIME}
                  />
                </View>

                {/* ── Action Buttons ── */}
                <View style={{ gap: 10 }}>
                  {/* ── New Game (Primary — Top) ── */}
                  <TouchableOpacity
                    onPress={() => setShowDifficultySheet(true)}
                    style={{
                      backgroundColor: "#3B82F6",
                      borderRadius: 20,
                      paddingVertical: 18,
                      paddingHorizontal: 24,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      shadowColor: "#3B82F6",
                      shadowOpacity: 0.35,
                      shadowRadius: 12,
                      shadowOffset: { width: 0, height: 6 },
                      elevation: 5,
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        {t('home.newGame')}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 3,
                        }}
                      >
                        <StreakFlame size={18} color="rgba(255,255,255,0.85)" />
                        <Text
                          style={{
                            color: "rgba(255,255,255,0.85)",
                            fontSize: 13,
                            marginLeft: 4,
                            fontWeight: "500",
                          }}
                        >
                          {streak > 0 ? `${t('home.streak')} ${streak}` : t('home.startStreak')}
                        </Text>
                      </View>
                    </View>
                    {/* Right arrow circle */}
                    <View
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 999,
                        backgroundColor: "rgba(255,255,255,0.2)",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
                    </View>
                  </TouchableOpacity>

                  {/* ── Continue Game (Secondary — Bottom) ── */}
                  <TouchableOpacity
                    onPress={() =>
                      isOngoingGame
                        ? setScreen("playing")
                        : setShowDifficultySheet(true)
                    }
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: 20,
                      paddingVertical: 18,
                      paddingHorizontal: 24,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderWidth: 1,
                      borderColor: "#E5E7EB",
                      shadowColor: "#00000040",
                      shadowOpacity: 0.06,
                      shadowRadius: 10,
                      shadowOffset: { width: 0, height: 4 },
                      elevation: 2,
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          color: "#1C1F2E",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        {t('home.continueGame')}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 3,
                        }}
                      >
                        <Play size={13} color="#6B7280" fill="#6B7280" />
                        <Text
                          style={{
                            color: "#6B7280",
                            fontSize: 13,
                            marginLeft: 4,
                            fontWeight: "500",
                          }}
                        >
                          {continueProgressLabel}
                        </Text>
                      </View>
                    </View>
                    {/* Right arrow circle */}
                    <View
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 999,
                        backgroundColor: "#F3F4F6",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Play size={18} color="#1C1F2E" fill="#1C1F2E" />
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={{ height: 100 }} />
              </ScrollView>
          </View>

          {/* ── 2. DAILY CHALLENGES TAB ── */}
          <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
            {visitedTabs.has("daily") && <MemoizedDailyChallengesScreen />}
          </View>

          {/* ── 3. SETTINGS TAB ── */}
          <View
            style={{
              width: SCREEN_WIDTH,
              flex: 1,
            }}
          >
            {visitedTabs.has("settings") && (
              <MemoizedSettingsScreen
                onOpenPaywall={onOpenPaywall}
                onRestorePurchases={onRestorePurchases}
                onOpenAwards={handleOpenAwards}
              />
            )}
          </View>
        </ScrollView>

        {/* Bottom Nav */}
        {!showAwards && (
          <BottomNav activeTab={activeTab} setActiveTab={handleTabPress} />
        )}

        {/* Full-Screen Awards Overlay */}
        {showAwards && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: "#EFF3F8",
                paddingTop: insets.top,
                zIndex: 999,
              },
            ]}
          >
            <AwardsScreen onBack={() => setShowAwards(false)} />
          </View>
        )}

        <DifficultyBottomSheet
          visible={showDifficultySheet}
          onClose={() => setShowDifficultySheet(false)}
          onSelect={handleDifficultySelect}
        />
        
        <DailyChallengePopup
          onStart={(dateStr) => {
            useGameStore.getState().startDailyChallenge(dateStr);
          }}
        />
      </View>
    </AppGradientBackground>
  );
}
