package interview.organiser.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for interviewer with match score
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewerMatchResponse {

    private String id;
    private String name;
    private String email;
    private String expertise;
    private String specialization;
    private Integer yearsOfExperience;
    private Integer matchScore;  // 0-100
    private Integer availableSlots;
    private String matchReason;
}

