import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  emoji: string;
  size?: AvatarSize;
  backgroundColor?: string;
  style?: ViewStyle;
}

interface CoupleAvatarProps {
  emoji1: string;
  emoji2: string;
  size?: AvatarSize;
}

const SIZE_MAP: Record<AvatarSize, number> = {
  sm: 32,
  md: 48,
  lg: 64,
};

const FONT_SIZE_MAP: Record<AvatarSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
};

// 이모지에 따라 따뜻한 배경색 자동 선택
function getEmojiBackground(emoji: string): string {
  const code = emoji.codePointAt(0) ?? 0;
  const warmColors = [
    '#FFE8E8', // 연분홍
    '#FFF3E0', // 연주황
    '#FFF8E1', // 연노랑
    '#F3E5F5', // 연보라
    '#E8F5E9', // 연초록
    '#FFF0F5', // 라벤더블러쉬
  ];
  return warmColors[code % warmColors.length];
}

export function Avatar({
  emoji,
  size = 'md',
  backgroundColor,
  style,
}: AvatarProps) {
  const dimension = SIZE_MAP[size];
  const fontSize = FONT_SIZE_MAP[size];
  const bgColor = backgroundColor ?? getEmojiBackground(emoji);

  return (
    <View
      style={[
        styles.avatar,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: bgColor,
        },
        style,
      ]}
    >
      <Text style={{ fontSize }}>{emoji}</Text>
    </View>
  );
}

export function CoupleAvatar({ emoji1, emoji2, size = 'md' }: CoupleAvatarProps) {
  const dimension = SIZE_MAP[size];
  const overlap = dimension * 0.3;

  return (
    <View style={[styles.coupleContainer, { height: dimension }]}>
      <Avatar emoji={emoji1} size={size} />
      <Avatar
        emoji={emoji2}
        size={size}
        style={{ marginLeft: -overlap }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  coupleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
