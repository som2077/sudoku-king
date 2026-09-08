"use client";

import { LeaderboardEntry, getCountryFlag } from "@/lib/leaderboardService";
import { Crown, Clock, Sparkles } from "lucide-react";

interface PodiumProps {
  topThree: LeaderboardEntry[];
}

export function LeaderboardPodium({ topThree }: PodiumProps) {
  if (!topThree || topThree.length < 3) return null;

  const first = topThree[0];
  const second = topThree[1];
  const third = topThree[2];

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-5 pb-6 max-w-xl mx-auto select-none">
      {/* 2nd Place (Silver) */}
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center p-3.5 rounded-3xl border border-black/[0.08] bg-white w-full text-center shadow-[0_2px_12px_rgba(0,0,0,0.03)] relative apple-press-subtle">
          <span className="text-xl -mt-7 mb-1">🥈</span>
          <span className="text-base">{getCountryFlag(second.countryCode)}</span>
          <div className="font-bold text-xs sm:text-sm text-slate-900 truncate max-w-full mt-1 tracking-tight">
            {second.username}
          </div>
          <div className="flex items-center gap-1 font-mono font-bold text-xs text-slate-600 mt-1 tabular-nums">
            <Clock className="h-3 w-3" />
            <span>{formatSeconds(second.timeSeconds)}</span>
          </div>
          <div className="text-[10px] font-mono font-bold text-slate-500 mt-0.5 tabular-nums">
            {second.score} pts
          </div>
        </div>
        <div className="h-10 sm:h-14 w-full bg-slate-100/80 rounded-b-2xl border-x border-b border-slate-200 flex items-center justify-center font-mono font-black text-sm text-slate-600">
          #2
        </div>
      </div>

      {/* 1st Place (Gold) - Tallest & Prominent */}
      <div className="flex flex-col items-center -mt-4">
        <div className="flex flex-col items-center p-4 rounded-3xl border-2 border-amber-400 bg-white w-full text-center shadow-[0_4px_20px_rgba(245,158,11,0.15)] relative apple-press-subtle">
          <div className="h-8 w-8 rounded-full bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center -mt-8 mb-1 shadow-sm border border-amber-300/80">
            <Crown className="h-4 w-4 fill-current" />
          </div>
          <span className="text-lg">{getCountryFlag(first.countryCode)}</span>
          <div className="font-extrabold text-sm sm:text-base text-slate-950 truncate max-w-full mt-1 tracking-tight">
            {first.username}
          </div>
          <div className="flex items-center gap-1 font-mono font-bold text-xs text-amber-700 mt-1 tabular-nums">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatSeconds(first.timeSeconds)}</span>
          </div>
          <div className="text-[11px] font-mono font-black text-amber-600 mt-0.5 flex items-center gap-1 tabular-nums">
            <Sparkles className="h-3 w-3 fill-current" />
            <span>{first.score} pts</span>
          </div>
        </div>
        <div className="h-14 sm:h-20 w-full bg-amber-50 rounded-b-2xl border-x border-b border-amber-200 flex items-center justify-center font-mono font-black text-base text-amber-700">
          #1
        </div>
      </div>

      {/* 3rd Place (Bronze) */}
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center p-3.5 rounded-3xl border border-amber-700/20 bg-white w-full text-center shadow-[0_2px_12px_rgba(0,0,0,0.03)] relative apple-press-subtle">
          <span className="text-xl -mt-7 mb-1">🥉</span>
          <span className="text-base">{getCountryFlag(third.countryCode)}</span>
          <div className="font-bold text-xs sm:text-sm text-slate-900 truncate max-w-full mt-1 tracking-tight">
            {third.username}
          </div>
          <div className="flex items-center gap-1 font-mono font-bold text-xs text-slate-600 mt-1 tabular-nums">
            <Clock className="h-3 w-3" />
            <span>{formatSeconds(third.timeSeconds)}</span>
          </div>
          <div className="text-[10px] font-mono font-bold text-amber-800 mt-0.5 tabular-nums">
            {third.score} pts
          </div>
        </div>
        <div className="h-8 sm:h-10 w-full bg-amber-100/40 rounded-b-2xl border-x border-b border-amber-200 flex items-center justify-center font-mono font-black text-sm text-amber-800">
          #3
        </div>
      </div>
    </div>
  );
}
