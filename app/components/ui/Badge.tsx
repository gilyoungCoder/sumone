import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';

type BadgeColor = 'primary' | 'accent' | 'error';

interface BadgeProps {
  count: number;
  color?: BadgeColor;
  maxCount?: number;
}

const COLOR_MAP: Record<BadgeColor, string> = {
  primary: Colors.primary,
  accent: Colors.accent,
  error: Colors.error,
};

const TEXT_COLOR_MAP: Record<BadgeColor, string> = {
  primary: '#FFFFFF',
  accent: Colors.text,
  error: '#FFFFFF',
};

export function Badge({ count, color = 'primary', maxCount = 99 }: BadgeProps) {
  if (count <= 0) return null;

  const displayText = count > maxCount ? `${maxCount}+` : `${count}`;
  const isWide = displayText.length > 1;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: COLOR_MAP[color],
          minWidth: 20,
          paddingHorizontal: isWide ? 6 : 0,
        },
      ]}
    >
      <Text style={[styles.text, { color: TEXT_COLOR_MAP[color] }]}>
        {displayText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
});
