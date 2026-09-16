import LottieView from "lottie-react-native";

type LottieAnimationProps = {
  source: unknown;
  autoPlay?: boolean;
  loop?: boolean;
  style?: any;
};

export default function LottieAnimation({
  source,
  autoPlay,
  loop,
  style,
}: LottieAnimationProps) {
  return (
    <LottieView
      source={source as any}
      autoPlay={autoPlay}
      loop={loop}
      style={style}
    />
  );
}
