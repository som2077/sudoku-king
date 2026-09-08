"use client";

import { Calendar, Flame, Trophy, Award, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { useSudokuStore } from "@/store/useSudokuStore";

export function DailyChallengeBanner() {
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section id="daily" className="py-16 md:py-20 border-t border-slate-200 bg-white/50">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-black/[0.06] bg-white/80 backdrop-blur-xl p-8 md:p-12 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 gap-1 text-xs font-mono font-bold rounded-full">
                  <Flame className="h-3.5 w-3.5 text-blue-600 fill-blue-600" />
                  DAILY CONSENSUS
                </Badge>
                <span suppressHydrationWarning className="text-xs font-mono font-medium text-slate-500 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  {today}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-[-0.03em]">
                Keep Your Daily Streak Alive
              </h3>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-normal tracking-tight">
                Every calendar day offers a unique, globally synchronized puzzle. Complete it to unlock exclusive crown badges, preserve your streak, and earn free hints.
              </p>

              <div className="flex flex-wrap gap-2.5 pt-2">
                <div className="flex items-center gap-2 text-xs font-medium bg-slate-50 text-slate-800 px-3.5 py-1.5 rounded-full border border-black/[0.06] shadow-2xs">
                  <Trophy className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  <span>30-Day Royal Crown Trophy</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium bg-slate-50 text-slate-800 px-3.5 py-1.5 rounded-full border border-black/[0.06] shadow-2xs">
                  <Award className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Bonus Hint Tokens</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col items-center md:items-end justify-center">
              <button
                onClick={() => useSudokuStore.getState().openModal("daily")}
                className={buttonVariants({
                  size: "lg",
                  className:
                    "w-full sm:w-auto bg-slate-950 hover:bg-slate-900 text-white font-semibold px-6 h-12 rounded-full shadow-sm hover:shadow transition-all apple-press cursor-pointer border border-white/10",
                })}
              >
                Solve Today&apos;s Puzzle
                <ArrowRight className="ml-2 h-4 w-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
