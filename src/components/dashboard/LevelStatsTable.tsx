import React from 'react';
import { Text } from '../ui/Text';
import { View } from 'react-native';
import { useGameStore } from '../../store/useGameStore';

export interface LevelStat {
  level: string;
  pillColor: string;
  pillTextColor: string;
  solved: number;
  best: string;   // e.g. "3:21"
  avg: string;    // e.g. "5:10"
}

const LEVEL_CONFIGS = [
  { level: 'Easy',    pillColor: '#D9F5D6', pillTextColor: '#3A7D44' },
  { level: 'Medium',  pillColor: '#FFF0DC', pillTextColor: '#B06A00' },
  { level: 'Hard',    pillColor: '#FFE5E5', pillTextColor: '#C0392B' },
  { level: 'Expert',  pillColor: '#EAE5FF', pillTextColor: '#5E35B1' },
  { level: 'Master',  pillColor: '#DBEAFE', pillTextColor: '#1D4ED8' },
  { level: 'Extreme', pillColor: '#FEE2E2', pillTextColor: '#B91C1C' },
];

function formatTime(seconds: number | null): string {
  if (!seconds || seconds <= 0) return '--:--';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function HeaderCell({ label, alignRight = false }: { label: string; alignRight?: boolean }) {
  return (
    <Text
      style={{
        color: '#8B90A7',
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 0.8,
        textAlign: alignRight ? 'right' : 'left',
        flex: alignRight ? 1 : undefined,
        width: alignRight ? undefined : 120,
      }}
    >
      {label}
    </Text>
  );
}

function LevelRow({ stat }: { stat: LevelStat }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2A3050',
      }}
    >
      {/* Level Pill */}
      <View style={{ width: 120 }}>
        <View
          style={{
            backgroundColor: stat.pillColor,
            borderRadius: 999,
            paddingHorizontal: 14,
            paddingVertical: 6,
            alignSelf: 'flex-start',
          }}
        >
          <Text style={{ color: stat.pillTextColor, fontWeight: '600', fontSize: 13 }}>
            {stat.level}
          </Text>
        </View>
      </View>

      {/* Solved */}
      <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 15, flex: 1, textAlign: 'right' }}>
        {stat.solved}
      </Text>

      {/* Best */}
      <Text style={{ color: '#4FD4B0', fontWeight: 'bold', fontSize: 15, flex: 1, textAlign: 'right' }}>
        {stat.best}
      </Text>

      {/* Avg */}
      <Text style={{ color: '#4FD4B0', fontWeight: 'bold', fontSize: 15, flex: 1, textAlign: 'right' }}>
        {stat.avg}
      </Text>
    </View>
  );
}

export function LevelStatsTable({ stats: propStats }: { stats?: LevelStat[] } = {}) {
  const difficultyStats = useGameStore((s) => s.difficultyStats);

  const stats = React.useMemo(() => {
    if (propStats && propStats.length > 0) return propStats;
    return LEVEL_CONFIGS.map((cfg) => {
      const rec = difficultyStats?.[cfg.level] || {
        solved: 0,
        played: 0,
        bestSec: null,
        totalSec: 0,
      };
      const solved = rec.solved || 0;
      const avgSec = solved > 0 ? Math.round(rec.totalSec / solved) : 0;
      return {
        ...cfg,
        solved,
        best: formatTime(rec.bestSec),
        avg: formatTime(avgSec),
      };
    });
  }, [propStats, difficultyStats]);

  return (
    <View
      style={{
        backgroundColor: '#1C1F2E',
        borderRadius: 20,
        padding: 16,
        marginTop: 12,
      }}
    >
      {/* Header Row */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#2A3050',
        }}
      >
        <HeaderCell label="LEVEL" />
        <HeaderCell label="SOLVED" alignRight />
        <HeaderCell label="BEST"   alignRight />
        <HeaderCell label="AVG"    alignRight />
      </View>

      {/* Data Rows */}
      {stats.map((stat, index) => (
        <View key={stat.level}>
          <LevelRow stat={stat} />
          {/* Remove bottom border on last row */}
          {index === stats.length - 1 && (
            <View style={{ marginBottom: -1 }} />
          )}
        </View>
      ))}
    </View>
  );
}
