import {
  getAnalytics,
  logEvent as firebaseLogEvent,
  logScreenView as firebaseLogScreenView,
  setUserProperty as firebaseSetUserProperty,
  setUserId as firebaseSetUserId,
  setAnalyticsCollectionEnabled as firebaseSetAnalyticsCollectionEnabled,
  resetAnalyticsData as firebaseResetAnalyticsData,
} from "@react-native-firebase/analytics";
import { Platform } from "react-native";

export interface GameEventParams {
  difficulty: string;
  isDaily?: boolean;
  timeTaken?: number;
  mistakes?: number;
  hintsUsed?: number;
  resumed?: boolean;
  score?: number;
}

export interface DailyChallengeEventParams {
  date: string;
  difficulty?: string;
  timeTaken?: number;
  mistakes?: number;
}

export interface PurchaseAnalyticsParams {
  productId: string;
  price?: number;
  currency?: string;
  source?: string;
}

class AnalyticsService {
  private analyticsInstance: any = null;
  private isAvailable: boolean | null = null;

  /**
   * Safe getter for Firebase Analytics modular instance.
   * Catches errors in test/unsupported environments so the app never crashes.
   */
  private getAnalyticsSafe() {
    if (this.isAvailable === false) return null;
    if (this.analyticsInstance) return this.analyticsInstance;

    try {
      this.analyticsInstance = getAnalytics();
      this.isAvailable = true;
      return this.analyticsInstance;
    } catch (error) {
      this.isAvailable = false;
      if (__DEV__) {
        console.log(
          "ℹ️ [Firebase Analytics] Native module not active or unavailable in current environment:",
          error,
        );
      }
      return null;
    }
  }

  /**
   * Sanitizes params to comply with Firebase GA4 standards:
   * - Key names up to 40 characters
   * - Value strings up to 100 characters
   * - Numeric and boolean values preserved
   */
  private sanitizeParams(params?: Record<string, any>): Record<string, any> {
    if (!params) return {};
    const sanitized: Record<string, any> = {};

    for (const [key, val] of Object.entries(params)) {
      if (val === undefined || val === null) continue;
      const safeKey = key.slice(0, 40).replace(/[^a-zA-Z0-9_]/g, "_");
      if (typeof val === "string") {
        sanitized[safeKey] = val.slice(0, 100);
      } else if (typeof val === "number" || typeof val === "boolean") {
        sanitized[safeKey] = val;
      } else {
        sanitized[safeKey] = String(val).slice(0, 100);
      }
    }

    return sanitized;
  }

  /**
   * Generic event logging method
   */
  async logCustomEvent(
    eventName: string,
    params?: Record<string, any>,
  ): Promise<void> {
    const analytics = this.getAnalyticsSafe();
    const safeParams = this.sanitizeParams(params);

    if (__DEV__) {
      console.log(`🔥 [Firebase Analytics] ${eventName}:`, safeParams);
    }

    if (!analytics) return;

    try {
      await firebaseLogEvent(analytics, eventName as any, safeParams);
    } catch (error) {
      if (__DEV__) {
        console.log(
          `⚠️ [Firebase Analytics] Error logging ${eventName}:`,
          error,
        );
      }
    }
  }

  /**
   * Track Screen Views for GA4
   */
  async logScreenView(screenName: string, screenClass?: string): Promise<void> {
    const analytics = this.getAnalyticsSafe();
    const resolvedClass = screenClass || screenName;

    if (__DEV__) {
      console.log(
        `🔥 [Firebase Analytics] screen_view: ${screenName} (${resolvedClass})`,
      );
    }

    if (!analytics) return;

    try {
      await firebaseLogScreenView(analytics, {
        screen_name: screenName,
        screen_class: resolvedClass,
      });
    } catch (error) {
      if (__DEV__) {
        console.log(
          `⚠️ [Firebase Analytics] Error logging screen_view:`,
          error,
        );
      }
    }
  }

  // ── Game Lifecycle Analytics ───────────────────────────────────────────────

  async logGameStarted(params: {
    difficulty: string;
    isDaily?: boolean;
    resumed?: boolean;
  }): Promise<void> {
    await this.logCustomEvent("game_started", {
      difficulty: params.difficulty,
      is_daily: !!params.isDaily,
      resumed: !!params.resumed,
    });
  }

  async logGameWon(params: {
    difficulty: string;
    timeTaken: number;
    mistakes: number;
    hintsUsed?: number;
    isDaily?: boolean;
  }): Promise<void> {
    await this.logCustomEvent("game_won", {
      difficulty: params.difficulty,
      time_taken: Math.round(params.timeTaken),
      mistakes: params.mistakes,
      hints_used: params.hintsUsed ?? 0,
      is_daily: !!params.isDaily,
    });
  }

  async logGameLost(params: {
    difficulty: string;
    timeTaken: number;
    mistakes: number;
    isDaily?: boolean;
  }): Promise<void> {
    await this.logCustomEvent("game_lost", {
      difficulty: params.difficulty,
      time_taken: Math.round(params.timeTaken),
      mistakes: params.mistakes,
      is_daily: !!params.isDaily,
    });
  }

  async logGameRestarted(params: {
    difficulty: string;
    isDaily?: boolean;
  }): Promise<void> {
    await this.logCustomEvent("game_restarted", {
      difficulty: params.difficulty,
      is_daily: !!params.isDaily,
    });
  }

