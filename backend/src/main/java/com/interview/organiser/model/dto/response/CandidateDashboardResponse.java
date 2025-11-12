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
public class CandidateDashboardResponse {

    private DashboardStats stats;
    private List<InterviewResponse> upcomingInterviews;
    private List<InterviewResponse> pastInterviews;
    private List<InterviewResponse> pendingConfirmations;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DashboardStats {
        private Long totalInterviews;
        private Long upcomingInterviews;
        private Long completedInterviews;
        private Long pendingConfirmations;
        private String currentStatus;
    }
}

