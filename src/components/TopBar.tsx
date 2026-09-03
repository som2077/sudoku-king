import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useGameStore } from '../store/useGameStore';
import { useEffect } from 'react';
import { ChevronLeft, RotateCcw, CirclePause, Settings } from 'lucide-react-native';

export default function TopBar({ showRewardedAd }: { showRewardedAd: (cb: () => void) => void }) {
  const { mistakes, timer, setScreen, startNewGame } = useGameStore();

  useEffect(() => {
    const interval = setInterval(() => {
      useGameStore.setState((state) => ({ timer: state.timer + 1 }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const confirmRestart = () => {
    Alert.alert("Restart", "Are you sure you want to start a new game?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: () => startNewGame('Easy') } // In a real app we'd save current difficulty
    ]);
  };

  return (
    <View className="w-full px-4 mb-2 mt-4 bg-white">
      {/* Top Header Row */}
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity onPress={() => setScreen('home')} className="p-2">
          <ChevronLeft size={32} color="#3b82f6" strokeWidth={3} />
        </TouchableOpacity>
        
        <Text className="text-2xl font-black text-gray-800 tracking-wider">
          {formatTime(timer)}
        </Text>
        
        <View className="flex-row gap-4 items-center">
          <TouchableOpacity onPress={confirmRestart}>
            <RotateCcw size={28} color="#3b82f6" strokeWidth={2.5} />
          </TouchableOpacity>
          <TouchableOpacity>
            <CirclePause size={28} color="#3b82f6" strokeWidth={2.5} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Settings size={28} color="#3b82f6" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Second Row: Stats */}
      <View className="flex-row justify-between items-center px-1 mb-2">
        <View>
          <Text className="text-gray-400 font-bold text-xs uppercase">Difficulty</Text>
          <Text className="text-gray-600 font-black text-sm">Easy</Text>
        </View>
        <View className="items-center">
          <Text className="text-gray-400 font-bold text-xs uppercase">Score</Text>
          <Text className="text-gray-600 font-black text-sm">0</Text>
        </View>
        <View className="items-end">
          <Text className="text-gray-400 font-bold text-xs uppercase">Mistakes</Text>
          <Text className="text-gray-600 font-black text-sm">{mistakes}/3</Text>
        </View>
      </View>
    </View>
  );
}
