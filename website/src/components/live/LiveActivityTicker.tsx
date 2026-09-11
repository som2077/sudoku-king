"use client";

import { useEffect, useState } from "react";
import { getPresenceData } from "@/lib/presenceService";
import { LiveActivityEvent, getCountryFlag } from "@/lib/leaderboardService";
import { Zap, Crown, Flame, Trophy } from "lucide-react";

export function LiveActivityTicker() {
  const [events, setEvents] = useState<LiveActivityEvent[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    getPresenceData()
      .then((data) => {
        if (data.recentActivity && data.recentActivity.length > 0) {
          setEvents(data.recentActivity);
        }
      })
      .catch(() => {});

    const refreshInterval = setInterval(() => {
      getPresenceData()
        .then((data) => {
          if (data.recentActivity && data.recentActivity.length > 0) {
            setEvents(data.recentActivity);
          }
        })
        .catch(() => {});
    }, 25000);

    return () => clearInterval(refreshInterval);
  }, []);

  // Cycle current event every 4 seconds
  useEffect(() => {
    if (events.length === 0) return;
    const cycleInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 4000);
    return () => clearInterval(cycleInterval);
  }, [events.length]);

  if (events.length === 0) return null;

  const currentEvent = events[currentIndex] || events[0];
  if (!currentEvent) return null;

  const getActionIcon = () => {
    switch (currentEvent.action) {
      case "daily_solve":
        return <Crown className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />;
      case "streak_milestone":
        return <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />;
      default:
        return <Trophy className="h-3.5 w-3.5 text-emerald-400" />;
    }
  };

  const getActionText = () => {
    switch (currentEvent.action) {
      case "daily_solve":
        return `solved Today's Daily Challenge in ${currentEvent.timeFormatted}!`;
      case "streak_milestone":
        return `hit a ${currentEvent.streakDays}-day Daily Challenge streak!`;
      default:
        return `conquered ${currentEvent.difficulty || "Expert"} mode in ${currentEvent.timeFormatted}!`;
    }
  };

  return (
    <div className="w-full bg-slate-100/60 backdrop-blur-md border-y border-black/[0.06] py-2 px-4 overflow-hidden">
      <div className="container mx-auto max-w-6xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/90 border border-black/[0.06] text-[10px] font-semibold text-slate-700 shadow-2xs">
            <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
            LIVE FEED
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-slate-800 transition-all duration-300 animate-in fade-in slide-in-from-bottom-1 truncate">
          <span className="text-sm shrink-0">{getCountryFlag(currentEvent.countryCode)}</span>
          <strong className="font-bold text-slate-950 tracking-tight shrink-0">
            {currentEvent.username}
          </strong>
          <span className="text-slate-600 flex items-center gap-1 font-normal truncate">
            <span className="shrink-0">{getActionIcon()}</span>
            <span className="truncate">{getActionText()}</span>
          </span>
        </div>

        <span className="text-[10px] text-slate-400 font-medium shrink-0 hidden md:inline tracking-tight">
          Verified • Just now
        </span>
      </div>
    </div>
  );
}
