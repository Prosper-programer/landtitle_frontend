// Mobile Money Payment Screen (MTN MoMo & Orange Money)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../src/constants/theme';
import { useLand } from '../../src/store/LandContext';
import { useAuth } from '../../src/store/AuthContext';
import { paymentService } from '../../src/services/paymentService';
import { PaymentMethod, PaymentStatus, LandListing } from '../../src/types';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { formatFCFA } from '../../src/constants/cameroonData';

export default function PaymentScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getLandById, unlockLand } = useLand();
  const { currentUser } = useAuth();

  const [land, setLand] = useState<LandListing | null>(null);
  const [method, setMethod] = useState<PaymentMethod>('mtn_momo');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [status, setStatus] = useState<PaymentStatus>('pending');
  const [transactionRef, setTransactionRef] = useState<string>('');

  useEffect(() => {
    async function load() {
      if (id) {
        const found = await getLandById(id);
        setLand(found);
      }
    }
    load();
    // Default preset phone
    setPhoneNumber('677458921');
  }, [id, getLandById]);

  const handlePay = async () => {
    setPhoneError(undefined);
    const validation = paymentService.validateCameroonPhone(phoneNumber, method);
    if (!validation.isValid) {
      setPhoneError(validation.message);
      return;
    }

    if (!land) return;

    try {
      setStatus('processing');
      const tx = await paymentService.processUnlockPayment({
        userId: currentUser?.id || 'user-buyer-01',
        landId: land.id,
        landTitle: land.title,
        amountFCFA: land.unlockFeeFCFA,
        method,
        phoneNumber,
      });

      // Update local reactive store
      await unlockLand(land.id);
      setTransactionRef(tx.reference);
      setStatus('success');
    } catch (err: any) {
      setStatus('failed');
      Alert.alert('Payment Error', err.message || 'Transaction could not be completed.');
    }
  };

  const handleFinish = () => {
    if (land) {
      router.replace(`/property/${land.id}`);
    } else {
      router.back();
    }
  };

  if (!land) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.secondary} style={{ marginTop: 60 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Unlock Property Dossier</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {status === 'pending' && (
          <>
            {/* Property Summary Strip */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle} numberOfLines={1}>
                {land.title}
              </Text>
              <Text style={styles.summarySub}>
                Title Number: <Text style={{ fontWeight: '700' }}>{land.landTitleNumber}</Text> • {land.neighborhood}
              </Text>
              <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>Dossier Unlock Fee</Text>
                <Text style={styles.amountValue}>{formatFCFA(land.unlockFeeFCFA)}</Text>
              </View>
            </View>

            {/* Select Payment Method */}
            <Text style={styles.sectionTitle}>Choose Mobile Money Provider</Text>
            <View style={styles.methodRow}>
              {/* MTN Mobile Money */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.methodCard,
                  method === 'mtn_momo' && styles.methodCardMtnActive,
                ]}
                onPress={() => {
                  setMethod('mtn_momo');
                  setPhoneNumber('677458921');
                }}
              >
                <View style={[styles.providerLogoCircle, { backgroundColor: COLORS.mtnYellow }]}>
                  <Text style={styles.providerLogoTextMtn}>MTN</Text>
                </View>
                <Text style={styles.methodName}>MTN MoMo</Text>
                <Text style={styles.methodPrefix}>Prefixes: 67x, 68x, 650-654</Text>
                {method === 'mtn_momo' && (
                  <View style={styles.checkPill}>
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                  </View>
                )}
              </TouchableOpacity>

              {/* Orange Money */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.methodCard,
                  method === 'orange_money' && styles.methodCardOrangeActive,
                ]}
                onPress={() => {
                  setMethod('orange_money');
                  setPhoneNumber('699123456');
                }}
              >
                <View style={[styles.providerLogoCircle, { backgroundColor: COLORS.orangeMoney }]}>
                  <Text style={styles.providerLogoTextOrange}>OM</Text>
                </View>
                <Text style={styles.methodName}>Orange Money</Text>
                <Text style={styles.methodPrefix}>Prefixes: 69x, 655-659</Text>
                {method === 'orange_money' && (
                  <View style={styles.checkPill}>
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.orangeMoney} />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Phone Number Input */}
            <View style={styles.inputSection}>
              <Input
                label={`${method === 'mtn_momo' ? 'MTN MoMo' : 'Orange Money'} Account Phone Number`}
                placeholder="e.g. 677 45 89 21"
                value={phoneNumber}
                onChangeText={(t) => {
                  setPhoneNumber(t);
                  if (phoneError) setPhoneError(undefined);
                }}
                keyboardType="phone-pad"
                error={phoneError}
                helperText="A USSD prompt will appear on your phone to enter your Secret PIN."
                leftIcon={<Ionicons name="call-outline" size={18} color={COLORS.textMuted} />}
              />
            </View>

            {/* Guarantee Note */}
            <View style={styles.securityBox}>
              <Ionicons name="shield-checkmark" size={18} color={COLORS.success} />
              <Text style={styles.securityText}>
                Encrypted mobile money checkout. Unlocks permanent access to seller coordinates & certified deed scans for this account.
              </Text>
            </View>

            <Button
              title={`Pay ${formatFCFA(land.unlockFeeFCFA)}`}
              onPress={handlePay}
              variant="primary"
              size="lg"
              fullWidth
              style={styles.payBtn}
            />
          </>
        )}

        {/* PROCESSING STATE */}
        {status === 'processing' && (
          <View style={styles.statusStateContainer}>
            <View style={styles.spinnerCircle}>
              <ActivityIndicator size="large" color={COLORS.secondary} />
            </View>
            <Text style={styles.stateHeading}>Authorizing Payment...</Text>
            <Text style={styles.stateSubtitle}>
              Please check your phone ({phoneNumber}) and authorize the USSD push request by entering your PIN.
            </Text>
            <View style={styles.simulatingPill}>
              <Text style={styles.simulatingText}>Simulating Carrier Payment Gateway (MTN / Orange)</Text>
            </View>
          </View>
        )}

        {/* SUCCESS STATE */}
        {status === 'success' && (
          <View style={styles.statusStateContainer}>
            <View style={styles.successCircle}>
              <Ionicons name="checkmark" size={44} color="#FFFFFF" />
            </View>
            <Text style={styles.stateHeading}>Payment Successful!</Text>
            <Text style={styles.stateSubtitle}>
              Access granted. All seller contacts, GPS landmarks, and cadastral documents are now unlocked.
            </Text>

            <View style={styles.receiptBox}>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Transaction Reference</Text>
                <Text style={styles.receiptValue}>{transactionRef}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Amount Debited</Text>
                <Text style={styles.receiptValue}>{formatFCFA(land.unlockFeeFCFA)}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Provider</Text>
                <Text style={styles.receiptValue}>
                  {method === 'mtn_momo' ? 'MTN Cameroon MoMo' : 'Orange Money Cameroun'}
                </Text>
              </View>
            </View>

            <Button
              title="Access Unlocked Property Dossier"
              onPress={handleFinish}
              variant="success"
              size="lg"
              fullWidth
              leftIcon={<Ionicons name="lock-open" size={18} color="#FFFFFF" />}
            />
          </View>
        )}

        {/* FAILED STATE */}
        {status === 'failed' && (
          <View style={styles.statusStateContainer}>
            <View style={styles.failedCircle}>
              <Ionicons name="close" size={44} color="#FFFFFF" />
            </View>
            <Text style={styles.stateHeading}>Payment Unsuccessful</Text>
            <Text style={styles.stateSubtitle}>
              The transaction timed out or was declined on the mobile operator network. Please ensure your balance covers the fee and try again.
            </Text>

            <Button
              title="Try Again"
              onPress={() => setStatus('pending')}
              variant="primary"
              size="lg"
              fullWidth
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  summaryCard: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  summaryTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary,
    marginBottom: 2,
  },
  summarySub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  amountLabel: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
  },
  amountValue: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
  },
  sectionTitle: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  methodRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  methodCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    position: 'relative',
  },
  methodCardMtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFFDEB',
  },
  methodCardOrangeActive: {
    borderColor: COLORS.orangeMoney,
    backgroundColor: '#FFF7ED',
  },
  providerLogoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  providerLogoTextMtn: {
    fontWeight: '900',
    color: '#000000',
    fontSize: 13,
  },
  providerLogoTextOrange: {
    fontWeight: '900',
    color: '#FFFFFF',
    fontSize: 13,
  },
  methodName: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  methodPrefix: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    textAlign: 'center',
    fontSize: 9,
  },
  checkPill: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  inputSection: {
    marginBottom: SPACING.lg,
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: COLORS.successLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
    marginBottom: SPACING.xl,
  },
  securityText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textPrimary,
    lineHeight: 18,
    flex: 1,
  },
  payBtn: {
    marginBottom: SPACING.lg,
  },
  statusStateContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
  },
  spinnerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  failedCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  stateHeading: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  stateSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
    marginBottom: SPACING.xl,
  },
  simulatingPill: {
    backgroundColor: COLORS.background,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  simulatingText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
  },
  receiptBox: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.xxl,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  receiptValue: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.primary,
  },
});
