import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  CandidateRegistrationRequest,
  Candidate,
  CandidateStatus,
  CandidateInviteRequest,
  InvitationResponseRequest,
  PaginatedCandidateResponse,
} from '../models';
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
   */
  registerCandidate(request: CandidateRegistrationRequest): Observable<Candidate> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CANDIDATE.CREATE}`;
    return this.http.post<Candidate>(endpoint, request).pipe(catchError(this.handleError));
  }

  /**
   * Get all candidates with optional filters
   */
  getAllCandidates(
    status?: CandidateStatus,
    search?: string,
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedCandidateResponse> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CANDIDATE.BASE}`;

    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (status) {
      params = params.set('status', status);
    }
    if (search) {
      params = params.set('search', search);
    }

    return this.http
      .get<PaginatedCandidateResponse>(endpoint, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get candidate profile
   */
  getCandidateProfile(candidateId: string): Observable<Candidate> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CANDIDATE.BY_ID(candidateId)}`;
    return this.http.get<Candidate>(endpoint).pipe(catchError(this.handleError));
  }

  /**
   * Update candidate profile
   */
  updateCandidateProfile(
    candidateId: string,
    candidate: Partial<Candidate>
  ): Observable<Candidate> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CANDIDATE.UPDATE(candidateId)}`;
    return this.http.put<Candidate>(endpoint, candidate).pipe(catchError(this.handleError));
  }

  /**
   * Get candidate by ID
   */
  getCandidate(id: string): Observable<Candidate> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CANDIDATE.BY_ID(id)}`;
    return this.http.get<Candidate>(endpoint).pipe(catchError(this.handleError));
  }

  /**
   * Invite candidate
   */
  inviteCandidate(request: CandidateInviteRequest): Observable<any> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CANDIDATE.INVITE}`;
    return this.http.post<any>(endpoint, request).pipe(catchError(this.handleError));
  }

  /**
   * Respond to invitation
   */
  respondToInvitation(request: InvitationResponseRequest): Observable<any> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CANDIDATE.INVITATION_RESPOND}`;
    return this.http.post<any>(endpoint, request).pipe(catchError(this.handleError));
  }

  /**
   * Delete candidate
   */
  deleteCandidate(id: string): Observable<void> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CANDIDATE.DELETE(id)}`;
    return this.http.delete<void>(endpoint).pipe(catchError(this.handleError));
  }

  /**
   * Handle service errors
   */
  private handleError(error: any): Observable<never> {
    console.error('Candidate Service error:', error);
    throw error;
  }
}
