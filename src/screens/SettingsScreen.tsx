import React from 'react';
import { Text } from '../components/Text';
import { View, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { ChevronRight, HelpCircle, BookOpen, ShieldCheck, FileText, Info } from 'lucide-react-native';

interface SettingsScreenProps {
  // We can add props later if needed
}

export function SettingsScreen({}: SettingsScreenProps) {
  const settingsOptions = [
    { id: 'how_to_play', title: 'How to play', icon: <HelpCircle size={24} color="#6b7280" /> },
    { id: 'rules', title: 'Rules', icon: <BookOpen size={24} color="#6b7280" /> },
    { id: 'help', title: 'Help', icon: <Info size={24} color="#6b7280" /> },
    { id: 'terms', title: 'Terms of Services', icon: <FileText size={24} color="#6b7280" /> },
    { id: 'privacy', title: 'Privacy Policy', icon: <ShieldCheck size={24} color="#6b7280" /> },
  ];

  const handlePress = (id: string) => {
    // In a real app, this would navigate to respective screens or open URLs
    console.log('Pressed:', id);
  };

  return (
    <View className="flex-1 bg-[#F9F9FB]">
      {/* Header */}
      <View className="px-6 pt-4 pb-6 border-b border-gray-200 bg-white">
        <Text className="text-3xl font-black text-gray-900">Settings</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          {settingsOptions.map((option, index) => (
            <View key={option.id}>
              <TouchableOpacity
                onPress={() => handlePress(option.id)}
                className="flex-row items-center justify-between p-5 bg-white"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <View className="mr-4">{option.icon}</View>
                  <Text className="text-lg font-medium text-gray-800">{option.title}</Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </TouchableOpacity>
              
              {/* Separator line */}
              {index < settingsOptions.length - 1 && (
                <View className="h-[1px] bg-gray-100 ml-14" />
              )}
            </View>
          ))}
        </View>

        {/* Version Info */}
        <Text className="text-center text-gray-400 font-medium text-sm mb-32">
          Sudoku King v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}
