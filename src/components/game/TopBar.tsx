import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  Switch,
  Vibration,
  BackHandler,
} from "react-native";
import { Text } from "../ui/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGameStore, GameSettings } from "../../store/useGameStore";
import {
  ChevronLeft,
  Pause,
  Settings,
  RotateCcw,
  Eraser,
  Pencil,
  Lightbulb,
  X,
  Volume2,
  Vibrate,
  Eye,
  Grid,
  Sparkles,
  Clock,
} from "lucide-react-native";
import { useTranslation } from "../../i18n";

const TimerText = React.memo(function TimerText() {
  const timer = useGameStore((s) => s.timer);
  const timerVisible = useGameStore((s) => s.settings?.timerVisible ?? true);
  if (!timerVisible) return <Text style={styles.timerText}>{""}</Text>;
  const m = Math.floor(timer / 60).toString().padStart(2, "0");
  const s = (timer % 60).toString().padStart(2, "0");
  return <Text style={styles.timerText}>{`${m}:${s}`}</Text>;
});

const PauseTimerText = React.memo(function PauseTimerText() {
  const timer = useGameStore((s) => s.timer);
  const m = Math.floor(timer / 60).toString().padStart(2, "0");
  const s = (timer % 60).toString().padStart(2, "0");
  return <Text style={styles.pauseSubtitle}>{`${m}:${s}`}</Text>;
});

