package com.interview.organiser.service.impl;

import com.interview.organiser.model.entity.Candidate;
import com.interview.organiser.model.entity.Interview;
import com.interview.organiser.model.entity.Interviewer;
import com.interview.organiser.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Mock implementation of NotificationService.
 * Logs notifications to console instead of sending actual emails/SMS.
 */
@Slf4j
@Service
public class NotificationServiceImpl implements NotificationService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    @Override
    public void sendInterviewerInvitation(String email, String invitationToken, String recruiterName) {
        log.info("📧 [MOCK NOTIFICATION] Sending interviewer invitation");
        log.info("   To: {}", email);
        log.info("   From: Recruiter {}", recruiterName);
        log.info("   Token: {}", invitationToken);
        log.info("   Message: You have been invited to join as an interviewer. Please register using this token.");
    }

    @Override
    public void sendCandidateInvitation(String email, String invitationToken, String interviewDetails) {
        log.info("📧 [MOCK NOTIFICATION] Sending candidate invitation");
        log.info("   To: {}", email);
        log.info("   Token: {}", invitationToken);
        log.info("   Details: {}", interviewDetails);
        log.info("   Message: You have been invited for an interview. Please register to view details.");
    }

    @Override
    public void notifyInterviewScheduled(Candidate candidate, Interview interview) {
        log.info("📧 [MOCK NOTIFICATION] Notifying candidate about scheduled interview");
        log.info("   To: {} {}", candidate.getFirstName(), candidate.getLastName());
        log.info("   Email: {}", candidate.getEmail());
        log.info("   Interview ID: {}", interview.getId());
        log.info("   Scheduled At: {}", interview.getScheduledAt().format(DATE_FORMATTER));
        log.info("   Type: {}", interview.getInterviewType());
        log.info("   Message: Your interview has been scheduled. Please confirm your availability.");
    }

    @Override
    public void notifyInterviewerAssigned(Interviewer interviewer, Interview interview) {
        log.info("📧 [MOCK NOTIFICATION] Notifying interviewer about assigned interview");
        log.info("   To: Interviewer ID {}", interviewer.getId());
        log.info("   Interview ID: {}", interview.getId());
        log.info("   Candidate: {} {}", interview.getCandidate().getFirstName(), interview.getCandidate().getLastName());
        log.info("   Scheduled At: {}", interview.getScheduledAt().format(DATE_FORMATTER));
        log.info("   Message: You have been assigned to conduct an interview.");
    }

    @Override
    public void notifyInterviewConfirmed(Interview interview) {
        log.info("📧 [MOCK NOTIFICATION] Notifying all parties about interview confirmation");
        log.info("   Interview ID: {}", interview.getId());
        log.info("   Candidate: {} {}", interview.getCandidate().getFirstName(), interview.getCandidate().getLastName());
        log.info("   Confirmed At: {}", interview.getCandidateConfirmedAt().format(DATE_FORMATTER));
        log.info("   Message: The candidate has confirmed their availability for the interview.");
    }

    @Override
    public void notifyInterviewCancelled(Interview interview, String reason) {
        log.info("📧 [MOCK NOTIFICATION] Notifying all parties about interview cancellation");
        log.info("   Interview ID: {}", interview.getId());
        log.info("   Reason: {}", reason);
        log.info("   Message: The interview has been cancelled.");
    }

    @Override
    public void requestFeedback(Interviewer interviewer, Interview interview) {
        log.info("📧 [MOCK NOTIFICATION] Requesting feedback from interviewer");
        log.info("   To: Interviewer ID {}", interviewer.getId());
        log.info("   Interview ID: {}", interview.getId());
        log.info("   Candidate: {} {}", interview.getCandidate().getFirstName(), interview.getCandidate().getLastName());
        log.info("   Message: Please provide your feedback for the completed interview.");
    }

    @Override
    public void requestCandidateFeedback(Candidate candidate, Interview interview) {
        log.info("📧 [MOCK NOTIFICATION] Requesting feedback from candidate");
        log.info("   To: {} {}", candidate.getFirstName(), candidate.getLastName());
        log.info("   Email: {}", candidate.getEmail());
        log.info("   Interview ID: {}", interview.getId());
        log.info("   Message: We'd love to hear about your interview experience. Feedback is optional.");
    }

    @Override
    public void notifyCandidateResult(Candidate candidate, Interview interview, String result) {
        log.info("📧 [MOCK NOTIFICATION] Notifying candidate about interview result");
        log.info("   To: {} {}", candidate.getFirstName(), candidate.getLastName());
        log.info("   Email: {}", candidate.getEmail());
        log.info("   Interview ID: {}", interview.getId());
        log.info("   Result: {}", result);
        log.info("   Message: Your interview result has been updated.");
    }

    @Override
    public void notifyRecruiterNewCandidate(String recruiterId, Candidate candidate) {
        log.info("📧 [MOCK NOTIFICATION] Notifying recruiter about new candidate");
        log.info("   To: Recruiter ID {}", recruiterId);
        log.info("   Candidate: {} {}", candidate.getFirstName(), candidate.getLastName());
        log.info("   Email: {}", candidate.getEmail());
        log.info("   Position: {}", candidate.getPosition());
        log.info("   Message: A new candidate has applied.");
    }

    @Override
    public void notifyAdminNewRecruiter(String recruiterName, String recruiterId) {
        log.info("📧 [MOCK NOTIFICATION] Notifying admin about new recruiter");
        log.info("   To: Admin");
        log.info("   Recruiter: {}", recruiterName);
        log.info("   Recruiter ID: {}", recruiterId);
        log.info("   Message: A new recruiter has registered and is pending verification.");
    }

    @Override
    public void notifyRecruiterVerificationStatus(String recruiterEmail, String status, String reason) {
        log.info("📧 [MOCK NOTIFICATION] Notifying recruiter about verification status");
        log.info("   To: {}", recruiterEmail);
        log.info("   Status: {}", status);
        log.info("   Reason: {}", reason);
        log.info("   Message: Your recruiter account verification status has been updated.");
    }

    @Override
    public void notifyNextRoundScheduled(Candidate candidate, Interview nextRoundInterview) {
        log.info("📧 [MOCK NOTIFICATION] Notifying candidate about next round");
        log.info("   To: {} {}", candidate.getFirstName(), candidate.getLastName());
        log.info("   Email: {}", candidate.getEmail());
        log.info("   Next Round Interview ID: {}", nextRoundInterview.getId());
        log.info("   Round: {}", nextRoundInterview.getRound());
        log.info("   Scheduled At: {}", nextRoundInterview.getScheduledAt().format(DATE_FORMATTER));
        log.info("   Message: Congratulations! You have been selected for the next round of interviews.");
    }
}

