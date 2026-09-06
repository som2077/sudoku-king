import React, { useState, useMemo } from 'react';
import { Text } from '../components/Text';
import {
  View, TouchableOpacity, StyleSheet, Dimensions
} from 'react-native';
import { Trophy, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../store/useGameStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DAYS_LABEL = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Build calendar grid for a specific month
function buildCalendarGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (firstDay + 6) % 7; // Convert Sun-first to Mon-first

  const grid: (number | null)[][] = [];
  let day = 1;

  for (let row = 0; row < 6; row++) {
    const week: (number | null)[] = [];
    for (let col = 0; col < 7; col++) {
      const cellIndex = row * 7 + col;
      if (cellIndex < offset || day > daysInMonth) {
        week.push(null);
      } else {
        week.push(day++);
      }
    }
    grid.push(week);
    if (day > daysInMonth) break;
  }
  return grid;
}

export function DailyChallengesScreen() {
  const { startDailyChallenge, dailyChallengesProgress } = useGameStore();

  const now = new Date();
  const todayDate = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const [visibleMonthIdx, setVisibleMonthIdx] = useState(currentMonth);

  // Keep track of selected date per month (default to today for current month, or 1st for others)
  const [selectedDates, setSelectedDates] = useState<Record<number, number>>({
    [currentMonth]: todayDate,
  });

  const handlePlay = () => {
    const selectedDay = selectedDates[visibleMonthIdx] || 1;
    const mStr = String(visibleMonthIdx + 1).padStart(2, '0');
    const dStr = String(selectedDay).padStart(2, '0');
    const dateStr = `${currentYear}-${mStr}-${dStr}`;
    startDailyChallenge(dateStr);
  };

  const changeMonth = (direction: 1 | -1) => {
    setVisibleMonthIdx((prev) => {
      const next = prev + direction;
      if (next < 0 || next > 11) return prev; // Limit to Jan-Dec of current year
      return next;
    });
  };

  const grid = useMemo(() => buildCalendarGrid(currentYear, visibleMonthIdx), [currentYear, visibleMonthIdx]);
  const dateObj = new Date(currentYear, visibleMonthIdx, 1);
  const monthName = dateObj.toLocaleString('default', { month: 'long' });
  const totalDays = new Date(currentYear, visibleMonthIdx + 1, 0).getDate();

  const selectedDate = selectedDates[visibleMonthIdx] || 1;

  // Calculate completed count for this month
  let completedCount = 0;
  for (let d = 1; d <= totalDays; d++) {
    const mStr = String(visibleMonthIdx + 1).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    if (dailyChallengesProgress[`${currentYear}-${mStr}-${dStr}`]) {
      completedCount++;
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {/* ── Blue gradient hero banner ── */}
      <LinearGradient
        colors={['#1565C0', '#2196F3', '#42A5F5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroBanner}
      >
        <SafeAreaView edges={['top']} style={{ alignItems: 'center' }}>
          <Text style={styles.heroTitle}>Daily Challenges</Text>
        </SafeAreaView>

        {/* Month Navigation Arrows & Trophy */}
        <View style={styles.heroContentRow}>
          <TouchableOpacity 
            onPress={() => changeMonth(-1)} 
            disabled={visibleMonthIdx === 0}
            style={[styles.navArrow, visibleMonthIdx === 0 && { opacity: 0.3 }]}
          >
            <ChevronLeft color="#FFFFFF" size={32} />
          </TouchableOpacity>

          <View style={styles.trophyContainer}>
            <View style={styles.trophyGlow} />
            <Trophy size={140} color="#E3F2FD" strokeWidth={1} fill="#0D47A1" />
          </View>

          <TouchableOpacity 
            onPress={() => changeMonth(1)}
            disabled={visibleMonthIdx === 11}
            style={[styles.navArrow, visibleMonthIdx === 11 && { opacity: 0.3 }]}
          >
            <ChevronRight color="#FFFFFF" size={32} />
          </TouchableOpacity>
        </View>

        {/* Decorative bokeh circles */}
        <View style={[styles.bokeh, { width: 80, height: 80, top: 60, left: 20, opacity: 0.15 }]} />
        <View style={[styles.bokeh, { width: 50, height: 50, top: 120, right: 30, opacity: 0.1 }]} />
        <View style={[styles.bokeh, { width: 30, height: 30, bottom: 40, left: 60, opacity: 0.2 }]} />
      </LinearGradient>

      {/* ── Calendar card ── */}
      <View style={styles.calendarCard}>
        {/* Month header */}
        <View style={styles.monthRow}>
          <Text style={styles.monthText}>{monthName} {currentYear}</Text>
          <View style={styles.completedBadge}>
            <View style={styles.coinDot} />
            <Text style={styles.completedText}>{completedCount}/{totalDays}</Text>
          </View>
        </View>

        {/* Day labels */}
        <View style={styles.dayLabelsRow}>
          {DAYS_LABEL.map((d, i) => (
            <Text key={i} style={styles.dayLabel}>{d}</Text>
          ))}
        </View>

        {/* Calendar grid */}
        <View style={{ gap: 8 }}>
          {grid.map((week, ri) => (
            <View key={ri} style={styles.weekRow}>
              {week.map((day, ci) => {
                if (!day) return <View key={ci} style={styles.emptyCell} />;

                const isToday = currentYear === currentYear && visibleMonthIdx === currentMonth && day === todayDate;
                const isFuture = currentYear > currentYear || (currentYear === currentYear && visibleMonthIdx > currentMonth) || (currentYear === currentYear && visibleMonthIdx === currentMonth && day > todayDate);
                
                const mStr = String(visibleMonthIdx + 1).padStart(2, '0');
                const dStr = String(day).padStart(2, '0');
                const isCompleted = dailyChallengesProgress[`${currentYear}-${mStr}-${dStr}`];
                const isSelected = day === selectedDate;

                return (
                  <TouchableOpacity
                    key={ci}
                    onPress={() => {
                      if (!isFuture) {
                        setSelectedDates(prev => ({ ...prev, [visibleMonthIdx]: day }));
                      }
                    }}
                    activeOpacity={isFuture ? 1 : 0.7}
                    style={[
                      styles.dayCell,
                      isSelected && styles.dayCellSelected,
                    ]}
                  >
                    <Text style={[
                      styles.dayCellText,
                      isToday && styles.dayCellTextToday,
                      isSelected && styles.dayCellTextSelected,
                      isFuture && styles.dayCellTextFuture,
                      isCompleted && !isSelected && styles.dayCellTextCompleted,
                    ]}>
                      {day}
                    </Text>
                    {isCompleted && !isSelected && (
                      <View style={styles.completedDot} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>

      {/* ── Play Button ── */}
      <View style={styles.playBtnContainer}>
        <TouchableOpacity onPress={handlePlay} style={styles.playBtn} activeOpacity={0.85}>
          <Text style={styles.playBtnText}>Play</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroBanner: {
    height: SCREEN_WIDTH * 0.62,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 20,
    overflow: 'hidden',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    letterSpacing: 0.4,
  },
  heroContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  navArrow: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 999,
  },
  trophyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  bokeh: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  calendarCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1C1F2E',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  coinDot: {
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: '#F59E0B',
  },
  completedText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1F2E',
  },
  dayLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayLabel: {
    width: (SCREEN_WIDTH - 40) / 7,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emptyCell: {
    width: (SCREEN_WIDTH - 40) / 7,
    height: 40,
  },
  dayCell: {
    width: (SCREEN_WIDTH - 40) / 7,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  dayCellSelected: {
    backgroundColor: '#2196F3',
  },
  dayCellText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#1C1F2E',
  },
  dayCellTextToday: {
    color: '#2196F3',
    fontWeight: '800',
  },
  dayCellTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dayCellTextFuture: {
    color: '#D1D5DB',
  },
  dayCellTextCompleted: {
    color: '#9CA3AF',
  },
  completedDot: {
    position: 'absolute',
    bottom: 3,
    width: 4,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#2196F3',
  },
  playBtnContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
  },
  playBtn: {
    backgroundColor: '#2196F3',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  playBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
