import React, { useState, useMemo } from "react";
import { Text } from "../ui/Text";
import { View, TouchableOpacity } from "react-native";
import { Trophy, Zap, TrendingUp } from "lucide-react-native";
import { useGameStore } from "../../store/useGameStore";

type TimeTab = "Day" | "Week" | "Month";
type MetricFilter = "Both" | "WinRate" | "BestTime";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface DayData {
  winRate: number; // %
  bestSec: number; // seconds
  hasPlayed: boolean;
}

const MOCK_PERFORMANCE_DATA: Record<TimeTab, DayData[]> = {
  Day: [
    { winRate: 45, bestSec: 225, hasPlayed: true }, // Mon: 45%, 3:45
    { winRate: 70, bestSec: 170, hasPlayed: true }, // Tue: 70%, 2:50
    { winRate: 60, bestSec: 195, hasPlayed: true }, // Wed: 60%, 3:15
    { winRate: 90, bestSec: 130, hasPlayed: true }, // Thu: 90%, 2:10
    { winRate: 80, bestSec: 160, hasPlayed: true }, // Fri: 80%, 2:40
    { winRate: 65, bestSec: 210, hasPlayed: true }, // Sat: 65%, 3:30
    { winRate: 85, bestSec: 145, hasPlayed: true }, // Sun: 85%, 2:25
  ],
  Week: [
    { winRate: 65, bestSec: 200, hasPlayed: true },
    { winRate: 55, bestSec: 220, hasPlayed: true },
    { winRate: 75, bestSec: 175, hasPlayed: true },
    { winRate: 85, bestSec: 150, hasPlayed: true },
    { winRate: 70, bestSec: 190, hasPlayed: true },
    { winRate: 80, bestSec: 165, hasPlayed: true },
    { winRate: 90, bestSec: 135, hasPlayed: true },
  ],
  Month: [
    { winRate: 60, bestSec: 210, hasPlayed: true },
    { winRate: 70, bestSec: 180, hasPlayed: true },
    { winRate: 50, bestSec: 240, hasPlayed: true },
    { winRate: 80, bestSec: 165, hasPlayed: true },
    { winRate: 95, bestSec: 125, hasPlayed: true },
    { winRate: 75, bestSec: 170, hasPlayed: true },
    { winRate: 85, bestSec: 140, hasPlayed: true },
  ],
};

const CARD_SHADOW = {
  backgroundColor: "#FFFFFF",
  borderRadius: 20,
  shadowColor: "#000",
  shadowOpacity: 0.06,
  elevation: 1,
};

