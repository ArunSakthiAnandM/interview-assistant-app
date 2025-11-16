import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import {
  Interview,
  InterviewStatus,
  CreateInterviewDto,
  CreateRoundDto,
  UpdateRoundDto,
  SubmitFeedbackDto,
  MakeDecisionDto,
} from '../../models/interview.model';
import { PaginatedResponse } from '../../models/common.model';

/**
 * Interview Service
 *
 * Manages interview lifecycle including creation, rounds,
 * feedback submission, and status tracking.
 */
@Injectable({
  providedIn: 'root',
})
export class InterviewService {
  private http = inject(HttpClient);

  // Current interview signal for detail view
  private currentInterviewSignal = signal<Interview | null>(null);
  public currentInterview = this.currentInterviewSignal.asReadonly();

  /**
   * Create new interview
   */
  create(data: CreateInterviewDto): Observable<Interview> {
    return this.http.post<Interview>(API_ENDPOINTS.INTERVIEWS.BASE, data);
  }

  /**
   * Get interview by ID
   */
  getById(id: string): Observable<Interview> {
    return this.http
      .get<Interview>(API_ENDPOINTS.INTERVIEWS.DETAIL(id))
      .pipe(tap((interview) => this.currentInterviewSignal.set(interview)));
  }

  /**
   * Get all interviews with pagination and filters
   */
  getAll(
    page: number = 0,
    size: number = 20,
    status?: InterviewStatus,
    search?: string
  ): Observable<PaginatedResponse<Interview>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (status) {
      params = params.set('status', status);
    }
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<PaginatedResponse<Interview>>(API_ENDPOINTS.INTERVIEWS.BASE, { params });
  }

  /**
   * Get interviews by organisation
   */
  getByOrganisation(
    organisationId: string,
    page: number = 0,
    size: number = 20,
    status?: InterviewStatus
  ): Observable<PaginatedResponse<Interview>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<PaginatedResponse<Interview>>(
      API_ENDPOINTS.INTERVIEWS.BY_ORGANISATION(organisationId),
      { params }
    );
  }

  /**
   * Get interviews by recruiter
   */
  getByRecruiter(
    recruiterId: string,
    page: number = 0,
    size: number = 20,
    status?: InterviewStatus
  ): Observable<PaginatedResponse<Interview>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<PaginatedResponse<Interview>>(
      API_ENDPOINTS.INTERVIEWS.BY_RECRUITER(recruiterId),
      { params }
    );
  }

  /**
   * Get interviews by interviewer
   */
  getByInterviewer(
    interviewerId: string,
    page: number = 0,
    size: number = 20
  ): Observable<PaginatedResponse<Interview>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get<PaginatedResponse<Interview>>(
      API_ENDPOINTS.INTERVIEWS.BY_INTERVIEWER(interviewerId),
      { params }
    );
  }

  /**
   * Get interviews by candidate
   */
  getByCandidate(
    candidateId: string,
    page: number = 0,
    size: number = 20
  ): Observable<PaginatedResponse<Interview>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get<PaginatedResponse<Interview>>(
      API_ENDPOINTS.INTERVIEWS.BY_CANDIDATE(candidateId),
      { params }
    );
  }

  /**
   * Search interviews
   */
  search(
    query: string,
    page: number = 0,
    size: number = 20
  ): Observable<PaginatedResponse<Interview>> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Interview>>(API_ENDPOINTS.INTERVIEWS.SEARCH, { params });
  }

  /**
   * Add round to interview
   */
  addRound(interviewId: string, data: CreateRoundDto): Observable<Interview> {
    return this.http.post<Interview>(API_ENDPOINTS.INTERVIEWS.ROUNDS.ADD(interviewId), data).pipe(
      tap((interview) => {
        if (this.currentInterviewSignal()?.id === interviewId) {
          this.currentInterviewSignal.set(interview);
        }
      })
    );
  }

  /**
   * Update round details
   */
  updateRound(interviewId: string, roundId: string, data: UpdateRoundDto): Observable<Interview> {
    return this.http
      .put<Interview>(API_ENDPOINTS.INTERVIEWS.ROUNDS.UPDATE(interviewId, roundId), data)
      .pipe(
        tap((interview) => {
          if (this.currentInterviewSignal()?.id === interviewId) {
            this.currentInterviewSignal.set(interview);
          }
        })
      );
  }

  /**
   * Submit feedback for round
   */
  submitFeedback(
    interviewId: string,
    roundId: string,
    data: SubmitFeedbackDto
  ): Observable<Interview> {
    return this.http
      .post<Interview>(API_ENDPOINTS.INTERVIEWS.ROUNDS.FEEDBACK(interviewId, roundId), data)
      .pipe(
        tap((interview) => {
          if (this.currentInterviewSignal()?.id === interviewId) {
            this.currentInterviewSignal.set(interview);
          }
        })
      );
  }

  /**
   * Submit final decision for round
   */
  submitDecision(
    interviewId: string,
    roundId: string,
    data: MakeDecisionDto
  ): Observable<Interview> {
    return this.http
      .post<Interview>(API_ENDPOINTS.INTERVIEWS.ROUNDS.DECISION(interviewId, roundId), data)
      .pipe(
        tap((interview) => {
          if (this.currentInterviewSignal()?.id === interviewId) {
            this.currentInterviewSignal.set(interview);
          }
        })
      );
  }

  /**
   * Accept interview invitation
   */
  accept(id: string): Observable<Interview> {
    return this.http.post<Interview>(API_ENDPOINTS.INTERVIEWS.ACCEPT(id), {}).pipe(
      tap((interview) => {
        if (this.currentInterviewSignal()?.id === id) {
          this.currentInterviewSignal.set(interview);
        }
      })
    );
  }

  /**
   * Decline interview invitation
   */
  decline(id: string, reason?: string): Observable<Interview> {
    return this.http.post<Interview>(API_ENDPOINTS.INTERVIEWS.DECLINE(id), { reason }).pipe(
      tap((interview) => {
        if (this.currentInterviewSignal()?.id === id) {
          this.currentInterviewSignal.set(interview);
        }
      })
    );
  }

  /**
   * Cancel interview
   */
  cancel(id: string, reason?: string): Observable<Interview> {
    return this.http.post<Interview>(API_ENDPOINTS.INTERVIEWS.CANCEL(id), { reason }).pipe(
      tap((interview) => {
        if (this.currentInterviewSignal()?.id === id) {
          this.currentInterviewSignal.set(interview);
        }
      })
    );
  }

  /**
   * Get feedback history for interview
   */
  getFeedbackHistory(id: string): Observable<any[]> {
    return this.http.get<any[]>(API_ENDPOINTS.INTERVIEWS.FEEDBACK_HISTORY(id));
  }

  /**
   * Clear current interview
   */
  clearCurrentInterview(): void {
    this.currentInterviewSignal.set(null);
  }
}
