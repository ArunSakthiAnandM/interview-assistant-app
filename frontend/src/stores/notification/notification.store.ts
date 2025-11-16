import { Injectable, signal, computed } from '@angular/core';

/**
 * Toast Notification Type
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast Notification Interface
 */
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
  timestamp: Date;
}

/**
 * Toast Configuration
 */
export interface ToastConfig {
  type: ToastType;
  message: string;
  duration?: number; // in milliseconds, 0 = no auto-dismiss
}

/**
 * Notification Store
 *
 * Manages toast notifications state using signals.
 * Provides reactive state for toast messages displayed to users.
 *
 * Features:
 * - Add/remove toast notifications
 * - Auto-dismiss with configurable duration
 * - Multiple notification types (success, error, warning, info)
 * - Notification queue management
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationStore {
  // Private state
  private toasts = signal<Toast[]>([]);
  private maxToasts = signal<number>(5);

  // Public readonly state
  readonly toasts$ = this.toasts.asReadonly();
  readonly maxToasts$ = this.maxToasts.asReadonly();

  // Computed state
  readonly toastCount = computed(() => this.toasts().length);
  readonly hasToasts = computed(() => this.toasts().length > 0);

  /**
   * Show a toast notification
   */
  showToast(config: ToastConfig): string {
    const toast: Toast = {
      id: this.generateId(),
      type: config.type,
      message: config.message,
      duration: config.duration ?? 3000,
      timestamp: new Date(),
    };

    // Add new toast
    this.toasts.update((toasts) => {
      const newToasts = [...toasts, toast];
      // Keep only max number of toasts
      return newToasts.slice(-this.maxToasts());
    });

    // Auto-dismiss if duration > 0
    if (toast.duration > 0) {
      setTimeout(() => this.removeToast(toast.id), toast.duration);
    }

    return toast.id;
  }

  /**
   * Show success toast
   */
  success(message: string, duration?: number): string {
    return this.showToast({ type: 'success', message, duration });
  }

  /**
   * Show error toast
   */
  error(message: string, duration?: number): string {
    return this.showToast({ type: 'error', message, duration: duration ?? 5000 });
  }

  /**
   * Show warning toast
   */
  warning(message: string, duration?: number): string {
    return this.showToast({ type: 'warning', message, duration: duration ?? 4000 });
  }

  /**
   * Show info toast
   */
  info(message: string, duration?: number): string {
    return this.showToast({ type: 'info', message, duration });
  }

  /**
   * Remove a specific toast
   */
  removeToast(id: string): void {
    this.toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  /**
   * Clear all toasts
   */
  clearAll(): void {
    this.toasts.set([]);
  }

  /**
   * Set maximum number of toasts to display
   */
  setMaxToasts(max: number): void {
    this.maxToasts.set(max);
    // Trim existing toasts if needed
    this.toasts.update((toasts) => toasts.slice(-max));
  }

  /**
   * Generate unique ID for toast
   */
  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
