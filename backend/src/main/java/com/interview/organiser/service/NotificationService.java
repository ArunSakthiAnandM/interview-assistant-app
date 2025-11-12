package com.interview.organiser.service;

import com.interview.organiser.model.entity.Candidate;
import com.interview.organiser.model.entity.Interview;
import com.interview.organiser.model.entity.Interviewer;

import java.util.List;

/**
 * Service interface for handling all notification operations.
 * This is a mock service that logs notifications instead of sending actual emails/SMS.
 */
public interface NotificationService {

    /**
     * Send invitation to interviewer to register and join the platform
     */
    void sendInterviewerInvitation(String email, String invitationToken, String recruiterName);

    /**
     * Send invitation to candidate for interview
     */
    void sendCandidateInvitation(String email, String invitationToken, String interviewDetails);

    /**
     * Notify candidate about scheduled interview
     */
    void notifyInterviewScheduled(Candidate candidate, Interview interview);

    /**
     * Notify interviewer about assigned interview
     */
    void notifyInterviewerAssigned(Interviewer interviewer, Interview interview);

    /**
     * Notify all parties when interview is confirmed by candidate
     */
    void notifyInterviewConfirmed(Interview interview);

    /**
     * Notify all parties when interview is cancelled
     */
    void notifyInterviewCancelled(Interview interview, String reason);

    /**
     * Request feedback from interviewer after interview completion
     */
    void requestFeedback(Interviewer interviewer, Interview interview);

    /**
     * Request feedback from candidate after interview completion
     */
    void requestCandidateFeedback(Candidate candidate, Interview interview);

    /**
     * Notify candidate about interview result
     */
    void notifyCandidateResult(Candidate candidate, Interview interview, String result);

    /**
     * Notify recruiter about new candidate application
     */
    void notifyRecruiterNewCandidate(String recruiterId, Candidate candidate);

    /**
     * Notify admin about new recruiter registration
     */
    void notifyAdminNewRecruiter(String recruiterName, String recruiterId);

    /**
     * Notify recruiter about verification status change
     */
    void notifyRecruiterVerificationStatus(String recruiterEmail, String status, String reason);

    /**
     * Notify about next round interview creation
     */
    void notifyNextRoundScheduled(Candidate candidate, Interview nextRoundInterview);
}

