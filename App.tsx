import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { getAnalytics, logEvent } from '@react-native-firebase/analytics';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import mobileAds, { BannerAd, BannerAdSize, TestIds, RewardedAd, RewardedAdEventType, AdEventType } from 'react-native-google-mobile-ads';
import Board from './src/components/Board';
import Keypad from './src/components/Keypad';
import TopBar from './src/components/TopBar';
import { useGameStore } from './src/store/useGameStore';

// Initialize Ads
mobileAds().initialize().then(() => console.log('🔥 [AdMob] Initialized'));

const rewarded = RewardedAd.createForAdRequest(TestIds.REWARDED);

export default function App() {
  const { startNewGame, mistakes, board, screen, setScreen, history, timer, fetchRemoteConfig, isPremium, setPremium, secondChance, addHint, useHint } = useGameStore();

  const isGameOver = mistakes >= 3;
  const isGameWon = board.length > 0 && board.every(cell => cell.value !== null && !cell.isError) && mistakes < 3;

  const [rewardedLoaded, setRewardedLoaded] = useState(false);
  const [adCallback, setAdCallback] = useState<(() => void) | null>(null);
  const [adShowing, setAdShowing] = useState(false);

  useEffect(() => {
    fetchRemoteConfig();
    
    // RevenueCat Initialization
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    Purchases.configure({ apiKey: "goog_REPLACE_WITH_REAL_API_KEY" });

    const checkPremiumStatus = async () => {
      try {
        const customerInfo = await Purchases.getCustomerInfo();
        if (typeof customerInfo.entitlements.active['Premium'] !== "undefined") {
          setPremium(true);
        }
      } catch (e) {
        console.log("Error fetching customer info", e);
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
    const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      if (adCallback) adCallback();
    });
    const unsubscribeClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      setRewardedLoaded(false);
      setAdShowing(false);
      setAdCallback(null);
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
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null && offerings.current.lifetime !== null) {
        const purchaseMade = await Purchases.purchasePackage(offerings.current.lifetime);
        if (typeof purchaseMade.customerInfo.entitlements.active['Premium'] !== "undefined") {
          setPremium(true);
          Alert.alert("Success", "Thank you! You are now Premium.");
        }
      } else {
        // Fallback for development/testing when products aren't set up
        Alert.alert("Store Not Ready", "Products are not configured in Google Play Console yet. Unlocking for testing.", [
          { text: "OK", onPress: () => setPremium(true) }
        ]);
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert("Error", "Purchase failed. Please try again.");
      }
    }
  };

  const restorePurchases = async () => {
    try {
      const restore = await Purchases.restorePurchases();
      if (typeof restore.entitlements.active['Premium'] !== "undefined") {
        setPremium(true);
        Alert.alert("Success", "Purchases restored successfully!");
      } else {
        Alert.alert("Info", "No previous purchases found.");
      }
    } catch (e) {
      Alert.alert("Error", "Restore failed.");
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
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
          <Text className="text-5xl font-bold text-blue-600 mb-2">Sudoku King</Text>
          <Text className="text-gray-500 mb-8">Train your brain, stay sharp.</Text>

          {!isPremium && (
            <View className="mb-8 items-center w-full px-8">
              <TouchableOpacity onPress={buyPremium} className="bg-yellow-400 w-full py-4 rounded-2xl mb-3 shadow-sm items-center border border-yellow-500">
                <Text className="text-yellow-900 font-bold text-lg">👑 Get Premium</Text>
                <Text className="text-yellow-800 text-xs mt-1">No Ads & Unlimited Hints</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={restorePurchases}>
                <Text className="text-gray-400 text-sm font-medium underline">Restore Purchases</Text>
              </TouchableOpacity>
            </View>
          )}

          {isPremium && (
            <View className="mb-8 items-center w-full px-8">
              <View className="bg-yellow-100 w-full py-3 rounded-2xl items-center border border-yellow-300">
                <Text className="text-yellow-700 font-bold text-md">👑 Premium Unlocked</Text>
              </View>
            </View>
          )}

          {history.length > 0 && (
            <TouchableOpacity onPress={() => setScreen('playing')} className="bg-orange-500 px-12 py-4 rounded-full mb-6 shadow-md w-3/4 items-center">
              <Text className="text-white font-bold text-xl">Continue Game</Text>
            </TouchableOpacity>
          )}

          <Text className="text-gray-400 mb-4 font-bold tracking-wider">NEW GAME</Text>
          <View className="flex-row flex-wrap justify-center gap-4 px-8">
            {['Fast', 'Easy', 'Medium', 'Hard', 'Expert'].map(diff => (
              <TouchableOpacity key={diff} onPress={() => startNewGame(diff as any)} className="bg-white border border-blue-500 px-6 py-3 rounded-full shadow-sm w-[42%] items-center">
                <Text className="text-blue-600 font-bold text-lg">{diff}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <StatusBar style="auto" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center mt-10">
          <View className="flex-row w-full px-4 justify-between items-center mb-2">
            <TouchableOpacity onPress={() => setScreen('home')}>
              <Text className="text-blue-600 font-bold text-lg">← Back</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-blue-600">Sudoku King</Text>
            <View className="w-12"></View>
          </View>

          <TopBar showRewardedAd={showRewardedAd} />
          <Board />
          <Keypad showRewardedAd={showRewardedAd} />
          <StatusBar style="auto" />

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
            <View className="absolute bottom-0 w-full items-center pb-2 bg-gray-50">
              <BannerAd
                unitId={TestIds.BANNER}
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
    </SafeAreaProvider>
  );
}
