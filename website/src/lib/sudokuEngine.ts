export type Difficulty = "Fast" | "Easy" | "Medium" | "Hard" | "Expert" | "Master";

export type Board = number[]; // 81 numbers, 0 for empty

export const getRow = (index: number) => Math.floor(index / 9);
export const getCol = (index: number) => index % 9;
export const getBlock = (index: number) =>
  Math.floor(getRow(index) / 3) * 3 + Math.floor(getCol(index) / 3);

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

// MRV solver
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
        return false;
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
    return true; // Solved
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

// Count solutions for uniqueness checking
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
        return count.value;
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

// Seeded PRNG
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
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const generateFullBoard = (randomFn: () => number = Math.random): Board => {
  const board = Array(81).fill(0);

  // Fill diagonal 3x3 blocks
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

  solveBoard(board);
  return board;
};

// In-memory memoization cache for seeded daily & canonical puzzles
const puzzleCache = new Map<string, { puzzle: Board; solution: Board }>();

export const generatePuzzle = (
  difficulty: Difficulty,
  seed?: string
): { puzzle: Board; solution: Board } => {
  const cacheKey = seed ? `${difficulty}__${seed}` : null;
  if (cacheKey && puzzleCache.has(cacheKey)) {
    const cached = puzzleCache.get(cacheKey)!;
    return { puzzle: [...cached.puzzle], solution: [...cached.solution] };
  }

  const randomFn = seed ? mulberry32(cyrb128(seed)) : Math.random;
  const solution = generateFullBoard(randomFn);
  const puzzle = [...solution];

  let holesToDig = 41;
  switch (difficulty) {
    case "Fast":
      holesToDig = 34;
      break;
    case "Easy":
      holesToDig = 40;
      break;
    case "Medium":
      holesToDig = 46;
      break;
    case "Hard":
      holesToDig = 51;
      break;
    case "Expert":
      holesToDig = 55;
      break;
    case "Master":
      holesToDig = 58;
      break;
    default:
      holesToDig = 40;
      break;
  }

  const maxPasses = holesToDig >= 55 ? 3 : 2;

  for (let pass = 0; pass < maxPasses && holesToDig > 0; pass++) {
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

      const tempBoard = [...puzzle];
      if (countSolutions(tempBoard, { value: 0 }) !== 1) {
        puzzle[index] = backup;
      } else {
        holesToDig--;
        dugInThisPass++;
      }
    }

    if (dugInThisPass === 0) break;
  }

  if (cacheKey) {
    puzzleCache.set(cacheKey, {
      puzzle: [...puzzle],
      solution: [...solution],
    });
  }

  return { puzzle, solution };
};

// Candidate helper for all cells
export const getCandidatesForCell = (board: Board, index: number): number[] => {
  if (board[index] !== 0) return [];
  const candidates: number[] = [];
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, index, num)) {
      candidates.push(num);
    }
  }
  return candidates;
};

export interface HintResult {
  index: number;
  value: number;
  type: "Naked Single" | "Hidden Single" | "Direct Deduction";
  explanation: string;
}

// Human-like step hint generator
export const findSmartHint = (
  currentBoard: Board,
  solution: Board
): HintResult | null => {
  // 1. Check for Naked Single (cell with only 1 valid candidate)
  for (let i = 0; i < 81; i++) {
    if (currentBoard[i] === 0) {
      const candidates = getCandidatesForCell(currentBoard, i);
      if (candidates.length === 1) {
        const val = candidates[0];
        const r = getRow(i) + 1;
        const c = getCol(i) + 1;
        return {
          index: i,
          value: val,
          type: "Naked Single",
          explanation: `Row ${r}, Column ${c} can only be ${val} because all other numbers (1-9) are present in its row, column, or block.`,
        };
      }
    }
  }

  // 2. Check for Hidden Single in 3x3 Block
  for (let block = 0; block < 9; block++) {
    for (let num = 1; num <= 9; num++) {
      const possibleIndices: number[] = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const row = Math.floor(block / 3) * 3 + r;
          const col = (block % 3) * 3 + c;
          const idx = row * 9 + col;
          if (currentBoard[idx] === 0 && isValid(currentBoard, idx, num)) {
            possibleIndices.push(idx);
          }
        }
      }
      if (possibleIndices.length === 1) {
        const i = possibleIndices[0];
        const r = getRow(i) + 1;
        const c = getCol(i) + 1;
        return {
          index: i,
          value: num,
          type: "Hidden Single",
          explanation: `In Block ${block + 1}, ${num} can only be placed in Row ${r}, Column ${c}.`,
        };
      }
    }
  }

  // 3. Fallback: Find any empty cell and provide deduction
  for (let i = 0; i < 81; i++) {
    if (currentBoard[i] === 0) {
      const r = getRow(i) + 1;
      const c = getCol(i) + 1;
      const val = solution[i];
      return {
        index: i,
        value: val,
        type: "Direct Deduction",
        explanation: `By logical elimination, Row ${r}, Column ${c} must be ${val}.`,
      };
    }
  }

  return null;
};
