import React, { useState, useMemo } from "react";
import { Text } from "../ui/Text";
import { View, TouchableOpacity } from "react-native";
import { Trophy, Zap, TrendingUp } from "lucide-react-native";
import { useGameStore, getDailyChallengeItem } from "../../store/useGameStore";
import { useTranslation } from "../../i18n";
import { Difficulty } from "../../utils/sudokuLogic";
import { DifficultyBottomSheet } from "../game/DifficultyBottomSheet";

type TimeTab = "Day" | "Week" | "Month";
type MetricFilter = "Both" | "WinRate" | "BestTime" | "WonGames";

interface ChartItem {
  label: string;
  winRate: number; // %
  bestSec: number; // seconds
  solved: number; // absolute count
  hasPlayed: boolean;
}

const CARD_SHADOW = {
  backgroundColor: "#FFFFFF",
  borderRadius: 25,
  borderWidth: 0.7,
  borderColor: "#E5E7EB",
};

function formatTime(seconds: number): string {
  if (!seconds || seconds <= 0) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

const BAR_MAX_HEIGHT = 140;
const CHART_AREA_HEIGHT = 175;

const COLOR_WIN = "#04B2F1"; // Cyan / Light Blue
const COLOR_TIME = "#AB88EC"; // Lavender / Purple

export function PerformanceChart() {
  const { t } = useTranslation();
  const [activeTimeTab, setActiveTimeTab] = useState<TimeTab>("Day");
  const [metricFilter, setMetricFilter] = useState<MetricFilter>("Both");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "All">("All");
  const [showDifficultySheet, setShowDifficultySheet] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1;
  });

  const dailyHistory = useGameStore((s) => s.dailyHistory) || {};
  const dailyChallengesProgress = useGameStore((s) => s.dailyChallengesProgress) || {};
  const difficultyStats = useGameStore((s) => s.difficultyStats) || {};
  const todaySolved = useGameStore((s) => s.todaySolved) || 0;
  const bestTimeSec = useGameStore((s) => s.bestTimeSec) || 0;

  const data: ChartItem[] = useMemo(() => {
    const toDateKey = (d: Date): string => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    const getDayStat = (dateStr: string, isTodayDate: boolean) => {
      if (selectedDifficulty !== "All") {
        const dStat = difficultyStats[selectedDifficulty];
        const played = dStat?.played || 0;
        const solved = dStat?.solved || 0;
        const best = dStat?.bestSec || 0;
        return {
          played,
          solved,
          bestSec: best,
          hasPlayed: played > 0 || solved > 0,
        };
      }

      let stat = dailyHistory[dateStr];
      const challengeItem = getDailyChallengeItem(dailyChallengesProgress, dateStr);

      let played = stat?.played || 0;
      let solved = stat?.solved || 0;
      let best = stat?.bestSec ?? null;

      if (challengeItem?.completed) {
        solved = Math.max(solved, 1);
        played = Math.max(played, solved);
        if (challengeItem.timeSec) {
          best = best === null ? challengeItem.timeSec : Math.min(best, challengeItem.timeSec);
        }
      }

      if (isTodayDate && todaySolved > 0) {
        solved = Math.max(solved, todaySolved);
        played = Math.max(played, solved);
        if (bestTimeSec > 0) {
          best = best === null ? bestTimeSec : Math.min(best, bestTimeSec);
        }
      }

      return {
        played,
        solved,
        bestSec: best || 0,
        hasPlayed: played > 0 || solved > 0,
      };
    };

    if (activeTimeTab === "Day") {
      const now = new Date();
      const nowDay = now.getDay();
      const mondayDiff = now.getDate() - nowDay + (nowDay === 0 ? -6 : 1);
      const monday = new Date(now);
      monday.setDate(mondayDiff);

      const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return dayLabels.map((lbl, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const key = toDateKey(d);
        const isToday = key === toDateKey(now);
        const s = getDayStat(key, isToday);
        const winRate = s.played > 0
          ? Math.min(100, Math.round((s.solved / s.played) * 100))
          : (s.solved > 0 ? 100 : 0);

        return {
          label: lbl,
          winRate,
          bestSec: s.bestSec,
          solved: s.solved,
          hasPlayed: s.hasPlayed,
        };
      });
    }

    if (activeTimeTab === "Week") {
      const now = new Date();
      const nowDay = now.getDay();
      const thisMonday = new Date(now);
      thisMonday.setDate(now.getDate() - nowDay + (nowDay === 0 ? -6 : 1));

      const weeks: ChartItem[] = [];
      for (let w = 6; w >= 0; w--) {
        const weekMon = new Date(thisMonday);
        weekMon.setDate(thisMonday.getDate() - w * 7);

        let weekPlayed = 0;
        let weekSolved = 0;
        let weekBest: number | null = null;

        for (let d = 0; d < 7; d++) {
          const dayDate = new Date(weekMon);
          dayDate.setDate(weekMon.getDate() + d);
          const key = toDateKey(dayDate);
          const isToday = key === toDateKey(now);
          const s = getDayStat(key, isToday);

          weekPlayed += s.played;
          weekSolved += s.solved;
          if (s.bestSec > 0) {
            weekBest = weekBest === null ? s.bestSec : Math.min(weekBest, s.bestSec);
          }
        }

        const hasPlayed = weekPlayed > 0 || weekSolved > 0;
        const winRate = weekPlayed > 0
          ? Math.min(100, Math.round((weekSolved / weekPlayed) * 100))
          : (weekSolved > 0 ? 100 : 0);
        const label = w === 0 ? "Now" : `${w}w`;

        weeks.push({
          label,
          winRate,
          bestSec: weekBest || 0,
          solved: weekSolved,
          hasPlayed,
        });
      }
      return weeks;
    }

    // Month view: last 7 months
    const now = new Date();
    const months: ChartItem[] = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let m = 6; m >= 0; m--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const targetYear = targetDate.getFullYear();
      const targetMonth = targetDate.getMonth();
      const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

      let monthPlayed = 0;
      let monthSolved = 0;
      let monthBest: number | null = null;

      for (let d = 1; d <= daysInMonth; d++) {
        const dayDate = new Date(targetYear, targetMonth, d);
        const key = toDateKey(dayDate);
        const isToday = key === toDateKey(now);
        const s = getDayStat(key, isToday);

        monthPlayed += s.played;
        monthSolved += s.solved;
        if (s.bestSec > 0) {
          monthBest = monthBest === null ? s.bestSec : Math.min(monthBest, s.bestSec);
        }
      }

      const hasPlayed = monthPlayed > 0 || monthSolved > 0;
      const winRate = monthPlayed > 0
        ? Math.min(100, Math.round((monthSolved / monthPlayed) * 100))
        : (monthSolved > 0 ? 100 : 0);

      months.push({
        label: monthNames[targetMonth],
        winRate,
        bestSec: monthBest || 0,
        solved: monthSolved,
        hasPlayed,
      });
    }
    return months;
  }, [activeTimeTab, dailyHistory, dailyChallengesProgress, todaySolved, bestTimeSec, selectedDifficulty, difficultyStats]);

  const playedItems = data.filter((d) => d.hasPlayed);
  const maxTimeSec = playedItems.length > 0 ? Math.max(...playedItems.filter(d => d.bestSec > 0).map((d) => d.bestSec), 1) : 1;
  const maxSolved = playedItems.length > 0 ? Math.max(...playedItems.map((d) => d.solved), 1) : 1;
  const timeTabs: TimeTab[] = ["Day", "Week", "Month"];

  const handleTabChange = (tab: TimeTab) => {
    setActiveTimeTab(tab);
    if (tab === "Day") {
      const day = new Date().getDay();
      setSelectedDay(day === 0 ? 6 : day - 1);
    } else {
      setSelectedDay(6); // Select current week/month (last index)
    }
  };

  return (
    <View
      style={{
        ...CARD_SHADOW,
        padding: 15,
        marginTop: 10,
        height: 328,
        justifyContent: "space-between",
      }}
    >
      {/* Header Row: Title & Timeframe Switcher */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            fontSize: 17,
            fontWeight: "bold",
            color: "#1C1F2E",
            marginLeft: 3,
          }}
        >
          {t('home.performance')}
        </Text>

        {/* Day | Week | Month switcher */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#F3F4F6",
            borderRadius: 20,
            padding: 3,
          }}
        >
          {timeTabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => handleTabChange(tab)}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 16,
                backgroundColor:
                  activeTimeTab === tab ? "#FFFFFF" : "transparent",
                shadowColor: activeTimeTab === tab ? "#000" : "transparent",
                shadowOpacity: activeTimeTab === tab ? 0.08 : 0,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 1 },
                elevation: activeTimeTab === tab ? 2 : 0,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: activeTimeTab === tab ? "bold" : "400",
                  color: activeTimeTab === tab ? "#1C1F2E" : "#9CA3AF",
                }}
              >
                {tab === "Day" ? t('home.day') : tab === "Week" ? t('home.week') : t('home.month')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Metric Filter Legend Pills (All | Win Rate | Best Time) */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          marginBottom: 14,
        }}
      >


        {/* All */}
        <TouchableOpacity
          onPress={() => setMetricFilter("Both")}
          activeOpacity={0.7}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            paddingHorizontal: 9,
            paddingVertical: 4,
            borderRadius: 12,
            backgroundColor: metricFilter === "Both" ? "#1C1F2E" : "transparent",
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: metricFilter === "Both" ? "700" : "500",
              color: metricFilter === "Both" ? "#FFFFFF" : "#9CA3AF",
            }}
          >
            {t('home.all')}
          </Text>
        </TouchableOpacity>

        {/* Win Rate */}
        <TouchableOpacity
          onPress={() => setMetricFilter("WinRate")}
          activeOpacity={0.7}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            paddingHorizontal: 9,
            paddingVertical: 4,
            borderRadius: 12,
            backgroundColor:
              metricFilter === "WinRate" ? `${COLOR_WIN}22` : "transparent",
          }}
        >
          <View
            style={{
              width: 7,
              height: 7,
              borderRadius: 3.5,
              backgroundColor: COLOR_WIN,
              opacity: metricFilter === "WinRate" ? 1 : 0.5,
            }}
          />
          <Text
            style={{
              fontSize: 11,
              fontWeight: metricFilter === "WinRate" ? "700" : "500",
              color: metricFilter === "WinRate" ? "#04B2F1" : "#9CA3AF",
            }}
          >
            {t('home.winRate')}
          </Text>
        </TouchableOpacity>

        {/* Best Time */}
        <TouchableOpacity
          onPress={() => setMetricFilter("BestTime")}
          activeOpacity={0.7}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            paddingHorizontal: 9,
            paddingVertical: 4,
            borderRadius: 12,
            backgroundColor:
              metricFilter === "BestTime" ? `${COLOR_TIME}22` : "transparent",
          }}
        >
          <View
            style={{
              width: 7,
              height: 7,
              borderRadius: 3.5,
              backgroundColor: COLOR_TIME,
              opacity: metricFilter === "BestTime" ? 1 : 0.5,
            }}
          />
          <Text
            style={{
              fontSize: 11,
              fontWeight: metricFilter === "BestTime" ? "700" : "500",
              color: metricFilter === "BestTime" ? "#7C3AED" : "#9CA3AF",
            }}
          >
            {t('home.bestTime')}
          </Text>
        </TouchableOpacity>

        {/* Won Games */}
        <TouchableOpacity
          onPress={() => setMetricFilter("WonGames")}
          activeOpacity={0.7}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            paddingHorizontal: 9,
            paddingVertical: 4,
            borderRadius: 12,
            backgroundColor:
              metricFilter === "WonGames" ? `#10B98122` : "transparent",
          }}
        >
          <View
            style={{
              width: 7,
              height: 7,
              borderRadius: 3.5,
              backgroundColor: "#10B981",
              opacity: metricFilter === "WonGames" ? 1 : 0.5,
            }}
          />
          <Text
            style={{
              fontSize: 11,
              fontWeight: metricFilter === "WonGames" ? "700" : "500",
              color: metricFilter === "WonGames" ? "#059669" : "#9CA3AF",
            }}
          >
            Won
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bars Container */}
      <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
        {data.map((item, index) => {
          const isSelected = index === selectedDay;
          const label = item.label;

          const isPlayed = item.hasPlayed && (item.winRate > 0 || item.bestSec > 0 || item.solved > 0);
          const winHeight = isPlayed && item.winRate > 0
            ? Math.max(12, (item.winRate / 100) * BAR_MAX_HEIGHT)
            : 4;
          const timeHeight = isPlayed && item.bestSec > 0 && maxTimeSec > 0
            ? Math.max(12, (item.bestSec / maxTimeSec) * BAR_MAX_HEIGHT)
            : 4;
          const wonHeight = isPlayed && item.solved > 0 && maxSolved > 0
            ? Math.max(12, (item.solved / maxSolved) * BAR_MAX_HEIGHT)
            : 4;

          const showWin = metricFilter === "Both" || metricFilter === "WinRate";
          const showTime = metricFilter === "Both" || metricFilter === "BestTime";
          const showWon = metricFilter === "WonGames";
          
          const isSingle = !showWin || !showTime || showWon;
          const barWidth = isSingle ? 35 : 20;

          // Dynamic height of the bar(s) for this day so the tooltip floats right above it
          const targetBarHeight = !isPlayed
            ? 4
            : showWon
              ? wonHeight
              : isSingle
                ? showWin
                  ? winHeight
                  : timeHeight
                : Math.max(winHeight, timeHeight);

          return (
            <TouchableOpacity
              key={`${activeTimeTab}-${index}`}
              activeOpacity={0.8}
              onPress={() => setSelectedDay(index)}
              accessibilityRole="button"
              accessibilityLabel={
                item.hasPlayed
                  ? `${label}: Win Rate ${item.winRate}%, Best Time ${formatTime(item.bestSec)}, Won ${item.solved}`
                  : `${label}: No games played`
              }
              accessibilityState={{ selected: isSelected }}
              style={{
                alignItems: "center",
                flex: 1,
                zIndex: isSelected ? 99 : 1,
              }}
            >
              {/* Column Chart Area: Holds bars at the bottom and floating tooltip dynamically above */}
              <View
                style={{
                  height: CHART_AREA_HEIGHT,
                  width: "100%",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                {/* Floating Tooltip directly above bar according to its height */}
                {isSelected && (
                  <View
                    style={{
                      position: "absolute",
                      bottom: targetBarHeight + 5,
                      alignItems: "center",
                      zIndex: 100,
                    }}
                    pointerEvents="none"
                  >
                    <View
                      style={{
                        backgroundColor: "#1C1F2E",
                        borderRadius: 8,
                        paddingHorizontal: 7,
                        paddingVertical: 3.5,
                        alignItems: "center",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.18,
                        shadowRadius: 4,
                        elevation: 4,
                      }}
                    >
                      {!item.hasPlayed ? (
                        <Text
                          style={{
                            color: "#9CA3AF",
                            fontSize: 9.5,
                            fontWeight: "600",
                          }}
                        >
                          No games
                        </Text>
                      ) : isSingle ? (
                        <Text
                          style={{
                            color: "#FFFFFF",
                            fontSize: 10,
                            fontWeight: "bold",
                          }}
                        >
                          {showWon
                            ? `${item.solved}`
                            : showWin
                              ? `${item.winRate}%`
                              : formatTime(item.bestSec)}
                        </Text>
                      ) : (
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 5,
                            alignItems: "center",
                          }}
                        >
                          {/* Win Rate with Cyan Dot */}
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 3,
                            }}
                          >
                            <View
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: 2.5,
                                backgroundColor: COLOR_WIN,
                              }}
                            />
                            <Text
                              style={{
                                color: "#FFFFFF",
                                fontSize: 9,
                                fontWeight: "bold",
                              }}
                            >
                              {item.winRate}%
                            </Text>
                          </View>

                          <Text style={{ color: "#6B7280", fontSize: 8 }}>
                            |
                          </Text>

                          {/* Best Time with Purple Dot */}
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 3,
                            }}
                          >
                            <View
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: 2.5,
                                backgroundColor: COLOR_TIME,
                              }}
                            />
                            <Text
                              style={{
                                color: "#FFFFFF",
                                fontSize: 9,
                                fontWeight: "bold",
                              }}
                            >
                              {formatTime(item.bestSec)}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>

                    {/* Downward Caret Arrow pointing down to the bar */}
                    <View
                      style={{
                        width: 0,
                        height: 0,
                        borderLeftWidth: 4,
                        borderRightWidth: 4,
                        borderTopWidth: 4,
                        borderLeftColor: "transparent",
                        borderRightColor: "transparent",
                        borderTopColor: "#1C1F2E",
                      }}
                    />
                  </View>
                )}

                {/* Bars: Paired or Single or Unplayed Baseline */}
                {!item.hasPlayed ? (
                  <View
                    style={{
                      width: isSingle ? 28 : 34,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: isSelected ? "#9CA3AF" : "#E5E7EB",
                    }}
                  />
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-end",
                      gap: 3,
                    }}
                  >
                    {/* Won Games Bar */}
                    {showWon && (
                      <View
                        style={{
                          width: barWidth,
                          height: wonHeight,
                          borderRadius: 4,
                          backgroundColor: "#10B981",
                          opacity: isSelected ? 1 : 0.6,
                        }}
                      />
                    )}

                    {/* Win Rate Bar */}
                    {showWin && !showWon && (
                      <View
                        style={{
                          width: barWidth,
                          height: winHeight,
                          borderRadius: 4,
                          backgroundColor: COLOR_WIN,
                          opacity: isSelected ? 1 : 0.6,
                        }}
                      />
                    )}

                    {/* Best Time Bar */}
                    {showTime && !showWon && (
                      <View
                        style={{
                          width: barWidth,
                          height: timeHeight,
                          borderRadius: 4,
                          backgroundColor: COLOR_TIME,
                          opacity: isSelected ? 1 : 0.6,
                        }}
                      />
                    )}
                  </View>
                )}
              </View>

              {/* Day / Week / Month Label */}
              <Text
                style={{
                  fontSize: 10,
                  color: isSelected ? "#1C1F2E" : "#9CA3AF",
                  fontWeight: isSelected ? "bold" : "400",
                  marginTop: 6,
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <DifficultyBottomSheet
        visible={showDifficultySheet}
        onClose={() => setShowDifficultySheet(false)}
        onSelect={(diff) => {
          setSelectedDifficulty(diff);
          setShowDifficultySheet(false);
        }}
        includeAll={true}
      />
    </View>
  );
}
