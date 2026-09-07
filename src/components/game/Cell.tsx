import { TouchableOpacity, View } from "react-native";
import { Text } from "../ui/Text";
import { memo } from "react";

interface CellProps {
  index: number;
  value: number | null;
  notes: number;
  isSelected: boolean;
  isLocked: boolean;
  isError: boolean;
  isHighlighted: boolean;
  isSameValue: boolean;
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
  onPress,
}: CellProps) => {
  // ── Background Color Palette (Exact Match to Reference Screenshot) ──────────
  let bg = "#FFFFFF";
  if (isSelected) {
    bg = "#5D69F9"; // Solid royal/indigo blue
  } else if (isError) {
    bg = "#FEE2E2"; // Soft error red
  } else if (isSameValue || isHighlighted) {
    bg = "#EBEEFD"; // Soft lavender-blue tint for crosshair and matching numbers
  }

  // ── Text Color ──────────────────────────────────────────────────────────────
  let textColor = "#2563EB"; // Vibrant brand blue for user entries
  if (isSelected) {
    textColor = "#FFFFFF"; // Pure white text when cell is selected
  } else if (isError) {
    textColor = "#EF4444";
  } else if (isLocked) {
    textColor = "#1F2224"; // Rich dark slate/charcoal for fixed clues
  }

  // ── Notes Rendering ─────────────────────────────────────────────────────────
  const renderNotes = () => {
    if (notes === 0) return null;
    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          flexDirection: "row",
          flexWrap: "wrap",
          padding: 2,
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
          const active = !!(notes & (1 << num));
          return (
            <Text
              key={num}
              style={{
                width: "33.33%",
                textAlign: "center",
                fontSize: 9,
                fontWeight: "700",
                color: active
                  ? isSelected
                    ? "#FFFFFF"
                    : "#5D69F9"
                  : "transparent",
                lineHeight: 12,
              }}
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
      activeOpacity={0.7}
      onPress={() => onPress(index)}
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: bg,
      }}
    >
      {value ? (
        <Text
          style={{
            fontSize: 23,
            fontWeight: "600",
            color: textColor,
          }}
        >
          {value}
        </Text>
      ) : (
        renderNotes()
      )}
    </TouchableOpacity>
  );
};

export default memo(Cell);
