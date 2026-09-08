import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Sparkles, Zap, Crown, Check } from "lucide-react-native";
import { Text } from "../Text";
import { Difficulty } from "../../utils/sudokuLogic";

interface Step0ExperienceProps {
  experience: Difficulty;
  onSelectExperience: (difficulty: Difficulty) => void;
}

export function Step0Experience({
  experience,
  onSelectExperience,
}: Step0ExperienceProps) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Choose your Experience</Text>
      <Text style={styles.stepSubtitle}>
        This helps us calibrate starting puzzle difficulty and auto-assist
        settings.
      </Text>

      {/* Vertical Circles (Ek ke neechay ek, matching Screenshot 2 "Choose your Gender" style) */}
      <View style={styles.circlesVerticalContainer}>
        {/* Option 1: Beginner */}
        <View style={styles.circleItem}>
          <TouchableOpacity
            onPress={() => onSelectExperience("Easy")}
            style={[
              styles.circleBubble,
              { backgroundColor: "#111827" },
              experience === "Easy" && styles.circleBubbleSelected,
            ]}
            activeOpacity={0.8}
            accessibilityRole="radio"
            accessibilityState={{ checked: experience === "Easy" }}
            accessibilityLabel="Beginner, learning rules"
          >
            <Sparkles size={36} color="#FFFFFF" />
            {experience === "Easy" && (
              <View style={styles.circleCheckBadge}>
                <Check size={14} color="#FFFFFF" strokeWidth={3} />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.circleLabel}>Beginner</Text>
          <Text style={styles.circleSubLabel}>Learning rules</Text>
        </View>

        {/* Option 2: Casual */}
        <View style={styles.circleItem}>
          <TouchableOpacity
            onPress={() => onSelectExperience("Medium")}
            style={[
              styles.circleBubble,
              { backgroundColor: "#D9F99D" },
              experience === "Medium" && styles.circleBubbleSelected,
            ]}
            activeOpacity={0.8}
            accessibilityRole="radio"
            accessibilityState={{ checked: experience === "Medium" }}
            accessibilityLabel="Casual, play for fun"
          >
            <Zap size={36} color="#365314" />
            {experience === "Medium" && (
              <View
                style={[
                  styles.circleCheckBadge,
                  { backgroundColor: "#4D7C0F" },
                ]}
              >
                <Check size={14} color="#FFFFFF" strokeWidth={3} />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.circleLabel}>Casual</Text>
          <Text style={styles.circleSubLabel}>Play for fun</Text>
        </View>

        {/* Option 3: Expert */}
        <View style={styles.circleItem}>
          <TouchableOpacity
            onPress={() => onSelectExperience("Hard")}
            style={[
              styles.circleBubble,
              { backgroundColor: "#FEF08A" },
              experience === "Hard" && styles.circleBubbleSelected,
            ]}
            activeOpacity={0.8}
            accessibilityRole="radio"
            accessibilityState={{ checked: experience === "Hard" }}
            accessibilityLabel="Expert, complex logic"
          >
            <Crown size={36} color="#713F12" />
            {experience === "Hard" && (
              <View
                style={[
                  styles.circleCheckBadge,
                  { backgroundColor: "#A16207" },
                ]}
              >
                <Check size={14} color="#FFFFFF" strokeWidth={3} />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.circleLabel}>Expert</Text>
          <Text style={styles.circleSubLabel}>Complex logic</Text>
        </View>
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
    marginBottom: 20,
  },
  circlesVerticalContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    paddingVertical: 8,
  },
  circleItem: {
    alignItems: "center",
    width: "100%",
  },
  circleBubble: {
    width: 116,
    height: 116,
    borderRadius: 68,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderWidth: 4,
    borderColor: "transparent",
  },
  circleBubbleSelected: {
    borderColor: "#2563EB",
  },
  circleCheckBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  circleLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginTop: 8,
  },
  circleSubLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
});
