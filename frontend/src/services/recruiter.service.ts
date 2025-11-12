import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  RecruiterRegistrationRequest,
  Recruiter,
  VerificationStatus,
  PaginatedRecruiterResponse,
} from '../models';
import { API_CONFIG, API_ENDPOINTS } from '../constants';

/**
 * Recruiter Service
 * Handles recruiter registration, verification, and management
 */
@Injectable({
  providedIn: 'root',
})
export class RecruiterService {
  private http = inject(HttpClient);

  /**
   * Register new recruiter
   */
  registerRecruiter(request: RecruiterRegistrationRequest): Observable<Recruiter> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.RECRUITER.CREATE}`;
    return this.http.post<Recruiter>(endpoint, request).pipe(catchError(this.handleError));
  }

  /**
   * Get all recruiters with optional filters
   * Supports filtering by status and isActive
   */
  getAllRecruiters(
    status?: VerificationStatus,
    isActive?: boolean,
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedRecruiterResponse> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.RECRUITER.BASE}`;

    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (status) {
      params = params.set('status', status);
    }
    if (isActive !== undefined) {
      params = params.set('isActive', isActive.toString());
    }

    return this.http
      .get<PaginatedRecruiterResponse>(endpoint, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get recruiter by ID
   */
  getRecruiter(id: string): Observable<Recruiter> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.RECRUITER.BY_ID(id)}`;
    return this.http.get<Recruiter>(endpoint).pipe(catchError(this.handleError));
  }

  /**
   * Update recruiter details
   */
  updateRecruiter(id: string, recruiter: Partial<Recruiter>): Observable<Recruiter> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.RECRUITER.UPDATE(id)}`;
    return this.http.put<Recruiter>(endpoint, recruiter).pipe(catchError(this.handleError));
  }

  /**
   * Verify recruiter (admin action)
   */
  verifyRecruiter(id: string): Observable<Recruiter> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.RECRUITER.VERIFY(id)}`;
    return this.http.put<Recruiter>(endpoint, {}).pipe(catchError(this.handleError));
  }

  /**
   * Unverify recruiter (admin action)
   */
  unverifyRecruiter(id: string, reason: string): Observable<Recruiter> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.RECRUITER.UNVERIFY(id)}`;
    const params = new HttpParams().set('reason', reason);
    return this.http.put<Recruiter>(endpoint, {}, { params }).pipe(catchError(this.handleError));
  }

  /**
   * Reject recruiter (admin action)
   */
  rejectRecruiter(id: string, reason: string): Observable<Recruiter> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.RECRUITER.REJECT(id)}`;
    const params = new HttpParams().set('reason', reason);
    return this.http.put<Recruiter>(endpoint, {}, { params }).pipe(catchError(this.handleError));
  }

  /**
   * Delete recruiter
   */
  deleteRecruiter(id: string): Observable<void> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.RECRUITER.DELETE(id)}`;
    return this.http.delete<void>(endpoint).pipe(catchError(this.handleError));
  }

  /**
   * Handle service errors
   */
  private handleError(error: any): Observable<never> {
    console.error('Recruiter Service error:', error);
    throw error;
  }
}
