package interview.organiser.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * DTO for organisation dashboard response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganisationDashboardResponse {

    private String organisationId;
    private String organisationName;
    private Long totalRecruiters;
    private Long totalInterviewers;
    private Long totalInterviews;
    private Map<String, Long> interviewsByStatus;
    private Long totalCandidates;
    private Long selectedCandidates;
    private Long rejectedCandidates;
    private Long pendingCandidates;
}

