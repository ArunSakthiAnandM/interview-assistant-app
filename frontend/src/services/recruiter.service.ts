import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RecruiterRegistrationRequest, Recruiter } from '../models';
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
   * Integrate with Spring Boot backend recruiter registration endpoint
   */
  registerRecruiter(request: RecruiterRegistrationRequest): Observable<Recruiter> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.RECRUITER.REGISTER}`;

    console.log('Registering recruiter', request);

    return this.http.post<Recruiter>(endpoint, request).pipe(catchError(this.handleError));
  }

  /**
   * Get recruiter by ID
   */
  getRecruiter(id: string): Observable<Recruiter> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.RECRUITER.BY_ID(id)}`;

    console.log('Get recruiter', id);

    return this.http.get<Recruiter>(endpoint).pipe(catchError(this.handleError));
  }

  /**
   * Verify recruiter (admin action)
   */
  verifyRecruiter(id: string): Observable<Recruiter> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.RECRUITER.VERIFY(id)}`;

    console.log('Verify recruiter', id);

    return this.http.put<Recruiter>(endpoint, {}).pipe(catchError(this.handleError));
  }

  /**
   * Reject recruiter (admin action)
   */
  rejectRecruiter(id: string, reason: string): Observable<Recruiter> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.RECRUITER.REJECT(id)}`;

    console.log('Reject recruiter', id, reason);

    return this.http.put<Recruiter>(endpoint, { reason }).pipe(catchError(this.handleError));
  }

  /**
   * Handle service errors
   */
  private handleError(error: any): Observable<never> {
    console.error('Recruiter Service error:', error);
    throw error;
  }
}
