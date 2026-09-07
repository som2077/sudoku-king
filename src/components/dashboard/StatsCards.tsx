import React from "react";
import { Text } from "../ui/Text";
import { View } from "react-native";
import { Svg, Circle } from "react-native-svg";
import { Flame } from "lucide-react-native";

// ─── Shared card shadow style ────────────────────────────────────────────────
export const CARD_SHADOW = {
  backgroundColor: "#FFFFFF",
  borderRadius: 20,
  borderWidth: 0.7,
  // paddingHorizontal: 20,
  borderColor: "#E5E7EB",
  // shadowColor: "#000",
  // shadowOpacity: 0.06,
  // shadowRadius: 10,
  // shadowOffset: { width: 0, height: 4 },
  // elevation: 3,
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

// ─── Progress Ring matching screenshot ───────────────────────────────────────
export function ProgressRingFlame({
  size = 72,
  progress = 0,
}: {
  size?: number;
  progress?: number;
}) {
  const strokeWidth = 9;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const strokeDashoffset = circumference * (1 - clampedProgress);

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 1,
      }}
    >
      <Svg width={size} height={size}>
        {/* Outer subtle ring track matching screenshot */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#EEF1F7"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Active progress arc (if any) */}
        {clampedProgress > 0 && (
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#1C1F2E"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            fill="transparent"
            transform={`rotate(-90 ${center} ${center})`}
          />
        )}
      </Svg>

      {/* Center circular bubble with solid black flame matching screenshot */}
      <View
        style={{
          position: "absolute",
          width: 30,
          height: 30,
          borderRadius: 18,
          backgroundColor: "#F4F5F9",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Flame size={18} color="#1C1F2E" fill="#1C1F2E" />
      </View>
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
  progress,
}: {
  value: number;
  total: number;
  label: string;
  icon?: React.ReactNode;
  iconBg?: string;
  progress?: number;
}) {
  return (
    <View
      style={{
        ...CARD_SHADOW,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        // marginBottom: 14,
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
              marginLeft: 3,
            }}
          >
            {value}
          </Text>
          <Text style={{ fontSize: 14, color: "#9CA3AF", marginBottom: 6 }}>
            /{total}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 14,
            color: "#6B7280",
            marginTop: 2,
            marginLeft: 4,
          }}
        >
          {label}
        </Text>
      </View>
      {icon ? (
        <IconBubble bg={iconBg || "#FEF3E2"}>{icon}</IconBubble>
      ) : (
        <ProgressRingFlame
          progress={progress ?? (total > 0 ? value / total : 0)}
        />
      )}
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
  const progress = totalSolved > 0 ? solved / totalSolved : 0;
  return (
    <View style={{ marginTop: 10 }}>
      <HeroCard
        value={solved}
        total={totalSolved}
        label="Puzzles solved today"
        progress={progress}
      />
    </View>
  );
}
