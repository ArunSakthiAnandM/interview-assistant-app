import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ROUTES } from '../constants/routes';
import { ERROR_MESSAGES } from '../constants/app-config';

/**
 * Error Interceptor
 *
 * Responsibilities:
 * 1. Centralized HTTP error handling
 * 2. Transform backend errors into user-friendly messages
 * 3. Handle specific HTTP status codes
 * 4. Log errors for debugging
 * 5. Display error notifications
 *
 * Note: NotificationService is imported lazily to avoid circular dependency
 *
 * @implements HttpInterceptorFn
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      // Client-side or network error
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Network Error: ${error.error.message}`;
        console.error('Client-side error:', error.error);
      }
      // Backend returned unsuccessful response code
      else {
        errorMessage = getErrorMessage(error);
        console.error(`Backend error [${error.status}]:`, error);
      }

      // Handle specific status codes
      handleStatusCode(error.status, router);

      // Log error for debugging (in development mode)
      if (!isProduction()) {
        logDetailedError(error, errorMessage);
      }

      // Show error notification via NotificationService (lazy loaded)
      try {
        import('../services/notification/notification.service')
          .then((module) => {
            const notificationService = inject(module.NotificationService);
            notificationService.showError(errorMessage);
          })
          .catch(() => {
            // Fallback if service not available
            console.error('Error notification:', errorMessage);
          });
      } catch {
        console.error('Error notification:', errorMessage);
      }

      // Return error with user-friendly message
      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        originalError: error,
      }));
    })
  );
};

/**
 * Extract user-friendly error message from HTTP error response
 */
function getErrorMessage(error: HttpErrorResponse): string {
  // Check if backend returned a structured error response
  if (error.error && typeof error.error === 'object') {
    // API returns { message: string, errors?: { field: string, message: string }[] }
    if (error.error.message) {
      // If validation errors exist, combine them
      if (error.error.errors && Array.isArray(error.error.errors)) {
        const validationErrors = error.error.errors
          .map((e: any) => `${e.field}: ${e.message}`)
          .join(', ');
        return `${error.error.message}. ${validationErrors}`;
      }
      return error.error.message;
    }
  }

  // Fallback to status-based messages
  switch (error.status) {
    case 0:
      return ERROR_MESSAGES.NETWORK_ERROR;
    case 400:
      return error.error?.message || ERROR_MESSAGES.VALIDATION_ERROR;
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 403:
      return ERROR_MESSAGES.FORBIDDEN;
    case 404:
      return ERROR_MESSAGES.NOT_FOUND;
    case 409:
      return error.error?.message || 'This resource already exists.';
    case 500:
      return ERROR_MESSAGES.SERVER_ERROR;
    case 503:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return ERROR_MESSAGES.UNKNOWN_ERROR;
  }
}

/**
 * Handle specific HTTP status codes with actions
 */
function handleStatusCode(status: number, router: Router): void {
  switch (status) {
    case 401:
      // Handled by auth interceptor, but ensure cleanup here too
      if (!router.url.includes(ROUTES.LOGIN)) {
        // Don't redirect if already on login page to avoid infinite loop
        // Auth interceptor will handle token refresh
      }
      break;

    case 403:
      // Forbidden - user doesn't have permission
      // Could redirect to unauthorized page
      console.warn('Access forbidden - insufficient permissions');
      break;

    case 404:
      // Not found - could log but usually not critical
      console.warn('Resource not found');
      break;

    case 500:
    case 503:
      // Server errors - could show maintenance page for 503
      console.error('Server error occurred');
      break;

    default:
      // Other status codes - no special handling needed
      break;
  }
}

/**
 * Log detailed error information for debugging (development only)
 */
function logDetailedError(error: HttpErrorResponse, userMessage: string): void {
  console.group(`🚨 HTTP Error: ${error.status} ${error.statusText}`);
  console.log('URL:', error.url);
  console.log('User Message:', userMessage);
  console.log('Error Body:', error.error);
  console.log('Headers:', error.headers);
  console.log('Full Error:', error);
  console.groupEnd();
}

/**
 * Check if running in production mode
 */
function isProduction(): boolean {
  // Access Angular environment (will be set up via environment.ts)
  return false; // TODO: Replace with environment.production when available
}

/**
 * Type guard to check if error is an HttpErrorResponse
 */
export function isHttpErrorResponse(error: any): error is HttpErrorResponse {
  return error instanceof HttpErrorResponse;
}

/**
 * Extract error message from various error formats
 * Useful for components that catch errors
 */
export function extractErrorMessage(error: any): string {
  if (isHttpErrorResponse(error)) {
    return getErrorMessage(error);
  }

  if (error?.message) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return ERROR_MESSAGES.UNKNOWN_ERROR;
}
