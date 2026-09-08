import React, { useMemo } from "react";
import { View, useWindowDimensions, StyleSheet } from "react-native";
import Cell from "./Cell";
import { useGameStore } from "../../store/useGameStore";
import { getRow, getCol, getBlock } from "../../utils/sudokuLogic";

const COLOR_BORDER = "#000000"; // Crisp premium dark border for 3x3 block borders & outer frame
const COLOR_THIN = "#00000030"; // Clean, elegant divider between individual cells

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

  // Pixel-perfect cell, block and board calculation to guarantee 100% square cells with no sub-pixel jitter
  const { cellSize, blockSize, boardSize } = useMemo(() => {
    const availableWidth = Math.min(screenWidth - 1, 500);
    // Outer border (2px each side = 4px) + 6 thin dividers (1px each = 6px) + 2 thick dividers (2px each = 4px) = 14px
    const cell = Math.floor((availableWidth - 14) / 9);
    const block = cell * 3 + 2; // 3 cells + 2 thin (1px) dividers
    const total = block * 3 + 8; // 3 blocks + 2 thick (2px) dividers + 4px outer borders = cell * 9 + 14
    return { cellSize: cell, blockSize: block, boardSize: total };
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
        style={[styles.boardContainer, { width: boardSize, height: boardSize }]}
      >
        {[0, 1, 2].map((blockRow) => (
          <React.Fragment key={`block-row-${blockRow}`}>
            <View style={[styles.blockRow, { height: blockSize }]}>
              {[0, 1, 2].map((blockCol) => (
                <React.Fragment key={`block-${blockRow}-${blockCol}`}>
                  <View
                    style={[
                      styles.blockContainer,
                      { width: blockSize, height: blockSize },
                    ]}
                  >
                    {[0, 1, 2].map((subRow) => {
                      const row = blockRow * 3 + subRow;
                      return (
                        <React.Fragment key={`sub-row-${subRow}`}>
                          <View style={[styles.subRow, { height: cellSize }]}>
                            {[0, 1, 2].map((subCol) => {
                              const col = blockCol * 3 + subCol;
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
                                  {subCol < 2 && (
                                    <View style={styles.verticalThin} />
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </View>
                          {subRow < 2 && <View style={styles.horizontalThin} />}
                        </React.Fragment>
                      );
                    })}
                  </View>
                  {blockCol < 2 && <View style={styles.verticalThick} />}
                </React.Fragment>
              ))}
            </View>
            {blockRow < 2 && <View style={styles.horizontalThick} />}
          </React.Fragment>
        ))}
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
    borderRadius: 0,
    borderWidth: 2,
    borderColor: COLOR_BORDER,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  blockRow: {
    flexDirection: "row",
    width: "100%",
    // padding: 1,
  },
  blockContainer: {
    // padding: 1,
    flexDirection: "column",
  },
  subRow: {
    flexDirection: "row",
    width: "100%",
    // padding: 1,
  },
  cellContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  verticalThin: {
    width: 1,
    height: "100%",
    backgroundColor: COLOR_THIN,
  },
  verticalThick: {
    width: 2,
    height: "100%",
    backgroundColor: COLOR_BORDER,
  },
  horizontalThin: {
    height: 1,
    width: "100%",
    backgroundColor: COLOR_THIN,
  },
  horizontalThick: {
    height: 2,
    width: "100%",
    backgroundColor: COLOR_BORDER,
  },
});
