/**
 * Notification Type
 */
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

/**
 * In-App Notification Interface
 */
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

/**
 * Notification Response (from API)
 */
export interface NotificationResponse extends Notification {}

/**
 * Toast Notification Interface (for UI)
 */
export interface ToastNotification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
  timestamp: Date;
}

/**
 * Unread Count Response
 */
export interface UnreadCountResponse {
  count: number;
}

/**
 * Mark Notifications Read DTO
 */
export interface MarkNotificationsReadDto {
  notificationIds: string[];
}
