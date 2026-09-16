import React from "react";
import { View, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import { Text } from "../ui/Text";
import { useGameStore } from "../../store/useGameStore";
import { haptics } from "../../utils/haptics";

const GAP = 10;

function Keypad({
  showRewardedAd,
}: {
  showRewardedAd?: (cb: () => void) => void;
}) {
  const { width: screenWidth } = useWindowDimensions();
  const containerMaxWidth = Math.min(Math.max(screenWidth - 32, 280), 400);
  const buttonWidth = Math.floor((containerMaxWidth - GAP * 4) / 5);
  const buttonHeight = Math.min(Math.max(buttonWidth * 0.95, 54), 62);
  const board = useGameStore((s) => s.board);
  const solution = useGameStore((s) => s.solution);
  const selectedCell = useGameStore((s) => s.selectedCell);
  const placeNumber = useGameStore((s) => s.placeNumber);
  const isNotesMode = useGameStore((s) => s.isNotesMode);
  const autoCheckMistakes = useGameStore(
    (s) => s.settings?.autoCheckMistakes ?? true,
  );
  const toggleNote = useGameStore((s) => s.toggleNote);

  // Count how many times each number appears correctly on the board (to dim completed numbers)
  const numberCounts = React.useMemo(() => {
    const counts = Array(10).fill(0);
    for (let i = 0; i < board.length; i++) {
      const cell = board[i];
      if (
        cell.value !== null &&
        !cell.isError &&
        solution[i] === cell.value
      ) {
        counts[cell.value]++;
      }
    }
    return counts;
  }, [board, solution]);
  const isComplete = (num: number) => numberCounts[num] >= 9;

  const handleNumberPress = (num: number) => {
    haptics.tapSound();
    if (isNotesMode) {
      toggleNote(num);
    } else {
      const cell = selectedCell === null ? null : board[selectedCell];
      const isEditableCell =
        cell && !cell.isLocked && (cell.value === null || cell.isError);
      const isKnownIncorrectEntry =
        selectedCell !== null &&
        solution.length === 81 &&
        solution[selectedCell] !== 0 &&
        solution[selectedCell] !== num;

      if (isEditableCell && autoCheckMistakes && isKnownIncorrectEntry) {
        haptics.error();
      }
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
          { width: buttonWidth, height: buttonHeight },
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

export default React.memo(Keypad);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 400,
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
