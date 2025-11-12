import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  InterviewerRegistrationRequest,
  Interviewer,
  InterviewerInviteRequest,
  PaginatedInterviewerResponse,
} from '../models';
import { API_CONFIG, API_ENDPOINTS } from '../constants';

/**
 * Interviewer Service
 * Handles interviewer registration, profile management, and interview assignments
 */
@Injectable({
  providedIn: 'root',
})
export class InterviewerService {
  private http = inject(HttpClient);

  /**
   * Register new interviewer
   */
  registerInterviewer(request: InterviewerRegistrationRequest): Observable<Interviewer> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEWER.CREATE}`;
    return this.http.post<Interviewer>(endpoint, request).pipe(catchError(this.handleError));
  }

  /**
   * Get all interviewers with optional filters
   */
  getAllInterviewers(
    expertise?: string,
    available?: boolean,
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedInterviewerResponse> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEWER.BASE}`;

    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (expertise) {
      params = params.set('expertise', expertise);
    }
    if (available !== undefined) {
      params = params.set('available', available.toString());
    }

    return this.http
      .get<PaginatedInterviewerResponse>(endpoint, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get interviewer by ID
   */
  getInterviewer(id: string): Observable<Interviewer> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEWER.BY_ID(id)}`;
    return this.http.get<Interviewer>(endpoint).pipe(catchError(this.handleError));
  }

  /**
   * Update interviewer profile
   */
  updateInterviewer(id: string, interviewer: Partial<Interviewer>): Observable<Interviewer> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEWER.UPDATE(id)}`;
    return this.http.put<Interviewer>(endpoint, interviewer).pipe(catchError(this.handleError));
  }

  /**
   * Get interviewers by recruiter
   */
  getInterviewersByRecruiter(recruiterId: string): Observable<Interviewer[]> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEWER.BASE}`;
    const params = new HttpParams().set('recruiterId', recruiterId);
    return this.http.get<Interviewer[]>(endpoint, { params }).pipe(catchError(this.handleError));
  }

  /**
   * Send interviewer invitation
   */
  inviteInterviewer(request: InterviewerInviteRequest): Observable<any> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEWER.INVITE}`;
    return this.http.post<any>(endpoint, request).pipe(catchError(this.handleError));
  }

  /**
   * Delete interviewer
   */
  deleteInterviewer(id: string): Observable<void> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEWER.DELETE(id)}`;
    return this.http.delete<void>(endpoint).pipe(catchError(this.handleError));
  }

  /**
   * Handle service errors
   */
  private handleError(error: any): Observable<never> {
    console.error('Interviewer Service error:', error);
    throw error;
  }
}
