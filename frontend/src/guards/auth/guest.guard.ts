import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UserRole } from '../../models/user.model';
import { ROUTES } from '../../constants/routes';

/**
 * Guest Guard
 *
 * Prevents authenticated users from accessing guest-only routes (login, register).
 * Redirects to appropriate dashboard if already logged in.
 *
 * @example
 * ```typescript
 * {
 *   path: 'login',
 *   canActivate: [guestGuard],
 *   component: LoginComponent
 * }
 * ```
 */
export const guestGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Allow access if user is not authenticated
  if (!authService.isAuthenticated()) {
    return true;
  }

  // User is already logged in, redirect to appropriate dashboard
  const userRole = authService.userRole();

  switch (userRole) {
    case UserRole.ADMIN:
      return router.createUrlTree([ROUTES.ADMIN.DASHBOARD]);
    case UserRole.ORGANISATION_ADMIN:
      return router.createUrlTree([ROUTES.ORGANISATION.DASHBOARD]);
    case UserRole.RECRUITER:
      return router.createUrlTree([ROUTES.RECRUITER.DASHBOARD]);
    case UserRole.INTERVIEWER:
      return router.createUrlTree([ROUTES.INTERVIEWER.DASHBOARD]);
    case UserRole.CANDIDATE:
      return router.createUrlTree([ROUTES.CANDIDATE.DASHBOARD]);
    default:
      return router.createUrlTree([ROUTES.HOME]);
  }
};
