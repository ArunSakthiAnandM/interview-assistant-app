package interview.organiser.util;

import interview.organiser.model.dto.response.*;
import interview.organiser.model.entity.*;
import interview.organiser.repository.OrganisationRepository;
import interview.organiser.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper utility for converting entities to DTOs
 */
@Component
@RequiredArgsConstructor
public class EntityMapper {

    private final OrganisationRepository organisationRepository;
    private final UserRepository userRepository;

    public UserResponse toUserResponse(User user) {
        if (user == null) return null;

        String organisationName = null;
        if (user.getOrganisationId() != null) {
            organisationName = organisationRepository.findByIdAndDeletedFalse(user.getOrganisationId())
                    .map(Organisation::getName)
                    .orElse(null);
        }

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .role(user.getRole())
                .skills(user.getSkills())
                .experience(user.getExperience())
                .expertise(user.getExpertise())
                .yearsOfExperience(user.getYearsOfExperience())
                .specialization(user.getSpecialization())
                .resumeUrl(user.getResumeUrl())
                .expectedSalary(user.getExpectedSalary())
                .organisationId(user.getOrganisationId())
                .organisationName(organisationName)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    public OrganisationResponse toOrganisationResponse(Organisation organisation) {
        if (organisation == null) return null;

        return OrganisationResponse.builder()
                .id(organisation.getId())
                .name(organisation.getName())
                .adminEmail(organisation.getAdminEmail())
                .adminUserId(organisation.getAdminUserId())
                .kycDocumentUrl(organisation.getKycDocumentUrl())
                .verificationStatus(organisation.getVerificationStatus())
                .verifiedBy(organisation.getVerifiedBy())
                .verifiedAt(organisation.getVerifiedAt())
                .rejectionReason(organisation.getRejectionReason())
                .createdAt(organisation.getCreatedAt())
                .updatedAt(organisation.getUpdatedAt())
                .build();
    }

    public InvitationResponse toInvitationResponse(Invitation invitation) {
        if (invitation == null) return null;

        String organisationName = null;
        if (invitation.getOrganisationId() != null) {
            organisationName = organisationRepository.findByIdAndDeletedFalse(invitation.getOrganisationId())
                    .map(Organisation::getName)
                    .orElse(null);
        }

        return InvitationResponse.builder()
                .id(invitation.getId())
                .email(invitation.getEmail())
                .organisationId(invitation.getOrganisationId())
                .organisationName(organisationName)
                .interviewId(invitation.getInterviewId())
                .invitedRole(invitation.getInvitedRole())
                .status(invitation.getStatus())
                .expiryDays(invitation.getExpiryDays())
                .expiryDate(invitation.getExpiryDate())
                .invitedBy(invitation.getInvitedBy())
                .createdAt(invitation.getCreatedAt())
                .build();
    }

    public InterviewResponse toInterviewResponse(Interview interview) {
        if (interview == null) return null;

        String organisationName = organisationRepository.findByIdAndDeletedFalse(interview.getOrganisationId())
                .map(Organisation::getName)
                .orElse(null);

        String candidateName = interview.getCandidateUserId() != null ?
                userRepository.findByIdAndDeletedFalse(interview.getCandidateUserId())
                        .map(User::getName)
                        .orElse(null) : null;

        List<RoundResponse> roundResponses = interview.getRounds() != null ?
                interview.getRounds().stream()
                        .map(this::toRoundResponse)
                        .collect(Collectors.toList()) : null;

        return InterviewResponse.builder()
                .id(interview.getId())
                .organisationId(interview.getOrganisationId())
                .organisationName(organisationName)
                .jobPosition(interview.getJobPosition())
                .jobDescription(interview.getJobDescription())
                .candidateEmail(interview.getCandidateEmail())
                .candidateUserId(interview.getCandidateUserId())
                .candidateName(candidateName)
                .candidateStatus(interview.getCandidateStatus())
                .overallStatus(interview.getOverallStatus())
                .rounds(roundResponses)
                .createdByUserId(interview.getCreatedByUserId())
                .createdByName(interview.getCreatedByName())
                .createdAt(interview.getCreatedAt())
                .updatedAt(interview.getUpdatedAt())
                .build();
    }

    public RoundResponse toRoundResponse(InterviewRound round) {
        if (round == null) return null;

        List<InterviewerInfo> interviewerInfos = round.getInterviewerIds() != null ?
                round.getInterviewerIds().stream()
                        .map(this::toInterviewerInfo)
                        .collect(Collectors.toList()) : null;

        List<FeedbackResponse> feedbackResponses = round.getFeedbacks() != null ?
                round.getFeedbacks().stream()
                        .map(this::toFeedbackResponse)
                        .collect(Collectors.toList()) : null;

        String decisionByName = round.getDecisionBy() != null ?
                userRepository.findByIdAndDeletedFalse(round.getDecisionBy())
                        .map(User::getName)
                        .orElse(null) : null;

        return RoundResponse.builder()
                .roundId(round.getRoundId())
                .roundNumber(round.getRoundNumber())
                .type(round.getType())
                .status(round.getStatus())
                .scheduledDate(round.getScheduledDate())
                .durationMinutes(round.getDurationMinutes())
                .interviewers(interviewerInfos)
                .feedbacks(feedbackResponses)
                .finalDecision(round.getFinalDecision())
                .decisionBy(round.getDecisionBy())
                .decisionByName(decisionByName)
                .decisionAt(round.getDecisionAt())
                .autoRecommendation(round.getAutoRecommendation())
                .createdAt(round.getCreatedAt())
                .updatedAt(round.getUpdatedAt())
                .build();
    }

    private InterviewerInfo toInterviewerInfo(String interviewerId) {
        return userRepository.findByIdAndDeletedFalse(interviewerId)
                .map(user -> InterviewerInfo.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .expertise(user.getExpertise())
                        .build())
                .orElse(null);
    }

    private FeedbackResponse toFeedbackResponse(InterviewerFeedback feedback) {
        if (feedback == null) return null;

        return FeedbackResponse.builder()
                .interviewerId(feedback.getInterviewerId())
                .interviewerName(feedback.getInterviewerName())
                .recommendation(feedback.getRecommendation())
                .rating(feedback.getRating())
                .comments(feedback.getComments())
                .submittedAt(feedback.getSubmittedAt())
                .build();
    }
}

