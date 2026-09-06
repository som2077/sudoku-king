import { View, Dimensions, StyleSheet } from 'react-native';
import Cell from './Cell';
import { useGameStore } from '../../store/useGameStore';
import { getRow, getCol, getBlock } from '../../utils/sudokuLogic';

const screenWidth = Dimensions.get('window').width;
const BOARD_PADDING = 8;
const boardSize = Math.min(screenWidth - 32, 400);
const cellSize = (boardSize - BOARD_PADDING * 2) / 9;

const BORDER_THICK = 2;
const BORDER_THIN = 0.5;
const COLOR_THICK = '#1C1F2E';
const COLOR_THIN = '#D1D5DB';

export default function Board() {
  const { board, selectedCell, selectCell } = useGameStore();

  const renderGrid = () => {
    const grid = [];

    for (let i = 0; i < 81; i++) {
      const cell = board[i];
      const row = getRow(i);
      const col = getCol(i);

      let isHighlighted = false;
      let isSameValue = false;

      if (selectedCell !== null) {
        if (
          getRow(i) === getRow(selectedCell) ||
          getCol(i) === getCol(selectedCell) ||
          getBlock(i) === getBlock(selectedCell)
        ) {
          isHighlighted = true;
        }
        const selectedVal = board[selectedCell].value;
        if (selectedVal !== null && cell.value === selectedVal) {
          isSameValue = true;
        }
      }

      // ── Border logic ──────────────────────────────────────────────────────
      const borderTop    = row % 3 === 0 ? BORDER_THICK : BORDER_THIN;
      const borderLeft   = col % 3 === 0 ? BORDER_THICK : BORDER_THIN;
      const borderBottom = row === 8 ? BORDER_THICK : (row % 3 === 2 ? BORDER_THICK : BORDER_THIN);
      const borderRight  = col === 8 ? BORDER_THICK : (col % 3 === 2 ? BORDER_THICK : BORDER_THIN);

      const borderTopColor    = row % 3 === 0 || row === 8 ? COLOR_THICK : COLOR_THIN;
      const borderLeftColor   = col % 3 === 0 ? COLOR_THICK : COLOR_THIN;
      const borderBottomColor = row % 3 === 2 ? COLOR_THICK : COLOR_THIN;
      const borderRightColor  = col % 3 === 2 ? COLOR_THICK : COLOR_THIN;

      grid.push(
        <View
          key={i}
          style={{
            width: cellSize,
            height: cellSize,
            borderTopWidth: borderTop,
            borderLeftWidth: borderLeft,
            borderBottomWidth: borderBottom,
            borderRightWidth: borderRight,
            borderTopColor,
            borderLeftColor,
            borderBottomColor,
            borderRightColor,
          }}
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
      );
    }
    return grid;
  };

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: boardSize, height: boardSize }}>
        {renderGrid()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: BOARD_PADDING,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 16,
  },
});
