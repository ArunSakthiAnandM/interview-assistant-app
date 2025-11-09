import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CandidateRegistrationRequest, Candidate } from '../models';
import { API_CONFIG, API_ENDPOINTS } from '../constants';

/**
 * Candidate Service
 * Handles candidate registration, profile management, and interview tracking
 */
@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private http = inject(HttpClient);

  /**
   * Register new candidate
   * TODO: Integrate with Spring Boot backend candidate registration endpoint
   */
  registerCandidate(request: CandidateRegistrationRequest): Observable<Candidate> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CANDIDATE.REGISTER}`;

    // TODO: Replace with actual backend call
    console.log('TODO: Register candidate', request);

    return this.http.post<Candidate>(endpoint, request).pipe(catchError(this.handleError));
  }

  /**
   * Get candidate profile
   * TODO: Integrate with Spring Boot backend
   */
  getCandidateProfile(): Observable<Candidate> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CANDIDATE.PROFILE}`;

    console.log('TODO: Get candidate profile');

    return this.http.get<Candidate>(endpoint).pipe(catchError(this.handleError));
  }

  /**
   * Update candidate profile
   * TODO: Integrate with Spring Boot backend
   */
  updateCandidateProfile(candidate: Partial<Candidate>): Observable<Candidate> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CANDIDATE.UPDATE_PROFILE}`;

    console.log('TODO: Update candidate profile', candidate);

    return this.http.put<Candidate>(endpoint, candidate).pipe(catchError(this.handleError));
  }

  /**
   * Get candidate by ID
   * TODO: Integrate with Spring Boot backend
   */
  getCandidate(id: string): Observable<Candidate> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CANDIDATE.BY_ID(id)}`;

    console.log('TODO: Get candidate', id);

    return this.http.get<Candidate>(endpoint).pipe(catchError(this.handleError));
  }

  /**
   * Handle service errors
   */
  private handleError(error: any): Observable<never> {
    console.error('Candidate Service error:', error);
    throw error;
  }
}
