import React, { useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { Star } from "lucide-react-native";
import { Text } from "../Text";

interface Step5RatingProps {
  rating: number;
  onSelectRating: (rating: number) => void;
}

const STAR_COLOR = "#A9683A";

function ReviewStars() {
  return (
    <View style={styles.reviewStars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          color={STAR_COLOR}
          fill={STAR_COLOR}
          strokeWidth={1.5}
        />
      ))}
    </View>
  );
}

export function Step5Rating({ rating, onSelectRating }: Step5RatingProps) {
  const starScales = useRef(
    Array.from({ length: 5 }, () => new Animated.Value(1)),
  ).current;

  const animateStar = (index: number, toValue: number) => {
    Animated.spring(starScales[index], {
      toValue,
      friction: 5,
      tension: 180,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Give us a rating</Text>

      <View style={styles.ratingSummaryCard}>
        <Text style={styles.laurel}>❮</Text>
        <View style={styles.summaryCenter}>
          <View style={styles.summaryTopRow}>
            <Text style={styles.summaryScore}>4.8</Text>
            <ReviewStars />
          </View>
          <Text style={styles.summaryCaption}>100K+ App Ratings</Text>
        </View>
        <Text style={styles.laurel}>❯</Text>
      </View>

      <View style={styles.ratingStarsRow}>
        {[1, 2, 3, 4, 5].map((starNumber, index) => {
          const isSelected = starNumber <= rating;
          return (
            <Animated.View
              key={starNumber}
              style={{ transform: [{ scale: starScales[index] }] }}
            >
              <TouchableOpacity
                onPress={() => onSelectRating(starNumber)}
                onPressIn={() => animateStar(index, 0.86)}
                onPressOut={() => animateStar(index, 1)}
                style={styles.ratingStarButton}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`${starNumber} star${starNumber === 1 ? "" : "s"}`}
                accessibilityState={{ selected: isSelected }}
              >
                <Star
                  size={36}
                  color={isSelected ? STAR_COLOR : "#D1D5DB"}
                  fill={isSelected ? STAR_COLOR : "transparent"}
                  strokeWidth={1.8}
                />
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AM</Text>
          </View>
          <Text style={styles.reviewerName}>Alex Morgan</Text>
          <ReviewStars />
        </View>
        <Text style={styles.reviewText}>
          A simple, calming way to sharpen my focus every day.
        </Text>
      </View>

      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View style={[styles.avatar, styles.avatarAlt]}>
            <Text style={styles.avatarText}>BM</Text>
          </View>
          <Text style={styles.reviewerName}>Benny Marcs</Text>
          <ReviewStars />
        </View>
        <Text style={styles.reviewText}>
          The time I have saved by taking a quick puzzle break has been
          invaluable.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepContainer: { width: "100%", paddingBottom: 22 },
  title: {
    color: "#111111",
    fontSize: 25,
    fontWeight: "800",
    lineHeight: 32,
    marginBottom: 12,
  },
  ratingSummaryCard: {
    minHeight: 70,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#FFFFFF70",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  summaryCenter: { alignItems: "center", flex: 1 },
  summaryTopRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  summaryScore: { color: "#242424", fontSize: 17, fontWeight: "800" },
  summaryCaption: { color: "#777777", fontSize: 12, marginTop: 1 },
  laurel: {
    color: STAR_COLOR,
    fontSize: 32,
    fontWeight: "300",
    opacity: 0.9,
  },
  reviewStars: { flexDirection: "row", alignItems: "center", gap: 2 },
  ratingStarsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 18,
  },
  ratingStarButton: { paddingHorizontal: 5 },
  reviewCard: {
    backgroundColor: "#FFFFFF90",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E7E7E7",
    padding: 14,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#7C8B9D",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  avatarAlt: { backgroundColor: "#555D68" },
  avatarText: { color: "#FFFFFF", fontSize: 9, fontWeight: "800" },
  reviewerName: {
    color: "#333333",
    fontSize: 12,
    fontWeight: "800",
    flex: 1,
  },
  reviewText: { color: "#686868", fontSize: 13, lineHeight: 18 },
});
