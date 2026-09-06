import React, { useRef, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { Trophy, Zap } from "lucide-react-native";
import { StatsCards, SmallCard } from "./StatsCards";
import { WinRateChart } from "./WinRateChart";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
// Outer ScrollView has px-4 (16px each side) → card width
const PAGE_WIDTH = SCREEN_WIDTH - 32;
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
  winRate,
  bestTime,
}: DashboardPagerProps) {
  const [activePage, setActivePage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (e: any) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / PAGE_WIDTH);
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
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        decelerationRate="fast"
        nestedScrollEnabled
        // Each page is exactly PAGE_WIDTH so snapping is perfect
      >
        {/* Page 1 — Win Rate Chart */}
        <View style={{ width: PAGE_WIDTH, paddingHorizontal: INNER_PAD }}>
          <WinRateChart />
        </View>

        {/* Page 2 — Win Rate % + Best Time */}
        <View style={{ width: PAGE_WIDTH, paddingHorizontal: INNER_PAD }}>
          <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
            <SmallCard
              value={`${winRate}%`}
              label="Win rate"
              iconBg="#EDE9FE"
              icon={<Trophy size={22} color="#7C3AED" />}
            />
            <SmallCard
              value={bestTime}
              label="Best time"
              iconBg="#FEE2E2"
              icon={<Zap size={22} color="#EF4444" />}
            />
          </View>
        </View>
      </ScrollView>

      {/* Pagination Dots */}
      <Dots count={2} active={activePage} />
    </View>
  );
}
