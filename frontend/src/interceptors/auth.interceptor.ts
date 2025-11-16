import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ROUTES } from '../constants/routes';

/**
 * Authentication Interceptor
 *
 * Responsibilities:
 * 1. Attach JWT access token to outgoing requests
 * 2. Handle 401 Unauthorized errors
 * 3. Attempt token refresh on 401
 * 4. Redirect to login if refresh fails
 *
 * @implements HttpInterceptorFn
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Skip authentication for public endpoints
  const publicEndpoints = [
    API_ENDPOINTS.AUTH.LOGIN,
    API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
    API_ENDPOINTS.AUTH.RESET_PASSWORD,
    API_ENDPOINTS.ORGANISATIONS.REGISTER, // Organisation registration
  ];

  const isPublicEndpoint = publicEndpoints.some((endpoint) => {
    return req.url.includes(endpoint);
  });

  // Don't add auth header for public endpoints
  if (isPublicEndpoint) {
    return next(req);
  }

  // Get access token from localStorage
  // Note: In production, consider using httpOnly cookies for better security
  const accessToken = localStorage.getItem('access_token');

  // Clone request and add Authorization header if token exists
  let authReq = req;
  if (accessToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  // Send cloned request and handle 401 errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized - attempt token refresh
      if (error.status === 401 && !req.url.includes(API_ENDPOINTS.AUTH.REFRESH)) {
        return handleTokenRefresh(req, next, router);
      }

      // For other errors, just pass them through
      return throwError(() => error);
    })
  );
};

/**
 * Attempt to refresh the access token
 * If successful, retry the original request
 * If failed, redirect to login
 */
function handleTokenRefresh(req: any, next: any, router: Router) {
  const refreshToken = localStorage.getItem('refresh_token');

  // No refresh token available - redirect to login
  if (!refreshToken) {
    clearTokensAndRedirect(router);
    return throwError(() => new Error('No refresh token available'));
  }

  // Call refresh token endpoint
  return fetch(API_ENDPOINTS.AUTH.REFRESH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Token refresh failed');
      }
      return response.json();
    })
    .then((data) => {
      // Store new tokens
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);

      // Clone original request with new token
      const retryReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      });

      // Retry original request
      return next(retryReq).toPromise();
    })
    .catch(() => {
      // Refresh failed - clear tokens and redirect
      clearTokensAndRedirect(router);
      return throwError(() => new Error('Session expired. Please login again.'));
    });
}

/**
 * Clear authentication tokens and redirect to login page
 */
function clearTokensAndRedirect(router: Router): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  router.navigate([ROUTES.LOGIN]);
}
