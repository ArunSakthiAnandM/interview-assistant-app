import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
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
  createInterview(request: InterviewCreateRequest): Observable<Interview> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.CREATE}`;

    console.log('TODO: Create interview', request);

    return this.http.post<Interview>(endpoint, request).pipe(
      tap((interview) => {
        this.interviewStore.addInterview(interview);
        this.notificationStore.success('Interview created successfully');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get interview by ID
   * TODO: Integrate with Spring Boot backend
   */
  getInterview(id: string): Observable<Interview> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.BY_ID(id)}`;

    console.log('TODO: Get interview', id);

    return this.http.get<Interview>(endpoint).pipe(
      tap((interview) => {
        this.interviewStore.selectInterview(interview);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get interviews by recruiter
   */
  getInterviewsByRecruiter(
    recruiterId: string,
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedResponse<Interview>> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.BY_RECRUITER(recruiterId)}`;

    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    console.log('Get interviews by recruiter', recruiterId);

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
  getInterviewsByCandidate(candidateId: string): Observable<Interview[]> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.BY_CANDIDATE(candidateId)}`;

    console.log('TODO: Get interviews by candidate', candidateId);

    return this.http.get<Interview[]>(endpoint).pipe(
      tap((interviews) => {
        this.interviewStore.setInterviews(interviews);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Update interview status
   * TODO: Integrate with Spring Boot backend
   */
  updateInterviewStatus(id: string, status: InterviewStatus): Observable<Interview> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.UPDATE_STATUS(id)}`;

    console.log('TODO: Update interview status', id, status);

    return this.http.put<Interview>(endpoint, { status }).pipe(
      tap((interview) => {
        this.interviewStore.updateInterview(id, interview);
        this.notificationStore.success('Interview status updated');
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
  ): Observable<Interview> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.SUBMIT_FEEDBACK(
      interviewId
    )}`;

    console.log('TODO: Submit interview feedback', interviewId, feedback);

    return this.http.post<Interview>(endpoint, feedback).pipe(
      tap((interview) => {
        this.interviewStore.updateInterview(interviewId, interview);
        this.notificationStore.success('Feedback submitted successfully');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Generate candidate invite link
   * TODO: Integrate with Spring Boot backend
   */
  generateInviteLink(interviewId: string): Observable<CandidateInviteLink> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.GENERATE_INVITE(
      interviewId
    )}`;

    console.log('TODO: Generate invite link', interviewId);

    return this.http.post<CandidateInviteLink>(endpoint, {}).pipe(
      tap(() => {
        this.notificationStore.success('Invite link generated');
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
  ): Observable<Interview> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.BY_ID(id)}`;

    console.log('TODO: Schedule interview', id, scheduledDate);

    return this.http
      .put<Interview>(endpoint, {
        scheduledDate,
        duration,
        location,
        status: InterviewStatus.SCHEDULED,
      })
      .pipe(
        tap((interview) => {
          this.interviewStore.updateInterview(id, interview);
          this.notificationStore.success('Interview scheduled successfully');
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Cancel interview
   */
  cancelInterview(id: string, reason: string): Observable<Interview> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.BY_ID(id)}`;

    console.log('TODO: Cancel interview', id, reason);

    return this.http
      .put<Interview>(endpoint, {
        status: InterviewStatus.CANCELLED,
        notes: reason,
      })
      .pipe(
        tap((interview) => {
          this.interviewStore.updateInterview(id, interview);
          this.notificationStore.info('Interview cancelled');
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
  ): Observable<Interview> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.BY_ID(interviewId)}`;

    console.log('TODO: Mark candidate outcome', interviewId, outcome);

    return this.http
      .put<Interview>(endpoint, {
        candidateId,
        outcome,
        comments,
      })
      .pipe(
        tap((interview) => {
          this.interviewStore.updateInterview(interviewId, interview);

          const outcomeMessage =
            outcome === InterviewOutcome.SELECTED
              ? 'Candidate selected'
              : outcome === InterviewOutcome.SELECTED_NEXT_ROUND
              ? 'Candidate selected for next round'
              : 'Candidate rejected';

          this.notificationStore.success(outcomeMessage);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Delete interview
   */
  deleteInterview(id: string): Observable<void> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.BY_ID(id)}`;

    console.log('TODO: Delete interview', id);

    return this.http.delete<void>(endpoint).pipe(
      tap(() => {
        this.interviewStore.removeInterview(id);
        this.notificationStore.success('Interview deleted');
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
