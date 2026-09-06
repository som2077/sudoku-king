import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

const GRADIENT_COLORS = ["#F3D1C390", "#ABB9C740", "#FFFFFF"] as const;
const GRADIENT_LOCATIONS = [0.01, 0.3, 0.5] as const;
const GRADIENT_START = { x: 2.6, y: 0.35 };
const GRADIENT_END = { x: 1.6, y: 1.2 };

export const AppGradientBackground = React.memo(function AppGradientBackground({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={GRADIENT_COLORS}
        locations={GRADIENT_LOCATIONS}
        start={GRADIENT_START}
        end={GRADIENT_END}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
