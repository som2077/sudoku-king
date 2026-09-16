export interface GameStatsRecord {
  solved: number;
  played: number;
  bestSec: number | null;
  totalSec: number;
}

export interface DailyStatsRecord {
  played: number;
  solved: number;
  bestSec: number | null;
}

const nonNegativeInt = (value: unknown, fallback = 0): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.floor(value));
};

export const emptyGameStats = (): GameStatsRecord => ({
  solved: 0,
  played: 0,
  bestSec: null,
  totalSec: 0,
});

export const normalizeGameTime = (seconds: unknown): number =>
  nonNegativeInt(seconds);

export const normalizeGameStats = (
  record?: Partial<GameStatsRecord> | null,
): GameStatsRecord => {
  const solved = nonNegativeInt(record?.solved);
  const played = Math.max(nonNegativeInt(record?.played), solved);
  const bestSec =
    typeof record?.bestSec === "number" &&
    Number.isFinite(record.bestSec) &&
    record.bestSec > 0
      ? Math.floor(record.bestSec)
      : null;

  return {
    solved,
    played,
    bestSec,
    totalSec: nonNegativeInt(record?.totalSec),
  };
};

export const recordPlayed = (
  record?: Partial<GameStatsRecord> | null,
): GameStatsRecord => {
  const current = normalizeGameStats(record);
  return { ...current, played: current.played + 1 };
};

export const recordSolved = (
  record: Partial<GameStatsRecord> | null | undefined,
  timeSec: unknown,
): GameStatsRecord => {
  const current = normalizeGameStats(record);
  const safeTime = normalizeGameTime(timeSec);
  const solved = current.solved + 1;

  return {
    solved,
    played: Math.max(current.played, solved),
    bestSec:
      safeTime > 0
        ? current.bestSec === null
          ? safeTime
          : Math.min(current.bestSec, safeTime)
        : current.bestSec,
    totalSec: current.totalSec + safeTime,
  };
};

const updateDailyBest = (
  bestSec: number | null,
  timeSec: number,
): number | null =>
  timeSec > 0
    ? bestSec === null
      ? timeSec
      : Math.min(bestSec, timeSec)
    : bestSec;

export const recordDailyGameSolved = (
  record: Partial<DailyStatsRecord> | null | undefined,
  timeSec: unknown,
): DailyStatsRecord => {
  const safeTime = normalizeGameTime(timeSec);
  const played = nonNegativeInt(record?.played);
  const solved = nonNegativeInt(record?.solved) + 1;
  const bestSec =
    typeof record?.bestSec === "number" &&
    Number.isFinite(record.bestSec) &&
    record.bestSec > 0
      ? Math.floor(record.bestSec)
      : null;

  return {
    played: Math.max(played, solved),
    solved,
    bestSec: updateDailyBest(bestSec, safeTime),
  };
};

export const markDailyChallengeSolved = (
  record: Partial<DailyStatsRecord> | null | undefined,
  timeSec: unknown,
): DailyStatsRecord => {
  const currentSolved = nonNegativeInt(record?.solved);
  const currentPlayed = nonNegativeInt(record?.played);
  const safeTime = normalizeGameTime(timeSec);
  const currentBest =
    typeof record?.bestSec === "number" &&
    Number.isFinite(record.bestSec) &&
    record.bestSec > 0
      ? Math.floor(record.bestSec)
      : null;

  return {
    played: Math.max(currentPlayed, 1),
    solved: Math.max(currentSolved, 1),
    bestSec: updateDailyBest(currentBest, safeTime),
  };
};

export const calculateWinRate = (solved: number, played: number): number => {
  const safePlayed = nonNegativeInt(played);
  if (safePlayed === 0) return 0;
  return Math.min(100, Math.round((nonNegativeInt(solved) / safePlayed) * 100));
};

export const calculateAverageTime = (
  totalSec: number,
  solved: number,
): number => {
  const safeSolved = nonNegativeInt(solved);
  if (safeSolved === 0) return 0;
  return Math.round(nonNegativeInt(totalSec) / safeSolved);
};
