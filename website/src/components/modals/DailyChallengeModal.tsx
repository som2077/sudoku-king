"use client";

import { useSudokuStore } from "@/store/useSudokuStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Flame, Play, Crown } from "lucide-react";

export function DailyChallengeModal() {
  const { activeModal, stats, closeModal, startNewGame } = useSudokuStore();
  const isOpen = activeModal === "daily";

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const currentDay = now.getDate();

  // Days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = now.toLocaleString("en-US", { month: "long" });

  const formatDate = (day: number) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  const handlePlayDate = (day: number) => {
    const dateStr = formatDate(day);
    startNewGame("Medium", dateStr);
    closeModal();
  };

  const todayStr = formatDate(currentDay);
  const isTodayCompleted = stats.dailyCompleted.includes(todayStr);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-2xl border border-black/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-2xs">
                <CalendarIcon className="h-4 w-4" />
              </div>
              <DialogTitle className="text-lg font-extrabold text-slate-950 tracking-tight">
                Daily Challenges
              </DialogTitle>
            </div>
            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 gap-1 text-xs font-mono font-bold rounded-full">
              <Flame className="h-3.5 w-3.5 text-blue-600 fill-blue-600" />
              {stats.dailyCompleted.length} Solved
            </Badge>
          </div>
          <DialogDescription className="text-xs text-slate-500 font-normal tracking-tight">
            {monthName} {year} — Complete each day&apos;s synchronized puzzle to earn royal crown trophies and boost your ranking.
          </DialogDescription>
        </DialogHeader>

        {/* Days Grid - Apple Calendar View */}
        <div className="grid grid-cols-7 gap-1.5 pt-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div
              key={i}
              className="text-center text-[10px] font-mono font-bold text-slate-400 pb-1"
            >
              {d}
            </div>
          ))}

          {Array.from({ length: daysInMonth }, (_, idx) => {
            const day = idx + 1;
            const dateStr = formatDate(day);
            const isCompleted = stats.dailyCompleted.includes(dateStr);
            const isToday = day === currentDay;
            const isFuture = day > currentDay;

            return (
              <button
                key={day}
                onClick={() => !isFuture && handlePlayDate(day)}
                disabled={isFuture}
                className={`aspect-square flex flex-col items-center justify-center rounded-2xl border text-xs font-mono font-bold transition-all relative cursor-pointer apple-press-subtle ${
                  isCompleted
                    ? "border-amber-400 bg-amber-50 text-amber-700 shadow-2xs"
                    : isToday
                    ? "border-blue-600 ring-2 ring-blue-600 bg-blue-50 text-blue-700 shadow-xs"
                    : isFuture
                    ? "border-transparent text-slate-300 cursor-not-allowed"
                    : "border-black/[0.06] bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 shadow-2xs"
                }`}
              >
                <span>{day}</span>
                {isCompleted && (
                  <Crown className="h-3 w-3 fill-current text-amber-500 -mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Today's quick play button */}
        <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between gap-3">
          <div className="text-xs text-slate-600 font-medium">
            Today: <strong className="text-slate-950 font-bold">{monthName} {currentDay}</strong>
            {isTodayCompleted && " (Completed! 🎉)"}
          </div>

          <Button
            size="sm"
            onClick={() => handlePlayDate(currentDay)}
            className="bg-slate-950 hover:bg-slate-900 text-white font-semibold text-xs rounded-full px-4 h-9 gap-1.5 shadow-xs apple-press cursor-pointer border border-white/10"
          >
            <Play className="h-3 w-3 fill-current text-white" />
            <span>Play Today</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
