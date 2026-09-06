import React, { useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { StatsCards } from "./StatsCards";
import { PerformanceChart } from "./PerformanceChart";
import { DifficultyBreakdownChart } from "./DifficultyBreakdownChart";

const INNER_PAD = 16;

// ─── Pagination Dots ──────────────────────────────────────────────────────────
function Dots({ count, active }: { count: number; active: number }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 16,
        gap: 6,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{
            width: i === active ? 20 : 7,
            height: 7,
            borderRadius: 999,
            backgroundColor: i === active ? "#1C1F2E" : "#D1D5DB",
          }}
        />
      ))}
    </View>
  );
}

interface DashboardPagerProps {
  solved: number;
  totalSolved: number;
  winRate: number;
  bestTime: string;
}

export function DashboardPager({
  solved,
  totalSolved,
}: DashboardPagerProps) {
  const [activePage, setActivePage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const { width: screenWidth } = useWindowDimensions();
  const pageWidth = screenWidth - 32;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / pageWidth);
    setActivePage(page);
  };

  return (
    <View style={{ paddingBottom: 8 }}>
      {/* Hero card — always visible */}
      <View style={{ paddingHorizontal: INNER_PAD }}>
        <StatsCards solved={solved} totalSolved={totalSolved} />
      </View>

      {/* ── Swipeable section — NO paddingHorizontal on ScrollView ── */}
      <ScrollView
        ref={scrollRef}
        horizontal
        snapToInterval={pageWidth}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum={true}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        nestedScrollEnabled
        // Each page is exactly pageWidth so snapping is perfect
      >
        {/* Page 1 — Performance Chart (Merged Win Rate & Best Time) */}
        <View style={{ width: pageWidth, paddingHorizontal: INNER_PAD }}>
          <PerformanceChart />
        </View>

        {/* Page 2 — Difficulty Breakdown Chart (Donut / Radar / Curve) */}
        <View style={{ width: pageWidth, paddingHorizontal: INNER_PAD }}>
          <DifficultyBreakdownChart />
        </View>
      </ScrollView>

      {/* Pagination Dots */}
      <Dots count={2} active={activePage} />
    </View>
  );
}
