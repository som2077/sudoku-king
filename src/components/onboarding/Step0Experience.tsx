import React, { useEffect, useRef } from "react";
import {
  Animated,
  PanResponder,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Easing } from "react-native-reanimated";
import { Sparkles, Zap, Crown } from "lucide-react-native";
import { Text } from "../Text";
import SplitText from "../ui/SplitText";
import { Difficulty } from "../../utils/sudokuLogic";
import { haptics } from "../../utils/haptics";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

interface Step0ExperienceProps {
  experience: Difficulty;
  onSelectExperience: (difficulty: Difficulty) => void;
}

export function Step0Experience({
  experience,
  onSelectExperience,
}: Step0ExperienceProps) {
  const bubbleScales = [
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
  ];
  const trackProgress = useRef(
    new Animated.Value(
      experience === "Easy" ? 0 : experience === "Medium" ? 1 : 2,
    ),
  ).current;
  const trackWidth = useRef(0);
  const dragStartProgress = useRef(0);

  const difficultyIndex =
    experience === "Easy" ? 0 : experience === "Medium" ? 1 : 2;
  const currentTrackProgress = useRef(difficultyIndex);
  const lastHapticIndex = useRef(difficultyIndex);
  const isDraggingTrack = useRef(false);

  useEffect(() => {
    if (isDraggingTrack.current) return;
    currentTrackProgress.current = difficultyIndex;
    lastHapticIndex.current = difficultyIndex;
    Animated.timing(trackProgress, {
      toValue: difficultyIndex,
      duration: 260,
      easing: undefined,
      useNativeDriver: false,
    }).start();
  }, [difficultyIndex, trackProgress]);

  const updateTrackFromDrag = (progress: number) => {
    const clampedProgress = Math.max(0, Math.min(2, progress));
    const nearestIndex = Math.round(clampedProgress);
    if (nearestIndex !== lastHapticIndex.current) {
      lastHapticIndex.current = nearestIndex;
      haptics.selection();
      onSelectExperience(
        nearestIndex === 0 ? "Easy" : nearestIndex === 1 ? "Medium" : "Hard",
      );
    }
    currentTrackProgress.current = clampedProgress;
    trackProgress.setValue(clampedProgress);
  };

  const commitTrackSelection = () => {
    const selectedIndex = Math.round(
      Math.max(0, Math.min(2, currentTrackProgress.current)),
    );
    currentTrackProgress.current = selectedIndex;
    Animated.spring(trackProgress, {
      toValue: selectedIndex,
      friction: 7,
      tension: 170,
      useNativeDriver: false,
    }).start();
    onSelectExperience(
      selectedIndex === 0 ? "Easy" : selectedIndex === 1 ? "Medium" : "Hard",
    );
  };

  const trackPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        if (!trackWidth.current) return;
        isDraggingTrack.current = true;
        dragStartProgress.current = Math.max(
          0,
          Math.min(
            2,
            ((event.nativeEvent.locationX - 12) / trackWidth.current) * 2,
          ),
        );
        updateTrackFromDrag(dragStartProgress.current);
      },
      onPanResponderMove: (_, gestureState) => {
        if (!trackWidth.current) return;
        updateTrackFromDrag(
          dragStartProgress.current +
            (gestureState.dx / trackWidth.current) * 2,
        );
      },
      onPanResponderRelease: () => {
        isDraggingTrack.current = false;
        commitTrackSelection();
      },
      onPanResponderTerminate: () => {
        isDraggingTrack.current = false;
        commitTrackSelection();
      },
    }),
  ).current;

  const animateBubble = (index: number, toValue: number) => {
    Animated.spring(bubbleScales[index], {
      toValue,
      friction: 6,
      tension: 180,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.stepContainer}>
      <SplitText
        text="How challenging do you want your Sudoku puzzles to be?"
        splitType="words"
        triggerOnVisible={false}
        delay={40}
        duration={500}
        ease={Easing.out(Easing.cubic)}
        from={{ opacity: 0, translateY: 10 }}
        to={{ opacity: 1, translateY: 0 }}
        fontSize={25}
        fontWeight="800"
        color="#111827"
        lineHeightMultiplier={1.24}
        textAlign="left"
        containerStyle={styles.stepTitleContainer}
      />
      <Text style={styles.stepSubtitle}>
        Choose a starting level that feels right for your daily practice.
      </Text>

      <View style={styles.difficultySelector}>
        <Text style={styles.selectorCaption}>Starting difficulty</Text>
        <Text style={styles.selectorValue}>
          {experience === "Easy"
            ? "Beginner"
            : experience === "Medium"
              ? "Casual"
              : "Expert"}
        </Text>

        <View style={styles.choiceRow}>
          {/* Option 1: Beginner */}
          <View style={styles.circleItem}>
            <AnimatedTouchableOpacity
              onPress={() => onSelectExperience("Easy")}
              onPressIn={() => animateBubble(0, 0.94)}
              onPressOut={() => animateBubble(0, 1)}
              style={[
                styles.circleBubble,
                { transform: [{ scale: bubbleScales[0] }] },
                { backgroundColor: "#111827" },
                experience === "Easy" && styles.circleBubbleSelected,
              ]}
              activeOpacity={0.8}
              accessibilityRole="radio"
              accessibilityState={{ checked: experience === "Easy" }}
              accessibilityLabel="Beginner, learning rules"
            >
              <Sparkles
                size={36}
                color="#FFFFFF"
                fill="#FFFFFF"
                strokeWidth={1.5}
              />
            </AnimatedTouchableOpacity>
            <Text
              style={[
                styles.circleLabel,
                experience === "Easy" && styles.circleLabelSelected,
              ]}
            >
              Beginner
            </Text>
            <Text style={styles.circleSubLabel}>Learning rules</Text>
          </View>

          {/* Option 2: Casual */}
          <View style={styles.circleItem}>
            <AnimatedTouchableOpacity
              onPress={() => onSelectExperience("Medium")}
              onPressIn={() => animateBubble(1, 0.94)}
              onPressOut={() => animateBubble(1, 1)}
              style={[
                styles.circleBubble,
                { transform: [{ scale: bubbleScales[1] }] },
                { backgroundColor: "#D9F99D" },
                experience === "Medium" && styles.circleBubbleSelected,
              ]}
              activeOpacity={0.8}
              accessibilityRole="radio"
              accessibilityState={{ checked: experience === "Medium" }}
              accessibilityLabel="Casual, play for fun"
            >
              <Zap size={36} color="#365314" fill="#365314" strokeWidth={1.5} />
            </AnimatedTouchableOpacity>
            <Text
              style={[
                styles.circleLabel,
                experience === "Medium" && styles.circleLabelSelected,
              ]}
            >
              Casual
            </Text>
            <Text style={styles.circleSubLabel}>Play for fun</Text>
          </View>

          {/* Option 3: Expert */}
          <View style={styles.circleItem}>
            <AnimatedTouchableOpacity
              onPress={() => onSelectExperience("Hard")}
              onPressIn={() => animateBubble(2, 0.94)}
              onPressOut={() => animateBubble(2, 1)}
              style={[
                styles.circleBubble,
                { transform: [{ scale: bubbleScales[2] }] },
                { backgroundColor: "#FEF08A" },
                experience === "Hard" && styles.circleBubbleSelected,
              ]}
              activeOpacity={0.8}
              accessibilityRole="radio"
              accessibilityState={{ checked: experience === "Hard" }}
              accessibilityLabel="Expert, complex logic"
            >
              <Crown
                size={36}
                color="#713F12"
                fill="#713F12"
                strokeWidth={1.5}
              />
            </AnimatedTouchableOpacity>
            <Text
              style={[
                styles.circleLabel,
                experience === "Hard" && styles.circleLabelSelected,
              ]}
            >
              Expert
            </Text>
            <Text style={styles.circleSubLabel}>Complex logic</Text>
          </View>
        </View>

        <View
          style={styles.trackTouchArea}
          onLayout={(event) => {
            trackWidth.current = Math.max(
              1,
              event.nativeEvent.layout.width - 24,
            );
          }}
          {...trackPanResponder.panHandlers}
          accessibilityRole="adjustable"
          accessibilityLabel="Puzzle difficulty"
        >
          <View style={styles.difficultyTrack} pointerEvents="none">
            <Animated.View
              style={[
                styles.trackMarker,
                {
                  left: trackProgress.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: ["0%", "50%", "100%"],
                  }),
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            {experience === "Easy"
              ? "You will start with gentle puzzles"
              : experience === "Medium"
                ? "You will start with balanced puzzles"
                : "You will start with challenging puzzles"}
          </Text>
          <Text style={styles.infoText}>
            {experience === "Easy"
              ? "Perfect for learning the rules and building confidence."
              : experience === "Medium"
                ? "A thoughtful mix of focus, logic, and satisfying progress."
                : "Designed to stretch your logic and sharpen advanced skills."}
          </Text>
          <Text style={styles.infoMeta}>
            Smart assists will adjust as your skills improve.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    width: "100%",
    flex: 1,
    minHeight: 500,
    backgroundColor: "transparent",
  },
  stepTitleContainer: {
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 19,
    marginBottom: 0,
  },
  difficultySelector: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 42,
  },
  circleItem: {
    alignItems: "center",
    width: "31%",
  },
  choiceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  selectorCaption: {
    fontSize: 13,
    color: "#111827",
    textAlign: "center",
    marginBottom: -4,
  },
  selectorValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 24,
  },
  circleBubble: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderWidth: 3,
    borderColor: "transparent",
  },
  circleBubbleSelected: {
    borderColor: "#2563EB",
    shadowColor: "#2563EB",
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 7,
  },
  circleLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    marginTop: 7,
  },
  circleLabelSelected: {
    color: "#2563EB",
  },
  circleSubLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 2,
  },
  difficultyTrack: {
    width: "100%",
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    position: "relative",
  },
  trackTouchArea: {
    width: "100%",
    height: 44,
    justifyContent: "center",
    paddingHorizontal: 65,
  },
  trackMarker: {
    position: "absolute",
    top: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#1F2937",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ translateX: -12 }],
    shadowColor: "#111827",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  infoCard: {
    backgroundColor: "#F8F7FC",
    borderRadius: 14,
    padding: 14,
    marginTop: 28,
  },
  infoTitle: {
    fontSize: 13,
    color: "#111827",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 11,
    color: "#6B7280",
    lineHeight: 16,
    marginBottom: 6,
  },
  infoMeta: {
    fontSize: 10,
    color: "#9CA3AF",
  },
});
