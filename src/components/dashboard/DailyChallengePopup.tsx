import React, { useEffect, useState } from "react";
import { Modal, View, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "../ui/Text";
import { X, Calendar as CalendarIcon, Play } from "lucide-react-native";
import { useGameStore, getDailyDifficulty } from "../../store/useGameStore";
import { useTranslation } from "../../i18n";

interface DailyChallengePopupProps {
  onStart: (dateStr: string) => void;
}

const getLocalDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function DailyChallengePopup({ onStart }: DailyChallengePopupProps) {
  const { t } = useTranslation();
  const { lastDailyPopupDate, setLastDailyPopupDate, dailyChallengesProgress } =
    useGameStore();
  const [visible, setVisible] = useState(false);
  const todayStr = getLocalDateString();

  useEffect(() => {
    // Show if we haven't seen it today AND today's challenge isn't already completed
    const todayProgress = dailyChallengesProgress[todayStr] as any;
    if (lastDailyPopupDate !== todayStr && !todayProgress?.completed) {
      // Add slight delay so it doesn't pop up instantly before home screen renders
      const timer = setTimeout(() => {
        setVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [lastDailyPopupDate, todayStr, dailyChallengesProgress]);

  const handleClose = () => {
    setLastDailyPopupDate(todayStr);
    setVisible(false);
  };

  const handleContinue = () => {
    setLastDailyPopupDate(todayStr);
    setVisible(false);
    onStart(todayStr);
  };

  const difficulty = getDailyDifficulty(todayStr);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <X size={22} color="#6B7280" />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <CalendarIcon size={32} color="#1D1A27" />
          </View>

          <Text style={styles.title}>{t("daily.title")}</Text>
          <Text style={styles.subtitle}>
            {todayStr} • {difficulty}
          </Text>

          <Text style={styles.body}>
            Play today's unique Sudoku challenge, keep your streak alive, and
            track your performance on the calendar!
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue</Text>
            <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1C1F2E",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 16,
  },
  body: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B82F6",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
