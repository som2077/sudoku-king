import * as React from "react"

import { cn } from "@/lib/utils"

const LeaderboardCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-3xl border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
      className
    )}
    {...props}
  />
))
LeaderboardCard.displayName = "LeaderboardCard"

const LeaderboardCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20 rounded-t-3xl", className)}
    {...props}
  />
))
LeaderboardCardHeader.displayName = "LeaderboardCardHeader"

const LeaderboardCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-bold text-xl tracking-tight",
      className
    )}
    {...props}
  />
))
LeaderboardCardTitle.displayName = "LeaderboardCardTitle"

const LeaderboardCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-0 overflow-hidden", className)} {...props} />
))
LeaderboardCardContent.displayName = "LeaderboardCardContent"

const LeaderboardItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { isCurrentUser?: boolean }
>(({ className, isCurrentUser, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50",
      isCurrentUser && "bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-900/20 dark:hover:bg-blue-900/30",
      className
    )}
    {...props}
  />
))
LeaderboardItem.displayName = "LeaderboardItem"

const LeaderboardItemRank = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { rank: number }
>(({ className, rank, ...props }, ref) => {
  const isTop3 = rank <= 3;
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold text-sm",
        rank === 1 ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500" :
        rank === 2 ? "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" :
        rank === 3 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
        "text-slate-500",
        className
      )}
      {...props}
    >
      {isTop3 ? (rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉") : rank}
    </div>
  )
})
LeaderboardItemRank.displayName = "LeaderboardItemRank"

const LeaderboardItemUser = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-1 items-center gap-3 px-4 overflow-hidden", className)}
    {...props}
  />
))
LeaderboardItemUser.displayName = "LeaderboardItemUser"

const LeaderboardItemScore = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-mono font-bold text-slate-900 dark:text-slate-100 text-right", className)}
    {...props}
  />
))
LeaderboardItemScore.displayName = "LeaderboardItemScore"

export {
  LeaderboardCard,
  LeaderboardCardHeader,
  LeaderboardCardTitle,
  LeaderboardCardContent,
  LeaderboardItem,
  LeaderboardItemRank,
  LeaderboardItemUser,
  LeaderboardItemScore,
}
