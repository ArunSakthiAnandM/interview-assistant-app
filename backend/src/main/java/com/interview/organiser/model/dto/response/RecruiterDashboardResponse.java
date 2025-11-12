package com.interview.organiser.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecruiterDashboardResponse {

    private DashboardStats stats;
    private List<CandidateResponse> recentCandidates;
    private List<InterviewResponse> upcomingInterviews;
    private List<InterviewerResponse> availableInterviewers;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DashboardStats {
        private Long totalCandidates;
        private Long activeCandidates;
        private Long totalInterviews;
        private Long upcomingInterviews;
        private Long completedInterviews;
        private Long totalInterviewers;
        private Long pendingFeedbacks;
    }
}

