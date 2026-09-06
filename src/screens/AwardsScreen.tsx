import React from 'react';
import { Text } from '../components/Text';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Trophy, ChevronLeft } from 'lucide-react-native';
import { useGameStore, isDailyChallengeCompleted } from '../store/useGameStore';

interface AwardsScreenProps {
  onBack: () => void;
}

const MONTHS = [
  { name: 'September', monthIdx: 8, total: 30 },
  { name: 'August', monthIdx: 7, total: 31 },
  { name: 'July', monthIdx: 6, total: 31 },
  { name: 'June', monthIdx: 5, total: 30 },
  { name: 'May', monthIdx: 4, total: 31 },
  { name: 'April', monthIdx: 3, total: 30 },
  { name: 'March', monthIdx: 2, total: 31 },
  { name: 'February', monthIdx: 1, total: 28 },
  { name: 'January', monthIdx: 0, total: 31 },
];

export function AwardsScreen({ onBack }: AwardsScreenProps) {
  const { dailyChallengesProgress } = useGameStore();

  const getMonthStats = (monthIdx: number, total: number) => {
    let count = 0;
    const mStr = String(monthIdx + 1).padStart(2, '0');
    const currentYear = new Date().getFullYear();
    for (let d = 1; d <= total; d++) {
      const dStr = String(d).padStart(2, '0');
      if (isDailyChallengeCompleted(dailyChallengesProgress, `${currentYear}-${mStr}-${dStr}`)) {
        count++;
      }
    }
    const isGold = count >= total;
    const isSilver = !isGold && count >= 20;
    const isBronze = !isGold && !isSilver && count >= 10;
    return { count, isGold, isSilver, isBronze };
  };

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
          {MONTHS.map((month, index) => {
            const { count, isGold, isSilver, isBronze } = getMonthStats(month.monthIdx, month.total);

            let strokeColor = '#E5E7EB';
            let fillColor = '#F3F4F6';
            if (isGold) {
              strokeColor = '#D97706';
              fillColor = '#F59E0B';
            } else if (isSilver) {
              strokeColor = '#64748B';
              fillColor = '#CBD5E1';
            } else if (isBronze) {
              strokeColor = '#B45309';
              fillColor = '#D97706';
            }

            return (
              <View key={index} className="w-[33%] items-center mb-8">
                <View className="w-20 h-24 items-center justify-center mb-2">
                  <Trophy size={64} color={strokeColor} strokeWidth={1.2} fill={fillColor} />
                </View>
                <Text className="text-gray-900 font-medium text-sm mb-1">{month.name}</Text>
                <View
                  className="h-[2px] w-8 mb-2"
                  style={{
                    backgroundColor: isGold
                      ? '#F59E0B'
                      : isSilver
                      ? '#94A3B8'
                      : isBronze
                      ? '#D97706'
                      : '#E5E7EB',
                  }}
                />
                <Text className="text-gray-500 text-xs font-semibold">
                  {count} of {month.total}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
