import { Vibration, Platform } from "react-native";
import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import { useGameStore } from "../store/useGameStore";

let tapAudio: ReturnType<typeof createAudioPlayer> | null = null;
let blockCompleteAudio: ReturnType<typeof createAudioPlayer> | null = null;
let gameWinAudio: ReturnType<typeof createAudioPlayer> | null = null;
let audioModeConfigured = false;

/**
 * Universal Haptics Engine for Sudoku King.
 * Provides crisp tactile feedback across Android and iOS with zero crash risk.
 */
class HapticsEngine {
  private isSoundEnabled(): boolean {
    try {
      return useGameStore.getState().settings?.soundEnabled ?? true;
    } catch {
      return true;
    }
  }

  private playSound(player: {
    isLoaded: boolean;
    seekTo: (seconds: number) => Promise<void>;
    play: () => void;
  }) {
    if (!this.isSoundEnabled()) return;
    if (!player.isLoaded) {
      player.play();
      return;
    }

    void player
      .seekTo(0)
      .then(() => player.play())
      .catch(() => player.play());
  }

  private configureAudioMode() {
    if (audioModeConfigured) return;
    audioModeConfigured = true;
    void setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }

  tapSound() {
    this.configureAudioMode();
    tapAudio ??= createAudioPlayer(require("../../assets/taps.mp3"));
    this.playSound(tapAudio);
  }

  blockCompleteSound() {
    this.configureAudioMode();
    blockCompleteAudio ??= createAudioPlayer(
      require("../../assets/blockComplete.mp3"),
    );
    this.playSound(blockCompleteAudio);
  }

  gameWinSound() {
    this.configureAudioMode();
    gameWinAudio ??= createAudioPlayer(require("../../assets/gameWin.mp3"));
    this.playSound(gameWinAudio);
  }

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
