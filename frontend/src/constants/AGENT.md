# Constants Folder - /src/constants

## Purpose

Contains application-wide constants, configuration values, and enums used throughout the application.

## Files

- `api.constants.ts` - API endpoints and HTTP-related constants
- `app.constants.ts` - General application constants
- `index.ts` - Barrel export for easy imports

## Patterns and Best Practices

### API Constants

```typescript
// api.constants.ts
export const API_BASE_URL = '/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  USERS: {
    BASE: `${API_BASE_URL}/users`,
    PROFILE: (id: string) => `${API_BASE_URL}/users/${id}`,
  },
  INTERVIEWS: {
    BASE: `${API_BASE_URL}/interviews`,
    DETAIL: (id: string) => `${API_BASE_URL}/interviews/${id}`,
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;
```

### Application Constants

```typescript
// app.constants.ts
export const APP_CONFIG = {
  APP_NAME: 'Interview Assistant',
  VERSION: '1.0.0',
  DEFAULT_LANGUAGE: 'en',
  ITEMS_PER_PAGE: 10,
  MAX_FILE_SIZE_MB: 5,
} as const;

export enum UserRole {
  ADMIN = 'ADMIN',
  ORGANISATION = 'ORGANISATION',
  INTERVIEWER = 'INTERVIEWER',
  CANDIDATE = 'CANDIDATE',
}

export enum InterviewStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  INTERVIEWS: '/interviews',
} as const;

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  EMAIL_PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
} as const;
```

### Barrel Export (index.ts)

```typescript
// index.ts
export * from './api.constants';
export * from './app.constants';
```

## TypeScript Best Practices

### Use `as const` for Immutability

```typescript
// Good - immutable and type-safe
export const CONFIG = {
  API_URL: 'https://api.example.com',
} as const;

// Avoid - mutable
export const CONFIG = {
  API_URL: 'https://api.example.com',
};
```

### Use Enums for Fixed Sets

```typescript
// Use enums for a fixed set of related values
export enum Status {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
```

### Use Type-Safe Object Literals

```typescript
// Type-safe constant objects
export const ERROR_MESSAGES: Record<string, string> = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
} as const;
```

### Function Constants for Dynamic Values

```typescript
// Use functions for dynamic URL construction
export const getApiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;
export const getUserUrl = (userId: string) => `${API_BASE_URL}/users/${userId}`;
```

## Usage in Components and Services

### Importing

```typescript
// Use barrel imports
import { API_ENDPOINTS, UserRole, APP_CONFIG } from '@/constants';

// Or specific imports
import { API_ENDPOINTS } from '@/constants/api.constants';
```

### Usage Examples

```typescript
// In a service
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '@/constants';

export class UserService {
  private http = inject(HttpClient);

  getUsers() {
    return this.http.get(API_ENDPOINTS.USERS.BASE);
  }
}

// In a component
import { UserRole } from '@/constants';

export class DashboardComponent {
  isAdmin = signal(false);

  checkRole(role: string) {
    this.isAdmin.set(role === UserRole.ADMIN);
  }
}
```

## Guidelines

### DO

- Use `as const` for type safety and immutability
- Group related constants together
- Use descriptive names
- Export through barrel file (index.ts)
- Use enums for fixed sets of values
- Document complex constants

### DON'T

- Don't use `var` or `let` for constants
- Don't store component state here
- Don't include business logic
- Don't mutate constant values
- Don't use magic strings elsewhere (define them here)

## Notes for AI Agents

- All application-wide constants should be defined here
- Use TypeScript's strict typing for constants
- Maintain the barrel export pattern in index.ts
- Keep constants immutable with `as const`
- Group related constants in logical structures
- Use enums for status types and roles
