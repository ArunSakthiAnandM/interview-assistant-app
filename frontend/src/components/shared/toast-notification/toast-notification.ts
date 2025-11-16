import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NotificationStore } from '../../../stores/notification/notification.store';

/**
 * Toast Notification Component
 *
 * Displays toast notifications in the top-right corner of the screen.
 * Supports multiple notification types: success, error, warning, info.
 * Auto-dismisses based on duration or manual close.
 *
 * Usage: Add to app.component.html
 * <app-toast-notification></app-toast-notification>
 */
@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './toast-notification.html',
  styleUrl: './toast-notification.scss',
})
export class ToastNotificationComponent {
  private notificationStore = inject(NotificationStore);

  // Expose toasts from store
  protected toasts = this.notificationStore.toasts$;

  /**
   * Close a toast notification
   */
  protected closeToast(id: string): void {
    this.notificationStore.removeToast(id);
  }

  /**
   * Get icon for toast type
   */
  protected getIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'notifications';
    }
  }
}
