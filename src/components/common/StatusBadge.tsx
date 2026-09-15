// Status Badge Component
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { VerificationState } from '../../types';

interface StatusBadgeProps {
  status: VerificationState | 'submitted' | 'unlocked' | 'locked' | 'active' | 'suspended';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  style,
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'verified':
        return {
          label: 'Verified Land',
          bgColor: COLORS.successLight,
          textColor: COLORS.success,
          borderColor: COLORS.successBorder,
          icon: 'shield-checkmark' as const,
        };
      case 'under_review':
        return {
          label: 'Under Cadastral Review',
          bgColor: COLORS.infoLight,
          textColor: COLORS.info,
          borderColor: COLORS.infoBorder,
          icon: 'hourglass-outline' as const,
        };
      case 'pending':
      case 'submitted':
        return {
          label: 'Pending Verification',
          bgColor: COLORS.warningLight,
          textColor: COLORS.warning,
          borderColor: COLORS.warningBorder,
          icon: 'time-outline' as const,
        };
      case 'rejected':
        return {
          label: 'Verification Rejected',
          bgColor: COLORS.errorLight,
          textColor: COLORS.error,
          borderColor: COLORS.errorBorder,
          icon: 'alert-circle-outline' as const,
        };
      case 'unlocked':
        return {
          label: 'Details Unlocked',
          bgColor: COLORS.successLight,
          textColor: COLORS.success,
          borderColor: COLORS.successBorder,
          icon: 'lock-open-outline' as const,
        };
      case 'locked':
        return {
          label: 'Protected Information',
          bgColor: '#F1F5F9',
          textColor: COLORS.textSecondary,
          borderColor: COLORS.border,
          icon: 'lock-closed-outline' as const,
        };
      case 'active':
        return {
          label: 'Active',
          bgColor: COLORS.successLight,
          textColor: COLORS.success,
          borderColor: COLORS.successBorder,
          icon: 'checkmark-circle-outline' as const,
        };
      case 'suspended':
        return {
          label: 'Suspended',
          bgColor: COLORS.errorLight,
          textColor: COLORS.error,
          borderColor: COLORS.errorBorder,
          icon: 'ban-outline' as const,
        };
      default:
        return {
          label: status,
          bgColor: COLORS.surfaceSecondary,
          textColor: COLORS.textSecondary,
          borderColor: COLORS.border,
          icon: 'information-circle-outline' as const,
        };
    }
  };

  const config = getBadgeConfig();
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
          paddingVertical: isSm ? 2 : 4,
          paddingHorizontal: isSm ? SPACING.xs + 2 : SPACING.sm + 2,
        },
        style,
      ]}
    >
      <Ionicons
        name={config.icon}
        size={isSm ? 12 : 14}
        color={config.textColor}
        style={styles.icon}
      />
      <Text
        style={[
          isSm ? TYPOGRAPHY.micro : TYPOGRAPHY.captionBold,
          { color: config.textColor },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.round,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
});
