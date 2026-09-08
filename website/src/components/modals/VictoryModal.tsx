"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useSudokuStore } from "@/store/useSudokuStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  getPlayerProfile,
  submitLeaderboardScore,
} from "@/lib/leaderboardService";
import { Trophy, Clock, Sparkles, Flame, ArrowRight } from "lucide-react";

export function VictoryModal() {
  const {
    activeModal,
    difficulty,
    timer,
    score,
    mistakes,
    hintsLeft,
    dailyDate,
    closeModal,
    startNewGame,
  } = useSudokuStore();

  const [leaderboardRank, setLeaderboardRank] = useState<number | null>(null);

  const isOpen = activeModal === "victory";

  useEffect(() => {
    if (isOpen) {
      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#f59e0b", "#fbbf24", "#eab308", "#10b981", "#3b82f6"],
        });
      } catch {}

      // Auto-submit score to daily leaderboard if Daily Challenge
      const targetDate = dailyDate || new Date().toISOString().split("T")[0];
      const profile = getPlayerProfile();
      submitLeaderboardScore({
        puzzleDate: targetDate,
        username: profile.username,
        countryCode: profile.countryCode,
        countryName: profile.countryName,
        avatarSeed: profile.avatarSeed,
        timeSeconds: timer,
        score,
        mistakes,
        hintsUsed: Math.max(0, 3 - hintsLeft),
      }).then(({ rank }) => {
        setLeaderboardRank(rank);
      });
    }
  }, [isOpen, dailyDate, timer, score, mistakes, hintsLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-2xl border border-black/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-3xl text-center">
        <DialogHeader className="items-center text-center">
          <div className="h-16 w-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center mb-1 shadow-sm border border-amber-300/80">
            <Trophy className="h-8 w-8 fill-current" />
          </div>
          <DialogTitle className="text-2xl font-extrabold text-slate-950 tracking-tight">
            Victory! Puzzle Solved
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-normal tracking-tight">
            {dailyDate ? (
              <span className="text-blue-700 font-mono font-bold">
                Daily Challenge for {dailyDate} conquered!
              </span>
            ) : (
              <span>You conquered the {difficulty} board with pure mathematical deduction.</span>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Global Leaderboard Rank Notification */}
        {leaderboardRank !== null && (
          <div className="my-1 p-2.5 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-center justify-center gap-2 text-xs font-mono font-bold text-blue-700">
            <Trophy className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span>
              Global Daily Rank: <strong className="text-slate-950 font-black">#{leaderboardRank}</strong>
            </span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 py-2">
          <div className="p-3 rounded-2xl bg-slate-50/80 border border-black/[0.06] flex flex-col items-center">
            <Clock className="h-4 w-4 text-blue-600 mb-1" />
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Time</span>
            <span className="font-mono font-bold text-sm text-slate-900 tabular-nums">{formatTime(timer)}</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50/80 border border-black/[0.06] flex flex-col items-center">
            <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500 mb-1" />
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Score</span>
            <span className="font-mono font-bold text-sm text-slate-900 tabular-nums">{score}</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50/80 border border-black/[0.06] flex flex-col items-center">
            <Flame className="h-4 w-4 text-emerald-600 mb-1" />
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Fails</span>
            <span className="font-mono font-bold text-sm text-emerald-700 tabular-nums">{mistakes}/3</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <Button
            size="lg"
            onClick={() => startNewGame(difficulty)}
            className="w-full bg-slate-950 hover:bg-slate-900 text-white font-semibold rounded-full h-11 gap-2 shadow-xs apple-press cursor-pointer border border-white/10"
          >
            <Sparkles className="h-4 w-4 text-amber-400 fill-amber-400" />
            <span>Play Next Puzzle</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              closeModal();
              const el = document.getElementById("leaderboard");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full text-xs gap-1.5 rounded-full h-9 border-black/[0.08] bg-white hover:bg-slate-50 text-slate-800 shadow-2xs font-semibold apple-press cursor-pointer"
          >
            <span>View Full Leaderboard</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
