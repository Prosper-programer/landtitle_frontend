// Land Surveyor Verification Review & Decision Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../../src/constants/theme';
import { useVerification } from '../../../src/store/VerificationContext';
import { Header } from '../../../src/components/common/Header';
import { DocumentCard } from '../../../src/components/property/DocumentCard';
import { StatusBadge } from '../../../src/components/common/StatusBadge';
import { Button } from '../../../src/components/common/Button';
import { ConfirmModal } from '../../../src/components/common/ConfirmModal';
import { Input } from '../../../src/components/common/Input';
import { formatArea } from '../../../src/constants/cameroonData';
import { VerificationRequest } from '../../../src/types';

export default function SurveyorReviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getRequestById, approveRequest, rejectRequest } = useVerification();

  const [request, setRequest] = useState<VerificationRequest | null>(null);
  const [loading, setLoading] = useState(false);

  // Modals state
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Form inputs for decision
  const [approvalNotes, setApprovalNotes] = useState('Physical boundary survey verified on site. Titre Foncier records match cadastral index feuille 42. No competing claims registered.');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState<string | undefined>();

  useEffect(() => {
    async function load() {
      if (id) {
        const found = await getRequestById(id);
        setRequest(found);
      }
    }
    load();
  }, [id, getRequestById]);

  if (!request) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Review Dossier" showBack onBack={() => router.back()} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Request not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isCompleted = request.status === 'approved' || request.status === 'rejected';

  const handleConfirmApprove = async () => {
    try {
      setLoading(true);
      await approveRequest(request.id, approvalNotes);
      setShowApproveModal(false);
      Alert.alert(
        'Land Title Verified',
        'The land title has been marked VERIFIED and is now automatically published for sale on TerraVerify.',
        [
          {
            text: 'Return to Requests',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Approval failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectionReason.trim() || rejectionReason.trim().length < 10) {
      setRejectionError('A detailed rejection reason is required (minimum 10 characters).');
      return;
    }

    try {
      setLoading(true);
      await rejectRequest(request.id, rejectionReason.trim());
      setShowRejectModal(false);
      Alert.alert(
        'Verification Rejected',
        'The rejection notice has been logged and the seller has been notified with the reason.',
        [
          {
            text: 'Return to Requests',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Rejection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Cadastral Review Dossier"
        subtitle={request.landTitleNumber}
        showBack
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Header Card */}
        <View style={styles.titleCard}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.landTitleNum}>{request.landTitleNumber}</Text>
              <Text style={styles.locationMeta}>
                {request.subdivision}, {request.division} • {request.region} Region
              </Text>
            </View>
            <StatusBadge status={request.status === 'approved' ? 'verified' : request.status} size="sm" />
          </View>

          <View style={styles.metaGrid}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Seller</Text>
              <Text style={styles.metaValue}>{request.sellerName}</Text>
              <Text style={styles.metaSub}>{request.sellerPhone}</Text>
            </View>

            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Surface Area</Text>
              <Text style={styles.metaValue}>{formatArea(request.surfaceAreaSqM)}</Text>
            </View>
          </View>
        </View>

        {/* IMPORTANT NOTICE: External Manual Cadastral Verification */}
        <View style={styles.protocolCard}>
          <View style={styles.protocolHeader}>
            <Ionicons name="alert-circle" size={20} color={COLORS.primary} />
            <Text style={styles.protocolTitle}>External Cadastral Verification Protocol</Text>
          </View>
          <Text style={styles.protocolText}>
            TerraVerify does not connect to an automated government database. As a licensed Cadastral Surveyor, you must manually cross-check this title number against official MINDCAF / Conservation Foncière registers and boundary ledgers before deciding.
          </Text>
        </View>

        {/* Submitted Documents for Inspection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attached Dossier Documents</Text>
          {request.documents && request.documents.length > 0 ? (
            request.documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                isLocked={false}
                onPress={() => router.push(`/documents/${doc.id}`)}
              />
            ))
          ) : (
            <Text style={styles.emptyDocs}>No scans attached to this request.</Text>
          )}
        </View>

        {/* Decision Actions (Disabled if already completed) */}
        {!isCompleted ? (
          <View style={styles.decisionCard}>
            <Text style={styles.decisionTitle}>Verification Decision</Text>
            <Text style={styles.decisionSub}>
              Confirm whether the title number matches authentic cadastral archives without active disputes.
            </Text>

            <View style={styles.actionRow}>
              <Button
                title="Reject Verification"
                onPress={() => setShowRejectModal(true)}
                variant="danger"
                size="md"
                style={styles.decisionBtn}
                leftIcon={<Ionicons name="close-circle-outline" size={18} color="#FFFFFF" />}
              />

              <Button
                title="Approve & Publish"
                onPress={() => setShowApproveModal(true)}
                variant="success"
                size="md"
                style={styles.decisionBtn}
                leftIcon={<Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />}
              />
            </View>
          </View>
        ) : (
          <View style={styles.completedCard}>
            <Ionicons
              name={request.status === 'approved' ? 'checkmark-circle' : 'close-circle'}
              size={24}
              color={request.status === 'approved' ? COLORS.success : COLORS.error}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.completedTitle}>
                {request.status === 'approved'
                  ? 'Verification Approved & Published'
                  : 'Verification Rejected'}
              </Text>
              <Text style={styles.completedDesc}>
                Audited by {request.surveyorName || 'Ing. Samuel Ewane'} on{' '}
                {request.reviewedAt ? new Date(request.reviewedAt).toLocaleDateString() : 'Today'}
              </Text>
              {request.rejectionReason && (
                <Text style={styles.rejectionReasonText}>
                  Reason: {request.rejectionReason}
                </Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Approve Confirmation Modal */}
      <ConfirmModal
        visible={showApproveModal}
        title="Confirm Land Title Approval"
        message="Confirm that this land title has been manually cross-checked and verified against cadastral archives? It will become immediately visible to buyers."
        confirmText="Confirm & Publish"
        cancelText="Cancel"
        isLoading={loading}
        onConfirm={handleConfirmApprove}
        onCancel={() => setShowApproveModal(false)}
      >
        <Input
          label="Surveyor Verification Audit Comment"
          value={approvalNotes}
          onChangeText={setApprovalNotes}
          multiline
          numberOfLines={3}
        />
      </ConfirmModal>

      {/* Reject Confirmation Modal */}
      <ConfirmModal
        visible={showRejectModal}
        title="Reject Land Title Verification"
        message="Are you sure you want to reject this verification? You must provide a formal reason for the seller."
        confirmText="Confirm Rejection"
        cancelText="Cancel"
        isDestructive
        isLoading={loading}
        onConfirm={handleConfirmReject}
        onCancel={() => setShowRejectModal(false)}
      >
        <Input
          label="Rejection Reason (Mandatory for Seller) *"
          placeholder="e.g. Disputed boundary registered under opposition N° 44; Direct attribution file incomplete."
          value={rejectionReason}
          onChangeText={(t) => {
            setRejectionReason(t);
            if (rejectionError) setRejectionError(undefined);
          }}
          error={rejectionError}
          multiline
          numberOfLines={3}
        />
      </ConfirmModal>
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
  },
  titleCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    ...SHADOWS.subtle,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  landTitleNum: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
  },
  locationMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  metaGrid: {
    flexDirection: 'row',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
  },
  metaValue: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  metaSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  protocolCard: {
    backgroundColor: COLORS.secondaryLight,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    marginBottom: SPACING.lg,
  },
  protocolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  protocolTitle: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.primary,
  },
  protocolText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptyDocs: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  decisionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  decisionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
    marginBottom: 4,
  },
  decisionSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  decisionBtn: {
    flex: 1,
  },
  completedCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  completedTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
  },
  completedDesc: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  rejectionReasonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});
