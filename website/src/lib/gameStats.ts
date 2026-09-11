import { Difficulty } from "./sudokuEngine";
import { trackEvent } from "./analytics";

export interface DifficultyStats {
  gamesStarted: number;
  gamesWon: number;
  bestTime: number | null; // in seconds
  totalTime: number; // in seconds
  currentStreak: number;
  bestStreak: number;
}

export interface PlayerStats {
  byDifficulty: Record<Difficulty, DifficultyStats>;
  dailyCompleted: string[]; // dates array "YYYY-MM-DD"
}

const DEFAULT_DIFF_STATS: DifficultyStats = {
  gamesStarted: 0,
  gamesWon: 0,
  bestTime: null,
  totalTime: 0,
  currentStreak: 0,
  bestStreak: 0,
};

const DEFAULT_STATS: PlayerStats = {
  byDifficulty: {
    Fast: { ...DEFAULT_DIFF_STATS },
    Easy: { ...DEFAULT_DIFF_STATS },
    Medium: { ...DEFAULT_DIFF_STATS },
    Hard: { ...DEFAULT_DIFF_STATS },
    Expert: { ...DEFAULT_DIFF_STATS },
    Master: { ...DEFAULT_DIFF_STATS },
    Extreme: { ...DEFAULT_DIFF_STATS },
  },
  dailyCompleted: [],
};

const STATS_KEY = "sudoku_king_player_stats_v1";

export const loadStats = (): PlayerStats => {
  if (typeof window === "undefined") return DEFAULT_STATS;
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATS,
      ...parsed,
      byDifficulty: {
        ...DEFAULT_STATS.byDifficulty,
        ...(parsed.byDifficulty || {}),
      },
    };
  } catch {
    return DEFAULT_STATS;
  }
};

export const saveStats = (stats: PlayerStats): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {}
};

export const recordGameStarted = (difficulty: Difficulty): PlayerStats => {
  const stats = loadStats();
  const diff = stats.byDifficulty[difficulty] || { ...DEFAULT_DIFF_STATS };
  diff.gamesStarted += 1;
  stats.byDifficulty[difficulty] = diff;
  saveStats(stats);
  trackEvent("game_started", { difficulty });
  return stats;
};

export const recordGameWon = (
  difficulty: Difficulty,
  timeSeconds: number,
  isDailyDate?: string
): PlayerStats => {
  const stats = loadStats();
  const diff = stats.byDifficulty[difficulty] || { ...DEFAULT_DIFF_STATS };
  diff.gamesWon += 1;
  diff.totalTime += timeSeconds;
  diff.currentStreak += 1;
  if (diff.currentStreak > diff.bestStreak) {
    diff.bestStreak = diff.currentStreak;
  }
  if (diff.bestTime === null || timeSeconds < diff.bestTime) {
    diff.bestTime = timeSeconds;
  }
  stats.byDifficulty[difficulty] = diff;

  if (isDailyDate && !stats.dailyCompleted.includes(isDailyDate)) {
    stats.dailyCompleted.push(isDailyDate);
  }

  saveStats(stats);
  trackEvent("game_won", {
    difficulty,
    timeSeconds: Math.round(timeSeconds),
    isDaily: Boolean(isDailyDate),
  });
  return stats;
};

export const recordGameLost = (difficulty: Difficulty): PlayerStats => {
  const stats = loadStats();
  const diff = stats.byDifficulty[difficulty] || { ...DEFAULT_DIFF_STATS };
  diff.currentStreak = 0;
  stats.byDifficulty[difficulty] = diff;
  saveStats(stats);
  trackEvent("game_lost", { difficulty });
  return stats;
};

// Helper functions for Daily Streak calculation
export const getRolling7DaysData = (dailyCompleted: string[]) => {
  const datesSet = new Set(dailyCompleted);
  const streakDays: boolean[] = [];
  const dayLabels: string[] = [];
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
  
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    
    streakDays.push(datesSet.has(dateStr));
    dayLabels.push(dayNames[d.getDay()]);
  }
  
  return { streakDays, dayLabels };
};

export const calculateDailyStreak = (dailyCompleted: string[]) => {
  const sortedDates = [...new Set(dailyCompleted)].sort((a, b) => b.localeCompare(a)); // desc
  if (sortedDates.length === 0) return 0;
  
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];
  
  if (sortedDates[0] !== todayStr && sortedDates[0] !== yesterdayStr) {
    return 0; // Streak broken
  }
  
  let currentStreak = 1;
  let currentDate = new Date(sortedDates[0]);
  
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    const prevDateStr = prevDate.toISOString().split("T")[0];
    
    if (sortedDates[i] === prevDateStr) {
      currentStreak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }
  
  return currentStreak;
};

export const calculateBestDailyStreak = (dailyCompleted: string[]) => {
  const sortedDates = [...new Set(dailyCompleted)].sort((a, b) => a.localeCompare(b)); // asc
  if (sortedDates.length === 0) return 0;
  
  let best = 1;
  let current = 1;
  let currentDate = new Date(sortedDates[0]);
  
  for (let i = 1; i < sortedDates.length; i++) {
    const expectedNext = new Date(currentDate);
    expectedNext.setDate(expectedNext.getDate() + 1);
    const expectedNextStr = expectedNext.toISOString().split("T")[0];
    
    if (sortedDates[i] === expectedNextStr) {
      current++;
      currentDate = expectedNext;
    } else {
      best = Math.max(best, current);
      current = 1;
      currentDate = new Date(sortedDates[i]);
    }
  }
  
  return Math.max(best, current);
};
