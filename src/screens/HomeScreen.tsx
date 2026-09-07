import React from "react";
import { Text } from "../components/Text";
import {
  View,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { StatusBar as NativeStatusBar } from "react-native";

import { Difficulty } from "../utils/sudokuLogic";

type HomeScreenProps = {
  setScreen: (screen: "home" | "playing") => void;
  startNewGame: (difficulty: Difficulty) => void;
  history?: any[];
  isPremium?: boolean;
  setPremium?: (val: boolean) => void;
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
  const active = "#1C1F2E";
  const inactive = "#9CA3AF";

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "#F4F3F0",
        flexDirection: "row",
        justifyContent: "space-around",
        paddingTop: 12,
        paddingBottom: 28,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
      }}
    >
      <TouchableOpacity
        onPress={() => setActiveTab("home")}
        style={{ alignItems: "center", flex: 1 }}
      >
        <Home size={26} color={activeTab === "home" ? active : inactive} />
        <Text
          style={{
            fontSize: 11,
            fontWeight: "bold",
            color: activeTab === "home" ? active : inactive,
            marginTop: 3,
          }}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setActiveTab("daily")}
        style={{ alignItems: "center", flex: 1 }}
      >
        <Calendar size={26} color={activeTab === "daily" ? active : inactive} />
        <Text
          style={{
            fontSize: 11,
            fontWeight: "bold",
            color: activeTab === "daily" ? active : inactive,
            marginTop: 3,
          }}
        >
          Daily
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setActiveTab("settings")}
        style={{ alignItems: "center", flex: 1 }}
      >
        <Settings
          size={26}
          color={activeTab === "settings" ? active : inactive}
        />
        <Text
          style={{
            fontSize: 11,
            fontWeight: "bold",
            color: activeTab === "settings" ? active : inactive,
            marginTop: 3,
          }}
        >
          Settings
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
}: HomeScreenProps) {
  const [showDifficultySheet, setShowDifficultySheet] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<Tab>("home");
  const [showAwards, setShowAwards] = React.useState(false);

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

  const isOngoingGame = board.length > 0 && !isGameCompleted && mistakes < 3;
  const continueProgressLabel = isOngoingGame
    ? `${formatProgressTimer(timer)} · ${difficulty}`
    : "Select difficulty";

  const SOLVED = todaySolved || 0;
  const TOTAL_SOLVED = totalSolved || 0;
  const WIN_RATE =
    (totalPlayed || 0) > 0
      ? Math.round(((totalSolved || 0) / totalPlayed) * 100)
      : 0;
  const BEST_TIME = formatBestTime(bestTimeSec);
  const STREAK = streak;

  React.useEffect(() => {
    NativeStatusBar.setBarStyle("dark-content");
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
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        {/* Swipeable Tabs Container */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          style={{ flex: 1 }}
        >
          {/* ── 1. HOME TAB ── */}
          <View
            style={{ width: SCREEN_WIDTH, flex: 1, justifyContent: "center" }}
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
                      // shadowColor: "#000",
                      // shadowOpacity: 0.06,
                      // shadowRadius: 4,
                      // shadowOffset: { width: 0, height: 2 },
                      // elevation: 2,
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
                        New Game
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
                          {streak > 0 ? `Streak ${streak}` : "Start Streak"}
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
                        Continue Game
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
          <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
            <SettingsScreen />
          </View>
        </ScrollView>

        {/* Bottom Nav */}
        <BottomNav activeTab={activeTab} setActiveTab={handleTabPress} />

        <DifficultyBottomSheet
          visible={showDifficultySheet}
          onClose={() => setShowDifficultySheet(false)}
          onSelect={(diff) => {
            setShowDifficultySheet(false);
            startNewGame(diff);
            setScreen("playing");
          }}
        />
      </SafeAreaView>
    </AppGradientBackground>
  );
}
