import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGameStore } from "../../store/useGameStore";
import { BarChart2, Star, Clock, XCircle } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getRow, getCol, getBlock } from "../../utils/sudokuLogic";
import LottieAnimation from "../LottieAnimation";

export default function WinScreen({
  onNewGame,
  onHome,
}: {
  onNewGame: () => void;
  onHome: () => void;
}) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const board = useGameStore((s) => s.board);
  const solution = useGameStore((s) => s.solution);
  const timer = useGameStore((s) => s.timer);
  const difficulty = useGameStore((s) => s.difficulty);
  const streak = useGameStore((s) => s.streak);
  const mistakes = useGameStore((s) => s.mistakes);

  const formatWinTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  let holesToDig = 47;
  switch (difficulty) {
    case "Fast":
      holesToDig = 36;
      break;
    case "Easy":
      holesToDig = 41;
      break;
    case "Medium":
      holesToDig = 47;
      break;
    case "Hard":
      holesToDig = 52;
      break;
    case "Expert":
      holesToDig = 56;
      break;
    case "Master":
      holesToDig = 58;
      break;
    case "Extreme":
      holesToDig = 60;
      break;
  }

  const currentFilledCount = board
    ? board.filter(
        (c, index) =>
          c.value !== null && !c.isError && solution[index] === c.value,
      ).length
    : 0;
  const initialClues = 81 - holesToDig;
  const filledByUser = Math.max(0, currentFilledCount - initialClues);
  const finalScore = filledByUser * 50;

  // Mini board rendering
  const boardSize = width * 0.6;
  const cellSize = (boardSize - 4) / 9;

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 100 }]}>
      <LinearGradient
        colors={["#00B4FF", "#007AFF"]}
        style={StyleSheet.absoluteFill}
      />

      <View
        style={[StyleSheet.absoluteFill, { zIndex: 50 }]}
        pointerEvents="none"
      >
        <LottieAnimation
          source={require("../../../assets/Confetti.json")}
          autoPlay
          loop={false}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 20,
          alignItems: "center",
        }}
      >
        <Text style={styles.title}>Level Completed!</Text>

        {/* Mini Board */}
        <View
          style={[styles.miniBoard, { width: boardSize, height: boardSize }]}
        >
          {board &&
            board.length === 81 &&
            Array.from({ length: 9 }).map((_, r) => (
              <View
                key={`r-${r}`}
                style={{ flexDirection: "row", height: cellSize }}
              >
                {Array.from({ length: 9 }).map((_, c) => {
                  const cell = board[r * 9 + c];
                  const isThickBottom = r === 2 || r === 5;
                  const isThickRight = c === 2 || c === 5;
                  return (
                    <View
                      key={`c-${c}`}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        borderWidth: 0.5,
                        borderColor: "#CBD5E1",
                        borderBottomWidth: isThickBottom ? 2 : 0.5,
                        borderRightWidth: isThickRight ? 2 : 0.5,
                        borderBottomColor: isThickBottom
                          ? "#1E293B"
                          : "#CBD5E1",
                        borderRightColor: isThickRight ? "#1E293B" : "#CBD5E1",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: cellSize * 0.6,
                          color: cell?.isLocked ? "#1E293B" : "#3B82F6",
                          fontWeight: cell?.isLocked ? "500" : "400",
                        }}
                      >
                        {cell?.value}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))}
        </View>

        {/* Streak Card */}
        {mistakes === 0 ? (
          <View style={styles.streakCard}>
            <Text style={styles.streakText}>
              You've solved{" "}
              <Text style={{ color: "#FDE047", fontWeight: "bold" }}>
                {streak} puzzles
              </Text>{" "}
              in a row without mistakes!
            </Text>
          </View>
        ) : (
          <View style={styles.streakCard}>
            <Text style={styles.streakText}>
              Well done! You completed the puzzle with{" "}
              <Text style={{ color: "#FCA5A5", fontWeight: "bold" }}>
                {mistakes} mistake{mistakes > 1 ? "s" : ""}
              </Text>
              .
            </Text>
          </View>
        )}

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <View style={styles.statLeft}>
              <BarChart2 color="#FFFFFF" size={20} />
              <Text style={styles.statLabel}>Difficulty</Text>
            </View>
            <Text style={styles.statValue}>{difficulty}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.statRow}>
            <View style={styles.statLeft}>
              <Star color="#FFFFFF" size={20} />
              <Text style={styles.statLabel}>Score</Text>
            </View>
            <Text style={styles.statValue}>{Math.max(0, finalScore)}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.statRow}>
            <View style={styles.statLeft}>
              <Clock color="#FFFFFF" size={20} />
              <Text style={styles.statLabel}>Time</Text>
            </View>
            <Text style={styles.statValue}>{formatWinTime(timer)}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.statRow}>
            <View style={styles.statLeft}>
              <XCircle color="#FFFFFF" size={20} />
              <Text style={styles.statLabel}>Mistakes</Text>
            </View>
            <Text style={styles.statValue}>{mistakes}/3</Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Buttons */}
      <View
        style={[
          styles.bottomContainer,
          { paddingBottom: Math.max(insets.bottom, 20) },
        ]}
      >
        <TouchableOpacity style={styles.newGameBtn} onPress={onNewGame}>
          <Text style={styles.newGameText}>New Game</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 15, marginBottom: 10 }}
          onPress={onHome}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 16 }}>
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 30,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  miniBoard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 2,
    borderWidth: 2,
    borderColor: "#1E293B",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  seeAllBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  seeAllText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  streakCard: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  streakText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  statsCard: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  statLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    width: "100%",
    marginVertical: 4,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 24,
    backgroundColor: "transparent",
    alignItems: "center",
  },
  newGameBtn: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  newGameText: {
    color: "#007AFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
