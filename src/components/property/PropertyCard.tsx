// Professional Property Card Component
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants/theme';
import { LandListing } from '../../types';
import { formatFCFA, formatArea } from '../../constants/cameroonData';
import { StatusBadge } from '../common/StatusBadge';

interface PropertyCardProps {
  land: LandListing;
  onPress: () => void;
  style?: ViewStyle;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  land,
  onPress,
  style,
  isSaved = false,
  onToggleSave,
}) => {
  const defaultImage =
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80';
  const displayImage = land.images && land.images.length > 0 ? land.images[0] : defaultImage;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[styles.card, style]}
      onPress={onPress}
    >
      {/* Property Image Container */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: displayImage }} style={styles.image} resizeMode="cover" />
        
        {/* Verification Status Overlay Badge */}
        <View style={styles.badgeOverlay}>
          <StatusBadge status={land.verificationStatus} size="sm" />
        </View>

        {/* Save/Favorite Heart Button */}
        {onToggleSave && (
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={onToggleSave}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={isSaved ? 'heart' : 'heart-outline'}
              size={18}
              color={isSaved ? COLORS.error : '#FFFFFF'}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Property Info Content */}
      <View style={styles.body}>
        {/* Location & Title */}
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={14} color={COLORS.secondary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {land.neighborhood}, {land.subdivision} ({land.region})
          </Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {land.title}
        </Text>

        {/* Specs Pill Badges */}
        <View style={styles.specsRow}>
          <View style={styles.specItem}>
            <Ionicons name="resize-outline" size={13} color={COLORS.textSecondary} />
            <Text style={styles.specText}>{formatArea(land.areaSqM)}</Text>
          </View>
          <View style={styles.specDivider} />
          <View style={styles.specItem}>
            <Ionicons name="document-text-outline" size={13} color={COLORS.textSecondary} />
            <Text style={styles.specText}>{land.landTitleNumber}</Text>
          </View>
        </View>

        {/* Price & Action Row */}
        <View style={styles.footerRow}>
          <View>
            <Text style={styles.priceLabel}>Asking Price</Text>
            <Text style={styles.priceValue}>{formatFCFA(land.priceFCFA)}</Text>
          </View>
          <View style={styles.viewDetailsBtn}>
            <Text style={styles.viewDetailsText}>View Details</Text>
            <Ionicons name="chevron-forward" size={14} color={COLORS.secondary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  imageContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.surfaceSecondary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeOverlay: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
  },
  saveBtn: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: SPACING.lg,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    ...TYPOGRAPHY.captionMedium,
    color: COLORS.secondary,
    marginLeft: 4,
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.md,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specDivider: {
    width: 1,
    height: 12,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
  specText: {
    ...TYPOGRAPHY.captionMedium,
    color: COLORS.textSecondary,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  priceLabel: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
  },
  priceValue: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewDetailsText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.secondary,
  },
});
