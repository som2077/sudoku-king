import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { getAnalytics, logEvent } from '@react-native-firebase/analytics';
import Board from './src/components/Board';
import Keypad from './src/components/Keypad';
import TopBar from './src/components/TopBar';
import { useGameStore } from './src/store/useGameStore';

export default function App() {
  const { startNewGame, mistakes, board, screen, setScreen, history, timer, fetchRemoteConfig } = useGameStore();

  const isGameOver = mistakes >= 3;
  const isGameWon = board.length > 0 && board.every(cell => cell.value !== null && !cell.isError) && mistakes < 3;

  useEffect(() => {
    fetchRemoteConfig();
  }, []);

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
          <Text className="text-gray-500 mb-12">Train your brain, stay sharp.</Text>

          {history.length > 0 && (
            <TouchableOpacity onPress={() => setScreen('playing')} className="bg-orange-500 px-12 py-4 rounded-full mb-6 shadow-md">
              <Text className="text-white font-bold text-xl">Continue Game</Text>
            </TouchableOpacity>
          )}

          <Text className="text-gray-400 mb-4 font-bold">NEW GAME</Text>
          <View className="flex-row flex-wrap justify-center gap-4 px-8">
            {['Fast', 'Easy', 'Medium', 'Hard', 'Expert'].map(diff => (
              <TouchableOpacity key={diff} onPress={() => startNewGame(diff as any)} className="bg-white border border-blue-500 px-6 py-3 rounded-full mb-4 shadow-sm w-[40%] items-center">
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

          <TopBar />
          <Board />
          <Keypad />
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
                <TouchableOpacity onPress={() => setScreen('home')} className="bg-blue-600 px-8 py-3 rounded-full">
                  <Text className="text-white font-bold text-xl">Home Menu</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
