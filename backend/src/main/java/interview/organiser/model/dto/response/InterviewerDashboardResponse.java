package interview.organiser.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for interviewer dashboard response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewerDashboardResponse {

    private String interviewerId;
    private String interviewerName;
    private Long assignedInterviews;
    private Long upcomingInterviews;
    private Long completedInterviews;
    private Long pendingFeedbacks;
    private List<UpcomingInterview> upcomingSchedule;
}

