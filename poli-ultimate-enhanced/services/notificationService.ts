// services/notificationService.ts
// ADVANCED NOTIFICATION SYSTEM

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp: number;
}

class NotificationService {
  private listeners: Array<(notification: Notification) => void> = [];
  private notifications: Notification[] = [];

  // Subscribe to notifications
  subscribe(callback: (notification: Notification) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  // Show notification
  show(
    type: NotificationType,
    title: string,
    message: string,
    duration: number = 5000,
    action?: { label: string; onClick: () => void }
  ): string {
    const notification: Notification = {
      id: Date.now().toString() + Math.random(),
      type,
      title,
      message,
      duration,
      action,
      timestamp: Date.now()
    };

    this.notifications.push(notification);
    this.listeners.forEach(listener => listener(notification));

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => this.remove(notification.id), duration);
    }

    return notification.id;
  }

  // Convenience methods
  success(title: string, message: string, duration?: number) {
    return this.show('success', title, message, duration);
  }

  error(title: string, message: string, duration?: number) {
    return this.show('error', title, message, duration);
  }

  warning(title: string, message: string, duration?: number) {
    return this.show('warning', title, message, duration);
  }

  info(title: string, message: string, duration?: number) {
    return this.show('info', title, message, duration);
  }

  // Remove notification
  remove(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  // Clear all
  clear() {
    this.notifications = [];
  }

  // Get all notifications
  getAll(): Notification[] {
    return [...this.notifications];
  }
}

export const notificationService = new NotificationService();
