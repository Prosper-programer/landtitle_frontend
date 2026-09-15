// Welcome & Authentication Choice Screen
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../src/constants/theme';
import { Button } from '../../src/components/common/Button';
import { useAuth } from '../../src/store/AuthContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { switchDemoRole } = useAuth();

  const handleGuest = async () => {
    await switchDemoRole('visitor');
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Brand Header */}
      <View style={styles.topSection}>
        <View style={styles.logoBadge}>
          <Ionicons name="shield-checkmark" size={32} color="#FFFFFF" />
        </View>
        <Text style={styles.brandTitle}>TerraVerify</Text>
        <Text style={styles.tagline}>The trusted Cameroonian land marketplace.</Text>
      </View>

      {/* Hero Illustration / Realistic photo */}
      <View style={styles.centerSection}>
        <View style={styles.heroImageWrapper}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.trustBadge}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
            <Text style={styles.trustText}>48h Certified Cadastral Verification</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.bottomSection}>
        <Button
          title="Login to Account"
          onPress={() => router.push('/(auth)/login')}
          variant="primary"
          size="lg"
          fullWidth
          style={{ marginBottom: SPACING.md }}
        />

        <Button
          title="Create New Account"
          onPress={() => router.push('/(auth)/register')}
          variant="outline"
          size="lg"
          fullWidth
          style={{ marginBottom: SPACING.lg }}
        />

        <Button
          title="Continue as Guest (Limited)"
          onPress={handleGuest}
          variant="ghost"
          size="sm"
        />

        <Text style={styles.disclaimerText}>
          By continuing, you agree to our Terms of Service & Cadastral Verification Policy.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  topSection: {
    alignItems: 'center',
    paddingTop: SPACING.md,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  brandTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    marginBottom: 4,
  },
  tagline: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  centerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.lg,
  },
  heroImageWrapper: {
    width: '100%',
    height: 220,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.surfaceSecondary,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  trustBadge: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
  },
  trustText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.primary,
  },
  bottomSection: {
    alignItems: 'center',
    paddingBottom: SPACING.md,
  },
  disclaimerText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.md,
    lineHeight: 14,
  },
});
