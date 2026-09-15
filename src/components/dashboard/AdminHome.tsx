import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../store/AuthContext';
import { UserRole } from '../../types';

export const AdminHome: React.FC = () => {
  const router = useRouter();
  const { currentUser, allUsers, toggleUserStatus, refreshUsers, isLoading } = useAuth();
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

  const filteredUsers = allUsers.filter((u) => {
    if (roleFilter === 'all') return true;
    return u.role === roleFilter;
  });

  const handleToggle = (userId: string, currentStatus: string, name: string) => {
    const action = currentStatus === 'active' ? 'suspend' : 'activate';
    Alert.alert(
      `${action === 'suspend' ? 'Suspend' : 'Activate'} User`,
      `Are you sure you want to ${action} access for ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action === 'suspend' ? 'Suspend' : 'Activate',
          style: action === 'suspend' ? 'destructive' : 'default',
          onPress: async () => {
            try {
              await toggleUserStatus(userId);
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Action failed.');
            }
          },
        },
      ]
    );
  };

  const counts = {
    all: allUsers.length,
    buyer: allUsers.filter((u) => u.role === 'buyer').length,
    seller: allUsers.filter((u) => u.role === 'seller').length,
    surveyor: allUsers.filter((u) => u.role === 'surveyor').length,
    advisor: allUsers.filter((u) => u.role === 'advisor').length,
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshUsers} />}
    >
      {/* Top Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerRole}>SECURITY & SYSTEM ADMINISTRATION</Text>
          <Text style={styles.headerTitle}>Platform Governance</Text>
          <Text style={styles.headerSubtitle}>Logged in as {currentUser?.fullName || 'Henri Nkweti'}</Text>
        </View>
        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => router.push('/(tabs)/notifications')}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={22} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => router.push('/(tabs)/profile')}
            activeOpacity={0.8}
          >
            {currentUser?.avatarUrl ? (
              <Image source={{ uri: currentUser.avatarUrl }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarFallback}>
                <Ionicons name="person" size={18} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Platform Overview Statistics */}
      <View style={styles.overviewGrid}>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewNum}>{counts.all}</Text>
          <Text style={styles.overviewLabel}>Total Accounts</Text>
        </View>
        <View style={styles.overviewCard}>
          <Text style={[styles.overviewNum, { color: COLORS.info }]}>{counts.buyer}</Text>
          <Text style={styles.overviewLabel}>Buyers</Text>
        </View>
        <View style={styles.overviewCard}>
          <Text style={[styles.overviewNum, { color: COLORS.success }]}>{counts.seller}</Text>
          <Text style={styles.overviewLabel}>Sellers</Text>
        </View>
        <View style={styles.overviewCard}>
          <Text style={[styles.overviewNum, { color: COLORS.accent }]}>{counts.surveyor}</Text>
          <Text style={styles.overviewLabel}>Surveyors</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {[
            { id: 'all', label: `All (${counts.all})` },
            { id: 'buyer', label: `Buyers (${counts.buyer})` },
            { id: 'seller', label: `Sellers (${counts.seller})` },
            { id: 'surveyor', label: `Surveyors (${counts.surveyor})` },
            { id: 'advisor', label: `Advisors (${counts.advisor})` },
          ].map((tab) => {
            const isSelected = roleFilter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setRoleFilter(tab.id as any)}
              >
                <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Users Management List */}
      <View style={styles.userList}>
        {filteredUsers.map((user) => {
          const isSuspended = user.status === 'suspended';
          return (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userTop}>
                <View style={styles.avatarMini}>
                  <Text style={styles.avatarMiniText}>{user.fullName[0]}</Text>
                </View>
                <View style={styles.userInfoCol}>
                  <View style={styles.nameRow}>
                    <Text style={styles.userName}>{user.fullName}</Text>
                    <View
                      style={[
                        styles.roleBadge,
                        {
                          backgroundColor:
                            user.role === 'surveyor'
                              ? COLORS.warningLight
                              : user.role === 'advisor'
                              ? '#F3E8FF'
                              : user.role === 'seller'
                              ? COLORS.successLight
                              : COLORS.infoLight,
                        },
                      ]}
                    >
                      <Text style={styles.roleBadgeText}>{user.role.toUpperCase()}</Text>
                    </View>
                  </View>
                  <Text style={styles.userMeta}>{user.phone} • {user.email}</Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <View style={styles.statusIndicator}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: isSuspended ? COLORS.error : COLORS.success },
                    ]}
                  />
                  <Text style={[styles.statusText, { color: isSuspended ? COLORS.error : COLORS.success }]}>
                    {isSuspended ? 'Suspended' : 'Active Account'}
                  </Text>
                </View>

                {user.role !== 'admin' && (
                  <TouchableOpacity
                    style={[styles.toggleBtn, isSuspended ? styles.activateBtn : styles.deactivateBtn]}
                    onPress={() => handleToggle(user.id, user.status, user.fullName)}
                  >
                    <Ionicons
                      name={isSuspended ? 'checkmark-circle-outline' : 'ban-outline'}
                      size={14}
                      color={isSuspended ? COLORS.success : COLORS.error}
                    />
                    <Text
                      style={[
                        styles.toggleBtnText,
                        { color: isSuspended ? COLORS.success : COLORS.error },
                      ]}
                    >
                      {isSuspended ? 'Reactivate' : 'Suspend Access'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  headerRole: {
    ...TYPOGRAPHY.micro,
    color: COLORS.primary,
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 2,
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.subtle,
  },
  overviewNum: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    marginBottom: 2,
  },
  overviewLabel: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textSecondary,
    fontSize: 10,
    textAlign: 'center',
  },
  filterRow: {
    marginBottom: SPACING.md,
  },
  filterScroll: {
    gap: SPACING.xs + 2,
  },
  filterChip: {
    backgroundColor: COLORS.surface,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    ...TYPOGRAPHY.captionMedium,
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  userList: {
    gap: SPACING.md,
  },
  userCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    ...SHADOWS.subtle,
  },
  userTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarMiniText: {
    ...TYPOGRAPHY.bodyBold,
    color: '#FFFFFF',
  },
  userInfoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  userName: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  roleBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: RADIUS.xs,
  },
  roleBadgeText: {
    ...TYPOGRAPHY.micro,
    fontSize: 9,
    fontWeight: '700',
  },
  userMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.xs + 2,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    ...TYPOGRAPHY.captionMedium,
    fontSize: 12,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
  },
  activateBtn: {
    borderColor: COLORS.successBorder,
    backgroundColor: COLORS.successLight,
  },
  deactivateBtn: {
    borderColor: COLORS.errorBorder,
    backgroundColor: COLORS.errorLight,
  },
  toggleBtnText: {
    ...TYPOGRAPHY.micro,
    fontWeight: '700',
  },
});
