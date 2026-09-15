// Notification Center Screen
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../src/constants/theme';
import { useNotifications } from '../../src/store/NotificationContext';
import { EmptyState } from '../../src/components/common/EmptyState';
import { AppNotification } from '../../src/types';

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, unreadCount, isLoading, refreshNotifications, markAsRead, markAllAsRead } =
    useNotifications();

  const getIconConfig = (type: AppNotification['type']) => {
    switch (type) {
      case 'verification_approved':
        return { name: 'shield-checkmark' as const, color: COLORS.success, bg: COLORS.successLight };
      case 'verification_rejected':
        return { name: 'alert-circle' as const, color: COLORS.error, bg: COLORS.errorLight };
      case 'verification_submitted':
        return { name: 'hourglass-outline' as const, color: COLORS.warning, bg: COLORS.warningLight };
      case 'payment_success':
        return { name: 'wallet-outline' as const, color: COLORS.secondary, bg: COLORS.secondaryLight };
      case 'appointment_confirmed':
        return { name: 'calendar-outline' as const, color: '#7C3AED', bg: '#F3E8FF' };
      case 'land_published':
        return { name: 'business-outline' as const, color: COLORS.primary, bg: COLORS.surfaceSecondary };
      default:
        return { name: 'notifications-outline' as const, color: COLORS.textSecondary, bg: COLORS.background };
    }
  };

  const handleNotificationPress = async (notif: AppNotification) => {
    await markAsRead(notif.id);

    if (notif.relatedEntityType === 'land' && notif.relatedEntityId) {
      router.push(`/property/${notif.relatedEntityId}`);
    } else if (notif.relatedEntityType === 'verification') {
      router.push('/seller/listing-detail');
    } else if (notif.relatedEntityType === 'appointment') {
      router.push('/(tabs)/advisors');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notification Center</Text>
          <Text style={styles.subtitle}>
            {unreadCount > 0 ? `${unreadCount} unread updates` : 'All updates are read'}
          </Text>
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllBtn} onPress={() => markAllAsRead()}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      <ScrollView
        contentContainerStyle={styles.scrollList}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshNotifications} />}
      >
        {notifications.length === 0 ? (
          <EmptyState
            icon="notifications-off-outline"
            title="No Notifications"
            description="You will receive real-time updates regarding your land verification requests, appointments, and payments here."
          />
        ) : (
          notifications.map((notif) => {
            const iconConfig = getIconConfig(notif.type);
            return (
              <TouchableOpacity
                key={notif.id}
                activeOpacity={0.8}
                style={[styles.itemCard, !notif.isRead && styles.itemUnread]}
                onPress={() => handleNotificationPress(notif)}
              >
                <View style={[styles.iconCircle, { backgroundColor: iconConfig.bg }]}>
                  <Ionicons name={iconConfig.name} size={20} color={iconConfig.color} />
                </View>

                <View style={styles.contentCol}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.itemTitle, !notif.isRead && styles.itemTitleUnread]}>
                      {notif.title}
                    </Text>
                    {!notif.isRead && <View style={styles.unreadDot} />}
                  </View>

                  <Text style={styles.itemMessage}>{notif.message}</Text>
                  <Text style={styles.itemTime}>
                    {new Date(notif.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: 54, // Clear demo switcher
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  markAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  markAllText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.secondary,
  },
  scrollList: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingBottom: SPACING.xxxl,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.subtle,
  },
  itemUnread: {
    backgroundColor: '#FFFFFF',
    borderColor: COLORS.secondary,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  contentCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  itemTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  itemTitleUnread: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
  },
  itemMessage: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  itemTime: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
  },
});
