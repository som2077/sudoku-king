import type { ComponentType } from "react";
import type { ViewStyle } from "react-native";

type LottieAnimationProps = {
  source: unknown;
  autoPlay?: boolean;
  loop?: boolean;
  style?: ViewStyle | ViewStyle[];
};

declare const LottieAnimation: ComponentType<LottieAnimationProps>;
export default LottieAnimation;
