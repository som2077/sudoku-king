import { View, Dimensions } from 'react-native';
import Cell from './Cell';
import { useGameStore } from '../store/useGameStore';
import { getRow, getCol, getBlock } from '../utils/sudokuLogic';

const screenWidth = Dimensions.get('window').width;
const boardSize = Math.min(screenWidth - 16, 400); // Max 400px, 8px padding
const cellSize = boardSize / 9;

export default function Board() {
  const { board, selectedCell, selectCell } = useGameStore();

  const renderGrid = () => {
    const grid = [];
    for (let i = 0; i < 81; i++) {
      const cell = board[i];

      let isHighlighted = false;
      let isSameValue = false;

      if (selectedCell !== null) {
        if (getRow(i) === getRow(selectedCell) ||
          getCol(i) === getCol(selectedCell) ||
          getBlock(i) === getBlock(selectedCell)) {
          isHighlighted = true;
        }

        const selectedVal = board[selectedCell].value;
        if (selectedVal !== null && cell.value === selectedVal) {
          isSameValue = true;
        }
      }

      // Add thicker borders for 3x3 blocks to make it look like Sudoku
      const borderStyles = [];
      if (getCol(i) % 3 === 0) borderStyles.push("border-l-2 border-l-black");
      if (getCol(i) === 8) borderStyles.push("border-r-2 border-r-black");
      if (getRow(i) % 3 === 0) borderStyles.push("border-t-2 border-t-black");
      if (getRow(i) === 8) borderStyles.push("border-b-2 border-b-black");

      grid.push(
        <View key={i} style={{ width: cellSize, height: cellSize }} className={borderStyles.join(" ")}>
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
    <View className="flex-row flex-wrap mb-7" style={{ width: boardSize, height: boardSize }}>
      {renderGrid()}
    </View>
  );
}
