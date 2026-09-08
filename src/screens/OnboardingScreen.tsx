import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Play } from "lucide-react-native";
import { Text } from "../components/Text";
import { Difficulty } from "../utils/sudokuLogic";
import { notificationService } from "../services/notificationService";
import { localNotificationScheduler } from "../services/localNotificationScheduler";
import { useGameStore } from "../store/useGameStore";
import {
  OnboardingHeader,
  Step0Experience,
  Step1DailyGoal,
  Step2PrimaryGoal,
  Step3Reminder,
  Step4ProfileSummary,
  ReminderSlotType,
} from "../components/onboarding";

interface OnboardingScreenProps {
  onFinish: (selectedDifficulty: Difficulty) => void;
  onBack?: () => void;
}

export default function OnboardingScreen({
  onFinish,
  onBack,
}: OnboardingScreenProps) {
  // 5 Step Flow (Matching Screenshot 2 inspiration)
  // Step 0: Choose Experience (Circular bubbles)
  // Step 1: Daily Training Time (Number wheel & selector bar)
  // Step 2: Primary Goal (Cards with checkmark)
  // Step 3: Streak Reminder Time (Morning, Afternoon, Evening, No reminder)
  // Step 4: Calibrated Profile Summary -> "Start First Puzzle"
  const [step, setStep] = useState<number>(0);
  const totalSteps = 5;

  const [experience, setExperience] = useState<Difficulty>("Easy");
  const [dailyMinutes, setDailyMinutes] = useState<number>(10);
  const [goal, setGoal] = useState<string>("focus");
  const [reminderSlot, setReminderSlot] = useState<ReminderSlotType>(null);

  const updateSetting = useGameStore((s) => s.updateSetting);

  const handleSelectReminder = async (
    slotId: "morning" | "afternoon" | "evening" | "none",
  ) => {
    setReminderSlot(slotId);

    if (slotId === "none") {
      // User tapped "No reminder" -> DO NOT show permission popup!
      updateSetting("notificationsEnabled", false);
      localNotificationScheduler.cancelAllDailyNotifications().catch(() => {});
      return;
    }

    // User clicked Morning, Afternoon, or Evening -> Show permission popup immediately!
    try {
      const granted = await notificationService.requestUserPermission();
      if (granted) {
        updateSetting("notificationsEnabled", true);
        localNotificationScheduler
          .scheduleDailyNotifications(true)
          .catch(() => {});
      } else {
        updateSetting("notificationsEnabled", false);
      }
    } catch (err) {
      console.warn(
        "⚠️ [Onboarding] Notification permission request error:",
        err,
      );
    }
  };

  const progressPercent = ((step + 1) / totalSteps) * 100;

  const handleNext = async () => {
    // If on Step 3 and user hasn't made a choice yet, default to 'none' without popup
    if (step === 3 && reminderSlot === null) {
      setReminderSlot("none");
      updateSetting("notificationsEnabled", false);
    }

    if (step < totalSteps - 1) {
      setStep((prev) => prev + 1);
    } else {
      onFinish(experience);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    } else if (onBack) {
      onBack();
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#DDDCEA", "#FFFFFF99"]}
        locations={[0, 0.2]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        {/* ── Top Header: Back Arrow & Thin Progress Track ── */}
        <OnboardingHeader onBack={handleBack} progressPercent={progressPercent} />

        {/* ── Dynamic Step Content Component ── */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {step === 0 && (
            <Step0Experience
              experience={experience}
              onSelectExperience={setExperience}
            />
          )}

          {step === 1 && (
            <Step1DailyGoal
              dailyMinutes={dailyMinutes}
              onSelectMinutes={setDailyMinutes}
            />
          )}

          {step === 2 && <Step2PrimaryGoal goal={goal} onSelectGoal={setGoal} />}

          {step === 3 && (
            <Step3Reminder
              reminderSlot={reminderSlot}
              onSelectSlot={handleSelectReminder}
            />
          )}

          {step === 4 && (
            <Step4ProfileSummary
              experience={experience}
              dailyMinutes={dailyMinutes}
              reminderSlot={reminderSlot}
            />
          )}
        </ScrollView>

        {/* ── Fixed Bottom Button: "Continue" / "Start Playing" ── */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            onPress={handleNext}
            style={[
              styles.continueButton,
              step === 4 && styles.continueButtonFinish,
            ]}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={step === 4 ? "Start Playing" : "Continue"}
          >
            <Text style={styles.continueButtonText}>
              {step === 4 ? "Start Playing" : "Continue"}
            </Text>
            {step === 4 && (
              <Play
                size={16}
                color="#FFFFFF"
                fill="#FFFFFF"
                style={{ marginLeft: 8 }}
              />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 24,
  },
  bottomBar: {
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "transparent",
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
    borderRadius: 40,
    height: 54,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  continueButtonFinish: {
    backgroundColor: "#2563EB",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
