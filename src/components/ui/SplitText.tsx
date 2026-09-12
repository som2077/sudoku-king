import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  withDelay,
  withTiming,
  useAnimatedStyle,
  Easing,
  EasingFunction,
  runOnJS,
} from "react-native-reanimated";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type SplitType = "chars" | "words" | "lines";

type AnimVars = {
  opacity?: number;
  translateY?: number;
  translateX?: number;
  scale?: number;
  rotate?: number; // degrees
};

export interface SplitTextProps {
  /** The text to animate */
  text: string;
  /** 'chars' | 'words' | 'lines'  (default: 'chars') */
  splitType?: SplitType;
  /** Stagger delay between each unit in ms (default: 40) */
  delay?: number;
  /** Animation duration in ms per unit (default: 500) */
  duration?: number;
  /** Reanimated easing function (default: Easing.out(Easing.cubic)) */
  ease?: EasingFunction;
  /** Starting animation values */
  from?: AnimVars;
  /** Ending animation values */
  to?: AnimVars;
  /** Trigger animation only when visible (default: true) */
  triggerOnVisible?: boolean;
  /** Called once all units finish animating */
  onAnimationComplete?: () => void;
  /** Style applied to the outer wrapper View */
  containerStyle?: StyleProp<ViewStyle>;
  /** Style applied to each text unit */
  textStyle?: StyleProp<TextStyle>;
  /** Font weight — maps to BricolageGrotesque variants */
  fontWeight?: "400" | "500" | "600" | "700" | "800" | "900" | "bold" | "black";
  /** Font size (default: 16) */
  fontSize?: number;
  /** Text color (default: '#000') */
  color?: string;
  /** Text alignment of the container (default: 'center') */
  textAlign?: "left" | "center" | "right";
  /** Line height multiplier (default: 1.3) */
  lineHeightMultiplier?: number;
  /**
   * Per-word color overrides.
   * Each entry matches a word (trim-compared) and applies a custom color.
   * Example: [{ word: '10-minute', color: '#D88955' }]
   */
  highlightWords?: Array<{ word: string; color: string }>;
}

// ─────────────────────────────────────────────
// Font family resolver (matches ui/Text.tsx)
// ─────────────────────────────────────────────

function resolveFontFamily(weight?: SplitTextProps["fontWeight"]): string {
  switch (weight) {
    case "500":
      return "BricolageGrotesque_500Medium";
    case "600":
      return "BricolageGrotesque_600SemiBold";
    case "700":
    case "bold":
      return "BricolageGrotesque_700Bold";
    case "800":
    case "900":
    case "black":
      return "BricolageGrotesque_800ExtraBold";
    default:
      return "BricolageGrotesque_400Regular";
  }
}

// ─────────────────────────────────────────────
// Split helpers
// ─────────────────────────────────────────────

function splitToUnits(text: string, type: SplitType): string[] {
  switch (type) {
    case "words":
      return text.split(/(\s+)/).filter(Boolean);
    case "lines":
      return text.split("\n").filter(Boolean);
    case "chars":
    default:
      return text.split("");
  }
}

// ─────────────────────────────────────────────
// Single animated unit
// ─────────────────────────────────────────────

interface UnitProps {
  unit: string;
  index: number;
  totalUnits: number;
  delay: number;
  duration: number;
  ease: EasingFunction;
  from: Required<AnimVars>;
  to: Required<AnimVars>;
  play: boolean;
  fontFamily: string;
  textStyle?: StyleProp<TextStyle>;
  onComplete?: () => void;
  /** Optional color override for this specific unit */
  overrideColor?: string;
}

