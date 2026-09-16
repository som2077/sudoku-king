import { create } from "zustand";
import { persist, StateStorage, createJSONStorage } from "zustand/middleware";
import { createMMKV } from "react-native-mmkv";
import { analyticsService } from "../services/analyticsService";
import {
  getRemoteConfig,
  fetchAndActivate,
  getNumber,
} from "@react-native-firebase/remote-config";
import {
  generatePuzzle,
  Difficulty,
  getRow,
  getCol,
  getBlock,
} from "../utils/sudokuLogic";
import {
  emptyGameStats,
  markDailyChallengeSolved,
  normalizeGameTime,
  recordDailyGameSolved,
  recordPlayed,
  recordSolved,
} from "../utils/gameStats";

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

export type HistoryEntry = {
  board: CellState[];
  mistakes: number;
  hintsRemaining: number;
  isNotesMode: boolean;
};

const createHistoryEntry = (state: {
  board: CellState[];
  mistakes: number;
  hintsRemaining: number;
  isNotesMode: boolean;
}): HistoryEntry => ({
  board: state.board,
  mistakes: state.mistakes,
  hintsRemaining: state.hintsRemaining,
  isNotesMode: state.isNotesMode,
});

export interface DifficultyStatsRecord {
  solved: number;
  played: number;
  bestSec: number | null;
  totalSec: number;
}

export type DailyDifficultyStats = Record<
  string,
  Record<string, DifficultyStatsRecord>
