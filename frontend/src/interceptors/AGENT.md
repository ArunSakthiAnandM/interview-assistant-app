# Interceptors Folder - /src/interceptors

## Purpose

This folder contains HTTP interceptors for cross-cutting concerns like authentication, error handling, and logging for API requests.

## Interceptor Guidelines

### 1. Functional Interceptor Pattern

Always use the functional interceptor pattern (Angular 20):

```typescript
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Interceptor logic
  return next(req);
};
```

**❌ DON'T** use class-based interceptors (deprecated):

```typescript
// DON'T DO THIS
export class AuthInterceptor implements HttpInterceptor {}
```

### 2. Dependency Injection

Use `inject()` function for dependencies:

```typescript
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  // Use authService
};
```

### 3. Token Management

- **Auth Interceptor**: Attach JWT tokens to requests
- **Error Interceptor**: Handle 401 errors, trigger token refresh
- Never store tokens in local storage - use httpOnly cookies or secure stores

### 4. Error Handling

- Provide user-friendly error messages
- Handle common HTTP errors (401, 403, 404, 500)
- Log errors for debugging
- Don't expose sensitive error details to users

### 5. Request/Response Transformation

- Clone requests before modifying headers
- Use RxJS operators for response transformation
- Handle loading states if needed

## File Structure

```
interceptors/
├── AGENT.md
├── auth.interceptor.ts           # JWT token attachment and refresh
├── error.interceptor.ts          # Global error handling
└── index.ts                      # Barrel export
```

## Common Patterns

### Request Cloning

```typescript
const clonedReq = req.clone({
  setHeaders: {
    Authorization: `Bearer ${token}`,
  },
});
return next(clonedReq);
```

### Error Handling with Retry

```typescript
return next(req).pipe(
  retry(2),
  catchError((error: HttpErrorResponse) => {
    // Handle error
    return throwError(() => error);
  })
);
```

### Conditional Interception

```typescript
// Skip auth for public endpoints
if (req.url.includes('/public/')) {
  return next(req);
}
```

## Integration

Interceptors are provided in `app.config.ts`:

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))],
};
```

## Best Practices

1. **Keep interceptors focused**: Each interceptor should handle one concern
2. **Order matters**: Auth interceptor before error interceptor
3. **Avoid side effects**: Don't modify global state directly
4. **Use RxJS operators**: Leverage pipe, map, catchError, retry
5. **Test thoroughly**: Interceptors are critical infrastructure
6. **Handle edge cases**: Null tokens, expired tokens, network failures
7. **Performance**: Avoid heavy computations in interceptors
