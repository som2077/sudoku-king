import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import Cell from "./Cell";
import { useGameStore } from "../../store/useGameStore";
import { getRow, getCol, getBlock } from "../../utils/sudokuLogic";

const screenWidth = Dimensions.get("window").width;
const boardSize = Math.min(screenWidth - 32, 420);

const COLOR_BORDER = "#5C6AF0"; // Modern vibrant periwinkle/indigo border
const COLOR_THIN = "#00000030"; // Subtle lavender-gray inner divider

export default function Board() {
  const board = useGameStore((s) => s.board);
  const selectedCell = useGameStore((s) => s.selectedCell);
  const selectCell = useGameStore((s) => s.selectCell);
  const highlightAreas = useGameStore(
    (s) => s.settings?.highlightAreas ?? true,
  );
  const highlightSameNumbers = useGameStore(
    (s) => s.settings?.highlightSameNumbers ?? true,
  );

  if (!board || board.length !== 81) {
    return null;
  }

  const selectedVal =
    selectedCell !== null && board[selectedCell]
      ? board[selectedCell].value
      : null;

  return (
    <View style={styles.boardWrapper}>
      <View style={styles.boardContainer}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((row) => {
          const isThickHorizontal = row === 2 || row === 5;
          const isNotLastRow = row < 8;

          return (
            <React.Fragment key={`row-group-${row}`}>
              <View style={styles.row}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col) => {
                  const i = row * 9 + col;
                  const cell = board[i];
                  if (!cell) return null;

                  let isHighlighted = false;
                  let isSameValue = false;

                  if (selectedCell !== null) {
                    if (
                      highlightAreas &&
                      (row === getRow(selectedCell) ||
                        col === getCol(selectedCell) ||
                        getBlock(i) === getBlock(selectedCell))
                    ) {
                      isHighlighted = true;
                    }
                    if (
                      highlightSameNumbers &&
                      selectedVal !== null &&
                      cell.value === selectedVal
                    ) {
                      isSameValue = true;
                    }
                  }

                  const isThickVertical = col === 2 || col === 5;
                  const isNotLastCol = col < 8;

                  return (
                    <React.Fragment key={`cell-group-${i}`}>
                      <View style={styles.cellContainer}>
                        <Cell
                          index={i}
                          value={cell.value}
                          notes={cell.notes}
                          isSelected={selectedCell === i}
                          isLocked={cell.isLocked}
                          isError={cell.isError}
                          isHighlighted={isHighlighted}
                          isSameValue={isSameValue}
                          onPress={selectCell}
                        />
                      </View>
                      {isNotLastCol && (
                        <View
                          style={[
                            styles.verticalDivider,
                            isThickVertical
                              ? styles.verticalThick
                              : styles.verticalThin,
                          ]}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </View>
              {isNotLastRow && (
                <View
                  style={[
                    styles.horizontalDivider,
                    isThickHorizontal
                      ? styles.horizontalThick
                      : styles.horizontalThin,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boardWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  boardContainer: {
    width: boardSize,
    height: boardSize,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLOR_BORDER,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#1E3A8A",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
  cellContainer: {
    flex: 1,
    height: "100%",
  },
  verticalDivider: {
    height: "100%",
  },
  verticalThin: {
    width: 1,
    backgroundColor: COLOR_THIN,
  },
  verticalThick: {
    width: 2,
    backgroundColor: COLOR_BORDER,
  },
  horizontalDivider: {
    width: "100%",
  },
  horizontalThin: {
    height: 1,
    backgroundColor: COLOR_THIN,
  },
  horizontalThick: {
    height: 2,
    backgroundColor: COLOR_BORDER,
  },
});
