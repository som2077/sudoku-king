import React, { memo } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Vibration,
} from "react-native";
import { Text } from "../ui/Text";
import { useGameStore } from "../../store/useGameStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTAINER_MAX_WIDTH = Math.min(SCREEN_WIDTH - 16, 500);

function Keypad({
  showRewardedAd,
}: {
  showRewardedAd?: (cb: () => void) => void;
}) {
  const board = useGameStore((s) => s.board);
  const placeNumber = useGameStore((s) => s.placeNumber);
  const isNotesMode = useGameStore((s) => s.isNotesMode);
  const toggleNote = useGameStore((s) => s.toggleNote);
  const vibrationEnabled = useGameStore(
    (s) => s.settings?.vibrationEnabled ?? true,
  );

  // Count how many times each number appears correctly on the board (to dim completed numbers)
  const numberCounts = React.useMemo(() => {
    const counts = Array(10).fill(0);
    if (!board) return counts;
    for (let i = 0; i < board.length; i++) {
      const cell = board[i];
      if (cell && cell.value !== null && !cell.isError) {
        counts[cell.value]++;
      }
    }
    return counts;
  }, [board]);

  const handleNumberPress = (num: number) => {
    if (vibrationEnabled) {
      try {
        Vibration.vibrate(14);
      } catch {}
    }
    if (isNotesMode) {
      toggleNote(num);
    } else {
      placeNumber(num);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
          const placedCount = numberCounts[num] || 0;
          const done = placedCount >= 9;
          const remaining = Math.max(0, 9 - placedCount);

          return (
            <TouchableOpacity
              key={num}
              onPress={() => handleNumberPress(num)}
              style={[styles.numBtn, done && styles.numBtnDone]}
              disabled={done}
              activeOpacity={0.6}
            >
              <Text style={[styles.numText, done && styles.numTextDone]}>
                {num}
              </Text>
              <Text style={[styles.subText, done && styles.subTextDone]}>
                {done ? "✓" : remaining}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: CONTAINER_MAX_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    marginTop: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  numBtn: {
    flex: 1,
    height: 58,
    marginHorizontal: 2,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 3,
  },
  numBtnDone: {
    opacity: 0.25,
    backgroundColor: "#F1F5F9",
    borderColor: "transparent",
  },
  numText: {
    fontSize: 23,
    fontWeight: "700",
    color: "#1D4ED8",
    lineHeight: 27,
    includeFontPadding: false,
  },
  numTextDone: {
    color: "#94A3B8",
  },
  subText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 1,
    includeFontPadding: false,
  },
  subTextDone: {
    color: "#94A3B8",
  },
});

export default memo(Keypad);
