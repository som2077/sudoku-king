import React, { useState, useMemo } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Circle, Line, G } from "react-native-svg";
import { Text } from "../ui/Text";
import { Trophy, Zap, Clock, Puzzle, Eye } from "lucide-react-native";
import { useGameStore } from "../../store/useGameStore";

export interface DifficultyStat {
  level: string;
  color: string;
  lightBg: string;
  textDark: string;
  solved: number;
  best: string;
  avg: string;
  bestSec: number | null;
  avgSec: number;
}

const MOCK_DIFFICULTY_STATS: DifficultyStat[] = [
  {
    level: "Easy",
    color: "#16A34A",
    lightBg: "#DCFCE7",
    textDark: "#15803D",
    solved: 52,
    best: "3:21",
    avg: "5:10",
    bestSec: 201,
    avgSec: 310,
  },
  {
    level: "Medium",
    color: "#F59E0B",
    lightBg: "#FEF3C7",
    textDark: "#B45309",
    solved: 38,
    best: "6:45",
    avg: "9:20",
    bestSec: 405,
    avgSec: 560,
  },
  {
    level: "Hard",
    color: "#EA580C",
    lightBg: "#FFEDD5",
    textDark: "#C2410C",
    solved: 24,
    best: "14:12",
    avg: "18:30",
    bestSec: 852,
    avgSec: 1110,
  },
  {
    level: "Expert",
    color: "#7C3AED",
    lightBg: "#EDE9FE",
    textDark: "#6D28D9",
    solved: 12,
    best: "26:50",
    avg: "34:10",
    bestSec: 1610,
    avgSec: 2050,
  },
  {
    level: "Master",
    color: "#3B82F6",
    lightBg: "#DBEAFE",
    textDark: "#1D4ED8",
    solved: 7,
    best: "42:15",
    avg: "55:00",
    bestSec: 2535,
    avgSec: 3300,
  },
  {
    level: "Extreme",
    color: "#EF4444",
    lightBg: "#FEE2E2",
    textDark: "#B91C1C",
    solved: 3,
    best: "58:30",
    avg: "1:12:00",
    bestSec: 3510,
    avgSec: 4320,
  },
];

const CARD_SHADOW = {
  backgroundColor: "#FFFFFF",
  borderRadius: 20,
  shadowColor: "#000",
  shadowOpacity: 0.06,
  elevation: 1,
};

