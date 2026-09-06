import React from 'react';
import { Text } from '../ui/Text';
import { View, TouchableOpacity, Modal, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Difficulty } from '../../utils/sudokuLogic';

interface DifficultyBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (difficulty: Difficulty) => void;
  onRestart?: () => void;
}

const OPTIONS: Difficulty[] = [
  'Easy',
  'Medium',
  'Hard',
  'Expert',
  'Master',
  'Extreme',
];

export function DifficultyBottomSheet({
  visible,
  onClose,
  onSelect,
  onRestart,
}: DifficultyBottomSheetProps) {
  let insetsBottom = 0;
  try {
    const insets = useSafeAreaInsets();
    insetsBottom = insets?.bottom ?? 0;
  } catch {
    insetsBottom = 0;
  }

  const handleSelect = (diff: Difficulty) => {
    onClose();
    onSelect(diff);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop: Sibling that closes sheet on tap outside */}
        <Pressable
          style={[StyleSheet.absoluteFill, styles.backdrop]}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close difficulty selection"
        />

        {/* Sheet Content */}
        <View
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insetsBottom + 16, 32) },
          ]}
        >
          {/* Top Handlebar */}
          <View style={styles.handle} />

          {/* Options List */}
          <View style={styles.optionsList}>
            {OPTIONS.map((difficulty, index) => (
              <View key={difficulty}>
                <TouchableOpacity
                  activeOpacity={0.65}
                  onPress={() => handleSelect(difficulty)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${difficulty} difficulty`}
                  style={styles.optionRow}
                >
                  <Text style={styles.optionTitle}>{difficulty}</Text>
                </TouchableOpacity>

                {index < OPTIONS.length - 1 && <View style={styles.divider} />}
              </View>
            ))}

            {onRestart && (
              <>
                <View style={styles.divider} />
                <TouchableOpacity
                  activeOpacity={0.65}
                  onPress={() => {
                    onClose();
                    onRestart();
                  }}
                  style={styles.restartBtn}
                >
                  <Text style={styles.restartText}>Restart Current Board</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 16,
  },
  handle: {
    width: 38,
    height: 4.5,
    backgroundColor: '#D1D5DB',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 8,
  },
  optionsList: {
    width: '100%',
  },
  optionRow: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563EB',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    width: '100%',
  },
  restartBtn: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  restartText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
    textAlign: 'center',
  },
});
