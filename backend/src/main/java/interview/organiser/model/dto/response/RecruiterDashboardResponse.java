package interview.organiser.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * DTO for recruiter dashboard response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecruiterDashboardResponse {

    private String recruiterId;
    private String recruiterName;
    private Long interviewsCreated;
    private Long candidatesInPipeline;
    private Long upcomingInterviews;
    private Map<String, Long> interviewsByStatus;
    private Map<String, Long> candidatesByStatus;
    private Long pendingDecisions;
}

