import React, { useRef } from 'react';
import { Text } from '../ui/Text';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Difficulty } from '../../utils/sudokuLogic';
import { useTranslation } from '../../i18n';
import { AppBottomSheet, AppBottomSheetRef } from '../ui/AppBottomSheet';

export type DifficultyBottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  onRestart?: () => void;
} & (
  | {
      includeAll: true;
      onSelect: (difficulty: Difficulty | 'All') => void;
    }
  | {
      includeAll?: false;
      onSelect: (difficulty: Difficulty) => void;
    }
);

const OPTIONS: Difficulty[] = [
  'Easy',
  'Medium',
  'Hard',
  'Expert',
  'Master',
  'Extreme',
];

export function DifficultyBottomSheet(props: DifficultyBottomSheetProps) {
  const {
    visible,
    onClose,
    onRestart,
    includeAll = false,
  } = props;
  const onSelect = props.onSelect as (diff: Difficulty | 'All') => void;
  const { t } = useTranslation();
  const sheetRef = useRef<AppBottomSheetRef>(null);

  const getDifficultyTitle = (diff: Difficulty | 'All') => {
    switch (diff) {
      case 'All':
        return t('home.all', 'All');
      case 'Easy':
        return t('diff.easy');
      case 'Medium':
        return t('diff.medium');
      case 'Hard':
        return t('diff.hard');
      case 'Expert':
        return t('diff.expert');
      case 'Master':
        return t('diff.master');
      default:
        return diff;
    }
  };

  const handleSelect = (diff: Difficulty | 'All') => {
    if (sheetRef.current) {
      sheetRef.current.close(() => {
        onSelect(diff);
      });
    } else {
      onSelect(diff);
      onClose();
    }
  };

  const handleRestart = () => {
    if (onRestart) {
      if (sheetRef.current) {
        sheetRef.current.close(() => {
          onRestart();
        });
      } else {
        onRestart();
        onClose();
      }
    }
  };

  return (
    <AppBottomSheet
      ref={sheetRef}
      visible={visible}
      onClose={onClose}
      enableContentDrag={true}
      snapHeight={includeAll ? 510 : 460}
      sheetStyle={styles.sheet}
    >
      <View style={styles.optionsList}>
        {includeAll && (
          <View key="All">
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => handleSelect('All')}
              accessibilityRole="button"
              accessibilityLabel="Select All difficulties"
              style={styles.optionRow}
            >
              <Text style={styles.optionTitle}>{getDifficultyTitle('All')}</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
          </View>
        )}

        {OPTIONS.map((difficulty, index) => (
          <View key={difficulty}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => handleSelect(difficulty)}
              accessibilityRole="button"
              accessibilityLabel={`Select ${difficulty} difficulty`}
              style={styles.optionRow}
            >
              <Text style={styles.optionTitle}>{getDifficultyTitle(difficulty)}</Text>
            </TouchableOpacity>

            {index < OPTIONS.length - 1 && <View style={styles.divider} />}
          </View>
        ))}

        {onRestart && (
          <>
            <View style={styles.divider} />
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={handleRestart}
              style={styles.restartBtn}
            >
              <Text style={styles.restartText}>Restart Current Board</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </AppBottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 4,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 20,
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
    paddingVertical: 14,
  },
  restartText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
    textAlign: 'center',
  },
});
