import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Notification, NotificationType } from '../../models/notification.model';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { NotificationStore } from '../../stores/notification/notification.store';

/**
 * Notification Service
 *
 * Handles in-app notification functionality:
 * - Fetch notifications from API
 * - Mark notifications as read
 * - Delete notifications
 * - Show toast notifications
 *
 * Works with NotificationStore for toast messages.
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private http = inject(HttpClient);
  private notificationStore = inject(NotificationStore);

  // In-app notifications state
  private notifications = signal<Notification[]>([]);
  private isLoading = signal<boolean>(false);

  // Public readonly state
  readonly notifications$ = this.notifications.asReadonly();
  readonly isLoading$ = this.isLoading.asReadonly();

  // Computed state
  readonly unreadCount = computed(() => this.notifications().filter((n) => !n.read).length);

  readonly hasUnread = computed(() => this.unreadCount() > 0);

  /**
   * Fetch all notifications for current user
   */
  fetchNotifications(): Observable<Notification[]> {
    this.isLoading.set(true);
    return this.http.get<Notification[]>(API_ENDPOINTS.NOTIFICATIONS.BASE).pipe(
      tap((notifications) => {
        this.notifications.set(notifications);
        this.isLoading.set(false);
      })
    );
  }

  /**
   * Fetch unread notifications only
   */
  fetchUnreadNotifications(): Observable<Notification[]> {
    this.isLoading.set(true);
    return this.http
      .get<Notification[]>(API_ENDPOINTS.NOTIFICATIONS.MY, {
        params: { read: 'false' },
      })
      .pipe(
        tap((notifications) => {
          this.notifications.set(notifications);
          this.isLoading.set(false);
        })
      );
  }

  /**
   * Mark notification as read
   */
  markAsRead(id: string): Observable<void> {
    return this.http.put<void>(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id), {}).pipe(
      tap(() => {
        this.notifications.update((notifications) =>
          notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      })
    );
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Observable<void> {
    return this.http.put<void>(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ, {}).pipe(
      tap(() => {
        this.notifications.update((notifications) =>
          notifications.map((n) => ({ ...n, read: true }))
        );
      })
    );
  }

  /**
   * Delete notification
   */
  deleteNotification(id: string): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.NOTIFICATIONS.DELETE(id)).pipe(
      tap(() => {
        this.notifications.update((notifications) => notifications.filter((n) => n.id !== id));
      })
    );
  }

  /**
   * Clear all notifications (delete all for current user)
   */
  clearAll(): Observable<void> {
    // Note: Backend doesn't have a clear-all endpoint, so we'll just clear local state
    // In a real implementation, you might need to call DELETE on each notification
    this.notifications.set([]);
    return new Observable((observer) => {
      observer.next();
      observer.complete();
    });
  }

  /**
   * Add notification to local state (for real-time updates)
   */
  addNotification(notification: Notification): void {
    this.notifications.update((notifications) => [notification, ...notifications]);
  }

  // Toast notification convenience methods (delegate to NotificationStore)

  /**
   * Show success toast
   */
  showSuccess(message: string, duration?: number): void {
    this.notificationStore.success(message, duration);
  }

  /**
   * Show error toast
   */
  showError(message: string, duration?: number): void {
    this.notificationStore.error(message, duration);
  }

  /**
   * Show warning toast
   */
  showWarning(message: string, duration?: number): void {
    this.notificationStore.warning(message, duration);
  }

  /**
   * Show info toast
   */
  showInfo(message: string, duration?: number): void {
    this.notificationStore.info(message, duration);
  }
}
