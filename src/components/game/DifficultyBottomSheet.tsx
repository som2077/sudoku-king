import React, { useEffect, useRef, useState } from 'react';
import { Text } from '../ui/Text';
import {
  View,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
  Animated,
  PanResponder,
  Easing,
  BackHandler,
} from 'react-native';
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

const SHEET_HEIGHT = 460;

export function DifficultyBottomSheet({
  visible,
  onClose,
  onSelect,
  onRestart,
}: DifficultyBottomSheetProps) {
  const [modalVisible, setModalVisible] = useState(visible);
  const isClosingRef = useRef(false);

  // Safe area bottom inset calculation
  let insetsBottom = 0;
  try {
    const insets = useSafeAreaInsets();
    insetsBottom = insets?.bottom ?? 0;
  } catch {
    insetsBottom = 0;
  }

  // Animation values
  const panY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Open animation: Spring sheet up from bottom + fade in backdrop
  const animateOpen = () => {
    isClosingRef.current = false;
    panY.setValue(SHEET_HEIGHT);
    backdropOpacity.setValue(0);

    Animated.parallel([
      Animated.spring(panY, {
        toValue: 0,
        damping: 24,
        mass: 0.8,
        stiffness: 220,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Close animation: Slide sheet down + fade out backdrop, then trigger callbacks
  const animateClose = (callback?: () => void) => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    Animated.parallel([
      Animated.timing(panY, {
        toValue: SHEET_HEIGHT,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      isClosingRef.current = false;
      setModalVisible(false);
      onClose();
      if (callback) {
        callback();
      }
    });
  };

  // Sync with parent `visible` prop
  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      // animateOpen will be called on Modal onShow
    } else if (modalVisible && !isClosingRef.current) {
      animateClose();
    }
  }, [visible]);

  // Handle hardware back on Android
  useEffect(() => {
    if (!modalVisible) return;

    const onBackPress = () => {
      animateClose();
      return true;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [modalVisible]);

  // PanResponder for drag-down gestures on the sheet
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 8 && gestureState.dy > Math.abs(gestureState.dx) * 1.2;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        } else {
          panY.setValue(gestureState.dy * 0.15);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 80 || gestureState.vy > 0.5) {
          animateClose();
        } else {
          Animated.spring(panY, {
            toValue: 0,
            damping: 24,
            mass: 0.8,
            stiffness: 220,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Handlebar specific PanResponder: captures immediately on handle touch
  const handlePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        } else {
          panY.setValue(gestureState.dy * 0.15);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50 || gestureState.vy > 0.4) {
          animateClose();
        } else {
          Animated.spring(panY, {
            toValue: 0,
            damping: 24,
            mass: 0.8,
            stiffness: 220,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Selection with smooth animated exit
  const handleSelect = (diff: Difficulty) => {
    animateClose(() => {
      onSelect(diff);
    });
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onShow={animateOpen}
      onRequestClose={() => animateClose()}
    >
      <View style={styles.overlay}>
        {/* Animated Dimmed Backdrop */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.backdrop,
            { opacity: backdropOpacity },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => animateClose()}
            accessibilityRole="button"
            accessibilityLabel="Close difficulty selection"
          />
        </Animated.View>

        {/* Animated Draggable Bottom Sheet */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.sheet,
            {
              paddingBottom: Math.max(insetsBottom + 16, 32),
              transform: [{ translateY: panY }],
            },
          ]}
        >
          {/* Top Handlebar & Drag Zone */}
          <View
            {...handlePanResponder.panHandlers}
            style={styles.handleContainer}
          >
            <View style={styles.handle} />
          </View>

          {/* Options List */}
          <View style={styles.optionsList}>
            {OPTIONS.map((difficulty, index) => (
              <View key={difficulty}>
                <TouchableOpacity
                  activeOpacity={0.6}
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
                  activeOpacity={0.6}
                  onPress={() => {
                    animateClose(() => {
                      onRestart();
                    });
                  }}
                  style={styles.restartBtn}
                >
                  <Text style={styles.restartText}>Restart Current Board</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Animated.View>
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
    paddingTop: 4,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 20,
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 14,
  },
  handle: {
    width: 40,
    height: 4.5,
    backgroundColor: '#D1D5DB',
    borderRadius: 3,
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
