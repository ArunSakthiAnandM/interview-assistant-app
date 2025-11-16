package interview.organiser.service.impl;

import interview.organiser.constants.CandidateStatus;
import interview.organiser.constants.InterviewStatus;
import interview.organiser.constants.UserRole;
import interview.organiser.constants.VerificationStatus;
import interview.organiser.exception.ResourceNotFoundException;
import interview.organiser.exception.UnauthorizedException;
import interview.organiser.model.dto.response.*;
import interview.organiser.model.entity.Interview;
import interview.organiser.model.entity.InterviewRound;
import interview.organiser.model.entity.User;
import interview.organiser.repository.InterviewRepository;
import interview.organiser.repository.OrganisationRepository;
import interview.organiser.repository.UserRepository;
import interview.organiser.service.DashboardService;
import interview.organiser.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Implementation of DashboardService
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final OrganisationRepository organisationRepository;
    private final InterviewRepository interviewRepository;

    @Override
    public AdminDashboardResponse getAdminDashboard() {
        log.debug("Fetching admin dashboard");

        String currentRole = SecurityUtil.getCurrentUserRole();
        if (!"ROLE_ADMIN".equals(currentRole)) {
            throw new UnauthorizedException("Only ADMIN can access admin dashboard");
        }

        Long totalOrganisations = organisationRepository.countByDeletedFalse();
        Long verifiedOrganisations = organisationRepository.countByVerificationStatusAndDeletedFalse(VerificationStatus.VERIFIED);
        Long pendingVerifications = organisationRepository.countByVerificationStatusAndDeletedFalse(VerificationStatus.PENDING);
        Long rejectedOrganisations = organisationRepository.countByVerificationStatusAndDeletedFalse(VerificationStatus.REJECTED);

        // Count users by role
        Map<String, Long> usersByRole = new HashMap<>();
        for (UserRole role : UserRole.values()) {
            Long count = userRepository.countByRoleAndDeletedFalse(role);
            usersByRole.put(role.name(), count);
        }

        Long totalUsers = usersByRole.values().stream().mapToLong(Long::longValue).sum();

        // Count interviews by status
        Long totalInterviews = interviewRepository.count();
        Map<String, Long> interviewsByStatus = new HashMap<>();
        for (InterviewStatus status : InterviewStatus.values()) {
            Long count = interviewRepository.findAll().stream()
                    .filter(i -> !i.getDeleted() && i.getOverallStatus() == status)
                    .count();
            interviewsByStatus.put(status.name(), count);
        }

        return AdminDashboardResponse.builder()
                .totalOrganisations(totalOrganisations)
                .verifiedOrganisations(verifiedOrganisations)
                .pendingVerifications(pendingVerifications)
                .rejectedOrganisations(rejectedOrganisations)
                .totalUsers(totalUsers)
                .usersByRole(usersByRole)
                .totalInterviews(totalInterviews)
                .interviewsByStatus(interviewsByStatus)
                .build();
    }

    @Override
    public OrganisationDashboardResponse getOrganisationDashboard(String organisationId) {
        log.debug("Fetching organisation dashboard for: {}", organisationId);

        String currentUserId = SecurityUtil.getCurrentUserId();
        User currentUser = userRepository.findByIdAndDeletedFalse(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));

        // Verify authorization
        String currentRole = SecurityUtil.getCurrentUserRole();
        if (!"ROLE_ADMIN".equals(currentRole) && !organisationId.equals(currentUser.getOrganisationId())) {
            throw new UnauthorizedException("You can only view dashboard for your own organisation");
        }

        var organisation = organisationRepository.findByIdAndDeletedFalse(organisationId)
                .orElseThrow(() -> new ResourceNotFoundException("Organisation", "id", organisationId));

        Long totalRecruiters = userRepository.countByOrganisationIdAndRoleAndDeletedFalse(organisationId, UserRole.RECRUITER);
        Long totalInterviewers = userRepository.countByOrganisationIdAndRoleAndDeletedFalse(organisationId, UserRole.INTERVIEWER);
        Long totalInterviews = interviewRepository.countByOrganisationIdAndDeletedFalse(organisationId);

        // Count interviews by status
        Map<String, Long> interviewsByStatus = new HashMap<>();
        for (InterviewStatus status : InterviewStatus.values()) {
            Long count = interviewRepository.findByOrganisationIdAndDeletedFalse(organisationId, org.springframework.data.domain.Pageable.unpaged())
                    .stream()
                    .filter(i -> i.getOverallStatus() == status)
                    .count();
            interviewsByStatus.put(status.name(), count);
        }

        // Count candidates by status
        List<Interview> allInterviews = interviewRepository.findByOrganisationIdAndDeletedFalse(
                organisationId, org.springframework.data.domain.Pageable.unpaged()).getContent();

        Long totalCandidates = allInterviews.stream()
                .map(Interview::getCandidateUserId)
                .filter(Objects::nonNull)
                .distinct()
                .count();

        Long selectedCandidates = allInterviews.stream()
                .filter(i -> i.getCandidateStatus() == CandidateStatus.SELECTED)
                .count();

        Long rejectedCandidates = allInterviews.stream()
                .filter(i -> i.getCandidateStatus() == CandidateStatus.REJECTED)
                .count();

        Long pendingCandidates = allInterviews.stream()
                .filter(i -> i.getCandidateStatus() == CandidateStatus.INVITED ||
                            i.getCandidateStatus() == CandidateStatus.INVITATION_ACCEPTED ||
                            i.getCandidateStatus() == CandidateStatus.SELECT_FOR_NEXT_ROUND)
                .count();

        return OrganisationDashboardResponse.builder()
                .organisationId(organisationId)
                .organisationName(organisation.getName())
                .totalRecruiters(totalRecruiters)
                .totalInterviewers(totalInterviewers)
                .totalInterviews(totalInterviews)
                .interviewsByStatus(interviewsByStatus)
                .totalCandidates(totalCandidates)
                .selectedCandidates(selectedCandidates)
                .rejectedCandidates(rejectedCandidates)
                .pendingCandidates(pendingCandidates)
                .build();
    }

    @Override
    public RecruiterDashboardResponse getRecruiterDashboard(String recruiterId) {
        log.debug("Fetching recruiter dashboard for: {}", recruiterId);

        String currentUserId = SecurityUtil.getCurrentUserId();

        // Verify authorization
        if (!currentUserId.equals(recruiterId)) {
            String currentRole = SecurityUtil.getCurrentUserRole();
            if (!"ROLE_ADMIN".equals(currentRole)) {
                throw new UnauthorizedException("You can only view your own dashboard");
            }
        }

        User recruiter = userRepository.findByIdAndDeletedFalse(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", recruiterId));

        if (recruiter.getRole() != UserRole.RECRUITER) {
            throw new UnauthorizedException("User is not a recruiter");
        }

        Long interviewsCreated = interviewRepository.countByCreatedByUserIdAndDeletedFalse(recruiterId);

        List<Interview> recruiterInterviews = interviewRepository.findByCreatedByUserIdAndDeletedFalse(
                recruiterId, org.springframework.data.domain.Pageable.unpaged()).getContent();

        Long candidatesInPipeline = recruiterInterviews.stream()
                .filter(i -> i.getCandidateStatus() != CandidateStatus.SELECTED &&
                            i.getCandidateStatus() != CandidateStatus.REJECTED &&
                            i.getCandidateStatus() != CandidateStatus.INVITATION_DECLINED)
                .count();

        Long upcomingInterviews = recruiterInterviews.stream()
                .filter(i -> i.getRounds().stream()
                        .anyMatch(r -> r.getScheduledDate() != null &&
                                     r.getScheduledDate().isAfter(LocalDateTime.now()) &&
                                     r.getStatus() == InterviewStatus.SCHEDULED))
                .count();

        // Count interviews by status
        Map<String, Long> interviewsByStatus = new HashMap<>();
        for (InterviewStatus status : InterviewStatus.values()) {
            Long count = recruiterInterviews.stream()
                    .filter(i -> i.getOverallStatus() == status)
                    .count();
            interviewsByStatus.put(status.name(), count);
        }

        // Count candidates by status
        Map<String, Long> candidatesByStatus = new HashMap<>();
        for (CandidateStatus status : CandidateStatus.values()) {
            Long count = recruiterInterviews.stream()
                    .filter(i -> i.getCandidateStatus() == status)
                    .count();
            candidatesByStatus.put(status.name(), count);
        }

        // Count pending decisions (rounds completed but no decision made)
        Long pendingDecisions = recruiterInterviews.stream()
                .flatMap(i -> i.getRounds().stream())
                .filter(r -> r.getStatus() == InterviewStatus.COMPLETED && r.getFinalDecision() == null)
                .count();

        return RecruiterDashboardResponse.builder()
                .recruiterId(recruiterId)
                .recruiterName(recruiter.getName())
                .interviewsCreated(interviewsCreated)
                .candidatesInPipeline(candidatesInPipeline)
                .upcomingInterviews(upcomingInterviews)
                .interviewsByStatus(interviewsByStatus)
                .candidatesByStatus(candidatesByStatus)
                .pendingDecisions(pendingDecisions)
                .build();
    }

    @Override
    public InterviewerDashboardResponse getInterviewerDashboard(String interviewerId) {
        log.debug("Fetching interviewer dashboard for: {}", interviewerId);

        String currentUserId = SecurityUtil.getCurrentUserId();

        // Verify authorization
        if (!currentUserId.equals(interviewerId)) {
            String currentRole = SecurityUtil.getCurrentUserRole();
            if (!"ROLE_ADMIN".equals(currentRole)) {
                throw new UnauthorizedException("You can only view your own dashboard");
            }
        }

        User interviewer = userRepository.findByIdAndDeletedFalse(interviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", interviewerId));

        if (interviewer.getRole() != UserRole.INTERVIEWER) {
            throw new UnauthorizedException("User is not an interviewer");
        }

        Long assignedInterviews = interviewRepository.countByInterviewerId(interviewerId);

        List<Interview> interviewerInterviews = interviewRepository.findUpcomingInterviewsByInterviewerId(
                interviewerId, LocalDateTime.now());

        Long upcomingInterviews = interviewerInterviews.stream()
                .filter(i -> i.getRounds().stream()
                        .anyMatch(r -> r.getInterviewerIds() != null &&
                                     r.getInterviewerIds().contains(interviewerId) &&
                                     r.getScheduledDate() != null &&
                                     r.getScheduledDate().isAfter(LocalDateTime.now())))
                .count();

        // Count completed interviews
        Long completedInterviews = interviewRepository.findByInterviewerId(
                interviewerId, org.springframework.data.domain.Pageable.unpaged()).stream()
                .filter(i -> i.getRounds().stream()
                        .anyMatch(r -> r.getInterviewerIds() != null &&
                                     r.getInterviewerIds().contains(interviewerId) &&
                                     r.getStatus() == InterviewStatus.COMPLETED))
                .count();

        // Count pending feedbacks
        Long pendingFeedbacks = interviewRepository.findByInterviewerId(
                interviewerId, org.springframework.data.domain.Pageable.unpaged()).stream()
                .flatMap(i -> i.getRounds().stream())
                .filter(r -> r.getInterviewerIds() != null &&
                           r.getInterviewerIds().contains(interviewerId) &&
                           r.getScheduledDate() != null &&
                           r.getScheduledDate().isBefore(LocalDateTime.now()) &&
                           r.getFeedbacks().stream().noneMatch(f -> f.getInterviewerId().equals(interviewerId)))
                .count();

        // Get upcoming schedule
        List<UpcomingInterview> upcomingSchedule = interviewerInterviews.stream()
                .flatMap(interview -> interview.getRounds().stream()
                        .filter(r -> r.getInterviewerIds() != null &&
                                   r.getInterviewerIds().contains(interviewerId) &&
                                   r.getScheduledDate() != null &&
                                   r.getScheduledDate().isAfter(LocalDateTime.now()))
                        .map(round -> {
                            String candidateName = interview.getCandidateUserId() != null ?
                                    userRepository.findByIdAndDeletedFalse(interview.getCandidateUserId())
                                            .map(User::getName)
                                            .orElse(interview.getCandidateEmail()) :
                                    interview.getCandidateEmail();

                            return UpcomingInterview.builder()
                                    .interviewId(interview.getId())
                                    .roundId(round.getRoundId())
                                    .candidateName(candidateName)
                                    .jobPosition(interview.getJobPosition())
                                    .roundType(round.getType())
                                    .scheduledDate(round.getScheduledDate())
                                    .durationMinutes(round.getDurationMinutes())
                                    .build();
                        }))
                .sorted(Comparator.comparing(UpcomingInterview::getScheduledDate))
                .limit(10)
                .collect(Collectors.toList());

        return InterviewerDashboardResponse.builder()
                .interviewerId(interviewerId)
                .interviewerName(interviewer.getName())
                .assignedInterviews(assignedInterviews)
                .upcomingInterviews(upcomingInterviews)
                .completedInterviews(completedInterviews)
                .pendingFeedbacks(pendingFeedbacks)
                .upcomingSchedule(upcomingSchedule)
                .build();
    }

    @Override
    public CandidateDashboardResponse getCandidateDashboard(String candidateId) {
        log.debug("Fetching candidate dashboard for: {}", candidateId);

        String currentUserId = SecurityUtil.getCurrentUserId();

        // Verify authorization
        if (!currentUserId.equals(candidateId)) {
            String currentRole = SecurityUtil.getCurrentUserRole();
            if (!"ROLE_ADMIN".equals(currentRole)) {
                throw new UnauthorizedException("You can only view your own dashboard");
            }
        }

        User candidate = userRepository.findByIdAndDeletedFalse(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", candidateId));

        if (candidate.getRole() != UserRole.CANDIDATE) {
            throw new UnauthorizedException("User is not a candidate");
        }

        Long totalInterviews = interviewRepository.countByCandidateUserIdAndDeletedFalse(candidateId);

        List<Interview> candidateInterviews = interviewRepository.findUpcomingInterviewsByCandidateId(
                candidateId, LocalDateTime.now());

        Long upcomingRounds = candidateInterviews.stream()
                .flatMap(i -> i.getRounds().stream())
                .filter(r -> r.getScheduledDate() != null && r.getScheduledDate().isAfter(LocalDateTime.now()))
                .count();

        // Count interviews by status
        Map<String, Long> interviewsByStatus = new HashMap<>();
        List<Interview> allCandidateInterviews = interviewRepository.findByCandidateUserIdAndDeletedFalse(
                candidateId, org.springframework.data.domain.Pageable.unpaged()).getContent();

        for (InterviewStatus status : InterviewStatus.values()) {
            Long count = allCandidateInterviews.stream()
                    .filter(i -> i.getOverallStatus() == status)
                    .count();
            interviewsByStatus.put(status.name(), count);
        }

        Long selectedCount = interviewRepository.countByCandidateUserIdAndCandidateStatusAndDeletedFalse(
                candidateId, CandidateStatus.SELECTED);
        Long rejectedCount = interviewRepository.countByCandidateUserIdAndCandidateStatusAndDeletedFalse(
                candidateId, CandidateStatus.REJECTED);
        Long inProgressCount = allCandidateInterviews.stream()
                .filter(i -> i.getCandidateStatus() == CandidateStatus.INVITATION_ACCEPTED ||
                           i.getCandidateStatus() == CandidateStatus.SELECT_FOR_NEXT_ROUND)
                .count();

        // Get upcoming schedule
        List<UpcomingInterview> upcomingSchedule = candidateInterviews.stream()
                .flatMap(interview -> interview.getRounds().stream()
                        .filter(r -> r.getScheduledDate() != null && r.getScheduledDate().isAfter(LocalDateTime.now()))
                        .map(round -> UpcomingInterview.builder()
                                .interviewId(interview.getId())
                                .roundId(round.getRoundId())
                                .candidateName(candidate.getName())
                                .jobPosition(interview.getJobPosition())
                                .roundType(round.getType())
                                .scheduledDate(round.getScheduledDate())
                                .durationMinutes(round.getDurationMinutes())
                                .build()))
                .sorted(Comparator.comparing(UpcomingInterview::getScheduledDate))
                .limit(10)
                .collect(Collectors.toList());

        return CandidateDashboardResponse.builder()
                .candidateId(candidateId)
                .candidateName(candidate.getName())
                .totalInterviews(totalInterviews)
                .upcomingRounds(upcomingRounds)
                .interviewsByStatus(interviewsByStatus)
                .selectedCount(selectedCount)
                .rejectedCount(rejectedCount)
                .inProgressCount(inProgressCount)
                .upcomingSchedule(upcomingSchedule)
                .build();
    }
}

