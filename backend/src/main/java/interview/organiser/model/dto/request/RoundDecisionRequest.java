package interview.organiser.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for round decision by recruiter
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoundDecisionRequest {

    @NotBlank(message = "Decision is required")
    private String decision; // SELECT_FOR_NEXT_ROUND, SELECTED, REJECTED
}

