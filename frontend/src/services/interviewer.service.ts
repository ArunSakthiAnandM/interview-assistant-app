import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterviewerRegistrationRequest, Interviewer } from '../models';
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
   * TODO: Integrate with Spring Boot backend interviewer registration endpoint
   */
  registerInterviewer(request: InterviewerRegistrationRequest): Observable<Interviewer> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEWER.REGISTER}`;

    // TODO: Replace with actual backend call
    console.log('TODO: Register interviewer', request);

    return this.http.post<Interviewer>(endpoint, request).pipe(catchError(this.handleError));
  }

  /**
   * Get interviewer by ID
   * TODO: Integrate with Spring Boot backend
   */
  getInterviewer(id: string): Observable<Interviewer> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEWER.BY_ID(id)}`;

    console.log('TODO: Get interviewer', id);

    return this.http.get<Interviewer>(endpoint).pipe(catchError(this.handleError));
  }

  /**
   * Get interviewers by recruiter
   */
  getInterviewersByRecruiter(recruiterId: string): Observable<Interviewer[]> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEWER.BY_RECRUITER(recruiterId)}`;

    console.log('Get interviewers by recruiter', recruiterId);

    return this.http.get<Interviewer[]>(endpoint).pipe(catchError(this.handleError));
  }

  /**
   * Send interviewer invitation
   * TODO: Integrate with Spring Boot backend
   */
  sendInterviewerInvite(email: string, firstName: string, lastName: string): Observable<any> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEWER.INVITE}`;

    console.log('TODO: Send interviewer invite', email);

    return this.http
      .post<any>(endpoint, { email, firstName, lastName })
      .pipe(catchError(this.handleError));
  }

  /**
   * Handle service errors
   */
  private handleError(error: any): Observable<never> {
    console.error('Interviewer Service error:', error);
    throw error;
  }
}
