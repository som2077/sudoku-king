import React, { useEffect, useMemo, useRef } from "react";
import { View, useWindowDimensions, StyleSheet } from "react-native";
import Cell from "./Cell";
import { useGameStore } from "../../store/useGameStore";
import { haptics } from "../../utils/haptics";
import { getRow, getCol, getBlock } from "../../utils/sudokuLogic";

const COLOR_BORDER = "#000000"; // Crisp premium dark border for 3x3 block borders & outer frame
const COLOR_THIN = "#00000030"; // Clean, elegant divider between individual cells

function Board() {
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
    const availableWidth = Math.min(screenWidth - 8.5, 500);
    // Outer border (2px each side = 4px) + 6 thin dividers (1px each = 6px) + 2 thick dividers (2px each = 4px) = 14px
    const cell = Math.floor((availableWidth - 14) / 9);
    const block = cell * 3 + 2; // 3 cells + 2 thin (1px) dividers
    const total = block * 3 + 8; // 3 blocks + 2 thick (2px) dividers + 4px outer borders = cell * 9 + 14
    return { cellSize: cell, blockSize: block, boardSize: total };
  }, [screenWidth]);

  // Track completion of 3x3 blocks, rows, and columns
  const completedGroups = useMemo(() => {
    if (!board || board.length !== 81) return { blocks: Array(9).fill(false), rows: Array(9).fill(false), cols: Array(9).fill(false) };

    const blocks = Array.from({ length: 9 }, (_, blockIndex) => {
      const blockRow = Math.floor(blockIndex / 3);
      const blockCol = blockIndex % 3;
      return Array.from({ length: 9 }, (_, cellOffset) => {
        const row = blockRow * 3 + Math.floor(cellOffset / 3);
        const col = blockCol * 3 + (cellOffset % 3);
        return board[row * 9 + col];
      }).every((cell) => cell.value !== null && !cell.isError);
    });

    const rows = Array.from({ length: 9 }, (_, r) => {
      return Array.from({ length: 9 }, (_, c) => board[r * 9 + c]).every(
        (cell) => cell.value !== null && !cell.isError
      );
    });

    const cols = Array.from({ length: 9 }, (_, c) => {
      return Array.from({ length: 9 }, (_, r) => board[r * 9 + c]).every(
        (cell) => cell.value !== null && !cell.isError
      );
    });

    return { blocks, rows, cols };
  }, [board]);

  const completedBlocks = completedGroups.blocks;

  const previousCompleted = useRef<{
    blocks: boolean[];
    rows: boolean[];
    cols: boolean[];
  } | null>(null);

  useEffect(() => {
    if (previousCompleted.current) {
      const newBlock = completedGroups.blocks.some(
        (done, idx) => done && !previousCompleted.current?.blocks[idx]
      );
      const newRow = completedGroups.rows.some(
        (done, idx) => done && !previousCompleted.current?.rows[idx]
      );
      const newCol = completedGroups.cols.some(
        (done, idx) => done && !previousCompleted.current?.cols[idx]
      );

      if (newBlock || newRow || newCol) {
        haptics.success();
        haptics.blockCompleteSound();
      }
    }
    previousCompleted.current = {
      blocks: [...completedGroups.blocks],
      rows: [...completedGroups.rows],
      cols: [...completedGroups.cols],
    };
  }, [completedGroups]);

  if (!board || board.length !== 81) {
    return null;
  }

  const selectedVal =
    selectedCell !== null && board[selectedCell]
      ? board[selectedCell].value
      : null;
  const selectedRow = selectedCell === null ? -1 : getRow(selectedCell);
  const selectedCol = selectedCell === null ? -1 : getCol(selectedCell);
  const selectedBlock = selectedCell === null ? -1 : getBlock(selectedCell);

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
                      completedBlocks[blockRow * 3 + blockCol] &&
                        styles.completedBlock,
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
                                  (row === selectedRow ||
                                    col === selectedCol ||
                                    blockRow * 3 + blockCol === selectedBlock)
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
                                      isBlockCompleted={
                                        completedBlocks[blockRow * 3 + blockCol]
                                      }
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

export default React.memo(Board);

const styles = StyleSheet.create({
  boardWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  boardContainer: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLOR_BORDER,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    // shadowColor: "#1E3A8A",
    // shadowOpacity: 0.18,
    // shadowRadius: 12,
    // shadowOffset: { width: 0, height: 4 },
    // elevation: 8,
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
  completedBlock: {
    backgroundColor: "#DCFCE7",
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
