import React, { memo } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Text } from "../ui/Text";
import { haptics } from "../../utils/haptics";

interface CellProps {
  index: number;
  value: number | null;
  notes: number;
  isSelected: boolean;
  isLocked: boolean;
  isError: boolean;
  isHighlighted: boolean;
  isSameValue: boolean;
  isBlockCompleted: boolean;
  onPress: (index: number) => void;
}

const Cell = ({
  index,
  value,
  notes,
  isSelected,
  isLocked,
  isError,
  isHighlighted,
  isSameValue,
  isBlockCompleted,
  onPress,
}: CellProps) => {
  // ── Background Color Palette ──────────────────────────────────────────────
  let bg = "#FFFFFF";
  if (isSelected) {
    bg = "#2563EB"; // Brand royal blue for active selected cell
  } else if (isError) {
    bg = "#FEE2E2"; // Soft error red
  } else if (isBlockCompleted) {
    bg = "#DCFCE7"; // Subtle success tint for completed 3x3 blocks
  } else if (isSameValue && value !== null) {
    bg = "#DBEAFE"; // Distinct soft blue highlight for matching numbers across the board
  } else if (isHighlighted) {
    bg = "#F0F4FF"; // Subtle lavender-blue guidance tint for row/col/block crosshair
  }

  // ── Text Color ──────────────────────────────────────────────────────────────
  let textColor = "#2563EB"; // Vibrant brand blue for user-entered numbers
  if (isSelected) {
    textColor = "#FFFFFF"; // Pure white text when cell is selected
  } else if (isError) {
    textColor = "#DC2626"; // Clear crimson red for errors
  } else if (isLocked) {
    textColor = "#0F172A"; // Deep bold dark slate for initial given clues
  } else if (isSameValue) {
    textColor = "#1D4ED8"; // Deep saturated blue for matching numbers
  }

  // ── Notes (Pencil marks) Rendering ──────────────────────────────────────────
  const renderNotes = () => {
    if (notes === 0) return null;
    return (
      <View style={styles.notesGrid}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
          const active = !!(notes & (1 << num));
          return (
            <Text
              key={num}
              style={[
                styles.noteText,
                {
                  color: active
                    ? isSelected
                      ? "#FFFFFF"
                      : "#1D4ED8"
                    : "transparent",
                },
              ]}
            >
              {num}
            </Text>
          );
        })}
      </View>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.65}
      onPress={() => {
        // Keep board selection tactile while respecting the user's vibration setting.
        haptics.selection();
        haptics.tapSound();
        onPress(index);
      }}
      style={[styles.cell, { backgroundColor: bg }]}
    >
      {value ? (
        <Text
          style={[
            styles.valueText,
            {
              color: textColor,
              fontWeight: isLocked ? "700" : "600",
            },
          ]}
        >
          {value}
        </Text>
      ) : (
        renderNotes()
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  valueText: {
    fontSize: 25,
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  notesGrid: {
    flex: 1,
    width: "100%",
    height: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  noteText: {
    width: "33.33%",
    textAlign: "center",
    fontSize: 9.5,
    fontWeight: "700",
    includeFontPadding: false,
    lineHeight: 12,
  },
});

export default memo(Cell);
