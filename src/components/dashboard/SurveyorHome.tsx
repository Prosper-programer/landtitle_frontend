// Land Surveyor Verification Portal Dashboard Component
import React, { useState } from 'react';
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
import { useVerification } from '../../store/VerificationContext';
import { StatusBadge } from '../common/StatusBadge';
import { formatArea } from '../../constants/cameroonData';

export const SurveyorHome: React.FC = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { requests, isLoading, refreshRequests } = useVerification();
  const [activeTab, setActiveTab] = useState<'pending' | 'under_review' | 'completed'>('pending');

  const filteredRequests = requests.filter((r) => {
    if (activeTab === 'pending') {
      return r.status === 'submitted';
    }
    if (activeTab === 'under_review') {
      return r.status === 'under_review';
    }
    return r.status === 'approved' || r.status === 'rejected';
  });

  const pendingCount = requests.filter((r) => r.status === 'submitted').length;
  const reviewCount = requests.filter((r) => r.status === 'under_review').length;
  const completedCount = requests.filter((r) => r.status === 'approved' || r.status === 'rejected').length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshRequests} />}
    >
      {/* Surveyor Top Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerBadge}>OGEC REGISTERED CADASTRE EXPERT</Text>
          <Text style={styles.headerTitle}>{currentUser?.fullName || 'Ing. Samuel Ewane'}</Text>
          <Text style={styles.headerSubtitle}>Order of Certified Surveyors of Cameroon</Text>
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

      {/* Cadastral Notice */}
      <View style={styles.noticeBox}>
        <Ionicons name="information-circle-outline" size={20} color={COLORS.info} style={styles.noticeIcon} />
        <Text style={styles.noticeText}>
          External verification protocol: Physically verify boundary coordinates and cross-check folio records against regional MINDCAF cadastral archives.
        </Text>
      </View>

      {/* Requests Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'pending' && styles.tabBtnActive]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>
            Pending ({pendingCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'under_review' && styles.tabBtnActive]}
          onPress={() => setActiveTab('under_review')}
        >
          <Text style={[styles.tabText, activeTab === 'under_review' && styles.tabTextActive]}>
            In Review ({reviewCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'completed' && styles.tabBtnActive]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>
            Completed ({completedCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Requests List */}
      <View style={styles.listSection}>
        {filteredRequests.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="documents-outline" size={32} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No verification requests</Text>
            <Text style={styles.emptyDesc}>There are currently no requests in this status.</Text>
          </View>
        ) : (
          filteredRequests.map((req) => (
            <TouchableOpacity
              key={req.id}
              activeOpacity={0.85}
              style={styles.requestCard}
              onPress={() => router.push(`/surveyor/review/${req.id}`)}
            >
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.titleNumber}>{req.landTitleNumber}</Text>
                  <Text style={styles.locationText}>
                    {req.subdivision}, {req.division} ({req.region})
                  </Text>
                </View>
                <StatusBadge
                  status={req.status === 'approved' ? 'verified' : req.status}
                  size="sm"
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.cardDetailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Seller</Text>
                  <Text style={styles.detailValue}>{req.sellerName}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Surface Area</Text>
                  <Text style={styles.detailValue}>{formatArea(req.surfaceAreaSqM)}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Submitted</Text>
                  <Text style={styles.detailValue}>
                    {new Date(req.submittedAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Est. SLA</Text>
                  <Text style={[styles.detailValue, { color: COLORS.secondary }]}>48 Hours</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.actionPromptText}>Inspect Deed Scans & Audit Title</Text>
                <Ionicons name="arrow-forward" size={16} color={COLORS.secondary} />
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
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
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  headerBadge: {
    ...TYPOGRAPHY.micro,
    color: COLORS.accent,
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
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
  noticeBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.infoLight,
    borderWidth: 1,
    borderColor: COLORS.infoBorder,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    alignItems: 'flex-start',
  },
  noticeIcon: {
    marginRight: SPACING.sm,
    marginTop: 1,
  },
  noticeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.info,
    lineHeight: 18,
    flex: 1,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 4,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: RADIUS.sm,
  },
  tabBtnActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    ...TYPOGRAPHY.captionMedium,
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listSection: {
    gap: SPACING.md,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
  emptyDesc: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  requestCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    ...SHADOWS.subtle,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleNumber: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
  },
  locationText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.md,
  },
  cardDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  detailItem: {
    width: '50%',
  },
  detailLabel: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    fontSize: 10,
  },
  detailValue: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  actionPromptText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.secondary,
  },
});
