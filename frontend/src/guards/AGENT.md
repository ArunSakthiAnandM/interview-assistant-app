# Guards Folder - /src/guards

## Purpose

Contains route guards for protecting routes and controlling access based on authentication, authorization, and permissions.

## Files

- `auth.guard.ts` - Authentication guard (checks if user is logged in)
- `role.guard.ts` - Role-based authorization guard
- `permission.guard.ts` - Permission-based authorization guard
- `index.ts` - Barrel export

## Angular 20 Functional Guards

Angular 20 prefers **functional guards** over class-based guards.

### Auth Guard Pattern

```typescript
// auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  return true;
};
```

### Role Guard Pattern

```typescript
// role.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../constants';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRole = authService.getUserRole();

    if (!userRole || !allowedRoles.includes(userRole)) {
      router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  };
};
```

### Permission Guard Pattern

```typescript
// permission.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permissionGuard = (requiredPermission: string): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const hasPermission = authService.hasPermission(requiredPermission);

    if (!hasPermission) {
      router.navigate(['/forbidden']);
      return false;
    }

    return true;
  };
};
```

## Guard Types

### CanActivate - Route Access

Determines if a route can be activated

```typescript
export const canActivateGuard: CanActivateFn = (route, state) => {
  // Return true to allow, false to deny
  return true;
};
```

### CanActivateChild - Child Route Access

Protects child routes

```typescript
export const canActivateChildGuard: CanActivateChildFn = (route, state) => {
  return true;
};
```

### CanDeactivate - Leave Route

Prevents leaving a route (e.g., unsaved changes)

```typescript
export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};
```

### CanMatch - Lazy Loading

Controls whether a route can be lazy loaded

```typescript
export const canMatchGuard: CanMatchFn = (route, segments) => {
  return true;
};
```

## Usage in Routes

### Basic Auth Guard

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.ts'),
    canActivate: [authGuard],
  },
];
```

### Role-Based Guard

```typescript
import { roleGuard } from './guards';
import { UserRole } from './constants';

export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin.ts'),
    canActivate: [authGuard, roleGuard([UserRole.ADMIN])],
  },
];
```

### Multiple Guards

```typescript
export const routes: Routes = [
  {
    path: 'protected',
    loadComponent: () => import('./components/protected/protected.ts'),
    canActivate: [
      authGuard,
      roleGuard([UserRole.ADMIN, UserRole.ORGANISATION]),
      permissionGuard('VIEW_REPORTS'),
    ],
  },
];
```

### Child Route Protection

```typescript
export const routes: Routes = [
  {
    path: 'parent',
    loadComponent: () => import('./components/parent/parent.ts'),
    canActivateChild: [authGuard],
    children: [
      { path: 'child1', loadComponent: () => import('./child1.ts') },
      { path: 'child2', loadComponent: () => import('./child2.ts') },
    ],
  },
];
```

## Best Practices

### DO

- Use functional guards (not class-based)
- Use `inject()` for dependency injection
- Return `boolean`, `UrlTree`, or `Observable<boolean | UrlTree>`
- Redirect to appropriate pages on failure
- Store return URL for post-login redirect
- Keep guards pure and focused
- Handle async operations properly

### DON'T

- Don't put business logic in guards
- Don't make guards too complex
- Don't forget to handle loading states
- Don't ignore error cases
- Don't use deprecated class-based guards

## Common Patterns

### Async Guard with Observable

```typescript
export const asyncAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuth().pipe(
    map((isAuth) => {
      if (!isAuth) {
        return router.createUrlTree(['/login']);
      }
      return true;
    }),
    catchError(() => {
      return of(router.createUrlTree(['/error']));
    })
  );
};
```

### Guard with Route Data

```typescript
export const dataGuard: CanActivateFn = (route, state) => {
  const requiredRole = route.data['requiredRole'];
  const authService = inject(AuthService);

  return authService.hasRole(requiredRole);
};

// Usage
{
  path: 'admin',
  canActivate: [dataGuard],
  data: { requiredRole: 'ADMIN' }
}
```

## Testing Guards

```typescript
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  it('should allow access when authenticated', () => {
    // Test implementation
  });

  it('should redirect to login when not authenticated', () => {
    // Test implementation
  });
});
```

## Notes for AI Agents

- Always use functional guards in Angular 20
- Use `inject()` for dependencies, not constructor injection
- Guards should be pure functions focused on access control
- Return boolean, UrlTree, or Observable for async operations
- Keep guard logic simple - delegate complex logic to services
- Export guards through barrel file (index.ts)
