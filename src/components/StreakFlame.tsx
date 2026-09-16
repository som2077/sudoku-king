import React from "react";
import { Platform } from "react-native";
import { Flame } from "lucide-react-native";
import LottieAnimation from "./LottieAnimation";

interface StreakFlameProps {
  size?: number;
  color?: string;
}

export const StreakFlame = React.memo(function StreakFlame({
  size = 20,
  color = "#F97316",
}: StreakFlameProps) {
  if (Platform.OS === "web") {
    return <Flame size={size} color={color} fill={color} />;
  }

  return (
    <LottieAnimation
      source={require("../../assets/fire.json")}
      autoPlay
      loop
      style={{ width: size, height: size }}
    />
  );
});
