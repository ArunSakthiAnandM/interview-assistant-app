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
 * Recruiter Guard
 * Only allows users with RECRUITER role (for dashboard access)
 */
export const recruiterGuard: CanActivateFn = roleGuard([UserRole.RECRUITER]);

/**
 * Interviewer Guard
 * Only allows users with INTERVIEWER role (for dashboard access)
 */
export const interviewerGuard: CanActivateFn = roleGuard([UserRole.INTERVIEWER]);

/**
 * Candidate Guard
 * Only allows users with CANDIDATE role
 */
export const candidateGuard: CanActivateFn = roleGuard([UserRole.CANDIDATE]);

/**
 * Feature Guards - Allow multiple roles for feature access
 */

/**
 * Can Manage Recruiters Guard
 * Allows only RECRUITER role
 */
export const canManageRecruitersGuard: CanActivateFn = roleGuard([UserRole.RECRUITER]);

/**
 * Can Manage Interviews Guard
 * Allows RECRUITER and INTERVIEWER roles
 */
export const canManageInterviewsGuard: CanActivateFn = roleGuard([
  UserRole.RECRUITER,
  UserRole.INTERVIEWER,
]);

/**
 * Can View Interviews Guard
 * Allows ADMIN (for analytics), RECRUITER, INTERVIEWER, and CANDIDATE roles
 */
export const canViewInterviewsGuard: CanActivateFn = roleGuard([
  UserRole.ADMIN,
  UserRole.RECRUITER,
  UserRole.INTERVIEWER,
  UserRole.CANDIDATE,
]);

/**
 * Can Verify Recruiters Guard
 * Allows only ADMIN role
 */
export const canVerifyRecruitersGuard: CanActivateFn = roleGuard([UserRole.ADMIN]);

/**
 * Can View Analytics Guard
 * Allows only ADMIN role
 */
export const canViewAnalyticsGuard: CanActivateFn = roleGuard([UserRole.ADMIN]);