export default function TopBar({
  showRewardedAd,
  onOpenPaywall,
}: {
  showRewardedAd: (cb: () => void) => void;
  onOpenPaywall?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const mistakes = useGameStore((s) => s.mistakes);
  const setScreen = useGameStore((s) => s.setScreen);
  const difficulty = useGameStore((s) => s.difficulty);
  const currentDailyChallenge = useGameStore((s) => s.currentDailyChallenge);
  const board = useGameStore((s) => s.board);
  const settings = useGameStore((s) => s.settings);
  const updateSetting = useGameStore((s) => s.updateSetting);
  const undo = useGameStore((s) => s.undo);
  const erase = useGameStore((s) => s.erase);
  const isNotesMode = useGameStore((s) => s.isNotesMode);
  const toggleNotesMode = useGameStore((s) => s.toggleNotesMode);
  const hintsRemaining = useGameStore((s) => s.hintsRemaining);
  const useHint = useGameStore((s) => s.useHint);
  const isPremium = useGameStore((s) => s.isPremium);
  const addHint = useGameStore((s) => s.addHint);

  const { t } = useTranslation();
  const [isPaused, setIsPaused] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const isGameOver = mistakes >= 3;
  const isGameWon =
    board.length > 0 &&
    board.every((cell) => cell.value !== null && !cell.isError) &&
    mistakes < 3;

  // ── Timer Interval ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPaused || isGameOver || isGameWon || isLeaveModalOpen) return;
    const interval = setInterval(() => {
      useGameStore.setState((state) => ({ timer: state.timer + 1 }));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, isGameOver, isGameWon, isLeaveModalOpen]);

  // ── Android Hardware Back Button ────────────────────────────────────────────
  useEffect(() => {
    const onBackPress = () => {
      if (isSettingsOpen) {
        setIsSettingsOpen(false);
        return true;
      }
      if (isPaused) {
        setIsPaused(false);
        return true;
      }
      if (isLeaveModalOpen) {
        setIsLeaveModalOpen(false);
        return true;
      }
      setIsLeaveModalOpen(true);
      return true;
    };

    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [isSettingsOpen, isPaused, isLeaveModalOpen]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const confirmBack = () => {
    setIsLeaveModalOpen(true);
  };

  const handleHintClick = () => {
    if (isPremium || hintsRemaining > 0) {
      useHint();
    } else {
      Alert.alert(
        t('game.outOfHints'),
        t('game.watchAdPrompt'),
        [
          { text: t('game.cancel'), style: "cancel" },
          ...(onOpenPaywall
            ? [
                {
                  text: "Unlock Infinite Hints (VIP)",
                  onPress: onOpenPaywall,
                },
              ]
            : []),
          {
            text: t('game.watchAd'),
            onPress: () =>
              showRewardedAd(() => {
                addHint();
                setTimeout(useHint, 500);
              }),
          },
        ],
        { cancelable: true },
      );
    }
  };

  const handleToggleSetting = <K extends keyof GameSettings>(
    key: K,
    val: GameSettings[K],
  ) => {
    updateSetting(key, val);
    if (key === "vibrationEnabled" && val) {
      Vibration.vibrate(40);
    }
  };

  const getDifficultyTitle = (diff?: string) => {
    switch (diff) {
      case "Easy":
        return t("diff.easy");
      case "Medium":
        return t("diff.medium");
      case "Hard":
        return t("diff.hard");
      case "Expert":
        return t("diff.expert");
      case "Master":
        return t("diff.master");
      default:
        return diff || "";
    }
  };

  return (
    <>
      <View
        style={[styles.container, { paddingTop: Math.max(insets.top + 8, 20) }]}
      >
        {/* ── Row 1: Back Button | (Space) | Pause, Settings ── */}
        <View style={styles.navRow}>
          <TouchableOpacity
            onPress={confirmBack}
            style={styles.pillButton}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>

          <View style={styles.rightActions}>
            <TouchableOpacity
              onPress={() => setIsPaused(true)}
              style={styles.pillButton}
              activeOpacity={0.7}
            >
              <Pause size={20} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsSettingsOpen(true)}
              style={styles.pillButton}
              activeOpacity={0.7}
            >
              <Settings size={20} color="#FFFFFF" strokeWidth={2.2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Row 2: Difficulty | Mistakes: X/3 | Timer ── */}
        <View style={styles.statsRow}>
          <Text style={styles.difficultyText}>
            {currentDailyChallenge
              ? `${t("tabs.daily")} · ${getDifficultyTitle(difficulty)}`
              : getDifficultyTitle(difficulty)}
          </Text>

          <Text style={styles.mistakesText}>{t('game.mistakes')}: {mistakes}/3</Text>

          <TimerText />
        </View>

        {/* ── Row 3: Action Tool Cards (Undo | Eraser | Pencil | Hint) ── */}
        <View style={styles.toolsRow}>
          {/* Undo Card */}
          <TouchableOpacity
            onPress={undo}
            style={styles.toolCard}
            activeOpacity={0.7}
          >
            <RotateCcw size={22} color="#FFFFFF" strokeWidth={2.2} />
            <Text style={styles.toolLabel}>{t('game.undo')}</Text>
          </TouchableOpacity>

          {/* Eraser Card */}
          <TouchableOpacity
            onPress={erase}
            style={styles.toolCard}
            activeOpacity={0.7}
          >
            <Eraser size={22} color="#FFFFFF" strokeWidth={2.2} />
            <Text style={styles.toolLabel}>{t('game.eraser')}</Text>
          </TouchableOpacity>

          {/* Pencil (Notes) Card */}
          <TouchableOpacity
            onPress={toggleNotesMode}
            style={[styles.toolCard, isNotesMode && styles.toolCardActive]}
            activeOpacity={0.7}
          >
            <Pencil
              size={22}
              color={isNotesMode ? "#2563EB" : "#FFFFFF"}
              strokeWidth={2.2}
            />
            <Text
              style={[styles.toolLabel, isNotesMode && styles.toolLabelActive]}
            >
              {t('game.pencil')}
            </Text>
          </TouchableOpacity>

          {/* Hint Card */}
          <TouchableOpacity
            onPress={handleHintClick}
            style={styles.toolCard}
            activeOpacity={0.7}
          >
            <View style={styles.hintIconWrapper}>
              <Lightbulb size={22} color="#FFFFFF" strokeWidth={2.2} />
              <View style={styles.hintBadge}>
                <Text style={styles.hintBadgeText}>
                  {isPremium ? "∞" : hintsRemaining > 0 ? hintsRemaining : "📺"}
                </Text>
              </View>
            </View>
            <Text style={styles.toolLabel}>{t('game.hint')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Pause Modal ── */}
      <Modal transparent visible={isPaused} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.pauseCard}>
            <View style={styles.pauseIconCircle}>
              <Pause size={36} color="#2563EB" strokeWidth={2.5} />
            </View>
            <Text style={styles.pauseTitle}>{t('game.paused')}</Text>
            <PauseTimerText />
            <TouchableOpacity
              onPress={() => setIsPaused(false)}
              style={styles.resumeBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.resumeBtnText}>{t('game.resume')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsPaused(false);
                setScreen("home");
              }}
              style={styles.leaveGameBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.leaveGameBtnText}>{t('game.saveQuit')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Quick In-Game Settings Modal ── */}
      <Modal transparent visible={isSettingsOpen} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.settingsCard}>
            <View style={styles.settingsHeader}>
              <Text style={styles.settingsTitle}>{t('game.settingsTitle')}</Text>
              <TouchableOpacity
                onPress={() => setIsSettingsOpen(false)}
                style={styles.closeBtn}
                activeOpacity={0.7}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.settingsList}>
              {/* Sound */}
              <View style={styles.settingRow}>
                <View style={styles.settingLabelWrap}>
                  <Volume2 size={18} color="#2563EB" />
                  <Text style={styles.settingLabel}>{t('settings.sound')}</Text>
                </View>
                <Switch
                  value={settings?.soundEnabled ?? true}
                  onValueChange={(val) =>
                    handleToggleSetting("soundEnabled", val)
                  }
                  trackColor={{ false: "#E2E8F0", true: "#93C5FD" }}
                  thumbColor={
                    (settings?.soundEnabled ?? true) ? "#2563EB" : "#F8FAFC"
                  }
                />
              </View>

              {/* Vibration */}
              <View style={styles.settingRow}>
                <View style={styles.settingLabelWrap}>
                  <Vibrate size={18} color="#2563EB" />
                  <Text style={styles.settingLabel}>{t('settings.vibration')}</Text>
                </View>
                <Switch
                  value={settings?.vibrationEnabled ?? true}
                  onValueChange={(val) =>
                    handleToggleSetting("vibrationEnabled", val)
                  }
                  trackColor={{ false: "#E2E8F0", true: "#93C5FD" }}
                  thumbColor={
                    (settings?.vibrationEnabled ?? true) ? "#2563EB" : "#F8FAFC"
                  }
                />
              </View>

              {/* Highlight Areas */}
              <View style={styles.settingRow}>
                <View style={styles.settingLabelWrap}>
                  <Grid size={18} color="#2563EB" />
                  <Text style={styles.settingLabel}>{t('settings.highlightAreas')}</Text>
                </View>
                <Switch
                  value={settings?.highlightAreas ?? true}
                  onValueChange={(val) =>
                    handleToggleSetting("highlightAreas", val)
                  }
                  trackColor={{ false: "#E2E8F0", true: "#93C5FD" }}
                  thumbColor={
                    (settings?.highlightAreas ?? true) ? "#2563EB" : "#F8FAFC"
                  }
                />
              </View>

              {/* Highlight Same Numbers */}
              <View style={styles.settingRow}>
                <View style={styles.settingLabelWrap}>
                  <Sparkles size={18} color="#2563EB" />
                  <Text style={styles.settingLabel}>
                    {t('settings.highlightSameNumbers')}
                  </Text>
                </View>
                <Switch
                  value={settings?.highlightSameNumbers ?? true}
                  onValueChange={(val) =>
                    handleToggleSetting("highlightSameNumbers", val)
                  }
                  trackColor={{ false: "#E2E8F0", true: "#93C5FD" }}
                  thumbColor={
                    (settings?.highlightSameNumbers ?? true)
                      ? "#2563EB"
                      : "#F8FAFC"
                  }
                />
              </View>

              {/* Show Timer */}
              <View style={styles.settingRow}>
                <View style={styles.settingLabelWrap}>
                  <Clock size={18} color="#2563EB" />
                  <Text style={styles.settingLabel}>{t('settings.showTimer')}</Text>
                </View>
                <Switch
                  value={settings?.timerVisible ?? true}
                  onValueChange={(val) =>
                    handleToggleSetting("timerVisible", val)
                  }
                  trackColor={{ false: "#E2E8F0", true: "#93C5FD" }}
                  thumbColor={
                    (settings?.timerVisible ?? true) ? "#2563EB" : "#F8FAFC"
                  }
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setIsSettingsOpen(false)}
              style={styles.doneBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.doneBtnText}>{t('game.done')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Leave Game Confirmation Modal (Matches User Reference UI) ── */}
      <Modal
        transparent
        visible={isLeaveModalOpen}
        animationType="fade"
        onRequestClose={() => setIsLeaveModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setIsLeaveModalOpen(false)}
          />
          <View style={styles.leaveDialogCard}>
            <Text style={styles.leaveDialogTitle}>{t('game.leaveTitle')}</Text>
            <Text style={styles.leaveDialogMessage}>
              {t('game.leaveMessage')}
            </Text>

            <TouchableOpacity
              onPress={() => {
                setIsLeaveModalOpen(false);
                setScreen("home");
              }}
              style={styles.leaveDialogOkBtn}
              activeOpacity={0.85}
            >
              <Text style={styles.leaveDialogOkText}>{t('game.ok')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsLeaveModalOpen(false)}
              style={styles.leaveDialogCancelBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.leaveDialogCancelText}>{t('game.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 14,
    gap: 14,
  },

  // ── Row 1: Nav ──────────────────────────────────────────────────────────────
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pillButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  // ── Row 2: Stats ────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  difficultyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  mistakesText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.2,
    fontVariant: ["tabular-nums"],
  },
  timerText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
    minWidth: 48,
    textAlign: "right",
    fontVariant: ["tabular-nums"],
  },

  // ── Row 3: Tools ────────────────────────────────────────────────────────────
  toolsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  toolCard: {
    flex: 1,
    height: 68,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  toolCardActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  toolLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  toolLabelActive: {
    color: "#2563EB",
    fontWeight: "700",
  },

  // Hint badge
  hintIconWrapper: {
    position: "relative",
  },
  hintBadge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  hintBadgeText: {
    color: "#2563EB",
    fontSize: 9,
    fontWeight: "900",
  },

  // ── Pause Modal ─────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  pauseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    width: "84%",
    maxWidth: 340,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  pauseIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  pauseTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 4,
  },
  pauseSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 24,
  },
  resumeBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 16,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  resumeBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
  leaveGameBtn: {
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  leaveGameBtnText: {
    color: "#475569",
    fontWeight: "700",
    fontSize: 15,
  },

  // ── Settings Modal ──────────────────────────────────────────────────────────
  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "88%",
    maxWidth: 360,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  settingsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  settingsList: {
    gap: 12,
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  settingLabelWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
  },
  doneBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 16,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
  },
  doneBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },

  // ── Leave Game Dialog Modal (Matches User Reference UI) ──────────────────────
  leaveDialogCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingTop: 32,
    paddingBottom: 22,
    paddingHorizontal: 24,
    width: "84%",
    maxWidth: 320,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  leaveDialogTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
    marginBottom: 10,
  },
  leaveDialogMessage: {
    fontSize: 15,
    fontWeight: "400",
    color: "#67686F",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 26,
    paddingHorizontal: 6,
  },
  leaveDialogOkBtn: {
    backgroundColor: "#3386EC",
    borderRadius: 26,
    height: 52,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3386EC",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  leaveDialogOkText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 17,
  },
  leaveDialogCancelBtn: {
    marginTop: 14,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  leaveDialogCancelText: {
    color: "#3386EC",
    fontWeight: "700",
    fontSize: 16,
  },
});
