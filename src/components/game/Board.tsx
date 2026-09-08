import React, { useMemo } from "react";
import { View, useWindowDimensions, StyleSheet } from "react-native";
import Cell from "./Cell";
import { useGameStore } from "../../store/useGameStore";
import { getRow, getCol, getBlock } from "../../utils/sudokuLogic";

const COLOR_BORDER = "#1E293B"; // Crisp premium dark slate for 3x3 block borders & outer frame
const COLOR_THIN = "#E2E8F0"; // Clean, elegant divider between individual cells

export default function Board() {
  const { width: screenWidth } = useWindowDimensions();
  const board = useGameStore((s) => s.board);
  const selectedCell = useGameStore((s) => s.selectedCell);
  const selectCell = useGameStore((s) => s.selectCell);
  const highlightAreas = useGameStore(
    (s) => s.settings?.highlightAreas ?? true,
  );
  const highlightSameNumbers = useGameStore(
    (s) => s.settings?.highlightSameNumbers ?? true,
  );

  // Pixel-perfect cell and board calculation to guarantee 100% square cells with no sub-pixel jitter
  const { cellSize, boardSize } = useMemo(() => {
    const availableWidth = Math.min(screenWidth - 32, 420);
    // Outer border (2px each side = 4px) + 6 thin dividers (1px each = 6px) + 2 thick dividers (2px each = 4px) = 14px
    const cell = Math.floor((availableWidth - 14) / 9);
    const total = cell * 9 + 14;
    return { cellSize: cell, boardSize: total };
  }, [screenWidth]);

  if (!board || board.length !== 81) {
    return null;
  }

  const selectedVal =
    selectedCell !== null && board[selectedCell]
      ? board[selectedCell].value
      : null;

  return (
    <View style={styles.boardWrapper}>
      <View
        style={[
          styles.boardContainer,
          { width: boardSize, height: boardSize },
        ]}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((row) => {
          const isThickHorizontal = row === 2 || row === 5;
          const isNotLastRow = row < 8;

          return (
            <React.Fragment key={`row-group-${row}`}>
              <View style={[styles.row, { height: cellSize }]}>
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
                      <View
                        style={[
                          styles.cellContainer,
                          { width: cellSize, height: cellSize },
                        ]}
                      >
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
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  boardContainer: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLOR_BORDER,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    width: "100%",
  },
  cellContainer: {
    alignItems: "center",
    justifyContent: "center",
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
