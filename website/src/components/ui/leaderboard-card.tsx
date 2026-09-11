import React from "react";
import { cn } from "@/lib/utils";
import { Trophy, Clock, Sparkles, Crown } from "lucide-react";
import Image from "next/image";

export interface PodiumRanking {
  userId: string;
  userName: string;
  rank: number;
  value: number;
  avatarUrl?: string;
  flag?: string; // custom addition
  timeStr?: string; // custom addition
}

export interface ListRanking {
  userId: string;
  rank: number;
  userName: string;
  byline?: string;
  value: number;
  displayed: boolean;
  avatarUrl?: string;
  flag?: string; // custom addition
  timeStr?: string; // custom addition
}

export interface LeaderboardCardProps {
  title?: string;
  fromDate?: string;
  toDate?: string;
  currentUserId?: string;
  selectedRunId?: string;
  onRunChange?: (id: string) => void;
  runOptions?: { id: string; label: string }[];
  podiumRankings?: PodiumRanking[];
  rankings?: ListRanking[];
  className?: string;
}

export function LeaderboardCard({
  title = "Leaderboard",
  fromDate,
  toDate,
  currentUserId,
  selectedRunId,
  onRunChange,
  runOptions,
  podiumRankings = [],
  rankings = [],
  className,
}: LeaderboardCardProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-500" />
            {title}
          </h2>
          {(fromDate || toDate) && (
            <p className="text-sm text-slate-500 font-medium">
              {fromDate} {toDate && `- ${toDate}`}
            </p>
          )}
        </div>

        {runOptions && runOptions.length > 0 && (
          <select
            value={selectedRunId}
            onChange={(e) => onRunChange?.(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {runOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Podium Area */}
      {podiumRankings.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-8 pb-4 max-w-2xl mx-auto w-full select-none">
          {/* 2nd Place */}
          {podiumRankings[1] && <PodiumItem ranking={podiumRankings[1]} />}
          {/* 1st Place */}
          {podiumRankings[0] && <PodiumItem ranking={podiumRankings[0]} isFirst />}
          {/* 3rd Place */}
          {podiumRankings[2] && <PodiumItem ranking={podiumRankings[2]} />}
        </div>
      )}

      {/* List Area */}
      {rankings.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto p-2">
            {rankings.map((ranking) => {
              if (!ranking.displayed) return null;
              const isMe = ranking.userId === currentUserId;

              return (
                <div
                  key={ranking.userId}
                  className={cn(
                    "flex items-center w-full px-4 py-3 rounded-xl transition-colors",
                    isMe ? "bg-blue-50/60" : "hover:bg-slate-50"
                  )}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center font-bold text-sm text-slate-500">
                    {ranking.rank === 1 ? "🥇" : ranking.rank === 2 ? "🥈" : ranking.rank === 3 ? "🥉" : `#${ranking.rank}`}
                  </div>

                  <div className="flex flex-1 items-center gap-3 px-3 sm:px-4 overflow-hidden">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-lg overflow-hidden relative">
                      {ranking.avatarUrl ? (
                        <Image src={ranking.avatarUrl} alt={ranking.userName} fill className="object-cover" unoptimized />
                      ) : ranking.flag ? (
                        ranking.flag
                      ) : (
                        ranking.userName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex flex-col truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm sm:text-[15px] truncate">
                          {ranking.userName}
                        </span>
                        {isMe && (
                          <span className="shrink-0 text-[9px] font-black tracking-wider px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-sm">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 truncate">
                        {ranking.timeStr ? `Time: ${ranking.timeStr}` : ranking.byline}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-center shrink-0">
                    <div className="font-mono font-bold text-blue-600 text-base sm:text-lg tabular-nums">
                      {ranking.value}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      PTS
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
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
            "absolute -top-6 flex items-center justify-center rounded-full border-2 shadow-sm text-lg sm:text-xl bg-white overflow-hidden",
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
          <div className="absolute -top-9 h-6 w-6 rounded-full bg-amber-400 border border-amber-300 text-white flex items-center justify-center shadow-md">
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
