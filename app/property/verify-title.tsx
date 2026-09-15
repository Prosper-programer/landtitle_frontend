// Standalone Land Title Number Identification Verification Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../src/constants/theme';
import { useVerification } from '../../src/store/VerificationContext';
import { Button } from '../../src/components/common/Button';
import { Header } from '../../src/components/common/Header';

export default function VerifyTitleScreen() {
  const router = useRouter();
  const { checkTitleNumber } = useVerification();

  const [titleInput, setTitleInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    status: 'verified' | 'pending' | 'rejected' | 'not_found';
    details?: any;
  } | null>(null);

  const handleVerify = async () => {
    if (!titleInput.trim()) {
      Alert.alert('Required Field', 'Please enter a land title number (e.g. LT-2026-YDE-0482).');
      return;
    }

    try {
      setLoading(true);
      const res = await checkTitleNumber(titleInput.trim());
      setSearchResult(res);
    } catch {
      Alert.alert('Error', 'Unable to check title number at this time.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (code: string) => {
    setTitleInput(code);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Land Title Verification" showBack onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro Card */}
        <View style={styles.introCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={32} color={COLORS.secondary} />
          </View>
          <Text style={styles.introTitle}>Verify Land Authenticity</Text>
          <Text style={styles.introDesc}>
            Enter any Cameroonian Land Title number (Titre Foncier) to check whether it has been verified against official cadastral records.
          </Text>
          <View style={styles.slaBadge}>
            <Ionicons name="time-outline" size={14} color={COLORS.primary} />
            <Text style={styles.slaText}>48-Hour Manual Surveyor Audit Protocol</Text>
          </View>
        </View>

        {/* Input Section */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Land Title Number (Numéro du Titre Foncier)</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="document-text-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="e.g. LT-2026-YDE-0482"
              placeholderTextColor={COLORS.textMuted}
              value={titleInput}
              onChangeText={setTitleInput}
              autoCapitalize="characters"
            />
          </View>

          {/* Preset Buttons for Demo */}
          <View style={styles.presetsRow}>
            <Text style={styles.presetsLabel}>Try samples: </Text>
            <TouchableOpacity onPress={() => handlePreset('LT-2026-YDE-0482')}>
              <Text style={styles.presetLink}>LT-0482 (Verified)</Text>
            </TouchableOpacity>
            <Text style={styles.presetDivider}>•</Text>
            <TouchableOpacity onPress={() => handlePreset('LT-2026-DLA-4410')}>
              <Text style={styles.presetLink}>LT-4410 (Pending)</Text>
            </TouchableOpacity>
            <Text style={styles.presetDivider}>•</Text>
            <TouchableOpacity onPress={() => handlePreset('LT-2025-OBA-0914')}>
              <Text style={styles.presetLink}>LT-0914 (Rejected)</Text>
            </TouchableOpacity>
          </View>

          <Button
            title="Check Verification Status"
            onPress={handleVerify}
            variant="primary"
            size="md"
            loading={loading}
            fullWidth
            style={styles.submitBtn}
          />
        </View>

        {/* Result Display */}
        {searchResult && (
          <View style={styles.resultCard}>
            {searchResult.status === 'verified' && (
              <View style={styles.resultSuccess}>
                <View style={styles.resultHeader}>
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                  <Text style={styles.resultTitleSuccess}>Verified & Authentic Land Title</Text>
                </View>
                <Text style={styles.resultBody}>
                  Title Number: <Text style={styles.bold}>{searchResult.details.landTitleNumber}</Text>
                </Text>
                <Text style={styles.resultBody}>
                  Jurisdiction: {searchResult.details.division}, {searchResult.details.region} Region
                </Text>
                <Text style={styles.resultBody}>
                  Auditing Surveyor: {searchResult.details.surveyorName || 'Registered Cadastre Surveyor'}
                </Text>
                <View style={styles.auditConfirmedBadge}>
                  <Text style={styles.auditConfirmedText}>
                    ✓ Confirmed against Regional Cadastral Registry Archives
                  </Text>
                </View>
              </View>
            )}

            {searchResult.status === 'pending' && (
              <View style={styles.resultPending}>
                <View style={styles.resultHeader}>
                  <Ionicons name="time" size={24} color={COLORS.warning} />
                  <Text style={styles.resultTitlePending}>Under Review (Up to 48 Hours)</Text>
                </View>
                <Text style={styles.resultBody}>
                  Title Number: <Text style={styles.bold}>{searchResult.details.landTitleNumber}</Text>
                </Text>
                <Text style={styles.resultBody}>
                  This title is currently undergoing manual cadastral cross-examination. Estimated resolution within 48 hours.
                </Text>
              </View>
            )}

            {searchResult.status === 'rejected' && (
              <View style={styles.resultRejected}>
                <View style={styles.resultHeader}>
                  <Ionicons name="alert-circle" size={24} color={COLORS.error} />
                  <Text style={styles.resultTitleRejected}>Invalid / Verification Rejected</Text>
                </View>
                <Text style={styles.resultBody}>
                  Title Number: <Text style={styles.bold}>{searchResult.details.landTitleNumber}</Text>
                </Text>
                <Text style={styles.resultBody}>
                  Surveyor Notice: {searchResult.details.reason || 'Irregularity flagged during cadastral register lookup.'}
                </Text>
              </View>
            )}

            {searchResult.status === 'not_found' && (
              <View style={styles.resultNotFound}>
                <View style={styles.resultHeader}>
                  <Ionicons name="help-circle" size={24} color={COLORS.textSecondary} />
                  <Text style={styles.resultTitleNotFound}>Title Number Not Yet Audited</Text>
                </View>
                <Text style={styles.resultBody}>
                  The title number <Text style={styles.bold}>{searchResult.details.landTitleNumber}</Text> has not yet been submitted to TerraVerify for certified surveyor inspection.
                </Text>
                <Button
                  title="Submit For Verification"
                  onPress={() => router.push('/seller/submit')}
                  variant="outline"
                  size="sm"
                  style={{ marginTop: SPACING.md }}
                />
              </View>
            )}
          </View>
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
  introCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    ...SHADOWS.subtle,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  introTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  introDesc: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  slaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surfaceSecondary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  slaText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.primary,
    fontSize: 11,
  },
  inputCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    ...SHADOWS.subtle,
  },
  inputLabel: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
    marginBottom: SPACING.sm,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  textInput: {
    flex: 1,
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  presetsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: SPACING.lg,
  },
  presetsLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  presetLink: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.secondary,
  },
  presetDivider: {
    color: COLORS.textMuted,
  },
  submitBtn: {
    marginTop: SPACING.xs,
  },
  resultCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  resultSuccess: {
    gap: 4,
  },
  resultPending: {
    gap: 4,
  },
  resultRejected: {
    gap: 4,
  },
  resultNotFound: {
    gap: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.sm,
  },
  resultTitleSuccess: {
    ...TYPOGRAPHY.h3,
    color: COLORS.success,
  },
  resultTitlePending: {
    ...TYPOGRAPHY.h3,
    color: COLORS.warning,
  },
  resultTitleRejected: {
    ...TYPOGRAPHY.h3,
    color: COLORS.error,
  },
  resultTitleNotFound: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  resultBody: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  auditConfirmedBadge: {
    backgroundColor: COLORS.successLight,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
    marginTop: SPACING.sm,
  },
  auditConfirmedText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.success,
  },
});
