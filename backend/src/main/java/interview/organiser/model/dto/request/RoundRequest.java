package interview.organiser.model.dto.request;

import interview.organiser.constants.InterviewType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for interview round information
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoundRequest {

    @NotNull(message = "Round number is required")
    @Min(value = 1, message = "Round number must be at least 1")
    private Integer roundNumber;

    @NotNull(message = "Interview type is required")
    private InterviewType type;

    private LocalDateTime scheduledDate;

    @Min(value = 1, message = "Duration must be at least 1 minute")
    private Integer durationMinutes;

    private List<String> interviewerIds;
}

