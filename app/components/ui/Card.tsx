import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

type CardVariant = 'default' | 'warm' | 'highlight';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: number;
  margin?: number;
  style?: ViewStyle;
}

const VARIANT_COLORS: Record<CardVariant, string> = {
  default: Colors.surface,
  warm: Colors.surfaceWarm,
  highlight: Colors.highlight,
};

export function Card({
  children,
  variant = 'default',
  padding = 16,
  margin,
  style,
}: CardProps) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: VARIANT_COLORS[variant],
          padding,
          ...(margin !== undefined && { margin }),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
});
