import React from "react";
import { Text } from "../components/Text";
import {
  View,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, Calendar, Settings, Play, Crown } from "lucide-react-native";
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

// ────────────────────────────────────────────────────────────────────────────
// Bottom Navigation (shared across tabs)
// ────────────────────────────────────────────────────────────────────────────
function BottomNav({
  activeTab,
  setActiveTab,
}: {
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
}) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const active = "#1C1F2E";
  const inactive = "#8E8E93";

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        justifyContent: "space-around",
        paddingTop: 8,
        paddingBottom: Math.max(insets.bottom, 10),
        borderTopWidth: 1,
        borderTopColor: "#EBEBEB",
      }}
    >
      <TouchableOpacity
        onPress={() => setActiveTab("home")}
        style={{ alignItems: "center", flex: 1 }}
        activeOpacity={0.7}
      >
        <Home
          size={24}
          color={activeTab === "home" ? active : inactive}
          strokeWidth={activeTab === "home" ? 2.2 : 1.8}
        />
        <Text
          style={{
            fontSize: 11,
            fontWeight: activeTab === "home" ? "700" : "500",
            color: activeTab === "home" ? active : inactive,
            marginTop: 4,
          }}
        >
          {t('tabs.home')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setActiveTab("daily")}
        style={{ alignItems: "center", flex: 1 }}
        activeOpacity={0.7}
      >
        <Calendar
          size={24}
          color={activeTab === "daily" ? active : inactive}
          strokeWidth={activeTab === "daily" ? 2.2 : 1.8}
        />
        <Text
          style={{
            fontSize: 11,
            fontWeight: activeTab === "daily" ? "700" : "500",
            color: activeTab === "daily" ? active : inactive,
            marginTop: 4,
          }}
        >
          {t('tabs.daily')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setActiveTab("settings")}
        style={{ alignItems: "center", flex: 1 }}
        activeOpacity={0.7}
      >
        <Settings
          size={24}
          color={activeTab === "settings" ? active : inactive}
          strokeWidth={activeTab === "settings" ? 2.2 : 1.8}
        />
        <Text
          style={{
            fontSize: 11,
            fontWeight: activeTab === "settings" ? "700" : "500",
            color: activeTab === "settings" ? active : inactive,
            marginTop: 4,
          }}
        >
          {t('tabs.settings')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

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

  const { t } = useTranslation();
  const scrollRef = React.useRef<ScrollView>(null);
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const TABS: Tab[] = ["home", "daily", "settings"];

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

  const SOLVED = todaySolved || 0;
  const TOTAL_SOLVED = totalSolved || 0;
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
    NativeStatusBar.setBackgroundColor("transparent", true);
    NativeStatusBar.setTranslucent(true);
  }, [activeTab]);

  const handleTabPress = (tab: Tab) => {
    setActiveTab(tab);
    const index = TABS.indexOf(tab);
    scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
  };

  const handleScroll = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (TABS[index] && TABS[index] !== activeTab) {
      setActiveTab(TABS[index]);
    }
  };

  return (
    <AppGradientBackground>
      <View style={{ flex: 1, backgroundColor: "transparent" }}>
        {/* Swipeable Tabs Container */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
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
            {showAwards ? (
              <AwardsScreen onBack={() => setShowAwards(false)} />
            ) : (
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
                      onPress={onOpenPaywall}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: isPremium ? "#FEF3C7" : "#FFFFFF",
                        borderWidth: 1,
                        borderColor: isPremium ? "#FDE68A" : "#E5E7EB",
                        borderRadius: 999,
                        paddingHorizontal: 12,
                        paddingVertical: 5,
                        marginRight: 8,
                      }}
                      activeOpacity={0.7}
                    >
                      <Crown size={18} color={isPremium ? "#D97706" : "#EAB308"} />
                      <Text
                        style={{
                          color: isPremium ? "#B45309" : "#374151",
                          fontWeight: "bold",
                          marginLeft: 5,
                          fontSize: 13,
                        }}
                      >
                        {isPremium ? "PRO" : "VIP"}
                      </Text>
                    </TouchableOpacity>

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
            )}
          </View>

          {/* ── 2. DAILY CHALLENGES TAB ── */}
          <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
            <DailyChallengesScreen />
          </View>

          {/* ── 3. SETTINGS TAB ── */}
          <View
            style={{
              width: SCREEN_WIDTH,
              flex: 1,
            }}
          >
            <SettingsScreen
              onOpenPaywall={onOpenPaywall}
              onRestorePurchases={onRestorePurchases}
            />
          </View>
        </ScrollView>

        {/* Bottom Nav */}
        {!showAwards && (
          <BottomNav activeTab={activeTab} setActiveTab={handleTabPress} />
        )}

        <DifficultyBottomSheet
          visible={showDifficultySheet}
          onClose={() => setShowDifficultySheet(false)}
          onSelect={(diff) => {
            setShowDifficultySheet(false);
            startNewGame(diff);
            setScreen("playing");
          }}
        />
      </View>
    </AppGradientBackground>
  );
}
