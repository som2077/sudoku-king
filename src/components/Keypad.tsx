import { View, TouchableOpacity, Text } from 'react-native';
import { useGameStore } from '../store/useGameStore';

export default function Keypad() {
  const { placeNumber, isNotesMode, toggleNotesMode, toggleNote, erase, undo } = useGameStore();

  const handleNumberPress = (num: number) => {
    if (isNotesMode) toggleNote(num);
    else placeNumber(num);
  };

  return (
    <View className="w-full px-4 mt-6">
      <View className="flex-row justify-between mb-4 px-2">
        <TouchableOpacity onPress={undo} className="items-center justify-center p-2">
          <Text className="text-blue-500 font-bold">Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={erase} className="items-center justify-center p-2">
          <Text className="text-blue-500 font-bold">Erase</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleNotesMode} className={`px-4 py-2 rounded-full justify-center ${isNotesMode ? 'bg-blue-500' : 'bg-gray-200'}`}>
          <Text className={`font-bold ${isNotesMode ? 'text-white' : 'text-gray-700'}`}>Notes: {isNotesMode ? 'ON' : 'OFF'}</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap justify-between mt-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <TouchableOpacity
            key={num}
            onPress={() => handleNumberPress(num)}
            className="w-[30%] aspect-square bg-white border border-gray-300 rounded-xl items-center justify-center mb-4 shadow-sm"
          >
            <Text className="text-3xl font-medium text-blue-700">{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
