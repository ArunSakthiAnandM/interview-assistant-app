import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ROUTES } from '../../constants/routes';

/**
 * Authentication Guard
 *
 * Prevents unauthenticated users from accessing protected routes.
 * Redirects to login page with return URL if not authenticated.
 *
 * @example
 * ```typescript
 * {
 *   path: 'dashboard',
 *   canActivate: [authGuard],
 *   component: DashboardComponent
 * }
 * ```
 */
export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login with return URL
  return router.createUrlTree([ROUTES.LOGIN], {
    queryParams: { returnUrl: state.url },
  });
};
