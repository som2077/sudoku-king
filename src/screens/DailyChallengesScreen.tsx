import React, { useState, useMemo } from 'react';
import { Text } from '../components/Text';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import {
  Trophy,
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
  Lock,
  Flame,
  Crown,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useGameStore,
  getDailyDifficulty,
  isDailyChallengeCompleted,
  getDailyChallengeItem,
} from '../store/useGameStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DAYS_LABEL = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string; bg: string; givens: number }> = {
  Easy: { label: 'Easy', color: '#16A34A', bg: '#DCFCE7', givens: 41 },
  Medium: { label: 'Medium', color: '#D97706', bg: '#FEF3C7', givens: 34 },
  Hard: { label: 'Hard', color: '#EA580C', bg: '#FFEDD5', givens: 29 },
  Expert: { label: 'Expert', color: '#7C3AED', bg: '#F3E8FF', givens: 25 },
  Master: { label: 'Master', color: '#2563EB', bg: '#DBEAFE', givens: 23 },
  Extreme: { label: 'Extreme', color: '#DC2626', bg: '#FEE2E2', givens: 21 },
  Fast: { label: 'Fast', color: '#4B5563', bg: '#F3F4F6', givens: 45 },
};

function formatDuration(sec?: number) {
  if (!sec || sec <= 0) return '00:00';
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Build calendar grid for a specific month (Mon-first)
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
  const { startDailyChallenge, dailyChallengesProgress, streak = 0 } = useGameStore();

  const now = new Date();
  const todayDate = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const [visibleMonthIdx, setVisibleMonthIdx] = useState(currentMonth);

  // Default selection per month
  const [selectedDates, setSelectedDates] = useState<Record<number, number>>({
    [currentMonth]: todayDate,
  });

  const selectedDate = selectedDates[visibleMonthIdx] || (visibleMonthIdx === currentMonth ? todayDate : 1);

  const mStr = String(visibleMonthIdx + 1).padStart(2, '0');
  const dStr = String(selectedDate).padStart(2, '0');
  const selectedDateStr = `${currentYear}-${mStr}-${dStr}`;

  const selectedDifficulty = getDailyDifficulty(selectedDateStr);
  const diffMeta = DIFFICULTY_CONFIG[selectedDifficulty] || DIFFICULTY_CONFIG.Medium;

  const isTodaySelected = visibleMonthIdx === currentMonth && selectedDate === todayDate;
  const isFutureSelected =
    visibleMonthIdx > currentMonth ||
    (visibleMonthIdx === currentMonth && selectedDate > todayDate);
  const isSelectedCompleted = isDailyChallengeCompleted(dailyChallengesProgress, selectedDateStr);
  const selectedProgressItem = getDailyChallengeItem(dailyChallengesProgress, selectedDateStr);

  const handlePlay = () => {
    if (isFutureSelected) return;
    startDailyChallenge(selectedDateStr);
  };

  const changeMonth = (direction: 1 | -1) => {
    setVisibleMonthIdx((prev) => {
      const next = prev + direction;
      if (next < 0 || next > 11) return prev;
      return next;
    });
  };

  const grid = useMemo(() => buildCalendarGrid(currentYear, visibleMonthIdx), [currentYear, visibleMonthIdx]);
  const dateObj = new Date(currentYear, visibleMonthIdx, 1);
  const monthName = dateObj.toLocaleString('default', { month: 'long' });
  const totalDays = new Date(currentYear, visibleMonthIdx + 1, 0).getDate();

  // Completed count in this month
  let completedCount = 0;
  for (let d = 1; d <= totalDays; d++) {
    const ds = `${currentYear}-${String(visibleMonthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    if (isDailyChallengeCompleted(dailyChallengesProgress, ds)) {
      completedCount++;
    }
  }

  // Monthly Trophy Milestones: 10=Bronze, 20=Silver, totalDays=Gold
  const isGold = completedCount >= totalDays;
  const isSilver = !isGold && completedCount >= 20;
  const isBronze = !isGold && !isSilver && completedCount >= 10;

  const trophyTitle = isGold
    ? 'Royal Gold Cup 🏆'
    : isSilver
    ? 'Silver Cup 🥈'
    : isBronze
    ? 'Bronze Cup 🥉'
    : `${monthName} Cup`;

  const trophySubtitle = isGold
    ? 'All 30 Challenges Solved!'
    : isSilver
    ? `${totalDays - completedCount} more for Royal Gold 🏆`
    : isBronze
    ? `${20 - completedCount} more for Silver Cup 🥈`
    : `${10 - completedCount} more to unlock Bronze Cup 🥉`;

  // Milestone Progress percentage
  const progressPercent = Math.min(100, Math.round((completedCount / totalDays) * 100));

  // Formatted date string for selected card
  const selectedDayObj = new Date(currentYear, visibleMonthIdx, selectedDate);
  const selectedDayName = selectedDayObj.toLocaleDateString('en-US', { weekday: 'long' });
  const selectedMonthShort = selectedDayObj.toLocaleDateString('en-US', { month: 'short' });

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. Hero Banner ── */}
        <LinearGradient
          colors={
            isGold
              ? ['#B45309', '#D97706', '#F59E0B']
              : isSilver
              ? ['#334155', '#475569', '#64748B']
              : ['#1E3A8A', '#2563EB', '#3B82F6']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBanner}
        >
          {/* Header Row: Title & Streak */}
          <SafeAreaView edges={['top']} style={styles.heroHeader}>
            <View style={{ width: 60 }} />
            <Text style={styles.heroTitle}>Daily Challenges</Text>
            <View style={styles.streakPill}>
              <Flame size={14} color="#F97316" fill="#F97316" />
              <Text style={styles.streakText}>{streak}</Text>
            </View>
          </SafeAreaView>

          {/* Month Navigation & Trophy Visual */}
          <View style={styles.heroContentRow}>
            <TouchableOpacity
              onPress={() => changeMonth(-1)}
              disabled={visibleMonthIdx === 0}
              style={[styles.navArrow, visibleMonthIdx === 0 && { opacity: 0.3 }]}
              activeOpacity={0.7}
            >
              <ChevronLeft color="#FFFFFF" size={28} />
            </TouchableOpacity>

            {/* Dynamic Trophy Presentation */}
            <View style={styles.trophyContainer}>
              <View
                style={[
                  styles.trophyGlow,
                  isGold && { backgroundColor: 'rgba(253, 230, 138, 0.35)' },
                  isSilver && { backgroundColor: 'rgba(226, 232, 240, 0.3)' },
                  isBronze && { backgroundColor: 'rgba(245, 158, 11, 0.25)' },
                ]}
              />
              <Trophy
                size={68}
                color={isGold ? '#FEF08A' : isSilver ? '#F1F5F9' : isBronze ? '#FDE68A' : '#E0E7FF'}
                strokeWidth={1.2}
                fill={isGold ? '#F59E0B' : isSilver ? '#94A3B8' : isBronze ? '#D97706' : '#1D4ED8'}
              />
              <Text style={styles.trophyTitleText}>{trophyTitle}</Text>
              <Text style={styles.trophySubtitleText}>{trophySubtitle}</Text>
            </View>

            <TouchableOpacity
              onPress={() => changeMonth(1)}
              disabled={visibleMonthIdx === 11}
              style={[styles.navArrow, visibleMonthIdx === 11 && { opacity: 0.3 }]}
              activeOpacity={0.7}
            >
              <ChevronRight color="#FFFFFF" size={28} />
            </TouchableOpacity>
          </View>

          {/* Milestone Progress Bar */}
          <View style={styles.milestoneSection}>
            <View style={styles.milestoneLabels}>
              <Text style={styles.milestoneProgressLabel}>
                {completedCount} / {totalDays} Solved
              </Text>
              <View style={styles.milestoneBadgesRow}>
                <Text style={[styles.badgeTag, completedCount >= 10 && styles.badgeTagActive]}>
                  🥉 10
                </Text>
                <Text style={[styles.badgeTag, completedCount >= 20 && styles.badgeTagActive]}>
                  🥈 20
                </Text>
                <Text style={[styles.badgeTag, completedCount >= totalDays && styles.badgeTagActive]}>
                  🏆 {totalDays}
                </Text>
              </View>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
          </View>
        </LinearGradient>

        {/* ── 2. Calendar Card ── */}
        <View style={styles.calendarCard}>
          {/* Month Title & Solved Counter */}
          <View style={styles.monthHeaderRow}>
            <Text style={styles.monthNameText}>
              {monthName} {currentYear}
            </Text>
            <View style={styles.completedCountBadge}>
              <Crown size={15} color="#D97706" fill="#F59E0B" />
              <Text style={styles.completedCountText}>
                {completedCount}/{totalDays}
              </Text>
            </View>
          </View>

          {/* Days Label Header (M, T, W, T, F, S, S) */}
          <View style={styles.dayLabelsRow}>
            {DAYS_LABEL.map((d, i) => (
              <Text key={i} style={styles.dayLabel}>
                {d}
              </Text>
            ))}
          </View>

          {/* Calendar Grid Rows */}
          <View style={{ gap: 6 }}>
            {grid.map((week, ri) => (
              <View key={ri} style={styles.weekRow}>
                {week.map((day, ci) => {
                  if (!day) return <View key={ci} style={styles.emptyCell} />;

                  const isToday =
                    visibleMonthIdx === currentMonth && day === todayDate;
                  const isFuture =
                    visibleMonthIdx > currentMonth ||
                    (visibleMonthIdx === currentMonth && day > todayDate);

                  const curMStr = String(visibleMonthIdx + 1).padStart(2, '0');
                  const curDStr = String(day).padStart(2, '0');
                  const curDateStr = `${currentYear}-${curMStr}-${curDStr}`;

                  const isCompleted = isDailyChallengeCompleted(
                    dailyChallengesProgress,
                    curDateStr
                  );
                  const isSelected = day === selectedDate;

                  return (
                    <TouchableOpacity
                      key={ci}
                      onPress={() => {
                        if (!isFuture) {
                          setSelectedDates((prev) => ({
                            ...prev,
                            [visibleMonthIdx]: day,
                          }));
                        }
                      }}
                      activeOpacity={isFuture ? 1 : 0.7}
                      style={[
                        styles.dayCell,
                        isToday && !isSelected && styles.dayCellToday,
                        isSelected && styles.dayCellSelected,
                        isCompleted && !isSelected && styles.dayCellCompleted,
                      ]}
                    >
                      {/* Top Crown icon for completed puzzles */}
                      {isCompleted ? (
                        <View style={styles.crownWrapper}>
                          <Crown
                            size={18}
                            color={isSelected ? '#FFFFFF' : '#D97706'}
                            fill={isSelected ? '#FFFFFF' : '#F59E0B'}
                          />
                        </View>
                      ) : isFuture ? (
                        <View style={styles.futureWrapper}>
                          <Text style={styles.dayTextFuture}>{day}</Text>
                          <Lock size={10} color="#D1D5DB" />
                        </View>
                      ) : (
                        <Text
                          style={[
                            styles.dayText,
                            isToday && styles.dayTextToday,
                            isSelected && styles.dayTextSelected,
                          ]}
                        >
                          {day}
                        </Text>
                      )}

                      {/* Today dot indicator */}
                      {isToday && !isSelected && !isCompleted && (
                        <View style={styles.todayDot} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          {/* ── 3. Selected Challenge Details Card ── */}
          <View style={styles.detailsCard}>
            <View style={styles.detailsHeaderRow}>
              <View>
                <Text style={styles.detailsDateTitle}>
                  {selectedDayName}, {selectedMonthShort} {selectedDate}
                </Text>
                <View style={styles.detailsMetaRow}>
                  <View
                    style={[
                      styles.diffBadge,
                      { backgroundColor: diffMeta.bg },
                    ]}
                  >
                    <View
                      style={[
                        styles.diffIndicatorDot,
                        { backgroundColor: diffMeta.color },
                      ]}
                    />
                    <Text
                      style={[styles.diffBadgeText, { color: diffMeta.color }]}
                    >
                      {selectedDifficulty}
                    </Text>
                  </View>
                  <Text style={styles.cluesText}>
                    ~{diffMeta.givens} Givens
                  </Text>
                  {isTodaySelected && (
                    <View style={styles.todayPill}>
                      <Text style={styles.todayPillText}>TODAY</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Status Information */}
            <View style={styles.statusRow}>
              {isSelectedCompleted ? (
                <View style={styles.statusCompletedBox}>
                  <Text style={styles.statusCompletedText}>
                    👑 Solved in {formatDuration(selectedProgressItem?.timeSec)}
                    {selectedProgressItem?.mistakes !== undefined
                      ? ` · ${selectedProgressItem.mistakes} mistakes`
                      : ''}
                  </Text>
                </View>
              ) : isFutureSelected ? (
                <Text style={styles.statusFutureText}>
                  🔒 Challenge unlocks on this day at midnight.
                </Text>
              ) : isTodaySelected ? (
                <Text style={styles.statusActiveText}>
                  🔥 Solve today's puzzle to maintain your active streak!
                </Text>
              ) : (
                <Text style={styles.statusMissedText}>
                  ⏰ Missed puzzle · Play to earn your crown & monthly cup!
                </Text>
              )}
            </View>
          </View>

          {/* ── 4. Action Button ── */}
          <TouchableOpacity
            onPress={handlePlay}
            disabled={isFutureSelected}
            style={[
              styles.playBtn,
              isFutureSelected && styles.playBtnDisabled,
              isSelectedCompleted && styles.playBtnCompleted,
            ]}
            activeOpacity={0.85}
          >
            {isFutureSelected ? (
              <View style={styles.btnContentRow}>
                <Lock size={18} color="#9CA3AF" />
                <Text style={styles.playBtnTextDisabled}>Locked</Text>
              </View>
            ) : isSelectedCompleted ? (
              <View style={styles.btnContentRow}>
                <RotateCcw size={18} color="#FFFFFF" />
                <Text style={styles.playBtnText}>
                  Play Again ({formatDuration(selectedProgressItem?.timeSec)})
                </Text>
              </View>
            ) : isTodaySelected ? (
              <View style={styles.btnContentRow}>
                <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={styles.playBtnText}>Play Today's Challenge</Text>
              </View>
            ) : (
              <View style={styles.btnContentRow}>
                <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={styles.playBtnText}>Catch Up & Play</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heroBanner: {
    paddingBottom: 10,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 4,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  streakText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  heroContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 6,
  },
  navArrow: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 999,
  },
  trophyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyGlow: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  trophyTitleText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
    letterSpacing: 0.2,
  },
  trophySubtitleText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  milestoneSection: {
    marginTop: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  milestoneLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  milestoneProgressLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  milestoneBadgesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badgeTag: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTagActive: {
    color: '#FEF08A',
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FEF08A',
    borderRadius: 999,
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  monthHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  monthNameText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1F2E',
  },
  completedCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  completedCountText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  dayLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dayLabel: {
    width: (SCREEN_WIDTH - 32) / 7,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emptyCell: {
    width: (SCREEN_WIDTH - 32) / 7,
    height: 38,
  },
  dayCell: {
    width: (SCREEN_WIDTH - 32) / 7,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  dayCellToday: {
    borderWidth: 2,
    borderColor: '#2563EB',
    backgroundColor: 'rgba(37, 99, 235, 0.05)',
  },
  dayCellSelected: {
    backgroundColor: '#2563EB',
  },
  dayCellCompleted: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  dayText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1F2E',
  },
  dayTextToday: {
    color: '#2563EB',
    fontWeight: '800',
  },
  dayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  dayTextFuture: {
    fontSize: 12,
    fontWeight: '500',
    color: '#D1D5DB',
  },
  futureWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  crownWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayDot: {
    position: 'absolute',
    bottom: 3,
    width: 4,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#2563EB',
  },
  detailsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailsDateTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1C1F2E',
    marginBottom: 4,
  },
  detailsMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  diffBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
  },
  diffIndicatorDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
  },
  diffBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cluesText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  todayPill: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  todayPillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  statusRow: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  statusCompletedBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusCompletedText: {
    color: '#D97706',
    fontWeight: '700',
    fontSize: 12,
  },
  statusActiveText: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 12,
  },
  statusMissedText: {
    color: '#475569',
    fontWeight: '500',
    fontSize: 12,
  },
  statusFutureText: {
    color: '#94A3B8',
    fontWeight: '500',
    fontSize: 12,
  },
  playBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  playBtnCompleted: {
    backgroundColor: '#0F172A',
    shadowColor: '#0F172A',
  },
  playBtnDisabled: {
    backgroundColor: '#F1F5F9',
    shadowOpacity: 0,
    elevation: 0,
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  playBtnTextDisabled: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '700',
  },
});
