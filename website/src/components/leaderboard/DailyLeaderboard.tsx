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
import { LeaderboardPodium } from "./LeaderboardPodium";
import { PlayerProfileModal } from "./PlayerProfileModal";
import {
  LeaderboardCard,
  LeaderboardCardHeader,
  LeaderboardCardContent,
  LeaderboardItem,
  LeaderboardItemRank,
  LeaderboardItemUser,
  LeaderboardItemScore,
} from "@/components/ui/leaderboard-card";
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

  const topThree = entries.slice(0, 3);

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

  return (
    <section id="leaderboard" className="py-12 sm:py-16 border-t border-slate-200 bg-white scroll-mt-16">
      <div className="container mx-auto max-w-5xl px-3 sm:px-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 gap-1 text-xs font-mono font-bold rounded-full">
                <Trophy className="h-3.5 w-3.5 text-blue-600 fill-blue-600" />
                GLOBAL CONSENSUS
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
            <LeaderboardPodium topThree={topThree} />

            <LeaderboardCard className="mt-6 border-black/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.03)] overflow-hidden">
              <LeaderboardCardHeader className="py-4 bg-slate-50/80 border-black/[0.04]">
                <div className="grid grid-cols-12 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  <span className="col-span-2 sm:col-span-1">Rank</span>
                  <span className="col-span-5 sm:col-span-6 px-4">Solver</span>
                  <span className="col-span-3 sm:col-span-3 text-right">Time</span>
                  <span className="col-span-2 sm:col-span-2 text-right">Score</span>
                </div>
              </LeaderboardCardHeader>

              <LeaderboardCardContent className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
                {entries.map((entry) => {
                  const isCurrentUser = entry.username === userProfile.username;
                  const rank = entry.rank || 1;

                  return (
                    <LeaderboardItem
                      key={entry.id}
                      isCurrentUser={isCurrentUser}
                      className="grid grid-cols-12 py-2 items-center text-xs"
                    >
                      {/* Rank Badge */}
                      <LeaderboardItemRank rank={rank} className="col-span-2 sm:col-span-1" />

                      {/* Solver Name & Flag */}
                      <LeaderboardItemUser className="col-span-5 sm:col-span-6">
                        <span className="text-base">{getCountryFlag(entry.countryCode)}</span>
                        <span className="truncate font-semibold text-slate-900">
                          {entry.username}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white shrink-0">
                            YOU
                          </span>
                        )}
                      </LeaderboardItemUser>

                      {/* Time */}
                      <div className="col-span-3 sm:col-span-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                        {formatSeconds(entry.timeSeconds)}
                      </div>

                      {/* Score */}
                      <LeaderboardItemScore className="col-span-2 sm:col-span-2 text-blue-600">
                        {entry.score}
                      </LeaderboardItemScore>
                    </LeaderboardItem>
                  );
                })}
              </LeaderboardCardContent>

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
            </LeaderboardCard>
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
