import React, { useRef } from "react";
import { Animated, View, TouchableOpacity, StyleSheet } from "react-native";
import {
  Brain,
  HeartHandshake,
  Flame,
  Crown,
  Check,
} from "lucide-react-native";
import { Text } from "../Text";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

interface Step2PrimaryGoalProps {
  goal: string;
  onSelectGoal: (goalId: string) => void;
}

export function Step2PrimaryGoal({
  goal,
  onSelectGoal,
}: Step2PrimaryGoalProps) {
  const goalItems = [
    {
      id: "focus",
      title: "Sharpen Focus & Memory",
      desc: "Boost mental agility and cognitive alertness daily.",
      icon: <Brain size={22} color="#2563EB" />,
      bg: "#EFF6FF",
    },
    {
      id: "relax",
      title: "Relax & De-stress",
      desc: "Calm, thoughtful problem-solving to unwind anytime.",
      icon: <HeartHandshake size={22} color="#10B981" />,
      bg: "#ECFDF5",
    },
    {
      id: "streak",
      title: "Build a Winning Streak",
      desc: "Maintain daily consistency and collect royal crowns.",
      icon: <Flame size={22} color="#EA580C" fill="#EA580C" />,
      bg: "#FFF7ED",
    },
    {
      id: "master",
      title: "Master Advanced Logic",
      desc: "Learn advanced pencil candidates and beat personal bests.",
      icon: <Crown size={22} color="#D97706" />,
      bg: "#FEF3C7",
    },
  ];
  const cardScales = useRef(goalItems.map(() => new Animated.Value(1))).current;

  const animateCard = (index: number, toValue: number) => {
    Animated.spring(cardScales[index], {
      toValue,
      friction: 6,
      tension: 180,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What is your primary goal?</Text>
      <Text style={styles.stepSubtitle}>
        This helps us personalize your daily challenges, hints, and performance
        stats.
      </Text>

      <View style={styles.cardsList}>
        {goalItems.map((item, index) => {
          const isSelected = goal === item.id;
          return (
            <AnimatedTouchableOpacity
              key={item.id}
              onPress={() => onSelectGoal(item.id)}
              onPressIn={() => animateCard(index, 0.98)}
              onPressOut={() => animateCard(index, 1)}
              style={[
                styles.goalCard,
                { transform: [{ scale: cardScales[index] }] },
                isSelected && styles.goalCardSelected,
              ]}
              activeOpacity={0.75}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`${item.title}, ${item.desc}`}
            >
              <View style={[styles.goalIconWrap, { backgroundColor: item.bg }]}>
                {item.icon}
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.goalCardTitle}>{item.title}</Text>
                <Text style={styles.goalCardDesc}>{item.desc}</Text>
              </View>
              <View
                style={[
                  styles.goalRadio,
                  isSelected && styles.goalRadioSelected,
                ]}
              >
                {isSelected && (
                  <Check size={14} color="#FFFFFF" strokeWidth={3} />
                )}
              </View>
            </AnimatedTouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    width: "100%",
    backgroundColor: "transparent",
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
    lineHeight: 32,
  },
  stepSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 19,
    marginBottom: 28,
  },
  cardsList: {
    gap: 12,
  },
  goalCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFfff",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#11182760",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  goalCardSelected: {
    borderColor: "#00000080",
    backgroundColor: "#F8FAFC",
  },
  goalIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  goalCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 3,
  },
  goalCardDesc: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 16,
  },
  goalRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  goalRadioSelected: {
    borderColor: "#00000030",
    backgroundColor: "#000000",
  },
});
