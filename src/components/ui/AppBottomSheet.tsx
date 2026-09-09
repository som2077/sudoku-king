import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  View,
  Modal,
  Pressable,
  StyleSheet,
  Animated,
  PanResponder,
  Easing,
  BackHandler,
  useWindowDimensions,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface AppBottomSheetRef {
  close: (callback?: () => void) => void;
}

export interface AppBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxHeight?: number | `${number}%`;
  snapHeight?: number;
  showHandle?: boolean;
  enableContentDrag?: boolean;
  sheetStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  backdropOpacityValue?: number;
}

export const AppBottomSheet = forwardRef<AppBottomSheetRef, AppBottomSheetProps>(
  function AppBottomSheet(
    {
      visible,
      onClose,
      children,
      maxHeight = "85%",
      snapHeight,
      showHandle = true,
      enableContentDrag = false,
      sheetStyle,
      contentStyle,
      backdropOpacityValue = 0.45,
    },
    ref
  ) {
  const insets = useSafeAreaInsets();
  const insetsBottom = insets.bottom;
  const { height: screenHeight } = useWindowDimensions();
  const defaultHeight = snapHeight ?? Math.round(screenHeight * 0.75);

  const [modalVisible, setModalVisible] = useState(visible);
  const isClosingRef = useRef(false);

  // Animation values
  const panY = useRef(new Animated.Value(defaultHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      panY.stopAnimation();
      backdropOpacity.stopAnimation();
    };
  }, [panY, backdropOpacity]);

  // Open animation: Spring sheet up from bottom + fade in backdrop
  const animateOpen = () => {
    isClosingRef.current = false;
    panY.setValue(defaultHeight);
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
        toValue: defaultHeight,
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

  useImperativeHandle(ref, () => ({
    close: animateClose,
  }));

  // Sync with parent `visible` prop
  useEffect(() => {
    if (visible) {
      setModalVisible(true);
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

    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [modalVisible]);

  // PanResponder for drag-down gestures on the sheet
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          gestureState.dy > 8 &&
          gestureState.dy > Math.abs(gestureState.dx) * 1.2
        );
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        } else {
          panY.setValue(gestureState.dy * 0.15);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 70 || gestureState.vy > 0.45) {
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
            {
              backgroundColor: `rgba(0, 0, 0, ${backdropOpacityValue})`,
              opacity: backdropOpacity,
            },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => animateClose()}
            accessibilityRole="button"
            accessibilityLabel="Close bottom sheet"
          />
        </Animated.View>

        {/* Animated Draggable Bottom Sheet */}
        <Animated.View
          {...(enableContentDrag ? panResponder.panHandlers : {})}
          style={[
            styles.sheet,
            {
              maxHeight: maxHeight as any,
              paddingBottom: Math.max(insetsBottom + 16, 28),
              transform: [{ translateY: panY }],
            },
            sheetStyle,
          ]}
        >
          {/* Top Handlebar & Drag Zone */}
          {showHandle && (
            <View
              {...handlePanResponder.panHandlers}
              style={styles.handleContainer}
            >
              <View style={styles.handle} />
            </View>
          )}

          {/* Content Container */}
          <View style={[styles.content, contentStyle]}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 4,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 20,
  },
  handleContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 14,
  },
  handle: {
    width: 40,
    height: 4.5,
    backgroundColor: "#D1D5DB",
    borderRadius: 3,
  },
  content: {
    width: "100%",
  },
});
