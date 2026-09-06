import { View, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { Text } from '../components/Text';
import { useGameStore } from "../store/useGameStore";
import { RotateCcw, Eraser, Pen, Lightbulb } from "lucide-react-native";

export default function Keypad({
  showRewardedAd,
}: {
  showRewardedAd: (cb: () => void) => void;
}) {
  const {
    board,
    placeNumber,
    isNotesMode,
    toggleNotesMode,
    toggleNote,
    erase,
    undo,
    hintsRemaining,
    useHint,
    isPremium,
    addHint,
  } = useGameStore();

  // Count how many times each number appears correctly on the board (to dim completed numbers)
  const numberCounts = Array(10).fill(0);
  board.forEach((cell) => {
    if (cell.value !== null && !cell.isError) numberCounts[cell.value]++;
  });
  const isComplete = (num: number) => numberCounts[num] >= 9;

  const handleNumberPress = (num: number) => {
    if (isNotesMode) toggleNote(num);
    else placeNumber(num);
  };

  const handleHintClick = () => {
    if (isPremium || hintsRemaining > 0) {
      useHint();
    } else {
      Alert.alert(
        "Out of Hints",
        "Watch a short video ad to get another hint?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Watch Ad",
            onPress: () =>
              showRewardedAd(() => {
                addHint();
                setTimeout(useHint, 500);
              }),
          },
        ],
      );
    }
  };

  // ── Action button helper ────────────────────────────────────────────────────
  const ActionBtn = ({
    icon,
    label,
    onPress,
    active = false,
  }: {
    icon: React.ReactNode;
    label: string;
    onPress: () => void;
    active?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.actionBtn, active && styles.actionBtnActive]}
    >
      {icon}
      <Text style={[styles.actionLabel, active && styles.actionLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* ── Number Pad ── */}
      <View style={styles.numRow}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
          const done = isComplete(num);
          return (
            <TouchableOpacity
              key={num}
              onPress={() => handleNumberPress(num)}
              style={[styles.numBtn, done && styles.numBtnDone]}
              disabled={done}
              activeOpacity={0.7}
            >
              <Text style={[styles.numText, done && styles.numTextDone]}>
                {num}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Action Row ── */}
      <View style={styles.actionRow}>
        <ActionBtn
          icon={
            <RotateCcw
              size={26}
              color={isNotesMode ? "#6B7280" : "#1C1F2E"}
              strokeWidth={2}
            />
          }
          label="Undo"
          onPress={undo}
        />

        <ActionBtn
          icon={
            <Eraser
              size={26}
              color={isNotesMode ? "#6B7280" : "#1C1F2E"}
              strokeWidth={2}
            />
          }
          label="Erase"
          onPress={erase}
        />

        <ActionBtn
          icon={
            <Pen
              size={26}
              color={isNotesMode ? "#1C1F2E" : "#6B7280"}
              strokeWidth={2}
            />
          }
          label="Notes"
          onPress={toggleNotesMode}
          active={isNotesMode}
        />

        {/* Hint with badge */}
        <TouchableOpacity onPress={handleHintClick} style={styles.actionBtn}>
          <View style={{ position: "relative" }}>
            <Lightbulb size={26} color="#1C1F2E" strokeWidth={2} />
            <View style={styles.hintBadge}>
              <Text style={styles.hintBadgeText}>
                {isPremium ? "∞" : hintsRemaining > 0 ? hintsRemaining : "📺"}
              </Text>
            </View>
          </View>
          <Text style={styles.actionLabel}>Hint</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 12,
    gap: 16,
  },

  // ── Number pad ──────────────────────────────────────────────────────────────
  numRow: {
    flexDirection: "row",
    gap: 6,
  },
  numBtn: {
    flex: 1,
    height: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  numBtnDone: {
    opacity: 0.25,
  },
  numText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1C1F2E",
  },
  numTextDone: {
    color: "#9CA3AF",
  },

  // ── Action row ───────────────────────────────────────────────────────────────
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingBottom: 8,
  },
  actionBtn: {
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  actionBtnActive: {
    backgroundColor: "#F0F0F8",
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
  },
  actionLabelActive: {
    color: "#1C1F2E",
  },

  // ── Hint badge ───────────────────────────────────────────────────────────────
  hintBadge: {
    position: "absolute",
    top: -6,
    right: -8,
    backgroundColor: "#1C1F2E",
    borderRadius: 999,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  hintBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
  },
});
