// Helper functions to get coordinates
export const getRow = (index) => Math.floor(index / 9);
export const getCol = (index) => index % 9;
export const getBlock = (index) => Math.floor(getRow(index) / 3) * 3 + Math.floor(getCol(index) / 3);
// Check if placing 'num' at 'index' is valid
export const isValid = (board, index, num) => {
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
// Backtracking solver
// Returns true if solvable, mutates the board
export const solveBoard = (board) => {
    for (let i = 0; i < 81; i++) {
        if (board[i] === 0) {
            for (let num = 1; num <= 9; num++) {
                if (isValid(board, i, num)) {
                    board[i] = num;
                    if (solveBoard(board)) {
                        return true;
                    }
                    board[i] = 0; // Backtrack
                }
            }
            return false;
        }
    }
    return true; // Solved
};
// Count solutions to ensure uniqueness
export const countSolutions = (board, count = { value: 0 }) => {
    if (count.value > 1)
        return count.value;
    for (let i = 0; i < 81; i++) {
        if (board[i] === 0) {
            for (let num = 1; num <= 9; num++) {
                if (isValid(board, i, num)) {
                    board[i] = num;
                    countSolutions(board, count);
                    board[i] = 0;
                }
            }
            return count.value;
        }
    }
    count.value++;
    return count.value;
};
// Generate a fully valid random board
export const generateFullBoard = () => {
    const board = Array(81).fill(0);
    // Fill diagonal blocks first for randomness and speed (they don't intersect)
    for (let block = 0; block < 9; block += 4) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
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
// Generate a playable puzzle
export const generatePuzzle = (difficulty) => {
    const solution = generateFullBoard();
    const puzzle = [...solution];
    let holesToDig = 0;
    switch (difficulty) {
        case 'Fast':
            holesToDig = 20;
            break;
        case 'Easy':
            holesToDig = 30;
            break;
        case 'Medium':
            holesToDig = 40;
            break;
        case 'Hard':
            holesToDig = 50;
            break;
        case 'Expert':
            holesToDig = 58;
            break; // Leaves exactly 23 givens
    }
    // Randomize positions to dig
    const indices = Array.from({ length: 81 }, (_, i) => i).sort(() => Math.random() - 0.5);
    for (const index of indices) {
        if (holesToDig === 0)
            break;
        if (puzzle[index] === 0)
            continue;
        const backup = puzzle[index];
        puzzle[index] = 0;
        // Check if it still has exactly one unique solution
        const tempBoard = [...puzzle];
        if (countSolutions(tempBoard, { value: 0 }) !== 1) {
            puzzle[index] = backup; // Put it back, digging here breaks uniqueness
        }
        else {
            holesToDig--;
        }
    }
    return { puzzle, solution };
};
