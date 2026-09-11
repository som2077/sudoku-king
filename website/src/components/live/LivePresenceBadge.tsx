"use client";

import { useEffect, useState } from "react";
import {
  getPresenceData,
  sendPresenceHeartbeat,
  PresenceData,
} from "@/lib/presenceService";

interface LivePresenceBadgeProps {
  className?: string;
}

export function LivePresenceBadge({ className = "" }: LivePresenceBadgeProps) {
  const [presence, setPresence] = useState<PresenceData>({
    onlineCount: 1420,
    activeSolversCount: 1050,
    recentActivity: [],
  });

  useEffect(() => {
    // Initial fetch & heartbeat
    getPresenceData()
      .then(setPresence)
      .catch(() => {});
    sendPresenceHeartbeat().catch(() => {});

    // Heartbeat & refresh every 20s
    const interval = setInterval(() => {
      sendPresenceHeartbeat().catch(() => {});
      getPresenceData()
        .then(setPresence)
        .catch(() => {});
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-400/10 border border-emerald-200/25 text-emerald-800 text-xs font-semibold shadow-2xs select-none backdrop-blur-md ${className}`}
      title={`${presence.activeSolversCount.toLocaleString()} solvers active worldwide right now`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
      </span>
      <span
        suppressHydrationWarning
        className="tabular-nums font-mono font-bold text-emerald-900"
      >
        {presence.onlineCount.toLocaleString()}
      </span>
      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 hidden sm:inline">
        Online
      </span>
    </div>
  );
}
