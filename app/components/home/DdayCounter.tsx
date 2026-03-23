import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface DdayCounterProps {
  anniversaryDate: string; // ISO date string, e.g. "2024-03-15"
}

function calculateDaysTogether(dateStr: string): number {
  const anniversary = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - anniversary.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
}

export function DdayCounter({ anniversaryDate }: DdayCounterProps) {
  const days = calculateDaysTogether(anniversaryDate);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Together for</Text>
      <View style={styles.row}>
        <Text style={styles.number}>{days.toLocaleString()}</Text>
        <Text style={styles.unit}> {days === 1 ? 'day' : 'days'}</Text>
      </View>
      <Text style={styles.heart}>💗</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  number: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.primary,
    fontStyle: 'italic',
  },
  unit: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryLight,
  },
  heart: {
    fontSize: 14,
    marginTop: 2,
  },
});
