import { LiveActivityEvent, COUNTRIES } from "./leaderboardService";

export interface PresenceData {
  onlineCount: number;
  activeSolversCount: number;
  recentActivity: LiveActivityEvent[];
}

const FIRST_NAMES = [
  "Liam", "Emma", "Noah", "Olivia", "Aarav", "Priya", "Lucas", "Mia", "Kenji", "Yuki",
  "Mateo", "Sofia", "Felix", "Chloe", "Alexander", "Hannah", "David", "Elena", "Jin", "Ananya"
];

const DIFFICULTIES = ["Easy", "Medium", "Hard", "Expert", "Master"];

export const generateSimulatedActivity = (): LiveActivityEvent => {
  const name = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  const diff = DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)];
  const actions: ("daily_solve" | "streak_milestone" | "difficulty_clear")[] = [
    "daily_solve",
    "streak_milestone",
    "difficulty_clear",
  ];
  const action = actions[Math.floor(Math.random() * actions.length)];

  const mins = Math.floor(2 + Math.random() * 8);
  const secs = Math.floor(Math.random() * 60);
  const timeFormatted = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  const streakDays = Math.floor(3 + Math.random() * 45);

  return {
    id: `event-${Date.now()}-${Math.random()}`,
    username: name,
    countryCode: country.code,
    action,
    difficulty: diff,
    timeFormatted,
    streakDays,
    timestamp: new Date().toISOString(),
  };
};

export const getPresenceData = async (): Promise<PresenceData> => {
  try {
    const res = await fetch("/api/presence", { cache: "no-store" });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Failed to fetch presence data, falling back to local simulation:", err);
  }

  // Fallback realistic base count + minor random fluctuation
  const baseCount = 1380 + Math.floor(Math.sin(Date.now() / 60000) * 80);
  return {
    onlineCount: baseCount,
    activeSolversCount: Math.floor(baseCount * 0.72),
    recentActivity: [
      generateSimulatedActivity(),
      generateSimulatedActivity(),
      generateSimulatedActivity(),
    ],
  };
};

export const sendPresenceHeartbeat = async (): Promise<void> => {
  try {
    await fetch("/api/presence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timestamp: Date.now() }),
    });
  } catch (err) {
    console.warn("Failed to send presence heartbeat:", err);
  }
};
