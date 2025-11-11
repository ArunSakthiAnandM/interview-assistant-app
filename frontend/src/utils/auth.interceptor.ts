import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HTTP_HEADERS } from '../constants';

/**
 * Auth Interceptor
 * Automatically adds authorization token to outgoing HTTP requests
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  // Skip adding token for public endpoints (login, register, etc.)
  const publicUrls = ['/auth/login', '/auth/register', '/otp/send', '/recruiters', '/candidates'];
  const isPublicUrl = publicUrls.some((url) => req.url.includes(url));

  if (token && !isPublicUrl) {
    // Clone the request and add the authorization header
    const clonedRequest = req.clone({
      setHeaders: {
        [HTTP_HEADERS.AUTHORIZATION]: `Bearer ${token}`,
      },
    });
    return next(clonedRequest);
  }

  return next(req);
};
