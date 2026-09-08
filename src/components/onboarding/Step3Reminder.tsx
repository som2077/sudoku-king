import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Sun, Coffee, Moon, BellOff, Check } from "lucide-react-native";
import { Text } from "../Text";

export type ReminderSlotType =
  | "morning"
  | "afternoon"
  | "evening"
  | "none"
  | null;

interface Step3ReminderProps {
  reminderSlot: ReminderSlotType;
  onSelectSlot: (slot: "morning" | "afternoon" | "evening" | "none") => void;
}

export function Step3Reminder({
  reminderSlot,
  onSelectSlot,
}: Step3ReminderProps) {
  const reminderOptions = [
    {
      id: "morning" as const,
      label: "Morning (9:00 AM)",
      sub: "Start your day with an energized brain",
      icon: <Sun size={20} color="#D97706" />,
      bg: "#FEF3C7",
    },
    {
      id: "afternoon" as const,
      label: "Afternoon (2:00 PM)",
      sub: "Mid-day mental recharge break",
      icon: <Coffee size={20} color="#2563EB" />,
      bg: "#EFF6FF",
    },
    {
      id: "evening" as const,
      label: "Evening (8:00 PM)",
      sub: "Calm unwinding before sleep",
      icon: <Moon size={20} color="#7C3AED" />,
      bg: "#F5F3FF",
    },
    {
      id: "none" as const,
      label: "No reminder",
      sub: "I will open the game myself without alerts",
      icon: <BellOff size={20} color="#6B7280" />,
      bg: "#F3F4F6",
    },
  ];

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Daily Challenge Reminder</Text>
      <Text style={styles.stepSubtitle}>
        Choose your preferred reminder time so your daily streak flame never
        dies.
      </Text>

      <View style={styles.cardsList}>
        {reminderOptions.map((slot) => {
          const isSelected = reminderSlot === slot.id;
          return (
            <TouchableOpacity
              key={slot.id}
              onPress={() => onSelectSlot(slot.id)}
              style={[
                styles.channelRow,
                isSelected && styles.channelRowSelected,
              ]}
              activeOpacity={0.7}
            >
              <View
                style={[styles.channelIconBox, { backgroundColor: slot.bg }]}
              >
                {slot.icon}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                  style={[
                    styles.channelRowText,
                    isSelected && styles.channelRowTextSelected,
                  ]}
                >
                  {slot.label}
                </Text>
                <Text style={styles.channelRowSub}>{slot.sub}</Text>
              </View>
              <View
                style={[
                  styles.goalRadio,
                  isSelected && styles.goalRadioSelected,
                ]}
              >
                {isSelected && (
                  <Check size={14} color="#FFFFFF" strokeWidth={3} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    width: "100%",
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
  cardsList: {
    gap: 12,
  },
  channelRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 14,
  },
  channelRowSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#F8FAFC",
  },
  channelIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  channelRowText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  channelRowTextSelected: {
    color: "#2563EB",
    fontWeight: "700",
  },
  channelRowSub: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  goalRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  goalRadioSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#2563EB",
  },
});
