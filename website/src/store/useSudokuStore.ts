import { create } from "zustand";
import {
  Board,
  Difficulty,
  generatePuzzle,
  getRow,
  getCol,
  getBlock,
  findSmartHint,
  HintResult,
  getCandidatesForCell,
} from "@/lib/sudokuEngine";
import { soundEffects } from "@/lib/soundEffects";
import {
  recordGameStarted,
  recordGameWon,
  recordGameLost,
  loadStats,
  PlayerStats,
} from "@/lib/gameStats";

export type ActiveModal =
  | "none"
  | "new-game"
  | "stats"
  | "settings"
  | "game-over"
  | "victory"
  | "how-to-play"
  | "daily";

export interface GameSettings {
  autoCheckMistakes: boolean;
  highlightDuplicates: boolean;
  highlightArea: boolean;
  highlightSameNumbers: boolean;
  autoRemoveNotes: boolean;
  soundEnabled: boolean;
  timerVisible: boolean;
  mistakesLimit: boolean;
}

export interface BoardSnapshot {
  board: Board;
  notes: Record<number, number[]>;
}

interface SudokuState {
  // Game Setup
  difficulty: Difficulty;
  dailyDate: string | null;
  board: Board;
  initialBoard: Board;
  solution: Board;
  notes: Record<number, number[]>;
  selectedCell: number | null;
  selectedNumber: number | null;

  // Game Status
  status: "playing" | "paused" | "game-over" | "victory";
  mistakes: number;
  score: number;
  timer: number;
  notesMode: boolean;
  fastPencilMode: boolean;
  hintsLeft: number;
  activeHint: HintResult | null;
  errorCells: number[]; // indices of conflicting or wrong cells

  // Modals & Stats
  activeModal: ActiveModal;
  stats: PlayerStats;
  settings: GameSettings;

  // History
  history: BoardSnapshot[];
  historyIndex: number;

  // Actions
  startNewGame: (difficulty?: Difficulty, dailyDate?: string) => void;
  selectCell: (index: number | null) => void;
  selectNumber: (num: number | null) => void;
  inputDigit: (num: number) => void;
  erase: () => void;
  toggleNotesMode: () => void;
  toggleFastPencilMode: () => void;
  autoFillAllNotes: () => void;
  getHint: () => void;
  undo: () => void;
  redo: () => void;
  togglePause: () => void;
  secondChance: () => void;
  tickTimer: () => void;
  openModal: (modal: ActiveModal) => void;
  closeModal: () => void;
  updateSettings: (partial: Partial<GameSettings>) => void;
  restoreSavedGame: () => boolean;
}

const ACTIVE_GAME_KEY = "sudoku_king_active_game_cache_v1";

interface SavedGameCache {
  difficulty: Difficulty;
  dailyDate: string | null;
  board: Board;
  initialBoard: Board;
  solution: Board;
  notes: Record<number, number[]>;
  mistakes: number;
  score: number;
  timer: number;
}

const saveActiveGame = (state: SudokuState) => {
  if (typeof window === "undefined" || state.status !== "playing") return;
  try {
    const cache: SavedGameCache = {
      difficulty: state.difficulty,
      dailyDate: state.dailyDate,
      board: state.board,
      initialBoard: state.initialBoard,
      solution: state.solution,
      notes: state.notes,
      mistakes: state.mistakes,
      score: state.score,
      timer: state.timer,
    };
    localStorage.setItem(ACTIVE_GAME_KEY, JSON.stringify(cache));
  } catch {}
};

const clearActiveGame = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACTIVE_GAME_KEY);
  } catch {}
};

const DEFAULT_SETTINGS: GameSettings = {
  autoCheckMistakes: true,
  highlightDuplicates: true,
  highlightArea: true,
  highlightSameNumbers: true,
  autoRemoveNotes: true,
  soundEnabled: true,
  timerVisible: true,
  mistakesLimit: true,
};

