// 48-Hour Land Title Verification Timeline Tracker
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { TimelineStep } from '../../types';

interface VerificationTimelineProps {
  timeline: TimelineStep[];
  rejectionReason?: string;
  surveyorNotes?: string;
  titleNumber: string;
}

export const VerificationTimeline: React.FC<VerificationTimelineProps> = ({
  timeline,
  rejectionReason,
  surveyorNotes,
  titleNumber,
}) => {
  return (
    <View style={styles.container}>
      {/* 48-Hour Notice Card */}
      <View style={styles.noticeCard}>
        <View style={styles.noticeIconCircle}>
          <Ionicons name="shield-checkmark" size={20} color={COLORS.secondary} />
        </View>
        <View style={styles.noticeTextWrapper}>
          <Text style={styles.noticeTitle}>Land Title Verification ({titleNumber})</Text>
          <Text style={styles.noticeBody}>
            Estimated verification time: <Text style={styles.noticeHighlight}>up to 48 hours</Text>.
            A certified Land Surveyor manually cross-checks the title number against regional cadastral archives.
          </Text>
        </View>
      </View>

      {/* Timeline Steps */}
      <View style={styles.timelineList}>
        {timeline.map((step, index) => {
          const isLast = index === timeline.length - 1;
          const isCompleted = step.status === 'completed';
          const isInProgress = step.status === 'in_progress';
          const isRejected = isLast && !!rejectionReason;

          let iconName: keyof typeof Ionicons.glyphMap = 'radio-button-off';
          let nodeBg = COLORS.border;
          let nodeColor = COLORS.textMuted;

          if (isRejected) {
            iconName = 'close';
            nodeBg = COLORS.error;
            nodeColor = '#FFFFFF';
          } else if (isCompleted) {
            iconName = 'checkmark';
            nodeBg = COLORS.success;
            nodeColor = '#FFFFFF';
          } else if (isInProgress) {
            iconName = 'ellipse';
            nodeBg = COLORS.secondary;
            nodeColor = '#FFFFFF';
          }

          return (
            <View key={step.id || index} style={styles.stepRow}>
              {/* Left Column: Node + Line */}
              <View style={styles.nodeColumn}>
                <View style={[styles.nodeCircle, { backgroundColor: nodeBg }]}>
                  <Ionicons name={iconName} size={12} color={nodeColor} />
                </View>
                {!isLast && (
                  <View
                    style={[
                      styles.connectingLine,
                      { backgroundColor: isCompleted ? COLORS.success : COLORS.border },
                    ]}
                  />
                )}
              </View>

              {/* Right Column: Step details */}
              <View style={styles.contentColumn}>
                <View style={styles.titleRow}>
                  <Text
                    style={[
                      styles.stepTitle,
                      isInProgress && styles.stepTitleActive,
                      isRejected && styles.stepTitleRejected,
                    ]}
                  >
                    {step.title}
                  </Text>
                  {step.timestamp && (
                    <Text style={styles.timestamp}>{step.timestamp}</Text>
                  )}
                </View>
                <Text style={styles.stepDesc}>{step.description}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Rejection Alert Box */}
      {rejectionReason && (
        <View style={styles.rejectionBox}>
          <View style={styles.rejectionHeader}>
            <Ionicons name="alert-circle" size={18} color={COLORS.error} />
            <Text style={styles.rejectionHeading}>Verification Rejected by Surveyor</Text>
          </View>
          <Text style={styles.rejectionText}>{rejectionReason}</Text>
        </View>
      )}

      {/* Surveyor Verification Notes */}
      {surveyorNotes && !rejectionReason && (
        <View style={styles.surveyorNotesBox}>
          <View style={styles.surveyorHeader}>
            <Ionicons name="document-text-outline" size={16} color={COLORS.success} />
            <Text style={styles.surveyorHeading}>Official Surveyor Audit Note</Text>
          </View>
          <Text style={styles.surveyorNotesText}>{surveyorNotes}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  noticeCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.secondaryLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.xl,
    alignItems: 'flex-start',
  },
  noticeIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  noticeTextWrapper: {
    flex: 1,
  },
  noticeTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary,
    marginBottom: 2,
  },
  noticeBody: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  noticeHighlight: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  timelineList: {
    paddingLeft: SPACING.xs,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 52,
  },
  nodeColumn: {
    alignItems: 'center',
    width: 24,
    marginRight: SPACING.md,
  },
  nodeCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  connectingLine: {
    width: 2,
    flex: 1,
    marginVertical: 2,
    minHeight: 32,
  },
  contentColumn: {
    flex: 1,
    paddingBottom: SPACING.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  stepTitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
  },
  stepTitleActive: {
    color: COLORS.secondary,
    fontWeight: '700',
  },
  stepTitleRejected: {
    color: COLORS.error,
    fontWeight: '700',
  },
  timestamp: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
  },
  stepDesc: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  rejectionBox: {
    backgroundColor: COLORS.errorLight,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  rejectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  rejectionHeading: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.error,
  },
  rejectionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  surveyorNotesBox: {
    backgroundColor: COLORS.successLight,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  surveyorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  surveyorHeading: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.success,
  },
  surveyorNotesText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
});
