import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { ChevronLeft, Trophy, Star, Play } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface DailyChallengesScreenProps {
  onBack: () => void;
  onPlay: (date: number) => void;
}

export function DailyChallengesScreen({ onBack, onPlay }: DailyChallengesScreenProps) {
  const [selectedDate, setSelectedDate] = useState<number>(4);

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Generating a simple calendar for September 2026
  // Sept 1, 2026 is a Tuesday.
  const emptyDays = 1; // Monday is empty
  const daysInMonth = 30;

  const grid = [];
  let currentDay = 1;

  for (let row = 0; row < 6; row++) {
    const rowDays = [];
    for (let col = 0; col < 7; col++) {
      if (row === 0 && col < emptyDays) {
        rowDays.push(null);
      } else if (currentDay <= daysInMonth) {
        rowDays.push(currentDay);
        currentDay++;
      } else {
        rowDays.push(null);
      }
    }
    grid.push(rowDays);
    if (currentDay > daysInMonth) break;
  }

  return (
    <View className="flex-1 bg-white">
      {/* Top Banner */}
      <View className="bg-blue-500 h-2/5 pt-12 px-4 relative overflow-hidden items-center justify-center">
        {/* Decorative background circles could go here */}

        <Text className="absolute top-12 text-white font-bold text-lg text-center w-full z-0">
          Daily Challenges
        </Text>

        {/* Trophy Icon - using Lucide Trophy as placeholder */}
        <View className="mt-8">
          <Trophy size={140} color="#E0F2FE" strokeWidth={1} fill="#0369A1" />
        </View>
      </View>

      {/* Calendar Area */}
      <View className="flex-1 px-6 pt-6 bg-white">
        {/* Month & Stats */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold text-gray-900">September 2026</Text>
          <View className="flex-row items-center gap-1">
            <View className="bg-yellow-400 rounded-full p-1">
              <Star size={12} color="white" fill="white" />
            </View>
            <Text className="font-bold text-lg text-gray-900">0/30</Text>
          </View>
        </View>

        {/* Days of Week */}
        <View className="flex-row justify-between mb-4">
          {daysOfWeek.map((day, i) => (
            <Text key={i} className="text-gray-400 font-medium w-8 text-center text-sm">
              {day}
            </Text>
          ))}
        </View>

        {/* Grid */}
        <View className="gap-y-4">
          {grid.map((row, rowIdx) => (
            <View key={rowIdx} className="flex-row justify-between">
              {row.map((day, colIdx) => {
                if (!day) return <View key={colIdx} className="w-10 h-10" />;

                const isSelected = day === selectedDate;
                // Just making days before today look "past" (grayed out)
                const isPast = day < 4;

                return (
                  <TouchableOpacity
                    key={colIdx}
                    onPress={() => setSelectedDate(day)}
                    className={`w-10 h-10 items-center justify-center rounded-full ${isSelected ? 'bg-blue-500' : ''
                      }`}
                  >
                    {isSelected && (
                      <View className="absolute w-11 h-11 rounded-full border-2 border-blue-400" />
                    )}
                    <Text
                      className={`text-lg font-medium ${isSelected ? 'text-white' : (isPast ? 'text-gray-300' : 'text-gray-400')
                        }`}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* Play Button */}
        <View className="absolute bottom-[100px] left-6 right-6">
          <TouchableOpacity
            onPress={() => onPlay(selectedDate)}
            className="bg-blue-500 rounded-full py-4 shadow-sm items-center justify-center"
          >
            <Text className="text-white font-bold text-xl">Play</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
