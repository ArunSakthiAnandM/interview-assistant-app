package com.interview.organiser.service.impl;

import com.interview.organiser.constants.enums.InterviewStatus;
import com.interview.organiser.constants.enums.VerificationStatus;
import com.interview.organiser.model.dto.response.*;
import com.interview.organiser.repository.*;
import com.interview.organiser.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final RecruiterRepository recruiterRepository;
    private final UserRepository userRepository;
    private final InterviewRepository interviewRepository;
    private final CandidateRepository candidateRepository;
    private final InterviewerRepository interviewerRepository;

    @Override
    public AdminDashboardResponse getAdminDashboard() {
        // Get statistics
        long totalRecruiters = recruiterRepository.count();
        long verifiedRecruiters = recruiterRepository.countByVerificationStatus(VerificationStatus.VERIFIED);
        long pendingRecruiters = recruiterRepository.countByVerificationStatus(VerificationStatus.PENDING);
        long totalUsers = userRepository.count();
        long totalInterviews = interviewRepository.count();
        long totalCandidates = candidateRepository.count();
        long activeInterviews = interviewRepository.countByStatus(InterviewStatus.SCHEDULED);

        AdminDashboardResponse.DashboardStats stats = AdminDashboardResponse.DashboardStats.builder()
                .totalRecruiters(totalRecruiters)
                .verifiedRecruiters(verifiedRecruiters)
                .pendingRecruiters(pendingRecruiters)
                .totalUsers(totalUsers)
                .totalInterviews(totalInterviews)
                .totalCandidates(totalCandidates)
                .activeInterviews(activeInterviews)
                .build();

        // Get pending and recent recruiters (mocked for now - will be implemented properly)
        List<RecruiterResponse> pendingRecruitersList = new ArrayList<>();
        List<RecruiterResponse> recentRecruitersList = new ArrayList<>();
        List<UserResponse> recentUsersList = new ArrayList<>();

        return AdminDashboardResponse.builder()
                .stats(stats)
                .pendingRecruiters(pendingRecruitersList)
                .recentRecruiters(recentRecruitersList)
                .recentUsers(recentUsersList)
                .build();
    }

    @Override
    public RecruiterDashboardResponse getRecruiterDashboard(String recruiterId) {
        // Get statistics
        long totalCandidates = candidateRepository.countByRecruiterId(recruiterId);
        long activeCandidates = candidateRepository.countByRecruiterIdAndStatusNot(recruiterId,
                com.interview.organiser.constants.enums.CandidateStatus.REJECTED);
        long totalInterviews = interviewRepository.countByRecruiterId(recruiterId);
        long upcomingInterviews = interviewRepository.countByRecruiterIdAndStatusAndScheduledAtAfter(
                recruiterId, InterviewStatus.SCHEDULED, LocalDateTime.now());
        long completedInterviews = interviewRepository.countByRecruiterIdAndStatus(
                recruiterId, InterviewStatus.COMPLETED);
        long totalInterviewers = interviewerRepository.count();
        long pendingFeedbacks = 0; // Will be calculated based on feedback status

        RecruiterDashboardResponse.DashboardStats stats = RecruiterDashboardResponse.DashboardStats.builder()
                .totalCandidates(totalCandidates)
                .activeCandidates(activeCandidates)
                .totalInterviews(totalInterviews)
                .upcomingInterviews(upcomingInterviews)
                .completedInterviews(completedInterviews)
                .totalInterviewers(totalInterviewers)
                .pendingFeedbacks(pendingFeedbacks)
                .build();

        // Get lists (mocked for now)
        List<CandidateResponse> recentCandidates = new ArrayList<>();
        List<InterviewResponse> upcomingInterviewsList = new ArrayList<>();
        List<InterviewerResponse> availableInterviewers = new ArrayList<>();

        return RecruiterDashboardResponse.builder()
                .stats(stats)
                .recentCandidates(recentCandidates)
                .upcomingInterviews(upcomingInterviewsList)
                .availableInterviewers(availableInterviewers)
                .build();
    }

    @Override
    public InterviewerDashboardResponse getInterviewerDashboard(String interviewerId) {
        // Get interviewer
        var interviewer = interviewerRepository.findById(interviewerId)
                .orElseThrow(() -> new RuntimeException("Interviewer not found"));

        // Get statistics
        long totalInterviews = interviewer.getTotalInterviews();
        long upcomingInterviews = 0; // Count interviews where this interviewer is assigned and scheduled
        long completedInterviews = 0; // Count completed interviews
        long pendingFeedbacks = 0; // Count interviews needing feedback
        Boolean availability = interviewer.getAvailability();

        InterviewerDashboardResponse.DashboardStats stats = InterviewerDashboardResponse.DashboardStats.builder()
                .totalInterviews(totalInterviews)
                .upcomingInterviews(upcomingInterviews)
                .completedInterviews(completedInterviews)
                .pendingFeedbacks(pendingFeedbacks)
                .availability(availability)
                .build();

        // Get lists (mocked for now)
        List<InterviewResponse> assignedInterviews = new ArrayList<>();
        List<InterviewResponse> upcomingInterviewsList = new ArrayList<>();
        List<InterviewResponse> pendingFeedbackList = new ArrayList<>();

        return InterviewerDashboardResponse.builder()
                .stats(stats)
                .assignedInterviews(assignedInterviews)
                .upcomingInterviews(upcomingInterviewsList)
                .pendingFeedback(pendingFeedbackList)
                .build();
    }

    @Override
    public CandidateDashboardResponse getCandidateDashboard(String candidateId) {
        // Get candidate
        var candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        // Get statistics
        long totalInterviews = 0; // Count all interviews for this candidate
        long upcomingInterviews = 0; // Count scheduled interviews in the future
        long completedInterviews = 0; // Count completed interviews
        long pendingConfirmations = 0; // Count interviews awaiting confirmation
        String currentStatus = candidate.getStatus().toString();

        CandidateDashboardResponse.DashboardStats stats = CandidateDashboardResponse.DashboardStats.builder()
                .totalInterviews(totalInterviews)
                .upcomingInterviews(upcomingInterviews)
                .completedInterviews(completedInterviews)
                .pendingConfirmations(pendingConfirmations)
                .currentStatus(currentStatus)
                .build();

        // Get lists (mocked for now)
        List<InterviewResponse> upcomingInterviewsList = new ArrayList<>();
        List<InterviewResponse> pastInterviews = new ArrayList<>();
        List<InterviewResponse> pendingConfirmationsList = new ArrayList<>();

        return CandidateDashboardResponse.builder()
                .stats(stats)
                .upcomingInterviews(upcomingInterviewsList)
                .pastInterviews(pastInterviews)
                .pendingConfirmations(pendingConfirmationsList)
                .build();
    }
}

