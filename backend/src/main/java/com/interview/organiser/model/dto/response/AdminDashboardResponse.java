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
public class AdminDashboardResponse {

    private DashboardStats stats;
    private List<RecruiterResponse> pendingRecruiters;
    private List<RecruiterResponse> recentRecruiters;
    private List<UserResponse> recentUsers;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DashboardStats {
        private Long totalRecruiters;
        private Long verifiedRecruiters;
        private Long pendingRecruiters;
        private Long totalUsers;
        private Long totalInterviews;
        private Long totalCandidates;
        private Long activeInterviews;
    }
}

