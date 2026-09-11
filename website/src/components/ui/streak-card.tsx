import React from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StreakCardProps extends React.HTMLAttributes<HTMLDivElement> {
  currentStreak: number;
  bestStreak?: number;
  streakDays?: boolean[]; // e.g. [true, true, true, false, false, false, false]
  dayLabels?: string[]; // Dynamic labels matching streakDays length
}

export function StreakCard({
  currentStreak = 0,
  bestStreak = 0,
  streakDays = [true, true, true, false, false, false, false],
  dayLabels = ["M", "T", "W", "T", "F", "S", "S"],
  className,
  ...props
}: StreakCardProps) {

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-orange-100 bg-linear-to-b from-orange-50 to-white p-6 shadow-sm dark:border-orange-900/30 dark:from-orange-950/20 dark:to-background",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-500">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {currentStreak} Day Streak
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {bestStreak > 0 ? `Best: ${bestStreak} days` : "You're on fire!"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-2 flex justify-between gap-1">
        {dayLabels.map((day, i) => {
          const isActive = streakDays[i];
          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-orange-500 text-white shadow-xs shadow-orange-500/30"
                    : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                )}
              >
                {isActive ? <Flame className="h-4 w-4" /> : null}
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