>;

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
  savedState?: {
    board: CellState[];
    timer: number;
    mistakes: number;
    hintsRemaining: number;
    history: HistoryEntry[];
  };
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
  history: HistoryEntry[];
  screen: "home" | "playing";
  difficulty: Difficulty;
  settings: GameSettings;

  // Real Persistent Stats
  difficultyStats: Record<string, DifficultyStatsRecord>;
  dailyDifficultyStats: DailyDifficultyStats;
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
  lastDailyPopupDate: string | null;
  setLastDailyPopupDate: (dateStr: string) => void;
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
  Fast: emptyGameStats(),
  Easy: emptyGameStats(),
  Medium: emptyGameStats(),
  Hard: emptyGameStats(),
  Expert: emptyGameStats(),
  Master: emptyGameStats(),
  Extreme: emptyGameStats(),
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
      dailyDifficultyStats: {},
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
      lastDailyPopupDate: null,

      setLastDailyPopupDate: (dateStr) => set({ lastDailyPopupDate: dateStr }),

      completeWelcome: () => set({ hasSeenWelcome: true }),
      resetWelcome: () =>
        set({ hasSeenWelcome: false, hasCompletedOnboarding: false }),
      completeOnboarding: (startingDifficulty) => {
        analyticsService.logOnboardingCompleted(startingDifficulty);
        set((state) => ({
          hasSeenWelcome: true,
          hasCompletedOnboarding: true,
          difficulty: startingDifficulty || state.difficulty || "Easy",
        }));
      },
      resetOnboarding: () => set({ hasCompletedOnboarding: false }),
      completeTutorial: () => {
        analyticsService.logTutorialCompleted();
        set({ hasCompletedTutorial: true });
      },
      skipTutorial: () => {
        analyticsService.logTutorialSkipped();
        set({ hasSkippedTutorial: true });
      },
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
          analyticsService.logTrialStarted("in_app", 3);
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
          const activityDate = state.currentDailyChallenge || todayStr;
          const safeTime = normalizeGameTime(timeSec);

          const prevStats = state.difficultyStats || initialDifficultyStats;
          const prevDiff = prevStats[difficulty] || emptyGameStats();
          const nextDiff = recordSolved(prevDiff, safeTime);
          const newOverallBest =
            safeTime > 0 && state.bestTimeSec !== null
              ? Math.min(state.bestTimeSec, safeTime)
              : safeTime > 0
                ? safeTime
                : state.bestTimeSec;
          const isToday = activityDate === todayStr;
          const newStreak = isToday
            ? state.lastSolvedDate === yesterdayStr
              ? (state.streak || 0) + 1
              : state.lastSolvedDate === todayStr
                ? state.streak || 0
                : 1
            : state.streak;
          const newTodaySolved = isToday
            ? state.lastSolvedDate === todayStr
              ? (state.todaySolved || 0) + 1
              : 1
            : state.todaySolved;

          const prevDaily = state.dailyHistory?.[activityDate] || {
            played: 0,
            solved: 0,
            bestSec: null,
          };
          const nextDaily = recordDailyGameSolved(prevDaily, safeTime);

          const prevDailyDifficultyStats = state.dailyDifficultyStats || {};
          const prevDateStats = prevDailyDifficultyStats[activityDate] || {};
          const prevDateDifficulty =
            prevDateStats[difficulty] || emptyGameStats();

          return {
            isGameCompleted: true,
            totalSolved: (state.totalSolved || 0) + 1,
            totalPlayed: Math.max(
              state.totalPlayed || 0,
              (state.totalSolved || 0) + 1,
            ),
            bestTimeSec: newOverallBest,
            todaySolved: newTodaySolved,
            lastSolvedDate: isToday ? todayStr : state.lastSolvedDate,
            streak: newStreak,
            difficultyStats: {
              ...prevStats,
              [difficulty]: {
                ...nextDiff,
              },
            },
            dailyDifficultyStats: {
              ...prevDailyDifficultyStats,
              [activityDate]: {
                ...prevDateStats,
                [difficulty]: recordSolved(prevDateDifficulty, safeTime),
              },
            },
            dailyHistory: {
              ...(state.dailyHistory || {}),
              [activityDate]: nextDaily,
            },
          };
        }),

      recordGamePlayed: (difficulty) =>
        set((state) => {
          const todayStr = getLocalDateString();
          const prevStats = state.difficultyStats || initialDifficultyStats;
          const prevDiff = prevStats[difficulty] || emptyGameStats();
          const prevDaily = state.dailyHistory?.[todayStr] || {
            played: 0,
            solved: 0,
            bestSec: null,
          };
          const prevDailyDifficultyStats = state.dailyDifficultyStats || {};
          const prevDateStats = prevDailyDifficultyStats[todayStr] || {};

          return {
            totalPlayed: (state.totalPlayed || 0) + 1,
            difficultyStats: {
              ...prevStats,
              [difficulty]: {
                ...recordPlayed(prevDiff),
              },
            },
            dailyDifficultyStats: {
              ...prevDailyDifficultyStats,
              [todayStr]: {
                ...prevDateStats,
                [difficulty]: recordPlayed(
                  prevDateStats[difficulty] || emptyGameStats(),
                ),
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

      setScreen: (screen) =>
        set((state) => {
          if (screen !== "home" || !state.currentDailyChallenge) {
            return { screen };
          }

          const activeDate = state.currentDailyChallenge;
          const currentProgress = getDailyChallengeItem(
            state.dailyChallengesProgress,
            activeDate,
          );
          if (currentProgress?.completed) return { screen };

          return {
            screen,
            dailyChallengesProgress: {
              ...(state.dailyChallengesProgress || {}),
              [activeDate]: {
                ...(currentProgress || { completed: false }),
                savedState: {
                  board: state.board,
                  timer: state.timer,
                  mistakes: state.mistakes,
                  hintsRemaining: state.hintsRemaining,
                  history: state.history,
                },
              },
            },
          };
        }),
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
          dailyDifficultyStats: {},
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
        set((state) => {
          if (!Number.isInteger(index) || index < 0 || index >= 81) return state;
          return state.selectedCell === index ? state : { selectedCell: index };
        }),

      toggleNotesMode: () =>
        set((state) => ({ isNotesMode: !state.isNotesMode })),

      placeNumber: (num) =>
        set((state) => {
          if (
            state.selectedCell === null ||
            state.mistakes >= 3 ||
            !Number.isInteger(num) ||
            num < 1 ||
            num > 9
          )
            return state;
          const selectedCell = state.selectedCell;
          const cell = state.board[selectedCell];
          if (!cell || cell.isLocked) return state;
          const autoCheckMistakes = state.settings?.autoCheckMistakes ?? true;
          if (
            state.isNotesMode &&
            cell.value !== null
          )
            return state;
          if (
            !state.isNotesMode &&
            cell.value !== null &&
            !cell.isError &&
            autoCheckMistakes
          )
            return state;

          const newBoard = [...state.board];

          if (state.isNotesMode) {
            const bit = 1 << num;
            newBoard[selectedCell] = {
              ...cell,
              notes: cell.notes ^ bit,
            };
            return {
              board: newBoard,
              history: [...state.history, createHistoryEntry(state)],
            };
          }

          const isCorrect = state.solution[selectedCell] === num;
          const isError = !isCorrect && autoCheckMistakes;

          // Auto-remove this number from notes in the same row, col, and block
          if (isCorrect) {
            const row = getRow(selectedCell);
            const col = getCol(selectedCell);
            const block = getBlock(selectedCell);

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

          newBoard[selectedCell] = {
            ...cell,
            value: num,
            isError,
            notes: 0, // Clear notes when a number is placed
          };

          return {
            board: newBoard,
            mistakes: isError ? state.mistakes + 1 : state.mistakes,
            history: [...state.history, createHistoryEntry(state)],
          };
        }),

      toggleNote: (num) =>
        set((state) => {
          if (
            state.selectedCell === null ||
            !Number.isInteger(num) ||
            num < 1 ||
            num > 9
          )
            return state;
          const cell = state.board[state.selectedCell];
          if (!cell || cell.isLocked || cell.value !== null) return state;

          const bit = 1 << num;
          const newBoard = [...state.board];
          newBoard[state.selectedCell] = {
            ...cell,
            notes: cell.notes ^ bit,
          };
          return { board: newBoard, history: [...state.history, createHistoryEntry(state)] };
        }),

      erase: () =>
        set((state) => {
          if (state.selectedCell === null) return state;
          const cell = state.board[state.selectedCell];
          if (!cell || cell.isLocked || (cell.value === null && cell.notes === 0)) return state;

          const newBoard = [...state.board];
          newBoard[state.selectedCell] = {
            ...cell,
            value: null,
            isError: false,
            notes: 0,
          };
          return { board: newBoard, history: [...state.history, createHistoryEntry(state)] };
        }),

      undo: () =>
        set((state) => {
          if (state.history.length === 0) return state;
          const newHistory = [...state.history];
          const previousEntry = newHistory.pop()!;

          // Older persisted versions stored only the board in history.
          if (Array.isArray(previousEntry)) {
            return { board: previousEntry as unknown as CellState[], history: newHistory };
          }

          return {
            board: previousEntry.board,
            mistakes: previousEntry.mistakes,
            hintsRemaining: previousEntry.hintsRemaining,
            isNotesMode: previousEntry.isNotesMode,
            history: newHistory,
          };
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
          const hintsRemainingAfter = state.isPremium
            ? state.hintsRemaining
            : Math.max(0, state.hintsRemaining - 1);
          analyticsService.logHintUsed({
            difficulty: state.difficulty,
            hintsRemaining: hintsRemainingAfter,
            isDaily: !!state.currentDailyChallenge,
          });

          return {
            board: newBoard,
            hintsRemaining: hintsRemainingAfter,
            history: [...state.history, createHistoryEntry(state)],
          };
        }),

      addHint: () =>
        set((state) => ({ hintsRemaining: state.hintsRemaining + 1 })),

      secondChance: () => {
        const state = get();
        if (state.mistakes < 3) return;
        analyticsService.logSecondChanceUsed({
          difficulty: state.difficulty,
          isDaily: !!state.currentDailyChallenge,
        });
        set({ mistakes: 2 });
      },

      startNewGame: async (difficulty) => {
        const { puzzle, solution } = generatePuzzle(difficulty);
        const newBoard = puzzle.map((val) => ({
          value: val === 0 ? null : val,
          notes: 0,
          isLocked: val !== 0,
          isError: false,
        }));

        analyticsService.logGameStarted({
          difficulty,
          isDaily: false,
        });

        set((state) => {
          // Save active daily challenge state before overwriting if one exists
          let newDailyProgress = state.dailyChallengesProgress;
          if (state.currentDailyChallenge) {
            const activeDate = state.currentDailyChallenge;
            const currentProgress = state.dailyChallengesProgress[activeDate] as DailyProgressItem | undefined;
            if (!currentProgress?.completed) {
              newDailyProgress = {
                ...state.dailyChallengesProgress,
                [activeDate]: {
                  ...(currentProgress || { completed: false }),
                  savedState: {
                    board: state.board,
                    timer: state.timer,
                    mistakes: state.mistakes,
                    hintsRemaining: state.hintsRemaining,
                    history: state.history,
                  }
                }
              };
            }
          }

          const todayStr = getLocalDateString();
          const prevStats = state.difficultyStats || initialDifficultyStats;
          const prevDiff = prevStats[difficulty] || emptyGameStats();
          const prevDaily = state.dailyHistory?.[todayStr] || {
            played: 0,
            solved: 0,
            bestSec: null,
          };
          const prevDailyDifficultyStats = state.dailyDifficultyStats || {};
          const prevDateStats = prevDailyDifficultyStats[todayStr] || {};

          return {
            dailyChallengesProgress: newDailyProgress,
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
                ...recordPlayed(prevDiff),
              },
            },
            dailyDifficultyStats: {
              ...prevDailyDifficultyStats,
              [todayStr]: {
                ...prevDateStats,
                [difficulty]: recordPlayed(
                  prevDateStats[difficulty] || emptyGameStats(),
                ),
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
        const activeState = get();
        if (
          activeState.currentDailyChallenge === dateStr &&
          activeState.screen === "playing"
        ) {
          return;
        }

        const difficulty = getDailyDifficulty(dateStr);
        analyticsService.logDailyChallengeStarted({
          date: dateStr,
          difficulty,
        });
        const { puzzle, solution } = generatePuzzle(
          difficulty,
          `daily-${dateStr}`,
        ); // deterministic seed

        set((state) => {
          // Save active daily challenge state before overwriting if one exists
          let newDailyProgress = state.dailyChallengesProgress;
          if (state.currentDailyChallenge && state.currentDailyChallenge !== dateStr) {
            const activeDate = state.currentDailyChallenge;
            const currentProgress = state.dailyChallengesProgress[activeDate] as DailyProgressItem | undefined;
            if (!currentProgress?.completed) {
              newDailyProgress = {
                ...state.dailyChallengesProgress,
                [activeDate]: {
                  ...(currentProgress || { completed: false }),
                  savedState: {
                    board: state.board,
                    timer: state.timer,
                    mistakes: state.mistakes,
                    hintsRemaining: state.hintsRemaining,
                    history: state.history,
                  }
                }
              };
            }
          }

          const progressItem = newDailyProgress[dateStr] as DailyProgressItem | undefined;
          
          if (progressItem?.savedState && !progressItem.completed) {
            // Resume from saved state
            return {
              dailyChallengesProgress: newDailyProgress,
              board: progressItem.savedState.board,
              solution,
              difficulty,
              selectedCell: null,
              mistakes: progressItem.savedState.mistakes,
              timer: progressItem.savedState.timer,
              history: progressItem.savedState.history,
              hintsRemaining: progressItem.savedState.hintsRemaining,
              screen: "playing",
              currentDailyChallenge: dateStr,
              isGameCompleted: false,
            };
          }

          // Generate new board
          const newBoard = puzzle.map((val) => ({
            value: val === 0 ? null : val,
            notes: 0,
            isLocked: val !== 0,
            isError: false,
          }));

          const prevStats = state.difficultyStats || initialDifficultyStats;
          const prevDiff = prevStats[difficulty] || emptyGameStats();
          const prevDaily = state.dailyHistory?.[dateStr] || {
            played: 0,
            solved: 0,
            bestSec: null,
          };
          const prevDailyDifficultyStats = state.dailyDifficultyStats || {};
          const prevDateStats = prevDailyDifficultyStats[dateStr] || {};

          return {
            dailyChallengesProgress: newDailyProgress,
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
                ...recordPlayed(prevDiff),
              },
            },
            dailyDifficultyStats: {
              ...prevDailyDifficultyStats,
              [dateStr]: {
                ...prevDateStats,
                [difficulty]: recordPlayed(
                  prevDateStats[difficulty] || emptyGameStats(),
                ),
              },
            },
            dailyHistory: {
              ...state.dailyHistory,
              [dateStr]: {
                ...prevDaily,
                played: prevDaily.played + 1,
              },
            },
          };
        });
      },

      completeDailyChallenge: (dateStr, timeSec = 0, mistakes = 0) => {
        const safeTime = normalizeGameTime(timeSec);
        analyticsService.logDailyChallengeCompleted({
          date: dateStr,
          timeTaken: safeTime,
          mistakes,
        });
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
          const bestTime =
            safeTime > 0
              ? currentItem?.timeSec && currentItem.timeSec > 0
                ? Math.min(currentItem.timeSec, safeTime)
                : safeTime
              : currentItem?.timeSec;

          let newStreak = state.streak || 0;
          if (dateStr === todayStr) {
            if (state.lastSolvedDate === yesterdayStr) {
              newStreak += 1;
            } else if (state.lastSolvedDate !== todayStr) {
              newStreak = 1;
            }
          }

          const prevDaily = state.dailyHistory?.[dateStr] || {
            played: 0,
            solved: 0,
            bestSec: null,
          };
          const nextDaily = markDailyChallengeSolved(prevDaily, safeTime);

          return {
            lastSolvedDate:
              dateStr === todayStr ? todayStr : state.lastSolvedDate,
            streak: dateStr === todayStr ? newStreak : state.streak,
            dailyChallengesProgress: {
              ...state.dailyChallengesProgress,
              [dateStr]: {
                ...(currentItem || {}),
                completed: true,
                timeSec: bestTime,
                mistakes,
                completedAt: new Date().toISOString(),
                difficulty: diff,
              },
            },
            dailyHistory: {
              ...(state.dailyHistory || {}),
              // recordGameWon owns the game-wide win count. Keep this action
              // idempotent so a daily win is not counted twice.
              [dateStr]: nextDaily,
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
