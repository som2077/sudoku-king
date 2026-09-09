import React from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Text } from "../ui/Text";
import { useGameStore } from "../../store/useGameStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
// Max card width ~380, padding 16 each side = 348 available width.
// 5 buttons with 8px gap: (348 - 32) / 5 = ~63px
const CONTAINER_MAX_WIDTH = Math.min(SCREEN_WIDTH - 32, 400);
const GAP = 10;
const BTN_WIDTH = Math.floor((CONTAINER_MAX_WIDTH - GAP * 4) / 5);
const BTN_HEIGHT = Math.min(Math.max(BTN_WIDTH * 0.95, 54), 62);

export default function Keypad({
  showRewardedAd,
}: {
  showRewardedAd?: (cb: () => void) => void;
}) {
  const board = useGameStore((s) => s.board);
  const placeNumber = useGameStore((s) => s.placeNumber);
  const isNotesMode = useGameStore((s) => s.isNotesMode);
  const toggleNote = useGameStore((s) => s.toggleNote);

  // Count how many times each number appears correctly on the board (to dim completed numbers)
  const numberCounts = React.useMemo(() => {
    const counts = Array(10).fill(0);
    for (let i = 0; i < board.length; i++) {
      const cell = board[i];
      if (cell.value !== null && !cell.isError) {
        counts[cell.value]++;
      }
    }
    return counts;
  }, [board]);
  const isComplete = (num: number) => numberCounts[num] >= 9;

  const handleNumberPress = (num: number) => {
    if (isNotesMode) {
      toggleNote(num);
    } else {
      placeNumber(num);
    }
  };

  const renderNumberButton = (num: number) => {
    const done = isComplete(num);
    return (
      <TouchableOpacity
        key={num}
        onPress={() => handleNumberPress(num)}
        style={[
          styles.numBtn,
          { width: BTN_WIDTH, height: BTN_HEIGHT },
          done && styles.numBtnDone,
        ]}
        disabled={done}
        activeOpacity={0.65}
      >
        <Text style={[styles.numText, done && styles.numTextDone]}>{num}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Row 1: 1, 2, 3, 4, 5 */}
      <View style={styles.row}>{[1, 2, 3, 4, 5].map(renderNumberButton)}</View>

      {/* Row 2: 6, 7, 8, 9 (Centered) */}
      <View style={[styles.row, styles.centeredRow]}>
        {[6, 7, 8, 9].map(renderNumberButton)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: CONTAINER_MAX_WIDTH,
    alignItems: "center",
    gap: 10,
    marginTop: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: GAP,
  },
  centeredRow: {
    justifyContent: "center",
    gap: GAP,
  },
  numBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#00000010",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#00000030",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  numBtnDone: {
    opacity: 0.25,
    backgroundColor: "#F1F5F9",
    elevation: 0,
    shadowOpacity: 0,
  },
  numText: {
    fontSize: 26,
    fontWeight: "700",
    // color: "#2563EB",
  },
  numTextDone: {
    color: "#94A3B8",
  },
});
