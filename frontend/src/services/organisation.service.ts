import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse, OrganisationRegistrationRequest, Organisation } from '../models';
import { API_CONFIG, API_ENDPOINTS } from '../constants';

/**
 * Organisation Service
 * Handles organisation registration, verification, and management
 */
@Injectable({
  providedIn: 'root',
})
export class OrganisationService {
  private http = inject(HttpClient);

  /**
   * Register new organisation
   * TODO: Integrate with Spring Boot backend organisation registration endpoint
   */
  registerOrganisation(
    request: OrganisationRegistrationRequest
  ): Observable<ApiResponse<Organisation>> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.ORGANISATION.REGISTER}`;

    // TODO: Replace with actual backend call
    console.log('TODO: Register organisation', request);

    return this.http
      .post<ApiResponse<Organisation>>(endpoint, request)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get organisation by ID
   * TODO: Integrate with Spring Boot backend
   */
  getOrganisation(id: string): Observable<ApiResponse<Organisation>> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.ORGANISATION.BY_ID(id)}`;

    console.log('TODO: Get organisation', id);

    return this.http.get<ApiResponse<Organisation>>(endpoint).pipe(catchError(this.handleError));
  }

  /**
   * Verify organisation (admin action)
   * TODO: Integrate with Spring Boot backend
   */
  verifyOrganisation(id: string): Observable<ApiResponse<Organisation>> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.ORGANISATION.VERIFY(id)}`;

    console.log('TODO: Verify organisation', id);

    return this.http
      .put<ApiResponse<Organisation>>(endpoint, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * Reject organisation (admin action)
   * TODO: Integrate with Spring Boot backend
   */
  rejectOrganisation(id: string, reason: string): Observable<ApiResponse<Organisation>> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.ORGANISATION.REJECT(id)}`;

    console.log('TODO: Reject organisation', id, reason);

    return this.http
      .put<ApiResponse<Organisation>>(endpoint, { reason })
      .pipe(catchError(this.handleError));
  }

  /**
   * Handle service errors
   */
  private handleError(error: any): Observable<never> {
    console.error('Organisation Service error:', error);
    throw error;
  }
}
