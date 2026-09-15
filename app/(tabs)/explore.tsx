// Land Discovery & Multi-Filter Explorer Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../src/constants/theme';
import { useLand } from '../../src/store/LandContext';
import { PropertyCard } from '../../src/components/property/PropertyCard';
import { Button } from '../../src/components/common/Button';
import { EmptyState } from '../../src/components/common/EmptyState';
import { CAMEROON_REGIONS, LAND_TYPES } from '../../src/constants/cameroonData';

export default function ExploreScreen() {
  const router = useRouter();
  const { lands, filters, setFilters, savedLandIds, toggleSaveLand } = useLand();

  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || '');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Filter state
  const [selectedRegion, setSelectedRegion] = useState<string>(filters.region || 'all');
  const [selectedType, setSelectedType] = useState<string>(filters.landType || 'all');
  const [onlyVerified, setOnlyVerified] = useState<boolean>(filters.onlyVerified !== false);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(filters.maxPrice);
  const [minArea, setMinArea] = useState<number | undefined>(filters.minArea);

  const activeFiltersCount =
    (selectedRegion !== 'all' ? 1 : 0) +
    (selectedType !== 'all' ? 1 : 0) +
    (onlyVerified ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (minArea ? 1 : 0);

  const handleApplyFilters = () => {
    setFilters({
      searchQuery,
      region: selectedRegion === 'all' ? undefined : selectedRegion,
      landType: selectedType === 'all' ? undefined : selectedType,
      onlyVerified,
      maxPrice,
      minArea,
    });
    setFilterModalVisible(false);
  };

  const handleResetFilters = () => {
    setSelectedRegion('all');
    setSelectedType('all');
    setOnlyVerified(false);
    setMaxPrice(undefined);
    setMinArea(undefined);
    setSearchQuery('');
    setFilters({});
    setFilterModalVisible(false);
  };

  const handleSearchSubmit = () => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Search & Filter Bar */}
      <View style={styles.topBar}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search city, neighborhood or title..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchQuery(''); setFilters((p) => ({ ...p, searchQuery: undefined })); }}>
              <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.filterBtn, activeFiltersCount > 0 && styles.filterBtnActive]}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={activeFiltersCount > 0 ? '#FFFFFF' : COLORS.primary}
          />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Results Header */}
      <View style={styles.resultsInfoRow}>
        <Text style={styles.resultsCountText}>
          {lands.length} {lands.length === 1 ? 'plot' : 'plots'} available
        </Text>
        {activeFiltersCount > 0 && (
          <TouchableOpacity onPress={handleResetFilters}>
            <Text style={styles.clearAllText}>Clear filters</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Properties List */}
      <ScrollView
        contentContainerStyle={styles.scrollList}
        showsVerticalScrollIndicator={false}
      >
        {lands.length === 0 ? (
          <EmptyState
            icon="search-outline"
            title="No Matching Lands Found"
            description="Try adjusting your location or price criteria to find available properties."
            actionTitle="Reset All Filters"
            onAction={handleResetFilters}
          />
        ) : (
          lands.map((land) => (
            <PropertyCard
              key={land.id}
              land={land}
              onPress={() => router.push(`/property/${land.id}`)}
              isSaved={savedLandIds.includes(land.id)}
              onToggleSave={() => toggleSaveLand(land.id)}
            />
          ))
        )}
      </ScrollView>

      {/* Advanced Filter Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Land Listings</Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Verification Status Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Verification Status</Text>
              <TouchableOpacity
                style={[styles.checkboxRow, onlyVerified && styles.checkboxRowActive]}
                onPress={() => setOnlyVerified(!onlyVerified)}
              >
                <Ionicons
                  name={onlyVerified ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={onlyVerified ? COLORS.secondary : COLORS.textMuted}
                />
                <Text style={styles.checkboxLabel}>Show Verified Lands Only (Surveyor Audited)</Text>
              </TouchableOpacity>
            </View>

            {/* Region Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Cameroon Region</Text>
              <View style={styles.chipsWrap}>
                <TouchableOpacity
                  style={[styles.filterChip, selectedRegion === 'all' && styles.filterChipSelected]}
                  onPress={() => setSelectedRegion('all')}
                >
                  <Text style={[styles.filterChipText, selectedRegion === 'all' && styles.filterChipTextSelected]}>
                    All Regions
                  </Text>
                </TouchableOpacity>
                {CAMEROON_REGIONS.map((r) => (
                  <TouchableOpacity
                    key={r.id}
                    style={[styles.filterChip, selectedRegion === r.id && styles.filterChipSelected]}
                    onPress={() => setSelectedRegion(r.id)}
                  >
                    <Text style={[styles.filterChipText, selectedRegion === r.id && styles.filterChipTextSelected]}>
                      {r.name} ({r.capital})
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Land Usage Type */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Property Usage</Text>
              <View style={styles.chipsWrap}>
                <TouchableOpacity
                  style={[styles.filterChip, selectedType === 'all' && styles.filterChipSelected]}
                  onPress={() => setSelectedType('all')}
                >
                  <Text style={[styles.filterChipText, selectedType === 'all' && styles.filterChipTextSelected]}>
                    All Types
                  </Text>
                </TouchableOpacity>
                {LAND_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t.value}
                    style={[styles.filterChip, selectedType === t.value && styles.filterChipSelected]}
                    onPress={() => setSelectedType(t.value)}
                  >
                    <Text style={[styles.filterChipText, selectedType === t.value && styles.filterChipTextSelected]}>
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Cap Presets */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Maximum Price (FCFA)</Text>
              <View style={styles.chipsWrap}>
                {[20000000, 50000000, 100000000].map((cap) => (
                  <TouchableOpacity
                    key={cap}
                    style={[styles.filterChip, maxPrice === cap && styles.filterChipSelected]}
                    onPress={() => setMaxPrice(maxPrice === cap ? undefined : cap)}
                  >
                    <Text style={[styles.filterChipText, maxPrice === cap && styles.filterChipTextSelected]}>
                      ≤ {(cap / 1000000).toFixed(0)} Million FCFA
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Minimum Area Presets */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Minimum Surface Area</Text>
              <View style={styles.chipsWrap}>
                {[500, 1000, 2000].map((sqm) => (
                  <TouchableOpacity
                    key={sqm}
                    style={[styles.filterChip, minArea === sqm && styles.filterChipSelected]}
                    onPress={() => setMinArea(minArea === sqm ? undefined : sqm)}
                  >
                    <Text style={[styles.filterChipText, minArea === sqm && styles.filterChipTextSelected]}>
                      ≥ {sqm} m²
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Modal Footer */}
          <View style={styles.modalFooter}>
            <Button
              title="Reset"
              onPress={handleResetFilters}
              variant="outline"
              size="md"
              style={{ flex: 1 }}
            />
            <Button
              title="Apply Filters"
              onPress={handleApplyFilters}
              variant="primary"
              size="md"
              style={{ flex: 2 }}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: 54, // Clear demo switcher
    paddingBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    height: 44,
  },
  searchIcon: {
    marginRight: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.secondary,
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    ...TYPOGRAPHY.micro,
    color: '#FFFFFF',
    fontSize: 9,
  },
  resultsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  resultsCountText: {
    ...TYPOGRAPHY.captionMedium,
    color: COLORS.textSecondary,
  },
  clearAllText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.secondary,
  },
  scrollList: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    paddingTop: SPACING.xs,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  modalTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  filterSection: {
    marginBottom: SPACING.xl,
  },
  filterSectionTitle: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  checkboxRowActive: {
    backgroundColor: COLORS.secondaryLight,
    borderColor: COLORS.secondary,
  },
  checkboxLabel: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    flex: 1,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs + 2,
  },
  filterChip: {
    backgroundColor: COLORS.background,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    ...TYPOGRAPHY.captionMedium,
    color: COLORS.textSecondary,
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
});
