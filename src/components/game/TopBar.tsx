import { Text } from '../ui/Text';
import {
  View,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal
} from "react-native";
import { useGameStore } from "../../store/useGameStore";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react-native";
import { Image } from "expo-image";

const DIFFICULTY_COLORS: Record<string, string> = {
  Fast: "#6B7280",
  Easy: "#16A34A",
  Medium: "#F59E0B",
  Hard: "#EA580C",
  Expert: "#7C3AED",
  Master: "#3B82F6",
  Extreme: "#EF4444",
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
  const { mistakes, timer, setScreen, difficulty, currentDailyChallenge, board } = useGameStore();
  const [isPaused, setIsPaused] = useState(false);

  const isGameOver = mistakes >= 3;
  const isGameWon = board.length > 0 && board.every(cell => cell.value !== null && !cell.isError) && mistakes < 3;

  const diffColor = DIFFICULTY_COLORS[difficulty] ?? "#6B7280";

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPaused || isGameOver || isGameWon) return;
    const interval = setInterval(() => {
      useGameStore.setState((state) => ({ timer: state.timer + 1 }));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, isGameOver, isGameWon]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const confirmBack = () => {
    Alert.alert(
      "Leave Game",
      "Your progress will be saved.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          onPress: () => setScreen("home"),
        },
      ],
      { cancelable: true }
    );
  };

  // 3 hearts, filled = no mistake yet at that slot
  const hearts = [mistakes < 1, mistakes < 2, mistakes < 3];

  return (
    <>
      <View style={styles.container}>
        {/* ── Row 1: Back | Logo | Pause ── */}
        <View style={styles.row1}>
          <TouchableOpacity onPress={confirmBack} style={styles.iconBtn} activeOpacity={0.7}>
            <ChevronLeft size={28} color="#1C1F2E" strokeWidth={2.5} />
          </TouchableOpacity>

          <TouchableOpacity
            disabled={!__DEV__}
            onLongPress={() => {
              if (__DEV__) {
                const sol = useGameStore.getState().solution;
                useGameStore.setState({
                  board: sol.map((val) => ({
                    value: val,
                    notes: 0,
                    isLocked: false,
                    isError: false,
                  })),
                });
              }
            }}
            activeOpacity={__DEV__ ? 0.7 : 1}
          >
            <Image
              source={require("../../../assets/sudukoLogo.svg")}
              style={{ width: 110, height: 32 }}
              contentFit="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsPaused(true)}
            style={styles.iconBtn}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 22 }}>⏸</Text>
          </TouchableOpacity>
        </View>

        {/* ── Row 2: Difficulty | Timer | Hearts ── */}
        <View style={styles.row2}>
          {/* Difficulty pill */}
          <View style={[styles.diffPill, { borderColor: diffColor, flexDirection: 'row', alignItems: 'center', gap: 4 }]}>
            {currentDailyChallenge && (
              <Text style={{ fontSize: 11 }}>📅</Text>
            )}
            <Text style={[styles.diffText, { color: diffColor }]}>
              {currentDailyChallenge ? `Daily · ${difficulty}` : difficulty}
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
              activeOpacity={0.8}
            >
              <Text style={styles.resumeBtnText}>Resume</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsPaused(false);
                setScreen("home");
              }}
              style={styles.leaveGameBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.leaveGameBtnText}>Save & Quit to Home</Text>
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
    width: "100%",
    alignItems: "center",
  },
  resumeBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
  leaveGameBtn: {
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  leaveGameBtnText: {
    color: "#4B5563",
    fontWeight: "700",
    fontSize: 15,
  },
});
