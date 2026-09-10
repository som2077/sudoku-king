import { create } from "zustand";
import { persist, StateStorage, createJSONStorage } from "zustand/middleware";
import { createMMKV } from "react-native-mmkv";
import { getAnalytics, logEvent } from "@react-native-firebase/analytics";
import {
  getRemoteConfig,
  fetchAndActivate,
  getNumber,
} from "@react-native-firebase/remote-config";
import {
  generatePuzzle,
  Difficulty,
  isValid,
  getRow,
  getCol,
  getBlock,
} from "../utils/sudokuLogic";

const storage = createMMKV({ id: "sudoku-storage" });

let persistWriteTimer: ReturnType<typeof setTimeout> | null = null;
let pendingPersistWrite: { name: string; value: string } | null = null;

const zustandStorage: StateStorage = {
  // Selection and timer updates happen frequently. Keep MMKV writes off the
  // tap path while still persisting the latest game state shortly afterward.
  setItem: (name, value) => {
    pendingPersistWrite = { name, value };
    if (persistWriteTimer !== null) clearTimeout(persistWriteTimer);
    persistWriteTimer = setTimeout(() => {
      if (pendingPersistWrite) {
        storage.set(pendingPersistWrite.name, pendingPersistWrite.value);
        pendingPersistWrite = null;
      }
      persistWriteTimer = null;
    }, 120);
  },
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => {
    if (persistWriteTimer !== null) clearTimeout(persistWriteTimer);
    persistWriteTimer = null;
    pendingPersistWrite = null;
    storage.remove(name);
  },
};

export type CellState = {
  value: number | null;
  notes: number; // Bitmask for notes 1-9
  isLocked: boolean; // True if it's an initial given clue
  isError: boolean;
};

export interface DifficultyStatsRecord {
  solved: number;
  played: number;
  bestSec: number | null;
  totalSec: number;
}

export interface DailyGameStat {
  played: number;
  solved: number;
  bestSec: number | null;
}

export interface DailyProgressItem {
  completed: boolean;
  timeSec?: number;
  mistakes?: number;
  completedAt?: string;
  difficulty?: Difficulty;
}

export const getDailyDifficulty = (dateStr: string): Difficulty => {
  const [year, month, dayNum] = dateStr.split("-").map(Number);
  const dateObj = new Date(year, month - 1, dayNum);
  const day = dateObj.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
  switch (day) {
    case 1:
      return "Easy"; // Monday
    case 2:
      return "Medium"; // Tuesday
    case 3:
      return "Medium"; // Wednesday
    case 4:
      return "Hard"; // Thursday
    case 5:
      return "Hard"; // Friday
    case 6:
      return "Expert"; // Saturday
    case 0:
      return "Master"; // Sunday
    default:
      return "Medium";
  }
};

export const isDailyChallengeCompleted = (
  progress: Record<string, DailyProgressItem | boolean> | undefined,
  dateStr: string,
): boolean => {
  if (!progress) return false;
  const item = progress[dateStr];
  if (!item) return false;
  if (typeof item === "boolean") return item;
  return !!item.completed;
};

export const getDailyChallengeItem = (
  progress: Record<string, DailyProgressItem | boolean> | undefined,
  dateStr: string,
): DailyProgressItem | null => {
  if (!progress) return null;
  const item = progress[dateStr];
  if (!item) return null;
  if (typeof item === "boolean") {
    return { completed: item };
  }
  return item;
};

export interface GameSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  notificationsEnabled: boolean;
  highlightDuplicates: boolean;
  highlightSameNumbers: boolean;
  autoCheckMistakes: boolean;
  highlightAreas: boolean;
  timerVisible: boolean;
  language: string;
}

