// Seller Listing Tracking & 48-Hour Verification Timeline Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../src/constants/theme';
import { useLand } from '../../src/store/LandContext';
import { useVerification } from '../../src/store/VerificationContext';
import { Header } from '../../src/components/common/Header';
import { VerificationTimeline } from '../../src/components/verification/VerificationTimeline';
import { StatusBadge } from '../../src/components/common/StatusBadge';
import { Button } from '../../src/components/common/Button';
import { formatFCFA, formatArea } from '../../src/constants/cameroonData';
import { LandListing, VerificationRequest } from '../../src/types';

export default function SellerListingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sellerListings } = useLand();
  const { requests } = useVerification();

  const [listing, setListing] = useState<LandListing | null>(null);
  const [verifRequest, setVerifRequest] = useState<VerificationRequest | null>(null);

  useEffect(() => {
    if (id) {
      const found = sellerListings.find((l) => l.id === id);
      if (found) {
        setListing(found);
        const req = requests.find((r) => r.landId === found.id || r.landTitleNumber === found.landTitleNumber);
        if (req) {
          setVerifRequest(req);
        }
      }
    } else if (sellerListings.length > 0) {
      setListing(sellerListings[0]);
      const req = requests.find((r) => r.landId === sellerListings[0].id);
      if (req) setVerifRequest(req);
    }
  }, [id, sellerListings, requests]);

  if (!listing) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Dossier Tracking" showBack onBack={() => router.back()} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No listing selected.</Text>
          <Button title="Back to Dashboard" onPress={() => router.back()} variant="primary" size="sm" />
        </View>
      </SafeAreaView>
    );
  }

  // Fallback timeline if matching request is loading
  const timelineData = verifRequest?.timeline || [
    { id: '1', title: 'Request Submitted', description: 'Seller submitted land title documentation', status: 'completed', timestamp: 'Yesterday' },
    { id: '2', title: 'Documents Received', description: 'PDF scans and deed copies received and validated', status: 'completed', timestamp: 'Yesterday' },
    { id: '3', title: 'Surveyor Manual Review', description: 'Assigned to licensed surveyor for physical inspection', status: 'in_progress' },
    { id: '4', title: 'Government Record Check', description: 'Cross-check against regional cadastral archives (Estimated within 48h)', status: 'pending' },
    { id: '5', title: 'Verification Result', description: 'Final decision on publication', status: 'pending' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Dossier Verification Status"
        subtitle={listing.landTitleNumber}
        showBack
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Listing Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryTitle} numberOfLines={1}>
                {listing.title}
              </Text>
              <Text style={styles.summaryLocation}>
                {listing.neighborhood}, {listing.subdivision} ({listing.region})
              </Text>
            </View>
            <StatusBadge status={listing.verificationStatus} size="sm" />
          </View>

          <View style={styles.summaryStatsRow}>
            <View>
              <Text style={styles.metaLabel}>Surface Area</Text>
              <Text style={styles.metaValue}>{formatArea(listing.areaSqM)}</Text>
            </View>
            <View style={styles.divider} />
            <View>
              <Text style={styles.metaLabel}>Asking Price</Text>
              <Text style={styles.metaValue}>{formatFCFA(listing.priceFCFA)}</Text>
            </View>
          </View>
        </View>

        {/* 48-Hour Verification Timeline Tracker Component */}
        <VerificationTimeline
          timeline={timelineData}
          rejectionReason={listing.rejectionReason || verifRequest?.rejectionReason}
          surveyorNotes={listing.surveyorNotes || verifRequest?.surveyorNotes}
          titleNumber={listing.landTitleNumber}
        />

        {/* Action Button for Rejection Resubmission */}
        {listing.verificationStatus === 'rejected' && (
          <View style={styles.rejectionActionBox}>
            <Text style={styles.rejectionNotice}>
              If you have corrected the disputed boundary or updated your deed dossier with the cadastral registrar, you may resubmit for a new review.
            </Text>
            <Button
              title="Review & Resubmit Dossier"
              onPress={() => router.push('/seller/submit')}
              variant="primary"
              size="md"
            />
          </View>
        )}

        {/* Action Button for Published listings */}
        {listing.verificationStatus === 'verified' && (
          <Button
            title="View Live Public Listing"
            onPress={() => router.push(`/property/${listing.id}`)}
            variant="outline"
            size="md"
            style={{ marginTop: SPACING.md }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    ...SHADOWS.subtle,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  summaryTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
  },
  summaryLocation: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  summaryStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    gap: SPACING.xl,
  },
  metaLabel: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
  },
  metaValue: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary,
    marginTop: 1,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
  },
  rejectionActionBox: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
    marginTop: SPACING.md,
    gap: SPACING.md,
  },
  rejectionNotice: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});
