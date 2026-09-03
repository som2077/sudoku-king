import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import { getAnalytics, logEvent } from '@react-native-firebase/analytics';
import { getRemoteConfig, fetchAndActivate, getNumber } from '@react-native-firebase/remote-config';
import { generatePuzzle, Difficulty, isValid, getRow, getCol, getBlock } from '../utils/sudokuLogic';

const storage = createMMKV({ id: 'sudoku-storage' });

const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => storage.remove(name),
};

export type CellState = {
  value: number | null;
  notes: number; // Bitmask for notes 1-9
  isLocked: boolean; // True if it's an initial given clue
  isError: boolean;
};

type GameState = {
  board: CellState[];
  solution: number[]; // Added to store the correct answer
  selectedCell: number | null;
  isNotesMode: boolean;
  mistakes: number;
  timer: number;
  hintsRemaining: number;
  initialHints: number; // Stored from remote config
  isPremium: boolean;
  history: CellState[][];
  screen: 'home' | 'playing';

  // Actions
  setScreen: (screen: 'home' | 'playing') => void;
  setPremium: (status: boolean) => void;
  selectCell: (index: number) => void;
  toggleNotesMode: () => void;
  placeNumber: (num: number) => void;
  toggleNote: (num: number) => void;
  erase: () => void;
  undo: () => void;
  useHint: () => void; // Added hint action
  addHint: () => void;
  secondChance: () => void;
  startNewGame: (difficulty: Difficulty) => void;
  fetchRemoteConfig: () => Promise<void>;
};

const initialBoard = Array(81).fill(null).map(() => ({
  value: null,
  notes: 0,
  isLocked: false,
  isError: false,
}));

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      board: initialBoard,
      solution: Array(81).fill(0),
      selectedCell: null,
      isNotesMode: false,
      mistakes: 0,
      timer: 0,
      hintsRemaining: 3,
      initialHints: 3,
      isPremium: false,
      history: [],
      screen: 'home',

      setScreen: (screen) => set({ screen }),
      setPremium: (status) => set({ isPremium: status }),

      fetchRemoteConfig: async () => {
        try {
          const rc = getRemoteConfig();
          rc.defaultConfig = { initial_hints: 3 };
          await fetchAndActivate(rc);
          const hints = getNumber(rc, 'initial_hints');
          console.log('🔥 [Firebase Remote Config] Fetched initial_hints:', hints);
          set({ initialHints: hints });
        } catch (e) { console.log('🔥 [Firebase Remote Config Error]:', e); }
      },

      selectCell: (index) => set({ selectedCell: index }),

      toggleNotesMode: () => set((state) => ({ isNotesMode: !state.isNotesMode })),

      placeNumber: (num) => set((state) => {
        if (state.selectedCell === null || state.mistakes >= 3) return state;
        const cell = state.board[state.selectedCell];
        if (cell.isLocked || cell.value !== null) return state;

        const newBoard = [...state.board];

        if (state.isNotesMode) {
          const bit = 1 << num;
          newBoard[state.selectedCell] = {
            ...cell,
            notes: cell.notes ^ bit,
          };
          return { board: newBoard, history: [...state.history, state.board] };
        }

        const isCorrect = state.solution[state.selectedCell] === num;
        
        // Auto-remove this number from notes in the same row, col, and block
        if (isCorrect) {
          const row = getRow(state.selectedCell);
          const col = getCol(state.selectedCell);
          const block = getBlock(state.selectedCell);

          for (let i = 0; i < 81; i++) {
            if (getRow(i) === row || getCol(i) === col || getBlock(i) === block) {
              const bit = 1 << num;
              if (newBoard[i].notes & bit) {
                newBoard[i] = {
                  ...newBoard[i],
                  notes: newBoard[i].notes ^ bit
                };
              }
            }
          }
        }

        newBoard[state.selectedCell] = {
          ...cell,
          value: num,
          isError: !isCorrect,
          notes: 0, // Clear notes when a number is placed
        };

        return {
          board: newBoard,
          mistakes: isCorrect ? state.mistakes : state.mistakes + 1,
          history: [...state.history, state.board],
        };
      }),

      toggleNote: (num) => set((state) => {
        if (state.selectedCell === null) return state;
        const cell = state.board[state.selectedCell];
        if (cell.isLocked || cell.value !== null) return state;

        const bit = 1 << num;
        const newBoard = [...state.board];
        newBoard[state.selectedCell] = {
          ...cell,
          notes: cell.notes ^ bit,
        };
        return { board: newBoard, history: [...state.history, state.board] };
      }),

      erase: () => set((state) => {
        if (state.selectedCell === null) return state;
        const cell = state.board[state.selectedCell];
        if (cell.isLocked) return state;

        const newBoard = [...state.board];
        newBoard[state.selectedCell] = { ...cell, value: null, isError: false, notes: 0 };
        return { board: newBoard, history: [...state.history, state.board] };
      }),

      undo: () => set((state) => {
        if (state.history.length === 0) return state;
        const newHistory = [...state.history];
        const previousBoard = newHistory.pop()!;
        return { board: previousBoard, history: newHistory };
      }),

      useHint: () => set((state) => {
        if (state.selectedCell === null) return state;
        if (state.board[state.selectedCell].isLocked || state.board[state.selectedCell].value !== null) return state;
        
        // Block if not premium and out of hints
        if (!state.isPremium && state.hintsRemaining <= 0) return state; 

        const correctNum = state.solution[state.selectedCell];
        const newBoard = [...state.board];

        newBoard[state.selectedCell] = {
          ...newBoard[state.selectedCell],
          value: correctNum,
          notes: 0,
          isError: false,
          isLocked: true, // Lock the hinted cell so they can't erase it
        };

        // Log Analytics
        try {
          const analytics = getAnalytics();
          console.log('🔥 [Firebase Analytics] Logging Event: hint_used');
          logEvent(analytics, 'hint_used', {
            hints_remaining_after: state.isPremium ? state.hintsRemaining : state.hintsRemaining - 1
          });
        } catch (e) { console.log('🔥 [Firebase Analytics Error]:', e); }

        return {
          board: newBoard,
          hintsRemaining: state.isPremium ? state.hintsRemaining : state.hintsRemaining - 1,
          history: [...state.history, state.board]
        };
      }),

      addHint: () => set((state) => ({ hintsRemaining: state.hintsRemaining + 1 })),
      
      secondChance: () => set({ mistakes: 2 }),

      startNewGame: async (difficulty) => {
        const { puzzle, solution } = generatePuzzle(difficulty);
        const newBoard = puzzle.map((val) => ({
          value: val === 0 ? null : val,
          notes: 0,
          isLocked: val !== 0,
          isError: false,
        }));

        // Log Analytics
        try {
          const analytics = getAnalytics();
          console.log(`🔥 [Firebase Analytics] Logging Event: game_started (Difficulty: ${difficulty})`);
          logEvent(analytics, 'game_started', {
            difficulty: difficulty
          });
        } catch (e) { console.log('🔥 [Firebase Analytics Error]:', e); }

        set((state) => ({
          board: newBoard,
          solution,
          selectedCell: null,
          mistakes: 0,
          timer: 0,
          history: [],
          hintsRemaining: state.initialHints,
          screen: 'playing'
        }));
      }
    }),
    {
      name: 'sudoku-game-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
