import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import {
  AdminDashboardResponse,
  OrganisationDashboardResponse,
  RecruiterDashboardResponse,
  InterviewerDashboardResponse,
  CandidateDashboardResponse,
} from '../../models/dashboard.model';

/**
 * Dashboard Service
 *
 * Handles dashboard data retrieval for all user roles.
 * Each role has a dedicated endpoint that returns role-specific metrics and data.
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);

  /**
   * Get admin dashboard data
   * System-wide statistics and recent activity
   */
  getAdminDashboard(): Observable<AdminDashboardResponse> {
    return this.http.get<AdminDashboardResponse>(API_ENDPOINTS.DASHBOARD.ADMIN);
  }

  /**
   * Get organisation dashboard data
   * @param organisationId - Organisation ID
   */
  getOrganisationDashboard(organisationId: string): Observable<OrganisationDashboardResponse> {
    return this.http.get<OrganisationDashboardResponse>(
      API_ENDPOINTS.DASHBOARD.ORGANISATION(organisationId)
    );
  }

  /**
   * Get recruiter dashboard data
   * @param recruiterId - Recruiter user ID
   */
  getRecruiterDashboard(recruiterId: string): Observable<RecruiterDashboardResponse> {
    return this.http.get<RecruiterDashboardResponse>(
      API_ENDPOINTS.DASHBOARD.RECRUITER(recruiterId)
    );
  }

  /**
   * Get interviewer dashboard data
   * @param interviewerId - Interviewer user ID
   */
  getInterviewerDashboard(interviewerId: string): Observable<InterviewerDashboardResponse> {
    return this.http.get<InterviewerDashboardResponse>(
      API_ENDPOINTS.DASHBOARD.INTERVIEWER(interviewerId)
    );
  }

  /**
   * Get candidate dashboard data
   * @param candidateId - Candidate user ID
   */
  getCandidateDashboard(candidateId: string): Observable<CandidateDashboardResponse> {
    return this.http.get<CandidateDashboardResponse>(
      API_ENDPOINTS.DASHBOARD.CANDIDATE(candidateId)
    );
  }
}
