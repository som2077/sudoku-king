import { NextRequest, NextResponse } from "next/server";
import {
  generateDailyCompetitors,
  LeaderboardEntry,
} from "@/lib/leaderboardService";

// In-memory submissions store
const globalSubmissions: Record<string, LeaderboardEntry[]> = {};

// Keep at most 14 days of history to prevent unbounded memory growth
const pruneOldSubmissions = () => {
  const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  for (const dateKey of Object.keys(globalSubmissions)) {
    if (dateKey < cutoff) {
      delete globalSubmissions[dateKey];
    }
  }
};

export async function GET(req: NextRequest) {
  pruneOldSubmissions();
  const { searchParams } = new URL(req.url);
  const today = new Date().toISOString().split("T")[0];
  const dateStr = searchParams.get("date") || today;

  const seeded = generateDailyCompetitors(dateStr);
  const live = globalSubmissions[dateStr] || [];

  const combined = [...seeded, ...live].sort(
    (a, b) => b.score - a.score || a.timeSeconds - b.timeSeconds
  );

  const ranked = combined.map((entry, idx) => ({
    ...entry,
    rank: idx + 1,
  }));

  return NextResponse.json(
    {
      date: dateStr,
      entries: ranked,
      totalSolvers: ranked.length + 1340,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=10, stale-while-revalidate=30",
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      puzzleDate,
      username,
      countryCode,
      countryName,
      avatarSeed,
      timeSeconds,
      score,
      mistakes,
      hintsUsed,
    } = body;

    pruneOldSubmissions();

    if (!puzzleDate || !username || typeof timeSeconds !== "number") {
      return NextResponse.json({ error: "Invalid submission data" }, { status: 400 });
    }

    if (!globalSubmissions[puzzleDate]) {
      globalSubmissions[puzzleDate] = [];
    }

    // Remove previous submission from same user for this date
    globalSubmissions[puzzleDate] = globalSubmissions[puzzleDate].filter(
      (e) => e.username !== username
    );

    const newEntry: LeaderboardEntry = {
      id: `live-${Date.now()}-${Math.random()}`,
      puzzleDate,
      username,
      countryCode: countryCode || "US",
      countryName: countryName || "United States",
      avatarSeed: avatarSeed || username,
      timeSeconds,
      score: score || Math.max(1000, 10000 - timeSeconds * 10),
      mistakes: mistakes || 0,
      hintsUsed: hintsUsed || 0,
      submittedAt: new Date().toISOString(),
    };

    globalSubmissions[puzzleDate].push(newEntry);
    if (globalSubmissions[puzzleDate].length > 500) {
      globalSubmissions[puzzleDate] = globalSubmissions[puzzleDate].slice(-500);
    }

    const seeded = generateDailyCompetitors(puzzleDate);
    const all = [...seeded, ...globalSubmissions[puzzleDate]].sort(
      (a, b) => b.score - a.score || a.timeSeconds - b.timeSeconds
    );

    const rank = all.findIndex((e) => e.username === username) + 1;

    return NextResponse.json({
      success: true,
      rank: rank > 0 ? rank : 1,
      totalParticipants: all.length + 1340,
    });
  } catch {
    return NextResponse.json({ error: "Failed to process score" }, { status: 500 });
  }
}
