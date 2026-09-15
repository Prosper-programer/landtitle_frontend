// Document Card Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { LandDocument } from '../../types';

interface DocumentCardProps {
  document: LandDocument;
  isLocked?: boolean;
  onPress?: () => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  isLocked = false,
  onPress,
}) => {
  const getDocumentTypeLabel = (type: LandDocument['type']) => {
    switch (type) {
      case 'titre_foncier':
        return 'Titre Foncier (Land Certificate)';
      case 'plan_bornage':
        return 'Plan de Bornage (Survey Plan)';
      case 'certificat_propriete':
        return 'Certificat de Propriété';
      case 'attestation_non_litige':
        return 'Non-Dispute Certificate';
      default:
        return 'Cadastral Document';
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={isLocked ? 1 : 0.75}
      style={[styles.card, isLocked && styles.cardLocked]}
      onPress={isLocked ? undefined : onPress}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={isLocked ? 'lock-closed' : 'document-text'}
          size={20}
          color={isLocked ? COLORS.textMuted : COLORS.secondary}
        />
      </View>

      <View style={styles.infoColumn}>
        <Text style={styles.title} numberOfLines={1}>
          {document.name}
        </Text>
        <Text style={styles.typeLabel}>{getDocumentTypeLabel(document.type)}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.fileSize}>{document.fileSize}</Text>
          {document.isVerified && (
            <View style={styles.verifiedTag}>
              <Ionicons name="checkmark-circle" size={12} color={COLORS.success} />
              <Text style={styles.verifiedText}>Certified Document</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.actionColumn}>
        {isLocked ? (
          <View style={styles.lockedPill}>
            <Text style={styles.lockedPillText}>Locked</Text>
          </View>
        ) : (
          <View style={styles.viewButton}>
            <Text style={styles.viewText}>View</Text>
            <Ionicons name="eye-outline" size={14} color={COLORS.secondary} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  cardLocked: {
    backgroundColor: COLORS.surfaceSecondary,
    opacity: 0.85,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  infoColumn: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  typeLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  fileSize: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  verifiedText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.success,
  },
  actionColumn: {
    marginLeft: SPACING.sm,
  },
  lockedPill: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
  },
  lockedPillText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textSecondary,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.secondaryLight,
  },
  viewText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.secondary,
  },
});
