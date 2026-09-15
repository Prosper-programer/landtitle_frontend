// Locked Property Details Section & Unlock Banner
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants/theme';
import { formatFCFA } from '../../constants/cameroonData';
import { Button } from '../common/Button';

interface LockedDetailsOverlayProps {
  unlockFeeFCFA: number;
  onUnlockPress: () => void;
}

export const LockedDetailsOverlay: React.FC<LockedDetailsOverlayProps> = ({
  unlockFeeFCFA,
  onUnlockPress,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.lockCircle}>
          <Ionicons name="lock-closed" size={22} color={COLORS.primary} />
        </View>
        <View style={styles.titleColumn}>
          <Text style={styles.title}>Protected Information</Text>
          <Text style={styles.subtitle}>Unlock full property access and seller dossier</Text>
        </View>
      </View>

      <Text style={styles.description}>
        To protect seller privacy and prevent fraud, direct contact coordinates and certified cadastral deed documents are reserved for verified inquiries.
      </Text>

      {/* Locked Items Checklist */}
      <View style={styles.itemsList}>
        <View style={styles.itemRow}>
          <Ionicons name="call-outline" size={16} color={COLORS.secondary} />
          <Text style={styles.itemText}>Direct Seller Phone Number & WhatsApp</Text>
          <Ionicons name="lock-closed-outline" size={14} color={COLORS.textMuted} style={styles.itemLock} />
        </View>
        <View style={styles.itemRow}>
          <Ionicons name="map-outline" size={16} color={COLORS.secondary} />
          <Text style={styles.itemText}>Exact GPS Coordinates & Street Landmarks</Text>
          <Ionicons name="lock-closed-outline" size={14} color={COLORS.textMuted} style={styles.itemLock} />
        </View>
        <View style={styles.itemRow}>
          <Ionicons name="document-attach-outline" size={16} color={COLORS.secondary} />
          <Text style={styles.itemText}>Cadastral Survey Plan & Land Title PDF Copies</Text>
          <Ionicons name="lock-closed-outline" size={14} color={COLORS.textMuted} style={styles.itemLock} />
        </View>
      </View>

      {/* Unlock CTA Section */}
      <View style={styles.actionBox}>
        <View style={styles.priceContainer}>
          <Text style={styles.accessFeeLabel}>One-time Access Fee</Text>
          <Text style={styles.accessFeeValue}>{formatFCFA(unlockFeeFCFA)}</Text>
        </View>

        <Button
          title="Unlock Details"
          onPress={onUnlockPress}
          variant="secondary"
          size="md"
          leftIcon={<Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />}
        />
      </View>

      <View style={styles.paymentMethodsRow}>
        <Ionicons name="flash-outline" size={12} color={COLORS.textMuted} />
        <Text style={styles.paymentMethodsText}>Instant unlock via MTN Mobile Money or Orange Money</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: SPACING.xl,
    marginVertical: SPACING.lg,
    ...SHADOWS.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  lockCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  titleColumn: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  itemsList: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.sm + 2,
    marginBottom: SPACING.lg,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    ...TYPOGRAPHY.captionMedium,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  itemLock: {
    marginLeft: SPACING.xs,
  },
  actionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  priceContainer: {
    justifyContent: 'center',
  },
  accessFeeLabel: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
  },
  accessFeeValue: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
  },
  paymentMethodsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: SPACING.md,
  },
  paymentMethodsText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontSize: 11,
  },
});
