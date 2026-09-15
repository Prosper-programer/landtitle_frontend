// Notification center service
import { AppNotification } from '../types';
import { MOCK_NOTIFICATIONS } from '../data/mockData';
import { storageService } from './storageService';

const NOTIFICATIONS_KEY = 'terraverify_notifications';

export const notificationService = {
  async getNotifications(userId?: string): Promise<AppNotification[]> {
    const all = await storageService.getItem<AppNotification[]>(
      NOTIFICATIONS_KEY,
      MOCK_NOTIFICATIONS
    );
    if (!userId) return all;
    return all.filter((n) => n.userId === userId || n.userId === 'user-buyer-01' || n.userId === 'user-seller-01');
  },

  async markAsRead(notificationId: string): Promise<void> {
    const all = await this.getNotifications();
    const index = all.findIndex((n) => n.id === notificationId);
    if (index !== -1) {
      all[index].isRead = true;
      await storageService.setItem(NOTIFICATIONS_KEY, all);
    }
  },

  async markAllAsRead(userId?: string): Promise<void> {
    const all = await this.getNotifications();
    all.forEach((n) => {
      if (!userId || n.userId === userId) {
        n.isRead = true;
      }
    });
    await storageService.setItem(NOTIFICATIONS_KEY, all);
  },

  async createNotification(
    notification: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>
  ): Promise<AppNotification> {
    const all = await this.getNotifications();
    const newNotif: AppNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    all.unshift(newNotif);
    await storageService.setItem(NOTIFICATIONS_KEY, all);
    return newNotif;
  },

  async getUnreadCount(userId?: string): Promise<number> {
    const notifs = await this.getNotifications(userId);
    return notifs.filter((n) => !n.isRead).length;
  },
};
