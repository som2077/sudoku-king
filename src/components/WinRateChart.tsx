import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type ChartTab = 'Day' | 'Week' | 'Month';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MOCK_DATA: Record<ChartTab, number[]> = {
  Day:   [40, 55, 60, 90, 70, 50, 65],
  Week:  [60, 45, 75, 80, 55, 70, 85],
  Month: [50, 65, 45, 70, 90, 60, 75],
};

const TODAY_INDEX = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

const CARD_SHADOW = {
  backgroundColor: '#FFFFFF',
  borderRadius: 20,
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

function Bar({ value, maxValue, label, isToday }: {
  value: number;
  maxValue: number;
  label: string;
  isToday: boolean;
}) {
  const BAR_MAX_HEIGHT = 64;
  const height = Math.max(6, (value / maxValue) * BAR_MAX_HEIGHT);

  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      {/* Tooltip above today's bar */}
      {isToday ? (
        <View
          style={{
            backgroundColor: '#1C1F2E',
            borderRadius: 6,
            paddingHorizontal: 5,
            paddingVertical: 2,
            marginBottom: 4,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: 'bold' }}>
            {value}%
          </Text>
        </View>
      ) : (
        <View style={{ height: 18 }} />
      )}

      {/* Bar */}
      <View style={{ height: BAR_MAX_HEIGHT, justifyContent: 'flex-end', alignItems: 'center' }}>
        <View
          style={{
            width: 18,
            height,
            borderRadius: 6,
            backgroundColor: isToday ? '#1C1F2E' : '#F3F4F6',
          }}
        />
      </View>

      {/* Day label */}
      <Text
        style={{
          fontSize: 10,
          color: isToday ? '#1C1F2E' : '#9CA3AF',
          fontWeight: isToday ? 'bold' : '400',
          marginTop: 5,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export function WinRateChart() {
  const [activeTab, setActiveTab] = useState<ChartTab>('Week');
  const data = MOCK_DATA[activeTab];
  const maxValue = Math.max(...data, 1);
  const tabs: ChartTab[] = ['Day', 'Week', 'Month'];

  return (
    <View style={{ ...CARD_SHADOW, padding: 18, marginTop: 10 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1C1F2E' }}>
          Win Rate
        </Text>

        {/* Tab switcher — light pill style */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#F3F4F6',
            borderRadius: 20,
            padding: 3,
          }}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 16,
                backgroundColor: activeTab === tab ? '#FFFFFF' : 'transparent',
                shadowColor: activeTab === tab ? '#000' : 'transparent',
                shadowOpacity: activeTab === tab ? 0.08 : 0,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 1 },
                elevation: activeTab === tab ? 2 : 0,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: activeTab === tab ? 'bold' : '400',
                  color: activeTab === tab ? '#1C1F2E' : '#9CA3AF',
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bars */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
        {data.map((value, index) => (
          <Bar
            key={index}
            value={value}
            maxValue={maxValue}
            label={DAY_LABELS[index]}
            isToday={index === TODAY_INDEX}
          />
        ))}
      </View>
    </View>
  );
}
