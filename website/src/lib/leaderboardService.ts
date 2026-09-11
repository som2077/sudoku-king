export interface LeaderboardEntry {
  id: string;
  puzzleDate: string; // "YYYY-MM-DD"
  username: string;
  countryCode: string;
  countryName: string;
  avatarSeed: string;
  timeSeconds: number; // e.g. 184 (03:04)
  score: number;
  mistakes: number;
  hintsUsed: number;
  submittedAt: string;
  rank?: number;
}

export interface PlayerProfile {
  username: string;
  countryCode: string;
  countryName: string;
  avatarSeed: string;
}

export interface LiveActivityEvent {
  id: string;
  username: string;
  countryCode: string;
  action: "daily_solve" | "streak_milestone" | "difficulty_clear";
  difficulty?: string;
  timeFormatted: string;
  streakDays?: number;
  timestamp: string;
}

const PROFILE_KEY = "sudoku_king_player_profile_v1";
const LOCAL_LEADERBOARD_KEY = "sudoku_king_local_leaderboard_v1";

export const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
];

export const getCountryFlag = (code: string): string => {
  const found = COUNTRIES.find((c) => c.code === code);
  return found ? found.flag : "🌐";
};

let cachedProfile: PlayerProfile | null = null;
const profileListeners = new Set<() => void>();

export const subscribePlayerProfile = (listener: () => void) => {
  profileListeners.add(listener);
  return () => {
    profileListeners.delete(listener);
  };
};

export const getPlayerProfile = (): PlayerProfile => {
  if (cachedProfile) return cachedProfile;

  if (typeof window === "undefined") {
    return {
      username: "SudokuPlayer",
      countryCode: "US",
      countryName: "United States",
      avatarSeed: "player",
    };
  }

  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      cachedProfile = JSON.parse(raw);
      return cachedProfile!;
    }
  } catch (err) {
    console.warn("Could not read player profile from localStorage:", err);
  }

  // Generate a random fun username for new players
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const randomCountry = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  const defaultProfile: PlayerProfile = {
    username: `Solver_${randomNum}`,
    countryCode: randomCountry.code,
    countryName: randomCountry.name,
    avatarSeed: String(randomNum),
  };

  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(defaultProfile));
  } catch (err) {
    console.warn("Could not write default profile to localStorage:", err);
  }

  cachedProfile = defaultProfile;
  return cachedProfile;
};

export const savePlayerProfile = (profile: PlayerProfile): void => {
  cachedProfile = profile;
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.warn("Could not save player profile to localStorage:", err);
  }
  profileListeners.forEach((fn) => fn());
};

// Removed seeded generator to ensure only real users are shown on the leaderboard
export const generateDailyCompetitors = (dateStr: string): LeaderboardEntry[] => {
  return [];
};

// In-memory client cache with TTL to make date tab switches instantaneous
interface CachedLeaderboardResult {
  date: string;
  entries: LeaderboardEntry[];
  userEntry: LeaderboardEntry | null;
  totalSolvers: number;
}

const leaderboardMemoryCache = new Map<
  string,
  { data: CachedLeaderboardResult; timestamp: number }
>();
const LEADERBOARD_CACHE_TTL_MS = 25000; // 25 seconds TTL

export const invalidateLeaderboardCache = (dateStr?: string): void => {
  if (dateStr) {
    leaderboardMemoryCache.delete(dateStr);
  } else {
    leaderboardMemoryCache.clear();
  }
};

export const getLeaderboardData = async (
  dateStr: string
): Promise<CachedLeaderboardResult> => {
  const cached = leaderboardMemoryCache.get(dateStr);
  if (cached && Date.now() - cached.timestamp < LEADERBOARD_CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const res = await fetch(`/api/leaderboard?date=${dateStr}`, { cache: "no-store" });
    if (res.ok) {
      const data: CachedLeaderboardResult = await res.json();
      leaderboardMemoryCache.set(dateStr, { data, timestamp: Date.now() });
      return data;
    }
  } catch (err) {
    console.warn("Failed to fetch leaderboard data, using local fallback:", err);
  }

  // Fallback to local storage / generator
  const seeded = generateDailyCompetitors(dateStr);
  let localSubmissions: LeaderboardEntry[] = [];
  try {
    const raw = localStorage.getItem(LOCAL_LEADERBOARD_KEY);
    if (raw) localSubmissions = JSON.parse(raw);
  } catch (err) {
    console.warn("Failed to read local leaderboard cache:", err);
  }

  const dateSubmissions = localSubmissions.filter((e) => e.puzzleDate === dateStr);
  const combined = [...seeded, ...dateSubmissions].sort(
    (a, b) => b.score - a.score || a.timeSeconds - b.timeSeconds
  );

  const ranked = combined.map((entry, idx) => ({
    ...entry,
    rank: idx + 1,
  }));

  const profile = getPlayerProfile();
  const userEntry = ranked.find((e) => e.username === profile.username) || null;
  const fallbackResult: CachedLeaderboardResult = {
    date: dateStr,
    entries: ranked,
    userEntry,
    totalSolvers: ranked.length + 1340,
  };
  leaderboardMemoryCache.set(dateStr, { data: fallbackResult, timestamp: Date.now() });

  return fallbackResult;
};

export const submitLeaderboardScore = async (
  entry: Omit<LeaderboardEntry, "id" | "submittedAt" | "rank">
): Promise<{ rank: number; totalParticipants: number }> => {
  // Invalidate cache for this date so new rank appears immediately
  invalidateLeaderboardCache(entry.puzzleDate);

  const fullEntry: LeaderboardEntry = {
    ...entry,
    id: `sub-${Date.now()}`,
    submittedAt: new Date().toISOString(),
  };

  try {
    const res = await fetch("/api/leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullEntry),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Failed to post score to leaderboard API, saving locally:", err);
  }

  // Fallback to local storage
  let localSubmissions: LeaderboardEntry[] = [];
  try {
    const raw = localStorage.getItem(LOCAL_LEADERBOARD_KEY);
    if (raw) localSubmissions = JSON.parse(raw);
  } catch (err) {
    console.warn("Failed to read local leaderboard before saving:", err);
  }

  localSubmissions = localSubmissions.filter(
    (e) => !(e.puzzleDate === entry.puzzleDate && e.username === entry.username)
  );
  localSubmissions.push(fullEntry);

  try {
    localStorage.setItem(LOCAL_LEADERBOARD_KEY, JSON.stringify(localSubmissions));
  } catch (err) {
    console.warn("Failed to save score in local storage:", err);
  }

  const seeded = generateDailyCompetitors(entry.puzzleDate);
  const all = [...seeded, ...localSubmissions.filter((e) => e.puzzleDate === entry.puzzleDate)].sort(
    (a, b) => b.score - a.score || a.timeSeconds - b.timeSeconds
  );

  const rank = all.findIndex((e) => e.username === entry.username) + 1;
  return { rank: rank > 0 ? rank : 1, totalParticipants: all.length + 1340 };
};
