import { StatusBar } from 'expo-status-bar';
import { Text } from './src/components/Text';
import { View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState, useRef } from 'react';
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
import { AppGradientBackground } from './src/components/AppGradientBackground';

import { getBannerAdUnitId, getRewardedAdUnitId, getRevenueCatApiKey } from './src/utils/secrets';

import {
  useFonts,
  BricolageGrotesque_400Regular,
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from '@expo-google-fonts/bricolage-grotesque';

// Initialize Ads
mobileAds().initialize().then(() => console.log('🔥 [AdMob] Initialized'));

const bannerAdUnitId = __DEV__ ? TestIds.BANNER : getBannerAdUnitId();
const rewardedAdUnitId = __DEV__ ? TestIds.REWARDED : getRewardedAdUnitId();

const rewarded = RewardedAd.createForAdRequest(rewardedAdUnitId);

export default function App() {
  const {
    screen, setScreen,
    mistakes, board, secondChance, timer,
    isPremium, setPremium, fetchRemoteConfig,
    history, startNewGame, addHint, useHint,
    currentDailyChallenge, completeDailyChallenge,
    difficulty, recordGameWon
  } = useGameStore();

  const isGameOver = mistakes >= 3;
  const isGameWon = board.length > 0 && board.every(cell => cell.value !== null && !cell.isError) && mistakes < 3;

  const [rewardedLoaded, setRewardedLoaded] = useState(false);
  const adCallbackRef = useRef<(() => void) | null>(null);
  const [adShowing, setAdShowing] = useState(false);

  const [fontsLoaded] = useFonts({
    BricolageGrotesque_400Regular,
    BricolageGrotesque_500Medium,
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
  });

  useEffect(() => {
    NativeStatusBar.setBarStyle('dark-content');
    NativeStatusBar.setBackgroundColor('#F9F9FB', true);

    fetchRemoteConfig();

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
      if (adCallbackRef.current) {
        adCallbackRef.current();
        adCallbackRef.current = null;
      }
    });
    const unsubscribeClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      setRewardedLoaded(false);
      setAdShowing(false);
      rewarded.load(); // preload next
    });
    const unsubscribeError = rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('⚠️ [AdMob Rewarded Error]:', error);
      setRewardedLoaded(false);
      setAdShowing(false);
      adCallbackRef.current = null;
      rewarded.load();
    });

    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, [isPremium]);

  // Safety watchdog to prevent permanent overlay hang
  useEffect(() => {
    if (!adShowing) return;
    const timerId = setTimeout(() => {
      setAdShowing(false);
      adCallbackRef.current = null;
      Alert.alert('Ad Timed Out', 'The ad took too long to load. Please try again.');
    }, 8000);
    return () => clearTimeout(timerId);
  }, [adShowing]);

  const showRewardedAd = (onReward: () => void) => {
    if (isPremium) {
      onReward();
      return;
    }
    if (rewardedLoaded) {
      adCallbackRef.current = onReward;
      setAdShowing(true);
      rewarded.show().catch((err) => {
        console.log('⚠️ [AdMob Show Error]:', err);
        setAdShowing(false);
        adCallbackRef.current = null;
        Alert.alert('Ad Error', 'Failed to display the ad. Please try again.');
      });
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
      
      recordGameWon(difficulty, timer);

      if (currentDailyChallenge) {
        completeDailyChallenge(currentDailyChallenge);
      }
    } else if (isGameOver) {
      console.log(`🔥 [Firebase Analytics] Logging Event: game_lost (Time: ${timer}s)`);
      logEvent(analytics, 'game_lost', { time_taken: timer });
    }
  }, [isGameWon, isGameOver, timer, currentDailyChallenge, completeDailyChallenge, difficulty, recordGameWon]);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaProvider>
      {screen === 'home' ? (
        <HomeScreen
          setScreen={setScreen}
          startNewGame={startNewGame}
          history={history}
          isPremium={isPremium}
          setPremium={setPremium}
        />
      ) : (
        <AppGradientBackground>
          <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
            <View style={{ flex: 1, alignItems: 'center' }}>

              <TopBar showRewardedAd={showRewardedAd} />
            <Board />
            <Keypad showRewardedAd={showRewardedAd} />

            {/* ── Win / Game Over Modal ── */}
            {(isGameOver || isGameWon) && (
              <View style={{
                position: 'absolute', inset: 0, top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 50,
              }}>
                <View style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 28,
                  padding: 32,
                  alignItems: 'center',
                  width: '82%',
                  shadowColor: '#000',
                  shadowOpacity: 0.2,
                  shadowRadius: 24,
                  shadowOffset: { width: 0, height: 10 },
                  elevation: 12,
                }}>
                  {/* Emoji circle */}
                  <View style={{
                    width: 80, height: 80, borderRadius: 999,
                    backgroundColor: isGameWon ? '#DCFCE7' : '#FEE2E2',
                    alignItems: 'center', justifyContent: 'center',
                    marginBottom: 16,
                  }}>
                    <Text style={{ fontSize: 40 }}>{isGameWon ? '🏆' : '💀'}</Text>
                  </View>

                  <Text style={{
                    fontSize: 26, fontWeight: '800', color: '#1C1F2E', marginBottom: 6,
                  }}>
                    {isGameWon ? 'You Win!' : 'Game Over'}
                  </Text>
                  <Text style={{
                    fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 28,
                  }}>
                    {isGameWon ? 'Excellent job solving this puzzle! 🎉' : 'You made 3 mistakes. Better luck next time!'}
                  </Text>

                  {/* Second Chance (only on game over) */}
                  {isGameOver && (
                    <TouchableOpacity
                      onPress={() => showRewardedAd(() => secondChance())}
                      style={{
                        backgroundColor: '#3B82F6',
                        borderRadius: 999,
                        paddingVertical: 14,
                        width: '100%',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 16 }}>
                        Second Chance {isPremium ? '' : '📺'}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* Home / New Game */}
                  <TouchableOpacity
                    onPress={() => setScreen('home')}
                    style={{
                      backgroundColor: '#F3F4F6',
                      borderRadius: 999,
                      paddingVertical: 14,
                      width: '100%',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#1C1F2E', fontWeight: '700', fontSize: 16 }}>
                      Back to Home
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* AdMob Banner */}
            {!isPremium && (
              <View style={{
                position: 'absolute', bottom: 0, width: '100%',
                alignItems: 'center', justifyContent: 'center',
                backgroundColor: '#E2E8F0', height: 70,
              }}>
                <BannerAd
                  unitId={bannerAdUnitId}
                  size={BannerAdSize.BANNER}
                  requestOptions={{ requestNonPersonalizedAdsOnly: true }}
                />
              </View>
            )}

            {/* Ad Loading Overlay */}
            {adShowing && (
              <View style={{
                position: 'absolute', inset: 0, top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.8)',
                alignItems: 'center', justifyContent: 'center', zIndex: 50,
              }}>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={{ color: '#FFFFFF', marginTop: 16, fontWeight: '700', fontSize: 16 }}>
                  Loading Ad...
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setAdShowing(false);
                    adCallbackRef.current = null;
                  }}
                  style={{ marginTop: 20, paddingHorizontal: 20, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 }}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>
        </SafeAreaView>
      </AppGradientBackground>
      )}
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
