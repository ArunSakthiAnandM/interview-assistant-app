import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import {
  LoginDto,
  AuthResponse,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../../models/auth.model';
import { User, UserRole, RegisterUserDto } from '../../models/user.model';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { ROUTES } from '../../constants/routes';
import { STORAGE_KEYS } from '../../constants/app-config';

/**
 * Authentication Service
 *
 * Responsibilities:
 * 1. User authentication (login, logout, token refresh)
 * 2. User registration
 * 3. Password recovery
 * 4. Auth state management using signals
 * 5. Token storage and retrieval
 * 6. Role-based access control
 *
 * @Injectable
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Signals for reactive state management
  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);
  private isLoadingSignal = signal<boolean>(false);

  // Computed signals
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly userRole = computed(() => this.currentUserSignal()?.role ?? null);
  readonly userName = computed(() => this.currentUserSignal()?.name ?? '');
  readonly userEmail = computed(() => this.currentUserSignal()?.email ?? '');

  constructor() {
    // Initialize auth state from localStorage on service creation
    this.initializeAuthState();
  }

  /**
   * Initialize authentication state from stored tokens
   */
  private initializeAuthState(): void {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (storedUser && accessToken) {
      try {
        const user: User = JSON.parse(storedUser);
        this.currentUserSignal.set(user);
        this.isAuthenticatedSignal.set(true);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        this.clearAuthState();
      }
    }
  }

  /**
   * Register a new user
   */
  register(dto: RegisterUserDto): Observable<User> {
    this.isLoadingSignal.set(true);

    return this.http.post<User>(API_ENDPOINTS.USERS.REGISTER, dto).pipe(
      tap(() => {
        this.isLoadingSignal.set(false);
      }),
      catchError((error) => {
        this.isLoadingSignal.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Login user with credentials
   */
  login(dto: LoginDto): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);

    return this.http.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, dto).pipe(
      tap((response) => {
        this.handleAuthSuccess(response);
        this.navigateToRoleDashboard(response.user.role);
      }),
      catchError((error) => {
        this.isLoadingSignal.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout user and clear auth state
   */
  logout(): Observable<void> {
    return this.http.post<void>(API_ENDPOINTS.AUTH.LOGOUT, {}).pipe(
      tap(() => {
        this.clearAuthState();
        this.router.navigate([ROUTES.LOGIN]);
      }),
      catchError((error) => {
        // Even if API call fails, clear local auth state
        this.clearAuthState();
        this.router.navigate([ROUTES.LOGIN]);
        return throwError(() => error);
      })
    );
  }

  /**
   * Refresh access token using refresh token
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (!refreshToken) {
      this.clearAuthState();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken }).pipe(
      tap((response) => {
        this.storeTokens(response);
      }),
      catchError((error) => {
        this.clearAuthState();
        this.router.navigate([ROUTES.LOGIN]);
        return throwError(() => error);
      })
    );
  }

  /**
   * Request password reset email
   */
  forgotPassword(dto: ForgotPasswordDto): Observable<void> {
    return this.http.post<void>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, dto);
  }

  /**
   * Reset password with token
   */
  resetPassword(dto: ResetPasswordDto): Observable<void> {
    return this.http.post<void>(API_ENDPOINTS.AUTH.RESET_PASSWORD, dto).pipe(
      tap(() => {
        this.router.navigate([ROUTES.LOGIN]);
      })
    );
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: UserRole): boolean {
    return this.userRole() === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const currentRole = this.userRole();
    return currentRole ? roles.includes(currentRole) : false;
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  /**
   * Check if user is organisation admin
   */
  isOrganisationAdmin(): boolean {
    return this.hasRole(UserRole.ORGANISATION_ADMIN);
  }

  /**
   * Check if user is recruiter
   */
  isRecruiter(): boolean {
    return this.hasRole(UserRole.RECRUITER);
  }

  /**
   * Check if user is interviewer
   */
  isInterviewer(): boolean {
    return this.hasRole(UserRole.INTERVIEWER);
  }

  /**
   * Check if user is candidate
   */
  isCandidate(): boolean {
    return this.hasRole(UserRole.CANDIDATE);
  }

  /**
   * Get access token from storage
   */
  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Get refresh token from storage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(response: AuthResponse): void {
    this.storeTokens(response);
    this.currentUserSignal.set(response.user);
    this.isAuthenticatedSignal.set(true);
    this.isLoadingSignal.set(false);

    // Store user data
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
  }

  /**
   * Store authentication tokens
   */
  private storeTokens(response: AuthResponse): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
  }

  /**
   * Clear authentication state and storage
   */
  private clearAuthState(): void {
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    this.isLoadingSignal.set(false);

    // Clear local storage
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  /**
   * Navigate to appropriate dashboard based on user role
   */
  private navigateToRoleDashboard(role: UserRole): void {
    switch (role) {
      case UserRole.ADMIN:
        this.router.navigate([ROUTES.ADMIN.DASHBOARD]);
        break;
      case UserRole.ORGANISATION_ADMIN:
        this.router.navigate([ROUTES.ORGANISATION.DASHBOARD]);
        break;
      case UserRole.RECRUITER:
        this.router.navigate([ROUTES.RECRUITER.DASHBOARD]);
        break;
      case UserRole.INTERVIEWER:
        this.router.navigate([ROUTES.INTERVIEWER.DASHBOARD]);
        break;
      case UserRole.CANDIDATE:
        this.router.navigate([ROUTES.CANDIDATE.DASHBOARD]);
        break;
      default:
        this.router.navigate([ROUTES.HOME]);
    }
  }
}
