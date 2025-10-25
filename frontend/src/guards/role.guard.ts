import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStore } from '../store/auth.store';
import { NotificationStore } from '../store/notification.store';
import { UserRole } from '../models';
import { APP_ROUTES } from '../constants';

/**
 * Role Guard Factory
 * Creates a guard that checks if user has required role(s)
 */
export function roleGuard(allowedRoles: UserRole[]): CanActivateFn {
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

    // Check if user has required role
    if (authStore.hasAnyRole(allowedRoles)) {
      return true;
    }

    // User doesn't have required role
    notificationStore.error('You do not have permission to access this page');
    return router.createUrlTree([APP_ROUTES.HOME]);
  };
}

/**
 * Admin Guard
 * Only allows users with ADMIN role
 */
export const adminGuard: CanActivateFn = roleGuard([UserRole.ADMIN]);

/**
 * Organisation Admin Guard
 * Only allows users with ADMIN or ORG_ADMIN role
 */
export const orgAdminGuard: CanActivateFn = roleGuard([UserRole.ADMIN, UserRole.ORG_ADMIN]);

/**
 * Interviewer Guard
 * Only allows users with ADMIN, ORG_ADMIN, or INTERVIEWER role
 */
export const interviewerGuard: CanActivateFn = roleGuard([
  UserRole.ADMIN,
  UserRole.ORG_ADMIN,
  UserRole.INTERVIEWER,
]);

/**
 * Candidate Guard
 * Only allows users with CANDIDATE role
 */
export const candidateGuard: CanActivateFn = roleGuard([UserRole.CANDIDATE]);
