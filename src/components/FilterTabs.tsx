import React from "react";
import { Text } from '../components/Text';
import { Pressable, StyleSheet, View } from "react-native";

export type FilterTab = "Daily" | "Weekly" | "Monthly" | "90 Days";

export const TABS: readonly FilterTab[] = [
  "Daily",
  "Weekly",
  "Monthly",
  "90 Days",
];

interface FilterTabsProps {
  value: FilterTab;
  onChange: (tab: FilterTab) => void;
}

export function FilterTabs({
  value,
  onChange,
}: FilterTabsProps) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => (
        <Pressable
          key={tab}
          onPress={() => onChange(tab)}
          style={[
            styles.tab,
            value === tab && styles.tabActive,
            { zIndex: value === tab ? 10 : 0 },
          ]}
        >
          <Text style={[styles.label, value === tab && styles.labelActive]}>
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#F8F7FC",
    padding: 2,
    borderRadius: 18,
    shadowColor: "#FFFFFF10",
    shadowOpacity: 0.02,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
    borderColor: "#E9EBF8",
    borderWidth: 0.5,
  },
  tab: {
    flex: 1,
    paddingVertical: 9.5,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  label: {
    fontSize: 12.5,
    fontWeight: "500",
    color: "#1C1C1E",
  },
  labelActive: {
    fontWeight: "bold",
    color: "#1C1C1E",
  },
});
