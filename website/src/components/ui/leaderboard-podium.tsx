import React from "react";
import { cn } from "@/lib/utils";
import { Crown, Sparkles, Clock } from "lucide-react";
import Image from "next/image";

export interface PodiumRanking {
  userId: string;
  userName: string;
  rank: number;
  value: number | string;
  avatarUrl?: string;
  flag?: string;
  timeStr?: string;
}

export interface LeaderboardPodiumProps extends React.HTMLAttributes<HTMLDivElement> {
  rankings: PodiumRanking[];
}

export function LeaderboardPodium({ rankings, className, ...props }: LeaderboardPodiumProps) {
  if (!rankings || rankings.length === 0) return null;

  return (
    <div className={cn("grid grid-cols-3 gap-2 sm:gap-4 items-end pt-8 pb-4 max-w-2xl mx-auto w-full select-none", className)} {...props}>
      {/* 2nd Place */}
      {rankings[1] && <PodiumItem ranking={rankings[1]} />}
      
      {/* 1st Place */}
      {rankings[0] && <PodiumItem ranking={rankings[0]} isFirst />}
      
      {/* 3rd Place */}
      {rankings[2] && <PodiumItem ranking={rankings[2]} />}
    </div>
  );
}

function PodiumItem({ ranking, isFirst = false }: { ranking: PodiumRanking; isFirst?: boolean }) {
  return (
    <div className={cn("flex flex-col items-center", isFirst ? "-mt-4" : "")}>
      <div
        className={cn(
          "flex flex-col items-center w-full text-center relative rounded-t-3xl border-t border-x px-2 pt-8 pb-3 shadow-sm",
          isFirst
            ? "border-amber-200 bg-linear-to-b from-amber-50 to-white z-10"
            : ranking.rank === 2
            ? "border-slate-200 bg-linear-to-b from-slate-50 to-white"
            : "border-orange-200/50 bg-linear-to-b from-orange-50/30 to-white"
        )}
      >
        <div
          className={cn(
            "absolute -top-6 flex items-center justify-center rounded-full border-2 shadow-sm text-lg sm:text-xl bg-white overflow-hidden shrink-0",
            isFirst ? "h-14 w-14 border-amber-400" : "h-12 w-12 border-slate-200"
          )}
        >
          {ranking.avatarUrl ? (
            <Image src={ranking.avatarUrl} alt={ranking.userName} fill className="object-cover" unoptimized />
          ) : ranking.flag ? (
            ranking.flag
          ) : (
            ranking.userName.charAt(0).toUpperCase()
          )}
        </div>
        {isFirst && (
          <div className="absolute -top-9 h-6 w-6 rounded-full bg-amber-400 border border-amber-300 text-white flex items-center justify-center shadow-md z-20">
            <Crown className="h-3.5 w-3.5 fill-current" />
          </div>
        )}

        <div className="font-bold text-xs sm:text-sm text-slate-900 truncate w-full tracking-tight mt-1">
          {ranking.userName}
        </div>
        
        {ranking.timeStr && (
          <div className="flex items-center gap-1 font-mono font-bold text-[10px] sm:text-xs text-slate-500 mt-1 tabular-nums">
            <Clock className="h-3 w-3" />
            <span>{ranking.timeStr}</span>
          </div>
        )}
        
        <div
          className={cn(
            "text-[10px] font-mono font-black mt-1 flex items-center gap-1 tabular-nums",
            isFirst ? "text-amber-600" : ranking.rank === 2 ? "text-slate-500" : "text-orange-700"
          )}
        >
          {isFirst && <Sparkles className="h-3 w-3 fill-current" />}
          <span>{ranking.value} pts</span>
        </div>
      </div>
      <div
        className={cn(
          "w-full flex items-center justify-center font-mono font-black border-b border-x rounded-b-2xl shadow-sm",
          isFirst
            ? "h-16 sm:h-20 bg-amber-100 border-amber-200 text-amber-700 text-base"
            : ranking.rank === 2
            ? "h-10 sm:h-14 bg-slate-100 border-slate-200 text-slate-600 text-sm"
            : "h-8 sm:h-10 bg-orange-100/50 border-orange-200/50 text-orange-800 text-sm"
        )}
      >
        #{ranking.rank}
      </div>
    </div>
  );
}