function formatTime(seconds: number | null): string {
  if (!seconds || seconds <= 0) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

// SVG Geometry for Side-by-Side Layout
const SIZE = 142;
const CENTER = SIZE / 2;
const DONUT_RADIUS = 49;
const DONUT_STROKE = 19;
const CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;
const R_INNER = DONUT_RADIUS - DONUT_STROKE / 2;
const R_OUTER = DONUT_RADIUS + DONUT_STROKE / 2;

export function DifficultyBreakdownChart({
  stats: overrideStats,
}: {
  stats?: DifficultyStat[];
}) {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [showEmptyPreview, setShowEmptyPreview] = useState<boolean>(false);

  // Read real persistent stats from useGameStore
  const storeDifficultyStats = useGameStore((s) => s.difficultyStats);
  const storeTotalSolved = useGameStore((s) => s.totalSolved) || 0;

  // Use overrideStats -> real store stats (if present) -> MOCK_DIFFICULTY_STATS
  const items: DifficultyStat[] = useMemo(() => {
    if (showEmptyPreview) return [];
    if (overrideStats && overrideStats.length > 0) return overrideStats;

    if (storeTotalSolved > 0 && storeDifficultyStats) {
      const realItems = MOCK_DIFFICULTY_STATS.map((cfg) => {
        const rec = storeDifficultyStats[cfg.level] || {
          solved: 0,
          played: 0,
          bestSec: null,
          totalSec: 0,
        };
        const solved = rec.solved || 0;
        const avgSec = solved > 0 ? Math.round(rec.totalSec / solved) : 0;
        return {
          ...cfg,
          solved,
          best: formatTime(rec.bestSec),
          avg: formatTime(avgSec),
          bestSec: rec.bestSec,
          avgSec,
        };
      });
      const hasAnySolved = realItems.some((it) => it.solved > 0);
      if (hasAnySolved) return realItems;
    }

    // Default rich mock data for visual UI review & inspection
    return MOCK_DIFFICULTY_STATS;
  }, [overrideStats, storeDifficultyStats, storeTotalSolved, showEmptyPreview]);

  const totalSolved = useMemo(() => {
    if (showEmptyPreview) return 0;
    return items.reduce((acc, item) => acc + item.solved, 0);
  }, [items, showEmptyPreview]);

  const hasData = totalSolved > 0;

  // Compute donut segments and radial divider lines
  const { segments, dividers } = useMemo(() => {
    if (!hasData) return { segments: [], dividers: [] };

    const activeItems = items.filter((it) => it.solved > 0);
    let cumulative = 0;
    const segs: {
      level: string;
      color: string;
      arcLength: number;
      offset: number;
      solved: number;
      percentage: number;
    }[] = [];
    const divs: { x1: number; y1: number; x2: number; y2: number }[] = [];

    activeItems.forEach((item) => {
      const ratio = item.solved / totalSolved;
      const arcLength = ratio * CIRCUMFERENCE;
      const offset = cumulative;

      // Divider at boundary of slice (if multiple slices exist)
      if (activeItems.length > 1) {
        const angle = (cumulative / CIRCUMFERENCE) * 2 * Math.PI - Math.PI / 2;
        divs.push({
          x1: CENTER + (R_INNER - 1.5) * Math.cos(angle),
          y1: CENTER + (R_INNER - 1.5) * Math.sin(angle),
          x2: CENTER + (R_OUTER + 1.5) * Math.cos(angle),
          y2: CENTER + (R_OUTER + 1.5) * Math.sin(angle),
        });
      }

      segs.push({
        level: item.level,
        color: item.color,
        arcLength,
        offset,
        solved: item.solved,
        percentage: Math.round(ratio * 100),
      });

      cumulative += arcLength;
    });

    return { segments: segs, dividers: divs };
  }, [items, totalSolved, hasData]);

  const activeStat = items.find((it) => it.level === selectedLevel) || null;

  return (
    <View style={{ ...CARD_SHADOW, padding: 16, marginTop: 10 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <View>
          <Text style={{ fontSize: 15, fontWeight: "bold", color: "#1C1F2E" }}>
            Difficulty Breakdown
          </Text>
          {hasData && (
            <Text style={{ fontSize: 11, color: "#6B7280", marginTop: 1 }}>
              {totalSolved} puzzles completed
            </Text>
          )}
        </View>

        {/* State preview switcher (Mock Data / Empty State) */}
        <TouchableOpacity
          onPress={() => {
            setShowEmptyPreview(!showEmptyPreview);
            setSelectedLevel(null);
          }}
          activeOpacity={0.7}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            backgroundColor: showEmptyPreview ? "#FEE2E2" : "#F3F4F6",
            paddingHorizontal: 8,
            paddingVertical: 3.5,
            borderRadius: 12,
          }}
        >
          <Eye size={11} color={showEmptyPreview ? "#DC2626" : "#4B5563"} />
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: showEmptyPreview ? "#DC2626" : "#4B5563",
            }}
          >
            {showEmptyPreview ? "Empty" : "Mock"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Side-by-Side: Chart on LEFT, All Modes on RIGHT */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* LEFT: Donut Chart */}
        <View style={{ width: SIZE, height: SIZE, position: "relative" }}>
          <Svg width={SIZE} height={SIZE}>
            {hasData ? (
              <G>
                {/* Background track */}
                <Circle
                  cx={CENTER}
                  cy={CENTER}
                  r={DONUT_RADIUS}
                  stroke="#F3F4F6"
                  strokeWidth={DONUT_STROKE}
                  fill="none"
                />

                {/* Colored Slices */}
                {segments.map((seg) => {
                  const isSelected = selectedLevel === seg.level;
                  return (
                    <Circle
                      key={seg.level}
                      cx={CENTER}
                      cy={CENTER}
                      r={DONUT_RADIUS}
                      stroke={seg.color}
                      strokeWidth={isSelected ? DONUT_STROKE + 3 : DONUT_STROKE}
                      strokeDasharray={[seg.arcLength, CIRCUMFERENCE - seg.arcLength]}
                      strokeDashoffset={-seg.offset}
                      fill="none"
                      strokeLinecap="butt"
                      opacity={selectedLevel === null || isSelected ? 1 : 0.4}
                    />
                  );
                })}

                {/* Clean White Radial Separators between segments */}
                {dividers.map((d, i) => (
                  <Line
                    key={i}
                    x1={d.x1}
                    y1={d.y1}
                    x2={d.x2}
                    y2={d.y2}
                    stroke="#FFFFFF"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  />
                ))}
              </G>
            ) : (
              /* Empty State SVG Ring */
              <G>
                <Circle
                  cx={CENTER}
                  cy={CENTER}
                  r={DONUT_RADIUS}
                  stroke="#E5E7EB"
                  strokeWidth={DONUT_STROKE}
                  strokeDasharray={[6, 4]}
                  fill="none"
                />
              </G>
            )}
          </Svg>

          {/* Center Callout inside Donut Hole */}
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              },
            ]}
          >
            {hasData ? (
              activeStat ? (
                <>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "bold",
                      color: activeStat.color,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {activeStat.level}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "800",
                      color: "#1C1F2E",
                      marginVertical: -2,
                    }}
                  >
                    {activeStat.solved}
                  </Text>
                  <Text style={{ fontSize: 9, color: "#6B7280", fontWeight: "600" }}>
                    {totalSolved > 0
                      ? `${Math.round((activeStat.solved / totalSolved) * 100)}%`
                      : "0%"}
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "800",
                      color: "#1C1F2E",
                      lineHeight: 24,
                    }}
                  >
                    {totalSolved}
                  </Text>
                  <Text
                    style={{
                      fontSize: 9,
                      fontWeight: "700",
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    SOLVED
                  </Text>
                </>
              )
            ) : (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Puzzle size={22} color="#9CA3AF" />
                <Text
                  style={{
                    fontSize: 8,
                    fontWeight: "700",
                    color: "#9CA3AF",
                    marginTop: 2,
                    textTransform: "uppercase",
                  }}
                >
                  NO DATA
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* RIGHT: All Modes (Easy, Medium, Hard, Expert, Master, Extreme) */}
        <View style={{ flex: 1, marginLeft: 12, justifyContent: "center", gap: 5 }}>
          {!hasData ? (
            <View
              style={{
                backgroundColor: "#F9FAFB",
                borderRadius: 10,
                padding: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  color: "#374151",
                  marginBottom: 2,
                  textAlign: "center",
                }}
              >
                No Puzzles Yet
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: "#9CA3AF",
                  textAlign: "center",
                  lineHeight: 14,
                }}
              >
                Solve puzzles in any difficulty to see your distribution!
              </Text>
            </View>
          ) : (
            items.map((item) => {
              const isSelected = selectedLevel === item.level;
              const pct =
                totalSolved > 0
                  ? Math.round((item.solved / totalSolved) * 100)
                  : 0;

              return (
                <TouchableOpacity
                  key={item.level}
                  activeOpacity={0.7}
                  onPress={() =>
                    setSelectedLevel(isSelected ? null : item.level)
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`${item.level}: ${item.solved} solved, ${pct} percent`}
                  accessibilityState={{ selected: isSelected }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 4.5,
                    paddingHorizontal: 8,
                    borderRadius: 8,
                    backgroundColor: isSelected ? item.lightBg : "#F9FAFB",
                    borderWidth: 1,
                    borderColor: isSelected ? item.color : "transparent",
                  }}
                >
                  {/* Mode Dot & Level Name */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      flexShrink: 1,
                    }}
                  >
                    <View
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: 3.5,
                        backgroundColor: item.color,
                      }}
                    />
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 11,
                        fontWeight: isSelected ? "bold" : "600",
                        color: isSelected ? item.textDark : "#1C1F2E",
                      }}
                    >
                      {item.level}
                    </Text>
                  </View>

                  {/* Solved Count & Percentage Chip */}
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <View
                      style={{
                        backgroundColor: isSelected ? "#FFFFFF" : "#E5E7EB",
                        paddingHorizontal: 5,
                        paddingVertical: 1,
                        borderRadius: 6,
                        minWidth: 44,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "700",
                          color: isSelected ? item.textDark : "#374151",
                        }}
                      >
                        {item.solved} ({pct}%)
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </View>
    </View>
  );
}
