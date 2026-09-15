// Seller Dashboard Screen Component
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../store/AuthContext';
import { useLand } from '../../store/LandContext';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { formatFCFA, formatArea } from '../../constants/cameroonData';

export const SellerHome: React.FC = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { sellerListings, isLoading, refreshLands } = useLand();

  // Metrics calculation
  const totalListings = sellerListings.length;
  const pendingCount = sellerListings.filter((l) => l.verificationStatus === 'pending' || l.verificationStatus === 'under_review').length;
  const verifiedCount = sellerListings.filter((l) => l.verificationStatus === 'verified').length;
  const rejectedCount = sellerListings.filter((l) => l.verificationStatus === 'rejected').length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshLands} />}
    >
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>Seller Control Center</Text>
          <Text style={styles.headerTitle}>{currentUser?.fullName || 'Paul Njoya'}</Text>
        </View>
        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => router.push('/(tabs)/notifications')}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={22} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => router.push('/(tabs)/profile')}
            activeOpacity={0.8}
          >
            {currentUser?.avatarUrl ? (
              <Image source={{ uri: currentUser.avatarUrl }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarFallback}>
                <Ionicons name="person" size={18} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Primary CTA: Submit a Land */}
      <View style={styles.ctaCard}>
        <View style={styles.ctaTextCol}>
          <Text style={styles.ctaTitle}>Have a parcel to sell?</Text>
          <Text style={styles.ctaDesc}>
            Submit your land title number and survey plans for 48-hour manual verification by a certified surveyor.
          </Text>
          <Button
            title="Submit a Land"
            onPress={() => router.push('/seller/submit')}
            variant="secondary"
            size="md"
            leftIcon={<Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />}
            style={styles.ctaBtn}
          />
        </View>
      </View>

      {/* Summary Statistics Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalListings}</Text>
          <Text style={styles.statLabel}>My Listings</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: COLORS.warning }]}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending (48h)</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: COLORS.success }]}>{verifiedCount}</Text>
          <Text style={styles.statLabel}>Verified</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: COLORS.error }]}>{rejectedCount}</Text>
          <Text style={styles.statLabel}>Rejected</Text>
        </View>
      </View>

      {/* My Listings Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Property Dossiers</Text>
        <Text style={styles.sectionCount}>{totalListings} total</Text>
      </View>

      {sellerListings.map((listing) => {
        const isRejected = listing.verificationStatus === 'rejected';
        const isPending = listing.verificationStatus === 'pending' || listing.verificationStatus === 'under_review';
        const isVerified = listing.verificationStatus === 'verified';

        return (
          <TouchableOpacity
            key={listing.id}
            activeOpacity={0.88}
            style={styles.listingCard}
            onPress={() =>
              router.push({
                pathname: '/seller/listing-detail',
                params: { id: listing.id },
              })
            }
          >
            <View style={styles.cardTopRow}>
              <Image
                source={{
                  uri:
                    listing.images && listing.images.length > 0
                      ? listing.images[0]
                      : 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
                }}
                style={styles.listingThumb}
              />
              <View style={styles.listingInfo}>
                <View style={styles.statusRow}>
                  <StatusBadge status={listing.verificationStatus} size="sm" />
                </View>
                <Text style={styles.listingTitle} numberOfLines={1}>
                  {listing.title}
                </Text>
                <Text style={styles.listingMeta}>
                  {listing.neighborhood} • {formatArea(listing.areaSqM)}
                </Text>
                <Text style={styles.listingPrice}>{formatFCFA(listing.priceFCFA)}</Text>
              </View>
            </View>

            {/* 48h Cadastral Tracking Prompt or Details */}
            {isPending && (
              <View style={styles.pendingBar}>
                <Ionicons name="time-outline" size={14} color={COLORS.warning} />
                <Text style={styles.pendingBarText}>
                  Under manual cadastral check (Est. within 48h)
                </Text>
                <Ionicons name="chevron-forward" size={14} color={COLORS.warning} />
              </View>
            )}

            {isRejected && (
              <View style={styles.rejectedBar}>
                <Ionicons name="alert-circle-outline" size={14} color={COLORS.error} />
                <Text style={styles.rejectedBarText} numberOfLines={1}>
                  Reason: {listing.rejectionReason || 'Boundary overlap noted in Cadastre'}
                </Text>
              </View>
            )}

            {isVerified && (
              <View style={styles.verifiedBar}>
                <Ionicons name="checkmark-circle-outline" size={14} color={COLORS.success} />
                <Text style={styles.verifiedBarText}>
                  Published for sale • Authenticated by Surveyor
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 54, // Clear demo switcher
    paddingBottom: SPACING.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.captionMedium,
    color: COLORS.textSecondary,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 2,
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  ctaTextCol: {
    alignItems: 'flex-start',
  },
  ctaTitle: {
    ...TYPOGRAPHY.h2,
    color: '#FFFFFF',
    marginBottom: SPACING.xs,
  },
  ctaDesc: {
    ...TYPOGRAPHY.body,
    color: '#CBD5E1',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  ctaBtn: {
    paddingHorizontal: SPACING.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.subtle,
  },
  statNumber: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    marginBottom: 2,
  },
  statLabel: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  sectionCount: {
    ...TYPOGRAPHY.captionMedium,
    color: COLORS.textMuted,
  },
  listingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.subtle,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listingThumb: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceSecondary,
    marginRight: SPACING.md,
  },
  listingInfo: {
    flex: 1,
  },
  statusRow: {
    marginBottom: 4,
  },
  listingTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  listingMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  listingPrice: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.secondary,
  },
  pendingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.warningLight,
    paddingVertical: 6,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.xs,
    marginTop: SPACING.sm,
  },
  pendingBarText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.warning,
    fontSize: 11,
    flex: 1,
  },
  rejectedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.errorLight,
    paddingVertical: 6,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.xs,
    marginTop: SPACING.sm,
  },
  rejectedBarText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.error,
    fontSize: 11,
    flex: 1,
  },
  verifiedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.successLight,
    paddingVertical: 6,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.xs,
    marginTop: SPACING.sm,
  },
  verifiedBarText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.success,
    fontSize: 11,
  },
});
