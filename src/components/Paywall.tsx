import React from 'react';
import { Text } from '../components/Text';
import { View, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Crown, CheckCircle2, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type PaywallProps = {
  visible: boolean;
  onClose: () => void;
  onPurchase: () => void;
  onRestore: () => void;
  isLoading?: boolean;
};

export default function Paywall({ visible, onClose, onPurchase, onRestore, isLoading = false }: PaywallProps) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-white">
        {/* Close Button */}
        <TouchableOpacity onPress={onClose} className="absolute top-12 right-6 z-10 p-2 bg-gray-100 rounded-full">
          <X size={24} color="#6b7280" />
        </TouchableOpacity>

        <View className="flex-1 px-8 pt-16">
          {/* Header */}
          <View className="items-center mb-10 mt-6">
            <View className="bg-yellow-100 p-6 rounded-full mb-6">
              <Crown size={64} color="#eab308" strokeWidth={2} />
            </View>
            <Text className="text-4xl font-black text-gray-900 text-center mb-2 tracking-tight">
              Sudoku King Premium
            </Text>
            <Text className="text-lg text-gray-500 text-center font-medium">
              Play without limits.
            </Text>
          </View>

          {/* Benefits */}
          <View className="mb-12 gap-6">
            <View className="flex-row items-center">
              <CheckCircle2 size={28} color="#3b82f6" />
              <Text className="text-xl font-bold text-gray-800 ml-4">Ad-Free Experience</Text>
            </View>
            <View className="flex-row items-center">
              <CheckCircle2 size={28} color="#3b82f6" />
              <Text className="text-xl font-bold text-gray-800 ml-4">Infinite Hints</Text>
            </View>
            <View className="flex-row items-center">
              <CheckCircle2 size={28} color="#3b82f6" />
              <Text className="text-xl font-bold text-gray-800 ml-4">Unlimited Second Chances</Text>
            </View>
            <View className="flex-row items-center">
              <CheckCircle2 size={28} color="#3b82f6" />
              <Text className="text-xl font-bold text-gray-800 ml-4">Support the Developer</Text>
            </View>
          </View>

          <View className="flex-1" />

          {/* Action Buttons */}
          <View className="pb-8">
            <TouchableOpacity 
              onPress={onPurchase}
              disabled={isLoading}
              className="bg-yellow-400 w-full py-5 rounded-2xl mb-4 shadow-sm items-center border border-yellow-500 flex-row justify-center"
            >
              {isLoading ? (
                <ActivityIndicator color="#854d0e" />
              ) : (
                <Text className="text-yellow-900 font-black text-xl">Unlock Now</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={onRestore} className="py-3">
              <Text className="text-gray-400 text-center text-sm font-bold underline">
                Restore Previous Purchases
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
