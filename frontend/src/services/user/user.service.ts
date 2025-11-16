import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { User, UserRole } from '../../models/user.model';
import { PaginatedResponse } from '../../models/common.model';

/**
 * User Service
 *
 * Handles user-related operations including fetching users,
 * updating profiles, and managing user data.
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  // Current user profile signal (separate from auth user)
  private currentProfileSignal = signal<User | null>(null);
  public currentProfile = this.currentProfileSignal.asReadonly();

  /**
   * Get current user profile
   */
  getMe(): Observable<User> {
    return this.http
      .get<User>(API_ENDPOINTS.USERS.ME)
      .pipe(tap((user) => this.currentProfileSignal.set(user)));
  }

  /**
   * Get user by ID
   */
  getById(id: string): Observable<User> {
    return this.http.get<User>(API_ENDPOINTS.USERS.DETAIL(id));
  }

  /**
   * Update user profile
   */
  update(id: string, data: Partial<User>): Observable<User> {
    return this.http.put<User>(API_ENDPOINTS.USERS.DETAIL(id), data).pipe(
      tap((user) => {
        if (this.currentProfileSignal()?.id === id) {
          this.currentProfileSignal.set(user);
        }
      })
    );
  }

  /**
   * Get all users with pagination and filters
   */
  getAll(
    page: number = 0,
    size: number = 20,
    search?: string,
    role?: UserRole,
    organisationId?: string
  ): Observable<PaginatedResponse<User>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (search) {
      params = params.set('search', search);
    }
    if (role) {
      params = params.set('role', role);
    }
    if (organisationId) {
      params = params.set('organisationId', organisationId);
    }

    return this.http.get<PaginatedResponse<User>>(API_ENDPOINTS.USERS.BASE, { params });
  }

  /**
   * Get users by role
   */
  getByRole(
    role: UserRole,
    page: number = 0,
    size: number = 20
  ): Observable<PaginatedResponse<User>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get<PaginatedResponse<User>>(API_ENDPOINTS.USERS.BY_ROLE(role), { params });
  }

  /**
   * Get users by organisation
   */
  getByOrganisation(
    organisationId: string,
    page: number = 0,
    size: number = 20,
    role?: UserRole
  ): Observable<PaginatedResponse<User>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (role) {
      params = params.set('role', role);
    }

    return this.http.get<PaginatedResponse<User>>(
      API_ENDPOINTS.USERS.BY_ORGANISATION(organisationId),
      { params }
    );
  }

  /**
   * Search users
   */
  search(query: string, page: number = 0, size: number = 20): Observable<PaginatedResponse<User>> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<User>>(API_ENDPOINTS.USERS.SEARCH, { params });
  }

  /**
   * Delete user (Admin only)
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.USERS.DETAIL(id)).pipe(
      tap(() => {
        if (this.currentProfileSignal()?.id === id) {
          this.currentProfileSignal.set(null);
        }
      })
    );
  }

  /**
   * Bulk delete users (Admin only)
   */
  bulkDelete(ids: string[]): Observable<void> {
    return this.http.post<void>(API_ENDPOINTS.USERS.BULK_DELETE, { ids });
  }

  /**
   * Clear current profile
   */
  clearCurrentProfile(): void {
    this.currentProfileSignal.set(null);
  }
}
