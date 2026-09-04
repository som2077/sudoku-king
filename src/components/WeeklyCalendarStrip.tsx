import React, { useCallback, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

const DAY_LABELS: readonly string[] = ["M", "T", "W", "T", "F", "S", "S"];

const isSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const toLocalDateString = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

interface DayCellProps {
  date: Date;
  dayLabel: string;
  isActive: boolean;
  onPress: (date: Date) => void;
  streakStatus: "streak" | "missed" | "future";
}

const DayCell = React.memo(function DayCell({
  date,
  dayLabel,
  isActive,
  onPress,
  streakStatus,
}: DayCellProps) {
  const handlePress = useCallback(() => onPress(date), [onPress, date]);

  const isFuture = streakStatus === "future";

  let borderColor = "#C4C4C4";
  if (isFuture) borderColor = "transparent";
  else if (isActive) borderColor = "#1D1A27";
  else if (streakStatus === "streak") borderColor = "#22c55e90";
  else if (streakStatus === "missed") borderColor = "#ef444490";

  return (
    <Pressable
      style={{ alignItems: "center", gap: 6, width: 40 }}
      accessibilityRole="button"
      accessibilityLabel={`Select ${date.toDateString()}`}
      onPress={handlePress}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: isActive ? "bold" : "500",
          color: isActive ? "#1D1A27" : isFuture ? "#00000090" : "#555555",
        }}
      >
        {String(date.getDate())}
      </Text>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 30,
          backgroundColor: isActive ? "#1D1A27" : "#FFFFFF",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: isActive || isFuture ? 0 : 1.5,
          borderStyle: isFuture ? "solid" : "dashed",
          borderColor,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: isActive ? "bold" : "500",
            color: isActive ? "#FFFFFF" : isFuture ? "#00000090" : "#555555",
          }}
        >
          {dayLabel}
        </Text>
      </View>
    </Pressable>
  );
});

export function WeeklyCalendarStrip() {
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  const activeDates = new Set([toLocalDateString(new Date())]); // Mocked for now

  const weekDates = useMemo(() => {
    const startOfWeek = getStartOfWeek(selectedDate);
    return Array.from({ length: DAY_LABELS.length }, (_, index) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + index);
      return day;
    });
  }, [selectedDate]);

  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const today = useMemo(() => startOfDay(new Date()), []);

  return (
    <View className="px-[5px] py-1">
      <View className="flex-row items-center justify-between">
        {weekDates.map((date, index) => {
          const dateAtMidnight = startOfDay(date);
          const diffTime = dateAtMidnight.getTime() - today.getTime();
          const diffDaysFromToday = Math.round(diffTime / (1000 * 60 * 60 * 24));

          let streakStatus: "streak" | "missed" | "future";
          if (diffDaysFromToday > 0) {
            streakStatus = "future";
          } else {
            const dateStr = toLocalDateString(dateAtMidnight);
            streakStatus = activeDates.has(dateStr) ? "streak" : "missed";
          }

          return (
            <DayCell
              key={toLocalDateString(date)}
              date={date}
              dayLabel={DAY_LABELS[index]}
              isActive={isSameDay(date, selectedDate)}
              onPress={handleSelectDate}
              streakStatus={streakStatus}
            />
          );
        })}
      </View>
    </View>
  );
}