export const defaultGameSettings: GameSettings = {
  soundEnabled: true,
  vibrationEnabled: true,
  notificationsEnabled: true,
  highlightDuplicates: true,
  highlightSameNumbers: true,
  autoCheckMistakes: true,
  highlightAreas: true,
  timerVisible: true,
  language: "en",
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
  screen: "home" | "playing";
  difficulty: Difficulty;
  settings: GameSettings;

  // Real Persistent Stats
  difficultyStats: Record<string, DifficultyStatsRecord>;
  dailyHistory: Record<string, DailyGameStat>;
  totalSolved: number;
  totalPlayed: number;
  bestTimeSec: number | null;
  isGameCompleted: boolean;
  todaySolved: number;
  lastSolvedDate: string | null;
  streak: number;
  hasSeenWelcome: boolean;
  hasCompletedOnboarding: boolean;
  trialEndsAt: number | null;
  hasUsedFreeTrial: boolean;
  hasCompletedTutorial: boolean;
  hasSkippedTutorial: boolean;

  // Actions
  completeWelcome: () => void;
  resetWelcome: () => void;
  completeOnboarding: (startingDifficulty?: Difficulty) => void;
  resetOnboarding: () => void;
  completeTutorial: () => void;
  skipTutorial: () => void;
  resetTutorial: () => void;
  activateThreeDayTrial: () => void;
  checkTrialStatus: () => boolean;
  getTrialDaysRemaining: () => number;
  recordGameWon: (difficulty: Difficulty, timeSec: number) => void;
  recordGamePlayed: (difficulty: Difficulty) => void;
  setScreen: (screen: "home" | "playing") => void;
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
  updateSetting: <K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K],
  ) => void;
  resetAllStats: () => void;

  // Daily Challenges
  dailyChallengesProgress: Record<string, DailyProgressItem | boolean>;
  currentDailyChallenge: string | null;
  startDailyChallenge: (dateStr: string) => void;
  completeDailyChallenge: (
    dateStr: string,
    timeSec?: number,
    mistakes?: number,
  ) => void;
};

const initialBoard: CellState[] = Array(81)
  .fill(null)
  .map(() => ({
    value: null,
    notes: 0,
    isLocked: false,
    isError: false,
  }));

const getLocalDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const initialDifficultyStats: Record<string, DifficultyStatsRecord> = {
  Easy: { solved: 0, played: 0, bestSec: null, totalSec: 0 },
  Medium: { solved: 0, played: 0, bestSec: null, totalSec: 0 },
  Hard: { solved: 0, played: 0, bestSec: null, totalSec: 0 },
  Expert: { solved: 0, played: 0, bestSec: null, totalSec: 0 },
  Master: { solved: 0, played: 0, bestSec: null, totalSec: 0 },
  Extreme: { solved: 0, played: 0, bestSec: null, totalSec: 0 },
  Fast: { solved: 0, played: 0, bestSec: null, totalSec: 0 },
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get): GameState => ({
      board: initialBoard,
      solution: Array(81).fill(0),
      selectedCell: null as number | null,
      isNotesMode: false,
      mistakes: 0,
      timer: 0,
      hintsRemaining: 3,
      initialHints: 3,
      isPremium: false,
      history: [],
      screen: "home",
      difficulty: "Easy" as Difficulty,
      settings: defaultGameSettings,

      // Real Persistent Stats
      difficultyStats: initialDifficultyStats,
      dailyHistory: {},
      totalSolved: 0,
      totalPlayed: 0,
      bestTimeSec: null,
      isGameCompleted: false,
      todaySolved: 0,
      lastSolvedDate: null,
      streak: 0,
      hasSeenWelcome: false,
      hasCompletedOnboarding: false,
      trialEndsAt: null,
      hasUsedFreeTrial: false,
      hasCompletedTutorial: false,
      hasSkippedTutorial: false,

      completeWelcome: () => set({ hasSeenWelcome: true }),
      resetWelcome: () =>
        set({ hasSeenWelcome: false, hasCompletedOnboarding: false }),
      completeOnboarding: (startingDifficulty) =>
        set((state) => ({
          hasSeenWelcome: true,
          hasCompletedOnboarding: true,
          difficulty: startingDifficulty || state.difficulty || "Easy",
        })),
      resetOnboarding: () => set({ hasCompletedOnboarding: false }),
      completeTutorial: () => set({ hasCompletedTutorial: true }),
      skipTutorial: () => set({ hasSkippedTutorial: true }),
      resetTutorial: () =>
        set({ hasCompletedTutorial: false, hasSkippedTutorial: false }),

      activateThreeDayTrial: () =>
        set(() => {
          const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
          const endsAt = Date.now() + THREE_DAYS_MS;
          console.log(
            "🎉 [GameStore] 3-Day Free Trial Activated until:",
            new Date(endsAt).toISOString(),
          );
          return {
            trialEndsAt: endsAt,
            hasUsedFreeTrial: true,
            isPremium: true,
          };
        }),

      checkTrialStatus: () => {
        const state = useGameStore.getState();
        if (state.trialEndsAt && state.trialEndsAt > Date.now()) {
          if (!state.isPremium) {
            set({ isPremium: true });
          }
          return true;
        }
        return false;
      },

      getTrialDaysRemaining: () => {
        const state = useGameStore.getState();
        if (!state.trialEndsAt || state.trialEndsAt <= Date.now()) return 0;
        const diffMs = state.trialEndsAt - Date.now();
        return Math.max(1, Math.ceil(diffMs / (24 * 60 * 60 * 1000)));
      },

      recordGameWon: (difficulty, timeSec) =>
        set((state) => {
          if (state.isGameCompleted) return state;
          const todayStr = getLocalDateString();
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = getLocalDateString(yesterday);

          let newStreak = state.streak || 0;
          if (state.lastSolvedDate === yesterdayStr) {
            newStreak += 1;
          } else if (state.lastSolvedDate !== todayStr) {
            newStreak = 1;
          }

          const prevStats = state.difficultyStats || initialDifficultyStats;
          const prevDiff = prevStats[difficulty] || {
            solved: 0,
            played: 0,
            bestSec: null,
            totalSec: 0,
          };

          const newBest =
            prevDiff.bestSec === null
              ? timeSec
              : Math.min(prevDiff.bestSec, timeSec);
          const newOverallBest =
            state.bestTimeSec === null
              ? timeSec
              : Math.min(state.bestTimeSec, timeSec);
          const isToday = state.lastSolvedDate === todayStr;
          const newTodaySolved = isToday ? (state.todaySolved || 0) + 1 : 1;

          const prevDaily = state.dailyHistory?.[todayStr] || {
            played: 1,
            solved: 0,
            bestSec: null,
          };
          const newDailyBest =
            prevDaily.bestSec === null
              ? timeSec
              : Math.min(prevDaily.bestSec, timeSec);

          return {
            isGameCompleted: true,
            totalSolved: (state.totalSolved || 0) + 1,
            bestTimeSec: newOverallBest,
            todaySolved: newTodaySolved,
            lastSolvedDate: todayStr,
            streak: newStreak,
            difficultyStats: {
              ...prevStats,
              [difficulty]: {
                ...prevDiff,
                solved: prevDiff.solved + 1,
                bestSec: newBest,
                totalSec: prevDiff.totalSec + timeSec,
              },
            },
            dailyHistory: {
              ...(state.dailyHistory || {}),
              [todayStr]: {
                played: Math.max(prevDaily.played, prevDaily.solved + 1),
                solved: prevDaily.solved + 1,
                bestSec: newDailyBest,
              },
            },
          };
        }),

      recordGamePlayed: (difficulty) =>
        set((state) => {
          const todayStr = getLocalDateString();
          const prevStats = state.difficultyStats || initialDifficultyStats;
          const prevDiff = prevStats[difficulty] || {
            solved: 0,
            played: 0,
            bestSec: null,
            totalSec: 0,
          };
          const prevDaily = state.dailyHistory?.[todayStr] || {
            played: 0,
            solved: 0,
            bestSec: null,
          };

          return {
            totalPlayed: (state.totalPlayed || 0) + 1,
            difficultyStats: {
              ...prevStats,
              [difficulty]: {
                ...prevDiff,
                played: prevDiff.played + 1,
              },
            },
            dailyHistory: {
              ...(state.dailyHistory || {}),
              [todayStr]: {
                ...prevDaily,
                played: prevDaily.played + 1,
              },
            },
          };
        }),

      setScreen: (screen) => set({ screen }),
      setPremium: (status) =>
        set((state) => {
          const isTrialActive = Boolean(
            state.trialEndsAt && state.trialEndsAt > Date.now(),
          );
          return { isPremium: status || isTrialActive };
        }),

      updateSetting: (key, value) =>
        set((state) => ({
          settings: {
            ...(state.settings ?? defaultGameSettings),
            [key]: value,
          },
        })),

      resetAllStats: () =>
        set({
          totalSolved: 0,
          totalPlayed: 0,
          bestTimeSec: null,
          streak: 0,
          todaySolved: 0,
          difficultyStats: initialDifficultyStats,
          dailyHistory: {},
        }),

      fetchRemoteConfig: async () => {
        try {
          const rc = getRemoteConfig();
          rc.defaultConfig = { initial_hints: 3 };
          await fetchAndActivate(rc);
          const hints = getNumber(rc, "initial_hints");
          console.log(
            "🔥 [Firebase Remote Config] Fetched initial_hints:",
            hints,
          );
          set({ initialHints: hints });
        } catch (e) {
          console.log("🔥 [Firebase Remote Config Error]:", e);
        }
      },

      selectCell: (index) =>
        set((state) =>
          state.selectedCell === index ? state : { selectedCell: index },
        ),

      toggleNotesMode: () =>
        set((state) => ({ isNotesMode: !state.isNotesMode })),

      placeNumber: (num) =>
        set((state) => {
          if (state.selectedCell === null || state.mistakes >= 3) return state;
          const cell = state.board[state.selectedCell];
          if (cell.isLocked || (cell.value !== null && !cell.isError))
            return state;

          const newBoard = [...state.board];

          if (state.isNotesMode) {
            const bit = 1 << num;
            newBoard[state.selectedCell] = {
              ...cell,
              notes: cell.notes ^ bit,
            };
            return {
              board: newBoard,
              history: [...state.history, state.board],
            };
          }

          const isCorrect = state.solution[state.selectedCell] === num;

          // Auto-remove this number from notes in the same row, col, and block
          if (isCorrect) {
            const row = getRow(state.selectedCell);
            const col = getCol(state.selectedCell);
            const block = getBlock(state.selectedCell);

            for (let i = 0; i < 81; i++) {
              if (
                getRow(i) === row ||
                getCol(i) === col ||
                getBlock(i) === block
              ) {
                const bit = 1 << num;
                if (newBoard[i].notes & bit) {
                  newBoard[i] = {
                    ...newBoard[i],
                    notes: newBoard[i].notes ^ bit,
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

      toggleNote: (num) =>
        set((state) => {
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

      erase: () =>
        set((state) => {
          if (state.selectedCell === null) return state;
          const cell = state.board[state.selectedCell];
          if (cell.isLocked) return state;

          const newBoard = [...state.board];
          newBoard[state.selectedCell] = {
            ...cell,
            value: null,
            isError: false,
            notes: 0,
          };
          return { board: newBoard, history: [...state.history, state.board] };
        }),

      undo: () =>
        set((state) => {
          if (state.history.length === 0) return state;
          const newHistory = [...state.history];
          const previousBoard = newHistory.pop()!;
          return { board: previousBoard, history: newHistory };
        }),

      useHint: () =>
        set((state) => {
          if (state.selectedCell === null) return state;
          if (
            state.board[state.selectedCell].isLocked ||
            state.board[state.selectedCell].value !== null
          )
            return state;

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
            console.log("🔥 [Firebase Analytics] Logging Event: hint_used");
            logEvent(analytics, "hint_used", {
              hints_remaining_after: state.isPremium
                ? state.hintsRemaining
                : state.hintsRemaining - 1,
            });
          } catch (e) {
            console.log("🔥 [Firebase Analytics Error]:", e);
          }

          return {
            board: newBoard,
            hintsRemaining: state.isPremium
              ? state.hintsRemaining
              : state.hintsRemaining - 1,
            history: [...state.history, state.board],
          };
        }),

      addHint: () =>
        set((state) => ({ hintsRemaining: state.hintsRemaining + 1 })),

      secondChance: () => set({ mistakes: 2 }),

      startNewGame: async (difficulty) => {
        const { puzzle, solution } = generatePuzzle(difficulty);
        const newBoard = puzzle.map((val) => ({
          value: val === 0 ? null : val,
          notes: 0,
          isLocked: val !== 0,
          isError: false,
        }));

        try {
          const analytics = getAnalytics();
          logEvent(analytics, "game_started", { difficulty });
        } catch (e) {
          console.log("Analytics Error:", e);
        }

        set((state) => {
          const todayStr = getLocalDateString();
          const prevStats = state.difficultyStats || initialDifficultyStats;
          const prevDiff = prevStats[difficulty] || {
            solved: 0,
            played: 0,
            bestSec: null,
            totalSec: 0,
          };
          const prevDaily = state.dailyHistory?.[todayStr] || {
            played: 0,
            solved: 0,
            bestSec: null,
          };

          return {
            board: newBoard,
            solution,
            difficulty,
            selectedCell: null,
            mistakes: 0,
            timer: 0,
            history: [],
            hintsRemaining: state.initialHints,
            screen: "playing",
            currentDailyChallenge: null, // Reset daily challenge tracker
            isGameCompleted: false,
            totalPlayed: (state.totalPlayed || 0) + 1,
            difficultyStats: {
              ...prevStats,
              [difficulty]: {
                ...prevDiff,
                played: prevDiff.played + 1,
              },
            },
            dailyHistory: {
              ...(state.dailyHistory || {}),
              [todayStr]: {
                ...prevDaily,
                played: prevDaily.played + 1,
              },
            },
          };
        });
      },

      // Daily Challenge Implementation
      dailyChallengesProgress: {},
      currentDailyChallenge: null,

      startDailyChallenge: (dateStr) => {
        const difficulty = getDailyDifficulty(dateStr);
        const { puzzle, solution } = generatePuzzle(
          difficulty,
          `daily-${dateStr}`,
        ); // deterministic seed
        const newBoard = puzzle.map((val) => ({
          value: val === 0 ? null : val,
          notes: 0,
          isLocked: val !== 0,
          isError: false,
        }));

        set((state) => {
          const prevStats = state.difficultyStats || initialDifficultyStats;
          const prevDiff = prevStats[difficulty] || {
            solved: 0,
            played: 0,
            bestSec: null,
            totalSec: 0,
          };
          const prevDaily = state.dailyHistory?.[dateStr] || {
            played: 0,
            solved: 0,
            bestSec: null,
          };

          return {
            board: newBoard,
            solution,
            difficulty,
            selectedCell: null,
            mistakes: 0,
            timer: 0,
            history: [],
            hintsRemaining: state.initialHints,
            screen: "playing",
            currentDailyChallenge: dateStr,
            isGameCompleted: false,
            totalPlayed: (state.totalPlayed || 0) + 1,
            difficultyStats: {
              ...prevStats,
              [difficulty]: {
                ...prevDiff,
                played: prevDiff.played + 1,
              },
            },
            dailyHistory: {
              ...(state.dailyHistory || {}),
              [dateStr]: {
                ...prevDaily,
                played: prevDaily.played + 1,
              },
            },
          };
        });
      },

      completeDailyChallenge: (dateStr, timeSec = 0, mistakes = 0) => {
        const todayStr = getLocalDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = getLocalDateString(yesterday);

        set((state) => {
          const diff = getDailyDifficulty(dateStr);
          const currentItem = getDailyChallengeItem(
            state.dailyChallengesProgress,
            dateStr,
          );
          const bestTime = currentItem?.timeSec
            ? Math.min(currentItem.timeSec, timeSec)
            : timeSec || undefined;

          let newStreak = state.streak || 0;
          if (dateStr === todayStr) {
            if (state.lastSolvedDate === yesterdayStr) {
              newStreak += 1;
            } else if (state.lastSolvedDate !== todayStr) {
              newStreak = 1;
            }
          }

          const prevDaily = state.dailyHistory?.[dateStr] || {
            played: 1,
            solved: 0,
            bestSec: null,
          };
          const newDailyBest =
            timeSec > 0
              ? prevDaily.bestSec === null
                ? timeSec
                : Math.min(prevDaily.bestSec, timeSec)
              : prevDaily.bestSec;

          return {
            lastSolvedDate:
              dateStr === todayStr ? todayStr : state.lastSolvedDate,
            streak: dateStr === todayStr ? newStreak : state.streak,
            dailyChallengesProgress: {
              ...state.dailyChallengesProgress,
              [dateStr]: {
                completed: true,
                timeSec: bestTime,
                mistakes,
                completedAt: new Date().toISOString(),
                difficulty: diff,
              },
            },
            dailyHistory: {
              ...(state.dailyHistory || {}),
              [dateStr]: {
                played: Math.max(prevDaily.played, prevDaily.solved + 1),
                solved: prevDaily.solved + 1,
                bestSec: newDailyBest,
              },
            },
          };
        });
      },
    }),
    {
      name: "sudoku-game-storage",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