  async logHintUsed(params: {
    difficulty: string;
    hintsRemaining: number;
    isDaily?: boolean;
    hintType?: string;
  }): Promise<void> {
    await this.logCustomEvent("hint_used", {
      difficulty: params.difficulty,
      hints_remaining: params.hintsRemaining,
      is_daily: !!params.isDaily,
      hint_type: params.hintType || "smart_hint",
    });
  }

  async logSecondChanceUsed(params: {
    difficulty: string;
    isDaily?: boolean;
  }): Promise<void> {
    await this.logCustomEvent("second_chance_used", {
      difficulty: params.difficulty,
      is_daily: !!params.isDaily,
    });
  }

  // ── Daily Challenge Analytics ─────────────────────────────────────────────

  async logDailyChallengeStarted(params: {
    date: string;
    difficulty: string;
  }): Promise<void> {
    await this.logCustomEvent("daily_challenge_started", {
      challenge_date: params.date,
      difficulty: params.difficulty,
    });
  }

  async logDailyChallengeCompleted(params: {
    date: string;
    timeTaken: number;
    mistakes: number;
  }): Promise<void> {
    await this.logCustomEvent("daily_challenge_completed", {
      challenge_date: params.date,
      time_taken: Math.round(params.timeTaken),
      mistakes: params.mistakes,
    });
  }

  // ── Onboarding & Tutorial Analytics ───────────────────────────────────────

  async logOnboardingStep(step: number, stepName?: string): Promise<void> {
    await this.logCustomEvent("onboarding_step", {
      step_index: step,
      step_name: stepName || `step_${step}`,
    });
  }

  async logOnboardingCompleted(chosenDifficulty?: string): Promise<void> {
    await this.logCustomEvent("onboarding_completed", {
      chosen_difficulty: chosenDifficulty || "Medium",
    });
  }

  async logTutorialCompleted(): Promise<void> {
    await this.logCustomEvent("tutorial_completed");
  }

  async logTutorialSkipped(): Promise<void> {
    await this.logCustomEvent("tutorial_skipped");
  }

  // ── Monetization & In-App Purchases ───────────────────────────────────────

  async logPaywallViewed(source: string): Promise<void> {
    await this.logCustomEvent("paywall_viewed", { source });
  }

  async logTrialStarted(source: string, days: number = 3): Promise<void> {
    await this.logCustomEvent("trial_started", { source, trial_days: days });
  }

  async logPurchaseStarted(productId: string): Promise<void> {
    await this.logCustomEvent("purchase_started", { product_id: productId });
  }

  async logPurchaseSuccess(params: PurchaseAnalyticsParams): Promise<void> {
    await this.logCustomEvent("purchase_success", {
      product_id: params.productId,
      price: params.price,
      currency: params.currency || "USD",
      source: params.source,
    });
  }

  async logPurchaseRestored(): Promise<void> {
    await this.logCustomEvent("purchase_restored");
  }

  // ── Google AdMob Ads ──────────────────────────────────────────────────────

  async logAdEvent(
    adType: "rewarded" | "interstitial" | "banner",
    action: "impression" | "earned" | "click" | "close",
    extra?: Record<string, any>,
  ): Promise<void> {
    await this.logCustomEvent(`ad_${adType}_${action}`, {
      ad_type: adType,
      action,
      ...(extra || {}),
    });
  }

  // ── User Properties & Configuration ───────────────────────────────────────

  async setUserProperty(name: string, value: string | null): Promise<void> {
    const analytics = this.getAnalyticsSafe();
    if (__DEV__) {
      console.log(
        `🔥 [Firebase Analytics] setUserProperty: ${name} = ${value}`,
      );
    }
    if (!analytics) return;

    try {
      await firebaseSetUserProperty(analytics, name, value);
    } catch (error) {
      if (__DEV__) {
        console.log(
          `⚠️ [Firebase Analytics] Error setting user property:`,
          error,
        );
      }
    }
  }

  async setUserId(userId: string | null): Promise<void> {
    const analytics = this.getAnalyticsSafe();
    if (__DEV__) {
      console.log(`🔥 [Firebase Analytics] setUserId: ${userId}`);
    }
    if (!analytics) return;

    try {
      await firebaseSetUserId(analytics, userId);
    } catch (error) {
      if (__DEV__) {
        console.log(`⚠️ [Firebase Analytics] Error setting user ID:`, error);
      }
    }
  }

  async setAnalyticsCollectionEnabled(enabled: boolean): Promise<void> {
    const analytics = this.getAnalyticsSafe();
    if (!analytics) return;

    try {
      await firebaseSetAnalyticsCollectionEnabled(analytics, enabled);
    } catch (error) {
      if (__DEV__) {
        console.log(
          `⚠️ [Firebase Analytics] Error setting analytics collection:`,
          error,
        );
      }
    }
  }

  async resetAnalyticsData(): Promise<void> {
    const analytics = this.getAnalyticsSafe();
    if (!analytics) return;

    try {
      await firebaseResetAnalyticsData(analytics);
    } catch (error) {
      if (__DEV__) {
        console.log(
          `⚠️ [Firebase Analytics] Error resetting analytics data:`,
          error,
        );
      }
    }
  }
}

export const analyticsService = new AnalyticsService();
