# Models Folder - /src/models

## Purpose

Contains TypeScript interfaces, types, and data models that define the shape of data used throughout the application.

## Files

- `user.model.ts` - User-related interfaces
- `candidate.model.ts` - Candidate-specific models
- `interviewer.model.ts` - Interviewer-specific models
- `organisation.model.ts` - Organisation-specific models
- `interview.model.ts` - Interview-related models
- `api-response.model.ts` - API response wrapper types
- `index.ts` - Barrel export

## TypeScript Best Practices

### Interface Naming

Use descriptive names with suffixes:

- `Interface` suffix for data interfaces
- `Type` suffix for type aliases
- `Enum` for enumerations
- Or just use the domain name (e.g., `User`, `Interview`)

### User Model Pattern

```typescript
// user.model.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  phone?: string;
  bio?: string;
  avatar?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  notifications: boolean;
  theme: 'light' | 'dark';
  language: string;
}

export type UserRole = 'ADMIN' | 'ORGANISATION' | 'INTERVIEWER' | 'CANDIDATE';

// Type for creating new users
export type CreateUserDto = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

// Type for updating users
export type UpdateUserDto = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;
```

### Interview Model Pattern

```typescript
// interview.model.ts
export interface Interview {
  id: string;
  title: string;
  description: string;
  candidateId: string;
  interviewerId: string;
  organisationId: string;
  scheduledAt: Date;
  duration: number; // in minutes
  status: InterviewStatus;
  location?: string;
  meetingLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum InterviewStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface InterviewFeedback {
  id: string;
  interviewId: string;
  rating: number;
  comments: string;
  strengths: string[];
  improvements: string[];
  recommendation: 'HIRE' | 'REJECT' | 'MAYBE';
  createdAt: Date;
}

export type CreateInterviewDto = Omit<Interview, 'id' | 'status' | 'createdAt' | 'updatedAt'>;
export type UpdateInterviewDto = Partial<CreateInterviewDto>;
```

### API Response Model Pattern

```typescript
// api-response.model.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: Date;
}

// Type guards
export function isApiError(response: any): response is ApiError {
  return response && !response.success && 'error' in response;
}
```

### Utility Types

```typescript
// Common utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ID = string | number;

// Timestamp types
export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDelete extends Timestamps {
  deletedAt?: Date;
}

// Generic CRUD types
export type CreateDto<T> = Omit<T, 'id' | keyof Timestamps>;
export type UpdateDto<T> = Partial<CreateDto<T>>;
```

## Best Practices

### Use Interfaces for Objects

```typescript
// Good - interface for object shapes
export interface Product {
  id: string;
  name: string;
  price: number;
}
```

### Use Type Aliases for Unions and Primitives

```typescript
// Good - type alias for union types
export type Status = 'active' | 'inactive' | 'pending';
export type ID = string | number;
```

### Use Enums for Fixed Sets

```typescript
// Good - enum for fixed values
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
}
```

### Use Utility Types

```typescript
// Leverage TypeScript utility types
export type PartialUser = Partial<User>;
export type RequiredUser = Required<User>;
export type ReadonlyUser = Readonly<User>;
export type UserWithoutId = Omit<User, 'id'>;
export type UserIdAndName = Pick<User, 'id' | 'name'>;
```

### Generic Types

```typescript
export interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(item: CreateDto<T>): Promise<T>;
  update(id: string, item: UpdateDto<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
```

### Type Guards

```typescript
export interface Admin extends User {
  adminLevel: number;
}

export function isAdmin(user: User): user is Admin {
  return user.role === UserRole.ADMIN;
}
```

## DO's and DON'Ts

### DO

- Use interfaces for object shapes
- Use meaningful, descriptive names
- Add JSDoc comments for complex types
- Export through barrel file (index.ts)
- Use strict typing (avoid `any`)
- Use utility types (Partial, Omit, Pick, etc.)
- Define DTOs for API operations
- Use enums for fixed value sets

### DON'T

- Don't use `any` type
- Don't put business logic in models
- Don't use classes unless needed
- Don't duplicate type definitions
- Don't forget to export new models
- Don't use `interface` for primitives/unions

## Barrel Export Pattern

```typescript
// index.ts
export * from './user.model';
export * from './candidate.model';
export * from './interviewer.model';
export * from './organisation.model';
export * from './interview.model';
export * from './api-response.model';
```

## Usage in Services and Components

```typescript
// Importing models
import { User, CreateUserDto, Interview } from '@/models';

// Using in a service
export class UserService {
  createUser(dto: CreateUserDto): Observable<User> {
    return this.http.post<User>('/api/users', dto);
  }
}

// Using in a component
export class UserListComponent {
  users = signal<User[]>([]);
  selectedUser = signal<User | null>(null);
}
```

## Documentation

Add JSDoc comments for complex types:

```typescript
/**
 * Represents a user in the system.
 * @property {string} id - Unique identifier
 * @property {UserRole} role - User's role in the system
 */
export interface User {
  id: string;
  role: UserRole;
  // ...
}
```

## Notes for AI Agents

- All data models must be TypeScript interfaces or types
- Use strict typing - avoid `any`
- Create DTO types for API operations
- Use TypeScript utility types for variations
- Export all models through index.ts barrel file
- Keep models pure - no business logic
- Use enums for fixed value sets
- Document complex types with JSDoc
