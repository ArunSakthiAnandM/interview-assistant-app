package com.interview.organiser.util;

import com.interview.organiser.model.dto.response.*;
import com.interview.organiser.model.entity.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class EntityMapper {

    public UserResponse toUserResponse(User user) {
        if (user == null) return null;

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    public CandidateResponse toCandidateResponse(Candidate candidate) {
        if (candidate == null) return null;

        return CandidateResponse.builder()
                .id(candidate.getId())
                .firstName(candidate.getFirstName())
                .lastName(candidate.getLastName())
                .email(candidate.getEmail())
                .phone(candidate.getPhone())
                .position(candidate.getPosition())
                .experience(candidate.getExperience())
                .skills(candidate.getSkills())
                .resumeUrl(candidate.getResumeUrl())
                .linkedinUrl(candidate.getLinkedinUrl())
                .githubUrl(candidate.getGithubUrl())
                .status(candidate.getStatus())
                .createdAt(candidate.getCreatedAt())
                .updatedAt(candidate.getUpdatedAt())
                .build();
    }

    public InterviewerResponse toInterviewerResponse(Interviewer interviewer) {
        if (interviewer == null) return null;

        return InterviewerResponse.builder()
                .id(interviewer.getId())
                .user(toUserResponse(interviewer.getUser()))
                .department(interviewer.getDepartment())
                .expertise(interviewer.getExpertise())
                .yearsOfExperience(interviewer.getYearsOfExperience())
                .availability(interviewer.getAvailability())
                .totalInterviews(interviewer.getTotalInterviews())
                .createdAt(interviewer.getCreatedAt())
                .updatedAt(interviewer.getUpdatedAt())
                .build();
    }

    public InterviewResponse toInterviewResponse(Interview interview) {
        if (interview == null) return null;

        // Map interviewers list
        List<InterviewerResponse> interviewerResponses = null;
        if (interview.getInterviewers() != null) {
            interviewerResponses = interview.getInterviewers().stream()
                    .map(this::toInterviewerResponse)
                    .collect(Collectors.toList());
        }

        return InterviewResponse.builder()
                .id(interview.getId())
                .candidate(toCandidateResponse(interview.getCandidate()))
                .interviewer(interviewerResponses != null && !interviewerResponses.isEmpty() 
                        ? interviewerResponses.get(0) : null) // Backward compatibility
                .scheduledAt(interview.getScheduledAt())
                .duration(interview.getDuration())
                .interviewType(interview.getInterviewType())
                .round(interview.getRound())
                .status(interview.getStatus())
                .meetingLink(interview.getMeetingLink())
                .notes(interview.getNotes())
                .createdAt(interview.getCreatedAt())
                .updatedAt(interview.getUpdatedAt())
                .build();
    }

    public FeedbackResponse toFeedbackResponse(Feedback feedback) {
        if (feedback == null) return null;

        return FeedbackResponse.builder()
                .id(feedback.getId())
                .interview(toInterviewResponse(feedback.getInterview()))
                .rating(feedback.getRating())
                .technicalSkills(feedback.getTechnicalSkills())
                .communicationSkills(feedback.getCommunicationSkills())
                .problemSolving(feedback.getProblemSolving())
                .culturalFit(feedback.getCulturalFit())
                .comments(feedback.getComments())
                .strengths(feedback.getStrengths())
                .weaknesses(feedback.getWeaknesses())
                .recommendation(feedback.getRecommendation())
                .submittedAt(feedback.getSubmittedAt())
                .createdAt(feedback.getCreatedAt())
                .updatedAt(feedback.getUpdatedAt())
                .build();
    }
}
