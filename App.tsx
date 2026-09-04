import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { StatusBar as NativeStatusBar } from 'react-native';
import { getAnalytics, logEvent } from '@react-native-firebase/analytics';
import Purchases from 'react-native-purchases';
import RevenueCatUI from 'react-native-purchases-ui';
import mobileAds, { BannerAd, BannerAdSize, TestIds, RewardedAd, RewardedAdEventType, AdEventType } from 'react-native-google-mobile-ads';
import Board from './src/components/Board';
import Keypad from './src/components/Keypad';
import TopBar from './src/components/TopBar';
import HomeScreen from './src/screens/HomeScreen';
import { useGameStore } from './src/store/useGameStore';

import { getBannerAdUnitId, getRewardedAdUnitId, getRevenueCatApiKey } from './src/utils/secrets';

// Initialize Ads
mobileAds().initialize().then(() => console.log('🔥 [AdMob] Initialized'));

const bannerAdUnitId = __DEV__ ? TestIds.BANNER : getBannerAdUnitId();
const rewardedAdUnitId = __DEV__ ? TestIds.REWARDED : getRewardedAdUnitId();

const rewarded = RewardedAd.createForAdRequest(rewardedAdUnitId);

export default function App() {
  const { startNewGame, mistakes, board, screen, setScreen, history, timer, fetchRemoteConfig, isPremium, setPremium, secondChance, addHint, useHint } = useGameStore();

  const isGameOver = mistakes >= 3;
  const isGameWon = board.length > 0 && board.every(cell => cell.value !== null && !cell.isError) && mistakes < 3;

  const [rewardedLoaded, setRewardedLoaded] = useState(false);
  const [adCallback, setAdCallback] = useState<(() => void) | null>(null);
  const [adShowing, setAdShowing] = useState(false);

  useEffect(() => {
    NativeStatusBar.setBarStyle('dark-content');
    NativeStatusBar.setBackgroundColor('#F9F9FB', true);

    fetchRemoteConfig();

    // RevenueCat Initialization
    // Disable debug logs to stop terminal spam
    // Purchases.setLogLevel(LOG_LEVEL.DEBUG);

    const rcKey = getRevenueCatApiKey();
    if (rcKey && rcKey !== "goog_REPLACE_WITH_REAL_API_KEY") {
      Purchases.configure({ apiKey: rcKey });
    } else {
      console.log("⚠️ [RevenueCat] Skipping initialization: Real API key not set yet.");
    }

    const checkPremiumStatus = async () => {
      try {
        if (rcKey && rcKey !== "goog_REPLACE_WITH_REAL_API_KEY") {
          const customerInfo = await Purchases.getCustomerInfo();
          if (typeof customerInfo.entitlements.active['Premium'] !== "undefined") {
            setPremium(true);
          }
        }
      } catch (e) {
        // Silently ignore if not configured properly
      }
    };
    checkPremiumStatus();
  }, []);

  // AdMob Rewarded Listener
  useEffect(() => {
    if (isPremium) return;
    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setRewardedLoaded(true);
    });
    const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
      console.log('User earned reward of ', reward);
      if (adCallback) {
        adCallback();
        setAdCallback(null);
      }
    });
    const unsubscribeClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      setRewardedLoaded(false);
      setAdShowing(false);
      rewarded.load(); // preload next
    });

    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
    };
  }, [isPremium, adCallback]);

  const showRewardedAd = (onReward: () => void) => {
    if (isPremium) {
      onReward();
      return;
    }
    if (rewardedLoaded) {
      setAdCallback(() => onReward);
      setAdShowing(true);
      rewarded.show();
    } else {
      Alert.alert('Ad not ready', 'Please wait a moment for the video to load.');
      rewarded.load();
    }
  };

  const buyPremium = async () => {
    try {
      const rcKey = getRevenueCatApiKey();
      if (!rcKey || rcKey === "goog_REPLACE_WITH_REAL_API_KEY") {
        Alert.alert("Store Not Ready", "RevenueCat API Key not set. Unlocking for testing.", [
          { text: "OK", onPress: () => { setPremium(true); } }
        ]);
        return;
      }

      const paywallResult = await RevenueCatUI.presentPaywall();

      if (paywallResult === RevenueCatUI.PAYWALL_RESULT.PURCHASED) {
        setPremium(true);
        Alert.alert("Success", "Thank you! You are now Premium.");
      } else if (paywallResult === RevenueCatUI.PAYWALL_RESULT.RESTORED) {
        setPremium(true);
        Alert.alert("Success", "Purchases successfully restored.");
      }
    } catch (e: any) {
      Alert.alert("Error", "Something went wrong loading the paywall.");
    }
  };

  const restorePurchases = async () => {
    try {
      const rcKey = getRevenueCatApiKey();
      if (!rcKey || rcKey === "goog_REPLACE_WITH_REAL_API_KEY") {
        Alert.alert("Dev Mode", "Skipping restore (No API Key).");
        return;
      }

      const customerInfo = await Purchases.restorePurchases();
      if (typeof customerInfo.entitlements.active['Premium'] !== "undefined") {
        setPremium(true);
        Alert.alert("Success", "Purchases successfully restored.");
      } else {
        Alert.alert("Not Found", "No previous purchases found.");
      }
    } catch (e) {
      Alert.alert("Error", "Failed to restore purchases.");
    }
  };

  useEffect(() => {
    const analytics = getAnalytics();
    if (isGameWon) {
      console.log(`🔥 [Firebase Analytics] Logging Event: game_won (Time: ${timer}s)`);
      logEvent(analytics, 'game_won', { time_taken: timer });
    } else if (isGameOver) {
      console.log(`🔥 [Firebase Analytics] Logging Event: game_lost (Time: ${timer}s)`);
      logEvent(analytics, 'game_lost', { time_taken: timer });
    }
  }, [isGameWon, isGameOver, timer]);

  if (screen === 'home') {
    return (
      <HomeScreen
        setScreen={setScreen}
        startNewGame={startNewGame}
        history={history}
        isPremium={isPremium}
        setPremium={setPremium}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center relative ">
          <TopBar showRewardedAd={showRewardedAd} />
          <Board />
          <Keypad showRewardedAd={showRewardedAd} />

          {(isGameOver || isGameWon) && (
            <View className="absolute inset-0 bg-black/60 items-center justify-center z-50">
              <View className="bg-white p-8 rounded-3xl items-center shadow-lg w-4/5">
                <Text className={`text-4xl font-bold mb-4 ${isGameWon ? 'text-green-500' : 'text-red-500'}`}>
                  {isGameWon ? 'You Win!' : 'Game Over'}
                </Text>
                <Text className="text-gray-600 text-lg mb-8 text-center">
                  {isGameWon ? 'Excellent job solving this puzzle!' : 'You made 3 mistakes.'}
                </Text>

                {isGameOver && (
                  <TouchableOpacity
                    onPress={() => showRewardedAd(() => secondChance())}
                    className="bg-blue-500 px-8 py-3 rounded-full mb-4 w-full items-center"
                  >
                    <Text className="text-white font-bold text-xl">Second Chance {isPremium ? '' : '📺'}</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => setScreen('home')} className="bg-gray-200 px-8 py-3 rounded-full w-full items-center">
                  <Text className="text-gray-700 font-bold text-xl">New Game</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* AdMob Banner at bottom */}
          {!isPremium && (
            <View className="absolute bottom-0 w-full items-center justify-center bg-[#E2E8F0] h-[70px]">
              <BannerAd
                unitId={bannerAdUnitId}
                size={BannerAdSize.BANNER}
                requestOptions={{
                  requestNonPersonalizedAdsOnly: true,
                }}
              />
            </View>
          )}

          {adShowing && (
            <View className="absolute inset-0 bg-black/80 items-center justify-center z-50">
              <ActivityIndicator size="large" color="#ffffff" />
              <Text className="text-white mt-4 font-bold text-lg">Loading Ad...</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
