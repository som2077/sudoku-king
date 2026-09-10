import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "../Text";
interface Step1DailyGoalProps {
  dailyMinutes: number;
  onSelectMinutes: (minutes: number) => void;
}
export function Step1DailyGoal({
  dailyMinutes,
  onSelectMinutes,
}: Step1DailyGoalProps) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Daily Training Goal</Text>
      <Text style={styles.stepSubtitle}>
        This will be used to calibrate your custom daily challenge plan.
      </Text>
      <View style={styles.numberPickerContainer}>
        <View style={styles.numberBigRow}>
          <Text style={styles.numberBig}>{dailyMinutes}</Text>
          <Text style={styles.numberUnit}>min / day</Text>
        </View>

        {/* Small Pointer Arrow */}
        <View style={styles.trianglePointer} />

        {/* Dark Horizontal Selector Bar */}
        <View style={styles.darkSelectorBar}>
          {[5, 10, 15, 20].map((val) => {
            const isActive = dailyMinutes === val;
            return (
              <TouchableOpacity
                key={val}
                onPress={() => onSelectMinutes(val)}
                style={[
                  styles.selectorSegment,
                  isActive && styles.selectorSegmentActive,
                ]}
                activeOpacity={0.7}
                accessibilityRole="radio"
                accessibilityState={{ checked: isActive }}
                accessibilityLabel={`${val} minutes per day`}
              >
                <Text
                  style={[
                    styles.selectorSegmentText,
                    isActive && styles.selectorSegmentTextActive,
                  ]}
                >
                  {val}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.pickerHint}>
          {dailyMinutes === 5 && "🌱 Casual: Quick 5-minute mental warm-up"}
          {dailyMinutes === 10 &&
            "⭐ Recommended: Perfect for 1 Daily Challenge"}
          {dailyMinutes === 15 && "🧠 Brain Workout: 2 Puzzles + deeper focus"}
          {dailyMinutes === 20 &&
            "👑 Master Level: Serious cognitive endurance"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    width: "100%",
    backgroundColor: "transparent",
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
    lineHeight: 32,
  },
  stepSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 19,
    marginBottom: 28,
  },
  numberPickerContainer: {
    alignItems: "center",
    paddingVertical: "40%",
  },
  numberBigRow: {
    flexDirection: "row",
    alignItems: "baseline",
    // marginBottom: 1,
  },
  numberBig: {
    fontSize: 64,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -2,
  },
  numberUnit: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6B7280",
    marginLeft: 3,
  },
  trianglePointer: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderBottomWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#111827",
    // marginBottom: 2,
  },
  darkSelectorBar: {
    flexDirection: "row",
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 6,
    width: "100%",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  selectorSegment: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 14,
  },
  selectorSegmentActive: {
    backgroundColor: "#FFFFFF",
  },
  selectorSegmentText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#9CA3AF",
  },
  selectorSegmentTextActive: {
    color: "#111827",
    fontWeight: "800",
  },
  pickerHint: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
    marginTop: 15,
    textAlign: "center",
    paddingHorizontal: 16,
    lineHeight: 18,
  },
});
