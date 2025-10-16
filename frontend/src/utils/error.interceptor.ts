import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ERROR_MESSAGES, APP_ROUTES } from '../constants';

/**
 * Error Interceptor
 * Handles HTTP errors globally and performs appropriate actions
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage: string = ERROR_MESSAGES.SERVER_ERROR;

      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        console.error('Client-side error:', error.error.message);
        errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
      } else {
        // Backend returned an unsuccessful response code
        console.error(`Backend returned code ${error.status}, body was:`, error.error);

        switch (error.status) {
          case 401:
            // Unauthorized - redirect to login
            errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
            authService.logout();
            router.navigate([APP_ROUTES.LOGIN]);
            break;

          case 403:
            // Forbidden
            errorMessage = 'You do not have permission to access this resource.';
            break;

          case 404:
            // Not found
            errorMessage = 'The requested resource was not found.';
            break;

          case 408:
            // Request timeout
            errorMessage = 'Request timeout. Please try again.';
            break;

          case 409:
            // Conflict
            errorMessage =
              error.error?.message || 'A conflict occurred. The resource may already exist.';
            break;

          case 422:
            // Validation error
            errorMessage = error.error?.message || ERROR_MESSAGES.VALIDATION_ERROR;
            break;

          case 429:
            // Too many requests
            errorMessage = 'Too many requests. Please slow down and try again later.';
            break;

          case 500:
          case 502:
          case 503:
          case 504:
            // Server errors
            errorMessage = ERROR_MESSAGES.SERVER_ERROR;
            break;

          default:
            errorMessage = error.error?.message || ERROR_MESSAGES.SERVER_ERROR;
        }
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
