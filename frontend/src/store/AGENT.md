# Store Folder - /src/store

## Purpose

Contains signal-based state management stores for sharing state across components and managing application-level state.

## Files

- `auth.store.ts` - Authentication state
- `interview.store.ts` - Interview-related state
- `notification.store.ts` - Notification state
- `ui.store.ts` - UI state (loading, modals, etc.)
- `index.ts` - Barrel export

## Angular 20 Signal-Based Store Pattern

### Basic Store Structure

```typescript
import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  // Private state signals
  private _currentUser = signal<User | null>(null);
  private _token = signal<string | null>(null);
  private _isLoading = signal(false);

  // Public readonly signals
  readonly currentUser = this._currentUser.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  // Computed values
  readonly isAuthenticated = computed(() => !!this._token());
  readonly userRole = computed(() => this._currentUser()?.role);
  readonly userName = computed(() => {
    const user = this._currentUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  });

  // Actions
  setUser(user: User | null): void {
    this._currentUser.set(user);
  }

  setToken(token: string | null): void {
    this._token.set(token);
  }

  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  login(user: User, token: string): void {
    this._currentUser.set(user);
    this._token.set(token);
    this.persistAuth(user, token);
  }

  logout(): void {
    this._currentUser.set(null);
    this._token.set(null);
    this.clearAuth();
  }

  // Private helper methods
  private persistAuth(user: User, token: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
```

### Interview Store Pattern

```typescript
import { Injectable, signal, computed, inject } from '@angular/core';
import { Interview, InterviewStatus } from '../models';

@Injectable({
  providedIn: 'root',
})
export class InterviewStore {
  // Private state
  private _interviews = signal<Interview[]>([]);
  private _selectedInterview = signal<Interview | null>(null);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  readonly interviews = this._interviews.asReadonly();
  readonly selectedInterview = this._selectedInterview.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed values
  readonly interviewCount = computed(() => this._interviews().length);

  readonly scheduledInterviews = computed(() =>
    this._interviews().filter((i) => i.status === InterviewStatus.SCHEDULED)
  );

  readonly completedInterviews = computed(() =>
    this._interviews().filter((i) => i.status === InterviewStatus.COMPLETED)
  );

  readonly upcomingInterviews = computed(() => {
    const now = new Date();
    return this._interviews()
      .filter((i) => i.status === InterviewStatus.SCHEDULED)
      .filter((i) => new Date(i.scheduledAt) > now)
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  });

  // Actions
  setInterviews(interviews: Interview[]): void {
    this._interviews.set(interviews);
    this._error.set(null);
  }

  addInterview(interview: Interview): void {
    this._interviews.update((items) => [...items, interview]);
  }

  updateInterview(id: string, updates: Partial<Interview>): void {
    this._interviews.update((items) =>
      items.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }

  removeInterview(id: string): void {
    this._interviews.update((items) => items.filter((item) => item.id !== id));
  }

  selectInterview(interview: Interview | null): void {
    this._selectedInterview.set(interview);
  }

  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }

  clearError(): void {
    this._error.set(null);
  }

  reset(): void {
    this._interviews.set([]);
    this._selectedInterview.set(null);
    this._isLoading.set(false);
    this._error.set(null);
  }
}
```

### UI Store Pattern

```typescript
import { Injectable, signal, computed } from '@angular/core';

export interface Modal {
  id: string;
  isOpen: boolean;
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class UiStore {
  // Private state
  private _isLoading = signal(false);
  private _isSidebarOpen = signal(true);
  private _modals = signal<Modal[]>([]);
  private _theme = signal<'light' | 'dark'>('light');

  // Public readonly signals
  readonly isLoading = this._isLoading.asReadonly();
  readonly isSidebarOpen = this._isSidebarOpen.asReadonly();
  readonly modals = this._modals.asReadonly();
  readonly theme = this._theme.asReadonly();

  // Computed values
  readonly isDarkTheme = computed(() => this._theme() === 'dark');
  readonly hasOpenModals = computed(() => this._modals().some((m) => m.isOpen));

  // Loading actions
  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  // Sidebar actions
  toggleSidebar(): void {
    this._isSidebarOpen.update((state) => !state);
  }

  setSidebarOpen(isOpen: boolean): void {
    this._isSidebarOpen.set(isOpen);
  }

  // Modal actions
  openModal(id: string, data?: any): void {
    this._modals.update((modals) => {
      const existing = modals.find((m) => m.id === id);
      if (existing) {
        return modals.map((m) => (m.id === id ? { ...m, isOpen: true, data } : m));
      }
      return [...modals, { id, isOpen: true, data }];
    });
  }

  closeModal(id: string): void {
    this._modals.update((modals) => modals.map((m) => (m.id === id ? { ...m, isOpen: false } : m)));
  }

  closeAllModals(): void {
    this._modals.update((modals) => modals.map((m) => ({ ...m, isOpen: false })));
  }

  // Theme actions
  setTheme(theme: 'light' | 'dark'): void {
    this._theme.set(theme);
    this.persistTheme(theme);
  }

  toggleTheme(): void {
    this._theme.update((current) => (current === 'light' ? 'dark' : 'light'));
    this.persistTheme(this._theme());
  }

  private persistTheme(theme: string): void {
    localStorage.setItem('theme', theme);
  }
}
```

