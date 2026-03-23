import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Card } from './ui';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight } from '../constants/typography';

interface AnniversaryPickerProps {
  loading: boolean;
  onDone: (date: string | null) => void;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getYears(): number[] {
  const current = new Date().getFullYear();
  const years: number[] = [];
  for (let y = current; y >= current - 30; y--) {
    years.push(y);
  }
  return years;
}

export function AnniversaryPicker({ loading, onDone }: AnniversaryPickerProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [day, setDay] = useState(today.getDate());

  const daysInMonth = getDaysInMonth(year, month);
  const years = getYears();

  // Clamp day if month changes
  const safeDay = Math.min(day, daysInMonth);

  const formatDate = (): string => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(safeDay).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{'\u2764\uFE0F'}</Text>
      <Text style={styles.title}>When did you start dating?</Text>
      <Text style={styles.subtitle}>
        We'll count the days together
      </Text>

      <Card variant="warm" padding={20} style={styles.pickerCard}>
        {/* Year selector */}
        <Text style={styles.label}>Year</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollRow}
        >
          {years.map((y) => (
            <TouchableOpacity
              key={y}
              style={[styles.chip, y === year && styles.chipActive]}
              onPress={() => setYear(y)}
            >
              <Text style={[styles.chipText, y === year && styles.chipTextActive]}>
                {y}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Month selector */}
        <Text style={styles.label}>Month</Text>
        <View style={styles.monthGrid}>
          {MONTHS.map((m, i) => (
            <TouchableOpacity
              key={m}
              style={[styles.monthChip, i === month && styles.chipActive]}
              onPress={() => setMonth(i)}
            >
              <Text style={[styles.chipText, i === month && styles.chipTextActive]}>
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Day selector */}
        <Text style={styles.label}>Day</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollRow}
        >
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.dayChip, d === safeDay && styles.chipActive]}
              onPress={() => setDay(d)}
            >
              <Text style={[styles.chipText, d === safeDay && styles.chipTextActive]}>
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Card>

      {/* Selected date display */}
      <Text style={styles.selectedDate}>
        {MONTHS[month]} {safeDay}, {year}
      </Text>

      <View style={styles.buttons}>
        <Button
          title="Save Anniversary"
          onPress={() => onDone(formatDate())}
          loading={loading}
          size="lg"
        />
        <Button
          title="Skip for now"
          onPress={() => onDone(null)}
          variant="ghost"
          size="sm"
          style={styles.skipButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  emoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  pickerCard: {
    marginBottom: 16,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    marginBottom: 8,
    marginTop: 12,
  },
  scrollRow: {
    flexGrow: 0,
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: FontSize.md,
    color: Colors.text,
    fontWeight: FontWeight.medium,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  monthChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    marginRight: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDate: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttons: {
    gap: 8,
  },
  skipButton: {
    marginTop: 4,
  },
});
