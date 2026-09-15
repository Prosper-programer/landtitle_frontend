// 5-Step Land Title Submission Wizard
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../src/constants/theme';
import { useLand } from '../../src/store/LandContext';
import { Header } from '../../src/components/common/Header';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { CAMEROON_REGIONS, LAND_TYPES, TOPOGRAPHY_TYPES, ACCESS_ROADS, formatFCFA, formatArea } from '../../src/constants/cameroonData';
import { LandDocument } from '../../src/types';

export default function SubmitLandScreen() {
  const router = useRouter();
  const { submitNewLand } = useLand();

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  // Form State
  // Step 1: Land Information
  const [landTitleNumber, setLandTitleNumber] = useState('');
  const [areaSqM, setAreaSqM] = useState('');
  const [region, setRegion] = useState('Centre');
  const [division, setDivision] = useState('Mfoundi');
  const [subdivision, setSubdivision] = useState('Yaoundé I');
  const [neighborhood, setNeighborhood] = useState('');
  const [description, setDescription] = useState('');
  const [landType, setLandType] = useState<any>('residential');
  const [topography, setTopography] = useState<any>('flat');
  const [accessRoad, setAccessRoad] = useState<any>('paved');

  // Step 2: Pricing
  const [priceFCFA, setPriceFCFA] = useState('');

  // Step 3: Documents
  const [documents, setDocuments] = useState<LandDocument[]>([
    {
      id: 'doc-tf-mock',
      name: 'Titre Foncier (Original Scan).pdf',
      type: 'titre_foncier',
      documentNumber: 'TF-2026-UPLOAD',
      fileUrl: 'https://terraverify.cm/docs/sample.pdf',
      fileSize: '3.8 MB',
      uploadedAt: new Date().toISOString(),
      isVerified: false,
    },
    {
      id: 'doc-pb-mock',
      name: 'Plan de Bornage Contradictoire.pdf',
      type: 'plan_bornage',
      documentNumber: 'PB-2026-UPLOAD',
      fileUrl: 'https://terraverify.cm/docs/sample_pb.pdf',
      fileSize: '2.4 MB',
      uploadedAt: new Date().toISOString(),
      isVerified: false,
    },
  ]);

  // Step 4: Photos
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=800&auto=format&fit=crop&q=80',
  ]);

  // Validation
  const validateStep1 = () => {
    if (!landTitleNumber.trim()) {
      Alert.alert('Required', 'Please enter the official Land Title Number.');
      return false;
    }
    if (!areaSqM.trim() || isNaN(Number(areaSqM)) || Number(areaSqM) <= 0) {
      Alert.alert('Required', 'Please enter a valid surface area in square meters (m²).');
      return false;
    }
    if (!neighborhood.trim()) {
      Alert.alert('Required', 'Please specify the neighborhood/quarter (e.g. Bastos, Bonapriso).');
      return false;
    }
    if (!description.trim() || description.length < 20) {
      Alert.alert('Required', 'Please provide a detailed property description (minimum 20 characters).');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!priceFCFA.trim() || isNaN(Number(priceFCFA)) || Number(priceFCFA) <= 0) {
      Alert.alert('Required', 'Please enter the asking sale price in FCFA.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await submitNewLand({
        title: `${areaSqM} m² Plot in ${neighborhood} (${landTitleNumber})`,
        landTitleNumber: landTitleNumber.trim().toUpperCase(),
        description: description.trim(),
        region,
        division,
        subdivision,
        neighborhood: neighborhood.trim(),
        areaSqM: Number(areaSqM),
        priceFCFA: Number(priceFCFA),
        landType,
        topography,
        accessRoad,
        images: photos,
        documents,
      });

      Alert.alert(
        'Submission Received',
        'Your land dossier has been submitted for manual cadastral inspection. Estimated verification time: up to 48 hours.',
        [
          {
            text: 'Track Verification Status',
            onPress: () => {
              router.replace({
                pathname: '/seller/listing-detail',
                params: { id: res.land.id },
              });
            },
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Submission Error', err.message || 'Could not submit land.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Submit a Land Title"
        subtitle={`Step ${step} of 5: ${
          step === 1
            ? 'Land Information'
            : step === 2
            ? 'Pricing'
            : step === 3
            ? 'Deed Documents'
            : step === 4
            ? 'Property Photos'
            : 'Review & Submit'
        }`}
        showBack
        onBack={handleBack}
      />

      {/* Step Indicator Bar */}
      <View style={styles.stepProgressRow}>
        {[1, 2, 3, 4, 5].map((s) => (
          <View
            key={s}
            style={[
              styles.stepProgressBar,
              s <= step && styles.stepProgressBarActive,
            ]}
          />
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* STEP 1: Land Information */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepHeading}>Step 1: Land Details & Location</Text>
            <Text style={styles.stepSub}>
              Enter administrative identification exactly as recorded in official deeds.
            </Text>

            <Input
              label="Official Land Title Number (Numéro du Titre Foncier) *"
              placeholder="e.g. LT-2026-YDE-0482"
              value={landTitleNumber}
              onChangeText={setLandTitleNumber}
              autoCapitalize="characters"
              leftIcon={<Ionicons name="document-text-outline" size={18} color={COLORS.textMuted} />}
            />

            <Input
              label="Surface Area (in m²) *"
              placeholder="e.g. 500 or 1200"
              value={areaSqM}
              onChangeText={setAreaSqM}
              keyboardType="numeric"
              leftIcon={<Ionicons name="resize-outline" size={18} color={COLORS.textMuted} />}
            />

            {/* Region Selector */}
            <Text style={styles.fieldLabel}>Cameroon Region *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
              {CAMEROON_REGIONS.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={[styles.chip, region === r.name && styles.chipActive]}
                  onPress={() => {
                    setRegion(r.name);
                    setDivision(r.divisions[0].name);
                    setSubdivision(r.divisions[0].subdivisions[0]);
                  }}
                >
                  <Text style={[styles.chipText, region === r.name && styles.chipTextActive]}>
                    {r.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Input
              label="Division & Subdivision"
              value={`${division}, ${subdivision}`}
              editable={false}
              containerStyle={{ marginTop: SPACING.md }}
            />

            <Input
              label="Neighborhood / Specific Landmark *"
              placeholder="e.g. Bastos, near Swiss Embassy"
              value={neighborhood}
              onChangeText={setNeighborhood}
              leftIcon={<Ionicons name="location-outline" size={18} color={COLORS.textMuted} />}
            />

            {/* Land Usage Type */}
            <Text style={styles.fieldLabel}>Land Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
              {LAND_TYPES.map((t) => (
                <TouchableOpacity
                  key={t.value}
                  style={[styles.chip, landType === t.value && styles.chipActive]}
                  onPress={() => setLandType(t.value)}
                >
                  <Text style={[styles.chipText, landType === t.value && styles.chipTextActive]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Input
              label="Full Description *"
              placeholder="Describe access roads, topography, neighborhood amenities, water/electricity connection..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              containerStyle={{ marginTop: SPACING.md }}
            />
          </View>
        )}

        {/* STEP 2: Pricing */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepHeading}>Step 2: Sale Pricing</Text>
            <Text style={styles.stepSub}>
              Specify your net asking price in Central African CFA Francs (FCFA).
            </Text>

            <Input
              label="Asking Sale Price (FCFA) *"
              placeholder="e.g. 25000000"
              value={priceFCFA}
              onChangeText={setPriceFCFA}
              keyboardType="numeric"
              leftIcon={<Ionicons name="cash-outline" size={18} color={COLORS.textMuted} />}
              helperText={
                priceFCFA && !isNaN(Number(priceFCFA))
                  ? `Formatted: ${formatFCFA(Number(priceFCFA))}`
                  : undefined
              }
            />

            <View style={styles.pricingGuidanceCard}>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.secondary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.guidanceTitle}>Market Pricing Transparency</Text>
                <Text style={styles.guidanceText}>
                  TerraVerify protects both parties. Buyers pay a small access fee to unlock your direct phone number and view verified deed copies.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* STEP 3: Documents */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepHeading}>Step 3: Official Deed Documents</Text>
            <Text style={styles.stepSub}>
              Attach clean digital PDF copies of your Titre Foncier and boundary survey plan for surveyor examination.
            </Text>

            <View style={styles.docsList}>
              {documents.map((doc, idx) => (
                <View key={idx} style={styles.uploadedDocCard}>
                  <Ionicons name="document-attach" size={24} color={COLORS.secondary} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.docName}>{doc.name}</Text>
                    <Text style={styles.docMeta}>{doc.fileSize} • Uploaded</Text>
                  </View>
                  <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.addDocBtn}
              onPress={() =>
                Alert.alert('Upload Document', 'In demo mode, official sample scans of Titre Foncier and Plan de Bornage are pre-attached.')
              }
            >
              <Ionicons name="cloud-upload-outline" size={20} color={COLORS.primary} />
              <Text style={styles.addDocText}>Add Additional Cadastral Extract</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 4: Photos */}
        {step === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepHeading}>Step 4: Property Photos</Text>
            <Text style={styles.stepSub}>
              High quality pictures of boundary pegs, surrounding road access, and terrain overview.
            </Text>

            <View style={styles.photosGrid}>
              {photos.map((p, idx) => (
                <View key={idx} style={styles.photoItem}>
                  <Image source={{ uri: p }} style={styles.photoImg} />
                  <View style={styles.photoTag}>
                    <Text style={styles.photoTagText}>Photo {idx + 1}</Text>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.addDocBtn}
              onPress={() =>
                Alert.alert('Attach Photo', 'In demo mode, verified property imagery is pre-attached.')
              }
            >
              <Ionicons name="camera-outline" size={20} color={COLORS.primary} />
              <Text style={styles.addDocText}>Upload Additional Plot Photo</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 5: Review & Submit */}
        {step === 5 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepHeading}>Step 5: Review & Confirm Submission</Text>
            <Text style={styles.stepSub}>
              Review your submission before dispatching to the certified surveyor queue.
            </Text>

            <View style={styles.reviewCard}>
              <Text style={styles.reviewSectionTitle}>Land Identification</Text>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Title Number:</Text>
                <Text style={styles.reviewValueBold}>{landTitleNumber}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Surface Area:</Text>
                <Text style={styles.reviewValue}>{formatArea(Number(areaSqM))}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Location:</Text>
                <Text style={styles.reviewValue}>{neighborhood}, {subdivision} ({region})</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Price:</Text>
                <Text style={styles.reviewValuePrice}>{formatFCFA(Number(priceFCFA))}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Deeds Attached:</Text>
                <Text style={styles.reviewValue}>{documents.length} PDF Documents</Text>
              </View>
            </View>

            {/* SLA Alert Box */}
            <View style={styles.slaCard}>
              <Ionicons name="shield-checkmark" size={22} color={COLORS.secondary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.slaCardTitle}>48-Hour Manual Cadastral Verification</Text>
                <Text style={styles.slaCardDesc}>
                  Your submission will be assigned to a licensed Cadastral Surveyor who manually inspects registry folios. You will receive an instant push notification upon approval or rejection.
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Row */}
      <SafeAreaView style={styles.footerRow}>
        <Button
          title={step === 1 ? 'Cancel' : 'Previous'}
          onPress={handleBack}
          variant="outline"
          size="md"
          style={styles.footerBtn}
        />

        {step < 5 ? (
          <Button
            title="Next Step"
            onPress={handleNext}
            variant="primary"
            size="md"
            style={styles.footerBtn}
            rightIcon={<Ionicons name="arrow-forward" size={16} color="#FFFFFF" />}
          />
        ) : (
          <Button
            title="Submit for Verification"
            onPress={handleSubmit}
            variant="primary"
            size="md"
            loading={loading}
            style={styles.footerBtn}
            leftIcon={<Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />}
          />
        )}
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  stepProgressRow: {
    flexDirection: 'row',
    height: 4,
    backgroundColor: COLORS.borderLight,
  },
  stepProgressBar: {
    flex: 1,
    backgroundColor: COLORS.border,
  },
  stepProgressBarActive: {
    backgroundColor: COLORS.secondary,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: 100,
  },
  stepContainer: {
    marginBottom: SPACING.xl,
  },
  stepHeading: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    marginBottom: 4,
  },
  stepSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 18,
  },
  fieldLabel: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  chipsScroll: {
    marginBottom: SPACING.sm,
  },
  chip: {
    backgroundColor: COLORS.background,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.xs,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    ...TYPOGRAPHY.captionMedium,
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  pricingGuidanceCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    backgroundColor: COLORS.secondaryLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.lg,
  },
  guidanceTitle: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.primary,
    marginBottom: 2,
  },
  guidanceText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  docsList: {
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  uploadedDocCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
  },
  docName: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  docMeta: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
  },
  addDocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.md,
  },
  addDocText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary,
  },
  photosGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  photoItem: {
    flex: 1,
    height: 120,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImg: {
    width: '100%',
    height: '100%',
  },
  photoTag: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: RADIUS.xs,
  },
  photoTagText: {
    ...TYPOGRAPHY.micro,
    color: '#FFFFFF',
    fontSize: 9,
  },
  reviewCard: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  reviewSectionTitle: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  reviewValue: {
    ...TYPOGRAPHY.captionMedium,
    color: COLORS.textPrimary,
  },
  reviewValueBold: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary,
  },
  reviewValuePrice: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.secondary,
  },
  slaCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    backgroundColor: COLORS.secondaryLight,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  slaCardTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary,
    marginBottom: 4,
  },
  slaCardDesc: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  footerRow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
    ...SHADOWS.lg,
  },
  footerBtn: {
    flex: 1,
  },
});
