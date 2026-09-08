"use client";

import { useSudokuStore } from "@/store/useSudokuStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  Play,
  Pause,
  BarChart2,
  Settings,
  HelpCircle,
  Calendar,
  Sparkles,
  Trophy,
} from "lucide-react";
import { LivePresenceBadge } from "@/components/live/LivePresenceBadge";

export function SudokuHeader() {
  const {
    difficulty,
    mistakes,
    score,
    timer,
    status,
    settings,
    dailyDate,
    togglePause,
    openModal,
  } = useSudokuStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <header className="w-full apple-blur-nav sticky top-0 z-40 transition-all">
      <div className="container mx-auto max-w-7xl px-3 sm:px-6 py-2">
        <div className="flex items-center justify-between gap-2">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 shadow-[0_2px_6px_rgba(245,158,11,0.2),inset_0_1px_0_rgba(255,255,255,0.6)] border border-amber-300/60 font-black">
              <Crown className="h-4 w-4 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-[-0.02em] text-slate-950">
                  Sudoku<span className="text-amber-500">King</span>
                </span>
                {dailyDate && (
                  <Badge variant="outline" className="text-[10px] px-2 py-0 border-blue-200 bg-blue-50 text-blue-700 font-mono font-bold rounded-full">
                    DAILY
                  </Badge>
                )}
              </div>
            </div>
            <LivePresenceBadge className="hidden xl:inline-flex ml-2" />
          </div>

          {/* Game Stats HUD - Apple Dynamic Capsule */}
          <div className="flex items-center gap-3 sm:gap-4 bg-slate-100/80 backdrop-blur-md px-3.5 py-1 rounded-full border border-black/[0.06] text-xs sm:text-sm shadow-2xs">
            {/* Difficulty */}
            <button
              onClick={() => openModal("new-game")}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors font-medium cursor-pointer apple-press-subtle"
              title="Change Difficulty"
            >
              <span className="text-slate-400 hidden sm:inline text-xs font-mono">DIFF:</span>
              <span suppressHydrationWarning className="font-bold text-slate-900 underline decoration-slate-300 decoration-dotted">
                {difficulty}
              </span>
            </button>

            <span className="text-slate-300 hidden sm:inline">•</span>

            {/* Mistakes */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 hidden sm:inline text-xs font-mono">FAILS:</span>
              <span
                suppressHydrationWarning
                className={`font-mono font-bold px-2 py-0.5 rounded-full border text-xs ${
                  mistakes > 0
                    ? "bg-rose-50 border-rose-200 text-rose-700 font-black"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700"
                }`}
              >
                {mistakes}/3
              </span>
            </div>

            <span className="text-slate-300 hidden md:inline">•</span>

            {/* Score */}
            <div className="hidden md:flex items-center gap-1.5">
              <span className="text-slate-400 text-xs font-mono">PTS:</span>
              <span suppressHydrationWarning className="font-mono font-bold text-slate-900 tabular-nums">{score}</span>
            </div>

            {/* Timer & Pause */}
            {settings.timerVisible && (
              <>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                  <span suppressHydrationWarning className="tabular-nums">{formatTime(timer)}</span>
                  <button
                    onClick={togglePause}
                    className="p-1 rounded-full hover:bg-slate-200/80 text-slate-600 hover:text-slate-950 transition-colors cursor-pointer apple-press"
                    aria-label={status === "paused" ? "Resume Game" : "Pause Game"}
                    title={status === "paused" ? "Resume (P)" : "Pause (P)"}
                  >
                    {status === "paused" ? (
                      <Play className="h-3.5 w-3.5 fill-current text-blue-600" />
                    ) : (
                      <Pause className="h-3.5 w-3.5 fill-current" />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const el = document.getElementById("leaderboard");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="h-8 px-2 sm:px-3 text-xs hidden lg:flex items-center gap-1.5 rounded-full border-black/[0.08] bg-white text-slate-700 hover:bg-slate-50 shadow-2xs apple-press cursor-pointer"
              title="Global Daily Leaderboard"
            >
              <Trophy className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span className="font-semibold">Leaderboard</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => openModal("daily")}
              className="h-8 px-2 sm:px-3 text-xs hidden sm:flex items-center gap-1.5 rounded-full border-black/[0.08] bg-white text-slate-700 hover:bg-slate-50 shadow-2xs apple-press cursor-pointer"
              title="Daily Challenge"
            >
              <Calendar className="h-3.5 w-3.5 text-blue-600" />
              <span className="font-semibold">Daily</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => openModal("stats")}
              className="h-8 w-8 rounded-full text-slate-600 hover:text-slate-950 hover:bg-slate-100 apple-press cursor-pointer"
              title="Statistics"
            >
              <BarChart2 className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => openModal("how-to-play")}
              className="h-8 w-8 rounded-full text-slate-600 hover:text-slate-950 hover:bg-slate-100 hidden sm:inline-flex apple-press cursor-pointer"
              title="How to Play"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => openModal("settings")}
              className="h-8 w-8 rounded-full text-slate-600 hover:text-slate-950 hover:bg-slate-100 apple-press cursor-pointer"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              onClick={() => openModal("new-game")}
              className="h-8 px-3 text-xs font-semibold rounded-full bg-slate-950 hover:bg-slate-800 text-white shadow-xs apple-press cursor-pointer border border-white/10"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1 text-amber-400 fill-amber-400" />
              <span className="hidden sm:inline">New Game</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
