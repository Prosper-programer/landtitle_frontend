// Professional Land Titling Advisors & Appointments Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../src/constants/theme';
import { useAppointment } from '../../src/store/AppointmentContext';
import { Button } from '../../src/components/common/Button';
import { formatFCFA } from '../../src/constants/cameroonData';

export default function AdvisorsScreen() {
  const router = useRouter();
  const { advisors, appointments, isLoading, refreshAppointments } = useAppointment();
  const [activeTab, setActiveTab] = useState<'advisors' | 'my_appointments'>('advisors');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshAppointments} />}
    >
      {/* Screen Header */}
      <View style={styles.header}>
        <Text style={styles.headerBadge}>OFFICIAL ADVISORY NETWORK</Text>
        <Text style={styles.headerTitle}>Professional Guidance</Text>
        <Text style={styles.headerSubtitle}>
          Consult registered notaries, boundary surveyors, and legal conveyancers on Cameroon land regulations.
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'advisors' && styles.tabBtnActive]}
          onPress={() => setActiveTab('advisors')}
        >
          <Text style={[styles.tabText, activeTab === 'advisors' && styles.tabTextActive]}>
            Find an Advisor ({advisors.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'my_appointments' && styles.tabBtnActive]}
          onPress={() => setActiveTab('my_appointments')}
        >
          <Text style={[styles.tabText, activeTab === 'my_appointments' && styles.tabTextActive]}>
            My Consultations ({appointments.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'advisors' ? (
        /* Advisors List */
        <View style={styles.list}>
          {advisors.map((advisor) => (
            <View key={advisor.id} style={styles.advisorCard}>
              <View style={styles.cardTop}>
                <Image source={{ uri: advisor.avatarUrl }} style={styles.avatar} />
                <View style={styles.advisorInfo}>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={13} color="#EAB308" />
                    <Text style={styles.ratingText}>
                      {advisor.rating} ({advisor.reviewCount} reviews)
                    </Text>
                  </View>
                  <Text style={styles.name}>{advisor.fullName}</Text>
                  <Text style={styles.roleTitle}>{advisor.roleTitle}</Text>
                  <Text style={styles.location}>
                    <Ionicons name="location-outline" size={12} color={COLORS.textSecondary} /> {advisor.location} • {advisor.yearsOfExperience} yrs exp.
                  </Text>
                </View>
              </View>

              <Text style={styles.bio} numberOfLines={3}>
                {advisor.bio}
              </Text>

              {/* Specialties */}
              <View style={styles.specialtiesRow}>
                {advisor.specialties.map((spec, i) => (
                  <View key={i} style={styles.specChip}>
                    <Text style={styles.specText}>{spec}</Text>
                  </View>
                ))}
              </View>

              {/* Fee & Booking Button */}
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.feeLabel}>Consultation Fee</Text>
                  <Text style={styles.feeAmount}>{formatFCFA(advisor.consultationFeeFCFA)}</Text>
                </View>
                <Button
                  title="Book Appointment"
                  onPress={() =>
                    router.push({
                      pathname: '/advisor/book',
                      params: { advisorId: advisor.id },
                    })
                  }
                  variant="primary"
                  size="sm"
                  leftIcon={<Ionicons name="calendar" size={14} color="#FFFFFF" />}
                />
              </View>
            </View>
          ))}
        </View>
      ) : (
        /* Appointments List */
        <View style={styles.list}>
          {appointments.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="calendar-outline" size={32} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No Scheduled Consultations</Text>
              <Text style={styles.emptyDesc}>
                Select an advisor above to book a formal session regarding land titling procedures.
              </Text>
            </View>
          ) : (
            appointments.map((apt) => (
              <View key={apt.id} style={styles.aptCard}>
                <View style={styles.aptHeader}>
                  <View>
                    <Text style={styles.aptAdvisorName}>{apt.advisorName}</Text>
                    <Text style={styles.aptRole}>{apt.advisorRole}</Text>
                  </View>
                  <View style={styles.aptStatusPill}>
                    <Text style={styles.aptStatusText}>{apt.status.toUpperCase()}</Text>
                  </View>
                </View>

                <View style={styles.aptTimeRow}>
                  <Ionicons name="time-outline" size={15} color={COLORS.secondary} />
                  <Text style={styles.aptTimeText}>
                    {apt.date} • {apt.timeSlot}
                  </Text>
                </View>

                <Text style={styles.aptTopicLabel}>Session Subject:</Text>
                <Text style={styles.aptTopic}>{apt.topic}</Text>

                {apt.notes && (
                  <View style={styles.aptNotesBox}>
                    <Text style={styles.aptNotesText}>{apt.notes}</Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

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
    marginBottom: SPACING.lg,
  },
  headerBadge: {
    ...TYPOGRAPHY.micro,
    color: COLORS.secondary,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 20,
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
  list: {
    gap: SPACING.md,
  },
  advisorCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    ...SHADOWS.subtle,
  },
  cardTop: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.surfaceSecondary,
    marginRight: SPACING.md,
  },
  advisorInfo: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  ratingText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  name: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
  },
  roleTitle: {
    ...TYPOGRAPHY.captionMedium,
    color: COLORS.secondary,
    marginTop: 1,
  },
  location: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  bio: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  specialtiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  specChip: {
    backgroundColor: COLORS.background,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  specText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textSecondary,
    fontSize: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  feeLabel: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
  },
  feeAmount: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary,
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
    textAlign: 'center',
    marginTop: 2,
  },
  aptCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    ...SHADOWS.subtle,
  },
  aptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  aptAdvisorName: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary,
  },
  aptRole: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  aptStatusPill: {
    backgroundColor: COLORS.successLight,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: RADIUS.xs,
  },
  aptStatusText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.success,
    fontWeight: '700',
  },
  aptTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: SPACING.xs,
  },
  aptTimeText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.secondary,
  },
  aptTopicLabel: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  aptTopic: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  aptNotesBox: {
    backgroundColor: COLORS.background,
    padding: SPACING.sm,
    borderRadius: RADIUS.xs,
    marginTop: SPACING.sm,
  },
  aptNotesText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
});
