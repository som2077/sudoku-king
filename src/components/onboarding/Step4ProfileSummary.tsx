import React from "react";
import { View, StyleSheet } from "react-native";
import { Easing } from "react-native-reanimated";
import { Text } from "../Text";
import SplitText from "../ui/SplitText";
import { Difficulty } from "../../utils/sudokuLogic";
import { ReminderSlotType } from "./Step3Reminder";
import { useTranslation } from "../../i18n";

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
  const { t } = useTranslation();
  const titleText = t(
    "onboarding.s4SummaryTitle",
    "Building a {minutes}-minute Sudoku habit is a realistic goal. It's not hard at all!",
  ).replace("{minutes}", String(dailyMinutes));

  return (
    <View style={styles.stepContainer}>
      <SplitText
        text={titleText}
        splitType="words"
        triggerOnVisible={false}
        delay={55}
        duration={500}
        ease={Easing.out(Easing.cubic)}
        from={{ opacity: 0, translateY: 18 }}
        to={{ opacity: 1, translateY: 0 }}
        fontSize={23}
        fontWeight="800"
        color="#111827"
        lineHeightMultiplier={1.26}
        textAlign="center"
        containerStyle={styles.stepTitleContainer}
        highlightWords={[{ word: `${dailyMinutes}`, color: "#D88955" }]}
      />
      <Text style={styles.stepSubtitle}>
        {t(
          "onboarding.s4SummarySubtitle",
          "Small daily sessions sharpen your focus, improve your logic, and make building a lasting streak feel effortless.",
        )}
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
  stepTitleContainer: {
    marginBottom: 16,
  },
  stepSubtitle: {
    fontSize: 13,
    color: "#374151",
    textAlign: "center",
    lineHeight: 19,
    paddingHorizontal: 8,
  },

  // /D88955
});
