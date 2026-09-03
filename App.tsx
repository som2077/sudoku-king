import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <Text className="text-3xl font-bold text-blue-600 mb-4">Sudoku King</Text>
      <Text className="text-lg text-gray-600">Project Initialized Successfully!</Text>
      <StatusBar style="auto" />
    </View>
  );
}
