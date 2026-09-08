import React from "react";
import { View, StyleSheet } from "react-native";
import { Crown, Flame } from "lucide-react-native";
import { Text } from "../Text";
import { Difficulty } from "../../utils/sudokuLogic";
import { ReminderSlotType } from "./Step3Reminder";

interface Step4ProfileSummaryProps {
  experience: Difficulty;
  dailyMinutes: number;
  reminderSlot: ReminderSlotType;
}

export function Step4ProfileSummary({
  experience,
  dailyMinutes,
  reminderSlot,
}: Step4ProfileSummaryProps) {
  const getReminderLabel = () => {
    switch (reminderSlot) {
      case "morning":
        return "9:00 AM";
      case "afternoon":
        return "2:00 PM";
      case "evening":
        return "8:00 PM";
      default:
        return "Off";
    }
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Your Plan is Ready!</Text>
      <Text style={styles.stepSubtitle}>
        We have calibrated your custom Sudoku King profile for optimal training.
      </Text>

      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Crown size={32} color="#F59E0B" />
          <Text style={styles.summaryBadge}>CUSTOM PROFILE READY</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Starting Difficulty:</Text>
          <Text style={styles.summaryValue}>{experience}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Daily Training Goal:</Text>
          <Text style={styles.summaryValue}>{dailyMinutes} min / day</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Streak Reminder:</Text>
          <Text style={styles.summaryValue}>{getReminderLabel()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Smart Assists:</Text>
          <Text style={styles.summaryValue}>Notes & Error Shield ON</Text>
        </View>
      </View>

      <View style={styles.readyPill}>
        <Flame size={18} color="#EA580C" fill="#EA580C" />
        <Text style={styles.readyPillText}>Day 1 Streak Starts Today!</Text>
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
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  summaryBadge: {
    fontSize: 12,
    fontWeight: "800",
    color: "#B45309",
    letterSpacing: 0.8,
    marginTop: 6,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  summaryLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  readyPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FED7AA",
    paddingVertical: 10,
    borderRadius: 999,
    gap: 8,
  },
  readyPillText: {
    color: "#C2410C",
    fontWeight: "700",
    fontSize: 13,
  },
});
