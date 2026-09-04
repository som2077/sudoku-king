import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Trophy, ChevronLeft } from 'lucide-react-native';

interface AwardsScreenProps {
  onBack: () => void;
}

const MONTHS = [
  { name: 'September', total: 30 },
  { name: 'August', total: 31 },
  { name: 'July', total: 31 },
  { name: 'June', total: 30 },
  { name: 'May', total: 31 },
  { name: 'April', total: 30 },
  { name: 'March', total: 31 },
  { name: 'February', total: 28 },
  { name: 'January', total: 31 },
];

export function AwardsScreen({ onBack }: AwardsScreenProps) {
  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-4 pb-2">
        <TouchableOpacity onPress={onBack} className="mr-4">
          <ChevronLeft size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-3xl font-black text-gray-900">2026</Text>
      </View>

      <ScrollView className="flex-1 px-2" showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between pt-4">
          {MONTHS.map((month, index) => (
            <View key={index} className="w-[33%] items-center mb-8">
              {/* Light gray placeholder for the trophy image */}
              <View className="w-20 h-24 items-center justify-center mb-2">
                <Trophy size={64} color="#E5E7EB" strokeWidth={1} fill="#F3F4F6" />
              </View>
              <Text className="text-gray-900 font-medium text-sm mb-1">{month.name}</Text>
              <View className="h-[2px] w-8 bg-gray-200 mb-2" />
              <Text className="text-gray-400 text-xs">0 of {month.total}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
