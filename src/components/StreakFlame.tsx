import React from "react";
import { UIManager, Platform } from "react-native";
import { Flame } from "lucide-react-native";

let LottieView: any = null;
try {
  LottieView = require("lottie-react-native").default;
} catch {
  LottieView = null;
}

interface StreakFlameProps {
  size?: number;
  color?: string;
}

export const StreakFlame: React.FC<StreakFlameProps> = React.memo(
  ({ size = 20, color = "#F97316" }) => {
    const isLottieSupported = React.useMemo(() => {
      if (!LottieView) return false;
      if (Platform.OS === "web") return true;
      try {
        const config =
          UIManager.getViewManagerConfig?.("LottieAnimationView") ||
          UIManager.getViewManagerConfig?.("RCTLottieAnimationView") ||
          (UIManager as any).LottieAnimationView;
        return Boolean(config);
      } catch {
        return false;
      }
    }, []);

    if (isLottieSupported && LottieView) {
      return (
        <LottieView
          source={require("../../assets/fire.json")}
          autoPlay
          loop
          style={{ width: size, height: size }}
        />
      );
    }

    return <Flame size={size} color={color} fill={color} />;
  }
);
