import React from "react";
import { View, StyleSheet } from "react-native";
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
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>
        Building a <Text style={styles.accentText}>{dailyMinutes}-minute</Text>{" "}
        Sudoku habit is a realistic goal. It&apos;s not hard at all!
      </Text>
      <Text style={styles.stepSubtitle}>
        Small daily sessions sharpen your focus, improve your logic, and make
        building a lasting streak feel effortless.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    width: "100%",
    flex: 1,
    minHeight: 440,
    backgroundColor: "transparent",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  stepTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    lineHeight: 29,
    marginBottom: 16,
  },
  stepSubtitle: {
    fontSize: 13,
    color: "#374151",
    textAlign: "center",
    lineHeight: 19,
    paddingHorizontal: 8,
  },
  accentText: {
    color: "#D88955",
    fontWeight: "800",
  },
});
