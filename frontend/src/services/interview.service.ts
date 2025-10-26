import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  ApiResponse,
  PaginatedResponse,
  Interview,
  InterviewCreateRequest,
  InterviewFeedback,
  InterviewStatus,
  InterviewOutcome,
  CandidateInviteLink,
} from '../models';
import { API_CONFIG, API_ENDPOINTS } from '../constants';
import { InterviewStore } from '../store/interview.store';
import { NotificationStore } from '../store/notification.store';

/**
 * Interview Service
 * Handles interview management, scheduling, and feedback
 */
@Injectable({
  providedIn: 'root',
})
export class InterviewService {
  private http = inject(HttpClient);
  private interviewStore = inject(InterviewStore);
  private notificationStore = inject(NotificationStore);

  /**
   * Create new interview
   * TODO: Integrate with Spring Boot backend
   */
  createInterview(request: InterviewCreateRequest): Observable<ApiResponse<Interview>> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.CREATE}`;

    console.log('TODO: Create interview', request);

    return this.http.post<ApiResponse<Interview>>(endpoint, request).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.interviewStore.addInterview(response.data);
          this.notificationStore.success('Interview created successfully');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get interview by ID
   * TODO: Integrate with Spring Boot backend
   */
  getInterview(id: string): Observable<ApiResponse<Interview>> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.BY_ID(id)}`;

    console.log('TODO: Get interview', id);

    return this.http.get<ApiResponse<Interview>>(endpoint).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.interviewStore.selectInterview(response.data);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get interviews by organisation
   * TODO: Integrate with Spring Boot backend
   */
  getInterviewsByOrganisation(
    orgId: string,
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedResponse<Interview>> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.BY_ORG(orgId)}`;

    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    console.log('TODO: Get interviews by organisation', orgId);

    return this.http.get<PaginatedResponse<Interview>>(endpoint, { params }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.interviewStore.setInterviews(response.data);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get interviews by candidate
   * TODO: Integrate with Spring Boot backend
   */
  getInterviewsByCandidate(candidateId: string): Observable<ApiResponse<Interview[]>> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.BY_CANDIDATE(candidateId)}`;

    console.log('TODO: Get interviews by candidate', candidateId);

    return this.http.get<ApiResponse<Interview[]>>(endpoint).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.interviewStore.setInterviews(response.data);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Update interview status
   * TODO: Integrate with Spring Boot backend
   */
  updateInterviewStatus(id: string, status: InterviewStatus): Observable<ApiResponse<Interview>> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.UPDATE_STATUS(id)}`;

    console.log('TODO: Update interview status', id, status);

    return this.http.put<ApiResponse<Interview>>(endpoint, { status }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.interviewStore.updateInterview(id, response.data);
          this.notificationStore.success('Interview status updated');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Submit interview feedback
   * TODO: Integrate with Spring Boot backend
   */
  submitFeedback(
    interviewId: string,
    feedback: Omit<InterviewFeedback, 'submittedAt'>
  ): Observable<ApiResponse<Interview>> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.SUBMIT_FEEDBACK(
      interviewId
    )}`;

    console.log('TODO: Submit interview feedback', interviewId, feedback);

    return this.http.post<ApiResponse<Interview>>(endpoint, feedback).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.interviewStore.updateInterview(interviewId, response.data);
          this.notificationStore.success('Feedback submitted successfully');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Generate candidate invite link
   * TODO: Integrate with Spring Boot backend
   */
  generateInviteLink(interviewId: string): Observable<ApiResponse<CandidateInviteLink>> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.GENERATE_INVITE(
      interviewId
    )}`;

    console.log('TODO: Generate invite link', interviewId);

    return this.http.post<ApiResponse<CandidateInviteLink>>(endpoint, {}).pipe(
      tap((response) => {
        if (response.success) {
          this.notificationStore.success('Invite link generated');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Schedule interview
   */
  scheduleInterview(
    id: string,
    scheduledDate: Date,
    duration: number,
    location: string
  ): Observable<ApiResponse<Interview>> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.BY_ID(id)}`;

    console.log('TODO: Schedule interview', id, scheduledDate);

    return this.http
      .put<ApiResponse<Interview>>(endpoint, {
        scheduledDate,
        duration,
        location,
        status: InterviewStatus.SCHEDULED,
      })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.interviewStore.updateInterview(id, response.data);
            this.notificationStore.success('Interview scheduled successfully');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Cancel interview
   */
  cancelInterview(id: string, reason: string): Observable<ApiResponse<Interview>> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.BY_ID(id)}`;

    console.log('TODO: Cancel interview', id, reason);

    return this.http
      .put<ApiResponse<Interview>>(endpoint, {
        status: InterviewStatus.CANCELLED,
        notes: reason,
      })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.interviewStore.updateInterview(id, response.data);
            this.notificationStore.info('Interview cancelled');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Mark candidate outcome
   */
  markCandidateOutcome(
    interviewId: string,
    candidateId: string,
    outcome: InterviewOutcome,
    comments?: string
  ): Observable<ApiResponse<Interview>> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.BY_ID(interviewId)}`;

    console.log('TODO: Mark candidate outcome', interviewId, outcome);

    return this.http
      .put<ApiResponse<Interview>>(endpoint, {
        candidateId,
        outcome,
        comments,
      })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.interviewStore.updateInterview(interviewId, response.data);

            const outcomeMessage =
              outcome === InterviewOutcome.SELECTED
                ? 'Candidate selected'
                : outcome === InterviewOutcome.SELECTED_NEXT_ROUND
                ? 'Candidate selected for next round'
                : 'Candidate rejected';

            this.notificationStore.success(outcomeMessage);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Delete interview
   */
  deleteInterview(id: string): Observable<ApiResponse<void>> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.BY_ID(id)}`;

    console.log('TODO: Delete interview', id);

    return this.http.delete<ApiResponse<void>>(endpoint).pipe(
      tap((response) => {
        if (response.success) {
          this.interviewStore.removeInterview(id);
          this.notificationStore.success('Interview deleted');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Handle service errors
   */
  private handleError(error: any): Observable<never> {
    console.error('Interview Service error:', error);
    throw error;
  }
}
