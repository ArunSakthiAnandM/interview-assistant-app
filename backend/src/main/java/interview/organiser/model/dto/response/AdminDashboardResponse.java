package interview.organiser.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * DTO for admin dashboard response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {

    private Long totalOrganisations;
    private Long verifiedOrganisations;
    private Long pendingVerifications;
    private Long rejectedOrganisations;
    private Long totalUsers;
    private Map<String, Long> usersByRole;
    private Long totalInterviews;
    private Map<String, Long> interviewsByStatus;
}

