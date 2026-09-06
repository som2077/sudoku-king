import { TouchableOpacity, View } from "react-native";
import { Text } from '../ui/Text';
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
  // ── Background ──────────────────────────────────────────────────────────────
  let bg = "#FFFFFF";
  if (isSelected) bg = "#1C1F2E";
  else if (isError) bg = "#FFF0F0";
  else if (isSameValue) bg = "#DDE3FF";
  else if (isHighlighted) bg = "#F0F0F8";
  else if (isLocked) bg = "#F9F9FB";

  // ── Text color ───────────────────────────────────────────────────────────────
  let textColor = "#3B82F6"; // user-placed number: blue
  if (isSelected) textColor = "#FFFFFF";
  else if (isLocked) textColor = "#1C1F2E";
  else if (isError) textColor = "#EF4444";

  // ── Notes rendering ─────────────────────────────────────────────────────────
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
          padding: 1,
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
                fontWeight: "600",
                color: active
                  ? isSelected
                    ? "#FFFFFF"
                    : "#1C1F2E"
                  : "transparent",
                lineHeight: 13,
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
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: bg,
      }}
    >
      {value ? (
        <Text
          style={{
            fontSize: 20,
            fontWeight: isLocked ? "700" : "500",
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
