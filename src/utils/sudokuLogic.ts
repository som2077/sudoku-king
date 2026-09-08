export type Difficulty =
  | "Fast"
  | "Easy"
  | "Medium"
  | "Hard"
  | "Expert"
  | "Master"
  | "Extreme";

// 1D array of 81 numbers representing the board (0 for empty)
export type Board = number[];

// Helper functions to get coordinates
export const getRow = (index: number) => Math.floor(index / 9);
export const getCol = (index: number) => index % 9;
export const getBlock = (index: number) =>
  Math.floor(getRow(index) / 3) * 3 + Math.floor(getCol(index) / 3);

// Check if placing 'num' at 'index' is valid
export const isValid = (board: Board, index: number, num: number): boolean => {
  const row = getRow(index);
  const col = getCol(index);
  const block = getBlock(index);

  for (let i = 0; i < 81; i++) {
    if (board[i] === num && i !== index) {
      if (getRow(i) === row || getCol(i) === col || getBlock(i) === block) {
        return false;
      }
    }
  }
  return true;
};

// Backtracking solver using MRV (Minimum Remaining Values) for high performance
export const solveBoard = (board: Board): boolean => {
  let minCandidates = 10;
  let bestIndex = -1;
  let bestCandidates: number[] = [];

  for (let i = 0; i < 81; i++) {
    if (board[i] === 0) {
      const candidates: number[] = [];
      for (let num = 1; num <= 9; num++) {
        if (isValid(board, i, num)) {
          candidates.push(num);
        }
      }
      if (candidates.length === 0) {
        return false; // Dead end branch
      }
      if (candidates.length < minCandidates) {
        minCandidates = candidates.length;
        bestIndex = i;
        bestCandidates = candidates;
        if (minCandidates === 1) break;
      }
    }
  }

  if (bestIndex === -1) {
    return true; // All cells filled!
  }

  for (const num of bestCandidates) {
    board[bestIndex] = num;
    if (solveBoard(board)) {
      return true;
    }
    board[bestIndex] = 0;
  }

  return false;
};

// Count solutions (stops immediately when count > 1) with MRV forward checking
export const countSolutions = (board: Board, count = { value: 0 }): number => {
  if (count.value > 1) return count.value;

  let minCandidates = 10;
  let bestIndex = -1;
  let bestCandidates: number[] = [];

  for (let i = 0; i < 81; i++) {
    if (board[i] === 0) {
      const candidates: number[] = [];
      for (let num = 1; num <= 9; num++) {
        if (isValid(board, i, num)) {
          candidates.push(num);
        }
      }
      if (candidates.length === 0) {
        return count.value; // Dead end, prune branch immediately
      }
      if (candidates.length < minCandidates) {
        minCandidates = candidates.length;
        bestIndex = i;
        bestCandidates = candidates;
        if (minCandidates === 1) break;
      }
    }
  }

  if (bestIndex === -1) {
    count.value++;
    return count.value;
  }

  for (const num of bestCandidates) {
    board[bestIndex] = num;
    countSolutions(board, count);
    board[bestIndex] = 0;
    if (count.value > 1) break;
  }

  return count.value;
};

// Seeded RNG utils
export function cyrb128(str: string) {
  let h1 = 1779033703,
    h2 = 3144134277,
    h3 = 1013904242,
    h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return (h1 ^ h2 ^ h3 ^ h4) >>> 0;
}

export function mulberry32(a: number) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Generate a fully valid random board
export const generateFullBoard = (
  randomFn: () => number = Math.random,
): Board => {
  const board = Array(81).fill(0);

  // Fill diagonal 3x3 blocks first for maximum randomness and solver speed
  for (let block = 0; block < 9; block += 4) {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => randomFn() - 0.5);
    let i = 0;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const row = Math.floor(block / 3) * 3 + r;
        const col = (block % 3) * 3 + c;
        board[row * 9 + col] = nums[i++];
      }
    }
  }

  solveBoard(board); // Solve the rest
  return board;
};

