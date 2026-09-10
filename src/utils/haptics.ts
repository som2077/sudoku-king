import { Vibration, Platform } from "react-native";
import { useGameStore } from "../store/useGameStore";

/**
 * Universal Haptics Engine for Sudoku King.
 * Provides crisp tactile feedback across Android and iOS with zero crash risk.
 */
class HapticsEngine {
  private isEnabled(): boolean {
    try {
      const state = useGameStore.getState();
      return state.settings?.vibrationEnabled ?? true;
    } catch {
      return true;
    }
  }

  /**
   * Subtle light tap for option selection, bubble tap, radio buttons
   */
  selection() {
    if (!this.isEnabled()) return;
    try {
      if (Platform.OS === "android") {
        Vibration.vibrate(12);
      } else {
        Vibration.vibrate([0, 10]);
      }
    } catch {}
  }

  /**
   * Light impact for back button, navigation transitions
   */
  impactLight() {
    if (!this.isEnabled()) return;
    try {
      if (Platform.OS === "android") {
        Vibration.vibrate(18);
      } else {
        Vibration.vibrate([0, 15]);
      }
    } catch {}
  }

  /**
   * Medium impact for "Continue" button and primary actions
   */
  impactMedium() {
    if (!this.isEnabled()) return;
    try {
      if (Platform.OS === "android") {
        Vibration.vibrate(28);
      } else {
        Vibration.vibrate([0, 25]);
      }
    } catch {}
  }

  /**
   * Distinct double impact for an incorrect Sudoku entry.
   */
  error() {
    if (!this.isEnabled()) return;
    try {
      Vibration.vibrate([0, 35, 45, 35]);
    } catch {}
  }

  /**
   * Success feedback (double tap pattern) for completing onboarding or goals
   */
  success() {
    if (!this.isEnabled()) return;
    try {
      Vibration.vibrate([0, 20, 60, 25]);
    } catch {}
  }
}

export const haptics = new HapticsEngine();
