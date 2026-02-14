// Advanced Notification System with smart alerts and reminders

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
export type NotificationCategory = 
  | 'achievement' 
  | 'reminder' 
  | 'update' 
  | 'social' 
  | 'system' 
  | 'news'
  | 'learning';

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  createdAt: string;
  readAt?: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
  icon?: string;
  color?: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  enabled: boolean;
  categories: Record<NotificationCategory, boolean>;
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string;
  };
  soundEnabled: boolean;
  desktopNotifications: boolean;
  emailDigest: 'none' | 'daily' | 'weekly';
}

class AdvancedNotificationService {
  private notifications: Map<string, Notification> = new Map();
  private preferences: NotificationPreferences;
  private STORAGE_KEY = 'poli_notifications';
  private PREFS_KEY = 'poli_notification_prefs';
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadNotifications();
    this.preferences = this.loadPreferences();
    this.cleanupExpired();
  }

  private loadNotifications(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.notifications = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }

  private saveNotifications(): void {
    try {
      const data = Object.fromEntries(this.notifications);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }

  private loadPreferences(): NotificationPreferences {
    try {
      const stored = localStorage.getItem(this.PREFS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }

    return {
      enabled: true,
      categories: {
        achievement: true,
        reminder: true,
        update: true,
        social: true,
        system: true,
        news: true,
        learning: true
      },
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      },
      soundEnabled: true,
      desktopNotifications: false,
      emailDigest: 'none'
    };
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(this.PREFS_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  private isQuietHours(): boolean {
    if (!this.preferences.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const { start, end } = this.preferences.quietHours;

    if (start < end) {
      return currentTime >= start && currentTime < end;
    } else {
      return currentTime >= start || currentTime < end;
    }
  }

  createNotification(
    title: string,
    message: string,
    category: NotificationCategory,
    priority: NotificationPriority = 'medium',
    options?: {
      actionUrl?: string;
      actionLabel?: string;
      icon?: string;
      color?: string;
      expiresInHours?: number;
      metadata?: Record<string, any>;
    }
  ): Notification | null {
    // Check if notifications are enabled for this category
    if (!this.preferences.enabled || !this.preferences.categories[category]) {
      return null;
    }

    // Check quiet hours (except for urgent notifications)
    if (priority !== 'urgent' && this.isQuietHours()) {
      return null;
    }

    const notification: Notification = {
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      title,
      message,
      category,
      priority,
      createdAt: new Date().toISOString(),
      isRead: false,
      ...options
    };

    if (options?.expiresInHours) {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + options.expiresInHours);
      notification.expiresAt = expiresAt.toISOString();
    }

    this.notifications.set(notification.id, notification);
    this.saveNotifications();

    // Play sound if enabled
    if (this.preferences.soundEnabled) {
      this.playNotificationSound(priority);
    }

    // Show desktop notification if enabled
    if (this.preferences.desktopNotifications) {
      this.showDesktopNotification(notification);
    }

    return notification;
  }

  private playNotificationSound(priority: NotificationPriority): void {
    // Different sounds for different priorities
    const frequencies: Record<NotificationPriority, number> = {
      low: 400,
      medium: 600,
      high: 800,
      urgent: 1000
    };

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequencies[priority];
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Failed to play notification sound:', error);
    }
  }

  private async showDesktopNotification(notification: Notification): Promise<void> {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: notification.icon || '/logo.png',
        tag: notification.id
      });
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: notification.icon || '/logo.png',
          tag: notification.id
        });
      }
    }
  }

  markAsRead(id: string): void {
    const notification = this.notifications.get(id);
    if (notification && !notification.isRead) {
      notification.isRead = true;
      notification.readAt = new Date().toISOString();
      this.saveNotifications();
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      if (!notification.isRead) {
        notification.isRead = true;
        notification.readAt = new Date().toISOString();
      }
    });
    this.saveNotifications();
  }

  deleteNotification(id: string): void {
    this.notifications.delete(id);
    this.saveNotifications();
  }

  clearAll(): void {
    this.notifications.clear();
    this.saveNotifications();
  }

  clearRead(): void {
    const unread = Array.from(this.notifications.values()).filter(n => !n.isRead);
    this.notifications.clear();
    unread.forEach(n => this.notifications.set(n.id, n));
    this.saveNotifications();
  }

  getAll(): Notification[] {
    return Array.from(this.notifications.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getUnread(): Notification[] {
    return this.getAll().filter(n => !n.isRead);
  }

  getByCategory(category: NotificationCategory): Notification[] {
    return this.getAll().filter(n => n.category === category);
  }

  getByPriority(priority: NotificationPriority): Notification[] {
    return this.getAll().filter(n => n.priority === priority);
  }

  getUnreadCount(): number {
    return this.getUnread().length;
  }

  private cleanupExpired(): void {
    const now = new Date();
    let hasDeleted = false;

    this.notifications.forEach((notification, id) => {
      if (notification.expiresAt && new Date(notification.expiresAt) < now) {
        this.notifications.delete(id);
        hasDeleted = true;
      }
    });

    if (hasDeleted) {
      this.saveNotifications();
    }
  }

  updatePreferences(prefs: Partial<NotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...prefs };
    this.savePreferences();
  }

  getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback());
  }

  // Smart notification suggestions
  suggestLearningReminder(): void {
    const lastRead = localStorage.getItem('poli_last_read_date');
    const today = new Date().toDateString();

    if (lastRead !== today) {
      this.createNotification(
        'Continue Your Learning',
        'You haven\'t read anything today. Explore new articles to maintain your streak!',
        'learning',
        'medium',
        {
          actionUrl: '/learn',
          actionLabel: 'Start Learning',
          icon: '📚',
          color: '#4F46E5',
          expiresInHours: 24
        }
      );
    }
  }

  notifyAchievement(achievement: string): void {
    this.createNotification(
      'Achievement Unlocked! 🎉',
      achievement,
      'achievement',
      'high',
      {
        icon: '🏆',
        color: '#F59E0B',
        expiresInHours: 72
      }
    );
  }

  notifyMilestone(milestone: string, details: string): void {
    this.createNotification(
      `Milestone: ${milestone}`,
      details,
      'achievement',
      'high',
      {
        icon: '⭐',
        color: '#10B981',
        expiresInHours: 168
      }
    );
  }
}

export const notificationService = new AdvancedNotificationService();
