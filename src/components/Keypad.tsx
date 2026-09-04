import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { useGameStore } from '../store/useGameStore';
import { RotateCcw, Eraser, Pen, Lightbulb } from 'lucide-react-native';

export default function Keypad({ showRewardedAd }: { showRewardedAd: (cb: () => void) => void }) {
  const { placeNumber, isNotesMode, toggleNotesMode, toggleNote, erase, undo, hintsRemaining, useHint, isPremium, addHint } = useGameStore();

  const handleNumberPress = (num: number) => {
    if (isNotesMode) toggleNote(num);
    else placeNumber(num);
  };

  const handleHintClick = () => {
    if (isPremium || hintsRemaining > 0) {
      useHint();
    } else {
      Alert.alert(
        "Out of Hints",
        "Watch a short video ad to get another hint?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Watch Ad",
            onPress: () => showRewardedAd(() => {
              addHint();
              setTimeout(useHint, 500);
            })
          }
        ]
      );
    }
  };

  return (
    <View className="w-full px-4 items-center">

      {/* 4 Actions Row */}
      <View className="flex-row justify-between px-6 mb-5  gap-20 ">

        <TouchableOpacity onPress={undo} className="items-center">
          <RotateCcw size={32} color="#6b7280" strokeWidth={2} />
          <Text className="text-gray-500 text-xs font-bold mt-2">Undo</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={erase} className="items-center">
          <Eraser size={32} color="#6b7280" strokeWidth={2} />
          <Text className="text-gray-500 text-xs font-bold mt-2">Erase</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleNotesMode} className="items-center relative">
          <Pen size={32} color="#6b7280" strokeWidth={2} />
          <Text className="text-gray-500 text-xs font-bold mt-2">Notes</Text>
          <View className={`absolute -top-2 -right-3 px-1.5 py-0.5 rounded-full ${isNotesMode ? 'bg-blue-500' : 'bg-gray-400'}`}>
            <Text className="text-white text-[9px] font-black">{isNotesMode ? 'ON' : 'OFF'}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleHintClick} className="items-center relative">
          <Lightbulb size={32} color="#6b7280" strokeWidth={2} />
          <Text className="text-gray-500 text-xs font-bold mt-2">Hint</Text>
          <View className="absolute -top-1 -right-2 bg-blue-500 w-5 h-5 rounded-full items-center justify-center border-2 border-white">
            <Text className="text-white text-[10px] font-black">
              {isPremium ? '∞' : (hintsRemaining > 0 ? hintsRemaining : '📺')}
            </Text>
          </View>
        </TouchableOpacity>

      </View>

      {/* Number Pad (1-9 in one row) */}
      <View className="flex-row justify-between  w-full pb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <TouchableOpacity
            key={num}
            onPress={() => handleNumberPress(num)}
            className="items-center justify-center bg-[#E5E7EB] rounded-lg h-11 flex-1 mx-0.5"
          >
            <Text className="text-2xl font-normal text-black">{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
