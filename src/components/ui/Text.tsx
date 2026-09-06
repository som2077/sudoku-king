import React from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
} from "react-native";

export function Text(props: RNTextProps) {
  const { style, ...rest } = props;
  const flatStyle = StyleSheet.flatten(style || {}) as any;

  let fontFamily = "BricolageGrotesque_400Regular";

  const weight = flatStyle?.fontWeight;
  if (weight === "500") fontFamily = "BricolageGrotesque_500Medium";
  if (weight === "600") fontFamily = "BricolageGrotesque_600SemiBold";
  if (weight === "700" || weight === "bold")
    fontFamily = "BricolageGrotesque_700Bold";
  if (weight === "800" || weight === "900" || weight === "black")
    fontFamily = "BricolageGrotesque_800ExtraBold";

  return (
    <RNText
      {...rest}
      style={[
        style,
        { fontFamily, fontWeight: undefined }, // clear fontWeight to avoid bolding a bold font on iOS
      ]}
    />
  );
}