### Notification Store Pattern

```typescript
import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationStore {
  // Private state
  private _notifications = signal<Notification[]>([]);

  // Public readonly signal
  readonly notifications = this._notifications.asReadonly();

  // Actions
  add(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
    };

    this._notifications.update((items) => [...items, newNotification]);

    // Auto-remove after duration
    if (notification.duration) {
      setTimeout(() => this.remove(newNotification.id), notification.duration);
    }
  }

  success(message: string, duration = 3000): void {
    this.add({ type: 'success', message, duration });
  }

  error(message: string, duration = 5000): void {
    this.add({ type: 'error', message, duration });
  }

  warning(message: string, duration = 4000): void {
    this.add({ type: 'warning', message, duration });
  }

  info(message: string, duration = 3000): void {
    this.add({ type: 'info', message, duration });
  }

  remove(id: string): void {
    this._notifications.update((items) => items.filter((n) => n.id !== id));
  }

  clear(): void {
    this._notifications.set([]);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

## Best Practices

### Signal Store Patterns

- **Private signals** - Use private signals for internal state
- **Readonly exposure** - Expose signals as readonly using `asReadonly()`
- **Computed values** - Use `computed()` for derived state
- **Immutable updates** - Use `set()` or `update()` with immutable patterns
- **No mutate()** - DO NOT use `mutate()` method

### State Updates

```typescript
// Good - immutable update
this._items.update((items) => [...items, newItem]);

// Good - set new array
this._items.set([...currentItems, newItem]);

// BAD - mutating (don't use mutate())
this._items.mutate((items) => items.push(newItem)); // DON'T DO THIS
```

### Computed Values

```typescript
// Use computed for derived state
readonly totalPrice = computed(() =>
  this._items().reduce((sum, item) => sum + item.price, 0)
);

readonly filteredItems = computed(() =>
  this._items().filter(item => item.status === 'active')
);
```

### Store Actions

- Keep actions focused and descriptive
- Handle side effects in actions
- Update related signals together
- Clear errors after successful operations

## DO's and DON'Ts

### DO

- Use signals for reactive state
- Expose signals as readonly
- Use computed() for derived state
- Keep state immutable
- Use descriptive action names
- Handle loading and error states
- Use `providedIn: 'root'`

### DON'T

- Don't use `mutate()` on signals
- Don't expose writable signals directly
- Don't put business logic in stores
- Don't forget to handle errors
- Don't make stores too large
- Don't create unnecessary computed values

## Usage in Components

```typescript
import { Component, inject, effect } from '@angular/core';
import { AuthStore, InterviewStore } from '@/store';

@Component({
  // ...
})
export class DashboardComponent {
  private authStore = inject(AuthStore);
  private interviewStore = inject(InterviewStore);

  // Access store values
  user = this.authStore.currentUser;
  interviews = this.interviewStore.upcomingInterviews;
  isLoading = this.interviewStore.isLoading;

  // Call store actions
  logout(): void {
    this.authStore.logout();
  }

  selectInterview(interview: Interview): void {
    this.interviewStore.selectInterview(interview);
  }

  // React to store changes
  constructor() {
    effect(() => {
      console.log('User changed:', this.user());
    });
  }
}
```

## Testing Stores

```typescript
import { TestBed } from '@angular/core/testing';
import { AuthStore } from './auth.store';

describe('AuthStore', () => {
  let store: AuthStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthStore],
    });
    store = TestBed.inject(AuthStore);
  });

  it('should initialize with null user', () => {
    expect(store.currentUser()).toBeNull();
  });

  it('should set user on login', () => {
    const user = { id: '1', email: 'test@test.com' };
    store.login(user, 'token');
    expect(store.currentUser()).toEqual(user);
  });
});
```

## Notes for AI Agents

- Use signals for all state management
- Expose signals as readonly to prevent external mutations
- Use computed() for derived state
- Use `set()` or `update()` for state changes (NOT `mutate()`)
- Keep stores focused on single domain
- Handle loading and error states
- Use `providedIn: 'root'` for singleton stores
- Export stores through barrel file (index.ts)
