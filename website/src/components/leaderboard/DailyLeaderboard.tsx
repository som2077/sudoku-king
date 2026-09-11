"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  getLeaderboardData,
  LeaderboardEntry,
  getPlayerProfile,
  subscribePlayerProfile,
  PlayerProfile,
  getCountryFlag,
} from "@/lib/leaderboardService";
import { PlayerProfileModal } from "./PlayerProfileModal";
import { LeaderboardCard, PodiumRanking, ListRanking } from "@/components/ui/leaderboard-card";
import { LivePresenceBadge } from "@/components/live/LivePresenceBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, User, Sparkles } from "lucide-react";
import { useSudokuStore } from "@/store/useSudokuStore";

const DEFAULT_PROFILE: PlayerProfile = {
  username: "SudokuPlayer",
  countryCode: "US",
  countryName: "United States",
  avatarSeed: "player",
};

export function DailyLeaderboard() {
  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [totalSolvers, setTotalSolvers] = useState<number>(1340);
  const userProfile = useSyncExternalStore(
    subscribePlayerProfile,
    getPlayerProfile,
    () => DEFAULT_PROFILE
  );
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const { startNewGame } = useSudokuStore();

  useEffect(() => {
    let active = true;
    getLeaderboardData(selectedDate)
      .then((data) => {
        if (active) {
          setEntries(data.entries);
          setTotalSolvers(data.totalSolvers);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          console.error("Failed to load leaderboard data:", err);
          setIsLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [selectedDate, refreshCount]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setIsLoading(true);
  };


  const currentUserEntry = entries.find((e) => e.username === userProfile.username);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const getYesterdayDate = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  };

  // Prepare mappings for LeaderboardCard API
  const podiumRankings: PodiumRanking[] = entries.slice(0, 3).map((entry) => ({
    userId: entry.id,
    userName: entry.username,
    rank: entry.rank || 1,
    value: entry.score,
    flag: getCountryFlag(entry.countryCode),
    timeStr: formatSeconds(entry.timeSeconds),
  }));

  const listRankings: ListRanking[] = entries.map((entry) => ({
    userId: entry.id,
    rank: entry.rank || 1,
    userName: entry.username,
    value: entry.score,
    displayed: true,
    flag: getCountryFlag(entry.countryCode),
    timeStr: formatSeconds(entry.timeSeconds),
  }));

  return (
    <section id="leaderboard" className="w-full bg-[#fafafa] py-16 sm:py-24 border-t border-black/[0.04]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Header Bar */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200/50 shadow-xs font-mono font-bold px-2 py-0.5">
                🏆 GLOBAL CONSENSUS
              </Badge>
              <LivePresenceBadge />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-[-0.03em]">
              Daily Challenge Leaderboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-normal tracking-tight">
              Ranked by completion speed and fewest mistakes for deterministic synchronized puzzles.
            </p>
          </div>

          {/* Date & Profile Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsProfileOpen(true)}
              suppressHydrationWarning
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-black/[0.08] bg-white hover:bg-slate-50 text-xs font-mono font-bold text-slate-900 shadow-2xs transition-colors cursor-pointer apple-press-subtle"
              title="Customize your name and country flag"
            >
              <span>{getCountryFlag(userProfile.countryCode)}</span>
              <span className="truncate max-w-[100px]">{userProfile.username}</span>
              <User className="h-3.5 w-3.5 text-slate-400 ml-0.5" />
            </button>

            {/* Apple Segmented Date Control */}
            <div className="flex items-center rounded-full border border-black/[0.06] bg-slate-100/90 p-1 text-xs font-semibold">
              <button
                onClick={() => handleDateChange(todayStr)}
                className={`px-3.5 py-1 rounded-full transition-all cursor-pointer apple-press-subtle ${
                  selectedDate === todayStr
                    ? "bg-white text-slate-950 shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => handleDateChange(getYesterdayDate())}
                className={`px-3.5 py-1 rounded-full transition-all cursor-pointer apple-press-subtle ${
                  selectedDate === getYesterdayDate()
                    ? "bg-white text-slate-950 shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-950"
                }`}
              >
                Yesterday
              </button>
            </div>
          </div>
        </div>

        {/* Podium for Top 3 */}
        {isLoading ? (
          <div className="h-44 flex items-center justify-center text-xs font-mono text-slate-500">
            Fetching verified leaderboard...
          </div>
        ) : (
          <>
            <LeaderboardCard
              title="Live Rankings"
              currentUserId={currentUserEntry?.id}
              podiumRankings={podiumRankings}
              rankings={listRankings}
              className="mt-6 border border-black/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl bg-slate-50/50 p-4 sm:p-6"
            />

              {/* Sticky "Your Standing" Bottom Bar */}
              <div className="p-4 bg-slate-50/90 border-t border-black/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                {currentUserEntry ? (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 font-mono">Your Standing:</span>
                    <span className="font-mono font-extrabold text-blue-700 text-sm">
                      Rank #{currentUserEntry.rank} of {totalSolvers.toLocaleString()}
                    </span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {formatSeconds(currentUserEntry.timeSeconds)}
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 font-normal">
                    You haven&apos;t solved today&apos;s challenge yet! Solve it to rank globally.
                  </div>
                )}

                <Button
                  size="sm"
                  onClick={() => {
                    startNewGame("Medium", selectedDate);
                    const gameEl = document.getElementById("game");
                    gameEl?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-slate-950 hover:bg-slate-900 text-white font-semibold text-xs rounded-full px-4 h-9 shadow-xs gap-1.5 apple-press cursor-pointer border border-white/10"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  <span>Play Today&apos;s Challenge</span>
                </Button>
              </div>
            
          </>
        )}
      </div>

      <PlayerProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onProfileUpdated={() => {
          setIsLoading(true);
          setRefreshCount((prev) => prev + 1);
        }}
      />
    </section>
  );
}
