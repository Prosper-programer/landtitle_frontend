// Document Viewer & Verification Seal Screen
import React, { useState } from 'react';
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
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../src/constants/theme';
import { Header } from '../../src/components/common/Header';
import { Button } from '../../src/components/common/Button';

export default function DocumentViewerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Mock document metadata based on ID
  const docTitle = id?.includes('0482')
    ? 'Titre Foncier N° 0482/Mfoundi.pdf'
    : id?.includes('pb')
    ? 'Plan de Bornage Géoréférencé.pdf'
    : 'Certificat de Propriété et Non-Litige.pdf';

  const docType = id?.includes('0482')
    ? 'Titre Foncier (Land Title Deed)'
    : id?.includes('pb')
    ? 'Plan de Bornage (Cadastral Boundary Plan)'
    : 'Certificat de Propriété (Ownership Attestation)';

  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    Alert.alert('Download Complete', `${docTitle} has been saved to your secure offline cache.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Document Inspection"
        subtitle="Certified Cadastral Dossier"
        showBack
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Document Header Card */}
        <View style={styles.docHeaderCard}>
          <View style={styles.docIconLarge}>
            <Ionicons name="document-text" size={40} color={COLORS.secondary} />
          </View>
          <Text style={styles.docHeading}>{docTitle}</Text>
          <Text style={styles.docTypeLabel}>{docType}</Text>

          <View style={styles.verifiedStamp}>
            <Ionicons name="shield-checkmark" size={16} color={COLORS.success} />
            <Text style={styles.verifiedStampText}>
              AUTHENTICATED BY CADASTRAL SURVEYOR
            </Text>
          </View>
        </View>

        {/* Document Digital Dossier Preview Box */}
        <View style={styles.previewContainer}>
          <View style={styles.previewHeaderBar}>
            <Text style={styles.previewHeaderTitle}>REPUBLIQUE DU CAMEROUN</Text>
            <Text style={styles.previewHeaderSub}>MINISTERE DES DOMAINES DU CADASTRE ET DES AFFAIRES FONCIERES</Text>
          </View>

          <View style={styles.deedBodyMock}>
            <Text style={styles.deedText}>
              Le Conservateur de la Propriété Foncière soussigné certifie que le présent titre d'immatriculation a été vérifié et enregistré au livre foncier du département du Mfoundi / Wouri, sous la désignation régulière des bornes et limites approuvées.
            </Text>

            <View style={styles.deedWatermark}>
              <Text style={styles.deedWatermarkText}>TERRAVERIFY CERTIFIED COPY</Text>
            </View>

            <View style={styles.deedSignatureRow}>
              <View>
                <Text style={styles.deedSigLabel}>Date de vérification:</Text>
                <Text style={styles.deedSigValue}>18 Février 2026</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.deedSigLabel}>Visa Géomètre-Expert:</Text>
                <Text style={styles.deedSigValue}>Ing. S. Ewane (OGEC)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Document Actions */}
        <View style={styles.actionButtons}>
          <Button
            title={downloaded ? "Document Saved" : "Download PDF Copy"}
            onPress={handleDownload}
            variant={downloaded ? "success" : "primary"}
            size="md"
            fullWidth
            leftIcon={<Ionicons name={downloaded ? "checkmark-circle" : "download-outline"} size={18} color="#FFFFFF" />}
            style={{ marginBottom: SPACING.md }}
          />

          <Button
            title="Return to Property Details"
            onPress={() => router.back()}
            variant="outline"
            size="md"
            fullWidth
          />
        </View>
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
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  docHeaderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    ...SHADOWS.subtle,
  },
  docIconLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  docHeading: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  docTypeLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  verifiedStamp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.successLight,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.round,
  },
  verifiedStampText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.success,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  previewContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    ...SHADOWS.sm,
  },
  previewHeaderBar: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  previewHeaderTitle: {
    ...TYPOGRAPHY.micro,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 1,
  },
  previewHeaderSub: {
    ...TYPOGRAPHY.micro,
    color: '#94A3B8',
    fontSize: 8,
    marginTop: 2,
    textAlign: 'center',
  },
  deedBodyMock: {
    padding: SPACING.xl,
    position: 'relative',
    backgroundColor: '#FAF9F6', // Parchment-like official tint
  },
  deedText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: SPACING.xl,
  },
  deedWatermark: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderWidth: 2,
    borderColor: 'rgba(5, 150, 105, 0.3)',
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.xl,
  },
  deedWatermarkText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.success,
    letterSpacing: 2,
  },
  deedSignatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  deedSigLabel: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
  },
  deedSigValue: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.primary,
    marginTop: 2,
  },
  actionButtons: {
    marginTop: SPACING.xs,
  },
});
