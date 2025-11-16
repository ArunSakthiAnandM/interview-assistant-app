import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import {
  Organisation,
  RegisterOrganisationDto,
  UpdateOrganisationDto,
  VerifyOrganisationDto,
  VerificationStatus,
  VerificationHistoryEntry,
} from '../../models/organisation.model';
import { PaginatedResponse } from '../../models/common.model';

/**
 * Organisation Service
 *
 * Handles all organisation-related operations including registration,
 * verification, profile management, and administrative functions.
 */
@Injectable({
  providedIn: 'root',
})
export class OrganisationService {
  private http = inject(HttpClient);

  // Current organisation signal (for organisation admins)
  private currentOrganisationSignal = signal<Organisation | null>(null);
  public currentOrganisation = this.currentOrganisationSignal.asReadonly();

  /**
   * Register a new organisation
   */
  register(data: RegisterOrganisationDto): Observable<Organisation> {
    return this.http.post<Organisation>(API_ENDPOINTS.ORGANISATIONS.REGISTER, data);
  }

  /**
   * Get organisation by ID
   */
  getById(id: string): Observable<Organisation> {
    return this.http.get<Organisation>(API_ENDPOINTS.ORGANISATIONS.DETAIL(id)).pipe(
      tap((org) => {
        // Update current organisation if it's the same
        if (this.currentOrganisationSignal()?.id === id) {
          this.currentOrganisationSignal.set(org);
        }
      })
    );
  }

  /**
   * Get current user's organisation profile
   */
  getMyOrganisation(): Observable<Organisation> {
    // TODO: Use correct endpoint when backend provides organisation-specific ME endpoint
    return this.http
      .get<Organisation>(`${API_ENDPOINTS.ORGANISATIONS.BASE}/my`)
      .pipe(tap((org) => this.currentOrganisationSignal.set(org)));
  }

  /**
   * Update organisation profile
   */
  update(id: string, data: UpdateOrganisationDto): Observable<Organisation> {
    return this.http.put<Organisation>(API_ENDPOINTS.ORGANISATIONS.DETAIL(id), data).pipe(
      tap((org) => {
        if (this.currentOrganisationSignal()?.id === id) {
          this.currentOrganisationSignal.set(org);
        }
      })
    );
  }

  /**
   * Get all organisations (Admin only)
   * @param page Page number (0-indexed)
   * @param size Page size
   * @param search Optional search query
   * @param status Optional status filter
   */
  getAll(
    page: number = 0,
    size: number = 20,
    search?: string,
    status?: VerificationStatus
  ): Observable<PaginatedResponse<Organisation>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (search) {
      params = params.set('search', search);
    }
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<PaginatedResponse<Organisation>>(API_ENDPOINTS.ORGANISATIONS.BASE, {
      params,
    });
  }

  /**
   * Submit organisation for verification
   */
  submitForVerification(id: string): Observable<Organisation> {
    return this.http
      .post<Organisation>(`${API_ENDPOINTS.ORGANISATIONS.DETAIL(id)}/submit-verification`, {})
      .pipe(
        tap((org) => {
          if (this.currentOrganisationSignal()?.id === id) {
            this.currentOrganisationSignal.set(org);
          }
        })
      );
  }

  /**
   * Verify organisation (Admin only)
   */
  verify(id: string, request: VerifyOrganisationDto): Observable<Organisation> {
    return this.http.post<Organisation>(API_ENDPOINTS.ORGANISATIONS.VERIFY(id), request);
  }

  /**
   * Reject organisation verification (Admin only)
   */
  reject(id: string, rejectionReason: string): Observable<Organisation> {
    return this.http.post<Organisation>(API_ENDPOINTS.ORGANISATIONS.VERIFY(id), {
      status: VerificationStatus.REJECTED,
      rejectionReason,
    });
  }

  /**
   * Resubmit organisation after rejection
   */
  resubmit(id: string, data: UpdateOrganisationDto): Observable<Organisation> {
    return this.http.put<Organisation>(API_ENDPOINTS.ORGANISATIONS.RESUBMIT(id), data).pipe(
      tap((org) => {
        if (this.currentOrganisationSignal()?.id === id) {
          this.currentOrganisationSignal.set(org);
        }
      })
    );
  }

  /**
   * Get organisation verification history
   */
  getVerificationHistory(id: string): Observable<VerificationHistoryEntry[]> {
    return this.http.get<VerificationHistoryEntry[]>(
      API_ENDPOINTS.ORGANISATIONS.VERIFICATION_HISTORY(id)
    );
  }

  /**
   * Delete organisation (Admin only)
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.ORGANISATIONS.DETAIL(id)).pipe(
      tap(() => {
        if (this.currentOrganisationSignal()?.id === id) {
          this.currentOrganisationSignal.set(null);
        }
      })
    );
  }

  /**
   * Get organisations pending verification (Admin only)
   */
  getPendingVerifications(
    page: number = 0,
    size: number = 20
  ): Observable<PaginatedResponse<Organisation>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('status', VerificationStatus.PENDING);

    return this.http.get<PaginatedResponse<Organisation>>(
      API_ENDPOINTS.ORGANISATIONS.BY_STATUS(VerificationStatus.PENDING),
      { params }
    );
  }

  /**
   * Clear current organisation
   */
  clearCurrentOrganisation(): void {
    this.currentOrganisationSignal.set(null);
  }
}
