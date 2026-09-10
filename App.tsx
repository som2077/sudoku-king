import { StatusBar } from "expo-status-bar";
import { Text } from "./src/components/Text";
import {
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  InteractionManager,
  StyleSheet,
} from "react-native";
import {
  SafeAreaView,
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useEffect, useState, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { StatusBar as NativeStatusBar } from "react-native";
import { getAnalytics, logEvent } from "@react-native-firebase/analytics";
import Purchases from "react-native-purchases";
import RevenueCatUI from "react-native-purchases-ui";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import Board from "./src/components/Board";
import Keypad from "./src/components/Keypad";
import TopBar from "./src/components/TopBar";
import HomeScreen from "./src/screens/HomeScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import Paywall from "./src/components/ui/Paywall";
import { useGameStore } from "./src/store/useGameStore";
import { LinearGradient } from "expo-linear-gradient";
import { Difficulty } from "./src/utils/sudokuLogic";
import { purchaseService } from "./src/services/purchaseService";
import {
  useFonts,
  BricolageGrotesque_400Regular,
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from "@expo-google-fonts/bricolage-grotesque";
import {
  BANNER_AD_UNIT_ID,
  showRewardedAd as adManagerShowRewarded,
  showInterstitialAd as adManagerShowInterstitial,
} from "./src/services/adManager";
import InAppNotificationBanner from "./src/components/InAppNotificationBanner";
import TutorialOverlay from "./src/components/game/TutorialOverlay";
import {
  notificationService,
  type NotificationPayload,
} from "./src/services/notificationService";
import { localNotificationScheduler } from "./src/services/localNotificationScheduler";

function BottomBannerAd({
  isPremium,
  bannerLoaded,
  setBannerLoaded,
}: {
  isPremium: boolean;
  bannerLoaded: boolean;
  setBannerLoaded: (loaded: boolean) => void;
}) {
  const insets = useSafeAreaInsets();
  if (isPremium) return null;

  return (
    <View
      style={[
        styles.bannerAdSlot,
        { paddingBottom: Math.max(insets.bottom, 6) },
      ]}
    >
      <BannerAd
        unitId={BANNER_AD_UNIT_ID}
        size={BannerAdSize.BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdLoaded={() => {
          setBannerLoaded(true);
          console.log("🔥 [BannerAd] Loaded successfully");
        }}
        onAdFailedToLoad={(error) => {
          setBannerLoaded(false);
          console.log("⚠️ [BannerAd] Failed to load:", error);
        }}
      />
      {!bannerLoaded && (
        <View style={styles.bannerPlaceholder}>
          <Text style={styles.bannerPlaceholderText}>Banner Ad (320×50)</Text>
        </View>
      )}
    </View>
  );
}

export default function App() {
  const {
    screen,
    setScreen,
    mistakes,
    secondChance,
    isPremium,
    setPremium,
    fetchRemoteConfig,
    history,
    startNewGame,
    addHint,
    useHint,
    currentDailyChallenge,
    completeDailyChallenge,
    difficulty,
    recordGameWon,
    startDailyChallenge,
    hasSeenWelcome,
    completeWelcome,
    resetWelcome,
    hasCompletedOnboarding,
    completeOnboarding,
    totalPlayed,
    hasCompletedTutorial,
    hasSkippedTutorial,
    completeTutorial,
    skipTutorial,
  } = useGameStore(
    useShallow((state) => ({
      screen: state.screen,
      setScreen: state.setScreen,
      mistakes: state.mistakes,
      secondChance: state.secondChance,
      isPremium: state.isPremium,
      setPremium: state.setPremium,
      fetchRemoteConfig: state.fetchRemoteConfig,
      history: state.history,
      startNewGame: state.startNewGame,
      addHint: state.addHint,
      useHint: state.useHint,
      currentDailyChallenge: state.currentDailyChallenge,
      completeDailyChallenge: state.completeDailyChallenge,
      difficulty: state.difficulty,
      recordGameWon: state.recordGameWon,
      startDailyChallenge: state.startDailyChallenge,
      hasSeenWelcome: state.hasSeenWelcome,
      completeWelcome: state.completeWelcome,
      resetWelcome: state.resetWelcome,
      hasCompletedOnboarding: state.hasCompletedOnboarding,
      completeOnboarding: state.completeOnboarding,
      totalPlayed: state.totalPlayed,
      hasCompletedTutorial: state.hasCompletedTutorial,
      hasSkippedTutorial: state.hasSkippedTutorial,
      completeTutorial: state.completeTutorial,
      skipTutorial: state.skipTutorial,
    })),
  );

  // Subscribe to derived booleans instead of the full 81-cell board. This
  // keeps the root screen stable while the player enters numbers.
  const isGameWon = useGameStore(
    (state) =>
      state.board.length > 0 &&
      state.board.every((cell) => cell.value !== null && !cell.isError) &&
      state.mistakes < 3,
  );
  const isBoardEmpty = useGameStore(
    (state) =>
      state.board.length !== 81 || state.board.every((cell) => cell.value === null),
  );

  const isGameOver = mistakes >= 3;

  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [foregroundNotification, setForegroundNotification] =
    useState<NotificationPayload | null>(null);
  const [showCustomPaywall, setShowCustomPaywall] = useState(false);
  const [pendingOnboardingDiff, setPendingOnboardingDiff] = useState<Difficulty | null>(null);

  const handleNotificationAction = (payload: NotificationPayload) => {
    console.log("🎯 [Notification Action Handler]:", payload);
    const action = payload.data?.action || payload.data?.screen;
    if (
      action === "daily" ||
      payload.title?.toLowerCase().includes("daily") ||
      payload.data?.slotId?.includes("streak") ||
      payload.data?.slotId?.includes("morning")
    ) {
      const todayStr = new Date().toISOString().split("T")[0];
      startDailyChallenge(todayStr);
    } else if (action === "quick_game" || action === "play") {
      const diff = (payload.data?.difficulty as any) || "easy";
      startNewGame(diff);
    } else {
      setScreen("home");
    }
  };

  const [fontsLoaded] = useFonts({
    BricolageGrotesque_400Regular,
    BricolageGrotesque_500Medium,
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
  });

  useEffect(() => {
    if (screen === "playing") {
      NativeStatusBar.setBarStyle("light-content");
    } else {
      NativeStatusBar.setBarStyle("dark-content");
    }
    NativeStatusBar.setBackgroundColor("transparent", true);
    NativeStatusBar.setTranslucent(true);

    let responseSubscription: { remove: () => void } | null = null;
    const interactionTask = InteractionManager.runAfterInteractions(() => {
      fetchRemoteConfig();
      purchaseService.initialize().catch((err) => {
        console.warn("⚠️ [RevenueCat] Initialization error:", err);
      });

      // Initialize Firebase Cloud Messaging Push Notifications
      notificationService.initialize(
        (payload) => handleNotificationAction(payload),
        (payload) => setForegroundNotification(payload),
      );

      // Initialize Local 6 Daily Recurring Notifications
      try {
        const ExpoNotifications = require("expo-notifications");
        if (ExpoNotifications?.setNotificationHandler) {
          ExpoNotifications.setNotificationHandler({
            handleNotification: async () => ({
              shouldShowAlert: false,
              shouldPlaySound: true,
              shouldSetBadge: false,
              shouldShowBanner: false,
              shouldShowList: true,
            }),
          });
        }

        const { settings: currentSettings, hasCompletedOnboarding: isOnboarded } =
          useGameStore.getState();
        if (isOnboarded && currentSettings.notificationsEnabled) {
          localNotificationScheduler.scheduleDailyNotifications();
        }

        if (ExpoNotifications?.addNotificationResponseReceivedListener) {
          responseSubscription =
            ExpoNotifications.addNotificationResponseReceivedListener(
              (response: any) => {
                const content = response?.notification?.request?.content;
                if (content?.data) {
                  handleNotificationAction({
                    title: content.title ?? undefined,
                    body: content.body ?? undefined,
                    data: content.data as Record<string, string>,
                  });
                }
              },
            );
        }
      } catch (e) {
        console.log(
          "ℹ️ [Local Notifications] Scheduler waiting for native rebuild:",
          e,
        );
      }
    });

    return () => {
      interactionTask.cancel();
      responseSubscription?.remove?.();
    };
  }, []);

  const showRewardedAd = (onReward: () => void) => {
    adManagerShowRewarded(
      onReward,
      (errMsg) => Alert.alert("Ad Notice", errMsg),
      isPremium,
    );
  };

  const handleBackToHome = () => {
    if (isGameWon) {
      adManagerShowInterstitial(() => setScreen("home"), isPremium);
    } else {
      setScreen("home");
    }
  };

  const buyPremium = () => {
    setShowCustomPaywall(true);
  };

  const restorePurchases = async () => {
    return await purchaseService.restorePurchases();
  };

  const recordedWinRef = useRef<boolean>(false);
  const recordedLossRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isGameWon && !isGameOver) {
      recordedWinRef.current = false;
      recordedLossRef.current = false;
    }
  }, [isGameWon, isGameOver]);

  useEffect(() => {
    if (screen === "playing") {
      if (isBoardEmpty) {
        startNewGame(difficulty || "Medium");
      }
    }
  }, [screen, isBoardEmpty, difficulty, startNewGame]);

  useEffect(() => {
    const analytics = getAnalytics();
    if (isGameWon && !recordedWinRef.current) {
      recordedWinRef.current = true;
      const currentTimer = useGameStore.getState().timer;
      const currentMistakes = useGameStore.getState().mistakes;
      const curDaily = useGameStore.getState().currentDailyChallenge;
      const curDiff = useGameStore.getState().difficulty;

      console.log(
        `🔥 [Firebase Analytics] Logging Event: game_won (Time: ${currentTimer}s)`,
      );
      logEvent(analytics, "game_won", { time_taken: currentTimer });

      recordGameWon(curDiff, currentTimer);

      if (curDaily) {
        completeDailyChallenge(curDaily, currentTimer, currentMistakes);
      }
    } else if (isGameOver && !recordedLossRef.current) {
      recordedLossRef.current = true;
      const currentTimer = useGameStore.getState().timer;
      console.log(
        `🔥 [Firebase Analytics] Logging Event: game_lost (Time: ${currentTimer}s)`,
      );
      logEvent(analytics, "game_lost", { time_taken: currentTimer });
    }
  }, [isGameWon, isGameOver, completeDailyChallenge, recordGameWon]);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  const formatWinTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <InAppNotificationBanner
        notification={foregroundNotification}
        onPress={(payload) => handleNotificationAction(payload)}
        onDismiss={() => setForegroundNotification(null)}
      />
      {!hasSeenWelcome ? (
        <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
          <WelcomeScreen
            onGetStarted={() => {
              completeWelcome();
            }}
            onRestorePurchases={restorePurchases}
          />
        </View>
      ) : !hasCompletedOnboarding ? (
        <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
          <OnboardingScreen
            onBack={() => {
              resetWelcome();
            }}
            onFinish={(chosenDifficulty) => {
              setPendingOnboardingDiff(chosenDifficulty);
              setShowCustomPaywall(true);
            }}
          />
        </View>
      ) : screen === "home" ? (
        <HomeScreen
          setScreen={setScreen}
          startNewGame={startNewGame}
          history={history}
          isPremium={isPremium}
          setPremium={setPremium}
          onOpenPaywall={buyPremium}
          onRestorePurchases={restorePurchases}
        />
      ) : (
        <View style={{ flex: 1, backgroundColor: "#F5F7F9" }}>
          {/* ── Top Blue Section with Bottom-Left & Bottom-Right Rounded Corners ── */}
          <View style={styles.topBlueSection}>
            <LinearGradient
              colors={["#1E3A8A", "#2563EB", "#3B82F6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <TopBar
              showRewardedAd={showRewardedAd}
              onOpenPaywall={buyPremium}
            />
          </View>

          {/* ── Main Playing Area: Board, Keypad & Bottom Banner Ad ── */}
          <View style={styles.playingWhiteSheet}>
            <View style={styles.gameContentContainer}>
              <Board />
              <Keypad showRewardedAd={showRewardedAd} />
            </View>

            {/* ── Banner Ad Anchored to Bottom of Screen ── */}
            <BottomBannerAd
              isPremium={isPremium}
              bannerLoaded={bannerLoaded}
              setBannerLoaded={setBannerLoaded}
            />
          </View>

          {/* ── Win / Game Over Modal ── */}
          {(isGameOver || isGameWon) && (
            <View
              style={{
                position: "absolute",
                inset: 0,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.6)",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 50,
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 28,
                  padding: 32,
                  alignItems: "center",
                  width: "82%",
                  shadowColor: "#000",
                  shadowOpacity: 0.2,
                  shadowRadius: 24,
                  shadowOffset: { width: 0, height: 10 },
                  elevation: 12,
                }}
              >
                {/* Emoji circle */}
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 999,
                    backgroundColor: isGameWon
                      ? currentDailyChallenge
                        ? "#FEF3C7"
                        : "#DCFCE7"
                      : "#FEE2E2",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Text style={{ fontSize: 40 }}>
                    {isGameWon ? (currentDailyChallenge ? "👑" : "🏆") : "💀"}
                  </Text>
                </View>

                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "800",
                    color: "#1C1F2E",
                    marginBottom: 6,
                    textAlign: "center",
                  }}
                >
                  {isGameWon
                    ? currentDailyChallenge
                      ? "Daily Challenge Solved!"
                      : "You Win!"
                    : "Game Over"}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#6B7280",
                    textAlign: "center",
                    marginBottom: 28,
                  }}
                >
                  {isGameWon
                    ? currentDailyChallenge
                      ? `You solved ${currentDailyChallenge} in ${formatWinTime(useGameStore.getState().timer)}! Crown earned! 🎉`
                      : "Excellent job solving this puzzle! 🎉"
                    : "You made 3 mistakes. Better luck next time!"}
                </Text>

                {/* Second Chance (only on game over) */}
                {isGameOver && (
                  <TouchableOpacity
                    onPress={() => showRewardedAd(() => secondChance())}
                    style={{
                      backgroundColor: "#3B82F6",
                      borderRadius: 999,
                      paddingVertical: 14,
                      width: "100%",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontWeight: "800",
                        fontSize: 16,
                      }}
                    >
                      Second Chance {isPremium ? "" : "📺"}
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Home / New Game */}
                <TouchableOpacity
                  onPress={handleBackToHome}
                  style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: 999,
                    paddingVertical: 14,
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#1C1F2E",
                      fontWeight: "700",
                      fontSize: 16,
                    }}
                  >
                    Back to Home
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}

      <Paywall
        visible={showCustomPaywall}
        onClose={() => {
          setShowCustomPaywall(false);
          if (!hasCompletedOnboarding) {
            completeOnboarding(pendingOnboardingDiff || "Easy");
            setPendingOnboardingDiff(null);
          }
        }}
        onSuccess={() => {
          setShowCustomPaywall(false);
          if (!hasCompletedOnboarding) {
            completeOnboarding(pendingOnboardingDiff || "Easy");
            setPendingOnboardingDiff(null);
          }
        }}
      />
      <TutorialOverlay
        visible={
          screen === "playing" &&
          totalPlayed === 1 &&
          !hasCompletedTutorial &&
          !hasSkippedTutorial
        }
        onComplete={completeTutorial}
        onSkip={skipTutorial}
      />
      <StatusBar style={screen === "playing" ? "light" : "dark"} />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  topBlueSection: {
    width: "100%",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
    // shadowColor: "#1E3A8A",
    // shadowOpacity: 0.18,
    // shadowRadius: 12,
    // shadowOffset: { width: 0, height: 4 },
    // elevation: 8,
  },
  playingWhiteSheet: {
    flex: 1,
    backgroundColor: "#F5F7F9",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  gameContentContainer: {
    width: "100%",
    alignItems: "center",
  },
  bannerAdSlot: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    backgroundColor: "#F8FAFC",
  },
  bannerPlaceholder: {
    width: 320,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerPlaceholderText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: 0.3,
  },
});
