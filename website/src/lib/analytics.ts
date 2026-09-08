import { track } from "@vercel/analytics";

/**
 * Type-safe helper for Vercel Web Analytics custom event tracking.
 * Automatically handles SSR guards and non-production environments safely.
 */
export function trackEvent(
  name: string,
  properties?: Record<string, string | number | boolean | null>
): void {
  if (typeof window === "undefined") return;

  try {
    track(name, properties);
  } catch {
    // Gracefully handle in environments where analytics might be blocked by adblockers
  }
}
