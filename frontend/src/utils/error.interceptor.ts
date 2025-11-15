import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationStore } from '../store/notification.store';
import { ERROR_MESSAGES, APP_ROUTES } from '../constants';

/**
 * Error Interceptor
 * Handles HTTP errors globally and performs appropriate actions
 * Shows user-friendly notifications for all error types
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationStore = inject(NotificationStore);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage: string = ERROR_MESSAGES.UNKNOWN_ERROR;
      let shouldRedirect = false;

      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        console.error('Client-side error:', error.error.message);
        errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
      } else {
        // Backend returned an unsuccessful response code
        console.error(`Backend returned code ${error.status}, body was:`, error.error);

        switch (error.status) {
          case 0:
            // Network error or CORS issue
            errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
            break;

          case 400:
            // Bad request - check for specific error messages
            if (error.url?.includes('/auth/login')) {
              errorMessage = ERROR_MESSAGES.INVALID_CREDENTIALS;
            } else if (error.url?.includes('/register')) {
              errorMessage = error.error?.message || ERROR_MESSAGES.REGISTRATION_FAILED;
            } else {
              errorMessage = error.error?.message || ERROR_MESSAGES.INVALID_INPUT;
            }
            break;

          case 401:
            // Unauthorized - session expired or invalid token
            if (error.url?.includes('/auth/login')) {
              errorMessage = ERROR_MESSAGES.INVALID_CREDENTIALS;
            } else {
              errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
              shouldRedirect = true;
            }
            break;

          case 403:
            // Forbidden - insufficient permissions
            errorMessage = ERROR_MESSAGES.FORBIDDEN;
            break;

          case 404:
            // Not found
            if (error.url?.includes('/interview')) {
              errorMessage = ERROR_MESSAGES.INTERVIEW_NOT_FOUND;
            } else {
              errorMessage = ERROR_MESSAGES.NOT_FOUND;
            }
            break;

          case 408:
            // Request timeout
            errorMessage = ERROR_MESSAGES.TIMEOUT_ERROR;
            break;

          case 409:
            // Conflict - resource already exists
            if (error.error?.message?.toLowerCase().includes('email')) {
              errorMessage = ERROR_MESSAGES.EMAIL_ALREADY_EXISTS;
            } else if (error.error?.message?.toLowerCase().includes('mobile')) {
              errorMessage = ERROR_MESSAGES.MOBILE_ALREADY_EXISTS;
            } else {
              errorMessage = error.error?.message || ERROR_MESSAGES.CONFLICT;
            }
            break;

          case 422:
            // Validation error
            errorMessage = error.error?.message || ERROR_MESSAGES.VALIDATION_ERROR;
            break;

          case 429:
            // Too many requests - rate limiting
            errorMessage = ERROR_MESSAGES.TOO_MANY_REQUESTS;
            break;

          case 500:
            // Internal server error
            errorMessage = ERROR_MESSAGES.SERVER_ERROR;
            break;

          case 502:
            // Bad gateway
            errorMessage = ERROR_MESSAGES.SERVICE_UNAVAILABLE;
            break;

          case 503:
            // Service unavailable
            errorMessage = ERROR_MESSAGES.SERVICE_UNAVAILABLE;
            break;

          case 504:
            // Gateway timeout
            errorMessage = ERROR_MESSAGES.GATEWAY_TIMEOUT;
            break;

          default:
            // Use backend message if available, otherwise use generic error
            errorMessage = error.error?.message || ERROR_MESSAGES.UNKNOWN_ERROR;
        }
      }

      // Show error notification to user
      notificationStore.error(errorMessage);

      // Redirect to login if unauthorized (except for login page itself)
      if (shouldRedirect && !error.url?.includes('/auth/login')) {
        // Clear auth state would be handled by AuthService
        setTimeout(() => {
          router.navigate([APP_ROUTES.LOGIN], {
            queryParams: { returnUrl: router.url, reason: 'session_expired' },
          });
        }, 1500); // Small delay to show the error message
      }

      // Return error with formatted message
      return throwError(() => ({
        message: errorMessage,
        status: error.status,
        error: error.error,
      }));
    })
  );
};
