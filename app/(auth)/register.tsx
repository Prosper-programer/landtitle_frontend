// Registration Screen with Role Selection Dropdown (No OTP)
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../src/constants/theme';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { useAuth } from '../../src/store/AuthContext';
import { UserRole } from '../../src/types';

interface RoleOption {
  role: UserRole;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  badgeColor: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'buyer',
    title: 'Buyer / Investor',
    subtitle: 'Browse & buy verified plots, unlock seller contacts & deed docs',
    icon: 'cart-outline',
    badgeColor: COLORS.info,
  },
  {
    role: 'seller',
    title: 'Land Owner / Seller',
    subtitle: 'Submit title deeds for 48h surveyor verification & list for sale',
    icon: 'business-outline',
    badgeColor: COLORS.success,
  },
  {
    role: 'surveyor',
    title: 'Certified Land Surveyor',
    subtitle: 'Review deed scans & perform official cadastral ledger audits',
    icon: 'compass-outline',
    badgeColor: COLORS.accent,
  },
  {
    role: 'advisor',
    title: 'Professional Titling Advisor',
    subtitle: 'Provide legal guidance on Cameroon land ordinances & consultations',
    icon: 'shield-outline',
    badgeColor: '#7C3AED',
  },
];

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const activeRoleConfig = ROLE_OPTIONS.find((r) => r.role === selectedRole) || ROLE_OPTIONS[0];

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!fullName.trim() || fullName.trim().split(' ').length < 2) {
      errs.fullName = 'Please enter your full legal name (First & Last name).';
    }
    if (!email.trim() || !email.includes('@')) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 9) {
      errs.phone = 'Please enter a valid 9-digit Cameroonian phone number.';
    }
    if (!password || password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        role: selectedRole,
      });

      Alert.alert(
        'Account Created Successfully',
        `Welcome to TerraVerify! Your account has been activated as ${activeRoleConfig.title}.`,
        [
          {
            text: 'Enter Platform',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message || 'Could not complete registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <View style={styles.titleSection}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join Cameroon's verified land marketplace and titling network.
            </Text>
          </View>

          {/* Role Selection Dropdown */}
          <View style={styles.dropdownSection}>
            <Text style={styles.fieldLabel}>Select Your Account Role *</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.dropdownSelector}
              onPress={() => setIsDropdownOpen(true)}
            >
              <View style={[styles.roleIconCircle, { backgroundColor: `${activeRoleConfig.badgeColor}18` }]}>
                <Ionicons name={activeRoleConfig.icon} size={20} color={activeRoleConfig.badgeColor} />
              </View>

              <View style={styles.dropdownTextCol}>
                <Text style={styles.dropdownRoleTitle}>{activeRoleConfig.title}</Text>
                <Text style={styles.dropdownRoleSubtitle} numberOfLines={1}>
                  {activeRoleConfig.subtitle}
                </Text>
              </View>

              <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            <Input
              label="Full Legal Name *"
              placeholder="e.g. Prosper Kamga"
              value={fullName}
              onChangeText={(t) => {
                setFullName(t);
                if (errors.fullName) setErrors({ ...errors, fullName: '' });
              }}
              error={errors.fullName}
              leftIcon={<Ionicons name="person-outline" size={20} color={COLORS.textMuted} />}
            />

            <Input
              label="Email Address *"
              placeholder="e.g. prosper@gmail.com"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              error={errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
              leftIcon={<Ionicons name="mail-outline" size={20} color={COLORS.textMuted} />}
            />

            <Input
              label="Cameroonian Phone Number *"
              placeholder="e.g. 677 45 89 21"
              value={phone}
              onChangeText={(t) => {
                setPhone(t);
                if (errors.phone) setErrors({ ...errors, phone: '' });
              }}
              error={errors.phone}
              keyboardType="phone-pad"
              helperText="Active mobile number for transactions and notifications."
              leftIcon={<Ionicons name="call-outline" size={20} color={COLORS.textMuted} />}
            />

            <Input
              label="Password *"
              placeholder="Minimum 6 characters"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              error={errors.password}
              isPassword
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />}
            />

            <Input
              label="Confirm Password *"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChangeText={(t) => {
                setConfirmPassword(t);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
              }}
              error={errors.confirmPassword}
              isPassword
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />}
            />

            <Button
              title="Create Account"
              onPress={handleRegister}
              variant="primary"
              size="lg"
              loading={loading}
              fullWidth
              style={styles.submitBtn}
            />

            <View style={styles.loginPromptRow}>
              <Text style={styles.promptText}>Already registered? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Role Picker Modal Dropdown */}
      <Modal
        visible={isDropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setIsDropdownOpen(false)}
          />

          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Choose Account Role</Text>
                <Text style={styles.modalSubtitle}>
                  Select how you will participate in the platform
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsDropdownOpen(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close-circle" size={26} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.rolesList}>
              {ROLE_OPTIONS.map((item) => {
                const isSelected = item.role === selectedRole;
                return (
                  <TouchableOpacity
                    key={item.role}
                    activeOpacity={0.7}
                    style={[styles.roleOptionCard, isSelected && styles.roleOptionCardSelected]}
                    onPress={() => {
                      setSelectedRole(item.role);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <View style={[styles.optionIconCircle, { backgroundColor: `${item.badgeColor}18` }]}>
                      <Ionicons name={item.icon} size={22} color={item.badgeColor} />
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={styles.optionTitleRow}>
                        <Text style={[styles.optionTitle, isSelected && { color: COLORS.primary, fontWeight: '700' }]}>
                          {item.title}
                        </Text>
                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={18} color={COLORS.secondary} />
                        )}
                      </View>
                      <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  backBtn: {
    marginBottom: SPACING.lg,
    alignSelf: 'flex-start',
  },
  titleSection: {
    marginBottom: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.hero,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  fieldLabel: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs + 2,
  },
  dropdownSection: {
    marginBottom: SPACING.lg,
  },
  dropdownSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  roleIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownTextCol: {
    flex: 1,
  },
  dropdownRoleTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary,
  },
  dropdownRoleSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  form: {
    marginBottom: SPACING.xl,
  },
  submitBtn: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  loginPromptRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  promptText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  loginLink: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.secondary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: COLORS.overlay,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  modalTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
  },
  modalSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  rolesList: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  roleOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: SPACING.md,
  },
  roleOptionCardSelected: {
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.secondaryLight,
  },
  optionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  optionSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
});
