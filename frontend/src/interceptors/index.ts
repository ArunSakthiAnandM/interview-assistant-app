/**
 * Barrel export for HTTP interceptors
 *
 * Usage in app.config.ts:
 * import { authInterceptor, errorInterceptor } from './interceptors';
 *
 * provideHttpClient(
 *   withInterceptors([authInterceptor, errorInterceptor])
 * )
 */

export { authInterceptor } from './auth.interceptor';
export { errorInterceptor, extractErrorMessage, isHttpErrorResponse } from './error.interceptor';
