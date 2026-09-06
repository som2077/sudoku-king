import React from "react";
import { Text } from '../components/Text';
import { View} from "react-native";
import { Flame } from "lucide-react-native";

// ─── Shared card shadow style ────────────────────────────────────────────────
export const CARD_SHADOW = {
  backgroundColor: "#FFFFFF",
  borderRadius: 20,
  shadowColor: "#000",
  shadowOpacity: 0.06,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

// ─── Icon bubble ────────────────────────────────────────────────────────────
export function IconBubble({
  children,
  bg,
}: {
  children: React.ReactNode;
  bg: string;
}) {
  return (
    <View
      style={{
        width: 52,
        height: 52,
        borderRadius: 999,
        backgroundColor: bg,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </View>
  );
}

// ─── Hero Card (large, full-width) ───────────────────────────────────────────
export function HeroCard({
  value,
  total,
  label,
  icon,
  iconBg,
}: {
  value: number;
  total: number;
  label: string;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <View
      style={{
        ...CARD_SHADOW,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
      }}
    >
      <View>
        <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 3 }}>
          <Text
            style={{
              fontSize: 38,
              fontWeight: "bold",
              color: "#1C1F2E",
              lineHeight: 44,
            }}
          >
            {value}
          </Text>
          <Text style={{ fontSize: 14, color: "#9CA3AF", marginBottom: 6 }}>
            /{total}
          </Text>
        </View>
        <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 2 }}>
          {label}
        </Text>
      </View>
      <IconBubble bg={iconBg}>{icon}</IconBubble>
    </View>
  );
}

// ─── Small Stat Card ──────────────────────────────────────────────────────────
export function SmallCard({
  value,
  label,
  icon,
  iconBg,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <View style={{ ...CARD_SHADOW, flex: 1, padding: 14 }}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: "#1C1F2E",
          marginBottom: 4,
        }}
      >
        {value}
      </Text>
      <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 12 }}>
        {label}
      </Text>
      <IconBubble bg={iconBg}>{icon}</IconBubble>
    </View>
  );
}

// ─── Combined export (HeroCard only — small cards live in DashboardPager) ────
interface StatsCardsProps {
  solved: number;
  totalSolved: number;
}

export function StatsCards({ solved, totalSolved }: StatsCardsProps) {
  return (
    <View style={{ marginTop: 14 }}>
      <HeroCard
        value={solved}
        total={totalSolved}
        label="Puzzles solved today"
        iconBg="#FEF3E2"
        icon={<Flame size={26} color="#F97316" />}
      />
    </View>
  );
}
