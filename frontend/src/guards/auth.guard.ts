import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStore } from '../store/auth.store';
import { NotificationStore } from '../store/notification.store';
import { APP_ROUTES } from '../constants';

/**
 * Authentication Guard
 * Prevents access to routes if user is not authenticated
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const notificationStore = inject(NotificationStore);

  if (authStore.isAuthenticated()) {
    return true;
  }

  // Store the attempted URL for redirecting after login
  const returnUrl = state.url;
  notificationStore.warning('Please login to access this page');

  return router.createUrlTree([APP_ROUTES.LOGIN], {
    queryParams: { returnUrl },
  });
};

/**
 * Guest Guard
 * Prevents authenticated users from accessing guest-only routes (login, register)
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.isAuthenticated()) {
    return true;
  }

  // Redirect to appropriate dashboard based on role
  const role = authStore.userRole();
  if (role) {
    switch (role) {
      case 'ADMIN':
        return router.createUrlTree([APP_ROUTES.DASHBOARD.ADMIN]);
      case 'RECRUITER':
        return router.createUrlTree([APP_ROUTES.DASHBOARD.RECRUITER]);
      case 'INTERVIEWER':
        return router.createUrlTree([APP_ROUTES.DASHBOARD.INTERVIEWER]);
      case 'CANDIDATE':
        return router.createUrlTree([APP_ROUTES.DASHBOARD.CANDIDATE]);
      default:
        return router.createUrlTree([APP_ROUTES.HOME]);
    }
  }

  return router.createUrlTree([APP_ROUTES.HOME]);
};