// Generate a playable puzzle with true difficulty-scaled givens
export const generatePuzzle = (
  difficulty: Difficulty,
  seed?: string,
): { puzzle: Board; solution: Board } => {
  const randomFn = seed ? mulberry32(cyrb128(seed)) : Math.random;
  const solution = generateFullBoard(randomFn);
  const puzzle = [...solution];

  // Target holes to dig according to international Sudoku standards:
  // Fast: ~45 givens (dig 36)
  // Easy: ~40 givens (dig 41)
  // Medium: ~34 givens (dig 47)
  // Hard: ~29 givens (dig 52)
  // Expert: ~25 givens (dig 56)
  // Master: ~23 givens (dig 58)
  // Extreme: ~21 givens (dig 60)
  let holesToDig = 41;
  switch (difficulty) {
    case "Fast":
      holesToDig = 36;
      break;
    case "Easy":
      holesToDig = 41;
      break;
    case "Medium":
      holesToDig = 47;
      break;
    case "Hard":
      holesToDig = 52;
      break;
    case "Expert":
      holesToDig = 56;
      break;
    case "Master":
      holesToDig = 58;
      break;
    case "Extreme":
      holesToDig = 60;
      break;
    default:
      holesToDig = 41;
      break;
  }

  // Multi-pass digging to ensure high difficulty targets are properly reached
  const maxPasses = holesToDig >= 56 ? 3 : 2;

  for (let pass = 0; pass < maxPasses && holesToDig > 0; pass++) {
    // Only attempt cells that are currently filled
    const filledIndices = puzzle
      .map((val, idx) => (val !== 0 ? idx : -1))
      .filter((idx) => idx !== -1)
      .sort(() => randomFn() - 0.5);

    let dugInThisPass = 0;

    for (const index of filledIndices) {
      if (holesToDig === 0) break;
      if (puzzle[index] === 0) continue;

      const backup = puzzle[index];
      puzzle[index] = 0;

      // Check if board still has strictly 1 unique solution
      const tempBoard = [...puzzle];
      if (countSolutions(tempBoard, { value: 0 }) !== 1) {
        puzzle[index] = backup; // Put it back, removing this cell would cause multiple solutions
      } else {
        holesToDig--;
        dugInThisPass++;
      }
    }

    if (dugInThisPass === 0) break; // No further cells can be dug uniquely
  }

  return { puzzle, solution };
};

export type HintType = 'error' | 'naked_single' | 'hidden_single' | 'reveal';

export interface SmartHint {
  type: HintType;
  cellIndex: number;
  value: number;
  row: number;
  col: number;
  block: number;
  title: string;
  explanation: string;
  relatedIndices?: number[];
}

// Get all peer cell indices for a given cell (same row, col, and block)
export const getPeerIndices = (index: number): number[] => {
  const row = getRow(index);
  const col = getCol(index);
  const block = getBlock(index);
  const peers = new Set<number>();

  for (let i = 0; i < 81; i++) {
    if (i !== index && (getRow(i) === row || getCol(i) === col || getBlock(i) === block)) {
      peers.add(i);
    }
  }

  return Array.from(peers);
};

// Calculate legal candidates (1-9) for a cell given the current board
export const getCandidates = (
  board: (number | null)[],
  index: number
): number[] => {
  if (board[index] !== null && board[index] !== 0) {
    return [];
  }

  const row = getRow(index);
  const col = getCol(index);
  const block = getBlock(index);
  const usedNumbers = new Set<number>();

  for (let i = 0; i < 81; i++) {
    const val = board[i];
    if (val !== null && val !== 0 && i !== index) {
      if (getRow(i) === row || getCol(i) === col || getBlock(i) === block) {
        usedNumbers.add(val);
      }
    }
  }

  const candidates: number[] = [];
  for (let num = 1; num <= 9; num++) {
    if (!usedNumbers.has(num)) {
      candidates.push(num);
    }
  }

  return candidates;
};

