import { generatePuzzle } from '../src/utils/sudokuLogic';

function printBoard(board: number[]) {
  for (let i = 0; i < 9; i++) {
    let row = '';
    for (let j = 0; j < 9; j++) {
      row += board[i * 9 + j] === 0 ? '.' : board[i * 9 + j];
      row += ' ';
      if (j === 2 || j === 5) row += '| ';
    }
    console.log(row);
    if (i === 2 || i === 5) console.log('---------------------');
  }
}

console.log("Generating 'Medium' puzzle...");
console.time("Generation Time");
const { puzzle, solution } = generatePuzzle('Medium');
console.timeEnd("Generation Time");

console.log("\nPuzzle:");
printBoard(puzzle);

console.log("\nSolution:");
printBoard(solution);
