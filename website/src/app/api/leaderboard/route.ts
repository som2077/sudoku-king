import { NextRequest, NextResponse } from "next/server";
import { LeaderboardEntry } from "@/lib/leaderboardService";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const hasSupabase = supabaseUrl && supabaseKey;
const supabase = hasSupabase ? createClient(supabaseUrl, supabaseKey) : null;

// Local fallback (only for local dev without .env)
const localSubmissions: Record<string, LeaderboardEntry[]> = {};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const today = new Date().toISOString().split("T")[0];
  const dateStr = searchParams.get("date") || today;

  let ranked: LeaderboardEntry[] = [];
  let totalSolvers = 0;

  if (supabase) {
    try {
      const { data, error, count } = await supabase
        .from('daily_leaderboard')
        .select('*', { count: 'exact' })
        .eq('puzzle_date', dateStr)
        .order('score', { ascending: false })
        .order('time_seconds', { ascending: true })
        .limit(500);

      if (error) throw error;
      
      totalSolvers = count || 0;
      
      ranked = (data || []).map((row, idx) => ({
        id: row.id,
        puzzleDate: row.puzzle_date,
        username: row.username,
        countryCode: row.country_code,
        countryName: row.country_name,
        avatarSeed: row.avatar_seed,
        timeSeconds: row.time_seconds,
        score: row.score,
        mistakes: row.mistakes,
        hintsUsed: row.hints_used,
        submittedAt: row.submitted_at,
        rank: idx + 1,
      }));
    } catch (err) {
      console.error("Supabase fetch failed:", err);
      // Fallback
      const live = localSubmissions[dateStr] || [];
      ranked = [...live].sort((a, b) => b.score - a.score || a.timeSeconds - b.timeSeconds).map((entry, idx) => ({ ...entry, rank: idx + 1 }));
      totalSolvers = ranked.length;
    }
  } else {
    // Local fallback
    const live = localSubmissions[dateStr] || [];
    ranked = [...live].sort((a, b) => b.score - a.score || a.timeSeconds - b.timeSeconds).map((entry, idx) => ({ ...entry, rank: idx + 1 }));
    totalSolvers = ranked.length;
  }

  return NextResponse.json(
    {
      date: dateStr,
      entries: ranked,
      totalSolvers,
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

    if (!puzzleDate || !username || typeof timeSeconds !== "number") {
      return NextResponse.json({ error: "Invalid submission data" }, { status: 400 });
    }

    const calculatedScore = score || Math.max(1000, 10000 - timeSeconds * 10);
    const newEntry: LeaderboardEntry = {
      id: `live-${Date.now()}-${Math.random()}`,
      puzzleDate,
      username,
      countryCode: countryCode || "US",
      countryName: countryName || "United States",
      avatarSeed: avatarSeed || username,
      timeSeconds,
      score: calculatedScore,
      mistakes: mistakes || 0,
      hintsUsed: hintsUsed || 0,
      submittedAt: new Date().toISOString(),
    };

    let rank = 1;
    let totalParticipants = 1;

    if (supabase) {
      // Upsert the score (Supabase table must have UNIQUE constraint on puzzle_date + username)
      const { error: upsertError } = await supabase
        .from('daily_leaderboard')
        .upsert({
          puzzle_date: puzzleDate,
          username,
          country_code: countryCode || "US",
          country_name: countryName || "United States",
          avatar_seed: avatarSeed || username,
          time_seconds: timeSeconds,
          score: calculatedScore,
          mistakes: mistakes || 0,
          hints_used: hintsUsed || 0,
          submitted_at: newEntry.submittedAt
        }, {
          onConflict: 'puzzle_date, username'
        });

      if (upsertError) throw upsertError;

      // Calculate Rank: Count how many people have a strictly higher score, or same score but better time
      const { count: rankCount, error: rankError } = await supabase
        .from('daily_leaderboard')
        .select('*', { count: 'exact', head: true })
        .eq('puzzle_date', puzzleDate)
        .or(`score.gt.${calculatedScore},and(score.eq.${calculatedScore},time_seconds.lt.${timeSeconds})`);
        
      if (rankError) throw rankError;
      rank = (rankCount || 0) + 1;

      // Get Total Participants
      const { count: totalCount, error: totalError } = await supabase
        .from('daily_leaderboard')
        .select('*', { count: 'exact', head: true })
        .eq('puzzle_date', puzzleDate);

      if (totalError) throw totalError;
      totalParticipants = totalCount || 1;

    } else {
      // Local fallback
      if (!localSubmissions[puzzleDate]) {
        localSubmissions[puzzleDate] = [];
      }
      
      localSubmissions[puzzleDate] = localSubmissions[puzzleDate].filter(
        (e) => e.username !== username
      );
      localSubmissions[puzzleDate].push(newEntry);
      
      const all = [...localSubmissions[puzzleDate]].sort(
        (a, b) => b.score - a.score || a.timeSeconds - b.timeSeconds
      );
      rank = all.findIndex((e) => e.username === username) + 1;
      totalParticipants = all.length;
    }

    return NextResponse.json({
      success: true,
      rank: rank > 0 ? rank : 1,
      totalParticipants,
    });
  } catch (err) {
    console.error("Score submission error:", err);
    return NextResponse.json({ error: "Failed to process score" }, { status: 500 });
  }
}
