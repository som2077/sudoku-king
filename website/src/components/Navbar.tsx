"use client";

import Link from "next/link";
import { Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSudokuStore } from "@/store/useSudokuStore";
import { LivePresenceBadge } from "@/components/live/LivePresenceBadge";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full apple-blur-nav transition-all">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 group apple-press-subtle"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 shadow-[0_2px_8px_rgba(245,158,11,0.25),inset_0_1px_0_rgba(255,255,255,0.6)] border border-amber-300/60 group-hover:scale-105 transition-transform duration-200">
            <Crown className="h-5 w-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-[-0.02em] text-slate-950">
                Sudoku<span className="text-amber-500">King</span>
              </span>
              <span className="font-mono text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
                v1.0
              </span>
            </div>
            <span className="text-[11px] text-slate-400 -mt-0.5 hidden sm:inline font-medium tracking-tight">
              The Royal Number Puzzle
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium text-slate-600">
          <a
            href="#game"
            className="px-3 py-1.5 rounded-full hover:text-slate-950 hover:bg-slate-100/70 transition-all font-semibold text-slate-900 apple-press-subtle"
          >
            Play
          </a>
          <a
            href="#leaderboard"
            className="px-3 py-1.5 rounded-full hover:text-slate-950 hover:bg-slate-100/70 transition-all apple-press-subtle"
          >
            Leaderboard
          </a>
          <button
            onClick={() => useSudokuStore.getState().openModal("daily")}
            className="px-3 py-1.5 rounded-full hover:text-slate-950 hover:bg-slate-100/70 transition-all cursor-pointer apple-press-subtle"
          >
            Daily Challenge
          </button>
          <button
            onClick={() => useSudokuStore.getState().openModal("stats")}
            className="px-3 py-1.5 rounded-full hover:text-slate-950 hover:bg-slate-100/70 transition-all cursor-pointer apple-press-subtle"
          >
            Statistics
          </button>
          <Link
            href="/rules"
            className="px-3 py-1.5 rounded-full hover:text-slate-950 hover:bg-slate-100/70 transition-all font-medium apple-press-subtle"
          >
            Rules & Guide
          </Link>
          <a
            href="#features"
            className="px-3 py-1.5 rounded-full hover:text-slate-950 hover:bg-slate-100/70 transition-all apple-press-subtle"
          >
            Features
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <LivePresenceBadge className="hidden sm:inline-flex" />
          <Button
            size="sm"
            onClick={() => useSudokuStore.getState().openModal("new-game")}
            className="bg-slate-950 hover:bg-slate-800 text-white font-semibold rounded-full px-4 h-9 shadow-xs hover:shadow transition-all apple-press cursor-pointer border border-white/10"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            New Game
          </Button>
        </div>
      </div>
    </header>
  );
}
