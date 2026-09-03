import { View, Text, TouchableOpacity } from 'react-native';
import { useGameStore } from '../store/useGameStore';
import { useEffect } from 'react';

export default function TopBar() {
  const { mistakes, timer, hintsRemaining, useHint } = useGameStore();

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

  return (
    <View className="flex-row justify-between items-center w-[360px] px-2 mb-4 mt-4">
      <Text className="text-gray-600 font-medium text-lg">{formatTime(timer)}</Text>
      
      <Text className={`font-bold text-lg ${mistakes >= 3 ? 'text-red-600' : 'text-gray-600'}`}>
        Mistakes: {mistakes}/3
      </Text>
      
      <TouchableOpacity 
        onPress={useHint} 
        className={`px-4 py-1 rounded-full ${hintsRemaining > 0 ? 'bg-orange-400' : 'bg-gray-300'}`}
      >
        <Text className="text-white font-bold">Hint ({hintsRemaining})</Text>
      </TouchableOpacity>
    </View>
  );
}
