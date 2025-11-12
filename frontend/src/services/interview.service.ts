import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  Interview,
  InterviewCreateRequest,
  InterviewStatus,
  PaginatedInterviewResponse,
  InterviewConfirmRequest,
  InterviewResultRequest,
  NextRoundInterviewRequest,
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
   */
  createInterview(request: InterviewCreateRequest): Observable<Interview> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.CREATE}`;
    return this.http.post<Interview>(endpoint, request).pipe(
      tap((interview) => {
        this.interviewStore.addInterview(interview);
        this.notificationStore.success('Interview created successfully');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get all interviews with optional filters
   */
  getAllInterviews(
    status?: InterviewStatus,
    candidateId?: string,
    interviewerId?: string,
    fromDate?: string,
    toDate?: string,
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedInterviewResponse> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.BASE}`;

    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (status) params = params.set('status', status);
    if (candidateId) params = params.set('candidateId', candidateId);
    if (interviewerId) params = params.set('interviewerId', interviewerId);
    if (fromDate) params = params.set('fromDate', fromDate);
    if (toDate) params = params.set('toDate', toDate);

    return this.http
      .get<PaginatedInterviewResponse>(endpoint, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get interview by ID
   */
  getInterview(id: string): Observable<Interview> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.BY_ID(id)}`;
    return this.http.get<Interview>(endpoint).pipe(
      tap((interview) => {
        this.interviewStore.selectInterview(interview);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Update interview
   */
  updateInterview(id: string, interview: Partial<Interview>): Observable<Interview> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.UPDATE(id)}`;
    return this.http.put<Interview>(endpoint, interview).pipe(
      tap((updated) => {
        this.interviewStore.updateInterview(id, updated);
        this.notificationStore.success('Interview updated successfully');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Update interview status
   */
  updateInterviewStatus(
    id: string,
    status: InterviewStatus,
    reason?: string
  ): Observable<Interview> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.UPDATE_STATUS(id)}`;
    const body = reason ? { status, reason } : { status };
    return this.http.patch<Interview>(endpoint, body).pipe(
      tap((interview) => {
        this.interviewStore.updateInterview(id, interview);
        this.notificationStore.success('Interview status updated');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Confirm interview (Candidate)
   */
  confirmInterview(request: InterviewConfirmRequest): Observable<Interview> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.CONFIRM(
      request.interviewId
    )}`;
    return this.http.post<Interview>(endpoint, request).pipe(
      tap((interview) => {
        this.interviewStore.updateInterview(request.interviewId, interview);
        this.notificationStore.success('Interview confirmed');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Mark interview result
   */
  markInterviewResult(request: InterviewResultRequest): Observable<Interview> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.RESULT(request.interviewId)}`;
    return this.http.post<Interview>(endpoint, request).pipe(
      tap((interview) => {
        this.interviewStore.updateInterview(request.interviewId, interview);
        const message =
          request.result === 'SELECTED'
            ? 'Candidate selected'
            : request.result === 'NEXT_ROUND'
            ? 'Candidate selected for next round'
            : 'Candidate rejected';
        this.notificationStore.success(message);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Create next round interview
   */
  createNextRoundInterview(request: NextRoundInterviewRequest): Observable<Interview> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.NEXT_ROUND(
      request.previousInterviewId
    )}`;
    return this.http.post<Interview>(endpoint, request).pipe(
      tap((interview) => {
        this.interviewStore.addInterview(interview);
        this.notificationStore.success('Next round interview created');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Request feedback for interview
   */
  requestFeedback(interviewId: string): Observable<any> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.REQUEST_FEEDBACK(
      interviewId
    )}`;
    return this.http.post<any>(endpoint, {}).pipe(
      tap(() => {
        this.notificationStore.success('Feedback request sent');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Submit interview feedback
   */
  submitFeedback(feedback: any): Observable<any> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.FEEDBACK.CREATE}`;
    return this.http.post<any>(endpoint, feedback).pipe(
      tap(() => {
        this.notificationStore.success('Feedback submitted successfully');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get feedback for interview
   */
  getFeedbackForInterview(interviewId: string): Observable<any[]> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.FEEDBACK.BASE}`;
    const params = new HttpParams().set('interviewId', interviewId);
    return this.http.get<any[]>(endpoint, { params }).pipe(catchError(this.handleError));
  }

  /**
   * Cancel interview
   */
  cancelInterview(id: string): Observable<void> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEW.CANCEL(id)}`;
    return this.http.delete<void>(endpoint).pipe(
      tap(() => {
        this.interviewStore.removeInterview(id);
        this.notificationStore.info('Interview cancelled');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Handle service errors
   */
  private handleError(error: any): Observable<never> {
    console.error('Interview Service error:', error);
    const message = error.error?.message || 'An error occurred';
    this.notificationStore.error(message);
    throw error;
  }
}
