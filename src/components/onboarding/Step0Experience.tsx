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

      <View style={styles.circlesContainer}>
        {/* Option 1: Beginner */}
        <View style={styles.circleCol}>
          <TouchableOpacity
            onPress={() => onSelectExperience("Easy")}
            style={[
              styles.circleBubble,
              { backgroundColor: "#111827" },
              experience === "Easy" && styles.circleBubbleSelected,
            ]}
            activeOpacity={0.8}
          >
            <Sparkles size={38} color="#FFFFFF" />
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
        <View style={styles.circleCol}>
          <TouchableOpacity
            onPress={() => onSelectExperience("Medium")}
            style={[
              styles.circleBubble,
              { backgroundColor: "#D9F99D" },
              experience === "Medium" && styles.circleBubbleSelected,
            ]}
            activeOpacity={0.8}
          >
            <Zap size={38} color="#365314" />
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
        <View style={styles.circleCol}>
          <TouchableOpacity
            onPress={() => onSelectExperience("Hard")}
            style={[
              styles.circleBubble,
              { backgroundColor: "#FEF08A" },
              experience === "Hard" && styles.circleBubbleSelected,
            ]}
            activeOpacity={0.8}
          >
            <Crown size={38} color="#713F12" />
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
  circlesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  circleCol: {
    alignItems: "center",
  },
  circleBubble: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    position: "relative",
  },
  circleBubbleSelected: {
    borderWidth: 4,
    borderColor: "#2563EB",
  },
  circleCheckBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  circleLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginTop: 12,
  },
  circleSubLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
});
