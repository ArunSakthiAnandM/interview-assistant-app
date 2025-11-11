import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStore } from '../store/auth.store';
import { NotificationStore } from '../store/notification.store';
import { APP_ROUTES } from '../constants';

/**
 * Permission Guard Factory
 * Creates a guard that checks if user has required permission(s)
 */
export function permissionGuard(requiredPermission: string): CanActivateFn {
  return (route, state) => {
    const authStore = inject(AuthStore);
    const router = inject(Router);
    const notificationStore = inject(NotificationStore);

    // Check if user is authenticated
    if (!authStore.isAuthenticated()) {
      notificationStore.warning('Please login to access this page');
      return router.createUrlTree([APP_ROUTES.LOGIN], {
        queryParams: { returnUrl: state.url },
      });
    }

    // Check if user has required permission
    if (authStore.hasPermission(requiredPermission)) {
      return true;
    }

    // User doesn't have required permission
    notificationStore.error('You do not have permission to access this resource');
    return router.createUrlTree([APP_ROUTES.HOME]);
  };
}

/**
 * Predefined permission guards
 */
export const manageRecruitersGuard: CanActivateFn = permissionGuard('manage:recruiters');
export const manageInterviewsGuard: CanActivateFn = permissionGuard('manage:interviews');
export const viewCandidatesGuard: CanActivateFn = permissionGuard('view:candidates');
export const manageUsersGuard: CanActivateFn = permissionGuard('manage:users');
export const verifyRecruitersGuard: CanActivateFn = permissionGuard('verify:recruiters');
export const viewAnalyticsGuard: CanActivateFn = permissionGuard('view:analytics');
