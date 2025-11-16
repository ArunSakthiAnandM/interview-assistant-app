package interview.organiser.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * DTO for candidate dashboard response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateDashboardResponse {

    private String candidateId;
    private String candidateName;
    private Long totalInterviews;
    private Long upcomingRounds;
    private Map<String, Long> interviewsByStatus;
    private Long selectedCount;
    private Long rejectedCount;
    private Long inProgressCount;
    private List<UpcomingInterview> upcomingSchedule;
}

