import React from "react";
import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";
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
    <div className={cn("flex items-end justify-center gap-2 sm:gap-4 max-w-lg mx-auto w-full pt-4", className)} {...props}>
      {/* 2nd Place */}
      {rankings[1] && (
        <div className="w-[30%]">
          <PodiumItem ranking={rankings[1]} heightClass="h-24 sm:h-28" />
        </div>
      )}
      {/* 1st Place */}
      {rankings[0] && (
        <div className="w-[36%]">
          <PodiumItem ranking={rankings[0]} heightClass="h-32 sm:h-40" isFirst />
        </div>
      )}
      {/* 3rd Place */}
      {rankings[2] && (
        <div className="w-[30%]">
          <PodiumItem ranking={rankings[2]} heightClass="h-20 sm:h-24" />
        </div>
      )}
    </div>
  );
}

function PodiumItem({ ranking, isFirst = false, heightClass }: { ranking: PodiumRanking; isFirst?: boolean; heightClass: string }) {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col items-center mb-2 relative">
        <div
          className={cn(
            "flex items-center justify-center rounded-full border-2 bg-slate-200 dark:bg-slate-800 overflow-hidden relative shrink-0",
            isFirst ? "h-14 w-14 sm:h-16 sm:w-16 border-amber-400" : "h-10 w-10 sm:h-12 sm:w-12 border-slate-400 dark:border-slate-600"
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
        <div className="absolute -bottom-1 -right-1 bg-slate-900 dark:bg-black rounded-full p-0.5">
          <Crown className={cn("h-3 w-3 sm:h-4 sm:w-4", isFirst ? "text-amber-500" : ranking.rank === 2 ? "text-slate-400" : "text-amber-700")} />
        </div>
      </div>
      
      <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate w-full text-center max-w-[80px]">
        {ranking.userName}
      </div>
      <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono mb-2">
        {ranking.value}
      </div>

      <div
        className={cn(
          "w-full rounded-t-md flex items-start justify-center pt-2 font-bold text-slate-900 dark:text-slate-900 text-sm",
          heightClass,
          isFirst
            ? "bg-[#D4AF37]" // Gold
            : ranking.rank === 2
            ? "bg-[#71717A]" // Silver/Gray
            : "bg-[#8B5A2B]" // Bronze
        )}
      >
        {ranking.rank}
      </div>
    </div>
  );
}
