import { Injectable, signal, computed } from '@angular/core';

/**
 * Notification type enumeration
 */
export enum NotificationType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO',
}

/**
 * Notification interface
 */
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
  timestamp: Date;
  read: boolean;
}

/**
 * Global Notification Store
 * Manages application-wide notifications using Angular Signals
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationStore {
  // Private writable signals
  private _notifications = signal<Notification[]>([]);
  private _unreadCount = signal<number>(0);

  // Public readonly signals
  readonly notifications = this._notifications.asReadonly();
  readonly unreadCount = this._unreadCount.asReadonly();

  // Computed signals
  readonly hasUnread = computed(() => this._unreadCount() > 0);
  readonly recentNotifications = computed(() => this._notifications().slice(0, 5));

  /**
   * Add a notification
   */
  add(type: NotificationType, message: string, title?: string, duration: number = 5000): string {
    const notification: Notification = {
      id: this.generateId(),
      type,
      message,
      title,
      duration,
      timestamp: new Date(),
      read: false,
    };

    this._notifications.update((notifications) => [notification, ...notifications]);
    this._unreadCount.update((count) => count + 1);

    // Auto-remove after duration if specified
    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification.id);
      }, duration);
    }

    return notification.id;
  }

  /**
   * Add success notification
   */
  success(message: string, title: string = 'Success'): string {
    return this.add(NotificationType.SUCCESS, message, title);
  }

  /**
   * Add error notification
   */
  error(message: string, title: string = 'Error'): string {
    return this.add(NotificationType.ERROR, message, title, 0); // No auto-dismiss
  }

  /**
   * Add warning notification
   */
  warning(message: string, title: string = 'Warning'): string {
    return this.add(NotificationType.WARNING, message, title);
  }

  /**
   * Add info notification
   */
  info(message: string, title: string = 'Info'): string {
    return this.add(NotificationType.INFO, message, title);
  }

  /**
   * Mark notification as read
   */
  markAsRead(id: string): void {
    this._notifications.update((notifications) =>
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    this._unreadCount.update((count) => Math.max(0, count - 1));
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    this._notifications.update((notifications) => notifications.map((n) => ({ ...n, read: true })));
    this._unreadCount.set(0);
  }

  /**
   * Remove notification
   */
  remove(id: string): void {
    const notification = this._notifications().find((n) => n.id === id);
    if (notification && !notification.read) {
      this._unreadCount.update((count) => Math.max(0, count - 1));
    }

    this._notifications.update((notifications) => notifications.filter((n) => n.id !== id));
  }

  /**
   * Clear all notifications
   */
  clear(): void {
    this._notifications.set([]);
    this._unreadCount.set(0);
  }

  /**
   * Clear read notifications
   */
  clearRead(): void {
    this._notifications.update((notifications) => notifications.filter((n) => !n.read));
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
