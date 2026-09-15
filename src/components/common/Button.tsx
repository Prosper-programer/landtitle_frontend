// Reusable Button Component
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: RADIUS.md,
      opacity: disabled ? 0.5 : 1,
      width: fullWidth ? '100%' : undefined,
    };

    // Size
    if (size === 'sm') {
      base.paddingVertical = SPACING.xs + 2;
      base.paddingHorizontal = SPACING.md;
    } else if (size === 'lg') {
      base.paddingVertical = SPACING.lg - 2;
      base.paddingHorizontal = SPACING.xxl;
    } else {
      base.paddingVertical = SPACING.md;
      base.paddingHorizontal = SPACING.xl;
    }

    // Variant
    switch (variant) {
      case 'secondary':
        base.backgroundColor = COLORS.secondary;
        break;
      case 'outline':
        base.backgroundColor = 'transparent';
        base.borderWidth = 1.5;
        base.borderColor = COLORS.border;
        break;
      case 'danger':
        base.backgroundColor = COLORS.error;
        break;
      case 'success':
        base.backgroundColor = COLORS.success;
        break;
      case 'ghost':
        base.backgroundColor = 'transparent';
        break;
      case 'primary':
      default:
        base.backgroundColor = COLORS.primary;
        break;
    }

    return base;
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      ...TYPOGRAPHY.bodyBold,
      textAlign: 'center',
    };

    if (size === 'sm') {
      base.fontSize = 12;
    } else if (size === 'lg') {
      base.fontSize = 16;
    }

    switch (variant) {
      case 'outline':
        base.color = COLORS.primary;
        break;
      case 'ghost':
        base.color = COLORS.secondary;
        break;
      case 'primary':
      case 'secondary':
      case 'danger':
      case 'success':
      default:
        base.color = COLORS.textInverse;
        break;
    }

    return base;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[getContainerStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.textInverse}
        />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: SPACING.sm,
  },
  rightIcon: {
    marginLeft: SPACING.sm,
  },
});
