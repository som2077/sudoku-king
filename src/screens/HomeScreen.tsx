import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Home, BarChart2, Settings, Play, Plus, Flame } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useGameStore } from '../store/useGameStore';
import { getRevenueCatApiKey } from '../utils/secrets';
import Purchases from 'react-native-purchases';
import RevenueCatUI from 'react-native-purchases-ui';

import { WeeklyCalendarStrip } from '../components/WeeklyCalendarStrip';
import { RingSummaryCard } from '../components/RingSummaryCard';
import { FilterTabs, FilterTab } from '../components/FilterTabs';
import { DifficultyBottomSheet } from '../components/DifficultyBottomSheet';
import { DailyChallengesScreen } from './DailyChallengesScreen';
import { SettingsScreen } from './SettingsScreen';
import { AwardsScreen } from './AwardsScreen';
import { Calendar } from 'lucide-react-native';
import { StatusBar as NativeStatusBar } from 'react-native';

const { width } = Dimensions.get('window');

type HomeScreenProps = {
  setScreen: (screen: 'home' | 'playing') => void;
  startNewGame: (difficulty: 'Fast' | 'Easy' | 'Medium' | 'Hard' | 'Expert') => void;
  history: any[];
  isPremium: boolean;
  setPremium: (val: boolean) => void;
};

type Tab = 'home' | 'daily_challenges' | 'settings';

