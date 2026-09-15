// Land Details Screen (Pre-payment Protected vs Post-payment Unlocked)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../src/constants/theme';
import { useLand } from '../../src/store/LandContext';
import { useAuth } from '../../src/store/AuthContext';
import { LandListing } from '../../src/types';
import { StatusBadge } from '../../src/components/common/StatusBadge';
import { LockedDetailsOverlay } from '../../src/components/property/LockedDetailsOverlay';
import { DocumentCard } from '../../src/components/property/DocumentCard';
import { formatFCFA, formatArea } from '../../src/constants/cameroonData';
import { Button } from '../../src/components/common/Button';

const { width } = Dimensions.get('window');

export default function PropertyDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getLandById, isLandUnlocked, savedLandIds, toggleSaveLand } = useLand();
  const { currentUser } = useAuth();

  const [land, setLand] = useState<LandListing | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      const found = await getLandById(id);
      setLand(found);
      if (found) {
        const isUnl = await isLandUnlocked(found.id);
        setUnlocked(isUnl);
      }
    }
    loadData();
  }, [id, isLandUnlocked]);

  if (!land) {
    return (
      <SafeAreaView style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Property not found</Text>
        <Button title="Back to Explore" onPress={() => router.back()} variant="primary" size="sm" />
      </SafeAreaView>
    );
  }

  const isSaved = savedLandIds.includes(land.id);
  const isSellerOwner = currentUser?.id === land.sellerId;
  const showFullDetails = unlocked || isSellerOwner;

  const handleCallSeller = () => {
    if (land.sellerContact?.phone) {
      Linking.openURL(`tel:${land.sellerContact.phone}`);
    }
  };

  const handleWhatsApp = () => {
    if (land.sellerContact?.phone) {
      const cleanPhone = land.sellerContact.phone.replace(/\D/g, '');
      const msg = `Hello, I saw your verified land listing (${land.landTitleNumber}) in ${land.neighborhood} on TerraVerify.`;
      Linking.openURL(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`);
    }
  };

  const handleOpenMaps = () => {
    if (land.exactLocation?.coordinates) {
      const { latitude, longitude } = land.exactLocation.coordinates;
      Linking.openURL(`https://maps.google.com/?q=${latitude},${longitude}`);
    } else {
      Alert.alert('Location Landmark', land.exactLocation?.landmarkDescription || land.neighborhood);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Gallery Image Carousel */}
        <View style={styles.galleryContainer}>
          <Image
            source={{ uri: land.images[activeImageIndex] || land.images[0] }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Top Floating Buttons */}
          <SafeAreaView style={styles.imageOverlayTop}>
            <TouchableOpacity
              style={styles.floatingRoundBtn}
              onPress={() => router.back()}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.floatingRoundBtn}
              onPress={() => toggleSaveLand(land.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={isSaved ? 'heart' : 'heart-outline'}
                size={20}
                color={isSaved ? COLORS.error : COLORS.primary}
              />
            </TouchableOpacity>
          </SafeAreaView>

          {/* Status Badge Tag */}
          <View style={styles.imageOverlayBadge}>
            <StatusBadge status={land.verificationStatus} size="md" />
          </View>
        </View>

        {/* Thumbnail Selector */}
        {land.images.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbsScroll}
            contentContainerStyle={styles.thumbsContent}
          >
            {land.images.map((img, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setActiveImageIndex(i)}
                style={[styles.thumbWrapper, activeImageIndex === i && styles.thumbWrapperActive]}
              >
                <Image source={{ uri: img }} style={styles.thumbImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Body Content */}
        <View style={styles.body}>
          {/* Location & Title */}
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={15} color={COLORS.secondary} />
            <Text style={styles.locationText}>
              {land.neighborhood}, {land.subdivision} • {land.region} Region
            </Text>
          </View>

          <Text style={styles.title}>{land.title}</Text>

          {/* Price & Asking info */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Verified Asking Price</Text>
            <Text style={styles.priceValue}>{formatFCFA(land.priceFCFA)}</Text>
          </View>

          {/* Key Specs Grid */}
          <View style={styles.specsGrid}>
            <View style={styles.specBox}>
              <Ionicons name="resize-outline" size={18} color={COLORS.secondary} />
              <Text style={styles.specBoxValue}>{formatArea(land.areaSqM)}</Text>
              <Text style={styles.specBoxLabel}>Surface Area</Text>
            </View>

            <View style={styles.specBox}>
              <Ionicons name="document-text-outline" size={18} color={COLORS.secondary} />
              <Text style={styles.specBoxValue}>{land.landTitleNumber}</Text>
              <Text style={styles.specBoxLabel}>Title Certificate</Text>
            </View>

            <View style={styles.specBox}>
              <Ionicons name="navigate-outline" size={18} color={COLORS.secondary} />
              <Text style={styles.specBoxValue}>{land.accessRoad.toUpperCase()}</Text>
              <Text style={styles.specBoxLabel}>Road Access</Text>
            </View>

            <View style={styles.specBox}>
              <Ionicons name="layers-outline" size={18} color={COLORS.secondary} />
              <Text style={styles.specBoxValue}>{land.topography.toUpperCase()}</Text>
              <Text style={styles.specBoxLabel}>Topography</Text>
            </View>
          </View>

          {/* Public Description */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Property Overview</Text>
            <Text style={styles.descriptionText}>{land.description}</Text>
          </View>

          {/* Cadastral Surveyor Audit Report */}
          {land.surveyorNotes && (
            <View style={styles.surveyorAuditBox}>
              <View style={styles.auditHeader}>
                <Ionicons name="shield-checkmark" size={18} color={COLORS.success} />
                <Text style={styles.auditTitle}>Cadastral Surveyor Verification Statement</Text>
              </View>
              <Text style={styles.auditText}>{land.surveyorNotes}</Text>
              <Text style={styles.auditSign}>
                Certified by Ing. Samuel Ewane (Order of Registered Surveyors of Cameroon)
              </Text>
            </View>
          )}

          {/* PROTECTED DETAILS OR UNLOCKED DETAILS */}
          {showFullDetails ? (
            /* UNLOCKED VIEW */
            <View style={styles.unlockedContainer}>
              <View style={styles.unlockedHeader}>
                <Ionicons name="lock-open" size={20} color={COLORS.success} />
                <Text style={styles.unlockedHeading}>Direct Seller & Dossier Unlocked</Text>
              </View>

              {/* Direct Seller Contact Card */}
              {land.sellerContact && (
                <View style={styles.contactCard}>
                  <Text style={styles.contactSub}>Registered Land Owner / Seller</Text>
                  <Text style={styles.contactName}>{land.sellerContact.name}</Text>
                  <Text style={styles.contactPhone}>{land.sellerContact.phone}</Text>

                  <View style={styles.contactActionRow}>
                    <TouchableOpacity style={styles.callBtn} onPress={handleCallSeller}>
                      <Ionicons name="call" size={16} color="#FFFFFF" />
                      <Text style={styles.callBtnText}>Call Directly</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp}>
                      <Ionicons name="logo-whatsapp" size={16} color="#FFFFFF" />
                      <Text style={styles.whatsappBtnText}>WhatsApp</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Exact Location & GPS Coordinates */}
              {land.exactLocation && (
                <View style={styles.locationCard}>
                  <Text style={styles.locationHeading}>Exact GPS Location & Street Landmark</Text>
                  <Text style={styles.locationAddress}>{land.exactLocation.streetAddress}</Text>
                  <Text style={styles.landmarkDesc}>{land.exactLocation.landmarkDescription}</Text>

                  <Button
                    title="Open in Google Maps"
                    onPress={handleOpenMaps}
                    variant="outline"
                    size="sm"
                    leftIcon={<Ionicons name="map-outline" size={16} color={COLORS.primary} />}
                    style={{ marginTop: SPACING.md }}
                  />
                </View>
              )}

              {/* Certified Documents List */}
              <View style={styles.documentsSection}>
                <Text style={styles.documentsHeading}>Official Title Dossier Scans</Text>
                {land.documents && land.documents.length > 0 ? (
                  land.documents.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      isLocked={false}
                      onPress={() => router.push(`/documents/${doc.id}`)}
                    />
                  ))
                ) : (
                  <Text style={styles.noDocsText}>No digital scans attached to this listing.</Text>
                )}
              </View>
            </View>
          ) : (
            /* PRE-PAYMENT LOCKED VIEW */
            <LockedDetailsOverlay
              unlockFeeFCFA={land.unlockFeeFCFA}
              onUnlockPress={() => router.push(`/payment/${land.id}`)}
            />
          )}
        </View>
      </ScrollView>

      {/* Bottom Bar for Unlocked / Buy actions */}
      <SafeAreaView style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomBarPriceLabel}>Price</Text>
          <Text style={styles.bottomBarPrice}>{formatFCFA(land.priceFCFA)}</Text>
        </View>

        {showFullDetails ? (
          <Button
            title="Contact Seller"
            onPress={handleCallSeller}
            variant="primary"
            size="md"
            leftIcon={<Ionicons name="call" size={16} color="#FFFFFF" />}
          />
        ) : (
          <Button
            title={`Unlock Details (${formatFCFA(land.unlockFeeFCFA)})`}
            onPress={() => router.push(`/payment/${land.id}`)}
            variant="secondary"
            size="md"
            leftIcon={<Ionicons name="lock-open-outline" size={16} color="#FFFFFF" />}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  notFoundText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  galleryContainer: {
    width: '100%',
    height: width * 0.75,
    position: 'relative',
    backgroundColor: COLORS.surfaceSecondary,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlayTop: {
    position: 'absolute',
    top: 50, // Below demo switcher
    left: SPACING.lg,
    right: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  floatingRoundBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
  },
  imageOverlayBadge: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
  },
  thumbsScroll: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.sm,
  },
  thumbsContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  thumbWrapper: {
    width: 60,
    height: 44,
    borderRadius: RADIUS.xs,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  thumbWrapperActive: {
    borderColor: COLORS.secondary,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  body: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  locationText: {
    ...TYPOGRAPHY.captionMedium,
    color: COLORS.secondary,
    marginLeft: 4,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  priceContainer: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
  },
  priceLabel: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
  },
  priceValue: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    marginTop: 2,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  specBox: {
    width: (width - SPACING.xl * 2 - SPACING.sm) / 2,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  specBoxValue: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
    marginTop: 4,
    marginBottom: 2,
  },
  specBoxLabel: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    fontSize: 10,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeading: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  descriptionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  surveyorAuditBox: {
    backgroundColor: COLORS.successLight,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
  },
  auditHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  auditTitle: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.success,
  },
  auditText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  auditSign: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  unlockedContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.successBorder,
    padding: SPACING.lg,
    marginVertical: SPACING.md,
  },
  unlockedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.md,
  },
  unlockedHeading: {
    ...TYPOGRAPHY.h3,
    color: COLORS.success,
  },
  contactCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  contactSub: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
  },
  contactName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
    marginTop: 2,
  },
  contactPhone: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.secondary,
    marginBottom: SPACING.md,
  },
  contactActionRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    gap: 6,
  },
  callBtnText: {
    ...TYPOGRAPHY.captionBold,
    color: '#FFFFFF',
  },
  whatsappBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    gap: 6,
  },
  whatsappBtnText: {
    ...TYPOGRAPHY.captionBold,
    color: '#FFFFFF',
  },
  locationCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  locationHeading: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.primary,
    marginBottom: 2,
  },
  locationAddress: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.secondary,
  },
  landmarkDesc: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  documentsSection: {
    marginTop: SPACING.sm,
  },
  documentsHeading: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  noDocsText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
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
  bottomBarPriceLabel: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
  },
  bottomBarPrice: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
  },
});
