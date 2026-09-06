import React from 'react';
import { View, Text } from 'react-native';

interface LevelStat {
  level: string;
  pillColor: string;
  pillTextColor: string;
  solved: number;
  best: string;   // e.g. "3:21"
  avg: string;    // e.g. "5:10"
}

// Mock data — wire to real store later
const LEVEL_STATS: LevelStat[] = [
  { level: 'Easy',   pillColor: '#D9F5D6', pillTextColor: '#3A7D44', solved: 62, best: '3:21',  avg: '5:10'  },
  { level: 'Medium', pillColor: '#FFF0DC', pillTextColor: '#B06A00', solved: 51, best: '8:45',  avg: '12:30' },
  { level: 'Hard',   pillColor: '#FFE5E5', pillTextColor: '#C0392B', solved: 28, best: '18:02', avg: '24:15' },
  { level: 'Expert', pillColor: '#EAE5FF', pillTextColor: '#5E35B1', solved: 6,  best: '45:10', avg: '51:00' },
];

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

export function LevelStatsTable() {
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
      {LEVEL_STATS.map((stat, index) => (
        <View key={stat.level}>
          <LevelRow stat={stat} />
          {/* Remove bottom border on last row */}
          {index === LEVEL_STATS.length - 1 && (
            <View style={{ marginBottom: -1 }} />
          )}
        </View>
      ))}
    </View>
  );
}
