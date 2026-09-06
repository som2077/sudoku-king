import { Text } from '../components/Text';
import {
  View,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal
} from "react-native";
import { useGameStore } from "../store/useGameStore";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react-native";
import { Image } from "expo-image";

const DIFFICULTY_COLORS: Record<string, string> = {
  Fast: "#6B7280",
  Easy: "#16A34A",
  Medium: "#EA580C",
  Hard: "#DC2626",
  Expert: "#7C3AED",
};

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <Text style={{ fontSize: 18, lineHeight: 22 }}>{filled ? "❤️" : "🖤"}</Text>
  );
}

export default function TopBar({
  showRewardedAd,
}: {
  showRewardedAd: (cb: () => void) => void;
}) {
  const { mistakes, timer, setScreen, startNewGame } = useGameStore();
  const [isPaused, setIsPaused] = useState(false);

  // Hardcoded for now — wire from store when difficulty is persisted
  const difficulty = "Easy";
  const diffColor = DIFFICULTY_COLORS[difficulty] ?? "#6B7280";

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      useGameStore.setState((state) => ({ timer: state.timer + 1 }));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const confirmBack = () => {
    Alert.alert("Leave Game", "Your progress will be saved.", [
      { text: "Cancel", style: "cancel" },
      { text: "Leave", style: "destructive", onPress: () => setScreen("home") },
    ]);
  };

  // 3 hearts, filled = no mistake yet at that slot
  const hearts = [mistakes < 1, mistakes < 2, mistakes < 3];

  return (
    <>
      <View style={styles.container}>
        {/* ── Row 1: Back | Logo | Pause ── */}
        <View style={styles.row1}>
          <TouchableOpacity onPress={confirmBack} style={styles.iconBtn}>
            <ChevronLeft size={28} color="#1C1F2E" strokeWidth={2.5} />
          </TouchableOpacity>

          <Image
            source={require("../../assets/sudukoLogo.svg")}
            style={{ width: 110, height: 32 }}
            contentFit="contain"
          />

          <TouchableOpacity
            onPress={() => setIsPaused(true)}
            style={styles.iconBtn}
          >
            <Text style={{ fontSize: 22 }}>⏸</Text>
          </TouchableOpacity>
        </View>

        {/* ── Row 2: Difficulty | Timer | Hearts ── */}
        <View style={styles.row2}>
          {/* Difficulty pill */}
          <View style={[styles.diffPill, { borderColor: diffColor }]}>
            <Text style={[styles.diffText, { color: diffColor }]}>
              {difficulty}
            </Text>
          </View>

          {/* Timer */}
          <Text style={styles.timer}>{formatTime(timer)}</Text>

          {/* Hearts */}
          <View style={styles.hearts}>
            {hearts.map((filled, i) => (
              <HeartIcon key={i} filled={filled} />
            ))}
          </View>
        </View>
      </View>

      {/* ── Pause Modal ── */}
      <Modal transparent visible={isPaused} animationType="fade">
        <View style={styles.pauseOverlay}>
          <View style={styles.pauseCard}>
            <Text style={{ fontSize: 48, marginBottom: 8 }}>⏸</Text>
            <Text style={styles.pauseTitle}>Paused</Text>
            <Text style={styles.pauseSubtitle}>{formatTime(timer)}</Text>
            <TouchableOpacity
              onPress={() => setIsPaused(false)}
              style={styles.resumeBtn}
            >
              <Text style={styles.resumeBtnText}>Resume</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
  },

  // Row 1
  row1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  // Row 2
  row2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  diffPill: {
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  diffText: {
    fontSize: 12,
    fontWeight: "700",
  },
  timer: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1C1F2E",
    letterSpacing: 1,
  },
  hearts: {
    flexDirection: "row",
    gap: 2,
  },

  // Pause modal
  pauseOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
  pauseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 36,
    alignItems: "center",
    width: "75%",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  pauseTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1C1F2E",
    marginBottom: 4,
  },
  pauseSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 24,
  },
  resumeBtn: {
    backgroundColor: "#1C1F2E",
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 48,
  },
  resumeBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
});
