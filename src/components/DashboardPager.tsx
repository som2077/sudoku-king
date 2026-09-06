import React from 'react';
import { View } from 'react-native';
import { StatsCards } from './StatsCards';
import { WinRateChart } from './WinRateChart';

interface DashboardPagerProps {
  solved: number;
  totalSolved: number;
  winRate: number;
  bestTime: string;
  streak: number;
}

export function DashboardPager({ solved, totalSolved, winRate, bestTime, streak }: DashboardPagerProps) {
  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
      <StatsCards
        solved={solved}
        totalSolved={totalSolved}
        winRate={winRate}
        bestTime={bestTime}
        streak={streak}
      />
      <WinRateChart />
    </View>
  );
}
