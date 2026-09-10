import React, { useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Check,
  ChevronRight,
  Lightbulb,
  Pencil,
  ShieldCheck,
} from "lucide-react-native";
import { Text } from "../ui/Text";

type TutorialOverlayProps = {
  visible: boolean;
  onComplete: () => void;
  onSkip: () => void;
};

const STEPS = [
  {
    icon: "grid",
    title: "Let’s learn Sudoku",
    body: "A quick guided tour will show you how to play your first puzzle.",
  },
  {
    icon: "cell",
    title: "Select a cell",
    body: "Tap any empty cell on the board to choose where you want to play.",
  },
  {
    icon: "number",
    title: "Enter a number",
    body: "Use the keypad below the board to place a number in the selected cell.",
  },
  {
    icon: "notes",
    title: "Use notes",
    body: "Notes help you track possible numbers while solving a tricky cell.",
  },
  {
    icon: "erase",
    title: "Change your answer",
    body: "Select a filled cell and use the same keypad to replace or clear it.",
  },
  {
    icon: "shield",
    title: "Error Shield keeps you learning",
    body: "Sudoku King highlights incorrect entries so you can understand mistakes quickly.",
  },
  {
    icon: "hint",
    title: "Need help? Use a hint",
    body: "Hints give you a useful nudge when you feel stuck without solving everything for you.",
  },
  {
    icon: "done",
    title: "You’re ready to play",
    body: "Complete rows, columns, and 3×3 boxes with numbers 1 to 9. Good luck!",
  },
] as const;

function TutorialIcon({ name }: { name: (typeof STEPS)[number]["icon"] }) {
  if (name === "hint")
    return <Lightbulb size={34} color="#2563EB" fill="#DBEAFE" />;
  if (name === "notes") return <Pencil size={34} color="#7C3AED" />;
  if (name === "shield") return <ShieldCheck size={34} color="#059669" />;
  if (name === "done")
    return <Check size={34} color="#16A34A" strokeWidth={3} />;
  return (
    <View style={styles.iconGrid}>
      <View style={styles.iconGridLine} />
      <View style={styles.iconGridLine} />
      <View style={styles.iconGridLine} />
    </View>
  );
}

function TutorialOverlay({
  visible,
  onComplete,
  onSkip,
}: TutorialOverlayProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
      return;
    }
    setStepIndex((current) => current + 1);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onSkip}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={onSkip}
            accessibilityRole="button"
            accessibilityLabel="Skip tutorial"
          >
            <Text style={styles.skipText}>Skip tutorial</Text>
          </TouchableOpacity>

          <View style={styles.iconCircle}>
            <TutorialIcon name={step.icon} />
          </View>
          <Text style={styles.stepCount}>
            {`STEP ${stepIndex + 1} OF ${STEPS.length}`}
          </Text>
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.body}>{step.body}</Text>

          <View style={styles.progressRow}>
            {STEPS.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index === stepIndex && styles.progressDotActive,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextText}>
              {isLastStep ? "Start First Puzzle" : "Next"}
            </Text>
            {!isLastStep && <ChevronRight size={19} color="#FFFFFF" />}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default React.memo(TutorialOverlay);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.72)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    padding: 28,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  skipButton: { alignSelf: "flex-end", padding: 4 },
  skipText: { color: "#6B7280", fontSize: 12, fontWeight: "700" },
  iconCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    marginBottom: 18,
  },
  iconGrid: {
    width: 34,
    height: 34,
    borderWidth: 3,
    borderColor: "#2563EB",
    borderRadius: 7,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  iconGridLine: {
    width: 2,
    height: 25,
    backgroundColor: "#2563EB",
    borderRadius: 2,
  },
  stepCount: {
    color: "#2563EB",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  title: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 8,
  },
  body: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 10,
    minHeight: 64,
  },
  progressRow: { flexDirection: "row", gap: 5, marginVertical: 22 },
  progressDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
  },
  progressDotActive: { width: 22, backgroundColor: "#2563EB" },
  nextButton: {
    width: "100%",
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: "#111827",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  nextText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
});
