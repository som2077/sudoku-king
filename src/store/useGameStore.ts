import { create } from 'zustand';

export type CellState = {
  value: number | null;
  notes: number; // Bitmask for notes 1-9
  isLocked: boolean; // True if it's an initial given clue
  isError: boolean;
};

type GameState = {
  board: CellState[];
  selectedCell: number | null;
  isNotesMode: boolean;
  mistakes: number;
  timer: number;
  hintsRemaining: number;
  
  // Actions
  selectCell: (index: number) => void;
  toggleNotesMode: () => void;
  placeNumber: (num: number) => void;
  toggleNote: (num: number) => void;
  erase: () => void;
};

const initialBoard = Array(81).fill(null).map(() => ({
  value: null,
  notes: 0,
  isLocked: false,
  isError: false,
}));

export const useGameStore = create<GameState>((set) => ({
  board: initialBoard,
  selectedCell: null,
  isNotesMode: false,
  mistakes: 0,
  timer: 0,
  hintsRemaining: 3,

  selectCell: (index) => set({ selectedCell: index }),
  
  toggleNotesMode: () => set((state) => ({ isNotesMode: !state.isNotesMode })),
  
  placeNumber: (num) => set((state) => {
    if (state.selectedCell === null) return state;
    if (state.board[state.selectedCell].isLocked) return state;
    
    const newBoard = [...state.board];
    newBoard[state.selectedCell] = {
      ...newBoard[state.selectedCell],
      value: num,
      notes: 0, // Clear notes when placing a number
    };
    
    return { board: newBoard };
  }),
  
  toggleNote: (num) => set((state) => {
    if (state.selectedCell === null) return state;
    if (state.board[state.selectedCell].isLocked || state.board[state.selectedCell].value !== null) return state;
    
    const newBoard = [...state.board];
    const cell = newBoard[state.selectedCell];
    const bit = 1 << num;
    
    newBoard[state.selectedCell] = {
      ...cell,
      notes: cell.notes ^ bit, // Toggle the specific bit
    };
    
    return { board: newBoard };
  }),
  
  erase: () => set((state) => {
    if (state.selectedCell === null) return state;
    if (state.board[state.selectedCell].isLocked) return state;
    
    const newBoard = [...state.board];
    newBoard[state.selectedCell] = {
      ...newBoard[state.selectedCell],
      value: null,
      notes: 0,
    };
    
    return { board: newBoard };
  }),
}));
