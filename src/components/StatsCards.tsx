import React from 'react';
import { View, Text } from 'react-native';
import { Trophy, Target, Zap, Flame } from 'lucide-react-native';

// ─── Shared card shadow style ────────────────────────────────────────────────
const CARD_SHADOW = {
  backgroundColor: '#FFFFFF',
  borderRadius: 20,
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

// ─── Icon bubble ────────────────────────────────────────────────────────────
function IconBubble({ children, bg }: { children: React.ReactNode; bg: string }) {
  return (
    <View
      style={{
        width: 52,
        height: 52,
        borderRadius: 999,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </View>
  );
}

// ─── Hero Card (large, full-width) ──────────────────────────────────────────
function HeroCard({ value, total, label, icon, iconBg }: {
  value: number;
  total: number;
  label: string;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <View style={{ ...CARD_SHADOW, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
          <Text style={{ fontSize: 38, fontWeight: 'bold', color: '#1C1F2E', lineHeight: 44 }}>
            {value}
          </Text>
          <Text style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 6 }}>
            /{total}
          </Text>
        </View>
        <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>
          {label}
        </Text>
      </View>
      <IconBubble bg={iconBg}>{icon}</IconBubble>
    </View>
  );
}

// ─── Small Stat Card ─────────────────────────────────────────────────────────
function SmallCard({ value, label, icon, iconBg }: {
  value: string;
  label: string;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <View style={{ ...CARD_SHADOW, flex: 1, padding: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2, marginBottom: 8 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#1C1F2E' }}>
          {value}
        </Text>
      </View>
      <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 12 }}>
        {label}
      </Text>
      <IconBubble bg={iconBg}>{icon}</IconBubble>
    </View>
  );
}

// ─── Public Export ────────────────────────────────────────────────────────────
interface StatsCardsProps {
  solved: number;       // today's solved count
  totalSolved: number;  // all-time total
  winRate: number;      // 0-100
  bestTime: string;     // e.g. "3:21"
  streak: number;       // current streak days
}

export function StatsCards({ solved, totalSolved, winRate, bestTime, streak }: StatsCardsProps) {
  return (
    <View style={{ marginTop: 14 }}>
      {/* Hero card */}
      <HeroCard
        value={solved}
        total={totalSolved}
        label="Puzzles solved today"
        iconBg="#FEF3E2"
        icon={<Flame size={26} color="#F97316" />}
      />

      {/* 3 small cards */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
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
        <SmallCard
          value={`${streak}d`}
          label="Streak"
          iconBg="#DCFCE7"
          icon={<Target size={22} color="#16A34A" />}
        />
      </View>
    </View>
  );
}