export default function HomeScreen({ setScreen, startNewGame, history, isPremium, setPremium }: HomeScreenProps) {
  const [selectedFilter, setSelectedFilter] = React.useState<FilterTab>("Daily");
  const [showDifficultySheet, setShowDifficultySheet] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<Tab>('home');
  const [showAwards, setShowAwards] = React.useState(false);

  React.useEffect(() => {
    if (activeTab === 'daily_challenges') {
      NativeStatusBar.setBarStyle('light-content');
      NativeStatusBar.setBackgroundColor('transparent', true);
      NativeStatusBar.setTranslucent(true);
    } else {
      NativeStatusBar.setBarStyle('dark-content');
      NativeStatusBar.setBackgroundColor('#F9F9FB', true);
      NativeStatusBar.setTranslucent(false);
    }
  }, [activeTab]);

  const buyPremium = async () => {
    try {
      const rcKey = getRevenueCatApiKey();
      if (!rcKey || rcKey === "goog_REPLACE_WITH_REAL_API_KEY") {
        setPremium(true);
        return;
      }
      const paywallResult = await RevenueCatUI.presentPaywall();
      if (paywallResult === RevenueCatUI.PAYWALL_RESULT.PURCHASED || paywallResult === RevenueCatUI.PAYWALL_RESULT.RESTORED) {
        setPremium(true);
      }
    } catch (e: any) {
      console.log("Paywall error", e);
    }
  };

  const ringSegments = [
    { id: '1', progress: 0.65, color: '#01B3F7', radius: 55, strokeWidth: 10 },
    { id: '2', progress: 0.4, color: '#AB86F1', radius: 70, strokeWidth: 10 },
    { id: '3', progress: 0.2, color: '#FEC466', radius: 85, strokeWidth: 10 },
  ];

  if (activeTab === 'daily_challenges') {
    return (
      <View className="flex-1 bg-white">
        <DailyChallengesScreen
          onBack={() => setActiveTab('home')}
          onPlay={(date) => startNewGame('Medium')} // Start a medium game for challenges for now
        />
        {/* Bottom Nav */}
        <View className="absolute bottom-0 w-full bg-[#f4f3f0] flex-row justify-around pt-3 pb-8 border-t border-gray-200">
          <TouchableOpacity onPress={() => setActiveTab('home')} className="items-center flex-1">
            <Home size={28} color="#9CA3AF" />
            <Text className="text-xs font-bold text-gray-400 mt-1">Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('daily_challenges')} className="items-center flex-1">
            <Calendar size={28} color="#1C1F2E" />
            <Text className="text-xs font-bold text-[#1C1F2E] mt-1">Daily Challenges</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('settings')} className="items-center flex-1">
            <Settings size={28} color="#9CA3AF" />
            <Text className="text-xs font-bold text-gray-400 mt-1">Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (activeTab === 'settings') {
    return (
      <SafeAreaView className="flex-1 bg-[#F9F9FB]">
        <SettingsScreen />
        {/* Bottom Nav */}
        <View className="absolute bottom-0 w-full bg-[#f4f3f0] flex-row justify-around pt-3 pb-8 border-t border-gray-200">
          <TouchableOpacity onPress={() => setActiveTab('home')} className="items-center flex-1">
            <Home size={28} color="#9CA3AF" />
            <Text className="text-xs font-bold text-gray-400 mt-1">Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('daily_challenges')} className="items-center flex-1">
            <Calendar size={28} color="#9CA3AF" />
            <Text className="text-xs font-bold text-gray-400 mt-1">Daily Challenges</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('settings')} className="items-center flex-1">
            <Settings size={28} color="#1C1F2E" />
            <Text className="text-xs font-bold text-[#1C1F2E] mt-1">Settings</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FB]">
      {showAwards ? (
        <AwardsScreen onBack={() => setShowAwards(false)} />
      ) : (
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="flex-row justify-between items-center mt-4 mb-6">
            <Image
              source={require('../../assets/sudukoLogo.svg')}
              style={{ width: 140, height: 40 }}
              contentFit="contain"
            />
            <TouchableOpacity 
              onPress={() => setShowAwards(true)}
              className="flex-row items-center bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm"
            >
              <Flame size={16} color="#F97316" />
              <Text className="text-gray-700 font-bold ml-1 text-sm">0</Text>
            </TouchableOpacity>
          </View>

          {/* Dashboard Card */}
          <View className="bg-white rounded-3xl pt-2 pb-6 px-4 shadow-sm mb-6 border border-gray-100">
            <WeeklyCalendarStrip />

            <View className="mt-8">
              <RingSummaryCard
                wornPercentage={0}
                totalWorn={0}
                wearCount={"24"}
                neverCount={24}
                ringSegments={ringSegments}
              />
            </View>
          </View>

          {/* Filters */}
          <View
            style={{
              borderWidth: 0.7,
              borderColor: "#E9EBF8",
              backgroundColor: "#FFFFFF",
              borderRadius: 24,
              padding: 8,
              shadowColor: "#00000040",
              shadowOpacity: 0.02,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 5,
              marginBottom: 10,
            }}
          >
            <FilterTabs value={selectedFilter} onChange={setSelectedFilter} />
          </View>
          <Text className="text-gray-500 text-xs text-center px-4 mb-8 mt-2">
            Track your progress, improve your brain, and become a Sudoku King.
          </Text>

          {/* Buttons */}
          <View className="gap-4">
            <TouchableOpacity
              onPress={() => history.length > 0 ? setScreen('playing') : setShowDifficultySheet(true)}
              className="bg-[#3B82F6] rounded-full py-4 shadow-sm items-center justify-center"
            >
              <Text className="text-white font-bold text-xl mb-1">Continue Game</Text>
              <View className="flex-row items-center">
                <Play size={12} color="white" />
                <Text className="text-blue-100 text-xs ml-1 font-medium">00:28 - Easy</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowDifficultySheet(true)}
              className="bg-white rounded-full py-4 shadow-sm border border-gray-100 items-center justify-center"
            >
              <Text className="text-[#3B82F6] font-bold text-xl mb-1">New Game</Text>
              <View className="flex-row items-center">
                <Flame size={12} color="#F97316" />
                <Text className="text-orange-500 text-xs ml-1 font-medium">+1</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View className="h-24" />
        </ScrollView>
      )}

      {/* Bottom Nav */}
      <View className="absolute bottom-0 w-full bg-[#f4f3f0] flex-row justify-around pt-3 pb-8 border-t border-gray-200">
        <TouchableOpacity onPress={() => setActiveTab('home')} className="items-center flex-1">
          <Home size={28} color="#1C1F2E" />
          <Text className="text-xs font-bold text-[#1C1F2E] mt-1">Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('daily_challenges')} className="items-center flex-1">
          <Calendar size={28} color="#9CA3AF" />
          <Text className="text-xs font-bold text-gray-400 mt-1">Daily Challenges</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('settings')} className="items-center flex-1">
          <Settings size={28} color="#9CA3AF" />
          <Text className="text-xs font-bold text-gray-400 mt-1">Settings</Text>
        </TouchableOpacity>
      </View>

      <DifficultyBottomSheet
        visible={showDifficultySheet}
        onClose={() => setShowDifficultySheet(false)}
        onSelect={(diff) => startNewGame(diff as any)}
      />
    </SafeAreaView>
  );
}
