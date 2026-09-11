import React, { useState } from "react";
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

export interface ListRanking {
  userId: string;
  rank: number;
  userName: string;
  byline?: string;
  value: number | string;
  displayed: boolean;
  avatarUrl?: string;
  flag?: string;
  timeStr?: string;
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
  title = "Weekly Leaderboard",
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
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(rankings.length / pageSize));
  const visibleRankings = rankings.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className={cn("flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1C1C1C] text-slate-900 dark:text-slate-100 p-4 sm:p-6 shadow-sm", className)}>
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg sm:text-xl font-bold">
            {title}
          </h2>
          {(fromDate || toDate) && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {fromDate} {toDate && `- ${toDate}`}
            </p>
          )}
        </div>

        {runOptions && runOptions.length > 0 && (
          <select
            value={selectedRunId}
            onChange={(e) => onRunChange?.(e.target.value)}
            className="rounded-md border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-slate-400"
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
        <div className="flex items-end justify-center gap-2 sm:gap-4 mb-8 max-w-lg mx-auto w-full pt-4">
          {/* 2nd Place */}
          {podiumRankings.find((r) => r.rank === 2) && (
            <div className="w-[30%]">
              <PodiumItem ranking={podiumRankings.find((r) => r.rank === 2)!} heightClass="h-24 sm:h-28" />
            </div>
          )}
          {/* 1st Place */}
          {podiumRankings.find((r) => r.rank === 1) && (
            <div className="w-[36%]">
              <PodiumItem ranking={podiumRankings.find((r) => r.rank === 1)!} heightClass="h-32 sm:h-40" isFirst />
            </div>
          )}
          {/* 3rd Place */}
          {podiumRankings.find((r) => r.rank === 3) && (
            <div className="w-[30%]">
              <PodiumItem ranking={podiumRankings.find((r) => r.rank === 3)!} heightClass="h-20 sm:h-24" />
            </div>
          )}
        </div>
      )}

      {/* List Area */}
      {rankings.length > 0 && (
        <div className="flex flex-col border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-transparent">
          <div className="flex flex-col">
            {visibleRankings.map((ranking, index) => {
              if (!ranking.displayed) return null;
              
              const isMe = ranking.userId === currentUserId;
              const showEllipsis = index > 0 && visibleRankings[index - 1].rank < ranking.rank - 1;

              return (
                <React.Fragment key={ranking.userId}>
                  {showEllipsis && (
                    <div className="w-full flex justify-center py-1.5 bg-slate-50 dark:bg-slate-800/20 text-slate-400 dark:text-slate-500 text-lg leading-none border-b border-slate-200 dark:border-slate-800">
                      ...
                    </div>
                  )}
                  <div
                    className={cn(
                      "flex items-center w-full px-4 py-3 border-b border-slate-200 dark:border-slate-800 last:border-b-0",
                      isMe ? "bg-slate-50 dark:bg-slate-800/40 outline outline-1 outline-slate-300 dark:outline-slate-600 rounded-md my-[1px] relative z-10" : ""
                    )}
                  >
                    {/* Rank Number & Crown */}
                    <div className="flex items-center w-10 sm:w-14 shrink-0 font-bold text-sm text-slate-700 dark:text-slate-300 gap-1.5">
                      <span>{ranking.rank}</span>
                      {ranking.rank <= 3 && (
                        <Crown className="h-3.5 w-3.5 text-amber-500" />
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-lg overflow-hidden relative border border-slate-200 dark:border-slate-700">
                      {ranking.avatarUrl ? (
                        <Image src={ranking.avatarUrl} alt={ranking.userName} fill className="object-cover" unoptimized />
                      ) : ranking.flag ? (
                        ranking.flag
                      ) : (
                        ranking.userName.charAt(0).toUpperCase()
                      )}
                    </div>

                    {/* Name & Byline */}
                    <div className="flex flex-col flex-1 truncate px-3 sm:px-4">
                      <span className="font-semibold text-sm truncate text-slate-900 dark:text-slate-100">
                        {ranking.userName}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {ranking.timeStr ? `Time: ${ranking.timeStr}` : ranking.byline}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="flex flex-col items-end shrink-0">
                      <span className="font-mono text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100">
                        {ranking.value}
                      </span>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          
          {/* Footer Pagination */}
          <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span>Show</span>
              <select 
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-transparent border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 outline-none focus:ring-1 focus:ring-slate-400"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={cn(
                  "px-2 py-1 rounded transition-colors cursor-pointer", 
                  currentPage === 1 
                    ? "bg-slate-100 dark:bg-slate-800 opacity-50 cursor-not-allowed" 
                    : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200"
                )}
              >
                &lt;
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={cn(
                  "px-2 py-1 rounded transition-colors cursor-pointer", 
                  currentPage === totalPages 
                    ? "bg-slate-100 dark:bg-slate-800 opacity-50 cursor-not-allowed" 
                    : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200"
                )}
              >
                &gt;
              </button>
            </div>
          </div>
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
        {/* Little crown overlay bottom right of avatar */}
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

      {/* Solid Block */}
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
