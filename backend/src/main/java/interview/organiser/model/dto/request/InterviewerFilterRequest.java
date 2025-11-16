package interview.organiser.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for interviewer filtering
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewerFilterRequest {

    private List<String> skills;

    private Integer minExperience;

    private Integer maxExperience;

    private LocalDateTime availabilityStartDate;

    private LocalDateTime availabilityEndDate;

    private String specialization;
}

