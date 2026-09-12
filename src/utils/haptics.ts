import { Vibration, Platform } from "react-native";
import { createAudioPlayer, preload, setAudioModeAsync } from "expo-audio";
import { useGameStore } from "../store/useGameStore";

const TAP_SOUND = require("../../assets/taps.mp3");
const BLOCK_COMPLETE_SOUND = require("../../assets/blockComplete.mp3");
const GAME_WIN_SOUND = require("../../assets/gameWin.mp3");

let tapAudio: ReturnType<typeof createAudioPlayer> | null = null;
let blockCompleteAudio: ReturnType<typeof createAudioPlayer> | null = null;
let gameWinAudio: ReturnType<typeof createAudioPlayer> | null = null;
let audioModeConfigured = false;

// The board is tapped frequently, so keep its short sound ready before the
// first interaction instead of loading it during a cell press.
void preload(TAP_SOUND).catch(() => {});

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

  private playSound(player: any) {
    if (!this.isSoundEnabled() || !player) return;

    try {
      if (player.isLoaded) {
        player.seekTo(0);
      }
      player.play();
    } catch {
      try {
        player.play();
      } catch {}
    }
  }

  private configureAudioMode() {
    if (audioModeConfigured) return;
    audioModeConfigured = true;
    void setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }

  tapSound() {
    this.configureAudioMode();
    tapAudio ??= createAudioPlayer(TAP_SOUND);
    this.playSound(tapAudio);
  }

  blockCompleteSound() {
    this.configureAudioMode();
    blockCompleteAudio ??= createAudioPlayer(BLOCK_COMPLETE_SOUND);
    this.playSound(blockCompleteAudio);
  }

  gameWinSound() {
    this.configureAudioMode();
    gameWinAudio ??= createAudioPlayer(GAME_WIN_SOUND);
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
