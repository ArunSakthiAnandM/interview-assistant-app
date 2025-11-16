package interview.organiser.service;

import interview.organiser.model.dto.request.*;
import interview.organiser.model.dto.response.InterviewResponse;
import interview.organiser.model.dto.response.MessageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for interview operations
 */
public interface InterviewService {

    /**
     * Create a new interview
     */
    InterviewResponse createInterview(InterviewCreateRequest request);

    /**
     * Get interview by ID
     */
    InterviewResponse getInterviewById(String id);

    /**
     * Update interview
     */
    InterviewResponse updateInterview(String id, InterviewCreateRequest request);

    /**
     * Delete interview (soft delete)
     */
    MessageResponse deleteInterview(String id);

    /**
     * Accept interview invitation (candidate)
     */
    MessageResponse acceptInterviewInvitation(String interviewId);

    /**
     * Decline interview invitation (candidate)
     */
    MessageResponse declineInterviewInvitation(String interviewId);

    /**
     * Add/Update round
     */
    InterviewResponse addOrUpdateRound(String interviewId, String roundId, RoundRequest request);

    /**
     * Submit feedback for a round (interviewer)
     */
    MessageResponse submitFeedback(String interviewId, String roundId, FeedbackRequest request);

    /**
     * Make decision on round (recruiter)
     */
    InterviewResponse makeRoundDecision(String interviewId, String roundId, RoundDecisionRequest request);

    /**
     * Get interviews by organisation
     */
    Page<InterviewResponse> getInterviewsByOrganisation(String organisationId, Pageable pageable);

    /**
     * Get interviews created by recruiter
     */
    Page<InterviewResponse> getInterviewsByRecruiter(String recruiterId, Pageable pageable);

    /**
     * Get interviews assigned to interviewer
     */
    Page<InterviewResponse> getInterviewsByInterviewer(String interviewerId, Pageable pageable);

    /**
     * Get interviews for candidate
     */
    Page<InterviewResponse> getInterviewsByCandidate(String candidateId, Pageable pageable);

    /**
     * Cancel interview with reason and notifications
     */
    MessageResponse cancelInterview(String interviewId, String reason);
}
