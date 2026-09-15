// User Profile & Account Management Screen
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../src/constants/theme';
import { useAuth } from '../../src/store/AuthContext';
import { useLand } from '../../src/store/LandContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, role, logout } = useAuth();
  const { savedLandIds, sellerListings } = useLand();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of TerraVerify?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Profile Summary */}
      <View style={styles.profileHeaderCard}>
        <View style={styles.avatarContainer}>
          {currentUser?.avatarUrl ? (
            <Image source={{ uri: currentUser.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Ionicons name="person" size={36} color="#FFFFFF" />
            </View>
          )}
          <View style={styles.roleTag}>
            <Text style={styles.roleTagText}>{(currentUser?.role || 'visitor').toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.userName}>{currentUser?.fullName || 'Guest Visitor'}</Text>
        <Text style={styles.userEmail}>{currentUser?.email || 'Not currently signed in'}</Text>
        {currentUser?.phone && <Text style={styles.userPhone}>{currentUser.phone}</Text>}

        {currentUser ? (
          <View style={styles.verifiedIdentityRow}>
            <Ionicons name="shield-checkmark" size={14} color={COLORS.success} />
            <Text style={styles.verifiedIdentityText}>Phone Verified Citizen Account</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.verifiedIdentityRow, { backgroundColor: COLORS.secondaryLight }]}
            onPress={() => router.push('/(auth)/welcome')}
          >
            <Ionicons name="log-in-outline" size={14} color={COLORS.secondary} />
            <Text style={[styles.verifiedIdentityText, { color: COLORS.secondary }]}>
              Sign In or Create Account
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Role-Specific Quick Stats */}
      {role === 'buyer' && (
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => router.push('/(tabs)/explore')}
          >
            <Text style={styles.statNumber}>{savedLandIds.length}</Text>
            <Text style={styles.statLabel}>Saved Plots</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => router.push('/(tabs)/advisors')}
          >
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Active Consultation</Text>
          </TouchableOpacity>
        </View>
      )}

      {role === 'seller' && (
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{sellerListings.length}</Text>
            <Text style={styles.statLabel}>Listed Dossiers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: COLORS.success }]}>
              {sellerListings.filter((l) => l.verificationStatus === 'verified').length}
            </Text>
            <Text style={styles.statLabel}>Certified for Sale</Text>
          </View>
        </View>
      )}

      {/* Account Settings Menu */}
      <View style={styles.menuSection}>
        <Text style={styles.menuSectionTitle}>Account & Services</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/property/verify-title')}
        >
          <View style={[styles.menuIconCircle, { backgroundColor: COLORS.secondaryLight }]}>
            <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.secondary} />
          </View>
          <Text style={styles.menuTitle}>Verify Land Title Number</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/(tabs)/advisors')}
        >
          <View style={[styles.menuIconCircle, { backgroundColor: '#F3E8FF' }]}>
            <Ionicons name="people-outline" size={18} color="#7C3AED" />
          </View>
          <Text style={styles.menuTitle}>Advisors & Titling Consultations</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/(tabs)/notifications')}
        >
          <View style={[styles.menuIconCircle, { backgroundColor: COLORS.warningLight }]}>
            <Ionicons name="notifications-outline" size={18} color={COLORS.warning} />
          </View>
          <Text style={styles.menuTitle}>Notification Settings</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Security & Verification Section */}
      <View style={styles.menuSection}>
        <Text style={styles.menuSectionTitle}>Security & Cadastre Policy</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            Alert.alert(
              'Cadastral Verification Disclaimer',
              'TerraVerify works with licensed surveyors who perform manual cross-checks against official cadastral archives. Estimated turnaround time is 48 hours.'
            )
          }
        >
          <View style={[styles.menuIconCircle, { backgroundColor: COLORS.surfaceSecondary }]}>
            <Ionicons name="document-text-outline" size={18} color={COLORS.textPrimary} />
          </View>
          <Text style={styles.menuTitle}>48-Hour Verification Protocol</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            Alert.alert(
              'Security & Payment Gateway',
              'MTN Mobile Money and Orange Money API abstraction layers provide encrypted transactions with full receipt archiving.'
            )
          }
        >
          <View style={[styles.menuIconCircle, { backgroundColor: COLORS.surfaceSecondary }]}>
            <Ionicons name="lock-closed-outline" size={18} color={COLORS.textPrimary} />
          </View>
          <Text style={styles.menuTitle}>Payment & Data Protection</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Sign Out or Sign In Button */}
      {currentUser ? (
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Sign Out of TerraVerify</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: COLORS.secondaryLight, borderColor: COLORS.secondary }]}
          onPress={() => router.push('/(auth)/login')}
        >
          <Ionicons name="log-in-outline" size={20} color={COLORS.secondary} />
          <Text style={[styles.logoutText, { color: COLORS.secondary }]}>Sign In to an Account</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.versionText}>
        TerraVerify Cameroon v1.0.0 • Academic Defense Build
      </Text>
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
  profileHeaderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    ...SHADOWS.subtle,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surfaceSecondary,
  },
  avatarFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackText: {
    ...TYPOGRAPHY.h1,
    color: '#FFFFFF',
  },
  roleTag: {
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: RADIUS.round,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  roleTagText: {
    ...TYPOGRAPHY.micro,
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  userName: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    marginBottom: 2,
  },
  userEmail: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  userPhone: {
    ...TYPOGRAPHY.captionMedium,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  verifiedIdentityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.successLight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.round,
    marginTop: SPACING.md,
  },
  verifiedIdentityText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.success,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.subtle,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
  },
  statLabel: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
  },
  menuSection: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.lg,
    ...SHADOWS.subtle,
  },
  menuSectionTitle: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    letterSpacing: 0.8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  menuTitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    flex: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.errorLight,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
    marginBottom: SPACING.lg,
  },
  logoutText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.error,
  },
  versionText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
});
