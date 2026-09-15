// Book Appointment with Professional Advisor Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../src/constants/theme';
import { useAppointment } from '../../src/store/AppointmentContext';
import { Header } from '../../src/components/common/Header';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { formatFCFA } from '../../src/constants/cameroonData';
import { ProfessionalAdvisor } from '../../src/types';

export default function BookAdvisorScreen() {
  const router = useRouter();
  const { advisorId } = useLocalSearchParams<{ advisorId: string }>();
  const { advisors, bookAppointment } = useAppointment();

  const [advisor, setAdvisor] = useState<ProfessionalAdvisor | null>(null);
  const [selectedDate, setSelectedDate] = useState('2026-09-18');
  const [selectedSlot, setSelectedSlot] = useState('10:00 - 11:00');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);

  const dates = [
    { label: 'Wed 16 Sep', value: '2026-09-16' },
    { label: 'Thu 17 Sep', value: '2026-09-17' },
    { label: 'Fri 18 Sep', value: '2026-09-18' },
    { label: 'Mon 21 Sep', value: '2026-09-21' },
  ];

  const slots = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '14:00 - 15:00',
    '15:30 - 16:30',
  ];

  useEffect(() => {
    if (advisorId) {
      const found = advisors.find((a) => a.id === advisorId);
      if (found) setAdvisor(found);
    } else if (advisors.length > 0) {
      setAdvisor(advisors[0]);
    }
  }, [advisorId, advisors]);

  const handleConfirmBooking = async () => {
    if (!topic.trim() || topic.trim().length < 10) {
      Alert.alert('Required', 'Please describe the land titling issue or advice you require (minimum 10 characters).');
      return;
    }

    if (!advisor) return;

    try {
      setLoading(true);
      await bookAppointment({
        advisorId: advisor.id,
        advisorName: advisor.fullName,
        advisorRole: advisor.roleTitle,
        date: selectedDate,
        timeSlot: selectedSlot,
        topic: topic.trim(),
        feeFCFA: advisor.consultationFeeFCFA,
      });

      Alert.alert(
        'Appointment Confirmed',
        `Your consultation session with ${advisor.fullName} has been scheduled for ${selectedDate} at ${selectedSlot}.`,
        [
          {
            text: 'View My Consultations',
            onPress: () => router.replace('/(tabs)/advisors'),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Booking Error', err.message || 'Could not schedule appointment.');
    } finally {
      setLoading(false);
    }
  };

  if (!advisor) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Book Consultation" showBack onBack={() => router.back()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ ...TYPOGRAPHY.body, color: COLORS.textSecondary }}>Advisor not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Book Consultation" showBack onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Advisor Summary Card */}
        <View style={styles.advisorCard}>
          <Image source={{ uri: advisor.avatarUrl }} style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.advisorName}>{advisor.fullName}</Text>
            <Text style={styles.advisorRole}>{advisor.roleTitle}</Text>
            <Text style={styles.advisorMeta}>
              {advisor.location} • {advisor.yearsOfExperience} yrs exp.
            </Text>
            <Text style={styles.feeText}>
              Fee: <Text style={styles.feeBold}>{formatFCFA(advisor.consultationFeeFCFA)}</Text>
            </Text>
          </View>
        </View>

        {/* Date Selector */}
        <Text style={styles.sectionLabel}>Select Consultation Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesRow}>
          {dates.map((d) => {
            const isSel = selectedDate === d.value;
            return (
              <TouchableOpacity
                key={d.value}
                style={[styles.dateCard, isSel && styles.dateCardActive]}
                onPress={() => setSelectedDate(d.value)}
              >
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={isSel ? '#FFFFFF' : COLORS.primary}
                />
                <Text style={[styles.dateText, isSel && styles.dateTextActive]}>
                  {d.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Time Slot Selector */}
        <Text style={styles.sectionLabel}>Select Time Slot</Text>
        <View style={styles.slotsGrid}>
          {slots.map((slot) => {
            const isSel = selectedSlot === slot;
            return (
              <TouchableOpacity
                key={slot}
                style={[styles.slotChip, isSel && styles.slotChipActive]}
                onPress={() => setSelectedSlot(slot)}
              >
                <Text style={[styles.slotText, isSel && styles.slotTextActive]}>{slot}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Topic Input */}
        <View style={styles.inputSection}>
          <Input
            label="Describe Your Titling / Land Procedure Need *"
            placeholder="e.g. Guidance on transfer of deed following direct purchase; Checking if certificate is free from customary mortgages..."
            value={topic}
            onChangeText={setTopic}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Advice Guarantee */}
        <View style={styles.guaranteeBox}>
          <Ionicons name="shield-checkmark" size={18} color={COLORS.secondary} />
          <Text style={styles.guaranteeText}>
            Consultations are held confidentially via secure phone or video meeting. The advisor will review your titling questions with reference to Cameroonian land law.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Booking Button */}
      <SafeAreaView style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomBarLabel}>Total Session Fee</Text>
          <Text style={styles.bottomBarPrice}>{formatFCFA(advisor.consultationFeeFCFA)}</Text>
        </View>
        <Button
          title="Confirm Booking"
          onPress={handleConfirmBooking}
          variant="primary"
          size="md"
          loading={loading}
          leftIcon={<Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />}
        />
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: 100,
  },
  advisorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.surfaceSecondary,
  },
  advisorName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
  },
  advisorRole: {
    ...TYPOGRAPHY.captionMedium,
    color: COLORS.secondary,
    marginTop: 1,
  },
  advisorMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  feeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  feeBold: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  sectionLabel: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  datesRow: {
    marginBottom: SPACING.lg,
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.background,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  dateCardActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dateText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.primary,
  },
  dateTextActive: {
    color: '#FFFFFF',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  slotChip: {
    width: '48%',
    backgroundColor: COLORS.background,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  slotChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  slotText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.primary,
  },
  slotTextActive: {
    color: '#FFFFFF',
  },
  inputSection: {
    marginBottom: SPACING.lg,
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: COLORS.secondaryLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  guaranteeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textPrimary,
    lineHeight: 18,
    flex: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    ...SHADOWS.lg,
  },
  bottomBarLabel: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
  },
  bottomBarPrice: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
  },
});
