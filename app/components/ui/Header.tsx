import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize } from '../../constants/typography';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function Header({ showBack, onBack, rightAction }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {showBack && (
          <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.backArrow}>{'←'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.logo}>SumOne</Text>

      <View style={[styles.side, styles.rightSide]}>
        {rightAction}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  side: {
    width: 40,
  },
  rightSide: {
    alignItems: 'flex-end',
  },
  logo: {
    fontSize: FontSize.xl,
    fontStyle: 'italic',
    color: Colors.text,
    fontWeight: '300',
  },
  backArrow: {
    fontSize: FontSize.xl,
    color: Colors.text,
  },
});
