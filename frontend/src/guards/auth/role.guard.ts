import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UserRole } from '../../models/user.model';
import { ROUTES } from '../../constants/routes';

/**
 * Role Guard Factory
 *
 * Creates a guard that checks if the user has one of the allowed roles.
 * Redirects to unauthorized page if role doesn't match.
 *
 * @param allowedRoles - Array of roles that are allowed to access the route
 *
 * @example
 * ```typescript
 * {
 *   path: 'admin',
 *   canActivate: [authGuard, roleGuard([UserRole.ADMIN])],
 *   component: AdminComponent
 * }
 * ```
 */
export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route, state): boolean | UrlTree => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // First check if user is authenticated
    if (!authService.isAuthenticated()) {
      return router.createUrlTree([ROUTES.LOGIN], {
        queryParams: { returnUrl: state.url },
      });
    }

    // Check if user has one of the allowed roles
    if (authService.hasAnyRole(allowedRoles)) {
      return true;
    }

    // User is authenticated but doesn't have the required role
    console.warn(
      `Access denied: User role ${authService.userRole()} not in allowed roles`,
      allowedRoles
    );
    return router.createUrlTree([ROUTES.UNAUTHORIZED]);
  };
};

/**
 * Admin Only Guard
 * Pre-configured guard for admin-only routes
 */
export const adminGuard: CanActivateFn = roleGuard([UserRole.ADMIN]);

/**
 * Organisation Admin Guard
 * Pre-configured guard for organisation admin routes
 */
export const organisationAdminGuard: CanActivateFn = roleGuard([UserRole.ORGANISATION_ADMIN]);

/**
 * Recruiter Guard
 * Pre-configured guard for recruiter routes
 */
export const recruiterGuard: CanActivateFn = roleGuard([UserRole.RECRUITER]);

/**
 * Interviewer Guard
 * Pre-configured guard for interviewer routes
 */
export const interviewerGuard: CanActivateFn = roleGuard([UserRole.INTERVIEWER]);

/**
 * Candidate Guard
 * Pre-configured guard for candidate routes
 */
export const candidateGuard: CanActivateFn = roleGuard([UserRole.CANDIDATE]);

/**
 * Organisation Staff Guard
 * Allows organisation admins and recruiters
 */
export const organisationStaffGuard: CanActivateFn = roleGuard([
  UserRole.ORGANISATION_ADMIN,
  UserRole.RECRUITER,
]);

/**
 * Interview Participants Guard
 * Allows recruiters, interviewers, and candidates
 */
export const interviewParticipantsGuard: CanActivateFn = roleGuard([
  UserRole.RECRUITER,
  UserRole.INTERVIEWER,
  UserRole.CANDIDATE,
]);
