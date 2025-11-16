package interview.organiser.service.impl;

import interview.organiser.constants.*;
import interview.organiser.exception.InvalidOperationException;
import interview.organiser.exception.ResourceNotFoundException;
import interview.organiser.exception.UnauthorizedException;
import interview.organiser.model.dto.request.*;
import interview.organiser.model.dto.response.InterviewResponse;
import interview.organiser.model.dto.response.MessageResponse;
import interview.organiser.model.entity.*;
import interview.organiser.repository.InterviewRepository;
import interview.organiser.repository.OrganisationRepository;
import interview.organiser.repository.UserRepository;
import interview.organiser.service.InterviewService;
import interview.organiser.service.NotificationService;
import interview.organiser.util.EntityMapper;
import interview.organiser.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Implementation of InterviewService
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class InterviewServiceImpl implements InterviewService {

    private final InterviewRepository interviewRepository;
    private final UserRepository userRepository;
    private final OrganisationRepository organisationRepository;
    private final NotificationService notificationService;
    private final EntityMapper entityMapper;

    @Override
    @Transactional
    public InterviewResponse createInterview(InterviewCreateRequest request) {
        log.info("Creating new interview for position: {}", request.getJobPosition());

        String currentUserId = SecurityUtil.getCurrentUserId();
        User currentUser = userRepository.findByIdAndDeletedFalse(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));

        // Verify user has permission (ORGANISATION_ADMIN or RECRUITER)
        if (currentUser.getRole() != UserRole.ORGANISATION_ADMIN && currentUser.getRole() != UserRole.RECRUITER) {
            throw new UnauthorizedException("Only ORGANISATION_ADMIN or RECRUITER can create interviews");
        }

        // Verify user has an organisation
        if (currentUser.getOrganisationId() == null) {
            throw new InvalidOperationException("You must be associated with an organisation to create interviews");
        }

        // Verify organisation is verified
        Organisation organisation = organisationRepository.findByIdAndDeletedFalse(currentUser.getOrganisationId())
                .orElseThrow(() -> new ResourceNotFoundException("Organisation", "id", currentUser.getOrganisationId()));

        if (organisation.getVerificationStatus() != VerificationStatus.VERIFIED) {
            throw new InvalidOperationException("Organisation must be verified before creating interviews");
        }

        // Check if candidate exists (optional - can invite unregistered candidates)
        User candidateUser = userRepository.findByEmailAndDeletedFalse(request.getCandidateEmail()).orElse(null);

        // Create interview rounds
        List<InterviewRound> rounds = new ArrayList<>();
        for (RoundRequest roundRequest : request.getRounds()) {
            InterviewRound round = InterviewRound.builder()
                    .roundId(UUID.randomUUID().toString())
                    .roundNumber(roundRequest.getRoundNumber())
                    .type(roundRequest.getType())
                    .status(InterviewStatus.SCHEDULED)
                    .scheduledDate(roundRequest.getScheduledDate())
                    .durationMinutes(roundRequest.getDurationMinutes())
                    .interviewerIds(roundRequest.getInterviewerIds())
                    .feedbacks(new ArrayList<>())
                    .createdAt(LocalDateTime.now())
                    .build();
            rounds.add(round);
        }

        // Create interview
        Interview interview = Interview.builder()
                .organisationId(currentUser.getOrganisationId())
                .jobPosition(request.getJobPosition())
                .jobDescription(request.getJobDescription())
                .candidateEmail(request.getCandidateEmail())
                .candidateUserId(candidateUser != null ? candidateUser.getId() : null)
                .candidateStatus(CandidateStatus.INVITED)
                .overallStatus(InterviewStatus.SCHEDULED)
                .rounds(rounds)
                .createdByUserId(currentUserId)
                .createdByName(currentUser.getName())
                .deleted(false)
                .createdAt(LocalDateTime.now())
                .build();

        interview = interviewRepository.save(interview);

        // Send invitation to candidate
        String candidateName = candidateUser != null ? candidateUser.getName() : request.getCandidateEmail();
        notificationService.sendInterviewInvitation(request.getCandidateEmail(), candidateName, interview);

        // Notify interviewers who are assigned
        for (InterviewRound round : rounds) {
            if (round.getInterviewerIds() != null && !round.getInterviewerIds().isEmpty()) {
                for (String interviewerId : round.getInterviewerIds()) {
                    User interviewer = userRepository.findByIdAndDeletedFalse(interviewerId).orElse(null);
                    if (interviewer != null && round.getScheduledDate() != null) {
                        notificationService.sendInterviewerAssignmentNotification(
                                interviewer.getEmail(), interviewer.getName(), interview, round);
                    }
                }
            }
        }

        log.info("Interview created successfully: {}", interview.getId());

        return entityMapper.toInterviewResponse(interview);
    }

    @Override
    public InterviewResponse getInterviewById(String id) {
        log.debug("Fetching interview by ID: {}", id);

        Interview interview = interviewRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview", "id", id));

        return entityMapper.toInterviewResponse(interview);
    }

    @Override
    @Transactional
    public InterviewResponse updateInterview(String id, InterviewCreateRequest request) {
        log.info("Updating interview: {}", id);

        String currentUserId = SecurityUtil.getCurrentUserId();
        User currentUser = userRepository.findByIdAndDeletedFalse(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));

        Interview interview = interviewRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview", "id", id));

        // Check authorization
        if (!interview.getOrganisationId().equals(currentUser.getOrganisationId())) {
            throw new UnauthorizedException("You can only update interviews in your organisation");
        }

        // Check if interview can be updated
        if (interview.getOverallStatus() == InterviewStatus.COMPLETED ||
            interview.getOverallStatus() == InterviewStatus.CANCELLED) {
            throw new InvalidOperationException("Cannot update interview with status: " + interview.getOverallStatus());
        }

        // Update fields
        interview.setJobPosition(request.getJobPosition());
        interview.setJobDescription(request.getJobDescription());
        interview.setUpdatedAt(LocalDateTime.now());
        interview.setUpdatedBy(currentUserId);

        interview = interviewRepository.save(interview);

        log.info("Interview updated successfully: {}", id);

        return entityMapper.toInterviewResponse(interview);
    }

    @Override
    @Transactional
    public MessageResponse deleteInterview(String id) {
        log.info("Deleting interview: {}", id);

        String currentUserId = SecurityUtil.getCurrentUserId();
        User currentUser = userRepository.findByIdAndDeletedFalse(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));

        Interview interview = interviewRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview", "id", id));

        // Check authorization
        String currentRole = SecurityUtil.getCurrentUserRole();
        if (!"ROLE_ADMIN".equals(currentRole) && !interview.getOrganisationId().equals(currentUser.getOrganisationId())) {
            throw new UnauthorizedException("You can only delete interviews in your organisation");
        }

        // Soft delete
        interview.setDeleted(true);
        interview.setUpdatedAt(LocalDateTime.now());
        interview.setUpdatedBy(currentUserId);
        interviewRepository.save(interview);

        log.info("Interview deleted successfully: {}", id);

        return new MessageResponse("Interview deleted successfully");
    }

    @Override
    @Transactional
    public MessageResponse acceptInterviewInvitation(String interviewId) {
        log.info("Accepting interview invitation: {}", interviewId);

        String currentUserId = SecurityUtil.getCurrentUserId();
        User currentUser = userRepository.findByIdAndDeletedFalse(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));

        Interview interview = interviewRepository.findByIdAndDeletedFalse(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview", "id", interviewId));

        // Verify user is the candidate
        if (!interview.getCandidateEmail().equals(currentUser.getEmail())) {
            throw new UnauthorizedException("This interview invitation is not for you");
        }

        // Verify status
        if (interview.getCandidateStatus() != CandidateStatus.INVITED) {
            throw new InvalidOperationException("Interview invitation has already been " +
                    interview.getCandidateStatus().name().toLowerCase());
        }

        // Update status
        interview.setCandidateStatus(CandidateStatus.INVITATION_ACCEPTED);
        interview.setCandidateUserId(currentUserId);
        interview.setUpdatedAt(LocalDateTime.now());
        interviewRepository.save(interview);

        log.info("Interview invitation accepted by: {}", currentUser.getEmail());

        return new MessageResponse("Interview invitation accepted successfully");
    }

    @Override
    @Transactional
    public MessageResponse declineInterviewInvitation(String interviewId) {
        log.info("Declining interview invitation: {}", interviewId);

        String currentUserId = SecurityUtil.getCurrentUserId();
        User currentUser = userRepository.findByIdAndDeletedFalse(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));

        Interview interview = interviewRepository.findByIdAndDeletedFalse(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview", "id", interviewId));

        // Verify user is the candidate
        if (!interview.getCandidateEmail().equals(currentUser.getEmail())) {
            throw new UnauthorizedException("This interview invitation is not for you");
        }

        // Verify status
        if (interview.getCandidateStatus() != CandidateStatus.INVITED) {
            throw new InvalidOperationException("Interview invitation has already been " +
                    interview.getCandidateStatus().name().toLowerCase());
        }

        // Update status
        interview.setCandidateStatus(CandidateStatus.INVITATION_DECLINED);
        interview.setOverallStatus(InterviewStatus.CANCELLED);
        interview.setUpdatedAt(LocalDateTime.now());
        interviewRepository.save(interview);

        log.info("Interview invitation declined by: {}", currentUser.getEmail());

        return new MessageResponse("Interview invitation declined");
    }

    @Override
    @Transactional
    public InterviewResponse addOrUpdateRound(String interviewId, String roundId, RoundRequest request) {
        log.info("Adding/Updating round for interview: {}", interviewId);

        String currentUserId = SecurityUtil.getCurrentUserId();
        User currentUser = userRepository.findByIdAndDeletedFalse(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));

        Interview interview = interviewRepository.findByIdAndDeletedFalse(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview", "id", interviewId));

        // Check authorization
        if (!interview.getOrganisationId().equals(currentUser.getOrganisationId())) {
            throw new UnauthorizedException("You can only manage interviews in your organisation");
        }

        // Check if interview can be updated
        if (interview.getOverallStatus() == InterviewStatus.COMPLETED ||
            interview.getOverallStatus() == InterviewStatus.CANCELLED) {
            throw new InvalidOperationException("Cannot update interview with status: " + interview.getOverallStatus());
        }

        List<InterviewRound> rounds = interview.getRounds();
        InterviewRound targetRound = null;

        if (roundId != null) {
            // Update existing round
            targetRound = rounds.stream()
                    .filter(r -> r.getRoundId().equals(roundId))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Round", "id", roundId));

            targetRound.setType(request.getType());
            targetRound.setScheduledDate(request.getScheduledDate());
            targetRound.setDurationMinutes(request.getDurationMinutes());
            targetRound.setInterviewerIds(request.getInterviewerIds());
            targetRound.setUpdatedAt(LocalDateTime.now());
        } else {
            // Add new round
            targetRound = InterviewRound.builder()
                    .roundId(UUID.randomUUID().toString())
                    .roundNumber(request.getRoundNumber())
                    .type(request.getType())
                    .status(InterviewStatus.SCHEDULED)
                    .scheduledDate(request.getScheduledDate())
                    .durationMinutes(request.getDurationMinutes())
                    .interviewerIds(request.getInterviewerIds())
                    .feedbacks(new ArrayList<>())
                    .createdAt(LocalDateTime.now())
                    .build();
            rounds.add(targetRound);
        }

        interview.setUpdatedAt(LocalDateTime.now());
        interview = interviewRepository.save(interview);

        // Notify interviewers if scheduled
        if (targetRound.getScheduledDate() != null && targetRound.getInterviewerIds() != null) {
            for (String interviewerId : targetRound.getInterviewerIds()) {
                User interviewer = userRepository.findByIdAndDeletedFalse(interviewerId).orElse(null);
                if (interviewer != null) {
                    notificationService.sendInterviewerAssignmentNotification(
                            interviewer.getEmail(), interviewer.getName(), interview, targetRound);
                }
            }

            // Notify candidate about the round
            if (interview.getCandidateUserId() != null) {
                User candidate = userRepository.findByIdAndDeletedFalse(interview.getCandidateUserId()).orElse(null);
                if (candidate != null) {
                    notificationService.sendRoundNotification(
                            candidate.getEmail(), candidate.getName(), interview, targetRound);
                }
            }
        }

        log.info("Round added/updated successfully for interview: {}", interviewId);

        return entityMapper.toInterviewResponse(interview);
    }

    @Override
    @Transactional
    public MessageResponse submitFeedback(String interviewId, String roundId, FeedbackRequest request) {
        log.info("Submitting feedback for interview: {}, round: {}", interviewId, roundId);

        String currentUserId = SecurityUtil.getCurrentUserId();
        User currentUser = userRepository.findByIdAndDeletedFalse(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));

        // Verify user is an interviewer
        if (currentUser.getRole() != UserRole.INTERVIEWER) {
            throw new UnauthorizedException("Only INTERVIEWER can submit feedback");
        }

        Interview interview = interviewRepository.findByIdAndDeletedFalse(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview", "id", interviewId));

        InterviewRound round = interview.getRounds().stream()
                .filter(r -> r.getRoundId().equals(roundId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Round", "id", roundId));

        // Verify interviewer is assigned to this round
        if (round.getInterviewerIds() == null || !round.getInterviewerIds().contains(currentUserId)) {
            throw new UnauthorizedException("You are not assigned to this interview round");
        }

        // Check if feedback already submitted
        boolean alreadySubmitted = round.getFeedbacks().stream()
                .anyMatch(f -> f.getInterviewerId().equals(currentUserId));

        if (alreadySubmitted) {
            throw new InvalidOperationException("You have already submitted feedback for this round");
        }

        // Create feedback
        InterviewerFeedback feedback = InterviewerFeedback.builder()
                .interviewerId(currentUserId)
                .interviewerName(currentUser.getName())
                .recommendation(request.getRecommendation())
                .rating(request.getRating())
                .comments(request.getComments())
                .submittedAt(LocalDateTime.now())
                .build();

        round.getFeedbacks().add(feedback);

        // Check if all interviewers have submitted feedback
        if (round.getFeedbacks().size() == round.getInterviewerIds().size()) {
            round.setStatus(InterviewStatus.COMPLETED);

            // Generate auto recommendation
            String autoRecommendation = generateAutoRecommendation(round.getFeedbacks());
            round.setAutoRecommendation(autoRecommendation);
        }

        round.setUpdatedAt(LocalDateTime.now());
        interview.setUpdatedAt(LocalDateTime.now());
        interviewRepository.save(interview);

        log.info("Feedback submitted successfully by: {}", currentUser.getEmail());

        return new MessageResponse("Feedback submitted successfully");
    }

    @Override
    @Transactional
    public InterviewResponse makeRoundDecision(String interviewId, String roundId, RoundDecisionRequest request) {
        log.info("Making decision for interview: {}, round: {}", interviewId, roundId);

        String currentUserId = SecurityUtil.getCurrentUserId();
        User currentUser = userRepository.findByIdAndDeletedFalse(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));

        // Verify user is RECRUITER or ORGANISATION_ADMIN
        if (currentUser.getRole() != UserRole.RECRUITER && currentUser.getRole() != UserRole.ORGANISATION_ADMIN) {
            throw new UnauthorizedException("Only RECRUITER or ORGANISATION_ADMIN can make decisions");
        }

        Interview interview = interviewRepository.findByIdAndDeletedFalse(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview", "id", interviewId));

        // Check authorization
        if (!interview.getOrganisationId().equals(currentUser.getOrganisationId())) {
            throw new UnauthorizedException("You can only manage interviews in your organisation");
        }

        InterviewRound round = interview.getRounds().stream()
                .filter(r -> r.getRoundId().equals(roundId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Round", "id", roundId));

        // Verify round is completed
        if (round.getStatus() != InterviewStatus.COMPLETED) {
            throw new InvalidOperationException("Round must be completed before making a decision");
        }

        // Validate decision
        String decision = request.getDecision().toUpperCase();
        if (!decision.equals("SELECT_FOR_NEXT_ROUND") && !decision.equals("SELECTED") && !decision.equals("REJECTED")) {
            throw new InvalidOperationException("Invalid decision. Must be SELECT_FOR_NEXT_ROUND, SELECTED, or REJECTED");
        }

        // Set decision
        round.setFinalDecision(decision);
        round.setDecisionBy(currentUserId);
        round.setDecisionAt(LocalDateTime.now());

        // Update candidate status based on decision
        if (decision.equals("SELECT_FOR_NEXT_ROUND")) {
            interview.setCandidateStatus(CandidateStatus.SELECT_FOR_NEXT_ROUND);
        } else if (decision.equals("SELECTED")) {
            interview.setCandidateStatus(CandidateStatus.SELECTED);
            interview.setOverallStatus(InterviewStatus.COMPLETED);
        } else if (decision.equals("REJECTED")) {
            interview.setCandidateStatus(CandidateStatus.REJECTED);
            interview.setOverallStatus(InterviewStatus.COMPLETED);
        }

        interview.setUpdatedAt(LocalDateTime.now());
        interview = interviewRepository.save(interview);

        // Notify candidate about decision
        if (interview.getCandidateUserId() != null) {
            User candidate = userRepository.findByIdAndDeletedFalse(interview.getCandidateUserId()).orElse(null);
            if (candidate != null) {
                notificationService.sendRoundResultNotification(
                        candidate.getEmail(), candidate.getName(), interview, round, decision);
            }
        }

        log.info("Decision made successfully for round: {}", roundId);

        return entityMapper.toInterviewResponse(interview);
    }

    @Override
    public Page<InterviewResponse> getInterviewsByOrganisation(String organisationId, Pageable pageable) {
        log.debug("Fetching interviews by organisation: {}", organisationId);

        return interviewRepository.findByOrganisationIdAndDeletedFalse(organisationId, pageable)
                .map(entityMapper::toInterviewResponse);
    }

    @Override
    public Page<InterviewResponse> getInterviewsByRecruiter(String recruiterId, Pageable pageable) {
        log.debug("Fetching interviews by recruiter: {}", recruiterId);

        return interviewRepository.findByCreatedByUserIdAndDeletedFalse(recruiterId, pageable)
                .map(entityMapper::toInterviewResponse);
    }

    @Override
    public Page<InterviewResponse> getInterviewsByInterviewer(String interviewerId, Pageable pageable) {
        log.debug("Fetching interviews by interviewer: {}", interviewerId);

        return interviewRepository.findByInterviewerId(interviewerId, pageable)
                .map(entityMapper::toInterviewResponse);
    }

    @Override
    public Page<InterviewResponse> getInterviewsByCandidate(String candidateId, Pageable pageable) {
        log.debug("Fetching interviews by candidate: {}", candidateId);

        return interviewRepository.findByCandidateUserIdAndDeletedFalse(candidateId, pageable)
                .map(entityMapper::toInterviewResponse);
    }

    @Override
    public Page<InterviewResponse> searchInterviews(String query, String organisationId,
                                                     String candidateEmail, String status, Pageable pageable) {
        log.debug("Searching interviews with query={}, org={}, candidate={}, status={}",
                query, organisationId, candidateEmail, status);

        // For now, implement basic search. Can be enhanced with more complex queries
        if (organisationId != null && !organisationId.isEmpty()) {
            return interviewRepository.findByOrganisationIdAndDeletedFalse(organisationId, pageable)
                    .map(entityMapper::toInterviewResponse);
        } else if (candidateEmail != null && !candidateEmail.isEmpty()) {
            return interviewRepository.findByCandidateEmailAndDeletedFalse(candidateEmail, pageable)
                    .map(entityMapper::toInterviewResponse);
        } else {
            // Get all interviews if no specific filter
            return interviewRepository.findByDeletedFalse(pageable)
                    .map(entityMapper::toInterviewResponse);
        }
    }

    /**
     * Generate auto recommendation based on interviewer feedback
     */
    private String generateAutoRecommendation(List<InterviewerFeedback> feedbacks) {
        if (feedbacks == null || feedbacks.isEmpty()) {
            return "NO_RECOMMENDATION";
        }

        long strongHireCount = feedbacks.stream()
                .filter(f -> f.getRecommendation() == FeedbackRecommendation.STRONG_HIRE)
                .count();

        long hireCount = feedbacks.stream()
                .filter(f -> f.getRecommendation() == FeedbackRecommendation.HIRE)
                .count();

        long noHireCount = feedbacks.stream()
                .filter(f -> f.getRecommendation() == FeedbackRecommendation.NO_HIRE)
                .count();

        double avgRating = feedbacks.stream()
                .mapToInt(InterviewerFeedback::getRating)
                .average()
                .orElse(0);

        // Decision logic
        if (strongHireCount >= feedbacks.size() / 2.0) {
            return "STRONG_HIRE";
        } else if ((strongHireCount + hireCount) >= feedbacks.size() * 0.7) {
            return "HIRE";
        } else if (noHireCount >= feedbacks.size() / 2.0 || avgRating < 5) {
            return "NO_HIRE";
        } else {
            return "HOLD";
        }
    }

    @Override
    @Transactional
    public MessageResponse cancelInterview(String interviewId, String reason) {
        log.info("Cancelling interview {} with reason: {}", interviewId, reason);

        String currentUserId = SecurityUtil.getCurrentUserId();
        String currentRole = SecurityUtil.getCurrentUserRole();

        Interview interview = interviewRepository.findByIdAndDeletedFalse(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview", "id", interviewId));

        // Verify authorization
        if (!"ROLE_ADMIN".equals(currentRole) &&
            !"ROLE_ORGANISATION_ADMIN".equals(currentRole) &&
            !"ROLE_RECRUITER".equals(currentRole) &&
            !interview.getCreatedByUserId().equals(currentUserId)) {
            throw new UnauthorizedException("You are not authorized to cancel this interview");
        }

        // Update interview status
        interview.setOverallStatus(InterviewStatus.CANCELLED);
        interview.setUpdatedAt(LocalDateTime.now());
        interview.setUpdatedBy(currentUserId);
        interviewRepository.save(interview);

        // Send notifications to all participants
        // Notify candidate
        if (interview.getCandidateUserId() != null) {
            notificationService.createNotification(
                    interview.getCandidateUserId(),
                    NotificationType.INTERVIEW_CANCELLED,
                    "Interview Cancelled",
                    String.format("The interview for %s has been cancelled. Reason: %s",
                            interview.getJobPosition(), reason),
                    interviewId,
                    "INTERVIEW"
            );
        }

        // Notify all interviewers
        if (interview.getRounds() != null) {
            for (InterviewRound round : interview.getRounds()) {
                if (round.getInterviewerIds() != null) {
                    for (String interviewerId : round.getInterviewerIds()) {
                        notificationService.createNotification(
                                interviewerId,
                                NotificationType.INTERVIEW_CANCELLED,
                                "Interview Cancelled",
                                String.format("The interview for %s has been cancelled. Reason: %s",
                                        interview.getJobPosition(), reason),
                                interviewId,
                                "INTERVIEW"
                        );
                    }
                }
            }
        }

        log.info("Interview {} cancelled and notifications sent", interviewId);

        return new MessageResponse("Interview cancelled successfully and all participants have been notified");
    }
}
