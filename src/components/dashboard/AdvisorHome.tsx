import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../store/AuthContext';
import { useAppointment } from '../../store/AppointmentContext';
import { Button } from '../common/Button';
import { formatFCFA } from '../../constants/cameroonData';

export const AdvisorHome: React.FC = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { appointments, isLoading, refreshAppointments, updateStatus } = useAppointment();

  const confirmedApts = appointments.filter((a) => a.status === 'confirmed');
  const pastApts = appointments.filter((a) => a.status === 'completed');

  const handleComplete = async (id: string) => {
    try {
      await updateStatus(id, 'completed', 'Consultation notes recorded. Client advised on mutation dossier.');
      Alert.alert('Consultation Completed', 'Appointment marked as completed.');
    } catch {
      Alert.alert('Error', 'Could not update status.');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshAppointments} />}
    >
      {/* Top Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerRole}>CERTIFIED LEGAL & TITLING ADVISOR</Text>
          <Text style={styles.headerTitle}>{currentUser?.fullName || 'Me. Christiane Manga'}</Text>
          <Text style={styles.headerSubtitle}>Notarial Due Diligence & Property Law</Text>
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

      {/* Advisory Practice Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{confirmedApts.length}</Text>
          <Text style={styles.statLabel}>Upcoming Sessions</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: COLORS.success }]}>{pastApts.length + 42}</Text>
          <Text style={styles.statLabel}>Total Consultations</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: COLORS.secondary }]}>15,000</Text>
          <Text style={styles.statLabel}>Standard Fee (FCFA)</Text>
        </View>
      </View>

      {/* Titling Procedure Quick Guides for Clients */}
      <View style={styles.guideCard}>
        <View style={styles.guideHeader}>
          <Ionicons name="book-outline" size={20} color={COLORS.primary} />
          <Text style={styles.guideTitle}>Cameroon Land Titling Procedure Dossiers</Text>
        </View>
        <Text style={styles.guideText}>
          Reference guide under Decrees 76-165 & 2005-481 on Land Certificates:
        </Text>
        <View style={styles.stepsList}>
          <Text style={styles.stepBullet}>• Direct Titling (Immatriculation Directe sur domaine national)</Text>
          <Text style={styles.stepBullet}>• Total & Partial Mutation of existing Titre Foncier (Notarized Act)</Text>
          <Text style={styles.stepBullet}>• Boundary dispute arbitration & non-dispute certificate verification</Text>
        </View>
      </View>

      {/* Scheduled Inquiries */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Client Consultations</Text>
        <Text style={styles.sectionCount}>{appointments.length} scheduled</Text>
      </View>

      {appointments.map((apt) => (
        <View key={apt.id} style={styles.aptCard}>
          <View style={styles.aptHeaderRow}>
            <View>
              <Text style={styles.clientName}>{apt.userName}</Text>
              <Text style={styles.clientPhone}>{apt.userPhone}</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>{apt.status.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.timeRow}>
            <Ionicons name="calendar-outline" size={15} color={COLORS.secondary} />
            <Text style={styles.timeText}>
              {apt.date} at {apt.timeSlot}
            </Text>
            <Text style={styles.feeText}>• {formatFCFA(apt.feeFCFA)}</Text>
          </View>

          <Text style={styles.topicLabel}>Consultation Subject:</Text>
          <Text style={styles.topicText}>{apt.topic}</Text>

          {apt.status === 'confirmed' && (
            <View style={styles.btnRow}>
              <Button
                title="Mark Completed"
                onPress={() => handleComplete(apt.id)}
                variant="outline"
                size="sm"
                style={{ flex: 1 }}
              />
            </View>
          )}
        </View>
      ))}
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
    marginBottom: SPACING.lg,
  },
  headerRole: {
    ...TYPOGRAPHY.micro,
    color: '#7C3AED',
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
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.subtle,
  },
  statNumber: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    marginBottom: 2,
  },
  statLabel: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: 10,
  },
  guideCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.xs,
  },
  guideTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary,
  },
  guideText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  stepsList: {
    gap: 4,
    marginTop: 4,
  },
  stepBullet: {
    ...TYPOGRAPHY.captionMedium,
    color: COLORS.textPrimary,
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
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  aptCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.subtle,
  },
  aptHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  clientName: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary,
  },
  clientPhone: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  statusPill: {
    backgroundColor: COLORS.secondaryLight,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
  },
  statusPillText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.secondary,
    fontWeight: '700',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: SPACING.xs,
  },
  timeText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.secondary,
  },
  feeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  topicLabel: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  topicText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    marginTop: 2,
    marginBottom: SPACING.md,
  },
  btnRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: SPACING.sm,
  },
});
