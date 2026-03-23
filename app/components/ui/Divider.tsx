import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize } from '../../constants/typography';

interface DividerProps {
  text?: string;
  style?: ViewStyle;
}

export function Divider({ text, style }: DividerProps) {
  if (!text) {
    return <View style={[styles.line, style]} />;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.lineFlex} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.lineFlex} />
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  lineFlex: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  text: {
    marginHorizontal: 12,
    fontSize: FontSize.sm,
    color: Colors.textLight,
  },
});
