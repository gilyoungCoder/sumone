import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const SIZE_CONFIG = {
  sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: FontSize.sm },
  md: { paddingVertical: 12, paddingHorizontal: 24, fontSize: FontSize.md },
  lg: { paddingVertical: 16, paddingHorizontal: 32, fontSize: FontSize.lg },
} as const;

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const scale = React.useRef(new Animated.Value(1)).current;
  const sizeConfig = SIZE_CONFIG[size];

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const containerStyle: ViewStyle = {
    paddingVertical: sizeConfig.paddingVertical,
    paddingHorizontal: sizeConfig.paddingHorizontal,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.5 : 1,
    ...(variant === 'primary' && {
      backgroundColor: Colors.primary,
    }),
    ...(variant === 'secondary' && {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: Colors.primary,
    }),
    ...(variant === 'ghost' && {
      backgroundColor: 'transparent',
    }),
  };

  const labelStyle: TextStyle = {
    fontSize: sizeConfig.fontSize,
    fontWeight: FontWeight.semibold,
    ...(variant === 'primary' && { color: '#FFFFFF' }),
    ...(variant === 'secondary' && { color: Colors.primary }),
    ...(variant === 'ghost' && { color: Colors.primary }),
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[containerStyle, style]}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'primary' ? '#FFFFFF' : Colors.primary}
            size="small"
          />
        ) : (
          <Text style={[labelStyle, textStyle]}>{title}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
