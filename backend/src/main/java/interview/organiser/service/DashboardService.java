package interview.organiser.service;

import interview.organiser.model.dto.response.*;

/**
 * Service interface for dashboard operations
 */
public interface DashboardService {

    /**
     * Get admin dashboard
     */
    AdminDashboardResponse getAdminDashboard();

    /**
     * Get organisation dashboard
     */
    OrganisationDashboardResponse getOrganisationDashboard(String organisationId);

    /**
     * Get recruiter dashboard
     */
    RecruiterDashboardResponse getRecruiterDashboard(String recruiterId);

    /**
     * Get interviewer dashboard
     */
    InterviewerDashboardResponse getInterviewerDashboard(String interviewerId);

    /**
     * Get candidate dashboard
     */
    CandidateDashboardResponse getCandidateDashboard(String candidateId);
}
