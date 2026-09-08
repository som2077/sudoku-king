import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowLeft } from "lucide-react-native";

interface OnboardingHeaderProps {
  onBack: () => void;
  progressPercent: number;
}

export function OnboardingHeader({
  onBack,
  progressPercent,
}: OnboardingHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.backButton}
        activeOpacity={0.7}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <ArrowLeft size={20} color="#111827" />
      </TouchableOpacity>

      {/* Progress Track */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>

      <View style={{ width: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    backgroundColor: "transparent",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  progressTrack: {
    flex: 1,
    height: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
    // marginHorizontal: 1,
    marginLeft: 10,
    // marginRight: 10,
    // alignSelf: "center",
    // justifyContent: "center",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#111827",
    borderRadius: 2,
  },
});
