import { NextResponse } from "next/server";
import { generateSimulatedActivity } from "@/lib/presenceService";

// In-memory active presence tracker
const activeHeartbeats = new Set<number>();
const cachedEvents = [
  generateSimulatedActivity(),
  generateSimulatedActivity(),
  generateSimulatedActivity(),
];

// Periodically generate new solver achievements in background
const updateRecentEvents = () => {
  if (Math.random() > 0.4) {
    cachedEvents.unshift(generateSimulatedActivity());
    if (cachedEvents.length > 8) {
      cachedEvents.pop();
    }
  }
};

export async function GET() {
  updateRecentEvents();

  // Prune heartbeats older than 45s in-place to avoid GC churn
  const now = Date.now();
  for (const timestamp of activeHeartbeats) {
    if (now - timestamp >= 45000) {
      activeHeartbeats.delete(timestamp);
    }
  }

  // Organic live count base: 1,420 + active real users + realistic sinusoidal variance
  const organicWave = Math.floor(Math.sin(now / 180000) * 120);
  const totalOnline = 1420 + activeHeartbeats.size + organicWave;
  const activeSolvers = Math.floor(totalOnline * 0.74);

  return NextResponse.json(
    {
      onlineCount: Math.max(1200, totalOnline),
      activeSolversCount: Math.max(900, activeSolvers),
      recentActivity: cachedEvents,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=5, stale-while-revalidate=15",
      },
    }
  );
}

export async function POST() {
  activeHeartbeats.add(Date.now());
  return NextResponse.json({ ok: true });
}
