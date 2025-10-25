# Utils Folder - /src/utils

## Purpose

Contains utility functions, HTTP interceptors, helpers, and shared functionality that don't fit into services or other categories.

## Files

- `auth.interceptor.ts` - HTTP interceptor for adding auth tokens
- `error.interceptor.ts` - HTTP interceptor for handling errors
- `index.ts` - Barrel export

## Angular 20 Functional Interceptor Pattern

### Auth Interceptor

```typescript
// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const token = authStore.token();

  // Skip auth for login/register endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  // Add auth token if available
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedReq);
  }

  return next(req);
};
```

### Error Interceptor

```typescript
// error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationStore } from '../store';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationStore = inject(NotificationStore);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Bad request';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please login.';
            router.navigate(['/login']);
            break;
          case 403:
            errorMessage = 'Access forbidden';
            router.navigate(['/forbidden']);
            break;
          case 404:
            errorMessage = 'Resource not found';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = error.error?.message || `Error Code: ${error.status}`;
        }
      }

      // Show error notification
      notificationStore.error(errorMessage);

      // Log error for debugging
      console.error('HTTP Error:', error);

      return throwError(() => new Error(errorMessage));
    })
  );
};
```

### Loading Interceptor

```typescript
// loading.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { UiStore } from '../store';

let activeRequests = 0;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const uiStore = inject(UiStore);

  // Increment active requests
  activeRequests++;
  uiStore.setLoading(true);

  return next(req).pipe(
    finalize(() => {
      // Decrement active requests
      activeRequests--;

      // Hide loader only when all requests complete
      if (activeRequests === 0) {
        uiStore.setLoading(false);
      }
    })
  );
};
```

### Logging Interceptor

```typescript
// logging.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const started = Date.now();

  console.log(`[HTTP] ${req.method} ${req.url} - Started`);

  return next(req).pipe(
    tap({
      next: (event) => {
        const elapsed = Date.now() - started;
        console.log(`[HTTP] ${req.method} ${req.url} - Success (${elapsed}ms)`);
      },
      error: (error) => {
        const elapsed = Date.now() - started;
        console.error(`[HTTP] ${req.method} ${req.url} - Error (${elapsed}ms)`, error);
      },
    })
  );
};
```

## Registering Interceptors

In `app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor, errorInterceptor, loadingInterceptor, loggingInterceptor } from './utils';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        loggingInterceptor, // First - logs all requests
        authInterceptor, // Second - adds auth token
        loadingInterceptor, // Third - manages loading state
        errorInterceptor, // Last - handles errors
      ])
    ),
    // ... other providers
  ],
};
```

## Utility Functions

### Date Utilities

```typescript
// date.utils.ts
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isDateInPast(date: Date | string): boolean {
  return new Date(date) < new Date();
}

export function daysBetween(date1: Date | string, date2: Date | string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
```

### String Utilities

```typescript
// string.utils.ts
export function truncate(str: string, maxLength: number): string {
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

### Validation Utilities

```typescript
// validation.utils.ts
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

export function isStrongPassword(password: string): boolean {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
}
```

### Array Utilities

```typescript
// array.utils.ts
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  return [...new Map(array.map((item) => [item[key], item])).values()];
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    (result[groupKey] = result[groupKey] || []).push(item);
    return result;
  }, {} as Record<string, T[]>);
}

export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return order === 'asc' ? comparison : -comparison;
  });
}
```

### Local Storage Utilities

```typescript
// storage.utils.ts
export function getItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading from localStorage: ${key}`, error);
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage: ${key}`, error);
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage: ${key}`, error);
  }
}

export function clear(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage', error);
  }
}
```

## Best Practices

### Functional Interceptors

- **Use HttpInterceptorFn** - Angular 20 functional interceptor type
- **Use inject()** - For dependency injection
- **Return next(req)** - Always return the next handler
- **Clone requests** - Use `req.clone()` to modify requests
- **Handle errors** - Use RxJS `catchError` operator

### Utility Functions

- **Pure functions** - Functions should not have side effects
- **Type safety** - Use TypeScript generics and proper types
- **Error handling** - Handle edge cases gracefully
- **Documentation** - Add JSDoc comments for complex utilities

### DO's

- Use functional interceptors
- Use `inject()` for dependencies
- Keep utilities pure and focused
- Use TypeScript strict typing
- Export through barrel file
- Write tests for utilities

### DON'Ts

- Don't use class-based interceptors
- Don't put business logic in interceptors
- Don't forget to clone HTTP requests
- Don't ignore error handling
- Don't create side effects in utilities

## Barrel Export

```typescript
// index.ts
export * from './auth.interceptor';
export * from './error.interceptor';
export * from './loading.interceptor';
export * from './logging.interceptor';
export * from './date.utils';
export * from './string.utils';
export * from './validation.utils';
export * from './array.utils';
export * from './storage.utils';
```

## Testing Interceptors

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideHttpClient(withInterceptors([authInterceptor]))],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should add auth token to request', () => {
    httpClient.get('/api/data').subscribe();

    const req = httpMock.expectOne('/api/data');
    expect(req.request.headers.has('Authorization')).toBe(true);
  });
});
```

## Notes for AI Agents

- Always use functional interceptors (HttpInterceptorFn)
- Use `inject()` for dependency injection in interceptors
- Keep utility functions pure and focused
- Use TypeScript generics for reusable utilities
- Export all utilities through barrel file
- Register interceptors in app.config.ts
- Follow the established patterns for consistency
