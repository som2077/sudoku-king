import React from 'react';
import { Text } from '../ui/Text';
import { View, TouchableOpacity, Modal, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Lock } from 'lucide-react-native';

type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'Master' | 'Extreme';

interface DifficultyBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (difficulty: Difficulty) => void;
  onRestart?: () => void;
}

interface DifficultyOption {
  id: Difficulty;
  isLocked: boolean;
  unlockText?: string;
}

const OPTIONS: DifficultyOption[] = [
  { id: 'Easy', isLocked: false },
  { id: 'Medium', isLocked: false },
  { id: 'Hard', isLocked: true, unlockText: 'Complete 2 medium levels to unlock' },
  { id: 'Expert', isLocked: true, unlockText: 'Complete 4 hard levels to unlock' },
  { id: 'Master', isLocked: true, unlockText: 'Complete 10 expert levels to unlock' },
  { id: 'Extreme', isLocked: true, unlockText: 'Complete 14 master levels to unlock' },
];

export function DifficultyBottomSheet({ visible, onClose, onSelect, onRestart }: DifficultyBottomSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/40">
          <TouchableWithoutFeedback>
            <View className="bg-white rounded-t-3xl pt-2 pb-8 px-4">
              <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />
              
              <View className="bg-white rounded-2xl overflow-hidden">
                {OPTIONS.map((opt, index) => (
                  <View key={opt.id}>
                    <TouchableOpacity
                      disabled={opt.isLocked}
                      onPress={() => {
                        onSelect(opt.id);
                        onClose();
                      }}
                      className="py-4 items-center flex-row justify-center"
                    >
                      {opt.isLocked && (
                        <View className="absolute left-6">
                          <Lock size={20} color="#9CA3AF" />
                        </View>
                      )}
                      <View className="items-center">
                        <Text className={`text-xl font-medium ${opt.isLocked ? 'text-gray-400' : 'text-blue-500'}`}>
                          {opt.id}
                        </Text>
                        {opt.isLocked && opt.unlockText && (
                          <Text className="text-gray-400 text-xs mt-1">
                            {opt.unlockText}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                    {index < OPTIONS.length - 1 && (
                      <View className="h-[1px] bg-gray-100 w-full" />
                    )}
                  </View>
                ))}

                {onRestart && (
                  <>
                    <View className="h-[1px] bg-gray-100 w-full" />
                    <TouchableOpacity
                      onPress={() => {
                        onRestart();
                        onClose();
                      }}
                      className="py-4 items-center"
                    >
                      <Text className="text-xl font-medium text-blue-500">
                        Restart
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