function formatTime(seconds: number): string {
  if (!seconds || seconds <= 0) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

const BAR_MAX_HEIGHT = 130;

const COLOR_WIN = "#1C1F2E"; // Deep Navy
const COLOR_TIME = "#10B981"; // Emerald Green

export function PerformanceChart() {
  const [activeTimeTab, setActiveTimeTab] = useState<TimeTab>("Day");
  const [metricFilter, setMetricFilter] = useState<MetricFilter>("Both");
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1;
  });

  const totalSolved = useGameStore((s) => s.totalSolved) || 0;
  const totalPlayed = useGameStore((s) => s.totalPlayed) || 0;
  const bestTimeSec = useGameStore((s) => s.bestTimeSec) || 0;

  // Use real data if present, otherwise fallback to rich mock data for visual inspection
  const data: DayData[] = useMemo(() => {
    if (totalPlayed > 0 && totalSolved > 0) {
      const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
      const currentWinRate = Math.round((totalSolved / totalPlayed) * 100);

      return DAY_LABELS.map((_, i) => {
        if (i === todayIdx) {
          return {
            winRate: currentWinRate,
            bestSec: bestTimeSec,
            hasPlayed: true,
          };
        }
        // Fallback surrounding days from mock data for realistic aesthetic
        return MOCK_PERFORMANCE_DATA[activeTimeTab][i];
      });
    }

    return MOCK_PERFORMANCE_DATA[activeTimeTab];
  }, [totalSolved, totalPlayed, bestTimeSec, activeTimeTab]);

  const maxTimeSec = Math.max(...data.map((d) => d.bestSec), 1);
  const timeTabs: TimeTab[] = ["Day", "Week", "Month"];

  return (
    <View style={{ ...CARD_SHADOW, padding: 18, marginTop: 10 }}>
      {/* Header Row: Title & Timeframe Switcher */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "bold", color: "#1C1F2E" }}>
          Performance
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
              onPress={() => setActiveTimeTab(tab)}
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
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Metric Filter Legend Pills (Both | Win Rate | Best Time) */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <TouchableOpacity
          onPress={() => setMetricFilter("Both")}
          activeOpacity={0.7}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 12,
            backgroundColor:
              metricFilter === "Both" ? "#F3F4F6" : "transparent",
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: metricFilter === "Both" ? "700" : "500",
              color: metricFilter === "Both" ? "#1C1F2E" : "#9CA3AF",
            }}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setMetricFilter(metricFilter === "WinRate" ? "Both" : "WinRate")
          }
          activeOpacity={0.7}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 12,
            backgroundColor:
              metricFilter === "WinRate" ? "#F1F5F9" : "transparent",
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: COLOR_WIN,
            }}
          />
          <Text
            style={{
              fontSize: 11,
              fontWeight: metricFilter === "WinRate" ? "700" : "500",
              color: metricFilter === "WinRate" ? "#1C1F2E" : "#64748B",
            }}
          >
            Win Rate (%)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setMetricFilter(metricFilter === "BestTime" ? "Both" : "BestTime")
          }
          activeOpacity={0.7}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 12,
            backgroundColor:
              metricFilter === "BestTime" ? "#ECFDF5" : "transparent",
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: COLOR_TIME,
            }}
          />
          <Text
            style={{
              fontSize: 11,
              fontWeight: metricFilter === "BestTime" ? "700" : "500",
              color: metricFilter === "BestTime" ? "#065F46" : "#64748B",
            }}
          >
            Best Time
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bars Container */}
      <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
        {data.map((item, index) => {
          const isSelected = index === selectedDay;
          const label = DAY_LABELS[index];

          const winHeight = Math.max(10, (item.winRate / 100) * BAR_MAX_HEIGHT);
          const timeHeight = Math.max(
            10,
            (item.bestSec / maxTimeSec) * BAR_MAX_HEIGHT
          );

          const showWin = metricFilter === "Both" || metricFilter === "WinRate";
          const showTime =
            metricFilter === "Both" || metricFilter === "BestTime";
          const isSingle = !showWin || !showTime;

          const barWidth = isSingle ? 24 : 11;

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => setSelectedDay(index)}
              accessibilityRole="button"
              accessibilityLabel={`${label}: Win Rate ${item.winRate}%, Best Time ${formatTime(item.bestSec)}`}
              accessibilityState={{ selected: isSelected }}
              style={{ alignItems: "center", flex: 1 }}
            >
              {/* Floating Tooltip */}
              {isSelected ? (
                <View
                  style={{
                    backgroundColor: "#1C1F2E",
                    borderRadius: 8,
                    paddingHorizontal: 6,
                    paddingVertical: 3,
                    marginBottom: 4,
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  {isSingle ? (
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontSize: 9,
                        fontWeight: "bold",
                      }}
                    >
                      {showWin
                        ? `${item.winRate}%`
                        : formatTime(item.bestSec)}
                    </Text>
                  ) : (
                    <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 9,
                          fontWeight: "bold",
                        }}
                      >
                        {item.winRate}%
                      </Text>
                      <Text style={{ color: "#9CA3AF", fontSize: 8 }}>|</Text>
                      <Text
                        style={{
                          color: "#6EE7B7",
                          fontSize: 9,
                          fontWeight: "bold",
                        }}
                      >
                        {formatTime(item.bestSec)}
                      </Text>
                    </View>
                  )}
                </View>
              ) : (
                <View style={{ height: 22 }} />
              )}

              {/* Bars: Paired or Single */}
              <View
                style={{
                  height: BAR_MAX_HEIGHT,
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    gap: 3,
                  }}
                >
                  {/* Win Rate Bar */}
                  {showWin && (
                    <View
                      style={{
                        width: barWidth,
                        height: winHeight,
                        borderRadius: 4,
                        backgroundColor: COLOR_WIN,
                        opacity: isSelected ? 1 : 0.7,
                      }}
                    />
                  )}

                  {/* Best Time Bar */}
                  {showTime && (
                    <View
                      style={{
                        width: barWidth,
                        height: timeHeight,
                        borderRadius: 4,
                        backgroundColor: COLOR_TIME,
                        opacity: isSelected ? 1 : 0.7,
                      }}
                    />
                  )}
                </View>
              </View>

              {/* Day Label */}
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
    </View>
  );
}
