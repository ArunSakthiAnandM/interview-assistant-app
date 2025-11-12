import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  AdminDashboardStats,
  RecruiterDashboardStats,
  InterviewerDashboardStats,
  CandidateDashboardStats,
} from '../models';
import { API_CONFIG, API_ENDPOINTS } from '../constants';

/**
 * Dashboard Service
 * Handles fetching dashboard statistics for all roles
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);

  /**
   * Get admin dashboard data
   */
  getAdminDashboard(): Observable<AdminDashboardStats> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.DASHBOARD.ADMIN}`;
    return this.http.get<AdminDashboardStats>(endpoint).pipe(catchError(this.handleError));
  }

  /**
   * Get recruiter dashboard data
   */
  getRecruiterDashboard(recruiterId: string): Observable<RecruiterDashboardStats> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.DASHBOARD.RECRUITER(recruiterId)}`;
    return this.http.get<RecruiterDashboardStats>(endpoint).pipe(catchError(this.handleError));
  }

  /**
   * Get interviewer dashboard data
   */
  getInterviewerDashboard(interviewerId: string): Observable<InterviewerDashboardStats> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.DASHBOARD.INTERVIEWER(interviewerId)}`;
    return this.http.get<InterviewerDashboardStats>(endpoint).pipe(catchError(this.handleError));
  }

  /**
   * Get candidate dashboard data
   */
  getCandidateDashboard(candidateId: string): Observable<CandidateDashboardStats> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.DASHBOARD.CANDIDATE(candidateId)}`;
    return this.http.get<CandidateDashboardStats>(endpoint).pipe(catchError(this.handleError));
  }

  /**
   * Handle service errors
   */
  private handleError(error: any): Observable<never> {
    console.error('Dashboard Service error:', error);
    throw error;
  }
}