export const useSudokuStore = create<SudokuState>((set, get) => {
  // Deterministic canonical seed to guarantee 100% hydration parity between SSR and client
  const INIT_SEED = "SUDOKU_KING_INIT_2026";
  const initDifficulty: Difficulty = "Medium";
  const { puzzle, solution } = generatePuzzle(initDifficulty, INIT_SEED);

  return {
    difficulty: initDifficulty,
    dailyDate: null,
    board: [...puzzle],
    initialBoard: [...puzzle],
    solution: [...solution],
    notes: {},
    selectedCell: 0,
    selectedNumber: null,

    status: "playing",
    mistakes: 0,
    score: 1000,
    timer: 0,
    notesMode: false,
    fastPencilMode: false,
    hintsLeft: 3,
    activeHint: null,
    errorCells: [],

    activeModal: "none",
    stats: loadStats(),
    settings: DEFAULT_SETTINGS,

    history: [{ board: [...puzzle], notes: {} }],
    historyIndex: 0,

    startNewGame: (difficulty, dailyDate) => {
      clearActiveGame();
      const diff = difficulty || get().difficulty;
      const date = dailyDate || null;
      const { puzzle, solution } = generatePuzzle(diff, date || undefined);

      recordGameStarted(diff);

      set({
        difficulty: diff,
        dailyDate: date,
        board: [...puzzle],
        initialBoard: [...puzzle],
        solution: [...solution],
        notes: {},
        selectedCell: 0,
        selectedNumber: null,
        status: "playing",
        mistakes: 0,
        score: 1000,
        timer: 0,
        notesMode: false,
        hintsLeft: 3,
        activeHint: null,
        errorCells: [],
        activeModal: "none",
        stats: loadStats(),
        history: [{ board: [...puzzle], notes: {} }],
        historyIndex: 0,
      });

      soundEffects.playClick();
    },

    restoreSavedGame: () => {
      if (typeof window === "undefined") return false;
      try {
        const raw = localStorage.getItem(ACTIVE_GAME_KEY);
        if (!raw) return false;
        const saved: SavedGameCache = JSON.parse(raw);
        if (saved && Array.isArray(saved.board) && saved.board.length === 81) {
          const isComplete = saved.board.every((val, i) => val === saved.solution[i]);
          if (isComplete) {
            clearActiveGame();
            return false;
          }

          set({
            difficulty: saved.difficulty,
            dailyDate: saved.dailyDate,
            board: [...saved.board],
            initialBoard: [...saved.initialBoard],
            solution: [...saved.solution],
            notes: saved.notes || {},
            selectedCell: 0,
            selectedNumber: null,
            status: "playing",
            mistakes: saved.mistakes || 0,
            score: saved.score || 1000,
            timer: saved.timer || 0,
            history: [{ board: [...saved.board], notes: saved.notes || {} }],
            historyIndex: 0,
          });
          return true;
        }
      } catch (err) {
        console.warn("Could not restore saved game from cache:", err);
      }
      return false;
    },

    selectCell: (index) => {
      const state = get();
      if (state.status === "paused") return;

      set({ selectedCell: index, activeHint: null });

      // If in number-first mode and a number is selected, apply it immediately!
      if (state.fastPencilMode && state.selectedNumber !== null && index !== null) {
        get().inputDigit(state.selectedNumber);
      } else {
        soundEffects.playClick();
      }
    },

    selectNumber: (num) => {
      set({ selectedNumber: num });
      soundEffects.playClick();
    },

    inputDigit: (num) => {
      const state = get();
      if (state.status !== "playing") return;

      const idx = state.selectedCell;
      if (idx === null || state.initialBoard[idx] !== 0) return;

      // Handle Notes Mode (Pencil)
      if (state.notesMode) {
        const currentNotes = state.notes[idx] || [];
        const nextNotes = currentNotes.includes(num)
          ? currentNotes.filter((n) => n !== num)
          : [...currentNotes, num].sort();

        const updatedNotesMap = { ...state.notes, [idx]: nextNotes };

        // Save history snapshot
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push({
          board: [...state.board],
          notes: updatedNotesMap,
        });

        set({
          notes: updatedNotesMap,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });

        soundEffects.playNote();
        return;
      }

      // Normal Number Placement
      const isCorrect = state.solution[idx] === num;

      if (state.settings.autoCheckMistakes && !isCorrect) {
        // Mistake!
        const nextMistakes = state.mistakes + 1;
        soundEffects.playError();

        const isGameOver = state.settings.mistakesLimit && nextMistakes >= 3;
        if (isGameOver) {
          recordGameLost(state.difficulty);
          clearActiveGame();
        }

        set({
          mistakes: nextMistakes,
          score: Math.max(0, state.score - 50),
          errorCells: [...state.errorCells, idx],
          status: isGameOver ? "game-over" : "playing",
          activeModal: isGameOver ? "game-over" : state.activeModal,
        });
        return;
      }

      // Valid placement (or placement without auto-check)
      const nextBoard = [...state.board];
      nextBoard[idx] = num;

      // Auto-remove notes in row, column, and 3x3 block
      const updatedNotes = { ...state.notes };
      delete updatedNotes[idx];

      if (state.settings.autoRemoveNotes) {
        const r = getRow(idx);
        const c = getCol(idx);
        const b = getBlock(idx);

        for (let i = 0; i < 81; i++) {
          if (getRow(i) === r || getCol(i) === c || getBlock(i) === b) {
            if (updatedNotes[i]?.includes(num)) {
              updatedNotes[i] = updatedNotes[i].filter((n) => n !== num);
            }
          }
        }
      }

      // Clear from error cells if present
      const nextErrors = state.errorCells.filter((i) => i !== idx);

      // Check Victory Condition (all 81 cells filled correctly)
      const isWon = nextBoard.every((val, i) => val === state.solution[i]);

      soundEffects.playNumber(num);

      if (isWon) {
        soundEffects.playVictory();
        clearActiveGame();
        const updatedStats = recordGameWon(
          state.difficulty,
          state.timer,
          state.dailyDate || undefined
        );

        set({
          board: nextBoard,
          notes: updatedNotes,
          errorCells: nextErrors,
          status: "victory",
          score: state.score + 500 + Math.max(0, 1000 - state.timer),
          activeModal: "victory",
          stats: updatedStats,
        });
        return;
      }

      // Normal state update with history snapshot
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({
        board: nextBoard,
        notes: updatedNotes,
      });

      set({
        board: nextBoard,
        notes: updatedNotes,
        errorCells: nextErrors,
        score: state.score + 10,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
      saveActiveGame(get());
    },

    erase: () => {
      const state = get();
      if (state.status !== "playing") return;

      const idx = state.selectedCell;
      if (idx === null || state.initialBoard[idx] !== 0) return;

      const nextBoard = [...state.board];
      nextBoard[idx] = 0;

      const nextNotes = { ...state.notes };
      delete nextNotes[idx];

      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({
        board: nextBoard,
        notes: nextNotes,
      });

      soundEffects.playErase();

      set({
        board: nextBoard,
        notes: nextNotes,
        errorCells: state.errorCells.filter((i) => i !== idx),
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
      saveActiveGame(get());
    },

    toggleNotesMode: () => {
      set((s) => ({ notesMode: !s.notesMode }));
      soundEffects.playClick();
    },

    toggleFastPencilMode: () => {
      set((s) => ({ fastPencilMode: !s.fastPencilMode }));
      soundEffects.playClick();
    },

    autoFillAllNotes: () => {
      const state = get();
      if (state.status !== "playing") return;

      const autoNotes: Record<number, number[]> = {};
      for (let i = 0; i < 81; i++) {
        if (state.board[i] === 0) {
          autoNotes[i] = getCandidatesForCell(state.board, i);
        }
      }

      set({ notes: autoNotes });
      soundEffects.playNote();
    },

    getHint: () => {
      const state = get();
      if (state.status !== "playing" || state.hintsLeft <= 0) return;

      const hint = findSmartHint(state.board, state.solution);
      if (!hint) return;

      // Select that cell, reveal the explanation and auto-fill it!
      const nextBoard = [...state.board];
      nextBoard[hint.index] = hint.value;

      const nextNotes = { ...state.notes };
      delete nextNotes[hint.index];

      // Auto-remove notes in house
      const r = getRow(hint.index);
      const c = getCol(hint.index);
      const b = getBlock(hint.index);
      for (let i = 0; i < 81; i++) {
        if (getRow(i) === r || getCol(i) === c || getBlock(i) === b) {
          if (nextNotes[i]?.includes(hint.value)) {
            nextNotes[i] = nextNotes[i].filter((n) => n !== hint.value);
          }
        }
      }

      soundEffects.playNumber(hint.value);

      const isWon = nextBoard.every((val, i) => val === state.solution[i]);
      if (isWon) {
        soundEffects.playVictory();
        const updatedStats = recordGameWon(
          state.difficulty,
          state.timer,
          state.dailyDate || undefined
        );
        set({
          board: nextBoard,
          notes: nextNotes,
          selectedCell: hint.index,
          activeHint: hint,
          hintsLeft: state.hintsLeft - 1,
          status: "victory",
          activeModal: "victory",
          stats: updatedStats,
        });
        return;
      }

      set({
        board: nextBoard,
        notes: nextNotes,
        selectedCell: hint.index,
        activeHint: hint,
        hintsLeft: state.hintsLeft - 1,
      });
    },

    undo: () => {
      const state = get();
      if (state.historyIndex <= 0 || state.status !== "playing") return;

      const nextIndex = state.historyIndex - 1;
      const snapshot = state.history[nextIndex];

      soundEffects.playErase();

      set({
        board: [...snapshot.board],
        notes: { ...snapshot.notes },
        historyIndex: nextIndex,
      });
      saveActiveGame(get());
    },

    redo: () => {
      const state = get();
      if (state.historyIndex >= state.history.length - 1 || state.status !== "playing") return;

      const nextIndex = state.historyIndex + 1;
      const snapshot = state.history[nextIndex];

      soundEffects.playClick();

      set({
        board: [...snapshot.board],
        notes: { ...snapshot.notes },
        historyIndex: nextIndex,
      });
      saveActiveGame(get());
    },

    togglePause: () => {
      const current = get().status;
      if (current === "playing") {
        set({ status: "paused" });
        saveActiveGame(get());
      } else if (current === "paused") {
        set({ status: "playing" });
      }
      soundEffects.playClick();
    },

    secondChance: () => {
      set({
        mistakes: 2, // Reset to 2/3 so player gets one more chance!
        status: "playing",
        activeModal: "none",
      });
      soundEffects.playClick();
    },

    tickTimer: () => {
      if (get().status === "playing") {
        set((s) => ({ timer: s.timer + 1 }));
      }
    },

    openModal: (modal) => {
      set({ activeModal: modal });
      soundEffects.playClick();
    },

    closeModal: () => {
      set({ activeModal: "none" });
      soundEffects.playClick();
    },

    updateSettings: (partial) => {
      const updated = { ...get().settings, ...partial };
      if (partial.soundEnabled !== undefined) {
        soundEffects.setEnabled(partial.soundEnabled);
      }
      set({ settings: updated });
    },
  };
});
