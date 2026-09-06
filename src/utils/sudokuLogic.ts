export type Difficulty = 'Fast' | 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'Master' | 'Extreme';

// 1D array of 81 numbers representing the board (0 for empty)
export type Board = number[];

// Helper functions to get coordinates
export const getRow = (index: number) => Math.floor(index / 9);
export const getCol = (index: number) => index % 9;
export const getBlock = (index: number) => Math.floor(getRow(index) / 3) * 3 + Math.floor(getCol(index) / 3);

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
  let h1 = 1779033703, h2 = 3144134277,
      h3 = 1013904242, h4 = 2773480762;
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
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Generate a fully valid random board
export const generateFullBoard = (randomFn: () => number = Math.random): Board => {
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
export const generatePuzzle = (difficulty: Difficulty, seed?: string): { puzzle: Board; solution: Board } => {
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
    case 'Fast': holesToDig = 36; break;
    case 'Easy': holesToDig = 41; break;
    case 'Medium': holesToDig = 47; break;
    case 'Hard': holesToDig = 52; break;
    case 'Expert': holesToDig = 56; break;
    case 'Master': holesToDig = 58; break;
    case 'Extreme': holesToDig = 60; break;
    default: holesToDig = 41; break;
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
