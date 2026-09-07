import React, { useRef, useState } from "react";
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { StatsCards } from "./StatsCards";
import { PerformanceChart } from "./PerformanceChart";
import { DifficultyBreakdownChart } from "./DifficultyBreakdownChart";

// ─── Pagination Dots ──────────────────────────────────────────────────────────
function Dots({
  count,
  active,
  onPress,
}: {
  count: number;
  active: number;
  onPress?: (index: number) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 5,
        gap: 6,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => onPress?.(i)}
          hitSlop={{ top: 12, bottom: 12, left: 10, right: 10 }}
          activeOpacity={0.7}
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

const CARD_GAP = 14;

export function DashboardPager({ solved, totalSolved }: DashboardPagerProps) {
  const [activePage, setActivePage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const { width: screenWidth } = useWindowDimensions();
  // Initialize with screenWidth - 26 to match HomeScreen's paddingHorizontal: 13
  const [containerWidth, setContainerWidth] = useState(screenWidth - 26);
  const cardWidth = containerWidth > 0 ? containerWidth : screenWidth - 26;
  const snapInterval = cardWidth + CARD_GAP;

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = Math.round(e.nativeEvent.layout.width);
    if (w > 0 && Math.abs(w - containerWidth) > 1) {
      setContainerWidth(w);
    }
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    if (snapInterval <= 0) return;
    const page = Math.round(offsetX / snapInterval);
    const clamped = Math.max(0, Math.min(1, page));
    if (clamped !== activePage) {
      setActivePage(clamped);
    }
  };

  const handleDotPress = (index: number) => {
    setActivePage(index);
    scrollRef.current?.scrollTo({ x: index * snapInterval, animated: true });
  };

  return (
    <View style={{ paddingBottom: 5 }} onLayout={handleLayout}>
      {/* Hero card — always visible */}
      <View style={{ paddingHorizontal: 0 }}>
        <StatsCards solved={solved} totalSolved={totalSolved} />
      </View>

      {/* ── Swipeable section with gap between cards ── */}
      <ScrollView
        ref={scrollRef}
        horizontal
        snapToInterval={snapInterval}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum={true}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScroll}
        nestedScrollEnabled
      >
        {/* Page 1 — Performance Chart (Merged Win Rate & Best Time) */}
        <View
          style={{ width: cardWidth, marginRight: CARD_GAP, marginBottom: 5 }}
        >
          <PerformanceChart />
        </View>

        {/* Page 2 — Difficulty Breakdown Chart (Donut / Radar / Curve) */}
        <View style={{ width: cardWidth , marginBottom: 5}}>
          <DifficultyBreakdownChart />
        </View>
      </ScrollView>

      {/* Pagination Dots */}
      <Dots count={2} active={activePage} onPress={handleDotPress} />
    </View>
  );
}
