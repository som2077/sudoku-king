import React, { useState } from "react";
import { Text } from "../ui/Text";
import { View, TouchableOpacity } from "react-native";

type ChartTab = "Day" | "Week" | "Month";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Time in seconds: Mon=3:21 (201s), Tue=4:15, Wed=2:50, Thu=5:10, Fri=3:45, Sat=4:30, Sun=2:40
const MOCK_DATA: Record<ChartTab, number[]> = {
  Day: [201, 255, 170, 310, 225, 270, 160],
  Week: [240, 195, 210, 180, 260, 220, 175],
  Month: [210, 230, 185, 245, 190, 205, 165],
};

const TODAY_INDEX = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

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

function Bar({
  value,
  maxValue,
  label,
  isSelected,
  onPress,
}: {
  value: number;
  maxValue: number;
  label: string;
  isSelected: boolean;
  onPress: () => void;
}) {
  const BAR_MAX_HEIGHT = 150;
  const height = Math.max(12, (value / maxValue) * BAR_MAX_HEIGHT);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{ alignItems: "center", flex: 1 }}
    >
      {/* Tooltip above active bar */}
      {isSelected ? (
        <View
          style={{
            backgroundColor: "#1C1F2E",
            borderRadius: 6,
            paddingHorizontal: 6,
            paddingVertical: 2,
            marginBottom: 4,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 9, fontWeight: "bold" }}>
            {formatTime(value)}
          </Text>
        </View>
      ) : (
        <View style={{ height: 18 }} />
      )}

      {/* Bar */}
      <View
        style={{
          height: BAR_MAX_HEIGHT,
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 35,
            height,
            borderRadius: 6,
            backgroundColor: isSelected ? "#1C1F2E" : "#F3F4F6",
          }}
        />
      </View>

      {/* Day label */}
      <Text
        style={{
          fontSize: 10,
          color: isSelected ? "#1C1F2E" : "#9CA3AF",
          fontWeight: isSelected ? "bold" : "400",
          marginTop: 5,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

interface BestTimeChartProps {
  bestTime?: string;
  data?: Record<ChartTab, number[]>;
}

export function BestTimeChart({ bestTime, data: propData }: BestTimeChartProps) {
  const [activeTab, setActiveTab] = useState<ChartTab>("Day");
  const [selectedDay, setSelectedDay] = useState(TODAY_INDEX);

  const data = propData ? propData[activeTab] : MOCK_DATA[activeTab];
  const maxValue = Math.max(...data, 1);
  const tabs: ChartTab[] = ["Day", "Week", "Month"];

  return (
    <View style={{ ...CARD_SHADOW, padding: 18, marginTop: 10 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "bold", color: "#1C1F2E" }}>
          Best Time
        </Text>

        {/* Tab switcher — light pill style */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#F3F4F6",
            borderRadius: 20,
            padding: 3,
          }}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 16,
                backgroundColor: activeTab === tab ? "#FFFFFF" : "transparent",
                shadowColor: activeTab === tab ? "#000" : "transparent",
                shadowOpacity: activeTab === tab ? 0.08 : 0,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 1 },
                elevation: activeTab === tab ? 2 : 0,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: activeTab === tab ? "bold" : "400",
                  color: activeTab === tab ? "#1C1F2E" : "#9CA3AF",
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bars */}
      <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
        {data.map((value, index) => (
          <Bar
            key={index}
            value={value}
            maxValue={maxValue}
            label={DAY_LABELS[index]}
            isSelected={index === selectedDay}
            onPress={() => setSelectedDay(index)}
          />
        ))}
      </View>
    </View>
  );
}
