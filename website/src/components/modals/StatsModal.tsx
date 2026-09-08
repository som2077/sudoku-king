"use client";

import { useState } from "react";
import { useSudokuStore } from "@/store/useSudokuStore";
import { Difficulty } from "@/lib/sudokuEngine";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, Trophy, Clock, Flame, Percent } from "lucide-react";

export function StatsModal() {
  const { activeModal, stats, difficulty, closeModal } = useSudokuStore();
  const [selectedDiff, setSelectedDiff] = useState<Difficulty>(difficulty);

  const isOpen = activeModal === "stats";

  const diffStats = stats.byDifficulty[selectedDiff] || {
    gamesStarted: 0,
    gamesWon: 0,
    bestTime: null,
    totalTime: 0,
    currentStreak: 0,
    bestStreak: 0,
  };

  const winRate =
    diffStats.gamesStarted > 0
      ? Math.round((diffStats.gamesWon / diffStats.gamesStarted) * 100)
      : 0;

  const avgTime =
    diffStats.gamesWon > 0
      ? Math.round(diffStats.totalTime / diffStats.gamesWon)
      : null;

  const formatSeconds = (sec: number | null) => {
    if (sec === null) return "--:--";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const difficulties: Difficulty[] = ["Fast", "Easy", "Medium", "Hard", "Expert", "Master"];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-2xl border border-black/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-2xs">
              <BarChart2 className="h-4 w-4" />
            </div>
            <DialogTitle className="text-lg font-extrabold text-slate-950 tracking-tight">Solver Statistics</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500 font-normal tracking-tight">
            Lifetime records and performance metrics tracked deterministically per difficulty.
          </DialogDescription>
        </DialogHeader>

        {/* Difficulty Tab Selector */}
        <Tabs
          value={selectedDiff}
          onValueChange={(val) => setSelectedDiff(val as Difficulty)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-6 bg-slate-100/90 p-1 rounded-full h-auto border border-black/[0.06] shadow-2xs">
            {difficulties.map((d) => (
              <TabsTrigger
                key={d}
                value={d}
                className="text-[11px] font-mono font-bold py-1.5 px-0 rounded-full data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-xs text-slate-600 apple-press-subtle transition-all"
              >
                {d}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Trophy className="h-3.5 w-3.5 text-amber-500" />
              <span>Games Won</span>
            </div>
            <div className="text-2xl font-black font-mono mt-1 text-slate-950">
              {diffStats.gamesWon}
              <span className="text-xs text-slate-400 font-normal ml-1">
                / {diffStats.gamesStarted}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Percent className="h-3.5 w-3.5 text-emerald-600" />
              <span>Win Rate</span>
            </div>
            <div className="text-2xl font-black font-mono mt-1 text-emerald-700">
              {winRate}%
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Clock className="h-3.5 w-3.5 text-indigo-600" />
              <span>Best Time</span>
            </div>
            <div className="text-2xl font-black font-mono mt-1 text-indigo-600">
              {formatSeconds(diffStats.bestTime)}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Clock className="h-3.5 w-3.5 text-slate-600" />
              <span>Average Time</span>
            </div>
            <div className="text-2xl font-black font-mono mt-1 text-slate-900">
              {formatSeconds(avgTime)}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Flame className="h-3.5 w-3.5 text-amber-500" />
              <span>Current Streak</span>
            </div>
            <div className="text-2xl font-black font-mono mt-1 text-amber-600">
              {diffStats.currentStreak}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              <span>Best Streak</span>
            </div>
            <div className="text-2xl font-black font-mono mt-1 text-orange-600">
              {diffStats.bestStreak}
            </div>
          </div>
        </div>

        {/* Daily challenges footer */}
        <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between text-xs text-indigo-800 font-mono font-semibold">
          <span>Daily Challenges Solved:</span>
          <span className="font-bold">{stats.dailyCompleted.length} Days</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