// Smart Hint Engine: Analyzes board to find mistakes, naked singles, hidden singles, or next logical reveal
export const getSmartHint = (
  currentBoard: (number | null)[],
  solution: Board,
  selectedCellIndex?: number | null
): SmartHint | null => {
  // Step 1: Detect user errors (highest priority)
  for (let i = 0; i < 81; i++) {
    const val = currentBoard[i];
    if (val !== null && val !== 0 && val !== solution[i]) {
      const row = getRow(i);
      const col = getCol(i);
      const block = getBlock(i);
      return {
        type: 'error',
        cellIndex: i,
        value: val,
        row,
        col,
        block,
        title: 'Incorrect Cell',
        explanation: `The number ${val} at Row ${row + 1}, Col ${col + 1} is incorrect. Remove or change it to proceed.`,
        relatedIndices: getPeerIndices(i).filter((p) => currentBoard[p] === val),
      };
    }
  }

  // Find all empty cells
  const emptyIndices: number[] = [];
  for (let i = 0; i < 81; i++) {
    if (currentBoard[i] === null || currentBoard[i] === 0) {
      emptyIndices.push(i);
    }
  }

  // If no empty cells and no errors, puzzle is completely solved!
  if (emptyIndices.length === 0) {
    return null;
  }

  // Step 2: If the player has selected an empty cell, check if it has a Naked Single
  if (
    selectedCellIndex !== null &&
    selectedCellIndex !== undefined &&
    selectedCellIndex >= 0 &&
    selectedCellIndex < 81 &&
    (currentBoard[selectedCellIndex] === null || currentBoard[selectedCellIndex] === 0)
  ) {
    const candidates = getCandidates(currentBoard, selectedCellIndex);
    if (candidates.length === 1) {
      const val = candidates[0];
      const row = getRow(selectedCellIndex);
      const col = getCol(selectedCellIndex);
      const block = getBlock(selectedCellIndex);
      const peers = getPeerIndices(selectedCellIndex).filter((p) => {
        const pv = currentBoard[p];
        return pv !== null && pv !== 0;
      });

      return {
        type: 'naked_single',
        cellIndex: selectedCellIndex,
        value: val,
        row,
        col,
        block,
        title: 'Naked Single',
        explanation: `Row ${row + 1}, Col ${col + 1} can only be ${val} because all other numbers (1-9) are eliminated by its row, column, or block.`,
        relatedIndices: peers,
      };
    }
  }

  // Step 3: Search for Naked Singles across the entire board
  for (const idx of emptyIndices) {
    const candidates = getCandidates(currentBoard, idx);
    if (candidates.length === 1) {
      const val = candidates[0];
      const row = getRow(idx);
      const col = getCol(idx);
      const block = getBlock(idx);
      const peers = getPeerIndices(idx).filter((p) => {
        const pv = currentBoard[p];
        return pv !== null && pv !== 0;
      });

      return {
        type: 'naked_single',
        cellIndex: idx,
        value: val,
        row,
        col,
        block,
        title: 'Naked Single',
        explanation: `Row ${row + 1}, Col ${col + 1} can only be ${val} because all other numbers (1-9) are eliminated by its row, column, or block.`,
        relatedIndices: peers,
      };
    }
  }

  // Step 4: Search for Hidden Singles (Row, Column, Block)
  // Check Rows
  for (let r = 0; r < 9; r++) {
    const rowCells = [];
    for (let c = 0; c < 9; c++) {
      rowCells.push(r * 9 + c);
    }
    for (let num = 1; num <= 9; num++) {
      // If number already in row, skip
      if (rowCells.some((idx) => currentBoard[idx] === num)) continue;
      const possibleCells = rowCells.filter(
        (idx) => (currentBoard[idx] === null || currentBoard[idx] === 0) && getCandidates(currentBoard, idx).includes(num)
      );
      if (possibleCells.length === 1) {
        const target = possibleCells[0];
        const row = getRow(target);
        const col = getCol(target);
        const block = getBlock(target);
        return {
          type: 'hidden_single',
          cellIndex: target,
          value: num,
          row,
          col,
          block,
          title: 'Hidden Single (Row)',
          explanation: `In Row ${row + 1}, number ${num} can only fit at Col ${col + 1}.`,
          relatedIndices: rowCells.filter((i) => i !== target),
        };
      }
    }
  }

  // Check Columns
  for (let c = 0; c < 9; c++) {
    const colCells = [];
    for (let r = 0; r < 9; r++) {
      colCells.push(r * 9 + c);
    }
    for (let num = 1; num <= 9; num++) {
      if (colCells.some((idx) => currentBoard[idx] === num)) continue;
      const possibleCells = colCells.filter(
        (idx) => (currentBoard[idx] === null || currentBoard[idx] === 0) && getCandidates(currentBoard, idx).includes(num)
      );
      if (possibleCells.length === 1) {
        const target = possibleCells[0];
        const row = getRow(target);
        const col = getCol(target);
        const block = getBlock(target);
        return {
          type: 'hidden_single',
          cellIndex: target,
          value: num,
          row,
          col,
          block,
          title: 'Hidden Single (Column)',
          explanation: `In Column ${col + 1}, number ${num} can only fit at Row ${row + 1}.`,
          relatedIndices: colCells.filter((i) => i !== target),
        };
      }
    }
  }

  // Check 3x3 Blocks
  for (let b = 0; b < 9; b++) {
    const blockCells = [];
    const startRow = Math.floor(b / 3) * 3;
    const startCol = (b % 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        blockCells.push((startRow + r) * 9 + (startCol + c));
      }
    }
    for (let num = 1; num <= 9; num++) {
      if (blockCells.some((idx) => currentBoard[idx] === num)) continue;
      const possibleCells = blockCells.filter(
        (idx) => (currentBoard[idx] === null || currentBoard[idx] === 0) && getCandidates(currentBoard, idx).includes(num)
      );
      if (possibleCells.length === 1) {
        const target = possibleCells[0];
        const row = getRow(target);
        const col = getCol(target);
        const block = getBlock(target);
        return {
          type: 'hidden_single',
          cellIndex: target,
          value: num,
          row,
          col,
          block,
          title: 'Hidden Single (Block)',
          explanation: `In 3x3 Block ${b + 1}, number ${num} can only fit at Row ${row + 1}, Col ${col + 1}.`,
          relatedIndices: blockCells.filter((i) => i !== target),
        };
      }
    }
  }

  // Step 5: Fallback logical reveal
  // If player selected an empty cell, reveal for that cell
  let fallbackIndex = selectedCellIndex;
  if (
    fallbackIndex === null ||
    fallbackIndex === undefined ||
    fallbackIndex < 0 ||
    fallbackIndex >= 81 ||
    (currentBoard[fallbackIndex] !== null && currentBoard[fallbackIndex] !== 0)
  ) {
    // Choose the empty cell with minimum candidate count (MRV)
    let minCandidates = 10;
    fallbackIndex = emptyIndices[0];
    for (const idx of emptyIndices) {
      const cands = getCandidates(currentBoard, idx);
      if (cands.length > 0 && cands.length < minCandidates) {
        minCandidates = cands.length;
        fallbackIndex = idx;
      }
    }
  }

  const row = getRow(fallbackIndex);
  const col = getCol(fallbackIndex);
  const block = getBlock(fallbackIndex);
  const val = solution[fallbackIndex];

  return {
    type: 'reveal',
    cellIndex: fallbackIndex,
    value: val,
    row,
    col,
    block,
    title: 'Smart Reveal',
    explanation: `Placing ${val} at Row ${row + 1}, Col ${col + 1} advances the puzzle.`,
    relatedIndices: getPeerIndices(fallbackIndex),
  };
};
