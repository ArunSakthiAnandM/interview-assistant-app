# Services Folder - /src/services

## Purpose

Contains business logic, API communication, data transformation, and shared functionality used across the application.

## Files

- `auth.service.ts` - Authentication and authorization
- `candidate.service.ts` - Candidate-related operations
- `interview.service.ts` - Interview management
- `recruiter.service.ts` - Recruiter operations
- `file-upload.service.ts` - File upload handling
- `notification.service.ts` - Notifications and alerts
- `otp.service.ts` - OTP verification
- `index.ts` - Barrel export

## Angular 20 Service Pattern

### Basic Service Structure

```typescript
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants';
import { User, CreateUserDto } from '../models';

@Injectable({
  providedIn: 'root', // Singleton service
})
export class UserService {
  // Use inject() instead of constructor injection
  private http = inject(HttpClient);

  // Use signals for service state
  private users = signal<User[]>([]);

  // Expose readonly signal
  readonly users$ = this.users.asReadonly();

  // API methods
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(API_ENDPOINTS.USERS.BASE);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(API_ENDPOINTS.USERS.DETAIL(id));
  }

  createUser(dto: CreateUserDto): Observable<User> {
    return this.http.post<User>(API_ENDPOINTS.USERS.BASE, dto);
  }

  updateUser(id: string, dto: Partial<User>): Observable<User> {
    return this.http.put<User>(API_ENDPOINTS.USERS.DETAIL(id), dto);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.USERS.DETAIL(id));
  }

  // State management methods
  setUsers(users: User[]): void {
    this.users.set(users);
  }

  addUser(user: User): void {
    this.users.update((users) => [...users, user]);
  }
}
```

### Auth Service Pattern

```typescript
import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User, LoginDto, RegisterDto } from '../models';
import { API_ENDPOINTS } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // State
  private currentUser = signal<User | null>(null);
  private token = signal<string | null>(null);

  // Computed values
  readonly isAuthenticated = computed(() => !!this.token());
  readonly userRole = computed(() => this.currentUser()?.role);
  readonly user = this.currentUser.asReadonly();

  login(dto: LoginDto): Observable<{ user: User; token: string }> {
    return this.http.post<{ user: User; token: string }>(API_ENDPOINTS.AUTH.LOGIN, dto).pipe(
      tap((response) => {
        this.setAuth(response.user, response.token);
      })
    );
  }

  register(dto: RegisterDto): Observable<{ user: User; token: string }> {
    return this.http.post<{ user: User; token: string }>(API_ENDPOINTS.AUTH.REGISTER, dto).pipe(
      tap((response) => {
        this.setAuth(response.user, response.token);
      })
    );
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/login']);
  }

  private setAuth(user: User, token: string): void {
    this.currentUser.set(user);
    this.token.set(token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearAuth(): void {
    this.currentUser.set(null);
    this.token.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  hasPermission(permission: string): boolean {
    // Permission check logic
    return true;
  }

  hasRole(role: string): boolean {
    return this.userRole() === role;
  }
}
```

### File Upload Service Pattern

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private http = inject(HttpClient);

  uploadFile(file: File, endpoint: string): Observable<number> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post(endpoint, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(map((event) => this.getProgressPercentage(event)));
  }

  uploadMultipleFiles(files: File[], endpoint: string): Observable<number> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });

    return this.http
      .post(endpoint, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(map((event) => this.getProgressPercentage(event)));
  }

  private getProgressPercentage(event: HttpEvent<any>): number {
    if (event.type === HttpEventType.UploadProgress && event.total) {
      return Math.round((100 * event.loaded) / event.total);
    }
    return 0;
  }
}
```

### Notification Service Pattern

```typescript
import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);
  readonly notifications$ = this.notifications.asReadonly();

  show(type: Notification['type'], message: string, duration = 3000): void {
    const notification: Notification = {
      id: this.generateId(),
      type,
      message,
      duration,
    };

    this.notifications.update((items) => [...items, notification]);

    if (duration > 0) {
      setTimeout(() => this.remove(notification.id), duration);
    }
  }

  success(message: string, duration?: number): void {
    this.show('success', message, duration);
  }

  error(message: string, duration?: number): void {
    this.show('error', message, duration);
  }

  warning(message: string, duration?: number): void {
    this.show('warning', message, duration);
  }

  info(message: string, duration?: number): void {
    this.show('info', message, duration);
  }

  remove(id: string): void {
    this.notifications.update((items) => items.filter((n) => n.id !== id));
  }

  clear(): void {
    this.notifications.set([]);
  }

  private generateId(): string {
    return `notification-${Date.now()}-${Math.random()}`;
  }
}
```

## Best Practices

### Service Design

- **Single Responsibility** - Each service should have one clear purpose
- **Stateless when possible** - Prefer pure functions
- **Use signals for state** - When service needs to maintain state
- **Use inject()** - Instead of constructor injection
- **providedIn: 'root'** - For singleton services
- **Error handling** - Implement proper error handling

### Dependency Injection

```typescript
// Use inject() function (Angular 20)
export class MyService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);
}

// NOT this (old pattern)
export class MyService {
  constructor(private http: HttpClient, private router: Router) {}
}
```

### State Management

```typescript
// Use signals for service state
export class DataService {
  private data = signal<Data[]>([]);

  // Expose as readonly
  readonly data$ = this.data.asReadonly();

  // Computed values
  readonly dataCount = computed(() => this.data().length);

  // Update methods
  setData(newData: Data[]): void {
    this.data.set(newData);
  }

  addItem(item: Data): void {
    this.data.update((items) => [...items, item]);
  }
}
```

### Error Handling

```typescript
import { catchError, throwError } from 'rxjs';

export class ApiService {
  private http = inject(HttpClient);
  private notification = inject(NotificationService);

  getData(): Observable<Data[]> {
    return this.http.get<Data[]>('/api/data').pipe(
      catchError((error) => {
        this.notification.error('Failed to load data');
        return throwError(() => error);
      })
    );
  }
}
```

### Type Safety

```typescript
// Always use typed responses
export class UserService {
  private http = inject(HttpClient);

  // Good - typed
  getUser(id: string): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`);
  }

  // Avoid - untyped
  getUser(id: string): Observable<any> {
    return this.http.get(`/api/users/${id}`);
  }
}
```

## DO's and DON'Ts

### DO

- Use `inject()` for dependency injection
- Use `providedIn: 'root'` for singletons
- Use signals for service state
- Handle errors properly
- Use TypeScript strict typing
- Keep services focused and testable
- Export through barrel file (index.ts)

### DON'T

- Don't use constructor injection (use `inject()`)
- Don't put UI logic in services
- Don't use `any` type
- Don't forget error handling
- Don't make services too large
- Don't tightly couple services

## Testing Services

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

## Notes for AI Agents

- Always use `inject()` function for dependencies
- Use `providedIn: 'root'` for singleton services
- Use signals for service state management
- Keep services focused on single responsibility
- Implement proper error handling
- Use strict TypeScript typing
- Export services through barrel file
- Follow established patterns for consistency
