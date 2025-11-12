package com.interview.organiser.service;

import com.interview.organiser.model.dto.response.AdminDashboardResponse;
import com.interview.organiser.model.dto.response.CandidateDashboardResponse;
import com.interview.organiser.model.dto.response.InterviewerDashboardResponse;
import com.interview.organiser.model.dto.response.RecruiterDashboardResponse;

/**
 * Service interface for dashboard operations across all user roles
 */
public interface DashboardService {

    /**
     * Get admin dashboard with system-wide statistics
     */
    AdminDashboardResponse getAdminDashboard();

    /**
     * Get recruiter dashboard with recruiter-specific data
     */
    RecruiterDashboardResponse getRecruiterDashboard(String recruiterId);

    /**
     * Get interviewer dashboard with assigned interviews
     */
    InterviewerDashboardResponse getInterviewerDashboard(String interviewerId);

    /**
     * Get candidate dashboard with interview schedule
     */
    CandidateDashboardResponse getCandidateDashboard(String candidateId);
}

