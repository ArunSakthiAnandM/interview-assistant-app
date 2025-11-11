import { Injectable, signal, computed, effect } from '@angular/core';
import { User, UserRole } from '../models';

/**
 * Global Authentication Store
 * Centralized state management for authentication using Angular Signals
 */
@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  // Private writable signals
  private _currentUser = signal<User | null>(null);
  private _isAuthenticated = signal<boolean>(false);
  private _isLoading = signal<boolean>(false);
  private _accessToken = signal<string | null>(null);
  private _refreshToken = signal<string | null>(null);

  // Public readonly signals
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly accessToken = this._accessToken.asReadonly();

  // Computed signals for role-based access
  readonly userRole = computed(() => this._currentUser()?.role);
  readonly isAdmin = computed(() => this._currentUser()?.role === UserRole.ADMIN);
  readonly isRecruiter = computed(() => this._currentUser()?.role === UserRole.RECRUITER);
  readonly isInterviewer = computed(() => this._currentUser()?.role === UserRole.INTERVIEWER);
  readonly isCandidate = computed(() => this._currentUser()?.role === UserRole.CANDIDATE);
  readonly userName = computed(() => {
    const user = this._currentUser();
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email || 'Guest';
  });

  readonly canManageInterviews = computed(() => {
    const role = this._currentUser()?.role;
    return role === UserRole.RECRUITER || role === UserRole.INTERVIEWER;
  });

  /**
   * Set user and authentication state
   */
  setUser(user: User | null): void {
    this._currentUser.set(user);
    this._isAuthenticated.set(!!user);
  }

  /**
   * Set tokens
   */
  setTokens(accessToken: string, refreshToken?: string): void {
    this._accessToken.set(accessToken);
    if (refreshToken) {
      this._refreshToken.set(refreshToken);
    }
  }

  /**
   * Clear authentication state
   */
  clearAuth(): void {
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
    this._accessToken.set(null);
    this._refreshToken.set(null);
  }

  /**
   * Set loading state
   */
  setLoading(isLoading: boolean): void {
    this._isLoading.set(isLoading);
  }

  /**
   * Get refresh token (for internal use)
   */
  getRefreshToken(): string | null {
    return this._refreshToken();
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: UserRole): boolean {
    return this._currentUser()?.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const userRole = this._currentUser()?.role;
    return userRole ? roles.includes(userRole) : false;
  }

  /**
   * Check if user has permission
   */
  hasPermission(permission: string): boolean {
    // TODO: Implement fine-grained permission system
    // For now, use role-based checks
    const role = this._currentUser()?.role;

    switch (permission) {
      case 'manage:recruiters':
        return role === UserRole.RECRUITER;
      case 'manage:interviews':
        return role === UserRole.RECRUITER || role === UserRole.INTERVIEWER;
      case 'view:candidates':
        return role === UserRole.RECRUITER || role === UserRole.INTERVIEWER;
      case 'verify:recruiters':
        return role === UserRole.ADMIN;
      case 'view:analytics':
        return role === UserRole.ADMIN;
      case 'manage:users':
        return role === UserRole.ADMIN;
      default:
        return false;
    }
  }
}
