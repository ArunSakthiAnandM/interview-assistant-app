import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthResponse, LoginCredentials, User, UserRole } from '../models';
import { API_CONFIG, API_ENDPOINTS, STORAGE_KEYS, APP_ROUTES } from '../constants';
import { AuthStore } from '../store/auth.store';
import { NotificationStore } from '../store/notification.store';

/**
 * Authentication Service
 * Handles user authentication, authorization, and session management
 * Integrated with AuthStore for centralized state management
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authStore = inject(AuthStore);
  private notificationStore = inject(NotificationStore);

  // Expose store signals for convenience
  readonly currentUser = this.authStore.currentUser;
  readonly isAuthenticated = this.authStore.isAuthenticated;
  readonly isLoading = this.authStore.isLoading;
  readonly userRole = this.authStore.userRole;
  readonly isAdmin = this.authStore.isAdmin;
  readonly isRecruiter = this.authStore.isRecruiter;
  readonly isInterviewer = this.authStore.isInterviewer;
  readonly isCandidate = this.authStore.isCandidate;

  constructor() {
    this.initializeAuth();
  }

  /**
   * Initialize authentication state from storage
   */
  private initializeAuth(): void {
    const token = this.getAccessToken();
    const userData = this.getUserData();

    if (token && userData) {
      this.authStore.setUser(userData);
      this.authStore.setTokens(token, this.getRefreshToken() || undefined);
      // TODO: Verify token validity with backend
      // this.verifyToken().subscribe();
    }
  }

  /**
   * Login user with credentials
   * TODO: Integrate with Spring Boot backend authentication endpoint
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    this.authStore.setLoading(true);

    // TODO: Replace with actual backend call
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`;

    return this.http.post<AuthResponse>(endpoint, credentials).pipe(
      tap((response) => {
        this.handleAuthSuccess(response);
        this.notificationStore.success('Login successful!');
      }),
      catchError((error) => this.handleAuthError(error)),
      tap(() => this.authStore.setLoading(false))
    );
  }

  /**
   * Logout user
   * TODO: Call backend logout endpoint to invalidate tokens
   */
  logout(): void {
    this.authStore.setLoading(true);

    // TODO: Call backend logout endpoint
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`;

    // For now, just clear local state
    this.clearAuthData();
    this.authStore.clearAuth();
    this.authStore.setLoading(false);
    this.notificationStore.info('You have been logged out');
    this.router.navigate([APP_ROUTES.LOGIN]);

    // TODO: Uncomment when backend is ready
    // this.http.post(endpoint, {}).subscribe({
    //   next: () => {
    //     this.clearAuthData();
    //     this.currentUserSignal.set(null);
    //     this.isAuthenticatedSignal.set(false);
    //     this.router.navigate([APP_ROUTES.LOGIN]);
    //   },
    //   error: () => {
    //     // Clear data even if request fails
    //     this.clearAuthData();
    //     this.currentUserSignal.set(null);
    //     this.isAuthenticatedSignal.set(false);
    //   },
    //   complete: () => this.isLoadingSignal.set(false),
    // });
  }

  /**
   * Refresh access token
   * TODO: Implement token refresh logic with backend
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    // TODO: Implement refresh token endpoint call
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`;

    return this.http.post<AuthResponse>(endpoint, { refreshToken }).pipe(
      tap((response) => {
        this.storeAccessToken(response.accessToken);
        if (response.refreshToken) {
          this.storeRefreshToken(response.refreshToken);
        }
      }),
      catchError((error) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  /**
   * Verify if user has required role
   */
  hasRole(role: UserRole): boolean {
    return this.authStore.hasRole(role);
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: UserRole[]): boolean {
    return this.authStore.hasAnyRole(roles);
  }

  /**
   * Check if user has permission
   */
  hasPermission(permission: string): boolean {
    return this.authStore.hasPermission(permission);
  }

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(authResponse: AuthResponse): void {
    this.storeAccessToken(authResponse.accessToken);
    if (authResponse.refreshToken) {
      this.storeRefreshToken(authResponse.refreshToken);
    }
    this.storeUserData(authResponse.user);

    // Update auth store
    this.authStore.setUser(authResponse.user);
    this.authStore.setTokens(authResponse.accessToken, authResponse.refreshToken);

    // Navigate to role-specific dashboard after successful login
    this.navigateByRole(authResponse.user.role);
  }

  /**
   * Handle authentication error
   */
  private handleAuthError(error: any): Observable<never> {
    console.error('Authentication error:', error);
    this.authStore.setLoading(false);

    let errorMessage: string;

    // Handle different error status codes
    if (error.status === 400 || error.status === 401) {
      // Invalid credentials
      errorMessage = 'Invalid email or password. Please try again.';
    } else if (
      error.status === 500 ||
      error.status === 502 ||
      error.status === 503 ||
      error.status === 504
    ) {
      // Server errors
      errorMessage = 'Server is currently unavailable. Please try again later.';
    } else if (error.status === 0) {
      // Network error
      errorMessage = 'Network error. Please check your connection and try again.';
    } else {
      // Generic error
      errorMessage = error.error?.message || 'An error occurred. Please try again.';
    }

    this.notificationStore.error(errorMessage);
    return throwError(() => ({ message: errorMessage, error }));
  }

  /**
   * Navigate user based on their role
   */
  private navigateByRole(role: UserRole): void {
    switch (role) {
      case UserRole.ADMIN:
        this.router.navigate([APP_ROUTES.DASHBOARD.ADMIN]);
        break;
      case UserRole.RECRUITER:
        this.router.navigate([APP_ROUTES.DASHBOARD.RECRUITER]);
        break;
      case UserRole.INTERVIEWER:
        this.router.navigate([APP_ROUTES.DASHBOARD.INTERVIEWER]);
        break;
      case UserRole.CANDIDATE:
        this.router.navigate([APP_ROUTES.DASHBOARD.CANDIDATE]);
        break;
      default:
        this.router.navigate([APP_ROUTES.HOME]);
    }
  }

  /**
   * Storage methods
   */
  private storeAccessToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  private storeRefreshToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  private storeUserData(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, user.role);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  private getUserData(): User | null {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }

  private clearAuthData(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
  }
}