const AnimatedUnit: React.FC<UnitProps> = ({
  unit,
  index,
  totalUnits,
  delay,
  duration,
  ease,
  from,
  to,
  play,
  fontFamily,
  textStyle,
  onComplete,
  overrideColor,
}) => {
  const opacity = useSharedValue(from.opacity);
  const translateY = useSharedValue(from.translateY);
  const translateX = useSharedValue(from.translateX);
  const scale = useSharedValue(from.scale);
  const rotate = useSharedValue(from.rotate);

  const isLast = index === totalUnits - 1;
  const staggerDelay = index * delay;

  useEffect(() => {
    if (!play) return;

    const timing = (toVal: number) =>
      withDelay(staggerDelay, withTiming(toVal, { duration, easing: ease }));

    opacity.value = timing(to.opacity);
    translateY.value = timing(to.translateY);
    translateX.value = timing(to.translateX);
    scale.value = timing(to.scale);

    if (isLast && onComplete) {
      // Fire callback after last unit finishes
      rotate.value = withDelay(
        staggerDelay,
        withTiming(to.rotate, { duration, easing: ease }, (finished) => {
          if (finished) runOnJS(onComplete)();
        }),
      );
    } else {
      rotate.value = timing(to.rotate);
    }
  }, [play]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  // Non-breaking space for whitespace units so they render correctly
  const displayText = unit === " " || unit === "\u00a0" ? "\u00a0" : unit;

  return (
    <Animated.Text
      style={[
        styles.unit,
        { fontFamily },
        textStyle,
        overrideColor ? { color: overrideColor } : undefined,
        animStyle,
      ]}
    >
      {displayText}
    </Animated.Text>
  );
};

// ─────────────────────────────────────────────
// Main SplitText component
// ─────────────────────────────────────────────

const DEFAULT_FROM: Required<AnimVars> = {
  opacity: 0,
  translateY: 30,
  translateX: 0,
  scale: 1,
  rotate: 0,
};

const DEFAULT_TO: Required<AnimVars> = {
  opacity: 1,
  translateY: 0,
  translateX: 0,
  scale: 1,
  rotate: 0,
};

const SplitText: React.FC<SplitTextProps> = ({
  text,
  splitType = "chars",
  delay = 40,
  duration = 500,
  ease = Easing.out(Easing.cubic),
  from = {},
  to = {},
  triggerOnVisible = true,
  onAnimationComplete,
  containerStyle,
  textStyle,
  fontWeight,
  fontSize = 16,
  color = "#000",
  textAlign = "center",
  lineHeightMultiplier = 1.3,
  highlightWords = [],
}) => {
  const [play, setPlay] = useState(!triggerOnVisible);
  const hasPlayed = useRef(false);
  const containerRef = useRef<View>(null);

  const resolvedFrom: Required<AnimVars> = { ...DEFAULT_FROM, ...from };
  const resolvedTo: Required<AnimVars> = { ...DEFAULT_TO, ...to };
  const fontFamily = resolveFontFamily(fontWeight);
  const units = splitToUnits(text, splitType);
  const lineHeight = fontSize * lineHeightMultiplier;

  // Visibility trigger via onLayout → measure
  const triggerIfVisible = useCallback(() => {
    if (hasPlayed.current || !triggerOnVisible) return;
    if (!containerRef.current) return;

    containerRef.current.measure((_x, _y, _w, _h, _px, py) => {
      // py is absolute Y from top of screen
      // Simple heuristic: if the view has been laid out (py >= 0), play.
      // For scroll-based triggering, integrate with your ScrollView ref.
      if (py >= 0) {
        hasPlayed.current = true;
        setPlay(true);
      }
    });
  }, [triggerOnVisible]);

  const handleLayout = useCallback(
    (_e: LayoutChangeEvent) => {
      if (triggerOnVisible) {
        // Small timeout so measure() returns real screen coords
        setTimeout(triggerIfVisible, 50);
      }
    },
    [triggerOnVisible, triggerIfVisible],
  );

  // If triggerOnVisible=false → play immediately
  useEffect(() => {
    if (!triggerOnVisible && !hasPlayed.current) {
      hasPlayed.current = true;
      setPlay(true);
    }
  }, [triggerOnVisible]);

  const handleComplete = useCallback(() => {
    onAnimationComplete?.();
  }, [onAnimationComplete]);

  return (
    <View
      ref={containerRef}
      onLayout={handleLayout}
      style={[
        styles.container,
        {
          justifyContent:
            textAlign === "left"
              ? "flex-start"
              : textAlign === "right"
                ? "flex-end"
                : "center",
        },
        containerStyle,
      ]}
    >
      {units.map((unit, i) => {
        const trimmed = unit.trim();
        const highlight = highlightWords.find((h) => h.word === trimmed);
        return (
          <AnimatedUnit
            key={`${unit}-${i}`}
            unit={unit}
            index={i}
            totalUnits={units.length}
            delay={delay}
            duration={duration}
            ease={ease}
            from={resolvedFrom}
            to={resolvedTo}
            play={play}
            fontFamily={fontFamily}
            textStyle={[{ fontSize, color, lineHeight }, textStyle]}
            onComplete={i === units.length - 1 ? handleComplete : undefined}
            overrideColor={highlight?.color}
          />
        );
      })}
    </View>
  );
};

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-end",
  },
  unit: {
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});

export default SplitText;
